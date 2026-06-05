# Supabase setup for Ontario Mortgage Rate Portal

## 1) Create the table

In Supabase Dashboard → SQL Editor, run:

```sql
-- paste the contents of:
supabase/migrations/202606050001_deal_desk_deals.sql
```

This creates `public.deal_desk_deals` for the Deal Desk pipeline.

## 2) Add Vercel environment variables

In Vercel → Project → Settings → Environment Variables, add:

- `SUPABASE_URL` = your Supabase Project URL
- `SUPABASE_ANON_KEY` = your Supabase anon/public key

The front-end reads them through `/api/supabase-config`.

## 3) Redeploy Vercel

Redeploy production after adding env vars.

## Security note

Current MVP policies allow anonymous read/write/delete so the static Deal Desk can sync without login. Do **not** enter real borrower PII until auth/workspace-scoped RLS is added.

Next hardening step: Supabase Auth + `workspace_id` policies so only SI advisors can see SI deals.
