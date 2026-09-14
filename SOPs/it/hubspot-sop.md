---
title: "HubSpot SOP"
department: it
category: SOP
owner: "Seif Farid"
last_updated: 2026-09-14
hidden: true
---

## Goal

See the [[glossary-it-hubspot|IT/HubSpot Glossary]] for terminology used below. Document how Scale Army's HubSpot is actually set up — the CRM objects and their key properties, how contacts/companies/deals associate with each other, every deal pipeline and its stages, how to build workflows, and how to create lists and segments — so the sales assistant (and anyone else) can answer "where do I find X" and "how do I do Y in HubSpot" questions accurately.

## Who this is for

Sales Team, Account Management/Client Success Team, Marketing Team, Recruiting Ops, and Leadership. Anyone who works inside Scale Army's HubSpot portal day to day.

## The core objects: Contact, Company, Deal

HubSpot's CRM is built around records ("objects") that link to each other. The three you'll use constantly:

- **Contact** — a person: a candidate, a client-side point of contact, a prospect, a referrer.
- **Company** — an organization: a client, a prospective client, a partner.
- **Deal** — a unit of business moving through a pipeline: a search/placement, a sales opportunity, an upsell.

Scale Army doesn't have a separate HubSpot object for "candidate" — candidate details (name, email, salary, attribution, etc.) live as **properties on the Deal**, not as their own object type.

## Key properties by object

HubSpot ships with hundreds of default properties (activity timestamps, analytics fields, etc.) that work the same way in any HubSpot portal — those aren't listed here. What follows are the **custom, Scale-Army-specific properties** worth knowing where to find:

### Contact properties

- **Recruiting/candidate fields:** Candidate Salary, Career Interests, Tech Stack Candidate Needs to Know, Experience Needed, must-haves/non-negotiables.
- **Client commercial setup:** client's chosen billing method, Stripe subscription contact email, search deposit tracking, ACH vs. credit card preference (notes the 3% CC fee), Stripe subscription line-item naming convention.
- **Client/company context:** Client Point of Contact (full name), client-facing English level requirement, "Duplicate / Pre-existing Client" flag.
- **Lead qualification (cold-call / lead-ad intake fields):** budget-per-role questions segmented by vertical (AI Engineers, Backend Engineers, Marketers, Sales Reps, Client Success, Customer Support, Shopify Dev, Account Managers), region sourcing preference, "have you hired offshore/nearshore before," decision-maker check, urgency/headcount questions. These encode Scale Army's nearshore/offshore staffing qualification script.
- **Ownership/routing:** Account Executive, Account Manager, Assigned SDR, Recruiter.
- **Referral/attribution:** Referred By, Lead Source (+ manual fallback), First Deal Created Date.
- **Scoring/tooling:** a combined lead-scoring model (engagement/fit/threshold), an AE call-prep enrichment brief.

**Lifecycle Stage** (`lifecyclestage`) options: Subscriber, Lead, Marketing Qualified Lead, Qualified Lead, SQL, Marketing Acceptable Lead (MAL), Opportunity, Customer, Evangelist, Prospect, Re-engage, Lost, Other.

**Lead Status** (`hs_lead_status`) options: New, Open, In Progress, Open Deal, Unqualified, Attempted to Contact, Connected, Bad Timing.

### Company properties

Mostly standard HubSpot fields (industry, size, revenue, domain, lifecycle stage) plus a handful of Scale-Army-specific ones: About Us, Account Manager, Active Search flag, MSA addendum fields (Finance/General/HR), "Number of Deals in MOF," "Number of Active Talents," Org Chart tracking, Payment Preference, Pod, Green/Red Flags (qualitative client notes), and a "1st Month Preferred Payment" field.

### Deal properties

This is where almost all of Scale Army's real business logic lives:

