// Runs ONE AI request with every safety layer in place, and returns { status, body } for the route to send:
//   1. the limits (kill switch, speed, daily total: lib/ai/limits.js), checked BEFORE anything is sent to the provider;
//   2. the call itself (or a mock when AI_MODE is set outside production);
//   3. any failure turned into a short code (lib/ai/aiErrors.js);
//   4. the answer checked by the feature's own `validate` (the AI's reply is untrusted, like a visitor's text);
//   5. a log line with token counts only: never the visitor's text and never the AI's answer.
// The route supplies the limits' dependencies and the feature supplies the request, the validator and a sample reply.
// Plain JavaScript with relative imports only, so `npm test` can run it with a fake client.
import { callAi } from "./aiClient.js";
import { classifyAiError } from "./aiErrors.js";
import { checkAiLimits } from "./limits.js";
import { createMockCall, isMockMode } from "./mockAi.js";

export async function runAi({ route, key, env, burst, incrementDaily, request, validate, mockReply, client, log = console }) {
  const limits = await checkAiLimits({ route, key, env, burst, incrementDaily });
  if (!limits.allowed) return { status: limits.status, body: { error: limits.error } };

  // Mock modes exist for testing and demos only; they are ignored on a live (production) site.
  const mode = env.NODE_ENV === "production" ? undefined : env.AI_MODE;
  const call = isMockMode(mode) ? createMockCall(mode, mockReply) : (req) => callAi(req, client);

  let result;
  try {
    result = await call(request);
  } catch (error) {
    const outcome = classifyAiError(error);
    log.error(`AI call failed (${route}):`, outcome.code, error?.name, error?.status ?? "");
    return { status: outcome.status, body: { error: outcome.code, ...(outcome.retryAfterSeconds ? { retryAfterSeconds: outcome.retryAfterSeconds } : {}) } };
  }

  const checked = validate(result.text);
  if (!checked.ok) {
    log.error(`AI answer rejected (${route}):`, checked.reason ?? "invalid"); // the reason, never the text
    return { status: 502, body: { error: "INVALID_OUTPUT" } };
  }

  const { inputTokens, outputTokens, thoughtTokens } = result.usage ?? {};
  log.info(`AI call ok (${route}): model=${result.model} in=${inputTokens} out=${outputTokens} thought=${thoughtTokens}`);
  return { status: 200, body: { result: checked.value } };
}
