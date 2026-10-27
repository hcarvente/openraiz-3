// The sign-in / account links in the header. It reads the session (cookies), so SiteHeader shows it inside <Suspense>.
import Link from "next/link";
import { auth } from "@/lib/auth/server";

export default async function AuthLinks() {
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
        <Link href="/auth/sign-in">Sign in</Link>
        <Link href="/auth/sign-up">Create account</Link>
      </>
    );
  }
  return <Link href="/account">Account</Link>;
}
