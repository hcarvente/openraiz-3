import test from "node:test";
import assert from "node:assert/strict";
import { approveListing, rejectListing, saveTranslation, validateTranslation } from "../lib/moderation.js";
import { searchableTranslation, translatedView } from "../lib/translation.js";
import { serializePublicOpportunity } from "../lib/serializeOpportunity.js";

const listing = (extra = {}) => ({ id: "abc", status: "active", approvalStatus: "pending", ...extra });
const deps = (existing) => {
  const updates = [];
  return { updates, loadListing: async (id) => (existing && id === existing.id ? existing : null), update: async (id, data) => { updates.push({ id, data }); } };
};
const tr = { title: "Taller de currículum", description: "Traiga su currículum.", summary: "Un taller.", requirements: "Traer identificación." };

test("a translation needs a title and a description; summary and requirements are optional", () => {
  const ok = validateTranslation({ title: " Taller ", description: "Texto" });
  assert.equal(ok.ok, true);
  assert.deepEqual(ok.data, { titleTr: "Taller", summaryTr: null, descriptionTr: "Texto", requirementsTr: null, translationStatus: "approved" });
  const bad = validateTranslation({ title: "", description: "  " });
  assert.deepEqual(bad.errors.map((e) => e.field).sort(), ["description", "title"]);
  assert.equal(validateTranslation({ title: "x".repeat(201), description: "y" }).ok, false);
  assert.equal(validateTranslation({ title: "t", description: "y".repeat(5001) }).ok, false);
  assert.equal(validateTranslation({ title: "t", description: "d", summary: "s".repeat(281) }).ok, false);
  assert.equal(validateTranslation({ title: "t", description: "d", requirements: "r".repeat(3001) }).ok, false);
  assert.equal(validateTranslation({ title: 5, description: "d" }).ok, false);
  assert.equal(validateTranslation({ title: "t", description: "d", translationStatus: "approved" }).ok, false); // not a field the admin sets
  assert.equal(validateTranslation({ title: "t", description: "d", originalLang: "en" }).ok, false);
  assert.equal(validateTranslation(null).ok, false);
  assert.equal(validateTranslation([]).ok, false);
});

test("approving a pending listing publishes it and clears any old reason", async () => {
  const d = deps(listing());
  assert.deepEqual(await approveListing({ id: "abc", ...d }), { status: 200, body: { id: "abc", approvalStatus: "approved" } });
  assert.deepEqual(d.updates[0].data, { approvalStatus: "approved", rejectionReason: null });
});

test("approving with a translation saves the translation as approved in the same step", async () => {
  const d = deps(listing());
  const result = await approveListing({ id: "abc", translation: tr, ...d });
  assert.equal(result.status, 200);
  assert.equal(d.updates[0].data.approvalStatus, "approved");
  assert.equal(d.updates[0].data.titleTr, "Taller de currículum");
  assert.equal(d.updates[0].data.translationStatus, "approved");
  // An empty translation form means "no translation", not an error.
  const none = deps(listing());
  assert.equal((await approveListing({ id: "abc", translation: { title: "", description: "", summary: "", requirements: "" }, ...none })).status, 200);
  assert.equal("titleTr" in none.updates[0].data, false);
  // A half-filled one is refused and nothing is approved.
  const half = deps(listing());
  const refused = await approveListing({ id: "abc", translation: { title: "Solo título" }, ...half });
  assert.equal(refused.status, 400);
  assert.equal(half.updates.length, 0);
});

test("only a listing waiting for review can be approved; a pending or approved one can be rejected", async () => {
  for (const approvalStatus of ["approved", "rejected"]) {
    const d = deps(listing({ approvalStatus }));
    assert.equal((await approveListing({ id: "abc", ...d })).status, 409, approvalStatus);
    assert.equal(d.updates.length, 0);
  }
  const rejected = deps(listing({ approvalStatus: "rejected" }));
  assert.equal((await rejectListing({ id: "abc", reason: "No", ...rejected })).status, 409); // already rejected
  assert.equal(rejected.updates.length, 0);
  const takeDown = deps(listing({ approvalStatus: "approved" }));
  assert.equal((await rejectListing({ id: "abc", reason: "Reported as a scam.", ...takeDown })).status, 200); // taken down
  assert.deepEqual(takeDown.updates[0].data, { approvalStatus: "rejected", rejectionReason: "Reported as a scam." });
  const withdrawn = deps(listing({ status: "archived" }));
  assert.equal((await approveListing({ id: "abc", ...withdrawn })).status, 404);
  assert.equal((await approveListing({ id: "missing", ...deps(listing()) })).status, 404);
});

