-- Ontario Mortgage Rate Portal Rate Intelligence Inbox
-- Run after 202606050002_secure_deal_desk.sql.
-- Creates Supabase Storage buckets and normalized tables for lender email/PDF/XLS intake,
-- AI extraction, human approval, and published rate/policy intelligence.

-- ------------------------------------------------------------
-- Storage buckets for raw lender emails, attachments, and parsed artifacts
-- ------------------------------------------------------------

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  (
    'lender-rate-emails',
    'lender-rate-emails',
    false,
    10485760,
    array['message/rfc822', 'text/plain', 'text/html', 'application/json']::text[]
  ),
  (
    'lender-rate-attachments',
    'lender-rate-attachments',
    false,
    52428800,
    array[
      'application/pdf',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/csv',
      'image/png',
      'image/jpeg',
      'application/octet-stream'
    ]::text[]
  ),
  (
    'parsed-rate-artifacts',
    'parsed-rate-artifacts',
    false,
    10485760,
    array['application/json', 'text/plain', 'text/markdown']::text[]
  )
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- Authenticated advisors can read/upload/download only these private rate-intelligence buckets.
-- Server-side workers should use the service-role key and bypass RLS for ingestion automation.

drop policy if exists "rate intelligence storage read" on storage.objects;
create policy "rate intelligence storage read"
on storage.objects
for select
to authenticated
using (bucket_id in ('lender-rate-emails', 'lender-rate-attachments', 'parsed-rate-artifacts'));

drop policy if exists "rate intelligence storage insert" on storage.objects;
create policy "rate intelligence storage insert"
on storage.objects
for insert
to authenticated
with check (bucket_id in ('lender-rate-emails', 'lender-rate-attachments', 'parsed-rate-artifacts'));

-- ------------------------------------------------------------
-- Source inboxes and trusted sender mapping
-- ------------------------------------------------------------

