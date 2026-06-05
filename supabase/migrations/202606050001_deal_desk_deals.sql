-- Ontario Mortgage Rate Portal Deal Desk Supabase schema
-- Run this in Supabase SQL Editor or with `supabase db push`.

create table if not exists public.deal_desk_deals (
  id text primary key,
  client_name text not null,
  purpose text not null default 'Purchase',
  province text not null default 'Ontario',
  closing_date date,
  property_value numeric(14,2) not null check (property_value >= 0),
  mortgage_amount numeric(14,2) not null check (mortgage_amount >= 0),
  credit_band text not null,
  income_type text not null,
  preferred_term text not null,
  occupancy text not null,
  notes text,
  status text not null default 'intake' check (status in ('intake', 'review', 'submit', 'approved')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists deal_desk_deals_status_idx on public.deal_desk_deals (status);
create index if not exists deal_desk_deals_created_at_idx on public.deal_desk_deals (created_at desc);

create or replace function public.set_deal_desk_deals_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_deal_desk_deals_updated_at on public.deal_desk_deals;
create trigger set_deal_desk_deals_updated_at
before update on public.deal_desk_deals
for each row
execute function public.set_deal_desk_deals_updated_at();

alter table public.deal_desk_deals enable row level security;

-- MVP/demo policy: no auth yet, so anon can sync deal cards.
-- Do not store real borrower PII until auth/workspace policies are added.
drop policy if exists "deal desk anon read" on public.deal_desk_deals;
create policy "deal desk anon read"
on public.deal_desk_deals
for select
to anon
using (true);

drop policy if exists "deal desk anon insert" on public.deal_desk_deals;
create policy "deal desk anon insert"
on public.deal_desk_deals
for insert
to anon
with check (true);

drop policy if exists "deal desk anon update" on public.deal_desk_deals;
create policy "deal desk anon update"
on public.deal_desk_deals
for update
to anon
using (true)
with check (true);

drop policy if exists "deal desk anon delete" on public.deal_desk_deals;
create policy "deal desk anon delete"
on public.deal_desk_deals
for delete
to anon
using (true);
