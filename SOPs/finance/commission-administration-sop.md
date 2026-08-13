---
title: "Commission Administration SOP"
department: finance
category: SOP
owner: "Daniel, Sandra"
last_updated: 2026-07-20
---

## Goal

Standardize how commissions are administered across all roles and business lines — the end-to-end process from data collection through payment, roles/responsibilities, and the controls ensuring accuracy and compliance. This SOP does not cover individual commission formulas or role-specific plan mechanics — those live in separate role-specific Commission Plan documents.

## Who this is for

Leadership, Finance Team, HR Team, Operations Team, and anyone involved in commission processing.

## Scope

Applies to all commission-eligible roles, regardless of compensation structure (placement bonuses, gross margin kickers, stretch bonuses, and other variable pay). Covers the workflow, data sources, review cadence, approval gates, dispute resolution, and document management — not individual rate tables or plan terms.

## Commission structure categories

| Category | How it works | Applicable roles |
|---|---|---|
| Placement / Deal-Based | One-time commission per successful placement/closed deal, typically gated by a 30- and/or 90-day retention period; payout is a % of gross margin or a flat fee, often tiered by margin quality. | AEs, AMs, Recruiters, Senior Recruiters, Sourcers, BPO AMs & Recruiters, POD Leaders (personal deals) |
| Team Performance | Bonuses tied to a team/pod's collective output (placements, GM growth, pod KPIs), paid monthly or quarterly. | AM Lead, POD Leaders (team bonus), Sourcing Manager, Recruitment Manager, Senior Recruiters (team override) |
| KPI / Metric-Based | Monthly bonuses tied to operational metrics (meetings held, SLA compliance, conversion rates, ATS hygiene, hire counts), often with a stretch kicker. | SDR, BDR, Sourcing Coordinator, Sourcing Campaign Specialist, Sourcing Ops Specialist, Talent Attraction Marketing Manager, Senior Internal Recruiter |
| Financial Performance | Variable pay tied to company/function-level outcomes (EBITDA vs. plan, GM%, revenue growth, budget discipline), validated by Finance monthly/quarterly. | Operations, Head of Operations, Head of Growth, Chief of Staff, Head of Marketing, Head of AI Enablement |
| Retention-Based | Rolling comp tied to retention health of an existing book of business or workforce (placement survival, GM retention, client NPS, employee engagement). | Customer Success, Talent Success Managers, Internal HR |
| Client Referral | Paid to a non-Sales employee who facilitates a client-to-client referral resulting in a new signed engagement; contingent on the referred client closing, limited to the first 90 days. Payout structure still being defined. | Any non-Sales employee (e.g. AMs, POD Leaders); rates TBD |
| Partner Program | Paid to an external contracted referral partner — a % of gross margin on every placement from the referred client for 12 months after their first closed deal. No base pay. Currently a single-partner arrangement with no closed referrals yet. | External referral partner(s) under contract |

Some roles span multiple categories (e.g. POD Leaders earn both personal-deal commissions and team bonuses); detailed mechanics live in the Commission & Compensation Guidelines master file and each role's Calculator/Tracker.

## Key definitions

- **Commission Period:** the timeframe over which commissionable activity is measured — usually monthly, though some components (volume kickers, retention gates) are quarterly.
- **Eligible Revenue:** revenue/activity qualifying for commission per the applicable plan.
- **Commission Plan:** the role-specific document defining rates, tiers, formulas, and payout mechanics.
- **Clawback:** requires returning previously paid commission if conditions are met (e.g. EL revoked within 30 days, candidate not retained past the required period).
- **Gross Margin (GM):** Sales Price minus Candidate Salary — the core metric for most placement/leadership commission structures.
- **All Sales Database (Master Placements File):** the central Google Sheet recording all placement activity company-wide, maintained by a designated Finance team member from automated Operations Slack data. This is the single source of truth for placement counts, GM, revenue, and retention data.
- **Commission Calculator:** a role-specific sheet with the formulas/logic for that role's variable comp.
- **Commission Tracker:** a role-specific sheet reconciling actual commission earned per period, auto-populated via IMPORTRANGE from the All Sales Database with a month/year filter.
- **Payroll Prep File:** HR's master payroll document for the year; Finance provides a monthly copy updated with commission amounts for HR to load into the official file for Deel processing.
- **Payment Cycle 1:** covers the 1st–15th, approved by the 15th, paid the 20th — typically base pay and previously approved adjustments. Dispute/change cut-off: 3 business days before the 15th.
- **Payment Cycle 2:** covers the 16th–end of month, approved by the 30th, paid the 5th of the next month — this is when commissions are calculated and paid. Dispute/change cut-off: 3 business days before the last business day of the month.
- **Retention Gate:** a payout condition requiring a placed candidate stay active for a defined period (usually 30 or 90 days) before the commission pays.
- **Cut-Off Date:** the deadline for submitting pay-related disputes/changes for the upcoming cycle; anything submitted later rolls to the following cycle.

## Data sources & flow

The **All Sales Database** is the single source of truth for all placement data, maintained by Finance from automated Operations Slack messages. It feeds role-specific Commission Calculators/Trackers via IMPORTRANGE, and into the financial metrics (EBITDA, GM, Revenue) used for leadership bonus calculations.

**Supporting sources:**
- **Operations (automated Slack data):** placement activity, start dates, retention milestones, deal details — the primary input to the All Sales Database.
- **Department-reported KPI data:** for non-placement metrics (ATS hygiene, conversion rates, meeting counts, eNPS), the relevant department confirms attainment directly to Finance.
- **HR/People data:** start dates, role changes, plan assignments, termination dates — used for eligibility windows and proration.

