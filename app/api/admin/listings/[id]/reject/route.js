// POST /api/admin/listings/[id]/reject: send a pending listing back to its poster with a reason they will read.
import { rejectListing } from "@/lib/moderation";
import { runAdminAction } from "@/lib/adminListingRoute";

export async function POST(request, { params }) {
  return runAdminAction(request, params, ({ id, body, loadListing, update }) =>
    rejectListing({ id, reason: body.reason, loadListing, update }),
  );
}
