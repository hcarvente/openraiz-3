// The accessibility statement (/en/accessibility, /es/accessibility): what we aim for, what we did, how we checked, and what is
// not finished. Plain text from the dictionaries, so it is static.
import { getDictionary } from "@/lib/i18n/dictionaries";

export async function generateMetadata({ params }) {
  const { lang } = await params;
  return { title: getDictionary(lang).meta.titles.accessibility };
}

export default async function AccessibilityPage({ params }) {
  const { lang } = await params;
  const t = getDictionary(lang).accessibility;
  return (
    <main id="main-content" tabIndex={-1} className="page-main page-text">
      <h1>{t.heading}</h1>
      <p className="page-intro">{t.intro}</p>
      <h2>{t.goalHeading}</h2>
      <p>{t.goal}</p>
      <h2>{t.doneHeading}</h2>
      <ul>
        <li>{t.done1}</li>
        <li>{t.done2}</li>
        <li>{t.done3}</li>
        <li>{t.done4}</li>
      </ul>
      <h2>{t.testedHeading}</h2>
      <p>{t.tested}</p>
      <h2>{t.limitsHeading}</h2>
      <ul>
        <li>{t.limits1}</li>
        <li>{t.limits2}</li>
        <li>{t.limits3}</li>
      </ul>
      <p className="page-note">{t.updated}</p>
    </main>
  );
}
