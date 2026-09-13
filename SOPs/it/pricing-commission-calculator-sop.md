---
title: "Pricing & Commission Calculator SOP"
department: it
category: SOP
owner: "Scale Army Engineering"
last_updated: 2026-09-13
order: 8
---

## Goal

Explain what the Pricing & Commission Calculator is, how its pricing/commission logic works, where its underlying data actually lives, how to use each tab, and how to troubleshoot it when data looks wrong, stale, or missing — with the Google Sheet database link so people know where the numbers actually come from.

## Who this is for

Account Executives, Account Managers, and Scale Army Engineering. Any recruiter/AE/AM pricing a role or calculating commission on a closed deal.

## Other Link

Google Sheet database (the live source of truth this tool reads from): https://docs.google.com/spreadsheets/d/1WHT63FdnhZYwZNDpjfGq8LEksRVvYQlHMAGxFsUWSDM/edit?gid=948552353#gid=948552353

## What this tool is

The Pricing & Commission Calculator is an internal web app used to price new roles and calculate commission on closed deals. It has three tabs:

- **Role Search NTC** — look up the NTC (Net to Candidate) salary for any role, by region and seniority.
- **Pricing and Deal Health** — the AE-facing tab: pick a role, apply any salary adjustments, and see the recommended pricing tiers (Acceptable, Safe-Strong, Hero) plus a live deal-health read on a client quote.
- **AM Commission Calculator** — the AM-facing tab (only visible when logged in with AM credentials): enter the actual negotiated salary and client rate for a closed deal and get the commission tier, rate, and payout.

## Who has access

Login is gated by a simple username/password cookie, with two roles:

- **`am` role** — sees all three tabs, including AM Commission Calculator.
- **`public` role** — sees Role Search and Pricing/Deal Health only; the AM Commission Calculator tab is hidden entirely (not just disabled) unless logged in as `am`.

Credentials are set via Vercel environment variables (`AUTH_USERNAME`/`AUTH_PASSWORD` for the `am` role, `PUBLIC_USERNAME`/`PUBLIC_PASSWORD` for the `public` role) — the codebase ships with default fallback credentials if those aren't set, which should be rotated in production. Ask Scale Army Engineering for current credentials rather than assuming defaults are still active.

## Where the data actually lives

This is the most important thing to understand about this tool: **it has no real database of its own.** On every page load, the browser fetches data directly from two separate Google Apps Script webapps, each backed by a tab (or tabs) in the Google Sheet linked above:

- The **main pricing policies + commission tiers** dataset (role salary bands, GM floors, target prices) — fetched directly by the browser on load.
- The **Role Search NTC benchmark** dataset (LATAM/Africa/USA salary bands by role and seniority) — fetched separately, and also used by the "Save to Drive" snapshot feature (see below).

Both Apps Script webapps read live off the Google Sheet, so **editing the Sheet directly is how you update pricing data** — no code change or redeploy needed for a data update. What *does* need a code change: if the Sheet's column structure or tab names change in a way the Apps Script wasn't written to expect.

**There is also a bundled, static `data/policies.json` file and a `/api/policies` CRUD API route in this codebase.** As far as the app's actual UI is concerned, these are unused — the live pages fetch straight from the Google Sheet via Apps Script, not from this API. This looks like a leftover from an earlier version of the tool before the Google Sheet integration was added. Don't assume editing `data/policies.json` (or calling `/api/policies`) changes anything a user sees; treat the Google Sheet as the only real source of truth unless Engineering confirms otherwise.

## Pricing tier logic

Given a candidate salary and client rate: `spread = rate − salary`, `margin = spread ÷ rate`.

```
roundTo50(v) = ceil(v / 50) × 50

Acceptable min  = roundTo50(salary / 0.70)
Safe-Strong min = roundTo50(max(salary / 0.65, salary + 1000))
Hero min        = min(roundTo50(salary / 0.50), roundTo50(max(salary / 0.60, salary + 1000)))
Hero ideal       = Hero min + $1,000, rounded up to the nearest number ending in 900
```

Commission tiers (checked top to bottom, first match wins):

```
Hero          → margin ≥ 50%, OR margin ≥ 40% AND spread ≥ $1,000   (25% commission)
Safe-Strong   → margin ≥ 35% AND spread ≥ $1,000                     (12% commission)
Safe-Solid    → margin ≥ 40% AND spread ≥ $600                       (10% commission)
Acceptable    → margin ≥ 35%                                          (7% commission)
Below Standard → anything else                                       (5% commission)
```

If margin exceeds 50%, the tool shows a hard warning: "MARGIN EXCEEDS 50% CAP — DECREASE CLIENT FEE OR INCREASE CANDIDATE FEE TO STAY COMPETITIVE IN THE MARKET." 50% is the canonical maximum — a margin above that signals the client is being overcharged relative to market rates.

## Salary adjustments

Four toggles can bump the base salary before pricing tiers are calculated — **if more than one applies, only the single highest percentage is used, they never stack**:

