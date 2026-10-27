import test from "node:test";
import assert from "node:assert/strict";
import { validateOpportunity } from "../lib/validateOpportunity.js";
import { validateOpportunityUpdate } from "../lib/validateOpportunityUpdate.js";

const valid = {
  title: "Youth Leadership Fellow",
  organization: "Community Foundation",
  description: "A year-long fellowship.",
  type: "fellowship",
  livedExperienceRelevance: "preferred",
  locationType: "remote",
  isPaid: true,
  compensation: "Paid, $24/hr",
  datePosted: "2026-10-01",
  applyMethodType: "url",
  applyMethodValue: "https://example.org/apply",
};
const fields = (result) => result.errors.map((e) => e.field);

test("a listing with none of the new optional fields is still valid, with empty values", () => {
  const result = validateOpportunity(valid);
  assert.equal(result.ok, true);
  assert.deepEqual(result.data.skills, []);
  for (const field of ["summary", "requirements", "category", "commitment", "eventDate"]) assert.equal(result.data[field], null);
});

test("the three new types are accepted and an unknown type is not", () => {
  for (const type of ["workshop", "event", "resource"]) {
    assert.equal(validateOpportunity({ ...valid, type }).ok, true, type);
  }
  assert.equal(validateOpportunity({ ...valid, type: "mentoring" }).ok, false);
});

test("an event date is allowed for workshops and events only", () => {
  assert.equal(validateOpportunity({ ...valid, type: "workshop", eventDate: "2026-11-20" }).ok, true);
  assert.equal(validateOpportunity({ ...valid, type: "event", eventDate: "2026-11-20" }).ok, true);
  for (const type of ["job", "internship", "fellowship", "volunteer", "resource"]) {
    const result = validateOpportunity({ ...valid, type, eventDate: "2026-11-20" });
    assert.equal(result.ok, false, type);
    assert.deepEqual(fields(result), ["eventDate"]);
  }
  assert.equal(validateOpportunity({ ...valid, type: "event", eventDate: "2026-02-30" }).ok, false);
  assert.equal(validateOpportunity({ ...valid, type: "event", eventDate: null }).ok, true);
});

test("category must be on the list", () => {
  assert.equal(validateOpportunity({ ...valid, category: "Education" }).data.category, "Education");
  assert.equal(validateOpportunity({ ...valid, category: "Crypto" }).ok, false);
  assert.equal(validateOpportunity({ ...valid, category: 5 }).ok, false);
});

test("skills are trimmed, de-duplicated, and limited in number and length", () => {
  const ok = validateOpportunity({ ...valid, skills: [" Speaking ", "speaking", "", "Writing"] });
  assert.deepEqual(ok.data.skills, ["Speaking", "Writing"]);
  assert.equal(validateOpportunity({ ...valid, skills: "speaking" }).ok, false);
  assert.equal(validateOpportunity({ ...valid, skills: [1] }).ok, false);
  assert.equal(validateOpportunity({ ...valid, skills: ["x".repeat(51)] }).ok, false);
  assert.equal(validateOpportunity({ ...valid, skills: Array.from({ length: 16 }, (_, i) => `skill ${i}`) }).ok, false);
  assert.equal(validateOpportunity({ ...valid, skills: Array.from({ length: 15 }, (_, i) => `skill ${i}`) }).ok, true);
});

test("summary, requirements and commitment have length limits", () => {
  assert.equal(validateOpportunity({ ...valid, summary: "x".repeat(280) }).ok, true);
  assert.equal(validateOpportunity({ ...valid, summary: "x".repeat(281) }).ok, false);
  assert.equal(validateOpportunity({ ...valid, requirements: "x".repeat(3001) }).ok, false);
  assert.equal(validateOpportunity({ ...valid, commitment: "x".repeat(101) }).ok, false);
});

test("a request can never set who owns a listing or whether it is approved", () => {
  for (const field of ["approvalStatus", "rejectionReason", "ownerUserId"]) {
    const result = validateOpportunity({ ...valid, [field]: "approved" });
    assert.equal(result.ok, false, field);
    assert.deepEqual(fields(result), [field]);
  }
});

// ----- updates

const stored = {
  ...valid,
  id: "abc",
  legacyId: null,
  status: "active",
  city: null,
  state: null,
  address: null,
  deadline: null,
  summary: null,
  requirements: null,
  skills: [],
  category: null,
  commitment: null,
  eventDate: null,
  datePosted: new Date("2026-10-01T00:00:00Z"),
  lastUpdated: new Date("2026-10-01T00:00:00Z"),
  createdAt: new Date("2026-10-01T10:00:00Z"),
  source: "owner-added",
  approvalStatus: "approved",
  rejectionReason: null,
  ownerUserId: "someone",
};

test("an update can set and clear the new fields", () => {
  const set = validateOpportunityUpdate({ summary: "A short blurb", skills: ["a", "b"], category: "Education" }, stored);
  assert.equal(set.ok, true);
  assert.deepEqual(Object.keys(set.data).sort(), ["category", "skills", "summary"]);

  const cleared = validateOpportunityUpdate({ summary: null, skills: null, category: null }, { ...stored, summary: "x", skills: ["a"], category: "Education" });
  assert.equal(cleared.ok, true);
  assert.deepEqual(cleared.data, { summary: null, skills: [], category: null });
});

test("an update cannot touch ownership or approval", () => {
  for (const field of ["approvalStatus", "rejectionReason", "ownerUserId"]) {
    assert.equal(validateOpportunityUpdate({ [field]: "x" }, stored).ok, false, field);
  }
});

test("changing a workshop into a job needs the event date cleared in the same request", () => {
  const withDate = { ...stored, type: "workshop", eventDate: new Date("2026-11-20T00:00:00Z") };
  assert.equal(validateOpportunityUpdate({ type: "job" }, withDate).ok, false);
  assert.equal(validateOpportunityUpdate({ type: "job", eventDate: null }, withDate).ok, true);
});
