// Edit one of your own listings (/en/my-listings/<id>/edit). It is the posting form with the listing's answers filled in.
// A listing that is not yours looks exactly like one that does not exist. Saving sends it back to review.
import { Suspense } from "react";
import Link from "next/link";
import PostForm from "@/components/post/PostForm";
import PosterGate from "@/components/PosterGate";
import { localePath } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { isValidListingId } from "@/lib/opportunityDetail";
import { valuesFromListing } from "@/lib/postFormValues";
import { prisma } from "@/lib/prisma";
import { INDIVIDUAL_TYPES, ORGANIZATION_TYPES } from "@/lib/validatePost";

export async function generateMetadata({ params }) {
  const { lang } = await params;
  return { title: getDictionary(lang).meta.titles.editListing };
}

async function EditContent({ params }) {
  const { lang, id } = await params;
  const dictionary = getDictionary(lang);
  const t = dictionary.mine;

  return (
    <PosterGate lang={lang} path={`/my-listings/${isValidListingId(id) ? id : ""}/edit`}>
      {async (current) => {
        let row = null;
        try {
          if (isValidListingId(id)) {
            row = await prisma.opportunity.findFirst({ where: { id, ownerUserId: current.user.id, source: "user-posted" } });
          }
        } catch (error) {
          console.error("Edit page could not load the listing:", error?.name, error?.code);
          return (
            <p className="state-message state-error" role="alert">
              {dictionary.opportunities.loadError}
            </p>
          );
        }
        const back = (
          <p className="back-link">
            <Link href={localePath(lang, "/my-listings")}>{t.back}</Link>
          </p>
        );
        if (!row) {
          return (
            <>
              {back}
              <p className="state-message" role="status">
                {t.notFound}
              </p>
            </>
          );
        }
        if (row.status === "archived") {
          return (
            <>
              {back}
              <p className="state-message" role="status">
                {t.withdrawnNote}
              </p>
            </>
          );
        }

        const role = current.profile.role;
        return (
          <>
            {back}
            <h1>{t.editHeading}</h1>
            <PostForm
              mode="edit"
              listingId={row.id}
              lang={lang}
              successPath={`${localePath(lang, "/my-listings")}?saved=1`}
              role={role}
              allowedTypes={role === "organization" ? ORGANIZATION_TYPES : INDIVIDUAL_TYPES}
              displayName={role === "organization" ? current.profile.orgName || current.profile.displayName : current.profile.displayName}
              copy={dictionary.post}
              typeLabels={dictionary.card.types}
              categoryLabels={dictionary.categories}
              relevanceLabels={dictionary.card.relevance}
              initialValues={valuesFromListing(row)}
              initialLang={row.originalLang ?? "en"}
              notice={t.editNote}
            />
          </>
        );
      }}
    </PosterGate>
  );
}

export default function EditListingPage({ params }) {
  return (
    <main id="main-content" tabIndex={-1} className="page-main">
      <Suspense fallback={null}>
        <EditContent params={params} />
      </Suspense>
    </main>
  );
}
