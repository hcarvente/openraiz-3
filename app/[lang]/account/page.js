// The signed-in person's account page. Signed-out visitors are sent to sign in and brought back here.
import { Suspense } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import AccountView from "@/components/account/AccountView";
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

  return (
    <AccountView
      lang={lang}
      t={t}
      signUpCopy={signUpCopy}
      user={user}
      profile={profile}
      isVerified={isVerified}
      isAdmin={isAdmin}
      counts={{ pending: queueCount, reports: reportCount }}
      posted={Boolean(posted)}
      postedBanner={getDictionary(lang).post.successBanner}
      signOutAction={signOutAction}
    />
  );
}

export default async function AccountPage({ params, searchParams }) {
  const { lang } = await params;
  const t = getDictionary(lang).account;
  return (
    <>
      <main id="main-content" tabIndex={-1} className="page-main account-page">
        <h1>{t.heading}</h1>
        <Suspense fallback={<p className="state-message">{t.loading}</p>}>
          <AccountContent lang={lang} searchParams={searchParams} />
        </Suspense>
      </main>
    </>
  );
}
