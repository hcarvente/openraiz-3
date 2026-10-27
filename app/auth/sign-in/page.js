import { Suspense } from "react";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import { SignInForm } from "@/components/auth/AuthForms";
import { safeNextPath } from "@/lib/safeRedirect";

export const metadata = { title: "Sign in | OpenRaiz" };

// searchParams is a Promise and is request-specific, so it is read inside <Suspense> (Cache Components).
async function SignInContent({ searchParams }) {
  const { next, verified } = await searchParams;
  return (
    <>
      {verified ? (
        <p className="form-notice" role="status">
          Your email is verified. You can sign in now.
        </p>
      ) : null}
      <SignInForm next={safeNextPath(next)} />
    </>
  );
}

export default function SignInPage({ searchParams }) {
  return (
    <>
      <SiteHeader />
      <main className="page-main auth-page">
        <h1>Sign in</h1>
        <Suspense fallback={<p className="state-message">Loading&hellip;</p>}>
          <SignInContent searchParams={searchParams} />
        </Suspense>
        <p className="auth-alt">
          New here? <Link href="/auth/sign-up">Create an account</Link>
        </p>
      </main>
    </>
  );
}
