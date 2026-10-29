// Checks the AI's interview feedback. UNTRUSTED, like the visitor's text: before anything reaches the screen it must be valid
// JSON of the right shape and size, with no scores, no hiring or eligibility claims, no links or markup, in English and Spanish.
// Pure functions, no AI, no network.
import { QUESTIONS_PER_INTERVIEW } from "./questions.js";

export const LIMITS = { title: 100, overall: 700, item: 300, improvedAnswer: 1200, minItems: 2, maxItems: 3 };

const FORBIDDEN = [
  /\b\d{1,3}\s*(?:\/|out of|de)\s*\d{1,3}\b/i, //             "8/10", "9 out of 10", "8 de 10"
  /\bscor(?:e|ed|ing)\b|\bpuntaje\b|\bpuntuaci[oó]n\b|\bcalificaci[oó]n\b|\brating\b/i,
  /\b(?:odds|chances? of|likelihood|probability|probabilidad(?:es)?|posibilidades de)\b/i,
  /\byou(?:'re|\s+are|\s+would be|\s+will be)\s+(?:definitely\s+|clearly\s+)?(?:qualified|eligible|ineligible|unqualified|a (?:great|good|strong|perfect|poor) (?:fit|match|candidate)|hired|rejected|not hired)\b/i,
  /\byou(?:'ve|\s+have)?\s+(?:got|get|won|earned)\s+the\s+(?:job|position|role|internship|fellowship)\b/i,
  /\byou\s+(?:should|shouldn't|should not|must|must not|ought to)\s+(?:definitely\s+)?apply\b/i,
  /\b(?:guaranteed?|garantizad[oa])\b/i,
  /\b(?:t[uú]\s+)?(?:est[aá]s|eres|serás)\s+(?:definitivamente\s+)?(?:calificad[oa]|elegible|inelegible|contratad[oa]|rechazad[oa])\b/i,
  /\b(?:deber[ií]as|debes)\s+(?:definitivamente\s+)?(?:postular(?:te)?|aplicar)\b|\bno\s+deber[ií]as\s+(?:postular|aplicar)\b/i,
  /\b(?:te\s+(?:contratar[aá]n|elegir[aá]n|aceptar[aá]n|rechazar[aá]n)|conseguir[aá]s\s+(?:el|la))\b/i,
];
// Links and markup are rejected everywhere, including in the improved answer.
const NOT_ALLOWED_ANYWHERE = /https?:\/\/|www\.|<[a-z/!]|[*_`#]{2,}|\]\(/i;

const fail = (reason) => ({ ok: false, reason });
const isText = (value) => typeof value === "string" && value.trim() !== "";

function cleanItems(value, name) {
  if (!Array.isArray(value)) return { error: `${name} must be a list` };
  if (value.length < LIMITS.minItems || value.length > LIMITS.maxItems) return { error: `${name} must have ${LIMITS.minItems}-${LIMITS.maxItems} items` };
  const cleaned = [];
  for (const item of value) {
    if (!isText(item)) return { error: `${name} has an empty or non-text item` };
    if (item.trim().length > LIMITS.item) return { error: `${name} item is too long` };
    cleaned.push(item.trim());
  }
  return { cleaned };
}

export function validateFeedback(raw) {
  if (raw === null || typeof raw !== "object" || Array.isArray(raw)) return fail("feedback is not an object");
  if (!isText(raw.title)) return fail("title is missing or empty");
  if (raw.title.trim().length > LIMITS.title) return fail("title is too long");
  if (!isText(raw.overall)) return fail("overall is missing or empty");
  if (raw.overall.trim().length > LIMITS.overall) return fail("overall is too long");

  const strengths = cleanItems(raw.strengths, "strengths");
  if (strengths.error) return fail(strengths.error);
  const improvements = cleanItems(raw.improvements, "improvements");
  if (improvements.error) return fail(improvements.error);

  const improved = raw.improvedAnswer;
  if (improved === null || typeof improved !== "object" || Array.isArray(improved)) return fail("improvedAnswer is missing or not an object");
  const number = improved.questionNumber;
  if (!Number.isInteger(number) || number < 1 || number > QUESTIONS_PER_INTERVIEW) return fail("improvedAnswer.questionNumber is not a valid question number");
  if (!isText(improved.text)) return fail("improvedAnswer.text is missing or empty");
  if (improved.text.trim().length > LIMITS.improvedAnswer) return fail("improvedAnswer.text is too long");

  const value = {
    title: raw.title.trim(),
    overall: raw.overall.trim(),
    strengths: strengths.cleaned,
    improvements: improvements.cleaned,
    improvedAnswer: { questionNumber: number, text: improved.text.trim() },
  };

  // The coach's own assessment may not contain scores or claims. The improved answer is written in the visitor's voice and may
  // repeat a number they gave themselves, so it is only checked for links and markup.
  const assessment = [value.title, value.overall, ...value.strengths, ...value.improvements];
  for (const text of assessment) if (FORBIDDEN.some((pattern) => pattern.test(text))) return fail("feedback contains a score or a claim about the person");
  for (const text of [...assessment, value.improvedAnswer.text]) if (NOT_ALLOWED_ANYWHERE.test(text)) return fail("feedback contains a link or markup");
  return { ok: true, value };
}

export function parseAndValidateFeedback(text) {
  if (typeof text !== "string" || text.trim() === "") return fail("response text is empty");
  let parsed;
  try {
    parsed = JSON.parse(text);
  } catch {
    return fail("response is not valid JSON");
  }
  return validateFeedback(parsed);
}
