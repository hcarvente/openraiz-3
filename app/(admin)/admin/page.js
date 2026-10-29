// The admin dashboard (/admin): what needs attention, how the site is doing, and how much of the AI's daily allowance is used.
// Admin only (AdminGate). It shows counts and titles, never the text of messages. Worked out per visit, because "waiting for
// 3 days" and "today's AI use" change.
import { Suspense } from "react";
import Link from "next/link";
import { connection } from "next/server";
import AdminGate from "@/components/AdminGate";
import AdminNav from "@/components/admin/AdminNav";
import { dailyCapFor, isAiEnabled } from "@/lib/ai/limits";
import { agoLabel, listingState, meterPercent, meterState, waitedLabel } from "@/lib/adminStats";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { prisma } from "@/lib/prisma";

export const metadata = { title: "Admin dashboard | OpenRaiz" };

const AI_FEATURES = [
  { route: "job_fit", label: "Job-Fit Explainer" },
  { route: "interview", label: "Interview Coach" },
  { route: "translate", label: "Translate with AI" },
];

async function Dashboard() {
  await connection();
  const now = new Date();
  const today = new Date(`${now.toISOString().slice(0, 10)}T00:00:00.000Z`);
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const types = getDictionary("en").card.types;
  const reasons = getDictionary("en").report.reasons;

  let data;
  try {
    const [pending, live, rejected, withdrawn, drafts, openReports, messagesWeek, queue, reports, recent, usage] = await Promise.all([
      prisma.opportunity.count({ where: { approvalStatus: "pending", status: { not: "archived" } } }),
      prisma.opportunity.count({ where: { approvalStatus: "approved", status: { not: "archived" } } }),
      prisma.opportunity.count({ where: { approvalStatus: "rejected", status: { not: "archived" } } }),
      prisma.opportunity.count({ where: { status: "archived" } }),
      prisma.opportunity.count({ where: { translationStatus: "ai_draft" } }),
      prisma.listingReport.count({ where: { resolvedAt: null } }),
      prisma.contactMessage.count({ where: { createdAt: { gte: weekAgo } } }),
      prisma.opportunity.findMany({
        where: { approvalStatus: "pending", status: { not: "archived" } },
        orderBy: [{ createdAt: "asc" }, { id: "asc" }],
        take: 5,
        select: { id: true, title: true, type: true, createdAt: true, originalLang: true },
      }),
      prisma.listingReport.findMany({
        where: { resolvedAt: null },
        orderBy: [{ createdAt: "asc" }, { id: "asc" }],
        take: 5,
        select: { id: true, reason: true, createdAt: true, opportunity: { select: { id: true, title: true } } },
      }),
      prisma.opportunity.findMany({
        orderBy: [{ createdAt: "desc" }, { id: "desc" }],
        take: 8,
        select: { id: true, title: true, type: true, organization: true, createdAt: true, approvalStatus: true, status: true },
      }),
      prisma.aiUsage.findMany({ where: { day: today }, select: { route: true, count: true } }),
    ]);
    data = { pending, live, rejected, withdrawn, drafts, openReports, messagesWeek, queue, reports, recent, usage };
  } catch (error) {
    console.error("Admin dashboard could not load:", error?.name, error?.code);
    return (
      <p className="state-message state-error" role="alert">
        We couldn&rsquo;t load the dashboard right now. Please try again in a moment.
      </p>
    );
  }

  const used = new Map(data.usage.map((u) => [u.route, u.count]));
  const aiOn = isAiEnabled(process.env);
  const total = data.pending + data.live + data.rejected + data.withdrawn;
  const split = [
    { label: "Live", value: data.live, tone: "live" },
    { label: "Waiting", value: data.pending, tone: "pending" },
    { label: "Rejected", value: data.rejected, tone: "rejected" },
    { label: "Withdrawn", value: data.withdrawn, tone: "withdrawn" },
  ];
  const oldest = data.queue[0];

  return (
    <>
      <AdminNav counts={{ pending: data.pending, reports: data.openReports }} />
      <h1>Admin dashboard</h1>
      <p className="page-intro">
        {now.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", timeZone: "UTC" })}. What needs you first is at the top.
      </p>

      <ul className="stat-tiles">
        <li>
          <Link className={`stat-tile${data.pending > 0 ? " needs-action" : ""}`} href="/admin/queue">
            <span className="stat-number">{data.pending}</span>
            <span className="stat-label">Waiting for review</span>
            <span className="stat-hint">{oldest ? `Oldest has waited ${waitedLabel(oldest.createdAt, now)}` : "All caught up"}</span>
          </Link>
        </li>
        <li>
          <Link className={`stat-tile${data.openReports > 0 ? " needs-action" : ""}`} href="/admin/reports">
            <span className="stat-number">{data.openReports}</span>
            <span className="stat-label">Open reports</span>
            <span className="stat-hint">{data.openReports > 0 ? "Someone flagged a listing" : "Nothing flagged"}</span>
          </Link>
        </li>
        <li className="stat-tile">
          <span className="stat-number">{data.live}</span>
          <span className="stat-label">Live listings</span>
          <span className="stat-hint">Public right now</span>
        </li>
        <li className="stat-tile">
          <span className="stat-number">{data.drafts}</span>
          <span className="stat-label">AI translation drafts</span>
          <span className="stat-hint">Saved but not approved</span>
        </li>
        <li className="stat-tile">
          <span className="stat-number">{data.messagesWeek}</span>
          <span className="stat-label">Messages, last 7 days</span>
          <span className="stat-hint">Sent to posters</span>
        </li>
      </ul>

      <div className="dash-grid">
        <section className="dash-panel" aria-labelledby="queue-heading">
          <div className="dash-panel-head">
            <h2 id="queue-heading">Waiting for review</h2>
            <Link href="/admin/queue">See all</Link>
          </div>
          {data.queue.length === 0 ? (
            <p className="state-message">Nothing is waiting. Nice.</p>
          ) : (
            <ul className="dash-list">
              {data.queue.map((row) => (
                <li key={row.id}>
                  <Link href={`/admin/queue/${row.id}`}>{row.title}</Link>
                  <span>
                    {types[row.type] ?? row.type} · {row.originalLang === "es" ? "Spanish" : "English"} · {waitedLabel(row.createdAt, now)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="dash-panel" aria-labelledby="reports-heading">
          <div className="dash-panel-head">
            <h2 id="reports-heading">Open reports</h2>
            <Link href="/admin/reports">See all</Link>
          </div>
          {data.reports.length === 0 ? (
            <p className="state-message">No open reports.</p>
          ) : (
            <ul className="dash-list">
              {data.reports.map((report) => (
                <li key={report.id}>
                  <Link href={`/admin/queue/${report.opportunity.id}`}>{report.opportunity.title}</Link>
                  <span>
                    {reasons[report.reason] ?? report.reason} · {waitedLabel(report.createdAt, now)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="dash-panel" aria-labelledby="ai-heading">
          <div className="dash-panel-head">
            <h2 id="ai-heading">AI use today</h2>
            <span className={`pill ${aiOn ? "pill-state-live" : "pill-state-rejected"}`}>{aiOn ? "AI is on" : "AI is switched off"}</span>
          </div>
          <ul className="meters">
            {AI_FEATURES.map(({ route, label }) => {
              const count = used.get(route) ?? 0;
              const cap = dailyCapFor(route, process.env);
              const percent = meterPercent(count, cap);
              return (
                <li key={route}>
                  <div className="meter-label">
                    <span>{label}</span>
                    <span>
                      {count} of {cap}
                    </span>
                  </div>
                  <div
                    className={`meter meter-${meterState(percent)}`}
                    role="meter"
                    aria-label={`${label}, calls used today`}
                    aria-valuemin={0}
                    aria-valuemax={cap}
                    aria-valuenow={Math.min(count, cap)}
                  >
                    <div className="meter-fill" style={{ width: `${percent}%` }} />
                  </div>
                </li>
              );
            })}
          </ul>
          <p className="dash-note">Each call counts when it starts, even if the AI then fails. The limits reset at midnight UTC.</p>
        </section>

        <section className="dash-panel" aria-labelledby="split-heading">
          <div className="dash-panel-head">
            <h2 id="split-heading">All listings</h2>
            <span className="dash-total">{total} in total</span>
          </div>
          <div className="split-bar" role="img" aria-label={split.map((s) => `${s.value} ${s.label.toLowerCase()}`).join(", ")}>
            {split.map((s) => (s.value > 0 ? <span key={s.label} className={`split-${s.tone}`} style={{ flexGrow: s.value }} /> : null))}
          </div>
          <ul className="split-legend">
            {split.map((s) => (
              <li key={s.label}>
                <span className={`split-dot split-${s.tone}`} aria-hidden="true" />
                {s.label} <strong>{s.value}</strong>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section className="dash-panel dash-wide" aria-labelledby="recent-heading">
        <div className="dash-panel-head">
          <h2 id="recent-heading">Newest listings</h2>
          <Link href="/admin/opportunities/new">Add a listing</Link>
        </div>
        <div className="table-scroll">
          <table className="dash-table">
            <thead>
              <tr>
                <th scope="col">Title</th>
                <th scope="col">Organization</th>
                <th scope="col">Type</th>
                <th scope="col">State</th>
                <th scope="col">Added</th>
              </tr>
            </thead>
            <tbody>
              {data.recent.map((row) => {
                const state = listingState(row);
                return (
                  <tr key={row.id}>
                    <th scope="row">
                      <Link href={`/admin/queue/${row.id}`}>{row.title}</Link>
                    </th>
                    <td>{row.organization}</td>
                    <td>{types[row.type] ?? row.type}</td>
                    <td>
                      <span className={`pill pill-state-${state.tone}`}>{state.label}</span>
                    </td>
                    <td>{agoLabel(row.createdAt, now)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}

export default function AdminDashboardPage() {
  return (
    <main id="main-content" tabIndex={-1} className="page-main admin-main">
      <Suspense fallback={<p className="state-message">Loading&hellip;</p>}>
        <AdminGate next="/admin">
          <Dashboard />
        </AdminGate>
      </Suspense>
    </main>
  );
}
