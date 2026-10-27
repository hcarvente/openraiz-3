// The site's languages. The language is the first part of every public address (/en/opportunities, /es/opportunities).
// Plain JavaScript with no imports, so the proxy, the pages and `npm test` can all use it.

export const LOCALES = ["en", "es"];
export const DEFAULT_LOCALE = "en";

export function isLocale(value) {
  return typeof value === "string" && LOCALES.includes(value);
}

// localePath("es", "/opportunities") -> "/es/opportunities"; localePath("es") and localePath("es", "/") -> "/es".
export function localePath(lang, path = "/") {
  const locale = isLocale(lang) ? lang : DEFAULT_LOCALE;
  return path === "/" || path === "" ? `/${locale}` : `/${locale}${path.startsWith("/") ? "" : "/"}${path}`;
}
