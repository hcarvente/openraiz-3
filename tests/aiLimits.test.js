import test from "node:test";
import assert from "node:assert/strict";
import { AI_ROUTES, BURST, checkAiLimits, createBurstLimiter, dailyCapFor, isAiEnabled } from "../lib/ai/limits.js";

test("AI is on unless it is switched off", () => {
  assert.equal(isAiEnabled({}), true);
  assert.equal(isAiEnabled({ AI_ENABLED: "true" }), true);
  assert.equal(isAiEnabled({ AI_ENABLED: "" }), true);
  for (const off of ["false", "FALSE", " False ", "false\n"]) assert.equal(isAiEnabled({ AI_ENABLED: off }), false, JSON.stringify(off));
  assert.equal(isAiEnabled({ AI_ENABLED: "0" }), true); // only the word "false" turns it off
});

test("daily caps have defaults and can be overridden with a whole number", () => {
  assert.deepEqual(AI_ROUTES, ["job_fit", "interview", "translate"]);
  assert.equal(dailyCapFor("job_fit", {}), 300);
  assert.equal(dailyCapFor("interview", {}), 200);
  assert.equal(dailyCapFor("translate", {}), 100);
  assert.equal(dailyCapFor("job_fit", { AI_CAP_JOB_FIT: "50" }), 50);
  assert.equal(dailyCapFor("job_fit", { AI_CAP_JOB_FIT: "0" }), 0); // zero switches one feature off
  for (const bad of ["abc", "-5", "1.5", "", "1000000", " "]) assert.equal(dailyCapFor("job_fit", { AI_CAP_JOB_FIT: bad }), 300, JSON.stringify(bad));
  assert.equal(dailyCapFor("nonsense", {}), 0);
});

test("the burst limiter allows a few calls a minute per visitor and forgets old ones", () => {
  let time = 0;
  const limiter = createBurstLimiter({ max: 3, windowMs: 1000, now: () => time });
  assert.deepEqual([limiter.allow("a"), limiter.allow("a"), limiter.allow("a"), limiter.allow("a")], [true, true, true, false]);
  assert.equal(limiter.allow("b"), true); // another visitor is not affected
  time = 999;
  assert.equal(limiter.allow("a"), false);
  time = 1001;
  assert.equal(limiter.allow("a"), true); // the first hits are older than the window now
  assert.deepEqual(BURST, { max: 5, windowMs: 60000 });
});

const burstFor = () => createBurstLimiter({ max: 2, windowMs: 60_000, now: () => 0 });
const counter = (start = 0) => { let n = start; const calls = []; return { calls, incrementDaily: async (route) => { calls.push(route); n += 1; return n; } }; };

test("the checks come in order: unknown feature, kill switch, speed, then the daily total", async () => {
  const c = counter();
  assert.deepEqual(await checkAiLimits({ route: "nope", key: "k", env: {}, burst: burstFor(), ...c }), { allowed: false, status: 404, error: "unknownRoute" });
  assert.deepEqual(await checkAiLimits({ route: "job_fit", key: "k", env: { AI_ENABLED: "false" }, burst: burstFor(), ...c }), { allowed: false, status: 503, error: "aiDisabled" });
  assert.equal(c.calls.length, 0); // nothing was counted for a refused request
  assert.deepEqual(await checkAiLimits({ route: "job_fit", key: "k", env: {}, burst: burstFor(), ...c }), { allowed: true });
  assert.deepEqual(c.calls, ["job_fit"]);
});

test("a visitor going too fast is refused before anything is counted", async () => {
  const burst = burstFor();
  const c = counter();
  await checkAiLimits({ route: "interview", key: "k", env: {}, burst, ...c });
  await checkAiLimits({ route: "interview", key: "k", env: {}, burst, ...c });
  assert.deepEqual(await checkAiLimits({ route: "interview", key: "k", env: {}, burst, ...c }), { allowed: false, status: 429, error: "tooFast" });
  assert.equal(c.calls.length, 2);
});

test("the daily total stops the call number cap+1, and counting happens before the call", async () => {
  const env = { AI_CAP_TRANSLATE: "2" };
  const c = counter();
  const results = [];
  for (let i = 0; i < 3; i += 1) results.push(await checkAiLimits({ route: "translate", key: `k${i}`, env, burst: burstFor(), ...c }));
  assert.deepEqual(results.map((r) => r.allowed), [true, true, false]);
  assert.deepEqual(results[2], { allowed: false, status: 429, error: "dailyLimit" });
  const zero = await checkAiLimits({ route: "translate", key: "z", env: { AI_CAP_TRANSLATE: "0" }, burst: burstFor(), ...counter() });
  assert.equal(zero.allowed, false); // a cap of zero switches the feature off
});
