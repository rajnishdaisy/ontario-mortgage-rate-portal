import crypto from 'node:crypto';
import { processQueuedRateEmails } from './resend-inbound.js';

const DEFAULT_WORKSPACE_ID = 'omrp-default';

function json(res, status, body) {
  res.setHeader('Content-Type', 'application/json');
  return res.status(status).json(body);
}

function requireEnv(name) {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required env var: ${name}`);
  return value;
}

function supabaseBase() {
  const value = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!value) throw new Error('Missing required env var: SUPABASE_URL or NEXT_PUBLIC_SUPABASE_URL');
  return value.replace(/\/$/, '');
}

function serviceKey() {
  return requireEnv('SUPABASE_SERVICE_ROLE_KEY');
}

function serviceHeaders(extra = {}) {
  const key = serviceKey();
  return { apikey: key, Authorization: `Bearer ${key}`, ...extra };
}

async function supabaseFetch(path, options = {}) {
  const response = await fetch(`${supabaseBase()}${path}`, {
    ...options,
    headers: serviceHeaders(options.headers || {})
  });
  const text = await response.text();
  if (!response.ok) throw new Error(`Supabase ${path} failed ${response.status}: ${text}`);
  try { return text ? JSON.parse(text) : null; } catch { return text; }
}

function getBearer(req) {
  const auth = req.headers.authorization || req.headers.Authorization || '';
  return String(auth).startsWith('Bearer ') ? String(auth).slice(7) : '';
}

async function requireAdmin(req) {
  const token = getBearer(req);
  if (!token) throw Object.assign(new Error('Missing bearer token'), { statusCode: 401 });

  const userResponse = await fetch(`${supabaseBase()}/auth/v1/user`, {
    headers: { apikey: serviceKey(), Authorization: `Bearer ${token}` }
  });
  const userText = await userResponse.text();
  if (!userResponse.ok) throw Object.assign(new Error(`Invalid session: ${userText}`), { statusCode: 401 });
  const user = JSON.parse(userText);
  const email = String(user.email || '').toLowerCase();
  const isLockedAdmin = email === 'shiv@sicapital.ca';

  let profile = null;
  try {
    const rows = await supabaseFetch(`/rest/v1/user_profiles?select=id,email,role,status,workspace_id&id=eq.${encodeURIComponent(user.id)}&limit=1`, {
      headers: { Accept: 'application/json' }
    });
    profile = Array.isArray(rows) ? rows[0] : null;
  } catch (error) {
    if (!isLockedAdmin) throw error;
  }
  if (!isLockedAdmin && !(profile?.role === 'admin' && profile?.status === 'active')) {
    throw Object.assign(new Error('Admin access required'), { statusCode: 403 });
  }
  return { user, profile, workspaceId: profile?.workspace_id || DEFAULT_WORKSPACE_ID };
}

function stableId(prefix, seed = '') {
  return `${prefix}_${crypto.createHash('sha256').update(String(seed || `${Date.now()}:${Math.random()}`)).digest('hex').slice(0, 24)}`;
}

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

function ratePresent(row) {
  return [row.insured_rate, row.insurable_rate, row.uninsured_rate].some((value) => value !== null && value !== undefined && value !== '') || Boolean(row.variable_discount);
}

async function listInbox(workspaceId) {
  const documents = await supabaseFetch(`/rest/v1/rate_source_documents?select=*&workspace_id=eq.${encodeURIComponent(workspaceId)}&source_kind=eq.manual_upload&order=received_at.desc&limit=80`, {
    headers: { Accept: 'application/json' }
  });
  const sourceIds = (documents || []).map((row) => row.id);
  const runs = sourceIds.length
    ? await supabaseFetch(`/rest/v1/rate_extraction_runs?select=*&workspace_id=eq.${encodeURIComponent(workspaceId)}&source_document_id=in.(${sourceIds.map(encodeURIComponent).join(',')})&order=created_at.desc`, { headers: { Accept: 'application/json' } })
    : [];
  const extracted = sourceIds.length
    ? await supabaseFetch(`/rest/v1/extracted_rate_products?select=*&workspace_id=eq.${encodeURIComponent(workspaceId)}&source_document_id=in.(${sourceIds.map(encodeURIComponent).join(',')})&order=created_at.desc&limit=250`, { headers: { Accept: 'application/json' } })
    : [];

  return { ok: true, documents: documents || [], runs: runs || [], attachments: [], extractedRates: extracted || [] };
}

async function signedUrl(attachmentId, workspaceId) {
  const rows = await supabaseFetch(`/rest/v1/rate_source_documents?select=id,workspace_id,storage_bucket,storage_path,source_kind&workspace_id=eq.${encodeURIComponent(workspaceId)}&id=eq.${encodeURIComponent(attachmentId)}&limit=1`, {
    headers: { Accept: 'application/json' }
  });
  const attachment = Array.isArray(rows) ? rows[0] : null;
  if (!attachment || !['attachment', 'manual_upload'].includes(attachment.source_kind)) throw Object.assign(new Error('File not found'), { statusCode: 404 });
  const result = await supabaseFetch(`/storage/v1/object/sign/${encodeURIComponent(attachment.storage_bucket)}/${attachment.storage_path.split('/').map(encodeURIComponent).join('/')}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ expiresIn: 300 })
  });
  return { ok: true, url: result?.signedURL ? `${supabaseBase()}${result.signedURL}` : result?.signedUrl, expiresInSeconds: 300 };
}

