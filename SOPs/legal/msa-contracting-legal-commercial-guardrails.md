---
title: "Scale Army MSA, Contracting, Legal and Commercial Guardrails Knowledge Base"
department: legal
category: reference
owner: "Yosele Angulo"
last_updated: 2026-08-21
hidden: true
---

This document consolidates the settled positions, recurring decisions, contractual precedents, and unresolved issues established through Scale Army's Master Services Agreement (MSA), addendum, Statement of Work (SOW), staffing, artificial intelligence (AI) enablement, data-use, pricing, liability, and related legal work. It is intended as an internal source of truth for answering contract questions consistently without treating one-off client concessions as universal policy.

## Core Scale Army Contracting Philosophy and Negotiation Principles

**Also asked as:** What is our general legal position? / How aggressive should our contracts be? / What do we protect by default? / What principles do we use when negotiating an MSA?

Scale Army's recurring contracting philosophy is:

- Keep agreements commercially lightweight, understandable, and non-aggressive in tone.
- Protect Scale Army from accidentally becoming responsible for risks that properly belong to the client.
- Avoid creating obligations that turn a staffing, educational, exploratory, or enablement engagement into a managed service unless Scale Army intentionally agrees to that scope.
- Avoid guaranteeing business outcomes, technical outcomes, regulatory compliance, security, revenue, savings, uptime, integrations, or production readiness unless explicitly negotiated.
- Client-specific concessions should not silently rewrite Scale Army's general legal protections.
- Use an addendum or SOW to modify a narrow commercial or operational matter while leaving the underlying MSA intact whenever possible.
- If a proposal materially changes Scale Army's risk profile, escalate instead of improvising language.
- Prefer commercially reasonable protections over language that appears punitive or hostile.
- When Scale Army is accepting client data, the contract should clearly allocate responsibility for the legality, sensitivity, accuracy, and permitted use of that data.
- When artificial intelligence tools are involved, preserve Scale Army's ability to use appropriate third-party AI and cloud tools and require human review of outputs.
- When a client wants production implementation, hosting, continuing operational responsibility, managed services, or similarly expanded scope, use a separate signed agreement or SOW.

The general decision rule is: **Scale Army should be accountable for the service it expressly agrees to perform, but should not implicitly become the client's insurer, compliance department, cybersecurity provider, software vendor, or guarantor of commercial results.**

## Master Services Agreement, Addendum and SOW Hierarchy

**Also asked as:** Does the MSA or SOW control? / What happens if an addendum conflicts with the MSA? / Can a SOW override the MSA? / How do we modify an existing agreement?

The preferred structure is:

- The Master Services Agreement (MSA) governs the overall relationship.
- A Statement of Work (SOW), Statement of Fees (SOF), or addendum may define specific commercial, operational, scope, pricing, term, service, configuration, or implementation details.
- A SOW, SOF, or addendum should override the MSA only to the extent the document expressly addresses the relevant subject or there is an unavoidable conflict concerning the services covered by that document.
- The MSA otherwise remains unchanged and in force.

A stronger hierarchy precedent developed in prior drafting is:

- Commercial or operational schedules may control matters such as:
  - pricing;
  - service selection;
  - term;
  - implementation details;
  - configuration;
  - integration details;
  - expressly defined deliverables.
- A commercial schedule should **not** unintentionally modify:
  - confidentiality;
  - data protection;
  - intellectual property;
  - indemnification;
  - limitation of liability;
  - acceptable-use restrictions;
  - dispute resolution;
  - governing law;
  unless the relevant section is expressly referenced.

For AI enablement addenda attached to an existing Scale Army MSA:

- The addendum supplements the existing MSA.
- The underlying MSA remains in force.
- The addendum controls only where a conflict concerns the AI enablement services addressed by the addendum.
- Existing MSA protections such as confidentiality, intellectual property, non-solicitation/non-circumvention, dispute resolution, and governing law should generally survive.

## Correcting or Replacing an Incorrect Addendum

**Also asked as:** How do we void a bad addendum? / What if an addendum had the wrong economics? / Can we replace an executed addendum without changing the MSA?

A prior Scale Army drafting precedent for an incorrect addendum was to:

- mutually rescind, terminate, and strike the incorrect addendum in its entirety;
- state that the incorrect figures rendered that version null and void for the intended transaction;
- execute a replacement addendum;
- specify that the replacement supersedes the previous addendum in full;
- leave the underlying MSA otherwise unchanged and controlling.

This is preferable to trying to patch numerous incorrect terms through informal interpretation.

## Contracting Entity Consistency

**Also asked as:** Which Scale Army entity belongs in the agreement? / Can we mix entity names? / What DBA language have we used?

A historical Scale Army contracting precedent identifies Scale Army as:

- **PLTWG LLC, dba Scale Army**

Other product-related contracting work has used or discussed separate Product Operations naming, including:

- **Scale Army Product Ops LLC**
- **SA Product Ops**

Prior review identified entity inconsistency as a contract defect when a document mixed formulations such as "SA Product Ops," "Scale Army Product Ops LLC," and "SA Product Ops (Scale Army LLC)."

The reusable rule is:

- Use one correct legal contracting entity consistently throughout an agreement.
- Do not mix a trade name, parent company, assumed entity, or different limited liability company as though they are interchangeable.
- Verify the appropriate contracting entity before execution when the service is outside ordinary Scale Army staffing.

### Open / unresolved

The available project record contains multiple historical entity formulations. It does not establish one universal entity for every current Scale Army business line.

## Liability Allocation: General Principle

**Also asked as:** What liability should Scale Army accept? / What is our normal liability cap? / Do we accept uncapped damages? / Who bears business risk?

Scale Army's reusable liability position is to limit exposure to a commercially proportionate amount connected to fees paid under the relevant engagement and to exclude remote or consequential business losses.

