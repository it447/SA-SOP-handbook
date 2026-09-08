---
title: "Recruiting Ops SOP"
department: recruitment
category: SOP
owner: "Fer, Jose"
last_updated: 2026-09-08
---

## Goal

Give recruiters and team members a centralized reference for the Recruiting Operations (Recruiting Ops) function: how roles get created and closed in Ashby, how pipelines get kept clean, how candidates get rejected/labeled/tracked, how dry pipelines get triaged, how IRS/TRS packets get prepared, and what to do when key recruiting tools go down.

The Recruiting Ops team manages and supports:

1. Role creation and setup in Ashby
2. Pipeline management and cleanup
3. Candidate rejection reasons and labeling standards
4. Dry pipeline review criteria and next steps
5. [[glossary-recruitment-delivery|IRS/TRS]] preparation and reporting
6. Application form setup and maintenance
7. Recruitment-related Slack channels and communication guidelines
8. Candidate source tracking and reporting in Ashby
9. LinkedIn job posting management (posting, opening, refreshing, and closing jobs)
10. Recruiter onboarding and access provisioning
11. System administration and troubleshooting procedures
12. Business continuity processes when key tools such as Aircall, Periskope, Ashby, LinkedIn, or Loom experience outages

**POCs:** Recruiting Manager — Fer; Recruiting Ops Specialist — Jose.

## Who this is for

Recruiters, Recruiting Ops, Recruiting Leadership, and anyone who touches Ashby role setup, candidate pipelines, or LinkedIn job slots.

**Steps Overview:**
- How to Create and Close a Role in Ashby
- Pipeline Cleanup in Ashby
- How to Select a Rejection Reason
- Email Templates on Ashby — Candidate Experience
- Dry Pipelines Sheet: Criteria and Next Steps
- IRS / TRS Preparation
- Recruitment-Related Slack Channels
- Candidate Sources in Ashby and How to Track Them
- Correct Labeling/Tagging
- LinkedIn: Post, Open, Refresh, and Close
- InMails to Apply Starters
- Business Continuity: Tool Outages

## How to Create and Close a Role in Ashby

### 1. Initial Review

- Check the **#new-searches** Slack channel for the new search thread.
- Review the Job Description (JD) and watch any attached Loom videos.
- Check for any requested edits or specific requirements in the thread.

### 2. Admin Setup (Departments & Teams)

- Go to Ashby Admin > **Departments & Teams**.
- Locate the appropriate department (e.g., Sales, Marketing).
- Click the arrow to expand the department; do not click the name itself.
- Search for the client name. If it does not exist, scroll to the end and click **Add a team to [Department Name]** and create the new team.

### 3. Creating the Job

- Go to **Jobs > Dashboard**.
- Select the template aligned with the portfolio (Pod).
- Update the job title: use the format specified in the new search thread (copy-paste it as it must be identical to the one listed on HubSpot). **Note: never include the client name in the title of the post.**
- Assign the Hiring Team (mapping):
  - **Recruiter:** Account Manager (AM)
  - **Recruiting Coordinator:** Assigned Recruiter
- **Additional Information:**
  - Enter compensation per month.
  - Check "Offers Commission" only if specified in the search thread.

### 4. Job Description & Posting

- Copy the Job Description into the posting. **Constraint: client name must never appear in the job description or title.**
- Use AI to clean formatting if needed; ensure no extra empty spaces.
- Ensure social description and job description are clear. Do not specify regions (e.g., "Latam only") or require "native English."
- Review **Basic Info** for location accuracy.

### 5. Application Form Configuration

- Go to Application Form and click **Update the Shared Form** > Open in New Tab.
- **Important:** click **Copy** to create a new version of the Master Template. Do not edit the original.
- Rename the copied form to match the search thread (e.g., [Client Name] SDR).
- Ensure required questions (including "How to use AI," years of experience) are present.
- Save the form changes, then return to the job and update the application form link to the one you just created.

### 6. Automation & Launching

- Check for "Invalid" automation status. Click **View Invalid Configuration** > Create new draft > **Activate**.
- Navigate to the **Openings** tab. Create an opening using the Deal ID from the search thread.
- Return to the Job, click the draft/status button, and select **Mark as open**.
- Select the correct opening and publish the job.

### 7. Final Notification

- Copy the post link and send it in the team channel: "Hey, here's the job to be QA. Let me know if there's anything you need." Always tag the recruiter and Recruiting Leader.

### Closing a Role

