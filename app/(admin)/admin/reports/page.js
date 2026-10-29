// Open reports about public listings (/admin/reports), oldest first. Admin only. Each links to the review page, where the
// listing can be edited or taken down; "Mark as handled" closes a report.
import { Suspense } from "react";
import Link from "next/link";
import AdminGate from "@/components/AdminGate";
import AdminNav from "@/components/admin/AdminNav";
import ResolveReportButton from "@/components/admin/ResolveReportButton";
import { formatDate } from "@/lib/formatDate";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { prisma } from "@/lib/prisma";

export const metadata = { title: "Reports | OpenRaiz" };

const REASONS = getDictionary("en").report.reasons;

async function Reports() {
  let reports;
  try {
    reports = await prisma.listingReport.findMany({
      where: { resolvedAt: null },
      orderBy: [{ createdAt: "asc" }, { id: "asc" }],
      include: { opportunity: { select: { id: true, title: true, approvalStatus: true, status: true } } },
    });
  } catch (error) {
    console.error("Reports page could not load:", error?.name, error?.code);
    return (
      <p className="state-message state-error" role="alert">
        We couldn&rsquo;t load the reports right now. Please try again in a moment.
      </p>
    );
  }

  return (
    <>
      <AdminNav />
      <h1>Reports</h1>
      <p className="page-intro">Listings that people reported, oldest first.</p>
      {reports.length === 0 ? (
        <p className="state-message">No open reports.</p>
      ) : (
        <ul className="my-listings">
          {reports.map((report) => (
            <li key={report.id} className="my-listing">
              <div className="my-listing-head">
                <h2>
                  <Link href={`/admin/queue/${report.opportunity.id}`}>{report.opportunity.title}</Link>
                </h2>
                <span className="pill pill-state-rejected">{REASONS[report.reason] ?? report.reason}</span>
              </div>
              <p className="my-listing-meta">
                Reported by {report.reporterName} · {formatDate(report.createdAt.toISOString().slice(0, 10), "en")} · listing is{" "}
                {report.opportunity.status === "archived" ? "withdrawn" : report.opportunity.approvalStatus}
              </p>
              {report.note ? <p className="detail-text">{report.note}</p> : null}
              <div className="my-listing-actions">
                <Link className="button button-secondary button-small" href={`/admin/queue/${report.opportunity.id}`}>
                  Review the listing
                </Link>
                <ResolveReportButton reportId={report.id} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

export default function ReportsPage() {
  return (
    <main id="main-content" tabIndex={-1} className="page-main">
      <Suspense fallback={<p className="state-message">Loading&hellip;</p>}>
        <AdminGate next="/admin/reports">
          <Reports />
        </AdminGate>
      </Suspense>
    </main>
  );
}
