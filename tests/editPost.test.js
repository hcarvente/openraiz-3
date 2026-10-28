import test from "node:test";
import assert from "node:assert/strict";
import { editPost, withdrawPost } from "../lib/editPost.js";
import { listingState } from "../lib/listingState.js";
import { buildPostBody, valuesFromListing } from "../lib/postFormValues.js";
import { validatePost } from "../lib/validatePost.js";

const person = { role: "individual", displayName: "Ana Ruiz", orgName: null };
const org = { role: "organization", displayName: "Luz", orgName: "Raiz Collective" };
const verified = (profile, id = "user-1") => ({ user: { id }, profile, isVerified: true, isAdmin: false });
const DATE = new Date("2026-10-01T00:00:00Z");

// A saved listing as the database returns it.
const row = (extra = {}) => ({
  id: "abc", ownerUserId: "user-1", source: "user-posted", status: "active", approvalStatus: "approved", rejectionReason: null,
  type: "workshop", title: "Resume workshop", description: "Bring your resume.", summary: null, requirements: null, skills: [],
  category: null, commitment: null, city: null, state: null, locationType: "remote", isPaid: false, compensation: "Free",
  datePosted: DATE, deadline: null, eventDate: new Date("2026-11-20T00:00:00Z"), applyMethodType: "platform", applyMethodValue: "",
  livedExperienceRelevance: "welcomed", originalLang: "en", titleTr: "Taller", summaryTr: null, descriptionTr: "Traiga su CV.",
  requirementsTr: null, translationStatus: "approved", ...extra,
});

const answers = { type: "workshop", title: "Resume workshop", description: "Bring your resume.", lang: "en", paid: "no", eventDate: "2026-11-20", locationType: "remote", guidelines: true };

const deps = (existing, pending = 0) => {
  const updates = [];
  return {
    updates,
    loadOwned: async (id, userId) => (existing && id === existing.id && userId === existing.ownerUserId ? existing : null),
    countPending: async () => pending,
    updateListing: async (id, data) => { updates.push({ id, data }); },
    archiveListing: async (id) => { updates.push({ id, archived: true }); },
  };
};
const edit = (current, body, d, id = "abc") => editPost({ current, id, body, ...d });

test("the same gates as posting: signed out 401, unverified 403, no profile 403", async () => {
  const d = deps(row());
  assert.equal((await edit(null, answers, d)).status, 401);
  assert.equal((await edit({ ...verified(person), isVerified: false }, answers, d)).status, 403);
  assert.equal((await edit(verified(null), answers, d)).status, 403);
  assert.equal(d.updates.length, 0);
});

test("a listing that is not yours looks exactly like one that does not exist", async () => {
  const d = deps(row());
  const stranger = await edit(verified(person, "someone-else"), answers, d);
  const missing = await edit(verified(person), answers, d, "no-such-id");
  assert.deepEqual(stranger, { status: 404, body: { error: "notFound" } });
  assert.deepEqual(missing, stranger);
  assert.equal((await edit(verified(person), answers, d, "a b")).status, 404);
  assert.equal(d.updates.length, 0);
});

test("a withdrawn listing cannot be edited", async () => {
  const d = deps(row({ status: "archived" }));
  assert.deepEqual(await edit(verified(person), answers, d), { status: 409, body: { error: "withdrawn" } });
  assert.equal(d.updates.length, 0);
});

test("saving a change sends an approved listing back to review and clears any rejection reason", async () => {
  const d = deps(row({ approvalStatus: "approved" }));
  const result = await edit(verified(person), { ...answers, eventDate: "2026-12-05" }, d);
  assert.deepEqual(result, { status: 200, body: { id: "abc", approvalStatus: "pending" } });
  const data = d.updates[0].data;
  assert.equal(data.approvalStatus, "pending");
  assert.equal(data.rejectionReason, null);
  assert.equal(data.eventDate.toISOString().slice(0, 10), "2026-12-05");
  const rejected = deps(row({ approvalStatus: "rejected", rejectionReason: "Please add a date." }));
  await edit(verified(person), answers, rejected);
  assert.equal(rejected.updates[0].data.approvalStatus, "pending");
  assert.equal(rejected.updates[0].data.rejectionReason, null);
});

test("the poster, owner, source, status and posting date can never be changed by an edit", async () => {
  const d = deps(row());
  await edit(verified(person), answers, d);
  const data = d.updates[0].data;
  for (const field of ["ownerUserId", "source", "status", "id"]) assert.equal(field in data, false, field);
  assert.equal(data.datePosted.toISOString().slice(0, 10), "2026-10-01"); // the original date, not today
  for (const field of ["approvalStatus", "ownerUserId", "source", "status", "titleTr", "translationStatus", "datePosted"]) {
    const result = await edit(verified(person), { ...answers, [field]: "x" }, deps(row()));
    assert.equal(result.status, 400, field);
  }
});

