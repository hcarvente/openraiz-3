// The checks every page for posters starts with: signed in (otherwise sent to sign in and back), email verified, and a
// saved profile. It renders `children(current)` only when all three hold; otherwise it shows a short message with a link
// to fix it. Everything is checked again on the server by the API routes.
import Link from "next/link";
import { redirect } from "next/navigation";
import { localePath } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getCurrentUser } from "@/lib/roles";

export default async function PosterGate({ lang, path, children }) {
  const t = getDictionary(lang).post;

  let current;
  try {
    current = await getCurrentUser();
  } catch (error) {
    console.error("Could not check the signed-in user:", error?.name, error?.code);
    return (
      <p className="state-message state-error" role="alert">
        {t.serverErrors.unavailable}
      </p>
    );
  }

  if (!current) redirect(`${localePath(lang, "/auth/sign-in")}?next=${encodeURIComponent(localePath(lang, path))}`);
  if (!current.isVerified) {
    return (
      <p className="form-notice" role="status">
        {t.needVerify} <Link href={`${localePath(lang, "/auth/verify")}?email=${encodeURIComponent(current.user.email)}`}>{t.verifyLink}</Link>
      </p>
    );
  }
  if (!current.profile) {
    return (
      <p className="form-notice" role="status">
        {t.needProfile} <Link href={localePath(lang, "/account")}>{t.profileLink}</Link>
      </p>
    );
  }
  return children(current);
}
