---
title: "JD Generator SOP"
department: it
category: SOP
owner: "Scale Army Engineering"
last_updated: 2026-09-04
hidden: true
---

## What This Tool Is

The Scale Army JD Generator is an internal web application used by the Scale Army recruiting team. Recruiters paste raw meeting notes from client intake calls, and the tool uses Claude AI to:

1. Classify the role (job title, seniority, region, budget)
2. Match it to a role in the salary database
3. Run a financial review to determine deal quality (commission tier)
4. Generate a professionally formatted, ready-to-post job description in Scale Army's house style

The tool enforces business rules automatically — it blocks progression when a deal is financially unviable, warns when margins are thin, and never outputs a JD without the recruiter approving each stage first.

## Who this is for

Scale Army recruiters and account executives. Deployed on Vercel, accessible via a web URL. It is not a public-facing tool, it does not store data, and every session starts fresh.

## System Architecture

```
Browser (index.html)
       |
       | POST /api/chat (meeting notes, classification prompts)
       |-------------------> Vercel Serverless Function (api/chat.js)
       |                              |
       |                              | POST https://api.anthropic.com/v1/messages
       |                              |---> Claude API (claude-sonnet-4-6)
       |                              |<--- Claude response
       |<-- JSON response ------------|
       |
       | GET /api/pricing (role/salary database)
       |-------------------> Vercel Serverless Function (api/pricing.js)
       |                              |
       |                              | GET [Google Apps Script URL]
       |                              |---> Google Apps Script Webapp
       |                              |<--- JSON { roles: [...] }
       |<-- JSON response ------------|
       |
       | (all further steps: pure browser JS, no more API calls until JD generation)
```

### Key components

| Component | Technology | Purpose |
|---|---|---|
| `index.html` | Plain HTML + CSS + JS (single file) | Entire frontend UI and application logic |
| `api/chat.js` | Vercel serverless function (Node.js) | Proxies requests to Claude API, keeps API key server-side |
| `api/pricing.js` | Vercel serverless function (Node.js) | Proxies requests to Google Apps Script, avoids browser CORS |
| Google Apps Script | Google Sheets + Apps Script | Live shared role/salary database, editable by non-engineers |
| Vercel | Hosting platform | Builds and serves the app; handles preview deployments per branch |

## How It Was Built

### Why a single HTML file?

The entire application — all CSS styles, all JavaScript logic, all HTML markup — lives in one file: `index.html`. There is no build step, no npm, no React, no bundler. This was a deliberate choice for simplicity: the app can be opened directly in a browser without any local server, edited without a development environment, and deployed without configuration.

### Why Vercel serverless functions?

Two things cannot happen in the browser:
1. **Calling the Claude API** — the Anthropic API key must never be exposed to the browser. `api/chat.js` acts as a secure server-side proxy.
2. **Calling Google Apps Script directly** — the Apps Script webapp does not send CORS headers that browsers require. `api/pricing.js` fetches the data server-side and forwards it to the browser.

Vercel detects the `/api/` directory automatically and deploys each `.js` file as a serverless endpoint.

### Why Google Apps Script?

The role/salary database needs to be editable by non-engineers (sales ops, account managers). Google Sheets is the most accessible editing interface for that team. Google Apps Script turns the sheet into a live JSON API endpoint. When the sheet is updated and the script is re-deployed, the tool immediately sees new data — no code changes needed.

### How the AI works

All AI calls go to Claude (`claude-sonnet-4-6`) via `api/chat.js`. The frontend sends a `system` prompt (the instructions telling Claude what to extract or write) and a `messages` array (the meeting notes or role data).

Claude responds with structured JSON for classification and role matching, and with plain-text prose for the JD itself. The frontend parses the JSON and renders it as interactive cards. The AI is only called three times per session:
1. Classification — extract role info from meeting notes
2. Role matching — find the best salary database match
3. JD generation — write the actual job description

The financial review (Step 4 below) uses no AI — it is pure JavaScript math on the salary data.

### How the salary database is loaded

On page load, `loadPricingData()` calls `/api/pricing` which fetches the live Google Apps Script endpoint. The response is:

```json
{
  "roles": [
    {
      "role": "Account Executive",
      "category": "Customer & Admin Support",
      "africa": [900, 1200, 1500, 2000, 2400, 3000],
      "latam": [1300, 1900, 2500, 3600, 4000, 5000]
    }
  ]
}
```

