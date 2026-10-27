import test from "node:test";
import assert from "node:assert/strict";
import { isValidListingId, posterInfo, safeApplyLink } from "../lib/opportunityDetail.js";
import { formatDate } from "../lib/formatDate.js";

test("only plain ids are looked up", () => {
  for (const id of ["abc", "2026-community-health-fellow-001", "cmv_1-A"]) assert.equal(isValidListingId(id), true, id);
  for (const id of ["", "a b", "a/b", "a%00b", "a\u0000b", "x".repeat(101), undefined, null, 5, ["a"]]) {
    assert.equal(isValidListingId(id), false, String(id));
  }
});

test("a web link is shown only when it is a real http or https link", () => {
  const ok = safeApplyLink("url", "https://www.example.org/apply?x=1");
  assert.deepEqual(ok, { kind: "url", href: "https://www.example.org/apply?x=1", display: "example.org" });
  assert.equal(safeApplyLink("url", "http://example.org").kind, "url");
  for (const value of ["javascript:alert(1)", "data:text/html,hi", "ftp://example.org", "https://localhost", "not a url", "https://a b.org", "//evil.org", "", null, undefined]) {
    assert.equal(safeApplyLink("url", value), null, String(value));
  }
});

test("an email is shown only when it is a plain address with no mailto extras", () => {
  assert.deepEqual(safeApplyLink("email", "jobs@example.org"), { kind: "email", href: "mailto:jobs@example.org", display: "jobs@example.org" });
  for (const value of ["jobs@example.org?bcc=x@y.com", "a@b.co&cc=x@y.com", "a@b.co, c@d.co", "a b@c.co", "x", "<a@b.co>", "a".repeat(250) + "@b.co"]) {
    assert.equal(safeApplyLink("email", value), null, value);
  }
});

test("an unknown way to apply shows nothing", () => {
  assert.equal(safeApplyLink("fax", "https://example.org"), null);
  assert.equal(safeApplyLink(undefined, "https://example.org"), null);
});

test("a poster is shown only for listings people posted, and only with a profile", () => {
  const org = { role: "organization", displayName: "Ana", orgName: "Raiz Collective" };
  const person = { role: "individual", displayName: "Ana", orgName: null };
  assert.deepEqual(posterInfo({ source: "user-posted" }, org), { role: "organization", name: "Raiz Collective" });
  assert.deepEqual(posterInfo({ source: "user-posted" }, person), { role: "individual", name: "Ana" });
  assert.deepEqual(posterInfo({ source: "user-posted" }, { role: "organization", displayName: "Ana", orgName: "" }), { role: "organization", name: "Ana" });
  assert.equal(posterInfo({ source: "owner-added" }, org), null); // OpenRaiz and admin listings say "OpenRaiz" instead
  assert.equal(posterInfo({ source: "user-posted" }, null), null);
  assert.equal(posterInfo({ source: "user-posted" }, { role: "admin" }), null);
  assert.equal(posterInfo(null, org), null);
});

test("dates are written for the language and never shift by time zone", () => {
  assert.equal(formatDate("2026-12-15", "en"), "Dec 15, 2026");
  assert.match(formatDate("2026-12-15", "es"), /^15 dic\.? 2026$/);
  assert.equal(formatDate("2027-01-01", "en"), "Jan 1, 2027");
  for (const value of ["", "2026-13-45x", "15/12/2026", null, undefined, 5]) assert.equal(formatDate(value, "en"), "");
});
