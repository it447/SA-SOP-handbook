---
title: "Posting Roles on Ashby SOP"
department: outbound-ashby-linkedin
category: SOP
owner: "Youssef Singer"
last_updated: 2026-07-20
---

## Goal

The step-by-step workflow for posting a role on [[glossary-outbound|Ashby]] once a new search has been initiated and approved.

## Who this is for

Recruiters, Account Managers (AMs), and Operations Team.

## General considerations

By the time sourcing begins, Sales has already contacted the client, defined/validated the role, and approved the JD. The finalized JD and role details are posted in `#new-searches`.

## Step 1: New search post in #new-searches

The post must include: role details (JD link), client info (Loom video), any mandatory client-specific questions, assigned team (AM, Recruiter, Sourcer), and salary details (base + commission if applicable). Once confirmed, proceed to Ashby.

## Step 2: Verify or create the client team in Ashby

Go to Admin → Departments & Teams, search for the client under "Scale Army Careers." If it doesn't exist, scroll down, click "Add a Team to Scale Army Careers," enter the client name nested under Scale Army Careers, and create it.

## Step 3: Create the job in Ashby

Search by job title + client to confirm it doesn't already exist, then click "Create Job." Select the correct Pod template (as specified in `#new-searches`). Format the job title as "Client Name – Job Title," set the team to "Scale Army Careers | Client Name," leave Opening blank, set Location to Remote, and continue.

## Step 4: Configure the hiring team

Assign exactly as specified in `#new-searches`: Recruiter field = the Account Manager; Recruiting Coordinator = the assigned Recruiter; Sourcer = the assigned Sourcer. Continue → Go to Job.

## Step 5: Compensation setup (Settings tab)

Go to Settings → Compensation Tiers → click into the tier box. Leave the tier name empty. Enter the salary range from `#new-searches`, set Frequency to "Per Month" (always), and check "Offers Commission" if applicable.

## Step 6: Openings setup

Go to Openings → "Create Job Opening." Enter the Opening ID exactly as given in `#new-searches` (this is the Deal ID) and leave everything else unchanged. Click "Create Draft," then open the new Opening and click Draft → Approve to activate it.

## Step 7: Job posting setup

Go to Job Postings, select the role, and set the job post title to the **role name only** — the client name must never appear in the public posting. Pull the JD from `#new-searches` and run it through the approved JD-cleanup process (grammar/formatting only, no content changes) before finalizing.

### JD formatting rules

**Fixed structure, in this exact order:** Job Title → Client → Location → Role Overview → Key Responsibilities → Qualifications (Experience, Skills) → What Success Looks Like (only if present in the original) → Opportunity.

**Tone and formatting:**
- Professional, clear, concise but complete — never lose important information, never invent content not in the original JD.
- No unnecessary repetition; structured bullets for Responsibilities and Qualifications.
- Role Overview always opens with "The [Role Title] will…" or "The [Role Title] is…"
- Short, scannable paragraphs; no emojis or hashtags in the JD body.
- Publication-ready: clean, structured, professional.

**Client section:** never use the client's real name — always "Our client." Keep it substantial and faithful to the original (roughly one paragraph), preserving mission/industry/approach details; condense only for readability, never omit context.

**Key Responsibilities:** keep all original content, reorganize for clarity. Preserve existing subsections; if the JD has many mixed tasks with no subsections, create logical ones (e.g. "Operations Support," "Client Coordination," "Reporting & Documentation"). Never change, merge, or remove actual responsibilities.

**Qualifications:** always exactly two subsections — Experience and Skills. Any traits/qualities mentioned in the source JD get folded naturally into Skills rather than a separate category. Concise but complete.

**What Success Looks Like:** include only if present in the original JD.

**Opportunity:** cover what the person gains taking the role — growth, learning, direct impact, relationship with the team/leaders, and what's appealing about the environment, pace, or mission.

**Content integrity:** no factual changes, additions, or omissions; never merge/rename official sections; don't invent a section that isn't in the original JD; keep the role's original scope and requirements intact.

**Social description:** 200 characters max, catchy, must include an emoji — always send this along with the cleaned JD.

**Final checks before pasting into Ashby:** no client name visible, clean/professional formatting, bullet points preserved, title and location match the client's request.

## Step 8: Location setup

Check `#new-searches` for client-specific location requirements. If a preferred location is specified, set it as Primary and leave others as Secondary.

## Step 9: Application form setup

Hover over Application Form, click "Update the Shared Form" → open in a new tab, click Copy, and rename the form "Client Name – Role Title." Under Groups, delete the existing group and assign the correct client group.

**Mandatory application form rules:**
- Exactly 8 questions, in this fixed order: MCQ (years of experience), MCQ (proficiency level), Checkbox (select all that apply) ×2, Yes/No ×2, Open-ended ×2.
- All questions must derive only from the JD's Qualifications section.
- A portfolio question is required for Marketing, Creative, and similar roles.
- Never ask about English level, country/location, availability, salary expectations, or restricted tools.
- All questions marked Required.
- Never edit the default candidate fields (Name, Email, Phone, Resume).

Save form changes, return to the job post, click "Change Link," and attach the new form.

## Step 10: Automation setup

Standard automation rules apply by default to all roles and may get deactivated when editing the application form. Go to the Automation tab, view the current configuration, do **not** modify any rules, and click Activate to confirm.

## Final review & publishing

Re-check compensation, review all tabs for consistency, change status from Draft to Open, and click Publish. When the role is later won or lost, follow the [[closing-roles-on-ashby-sop|Closing Roles on Ashby SOP]] to close it out correctly.

## Slack notification

Reply in the original `#new-searches` thread: "Hey team, here is the job to be QA'd. Let me know if you need anything," and paste the job post link.
