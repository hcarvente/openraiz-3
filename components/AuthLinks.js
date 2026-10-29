// The sign-in / account links in the header. It reads the session (cookies), so SiteHeader shows it inside <Suspense>.
import Link from "next/link";
import { auth } from "@/lib/auth/server";
import { isAdminEmail } from "@/lib/rolesCore";
import { localePath } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";

export default async function AuthLinks({ lang = "en" }) {
  const t = getDictionary(lang);
  let user = null;
  try {
    const { data: session } = await auth.getSession();
    user = session?.user ?? null;
  } catch (error) {
    console.error("Header could not read the session:", error?.name, error?.code);
  }

  if (!user) {
    return (
      <>
        <Link href={localePath(lang, "/auth/sign-in")}>{t.nav.signIn}</Link>
        <Link href={localePath(lang, "/auth/sign-up")}>{t.nav.createAccount}</Link>
      </>
    );
  }
  // Admins also get a link to the dashboard (English only). This only shows a link; every admin page checks the role itself.
  const isAdmin = isAdminEmail(user.email, user.emailVerified, process.env.ADMIN_EMAILS);
  return (
    <>
      {isAdmin ? <Link href="/admin">Admin</Link> : null}
      <Link href={localePath(lang, "/post")}>{t.nav.post}</Link>
      <Link href={localePath(lang, "/account")}>{t.nav.account}</Link>
    </>
  );
}
