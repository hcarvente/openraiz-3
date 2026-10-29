// The landing page ("About"): a hero with a search box, tiles for each type of opportunity, then the mission. It reads
// nothing from the database, so only the header's sign-in links are worked out per visitor.
import Image from "next/image";
import Link from "next/link";
import CategoryTiles from "@/components/CategoryTiles";
import { localePath } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";

export default async function LandingPage({ params }) {
  const { lang } = await params;
  const dictionary = getDictionary(lang);
  const t = dictionary.landing;
  return (
    <div className="landing-background">
      {/* Phone-sized screens crop the wide photo badly as a page background, so they get this band instead (see globals.css). */}
      <Image className="about-hero-image" src="/OpenRaiz_About.jpg" alt="" width={1671} height={941} priority />
      <main id="main-content" tabIndex={-1} className="about">
        <section className="hero-card" aria-labelledby="hero-heading">
          <h1 id="hero-heading">{t.heading}</h1>
          <p className="hero-tagline">{t.tagline}</p>
          <form className="hero-search" method="get" action={localePath(lang, "/opportunities")} role="search" aria-label={t.searchLabel}>
            <label className="visually-hidden" htmlFor="hero-q">
              {t.searchLabel}
            </label>
            <input id="hero-q" name="q" type="search" maxLength={100} placeholder={t.searchPlaceholder} autoComplete="off" />
            <button className="button button-primary" type="submit">
              {t.searchButton}
            </button>
          </form>
        </section>

        <section className="tiles-card" aria-labelledby="browse-heading">
          <h2 id="browse-heading">{t.browseHeading}</h2>
          <CategoryTiles lang={lang} labels={dictionary.card.types} />
        </section>

        <section className="about-card" aria-labelledby="about-heading">
          <h2 id="about-heading">{t.aboutHeading}</h2>
          <p>{t.p1}</p>
          <p>{t.p2}</p>
          <p>{t.p3}</p>
          <p>{t.p4}</p>
          <Link className="about-cta" href={localePath(lang, "/opportunities")}>
            {t.cta}
          </Link>
          <p className="about-incubated">{t.incubated}</p>
        </section>
      </main>
    </div>
  );
}
