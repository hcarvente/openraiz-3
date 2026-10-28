import test from "node:test";
import assert from "node:assert/strict";
import { INDIVIDUAL_TYPES, MAX_PENDING_POSTS, ORGANIZATION_TYPES, codeForMessage, validatePost } from "../lib/validatePost.js";
import { submitPost } from "../lib/submitPost.js";
import { isSameOrigin } from "../lib/sameOrigin.js";

const TODAY = "2026-10-28";
const person = { role: "individual", displayName: "Ana Ruiz", orgName: null };
const org = { role: "organization", displayName: "Luz", orgName: "Raiz Collective" };
const workshop = { type: "workshop", title: "Resume workshop", description: "Bring your resume.", lang: "en", paid: "no", eventDate: "2026-11-20", locationType: "remote", guidelines: true };
const fields = (result) => result.errors.map((e) => `${e.field}:${e.code}`);

test("an individual's short workshop becomes a complete listing with the defaults filled in", () => {
  const result = validatePost(workshop, person, TODAY);
  assert.equal(result.ok, true);
  const d = result.data;
  assert.equal(d.organization, "Ana Ruiz"); // the poster's own name
  assert.equal(d.type, "workshop");
  assert.equal(d.isPaid, false);
  assert.equal(d.compensation, "Free");
  assert.equal(d.livedExperienceRelevance, "welcomed"); // the default
  assert.equal(d.applyMethodType, "platform"); // no link given: contact through OpenRaiz
  assert.equal(d.applyMethodValue, "");
  assert.equal(d.originalLang, "en");
  assert.equal(d.datePosted.toISOString().slice(0, 10), TODAY);
  assert.equal("status" in d, false); // the database default (active) applies
});

test("an organization is shown under its organization name", () => {
  const result = validatePost({ ...workshop, type: "volunteer", eventDate: undefined, deadline: "2026-12-01" }, org, TODAY);
  assert.equal(result.ok, true);
  assert.equal(result.data.organization, "Raiz Collective");
});

test("an individual may post workshops, events and resources and nothing else", () => {
  assert.deepEqual(INDIVIDUAL_TYPES, ["workshop", "event", "resource"]);
  for (const type of ["job", "internship", "fellowship", "volunteer"]) {
    const result = validatePost({ ...workshop, type, eventDate: undefined }, person, TODAY);
    assert.equal(result.ok, false, type);
    assert.ok(fields(result).includes("type:notAllowed"), type);
  }
  for (const type of INDIVIDUAL_TYPES) {
    assert.equal(validatePost({ ...workshop, type, eventDate: type === "resource" ? undefined : "2026-11-20" }, person, TODAY).ok, true, type);
  }
});

test("an organization may post every type", () => {
  assert.equal(ORGANIZATION_TYPES.length, 7);
  for (const type of ORGANIZATION_TYPES) {
    const extra = type === "workshop" || type === "event" ? { eventDate: "2026-11-20" } : { eventDate: undefined };
    assert.equal(validatePost({ ...workshop, ...extra, type }, org, TODAY).ok, true, type);
  }
});

test("an individual cannot publish an email address, an organization can", () => {
  const withEmail = { ...workshop, applyMethodType: "email", applyMethodValue: "me@example.org" };
  assert.ok(fields(validatePost(withEmail, person, TODAY)).includes("applyMethodType:notAllowed"));
  assert.equal(validatePost(withEmail, org, TODAY).ok, true);
  assert.equal(validatePost({ ...workshop, applyMethodType: "url", applyMethodValue: "https://example.org/join" }, person, TODAY).ok, true);
});

test("the guidelines box must be ticked", () => {
  for (const guidelines of [false, undefined, "true", 1, null]) {
    assert.ok(fields(validatePost({ ...workshop, guidelines }, person, TODAY)).includes("guidelines:guidelinesRequired"), String(guidelines));
  }
});

test("a Spanish listing gets Spanish pay words and its language recorded", () => {
  assert.equal(validatePost({ ...workshop, lang: "es" }, person, TODAY).data.compensation, "Gratis");
  const paid = validatePost({ ...workshop, lang: "es", paid: "yes" }, person, TODAY).data;
  assert.equal(paid.compensation, "Con pago");
  assert.equal(paid.originalLang, "es");
  assert.equal(validatePost({ ...workshop, paid: "yes", payNote: "$20 per person" }, person, TODAY).data.compensation, "$20 per person");
  assert.ok(fields(validatePost({ ...workshop, lang: "fr" }, person, TODAY)).includes("lang:invalid"));
  const { lang, ...noLang } = workshop;
  assert.ok(fields(validatePost(noLang, person, TODAY)).includes("lang:required"));
});

test("the server decides ownership, approval, source, translation and status: none can be sent", () => {
  for (const field of ["approvalStatus", "ownerUserId", "source", "status", "id", "titleTr", "translationStatus", "originalLang", "datePosted", "organization"]) {
    const result = validatePost({ ...workshop, [field]: "x" }, person, TODAY);
    assert.equal(result.ok, false, field);
    assert.ok(fields(result).includes(`${field}:unknown`), field);
  }
});

