// The "Browse by type" tiles on the home page: one link per kind of opportunity, going to the list already filtered.
// Server Component with no state. The icons are small decorative drawings (the link's text names the type).
import Link from "next/link";
import { localePath } from "@/lib/i18n/config";
import { OPPORTUNITY_TYPES } from "@/lib/opportunityTaxonomy";

const SHAPES = {
  job: (
    <>
      <rect x="3" y="7" width="18" height="13" rx="2" />
      <path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2M3 13h18" />
    </>
  ),
  internship: (
    <>
      <path d="M2 9l10-5 10 5-10 5z" />
      <path d="M6 11v5c0 1.5 3 3 6 3s6-1.5 6-3v-5" />
    </>
  ),
  fellowship: (
    <>
      <circle cx="12" cy="9" r="6" />
      <path d="M8.5 14L7 22l5-3 5 3-1.5-8" />
    </>
  ),
  volunteer: <path d="M12 21s-8-5.2-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 10c0 5.8-8 11-8 11z" />,
  workshop: (
    <>
      <circle cx="9" cy="8" r="3" />
      <circle cx="17" cy="9" r="2.5" />
      <path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6M15 14.5c3 0 6 1.3 6 4.5" />
    </>
  ),
  event: (
    <>
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </>
  ),
  resource: (
    <>
      <path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z" />
      <path d="M4 19V5M9 7h6" />
    </>
  ),
};

export default function CategoryTiles({ lang, labels }) {
  return (
    <ul className="category-tiles">
      {OPPORTUNITY_TYPES.map((type) => (
        <li key={type}>
          <Link href={`${localePath(lang, "/opportunities")}?type=${type}`} className="category-tile">
            <span className="category-icon">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                {SHAPES[type]}
              </svg>
            </span>
            {labels[type]}
          </Link>
        </li>
      ))}
    </ul>
  );
}