test("rejecting needs a reason, which the poster will read", async () => {
  const d = deps(listing());
  assert.equal((await rejectListing({ id: "abc", reason: "   ", ...d })).status, 400);
  assert.equal((await rejectListing({ id: "abc", reason: undefined, ...d })).status, 400);
  assert.equal((await rejectListing({ id: "abc", reason: "x".repeat(501), ...d })).status, 400);
  assert.equal(d.updates.length, 0);
  assert.equal((await rejectListing({ id: "abc", reason: "  Please add a date.  ", ...d })).status, 200);
  assert.deepEqual(d.updates[0].data, { approvalStatus: "rejected", rejectionReason: "Please add a date." });
});

test("a translation can be saved on any listing that is not withdrawn, without changing its approval", async () => {
  for (const approvalStatus of ["pending", "approved", "rejected"]) {
    const d = deps(listing({ approvalStatus }));
    assert.equal((await saveTranslation({ id: "abc", translation: tr, ...d })).status, 200, approvalStatus);
    assert.equal("approvalStatus" in d.updates[0].data, false);
  }
  assert.equal((await saveTranslation({ id: "abc", translation: tr, ...deps(listing({ status: "archived" })) })).status, 404);
  assert.equal((await saveTranslation({ id: "abc", translation: { title: "x" }, ...deps(listing()) })).status, 400);
});

// ----- what the public sees

const es = { originalLang: "es", title: "Taller", summary: "Resumen", description: "Texto", requirements: null, titleTr: "Workshop", summaryTr: null, descriptionTr: "Text", requirementsTr: null, translationStatus: "approved" };

test("the original is shown in its own language, with no note", () => {
  const view = translatedView(es, "es");
  assert.deepEqual(view.text, { title: "Taller", summary: "Resumen", description: "Texto", requirements: null });
  assert.equal(view.showNote, false);
  assert.equal(view.usingTranslation, false);
  assert.equal(view.langs.title, "es");
});

test("the other language shows the approved translation field by field and falls back to the original", () => {
  const view = translatedView(es, "en");
  assert.equal(view.text.title, "Workshop");
  assert.equal(view.text.description, "Text");
  assert.equal(view.text.summary, "Resumen"); // not translated: the original, still marked as Spanish
  assert.equal(view.langs.title, "en");
  assert.equal(view.langs.summary, "es");
  assert.equal(view.usingTranslation, true);
  assert.equal(view.showNote, false);
});

test("without an approved translation the other language shows the original and the note", () => {
  for (const extra of [{ translationStatus: "none" }, { translationStatus: "ai_draft" }, { titleTr: null }, { descriptionTr: "" }]) {
    const view = translatedView({ ...es, ...extra }, "en");
    assert.equal(view.text.title, "Taller", JSON.stringify(extra));
    assert.equal(view.showNote, true);
    assert.equal(view.usingTranslation, false);
    assert.equal(view.langs.title, "es");
  }
  assert.equal(translatedView({ title: "T", description: "D" }, "es").original, "en"); // no language recorded means English
});

test("an unreviewed translation never reaches the public, and is not searched", () => {
  const row = { id: "x", createdAt: new Date(), datePosted: new Date("2026-10-01"), deadline: null, eventDate: null, lastUpdated: new Date("2026-10-01"), ownerUserId: "u", approvalStatus: "approved", rejectionReason: null, titleTr: "Secret draft", summaryTr: "s", descriptionTr: "d", requirementsTr: "r" };
  for (const translationStatus of ["none", "ai_draft"]) {
    const out = serializePublicOpportunity({ ...row, translationStatus });
    for (const field of ["titleTr", "summaryTr", "descriptionTr", "requirementsTr"]) assert.equal(out[field], null, `${translationStatus} ${field}`);
    assert.deepEqual(searchableTranslation({ ...row, translationStatus }), []);
  }
  const approved = serializePublicOpportunity({ ...row, translationStatus: "approved" });
  assert.equal(approved.titleTr, "Secret draft");
  assert.deepEqual(searchableTranslation({ ...row, translationStatus: "approved" }), ["Secret draft", "s", "d", "r"]);
});
