"use client";

// The main navigation links, with the current page marked (a white pill, and aria-current for screen readers).
// It is a Client Component only because it needs to know the current address.
import Link from "next/link";
import { usePathname } from "next/navigation";

const ITEMS = [
  { href: "/", label: "About" },
  { href: "/opportunities", label: "Opportunities" },
];

export default function NavLinks() {
  const pathname = usePathname();
  return ITEMS.map(({ href, label }) => {
    const active = href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
    return (
      <Link key={href} href={href} className={active ? "is-active" : undefined} aria-current={active ? "page" : undefined}>
        {label}
      </Link>
    );
  });
}
