// Pure rules about who a person is and what they may sign up as. No database, no Neon Auth, no Next.js: this file
// uses relative imports only so `npm test` can load it directly with Node.

export const SIGN_UP_ROLES = ["individual", "organization"]; // "admin" is never a sign-up choice

// "A@x.com, b@y.com " -> ["a@x.com", "b@y.com"]. Empty or missing means nobody is an admin.
export function parseAdminEmails(value) {
  return String(value ?? "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

// Admin = a VERIFIED email that is on the ADMIN_EMAILS list. An unverified address never counts, so nobody can become
// admin just by registering your address before verifying it.
export function isAdminEmail(email, emailVerified, adminEmailsValue) {
  if (emailVerified !== true || typeof email !== "string") return false;
  return parseAdminEmails(adminEmailsValue).includes(email.trim().toLowerCase());
}

const EMAIL_SHAPE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// The role and organization name part of the sign-up form, also used when someone finishes a missing profile.
// Returns { errors, role, orgName }; the organization name is kept only for organizations.
export function validateProfileChoice(input) {
  const errors = {};
  const text = (value) => (typeof value === "string" ? value.trim() : "");
  const role = text(input?.role);
  if (!SIGN_UP_ROLES.includes(role)) errors.role = "Choose individual or organization.";
  let orgName = null;
  if (role === "organization") {
    orgName = text(input?.orgName);
    if (orgName.length < 1 || orgName.length > 150) errors.orgName = "Enter your organization's name (up to 150 characters).";
  }
  return { errors, role, orgName };
}

// Checks the sign-up form on the server. Returns { ok: true, values } with cleaned values, or { ok: false, errors }
// where errors maps a field name to a short message. The role can only be one of SIGN_UP_ROLES, and an organization
// name is kept only for organizations.
export function validateSignUp(input) {
  const errors = {};
  const text = (value) => (typeof value === "string" ? value.trim() : "");

  const name = text(input?.name);
  if (name.length < 1 || name.length > 100) errors.name = "Enter your name (up to 100 characters).";

  const email = text(input?.email).toLowerCase();
  if (email.length > 254 || !EMAIL_SHAPE.test(email)) errors.email = "Enter a valid email address.";

  const password = typeof input?.password === "string" ? input.password : "";
  if (password.length < 8 || password.length > 128) errors.password = "Use 8 to 128 characters for the password.";

  const choice = validateProfileChoice(input);
  Object.assign(errors, choice.errors);

  if (Object.keys(errors).length > 0) return { ok: false, errors };
  return { ok: true, values: { name, email, password, role: choice.role, orgName: choice.orgName } };
}