| Adjustment | Amount | When to apply |
|---|---|---|
| English Level | +20% | Near-native or native English accent required |
| Certain Industries | +30% | SaaS/Tech, Fintech, Healthcare/Healthtech/Pharma |
| Super Niche Technologies | +15% | Specialized tools/technologies with limited talent supply |
| Seniority and 360 Responsibilities | +30% | Managerial roles, or roles with an unusually broad set of responsibilities |

## Region modes

The Pricing and Deal Health tab supports LATAM, Africa, or **Both**. In Both mode, the tool shows both regions' base salary, adjusted salary, and full set of pricing tiers side by side, so an AE can present the full range to a client with no regional preference. Deal-health evaluation (which tier a quote lands in) runs independently per region in this mode.

## Saving a snapshot

The "Save to Drive" button sends the current role, region, salary, adjustments, pricing tiers, and client quote to the benchmark Apps Script webapp (`action=snapshot`), which generates a Google Doc snapshot and returns a shareable link. Use this to attach a record of the pricing conditions at quote time to the deal in HubSpot/Ashby, the same way the JD Generator and Company Audit Tool attach their own outputs.

## Checklist

- [ ] Confirm you're logged in with the right role — AM Commission Calculator only appears for the `am` role.
- [ ] Role Search NTC: pick a role and seniority to see LATAM/Africa NTC salary side by side.
- [ ] Pricing and Deal Health: pick a role and region (or Both), apply any genuinely-applicable salary adjustment (never stack more than one), and read off Acceptable/Safe-Strong/Hero.
- [ ] Enter the client's quote to see live deal-health / tier classification against that quote.
- [ ] Save a snapshot to Drive and attach the link to the deal record before moving on.
- [ ] AM Commission Calculator: enter the actual negotiated salary and final client rate (not the policy estimate) to get the real commission tier and payout.
- [ ] If numbers look wrong, missing, or stuck on old data: check the Google Sheet linked above before assuming it's a code bug (see Troubleshooting).

## Troubleshooting Guide

### Data looks completely missing, or an error banner shows on load

**Cause:** the main pricing policies Apps Script webapp failed to respond or returned something the page couldn't parse.

**Fix:** Confirm the Google Sheet linked above is reachable and its Apps Script deployment is still active (Extensions → Apps Script → Deploy → Manage Deployments in the Sheet). Hard-refresh the page afterward.

### Role Search NTC shows old/generic-looking numbers that don't match the Sheet

**Cause:** the benchmark fetch failed silently and the tool fell back to a hardcoded snapshot of role data baked into the app's own code (`FALLBACK_ROLES`) — this is deliberate so the tab never shows a blank screen, but it means the numbers on screen can be stale if the live fetch is broken.

**Fix:** Check the benchmark Apps Script deployment the same way as above. If it's healthy, the tool will silently switch back to live data on the next successful fetch — no action needed beyond confirming the fetch itself works (check the browser console for a fetch error to the benchmark Apps Script URL).

### **Always check this first when something isn't showing up: did a tab name change in the Google Sheet?**

**Cause:** the Apps Script backing each dataset reads specific tab names and column positions from the Sheet. If someone renames a tab, reorders it, or restructures its columns, the Apps Script can start returning empty or malformed data without throwing an obvious error — the app just quietly shows nothing (or stale fallback data) instead.

**Fix:** Open the Google Sheet and confirm the tab names the Apps Script expects haven't changed. If a tab was renamed, either rename it back or update the Apps Script's reference to the new name (a code-level fix, not a Sheet-level one). Don't reorder or rename columns without checking whether the Apps Script reads them by position — same risk as renaming a tab.

### Pricing tiers or commission numbers look mathematically wrong

**Cause:** almost always a salary or client rate typo, or more than one salary adjustment toggle left on (remember: only the single highest applies, they don't stack — if the number looks like two adjustments were added together, that's a bug worth reporting, not expected behavior).

**Fix:** Re-check the input values and adjustment toggles. If the math still doesn't match the formulas above, that's a genuine code bug — flag it to Scale Army Engineering rather than trying to work around it.

### AM Commission Calculator tab isn't showing up at all

**Cause:** you're logged in with `public` role credentials, not `am` — this tab is fully hidden (not just disabled) for anyone without AM access.

**Fix:** Log out and log back in with AM credentials. If you believe you should have AM access and don't, ask Scale Army Engineering to confirm `AUTH_USERNAME`/`AUTH_PASSWORD` are set correctly and that you have the current credentials.

### "Save to Drive" fails or doesn't return a link

**Cause:** the benchmark Apps Script webapp (which also handles snapshot creation) is unreachable, or the underlying Google Doc/Drive folder it writes to has been moved, renamed, or had its permissions changed.

**Fix:** Retry once. If it keeps failing, check the benchmark Apps Script deployment status the same way as the data-loading issues above, and confirm the target Drive folder still exists and is shared correctly.

### Login isn't working with credentials that used to work

**Cause:** `AUTH_USERNAME`/`AUTH_PASSWORD`/`PUBLIC_USERNAME`/`PUBLIC_PASSWORD` were rotated in Vercel's environment variables (this should happen periodically away from the shipped defaults) without everyone being told.

**Fix:** Ask Scale Army Engineering for the current credentials rather than assuming the old ones still work.

## Who has contributed to this

Scale Army Engineering.

## When was this last updated

2026-09-13
