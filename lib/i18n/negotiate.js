// Picks the site's language from the browser's Accept-Language header, for a first visit to an address with no language
// in it. "es-MX,es;q=0.9,en;q=0.8" -> "es". Anything unreadable, or no supported language at all, gives English.
import { DEFAULT_LOCALE, LOCALES } from "./config.js";

export function negotiateLocale(acceptLanguage) {
  if (typeof acceptLanguage !== "string" || acceptLanguage.length === 0 || acceptLanguage.length > 500) return DEFAULT_LOCALE;

  const choices = acceptLanguage
    .split(",")
    .map((part, index) => {
      const [tag, ...params] = part.trim().split(";");
      const qParam = params.map((p) => p.trim()).find((p) => p.toLowerCase().startsWith("q="));
      const q = qParam === undefined ? 1 : Number(qParam.slice(2));
      return { language: tag.trim().toLowerCase().split("-")[0], q, index };
    })
    .filter((choice) => LOCALES.includes(choice.language) && Number.isFinite(choice.q) && choice.q > 0)
    .sort((a, b) => b.q - a.q || a.index - b.index); // highest preference first; ties keep the order given

  return choices[0]?.language ?? DEFAULT_LOCALE;
}
