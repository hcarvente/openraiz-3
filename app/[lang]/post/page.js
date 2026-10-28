// "Post an opportunity" (/en/post, /es/post): the short form for a signed-in, email-verified individual or organization.
// Signed-out visitors are sent to sign in and brought back. Everyone is checked again on the server by POST /api/posts.
import { Suspense } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import PostForm from "@/components/post/PostForm";
import { localePath } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getCurrentUser } from "@/lib/roles";
import { prisma } from "@/lib/prisma";
import { INDIVIDUAL_TYPES, MAX_PENDING_POSTS, ORGANIZATION_TYPES } from "@/lib/validatePost";

export async function generateMetadata({ params }) {
  const { lang } = await params;
  return { title: getDictionary(lang).meta.titles.post };
}

async function PostContent({ lang }) {
  const dictionary = getDictionary(lang);
  const t = dictionary.post;

  let current;
  let pending = 0;
  try {
    current = await getCurrentUser();
    if (current) {
      pending = await prisma.opportunity.count({ where: { ownerUserId: current.user.id, approvalStatus: "pending" } });
    }
  } catch (error) {
    console.error("Post page could not load:", error?.name, error?.code);
    return (
      <p className="state-message state-error" role="alert">
        {t.serverErrors.unavailable}
      </p>
    );
  }

  if (!current) redirect(`${localePath(lang, "/auth/sign-in")}?next=${encodeURIComponent(localePath(lang, "/post"))}`);

  if (!current.isVerified) {
    return (
      <p className="form-notice" role="status">
        {t.needVerify} <Link href={`${localePath(lang, "/auth/verify")}?email=${encodeURIComponent(current.user.email)}`}>{t.verifyLink}</Link>
      </p>
    );
  }
  if (!current.profile) {
    return (
      <p className="form-notice" role="status">
        {t.needProfile} <Link href={localePath(lang, "/account")}>{t.profileLink}</Link>
      </p>
    );
  }
  if (pending >= MAX_PENDING_POSTS) {
    return (
      <p className="form-notice" role="status">
        {t.tooMany}
      </p>
    );
  }

  const role = current.profile.role;
  return (
    <PostForm
      lang={lang}
      successPath={`${localePath(lang, "/account")}?posted=1`}
      role={role}
      allowedTypes={role === "organization" ? ORGANIZATION_TYPES : INDIVIDUAL_TYPES}
      displayName={role === "organization" ? current.profile.orgName || current.profile.displayName : current.profile.displayName}
      copy={t}
      typeLabels={dictionary.card.types}
      categoryLabels={dictionary.categories}
      relevanceLabels={dictionary.card.relevance}
    />
  );
}

export default async function PostPage({ params }) {
  const { lang } = await params;
  const t = getDictionary(lang);
  return (
    <main id="main-content" tabIndex={-1} className="page-main">
      <h1>{t.post.heading}</h1>
      <p className="page-intro">{t.post.intro}</p>
      <Suspense fallback={<p className="state-message">{t.common.loading}</p>}>
        <PostContent lang={lang} />
      </Suspense>
    </main>
  );
}
