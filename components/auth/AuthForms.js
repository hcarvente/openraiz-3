"use client";

// The sign-up, verify, sign-in and finish-profile forms. They are Client Components only so they can show the
// server's answer (errors or a message) without leaving the page; the checks and the saving happen in
// app/auth/actions.js. A password is never sent back to the form.
import { useActionState, useState } from "react";
import { useParams } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import {
  completeProfileAction,
  resendCodeAction,
  signInAction,
  signUpAction,
  verifyAction,
} from "@/app/[lang]/auth/actions";

function Field({ name, label, type = "text", state, defaultValue, autoComplete, hint, required = true, ...rest }) {
  const error = state?.errors?.[name];
  const hintId = `${name}-hint`;
  const errorId = `${name}-error`;
  return (
    <div className={`field${error ? " has-error" : ""}`}>
      <label htmlFor={name}>{label}</label>
      <input
        id={name}
        name={name}
        type={type}
        defaultValue={defaultValue ?? state?.values?.[name] ?? ""}
        autoComplete={autoComplete}
        required={required}
        aria-invalid={error ? "true" : undefined}
        aria-describedby={[hint ? hintId : null, error ? errorId : null].filter(Boolean).join(" ") || undefined}
        {...rest}
      />
      {hint ? (
        <p className="field-hint" id={hintId}>
          {hint}
        </p>
      ) : null}
      {error ? (
        <p className="field-error" id={errorId}>
          {error}
        </p>
      ) : null}
    </div>
  );
}

// Every form tells the server which language it is in, so the next page is in the same language.
function LangField() {
  const params = useParams();
  return <input type="hidden" name="lang" value={isLocale(params?.lang) ? params.lang : "en"} />;
}

function FormMessage({ state }) {
  if (state?.message) {
    return (
      <p className="form-summary" role="alert">
        {state.message}
      </p>
    );
  }
  if (state?.notice) {
    return (
      <p className="form-notice" role="status">
        {state.notice}
      </p>
    );
  }
  return null;
}

// Individual or organization, with the organization name shown only for organizations.
function RoleChoice({ state }) {
  const [role, setRole] = useState(state?.values?.role ?? "individual");
  const roleError = state?.errors?.role;
  return (
    <>
      <div className={`field${roleError ? " has-error" : ""}`}>
        <fieldset className="radio-group" aria-describedby={roleError ? "role-error" : undefined}>
          <legend>I am signing up as</legend>
          <label className="radio-option">
            <input type="radio" name="role" value="individual" checked={role === "individual"} onChange={() => setRole("individual")} />
            An individual
          </label>
          <label className="radio-option">
            <input type="radio" name="role" value="organization" checked={role === "organization"} onChange={() => setRole("organization")} />
            An organization
          </label>
        </fieldset>
        {roleError ? (
          <p className="field-error" id="role-error">
            {roleError}
          </p>
        ) : null}
      </div>
      {role === "organization" ? (
        <Field name="orgName" label="Organization name" state={state} autoComplete="organization" maxLength={150} />
      ) : null}
    </>
  );
}

export function SignUpForm() {
  const [state, action, pending] = useActionState(signUpAction, null);
  return (
    <form className="auth-form" action={action} noValidate>
      <LangField />
      <FormMessage state={state} />
      <Field name="name" label="Your name" state={state} autoComplete="name" maxLength={100} />
      <Field name="email" label="Email" type="email" state={state} autoComplete="email" maxLength={254} />
      <Field
        name="password"
        label="Password"
        type="password"
        state={state}
        autoComplete="new-password"
        minLength={8}
        maxLength={128}
        hint="At least 8 characters."
      />
      <RoleChoice state={state} />
      <button className="button button-primary" type="submit" disabled={pending}>
        {pending ? "Creating account…" : "Create account"}
      </button>
    </form>
  );
}

export function VerifyForm({ email }) {
  const [state, action, pending] = useActionState(verifyAction, null);
  const [resendState, resendAction, resending] = useActionState(resendCodeAction, null);
  return (
    <>
      <form className="auth-form" action={action} noValidate>
        <LangField />
        <FormMessage state={state} />
        <Field name="email" label="Email" type="email" state={state} defaultValue={email} autoComplete="email" />
        <Field name="otp" label="Code from your email" state={state} autoComplete="one-time-code" inputMode="numeric" maxLength={12} />
        <button className="button button-primary" type="submit" disabled={pending}>
          {pending ? "Checking…" : "Verify email"}
        </button>
      </form>
      <form className="auth-form auth-secondary" action={resendAction} noValidate>
        <LangField />
        <FormMessage state={resendState} />
        <input type="hidden" name="email" value={state?.values?.email ?? email ?? ""} />
        <p className="field-hint">Didn&rsquo;t get a code? Check your spam folder, then ask for a new one.</p>
        <button className="button button-secondary" type="submit" disabled={resending}>
          {resending ? "Sending…" : "Send a new code"}
        </button>
      </form>
    </>
  );
}

export function SignInForm({ next }) {
  const [state, action, pending] = useActionState(signInAction, null);
  return (
    <form className="auth-form" action={action} noValidate>
      <LangField />
      <FormMessage state={state} />
      <input type="hidden" name="next" value={next ?? ""} />
      <Field name="email" label="Email" type="email" state={state} autoComplete="email" />
      <Field name="password" label="Password" type="password" state={state} autoComplete="current-password" />
      <button className="button button-primary" type="submit" disabled={pending}>
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}

export function CompleteProfileForm() {
  const [state, action, pending] = useActionState(completeProfileAction, null);
  return (
    <form className="auth-form" action={action} noValidate>
      <LangField />
      <FormMessage state={state} />
      <RoleChoice state={state} />
      <button className="button button-primary" type="submit" disabled={pending}>
        {pending ? "Saving…" : "Save profile"}
      </button>
    </form>
  );
}
