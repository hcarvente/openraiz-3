// One opportunity, in full: /en/opportunities/<id> and /es/opportunities/<id>. A Server Component: it reads the database
// through Prisma and sends finished HTML. Only public listings are shown (approved and not archived); any other id answers
// "not found", exactly like an id that does not exist.
//
// With Cache Components, `params` (the id) and the database read must be used inside <Suspense>, so the page itself only
// draws the frame and everything else happens in <Detail>.
import { Suspense } from "react";
import Link from "next/link";
import { connection } from "next/server";
import ContactForm from "@/components/contact/ContactForm";
import ReportForm from "@/components/report/ReportForm";
import JobFitExplainer from "@/components/fit/JobFitExplainer";
import { getCurrentUser } from "@/lib/roles";
import { formatDate } from "@/lib/formatDate";
import { localePath } from "@/lib/i18n/config";
import { fill, getDictionary } from "@/lib/i18n/dictionaries";
import { isValidListingId, posterInfo, safeApplyLink } from "@/lib/opportunityDetail";
import { PUBLIC_WHERE } from "@/lib/opportunityVisibility";
import { prisma } from "@/lib/prisma";
import { translatedView } from "@/lib/translation";
import { serializePublicOpportunity } from "@/lib/serializeOpportunity";

export async function generateMetadata({ params }) {
  const { lang, id } = await params;
  const fallback = { title: getDictionary(lang).meta.titles.opportunity };
  if (!isValidListingId(id)) return fallback;
  try {
    const row = await prisma.opportunity.findFirst({
      where: { id, ...PUBLIC_WHERE },
      select: { title: true, summary: true, description: true, originalLang: true, titleTr: true, summaryTr: true, descriptionTr: true, requirementsTr: true, translationStatus: true },
    });
    if (!row) return fallback;
    const { text } = translatedView(row, lang); // the page's own language, when a translation is approved
    return { title: `${text.title} | OpenRaiz`, description: (text.summary ?? text.description).slice(0, 200) };
  } catch {
    return fallback;
  }
}

// Shown for an id that is malformed, does not exist, or is not public. It is drawn here (not with notFound()) so the
// words are in the visitor's language. The status stays 200 because the page has already started to stream; the
// noindex tag keeps search engines from listing it.
function ListingNotFound({ lang }) {
  const d = getDictionary(lang).detail;
  return (
    <>
      <meta name="robots" content="noindex" />
      <h1>{d.notFoundHeading}</h1>
      <p className="page-intro">{d.notFoundIntro}</p>
      <p>
        <Link className="button button-primary" href={localePath(lang, "/opportunities")}>
          {d.notFoundBack}
        </Link>
      </p>
    </>
  );
}

function Row({ label, children }) {
  return (
    <>
      <dt>{label}</dt>
      <dd>{children}</dd>
    </>
  );
}

