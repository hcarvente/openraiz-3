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
import { getDictionary } from "@/lib/i18n/dictionaries";
import { safeNextPath } from "@/lib/safeRedirect";

const text = (formData, name) => (typeof formData.get(name) === "string" ? formData.get(name) : "");
// The forms send their language in a hidden field; anything else means English.
const langOf = (formData) => (isLocale(text(formData, "lang")) ? text(formData, "lang") : DEFAULT_LOCALE);
// The messages in the visitor's language (see lib/i18n/dictionaries, auth.errors).
const messagesFor = (lang) => getDictionary(lang).auth.errors;
// Turns the validators' message keys ({ email: "emailInvalid" }) into text.
const translateErrors = (errors, messages) => Object.fromEntries(Object.entries(errors).map(([field, key]) => [field, messages[key] ?? key]));

export async function signUpAction(_previous, formData) {
  const lang = langOf(formData);
  const messages = messagesFor(lang);
  const raw = {
    name: text(formData, "name"),
    email: text(formData, "email"),
    password: text(formData, "password"),
    role: text(formData, "role"),
    orgName: text(formData, "orgName"),
  };
  const values = { name: raw.name, email: raw.email, role: raw.role, orgName: raw.orgName }; // never the password

  const result = validateSignUp(raw);
  if (!result.ok) return { errors: translateErrors(result.errors, messages), values };
  const { name, email, password, role, orgName } = result.values;

  let userId;
  try {
    const { data, error } = await auth.signUp.email({ name, email, password });
    if (error || !data?.user?.id) {
      return { message: messages.createFailed, values };
    }
    userId = data.user.id;
  } catch (error) {
    console.error("Sign-up failed:", error?.name, error?.code);
    return { message: messages.unavailable, values };
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
  const messages = messagesFor(lang);
  const email = text(formData, "email").trim().toLowerCase();
  const otp = text(formData, "otp").trim();
  if (!email || !/^[A-Za-z0-9]{4,12}$/.test(otp)) {
    return { message: messages.enterEmailCode, values: { email } };
  }

  try {
    const { error } = await auth.emailOtp.verifyEmail({ email, otp });
    if (error) return { message: messages.codeWrong, values: { email } };
  } catch (error) {
    console.error("Verification failed:", error?.name, error?.code);
    return { message: messages.unavailable, values: { email } };
  }
  redirect(`${localePath(lang, "/auth/sign-in")}?verified=1`);
}

export async function resendCodeAction(_previous, formData) {
  const messages = messagesFor(langOf(formData));
  const email = text(formData, "email").trim().toLowerCase();
  if (!email) return { message: messages.enterEmail, values: { email } };
  try {
    await auth.emailOtp.sendVerificationOtp({ email });
  } catch (error) {
    console.error("Resending the code failed:", error?.name, error?.code);
  }
  // The same answer whether or not the address has an account.
  return { notice: messages.resent, values: { email } };
}

export async function signInAction(_previous, formData) {
  const lang = langOf(formData);
  const messages = messagesFor(lang);
  const email = text(formData, "email").trim().toLowerCase();
  const password = text(formData, "password");
  const next = safeNextPath(text(formData, "next"), localePath(lang, "/account"));
  if (!email || !password) return { message: messages.enterEmailPassword, values: { email } };

  let error;
  try {
    ({ error } = await auth.signIn.email({ email, password }));
  } catch (caught) {
    console.error("Sign-in failed:", caught?.name, caught?.code);
    return { message: messages.unavailable, values: { email } };
  }

  if (error) {
    if (error.code === "EMAIL_NOT_VERIFIED") redirect(`${localePath(lang, "/auth/verify")}?email=${encodeURIComponent(email)}`);
    return { message: messages.badCredentials, values: { email } };
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
  const messages = messagesFor(lang);
  const values = { role: text(formData, "role"), orgName: text(formData, "orgName") };
  const current = await getCurrentUser();
  if (!current) redirect(`${localePath(lang, "/auth/sign-in")}?next=${encodeURIComponent(localePath(lang, "/account"))}`);
  if (current.profile) redirect(localePath(lang, "/account"));

  const choice = validateProfileChoice(values);
  if (Object.keys(choice.errors).length > 0) return { errors: translateErrors(choice.errors, messages), values };

  try {
    await prisma.profile.create({
      data: { userId: current.user.id, role: choice.role, displayName: current.user.name || current.user.email, orgName: choice.orgName },
    });
  } catch (error) {
    console.error("Profile was not saved:", error?.name, error?.code);
    return { message: messages.profileSaveFailed, values };
  }
  redirect(localePath(lang, "/account"));
}
