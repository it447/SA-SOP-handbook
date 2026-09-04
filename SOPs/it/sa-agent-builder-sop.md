---
title: "SA Agent Builder SOP"
department: it
category: SOP
owner: "Seif Farid"
last_updated: 2026-09-04
order: 4
---

## What this tool is

The SA Agent Builder is a no-code, Claude-powered tool for creating conversational "Knowledge agents" — standing chat assistants grounded in a topic-specific knowledge base, with a shareable link anyone can use.

A Knowledge agent is not a scripted flowchart. There's no step-graph or decision tree to wire up — you describe what the agent should know and do, and it works from that directly, in one of two modes (often blended):

- **Reference / Q&A mode** — the agent answers questions strictly from what you gave it (docs, FAQs, troubleshooting steps). If something isn't covered, it says so rather than guessing.
- **Process mode** — the agent walks a person through an ordered sequence to produce something (a job description, an intake form, a checklist result), confirming with the user at each stage before moving to the next rather than dumping everything at once.

Once built, an agent can be saved, which gives it a permanent id and a published link (`/agent/<id>`) — a read-only chat page anyone can open and talk to. Editing a saved agent and clicking Publish changes updates that same link in place.

There is currently no login system — anyone with access to the builder can see and edit every saved agent, and there's no per-agent access control. Treat it as an internal tool for now.

## Who this is for

Anyone at Scale Army building a Q&A or process-walkthrough chat assistant for internal or external use — no engineering background required.

## How to use it

### Creating a new agent

1. Open the app. The landing screen shows **New knowledge agent** plus a list of **Your saved agents** (if any exist).
2. Click **New knowledge agent**.
3. Either:
   - Click **✨ Generate with AI** and describe what you want in plain language. Claude will restate its understanding, ask clarifying questions (what facts it should know, what the process looks like, what the output should be), and fill in the fields below for you to review — or
   - Fill in the fields yourself directly.

### The fields

| Field | Purpose |
|---|---|
| **Topic / name** | A short label for the agent. |
| **Knowledge base** | Reference facts to answer questions from, and/or background context for a process (the process itself goes in Steps, not here). |
| **Steps** (optional) | The ordered stages of a process, written as a plain numbered list. When filled in, the agent treats each stage as a checkpoint — it works through them one at a time and confirms with the user before advancing, instead of free-running to a final answer. |
| **Extra instructions** (optional) | Short behavioral rules — tone, escalation rules, formatting preferences. |
| **Tone reference** (optional) | A pasted sample of copy in the voice you want. The agent mimics the style, without treating it as a source of facts. |
| **Resources** (optional) | Live-fetched links, one per line: a regular Google Doc/Sheet (needs to be shared with the service account first), or a published ("Publish to web") Google Sheet, which needs no sharing at all since it's already public. Fetched fresh on every message. |

Every field except Resources also has a **📎 Upload .md/.json files** button — instead of pasting, upload one or more `.md`/`.json` files and their content is appended directly into that field. Only those two formats are accepted (see Appendix: Why .md/.json only below) — anything else is rejected with an inline message.

### Testing

The right-hand pane is a live test chat, grounded in whatever the fields currently say. It requires at least a Knowledge base to be filled in. Edits to any field take effect on the next message you send.

### Saving and publishing

- Click **Save** (only enabled once Topic is filled in) to persist the agent for the first time. You'll get a published link shown right below the button — copy it or click **Open ↗**.
- To edit an existing saved agent: from the landing screen, click it under **Your saved agents**. It reopens in the same setup pane, pre-filled, with **Publish changes** in place of **Save**.
- Editing fields and clicking **Publish changes** updates the same link in place — anyone who already has it sees the new content on their next message. There's no separate draft state: the public page always reflects whatever was last published.

### The published link

Anyone with `/agent/<id>` gets a read-only chat page — no setup fields, just the same conversation experience as the test chat. This is what you'd hand to end users or drop into Slack/a wiki/etc.

