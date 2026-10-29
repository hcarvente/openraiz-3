// The admin's decisions on listings, kept apart from the web layer so every case can be tested: approving, rejecting
// (with a reason the poster will read) and saving a translation. Who may do this (the admin) is decided by the route
// before these run. `loadListing` and `update` are passed in, so the tests need no database.
//
// Each function returns { status, body } for the response.

const MAX = { title: 200, summary: 280, description: 5000, requirements: 3000, reason: 500 };
const TRANSLATION_FIELDS = ["title", "summary", "description", "requirements"];
const TO_COLUMN = { title: "titleTr", summary: "summaryTr", description: "descriptionTr", requirements: "requirementsTr" };

// A translation from the admin: { title, summary?, description, requirements? }. Title and description are required
// (without them the translated page would be mostly the original); the rest may be left empty. Returns
// { ok: true, data } with the database columns, or { ok: false, errors: [{ field, message }] }.
export function validateTranslation(input) {
  if (input === null || typeof input !== "object" || Array.isArray(input)) {
    return { ok: false, errors: [{ field: "translation", message: "Send the translation as an object." }] };
  }
  const errors = [];
  const data = {};
  for (const key of Object.keys(input)) {
    if (!TRANSLATION_FIELDS.includes(key)) errors.push({ field: key, message: "Unknown field." });
  }
  for (const field of TRANSLATION_FIELDS) {
    const value = input[field];
    const required = field === "title" || field === "description";
    if (value === undefined || value === null || (typeof value === "string" && value.trim() === "")) {
      if (required) errors.push({ field, message: "This field is required." });
      data[TO_COLUMN[field]] = null;
      continue;
    }
    if (typeof value !== "string") {
      errors.push({ field, message: "Must be text." });
      continue;
    }
    const text = value.trim();
    if (text.length > MAX[field]) errors.push({ field, message: `Must be ${MAX[field]} characters or fewer.` });
    else data[TO_COLUMN[field]] = text;
  }
  if (errors.length > 0) return { ok: false, errors };
  return { ok: true, data: { ...data, translationStatus: "approved" } };
}

// True when the admin typed anything into the translation form.
const hasAnyText = (input) =>
  input !== null && typeof input === "object" && TRANSLATION_FIELDS.some((f) => typeof input[f] === "string" && input[f].trim() !== "");

const notFound = { status: 404, body: { error: "Listing not found." } };

export async function approveListing({ id, translation, loadListing, update }) {
  const listing = await loadListing(id);
  if (!listing || listing.status === "archived") return notFound;
  if (listing.approvalStatus !== "pending") return { status: 409, body: { error: "Only a listing that is waiting for review can be approved." } };

  let translationData = {};
  if (hasAnyText(translation)) {
    const result = validateTranslation(translation);
    if (!result.ok) return { status: 400, body: { error: "Invalid translation.", details: result.errors } };
    translationData = result.data;
  }
  await update(id, { approvalStatus: "approved", rejectionReason: null, ...translationData });
  return { status: 200, body: { id, approvalStatus: "approved" } };
}

export async function rejectListing({ id, reason, loadListing, update }) {
  const text = typeof reason === "string" ? reason.trim() : "";
  if (text.length === 0) return { status: 400, body: { error: "A reason is required.", details: [{ field: "reason", message: "This field is required." }] } };
  if (text.length > MAX.reason) return { status: 400, body: { error: "The reason is too long.", details: [{ field: "reason", message: `Must be ${MAX.reason} characters or fewer.` }] } };

  const listing = await loadListing(id);
  if (!listing || listing.status === "archived") return notFound;
  // A listing waiting for review is sent back; one already approved is taken down. Either way the poster reads the reason.
  if (listing.approvalStatus !== "pending" && listing.approvalStatus !== "approved") {
    return { status: 409, body: { error: "Only a pending or approved listing can be rejected." } };
  }

  await update(id, { approvalStatus: "rejected", rejectionReason: text });
  return { status: 200, body: { id, approvalStatus: "rejected" } };
}

// Saves (or replaces) the translation of any listing that is not withdrawn. The admin saving it counts as the review,
// so its status becomes "approved"; the listing's own approval is not touched.
export async function saveTranslation({ id, translation, loadListing, update }) {
  const listing = await loadListing(id);
  if (!listing || listing.status === "archived") return notFound;
  const result = validateTranslation(translation);
  if (!result.ok) return { status: 400, body: { error: "Invalid translation.", details: result.errors } };
  await update(id, result.data);
  return { status: 200, body: { id, translationStatus: "approved" } };
}
