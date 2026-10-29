"use client";

// The header's navigation. On wide screens it is always shown. On phones it folds behind a "Menu" button so the page content
// starts higher. Without JavaScript the button is hidden and the links stay visible, so nothing is ever unreachable.
// Choosing a link closes the menu (the next page starts with it closed).
import { useState, useSyncExternalStore } from "react";

const noopSubscribe = () => () => {};

export default function HeaderMenu({ label, menuLabel, children }) {
  const [open, setOpen] = useState(false);
  // false while the server renders and during hydration, true afterwards: only then can the menu fold.
  const interactive = useSyncExternalStore(noopSubscribe, () => true, () => false);
  return (
    <>
      {interactive ? (
        <button type="button" className="menu-toggle" aria-expanded={open} aria-controls="site-nav" onClick={() => setOpen(!open)}>
          {menuLabel}
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
            {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>
      ) : null}
      <nav
        id="site-nav"
        className={`site-nav${interactive && !open ? " is-collapsed" : ""}`}
        aria-label={label}
        onClick={(event) => {
          if (event.target instanceof Element && event.target.closest("a")) setOpen(false);
        }}
      >
        {children}
      </nav>
    </>
  );
}
