// The decisions behind reporting a listing and handling a report: who may report, what is checked, the limits, and what
// the server records. The lookups are passed in, so the tests need no database. Plain JavaScript with relative imports only.
import { isValidListingId } from "./opportunityDetail.js";

export const REPORT_REASONS = ["scam_or_payment", "unsafe", "misleading", "discriminatory", "spam", "other"];
export const MAX_NOTE = 500;
export const MAX_REPORTS_PER_DAY = 10;

// The reason (one of the list) and an optional note. Returns { ok: true, data } or { ok: false, errors: [{ field, code }] }.
export function validateReport(input) {
  if (input === null || typeof input !== "object" || Array.isArray(input)) {
    return { ok: false, errors: [{ field: "body", code: "invalid" }] };
  }
  const errors = [];
  for (const key of Object.keys(input)) if (key !== "reason" && key !== "note") errors.push({ field: key, code: "unknown" });

  const reason = typeof input.reason === "string" ? input.reason.trim() : input.reason;
  if (reason === undefined || reason === null || reason === "") errors.push({ field: "reason", code: "required" });
  else if (!REPORT_REASONS.includes(reason)) errors.push({ field: "reason", code: "invalid" });

  let note = null;
  if (input.note !== undefined && input.note !== null && input.note !== "") {
    const value = typeof input.note === "string" ? input.note.trim() : input.note;
    if (typeof value !== "string") errors.push({ field: "note", code: "invalid" });
    else if (value.length > MAX_NOTE) errors.push({ field: "note", code: "tooLong" });
    else note = value === "" ? null : value;
  }

  if (errors.length > 0) return { ok: false, errors };
  return { ok: true, data: { reason, note } };
}

// current: the signed-in person as lib/roles.js getCurrentUser() returns them, or null. Returns { status, body }.
export async function reportListing({ current, id, body, loadListing, countToday, hasOpenReport, createReport }) {
  if (!current) return { status: 401, body: { error: "signIn" } };
  if (!current.isVerified) return { status: 403, body: { error: "unverified" } };
  if (!current.profile) return { status: 403, body: { error: "noProfile" } };
  if (!isValidListingId(id)) return { status: 404, body: { error: "notFound" } };

  // Only a public listing can be reported (a pending or withdrawn one is not visible to the reporter anyway).
  const listing = await loadListing(id);
  if (!listing || listing.approvalStatus !== "approved" || listing.status === "archived") return { status: 404, body: { error: "notFound" } };
  if (listing.ownerUserId === current.user.id) return { status: 403, body: { error: "ownListing" } };

  const result = validateReport(body);
  if (!result.ok) return { status: 400, body: { error: "invalid", details: result.errors } };

  if (await hasOpenReport(current.user.id, id)) return { status: 409, body: { error: "alreadyReported" } };
  if ((await countToday(current.user.id)) >= MAX_REPORTS_PER_DAY) return { status: 429, body: { error: "tooManyToday" } };

  const { profile } = current;
  await createReport({
    opportunityId: id,
    reporterUserId: current.user.id,
    reporterName: profile.role === "organization" ? profile.orgName || profile.displayName : profile.displayName,
    reason: result.data.reason,
    note: result.data.note,
  });
  return { status: 201, body: { reported: true } };
}

// Marks a report as handled (admin only; the route checks that first).
export async function resolveReport({ id, loadReport, update, now }) {
  const report = await loadReport(id);
  if (!report) return { status: 404, body: { error: "Report not found." } };
  if (report.resolvedAt) return { status: 200, body: { id, resolved: true } }; // already handled: nothing to do
  await update(id, { resolvedAt: now });
  return { status: 200, body: { id, resolved: true } };
}
