"use server";

// The server side of the sign-up, verify, sign-in, sign-out and finish-profile forms. Every value is checked here
// again, because the browser's checks can be skipped. Messages shown to the visitor are deliberately plain and never
// say whether an email address already has an account.
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/roles";
import { validateProfileChoice, validateSignUp } from "@/lib/rolesCore";
import { DEFAULT_LOCALE, isLocale, localePath } from "@/lib/i18n/config";
import { safeNextPath } from "@/lib/safeRedirect";

const text = (formData, name) => (typeof formData.get(name) === "string" ? formData.get(name) : "");
// The forms send their language in a hidden field; anything else means English.
const langOf = (formData) => (isLocale(text(formData, "lang")) ? text(formData, "lang") : DEFAULT_LOCALE);
const UNAVAILABLE = "Sign-in is unavailable right now. Please try again in a moment.";

export async function signUpAction(_previous, formData) {
  const lang = langOf(formData);
  const raw = {
    name: text(formData, "name"),
    email: text(formData, "email"),
    password: text(formData, "password"),
    role: text(formData, "role"),
    orgName: text(formData, "orgName"),
  };
  const values = { name: raw.name, email: raw.email, role: raw.role, orgName: raw.orgName }; // never the password

  const result = validateSignUp(raw);
  if (!result.ok) return { errors: result.errors, values };
  const { name, email, password, role, orgName } = result.values;

  let userId;
  try {
    const { data, error } = await auth.signUp.email({ name, email, password });
    if (error || !data?.user?.id) {
      return { message: "We couldn't create the account. If you already have one, sign in instead.", values };
    }
    userId = data.user.id;
  } catch (error) {
    console.error("Sign-up failed:", error?.name, error?.code);
    return { message: UNAVAILABLE, values };
  }

  // The account exists now. If saving the profile fails, the person can finish it on /account after signing in.
  try {
    await prisma.profile.create({ data: { userId, role, displayName: name, orgName } });
  } catch (error) {
    console.error("Profile was not saved after sign-up:", error?.name, error?.code);
  }

  redirect(`${localePath(lang, "/auth/verify")}?email=${encodeURIComponent(email)}`);
}

export async function verifyAction(_previous, formData) {
  const lang = langOf(formData);
  const email = text(formData, "email").trim().toLowerCase();
  const otp = text(formData, "otp").trim();
  if (!email || !/^[A-Za-z0-9]{4,12}$/.test(otp)) {
    return { message: "Enter the email address and the code from your email.", values: { email } };
  }

  try {
    const { error } = await auth.emailOtp.verifyEmail({ email, otp });
    if (error) return { message: "That code is wrong or has expired. Ask for a new one.", values: { email } };
  } catch (error) {
    console.error("Verification failed:", error?.name, error?.code);
    return { message: UNAVAILABLE, values: { email } };
  }
  redirect(`${localePath(lang, "/auth/sign-in")}?verified=1`);
}

export async function resendCodeAction(_previous, formData) {
  const email = text(formData, "email").trim().toLowerCase();
  if (!email) return { message: "Enter your email address first.", values: { email } };
  try {
    await auth.emailOtp.sendVerificationOtp({ email });
  } catch (error) {
    console.error("Resending the code failed:", error?.name, error?.code);
  }
  // The same answer whether or not the address has an account.
  return { notice: "If that address has an account, a new code is on its way.", values: { email } };
}

export async function signInAction(_previous, formData) {
  const lang = langOf(formData);
  const email = text(formData, "email").trim().toLowerCase();
  const password = text(formData, "password");
  const next = safeNextPath(text(formData, "next"), localePath(lang, "/account"));
  if (!email || !password) return { message: "Enter your email and password.", values: { email } };

  let error;
  try {
    ({ error } = await auth.signIn.email({ email, password }));
  } catch (caught) {
    console.error("Sign-in failed:", caught?.name, caught?.code);
    return { message: UNAVAILABLE, values: { email } };
  }

  if (error) {
    if (error.code === "EMAIL_NOT_VERIFIED") redirect(`${localePath(lang, "/auth/verify")}?email=${encodeURIComponent(email)}`);
    return { message: "The email or password is not right.", values: { email } };
  }
  redirect(next);
}

export async function signOutAction(formData) {
  const lang = langOf(formData);
  try {
    await auth.signOut();
  } catch (error) {
    console.error("Sign-out failed:", error?.name, error?.code);
  }
  redirect(localePath(lang));
}

// For an account whose profile was never saved (see signUpAction): pick the role now.
export async function completeProfileAction(_previous, formData) {
  const lang = langOf(formData);
  const values = { role: text(formData, "role"), orgName: text(formData, "orgName") };
  const current = await getCurrentUser();
  if (!current) redirect(`${localePath(lang, "/auth/sign-in")}?next=${encodeURIComponent(localePath(lang, "/account"))}`);
  if (current.profile) redirect(localePath(lang, "/account"));

  const choice = validateProfileChoice(values);
  if (Object.keys(choice.errors).length > 0) return { errors: choice.errors, values };

  try {
    await prisma.profile.create({
      data: { userId: current.user.id, role: choice.role, displayName: current.user.name || current.user.email, orgName: choice.orgName },
    });
  } catch (error) {
    console.error("Profile was not saved:", error?.name, error?.code);
    return { message: "We couldn't save your profile. Please try again.", values };
  }
  redirect(localePath(lang, "/account"));
}
