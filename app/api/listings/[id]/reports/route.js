// POST /api/listings/[id]/reports: a signed-in, email-verified person reports a public listing. The admin reads reports at
// /admin/reports. Who may report and what is checked: lib/reportListing.js.
import { getCurrentUser } from "@/lib/roles";
import { prisma } from "@/lib/prisma";
import { isSameOrigin } from "@/lib/sameOrigin";
import { reportListing } from "@/lib/reportListing";

const DAY_MS = 24 * 60 * 60 * 1000;

export async function POST(request, { params }) {
  if (!isSameOrigin(request.headers)) return Response.json({ error: "forbiddenOrigin" }, { status: 403 });

  let current;
  try {
    current = await getCurrentUser();
  } catch (error) {
    console.error("Could not check the signed-in user:", error?.name, error?.code);
    return Response.json({ error: "unavailable" }, { status: 503 }); // fails closed
  }

  const { id } = await params;
  let body;
  try {
    body = await request.json();
  } catch {
    body = undefined; // reportListing answers 401/403/404 first for anyone who may not report, then 400 for the bad body
  }

  try {
    const result = await reportListing({
      current,
      id,
      body,
      loadListing: (listingId) => prisma.opportunity.findUnique({ where: { id: listingId }, select: { id: true, ownerUserId: true, status: true, approvalStatus: true } }),
      countToday: (userId) => prisma.listingReport.count({ where: { reporterUserId: userId, createdAt: { gte: new Date(Date.now() - DAY_MS) } } }),
      hasOpenReport: async (userId, listingId) => (await prisma.listingReport.count({ where: { reporterUserId: userId, opportunityId: listingId, resolvedAt: null } })) > 0,
      createReport: (data) => prisma.listingReport.create({ data }),
    });
    return Response.json(result.body, { status: result.status });
  } catch (error) {
    console.error("POST /api/listings/[id]/reports failed:", error?.name, error?.code);
    return Response.json({ error: "server" }, { status: 500 });
  }
}
