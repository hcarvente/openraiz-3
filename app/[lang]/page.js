// The landing page ("About"): the mission, then a button into the opportunities list. It reads nothing from the
// database, so only the header's sign-in links are worked out per visitor.
import Image from "next/image";
import Link from "next/link";
import { localePath } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";

export default async function LandingPage({ params }) {
  const { lang } = await params;
  const t = getDictionary(lang).landing;
  return (
    <div className="landing-background">
      {/* Phone-sized screens crop the wide photo badly as a page background, so they get this band instead (see globals.css). */}
      <Image className="about-hero-image" src="/OpenRaiz_About.jpg" alt="" width={1671} height={941} priority />
      <main id="main-content" tabIndex={-1} className="about">
        <div className="about-card">
          <h1>{t.heading}</h1>
          <p>{t.p1}</p>
          <p>{t.p2}</p>
          <p>{t.p3}</p>
          <p>{t.p4}</p>
          <Link className="about-cta" href={localePath(lang, "/opportunities")}>
            {t.cta}
          </Link>
          <p className="about-incubated">{t.incubated}</p>
        </div>
      </main>
    </div>
  );
}
