# Rate Intelligence Inbox setup

Goal: brokers forward lender emails/rate sheets into one controlled intake inbox. The app stores the raw email and attachments in Supabase Storage, runs AI extraction, places detected rates/policies/BDM contacts into a review queue, and publishes only approved items to the Rate Desk.

## 1) Run the SQL migration

In Supabase Dashboard → SQL Editor, run:

```sql
-- paste the contents of:
supabase/migrations/202606060001_rate_email_intelligence_inbox.sql
```

This creates:

- private Supabase Storage buckets:
  - `lender-rate-emails`
  - `lender-rate-attachments`
  - `parsed-rate-artifacts`
- source/sender mapping:
  - `public.lender_email_sources`
- raw document registry:
  - `public.rate_source_documents`
- AI extraction tracking:
  - `public.rate_extraction_runs`
- human-review queue:
  - `public.extracted_rate_products`
- approved portal data:
  - `public.published_rates`
  - `public.lender_policy_notes`
  - `public.lender_contacts`

## 2) Create the intake email address

Recommended MVP address:

```text
rates@ontariomortgagerateportal.ca
```

Acceptable SI internal test address:

```text
lender-rates@sicapital.ca
```

Broker workflow:

1. Broker receives lender rate sheet/update.
2. Broker forwards it to the intake address.
3. Subject can remain unchanged.
4. Attachments should remain attached.

## 3) Add Gmail/Workspace routing rules

For each broker mailbox, create filters like:

```text
From contains: td.com OR scotiabank.com OR firstnational.ca OR mcap.com OR rmgmortgages.ca
Action: Forward to rates@ontariomortgagerateportal.ca
Action: Apply label Lender Rates
```

For manual MVP, brokers can simply forward rate emails themselves.

## 4) Worker design

A server-side worker should run every 5–10 minutes:

1. Search Gmail for unread/new emails in the intake inbox.
2. Save the raw email body as `.eml`, `.html`, `.txt`, or `.json` into `lender-rate-emails`.
3. Save PDFs/XLS/XLSX/CSV/images into `lender-rate-attachments`.
4. Insert one row per stored source into `public.rate_source_documents`.
5. Insert or update `public.rate_ingestion_events` with status `Pending review`.
6. Run AI extraction.
7. Save raw AI JSON into `parsed-rate-artifacts`.
8. Insert `public.rate_extraction_runs`.
9. Insert detected products into `public.extracted_rate_products` with status `needs_review`.
10. Mark the email as processed or apply a `Processed` label.

Use the Supabase service-role key only inside the server-side worker. Never expose it to the browser.

## 5) AI extraction contract

Each AI run should produce structured JSON like:

```json
{
  "lender_name": "MCAP",
  "effective_date": "2026-06-06",
  "summary": "MCAP lowered 5-year insured fixed by 10 bps.",
  "products": [
    {
      "product_name": "5 Year Fixed Special",
      "province": "Ontario",
      "mortgage_type": "fixed",
      "term_label": "5 Year Fixed",
      "term_months": 60,
      "insured_rate": 4.29,
      "insurable_rate": 4.44,
      "uninsured_rate": 4.69,
      "rate_hold_days": 120,
      "conditions": ["Owner occupied", "Purchase only", "Beacon 680+"],
      "policy_notes": ["Rental offset allowed at 80%"],
      "confidence": 0.87
    }
  ],
  "policy_notes": [
    {
      "category": "Rental",
      "title": "Rental offset",
      "note": "Rental offset allowed at 80% where eligible.",
      "borrower_scenario_tags": ["rental", "investor"],
      "confidence": 0.82
    }
  ],
  "contacts": [
    {
      "name": "Jane Smith",
      "role": "BDM",
      "email": "jane@examplelender.ca",
      "phone": "416-555-0100",
      "region": "Ontario",
      "confidence": 0.9
    }
  ]
}
```

## 6) Human approval rule

Do not auto-publish AI-detected rates.

Required workflow:

1. AI extraction creates `needs_review` rows.
2. Admin reviews source email/PDF beside the extracted result.
3. Admin edits incorrect terms/rates/conditions.
4. Admin approves.
5. Approved rows are copied into:
   - `public.published_rates`
   - `public.lender_policy_notes`
   - `public.lender_contacts`
6. Public/pro Rate Desk reads only approved/published rows.

## 7) UI modules to build

Add an authenticated admin section called **Rate Intelligence Inbox**:

- New email cards
- Lender/source/effective date/freshness status
- Confidence score
- View source email
- View attachment
- Extracted product table
- Approve / edit / reject controls
- Publish history and audit trail

Public Rate Desk should show:

- lender
- rate
- term
- insured/insurable/uninsured context
- source label
- effective date
- freshness/stale warning
- policy catch
- BDM/contact where approved

## Security notes

- Raw lender emails and attachments stay private.
- Browser uses anon key only.
- Service-role key belongs only in server-side worker/env.
- Public users can only read approved published rates/policies/contacts for `omrp-default`.
- Authenticated advisors can manage records inside their workspace via RLS.
