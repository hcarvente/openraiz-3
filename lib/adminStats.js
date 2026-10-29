// Small rules for the admin dashboard. Plain JavaScript with no imports, so they are easy to test.

const DAY_MS = 24 * 60 * 60 * 1000;

// "today", "1 day", "5 days", "3 weeks" for how long something has waited. `now` is passed in (never read from the clock here).
export function waitedLabel(createdAt, now) {
  const days = Math.max(0, Math.floor((new Date(now).getTime() - new Date(createdAt).getTime()) / DAY_MS));
  if (days === 0) return "today";
  if (days === 1) return "1 day";
  if (days < 14) return `${days} days`;
  return `${Math.floor(days / 7)} weeks`;
}

// How full a daily limit is, as a whole percentage from 0 to 100 (a missing or zero limit counts as full).
export function meterPercent(count, cap) {
  if (!Number.isFinite(cap) || cap <= 0) return 100;
  return Math.min(100, Math.max(0, Math.round((count / cap) * 100)));
}

// "ok" below 70%, "warn" from 70%, "full" at 100%: the dashboard colors a meter by this.
export function meterState(percent) {
  if (percent >= 100) return "full";
  if (percent >= 70) return "warn";
  return "ok";
}

// The words and style for a listing's place in the approval process. Withdrawn (archived) listings show as withdrawn.
export function listingState({ approvalStatus, status }) {
  if (status === "archived") return { label: "Withdrawn", tone: "withdrawn" };
  if (approvalStatus === "pending") return { label: "Waiting", tone: "pending" };
  if (approvalStatus === "rejected") return { label: "Rejected", tone: "rejected" };
  if (status === "filled") return { label: "Filled", tone: "filled" };
  return { label: "Live", tone: "live" };
}

// "today" or "3 days ago", for a date in the past.
export function agoLabel(createdAt, now) {
  const waited = waitedLabel(createdAt, now);
  return waited === "today" ? waited : `${waited} ago`;
}
