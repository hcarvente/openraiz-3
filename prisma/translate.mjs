// Saves the Spanish text of the sample listings (prisma/translations-es.mjs) as their approved translation.
//
//   npm run db:translate
//
// Safe to run again: only a listing written in English that has NO translation yet is changed, so a translation that was
// edited later in the admin queue is never overwritten. Uses plain SQL through `pg` and the direct connection string.
import pg from "pg";
import { TRANSLATIONS_ES } from "./translations-es.mjs";

const connectionString = process.env.DIRECT_URL;
if (!connectionString) {
  console.error("DIRECT_URL is not set. Copy .env.example to .env and fill it in.");
  process.exit(1);
}

const client = new pg.Client({ connectionString });
await client.connect();
let saved = 0;
let skipped = 0;
let missing = 0;
try {
  for (const [legacyId, t] of Object.entries(TRANSLATIONS_ES)) {
    const result = await client.query(
      `UPDATE "Opportunity"
         SET "titleTr" = $2, "summaryTr" = $3, "descriptionTr" = $4, "requirementsTr" = $5, "translationStatus" = 'approved'::"TranslationStatus"
       WHERE "legacyId" = $1 AND "originalLang" = 'en' AND "translationStatus" = 'none'::"TranslationStatus"`,
      [legacyId, t.title, t.summary, t.description, t.requirements],
    );
    if (result.rowCount === 1) saved += 1;
    else {
      const exists = await client.query('SELECT 1 FROM "Opportunity" WHERE "legacyId" = $1', [legacyId]);
      if (exists.rowCount === 0) missing += 1;
      else skipped += 1;
    }
  }
  console.log(`Translations: ${saved} saved, ${skipped} skipped (already translated), ${missing} listings not found.`);
} finally {
  await client.end();
}
