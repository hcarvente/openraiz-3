// PUT /api/admin/listings/[id]/translation: save the translation of a listing (title and description required).
import { saveTranslation } from "@/lib/moderation";
import { runAdminAction } from "@/lib/adminListingRoute";

export async function PUT(request, { params }) {
  return runAdminAction(request, params, ({ id, body, loadListing, update }) =>
    saveTranslation({ id, translation: body.translation, loadListing, update }),
  );
}
