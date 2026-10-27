import Link from "next/link";
import { SignUpForm } from "@/components/auth/AuthForms";
import { localePath } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";

export async function generateMetadata({ params }) {
  const { lang } = await params;
  return { title: getDictionary(lang).meta.titles.signUp };
}

export default async function SignUpPage({ params }) {
  const { lang } = await params;
  const t = getDictionary(lang).auth.signUp;
  return (
    <>
      <main id="main-content" tabIndex={-1} className="page-main auth-page">
        <h1>{t.heading}</h1>
        <p className="page-intro">{t.intro}</p>
        <SignUpForm copy={t} />
        <p className="auth-alt">
          {t.haveAccount} <Link href={localePath(lang, "/auth/sign-in")}>{t.signInLink}</Link>
        </p>
      </main>
    </>
  );
}
