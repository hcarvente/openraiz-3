import test from "node:test";
import assert from "node:assert/strict";
import { MAX_REPORTS_PER_DAY, REPORT_REASONS, reportListing, resolveReport, validateReport } from "../lib/reportListing.js";

const person = { role: "individual", displayName: "Ana Ruiz", orgName: null };
const org = { role: "organization", displayName: "Luz", orgName: "Raiz Collective" };
const verified = (profile, id = "visitor-1") => ({ user: { id }, profile, isVerified: true, isAdmin: false });
const listing = (extra = {}) => ({ id: "abc", ownerUserId: "poster-1", status: "active", approvalStatus: "approved", ...extra });

const deps = (existing = listing(), { today = 0, open = false } = {}) => {
  const created = [];
  return {
    created,
    loadListing: async (id) => (existing && id === existing.id ? existing : null),
    countToday: async () => today,
    hasOpenReport: async () => open,
    createReport: async (data) => { created.push(data); },
  };
};
const report = (current, body, d, id = "abc") => reportListing({ current, id, body, ...d });
const ok = { reason: "scam_or_payment", note: "They asked for $50 to apply." };

test("signed out gets 401, an unverified email 403, no profile 403, and nothing is saved", async () => {
  const d = deps();
  assert.deepEqual(await report(null, ok, d), { status: 401, body: { error: "signIn" } });
  assert.deepEqual((await report({ ...verified(person), isVerified: false }, ok, d)).body, { error: "unverified" });
  assert.deepEqual((await report(verified(null), ok, d)).body, { error: "noProfile" });
  assert.equal(d.created.length, 0);
});

test("only a public listing can be reported; anything else looks like it does not exist", async () => {
  for (const existing of [listing({ approvalStatus: "pending" }), listing({ approvalStatus: "rejected" }), listing({ status: "archived" })]) {
    const d = deps(existing);
    assert.deepEqual(await report(verified(person), ok, d), { status: 404, body: { error: "notFound" } });
    assert.equal(d.created.length, 0);
  }
  assert.equal((await report(verified(person), ok, deps(listing({ status: "filled" })))).status, 201); // a filled listing is still public
  assert.equal((await report(verified(person), ok, deps(), "missing")).status, 404);
  assert.equal((await report(verified(person), ok, deps(), "a b")).status, 404);
});

test("nobody can report their own listing", async () => {
  const d = deps(listing({ ownerUserId: "visitor-1" }));
  assert.deepEqual(await report(verified(person), ok, d), { status: 403, body: { error: "ownListing" } });
  assert.equal(d.created.length, 0);
});

test("the reason must be one of the list; the note is optional, trimmed and limited", async () => {
  assert.deepEqual(REPORT_REASONS, ["scam_or_payment", "unsafe", "misleading", "discriminatory", "spam", "other"]);
  const bad = [{}, { reason: "" }, { reason: "boring" }, { reason: 5 }, { reason: "spam", note: "x".repeat(501) }, { reason: "spam", note: 5 }, { reason: "spam", extra: 1 }, { reason: "spam", reporterUserId: "other" }];
  for (const body of bad) {
    const d = deps();
    assert.equal((await report(verified(person), body, d)).status, 400, JSON.stringify(body));
    assert.equal(d.created.length, 0);
  }
  assert.deepEqual(validateReport({ reason: "other", note: "  hmm  " }), { ok: true, data: { reason: "other", note: "hmm" } });
  assert.equal(validateReport({ reason: "spam" }).data.note, null);
  assert.equal(validateReport({ reason: "spam", note: "   " }).data.note, null);
  assert.equal(validateReport({ reason: "spam", note: "x".repeat(500) }).ok, true);
  assert.deepEqual(validateReport({}).errors, [{ field: "reason", code: "required" }]);
  assert.deepEqual(validateReport({ reason: "nope" }).errors, [{ field: "reason", code: "invalid" }]);
});

test("a valid report is saved with the reporter recorded by the server", async () => {
  const d = deps();
  assert.deepEqual(await report(verified(person), ok, d), { status: 201, body: { reported: true } });
  assert.deepEqual(d.created[0], { opportunityId: "abc", reporterUserId: "visitor-1", reporterName: "Ana Ruiz", reason: "scam_or_payment", note: "They asked for $50 to apply." });
  const fromOrg = deps();
  await report(verified(org, "visitor-2"), { reason: "unsafe" }, fromOrg);
  assert.equal(fromOrg.created[0].reporterName, "Raiz Collective");
  assert.equal(fromOrg.created[0].note, null);
});

test("one open report per person per listing, and ten a day", async () => {
  const again = deps(listing(), { open: true });
  assert.deepEqual(await report(verified(person), ok, again), { status: 409, body: { error: "alreadyReported" } });
  assert.equal(MAX_REPORTS_PER_DAY, 10);
  assert.equal((await report(verified(person), ok, deps(listing(), { today: 9 }))).status, 201);
  const many = deps(listing(), { today: 10 });
  assert.deepEqual(await report(verified(person), ok, many), { status: 429, body: { error: "tooManyToday" } });
  assert.equal(again.created.length + many.created.length, 0);
});

test("an invalid report is refused before the limits are looked at", async () => {
  const d = deps(listing(), { open: true, today: 99 });
  assert.equal((await report(verified(person), { reason: "" }, d)).status, 400);
});

test("the admin marks a report handled, once", async () => {
  const updates = [];
  const base = { update: async (id, data) => { updates.push({ id, data }); }, now: new Date("2026-10-28T12:00:00Z") };
  assert.deepEqual(await resolveReport({ id: "r1", loadReport: async () => ({ id: "r1", resolvedAt: null }), ...base }), { status: 200, body: { id: "r1", resolved: true } });
  assert.deepEqual(updates, [{ id: "r1", data: { resolvedAt: new Date("2026-10-28T12:00:00Z") } }]);
  await resolveReport({ id: "r1", loadReport: async () => ({ id: "r1", resolvedAt: new Date() }), ...base });
  assert.equal(updates.length, 1); // already handled: no second update
  assert.equal((await resolveReport({ id: "x", loadReport: async () => null, ...base })).status, 404);
});
