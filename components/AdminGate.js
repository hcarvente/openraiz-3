// Wrap an admin page's content in this. It renders its children only for an admin: a visitor who is not signed in is
// sent to the sign-in page (and back here afterwards), and anyone else sees a plain "no access" message.
// Because the children are not rendered unless the check passes, their database reads never run for other people.
// (A layout cannot do this job: layouts and pages render at the same time, so the page would still run.)
import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/roles";

export default async function AdminGate({ children, next = "/account" }) {
  let current = null;
  try {
    current = await getCurrentUser();
  } catch (error) {
    console.error("Could not check the signed-in user:", error?.name, error?.code);
    return (
      <p className="state-message state-error" role="alert">
        Sign-in is unavailable right now. Please try again in a moment.
      </p>
    );
  }

  if (!current) redirect(`/auth/sign-in?next=${encodeURIComponent(next)}`);

  if (!current.isAdmin) {
    return (
      <p className="state-message state-error" role="alert">
        You don&rsquo;t have access to this page. <Link href="/opportunities">Back to opportunities</Link>
      </p>
    );
  }

  return children;
}
