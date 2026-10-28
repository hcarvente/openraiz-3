// The decisions behind PATCH and DELETE /api/posts/[id], kept apart from the web layer so every case can be tested:
// only the owner may change a listing; a change sends it back to review (so an approved listing is hidden until it is
// approved again); a changed text clears any saved translation, which would no longer match; withdrawing archives
// the listing instead of deleting it. `loadOwned`, `countPending`, `updateListing` and `archiveListing` are passed in,
// so the tests need no database.
import { isValidListingId } from "./opportunityDetail.js";
import { MAX_PENDING_POSTS, validatePost } from "./validatePost.js";

// The fields whose change makes a saved translation out of date.
const TEXT_FIELDS = ["title", "summary", "description", "requirements", "originalLang"];

const same = (a, b) => (a ?? null) === (b ?? null);

function gate(current) {
  if (!current) return { status: 401, body: { error: "signIn" } };
  if (!current.isVerified) return { status: 403, body: { error: "unverified" } };
  if (!current.profile) return { status: 403, body: { error: "noProfile" } };
  return null;
}

const isoDay = (date) => (date instanceof Date ? date.toISOString().slice(0, 10) : String(date).slice(0, 10));

export async function editPost({ current, id, body, loadOwned, countPending, updateListing }) {
  const refused = gate(current);
  if (refused) return refused;
  if (!isValidListingId(id)) return { status: 404, body: { error: "notFound" } };

  // A listing that is not yours looks exactly like one that does not exist.
  const existing = await loadOwned(id, current.user.id);
  if (!existing) return { status: 404, body: { error: "notFound" } };
  if (existing.status === "archived") return { status: 409, body: { error: "withdrawn" } };

  // The original posting date is kept: it is passed in as "today" so the rules see the same date again.
  const result = validatePost(body, current.profile, isoDay(existing.datePosted));
  if (!result.ok) return { status: 400, body: { error: "invalid", details: result.errors } };

  // Anything not already pending goes back to pending, which counts against the limit.
  if (existing.approvalStatus !== "pending" && (await countPending(current.user.id)) >= MAX_PENDING_POSTS) {
    return { status: 429, body: { error: "tooManyPending" } };
  }

  const textChanged = TEXT_FIELDS.some((field) => !same(existing[field], result.data[field]));
  await updateListing(id, {
    ...result.data,
    approvalStatus: "pending",
    rejectionReason: null,
    ...(textChanged
      ? { titleTr: null, summaryTr: null, descriptionTr: null, requirementsTr: null, translationStatus: "none" }
      : {}),
  });
  return { status: 200, body: { id, approvalStatus: "pending" } };
}

export async function withdrawPost({ current, id, loadOwned, archiveListing }) {
  const refused = gate(current);
  if (refused) return refused;
  if (!isValidListingId(id)) return { status: 404, body: { error: "notFound" } };
  const existing = await loadOwned(id, current.user.id);
  if (!existing) return { status: 404, body: { error: "notFound" } };
  if (existing.status !== "archived") await archiveListing(id);
  return { status: 200, body: { id, status: "archived" } };
}
