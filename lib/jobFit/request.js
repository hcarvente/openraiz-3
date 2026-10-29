// The Job-Fit request: checking what the browser sent, and building the message for the AI. Plain JavaScript, relative imports only.
import { isValidListingId } from "../opportunityDetail.js";

export const MIN_TEXT = 20;
export const MAX_TEXT = 1000;

// The browser sends only { opportunityId, text, lang }. Returns { ok: true, data } or { ok: false, errors: [{ field, code }] }.
export function validateJobFitRequest(input) {
  if (input === null || typeof input !== "object" || Array.isArray(input)) {
    return { ok: false, errors: [{ field: "body", code: "invalid" }] };
  }
  const errors = [];
  for (const key of Object.keys(input)) if (!["opportunityId", "text", "lang"].includes(key)) errors.push({ field: key, code: "unknown" });

  if (!isValidListingId(input.opportunityId)) errors.push({ field: "opportunityId", code: "invalid" });
  if (input.lang !== "en" && input.lang !== "es") errors.push({ field: "lang", code: "invalid" });

  const text = typeof input.text === "string" ? input.text.replace(/\s+/g, " ").trim() : null;
  if (text === null) errors.push({ field: "text", code: "required" });
  else if (text.length < MIN_TEXT) errors.push({ field: "text", code: "tooShort" });
  else if (text.length > MAX_TEXT) errors.push({ field: "text", code: "tooLong" });

  if (errors.length > 0) return { ok: false, errors };
  return { ok: true, data: { opportunityId: input.opportunityId, text, lang: input.lang } };
}

// Text from the listing or the visitor goes between tags the AI is told to treat as data. Angle brackets are removed so no
// text can close a tag early and sneak in "instructions".
export function neutralize(text) {
  return String(text ?? "").replace(/[<>]/g, " ").replace(/\s+/g, " ").trim();
}

// `listing`: the words to show for the visitor's language ({ title, summary, description, requirements }) plus the rest of the
// listing row. Returns the message for the AI.
export function buildJobFitMessage({ listing, text, lang, typeLabel }) {
  const line = (label, value) => (value ? `${label}: ${neutralize(value)}` : null);
  const place = [listing.city, listing.state].filter(Boolean).join(", ");
  const parts = [
    line("Title", listing.title),
    line("Organization", listing.organization),
    line("Type", typeLabel),
    line("Where", `${listing.locationType}${place ? ` ${place}` : ""}`),
    line("Pay", listing.compensation),
    line("Time commitment", listing.commitment),
    line("Category", listing.category),
    line("Summary", listing.summary),
    line("Description", listing.description),
    line("Requirements", listing.requirements),
    line("Skills", Array.isArray(listing.skills) ? listing.skills.join(", ") : ""),
  ].filter(Boolean);
  return `<reply_language>${lang}</reply_language>\n<listing>\n${parts.join("\n")}\n</listing>\n<visitor_text>\n${neutralize(text)}\n</visitor_text>`;
}