- **Placement/pod mechanics:** Pod, Account Manager Pod(s), Recruiter Pod(s), Recruiter, Senior Recruiter, Sourcer, BDR, Account Manager, Client Success, Client Owner — Scale Army deals carry a whole "pod" of assigned people, not just one owner. Also: is this a direct placement vs. a replacement search, CRS (Candidate Review Session) date tracking, how many candidates sent/interviewed, "Batch Zero" talent flag.
- **Commercial/pricing/margin:** Margin (price − salary) is the core unit-economics field. Also: Compensation to Pay Talent, Amount to Charge Client, salary quoted (high/low), client's max budget, Net to Candidate estimates split by region (Africa NTC, LATAM NTC — confirms multi-region sourcing), commission-structure flags, invoicing fields (amount, due date, number, recipient, status), deposit tracking, and buyout-of-contract fields (price paid, buyout agreement link, buyout complete/in-progress).
- **MSA/legal/contract lifecycle:** MSA signed + signed date + link, MSA requirements changes (Finance-level, HR-level), signed EL (Engagement Letter) link, contract end date. Termination flow fields: termination reason/details, notice-given date, 30-day-notice tracking (client side and talent side), whether either party knows about the termination, "should we work with this client/talent again."
- **Client success/onboarding lifecycle:** Onboarding call date, Kick Off Call, First Day/Week/30-Days check-ins, Client Success call + notes, last check-in dates (Client Success and HR separately).
- **Role scoping:** Role Name, Job Description link, minimum applicant requirements, seniority level, management level, working hours/timezone, English level required, whether the role was rescoped and why.
- **Referrals (deal-level):** Is This Deal a Referral, who referred it, whether the referrer's been paid, referral payment amount (tracked separately at different deal-lifecycle points — Closed Won 90 Days, Launch Search Ops).
- **Deal classification/reporting:** Deal type, Deal Health, Closed Lost Type/Stage/Reason (with an MOF/TOF/BOF funnel-stage taxonomy baked into the reason options), whether this is the company's first deal with us (new business vs. upsell), potential future searches/upsells.
- **AI agent automation fields:** Scale Army runs named outbound automation agents (Cleo, Juno, Maverick, Trixie) with their own goal/status/integration/volume properties tracked per deal.

Deal/Company/Contact do **not** have `lifecyclestage` or `hs_lead_status` on Deal — those two properties are Contact-only. Deals instead move through `pipeline` + `dealstage` (see below).

## Associations

- The standard HubSpot association model applies: a Deal associates to one or more Contacts and Companies, a Contact associates to a Company, etc. — set these from the record's "Associated Objects" panel, or automatically via workflow/import.
- Deal also carries a **custom `primary_company_record_id` field** in addition to the standard Deal↔Company association — if a deal's company info looks inconsistent, check both: which one is actually authoritative for that deal may depend on when/how it was created. When in doubt, treat the standard association (the actual linked Company record) as authoritative and flag a mismatch to Scale Army Engineering.
- Referral relationships (`referred_by` on Contact, "who was this deal referred by" on Deal) are tracked as **properties**, not as a formal HubSpot association — don't expect to find the referrer in the Associated Objects panel.
- The multi-role "pod" model (Recruiter, Senior Recruiter, Sourcer, BDR, Account Manager, Client Success, Client Owner all on one deal) is also tracked via **properties**, not associations — a deal can only have one HubSpot Owner, so the pod fields are how Scale Army tracks everyone else involved.

## Deal pipelines

Scale Army currently has **10 deal pipelines**. Pipeline names and stages can change over time — if what you see in HubSpot doesn't match this list, that's a signal the pipeline was edited since this was last updated, not that this doc is wrong to check first.

### Placements — MOF Pipeline
The main recruiting/placement funnel (MOF = Middle of Funnel), from search launch through invoicing:
Launch Search Ops → Kick Off Call Booked → Kick Off Call Held → CRS Date Set → Candidates Sent to Clients → Interview Block → Interview/Presentation Block → External Interviews Complete → Candidate Chosen By Client → Letter of Intent Sent → Letter of Intent Signed → Candidate Offer Signed → MSA/Addendum Sent → MSA/Addend Signed → Invoice Sent → Closed Won - First 30 Days (Stripe Recurring Live) → Temporary Hold (Less Than 30 Days) → Notice → Closed Lost MOF / Closed Lost BoF

### Alex's BD Pipeline
A business-development/outbound prospecting pipeline:
To Reach Out → Waiting for Response → Appointment Scheduled → Qualified To Buy → Decision Maker Bought-In → Move to Sales → Contract Sent → Closed Won / Closed Lost → Re-Engage

### AI Pods
Sales pipeline for the AI Pods product line:
To Reach Out → Waiting for Response → First Call Scheduled → First Call Complete → Scheduling Deeper Sales Call → Deeper Sales Call Scheduled → Deeper Sales Call Complete → Intensives Committed To → Intensives Complete → Pricing Agreed Upon → SOW Contract Sent → Closed Won / Closed Lost → Re-Engage

