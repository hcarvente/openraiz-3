import { Suspense } from "react";
import { VerifyForm } from "@/components/auth/AuthForms";

export const metadata = { title: "Verify your email | OpenRaiz" };

async function VerifyContent({ searchParams }) {
  const { email } = await searchParams;
  return <VerifyForm email={typeof email === "string" ? email : ""} />;
}

export default function VerifyPage({ searchParams }) {
  return (
    <>
      <main id="main-content" tabIndex={-1} className="page-main auth-page">
        <h1>Verify your email</h1>
        <p className="page-intro">Enter the code we emailed you. You need a verified email before you can post.</p>
        <Suspense fallback={<p className="state-message">Loading&hellip;</p>}>
          <VerifyContent searchParams={searchParams} />
        </Suspense>
      </main>
    </>
  );
}
