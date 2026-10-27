// Lists shared by the validators and the form. Plain JavaScript with relative imports only, so it also runs under `npm test`.
//
// OPPORTUNITY_TYPES must match the OpportunityType enum in prisma/schema.prisma. CATEGORIES is stored as plain text in the
// database and checked against this list, so it can change without a migration.

export const OPPORTUNITY_TYPES = ["job", "internship", "fellowship", "volunteer", "workshop", "event", "resource"];

// Only these types happen on a date. Jobs, internships and fellowships use an application deadline instead.
export const EVENT_DATE_TYPES = ["workshop", "event"];

export function allowsEventDate(type) {
  return EVENT_DATE_TYPES.includes(type);
}

export const CATEGORIES = [
  "Health & Wellness",
  "Education",
  "Arts & Media",
  "Technology",
  "Legal & Advocacy",
  "Trades & Construction",
  "Business & Finance",
  "Community & Social Services",
  "Government & Policy",
  "Other",
];

export const SKILLS_LIMITS = { maxItems: 15, maxLength: 50 };
