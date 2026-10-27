import { Suspense } from "react";
import { VerifyForm } from "@/components/auth/AuthForms";
import { getDictionary } from "@/lib/i18n/dictionaries";

export async function generateMetadata({ params }) {
  const { lang } = await params;
  return { title: getDictionary(lang).meta.titles.verify };
}

async function VerifyContent({ searchParams, copy }) {
  const { email } = await searchParams;
  return <VerifyForm email={typeof email === "string" ? email : ""} copy={copy} />;
}

export default async function VerifyPage({ params, searchParams }) {
  const { lang } = await params;
  const dictionary = getDictionary(lang);
  const t = dictionary.auth.verify;
  return (
    <>
      <main id="main-content" tabIndex={-1} className="page-main auth-page">
        <h1>{t.heading}</h1>
        <p className="page-intro">{t.intro}</p>
        <Suspense fallback={<p className="state-message">{dictionary.common.loading}</p>}>
          <VerifyContent searchParams={searchParams} copy={t} />
        </Suspense>
      </main>
    </>
  );
}
