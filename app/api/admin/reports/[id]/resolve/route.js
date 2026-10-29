// POST /api/admin/reports/[id]/resolve: the admin marks a report as handled.
import { requireAdminApi } from "@/lib/roles";
import { prisma } from "@/lib/prisma";
import { isSameOrigin } from "@/lib/sameOrigin";
import { isValidListingId } from "@/lib/opportunityDetail";
import { resolveReport } from "@/lib/reportListing";

export async function POST(request, { params }) {
  if (!isSameOrigin(request.headers)) return Response.json({ error: "Request not allowed." }, { status: 403 });
  const { denied } = await requireAdminApi();
  if (denied) return denied;

  const { id } = await params;
  if (!isValidListingId(id)) return Response.json({ error: "Report not found." }, { status: 404 }); // report ids look the same as listing ids

  try {
    const result = await resolveReport({
      id,
      loadReport: (reportId) => prisma.listingReport.findUnique({ where: { id: reportId }, select: { id: true, resolvedAt: true } }),
      update: (reportId, data) => prisma.listingReport.update({ where: { id: reportId }, data }),
      now: new Date(),
    });
    return Response.json(result.body, { status: result.status });
  } catch (error) {
    console.error("POST /api/admin/reports/[id]/resolve failed:", error?.name, error?.code);
    return Response.json({ error: "Something went wrong." }, { status: 500 });
  }
}
