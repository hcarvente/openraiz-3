// POST /api/listings/[id]/messages: a signed-in, email-verified person sends a message to the poster of a public listing that
// uses "contact through OpenRaiz". The poster reads it in My listings. Who may send and what is checked: lib/sendMessage.js.
import { getCurrentUser } from "@/lib/roles";
import { prisma } from "@/lib/prisma";
import { isSameOrigin } from "@/lib/sameOrigin";
import { sendMessage } from "@/lib/sendMessage";

const DAY_MS = 24 * 60 * 60 * 1000;

export async function POST(request, { params }) {
  if (!isSameOrigin(request.headers)) return Response.json({ error: "forbiddenOrigin" }, { status: 403 });

  let current;
  try {
    current = await getCurrentUser();
  } catch (error) {
    console.error("Could not check the signed-in user:", error?.name, error?.code);
    return Response.json({ error: "unavailable" }, { status: 503 }); // fails closed
  }

  const { id } = await params;
  let body;
  try {
    body = await request.json();
  } catch {
    body = undefined; // sendMessage answers 401/403/404 first for anyone who may not send, then 400 for the bad body
  }

  try {
    const result = await sendMessage({
      current,
      id,
      body,
      loadListing: (listingId) =>
        prisma.opportunity.findUnique({ where: { id: listingId }, select: { id: true, ownerUserId: true, status: true, approvalStatus: true, applyMethodType: true } }),
      countToday: (userId) => prisma.contactMessage.count({ where: { senderUserId: userId, createdAt: { gte: new Date(Date.now() - DAY_MS) } } }),
      countForListing: (userId, listingId) => prisma.contactMessage.count({ where: { senderUserId: userId, opportunityId: listingId } }),
      createMessage: (data) => prisma.contactMessage.create({ data }),
    });
    return Response.json(result.body, { status: result.status });
  } catch (error) {
    console.error("POST /api/listings/[id]/messages failed:", error?.name, error?.code);
    return Response.json({ error: "server" }, { status: 500 });
  }
}
