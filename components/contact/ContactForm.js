"use client";

// The "Contact the poster" box on a listing that uses contact through OpenRaiz. A Client Component only so it can show the
// result in place. It sends JSON to POST /api/listings/[id]/messages; the server decides everything (lib/sendMessage.js).
// The words come in as `copy`.
import { useEffect, useRef, useState } from "react";
import { fill } from "@/lib/i18n/dictionaries";

export default function ContactForm({ listingId, senderName, copy }) {
  const [message, setMessage] = useState("");
  const [contact, setContact] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const summaryRef = useRef(null);

  useEffect(() => {
    if (formError && summaryRef.current) summaryRef.current.focus();
  }, [formError]);

  async function submit(event) {
    event.preventDefault();
    if (busy) return;
    setBusy(true);
    setFormError("");
    setFieldErrors({});
    try {
      const body = { message };
      if (contact.trim()) body.contact = contact;
      const response = await fetch(`/api/listings/${encodeURIComponent(listingId)}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (response.status === 201) {
        setSent(true);
        setMessage("");
        setContact("");
        setBusy(false);
        return;
      }
      const data = await response.json().catch(() => null);
      if (response.status === 400 && data && Array.isArray(data.details)) {
        setFieldErrors(Object.fromEntries(data.details.map(({ field, code }) => [field, copy.errors[code] ?? copy.errors.invalid])));
        setFormError(copy.errorSummary);
      } else {
        setFormError(copy.serverErrors[data?.error] ?? copy.serverErrors.server);
      }
    } catch {
      setFormError(copy.serverErrors.network);
    }
    setBusy(false);
  }

  if (sent) {
    return (
      <p className="form-notice" role="status">
        {copy.sent}
      </p>
    );
  }

  return (
    <form className="opportunity-form contact-form" onSubmit={submit} noValidate>
      {formError ? (
        <div className="form-summary" role="alert" tabIndex={-1} ref={summaryRef}>
          <p>{formError}</p>
        </div>
      ) : null}
      <div className={`field${fieldErrors.message ? " has-error" : ""}`}>
        <label htmlFor="contact-message">{copy.message}</label>
        <textarea
          id="contact-message"
          rows={5}
          maxLength={1000}
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          aria-invalid={fieldErrors.message ? "true" : undefined}
          aria-describedby={`contact-message-hint${fieldErrors.message ? " contact-message-error" : ""}`}
        />
        <p className="field-hint" id="contact-message-hint">
          {copy.messageHint}
        </p>
        {fieldErrors.message ? (
          <p className="field-error" id="contact-message-error">
            {fieldErrors.message}
          </p>
        ) : null}
      </div>
      <div className={`field${fieldErrors.contact ? " has-error" : ""}`}>
        <label htmlFor="contact-reach">{copy.contactLabel}</label>
        <input
          id="contact-reach"
          type="text"
          maxLength={200}
          value={contact}
          onChange={(event) => setContact(event.target.value)}
          autoComplete="off"
          aria-describedby={`contact-reach-hint${fieldErrors.contact ? " contact-reach-error" : ""}`}
        />
        <p className="field-hint" id="contact-reach-hint">
          {copy.contactHint}
        </p>
        {fieldErrors.contact ? (
          <p className="field-error" id="contact-reach-error">
            {fieldErrors.contact}
          </p>
        ) : null}
      </div>
      <p className="page-note">{fill(copy.nameNotice, { name: senderName })}</p>
      <button className="button button-primary" type="submit" disabled={busy}>
        {busy ? copy.sending : copy.send}
      </button>
    </form>
  );
}
