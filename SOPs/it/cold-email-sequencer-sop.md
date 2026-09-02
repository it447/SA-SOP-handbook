---
title: "Cold Email Sequencer SOP"
department: it
category: SOP
owner: "Scale Army Eng"
last_updated: 2026-09-02
order: 3
---

## Overview

The Cold Email Sequencer is Scale Army's in-house replacement for Instantly. Same job — sequence cold outreach, rotate it across mailboxes, watch for replies and bounces — built to run on infrastructure the team already pays for, so the ~$100/month Instantly subscription goes away.

Stack: Python, Vercel serverless, Upstash Redis, vanilla HTML/CSS/JS, Gmail API. Repo: `it447/SAInstantly`.

Leads get sourced from ZoomInfo, uploaded into a HubSpot list, and this tool watches that list. Every new member gets auto-enrolled into whichever sequence the list is mapped to, and from there the tool takes over: it writes the first email within about half an hour of enrollment, spaces later steps through an 8am–6pm ET sending window, rotates sends across whichever Gmail mailboxes are connected, and stops a contact's sequence the moment they reply, bounce, or ask to be left alone.

Five moving parts do all of the actual work:

| Part | What it does |
|---|---|
| **Accounts** | Gmail mailboxes connected via OAuth — the things mail actually sends from, each with its own daily cap, warm-up ramp, signature, and health score. |
| **Sequences** | The multi-step email templates, with merge tags pulled from HubSpot and a per-step delay. What a contact is actually enrolled *into*. |
| **HubSpot sync** | The list → sequence mapping. A cron job checks each mapped list every 15 minutes for members it hasn't seen yet. |
| **Suppression list** | The permanent, cross-sequence do-not-contact list. A bounce or opt-out here blocks re-enrollment everywhere, forever. |
| **Cron jobs** | Four scheduled jobs are the entire "engine" — nothing in this tool runs continuously; it all wakes up on a timer. |

Not the same thing as Instantly's warm-up: this tool ramps a new mailbox's daily send limit gradually (a rate limiter), and separately measures real inbox-vs-spam placement using dedicated seed accounts. Neither one generates artificial engagement traffic the way a commercial warm-up network does — see How It Was Built below for why that was a deliberate choice.

## Who this is for

IT / Ops and anyone running outbound email campaigns through this tool instead of Instantly.

## How It Was Built

Specifics, because "a Python app on Vercel" undersells how deliberately narrow the stack is. Every choice below was made to keep this a tool one team can run without a subscription, a server to patch, or a database to back up.

### One entrypoint, one dispatch table

Vercel's Python runtime recognizes exactly one exported `handler` per project — it errors out the moment it finds a second one. So the entire backend, every route from the dashboard's stats endpoint to the Gmail OAuth callback, is served from a single file, `api/index.py`, which holds a plain dict keyed by `(method, path)` mapping to a view function. `pyproject.toml` pins that file as the entrypoint (`[tool.vercel] entrypoint = "api.index:handler"`) and the app declares exactly three dependencies — `upstash-redis`, `requests`, `dnspython`. No web framework, no ORM, no build step.

### Redis is the only database