The core philosophy is:

- Scale Army should remain responsible for its express contractual obligations.
- Scale Army should not accept unlimited liability for client-controlled data, client decisions, third-party services, downstream deployment decisions, lost profits, or speculative business outcomes.
- A liability cap should be tied to the commercial size of the engagement rather than unlimited enterprise exposure.

Different Scale Army agreements use different caps, so the applicable template matters.

## Liability Cap for AI Enablement and AI Services

**Also asked as:** What is our liability cap for AI work? / How much exposure do we take on an AI pilot? / What damages do we exclude?

The restored-protections AI services template uses:

- an aggregate liability cap equal to **fees actually paid under the agreement**.

The same template excludes or seeks to exclude liability for categories including:

- indirect damages;
- consequential damages;
- lost profits;
- lost opportunities;
- data loss or data-breach-related losses;
- failures or conduct of third-party tools;
- problems caused by client-provided data;
- losses arising from deploying demonstration outputs.

For a free AI Leadership Intensive precedent, Scale Army used:

- a **$1,000 liability cap**.

The $1,000 cap is a precedent tied to a no-fee pilot and should not automatically be treated as the cap for every Scale Army engagement.

## Liability Cap in Legacy Staffing Agreements

**Also asked as:** What is our staffing MSA liability cap? / Is the staffing cap different from AI services?

A legacy Scale Army staffing agreement used a liability cap equal to:

- the amount paid to Scale Army during the **one month preceding the claim**.

This differs from the AI-services template, which uses fees actually paid under the relevant agreement.

### Open / unresolved

There is no single project-wide liability-cap formula established for every Scale Army service line. The correct cap depends on the governing template and transaction.

## Excluded Damages and Business Outcome Risk

**Also asked as:** Are we liable for lost revenue? / Can a client claim lost profits? / Do we guarantee savings? / Are we responsible if AI output causes a downstream loss?

Scale Army's reusable AI-services position is to disclaim liability and warranties related to:

- lost profits;
- lost opportunities;
- expected savings;
- expected revenue;
- production performance;
- integrations;
- uptime;
- regulatory compliance;
- downstream use of demonstration outputs;
- third-party AI or cloud tools;
- client data or client instructions;
- business decisions made based on AI outputs.

The general principle is that Scale Army provides the agreed service but does not guarantee the client's downstream economic outcome.

## Client Indemnification

**Also asked as:** When should the client indemnify Scale Army? / Who is responsible for claims caused by client data? / What happens if the client deploys an output illegally?

The restored AI-services protection set includes client indemnification for third-party claims connected to:

- client-provided data or materials;
- client systems;
- client instructions;
- the client's deployment or use of outputs;
- the client's violation of applicable law.

The precedent carves out Scale Army's own willful misconduct.

The reasoning is that Scale Army should not absorb third-party liability resulting from inputs, deployment decisions, systems, or legal obligations controlled by the client.

## No Outcome, Accuracy, Production or Compliance Guarantee

**Also asked as:** Do we guarantee AI results? / Is the pilot production-ready? / Do we promise revenue or savings? / Can the client rely on the demo?

Scale Army's standard AI enablement position is:

- Services are educational, exploratory, diagnostic, demonstration-oriented, or otherwise limited to the expressly contracted scope.
- Demonstration outputs are not automatically production systems.
- Scale Army does not guarantee:
  - accuracy;
  - completeness;
  - production readiness;
  - security;
  - integrations;
  - savings;
  - revenue;
  - compliance;
  - uptime;
  - a specific business outcome.
- The client must exercise its own judgment before using or deploying outputs.
- AI-generated outputs should be subject to human review.

A production implementation, operational system, ongoing support arrangement, or managed service requires separate written scope.

## Human Review of AI Outputs

**Also asked as:** Can the customer rely automatically on AI output? / Who validates AI-generated work? / Is Scale Army responsible for hallucinations?

The AI-services precedent requires the client to human-review artificial intelligence outputs before relying on or deploying them.

The underlying principle is:

- AI output is assistive rather than automatically authoritative.
- The client remains responsible for its business, legal, operational, and deployment decisions.
- Scale Army should not guarantee that generated material is error-free or suitable for a regulated or high-stakes use without appropriate validation.

## Educational and Exploratory AI Services vs. Managed Services

**Also asked as:** Are we a managed-service provider? / Does the AI intensive include implementation? / Are we supporting this in production? / Where does enablement end?

Scale Army's AI enablement agreements distinguish educational or exploratory services from managed services.

AI enablement may include activities such as:

- diagnostics;
- workshops;
- training;
- demonstrations;
- limited prototypes;
- exploration of possible workflows.

AI enablement does **not**, unless expressly contracted, make Scale Army:

- a managed-service provider;
- a software-as-a-service provider;
- a cybersecurity provider;
- a compliance provider;
- a legal-services provider;
- a production hosting provider;
- an ongoing operational support provider.

Production implementation or ongoing services require separate signed scope.

## Separate Agreement Required for Production or Ongoing AI Work

**Also asked as:** Can the pilot roll directly into implementation? / When do we need another SOW? / Is support included?

The restored AI-services contracting position requires a separate signed SOW or agreement for work such as:

- production implementation;
- managed services;
- staffing;
- payroll;
- hosting;
- continuing support;
- ongoing operational services.

This prevents a limited pilot, diagnostic, or training engagement from being interpreted as an open-ended commitment.

## Client Dependencies and Delays

**Also asked as:** What if the client delays access? / What if they do not provide data? / Are we responsible for delays caused by the customer?

The standard AI enablement process is to protect Scale Army against delays caused by client dependencies.

Relevant client dependencies may include:

- access;
- materials;
- data;
- approvals;
- personnel participation;
- systems access;
- feedback;
- technical cooperation.

The agreement should avoid making Scale Army responsible for missing a timetable where the client has not provided required dependencies.

