// Turns any AI or network failure into a short code the page can show as a friendly message in the visitor's language.
// Visitors never see raw provider errors (they are confusing and can leak details). It recognizes errors by their `status`
// number and `name`, not by importing the SDK's classes, so tests can use plain fake errors. Plain JavaScript, no imports.
const DEFAULT_RETRY_SECONDS = 30;
const MIN_RETRY_SECONDS = 5;
const MAX_RETRY_SECONDS = 120;

// The provider's "Retry-After" header (seconds), kept in a sensible range so a strange value cannot lock a button for long.
function retryAfterSeconds(error) {
  const seconds = Number(error?.headers?.get?.("retry-after"));
  const value = Number.isFinite(seconds) && seconds > 0 ? seconds : DEFAULT_RETRY_SECONDS;
  return Math.min(MAX_RETRY_SECONDS, Math.max(MIN_RETRY_SECONDS, Math.ceil(value)));
}

// Returns { status, code, retryAfterSeconds? } for any thrown value. Codes: INVALID_OUTPUT, RATE_LIMITED, TIMEOUT, NETWORK,
// SERVER_CONFIG, AI_UNAVAILABLE, AI_ERROR.
export function classifyAiError(error) {
  const status = error?.status;
  const name = error?.name;

  if (name === "AiError" && (error.code === "INCOMPLETE" || error.code === "EMPTY")) return { status: 502, code: "INVALID_OUTPUT" };
  if (name === "AiError" && error.code === "CONFIG") return { status: 500, code: "SERVER_CONFIG" };
  if (status === 429) return { status: 429, code: "RATE_LIMITED", retryAfterSeconds: retryAfterSeconds(error) };
  if (name === "APIConnectionTimeoutError" || name === "AbortError" || name === "TimeoutError") return { status: 504, code: "TIMEOUT" };
  if (name === "APIConnectionError" || name === "APIUserAbortError" || (error instanceof TypeError && /fetch|network/i.test(error.message))) {
    return { status: 503, code: "NETWORK" };
  }
  // A bad key, no permission, or a model that no longer exists is OUR setup problem. Details stay in the server logs.
  if (status === 401 || status === 403 || status === 404) return { status: 500, code: "SERVER_CONFIG" };
  if (typeof status === "number" && status >= 500) return { status: 502, code: "AI_UNAVAILABLE" };
  return { status: 502, code: "AI_ERROR" };
}
