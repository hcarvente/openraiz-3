"use client";

// "Report this listing": a reason and an optional note, sent to POST /api/listings/[id]/reports. The server decides
// everything (lib/reportListing.js). The words come in as `copy`.
import { useEffect, useRef, useState } from "react";

export default function ReportForm({ listingId, copy }) {
  const [reason, setReason] = useState("");
  const [note, setNote] = useState("");
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
      const body = { reason };
      if (note.trim()) body.note = note;
      const response = await fetch(`/api/listings/${encodeURIComponent(listingId)}/reports`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (response.status === 201) {
        setSent(true);
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
    <form className="opportunity-form" onSubmit={submit} noValidate>
      {formError ? (
        <div className="form-summary" role="alert" tabIndex={-1} ref={summaryRef}>
          <p>{formError}</p>
        </div>
      ) : null}
      <div className={`field${fieldErrors.reason ? " has-error" : ""}`}>
        <label htmlFor="report-reason">{copy.reasonLabel}</label>
        <select
          id="report-reason"
          value={reason}
          onChange={(event) => setReason(event.target.value)}
          aria-invalid={fieldErrors.reason ? "true" : undefined}
          aria-describedby={fieldErrors.reason ? "report-reason-error" : undefined}
        >
          <option value="">{copy.choose}</option>
          {Object.entries(copy.reasons).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
        {fieldErrors.reason ? (
          <p className="field-error" id="report-reason-error">
            {fieldErrors.reason}
          </p>
        ) : null}
      </div>
      <div className={`field${fieldErrors.note ? " has-error" : ""}`}>
        <label htmlFor="report-note">{copy.note}</label>
        <textarea
          id="report-note"
          rows={3}
          maxLength={500}
          value={note}
          onChange={(event) => setNote(event.target.value)}
          aria-describedby={`report-note-hint${fieldErrors.note ? " report-note-error" : ""}`}
        />
        <p className="field-hint" id="report-note-hint">
          {copy.noteHint}
        </p>
        {fieldErrors.note ? (
          <p className="field-error" id="report-note-error">
            {fieldErrors.note}
          </p>
        ) : null}
      </div>
      <button className="button button-secondary" type="submit" disabled={busy}>
        {busy ? copy.sending : copy.send}
      </button>
    </form>
  );
}
