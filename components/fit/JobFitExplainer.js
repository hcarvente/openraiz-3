"use client";

// "See how your experience fits": the visitor types a little about their experience and gets, from the server, where it
// connects to this listing, what the text does not show, questions for the employer and things to practice. It is practice
// and information, not a decision. Nothing is stored. The words come in as `copy`; results are announced politely
// (aria-live) so screen-reader users hear them.
import { useEffect, useRef, useState } from "react";
import { fill } from "@/lib/i18n/dictionaries";

const MAX = 1000;

export default function JobFitExplainer({ listingId, lang, copy }) {
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);
  const resultRef = useRef(null);

  useEffect(() => {
    if ((result || error) && resultRef.current) resultRef.current.focus();
  }, [result, error]);

  async function submit(event) {
    event.preventDefault();
    if (busy) return;
    setBusy(true);
    setError("");
    setResult(null);
    try {
      const response = await fetch("/api/job-fit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ opportunityId: listingId, text, lang }),
      });
      const data = await response.json().catch(() => null);
      if (response.status === 200 && data?.result) {
        setResult(data.result);
      } else if (response.status === 400 && Array.isArray(data?.details)) {
        const first = data.details[0];
        setError(copy.errors[first?.code] ?? copy.errors.invalid);
      } else {
        const message = copy.errors[data?.error] ?? copy.errors.server;
        setError(data?.retryAfterSeconds ? fill(message, { seconds: data.retryAfterSeconds }) : message);
      }
    } catch {
      setError(copy.errors.NETWORK);
    }
    setBusy(false);
  }

  const list = (heading, items, hint) =>
    items.length > 0 ? (
      <section>
        <h3>{heading}</h3>
        {hint ? <p className="field-hint">{hint}</p> : null}
        <ul>
          {items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>
    ) : null;

  return (
    <div className="job-fit">
      <p>{copy.intro}</p>
      <form className="opportunity-form" onSubmit={submit} noValidate>
        <div className="field">
          <label htmlFor="fit-text">{copy.label}</label>
          <textarea
            id="fit-text"
            rows={5}
            maxLength={MAX}
            value={text}
            onChange={(event) => setText(event.target.value)}
            aria-describedby="fit-hint fit-count"
          />
          <p className="field-hint" id="fit-hint">
            {copy.privacy}
          </p>
          <p className="field-hint" id="fit-count">
            {fill(copy.counter, { count: text.length, max: MAX })}
          </p>
        </div>
        <button className="button button-primary" type="submit" disabled={busy}>
          {busy ? copy.submitting : copy.submit}
        </button>
      </form>

      <div aria-live="polite" ref={resultRef} tabIndex={-1} className="job-fit-results">
        {error ? <p className="form-summary">{error}</p> : null}
        {result ? (
          <>
            <h3 className="job-fit-title">{copy.resultsHeading}</h3>
            {list(copy.strengthsHeading, result.strengths)}
            {list(copy.notEstablishedHeading, result.notEstablished, copy.notEstablishedHint)}
            {list(copy.questionsHeading, result.employerQuestions)}
            {list(copy.practiceHeading, result.practiceTopics)}
            <p className="page-note">{copy.disclaimer}</p>
          </>
        ) : null}
      </div>
    </div>
  );
}
