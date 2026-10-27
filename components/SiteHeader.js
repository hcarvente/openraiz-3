import { Suspense } from "react";
import Link from "next/link";
import AuthLinks from "@/components/AuthLinks";

// Logo-only header: the OpenRaiz sprout mark plus wordmark.
// The sprout is ported from the original site's header (a stem, two leaves,
// and roots below a ground line, tying to "raíz" = root).
export default function SiteHeader() {
  return (
    <header className="site-header">
      <Link className="logo" href="/">
        <svg
          className="logo-mark"
          width="30"
          height="30"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <line x1="4" y1="14" x2="20" y2="14" />
          <path d="M12 14V5" />
          <path d="M12 8C10 8 8 6.5 7.5 5" />
          <path d="M12 8C14 8 16 6.5 16.5 5" />
          <path d="M12 14C12 14 9 16 8 20" />
          <path d="M12 14V20" />
          <path d="M12 14C12 14 15 16 16 20" />
        </svg>
        OpenRaiz
      </Link>
      <nav className="site-nav" aria-label="Account">
        <Suspense fallback={null}>
          <AuthLinks />
        </Suspense>
      </nav>
    </header>
  );
}