**For Closed Lost roles:**
- Verify the role is in the **#ClosedMOF** Slack thread. **Do not close roles not found in this channel.**
- Check the Opening ID against the search thread to ensure they match.
- Mark the Opening as "Closed" with the same reason as the one listed in the #ClosedMOF Slack channel.
- Mark the Job as "Closed" with the right reason.
- In Job Postings, ensure the job is unlisted and the list of countries is removed.

**For Closed Won roles:**
- Verify the Opening is filled by the correct candidate.
- Mark the Opening as "Closed" with the reason: **"Closed won."**
- In Job Postings, ensure the job is unlisted and remove all countries.

**After closing a position, always click "Archive Job Considerations" and make sure the pipeline is ENTIRELY clean** (see original Loom walkthrough for a screenshot of this step).

## Pipeline Cleanup in Ashby

**Objective:** ensure a positive candidate experience, maintain our professional reputation, and protect our LinkedIn outreach capabilities by preventing "ghosting" of candidates.

**Schedule:** every week, in Ashby.

**Procedure:**

1. **Access the Report:** navigate to the "Weekly Pipeline Cleanup" report in Ashby.
2. **Apply Filters:**
   - Filter by the current quarter (e.g., April to June).
   - Review all roles where candidates have remained in the "Application Review" stage for more than 14 days.
3. **Review and Action:**
   - Identify roles that are closed, paused, or have high volumes of stagnant candidates.
   - Clean up these pipelines immediately by rejecting or appropriately moving candidates.
   - (Open item in the source document: the process for candidates who are selected for benches still needs to be added here.)
4. **Exceptions & Escalations:**
   - Recruiters may push back if there is a valid business reason to retain candidates (e.g., avoiding over-rejection).
   - **If a pipeline remains uncleaned for two consecutive weeks, immediate action is required to resolve the backlog.**

### Step-by-Step Pipeline Cleanup Process

When a role is closed or paused, follow these steps to clean the candidate pipeline:

1. **Review Candidates:** open the specific role in Ashby, navigate to the "Application Review" stage, and select the candidates to be processed.
2. **Option A — Re-engage (Consider for Future Role):**
   - Click "More" and select "Consider for a job."
   - Choose the target job (e.g., RevOps, CS, or Sales Ops).
   - Select the appropriate stage and move the candidates to Benches or any other open job. For benches, first pick the right position type and then, within that bench, the appropriate stage/part of the process they're in.
3. **Option B — Archive & Notify:**
   - For candidates not being re-engaged, click "Archive."
   - Select the reason for archiving (e.g., "Keep for future role").
   - Cancel all active CTAs/sequences for these candidates.
   - Notify the rejected candidates using the "no-reply@ashby" address and the appropriate template (e.g., "Rejection 1, Application Review Stage" or "Role Pause" if there is a hiring freeze).
   - Confirm and perform the archive action.

**Note: no candidate should be left without any feedback or heads-up.**

**Risk Mitigation:** leaving candidates in "Application Review" for extended periods can lead to candidates reporting the company to LinkedIn for lack of communication, which may result in account suspension and reduced effectiveness of future outreach efforts.

> See also [[dry-pipeline-management|Dry Pipeline Management]] for the sibling process of keeping live-but-underperforming roles healthy (as opposed to closed/paused roles, which this section covers).

## How to Select a Rejection Reason

When selecting an archive reason, consider the specific circumstances for archiving a candidate. The primary categories available are:

- Rejected by candidate
- Rejected by organization
- Other

Within the "Other" category, the following sub-reasons are provided (typically reserved for situations where a replacement is needed for a hired role in the pipeline — rarely used):

- No response to outreach
- The talent got fired
- The talent quit

Additional options include:

- Accepted another offer
- Not interested after outreach
- Withdrew from the process

There are no rigid criteria for these selections — assess each unique situation to determine the best fit. For instance:

- **Candidate preference:** the client wants the candidate, but the candidate declines.
- **Salary misalignment:** e.g., if a role is posted at $1,000/month but the candidate requests $2,000, leading to an archive based on expectations.

### Standard Archive Reasons ("Rejected By Organization")

| Reason |
| --- |
| Lacks Work Authorization |
| Mediocre Portfolio |
| No Portfolio |
| No-show |
| Not Company Culture Fit |
| Not disco-called but did take-home |
| Not good English |
| No timezone availability |
| Placed at another client |
| Resume is not in English |
| Salary Expectations |
| TCG - No Ethernet Connection |
| Too expensive for this role |
| Video is not in English |
| Video recorded from their phone |

