// DEVELOPMENT AND DEMO ONLY: fake AI behaviors, so features and failures can be tried by hand without spending anything.
// Turn one on with a line in .env such as AI_MODE=ok (or rate-limit, timeout, ...) and restart. It is IGNORED when
// NODE_ENV is "production" (see lib/ai/runAi.js), so a live site can never serve fake answers by mistake.
export const MOCK_MODES = [
  "ok", //           a good reply, instantly (also a safe fallback for a demo)
  "slow", //         a good reply after 4 seconds
  "rate-limit", //   HTTP 429
  "timeout", //      the AI took too long
  "network", //      the AI service could not be reached
  "server-error", // HTTP 500 from the AI service
  "auth", //         HTTP 403 (bad key)
  "bad-json", //     the reply is not JSON
  "bad-output", //   JSON, but not what was asked for
  "empty", //        the reply has no text
];

const USAGE = { inputTokens: 0, outputTokens: 0, thoughtTokens: 0 };

function sdkError(name, status, headers) {
  const error = new Error("simulated");
  error.name = name;
  error.status = status;
  error.headers = headers;
  return error;
}

export function isMockMode(mode) {
  return MOCK_MODES.includes(mode);
}

// Returns a function that behaves like callAi(): it resolves with { text, model, usage } or throws an SDK-shaped error.
// `goodReply` is the feature's own sample answer (an object).
export function createMockCall(mode, goodReply) {
  return async function mockCall() {
    const reply = (text) => ({ text, model: "mock", usage: USAGE });
    switch (mode) {
      case "ok":
        return reply(JSON.stringify(goodReply));
      case "slow":
        await new Promise((resolve) => setTimeout(resolve, 4000));
        return reply(JSON.stringify(goodReply));
      case "rate-limit":
        throw sdkError("RateLimitError", 429, new Headers({ "retry-after": "20" }));
      case "timeout":
        throw sdkError("APIConnectionTimeoutError", undefined);
      case "network":
        throw sdkError("APIConnectionError", undefined);
      case "server-error":
        throw sdkError("InternalServerError", 500);
      case "auth":
        throw sdkError("PermissionDeniedError", 403);
      case "bad-json":
        return reply("Sorry, here is your answer: {oops");
      case "bad-output":
        return reply(JSON.stringify({ unexpected: true }));
      case "empty":
        return reply("");
      default:
        throw new Error(`Unknown mock mode: ${mode}`);
    }
  };
}
