import test from "node:test";
import assert from "node:assert/strict";
import { MAX_PER_DAY, MAX_PER_LISTING, sendMessage, validateMessage } from "../lib/sendMessage.js";

const person = { role: "individual", displayName: "Ana Ruiz", orgName: null };
const org = { role: "organization", displayName: "Luz", orgName: "Raiz Collective" };
const verified = (profile, id = "visitor-1") => ({ user: { id }, profile, isVerified: true, isAdmin: false });
const listing = (extra = {}) => ({ id: "abc", ownerUserId: "poster-1", status: "active", approvalStatus: "approved", applyMethodType: "platform", ...extra });

const deps = (existing = listing(), today = 0, forListing = 0) => {
  const created = [];
  return {
    created,
    loadListing: async (id) => (existing && id === existing.id ? existing : null),
    countToday: async () => today,
    countForListing: async () => forListing,
    createMessage: async (data) => { created.push(data); },
  };
};
const send = (current, body, d, id = "abc") => sendMessage({ current, id, body, ...d });
const hello = { message: "Hi, is there still room?" };

test("signed out gets 401, an unverified email 403, no profile 403, and nothing is saved", async () => {
  const d = deps();
  assert.deepEqual(await send(null, hello, d), { status: 401, body: { error: "signIn" } });
  assert.deepEqual((await send({ ...verified(person), isVerified: false }, hello, d)).body, { error: "unverified" });
  assert.deepEqual((await send(verified(null), hello, d)).body, { error: "noProfile" });
  assert.equal(d.created.length, 0);
});

test("the sign-in check comes before the message is looked at", async () => {
  assert.equal((await send(null, undefined, deps())).status, 401);
  assert.equal((await send(verified(person), undefined, deps())).status, 400);
});

test("only a public, open listing that uses OpenRaiz contact accepts messages; anything else looks like it does not exist", async () => {
  const cases = [
    listing({ approvalStatus: "pending" }), listing({ approvalStatus: "rejected" }), listing({ status: "archived" }),
    listing({ status: "filled" }), listing({ applyMethodType: "url" }), listing({ applyMethodType: "email" }),
  ];
  for (const existing of cases) {
    const d = deps(existing);
    assert.deepEqual(await send(verified(person), hello, d), { status: 404, body: { error: "notFound" } }, JSON.stringify(existing));
    assert.equal(d.created.length, 0);
  }
  assert.equal((await send(verified(person), hello, deps(), "missing")).status, 404);
  assert.equal((await send(verified(person), hello, deps(), "a b")).status, 404);
});

test("nobody can message their own listing", async () => {
  const d = deps(listing({ ownerUserId: "visitor-1" }));
  assert.deepEqual(await send(verified(person), hello, d), { status: 403, body: { error: "ownListing" } });
  assert.equal(d.created.length, 0);
});

test("the message is required, trimmed and limited; the contact is optional and limited", async () => {
  const bad = [{}, { message: "" }, { message: "   " }, { message: 5 }, { message: "x".repeat(1001) }, { message: "hi", contact: "y".repeat(201) }, { message: "hi", contact: 5 }, { message: "hi", extra: 1 }, { message: "hi", senderUserId: "other" }, { message: "hi", opportunityId: "other" }];
  for (const body of bad) {
    const d = deps();
    const result = await send(verified(person), body, d);
    assert.equal(result.status, 400, JSON.stringify(body));
    assert.equal(d.created.length, 0);
  }
  const ok = validateMessage({ message: "  Hello there  ", contact: "  me@example.org " });
  assert.deepEqual(ok, { ok: true, data: { body: "Hello there", contact: "me@example.org" } });
  assert.equal(validateMessage({ message: "hi" }).data.contact, null);
  assert.equal(validateMessage({ message: "hi", contact: "   " }).data.contact, null);
  assert.equal(validateMessage({ message: "x".repeat(1000) }).ok, true);
  assert.deepEqual(validateMessage({ message: "" }).errors, [{ field: "message", code: "required" }]);
  assert.deepEqual(validateMessage({ message: "x".repeat(1001) }).errors, [{ field: "message", code: "tooLong" }]);
});

test("a valid message is saved with the sender recorded by the server, and html is kept as plain text", async () => {
  const d = deps();
  const result = await send(verified(person), { message: "<b>Hi</b> & thanks", contact: "555-0100" }, d);
  assert.deepEqual(result, { status: 201, body: { sent: true } });
  assert.deepEqual(d.created[0], { opportunityId: "abc", senderUserId: "visitor-1", senderName: "Ana Ruiz", senderRole: "individual", contact: "555-0100", body: "<b>Hi</b> & thanks" });
  const fromOrg = deps();
  await send(verified(org, "visitor-2"), hello, fromOrg);
  assert.equal(fromOrg.created[0].senderName, "Raiz Collective"); // an organization writes as the organization
  assert.equal(fromOrg.created[0].senderRole, "organization");
});

test("at most ten messages a day and three to the same listing", async () => {
  assert.equal(MAX_PER_DAY, 10);
  assert.equal(MAX_PER_LISTING, 3);
  assert.equal((await send(verified(person), hello, deps(listing(), 9, 2))).status, 201);
  const day = deps(listing(), 10, 0);
  assert.deepEqual(await send(verified(person), hello, day), { status: 429, body: { error: "tooManyToday" } });
  const perListing = deps(listing(), 3, 3);
  assert.deepEqual(await send(verified(person), hello, perListing), { status: 429, body: { error: "tooManyForListing" } });
  assert.equal(day.created.length + perListing.created.length, 0);
});

test("an invalid message is refused before the limits are looked at", async () => {
  const d = deps(listing(), 99, 99);
  assert.equal((await send(verified(person), { message: "" }, d)).status, 400);
});
