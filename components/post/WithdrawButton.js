"use client";

// "Withdraw" with an in-place confirmation. Nothing is sent until "Yes, withdraw" is clicked; then the listing is
// archived (DELETE /api/posts/[id]) and the page reloads to show its new state. The words come in as `copy`.
import { useEffect, useRef, useState } from "react";

export default function WithdrawButton({ listingId, copy, failureText }) {
  const [step, setStep] = useState("idle"); // idle | confirming | sending
  const [error, setError] = useState("");
  const cancelRef = useRef(null);
  const openRef = useRef(null);

  useEffect(() => {
    if (step === "confirming") cancelRef.current?.focus(); // Cancel is the safe choice, so it gets the focus
  }, [step]);

  function close() {
    setStep("idle");
    openRef.current?.focus();
  }

  async function withdraw() {
    setStep("sending");
    setError("");
    try {
      const response = await fetch(`/api/posts/${encodeURIComponent(listingId)}`, { method: "DELETE" });
      if (response.status === 200) {
        window.location.reload();
        return;
      }
      setError(failureText);
    } catch {
      setError(failureText);
    }
    setStep("confirming");
  }

  if (step === "idle") {
    return (
      <button ref={openRef} type="button" className="button button-danger button-small" onClick={() => setStep("confirming")}>
        {copy.withdraw}
      </button>
    );
  }

  return (
    <div className="withdraw-confirm" role="group" aria-label={copy.confirmWithdraw} onKeyDown={(event) => event.key === "Escape" && step === "confirming" && close()}>
      <p>{copy.confirmWithdraw}</p>
      {error ? (
        <p className="field-error" role="alert">
          {error}
        </p>
      ) : null}
      <button type="button" className="button button-danger-solid button-small" onClick={withdraw} disabled={step === "sending"}>
        {step === "sending" ? copy.withdrawing : copy.yesWithdraw}
      </button>{" "}
      <button ref={cancelRef} type="button" className="button button-secondary button-small" onClick={close} disabled={step === "sending"}>
        {copy.cancel}
      </button>
    </div>
  );
}
