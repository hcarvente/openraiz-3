// Server-side validation for creating an opportunity (POST /api/opportunities).
//
// validateOpportunity(body) returns either
//   { ok: true,  data }    data is ready for prisma.opportunity.create(): trimmed strings,
//                          empty optional values as null, and dates as UTC Date objects
//   { ok: false, errors }  errors is a list of { field, message } that is safe to show to clients
//
// The allowed values below must match the enums in prisma/schema.prisma.
import { CATEGORIES, OPPORTUNITY_TYPES, SKILLS_LIMITS, allowsEventDate } from "./opportunityTaxonomy.js";

const LIVED_EXPERIENCE_RELEVANCE = ["required", "preferred", "welcomed", "relevant"];
const STATUSES = ["active", "filled", "archived"];
const LOCATION_TYPES = ["remote", "hybrid", "onsite"];
const APPLY_METHOD_TYPES = ["url", "email"];

// Fields a client may send. Everything else is rejected.
const REQUIRED_FIELDS = [
  "title",
  "organization",
  "description",
  "type",
  "livedExperienceRelevance",
  "locationType",
  "isPaid",
  "compensation",
  "datePosted",
  "applyMethodType",
  "applyMethodValue",
];
const OPTIONAL_FIELDS = [
  "status", "city", "state", "address", "deadline",
  "summary", "requirements", "skills", "category", "commitment", "eventDate",
];

// Fields the server controls. A client may never set them.
// (Who owns a listing and whether it is approved are decided by the server too, never by the request body.)
const PROTECTED_FIELDS = ["id", "legacyId", "createdAt", "lastUpdated", "source", "approvalStatus", "rejectionReason", "ownerUserId"];

const MAX_LENGTH = {
  title: 200,
  organization: 200,
  description: 5000,
  compensation: 200,
  applyMethodValue: 500,
  city: 100,
  state: 100,
  address: 300,
  summary: 280,
  requirements: 3000,
  commitment: 100,
};

const MIN_YEAR = 2000;
const MAX_YEAR = 2100;

// Turns "YYYY-MM-DD" into a Date at midnight UTC, or returns null if it is not a real calendar date.
function parseCalendarDate(value) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return null;
  const [year, month, day] = [Number(match[1]), Number(match[2]), Number(match[3])];
  if (year < MIN_YEAR || year > MAX_YEAR) return null;
  const date = new Date(Date.UTC(year, month - 1, day));
  // Dates like 2026-02-30 roll over into March, so check the date round-trips unchanged.
  const isRealDate =
    date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day;
  return isRealDate ? date : null;
}

function isValidWebUrl(value) {
  if (/\s/.test(value)) return false;
  try {
    const url = new URL(value);
    return (url.protocol === "http:" || url.protocol === "https:") && url.hostname.includes(".");
  } catch {
    return false;
  }
}

