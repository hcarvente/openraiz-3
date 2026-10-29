// One shared speed limiter for all AI routes (a few calls a minute per visitor, in memory), and how a visitor is identified.
// Server-only. The visitor key is their network address as the host reports it; it is used only to count calls in memory and
// is never stored or logged.
import { createBurstLimiter } from "./limits.js";

export const burst = createBurstLimiter();

export function visitorKey(request, route) {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const address = (forwarded || request.headers.get("x-real-ip") || "unknown").slice(0, 64);
  return `${route}:${address}`;
}