async function Detail({ params }) {
  const { lang, id } = await params;
  const dictionary = getDictionary(lang);
  const d = dictionary.detail;
  const card = dictionary.card;

  if (!isValidListingId(id)) return <ListingNotFound lang={lang} />;

  let row;
  let profile = null;
  let current = null; // who is looking, for the contact box (not needed for anything else on this page)
  try {
    row = await prisma.opportunity.findFirst({ where: { id, ...PUBLIC_WHERE } });
    // The poster's name is looked up here, on the server, only for listings that people posted. The account id itself is
    // never sent to the browser (serializePublicOpportunity removes it).
    if (row && row.source === "user-posted" && row.ownerUserId) {
      profile = await prisma.profile.findUnique({ where: { userId: row.ownerUserId } });
    }
    if (row) current = await getCurrentUser();
  } catch (error) {
    console.error("Detail page could not load the opportunity:", error?.name, error?.code);
    return (
      <p className="state-message state-error" role="alert">
        {dictionary.opportunities.loadError}
      </p>
    );
  }
  if (!row) return <ListingNotFound lang={lang} />;

  const o = serializePublicOpportunity(row);
  // The words to show: the original, or its approved translation, each marked with the language it is written in.
  const view = translatedView(o, lang);
  const CONTENT_LANG = view.original;
  const poster = posterInfo(row, profile);
  const apply = safeApplyLink(o.applyMethodType, o.applyMethodValue);
  await connection(); // "today" changes, so this page is worked out for each visitor, never ahead of time
  const today = new Date().toISOString().slice(0, 10);
  const deadlinePassed = Boolean(o.deadline) && o.deadline < today;
  const place = [o.city, o.state].filter(Boolean).join(", ");
  const arrangement = card.locations[o.locationType] ?? o.locationType;
  const location = o.locationType === "remote" || !place ? arrangement : `${arrangement} · ${place}`;
  const levelLabel = card.relevance[o.livedExperienceRelevance] ?? o.livedExperienceRelevance;

  return (
    <article className="detail">
      <p className="back-link">
        <Link href={localePath(lang, "/opportunities")}>{d.back}</Link>
      </p>

      <header className="detail-header">
        <h1 lang={view.langs.title}>{view.text.title}</h1>
        <p className="detail-org" lang={CONTENT_LANG}>
          {o.organization}
        </p>
        <ul className="card-pills">
          <li className="pill">{card.types[o.type] ?? o.type}</li>
          <li className={`pill pill-status-${o.status}`}>{card.statuses[o.status] ?? o.status}</li>
          <li className="pill pill-relevance">{fill(card.livedExperience, { level: levelLabel })}</li>
        </ul>
        {view.showNote ? <p className="page-note">{CONTENT_LANG === "es" ? d.spanishOnly : d.englishOnly}</p> : null}
      </header>

      <div className="detail-grid">
        <div className="detail-main">
          {apply ? (
            <p>
              <a
                className="button button-primary"
                href={apply.href}
                {...(apply.kind === "url" ? { target: "_blank", rel: "noopener noreferrer nofollow" } : {})}
              >
                {apply.kind === "email" ? d.applyByEmail : d.apply}
                {apply.kind === "url" ? <span className="visually-hidden"> {d.opensInNewTab}</span> : null}
              </a>
              <span className="apply-target" lang={CONTENT_LANG}>
                {apply.display}
              </span>
            </p>
          ) : null}

          {view.text.summary ? (
            <p className="detail-summary" lang={view.langs.summary}>
              {view.text.summary}
            </p>
          ) : null}

          <section aria-labelledby="about">
            <h2 id="about">{d.about}</h2>
            <div className="detail-text" lang={view.langs.description}>
              {view.text.description}
            </div>
          </section>

          {view.text.requirements ? (
            <section aria-labelledby="requirements">
              <h2 id="requirements">{d.requirements}</h2>
              <div className="detail-text" lang={view.langs.requirements}>
                {view.text.requirements}
              </div>
            </section>
          ) : null}

          {o.skills.length > 0 ? (
            <section aria-labelledby="skills">
              <h2 id="skills">{d.skills}</h2>
              <ul className="tag-list" lang={CONTENT_LANG}>
                {o.skills.map((skill) => (
                  <li key={skill} className="tag">
                    {skill}
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          <section aria-labelledby="fit-heading" className="fit-section">
            <h2 id="fit-heading">{dictionary.fit.heading}</h2>
            <JobFitExplainer listingId={row.id} lang={lang} copy={dictionary.fit} />
            <p className="fit-practice">
              <Link className="button button-secondary" href={`${localePath(lang, "/interview")}?opportunity=${row.id}`}>
                {dictionary.interview.practiceLink}
              </Link>
            </p>
          </section>

          {o.applyMethodType === "platform" && o.status === "active" ? (
            <section aria-labelledby="contact-heading">
              <h2 id="contact-heading">{dictionary.contact.heading}</h2>
              {!current ? (
                <p>
                  <Link href={`${localePath(lang, "/auth/sign-in")}?next=${encodeURIComponent(localePath(lang, `/opportunities/${row.id}`))}`}>
                    {dictionary.contact.signIn}
                  </Link>
                </p>
              ) : !current.isVerified ? (
                <p>
                  {dictionary.contact.verify}{" "}
                  <Link href={`${localePath(lang, "/auth/verify")}?email=${encodeURIComponent(current.user.email)}`}>{dictionary.contact.verifyLink}</Link>
                </p>
              ) : !current.profile ? (
                <p>
                  {dictionary.contact.needProfile} <Link href={localePath(lang, "/account")}>{dictionary.contact.profileLink}</Link>
                </p>
              ) : row.ownerUserId === current.user.id ? (
                <p>{dictionary.contact.ownListing}</p>
              ) : (
                <>
                  <p>{dictionary.contact.intro}</p>
                  <ContactForm
                    listingId={row.id}
                    senderName={current.profile.role === "organization" ? current.profile.orgName || current.profile.displayName : current.profile.displayName}
                    copy={dictionary.contact}
                  />
                </>
              )}
            </section>
          ) : null}

          <section aria-labelledby="report-heading" className="report-section">
            <details>
              <summary id="report-heading">{dictionary.report.heading}</summary>
              {!current ? (
                <p>
                  <Link href={`${localePath(lang, "/auth/sign-in")}?next=${encodeURIComponent(localePath(lang, `/opportunities/${row.id}`))}`}>
                    {dictionary.report.signIn}
                  </Link>
                </p>
              ) : !current.isVerified ? (
                <p>
                  {dictionary.report.verify}{" "}
                  <Link href={`${localePath(lang, "/auth/verify")}?email=${encodeURIComponent(current.user.email)}`}>{dictionary.report.verifyLink}</Link>
                </p>
              ) : !current.profile ? (
                <p>
                  {dictionary.report.needProfile} <Link href={localePath(lang, "/account")}>{dictionary.report.profileLink}</Link>
                </p>
              ) : row.ownerUserId === current.user.id ? null : (
                <>
                  <p>{dictionary.report.intro}</p>
                  <ReportForm listingId={row.id} copy={dictionary.report} />
                </>
              )}
            </details>
          </section>

          <section aria-labelledby="lived">
            <h2 id="lived">{d.livedHeading}</h2>
            <p>{d.lived[o.livedExperienceRelevance]}</p>
          </section>
        </div>

        <aside className="detail-aside" aria-labelledby="key-details">
          <h2 id="key-details">{d.keyDetails}</h2>
          <dl className="key-details">
            {o.eventDate ? (
              <Row label={d.eventDate}>
                <time dateTime={o.eventDate}>{formatDate(o.eventDate, lang)}</time>
              </Row>
            ) : null}
            <Row label={d.deadline}>
              {o.deadline ? (
                <>
                  {deadlinePassed ? `${card.deadlinePassed} ` : ""}
                  <time dateTime={o.deadline}>{formatDate(o.deadline, lang)}</time>
                </>
              ) : (
                card.rolling
              )}
            </Row>
            <Row label={d.location}>
              {location}
              {o.address && o.locationType !== "remote" ? (
                <>
                  <br />
                  <span lang={CONTENT_LANG}>{o.address}</span>
                </>
              ) : null}
            </Row>
            <Row label={d.type}>{card.types[o.type] ?? o.type}</Row>
            <Row label={d.pay}>
              <span lang={CONTENT_LANG}>{o.compensation}</span>
            </Row>
            {o.commitment ? (
              <Row label={d.commitment}>
                <span lang={CONTENT_LANG}>{o.commitment}</span>
              </Row>
            ) : null}
            {o.category ? (
              <Row label={d.category}>{dictionary.categories[o.category] ?? o.category}</Row>
            ) : null}
            <Row label={d.status}>{card.statuses[o.status] ?? o.status}</Row>
            <Row label={d.posted}>
              <time dateTime={o.datePosted}>{formatDate(o.datePosted, lang)}</time>
            </Row>
            <Row label={d.postedBy}>
              {poster ? (
                <>
                  <span lang={CONTENT_LANG}>{poster.name}</span> ·{" "}
                  {poster.role === "organization" ? d.posterOrganization : d.posterIndividual}
                </>
              ) : (
                d.postedByOpenRaiz
              )}
            </Row>
          </dl>
          {poster?.role === "individual" ? <p className="page-note">{d.individualNotice}</p> : null}
        </aside>
      </div>
    </article>
  );
}

export default function OpportunityPage({ params }) {
  return (
    <main id="main-content" tabIndex={-1} className="page-main detail-page">
      <Suspense fallback={null}>
        <Detail params={params} />
      </Suspense>
    </main>
  );
}
