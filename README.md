# Scale Army SOP Handbook

This is the markdown source-of-truth vault for Scale Army's Standard Operating Procedures, built from the master SOP Handbook and its linked source documents.

## Structure

```
SOPs/
├── account-management/     # AM + Client Success SOPs and glossaries
├── recruitment/             # Recruiting process, screening, SLA, offer stage
├── hr/                      # Payroll, disciplinary process, offboarding, legal terms
├── it/                      # IT + HubSpot SOPs and glossary
├── sales/                   # Sales training, follow-up, cold calling, glossary
├── finance/                 # Billing, payroll prep, forecasting, commissions, referral bonus
├── outbound-ashby-linkedin/ # Batch 0, closing/posting roles on Ashby, LinkedIn slots
├── marketing/                # Funnel definitions and channel overview
└── sopsop/                   # How to write an SOP (meta/template)
```

Every file has YAML frontmatter (`title`, `department`, `category`, `owner`, `last_updated`) so the future Next.js site and RAG ingest pipeline can build navigation and citations directly from it.

## Known gaps

A few SOPs in the original handbook point to folders (not single docs) or to video walkthroughs rather than written procedures. Those are included here as short stub files with a pointer, rather than invented content:

- `it/it-sop.md`, `it/hubspot-sop.md` — live across a shared Drive folder, not a single doc.
- `recruitment/recruiting-calls-daily.md`, `batch-zero-process.md`, `dry-pipeline-management.md`, `candidate-interview-process.md`, `av-prep-calls-for-client-interview.md` — primary reference is a live spreadsheet or recorded video.
- `recruitment/recruiter-offer-stage-how-to-give-an-offer.md` — the linked source doc was inaccessible (moved/deleted/permissions) at the time of this pull.

Consider assigning an owner to backfill these directly as markdown going forward, so they don't stay as stubs.

## Source

Converted from "Scale Army: SOP Handbook" (Google Doc) and its linked source documents. All content, ownership, and dates reviewed and confirmed current as of July 20, 2026.
