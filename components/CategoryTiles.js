// The "Browse by type" tiles on the home page: one link per kind of opportunity, going to the list already filtered.
// Server Component with no state.
import Link from "next/link";
import TypeIcon from "@/components/TypeIcon";
import { localePath } from "@/lib/i18n/config";
import { OPPORTUNITY_TYPES } from "@/lib/opportunityTaxonomy";

export default function CategoryTiles({ lang, labels }) {
  return (
    <ul className="category-tiles">
      {OPPORTUNITY_TYPES.map((type) => (
        <li key={type}>
          <Link href={`${localePath(lang, "/opportunities")}?type=${type}`} className="category-tile">
            <span className="category-icon">
              <TypeIcon type={type} size={26} strokeWidth={1.8} className="" />
            </span>
            {labels[type]}
          </Link>
        </li>
      ))}
    </ul>
  );
}
