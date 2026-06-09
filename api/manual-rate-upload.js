import crypto from 'node:crypto';

const DEFAULT_WORKSPACE_ID = 'omrp-default';
const UPLOAD_BUCKET = 'rate-sheet-uploads';

function json(res, status, body) {
  res.setHeader('Content-Type', 'application/json');
  return res.status(status).json(body);
}

function supabaseBase() {
  const value = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!value) throw new Error('Missing required env var: SUPABASE_URL or NEXT_PUBLIC_SUPABASE_URL');
  return value.replace(/\/$/, '');
}

function serviceKey() {
  const value = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!value) throw new Error('Missing required env var: SUPABASE_SERVICE_ROLE_KEY');
  return value;
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
  let payload = null;
  try { payload = text ? JSON.parse(text) : null; } catch { payload = text; }
  if (!response.ok) throw new Error(`Supabase request failed ${response.status}`);
  return payload;
}

function getBearer(req) {
  const auth = req.headers.authorization || req.headers.Authorization || '';
  return String(auth).startsWith('Bearer ') ? String(auth).slice(7) : '';
}

function stableId(prefix, seed = '') {
  return `${prefix}_${crypto.createHash('sha256').update(String(seed || `${Date.now()}:${Math.random()}`)).digest('hex').slice(0, 24)}`;
}

function cleanText(value = '', max = 500) {
  return String(value || '').trim().slice(0, max);
}

function safeStatus(value = '') {
  return cleanText(value, 80) || 'Queued for AI review';
}

function validateStoragePath(storagePath, actor) {
  if (!storagePath || storagePath.includes('..') || storagePath.startsWith('/')) {
    throw Object.assign(new Error('Invalid uploaded storage path.'), { statusCode: 400 });
  }
  const allowedPrefixes = [
    `${actor.workspaceId}/${actor.user.id}/`,
    `${actor.workspaceId}/manual-uploads/${actor.user.id}/`
  ];
  if (!allowedPrefixes.some((prefix) => storagePath.startsWith(prefix))) {
    throw Object.assign(new Error('Uploaded file path is outside this user/workspace.'), { statusCode: 403 });
  }
}

async function getStorageObjectMetadata(storagePath) {
  const objectPath = `/storage/v1/object/${encodeURIComponent(UPLOAD_BUCKET)}/${storagePath.split('/').map(encodeURIComponent).join('/')}`;
  const response = await fetch(`${supabaseBase()}${objectPath}`, {
    method: 'HEAD',
    headers: serviceHeaders()
  });
  if (!response.ok) throw Object.assign(new Error('Uploaded file was not found in private storage.'), { statusCode: 400 });
  return {
    size: Number(response.headers.get('content-length') || 0) || null,
    mimeType: response.headers.get('content-type') || 'application/octet-stream',
    etag: response.headers.get('etag') || null,
    lastModified: response.headers.get('last-modified') || null
  };
}

async function requireProfiledUser(req) {
  const token = getBearer(req);
  if (!token) throw Object.assign(new Error('Missing bearer token'), { statusCode: 401 });
  const userResponse = await fetch(`${supabaseBase()}/auth/v1/user`, {
    headers: { apikey: serviceKey(), Authorization: `Bearer ${token}` }
  });
  const userText = await userResponse.text();
  if (!userResponse.ok) throw Object.assign(new Error('Invalid session'), { statusCode: 401 });
  const user = JSON.parse(userText);
  const rows = await supabaseFetch(`/rest/v1/user_profiles?select=id,email,role,status,workspace_id&id=eq.${encodeURIComponent(user.id)}&limit=1`, {
    headers: { Accept: 'application/json' }
  });
  const profile = Array.isArray(rows) ? rows[0] : null;
  if (!profile || profile.status !== 'active') throw Object.assign(new Error('Create an active profile before uploading rate sheets.'), { statusCode: 403 });
  return { user, profile, workspaceId: profile.workspace_id || DEFAULT_WORKSPACE_ID };
}

