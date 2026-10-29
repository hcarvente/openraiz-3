// The practice interview (/en/interview, /es/interview). General practice by category, or, with ?opportunity=<id>, practice for one
// public listing. Only the id is in the address. The listing is loaded here on the server, and the AI call happens in
// /api/interview/evaluate. With Cache Components, reading searchParams and the database happens inside <Suspense>.
import { Suspense } from "react";
import InterviewCoach from "@/components/interview/InterviewCoach";
import { prisma } from "@/lib/prisma";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { translatedView } from "@/lib/translation";
import { PUBLIC_WHERE } from "@/lib/opportunityVisibility";
import { isValidListingId } from "@/lib/opportunityDetail";
import { buildQuestions } from "@/lib/interview/questions";

export async function generateMetadata({ params }) {
  const { lang } = await params;
  return { title: getDictionary(lang).meta.titles.interview };
}

async function CoachContent({ lang, searchParams }) {
  const dictionary = getDictionary(lang);
  const { opportunity } = await searchParams;
  const id = typeof opportunity === "string" ? opportunity : null;

  let role = null; // { id, title, organization, questions } when practicing for a listing
  let notFound = false;
  if (id) {
    let row = null;
    try {
      row = isValidListingId(id) ? await prisma.opportunity.findFirst({ where: { id, ...PUBLIC_WHERE } }) : null;
    } catch (error) {
      console.error("Interview page could not load the listing:", error?.name, error?.code);
      return (
        <p className="state-message state-error" role="alert">
          {dictionary.interview.errors.server}
        </p>
      );
    }
    if (row) {
      const view = { ...row, ...translatedView(row, lang).text };
      role = { id: row.id, title: view.title, organization: view.organization, questions: buildQuestions({ lang, listing: view }) };
    } else {
      notFound = true;
    }
  }

  return (
    <>
      {notFound ? (
        <p className="form-notice" role="status">
          {dictionary.interview.listingMissing}
        </p>
      ) : null}
      <InterviewCoach lang={lang} role={role} copy={dictionary.interview} />
    </>
  );
}

export default async function InterviewPage({ params, searchParams }) {
  const { lang } = await params;
  const t = getDictionary(lang);
  return (
    <main id="main-content" tabIndex={-1} className="page-main">
      <h1>{t.interview.heading}</h1>
      <p className="page-intro">{t.interview.intro}</p>
      <Suspense fallback={<p className="state-message">{t.common.loading}</p>}>
        <CoachContent lang={lang} searchParams={searchParams} />
      </Suspense>
    </main>
  );
}
