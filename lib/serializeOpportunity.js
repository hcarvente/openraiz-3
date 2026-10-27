// Turns an Opportunity row from Prisma into the flat JSON the API sends to the browser.
//
// The calendar-date columns (datePosted, deadline, lastUpdated) come back from Prisma
// as JavaScript Dates at midnight UTC. We always format them in UTC ("YYYY-MM-DD"),
// because formatting in local time can show the wrong day in some time zones.
// createdAt is a real moment in time, so it stays a full ISO timestamp.

function toDateOnly(date) {
  return date ? date.toISOString().slice(0, 10) : null; // keeps null (e.g. no deadline) as null
}

export function serializeOpportunity(opportunity) {
  return {
    ...opportunity, // keep the response flat: same fields as the database model
    datePosted: toDateOnly(opportunity.datePosted),
    deadline: toDateOnly(opportunity.deadline),
    eventDate: toDateOnly(opportunity.eventDate),
    lastUpdated: toDateOnly(opportunity.lastUpdated),
    createdAt: opportunity.createdAt.toISOString(),
  };
}

// The same, for public pages and public API responses: without the fields only the admin and the poster may see
// (who owns the listing, whether it was approved, and why it was rejected).
export function serializePublicOpportunity(opportunity) {
  const { ownerUserId, approvalStatus, rejectionReason, ...visible } = serializeOpportunity(opportunity);
  return visible;
}
