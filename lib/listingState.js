// Where a listing stands, as the poster sees it in "My listings".
//   withdrawn: the poster took it down (archived)   pending: waiting for an admin   rejected: needs changes
//   filled: approved and marked filled              live: approved and public
export function listingState(row) {
  if (row.status === "archived") return "withdrawn";
  if (row.approvalStatus === "pending") return "pending";
  if (row.approvalStatus === "rejected") return "rejected";
  if (row.approvalStatus === "approved") return row.status === "filled" ? "filled" : "live";
  return "pending"; // anything unknown is treated as not public
}
