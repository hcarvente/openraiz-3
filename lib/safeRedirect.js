// After signing in, the page may send the visitor back to where they were going (a "next" value in the address).
// That value comes from the URL, so anyone can put anything in it. Only a plain path on this same site is allowed;
// everything else (another site, "//evil.example", "/\evil.example", API paths) falls back to a safe default.
export function safeNextPath(value, fallback = "/account") {
  if (typeof value !== "string" || value.length === 0 || value.length > 200) return fallback;
  if (!value.startsWith("/") || value.startsWith("//") || value.includes("\\")) return fallback;
  if (/[\u0000-\u001f\u007f]/.test(value)) return fallback;
  if (value === "/api" || value.startsWith("/api/")) return fallback;
  try {
    // A path that stays on the same origin once resolved is a path on this site.
    if (new URL(value, "http://openraiz.invalid").origin !== "http://openraiz.invalid") return fallback;
  } catch {
    return fallback;
  }
  return value;
}
