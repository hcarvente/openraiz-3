"use client";

// The main navigation links, with the current page marked (a white pill, and aria-current for screen readers).
// It is a Client Component only because it needs to know the current address. The language is the first part of it.
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { isLocale, localePath } from "@/lib/i18n/config";

const ITEMS = [
  { path: "/", key: "about" },
  { path: "/opportunities", key: "opportunities" },
  { path: "/interview", key: "interview" },
];

export default function NavLinks({ labels }) {
  const pathname = usePathname();
  const params = useParams();
  const lang = isLocale(params?.lang) ? params.lang : "en";
  return ITEMS.map(({ path, key }) => {
    const href = localePath(lang, path);
    const active = path === "/" ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);
    return (
      <Link key={path} href={href} className={active ? "is-active" : undefined} aria-current={active ? "page" : undefined}>
        {labels[key]}
      </Link>
    );
  });
}