### Placements — MRR Inbound Sales
Inbound sales funnel for recurring-revenue placements:
Meeting Scheduled → JD In Progress → Links Sent: JD/Stripe/Engagement Letter → Pod Assignation → Closed Won → Re-engage
(This pipeline has additional/renamed stages beyond what's listed here — confirm the exact current stage set directly in HubSpot: Settings → Objects → Deals → Pipelines → "Placements — MRR Inbound Sales.")

### Agents — Sales
Sales pipeline for the Agents product line (based on observed deal activity — early-stage meeting/discovery deals). Exact current stage names weren't resolvable from the data available for this doc — confirm directly in HubSpot.

### Placements — Direct Placements Inbound Sales
Inbound sales funnel specifically for direct-placement (non-recurring) searches. Exact current stage names weren't resolvable from the data available for this doc — confirm directly in HubSpot.

### Placements — Client Success Pipeline
Tracks placements after they've closed, through client-success/account-management milestones. Exact current stage names weren't resolvable from the data available for this doc — confirm directly in HubSpot.

### Outbound Creation
Had no active deals at the time this was written, so its stage set couldn't be sampled — confirm directly in HubSpot: Settings → Objects → Deals → Pipelines → "Outbound Creation."

### Agents — CS
Client-success pipeline for the Agents product line (deal naming pattern suggests "Service Agreement Addendum from Upsell/Client" tracking). Exact current stage names weren't resolvable from the data available for this doc — confirm directly in HubSpot.

### PolyOps Sales
Had no active deals at the time this was written, so its stage set couldn't be sampled — confirm directly in HubSpot: Settings → Objects → Deals → Pipelines → "PolyOps Sales."

## Creating and using workflows

Workflows (Automation → Workflows in HubSpot) let you automatically act on a record when something changes, without manual work. General procedure:

1. **Choose the right starting point.** Workflow types include Contact-based, Company-based, Deal-based, and Ticket-based — pick the object type the automation should act on.
2. **Set the enrollment trigger.** Define what causes a record to enter the workflow — a property changing (e.g. deal stage moves to "Closed Won"), a form submission, a list membership, or a filter on any property. Decide whether existing matching records should be enrolled retroactively or only new matches going forward.
3. **Add actions.** Common ones: update a property, create a task, send an internal notification, send an automated email, wait a set delay, branch with if/then logic based on property values, or copy data between associated objects (e.g. copy a Deal property onto its associated Contact).
4. **Test before activating.** Use "Test workflow" against a real record to confirm the trigger and actions behave as expected before turning it on for everyone.
5. **Turn it on, and review periodically.** Check the workflow's enrollment history occasionally to confirm it's still firing as expected — a property rename or a pipeline stage rename can silently break a workflow's trigger.

Common workflow patterns worth knowing are possible:
- Auto-updating **lifecycle stage** or **lead status** when a contact takes a qualifying action.
- Auto-creating a **task** for the assigned owner when a deal enters a specific stage (e.g. a reminder to send the MSA once a deal hits "Letter of Intent Signed").
- **Notifications** to a pod (Account Manager, Recruiter, Client Success) when a deal property changes.
- **Rotating/assigning ownership** automatically based on round-robin or property-based rules.
- Enrolling records into a workflow based on **list membership** (see below), so a static or active list can drive an automation.

## Creating lists and segments

Lists (Marketing → Lists, or CRM → Lists depending on your nav) group records that share something in common — used for reporting, workflow enrollment, or targeted outreach.

- **Active lists** re-evaluate their membership automatically whenever a record's properties change and it starts/stops matching the filter criteria — use these for anything that should always reflect current reality (e.g. "all open deals in the MOF pipeline past 30 days").
- **Static lists** are a fixed snapshot — you add/remove records manually or via a one-time action, and membership doesn't change unless you change it. Use these for a specific batch or campaign (e.g. "clients invited to this quarter's referral event").
- To create either: List → Create list → choose object type (Contact/Company/Deal) → choose Active or Static → build filter criteria the same way you would for search/reports (property filters, association filters) → save.
- Lists can be used as a workflow enrollment trigger, as a filter in reports, or as the recipient list for a marketing email send.

## Checklist

- [ ] Confirm which object (Contact, Company, or Deal) a piece of information actually lives on before searching for it — candidate details are Deal properties, not a separate object.
- [ ] Check both the standard Company association AND the `primary_company_record_id` field on a Deal if company info looks inconsistent.
- [ ] Before building a workflow, confirm the enrollment trigger and test it against a real record before activating.
- [ ] Use Active lists for anything that should stay current automatically; Static lists for one-time batches.
- [ ] If a pipeline's stages don't match what's documented here, treat HubSpot itself as the source of truth and flag the drift so this doc gets updated.

## Who has contributed to this

Scale Army Engineering / IT (Seif Farid).

## When was this last updated

2026-09-14