function isValidEmail(value) {
  return value.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function validateOpportunity(body) {
  if (body === null || typeof body !== "object" || Array.isArray(body)) {
    return { ok: false, errors: [{ field: "body", message: "Request body must be a JSON object." }] };
  }

  const errors = [];
  const fail = (field, message) => errors.push({ field, message });
  const data = {};

  // 1. Protected and unknown fields
  const allowed = new Set([...REQUIRED_FIELDS, ...OPTIONAL_FIELDS]);
  for (const key of Object.keys(body)) {
    if (PROTECTED_FIELDS.includes(key)) {
      fail(key, "This field is set by the server and cannot be supplied.");
    } else if (!allowed.has(key)) {
      fail(key, "Unknown field.");
    }
  }

  // 2. Text fields. Required ones must be non-empty; optional ones may be missing, null or empty.
  const readText = (field, { required }) => {
    const value = body[field];
    if (value === undefined || value === null || value === "") {
      if (required) fail(field, "This field is required.");
      return null;
    }
    if (typeof value !== "string") {
      fail(field, "Must be text.");
      return null;
    }
    const text = value.trim();
    if (text === "") {
      if (required) fail(field, "This field is required.");
      return null;
    }
    if (text.length > MAX_LENGTH[field]) {
      fail(field, `Must be ${MAX_LENGTH[field]} characters or fewer.`);
      return null;
    }
    return text;
  };

  const title = readText("title", { required: true });
  const organization = readText("organization", { required: true });
  const description = readText("description", { required: true });
  const compensation = readText("compensation", { required: true });
  const applyMethodValue = readText("applyMethodValue", { required: true });
  const city = readText("city", { required: false });
  const state = readText("state", { required: false });
  const address = readText("address", { required: false });
  const summary = readText("summary", { required: false });
  const requirements = readText("requirements", { required: false });
  const commitment = readText("commitment", { required: false });

  // 3. Enums
  const readEnum = (field, allowedValues, { required }) => {
    const value = body[field];
    if (value === undefined || value === null) {
      if (required) fail(field, "This field is required.");
      return undefined;
    }
    if (typeof value !== "string" || !allowedValues.includes(value)) {
      fail(field, `Must be one of: ${allowedValues.join(", ")}.`);
      return undefined;
    }
    return value;
  };

  const type = readEnum("type", OPPORTUNITY_TYPES, { required: true });
  const livedExperienceRelevance = readEnum("livedExperienceRelevance", LIVED_EXPERIENCE_RELEVANCE, { required: true });
  const locationType = readEnum("locationType", LOCATION_TYPES, { required: true });
  const applyMethodType = readEnum("applyMethodType", APPLY_METHOD_TYPES, { required: true });
  const status = readEnum("status", STATUSES, { required: false });
  const category = readEnum("category", CATEGORIES, { required: false });

  // Skills: a list of short texts. Missing or null means none. Blanks are dropped and repeats (ignoring case) are removed.
  const skills = [];
  if (body.skills !== undefined && body.skills !== null) {
    if (!Array.isArray(body.skills)) {
      fail("skills", "Must be a list of skills.");
    } else if (body.skills.length > SKILLS_LIMITS.maxItems * 3) {
      fail("skills", `Use at most ${SKILLS_LIMITS.maxItems} skills.`);
    } else {
      const seen = new Set();
      for (const item of body.skills) {
        if (typeof item !== "string") {
          fail("skills", "Each skill must be text.");
          break;
        }
        const skill = item.trim();
        if (skill === "" || seen.has(skill.toLowerCase())) continue;
        if (skill.length > SKILLS_LIMITS.maxLength) {
          fail("skills", `Each skill must be ${SKILLS_LIMITS.maxLength} characters or fewer.`);
          break;
        }
        seen.add(skill.toLowerCase());
        skills.push(skill);
      }
      if (skills.length > SKILLS_LIMITS.maxItems && !errors.some((e) => e.field === "skills")) {
        fail("skills", `Use at most ${SKILLS_LIMITS.maxItems} skills.`);
      }
    }
  }

  // 4. Boolean
  let isPaid;
  if (body.isPaid === undefined || body.isPaid === null) {
    fail("isPaid", "This field is required.");
  } else if (typeof body.isPaid !== "boolean") {
    fail("isPaid", "Must be true or false.");
  } else {
    isPaid = body.isPaid;
  }

  // 5. Dates: "YYYY-MM-DD" only, read as UTC calendar dates. Past deadlines are allowed.
  const readDate = (field, { required }) => {
    const value = body[field];
    if (value === undefined || value === null || value === "") {
      if (required) fail(field, "This field is required.");
      return null;
    }
    if (typeof value !== "string") {
      fail(field, "Must be a date written as YYYY-MM-DD.");
      return null;
    }
    const date = parseCalendarDate(value);
    if (!date) {
      fail(field, `Must be a real calendar date written as YYYY-MM-DD (years ${MIN_YEAR} to ${MAX_YEAR}).`);
      return null;
    }
    return date;
  };

  const datePosted = readDate("datePosted", { required: true });
  const deadline = readDate("deadline", { required: false }); // empty means a rolling opportunity
  const eventDate = readDate("eventDate", { required: false });
  if (eventDate && type && !allowsEventDate(type) && !errors.some((e) => e.field === "eventDate")) {
    fail("eventDate", "Only workshops and events can have an event date.");
  }

  // 6. Location details must fit the location type
  if (locationType === "remote") {
    for (const [field, value] of [["city", city], ["state", state], ["address", address]]) {
      if (value !== null) fail(field, "Must be empty for a remote opportunity.");
    }
  } else if (locationType === "hybrid" || locationType === "onsite") {
    if (city === null && !errors.some((e) => e.field === "city")) fail("city", "Required for hybrid and onsite opportunities.");
    if (state === null && !errors.some((e) => e.field === "state")) fail("state", "Required for hybrid and onsite opportunities.");
  }

  // 7. Application method and its value
  if (applyMethodType && applyMethodValue) {
    if (applyMethodType === "url" && !isValidWebUrl(applyMethodValue)) {
      fail("applyMethodValue", "Must be a valid web link starting with http:// or https://.");
    }
    if (applyMethodType === "email" && !isValidEmail(applyMethodValue)) {
      fail("applyMethodValue", "Must be a valid email address.");
    }
  }

  // 8. Obvious compensation contradictions only (no pay parsing)
  if (isPaid !== undefined && compensation) {
    if (isPaid === true && /^(unpaid|not paid|no pay|no compensation|volunteer)\b/i.test(compensation)) {
      fail("compensation", 'Says the role is unpaid, but isPaid is true.');
    }
    if (isPaid === false && /^paid\b/i.test(compensation)) {
      fail("compensation", 'Says the role is paid, but isPaid is false.');
    }
  }

  if (errors.length > 0) return { ok: false, errors };

  return {
    ok: true,
    data: {
      title,
      organization,
      description,
      type,
      livedExperienceRelevance,
      ...(status ? { status } : {}), // otherwise the database default ("active") applies
      locationType,
      city,
      state,
      address,
      isPaid,
      compensation,
      datePosted,
      deadline,
      applyMethodType,
      applyMethodValue,
      summary,
      requirements,
      skills,
      category: category ?? null,
      commitment,
      eventDate,
    },
  };
}
