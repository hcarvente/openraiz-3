// The opportunities list (/opportunities). Everything in this file is a Server Component: it runs on the server,
// reads the database through Prisma, and sends finished HTML to the browser.
import { Suspense } from "react";
import OpportunityCard from "@/components/OpportunityCard";
import DeletedNotice from "@/components/DeletedNotice";
import { prisma } from "@/lib/prisma";
import { serializePublicOpportunity } from "@/lib/serializeOpportunity";
import { PUBLIC_WHERE } from "@/lib/opportunityVisibility";
import { fill, getDictionary } from "@/lib/i18n/dictionaries";

export async function generateMetadata({ params }) {
  const { lang } = await params;
  return { title: getDictionary(lang).meta.titles.opportunities };
}

// Reads the opportunities and renders the list, or an empty or error message.
// With Cache Components enabled, an uncached database read must sit inside <Suspense> (see the page below).
async function OpportunityList({ lang }) {
  const t = getDictionary(lang).opportunities;
  let opportunities;
  try {
    const rows = await prisma.opportunity.findMany({
      where: PUBLIC_WHERE, // only approved, non-archived listings
      orderBy: [{ datePosted: "desc" }, { id: "asc" }], // same order as GET /api/opportunities
    });
    opportunities = rows.map(serializePublicOpportunity); // dates become "YYYY-MM-DD" strings
  } catch (error) {
    // Log only the error's name and code on the server; the visitor sees a plain message.
    console.error("Homepage could not load opportunities:", error?.name, error?.code);
    return (
      <p className="state-message state-error" role="alert">
        {t.loadError}
      </p>
    );
  }

  if (opportunities.length === 0) {
    return <p className="state-message">{t.empty}</p>;
  }

  const today = new Date().toISOString().slice(0, 10); // today's date in UTC, "YYYY-MM-DD"
  const count = opportunities.length;

  return (
    <>
      <p className="result-count">
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
  );
}

export default async function OpportunitiesPage({ params }) {
  const { lang } = await params;
  const t = getDictionary(lang).opportunities;
  return (
    <>
      <main id="main-content" tabIndex={-1} className="page-main">
        <div className="page-title-row">
          <h1>{t.heading}</h1>
        </div>
        <p className="page-intro">{t.intro}</p>
        <DeletedNotice />
        <Suspense fallback={<p className="state-message">{t.loading}</p>}>
          <OpportunityList lang={lang} />
        </Suspense>
      </main>
    </>
  );
}
