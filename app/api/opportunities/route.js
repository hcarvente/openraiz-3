// GET  /api/opportunities: returns every opportunity (any status) as a flat JSON array.
// POST /api/opportunities: validates a flat JSON body and creates one opportunity.
// All database access and validation happen here on the server; the browser only sees JSON.
//
// SECURITY: GET is public. POST is admin only (requireAdminApi: 401 if not signed in, 403 if not admin).
import { prisma } from "@/lib/prisma";
import { requireAdminApi } from "@/lib/roles";
import { serializeOpportunity } from "@/lib/serializeOpportunity";
import { validateOpportunity } from "@/lib/validateOpportunity";

export async function GET() {
  try {
    const opportunities = await prisma.opportunity.findMany({
      // A fixed order keeps the list from reshuffling after edits: newest posting first.
      orderBy: [{ datePosted: "desc" }, { id: "asc" }],
    });
    return Response.json(opportunities.map(serializeOpportunity));
  } catch (error) {
    // Log only the error's name and code on the server; never send internals to the browser.
    console.error("GET /api/opportunities failed:", error?.name, error?.code);
    return Response.json({ error: "Could not load opportunities." }, { status: 500 });
  }
}

export async function POST(request) {
  const denied = await requireAdminApi();
  if (denied) return denied;

  // 1. Read the JSON body. Malformed or empty JSON is the client's mistake: 400.
  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Request body must be valid JSON." }, { status: 400 });
  }

  // 2. Validate. The messages in `details` only describe the client's own input, so they are safe to return.
  const result = validateOpportunity(body);
  if (!result.ok) {
    return Response.json({ error: "Invalid opportunity data.", details: result.errors }, { status: 400 });
  }

  // 3. Save, then return the new opportunity in the same flat shape GET uses.
  try {
    const created = await prisma.opportunity.create({ data: result.data });
    return Response.json(serializeOpportunity(created), { status: 201 });
  } catch (error) {
    console.error("POST /api/opportunities failed:", error?.name, error?.code);
    return Response.json({ error: "Could not create the opportunity." }, { status: 500 });
  }
}
