---
title: "Client Job Openings Monitor SOP"
department: it
category: SOP
owner: "Scale Army Engineering"
last_updated: 2026-09-04
order: 7
---

## Goal

Explain what the Client Job Openings Monitor is, how its data pipeline and caching work, how to read the dashboard, and how to troubleshoot it when the data looks stale, missing, or the Slack digest doesn't post.

## Who this is for

Account executives, account managers, and anyone tracking which existing or prospective clients are actively hiring, to spot upsell/expansion opportunities or new sourcing conversations.

## Other Link

Deployed on Vercel at `scale-army-jobs-pox9.vercel.app` (not part of this handbook's own codebase). Ask IT for the current GitHub repo link if you need direct access.

## What this tool is

The Client Job Openings Monitor watches a list of Scale Army's clients (pulled from a shared Google Sheet) and reports every open role each one is currently hiring for, pulled from Apollo's job postings data. It's read-only reporting — it doesn't source, contact, or act on anything itself, it just surfaces who's hiring and for what, so the team can act on it.

It also posts an automated digest to Slack listing which clients have posted new roles recently, so the team doesn't have to check the dashboard manually.

## How it works

### Client list

The list of companies to monitor lives in a published (public, read-only) Google Sheet, not in code. `lib/clients.js` fetches it as CSV on every refresh. Expected columns, in order: company name, domain, LinkedIn URL, and an optional careers page URL. Adding, removing, or renaming a client is a spreadsheet edit — no code change or redeploy needed.

### Where job postings come from

Two sources are combined per client:
- **Apollo** (`lib/apollo-jobs.js`) — looks up the client's Apollo organization ID from their domain, then pulls that organization's job postings. This is the primary, reliable source and works the same whether the tool runs locally or on Vercel.
- **Career page scraping** (`lib/scraper-jobs.js`) — a Playwright-based scraper that tries the client's careers page directly. **This only runs when the app is running outside Vercel** (local/self-hosted) — on Vercel serverless it returns nothing immediately, by design, since Playwright isn't available there. In production, Apollo is the only real source of job data.

Jobs from both sources are deduplicated by title (case-insensitive), preferring the Apollo version of a duplicate, then sorted newest-first and given a human-readable "posted X days/weeks ago" label.

### Caching — why the dashboard usually loads instantly

Fetching every client's jobs live (Apollo call + scrape attempt per client, roughly one every 300ms to avoid hammering Apollo) is slow — the loading screen even warns it can take 30-60 seconds. To avoid running that on every page visit, results are cached in three layers, read in this order:
1. **In-memory cache** on the serverless function instance (fastest, but doesn't survive a cold start or a different instance handling the request).
2. **Redis cache** (Upstash, 16-day TTL) — survives across serverless instances and deploys. This is what makes the dashboard load instantly for most visits.
3. **Live fetch** — only runs if neither cache has data, or if the user explicitly clicks **Refresh now** (which warns it'll use Apollo credits before proceeding).

### The scheduled jobs

Two Vercel Cron jobs run on the 1st and 15th of each month (`vercel.json`):
- **7am** — hits `/api/jobs-data?refresh=true`, forcing a full live fetch and re-warming both cache layers.
- **12pm** (same days) — hits `/api/slack-digest`, which reads whatever is in the Redis cache (it does not trigger its own live fetch) and posts a Slack message listing every client with a role posted in the last 15 days, or a "no openings" message if none.

Because the digest reads the cache rather than fetching live, the 7am job running first each of those days is what makes the digest reflect fresh data — if the 7am job fails, the digest still runs at noon, just against whatever was cached before.

## Checklist: reading the dashboard

1. Open the tool — it loads the cached data by default (look for "Cached · last fetched [time]" vs. "Live · fetched [time]" in the header to know which you're looking at).
2. Use the three tabs to narrow scope: **All Companies** (everyone monitored), **Recent Openings** (posted in the last 15 days), **Found Today**.
3. Use the search box to filter by job title, location, or client name across whichever tab is active.
4. Click a client's row to expand/collapse its individual job listings.
5. Click **Refresh now** only when you specifically need live data right now — it confirms first, since it consumes Apollo credits and takes up to a minute.

## Checklist: adding or removing a monitored client

1. Open the Google Sheet backing this tool (ask IT for the link if you don't have it).
2. Add a row with the company name, domain, LinkedIn URL, and (optionally) a careers page URL — or remove a row to stop monitoring that client.
3. Save the sheet. No redeploy needed.
4. The change appears on the next cache refresh (next scheduled cron run, or click **Refresh now** to see it immediately).

## Troubleshooting Guide

### The dashboard shows old/stale-looking data

**Cause:** This is expected most of the time — the dashboard reads a cache that's refreshed by the scheduled 1st/15th-of-month cron, not on every visit. The header tells you whether you're looking at cached or live data.

**Fix:** If you need current data now, click **Refresh now** (confirms first — it uses Apollo credits and takes 30-60 seconds). If the cron job itself seems to have stopped running, check Vercel → Project → Cron Jobs for its recent run history and errors.

### A client shows 0 jobs but you know they're hiring

**Cause:** Most likely Apollo simply doesn't have that job posting indexed yet, or the client's Apollo organization couldn't be matched from their domain (e.g. the domain in the sheet doesn't exactly match what Apollo has on file). Career-page scraping does **not** run in production at all — don't expect it to fill this gap on the live site.

**Fix:** Double-check the domain in the Google Sheet matches the client's actual primary domain. If it's correct and Apollo still shows nothing, this is an Apollo data-coverage gap, not a bug in the tool.

### Slack digest didn't post, or posted "no openings" when there clearly are some

**Cause:** Either `SLACK_WEBHOOK_URL` isn't set (the endpoint returns an error rather than posting), or the Redis cache was empty/stale when the digest ran (it reads the cache only — it never does its own live fetch).

**Fix:** Confirm `SLACK_WEBHOOK_URL` is set in Vercel. Manually hit `/api/jobs-data?refresh=true` to warm the cache, then re-trigger `/api/slack-digest` (or wait for the next scheduled run) — it needs the cache populated first, per the "no cached jobs data available" error it returns otherwise.

### "GOOGLE_SHEET_URL not set" or the client list is empty

**Cause:** The environment variable pointing at the published Google Sheet CSV is missing, or the sheet's publish link changed.

**Fix:** Confirm `GOOGLE_SHEET_URL` is set in Vercel → Project Settings → Environment Variables. If the sheet was re-published (File → Share → Publish to web), the URL changes — update the env var and redeploy.

### "Refresh now" seems to hang or times out

**Cause:** A full live refresh fetches every monitored client sequentially with a small delay between each to avoid overloading Apollo — with a large client list this can legitimately take close to a minute, matching the warning shown before you confirm.

**Fix:** Wait it out first. If it consistently fails rather than just being slow, check Vercel function logs for the actual error (likely an Apollo rate limit or a single client's fetch throwing and needing a fix in `fetchLive()`'s per-client try/catch).

### Redis/cache errors in the logs, but the dashboard still loads

**Cause:** By design, a Redis read/write failure is caught and swallowed rather than breaking the request — the tool falls back to a live fetch if there's no valid cache. This is intentional resilience, not usually something to chase down urgently.

**Fix:** If it's happening on every request, confirm `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` (or the Vercel-managed `KV_REST_API_URL` / `KV_REST_API_TOKEN` equivalents) are still valid and the Redis instance hasn't been disconnected or reset.

## Who has contributed to this

Scale Army Engineering.

## When was this last updated

2026-09-04.
