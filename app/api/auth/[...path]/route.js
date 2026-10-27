// Passes every /api/auth/* request (sign-in, sign-up, session, sign-out) through to Neon Auth.
import { auth } from "@/lib/auth/server";

export const { GET, POST } = auth.handler();