Material changes to scope, fees, deliverables, assumptions, or dependencies should be documented in writing.

## Scope Changes Must Be in Writing

**Also asked as:** Can the client add something verbally? / How should we handle scope creep? / What counts as an approved scope change?

Scale Army's reusable AI-services contracting process is:

- define minimum service commitments;
- document material scope changes in writing;
- document fee changes in writing;
- document changes to deliverables or materials in writing;
- use a separate signed SOW when the engagement becomes production or managed work.

Informal conversations should not silently expand Scale Army's contractual obligations.

## Artificial Intelligence and Third-Party Cloud Tools

**Also asked as:** Can Scale Army use ChatGPT or other AI tools? / Do we need client approval for every AI vendor? / Who bears third-party-tool risk?

Scale Army's AI-services precedent permits the use of appropriate third-party:

- artificial intelligence tools;
- cloud tools;
- supporting technology providers.

The relevant terms recognize that third-party tools have their own:

- terms;
- limitations;
- availability;
- security characteristics;
- output behavior.

Scale Army should not guarantee the performance or availability of an independent third-party platform.

Client-facing contracts should not unintentionally prohibit the technology necessary to perform an AI engagement.

## Client Data Responsibility

**Also asked as:** Who is responsible for the data a client sends us? / Can clients send confidential data? / What data should they use during training?

The standard AI enablement process favors:

- synthetic data; or
- client-approved, non-sensitive data.

The client is responsible for ensuring that data and materials it provides may legally be provided and used for the engagement.

For sensitive data, the preferred approach is to minimize or de-identify the information unless a written agreement expressly authorizes a different handling model.

Scale Army should avoid silently taking responsibility for a client's decision to provide information outside the approved data-handling scope.

## Sensitive Data Restrictions for AI Enablement

**Also asked as:** Can we put healthcare data into the training? / Can they send credit-card data? / What should never be pasted into an AI tool?

Scale Army AI enablement precedents instruct clients not to provide categories of highly sensitive information without a separate written arrangement.

Examples specifically identified in prior agreements include:

- Protected Health Information (PHI);
- payment-card data;
- passwords;
- private keys;
- other highly sensitive information.

The preferred training and diagnostic environment uses mock, synthetic, de-identified, or otherwise approved non-sensitive data.

## Healthcare Data, PHI and Enterprise AI Plans

**Also asked as:** Can a healthcare client start on Team? / Do they need Enterprise? / What if training uses mock healthcare data? / Who is liable if they upload patient information?

For AI enablement involving healthcare organizations, the working Scale Army position is:

- Training can begin using mock, synthetic, or otherwise non-sensitive data.
- A customer may begin on a lower-tier AI workspace while the engagement remains limited to appropriate mock or non-sensitive data.
- Once Scale Army completes a fuller diagnosis of the customer's actual needs, usage, and data flows, a healthcare customer handling real healthcare data may need to move to an enterprise-grade environment for data-protection and compliance purposes.
- Scale Army should not represent a non-enterprise environment as approved for transmitting Protected Health Information (PHI) unless the relevant platform terms and contractual protections actually support that use.
- If a client independently chooses to submit regulated healthcare data outside the agreed setup, that decision should remain the client's responsibility rather than silently becoming Scale Army's liability.

The desired communication style is explicit but non-aggressive: explain the permitted training setup, identify the eventual compliance requirement, and clearly establish that the client assumes responsibility for data it introduces outside the agreed environment.

### Open / unresolved

The project record does not establish a universal Scale Army Business Associate Agreement (BAA) or a final standardized healthcare-data clause applicable to every AI platform and healthcare customer.

Platform-specific compliance requirements must be verified against the applicable vendor plan and current terms before making definitive regulatory representations.

## Scale Army Position on BAAs and Managed-Services Data Agreements

**Also asked as:** Will Scale Army sign a BAA? / Are we a Business Associate? / Will Scale Army accept a healthcare data-access agreement? / Can staffing clients make Scale Army responsible for their systems?

A prior Scale Army position for the staffing business was:

- Scale Army does not provide a Business Associate Agreement (BAA) or equivalent managed-services data-access agreement merely because a placed resource works with a healthcare client.
- Scale Army's role is staffing, recruiting, payroll, or related workforce administration rather than operation of the client's healthcare systems.
- An individual placed talent resource may be required to sign appropriate client policies or agreements directly, subject to the arrangement.
- Talent can work under the client's information-technology and security policies.
- Scale Army should not automatically become a managed-services provider or assume healthcare-data operational responsibility because a placed worker accesses client systems.

Alternative structures previously considered when a client requires a fundamentally different risk model include:

- permanent placement; or
- declining/cancelling the structure if the client's required obligations are incompatible with Scale Army's service.

### Open / unresolved

This staffing position should not automatically be applied to a separate Scale Army business line that itself directly processes regulated healthcare information.

## Confidentiality: Core Position

**Also asked as:** What information is confidential? / Can Scale Army retain derived information? / How long does confidentiality last?

A developed Scale Army confidentiality precedent provides that ordinary client confidential information remains protected while preserving Scale Army's ability to retain certain non-identifying information and legal records.

A prior drafting precedent used:

- confidentiality survival of **three years**;
- trade-secret protection for as long as the information remains legally protected as a trade secret.

The exact survival period should be checked against the governing contract rather than assumed universally.

## Aggregated, Anonymized and De-identified Data Rights

**Also asked as:** Can Scale Army use client data for analytics? / Can we benchmark using engagement data? / Can we train internal AI? / Can we commercialize anonymized learnings?

Scale Army has established a desired confidentiality/data carve-out preserving the ability to retain and use:

- aggregated data;
- anonymized data;
- de-identified data;
- derivative service data;
- generalized learnings.

Permitted purposes developed in prior drafting include:

