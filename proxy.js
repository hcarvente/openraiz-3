// Sends an address with no language in it (/, /opportunities, /account) to the same address in the visitor's language:
// /es/... if their browser prefers Spanish, otherwise /en/... It does not run for the API, the admin pages, or files.
// (Admin pages and the API are not part of the /en and /es site.)
import { NextResponse } from "next/server";
import { isLocale } from "@/lib/i18n/config";
import { negotiateLocale } from "@/lib/i18n/negotiate";

export function proxy(request) {
  const { pathname } = request.nextUrl;
  if (isLocale(pathname.split("/")[1])) return NextResponse.next();

  const lang = negotiateLocale(request.headers.get("accept-language"));
  const url = request.nextUrl.clone();
  url.pathname = `/${lang}${pathname === "/" ? "" : pathname}`;

  const response = NextResponse.redirect(url);
  response.headers.set("Vary", "Accept-Language"); // the answer depends on this header, so caches must keep that in mind
  return response;
}

export const config = {
  matcher: ["/((?!api|admin|_next|.*\\..*).*)"],
};
