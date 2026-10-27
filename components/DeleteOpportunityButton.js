"use client";

// A Delete button with an in-place, two-step confirmation. It is a Client Component because it reacts to clicks and
// keys in the browser. Nothing is sent when Delete is first clicked: only "Yes, delete" sends
// DELETE /api/opportunities/[id]. The steps themselves live in lib/deleteFlow.js.
//
// The cards show this button only when showAdminActions is on, which no public page does. The DELETE request itself
// is refused without admin credentials (proxy.js).
import { useEffect, useId, useReducer, useRef } from "react";
import { deleteReducer, initialDeleteState, interpretDeleteStatus, rememberDeletion } from "@/lib/deleteFlow";

// What is shown while confirming (and while the request runs). It only displays: everything it does is passed in.
// The title is put into the page as plain text by React, never as HTML.
export function DeleteConfirmation({ title, error, isDeleting, onConfirm, onCancel, cancelRef }) {
  const textId = useId();
  return (
    <div className="delete-confirm" role="group" aria-labelledby={textId} aria-busy={isDeleting ? "true" : undefined}>
      <p className="delete-confirm-text" id={textId}>
        Delete <strong>&ldquo;{title}&rdquo;</strong>? This permanently removes the opportunity and{" "}
        <strong>cannot be undone</strong>.
      </p>
      {error ? (
        <p className="delete-confirm-error" role="alert">
          {error}
        </p>
      ) : null}
      <div className="delete-confirm-buttons">
        <button type="button" className="button button-danger-solid button-small" onClick={onConfirm} disabled={isDeleting}>
          {isDeleting ? "Deleting…" : "Yes, delete"}
        </button>
        <button type="button" className="button button-secondary button-small" onClick={onCancel} disabled={isDeleting} ref={cancelRef}>
          Cancel
        </button>
      </div>
    </div>
  );
}

export default function DeleteOpportunityButton({ opportunityId, title }) {
  const [state, dispatch] = useReducer(deleteReducer, undefined, initialDeleteState);
  const deleteButtonRef = useRef(null);
  const cancelRef = useRef(null);
  const requestInFlight = useRef(false); // set at once on click, so a double click cannot send two requests
  const returnFocusToDelete = useRef(false);

  // When the confirmation opens, keyboard focus goes to Cancel (the safe choice).
  useEffect(() => {
    if (state.phase === "confirming" && cancelRef.current) cancelRef.current.focus();
  }, [state.phase]);

  // After cancelling, focus goes back to the Delete button the person started from.
  useEffect(() => {
    if (state.phase === "idle" && returnFocusToDelete.current) {
      returnFocusToDelete.current = false;
      if (deleteButtonRef.current) deleteButtonRef.current.focus();
    }
  }, [state.phase]);

  // While the confirmation is open, pressing Escape cancels it. (Ignored while a request is running.)
  useEffect(() => {
    if (state.phase !== "confirming") return undefined;
    function onKeyDown(event) {
      if (event.key === "Escape") {
        returnFocusToDelete.current = true;
        dispatch({ type: "escape" });
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [state.phase]);

  function cancel() {
    returnFocusToDelete.current = true;
    dispatch({ type: "cancel" });
  }

  // The only place a DELETE request is sent.
  async function confirmDelete() {
    if (requestInFlight.current) return;
    requestInFlight.current = true;
    dispatch({ type: "confirm" });

    try {
      const response = await fetch(`/api/opportunities/${encodeURIComponent(opportunityId)}`, { method: "DELETE" });
      const outcome = interpretDeleteStatus(response.status);

      if (outcome === "deleted" || outcome === "gone") {
        // Remember what happened so the reloaded homepage can say so, then reload the page so the list is fresh
        // (the cards, and so this button, are on the homepage). requestInFlight stays set: the page is going away.
        rememberDeletion(outcome, title);
        window.location.reload();
        return;
      }
      dispatch({ type: "failed" });
    } catch {
      dispatch({ type: "failed" });
    }
    requestInFlight.current = false;
  }

  if (state.phase === "idle") {
    return (
      <button
        type="button"
        className="button button-danger button-small"
        onClick={() => dispatch({ type: "ask" })}
        aria-label={`Delete ${title}`}
        ref={deleteButtonRef}
      >
        Delete
      </button>
    );
  }

  return (
    <DeleteConfirmation
      title={title}
      error={state.error}
      isDeleting={state.phase === "deleting"}
      onConfirm={confirmDelete}
      onCancel={cancel}
      cancelRef={cancelRef}
    />
  );
}
