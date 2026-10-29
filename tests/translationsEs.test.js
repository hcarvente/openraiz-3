import test from "node:test";
import assert from "node:assert/strict";
import { LISTINGS } from "../prisma/seed-data.mjs";
import { TRANSLATIONS_ES } from "../prisma/translations-es.mjs";
import { validateTranslation } from "../lib/moderation.js";
import { translatedView } from "../lib/translation.js";

test("every sample listing has a Spanish translation, and nothing extra", () => {
  assert.deepEqual(Object.keys(TRANSLATIONS_ES).sort(), LISTINGS.map((l) => l.legacyId).sort());
});

test("each Spanish text passes the same rules as a translation saved in the admin queue", () => {
  for (const [id, t] of Object.entries(TRANSLATIONS_ES)) {
    const result = validateTranslation(t);
    assert.equal(result.ok, true, `${id}: ${JSON.stringify(result.errors)}`);
    assert.equal(result.data.summaryTr, t.summary);
    assert.equal(result.data.requirementsTr, t.requirements);
  }
});

test("each text is really translated, not left in English", () => {
  for (const listing of LISTINGS) {
    const t = TRANSLATIONS_ES[listing.legacyId];
    assert.notEqual(t.title, listing.title, `${listing.legacyId} title`);
    assert.notEqual(t.summary, listing.summary, `${listing.legacyId} summary`);
    assert.notEqual(t.description, listing.description, `${listing.legacyId} description`);
    assert.notEqual(t.requirements, listing.requirements, `${listing.legacyId} requirements`);
    // A few English words that would show the text was not translated.
    for (const word of [" the ", " and ", " with ", " for ", " paid "]) {
      for (const field of ["title", "summary", "description", "requirements"]) {
        assert.equal(` ${t[field]} `.includes(word), false, `${listing.legacyId} ${field} contains${word}`);
      }
    }
  }
});

test("each listing keeps what the English one says that matters: the city and whether it is a closed or open opportunity", () => {
  for (const listing of LISTINGS) {
    const t = TRANSLATIONS_ES[listing.legacyId];
    if (listing.city) {
      const place = listing.city === "Los Angeles" ? "Los Ángeles" : listing.city;
      assert.ok(t.summary.includes(place) || t.requirements.includes(place), `${listing.legacyId} mentions ${place}`);
    }
  }
  assert.ok(TRANSLATIONS_ES["2026-peer-mentor-004"].summary.includes("cubierto")); // the filled one says so, as in English
});

test("a Spanish visitor sees the translation and an English visitor still sees the original", () => {
  for (const listing of LISTINGS) {
    const row = { ...listing, originalLang: "en", translationStatus: "approved", titleTr: TRANSLATIONS_ES[listing.legacyId].title, summaryTr: TRANSLATIONS_ES[listing.legacyId].summary, descriptionTr: TRANSLATIONS_ES[listing.legacyId].description, requirementsTr: TRANSLATIONS_ES[listing.legacyId].requirements };
    const es = translatedView(row, "es");
    assert.equal(es.text.title, TRANSLATIONS_ES[listing.legacyId].title);
    assert.equal(es.showNote, false);
    assert.equal(es.langs.title, "es");
    const en = translatedView(row, "en");
    assert.equal(en.text.title, listing.title);
  }
});
