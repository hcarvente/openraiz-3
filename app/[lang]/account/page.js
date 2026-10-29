// The signed-in person's account page. Signed-out visitors are sent to sign in and brought back here.
import { Suspense } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { CompleteProfileForm } from "@/components/auth/AuthForms";
import { getCurrentUser } from "@/lib/roles";
import { prisma } from "@/lib/prisma";
import { signOutAction } from "@/app/[lang]/auth/actions";
import { localePath } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";

export async function generateMetadata({ params }) {
  const { lang } = await params;
  return { title: getDictionary(lang).meta.titles.account };
}

async function AccountContent({ lang, searchParams }) {
  const t = getDictionary(lang).account;
  const signUpCopy = getDictionary(lang).auth.signUp;
  const { posted } = await searchParams;
  let current;
  let queueCount = 0;
  let reportCount = 0;
  try {
    current = await getCurrentUser();
    if (current?.isAdmin) {
      queueCount = await prisma.opportunity.count({ where: { approvalStatus: "pending", status: { not: "archived" } } });
      reportCount = await prisma.listingReport.count({ where: { resolvedAt: null } });
    }
  } catch (error) {
    console.error("Account page could not load:", error?.name, error?.code);
    return (
      <p className="state-message state-error" role="alert">
        {t.loadError}
      </p>
    );
  }
  if (!current) redirect(`${localePath(lang, "/auth/sign-in")}?next=${encodeURIComponent(localePath(lang, "/account"))}`);
  const { user, profile, isVerified, isAdmin } = current;
  const roleLabels = { individual: t.individual, organization: t.organization };

  return (
    <>
      {posted ? (
        <p className="form-notice" role="status">
          {getDictionary(lang).post.successBanner}
        </p>
      ) : null}
      <dl className="account-details">
        <dt>{t.name}</dt>
        <dd>{profile?.displayName ?? user.name}</dd>
        <dt>{t.email}</dt>
        <dd>{user.email}</dd>
        <dt>{t.emailStatus}</dt>
        <dd>{isVerified ? t.verified : t.notVerified}</dd>
        <dt>{t.accountType}</dt>
        <dd>
          {profile ? roleLabels[profile.role] : t.notSet}
          {profile?.orgName ? ` — ${profile.orgName}` : ""}
          {isAdmin ? ` · ${t.administrator}` : ""}
        </dd>
      </dl>

      {!isVerified ? (
        <p className="form-notice" role="status">
          {t.verifyNotice}{" "}
          <Link href={`${localePath(lang, "/auth/verify")}?email=${encodeURIComponent(user.email)}`}>{t.enterCode}</Link>
        </p>
      ) : null}

      {!profile ? (
        <section aria-labelledby="finish-profile">
          <h2 id="finish-profile">{t.finishHeading}</h2>
          <CompleteProfileForm copy={signUpCopy} saveLabel={t.save} savingLabel={t.saving} />
        </section>
      ) : null}

      {isVerified && profile ? (
        <p>
          <Link className="button button-primary" href={localePath(lang, "/post")}>
            {t.postOpportunity}
          </Link>
        </p>
      ) : null}

      {isVerified && profile ? (
        <p>
          <Link className="button button-secondary" href={localePath(lang, "/my-listings")}>
            {t.myListings}
          </Link>
        </p>
      ) : null}

      {isAdmin ? (
        <p>
          <Link className="button button-primary" href="/admin/queue">
            Review queue ({queueCount})
          </Link>{" "}
          <Link className="button button-secondary" href="/admin/reports">
            Reports ({reportCount})
          </Link>{" "}
          <Link className="button button-secondary" href="/admin/opportunities/new">
            {t.addOpportunity}
          </Link>
        </p>
      ) : null}

      <form action={signOutAction}>
        <input type="hidden" name="lang" value={lang} />
        <button className="button button-secondary" type="submit">
          {t.signOut}
        </button>
      </form>
    </>
  );
}

export default async function AccountPage({ params, searchParams }) {
  const { lang } = await params;
  const t = getDictionary(lang).account;
  return (
    <>
      <main id="main-content" tabIndex={-1} className="page-main auth-page">
        <h1>{t.heading}</h1>
        <Suspense fallback={<p className="state-message">{t.loading}</p>}>
          <AccountContent lang={lang} searchParams={searchParams} />
        </Suspense>
      </main>
    </>
  );
}
