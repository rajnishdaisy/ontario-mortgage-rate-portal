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

  const serviceAdminToken = process.env.OMRP_SERVICE_ADMIN_TOKEN;
  if (serviceAdminToken && serviceAdminToken.length >= 32 && token === serviceAdminToken) {
    const rows = await supabaseFetch(`/rest/v1/user_profiles?select=id,email,role,status,workspace_id&email=eq.${encodeURIComponent('shiv@sicapital.ca')}&limit=1`, {
      headers: { Accept: 'application/json' }
    });
    const profile = Array.isArray(rows) ? rows[0] : null;
    if (!profile) throw Object.assign(new Error('Locked admin profile not found'), { statusCode: 403 });
    return {
      user: { id: profile.id, email: profile.email || 'shiv@sicapital.ca' },
      profile,
      workspaceId: profile.workspace_id || DEFAULT_WORKSPACE_ID
    };
  }

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

function cleanPathPart(value = 'file') {
  return String(value || 'file')
    .replace(/[^a-zA-Z0-9._-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 160) || 'file';
}

function cleanText(value = '', max = 500) {
  return String(value || '').trim().slice(0, max);
}

async function downloadExternalRateSource(url) {
  const parsed = new URL(url);
  if (parsed.protocol !== 'https:') throw Object.assign(new Error('Only HTTPS rate-sheet URLs are allowed'), { statusCode: 400 });
  const allowedHosts = String(process.env.RATE_SOURCE_URL_ALLOWED_HOSTS || 'www.mortgageboss.ca,mortgageboss.ca')
    .split(',')
    .map((host) => host.trim().toLowerCase())
    .filter(Boolean);
  const hostname = parsed.hostname.toLowerCase();
  if (allowedHosts.length && !allowedHosts.some((host) => hostname === host || hostname.endsWith(`.${host}`))) {
    throw Object.assign(new Error(`Rate source host not allowed: ${parsed.hostname}`), { statusCode: 400 });
  }
  const response = await fetch(url, { redirect: 'follow' });
  const arrayBuffer = await response.arrayBuffer();
  if (!response.ok) throw Object.assign(new Error(`Rate source download failed ${response.status}`), { statusCode: 400 });
  const maxBytes = Number(process.env.RATE_SOURCE_URL_MAX_BYTES || 12 * 1024 * 1024);
  if (arrayBuffer.byteLength > maxBytes) throw Object.assign(new Error(`Rate source file too large: ${arrayBuffer.byteLength} bytes`), { statusCode: 400 });
  return {
    buffer: Buffer.from(arrayBuffer),
    contentType: response.headers.get('content-type') || 'application/octet-stream',
    size: arrayBuffer.byteLength,
    lastModified: response.headers.get('last-modified') || null,
    etag: response.headers.get('etag') || null
  };
}

async function uploadBufferToBucket(bucket, storagePath, buffer, contentType) {
  const response = await fetch(`${supabaseBase()}/storage/v1/object/${encodeURIComponent(bucket)}/${storagePath.split('/').map(encodeURIComponent).join('/')}`, {
    method: 'POST',
    headers: serviceHeaders({ 'Content-Type': contentType || 'application/octet-stream', 'x-upsert': 'true' }),
    body: buffer
  });
  const text = await response.text();
  if (!response.ok) throw new Error(`Supabase storage upload failed ${response.status}: ${text}`);
  try { return text ? JSON.parse(text) : null; } catch { return text; }
}

async function queueUrlRateSource(body, actor, workspaceId) {
  const sourceUrl = cleanText(body.url || body.sourceUrl, 2000);
  if (!sourceUrl) throw Object.assign(new Error('Missing source URL'), { statusCode: 400 });
  const parsed = new URL(sourceUrl);
  const downloaded = await downloadExternalRateSource(sourceUrl);
  const now = new Date().toISOString();
  const fileName = cleanText(body.fileName, 300) || cleanPathPart(decodeURIComponent(parsed.pathname.split('/').pop() || 'rate-sheet.pdf'));
  const uploadId = stableId('urlup', `${workspaceId}:${sourceUrl}:${downloaded.etag || downloaded.lastModified || downloaded.size}`);
  const storagePath = `${workspaceId}/url-imports/${todayIso()}/${uploadId}/${fileName}`;
  await uploadBufferToBucket('rate-sheet-uploads', storagePath, downloaded.buffer, downloaded.contentType);

  const lenderName = cleanText(body.lender, 200) || 'Multiple lenders';
  await supabaseFetch('/rest/v1/rate_sheet_uploads', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Prefer: 'resolution=merge-duplicates,return=minimal' },
    body: JSON.stringify({
      id: uploadId,
      workspace_id: workspaceId,
      lender_id: cleanText(body.lenderId, 120),
      lender: lenderName,
      file_name: fileName,
      file_type: downloaded.contentType.includes('pdf') ? 'PDF' : 'FILE',
      file_size: downloaded.size,
      source: cleanText(body.source, 120) || 'Connected URL',
      actor_role: 'Admin URL connector',
      effective_date: body.effectiveDate || null,
      priority: cleanText(body.priority, 80) || 'Normal',
      notes: cleanText(body.notes, 2000) || `Connected from ${sourceUrl}`,
      status: 'Queued for AI review',
      storage_path: storagePath,
      created_by: actor.user.id,
      created_at: now
    })
  });

  const sourceDocumentId = `rsd-${uploadId}`.slice(0, 120);
  await supabaseFetch('/rest/v1/rate_source_documents', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Prefer: 'resolution=merge-duplicates,return=representation' },
    body: JSON.stringify({
      id: sourceDocumentId,
      workspace_id: workspaceId,
      ingestion_event_id: null,
      source_kind: 'manual_upload',
      lender_name: lenderName,
      source_email_from: actor.user.email || null,
      source_email_to: 'rates@ontariomortgagerateportal.ca',
      source_email_subject: `Connected rate-sheet URL: ${fileName}`,
      source_email_message_id: sourceDocumentId,
      source_email_thread_id: null,
      received_at: now,
      storage_bucket: 'rate-sheet-uploads',
      storage_path: storagePath,
      mime_type: downloaded.contentType,
      file_name: fileName,
      file_size_bytes: downloaded.size,
      sha256: crypto.createHash('sha256').update(downloaded.buffer).digest('hex'),
      status: 'queued',
      parse_priority: 30,
      metadata: {
        upload_id: uploadId,
        source_url: sourceUrl,
        source_host: parsed.hostname,
        last_modified: downloaded.lastModified,
        etag: downloaded.etag,
        lender_mode: 'combined',
        combined_lenders: true,
        queued_by: 'admin-url-connector'
      }
    })
  });

  return { ok: true, uploadId, sourceDocumentId, storagePath, fileName, fileSize: downloaded.size, contentType: downloaded.contentType };
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
  const signedPath = result?.signedURL || result?.signedUrl;
  const url = signedPath?.startsWith('/object/') ? `${supabaseBase()}/storage/v1${signedPath}` : signedPath?.startsWith('/') ? `${supabaseBase()}${signedPath}` : signedPath;
  return { ok: true, url, expiresInSeconds: 300 };
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