There is no SQL anywhere in this stack. Upstash Redis, reached only over its REST API (never a raw socket — a serverless function can't hold one open between invocations), is where every sequence, account, enrollment, and log line lives, as a hash, list, set, or sorted set. A contact's record is never hard-deleted; enrollments are marked `completed`, `replied`, `bounced`, `unsubscribed`, or `failed` and kept.

### Mail goes out through Gmail, not SMTP

Each connected account sends via the Gmail API's `messages.send`, authenticated with that mailbox's own OAuth2 token. There is no SMTP relay and no dedicated sending IP this app manages — mail is physically routed through Google's own infrastructure, which is exactly why sender authentication (SPF/DKIM/DMARC) is a Google Workspace + DNS problem for each sending domain's admin, not something this codebase configures.

### No workers, no queues — just cron

Nothing in this tool runs continuously. Vercel Cron hits four plain HTTP endpoints on fixed schedules; each one authenticates the request by comparing its `Authorization: Bearer` header against `CRON_SECRET`, does one bounded pass of work, and returns. See the schedule table in Architecture Reference below.

### No framework on the frontend either

The UI is plain `.html` files under `public/`, one shared `css/style.css` carrying Scale Army's design system, and one shared `js/api.js` — a thin `fetch()` wrapper that attaches the session token to every call and renders the sidebar every page shares.

### Login went through one real redesign

The first version used a single password shared by everyone, compared directly against an environment variable on every request — workable for one person, wrong for a team. It was replaced with Google OAuth: signing in redirects to Google, and the callback rejects any email outside `ALLOWED_LOGIN_DOMAINS` before a session is ever created, regardless of which account Google's picker offered. Sessions are opaque tokens in Redis with a 30-day TTL, sent in the same header the old password used, so nothing downstream had to change.

### Shipped feature by feature

Built as a series of scoped pull requests against `it447/SAInstantly` on GitHub — accounts and OAuth first, then the sequence builder and HubSpot sync, then sending and reply/bounce detection, then the deliverability layer (domain auth checks, blocklist monitoring, warm-up ramping, the health score), then the suppression list and per-account signatures for compliance, then Gmail seed-based placement testing, mobile layout, and finally the Google-login rework. Each PR merged into `main` only once its specific slice worked end to end.

## Architecture Reference

### File layout

```
api/
  index.py            single entrypoint — the (method, path) → view dispatch table
  _lib/
    redis_client.py    Upstash Redis REST client
    auth.py            session create/verify, allowed-login-domain check
    gmail.py           Google OAuth exchange + Gmail send/read calls
    hubspot_client.py  HubSpot API calls
    models.py          every Redis read/write in the app
    deliverability.py  SPF/DKIM/DMARC + blocklist checks, health-score math
    utils.py           merge-tag rendering, send-window scheduling, domain helpers
  _views/
    auth.py            Google login / callback / logout / status
    accounts.py        Gmail OAuth connect/callback, account + signature management
    sequences.py       sequence CRUD, activity logs, replies
    hubspot.py         list ↔ sequence mapping
    cron.py            send, poll_replies, hubspot_sync, placement_check
    dashboard.py       stats endpoint
    suppression.py     do-not-contact list + audit log
public/
  *.html, css/style.css, js/api.js   no build step — served as-is
```

### Scheduled jobs

| Job | Path | Schedule | Does |
|---|---|---|---|
| Send | `/api/cron/send` | `*/15 * * * *` | Sends whatever in the queue is due, up to 20 emails per tick, respecting the daily cap and each account's ramped limit. |
| Reply/bounce poll | `/api/cron/poll_replies` | `*/30 * * * *` | Scans each connected inbox for replies and bounce-shaped messages; stops matching contacts' sequences. |
| HubSpot sync | `/api/cron/hubspot_sync` | `*/15 * * * *` | Checks every mapped HubSpot list for members not yet seen, and enrolls them. |
| Placement check | `/api/cron/placement_check` | `0 14 * * *` | Reads yesterday's seed-account test batch for inbox/spam placement, then sends today's batch. |

Sub-daily cron schedules need a Vercel Pro plan. On Hobby, these same four paths have to be hit by an external scheduler (e.g. cron-job.org) sending `Authorization: Bearer $CRON_SECRET` — see Troubleshooting below if sends or syncs look stalled.

### Redis keys you'll actually run into

| Key | Type | Holds |
|---|---|---|
| `session:{token}` | string | An app login session — `{email, created_at}`, 30-day TTL. |
| `accounts` | hash | Every connected mailbox, keyed by account ID. `role` is `sending` or `seed`. |
| `sequences` | hash | Every sequence, keyed by ID. Never deleted — only `archived: true`. |
| `queue:pending` | zset | `sequence_id\|email → next_send_at`. What the send cron actually reads. |
| `suppression_list` | hash | The global do-not-contact list, checked before every enrollment. |
| `enrollments:{email}` | string | One contact's status, step, and thread info for their current sequence. |

Full key reference in the Appendix below.

### Health score, exactly

Each connected sending account gets a 0–100 score. It's a straight sum — nothing weighted by guesswork, every point traceable to a real check:

| Factor | Full credit | Partial | Zero |
|---|---|---|---|
| SPF | 10 — record found | — | 0 — missing |
| DKIM | 10 — `google` selector found | — | 0 — not confirmed (may just be a custom selector) |
| DMARC | 10 — record found | — | 0 — missing |
| Domain blocklist | 15 — clean on SURBL/URIBL | — | 0 — listed |
| Bounce rate | 20 — under 2%, or no data yet | 10 — 2–5% | 0 — over 5% |
| Warm-up | 5 — fully ramped | 3 — still ramping | — |
| Inbox placement | 30 — 95%+ landing in inbox, or no data yet | 15 — 80–95% | 0 — under 80% |

Placement carries the heaviest single weight on purpose — it's the only factor sourced from a real delivery outcome rather than a configuration check. Seed accounts (`role: "seed"`) don't get a score at all.

## Day-to-Day Operations

The procedures a person actually runs, in the order you'd normally hit them setting up or maintaining a campaign.

### Sign in

1. Open the login page and click **Sign in with Google**. There's no password to remember anymore.
2. Use your `@scalearmy.com` account. Anything outside the allowed domain is rejected after you pick an account, with an on-screen explanation — not a silent failure.

### Connect a sending mailbox

1. **Accounts → + Connect Gmail account.** Authorize the Google prompt. The mailbox lands in the Accounts table at a ramped daily limit, not full volume — that's intentional (see Warm-up above).
2. **Set a signature.** Click **Set signature** on that row and add a real sign-off plus the company's physical postal address — CAN-SPAM requires it on every commercial email, and it's appended automatically from here on.
3. **Set a daily limit.** Edit the number directly in the Daily limit column. The account still ramps up to it gradually rather than sending that volume immediately.

### Connect a seed account (placement testing)

1. Use a genuinely unrelated Gmail address — not a work account, not one that's ever emailed a sending mailbox before. Prior relationship history is exactly what would make the test meaningless.
2. **Accounts → Seed accounts → + Connect seed account.** Same OAuth flow, tagged with a different role. It will never send anything and should never be opened or replied to by hand.

### Build a sequence

1. **Sequences → + New sequence.** Name it, add steps with a subject/body and a delay in days since the previous step.
2. **Insert merge tags.** "Insert merge tag" searches real HubSpot contact properties. Optionally fill "Fallback text if empty" first to get `{{firstname|there}}` instead of a blank when that property is missing.
3. **Restrict senders (optional).** Check specific accounts in the Sending accounts list to scope this sequence to only those mailboxes; leave all unchecked to rotate across every connected one.

### Connect a HubSpot list

1. **HubSpot → pick a list and a sequence.** New members get auto-enrolled on the next `hubspot_sync` tick (every 15 minutes) — no manual export/import step.

### Monitor account health

1. **Accounts → click a health score.** Expands the exact factors behind that number. "Recheck health" forces a fresh domain check instead of the 24-hour cache.
2. **Watch domain reputation separately.** The Domain reputation card below the table checks SURBL/URIBL specifically — a domain can be blocklisted independently of its own health score.

### Manage the suppression list

1. **Suppression → Add manually.** For a phone request or legal ask that didn't come through as an email reply or bounce.
2. **Remove, if it was added in error.** The audit log keeps the original add event even after a removal, so the history survives.

## Troubleshooting

Ordered by how likely you are to hit them, not alphabetically. Each entry names the actual cause, not just "check your config."

### CRITICAL — The app shows the dashboard straight away, no login prompt at all, for anyone

**Cause:** The `DISABLE_AUTH` environment variable is set to `true`. It's a debugging escape hatch that skips every auth check — anyone with the URL sees everything, Google login included.

**Fix:**
1. Vercel → Project → Settings → Environment Variables — find `DISABLE_AUTH`.
2. Delete it, or set it to `false`.
3. Redeploy. Confirm in an incognito window (no cached `localStorage`) that the login page appears.

### CRITICAL — Google sign-in fails with `redirect_uri_mismatch`

**Cause:** Login uses its own redirect URI, separate from the one Gmail account-connect uses — `GOOGLE_LOGIN_REDIRECT_URI` doesn't exactly match an Authorized redirect URI on the OAuth client (protocol, trailing slash, and path all have to match exactly).

**Fix:**
1. Google Cloud Console → Credentials → the OAuth client → Authorized redirect URIs.
2. Confirm `https://<deployment>/api/auth/google_callback` is listed *in addition to* the existing `/api/accounts/callback` one.
3. Confirm `GOOGLE_LOGIN_REDIRECT_URI` in Vercel is character-for-character the same string.

### WARNING — A real `@scalearmy.com` teammate can't log in ("Only Scale Army Google accounts can access this tool")

**Cause:** Either their email genuinely isn't on an `ALLOWED_LOGIN_DOMAINS` domain (check for typos or a missing subdomain), or the OAuth consent screen is still in "Testing" status and they haven't been added as a test user — Google blocks the sign-in before this app's own domain check ever runs.

**Fix:**
1. Check `ALLOWED_LOGIN_DOMAINS` in Vercel matches their email's domain.
2. Google Cloud Console → OAuth consent screen → Test users — add them if the app isn't published.

### WARNING — Connecting a Gmail account fails with `no_refresh_token`

**Cause:** Google only issues a refresh token on the *first* consent for that app. If this app was previously authorized and then removed from that Google account's third-party access list, the next attempt returns an access token with no refresh token.

**Fix:**
1. In the Google account being connected, go to Security → Third-party access and fully remove this app if it's listed.
2. Try "Connect Gmail account" again — the forced consent screen will issue a fresh refresh token.

### WARNING — Sequences are active but nothing is actually sending

**Cause:** Usually one of: the Vercel plan is Hobby and no external scheduler is hitting `/api/cron/send`; the global `DAILY_SEND_CAP` or an account's ramped daily limit is already used up for the day; every connected account on that sequence is disconnected; or the contact is on the suppression list and was silently skipped.

**Fix:**
1. Confirm the cron is actually firing — on Hobby, check the external scheduler's own run history.
2. Accounts page — check "Sent today" against "Daily limit" for every account this sequence can use.
3. Suppression page — search the contact's email; an unexpected match explains a silent skip.

### WARNING — A HubSpot contact never got enrolled

**Cause:** Either `HUBSPOT_API_KEY` is missing or lacks the `contacts` scope, the list ↔ sequence mapping doesn't include that list, or the contact was already marked "seen" for that list from a prior sync and won't be re-scanned.

**Fix:**
1. HubSpot page — confirm the list shows up and is mapped to the right sequence.
2. Confirm the private app behind `HUBSPOT_API_KEY` still has the `contacts` scope.
3. If the contact was removed and re-added to the list, that alone won't re-trigger — they need to actually be new to that list's dedup set.

### COSMETIC — A sent email shows the literal text `{{firstname}}` instead of a name

**Cause:** The tag's property name doesn't exactly match a real HubSpot internal property name (case-sensitive), or the contact's value for that property is genuinely blank and there's no fallback set.

**Fix:**
1. Re-insert the tag through "Insert merge tag" rather than typing it by hand, so the name is guaranteed correct.
2. Add a fallback — change it to `{{firstname|there}}` so a blank property renders text instead of nothing.

### COSMETIC — An account's placement factor stays "not enough data" indefinitely

**Cause:** It needs at least 3 recorded placement checks (one per connected seed account per day) before it's judged — with a single seed account connected, that's 3 days minimum.

**Fix:**
1. Connect 2–3 more seed accounts to get 3 data points sooner.
2. Confirm `/api/cron/placement_check` is actually running daily — the same Hobby-plan cron caveat applies here.

### EXPECTED BEHAVIOR — The domain reputation check still shows "Listed" after fixing a blocklist entry

**Cause:** Blocklist results are cached for 24 hours per domain by design, to avoid hammering SURBL/URIBL on every page load.

**Fix:**
1. Accounts page → "Recheck" next to Domain reputation, which forces a live check instead of using the cache.

### EXPECTED BEHAVIOR — A reply or bounce took up to 30 minutes to register

**Cause:** `poll_replies` only runs every 30 minutes, and an ambiguous bounce (one that can't be confidently matched to an active enrollee) is skipped on purpose rather than guessed at.

**Fix:** Not a bug — the maximum lag between a reply landing and the sequence stopping is one poll cycle. If it never registers at all, confirm the contact is still in the `active_enrollments` set and that the mailbox's own inbox actually received the bounce.

### EXPECTED BEHAVIOR — A seed account got connected as a sending account (or vice versa)

**Cause:** The role is set once, at connect time, from which link was clicked — there's no toggle to change it afterward.

**Fix:**
1. Disconnect that account from the Accounts (or Seed accounts) table.
2. Reconnect it through the correct link — "+ Connect Gmail account" for a sender, "+ Connect seed account" for a seed.

## Appendix

### Environment variables

| Variable | Required | Purpose |
|---|---|---|
| `UPSTASH_REDIS_REST_URL` / `_TOKEN` | Yes | The only datastore. Falls back to `KV_REST_API_URL`/`_TOKEN` if Redis was connected via Vercel's Marketplace integration. |
| `GOOGLE_CLIENT_ID` / `_SECRET` | Yes | Shared by both OAuth flows (account-connect and login). |
| `GOOGLE_REDIRECT_URI` | Yes | Callback for connecting sending/seed Gmail accounts. |
| `GOOGLE_LOGIN_REDIRECT_URI` | Yes | Callback for signing into the app itself. |
| `ALLOWED_LOGIN_DOMAINS` | No | Comma-separated. Defaults to `scalearmy.com` even if unset. |
| `PROTECTED_DOMAINS` | No | Domains refused as a sending account. Also defaults to `scalearmy.com`. |
| `CRON_SECRET` | Yes | Bearer token every cron endpoint checks. |
| `HUBSPOT_API_KEY` | Yes | Private-app token, `contacts` scope. Never stored in Redis. |
| `DAILY_SEND_CAP` | No | Global sends/day across all accounts. Default 500. |
| `WARMUP_ENABLED` / `_START_LIMIT` / `_DAYS` | No | New-account ramp. Defaults: enabled, 10/day, 14 days. |
| `SEND_WINDOW_START_HOUR` / `_END_HOUR` / `SEND_TIMEZONE` | No | Defaults: 8, 18, `America/New_York`. |
| `DISABLE_AUTH` | No — debug only | Skips every auth check when `true`. Must never be set on a reachable deployment. |

### Full Redis key reference

| Key | Type | Holds |
|---|---|---|
| `session:{token}` | string | Login session, TTL 30 days. |
| `oauth:login_state:{state}` | string | CSRF state, app login, TTL 10 min. |
| `oauth:state:{state}` | string | CSRF state, account connect, TTL 10 min. |
| `sequences` | hash | Every sequence by ID. |
| `accounts` | hash | Every connected mailbox by ID, with `role`. |
| `enrollments:{email}` | string | One contact's current enrollment record. |
| `sent:{email}:{sequence_id}` | string | Dedup marker — never re-enroll the same pair. |
| `queue:pending` | zset | What the send cron reads, scored by `next_send_at`. |
| `active_enrollments` | set | Emails currently active, for the reply/bounce poll. |
| `sequence_contacts:{sequence_id}` | set | Every email ever enrolled in that sequence. |
| `bounce_seen:{account_id}` | set | Bounce message IDs already processed. |
| `suppression_list` | hash | Global do-not-contact list. |
| `logs:suppression` | list | Suppression add/remove audit trail, capped 1000. |
| `logs:{sequence_id}` | list | Per-sequence activity log, capped 1000. |
| `blocklist_check:{domain}` | string | Cached SURBL/URIBL result, TTL 24h. |
| `domain_auth_check:{domain}` | string | Cached SPF/DKIM/DMARC result, TTL 24h. |
| `hubspot:config` | string | List ↔ sequence mappings. |
| `hubspot:seen:{list_id}` | set | Contact IDs already scanned for that list. |
| `logs:placement:{account_id}` | list | Placement test results, capped 200. |
| `stats:*` | string | Dashboard + health-score counters (sends, replies, bounces, unsubscribes, placement). |
