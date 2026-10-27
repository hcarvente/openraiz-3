// Search and filters for the opportunities list. Plain JavaScript with relative imports only, so `npm test` can run it.
//
// The address carries everything (?q=salud&type=job&location=remote&paid=yes&sort=deadline), so a result can be shared.
// parseSearchParams turns whatever is in the address into safe filter values (anything unknown means "no filter");
// buildWhere and buildOrderBy turn those into Prisma options; matchesQuery does the word search in code, ignoring
// capitals and accents ("pasantia" finds "Pasantía").
import { CATEGORIES, OPPORTUNITY_TYPES } from "./opportunityTaxonomy.js";

export const LOCATION_VALUES = ["remote", "hybrid", "onsite"];
export const RELEVANCE_VALUES = ["required", "preferred", "welcomed", "relevant"];
export const SORT_VALUES = ["newest", "deadline"];
export const MAX_QUERY_LENGTH = 100;
const MAX_WORDS = 8;

// A value from the address: the first one if it was repeated (?type=a&type=b), and only if it is text.
function first(value) {
  const one = Array.isArray(value) ? value[0] : value;
  return typeof one === "string" ? one : "";
}

const oneOf = (value, allowed) => (allowed.includes(value) ? value : "");

export function parseSearchParams(raw = {}) {
  const q = first(raw.q).replace(/\s+/g, " ").trim().slice(0, MAX_QUERY_LENGTH);
  const state = first(raw.state).trim();
  return {
    q,
    type: oneOf(first(raw.type), OPPORTUNITY_TYPES),
    location: oneOf(first(raw.location), LOCATION_VALUES),
    paid: oneOf(first(raw.paid), ["yes", "no"]),
    state: /^[A-Za-z][A-Za-z .'-]{0,49}$/.test(state) ? state : "",
    category: oneOf(first(raw.category), CATEGORIES),
    relevance: oneOf(first(raw.relevance), RELEVANCE_VALUES),
    open: first(raw.open) === "1",
    sort: oneOf(first(raw.sort), SORT_VALUES) || "newest",
  };
}

// True when the visitor has chosen anything (the sort order alone does not count as a filter).
export function hasActiveFilters(filters) {
  return Boolean(
    filters.q || filters.type || filters.location || filters.paid || filters.state || filters.category || filters.relevance || filters.open,
  );
}

// The database part of the search. `publicWhere` (approved and not archived) always applies; `today` is "YYYY-MM-DD".
export function buildWhere(filters, publicWhere, today) {
  const where = { ...publicWhere };
  if (filters.type) where.type = filters.type;
  if (filters.location) where.locationType = filters.location;
  if (filters.paid) where.isPaid = filters.paid === "yes";
  if (filters.state) where.state = { equals: filters.state, mode: "insensitive" };
  if (filters.category) where.category = filters.category;
  if (filters.relevance) where.livedExperienceRelevance = filters.relevance;
  if (filters.open) {
    // "Open now": still active (not filled) and either no deadline or a deadline that has not passed (today counts).
    where.status = "active";
    where.OR = [{ deadline: null }, { deadline: { gte: new Date(`${today}T00:00:00.000Z`) } }];
  }
  return where;
}

// Newest first (the default), or the nearest deadline first with listings that have no deadline last.
export function buildOrderBy(sort) {
  if (sort === "deadline") {
    return [{ deadline: { sort: "asc", nulls: "last" } }, { datePosted: "desc" }, { id: "asc" }];
  }
  return [{ datePosted: "desc" }, { id: "asc" }];
}

// "Pasantía" -> "pasantia". Used on both the search words and the text they are looked up in.
export function normalizeText(text) {
  return String(text ?? "")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();
}

// Every word of the search must appear somewhere in the listing (any order, any field). `extraTexts` are further
// words to look in, such as the type's name in the visitor's language.
export function matchesQuery(opportunity, q, extraTexts = []) {
  const words = normalizeText(q).split(" ").filter(Boolean).slice(0, MAX_WORDS);
  if (words.length === 0) return true;
  const haystack = normalizeText(
    [
      opportunity.title,
      opportunity.organization,
      opportunity.summary,
      opportunity.description,
      opportunity.requirements,
      Array.isArray(opportunity.skills) ? opportunity.skills.join(" ") : "",
      opportunity.category,
      opportunity.city,
      opportunity.state,
      ...extraTexts,
    ].join(" "),
  );
  return words.every((word) => haystack.includes(word));
}