test("missing and bad answers come back as codes the form can translate", () => {
  const result = validatePost({ type: "workshop", title: "", description: "", lang: "en", paid: "no", locationType: "onsite", guidelines: true }, person, TODAY);
  assert.equal(result.ok, false);
  const codes = Object.fromEntries(result.errors.map((e) => [e.field, e.code]));
  assert.equal(codes.title, "required");
  assert.equal(codes.description, "required");
  assert.equal(codes.city, "locationRequired");
  assert.equal(codes.state, "locationRequired");
  assert.equal(validatePost({ ...workshop, eventDate: "2026-02-30" }, person, TODAY).errors[0].code, "invalidDate");
  assert.equal(validatePost({ ...workshop, title: "x".repeat(201) }, person, TODAY).errors[0].code, "tooLong");
  assert.equal(validatePost({ ...workshop, applyMethodType: "url", applyMethodValue: "javascript:alert(1)" }, person, TODAY).errors[0].code, "invalidUrl");
  assert.equal(validatePost({ ...workshop, type: "resource", eventDate: "2026-11-20" }, person, TODAY).errors[0].code, "notAllowed");
  assert.equal(validatePost({ ...workshop, paid: "yes", payNote: "Unpaid, sorry" }, person, TODAY).errors[0].field, "payNote");
  assert.equal(validatePost({ ...workshop, skills: "a,b" }, person, TODAY).errors[0].code, "invalidSkills");
  assert.equal(validatePost(null, person, TODAY).ok, false);
  assert.equal(validatePost([], person, TODAY).ok, false);
  assert.equal(validatePost(workshop, null, TODAY).ok, false);
  assert.equal(validatePost(workshop, { role: "admin" }, TODAY).ok, false);
});

test("text is stored as plain text and trimmed; html is just characters", () => {
  const result = validatePost({ ...workshop, title: "  <b>Hi</b> & welcome  " }, person, TODAY);
  assert.equal(result.data.title, "<b>Hi</b> & welcome"); // escaped later by React, never run
});

test("messages from the shared validator map to codes", () => {
  assert.equal(codeForMessage("This field is required."), "required");
  assert.equal(codeForMessage("Must be 200 characters or fewer."), "tooLong");
  assert.equal(codeForMessage("Something unexpected"), "invalid");
});

// ----- the decision behind POST /api/posts

const verified = (profile) => ({ user: { id: "user-1" }, profile, isVerified: true, isAdmin: false });
const deps = (pending = 0) => {
  const calls = [];
  return { calls, countPending: async () => pending, createListing: async (data) => { calls.push(data); return { id: "new-id" }; } };
};

test("nobody signed in gets 401, an unverified email 403, no profile 403, and nothing is saved", async () => {
  const d = deps();
  assert.deepEqual(await submitPost({ current: null, body: workshop, today: TODAY, ...d }), { status: 401, body: { error: "signIn" } });
  assert.deepEqual((await submitPost({ current: { ...verified(person), isVerified: false }, body: workshop, today: TODAY, ...d })).body, { error: "unverified" });
  assert.deepEqual((await submitPost({ current: verified(null), body: workshop, today: TODAY, ...d })).body, { error: "noProfile" });
  assert.equal(d.calls.length, 0);
});

test("the sign-in check comes before the body is looked at", async () => {
  assert.equal((await submitPost({ current: null, body: undefined, today: TODAY, ...deps() })).status, 401);
  assert.equal((await submitPost({ current: verified(person), body: undefined, today: TODAY, ...deps() })).status, 400);
});

test("a valid post is saved as pending, owned by the poster, marked user-posted", async () => {
  const d = deps(0);
  const result = await submitPost({ current: verified(person), body: workshop, today: TODAY, ...d });
  assert.deepEqual(result, { status: 201, body: { id: "new-id" } });
  assert.equal(d.calls.length, 1);
  assert.equal(d.calls[0].approvalStatus, "pending");
  assert.equal(d.calls[0].ownerUserId, "user-1");
  assert.equal(d.calls[0].source, "user-posted");
});

test("an invalid post is refused with codes and nothing is saved", async () => {
  const d = deps();
  const result = await submitPost({ current: verified(person), body: { ...workshop, type: "job", eventDate: undefined }, today: TODAY, ...d });
  assert.equal(result.status, 400);
  assert.equal(result.body.error, "invalid");
  assert.deepEqual(result.body.details.map((e) => e.code), ["notAllowed"]);
  assert.equal(d.calls.length, 0);
});

test("at most five pending listings per account", async () => {
  assert.equal(MAX_PENDING_POSTS, 5);
  const four = deps(4);
  assert.equal((await submitPost({ current: verified(person), body: workshop, today: TODAY, ...four })).status, 201);
  const five = deps(5);
  assert.deepEqual(await submitPost({ current: verified(person), body: workshop, today: TODAY, ...five }), { status: 429, body: { error: "tooManyPending" } });
  assert.equal(five.calls.length, 0);
});

test("an admin who posts through this route is treated like anyone else", async () => {
  const d = deps();
  const result = await submitPost({ current: { ...verified(person), isAdmin: true }, body: { ...workshop, type: "job" }, today: TODAY, ...d });
  assert.equal(result.status, 400);
});

// ----- the same-site check

test("a cross-site browser request is refused; same-site and non-browser requests pass", () => {
  const h = (values) => ({ get: (name) => values[name.toLowerCase()] ?? null });
  assert.equal(isSameOrigin(h({ origin: "https://openraiz.example", host: "openraiz.example" })), true);
  assert.equal(isSameOrigin(h({ origin: "http://localhost:3000", host: "localhost:3000" })), true);
  assert.equal(isSameOrigin(h({ origin: "https://evil.example", host: "openraiz.example" })), false);
  assert.equal(isSameOrigin(h({ origin: "null", host: "openraiz.example" })), false);
  assert.equal(isSameOrigin(h({ origin: "https://openraiz.example.evil.com", host: "openraiz.example" })), false);
  assert.equal(isSameOrigin(h({ host: "openraiz.example" })), true); // no Origin header: not a browser acting for another site
  assert.equal(isSameOrigin(h({ origin: "https://app.example", "x-forwarded-host": "app.example", host: "internal:3000" })), true);
});
