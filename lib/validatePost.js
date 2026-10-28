// The rules for a listing posted by a signed-in person (an individual or an organization), as opposed to one entered by
// the admin. The posting form sends a SHORT set of answers; this file turns them into a full listing and then runs
// every rule of lib/validateOpportunity.js on it. Plain JavaScript with relative imports only, so `npm test` can run it.
//
// validatePost(input, profile, today) returns
//   { ok: true,  data }    data is ready for prisma.opportunity.create() (the caller adds owner, source and pending status)
//   { ok: false, errors }  errors is a list of { field, code }; the page turns each code into text in the visitor's language
import { validateOpportunity } from "./validateOpportunity.js";
import { OPPORTUNITY_TYPES } from "./opportunityTaxonomy.js";

export const MAX_PENDING_POSTS = 5;

// What each kind of account may post. Individuals are not vetted, so they are limited to one-off, group-setting types.
export const INDIVIDUAL_TYPES = ["workshop", "event", "resource"];
export const ORGANIZATION_TYPES = [...OPPORTUNITY_TYPES];
const ALLOWED_TYPES = { individual: INDIVIDUAL_TYPES, organization: ORGANIZATION_TYPES };
// Individuals never publish an email address (people reach them through OpenRaiz or a link).
const ALLOWED_APPLY = { individual: ["url", "platform"], organization: ["url", "email", "platform"] };

const INPUT_FIELDS = new Set([
  "type", "title", "description", "lang", "paid", "payNote", "eventDate", "deadline", "locationType", "city", "state",
  "applyMethodType", "applyMethodValue", "summary", "requirements", "category", "skills", "commitment", "relevance", "guidelines",
]);

// "Free" / "Paid" in the language the poster wrote the listing in.
const PAY_WORDS = { en: { free: "Free", paid: "Paid" }, es: { free: "Gratis", paid: "Con pago" } };

// The validator's English messages, as short codes the form can show in either language.
export function codeForMessage(message) {
  if (/Required for hybrid and onsite/.test(message)) return "locationRequired";
  if (/is required/.test(message)) return "required";
  if (/characters or fewer/.test(message)) return "tooLong";
  if (/calendar date|YYYY-MM-DD/.test(message)) return "invalidDate";
  if (/valid web link/.test(message)) return "invalidUrl";
  if (/valid email/.test(message)) return "invalidEmail";
  if (/Only workshops and events/.test(message)) return "notAllowed";
  if (/skill/i.test(message)) return "invalidSkills";
  if (/but isPaid is/.test(message)) return "payMismatch";
  return "invalid";
}

// The validator's field names, as the form names them.
const FORM_FIELD = { compensation: "payNote", isPaid: "paid", livedExperienceRelevance: "relevance" };

const clean = (value) => (typeof value === "string" ? value.trim() : value);
const present = (value) => value !== undefined && value !== null && value !== "";

export function validatePost(input, profile, today) {
  if (input === null || typeof input !== "object" || Array.isArray(input)) {
    return { ok: false, errors: [{ field: "body", code: "invalid" }] };
  }
  const errors = [];
  const fail = (field, code) => {
    if (!errors.some((error) => error.field === field)) errors.push({ field, code });
  };

  for (const key of Object.keys(input)) if (!INPUT_FIELDS.has(key)) fail(key, "unknown");
  if (input.guidelines !== true) fail("guidelines", "guidelinesRequired");

  const role = profile?.role;
  if (!ALLOWED_TYPES[role]) fail("body", "noProfile");

  const lang = clean(input.lang);
  if (lang !== "en" && lang !== "es") fail("lang", present(lang) ? "invalid" : "required");

  const paid = clean(input.paid);
  if (paid !== "yes" && paid !== "no") fail("paid", "required");

  const type = clean(input.type);
  if (!present(type)) fail("type", "required");
  else if (!OPPORTUNITY_TYPES.includes(type)) fail("type", "invalid");
  else if (ALLOWED_TYPES[role] && !ALLOWED_TYPES[role].includes(type)) fail("type", "notAllowed");

  const applyMethodType = present(input.applyMethodType) ? clean(input.applyMethodType) : "platform";
  if (ALLOWED_APPLY[role] && typeof applyMethodType === "string" && !ALLOWED_APPLY[role].includes(applyMethodType) && ["url", "email", "platform"].includes(applyMethodType)) {
    fail("applyMethodType", "notAllowed");
  }

  // Build the full listing the rest of the site understands.
  const words = PAY_WORDS[lang] ?? PAY_WORDS.en;
  const body = {
    title: clean(input.title),
    description: clean(input.description),
    type,
    organization: role === "organization" ? profile.orgName || profile.displayName : profile?.displayName,
    livedExperienceRelevance: present(input.relevance) ? clean(input.relevance) : "welcomed",
    locationType: clean(input.locationType),
    isPaid: paid === "yes" ? true : paid === "no" ? false : undefined,
    compensation: present(clean(input.payNote)) ? clean(input.payNote) : paid === "yes" ? words.paid : words.free,
    datePosted: today,
    applyMethodType,
    originalLang: lang,
  };
  if (applyMethodType !== "platform") body.applyMethodValue = clean(input.applyMethodValue);
  else if (present(input.applyMethodValue)) body.applyMethodValue = clean(input.applyMethodValue); // the validator rejects it

  for (const field of ["summary", "requirements", "category", "commitment", "city", "state", "deadline"]) {
    if (present(clean(input[field]))) body[field] = clean(input[field]);
  }
  if (present(input.eventDate)) body.eventDate = clean(input.eventDate);
  if (input.skills !== undefined && input.skills !== null) body.skills = input.skills;

  const result = validateOpportunity(body);
  if (!result.ok) {
    for (const { field, message } of result.errors) fail(FORM_FIELD[field] ?? field, codeForMessage(message));
  }

  if (errors.length > 0) return { ok: false, errors };
  return { ok: true, data: result.data };
}
