import test from "node:test";
import assert from "node:assert/strict";
import { callAi, AiError } from "../lib/ai/aiClient.js";
import { classifyAiError } from "../lib/ai/aiErrors.js";
import { MOCK_MODES, createMockCall, isMockMode } from "../lib/ai/mockAi.js";
import { runAi } from "../lib/ai/runAi.js";
import { createBurstLimiter } from "../lib/ai/limits.js";

const request = { systemPrompt: "rules", userMessage: "SECRET VISITOR TEXT", schema: { type: "object" }, maxOutputTokens: 123, timeoutMs: 456 };
const good = { hello: "world" };
const validate = (text) => {
  try {
    const value = JSON.parse(text);
    return value && typeof value.hello === "string" ? { ok: true, value } : { ok: false, reason: "no hello" };
  } catch {
    return { ok: false, reason: "not json" };
  }
};
const fakeClient = (interaction, seen = []) => ({ interactions: { create: async (body, options) => { seen.push({ body, options }); return interaction; } } });
const done = (text) => ({ status: "completed", output_text: text, usage: { total_input_tokens: 11, total_output_tokens: 7, total_thought_tokens: 3 } });
const logger = () => { const lines = []; return { lines, info: (...a) => lines.push(a.join(" ")), error: (...a) => lines.push(a.join(" ")) }; };
const base = (extra = {}) => ({ route: "job_fit", key: "visitor", env: {}, burst: createBurstLimiter({ max: 5, windowMs: 60000, now: () => 0 }), incrementDaily: async () => 1, request, validate, mockReply: good, ...extra });

test("callAi sends the rules apart from the data, caps the answer, never retries, and reports tokens", async () => {
  const seen = [];
  const out = await callAi(request, fakeClient(done('{"hello":"w"}'), seen));
  assert.equal(seen[0].body.system_instruction, "rules");
  assert.equal(seen[0].body.input, "SECRET VISITOR TEXT");
  assert.equal(seen[0].body.generation_config.max_output_tokens, 123);
  assert.deepEqual(seen[0].options, { maxRetries: 0, timeout: 456 });
  assert.equal(seen[0].body.response_format.mime_type, "application/json");
  assert.deepEqual(out.usage, { inputTokens: 11, outputTokens: 7, thoughtTokens: 3 });
});

test("an unfinished or empty answer is refused", async () => {
  await assert.rejects(callAi(request, fakeClient({ status: "incomplete", output_text: "{" })), (e) => e instanceof AiError && e.code === "INCOMPLETE");
  await assert.rejects(callAi(request, fakeClient({ status: "completed", output_text: "  " })), (e) => e.code === "EMPTY");
  await assert.rejects(callAi(request, fakeClient({ status: "completed" })), (e) => e.code === "EMPTY");
});

test("every kind of failure becomes a short code, and a rate limit tells how long to wait", () => {
  const err = (name, status, headers) => Object.assign(new Error("x"), { name, status, headers });
  assert.equal(classifyAiError(new AiError("EMPTY", "x")).code, "INVALID_OUTPUT");
  assert.equal(classifyAiError(new AiError("CONFIG", "x")).code, "SERVER_CONFIG");
  assert.deepEqual(classifyAiError(err("RateLimitError", 429, new Headers({ "retry-after": "20" }))), { status: 429, code: "RATE_LIMITED", retryAfterSeconds: 20 });
  assert.equal(classifyAiError(err("RateLimitError", 429, new Headers({ "retry-after": "99999" }))).retryAfterSeconds, 120);
  assert.equal(classifyAiError(err("RateLimitError", 429)).retryAfterSeconds, 30);
  assert.equal(classifyAiError(err("APIConnectionTimeoutError")).code, "TIMEOUT");
  assert.equal(classifyAiError(err("APIConnectionError")).code, "NETWORK");
  assert.equal(classifyAiError(new TypeError("fetch failed")).code, "NETWORK");
  for (const status of [401, 403, 404]) assert.equal(classifyAiError(err("X", status)).code, "SERVER_CONFIG");
  assert.equal(classifyAiError(err("X", 500)).code, "AI_UNAVAILABLE");
  assert.equal(classifyAiError(err("X", 418)).code, "AI_ERROR");
  assert.equal(classifyAiError(undefined).code, "AI_ERROR");
});

test("a good answer comes back checked, and the log holds token counts but never the visitor's text or the answer", async () => {
  const log = logger();
  const result = await runAi(base({ client: fakeClient(done('{"hello":"world"}')), log }));
  assert.deepEqual(result, { status: 200, body: { result: { hello: "world" } } });
  const all = log.lines.join("\n");
  assert.match(all, /in=11 out=7 thought=3/);
  assert.equal(all.includes("SECRET VISITOR TEXT"), false);
  assert.equal(all.includes("world"), false);
});

test("an answer that is not what was asked for is rejected, and only the reason is logged", async () => {
  for (const text of ["not json at all", '{"other":1}', "{oops"]) {
    const log = logger();
    const result = await runAi(base({ client: fakeClient(done(text)), log }));
    assert.deepEqual(result, { status: 502, body: { error: "INVALID_OUTPUT" } }, text);
    assert.equal(log.lines.join("").includes("not json at all"), false);
  }
});

test("a failing provider gives a code, not its raw message", async () => {
  const boom = { interactions: { create: async () => { throw Object.assign(new Error("secret provider detail with key AIzaSECRET"), { name: "InternalServerError", status: 500 }); } } };
  const log = logger();
  const result = await runAi(base({ client: boom, log }));
  assert.deepEqual(result, { status: 502, body: { error: "AI_UNAVAILABLE" } });
  assert.equal(JSON.stringify(result).includes("AIzaSECRET"), false);
  assert.equal(log.lines.join("").includes("AIzaSECRET"), false);
});

test("the limits run first: with the kill switch on, the provider is never called", async () => {
  let called = false;
  const client = { interactions: { create: async () => { called = true; return done('{"hello":"w"}'); } } };
  assert.deepEqual(await runAi(base({ client, env: { AI_ENABLED: "false" } })), { status: 503, body: { error: "aiDisabled" } });
  assert.deepEqual(await runAi(base({ client, incrementDaily: async () => 9999 })), { status: 429, body: { error: "dailyLimit" } });
  assert.equal(called, false);
});

test("mock modes work outside production and are ignored in production", async () => {
  assert.equal(isMockMode("ok"), true);
  assert.equal(isMockMode("nonsense"), false);
  assert.equal(MOCK_MODES.length, 10);
  assert.deepEqual(await runAi(base({ env: { AI_MODE: "ok" } })), { status: 200, body: { result: { hello: "world" } } });
  assert.equal((await runAi(base({ env: { AI_MODE: "rate-limit" }, log: logger() }))).status, 429);
  assert.equal((await runAi(base({ env: { AI_MODE: "timeout" }, log: logger() }))).body.error, "TIMEOUT");
  assert.equal((await runAi(base({ env: { AI_MODE: "bad-json" }, log: logger() }))).body.error, "INVALID_OUTPUT");
  assert.equal((await runAi(base({ env: { AI_MODE: "empty" }, log: logger() }))).status, 502);
  // In production the mock is ignored, so the real client is used (here a fake one that answers differently).
  const real = fakeClient(done('{"hello":"REAL"}'));
  const live = await runAi(base({ env: { AI_MODE: "ok", NODE_ENV: "production" }, client: real }));
  assert.deepEqual(live.body.result, { hello: "REAL" });
  assert.equal(typeof createMockCall("ok", good), "function");
});
