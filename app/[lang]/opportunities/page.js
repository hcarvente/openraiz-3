// The opportunities list (/opportunities) with search and filters. Everything in this file is a Server Component: it runs
// on the server, reads the database through Prisma, and sends finished HTML to the browser.
//
// The search form is a plain GET form, so it works without JavaScript and every result has its own address that can be
// shared. The address's values are cleaned by parseSearchParams (lib/opportunitySearch.js) before they are used.
// With Cache Components, reading searchParams and the database must happen inside <Suspense> (see the page below).
import { Suspense } from "react";
import Link from "next/link";
import { connection } from "next/server";
import OpportunityCard from "@/components/OpportunityCard";
import DeletedNotice from "@/components/DeletedNotice";
import { prisma } from "@/lib/prisma";
import { serializePublicOpportunity } from "@/lib/serializeOpportunity";
import { PUBLIC_WHERE } from "@/lib/opportunityVisibility";
import { searchableTranslation, translatedView } from "@/lib/translation";
import { localePath } from "@/lib/i18n/config";
import { fill, getDictionary } from "@/lib/i18n/dictionaries";
import { CATEGORIES, OPPORTUNITY_TYPES } from "@/lib/opportunityTaxonomy";
import {
  LOCATION_VALUES,
  RELEVANCE_VALUES,
  buildOrderBy,
  buildWhere,
  hasActiveFilters,
  matchesQuery,
  parseSearchParams,
} from "@/lib/opportunitySearch";

export async function generateMetadata({ params }) {
  const { lang } = await params;
  return { title: getDictionary(lang).meta.titles.opportunities };
}

// A labelled drop-down. "" (the first choice) means "no filter".
function Select({ name, label, value, allLabel, options }) {
  return (
    <div className="field">
      <label htmlFor={`f-${name}`}>{label}</label>
      <select id={`f-${name}`} name={name} defaultValue={value}>
        <option value="">{allLabel}</option>
        {options.map(([optionValue, optionLabel]) => (
          <option key={optionValue} value={optionValue}>
            {optionLabel}
          </option>
        ))}
      </select>
    </div>
  );
}

function SearchForm({ lang, filters, states, dictionary }) {
  const s = dictionary.search;
  const card = dictionary.card;
  return (
    <form className="search-form" method="get" action={localePath(lang, "/opportunities")} role="search" aria-label={s.formLabel}>
      <div className="search-row">
        <div className="field search-field">
          <label htmlFor="f-q">{s.search}</label>
          <input id="f-q" name="q" type="search" defaultValue={filters.q} maxLength={100} placeholder={s.placeholder} autoComplete="off" />
        </div>
        <button className="button button-primary" type="submit">
          {s.submit}
        </button>
      </div>
      <div className="search-grid">
        <Select name="type" label={s.type} value={filters.type} allLabel={s.allTypes} options={OPPORTUNITY_TYPES.map((v) => [v, card.types[v]])} />
        <Select name="location" label={s.location} value={filters.location} allLabel={s.allLocations} options={LOCATION_VALUES.map((v) => [v, card.locations[v]])} />
        <Select name="paid" label={s.pay} value={filters.paid} allLabel={s.allPay} options={[["yes", s.paid], ["no", s.unpaid]]} />
      </div>
      {/* The less used filters wait behind this, but they are still part of the form, and it stays open when one is in use. */}
      <details className="more-filters" open={Boolean(filters.category || filters.relevance || filters.state || filters.sort === "deadline")}>
        <summary>{s.moreFilters}</summary>
        <div className="search-grid">
          <Select name="category" label={s.category} value={filters.category} allLabel={s.allCategories} options={CATEGORIES.map((v) => [v, dictionary.categories[v]])} />
          <Select name="relevance" label={s.relevance} value={filters.relevance} allLabel={s.allRelevance} options={RELEVANCE_VALUES.map((v) => [v, card.relevance[v]])} />
          <Select name="state" label={s.state} value={filters.state} allLabel={s.allStates} options={states.map((v) => [v, v])} />
          <Select name="sort" label={s.sort} value={filters.sort} allLabel={s.sortNewest} options={[["deadline", s.sortDeadline]]} />
        </div>
      </details>
      <div className="search-actions">
        <label className="check-option">
          <input type="checkbox" name="open" value="1" defaultChecked={filters.open} />
          {s.openOnly}
        </label>
        <Link className="button button-secondary" href={localePath(lang, "/opportunities")}>
          {s.clear}
        </Link>
      </div>
    </form>
  );
}

