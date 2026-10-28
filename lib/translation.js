// Which words a page shows for a listing: the original, or its approved translation. Plain JavaScript with no imports,
// so it can run on the server, in tests, or anywhere else.
//
// A listing is written in `originalLang` ("en" or "es"). `titleTr`, `summaryTr`, `descriptionTr` and `requirementsTr` hold
// the same text in the other language, once someone has translated it and an admin has approved it
// (`translationStatus` is "approved"). An unreviewed AI draft is never shown.
//
// translatedView(listing, lang) returns the text to show and the language each piece is written in (for the `lang`
// attribute), and says whether to show the note "this listing is only in <other language>".
const FIELDS = [
  ["title", "titleTr"],
  ["summary", "summaryTr"],
  ["description", "descriptionTr"],
  ["requirements", "requirementsTr"],
];

const otherLang = (lang) => (lang === "es" ? "en" : "es");

export function translatedView(listing, lang) {
  const original = listing.originalLang ?? "en";
  const text = {};
  const langs = {};

  // Same language as the original: show the original.
  if (lang === original) {
    for (const [field] of FIELDS) {
      text[field] = listing[field] ?? null;
      langs[field] = original;
    }
    return { text, langs, original, usingTranslation: false, showNote: false };
  }

  // The other language: use the approved translation field by field, and the original for anything not translated.
  const approved = listing.translationStatus === "approved" && listing.titleTr && listing.descriptionTr;
  for (const [field, translated] of FIELDS) {
    if (approved && listing[translated]) {
      text[field] = listing[translated];
      langs[field] = otherLang(original);
    } else {
      text[field] = listing[field] ?? null;
      langs[field] = original;
    }
  }
  return { text, langs, original, usingTranslation: Boolean(approved), showNote: !approved };
}

// The translated texts that are safe to search in, for a visitor looking at the page in `lang`.
export function searchableTranslation(listing) {
  if (listing.translationStatus !== "approved") return [];
  return [listing.titleTr, listing.summaryTr, listing.descriptionTr, listing.requirementsTr].filter(Boolean);
}
