// What the Account page shows for a signed-in person: who they are (name, email, kind of account, badges), what they can do
// next as action cards, and sign out. A Server Component with no state; the page works out the person and the counts and
// passes them in, so this file only draws.
import Link from "next/link";
import { CompleteProfileForm } from "@/components/auth/AuthForms";
import { localePath } from "@/lib/i18n/config";
import { fill } from "@/lib/i18n/dictionaries";

function ActionCard({ href, title, hint, count, tone }) {
  return (
    <li>
      <Link className={`action-card${tone ? ` action-${tone}` : ""}`} href={href}>
        <span className="action-title">
          {title}
          {count > 0 ? <span className="admin-count">{count}</span> : null}
        </span>
        <span className="action-hint">{hint}</span>
        <span className="action-arrow" aria-hidden="true">→</span>
      </Link>
    </li>
  );
}

export default function AccountView({ lang, t, signUpCopy, user, profile, isVerified, isAdmin, counts, posted, postedBanner, signOutAction }) {
  const roleLabels = { individual: t.individual, organization: t.organization };
  const name = profile?.displayName ?? user.name ?? user.email;
  const initial = (name || "?").trim().charAt(0).toUpperCase();
  const canPost = isVerified && Boolean(profile);

  return (
    <>
      {posted ? (
        <p className="form-notice" role="status">
          {postedBanner}
        </p>
      ) : null}

      <section className="profile-card" aria-labelledby="profile-name">
        <span className="avatar" aria-hidden="true">
          {initial}
        </span>
        <div className="profile-main">
          <h2 id="profile-name">{fill(t.welcome, { name })}</h2>
          <p className="profile-email">{user.email}</p>
          <ul className="badges">
            {profile ? (
              <li className="pill">
                {roleLabels[profile.role]}
                {profile.orgName ? ` · ${profile.orgName}` : ""}
              </li>
            ) : (
              <li className="pill pill-state-pending">{t.notSet}</li>
            )}
            <li className={`pill ${isVerified ? "pill-state-live" : "pill-state-pending"}`}>{isVerified ? t.verified : t.notVerified}</li>
            {isAdmin ? <li className="pill pill-state-filled">{t.administrator}</li> : null}
          </ul>
        </div>
      </section>

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

      {canPost ? (
        <section aria-labelledby="actions-heading">
          <h2 id="actions-heading">{t.actionsHeading}</h2>
          <ul className="action-cards">
            <ActionCard href={localePath(lang, "/post")} title={t.postOpportunity} hint={t.postHint} tone="primary" />
            <ActionCard href={localePath(lang, "/my-listings")} title={t.myListings} hint={t.myListingsHint} />
          </ul>
        </section>
      ) : null}

      {isAdmin ? (
        <section aria-labelledby="admin-heading">
          <h2 id="admin-heading">Admin</h2>
          <ul className="action-cards">
            <ActionCard href="/admin" title="Dashboard" hint="See what needs you first" tone="primary" />
            <ActionCard href="/admin/queue" title="Review queue" hint="Approve or reject new listings" count={counts.pending} />
            <ActionCard href="/admin/reports" title="Reports" hint="Listings people flagged" count={counts.reports} />
            <ActionCard href="/admin/opportunities/new" title={t.addOpportunity} hint="Add a listing yourself" />
          </ul>
        </section>
      ) : null}

      <form action={signOutAction} className="signout-form">
        <input type="hidden" name="lang" value={lang} />
        <button className="button button-secondary" type="submit">
          {t.signOut}
        </button>
      </form>
    </>
  );
}
