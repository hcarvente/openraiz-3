# OpenRaiz 3.0

OpenRaiz connects young people with jobs, internships, fellowships, volunteer roles, workshops, events and resources, with a focus on people with lived experience of systems like justice, immigration, foster care or housing instability.

**Live site:** https://openraiz-3.vercel.app (English at `/en`, Spanish at `/es`)

OpenRaiz 3.0 merges three earlier projects into one app:

| Project | What it gave 3.0 |
|---|---|
| OpenRaiz V1 (static site) | The design, the brand, the first 10 listings |
| OpenRaiz 2.0 (Next.js, Prisma, Neon) | The database, the listing API, the admin tools |
| Monster Interview (week 6) | The interview engine, ported as a neutral "OpenRaiz Coach" (no Halloween theme) |

## What you can do

**Anyone, without an account**
- Browse and search listings, filter by type, place, pay, category and more.
- Read the whole site in English or Spanish. Listings written in one language show an approved translation in the other.
- **See how your experience fits** a listing (AI, practice and information only).
- **Practice an interview** (AI): three questions, kind and specific coaching, by category or for one listing.

**Signed-in people with a verified email**
- Create an account as an **individual** (workshops, events, resources) or an **organization** (all types).
- Post a listing. It is held as **pending** until an admin approves it. Edit or withdraw your own listings.
- Send a message to a listing's poster (the poster's email and phone are never shown) and report a listing.

**Admins** (a verified email on the `ADMIN_EMAILS` list)
- Review the approval queue: approve, or reject with a reason.
- Review and edit the translation, optionally starting from an **AI draft**. The AI never publishes anything.
- Handle reports, and manage every listing.

## How it is built

- **Next.js 16** (App Router, Cache Components, Turbopack) and **React 19**. This version differs from older Next.js: see `AGENTS.md` and `node_modules/next/dist/docs/` before changing framework code.
- **Postgres on Neon** through **Prisma 7**. **Neon Auth** for accounts and email verification codes.
- **Gemini** (`@google/genai`) for the three AI features, always called from the server.
- Language lives in the URL (`/en`, `/es`). All text is in `lib/i18n/dictionaries/{en,es}.js`; a test checks that both have the same keys and markers.
- Decision logic (posting, editing, messaging, reporting, moderation, AI limits) is written as small functions that take their dependencies as arguments, so the tests run without a database or the network.

```
app/            pages (public in app/[lang], admin in app/(admin)) and API routes
components/     the user interface
lib/            rules and helpers: validation, roles, translation, AI core (lib/ai),
                Job-Fit (lib/jobFit), Interview (lib/interview), Translate (lib/translate)
prisma/         schema, 7 migrations, seed and translation scripts
scripts/        securityMatrix.mjs (permission checker)
tests/          node:test unit tests (no database, no network)
PROMPT_LOG.md   one honest entry per step: what was decided, built, verified and not verified
```

## Run it locally

1. `npm install` (also generates the Prisma client).
2. Copy `.env.example` to `.env` and fill in the values from the Neon console and Google AI Studio. **Never commit `.env`.**
3. `npx prisma migrate deploy` to create the tables, then `npm run db:seed` for the 10 sample listings and `npm run db:translate` for their Spanish text.
4. `npm run dev`, then open http://localhost:3000.

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | Pooled Neon connection (used by the app) |
| `DIRECT_URL` | Direct Neon connection, no `-pooler` (used by migrations) |
| `NEON_AUTH_BASE_URL`, `NEON_AUTH_COOKIE_SECRET` | Neon Auth (the secret is at least 32 characters) |
| `ADMIN_EMAILS` | Comma-separated admin emails; only a verified email counts |
| `GEMINI_API_KEY` | AI key, server-only, never `NEXT_PUBLIC_` |
| `AI_ENABLED` | `false` switches every AI feature off |
| `GEMINI_MODEL`, `AI_CAP_JOB_FIT`, `AI_CAP_INTERVIEW`, `AI_CAP_TRANSLATE` | Optional model and daily-limit overrides |
| `AI_MODE` | Development only: `ok`, `rate-limit`, `timeout`... use a fake AI that costs nothing (ignored in production) |

**Careful:** `next start` and `next build` automatically load `.env.production`. Keep live database strings out of any file with that name (this project keeps them in a git-ignored `.env.live` and uses them only on purpose with `node --env-file=.env.live`).

## Test

```
npm test        # 150+ unit tests, no database or network needed
npm run lint
npm run build
node scripts/securityMatrix.mjs http://localhost:3000   # permission checker (signed-out visitor)
node scripts/securityMatrix.mjs https://openraiz-3.vercel.app
```

The permission checker only reads: it tries every sensitive address as a signed-out visitor (writes refused, private pages redirect to sign-in, wrong sites refused, headers present). Run it after every deploy.

## Safety

- **Nothing becomes public without admin approval.** Individuals can post only workshops, events and resources.
- **Every write is checked on the server** (sign-in, verified email, role, ownership) and, for browser requests, that it comes from this site.
- **The AI is limited and distrusted.** A kill switch, 5 requests a minute per visitor, daily caps per feature, one call per request, and strict checks of what comes back (no scores, no hiring claims, no links, no invented numbers). Listing and visitor text is treated as data, never as instructions. Nothing a visitor types into an AI box is stored, and logs hold token counts only.
- **Secrets stay on the server.** The built site was checked for key patterns; the git history has none.
- **Headers:** `nosniff`, no framing, a strict referrer policy, camera/microphone/location off, a limited Content-Security-Policy (framing, base address, form targets and plugins only).

## Accessibility

The goal is WCAG 2.2 level AA in both languages. The public pages were checked with axe (0 violations), the keyboard, 320 px width and 200% text. **No screen reader has been used yet.** The statement at `/en/accessibility` says what was and was not checked.

## Known limits

- 10 `npm audit` issues remain, all inside Neon's beta login SDK, with no fix available yet.
- The shared Neon email sender used for verification codes is rate-limited and meant for development. A custom SMTP provider is the next step before large launches.
- The quick per-visitor AI speed limit is per server copy; the daily totals are shared and exact.
- Pay, time commitment and skills on listings are shown in the language they were written in.
- AI answers can be wrong; every AI screen says so, and none of them is a decision about a person.

## Deploy

Vercel builds from the `week7-integration` branch. Environment variables are set in the Vercel project (mark the cookie secret, Gemini key and direct URL as Secret). Run `npx prisma migrate deploy` against the live database before deploying a change that adds a migration, then run the permission checker against the live site.
