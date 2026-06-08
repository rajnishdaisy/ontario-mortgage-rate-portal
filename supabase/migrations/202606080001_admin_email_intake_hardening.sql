-- Admin-only email intake hardening for OMRP
-- Keeps Shiv locked as admin, lets new users create broker profiles, and restricts
-- inbound email/AI/attachment metadata to admins while public rates remain readable.

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

-- If the locked admin auth user already exists, force the profile to admin.
insert into public.user_profiles (id, email, full_name, role, requested_role, status, workspace_id)
select u.id, lower(u.email), coalesce(u.raw_user_meta_data ->> 'full_name', 'Shiv'), 'admin', 'admin', 'active', 'omrp-default'
from auth.users u
where lower(u.email) = 'shiv@sicapital.ca'
on conflict (id) do update set
  email = excluded.email,
  role = 'admin',
  requested_role = 'admin',
  status = 'active',
  workspace_id = 'omrp-default',
  updated_at = now();

-- Profile creation: new users can create only their own non-admin profile, except locked admin email.
drop policy if exists "profiles_insert_self" on public.user_profiles;
create policy "profiles_insert_self"
  on public.user_profiles for insert
  to authenticated
  with check (
    id = auth.uid()
    and lower(email) = lower(coalesce(auth.jwt() ->> 'email', email))
    and role = case when lower(email) = 'shiv@sicapital.ca' then 'admin' else 'broker' end
  );

drop policy if exists "profiles_update_self_non_role" on public.user_profiles;
create policy "profiles_update_self_non_role"
  on public.user_profiles for update
  to authenticated
  using (id = auth.uid())
  with check (
    id = auth.uid()
    and lower(email) = lower(coalesce(auth.jwt() ->> 'email', email))
    and role = case when lower(email) = 'shiv@sicapital.ca' then 'admin' else 'broker' end
    and status = 'active'
  );

-- Replace broad authenticated rate-intelligence policies with admin-only policies.
do $$
declare
  table_name text;
  policy_name text;
begin
  foreach table_name in array array[
    'lender_email_sources',
    'rate_source_documents',
    'rate_extraction_runs',
    'extracted_rate_products',
    'lender_policy_notes',
    'lender_contacts'
  ] loop
    for policy_name in
      select pol.polname
      from pg_policy pol
      join pg_class cls on cls.oid = pol.polrelid
      join pg_namespace nsp on nsp.oid = cls.relnamespace
      where nsp.nspname = 'public' and cls.relname = table_name
    loop
      execute format('drop policy if exists %I on public.%I', policy_name, table_name);
    end loop;
  end loop;
end $$;

create policy "rate documents admin read" on public.rate_source_documents
for select to authenticated using (public.is_omrp_admin());
create policy "rate documents admin write" on public.rate_source_documents
for all to authenticated using (public.is_omrp_admin()) with check (public.is_omrp_admin());

create policy "rate extraction runs admin read" on public.rate_extraction_runs
for select to authenticated using (public.is_omrp_admin());
create policy "rate extraction runs admin write" on public.rate_extraction_runs
for all to authenticated using (public.is_omrp_admin()) with check (public.is_omrp_admin());

create policy "extracted rates admin read" on public.extracted_rate_products
for select to authenticated using (public.is_omrp_admin());
create policy "extracted rates admin write" on public.extracted_rate_products
for all to authenticated using (public.is_omrp_admin()) with check (public.is_omrp_admin());

create policy "email sources admin read" on public.lender_email_sources
for select to authenticated using (public.is_omrp_admin());
create policy "email sources admin write" on public.lender_email_sources
for all to authenticated using (public.is_omrp_admin()) with check (public.is_omrp_admin());

create policy "policy notes public read" on public.lender_policy_notes
for select to anon using (status = 'published' and workspace_id = 'omrp-default');
create policy "policy notes admin write" on public.lender_policy_notes
for all to authenticated using (public.is_omrp_admin()) with check (public.is_omrp_admin());

create policy "lender contacts public read" on public.lender_contacts
for select to anon using (status = 'published' and workspace_id = 'omrp-default');
create policy "lender contacts admin write" on public.lender_contacts
for all to authenticated using (public.is_omrp_admin()) with check (public.is_omrp_admin());

-- Preserve public frontend rate reads, restrict writes to admins.
drop policy if exists "published rates authenticated insert" on public.published_rates;
drop policy if exists "published rates authenticated update" on public.published_rates;
create policy "published rates admin insert" on public.published_rates
for insert to authenticated with check (public.is_omrp_admin());
create policy "published rates admin update" on public.published_rates
for update to authenticated using (public.is_omrp_admin()) with check (public.is_omrp_admin());

-- Storage: remove broad authenticated access to private email/attachment buckets.
drop policy if exists "rate intelligence storage read" on storage.objects;
drop policy if exists "rate intelligence storage insert" on storage.objects;
create policy "rate intelligence storage admin read" on storage.objects
for select to authenticated
using (bucket_id in ('lender-rate-emails', 'lender-rate-attachments', 'parsed-rate-artifacts') and public.is_omrp_admin());
create policy "rate intelligence storage admin insert" on storage.objects
for insert to authenticated
with check (bucket_id in ('lender-rate-emails', 'lender-rate-attachments', 'parsed-rate-artifacts') and public.is_omrp_admin());

notify pgrst, 'reload schema';
