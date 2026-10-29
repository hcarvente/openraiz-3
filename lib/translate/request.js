// The message for the translation request. Plain JavaScript, relative imports only.

export const FIELDS = ["title", "summary", "description", "requirements"];

// Text goes between tags the AI is told to treat as data. Angle brackets are removed so no text can close a tag early. Paragraph
// breaks are kept (unlike in Job-Fit) because the translation must keep them.
function keepBreaks(text) {
  return String(text ?? "")
    .replace(/[<>]/g, " ")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export function buildTranslateMessage({ listing, from, to }) {
  const part = (field) => `<${field}>\n${keepBreaks(listing[field])}\n</${field}>`;
  return `<source_language>${from}</source_language>\n<target_language>${to}</target_language>\n<listing>\n${FIELDS.map(part).join("\n")}\n</listing>`;
}
