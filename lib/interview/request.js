// The interview request: checking what the browser sent, and building the message for the AI. Plain JavaScript, relative imports.
import { isValidListingId } from "../opportunityDetail.js";
import { MAX_ANSWER_CHARS, MIN_ANSWER_CHARS, QUESTIONS_PER_INTERVIEW, getCategory } from "./questions.js";

// The browser sends only { lang, category OR opportunityId, answers }. The QUESTIONS are never sent: the server builds them.
// Returns { ok: true, data } or { ok: false, errors: [{ field, code }] }.
export function validateInterviewRequest(input) {
  if (input === null || typeof input !== "object" || Array.isArray(input)) {
    return { ok: false, errors: [{ field: "body", code: "invalid" }] };
  }
  const errors = [];
  for (const key of Object.keys(input)) if (!["lang", "category", "opportunityId", "answers"].includes(key)) errors.push({ field: key, code: "unknown" });

  if (input.lang !== "en" && input.lang !== "es") errors.push({ field: "lang", code: "invalid" });

  const hasCategory = input.category !== undefined && input.category !== null;
  const hasListing = input.opportunityId !== undefined && input.opportunityId !== null;
  if (hasCategory === hasListing) errors.push({ field: "category", code: "invalid" }); // exactly one of the two
  else if (hasCategory && !getCategory(input.category)) errors.push({ field: "category", code: "invalid" });
  else if (hasListing && !isValidListingId(input.opportunityId)) errors.push({ field: "opportunityId", code: "invalid" });

  const answers = [];
  if (!Array.isArray(input.answers) || input.answers.length !== QUESTIONS_PER_INTERVIEW) {
    errors.push({ field: "answers", code: "invalid" });
  } else {
    input.answers.forEach((raw, index) => {
      const text = typeof raw === "string" ? raw.replace(/[ \t]+/g, " ").replace(/\n{3,}/g, "\n\n").trim() : null;
      if (text === null) errors.push({ field: `answers.${index}`, code: "invalid" });
      else if (text.length < MIN_ANSWER_CHARS) errors.push({ field: `answers.${index}`, code: "tooShort" });
      else if (text.length > MAX_ANSWER_CHARS) errors.push({ field: `answers.${index}`, code: "tooLong" });
      else answers.push(text);
    });
  }

  if (errors.length > 0) return { ok: false, errors };
  return { ok: true, data: { lang: input.lang, categoryId: hasCategory ? input.category : null, opportunityId: hasListing ? input.opportunityId : null, answers } };
}

// Angle brackets are removed from every untrusted text so none can close a tag and add "instructions". Line breaks are kept.
const clean = (text) => String(text ?? "").replace(/[<>]/g, " ").replace(/[ \t]+/g, " ").trim();

// `listing` (optional): the public listing, for context in "practice for this role" mode.
export function buildInterviewMessage({ lang, questions, answers, listing }) {
  const pairs = questions.map((q, i) => `<question number="${i + 1}">${clean(q)}</question>\n<answer number="${i + 1}">\n${clean(answers[i])}\n</answer>`).join("\n");
  const context = listing
    ? `<listing>\nTitle: ${clean(listing.title)}\nOrganization: ${clean(listing.organization)}\nDescription: ${clean(listing.summary || listing.description)}\nRequirements: ${clean(listing.requirements)}\n</listing>\n`
    : "";
  return `<reply_language>${lang}</reply_language>\n${context}${pairs}`;
}
