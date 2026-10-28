"use client";

// The form people use to post an opportunity. It is short on purpose: the poster's name, today's date, the status and
// most other details are filled in by the server. A Client Component only because it reacts to choices (for example the
// event date appears for workshops and events) and shows the server's answer in place. It never touches the database:
// it sends JSON to POST /api/posts, and the server decides everything (see lib/submitPost.js).
// The words come in as `copy` (the dictionary for the page's language, "post" group) because this file runs in the browser.
import { useEffect, useRef, useState } from "react";
import { allowsEventDate } from "@/lib/opportunityTaxonomy";
import { EMPTY_POST_VALUES, buildPostBody } from "@/lib/postFormValues";
import { fill } from "@/lib/i18n/dictionaries";

function Field({ name, label, hint, error, wide, children }) {
  const hintId = `${name}-hint`;
  const errorId = `${name}-error`;
  return (
    <div className={`field${wide ? " field-wide" : ""}${error ? " has-error" : ""}`}>
      <label htmlFor={name}>{label}</label>
      {children({
        id: name,
        name,
        "aria-invalid": error ? "true" : undefined,
        "aria-describedby": [hint ? hintId : null, error ? errorId : null].filter(Boolean).join(" ") || undefined,
      })}
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

function Radios({ legend, name, value, onChange, options, error }) {
  return (
    <div className={`field${error ? " has-error" : ""}`}>
      <fieldset className="radio-group" aria-describedby={error ? `${name}-error` : undefined}>
        <legend>{legend}</legend>
        {options.map(([optionValue, label]) => (
          <label className="radio-option" key={optionValue}>
            <input type="radio" name={name} value={optionValue} checked={value === optionValue} onChange={() => onChange(optionValue)} />
            {label}
          </label>
        ))}
      </fieldset>
      {error ? (
        <p className="field-error" id={`${name}-error`}>
          {error}
        </p>
      ) : null}
    </div>
  );
}

export default function PostForm({
  lang, successPath, role, allowedTypes, displayName, copy, typeLabels, categoryLabels, relevanceLabels,
  mode = "create", listingId, initialValues, initialLang, notice,
}) {
  const isEdit = mode === "edit";
  const [values, setValues] = useState(
    initialValues ?? { ...EMPTY_POST_VALUES, type: allowedTypes.length === 1 ? allowedTypes[0] : "" },
  );
  const [textLang, setTextLang] = useState(initialLang ?? lang);
  const [fieldErrors, setFieldErrors] = useState({}); // { fieldName: "message" }
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const summaryRef = useRef(null);

  useEffect(() => {
    if (formError && summaryRef.current) summaryRef.current.focus();
  }, [formError]);

  const set = (name, value) => setValues((current) => ({ ...current, [name]: value }));
  const bind = (name) => ({ value: values[name], onChange: (event) => set(name, event.target.value) });
  const err = (name) => fieldErrors[name];

  const hasPlace = values.locationType === "onsite" || values.locationType === "hybrid";
  const showEventDate = allowsEventDate(values.type);
  const showDeadline = values.type !== "" && !showEventDate && values.type !== "resource";

  async function handleSubmit(event) {
    event.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setFormError("");
    setFieldErrors({});

    try {
      const response = await fetch(isEdit ? `/api/posts/${encodeURIComponent(listingId)}` : "/api/posts", {
        method: isEdit ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(buildPostBody(values, textLang)),
      });
      if (response.status === (isEdit ? 200 : 201)) {
        // A full page load, so the account page reads fresh data. The button stays disabled while the browser navigates.
        window.location.assign(successPath);
        return;
      }
      const data = await response.json().catch(() => null);
      if (response.status === 400 && data && Array.isArray(data.details)) {
        const messages = {};
        for (const { field, code } of data.details) messages[field] = copy.errors[code] ?? copy.errors.invalid;
        setFieldErrors(messages);
        setFormError(copy.errorSummary);
      } else {
        setFormError(copy.serverErrors[data?.error] ?? copy.serverErrors.server);
      }
    } catch {
      setFormError(copy.serverErrors.network);
    }
    setSubmitting(false);
  }

  const locationOptions = [["remote", copy.remote], ["onsite", copy.onsite], ["hybrid", copy.hybrid]];
  const howOptions = [["platform", copy.viaOpenRaiz], ["url", copy.viaLink], ...(role === "organization" ? [["email", copy.viaEmail]] : [])];

  return (
    <form className="opportunity-form" onSubmit={handleSubmit} noValidate>
      {notice ? (
        <p className="form-notice" role="note">
          {notice}
        </p>
      ) : null}

      {formError ? (
        <div className="form-summary" role="alert" tabIndex={-1} ref={summaryRef}>
          <p>{formError}</p>
        </div>
      ) : null}

      <section className="form-section" aria-labelledby="post-basics">
        <h2 id="post-basics">{copy.heading}</h2>
        <div className="form-grid">
          <Field name="type" label={copy.type} error={err("type")}>
            {(p) => (
              <select {...p} {...bind("type")}>
                <option value="">{copy.chooseType}</option>
                {allowedTypes.map((type) => (
                  <option key={type} value={type}>
                    {typeLabels[type]}
                  </option>
                ))}
              </select>
            )}
          </Field>

          <Field name="lang" label={copy.lang} hint={copy.langHint} error={err("lang")}>
            {(p) => (
              <select {...p} value={textLang} onChange={(event) => setTextLang(event.target.value)}>
                <option value="en">English</option>
                <option value="es">Español</option>
              </select>
            )}
          </Field>

          <Field name="title" label={copy.title} wide error={err("title")}>
            {(p) => <input type="text" {...p} {...bind("title")} maxLength={200} />}
          </Field>

          <Field name="description" label={copy.description} hint={copy.descriptionHint} wide error={err("description")}>
            {(p) => <textarea rows={6} {...p} {...bind("description")} maxLength={5000} />}
          </Field>

          {showEventDate ? (
            <Field name="eventDate" label={copy.eventDate} hint={copy.eventDateHint} error={err("eventDate")}>
              {(p) => <input type="date" {...p} {...bind("eventDate")} />}
            </Field>
          ) : null}
          {showDeadline ? (
            <Field name="deadline" label={copy.deadline} hint={copy.deadlineHint} error={err("deadline")}>
              {(p) => <input type="date" {...p} {...bind("deadline")} />}
            </Field>
          ) : null}
        </div>
      </section>

      <section className="form-section" aria-labelledby="post-where">
        <h2 id="post-where">{copy.whereLegend}</h2>
        <div className="form-grid">
          <Radios legend={copy.whereLegend} name="locationType" value={values.locationType} onChange={(v) => set("locationType", v)} options={locationOptions} error={err("locationType")} />
          {hasPlace ? (
            <>
              <Field name="city" label={copy.city} error={err("city")}>
                {(p) => <input type="text" {...p} {...bind("city")} maxLength={100} autoComplete="address-level2" />}
              </Field>
              <Field name="state" label={copy.state} error={err("state")}>
                {(p) => <input type="text" {...p} {...bind("state")} maxLength={100} autoComplete="address-level1" />}
              </Field>
            </>
          ) : null}
        </div>
      </section>

      <section className="form-section" aria-labelledby="post-cost">
        <h2 id="post-cost">{copy.paidLegend}</h2>
        <div className="form-grid">
          <Radios legend={copy.paidLegend} name="paid" value={values.paid} onChange={(v) => set("paid", v)} options={[["no", copy.free], ["yes", copy.paidOption]]} error={err("paid")} />
          <Field name="payNote" label={copy.payNote} hint={copy.payNoteHint} error={err("payNote")}>
            {(p) => <input type="text" {...p} {...bind("payNote")} maxLength={200} />}
          </Field>
        </div>
      </section>

      <section className="form-section" aria-labelledby="post-how">
        <h2 id="post-how">{copy.howLegend}</h2>
        <div className="form-grid">
          <Radios legend={copy.howLegend} name="how" value={values.how} onChange={(v) => set("how", v)} options={howOptions} error={err("applyMethodType")} />
          {values.how !== "platform" ? (
            <Field name="applyValue" label={values.how === "email" ? copy.emailLabel : copy.linkLabel} error={err("applyMethodValue")}>
              {(p) => <input type="text" {...p} {...bind("applyValue")} maxLength={500} inputMode={values.how === "email" ? "email" : "url"} autoComplete="off" />}
            </Field>
          ) : null}
        </div>
      </section>

      <details className="form-more">
        <summary>{copy.moreDetails}</summary>
        <div className="form-grid">
          <Field name="summary" label={copy.summary} hint={copy.summaryHint} wide error={err("summary")}>
            {(p) => <textarea rows={2} {...p} {...bind("summary")} maxLength={280} />}
          </Field>
          <Field name="requirements" label={copy.requirements} wide error={err("requirements")}>
            {(p) => <textarea rows={4} {...p} {...bind("requirements")} maxLength={3000} />}
          </Field>
          <Field name="category" label={copy.category} error={err("category")}>
            {(p) => (
              <select {...p} {...bind("category")}>
                <option value="">{copy.noCategory}</option>
                {Object.entries(categoryLabels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            )}
          </Field>
          <Field name="commitment" label={copy.commitment} hint={copy.commitmentHint} error={err("commitment")}>
            {(p) => <input type="text" {...p} {...bind("commitment")} maxLength={100} />}
          </Field>
          <Field name="skills" label={copy.skills} hint={copy.skillsHint} wide error={err("skills")}>
            {(p) => <input type="text" {...p} {...bind("skills")} />}
          </Field>
          <Field name="relevance" label={copy.relevance} hint={copy.relevanceHint} error={err("relevance")}>
            {(p) => (
              <select {...p} {...bind("relevance")}>
                {Object.entries(relevanceLabels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            )}
          </Field>
        </div>
      </details>

      <section className="form-section guidelines" aria-labelledby="post-guidelines">
        <h2 id="post-guidelines">{copy.guidelinesHeading}</h2>
        <ul>
          {["g1", "g2", "g3", "g4", "g5"].map((key) => (
            <li key={key}>{copy[key]}</li>
          ))}
        </ul>
        <div className={`field${err("guidelines") ? " has-error" : ""}`}>
          <label className="check-option">
            <input
              type="checkbox"
              name="guidelines"
              checked={values.guidelines}
              onChange={(event) => set("guidelines", event.target.checked)}
              aria-invalid={err("guidelines") ? "true" : undefined}
              aria-describedby={err("guidelines") ? "guidelines-error" : undefined}
            />
            {copy.guidelinesCheck}
          </label>
          {err("guidelines") ? (
            <p className="field-error" id="guidelines-error">
              {err("guidelines")}
            </p>
          ) : null}
        </div>
        <p className="page-note">{fill(copy.nameNotice, { name: displayName })}</p>
      </section>

      <div className="form-actions">
        <button className="button button-primary" type="submit" disabled={submitting}>
          {submitting ? (isEdit ? copy.submittingEdit : copy.submitting) : isEdit ? copy.submitEdit : copy.submit}
        </button>
      </div>
    </form>
  );
}
