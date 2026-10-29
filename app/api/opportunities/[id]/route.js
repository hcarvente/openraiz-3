// GET    /api/opportunities/[id]: returns one public opportunity as flat JSON, or 404 if there is none (or it is not public).
// PATCH  /api/opportunities/[id]: changes only the fields named in the JSON body and returns the updated opportunity.
// DELETE /api/opportunities/[id]: permanently removes the opportunity and returns { id, deleted: true }, or 404 if there is none.
// The [id] in the folder name is a dynamic segment: for /api/opportunities/abc123 the id is "abc123".
// All database access and validation happen here on the server.
//
// SECURITY: GET is public. PATCH and DELETE are admin only (requireAdminApi: 401 if not signed in, 403 if not admin).
import { prisma } from "@/lib/prisma";
import { requireAdminApi } from "@/lib/roles";
import { isSameOrigin } from "@/lib/sameOrigin";
import { PUBLIC_WHERE } from "@/lib/opportunityVisibility";
import { serializeOpportunity, serializePublicOpportunity } from "@/lib/serializeOpportunity";
import { validateOpportunityUpdate } from "@/lib/validateOpportunityUpdate";

// Real ids are letters, digits, hyphens and underscores (generated ids and the old readable ids).
// Anything else cannot be an existing id, so we answer "not found" without asking the database.
// (PostgreSQL cannot even search for text such as a null byte, and would raise an error.)
const VALID_ID = /^[A-Za-z0-9_-]{1,100}$/;

export async function GET(_request, { params }) {
  // In this version of Next.js, `params` is a Promise, so it has to be awaited.
  const { id } = await params;

  if (!VALID_ID.test(id)) {
    return Response.json({ error: "Opportunity not found." }, { status: 404 });
  }

  try {
    // Only public listings: a pending, rejected or archived one answers "not found", like one that does not exist.
    const opportunity = await prisma.opportunity.findFirst({ where: { id, ...PUBLIC_WHERE } });

    if (!opportunity) {
      // The message does not repeat the id back to the caller.
      return Response.json({ error: "Opportunity not found." }, { status: 404 });
    }

    return Response.json(serializePublicOpportunity(opportunity));
  } catch (error) {
    // Log only the error's name and code on the server; never send internals to the browser.
    console.error("GET /api/opportunities/[id] failed:", error?.name, error?.code);
    return Response.json({ error: "Could not load the opportunity." }, { status: 500 });
  }
}

export async function PATCH(request, { params }) {
  if (!isSameOrigin(request.headers)) return Response.json({ error: "Request not allowed." }, { status: 403 });
  const { denied } = await requireAdminApi();
  if (denied) return denied;

  const { id } = await params;

  if (!VALID_ID.test(id)) {
    return Response.json({ error: "Opportunity not found." }, { status: 404 });
  }

  try {
    // 1. The opportunity must exist (404 if not), before anything about the request body is considered.
    const existing = await prisma.opportunity.findUnique({ where: { id } });
    if (!existing) {
      return Response.json({ error: "Opportunity not found." }, { status: 404 });
    }

    // 2. Read the JSON body. Malformed or empty JSON is the client's mistake: 400.
    let body;
    try {
      body = await request.json();
    } catch {
      return Response.json({ error: "Request body must be valid JSON." }, { status: 400 });
    }

    // 3. Validate the changes together with what is already saved. The messages in `details` only describe
    //    the client's own input and the saved values it conflicts with, so they are safe to return.
    const result = validateOpportunityUpdate(body, existing);
    if (!result.ok) {
      return Response.json({ error: "Invalid opportunity data.", details: result.errors }, { status: 400 });
    }

    // 4. Save only the fields the request named. Prisma sets lastUpdated to today's date automatically.
    const updated = await prisma.opportunity.update({ where: { id }, data: result.data });
    return Response.json(serializeOpportunity(updated));
  } catch (error) {
    // The opportunity was deleted between the lookup and the update.
    if (error?.code === "P2025") {
      return Response.json({ error: "Opportunity not found." }, { status: 404 });
    }
    console.error("PATCH /api/opportunities/[id] failed:", error?.name, error?.code);
    return Response.json({ error: "Could not update the opportunity." }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  if (!isSameOrigin(request.headers)) return Response.json({ error: "Request not allowed." }, { status: 403 });
  const { denied } = await requireAdminApi();
  if (denied) return denied;

  const { id } = await params;

  if (!VALID_ID.test(id)) {
    return Response.json({ error: "Opportunity not found." }, { status: 404 });
  }

  try {
    // 1. The opportunity must exist (404 if not).
    const existing = await prisma.opportunity.findUnique({ where: { id }, select: { id: true } });
    if (!existing) {
      return Response.json({ error: "Opportunity not found." }, { status: 404 });
    }

    // 2. Delete exactly that one record (the where clause names its id and nothing else).
    const deleted = await prisma.opportunity.delete({ where: { id }, select: { id: true } });
    return Response.json({ id: deleted.id, deleted: true });
  } catch (error) {
    // The opportunity was deleted by someone else between the lookup and the delete: it is gone either way.
    if (error?.code === "P2025") {
      return Response.json({ error: "Opportunity not found." }, { status: 404 });
    }
    console.error("DELETE /api/opportunities/[id] failed:", error?.name, error?.code);
    return Response.json({ error: "Could not delete the opportunity." }, { status: 500 });
  }
}
