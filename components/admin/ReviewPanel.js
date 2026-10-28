"use client";

// The review controls for one listing in the admin queue: the translation form, Approve, Save translation and Reject.
// Everything is sent to the admin routes (/api/admin/listings/[id]/...), which check the admin again on the server.
// Admin pages are English only.
import { useState } from "react";

const EMPTY = (initial) => ({
  title: initial?.title ?? "", summary: initial?.summary ?? "", description: initial?.description ?? "", requirements: initial?.requirements ?? "",
});

export default function ReviewPanel({ listingId, targetLanguage, initialTranslation, canApprove, queuePath }) {
  const [translation, setTranslation] = useState(EMPTY(initialTranslation));
  const [reason, setReason] = useState("");
  const [busy, setBusy] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});
  const [rejecting, setRejecting] = useState(false);

  const set = (name, value) => setTranslation((current) => ({ ...current, [name]: value }));
  const base = `/api/admin/listings/${encodeURIComponent(listingId)}`;

  async function send(action, url, method, body) {
    if (busy) return;
    setBusy(action);
    setMessage("");
    setErrors({});
    try {
      const response = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      const data = await response.json().catch(() => null);
      if (response.status === 200) {
        if (action === "save") {
          setMessage("Translation saved.");
          setBusy("");
          return;
        }
        window.location.assign(queuePath); // approved or rejected: back to the queue
        return;
      }
      if (data?.details) {
        setErrors(Object.fromEntries(data.details.map((d) => [d.field, d.message])));
        setMessage(data.error ?? "Please fix the problems below.");
      } else {
        setMessage(data?.error ?? "Something went wrong. Please try again.");
      }
    } catch {
      setMessage("We couldn't reach the server. Please try again.");
    }
    setBusy("");
  }

  const field = (name, label, rows, hint) => (
    <div className={`field${errors[name] ? " has-error" : ""}`}>
      <label htmlFor={`tr-${name}`}>{label}</label>
      {rows === 1 ? (
        <input id={`tr-${name}`} type="text" value={translation[name]} onChange={(e) => set(name, e.target.value)} aria-invalid={errors[name] ? "true" : undefined} />
      ) : (
        <textarea id={`tr-${name}`} rows={rows} value={translation[name]} onChange={(e) => set(name, e.target.value)} aria-invalid={errors[name] ? "true" : undefined} />
      )}
      {hint ? <p className="field-hint">{hint}</p> : null}
      {errors[name] ? <p className="field-error">{errors[name]}</p> : null}
    </div>
  );

  return (
    <div className="opportunity-form review-panel">
      {message ? (
        <p className={errors.reason || Object.keys(errors).length ? "form-summary" : "form-notice"} role="alert">
          {message}
        </p>
      ) : null}

      <section className="form-section" aria-labelledby="translation-heading">
        <h2 id="translation-heading">Translation into {targetLanguage} (optional)</h2>
        <p className="field-hint">Write it yourself. Title and description are both needed to save a translation; summary and requirements may be left empty.</p>
        <div className="form-grid">
          {field("title", "Title", 1)}
          {field("summary", "Short summary", 2)}
          {field("description", "Description", 6)}
          {field("requirements", "Requirements", 3)}
        </div>
        <div className="form-actions">
          <button type="button" className="button button-secondary" disabled={Boolean(busy)} onClick={() => send("save", `${base}/translation`, "PUT", { translation })}>
            {busy === "save" ? "Saving…" : "Save translation"}
          </button>
        </div>
      </section>

      {canApprove ? (
        <section className="form-section" aria-labelledby="decision-heading">
          <h2 id="decision-heading">Decision</h2>
          <div className="form-actions">
            <button type="button" className="button button-primary" disabled={Boolean(busy)} onClick={() => send("approve", `${base}/approve`, "POST", { translation })}>
              {busy === "approve" ? "Approving…" : "Approve and publish"}
            </button>
            {!rejecting ? (
              <button type="button" className="button button-danger" disabled={Boolean(busy)} onClick={() => setRejecting(true)}>
                Reject…
              </button>
            ) : null}
          </div>
          <p className="field-hint">If you filled in the translation, approving also saves it. Leave it empty to publish without one.</p>

          {rejecting ? (
            <div className="withdraw-confirm" role="group" aria-label="Reject this listing">
              <div className={`field${errors.reason ? " has-error" : ""}`}>
                <label htmlFor="reject-reason">Reason (the poster will read this)</label>
                <textarea id="reject-reason" rows={3} value={reason} maxLength={500} onChange={(e) => setReason(e.target.value)} aria-invalid={errors.reason ? "true" : undefined} />
                {errors.reason ? <p className="field-error">{errors.reason}</p> : null}
              </div>
              <button type="button" className="button button-danger-solid button-small" disabled={Boolean(busy)} onClick={() => send("reject", `${base}/reject`, "POST", { reason })}>
                {busy === "reject" ? "Rejecting…" : "Send rejection"}
              </button>{" "}
              <button type="button" className="button button-secondary button-small" disabled={Boolean(busy)} onClick={() => setRejecting(false)}>
                Cancel
              </button>
            </div>
          ) : null}
        </section>
      ) : null}
    </div>
  );
}
