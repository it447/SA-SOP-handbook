---
title: "Company Audit Tool SOP"
department: it
category: SOP
owner: "Scale Army Engineering"
last_updated: 2026-09-04
order: 6
---

## Goal

Explain what the Company Audit Tool is, how it works, how to run an audit, and how to troubleshoot it when something breaks — so anyone on the team can use it and diagnose common issues without needing an engineer.

## Who this is for

Recruiters, account executives, and anyone auditing a prospective or existing client's employee list to identify which roles Scale Army can nearshore.

## Other Link

Deployed on Vercel as a standalone Next.js app (not part of this handbook's own codebase). Ask IT for the current live URL and GitHub repo link if you need direct access.

## What this tool is

The Company Audit Tool searches a company's employee list via Apollo's database and flags which roles/departments Scale Army could realistically source (nearshore) versus which need to stay local (e.g. C-suite, founders, on-site/physical roles). It outputs an interactive dashboard plus a downloadable Excel workbook with an Overview tab (every employee found) and a Stats tab (department-level breakdown).

It supports two ways to get employee data in:
- **Search by domain** — enter a company name, website URL, and optional LinkedIn URL; the tool queries Apollo directly.
- **Upload CSV** — paste/drop a CSV of employees (from any other source) and the tool runs the same sourceability logic against it without touching Apollo at all.

## How it works

### Search by domain flow

1. The website URL is normalized down to a bare domain (strips `https://`, `www.`, and anything after the domain).
2. Two things run in parallel:
   - **Apollo search** (`mixed_people/api_search`) — a free, no-credit search that returns up to 100 people matching the domain, with basic fields (name, title).
   - **Company research** — a Claude call (`claude-haiku-4-5-20251001`, with web search enabled) that returns a structured brief: industry, size, revenue, founding year, how they get clients, whether they're a "legacy" business, an estimated org chart, and an overall sourceability percentage with a list of sourceable vs. not-sourceable role types.
3. Each Apollo person is processed: department is guessed from their job title (keyword matching against a fixed list of department patterns), and a first-pass "Can Source" Yes/No is computed from the same title/department rules (see Sourceability logic below).
4. The top people are enriched via Apollo's bulk match endpoint (10 at a time) to fill in LinkedIn URL, location, and full name — this step **does consume Apollo credits**, unlike the initial search.
5. The results are assembled into an Excel workbook (Overview + Stats tabs) and returned to the browser alongside the company research brief.

### Upload CSV flow

The CSV is parsed directly in the API route — no Apollo credits used at all. Column headers are matched against a fixed alias list (e.g. "Full Name" / "Name" / "Contact Name" all map to the same field), so common export formats from other tools should just work. Rows without a resolvable name are skipped. Department and sourceability are computed the same way as the domain-search flow.

### Sourceability logic

Every person gets a department guess (Executive Leadership, Sales, Sales and Marketing, Technology and Development, Human Resources, Finance, Legal Services, Customer Service, Operations, Product Development, Education and Training, Design, or Other) from keyword matching on their job title.

"Can Source" is then Yes/No based on, in order:
1. **Always No** for C-suite/founder seniority or titles (CEO/CTO/COO/CFO/CRO, founder, co-founder, president), and for a fixed list of physical/on-site role patterns (drone pilot, field technician, surveyor, security guard, warehouse/forklift/delivery driver).
2. **Yes** if the title explicitly matches a sourceable pattern (design, engineering, marketing, finance, HR/recruiting, customer success, SDR/BDR/sales ops, product management, or remote-friendly admin roles).
3. **Yes** if the guessed department is broadly sourceable (Technology and Development, Sales and Marketing, Finance, Human Resources, Customer Service, Product Development, Design, Education and Training).
4. **No** by default if none of the above matched — not enough signal to confirm.

To change this logic (add a role type, exclude a new pattern, change department rules), edit `canScaleArmySource()` and `guessDepartment()` in `lib/audit.js`. This is the single place both the domain-search and CSV-upload flows read from, so a change there applies to both.

## Checklist: running an audit

1. Open the tool and choose **Search by domain** or **Upload CSV**.
2. For domain search: enter the company name (optional, improves the research step), the website URL (required), and LinkedIn URL (optional), then click **Run audit**.
3. For CSV upload: enter the company name (optional), drop or browse to a `.csv` file with at least a name and job title column, then click **Build audit**.
4. Review the three result tabs: **Company Brief** (domain-search only — industry, size, GTM, sourceability estimate), **Employees** (the full list with Can Source flags), and **Role Breakdown** (a department-level bar chart).
5. Click **Download Excel (.xlsx)** to get the Overview + Stats workbook for sharing or archiving.
6. Click **+ New audit** to reset and run another one.

## Troubleshooting Guide

### "No people found for [domain]"

**Cause:** Apollo genuinely has no employee records for that domain, or the domain was extracted incorrectly from the URL (e.g. a subdomain or trailing path confusing the parser).

**Fix:** Double-check the website URL is the company's main domain (e.g. `company.com`, not `www.company.com/about`). Try the bare domain if the full URL didn't work.

### Company Brief tab is empty / "Company research unavailable"

**Cause:** `ANTHROPIC_API_KEY` isn't set in Vercel, or the Claude research call failed/returned something that couldn't be parsed as JSON.

**Fix:** Confirm `ANTHROPIC_API_KEY` is set under Vercel → Project Settings → Environment Variables and redeploy if it was just added. The Employees and Role Breakdown tabs still work independent of this — only the Company Brief tab depends on the research call.

### Employees are missing LinkedIn URLs or locations

**Cause:** Only the first batch of people (processed via Apollo's bulk match) get enrichment — this step costs Apollo credits, so it's intentionally scoped rather than run for every single result. A batch can also silently fail (rate limit, timeout) and fall back to whatever data the free search already had.

**Fix:** Not necessarily a bug — check the People/Credits usage in the Apollo dashboard if this happens consistently. A missing LinkedIn/location for a subset of people is expected behavior, not a full outage.

### CSV upload fails with "No valid rows found"

**Cause:** The CSV has no header row Scale Army's column-alias list recognizes for name (e.g. "Full Name," "Name," "Contact Name"), or every row is missing a name value.

**Fix:** Confirm the CSV has a name column (or separate first/last name columns) and at least one data row beneath the header. Re-export from the source tool if the header names are unusual.

### "APOLLO_API_KEY is not set" error

**Cause:** The environment variable is missing on this deployment.

**Fix:** Vercel → Project Settings → Environment Variables → add `APOLLO_API_KEY` (the Apollo **Master** API key, from apollo.io → Settings → API Keys), then redeploy.

### Excel download button does nothing / produces a corrupted file

**Cause:** The base64-encoded workbook returned by the API didn't fully arrive (network interruption) or the browser blocked the download.

**Fix:** Re-run the audit and try downloading again. If it persists, check the browser console for a fetch error on the original `/api/audit` or `/api/upload` call.

### Sourceability results look wrong for a role that should/shouldn't be flagged

**Cause:** The title didn't match any of the keyword patterns in `canScaleArmySource()`/`guessDepartment()` in `lib/audit.js`, or matched an unintended one.

**Fix:** This is a configuration change, not a bug fix — update the relevant pattern list in `lib/audit.js` per the README's "Configure Can Source Logic" guidance, then redeploy.

## Who has contributed to this

Scale Army Engineering.

## When was this last updated

2026-09-04.
