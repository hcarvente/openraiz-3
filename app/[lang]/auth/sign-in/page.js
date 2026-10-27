import { Suspense } from "react";
import Link from "next/link";
import { SignInForm } from "@/components/auth/AuthForms";
import { localePath } from "@/lib/i18n/config";
import { safeNextPath } from "@/lib/safeRedirect";

export const metadata = { title: "Sign in | OpenRaiz" };

// searchParams is a Promise and is request-specific, so it is read inside <Suspense> (Cache Components).
async function SignInContent({ searchParams, lang }) {
  const { next, verified } = await searchParams;
  return (
    <>
      {verified ? (
        <p className="form-notice" role="status">
          Your email is verified. You can sign in now.
        </p>
      ) : null}
      <SignInForm next={safeNextPath(next, localePath(lang, "/account"))} />
    </>
  );
}

export default async function SignInPage({ params, searchParams }) {
  const { lang } = await params;
  return (
    <>
      <main id="main-content" tabIndex={-1} className="page-main auth-page">
        <h1>Sign in</h1>
        <Suspense fallback={<p className="state-message">Loading&hellip;</p>}>
          <SignInContent searchParams={searchParams} lang={lang} />
        </Suspense>
        <p className="auth-alt">
          New here? <Link href={localePath(lang, "/auth/sign-up")}>Create an account</Link>
        </p>
      </main>
    </>
  );
}
