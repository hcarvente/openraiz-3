// Shared constants and small helpers for the opportunity form (components/OpportunityForm.js).
// Everything here is plain JavaScript with no React, so it can run in the browser or on the server.
//
// The option values below must match the enums in prisma/schema.prisma and the lists in
// lib/validateOpportunity.js. The server is the authority: it re-checks everything.
import { CATEGORIES, allowsEventDate } from "./opportunityTaxonomy.js";

export const OPPORTUNITY_TYPE_OPTIONS = [
  { value: "job", label: "Job" },
  { value: "internship", label: "Internship" },
  { value: "fellowship", label: "Fellowship" },
  { value: "volunteer", label: "Volunteer" },
  { value: "workshop", label: "Workshop" },
  { value: "event", label: "Event / meetup" },
  { value: "resource", label: "Resource" },
];

export const CATEGORY_OPTIONS = CATEGORIES.map((category) => ({ value: category, label: category }));

export const LIVED_EXPERIENCE_OPTIONS = [
  { value: "required", label: "Required" },
  { value: "preferred", label: "Preferred" },
  { value: "welcomed", label: "Welcomed" },
  { value: "relevant", label: "Relevant" },
];

export const STATUS_OPTIONS = [
  { value: "active", label: "Active" },
  { value: "filled", label: "Filled" },
  { value: "archived", label: "Archived" },
];

export const LOCATION_TYPE_OPTIONS = [
  { value: "remote", label: "Remote" },
  { value: "hybrid", label: "Hybrid" },
  { value: "onsite", label: "On-site" },
];

export const APPLY_METHOD_OPTIONS = [
  { value: "url", label: "Web link (URL)" },
  { value: "email", label: "Email address" },
];

