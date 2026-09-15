---
title: "Deal Assistant (Sales Coach) SOP"
department: it
category: SOP
owner: "Scale Army Engineering"
last_updated: 2026-09-15
order: 9
---

## Goal

Explain what Deal Assistant (internally "SA Sales Coach") is, how it works during a live sales call, how call recording actually works (it replaces Fathom for this), how pricing/margin is calculated, and how to troubleshoot it when something isn't working.

## Who this is for

Account Executives and anyone else running sales calls on Google Meet. Also relevant to Scale Army Engineering for setup/maintenance.

## What this tool is

Deal Assistant is a Chrome extension that joins a rep's Google Meet sales calls and coaches them live: it reads Meet's live captions, detects the roles being discussed, flags scope creep or missing information, calculates margin/pricing in real time, suggests objection-handling responses, and — once a deal is priced — generates job descriptions. It's Scale Army's in-house replacement for paid tools like Gong/Fathom, built for internal use only.

It has two parts:
- **The Chrome extension** (`meet.google.com`) — reads captions, renders the coaching sidebar, controls call recording. Has no direct database or AI access of its own — everything goes through the backend.
- **The backend/dashboard** ("SA Sales Coach", a Next.js app on Vercel) — holds the database, calls Claude for extraction/coaching/JD generation, and has a `/dashboard` for reviewing past calls (transcript, summary, recording, generated JDs).

Invoicing/payment is explicitly out of scope for this tool — that happens elsewhere.

## First-time setup (each rep does this once)

1. Click the Deal Assistant icon in the Chrome toolbar.
2. Fill in:
   - **API base URL** — defaults to the production deployment; only change this if testing against a different one.
   - **API key** — the shared internal API key. Ask Scale Army Engineering/IT for it.
   - **Your email** — used to attribute sessions to you.
3. Click "Save Settings."

## Using it on a call

