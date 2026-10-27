// The "Add Opportunity" page. This file is a Server Component; the form itself is a Client Component.
// Admin only: <AdminGate> renders the page's content only for a signed-in admin. POST /api/opportunities checks again.
import Link from "next/link";
import AdminGate from "@/components/AdminGate";
import SiteHeader from "@/components/SiteHeader";
import OpportunityForm from "@/components/OpportunityForm";
import { Suspense } from "react";

export const metadata = {
  title: "Add Opportunity | OpenRaiz",
};

export default function NewOpportunityPage() {
  return (
    <>
      <SiteHeader />
      <main className="page-main">
        <p className="back-link">
          <Link href="/">&larr; Back to opportunities</Link>
        </p>
        <Suspense fallback={<p className="state-message">Loading&hellip;</p>}>
          <AdminGate next="/admin/opportunities/new">
            <h1>Add Opportunity</h1>
            <p className="page-intro">Fill in the details below to add a new opportunity to the directory.</p>
            <OpportunityForm />
          </AdminGate>
        </Suspense>
      </main>
    </>
  );
}