create table if not exists public.lender_email_sources (
  id text primary key,
  workspace_id text not null default 'omrp-default',
  lender_name text not null,
  sender_domain text,
  sender_email text,
  forwarding_address text not null default 'rates@ontariomortgagerateportal.ca',
  trust_level text not null default 'review_required'
    check (trust_level in ('review_required', 'trusted_extract', 'trusted_publish')),
  notes text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists lender_email_sources_workspace_idx
on public.lender_email_sources (workspace_id);

create index if not exists lender_email_sources_sender_email_idx
on public.lender_email_sources (lower(sender_email));

create index if not exists lender_email_sources_sender_domain_idx
on public.lender_email_sources (lower(sender_domain));

create unique index if not exists lender_email_sources_unique_sender_idx
on public.lender_email_sources (
  workspace_id,
  lender_name,
  coalesce(lower(sender_email), ''),
  coalesce(lower(sender_domain), '')
);

-- ------------------------------------------------------------
-- Raw source documents: email bodies, PDFs, Excel sheets, CSVs, images
-- ------------------------------------------------------------

create table if not exists public.rate_source_documents (
  id text primary key,
  workspace_id text not null default 'omrp-default',
  ingestion_event_id text references public.rate_ingestion_events(id) on delete set null,
  source_kind text not null default 'email'
    check (source_kind in ('email', 'attachment', 'manual_upload', 'vendor_portal')),
  lender_name text,
  source_email_from text,
  source_email_to text,
  source_email_subject text,
  source_email_message_id text,
  source_email_thread_id text,
  received_at timestamptz,
  storage_bucket text not null,
  storage_path text not null,
  mime_type text,
  file_name text,
  file_size_bytes bigint check (file_size_bytes is null or file_size_bytes >= 0),
  sha256 text,
  status text not null default 'stored'
    check (status in ('stored', 'queued', 'extracting', 'extracted', 'needs_review', 'approved', 'rejected', 'failed', 'archived')),
  parse_priority integer not null default 50 check (parse_priority between 1 and 100),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (workspace_id, storage_bucket, storage_path)
);

create index if not exists rate_source_documents_workspace_idx
on public.rate_source_documents (workspace_id);

create index if not exists rate_source_documents_lender_idx
on public.rate_source_documents (workspace_id, lender_name);

create index if not exists rate_source_documents_status_idx
on public.rate_source_documents (workspace_id, status);

create index if not exists rate_source_documents_received_at_idx
on public.rate_source_documents (received_at desc);

create index if not exists rate_source_documents_message_id_idx
on public.rate_source_documents (source_email_message_id);

-- ------------------------------------------------------------
-- AI extraction runs and artifacts
-- ------------------------------------------------------------

create table if not exists public.rate_extraction_runs (
  id text primary key,
  workspace_id text not null default 'omrp-default',
  source_document_id text not null references public.rate_source_documents(id) on delete cascade,
  model_name text not null,
  status text not null default 'queued'
    check (status in ('queued', 'running', 'succeeded', 'failed', 'needs_review')),
  started_at timestamptz,
  completed_at timestamptz,
  confidence numeric(5,4) check (confidence is null or (confidence >= 0 and confidence <= 1)),
  summary text,
  error_message text,
  raw_extraction jsonb not null default '{}'::jsonb,
  artifact_bucket text,
  artifact_path text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists rate_extraction_runs_document_idx
on public.rate_extraction_runs (source_document_id);

create index if not exists rate_extraction_runs_workspace_status_idx
on public.rate_extraction_runs (workspace_id, status);

create index if not exists rate_extraction_runs_created_at_idx
on public.rate_extraction_runs (created_at desc);

-- ------------------------------------------------------------
-- AI-detected rate products before human approval
-- ------------------------------------------------------------

create table if not exists public.extracted_rate_products (
  id text primary key,
  workspace_id text not null default 'omrp-default',
  extraction_run_id text not null references public.rate_extraction_runs(id) on delete cascade,
  source_document_id text not null references public.rate_source_documents(id) on delete cascade,
  lender_name text not null,
  product_name text,
  province text not null default 'Ontario',
  purpose text,
  occupancy text,
  mortgage_type text check (mortgage_type is null or mortgage_type in ('fixed', 'variable', 'heloc', 'private', 'alternative', 'other')),
  term_label text,
  term_months integer check (term_months is null or term_months > 0),
  amortization_years integer check (amortization_years is null or amortization_years > 0),
  insured_rate numeric(6,3) check (insured_rate is null or insured_rate >= 0),
  insurable_rate numeric(6,3) check (insurable_rate is null or insurable_rate >= 0),
  uninsured_rate numeric(6,3) check (uninsured_rate is null or uninsured_rate >= 0),
  variable_discount text,
  lender_prime_rate numeric(6,3) check (lender_prime_rate is null or lender_prime_rate >= 0),
  rate_hold_days integer check (rate_hold_days is null or rate_hold_days >= 0),
  effective_date date,
  expiry_date date,
  conditions jsonb not null default '[]'::jsonb,
  policy_notes jsonb not null default '[]'::jsonb,
  bdm_contact jsonb not null default '{}'::jsonb,
  confidence numeric(5,4) check (confidence is null or (confidence >= 0 and confidence <= 1)),
  status text not null default 'needs_review'
    check (status in ('needs_review', 'approved', 'rejected', 'published', 'archived')),
  reviewer_id uuid references auth.users(id) on delete set null,
  reviewed_at timestamptz,
  review_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists extracted_rate_products_workspace_status_idx
on public.extracted_rate_products (workspace_id, status);

create index if not exists extracted_rate_products_lender_idx
on public.extracted_rate_products (workspace_id, lender_name);

create index if not exists extracted_rate_products_effective_date_idx
on public.extracted_rate_products (effective_date desc);

-- ------------------------------------------------------------
-- Clean approved/published rates shown in the portal
-- ------------------------------------------------------------

create table if not exists public.published_rates (
  id text primary key,
  workspace_id text not null default 'omrp-default',
  extracted_rate_product_id text references public.extracted_rate_products(id) on delete set null,
  source_document_id text references public.rate_source_documents(id) on delete set null,
  lender_name text not null,
  product_name text not null,
  province text not null default 'Ontario',
  purpose text,
  occupancy text,
  mortgage_type text check (mortgage_type is null or mortgage_type in ('fixed', 'variable', 'heloc', 'private', 'alternative', 'other')),
  term_label text not null,
  term_months integer check (term_months is null or term_months > 0),
  insured_rate numeric(6,3) check (insured_rate is null or insured_rate >= 0),
  insurable_rate numeric(6,3) check (insurable_rate is null or insurable_rate >= 0),
  uninsured_rate numeric(6,3) check (uninsured_rate is null or uninsured_rate >= 0),
  variable_discount text,
  rate_hold_days integer check (rate_hold_days is null or rate_hold_days >= 0),
  effective_date date not null,
  expiry_date date,
  source_label text not null default 'Lender email',
  freshness_status text not null default 'fresh'
    check (freshness_status in ('fresh', 'watch', 'stale', 'expired')),
  confidence numeric(5,4) check (confidence is null or (confidence >= 0 and confidence <= 1)),
  public_notes text,
  conditions jsonb not null default '[]'::jsonb,
  is_published boolean not null default true,
  approved_by uuid references auth.users(id) on delete set null,
  approved_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists published_rates_workspace_published_idx
on public.published_rates (workspace_id, is_published);

create index if not exists published_rates_lender_idx
on public.published_rates (workspace_id, lender_name);

create index if not exists published_rates_effective_date_idx
on public.published_rates (effective_date desc);

create index if not exists published_rates_freshness_idx
on public.published_rates (workspace_id, freshness_status);

-- ------------------------------------------------------------
-- Policy notes and BDM contacts extracted from lender communications
-- ------------------------------------------------------------

create table if not exists public.lender_policy_notes (
  id text primary key,
  workspace_id text not null default 'omrp-default',
  source_document_id text references public.rate_source_documents(id) on delete set null,
  lender_name text not null,
  category text not null default 'general',
  title text not null,
  note text not null,
  borrower_scenario_tags text[] not null default '{}'::text[],
  province text not null default 'Ontario',
  effective_date date,
  expiry_date date,
  confidence numeric(5,4) check (confidence is null or (confidence >= 0 and confidence <= 1)),
  status text not null default 'needs_review'
    check (status in ('needs_review', 'approved', 'rejected', 'published', 'archived')),
  approved_by uuid references auth.users(id) on delete set null,
  approved_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists lender_policy_notes_workspace_status_idx
on public.lender_policy_notes (workspace_id, status);

create index if not exists lender_policy_notes_lender_idx
on public.lender_policy_notes (workspace_id, lender_name);

create table if not exists public.lender_contacts (
  id text primary key,
  workspace_id text not null default 'omrp-default',
  source_document_id text references public.rate_source_documents(id) on delete set null,
  lender_name text not null,
  name text not null,
  role text,
  email text,
  phone text,
  region text,
  province text not null default 'Ontario',
  notes text,
  confidence numeric(5,4) check (confidence is null or (confidence >= 0 and confidence <= 1)),
  status text not null default 'needs_review'
    check (status in ('needs_review', 'approved', 'rejected', 'published', 'archived')),
  approved_by uuid references auth.users(id) on delete set null,
  approved_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists lender_contacts_workspace_status_idx
on public.lender_contacts (workspace_id, status);

create index if not exists lender_contacts_lender_idx
on public.lender_contacts (workspace_id, lender_name);

create index if not exists lender_contacts_email_idx
on public.lender_contacts (lower(email));

-- ------------------------------------------------------------
-- Updated-at triggers
-- ------------------------------------------------------------

drop trigger if exists set_lender_email_sources_updated_at on public.lender_email_sources;
create trigger set_lender_email_sources_updated_at
before update on public.lender_email_sources
for each row
execute function public.set_updated_at();

drop trigger if exists set_rate_source_documents_updated_at on public.rate_source_documents;
create trigger set_rate_source_documents_updated_at
before update on public.rate_source_documents
for each row
execute function public.set_updated_at();

drop trigger if exists set_rate_extraction_runs_updated_at on public.rate_extraction_runs;
create trigger set_rate_extraction_runs_updated_at
before update on public.rate_extraction_runs
for each row
execute function public.set_updated_at();

drop trigger if exists set_extracted_rate_products_updated_at on public.extracted_rate_products;
create trigger set_extracted_rate_products_updated_at
before update on public.extracted_rate_products
for each row
execute function public.set_updated_at();

drop trigger if exists set_published_rates_updated_at on public.published_rates;
create trigger set_published_rates_updated_at
before update on public.published_rates
for each row
execute function public.set_updated_at();

drop trigger if exists set_lender_policy_notes_updated_at on public.lender_policy_notes;
create trigger set_lender_policy_notes_updated_at
before update on public.lender_policy_notes
for each row
execute function public.set_updated_at();

drop trigger if exists set_lender_contacts_updated_at on public.lender_contacts;
create trigger set_lender_contacts_updated_at
before update on public.lender_contacts
for each row
execute function public.set_updated_at();

-- ------------------------------------------------------------
-- RLS: authenticated advisors stay inside their workspace.
-- Automation/service-role ingestion bypasses RLS server-side.
-- ------------------------------------------------------------

alter table public.lender_email_sources enable row level security;
alter table public.rate_source_documents enable row level security;
alter table public.rate_extraction_runs enable row level security;
alter table public.extracted_rate_products enable row level security;
alter table public.published_rates enable row level security;
alter table public.lender_policy_notes enable row level security;
alter table public.lender_contacts enable row level security;

-- Helper pattern repeated intentionally for SQL Editor portability.

-- lender_email_sources

drop policy if exists "lender email sources authenticated read" on public.lender_email_sources;
create policy "lender email sources authenticated read"
on public.lender_email_sources
for select
to authenticated
using (workspace_id = coalesce(auth.jwt() -> 'app_metadata' ->> 'workspace_id', 'omrp-default'));

drop policy if exists "lender email sources authenticated insert" on public.lender_email_sources;
create policy "lender email sources authenticated insert"
on public.lender_email_sources
for insert
to authenticated
with check (workspace_id = coalesce(auth.jwt() -> 'app_metadata' ->> 'workspace_id', 'omrp-default'));

drop policy if exists "lender email sources authenticated update" on public.lender_email_sources;
create policy "lender email sources authenticated update"
on public.lender_email_sources
for update
to authenticated
using (workspace_id = coalesce(auth.jwt() -> 'app_metadata' ->> 'workspace_id', 'omrp-default'))
with check (workspace_id = coalesce(auth.jwt() -> 'app_metadata' ->> 'workspace_id', 'omrp-default'));

-- rate_source_documents

drop policy if exists "rate documents authenticated read" on public.rate_source_documents;
create policy "rate documents authenticated read"
on public.rate_source_documents
for select
to authenticated
using (workspace_id = coalesce(auth.jwt() -> 'app_metadata' ->> 'workspace_id', 'omrp-default'));

drop policy if exists "rate documents authenticated insert" on public.rate_source_documents;
create policy "rate documents authenticated insert"
on public.rate_source_documents
for insert
to authenticated
with check (workspace_id = coalesce(auth.jwt() -> 'app_metadata' ->> 'workspace_id', 'omrp-default'));

drop policy if exists "rate documents authenticated update" on public.rate_source_documents;
create policy "rate documents authenticated update"
on public.rate_source_documents
for update
to authenticated
using (workspace_id = coalesce(auth.jwt() -> 'app_metadata' ->> 'workspace_id', 'omrp-default'))
with check (workspace_id = coalesce(auth.jwt() -> 'app_metadata' ->> 'workspace_id', 'omrp-default'));

-- rate_extraction_runs

drop policy if exists "rate extraction runs authenticated read" on public.rate_extraction_runs;
create policy "rate extraction runs authenticated read"
on public.rate_extraction_runs
for select
to authenticated
using (workspace_id = coalesce(auth.jwt() -> 'app_metadata' ->> 'workspace_id', 'omrp-default'));

drop policy if exists "rate extraction runs authenticated insert" on public.rate_extraction_runs;
create policy "rate extraction runs authenticated insert"
on public.rate_extraction_runs
for insert
to authenticated
with check (workspace_id = coalesce(auth.jwt() -> 'app_metadata' ->> 'workspace_id', 'omrp-default'));

drop policy if exists "rate extraction runs authenticated update" on public.rate_extraction_runs;
create policy "rate extraction runs authenticated update"
on public.rate_extraction_runs
for update
to authenticated
using (workspace_id = coalesce(auth.jwt() -> 'app_metadata' ->> 'workspace_id', 'omrp-default'))
with check (workspace_id = coalesce(auth.jwt() -> 'app_metadata' ->> 'workspace_id', 'omrp-default'));

-- extracted_rate_products

drop policy if exists "extracted rate products authenticated read" on public.extracted_rate_products;
create policy "extracted rate products authenticated read"
on public.extracted_rate_products
for select
to authenticated
using (workspace_id = coalesce(auth.jwt() -> 'app_metadata' ->> 'workspace_id', 'omrp-default'));

drop policy if exists "extracted rate products authenticated insert" on public.extracted_rate_products;
create policy "extracted rate products authenticated insert"
on public.extracted_rate_products
for insert
to authenticated
with check (workspace_id = coalesce(auth.jwt() -> 'app_metadata' ->> 'workspace_id', 'omrp-default'));

drop policy if exists "extracted rate products authenticated update" on public.extracted_rate_products;
create policy "extracted rate products authenticated update"
on public.extracted_rate_products
for update
to authenticated
using (workspace_id = coalesce(auth.jwt() -> 'app_metadata' ->> 'workspace_id', 'omrp-default'))
with check (workspace_id = coalesce(auth.jwt() -> 'app_metadata' ->> 'workspace_id', 'omrp-default'));

-- published_rates: anonymous public read for published/default workspace rates; authenticated write/review.

drop policy if exists "published rates public read" on public.published_rates;
create policy "published rates public read"
on public.published_rates
for select
to anon
using (is_published = true and workspace_id = 'omrp-default');

drop policy if exists "published rates authenticated read" on public.published_rates;
create policy "published rates authenticated read"
on public.published_rates
for select
to authenticated
using (workspace_id = coalesce(auth.jwt() -> 'app_metadata' ->> 'workspace_id', 'omrp-default'));

drop policy if exists "published rates authenticated insert" on public.published_rates;
create policy "published rates authenticated insert"
on public.published_rates
for insert
to authenticated
with check (workspace_id = coalesce(auth.jwt() -> 'app_metadata' ->> 'workspace_id', 'omrp-default'));

drop policy if exists "published rates authenticated update" on public.published_rates;
create policy "published rates authenticated update"
on public.published_rates
for update
to authenticated
using (workspace_id = coalesce(auth.jwt() -> 'app_metadata' ->> 'workspace_id', 'omrp-default'))
with check (workspace_id = coalesce(auth.jwt() -> 'app_metadata' ->> 'workspace_id', 'omrp-default'));

-- lender_policy_notes

drop policy if exists "policy notes public read" on public.lender_policy_notes;
create policy "policy notes public read"
on public.lender_policy_notes
for select
to anon
using (status = 'published' and workspace_id = 'omrp-default');

drop policy if exists "policy notes authenticated read" on public.lender_policy_notes;
create policy "policy notes authenticated read"
on public.lender_policy_notes
for select
to authenticated
using (workspace_id = coalesce(auth.jwt() -> 'app_metadata' ->> 'workspace_id', 'omrp-default'));

drop policy if exists "policy notes authenticated insert" on public.lender_policy_notes;
create policy "policy notes authenticated insert"
on public.lender_policy_notes
for insert
to authenticated
with check (workspace_id = coalesce(auth.jwt() -> 'app_metadata' ->> 'workspace_id', 'omrp-default'));

drop policy if exists "policy notes authenticated update" on public.lender_policy_notes;
create policy "policy notes authenticated update"
on public.lender_policy_notes
for update
to authenticated
using (workspace_id = coalesce(auth.jwt() -> 'app_metadata' ->> 'workspace_id', 'omrp-default'))
with check (workspace_id = coalesce(auth.jwt() -> 'app_metadata' ->> 'workspace_id', 'omrp-default'));

-- lender_contacts

drop policy if exists "lender contacts public read" on public.lender_contacts;
create policy "lender contacts public read"
on public.lender_contacts
for select
to anon
using (status = 'published' and workspace_id = 'omrp-default');

drop policy if exists "lender contacts authenticated read" on public.lender_contacts;
create policy "lender contacts authenticated read"
on public.lender_contacts
for select
to authenticated
using (workspace_id = coalesce(auth.jwt() -> 'app_metadata' ->> 'workspace_id', 'omrp-default'));

drop policy if exists "lender contacts authenticated insert" on public.lender_contacts;
create policy "lender contacts authenticated insert"
on public.lender_contacts
for insert
to authenticated
with check (workspace_id = coalesce(auth.jwt() -> 'app_metadata' ->> 'workspace_id', 'omrp-default'));

drop policy if exists "lender contacts authenticated update" on public.lender_contacts;
create policy "lender contacts authenticated update"
on public.lender_contacts
for update
to authenticated
using (workspace_id = coalesce(auth.jwt() -> 'app_metadata' ->> 'workspace_id', 'omrp-default'))
with check (workspace_id = coalesce(auth.jwt() -> 'app_metadata' ->> 'workspace_id', 'omrp-default'));
