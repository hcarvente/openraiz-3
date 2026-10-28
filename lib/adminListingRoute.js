// What the three admin routes under /api/admin/listings/[id]/ have in common: the same-site check, the admin check (401, 403,
// or 503 when the sign-in service fails), a safe id, the JSON body, and the database lookups. The decisions themselves are in
// lib/moderation.js. Server-only.
import { requireAdminApi } from "@/lib/roles";
import { prisma } from "@/lib/prisma";
import { isSameOrigin } from "@/lib/sameOrigin";
import { isValidListingId } from "@/lib/opportunityDetail";

export async function runAdminAction(request, params, decide) {
  if (!isSameOrigin(request.headers)) return Response.json({ error: "Request not allowed." }, { status: 403 });
  const { denied } = await requireAdminApi();
  if (denied) return denied;

  const { id } = await params;
  if (!isValidListingId(id)) return Response.json({ error: "Listing not found." }, { status: 404 });

  let body;
  try {
    body = await request.json();
  } catch {
    body = {};
  }
  if (body === null || typeof body !== "object" || Array.isArray(body)) body = {};

  try {
    const result = await decide({
      id,
      body,
      loadListing: (listingId) => prisma.opportunity.findUnique({ where: { id: listingId }, select: { id: true, status: true, approvalStatus: true } }),
      update: (listingId, data) => prisma.opportunity.update({ where: { id: listingId }, data }),
    });
    return Response.json(result.body, { status: result.status });
  } catch (error) {
    console.error("Admin listing action failed:", error?.name, error?.code);
    return Response.json({ error: "Something went wrong." }, { status: 500 });
  }
}
