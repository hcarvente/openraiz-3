// POST /api/interview/evaluate: the practice interview. The browser sends only { lang, category OR opportunityId, answers }.
// The SERVER builds the three questions itself (from the category, or from the public listing it loads), checks the limits
// (kill switch, speed, daily total), makes ONE AI call, and checks the feedback before returning it. Nothing is stored and logs
// hold token counts only. No sign-in is required. See lib/interview/ and lib/ai/ for the rules.
import { prisma } from "@/lib/prisma";
import { isSameOrigin } from "@/lib/sameOrigin";
import { translatedView } from "@/lib/translation";
import { PUBLIC_WHERE } from "@/lib/opportunityVisibility";
import { runAi } from "@/lib/ai/runAi";
import { incrementDailyUsage } from "@/lib/ai/usage";
import { burst, visitorKey } from "@/lib/ai/visitor";
import { buildQuestions } from "@/lib/interview/questions";
import { INTERVIEW_MAX_OUTPUT_TOKENS, INTERVIEW_MOCK_REPLY, INTERVIEW_SCHEMA, INTERVIEW_SYSTEM_PROMPT, INTERVIEW_TIMEOUT_MS } from "@/lib/interview/prompt";
import { buildInterviewMessage, validateInterviewRequest } from "@/lib/interview/request";
import { parseAndValidateFeedback } from "@/lib/interview/validateOutput";

// The AI can take a while (a Spanish answer once took 28 s). Vercel stops a function at this many seconds.
export const maxDuration = 60;

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
  const checked = validateInterviewRequest(body);
  if (!checked.ok) return respond({ error: "invalid", details: checked.errors }, 400);
  const { lang, categoryId, opportunityId, answers } = checked.data;

  // "Practice for this role": only a public listing can be used, and its text comes from our database, never from the browser.
  let listing = null;
  if (opportunityId) {
    try {
      const row = await prisma.opportunity.findFirst({ where: { id: opportunityId, ...PUBLIC_WHERE } });
      if (row) listing = { ...row, ...translatedView(row, lang).text };
    } catch (error) {
      console.error("Interview could not load the listing:", error?.name, error?.code);
      return respond({ error: "server" }, 500);
    }
    if (!listing) return respond({ error: "notFound" }, 404);
  }

  const questions = buildQuestions({ lang, categoryId, listing });
  const message = buildInterviewMessage({ lang, questions, answers, listing });

  try {
    const result = await runAi({
      route: "interview",
      key: visitorKey(request, "interview"),
      env: process.env,
      burst,
      incrementDaily: incrementDailyUsage,
      request: {
        systemPrompt: INTERVIEW_SYSTEM_PROMPT,
        userMessage: message,
        schema: INTERVIEW_SCHEMA,
        maxOutputTokens: INTERVIEW_MAX_OUTPUT_TOKENS,
        timeoutMs: INTERVIEW_TIMEOUT_MS,
      },
      validate: parseAndValidateFeedback,
      mockReply: INTERVIEW_MOCK_REPLY,
    });
    return respond(result.body, result.status);
  } catch (error) {
    console.error("POST /api/interview/evaluate failed:", error?.name, error?.code);
    return respond({ error: "server" }, 500);
  }
}
