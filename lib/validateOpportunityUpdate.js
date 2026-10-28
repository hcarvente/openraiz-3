// Server-side validation for updating an opportunity (PATCH /api/opportunities/[id]).
//
// validateOpportunityUpdate(body, existing) takes the request body (only the fields to change) and the
// opportunity as it is stored now (a Prisma row), and returns either
//   { ok: true,  data }    data holds ONLY the fields named in the request, ready for prisma.opportunity.update():
//                          trimmed text, empty optional values as null, dates as UTC Date objects
//   { ok: false, errors }  errors is a list of { field, message } that is safe to show to clients
//
// How it works: the stored record is turned into the same plain form POST uses (dates as "YYYY-MM-DD"
// text, by serializeOpportunity), the requested changes are laid over it, and the complete result is checked
// by the existing validateOpportunity. So every rule that applies when creating an opportunity applies
// when updating one. Only the fields that were in the request are returned for saving.
import { validateOpportunity } from "./validateOpportunity.js";
import { serializeOpportunity } from "./serializeOpportunity.js";

// The fields a client may send: exactly the ones the POST validator accepts. These lists must match
// lib/validateOpportunity.js (a test checks that they do).
const EDITABLE_FIELDS = [
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
  "status",
  "city",
  "state",
  "address",
  "deadline",
  "summary",
  "requirements",
  "skills",
  "category",
  "commitment",
  "eventDate",
  "originalLang",
];

// Fields the server controls. A client may never set them, on create or on update.
const PROTECTED_FIELDS = [
  "id", "legacyId", "createdAt", "lastUpdated", "source", "approvalStatus", "rejectionReason", "ownerUserId",
  "titleTr", "summaryTr", "descriptionTr", "requirementsTr", "translationStatus",
];

// Only these may be cleared by sending null. Everything else is required (or, for status, always has a value).
const CLEARABLE_FIELDS = ["city", "state", "address", "deadline", "summary", "requirements", "skills", "category", "commitment", "eventDate"];

export function validateOpportunityUpdate(body, existing) {
  if (body === null || typeof body !== "object" || Array.isArray(body)) {
    return { ok: false, errors: [{ field: "body", message: "Request body must be a JSON object." }] };
  }

  const keys = Object.keys(body);
  if (keys.length === 0) {
    return { ok: false, errors: [{ field: "body", message: "Send at least one field to update." }] };
  }

  // 1. Check the request's own fields first: protected, unknown, or cleared when that is not allowed.
  const errors = [];
  for (const key of keys) {
    if (PROTECTED_FIELDS.includes(key)) {
      errors.push({ field: key, message: "This field is set by the server and cannot be supplied." });
    } else if (!EDITABLE_FIELDS.includes(key)) {
      errors.push({ field: key, message: "Unknown field." });
    } else if (body[key] === null && !CLEARABLE_FIELDS.includes(key)) {
      errors.push({ field: key, message: "This field is required and cannot be cleared." });
    }
  }
  if (errors.length > 0) return { ok: false, errors };

  // 2. Build the full record to check: today's stored values for the editable fields only (never id,
  //    legacyId, createdAt, lastUpdated or source), with the requested changes laid over them.
  const stored = serializeOpportunity(existing); // dates become "YYYY-MM-DD" text, like a POST body
  const merged = {};
  for (const field of EDITABLE_FIELDS) merged[field] = stored[field];
  Object.assign(merged, body);

  // 3. The existing rules decide whether the complete record is valid.
  const result = validateOpportunity(merged);
  if (!result.ok) {
    return {
      ok: false,
      errors: result.errors.map((error) => {
        // A problem in a field the request did not mention comes from a value that is already saved.
        const notInRequest = !keys.includes(error.field);
        const hasSavedValue = EDITABLE_FIELDS.includes(error.field) && stored[error.field] !== null;
        return notInRequest && hasSavedValue
          ? { ...error, message: `${error.message} (This is the value currently saved; include this field in the request to change it.)` }
          : error;
      }),
    };
  }

  // 4. Hand back only what the request named, so nothing else is touched.
  const data = {};
  for (const key of keys) {
    if (key in result.data) data[key] = result.data[key];
  }
  return { ok: true, data };
}
