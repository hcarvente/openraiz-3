// The decision behind POST /api/listings/[id]/messages: who may write to the poster of a listing, what is checked, how many
// messages one person may send, and what the server (never the browser) records. The lookups are passed in, so the tests
// need no database. Plain JavaScript with relative imports only.
import { isValidListingId } from "./opportunityDetail.js";

export const MAX_MESSAGE = 1000;
export const MAX_CONTACT = 200;
export const MAX_PER_DAY = 10; // messages one person may send in 24 hours
export const MAX_PER_LISTING = 3; // messages one person may send to the same listing

// The message and the optional contact the sender chose to share. Returns { ok: true, data } or { ok: false, errors }
// where errors is a list of { field, code } the form can show in the visitor's language.
export function validateMessage(input) {
  if (input === null || typeof input !== "object" || Array.isArray(input)) {
    return { ok: false, errors: [{ field: "body", code: "invalid" }] };
  }
  const errors = [];
  for (const key of Object.keys(input)) if (key !== "message" && key !== "contact") errors.push({ field: key, code: "unknown" });

  const text = (value) => (typeof value === "string" ? value.trim() : value);
  const message = text(input.message);
  if (typeof message !== "string" || message === "") errors.push({ field: "message", code: message === undefined || message === null || message === "" ? "required" : "invalid" });
  else if (message.length > MAX_MESSAGE) errors.push({ field: "message", code: "tooLong" });

  let contact = null;
  if (input.contact !== undefined && input.contact !== null && input.contact !== "") {
    const value = text(input.contact);
    if (typeof value !== "string") errors.push({ field: "contact", code: "invalid" });
    else if (value.length > MAX_CONTACT) errors.push({ field: "contact", code: "tooLong" });
    else contact = value === "" ? null : value;
  }

  if (errors.length > 0) return { ok: false, errors };
  return { ok: true, data: { body: message, contact } };
}

// current: the signed-in person as lib/roles.js getCurrentUser() returns them, or null. Returns { status, body }.
export async function sendMessage({ current, id, body, loadListing, countToday, countForListing, createMessage }) {
  if (!current) return { status: 401, body: { error: "signIn" } };
  if (!current.isVerified) return { status: 403, body: { error: "unverified" } };
  if (!current.profile) return { status: 403, body: { error: "noProfile" } };
  if (!isValidListingId(id)) return { status: 404, body: { error: "notFound" } };

  // Only a public, open listing that uses OpenRaiz contact accepts messages. Anything else looks like it does not exist.
  const listing = await loadListing(id);
  const accepts = listing && listing.approvalStatus === "approved" && listing.status === "active" && listing.applyMethodType === "platform";
  if (!accepts) return { status: 404, body: { error: "notFound" } };
  if (listing.ownerUserId === current.user.id) return { status: 403, body: { error: "ownListing" } };

  const result = validateMessage(body);
  if (!result.ok) return { status: 400, body: { error: "invalid", details: result.errors } };

  if ((await countToday(current.user.id)) >= MAX_PER_DAY) return { status: 429, body: { error: "tooManyToday" } };
  if ((await countForListing(current.user.id, id)) >= MAX_PER_LISTING) return { status: 429, body: { error: "tooManyForListing" } };

  const { profile } = current;
  await createMessage({
    opportunityId: id,
    senderUserId: current.user.id,
    senderName: profile.role === "organization" ? profile.orgName || profile.displayName : profile.displayName,
    senderRole: profile.role,
    contact: result.data.contact,
    body: result.data.body,
  });
  return { status: 201, body: { sent: true } };
}
