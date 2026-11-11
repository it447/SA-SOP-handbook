---
title: "WorkHub SOP"
department: it
category: SOP
owner: "Seif Farid"
last_updated: 2026-11-11
---

## Overview

WorkHub is Scale Army's in-house replacement for Asana: portfolios, projects, tasks, goals (with key results), teams, notes, request forms (with in-app approval chains), a company-wide "SA Goals" dashboard, a read-only HubSpot company mirror, and **SA Confluence** (an internal wiki) — with per-item sharing, status updates, activity logs, and notifications.

It's a Next.js 15 app (App Router, server actions), using NextAuth (Google sign-in) and Prisma/Postgres (Supabase in production). It's hosted on Vercel.

## Who this is for

Everyone at Scale Army uses WorkHub day to day for tasks/projects. This SOP has two audiences:
- **General users** — see "Everyday Usage" below for how to create projects/tasks, submit forms, and use the wiki.
- **IT/Admins** — see "Technical Reference" and "Troubleshooting" for architecture, environment variables, and diagnosing issues.

## Access & Sign-in

- Sign-in is **Google OAuth, invite-only**: you must already be an active person on the **People** page (added by an admin) before you can log in — there's no public signup.
- Sessions last **24 hours from login**, flat (doesn't extend while you keep using the app). After that you're signed out and the Google account chooser shows again so you can confirm which account to use.
- Deactivating someone on the People page shuts them out immediately and drops them from assignee pickers.
- `ALLOWED_EMAIL_DOMAIN` restricts sign-in to a company domain (e.g. `scalearmy.com`); `ALLOWED_EXTERNAL_EMAILS` allows specific outside addresses past that (e.g. a contractor) — but those accounts are **external**: a locked-down, shares-only, view-only view that sees only what's explicitly shared with them (never "everyone"-visible boards, OKRs, People, Teams, Companies, or Forms).

### Roles

| Role | What it means |
|---|---|
| **Admin** | Manages People, Teams, Goals, the HubSpot sync; can share/delete anything they can see. `seif@scalearmy.com` is a permanent admin; more are set via `ADMIN_EMAILS` or the People page. |
| **Manager** | Not a separate level — a switch on top of any role (e.g. Admin+Manager, Member+Manager). Sees Manager Weekly Pulse scores for their own team, and (same as Admin) sees every SA Confluence wiki page regardless of sharing. |
| **Member** | Normal access: creates/edits things, sees items shared with everyone or with them. |
| **Viewer** | Same visibility as a Member, but read-only — can't change anything (except commenting on wiki pages, see below). |

### The golden rule: "private means private"

A project, portfolio, task, or Doc (1:1 record) shared with specific people is visible **only** to its creator and those people — **admins get no special access**, except for items nobody created (seeded/synced data). **SA Confluence (the wiki) is the one deliberate exception**: admins and managers can see every wiki page regardless of its share list, because it's meant to be a company knowledge base, not private notes.

## Everyday Usage

### Creating a project and tasks

1. Projects live inside **portfolios**. Go to **OKRs/Portfolios** in the sidebar, open a portfolio, and click **Create project** (or **Add an existing project** to link one already outside every portfolio).
2. A new project starts **private** ("Only people I share with") and inherits its portfolio's audience by default — share it from the project's Overview if you want others to see it.
3. Inside a project, add **Sections** (Asana-style board columns) to organize tasks, and add **Custom Fields** (text, number, date, select, multi-select, link, etc.) that show as tags/pills on each task card.
4. To add a task: open the project (or **Tasks** / **My tasks**) and use **Add task** / **Create**. You can set a main assignee plus any number of **extra assignees** (task pop-up → *+ Add assignee*) — everyone added sees it in **My tasks**, flagged **New**, and gets a Slack DM if configured.
5. **Column rules** (the ⚡ icon on a column) can auto-assign a task to someone, or auto-set a field (e.g. stamp today's date), whenever a task lands in that column — configured per project by anyone who can edit it.
6. Completing a task shows "Task completed" with an **Undo**. Moving a task out of its project makes it private to whoever moved it; moving it into a project shares it with that project's people (if done by its creator, assignee, or an admin).

### Submitting a request form

1. Click **Forms** in the sidebar and pick a form (e.g. **Gift Card Request**, **Clear Spend**, **Tool Request**, **Product Roadmap** intake).
2. Fill it in — fields can appear/require answers conditionally (e.g. a reason is required once an amount passes a threshold).
3. Submit. You get a link to track it, and can always see your own submission even though the board itself may be private to approvers/admins.
4. If the form has an **approval chain**: your submission becomes a task on a locked-down board, routed to the first approver. Each approver sees **Approve / Reject** on the task; approving advances it to the next stage (reassigning it to the next approver); the final approval closes it **Approved**. A **Reject** asks for a reason and closes it **Rejected**, notifying you why.
5. Some forms are **intake forms** (no approval, e.g. Product Roadmap) — your submission lands straight on the board as a task for the owning team to triage, optionally pinging a Slack channel.
6. **Admins/managers** can also build entirely new forms with no code at **Forms → Manage forms** — see "Forms & Approvals" under Technical Reference.

### Using SA Confluence (the wiki)

1. Click the **SA Confluence** (Wiki) tab.
2. Any editor (Member role or above) can create a new top-level page, or a sub-page nested under an existing one (Notion-style page tree).
3. Pages are listed as a searchable tree, not a flat list — click a page to open its full rich-text content.
4. **Access**: as the creator, you (and any admin/manager) can edit the page and share it with specific people (view access) via the share panel on the top-level page — sub-pages always inherit their top page's sharing, you don't share them individually.
5. **Admins and managers see every wiki page automatically**, regardless of who it's shared with — this is intentionally different from 1:1 Docs (see below), because the wiki is meant to be a browsable company knowledge base.
6. **Commenting is open to anyone who can see the page**, including view-only Viewers — you can highlight a piece of text and leave an inline comment (Google-Docs style) or a general page comment, reply in a thread, and resolve/reopen it. A page's own author or an admin/manager can also moderate (resolve/delete) anyone's comment on it.
7. If you can't open a page someone mentioned (e.g. you were @mentioned on it but never shared), you'll see a "request access" screen instead of a 404 — it notifies the page's owner/admins to share it with you.

### One-on-One Records ("Docs")

Separate from the wiki — these are **private** rich-text documents (e.g. weekly 1:1 notes), found under **Docs**. Name one, write in it (it autosaves), and share it with specific people (they can edit it too, and get notified). Unlike the wiki, **only the creator and the people it's shared with can ever open a Doc — not even admins.** If two people edit the same Doc at once, the later save is refused with a message rather than silently overwriting.

### Notifications

Being assigned a task (by someone else) sends you a Slack DM and flags it **New** in My tasks. Being @mentioned in a comment goes to your **Inbox** (bell/avatar badge in the profile menu). If `SMTP_*` is configured, the same notifications are also emailed.

## Technical Reference

### Stack & hosting

- **Framework:** Next.js 15, App Router, server actions (no separate REST backend for app features — see `actions/*.ts`).
- **Auth:** NextAuth with the Google provider (`@next-auth/prisma-adapter`).
- **Database:** Prisma ORM over Postgres (Supabase in production; any Postgres works). `DATABASE_URL` is the connection string the app runs on; `APP_DATABASE_URL` overrides it in production (points at Supabase's pooled connection) so the live database can be switched without touching the old one.
- **Hosting:** Vercel. `npm run vercel-build` (→ `scripts/vercel-build.sh`) runs `prisma migrate deploy` automatically when `DATABASE_URL` is set. **Preview deployments never migrate the live database** unless `ALLOW_PREVIEW_MIGRATIONS=1` is explicitly set for Preview.
- **Rich text editor:** Tiptap (`@tiptap/*`), used by the shared `RichPage` component (`components/project/RichPage.tsx`) for a project's Page tab, Docs, and SA Confluence pages — autosaves as you type, with optimistic-concurrency version checks so a stale save is refused rather than silently overwriting someone else's edit.

### Data model highlights (`prisma/schema.prisma`)

| Model | Purpose |
|---|---|
| `User` | Person record: `role` (ADMIN/MEMBER/VIEWER), `isManager`, `active`, `hrName` (for Manager Pulse matching) |
| `Portfolio` / `Project` / `Section` / `Task` | Core Asana-style hierarchy. `Project.visibility` is `EVERYONE` or `RESTRICTED`; `Project.page` is a Tiptap "Page" tab. |
| `TaskAssignment` | Extra assignees beyond the main one. |
| `Goal` / `KeyResult` | Project-level OKRs. |
| `GoalMonthData` | SA Goals company-wide monthly dashboard inputs (separate from project goals). |
| `Note` | Freeform notes attached polymorphically to a Portfolio/Project/Task/Goal. |
| `Activity` | Status updates and log entries, attached polymorphically via `EntityType` (PORTFOLIO/PROJECT/TASK/GOAL). |
| `Share` | Generic `(entityType, entityId, userId)` access grant used for RESTRICTED portfolios/projects/tasks/goals. |
| `Doc` / `DocShare` / `DocEntry` | Private 1:1 records; `DocEntry` is a dated sub-entry inside one (e.g. one week's notes). |
| `WikiPage` / `WikiPageShare` / `WikiComment` | SA Confluence. Pages nest via `parentId`/`rootId` (a sub-page denormalizes its top-level ancestor so access resolves in one query). Comments support threaded replies and inline anchoring to a highlighted range of text. |
| `Form` / `FormField` / `FormSubmission` / `FormApprover` | No-code builder forms (admin/manager-built, DB-stored) — separate from the code-defined forms in `lib/forms/definitions.ts`. |
| `ApprovalStep` | One row per stage of a form's approval chain — a real audit record of who approved/rejected what, when. |
| `Company` / `CompanySyncRun` / `CompanySyncLease` | The read-only HubSpot company mirror and its resumable sync state. |
| `AccessLog` | Every share/unshare/visibility change on a portfolio, project, task, goal, or Doc — shown as "Access history" on each item. |
| `SecurityEvent` | Security audit trail: sign-ins (allowed and refused), sign-outs, permission/team changes, assistant-API calls. |
| `OAuthClient` / `OAuthCode` / `OAuthToken` | The self-hosted OAuth 2.1 server backing the Claude MCP connector. |

### Access control (`lib/access.ts`, `lib/wiki.ts`, `lib/docs.ts`)

Every server action re-checks access server-side — the UI hiding a button is never the only guard. Key helpers:
- `requireViewer()` / `requireEditor()` / `requireAdmin()` / `requireManager()` — throw `AccessError` if the signed-in person doesn't qualify.
- `wikiWhere(viewer)` — admins/managers get `{}` (everything); everyone else gets pages they created, were shared on, or that live beneath one of those as a sub-page.
- `editableWiki(id)` / `ownedWiki(id)` — a page's content/sharing can only be changed by its creator or an admin/manager; shared viewers are read-only.
- `commentableWiki(pageId)` — deliberately open to **anyone who can see the page**, including VIEWER-role users: commenting is collaboration, not an edit of content.
- `docWhere(viewer)` (Docs/1:1s) — **always** just creator + shares, with **no** admin override, by design.

### Forms & approvals (`lib/forms/definitions.ts`, `actions/forms.ts`)

- **Code-defined forms** (Gift Card, Clear Spend, Tool Request, Product Roadmap) have their fields and approval chain hard-coded in `lib/forms/definitions.ts`. Submitting (`submitForm`) validates answers, resolves the approver chain, and creates one task with an `ApprovalStep` row per stage.
- **Approve/Reject** (`approveStep` / `rejectStep`) are guarded so only the stage's assigned approver can decide — not admins, not the requester. The step is claimed atomically so two simultaneous clicks can't double-advance it.
- **No-code builder forms** (`/forms/manage`, admins/managers only) are stored in the DB (`Form`/`FormField`/`FormSubmission`) — build fields, pick a target project + task-title template + column routing (map a dropdown field's answers to board columns), and optionally a Slack notification. See `docs/forms.md` for the full routing tables (who approves Gift Card, Clear Spend's amount-based routing, Tool Request's per-department chain, etc.) — **these routing tables live in code/env vars and should be confirmed before go-live if people change roles.**

### SA Confluence wiki internals (`lib/wiki.ts`, `actions/wiki.ts`, `components/wiki/*`)

- `createWikiPage` — any editor can create a page, optionally nested under a `parentId`; a sub-page's `rootId` is set to its parent's top-level ancestor.
- `saveWikiPage` — compare-and-swap save using the page's `updatedAt` as the version token; a stale save is refused with a message naming who changed it, instead of silently overwriting.
- `saveWikiAnchors` — a restricted save path used for adding/removing **comment highlights only**: the incoming doc must be byte-identical to the stored one once comment marks are stripped from both, so this path can never be (ab)used to edit page text even by a view-only commenter.
- `shareWikiPage` / `unshareWikiPage` — only on **top-level** pages (sub-pages inherit); logged to `AccessLog` and notifies the shared person.
- `requestWikiAccess` — lets someone who can't open a page (e.g. @mentioned on it) ping its owner/admins to share it with them.

### Companies (HubSpot sync) (`lib/companySync`)

- Read-only mirror of HubSpot, run every 6 hours (05:30/11:30/17:30/23:30 UTC via Vercel Cron → `/api/cron/companies-sync`, plus a manual **Sync now** button).
- **Active list** = companies with a deal in the Client Success pipeline (any stage except two excluded ones) or the MOF pipeline. **MRR** = sum of `margin__price___salary_` across qualifying deals. **Deal status**: Active Client (hires ≥ 1) → Active Search (searches ≥ 1) → Lost.
- **Resumable**: a run works against a time budget (`COMPANY_SYNC_BUDGET_MS`, default 240s) and checkpoints its progress (`CompanySyncCycle`) so it can pick up where it left off on the next tick instead of starting over, if it can't finish inside Vercel's 300s function limit.
- Fills the **All Clients** project (one task per company) with sync-owned fields (MRR, Active Hires/Searches, Deal Stage/Status, Open Tickets, Pod, Domain, HubSpot URL) — Health Score, Next Check-In, and Check-in Done are never touched by the sync.

### SA Goals (`lib/sa-goals/`)

Company-wide OKR dashboard (searches, meetings held, SAL funnel, pace vs. goal) kept separate from project-level Goals/KeyResults. Inputs are stored per month and validated server-side (only real months, known field names, and numbers are accepted).

### Integrations

| Integration | Docs | Purpose |
|---|---|---|
| **Assistant API** | `docs/assistant-api.md` | REST API the Scale Army Assistant Slack bot calls to answer "what's overdue?" and let someone mark their own task done — scoped to exactly what that person can see/do in WorkHub, tasks-only, rate-limited at 60 calls/min, every call logged (`SecurityEvent`, kind `assistant_call`). |
| **Claude connector (MCP)** | `docs/claude-connector.md` | Lets a person add WorkHub to Claude.ai/Desktop as a custom OAuth connector and chat with it about their own tasks. Self-hosted OAuth 2.1 (PKCE required, single-use codes, hashed tokens). Inert (404) unless `MCP_CONNECTOR_ENABLED=1`. |
| **Intake API** | `docs/intake-api.md` | `POST /api/intake/tasks` — lets an outside system (e.g. a Google Form via Apps Script) create a WorkHub task. Create-only; `externalRef` makes re-posting idempotent. |
| **Asana import** | `docs/asana-import.md` | `POST /api/admin/import/project` — one-time(-ish) migration endpoint that turns an Asana board into a WorkHub project (sections, custom fields, tasks/subtasks, assignees matched by email). Idempotent via deterministic ids (`asana-<gid>`); never deletes or touches Asana. |

### Environment Variables

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | Postgres connection string the app runs on. |
| `APP_DATABASE_URL` / `APP_DATABASE_URL_UNPOOLED` | Production override (Supabase pooled connection) / unpooled connection for running migrations. |
| `NEXTAUTH_SECRET` | Session encryption secret (`openssl rand -base64 32`). |
| `NEXTAUTH_URL` | The deployed URL, e.g. `https://sa-work-hub.vercel.app`. |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | Google OAuth credentials for sign-in. |
| `ALLOWED_EMAIL_DOMAIN` | Optional — restrict sign-in to this email domain. |
| `ALLOWED_EXTERNAL_EMAILS` | Optional — comma-separated outside emails allowed past the domain restriction (external/locked-down accounts). |
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob token for comment attachments (optional; hides the Attach button until set). |
| `HUBSPOT_API_KEY` | HubSpot private app token for the Companies sync. |
| `CRON_SECRET` | Secret Vercel Cron sends as `Authorization: Bearer` to trigger the Companies sync. |
| `HUBSPOT_WRITEBACK` | `"true"` to write MRR/deal counts back to HubSpot. |
| `GOOGLE_DRIVE_SERVICE_ACCOUNT` | Optional — service account for per-company Drive folders. |
| `GOOGLE_SERVICE_ACCOUNT_JSON` | WorkHub's own read-only service account for Manager Weekly Pulse (reads the HR dashboard's sheet). |
| `MANAGER_PULSE_SHEET_ID` | Optional override for the Manager Pulse spreadsheet id. |
| `ADMIN_EMAILS` | Comma-separated emails that are always admins. |
| `SMTP_HOST` / `SMTP_PORT` / `SMTP_USER` / `SMTP_PASSWORD` / `SMTP_FROM` | Optional email notifications (in-app notifications work without these). |
| `SLACK_BOT_TOKEN` | Bot token for assignment/@mention DMs and form-builder channel posts (scopes: `chat:write`, `users:read`, `users:read.email`, `channels:read`, `groups:read`). |
| `INTAKE_SLACK_WEBHOOK_URL` | Incoming-webhook URL pinged on each Intake API submission. |
| `PRODUCT_SLACK_WEBHOOK_URL` | Incoming-webhook URL pinged when the Product Request form is submitted. |
| `ASSISTANT_API_KEY` | Shared secret for the Scale Army Assistant's "my tasks" lookups. |
| `IMPORT_API_KEY` | Secret for the Asana import endpoint — leave unset outside an active migration (endpoint is `503` without it); remove once done. |
| `MCP_CONNECTOR_ENABLED` | `1` to turn on the Claude connector; otherwise all `/api/oauth/*` and `/api/mcp` routes 404. |
| `MCP_ALLOWED_REDIRECT_HOSTS` | Optional host allow-list for the Claude connector's OAuth redirect URIs. |
| `ALERT_EMAILS` | Comma-separated emails for server-error alerts (defaults to all active admins). |
| `ALLOW_PREVIEW_MIGRATIONS` | Set to `1` only once a Preview environment has its own database — otherwise Preview never runs migrations against the live DB. |
| `GIFTCARD_OWNER_EMAIL` / `GIFTCARD_APPROVER_EMAIL` | Gift Card form approver overrides. |
| `CLEARSPEND_APPROVER_A_EMAIL` / `CLEARSPEND_APPROVER_B_EMAIL` / `CLEARSPEND_EXEC_EMAIL` | Clear Spend form approver overrides. |
| `TOOLREQUEST_FINANCE_EMAIL` / `TOOLREQUEST_IT_EMAIL` | Tool Request form approver overrides. |

### Local development

```bash
cp .env.example .env   # fill in values
npm install
npx prisma migrate dev
npm run dev
```

Useful scripts: `npm run build` (`prisma generate && next build`), `npm run db:migrate` (`prisma migrate dev`), `npm run security` (`scripts/security-check.sh`), `npm run test:e2e` (`node e2e/run.js` — covers forms/approvals, the no-code builder, and the wiki, among other suites).

## Keeping it running / monitoring

- **Uptime check:** `GET /api/health` (public) → `200 {"ok": true, "db": "up"}` when the site and database both answer, `503` otherwise. Point an uptime monitor (UptimeRobot, Better Stack, etc.) at it every 1–5 minutes.
- **Error alerts:** unhandled server errors and client-side crashes send a Slack DM and/or email to `ALERT_EMAILS` (or every active admin if unset) — throttled to once per 15 minutes, capped at 20/hour.
- **Access history:** every share/unshare/visibility change on a portfolio, project, task, goal, or Doc is recorded (`AccessLog`) and viewable under that item's sharing panel.

## Troubleshooting Quick Reference

### Someone can't sign in
- Confirm they're **active** on the People page — sign-in is invite-only.
- Check `ALLOWED_EMAIL_DOMAIN` / `ALLOWED_EXTERNAL_EMAILS` if they're using a non-company address.
- Sessions expire exactly 24h after login (not sliding) — "I was logged out randomly" is expected behavior, not a bug.

### Someone can't see a project/task/wiki page they should
- Check whether the item is **RESTRICTED** and whether they're actually on its share list (or, for a task, whether they're its creator/assignee/explicitly shared).
- Remember: admins get **no** special access to private Docs (1:1 records) — that's by design, not a bug.
- For the wiki specifically: confirm the person is actually an Admin or Manager if you expect them to see everything; otherwise they only see pages they created, were shared on (check the **top-level** page's share list — sub-pages inherit it), or sub-pages beneath those.

### A wiki page save fails with "someone changed this page"
- Expected behavior — WorkHub's compare-and-swap save refuses to silently overwrite a newer edit. Copy your text out, reload the page, and reapply your change.

### A form submission isn't routing to the right approver
- Check the routing table in `docs/forms.md` for that specific form (Gift Card, Clear Spend, Tool Request) and confirm the relevant env var override (`GIFTCARD_*`, `CLEARSPEND_*`, `TOOLREQUEST_*`) is still pointing at the right person — these are read from env vars specifically so approvers can change without a code deploy.
- For Clear Spend, remember routing is by **amount** (USD ≥ 3,000 / MXN ≥ 55,000), not department.

### Slack notifications/DMs aren't firing
- Confirm `SLACK_BOT_TOKEN` is set and has the scopes `chat:write`, `users:read`, `users:read.email` (DMs) plus `channels:read` + `groups:read` (form-builder channel list).
- The bot must be **invited to the channel** before it can post there — the form builder's channel picker only lists channels the bot is already a member of.
- Intake/Product webhooks (`INTAKE_SLACK_WEBHOOK_URL`, `PRODUCT_SLACK_WEBHOOK_URL`) are separate from the bot token — these are plain incoming-webhook URLs, one per channel.

### The Companies (HubSpot) sync looks stale or incomplete
- Check `HUBSPOT_API_KEY` is valid and has `crm.objects.companies.read`, `crm.objects.deals.read`, `crm.objects.owners.read` (+ `.write` if `HUBSPOT_WRITEBACK=true`).
- A single run can hit Vercel's 300-second limit on a large portfolio — this is expected; it checkpoints and resumes on the next cron tick or a manual **Sync now**, rather than losing progress.
- Departed-client retirement only happens once a full cycle completes — a partial run never mistakes "not reached yet" for "this company left HubSpot."

### The Claude connector / assistant API isn't working
- Claude connector: confirm `MCP_CONNECTOR_ENABLED=1` is set — every connector endpoint 404s without it, by design.
- Assistant API: confirm `ASSISTANT_API_KEY` is set and matches what the Scale Army Assistant holds; check for `429 rate_limited` (60 calls/min cap per caller) in logs if calls are being dropped.
- Both integrations are **tasks only** — there's no code path to 1:1 Docs or Manager Pulse scores from either; if something looks like it's leaking private data, that's the first thing to verify.

### An Asana import doesn't look right
- Imports are **idempotent** (deterministic `asana-<gid>` ids) — re-running the same board is always safe and won't duplicate.
- By default, a task that already exists in WorkHub is **left as-is** on re-import (so in-app edits survive); pass `"force": true` to deliberately overwrite with Asana's values again.
- `assigneesUnmatched` in the response means that person hadn't signed into WorkHub yet at import time — have them sign in, then re-run the import to attach them.
- Remember to remove `IMPORT_API_KEY` from Vercel once a migration is finished — the import/share/portfolio endpoints are inert (`503`) without it.

## File Map (selected)

| Path | Role |
|---|---|
| `lib/access.ts` | Core access-control rules (viewer/editor/admin/manager checks) used everywhere. |
| `lib/wiki.ts` | SA Confluence access rules (view/edit/share/comment-moderation). |
| `lib/docs.ts` | 1:1 Docs access rules (private-only, no admin override). |
| `actions/wiki.ts` | Wiki server actions: create, rename, save (+ comment-anchor save), share/unshare, request access, delete. |
| `actions/wikiComments.ts` | Wiki comment server actions. |
| `components/wiki/*` | Wiki UI: page tree, page body/editor, comments panel, no-access screen. |
| `components/project/RichPage.tsx` | Shared Tiptap rich-text editor used by Project Page tabs, Docs, and wiki pages. |
| `lib/forms/definitions.ts` | Code-defined forms: fields + approval chains (Gift Card, Clear Spend, Tool Request, Product Roadmap). |
| `actions/forms.ts` | Submit/approve/reject for code-defined forms. |
| `actions/formBuilder.ts` / `actions/builtForms.ts` | No-code form builder (admin/manager) and its submission handling. |
| `lib/companySync` | HubSpot Companies mirror sync logic. |
| `lib/sa-goals/` | SA Goals company-wide dashboard logic. |
| `lib/oauth.ts` | Self-hosted OAuth 2.1 server backing the Claude MCP connector. |
| `app/api/mcp/route.ts` | The MCP server Claude's connector talks to. |
| `app/api/assistant/*` | REST API for the Scale Army Assistant Slack bot. |
| `app/api/intake/tasks` | Intake API (outside forms → WorkHub tasks). |
| `app/api/admin/import/*` | Asana migration import endpoints (project, share, portfolio). |
| `app/api/health` | Public uptime-check endpoint. |
| `app/api/cron/companies-sync` | Vercel Cron target for the Companies sync. |
| `docs/forms.md` | Full detail + routing tables for every form. |
| `docs/assistant-api.md` | Full Assistant API reference. |
| `docs/claude-connector.md` | Full Claude MCP connector reference. |
| `docs/intake-api.md` | Full Intake API reference. |
| `docs/asana-import.md` | Full Asana import reference. |
| `docs/security/` | Threat model, incident response, hardening report, data retention, pentest readiness. |
