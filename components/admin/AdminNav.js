"use client";

// The admin pages' own navigation: Dashboard, Review queue and Reports, with a count on the two that have work waiting.
// A Client Component only to know the current address (the same reason as NavLinks).
import Link from "next/link";
import { usePathname } from "next/navigation";

const ITEMS = [
  { href: "/admin", label: "Dashboard", exact: true },
  { href: "/admin/queue", label: "Review queue", countKey: "pending" },
  { href: "/admin/reports", label: "Reports", countKey: "reports" },
];

export default function AdminNav({ counts = {} }) {
  const pathname = usePathname();
  return (
    <nav className="admin-nav" aria-label="Admin">
      {ITEMS.map(({ href, label, exact, countKey }) => {
        const active = exact ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);
        const count = countKey ? counts[countKey] : 0;
        return (
          <Link key={href} href={href} className={active ? "is-active" : undefined} aria-current={active ? "page" : undefined}>
            {label}
            {count > 0 ? <span className="admin-count">{count}</span> : null}
          </Link>
        );
      })}
    </nav>
  );
}
