---
title: "Scale Army & SA Product Ops — Legal Knowledge Base"
department: legal
category: reference
owner: "Joel Zamora"
last_updated: 2026-08-21
hidden: true
---

This document is the settled, reusable legal knowledge for **Scale Army (PLTWG LLC d/b/a Scale Army)** — a Miami-based staffing, recruiting, payroll, and Employer-of-Record business — and its sister product entity **SA Product Ops (SAPO)**, which operates the **Scale Army Agents (SAA)** AI sales-engagement platform. It captures standing negotiation positions, escalation ownership, jurisdictional defaults, standard contract terms and where we stand on them, the SAA public Privacy Policy / Terms posture, and the state of active contract and dispute workstreams. It is an internal record for answering legal questions accurately; it is not legal advice, and unresolved items are quarantined under "Open / unresolved."

> **Provenance note:** Section numbers (e.g. §14.1, §11.2.5, §4.3(d)) are internal to the specific documents named and are not statutory citations. Statute names (TCPA, CAN-SPAM, GDPR, etc.) come from our own drafted documents. Where an exact figure, date, or reference is not confirmed in the source material, this document says so plainly rather than guessing.

---

## Entities: Scale Army (PLTWG LLC) vs. SA Product Ops (SAPO)

**Also asked as:** what's the difference between Scale Army and SAPO; which entity signs the staffing contracts; who operates Scale Army Agents; what is PLTWG LLC.

Two distinct entities exist and their contracts follow different templates and jurisdictions:

- **Scale Army** — legal entity **PLTWG LLC d/b/a Scale Army**, Miami-based. Provides staffing, recruiting, direct placement, payroll, and **Employer-of-Record (EOR)** services. Contracts here are Engagement Letters (ELs), Recruitment/Restricted Services Agreements (RSAs), and staffing Master Services Agreements (MSAs). Default governing law is **Florida / Miami-Dade County**, arbitration under **AAA**.
- **SA Product Ops (SAPO)** — operates the **Scale Army Agents (SAA)** software platform (an enterprise AI-powered sales-engagement SaaS). Contracts are SaaS MSAs, Statements of Work / Order Forms, and the SAA public Terms & Conditions / Privacy Policy. Default governing law for SAPO/SAA is **Delaware / New Castle County**, arbitration under **AAA Commercial Rules** (with **JAMS** used in some California-governed engagements).

The SAPO operating legal entity name is **not yet confirmed**; the SAPO MSA signature block has read "SA Product Ops (Scale Army LLC)," but this has been deliberately left as a bracketed placeholder rather than hard-coded. See Open / unresolved.

---

## Core contractual identity: EOR / administrative-only posture

**Also asked as:** what is Scale Army's role in the contract; does Scale Army supervise talent; does Scale Army access client systems; why do we reject oversight/data/IP obligations.

Scale Army's consistent contractual identity across all staffing negotiations: **Scale Army is an administrative / EOR / payroll provider only.** It does **not** access client systems, supervise day-to-day Talent work, or direct Talent conduct. Its function is limited to talent search, vetting, and payroll processing.

This principle is the primary defensive tool and is used to defeat or reframe obligations around:

- System and data access
- IP guarantees or control over deliverables
- Day-to-day supervision, KPIs, performance tracking, or reports
- Operational performance warranties
- Talent conduct

Those risks are consistently reframed as **Client–Talent matters**, governed by the operational exhibit (Exhibit C in the staffing template), not Scale Army obligations. The supporting logic: **liability asymmetry tracks who controls the risk surface.** Scale Army neither directs Talent's work nor controls the Client's systems/data, so Talent-caused risk belongs in the Client–Talent relationship. See the liability cap / damages exclusion section below.

---

## Negotiation matrix: four-tier framework for MSA change requests

**Also asked as:** how do we triage client redlines; what are the negotiation tiers; can I grant this change; when do I escalate.

See also the [[commercial-legal-engagement-knowledge-base|Commercial Legal & Engagement Knowledge Base]] MSA negotiation matrix, dispute-resolution policy, and non-solicit guardrails for Scale Army's pricing/commercial side.

All client-requested changes to a Scale Army MSA/EL/RSA are evaluated against four standing tiers:

1. **Open to Negotiate** — freely grantable at the deal level.
2. **Requires Management Approval** — escalate to **Yosele** (and to **Lisa** where liability or regulatory exposure is involved).
3. **Non-Negotiable / Legal Lockdown** — cannot be modified without an **explicit exception grant from Joel**.
4. **Notes / Context** — an engagement-specific fact, not a policy or precedent.

Working practice: **triage before drafting.** Produce a structured accept / reject / escalate analysis first; do clause work only after direction is confirmed. Deviations from standard positions should be flagged proactively, not left to ride silently. See the escalation paths and recurring non-negotiable positions sections below.

