// The safety limits around every AI feature (Job-Fit, the interview coach, "Translate with AI"). Plain JavaScript with
// relative imports only, so `npm test` can run it. Three layers, checked in this order before any AI call is made:
//   1. a kill switch: AI_ENABLED=false turns every AI feature off at once;
//   2. a quick per-visitor limit (a few calls a minute), kept in memory, so it is only a best-effort speed bump: on a
//      server that runs in several copies each copy has its own counter;
//   3. a daily total per feature, counted in the database (table AiUsage), so a runaway cost cannot happen even if the
//      second layer is bypassed. The count is added BEFORE the call, in one step, so two visitors cannot both slip past.
export const AI_ROUTES = ["job_fit", "interview", "translate"];

// How many AI calls each feature may make per day, for everyone together. Override one with AI_CAP_JOB_FIT,
// AI_CAP_INTERVIEW or AI_CAP_TRANSLATE (a whole number); anything else uses the default.
const DEFAULT_DAILY_CAPS = { job_fit: 300, interview: 200, translate: 100 };

// Quick limit per visitor: this many calls in this many milliseconds.
export const BURST = { max: 5, windowMs: 60_000 };

// On unless AI_ENABLED is exactly "false" (any case, spaces ignored).
export function isAiEnabled(env = {}) {
  return String(env.AI_ENABLED ?? "true").trim().toLowerCase() !== "false";
}

export function dailyCapFor(route, env = {}) {
  const fallback = DEFAULT_DAILY_CAPS[route];
  if (fallback === undefined) return 0; // an unknown feature gets nothing
  const raw = String(env[`AI_CAP_${route.toUpperCase()}`] ?? "").trim();
  // Only a plain whole number counts ("50", "0"); blanks, signs, decimals and words fall back to the default.
  if (!/^\d{1,6}$/.test(raw)) return fallback;
  const value = Number(raw);
  return value <= 100_000 ? value : fallback;
}

// A limiter that allows `max` hits per `windowMs` for each key (for example a visitor's address). It forgets old hits
// as time passes and never grows without bound: keys with no recent hits are dropped.
export function createBurstLimiter({ max = BURST.max, windowMs = BURST.windowMs, now = Date.now } = {}) {
  const hits = new Map();
  return {
    allow(key) {
      const time = now();
      const recent = (hits.get(key) ?? []).filter((t) => time - t < windowMs);
      if (recent.length >= max) {
        hits.set(key, recent);
        return false;
      }
      recent.push(time);
      hits.set(key, recent);
      if (hits.size > 5000) {
        for (const [k, list] of hits) if (list.every((t) => time - t >= windowMs)) hits.delete(k);
      }
      return true;
    },
  };
}

// The decision. `incrementDaily(route)` adds one to today's count for that feature and returns the NEW count.
// Returns { allowed: true } or { allowed: false, status, error } with a short code the page can turn into a message.
export async function checkAiLimits({ route, key, env, burst, incrementDaily }) {
  if (!AI_ROUTES.includes(route)) return { allowed: false, status: 404, error: "unknownRoute" };
  if (!isAiEnabled(env)) return { allowed: false, status: 503, error: "aiDisabled" };
  if (!burst.allow(key)) return { allowed: false, status: 429, error: "tooFast" };
  const count = await incrementDaily(route);
  if (count > dailyCapFor(route, env)) return { allowed: false, status: 429, error: "dailyLimit" };
  return { allowed: true };
}