export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') return json(res, 405, { ok: false, error: 'Method not allowed' });
    const actor = await requireProfiledUser(req);
    const body = req.body || {};
    const upload = body.upload || {};
    const storagePath = cleanText(body.storagePath || upload.storagePath, 1200);
    validateStoragePath(storagePath, actor);
    const metadata = await getStorageObjectMetadata(storagePath);

    const workspaceId = actor.workspaceId;
    const now = new Date().toISOString();
    const clientUploadId = cleanText(upload.id, 120);
    const uploadId = stableId('sheet', `${workspaceId}:${actor.user.id}:${storagePath}:${clientUploadId}`);
    const combinedLenders = upload.lenderMode === 'combined' || upload.combinedLenders === true;
    const lenderName = combinedLenders ? 'Multiple lenders' : (cleanText(upload.lender, 200) || 'Unknown lender');
    const fileName = cleanText(upload.fileName, 300) || storagePath.split('/').pop() || 'rate-sheet-upload';
    const fileType = cleanText(upload.fileType, 30) || (metadata.mimeType.includes('pdf') ? 'PDF' : 'FILE');
    const notes = cleanText(upload.notes, 2000);
    const source = cleanText(upload.source, 120) || (combinedLenders ? 'Combined all-lender upload' : 'Manual upload');
    const actorRole = actor.profile.role === 'admin' ? 'Admin' : 'User / broker';
    const status = safeStatus(upload.status);

    await supabaseFetch('/rest/v1/rate_sheet_uploads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Prefer: 'resolution=merge-duplicates,return=minimal' },
      body: JSON.stringify({
        id: uploadId,
        workspace_id: workspaceId,
        lender_id: cleanText(upload.lenderId, 120),
        lender: lenderName,
        file_name: fileName,
        file_type: fileType,
        file_size: metadata.size || Number(upload.fileSize) || 0,
        source,
        actor_role: actorRole,
        effective_date: upload.effectiveDate || null,
        priority: cleanText(upload.priority, 80) || 'Normal',
        notes: notes || null,
        status,
        storage_path: storagePath,
        created_by: actor.user.id,
        created_at: now
      })
    });

    const sourceDocumentId = stableId('rsd', `${workspaceId}:${storagePath}:manual_upload`);
    await supabaseFetch('/rest/v1/rate_source_documents', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Prefer: 'resolution=merge-duplicates,return=representation' },
      body: JSON.stringify({
        id: sourceDocumentId,
        workspace_id: workspaceId,
        ingestion_event_id: null,
        source_kind: 'manual_upload',
        lender_name: lenderName,
        source_email_from: actor.user.email || actor.profile.email || null,
        source_email_to: 'rates@ontariomortgagerateportal.ca',
        source_email_subject: `Manual rate-sheet upload: ${fileName}`,
        source_email_message_id: sourceDocumentId,
        source_email_thread_id: null,
        received_at: now,
        storage_bucket: UPLOAD_BUCKET,
        storage_path: storagePath,
        mime_type: metadata.mimeType,
        file_name: fileName,
        file_size_bytes: metadata.size,
        sha256: null,
        status: 'queued',
        parse_priority: upload.priority === 'Urgent - rate change' ? 20 : 50,
        metadata: {
          upload_id: uploadId,
          client_upload_id: clientUploadId || null,
          lender_id: cleanText(upload.lenderId, 120),
          lender_mode: combinedLenders ? 'combined' : 'single',
          combined_lenders: combinedLenders,
          source,
          actor_role: actorRole,
          notes,
          storage_etag: metadata.etag,
          storage_last_modified: metadata.lastModified,
          uploaded_by_email: actor.user.email || actor.profile.email || null,
          queued_by: 'manual-rate-upload-api'
        }
      })
    });

    return json(res, 200, { ok: true, uploadId, sourceDocumentId, storagePath, fileSize: metadata.size, mimeType: metadata.mimeType });
  } catch (error) {
    console.error('manual rate upload failed', error);
    return json(res, error.statusCode || 500, { ok: false, error: error.statusCode ? error.message : 'Manual upload failed' });
  }
}