1. Join the Google Meet call and turn on **live captions** (the "CC" button in Meet's controls) — the sidebar can't read anything without them. Deal Assistant tries to turn captions on for you automatically, but this isn't guaranteed (see Troubleshooting).
2. Click the Deal Assistant icon → "Start Call." This creates a call session tied to that Meet link.
3. The coaching sidebar appears on the right side of the page and updates as the call goes: detected roles (editable), scope-creep/missing-info flags, objection-handling suggestions, and pricing once enough is scoped.
4. To start recording, toggle "Recording" **in the extension popup** — not the sidebar. This has to be done from the popup because Chrome only allows starting tab capture right after the popup opens (a security requirement, not a Deal Assistant limitation).

## How call recording actually works

This is the part that replaces Fathom, and it's worth understanding because there are genuinely **two independent recording mechanisms**:

1. **Tab capture recording (the one to actually use)** — toggled from the extension popup. Captures the current tab's audio/video directly, regardless of who organized the call or what Google Workspace recording policy applies. Uploads straight to a shared Google Drive folder via a dedicated service account (not your personal Google login), or falls back to a local Downloads file if the Drive upload can't be reached. The popup shows you which destination it'll use *before* you start recording, not just after.
2. **Google Meet's native recording** — the backend also tries to turn on Meet's own built-in recording automatically, right when your session is created (before you click "Join now") — but only if you've separately connected your Google account for this (see below), and only if you're the meeting's organizer. Google's API can report success here even when an org-level policy silently prevents anything from actually being recorded — so don't rely on this path alone. If it produces a real recording, it lands in your own personal Drive first; the dashboard's "Find recording" button copies it into the shared company Drive folder afterward.

**In practice: tab capture is the reliable path.** It works no matter who organized the call. Native Meet recording is a best-effort bonus on top, not something to depend on.

Connecting your Google account for the native-recording path (optional, separate from your Deal Assistant login) is a one-time OAuth flow — ask Engineering if this hasn't been set up for you and you want the native path as a backup.

## Roles, scope flags, and call phases

- **Roles** — each role being discussed gets scoped with title, seniority, region (Africa/LATAM/Both), must-haves/nice-to-haves, and (for technical roles) a "first task" and "success outcome" answer. A JD can't be generated for a technical role until both of those are answered.
- **Scope flags** — the sidebar flags things like multiple roles bundled together, a missing required field, a budget that doesn't clear margin thresholds, or missing tech-role answers. "Critical" flags (red) can only clear once the actual data is filled in — clicking "Resolve" doesn't make them go away on its own.
- **Call phases** — an informal checklist of whether a healthy discovery call has covered: agenda set, discovery, consultative diagnosis, process explained, pricing discussed, close attempted. Not a rigid script — judged on substance, any order.

## Pricing and margin

Uses the same underlying formula and commission tiers as the standalone Pricing & Commission Calculator (see [[pricing-commission-calculator-sop|Pricing & Commission Calculator SOP]]):

- `margin = (price − salary) / price`
- Hero (25%): margin ≥ 50%, or margin ≥ 40% and spread ≥ $1,000
- Safe-Strong (12%): margin ≥ 35% and spread ≥ $1,000
- Safe-Solid (10%): margin ≥ 40% and spread ≥ $600
- Acceptable (7%): margin ≥ 35%
- Below Standard (5%): anything else

Same four salary adjustments as the standalone calculator (English level +20%, Certain Industries +30%, Super Niche Tech +15%, Seniority/360 +30% — only the highest applies, never stacked).

The sidebar always shows the recommended price *and* the reference ladder (what price would hit Safe-Strong/Hero), plus — if the client stated a specific budget — what margin/tier that number would land at. If a role's title/seniority doesn't match anything in the pricing data, the sidebar tells you why instead of silently doing nothing, and Claude can suggest the closest real catalog title on demand (you have to confirm it — it's never applied automatically).

It also shows what a comparable USA hire would cost and the resulting client savings — but only once every scoped role has a confident match to a coarser USA benchmark role list, otherwise it shows nothing rather than a partial/misleading number.

Pricing only locks in once you explicitly click to lock the price with the client — that's also the gate for generating JDs afterward.

## Generating job descriptions

Once a deal's price is locked, "Generate JDs" drafts one job description per role in Scale Army's standard JD format/tone, using the role's scoped must-haves/nice-to-haves. Client company name is never included in a generated JD.

## Checklist

- [ ] Live captions are ON in Google Meet before starting the sidebar's extraction.
- [ ] Click "Start Call" from the extension popup to create the session.
- [ ] Toggle recording **from the popup**, not the sidebar, right after opening it.
- [ ] Confirm which recording destination the popup shows (Drive vs. local Downloads) before relying on it.
- [ ] Keep role scoping current — a missing region/seniority/title blocks that role from pricing.
- [ ] For technical roles, get a real first-task and success-outcome answer before expecting a JD.
- [ ] Lock the price only once it's actually agreed with the client — this gates JD generation.
- [ ] After the call, use the dashboard's "Find recording" (or paste a Drive link manually) if the recording isn't linked automatically.

## Troubleshooting Guide

### Always check this first when the sidebar isn't picking anything up: are live captions actually on?

**Cause:** the sidebar reads Google Meet's live captions via the page's accessibility markup — if captions are off, there's nothing for it to read. Deal Assistant tries to turn captions on automatically when you join, but this automation isn't guaranteed to work on every Meet UI version.

**Fix:** Manually click the "CC" button in Meet's own controls to confirm captions are on. If the sidebar still isn't updating after that, it's a deeper issue — flag it to Scale Army Engineering.

### The coaching sidebar doesn't appear at all

**Cause:** you're not on a `meet.google.com` call tab, no session was started for this call, or the extension's API key/settings aren't configured.

**Fix:** Confirm you clicked "Start Call" from the popup while on the actual Meet tab. Re-check your API base URL/API key/email in the extension settings.

### Recording toggle in the popup does nothing, or immediately fails

**Cause:** tab capture in Chrome can only be started right when the popup is freshly opened (a browser security requirement) — if you clicked something else first, or the popup lost focus, the start can fail. This is why recording has to be controlled from the popup and not the sidebar.

**Fix:** Close and reopen the popup, then toggle recording immediately.

### Recording shows as "saved" but nothing shows up in the shared Drive folder

**Cause:** the tabCapture recording falls back to a local Downloads file if it can't reach Drive (e.g. the shared Drive upload service is unreachable) — it doesn't block recording just because the Drive path failed.

**Fix:** Check your Downloads folder for a `.webm` file named after the meeting. If it's there, upload it to the shared Drive folder manually, then use the dashboard's "link a recording" field (paste the Drive link or file ID) to attach it to the session.

### The dashboard's "Find recording" button says no recording was found

**Cause:** Google Meet can take a while after a call ends to finish processing a native recording — or the rep never connected their Google account for the native-recording path, or the native recording silently didn't happen because of a Workspace policy restriction (see "How call recording actually works" above).

**Fix:** Wait a bit and try again. If it never finds one, check whether the tabCapture recording actually happened instead (see the two entries above) — tabCapture is the reliable path regardless of native recording's status.

### A generated JD looks off, or won't generate at all

**Cause:** JD generation is gated on the price being locked — it won't run before that. For a technical role, it's also gated on `firstTask`/`successOutcome` both being answered.

**Fix:** Confirm the price was actually locked (not just calculated) and, for technical roles, that both required answers were captured during the call. If those are set and it's still failing, flag it to Engineering.

### Pricing shows "no pricing data" for a role that should obviously have some

**Cause:** the role's title/seniority combination doesn't exactly match Scale Army's pricing catalog (e.g. client said "growth marketer" instead of the catalog's "Growth Marketing Manager").

**Fix:** Click "Calculate Price" again to trigger Claude's on-demand suggested-match check, and confirm the suggested catalog title if it looks right — it's never applied automatically, so nothing changes until you confirm it.

## Who has contributed to this

Scale Army Engineering.

## When was this last updated

2026-09-15
