// POST /api/posts: a signed-in, email-verified individual or organization submits a listing. It is saved as PENDING and
// owned by them; nobody sees it until an admin approves it. Who may post and what is checked: lib/submitPost.js.
// The answers are codes (for example "unverified" or a list of { field, code }); the posting form shows them in the
// visitor's language.
import { getCurrentUser } from "@/lib/roles";
import { prisma } from "@/lib/prisma";
import { isSameOrigin } from "@/lib/sameOrigin";
import { submitPost } from "@/lib/submitPost";

export async function POST(request) {
  if (!isSameOrigin(request.headers)) {
    return Response.json({ error: "forbiddenOrigin" }, { status: 403 });
  }

  let current;
  try {
    current = await getCurrentUser();
  } catch (error) {
    console.error("Could not check the signed-in user:", error?.name, error?.code);
    return Response.json({ error: "unavailable" }, { status: 503 }); // fails closed
  }

  let body;
  try {
    body = await request.json();
  } catch {
    body = undefined; // submitPost answers 401/403 first for anyone who may not post, then 400 for the bad body
  }

  try {
    const result = await submitPost({
      current,
      body,
      today: new Date().toISOString().slice(0, 10),
      countPending: (userId) => prisma.opportunity.count({ where: { ownerUserId: userId, approvalStatus: "pending" } }),
      createListing: (data) => prisma.opportunity.create({ data }),
    });
    return Response.json(result.body, { status: result.status });
  } catch (error) {
    console.error("POST /api/posts failed:", error?.name, error?.code);
    return Response.json({ error: "server" }, { status: 500 });
  }
}
