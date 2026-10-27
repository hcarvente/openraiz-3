"use client";

// A link to the same page in the other language (English <-> Spanish). The language is the first part of the address,
// so it swaps that part and keeps the rest, including any ?query. The link is written in the language it leads to
// and says so (lang / hrefLang), so a screen reader pronounces it correctly.
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

export default function LanguageToggle({ lang, label, hint }) {
  const pathname = usePathname();
  const search = useSearchParams().toString();
  const other = lang === "es" ? "en" : "es";
  const parts = pathname.split("/");
  parts[1] = other;
  const href = `${parts.join("/")}${search ? `?${search}` : ""}`;
  return (
    <Link href={href} lang={other} hrefLang={other} aria-label={hint} className="language-toggle">
      {label}
    </Link>
  );
}
