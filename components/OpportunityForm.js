"use client";

// The opportunity form, used to add a new opportunity and to edit an existing one. It is a Client
// Component because it needs to react to typing and clicking in the browser. It never touches the
// database: it sends JSON to the API, and the server does all the validating and saving.
//
//   mode="create" (the default): sends the whole form to POST /api/opportunities.
//   mode="edit":   starts from `initialValues` (the saved opportunity) and sends only the fields that
//                  changed to PATCH /api/opportunities/[opportunityId].
//
// Admin only: the pages that show this form, and the API it calls, check for a signed-in admin.
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import {
  APPLY_METHOD_OPTIONS,
  CATEGORY_OPTIONS,
  FIELD_LABELS,
  FIELD_LIMITS,
  LIVED_EXPERIENCE_OPTIONS,
  LOCATION_TYPE_OPTIONS,
  OPPORTUNITY_TYPE_OPTIONS,
  STATUS_OPTIONS,
  emptyOpportunityValues,
  groupErrorsByField,
  showsEventDate,
  showsLocationFields,
  todayLocalDate,
  toPatchBody,
  toRequestBody,
} from "@/lib/opportunityOptions";

// One labelled text box, select or text area, with its error message underneath.
function Field({ name, label, required, hint, error, wide, children }) {
  const hintId = `${name}-hint`;
  const errorId = `${name}-error`;
  return (
    <div className={`field${wide ? " field-wide" : ""}${error ? " has-error" : ""}`}>
      <label htmlFor={name}>
        {label}
        {required ? (
          <span className="required-mark" aria-hidden="true">
            {" "}
            *
          </span>
        ) : null}
      </label>
      {children({
        id: name,
        name,
        required,
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

// Today's date in the browser. On the server (before the page reaches the browser) it is "", and React
// switches to the real date right after the page loads, without a mismatch.
const subscribeToNothing = () => () => {};
const getServerToday = () => "";

export default function OpportunityForm({ mode = "create", opportunityId, initialValues, submitLabel, successRedirectTo = "/" }) {
  const isEdit = mode === "edit";
  const buttonLabel = submitLabel ?? (isEdit ? "Save Changes" : "Save Opportunity");
  const [values, setValues] = useState(() => ({ ...emptyOpportunityValues(), ...initialValues }));
  // In edit mode this is the saved opportunity as it was when the page loaded: what the changes are compared against.
  const [originalValues] = useState(() => ({ ...emptyOpportunityValues(), ...initialValues }));
  const [fieldErrors, setFieldErrors] = useState({}); // { fieldName: "message" } from the server
  const [formError, setFormError] = useState(""); // a general message shown at the top
  const [formNotice, setFormNotice] = useState(""); // a neutral note, such as "No changes to save."
  const [opportunityGone, setOpportunityGone] = useState(false); // the opportunity being edited no longer exists
  const [isSubmitting, setIsSubmitting] = useState(false);
  const summaryRef = useRef(null);

  // "Date posted" shows today's date (the visitor's own calendar day) until they pick another one.
  // While values.datePosted is null they have not touched it.
  const today = useSyncExternalStore(subscribeToNothing, todayLocalDate, getServerToday);
  const datePostedValue = values.datePosted ?? today;

  // When a message appears, move focus to it so keyboard and screen-reader users notice it.
  useEffect(() => {
    if (formError && summaryRef.current) summaryRef.current.focus();
  }, [formError]);

  function setValue(name, value) {
    setFormNotice("");
    setValues((current) => ({ ...current, [name]: value }));
  }

  const bind = (name) => ({ value: values[name], onChange: (event) => setValue(name, event.target.value) });

  async function handleSubmit(event) {
    event.preventDefault();
    if (isSubmitting) return; // a second click or Enter press while saving does nothing

    const currentValues = { ...values, datePosted: datePostedValue };

    // Edit mode sends only what changed. If nothing did, there is nothing to send.
    let request;
    if (isEdit) {
      const changes = toPatchBody(originalValues, currentValues);
      if (Object.keys(changes).length === 0) {
        setFormError("");
        setFieldErrors({});
        setFormNotice("No changes to save.");
        return;
      }
      request = { url: `/api/opportunities/${encodeURIComponent(opportunityId)}`, method: "PATCH", body: changes, successStatus: 200 };
    } else {
      request = { url: "/api/opportunities", method: "POST", body: toRequestBody(currentValues), successStatus: 201 };
    }
    const savedWords = isEdit ? "the changes were not saved" : "the opportunity was not saved";

    setIsSubmitting(true);
    setFormError("");
    setFormNotice("");
    setFieldErrors({});
    setOpportunityGone(false);

    try {
      const response = await fetch(request.url, {
        method: request.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(request.body),
      });

      if (response.status === request.successStatus) {
        // Saved. A full page load makes the server read the database again, so the homepage shows the
        // new or changed opportunity. The button stays disabled while the browser navigates.
        window.location.assign(successRedirectTo);
        return;
      }

      const data = await response.json().catch(() => null);
      if (response.status === 400 && data && Array.isArray(data.details)) {
        setFieldErrors(groupErrorsByField(data.details));
        setFormError("Please fix the problems below. Nothing has been saved yet.");
      } else if (response.status === 400 && data && typeof data.error === "string") {
        setFormError(data.error);
      } else if (isEdit && response.status === 404) {
        setOpportunityGone(true);
        setFormError("This opportunity no longer exists, so your changes were not saved.");
      } else {
        setFormError(`Something went wrong on our end, and ${savedWords}. Please try again.`);
      }
    } catch {
      setFormError(`We couldn't reach the server, and ${savedWords}. Please try again.`);
    }
    setIsSubmitting(false);
  }

  const showLocation = showsLocationFields(values.locationType);
  // Problems for fields that are not on screen (for example a hidden location field) still get listed.
  const errorEntries = Object.entries(fieldErrors);

  return (
    <form className="opportunity-form" onSubmit={handleSubmit}>
      {formError ? (
        <div className="form-summary" role="alert" tabIndex={-1} ref={summaryRef}>
          <p>{formError}</p>
          {opportunityGone ? (
            <p>
              <Link href={successRedirectTo}>Back to opportunities</Link>
            </p>
          ) : null}
          {errorEntries.length > 0 ? (
            <ul>
              {errorEntries.map(([field, message]) => (
                <li key={field}>
                  <strong>{FIELD_LABELS[field] ?? field}:</strong> {message}
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      ) : null}

      {formNotice ? (
        <p className="form-notice" role="status">
          {formNotice}
        </p>
      ) : null}

      <p className="form-note">
        Fields marked <span className="required-mark">*</span> are required.
      </p>

      <section className="form-section" aria-labelledby="section-details">
        <h2 id="section-details">Opportunity details</h2>
        <div className="form-grid">
          <Field name="title" label="Title" required error={fieldErrors.title}>
            {(p) => (
              <input type="text" {...p} {...bind("title")} maxLength={FIELD_LIMITS.title} placeholder="e.g. Youth Leadership Fellow" />
            )}
          </Field>

          <Field name="organization" label="Organization" required error={fieldErrors.organization}>
            {(p) => (
              <input
                type="text"
                {...p}
                {...bind("organization")}
                maxLength={FIELD_LIMITS.organization}
                placeholder="e.g. Community Foundation"
              />
            )}
          </Field>

          <Field name="type" label="Opportunity type" required error={fieldErrors.type}>
            {(p) => (
              <select {...p} {...bind("type")}>
                <option value="">Select type</option>
                {OPPORTUNITY_TYPE_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            )}
          </Field>

          <Field
            name="livedExperienceRelevance"
            label="Lived-experience relevance"
            required
            hint="How much this opportunity values lived experience."
            error={fieldErrors.livedExperienceRelevance}
          >
            {(p) => (
              <select {...p} {...bind("livedExperienceRelevance")}>
                <option value="">Select relevance</option>
                {LIVED_EXPERIENCE_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            )}
          </Field>

          <div className={`field${fieldErrors.isPaid ? " has-error" : ""}`}>
            <fieldset
              className="radio-group"
              aria-describedby={fieldErrors.isPaid ? "isPaid-error" : undefined}
              aria-invalid={fieldErrors.isPaid ? "true" : undefined}
            >
              <legend>
                Paid or unpaid
                <span className="required-mark" aria-hidden="true">
                  {" "}
                  *
                </span>
              </legend>
              <label className="radio-option">
                <input type="radio" name="paid" value="yes" required checked={values.paid === "yes"} onChange={() => setValue("paid", "yes")} />
                Paid
              </label>
              <label className="radio-option">
                <input type="radio" name="paid" value="no" required checked={values.paid === "no"} onChange={() => setValue("paid", "no")} />
                Unpaid
              </label>
            </fieldset>
            {fieldErrors.isPaid ? (
              <p className="field-error" id="isPaid-error">
                {fieldErrors.isPaid}
              </p>
            ) : null}
          </div>

          <Field
            name="compensation"
            label="Compensation"
            required
            hint='Shown on the card, e.g. "Paid, $25/hr" or "Unpaid".'
            error={fieldErrors.compensation}
          >
            {(p) => (
              <input
                type="text"
                {...p}
                {...bind("compensation")}
                maxLength={FIELD_LIMITS.compensation}
                placeholder="e.g. Paid, $25/hr"
              />
            )}
          </Field>

          <Field name="description" label="Description" required wide error={fieldErrors.description}>
            {(p) => (
              <textarea
                rows={5}
                {...p}
                {...bind("description")}
                maxLength={FIELD_LIMITS.description}
                placeholder="Describe the opportunity in a few plain-language sentences."
              />
            )}
          </Field>
        </div>
      </section>

      <section className="form-section" aria-labelledby="section-more">
        <h2 id="section-more">More details (optional)</h2>
        <div className="form-grid">
          <Field
            name="summary"
            label="Short summary"
            wide
            hint={`A one- or two-sentence blurb shown on the listing card (up to ${FIELD_LIMITS.summary} characters).`}
            error={fieldErrors.summary}
          >
            {(p) => <textarea rows={2} {...p} {...bind("summary")} maxLength={FIELD_LIMITS.summary} />}
          </Field>

          <Field name="category" label="Category" error={fieldErrors.category}>
            {(p) => (
              <select {...p} {...bind("category")}>
                <option value="">No category</option>
                {CATEGORY_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            )}
          </Field>

          <Field name="commitment" label="Time commitment" hint="For example: 4 hours a week." error={fieldErrors.commitment}>
            {(p) => <input type="text" {...p} {...bind("commitment")} maxLength={FIELD_LIMITS.commitment} />}
          </Field>

          <Field
            name="requirements"
            label="Requirements"
            wide
            hint="What a person needs to apply or take part."
            error={fieldErrors.requirements}
          >
            {(p) => <textarea rows={4} {...p} {...bind("requirements")} maxLength={FIELD_LIMITS.requirements} />}
          </Field>

          <Field
            name="skills"
            label="Skills"
            wide
            hint="Separate with commas, for example: public speaking, grant writing."
            error={fieldErrors.skills}
          >
            {(p) => <input type="text" {...p} {...bind("skills")} />}
          </Field>
        </div>
      </section>

      <section className="form-section" aria-labelledby="section-location">
        <h2 id="section-location">Location &amp; application</h2>
        <div className="form-grid">
          <Field name="locationType" label="Work arrangement" required wide={!showLocation} error={fieldErrors.locationType}>
            {(p) => (
              <select {...p} {...bind("locationType")}>
                <option value="">Select arrangement</option>
                {LOCATION_TYPE_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            )}
          </Field>

          {showLocation ? (
            <>
              <Field name="city" label="City" required error={fieldErrors.city}>
                {(p) => <input type="text" {...p} {...bind("city")} maxLength={FIELD_LIMITS.city} placeholder="e.g. Oakland" />}
              </Field>

              <Field name="state" label="State" required error={fieldErrors.state}>
                {(p) => <input type="text" {...p} {...bind("state")} maxLength={FIELD_LIMITS.state} placeholder="e.g. CA" />}
              </Field>

              <Field name="address" label="Address (optional)" wide error={fieldErrors.address}>
                {(p) => (
                  <input
                    type="text"
                    {...p}
                    {...bind("address")}
                    maxLength={FIELD_LIMITS.address}
                    placeholder="Street address, if there is a physical location"
                  />
                )}
              </Field>
            </>
          ) : null}

          <Field name="applyMethodType" label="Application method" required error={fieldErrors.applyMethodType}>
            {(p) => (
              <select {...p} {...bind("applyMethodType")}>
                <option value="">Select method</option>
                {APPLY_METHOD_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            )}
          </Field>

          <Field
            name="applyMethodValue"
            label="Application link or email address"
            required
            error={fieldErrors.applyMethodValue}
          >
            {(p) => (
              <input
                type="text"
                {...p}
                {...bind("applyMethodValue")}
                maxLength={FIELD_LIMITS.applyMethodValue}
                placeholder={values.applyMethodType === "email" ? "e.g. jobs@example.org" : "e.g. https://example.org/apply"}
              />
            )}
          </Field>
        </div>
      </section>

      <section className="form-section" aria-labelledby="section-dates">
        <h2 id="section-dates">Dates &amp; status</h2>
        <div className="form-grid">
          <Field name="datePosted" label="Date posted" required error={fieldErrors.datePosted}>
            {(p) => <input type="date" {...p} value={datePostedValue} onChange={(event) => setValue("datePosted", event.target.value)} />}
          </Field>

          {showsEventDate(values.type) ? (
            <Field name="eventDate" label="Event date (optional)" hint="Leave blank if the date is flexible." error={fieldErrors.eventDate}>
              {(p) => <input type="date" {...p} {...bind("eventDate")} />}
            </Field>
          ) : null}

          <Field
            name="deadline"
            label="Application deadline (optional)"
            hint="Leave blank for a rolling opportunity with no deadline."
            error={fieldErrors.deadline}
          >
            {(p) => <input type="date" {...p} {...bind("deadline")} />}
          </Field>

          <Field name="status" label="Status" error={fieldErrors.status}>
            {(p) => (
              <select {...p} {...bind("status")}>
                {STATUS_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            )}
          </Field>
        </div>
      </section>

      <div className="form-actions">
        <Link className="button button-secondary" href={successRedirectTo}>
          Cancel
        </Link>
        <button className="button button-primary" type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving…" : buttonLabel}
        </button>
      </div>
    </form>
  );
}
