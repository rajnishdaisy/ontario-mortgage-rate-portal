-- OMRP security hardening: admin auth source of truth, queue claiming, and transactional publish helpers.

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
  );
$$;

alter table public.rate_source_documents
  add column if not exists locked_at timestamptz,
  add column if not exists locked_by text,
  add column if not exists retry_count integer not null default 0,
  add column if not exists next_retry_at timestamptz;

create index if not exists rate_source_documents_claim_idx
  on public.rate_source_documents (workspace_id, source_kind, status, next_retry_at, received_at);

drop policy if exists "rate_sheet_storage_insert_profiled_user" on storage.objects;
create policy "rate_sheet_storage_insert_profiled_user"
  on storage.objects for insert
  with check (
    bucket_id = 'rate-sheet-uploads'
    and auth.uid() is not null
    and split_part(name, '/', 1) = coalesce((select p.workspace_id from public.user_profiles p where p.id = auth.uid() and p.status = 'active'), '')
    and split_part(name, '/', 2) = auth.uid()::text
  );

drop policy if exists "rate_sheet_storage_select_own_or_admin" on storage.objects;
create policy "rate_sheet_storage_select_own_or_admin"
  on storage.objects for select
  using (
    bucket_id = 'rate-sheet-uploads'
    and (
      split_part(name, '/', 2) = auth.uid()::text
      or public.is_omrp_admin()
    )
  );

create or replace function public.claim_next_rate_source_documents(
  p_workspace_id text default 'omrp-default',
  p_source_kind text default 'manual_upload',
  p_limit integer default 10
)
returns setof public.rate_source_documents
language plpgsql
security definer
set search_path = public
as $$
begin
  return query
  with candidates as (
    select id
    from public.rate_source_documents
    where workspace_id = p_workspace_id
      and (
        p_source_kind = 'all'
        or source_kind = p_source_kind
      )
      and status in ('queued', 'failed')
      and (next_retry_at is null or next_retry_at <= now())
    order by received_at asc nulls last, id asc
    limit greatest(1, least(coalesce(p_limit, 10), 25))
    for update skip locked
  )
  update public.rate_source_documents d
  set status = 'extracting',
      locked_at = now(),
      locked_by = coalesce(current_setting('request.jwt.claim.sub', true), 'service-role'),
      retry_count = coalesce(d.retry_count, 0) + 1,
      metadata = coalesce(d.metadata, '{}'::jsonb) || jsonb_build_object('claimed_at', now())
  from candidates c
  where d.id = c.id
  returning d.*;
end;
$$;

create or replace function public.publish_extracted_rate_products(
  p_workspace_id text,
  p_rate_ids text[],
  p_approved_by uuid,
  p_deactivate_older boolean default true
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_now timestamptz := now();
  v_count integer;
begin
  if p_rate_ids is null or array_length(p_rate_ids, 1) is null then
    raise exception 'No extracted rate IDs supplied';
  end if;

  create temp table tmp_publish_rows on commit drop as
  select *
  from public.extracted_rate_products
  where workspace_id = p_workspace_id
    and id = any(p_rate_ids)
    and status <> 'rejected'
    and (
      insured_rate is not null
      or insurable_rate is not null
      or uninsured_rate is not null
      or variable_discount is not null
    );

  select count(*) into v_count from tmp_publish_rows;
  if v_count = 0 then
    raise exception 'No publishable selected rows';
  end if;

  if p_deactivate_older then
    update public.published_rates pr
    set is_published = false,
        freshness_status = 'stale'
    where pr.workspace_id = p_workspace_id
      and pr.is_published = true
      and exists (
        select 1
        from tmp_publish_rows r
        where r.lender_name = pr.lender_name
          and coalesce(r.term_label, 'Rate product') = coalesce(pr.term_label, 'Rate product')
      );
  end if;

  insert into public.published_rates (
    id, workspace_id, extracted_rate_product_id, source_document_id,
    lender_name, product_name, province, purpose, occupancy, mortgage_type,
    term_label, term_months, insured_rate, insurable_rate, uninsured_rate,
    variable_discount, rate_hold_days, effective_date, expiry_date,
    source_label, freshness_status, confidence, public_notes, conditions,
    is_published, approved_by, approved_at, created_at
  )
  select
    'pub_' || substr(md5(r.id || ':' || v_now::text), 1, 24),
    p_workspace_id,
    r.id,
    r.source_document_id,
    coalesce(nullif(r.lender_name, ''), 'Unknown lender'),
    coalesce(nullif(r.product_name, ''), nullif(r.term_label, ''), 'Lender rate product'),
    coalesce(nullif(r.province, ''), 'Ontario'),
    r.purpose,
    r.occupancy,
    r.mortgage_type,
    coalesce(nullif(r.term_label, ''), 'Rate product'),
    r.term_months,
    r.insured_rate,
    r.insurable_rate,
    r.uninsured_rate,
    r.variable_discount,
    r.rate_hold_days,
    coalesce(r.effective_date, current_date),
    r.expiry_date,
    'Admin-approved intake',
    'fresh',
    r.confidence,
    r.review_notes,
    coalesce(r.conditions, '[]'::jsonb),
    true,
    p_approved_by,
    v_now,
    v_now
  from tmp_publish_rows r;

  update public.extracted_rate_products
  set status = 'published',
      reviewer_id = p_approved_by,
      reviewed_at = v_now,
      review_notes = coalesce(review_notes, 'Published by admin from intake.')
  where workspace_id = p_workspace_id
    and id in (select id from tmp_publish_rows);

  return jsonb_build_object('ok', true, 'publishedCount', v_count);
end;
$$;

notify pgrst, 'reload schema';
