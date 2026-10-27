"use server";

// SPIKE (Step 3): throwaway server actions to prove Neon Auth works in this app. Each one redirects back to the
// spike page with a short message. Nothing here is kept for the real sign-in pages.
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth/server";

function back(message) {
  redirect(`/auth-spike?msg=${encodeURIComponent(message)}`);
}

export async function signUp(formData) {
  const { data, error } = await auth.signUp.email({
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
    password: String(formData.get("password") ?? ""),
  });
  if (error) back(`Sign-up failed: ${error.code ?? ""} ${error.message ?? ""}`);
  back(`Sign-up ok. Session started: ${Boolean(data?.token)}. Check your email for a code if verification is on.`);
}

export async function verifyEmail(formData) {
  const { error } = await auth.emailOtp.verifyEmail({
    email: String(formData.get("email") ?? ""),
    otp: String(formData.get("otp") ?? ""),
  });
  if (error) back(`Verify failed: ${error.code ?? ""} ${error.message ?? ""}`);
  back("Email verified.");
}

export async function signIn(formData) {
  const { error } = await auth.signIn.email({
    email: String(formData.get("email") ?? ""),
    password: String(formData.get("password") ?? ""),
  });
  if (error) back(`Sign-in failed: ${error.code ?? ""} ${error.message ?? ""}`);
  back("Signed in.");
}

export async function signOut() {
  await auth.signOut();
  back("Signed out.");
}
