import test from "node:test";
import assert from "node:assert/strict";
import { parseAdminEmails, isAdminEmail, validateSignUp, validateProfileChoice } from "../lib/rolesCore.js";

test("parseAdminEmails trims, lower-cases and drops blanks", () => {
  assert.deepEqual(parseAdminEmails(" A@x.com, b@Y.com ,, "), ["a@x.com", "b@y.com"]);
  assert.deepEqual(parseAdminEmails(""), []);
  assert.deepEqual(parseAdminEmails(undefined), []);
});

test("an email on the list is admin only when it is verified", () => {
  assert.equal(isAdminEmail("Boss@X.com", true, "boss@x.com"), true);
  assert.equal(isAdminEmail("boss@x.com", false, "boss@x.com"), false);
  assert.equal(isAdminEmail("boss@x.com", undefined, "boss@x.com"), false);
  assert.equal(isAdminEmail("boss@x.com", "true", "boss@x.com"), false);
});

test("nobody is admin when the list is empty or the email is not on it", () => {
  assert.equal(isAdminEmail("boss@x.com", true, ""), false);
  assert.equal(isAdminEmail("boss@x.com", true, undefined), false);
  assert.equal(isAdminEmail("other@x.com", true, "boss@x.com"), false);
  assert.equal(isAdminEmail(null, true, "boss@x.com"), false);
  assert.equal(isAdminEmail("boss@x.com.evil.com", true, "boss@x.com"), false);
});

const good = { name: "Ana", email: "Ana@Example.com ", password: "longenough", role: "individual" };

test("a valid individual sign-up is cleaned and has no organization name", () => {
  const result = validateSignUp({ ...good, orgName: "ignored" });
  assert.equal(result.ok, true);
  assert.equal(result.values.email, "ana@example.com");
  assert.equal(result.values.orgName, null);
});

test("an organization sign-up needs an organization name", () => {
  assert.equal(validateSignUp({ ...good, role: "organization" }).ok, false);
  const result = validateSignUp({ ...good, role: "organization", orgName: "  Raiz Collective " });
  assert.equal(result.ok, true);
  assert.equal(result.values.orgName, "Raiz Collective");
});

test("a sign-up cannot choose admin or any other role", () => {
  for (const role of ["admin", "Admin", "", undefined, null, 7, ["individual"], "individual "]) {
    const result = validateSignUp({ ...good, role });
    if (role === "individual ") {
      assert.equal(result.ok, true); // surrounding spaces are trimmed, still the individual role
    } else {
      assert.equal(result.ok, false, `role ${JSON.stringify(role)} must be rejected`);
      assert.ok(result.errors.role);
    }
  }
});

test("bad names, emails and passwords are rejected with a message per field", () => {
  const result = validateSignUp({ name: "", email: "nope", password: "short", role: "individual" });
  assert.equal(result.ok, false);
  assert.ok(result.errors.name && result.errors.email && result.errors.password);
  assert.equal(validateSignUp({ ...good, name: "x".repeat(101) }).ok, false);
  assert.equal(validateSignUp({ ...good, password: "x".repeat(129) }).ok, false);
  assert.equal(validateSignUp(null).ok, false);
  assert.equal(validateSignUp({ ...good, name: { $ne: 1 } }).ok, false);
});

test("finishing a profile accepts only the two roles and keeps the organization name only for organizations", () => {
  assert.deepEqual(validateProfileChoice({ role: "individual", orgName: "x" }), { errors: {}, role: "individual", orgName: null });
  assert.equal(validateProfileChoice({ role: "organization", orgName: " Raiz " }).orgName, "Raiz");
  assert.ok(validateProfileChoice({ role: "organization", orgName: "" }).errors.orgName);
  assert.ok(validateProfileChoice({ role: "admin" }).errors.role);
  assert.ok(validateProfileChoice(undefined).errors.role);
});
