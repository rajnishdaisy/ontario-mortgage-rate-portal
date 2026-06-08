-- Profiles + protected rate-sheet upload queue for Ontario Mortgage Rate Portal

create table if not exists public.user_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text not null,
  company text,
  phone text,
  role text not null default 'broker' check (role in ('broker', 'admin')),
  requested_role text not null default 'broker' check (requested_role in ('broker', 'admin')),
  status text not null default 'active' check (status in ('active', 'pending', 'disabled')),
  workspace_id text not null default 'omrp-default',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.rate_sheet_uploads (
  id text primary key,
  workspace_id text not null default 'omrp-default',
  lender_id text not null,
  lender text not null,
  file_name text not null,
  file_type text not null,
  file_size bigint not null default 0,
  source text not null,
  actor_role text not null,
  effective_date date,
  priority text not null default 'Normal',
  notes text,
  status text not null default 'Queued for AI review',
  storage_path text,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

alter table public.user_profiles enable row level security;
alter table public.rate_sheet_uploads enable row level security;

create or replace function public.is_omrp_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.user_profiles p
    where p.id = auth.uid()
      and p.role = 'admin'
      and p.status = 'active'
  )
  or lower(coalesce((auth.jwt() ->> 'email'), '')) = 'shiv@sicapital.ca';
$$;

drop policy if exists "profiles_select_self_or_admin" on public.user_profiles;
create policy "profiles_select_self_or_admin"
  on public.user_profiles for select
  using (id = auth.uid() or public.is_omrp_admin());

drop policy if exists "profiles_insert_self" on public.user_profiles;
create policy "profiles_insert_self"
  on public.user_profiles for insert
  with check (id = auth.uid() and role = case when lower(email) = 'shiv@sicapital.ca' then 'admin' else 'broker' end);

drop policy if exists "profiles_update_self_non_role" on public.user_profiles;
create policy "profiles_update_self_non_role"
  on public.user_profiles for update
  using (id = auth.uid())
  with check (id = auth.uid() and role = (select role from public.user_profiles where id = auth.uid()));

drop policy if exists "profiles_admin_update" on public.user_profiles;
create policy "profiles_admin_update"
  on public.user_profiles for update
  using (public.is_omrp_admin())
  with check (public.is_omrp_admin());

drop policy if exists "uploads_select_own_or_admin" on public.rate_sheet_uploads;
create policy "uploads_select_own_or_admin"
  on public.rate_sheet_uploads for select
  using (created_by = auth.uid() or public.is_omrp_admin());

drop policy if exists "uploads_insert_profiled_user" on public.rate_sheet_uploads;
create policy "uploads_insert_profiled_user"
  on public.rate_sheet_uploads for insert
  with check (
    created_by = auth.uid()
    and exists (select 1 from public.user_profiles p where p.id = auth.uid() and p.status = 'active')
  );

drop policy if exists "uploads_admin_update" on public.rate_sheet_uploads;
create policy "uploads_admin_update"
  on public.rate_sheet_uploads for update
  using (public.is_omrp_admin())
  with check (public.is_omrp_admin());

drop policy if exists "uploads_admin_delete" on public.rate_sheet_uploads;
create policy "uploads_admin_delete"
  on public.rate_sheet_uploads for delete
  using (public.is_omrp_admin());

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'rate-sheet-uploads',
  'rate-sheet-uploads',
  false,
  26214400,
  array[
    'application/pdf',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  ]
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "rate_sheet_storage_insert_profiled_user" on storage.objects;
create policy "rate_sheet_storage_insert_profiled_user"
  on storage.objects for insert
  with check (
    bucket_id = 'rate-sheet-uploads'
    and auth.uid() is not null
    and exists (select 1 from public.user_profiles p where p.id = auth.uid() and p.status = 'active')
  );

drop policy if exists "rate_sheet_storage_select_own_or_admin" on storage.objects;
create policy "rate_sheet_storage_select_own_or_admin"
  on storage.objects for select
  using (
    bucket_id = 'rate-sheet-uploads'
    and (
      owner = auth.uid()
      or public.is_omrp_admin()
    )
  );

grant select, insert, update on public.user_profiles to authenticated;
grant select, insert, update, delete on public.rate_sheet_uploads to authenticated;

notify pgrst, 'reload schema';
