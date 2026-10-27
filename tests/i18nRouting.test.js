import test from "node:test";
import assert from "node:assert/strict";
import { DEFAULT_LOCALE, LOCALES, isLocale, localePath } from "../lib/i18n/config.js";
import { negotiateLocale } from "../lib/i18n/negotiate.js";

test("the site has English and Spanish, and English is the default", () => {
  assert.deepEqual(LOCALES, ["en", "es"]);
  assert.equal(DEFAULT_LOCALE, "en");
  assert.equal(isLocale("es"), true);
  for (const value of ["fr", "ES", "", undefined, null, ["es"], "es/x"]) assert.equal(isLocale(value), false, String(value));
});

test("localePath puts the language first and falls back to English", () => {
  assert.equal(localePath("es"), "/es");
  assert.equal(localePath("es", "/"), "/es");
  assert.equal(localePath("en", "/opportunities"), "/en/opportunities");
  assert.equal(localePath("es", "auth/sign-in"), "/es/auth/sign-in");
  assert.equal(localePath("zz", "/account"), "/en/account");
});

test("a Spanish-first browser gets Spanish, an English-first browser gets English", () => {
  assert.equal(negotiateLocale("es-MX,es;q=0.9,en;q=0.8"), "es");
  assert.equal(negotiateLocale("es"), "es");
  assert.equal(negotiateLocale("en-US,en;q=0.9,es;q=0.8"), "en");
  assert.equal(negotiateLocale("fr-FR,fr;q=0.9,es;q=0.5"), "es");
  assert.equal(negotiateLocale("en;q=0.5,es;q=0.9"), "es");
});

test("anything unclear gives English", () => {
  for (const value of [undefined, null, "", "*", "fr,de", "es;q=0", "es;q=abc", "x".repeat(501), 5]) {
    assert.equal(negotiateLocale(value), "en", String(value).slice(0, 20));
  }
  assert.equal(negotiateLocale("ES-ar"), "es"); // case does not matter
});
