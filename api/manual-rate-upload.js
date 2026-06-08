const DEFAULT_WORKSPACE_ID = 'omrp-default';

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
  if (!response.ok) throw new Error(`Supabase ${path} failed ${response.status}: ${text}`);
  return payload;
}

function getBearer(req) {
  const auth = req.headers.authorization || req.headers.Authorization || '';
  return String(auth).startsWith('Bearer ') ? String(auth).slice(7) : '';
}

function cleanText(value = '', max = 500) {
  return String(value || '').trim().slice(0, max);
}

function safeStatus(value = '') {
  return cleanText(value, 80) || 'Queued for AI review';
}

async function requireProfiledUser(req) {
  const token = getBearer(req);
  if (!token) throw Object.assign(new Error('Missing bearer token'), { statusCode: 401 });
  const userResponse = await fetch(`${supabaseBase()}/auth/v1/user`, {
    headers: { apikey: serviceKey(), Authorization: `Bearer ${token}` }
  });
  const userText = await userResponse.text();
  if (!userResponse.ok) throw Object.assign(new Error(`Invalid session: ${userText}`), { statusCode: 401 });
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
    if (!storagePath) return json(res, 400, { ok: false, error: 'Missing uploaded storage path.' });
    const uploadId = cleanText(upload.id, 120);
    if (!uploadId) return json(res, 400, { ok: false, error: 'Missing upload id.' });
    const workspaceId = actor.workspaceId;
    const now = new Date().toISOString();
    const lenderName = cleanText(upload.lender, 200) || 'Unknown lender';
    const fileName = cleanText(upload.fileName, 300) || 'rate-sheet-upload';
    const fileType = cleanText(upload.fileType, 30) || 'FILE';
    const notes = cleanText(upload.notes, 2000);
    const source = cleanText(upload.source, 120) || 'Manual upload';
    const actorRole = cleanText(upload.actorRole, 120) || 'User / broker';
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
        file_size: Number(upload.fileSize) || 0,
        source,
        actor_role: actorRole,
        effective_date: upload.effectiveDate || null,
        priority: cleanText(upload.priority, 80) || 'Normal',
        notes: notes || null,
        status,
        storage_path: storagePath,
        created_by: actor.user.id,
        created_at: upload.createdAt || now
      })
    });

    const sourceDocumentId = `rsd-${uploadId.replace(/[^a-zA-Z0-9_-]+/g, '-')}`.slice(0, 120);
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
        received_at: upload.createdAt || now,
        storage_bucket: 'rate-sheet-uploads',
        storage_path: storagePath,
        mime_type: cleanText(body.mimeType, 160) || 'application/octet-stream',
        file_name: fileName,
        file_size_bytes: Number(upload.fileSize) || null,
        sha256: null,
        status: 'queued',
        parse_priority: upload.priority === 'Urgent - rate change' ? 20 : 50,
        metadata: {
          upload_id: uploadId,
          lender_id: cleanText(upload.lenderId, 120),
          source,
          actor_role: actorRole,
          notes,
          uploaded_by_email: actor.user.email || actor.profile.email || null,
          queued_by: 'manual-rate-upload-api'
        }
      })
    });

    return json(res, 200, { ok: true, uploadId, sourceDocumentId, storagePath });
  } catch (error) {
    console.error('manual rate upload failed', error);
    return json(res, error.statusCode || 500, { ok: false, error: error.message || 'Manual upload failed' });
  }
}