// Same limits as the server (lib/validateOpportunity.js). The inputs use them as maxLength.
export const FIELD_LIMITS = {
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

// Names shown in the error summary, keyed by the field names the API uses.
export const FIELD_LABELS = {
  title: "Title",
  organization: "Organization",
  type: "Opportunity type",
  description: "Description",
  isPaid: "Paid or unpaid",
  compensation: "Compensation",
  livedExperienceRelevance: "Lived-experience relevance",
  locationType: "Work arrangement",
  city: "City",
  state: "State",
  address: "Address",
  applyMethodType: "Application method",
  applyMethodValue: "Application link or email",
  datePosted: "Date posted",
  deadline: "Application deadline",
  status: "Status",
  summary: "Short summary",
  requirements: "Requirements",
  skills: "Skills",
  category: "Category",
  commitment: "Time commitment",
  eventDate: "Event date",
};

// The form keeps every value as text (except datePosted, which starts as null), plus `paid` ("yes" / "no" / "" for not chosen yet)
// because a paid-or-unpaid choice is easiest to collect with radio buttons.
export function emptyOpportunityValues() {
  return {
    title: "",
    organization: "",
    type: "",
    description: "",
    paid: "",
    compensation: "",
    livedExperienceRelevance: "",
    locationType: "",
    city: "",
    state: "",
    address: "",
    applyMethodType: "",
    applyMethodValue: "",
    datePosted: null, // null = not touched yet; the form then shows today's date (see todayLocalDate)
    deadline: "",
    status: "active",
    summary: "",
    requirements: "",
    skills: "", // typed as text, separated by commas
    category: "",
    commitment: "",
    eventDate: "",
  };
}

// "Event date" only makes sense for workshops and events.
export function showsEventDate(type) {
  return allowsEventDate(type);
}

// "grant writing, public speaking" -> ["grant writing", "public speaking"]. Blanks are dropped.
export function parseSkillsText(text) {
  return String(text ?? "")
    .split(",")
    .map((skill) => skill.trim())
    .filter(Boolean);
}

// City, state and address only make sense when people go somewhere.
export function showsLocationFields(locationType) {
  return locationType === "hybrid" || locationType === "onsite";
}

// Today's date as the person using the form sees it, written "YYYY-MM-DD".
// Call it only in the browser, after the page has loaded.
export function todayLocalDate() {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${now.getFullYear()}-${month}-${day}`;
}

// Turns the form's values into the flat JSON body POST /api/opportunities expects.
// Optional values that are empty are left out, and location details are left out unless
// the opportunity is hybrid or on-site (the API rejects them for remote opportunities).
export function toRequestBody(values) {
  const body = {
    title: values.title,
    organization: values.organization,
    description: values.description,
    type: values.type,
    livedExperienceRelevance: values.livedExperienceRelevance,
    status: values.status,
    locationType: values.locationType,
    compensation: values.compensation,
    datePosted: values.datePosted,
    applyMethodType: values.applyMethodType,
    applyMethodValue: values.applyMethodValue,
  };

  if (values.paid === "yes") body.isPaid = true;
  if (values.paid === "no") body.isPaid = false;

  if (showsLocationFields(values.locationType)) {
    body.city = values.city;
    body.state = values.state;
    if (values.address.trim() !== "") body.address = values.address;
  }

  if (values.deadline !== "") body.deadline = values.deadline;

  if (values.summary.trim() !== "") body.summary = values.summary;
  if (values.requirements.trim() !== "") body.requirements = values.requirements;
  if (values.commitment.trim() !== "") body.commitment = values.commitment;
  if (values.category !== "") body.category = values.category;
  const skills = parseSkillsText(values.skills);
  if (skills.length > 0) body.skills = skills;
  if (showsEventDate(values.type) && values.eventDate !== "") body.eventDate = values.eventDate;

  // Blank required fields are still sent (as ""), so the server can name them in its error messages.
  return body;
}

// The API's messages are written for programs as well as people (they mention "isPaid" or "YYYY-MM-DD", and
// the update endpoint adds a note about saved values). This rewrites them in plain words for the form,
// keeping their meaning. Messages it does not know are left exactly as they are.
export function simplifyErrorMessage(message) {
  return message
    .replace(/\s*\(This is the value currently saved; include this field in the request to change it\.\)/g, "")
    .replace("Says the role is unpaid, but isPaid is true.", 'The compensation says unpaid, but "Paid" is selected.')
    .replace("Says the role is paid, but isPaid is false.", 'The compensation says paid, but "Unpaid" is selected.')
    .replace(/Must be a real calendar date written as YYYY-MM-DD \(years (\d+) to (\d+)\)\./, "Must be a real date between $1 and $2.")
    .replace("Must be true or false.", "Choose Paid or Unpaid.")
    .replace(/Must be one of: [^.]*\./, "Please choose one of the available options.")
    .replace("hybrid and onsite", "hybrid and on-site")
    .trim();
}

// The API reports problems as [{ field, message }, ...]. This groups them by field name,
// with each message simplified for the form (see simplifyErrorMessage).
export function groupErrorsByField(details) {
  const byField = {};
  if (!Array.isArray(details)) return byField;
  for (const item of details) {
    if (!item || typeof item.field !== "string" || typeof item.message !== "string") continue;
    const message = simplifyErrorMessage(item.message);
    byField[item.field] = byField[item.field] ? `${byField[item.field]} ${message}` : message;
  }
  return byField;
}

// ---------- Editing an existing opportunity ----------

// Turns a saved opportunity (the flat JSON the API returns, dates as "YYYY-MM-DD") into the form's values.
// Empty optional values (null) become empty text, and isPaid becomes the "yes" / "no" radio choice.
export function valuesFromOpportunity(opportunity) {
  return {
    title: opportunity.title ?? "",
    organization: opportunity.organization ?? "",
    type: opportunity.type ?? "",
    description: opportunity.description ?? "",
    paid: opportunity.isPaid === true ? "yes" : opportunity.isPaid === false ? "no" : "",
    compensation: opportunity.compensation ?? "",
    livedExperienceRelevance: opportunity.livedExperienceRelevance ?? "",
    locationType: opportunity.locationType ?? "",
    city: opportunity.city ?? "",
    state: opportunity.state ?? "",
    address: opportunity.address ?? "",
    applyMethodType: opportunity.applyMethodType ?? "",
    applyMethodValue: opportunity.applyMethodValue ?? "",
    datePosted: opportunity.datePosted ?? null,
    deadline: opportunity.deadline ?? "",
    status: opportunity.status ?? "active",
    summary: opportunity.summary ?? "",
    requirements: opportunity.requirements ?? "",
    skills: Array.isArray(opportunity.skills) ? opportunity.skills.join(", ") : "",
    category: opportunity.category ?? "",
    commitment: opportunity.commitment ?? "",
    eventDate: opportunity.eventDate ?? "",
  };
}

// The form's values in the shape the API stores them: trimmed text, an optional value that is empty as
// null, isPaid as true / false, and city / state / address as null unless the opportunity is hybrid or on-site.
// Two sets of values can be compared field by field after this.
function apiFieldsFromValues(values) {
  const text = (value) => (typeof value === "string" ? value.trim() : value);
  const optionalText = (value) => {
    const trimmed = typeof value === "string" ? value.trim() : "";
    return trimmed === "" ? null : trimmed;
  };
  const hasPlace = showsLocationFields(values.locationType);
  return {
    title: text(values.title),
    organization: text(values.organization),
    description: text(values.description),
    type: values.type,
    livedExperienceRelevance: values.livedExperienceRelevance,
    status: values.status,
    locationType: values.locationType,
    city: hasPlace ? optionalText(values.city) : null,
    state: hasPlace ? optionalText(values.state) : null,
    address: hasPlace ? optionalText(values.address) : null,
    isPaid: values.paid === "yes" ? true : values.paid === "no" ? false : null,
    compensation: text(values.compensation),
    datePosted: values.datePosted,
    deadline: optionalText(values.deadline),
    applyMethodType: values.applyMethodType,
    applyMethodValue: text(values.applyMethodValue),
    summary: optionalText(values.summary),
    requirements: optionalText(values.requirements),
    skills: parseSkillsText(values.skills),
    category: values.category === "" ? null : values.category,
    commitment: optionalText(values.commitment),
    eventDate: showsEventDate(values.type) ? optionalText(values.eventDate) : null,
  };
}

// Builds the body for PATCH /api/opportunities/[id]: only the fields whose value differs between the values
// the form started with and the values it has now. Clearing an optional value sends null, and switching to
// Remote therefore sends city, state and address as null (the API requires them to be cleared explicitly).
// An empty object means nothing changed.
export function toPatchBody(originalValues, currentValues) {
  const before = apiFieldsFromValues(originalValues);
  const after = apiFieldsFromValues(currentValues);
  const body = {};
  for (const field of Object.keys(after)) {
    // Lists (skills) are compared by content; an emptied list is sent as an empty list.
    const changed = Array.isArray(after[field])
      ? JSON.stringify(before[field]) !== JSON.stringify(after[field])
      : before[field] !== after[field];
    if (changed) body[field] = after[field];
  }
  return body;
}
