// "2026-12-15" -> "Dec 15, 2026" in English, "15 dic 2026" in Spanish. Always in UTC, so the calendar day never shifts
// with the viewer's time zone. Returns "" for a missing or unreadable date.
export function formatDate(isoDate, lang) {
  if (typeof isoDate !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(isoDate)) return "";
  return new Intl.DateTimeFormat(lang === "es" ? "es" : "en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(isoDate));
}