---

## Escalation paths and approval ownership

**Also asked as:** who approves this; who signs off on liability language; who owns legal decisions; who is Yosele / Lisa / Alex.

| Role | Person | Owns |
|---|---|---|
| CEO / principal | **Alex** | Internal business-decision approver; sometimes surfaces legal questions; drives commercial framing (e.g. pushed ASI toward a concise single-cumulative cap) |
| Head of Ops | **Yosele ("Yos")** | Management-level approver for matrix deviations and non-standard positions; sign-off on jurisdiction deviations, credit/refund concessions, buy-out windows, spend/risk authorization |
| Outside legal counsel | **Lisa** | Final authority on liability language, regulatory exposure, and compliance decisions |
| Ops / rollout lead | **Dijah** | Ops and rollout, involved in the direct-placement product |
| Legal/contracts operator | **Joel** | Runs negotiations; holds authority to grant Non-Negotiable exceptions |

**Recurring escalation rule:** liability and damages-exclusion concessions go to **both Yosele (deviation from the locked position) and Lisa (liability/regulatory)**. Jurisdiction/governing-law deviations go to **Yosele**. Data-scope/security covenants imposing affirmative obligations on Scale Army go to **Lisa** (and often Yosele).

---

## Recurring Non-Negotiable positions (Legal Lockdown)

**Also asked as:** what can't we change; what's locked; what are the legal lockdown items.

The following are standing Non-Negotiable / Legal Lockdown items. Each requires an explicit exception grant to move:

- **Liability cap** of one month of fees, **paired with** the damages exclusion clause (a cap concession alone is illusory — see the illusory-cap principle below).
- **12-month credit reuse mechanism** — no cash-refund alternative without management approval.
- **Florida / Miami-Dade governing law and venue** for staffing agreements (deviations require Yosele approval).
- **Non-circumvention scope and SA Contact definitions.**
- **Successor / dissolution liability clause (§14.5)** — enforcement backstop for non-solicitation and indemnification.

---

## Liability cap and the damages exclusion (illusory-cap principle)

**Also asked as:** why is raising the cap pointless; what is the "under no circumstances" exclusion; the cap is a red herring; illusory cap.

See also the liability cap discussion in the [[msa-contracting-legal-commercial-guardrails|MSA Contracting Legal & Commercial Guardrails]] ("Liability Allocation" sections) for the AI-services and legacy-staffing cap precedents.

The standard Scale Army liability clause pairs a **one-month-of-fees cap** with a broad **damages exclusion** that reads (in the staffing template) that "under no circumstances" is Scale Army liable for direct, indirect, incidental, special, or consequential damages, IP, negligence, or data loss/breach — "even if... the result of Talent's actions."

**Core principle:** because the exclusion excludes the very categories clients care about (data breach, negligence, IP) "under no circumstances," it **bypasses the cap entirely** — exposure in those categories is effectively zero, not one month. Therefore **raising the cap number does nothing** unless the exclusion is also explicitly overridden for whatever is being carved back. A raised cap without an explicit **direct-damages override** is illusory.

