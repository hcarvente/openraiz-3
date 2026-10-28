// Moving a listing between the posting form's answers and the database row. Plain JavaScript with relative imports only,
// so `npm test` can run it. Used by the posting form (to build what it sends) and by the edit page (to fill the form).
import { allowsEventDate } from "./opportunityTaxonomy.js";
import { parseSkillsText } from "./opportunityOptions.js";

// The words validatePost puts in `compensation` when the poster typed no note. They are not shown as a note when editing.
const DEFAULT_PAY_WORDS = ["Free", "Paid", "Gratis", "Con pago"];

export const EMPTY_POST_VALUES = {
  type: "", title: "", description: "", paid: "no", payNote: "", eventDate: "", deadline: "", locationType: "remote",
  city: "", state: "", how: "platform", applyValue: "", summary: "", requirements: "", category: "", skills: "",
  commitment: "", relevance: "welcomed", guidelines: false,
};

const isoDate = (value) => (value instanceof Date ? value.toISOString().slice(0, 10) : typeof value === "string" ? value.slice(0, 10) : "");

// The short answers the server expects (see lib/validatePost.js) from the form's values. Empty optional answers are left out.
export function buildPostBody(values, textLang) {
  const hasPlace = values.locationType === "onsite" || values.locationType === "hybrid";
  const showEventDate = allowsEventDate(values.type);
  const showDeadline = values.type !== "" && !showEventDate && values.type !== "resource";
  const body = {
    type: values.type, title: values.title, description: values.description, lang: textLang, paid: values.paid,
    locationType: values.locationType, applyMethodType: values.how, relevance: values.relevance, guidelines: values.guidelines,
  };
  if (values.payNote.trim()) body.payNote = values.payNote;
  if (showEventDate && values.eventDate) body.eventDate = values.eventDate;
  if (showDeadline && values.deadline) body.deadline = values.deadline;
  if (hasPlace) {
    body.city = values.city;
    body.state = values.state;
  }
  if (values.how !== "platform") body.applyMethodValue = values.applyValue;
  if (values.summary.trim()) body.summary = values.summary;
  if (values.requirements.trim()) body.requirements = values.requirements;
  if (values.category) body.category = values.category;
  if (values.commitment.trim()) body.commitment = values.commitment;
  const skills = parseSkillsText(values.skills);
  if (skills.length > 0) body.skills = skills;
  return body;
}

// A saved listing (a database row) as the form's values, for editing. The guidelines box starts unticked: whoever
// saves a change confirms it again.
export function valuesFromListing(row) {
  return {
    type: row.type ?? "",
    title: row.title ?? "",
    description: row.description ?? "",
    paid: row.isPaid ? "yes" : "no",
    payNote: DEFAULT_PAY_WORDS.includes(row.compensation) ? "" : row.compensation ?? "",
    eventDate: isoDate(row.eventDate),
    deadline: isoDate(row.deadline),
    locationType: row.locationType ?? "remote",
    city: row.city ?? "",
    state: row.state ?? "",
    how: row.applyMethodType ?? "platform",
    applyValue: row.applyMethodType === "platform" ? "" : row.applyMethodValue ?? "",
    summary: row.summary ?? "",
    requirements: row.requirements ?? "",
    category: row.category ?? "",
    skills: Array.isArray(row.skills) ? row.skills.join(", ") : "",
    commitment: row.commitment ?? "",
    relevance: row.livedExperienceRelevance ?? "welcomed",
    guidelines: false,
  };
}
