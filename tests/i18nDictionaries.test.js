import test from "node:test";
import assert from "node:assert/strict";
import { en } from "../lib/i18n/dictionaries/en.js";
import { es } from "../lib/i18n/dictionaries/es.js";
import { fill, getDictionary } from "../lib/i18n/dictionaries.js";
import { validateSignUp, validateProfileChoice } from "../lib/rolesCore.js";

// Every leaf of a dictionary as { "auth.signIn.submit": "Sign in", ... }.
function leaves(object, prefix = "") {
  return Object.entries(object).flatMap(([key, value]) =>
    value !== null && typeof value === "object" ? leaves(value, `${prefix}${key}.`) : [[`${prefix}${key}`, value]],
  );
}
const markers = (text) => (text.match(/\{\w+\}/g) ?? []).sort().join(",");

test("Spanish has exactly the same keys as English", () => {
  const english = leaves(en).map(([key]) => key).sort();
  const spanish = leaves(es).map(([key]) => key).sort();
  assert.deepEqual(spanish.filter((key) => !english.includes(key)), [], "keys only in Spanish");
  assert.deepEqual(english.filter((key) => !spanish.includes(key)), [], "keys missing in Spanish");
});

test("no text is empty, and every value is text", () => {
  for (const [name, dictionary] of [["en", en], ["es", es]]) {
    for (const [key, value] of leaves(dictionary)) {
      assert.equal(typeof value, "string", `${name}.${key} must be text`);
      assert.ok(value.trim().length > 0, `${name}.${key} is empty`);
    }
  }
});

test("both languages use the same {markers} in each text", () => {
  const spanish = Object.fromEntries(leaves(es));
  for (const [key, value] of leaves(en)) assert.equal(markers(spanish[key]), markers(value), key);
});

test("the Spanish is really Spanish where it should differ from English", () => {
  // Texts that are the same in both languages on purpose (the brand name).
  const allowedSame = new Set(["detail.postedByOpenRaiz"]);
  const spanish = Object.fromEntries(leaves(es));
  for (const [key, value] of leaves(en)) {
    if (value === spanish[key] && !allowedSame.has(key)) assert.fail(`${key} is identical in both languages: ${value}`);
  }
});

test("fill puts values into markers and leaves unknown markers alone", () => {
  assert.equal(fill("{count} found", { count: 3 }), "3 found");
  assert.equal(fill("{a} and {b}", { a: "x" }), "x and {b}");
  assert.equal(getDictionary("es"), es);
  assert.equal(getDictionary("zz"), en);
});

test("every message key the validators can return exists in both languages", () => {
  const bad = validateSignUp({ name: "", email: "x", password: "x", role: "organization", orgName: "" });
  const keys = new Set([...Object.values(bad.errors), ...Object.values(validateProfileChoice({ role: "x" }).errors)]);
  assert.ok(keys.size >= 5);
  for (const key of keys) {
    assert.ok(en.auth.errors[key], `English is missing ${key}`);
    assert.ok(es.auth.errors[key], `Spanish is missing ${key}`);
  }
});