- internal analytics;
- benchmarking;
- product improvement;
- artificial intelligence and automation;
- market research;
- commercial data purposes.

The important boundary is that the retained or reused information must not identify:

- the client;
- an individual;
- a specific transaction,

where the clause relies on anonymization or de-identification.

This category should be excluded from the definition of client confidential information to the extent it can no longer identify the protected source.

## Data Retention After Deletion Requests or Contract End

**Also asked as:** Do we have to delete absolutely everything? / Can backups remain? / Can we retain legal records? / Can we keep anonymized derivatives?

Prior Scale Army drafting has preserved reasonable deletion exceptions for:

- backups;
- legal records;
- compliance records;
- archival records where appropriate;
- aggregated, anonymized, de-identified, or derivative information that no longer identifies the client or relevant individuals.

The purpose is to avoid a deletion obligation that is technically impossible, legally inappropriate, or inconsistent with Scale Army's legitimate use of non-identifying derived information.

## AI, Automation and Commercial Use of Candidate Data

**Also asked as:** Can Scale Army use AI on candidate information? / Can candidate data be aggregated? / Can we proactively engage candidates? / Can we commercialize candidate intelligence?

In work on Scale Army Careers Terms of Service and Privacy Policy, the requested policy direction included user authorization for Scale Army to use AI-enabled processes to:

- aggregate;
- concatenate;
- analyze;
- proactively engage;
- otherwise process;
- commercialize candidate data or derived candidate intelligence,

subject to the final privacy and legal framework.

The same project included:

- changing references from Project Growth to Scale Army Careers;
- incorporating two-party consent considerations where relevant.

### Handle with care

Candidate-data commercialization and consent language is legally and reputationally sensitive. Do not answer external-facing questions from this summary alone; use the controlling privacy policy, consent language, and applicable law.

### Open / unresolved

The project record establishes the requested policy direction but does not establish the exact final executed wording or jurisdiction-by-jurisdiction validity.

## Intellectual Property Ownership for AI Services

**Also asked as:** Who owns the prompts? / Does the client own the prototype? / Can Scale Army reuse its frameworks? / Who owns custom deliverables?

The restored AI-services position separates client-specific deliverables from Scale Army's reusable intellectual property.

The client generally owns:

- expressly identified client-specific deliverables;
- after full payment where payment is applicable.

Scale Army retains ownership of generalized and reusable materials including:

- methods;
- templates;
- prompts;
- frameworks;
- know-how;
- software;
- improvements;
- generalized learnings.

Where Scale Army background materials are embedded in a client deliverable, the structure may provide the client with a continuing license sufficient to use the deliverable without transferring Scale Army's underlying reusable intellectual property.

Scale Army also preserves the ability to reuse generalized or anonymized learnings.

## Non-Solicitation and Non-Circumvention

**Also asked as:** Can the client hire our people directly? / Can they go around Scale Army? / What happens if they circumvent us?

A recurring Scale Army protection is a post-engagement non-solicitation / non-circumvention restriction.

The restored AI-services template precedent applies for:

- **24 months after termination**

and covers introduced parties such as:

- Scale Army personnel;
- candidates introduced through Scale Army.

The purpose is to prevent a customer from using the Scale Army relationship to bypass Scale Army and hire or contract directly without the applicable commercial arrangement.

## Liquidated Damages for Circumvention

**Also asked as:** What is the penalty for hiring around us? / What are our circumvention damages? / Is the $75,000 clause still used?

A recurring Scale Army precedent provides:

- **$75,000 in liquidated damages per violation**

for prohibited solicitation or circumvention.

The clause has expressly characterized the amount as liquidated damages and **not as a penalty**.

This figure appears in multiple Scale Army precedents, including staffing and AI-services agreements.

Client-specific negotiations may modify the protection, but it should not be removed from a standalone protective template without a deliberate decision.

## Buyout of Scale Army Talent

**Also asked as:** Can the client hire a Scale Army resource directly? / What is the buyout fee? / When is a buyout permitted?

The Scale Army buyout policy established in prior work is:

- Buyouts are permitted only after **12 months**.
- For a resource with a monthly fee below **$3,000**, the buyout fee is **$7,000**.
- For a resource with a monthly fee of **$3,000 or more**, the buyout fee is **19.5% of annualized compensation/fee basis**, according to the established commercial rule.
- Prepaid amounts are not credited against the buyout.

Where a governing MSA or Exhibit B contains different legacy language, the actual executed agreement must be checked.

## Volume Discount Framework

**Also asked as:** How do our volume discounts work? / Is the discount based on open roles or actual hires? / What happens if headcount drops?

The settled Scale Army volume-discount framework uses six headcount thresholds:

| Placed hires | Discount tier |
|---|---|
| 5–7 | Threshold 1 |
| 8–10 | Threshold 2 |
| 11–15 | Threshold 3 |
| 16–20 | Threshold 4 |
| 21–30 | Threshold 5 |
| 31+ | Threshold 6 |

The project record establishes the thresholds but does not contain the exact discount percentage attached to each threshold in this knowledge export.

Rules:

- Eligibility is based on **placed hires**, not merely opened searches or requested headcount.
- The discount is headcount-based.
- Business Process Outsourcing (BPO) arrangements are excluded.
- If the client falls below a threshold, the applicable discount is removed from the marginal hire until the relevant headcount requirement is restored.
- The intended logic is that the new or marginal hire reflects the tier the client actually qualifies for.
- Commercial changes should be documented through an addendum.

Approval precedent:

- Finance is informed.
- Approval requires Alex and Yosele.

### Handle with care

The exact discount percentages are not reproduced here because the available project context does not contain them reliably. Do not invent them.

## Hero, Safe, Fallback and Below-Standard Deal Definitions

**Also asked as:** What is a Hero Deal? / What is a Safe Deal? / What is a Fallback Deal? / What margin can we accept?

