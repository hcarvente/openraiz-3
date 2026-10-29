// Counts AI calls per day and per feature in the database (table AiUsage). Server-only.
import { prisma } from "@/lib/prisma";

// Adds one to today's count for `route` and returns the new count. Done in one step by the database (an upsert with an
// increment), so many calls at once are each counted exactly once.
export async function incrementDailyUsage(route, now = new Date()) {
  const day = new Date(`${now.toISOString().slice(0, 10)}T00:00:00.000Z`);
  const row = await prisma.aiUsage.upsert({
    where: { day_route: { day, route } },
    update: { count: { increment: 1 } },
    create: { day, route, count: 1 },
    select: { count: true },
  });
  return row.count;
}
