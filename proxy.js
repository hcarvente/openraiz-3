// INTERIM admin lock (Step 2). It runs before a request reaches a page or an API route and asks for a
// username and password (HTTP Basic Auth) on every /admin page and on every /api/opportunities request
// that changes data. Reading the public list and single listings stays open. Step 4 replaces this with real accounts.
//
// ADMIN_USER and ADMIN_PASSWORD come from the environment. If either is missing, the lock stays closed
// (503): it never lets a request through just because it is not configured.
import { createHash, timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";

const READ_ONLY_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);

// Compares two strings without leaking, through timing, how much of them matched: both are hashed to the
// same length first, because timingSafeEqual needs equal-length inputs.
function sameText(a, b) {
  const digest = (text) => createHash("sha256").update(text).digest();
  return timingSafeEqual(digest(a), digest(b));
}

// "Basic dXNlcjpwYXNz" -> { user, password }, or null if the header is missing or malformed.
function readCredentials(request) {
  const header = request.headers.get("authorization") ?? "";
  const [scheme, encoded] = header.split(" ");
  if (scheme?.toLowerCase() !== "basic" || !encoded) return null;
  const decoded = Buffer.from(encoded, "base64").toString("utf8");
  const colon = decoded.indexOf(":");
  if (colon === -1) return null;
  return { user: decoded.slice(0, colon), password: decoded.slice(colon + 1) };
}

function refuse(isApi, status, message, headers = {}) {
  const init = { status, headers: { "Cache-Control": "no-store", ...headers } };
  return isApi ? NextResponse.json({ error: message }, init) : new NextResponse(message, init);
}

export function proxy(request) {
  const { pathname } = request.nextUrl;
  const isApi = pathname.startsWith("/api/");

  // Public reads of the API stay open. Admin pages are never exempt.
  if (isApi && READ_ONLY_METHODS.has(request.method)) return NextResponse.next();

  const { ADMIN_USER, ADMIN_PASSWORD } = process.env;
  if (!ADMIN_USER || !ADMIN_PASSWORD) {
    return refuse(isApi, 503, "Admin access is not configured.");
  }

  const credentials = readCredentials(request);
  // Evaluate both comparisons every time so a wrong user name is not faster to reject than a wrong password.
  const userOk = sameText(credentials?.user ?? "", ADMIN_USER);
  const passwordOk = sameText(credentials?.password ?? "", ADMIN_PASSWORD);
  if (credentials && userOk && passwordOk) return NextResponse.next();

  return refuse(isApi, 401, "Authentication required.", {
    "WWW-Authenticate": 'Basic realm="OpenRaiz admin", charset="UTF-8"',
  });
}

export const config = {
  matcher: ["/admin/:path*", "/api/opportunities/:path*"],
};
