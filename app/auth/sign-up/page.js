import Link from "next/link";
import { SignUpForm } from "@/components/auth/AuthForms";

export const metadata = { title: "Create account | OpenRaiz" };

export default function SignUpPage() {
  return (
    <>
      <main id="main-content" tabIndex={-1} className="page-main auth-page">
        <h1>Create account</h1>
        <p className="page-intro">
          Individuals and organizations can post opportunities. We will email you a code to confirm your address.
        </p>
        <SignUpForm />
        <p className="auth-alt">
          Already have an account? <Link href="/auth/sign-in">Sign in</Link>
        </p>
      </main>
    </>
  );
}
