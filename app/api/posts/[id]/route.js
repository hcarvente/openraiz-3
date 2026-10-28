// PATCH  /api/posts/[id]: the owner changes their listing; it goes back to review (lib/editPost.js).
// DELETE /api/posts/[id]: the owner withdraws their listing (it is archived, never deleted).
// A listing that is not yours answers 404, exactly like one that does not exist.
import { getCurrentUser } from "@/lib/roles";
import { prisma } from "@/lib/prisma";
import { isSameOrigin } from "@/lib/sameOrigin";
import { editPost, withdrawPost } from "@/lib/editPost";

// Only listings that people posted are reachable here (never the ones the admin entered), and only by their owner.
const loadOwned = (id, userId) => prisma.opportunity.findFirst({ where: { id, ownerUserId: userId, source: "user-posted" } });

async function currentOrFail() {
  try {
    return { current: await getCurrentUser() };
  } catch (error) {
    console.error("Could not check the signed-in user:", error?.name, error?.code);
    return { failure: Response.json({ error: "unavailable" }, { status: 503 }) }; // fails closed
  }
}

export async function PATCH(request, { params }) {
  if (!isSameOrigin(request.headers)) return Response.json({ error: "forbiddenOrigin" }, { status: 403 });
  const { current, failure } = await currentOrFail();
  if (failure) return failure;
  const { id } = await params;

  let body;
  try {
    body = await request.json();
  } catch {
    body = undefined; // editPost answers 401/403/404 first for anyone who may not edit, then 400 for the bad body
  }

  try {
    const result = await editPost({
      current,
      id,
      body,
      loadOwned,
      countPending: (userId) => prisma.opportunity.count({ where: { ownerUserId: userId, approvalStatus: "pending" } }),
      updateListing: (listingId, data) => prisma.opportunity.update({ where: { id: listingId }, data }),
    });
    return Response.json(result.body, { status: result.status });
  } catch (error) {
    console.error("PATCH /api/posts/[id] failed:", error?.name, error?.code);
    return Response.json({ error: "server" }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  if (!isSameOrigin(request.headers)) return Response.json({ error: "forbiddenOrigin" }, { status: 403 });
  const { current, failure } = await currentOrFail();
  if (failure) return failure;
  const { id } = await params;

  try {
    const result = await withdrawPost({
      current,
      id,
      loadOwned,
      archiveListing: (listingId) => prisma.opportunity.update({ where: { id: listingId }, data: { status: "archived" } }),
    });
    return Response.json(result.body, { status: result.status });
  } catch (error) {
    console.error("DELETE /api/posts/[id] failed:", error?.name, error?.code);
    return Response.json({ error: "server" }, { status: 500 });
  }
}