**Standard defensive posture:** hold Talent-caused exclusions (breach/negligence/IP in the Client's environment belong to the Client–Talent relationship). Where a sophisticated counterparty pushes, the defensible concession is a **narrow own-fault carve-back** — limited to **Scale Army's own gross negligence, willful misconduct, or breach of its own confidentiality/data-security obligations** — with a modest single cumulative super-cap **and an explicit direct-damages override** so the carve-back is not itself illusory. **Do not** accept the counterparty capping *their* indemnity back to Scale Army as a symmetry play; Scale Army's protection for Talent-service claims depends on that indemnity staying uncapped. See the privileged negotiation and dispute strategy section below.

---

## Misclassification super-cap carve-out (separable concession)

**Also asked as:** can we raise the cap just for misclassification; is the misclassification carve-out a big concession; foreign government labor claims cap.

A carve-out that raises the cap **only** for **labor-misclassification claims** is treated as **separable** from the general cap negotiation and is a **defensible, low-risk concession**, because Scale Army already bears classification risk as the Employer of Record and controlling party. Granting it does not shift new risk; it prevents the general cap from nullifying an indemnity Scale Army already offers.

**Structural rules learned (from the American Safety Institute / "Exhibit E" addendum work):**
- Use a **single cumulative, non-resetting cap** across all misclassification claims — **not** a per-Talent cap, which allows unlimited stacking across a multi-Talent audit.
- "Greater of $X or Y months of fees" sets a **floor** (guarantees the cap is at least $X); "lesser of" **restricts** exposure. Choose deliberately.
- Include a **direct-damages override**, or the raised cap is illusory against a foreign tax/social-security assessment.
- Opening protective position includes a **fault carve-back** excluding claims arising from the Client's own direction/control, the Client's misrepresentation, or the Talent's conduct.

---

## Governing law and venue defaults by entity

**Also asked as:** what governing law do we use; what's our default venue; where do disputes go; arbitration seat.

- **Scale Army staffing / EOR (PLTWG LLC):** default **Florida law, Miami-Dade County venue, AAA arbitration.** Deviations are Non-Negotiable and require Yosele approval.
- **SA Product Ops / Scale Army Agents (SAPO/SAA):** default **Delaware law, New Castle County, AAA Commercial Rules.** **JAMS** has been used in California-governed engagements (e.g. the Dr. Killigan's matter).

**Deviations that have been requested or applied (each a conscious sign-off, not silent):**
- **Multnomah County, Oregon** — Genevieve Shaw / Scale Army client MSA (client is an Oregon entity).
- **California / JAMS** — Dr. Killigan's engagement.
- **Wilmington / Delaware** — requested by Artica Collective; flagged Non-Negotiable.

A recurring structural device: **carve fee-collection actions out of arbitration and into court**, so unpaid-fee claims can proceed in a court of competent jurisdiction. See the prevailing-party clause section below.

---

## Buy-out window approval rule and Exhibit B pricing

**Also asked as:** can we approve a shorter buy-out window; how is the buy-out fee calculated; Exhibit B pricing tiers; cost recovery month 4.

**Cost-recovery logic:** months **1–3** of an engagement recover Scale Army's cost of hiring the resource; **margin generation begins in month 4.** A buy-out window **shorter than the standard 12 months** may be approved **only if**: (a) cost recovery is cleared (engagement is **past month 3**), **and** (b) the buy-out fee plus banked margin adequately compensates for forgone future margin. Log any shortened window as a deviation.

**Exhibit B pricing tiers (confirmed against the embedded pricing image):**
- Gross candidate monthly rate **below $3,000** → **$7,000 flat** one-time buy-out fee.
- Gross candidate monthly rate **$3,000 and above** → **19.5% of the annual rate**, one-time.

**Known ambiguity to resolve per deal:** Exhibit B labels the 19.5% base "Gross Candidate Monthly Rate," but the arithmetic has sometimes been run on the **monthly client Fee** instead. Fee-basis vs. candidate-gross-basis is a material dollar difference (the tier test is unaffected; the resulting figure is not). Confirm which base the separate buy-out agreement uses before quoting. Note that the Exhibit B table is an **embedded image**, so it cannot be changed by find-and-replace and must be regenerated manually.

---

## Non-circumvention, SA Contact definition, and liquidated damages

**Also asked as:** what is an SA Contact; non-circumvention period; liquidated damages figure; the $150k floor; dual-scope contact definition.

- **SA Contact** is defined with a **dual-scope structure** distinguishing (i) **Candidates** presented for placement from (ii) **Scale Army's internal talent / SA Contacts**. Narrowing the SA Contact scope is held **Non-Negotiable**.
- **Non-circumvention / restrictive period:** the standard has been **24 months**, but engagements have been aligned to **12 months** (a matrix deviation requiring management sign-off). When an EL and RSA carry different tails, **align both**; the **RSA execution date is the preferred controlling clock** because it runs later and provides longer protection.
- **Liquidated damages:** historically a **$150,000 floor** (framed as a reasonable pre-estimate, "not a penalty"). In the Hatcher engagement the $150,000 floor was **removed as an engagement-specific outcome**, replaced by **the Placement Fee, or 12x monthly salary where no placement fee applies**. That removal is a **file-level fact, not a policy change** — future deals start from the standard $150,000 position. See the engagement-specific-concession-vs-policy-deviation section below.
- The **12x-monthly-salary fallback** carries the deterrent where no placement fee exists; keep the "(or, if none applies, 12x)" language intact in both documents.

---

## Credit reuse vs. cash refund (12-month credit mechanism)

**Also asked as:** can the client get a cash refund; is the credit convertible; termination refund of prepaid fees.

The standard termination remedy is a **12-month credit reuse mechanism** for unused prepaid fees. It is **Non-Negotiable specifically on the point that it is not convertible to cash.** Converting the credit to a **cash refund** is a deviation requiring **management (Yosele) approval** — it has been requested/applied in the Genevieve Shaw MSA and by Artica Collective, and each instance must be consciously signed off, not left silent.

---

## Late-fee rate standard and enforceability

**Also asked as:** what late fee do we charge; is 3% enforceable; standard interest on overdue invoices.

The **matrix default late fee is 1.5% per month.** A **3%/month compounded** rate appeared in the Genevieve Shaw base body (~42.6% effective annual) and was flagged for an **enforceability second look under Oregon law**, plus confirmation it was intentional. The MSA itself is treated as constituting written notice of late fees. Late-fee/interest rates are a per-deal confirmation item (e.g. the Hatcher EL late-interest rate in section C3-b was pending Yosele confirmation).

---

## Successor / dissolution liability backstop (§14.5)

**Also asked as:** what happens if the client dissolves; successor liability clause; the §14.5 backstop.

**§14.5 (successor/dissolution liability)** is a Non-Negotiable enforcement backstop that preserves **non-solicitation and indemnification** obligations against a counterparty's successor or dissolution. It exists to prevent a counterparty from escaping these obligations by reorganizing or winding down.

---

## Engagement-specific concession vs. policy deviation

**Also asked as:** does this concession set precedent; is this a policy change; file-level fact vs. matrix change.

**Rule:** when a position is conceded for a specific client, it is a **file-level fact, not a change to Scale Army's standard template or negotiation matrix.** **Future deals start from the standard position.** Examples treated as engagement-specific (not precedent): the Hatcher $150,000 liquidated-damages removal; a specific client's Oregon venue; a specific client's cash-refund alternative; a specific client's shortened buy-out window.

---

## Cross-document consistency: reconciling EL and RSA before execution

**Also asked as:** do the EL and RSA match; why do the documents drift; reconcile before signing.

Engagement Letter (EL) and Recruitment/Restricted Services Agreement (RSA) provisions **must be reconciled before execution.** Recurring drift points that have caused problems:

- **Damages figures** differing between EL and RSA.
- **Non-circumvention tail** differing (e.g. 24 months in EL vs. 12 in RSA) — align both, controlling on the RSA execution date.
- **Contact catch-all** language correct in one document but wrong in the other.
- **SA Contact** phrasing inconsistencies.
- **Card-on-file vs. invoice** payment mechanics drifting from what was actually committed to the client.

A live cautionary example: in the Hatcher matter, "Accept All" would have silently locked a client edit gutting the $150,000 figure that had never been reverted. Always verify the diff clause-by-clause; do not rely on accept-all.

---

## Prevailing-party clause and the fee-collection court carve-out

**Also asked as:** can we recover attorneys' fees; prevailing-party clause; who pays legal costs in a fee dispute; routing unpaid fees to court.

A recurring structural device routes **fee-collection actions out of arbitration and into court**, paired with a **one-directional prevailing-party (fee-shifting) clause in Scale Army's/SAPO's favor** for those court-routed non-payment disputes. If unpaid-fee claims are carved into court **without** the prevailing-party clause present, the mechanism is gutted — this gap was flagged in the Genevieve Shaw cleaned copy, where the prevailing-party language was missing from that version and recommended for restoration.

**Important limitation for collections:** the presence or absence of a prevailing-party / collection-costs clause **in the specific underlying agreement** determines whether collection fees can be pushed onto a debtor. The Ticket Fairy services agreement contains **no** such clause, so no collection fee may be added to that debtor's balance. See the Ticket Fairy debt collection workstream below.

---

## AI-generated legal analysis: verification requirement

**Also asked as:** can I trust the AI's clause reading; do we verify AI legal analysis; AI hallucination risk in contracts.

AI-generated legal analysis has produced **hallucinated section references** and has **misread arbitration subclauses as applying to a whole agreement.** Standing rule: **AI analysis must always be verified against the actual uploaded document** before it is relied upon. Anchor on operative language, not paraphrase.

---

## DOCX tracked-changes analysis workflow (operational)

**Also asked as:** how do we parse redlines; extracting tracked changes from Word; comparing two contract versions.

Reusable workflow for `.docx` contract analysis:

- Copy the upload to a working directory and unzip it; delete symlinks; parse `word/document.xml` with Python regex (DOTALL) for tracked changes — insertions via `w:ins`, deletions via `w:del`, with `w:author` attributes for authorship.
- Extract comment text from `word/comments.xml`; match `w:t` with optional attributes (not a bare tag) to handle attributed tags; deletions use `w:delText`.
- Run pandoc twice — `--track-changes=accept` and `--track-changes=reject` — because both are required to see what was inserted vs. deleted; `diff` on the two markdown outputs gives a clean clause-level delta.
- For clause-region searches, anchor on a known phrase and slice a ~2,000–3,000 character window in the raw XML; this is more reliable than line-based grep on rendered markdown. Grep counts on single-line XML are misleading — use Python regex for element counts.

Tools in use: **Pandoc** (extraction), **Python/bash** (XML parsing), **Dropbox Sign / HelloSign** (executing settlements and releases).

---

## Scale Army Agents (SAA) Privacy Policy — controller/processor split

**Also asked as:** is Scale Army a controller or processor; who is responsible for consent on prospect data; SAA data roles; GDPR role of the platform.

The SAA Privacy Policy (a product-informed draft pending counsel finalization) sets a **controller/processor split**:

- **Controller** (SAPO responsible for lawful basis): User account/identity/billing data; website analytics, product usage, and diagnostic data.
- **Processor** (Customer is controller and is **solely responsible** for lawful basis, notice, and honoring individual rights): **Prospect/Contact data** uploaded, CRM-synced, or generated in campaigns; message content, transcripts, and dispositions produced during a Customer's campaigns.

For processor data, SAA processes only on the Customer's documented instructions and only to provide the Service, governed by the Data Processing Addendum (DPA). Individual-rights requests about campaign data are referred to the relevant Customer as controller. The platform states it does **not sell** personal information and does **not** use Customer-processed Prospect data for its own independent purposes.

**Security representations made:** encryption in transit (TLS) and at rest for sensitive credentials — third-party OAuth tokens and static integration secrets encrypted with **AES-256-GCM**; multi-tenant isolation enforced server-side per request; RBAC/least-privilege; rate limiting; audit logging; sandboxed execution of untrusted automation code. The platform is a business tool **not directed to individuals under 18.**

---

## Scale Army Agents (SAA) Terms & Conditions — key customer positions

**Also asked as:** what does the customer agree to; SAA liability cap; customer outreach responsibility; AI-output disclaimer.

Key positions in the SAA Terms & Conditions (customer-facing draft, yields to any signed Order Form/MSA on conflict):

- **Customer outreach responsibility:** the Customer is **solely responsible** for having a lawful basis and any required consent to contact each Prospect, for notices and opt-outs, for suppression lists, and for the content and legality of all messages and quotations. See the messaging/telecom compliance section below.
- **AI-generated content:** output (messages, evaluations, **quotations**) is probabilistic and may be inaccurate; the Customer must review and approve before sending; **AI-generated quotations are not binding offers** unless independently confirmed and issued; no warranty of accuracy/fitness.
- **Warranties:** Service provided "as is" / "as available," no warranty of uninterrupted, error-free, or secure operation.
- **Liability cap (public T&C draft):** limited to amounts paid in the preceding **12 months**, with the standard exclusion of indirect/consequential damages. **Note the divergence:** the negotiated SAPO **MSA** has used a **"lesser of six-month fees or $25,000"** cap (raised to **$75,000** in the Newton engagement with gross negligence at 3x fees and willful misconduct uncapped). Whether the public T&C should expose the harder MSA ceiling is an open question for Lisa.
- **Indemnification:** Customer indemnifies SAPO for its Customer Data, campaigns/outreach, breaches of the Acceptable Use Policy or law, and third-party-rights infringement.
- **Governing law / disputes:** Delaware / New Castle County, AAA; a bracketed class-action / jury-trial waiver has been added as a companion to arbitration.

---

## Messaging and telecom compliance — customer-side obligations

**Also asked as:** who is responsible for TCPA compliance; 10DLC; CAN-SPAM; opt-out obligations; is the customer or SAA liable for spam.

Under the SAA Terms, outbound messaging is a **regulated activity and the Customer's responsibility.** The Customer must comply with applicable laws and industry rules, which the draft lists (without limitation) as the **TCPA, CAN-SPAM Act, TSR, CASL, GDPR/ePrivacy**, and carrier/messaging requirements such as **10DLC registration, sender verification, and opt-out handling**. The Customer must obtain and maintain all required consents and must not disable or circumvent opt-out mechanisms. SAA reserves the right to **suspend messaging** it reasonably believes violates these obligations or provider policies. The Acceptable Use Policy also bars contacting individuals without a valid legal basis/consent or after opt-out, and bars uploading sensitive categories (health, financial-account, government-ID, children's data) absent written permission.

---

## AI subprocessors and no-training commitments (SAA)

**Also asked as:** which AI providers does SAA use; do the AI providers train on our data; OpenRouter and OpenAI Realtime; no-training clause.

The SAA platform transmits message/conversation content, prompts, and context to AI model providers: **chat-completion features use OpenRouter; real-time voice uses the OpenAI Realtime API.** Other named subprocessors include Clerk (identity), Stripe (payments), Twilio/Sendblue and other Customer-connected telephony, AWS (hosting), Vercel (web), Temporal Cloud (workflow orchestration), Sentry (error monitoring), and Browserless (calendar-page automation).

**Per-customer data-use covenant drafted** (campaign execution, SAA's own analytics, per-account quoting fine-tune, per-account prompt optimization, ongoing, no cross-customer use). **Open item:** whether the **AI providers themselves (OpenRouter, OpenAI Realtime) process transmitted content under no-training terms** is left as a bracketed placeholder pending product-team confirmation, because a false representation there is exactly the exposure being avoided. A parallel "no training on Client data" covenant appears in negotiated MSAs (e.g. Newton §2.2, Genevieve Shaw §5).

---

## Active workstream — Cure Solutions MSA

**Also asked as:** where does Cure Solutions stand; the Cure liability dispute; Cure carve-back.

Cure Solutions is a Scale Army MSA counterparty with **healthcare/financial downstream** obligations (BAA, incidental PHI in scope). **Under dispute:** the **liability cap** (one month of fees) and the **damages exclusion** clause. Cure objects that the exclusion renders the cap illusory for Talent-caused harm, data breach, negligence, and IP; the exclusion runs "under no circumstances... even if the result of Talent's actions." Supporting model provisions in the Cure document: §14.1 limits Scale Army to talent search/vetting/payroll; §14.4 disclaims legal oversight; a "No Success Guarantee" section confirms Scale Army does not oversee Talent's daily tasks; the indemnity split is narrow from Scale Army (labor classification) and broad from Cure (Talent's provision of services).

- **Status:** flagged as a **dual Non-Negotiable** requiring escalation to **both Yosele and Lisa**. It was **absent from Yosele's prior Cure memo** (which covered deposit, non-solicit, entity, classification, medical info, incidental PHI, and the BAA — but not the cap), making it a **fresh escalation item**.
- **Recommended path (privileged — see the Handle with care section below):** hold Talent-caused exclusions; offer a narrow **own-fault carve-back** limited to Scale Army's own gross negligence / willful misconduct / breach of its own confidentiality obligations, with a single cumulative super-cap (number set by Yosele) and an explicit direct-damages override; **do not** let Cure cap its own indemnity back to Scale Army.

---

## Active workstream — Genevieve Shaw / Scale Army client MSA (Oregon)

**Also asked as:** where does the Genevieve Shaw MSA stand; the Oregon venue deal; the no-AI-training covenant; the cash-refund client.

An MSA with a client-side counterparty **Genevieve Shaw**, linked to an existing engagement letter. Authorship of the current cleaned copy is split: Shaw (client, 7/08) added exactly two things — a **data-use / no-AI-training covenant** and a **breach-notification line in §5**; most other edits (ACH payment policy, late-fee notice line, refund alternative, Oregon venue, Exhibit C clause, elected PTO) are **Scale Army's own drafting** (Joel Zamora, 7/10 and 7/30).

Items requiring conscious sign-off before this moves:
- **Governing law + venue flipped to Multnomah County, Oregon** (§15 mediation, §15 arbitration seat, §16 governing law) — Non-Negotiable jurisdiction item, needs **Yosele** approval (client is an Oregon entity).
- **Cash-refund alternative** added to the §10 credit clause — deviation from the not-convertible-to-cash rule, needs management approval.
- **Shaw's §5 data covenant** ("Scale Army shall not use Client data... to train artificial intelligence models...") plus breach notification — Management Approval + **Lisa** review; contains a typo ("third part" → "third party") and sits in slight tension with the §12 data-loss/breach disclaimer.
- **Prevailing-party clause missing** from the court-routed fee-collection track in this copy — recommended for restoration.
- **Late fee reads 3%/month compounded** vs. the 1.5% default — enforceability check under Oregon law.

---

## Active workstream — Hatcher direct-placement EL and RSA

**Also asked as:** where does the Hatcher deal stand; the MH / Matthew Hatcher documents; the $150k removal; card-on-file fix.

A direct-placement engagement (client **M. Hatcher / Matthew Hatcher**) across an Engagement Letter (EL) and Recruitment/Restricted Services Agreement (RSA). **Resolved outcomes:**
- The client's move to gut the **$150,000 liquidated-damages floor** was ultimately **agreed** (Joel took accountability for not rejecting it in time); struck from both documents and replaced by **the Placement Fee, or 12x monthly salary where no fee applies.** Logged in the Yosele deviation bundle as a decided deviation, alongside the 12-month non-circ tail, credit-not-refund, and the California seat. This is **engagement-specific, not a policy change**.
- **Card-on-file corrected** to match the client commitment: amounts owed are **invoiced (payable within 30 days) and not charged to a payment method on file without written authorization.**
- **Non-circumvention tail aligned to 12 months** across both documents (EL had 24, RSA had 12).
- Excluded Claims definition cleaned; Excluded Claims may be brought in Delaware courts.

**Direct Placement EL — five pending edits identified but not yet actioned:** paid-placement carve-out; SA Contact definition exclusion; clock alignment; right-sized damages for candidate vs. internal-staff circumvention; updated talent-acknowledgment representation. Late-interest rate (EL section C3-b) was pending Yosele confirmation.

---

## Active workstream — Ticket Fairy debt collection

**Also asked as:** the Ticket Fairy collections matter; the $35k unpaid invoices; which collection agencies; can we add collection fees.

**The Ticket Fairy, Inc.** (Los Angeles) owes Scale Army approximately **$35,000** across roughly **8–9 months** of unpaid invoices under a signed written services agreement (placement of a full-time account executive at a fixed **$4,050/month**, signed **August 2025**). The debtor has gone silent with **no dispute on record**; it is a seed-stage company. The agreement is **governed by Florida law but expressly carves fee-collection out of arbitration into court**; the debtor is domiciled in Los Angeles.

- **Standing instruction:** Scale Army does **not** authorize adding any collection fee onto the debtor's balance, because the underlying agreement has **no prevailing-party or collection-costs clause**.
- **Outreach drafted to:** law firms **Ronald P. Slates** (hourly/blended-rate detail, incl. prejudgment writ of attachment) and **Stevens & Ricci** (hybrid contingency, via web form); CLLA-certified contingency agencies **Caine & Weiner** (contact: Greg Cohen), **NCCS** (contact: Lawrence Cassidy), and **C2C Resources**. **Greenbaum (collectionlaw.com)** was already contacted and needed no new message.
- **Data-sharing rule:** with law firms, fuller case detail is appropriate without an NDA (prospective-client confidentiality applies — cited in prior work as the ABA Model Rule 1.18 / California-equivalent framework, framed as standard practice, not legal advice). With **agencies** (unvetted commercial vendors, no privilege), apply **data minimization** at the quote stage — debtor name/location, amount, rough age, and desired outcome only; withhold the placed contractor's name, signatories' emails, fee mechanics, and document IDs until vetting and placement.
- **Vetting standard:** **CLLA (Commercial Law League of America)** certification plus independently audited trust account, license/bond, and complaint history; for law firms, state-bar standing verification substitutes.

---

## Prior engagement precedent facts

**Also asked as:** what did we do on Newton / ASI / Killigan / Artica / Websiteness / Stargo / Everpass; prior deal terms; precedent positions.

Compact record of closed or reference engagements that establish reusable positions. Treat client-specific outcomes as **file-level facts**, not policy.

| Engagement | Entity / type | Key established facts |
|---|---|---|
| **Newton (a/k/a Alta Arbor)** | SAPO SaaS MSA — RFQ-to-Quote Automation Agent (Cin7 + Salesforce) | General liability cap raised to **$75,000**; **§4.3(d)** carve-outs (gross negligence, willful misconduct, confidentiality, IP) were already present in the original, not new; gross negligence capped at **3x fees paid**, willful misconduct uncapped; mutual indemnification (§5.2) accepted; non-solicit held at **24 months**; §2.2 aggregated-data / no-AI-training clause; §10.4 suspension revised to a **3-business-day** notice-and-cure for non-urgent triggers; "knowingly" added to §6.1 non-solicit. |
| **American Safety Institute (ASI)** | Scale Army — Exhibit E addendum to executed Client Agreement (dated **June 11, 2025**) | Misclassification super-cap for claims by **foreign governmental authorities**; shifted from per-Talent to **single cumulative non-resetting cap**; direct-damages override preserved (Section 12 is the operative liability provision, "under no circumstances" excludes direct damages); fault carve-back; **Florida law, Miami-Dade/AAA**. Requires Lisa + Yosele sign-off. |
| **Dr. Killigan's, Inc.** (signatory Amanda Bishop; commenter Dan Mehr) | Scale Army EL, Redding, CA | **California governing law, JAMS** arbitration; "Interim Understanding" clause; non-circ reduced **24 → 12 months** (matrix deviation); dual-scope SA Contact definition kept; deleted Candidate-Side Acknowledgment and "highly trained and valuable assets" recital; narrowing SA Contact scope declined as Non-Negotiable. |
| **Artica Collective LLC** (contact Duncan Butcher) | Scale Army MSA (heavily redlined) | Requested: credit→refund conversion, cap 1→12 months, remove damages exclusions, jurisdiction to **Wilmington/Delaware** — all flagged Non-Negotiable conflicts. |
| **Websiteness** | Scale Army staffing MSA | **6-month buy-out window approved** for resource "Diego" ($5,700/mo fee, ~$2,000 margin, buy-out ~$13,338); confirmed cost recovery cleared; 19.5% fee-vs-gross base ambiguity flagged; misclassification carve-out treated as separable. |
| **Stargo Brands** | Scale Army MSA | One-time payment exception: Month 1 part-time full advance; Months 2–6 split into two equal installments (one advance, one end-of-month); Month 7 reverts to standard; buy-out computed on the **fee basis** (approved). |
| **Everpass** | SAPO recruitment services agreement | Fee owed only on successful placement (Candidate's start date, payable within 5 business days); Dispute Resolution: 30-day good-faith negotiation then **AAA arbitration, New Castle County, Delaware**, with a court carve-out for unpaid fees and equitable relief; prevailing party in fee-collection recovers attorneys' fees. |

---

## Vendor agreements reviewed (Scale Army / SAPO as buyer)

**Also asked as:** the Deel contract risks; the SendEngage review; what to watch in vendor agreements.

When Scale Army/SAPO is the **buyer**, the review lens flips from its usual vendor posture. Key flagged items:

- **Deel MSA:** **§11.2.5** grants Deel **sole-discretion immediate termination with no cure period** for platform "misuse" — stands apart from other triggers that allow 14–30 days to cure. Also: **§8.1(d)** indemnity exposure for "use, attempted use, or misuse"; **§9.2/§9.3** disclaimers ("as is," no uptime guarantee); **§3** non-exclusive/non-sublicensable/non-transferable license subject to a separate Terms of Service; **§4.7** access revocation for outstanding payments after termination. Deel's separate ToS (not reviewed) likely holds the granular acceptable-use definition.
- **SendEngage** (AI cold-email lead-gen vendor): highest risks were **full prepayment before services delivered**, **no termination rights or cure period**, **no SLA/performance guarantees**, and **no indemnity or DPA** despite GDPR/CCPA references; brand/sender-reputation exposure from outreach under Scale Army domains. Favorable: mutual confidentiality (2-year survival) and renewal requiring client approval (no auto-renew). DPA gap routed to Lisa.

---

## Tools and resources

**Also asked as:** what tools do we use for contracts; e-signature platform; arbitration bodies; certification standard for collections.

- **Dropbox Sign / HelloSign** — executing settlement agreements and releases.
- **Pandoc**, **Python/bash** — DOCX text extraction, tracked-changes analysis, XML parsing, clause-level diffing.
- **CLLA certification** — vetting standard for commercial collection agency selection.
- **AAA Commercial Rules** — arbitration standard for SAPO/SAA agreements (Delaware / New Castle County).
- **JAMS** — arbitration in some client-specific engagements (e.g. California-governed).

---

## Open / unresolved

**Also asked as:** what's still pending; unconfirmed items; open brackets; awaiting approval.

Do **not** state these as settled fact:

- **SAA / SAPO AI-provider no-training representation** — whether OpenRouter and OpenAI Realtime process transmitted content under no-training terms is an **open bracket** pending product-team confirmation.
- **SAPO operating legal entity name** — left as a placeholder; the signature block reference "SA Product Ops (Scale Army LLC)" is **not confirmed** as the correct legal entity.
- **Public T&C liability ceiling** — whether the SAA public Terms should expose the harder negotiated-MSA ceiling ("lesser of six-month fees or $25,000") or stay softer (12-month/no hard ceiling) is a decision for Lisa.
- **Direct Placement EL — five pending edits** not yet actioned: paid-placement carve-out; SA Contact definition exclusion; clock alignment; right-sized damages for candidate vs. internal-staff circumvention; updated talent-acknowledgment representation.
- **Lisa review pending on:** Cure Solutions liability/exclusion structure; Genevieve Shaw §5 data covenant; SAA AI-automation disclaimer, liability cap exposure, and class-action waiver before publishing.
- **Yosele approval pending on:** Cure Solutions own-fault carve-back exception; Genevieve Shaw Oregon governing-law deviation; Genevieve Shaw cash-refund credit-clause deviation; Hatcher late-interest rate confirmation.
- **Ticket Fairy** — agency/firm responses pending; hourly/blended (Slates) vs. contingency decision, and whether to fund a prejudgment writ of attachment, sit with Yosele.
- **Exhibit B 19.5% base** — fee-basis vs. candidate-gross-basis must be confirmed per deal before quoting.
- **Genevieve Shaw 3%/month late fee** — intentional? Enforceable under Oregon law? Not confirmed.

*Where a specific statute section, case name, or exact date is needed for any of the above and is not stated here, it is genuinely not on record in this project — obtain it from the source document or counsel rather than assuming.*

---

## Handle with care — privileged negotiation and dispute strategy

**Also asked as:** what's privileged; sensitive strategy; don't index broadly.

The following are **litigation-adjacent or attorney-directed strategy** and should be treated as **privileged / restricted**, not surfaced broadly even internally:

- **Negotiation carve-back playbook** — the specific "hold X, concede only Y, watch for the symmetry trap" positions in the liability cap / illusory-cap section, the misclassification super-cap section, and the Cure Solutions recommended path. These reveal our walk-away lines and reserve concessions.
- **Ticket Fairy collection strategy** — the choice of attachment-speed vs. cost, settlement-authority thresholds, data-minimization posture toward agencies, and firm/agency comparison. This is an active, adverse matter; the debtor should not be able to infer our approach.
- **Any content reflecting Lisa's (counsel's) direction** on liability, regulatory exposure, or the SAA AI-automation disclaimer — potential attorney-client privileged material; keep out of any externally reachable index.

Restrict this section (and the strategy portions of the active-workstream sections) to authorized legal/ops personnel; exclude from any surface that could be reached by a counterparty.
