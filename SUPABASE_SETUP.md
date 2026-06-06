# Supabase setup for Ontario Mortgage Rate Portal

## 1) Base table

In Supabase Dashboard → SQL Editor, run:

```sql
-- paste the contents of:
supabase/migrations/202606050001_deal_desk_deals.sql
```

This creates `public.deal_desk_deals` for the Deal Desk pipeline.

## 2) Security/workflow hardening

Then run:

```sql
-- paste the contents of:
supabase/migrations/202606050002_secure_deal_desk.sql
```

This adds:

- Supabase Auth/RLS-only access for authenticated advisors
- `workspace_id` and `owner_id` on deals
- borrower contact, property type, down payment/equity, income, GDS/TDS, selected lender/rate fields
- `public.rate_ingestion_events` for lender rate-sheet approval queue
- `public.deal_audit_events` for compliance/change history
- removes the original anonymous MVP read/write/delete policies

## 3) Add Vercel environment variables

In Vercel → Project → Settings → Environment Variables, add:

- `SUPABASE_URL` = your Supabase Project URL
- `SUPABASE_ANON_KEY` = your Supabase anon/public key

The front-end reads them through `/api/supabase-config`.

## 4) Enable advisor login

In Supabase Dashboard:

1. Authentication → Providers → Email: enable Email OTP/magic link.
2. Authentication → URL Configuration:
   - Site URL: your Vercel domain, e.g. `https://ontario-mortgage-rate-portal-kappa.vercel.app`
   - Redirect URLs: add `https://ontario-mortgage-rate-portal-kappa.vercel.app/*`
3. Add/invite advisor users under Authentication → Users.

Optional multi-workspace setup: set `app_metadata.workspace_id` for each advisor. If omitted, app uses `omrp-default`.

## 5) Rate Intelligence Inbox / lender email intake

After the Deal Desk security migration succeeds, run:

```sql
-- paste the contents of:
supabase/migrations/202606060001_rate_email_intelligence_inbox.sql
```

This creates the private storage buckets and database tables for forwarding lender emails/rate sheets into an AI extraction + approval queue.

Detailed setup guides:

```text
RESEND_RATE_INBOX_SETUP.md              # preferred: user emails Resend address and AI auto-updates
RATE_INTELLIGENCE_INBOX_SETUP.md        # database/storage architecture reference
```

## 6) Redeploy Vercel

Redeploy production after adding env vars and running SQL.

## Security note

The first migration was MVP anonymous sync. The second migration removes those anonymous policies and requires Supabase Auth. Do **not** enter real borrower PII until `202606050002_secure_deal_desk.sql` has been run and advisor login is confirmed.

Raw lender emails/attachments should stay private in Supabase Storage. Only approved rows from `published_rates`, `lender_policy_notes`, and `lender_contacts` should appear publicly.
