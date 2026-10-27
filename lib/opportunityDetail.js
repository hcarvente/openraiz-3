// Small rules for the listing detail page. Plain JavaScript with no imports, so they are easy to test.

// Real ids are letters, digits, hyphens and underscores (the same rule the API uses).
const LISTING_ID_PATTERN = /^[A-Za-z0-9_-]{1,100}$/;

export function isValidListingId(id) {
  return typeof id === "string" && LISTING_ID_PATTERN.test(id);
}

// Turns how-to-apply into something safe to put on the page, or null. Only http(s) links and plain email addresses
// are allowed (the validators already require this when a listing is saved; this is a second check at display time).
// An email address must not carry "?subject=..." style extras, which could add recipients to a mailto: link.
export function safeApplyLink(applyMethodType, applyMethodValue) {
  if (typeof applyMethodValue !== "string") return null;
  const value = applyMethodValue.trim();

  if (applyMethodType === "url") {
    if (/\s/.test(value)) return null;
    try {
      const url = new URL(value);
      if ((url.protocol !== "http:" && url.protocol !== "https:") || !url.hostname.includes(".")) return null;
      return { kind: "url", href: url.href, display: url.hostname.replace(/^www\./, "") };
    } catch {
      return null;
    }
  }

  if (applyMethodType === "email") {
    if (value.length > 254 || !/^[^\s@?&,;<>]+@[^\s@?&,;<>]+\.[^\s@?&,;<>]+$/.test(value)) return null;
    return { kind: "email", href: `mailto:${value}`, display: value };
  }

  return null;
}

// Who to show as the poster. Listings that OpenRaiz or the admin entered show no poster here (the page says
// "OpenRaiz"). A listing posted by a person ("user-posted") shows their organization name, or their own name for an
// individual, with their kind of account. Without a saved profile there is nothing to show.
export function posterInfo(opportunity, profile) {
  if (opportunity?.source !== "user-posted" || !profile) return null;
  if (profile.role === "organization") {
    return { role: "organization", name: profile.orgName || profile.displayName };
  }
  if (profile.role === "individual") {
    return { role: "individual", name: profile.displayName };
  }
  return null;
}
