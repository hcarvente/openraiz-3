// SPIKE (Step 3): a throwaway page to test Neon Auth. Delete it when the real sign-in pages exist (Step 4).
// Reading the session uses cookies, so it must sit inside <Suspense> (Cache Components).
import { Suspense } from "react";
import { auth } from "@/lib/auth/server";
import { signUp, verifyEmail, signIn, signOut } from "./actions";

async function SessionInfo({ searchParams }) {
  const { msg } = await searchParams;
  const { data: session, error } = await auth.getSession();
  const user = session?.user;
  return (
    <>
      {msg ? <p role="status">{msg}</p> : null}
      <pre>
        {JSON.stringify(
          {
            signedIn: Boolean(user),
            email: user?.email ?? null,
            emailVerified: user?.emailVerified ?? null,
            sessionError: error?.message ?? null,
          },
          null,
          2,
        )}
      </pre>
    </>
  );
}

export default function AuthSpike({ searchParams }) {
  return (
    <main className="page-main">
      <h1>Auth spike</h1>
      <Suspense fallback={<p>Loading session&hellip;</p>}>
        <SessionInfo searchParams={searchParams} />
      </Suspense>

      <h2>1. Sign up</h2>
      <form action={signUp}>
        <p><label>Name <input name="name" required /></label></p>
        <p><label>Email <input name="email" type="email" required /></label></p>
        <p><label>Password <input name="password" type="password" minLength={8} required /></label></p>
        <button type="submit">Sign up</button>
      </form>

      <h2>2. Verify email with the code you received</h2>
      <form action={verifyEmail}>
        <p><label>Email <input name="email" type="email" required /></label></p>
        <p><label>Code <input name="otp" inputMode="numeric" required /></label></p>
        <button type="submit">Verify</button>
      </form>

      <h2>3. Sign in</h2>
      <form action={signIn}>
        <p><label>Email <input name="email" type="email" required /></label></p>
        <p><label>Password <input name="password" type="password" required /></label></p>
        <button type="submit">Sign in</button>
      </form>

      <h2>4. Sign out</h2>
      <form action={signOut}>
        <button type="submit">Sign out</button>
      </form>
    </main>
  );
}
