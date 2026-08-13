---
title: "Finance Data Map: Company Metrics Source Document"
department: finance
category: SOP
owner: "Daniel, Sandra"
last_updated: 2026-07-20
---

## Goal

Map the key operational and financial metrics tracked by Finance across all departments, so each metric's owner, definition, and source system are documented in one place.

## Who this is for

Finance Team, Leadership, and Data Analysts.

## Purpose

For each metric, this map identifies the responsible department, the definition, the source system/report, and the exact data location. It feeds the company data map and, ultimately, the **SA Business Health Report** — the consolidated leadership view of company performance, built from the Weekly and Monthly Finance Dashboards.

## Finance-level metrics (Weekly & Monthly Dashboards)

| Metric | Department | Description | Source System |
|---|---|---|---|
| Deposits Received | Finance / Sales | Total client deposits paid for the week | Stripe/Slack |
| Deposits Monthly Target | Finance / Sales | Monthly deposit target set by leadership | SA Business Health |
| MSA Signed | Sales | Number of MSAs signed | Slack/HubSpot (Closed Won Deals) |
| MSA Monthly Target | Sales | Monthly MSA target | SA Business Health |
| Active Hires | HR / Operations | Total active talent currently deployed | All Sales Database |
| New Hires Started | HR | Number of new talents starting work | All Sales Database |
| New Revenue | Finance | Revenue from new client engagements | All Sales Database |
| New Salaries | HR / Finance | Total salaries tied to new hires | All Sales Database |
| New Margin | Finance | Revenue minus salary costs | Calculated (dashboard formula) |
| Buyouts | Finance | Buyout events where a client purchases the talent's contract | All Sales Database |
| Lost Deals | Sales | Number of lost opportunities | HubSpot Pipeline Report |

## Revenue & profitability metrics

| Metric | Department | Description | Source |
|---|---|---|---|
| Forecasted Monthly Revenue | Finance | Expected revenue for the month based on active hires | Finance Forecast Model / Budget Model |
| Recognizable Revenue | Finance | Revenue recognized from client fees | All Sales Database |
| Total Salaries Paid | HR / Finance | Total compensation paid to talent | Payroll Sheet |
| Gross Profit | Finance | Revenue minus salaries paid | Calculated (dashboard formula) |
| Forecasted Gross Profit | Finance | Forecasted monthly profit | Finance Forecast / Budget Model |

## Accounts receivable metrics

| Metric | Department | Description | Source |
|---|---|---|---|
| Successful Payments | Finance | Payments successfully processed | Stripe |
| Pending Accounts Receivable | Finance | Payments not yet processed | Stripe (AR Report) |
| Failed Payments | Finance | Payments that failed to process | Stripe |
| AR Past Due | Finance | Payments overdue past the due date | Stripe / Finance Tracker (AR Aging Report) |

## HR / talent metrics

| Metric | Department | Description | Source |
|---|---|---|---|
| Active Talent | HR | Number of currently active contractors | All Sales Database + Slack |
| Talent Offboarding | HR | Number of talents who ended engagement | All Sales Database + Slack |
| Talent Compensation | HR | Total compensation per talent | Payroll Prep Sheet |

## Sales metrics

| Metric | Department | Description | Source |
|---|---|---|---|
| Deals Closed Won | Sales | Deals successfully closed | HubSpot + Slack |
| Deposits from New Clients | Sales | Deposits from new client deals | Stripe |
| Deposits from Upsells | Sales | Deposits from existing client expansions | Stripe |

## Note

Exact spreadsheet locations (tab/row/column) and live dashboard links are maintained in the Finance team's working dashboard rather than duplicated here, since those cell references shift as the sheet evolves — ask Finance (Daniel/Sandra) for the current dashboard link if you need to trace a metric to its live source.