The tool parses this into three in-memory arrays: `CLASSIFIER` (unique role+group pairs, used to populate the classification prompt), `AFRICA_FIN`, and `LATAM_FIN` (flat rows with `{group, role, seniority, salary}` per region).

The 6 salary values per region map to seniority by index: `[0]=Junior, [1]=Mid-Level, [2]=Senior, [3]=Senior+, [4]=Senior++, [5]=Senior+++`.

## The 5-Step User Flow

### Step 0 — Page Load

On load, the tool fetches the salary database from `/api/pricing`. While it loads, the input is disabled and a loading message is shown. If the database fails to load, the tool shows an error and blocks all progression — without the database, seniority matching and financial review cannot work.

### Step 1 — Meeting Notes + English Level

The recruiter pastes raw meeting notes into the text box and hits Enter.

The tool checks whether the notes mention English proficiency (scanning for keywords: "accent", "native", "fluency", "bilingual", "English level", "no accent", "neutral accent", "mother tongue", "language proficiency").

- **If NOT mentioned:** A question flow appears asking the recruiter to select an English level (Native Speaker / Highly Proficient / Conversational) and then an accent preference (No preference / Neutral or light accent preferred / No accent required). These answers are appended to the meeting notes text before any AI call is made.
- **If already mentioned:** Proceed directly to classification.

### Step 2 — Classification (AI Call #1)

The meeting notes (including any appended English level info) are sent to Claude with a classification system prompt. Claude returns a JSON object with `company_name`, `company_description`, `job_title`, `matched_role`, `group`, `seniority_level`, `region`, `budget`, and `special_requirements`.

The recruiter sees this as a card and approves or rejects it. On rejection, the recruiter provides feedback and Claude reclassifies. After 2 rejections, the "Reject" button becomes "Start Over".

**Budget missing:** If `budget` is `"missing"`, the Approve button is disabled and the recruiter must reject + resubmit notes with budget information. The tool cannot proceed without a budget.

### Step 3 — Role Match (AI Call #2)

After approval, the tool filters the salary database to roles in the same group and seniority as the classification. This filtered list is sent to Claude, which picks the closest functional match and explains why. The recruiter approves or rejects.

### Step 4 — Financial Review (pure JavaScript, no AI)

The tool looks up the salary for the matched role, region(s), and seniority. It then parses the budget string (e.g. "$4,000-$6,000" → `{low: 4000, high: 6000}`), uses `budgetHigh` as the client rate, calculates spread and margin, determines the commission tier, and calculates minimum quote prices for each tier.

Three outcomes:
- **All regions Below Standard** → Shows alternative options (lower seniority or other region) or a "Start Over" button only. JD generation is blocked.
- **Some regions Below Standard** → Warning is shown but the recruiter can still proceed using the acceptable region's data.
- **Acceptable or above** → "Generate JD" button appears.

### Step 5 — JD Generation (AI Call #3)

Claude writes the job description in Scale Army's house style using the meeting notes, classification data, and role information. The recruiter gets a formatted output card with a "Copy to Clipboard" button.

## Core Logic Reference

### Commission tier system

```
Spread  = Client Rate − Candidate Salary
Margin  = Spread ÷ Client Rate

Check in order, stop at first match:
  Hero          → Margin ≥ 50% OR (Margin ≥ 40% AND Spread ≥ $1,000)
  Safe-Strong   → Margin ≥ 35% AND Spread ≥ $1,000
  Safe-Solid    → Margin ≥ 40% AND Spread ≥ $600
  Acceptable    → Margin ≥ 35%
  Below Standard → anything else
```

### Minimum quote prices

```
roundTo50(v) = Math.ceil(v / 50) * 50

Acceptable min  = roundTo50(salary / 0.70)
Safe-Strong min = roundTo50(max(salary / 0.65, salary + 1000))
Hero min        = min(roundTo50(salary / 0.50), roundTo50(max(salary / 0.60, salary + 1000)))
Hero Ideal      = Hero min + $1,000, rounded up to nearest number ending in $900
```

**Example (salary = $2,000):** Acceptable min = $2,900, Safe-Strong min = $3,100, Hero min = $3,050, Hero Ideal = $4,900.

### Seniority levels

