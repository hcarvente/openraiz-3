// "My listings" (/en/my-listings, /es/my-listings): everything the signed-in person has posted, with where each stands.
// With Cache Components, reading searchParams and the database happens inside <Suspense>.
import { Suspense } from "react";
import Link from "next/link";
import PosterGate from "@/components/PosterGate";
import WithdrawButton from "@/components/post/WithdrawButton";
import { formatDate } from "@/lib/formatDate";
import { localePath } from "@/lib/i18n/config";
import { fill, getDictionary } from "@/lib/i18n/dictionaries";
import { listingState } from "@/lib/listingState";
import { prisma } from "@/lib/prisma";

export async function generateMetadata({ params }) {
  const { lang } = await params;
  return { title: getDictionary(lang).meta.titles.mine };
}

async function MyListings({ lang, searchParams }) {
  const dictionary = getDictionary(lang);
  const t = dictionary.mine;
  const { posted, saved } = await searchParams;

  return (
    <PosterGate lang={lang} path="/my-listings">
      {async (current) => {
        let rows;
        try {
          rows = await prisma.opportunity.findMany({
            where: { ownerUserId: current.user.id, source: "user-posted" }, // only what this person posted
            orderBy: [{ createdAt: "desc" }, { id: "asc" }],
          });
        } catch (error) {
          console.error("My listings could not load:", error?.name, error?.code);
          return (
            <p className="state-message state-error" role="alert">
              {dictionary.opportunities.loadError}
            </p>
          );
        }

        return (
          <>
            {posted ? (
              <p className="form-notice" role="status">
                {dictionary.post.successBanner}
              </p>
            ) : null}
            {saved ? (
              <p className="form-notice" role="status">
                {t.savedBanner}
              </p>
            ) : null}

            <p>
              <Link className="button button-primary" href={localePath(lang, "/post")}>
                {t.postFirst}
              </Link>
            </p>

            {rows.length === 0 ? (
              <p className="state-message">{t.empty}</p>
            ) : (
              <ul className="my-listings">
                {rows.map((row) => {
                  const state = listingState(row);
                  const contentLang = row.originalLang ?? "en";
                  return (
                    <li key={row.id} className="my-listing">
                      <div className="my-listing-head">
                        <h2 lang={contentLang}>
                          {state === "live" || state === "filled" ? (
                            <Link href={localePath(lang, `/opportunities/${row.id}`)}>{row.title}</Link>
                          ) : (
                            row.title
                          )}
                        </h2>
                        <span className={`pill pill-state-${state}`}>{t.states[state]}</span>
                      </div>
                      <p className="my-listing-meta">
                        {dictionary.card.types[row.type] ?? row.type} ·{" "}
                        {fill(t.submitted, { date: formatDate(row.createdAt.toISOString().slice(0, 10), lang) })}
                      </p>
                      {state === "rejected" && row.rejectionReason ? (
                        <p className="my-listing-reason">
                          <strong>{t.reasonLabel}</strong> <span lang={lang}>{row.rejectionReason}</span>
                        </p>
                      ) : null}
                      {state !== "withdrawn" ? (
                        <div className="my-listing-actions">
                          <Link className="button button-secondary button-small" href={localePath(lang, `/my-listings/${row.id}/edit`)}>
                            {t.edit}
                          </Link>
                          <WithdrawButton listingId={row.id} copy={t} failureText={dictionary.post.serverErrors.server} />
                        </div>
                      ) : null}
                    </li>
                  );
                })}
              </ul>
            )}
          </>
        );
      }}
    </PosterGate>
  );
}

export default async function MyListingsPage({ params, searchParams }) {
  const { lang } = await params;
  const dictionary = getDictionary(lang);
  return (
    <main id="main-content" tabIndex={-1} className="page-main">
      <h1>{dictionary.mine.heading}</h1>
      <p className="page-intro">{dictionary.mine.intro}</p>
      <Suspense fallback={<p className="state-message">{dictionary.common.loading}</p>}>
        <MyListings lang={lang} searchParams={searchParams} />
      </Suspense>
    </main>
  );
}