## Email Templates on Ashby — Candidate Experience

### Candidate Outreach & Process Management

1. **Additional Info Required:** use when asking candidates for qualifying answers or updated resumes.
2. **Keeping Candidates Warm:** send periodic updates to maintain engagement during long hiring processes.
3. **Missing Portfolio:** specifically for design roles when the portfolio is absent.
4. **Game/Assessment:** use for Criteria Corp assessments; remind candidates to check their spam folders.
5. **Outreach ("Consider for role"):** used to initiate contact outside of standard job board applications.
6. **Video Quality:** use when a candidate-submitted video has poor lighting or background noise; ask for a re-record.

### Interviewing & Assessment Workflow

7. **[[glossary-recruitment-delivery|Disco]] Call.**
8. **Client Interview Scheduling:** notify candidates they are moving forward and request availability.
9. **Prep Materials:** send before Disco Calls (includes non-circumvention agreement, website, JD) and Client Interviews (includes prep document and video).
10. **Interview Reminders:** confirm interview time and ensure agreements are signed.
11. **Take-Home/Presentation:** use after take-home submissions to ensure candidates are prepared for the presentation stage.
12. **Offer Call Scheduling:** used when the client is ready to move forward with an offer.

### Rejection Procedures

13. **Standard Rejection (Application Stage):** generic templates for application review or when roles are closed. Can be role-specific (e.g., SDR).
14. **Post-Engagement Rejection (Disco/Client Interview):** high-touch rejection for candidates we have met. Emphasize it was a pleasure meeting them.
15. **Thorough Feedback:** use after take-home/client assessment stages. Provide specific client feedback.
16. **Stale/Old Pipelines:** for closing out applications that have been inactive for a long time.
17. **Role Paused:** use when a role is put on hold at any stage.
18. **High-Touch Rejection (Disco to Take-home):** differentiated from other rejections because these candidates have met the client and signed agreements.

## Dry Pipelines Sheet: Criteria and Next Steps

> The live dry pipeline tracker itself is covered in [[dry-pipeline-management|Dry Pipeline Management]]; this section covers the criteria Recruiting Ops uses to flag a role in the first place.

Before flagging a role as having a "dry pipeline," ensure it meets the following criteria:

1. **Any new role must be added to the dry pipeline right after it's launched**, just to make sure we're on the right track. Recruiting Ops tracks pipeline health and runs action items to keep roles on track. Roles are expected to be in "Green" status before they're removed from the list.
2. **Role must be challenging to source for.** Certain roles (e.g., Project Managers, Graphic Designers, Administrative Assistants) have high candidate availability and typically require only minor effort. If these roles have been launched, posted to a slot, and sourced for at least 2 days, the pipeline usually remains healthy. If unsure, flag the role for review.
3. **Active screening in progress.** In some cases a pipeline may appear "dry" (at 0) because a recruiter is actively screening candidates. If so, the pipeline is healthy but may need additional effort, such as adding the role to a slot with daily bot messages.

### Tracker Updates

- **Flagged Reasons:** select the appropriate reason from the dropdown for all flagged roles.
- **Stage We're In:** add a specific note to the "Stage We're In" column (e.g., "Sent batch 1," "Final Interview Stage," or "Offer Call") to maintain transparency on the role's status.

**AIs/Next Steps Covered:**

- Posting on our Social Media (WhatsApp, Facebook, LinkedIn, etc.)
- Reaching out to Apply Starters
- Posting on a slot
- Refreshing the slot
- Reaching out to Automatic Apply Starters
- Send a newsletter (ONLY on Thursdays)
- Send it to our Content Creator (ONLY on Thursdays) — Newsletters.

## IRS / TRS Preparation

### 1. Locate Role Folder

- Navigate to the Automated Workbooks from Ashby folder (see References below).
- Locate the specific role folder (e.g., via manual search or Ctrl+F).
- Within the role folder, you will find two sub-folders: **[[glossary-recruitment-delivery|IRS]]** and **TRS packet**.

### 2. IRS Process

- Verify that candidates have been pushed to the IRS folder.
- Once candidates are populated, copy the link to the folder.
- Ensure all the relevant questions are tracked and pasted on the IRS.
- Double check the candidates' compensation.

### 3. Communication

- Send the link to the appropriate Slack channel **#IRS-Review**.
- The Recruiter notifies the Account Manager of the IRS sent in #irs-review.
- The Account Manager adds margins to the document as required.

