"use client";

// The review controls for one listing in the admin queue: the translation form, Approve, Save translation and Reject.
// Everything is sent to the admin routes (/api/admin/listings/[id]/...), which check the admin again on the server.
// Admin pages are English only.
import { useState } from "react";

const EMPTY = (initial) => ({
  title: initial?.title ?? "", summary: initial?.summary ?? "", description: initial?.description ?? "", requirements: initial?.requirements ?? "",
});

export default function ReviewPanel({ listingId, targetLanguage, initialTranslation, canApprove, canReject, queuePath }) {
  const [translation, setTranslation] = useState(EMPTY(initialTranslation));
  const [reason, setReason] = useState("");
  const [busy, setBusy] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});
  const [rejecting, setRejecting] = useState(false);
  const [draftFilled, setDraftFilled] = useState(false);

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

  // Asks the AI for a DRAFT translation and puts it in the form below. Nothing is saved: the admin reads it, edits it, and then
  // uses Save translation or Approve.
  const DRAFT_ERRORS = {
    aiDisabled: "AI is switched off right now.",
    tooFast: "Please wait a moment and try again.",
    dailyLimit: "Today's limit for translation drafts has been reached.",
    RATE_LIMITED: "The AI is busy. Wait a little and try again.",
    TIMEOUT: "That took too long. Please try again.",
    NETWORK: "We couldn't reach the AI. Please try again.",
    SERVER_CONFIG: "The AI isn't set up right now.",
    AI_UNAVAILABLE: "The AI is having trouble right now. Please try again soon.",
    INVALID_OUTPUT: "The AI's draft didn't pass our checks (for example it changed a number or added a link). Please try again.",
  };

  async function translateWithAi() {
    if (busy) return;
    const hasText = Object.values(translation).some((value) => value.trim() !== "");
    if (hasText && !window.confirm("Replace what is in the translation form with an AI draft?")) return;
    setBusy("draft");
    setMessage("");
    setErrors({});
    setDraftFilled(false);
    try {
      const response = await fetch(`${base}/translate-draft`, { method: "POST" });
      const data = await response.json().catch(() => null);
      if (response.status === 200 && data?.result) {
        setTranslation({
          title: data.result.title ?? "",
          summary: data.result.summary ?? "",
          description: data.result.description ?? "",
          requirements: data.result.requirements ?? "",
        });
        setDraftFilled(true);
        setMessage("AI draft filled in below. Read it carefully and fix anything before you save or approve. Nothing is saved yet.");
      } else {
        setMessage(DRAFT_ERRORS[data?.error] ?? data?.error ?? "Something went wrong. Please try again.");
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
        <p className="field-hint">Write it yourself, or use <strong>Translate with AI</strong> to get a draft. An AI draft is never published until you read it and save it. Title and description are both needed to save a translation; summary and requirements may be left empty.</p>
        {draftFilled ? <p className="form-notice" role="note">This is an AI draft. Check names, numbers, dates and the tone before saving.</p> : null}
        <div className="form-grid">
          {field("title", "Title", 1)}
          {field("summary", "Short summary", 2)}
          {field("description", "Description", 6)}
          {field("requirements", "Requirements", 3)}
        </div>
        <div className="form-actions">
          <button type="button" className="button button-secondary" disabled={Boolean(busy)} onClick={translateWithAi}>
            {busy === "draft" ? "Translating…" : "Translate with AI"}
          </button>
          <button type="button" className="button button-primary" disabled={Boolean(busy)} onClick={() => send("save", `${base}/translation`, "PUT", { translation })}>
            {busy === "save" ? "Saving…" : "Save translation"}
          </button>
        </div>
      </section>

      {canApprove || canReject ? (
        <section className="form-section" aria-labelledby="decision-heading">
          <h2 id="decision-heading">Decision</h2>
          <div className="form-actions">
            {canApprove ? (
              <button type="button" className="button button-primary" disabled={Boolean(busy)} onClick={() => send("approve", `${base}/approve`, "POST", { translation })}>
                {busy === "approve" ? "Approving…" : "Approve and publish"}
              </button>
            ) : null}
            {canReject && !rejecting ? (
              <button type="button" className="button button-danger" disabled={Boolean(busy)} onClick={() => setRejecting(true)}>
                {canApprove ? "Reject…" : "Take down…"}
              </button>
            ) : null}
          </div>
          {canApprove ? (
            <p className="field-hint">If you filled in the translation, approving also saves it. Leave it empty to publish without one.</p>
          ) : (
            <p className="field-hint">This listing is public. Taking it down hides it and sends the reason to the poster.</p>
          )}

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