Established commercial classification:

| Deal type | Established threshold |
|---|---|
| Hero | At least 50% gross margin **and** at least $1,000 gross margin |
| Safe | At least 40% gross margin **and** at least $600 gross margin |
| Fallback | At least 35% gross margin |
| Below Standard | Below 35% gross margin |

A prior general minimum had also been framed as approximately:

- at least 35% margin; or
- at least $1,000 monthly gross margin,

depending on the commercial framework in effect.

The most recent classification framework should be used where applicable.

## Prepaid Fees, Refunds and Credits

**Also asked as:** Are prepaid fees refundable? / Can prepaid money be used later? / What happens if services stop?

A prior Scale Army addendum precedent for prepaid January–March 2026 fees stated that prepaid fees were:

- **non-refundable**;
- creditable only toward:
  - continued services; or
  - future talent searches or placements.

This is a transaction-specific precedent rather than proof that every Scale Army prepayment is universally non-refundable.

Refund and credit rules should be stated explicitly in the relevant commercial document.

## Staffing MSA Termination Mechanics

**Also asked as:** How much notice is required to terminate? / Can a staffing client terminate immediately? / Do we owe a refund?

A legacy Scale Army staffing agreement included several termination mechanics:

- general termination with **30 days' notice**;
- certain immediate termination rights tied to circumstances such as talent refusal or contract cancellation;
- potential pro-rata treatment of overpayment after accounting for applicable Scale Army costs;
- client notice/cure mechanics;
- credits related to unpaid talent amounts where applicable;
- after 12 months, a termination fee calculated as **two weeks of fees per service year or part thereof**.

These terms are legacy staffing-MSA precedent and should not be automatically imported into AI enablement or other standalone services agreements.

## Cure Periods and Immediate Termination

**Also asked as:** Do we give a cure period? / Can either party terminate immediately? / Which termination language is correct?

Prior contract review found inconsistency where one part of an agreement allowed immediate termination while another provided a **five-business-day cure period**.

The reusable drafting rule is:

- Cure and termination provisions must be internally consistent.
- Immediate termination should be reserved for circumstances where immediate termination is actually intended.
- A document should not simultaneously promise a cure period and eliminate that cure right elsewhere unless the distinction is explicit.

### Open / unresolved

There is no single universal Scale Army cure period established across all agreements.

## Dispute Resolution for AI Services

**Also asked as:** Do we arbitrate? / Where do disputes go? / Which state's law governs the AI agreement?

A standalone AI-services precedent uses:

1. **30 days of good-faith informal resolution**;
2. if unresolved, arbitration before a **single American Arbitration Association (AAA) commercial arbitrator**;
3. arbitration seated in **Miami-Dade County, Florida**;
4. virtual participation permitted;
5. each side bears its own fees and costs;
6. waiver of jury trial;
7. **Florida law** as governing law.

This is a reusable AI-services precedent but should not be assumed to override a different dispute clause in an existing client MSA.

## Existing MSA vs. Standalone Agreement for New Services

**Also asked as:** Do we need a new MSA? / Should this be an addendum? / What do we use for an existing client? / What do we use for a new client?

For a new service line such as AI Leadership Intensive or AI Enablement:

### Existing Scale Army client

Preferred structure:

- use an addendum and SOW attached to the existing MSA;
- preserve the existing MSA;
- change only what is required for the new service.

### New client without an existing Scale Army MSA

Preferred structure:

- use a standalone agreement;
- restore the standard protections that would otherwise have existed in the MSA;
- include protections such as:
  - liability limitation;
  - intellectual property;
  - confidentiality;
  - client-data responsibility;
  - disclaimers;
  - non-solicitation/non-circumvention;
  - liquidated damages where appropriate;
  - dispute resolution;
  - governing law;
  - indemnification.

The standalone should remain lightweight rather than becoming an unnecessarily large enterprise MSA.

## AI Enablement Vanilla Template: Minimum Contracting Requirements

**Also asked as:** What has to be in every AI enablement contract? / What is the minimum legal wrapper for an AI workshop?

The vanilla AI Enablement Addendum/SOW process establishes that the document should:

- define minimum service commitments;
- define the fee or expressly state if the engagement is free;
- use synthetic or approved non-sensitive data where possible;
- address client dependencies;
- disclaim production and outcome guarantees;
- authorize appropriate third-party AI/cloud tools;
- require separate signed scope for production or managed work;
- protect Scale Army's reusable intellectual property;
- allocate client-data responsibility;
- document material changes in writing.

A standalone agreement should additionally restore the core protections that an existing MSA would otherwise provide.

## AI Leadership Intensive: American Safety Institute Precedent

**Also asked as:** What did we agree with American Safety Institute? / What did the free AI intensive include? / What did the ASI addendum say?

The American Safety Institute AI Leadership Intensive addendum supplements an existing Scale Army MSA dated **June 11, 2025**.

The AI Leadership Intensive precedent included:

- one **90-minute diagnostic**;
- one **3-hour training session**;
- fee: **$0**.

Risk protections included:

- **$1,000 liability cap** for the intensive;
- no warranty regarding:
  - accuracy;
  - security;
  - production readiness;
  - savings;
  - revenue;
  - compliance;
- restriction against providing Protected Health Information (PHI), payment-card information, passwords, or similarly sensitive data absent a written agreement;
- permission to use third-party AI and cloud tools;
- express clarification that Scale Army is not acting as:
  - a managed-service provider;
  - software provider;
  - cybersecurity provider;
  - legal provider;
  - compliance provider.

The existing MSA's protections remain in force except where the addendum expressly controls the covered AI services.

## American Safety Institute Underlying Staffing Agreement

**Also asked as:** What was the original American Safety Institute deal? / What protections already exist in the ASI MSA?

A Scale Army agreement with American Safety Institute included a staffing/recruiting/administrative-services relationship involving:

