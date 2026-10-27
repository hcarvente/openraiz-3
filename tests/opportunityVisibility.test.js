import test from "node:test";
import assert from "node:assert/strict";
import { PUBLIC_WHERE, isPubliclyVisible } from "../lib/opportunityVisibility.js";
import { serializePublicOpportunity, serializeOpportunity } from "../lib/serializeOpportunity.js";
import { toPatchBody, toRequestBody, emptyOpportunityValues, parseSkillsText } from "../lib/opportunityOptions.js";

test("only approved listings that are not archived are public", () => {
  assert.equal(isPubliclyVisible({ approvalStatus: "approved", status: "active" }), true);
  assert.equal(isPubliclyVisible({ approvalStatus: "approved", status: "filled" }), true);
  assert.equal(isPubliclyVisible({ approvalStatus: "approved", status: "archived" }), false);
  assert.equal(isPubliclyVisible({ approvalStatus: "pending", status: "active" }), false);
  assert.equal(isPubliclyVisible({ approvalStatus: "rejected", status: "active" }), false);
  assert.equal(isPubliclyVisible({ status: "active" }), false); // a missing approval is not public
  assert.equal(isPubliclyVisible(null), false);
});

test("the database filter says the same thing", () => {
  assert.deepEqual(PUBLIC_WHERE, { approvalStatus: "approved", status: { not: "archived" } });
});

const row = {
  id: "abc", title: "T", datePosted: new Date("2026-10-01T00:00:00Z"), deadline: null, eventDate: new Date("2026-11-20T00:00:00Z"),
  lastUpdated: new Date("2026-10-02T00:00:00Z"), createdAt: new Date("2026-10-01T10:00:00Z"),
  ownerUserId: "user-123", approvalStatus: "approved", rejectionReason: "private note",
};

test("public output hides the owner, approval state and rejection reason; admin output keeps them", () => {
  const publicRow = serializePublicOpportunity(row);
  for (const field of ["ownerUserId", "approvalStatus", "rejectionReason"]) assert.equal(field in publicRow, false, field);
  assert.equal(publicRow.eventDate, "2026-11-20");
  assert.equal(publicRow.title, "T");
  const adminRow = serializeOpportunity(row);
  assert.equal(adminRow.ownerUserId, "user-123");
});

test("skills typed as text become a clean list, and unchanged lists are not sent in an edit", () => {
  assert.deepEqual(parseSkillsText(" a, b ,, c "), ["a", "b", "c"]);
  const before = { ...emptyOpportunityValues(), skills: "a, b", type: "job" };
  assert.deepEqual(toPatchBody(before, { ...before }), {});
  assert.deepEqual(toPatchBody(before, { ...before, skills: "a, b, c" }), { skills: ["a", "b", "c"] });
  assert.deepEqual(toPatchBody(before, { ...before, skills: "" }), { skills: [] });
});

test("the event date is sent only for workshops and events", () => {
  const base = { ...emptyOpportunityValues(), eventDate: "2026-11-20", paid: "no", locationType: "remote" };
  assert.equal(toRequestBody({ ...base, type: "event" }).eventDate, "2026-11-20");
  assert.equal("eventDate" in toRequestBody({ ...base, type: "job" }), false);
});
