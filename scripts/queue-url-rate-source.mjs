import crypto from 'node:crypto';

const DEFAULT_WORKSPACE_ID = 'omrp-default';
const ATTACHMENT_BUCKET = 'rate-sheet-uploads';

function requireEnv(name) {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required env var: ${name}`);
  return value;
}

function supabaseBase() {
  return (process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '').replace(/\/$/, '');
}

function serviceHeaders(extra = {}) {
  const key = requireEnv('SUPABASE_SERVICE_ROLE_KEY');
  return { apikey: key, Authorization: `Bearer ${key}`, ...extra };
}

async function supabaseFetch(path, options = {}) {
  const response = await fetch(`${supabaseBase()}${path}`, { ...options, headers: serviceHeaders(options.headers || {}) });
  const text = await response.text();
  if (!response.ok) throw new Error(`Supabase ${path} failed ${response.status}: ${text}`);
  try { return text ? JSON.parse(text) : null; } catch { return text; }
}

function stableId(prefix, seed = '') {
  return `${prefix}_${crypto.createHash('sha256').update(String(seed || `${Date.now()}:${Math.random()}`)).digest('hex').slice(0, 24)}`;
}

function cleanPathPart(value = 'file') {
  return String(value || 'file').replace(/[^a-zA-Z0-9._-]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 160) || 'file';
}

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

async function uploadBufferToBucket(bucket, storagePath, buffer, contentType) {
  const response = await fetch(`${supabaseBase()}/storage/v1/object/${encodeURIComponent(bucket)}/${storagePath.split('/').map(encodeURIComponent).join('/')}`, {
    method: 'POST',
    headers: serviceHeaders({ 'Content-Type': contentType || 'application/octet-stream', 'x-upsert': 'true' }),
    body: buffer
  });
  const text = await response.text();
  if (!response.ok) throw new Error(`Supabase storage upload failed ${response.status}: ${text}`);
}

async function main() {
  const sourceUrl = process.argv[2];
  if (!sourceUrl) throw new Error('Usage: node scripts/queue-url-rate-source.mjs <url> [lender]');
  const lenderName = process.argv[3] || 'Multiple lenders';
  const workspaceId = process.env.RATE_AI_WORKSPACE_ID || DEFAULT_WORKSPACE_ID;
  const parsed = new URL(sourceUrl);
  if (parsed.protocol !== 'https:') throw new Error('Only HTTPS URLs are allowed');
  const response = await fetch(sourceUrl, { redirect: 'follow' });
  const arrayBuffer = await response.arrayBuffer();
  if (!response.ok) throw new Error(`Download failed ${response.status}`);
  const buffer = Buffer.from(arrayBuffer);
  const contentType = response.headers.get('content-type') || 'application/octet-stream';
  const lastModified = response.headers.get('last-modified');
  const etag = response.headers.get('etag');
  const fileName = cleanPathPart(decodeURIComponent(parsed.pathname.split('/').pop() || 'rate-sheet.pdf'));
  const uploadId = stableId('urlup', `${workspaceId}:${sourceUrl}:${etag || lastModified || buffer.length}`);
  const sourceDocumentId = `rsd-${uploadId}`.slice(0, 120);
  const storagePath = `${workspaceId}/url-imports/${todayIso()}/${uploadId}/${fileName}`;
  const now = new Date().toISOString();

  await uploadBufferToBucket(ATTACHMENT_BUCKET, storagePath, buffer, contentType);
  await supabaseFetch('/rest/v1/rate_sheet_uploads', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Prefer: 'resolution=merge-duplicates,return=minimal' },
    body: JSON.stringify({
      id: uploadId,
      workspace_id: workspaceId,
      lender_id: '',
      lender: lenderName,
      file_name: fileName,
      file_type: contentType.includes('pdf') ? 'PDF' : 'FILE',
      file_size: buffer.length,
      source: 'Connected URL',
      actor_role: 'Admin URL connector',
      priority: 'Normal',
      notes: `Connected from ${sourceUrl}`,
      status: 'Queued for AI review',
      storage_path: storagePath,
      created_by: 'shiv@sicapital.ca',
      created_at: now
    })
  });
  await supabaseFetch('/rest/v1/rate_source_documents', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Prefer: 'resolution=merge-duplicates,return=representation' },
    body: JSON.stringify({
      id: sourceDocumentId,
      workspace_id: workspaceId,
      ingestion_event_id: null,
      source_kind: 'manual_upload',
      lender_name: lenderName,
      source_email_from: 'shiv@sicapital.ca',
      source_email_to: 'rates@ontariomortgagerateportal.ca',
      source_email_subject: `Connected rate-sheet URL: ${fileName}`,
      source_email_message_id: sourceDocumentId,
      source_email_thread_id: null,
      received_at: now,
      storage_bucket: ATTACHMENT_BUCKET,
      storage_path: storagePath,
      mime_type: contentType,
      file_name: fileName,
      file_size_bytes: buffer.length,
      sha256: crypto.createHash('sha256').update(buffer).digest('hex'),
      status: 'queued',
      parse_priority: 30,
      metadata: { upload_id: uploadId, source_url: sourceUrl, source_host: parsed.hostname, last_modified: lastModified, etag, lender_mode: 'combined', combined_lenders: true, queued_by: 'url-rate-source-script' }
    })
  });
  console.log(JSON.stringify({ ok: true, uploadId, sourceDocumentId, storagePath, fileName, fileSize: buffer.length, contentType }, null, 2));
}

main().catch((error) => { console.error(error.message); process.exit(1); });