- Omar Abouzeid;
- title: Head of Marketing;
- 40 hours per week;
- start date: **June 17, 2025**;
- fee: **$5,400 per month for three months**, followed by a compensation change under the agreement.

The agreement includes precedent for:

- 24-month non-circumvention;
- $75,000 liquidated damages per violation;
- buyout provisions through Exhibit B;
- general 30-day termination;
- a post-12-month termination fee;
- liability capped to the prior one month paid.

The staffing agreement should be consulted directly before answering questions about exact talent compensation changes or other terms not captured here.

## AI Leadership Intensive: Premier Health Group Precedent

**Also asked as:** What were the Premier Health terms? / Which pilot was $10,000 contingent on completion? / What testimonial obligations did we use?

The Premier Health Group pilot is a client-specific precedent for a paid AI Leadership Intensive.

Scope:

- **4 sessions**;
- **90 minutes each**;
- up to **5 leaders**.

Commercial terms:

- fee: **$10,000**;
- payable after completion of the program.

Follow-on incentive:

- full credit of the $10,000 toward a qualifying follow-on implementation or staffing engagement entered within **90 days**, subject to the applicable agreement.

The pilot was expressly a:

- demonstration-level V1;
- not a production implementation.

Client marketing commitments included:

- testimonial within **15 business days**;
- case-study review within **10 business days**.

Protective terms included:

- 24-month non-solicit/non-circumvention;
- $75,000 liquidated damages;
- liability cap based on one month's fee under the applicable precedent;
- client indemnity.

### Handle with care

The testimonial, case-study, contingent-payment, and credit terms were specific negotiated carve-outs and should not be represented as universal AI Leadership Intensive requirements.

## AI Enablement Outcome Language

**Also asked as:** Do we need an "outcome" in the SOW? / What can we promise at the end of a workshop? / How do we describe value without guaranteeing results?

Scale Army AI enablement documents should contain a meaningful intended outcome without turning that outcome into a guaranteed business result.

The preferred distinction is:

- define what Scale Army will deliver or enable;
- avoid guaranteeing the customer's downstream results.

Appropriate outcome framing may include:

- clearer diagnosis of AI opportunities;
- identified use cases;
- leadership understanding;
- prioritized workflows;
- demonstration concepts;
- recommendations for next-stage implementation.

Avoid turning these into warranties of:

- revenue growth;
- cost savings;
- operational performance;
- regulatory compliance;
- completed production systems.

## Staffing vs. Permanent Placement When Client Risk Requirements Are Incompatible

**Also asked as:** What if a client insists we take data liability? / Can we restructure the deal? / What if their BAA requirement does not fit staffing?

When a client asks Scale Army's staffing business to assume obligations inconsistent with the staffing model, a prior strategic option has been to restructure as:

- permanent placement,

rather than forcing Scale Army into a managed-services or regulated-data role it did not intend to provide.

Where no commercially and legally acceptable structure exists, Scale Army may decline or discontinue the opportunity instead of accepting structurally incompatible liability.

## Restricted Roles and Contractual Guardrails

**Also asked as:** When does a role require extra review? / Are client-facing or data-access roles restricted? / Where do we check deal boundaries?

Scale Army maintains restricted hiring/engagement procedures for roles involving elevated risk, including roles that are:

- client-facing; or
- given access to sensitive client data or systems.

The detailed rules belong in the Commercial Cheat Sheet (Pricing, Legal & Engagement) and related operational policy rather than being duplicated here.

The Legal & Compliance AI Agent V1 was explicitly designed to reference sections including:

- Restricted Roles;
- Existing Clients Pricing;
- New Clients Pricing;
- Part-Time Deals;
- MSA Negotiation.

Where no established policy boundary exists, the expected behavior is escalation rather than invention.

## Legal and Compliance Decision Support

**Also asked as:** Who decides unusual contract questions? / What does the Legal AI agent do? / Can the bot make legal decisions?

A Scale Army Legal & Compliance AI Agent was assigned as a Q1 initiative with Yosele owning the project.

The intended purpose is:

- an internal decision and language guardrail;
- not autonomous legal practice.

Relevant use cases include questions concerning:

- refunds;
- disputes;
- dissatisfaction;
- termination;
- intellectual property;
- contract language;
- related commercial/legal communications.

The intended architecture is policy-first and bound to approved sources of truth.

The agent should:

- retrieve the relevant approved policy;
- produce structured guidance;
- minimize personally identifiable information in logs;
- apply redaction and safety controls;
- escalate where no approved boundary exists.

Manual escalation was contemplated to:

- Legal;
- Alex.

The project's source-of-truth materials include the Commercial Cheat Sheet (Pricing, Legal & Engagement) and the applicable MSA/template library.

## Legal Review Ownership and Escalation

**Also asked as:** Who reviews contracts? / When do we send something to Legal? / Who approves concessions?

Known legal/commercial ownership from project history:

- **Lisa** — Legal reviewer for Scale Army contract documents.
- **Alex** — executive escalation/approval for significant legal or commercial exceptions.
- **Yosele** — operational/finance/legal-commercial owner involved heavily in MSA negotiation, contracting logic, pricing guardrails, and the Legal & Compliance AI Agent.

For the AI enablement service line, legal review materials sent to Lisa were expected to include:

- the addendum version;
- standalone version;
- client-specific carve-out version;
- enough business-line context and supporting collateral for Lisa to understand the service.

The desired review request is concise and direct rather than sending isolated clauses without business context.

## Contract Negotiation Classification: Concessions, Negotiable Items and Non-Movables

**Also asked as:** What can we concede? / What is negotiable? / What needs Alex approval? / What should I push back on?

For contract reviews, Scale Army has used a practical executive classification:

### Concessions

Items Scale Army can accept without materially damaging the economics or risk position.

