// The landing page ("About"): the mission, then a button into the opportunities list. It reads nothing from the
// database, so only the header's sign-in links are worked out per visitor.
import Image from "next/image";
import Link from "next/link";
import { localePath } from "@/lib/i18n/config";

export default async function LandingPage({ params }) {
  const { lang } = await params;
  return (
    <div className="landing-background">
      {/* Phone-sized screens crop the wide photo badly as a page background, so they get this band instead (see globals.css). */}
      <Image className="about-hero-image" src="/OpenRaiz_About.jpg" alt="" width={1671} height={941} priority />
      <main id="main-content" tabIndex={-1} className="about">
        <div className="about-card">
          <h1>You belong here because of what you bring.</h1>
          <p>
            OpenRaiz connects young adults whose lived experience with systems &mdash; justice, immigration, foster
            care, housing instability, and others &mdash; has too often created barriers to opportunity, with
            organizations that recognize that experience as expertise, not a deficit.
          </p>
          <p>
            Government agencies, nonprofits, philanthropy, and other mission-aligned employers list jobs, fellowships,
            internships, and volunteer roles here &mdash; opportunities that specifically welcome, prefer, or require
            the perspective you carry.
          </p>
          <p>
            Organizations and individuals can also share workshops, events, resources and opportunities here.
          </p>
          <p>
            You don&rsquo;t have to disclose anything about your history to browse. Every listing tells you how it
            relates to lived experience; nothing here asks you to prove yours.
          </p>
          <Link className="about-cta" href={localePath(lang, "/opportunities")}>
            Browse opportunities
          </Link>
          <p className="about-incubated">
            Incubated by Alianza for Opportunity &mdash; OpenRaiz is its own standalone project.
          </p>
        </div>
      </main>
    </div>
  );
}
