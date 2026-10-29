// The admin review queue (/admin/queue): every listing that people posted and that is waiting for approval. Admin only.
import { Suspense } from "react";
import Link from "next/link";
import AdminGate from "@/components/AdminGate";
import AdminNav from "@/components/admin/AdminNav";
import { formatDate } from "@/lib/formatDate";
import { prisma } from "@/lib/prisma";
import { getDictionary } from "@/lib/i18n/dictionaries";

export const metadata = { title: "Review queue | OpenRaiz" };

async function Queue() {
  const types = getDictionary("en").card.types;
  let rows;
  let profiles;
  try {
    rows = await prisma.opportunity.findMany({
      where: { approvalStatus: "pending", status: { not: "archived" } },
      orderBy: [{ createdAt: "asc" }, { id: "asc" }], // oldest first: whoever has waited longest is first
    });
    profiles = await prisma.profile.findMany({ where: { userId: { in: rows.map((r) => r.ownerUserId).filter(Boolean) } } });
  } catch (error) {
    console.error("Review queue could not load:", error?.name, error?.code);
    return (
      <p className="state-message state-error" role="alert">
        We couldn&rsquo;t load the queue right now. Please try again in a moment.
      </p>
    );
  }
  const byUser = new Map(profiles.map((p) => [p.userId, p]));

  return (
    <>
      <AdminNav />
      <h1>Review queue</h1>
      <p className="page-intro">Listings waiting for approval, oldest first. Nothing here is public yet.</p>
      {rows.length === 0 ? (
        <p className="state-message">Nothing is waiting for review.</p>
      ) : (
        <ul className="my-listings">
          {rows.map((row) => {
            const poster = byUser.get(row.ownerUserId);
            return (
              <li key={row.id} className="my-listing">
                <div className="my-listing-head">
                  <h2>
                    <Link href={`/admin/queue/${row.id}`}>{row.title}</Link>
                  </h2>
                  <span className="pill pill-state-pending">{row.originalLang === "es" ? "Spanish text" : "English text"}</span>
                </div>
                <p className="my-listing-meta">
                  {types[row.type] ?? row.type} · by {poster ? `${poster.displayName} (${poster.role})` : "OpenRaiz"} · submitted{" "}
                  {formatDate(row.createdAt.toISOString().slice(0, 10), "en")} · contact: {row.applyMethodType === "platform" ? "through OpenRaiz" : row.applyMethodType}
                </p>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}

export default function QueuePage() {
  return (
    <main id="main-content" tabIndex={-1} className="page-main">
      <Suspense fallback={<p className="state-message">Loading&hellip;</p>}>
        <AdminGate next="/admin/queue">
          <Queue />
        </AdminGate>
      </Suspense>
    </main>
  );
}