### Open to negotiate

Items where Scale Army has a preferred position but can trade language or economics to reach agreement.

### Non-movable without executive instruction

Items that materially affect:

- liability;
- economics;
- non-circumvention;
- intellectual property;
- data responsibility;
- managed-services exposure;
- compliance responsibility;
- similarly fundamental protections.

Exceptions in this category should not be accepted merely to move a contract forward.

Alex is the known executive escalation point for material deviations.

## MSA Negotiation Quality Control

**Also asked as:** What should we check before sending a contract? / What kinds of drafting errors have we found before? / How do we QA an MSA?

Prior Scale Army contract reviews identified recurring preventable defects.

Pre-execution review should verify:

- legal entity names are consistent;
- defined terms match throughout;
- schedules and exhibits are correctly named;
- section references actually point to the correct section;
- numerical terms contain both correct numerals and written text where used;
- cure and termination provisions do not conflict;
- SOW/SOF hierarchy is explicit;
- liability cap language is internally consistent;
- confidentiality and data-use terms do not contradict each other;
- AI disclaimers are not unnecessarily duplicated;
- scope does not accidentally create managed-services obligations;
- commercial terms match the approved pricing;
- exhibits referenced in the body actually exist;
- client-specific exceptions have not accidentally removed unrelated standard protections.

A prior review caught examples including:

- broken section references;
- inconsistent entities;
- "SIX () MONTHS" drafting error;
- conflicting immediate-termination and cure language;
- duplicated AI disclaimers;
- inconsistent Schedule/Exhibit naming;
- unclear MSA vs. SOF hierarchy.

## SA Product Ops Data and Contracting Position

**Also asked as:** What data rights do Product Ops contracts need? / Can SA Product Ops use data commercially? / How should Product Ops confidentiality work?

For Product Operations work, Scale Army developed a more explicit internal-data-use position.

Desired retained rights include use of de-identified or aggregated service information for:

- analytics;
- benchmarking;
- product improvement;
- artificial intelligence;
- automation;
- market research;
- commercial data purposes.

The structure should prevent identification of:

- the client;
- individual people;
- specific transactions.

### Handle with care

Product Operations data rights can be broader than ordinary staffing confidentiality expectations. Contract language must accurately disclose the intended use rather than relying on an implicit assumption.

## Product Ops Agreement Hierarchy

**Also asked as:** Can an SOF change Product Ops legal terms? / Which document controls Product Ops pricing? / What should the SOF be allowed to override?

A Product Operations contracting precedent established:

- the MSA generally governs;
- the SOF may control expressly identified:
  - commercial terms;
  - operational details;
  - pricing;
  - term;
  - selected services;
  - integrations;
  - configuration.

The SOF should not override foundational legal sections such as:

- confidentiality;
- data protection;
- intellectual property;
- indemnity;
- liability;
- acceptable use;
- disputes,

unless the SOF expressly identifies the section being changed.

## Commercial Terms Must Match the Approved Business Deal

**Also asked as:** What if the proposal and contract have different pricing? / Which number is authoritative? / Can legal fill in missing economics?

Contract drafting should not create or guess commercial terms.

The legal document should reflect the approved:

- fee;
- recurring charge;
- scope;
- volume;
- term;
- payment trigger;
- credits;
- discounts.

If source materials conflict, the commercial owner should resolve the inconsistency before execution.

A prior Product Ops engagement, for example, contained distinct pricing discussions including:

- **$13,449 one-time development fee**;
- **$4,000 monthly recurring revenue** discussed for 2,000 RFQs;
- an **Alex-set $3,000 monthly floor** that was accepted.

Those figures are specific to that engagement and are not general Scale Army pricing.

## Non-Refundable Development Fees

**Also asked as:** Is a development fee earned at signing? / Can a customer get its setup fee back?

A prior Product Operations commercial precedent treated a development fee as:

- due upon execution;
- earned;
- non-refundable except where applicable law requires otherwise.

This is a transaction-specific precedent, not a universal rule for every Scale Army fee.

## Existing Client vs. New Client AI Enablement Contract Flow

**Also asked as:** What document do I use for an existing customer? / What if the AI customer is brand new?

### Existing Scale Army customer

Use:

- an AI Enablement Addendum/SOW attached to the existing MSA.

Preserve:

- existing MSA protections;
- existing dispute framework;
- existing confidentiality and intellectual-property structure,

unless deliberately changed.

### New customer

Use:

- the standalone AI Enablement Services Agreement with restored protections.

The standalone exists because a new customer does not already have Scale Army's MSA protections in place.

## Client-Specific Carve-Outs Must Stay Client-Specific

**Also asked as:** Can we reuse the Premier Health concessions? / Is a testimonial now standard? / Does every pilot get the same payment trigger?

A negotiated exception should not automatically become standard policy.

Examples of client-specific precedent include:

- a $10,000 fee payable only after course completion;
- testimonial obligations;
- case-study approval obligations;
- follow-on credits;
- free pilot pricing;
- special liability caps.

When adapting a template:

1. Start from the vanilla standard.
2. Apply only the approved client-specific carve-outs.
3. Confirm that core protections were not accidentally removed.
4. Keep the exception traceable to the relevant client/deal.

## Restoration of Protections in Standalone AI Agreements

**Also asked as:** Why did we restore circumvention and damages? / What was missing from the standalone? / Which protections should not disappear?

When Scale Army created a standalone AI Enablement Agreement, there was explicit concern that simplifying the document had removed protections normally present in the MSA.

The instruction was to restore standard protections, particularly:

- non-solicitation;
- non-circumvention;
- damages/liquidated-damages protection;
- liability limitations;
- indemnification;
- confidentiality;
- intellectual property;
- dispute provisions.

The guiding principle is that "lightweight" should mean concise, not unprotected.

## Minimum Commitments in an AI SOW

