---
title: "Closing Roles on Ashby SOP"
department: outbound-ashby-linkedin
category: SOP
owner: "Youssef Singer"
last_updated: 2026-07-20
---

## Goal

Correctly close roles in [[glossary-outbound|Ashby]] — whether won or lost — ensuring data accuracy and consistent internal reporting.

## Who this is for

Recruiters, Account Managers (AMs), Operations Team, and Leadership.

## General considerations

- A role can **only** be closed after an official Slack notification. The AM moves the deal in HubSpot first, which auto-generates a ticket in `#closed-mof`.
- The Slack notification always states: client name, role name, Won/Lost status, and the Closed Reason (mandatory for Lost roles).
- **Never close a role in Ashby without a corresponding `#closed-mof` notification.**

## Step 1: Identify the role to close (Slack)

Open the relevant `#closed-mof` thread and confirm client name, role title, Won/Lost status, and closed reason (for Lost roles).

## Step 2: Locate the role in Ashby

Go to Ashby → Jobs → Admin, search by client name/role title, and confirm it's the correct role.

## Closing a WON role

**Step 3A — Close the job:** click the green "Open" status button → Closed. In the popup, set Closed Reason to "Closed – Won" and click Close.

**Step 4A — Unlist the job post:** go to Job Posting → click the post → in the right panel, set Location to "Unlisted."

The role is now correctly closed as Won.

## Closing a LOST role

**Step 3B — Close the job:** click "Open" → Closed. In the Closed Reason dropdown, select the **exact** reason specified in the `#closed-mof` thread, then click Close. (Mismatched reasons break internal reporting.)

**Step 4B — Close the opening:** go to Openings, find the role's opening (may still show Open), click into it, set its status to Closed, and select the **same** Closed Reason used for the job. Job and Opening must always share the same Closed Reason.

**Step 5B — Unlist the job post:** same as Step 4A — set Location to "Unlisted."

The role is now correctly closed as Lost.

## Final checklist (mandatory)

- [ ] Slack notification exists in `#closed-mof`
- [ ] Correct role and client verified
- [ ] Job status set to Closed
- [ ] Closed Reason matches Slack (Lost roles)
- [ ] Opening closed (Lost roles)
- [ ] Job post set to Unlisted
