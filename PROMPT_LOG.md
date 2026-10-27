# OpenRaiz 2.0 — Prompt Log

## Milestone 1, Step 0 — Project background and planning only

- **Date:** 2026-10-15
- **Objective:** Give the coding agent the project background, rules, and milestones, and get an architectural plan (no code, files, or commands).

### Exact prompt
```
I'm beginning a new project called OpenRaiz 2.0 as part of my Next Chapter AI Engineering Week 5 assignment.
I want you to serve as my coding agent in VS Code. We'll build this application incrementally, using small, individually testable changes.
PROJECT BACKGROUND
OpenRaiz is an opportunity platform designed to connect young people, particularly system-impacted emerging leaders, with jobs, internships, fellowships, volunteer opportunities, and professional development resources.
The long-term platform will serve three groups:
1. Young people looking for employment and professional development opportunities.
2. Organizations, employers, nonprofits, government agencies, and philanthropy posting opportunities.
3. Workforce-development partners helping young people access career pathways.
Eventually, OpenRaiz will support organizational profiles, user accounts, verified employers, and opportunity submission workflows.
Our future approval system will allow trusted, verified organizations to publish directly, while new or unverified organizations will require administrative approval.
For now, all opportunities will be managed manually by an administrator.
EXISTING OPENRAIZ PROJECT
I already have an existing OpenRaiz website built using HTML, CSS, and JavaScript, with opportunity listings stored in a JSON file.
OpenRaiz 2.0 will eventually replace that website.
However, we will build OpenRaiz 2.0 in a completely separate project folder and GitHub repository to protect the original website.
The original repository may be used as a read-only reference for its design, logo, color scheme, typography, and opportunity data structure.
Do not modify the original OpenRaiz project.
WEEK 5 ASSIGNMENT
My goal is to build a functioning full-stack CRUD application.
The application must allow me to:
- Create: Add a new opportunity.
- Read: Display opportunities stored in the database.
- Update: Edit an existing opportunity.
- Delete: Remove an opportunity.
Opportunities must remain saved after refreshing the browser.
I also want to implement basic search and category filtering after CRUD is functioning.
This must be a real database-backed application, not an interface that only stores information in browser state or local storage.
REQUIRED TECHNOLOGY STACK
Use the technologies covered in my Next Chapter course:
- Next.js with the App Router
- React
- JavaScript or TypeScript, following the simplest maintainable approach recommended by Next.js
- CSS for styling
- Next.js Route Handlers for the API layer
- Prisma ORM
- Neon PostgreSQL
- Git and GitHub
Do not introduce additional frameworks, databases, authentication providers, or unnecessary dependencies without explaining why they're needed and asking for approval.
API ARCHITECTURE
OpenRaiz 2.0 should have an API layer built using Next.js Route Handlers.
We will eventually implement:
- GET /api/opportunities — Retrieve opportunities.
- GET /api/opportunities/[id] — Retrieve one opportunity.
- POST /api/opportunities — Create an opportunity.
- PATCH /api/opportunities/[id] — Update an opportunity.
- DELETE /api/opportunities/[id] — Remove an opportunity.
The frontend will interact with these endpoints, which will communicate with PostgreSQL through Prisma.
All database access, data validation, and future authorization checks should occur on the server.
For the Week 5 local demo, we will not build authentication. Do not publicly deploy unrestricted administrative write endpoints.
We will implement and test API functionality one endpoint at a time.
OPPORTUNITY DATA MODEL
Preserve the existing OpenRaiz opportunity data structure as closely as practical.
The application should eventually support information such as:
- Unique opportunity ID
- Title
- Organization
- Opportunity type (job, internship, fellowship, volunteer)
- Description
- Location and work arrangement
- Compensation
- Application deadline
- Application link
- Lived-experience relevance
- Status
- Creation date
If you can access the original OpenRaiz repository, inspect its existing data/opportunities.json file and identify the actual fields and data types before proposing the final Prisma schema.
Do not invent or silently discard existing fields.
For now, we only need one main database model: Opportunity.
We will introduce organizational profiles, user accounts, and relationships between tables in future development phases.
BRANDING AND DESIGN
OpenRaiz 2.0 should preserve the original OpenRaiz visual identity.
That includes:
- Original logo
- Original color palette
- Existing typography where practical
- General visual style
- Opportunity listing design
We will eventually rebuild the public website using React and Next.js.
However, we should prioritize database functionality and CRUD before recreating the entire original interface.
Use the existing branding where practical, but keep the initial design simple.
DEVELOPMENT PROCESS — VERY IMPORTANT
I'm a beginner learning full-stack development.
I do not want you to build the entire application at once.
We will work through very small development steps.
Our process will be:
Plan → Implement → Review → Test → Document → Commit
Follow these rules:
1. Work on only one clearly defined task at a time.
2. Before implementing a task, explain what you're going to do.
3. Do not make unrelated changes.
4. Show me the files you created or modified.
5. Explain whether the changes affect the frontend, backend, API, or database.
6. Explain important code in plain English.
7. Provide specific instructions to test each change.
8. Allow me to verify that the feature works before moving forward.
9. Do not automatically commit or push changes to GitHub without my approval.
10. Never modify the original OpenRaiz repository.
Do not skip steps or implement additional features without authorization.
PROMPT LOG AND DOCUMENTATION
My Next Chapter course requires me to maintain a prompt log demonstrating how I direct my coding agent.
We will create a PROMPT_LOG.md file in the new repository.
Each development step should document:
- Date
- Milestone and step number
- Objective
- Exact prompt I provided
- Files created or modified
- What the code does
- How I tested the feature
- Results of testing
- Errors or mistakes identified
- Corrections made
- Git commit message and commit reference
The log must accurately reflect what happened. Do not fabricate successful tests or mistakes.
I also need to demonstrate that I reviewed the code changes and understood how the frontend, backend, API, Prisma, and database communicate.
DEVELOPMENT MILESTONES
We will proceed through these milestones:
Milestone 1 — Project Setup
- Establish separate project folder.
- Initialize Next.js.
- Set up Git and GitHub.
- Establish the basic project structure.
- Preserve original OpenRaiz branding.
Milestone 2 — Database
- Create Neon PostgreSQL database.
- Configure Prisma.
- Define Opportunity model.
- Run database migration.
- Verify database connection.
Milestone 3 — API
- Implement and test GET endpoint.
- Implement and test POST endpoint.
Milestone 4 — Frontend
- Build opportunity form.
- Build opportunity cards.
- Display saved opportunities.
- Verify database persistence after refreshing.
Milestone 5 — Full CRUD
- Implement PATCH endpoint and editing interface.
- Implement DELETE endpoint and delete controls.
Milestone 6 — Additional Functionality
- Add search by opportunity title or organization.
- Add category filtering.
- Refine styling using existing OpenRaiz branding.
Milestone 7 — Demo Preparation
- Verify all CRUD operations.
- Verify persistence.
- Confirm database secrets are excluded from Git.
- Review prompt log and GitHub commits.
- Prepare a simple explanation of the application's data flow.
We will prioritize a working, explainable application over unnecessary complexity.
SECURITY REQUIREMENTS
- Store the database connection string in an appropriate environment variable.
- Ensure environment files containing secrets are ignored by Git.
- Never expose database credentials in browser code.
- Do not include credentials or other secrets in the prompt log.
- Never commit credentials to GitHub.
- Do not deploy administrative endpoints publicly without authentication and authorization.
YOUR FIRST TASK — PLANNING ONLY
Before creating or modifying any files:
1. Review the proposed technology stack.
2. Explain the recommended folder structure for OpenRaiz 2.0.
3. Identify where React components, Next.js API routes, Prisma files, and database configuration will live.
4. Explain the steps required to initialize the Next.js project.
5. Identify potential technical challenges or unnecessary complexity in the proposed plan.
6. Recommend the smallest possible first implementation step.
7. Explain how we will verify that the first step was completed successfully.
Do not write code, create files, install packages, run commands, or initialize the project yet.
Wait for my approval before beginning implementation.
```

### Result
The agent (read-only) inspected the original `openraiz` repo's `data/opportunities.json` and CSS, then produced a planning document covering stack, folder structure, init steps, challenges, first step, and verification. No files in the project were created in this step. The user reviewed and approved the plan with decisions listed in Step 1's prompt.

### Errors / mistakes identified
None recorded for this step.

### Git
n/a — no repository yet.

---

## Milestone 1, Step 1 — Initialize the Next.js project

- **Date:** 2026-10-15
- **Objective:** Create the new Next.js app (JavaScript, App Router, plain CSS, no Tailwind) at `Week5-Practice/openraiz-2`, verify it starts, and leave the original OpenRaiz repo untouched.

### Exact prompt
This prompt was sent after I interrupted the agent's first attempt to run `create-next-app` (the user rejected that command and wrote "wait, I have a revised prompt for you."). Nothing was created by that first attempt.
```
wait, I have a revised prompt for you.

I've reviewed and approved your architectural plan for OpenRaiz 2.0, with the following decisions:
- Use JavaScript rather than TypeScript.
- Use Next.js with the App Router.
- Use plain CSS without Tailwind.
- Create the project at Week5-Practice/openraiz-2.
- Use openraiz-2 as the future GitHub repository name.
- Preserve the existing OpenRaiz repository without modifying it.
Your task is limited to initializing the new Next.js project.
Please:
1. Confirm the exact directory where the project will be created.
2. Initialize a new Next.js application using the agreed configuration.
3. Verify that the application starts successfully.
4. Confirm the localhost address where I can view it.
5. Explain the main files and folders created in plain English.
6. Confirm that no changes were made to my existing OpenRaiz repository.
Do not install Prisma, connect a database, build components, copy branding assets, or implement API routes yet.
Prompt log requirements
Once the application is running, help me create PROMPT_LOG.md documenting this first implementation step.
Include the exact prompt, files created, commands executed, and verification results.
Do not report the browser test as successful until I personally confirm that I can see the application.
Git requirements
Do not create a GitHub repository, commit changes, or push code yet.
After completing the setup, stop and wait for my confirmation.
I want to review the results before moving to the next step.
```

### Follow-up prompts in this step (about the prompt log itself)
After the agent created the first version of `PROMPT_LOG.md` (which only contained the revised prompt), the user sent these two prompts, each exactly as written:

1. ```
   but include the first prompt that gave you background.
   ```
   → Agent added the "Step 0" section above with the full background/planning prompt.
2. ```
   include all prompts ive shared with you.
   ```
   → Agent added the interruption lead-in, these follow-up prompts, and this list. `PROMPT_LOG.md` is the only file edited by these two prompts.

**Mistake identified (agent):** the first version of the log omitted the background prompt and the user's other messages, so it did not show everything the user directed. The agent also added a needless "transcription note" about the DELETE line in the Step 0 prompt, which was incorrect to include and was removed.

### Commands executed
1. `git status --short`, `git rev-parse HEAD` in the original `openraiz` repo — baseline (clean, commit `0113d35`).
2. `npx create-next-app@latest openraiz-2 --js --eslint --no-tailwind --app --no-src-dir --import-alias "@/*" --use-npm --disable-git` (run in `Week5-Practice`)
3. `npm audit` — inspect warnings reported during install.
4. `npm run dev` — start the dev server; `curl http://localhost:3000` to check the response.
5. Re-ran the git status / commit check on the original `openraiz` repo.

### Files created (all by create-next-app, none hand-written)
`app/layout.js`, `app/page.js`, `app/page.module.css`, `app/globals.css`, `app/favicon.ico`, `public/*.svg` (5 default icons), `package.json`, `package-lock.json`, `next.config.mjs`, `jsconfig.json`, `eslint.config.mjs`, `.gitignore`, `README.md`, `AGENTS.md`, plus `node_modules/` and `.next/` (generated, git-ignored).
This step only affects the **frontend/tooling**. No API, Prisma, or database exists yet.

### What the code does
Nothing custom yet. The default Next.js starter page is served at `/` from `app/page.js`, wrapped by `app/layout.js`.

### Verification
- **Automated (by Claude):** dev server started ("Ready in 298ms", Next.js 16.4.1, Turbopack); `curl http://localhost:3000` returned HTTP 200 with page title "Create Next App". `package.json` dependencies are only `next`, `react`, `react-dom` (dev: `eslint`, `eslint-config-next`). `.gitignore` contains `.env*`. Original `openraiz` repo: 0 changed files, still at commit `0113d35`, file timestamps unchanged.
- **Browser test (by user):** ✅ The user confirmed they can see the Next.js starter page at http://localhost:3000 (2026-10-15). The user also reviewed this prompt log and approved it.
- **Follow-up prompt:** `page is visible, and the prompt log looks good.` → Agent recorded the browser result above.

### Errors / mistakes identified
- My first `create-next-app` command was rejected by the user before running, because they wanted to send a revised prompt. Nothing was created from it.
- `npm audit` reports 5 high-severity issues in dev tooling (`braces` → `eslint-config-next` chain). They're not in runtime dependencies. The suggested `--force` fix would downgrade `eslint-config-next` to v14, so it was **not** applied.
- `create-next-app` also created `AGENTS.md`, which wasn't requested. It's an auto-generated notes file for AI coding agents.

### Corrections made
None needed beyond not applying the forced audit fix.

### Git
- No git repository initialized (`--disable-git`), no GitHub repo, no commit, no push — per instructions.
- **Commit message / reference:** n/a yet.

---

## Milestone 1, Step 2 — Git setup and first commit

- **Date:** 2026-10-15
- **Objective:** Initialize a local git repo, connect the user's GitHub repo `openraiz-2` as `origin`, verify what would be committed, then make the first commit and push to `main` after the user's approval.

### Exact prompts
1. ```
   I will create the repo myself and give you the link to connect.
   ```
   → Agent explained how to create an empty repo (no README/.gitignore/license) and what it would do once given the link.
2. ```
   Here is the link: https://github.com/hcarvente/openraiz-2.git
   ```
   → Agent ran `git init -b main` and `git remote add origin <link>`, then showed `git status` and proposed a commit message. Nothing was staged, committed or pushed.
3. ```
   I approve creating our first commit and pushing it to the main branch, with a few requirements.
   Before committing:
   1. Confirm that the application runs successfully using npm run dev.
   2. Verify that the project files and folders have the expected names.
   3. Confirm that our development documentation file is named PROMPT_LOG.md, not AGELOG.md. If necessary, rename it.
   4. Update PROMPT_LOG.md to document our project initialization and Git setup. Include the exact prompts I've provided, the work completed, verification results, and any corrections made. Do not invent results or claim I performed tests I haven't confirmed.
   5. Run git status and verify that no environment files, credentials, or generated folders are included.
   6. Show me the final staged file list before committing.
   Once everything is verified, pause and ask me for final approval before creating the commit.
   Use this commit message:
   Initialize OpenRaiz 2.0 Next.js application
   After I approve, commit the changes and push them to origin/main.
   Once the push is complete, provide the commit hash and confirm that the files are visible on GitHub.
   Do not begin implementing Prisma, the database, API routes, or opportunity components yet.
   ```

### Commands executed
- `git init -b main`
- `git remote add origin https://github.com/hcarvente/openraiz-2.git`
- `git status --short -uall`, `git check-ignore -v node_modules .next .env.local`
- `npm run dev` (restarted fresh), `curl http://localhost:3000`, then stopped the server
- `ls -A`, `git status --short --ignored`
- `git add -A` (staging only), `git diff --cached --name-only`

### Files created or modified
- `.git/` created (local repo, remote `origin` set).
- `PROMPT_LOG.md` updated with this step.
- No application code changed.
This step affects only version control. No frontend, backend, API or database changes.

### Verification (by Claude, in the terminal)
- `npm run dev` started ("Ready in 284ms") and `curl http://localhost:3000` returned HTTP 200.
- Expected names present: `app/`, `public/`, `package.json`, `package-lock.json`, `next.config.mjs`, `jsconfig.json`, `eslint.config.mjs`, `.gitignore`, `README.md`, `AGENTS.md`, `PROMPT_LOG.md`.
- The documentation file is already named `PROMPT_LOG.md`. No `AGELOG.md` exists, so no rename was needed.
- `git status`: 19 untracked project files before this log entry. No `.env*` file exists. `node_modules/`, `.next/` and `.DS_Store` appear only as ignored (`!!`), so they are not committed.
- User-confirmed tests: none new in this step. The only user-confirmed test remains the browser check in Step 1.

### Errors / mistakes identified
- None found. (The prompt mentioned an `AGELOG.md`; no such file was ever created.)

### Corrections made
None.

### Git
- **Commit message:** `Initialize OpenRaiz 2.0 Next.js application`
- **Commit reference:** `be7a8f60c943954d1f1e33deb89b44a277e0df96` (short `be7a8f6`), 19 files, committed without a Co-Authored-By trailer at the user's request.
- **Push to `origin/main`:** done. `git ls-remote origin main` returned the same hash and the remote tree lists 19 files. Seeing the files on github.com: ⬜ PENDING user confirmation.
- **Follow-up prompts:** `Leave out the trailer and yes committhe 19 files and push to origin.` (also asked why localhost stopped rendering: the agent had stopped the dev server with `pkill` after its pre-commit check; restart with `npm run dev`), then `Update the log and commit it.`
- **Second commit:** `Record first commit in prompt log` (this log update; its hash is visible in `git log`).

---

## Milestone 1, Step 3 — Preserve original branding (logo-only header)

- **Date:** 2026-10-15
- **Objective:** Bring the original OpenRaiz visual identity (sprout logo, color palette, `system-ui` fonts, favicon) into the new app with a simple logo-only header. No nav links, About photo, footer, or opportunity cards.

### Exact prompts
1. ```
   Move on to that
   ```
   → "That" referred to the agent's proposed next step (copy branding assets, set colors). The agent first read the original repo (read-only) and proposed a plan, and asked two questions: the "OpenRaíz" vs "OpenRaiz" spelling, and whether to include nav pills.
2. ```
   Use OpenRaiz, logo-only header, go ahead
   ```
3. ```
   1'/Users/hernancarvente/Desktop/Screenshot 2026-10-15 at 2.47.20 PM (3).png'Here is a screenshot
   ```
   → User shared a screenshot of http://localhost:3000 in their browser.

### Commands executed
- Read-only inspection of the original repo: `grep` of `index.html`, `ls assets`, reading `css/styles.css`, `assets/favicon.svg`.
- `cp` of `favicon.svg`, `favicon-32.png`, `favicon-180.png`, `og-image.png` from the original `assets/` into `public/` (copy only; original untouched).
- `rm app/page.module.css app/favicon.ico`
- `npm run lint`, `npm run build`, `npm run dev`, `curl` of `/`, `/favicon.svg`, `/favicon-32.png`, `/favicon-180.png`
- `git status` in the original repo (read-only check).

### Files created or modified (frontend only — no API, Prisma, or database)
- **Created:** `public/favicon.svg`, `public/favicon-32.png`, `public/favicon-180.png`, `public/og-image.png` (copied), `components/SiteHeader.js`.
- **Modified:** `app/globals.css` (OpenRaiz color variables, fonts, header/logo styles), `app/layout.js` (removed Geist fonts; title "OpenRaiz"; favicon links), `app/page.js` (header plus placeholder "Opportunities" heading).
- **Deleted:** `app/favicon.ico` (default Next.js icon, would override ours), `app/page.module.css` (unused starter CSS).
- Not changed: the 5 unused starter SVGs in `public/` (`file.svg`, `globe.svg`, `next.svg`, `vercel.svg`, `window.svg`), `AGENTS.md`.

### What the code does
- `app/layout.js` wraps every page and sets the tab title and icons.
- `components/SiteHeader.js` is a React component rendering the original sprout SVG (uses `currentColor`, colored green by CSS) plus the wordmark "OpenRaiz", linking to `/` via `next/link`.
- `app/page.js` renders the header and a placeholder "Opportunities" heading.
- `app/globals.css` defines the brand colors as CSS variables (`--color-bg`, `--color-primary`, etc.) for reuse by later components.
- Note: the original CSS labels these colors "PLACEHOLDER brand variables", so they may change later.

### How the user tested
Opened http://localhost:3000 in Chrome and shared a screenshot.

### Results of testing
- **Agent (terminal):** `npm run lint` passes (after the fix below), `npm run build` compiles, the dev-server HTML contains the title "OpenRaiz", the favicon links, the wordmark and the heading, and the three favicon URLs return HTTP 200. Original repo: 0 changed files, still at commit `0113d35`.
- **User (screenshot):** The screenshot shows the cream background, the centered green sprout logo with "OpenRaiz", a green "Opportunities" heading with grey placeholder text, and a browser tab titled "OpenRaiz" with the green sprout icon. The user did not separately state pass/fail beyond sharing the screenshot.

### Errors or mistakes identified
- The agent's first `SiteHeader.js` used a plain `<a href="/">`; `npm run lint` flagged `@next/next/no-html-link-for-pages` (Next.js wants `<Link>` for internal links).
- The editor then briefly showed "Expected corresponding JSX closing tag for 'Link'". That was stale: it appeared between the agent's two edits (opening tag changed first, closing tag second). The final file has matching tags and lint and build pass.
- The screenshot filename contains a special space character before "PM", so the first attempt to open it failed; the agent located and copied it using a wildcard.

### Corrections made
- Replaced `<a>` with `<Link>` (import from `next/link`) in `components/SiteHeader.js`.

### Git
- **Commit message:** `Add OpenRaiz branding and logo-only header` (no Co-Authored-By trailer)
- **Commit reference:** `12d30923417c7f9c60bda591a9a9b9592f7256b6` (short `12d3092`), 11 files changed; pushed to `origin/main`. `git ls-remote origin main` returned the same hash.
- **Follow-up prompts:** `Yes, commit and push it` (approval of the message above), then `Yes, update the log and commit it`.
- **Second commit:** `Record branding commit in prompt log` (this log update; its hash is visible in `git log`).

---

## Milestone 2, Step 2.0 — Database plan (planning only)

- **Date:** 2026-10-15
- **Objective:** Plan Milestone 2 (Neon + Prisma) before touching anything. No files, packages or commands changed the project.

### Exact prompts
1. ```
   Yes, write the Milestone 2 plan
   ```
   → The agent checked current Prisma/Neon docs (read-only) and wrote the plan in chat.

### Result
Key findings, which led to the decisions in the next step:
- `npm install prisma` would install **8.0.0-rc.23**, a release candidate with a different workflow (`contract.prisma`, `db:init`, no `migrate dev`). Prisma 7.10.0 is the latest stable release and is still fully supported.
- Prisma 7 needs a driver adapter and a `prisma.config.ts`.
- Neon provides a pooled connection string (`-pooler` in the host) for the app and a direct one for migrations.
- Planned steps: 2.1 Neon + `.env`, 2.2 install Prisma, 2.3 configure Prisma, 2.4 verify the connection, 2.5 define the Opportunity model, 2.6 migrate, 2.7 optional seed.

### Git
No commit for this planning step.

---

## Milestone 2, Step 2.1 — Create and configure the Neon database

- **Date:** 2026-10-15
- **Objective:** Create the Neon project, put the pooled and direct connection strings in a git-ignored `.env`, add a placeholder `.env.example`, and verify the setup is secure. No Prisma, schema, tables, migrations or application code.

### Exact prompts
1. ```
   Create the Neon Database
   Copy and paste the following into Claude:
   I've reviewed your Milestone 2 database plan and approve the overall approach.
   Architectural decisions:
   1. Use Prisma ORM 7.10.0 rather than the Prisma 8 release candidate.
   2. Use @prisma/adapter-pg with PostgreSQL.
   3. Use Neon PostgreSQL for database hosting.
   4. Preserve the original OpenRaiz opportunity fields when we create the database model.
   5. Use DATABASE_URL for the pooled database connection and DIRECT_URL for the direct connection used by Prisma migrations.
   Your task is limited to Milestone 2, Step 2.1: Creating and configuring the Neon database.
   I have not yet confirmed whether I have an existing Neon account.
   Please guide me through:
   1. Creating or accessing my Neon account.
   2. Creating a new Neon project named openraiz-2.
   3. Selecting an appropriate database region.
   4. Locating the pooled and direct PostgreSQL connection strings.
   5. Securely configuring these values in my local .env file.
   Do not ask me to paste connection strings, passwords, or credentials into chat.
   Security requirements:
   - Confirm .env is excluded from Git.
   - Create an .env.example containing placeholder values only.
   - Verify the environment variables exist without displaying their contents.
   - Do not include credentials in PROMPT_LOG.md.
   - Do not commit or push anything without my approval.
   Documentation requirements:
   Update PROMPT_LOG.md with:
   - Milestone 2, Step 2.1
   - My exact prompt
   - Files created or modified
   - Commands executed
   - Verification results
   - Any problems encountered
   Important:
   Do not install Prisma, configure the Prisma schema, create database tables, run migrations, or write application code yet.
   Complete Step 2.1, verify the configuration is secure, and stop.
   Explain the results in plain English and wait for my approval before proceeding to Step 2.2.
   ```
2. ```
   I was given this link: npx neon skills -y
   ```
   → It is an `npx` command, not a link. The agent looked up the `neon` npm package (read-only; Neon's own CLI) and advised **not** running it: unverified, outside this step's scope, `-y` skips confirmation prompts, and the web console already provides the connection strings.
3. ```
   It was in the set up screen before showing me the connect option.
   ```
   → The agent kept its advice (skip it, not needed) and told the user how to reach the Connect dialog.
4. ```
   The connect dialog, currently says "production"
   ```
   → "production" is Neon's default branch name; use it as is.
5. ```
   Done
   ```
   → The user finished putting both strings in `.env`; the agent ran the checks below.

### Work done by the user (in the Neon web console and VS Code)
Created/opened a Neon account, created the project `openraiz-2`, copied the pooled and direct connection strings, and pasted them into `.env`. The user did not paste any credentials into chat. (The chosen region is not recorded here.)

### Commands executed
- `git check-ignore -v .env .env.local` and `git check-ignore -v .env.example`
- `cp .env.example .env` (created `.env` from the placeholder template for the user to edit)
- A small value-hiding checker script (kept outside the project, in the agent's scratchpad) that reports only whether each variable is set and whether the host looks right; it never prints values
- `git status --short`, `git ls-files | grep "^\.env"`, `git log --all --oneline -- .env`
- `npm view neon …` / `npm view neonctl …` (read-only registry lookups for the `npx neon skills` question)

### Files created or modified
- **Created:** `.env.example` (placeholders only, to be committed).
- **Created, not committed:** `.env` (real connection strings, ignored by Git).
- **Modified:** `.gitignore` — added `!.env.example` below `.env*`.
- **Modified:** `PROMPT_LOG.md` (this entry).
This step affects configuration only: no frontend, backend, API or database tables.

### Verification results
- `.env` is excluded from Git: `git check-ignore -v .env` matches `.gitignore:34 .env*`.
- `.env.example` is not ignored (after the fix below), so it will be committed. `git status` shows `.env.example` and the `.gitignore` change, and does not show `.env`.
- `.env` was never tracked or committed: `git ls-files` lists no `.env*` file and `git log --all -- .env` returns 0 commits.
- Checker output (values not displayed): `DATABASE_URL` is set, starts with `postgresql://`, host ends with `neon.tech`, has `-pooler`, has `sslmode=require`. `DIRECT_URL` is set, starts with `postgresql://`, host ends with `neon.tech`, has no `-pooler`, has `sslmode=require`.
- **Not tested yet:** an actual connection to the database. That is Step 2.4. The checks above verify only the shape of the strings.
- No credentials appear in this log.

### Errors or mistakes identified
- The existing `.gitignore` rule `.env*` also matched `.env.example`, so the placeholder file could never have been committed.
- The agent wrongly said the Neon branch would be called `main`. Neon's default branch is named "production" (the user spotted this in the Connect dialog).
- The user's Neon setup screen suggested running `npx neon skills -y`. It was not run.

### Corrections made
- Added `!.env.example` to `.gitignore` so the template is tracked while real `.env` files stay ignored.
- Corrected the branch-name statement to "production" (the default).

### Git
- **Commit message:** `Configure Neon database environment and document setup` (no Co-Authored-By trailer)
- **Pre-commit checks (agent, before committing):** `git status` showed only `.env.example`, `.gitignore` and `PROMPT_LOG.md` staged; `.env` ignored and unstaged; `.env.example` contained placeholders only; the log documented both corrections; a scan of the staged diff found no part of the real credentials (password, user name or host).
- **Commit reference:** `b0862be43aa8b9e5fac4769005653ab0268033ea` (short `b0862be`), 3 files changed; pushed to `origin/main`. `git ls-remote origin main` returned the same hash, and `git status` was clean after the push.
- **Follow-up prompt:** the user's "Commit Neon Configuration" prompt approving this commit and message (it also asked for this reference to be recorded here and for Step 2.2 not to begin yet).
- **Second commit:** `ead3d3f` `Record Neon configuration commit in prompt log` (log-only; pushed). Approved by the user's prompt `Yes, commit the log update`.

---

## Milestone 2, Step 2.2 — Install Prisma 7.10.0

- **Date:** 2026-10-15
- **Objective:** Install Prisma 7.10.0 and its supporting packages, pinned to exact versions. No schema, `prisma.config.ts`, database connection, tables, migrations or application code.

### Exact prompts
1. ```
   Yes, begin Step 2.2
   ```
   → Approval of the agent's Step 2.2 description (previous message): install `prisma`, `@prisma/client`, `@prisma/adapter-pg`, `pg`, `dotenv`, all pinned; change only `package.json` and `package-lock.json`; report any `npm audit` changes without applying forced fixes.

### Commands executed
- `npm view <package> version engines.node` for each package (read-only version check)
- `npm audit` (baseline before installing)
- `npm install --save-exact @prisma/client@7.10.0 @prisma/adapter-pg@7.10.0 pg@8.23.1 dotenv@18.0.8`
- `npm install --save-dev --save-exact prisma@7.10.0`
- `npx prisma --version`, `npm audit --json` (summarized by package), `npm run lint`, `npm run build`
- `diff` of `package.json` before and after, `git status --short`
- The value-hiding `.env` checker (same as Step 2.1)

### Files modified (no files created)
- `package.json`, `package-lock.json`.
This step affects project tooling only: no frontend, backend, API or database changes.

### What the packages do
- `prisma` (dev): the command-line tool for validating the schema, creating migrations and generating the client.
- `@prisma/client`: the library the app will use to run queries.
- `@prisma/adapter-pg` and `pg`: Prisma 7 requires a driver adapter; these connect it to PostgreSQL (Neon).
- `dotenv`: lets the Prisma command-line tool read `.env`.

### Verification results
- Versions pinned exactly: `@prisma/adapter-pg` 7.10.0, `@prisma/client` 7.10.0, `dotenv` 18.0.8, `pg` 8.23.1 (dependencies); `prisma` 7.10.0 (devDependencies). `package.json` diff shows only those five additions.
- `npx prisma --version` reports `prisma 7.10.0` and `@prisma/client 7.10.0` on Node v24.21.0, with the schema engine present.
- `npm run lint` passes; `npm run build` compiles successfully.
- `git status` shows only `package.json` and `package-lock.json` modified. No `prisma/` folder or `prisma.config.ts` exists yet. `.env` unchanged (checker: both variables still set).
- **User test:** ✅ The user ran `npx prisma --version` and reported that Prisma is the correct version (7.10.0). The exact output was not pasted into the log.

### Problems encountered
- **`npm audit` went from 5 to 9 high-severity findings.** The original 5 are the dev-lint chain (`braces` → … → `eslint-config-next`) noted in Step 1. The 4 new ones come from the Prisma command-line tool's own dependencies: `prisma` and `@prisma/config` (via `deepmerge-ts`: stack exhaustion when merging recursive objects) and `mysql2` (an auth-plugin issue in a MySQL driver; this project uses PostgreSQL). None of this code is imported by the app: the app uses only `@prisma/client` and the adapter. npm's `--omit=dev` audit still reports the 4 Prisma findings, because `@prisma/client` lists `prisma` as a peer dependency, so npm installs it alongside; that is an installation detail, not code the app runs. The 5 older findings are `eslint-config-next` lint tooling only. `npm audit` flags packages that exist in the tree, not code that is reachable. The agent recommended accepting these for the local-only Week 5 demo, not running `npm audit fix --force` (it would downgrade `eslint-config-next` to v14, a breaking change), and revisiting before any public deployment. Expect GitHub Dependabot alerts for the same packages. No forced fix was applied.
- **npm 11 warning:** install scripts for `prisma` (preinstall) and `@prisma/engines` (postinstall) were not allowed (`allowScripts`). `npx prisma --version` still works, so nothing was changed. If a later command fails because of this, that is the first thing to revisit.

### Follow-up prompts
2. ```
   Pause for a moment. Why is the audit showing so many things? Where are we going wrong?
   ```
   → The agent traced each finding with `npm audit --omit=dev --json`, `npm ls mysql2` and `npm ls braces`, and explained that nothing was done wrong (see Problems encountered).
3. ```
   Fix the log wording and continue
   ```
   → The agent corrected the log wording above.
4. ```
   Test: prisma is in the correct version. Commit and push
   ```
   → The agent recorded the user's test result, ran the pre-commit checks and committed.

### Errors or mistakes identified
- The agent first told the user the new findings were "in dev tooling, not in runtime app code" without checking npm's own runtime classification. When the user asked why the audit showed so much, `npm audit --omit=dev` showed 4 findings, which are the Prisma ones (via the `@prisma/client` → `prisma` peer dependency).

### Corrections made
- Rewrote the audit explanation in "Problems encountered" to say this precisely.

### Git
- **Commit message:** `Install Prisma 7.10.0 and PostgreSQL adapter` (no Co-Authored-By trailer)
- **Pre-commit checks (agent):** staged files were only `package.json`, `package-lock.json` and `PROMPT_LOG.md`; `.env` ignored and unstaged; the `package.json` diff showed exactly the five pinned packages; a scan of the staged diff found no part of the real credentials.
- **Commit reference:** `9507f8a837987fce147c5b5f50a07d73a4331e75` (short `9507f8a`), 3 files changed; pushed to `origin/main`. `git ls-remote origin main` returned the same hash, and `git status` was clean after the push.
- **Follow-up prompts:** `Test: prisma is in the correct version. Commit and push` (logged above), then `Yes, update the log and commit it`.
- **Second commit:** `Record Prisma install commit in prompt log` (log-only; its hash is visible in `git log`).

---

## Milestone 2, Step 2.3 — Configure Prisma without models

- **Date:** 2026-10-15
- **Objective:** Add the Prisma schema file (generator and PostgreSQL datasource only) and the Prisma 7 config file that points the command-line tool at `DIRECT_URL`, with an explicit output folder for the generated client, which Git ignores. No models, migrations, tables, Neon connection test, frontend or API changes.

### Exact prompts
1. ```
   Configure Prisma Without Models
   Copy and paste:
   I approve Milestone 2, Step 2.3: Configuring Prisma without creating database models.
   Please proceed with the configuration you proposed.
   Scope of work:
   1. Create prisma/schema.prisma containing the Prisma client generator and PostgreSQL datasource.
   2. Create prisma.config.ts following the installed Prisma 7 version's requirements.
   3. Configure Prisma's CLI to use DIRECT_URL from my existing .env file.
   4. Configure an explicit output directory for the generated Prisma client.
   5. Update .gitignore to exclude the generated client directory.
   Use the existing installed Prisma version. Do not upgrade packages or introduce new dependencies.
   Verification requirements:
   1. Run npx prisma validate.
   2. Confirm the configuration validates successfully.
   3. Verify that no database credentials appear in the source files.
   4. Confirm that .env remains excluded from Git.
   5. Explain in plain English what schema.prisma and prisma.config.ts each do.
   6. Identify the files created or modified.
   Important constraints:
   - Do not create the Opportunity model yet.
   - Do not run database migrations.
   - Do not create database tables.
   - Do not test the Neon connection yet.
   - Do not modify frontend components or API routes.
   - Do not modify the original OpenRaiz repository.
   Prompt log:
   Update PROMPT_LOG.md with the exact prompt, changes made, commands executed, verification results, and any mistakes or corrections.
   Do not include credentials or sensitive configuration values in the log.
   Git:
   Once verification passes, provide a summary of the changes and propose a Git commit message.
   Do not commit or push until I approve.
   Stop after Step 2.3 and wait for my next instruction.
   ```
   (Before this prompt, the user had been asked "Do you approve Step 2.3?" after the agent described it.)
2. ```
   Yes, commit and push it
   ```
   → Approval of the agent's summary and proposed commit message `Configure Prisma 7 schema and CLI config`. The user did not separately report running any test in this step.

### Commands executed
- `WebFetch` of the Prisma 7 PostgreSQL quickstart (read-only documentation lookup)
- Inspection of the installed package: `ls node_modules/@prisma/config/dist`, `grep` of its type definitions for the `env` helper
- `npx prisma validate`
- `git check-ignore -v generated/prisma/client.ts .env`
- A credential scan (script that prints only yes/no) over `prisma/schema.prisma`, `prisma.config.ts`, `.gitignore` and `PROMPT_LOG.md`
- `DIRECT_URL= npx prisma validate` (extra negative test with the variable blanked for one run)
- `npm run lint`, `npm run build`, `git status --short`

### Files created or modified
- **Created:** `prisma/schema.prisma`, `prisma.config.ts`.
- **Modified:** `.gitignore` (added `/generated/prisma`), `PROMPT_LOG.md` (this entry).
- No packages were added or upgraded. The original OpenRaiz repo was not touched.
This step affects database tooling configuration only: no frontend, backend, API or database changes.

### What the code does
- **`prisma/schema.prisma`:** the Prisma "blueprint" file. For now it only says which generator to use (`prisma-client`) and where to write the generated client (`generated/prisma`, outside `node_modules`), and that the database is PostgreSQL. It contains no models and no connection URL. The Opportunity model will go here later.
- **`prisma.config.ts`:** settings for the Prisma command-line tool (validate, migrate, generate). It loads `.env`, says where the schema and migrations folders are, and gives the tool the direct connection string from `DIRECT_URL`. It uses Prisma's `env()` helper, which raises a clear error if the variable is missing instead of silently using nothing. The running app does not read this file; the app will pass `DATABASE_URL` (pooled) to the client itself in a later step.
- **`.gitignore`:** ignores `/generated/prisma`, because the generated client is rebuilt by `npx prisma generate` and should not be committed.

### Verification results
- `npx prisma validate` printed "Loaded Prisma config from prisma.config.ts." and "The schema at prisma/schema.prisma is valid". `validate` loads the config and checks the schema; it did not connect to Neon, no tables or migrations exist, and no connection test was run.
- Negative test: with `DIRECT_URL` blanked, validate failed with `PrismaConfigEnvError: Cannot resolve environment variable: DIRECT_URL`, confirming the config really reads that variable.
- Credential scan: no part of the real password, user name or host appears in `prisma/schema.prisma`, `prisma.config.ts`, `.gitignore` or `PROMPT_LOG.md`.
- `.env` is still ignored (`.gitignore:34 .env*`); `generated/prisma/` is ignored (`.gitignore:39`). `git status` shows only `.gitignore` modified and `prisma.config.ts` and `prisma/` new.
- `npm run lint` passes and `npm run build` compiles, so the new TypeScript config file did not disturb the JavaScript app.
- **Not yet confirmed by the user:** the user has not yet reviewed these files or the results.

### Open question for a later step (Step 2.4)
The `prisma-client` generator writes TypeScript files, and this is a JavaScript project. The app's `lib/prisma.js` will import that generated client, and it is not yet tested that Next.js handles that. This will be checked when the client is generated and the connection is verified, and the fix (if one is needed) will be shown then.

### Errors or mistakes identified
None in this step.

### Corrections made
None.

### Git
- **Commit message:** `Configure Prisma 7 schema and CLI config` (no Co-Authored-By trailer)
- **Pre-commit checks (agent):** staged files were only `.gitignore`, `PROMPT_LOG.md`, `prisma.config.ts` and `prisma/schema.prisma`; no `.env` or generated files staged; a scan of the staged diff found no part of the real credentials.
- **Commit reference:** `c198f8e2ed18ba8841a7f3cb896aa4ed7290aa7e` (short `c198f8e`), 4 files changed; pushed to `origin/main`. `git ls-remote origin main` returned the same hash, and `git status` was clean after the push.
- **Follow-up prompt:** `Yes, update the log and commit it`.
- **Second commit:** `Record Prisma configuration commit in prompt log` (log-only; its hash is visible in `git log`).

---

## Milestone 2, Step 2.4 — Verify the Prisma ↔ Neon connection

- **Date:** 2026-10-15
- **Objective:** Generate the Prisma client, create the shared server-side client (`lib/prisma.js`) using the pg adapter and the pooled `DATABASE_URL`, and confirm with a temporary `SELECT 1` that the app's database configuration can talk to Neon. No models, tables, migrations, API routes or frontend components.

### Exact prompts
1. ```
   I approve Milestone 2, Step 2.4: Verifying the connection between Prisma and Neon PostgreSQL.
   Objective
   Confirm that our Next.js application's server-side database configuration can successfully communicate with Neon PostgreSQL.
   Scope of work
   1. Run npx prisma generate using our existing Prisma 7 configuration.
   2. Create lib/prisma.js using the installed @prisma/adapter-pg driver.
   3. Configure the Prisma Client to use DATABASE_URL, which contains our pooled Neon connection string.
   4. Ensure the Prisma Client is reusable across server-side requests and avoids unnecessary connection instances during Next.js development.
   5. Run a temporary database connection test using Prisma Client and a read-only SQL query: SELECT 1.
   Verification requirements
   - Confirm Prisma Client generates successfully.
   - Confirm the application can connect to Neon.
   - Confirm the query returns 1.
   - Confirm no database models or tables were created.
   - Confirm no migrations were executed.
   - Confirm the generated Prisma Client is excluded from Git.
   - Confirm the database credentials are not exposed in source files, terminal output, or documentation.
   - Run npm run build to verify the existing Next.js application still builds.
   If prisma generate fails because the schema contains no models, stop and explain the issue rather than adding models without my approval.
   If the connection fails, explain the exact error and propose the smallest possible correction. Do not change the architecture without my approval.
   Documentation
   Update PROMPT_LOG.md with:
   - Milestone 2, Step 2.4
   - My exact prompt
   - Files created or modified
   - Commands executed
   - Verification results
   - Errors or corrections
   - An explanation of what SELECT 1 demonstrated
   Git requirements
   After the tests pass:
   1. Review the changes.
   2. Show me the files that would be committed.
   3. Propose a commit message.
   4. Wait for my approval before committing or pushing.
   Important constraints
   Do not create the Opportunity model yet.
   Do not create database tables or run migrations.
   Do not implement API routes or frontend components.
   Do not modify the original OpenRaiz repository.
   Complete Step 2.4 and stop.
   ```
   (Before this prompt, the user had been asked "Do you want me to begin Step 2.4?" after the agent described it.)
2. ```
   Yes, commit and push it
   ```
   → Approval of the agent's summary and proposed commit message `Add shared Prisma client and verify Neon connection`. The user did not separately report running any test in this step.

### Commands executed
- `npx prisma generate` (output filtered so any URL would be hidden)
- Temporary test scripts kept **outside the project** in the agent's scratchpad (not committed): a small resolver so plain Node understands the `@/` import shortcut Next.js uses, a `SELECT 1` script, and a read-only table-listing script. Run with `node --env-file=.env --import <resolver> <script>`, with output filtered to hide URLs. The test imports the real `lib/prisma.js`.
- `ls prisma`, `git check-ignore -v generated/prisma/client.ts`, `git status --short`
- A credential scan (prints only yes/no) over `lib/prisma.js`, `prisma/schema.prisma`, `prisma.config.ts`, `PROMPT_LOG.md` and `.env.example`
- `npm run lint`, `npm run build`
- `git status --short` in the original `openraiz` repo (read-only check)

### Files created or modified
- **Created:** `lib/prisma.js`.
- **Generated, ignored by Git (not committed):** `generated/prisma/` (the Prisma client).
- **Modified:** `eslint.config.mjs` (added `generated/**` to the ignore list), `PROMPT_LOG.md` (this entry).
This step affects the **backend** only (server-side database access). No frontend, API routes or database tables.

### What the code does
- **`lib/prisma.js`:** creates one Prisma Client that talks to Neon through the `pg` adapter, using the pooled `DATABASE_URL`. It throws a clear error if the variable is missing. It is stored on `globalThis` in development so Next.js code reloads reuse the same client instead of opening a new set of database connections each time. It is for server code only: Route Handlers and Server Components, never client components, so the connection string never reaches the browser.
- **`SELECT 1`:** a query that asks the database to return the number 1 and touches no tables. It is read-only.

### Verification results
- `npx prisma generate` succeeded ("Generated Prisma Client (7.10.0) to ./generated/prisma") even though the schema has no models, so the "stop and explain" case did not occur.
- **Connection and query:** the test through the real `lib/prisma.js` returned `[{"result":1}]` in about 1.5 seconds. No timeout or `P1001` error occurred, so the Neon wake-up delay did not appear this time.
- **What `SELECT 1` demonstrated:** the generated client, the pg adapter, the pooled `DATABASE_URL`, the network path, TLS and the Neon credentials all work together end to end, and Neon accepted the connection and answered. It does **not** show that any tables or data exist, because none do yet.
- **No tables or migrations:** a read-only query of `information_schema.tables` found 0 user tables, and `prisma/migrations/` does not exist (`prisma/` contains only `schema.prisma`). No models exist and no migration command was run.
- **Git:** `generated/prisma/client.ts` is ignored (`.gitignore:39 /generated/prisma`). `git status` shows only `eslint.config.mjs` modified and `lib/` new.
- **Credentials:** the scan found no part of the real password, user name or host in the source files, the log or `.env.example`. Terminal output was filtered, and none of it contained a URL or password.
- `npm run lint` passes after the correction below, and `npm run build` compiles successfully.
- The original `openraiz` repo has 0 changed files.
- **Not yet confirmed by the user:** the user has not yet reviewed these results.

### Limitation of this test
The test ran in plain Node using a small resolver, not inside Next.js. Next's build does not compile `lib/prisma.js` yet, because nothing imports it, so the build passing does not prove it. Whether Next.js's bundler handles importing the generated TypeScript client from this JavaScript project will first be tested for real when the first API route uses `lib/prisma.js` (Milestone 3, GET endpoint). This follows the open question noted in Step 2.3.

### Warnings seen in the test output (not errors)
- **pg SSL-mode notice:** the `pg` driver says the `sslmode=require` in the connection string is currently treated like `verify-full` (the secure behavior) and that a future major version will change this. Nothing to do now. If it becomes a problem later, the connection string can say `sslmode=verify-full` explicitly.
- **`MODULE_TYPELESS_PACKAGE_JSON`:** plain Node noticed `lib/prisma.js` uses `import` syntax in a package without `"type": "module"`. This comes from running the file in plain Node for the test; Next.js is not affected. No change was made to `package.json`.
- **Prisma update notice** suggesting 8.0.0-rc.23 was ignored, per the decision to stay on 7.10.0.

### Errors or mistakes identified
- After `prisma generate`, `npm run lint` reported 8 warnings (all "unused eslint-disable directive") in the generated client files. Linting was clean before this step, because that folder did not exist yet.

### Corrections made
- Added `generated/**` to the ignore list in `eslint.config.mjs`, so generated code is not linted. Lint then passed with no warnings. This is a small change beyond the files named in the prompt, made only to fix the warnings above.

### Git
- **Commit message:** `Add shared Prisma client and verify Neon connection` (no Co-Authored-By trailer)
- **Pre-commit checks (agent):** staged files were only `lib/prisma.js`, `eslint.config.mjs` and `PROMPT_LOG.md`; no `.env` or generated files staged; a scan of the staged diff found no part of the real credentials.
- **Commit reference:** `b51b80ee2c3dbd0e9135837de9b6b046bbe8175a` (short `b51b80e`), 3 files changed; pushed to `origin/main`. `git ls-remote origin main` returned the same hash, and `git status` was clean after the push.
- **Follow-up prompt:** `Yes, update the log and commit it`.
- **Second commit:** `Record shared Prisma client commit in prompt log` (log-only; its hash is visible in `git log`).

---

## Milestone 2, Step 2.5 — Define the Opportunity model (schema only)

- **Date:** 2026-10-15
- **Objective:** Design and then implement the `Opportunity` model and its enums in `prisma/schema.prisma`, preserving the original OpenRaiz fields, and validate it. No migration, tables, import, API routes or frontend components.

### Exact prompts
1. ```
   Yes, update the log and commit it
   ```
   → Log commit for Step 2.4 (`0517a3e`). The agent then asked the user for the model decisions (enums vs strings, ID strategy).
2. ```
   I've reviewed your proposed Opportunity model decisions and approve the following:
   1. Use Prisma enums for:
   - Opportunity type
   - Opportunity status
   - Lived-experience relevance
   - Location type
   - Application method type
   Preserve the exact existing values from the original OpenRaiz data/opportunities.json unless you identify a specific compatibility issue.
   2. Use automatically generated IDs.
   Use a generated string ID with Prisma's cuid() default.
   Additionally, include an optional legacyId field to preserve the readable identifiers from the original OpenRaiz listings when we eventually migrate that data.
   The legacyId field should be unique when provided but nullable for new opportunities.
   3. Preserve the original opportunity fields.
   Use the original OpenRaiz JSON data structure as the reference.
   Preserve fields including:
   - Title
   - Organization
   - Description
   - Compensation
   - Opportunity type
   - Lived-experience relevance
   - Status
   - Source
   - Paid/unpaid indicator
   - Date posted
   - Last updated
   - Deadline
   - Location type
   - City
   - State
   - Address
   - Application method type
   - Application method value
   Use appropriate field types and make fields optional only when appropriate.
   4. Keep the model simple.
   Do not create User or Organization models yet.
   Do not add authentication or organizational relationships.
   Do not implement opportunity approval workflows yet.
   Preserve the original active and filled status values.
   5. Your task is limited to designing the database model.
   Before modifying files, show me:
   - The complete proposed Prisma schema.
   - An explanation of each field in plain English.
   - Which fields are required and optional.
   - The enums and their allowed values.
   - Any differences between the original JSON structure and the proposed database structure.
   - Any potential problems with importing the existing ten opportunities later.
   Important constraints
   Do not modify prisma/schema.prisma yet.
   Do not run migrations.
   Do not create database tables.
   Do not modify API routes or frontend components.
   Do not commit or push anything.
   I want to review and approve the complete schema before implementation.
   After presenting the model, stop and wait for my approval.
   ```
   → The agent analyzed all ten original records plus the original `docs/ADDING-AN-OPPORTUNITY.md` and `js/archive.js` (read-only), validated a draft schema in a throwaway copy outside the project, and presented the proposal. It identified one compatibility issue: the original docs and code also recognize an `archived` status that the data does not yet use. Nothing in the project was modified.
3. ```
   I've reviewed your proposed Opportunity model and approve the overall structure with the following decisions.
   Decision 1: Opportunity Status
   Include all three statuses:
   - active
   - filled
   - archived
   Preserve these as a Prisma enum.
   Archived opportunities should remain in the database but eventually be excluded from the public opportunities directory.
   An expired deadline should not automatically change the stored status to archived.
   Decision 2: Preserve Original Fields
   Keep all the existing OpenRaiz fields you identified.
   Preserve the original enum values, location structure, application methods, compensation information, and optional legacyId.
   Decision 3: Add Created Timestamp
   Add:
   createdAt DateTime @default(now())
   This should represent when a listing was created in the OpenRaiz 2.0 database.
   Preserve datePosted as a separate field representing the opportunity's publication date.
   Decision 4: Last Updated
   Keep your proposed lastUpdated approach for now, but document the distinction between the original listing's last-updated date and future database updates.
   Before we import any existing opportunities, verify that the original dates can be preserved correctly.
   Your task
   Implement the approved Opportunity model in prisma/schema.prisma.
   Do not make any unrelated changes.
   Verification
   1. Run npx prisma validate.
   2. Confirm the schema passes validation.
   3. Explain the enums and required fields.
   4. Confirm that all original opportunity fields remain represented.
   5. Explain what each new field does.
   6. Confirm no database tables were created.
   7. Confirm no migrations were executed.
   Documentation
   Update PROMPT_LOG.md with the exact prompt, changes, verification results, and any errors or corrections.
   Git
   Show me the modified files and propose a commit message.
   Do not commit or push without my approval.
   Important
   Do not run prisma migrate dev yet.
   Do not create database tables.
   Do not import opportunity listings.
   Do not build API endpoints or frontend components.
   Stop after schema validation and wait for my approval.
   ```
4. ```
   I approve the Step 2.5 Opportunity model and the proposed commit.
   Commit message:
   Define Opportunity model and enums in Prisma schema
   Please complete the following:
   1. Stage only prisma/schema.prisma and PROMPT_LOG.md.
   2. Keep design-reference/openraiz-2-mockup.png out of this commit. We will add it during our frontend development milestone.
   3. Confirm no environment files, credentials, generated Prisma files, or unrelated changes are staged.
   4. Review the staged diff for unintended changes.
   5. Commit the approved files and push to origin/main.
   6. Provide the commit hash and confirm the push succeeded.
   Documentation
   Confirm that PROMPT_LOG.md includes:
   - The original Step 2.5 prompt.
   - The schema decisions.
   - Validation results.
   - The date-handling tests and findings.
   - The unrequested prisma generate command as a minor scope deviation.
   Do not fabricate test results or corrections.
   If recording the final commit hash requires modifying the prompt log again, propose that as a separate documentation-only commit.
   Next step
   After completing the commit, prepare a plan for Step 2.6: Creating the Opportunities table through our first Prisma migration.
   The Step 2.6 plan should explain:
   - What migration command you propose running.
   - What tables and database objects will be created.
   - How we'll verify that the table exists in Neon.
   - How we'll verify that the fields and enums match our approved Prisma schema.
   - How we'll test date handling in PostgreSQL.
   - How we'll test whether Prisma preserves an explicitly supplied lastUpdated value during creation.
   - How we'll verify that our original OpenRaiz project remains unchanged.
   Do not run the migration yet.
   Stop after presenting the Step 2.6 plan and wait for approval.
   ```
   → The agent checked this log against the list above, fixed two gaps (labeled the `generate` command as a scope deviation; updated the stale user-review line), staged only the two approved files, and committed. The mockup image stays untracked until the frontend milestone.

### Commands executed
- Read-only analysis of the original repo: a Python script over `data/opportunities.json` (field presence, value sets, nulls, date formats, `isPaid` vs `compensation` consistency), `grep` of `js/*.js`, reading `docs/ADDING-AN-OPPORTUNITY.md`
- `npx prisma validate --schema <scratchpad copy>` (draft check during the proposal phase; project untouched)
- `npx prisma validate`, `npx prisma format --check`, `npx prisma format`, `npx prisma validate` (again), `npx prisma generate` (local only, writes the git-ignored `generated/prisma/` folder)
- Inspection of the generated `OpportunityCreateInput` type
- A date round-trip test over all original dates under five time zones (`TZ=UTC`, `America/Los_Angeles`, `Pacific/Kiritimati`, `Pacific/Pago_Pago`, `Asia/Tokyo`)
- A script that maps every original field to a model column
- A read-only query of `information_schema.tables` through `lib/prisma.js` (same harness as Step 2.4)
- `ls prisma`, credential scan, `npm run lint`, `npm run build`, `git status --short` in both repos

### Files created or modified
- **Modified:** `prisma/schema.prisma` (enums and the `Opportunity` model; comments added), `PROMPT_LOG.md` (this entry).
- **Regenerated, git-ignored:** `generated/prisma/` (so the local client matches the new schema).
- Not part of this step: an untracked `design-reference/openraiz-2-mockup.png` appeared in the project during this step. The agent did not create it (it appears to be a mockup the user added). It is left untouched and is not to be included in this step's commit.
This step affects the **database design** only: no frontend, API routes or tables.

### What the code does
- **Enums** (original values unchanged, lowercase): `OpportunityType` = job, internship, fellowship, volunteer; `LivedExperienceRelevance` = required, preferred, welcomed, relevant; `OpportunityStatus` = active, filled, archived; `LocationType` = remote, hybrid, onsite; `ApplyMethodType` = url, email.
- **Required fields:** `title`, `organization`, `description`, `type`, `livedExperienceRelevance`, `locationType`, `isPaid`, `compensation`, `datePosted`, `applyMethodType`, `applyMethodValue`.
- **Automatic or defaulted:** `id` (generated `cuid()`), `status` (defaults to `active`), `source` (defaults to `"owner-added"`), `createdAt` (defaults to now), `lastUpdated` (set by Prisma on each change).
- **Optional:** `legacyId` (unique when present), `city`, `state`, `address`, `deadline` (empty = rolling).
- **Status rule:** an expired `deadline` does not change the stored status; expiry is computed when listings are displayed, and `archived` listings stay in the database but will be excluded from the public directory.
- **`createdAt` (new):** when the row was created in the OpenRaiz 2.0 database. It is different from `datePosted`, the opportunity's publication date.
- **`legacyId` (from the proposal):** keeps the original readable ID from the old site.
- **`lastUpdated` vs the original:** in the original site, `lastUpdated` was a date set by hand when a listing changed. In 2.0, Prisma sets it to the current date whenever the database row changes. These are different meanings, so imported records must keep their original `lastUpdated` values rather than "today". This is documented in a comment in the schema.

### Verification results
- `npx prisma validate`: "The schema at prisma/schema.prisma is valid". It passed before and after `npx prisma format` (which only realigned columns; see Corrections).
- **All original fields represented:** 19 of 19 flattened original fields map to a column (`id` becomes `legacyId`; `location.*` and `applyMethod.*` become flat columns). The only column not in the original is `createdAt`.
- **No tables:** a read-only query found 0 user tables in Neon.
- **No migrations:** `prisma/migrations/` does not exist, and `prisma/` contains only `schema.prisma`.
- **Dates (pre-import verification, partial):**
  - Treating the original `YYYY-MM-DD` strings as UTC dates and formatting them back with `toISOString().slice(0, 10)` reproduced all 28 original dates exactly (10 `datePosted`, 10 `lastUpdated`, 8 non-null `deadline`) under all five time zones tested.
  - Formatting those same dates in local time was wrong for all 28 in the two Pacific time zones tested (`America/Los_Angeles`, `Pacific/Pago_Pago`), so any API or display code must use UTC date handling.
  - The generated create type accepts an explicit `lastUpdated` (`lastUpdated?: Date | string`), so an import should be able to supply the original value.
- **NOT yet verified:** this date testing exercised JavaScript only. Two things can only be proven against a real table and remain open for the migration/seed steps: (1) that Postgres and the pg adapter store and return `@db.Date` values without shifting a day, and (2) that Prisma keeps an explicitly supplied `lastUpdated` on create instead of overwriting it with today's date. These will be tested before any import (for example inside a rolled-back transaction). If (2) fails, the fallback is to manage `lastUpdated` in the API code.
- Credential scan: no part of the real credentials appears in the schema or the log. `npm run lint` passes and `npm run build` compiles. The original `openraiz` repo has 0 changed files.
- **User review:** the user reviewed the implemented model and approved it and the commit (prompt 4 below). The user did not report running any tests of their own in this step.

### Errors or mistakes identified
- **Minor scope deviation:** the agent ran `npx prisma generate` (regenerating the git-ignored client in `generated/prisma/`) although the prompt asked only for `npx prisma validate`. It changed no tracked files and touched no database; it was done to inspect the generated create type. The user identified it as a deviation in prompt 4.
- `npx prisma format --check` reported the first version of the schema as not formatted to Prisma's standard column alignment (cosmetic; validation still passed).
- While testing, the agent copied the schema to `/tmp` instead of the session scratchpad folder, against its instructions; the temporary copy was deleted immediately.

### Corrections made
- Ran `npx prisma format` (alignment of columns only, no content changes; validated again afterwards).
- Removed the stray `/tmp` copy.

### Git
- **Commit message:** `Define Opportunity model and enums in Prisma schema` (no Co-Authored-By trailer)
- **Pre-commit checks (agent):** only `prisma/schema.prisma` and `PROMPT_LOG.md` were staged; no `.env`, generated Prisma files or mockup staged (`design-reference/` left untracked at the user's request); the staged schema diff added 62 lines and removed 1 (the obsolete "No models yet" comment); a scan of the staged diff found no part of the real credentials.
- **Commit reference:** `a733f031f99894dd58a9fd75b6fe29423c066668` (short `a733f03`), 2 files changed; pushed to `origin/main`. `git ls-remote origin main` returned the same hash, and `git status` showed only the untracked `design-reference/`.
- **Follow-up prompt:** the user approved a documentation-only commit with the message `Record Opportunity model commit in prompt log` (the first part of their next message, quoted in full under Step 2.6A).
- **Second commit:** `Record Opportunity model commit in prompt log` (log-only; its hash is visible in `git log`).

---

## Milestone 2, Step 2.6A — Migration preparation (no database changes)

- **Date:** 2026-10-15
- **Objective:** Before creating the first migration: record the Step 2.5 commit hash (documentation-only commit), run read-only pre-flight checks, determine which Neon branch the local connection strings point to, plan a safer development branch, and review the proposed migration SQL against the approved schema. The migration is **not** generated or applied in this step, and the database is not changed.

### Exact prompts
1. ```
   I approve the documentation-only follow-up commit for Step 2.5.
   Use the commit message:
   Record Opportunity model commit in prompt log
   Confirm that only PROMPT_LOG.md is staged, review the diff, and verify that no credentials are included.
   Commit and push the documentation update to origin/main.
   Next: Step 2.6A — Migration preparation
   I approve beginning the migration preparation process, but I do not yet approve applying the migration.
   Before generating anything:
   1. Run npx prisma validate.
   2. Run npx prisma migrate status.
   3. Confirm the database schema is currently empty.
   4. Confirm the Git working tree is clean, apart from our previously approved untracked design-reference image.
   5. Determine which Neon branch our local database connection strings reference.
   Important Neon precaution
   Our existing Neon branch is named production.
   I would prefer to perform development migrations against a separate Neon development branch.
   Please determine whether our current configuration points to the production branch.
   If it does, explain the safest way to create a development branch and use it for this project.
   Do not create the branch or change connection strings without my approval.
   Migration preparation
   Once we have confirmed the appropriate development database, we will generate the initial migration SQL for review.
   The migration should create:
   - The five approved enum types.
   - The Opportunity table.
   - The unique index on legacyId.
   - Prisma's migration tracking infrastructure, where applicable.
   The Opportunity table should initially contain zero records.
   Review the proposed SQL against the approved Prisma schema.
   Do not apply the migration yet.
   Do not reset the database.
   Do not import sample opportunities.
   Do not create API endpoints or frontend components.
   Documentation
   Update PROMPT_LOG.md with the exact prompt, commands executed, verification results, and any issues encountered.
   Do not record tests as successful unless they actually ran.
   Stop and wait for my approval before making any database changes.
   ```
   (The user's message before this one asked the agent to plan Step 2.6; the agent's plan is in chat and is summarized under "Plan proposed" below.)

### Documentation-only commit (first part of the prompt)
- Only `PROMPT_LOG.md` staged; diff reviewed (it only replaced the two PENDING lines of Step 2.5's Git section with the commit details); a scan found no part of the real credentials.
- **Commit:** `7d3e9117b6f915a7a05b71ec419b22923cbdd6bd` (short `7d3e911`), `Record Opportunity model commit in prompt log`; pushed to `origin/main`; `git ls-remote` returned the same hash. `design-reference/` stayed untracked.

### Commands executed (all read-only; the project folder was not changed by them)
- `npx prisma validate`
- `npx prisma migrate status`
- An inline Node script (no files written) that opened a read-only connection with each connection string and ran `SELECT current_database()`, a count of user tables in `information_schema.tables`, a count of enum types, and `current_setting('neon.endpoint_id')`; it printed no hostnames or passwords (only yes/no results and a short non-reversible fingerprint)
- `npx prisma migrate diff --from-empty --to-schema prisma/schema.prisma --script` (offline: prints SQL from the schema, does not connect to the database), run twice, with an inline script that compared the SQL to `schema.prisma`
- `git status --short`, `git log --oneline -1`
All command output was filtered to hide URLs and Neon hostnames.

### Verification results (only what actually ran)
- **`npx prisma validate`:** the schema is valid.
- **`npx prisma migrate status`:** reported `No migration found in prisma/migrations` and `The current database is not managed by Prisma Migrate`. This is expected for an empty database that has never been migrated; it is not an error. (The tool's link text mentions baselining an "existing production database"; that does not apply here.)
- **Database is empty:** through both the direct and the pooled connection, database `neondb`, schema `public`: 0 user tables and 0 enum types.
- **Both connections work:** the direct and pooled strings both connected successfully (no timeout this time).
- **Git:** the working tree was clean except the approved untracked `design-reference/` folder (HEAD `7d3e911`).
- **Which Neon branch?** Findings:
  - The pooled and direct strings point to the **same Neon compute endpoint** (checked without printing it), the pooled string has `-pooler` and the direct one does not, and both use database `neondb`.
  - Neon identifies a branch by the compute endpoint in the connection string, but the branch's *name* is not exposed to the database, so the name cannot be read from the local files or by querying the database.
  - Evidence that it is the **`production`** branch: while copying the strings, the user reported that the Connect dialog's branch said "production" (the default branch of a new project). No other branch is known to exist.
  - Conclusion: the current configuration very likely points to `production`, but that is inferred, not proven by a tool. The user can confirm in the Neon console (Branches page, compare the branch's endpoint ID with the host in `.env`).
- **Proposed migration SQL reviewed against the approved schema (offline script):** 8 statements, all `CREATE`: `CREATE SCHEMA IF NOT EXISTS "public"` (a no-op, since it exists), 5 `CREATE TYPE ... AS ENUM`, 1 `CREATE TABLE "Opportunity"`, 1 `CREATE UNIQUE INDEX` on `legacyId`. Matches the schema: the 5 enums and their values; all 21 columns with the right types, required/optional status and defaults (`status` default `active`, `source` default `owner-added`, `createdAt` default current time; `id` and `lastUpdated` have no database default because Prisma fills them in); primary key on `id`. It contains no INSERT, DROP, ALTER, DELETE or UPDATE statement, so no rows are created. Prisma's tracking table `_prisma_migrations` is not in this SQL; Prisma creates it itself when a migration is first applied.
- **Not done in this step:** no migration file was generated (`prisma/migrations/` still does not exist), no migration applied, no table created, no reset, no import, no API or frontend change.

### Plan proposed (awaiting the user's decision)
Using a separate Neon development branch:
1. In the Neon console, create a branch named `development` from `production` (current data; the database is empty anyway) with a read-write compute.
2. From the Connect dialog on the `development` branch, copy the pooled and direct strings and replace the values in `.env`. Keep real credentials only in `.env` (never in chat or the log); keep only development credentials on this computer.
3. Re-run the same read-only checks to confirm the new strings point to a different endpoint than before, with 0 tables.
4. Then generate the migration file for review (`npx prisma migrate dev --create-only --name init`), review, and only after approval apply it.
Notes: a child branch can later be reset from its parent, which makes migration experiments safer. Migrations will later be applied to `production` separately (with `prisma migrate deploy`) when a deployment needs it. Branch limits depend on the Neon plan and should be checked in the console.

### Issues encountered
- My first automated check of the SQL reported one difference: a test that searched the SQL for the words INSERT, DROP, ALTER, DELETE or UPDATE matched "Update" inside the column name `lastUpdated`. A second check of the actual statement types (8 statements, all `CREATE`) showed this was a false positive in my check, not a problem with the SQL.
- The session's scratchpad folder became unavailable during this step, so the checks above ran as inline scripts with no temporary files; the older helper scripts from earlier steps (outside the project) were not used.
- The branch name cannot be determined by a tool (see above); this is stated as an inference.

### Errors or mistakes identified
- The false-positive check above (agent's check, not the SQL).

### Corrections made
- Replaced the word-search check with a statement-type check.

### Git
- **Commit message / reference:** this entry was committed together with the Step 2.6B entry in `bd29c859562d4dd13ec79692e1f1296044269654` (short `bd29c85`), `Record migration preparation and development branch setup in prompt log` (documentation only; pushed to `origin/main`). The original wording of this section ("PENDING — nothing committed for this entry") was written before that commit and was never updated; it was corrected during Step 5.1A when the agent noticed it. No file other than this log was involved.

---

## Milestone 2, Step 2.6B — Switch the local configuration to the Neon `development` branch

- **Date:** 2026-10-15
- **Objective:** Point the local `.env` at the new Neon `development` branch (child of `production`) instead of `production`, and verify the switch without printing any credentials. No migration, tables, import, API or frontend changes.

### Exact prompts
1. ```
   I've successfully created a new Neon database branch named development, using production as the parent.
   I can access the Connect dialog and retrieve both connection strings.
   Your task is to help me configure OpenRaiz 2.0 to use the new development database.
   Please guide me through updating my local .env file:
   - DATABASE_URL should contain the pooled connection string from the development branch.
   - DIRECT_URL should contain the direct connection string from the development branch.
   Do not display or print the connection strings or credentials.
   Verification requirements:
   1. Confirm both variables are configured.
   2. Verify both connection strings reference the same development database and its corresponding pooled/direct endpoints.
   3. Confirm they do not reference the original production endpoint.
   4. Test connectivity using a read-only query such as SELECT 1.
   5. Confirm the development database contains zero application tables and zero custom enum types.
   6. Confirm .env is excluded from Git.
   7. Confirm the production database has not been modified.
   8. Confirm the original OpenRaiz repository remains unchanged.
   If you cannot conclusively identify the Neon branch from the connection strings, explain how I can verify the correct endpoint in the Neon console.
   Documentation:
   Update PROMPT_LOG.md with this step, including the exact prompt, commands executed, verification results, and any corrections.
   Never include database credentials or connection strings in the log.
   Git:
   Once verification passes, propose a documentation-only commit.
   Do not commit or push without my approval.
   Important constraints:
   Do not generate or apply database migrations.
   Do not create tables or import opportunities.
   Do not modify frontend components or API routes.
   Stop after verifying the development database connection.
   ```
2. ```
   done
   ```
   → The user had replaced both values in `.env` (in VS Code, from the Neon Connect dialog with the `development` branch selected). The agent then ran the verification below.

### Work done by the user
Created the `development` branch in the Neon console (parent `production`), copied the pooled and direct strings from the Connect dialog with the `development` branch selected, and pasted them into `.env`. The user did not paste any credentials into chat. The old production strings are no longer on this computer (they can be re-copied from the Neon console by selecting the `production` branch).

### Commands executed (read-only)
- Before the switch: an inline Node script (no files written) compared each connection string's endpoint, via a short non-reversible fingerprint, to the production fingerprint recorded in Step 2.6A. It showed both strings still pointed to production, so the user was given the steps to update `.env`.
- After the switch: one inline Node script using the `pg` package that checked the variables and opened a read-only connection with each string, running `SELECT 1`, `SELECT current_database()`, a count of user tables in `information_schema.tables`, a count of custom enum types, and `current_setting('neon.endpoint_id')`. Output was filtered so no URL or hostname could appear, and the script printed only PASS/FAIL results and fingerprints.
- `git check-ignore -v .env`, `git status --short`, `git ls-files | grep "^\.env$"`
- In the original repo: `git status --short`, `git rev-parse --short HEAD`, and the same file-timestamp fingerprint used in Step 1.

### Verification results (only what actually ran)
All items below passed unless marked otherwise.
1. **Configured:** `DATABASE_URL` and `DIRECT_URL` are both set and not placeholders.
2. **Same development database, corresponding endpoints:** the `DATABASE_URL` host is the pooled one (`-pooler`); the `DIRECT_URL` host is the direct one; both belong to one compute endpoint; both use database `neondb` and `sslmode=require`.
3. **Not production:** the endpoint fingerprint of both strings differs from the production fingerprint recorded in Step 2.6A. The server-reported endpoint on each connection also differs from production's.
4. **Connectivity:** `SELECT 1` returned 1 through both the direct connection (about 1.4 s) and the pooled connection (about 0.5 s). The server-reported endpoint matched the URL host on each.
5. **Empty:** through both connections, application tables: 0; custom enum types: 0.
6. **`.env` excluded from Git:** `git check-ignore` matches `.gitignore:34 .env*`, `.env` is not tracked, and `git status` shows only the modified `PROMPT_LOG.md` and the approved untracked `design-reference/`.
8. **Original repo unchanged:** 0 changed files, commit `0113d35`, and the file-timestamp fingerprint matches the Step 1 baseline.
- **Item 7 — production not modified: NOT directly re-verified.** After the switch, the local files no longer hold production credentials, so the agent could not query production. What is established: the last read-only look at production (Step 2.6A) showed 0 tables and 0 enum types, and no command run since then writes to any database (only `SELECT` queries; no migration, no table creation, no import). To check directly, the user can open the `production` branch in the Neon console's Tables page; it should be empty.
- **Branch identity:** the branch name cannot be read from the connection strings or the database. The user can confirm in the Neon console (Branches page → `development`): its compute endpoint ID (starting `ep-`) should match the first part of the host in `.env`, ignoring `-pooler`. The user has not reported doing this check.
- **Not done (as required):** no migration file generated, no migration applied, no table created, no import, no change to frontend or API code.

### Issues encountered
None. The verification ran correctly on the first attempt.

### Errors or mistakes identified
None in this step.

### Corrections made
None.

### Git
- **Commit message:** `Record migration preparation and development branch setup in prompt log` (no Co-Authored-By trailer); documentation-only, includes the Step 2.6A and Step 2.6B entries.
- **Follow-up prompt:** `Yes, commit and push the documentation update`.
- **Pre-commit checks (agent):** only `PROMPT_LOG.md` staged; `.env` and `design-reference/` not staged; a scan of the staged diff found no credential, hostname or endpoint parts.
- **Commit reference:** `bd29c859562d4dd13ec79692e1f1296044269654` (short `bd29c85`), 1 file changed (`PROMPT_LOG.md`, 177 lines added); pushed to `origin/main`; `git ls-remote origin main` returned the same hash. Recorded here during Step 2.6C at the user's request.

---

## Milestone 2, Step 2.6C — Generate the initial migration file (not applied)

- **Date:** 2026-10-15
- **Objective:** Generate and review the SQL migration that will create the `Opportunity` table and its five enum types on the Neon `development` branch, **without applying it**.
- **Previous documentation commit:** `bd29c85` (`Record migration preparation and development branch setup in prompt log`).

### Exact prompts
1. ```
   I approve generating the initial Prisma migration file for OpenRaiz 2.0.
   Objective
   Generate the SQL migration that will eventually create our Opportunity table in the Neon development database.
   This step is for generating and reviewing the migration, not applying it.
   Pre-flight verification
   Before generating the migration:
   1. Confirm DATABASE_URL and DIRECT_URL still reference the Neon development database.
   2. Confirm the development database has zero application tables and zero custom enum types.
   3. Run npx prisma validate.
   4. Confirm the Git working tree contains no unexpected changes.
   5. Confirm .env remains excluded from Git.
   Migration generation
   Run:
   npx prisma migrate dev --create-only --name init
   Before running it, confirm that this command is supported by our installed Prisma version.
   If the command would reset the database, require destructive confirmation, or target an unexpected database, stop and ask for approval.
   Migration review
   After generating the migration:
   1. Identify all generated files.
   2. Show me the complete SQL migration.
   3. Confirm that it creates the five approved enum types.
   4. Confirm that it creates the Opportunity table with all 21 columns.
   5. Confirm the unique constraint on legacyId.
   6. Confirm that all required and optional fields match our approved schema.
   7. Confirm that createdAt and lastUpdated are configured as expected.
   8. Confirm that no existing application tables or data are being deleted or modified.
   9. Check whether the command created any Prisma migration bookkeeping objects.
   Important
   Do not apply the migration to create the Opportunity table.
   Do not run prisma migrate dev without --create-only.
   Do not run prisma migrate deploy.
   Do not reset the database.
   Do not import opportunities.
   Do not modify frontend components or API routes.
   Documentation
   Update PROMPT_LOG.md with:
   - The exact prompt.
   - Commands executed.
   - Files created or modified.
   - Migration verification results.
   - Any problems or corrections.
   - The previous documentation commit reference bd29c85.
   Do not include credentials or connection strings.
   Git
   After reviewing the migration, propose a commit message.
   Do not commit or push without my approval.
   Stop after generating and reviewing the SQL migration.
   Wait for my approval before applying it to Neon.
   ```
   (The user's message before this one was the approval of the documentation commit `bd29c85`, "Yes, commit and push the documentation update"; the agent's plan for this step was given in chat.)

### Pre-flight results (all ran before the migration command)
- **Development database:** both strings still reference the development endpoint (the short non-reversible fingerprint matches the one recorded in Step 2.6B) and neither references production.
- **Empty:** 0 application tables (this count also covers any `_prisma_migrations` table) and 0 custom enum types. The branch had the databases `neondb` and `postgres`. The database role is allowed to create databases, which the temporary shadow database needs.
- **`npx prisma validate`:** the schema is valid.
- **Command supported:** `npx prisma migrate dev --help` lists `--name` and `--create-only` ("Create a new migration but do not apply it") for the installed Prisma 7.10.0, and no reset or force option applies to this command line. The database was empty and had no migration history, so no reset prompt was expected. The command ran with no input available (`< /dev/null`) so any confirmation prompt would have failed instead of proceeding.
- **Git:** only the approved untracked `design-reference/` folder; HEAD was `bd29c85`. `.env` is excluded (`.gitignore:34 .env*`).

### Commands executed
- `npx prisma validate`, `npx prisma migrate dev --help`, `npx prisma --version`
- Inline Node scripts (no files written) using `pg` with read-only queries, output filtered to hide URLs and hostnames: the pre-flight checks above, and a post-command check of tables, enum types, `_prisma_migrations` and the list of databases
- **`npx prisma migrate dev --create-only --name init`** (the one migration command run; never run without `--create-only`)
- `cat` of the generated files; `npx prisma migrate diff --from-empty --to-schema prisma/schema.prisma --script` (offline) to compare with the generated SQL; an inline script reviewing the SQL against `schema.prisma`
- `git status --short`; in the original repo, `git status --short` and `git rev-parse --short HEAD`
No `prisma migrate deploy`, no reset, no migration applied.

### Files created
- `prisma/migrations/20261016011916_init/migration.sql` (44 lines): the SQL that will create the enums, table and index. The folder name uses a UTC timestamp, 2026-10-16 01:19:16 UTC.
- `prisma/migrations/migration_lock.toml`: a Prisma file recording the database provider (`postgresql`); Prisma says it should be committed.
No existing file was modified by the command. (This log entry modifies `PROMPT_LOG.md`.)

### Migration verification results (the SQL file was reviewed; it has not been run on any database)
1. **Five enum types:** `OpportunityType` (job, internship, fellowship, volunteer), `LivedExperienceRelevance` (required, preferred, welcomed, relevant), `OpportunityStatus` (active, filled, archived), `LocationType` (remote, hybrid, onsite), `ApplyMethodType` (url, email), each exactly matching the approved schema.
2. **Table and columns:** `CREATE TABLE "Opportunity"` with 21 columns (matching the 21 model fields) and a primary key on `id`.
3. **Unique constraint:** `CREATE UNIQUE INDEX "Opportunity_legacyId_key" ON "Opportunity"("legacyId")`; `legacyId` is nullable.
4. **Required vs optional:** 16 NOT NULL columns and 5 nullable ones (`legacyId`, `city`, `state`, `address`, `deadline`), matching the schema.
5. **`createdAt`:** `TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP`, so the database fills it in.
6. **`lastUpdated`:** `DATE NOT NULL` with **no** database default. Prisma sets it when it creates or updates a row; any insert that bypasses Prisma must supply it. (Whether Prisma preserves an explicitly supplied original value is still untested and is planned for after the table exists.) `datePosted` is `DATE NOT NULL` and `deadline` is `DATE` (calendar dates, no time zone). `status` defaults to `active`, `source` to `owner-added`.
7. **Nothing is deleted or modified:** all 7 statements are `CREATE` (5 `CREATE TYPE`, 1 `CREATE TABLE`, 1 `CREATE UNIQUE INDEX`). There is no `DROP`, `ALTER`, `DELETE`, `UPDATE` or `INSERT`, and the database had no application tables or data to affect.
8. **Compared with the earlier offline preview:** identical, except that the preview also began with `CREATE SCHEMA IF NOT EXISTS "public"` (a no-op because the schema already exists), which the generated file leaves out.
9. **Bookkeeping objects created by the command:** yes, one. After the command the development database contains one table, `public._prisma_migrations` (Prisma's migration-history table), with **0 rows**. It was created on the `development` branch only. The `Opportunity` table and the enum types were **not** created (0 custom enum types). The temporary shadow database was cleaned up (the branch again lists only `neondb` and `postgres`).
- **Original OpenRaiz repo:** 0 changed files, still at commit `0113d35`.
- **Production:** not touched; the local configuration points to the development branch only.

### Problems encountered
- My first comparison of the generated SQL with the offline preview reported "differ" because of a macOS `sed` syntax error in my own script, and the first line of the offline output (a "Loaded Prisma config" message) was not stripped. A corrected comparison showed the only real difference is the no-op `CREATE SCHEMA` statement described above.

### Errors or mistakes identified
- The faulty comparison script above (agent's script, not the migration).

### Corrections made
- Replaced the comparison with a Node script that strips the config message and the `CREATE SCHEMA` block before comparing.
- Filled in the earlier Step 2.6B commit reference (`bd29c85`).

### Git
- **Proposed commit message:** `Add initial Prisma migration for Opportunity table` (files: `prisma/migrations/20261016011916_init/migration.sql`, `prisma/migrations/migration_lock.toml`, `PROMPT_LOG.md`).
- **Commit message:** `Add initial Prisma migration for Opportunity table` (no Co-Authored-By trailer)
- **Follow-up prompt:** `Yes, commit and push the migration files`.
- **Pre-commit checks (agent):** only `prisma/migrations/20261016011916_init/migration.sql`, `prisma/migrations/migration_lock.toml` and `PROMPT_LOG.md` staged; `.env`, `design-reference/` and generated files not staged; a scan of the staged diff found no credential, hostname or endpoint parts.
- **Commit reference:** `4059b63c5f6d2102075f2dfb48ed43091c6db8cd` (short `4059b63`), 3 files changed (`migration.sql`, `migration_lock.toml`, `PROMPT_LOG.md`); pushed to `origin/main`; `git ls-remote origin main` returned the same hash. Recorded here during Step 2.6D. At the time of this commit the migration had **not** been applied.

---

## Milestone 2, Step 2.6D — Apply the initial migration to the Neon development database

- **Date:** 2026-10-15
- **Objective:** Apply the previously reviewed and committed migration `20261016011916_init` (commit `4059b63`) to the Neon **development** branch, and verify that PostgreSQL created exactly the approved `Opportunity` table and enum types. No test rows, date tests, import, API or frontend work, and no change to the schema.

### Exact prompts
1. ```
   I approve Milestone 2, Step 2.6D: Applying our initial Prisma migration to the Neon development database.
   Objective
   Apply our previously reviewed migration and verify that PostgreSQL creates the approved Opportunity table and enum types.
   Approved migration
   20261016011916_init
   This migration was committed to GitHub in commit 4059b63.
   Step 1 — Pre-flight verification
   Before making any database changes:
   1. Confirm DATABASE_URL and DIRECT_URL reference the Neon development branch.
   2. Confirm neither points to the production endpoint.
   3. Confirm the development database contains only the empty _prisma_migrations table.
   4. Confirm no Opportunity table or custom enum types exist.
   5. Run npx prisma validate.
   6. Run npx prisma migrate status and confirm exactly one pending migration.
   7. Confirm the Git working tree contains no unexpected changes.
   If any check fails, stop and explain the issue before proceeding.
   Step 2 — Apply migration
   Run:
   npx prisma migrate deploy
   Apply only the previously reviewed migration.
   Do not generate additional migrations or modify the schema.
   Do not run prisma migrate reset.
   Step 3 — Verify database structure
   After the migration:
   1. Confirm the Opportunity table exists in Neon development.
   2. Confirm all five approved enum types exist.
   3. Verify all 21 columns match our approved schema.
   4. Confirm the primary key and unique legacyId constraint exist.
   5. Confirm createdAt and lastUpdated have the expected definitions.
   6. Run npx prisma migrate status and confirm the database is up to date.
   7. Run the Prisma schema comparison and confirm there are no differences.
   8. Confirm _prisma_migrations contains one successful migration record.
   9. Confirm the Opportunity table contains zero records.
   Step 4 — Security
   Confirm:
   - The production database was not targeted.
   - No credentials were printed or committed.
   - .env remains excluded from Git.
   - The original OpenRaiz repository remains unchanged.
   Step 5 — Documentation
   Update PROMPT_LOG.md with:
   - The exact prompt.
   - Commands executed.
   - Migration results.
   - Database verification results.
   - Any errors or corrections.
   - The previous migration commit reference 4059b63.
   Important boundaries
   Do not insert test opportunities yet.
   Do not perform the date-handling tests yet.
   Do not import the ten original OpenRaiz listings.
   Do not create API endpoints or frontend components.
   Do not modify the approved Prisma schema.
   Git
   After verification, show me any modified files and propose a commit message.
   Do not commit or push without my approval.
   Stop after verifying the migration
   ```
   (The user's message before this one was the approval of the migration commit, "Yes, commit and push the migration files"; the agent's plan for this step was given in chat.)

### Pre-flight results (all ran before the migration; all passed)
1. `DATABASE_URL` and `DIRECT_URL` reference the development endpoint (the short non-reversible fingerprint matches the one recorded in Step 2.6B).
2. Neither points to the production endpoint.
3. The development database contained only `public._prisma_migrations`, with 0 rows.
4. No `Opportunity` table and 0 custom enum types.
5. `npx prisma validate`: valid.
6. `npx prisma migrate status`: "1 migration found in prisma/migrations. Following migration have not yet been applied: 20261016011916_init" (exactly one pending).
7. Git: only the approved untracked `design-reference/`; HEAD `4059b63`; `.env` excluded.

### Commands executed
- Inline Node scripts (no files written) using `pg`, output filtered to hide URLs and hostnames: the pre-flight checks, and the post-migration structure checks below
- `npx prisma validate`
- `npx prisma migrate status` (before and after)
- **`npx prisma migrate deploy`** (run with no input available; the only command that changed the database)
- `npx prisma migrate diff --from-config-datasource --to-schema prisma/schema.prisma --exit-code`
- `git status --short`, `git check-ignore -v .env`, `git ls-files`; in the original repo `git status --short`, `git rev-parse --short HEAD` and the file-timestamp fingerprint
Not run: `prisma migrate dev`, `prisma migrate reset`, any new migration generation, any insert.

### Migration result
`prisma migrate deploy` output: "1 migration found in prisma/migrations", "Applying migration `20261016011916_init`", "All migrations have been successfully applied." Only the reviewed migration was applied. The schema file was not modified.

### Database verification results (Neon development branch)
1. **`Opportunity` table exists:** the `public` schema contains exactly two tables: `Opportunity` and Prisma's `_prisma_migrations`.
2. **Five enum types exist** with exactly the approved values: `OpportunityType` (job, internship, fellowship, volunteer), `LivedExperienceRelevance` (required, preferred, welcomed, relevant), `OpportunityStatus` (active, filled, archived), `LocationType` (remote, hybrid, onsite), `ApplyMethodType` (url, email).
3. **21 columns** (schema: 21); every column's type and nullability matches the approved schema (checked column by column from the live database against `schema.prisma`).
4. **Keys:** the primary key is exactly `id`; a unique index `Opportunity_legacyId_key` exists on `legacyId`. The table's indexes are only that unique index and the primary key.
5. **Definitions:** `createdAt` is `timestamp(3)`, NOT NULL, default `CURRENT_TIMESTAMP`. `lastUpdated` is `date`, NOT NULL, with no database default (Prisma sets it). `status` defaults to `active` and `source` to `owner-added`.
6. **`npx prisma migrate status`:** "1 migration found in prisma/migrations. Database schema is up to date!"
7. **Schema comparison** (live database vs `prisma/schema.prisma`, `migrate diff --from-config-datasource --to-schema ... --exit-code`): "No difference detected", exit code 0.
8. **`_prisma_migrations`:** exactly 1 record, `20261016011916_init`, finished, not rolled back, 1 applied step, no error log; its recorded checksum equals the SHA-256 of the committed `migration.sql`.
9. **`Opportunity` contains 0 records.**

### Security checks
- **Production not targeted:** `migrate deploy` ran with the strings in `.env`, which still reference the development endpoint and not production (fingerprint check run after the migration). No production credentials exist locally.
- **No credentials printed or committed:** all output was filtered, and a scan found no credential, hostname or endpoint parts in this log entry. No file was staged or committed in this step.
- **`.env`** is excluded from Git (`.gitignore:34 .env*`) and untracked.
- **Original OpenRaiz repo:** 0 changed files, still at commit `0113d35`, file-timestamp fingerprint matches the Step 1 baseline.

### Not done (as required)
No test rows inserted, no date-handling or `lastUpdated` tests, no import of the ten original listings, no API or frontend changes. These remain for later steps.

### Problems encountered
- My first run of the structure-verification script crashed with "(intermediate value)... .join is not a function". The `pg` driver returned an array of enum labels as a text string, so the script's comparison code failed. This was a bug in the agent's check, not in the database. The migration-status and schema-comparison results from that same run were valid. After casting the labels to text in the query, the full structure check was re-run and passed. The reported results above come from the re-run.

### Errors or mistakes identified
- The verification-script bug above (agent's script, not the migration).

### Corrections made
- Fixed the script (cast enum labels to text) and re-ran the complete structure verification.
- Recorded the earlier migration commit reference `4059b63` in the Step 2.6C entry.

### Git
- **Files modified (uncommitted):** `PROMPT_LOG.md` only. The migration application changed the Neon development database, not any project file. `design-reference/` remains untracked.
- **Proposed commit message:** `Apply initial migration to Neon development database and record results`
- **Commit message:** `Apply initial migration to Neon development database and record results` (no Co-Authored-By trailer); documentation-only.
- **Follow-up prompt:** `Yes, commit and push the documentation update`.
- **Pre-commit checks (agent):** only `PROMPT_LOG.md` staged; `.env` and `design-reference/` not staged; a scan of the staged diff found no credential, hostname or endpoint parts.
- **Commit reference:** `5f0397020915e19beae9344ea6992707f5347cda` (short `5f03970`), 1 file changed (`PROMPT_LOG.md`); pushed to `origin/main`; `git ls-remote origin main` returned the same hash. Recorded here during Step 2.7.

---

## Milestone 2, Step 2.7 — Test Opportunity date and timestamp behavior

- **Date:** 2026-10-15
- **Objective:** Before building the API, verify with fictional rows (all rolled back) that PostgreSQL and Prisma handle opportunity calendar dates correctly across time zones, and find out whether Prisma preserves or overwrites a supplied `lastUpdated`.
- **Previous documentation commit:** `5f03970` (`Apply initial migration to Neon development database and record results`).

### Exact prompts
1. ```
   I approve Milestone 2, Step 2.7: Testing Opportunity database behavior.
   Objective
   Verify that Prisma and PostgreSQL correctly handle opportunity dates and automatic update timestamps before we begin building our API layer.
   Step 1 — Pre-flight
   1. Confirm both database connection strings reference our Neon development branch.
   2. Confirm neither references production.
   3. Verify the Opportunity table contains zero records.
   4. Confirm the migration status is up to date.
   5. Confirm the Git working tree contains no unexpected modifications.
   If any check fails, stop and explain the issue.
   Step 2 — Date handling
   Using clearly fictional opportunity records:
   1. Test datePosted with a value such as 2026-09-01.
   2. Test both a populated deadline and a null deadline.
   3. Read the stored values through Prisma and directly through PostgreSQL.
   4. Repeat the tests under UTC, America/Los_Angeles, and Pacific/Kiritimati.
   5. Confirm that calendar dates remain consistent across all three time zones.
   Explain the results in plain English.
   Step 3 — Test lastUpdated
   Test the following behaviors:
   1. Creating an opportunity with an explicitly supplied historical lastUpdated date.
   2. Creating opportunities using createMany with an explicitly supplied historical date.
   3. Updating an opportunity without supplying lastUpdated.
   4. Updating an opportunity while explicitly supplying lastUpdated.
   Confirm whether Prisma preserves or overwrites the supplied values.
   If the behavior differs from our intended data model, stop and explain the issue.
   Do not change the Prisma schema without my approval.
   Step 4 — Transaction safety
   All test records must be created inside transactions designed to roll back.
   Do not use transactions that automatically commit after successful tests.
   Run the tests sequentially.
   If a test fails, confirm the transaction was rolled back before proceeding.
   After all tests, verify that the Opportunity table contains zero records.
   If any records remain, stop and report them. Do not delete them without my approval.
   Step 5 — Final verification
   1. Confirm the migration status remains up to date.
   2. Confirm the database structure still matches our approved Prisma schema.
   3. Confirm the production database was not targeted.
   4. Confirm the original OpenRaiz repository remains unchanged.
   5. Confirm no credentials were exposed.
   Documentation
   Update PROMPT_LOG.md with:
   - The exact prompt.
   - Commands executed.
   - Test results.
   - Any failures or corrections.
   - What I learned about PostgreSQL dates and Prisma timestamps.
   - The previous documentation commit reference 5f03970.
   Do not fabricate test results or imply that I personally verified anything I haven't confirmed.
   Git
   After completing the tests:
   1. Show me any modified files.
   2. Propose a commit message.
   3. Wait for my approval before committing or pushing.
   Important constraints
   Do not import the original ten opportunities.
   Do not modify the Prisma schema.
   Do not create API endpoints or frontend components.
   Do not modify the original OpenRaiz project.
   Stop after completing Step 2.7.
   ```
   (The user's message before this one was the approval of the documentation commit `5f03970`, "Yes, commit and push the documentation update"; the agent's plan for this step was given in chat.)

### Pre-flight results (ran before any test; all passed)
Both connection strings reference the development endpoint; neither references production; `Opportunity` had 0 records; `_prisma_migrations` had 1 successful record; `npx prisma migrate status` said "Database schema is up to date!"; Git had only the approved untracked `design-reference/` folder (HEAD `5f03970`).

### Commands executed
- Inline Node scripts only (no files written, nothing to commit), output filtered to hide URLs and hostnames: the pre-flight checks, one test script run three times in a row (`TZ=UTC`, `TZ=America/Los_Angeles`, `TZ=Pacific/Kiritimati`), and the final verification
- `npx prisma migrate status` (before and after), `npx prisma migrate diff --from-config-datasource --to-schema prisma/schema.prisma --exit-code`
- `git status --short`, `git log --oneline -1`, `git check-ignore -v .env`; in the original repo `git status --short`, `git rev-parse --short HEAD`, and the file-timestamp fingerprint
**How the tests worked:** the script created the Prisma client the same way `lib/prisma.js` does (the pg adapter with the pooled `DATABASE_URL`, loading the generated client directly). Each test ran inside an interactive Prisma transaction that **always throws on purpose after the checks**, so PostgreSQL rolls it back and nothing is saved. "Read directly through PostgreSQL" means a raw SQL query (`"datePosted"::text` and so on) inside the same transaction, because uncommitted rows are visible only to that transaction. A separate connection (the direct string) counted the `Opportunity` rows after every test. All test rows were clearly fictional ("ZZ FICTIONAL TEST", organization "Fictional Test Org", `example.org` link, legacy IDs starting `zz-test-`). Tests ran sequentially.

### Test results (identical in all three time zones: 0 failed checks in each run)
**Dates**
- **D1** `datePosted` 2026-09-01 with `deadline` 2026-11-15: PostgreSQL stored exactly `2026-09-01` and `2026-11-15`; Prisma returned values that read back as the same UTC dates (as JavaScript dates they are `2026-09-01T00:00:00.000Z`). PASS.
- **D2** `deadline` null, `datePosted` 2026-09-22: PostgreSQL stored NULL; Prisma returned null; `datePosted` exact. PASS.
- **D3** edge dates (2026-03-08 and 2026-11-01, the US daylight-saving changes; 2026-12-31; 2027-01-01; 2028-02-29, a leap day), stored with `createMany`: all stored and returned unchanged. PASS.
- **D4** (informational) passing a plain `"2026-09-01"` string straight to Prisma was **rejected**: "Invalid value for argument `datePosted`: premature end of input. Expected ISO-8601 DateTime." So an API must convert date strings to dates first (for example `new Date("2026-09-01")`, which JavaScript reads as UTC midnight).
- **D5** (pitfall demonstration, informational) a date built from **local** midnight, `new Date(2026, 8, 1)`: stored as `2026-09-01` in UTC and in America/Los_Angeles, but as **`2026-08-31`** in Pacific/Kiritimati (UTC+14). This shows why dates must be built as UTC dates, not from local time.

**`lastUpdated`**
- **L0** create without a value: filled in automatically with today's **UTC** date. PASS.
- **L1** create with explicit `2020-01-15`: **preserved**. PASS.
- **L2** `createMany` with explicit `2019-06-30` and `2021-03-04`: both **preserved**; a third row with no value received today's UTC date. PASS.
- **L3** update without supplying `lastUpdated` (row created with `2020-01-15`): automatically set to today's UTC date. PASS.
- **L4** update while explicitly supplying `2022-02-02`: **preserved**. PASS.
**Transaction safety:** after every one of the tests above, the separate connection found `Opportunity` had 0 rows, so every transaction rolled back. After all tests in each run the table contained 0 rows. No record had to be reported or deleted.

### Final verification
1. `npx prisma migrate status`: "Database schema is up to date!"
2. Schema comparison (live database vs `prisma/schema.prisma`): exit code 0, no differences. Structure unchanged: tables `Opportunity` and `_prisma_migrations`, 21 columns, 5 enum types, indexes `Opportunity_legacyId_key` and `Opportunity_pkey`; `_prisma_migrations` has 1 finished, not-rolled-back record (`20261016011916_init`); `Opportunity` has 0 records.
3. Production not targeted: the strings used still match the development endpoint fingerprint recorded in Step 2.6B and differ from production's. No production credentials exist on this computer.
4. Original OpenRaiz repo: 0 changed files, commit `0113d35`, file-timestamp fingerprint matches the Step 1 baseline.
5. No credentials exposed: all output was filtered; a scan of this log found no credential, hostname or endpoint parts. `.env` is excluded from Git (`.gitignore:34 .env*`). The Prisma schema was not modified; no schema, API or frontend files changed.

### What was learned (explanations by the agent; the user has not yet confirmed these in their own words)
- **A PostgreSQL `DATE` is a plain calendar date.** It has no time and no time zone, so by itself it cannot "shift". All the date risk is in JavaScript, which represents a day as a moment in time (midnight).
- **Build date values as UTC dates** (for example `new Date("2026-09-01")`) and **read them back as UTC dates** (`toISOString().slice(0, 10)`). Done that way, all dates were exact in every time zone tested, including daylight-saving days and a leap day. Building from local midnight can store the wrong day, as the Kiritimati case showed.
- **Prisma will not accept a bare `"YYYY-MM-DD"` string**; the API must convert it to a `Date` (or a full ISO string) first.
- **`@updatedAt` does not stop you supplying a value.** In these tests, an explicitly supplied `lastUpdated` was kept on `create`, on `createMany`, and on `update`; when none is supplied, Prisma fills in today's date. So the original OpenRaiz `lastUpdated` dates can be preserved when the ten listings are imported, and ordinary edits will update the field automatically. The intended data model works as designed and **no schema change is needed**.
- **"Today" is the UTC date.** Prisma fills `lastUpdated` with the UTC calendar date. In the America/Los_Angeles run (local date 2026-10-15, UTC date 2026-10-16) it stored `2026-10-16`, a day ahead of the local calendar date. This matches the intended model as described ("today" in UTC) but may surprise someone in a US time zone in the evening. Whether to keep it or set the date in code is a decision for later; nothing was changed.
- **A database default is not what fills `lastUpdated`.** The column has no default in PostgreSQL; Prisma's client supplies the value, which is why raw SQL inserts must provide one.

### Limits of these tests
- All test rows were rolled back, so they did not test data that is committed and then read back later; persistence after a browser refresh is a Milestone 4 check.
- The values were set through Prisma with the adapter and the pooled connection. They did not test the original JSON files or the real import yet.
- The checks measured the date part of `lastUpdated`; Prisma passes a full timestamp to a date column, and only the UTC date was observed.

### Failures or problems
None. All 0 checks failed in all three runs, and no script errors occurred.

### Errors or mistakes identified
None in this step.

### Corrections made
None. (Filled in the earlier Step 2.6D commit reference `5f03970`.)

### Git
- **Files modified (uncommitted):** `PROMPT_LOG.md` only. No scripts were created in the project. `design-reference/` remains untracked.
- **Proposed commit message:** `Verify date and lastUpdated behavior in Neon development database`
- **Commit message:** `Verify date and lastUpdated behavior in Neon development database` (no Co-Authored-By trailer); documentation-only.
- **Follow-up prompt:** `Yes, commit and push the documentation update`.
- **Pre-commit checks (agent):** only `PROMPT_LOG.md` staged; `.env` and `design-reference/` not staged; a scan of the staged diff found no credential, hostname or endpoint parts.
- **Commit reference:** `4ee3d3464ce04d14dec99827f89638da1b2ddef5` (short `4ee3d34`), 1 file changed (`PROMPT_LOG.md`, 135 lines added); pushed to `origin/main`; `git ls-remote origin main` returned the same hash. Recorded here during Step 3.1.

---

## Milestone 3, Step 3.1 — GET /api/opportunities

- **Date:** 2026-10-16 (UTC; the work started on the evening of 2026-10-15 US Pacific time)
- **Objective:** Build the first working API endpoint, `GET /api/opportunities`, which reads opportunities from the Neon development database through Prisma and returns them as flat JSON, with generic error handling. No POST, PATCH, DELETE, frontend, import or schema changes.
- **Previous documentation commit:** `4ee3d34` (`Verify date and lastUpdated behavior in Neon development database`).

### Exact prompts
1. ```
   I approve Milestone 3, Step 3.1: Building the GET Opportunities API endpoint.
   Architectural decisions
   1. Use a flat JSON response structure matching our Prisma Opportunity model.
   2. Return all opportunities regardless of status for now, including active, filled, and archived.
   3. Format calendar-date fields as YYYY-MM-DD using UTC.
   4. Keep database queries and error handling on the server.
   5. Do not implement filtering, search, or authentication yet.
   Objective
   Create our first working API endpoint:
   GET /api/opportunities
   This endpoint should retrieve opportunity records from our Neon development database through Prisma.
   Step 1 — Create the API route
   Create:
   app/api/opportunities/route.js
   Implement a GET handler that uses our existing shared Prisma Client from lib/prisma.js.
   Retrieve all opportunities using prisma.opportunity.findMany().
   Step 2 — Date serialization
   Create a small helper:
   lib/serializeOpportunity.js
   This helper should convert date-only fields such as datePosted, deadline, and lastUpdated into YYYY-MM-DD strings using UTC.
   Preserve null values for optional dates.
   Preserve createdAt as a complete timestamp.
   Keep the API response flat.
   Do not introduce additional libraries unless necessary.
   Step 3 — Error handling
   If the database query fails, return HTTP 500 with a generic error message.
   Do not include database credentials, connection strings, SQL queries, or internal errors in the API response.
   Step 4 — Verification
   1. Start the Next.js development server.
   2. Test http://localhost:3000/api/opportunities.
   3. Confirm the endpoint returns HTTP 200.
   4. Confirm the response is an empty JSON array [], since our database currently contains zero opportunities.
   5. Confirm the request successfully reached the Neon development database.
   6. Run lint and build checks.
   7. Confirm the endpoint performs no database writes.
   8. Confirm no unexpected files or dependencies were introduced.
   If the Prisma Client import fails because we're using generated TypeScript code in a JavaScript project, explain the error and propose the smallest correction before making architectural changes.
   Step 5 — Documentation
   Update PROMPT_LOG.md with:
   - Milestone 3, Step 3.1.
   - This exact prompt.
   - Files created or modified.
   - Commands executed.
   - API verification results.
   - Any errors or corrections.
   - The previous documentation commit reference 4ee3d34.
   Explain in plain English how the request travels from the browser to Next.js, through Prisma, into PostgreSQL, and back.
   Step 6 — Git
   After verification:
   1. Review the changes.
   2. Show me the files that would be committed.
   3. Propose a descriptive commit message.
   4. Wait for my approval before committing or pushing.
   Important constraints
   Do not implement POST, PATCH, or DELETE.
   Do not add frontend components.
   Do not import the original opportunities.
   Do not modify the Prisma schema.
   Do not modify the original OpenRaiz repository.
   Do not commit or push without my approval.
   Stop after completing Step 3.1.
   ```
   (The user's message before this one was the approval of the documentation commit `4ee3d34`, "Yes, commit and push the documentation update"; the agent's plan and two questions for this step were given in chat, and this prompt contains the user's answers.)

### Before writing code: reading the bundled Next.js docs
The project's `AGENTS.md` says this Next.js version (16.4.1) has breaking changes and to read `node_modules/next/dist/docs/` first. The build output showed "Cache Components enabled" (set in `next.config.mjs` by `create-next-app`), so the agent read the Route Handler docs. They say that with Cache Components, a `GET` handler follows the same prerendering model as pages, and that prerendering **stops when the handler runs a database query**, so the handler runs at request time on every request. No caching setting or `use cache` was needed.

### Files created (nothing else was modified by the code; this log is modified)
- `app/api/opportunities/route.js`: the `GET` handler. It calls `prisma.opportunity.findMany()` (via `lib/prisma.js`) with a fixed order (`datePosted` newest first, then `id`), maps each row through the serializer and returns `Response.json(...)`. On any error it logs only the error's name and Prisma code on the server and returns HTTP 500 with `{"error":"Could not load opportunities."}`.
- `lib/serializeOpportunity.js`: converts `datePosted`, `deadline` and `lastUpdated` to `YYYY-MM-DD` strings using UTC (`toISOString().slice(0, 10)`), keeps `null` as `null`, keeps `createdAt` as a full ISO timestamp, and keeps the response flat (same fields as the database model).
- **Deviation to note:** the prompt asked for `findMany()` and did not mention ordering. The agent added `orderBy` so the list does not reshuffle in unpredictable order after edits. It is one line and easy to change or remove.
- `package.json` and `package-lock.json` are unchanged: no new dependencies.

### Commands executed
- Reading docs: `ls`, `sed`, `grep` over `node_modules/next/dist/docs/` (read-only)
- `npm run lint`; `npm run build` (twice, once to show the route table and once to filter the result)
- `npm run dev` (background): requests with `curl` (`-D -` to show status and headers, `-w` for timing, `od -c` for the exact body)
- A read-only inline Node script using `pg` that read PostgreSQL's table statistics (`pg_stat_user_tables`) for `Opportunity` before the first request and after all requests
- `DATABASE_URL="postgresql://nobody:notarealpassword@127.0.0.1:1/nodb" npx next start -p 3001` (a production-mode server with a **fake, unreachable** address, to test the error response; this never touched Neon or any real credential)
- `npx next start -p 3002` (production-mode server with the real development database, to check the built version)
- An inline serializer test under `TZ=UTC`, `America/Los_Angeles` and `Pacific/Kiritimati` using fictional objects (no database)
- `pkill` of the servers I started (Next.js 16 allows only one dev server per project folder, so the dev server was stopped before building and restarted afterwards); `git status --short`, `git diff --quiet -- package.json package-lock.json`; in the original repo `git status --short`, `git rev-parse --short HEAD` and the file-timestamp fingerprint
No migration, no schema change, no database write.

### API verification results (what the agent ran)
- **HTTP 200 and `[]`:** `GET http://localhost:3000/api/opportunities` returned `HTTP/1.1 200 OK`, `content-type: application/json` and exactly the 2-byte body `[]` (checked with `od -c`). The first request took about 0.7 s (it compiles the route and opens the database connection); later requests took about 0.04 s.
- **The request reached the Neon development database:** the same code returns 200 with the real `.env` and returns 500 with a fake address (below), so the response depends on the database call. In addition, PostgreSQL's statistics showed the `Opportunity` table had last been read about 15 seconds before the check, which is the `SELECT` that the endpoint issued.
- **Open question from Steps 2.3 and 2.4 answered:** Next.js's bundler imported the generated TypeScript Prisma client from this JavaScript project with no error, in both dev mode and the production build. No correction or architecture change was needed.
- **Production build:** `npm run build` compiled successfully and lists `ƒ /api/opportunities` ("server-rendered on demand", not prerendered). A production-mode server (`next start`) with the real development database also returned HTTP 200 and `[]`.
- **Error handling:** with the fake database address the endpoint returned `HTTP 500` and exactly `{"error":"Could not load opportunities."}`. A search of the response body for nine sensitive strings (the fake password, the fake user, `127.0.0.1`, `postgresql`, the fake database name, `ECONNREFUSED`, `prisma`, `select`, `Opportunity`) found none. The server console logged only `GET /api/opportunities failed: PrismaClientKnownRequestError P1001` (the error name and code).
- **Serializer (no database):** with fictional rows, in all three time zones: `datePosted` `2026-09-01`, `deadline` stays `null` (and `2026-11-15` when populated), `lastUpdated` `2026-09-20`, `createdAt` stays a full timestamp (`2026-10-16T03:04:05.678Z`), the field list is identical to the input (flat), and other nulls (`legacyId`, `city`) are kept. All passed. Because the table is empty, this is the only check of the date formatting so far; it was not exercised through the API with real rows.
- **No database writes:** the route calls only `findMany` (a search of the two source files found no `create`, `update`, `delete`, `upsert` or raw-SQL call). PostgreSQL's write counters for `Opportunity` were 45 inserts, 6 updates and 0 deletes before the first request, and exactly the same after all requests (the 45 and 6 are the rolled-back test rows from Step 2.7, which PostgreSQL counts even though they were rolled back). `Opportunity` still has 0 rows and `_prisma_migrations` still has 1.
- **Lint:** `npm run lint` passes with no warnings.
- **No unexpected files or dependencies:** `git status` shows only the new `app/api/`, `lib/serializeOpportunity.js` and the previously approved untracked `design-reference/`. `package.json` and `package-lock.json` are unchanged.
- **Original OpenRaiz repo:** 0 changed files, commit `0113d35`, file-timestamp fingerprint matches the Step 1 baseline. The Prisma schema was not modified. No credentials were printed (output was filtered), and a scan of this log found none.
- **Not yet confirmed by the user:** the user has not yet opened `http://localhost:3000/api/opportunities` in their own browser. The dev server was restarted afterwards so they can.

### How a request travels (plain English)
1. **Browser:** you open `http://localhost:3000/api/opportunities` (later, our React page will call it with `fetch`). The browser sends an HTTP `GET` request to the Next.js server running on your computer. Your browser never talks to the database.
2. **Next.js:** it matches the URL to the file `app/api/opportunities/route.js` and runs its `GET` function **on the server**.
3. **Prisma:** that function calls `prisma.opportunity.findMany()`. `lib/prisma.js` holds the one shared Prisma Client, which was created with the pooled `DATABASE_URL` from `.env` (read only on the server). Prisma turns `findMany()` into a SQL `SELECT` on the `Opportunity` table.
4. **PostgreSQL (Neon):** the `pg` driver sends the SQL over an encrypted connection to the Neon development branch. PostgreSQL reads the table and sends back the rows (right now zero).
5. **Back up the chain:** Prisma turns the rows into JavaScript objects (dates become JavaScript `Date`s). `serializeOpportunity` turns each date into `YYYY-MM-DD` text. `Response.json(...)` converts the list into JSON text, and Next.js sends it back to the browser as an HTTP response with status 200. Right now that text is `[]`.
6. **If something fails** (for example the database is unreachable), the `catch` block logs a short note on the server and sends only a generic 500 message, so no connection details or SQL ever reach the browser.

### Errors or mistakes identified
- None in the code or tests. The unrequested `orderBy` is listed above as a deviation. (Two automated notifications about servers I stopped on purpose were not from the user and required no action.)

### Corrections made
None.

### Git
- **Files that would be committed:** `app/api/opportunities/route.js`, `lib/serializeOpportunity.js` and `PROMPT_LOG.md`. `design-reference/` stays out.
- **Proposed commit message:** `Add GET /api/opportunities endpoint with date serialization`
- **Commit message:** `Add GET /api/opportunities endpoint with date serialization` (no Co-Authored-By trailer)
- **Follow-up prompt:** `Yes, commit and push the endpoint files`. The user did not report opening the endpoint in their own browser, so that check stays unconfirmed by the user.
- **Pre-commit checks (agent):** only `app/api/opportunities/route.js`, `lib/serializeOpportunity.js` and `PROMPT_LOG.md` staged; `.env`, `design-reference/`, `generated/` and `.next/` not staged; a scan of the staged diff found no credential, hostname or endpoint parts.
- **Commit reference:** `1222c8c545378414d76fdd3a5d269d85b3913597` (short `1222c8c`), 3 files changed (`route.js`, `serializeOpportunity.js`, `PROMPT_LOG.md`; 167 lines added); pushed to `origin/main`; `git ls-remote origin main` returned the same hash. Recorded here during Step 3.2.

---

## Milestone 3, Step 3.2 — POST /api/opportunities

- **Date:** 2026-10-16 (UTC; the work started on the evening of 2026-10-15 US Pacific time)
- **Objective:** Build `POST /api/opportunities`, which validates a flat JSON body on the server and saves a new opportunity in the Neon **development** database through Prisma. No PATCH, DELETE, frontend, import, authentication or schema changes.
- **Previous commit:** `1222c8c` (`Add GET /api/opportunities endpoint with date serialization`).

### Exact prompts
1. ```
   I approve Milestone 3, Step 3.2: Building the POST Opportunities API endpoint.
   Architectural decisions
   1. Accept a flat JSON request body matching our existing Opportunity model.
   2. Use server-side validation without adding new dependencies.
   3. Keep the response format consistent with our GET endpoint.
   4. Return HTTP 201 when an opportunity is successfully created.
   5. Return HTTP 400 for invalid input.
   6. Return a generic HTTP 500 response for unexpected server errors.
   Objective
   Implement:
   POST /api/opportunities
   This endpoint should validate submitted opportunity information and save a new record in our Neon development database using Prisma.
   Step 1 — Validation
   Create:
   lib/validateOpportunity.js
   Implement validation for:
   - Required text fields.
   - Allowed enum values.
   - Valid calendar dates using YYYY-MM-DD and UTC.
   - Optional or null application deadlines.
   - Valid location types.
   - Appropriate location information.
   - Valid application methods and values.
   - Required boolean values.
   - Basic compensation consistency.
   Reject unknown fields and prevent clients from supplying generated or protected fields such as id, createdAt, legacyId, and lastUpdated.
   Preserve our existing database model and enum values.
   Do not require deadlines to be in the future, because OpenRaiz may eventually contain historical opportunities.
   For compensation, reject obvious contradictions, such as isPaid: true with compensation: "Unpaid", but avoid introducing complicated compensation parsing.
   Step 2 — POST endpoint
   Extend:
   app/api/opportunities/route.js
   Add a POST handler that:
   1. Receives JSON.
   2. Validates the submitted information.
   3. Converts approved date strings into UTC Date objects.
   4. Creates the opportunity using prisma.opportunity.create().
   5. Returns the created opportunity using our existing serialization helper.
   6. Responds with HTTP 201.
   Invalid JSON or invalid fields should return clear HTTP 400 responses.
   Unexpected failures should return a generic HTTP 500 response without exposing database details.
   Security
   This endpoint is currently intended only for local development.
   We do not have authentication or authorization implemented.
   Do not deploy or expose unrestricted administrative write endpoints publicly.
   Keep all database operations on the server.
   Step 3 — Testing
   Test the following scenarios:
   1. A valid fictional opportunity creates successfully.
   2. An empty required field is rejected.
   3. An invalid enum is rejected.
   4. An impossible calendar date is rejected.
   5. Malformed JSON is rejected.
   6. Invalid application URLs or email addresses are rejected.
   7. Unknown or protected fields are rejected.
   8. An obvious compensation contradiction is rejected.
   Verify that invalid requests do not create database records.
   After successfully creating an opportunity, call:
   GET /api/opportunities
   Confirm that the saved opportunity appears in the response and remains available on a subsequent request.
   Test data decision
   Keep one clearly fictional opportunity in the Neon development database for our upcoming frontend work.
   Before removing any additional test records, tell me which records would be removed and ask for approval.
   Do not modify production data.
   Step 4 — Verification
   1. Confirm POST returns HTTP 201 for a valid request.
   2. Confirm invalid requests return HTTP 400.
   3. Confirm GET retrieves the newly created opportunity.
   4. Confirm the data is stored in Neon development.
   5. Run lint and build checks.
   6. Confirm no database schema changes or migrations were introduced.
   7. Confirm the original OpenRaiz repository remains unchanged.
   Step 5 — Documentation
   Update PROMPT_LOG.md with:
   - Milestone 3, Step 3.2.
   - This exact prompt.
   - Files created or modified.
   - Commands executed.
   - Test results.
   - Errors and corrections.
   - An explanation of the POST request's data flow.
   - The previous commit reference 1222c8c.
   Do not fabricate verification results.
   Step 6 — Git
   After verification:
   1. Show me the changed files.
   2. Propose a descriptive commit message.
   3. Wait for my approval before committing or pushing.
   Important constraints
   Do not implement PATCH or DELETE.
   Do not build frontend components.
   Do not import the original ten opportunities.
   Do not modify the Prisma schema.
   Do not introduce authentication.
   Stop after completing Step 3.2.
   ```
   (The user's message before this one was the approval of the Step 3.1 commit `1222c8c`, "Yes, commit and push the endpoint files"; the agent's plan and two questions for this step were given in chat, and this prompt contains the user's answers.)

### Files created or modified
- **Created:** `lib/validateOpportunity.js` (the validator, no new dependencies).
- **Modified:** `app/api/opportunities/route.js` (added the `POST` handler, the imports, and a security comment at the top; the `GET` handler is unchanged), `PROMPT_LOG.md` (this entry).
- `package.json`, `package-lock.json` and everything in `prisma/` are unchanged (no new dependency, no schema change, no migration).

### What the validator does (`lib/validateOpportunity.js`)
Returns `{ ok: true, data }` (ready for `prisma.opportunity.create()`) or `{ ok: false, errors }` (a list of `{ field, message }` that only describes the client's own input).
- **Body:** must be a JSON object (not an array, null, string or number).
- **Unknown fields** are rejected. **Protected fields** `id`, `legacyId`, `createdAt`, `lastUpdated` are rejected with "set by the server". **Deviation to note:** the agent also made `source` protected, because the original data and docs treat `source` as server-controlled (`owner-added`; `employer-submitted` is reserved for a future submission workflow). The server sets it through the database default.
- **Required text:** `title` (max 200), `organization` (200), `description` (5,000), `compensation` (200), `applyMethodValue` (500). Text is trimmed; empty, whitespace-only, missing or non-text values are rejected. Optional `city`, `state` (100 each) and `address` (300) may be missing, null or empty (stored as null).
- **Enums:** `type`, `livedExperienceRelevance`, `locationType`, `applyMethodType` (required) and `status` (optional; the database default `active` applies when it is missing) must match the approved values exactly (case-sensitive). The lists in the validator were checked to match the Prisma enums.
- **Boolean:** `isPaid` is required and must be `true` or `false` (not the text "true").
- **Dates:** `datePosted` (required) and `deadline` (optional, null or empty means rolling) must be written `YYYY-MM-DD`, be a real calendar date (so `2026-02-30` and `2027-02-29` fail), and fall in the years 2000 to 2100; they become UTC midnight `Date` objects. Past deadlines are allowed.
- **Location:** remote listings must have no city, state or address; hybrid and onsite listings must have a city and a state (address stays optional), following the original docs.
- **Application method:** `url` values must be `http://` or `https://` links (no spaces, host name containing a dot, so `javascript:`, `ftp:` and `https://localhost` are rejected); `email` values must look like an email address.
- **Compensation consistency (no pay parsing):** `isPaid: true` is rejected when the compensation text starts with "unpaid", "not paid", "no pay", "no compensation" or "volunteer"; `isPaid: false` is rejected when it starts with "paid". Text like "Stipend, $500/month" is accepted either way.
- These strictness choices (years 2000 to 2100, a dot required in the URL host name, city and state required for hybrid or onsite) are the agent's judgment calls and can be relaxed.

### What the POST handler does (`app/api/opportunities/route.js`)
1. Reads the JSON body; if it is empty or malformed, returns HTTP 400 `{"error":"Request body must be valid JSON."}`.
2. Validates it; if invalid, returns HTTP 400 `{"error":"Invalid opportunity data.","details":[{field, message}, ...]}`.
3. Calls `prisma.opportunity.create({ data })` and returns the new row through `serializeOpportunity` with HTTP 201.
4. If the database call fails, logs only the error's name and code on the server and returns HTTP 500 `{"error":"Could not create the opportunity."}`.
The top of the file now states that POST is for local development only because there is no authentication.

### Commands executed
- `npm run lint`, `npm run build`
- Validator unit tests: an inline Node script (no database) with 71 cases; a check that the validator's value lists match the Prisma enums (`generated/prisma/enums.ts`); a check that every model field is exactly one of required, optional or protected
- `curl` against the running dev server (`http://localhost:3000/api/opportunities`): 25 invalid POST requests, 2 valid POST requests, and GET requests
- Read-only inline Node scripts using `pg` (output filtered to hide URLs and hostnames): row counts and PostgreSQL's write counters for `Opportunity` before and after, and a read of the stored rows as raw text
- `npx prisma migrate status` and `npx prisma migrate diff --from-config-datasource --to-schema prisma/schema.prisma --exit-code`
- `npx next start -p 3001` with a fake, unreachable `DATABASE_URL` (a made-up local address and password, never a real credential) to test the 500 response; `pkill` of the servers I started (the dev server was stopped before building and restarted afterwards)
- `git status --short`, `git diff --quiet`; in the original repo `git status --short`, `git rev-parse --short HEAD` and the file-timestamp fingerprint
No migration, no schema change, no delete or update of any row.

### Test results (only what actually ran)
**Validator alone (no database):** 71 cases, 0 failures: 10 valid inputs accepted (including remote with null or missing deadline, a past deadline, no address, status archived, an email apply method, "Stipend" text with isPaid true, and the leap day 2028-02-29) and every invalid case rejected with the right field named.

**The 8 scenarios through the real API (dev server), all with fictional data:**
1. **Valid fictional opportunity:** HTTP 201 Created, twice (see below).
2. **Empty required field:** HTTP 400 for an empty `title` and a missing `organization`.
3. **Invalid enum:** HTTP 400 for `type: "contract"` and `locationType: "moon"`, with the allowed values listed.
4. **Impossible calendar date:** HTTP 400 for `datePosted: "2026-02-30"` and `deadline: "2026-13-01"`.
5. **Malformed JSON:** HTTP 400 `{"error":"Request body must be valid JSON."}` for truncated JSON, plain text, an empty body and single-quoted JSON; HTTP 400 "must be a JSON object" for valid JSON that is an array or `null`.
6. **Invalid URL or email:** HTTP 400 for `not a url`, `javascript:alert(1)` and the email `a@b`.
7. **Unknown or protected fields:** HTTP 400 for `isAdmin` ("Unknown field") and for `id`, `createdAt`, `legacyId` and `lastUpdated` ("set by the server and cannot be supplied").
8. **Compensation contradiction:** HTTP 400 for `isPaid: true` with "Unpaid", and for `isPaid: false` with "Paid, $24/hr". A request with three mistakes returned all three in `details`.
All 25 invalid requests returned HTTP 400. **Invalid requests created no records:** after all of them, `Opportunity` had 0 rows and PostgreSQL's insert counter was unchanged at 45 (the rolled-back test rows from Step 2.7), so not even an insert attempt reached the database.

**Valid creates and read-back:**
- Valid POST #1 (hybrid fellowship, `deadline` 2026-12-15) returned HTTP 201 Created with a JSON content type. The agent did not capture its response body (see Errors).
- Valid POST #2 (remote volunteer, no `deadline`, no `status`) returned HTTP 201 and the complete body was captured: 21 fields, `legacyId` null, `status` `active` (database default), `source` `owner-added`, `datePosted` `2026-10-16`, `deadline` null, `lastUpdated` `2026-10-16`, a cuid-style `id`, and `createdAt` as a full timestamp.
- `GET /api/opportunities` returned both records (2 rows), and a second, later GET returned both again. The POST #2 body is identical JSON (same 21 fields, same key order, same formats) to the matching GET item, so the response format is consistent with GET.
- **Stored in Neon development:** a direct read from the development branch (confirmed by the endpoint fingerprint from Step 2.6B; not production) found exactly these 2 rows, with `datePosted` `2026-10-16` and the deadlines stored as `2026-12-15` and null, `lastUpdated` `2026-10-16`, and `createdAt` timestamps. PostgreSQL's insert counter rose from 45 to 47 (exactly the two successful creates).

**Unexpected server error (production build with a fake unreachable database address, no real database involved):** a valid POST returned HTTP 500 and exactly `{"error":"Could not create the opportunity."}`. A search of the response for ten sensitive strings (the fake password, the fake user, `127.0.0.1`, `postgresql`, the fake database name, `ECONNREFUSED`, `prisma`, `insert`, `Opportunity"`, `P1001`) found none. The server console logged only `POST /api/opportunities failed: PrismaClientKnownRequestError P1001`. An invalid POST in the same situation still returned the clear 400 message (validation runs before the database is touched); the status code of that last request was cut off by my command and was not displayed, though the 400 behavior was already shown in the main run.

**Other verification:** `npm run lint` passes; `npm run build` compiles successfully and `/api/opportunities` is `ƒ (Dynamic)`. `npx prisma migrate status`: "Database schema is up to date!"; the live-database-vs-schema comparison returned exit code 0 (no differences); `_prisma_migrations` still has 1 record; `prisma/migrations/` still holds only the original migration. The original OpenRaiz repo: 0 changed files, commit `0113d35`, fingerprint matches the Step 1 baseline. Production was not targeted (the strings in use still match the development endpoint fingerprint). No credentials were printed (output was filtered), and a scan of this log found none.
- **Not yet confirmed by the user:** the user has not run any of these requests or looked at the data themselves.

### Test data currently in the Neon development database (both clearly fictional, both committed)
1. **Keep (as the user instructed):** `cmvabung80000uoitdge182wa`, "Youth Policy Fellow (Fictional Test Listing)", Fictional Policy Collective, hybrid fellowship in Oakland CA, paid, deadline 2026-12-15.
2. **Extra, removed after the user's approval:** `cmvabv9ni0001uoitauuqxrpq`, "Peer Mentor (Fictional Test Listing 2)", Fictional Harbor Collective, remote unpaid volunteer. It existed only because the first request's response body was not captured. The agent proposed its removal in chat; the user approved it (prompt 2 below), and it was deleted (see "Approved deletion").
Nothing was changed in production.

### Data flow of a POST request (plain English)
1. **Browser or client:** something (right now `curl`; later the React form) sends an HTTP `POST` to `/api/opportunities` with the opportunity written as JSON text in the body.
2. **Next.js:** it runs the `POST` function in `app/api/opportunities/route.js` on the server.
3. **Parse:** the function reads the body as JSON. If it is not valid JSON, it stops and answers 400.
4. **Validate:** `validateOpportunity` checks every field (required text, allowed enum values, real dates, location, apply link or email, pay consistency, unknown or protected fields). If anything is wrong, it stops and answers 400 with a list of what to fix. No database is touched.
5. **Convert:** a valid body becomes clean data: text trimmed, empty optional values as null, and dates turned into UTC `Date` objects.
6. **Prisma:** `prisma.opportunity.create({ data })` (from `lib/prisma.js`) turns that into a SQL `INSERT`. Prisma fills in the generated fields: a new `id`, `createdAt`, `lastUpdated`, and the defaults for `status` and `source`.
7. **PostgreSQL (Neon):** the `pg` driver sends the `INSERT` over an encrypted connection to the development branch. PostgreSQL checks the table rules (required columns, enum values, unique `legacyId`), stores the row and returns it.
8. **Back to the client:** Prisma hands the saved row back to the route, `serializeOpportunity` formats the dates, and the route answers HTTP 201 with the new opportunity as JSON. A later `GET` reads that same row from PostgreSQL.
9. **If the database fails** at step 6 or 7, the route logs a short note on the server and answers a generic 500, so no connection details or SQL reach the client.

### Errors or mistakes identified
- I ran the first valid POST with `curl -i ... | sed`, which dropped the response body. I confirmed the status (HTTP 201) but not the body, and could not repeat the request without creating a duplicate. I sent a second valid request (with a different record, which also covered remote, no deadline and the default status) and captured its full body. This created the extra test record listed above.
- My first check that the validator's field lists cover every model field crashed: the arrays have trailing commas, which strict JSON parsing rejects. This was a bug in the agent's check script, not in the validator. The check was rewritten and passed (11 required, 5 optional, 5 protected; all 21 model fields covered exactly once).
- The agent added `source` to the protected fields and set the strictness limits described above; these go beyond the prompt's list.
- A `cut` in one of my test commands hid the status code of an invalid request in the fake-database test (described above).
- When I restarted the dev server at the end, the first attempt failed (`ENOENT ... package.json`): the background command ran from the parent folder instead of the project folder, so npm found no `package.json`. It was an environment mistake in how I started it, not a code problem. I restarted it with `npm --prefix <project folder> run dev`, and it then served both records with HTTP 200.
- (Several automated notifications about servers I stopped on purpose were not from the user and required no action.)

### Corrections made
- Sent the second valid request to capture the body, as described. Rewrote the field-coverage check with tolerant parsing. Recorded the earlier commit reference `1222c8c` in the Step 3.1 entry.

### Security notes
- This endpoint has **no authentication**. It is for local development only, and must not be deployed publicly until sign-in and authorization checks exist. The route file now says so at the top.
- Not added in this step (possible later hardening): a request-size limit, rate limiting, and logging of who created a record.

### Follow-up prompt and approved deletion
2. ```
   Yes, delete the extra record and commit and push
   ```
   → Approval to delete the one extra test record and to commit and push the proposed files with the proposed message.

**Approved deletion (development branch only):** an inline script confirmed it was targeting the development endpoint (not production), then, inside a transaction, ran a `DELETE` limited by `id`, `title` **and** `organization` for the record `cmvabv9ni0001uoitauuqxrpq` ("Peer Mentor (Fictional Test Listing 2)"). The transaction was set to roll back unless exactly 1 row was deleted and exactly 1 row (the kept record) remained. Result: committed, exactly 1 row deleted; `Opportunity` now holds 1 row, `cmvabung80000uoitdge182wa` ("Youth Policy Fellow (Fictional Test Listing)"); `GET /api/opportunities` returns that 1 row. No other record was touched, and production was not involved.

### Git
- **Files committed:** `lib/validateOpportunity.js`, `app/api/opportunities/route.js` and `PROMPT_LOG.md`. `design-reference/` stays out (and the deleted database row is not part of any commit).
- **Commit message:** `Add POST /api/opportunities endpoint with server-side validation` (no Co-Authored-By trailer)
- **Pre-commit checks (agent):** only those three files staged; `.env`, `design-reference/`, `generated/` and `.next/` not staged; a scan of the staged diff found no credential, hostname or endpoint parts.
- **Commit reference:** `695d49e36259a4660b6e92dab978e58eb65a4dc0` (short `695d49e`), 3 files changed (`lib/validateOpportunity.js`, `app/api/opportunities/route.js`, `PROMPT_LOG.md`; 477 insertions, 2 deletions); pushed to `origin/main`; `git ls-remote origin main` returned the same hash. Recorded here during Step 4.1.

---

## Milestone 4, Step 4.1 — Display saved opportunities on the homepage

- **Date:** 2026-10-16 (UTC; the work started on the evening of 2026-10-15 US Pacific time)
- **Objective:** Show the fictional opportunity stored in the Neon development database on the homepage, as a reusable React component, using the approved mockup as the visual reference. No form, PATCH, DELETE, search, filters, import or schema changes.
- **Previous commit:** `695d49e` (`Add POST /api/opportunities endpoint with server-side validation`).

### Exact prompts
1. ```
   I approve Milestone 4, Step 4.1: Displaying saved opportunities on the OpenRaiz 2.0 homepage.
   Architectural decisions
   1. Use a Next.js Server Component for the initial opportunity list.
   2. Retrieve the opportunities directly through our existing Prisma Client rather than making an HTTP request to our own API from the server.
   3. Keep the existing GET /api/opportunities endpoint unchanged and independently testable.
   4. Use our approved OpenRaiz 2.0 mockup as the visual reference.
   5. Preserve the original OpenRaiz colors, typography, and general branding.
   Important
   Our approved mockup is located at:
   design-reference/openraiz-2-mockup.png
   Before writing code, inspect the mockup and briefly describe how you intend to translate the opportunity card design into React.
   Do not attempt to recreate the entire mockup yet.
   Objective
   Display the fictional opportunity currently stored in our Neon development database as a reusable React component.
   Step 1 — Build OpportunityCard
   Create:
   components/OpportunityCard.js
   The component should receive opportunity information through React props.
   Display:
   - Opportunity title
   - Organization
   - Opportunity type
   - Location and work arrangement
   - Compensation
   - Application deadline
   - Opportunity status
   - Lived-experience relevance
   Handle optional information gracefully.
   Format dates using UTC to avoid shifting calendar dates across time zones.
   Step 2 — Update Homepage
   Modify:
   app/page.js
   Retrieve opportunities through Prisma on the server.
   Display each opportunity using the reusable OpportunityCard component.
   Include:
   - A simple branded OpenRaiz header.
   - An opportunities section.
   - The existing fictional opportunity.
   - A friendly empty state if there are no opportunities.
   - A simple error state if the database query fails.
   Step 3 — Styling
   Use the existing OpenRaiz color palette:
   - Background: #FAF7F2
   - Primary green: #2E6F4E
   - Accent orange: #E4622B
   - Main text: #2B2B2B
   Use the existing OpenRaiz typography.
   Keep the design clean and responsive.
   Do not introduce additional styling libraries.
   Step 4 — Verification
   1. Run the Next.js application locally.
   2. Confirm the homepage displays the saved fictional opportunity.
   3. Confirm the opportunity information matches the database.
   4. Refresh the page and confirm the opportunity remains visible.
   5. Verify that the GET API endpoint continues to work.
   6. Test the empty state without permanently deleting the existing test opportunity.
   7. Run lint and build checks.
   8. Confirm no database schema changes or migrations occurred.
   9. Confirm the original OpenRaiz repository remains unchanged.
   Do not claim I personally verified the browser until I confirm it.
   Step 5 — Documentation
   Update PROMPT_LOG.md with:
   - Milestone 4, Step 4.1.
   - This exact prompt.
   - Files created or modified.
   - Testing results.
   - Any errors or corrections.
   - The previous commit reference 695d49e.
   Explain which code runs on the server and which code produces the interface displayed in the browser.
   Step 6 — Git
   After verification:
   1. Show me the modified files.
   2. Propose a descriptive commit message.
   3. Wait for my approval before committing or pushing.
   Important constraints
   Do not build the opportunity submission form yet.
   Do not implement PATCH or DELETE.
   Do not add search or category filtering.
   Do not import the original ten opportunities.
   Do not modify the Prisma schema.
   Do not modify the existing OpenRaiz repository.
   Stop after completing Step 4.1.
   ```
   (The user's message before this one was the approval of the Step 3.2 commit and the deletion of the extra test record, "Yes, delete the extra record and commit and push"; the agent's plan and two questions for this step were given in chat, and this prompt contains the user's answers.)

### Reading the mockup, and the plan described before coding
The mockup (`design-reference/openraiz-2-mockup.png`) shows a homepage, an opportunities directory, a detail page, an admin dashboard and a form. The agent used panel 2 (the directory) as the reference for the card: a white rounded card with a soft border and shadow; a circular icon badge on the left; a bold title with the organization beneath; the deadline in the accent color at the top right ("Apply by Nov 30, 2026"); a row of small icon-plus-text items for type, location and pay; and pills for status and lived experience. Deliberately **not** copied: tags (the data model has none), the description snippet, the "Apply" arrow, the navigation bar and "Submit an Opportunity" button (no other pages exist yet), and the mockup's purple and other type colors (not in the original palette; the type is shown by its label instead).

### Reading the bundled Next.js docs first
`AGENTS.md` says to read `node_modules/next/dist/docs/` first. With **Cache Components** enabled (set in `next.config.mjs` by `create-next-app`), the "Streaming uncached data" docs say a database read in a page must be wrapped in `<Suspense>` with a fallback: the fallback ships in the static shell and the data streams in at request time. The page follows that pattern. The production build confirms it: the homepage is `◐ Partial Prerender` (static shell with dynamic, server-streamed content).

### Files created or modified
- **Created:** `components/OpportunityCard.js`.
- **Modified:** `app/page.js` (replaced the placeholder), `app/globals.css` (added the card, list and state styles; added the `--color-accent-text` variable; the old placeholder `.page-main p` rule was replaced by scoped classes so it no longer affects card text), `PROMPT_LOG.md` (this entry).
- **Unchanged:** `app/api/` (the GET endpoint), `lib/`, `prisma/` (schema and migration), `package.json`, `package-lock.json`. No new dependencies or libraries (icons are small inline SVGs).
- Screenshots used for visual checks were saved only in `.next/preview/` (a git-ignored build folder) and are not part of any commit. The untracked `design-reference/openraiz-2-mockup.png` was not changed during this step; the user has since approved committing it as a design reference (see Git).

### What the code does
- **`components/OpportunityCard.js`:** shows one opportunity from props (the same flat shape as the API, with dates as `YYYY-MM-DD` strings, plus a `today` string). It shows the title, organization, a circular badge, the deadline, three icon-plus-text items (type, location and arrangement, compensation) and two pills (status, "Lived experience: …"). Optional data is handled: remote shows just "Remote", hybrid or on-site adds "· Oakland, CA", a missing deadline shows "Rolling deadline", a missing compensation hides that item, and an unknown enum value is shown as stored. Dates are formatted in UTC (`2026-12-15` becomes "Dec 15, 2026") and wrapped in a `<time>` element. A deadline earlier than `today` shows "Deadline passed …" in muted grey (a deadline equal to today is still open, as in the original site). It uses no state or effects.
- **`app/page.js`:** the `Home` component renders the branded header (the existing `SiteHeader`), the heading "Opportunities", a one-line intro and a `<Suspense>` boundary around `OpportunityList`. `OpportunityList` asks Prisma for all opportunities (same order as the API), converts them with the existing `serializeOpportunity` helper, and renders: an error message if the query fails (logging only the error's name and code), a friendly empty-state message if there are none, or "N opportunity/opportunities found" and one `OpportunityCard` per row. It queries Prisma directly and does not call the API.
- **`app/globals.css`:** plain CSS using the original palette (background `#FAF7F2`, primary green `#2E6F4E`, accent orange `#E4622B`, text `#2B2B2B`, muted `#6B6459`) and the original `system-ui` fonts. **Deliberate adjustment:** the accent `#E4622B` is only about 3.7:1 contrast on white, too light for small text, so the deadline text uses a darker shade of the same orange, `#B5470F` (about 5.4:1), while the calendar icon keeps the exact `#E4622B`. On screens under 560 px the deadline drops under the title.

### Commands executed
- Reading docs: `sed`, `grep` over `node_modules/next/dist/docs/`; reading the mockup image
- `npm run lint`; `npm run build` (twice)
- `npm --prefix <project folder> run dev` (background dev server), `curl` and Node `fetch` requests to `/` and `/api/opportunities`
- A read-only Node script using `pg` that read the row from PostgreSQL and compared each field with the HTML the server sent
- **Empty-state test:** one Node script (see below) that deleted the one row from the **development** database temporarily and restored it
- Headless Chrome (`Google Chrome --headless=new --screenshot`, with throwaway profiles in `.next/preview/`, not the user's profile) for desktop and mobile screenshots, which the agent looked at
- `DATABASE_URL="postgresql://nobody:notarealpassword@127.0.0.1:1/nodb" npx next start -p 3001` (production build with a **fake, unreachable** address, to test the error state; no real database or credential involved); `pkill` of the servers I started
- `npx prisma migrate status`, `npx prisma migrate diff --from-config-datasource --to-schema prisma/schema.prisma --exit-code`; `git status --short`, `git diff --quiet`; in the original repo `git status --short`, `git rev-parse --short HEAD` and the file-timestamp fingerprint

### Test results (only what actually ran)
- **Saved opportunity displayed, matching the database:** the homepage returned HTTP 200 and showed exactly one card. Reading the row straight from PostgreSQL and comparing with the page: title "Youth Policy Fellow (Fictional Test Listing)", organization "Fictional Policy Collective", type "Fellowship", location "Hybrid · Oakland, CA", compensation "Paid, $25/hr", deadline "Apply by Dec 15, 2026" (stored `2026-12-15`), status "Active", "Lived experience: Preferred". All 8 fields matched; "1 opportunity found" was shown; the number of cards equaled the number of rows; the header and heading were present; and no database or credential strings were in the HTML sent to the browser. The `<time>` element carries the stored date `2026-12-15`.
- **Refresh:** 5 separate requests all returned the card. Three were displayed (their first 70 characters were identical) and two further requests were compared in full and were identical. The content comes from the database, not from the browser.
- **GET API still works:** `GET /api/opportunities` returned HTTP 200 with the 1 row (`datePosted` `2026-10-16`, `deadline` `2026-12-15`); `app/api/` has no changes in this step.
- **Empty state, without permanent deletion:** one script took an exact snapshot of the row (`to_jsonb`), deleted it from the development database (committed, so the page could see it), then confirmed: the homepage still returned HTTP 200, showed the friendly message "No opportunities have been added yet. Please check back soon.", showed no card and no "found" line, still rendered the header and heading, did not show the error message, and `GET /api/opportunities` returned `[]` at the same time. A `finally` block then restored the row from the snapshot, and the script verified that the restored row is identical to the original on all 21 columns, including `id`, `createdAt` and `lastUpdated`, and that the homepage and API show the card again. The row was out of the table only for those few seconds. (PostgreSQL's insert and delete counters for the table each went up by one because of this.) This was a deliberate, temporary deletion on the development branch only, which the user's prompt asked for.
- **Error state:** a production build pointed at a fake unreachable address returned the page with the simple message "We couldn't load opportunities right now. Please try again in a moment." (announced with `role="alert"`), no card, and the header and heading still rendered. None of nine sensitive strings (the fake password, the fake user, `127.0.0.1`, `postgresql`, the fake database name, `ECONNREFUSED`, `P1001`, `prisma`, `SELECT`) appeared in the page; the server console logged only `Homepage could not load opportunities: PrismaClientKnownRequestError P1001`. The HTTP status of that response was 200, because the page streams (headers are sent before the database answers); this is a known trade-off of streaming, noted here, not changed.
- **Lint and build:** `npm run lint` passes with no warnings; `npm run build` compiles successfully and lists `◐ /` (Partial Prerender), `○ /_not-found` and `ƒ /api/opportunities`.
- **Schema and migrations:** `npx prisma migrate status` says "Database schema is up to date!"; the live-database-vs-schema comparison returned exit code 0 (no differences); `prisma/migrations/` still has only the original migration; `Opportunity` has 1 row and `_prisma_migrations` 1 record. `prisma/`, `app/api/`, `lib/` and the package files are unchanged.
- **Original OpenRaiz repo:** 0 changed files, commit `0113d35`, file-timestamp fingerprint matches the Step 1 baseline. Production was not touched, and no credentials were printed or are in this log.
- **Visual review by the agent (not by the user):** screenshots from headless Chrome. At 1100 px wide the card looks like the mockup's directory card in the original colors: sprout header, green heading, card with a green badge, title and organization, the orange deadline at the top right, the type, location and pay items, an "Active" pill and a "Lived experience: Preferred" pill. In a true 390 px frame the card wraps cleanly: the deadline sits under the title and the meta items wrap, with no horizontal overflow. **Not visually confirmed:** a 320 px frame (every attempt captured only the loading shell because of my screenshot timing, though the header and intro fit that width).
- **Browser check confirmed by the user:** after the agent asked them to wait, the user replied `Browser check confirmed, commit and push`. This refers to the check they described in their previous prompt: opening http://localhost:3000, seeing the fictional opportunity displayed correctly, and seeing it still visible after a refresh. The user did not describe what they saw in more detail, and the agent did not run or witness this check. Their earlier confirmation covers only that homepage check, not the headless-Chrome mobile screenshots (which were the agent's own review).

### Which code runs on the server, and what produces the interface in the browser
- **On the server only:** `app/page.js` (both `Home` and `OpportunityList`), `components/OpportunityCard.js`, `components/SiteHeader.js`, `lib/prisma.js` and `lib/serializeOpportunity.js`. These are all **Server Components** (the default in the Next.js App Router, with no `"use client"`). They run on your computer's Next.js server, which is where the database password lives. `OpportunityList` runs the Prisma query, reads today's date, formats the dates and builds the cards. The database connection string never leaves the server.
- **What the browser receives:** finished HTML (the header, the heading, the card's elements and text) and the CSS from `app/globals.css`. First the static shell arrives with "Loading opportunities…", then the server streams in the cards, and a small script swaps them in. The browser shows this HTML styled by the CSS; it never sees Prisma, SQL or the connection string. The only JavaScript the browser runs here is Next.js's own small client runtime (for example for the logo link and for swapping in the streamed content); none of our card or list code is sent as JavaScript, because it is not needed in the browser.
- **Later:** pieces that need interactivity, such as the submission form and the edit and delete buttons, will be **Client Components** (`"use client"`), and they will talk to the server through the API endpoints.

### Errors or mistakes identified
- My first check that the `<time>` element carries the stored date reported FAIL. The component was fine: React writes the attribute as `dateTime` and HTML attribute names are case-insensitive. My check had been case-sensitive. I re-ran it case-insensitively and it passed.
- My first headless-Chrome screenshot attempt used a shell loop that did not split its arguments, so Chrome ignored the requested window sizes and produced two identical default-size images. I redid them with explicit sizes.
- The first 390 px screenshot looked clipped. I suspected a layout bug, but it was a headless-Chrome minimum-window-width artifact. Rendering the page inside a true 390 px frame showed the layout wraps correctly. Screenshots of the 320 px frame kept catching the loading shell before the cards streamed in (timing), so that width is unconfirmed.
- (Several automated notifications about servers I stopped on purpose were not from the user and required no action.)
- **Testing approach to avoid without specific approval (recorded at the user's request):** for the empty-state test the agent temporarily deleted the one stored test opportunity from the development database and then restored it. It worked (the restore was verified identical on all 21 columns), but it briefly removed real stored data, and a failure between the delete and the restore would have lost the row (the snapshot was printed for recovery). The user's prompt said to test the empty state "without permanently deleting" the opportunity, and the agent took that as permission for a temporary deletion instead of asking first. **In future steps, do not delete or modify stored rows, even temporarily, as a way of testing without the user's specific approval.** Safer options to propose instead: test the empty state against an empty database branch or with an empty list supplied to the component, or ask first and say exactly what would be removed and how it would be restored.
- **Staged-file credential scan crashed (agent's script, found at commit time):** after the user confirmed the browser check, the agent staged the five approved files and ran its credential scan over `git diff --cached --text`. That command also printed the 1.6 MB mockup PNG as text, which overflowed the buffer of Node's `execSync` (`spawnSync /bin/sh ENOBUFS`) and crashed the script. Because the commands were chained with `&&`, the commit and push did **not** run: HEAD stayed at `695d49e` and the files stayed staged, so nothing unscanned was committed. The same scan had passed on the files before staging (a version that scanned the four text files and the PNG's bytes separately).
- No code mistakes were found by lint, build or tests.

### Corrections made
- Replaced the case-sensitive check, redid the screenshots at explicit sizes, and used true-width frames for mobile. Recorded the earlier commit reference `695d49e` in the Step 3.2 entry.
- **Scan corrected:** rewrote the scan to read the staged text diff with `git diff --cached -- ':!design-reference'` (with a larger buffer) and to read the staged PNG separately with `git show :design-reference/openraiz-2-mockup.png`, searching both for any part of the real credentials (password, user name, host, endpoint). It found none (staged text diff 34,949 characters; PNG 1,661,529 bytes), the original repo was re-checked unchanged (0 changes, `0113d35`), and only then was the commit made. Lesson: do not run text-oriented scans over a diff that contains binary files; scan binary files separately.

### Follow-up prompt
2. ```
   I've reviewed your Step 4.1 results and approve committing the frontend changes.
   Before committing, I will personally open http://localhost:3000 and verify that the fictional opportunity displays correctly and remains visible after refreshing.
   Please wait for my confirmation of that browser check before recording it as verified by me.
   Approved files:
   - components/OpportunityCard.js
   - app/page.js
   - app/globals.css
   - PROMPT_LOG.md
   - design-reference/openraiz-2-mockup.png
   Commit message:
   Display saved opportunities on the homepage with OpportunityCard
   Before committing:
   1. Verify that only the approved files are staged.
   2. Confirm no environment variables, database credentials, or generated files are included.
   3. Confirm that the original OpenRaiz repository remains unchanged.
   4. Verify that the mockup image is included as a design reference.
   5. Confirm the prompt log accurately documents the tests and results.
   6. Record the temporary deletion and restoration of the test opportunity as a testing approach we should avoid without specific approval in future steps.
   After I confirm the browser test, commit the changes and push to origin/main.
   Provide the commit hash and confirm the push succeeded.
   Next step
   After committing, prepare a plan for Step 4.2: Building the Add Opportunity form.
   Do not implement the form yet.
   Do not modify the database schema or API endpoints.
   Stop after presenting the Step 4.2 plan.
   ```
   → The agent ran the pre-commit checks below, corrected one overstatement in this log (the refresh test), recorded the temporary-deletion lesson (see "Errors or mistakes identified"), and held the commit until the user confirmed their browser check.
3. ```
   Browser check confirmed, commit and push
   ```
   → The agent recorded the confirmation above, staged the five approved files, re-ran the staged-file and credential checks, committed and pushed.

**Pre-commit checks run before staging (agent; nothing was staged or committed yet):** a `git add --dry-run` of the approved files lists exactly the five approved files (`components/OpportunityCard.js`, `app/page.js`, `app/globals.css`, `PROMPT_LOG.md`, `design-reference/openraiz-2-mockup.png`); nothing else is modified or untracked; nothing is staged; none of the files is an environment, generated, build or package file; a credential scan of the four text files and the bytes of the PNG found no credential, hostname or endpoint parts; the mockup is a valid 1312 x 1199 PNG (1,661,529 bytes), included as a design reference; the original OpenRaiz repo has 0 changed files at commit `0113d35` with the same file-timestamp fingerprint as the Step 1 baseline.

### Git
- **Files committed (approved by the user):** `components/OpportunityCard.js`, `app/page.js`, `app/globals.css`, `PROMPT_LOG.md` and `design-reference/openraiz-2-mockup.png`.
- **Commit message:** `Display saved opportunities on the homepage with OpportunityCard` (no Co-Authored-By trailer).
- **Pre-commit checks (agent, on the staged files):** exactly the five approved files staged; `.env`, generated, build and package files not staged; a scan of the staged text diff and the PNG's bytes found no credential, hostname or endpoint parts; the original OpenRaiz repo unchanged (0 changed files, commit `0113d35`).
- **Commit reference:** `1d39f2e8ad3ca814b0765bff8e560adeb11dfa56` (short `1d39f2e`), 5 files changed (528 insertions, 4 deletions); pushed to `origin/main`; `git ls-remote origin main` returned the same hash, and the remote tree lists `components/OpportunityCard.js` and `design-reference/openraiz-2-mockup.png`. Recorded here during Step 4.2.
- **Follow-up prompt:** the user approved a documentation-only commit with the message `Record homepage commit in prompt log` (the first part of their next prompt, quoted in full under Step 4.2).
- **Second commit:** `Record homepage commit in prompt log` (log-only; its hash is visible in `git log`).

---

## Milestone 4, Step 4.2 — Add Opportunity form

- **Date:** 2026-10-16 (UTC; the work started on the evening of 2026-10-15 US Pacific time)
- **Objective:** First, commit a documentation-only update (the Step 4.1 commit hash and the staged-file scan error). Then build the Add Opportunity form at `/admin/opportunities/new` as a reusable Client Component that sends a flat JSON body to the existing `POST /api/opportunities`, shows the server's validation errors, redirects to the homepage after a successful save, and add an "Add Opportunity" link to the homepage. No Edit, PATCH, DELETE, search, filters, import, schema or API changes.
- **Previous commits:** `1d39f2e` (`Display saved opportunities on the homepage with OpportunityCard`) and `a6e7348` (`Record homepage commit in prompt log`, the documentation commit made at the start of this step).

### Exact prompts
1. ```
   I approve Milestone 4, Step 4.2: Building the Add Opportunity form for OpenRaiz 2.0.
   Approved decisions
   1. Create the form on a separate page at /admin/opportunities/new.
   2. After a successful submission, redirect to the homepage so the newly created opportunity appears.
   3. Add a small "Add Opportunity" link or button to the homepage.
   4. You may use an existing browser-testing capability to test the form. Do not build a custom browser automation framework or install new testing dependencies without approval.
   5. Keep one additional fictional opportunity created during testing as a second sample record in our Neon development database.
   6. Preserve all original OpenRaiz branding and use our approved mockup as the visual reference.
   First: Documentation
   I approve the documentation-only commit:
   Record homepage commit in prompt log
   Update PROMPT_LOG.md to include:
   - The Step 4.1 commit hash 1d39f2e.
   - The staged-file credential scan error and how you corrected it.
   Review the documentation changes, confirm they contain no credentials, then commit and push only PROMPT_LOG.md.
   Next: Build the form
   Create a reusable Client Component:
   components/OpportunityForm.js
   Create the form page:
   app/admin/opportunities/new/page.js
   Create:
   lib/opportunityOptions.js
   Organize the form into three sections:
   Section 1: Opportunity Details
   - Title
   - Organization
   - Opportunity type
   - Description
   - Paid or unpaid
   - Compensation
   - Lived-experience relevance
   Section 2: Location & Application
   - Work arrangement: remote, hybrid, or onsite
   - City and state for hybrid or onsite opportunities
   - Optional address
   - Application method: URL or email
   - Application link or email address
   Section 3: Dates & Status
   - Date posted, defaulting to today's date
   - Optional application deadline
   - Opportunity status, defaulting to active
   Preserve all approved enum values.
   Form behavior
   1. Use React state to manage form values.
   2. Submit a flat JSON object to our existing POST /api/opportunities endpoint.
   3. Do not change the API or its validation rules.
   4. Show clear validation errors returned by the server.
   5. Show a simple error message if the request fails.
   6. Disable the submit button while the request is processing to help prevent duplicate submissions.
   7. Redirect to the homepage after HTTP 201.
   8. Ensure the homepage displays the newly saved opportunity.
   Design the form so it can eventually support editing an existing opportunity, but do not implement Edit functionality yet.
   Homepage
   Add a small "Add Opportunity" link to app/page.js.
   Keep the existing OpportunityCard and database query behavior unchanged.
   Styling
   Use our existing OpenRaiz color palette and typography.
   Follow the general structure of the approved mockup.
   Use a two-column form layout on larger screens and a single column on mobile.
   Do not introduce additional styling libraries.
   Verification
   1. Confirm the form loads at /admin/opportunities/new.
   2. Confirm all fields render correctly.
   3. Confirm selecting remote hides unnecessary location fields.
   4. Confirm native required-field validation works.
   5. Confirm server-side validation errors display correctly.
   6. Confirm the form submits to the existing POST endpoint.
   7. Confirm a valid opportunity is saved to Neon development.
   8. Confirm the browser redirects to the homepage after saving.
   9. Confirm the new opportunity appears in the directory after refresh.
   10. Confirm the original fictional opportunity remains unchanged.
   11. Run lint and build checks.
   12. Confirm no schema changes or migrations occurred.
   Test with fictional opportunity data only.
   Do not delete existing opportunities.
   Do not claim I personally verified the interface until I confirm it.
   Security
   This remains a local development application.
   No authentication exists yet, so do not deploy the administrative form or unrestricted write endpoints publicly.
   Prompt log
   Document the exact prompt, changes, testing results, errors, corrections, and lessons learned in PROMPT_LOG.md.
   Git
   After completing Step 4.2, show me the modified files and propose a commit message.
   Do not commit or push the form changes without my approval.
   Boundaries
   Do not implement PATCH or DELETE.
   Do not add search or filters.
   Do not import the ten original opportunities.
   Do not modify the Prisma schema.
   Do not modify the original OpenRaiz repository.
   Stop after Step 4.2 and wait for my approval.
   ```
   (The user's message before this one was the Step 4.1 browser confirmation and commit approval, "Browser check confirmed, commit and push"; the agent's Step 4.2 plan and five questions were given in chat, and this prompt contains the user's answers. The agent had recommended a separate page, a redirect to the homepage, a homepage link, a throwaway headless Chrome script for testing, and keeping one new fictional row; the user approved all except the custom automation: item 4 allows an "existing browser-testing capability" but not a custom browser-automation framework.)

### Part 1: documentation-only commit
The log was updated with the Step 4.1 commit hash and the staged-file credential scan error and its correction. Only `PROMPT_LOG.md` was staged; the change was reviewed line by line; a credential scan of the staged diff found nothing. **Commit:** `a6e734820bf2f17f4145bb708b9e15cbca898b29` (short `a6e7348`), `Record homepage commit in prompt log`, pushed to `origin/main` (`git ls-remote` returned the same hash; working tree clean afterwards).

### What testing tools exist, and what the agent did not do
A search of the available tools found no browser-driving tool in this session. The only existing browser capability is the headless Chrome command line, which can load a page, take a screenshot, and dump the page's DOM and console output. It cannot type, click or submit. Following the user's instruction, the agent did **not** build a custom automation framework (for example a script that drives Chrome through its debugging protocol) and installed nothing. This means the interactive behaviors (typing, choosing Remote, native required-field popups, clicking Save, seeing server errors beside fields, the redirect) were **not driven by the agent in a browser**. See "Verification" for exactly what was and was not verified, and the checklist for the user.

### Reading the bundled Next.js docs first
The agent read the `useRouter` docs (`router.push`, `router.refresh`) in `node_modules/next/dist/docs/`. Design choice from that: after a successful save the form does a full page load of the homepage (`window.location.assign("/")`) instead of a client-side `router.push`. A fresh request guarantees the server runs the database query again, so the new card always appears, with no chance of a stale client-side cache. (This is still a redirect to the homepage. The agent could not drive a browser to test the client-cache case, which is why it chose the approach that cannot be stale.)

### Files created or modified
- **Created:** `components/OpportunityForm.js` (the form; the first Client Component), `app/admin/opportunities/new/page.js` (the page), `lib/opportunityOptions.js`.
- **Modified:** `app/page.js` (added the "Add Opportunity" link and a title row; the card, the query and everything else are unchanged), `app/globals.css` (button, form and notice styles appended; nothing existing removed), `PROMPT_LOG.md` (this entry).
- **Unchanged (verified with `git diff --quiet`):** `app/api/` (the API), `lib/validateOpportunity.js`, `lib/prisma.js`, `lib/serializeOpportunity.js`, `components/OpportunityCard.js`, `components/SiteHeader.js`, `prisma/` (schema and migration), `package.json`, `package-lock.json`. No new dependencies.
- Screenshots used for visual review are in `.next/preview/` (a git-ignored build folder), not in any commit.
- **Beyond the prompt:** `lib/opportunityOptions.js` holds not only the option lists but also small plain-JavaScript helpers (`emptyOpportunityValues`, `toRequestBody`, `groupErrorsByField`, `showsLocationFields`, `todayLocalDate`) so that the logic of the form can be tested without a browser. The form page also shows a visible "Local development only" notice.

### What the code does
- **`lib/opportunityOptions.js`:** the approved dropdown values and labels (type, relevance, status, work arrangement, application method), the same length limits as the server, field names for error messages, and helpers. `toRequestBody` turns the form's values into the flat JSON the API expects: it leaves out empty optional values (a blank deadline, a blank address), leaves out city, state and address unless the arrangement is hybrid or on-site (the API rejects them for remote), turns the Paid/Unpaid choice into `isPaid` true or false, and omits `isPaid` if nothing was chosen so the server can name it. `groupErrorsByField` turns the API's `[{field, message}]` list into one message per field.
- **`components/OpportunityForm.js`:** `"use client"`. Keeps every value in React state (`useState`). Three sections (Opportunity details; Location & application; Dates & status) in a white card, two columns from 640 px wide and one column below. Native `required` attributes on the required fields; `maxLength` limits; labels tied to inputs; each server error is shown under its field (and listed in a summary announced as an alert, which receives focus); fields with `aria-invalid` and `aria-describedby`. City and State (required) and Address (optional) appear only for Hybrid or On-site. Application link or email is a plain text box (not `type="url"` or `type="email"`) so the server's rules, not the browser's, decide validity. "Date posted" shows today's date in the visitor's own time zone until changed (`useSyncExternalStore`, see Problems). The submit handler sends `fetch("/api/opportunities", { method: "POST", ... })`, ignores a second click while saving, disables the button and shows "Saving…", redirects on HTTP 201, shows the server's per-field messages on HTTP 400, and shows a plain message for any other failure or a network error ("...the opportunity was not saved. Please try again."). It accepts `initialValues` and has a comment marking the one place an edit (PATCH) would differ, but no edit logic exists.
- **`app/admin/opportunities/new/page.js`:** a Server Component with the branded header, a back link, the heading, the local-only notice and the form.
- **`app/page.js`:** a small green "Add Opportunity" button next to the "Opportunities" heading.
- **`app/globals.css`:** button styles (green primary, plain secondary), the notice, the form card, sections, fields, errors and a mobile layout, using the original palette and the `system-ui` fonts. No styling library.

### Commands executed
- A tool search for browser-driving tools; reading docs (`sed`, `grep`) under `node_modules/next/dist/docs/`
- `npm run lint` (several times), `npm run build` (twice)
- `npm --prefix <project folder> run dev` (background dev server); `curl` and Node `fetch` requests to the dev server
- Read-only Node scripts using `pg`: row snapshots (`to_jsonb`), row counts, PostgreSQL write counters for `Opportunity`, a read of the stored row
- Headless Chrome (`--headless=new`, throwaway profiles in `.next/preview/`, not the user's profile): `--dump-dom` with console logging, and `--screenshot` at desktop and 390 px widths (an iframe frame was used for the 390 px width)
- Inline Node scripts: unit tests of the helpers under `TZ=UTC`, `America/Los_Angeles` and `Pacific/Kiritimati`; a form-to-API contract test that builds each request body with the form's own `toRequestBody` and sends it to the real endpoint
- `DATABASE_URL="postgresql://nobody:notarealpassword@127.0.0.1:1/nodb" npx next start -p 3001` (a production build with a **fake, unreachable** address, to test the failure response; no real database or credential involved); `pkill` of servers I started
- `npx prisma migrate status`, `npx prisma migrate diff --from-config-datasource --to-schema prisma/schema.prisma --exit-code`; `git status`, `git diff --quiet`; in the original repo `git status --short`, `git rev-parse --short HEAD` and the file-timestamp fingerprint
- **No row was deleted or modified.**

### Verification results (only what actually ran), numbered as in the prompt
1. **Form loads at `/admin/opportunities/new`:** HTTP 200; title "Add Opportunity | OpenRaiz"; branded header and heading; back link; the local-only notice; all three sections.
2. **All fields render correctly (server-rendered HTML and the live DOM):** Title, Organization, Opportunity type, Lived-experience relevance, Compensation, Description, Work arrangement, Application method, Application link or email, Date posted (required), Application deadline and Status (optional), plus two required Paid/Unpaid radio buttons: the right element type and required or optional setting for each. The dropdown values are exactly the approved enum values (type: job, internship, fellowship, volunteer; relevance: required, preferred, welcomed, relevant; arrangement: remote, hybrid, onsite; method: url, email; status: active, filled, archived). Status defaults to Active (`selected`). In headless Chrome after the page's JavaScript ran, "Date posted" held today's local date (`2026-10-15`), the page loaded with no hydration error and the page's console showed only the dev server's "[HMR] connected" message (the rest was unrelated macOS noise from Chrome). Screenshots reviewed by the agent: the desktop layout has the three sections in a two-column grid with the sprout header and original colors; in a true 390 px frame it collapses to one column with full-width buttons and no overflow.
3. **Selecting Remote hides unnecessary location fields: NOT driven in a browser.** What was verified: the form renders with no City, State or Address fields while no arrangement is chosen; the helper `toRequestBody` leaves out city, state and address for remote even if text was typed earlier (tested, including through the real API, where the remote request was accepted with those leftovers removed); and `showsLocationFields` is true only for hybrid and on-site. The show/hide on selecting an option is code (`showLocation ? ... : null` in the component) that the agent read but did not see run. **This needs the user's check.**
4. **Native required-field validation: NOT driven in a browser.** What was verified: the `required` attribute is present on exactly the 11 required inputs and the Paid/Unpaid radios, and absent from the deadline and status. The browser's own popup and blocking is standard browser behavior that the agent did not witness. **This needs the user's check.**
5. **Server-side validation errors display correctly: partly verified.** The form-built bodies for 8 rejected scenarios (a completely empty form with native checks bypassed; Paid chosen with "Unpaid" compensation; Unpaid chosen with "Paid, $24/hr"; hybrid with no city and state; a web link method with "not a url"; an email method with "a@b"; a date posted before 2000; a deadline before 2000) were sent to the real API: every one returned HTTP 400, and `groupErrorsByField` mapped each message to exactly the expected field(s). For the empty form that is all 11 required fields, for example "Title: This field is required." Rendering those messages under the fields in a browser was **not** seen by the agent. **This needs the user's check.**
6. **The form submits to the existing POST endpoint:** the contract test sent the exact JSON that `toRequestBody` builds to `POST /api/opportunities`. Clicking the real Save button was not driven by the agent.
7. **A valid opportunity is saved to Neon development:** the form-built body for "Community Outreach Volunteer (Fictional Sample)" (a remote, unpaid, rolling volunteer listing; fictional data only) returned HTTP 201. A direct read of the development database shows the row stored as submitted (`remote`, no city, no deadline, `datePosted` 2026-10-15, unpaid, `active`, `source` `owner-added`, no `legacyId`). **This row was created by the contract test using the form's body builder, not by clicking the form in a browser.** It is the second sample record the user asked to keep (id `cmvadtgq70000kgitvumgz8ii`).
8. **The browser redirects to the homepage after saving: NOT driven in a browser.** The code calls `window.location.assign("/")` after HTTP 201. **This needs the user's check.**
9. **The new opportunity appears in the directory after refresh:** `GET /api/opportunities` returns 2 rows, and the homepage (requested fresh) renders 2 cards, "2 opportunities found", and the new card with "Rolling deadline, Volunteer, Remote, Unpaid, Active, Lived experience: Required".
10. **The original fictional opportunity is unchanged:** the full row of `cmvabung80000uoitdge182wa` was snapshotted before and after the test and is identical on all 21 columns (same SHA-256 fingerprint). PostgreSQL's write counters rose by exactly one insert (the new row); updates and deletes did not change. Nothing was deleted or modified.
11. **Lint and build:** `npm run lint` passes with no warnings; `npm run build` compiles successfully and lists `◐ /`, `○ /_not-found`, `○ /admin/opportunities/new` and `ƒ /api/opportunities`.
12. **No schema changes or migrations:** `npx prisma migrate status` says "Database schema is up to date!"; the live-database-vs-schema comparison returned exit code 0 (no differences); `prisma/migrations/` has only the original migration; `_prisma_migrations` has 1 record. `prisma/` and the API are unchanged.
- **Helper logic (pure functions):** 0 failures in each of three time zones. Covered: remote drops location text; hybrid or on-site keep city and state, and address only when typed; a blank deadline is omitted; Paid/Unpaid maps to `isPaid` (omitted when not chosen); every key of the body is one the API accepts and the body is flat; error grouping; `todayLocalDate()` is `YYYY-MM-DD` and equals the local calendar date.
- **Failure response:** a valid form-built body sent to a production build whose database was a fake unreachable address returned HTTP 500 with only `{"error":"Could not create the opportunity."}` and none of nine sensitive strings; the form shows its own generic "...the opportunity was not saved" message for any status other than 201 or 400 (the agent read, but did not see, this message). An empty form sent in the same situation still returned HTTP 400, because validation runs before the database.
- **Original OpenRaiz repo:** 0 changed files, commit `0113d35`, file-timestamp fingerprint matches the Step 1 baseline. Production was not touched. No credentials were printed, and a scan of this log found none.
- **User's own browser verification (reported after the agent finished; see "User-confirmed results" below).** Before that report, nothing in the interface was recorded as verified by the user.

### Checklist given to the user for their own browser check (items 3, 4, 5, 6, 8 above)
At http://localhost:3000: (a) click "Add Opportunity" on the homepage; (b) click Save on the empty form and see the browser's "fill out this field" popup; (c) choose Work arrangement Hybrid, see City and State appear, then choose Remote and see them disappear; (d) fill every field validly with fictional data and click Save; (e) see the page go to the homepage with the new card shown; (f) refresh and see it still there. And optionally: (g) choose Paid but type "Unpaid" for compensation to see the server's message under Compensation; (h) type a deadline year before 2000 to see the Date error. Note: every successful save creates another real row in the development database.

### User-confirmed results (the user's own browser test)
After the agent's report and checklist, the user wrote: "I've personally tested the Add Opportunity form in my browser." and reported, in their own words, these results, which are recorded here as **user-confirmed** (the agent did not witness any of them):
- Required-field validation: **PASS**
- Hybrid/Remote conditional location fields: **PASS**
- Server-side compensation validation: **PASS**
- Save and redirect: **PASS**
- New opportunity appears on homepage: **PASS**
- Opportunity persists after refreshing: **PASS**

How these map to the numbered verification items above: item 4 (native required-field validation), item 3 (Remote hides the location fields), item 5 (server-side errors displayed; the user reported the compensation case specifically, so the other server-error cases, for example the date errors, were not reported as tested by the user), items 6 and 8 (submits to the endpoint, saves, redirects to the homepage), and item 9 (the new opportunity appears and persists after a refresh).

**Data left by the user's test (read by the agent afterwards, nothing changed or deleted):** the development database now holds 3 rows. The third was created by the user's own browser test: id `cmvae82zz0000pwit532gndbd`, "Social Media Fellow", organization "Alianza for Youth Justice", a remote fellowship, paid ("$25/hr"), posted 2026-10-15, deadline 2026-10-31, created at 03:13:36 UTC on 2026-10-16. The original fictional opportunity (`cmvabung80000uoitdge182wa`) is still identical (SHA-256 fingerprint `a4cf24dd6cbfe1af`, the same as before and after the agent's contract test), and the agent's second sample (`cmvadtgq70000kgitvumgz8ii`) is unchanged. PostgreSQL's insert counter rose by one for the user's save and updates and deletes did not change.

### Why `useSyncExternalStore` was introduced, and whether it is necessary
- **What happened:** the first version filled "Date posted" with today's date by calling `setState` inside a `useEffect`. `npm run lint` rejected it (React's `react-hooks/set-state-in-effect` rule: setting state straight after the first render forces an extra render). The agent replaced it with `useSyncExternalStore`, which React provides for reading a value that only the browser knows. In `components/OpportunityForm.js`: `const today = useSyncExternalStore(subscribeToNothing, todayLocalDate, getServerToday)`; the server's snapshot is `""`, the browser's is today's local date, and `datePosted` stays `null` ("not touched yet") until the person picks a date.
- **Why a browser-only value is needed at all:** the date has to be the visitor's own calendar day. The server does not know the visitor's time zone, and it is already the next day in UTC in the evening in US Pacific time (the agent saw `2026-10-15` locally while UTC said `2026-10-16`).
- **Is `useSyncExternalStore` necessary? No, not strictly.** It is correct and avoids both the extra render and a mismatch between the server's HTML and the browser's, but it is a more advanced hook than this feature needs, and a beginner has to read a short comment to follow it. Simpler options, with trade-offs:
  1. **Keep it as it is.** About 3 lines plus a comment, it passes lint, and the live DOM check showed the right date with no hydration error. This is the agent's recommendation unless readability matters more to the user.
  2. **`useEffect` plus `setState`, with a one-line lint exception comment.** This is the most common beginner pattern and about the same amount of code. It works, at the cost of one extra render and a brief moment in which the date box is empty. The lint rule is advisory here, so the exception is a legitimate choice.
  3. **Compute today's date on the server and pass it in as a prop.** The simplest code, but it uses the server's (UTC) date, so on a US evening the default would be tomorrow's date. It also needs care with Next.js Cache Components, which have rules about reading the current time while a page is being prerendered (the agent did not test this variant).
  4. **Initialize state directly with today's date (`useState(todayLocalDate)`).** Simplest of all but wrong here: that code also runs on the server, so the server's date would be baked into the page's HTML and could mismatch the browser (not tested in this project).
- **Decision:** nothing was refactored. Changing this requires the user's approval.

### Problems found, errors and corrections
- **Lint error:** my first version filled "Date posted" with today's date by calling `setState` inside a `useEffect`; `npm run lint` rejected it (React's `set-state-in-effect` rule: it causes an extra render). **Corrected:** `datePosted` starts as `null` ("not touched yet") and the form shows today's local date from `useSyncExternalStore` until the visitor picks a date. After the fix the live DOM showed the right date and no hydration error.
- **Styling bug found in my screenshot:** the Paid/Unpaid radio buttons were stacked and bold because my general `.field label` style overrode the radio style. **Corrected** with a more specific `.field .radio-option` rule and `padding: 0` on the legend; a new screenshot showed them side by side in normal weight.
- **Weak check:** one of my first checks ("status defaults to Active") ended with `|| true`, so it could never fail. I flagged it as pending in its own output and then checked the real DOM (`<option value="active" selected>`), which passed.
- **Raw-HTML check failed wrongly:** my check that the homepage contained the text "2 opportunities found" failed against the raw HTML because React splits the count line into separate text pieces, so that phrase is not one contiguous string in the HTML source. The page was correct. I re-checked on the visible text (and checked the new card's contents separately), and all passed.
- **Not driven in a browser (limitation, not an error):** see items 3, 4, 5, 6 and 8.
- **Mobile 320 px** was not re-checked for the form; 390 px was.
- (Several automated notifications about servers I stopped on purpose were not from the user and required no action.)

### Lessons learned
- Do not claim an interface behavior is verified when it was only read in code: separate "checked in code", "checked through the API", and "seen running in a browser".
- Keep form logic in plain functions (`toRequestBody`, `groupErrorsByField`) so it can be tested without a browser.
- The server stays the authority on validation; the form only collects values, shows the server's messages, and uses native `required` for quick feedback.
- A fresh page load after a save is the simplest way to guarantee the list shows the new row.
- Dates: "Date posted" defaults to the person's **local** calendar date (2026-10-15 for the agent's Pacific time zone), while the automatic `lastUpdated` uses the **UTC** date (2026-10-16 at the same moment). In the evening the new record's `lastUpdated` can therefore be a day after its `datePosted`. This is how the model was designed (Step 2.7) and nothing was changed.

### Security notes
The form page and `POST /api/opportunities` have **no authentication**. They are for local development only and must not be deployed publicly until sign-in and authorization exist; the form page says so on screen and in the code. Not done in this step (possible later hardening): disabling the page and the POST endpoint in production until authentication exists, a request-size limit, rate limiting.

### Data in the Neon development database after the agent's tests (none deleted)
1. `cmvabung80000uoitdge182wa` "Youth Policy Fellow (Fictional Test Listing)", unchanged.
2. `cmvadtgq70000kgitvumgz8ii` "Community Outreach Volunteer (Fictional Sample)", the second sample kept at the user's request.
3. `cmvae82zz0000pwit532gndbd` "Social Media Fellow" (Alianza for Youth Justice), created later by the user's own browser test (see "User-confirmed results"). Not created by the agent and not deleted.

### Follow-up prompt
2. ```
   I've personally tested the Add Opportunity form in my browser.
   My verification results:
   - Required-field validation: PASS
   - Hybrid/Remote conditional location fields: PASS
   - Server-side compensation validation: PASS
   - Save and redirect: PASS
   - New opportunity appears on homepage: PASS
   - Opportunity persists after refreshing: PASS
   Please record these as user-confirmed results in PROMPT_LOG.md.
   Also document that useSyncExternalStore was introduced to resolve the date-default lint issue. Briefly explain whether it is necessary or whether a simpler implementation would be appropriate. Do not refactor without my approval.
   Approved commit message:
   Add Opportunity form page with server-validated submission
   Before committing:
   1. Verify only the six approved files are staged.
   2. Review the staged diff.
   3. Confirm no credentials or environment files are included.
   4. Confirm the original OpenRaiz repository remains unchanged.
   If all checks pass, commit and push to origin/main.
   Provide the commit hash and confirm the push succeeded.
   Afterward, prepare a plan for Step 5.1: Implementing the PATCH endpoint to update existing opportunities.
   Do not implement PATCH yet. Wait for my approval.
   ```
   → The agent recorded the user-confirmed results and the `useSyncExternalStore` explanation (above), checked the database for what the user's test left behind, ran the pre-commit checks, and committed and pushed.

### Git
- **Files committed (six, approved by the user):** `components/OpportunityForm.js`, `app/admin/opportunities/new/page.js`, `lib/opportunityOptions.js`, `app/page.js`, `app/globals.css` and `PROMPT_LOG.md`.
- **Commit message (approved):** `Add Opportunity form page with server-validated submission` (no Co-Authored-By trailer).
- **Pre-commit checks (agent, on the staged files):** exactly the six approved files staged; no `.env`, generated, build, package or database files staged; a scan of the staged diff found no credential, hostname or endpoint parts; the original OpenRaiz repo unchanged (0 changed files, commit `0113d35`).
- **Commit reference:** `037dfa67f4e4e0aeb390837c53f40b925ebd4a2f` (short `037dfa6`), 6 files changed (1,046 insertions, 1 deletion); pushed to `origin/main`; `git ls-remote origin main` returned the same hash, the remote tree lists the three new source files, and the working tree was clean afterwards. The staged diff was reviewed first: `app/page.js` gained only the link and its wrapper, `app/globals.css` had additions only, and the new files had no debugging leftovers.
- **Follow-up prompt:** `update the log and commit it alone first` (the user's reply to the agent's Step 5.1 plan and question about a documentation-only commit for this hash). The user did not name a commit message; the agent used `Record Opportunity form commit in prompt log`, following the earlier documentation commits.
- **Second commit:** `Record Opportunity form commit in prompt log` (log-only; its hash is visible in `git log`).

---

## Milestone 5, Step 5.1A — GET /api/opportunities/[id]

- **Date:** 2026-10-16 (UTC; the work started on the evening of 2026-10-15 US Pacific time)
- **Objective:** Build `GET /api/opportunities/[id]`, which returns one opportunity as flat JSON, or a generic 404 if there is none, as a first, read-only half of Step 5.1 before PATCH. No PATCH, no update validator, no DELETE, no frontend changes, and no rows created or deleted.
- **Previous commits:** `037dfa6` (`Add Opportunity form page with server-validated submission`) and `7d210ab` (`Record Opportunity form commit in prompt log`).

### Exact prompts
1. ```
   I've reviewed your Step 5.1 plan and approve the overall architecture, with the following decisions.
   Approved decisions
   1. PATCH requests must explicitly clear city, state, and address when switching a location to remote.
   2. An empty PATCH request should return HTTP 400.
   3. Create a separate lib/validateOpportunityUpdate.js when we implement PATCH, reusing the existing validation rules.
   4. Add GET /api/opportunities/[id] before implementing PATCH.
   5. We will use a separate fictional opportunity for PATCH testing, preserving the existing three records.
   Important validation consideration for the upcoming PATCH implementation
   Prisma returns date fields as JavaScript Date objects, while our existing POST validator expects YYYY-MM-DD strings.
   When we implement PATCH, normalize the existing database record using our approved serialization logic before merging it with the request.
   Then validate the merged values and convert date strings back to the appropriate Prisma types before saving.
   Preserve fields that weren't included in the PATCH request.
   Do not implement PATCH yet.
   First: Documentation
   I approve the documentation-only follow-up commit:
   Record Add Opportunity form commit in prompt log
   Update PROMPT_LOG.md with the Step 4.2 commit reference:
   037dfa6
   Review the documentation diff, verify that no credentials are included, and commit and push only PROMPT_LOG.md.
   Next: Step 5.1A — GET Individual Opportunity
   Create:
   app/api/opportunities/[id]/route.js
   Implement:
   GET /api/opportunities/[id]
   The endpoint should:
   1. Accept an opportunity ID from the URL.
   2. Retrieve the corresponding opportunity through Prisma.
   3. Use our existing serializeOpportunity helper.
   4. Return the full opportunity as flat JSON with HTTP 200.
   5. Return HTTP 404 with a generic not-found message when the ID does not exist.
   6. Return a generic HTTP 500 response for unexpected server errors.
   Follow the installed Next.js version's requirements for asynchronous route parameters.
   Verification
   1. Test the endpoint using the ID of one of our existing fictional opportunities.
   2. Confirm the response contains the correct information.
   3. Confirm all date fields are serialized correctly.
   4. Test a nonexistent opportunity ID and confirm HTTP 404.
   5. Confirm the endpoint performs no database writes.
   6. Verify the existing GET and POST endpoints still work.
   7. Run lint and build checks.
   8. Confirm no database schema changes or migrations occurred.
   9. Confirm the original OpenRaiz repository remains unchanged.
   Documentation
   Update PROMPT_LOG.md with the exact prompt, files changed, commands executed, verification results, and any corrections.
   Git
   After verification, show me the modified files and propose a commit message.
   Do not commit or push without my approval.
   Important boundaries
   Do not implement PATCH yet.
   Do not create the update validator yet.
   Do not implement DELETE.
   Do not modify the frontend.
   Do not create or delete opportunities during this step.
   Stop after Step 5.1A and wait for my approval.
   ```
   (The user's message before this one was `update the log and commit it alone first`, which the agent carried out as commit `7d210ab`. The agent's Step 5.1 PATCH plan and five questions were given in chat before that, and this prompt contains the user's answers.)

### The documentation commit in the first part of the prompt
The user approved a documentation-only commit `Record Add Opportunity form commit in prompt log` recording the Step 4.2 hash `037dfa6`. That hash had **already** been recorded and pushed a moment earlier as `7d210ab` (`Record Opportunity form commit in prompt log`), the agent's answer to the user's previous message, so the two messages crossed. The agent checked: the log already contains the full `037dfa67f4e4e0aeb390837c53f40b925ebd4a2f` hash for Step 4.2, local `main` equals `origin/main` (`7d210ab`), and the working tree held nothing to commit. **No additional commit was made** and the pushed commit was not amended (rewriting a pushed commit just to change its wording was judged worse than leaving it); the only difference is the commit message wording. The same check found one stale `PENDING` line (the Step 2.6A entry), which was corrected in this step's log update (see Corrections).

### Decisions approved for the upcoming PATCH step (recorded here; nothing of PATCH was implemented)
1. When PATCH switches an opportunity to remote, it must explicitly clear `city`, `state` and `address` in the same request (the server will not clear them automatically).
2. An empty PATCH body returns HTTP 400.
3. The update validator will be a separate new file, `lib/validateOpportunityUpdate.js`, reusing the existing validation rules; `lib/validateOpportunity.js` stays untouched.
4. `GET /api/opportunities/[id]` comes first (this step).
5. PATCH testing will use a separate fictional opportunity, preserving the existing three records.
- **The user's validation note for PATCH:** Prisma returns dates as JavaScript `Date` objects, while the POST validator expects `YYYY-MM-DD` strings. PATCH must (a) normalize the existing database record with the approved serialization logic (`serializeOpportunity`), (b) merge it with the request, (c) validate the merged values, (d) convert date strings back to the proper types before saving, and (e) preserve fields not included in the request.
- **Evidence gathered by the agent for that plan:** all 10 original OpenRaiz listings, flattened as the future import would and with the server-controlled fields removed, pass the current validator (10 of 10), so a merge-then-validate PATCH will not be blocked by an old, unrelated problem in an imported record.

### Reading the bundled Next.js docs first
The route handler docs for this Next.js version (16.4.1) show that for a dynamic route the second argument is a context object whose `params` is a **Promise**: `export async function GET(request, { params }) { const { id } = await params }`. The route follows that.

### Files created or modified
- **Created:** `app/api/opportunities/[id]/route.js` (a `GET` handler only; `[id]` in the folder name is a dynamic segment).
- **Modified:** `PROMPT_LOG.md` (this entry and the Step 2.6A correction).
- **Unchanged (verified with `git diff --quiet`):** `app/api/opportunities/route.js` (list and POST), everything in `lib/` (including `lib/validateOpportunity.js`; `lib/validateOpportunityUpdate.js` does **not** exist), all of `components/`, `app/page.js`, `app/globals.css`, the form page, `prisma/` (schema and migration), `package.json` and `package-lock.json`. No frontend changes and no new dependencies.

### What the code does
`GET /api/opportunities/[id]`: reads the id from the URL (`await params`); if the id contains anything other than letters, digits, hyphens and underscores, or is longer than 100 characters, it answers `404` immediately without asking the database (see Problems); otherwise calls `prisma.opportunity.findUnique({ where: { id } })`; answers `404 {"error":"Opportunity not found."}` if there is no such row (the message does not repeat the id); otherwise returns the row through the existing `serializeOpportunity` helper as flat JSON with HTTP 200 (21 fields; `datePosted`, `deadline` and `lastUpdated` as `YYYY-MM-DD`, `null` kept, `createdAt` as a full timestamp). On any unexpected error it logs only the error's name and code on the server and answers `500 {"error":"Could not load the opportunity."}`. It never writes: the only database call is `findUnique`.

### Commands executed
- Reading docs; a read-only Node script that ran the 10 original listings through the current validator
- `npm run lint` (several times), `npm run build` (twice)
- `npm --prefix <project folder> run dev` (background dev server); `curl` and Node `fetch` requests to the dev server
- Read-only Node scripts using `pg`: row snapshots (`to_jsonb`, with a short SHA-256 fingerprint per row), PostgreSQL's write counters for `Opportunity`, a field-by-field read of each row
- `DATABASE_URL="postgresql://nobody:notarealpassword@127.0.0.1:1/nodb" npx next start -p 3001` (a production build with a **fake, unreachable** address, to test the 500 response; no real credential involved) and `npx next start -p 3002` (the production build against the real development database); `pkill` of the servers I started
- `npx prisma migrate status`, `npx prisma migrate diff --from-config-datasource --to-schema prisma/schema.prisma --exit-code`; `git status`, `git diff --quiet`; in the original repo `git status --short`, `git rev-parse --short HEAD` and the file-timestamp fingerprint
- **No row was created, changed or deleted.**

### Verification results (only what actually ran), numbered as in the prompt
1. **Existing fictional opportunities:** `GET /api/opportunities/<id>` was tested for all three existing records (`cmvabung80000uoitdge182wa` "Youth Policy Fellow (Fictional Test Listing)", `cmvadtgq70000kgitvumgz8ii` "Community Outreach Volunteer (Fictional Sample)", `cmvae82zz0000pwit532gndbd` "Social Media Fellow"): each returned HTTP 200 with a JSON content type.
2. **Correct information:** for each record, all 21 fields matched a direct read from PostgreSQL, and the JSON was identical (same fields, same order) to that record's entry in `GET /api/opportunities`. Optional values came back as stored (for example `city` `"Oakland"` and a full address for the first record; `null` for the others).
3. **Dates serialized correctly:** `datePosted`, `deadline` and `lastUpdated` came back as plain `YYYY-MM-DD` strings (for example `2026-10-16`, `2026-12-15`, `2026-10-31`); the rolling record's `deadline` stayed `null`; `createdAt` came back as a full timestamp (for example `2026-10-16T02:07:10.136Z`).
4. **Nonexistent id gives 404:** a cuid-shaped nonexistent id returned HTTP 404 with exactly `{"error":"Opportunity not found."}`. Fourteen unusual ids were also tested (plain text, the old readable-id style (`legacyId` is not the id), an upper-case copy of a real id, a real id with a trailing space, a single character, a null byte, a null byte inside a real id, SQL-looking text, path-traversal text, unicode, 5,000 characters, 100 characters and 101 characters): all returned the same generic 404 and none of them echoed the id or contained internal strings, after the fix described under Problems. A request with broken percent-encoding (`/api/opportunities/%ZZ%`) is answered by Next.js itself with HTTP 400 "Bad Request" (an HTML page) before the route runs; this is framework behavior, it was left unchanged, and it is not a 404.
5. **No database writes:** the route only calls `findUnique`. After all of the requests (the real ids, the unusual ids, and six other-method requests: POST, PATCH, PUT, DELETE, HEAD and OPTIONS), the 3 rows have exactly the same SHA-256 fingerprints as before the step began (`a4cf24dd`, `f48dbdf1`, `666a2202`) and PostgreSQL's insert, update and delete counters for the table are unchanged (50, 6, 2). The `POST`, `PATCH`, `PUT` and `DELETE` requests to `/api/opportunities/[id]` each returned HTTP 405 (Method Not Allowed): only GET exists there, and PATCH is **not** implemented. `OPTIONS` returned 204 with `Allow: GET, HEAD, OPTIONS`.
6. **Existing GET and POST still work:** `GET /api/opportunities` returned HTTP 200 with 3 rows; the homepage still renders 3 cards; the Add Opportunity form page still loads (HTTP 200). `app/api/opportunities/route.js` is unchanged. Because this step must not create rows, no valid POST was sent: `POST /api/opportunities` with an **invalid** body returned HTTP 400 with 11 field errors, and with malformed JSON returned HTTP 400, which shows the route is alive and validating; the table stayed at 3 rows with unchanged fingerprints and counters afterwards. (A valid POST was not re-tested in this step.)
7. **Lint and build:** `npm run lint` passes with no warnings; `npm run build` compiles successfully and lists `ƒ /api/opportunities` and `ƒ /api/opportunities/[id]` (server-rendered on demand). The built production version, run against the real development database, also returned HTTP 200 with all 21 fields for each of the three real ids, and 404 for a nonexistent id and for a null-byte id.
8. **No schema changes or migrations:** `npx prisma migrate status` says "Database schema is up to date!"; the live-database-vs-schema comparison returned exit code 0 (no differences); `prisma/migrations/` still has only the original migration; `_prisma_migrations` has 1 record.
9. **Original OpenRaiz repo:** 0 changed files, commit `0113d35`, file-timestamp fingerprint matches the Step 1 baseline. Production was not touched. No credentials were printed, and a scan of this log found none.
- **Server error:** a production build whose database was a fake unreachable address answered a valid-looking id with HTTP 500 and exactly `{"error":"Could not load the opportunity."}`, with none of ten sensitive strings (including the requested id); the server console logged only `GET /api/opportunities/[id] failed: PrismaClientKnownRequestError P1001`. In the same situation an impossible id (a null byte) still returned 404, answered without touching the database.

### Problems found, errors and corrections
- **A real bug found by testing, fixed:** my first version passed every id straight to the database. A null byte in the id (`%00`) made PostgreSQL raise an error (Prisma code `P2039`), so the route answered **HTTP 500**, although an id that does not exist should be a 404. **Correction:** an id check before the database call (`/^[A-Za-z0-9_-]{1,100}$/`; anything else gets the same generic 404). After the fix, all 14 unusual ids returned the clean 404 and the three real ids still returned 200. A side benefit: obviously impossible ids no longer cost a database query.
- **A test-script problem, not a route problem:** `/api/opportunities/%ZZ%` made my first test script crash on an HTML response; investigating showed Next.js's own server answers HTTP 400 before the route runs (see item 4). Not changed.
- **A mislabeled count in a test message:** a test line said "5 other-method requests"; it was 6 (POST, PATCH, PUT, DELETE, HEAD, OPTIONS). The log uses the right number.
- **Stale log line:** the Step 2.6A entry still said its commit was PENDING (it was committed in `bd29c85` with Step 2.6B). Corrected above.
- **The documentation commit requested in the prompt was already done** as `7d210ab` (see above).
- (Several automated notifications about servers I stopped on purpose were not from the user and required no action.)

### Lessons learned
- Test unusual inputs, not just the normal and the "missing" case: a null byte turned a "not found" into a server error.
- A well-chosen id check is a cheap, safe way to turn impossible requests into a 404 without a database query.
- When two messages cross, check the actual state of the repository before acting, and say what was already done.

### Notes for Step 5.1B (PATCH): not implemented, for the next step
- Needs a new `lib/validateOpportunityUpdate.js` (merge the serialized existing record with the request, validate with the existing rules, convert dates back to UTC `Date` objects, and write only the supplied fields), 400 for an empty body, 404 for an unknown id, explicit clearing of `city`, `state` and `address` when switching to remote, and tests on a **new** fictional row (the three existing rows must stay untouched). It will be local-only, with no authentication.

### Security notes
`GET /api/opportunities/[id]` is read-only. There is still no authentication anywhere: `POST /api/opportunities` and the Add Opportunity form are for local development only, and the comment at the top of the new route file says that any write handlers added there later (PATCH, DELETE) are local-only until sign-in and authorization exist.

### Git
- **Files that would be committed:** `app/api/opportunities/[id]/route.js` and `PROMPT_LOG.md`.
- **Proposed commit message:** `Add GET /api/opportunities/[id] endpoint`
- **Commit message:** `Add GET /api/opportunities/[id] endpoint` (no Co-Authored-By trailer).
- **Follow-up prompt:** `Yes, commit and push the GET endpoint`.
- **Pre-commit checks (agent):** exactly two files staged (`app/api/opportunities/[id]/route.js` and `PROMPT_LOG.md`); no `.env`, generated, build, package or binary files staged; a scan of the staged diff found no credential, hostname or endpoint parts; the original OpenRaiz repo unchanged (0 changed files, commit `0113d35`).
- **Commit reference:** `46d4fc2ac333c695bbd3867fbe266abbfbed68d2` (short `46d4fc2`), 2 files changed (`app/api/opportunities/[id]/route.js` and `PROMPT_LOG.md`; 176 insertions, 2 deletions); pushed to `origin/main`; `git ls-remote origin main` returned the same hash, the remote tree lists the new route, and the working tree was clean afterwards. Recorded here during Step 5.1B.

---

## Milestone 5, Step 5.1B — PATCH /api/opportunities/[id]

- **Date:** 2026-10-16 (UTC; the work started on the evening of 2026-10-15 US Pacific time)
- **Objective:** Implement `PATCH /api/opportunities/[id]` so an existing opportunity can be updated without replacing the whole record, using the decisions the user approved for Step 5.1. No DELETE, no Edit form, no change to the existing form component, no import of the original ten opportunities, no schema change.
- **Previous commit:** `46d4fc2` (`Add GET /api/opportunities/[id] endpoint`).

### Exact prompt
1. ```
   I approve Step 5.1B: Implementing the PATCH endpoint for OpenRaiz 2.0.
   Objective
   Implement PATCH /api/opportunities/[id] so we can update an existing opportunity without replacing the entire record.
   Approved files
   - Create lib/validateOpportunityUpdate.js.
   - Extend app/api/opportunities/[id]/route.js.
   - Update PROMPT_LOG.md.
   Implementation requirements
   1. Retrieve the existing opportunity using Prisma.
   2. Return HTTP 404 if the opportunity does not exist.
   3. Parse the incoming JSON and return HTTP 400 for malformed requests.
   4. Reject empty request bodies.
   5. Reject protected fields: id, legacyId, createdAt, lastUpdated, and source.
   6. Reject unknown fields.
   7. Normalize the existing record with serializeOpportunity.
   8. Merge the requested changes with the existing values.
   9. Validate the complete merged record using our existing validation rules.
   10. Convert date strings into UTC Date objects before passing them to Prisma.
   11. Update only fields explicitly included in the request.
   12. Return the updated opportunity with HTTP 200 using our existing serializer.
   Cross-field validation
   Preserve all existing validation rules for compensation, location, application methods, enums, and dates.
   Switching an opportunity to Remote must explicitly clear city, state, and address using null values.
   Optional fields may be cleared with null where permitted.
   Do not change the database if validation fails.
   Important implementation detail
   Ensure that merging the serialized database record does not accidentally introduce protected fields into the validation payload.
   Use only the fields accepted by the existing POST validator when validating the merged record.
   Also ensure that an update containing only one field does not unexpectedly modify unrelated fields.
   Testing
   Create one clearly fictional PATCH test opportunity through the existing POST endpoint.
   Test:
   1. Updating a single field successfully.
   2. Updating multiple fields.
   3. Preserving unchanged fields.
   4. Returning the updated record through GET.
   5. Returning 400 for an empty body.
   6. Returning 400 for invalid fields or values.
   7. Returning 404 for a nonexistent opportunity.
   8. Rejecting inconsistent location and compensation combinations.
   9. Correct handling of optional null fields.
   10. Automatic updating of lastUpdated.
   Verify that invalid requests cause no database writes.
   Confirm that the three existing opportunities remain unchanged.
   Test data
   Keep the fictional PATCH test opportunity temporarily for our upcoming Edit form.
   Do not delete any opportunity without my specific approval.
   Security
   This endpoint is for local development only because authentication has not been implemented.
   Do not deploy unrestricted write endpoints publicly.
   Return generic error messages for unexpected failures.
   Verification
   Run lint and build checks.
   Confirm no schema changes or migrations occurred.
   Confirm the existing GET and POST endpoints still work.
   Confirm the original OpenRaiz repository remains unchanged.
   Documentation
   Update PROMPT_LOG.md with:
   - This exact prompt.
   - The implementation steps.
   - Files modified.
   - Tests performed and their actual results.
   - Mistakes and corrections.
   - The previous commit reference 46d4fc2.
   Git
   After verification, propose a descriptive commit message and show the modified files.
   Do not commit or push without my approval.
   Boundaries
   Do not implement DELETE.
   Do not build the Edit form yet.
   Do not modify the existing OpportunityForm component.
   Do not import the original ten opportunities.
   Stop after completing Step 5.1B.
   ```
   (The user's message before this one was `Yes, commit and push the GET endpoint`, carried out as commit `46d4fc2`; the agent's recap of the PATCH design was given in chat before this prompt.)

### Implementation steps
1. **Read the existing code and the approved decisions:** the POST validator, `serializeOpportunity`, the `[id]` route and the user's validation note (Step 5.1A entry).
2. **Wrote `lib/validateOpportunityUpdate.js`** (new). `validateOpportunityUpdate(body, existing)`:
   1. The body must be a JSON object with at least one field (`{}` gives "Send at least one field to update.", HTTP 400 from the route).
   2. Each field in the request is checked first: the five protected fields (`id`, `legacyId`, `createdAt`, `lastUpdated`, `source`) are rejected ("set by the server"), unknown fields are rejected ("Unknown field."), and `null` is rejected for any field that is not clearable.
   3. **Clearable with `null`:** only `city`, `state`, `address` and `deadline`. (An empty string also clears `deadline`/optional text, because the existing validator treats an empty optional value as null.) `null` for a required field or for `status` is a 400, because otherwise the existing validator would quietly treat `status: null` as "use the default" and the PATCH would silently ignore it.
   4. **Normalize and merge:** the stored Prisma row is converted with `serializeOpportunity` (dates become `YYYY-MM-DD` text, like a POST body). A merged record is built from **only the 16 editable fields** (the fields the POST validator accepts), so `id`, `legacyId`, `createdAt`, `lastUpdated` and `source` from the stored row can never enter the validation payload; the request's fields are laid over it.
   5. **Validate the complete merged record with the existing `validateOpportunity`** (unchanged), so every rule that applies on create applies on update: compensation consistency, location rules, application method and value, enums, dates, lengths. If a problem is in a field the request did not mention (it comes from a value already saved), the message gets a note: "(This is the value currently saved; include this field in the request to change it.)"
   6. **Return only what was asked:** on success it returns `data` containing only the keys named in the request, with dates as UTC `Date` objects and text trimmed. Nothing else is passed to Prisma.
3. **Extended `app/api/opportunities/[id]/route.js`** with a `PATCH` handler (and updated the comment at the top). Order, following the user's list: reject impossible ids with 404 (no database call); look the opportunity up with `findUnique` and answer 404 if it does not exist; read the JSON body (400 if malformed or empty); run `validateOpportunityUpdate` (400 with `{error, details:[{field, message}]}` if invalid, nothing written); `prisma.opportunity.update({ where: { id }, data })` with only the named fields (Prisma sets `lastUpdated` to today's UTC date automatically); return the updated row through `serializeOpportunity` with HTTP 200. A `P2025` error from Prisma (the row was deleted between the lookup and the update) is answered with 404; any other error is logged as name and code only and answered with a generic `500 {"error":"Could not update the opportunity."}`. The `GET` handler is unchanged.
4. **Unit-tested the validator** (no database), then tested the endpoint against the real development database with one new fictional record, then verified the build, the failure case, and the protected files.

### Files created or modified
- **Created:** `lib/validateOpportunityUpdate.js`.
- **Modified:** `app/api/opportunities/[id]/route.js` (added `PATCH`, two imports, and a comment), `PROMPT_LOG.md` (this entry and the `46d4fc2` reference).
- **Unchanged (verified with `git diff --quiet`):** `app/api/opportunities/route.js` (list and POST), `lib/validateOpportunity.js`, `lib/serializeOpportunity.js`, `lib/prisma.js`, `lib/opportunityOptions.js`, all of `components/` (including `OpportunityForm.js`), `app/page.js`, `app/globals.css`, the form page, `prisma/` (schema and migration), `package.json`, `package-lock.json`. No DELETE, no Edit form, no new dependencies.
- **Duplicated on purpose:** the lists of editable and protected fields exist in `lib/validateOpportunityUpdate.js` because the POST validator (which the user did not approve changing) does not export its lists. A unit test confirms the two agree; if a field is ever added to the POST validator, the update validator's lists must be updated too.

### Commands executed
- Reading the existing files; `npm run lint` (several times); `npm run build` (twice)
- Validator tests: an inline Node script with 85 checks, no database
- `npm --prefix <project folder> run dev` (background dev server); Node `fetch` requests to the dev server
- Node scripts using `pg`: row snapshots (`to_jsonb` with short SHA-256 fingerprints, and `md5` hashes), PostgreSQL's write counters (`pg_stat_user_tables`), and PostgreSQL's hidden row columns `xmin` and `ctid` (to prove "no write")
- **One direct database write, to the test record only, as test setup:** `UPDATE "Opportunity" SET "lastUpdated" = DATE '2020-01-15' WHERE id = <the test record's id>` (see Test data and Problems)
- `DATABASE_URL="postgresql://nobody:notarealpassword@127.0.0.1:1/nodb" npx next start -p 3001` (a production build with a **fake, unreachable** address, to test the 500 response; no real credential involved), and `npx next start -p 3002` (the production build against the real development database, with non-writing requests only); `pkill` of servers I started
- `npx prisma migrate status`, `npx prisma migrate diff --from-config-datasource --to-schema prisma/schema.prisma --exit-code`; `git status`, `git diff --quiet`; in the original repo `git status --short`, `git rev-parse --short HEAD` and the file-timestamp fingerprint
- **No row was deleted. The three existing opportunities were never sent a PATCH of any kind.**

### Test data
- **Created:** one clearly fictional record through the existing `POST /api/opportunities` (a valid POST, which also confirms POST still works): id `cmvafb1lx0000oait161gtpzf`, "PATCH Test Opportunity (Fictional)", organization "Fictional PATCH Testing Org", a hybrid job in Oakland, CA, paid ("Paid, $25/hr"), `datePosted` 2026-10-15, deadline 2026-12-15, application link `https://example.org/apply/patch-test`, status `active`.
- **Kept**, as the user asked, for the upcoming Edit form. After the tests it was restored, through PATCH itself, to its original POSTed values (verified identical on every field the POST set); only its `lastUpdated` differs from creation time (it is `2026-10-16`, set automatically).
- **The one direct database write:** to be able to see PATCH update `lastUpdated` automatically (a record created today already has today's date), the agent set this **test record's** `lastUpdated` to `2020-01-15` with a direct SQL `UPDATE`, restricted to its id. This was not done through the API and was done only to the test record.
- **Nothing was deleted.** The database now holds 4 rows: the three earlier ones (unchanged) and this one.

### Test results (only what actually ran)
**Validator alone (no database): 85 checks, 0 failures.** Covered: a one-field update returns only that field; several fields return exactly those fields, trimmed; stored values not named, and the protected fields of a stored row that has `legacyId` and `source` set, never appear in the result or in the checked payload; dates become UTC `Date` objects; empty and malformed bodies; all five protected fields; unknown fields; `null` clearing and the 12 non-clearable fields; switching to remote with and without clearing, remote to hybrid or on-site, and clearing only part of the location; compensation and `isPaid` contradictions, including ones created by changing a single field against the saved value; application method and value combinations; enums, text, lengths and dates; and a check that the update validator's editable and protected field lists agree with the POST validator's actual behavior (16 editable, 11 required plus 5 optional, and 5 protected).

**Through the real API on the development server (156 checks; 136 passed; the 20 reported failures were all my write-counter checks, explained below, and the counters later settled at exactly the expected values):**
- **Rejected requests (35), all with the right status:** `{}`, JSON `null`, an array, a JSON string, malformed JSON, an empty body and plain text (400); each of the five protected fields (400); unknown fields (400); an empty title, `title: null`, `status: null`, a bad enum, an impossible date, a deadline before 2000 and `isPaid` as text (400); switching to remote without clearing city, state and address (400, naming `city`, `state` and `address`); `city: null` on a hybrid record (400); `isPaid: false` while the saved compensation says "Paid" and `compensation: "Unpaid"` while `isPaid` is true (400, naming `compensation`); switching the method to email with a link still saved, and a link value of "not a url" (400); a valid field combined with an invalid or a protected one (400, nothing saved); a nonexistent id with a valid body, with malformed JSON and with an empty body, a null-byte id, an upper-case copy of the real id and a 5,000-character id (all 404 `{"error":"Opportunity not found."}`; the nonexistent id with malformed JSON gives 404 because the lookup comes first).
- **Invalid requests wrote nothing:** after the 35 rejected requests the test record was byte-identical (same fingerprint, and `lastUpdated` still `2020-01-15`, so there was no hidden write). A second, independent proof that cannot lag: after a further 28 invalid and not-found PATCH requests, all four rows had the same `xmin` (PostgreSQL's record of the last transaction to write each row), the same physical location (`ctid`) and the same content hash. The three existing opportunities were unchanged in both.
- **Valid updates (17 PATCH requests), each checked against a row-level diff of the database, against GET, and for untouched columns:** a single field (`title`); several fields (`compensation`, `description`, `deadline`, `status`); clearing `deadline` with `null`, setting it again, and clearing it with `""`; clearing `address` with `null` on a hybrid record (city and state stayed); switching to remote with `city`, `state` and `address` set to `null` (all NULL in the database) and back to hybrid with all three; paid to unpaid and back, with `isPaid` and `compensation` sent together; the application method to email with an address and back to a link; `datePosted` (stored in PostgreSQL as the calendar date `2026-10-14`); text trimmed; `type` and `livedExperienceRelevance`; `status` back to active; and a final restore. For every one, exactly the columns named in the request changed (plus `lastUpdated`), `id`, `createdAt`, `legacyId` and `source` never changed, and `GET /api/opportunities/[id]` returned exactly the JSON the PATCH returned.
- **`lastUpdated` updates automatically:** with the test record's `lastUpdated` set to `2020-01-15`, the first successful PATCH changed it to `2026-10-16`, today's **UTC** date, without the request supplying it (as designed in Step 2.7, "today" is the UTC date).
- **Existing GET and POST still work:** the valid POST created the test record (HTTP 201, `legacyId` null); `GET /api/opportunities` returned 4 rows; the homepage, the form page and `GET` by id still returned 200. `app/api/opportunities/route.js` is unchanged.

**Write counters, and why 20 checks "failed":** PostgreSQL's table statistics (`pg_stat_user_tables`) are reported asynchronously, so a reading taken right after a write can be late. My checks compared the counters immediately after each request, and the early readings lagged (for example `8 -> 8` and then `8 -> 11`), producing 20 false failures. The readings taken 0, 5 and 15 seconds later were all exactly **51/24/2**: +1 insert (the test record) and +18 updates (1 setup write plus 17 successful PATCHes) from the starting 50/6/2, with no deletes, so every write is accounted for exactly. **Lesson:** counters are weak evidence of "no write" in a moment-to-moment test; row fingerprints, `xmin` and content hashes are the reliable evidence. (Earlier steps also quoted "counters unchanged" as supporting evidence for "no write"; in those steps the row content and counts were also compared, and the counters were read after the earlier writes had arrived, but they should be read as secondary evidence.)

**Failure case (production build, fake unreachable database):** a valid PATCH returned HTTP 500 with exactly `{"error":"Could not update the opportunity."}`; the server console logged only `PATCH /api/opportunities/[id] failed: PrismaClientKnownRequestError P1001`. An empty (invalid) PATCH in the same situation also returned 500, because the record lookup comes first as specified (the validation needs the stored record), so with the database down the client cannot be told the body was invalid; an impossible id still returned 404 without touching the database. One of my sensitive-string probes reported a "leak" for the word `update `, but that is the verb in our own generic message ("Could not **update** the opportunity."); the full response is just that one sentence, with no credentials, host, id or submitted title (a false positive in my probe list).

**Production build against the real development database (non-writing requests only):** empty PATCH gave 400 "Send at least one field to update."; switching to remote without clearing gave 400 naming `city`, `state` and `address`, with the message "Must be empty for a remote opportunity. (This is the value currently saved; include this field in the request to change it.)"; a protected field and malformed JSON gave 400; a nonexistent id gave 404; GET one gave 200; GET list gave 200 with 4 rows; and no row was written (same `xmin` and hashes before and after).

**Other verification:** `npm run lint` passes; `npm run build` compiles successfully and lists `ƒ /api/opportunities` and `ƒ /api/opportunities/[id]`. `npx prisma migrate status` says "Database schema is up to date!"; the live-database-vs-schema comparison returned exit code 0 (no differences); `prisma/migrations/` has only the original migration; `_prisma_migrations` has 1 record. The three earlier opportunities have the same fingerprints as at the start of the step. The original OpenRaiz repo: 0 changed files, commit `0113d35`, file-timestamp fingerprint matches the Step 1 baseline. Production was not touched. No credentials were printed, and a scan of this log found none.

### Problems found, errors and corrections
- **My write-counter checks were the wrong instrument** (20 false failures), as explained above. **Correction:** waited for the counters to settle (exactly the expected 51/24/2) and added the `xmin`/`ctid`/content-hash proof that "no write" happened.
- **A false positive in a sensitive-string probe** (the word `update ` appears in our own generic message), as explained above. No correction to the code was needed.
- **A deliberate direct database write (test setup)** to the test record's `lastUpdated`, disclosed above. It was done only on the test record created for this purpose, but it was a write outside the API that the user had not specifically asked for.
- **No bug was found in the PATCH code by these tests** (unlike Step 5.1A, where testing found the null-byte bug); the id check from Step 5.1A is reused.
- (Several automated notifications about servers I stopped on purpose were not from the user and required no action.)

### Known limits, stated plainly
- **No authentication:** `PATCH` is for local development only. It must not be deployed publicly until sign-in and authorization exist.
- **Two edits at the same moment** could overwrite each other (the record is read, validated and written without a lock). Acceptable for a single local administrator.
- **Re-saving unchanged values** still updates `lastUpdated` to today (Prisma's automatic behavior for any update).
- **Existing records that already break a current rule** (none of the ten original listings do) would make an update to an unrelated field fail with a message about the saved value.
- **Lookup before validation:** with the database down, an invalid body gets a 500, not a 400 (see above).
- The three pre-existing records were not PATCHed (by design), so PATCH on a record that has a `legacyId` was tested only with a fixture in the unit tests.

### Lessons learned
- Build the checked payload from an explicit list of accepted fields, so server-controlled fields from the stored row can never leak into validation.
- Treat `null` carefully: decide per field whether it means "clear" or is an error; a validator written for create may quietly turn `null` into "use the default".
- For "no write happened", rely on row content and `xmin`, not on lagging statistics counters.
- A test needs a clearly defined, disclosed setup step when it must change test data outside the API.
- **Process rule set by the user after this step (applies from now on):** ask for approval **before** performing any database modification that is outside the explicitly authorized testing plan, even when the record being modified is a fictional test record. (The direct SQL `UPDATE` of the test record's `lastUpdated` described above is the example that prompted this rule; the record of it is deliberately kept in this log.) In practice, a plan that involves changing stored rows will list exactly which records and which changes, and wait for approval.
- **Duplicated field lists:** the user decided the duplicated editable/protected field definitions in `lib/validateOpportunityUpdate.js` may stay for now; they are not to be refactored without approval.

### Security notes
`PATCH` (like `POST`) has no authentication and is local-only; the comment at the top of the route file says so. Error responses are generic (a single sentence, no database details and no echo of the id or submitted values), and only an error's name and code are logged on the server.

### Follow-up prompt
2. ```
   I approve committing and pushing Step 5.1B.
   Approved files:
   - app/api/opportunities/[id]/route.js
   - lib/validateOpportunityUpdate.js
   - PROMPT_LOG.md
   Approved commit message:
   Add PATCH /api/opportunities/[id] endpoint with merged validation
   Before committing:
   1. Review the staged diff.
   2. Confirm only the three approved files are staged.
   3. Confirm no credentials, environment files, generated files, or database connection information are included.
   4. Confirm lint and build checks still pass.
   5. Confirm the existing four development database records remain intact.
   6. Confirm the original OpenRaiz repository remains unchanged.
   If everything passes, commit and push to origin/main.
   Provide the commit hash and confirm the push succeeded.
   Documentation
   Preserve the record of the direct SQL change made during testing.
   Going forward, ask for approval before performing database modifications outside the explicitly authorized testing plan, even when modifying fictional test records.
   The duplicated field definitions can remain for now. Do not refactor them without approval.
   Next: Step 5.2 — Edit Opportunity Interface
   After committing, prepare a plan to:
   - Add an Edit button or link to opportunity cards.
   - Create an edit page at /admin/opportunities/[id]/edit.
   - Load the selected opportunity's existing information.
   - Reuse OpportunityForm.js with initialValues.
   - Submit changes using PATCH /api/opportunities/[id].
   - Redirect to the homepage after a successful update.
   - Display validation errors without losing entered information.
   Use our existing mockup and OpenRaiz branding.
   Important boundaries
   Do not implement the Edit interface yet.
   Do not implement DELETE.
   Do not modify the Prisma schema.
   Do not modify existing database records.
   Stop after presenting the Step 5.2 plan and wait for my approval.
   ```
   → The agent updated this log (the process rule and the duplicated-lists decision above; the record of the direct SQL change was kept), ran the pre-commit checks below, committed and pushed, then wrote the Step 5.2 plan in chat.

### Git
- **Files committed (three, approved by the user):** `app/api/opportunities/[id]/route.js`, `lib/validateOpportunityUpdate.js` and `PROMPT_LOG.md`.
- **Commit message (approved):** `Add PATCH /api/opportunities/[id] endpoint with merged validation` (no Co-Authored-By trailer).
- **Pre-commit checks (agent):** the staged diff was reviewed; exactly the three approved files staged; no `.env`, generated, build, package or binary files, and no database connection information in the staged diff (a scan found no credential, hostname or endpoint parts); `npm run lint` and `npm run build` pass; the four development database records are intact (the three earlier ones have the same fingerprints as at the start of Step 5.1B, and the PATCH test record is unchanged since the end of that step); the original OpenRaiz repo unchanged (0 changed files, commit `0113d35`).
- **Commit reference:** `24f274391441f6bdcfe5463d6d1fe803889ad213` (short `24f2743`), 3 files changed (`app/api/opportunities/[id]/route.js`, `lib/validateOpportunityUpdate.js`, `PROMPT_LOG.md`; 354 insertions, 4 deletions); pushed to `origin/main`; `git ls-remote origin main` returned the same hash, the remote tree lists both code files, and the working tree was clean afterwards. Recorded here during Step 5.2.

---

## Milestone 5, Step 5.2 — Edit Opportunity interface

- **Date:** 2026-10-16 (UTC)
- **Objective:** Let the user click Edit on an opportunity card, see its saved information in a form, change it and save through the existing `PATCH /api/opportunities/[id]` endpoint. No DELETE, no search or filters, no change to the API, the validators or the schema, and **no database writes during testing** (the user will verify saving in their own browser).
- **Previous commit:** `24f2743` (`Add PATCH /api/opportunities/[id] endpoint with merged validation`).

### Exact prompt
1. ```
   I approve Milestone 5, Step 5.2: Building the Edit Opportunity interface.
   Approved decisions
   1. PATCH requests should include only fields that changed.
   2. Use the showAdminActions prop to control visibility of Edit links.
   3. Load the existing opportunity directly through Prisma in the Server Component.
   4. Create a friendly not-found page.
   5. Do not perform database writes during your testing. I will verify saving through my browser.
   6. Simplify validation messages displayed in the form, while preserving their meaning.
   Objective
   Allow me to click Edit on an opportunity card, review its existing information, make changes, and save those changes through our existing PATCH API.
   Step 1 — Edit page
   Create:
   app/admin/opportunities/[id]/edit/page.js
   Use the installed Next.js version's conventions for asynchronous route parameters and Suspense.
   The page should:
   - Retrieve the selected opportunity through Prisma.
   - Convert it with our existing serializer.
   - Display the opportunity's title.
   - Render the reusable OpportunityForm with its existing values.
   - Display a local-development-only notice.
   - Return a 404 when the opportunity doesn't exist.
   Create a small, branded not-found page:
   app/admin/opportunities/[id]/edit/not-found.js
   Step 2 — Reuse OpportunityForm
   Modify:
   components/OpportunityForm.js
   Add support for:
   - mode="edit".
   - An existing opportunity ID.
   - Initial values from the saved opportunity.
   - A Save Changes button.
   - Submitting changes through PATCH /api/opportunities/[id].
   Preserve Create mode and its existing POST behavior.
   Step 3 — Update helpers
   Modify:
   lib/opportunityOptions.js
   Add helpers to:
   - Convert saved opportunity data into form values.
   - Compare original and current form values.
   - Build a PATCH request containing only changed fields.
   - Send explicit null values when clearing optional fields.
   - Clear city, state, and address when switching to Remote.
   If no fields have changed, show "No changes to save." without making an API request.
   Step 4 — Edit links
   Modify:
   components/OpportunityCard.js
   Add a small Edit link controlled by showAdminActions.
   Its accessible name should include the opportunity title.
   Update app/page.js to enable the link for our local development demonstration.
   Step 5 — Styling
   Update app/globals.css using the existing OpenRaiz branding and approved mockup.
   Keep the form responsive and accessible.
   Do not introduce new styling libraries.
   Step 6 — Error handling
   - Display field-specific validation errors.
   - Preserve entered information after failed submissions.
   - Display a clear message when an opportunity no longer exists.
   - Show generic messages for unexpected failures.
   - Never expose database credentials or internal errors.
   Step 7 — Verification
   Perform read-only and non-persistent tests:
   1. Verify edit pages load for the four existing development opportunities.
   2. Verify fields are prefilled correctly.
   3. Verify Edit links point to the correct pages.
   4. Verify unknown IDs display the not-found page.
   5. Test the PATCH body-building helper without writing to the database.
   6. Verify changing to Remote includes the required null values.
   7. Verify unchanged fields are omitted.
   8. Confirm Create mode remains functional.
   9. Run lint and build checks.
   10. Confirm the database still has four opportunities.
   11. Confirm no schema changes or migrations occurred.
   12. Confirm the original OpenRaiz repository remains unchanged.
   Do not execute actual PATCH requests during testing.
   Do not create, modify, or delete database records.
   I will test saving changes through my browser after you finish.
   Step 8 — Documentation
   Update PROMPT_LOG.md with:
   - This exact prompt.
   - Files created and modified.
   - Verification results.
   - Errors or corrections.
   - The previous commit reference 24f2743.
   Do not claim that I've personally tested the Edit interface until I confirm it.
   Step 9 — Git
   After verification:
   - Show the modified files.
   - Propose a descriptive commit message.
   - Wait for my approval before committing or pushing.
   Important boundaries
   Do not implement DELETE.
   Do not add search or filtering.
   Do not modify the API or validation rules.
   Do not modify the Prisma schema.
   Do not modify the original OpenRaiz repository.
   Stop after completing Step 5.2.
   ```
   (The user's messages before this one: the agent's Step 5.2 plan and six questions were given in chat after commit `24f2743`; the user replied `pause`, and then sent this prompt, which contains the answers. During the pause the agent changed nothing.)

### Reading the bundled Next.js docs first
- A dynamic page's `params` is a Promise; with Cache Components it is runtime data, and the docs recommend passing the promise down and awaiting it **inside** `<Suspense>`.
- `notFound()` from `next/navigation` renders the segment's `not-found.js`. **Status codes:** "Before streaming starts, Next.js returns a 404 status code. After streaming starts, the status code remains 200 and the not-found UI renders in the response", with a `noindex` tag added. The idiomatic pattern in this version (a lookup inside `<Suspense>`) therefore shows the not-found page with HTTP **200**, not 404.

### Files created or modified
- **Created:** `app/admin/opportunities/[id]/edit/page.js` (the edit page), `app/admin/opportunities/[id]/edit/not-found.js` (the branded not-found page).
- **Modified:** `components/OpportunityForm.js` (edit mode), `lib/opportunityOptions.js` (new helpers), `components/OpportunityCard.js` (Edit link), `app/page.js` (turns the link on), `app/globals.css` (styles appended), `PROMPT_LOG.md` (this entry and the `24f2743` reference).
- **Unchanged (verified with `git diff --quiet`):** all of `app/api/`, `lib/validateOpportunity.js`, `lib/validateOpportunityUpdate.js`, `lib/serializeOpportunity.js`, `lib/prisma.js`, `prisma/` (schema and migration), `package.json`, `package-lock.json`. No DELETE, no search or filters, no new dependencies.
- **Temporary files:** screenshots and a throwaway compiled copy of the card used for one test were kept only in `.next/preview/` (a git-ignored build folder, wiped by every production build); none is part of any commit.

### What the code does
- **`lib/opportunityOptions.js`:**
  - `valuesFromOpportunity(opportunity)` turns a saved opportunity (the API's flat JSON) into the form's values: text as is, `isPaid` into the Paid/Unpaid radio choice, `null` city/state/address/deadline into empty text, dates as `YYYY-MM-DD` text.
  - `toPatchBody(originalValues, currentValues)` normalizes both sets of values the way the API stores them (trimmed text; an empty optional value as `null`; `isPaid` as true/false; city, state and address as `null` unless the opportunity is hybrid or on-site) and returns **only the fields whose value differs**. So clearing a deadline sends `{"deadline": null}`, switching to Remote sends `locationType` plus `city`, `state` and `address` as `null` (even if text is still sitting in those hidden boxes), and an untouched form gives `{}`.
  - `simplifyErrorMessage` rewrites the API's technical wording in plain words, keeping the meaning (for example `Says the role is paid, but isPaid is false.` becomes `The compensation says paid, but "Unpaid" is selected.`; `Must be a real calendar date written as YYYY-MM-DD (years 2000 to 2100).` becomes `Must be a real date between 2000 and 2100.`; `hybrid and onsite` becomes `hybrid and on-site`; the update endpoint's note `(This is the value currently saved; include this field in the request to change it.)` is removed; unknown messages pass through unchanged). `groupErrorsByField` now applies it, so it also affects the Add form's messages (the user asked for simplified messages in the form).
- **`components/OpportunityForm.js`:** new props `mode` (`"create"` by default, or `"edit"`), `opportunityId`, `initialValues` and an optional `submitLabel` (default "Save Opportunity", or "Save Changes" in edit mode). **Create mode is unchanged:** it still builds the whole body with `toRequestBody` and sends `POST /api/opportunities`, expecting 201. **Edit mode** keeps the original values from page load, and on submit builds `toPatchBody(original, current)`: if it is empty, it shows the note "No changes to save." (a neutral message, announced politely) and sends **nothing**; otherwise it sends `PATCH /api/opportunities/<id>` with only the changes and expects 200. After a successful save it does a full page load of the homepage (so the homepage re-reads the database). On 400 it shows each message under its field and a summary; on 404 it says "This opportunity no longer exists, so your changes were not saved." with a link back; on anything else (or a network failure) it shows a generic "…and the changes were not saved. Please try again." The form never resets its state on a failure, so everything typed is kept.
- **`components/OpportunityCard.js`:** new prop `showAdminActions` (default **false**). When true, a small outlined "Edit" link appears at the bottom right of the card, pointing to `/admin/opportunities/<id>/edit`, with the accessible name "Edit <title>". Without the prop the card is unchanged.
- **`app/page.js`:** passes `showAdminActions` to every card, with a comment that this is for the local demo only and must be removed or restricted to signed-in administrators before the directory is shown to the public (there is no sign-in yet).
- **`app/admin/opportunities/[id]/edit/page.js`:** a Server Component. The page (header, back link, `<Suspense>` with a "Loading opportunity…" placeholder) passes `params` down; inside the boundary it awaits `params`, treats an id that cannot exist (letters, digits, hyphens and underscores only, at most 100 characters; the same rule as the API) as not found without asking the database, otherwise reads the opportunity with `prisma.opportunity.findUnique`, calls `notFound()` if there is none, converts it with `serializeOpportunity`, and shows "Edit Opportunity", "Editing <title>", the local-development-only notice and the form in edit mode with `valuesFromOpportunity(saved)`. If the database cannot be reached it shows a plain message ("We couldn't load this opportunity right now…") and logs only the error's name and code.
- **`app/admin/opportunities/[id]/edit/not-found.js`:** a branded page with the OpenRaiz header, "Opportunity not found", a short explanation and a green "Back to opportunities" button.
- **`app/globals.css`:** an action row in the card footer (pills on the left, Edit on the right), a small button size, the neutral "No changes to save." note, and a link style inside the error summary, using the original palette.

### Commands executed
- Reading docs and the existing files; `npm run lint` (several times); `npm run build` (three times, each preceded by stopping the dev server because both use the `.next` folder)
- `npm --prefix <project folder> run dev` (background dev server, restarted after each build); `curl` and Node `fetch` requests (GET only, plus one invalid POST)
- Read-only Node scripts using `pg` and Prisma (`findMany`): baseline and final snapshots of all four records using PostgreSQL's hidden row columns `xmin` (the last transaction to write the row) and `ctid` plus a content hash, row counts, write counters, and field-by-field reads
- Helper and validator checks: inline Node scripts that read the real stored records through Prisma, build form values and PATCH bodies with the new helpers, and pass those bodies to the real `validateOpportunityUpdate` (a function, so nothing is sent or written), under `TZ=America/Los_Angeles`, `UTC` and `Pacific/Kiritimati`
- `typescript.transpileModule` (the TypeScript compiler already installed) to compile the card once and render it with `react-dom/server`, with and without `showAdminActions`
- Headless Chrome (`--headless=new`, throwaway profiles in `.next/preview/`, not the user's profile): `--dump-dom` with console logging for eight page loads, and `--screenshot` at desktop width and in a 390 px frame
- `DATABASE_URL="postgresql://nobody:notarealpassword@127.0.0.1:1/nodb" npx next start -p 3001` (a production build with a **fake, unreachable** address, to test the error state; no real credential involved) and `npx next start -p 3002` (the production build against the real development database, GET requests and one invalid POST only); `pkill` of servers I started
- `npx prisma migrate status`, `npx prisma migrate diff --from-config-datasource --to-schema prisma/schema.prisma --exit-code`; `git status`, `git diff --quiet`; in the original repo `git status --short`, `git rev-parse --short HEAD` and the file-timestamp fingerprint
- **No PATCH request of any kind was sent** (not even an invalid one), **no POST that could create a row, and no database write, direct or through the API.**

### Verification results (only what actually ran), numbered as in the prompt
1. **Edit pages load for the four existing development opportunities:** `GET /admin/opportunities/<id>/edit` returned HTTP 200 for each of `cmvabung80000uoitdge182wa`, `cmvadtgq70000kgitvumgz8ii`, `cmvae82zz0000pwit532gndbd` and `cmvafb1lx0000oait161gtpzf`, with the heading "Edit Opportunity", the record's title, the local-development-only notice, a "Save Changes" button and a Cancel link. This held in the development server and in a production build.
2. **Fields are prefilled correctly:** for each of the four records, every form control was read from the server HTML **and** from the live DOM after the page's JavaScript ran (headless Chrome), and compared with a direct read of the database: title, organization, description, type, relevance, work arrangement, application method and value, status, the Paid/Unpaid radio, compensation, date posted (the saved date, not today's), deadline (blank for the rolling record), and city, state and address (shown and filled for the two hybrid records, absent for the two remote ones). 0 mismatches in either view. No database or credential text appears in the HTML.
3. **Edit links point to the correct pages:** the homepage shows 4 cards with exactly one Edit link each, `href` `/admin/opportunities/<that card's id>/edit`, visible text "Edit" and accessible name "Edit <title>" (for example "Edit Youth Policy Fellow (Fictional Test Listing)"). Rendering the card on its own, with and without `showAdminActions`, shows: without the prop there is no Edit link and no admin address in the card; with it there is an Edit link to `/admin/opportunities/<id>/edit` whose accessible name includes the title (correctly escaped); apart from that link the card is identical. There is no Delete control anywhere.
4. **Unknown ids display the not-found page:** a well-formed id that does not exist, a null byte, a space, 101 and 5,000 characters, SQL-looking text and an upper-case copy of a real id all show the branded "Opportunity not found" page, with no form, a `noindex` tag, and a link back to the homepage; the hydrated page has exactly one OpenRaiz header. **Important: every one of these returns HTTP 200, not 404.** The user's prompt asks for a 404 when the opportunity does not exist; the page does show the not-found page, but in this version of Next.js the status of a streamed page is fixed at 200 once streaming has started (see "Problems found" for how this was decided, and the options).
5. **The PATCH body-building helper, tested without writing:** with real records, 53 checks per time zone, 0 failures in each of three time zones. For every one of the four records: saved values to form values keep every text field exactly; an untouched form gives an empty body (so no request would be sent); adding only surrounding spaces still gives an empty body.
6. **Changing to Remote includes the required nulls:** hybrid to remote gives `{"locationType":"remote","city":null,"state":null,"address":null}`, and the same even when text is still in the hidden city, state and address boxes. Remote to hybrid with a city and state sends them; without them only the arrangement is sent, so the server names city and state. Text typed into hidden location boxes on a remote record is never sent. Hybrid to on-site sends only the arrangement.
7. **Unchanged fields are omitted:** one edited field gives exactly that field; three edited fields give exactly those three; a field changed and then set back to its original value is omitted; the body never contains `id`, `legacyId`, `createdAt`, `lastUpdated`, `source` or the form-only `paid` key. Clearing the deadline gives `{"deadline":null}`, clearing the address gives `{"address":null}`, paid to unpaid gives `isPaid` and `compensation` together.
- **What the real update validator says about those bodies (a function call against the real stored records; no request was sent):** one edited field, clearing the deadline, clearing the address, hybrid to remote with the nulls, remote to hybrid with city and state, and paid to unpaid together are all accepted; remote to hybrid without city and state is rejected naming `city` and `state`; choosing Unpaid while the compensation still says "Paid, $25/hr" is rejected on `compensation`; clearing the title, clearing the city on a hybrid record, a bad link and a date before 2000 are each rejected on the right field.
- **Simplified messages:** the API's wording `Says the role is paid, but isPaid is false. (This is the value currently saved; include this field in the request to change it.)` appears in the form as `The compensation says paid, but "Unpaid" is selected.`; a date error reads `Must be a real date between 2000 and 2100.`; "This field is required." and "Must be a valid email address." are unchanged; a message the helper does not know passes through unchanged.
8. **Create mode remains functional (read-only evidence):** the Add Opportunity page loads in both the development server and a production build as an empty form with no choices made, the button "Save Opportunity" (not "Save Changes"), and today's local date in "Date posted"; the create helper `toRequestBody` still drops stale location text for remote, omits a blank deadline, maps `isPaid`, and includes every required field; the create code path in the form is the same code as before (`POST`, expecting 201). An **invalid** POST returned HTTP 400 with 11 field errors, so the endpoint the Add form calls is alive and validating. **A valid POST was not sent, because that would create a row;** so the Add form's saving was not re-tested in this step (the user confirmed it themselves in Step 4.2, before these changes).
9. **Lint and build:** `npm run lint` passes with no warnings; `npm run build` compiles successfully and lists `◐ /` (partial prerender), `○ /admin/opportunities/new`, `◐ /admin/opportunities/[id]/edit`, `ƒ /api/opportunities` and `ƒ /api/opportunities/[id]`.
10. **The database still has four opportunities, and none was touched:** a snapshot taken before any check and one taken after everything (including the production-build runs) are identical for all four records on `xmin`, `ctid` and content hash: no transaction wrote to any row. PostgreSQL's write counters are still 51 inserts, 24 updates and 2 deletes, the same as at the start of the step.
11. **No schema changes or migrations:** `npx prisma migrate status` says "Database schema is up to date!"; the live-database-vs-schema comparison returned exit code 0 (no differences); `prisma/migrations/` has only the original migration; `_prisma_migrations` has 1 record.
12. **Original OpenRaiz repo:** 0 changed files, commit `0113d35`, file-timestamp fingerprint matches the Step 1 baseline. Production was not touched. No credentials were printed, and a scan of this log found none.
- **Error state:** a production build with a fake unreachable database shows the edit page with the plain message "We couldn't load this opportunity right now. Please try again in a moment." announced as an alert, no form, the header and back link still present, and nothing sensitive anywhere in the HTML; the server console logs only `Edit page could not load the opportunity: PrismaClientKnownRequestError P1001`. An impossible id in the same situation still shows the not-found page without touching the database, and the Add page still loads.
- **Browser console:** across eight page loads in headless Chrome after the final change (the four edit pages, the Add page, two not-found pages and the homepage), the only page messages were the dev server's "[HMR] connected" and React's "Download the React DevTools" notice; no hydration error, no React warning, and no Next.js warning (see Problems for one that was found and fixed).
- **Visual review by the agent (not by the user):** screenshots from headless Chrome at desktop width show: the homepage with a small outlined Edit button at the bottom right of every card beside the pills, and the "Add Opportunity" button at the top; the edit page as the same branded white form card as the Add page, filled with the record's values, with the subtitle "Editing <title>" and the local-only notice; and the not-found page with the sprout header, a clear message and a green "Back to opportunities" button. **Not visually confirmed:** the edit page at phone width (two attempts caught only the loading placeholder, the same streaming-timing problem as before; the form uses the same responsive CSS as the Add page, which was confirmed at 390 px in Step 4.2).
- **NOT verified by the agent (no browser-driving tool was available, and no writes were allowed):** clicking Edit and arriving on the page; typing in the form; the "No changes to save." note actually appearing; the Remote/Hybrid switch hiding and showing the location fields on the edit page; submitting with Save Changes; the redirect to the homepage and the updated card; server errors appearing under the fields with typed values kept; the "no longer exists" message; the button disabling while saving. These all depend on code the agent read and on helpers it tested, but did not watch run. **At the time of the agent's report the user had not yet confirmed any of them; the user's later, general confirmation is recorded under "User-confirmed result" below.**

### Checklist given to the user for their own browser check
At http://localhost:3000 (edits are saved, so use the **PATCH test record**, "PATCH Test Opportunity (Fictional)", or tell the agent which record to use): (a) click Edit on a card; (b) check the form shows the saved values; (c) click Save Changes without changing anything: "No changes to save."; (d) change one field (for example the title) and save: you land on the homepage and the card shows the change; (e) edit the record again and set the work arrangement to Remote and save (the city, state and address are cleared); then switch back to Hybrid with a city and state; (f) choose Unpaid while the compensation still says "Paid…" and save: the message appears under Compensation and everything you typed is still there; (g) click Cancel; (h) open `/admin/opportunities/doesnotexist1/edit` to see the not-found page. Every successful save changes the real development record.

### User-confirmed result (the user's own browser test)
After the agent's report and checklist, and a pause, the user wrote: `Edit flow works, commit and push it`. This is recorded as **user-confirmed: the Edit flow works.** The user did not list which checklist items they tried or what they saw, so only that overall statement is recorded; no individual item is recorded as confirmed. The user also did not comment on the agent's note that a missing opportunity shows the not-found page with HTTP status 200 instead of 404 (see Problems); the step was committed as it stands.

**What the user's testing left in the database (read afterwards by the agent, read-only; nothing was changed by the agent):** the development database still holds 4 opportunities. The three earlier records are unchanged on every check (same `xmin` transaction ids and content hashes as at the start of the step). Only the PATCH test record, `cmvafb1lx0000oait161gtpzf` ("PATCH Test Opportunity (Fictional)"), changed, through the user's own use of the Edit page: its type went from job to **internship**, its lived-experience relevance from welcomed to **preferred**, its work arrangement from hybrid to **remote** with `city`, `state` and `address` now empty (they had been Oakland, CA and a street address), and its deadline from 2026-12-15 to **2026-12-31**; its title, organization, compensation ("Paid, $25/hr"), paid status, date posted (2026-10-15), application method and status are unchanged, and `lastUpdated` is 2026-10-16. That is what a successful edit that switches an opportunity to Remote should leave behind (the form sends the cleared city, state and address as explicit nulls). PostgreSQL's write counters showed 51 inserts, 25 updates and 2 deletes at the time of the check (they were 51/24/2 at the start of the step; the counters can lag by a few seconds). Nothing was deleted. The user may want to restore that record before the next step.

### Problems found, errors and corrections
- **A real finding from the browser console, fixed (a design decision).** My first version of the edit page awaited `params` at the top of the page (outside `<Suspense>`) so that an id that cannot exist would return a **real HTTP 404** before streaming. Headless Chrome's console then showed, in the development server, Next.js's error-level message: `Route "/admin/opportunities/[id]/edit": Next.js encountered runtime data during prerendering … params … accessed outside of <Suspense> prevents the route from being prerendered, blocking the page load` (it appeared in 2 of 4 page loads). That conflicts with the convention the user asked me to follow ("the installed Next.js version's conventions for asynchronous route parameters and Suspense"), and in a developer's browser it can show up as an issue indicator that would confuse their own testing. **Correction:** the page now passes the `params` promise down and awaits it inside `<Suspense>`, as the docs recommend; the console is clean afterwards. **Consequence (a deviation from the prompt):** impossible-shaped ids no longer get a real 404; **every not-found case now shows the not-found page with HTTP status 200** and a `noindex` tag, which is exactly how this Next.js version behaves for a lookup inside `<Suspense>`. A true 404 status would need a check before streaming starts (for example in Next.js's Proxy file) or the "blocking route" option the warning mentions (`export const instant = false`), neither of which was chosen without the user's approval. The user can decide whether a real 404 status matters for this project.
- **A false alarm in my own prefill check (4 false failures):** my first parser treated an attribute written as `selected=""` or `checked=""` as "not set" (an empty string is falsy in JavaScript), so every dropdown and the radio looked unselected. After fixing the check, all four pages matched the database on every field. The page was right; my reading of it was wrong.
- **A counting mistake in my own check:** the "4 Edit buttons" check also counted the class name inside the page's embedded data scripts (8 instead of 4). Counting only the real page gives 4 cards, 4 Edit links and the Add button.
- **A too-narrow noise filter:** my first console check reported "errors" that were Chrome's own macOS display and network messages (`CVDisplayLink…`, a `spdy_session` warning), and then I confused React's INFO-level DevTools notice for a problem. Listing every distinct `CONSOLE:` message from all page loads showed only HMR, the DevTools notice, and (before the fix above) the Next.js runtime-data message.
- **A failed edit script that changed nothing:** my first attempt to update the form searched for the loading label as the text `\u2026`, but the file stores the actual `…` character; the script stopped before writing, the form file was unchanged, and I reran it with the right text.
- **Screenshots wiped by a build:** each production build deletes the `.next` folder, including the saved screenshots, so I retook them.
- **Phone-width screenshots of the edit page** kept catching the loading placeholder (timing); not confirmed (see above).
- **A third copy of the id rule:** the "letters, digits, hyphens and underscores, at most 100" rule now exists in `app/api/opportunities/[id]/route.js` and in the edit page. It was not extracted into a shared file, to keep this step small; it could be unified later.
- (Several automated notifications about servers I stopped on purpose were not from the user and required no action.)

### Known limits, stated plainly
- **No authentication.** The Edit links, the edit page and the PATCH endpoint are for local development only. `showAdminActions` is on for the homepage; it must be turned off, or restricted to signed-in administrators, before the directory is shown to the public.
- **HTTP 200 for a missing opportunity** (see above).
- **Two people editing the same record at the same moment** could overwrite each other's changes to the same fields (only the fields each person changed are sent, which limits the damage).
- **The edit form's "Date posted"** shows the saved date; the automatic `lastUpdated` still uses the UTC date, as designed in Step 2.7.
- The form shows an error for a problem in a saved value only when the user's changes make it relevant; none of the four current records breaks a rule.

### Lessons learned
- Read the browser console as well as the page: it showed a Next.js convention warning that no page content revealed.
- Streaming has a price: once a page starts streaming, its HTTP status is fixed, so "show a not-found page" and "return a 404 status" can be different things.
- Send only what changed in a PATCH, compare normalized values (trimmed text, `null` for empty optional values), and let "nothing changed" mean "send nothing".
- When a check fails, first ask whether the check is wrong (three of this step's failures were mistakes in my own scripts).

### Security notes
The Edit interface and `PATCH /api/opportunities/[id]` have no authentication and are local-only; the edit page says so on screen, and the comments in the code say so. Error messages shown in the form are plain words, and no database detail, credential or internal error is ever shown (the server logs only an error's name and code).

### Follow-up prompts
2. ```
   pause
   ```
   → The agent made no changes and waited.
3. ```
   Edit flow works, commit and push it
   ```
   → The agent recorded the user's confirmation and what the user's testing changed in the database (above), ran the pre-commit checks below, committed and pushed.

### Git
- **Files committed:** `app/admin/opportunities/[id]/edit/page.js`, `app/admin/opportunities/[id]/edit/not-found.js`, `components/OpportunityForm.js`, `components/OpportunityCard.js`, `lib/opportunityOptions.js`, `app/page.js`, `app/globals.css` and `PROMPT_LOG.md`.
- **Commit message (the one the agent proposed, which the user approved by saying "commit and push it"):** `Add Edit Opportunity page and Edit links using PATCH with changed fields only` (no Co-Authored-By trailer).
- **Pre-commit checks (agent):** exactly those eight files staged; no `.env`, generated, build, package, binary or SQL files staged; a scan of the staged diff found no credential, hostname or endpoint parts; `npm run lint` passes; the last production build ran after the last code change (the move of `params` inside `<Suspense>`) and compiled successfully; the original OpenRaiz repo unchanged (0 changed files, commit `0113d35`). No database record was changed by the agent.
- **Commit reference:** `a803e07040716925b8ba0e67fdd27fff35dffd9c` (short `a803e07`), 8 files changed (525 insertions, 26 deletions); pushed to `origin/main`; `git ls-remote origin main` returned the same hash, the remote tree lists the new edit page, `not-found.js`, `OpportunityForm.js` and `opportunityOptions.js`, and the working tree was clean afterwards. Recorded here during Step 5.3A.

---

## Milestone 5, Step 5.3A — DELETE /api/opportunities/[id] (handler only; no successful delete yet)

- **Date:** 2026-10-16 (UTC)
- **Objective:** Add `DELETE /api/opportunities/[id]` so an opportunity can be removed from the Neon development database, test it **without performing a successful delete**, and propose a plan for a separate, clearly fictional DELETE-test record that the user must approve before anything is created or deleted. No Delete buttons, no frontend changes, no search or filters, no schema change, and **no database record created, changed or deleted.**
- **Previous commit:** `a803e07` (`Add Edit Opportunity page and Edit links using PATCH with changed fields only`).

### Exact prompt
1. ```
   I approve Step 5.3A: Building the DELETE endpoint for OpenRaiz 2.0.
   Objective
   Implement DELETE /api/opportunities/[id] to allow opportunities to be removed from our Neon development database.
   Step 1 — Implementation
   Extend:
   app/api/opportunities/[id]/route.js
   Add a DELETE handler that:
   1. Accepts an opportunity ID from the URL.
   2. Checks that the opportunity exists.
   3. Returns HTTP 404 if the ID does not exist.
   4. Deletes the selected opportunity using Prisma.
   5. Returns HTTP 200 with a simple success response containing the deleted opportunity's ID.
   6. Returns a generic HTTP 500 for unexpected failures.
   Handle the possibility that a record disappears between checking its existence and attempting deletion.
   Keep the existing GET and PATCH handlers unchanged.
   Step 2 — Safety
   This endpoint is intended for local development only.
   We do not have authentication or authorization yet.
   Do not deploy unrestricted DELETE functionality publicly.
   Do not introduce a database schema change.
   Step 3 — Testing
   Perform read-only and non-destructive tests first:
   1. Confirm nonexistent IDs return HTTP 404.
   2. Confirm malformed IDs are handled safely.
   3. Confirm unexpected database failures return a generic HTTP 500.
   4. Confirm existing GET, POST, and PATCH functionality remains intact.
   5. Confirm all four existing development records remain unchanged.
   Important: Do not run a successful DELETE request yet.
   Once the implementation passes the non-destructive tests, propose a plan to create one new, clearly fictional opportunity specifically for DELETE testing.
   Show me the planned test record and explain how you will verify its creation and deletion.
   Wait for my explicit approval before creating or deleting that record.
   Do not delete or modify any of the existing four opportunities.
   Step 4 — Verification
   Run lint and build checks.
   Confirm the Prisma schema and migrations are unchanged.
   Confirm no credentials or connection strings are exposed.
   Confirm the original OpenRaiz repository remains unchanged.
   Step 5 — Documentation
   Update PROMPT_LOG.md with:
   - This exact prompt.
   - Files modified.
   - Commands executed.
   - Actual test results.
   - Any mistakes or corrections.
   - The previous commit reference a803e07.
   Step 6 — Git
   Propose a commit message and show me the modified files.
   Do not commit or push without my approval.
   Important boundaries
   Do not add Delete buttons to the frontend yet.
   Do not create or delete database records without separate approval.
   Do not add search or filters.
   Do not modify the existing OpenRaiz repository.
   Stop after completing Step 5.3A and present your results.
   ```
   (The user's message before this one was `Edit flow works, commit and push it`, carried out as commit `a803e07`; the agent then asked whether to plan DELETE, and this prompt is the user's answer.)

### Files created or modified
- **Modified:** `app/api/opportunities/[id]/route.js` (added the `DELETE` handler, 31 lines added and 3 comment lines rewritten at the top of the file to mention DELETE), `PROMPT_LOG.md` (this entry and the `a803e07` reference).
- **Proven unchanged:** the `GET` and `PATCH` handlers are byte-for-byte identical to before (their source text has the same SHA-256 fingerprint before and after: GET `b56123ce44950b7d`, PATCH `668b7ff7259b9409`). Also unchanged (verified with `git diff --quiet`): `app/api/opportunities/route.js` (list and POST), all of `lib/`, all of `components/`, `app/page.js`, `app/globals.css`, the admin pages, `prisma/` (schema and migration), `package.json`, `package-lock.json`. No frontend change, no Delete button, no new dependency.

### What the DELETE handler does
`DELETE /api/opportunities/[id]`: reads the id from the URL (`await params`, as this Next.js version requires); an id that cannot exist (anything other than letters, digits, hyphens and underscores, or longer than 100 characters; the same rule as GET and PATCH) gets a generic `404 {"error":"Opportunity not found."}` without touching the database; otherwise it looks the opportunity up with `prisma.opportunity.findUnique` (selecting only its id) and answers 404 if there is none; otherwise it calls `prisma.opportunity.delete({ where: { id } })`, where the `where` clause names only that one id, and returns `200 {"id": "<the deleted id>", "deleted": true}`. If Prisma reports `P2025` (the record vanished between the lookup and the delete, for example because someone else deleted it), the handler answers 404, because the record is gone either way. Any other error is logged on the server as its name and code only and answered with `500 {"error":"Could not delete the opportunity."}`. The handler's only database calls are `findUnique` and `delete`. The comment at the top of the file now says that PATCH and DELETE are for local development only because there is no authentication yet.

### Commands executed
- `npm run lint` (several times); `npm run build` (once, after stopping the dev server because both use the `.next` folder); `npm --prefix <project folder> run dev` (background dev server, restarted after the build)
- A script (inline Node) that fingerprinted the source text of the `GET` and `PATCH` handlers before and after the change
- Non-destructive test scripts using Node `fetch` and `pg`, with a **built-in safety rule: before sending any DELETE the script checks the target against the real ids in the database (exact match, after URL-decoding, and after trimming) and refuses to send it if it matches.** The rule refused the probe "real id plus a trailing space" on the first run (see Problems) and was exercised again on purpose in the second run.
- `DATABASE_URL="postgresql://nobody:notarealpassword@127.0.0.1:1/nodb" npx next start -p 3001` (a production build pointed at a **fake, unreachable** address, to test the 500 response; no real credential involved; the id used was a nonexistent one, so nothing could have been deleted even by mistake) and `npx next start -p 3002` (the production build against the real development database, with nonexistent ids only); `pkill` of the servers I started
- Read-only snapshots of the four records using PostgreSQL's hidden row columns `xmin` (the last transaction that wrote the row), `ctid` (the row's physical location) and a content hash, plus the write counters
- `npx prisma migrate status`, `npx prisma migrate diff --from-config-datasource --to-schema prisma/schema.prisma --exit-code`; `git status`, `git diff --quiet`, `git diff --stat`; in the original repo `git status --short`, `git rev-parse --short HEAD` and the file-timestamp fingerprint
- **No successful DELETE request was sent. No record was created, changed or deleted.** (Every DELETE sent was to an id that does not exist, or to an impossible id, or to the unreachable fake database.)

### Test results (only what actually ran)
**Non-destructive tests on the development server against the real development database: 36 checks, 0 failures.**
1. **Nonexistent ids return 404:** `DELETE` for a well-formed nonexistent id, plain text (`does-not-exist`), the old readable id style (`2026-community-health-fellow-001`, since `legacyId` is not the id), a real id changed to UPPER case, a real id with its last character changed, a single character and a 100-character id each returned HTTP 404 with exactly `{"error":"Opportunity not found."}`, which does not repeat the id.
2. **Malformed ids are handled safely:** a null byte, a null byte inside a real id, a real id followed by a semicolon, a real id followed by a SQL comment, SQL-looking text (`'; DROP TABLE "Opportunity"; --`), `x' OR '1'='1`, path traversal, a wildcard character, unicode, 101 characters and 5,000 characters each returned the same generic 404, with no database or SQL text in the response. A request with broken percent-encoding (`%ZZ%`) is answered by Next.js itself with HTTP 400 before the route runs (framework behavior, unchanged).
3. **Unexpected database failures return a generic 500:** with the fake unreachable database, `DELETE` (well-formed id) returned HTTP 500 with exactly `{"error":"Could not delete the opportunity."}`; none of eleven sensitive strings (the fake password, the fake user, `127.0.0.1`, `postgresql`, the fake database name, `ECONNREFUSED`, `P1001`, `prisma`, `SELECT`, the requested id, `DROP`) appeared in it; the server console logged only `DELETE /api/opportunities/[id] failed: PrismaClientKnownRequestError P1001`. An impossible id in the same situation still returned 404 without touching the database, and `GET` returned 500 as before.
4. **Existing GET, POST and PATCH are intact:** `GET /api/opportunities` returned 200 with 4 rows; `GET /api/opportunities/<id>` returned 200 with all 21 fields for each of the four records; `POST` with an **invalid** body returned 400 with 11 field errors (no valid POST was sent, because it would create a row); `PATCH` to the PATCH test record with four **invalid** bodies (an empty body, a protected field, a bad enum, a bad status) returned 400 and `PATCH` to a nonexistent id returned 404 (none of these can write). `OPTIONS` now reports `Allow: DELETE, GET, HEAD, OPTIONS, PATCH`; `POST` and `PUT` on `/[id]` still return 405. The `GET` and `PATCH` handlers are byte-identical to before (see above).
5. **The four existing records remain unchanged:** a snapshot taken before any test and one taken after everything (including the production-build runs) are identical for all four records on `xmin`, `ctid` and content hash, so no transaction wrote to any of them; the table still has exactly 4 rows; PostgreSQL's write counters are the same as at the start of the step (51 inserts, 25 updates, 2 deletes). (The PATCH test record is in the state the user's own Edit test left it: a remote internship; it was not changed in this step.)
- **Production build, real development database, nonexistent ids only:** `DELETE` for a nonexistent id, an UPPER-case copy of a real id, a null byte, SQL-looking text and a 5,000-character id all returned 404; `GET` one and `GET` list returned 200; `OPTIONS` listed DELETE; and again no record changed.
- **Lint and build:** `npm run lint` passes with no warnings; `npm run build` compiles successfully and lists `ƒ /api/opportunities/[id]` among the routes.
- **Schema and migrations:** `npx prisma migrate status` says "Database schema is up to date!"; the live-database-vs-schema comparison returned exit code 0 (no differences); `prisma/migrations/` has only the original migration; `_prisma_migrations` has 1 record.
- **Credentials:** all output was filtered; no connection string, password or hostname appears in any test output or in this log (scanned).
- **Original OpenRaiz repo:** 0 changed files, commit `0113d35`, file-timestamp fingerprint matches the Step 1 baseline.
- **Not tested, because it needs a record to be deleted:** a successful delete (HTTP 200 with the deleted id), the record really disappearing, a second DELETE of the same id returning 404, and the real "record vanished between the lookup and the delete" path (the `P2025` branch). These are covered by the proposed plan below, which needs the user's approval.

### Proposed plan for the DELETE test (awaiting the user's explicit approval; nothing in it has been done)
**Planned test record** (created through the existing `POST /api/opportunities`, with fictional data only):
```
title:                    "DELETE Test Opportunity (Fictional - safe to delete)"
organization:             "Fictional DELETE Testing Org"
description:              "Fictional record created only to test the DELETE endpoint. It will be deleted right after. Not a real opportunity."
type:                     "volunteer"
livedExperienceRelevance: "relevant"
status:                   "active"
locationType:             "remote"   (so no city, state or address)
isPaid:                   false
compensation:             "Unpaid"
datePosted:               "2026-10-16"
(no deadline: a rolling opportunity)
applyMethodType:          "email"
applyMethodValue:         "delete-test@example.org"
```
**Exactly what would change in the database:** one insert (the POST) and one delete (the DELETE), both of this one new record, and nothing else; no direct SQL; the four existing records are never sent any request that can change them. Net effect: the table goes 4 rows, 5 rows, 4 rows again; the write counters would go from 51/25/2 to 52/25/3 (they can lag a few seconds).
**How its creation would be verified:** the POST returns HTTP 201 with a new id; `GET /api/opportunities/<new id>` returns 200 and the same JSON; a direct read of the database shows 5 rows and the new row's stored values match what was submitted; `GET /api/opportunities` returns 5 rows; and the four existing records are unchanged (same `xmin`, `ctid` and content hash as the baseline taken just before).
**How its deletion would be verified:** before the DELETE, a script reads the new row and refuses to continue unless its id is the one the POST returned **and** its title and organization are exactly the planned ones **and** its `legacyId` is empty; then exactly one `DELETE /api/opportunities/<that id>` is sent, expecting HTTP 200 and `{"id":"<that id>","deleted":true}`; afterwards `GET /api/opportunities/<that id>` must return 404, the table must be back to exactly 4 rows with none of the new record's data left, `GET /api/opportunities` must return 4 rows, the homepage must show 4 cards, the four original records must still be identical to the baseline (`xmin`, `ctid`, content hash), and a **second** DELETE of the same (now nonexistent) id must return 404, which is harmless because that row no longer exists.
**If anything unexpected happens:** the agent stops and reports, and does nothing further without the user's approval; in particular, if the POST does not return 201, or the DELETE does not return 200, or any of the four original records differs from the baseline, it will not retry or clean up with direct SQL. If the test record were left behind, the agent would ask before removing it.

### Problems found, errors and corrections
- **My own safety rule refused a probe on its first run.** I had included "a real id followed by a trailing space" as a malformed-id probe for DELETE; the script's rule (which trims before comparing) refused to send it, and the script stopped with an error, correctly. Nothing was sent for that probe; the 9 DELETE requests sent before it were all clean 404s with no writes. In practice that probe would have been a harmless 404 (spaces fail the route's id check), but I judged the stricter rule right, removed that one probe and re-ran the whole set from the start (the final result of 36 checks is from that second run). The "trailing space" case was also checked on purpose in the second run only to confirm that the rule refuses it.
- No bug was found in the DELETE code by these tests.
- (Several automated notifications about servers I stopped on purpose were not from the user and required no action.)

### Known limits, stated plainly
- **No authentication.** `DELETE` (like PATCH and POST) is for local development only and must not be deployed publicly. A successful DELETE is permanent: there is no undo and no soft delete (an `archived` status exists, but this endpoint removes the row for good).
- **No confirmation at the API level.** Any request that names a real id deletes it. A confirmation step belongs in the future Delete button (a later step), not in this endpoint.
- The "vanished between lookup and delete" branch is written but has not been exercised.

### Lessons learned
- Build the safety into the test itself (a rule that refuses to send a destructive request to a real id) instead of relying on being careful.
- A destructive endpoint can be tested thoroughly without a successful delete: missing ids, malformed ids, an unreachable database, and proof (`xmin`, `ctid`, content hash) that nothing changed.

### Security notes
The endpoint's only database calls are a lookup by id and a delete by that same id; responses never repeat the requested id on a 404, and errors are generic sentences. No credentials or connection strings appear anywhere in the code, output or this log.

### Follow-up prompt (approval to commit, and to run the controlled DELETE test)
2. ```
   I approve committing Step 5.3A and running your proposed controlled DELETE test.
   Part 1 — Commit the endpoint
   Approved files:
   - app/api/opportunities/[id]/route.js
   - PROMPT_LOG.md
   Approved commit message:
   Add DELETE /api/opportunities/[id] endpoint
   Before committing, verify that only these two files are staged, the staged diff contains no credentials or unexpected changes, and the original OpenRaiz repository remains unchanged.
   If those checks pass, commit and push to origin/main.
   Part 2 — Controlled DELETE test
   I explicitly approve creating and deleting one fictional opportunity with the following exact identity:
   - Title: DELETE Test Opportunity (Fictional - safe to delete)
   - Organization: Fictional DELETE Testing Org
   - Purpose: Testing the DELETE endpoint only.
   Use the remaining fields and values from your proposed test plan.
   Testing requirements
   1. Confirm the database initially contains exactly four opportunities.
   2. Record fingerprints of those four opportunities.
   3. Create exactly one new fictional opportunity using POST.
   4. Confirm POST returns HTTP 201.
   5. Confirm GET retrieves the newly created record.
   6. Confirm the database contains five opportunities.
   7. Verify the test record's ID, title, organization, and other identifying values before deleting it.
   8. Send exactly one successful DELETE request targeting that test record.
   9. Confirm DELETE returns HTTP 200 with the expected ID.
   10. Confirm GET for that ID returns HTTP 404.
   11. Confirm a second DELETE request for that same ID returns HTTP 404.
   12. Confirm the database contains exactly four opportunities afterward.
   13. Confirm the four existing opportunities remain unchanged.
   14. Confirm the homepage still displays those four opportunities.
   Safety boundaries
   - Do not delete or modify any of the original four records.
   - Do not use direct SQL to create or delete the test record.
   - Do not perform additional successful DELETE requests.
   - Do not retry unexpected failures automatically.
   - If the test record remains after a failure, stop and ask me before attempting cleanup.
   - Use only the Neon development branch.
   Documentation
   Update PROMPT_LOG.md with the actual test results, including any errors or corrections.
   Record the Step 5.3A commit hash.
   Git
   After testing, propose a documentation-only commit for the results.
   Do not commit or push that second documentation update without my approval.
   Next step
   Once the DELETE test passes, prepare a brief plan for Step 5.4: Adding a Delete button with confirmation to the opportunity interface.
   Do not implement the Delete button yet.
   Stop after reporting the test results and the Step 5.4 plan.
   ```
   → The agent ran the Part 1 pre-commit checks below and committed and pushed; the Part 2 controlled DELETE test and its results follow in the next entry ("Step 5.3B").

### Git
- **Files committed:** `app/api/opportunities/[id]/route.js` and `PROMPT_LOG.md`.
- **Commit message (approved):** `Add DELETE /api/opportunities/[id] endpoint` (no Co-Authored-By trailer).
- **Pre-commit checks (agent):** exactly those two files staged; no `.env`, generated, build, package, binary or SQL files; a scan of the staged diff found no credential, hostname or endpoint parts, and the route diff contains only the new `DELETE` handler and the rewritten header comment (the `GET` and `PATCH` handlers are unchanged); `npm run lint` and `npm run build` had passed; the original OpenRaiz repo unchanged (0 changed files, commit `0113d35`).
- **Commit reference:** `9ab11b48dd5a7cfae2d78834e692c8a728348f42` (short `9ab11b4`), 2 files changed (`app/api/opportunities/[id]/route.js` and `PROMPT_LOG.md`; 226 insertions, 4 deletions); pushed to `origin/main`; `git ls-remote origin main` returned the same hash, the remote tree lists the route, and the working tree was clean afterwards. The staged route diff was reviewed first: it contained only the new `DELETE` handler and the rewritten header comment (3 lines removed, 31 added).

---

## Milestone 5, Step 5.3B — Controlled DELETE test (the user-approved creation and deletion of one fictional record)

- **Date:** 2026-10-16 (UTC)
- **Objective:** Prove that `DELETE /api/opportunities/[id]` works end to end by creating **one** clearly fictional opportunity and deleting it, with the user's explicit approval of that exact record, and prove that nothing else in the database changed. The prompt that approved it is the one quoted in full under "Follow-up prompt" in the Step 5.3A entry above (it also approved the Step 5.3A commit).
- **Previous commit:** `9ab11b4` (`Add DELETE /api/opportunities/[id] endpoint`), made at the start of this step as Part 1 of that prompt.

### What was approved, exactly
Creating and deleting one fictional opportunity with the identity: title `DELETE Test Opportunity (Fictional - safe to delete)`, organization `Fictional DELETE Testing Org`, purpose "Testing the DELETE endpoint only"; remaining values from the plan: volunteer, relevance "relevant", status active, remote (no city, state or address), unpaid with compensation "Unpaid", date posted 2026-10-16, no deadline, application by email to `delete-test@example.org`. The safety boundaries set by the user: do not delete or modify any of the original four records; no direct SQL to create or delete the test record; no additional successful DELETE requests; no automatic retries; if the test record remained after a failure, stop and ask before any cleanup; use only the Neon development branch.

### How it was run
One script (inline Node, run against the development server and the Neon **development** branch) with these rules built in: exactly one `POST`; a read-only identity check of the new record (exactly one row with that title and organization, the id returned by the POST, the generated-id shape, not one of the original four ids, every other value matching the plan, `legacyId` empty, source "owner-added"); a **guard** that refuses to send the DELETE unless all of that holds; exactly one successful `DELETE`; then one more `DELETE` for the same id, which was expected to return 404 and delete nothing; read-only checks between steps; no retries; and, if anything unexpected happened, it would stop, report whether any test record remained, and do nothing else. Only `SELECT` queries were used on the database directly; the record was created and deleted only through the API.

### Results (only what actually ran)
**RESULT: PASSED. 23 checks, 0 failures.** Numbered as in the prompt:
1. **Exactly four opportunities at the start:** yes, and they were the four original ids (`cmvabung80000uoitdge182wa`, `cmvadtgq70000kgitvumgz8ii`, `cmvae82zz0000pwit532gndbd`, `cmvafb1lx0000oait161gtpzf`). No record with the planned title or organization existed.
2. **Fingerprints recorded** (id prefix : `xmin` (the last transaction that wrote the row) : `ctid` (the row's physical location) : content hash): `cmvabung:9236:(0,32):20517ebd`, `cmvadtgq:10244:(0,47):f344d4ed`, `cmvae82z:11265:(0,49):7febb76d`, `cmvafb1l:13377:(0,54):ddec841a`. PostgreSQL's write counters (insert/update/delete) were 51/25/2.
3. **One new opportunity created with POST:** exactly one POST was sent.
4. **POST returned HTTP 201.** The new record's id was `cmvagywjy0000tkit7f4u8cva`.
5. **GET retrieved it:** `GET /api/opportunities/cmvagywjy0000tkit7f4u8cva` returned HTTP 200 with JSON identical to the POST response.
6. **Five opportunities:** the table held exactly 5 rows, `GET /api/opportunities` returned 5 including the new one, and the four originals still matched their fingerprints.
7. **Identity verified before deleting:** exactly one row had the planned title and organization; its id matched the POST response, had the generated-id shape and was not an original; its title and organization were exactly the approved ones; every other value matched the plan; `legacyId` was empty and `source` was "owner-added".
8. **Exactly one successful DELETE** was sent, after the guard passed, aimed at that one id.
9. **DELETE returned HTTP 200** with exactly `{"id":"cmvagywjy0000tkit7f4u8cva","deleted":true}`: the expected id and nothing else.
10. **GET for that id returned HTTP 404** (`{"error":"Opportunity not found."}`).
11. **A second DELETE for the same id returned HTTP 404** (`{"error":"Opportunity not found."}`); there was nothing left to delete, so it was not a second successful delete.
12. **Exactly four opportunities afterwards:** the table held 4 rows, and no trace of the test record remained (searched by id, by title and by organization); `GET /api/opportunities` returned only the four originals.
13. **The four existing opportunities remained unchanged:** after the test their fingerprints were identical to the baseline on all four (`xmin`, `ctid` and content hash), meaning no transaction wrote to any of them.
14. **The homepage still displays those four opportunities:** it showed 4 cards (Youth Policy Fellow, Community Outreach Volunteer, Social Media Fellow, PATCH Test Opportunity) and no "DELETE Test" card.
- **Request accounting:** 1 POST, 1 successful DELETE, 2 DELETE requests in total (the second returned 404). No direct SQL write was made. No request touched any of the original four records.
- **Write counters:** 51/25/2 before, and 52/25/3 after (read after a short wait, since these statistics can lag): exactly one insert and one delete, no updates. This matches the plan's prediction.
- **Final state of the database:** the same four rows as before, byte-identical; the test record is gone; the table is back to 4 rows.

### What this test did not cover
- The "the record disappeared between the lookup and the delete" branch (`P2025`) of the handler: it needs two requests at the same moment, and the test did not try to provoke it.
- Deleting a record through the user interface: there is no Delete button yet (see the Step 5.4 plan below).
- The user's own browser has not been used for anything in this step, so nothing here is user-verified.

### Problems found, errors and corrections
None in this test: every check passed on the first and only run, nothing needed a retry, and no cleanup was needed.

### Lessons learned
- A destructive test is safest when the approval names the exact record, the script verifies that identity again just before the delete, and the script refuses to proceed if anything differs.
- `xmin`, `ctid` and a content hash show that a record was never written, which is stronger evidence than a row count.
- Checking that a second DELETE returns 404 shows the endpoint is safe to repeat.

### Proposed plan for Step 5.4 (a brief plan only; nothing implemented, awaiting the user's approval)
- **Delete button with confirmation** on each opportunity card, next to Edit, shown only when `showAdminActions` is on (local demo only; there is no sign-in).
- **New Client Component** `components/DeleteOpportunityButton.js`: a two-step, in-place confirmation (no pop-up library, no new dependency): first click turns the button into "Delete "<title>"? This can't be undone." with "Yes, delete" and "Cancel"; focus moves to Cancel; Escape cancels; the buttons are disabled while deleting. On HTTP 200 (or 404, meaning it is already gone) the page reloads so the list is fresh; any other result shows a plain message and keeps the record on screen.
- **Files:** the new component, `components/OpportunityCard.js` (renders it when `showAdminActions` is on, next to Edit, with an accessible name that includes the title), `app/globals.css` (a destructive-button style), and this log. The API, validators and schema are untouched.
- **Testing without deleting anything of the user's:** the pages and buttons are checked read-only (buttons present with the right names, hydrated page free of console errors, helper logic tested). The click-through would be done by the user in their browser on a throwaway record that the user creates with the Add form (or that the agent creates with the user's explicit approval), never on the original four.

### Security notes
`DELETE` is permanent and unauthenticated: local development only. The test used only the development branch and only requests through the API; no credentials appear anywhere in this log (scanned).

### Git
- **Files that would be committed (a documentation-only commit):** `PROMPT_LOG.md`.
- **Proposed commit message:** `Record DELETE endpoint commit and controlled delete test results in prompt log`
- **Commit message (approved by the user in Part 1 of their next prompt, quoted in full in the Step 5.4 entry):** `Record DELETE endpoint commit and controlled delete test results in prompt log` (no Co-Authored-By trailer). Documentation only.
- **Pre-commit checks (agent):** only `PROMPT_LOG.md` staged; the staged changes were reviewed; no `.env`, connection string, credential or other sensitive information (scanned); the original OpenRaiz repo unchanged (0 changed files, commit `0113d35`).
- **Commit reference:** `4717b8f7cbf5e799b05ddc25b3ba11f9f3400c85` (short `4717b8f`), 1 file changed (`PROMPT_LOG.md`; 64 insertions, 1 deletion); pushed to `origin/main`; `git ls-remote origin main` returned the same hash and the working tree was clean afterwards. Recorded here during Step 5.4.

---

## Milestone 5, Step 5.4 — Delete button with confirmation (built and checked by the agent; user browser test confirmed; commit awaiting the user's approval)

- **Date:** 2026-10-16 (UTC)
- **Objective:** Add a Delete button with an inline two-step confirmation to the opportunity cards, and a brief "Deleted …" message after the page reloads, using the existing `DELETE /api/opportunities/[id]` endpoint. Build it, verify everything that can be verified **without** creating, changing or deleting any database record, then stop so the **user** can test it in their own browser. The user has since run that browser test and confirmed it (see "User-verified tests"). **Nothing has been committed yet.**
- **Previous documentation commit:** `4717b8f` (`Record DELETE endpoint commit and controlled delete test results in prompt log`), made at the start of this step as Part 1 of the prompt.

### Exact prompt
1. ```
   Here's the updated Prompt 5.4, incorporating your decision to personally test the Delete functionality, just as you did with Edit.
   The prompt explicitly instructs Claude to build and verify the interface without deleting any records, then stop so you can test it yourself before approving the final commit.
   PROMPT 5.4 — Build Delete Button With Confirmation (User-Led Testing)
   Copy and paste everything below into Claude Code:
   I approve Milestone 5, Step 5.4: Adding the Delete button and confirmation interface to OpenRaiz 2.0.
   Part 1 — Documentation Commit
   First, I approve the previously proposed documentation-only commit:
   Commit message:
   Record DELETE endpoint commit and controlled delete test results in prompt log
   Before committing:
   1. Confirm that only PROMPT_LOG.md is staged.
   2. Review the staged changes.
   3. Verify that no database credentials, connection strings, environment files, or other sensitive information are included.
   4. Confirm the original OpenRaiz repository remains unchanged.
   If all checks pass, commit and push the documentation update to origin/main.
   Part 2 — Approved Design Decisions
   For the Delete interface, follow these decisions:
   1. Use an inline, two-step confirmation rather than window.confirm().
   2. Use a muted red outline for the Delete button to visually distinguish this destructive action.
   3. Show Delete only on opportunity cards when showAdminActions is enabled.
   4. Perform a real DELETE operation, not an archive.
   5. After successful deletion, reload the homepage and display a brief success message identifying the deleted opportunity.
   6. Preserve the original OpenRaiz branding and follow the approved mockup where appropriate.
   Important: This is for local development only. No authentication or authorization exists yet, so the Delete interface and unrestricted write API must not be deployed publicly.
   Part 3 — Build the Delete Component
   Create:
   components/DeleteOpportunityButton.js
   This should be a reusable React Client Component.
   Initial state:
   - Display a small Delete button.
   - Include the opportunity title in its accessible name.
   - Do not send any API request when the button is initially clicked.
   Confirmation state:
   When Delete is clicked:
   - Display a warning identifying the opportunity.
   - Explain that deletion cannot be undone.
   - Display two buttons: Yes, delete and Cancel.
   - Move keyboard focus to Cancel when the confirmation opens.
   - Allow pressing Escape to cancel.
   - Do not send a DELETE request until Yes, delete is clicked.
   During deletion:
   - Disable confirmation controls while the request is processing.
   - Prevent duplicate DELETE requests.
   - Send the request to the existing endpoint:
   DELETE /api/opportunities/[id]
   After the request:
   - HTTP 200: Reload the homepage and display a brief success message identifying the deleted opportunity.
   - HTTP 404: Explain that the opportunity no longer exists and refresh the list.
   - Unexpected failure: Display a generic error without exposing internal details.
   Treat opportunity titles as plain text, never executable HTML.
   Keep the interface accessible and responsive.
   Part 4 — Update Opportunity Cards
   Modify:
   components/OpportunityCard.js
   Add the Delete control beside the existing Edit link.
   Requirements:
   1. Both Edit and Delete should appear only when showAdminActions is enabled.
   2. The Delete button's accessible name must include the opportunity title.
   3. Preserve the existing card layout and information.
   4. Do not modify existing opportunity data or the way cards retrieve information.
   Part 5 — Styling
   Modify:
   app/globals.css
   Use:
   - The existing OpenRaiz color palette and typography.
   - A muted red for destructive actions.
   - A clear visual distinction between Edit, Delete, Confirm, and Cancel.
   - Responsive layouts for desktop and mobile.
   Do not add new styling libraries or dependencies.
   Part 6 — Developer Verification (Non-Destructive Only)
   Before asking me to test, perform all possible non-destructive verification.
   Check:
   1. Delete buttons render on the four existing opportunity cards.
   2. Each button's accessible name includes the correct opportunity title.
   3. The component contains the correct confirmation and cancellation logic.
   4. No DELETE request is sent before confirmation.
   5. Cancel does not trigger a DELETE request.
   6. Escape cancels the confirmation.
   7. The DELETE request targets the specific opportunity ID.
   8. Success, 404, and error handling are implemented.
   9. The existing Create, Read, and Edit interfaces remain functional.
   10. Lint and build checks pass.
   11. No Prisma schema changes or migrations occurred.
   12. The original OpenRaiz repository remains unchanged.
   13. All four existing development opportunities remain unchanged.
   You may use available non-destructive testing capabilities.
   Do not build a custom browser-testing framework or install new dependencies without my approval.
   If you cannot verify a particular interaction, clearly identify it as unverified.
   Do not claim that an interaction passed simply because its code appears correct.
   Part 7 — User-Led DELETE Verification
   I will personally test Delete through my browser, just as I tested Edit.
   After implementing the interface and completing your non-destructive checks, stop and ask me to conduct the browser test.
   Do not create, modify, or delete any database records during your implementation or automated testing.
   I will perform the following tests myself:
   1. Open http://localhost:3000.
   2. Confirm the existing four opportunities appear.
   3. Click Add Opportunity.
   4. Create a clearly fictional opportunity titled:
      DELETE TEST — Safe to Remove
   5. Confirm the new opportunity appears on the homepage.
   6. Click Delete on that specific test opportunity.
   7. Confirm that the warning and confirmation buttons appear.
   8. Click Cancel and verify that the opportunity remains.
   9. Click Delete again.
   10. Click Yes, delete.
   11. Confirm that the success message appears.
   12. Confirm the fictional opportunity disappears from the homepage.
   13. Refresh the page and confirm the deletion persists.
   14. Confirm the original four opportunities remain visible.
   Important safety rules:
   - I will only delete the new fictional test opportunity.
   - Do not delete or modify any of the four existing opportunities.
   - Do not run successful DELETE requests on my behalf.
   - Do not perform direct SQL changes.
   - Do not create additional test records.
   - Do not automatically clean up records.
   - Do not record any browser test as user-verified until I explicitly confirm its result.
   If I encounter an issue during testing, help me troubleshoot it before proceeding to the commit.
   Part 8 — Documentation
   Update:
   PROMPT_LOG.md
   Include:
   - The exact prompt.
   - Files created or modified.
   - Commands executed.
   - Implementation details.
   - Non-destructive tests and their actual results.
   - Any mistakes or corrections.
   - The previous documentation commit reference.
   - A clear distinction between Claude-verified tests and user-verified tests.
   After I personally test the Delete interface, record only the results I explicitly confirm.
   Part 9 — Git
   After implementation and verification:
   1. Show me all modified files.
   2. Review the proposed changes.
   3. Propose a descriptive commit message.
   4. Wait for my approval before committing or pushing.
   Do not commit or push the Delete interface changes until I have completed my browser testing and explicitly approved the commit.
   Part 10 — Important Boundaries
   Do not:
   - Modify the existing DELETE API endpoint.
   - Modify the POST, GET, or PATCH endpoints.
   - Modify Prisma schemas or migrations.
   - Change validation rules.
   - Add search or filtering.
   - Introduce authentication.
   - Import the original ten opportunities.
   - Modify the original OpenRaiz repository.
   - Create, update, or delete database records during your testing.
   - Commit or push the Delete interface without my approval.
   Final Instruction
   Stop after implementing Step 5.4 and completing all non-destructive verification.
   Give me:
   1. A summary of what you built.
   2. The files changed.
   3. The tests that passed.
   4. Any tests you could not complete.
   5. A short browser-testing checklist for me.
   Wait for my personal browser verification before proceeding.
   ```
   (The user's previous message approved committing the Step 5.3A endpoint and running the controlled DELETE test (Step 5.3B); the agent then asked five design questions and proposed a plan, and this prompt is the user's answer.)

### Part 1 — the documentation commit
Only `PROMPT_LOG.md` was staged; the staged change (64 insertions, 1 deletion; the single removed line was the stale "PENDING" in the Step 5.3A entry it replaces) was reviewed; a scan found no credential, connection string, hostname or `.env` content; the original OpenRaiz repo was unchanged (0 changed files, `0113d35`). **Commit** `4717b8f7cbf5e799b05ddc25b3ba11f9f3400c85` (short `4717b8f`), `Record DELETE endpoint commit and controlled delete test results in prompt log`, pushed to `origin/main` (`git ls-remote` returned the same hash).

### Files created or modified
- **Created:** `components/DeleteOpportunityButton.js` (the Delete button and its confirmation), `components/DeletedNotice.js` (the note shown after the reload), `lib/deleteFlow.js` (the logic behind both, as plain JavaScript).
- **Modified:** `components/OpportunityCard.js` (the Delete button beside Edit, both inside one `card-actions` wrapper, only when `showAdminActions` is on), `app/page.js` (two lines: the import and one `<DeletedNotice />` placed under the intro), `app/globals.css` (108 lines added: a muted-red palette entry, the Delete, confirm and note styles, and the card footer layout), `PROMPT_LOG.md`.
- **Unchanged (proven):** every file the prompt says not to touch is byte-identical to its state at the start of the step (compared by Git object hash): `app/api/opportunities/[id]/route.js` (GET, PATCH and DELETE), `app/api/opportunities/route.js` (list and POST), `lib/validateOpportunity.js`, `lib/validateOpportunityUpdate.js`, `components/OpportunityForm.js`, `lib/opportunityOptions.js` and the edit page; also unchanged: `prisma/` (schema and migration), `package.json`, `package-lock.json`, `lib/serializeOpportunity.js`, `lib/prisma.js`. No new dependency.
- **Beyond the files the prompt named (deliberate additions):** `lib/deleteFlow.js` and `components/DeletedNotice.js` are new files, and `app/page.js` was modified. They are needed because (a) the "Deleted …" message must survive a page reload and be shown on the homepage, which a button on a card that is about to disappear cannot do, and (b) putting the confirmation steps into a small pure module is what allows them to be tested exhaustively in Node without a browser.

### Implementation details
- **Confirmation flow (state machine in `lib/deleteFlow.js`, used with `useReducer`):** `idle → (Delete clicked) → confirming → (Yes, delete) → deleting`; from `confirming`, Cancel or Escape goes back to `idle`; a failed request goes from `deleting` back to `confirming` with a generic error; Cancel and Escape are ignored while a request is running. The only way to reach `deleting` is "Yes, delete" from `confirming`.
- **`components/DeleteOpportunityButton.js`:** `"use client"`. Idle: a small button "Delete" with the muted-red outline and the accessible name `Delete <title>`; clicking it only opens the confirmation. Confirming: an inline panel (a labelled group) saying `Delete “<title>”? This permanently removes the opportunity and cannot be undone.` with two buttons, "Yes, delete" (solid muted red) and "Cancel" (neutral). Keyboard focus moves to Cancel when it opens, Escape (listened for only while it is open) cancels it, and after cancelling focus returns to the Delete button. Deleting: both buttons are disabled, "Yes, delete" shows "Deleting…", and a reference set immediately on click prevents a second request. The request is the only `fetch` in the file, inside one function used only by "Yes, delete": `DELETE /api/opportunities/<encoded id>`. Answer handling: **200** or **404** → the outcome is saved for the next page load and the page is reloaded (`window.location.reload()`); **any other answer, or a network failure** → "Something went wrong, and the opportunity was not deleted. Please try again.", the panel stays open and the buttons are usable again. Titles are only ever shown as React text (never as HTML).
- **`components/DeletedNotice.js` and the store in `lib/deleteFlow.js`:** just before reloading, the button saves `{ kind, title }` to `sessionStorage` (this tab only). `DeletedNotice` (on the homepage) reads it once through `useSyncExternalStore`, removes it from storage so a later refresh does not show it again, and shows either `Deleted “<title>”.` (200) or `“<title>” no longer exists, so there was nothing to delete. The list has been refreshed.` (404). It is announced politely (`role="status"`), has a Dismiss button, and goes away by itself after 8 seconds. Damaged or blocked storage, an unknown kind, a non-text title all give "no note"; titles are cut to 300 characters.
- **Styling:** a new muted red `#A63A32` (6.4:1 contrast on white; the approved mockup's Delete button is red, which is not in the original palette, so this is a deliberate, single exception for destructive actions) for the Delete outline, the "Yes, delete" button and the error text; Edit and Cancel stay in the neutral outline style; the confirmation panel is a pale red box with a red left edge that takes a full row under the pills; the "Deleted" note is the existing pale green (neutral for the "already gone" case). The card footer now puts the pills on the left and Edit and Delete together on the right, and wraps on narrow screens.
- **Lint-driven correction:** the first version reloaded with `window.location.assign("/")`; `npm run lint` warned that Next.js discourages navigating to an internal path that way. Since the cards (and so the button) are on the homepage and the prompt says "reload the homepage", it now uses `window.location.reload()`.

### Commands executed
- `npm run lint` (several times); `npm run build` (once, after stopping the dev server because both use the `.next` folder; the dev server was restarted afterwards); `npm --prefix <project folder> run dev`; `npx next start -p 3002` (a production build against the real development database, read-only checks only); `pkill` of servers I started
- Read-only `curl` and Node `fetch` requests (`GET` only, plus one **invalid** `POST` that returns 400 and cannot write)
- Read-only Node scripts using `pg`: a baseline and a final snapshot of the four records with PostgreSQL's hidden row columns `xmin` (the last transaction that wrote the row) and `ctid` (the row's physical location) plus a content hash, row counts, and write counters
- Headless Chrome (`--headless=new`, throwaway profiles in the git-ignored `.next/preview/` folder, not the user's profile): `--dump-dom` with console logging, and `--screenshot`
- The TypeScript compiler already installed in the project, used with `react-dom/server` to render the real components to static HTML in each state (in the git-ignored `.next/preview/rt/`; nothing was installed)
- `git hash-object` (to prove the protected files are unchanged), `git status`, `git diff`, `npx prisma migrate status`, `npx prisma migrate diff --from-config-datasource --to-schema prisma/schema.prisma --exit-code`; in the original repo `git status --short`, `git rev-parse --short HEAD` and the file-timestamp fingerprint
- **No DELETE request of any kind was sent in this step. No record was created, changed or deleted. No direct SQL was run.**

### Verification by the agent (**Claude-verified**; only what actually ran)
Numbered as in Part 6 of the prompt:
1. **Delete buttons render on the four existing cards: verified.** In the server HTML, in the hydrated page (headless Chrome, after the page's JavaScript ran) and in a production build, all 4 cards show an Edit link and a Delete button, and none shows a confirmation panel or a "Deleted" note on a normal load.
2. **Each accessible name includes the correct title: verified.** Each button is named `Delete <that card's title>`, for example `Delete Youth Policy Fellow (Fictional Test Listing)`, matched card by card.
3. **The component contains the correct confirmation and cancellation logic: verified in two ways.** (a) **Behavior of the logic, observed:** 48 checks (0 failures) on the state machine, the status mapping and the notice store, run in Node. These include an exhaustive check of every state with every action, which shows the only transition into "deleting" is "confirming + confirm", and that "deleting" can only be left by a failure. (b) **Markup, observed:** the real components rendered to HTML in every state: the idle button; the confirmation (names the opportunity, says it cannot be undone, exactly two buttons, "Yes, delete" solid and "Cancel" neutral, a labelled group); the deleting state (both buttons disabled, "Deleting…", busy marker); the failure state (a generic error as an alert, no status code, database or stack text); and the "Deleted" and "already gone" notes (19 checks, 0 failures).
4. **No DELETE request is sent before confirmation: partly verified.** *Observed:* in the state machine, "Yes, delete" does nothing unless the confirmation is open, and the only route into "deleting" is that one. *Code inspection (the source was read; no browser was observed):* the component has exactly one `fetch`, inside one function used only as the "Yes, delete" handler; the Delete button's click only dispatches "ask". **The actual click behavior in a browser is unverified (see below).**
5. **Cancel does not trigger a DELETE request: partly verified.** *Observed:* Cancel returns the state machine to idle. *Code inspection:* the cancel function contains no `fetch`. **Unverified in a browser.**
6. **Escape cancels the confirmation: partly verified.** *Observed:* the "escape" action returns the state machine to idle, and does nothing while a request is running. *Code inspection:* a key listener that only exists while the confirmation is open dispatches that action. **Unverified in a browser.**
7. **The DELETE request targets the specific opportunity ID: partly verified.** *Code inspection:* the URL is built as `/api/opportunities/` plus the card's own id (URL-encoded) with method `DELETE`. The id passed to each button was shown to be that card's own (each card's Edit link and Delete name match its record). **A real request was deliberately not sent.**
8. **Success, 404 and error handling are implemented: partly verified.** *Observed:* 200 means "deleted", 404 means "gone", and every other status (400, 401, 403, 405, 409, 429, 500, 502, 503, 0, 201, 204, 301, undefined, null) means a generic failure; the notice store and notes behave as described above; the failure markup is generic. *Code inspection:* the three outcomes are handled as described. **Unverified end to end in a browser.**
9. **The existing Create, Read and Edit interfaces remain functional: verified (read-only).** The homepage shows the 4 cards with their content; each of the 4 edit pages is still prefilled from the database on every field with a "Save Changes" button; the Add Opportunity page still loads as an empty form with "Save Opportunity"; `GET /api/opportunities` returns 200 with 4 rows; an invalid POST still returns 400. The code behind Create, Edit and the API is byte-identical to before. **No valid POST or any PATCH was sent (that would write), so saving was not re-tested here.**
10. **Lint and build checks pass:** `npm run lint` reports nothing; `npm run build` compiles successfully. Production-build checks (read-only): 4 cards each with a correctly named Delete button, no confirmation or note on a normal load, the new styles present in the stylesheet, the edit page and Add page return 200, `GET /api/opportunities` returns 200 with 4 rows.
11. **No Prisma schema changes or migrations:** `npx prisma migrate status` says "Database schema is up to date!"; the live-database-vs-schema comparison returned exit code 0 (no differences); `prisma/migrations/` has only the original migration; `_prisma_migrations` has 1 record; `prisma/` is unchanged.
12. **The original OpenRaiz repository is unchanged:** 0 changed files, commit `0113d35`, file-timestamp fingerprint matches the Step 1 baseline.
13. **All four existing development opportunities are unchanged:** a snapshot before any check and one after everything (including the production-build runs) are identical on all four records for `xmin`, `ctid` and content hash (`cmvabung:9236:(0,32):20517ebd`, `cmvadtgq:10244:(0,47):f344d4ed`, `cmvae82z:11265:(0,49):7febb76d`, `cmvafb1l:13377:(0,54):ddec841a`), meaning no transaction wrote to any of them; the table still has 4 rows; PostgreSQL's write counters are the same as at the start (52/25/3).
- **Additional checks:** browser console messages from the hydrated homepage were only the dev server's "[HMR] connected" and React's "Download the React DevTools" notice (no hydration error, no warning); a title that contains HTML (`<img src=x onerror=alert(1)> & "quotes" <script>alert(2)</script>`) is escaped everywhere it is shown (the button's accessible name, the warning, both notes), and no new file contains `dangerouslySetInnerHTML`, `innerHTML` or `eval`.
- **Visual review by the agent (not by the user), from headless Chrome screenshots:** the real homepage shows each card with a neutral Edit button and a muted-red-outline Delete button side by side at the bottom right, the rest of the card unchanged; a static preview page built from the real stylesheet and the real components' markup shows the confirmation panel, the "Deleting…" state, the generic error state and both notes, with a clear visual distinction between Edit (neutral outline), Delete (red outline), "Yes, delete" (solid red) and Cancel (neutral); in a 390 px frame the footer wraps (pills, then Edit and Delete) and the panel takes the full width with no overflow. This preview is a **static rendering, not an interactive test**.

### Could NOT be verified by the agent (marked **unverified**; there is no browser-driving tool in this session, I did not build one, and no writes were allowed)
- Clicking Delete and the confirmation actually appearing in a browser; keyboard focus actually moving to Cancel; Escape actually closing it and focus returning to the Delete button; Cancel actually leaving the record on screen without any request; "Yes, delete" actually sending the DELETE request; the buttons actually disabling while the request runs and a double click sending only one request; the page actually reloading after a 200 or a 404; the "Deleted …" note actually appearing after the reload, disappearing on its own or on Dismiss, and not coming back after a refresh; the error message appearing after a real failure; behavior in a private window with blocked storage; and keyboard-only and screen-reader use. Each of these rests on code that was read and on logic and markup that were tested, but was **not observed running**.

### User-verified tests
After the agent's report, the user ran the browser test themselves (the checklist below, based on their own 14-step test plan, using only a new fictional opportunity) and wrote: **`Test checklist checked out.`** This is recorded as **user-verified: the Delete interface passed the browser-testing checklist.** The user did not itemize the results, so this entry records only that overall confirmation: it does not claim which individual steps they saw, and the optional "narrow window" step is not recorded as done.

**What the agent could see afterwards (read-only, after the user's message; this corroborates but does not replace the user's own confirmation):** the development database holds 4 opportunities again; the original four are identical to their state at the start of Step 5.4 (same `xmin`, `ctid` and content hash for `cmvabung…`, `cmvadtgq…`, `cmvae82z…` and `cmvafb1l…`), so the user's test did not touch them; no record has "DELETE TEST" or "Safe to Remove" in its title; and PostgreSQL's write counters went from 52/25/3 to 53/25/4, exactly one insert and one delete, which is what creating and then deleting one test record produces (the counters can lag a few seconds). The agent did not create, change or delete anything: the test record was created and deleted by the user through the interface.

The interactions the agent could not observe (listed under "Could NOT be verified by the agent" above) are therefore covered by the user's confirmation of the whole checklist, not by anything the agent saw.

### Browser-testing checklist given to the user
At http://localhost:3000, using **only** a new fictional test opportunity (never the original four): (1) the four existing opportunities appear, each with Edit and Delete; (2) Add Opportunity: create `DELETE TEST — Safe to Remove` (any fictional values) and confirm it appears; (3) click Delete on that card: a red-edged panel appears with the title, "cannot be undone", "Yes, delete" and "Cancel", and the focus ring is on Cancel; (4) press Escape (the panel closes and the card remains); (5) click Delete again and click Cancel (the panel closes and the card remains); (6) click Delete again, then Yes, delete: the page reloads, a green note says `Deleted “DELETE TEST — Safe to Remove”.`, and the card is gone; (7) refresh: the note does not come back, and the deletion persists; (8) the original four are still there. Optionally: make the window narrow to see the layout on a phone. Every successful Delete is permanent.

### Problems found, errors and corrections
- **A lint warning, corrected:** `window.location.assign("/")` was flagged by Next.js's lint rule; replaced with `window.location.reload()` (see Implementation details).
- **A leftover in my first version of the button file:** an unused import and a stray re-export of a constant; removed before the first lint run.
- **A build wipes the screenshots:** each production build deletes the `.next` folder, including my saved screenshots, so they were taken before the build.
- **No bug was found in the Delete code by the checks that could be run.** The state-machine tests, the markup tests and the structure assertions all passed on the first run.
- (Several automated notifications about servers I stopped on purpose were not from the user and required no action.)

### Known limits, stated plainly
- **No authentication.** The Delete button, `DELETE /api/opportunities/[id]` and the other write endpoints are for local development only and must not be deployed publicly. `showAdminActions` is on for the homepage; it must be removed or restricted to signed-in administrators first.
- **Deletion is permanent.** It is a real delete (not an archive), as the user decided; there is no undo.
- **The "Deleted" note is kept in `sessionStorage`**, so it is lost if the browser blocks storage (the deletion still works); it belongs to one tab.
- **The reload is a full page reload**, so any other unsaved state on the homepage is lost.
- **A destructive button is next to Edit:** the two-step confirmation (with focus on Cancel and Escape to back out) is the only protection against an accidental click.

### Lessons learned
- When no browser can be driven, move the logic into plain functions and test every state and action exhaustively; and keep the tests of what was only read (code inspection) clearly separate from what was observed.
- A static rendering of the real components with the real stylesheet is a good way to review states that cannot be reached without clicking, as long as it is called a preview and not a test.
- Show only what you can stand behind: "the code looks right" is not "it works".

### Security notes
The titles shown in the confirmation, the button names and the notes are escaped by React (tested with a hostile title). The component sends only one kind of request (`DELETE` to an id taken from the card) and shows only generic error text. No credential, connection string or hostname appears in the code, the test output or this log (scanned).

### Follow-up prompt
2. ```
   Test checklist checked out.
   ```
   → The agent recorded the user's confirmation above and read the database (read-only) to see what the user's test left behind. The user's prompt for this step said not to commit the Delete interface until they had finished testing **and explicitly approved the commit**; this message confirms the test but does not approve the commit, so the agent asked for the approval and did not commit.

3. ```
   I explicitly approve committing and pushing the Step 5.4 Delete interface to origin/main.
   Approved commit message:
   Add Delete button with inline confirmation and success note
   Approved files:
   - components/DeleteOpportunityButton.js
   - components/DeletedNotice.js
   - lib/deleteFlow.js
   - components/OpportunityCard.js
   - app/page.js
   - app/globals.css
   - PROMPT_LOG.md
   Before committing:
   1. Verify that only these seven files are staged.
   2. Review the staged diff.
   3. Confirm no credentials, environment files, or generated files are included.
   4. Confirm lint and build checks pass.
   5. Confirm all four existing development opportunities remain unchanged.
   6. Confirm the original OpenRaiz repository remains unchanged.
   If all checks pass, commit and push to origin/main.
   Provide the commit hash and confirm the push succeeded.
   Documentation: Preserve my browser confirmation exactly as reported. Do not claim I individually verified interactions I didn't specifically describe.
   Next milestone: After committing, prepare a brief plan for Milestone 6:
   - Search opportunities by title or organization.
   - Filter opportunities by category.
   - Make final design refinements based on our approved mockup.
   Do not implement Milestone 6 yet.
   Stop after presenting the plan and wait for my approval.
   ```
   → The explicit commit approval the previous message was waiting for. The agent ran the pre-commit checks below and committed and pushed. The user's browser confirmation is preserved exactly as the user reported it (`Test checklist checked out.`, recorded under "User-verified tests"); the user did not describe individual interactions, so none is recorded as individually verified.

### Git
- **Files committed (seven, approved by the user):** `components/DeleteOpportunityButton.js`, `components/DeletedNotice.js`, `lib/deleteFlow.js`, `components/OpportunityCard.js`, `app/page.js`, `app/globals.css` and `PROMPT_LOG.md`.
- **Commit message (approved):** `Add Delete button with inline confirmation and success note` (no Co-Authored-By trailer).
- **Pre-commit checks (agent):** exactly those seven files staged; the staged diff reviewed; no `.env`, generated, build, package, binary or SQL files, and no credential, connection string or hostname in the staged diff (scanned); `npm run lint` and `npm run build` pass; the four existing development opportunities are unchanged (same `xmin`, `ctid` and content hash as at the start of Step 5.4); the original OpenRaiz repo unchanged (0 changed files, commit `0113d35`).
- **Commit reference:** PENDING — the hash is not known until the commit exists; to be recorded in a later log update.


---

# Week 7 — OpenRaiz 3.0 integration (new repo `hcarvente/openraiz-3`, branch `week7-integration`)

Plan: `~/.claude/plans/pasted-content-id-cefb-openraiz-week-delegated-sunbeam.md` (v2). Monster Interview is ported as a neutral "OpenRaiz Coach": no Halloween or Dracula theme.

## Step 0 — Baseline (no code change; read-only except one approved migration)

- **Date:** 2026-10-26
- **Setup done by the user:** new private GitHub repo `hcarvente/openraiz-3`; new Neon branch `week7-dev`; `.env` created locally (gitignored) with the pooled `DATABASE_URL` and direct `DIRECT_URL`.
- **Results (Claude-verified, only what actually ran):**
  - `npm ci` and `npm run lint` pass. `npm run build` fails on a fresh checkout until `prisma generate` has run (the generated client is gitignored); it passes after `prisma generate`.
  - `.env` shape checked without printing secrets: plain text, no quotes, ignored by Git, pooled and direct strings on the same endpoint, different from the old openraiz-2 database, region AWS us-east-2.
  - `prisma migrate status` showed `week7-dev` was empty; with the user's approval `prisma migrate deploy` applied `20261016011916_init`. The database now has `Opportunity` and `_prisma_migrations`; `Opportunity` has 0 rows.
  - Monster Interview `npm test`: 73 of 73 pass (fake client, no tokens used).
  - V1 data vs schema enums: type, location type, lived-experience relevance, apply method and source values all fit the enums; V1 status has only active and filled; 2 of 10 listings have no deadline (allowed).
- **Git:** `gh` installed with Homebrew and authenticated by the user; `main` and `week7-integration` pushed to the new repo (both at `c2e9d9b`). The first push failed on the old stored credential.

## Step 1 — Prepare branch and deploy-safe build (awaiting the user's commit approval)

- **Changes:** `package.json` and `package-lock.json` renamed to `openraiz-3`; `"postinstall": "prisma generate"` added; `prisma.config.ts` no longer throws when `DIRECT_URL` is unset (it falls back to an unusable placeholder host named `DIRECT_URL-is-not-set.invalid`), because `prisma generate` ran during install and failed without env vars; `.env.example` gained placeholders for `ADMIN_EMAILS`, `GEMINI_API_KEY` and `AI_ENABLED`.
- **Tests (Claude-verified):** a fresh folder with only the package files, config and `prisma/`, installed with `DIRECT_URL` and `DATABASE_URL` unset, ran `postinstall` and produced `generated/prisma`; before the config fix the same install failed with `Cannot resolve environment variable: DIRECT_URL`. `npm run lint` and `npm run build` pass in the project.
- **Known limit:** migrate commands without `DIRECT_URL` now fail with `P1001: Can't reach database server at DIRECT_URL-is-not-set.invalid` instead of the old explicit message.

## Step 2 — Interim admin lock; hide admin actions (awaiting the user's commit approval)

- **Date:** 2026-10-27
- **Scope change recorded:** the user needs **individuals and organizations posting by Thursday**, not after the gate as plan v2 assumed. Plan v2 is being revised; Step 2 is unaffected (it closes the open write endpoints either way).
- **Changes:** new `proxy.js` (Next 16 Proxy, Node runtime): HTTP Basic Auth on every `/admin/*` request and on every non-`GET`/`HEAD`/`OPTIONS` request to `/api/opportunities*`, credentials from `ADMIN_USER` and `ADMIN_PASSWORD` (timing-safe comparison); if either is unset, protected routes return 503, never open. The homepage no longer passes `showAdminActions` and the "Add Opportunity" button is removed (option A, chosen by the user); stale "local development only" comments updated; `.env.example` gained the two placeholders.
- **Tests (Claude-verified; real `next dev` servers and `curl`, throwaway credentials passed on the command line, no database writes):**
  - No credentials: POST, PATCH, DELETE and `/admin/*` pages return 401. A wrong password, a wrong user, a malformed header (`Basic !!!`), a `Bearer` header and empty credentials all return 401.
  - Public reads stay open: `GET /api/opportunities` 200, `GET /` 200, `GET /api/opportunities/x` 404 (unknown id).
  - Correct credentials: `POST {}` 400 (past the lock, rejected by validation), PATCH and DELETE on an unknown id 404 (nothing written), `/admin/opportunities/new` 200.
  - With `ADMIN_USER` and `ADMIN_PASSWORD` unset: POST (with and without guessed credentials) and `/admin/*` return 503; public GET stays 200.
  - `npm run lint` and `npm run build` pass.
- **Not verified:** that the Edit and Delete buttons are hidden **on a rendered card**. The `week7-dev` database has 0 rows, so the homepage rendered no cards and the check was vacuous; the code change (no `showAdminActions` prop) is what guarantees it, and it should be re-checked after Step 6 seeds listings. Also not observed in a browser: whether the Add and Edit forms' `fetch` calls reuse the login typed for `/admin`.
- **Known limits:** Basic Auth sends the password with every request (acceptable on localhost and HTTPS only); no rate limiting on login attempts; no Edit or Delete button is reachable until the admin dashboard exists (Step 12), so edit pages are reached by typing `/admin/opportunities/<id>/edit`.
- **Step 1 commit reference:** `3b176a8` (Prepare branch and deploy-safe build), pushed to `origin/week7-integration`.

## Step 3 — Neon Auth spike (awaiting the user's commit approval)

- **Date:** 2026-10-27
- **Decisions recorded before the spike:** the user speaks Spanish and will review all Spanish text; posting requires a verified email, in the cheapest form for Thursday (verification **codes** through Neon's shared email sender, plus a server-side `emailVerified` check, because Neon's docs do not say whether unverified users can sign in); there is no domain yet and the app launches on Vercel only, so contact with posters will be **in-app messages stored in the database**, not email; individuals post only one-off types (mentoring, workshop, event) and may offer paid or unpaid opportunities; everything posted waits for admin approval. Plan v3: `~/.claude/plans/openraiz-3-week7-plan-v3.md`.
- **User actions in the Neon console (`week7-dev`):** enabled Better Auth, turned on email sign-up and email verification (codes), and added `NEON_AUTH_BASE_URL` to `.env`. The agent generated `NEON_AUTH_COOKIE_SECRET` (random, 44 characters, not printed) and appended it to `.env` after the check showed it was missing.
- **Changes:** `@neondatabase/auth` installed at exactly `0.7.0-beta`; `lib/auth/server.js` (`createNeonAuth`); `app/api/auth/[...path]/route.js` (passes auth requests to Neon Auth); a throwaway `app/auth-spike/` page and server actions (sign up, verify with a code, sign in, sign out); `.env.example` placeholders for the two Neon Auth variables. The spike page is deleted in Step 4.
- **Tests (Claude-verified):** `npm run lint` and `npm run build` pass; `GET /api/auth/get-session` without a cookie returns `null` with 200 through our route (so the app reaches Neon Auth); the spike page renders `signedIn: false` inside `<Suspense>` under Cache Components, so the docs' `force-dynamic` setting is not needed; `/api/opportunities` writes still return 503 because `ADMIN_USER` and `ADMIN_PASSWORD` are not set locally.
- **User-verified:** the user signed up with their own email in the browser, received the verification code, verified it and signed in. **Agent corroboration (read-only, no email printed):** `neon_auth.user` holds 1 user with `emailVerified` true and role `user`.
- **Not verified:** whether an unverified user can sign in or is signed in right after sign-up (not tested; Step 4 checks `emailVerified` on the server regardless); reading the session inside `proxy.js` (Step 4 merges the Basic Auth lock into it); anything on Vercel (preview URL, trusted origins, cookies); sign-out and sign-in were done by the user and not itemized.
- **Known limits and risks:** the SDK is a **beta** (`0.7.0-beta`) and added about 5,000 lines to `package-lock.json`; Neon's shared email sender is rate-limited and for development, so a real launch needs a custom email provider and a domain; Neon Auth also provides `role`, `organization`, `member` and `invitation` tables, which are not used by this plan.
- **Commit references:** Step 2 is `dd3b958`.

## Step 4a — Profile table and role rules (awaiting the user's commit approval)

- **Date:** 2026-10-27
- **Plan approved by the user:** Step 4 in two commits (4a: table, role rules, tests; 4b: pages, header link, admin enforcement, removal of the Basic Auth lock and the spike page). Admin is never stored: it is a **verified** email on `ADMIN_EMAILS`. The user will create two extra test accounts (individual, organization) with email aliases for the live test matrix in 4b. Step 3's commit is `ba86013`.
- **Database (applied to `week7-dev` with the user's approval after the SQL was shown):** migration `20261027123133_add_profile` creates enum `ProfileRole` (individual, organization) and table `Profile` (`id`, unique `userId`, `role`, `displayName`, optional `orgName`, `createdAt`). Additive; `Profile` has 0 rows and `Opportunity` still has 0 rows. The migration SQL was generated with `prisma migrate diff` and applied with `migrate deploy` (not `migrate dev`, which needs an interactive terminal).
- **Code:** `lib/rolesCore.js` (admin-email parsing and check; `validateSignUp`, which allows only the roles individual and organization, trims and lower-cases the email, requires an organization name only for organizations); `lib/safeRedirect.js` (`safeNextPath`: only plain same-site paths, never `//host`, backslashes, control characters, long values or `/api` paths); `"test": "node --test \"tests/**/*.test.js\""` in `package.json`.
- **Tests (Claude-verified):** `npm test` runs 10 tests, all pass (admin list parsing and the verified-only rule, rejected roles including `admin`, bad names, emails and passwords, and open-redirect attempts); lint and build pass. My first `npm test` script (`node --test tests/`) failed because Node treats `tests/` as a file, so it was changed to a glob like Monster Interview's.
- **Known limits:** Node prints a harmless `MODULE_TYPELESS_PACKAGE_JSON` warning when it loads the test files, because `package.json` has no `"type"` field; adding `"type": "module"` was left out to avoid side effects on the other config files. These are unit tests of pure rules only; nothing yet exercises real sessions (that is the 4b matrix).

## Step 4b — Accounts, roles and admin enforcement (awaiting the user's commit approval)

- **Date:** 2026-10-27
- **Step 4a commit:** `2d40a7f` (Profile table, role rules, tests).
- **Changes:** pages `/auth/sign-up` (name, email, password, individual or organization plus organization name), `/auth/verify` (emailed code, "send a new code"), `/auth/sign-in` (with a safe `next` return path) and `/account` (name, email, verified status, account type, "Administrator" label, link to add an opportunity for admins, sign-out, and a "Finish your profile" form for an account without a profile); server actions in `app/auth/actions.js` that re-validate everything on the server; the header shows "Sign in / Create account" or "Account"; `lib/roles.js` (`getCurrentUser`, `requireAdminApi`, which fails closed); `components/AdminGate.js` wraps the admin pages' content so it is not rendered, and its database reads do not run, for anyone but an admin (a layout would not do this, since layouts and pages render at the same time); `POST /api/opportunities` and `PATCH`/`DELETE /api/opportunities/[id]` call `requireAdminApi` first (401 not signed in, 403 not admin, 503 if the sign-in service fails); public `GET` unchanged. **Removed:** `proxy.js` (the Basic Auth lock; the real checks are now in the route handlers and pages, and the unproven beta middleware is not used), the throwaway `app/auth-spike/`, the "local development only" notices, and `ADMIN_USER`/`ADMIN_PASSWORD` from `.env.example`. `validateProfileChoice` was split out of `validateSignUp` and tested (11 unit tests).
- **Tests (Claude-verified):** `npm test` 11 of 11, `npm run lint` and `npm run build` pass. Against the running dev server, signed out: `POST`, `PATCH` and `DELETE` on `/api/opportunities*` return 401 `{"error":"Sign in required."}`; public `GET`s return 200 (404 for an unknown id); `/account`, `/admin/opportunities/new` and `/admin/opportunities/x/edit` redirect to `/auth/sign-in?next=…`; the admin form markup is absent from the signed-out response; the static shell contains the header nav but no baked-in sign-in links. **Read-only database check afterwards:** 3 verified accounts, 3 profiles (0 orphaned): the admin account (email on `ADMIN_EMAILS`, profile role individual), one individual and one organization (organization name saved), each profile name equal to its account name.
- **User-verified:** the user created the individual and organization test accounts (email aliases) with the sign-up, verification and sign-in pages and reported **"I created both test accounts and they passed."** They did not itemize which checklist steps they saw, so this records only that overall confirmation. In particular, nothing here claims that they saw the 403 for the individual and organization accounts, the "no access" page, the admin 400, the wrong-password message or the "send a new code" email; those were not reported individually.
- **Not verified:** the signed-in API results (admin 400, individual/organization 403) were not observed by the agent (it does not have the users' passwords); sign-up with an email that already has an account (the app shows a generic message; Neon's exact behavior was not observed); the "send a new code" action (Neon's docs gave a single example call); behavior of an unverified account that is signed in; Vercel.
- **Problems found, errors and corrections:** the test scripts first returned 400 instead of 401 because zsh does not split an unquoted `$J` into two arguments (a script error, not an app error; rerun with explicit headers gave 401); a script variable named `path` overwrote zsh's `PATH`; a second `next dev` cannot run in the same project, so the checks used the running server on port 3000; a database join needed `u.id::text` because `neon_auth.user.id` is a uuid and `Profile.userId` is text. Build output now shows noisy `[neon-auth] Cookie validation error … During prerendering` lines from the SDK while it prerenders (exit code 0, no effect on the output).
- **Known limits:** the admin account's profile role is "individual" (it was finished through the "Finish your profile" form; admin status does not depend on it); `/admin/*` pages return HTTP 200 and redirect or show "no access" in the page (the status cannot change once streaming starts), while the APIs return real 401/403; no rate limit of our own on sign-in attempts (whatever Neon applies); email is limited by Neon's shared sender.

## Step 5 — Listing types, approval state and optional fields (awaiting the user's commit approval)

- **Date:** 2026-10-27
- **Step 4b commit:** `e5ed8e8` (Neon Auth accounts and roles).
- **Decisions by the user:** listing types are workshop, event (shown as "Event / meetup") and resource; **mentoring is left out on purpose** (liability: ongoing one-to-one contact between unvetted adults and young people; adding a type later is a small additive migration, removing one is hard; if it returns it should be organization-only). The category list was approved as proposed (Health & Wellness, Education, Arts & Media, Technology, Legal & Advocacy, Trades & Construction, Business & Finance, Community & Social Services, Government & Policy, Other). Flyer uploads were deferred (storage, image checks, moderation, alt text; about 2-3 h); a short summary field was added instead. The description stays required and the short summary stays optional (the user chose "unchanged" after asking what the difference is; the agent had wrongly started to make it required, and that edit was rejected before anything was written).
- **Database (applied to `week7-dev` with the user's approval after the SQL was shown):** migration `20261027133946_add_listing_types_and_approval`: enum `ApprovalStatus` (pending, approved, rejected); `OpportunityType` gains `workshop`, `event`, `resource`; `Opportunity` gains `approvalStatus` (default **pending**), `rejectionReason`, `ownerUserId`, `summary`, `requirements`, `skills` (list), `category`, `commitment`, `eventDate`; two indexes. Verified afterwards: 7 types, 3 approval states, 9 of 9 new columns, default `'pending'`.
- **Code:** `lib/opportunityTaxonomy.js` (types, categories, event-date rule); `lib/opportunityVisibility.js` (`PUBLIC_WHERE`: approved and not archived; used by the homepage and the public GET list and detail, so pending, rejected and archived listings answer "not found"); `serializePublicOpportunity` (public output no longer includes `ownerUserId`, `approvalStatus` or `rejectionReason`); the validators accept the new fields (`skills` trimmed, de-duplicated, at most 15 of 50 characters; category must be on the list; `eventDate` only for workshop and event) and reject any request that sets `approvalStatus`, `rejectionReason` or `ownerUserId`; `requireAdminApi` now returns `{ denied, current }`, and an admin-created listing is saved as `approved` and owned by that admin; the admin form gained a "More details" section, the new types and an event date shown only for workshop and event (switching the type away from those clears the date in the same save); card labels for the new types.
- **Tests (Claude-verified):** `npm test` 26 of 26 (new: validator rules, update rules, visibility, public serializer, form helpers); lint and build pass (build still prints the SDK's prerender notices, exit code 0). Direct check of the real update validator: changing a workshop with an event date to a job is refused naming `eventDate`; with the date cleared it is accepted.
- **User-verified:** after the migration the user created a fictional "TEST Workshop" as admin and reported "The workshop saved and I can see it on the homepage"; later "it ended up saving" for the type-change test, and that the cleanup request "printed 200". They did not itemize the other steps, so nothing else is recorded as individually seen. **Agent corroboration (read-only):** the public API showed the workshop with category, commitment 2 hours, skills, event date and a null summary, without the three private fields; the database row was `approved`, source `owner-added`, owned by an existing account, rejection reason empty; after the user's DELETE, the public list is `[]` and `Opportunity` has 0 rows (3 accounts and 3 profiles unchanged).
- **Problems found, errors and corrections:** two diagnostic scripts failed on shell quoting and a missing `timeout` command on macOS (script errors only); the first design would have exposed `ownerUserId` on the public API, which is why the public serializer was added; a stale dev server held the old Prisma client until restarted.
- **Not verified:** the browser refusal message for a type change that keeps an event date (the form clears the date itself, so it cannot be reached from the form); the form's behavior on the other types and fields beyond what the user reported; Vercel.
- **Known limits:** the admin form is general (every type shows the same fields except the event date); the card does not display the summary yet (Steps 7-9); the statement "cannot clear a required field" applies to description only, summary is optional.

## Step 6 — Seed and enrich listings (awaiting the user's commit approval)

- **Date:** 2026-10-27
- **Step 5 commit:** `7f0ceec` (listing types, approval state and optional fields).
- **Decisions by the user:** "go with A and use your drafts": the two V1 deadlines that had already passed (Policy Fellow, 2026-08-15, and Program Assistant, 2026-09-29) were moved to future dates for the demo (2027-01-31 and 2026-11-30), and the agent's drafted summary, requirements, skills, category and commitment text was accepted. The user was told the text is fictional and editable in the admin form. The user did not review each requirements sentence individually.
- **Changes:** `prisma/seed-data.mjs` (the 10 V1 listings with their V1 fields, ids, dates and `lastUpdated`, plus the drafted text; apply links and emails are still placeholders on example.org); `prisma/seed.mjs` (plain SQL through `pg` using `DIRECT_URL`; `INSERT … ON CONFLICT ("legacyId") DO NOTHING`, so it can be run again and never overwrites later edits; every row is `approved` and has no owner); `"db:seed": "node --env-file=.env prisma/seed.mjs"` in `package.json`. `.mjs` was used so Node does not print the module-type warning.
- **Tests (Claude-verified, against `week7-dev`):** run 1: "10 added, 0 already there, rows now 10"; run 2: "0 added, 10 already there, rows now 10". A script compared every stored field with V1's JSON: the only differences are the two approved deadlines, so titles, organizations, descriptions, types, relevance, status, location, pay, `datePosted`, `lastUpdated` (preserved, not reset to today), apply methods and `source` match. All 10 are approved, none has an owner, all have a summary and category, ids are unique. The public API returns 10 listings (statuses active and filled; types job 3, internship 2, fellowship 3, volunteer 2) with no private fields. The homepage returns 200 with "10 opportunities found", 10 cards, **no Edit link and no Delete button on any card**, one "Filled" pill, and no deadline-passed marks. `npm test` 26 of 26, lint and build pass.
- **Not verified:** the homepage appearance in a browser (layout, wording of the cards); the content of the drafted text beyond the user's blanket approval; the Spanish text (Step 11).
- **Known limits:** apply links are still placeholders; the cards do not show the summary yet (Steps 7-9); the seed uses a random UUID as the id (the database has no id default, Prisma generates ids in the app); running the seed does not update a row that already exists.

## Step 7 — OpenRaiz branding and navigation

- **Date:** 2026-10-27
- **Step 6 commit:** `0cbf455` (seed and enrich listings).
- **Finding:** the new app already carried V1's palette, sprout logo, favicons and centered header; what was missing was the pill navigation, a footer, a skip link, global focus outlines and the landing page.
- **Decisions by the user:** keep the spelling **OpenRaiz** (no accent) in the logo, titles and landing text; reuse V1's mission text word for word and add one sentence: "Organizations and individuals can also share workshops, events, resources and opportunities here."; reuse V1's About photo. The Interview tab and the accessibility link are added when those pages exist (Steps 18 and 23), so there are no dead links.
- **Changes:** the landing page `/` (V1's mission card, the About photo as a page background on wide screens and a photo band on phones, a "Browse opportunities" button, the Alianza line); the opportunities list moved from `/` to `/opportunities` (links and redirects that meant "the list" were updated, including the admin form's save-and-return); header, footer and a "Skip to main content" link now live once in `app/layout.js` (the per-page header was removed); `NavLinks` (About, Opportunities, with the current page shown as a white pill and `aria-current`); `SiteFooter`; the nav wraps on narrow screens; every `<main>` has `id="main-content"`; global `:focus-visible` outlines; the footer stays at the bottom of short pages; `public/OpenRaiz_About.jpg` copied from the original site.
- **Tests (Claude-verified, against the dev server):** all 8 pages return 200 with exactly one skip link, one `main-content`, one header, one footer and a Primary nav; the landing page contains the new sentence, one `h1`, the Browse button and the Alianza line, with About marked current; `/opportunities` shows 10 cards with Opportunities marked current and no Edit, Delete or Add buttons; the signed-out header shows Sign in and Create account; the photo is served (149 KB); `npm test` 26 of 26, lint and build pass.
- **User-verified:** after the checklist (desktop look and nav, phone width at 375 px, keyboard-only skip link and focus outlines) the user reported "everything looks right". They did not itemize the individual checks, so this records only that overall confirmation.
- **Not verified:** the signed-in header (Account link); other phone sizes and browsers; a screen reader; color contrast (the Step 22 audit); social-share metadata (`og:url`/`metadataBase`, set when the real address exists in Step 21).
- **Known limits:** navigation text is English only until Step 8; the look is V1's brand carried over, not the richer visual redesign in the original mockup (search bar, category tiles, icons), which is not part of the Thursday plan.

## Step 8a — Language routes (/en, /es)

- **Date:** 2026-10-27
- **Step 7 commit:** `a1b93d9` (branding and navigation).
- **Finding that changed the plan:** plan v2 said to keep the language in a cookie and read it on the server. A test build with `cookies()` read in the root layout (where `<html lang>` is set) **failed** under Cache Components ("cookies() … accessed outside of `<Suspense>` prevents the route from being prerendered"); the test change was reverted. Fixing `<html lang="en">` would put the wrong language on Spanish pages (WCAG 3.1.1) and would show up in the Step 22 accessibility audit. Next's own i18n guide recommends the language in the address.
- **Decisions by the user:** yes to all four proposals: language in the address (`/en`, `/es`) instead of a cookie; admin pages English only; first visit picks the language from the browser, falling back to English; Spanish register: **tú** for young people (browsing, sign-up, sign-in, account) and **usted** for individuals and organizations who post opportunities (the posting form and its messages, Step P1). The user reviews the Spanish text before it is committed (Step 8b).
- **Changes:** the public pages moved under `app/[lang]/` (landing, opportunities, auth pages, account, a not-found page); the admin pages moved to their own route group `app/(admin)/` with their own root layout (`lang="en"`); both root layouts share `components/SiteShell.js` (skip link, header, footer) and `lib/siteMetadata.js`; `generateStaticParams` builds `/en` and `/es` ahead of time; `lib/i18n/config.js` (`LOCALES`, `isLocale`, `localePath`) and `lib/i18n/negotiate.js` (`negotiateLocale` reads Accept-Language); a new `proxy.js` redirects any address without a language (not the API, `/admin`, `_next` or files) to `/en/...` or `/es/...` with a 307 and a `Vary: Accept-Language` header; header links, nav, auth links, the sign-up, sign-in, verify, account and sign-out forms (a hidden `lang` field), and every server-action redirect now keep the language; admin links and redirects point at `/en/...`.
- **Tests (Claude-verified, against the dev server):** `/` goes to `/en` with no header, to `/es` for `es-MX,es`, to `/en` for `en-US` and for `fr`; `/opportunities` and `/account?x=1` go to the same address with `/es` (query kept); the 8 language pages tested return 200 with `<html lang>` equal to the address language and no internal link without a language; `/en/nope` and `/es/opportunities/abc` return 404; `/admin/opportunities/new` returns `lang="en"` and redirects signed-out visitors to `/en/auth/sign-in?next=%2Fadmin%2Fopportunities%2Fnew`; the API is unchanged (GET 200, signed-out POST 401); 10 cards in both languages; `npm test` 30 of 30 (4 new tests for languages and negotiation), lint and build pass, with `/en` and `/es` prerendered.
- **User-verified:** after the five-step check (landing in the right language, nav keeping the language, sign-in at `/es/auth/sign-in` landing on `/es/account`, sign-out returning to `/es`, the admin form redirecting to sign-in and back) the user reported "everything worked". They did not itemize the steps, so this records only that overall confirmation.
- **Not verified:** the Spanish text itself (Step 8b: the interface is still English under both addresses); the language toggle (8b); `hreflang` alternates and `metadataBase` (Step 21, when the real address exists); behavior on other browsers.
- **Known limits:** the unknown-address `/xx` is redirected to `/en/xx` and then answers 404; navigating between the public site and the admin pages is a full page load (separate root layouts); the not-found page is English until 8b.
