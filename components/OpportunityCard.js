// One opportunity, shown as a card. It receives its data through props and has no state or
// effects, so it is a Server Component: it runs on the server and only its finished HTML
// is sent to the browser.
//
// `opportunity` has the same flat shape the API returns (see lib/serializeOpportunity.js),
// with calendar dates as "YYYY-MM-DD" strings. `today` is also "YYYY-MM-DD"; it is passed
// in (not read from the clock here) so the card always renders the same output for the same props.
//
// `showAdminActions` adds the Edit link and the Delete button. It is off by default and no public page turns it on:
// the admin routes and write APIs are locked (proxy.js), and a signed-in admin view will turn it on later.
import Link from "next/link";
import DeleteOpportunityButton from "@/components/DeleteOpportunityButton";

const TYPE_LABELS = { job: "Job", internship: "Internship", fellowship: "Fellowship", volunteer: "Volunteer" };
const STATUS_LABELS = { active: "Active", filled: "Filled", archived: "Archived" };
const RELEVANCE_LABELS = { required: "Required", preferred: "Preferred", welcomed: "Welcomed", relevant: "Relevant" };
const LOCATION_LABELS = { remote: "Remote", hybrid: "Hybrid", onsite: "On-site" };

// "2026-12-15" -> "Dec 15, 2026". Always in UTC, so the calendar day never shifts with the viewer's time zone.
function formatDate(isoDate) {
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" }).format(
    new Date(isoDate),
  );
}

function Icon({ size = 16, children }) {
  return (
    <svg
      className="icon"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

const BriefcaseShapes = (
  <>
    <rect x="3" y="7" width="18" height="13" rx="2" />
    <path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
    <path d="M3 13h18" />
  </>
);

export default function OpportunityCard({ opportunity, today, showAdminActions = false }) {
  const typeLabel = TYPE_LABELS[opportunity.type] ?? opportunity.type;
  const statusLabel = STATUS_LABELS[opportunity.status] ?? opportunity.status;
  const relevanceLabel = RELEVANCE_LABELS[opportunity.livedExperienceRelevance] ?? opportunity.livedExperienceRelevance;

  // Remote shows just "Remote"; hybrid / on-site add the place when we have one.
  const arrangement = LOCATION_LABELS[opportunity.locationType] ?? opportunity.locationType;
  const place = [opportunity.city, opportunity.state].filter(Boolean).join(", ");
  const location = opportunity.locationType === "remote" || !place ? arrangement : `${arrangement} · ${place}`;

  // A missing deadline means a rolling opportunity. A deadline is inclusive: due today is still open.
  const hasDeadline = Boolean(opportunity.deadline);
  const deadlinePassed = hasDeadline && Boolean(today) && opportunity.deadline < today;

  return (
    <article className="opportunity-card">
      <div className="card-top">
        <span className="card-badge">
          <Icon size={22}>{BriefcaseShapes}</Icon>
        </span>
        <div className="card-heading">
          <h2 className="card-title">{opportunity.title}</h2>
          <p className="card-org">{opportunity.organization}</p>
        </div>
        <p className={`card-deadline${deadlinePassed ? " is-past" : ""}`}>
          <Icon>
            <rect x="3" y="4" width="18" height="18" rx="2" />
            <path d="M16 2v4M8 2v4M3 10h18" />
          </Icon>
          {hasDeadline ? (
            <span>
              {deadlinePassed ? "Deadline passed " : "Apply by "}
              <time dateTime={opportunity.deadline}>{formatDate(opportunity.deadline)}</time>
            </span>
          ) : (
            <span>Rolling deadline</span>
          )}
        </p>
      </div>

      <ul className="card-meta">
        <li className="meta-item">
          <Icon>{BriefcaseShapes}</Icon>
          {typeLabel}
        </li>
        <li className="meta-item">
          <Icon>
            <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </Icon>
          {location}
        </li>
        {opportunity.compensation ? (
          <li className="meta-item">
            <Icon>
              <circle cx="12" cy="12" r="9" />
              <path d="M12 7v10M14.5 9.5h-3.25a1.75 1.75 0 0 0 0 3.5h1.5a1.75 1.75 0 0 1 0 3.5H9.5" />
            </Icon>
            {opportunity.compensation}
          </li>
        ) : null}
      </ul>

      <div className="card-footer">
        <ul className="card-pills">
          <li className={`pill pill-status-${opportunity.status}`}>{statusLabel}</li>
          <li className="pill pill-relevance">Lived experience: {relevanceLabel}</li>
        </ul>
        {showAdminActions ? (
          <div className="card-actions">
            <Link
              className="button button-secondary button-small"
              href={`/admin/opportunities/${opportunity.id}/edit`}
              aria-label={`Edit ${opportunity.title}`}
            >
              Edit
            </Link>
            <DeleteOpportunityButton opportunityId={opportunity.id} title={opportunity.title} />
          </div>
        ) : null}
      </div>
    </article>
  );
}
