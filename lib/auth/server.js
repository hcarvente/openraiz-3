// Server-side Neon Auth (managed Better Auth). Server-only: it reads the cookie secret, so never import this file
// from a Client Component. NEON_AUTH_BASE_URL and NEON_AUTH_COOKIE_SECRET come from the environment (.env locally).
import { createNeonAuth } from "@neondatabase/auth/next/server";

export const auth = createNeonAuth({
  baseUrl: process.env.NEON_AUTH_BASE_URL,
  cookies: { secret: process.env.NEON_AUTH_COOKIE_SECRET },
});
