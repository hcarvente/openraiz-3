"use client";

// "Mark as handled" for a report in the admin area (admin pages are English only).
import { useState } from "react";

export default function ResolveReportButton({ reportId }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function resolve() {
    if (busy) return;
    setBusy(true);
    setError("");
    try {
      const response = await fetch(`/api/admin/reports/${encodeURIComponent(reportId)}/resolve`, { method: "POST" });
      if (response.status === 200) {
        window.location.reload();
        return;
      }
      setError("That didn't work. Please try again.");
    } catch {
      setError("We couldn't reach the server. Please try again.");
    }
    setBusy(false);
  }

  return (
    <>
      <button type="button" className="button button-secondary button-small" disabled={busy} onClick={resolve}>
        {busy ? "Saving…" : "Mark as handled"}
      </button>
      {error ? <span className="field-error" role="alert"> {error}</span> : null}
    </>
  );
}
