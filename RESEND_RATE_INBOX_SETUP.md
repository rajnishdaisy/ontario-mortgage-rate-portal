# Resend Auto Rate Intelligence Inbox

This is the preferred workflow: brokers/lenders simply email a Resend receiving address, then the system stores, AI-reads, auto-reviews, and updates the Rate Desk.

## Flow

```text
Broker/lender sends email
  → rates@<dedicated-omrp>.resend.app handled by the dedicated OMRP Resend Inbound setup
  → Resend webhook POST /api/resend-inbound
  → API retrieves full email + attachments from Resend
  → stores raw email in Supabase Storage bucket lender-rate-emails
  → stores attachments in lender-rate-attachments
  → checks sender against the trusted sender allowlist
  → unapproved senders are rejected/skipped without AI analysis
  → approved senders are queued for the hourly rate update cron
  → Vercel Cron GET /api/rate-updates-cron every hour
  → OpenAI extracts rates/policies/BDM contacts
  → stores extraction JSON in parsed-rate-artifacts
  → writes normalized rows to Supabase
  → auto-publishes clean/high-confidence rate updates
  → low-confidence items stay in needs_review
```

## API endpoint

Production webhook URL:

```text
https://YOUR-VERCEL-DOMAIN/api/resend-inbound
```

Local/preview webhook URL uses the same path on the preview domain.

## Resend setup

1. Create/use a **dedicated Resend project/API key for OMRP**. Do not reuse the SI Capital docs Resend setup.
2. In Resend, configure a receiving domain. A Resend-managed `*.resend.app` receiving domain works when no custom domain is ready.
3. If using the Resend-managed domain, use the generated `*.resend.app` address shown in Resend. Pick `rates@<managed-domain>.resend.app` as the operating inbox.
4. Create a webhook endpoint pointing to production:

```text
https://ontario-mortgage-rate-portal-kappa.vercel.app/api/resend-inbound
```

5. Subscribe it to the event:

```text
email.received
```

6. Copy the webhook signing secret.
7. Create/copy a Resend API key scoped to this dedicated OMRP setup.
8. Add the API key, webhook secret, and exact managed inbox address to Vercel production.

Current temporary inbox / legacy shared feed:

```text
rates@luniaontua.resend.app
```

Target after split, with no custom domain yet:

```text
rates@<dedicated-omrp>.resend.app
```

The app has a recipient allowlist. Only addresses listed in `RATE_AI_ALLOWED_RECIPIENTS` are processed. This prevents SI Capital `docs.sicapital.ca` mail from being stored or analyzed if a provider feed is accidentally shared.

No Gmail polling is required.

## Required Vercel environment variables

```text
SUPABASE_URL=...
SUPABASE_SERVICE_ROLE_KEY=...
RESEND_API_KEY=...
RESEND_WEBHOOK_SECRET=...
RATE_AI_ALLOWED_RECIPIENTS=rates@<dedicated-omrp>.resend.app
OPENAI_API_KEY=...
OPENAI_RATE_EXTRACTION_MODEL=gpt-4.1-mini
RATE_AI_AUTO_PUBLISH_MIN_CONFIDENCE=0.84
RATE_AI_WORKSPACE_ID=omrp-default
RATE_AI_ALLOWED_SENDERS=rates@examplelender.ca,bdm@examplebank.com
RATE_AI_ALLOW_ACTIVE_PROFILE_SENDERS=true
RATE_AI_ACTIVE_ADMIN_CAN_PUBLISH=false
RATE_AI_CRON_BATCH_LIMIT=10
CRON_SECRET=...
```

`RATE_AI_ALLOWED_SENDERS` is the safety gate for lender/direct sender addresses. Exact emails are preferred. Domain entries such as `examplebank.com`, `@examplebank.com`, or `*.examplebank.com` are supported but should only be used when the whole domain is trusted.

Active broker/admin profile emails are also accepted by default (`RATE_AI_ALLOW_ACTIVE_PROFILE_SENDERS=true`) so onboarded brokers can forward lender rate emails into the Resend inbox. Broker-forwarded mail is analyzed/categorized as `trusted_extract`; it does not auto-publish unless a sender is explicitly `trusted_publish` or `RATE_AI_ACTIVE_ADMIN_CAN_PUBLISH=true` is enabled for admin profiles.

You can also manage trusted senders in Supabase table `lender_email_sources` by setting `sender_email` and `trust_level` to `trusted_extract` or `trusted_publish`.

## Hourly cron

The hourly cron processes queued inbound emails by default:

```json
{
  "path": "/api/rate-updates-cron",
  "schedule": "0 * * * *"
}
```

By default `/api/rate-updates-cron` uses `sourceKind=email`, which is the lender-email bucket flow. To override for operations/testing, set `RATE_AI_CRON_SOURCE_KIND=all` or call the endpoint with `?sourceKind=all` / `?sourceKind=manual_upload`.

## Auto-review / auto-update rule

The cron does not wait for a human when the sender is approved and the AI result is high-confidence.

It automatically publishes extracted products to `published_rates` when:

- the AI says auto-publish is recommended
- overall confidence is at or above `RATE_AI_AUTO_PUBLISH_MIN_CONFIDENCE`
- lender/product/rate details are clear enough to normalize

Otherwise it still stores the email, attachment, extraction run, and extracted products, but leaves them as `needs_review`.

## What gets updated

Successful high-confidence emails update:

- `published_rates`
- `lender_policy_notes`
- `lender_contacts`
- `rate_ingestion_events`
- `rate_source_documents`
- `rate_extraction_runs`

Raw source files stay private in Supabase Storage.

## Notes

- Resend webhooks only send metadata, so `/api/resend-inbound` calls Resend's Receiving API to fetch the body, headers, and attachment download URLs.
- PDF/image/text/CSV attachments are passed to OpenAI extraction when possible.
- Excel `.xlsx` / `.xlsm` sheets are converted to CSV-like text server-side with ExcelJS before AI extraction. Legacy `.xls` files are stored/tracked and may need manual review if conversion fails.
- The Supabase service role key must never be exposed to browser JavaScript.
