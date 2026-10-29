// The filters that are in use, as removable chips above the results ("Internship ×", "Remote ×"). Each chip is a plain link to
// the same search without that one filter, so it works without JavaScript. Server Component with no state.
import Link from "next/link";
import { localePath } from "@/lib/i18n/config";
import { fill } from "@/lib/i18n/dictionaries";

const KEYS = ["q", "type", "location", "paid", "category", "relevance", "state", "open"];

export default function FilterChips({ lang, filters, dictionary }) {
  const s = dictionary.search;
  const card = dictionary.card;
  const labelFor = {
    q: (v) => `“${v}”`,
    type: (v) => card.types[v] ?? v,
    location: (v) => card.locations[v] ?? v,
    paid: (v) => (v === "yes" ? s.paid : s.unpaid),
    category: (v) => dictionary.categories[v] ?? v,
    relevance: (v) => card.relevance[v] ?? v,
    state: (v) => v,
    open: () => s.openOnly,
  };
  const active = KEYS.filter((key) => filters[key]);
  if (active.length === 0) return null;

  // The address for the same search with one filter taken out (the others, and a chosen sort, stay).
  function without(removed) {
    const params = new URLSearchParams();
    for (const key of [...KEYS, "sort"]) {
      if (key === removed || !filters[key] || (key === "sort" && filters.sort === "newest")) continue;
      params.set(key, filters[key] === true ? "1" : filters[key]);
    }
    const query = params.toString();
    return `${localePath(lang, "/opportunities")}${query ? `?${query}` : ""}`;
  }

  return (
    <ul className="filter-chips" aria-label={s.activeFilters}>
      {active.map((key) => {
        const text = labelFor[key](filters[key]);
        return (
          <li key={key}>
            <Link href={without(key)} aria-label={fill(s.removeFilter, { filter: text })}>
              {text}
              <span aria-hidden="true"> ×</span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