async function updateExtractedRate(rateId, body, actor, workspaceId) {
  const allowed = ['lender_name', 'product_name', 'province', 'purpose', 'occupancy', 'mortgage_type', 'term_label', 'term_months', 'amortization_years', 'insured_rate', 'insurable_rate', 'uninsured_rate', 'variable_discount', 'rate_hold_days', 'effective_date', 'expiry_date', 'conditions', 'review_notes'];
  const patch = {};
  for (const key of allowed) if (Object.prototype.hasOwnProperty.call(body, key)) patch[key] = body[key] === '' ? null : body[key];
  patch.reviewer_id = actor.user.id;
  patch.reviewed_at = new Date().toISOString();
  const rows = await supabaseFetch(`/rest/v1/extracted_rate_products?id=eq.${encodeURIComponent(rateId)}&workspace_id=eq.${encodeURIComponent(workspaceId)}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', Prefer: 'return=representation' },
    body: JSON.stringify(patch)
  });
  return { ok: true, rate: Array.isArray(rows) ? rows[0] : rows };
}

async function setExtractedStatus(rateIds, status, actor, workspaceId, reviewNotes = '') {
  const ids = Array.isArray(rateIds) ? rateIds : [rateIds].filter(Boolean);
  if (!ids.length) throw Object.assign(new Error('No rate IDs supplied'), { statusCode: 400 });
  const rows = await supabaseFetch(`/rest/v1/extracted_rate_products?id=in.(${ids.map(encodeURIComponent).join(',')})&workspace_id=eq.${encodeURIComponent(workspaceId)}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', Prefer: 'return=representation' },
    body: JSON.stringify({ status, reviewer_id: actor.user.id, reviewed_at: new Date().toISOString(), review_notes: reviewNotes || null })
  });
  return { ok: true, updated: Array.isArray(rows) ? rows.length : 0, rows };
}

async function publishRates(rateIds, actor, workspaceId, deactivateOlderMatchingRates = true) {
  const ids = Array.isArray(rateIds) ? rateIds : [];
  if (!ids.length) throw Object.assign(new Error('No extracted rate IDs supplied'), { statusCode: 400 });
  const rows = await supabaseFetch(`/rest/v1/extracted_rate_products?select=*&workspace_id=eq.${encodeURIComponent(workspaceId)}&id=in.(${ids.map(encodeURIComponent).join(',')})`, {
    headers: { Accept: 'application/json' }
  });
  const publishable = (rows || []).filter((row) => row.status !== 'rejected' && ratePresent(row));
  if (!publishable.length) throw Object.assign(new Error('No publishable selected rows'), { statusCode: 400 });

  if (deactivateOlderMatchingRates) {
    for (const row of publishable) {
      await supabaseFetch(`/rest/v1/published_rates?workspace_id=eq.${encodeURIComponent(workspaceId)}&lender_name=eq.${encodeURIComponent(row.lender_name)}&term_label=eq.${encodeURIComponent(row.term_label || 'Rate product')}&is_published=eq.true`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Prefer: 'return=minimal' },
        body: JSON.stringify({ is_published: false, freshness_status: 'stale' })
      });
    }
  }

  const now = new Date().toISOString();
  const publishedRows = publishable.map((row) => ({
    id: stableId('pub', `${row.id}:${now}`),
    workspace_id: workspaceId,
    extracted_rate_product_id: row.id,
    source_document_id: row.source_document_id,
    lender_name: row.lender_name,
    product_name: row.product_name || row.term_label || 'Lender rate product',
    province: row.province || 'Ontario',
    purpose: row.purpose,
    occupancy: row.occupancy,
    mortgage_type: row.mortgage_type,
    term_label: row.term_label || 'Rate product',
    term_months: row.term_months,
    insured_rate: row.insured_rate,
    insurable_rate: row.insurable_rate,
    uninsured_rate: row.uninsured_rate,
    variable_discount: row.variable_discount,
    rate_hold_days: row.rate_hold_days,
    effective_date: row.effective_date || todayIso(),
    expiry_date: row.expiry_date,
    source_label: 'Admin-approved email intake',
    freshness_status: 'fresh',
    confidence: row.confidence,
    public_notes: row.review_notes,
    conditions: row.conditions || [],
    is_published: true,
    approved_by: actor.user.id,
    approved_at: now
  }));

  await supabaseFetch('/rest/v1/published_rates', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Prefer: 'return=minimal' },
    body: JSON.stringify(publishedRows)
  });
  await setExtractedStatus(publishable.map((row) => row.id), 'published', actor, workspaceId, 'Published by admin from email intake.');
  return { ok: true, publishedCount: publishedRows.length };
}

export default async function handler(req, res) {
  try {
    const actor = await requireAdmin(req);
    if (req.method === 'GET') return json(res, 200, await listInbox(actor.workspaceId));
    if (req.method !== 'POST') return json(res, 405, { error: 'Method not allowed' });
    const body = req.body || {};
    if (body.action === 'signed-url') return json(res, 200, await signedUrl(body.attachmentId, actor.workspaceId));
    if (body.action === 'analyze-queued') return json(res, 200, { ok: true, ...(await processQueuedRateEmails({ limit: body.limit || 10, sourceKind: 'manual_upload' })) });
    if (body.action === 'approve') return json(res, 200, await setExtractedStatus(body.rateIds, 'approved', actor, actor.workspaceId, body.reviewNotes));
    if (body.action === 'reject') return json(res, 200, await setExtractedStatus(body.rateIds, 'rejected', actor, actor.workspaceId, body.reviewNotes || body.reason));
    if (body.action === 'update-rate') return json(res, 200, await updateExtractedRate(body.rateId, body.patch || {}, actor, actor.workspaceId));
    if (body.action === 'publish') return json(res, 200, await publishRates(body.rateIds || [], actor, actor.workspaceId, body.deactivateOlderMatchingRates !== false));
    return json(res, 400, { error: 'Unknown action' });
  } catch (error) {
    console.error('admin rate intake failed', error);
    return json(res, error.statusCode || 500, { ok: false, error: error.message });
  }
}
