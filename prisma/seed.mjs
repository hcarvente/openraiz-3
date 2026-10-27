// Copies the 10 sample listings into the database. Safe to run again: a listing whose legacyId is already there is
// skipped (never overwritten, so edits made later in the admin form are kept).
//
//   npm run db:seed
//
// It uses plain SQL through `pg` and the direct connection string (DIRECT_URL), because it is a one-off script and
// does not need the app's Prisma client. Every seeded listing is approved and has no owner (it belongs to OpenRaiz).
import { randomUUID } from "node:crypto";
import pg from "pg";
import { LISTINGS } from "./seed-data.mjs";

const connectionString = process.env.DIRECT_URL;
if (!connectionString) {
  console.error("DIRECT_URL is not set. Copy .env.example to .env and fill it in.");
  process.exit(1);
}

const client = new pg.Client({ connectionString });
await client.connect();

let created = 0;
try {
  for (const x of LISTINGS) {
    const result = await client.query(
      `INSERT INTO "Opportunity" (
         "id", "legacyId", "title", "organization", "description", "summary", "requirements", "skills", "category",
         "commitment", "type", "livedExperienceRelevance", "status", "source", "locationType", "city", "state",
         "address", "isPaid", "compensation", "datePosted", "deadline", "lastUpdated", "applyMethodType",
         "applyMethodValue", "approvalStatus"
       ) VALUES (
         $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11::"OpportunityType", $12::"LivedExperienceRelevance",
         $13::"OpportunityStatus", $14, $15::"LocationType", $16, $17, $18, $19, $20, $21::date, $22::date, $23::date,
         $24::"ApplyMethodType", $25, 'approved'::"ApprovalStatus"
       ) ON CONFLICT ("legacyId") DO NOTHING`,
      [
        randomUUID(), x.legacyId, x.title, x.organization, x.description, x.summary, x.requirements, x.skills, x.category,
        x.commitment, x.type, x.livedExperienceRelevance, x.status, x.source, x.locationType, x.city, x.state,
        x.address, x.isPaid, x.compensation, x.datePosted, x.deadline, x.lastUpdated, x.applyMethodType,
        x.applyMethodValue,
      ],
    );
    created += result.rowCount;
  }
  const { rows } = await client.query('SELECT count(*)::int AS n FROM "Opportunity"');
  console.log(`Seed finished: ${created} added, ${LISTINGS.length - created} already there. Opportunity rows now: ${rows[0].n}.`);
} finally {
  await client.end();
}
