# Scale Army SOP Handbook 

This is the markdown source-of-truth vault for Scale Army's Standard Operating Procedures, built from the master SOP Handbook and its linked source documents.

## Structure

```
SOPs/
├── account-management/     # AM + Client Success SOPs and glossaries
├── recruitment/             # Recruiting process, screening, SLA, offer stage
├── hr/                      # Payroll, disciplinary process, offboarding, legal terms
├── it/                      # IT + HubSpot SOPs and glossary
├── sales/                   # Sales training, follow-up, cold calling, glossary
├── finance/                 # Billing, payroll prep, forecasting, commissions, referral bonus
├── outbound-ashby-linkedin/ # Batch 0, closing/posting roles on Ashby, LinkedIn slots
├── marketing/                # Funnel definitions and channel overview
└── sopsop/                   # How to write an SOP (meta/template)
```

Every file has YAML frontmatter (`title`, `department`, `category`, `owner`, `last_updated`) so the future Next.js site and RAG ingest pipeline can build navigation and citations directly from it.

## Known gaps

A few SOPs in the original handbook point to folders (not single docs) or to video walkthroughs rather than written procedures. Those are included here as short stub files with a pointer, rather than invented content:

- `it/it-sop.md`, `it/hubspot-sop.md` — live across a shared Drive folder, not a single doc.
- `recruitment/recruiting-calls-daily.md`, `batch-zero-process.md`, `dry-pipeline-management.md`, `candidate-interview-process.md`, `av-prep-calls-for-client-interview.md` — primary reference is a live spreadsheet or recorded video.
- `recruitment/recruiter-offer-stage-how-to-give-an-offer.md` — the linked source doc was inaccessible (moved/deleted/permissions) at the time of this pull.

Consider assigning an owner to backfill these directly as markdown going forward, so they don't stay as stubs.

## Source

Converted from "Scale Army: SOP Handbook" (Google Doc) and its linked source documents. All content, ownership, and dates reviewed and confirmed current as of July 20, 2026.

## Website & Chatbot

This repo also contains a Next.js 14 (App Router, TypeScript, Tailwind) app that turns `SOPs/` into a login-gated internal wiki with a RAG chatbot, living alongside the vault at the repo root (`src/`, `scripts/`, `package.json`, etc.). `SOPs/` remains the source of truth — the app only reads it, never writes to it.

### Running locally

```bash
npm install
cp .env.example .env.local   # fill in the values described below
npm run dev
```

The app is invite-only. There is no public signup — accounts are created by an admin at `/admin` (unlocked with `ADMIN_SECRET`, not tied to any user account), which emails the invited person a temporary password via Resend. Every route except `/login`, `/admin`, and the auth API routes requires a valid session (see `src/middleware.ts`, `src/lib/session.ts`). Sessions and user accounts are stored in the same Vercel Postgres database used by the chatbot's vector store (`kb_users` / `kb_sessions` tables), not a separate service.

### Running ingest (chatbot's knowledge base)

`scripts/ingest.ts` walks `SOPs/`, chunks each note by heading (~500-800 tokens, small overlap), embeds each chunk via Voyage AI, and upserts into a `kb_chunks` table in Postgres (pgvector). Re-running it is safe — chunks are keyed on `(file_path, content_hash)`, so only changed content gets re-embedded.

```bash
npm run ingest
```

Requires `VOYAGE_API_KEY` and `POSTGRES_URL` to be set first.

### Operator inputs still needed before this can go live

None of the following are set in this repo — `.env.example` documents each with empty placeholder values only:

- `OPENROUTER_API_KEY` / `OPENROUTER_MODEL` — OpenRouter key + model id (e.g. `anthropic/claude-3.5-sonnet`) for chat generation.
- `VOYAGE_API_KEY` / `VOYAGE_MODEL` — Voyage AI key for embeddings (defaults to `voyage-2`, 1024-dim).
- `POSTGRES_URL` — a Vercel Postgres (or any Postgres with the `pgvector` extension available) connection string.
- `ADMIN_SECRET` — shared secret that unlocks `/admin` (`openssl rand -base64 32`). Not tied to any user account — this is how the very first account gets created.
- `RESEND_API_KEY` / `RESEND_FROM_EMAIL` — for sending invite emails. `RESEND_FROM_EMAIL` defaults to `onboarding@resend.dev`, which works without verifying a domain for quick testing; verify Scale Army's own domain in Resend for reliable delivery to real teammates.
- `APP_URL` — optional; used to build the login link in invite emails. Falls back to the request's own host if unset.

Until these are supplied, the site itself runs and renders all SOP content fine; only the admin invite flow and the chatbot's retrieval/generation are inert (they fail with a clear error message rather than crashing). Note: if `RESEND_API_KEY` isn't set, `/admin` still works — the invite endpoint falls back to showing the generated temporary password directly in the admin UI instead of emailing it, so you can share it manually.
