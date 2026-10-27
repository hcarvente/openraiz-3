import test from "node:test";
import assert from "node:assert/strict";
import { safeNextPath } from "../lib/safeRedirect.js";

test("plain paths on this site are allowed", () => {
  assert.equal(safeNextPath("/admin/opportunities/new"), "/admin/opportunities/new");
  assert.equal(safeNextPath("/account?tab=1"), "/account?tab=1");
});

test("other sites and tricks fall back to the default", () => {
  const bad = [
    "https://evil.example", "//evil.example", "/\\evil.example", "/\\/evil.example", "evil.example",
    "javascript:alert(1)", "/ok\nSet-Cookie: x=1", "/ok\u0000", "", undefined, null, 5, ["/x"], "/".repeat(201),
  ];
  for (const value of bad) assert.equal(safeNextPath(value), "/account", `${JSON.stringify(value)} must be refused`);
});

test("API paths are never a redirect target, and the fallback can be chosen", () => {
  assert.equal(safeNextPath("/api/opportunities"), "/account");
  assert.equal(safeNextPath("/api"), "/account");
  assert.equal(safeNextPath("//x", "/"), "/");
});