| Level | Experience | Description |
|---|---|---|
| Junior | 0–2 yrs | Entry-level, closely guided, basic tasks |
| Mid-Level | 2–4 yrs | Works independently, growing ownership |
| Senior | 4–7 yrs | Owns their domain, reliable delivery, mentors informally |
| Senior+ | 7–10 yrs | Cross-functional influence, handles complex projects |
| Senior++ | 10–15 yrs | Formal team lead or manager, builds and runs teams |
| Senior+++ | 15+ yrs | Head of function, director-level, shapes strategy |

Default: Mid-Level when no signals present. Budget is used as a supporting signal — higher budget implies higher seniority.

## The Role Database

Lives in a Google Apps Script webapp — a URL that returns live JSON. The `/api/pricing.js` serverless function fetches it on every page load.

Changes are made in the Google Sheet that backs the Apps Script. After saving the sheet, the Apps Script webapp does not need to be redeployed — it reads the live sheet data on every request, so changes are live immediately. If the schema of the data changes (e.g. new column names, new structure), the code in `index.html` inside `loadPricingData()` must also be updated to match.

Current schema:

```json
{
  "roles": [
    {
      "role": "Account Executive",
      "category": "Customer & Admin Support",
      "africa":  [900, 1200, 1500, 2000, 2400, 3000],
      "latam":   [1300, 1900, 2500, 3600, 4000, 5000]
    }
  ]
}
```

The 6 values per region map to seniority by index: `[0]=Junior, [1]=Mid-Level, [2]=Senior, [3]=Senior+, [4]=Senior++, [5]=Senior+++`.

## Deployment & Hosting

Deployed on Vercel — the repository is connected to Vercel and every push triggers a deployment. `main` deploys to the production URL (the live tool recruiters use); feature branches get Vercel preview URLs for testing changes before going live.

Environment variables are set in the Vercel project dashboard, not in code: `ANTHROPIC_API_KEY` is the Anthropic API key used by `api/chat.js`, and it is never in the frontend.

To deploy a change: make changes on a feature branch, push to GitHub, test the automatic preview deployment, then merge to `main` for Vercel to deploy to production automatically.

## Troubleshooting Guide

### "Pricing data failed to load"

**Symptom:** On page load, the tool shows an error about the pricing database and the input box stays disabled. No meeting notes can be submitted.

**Root cause:** One of three things: the Google Apps Script URL is down or has been re-deployed with a new URL, the Google Apps Script returned data in an unexpected format, or the Vercel `/api/pricing` serverless function failed.

**How to diagnose:** Open browser dev tools (F12 → Network tab), reload the page, and check the `/api/pricing` request — status 200 with JSON means the data loaded (check the JSON structure matches `{ roles: [...] }`); status 502 means the Apps Script URL is failing (test it directly in your browser); status 500 means the serverless function crashed (check Vercel function logs).

**Fix:** If the Apps Script URL changed, update `PRICING_DB_URL` in `api/pricing.js`. If the Apps Script is down, check the Google Apps Script dashboard and re-deploy if needed. If the JSON structure changed, update `loadPricingData()` in `index.html` to match.

### "Classification failed: ..." or "Role matching failed: ..."

**Symptom:** After submitting meeting notes, the tool shows an error message and resets the step.

**Root cause:** Most commonly one of: `ANTHROPIC_API_KEY` isn't set or is invalid in Vercel, the model ID in `api/chat.js` is wrong or deprecated, the Claude API returned an error (rate limit, server error), or Claude returned non-JSON when JSON was expected.

**How to diagnose:** Check the exact error text shown (it comes directly from the API error message), and check the `/api/chat` request/response in browser dev tools → Network.

| Error message | Fix |
|---|---|
| `model: claude-sonnet-4-XXXXXX` or `model_not_found` | The model ID in `api/chat.js` is wrong. Update to a current, valid model ID. |
| `Invalid API Key` or `authentication_error` | The `ANTHROPIC_API_KEY` in Vercel is missing or wrong. Go to Vercel → Project Settings → Environment Variables. |
| `rate_limit_error` | Too many requests in a short time. Wait 60 seconds and try again. |
| `JSON parse error` | Claude returned text that wasn't valid JSON. Usually caused by a bad system prompt. Try again — it's usually transient. |
| `overloaded_error` | Anthropic API is under load. Wait and retry. |
| Network error / timeout | The Vercel function timed out. Try again. If persistent, check Vercel function logs. |

### "Budget is too high" blocks the entire flow even when only one region is over

**Symptom:** The recruiter gets a message saying the budget is too high / the deal is non-viable, even though one region (e.g. LATAM) would have been fine.

