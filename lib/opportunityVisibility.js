// What the public may see. A listing is public only when an admin approved it and it is not archived. ("Filled"
// listings stay visible, marked as filled.) Use PUBLIC_WHERE in every public database query, and isPubliclyVisible for
// a row already loaded; they say the same thing.
export const PUBLIC_WHERE = { approvalStatus: "approved", status: { not: "archived" } };

export function isPubliclyVisible(opportunity) {
  return opportunity?.approvalStatus === "approved" && opportunity?.status !== "archived";
}