### 4. TRS Packet Preparation

- Navigate to the TRS packet folder.
- Make a copy of the automation sheet.
- If the client folder does not exist, create it.
- Create the TRS folder and move the copied sheet there.
- Ensure all formatting is maintained.

### 5. Final Review

- Double-check that the format, questions, answers, and compensation details are accurate.

**⚠️ Critical rules & restrictions:**
- Do NOT change any naming conventions in any folder or file.
- Do NOT edit or touch the source automation sheet at any point.

## Recruitment-Related Slack Channels

- **#scale-recruiting** — the primary communication hub for the entire recruitment team. Used for broad announcements, general inquiries, and gathering LinkedIn Slots usage via the Slots bot.
- **#client-kickoff-call-notes** — a collaborative space for recruiters and Account Managers (AMs). AMs post summaries here following client kickoff meetings; vital for adjusting job descriptions, salary expectations, or providing additional support.
- **#hr-and-recruiting** — dedicated to matters involving internal talent, HR policies, and recruitment logistics. Often used by Talent Success to share referrals or discuss offboarding.
- **#portfolio-1, #portfolio-2, & #portfolio-3** — central update hubs for their respective pods. Facilitate direct communication between AMs and recruiters regarding specific role progress and coordination for offer calls.
- **#new-searches** — where new search threads are posted.
- **#IRS-review** — where IRS links are shared for AM review.

## Candidate Sources in Ashby and How to Track Them

A **Candidate Source** is the label Ashby applies to a candidate/application. For example:

- **LinkedIn:** LinkedInPosts
- **Email:** EmailMarketing
- **Paid:** PaidChair
- **Social Media Organic:** Instagram (OS)

A **UTM code** is the tracking information added to the URL. For example:

```
utm_source=instagram&utm_medium=organic_social&utm_campaign=sales_coordinator&utm_content=story
```

So the simple difference is:

```
UTM code = tracking info in the link
Ashby Candidate Source = the source label saved in Ashby
```

### How Ashby tracks candidate sources

In Ashby, you create a **Candidate Source** first, e.g.:

```
Social Media Organic : Instagram (OS)
```

Then you create a **custom tracking link** and connect that link to that source. So when someone clicks an Instagram job link and applies, Ashby automatically tags the candidate as `Social Media Organic : Instagram (OS)`.

Tracking links are created under **Admin > Job Boards > Custom Tracking Links**, and each link can be assigned a source plus an optional tracking code.

### Why this matters

The purpose is to know where each candidate came from. Without tracking, Ashby may only show `Inbound: Applied`. With proper tracking, you can see sources like `Social Media Organic : WhatsApp Channel`, `LinkedIn: LinkedInPosts`, `Email: EmailMarketing`, `Paid: PaidChair`, etc. — which helps measure which channel is bringing applications, qualified candidates, video submissions, interviews, and hires. The main value is not just getting traffic, but understanding which source brings better candidates.

### How this should work

Every time we share a job link, that link should have a source attached. For example, an Instagram Story:

- Source in Ashby: `Social Media Organic : Instagram (OS)`
- UTM code used: `?utm_source=ManuPosting`