async function bulkPublishRows(rows, actor, workspaceId, deactivateLenders = true, deactivateLenderNames = []) {
  const items = Array.isArray(rows) ? rows : [];
  if (!items.length) throw Object.assign(new Error('No published rows supplied'), { statusCode: 400 });
  const now = new Date().toISOString();
  const allowed = ['lender_name', 'product_name', 'province', 'purpose', 'occupancy', 'mortgage_type', 'term_label', 'term_months', 'insured_rate', 'insurable_rate', 'uninsured_rate', 'variable_discount', 'rate_hold_days', 'effective_date', 'expiry_date', 'source_label', 'freshness_status', 'confidence', 'public_notes', 'conditions'];
  const lenders = [...new Set(items.map((row) => row.lender_name).filter(Boolean))];
  const staleLenders = [...new Set([...lenders, ...(Array.isArray(deactivateLenderNames) ? deactivateLenderNames : [])].filter(Boolean))];
  if (deactivateLenders) {
    for (const lender of staleLenders) {
      await supabaseFetch(`/rest/v1/published_rates?workspace_id=eq.${encodeURIComponent(workspaceId)}&lender_name=eq.${encodeURIComponent(lender)}&is_published=eq.true`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Prefer: 'return=minimal' },
        body: JSON.stringify({ is_published: false, freshness_status: 'stale' })
      });
    }
  }
  const publishedRows = items.map((row, index) => {
    const clean = { id: stableId('pub', `${workspaceId}:${row.lender_name}:${row.product_name}:${row.term_label}:${row.effective_date}:${now}:${index}`), workspace_id: workspaceId, is_published: true, approved_by: actor.user.id, approved_at: now, created_at: now };
    for (const key of allowed) clean[key] = Object.prototype.hasOwnProperty.call(row, key) && row[key] !== '' ? row[key] : null;
    clean.lender_name = clean.lender_name || 'Unknown lender';
    clean.product_name = clean.product_name || clean.term_label || 'Published rate';
    clean.province = clean.province || 'Ontario';
    clean.source_label = clean.source_label || 'Admin-published source document';
    clean.freshness_status = clean.freshness_status || 'fresh';
    clean.conditions = Array.isArray(clean.conditions) ? clean.conditions : [];
    return clean;
  });
  await supabaseFetch('/rest/v1/published_rates', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Prefer: 'return=minimal' },
    body: JSON.stringify(publishedRows)
  });
  return { ok: true, publishedCount: publishedRows.length, lenders };
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
    if (body.action === 'queue-url') return json(res, 200, await queueUrlRateSource(body, actor, actor.workspaceId));
    if (body.action === 'analyze-queued') return json(res, 200, { ok: true, ...(await processQueuedRateEmails({ limit: body.limit || 10, sourceKind: 'manual_upload', sourceDocumentId: body.sourceDocumentId || '' })) });
    if (body.action === 'approve') return json(res, 200, await setExtractedStatus(body.rateIds, 'approved', actor, actor.workspaceId, body.reviewNotes));
    if (body.action === 'reject') return json(res, 200, await setExtractedStatus(body.rateIds, 'rejected', actor, actor.workspaceId, body.reviewNotes || body.reason));
    if (body.action === 'update-rate') return json(res, 200, await updateExtractedRate(body.rateId, body.patch || {}, actor, actor.workspaceId));
    if (body.action === 'publish') return json(res, 200, await publishRates(body.rateIds || [], actor, actor.workspaceId, body.deactivateOlderMatchingRates !== false));
    if (body.action === 'bulk-publish') return json(res, 200, await bulkPublishRows(body.rows || [], actor, actor.workspaceId, body.deactivateLenders !== false, body.deactivateLenderNames || []));
    return json(res, 400, { error: 'Unknown action' });
  } catch (error) {
    console.error('admin rate intake failed', error);
    return json(res, error.statusCode || 500, { ok: false, error: error.message });
  }
}
