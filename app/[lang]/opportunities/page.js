// The opportunities list (/opportunities). Everything in this file is a Server Component: it runs on the server,
// reads the database through Prisma, and sends finished HTML to the browser.
import { Suspense } from "react";
import OpportunityCard from "@/components/OpportunityCard";
import DeletedNotice from "@/components/DeletedNotice";
import { prisma } from "@/lib/prisma";
import { serializePublicOpportunity } from "@/lib/serializeOpportunity";
import { PUBLIC_WHERE } from "@/lib/opportunityVisibility";

// Reads the opportunities and renders the list, or an empty or error message.
// With Cache Components enabled, an uncached database read must sit inside <Suspense> (see the page below).
async function OpportunityList() {
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
        We couldn&rsquo;t load opportunities right now. Please try again in a moment.
      </p>
    );
  }

  if (opportunities.length === 0) {
    return <p className="state-message">No opportunities have been added yet. Please check back soon.</p>;
  }

  const today = new Date().toISOString().slice(0, 10); // today's date in UTC, "YYYY-MM-DD"
  const count = opportunities.length;

  return (
    <>
      <p className="result-count">
        {count} {count === 1 ? "opportunity" : "opportunities"} found
      </p>
      <ul className="opportunity-list">
        {opportunities.map((opportunity) => (
          <li key={opportunity.id}>
            <OpportunityCard opportunity={opportunity} today={today} />
          </li>
        ))}
      </ul>
    </>
  );
}

export default function Home() {
  return (
    <>
      <main id="main-content" tabIndex={-1} className="page-main">
        <div className="page-title-row">
          <h1>Opportunities</h1>
        </div>
        <p className="page-intro">Explore jobs, internships, fellowships, volunteer roles, workshops, events, and resources.</p>
        <DeletedNotice />
        <Suspense fallback={<p className="state-message">Loading opportunities&hellip;</p>}>
          <OpportunityList />
        </Suspense>
      </main>
    </>
  );
}