## How It Was Built

### Stack

- Next.js 15 (App Router) + TypeScript, deployed on Vercel.
- Claude (Anthropic API) powers everything model-side: the conversational setup assistant, the actual agent chat, and (in the earlier step-graph builder, still in the codebase but no longer linked from the landing screen) agent generation and text refinement.
- Upstash Redis (via Vercel's Storage tab — the same product formerly branded "Vercel KV") for persistence.
- Google Docs/Sheets API (service account) for the Resources feature's authenticated link type.

### Core architectural decision: no RAG, no embeddings

This is deliberate, not a missing feature. The Knowledge agent doesn't do vector search or retrieval — it works by putting the entire knowledge base (pasted text, uploaded files, fetched Resources) into Claude's system prompt on every single message. There's no server-side session; each turn resends the full conversation history plus the full current field contents.

This works well and stays cheap as long as the total knowledge base content is a reasonable size (see Troubleshooting below for when this stops being true). If/when a single agent's source material grows very large, the two upgrade paths — in order of preference — are:

1. **Agentic routing**: index the available sections/pages by title, have Claude pick the relevant one(s) for a given question, then fetch just those into context. No new infrastructure needed.
2. **Embeddings/vector search** (e.g. Voyage AI) — only worth it once you're dealing with a large, continuously-growing corpus where even routing over section titles gets unwieldy.

Prompt caching (Claude API feature — not yet implemented here) is a real lever for keeping the current long-context approach cheap even as usage grows: it lets a large, unchanging knowledge base be cached server-side so repeat messages against it are billed at a steep discount instead of full price. Worth revisiting before jumping to embeddings if cost becomes the concern rather than context-window size.

### Key files

| File | Role |
|---|---|
| `src/knowledgeAgent.ts` | Core chat logic — builds the system prompt from all fields, calls Claude, returns the reply. |
| `src/knowledgeAgentWizard.ts` | The "Generate with AI" setup assistant — a separate conversational Claude flow that proposes/revises the four core fields. |
| `src/tools/googleResources.ts` | Fetches Resources links — Google Docs/Sheets via the service account, or published Sheets via plain public HTTP (no auth). |
| `src/agentStore.ts` | Redis-backed persistence (create/update/get/list). |
| `app/page.tsx` | The whole builder UI (large single-page component) — setup pane, test chat, save/publish, saved-agents dashboard. |
| `app/agent/[id]/page.tsx` | The public, read-only published-agent chat page. |
| `app/api/knowledge-chat/route.ts` | API route the test chat and published page both call. |
| `app/api/knowledge-wizard/route.ts` | API route for the "Generate with AI" setup assistant. |
| `app/api/agents/route.ts`, `app/api/agents/[id]/route.ts` | Save/list/update/fetch a saved agent. |

### Historical note

The app originally had a much bigger surface: a manual node-graph canvas builder and a conversational "Create with AI" wizard that built step-graphs (branching logic, tool calls to Google Sheets, human-in-the-loop confirmation steps). Per a later business decision, the product focus narrowed to the Knowledge agent alone — simpler, no-code, "just describe it." That older code (`app/page.tsx`'s `wizard`/`manual` modes, the node components, `src/engine.ts`) is untouched and still compiles, just no longer reachable from the landing screen.

### Extended-thinking gotcha (important for anyone touching model calls)

Extended thinking is on by default for current Claude models and can silently consume the entire `max_tokens` budget on internal reasoning before producing any visible output — causing empty or truncated responses with no obvious error. Every `anthropic.messages.create()` call site in this codebase explicitly passes `thinking: { type: "disabled" }` to avoid this. If you add a new call site, carry this forward.

## Troubleshooting guide

| Symptom | Likely cause | Fix |
|---|---|---|
| Clicking **Save**/**Publish changes** shows "Agent storage isn't configured" | No Redis database connected on Vercel, or missing env vars locally | On Vercel: project → Storage tab → connect a Redis database ("Upstash for Redis"). Locally: set `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` (or the `KV_REST_API_*` equivalents) in `.env`. |
| A published link (`/agent/<id>`) shows "Agent not found" | The id was never saved, was deleted, or the Redis database was swapped/reset (e.g. reconnected to a different Upstash instance) | Re-save the agent from the builder to get a fresh link; make sure you're not pointing at a leftover link from before a database change. |
| Resources field: "Can't access this — make sure it's shared with the service account's email" | The Doc/Sheet wasn't shared with the service account's `client_email`, or the Docs/Sheets API isn't enabled in the Google Cloud project | Share the file with the service account email (Viewer access is enough), and confirm both the Google Docs API and Google Sheets API are enabled in that Cloud project. |
| A pasted Google Sheets link gets "Couldn't fetch this link... make sure it's actually published" | The link is a regular share link, not a published one — published links have a different URL shape (`/spreadsheets/d/e/...`) | In Sheets: File → Share → **Publish to web**, and paste the link it gives you (not the regular "Share" link). |
| Only Google Docs/Sheets links work in Resources, nothing else | By design — that field is scoped to Google Docs/Sheets (regular or published) only, not arbitrary URLs | Not a bug. For other content, paste it directly into Knowledge base, or upload it as a `.md`/`.json` file. |
| File upload rejected with "only .md and .json files are supported" | Working as intended — see Appendix: Why .md/.json only below | Convert/save the source as `.md` or `.json` before uploading, or just paste the text directly into the field instead. |
| Agent doesn't confirm before finishing / dumps the whole answer at once | The Steps field is empty | Add a numbered Steps list — the confirm-before-advancing behavior is driven entirely by that field being populated. |
| Chat reply is empty, "(no response)", or clearly truncated mid-thought | Almost always the extended-thinking pitfall (see How It Was Built above) if a code change removed the `thinking: {type: "disabled"}` param, or the model genuinely hit `max_tokens` on a very long knowledge base + conversation | Check the relevant `anthropic.messages.create()` call still disables thinking. If the knowledge base is very large, see the "getting expensive/slow" row below. |
| Changes to env vars on Vercel don't seem to take effect | Vercel doesn't hot-reload env vars into a running deployment | Redeploy after adding/changing any environment variable. |
| Nothing works locally (`npm run dev`) | Missing or incomplete `.env` | `cp .env.example .env` and fill in `ANTHROPIC_API_KEY` at minimum; Google/Redis vars are only needed for those specific features. |
| Build fails right before shipping | Usually a TypeScript error or an unused/missing import introduced by a recent edit | Run `npm run typecheck && npm run build` locally — both must pass clean before pushing. |
| A saved agent's answers seem to be getting expensive / slow as its knowledge base grows | Every message resends the entire knowledge base + resources content (no retrieval) — this is fine at small-to-medium scale but the cost/latency climbs with corpus size | See How It Was Built's upgrade path (agentic routing, then embeddings) and consider prompt caching first if the corpus fits comfortably in context but cost is the concern. |

### Common things that break, at a glance

1. Forgetting to share a Google Doc/Sheet with the service account — the single most common Resources failure.
2. Pasting a regular Sheets share link where a published link was needed (or vice versa).
3. Uploading a file type other than `.md`/`.json` — intentional friction, not a bug.
4. Env vars changed but not redeployed on Vercel.
5. A future code change accidentally re-enabling default (non-disabled) extended thinking on a new model call — silently truncates responses.

## Appendix: Why .md/.json only for uploads

Per direction from the business side: `.md` and `.json` are plain text with essentially zero formatting overhead, so they're far cheaper to process (fewer tokens, no markup to strip) than a pasted PDF/DOCX export or raw HTML dump would be. The upload feature is intentionally restricted to these two formats to keep the "stuff the whole knowledge base into every message" architecture (see How It Was Built above) cost-efficient as agents' source material grows.
