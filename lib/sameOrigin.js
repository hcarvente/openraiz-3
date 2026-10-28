// A browser adds an Origin header to a cross-site POST. If it is present and names a different site than the one being
// asked, the request came from another site's page and is refused. A request with no Origin (a script, curl) is not a
// browser acting for someone else, so it is left to the sign-in check.
export function isSameOrigin(headers) {
  const origin = headers.get("origin");
  if (!origin) return true;
  const host = headers.get("x-forwarded-host") ?? headers.get("host");
  try {
    return new URL(origin).host === host;
  } catch {
    return false; // "null" and other unreadable origins
  }
}