// Reads the opportunities that match the address and renders the form and the list, or an empty or error message.
async function OpportunitiesContent({ lang, searchParams }) {
  const dictionary = getDictionary(lang);
  const t = dictionary.opportunities;
  const filters = parseSearchParams(await searchParams);
  await connection(); // "today" changes, so this page is worked out for each visitor, never ahead of time
  const today = new Date().toISOString().slice(0, 10); // today's date in UTC, "YYYY-MM-DD"

  let opportunities;
  let states;
  try {
    const rows = await prisma.opportunity.findMany({
      where: buildWhere(filters, PUBLIC_WHERE, today), // only approved, non-archived listings, plus the chosen filters
      orderBy: buildOrderBy(filters.sort),
    });
    // The word search runs here, ignoring capitals and accents. The type, category and place names are searched too,
    // in the visitor's language and in English.
    opportunities = rows
      .filter((row) =>
        matchesQuery(row, filters.q, [
          dictionary.card.types[row.type],
          getDictionary("en").card.types[row.type],
          dictionary.categories[row.category] ?? "",
          ...searchableTranslation(row), // the approved translation, if there is one
        ]),
      )
      .map(serializePublicOpportunity); // dates become "YYYY-MM-DD" strings
    // The states shown in the State drop-down are the ones that appear in public listings.
    const stateRows = await prisma.opportunity.findMany({
      where: PUBLIC_WHERE,
      select: { state: true },
      distinct: ["state"],
      orderBy: { state: "asc" },
    });
    states = stateRows.map((row) => row.state).filter(Boolean);
  } catch (error) {
    // Log only the error's name and code on the server; the visitor sees a plain message.
    console.error("Opportunities page could not load:", error?.name, error?.code);
    return (
      <p className="state-message state-error" role="alert">
        {t.loadError}
      </p>
    );
  }

  const count = opportunities.length;
  const filtered = hasActiveFilters(filters);

  return (
    <>
      <SearchForm lang={lang} filters={filters} states={states} dictionary={dictionary} />
      {opportunities.some((o) => translatedView(o, lang).showNote) ? (
        <p className="page-note">{lang === "es" ? t.someOnlyEnglish : t.someOnlySpanish}</p>
      ) : null}
      {count === 0 ? (
        <div className="state-message" role="status">
          {filtered ? (
            <>
              <p>
                <strong>{dictionary.search.noResults}</strong>
              </p>
              <p>{dictionary.search.noResultsHint}</p>
              <p>
                <Link className="button button-secondary" href={localePath(lang, "/opportunities")}>
                  {dictionary.search.clear}
                </Link>
              </p>
            </>
          ) : (
            <p>{t.empty}</p>
          )}
        </div>
      ) : (
        <>
          <p className="result-count" role="status">
            {fill(count === 1 ? t.countOne : t.countMany, { count })}
          </p>
          <ul className="opportunity-list">
            {opportunities.map((opportunity) => (
              <li key={opportunity.id}>
                <OpportunityCard opportunity={opportunity} today={today} lang={lang} />
              </li>
            ))}
          </ul>
        </>
      )}
    </>
  );
}

export default async function OpportunitiesPage({ params, searchParams }) {
  const { lang } = await params;
  const t = getDictionary(lang).opportunities;
  return (
    <main id="main-content" tabIndex={-1} className="page-main">
      <div className="page-title-row">
        <h1>{t.heading}</h1>
      </div>
      <p className="page-intro">{t.intro}</p>
      <DeletedNotice />
      <Suspense fallback={<p className="state-message">{t.loading}</p>}>
        <OpportunitiesContent lang={lang} searchParams={searchParams} />
      </Suspense>
    </main>
  );
}
