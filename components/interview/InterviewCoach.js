"use client";

// The practice interview: pick a kind of interview (or, when practicing for a listing, go straight in), answer three questions one
// at a time, then get coaching. It is practice, not a decision. Nothing is stored. The words come in as `copy`. The server
// builds the questions again from the category or the listing id, so only the answers are sent. The focus moves to each new
// step and the results are announced politely (aria-live), so screen-reader users hear them.
import { useEffect, useRef, useState } from "react";
import { fill } from "@/lib/i18n/dictionaries";
import { CATEGORIES, MAX_ANSWER_CHARS, MIN_ANSWER_CHARS, QUESTIONS_PER_INTERVIEW, buildQuestions } from "@/lib/interview/questions";

const EMPTY = Array.from({ length: QUESTIONS_PER_INTERVIEW }, () => "");

export default function InterviewCoach({ lang, role, copy }) {
  const [categoryId, setCategoryId] = useState(role ? null : CATEGORIES[0].id);
  const [step, setStep] = useState(role ? 1 : 0); // 0 = choose, 1..3 = questions, 4 = results
  const [answers, setAnswers] = useState(EMPTY);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);
  const headingRef = useRef(null);

  const questions = role ? role.questions : buildQuestions({ lang, categoryId }) ?? [];
  const current = step - 1;
  const text = answers[current] ?? "";
  const length = text.trim().length;

  // Move the focus to the new question or the results, but not when the page first loads (that would steal it from the skip link).
  const firstRender = useRef(true);
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    if (headingRef.current) headingRef.current.focus();
  }, [step, result]);

  function setAnswer(value) {
    setAnswers((all) => all.map((a, i) => (i === current ? value : a)));
    setError("");
  }

  function restart() {
    setAnswers(EMPTY);
    setResult(null);
    setError("");
    setStep(role ? 1 : 0);
  }

  async function submit() {
    if (busy) return;
    setBusy(true);
    setError("");
    try {
      const response = await fetch("/api/interview/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(role ? { lang, opportunityId: role.id, answers } : { lang, category: categoryId, answers }),
      });
      const data = await response.json().catch(() => null);
      if (response.status === 200 && data?.result) {
        setResult(data.result);
        setStep(4);
      } else if (response.status === 400 && Array.isArray(data?.details)) {
        setError(copy.errors[data.details[0]?.code] ?? copy.errors.invalid);
      } else {
        const message = copy.errors[data?.error] ?? copy.errors.server;
        setError(data?.retryAfterSeconds ? fill(message, { seconds: data.retryAfterSeconds }) : message);
      }
    } catch {
      setError(copy.errors.NETWORK);
    }
    setBusy(false);
  }

  function next() {
    if (length < MIN_ANSWER_CHARS) {
      setError(copy.errors.tooShort);
      return;
    }
    if (step < QUESTIONS_PER_INTERVIEW) setStep(step + 1);
    else submit();
  }

  const list = (heading, items) => (
    <section>
      <h3>{heading}</h3>
      <ul>
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
  );

  if (step === 0) {
    return (
      <div className="coach">
        <p>{copy.privacy}</p>
        <form
          className="opportunity-form"
          onSubmit={(event) => {
            event.preventDefault();
            setStep(1);
          }}
        >
          <fieldset className="radio-group field">
            <legend ref={headingRef} tabIndex={-1}>
              {copy.chooseHeading}
            </legend>
            {CATEGORIES.map((category) => (
              <label className="radio-option coach-choice" key={category.id}>
                <input type="radio" name="category" value={category.id} checked={categoryId === category.id} onChange={() => setCategoryId(category.id)} />
                <span>
                  <strong>{category.label[lang]}</strong>
                  <span className="field-hint">{category.description[lang]}</span>
                </span>
              </label>
            ))}
          </fieldset>
          <button className="button button-primary" type="submit">
            {copy.start}
          </button>
        </form>
      </div>
    );
  }

  if (step === 4 && result) {
    const improvedNumber = result.improvedAnswer.questionNumber;
    return (
      <div className="coach" aria-live="polite">
        <h2 ref={headingRef} tabIndex={-1} className="coach-title">
          {result.title}
        </h2>
        <p>{result.overall}</p>
        {list(copy.strengthsHeading, result.strengths)}
        {list(copy.improvementsHeading, result.improvements)}
        <section>
          <h3>{fill(copy.improvedHeading, { number: improvedNumber })}</h3>
          <p className="field-hint">{questions[improvedNumber - 1]}</p>
          <blockquote className="coach-improved">{result.improvedAnswer.text}</blockquote>
        </section>
        <p className="page-note">{copy.disclaimer}</p>
        <button className="button" type="button" onClick={restart}>
          {copy.tryAgain}
        </button>
      </div>
    );
  }

  return (
    <div className="coach">
      {role ? <p className="field-hint">{fill(copy.practicingFor, { title: role.title, organization: role.organization })}</p> : null}
      <p className="field-hint">{copy.privacy}</p>
      <form
        className="opportunity-form"
        onSubmit={(event) => {
          event.preventDefault();
          next();
        }}
        noValidate
      >
        <p className="coach-progress">{fill(copy.progress, { current: step, total: QUESTIONS_PER_INTERVIEW })}</p>
        <div className="field">
          <label htmlFor="coach-answer">
            <span ref={headingRef} tabIndex={-1} className="coach-question">
              {questions[current]}
            </span>
          </label>
          <textarea
            id="coach-answer"
            rows={6}
            maxLength={MAX_ANSWER_CHARS}
            value={text}
            onChange={(event) => setAnswer(event.target.value)}
            aria-describedby="coach-count"
            aria-invalid={error ? "true" : undefined}
          />
          <p className="field-hint" id="coach-count">
            {fill(copy.counter, { count: text.length, max: MAX_ANSWER_CHARS })}
          </p>
        </div>
        <div aria-live="polite">
          {error ? <p className="form-summary">{error}</p> : null}
          {busy ? <p className="field-hint">{copy.wait}</p> : null}
        </div>
        <div className="coach-actions">
          {step > 1 ? (
            <button className="button" type="button" disabled={busy} onClick={() => setStep(step - 1)}>
              {copy.back}
            </button>
          ) : null}
          <button className="button button-primary" type="submit" disabled={busy}>
            {busy ? copy.submitting : step < QUESTIONS_PER_INTERVIEW ? copy.next : copy.finish}
          </button>
        </div>
      </form>
    </div>
  );
}
