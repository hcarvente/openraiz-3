// POST /api/admin/listings/[id]/approve: publish a pending listing, optionally saving its translation in the same step.
import { approveListing } from "@/lib/moderation";
import { runAdminAction } from "@/lib/adminListingRoute";

export async function POST(request, { params }) {
  return runAdminAction(request, params, ({ id, body, loadListing, update }) =>
    approveListing({ id, translation: body.translation, loadListing, update }),
  );
}
