// The interface text for a language. Plain objects, so it works in server and client components alike.
import { en } from "./dictionaries/en.js";
import { es } from "./dictionaries/es.js";

const DICTIONARIES = { en, es };

export function getDictionary(lang) {
  return DICTIONARIES[lang] ?? en;
}

// fill("{count} found", { count: 3 }) -> "3 found". A marker with no value is left as it is.
export function fill(template, values) {
  return template.replace(/\{(\w+)\}/g, (marker, key) => (key in values ? String(values[key]) : marker));
}
