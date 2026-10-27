import test from "node:test";
import assert from "node:assert/strict";
import { LISTINGS } from "../prisma/seed-data.mjs";
import { CATEGORIES } from "../lib/opportunityTaxonomy.js";
import { en } from "../lib/i18n/dictionaries/en.js";
import { es } from "../lib/i18n/dictionaries/es.js";
import {
  MAX_QUERY_LENGTH,
  buildOrderBy,
  buildWhere,
  hasActiveFilters,
  matchesQuery,
  normalizeText,
  parseSearchParams,
} from "../lib/opportunitySearch.js";

const search = (q, extra = []) => LISTINGS.filter((row) => matchesQuery(row, q, extra));

test("with nothing in the address there are no filters and the newest listings come first", () => {
  const filters = parseSearchParams({});
  assert.deepEqual(filters, { q: "", type: "", location: "", paid: "", state: "", category: "", relevance: "", open: false, sort: "newest" });
  assert.equal(hasActiveFilters(filters), false);
  assert.equal(hasActiveFilters(parseSearchParams({ sort: "deadline" })), false); // sorting is not filtering
  assert.equal(hasActiveFilters(parseSearchParams({ q: "x" })), true);
});

test("good values are kept and bad or tampered values are ignored", () => {
  const good = parseSearchParams({ q: "  legal   aid ", type: "job", location: "remote", paid: "no", state: "CA", category: "Education", relevance: "required", open: "1", sort: "deadline" });
  assert.deepEqual(good, { q: "legal aid", type: "job", location: "remote", paid: "no", state: "CA", category: "Education", relevance: "required", open: true, sort: "deadline" });
  const bad = parseSearchParams({ type: "mentoring", location: "mars", paid: "maybe", state: "CA; DROP TABLE", category: "Crypto", relevance: "x", open: "true", sort: "random", q: ["a", "b"] });
  assert.deepEqual(bad, { q: "a", type: "", location: "", paid: "", state: "", category: "", relevance: "", open: false, sort: "newest" });
  const odd = parseSearchParams({ type: { $ne: 1 }, q: 5, state: ["CA"], open: ["1"] });
  assert.equal(odd.type, "");
  assert.equal(odd.q, "");
  assert.equal(odd.state, "CA");
  assert.equal(odd.open, true);
});

test("the search words are capped in length", () => {
  assert.equal(parseSearchParams({ q: "x".repeat(500) }).q.length, MAX_QUERY_LENGTH);
});

test("the database filter always keeps the public rule and adds only what was chosen", () => {
  const publicWhere = { approvalStatus: "approved", status: { not: "archived" } };
  assert.deepEqual(buildWhere(parseSearchParams({}), publicWhere, "2026-10-27"), publicWhere);
  const where = buildWhere(parseSearchParams({ type: "job", location: "remote", paid: "yes", state: "CA", category: "Education", relevance: "welcomed" }), publicWhere, "2026-10-27");
  assert.deepEqual(where, { approvalStatus: "approved", status: { not: "archived" }, type: "job", locationType: "remote", isPaid: true, state: { equals: "CA", mode: "insensitive" }, category: "Education", livedExperienceRelevance: "welcomed" });
  const open = buildWhere(parseSearchParams({ open: "1" }), publicWhere, "2026-10-27");
  assert.equal(open.approvalStatus, "approved"); // still approved only
  assert.equal(open.status, "active"); // open means active, so archived stays out too
  assert.deepEqual(open.OR, [{ deadline: null }, { deadline: { gte: new Date("2026-10-27T00:00:00.000Z") } }]);
  // A tampered value cannot remove the public rule.
  assert.equal(buildWhere(parseSearchParams({ approvalStatus: "pending", status: "archived" }), publicWhere, "2026-10-27").approvalStatus, "approved");
});

test("sorting: newest first by default, or nearest deadline first with no-deadline listings last", () => {
  assert.deepEqual(buildOrderBy("newest"), [{ datePosted: "desc" }, { id: "asc" }]);
  assert.deepEqual(buildOrderBy("anything"), [{ datePosted: "desc" }, { id: "asc" }]);
  assert.deepEqual(buildOrderBy("deadline")[0], { deadline: { sort: "asc", nulls: "last" } });
});

test("text is compared without capitals or accents", () => {
  assert.equal(normalizeText("Pasantía EDUCACIÓN ñandú"), "pasantia educacion nandu");
  assert.equal(normalizeText(null), "");
});

test("an empty search matches everything", () => {
  assert.equal(search("").length, 10);
  assert.equal(search("   ").length, 10);
});

test("a search finds words in the title, organization, description, requirements and skills", () => {
  assert.equal(search("legal").length, 2); // Bright Path Legal Aid (organization)
  assert.equal(search("expungement").length, 1); // a title
  assert.equal(search("housing").length, 2); // one description, one title
  assert.equal(search("record sealing").length, 1); // a skill
  assert.equal(search("denver").length, 1); // a city, and the summary
});

test("capitals and accents do not matter, and every word must match", () => {
  assert.equal(search("LEGAL").length, search("legal").length);
  const internships = LISTINGS.filter((row) => row.type === "internship");
  assert.equal(internships.filter((row) => matchesQuery(row, "pasantia", ["Pasantía"])).length, 2);
  assert.equal(search("legal intern").length, 2); // both words, any order
  assert.equal(search("intern legal").length, 2);
  assert.equal(search("legal zebra").length, 0); // one word is missing
});

test("odd input is just text: quotes, percent signs, tags and very long strings find nothing and break nothing", () => {
  for (const q of ["'; DROP TABLE \"Opportunity\"; --", "%", "_", "<script>alert(1)</script>", "\\", "x".repeat(10000)]) {
    assert.doesNotThrow(() => search(q));
    assert.equal(search(q).length, 0, q.slice(0, 20));
  }
});

test("only the first eight words of a search are used", () => {
  // Sixteen single letters: only a..h count, and every listing contains all of those letters.
  assert.equal(search("a b c d e f g h i j k l m n o p").length, 10);
  assert.equal(search("a b c d e f g h zzzz").length, 10); // the ninth word is ignored
});

test("both languages have a name for every category", () => {
  for (const category of CATEGORIES) {
    assert.ok(en.categories[category], `English is missing ${category}`);
    assert.ok(es.categories[category], `Spanish is missing ${category}`);
  }
  assert.deepEqual(Object.keys(en.categories).sort(), [...CATEGORIES].sort());
});
