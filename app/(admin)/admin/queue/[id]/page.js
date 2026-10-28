// Review one listing (/admin/queue/<id>): everything the poster entered, who they are, a short checklist, and the controls to
// translate, approve or reject it. Admin only. With Cache Components, `params` and the database are used inside <Suspense>.
import { Suspense } from "react";
import Link from "next/link";
import AdminGate from "@/components/AdminGate";
import ReviewPanel from "@/components/admin/ReviewPanel";
import { formatDate } from "@/lib/formatDate";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { isValidListingId } from "@/lib/opportunityDetail";
import { prisma } from "@/lib/prisma";

export const metadata = { title: "Review listing | OpenRaiz" };

const LANGUAGE_NAMES = { en: "English", es: "Spanish" };

function Row({ label, children }) {
  return (
    <>
      <dt>{label}</dt>
      <dd>{children}</dd>
    </>
  );
}

async function Review({ params }) {
  const { id } = await params;
  const dictionary = getDictionary("en");
  const card = dictionary.card;
  const back = (
    <p className="back-link">
      <Link href="/admin/queue">&larr; Back to the queue</Link>
    </p>
  );

  let row = null;
  let poster = null;
  try {
    if (isValidListingId(id)) {
      row = await prisma.opportunity.findUnique({ where: { id } });
      if (row?.ownerUserId) poster = await prisma.profile.findUnique({ where: { userId: row.ownerUserId } });
    }
  } catch (error) {
    console.error("Review page could not load:", error?.name, error?.code);
    return (
      <p className="state-message state-error" role="alert">
        We couldn&rsquo;t load this listing right now. Please try again in a moment.
      </p>
    );
  }
  if (!row) {
    return (
      <>
        {back}
        <p className="state-message">We couldn&rsquo;t find that listing.</p>
      </>
    );
  }

  const original = row.originalLang ?? "en";
  const target = original === "en" ? "es" : "en";
  const place = [row.city, row.state].filter(Boolean).join(", ");
  const iso = (date) => (date ? date.toISOString().slice(0, 10) : null);
  const apply = row.applyMethodType === "platform" ? "Through OpenRaiz messages" : `${row.applyMethodType}: ${row.applyMethodValue}`;

  return (
    <>
      {back}
      <h1>{row.title}</h1>
      <p className="page-intro">
        {row.approvalStatus === "pending" ? "Waiting for review" : `Already ${row.approvalStatus}`} · written in {LANGUAGE_NAMES[original]}
      </p>

      <section className="form-section" aria-labelledby="checklist">
        <h2 id="checklist">Check before approving</h2>
        <ul className="guidelines-list">
          <li>The link or email looks real and goes where it says.</li>
          <li>No private phone number, home address or other personal details.</li>
          <li>Nobody is asked to pay to apply for a job, internship, fellowship or volunteer role.</li>
          <li>The pay or cost matches what the description says.</li>
          <li>Nothing misleading, unsafe or discriminatory.</li>
        </ul>
      </section>

      <section className="form-section" aria-labelledby="original">
        <h2 id="original">What they entered ({LANGUAGE_NAMES[original]})</h2>
        <dl className="key-details">
          <Row label="Posted by">{poster ? `${poster.displayName} · ${poster.role === "organization" ? `organization (${poster.orgName ?? "no name"})` : "individual"}` : "OpenRaiz"}</Row>
          <Row label="Type">{card.types[row.type] ?? row.type}</Row>
          <Row label="Organization shown">{row.organization}</Row>
          <Row label="Short summary">{row.summary ?? "—"}</Row>
          <Row label="Description"><span className="detail-text">{row.description}</span></Row>
          <Row label="Requirements"><span className="detail-text">{row.requirements ?? "—"}</span></Row>
          <Row label="Skills">{row.skills.length ? row.skills.join(", ") : "—"}</Row>
          <Row label="Category">{row.category ?? "—"}</Row>
          <Row label="Location">{`${card.locations[row.locationType] ?? row.locationType}${place ? ` · ${place}` : ""}${row.address ? ` · ${row.address}` : ""}`}</Row>
          <Row label="Pay">{`${row.isPaid ? "Paid" : "Unpaid"} · ${row.compensation}`}</Row>
          <Row label="Time commitment">{row.commitment ?? "—"}</Row>
          <Row label="Event date">{iso(row.eventDate) ? formatDate(iso(row.eventDate), "en") : "—"}</Row>
          <Row label="Deadline">{iso(row.deadline) ? formatDate(iso(row.deadline), "en") : "Rolling"}</Row>
          <Row label="Lived experience">{card.relevance[row.livedExperienceRelevance]}</Row>
          <Row label="How to join or apply">{apply}</Row>
        </dl>
        <p>
          <Link className="button button-secondary button-small" href={`/admin/opportunities/${row.id}/edit`}>
            Edit the original
          </Link>
        </p>
      </section>

      <ReviewPanel
        listingId={row.id}
        targetLanguage={LANGUAGE_NAMES[target]}
        queuePath="/admin/queue"
        canApprove={row.approvalStatus === "pending" && row.status !== "archived"}
        initialTranslation={
          row.translationStatus === "approved"
            ? { title: row.titleTr, summary: row.summaryTr, description: row.descriptionTr, requirements: row.requirementsTr }
            : undefined
        }
      />
    </>
  );
}

export default function ReviewPage({ params }) {
  return (
    <main id="main-content" tabIndex={-1} className="page-main detail-page">
      <Suspense fallback={<p className="state-message">Loading&hellip;</p>}>
        <AdminGate next="/admin/queue">
          <Review params={params} />
        </AdminGate>
      </Suspense>
    </main>
  );
}
