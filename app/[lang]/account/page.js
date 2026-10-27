// The signed-in person's account page. Signed-out visitors are sent to sign in and brought back here.
import { Suspense } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { CompleteProfileForm } from "@/components/auth/AuthForms";
import { getCurrentUser } from "@/lib/roles";
import { signOutAction } from "@/app/[lang]/auth/actions";
import { localePath } from "@/lib/i18n/config";

export const metadata = { title: "Your account | OpenRaiz" };

const ROLE_LABELS = { individual: "Individual", organization: "Organization" };

async function AccountContent({ lang }) {
  let current;
  try {
    current = await getCurrentUser();
  } catch (error) {
    console.error("Account page could not load:", error?.name, error?.code);
    return (
      <p className="state-message state-error" role="alert">
        We couldn&rsquo;t load your account right now. Please try again in a moment.
      </p>
    );
  }
  if (!current) redirect(`${localePath(lang, "/auth/sign-in")}?next=${encodeURIComponent(localePath(lang, "/account"))}`);
  const { user, profile, isVerified, isAdmin } = current;

  return (
    <>
      <dl className="account-details">
        <dt>Name</dt>
        <dd>{profile?.displayName ?? user.name}</dd>
        <dt>Email</dt>
        <dd>{user.email}</dd>
        <dt>Email status</dt>
        <dd>{isVerified ? "Verified" : "Not verified yet"}</dd>
        <dt>Account type</dt>
        <dd>
          {profile ? ROLE_LABELS[profile.role] : "Not set yet"}
          {profile?.orgName ? ` — ${profile.orgName}` : ""}
          {isAdmin ? " · Administrator" : ""}
        </dd>
      </dl>

      {!isVerified ? (
        <p className="form-notice" role="status">
          Verify your email to be able to post. <Link href={`${localePath(lang, "/auth/verify")}?email=${encodeURIComponent(user.email)}`}>Enter your code</Link>
        </p>
      ) : null}

      {!profile ? (
        <section aria-labelledby="finish-profile">
          <h2 id="finish-profile">Finish your profile</h2>
          <CompleteProfileForm />
        </section>
      ) : null}

      {isAdmin ? (
        <p>
          <Link className="button button-secondary" href="/admin/opportunities/new">
            Add an opportunity
          </Link>
        </p>
      ) : null}

      <form action={signOutAction}>
        <input type="hidden" name="lang" value={lang} />
        <button className="button button-secondary" type="submit">
          Sign out
        </button>
      </form>
    </>
  );
}

export default async function AccountPage({ params }) {
  const { lang } = await params;
  return (
    <>
      <main id="main-content" tabIndex={-1} className="page-main auth-page">
        <h1>Your account</h1>
        <Suspense fallback={<p className="state-message">Loading your account&hellip;</p>}>
          <AccountContent lang={lang} />
        </Suspense>
      </main>
    </>
  );
}