See the [source/description tracker spreadsheet](https://docs.google.com/spreadsheets/d/1_5EohtQBKFY3J5-F1uln1AZFdmXV5poJNI32JMyIHH0/edit?usp=sharing) for all sources and their descriptions.

## Correct Labeling/Tagging

(see original Loom walkthrough for a screenshot of the labeling UI)

| Tag | Definition | When to Use |
| --- | --- | --- |
| **Native-like English** | Candidate demonstrates exceptional spoken and written English with clear communication and minimal accent barriers. | Use when a candidate performs at a near-native level and client-facing communication is critical. |
| **#GreatVideo** | Candidate submitted a particularly strong application video with excellent communication, professionalism, and presentation. | Use after reviewing a video that stands out positively. |
| **Batch 0 example candidate** | Candidate sourced from adjacent pipelines and shared for calibration before the first official batch. | Use when presenting sample candidates to gather client feedback and validate search direction. See also [[batch-zero-process|Batch Zero Process]]. |
| **Amazing Portfolio** | Candidate has an exceptional portfolio demonstrating outstanding work quality. | Use for designers, marketers, developers, or creatives with top-tier portfolios. |
| **Terminated — Not Eligible** | Former talent or contractor who was terminated and should not be considered again. | Use after confirming the person is permanently ineligible for rehire. |
| **Terminated — Eligible for Rehire** | Former talent or contractor who was terminated but left on acceptable terms and may be rehired. | Use when the separation was not due to serious performance or conduct issues. |
| **Resigned** | Former employee or contractor who voluntarily left the company. | Use when someone leaves on their own initiative. |
| **Active Hire** | Candidate is currently employed through the company and actively working with a client. | Use once a candidate officially starts employment. |
| **Criteria Corp Assessment Completed** | Candidate has completed the Criteria Corp psychometric or aptitude assessment. | Use immediately after receiving confirmation that the assessment was successfully completed. |

**(Open question left in the source document — needs an answer from the Sourcing team): "How to search for people with a specific label when sourcing on Ashby?"**

## LinkedIn: Post, Open, Refresh, and Close

### Steps to Add a Slot on LinkedIn

1. **Log in and spot an open slot.** Log into LinkedIn Recruiter and check for an empty slot; choose the job.
2. **Dig up the JD** for the role you want to post and set the job details:
   - Job Title: be specific.
   - Workplace Type: Remote.
   - Location: LATAM, Egypt, or wherever makes sense.
   - Employment Type: "Contract."
   - Job Function: Sales, Marketing, Admin — whatever fits the role.
   - Skills: add the essentials (CRM, HubSpot, or whatever fits the bill).
   - Paste the Job Description.
3. **Copy-paste the JD into the slot**, making sure it looks good — no messy formatting or typos.
4. **Add Client Info:** pick the right industry tags (e.g., Marketing Services, Printing Services) and ensure they align with the JD.
5. **Tracking Link Time:** go to Admin > Custom Tracking Links, copy the UTM tracking link, and paste it into the "Application" section in the URL.
6. **Link Test (again, seriously):** paste the link into a new tab and check it works before posting — this step saves headaches later (e.g., `?utm_source=LIrecruiter`).
7. **Post it:** hit "Continue," give everything one last look, and click "Finish."

See the [Loom video on refreshing a slot](https://drive.google.com/file/d/17SWOZlQ8lcj1TFZgNXNEymMnfGa0Wkl0/view) for that step.

### When to add a role to a slot, and why

Utilizing LinkedIn slots is a strategic move to boost visibility for roles that are underperforming. If a role goes "dry" — not attracting a sufficient volume of qualified applicants — it's time to toss it into a slot. This does several things:

- **Automated Visibility:** the role appears more prominently in candidate searches and recommendations.
- **Daily Internal Notifications:** triggers a daily ping to recruiting leads, keeping leadership in the loop on exactly which positions are struggling and need extra love or a sourcing strategy shift.
- **Enhanced Engagement:** increases the number of applications received, giving the team a fresh pool of potential talent.

## InMails to Apply Starters

**Objective:** re-engage candidates who have started an application but have not yet submitted it.

### 1. Categorize the Source

Apply Starters are processed from two sources:

- **Manual Slots:** LinkedIn Recruiter.
- **Automatic Slots:** Ashby (ATS).

### 2. Workflow: Manual Slots (LinkedIn)

1. Navigate to **Jobs** in LinkedIn Recruiter.
2. Locate the role with the **Apply Starters** tag and click it to view the candidate list.
3. Select the candidates you want to message.
4. Click **Message**.
5. Review contact history — be mindful of LinkedIn's warnings regarding recent outreach (e.g., if a candidate was contacted in the last 24 hours or the last month).
6. Send the outreach message:
   - **Required Content:** include the candidate's first name, a reminder that they started the application but didn't finish, and a direct link to the job board.
   - **Tracking:** always include the required tracking link: `/application?utm_source=LIASO`.
   - **Action Item:** instruct candidates to complete the application on the job board rather than replying to the InMail message.

### 3. Workflow: Automatic Slots (Ashby/ATS)

1. Navigate to the **Apply Starters** section in Ashby.
2. Verify the role and client — confirm the specific role requirements (e.g., E-commerce Coordinator).
3. Follow the same outreach and messaging steps as the Manual Slots process.

### 4. Best Practices

- **Monitor Communication:** regularly check your DMs and messages to respond to candidate questions promptly to maintain a positive candidate experience.

## Business Continuity: Tool Outages

What to do when Aircall, Periskope, Ashby, LinkedIn, or Loom are down:

| Tool | Who to Contact |
| --- | --- |
| Periskope | Fer |
| Aircall | Seif or Fer |
| LinkedIn | Fer or Jose |
| Loom videos | Seif |
| Ashby | Youssef for set-up things; Jose for any JD or candidate updates |
| Hirevire | Laura should give access to the recruiting leads or to Fer at least |
| Criteria Corp | Fer |

## Miscellaneous

- Ashby Candidate Search presentation & training: see References below.
- Contact [Youssef Singer](mailto:youssef@scalearmy.com) to add search tips for the following (open items left in the source document, no content provided yet):
  - Region
  - Last time a candidate was considered for a role
  - AWS video: is not empty
  - Video transcription
  - Portfolio links
  - Labeled candidates

## References

- [Closing Jobs on Ashby: Closed Lost & Closed Won (Loom)](https://www.loom.com/share/cdfb857c54414c6daec1d7d452b00a9d)
- [Creating and Publishing QA Job Openings (Loom)](https://www.loom.com/share/f99a53c44e834dcca4187867775e0842)
- [Weekly Pipeline Cleanup to Prevent Ghosting (Loom)](https://www.loom.com/share/3e977520c2f740aab569ce84cc59e08f)
- [Email Templates for Candidate Outreach and Rejection (Loom)](https://www.loom.com/share/3cbe40c8fd2c469992f03a38ab33f73a?live_rewind=1)
- [Troubleshooting Checklist for Dry Pipelines (Google Sheet)](https://docs.google.com/spreadsheets/d/1JKNrzlROifLzqLUqHpj7iBI_kaDkie-h6Sl0NWJ2vNo/edit?gid=673400972#gid=673400972)
- [Automated Workbooks from Ashby (Google Drive folder)](https://drive.google.com/drive/folders/1YXsPk37RrWUZFpyaZ5pm5DxARQ1VKplV)
- [TRS Process for Candidate Batch Management (Loom)](https://www.loom.com/share/a4e86ae5fbec44309721b273d7d07323)
- [Candidate Sources & Descriptions Tracker (Google Sheet)](https://docs.google.com/spreadsheets/d/1_5EohtQBKFY3J5-F1uln1AZFdmXV5poJNI32JMyIHH0/edit?usp=sharing)
- [Refreshing a LinkedIn Slot (Loom)](https://drive.google.com/file/d/17SWOZlQ8lcj1TFZgNXNEymMnfGa0Wkl0/view)
- [How to InMail Apply Starters on LinkedIn (Loom)](https://www.loom.com/share/e7159c37adfb4a32abfd6afd056a59d5)
- [Ashby Candidate Search Presentation & Training (Canva)](https://www.canva.com/design/DAG_ddIwLy4/a0djuLFqvBsBRmgVE7NXkw/edit?utm_content=DAG_ddIwLy4&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton)
- [Search on Ashby Training Session — 2026/01/29 Recording (Google Drive)](https://drive.google.com/file/d/16W9hcf2dGRVDbOlcqxu3hIl517OekCe2/view?usp=drivesdk)

## Checklist

- [ ] Check #new-searches for the new role thread; read the JD and Loom.
- [ ] Set up the department/team in Ashby Admin if it doesn't exist.
- [ ] Create the job from the correct Pod template; never put the client name in the title/JD.
- [ ] Configure the application form as a copy of the Master Template (never edit the original).
- [ ] Activate automation, create the Opening with the Deal ID, mark the job open, and publish.
- [ ] Post the link for QA in the team channel, tagging the recruiter and Recruiting Leader.
- [ ] Run the weekly Ashby Pipeline Cleanup report; reject or move stagnant Application Review candidates within 14 days.
- [ ] Always notify rejected candidates with the correct template — never leave a candidate without feedback.
- [ ] Use the correct rejection reason (see Standard Archive Reasons table).
- [ ] Flag new roles for the dry pipeline tracker immediately after launch; use the right next-step levers (slot, refresh, InMail, social, newsletter).
- [ ] Prepare IRS/TRS packets from the Automated Workbooks folder; never touch the source automation sheet or rename conventions.
- [ ] Tag/label candidates using the standard tag table.
- [ ] Track every shared job link with a UTM code mapped to an Ashby Candidate Source.
- [ ] For LinkedIn slots: post, verify the tracking link works, and refresh/close as needed.
- [ ] InMail Apply Starters with the correct tracking link and messaging.
- [ ] If Aircall/Periskope/Ashby/LinkedIn/Loom/Hirevire/Criteria Corp goes down, contact the right POC from the Business Continuity table.

## Who has contributed to this

Fer (Recruiting Manager), Jose (Recruiting Ops Specialist).

## When was this last updated

2026-09-08
