// The decision behind POST /api/posts, kept apart from the web layer so every case can be tested directly: who may
// post, what is checked, how many pending listings one account may have, and what the server (never the browser) sets.
// `countPending` and `createListing` are passed in, so tests do not need a database.
import { MAX_PENDING_POSTS, validatePost } from "./validatePost.js";

// current: the signed-in person as lib/roles.js getCurrentUser() returns them ({ user, profile, isVerified, isAdmin }),
// or null when nobody is signed in. Returns { status, body } for the response.
export async function submitPost({ current, body, today, countPending, createListing }) {
  if (!current) return { status: 401, body: { error: "signIn" } };
  if (!current.isVerified) return { status: 403, body: { error: "unverified" } };
  if (!current.profile) return { status: 403, body: { error: "noProfile" } };

  const result = validatePost(body, current.profile, today);
  if (!result.ok) return { status: 400, body: { error: "invalid", details: result.errors } };

  if ((await countPending(current.user.id)) >= MAX_PENDING_POSTS) {
    return { status: 429, body: { error: "tooManyPending" } };
  }

  // The server decides all of these. Nothing in the request can set them (validatePost never passes them through).
  const created = await createListing({
    ...result.data,
    approvalStatus: "pending",
    ownerUserId: current.user.id,
    source: "user-posted",
  });
  return { status: 201, body: { id: created.id } };
}
