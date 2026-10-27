import { Suspense } from "react";
import Link from "next/link";
import { SignInForm } from "@/components/auth/AuthForms";
import { localePath } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { safeNextPath } from "@/lib/safeRedirect";

export async function generateMetadata({ params }) {
  const { lang } = await params;
  return { title: getDictionary(lang).meta.titles.signIn };
}

// searchParams is a Promise and is request-specific, so it is read inside <Suspense> (Cache Components).
async function SignInContent({ searchParams, lang }) {
  const t = getDictionary(lang).auth.signIn;
  const { next, verified } = await searchParams;
  return (
    <>
      {verified ? (
        <p className="form-notice" role="status">
          {t.verifiedNote}
        </p>
      ) : null}
      <SignInForm next={safeNextPath(next, localePath(lang, "/account"))} copy={t} />
    </>
  );
}

export default async function SignInPage({ params, searchParams }) {
  const { lang } = await params;
  const dictionary = getDictionary(lang);
  const t = dictionary.auth.signIn;
  return (
    <>
      <main id="main-content" tabIndex={-1} className="page-main auth-page">
        <h1>{t.heading}</h1>
        <Suspense fallback={<p className="state-message">{dictionary.common.loading}</p>}>
          <SignInContent searchParams={searchParams} lang={lang} />
        </Suspense>
        <p className="auth-alt">
          {t.newHere} <Link href={localePath(lang, "/auth/sign-up")}>{t.createLink}</Link>
        </p>
      </main>
    </>
  );
}
