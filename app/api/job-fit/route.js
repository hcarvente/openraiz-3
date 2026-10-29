// POST /api/job-fit: "How does my experience fit this listing?" The browser sends only { opportunityId, text, lang }. The
// SERVER loads the public listing itself, builds the message, checks the limits (kill switch, speed, daily total), makes ONE
// AI call, and checks the answer before returning it. Nothing the visitor typed is stored, and logs hold token counts only.
// No sign-in is required. See lib/jobFit/ and lib/ai/ for the rules.
import { prisma } from "@/lib/prisma";
import { isSameOrigin } from "@/lib/sameOrigin";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { translatedView } from "@/lib/translation";
import { PUBLIC_WHERE } from "@/lib/opportunityVisibility";
import { runAi } from "@/lib/ai/runAi";
import { incrementDailyUsage } from "@/lib/ai/usage";
import { burst, visitorKey } from "@/lib/ai/visitor";
import { JOB_FIT_MAX_OUTPUT_TOKENS, JOB_FIT_MOCK_REPLY, JOB_FIT_SCHEMA, JOB_FIT_SYSTEM_PROMPT, JOB_FIT_TIMEOUT_MS } from "@/lib/jobFit/prompt";
import { buildJobFitMessage, validateJobFitRequest } from "@/lib/jobFit/request";
import { parseAndValidateJobFit } from "@/lib/jobFit/validateOutput";

const NO_STORE = { "Cache-Control": "no-store" };
const respond = (body, status) => Response.json(body, { status, headers: NO_STORE });

export async function POST(request) {
  if (!isSameOrigin(request.headers)) return respond({ error: "forbiddenOrigin" }, 403);

  let body;
  try {
    body = await request.json();
  } catch {
    return respond({ error: "invalid", details: [{ field: "body", code: "invalid" }] }, 400);
  }
  const checked = validateJobFitRequest(body);
  if (!checked.ok) return respond({ error: "invalid", details: checked.errors }, 400);
  const { opportunityId, text, lang } = checked.data;

  // Only a public listing can be used. The listing text comes from our database, never from the browser.
  let listing;
  try {
    listing = await prisma.opportunity.findFirst({ where: { id: opportunityId, ...PUBLIC_WHERE } });
  } catch (error) {
    console.error("Job-Fit could not load the listing:", error?.name, error?.code);
    return respond({ error: "server" }, 500);
  }
  if (!listing) return respond({ error: "notFound" }, 404);

  const view = translatedView(listing, lang).text; // the listing's words in the visitor's language when a translation exists
  const message = buildJobFitMessage({
    listing: { ...listing, ...view },
    text,
    lang,
    typeLabel: getDictionary("en").card.types[listing.type] ?? listing.type,
  });

  try {
    const result = await runAi({
      route: "job_fit",
      key: visitorKey(request, "job_fit"),
      env: process.env,
      burst,
      incrementDaily: incrementDailyUsage,
      request: {
        systemPrompt: JOB_FIT_SYSTEM_PROMPT,
        userMessage: message,
        schema: JOB_FIT_SCHEMA,
        maxOutputTokens: JOB_FIT_MAX_OUTPUT_TOKENS,
        timeoutMs: JOB_FIT_TIMEOUT_MS,
      },
      validate: parseAndValidateJobFit,
      mockReply: JOB_FIT_MOCK_REPLY,
    });
    return respond(result.body, result.status);
  } catch (error) {
    console.error("POST /api/job-fit failed:", error?.name, error?.code);
    return respond({ error: "server" }, 500);
  }
}
