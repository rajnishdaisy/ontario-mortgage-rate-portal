-- Ontario Mortgage Rate Portal Deal Desk security + workflow hardening
-- Run this after 202606050001_deal_desk_deals.sql.
-- Enables authenticated advisor access, expanded underwriting fields,
-- rate ingestion events, and audit trail storage.

alter table public.deal_desk_deals
  add column if not exists workspace_id text not null default 'omrp-default',
  add column if not exists owner_id uuid references auth.users(id) on delete set null,
  add column if not exists borrower_email text,
  add column if not exists borrower_phone text,
  add column if not exists property_type text,
  add column if not exists existing_mortgage_amount numeric(14,2) not null default 0 check (existing_mortgage_amount >= 0),
  add column if not exists down_payment_source text,
  add column if not exists annual_income numeric(14,2) check (annual_income is null or annual_income >= 0),
  add column if not exists gds numeric(5,2) check (gds is null or gds >= 0),
  add column if not exists tds numeric(5,2) check (tds is null or tds >= 0),
  add column if not exists selected_lender text,
  add column if not exists selected_rate numeric(6,3) check (selected_rate is null or selected_rate >= 0),
  add column if not exists selected_reason text,
  add column if not exists document_checklist jsonb not null default '[]'::jsonb;

create index if not exists deal_desk_deals_workspace_idx on public.deal_desk_deals (workspace_id);
create index if not exists deal_desk_deals_owner_idx on public.deal_desk_deals (owner_id);

create table if not exists public.rate_ingestion_events (
  id text primary key,
  workspace_id text not null default 'omrp-default',
  created_by uuid references auth.users(id) on delete set null,
  lender text not null,
  source text not null default 'Manual upload',
  effective_date date,
  status text not null default 'Pending review' check (status in ('Pending review', 'Approved', 'Rejected', 'Stale')),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists rate_ingestion_events_workspace_idx on public.rate_ingestion_events (workspace_id);
create index if not exists rate_ingestion_events_created_at_idx on public.rate_ingestion_events (created_at desc);

create table if not exists public.deal_audit_events (
  id text primary key,
  workspace_id text not null default 'omrp-default',
  actor_id uuid references auth.users(id) on delete set null,
  actor_email text,
  deal_id text,
  action text not null,
  summary text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists deal_audit_events_workspace_idx on public.deal_audit_events (workspace_id);
create index if not exists deal_audit_events_deal_idx on public.deal_audit_events (deal_id);
create index if not exists deal_audit_events_created_at_idx on public.deal_audit_events (created_at desc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_rate_ingestion_events_updated_at on public.rate_ingestion_events;
create trigger set_rate_ingestion_events_updated_at
before update on public.rate_ingestion_events
for each row
execute function public.set_updated_at();

alter table public.rate_ingestion_events enable row level security;
alter table public.deal_audit_events enable row level security;
alter table public.deal_desk_deals enable row level security;

-- Remove MVP anonymous policies. Real borrower data must require auth.
drop policy if exists "deal desk anon read" on public.deal_desk_deals;
drop policy if exists "deal desk anon insert" on public.deal_desk_deals;
drop policy if exists "deal desk anon update" on public.deal_desk_deals;
drop policy if exists "deal desk anon delete" on public.deal_desk_deals;

-- Deal records: authenticated advisors can work inside their workspace.
-- Workspace defaults to 'omrp-default'. Later, set app_metadata.workspace_id per user for multi-tenant teams.
drop policy if exists "deal desk authenticated read" on public.deal_desk_deals;
create policy "deal desk authenticated read"
on public.deal_desk_deals
for select
to authenticated
using (workspace_id = coalesce(auth.jwt() -> 'app_metadata' ->> 'workspace_id', 'omrp-default'));

drop policy if exists "deal desk authenticated insert" on public.deal_desk_deals;
create policy "deal desk authenticated insert"
on public.deal_desk_deals
for insert
to authenticated
with check (
  owner_id = auth.uid()
  and workspace_id = coalesce(auth.jwt() -> 'app_metadata' ->> 'workspace_id', 'omrp-default')
);

drop policy if exists "deal desk authenticated update" on public.deal_desk_deals;
create policy "deal desk authenticated update"
on public.deal_desk_deals
for update
to authenticated
using (workspace_id = coalesce(auth.jwt() -> 'app_metadata' ->> 'workspace_id', 'omrp-default'))
with check (workspace_id = coalesce(auth.jwt() -> 'app_metadata' ->> 'workspace_id', 'omrp-default'));

drop policy if exists "deal desk authenticated delete" on public.deal_desk_deals;
create policy "deal desk authenticated delete"
on public.deal_desk_deals
for delete
to authenticated
using (workspace_id = coalesce(auth.jwt() -> 'app_metadata' ->> 'workspace_id', 'omrp-default'));

-- Rate ingestion queue: authenticated workspace users can manage rate events.
drop policy if exists "rate events authenticated read" on public.rate_ingestion_events;
create policy "rate events authenticated read"
on public.rate_ingestion_events
for select
to authenticated
using (workspace_id = coalesce(auth.jwt() -> 'app_metadata' ->> 'workspace_id', 'omrp-default'));

drop policy if exists "rate events authenticated insert" on public.rate_ingestion_events;
create policy "rate events authenticated insert"
on public.rate_ingestion_events
for insert
to authenticated
with check (workspace_id = coalesce(auth.jwt() -> 'app_metadata' ->> 'workspace_id', 'omrp-default'));

drop policy if exists "rate events authenticated update" on public.rate_ingestion_events;
create policy "rate events authenticated update"
on public.rate_ingestion_events
for update
to authenticated
using (workspace_id = coalesce(auth.jwt() -> 'app_metadata' ->> 'workspace_id', 'omrp-default'))
with check (workspace_id = coalesce(auth.jwt() -> 'app_metadata' ->> 'workspace_id', 'omrp-default'));

-- Audit events: advisors can read workspace audit stream and append events. No client-side updates/deletes.
drop policy if exists "audit authenticated read" on public.deal_audit_events;
create policy "audit authenticated read"
on public.deal_audit_events
for select
to authenticated
using (workspace_id = coalesce(auth.jwt() -> 'app_metadata' ->> 'workspace_id', 'omrp-default'));

drop policy if exists "audit authenticated insert" on public.deal_audit_events;
create policy "audit authenticated insert"
on public.deal_audit_events
for insert
to authenticated
with check (workspace_id = coalesce(auth.jwt() -> 'app_metadata' ->> 'workspace_id', 'omrp-default'));
