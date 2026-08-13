---
title: "Client Billing and Invoicing SOP"
department: finance
category: SOP
owner: "Daniel, Sandra"
last_updated: 2026-07-20
---

## Goal

Define the process for generating client invoices, tracking payments, and ensuring timely, accurate billing aligned to each client's MSA.

## Who this is for

Finance Team, Sales Team, and Account Managers. Process owner: Finance & Operations Associate, with the Senior Finance Associate supporting financial review or billing adjustments.

## Systems used

- **HubSpot:** deal information and onboarding form.
- **Slack:** operational notifications for onboarding/billing events.
- **Stripe:** billing platform for subscriptions, invoices, and payment processing.
- **All Sales Database:** central operational database for sales and billing information.
- **Google Drive:** documentation storage.

## Process overview

Billing begins once a deal closes and onboarding info is submitted through the HubSpot onboarding form. That data auto-posts to `#onboarding-won-deals-msa-signed`, notifying the Finance & Operations Associate that a new client billing setup is needed. The associate reviews the info, records it in the All Sales Database, then configures the client's billing profile and subscription in Stripe — which handles invoice/receipt generation automatically. Billing adjustments come through `#offboarding-lost-deals` and `#hr-billing-requests`.

## Process triggers

| Trigger | Slack Channel | Description |
|---|---|---|
| New client onboarding | `#onboarding-won-deals-msa-signed` | New client billing setup required |
| Talent offboarding | `#offboarding-lost-deals` | May require billing suspension, credit, or refund |
| HR billing requests | `#hr-billing-requests` | Additional client charges from compensation adjustments |

## Step-by-step process

**1. Monitor onboarding notifications** in `#onboarding-won-deals-msa-signed` — this carries onboarding form data from HubSpot: client name, billing contact, candidate salary, client fee, monthly billing amount, company margin, any initial discounts, and MSA billing terms.

**2. Review and validate** that all billing details are present and accurate (client name, billing contact email, salary, fee, monthly billing amount, discounts, MSA terms, and any corrections). If anything is incomplete, coordinate with the relevant internal team before proceeding.

**3. Record data in the All Sales Database** — the central source of truth for operational/revenue data. Record: client name, candidate name, candidate salary, start date, client fee, company margin, initial discounts, all assigned reps (AE/AM/Recruiter), the HubSpot Deal ID, and the client's Stripe ID. This database connects to Commission Tracking, HR Tracking, Customer Success Tracking, and Financial Reporting — keeping it accurate matters because many downstream processes depend on it.

**4. Create the client profile in Stripe:** company name, billing contact email, billing address (if available), and preferred payment method.

**5. Configure subscription billing** per the MSA: monthly billing amount, start date, any initial discounts, and billing frequency (typically monthly). Once set, Stripe automatically generates and sends invoices and processes payments on schedule.

**6. Verify automated invoice processing:** confirm Stripe is generating invoices, sending them to the billing contact, processing payments, and sending receipts — and that the amount/schedule matches the MSA.

## Offboarding billing adjustments

Triggered by `#offboarding-lost-deals` when a talent is terminated, resigns, or is removed from a client account. Review the client's Stripe payment history, last invoice/payment date, and MSA billing obligations. Depending on the review, the client may receive a credit, a refund, continue billing until the contractual term ends, or owe a final payment. Adjustments may include issuing a Stripe credit, modifying/canceling the subscription, or issuing a final invoice — always aligned to the MSA.

## HR billing adjustments

Triggered by `#hr-billing-requests` for compensation-related changes (bonuses, commissions, salary increases, reimbursements):
1. Review the request from HR or Client Success.
2. Verify the amount and reason.
3. Confirm it aligns with the client agreement.
4. Add the charge in Stripe, either as a one-time invoice or a subscription adjustment.

## Data sources

Deal/onboarding info (HubSpot), operational notifications (Slack), billing (Stripe), sales/operational data (All Sales Database), and billing terms (the client MSA).

## Notes

- Stripe is the primary billing platform for subscriptions, invoices, and payments.
- Slack channels are the operational trigger for billing events.
- The All Sales Database is the central repository connecting operational, HR, and financial systems.
- All billing adjustments must comply with the client's MSA terms.