**Monthly data flow:**
1. Operations generates automated Slack messages with placement/deal data throughout the month.
2. Finance updates the All Sales Database from that data.
3. Role-specific Trackers auto-populate via IMPORTRANGE (with a month/year filter); Finance confirms non-placement KPI attainment with the relevant department.
4. Finance reviews trackers for the month and verifies commission totals.
5. Finance copies the Payroll Prep File and updates it with each employee's commission amounts (last week of the month).
6. HR loads that data into the official Payroll Prep File and processes it through Deel as part of Payment Cycle 2.
7. Employees can view their commissions in their role's tracker (read access) and in Deel once processed.

**Data integrity:** all commission inputs must be verified against the All Sales Database before finalizing. Any discrepancy between the automated Slack data, the All Sales Database, and the trackers must be resolved before transferring to the Payroll Prep File.

## Roles & responsibilities

| Function | Primary responsibilities | Key deliverables |
|---|---|---|
| Operations | Delivers placement activity data to Finance via automated Slack; resolves attribution disputes when Ashby/HubSpot conflicts with the Slack message. | Timely, accurate placement data each period |
| Finance | Maintains the All Sales Database, reviews trackers, confirms commission totals, prepares the Payroll Prep File copy for HR; confirms non-placement KPI attainment with departments. | Verified commission totals, updated Payroll Prep File copy delivered by the last week of the month |
| Human Resources | Maintains the official Payroll Prep File, loads Finance's commission data into it, processes payroll via Deel, maintains eligibility/plan/agreement records. | Processed payroll, updated eligibility roster, signed plan agreements |
| Department Heads (limited role) | In specific cases (e.g. Marketing), confirm KPI attainment data to Finance — they don't formally sign off on commission calculations. | KPI attainment confirmation where applicable |

## Commission process & timeline

Commissions calculate and pay as part of Payment Cycle 2 (approved by the 30th, paid the 5th of the next month). All commission data must be finalized before the approval deadline — changes after cut-off roll to the next cycle.

**End-to-end steps:** (1) ongoing data capture by Operations/Finance throughout the month; (2) tracker auto-population via IMPORTRANGE; (3) KPI confirmation with relevant departments for non-placement roles; (4) Finance's commission review; (5) Payroll Prep handoff to HR in the last week of the month; (6) payroll processing via Deel; (7) employee visibility via trackers and Deel; (8) archival per the document retention policy.

**Standard monthly timeline:** All Sales Database updates ongoing → Finance reviews trackers (last week of month) → non-placement KPIs confirmed (last week) → updated Payroll Prep copy to HR (last week) → Payment Cycle 2 approved by the 30th → commission paid on the 5th of the next month.

## Controls & audit trail

**Preventive:** automated IMPORTRANGE data pipeline (minimizes manual entry error), single source of truth (All Sales Database), formula-protected tracker workbooks.

**Detective:** Finance review of every tracker before transfer to payroll; employee self-service read access to their own tracker; dispute tracking to catch systemic issues.

**Documentation & retention:** version-controlled copies of the All Sales Database and Payroll Prep File each period; Payroll Prep File copies serve as the processing record; commission records retained a minimum of 3 years per the document retention policy.

## Dispute resolution

Employees can dispute commission amounts at any time — there's no formal dispute window, including for prior months.

- **Attribution dispute** (placement not correctly attributed): Finance checks the All Sales Database against the automated Slack message; if they match, the attribution stands. If the employee has supporting evidence from Ashby/HubSpot showing a different attribution, Finance compares it — if the source systems disagree with the Slack message and database, it's referred to Operations to investigate and Finance adjusts based on their determination.
- **Start date dispute** (affects which commission period a placement falls in): the automated Slack message is the source of truth for start dates (HubSpot/Ashby "close date" ≠ actual start date, and these frequently differ). Genuine Slack-vs-database discrepancies get corrected; disputes based on the close date rather than actual start date resolve in favor of the Slack message. Escalation follows the same path as attribution disputes.
- **Commission rate dispute** (wrong rate/formula applied): typically arises after a plan rate change. Finance and HR review the applicable plan document, the effective dates of any rate change, and the employee's signed plan agreement, and resolve based on the documented terms in effect for that period.

All disputes and outcomes are documented.

## Plan changes & exceptions

**Plan changes** (rates, tiers, qualifying criteria, structural changes) follow: proposal (with rationale and financial impact) → Finance/HR review (budget, legal, internal equity) → written executive approval → written notice to affected employees with updated signed plan documents → tracker/system updates.

**One-time exceptions/overrides** must be documented in writing with the employee's name/role, description and business justification, financial impact, and an executive approval signature. Exceptions are logged separately and reviewed quarterly for patterns that might warrant a permanent plan change.

## Reference documents

The detailed, role-specific mechanics live in: the Commission & Compensation Guidelines master file, the All Sales Database, role-specific Commission Calculators and Trackers (one per role), the Payroll Prep File, the Commission Adjustment/Dispute Tracker, and the separate SOP for the Referral Bonus Program (see `referral-bonus-sop.md` in this folder).

## Amendment history

Reviewed at least annually or whenever the commission process materially changes. Amendments require approval from the Senior Operations Manager or, in their absence, the CEO. Initial release: March 11, 2026 (Daniel Rios).