**Also asked as:** How detailed should an AI SOW be? / How much scope belongs in the contract? / Do we copy the entire deck into the agreement?

The preferred AI SOW is intentionally lightweight.

It should contain only enough detail to establish the enforceable minimum, such as:

- number of sessions;
- approximate session duration;
- essential participants or participant limits where applicable;
- high-level purpose;
- fee;
- required client dependencies;
- intended deliverables or outcome;
- any material client obligations.

Avoid tying the legal agreement to every presentation slide, agenda detail, teaching example, or evolving facilitation method.

This allows the program to evolve operationally without creating accidental contract breaches.

## No Silent Expansion Into Software, Security, Legal or Compliance Services

**Also asked as:** Are we certifying security? / Are we giving legal advice? / Are we becoming their AI software vendor?

AI enablement contracts should expressly distinguish the engagement from services Scale Army is not providing.

Unless separately contracted, Scale Army does not act as:

- the client's software provider;
- managed-service provider;
- cybersecurity provider;
- legal adviser;
- compliance adviser.

This boundary is especially important when a training or diagnostic program touches regulated data, security workflows, or operational systems.

## Relationship Between Contract Scope and Client Responsibility

**Also asked as:** What if the client uses what we showed them incorrectly? / Who owns implementation risk? / What if they ignore our setup constraints?

The contract should distinguish between:

- what Scale Army performs;
- what the client chooses to do afterward.

Scale Army's responsibility is tied to the agreed service.

The client remains responsible for:

- its systems;
- its implementation decisions;
- its deployment decisions;
- its data;
- its legal obligations;
- its business decisions;
- human validation of AI output;
- use of the output outside the contracted service.

This distinction is a recurring fallback principle when a new risk is not specifically addressed.

## Commercially Reasonable Efforts in Compliance Clauses

**Also asked as:** Do we promise perfect sanctions screening? / What standard should apply to compliance efforts?

A prior Scale Army legal position for Office of Foreign Assets Control (OFAC) / Specially Designated Nationals (SDN) matters favored a:

- **commercially reasonable efforts** standard.

The purpose is to commit to a serious compliance process without converting the obligation into an absolute guarantee that no prohibited person could ever pass through the system.

## Two-Party Consent Considerations

**Also asked as:** What about recording consent? / Do we need everybody's consent? / What did we want in the privacy policy?

Scale Army Careers privacy/TOS work included an instruction to incorporate:

- two-party consent requirements where applicable.

This reflects concern about jurisdictions where all parties must consent to certain recordings or communications monitoring.

### Open / unresolved

The project record does not contain a complete jurisdiction-by-jurisdiction consent matrix or final standardized clause.

## Governing Documents and Source-of-Truth Principle

**Also asked as:** Which document should the bot trust? / What happens if historical notes conflict? / Is this wiki the contract?

This knowledge base describes established Scale Army positions and precedents but does not replace an executed agreement.

For a specific customer, priority should be given to:

1. the executed customer agreement;
2. executed amendments/addenda;
3. executed SOW/SOF documents according to their hierarchy provisions;
4. current approved Scale Army policy;
5. approved template language;
6. historical precedent and this knowledge base.

If an executed agreement contradicts a general precedent, the executed agreement governs that customer relationship unless amended.

If there is no approved rule for a requested deviation, escalate rather than inventing a contractual position.

Relevant supporting sources should be cross-linked where available, including the Commercial Cheat Sheet (Pricing, Legal & Engagement), Restricted Roles, Existing Clients Pricing, New Clients Pricing, Part-Time Deals, and MSA Negotiation policy documents.

## Handle with Care: Sensitive Legal and Commercial Information

This document is intended for internal Scale Army infrastructure.

The following topics should not be broadly repeated externally without reviewing the controlling agreement and business context:

- liability caps;
- client indemnity strategy;
- liquidated-damages amounts;
- non-circumvention enforcement strategy;
- candidate-data commercialization;
- internal escalation thresholds;
- client-specific concessions;
- healthcare-data risk allocation;
- internal pricing floors;
- contract negotiation fallback positions;
- legal/commercial approval responsibilities.

Internal retrieval systems should distinguish between:

- general policy;
- historical precedent;
- client-specific negotiated terms;
- unresolved issues.

A Slack bot should never present a client-specific exception as universal Scale Army policy merely because the terms appear in this document.

## Open / Unresolved Contracting Issues

**Also asked as:** What legal issues are still open? / What should the bot escalate? / Which topics do we not have a final answer on?

The project record does not establish a fully settled universal answer for the following:

- **Canada-specific contracting:** Prior questions exist regarding Scale Army working with Canadian companies, but no final Canada-specific MSA position is established in the available record.
- **Universal BAA policy across all new business lines:** The staffing position is established, but direct processing of Protected Health Information (PHI) by a separate Scale Army service may require different treatment.
- **Universal liability cap:** Staffing and AI-services precedents use different formulas.
- **Universal cure period:** Different agreements contain different termination/cure mechanics.
- **Exact volume-discount percentages:** The headcount thresholds and mechanics are established, but the exact percentage associated with each threshold is not present in this project export.
- **Final candidate-data commercialization wording:** The desired direction is known, but this export does not establish final executed language or jurisdiction-specific enforceability.
- **Current universal contracting entity:** Multiple Scale Army and Product Ops entity formulations exist historically; the correct current entity should be verified for the relevant business line.
- **Two-party consent implementation:** The policy direction exists, but a complete jurisdictional framework is not contained in the available record.
- **Healthcare platform requirements:** Enterprise-plan, Business Associate Agreement (BAA), and Protected Health Information (PHI) requirements depend on the actual AI/software vendor and current plan terms and should be verified before a definitive representation is made.

Questions falling into these areas should be escalated to the appropriate commercial/legal owner rather than answered as settled Scale Army policy.