test("changed text clears the saved translation; other changes keep it", async () => {
  const keep = deps(row());
  await edit(verified(person), { ...answers, eventDate: "2026-12-05" }, keep);
  assert.equal("translationStatus" in keep.updates[0].data, false);
  assert.equal("titleTr" in keep.updates[0].data, false);

  for (const change of [{ title: "A new title" }, { description: "New words." }, { summary: "A summary" }, { requirements: "Bring ID" }, { lang: "es" }]) {
    const d = deps(row());
    await edit(verified(person), { ...answers, ...change }, d);
    const data = d.updates[0].data;
    assert.equal(data.translationStatus, "none", JSON.stringify(change));
    for (const field of ["titleTr", "summaryTr", "descriptionTr", "requirementsTr"]) assert.equal(data[field], null);
  }
});

test("the role limits still apply: an individual cannot turn a workshop into a job", async () => {
  const d = deps(row());
  const result = await edit(verified(person), { ...answers, type: "job", eventDate: undefined }, d);
  assert.equal(result.status, 400);
  assert.deepEqual(result.body.details.map((e) => e.code), ["notAllowed"]);
  assert.equal(d.updates.length, 0);
  assert.equal((await edit(verified(org), { ...answers, type: "volunteer", eventDate: undefined }, deps(row({ type: "workshop" })))).status, 200);
});

test("a listing that returns to review counts against the limit of five; one already pending does not", async () => {
  assert.equal((await edit(verified(person), answers, deps(row({ approvalStatus: "approved" }), 5))).status, 429);
  assert.equal((await edit(verified(person), answers, deps(row({ approvalStatus: "rejected" }), 5))).status, 429);
  assert.equal((await edit(verified(person), answers, deps(row({ approvalStatus: "approved" }), 4))).status, 200);
  assert.equal((await edit(verified(person), answers, deps(row({ approvalStatus: "pending" }), 5))).status, 200);
});

test("a bad body is refused with codes and nothing is saved", async () => {
  const d = deps(row());
  const result = await edit(verified(person), { ...answers, title: "" }, d);
  assert.equal(result.status, 400);
  assert.deepEqual(result.body.details, [{ field: "title", code: "required" }]);
  assert.equal((await edit(verified(person), undefined, d)).status, 400);
  assert.equal(d.updates.length, 0);
});

test("withdrawing archives the listing; only the owner can; doing it twice is fine", async () => {
  const d = deps(row());
  assert.deepEqual(await withdrawPost({ current: verified(person), id: "abc", ...d }), { status: 200, body: { id: "abc", status: "archived" } });
  assert.deepEqual(d.updates, [{ id: "abc", archived: true }]);
  const again = deps(row({ status: "archived" }));
  assert.equal((await withdrawPost({ current: verified(person), id: "abc", ...again })).status, 200);
  assert.equal(again.updates.length, 0);
  assert.equal((await withdrawPost({ current: verified(person, "other"), id: "abc", ...deps(row()) })).status, 404);
  assert.equal((await withdrawPost({ current: null, id: "abc", ...deps(row()) })).status, 401);
});

test("the poster sees an honest state for each listing", () => {
  assert.equal(listingState(row({ approvalStatus: "pending" })), "pending");
  assert.equal(listingState(row({ approvalStatus: "rejected" })), "rejected");
  assert.equal(listingState(row({ approvalStatus: "approved" })), "live");
  assert.equal(listingState(row({ approvalStatus: "approved", status: "filled" })), "filled");
  assert.equal(listingState(row({ approvalStatus: "approved", status: "archived" })), "withdrawn");
  assert.equal(listingState(row({ approvalStatus: "pending", status: "archived" })), "withdrawn");
  assert.equal(listingState(row({ approvalStatus: "weird" })), "pending");
});

test("a saved listing loaded into the form and saved again comes out the same", () => {
  const samples = [
    { profile: person, answers },
    { profile: person, answers: { ...answers, lang: "es", paid: "yes", payNote: "$20 por persona", summary: "Resumen", skills: ["a", "b"], category: "Education", commitment: "2 horas", relevance: "relevant" } },
    { profile: org, answers: { type: "volunteer", title: "Mentor circle host", description: "Host a circle.", lang: "en", paid: "no", deadline: "2026-12-01", locationType: "onsite", city: "Oakland", state: "CA", applyMethodType: "email", applyMethodValue: "hello@example.org", requirements: "Reliable.", guidelines: true } },
    { profile: org, answers: { type: "job", title: "Coordinator", description: "Full-time.", lang: "en", paid: "yes", payNote: "$52,000/yr", locationType: "remote", applyMethodType: "url", applyMethodValue: "https://example.org/apply", guidelines: true } },
  ];
  for (const { profile, answers: input } of samples) {
    const first = validatePost(input, profile, "2026-10-01");
    assert.equal(first.ok, true, JSON.stringify(first.errors));
    const saved = { ...first.data, id: "x", skills: first.data.skills };
    const form = valuesFromListing(saved);
    assert.equal(form.guidelines, false); // must be ticked again
    const second = validatePost(buildPostBody({ ...form, guidelines: true }, saved.originalLang), profile, "2026-10-01");
    assert.equal(second.ok, true, JSON.stringify(second.errors));
    assert.deepEqual(second.data, first.data);
  }
});

test("the default pay words are not shown back as a note, but a real note is", () => {
  assert.equal(valuesFromListing(row({ compensation: "Free" })).payNote, "");
  assert.equal(valuesFromListing(row({ compensation: "Gratis" })).payNote, "");
  assert.equal(valuesFromListing(row({ compensation: "$20 per person" })).payNote, "$20 per person");
});
