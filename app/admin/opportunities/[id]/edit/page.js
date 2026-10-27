// The "Edit Opportunity" page for /admin/opportunities/[id]/edit. This file is a Server Component: it runs
// on the server, reads the opportunity through Prisma, and hands it to the form (a Client Component).
// Admin only: <AdminGate> renders the page's content only for a signed-in admin. PATCH /api/opportunities/[id] checks again.
import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import AdminGate from "@/components/AdminGate";
import OpportunityForm from "@/components/OpportunityForm";
import { prisma } from "@/lib/prisma";
import { serializeOpportunity } from "@/lib/serializeOpportunity";
import { valuesFromOpportunity } from "@/lib/opportunityOptions";

export const metadata = {
  title: "Edit Opportunity | OpenRaiz",
};

// Same rule as the API: real ids are letters, digits, hyphens and underscores.
const VALID_ID = /^[A-Za-z0-9_-]{1,100}$/;

// Loads the opportunity and shows the form. With Cache Components, both the id (`params`) and the database read
// have to be used inside <Suspense> (see the page below), so a missing or impossible id is reported from here with
// notFound(). That happens after the page has started streaming, so the browser gets the "not found" page (with a
// noindex tag) but the HTTP status stays 200: Next.js cannot change a status after streaming has begun.
async function EditOpportunity({ params }) {
  // In this version of Next.js, `params` is a Promise, so it has to be awaited. It is passed down from the
  // page and awaited here, inside <Suspense>, so the page's header can be sent straight away.
  const { id } = await params;

  // An id that cannot exist (see the rule above) is a "not found" without asking the database.
  if (!VALID_ID.test(id)) notFound();

  let opportunity;
  try {
    opportunity = await prisma.opportunity.findUnique({ where: { id } });
  } catch (error) {
    // Log only the error's name and code on the server; the visitor sees a plain message.
    console.error("Edit page could not load the opportunity:", error?.name, error?.code);
    return (
      <p className="state-message state-error" role="alert">
        We couldn&rsquo;t load this opportunity right now. Please try again in a moment.
      </p>
    );
  }

  if (!opportunity) notFound(); // shows app/admin/opportunities/[id]/edit/not-found.js

  const saved = serializeOpportunity(opportunity); // dates become "YYYY-MM-DD" text, like the API returns
  return (
    <>
      <h1>Edit Opportunity</h1>
      <p className="page-intro">
        Editing <strong>{saved.title}</strong>
      </p>
      <OpportunityForm mode="edit" opportunityId={saved.id} initialValues={valuesFromOpportunity(saved)} />
    </>
  );
}

export default function EditOpportunityPage({ params }) {
  return (
    <>
      <main id="main-content" tabIndex={-1} className="page-main">
        <p className="back-link">
          <Link href="/opportunities">&larr; Back to opportunities</Link>
        </p>
        <Suspense fallback={<p className="state-message">Loading opportunity&hellip;</p>}>
          <AdminGate>
            <EditOpportunity params={params} />
          </AdminGate>
        </Suspense>
      </main>
    </>
  );
}
