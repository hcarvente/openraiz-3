// The sign-in / account links in the header. It reads the session (cookies), so SiteHeader shows it inside <Suspense>.
import Link from "next/link";
import { auth } from "@/lib/auth/server";
import { localePath } from "@/lib/i18n/config";

export default async function AuthLinks({ lang = "en" }) {
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
        <Link href={localePath(lang, "/auth/sign-in")}>Sign in</Link>
        <Link href={localePath(lang, "/auth/sign-up")}>Create account</Link>
      </>
    );
  }
  return <Link href={localePath(lang, "/account")}>Account</Link>;
}
