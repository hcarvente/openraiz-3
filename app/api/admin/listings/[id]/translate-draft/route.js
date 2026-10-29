// POST /api/admin/listings/[id]/translate-draft: the admin asks the AI for a DRAFT translation of a listing into the other
// language. Nothing is saved: the draft goes back to the review page, where the admin reads it, edits it, and saves it (or not).
// Admin only. Limits (kill switch, speed, daily total) are checked before the AI is called. Logs hold token counts only.
import { prisma } from "@/lib/prisma";
import { requireAdminApi } from "@/lib/roles";
import { isSameOrigin } from "@/lib/sameOrigin";
import { isValidListingId } from "@/lib/opportunityDetail";
import { runAi } from "@/lib/ai/runAi";
import { incrementDailyUsage } from "@/lib/ai/usage";
import { burst, visitorKey } from "@/lib/ai/visitor";
import { TRANSLATE_MAX_OUTPUT_TOKENS, TRANSLATE_MOCK_REPLY, TRANSLATE_SCHEMA, TRANSLATE_SYSTEM_PROMPT, TRANSLATE_TIMEOUT_MS } from "@/lib/translate/prompt";
import { buildTranslateMessage } from "@/lib/translate/request";
import { parseAndValidateDraft } from "@/lib/translate/validateOutput";

const NO_STORE = { "Cache-Control": "no-store" };
const respond = (body, status) => Response.json(body, { status, headers: NO_STORE });

export async function POST(request, { params }) {
  if (!isSameOrigin(request.headers)) return respond({ error: "Request not allowed." }, 403);
  const { denied } = await requireAdminApi();
  if (denied) return denied;

  const { id } = await params;
  if (!isValidListingId(id)) return respond({ error: "Listing not found." }, 404);

  let listing;
  try {
    listing = await prisma.opportunity.findUnique({
      where: { id },
      select: { title: true, summary: true, description: true, requirements: true, originalLang: true, status: true },
    });
  } catch (error) {
    console.error("Translate draft could not load the listing:", error?.name, error?.code);
    return respond({ error: "Something went wrong." }, 500);
  }
  if (!listing || listing.status === "archived") return respond({ error: "Listing not found." }, 404);

  const from = listing.originalLang === "es" ? "es" : "en";
  const to = from === "es" ? "en" : "es";
  const source = { title: listing.title, summary: listing.summary, description: listing.description, requirements: listing.requirements };

  try {
    const result = await runAi({
      route: "translate",
      key: visitorKey(request, "translate"),
      env: process.env,
      burst,
      incrementDaily: incrementDailyUsage,
      request: {
        systemPrompt: TRANSLATE_SYSTEM_PROMPT,
        userMessage: buildTranslateMessage({ listing: source, from, to }),
        schema: TRANSLATE_SCHEMA,
        maxOutputTokens: TRANSLATE_MAX_OUTPUT_TOKENS,
        timeoutMs: TRANSLATE_TIMEOUT_MS,
      },
      validate: (text) => parseAndValidateDraft(text, source),
      mockReply: TRANSLATE_MOCK_REPLY,
    });
    return respond(result.status === 200 ? { ...result.body, from, to } : result.body, result.status);
  } catch (error) {
    console.error("POST /api/admin/listings/[id]/translate-draft failed:", error?.name, error?.code);
    return respond({ error: "Something went wrong." }, 500);
  }
}
