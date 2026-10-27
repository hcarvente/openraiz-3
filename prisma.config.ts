// Configuration for the Prisma command-line tool (validate, migrate, generate).
// The running app does not read this file.
import "dotenv/config"; // load DIRECT_URL (and friends) from .env
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // Direct (non-pooled) connection: migrations need it. `prisma generate`
    // (run by postinstall, including on Vercel before env vars matter) does not
    // connect, so a missing value falls back to an unusable placeholder instead
    // of failing the install. Migrate commands then fail loudly on connection.
    url: process.env.DIRECT_URL ?? "postgresql://DIRECT_URL-is-not-set.invalid/db",
  },
});