**Root cause:** This was a bug in an older version of the code where any Below Standard result in any region blocked the entire flow. It has been fixed in the current version with three-state logic (all-below / some-below / acceptable-or-above).

**How to verify you're on the fixed version:** Look for `allBelow` and `anyBelow` variables in the `showFinancialReview()` function in `index.html`. If you only see a single `tooHigh` check, you're on the old version.

**Fix:** Deploy the latest version from the `main` branch.

### "Role not found" in the financial review

**Symptom:** In Step 4, one or both regions shows "Role not found" instead of a tier badge and salary.

**Root cause:** The role matched in Step 3 doesn't exist in the salary database for that region at that seniority level.

**How to diagnose:** Note the role name shown on the Role Match card, open the Google Sheet backing the pricing database, and check whether the role exists, has data for that region, and has that seniority index populated.

**Fix:** Add the role to the sheet if missing, correct the sheet entry if the name doesn't match what Claude returned (matching is already case-insensitive, so casing alone shouldn't cause this), or add the missing seniority salary.

### The tool classifies at the wrong seniority level

**Symptom:** The classification card shows the wrong seniority (e.g. "Junior" when the notes clearly describe a Senior role).

**Root cause:** Claude misread the meeting notes — usually vague/ambiguous notes, a missing budget (so Claude can't use it as a signal), or a misleading role title.

**Fix:** Reject the classification card, and in the feedback box explicitly state the correct seniority and why (e.g. "This should be Senior+ — the notes say 8 years experience"); Claude reclassifies with that feedback. Prevent this by ensuring meeting notes include years of experience, a seniority title from the client, or a clear budget.

### The JD is generated but contains the client company name

**Symptom:** The output JD includes the client's company name (e.g. "Acme Corp is looking for...").

**Root cause:** The JD generation prompt instructs Claude never to include the company name, but Claude occasionally ignores this for very distinctive or prominent company names in the notes. This is a Claude behavior, not a code bug.

**Fix:** Copy the JD and manually remove or replace the company name. To reduce recurrence, strengthen the JD generation system prompt in `generateJD()` — adding a second explicit rule with an example tends to help.

### The app appears broken but was working yesterday

**Checklist:** Hard-refresh (`Ctrl+Shift+R` / `Cmd+Shift+R`) in case of stale cached JS; check Vercel dashboard → Deployments for the latest deployment status (roll back via "Promote to Production" on an earlier one if needed); check whether there was a recent push to `main` that broke something; check the Anthropic API status page for an outage; and check browser console (F12) for errors like `Failed to fetch /api/chat`, `JSON.parse error`, or `Cannot read property of null` (usually a JS logic bug after a database schema change).

### Changes made to the code are not showing up on the live site

**How to check:** Vercel dashboard → Deployments — confirm the most recent commit shows "Ready" (wait if "Building", check build logs if "Error").

**If the deployment succeeded but still looks old:** Hard-refresh, try an incognito window, and confirm you pushed to `main` (production).

### The pricing database returns old data after updating the Google Sheet

**Root cause:** The tool fetches the database fresh on every page load, so stale data means either the sheet wasn't saved, the Apps Script needs re-deploying (only if the script code itself changed, not just the sheet data), or the browser is caching the API response.

**Fix:** Save the sheet, hard-refresh the tool page, and if still stale, check in the Apps Script editor (Deploy → Manage Deployments) that the deployment is active.

### "Regenerate JD" produces a very different or worse output

**Root cause:** JD generation uses the same prompt every time, but Claude has inherent variability — each generation is a fresh call.

**Fix:** Regenerate once more. If the issue is systematic (consistently wrong format), strengthen the `generateJD()` system prompt in `index.html` with more explicit formatting rules or examples.

## Quick Reference: File Map

| File | What to edit here |
|---|---|
| `index.html` | All UI, CSS, JavaScript logic, AI prompts, tier calculations, JD format |
| `api/chat.js` | Claude API model ID, max tokens, CORS headers |
| `api/pricing.js` | Google Apps Script URL, pricing database proxy logic |
| `vercel.json` | Vercel routing rules (rarely needs changes) |

## Quick Reference: Where Secrets Live

| Secret | Where it's stored | Never stored in |
|---|---|---|
| `ANTHROPIC_API_KEY` | Vercel project environment variables | `index.html`, `api/chat.js` code, git |
| Google Apps Script URL | `api/pricing.js` source code | (not a secret — it's a public endpoint) |
