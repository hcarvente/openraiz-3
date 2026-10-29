// Checks the AI's translation draft. The answer is UNTRUSTED. It must be valid JSON of the right shape and size, and because
// this text may end up on the public site after the admin saves it, it must not smuggle anything in: no web addresses or email
// addresses that are not in the original, no HTML, no markdown noise, and every number in the original (pay, dates, counts)
// must still be there. Pure functions, no AI, no network.
export const LIMITS = { title: 200, summary: 280, description: 5000, requirements: 3000 };
const FIELDS = ["title", "summary", "description", "requirements"];
const REQUIRED_IN_ANSWER = ["title", "description"]; // these two are always translated; summary and requirements only when the source has them

const fail = (reason) => ({ ok: false, reason });
const isString = (v) => typeof v === "string";

const URL_PATTERN = /https?:\/\/[^\s)]+|www\.[^\s)]+/gi;
const EMAIL_PATTERN = /[\w.+-]+@[\w-]+\.[\w.-]+/g;

// `source`: the original text { title, summary, description, requirements } (any may be empty or null).
export function validateTranslationDraft(raw, source) {
  if (raw === null || typeof raw !== "object" || Array.isArray(raw)) return fail("answer is not an object");

  const src = Object.fromEntries(FIELDS.map((f) => [f, (source?.[f] ?? "").toString().trim()]));
  const value = {};
  for (const field of FIELDS) {
    // A field that is empty in the original stays empty, whatever the AI wrote for it.
    if (src[field] === "") {
      value[field] = "";
      continue;
    }
    const text = raw[field];
    if (!isString(text)) return fail(`${field} is missing or not text`);
    const clean = text.trim();
    if (clean === "") return fail(`${field} is empty`);
    if (clean.length > LIMITS[field]) return fail(`${field} is too long`);
    value[field] = clean;
  }
  for (const field of REQUIRED_IN_ANSWER) if (value[field] === "") return fail(`${field} is empty`);

  const original = FIELDS.map((f) => src[f]).join("\n");
  const translated = FIELDS.map((f) => value[f]).join("\n");

  if (/<[a-z/!][^>]*>/i.test(translated)) return fail("answer contains markup");
  if (/[*_`#]{2,}|\]\(/.test(translated)) return fail("answer contains markdown");
  for (const url of translated.match(URL_PATTERN) ?? []) if (!original.includes(url.replace(/[.,;:]+$/, ""))) return fail("answer contains a web address that is not in the original");
  for (const email of translated.match(EMAIL_PATTERN) ?? []) if (!original.toLowerCase().includes(email.toLowerCase())) return fail("answer contains an email address that is not in the original");
  for (const number of new Set(original.match(/\d{2,}/g) ?? [])) if (!translated.includes(number)) return fail(`the number ${number} from the original is missing`);

  return { ok: true, value };
}

// The AI hands back TEXT: parse it and validate it against the original.
export function parseAndValidateDraft(text, source) {
  if (typeof text !== "string" || text.trim() === "") return fail("response text is empty");
  let parsed;
  try {
    parsed = JSON.parse(text);
  } catch {
    return fail("response is not valid JSON");
  }
  return validateTranslationDraft(parsed, source);
}
