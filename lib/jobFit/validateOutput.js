// Checks the AI's Job-Fit answer. The answer is UNTRUSTED, like a visitor's text: asking for JSON is a request, not a
// guarantee. Before anything reaches the screen it must be valid JSON of the right shape and size, with no scores, no
// "you are/aren't qualified" claims, no "lacks/missing" wording, and no links or markup. Pure functions, no AI, no network.
export const LIMITS = { item: 240, maxStrengths: 4, maxNotEstablished: 4, minQuestions: 2, maxQuestions: 4, minPractice: 2, maxPractice: 4 };

// English and Spanish patterns that break the rules: a score, odds, an eligibility or hiring claim, advice to apply or not,
// calling something absent or lacking, or a link or markup.
const FORBIDDEN = [
  /\b\d{1,3}\s*(?:\/|out of|de)\s*\d{1,3}\b/i, //             "8/10", "9 out of 10", "8 de 10"
  /\b\d{1,3}\s*%/, //                                         "85%"
  /\bscor(?:e|ed|ing)\b|\bpuntaje\b|\bpuntuaci[oó]n\b|\bcalificaci[oó]n\b|\brating\b/i,
  /\b(?:odds|chances? of|likelihood|probability|probabilidad(?:es)?|posibilidades de)\b/i,
  /\byou(?:'re|\s+are|\s+would be|\s+will be)\s+(?:definitely\s+|clearly\s+)?(?:qualified|eligible|ineligible|unqualified|a (?:great|good|strong|perfect|poor) (?:fit|match|candidate))\b/i,
  /\byou\s+(?:should|shouldn't|should not|must|must not|ought to)\s+(?:definitely\s+)?apply\b/i,
  /\byou(?:'ll|\s+will)\s+(?:get|win|earn|be (?:hired|chosen|selected|accepted|rejected))\b/i,
  /\b(?:guaranteed?|garantizad[oa])\b/i,
  /\b(?:t[uú]\s+)?(?:est[aá]s|eres|serás)\s+(?:definitivamente\s+)?(?:calificad[oa]|elegible|inelegible|el candidato|la candidata)\b/i,
  /\b(?:deber[ií]as|debes)\s+(?:definitivamente\s+)?(?:postular(?:te)?|aplicar)\b|\bno\s+deber[ií]as\s+(?:postular|aplicar)\b/i,
  /\b(?:te\s+(?:contratar[aá]n|elegir[aá]n|aceptar[aá]n|rechazar[aá]n)|conseguir[aá]s\s+(?:el|la))\b/i,
  /\b(?:lacks?|lacking|missing|absent|weak(?:ness)?|deficien(?:t|cy)|you don'?t have|you do not have)\b/i,
  /\b(?:carece|careces|ausente|debilidad|d[eé]bil|no tienes|no cuentas con)\b/i,
  /https?:\/\/|www\.|<[a-z/!]|[*_`#]{2,}|\]\(/i, //            links, tags, markdown
];

const fail = (reason) => ({ ok: false, reason });
const isText = (value) => typeof value === "string" && value.trim() !== "";

function cleanList(value, name, min, max) {
  if (!Array.isArray(value)) return { error: `${name} must be a list` };
  if (value.length < min || value.length > max) return { error: `${name} must have ${min}-${max} items` };
  const cleaned = [];
  for (const item of value) {
    if (!isText(item)) return { error: `${name} has an empty or non-text item` };
    if (item.trim().length > LIMITS.item) return { error: `${name} item is too long` };
    cleaned.push(item.trim());
  }
  return { cleaned };
}

// `raw` is the parsed JSON from the AI (could be anything). Returns { ok: true, value } with a CLEAN copy holding only the
// expected fields, or { ok: false, reason } (the reason is for our logs and tests only; the visitor never sees it).
export function validateJobFit(raw) {
  if (raw === null || typeof raw !== "object" || Array.isArray(raw)) return fail("answer is not an object");

  const strengths = cleanList(raw.strengths, "strengths", 0, LIMITS.maxStrengths);
  if (strengths.error) return fail(strengths.error);
  const notEstablished = cleanList(raw.notEstablished, "notEstablished", 0, LIMITS.maxNotEstablished);
  if (notEstablished.error) return fail(notEstablished.error);
  const employerQuestions = cleanList(raw.employerQuestions, "employerQuestions", LIMITS.minQuestions, LIMITS.maxQuestions);
  if (employerQuestions.error) return fail(employerQuestions.error);
  const practiceTopics = cleanList(raw.practiceTopics, "practiceTopics", LIMITS.minPractice, LIMITS.maxPractice);
  if (practiceTopics.error) return fail(practiceTopics.error);

  const value = {
    strengths: strengths.cleaned,
    notEstablished: notEstablished.cleaned,
    employerQuestions: employerQuestions.cleaned,
    practiceTopics: practiceTopics.cleaned,
  };
  for (const text of [...value.strengths, ...value.notEstablished, ...value.employerQuestions, ...value.practiceTopics]) {
    if (FORBIDDEN.some((pattern) => pattern.test(text))) return fail("answer contains a score, a claim about the person, or a link");
  }
  return { ok: true, value };
}

// The AI hands back TEXT: parse it (JSON.parse throws on bad JSON) and validate it.
export function parseAndValidateJobFit(text) {
  if (typeof text !== "string" || text.trim() === "") return fail("response text is empty");
  let parsed;
  try {
    parsed = JSON.parse(text);
  } catch {
    return fail("response is not valid JSON");
  }
  return validateJobFit(parsed);
}
