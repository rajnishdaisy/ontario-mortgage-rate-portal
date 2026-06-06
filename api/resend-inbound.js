import crypto from 'node:crypto';

export const config = {
  api: {
    bodyParser: false
  }
};

const RATE_EMAIL_BUCKET = 'lender-rate-emails';
const ATTACHMENT_BUCKET = 'lender-rate-attachments';
const ARTIFACT_BUCKET = 'parsed-rate-artifacts';
const DEFAULT_WORKSPACE_ID = 'omrp-default';
const DEFAULT_MODEL = 'gpt-4.1-mini';
const AUTO_PUBLISH_MIN_CONFIDENCE = Number(process.env.RATE_AI_AUTO_PUBLISH_MIN_CONFIDENCE || '0.84');

function json(res, status, body) {
  res.setHeader('Content-Type', 'application/json');
  return res.status(status).json(body);
}

async function readRawBody(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  return Buffer.concat(chunks).toString('utf8');
}

function safeId(prefix, seed = '') {
  const digest = crypto.createHash('sha256').update(`${seed}:${Date.now()}:${Math.random()}`).digest('hex').slice(0, 18);
  return `${prefix}_${digest}`;
}

function stableId(prefix, seed = '') {
  const digest = crypto.createHash('sha256').update(String(seed || prefix)).digest('hex').slice(0, 24);
  return `${prefix}_${digest}`;
}

function isProductionRuntime() {
  return process.env.NODE_ENV === 'production' || Boolean(process.env.VERCEL_ENV);
}

function sha256Buffer(buffer) {
  return crypto.createHash('sha256').update(buffer).digest('hex');
}

function cleanPathPart(value) {
  return String(value || 'unknown')
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 90) || 'unknown';
}

function getHeader(req, name) {
  const value = req.headers[name.toLowerCase()];
  return Array.isArray(value) ? value[0] : value;
}

function timingSafeEqualText(a, b) {
  const ab = Buffer.from(a || '');
  const bb = Buffer.from(b || '');
  if (ab.length !== bb.length) return false;
  return crypto.timingSafeEqual(ab, bb);
}

function verifyResendWebhook(rawBody, req) {
  const secret = process.env.RESEND_WEBHOOK_SECRET;
  if (!secret) {
    if (process.env.ALLOW_UNSIGNED_RESEND_WEBHOOKS === 'true' && !isProductionRuntime()) return { ok: true, skipped: true };
    return { ok: false, reason: 'missing RESEND_WEBHOOK_SECRET' };
  }

  const id = getHeader(req, 'svix-id');
  const timestamp = getHeader(req, 'svix-timestamp');
  const signature = getHeader(req, 'svix-signature');
  if (!id || !timestamp || !signature) return { ok: false, reason: 'missing svix headers' };

  const ageSeconds = Math.abs(Date.now() / 1000 - Number(timestamp));
  if (!Number.isFinite(ageSeconds) || ageSeconds > 300) return { ok: false, reason: 'stale timestamp' };

  const secretPrefixes = ['whsec_', 'ewhsec_'];
  const matchedPrefix = secretPrefixes.find((prefix) => secret.startsWith(prefix));
  const secretBytes = matchedPrefix
    ? Buffer.from(secret.slice(matchedPrefix.length), 'base64')
    : Buffer.from(secret, 'utf8');
  const signedPayload = `${id}.${timestamp}.${rawBody}`;
  const expected = crypto.createHmac('sha256', secretBytes).update(signedPayload).digest('base64');
  const candidates = String(signature)
    .split(' ')
    .flatMap((part) => part.split(','))
    .map((part) => part.trim())
    .filter(Boolean)
    .filter((part) => part !== 'v1');

  return { ok: candidates.some((candidate) => timingSafeEqualText(candidate, expected)) };
}

function requireEnv(name) {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required env var: ${name}`);
  return value;
}

function supabaseHeaders(serviceKey, extra = {}) {
  return {
    apikey: serviceKey,
    Authorization: `Bearer ${serviceKey}`,
    ...extra
  };
}

async function supabaseFetch(path, options = {}) {
  const url = requireEnv('SUPABASE_URL').replace(/\/$/, '');
  const key = requireEnv('SUPABASE_SERVICE_ROLE_KEY');
  const response = await fetch(`${url}${path}`, {
    ...options,
    headers: supabaseHeaders(key, options.headers || {})
  });
  const text = await response.text();
  if (!response.ok) throw new Error(`Supabase ${path} failed ${response.status}: ${text}`);
  try { return text ? JSON.parse(text) : null; } catch { return text; }
}

async function uploadToBucket(bucket, path, bytes, contentType) {
  const urlPath = `/storage/v1/object/${encodeURIComponent(bucket)}/${path.split('/').map(encodeURIComponent).join('/')}`;
  return supabaseFetch(urlPath, {
    method: 'POST',
    headers: {
      'Content-Type': contentType || 'application/octet-stream',
      'x-upsert': 'true'
    },
    body: bytes
  });
}

async function insertRows(table, rows, prefer = 'return=representation') {
  return supabaseFetch(`/rest/v1/${table}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Prefer: prefer
    },
    body: JSON.stringify(rows)
  });
}

async function insertIgnoreRows(table, rows, prefer = 'return=representation', onConflict = 'id') {
  return supabaseFetch(`/rest/v1/${table}?on_conflict=${encodeURIComponent(onConflict)}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Prefer: `resolution=ignore-duplicates,${prefer}`
    },
    body: JSON.stringify(rows)
  });
}

async function patchRows(table, query, body) {
  return supabaseFetch(`/rest/v1/${table}?${query}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Prefer: 'return=representation'
    },
    body: JSON.stringify(body)
  });
}

async function resendApi(path) {
  const apiKey = requireEnv('RESEND_API_KEY');
  const response = await fetch(`https://api.resend.com${path}`, {
    headers: { Authorization: `Bearer ${apiKey}` }
  });
  const text = await response.text();
  if (!response.ok) throw new Error(`Resend ${path} failed ${response.status}: ${text}`);
  try { return text ? JSON.parse(text) : null; } catch { return text; }
}

async function getRows(table, query) {
  return supabaseFetch(`/rest/v1/${table}?${query}`, {
    method: 'GET',
    headers: { Accept: 'application/json' }
  });
}

async function downloadFromBucket(bucket, path) {
  const urlPath = `/storage/v1/object/${encodeURIComponent(bucket)}/${path.split('/').map(encodeURIComponent).join('/')}`;
  const url = requireEnv('SUPABASE_URL').replace(/\/$/, '');
  const key = requireEnv('SUPABASE_SERVICE_ROLE_KEY');
  const response = await fetch(`${url}${urlPath}`, {
    headers: supabaseHeaders(key)
  });
  const arrayBuffer = await response.arrayBuffer();
  if (!response.ok) throw new Error(`Supabase storage download failed ${response.status}: ${Buffer.from(arrayBuffer).toString('utf8')}`);
  return Buffer.from(arrayBuffer);
}

function parseEmailAddress(value) {
  const text = String(value || '').trim().toLowerCase();
  const angle = text.match(/<([^>]+)>/);
  const email = (angle ? angle[1] : text).match(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i)?.[0] || '';
  return email.toLowerCase();
}

function senderDomain(email) {
  return String(email || '').split('@')[1]?.toLowerCase() || '';
}

function configuredAllowedSenders() {
  return String(`${process.env.RATE_AI_ALLOWED_SENDERS || ''},${process.env.RATE_AI_FORWARDER_ALLOWED_SENDERS || ''}`)
    .split(/[\r\n,;]+/)
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);
}

function senderMatchesList(senderEmail, list) {
  const domain = senderDomain(senderEmail);
  return list.some((entry) => {
    if (entry.startsWith('@')) return domain === entry.slice(1);
    if (entry.startsWith('*.')) return domain === entry.slice(2) || domain.endsWith(`.${entry.slice(2)}`);
    if (entry.includes('@')) return senderEmail === entry;
    return domain === entry;
  });
}

async function lookupTrustedSender(senderEmail, workspaceId) {
  const domain = senderDomain(senderEmail);
  const filters = [`sender_email.eq.${encodeURIComponent(senderEmail)}`];
  if (domain) filters.push(`sender_domain.eq.${encodeURIComponent(domain)}`);
  const rows = await getRows(
    'lender_email_sources',
    `select=*&workspace_id=eq.${encodeURIComponent(workspaceId)}&is_active=eq.true&or=(${filters.join(',')})&limit=10`
  );
  return (rows || []).find((row) => ['trusted_extract', 'trusted_publish'].includes(row.trust_level)) || null;
}

async function isAllowedSender(meta, workspaceId) {
  const senderEmail = parseEmailAddress(meta.from);
  if (!senderEmail) return { allowed: false, senderEmail, reason: 'missing_sender_email' };
  const envList = configuredAllowedSenders();
  if (senderMatchesList(senderEmail, envList)) {
    return {
      allowed: true,
      senderEmail,
      source: 'env',
      trustLevel: process.env.RATE_AI_ALLOWED_SENDERS_CAN_PUBLISH === 'true' ? 'trusted_publish' : 'trusted_extract'
    };
  }
  const trustedSource = await lookupTrustedSender(senderEmail, workspaceId);
  if (trustedSource) return { allowed: true, senderEmail, source: 'database', trustedSource, trustLevel: trustedSource.trust_level };
  return { allowed: false, senderEmail, reason: envList.length ? 'sender_not_in_allowlist' : 'allowlist_empty' };
}

async function downloadUrl(url) {
  const parsed = new URL(url);
  const allowedHosts = String(process.env.RATE_AI_ATTACHMENT_ALLOWED_HOSTS || 'resend.com,api.resend.com,cdn.resend.app')
    .split(',')
    .map((host) => host.trim().toLowerCase())
    .filter(Boolean);
  if (allowedHosts.length && !allowedHosts.some((host) => parsed.hostname.toLowerCase() === host || parsed.hostname.toLowerCase().endsWith(`.${host}`))) {
    throw new Error(`Attachment download host not allowed: ${parsed.hostname}`);
  }
  const response = await fetch(url);
  const contentLength = Number(response.headers.get('content-length') || 0);
  const maxBytes = Number(process.env.RATE_AI_MAX_ATTACHMENT_BYTES || 12 * 1024 * 1024);
  if (contentLength && contentLength > maxBytes) throw new Error(`Attachment too large: ${contentLength} bytes`);
  const arrayBuffer = await response.arrayBuffer();
  if (!response.ok) throw new Error(`Attachment download failed ${response.status}`);
  if (arrayBuffer.byteLength > maxBytes) throw new Error(`Attachment too large: ${arrayBuffer.byteLength} bytes`);
  return {
    buffer: Buffer.from(arrayBuffer),
    contentType: response.headers.get('content-type') || 'application/octet-stream'
  };
}

function normalizeEmailFromWebhook(event) {
  const data = event?.data || {};
  return {
    emailId: data.email_id || data.id,
    createdAt: data.created_at || event.created_at,
    from: data.from || '',
    to: Array.isArray(data.to) ? data.to.join(', ') : (data.to || ''),
    cc: Array.isArray(data.cc) ? data.cc.join(', ') : (data.cc || ''),
    bcc: Array.isArray(data.bcc) ? data.bcc.join(', ') : (data.bcc || ''),
    subject: data.subject || '',
    messageId: data.message_id || '',
    attachments: Array.isArray(data.attachments) ? data.attachments : []
  };
}

function buildEmailSnapshot(event, email, meta) {
  return {
    webhook_event: event,
    received_email: email,
    normalized: meta
  };
}

function extractionSchema() {
  return {
    type: 'json_schema',
    name: 'mortgage_rate_email_extraction',
    strict: false,
    schema: {
      type: 'object',
      additionalProperties: false,
      properties: {
        lender_name: { type: 'string' },
        effective_date: { type: ['string', 'null'], description: 'YYYY-MM-DD if known' },
        expiry_date: { type: ['string', 'null'], description: 'YYYY-MM-DD if known' },
        summary: { type: 'string' },
        confidence: { type: 'number', minimum: 0, maximum: 1 },
        auto_publish_recommended: { type: 'boolean' },
        products: {
          type: 'array',
          items: {
            type: 'object',
            additionalProperties: false,
            properties: {
              product_name: { type: ['string', 'null'] },
              province: { type: ['string', 'null'] },
              purpose: { type: ['string', 'null'] },
              occupancy: { type: ['string', 'null'] },
              mortgage_type: { type: ['string', 'null'], enum: ['fixed', 'variable', 'heloc', 'private', 'alternative', 'other', null] },
              term_label: { type: ['string', 'null'] },
              term_months: { type: ['integer', 'null'] },
              amortization_years: { type: ['integer', 'null'] },
              insured_rate: { type: ['number', 'null'] },
              insurable_rate: { type: ['number', 'null'] },
              uninsured_rate: { type: ['number', 'null'] },
              variable_discount: { type: ['string', 'null'] },
              lender_prime_rate: { type: ['number', 'null'] },
              rate_hold_days: { type: ['integer', 'null'] },
              effective_date: { type: ['string', 'null'] },
              expiry_date: { type: ['string', 'null'] },
              conditions: { type: 'array', items: { type: 'string' } },
              policy_notes: { type: 'array', items: { type: 'string' } },
              confidence: { type: 'number', minimum: 0, maximum: 1 }
            },
            required: ['product_name', 'province', 'mortgage_type', 'term_label', 'conditions', 'policy_notes', 'confidence']
          }
        },
        policy_notes: {
          type: 'array',
          items: {
            type: 'object',
            additionalProperties: false,
            properties: {
              category: { type: 'string' },
              title: { type: 'string' },
              note: { type: 'string' },
              borrower_scenario_tags: { type: 'array', items: { type: 'string' } },
              province: { type: ['string', 'null'] },
              effective_date: { type: ['string', 'null'] },
              expiry_date: { type: ['string', 'null'] },
              confidence: { type: 'number', minimum: 0, maximum: 1 }
            },
            required: ['category', 'title', 'note', 'confidence']
          }
        },
        contacts: {
          type: 'array',
          items: {
            type: 'object',
            additionalProperties: false,
            properties: {
              name: { type: 'string' },
              role: { type: ['string', 'null'] },
              email: { type: ['string', 'null'] },
              phone: { type: ['string', 'null'] },
              region: { type: ['string', 'null'] },
              province: { type: ['string', 'null'] },
              notes: { type: ['string', 'null'] },
              confidence: { type: 'number', minimum: 0, maximum: 1 }
            },
            required: ['name', 'confidence']
          }
        }
      },
      required: ['lender_name', 'summary', 'confidence', 'auto_publish_recommended', 'products', 'policy_notes', 'contacts']
    }
  };
}

function textPart(label, value) {
  return `${label}:\n${value || ''}`.slice(0, 180000);
}

function isSpreadsheetAttachment(filename, mime) {
  const lower = String(filename || '').toLowerCase();
  return lower.endsWith('.xls') || lower.endsWith('.xlsx') || lower.endsWith('.xlsm')
    || mime === 'application/vnd.ms-excel'
    || mime === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
}

async function spreadsheetToText(buffer, filename) {
  const ExcelJS = await import('exceljs');
  const Workbook = ExcelJS.default?.Workbook || ExcelJS.Workbook;
  const workbook = new Workbook();
  await workbook.xlsx.load(buffer);
  const chunks = [];
  workbook.eachSheet((worksheet) => {
    const rows = [];
    worksheet.eachRow({ includeEmpty: false }, (row) => {
      const values = [];
      row.eachCell({ includeEmpty: true }, (cell) => {
        const value = cell.text || cell.value || '';
        values.push(String(value).replace(/\r?\n/g, ' ').replace(/,/g, ' '));
      });
      if (values.some(Boolean)) rows.push(values.join(','));
    });
    chunks.push(`Workbook: ${filename}\nSheet: ${worksheet.name}\n${rows.join('\n')}`);
  });
  return chunks.join('\n\n---\n\n').slice(0, 160000);
}

async function attachmentContentParts(attachments) {
  const parts = [];
  for (const attachment of attachments) {
    const mime = attachment.contentType || attachment.content_type || 'application/octet-stream';
    const filename = attachment.filename || 'attachment';
    if (!attachment.buffer) continue;

    if (isSpreadsheetAttachment(filename, mime)) {
      try {
        const spreadsheetText = await spreadsheetToText(attachment.buffer, filename);
        parts.push({ type: 'input_text', text: `Parsed spreadsheet attachment: ${filename}\n${spreadsheetText}` });
      } catch (error) {
        parts.push({ type: 'input_text', text: `Spreadsheet attachment ${filename} could not be parsed automatically: ${error.message}` });
      }
      continue;
    }

    const base64 = attachment.buffer.toString('base64');
    if (mime.startsWith('image/')) {
      parts.push({ type: 'input_image', image_url: `data:${mime};base64,${base64}` });
    } else if (mime === 'application/pdf' || mime === 'text/csv' || mime.startsWith('text/')) {
      parts.push({ type: 'input_file', filename, file_data: `data:${mime};base64,${base64}` });
    }
  }
  return parts;
}

async function runAiExtraction({ email, meta, sourceDocument, attachments }) {
  const apiKey = requireEnv('OPENAI_API_KEY');
  const model = process.env.OPENAI_RATE_EXTRACTION_MODEL || DEFAULT_MODEL;
  const bodyText = [
    textPart('From', meta.from),
    textPart('To', meta.to),
    textPart('Subject', meta.subject),
    textPart('Email text body', email?.text),
    textPart('Email html body', email?.html),
    textPart('Headers', JSON.stringify(email?.headers || {}, null, 2)),
    textPart('Attachment metadata', JSON.stringify(attachments.map((a) => ({
      filename: a.filename,
      content_type: a.contentType || a.content_type,
      size: a.size || a.buffer?.length || null
    })), null, 2))
  ].join('\n\n---\n\n');

  const inputContent = [
    {
      type: 'input_text',
      text: `You are an Ontario mortgage rate-sheet operations analyst. Extract only facts visible in the email/attachments. Do not guess missing rates. Normalize rates as percentages, e.g. 4.59 not 0.0459. If a number is unclear, omit it or set null and lower confidence. Return products, policy notes, and BDM/lender contacts. Auto-publish should be true only if lender, effective date, term, at least one rate, and conditions are clear. Source document id: ${sourceDocument.id}\n\n${bodyText}`
    },
    ...(await attachmentContentParts(attachments))
  ];

  const response = await fetch('https://api.openai.com/v1/responses', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model,
      input: [{ role: 'user', content: inputContent }],
      text: { format: extractionSchema() },
      max_output_tokens: 6000
    })
  });

  const responseText = await response.text();
  if (!response.ok) throw new Error(`OpenAI extraction failed ${response.status}: ${responseText}`);
  const parsed = JSON.parse(responseText);
  const outputText = parsed.output_text || parsed.output?.flatMap((o) => o.content || []).find((c) => c.text)?.text;
  if (!outputText) throw new Error(`OpenAI extraction returned no output_text: ${responseText.slice(0, 500)}`);
  return JSON.parse(outputText);
}

function validDateOrNull(value) {
  if (!value || typeof value !== 'string') return null;
  return /^\d{4}-\d{2}-\d{2}$/.test(value) ? value : null;
}

function averageConfidence(extraction) {
  const values = [extraction.confidence, ...(extraction.products || []).map((p) => p.confidence)].filter((n) => typeof n === 'number');
  if (!values.length) return 0;
  return values.reduce((a, b) => a + b, 0) / values.length;
}

function realisticRateOrNull(value) {
  if (value === null || value === undefined || value === '') return null;
  const number = Number(value);
  return Number.isFinite(number) && number >= 0.5 && number <= 25 ? Math.round(number * 1000) / 1000 : null;
}

function isExpiredDate(value) {
  const date = validDateOrNull(value);
  return Boolean(date && Date.parse(date) < Date.now() - 86400000);
}

function isPublishableProduct(product, extraction) {
  const effectiveDate = validDateOrNull(product.effective_date) || validDateOrNull(extraction.effective_date);
  const expiryDate = validDateOrNull(product.expiry_date) || validDateOrNull(extraction.expiry_date);
  const hasRate = [product.insured_rate, product.insurable_rate, product.uninsured_rate, product.lender_prime_rate]
    .some((rate) => realisticRateOrNull(rate) !== null) || Boolean(product.variable_discount);
  return Boolean(effectiveDate && !isExpiredDate(expiryDate) && product.term_label && hasRate);
}

async function persistExtraction({ extraction, sourceDocumentId, extractionRunId, workspaceId, canAutoPublish = false }) {
  const lender = extraction.lender_name || 'Unknown lender';
  const products = Array.isArray(extraction.products) ? extraction.products : [];
  const policies = Array.isArray(extraction.policy_notes) ? extraction.policy_notes : [];
  const contacts = Array.isArray(extraction.contacts) ? extraction.contacts : [];
  const confidence = averageConfidence(extraction);
  const hasPublishableProduct = products.some((p) => Boolean(lender && lender !== 'Unknown lender' && isPublishableProduct(p, extraction)));
  const shouldPublish = Boolean(canAutoPublish && extraction.auto_publish_recommended) && confidence >= AUTO_PUBLISH_MIN_CONFIDENCE && hasPublishableProduct;
  const productStatus = shouldPublish ? 'published' : 'needs_review';
  const extractedRows = products.map((p, idx) => ({
    id: safeId('erp', `${sourceDocumentId}:${idx}`),
    workspace_id: workspaceId,
    extraction_run_id: extractionRunId,
    source_document_id: sourceDocumentId,
    lender_name: lender,
    product_name: p.product_name || null,
    province: p.province || 'Ontario',
    purpose: p.purpose || null,
    occupancy: p.occupancy || null,
    mortgage_type: p.mortgage_type || 'other',
    term_label: p.term_label || null,
    term_months: p.term_months || null,
    amortization_years: p.amortization_years || null,
    insured_rate: realisticRateOrNull(p.insured_rate),
    insurable_rate: realisticRateOrNull(p.insurable_rate),
    uninsured_rate: realisticRateOrNull(p.uninsured_rate),
    variable_discount: p.variable_discount || null,
    lender_prime_rate: realisticRateOrNull(p.lender_prime_rate),
    rate_hold_days: p.rate_hold_days ?? null,
    effective_date: validDateOrNull(p.effective_date) || validDateOrNull(extraction.effective_date),
    expiry_date: validDateOrNull(p.expiry_date) || validDateOrNull(extraction.expiry_date),
    conditions: p.conditions || [],
    policy_notes: p.policy_notes || [],
    bdm_contact: {},
    confidence: p.confidence ?? confidence,
    status: productStatus,
    reviewed_at: shouldPublish ? new Date().toISOString() : null,
    review_notes: shouldPublish ? 'AI auto-reviewed and published above confidence threshold.' : null
  }));

  const insertedExtracted = extractedRows.length ? await insertRows('extracted_rate_products', extractedRows) : [];

  let publishedCount = 0;
  if (shouldPublish && insertedExtracted.length) {
    const publishedRows = insertedExtracted.filter((row) => isPublishableProduct(row, extraction)).map((row) => ({
      id: safeId('pub', row.id),
      workspace_id: workspaceId,
      extracted_rate_product_id: row.id,
      source_document_id: sourceDocumentId,
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
      effective_date: row.effective_date || new Date().toISOString().slice(0, 10),
      expiry_date: row.expiry_date,
      source_label: 'Resend inbound lender email',
      freshness_status: 'fresh',
      confidence: row.confidence,
      public_notes: extraction.summary || null,
      conditions: row.conditions || [],
      is_published: true,
      approved_at: new Date().toISOString()
    }));
    await insertRows('published_rates', publishedRows, 'return=minimal');
    publishedCount = publishedRows.length;
  }

  if (policies.length) {
    await insertRows('lender_policy_notes', policies.map((p, idx) => ({
      id: safeId('pol', `${sourceDocumentId}:${idx}`),
      workspace_id: workspaceId,
      source_document_id: sourceDocumentId,
      lender_name: lender,
      category: p.category || 'general',
      title: p.title || 'Policy note',
      note: p.note || '',
      borrower_scenario_tags: p.borrower_scenario_tags || [],
      province: p.province || 'Ontario',
      effective_date: validDateOrNull(p.effective_date) || validDateOrNull(extraction.effective_date),
      expiry_date: validDateOrNull(p.expiry_date) || validDateOrNull(extraction.expiry_date),
      confidence: p.confidence ?? confidence,
      status: shouldPublish ? 'published' : 'needs_review',
      approved_at: shouldPublish ? new Date().toISOString() : null
    })), 'return=minimal');
  }

  if (contacts.length) {
    await insertRows('lender_contacts', contacts.filter((c) => c.name).map((c, idx) => ({
      id: safeId('bdm', `${sourceDocumentId}:${idx}`),
      workspace_id: workspaceId,
      source_document_id: sourceDocumentId,
      lender_name: lender,
      name: c.name,
      role: c.role || null,
      email: c.email || null,
      phone: c.phone || null,
      region: c.region || null,
      province: c.province || 'Ontario',
      notes: c.notes || null,
      confidence: c.confidence ?? confidence,
      status: shouldPublish ? 'published' : 'needs_review',
      approved_at: shouldPublish ? new Date().toISOString() : null
    })), 'return=minimal');
  }

  return { shouldPublish, publishedCount, extractedCount: extractedRows.length, confidence };
}


async function processStoredSourceDocument(row) {
  const workspaceId = row.workspace_id || DEFAULT_WORKSPACE_ID;
  const emailBytes = await downloadFromBucket(row.storage_bucket, row.storage_path);
  const snapshot = JSON.parse(emailBytes.toString('utf8'));
  const email = snapshot.received_email || {};
  const meta = snapshot.normalized || {
    from: row.source_email_from,
    to: row.source_email_to,
    subject: row.source_email_subject,
    emailId: row.metadata?.resend_email_id || row.source_email_message_id,
    messageId: row.source_email_message_id
  };

  const senderAllowed = await isAllowedSender(meta, workspaceId);
  if (!senderAllowed.allowed) {
    await patchRows('rate_source_documents', `id=eq.${encodeURIComponent(row.id)}`, {
      status: 'rejected',
      metadata: { ...(row.metadata || {}), sender_allowed: false, sender_email: senderAllowed.senderEmail, reason: senderAllowed.reason }
    });
    if (row.ingestion_event_id) {
      await patchRows('rate_ingestion_events', `id=eq.${encodeURIComponent(row.ingestion_event_id)}`, {
        status: 'Rejected',
        notes: `Skipped AI analysis for unapproved sender ${senderAllowed.senderEmail || row.source_email_from}.`
      });
    }
    return { sourceDocumentId: row.id, ignored: true, reason: senderAllowed.reason, sender: senderAllowed.senderEmail };
  }

  await patchRows('rate_source_documents', `id=eq.${encodeURIComponent(row.id)}`, {
    status: 'extracting',
    metadata: { ...(row.metadata || {}), sender_allowed: true, sender_email: senderAllowed.senderEmail, allowlist_source: senderAllowed.source }
  });

  const attachmentRows = await getRows(
    'rate_source_documents',
    `select=*&workspace_id=eq.${encodeURIComponent(workspaceId)}&ingestion_event_id=eq.${encodeURIComponent(row.ingestion_event_id)}&source_kind=eq.attachment&order=created_at.asc`
  );
  const downloadedAttachments = [];
  for (const attachmentRow of attachmentRows || []) {
    const buffer = await downloadFromBucket(attachmentRow.storage_bucket, attachmentRow.storage_path);
    downloadedAttachments.push({
      filename: attachmentRow.file_name || 'attachment',
      contentType: attachmentRow.mime_type || 'application/octet-stream',
      size: attachmentRow.file_size_bytes || buffer.length,
      buffer
    });
  }

  const extractionRunId = safeId('rer', row.id);
  await insertRows('rate_extraction_runs', [{
    id: extractionRunId,
    workspace_id: workspaceId,
    source_document_id: row.id,
    model_name: process.env.OPENAI_RATE_EXTRACTION_MODEL || DEFAULT_MODEL,
    status: 'running',
    started_at: new Date().toISOString()
  }], 'return=minimal');

  try {
    const extraction = await runAiExtraction({ email, meta, sourceDocument: { id: row.id }, attachments: downloadedAttachments });
    const artifactBytes = Buffer.from(JSON.stringify(extraction, null, 2));
    const basePath = `${workspaceId}/${String(row.received_at || new Date().toISOString()).slice(0, 10)}/${cleanPathPart(row.metadata?.resend_email_id || row.id)}`;
    const artifactPath = `${basePath}/ai-extraction.json`;
    await uploadToBucket(ARTIFACT_BUCKET, artifactPath, artifactBytes, 'application/json');

    await patchRows('rate_extraction_runs', `id=eq.${encodeURIComponent(extractionRunId)}`, {
      status: 'succeeded',
      completed_at: new Date().toISOString(),
      confidence: extraction.confidence ?? averageConfidence(extraction),
      summary: extraction.summary || null,
      raw_extraction: extraction,
      artifact_bucket: ARTIFACT_BUCKET,
      artifact_path: artifactPath
    });

    const publishResult = await persistExtraction({
      extraction,
      sourceDocumentId: row.id,
      extractionRunId,
      workspaceId,
      canAutoPublish: senderAllowed.trustLevel === 'trusted_publish'
    });
    await patchRows('rate_source_documents', `id=eq.${encodeURIComponent(row.id)}`, {
      lender_name: extraction.lender_name || null,
      status: publishResult.shouldPublish ? 'approved' : 'needs_review'
    });
    if (row.ingestion_event_id) {
      await patchRows('rate_ingestion_events', `id=eq.${encodeURIComponent(row.ingestion_event_id)}`, {
        lender: extraction.lender_name || meta.from || 'Unknown lender',
        effective_date: validDateOrNull(extraction.effective_date),
        status: publishResult.shouldPublish ? 'Approved' : 'Pending review',
        notes: extraction.summary || `Processed inbound lender email: ${meta.subject || '(no subject)'}`
      });
    }
    return {
      sourceDocumentId: row.id,
      extractionRunId,
      autoPublished: publishResult.shouldPublish,
      publishedCount: publishResult.publishedCount,
      extractedCount: publishResult.extractedCount,
      confidence: publishResult.confidence
    };
  } catch (error) {
    await patchRows('rate_extraction_runs', `id=eq.${encodeURIComponent(extractionRunId)}`, {
      status: 'failed',
      completed_at: new Date().toISOString(),
      error_message: error.message
    });
    await patchRows('rate_source_documents', `id=eq.${encodeURIComponent(row.id)}`, { status: 'failed' });
    if (row.ingestion_event_id) {
      await patchRows('rate_ingestion_events', `id=eq.${encodeURIComponent(row.ingestion_event_id)}`, {
        status: 'Failed',
        notes: `AI extraction failed: ${error.message}`
      });
    }
    throw error;
  }
}

export async function processQueuedRateEmails({ limit = 10 } = {}) {
  const workspaceId = process.env.RATE_AI_WORKSPACE_ID || DEFAULT_WORKSPACE_ID;
  const rows = await getRows(
    'rate_source_documents',
    `select=*&workspace_id=eq.${encodeURIComponent(workspaceId)}&source_kind=eq.email&status=eq.queued&order=received_at.asc&limit=${Number(limit) || 10}`
  );
  const results = [];
  for (const row of rows || []) {
    try {
      results.push({ ok: true, ...(await processStoredSourceDocument(row)) });
    } catch (error) {
      results.push({ ok: false, sourceDocumentId: row.id, error: error.message });
    }
  }
  return { workspaceId, checked: rows?.length || 0, results };
}

function isAuthorizedInboxAdmin(req) {
  const adminToken = process.env.RATE_INBOX_ADMIN_TOKEN;
  const cronSecret = process.env.CRON_SECRET;
  const auth = getHeader(req, 'authorization');
  if (adminToken && auth === `Bearer ${adminToken}`) return true;
  if (cronSecret && auth === `Bearer ${cronSecret}`) return true;
  return false;
}

async function listReceivedEmails(limit = 25) {
  const query = new URLSearchParams({ limit: String(Math.max(1, Math.min(100, Number(limit) || 25))) });
  const response = await resendApi(`/emails/receiving?${query.toString()}`);
  const rows = response?.data || response?.emails || response || [];
  return Array.isArray(rows) ? rows : [];
}

export async function ingestReceivedEmailEvent(event, options = {}) {
  const workspaceId = process.env.RATE_AI_WORKSPACE_ID || DEFAULT_WORKSPACE_ID;
  const meta = normalizeEmailFromWebhook(event);
  if (!meta.emailId) throw new Error('Resend webhook missing data.email_id');
  const senderAllowed = await isAllowedSender(meta, workspaceId);

  let emailResponse;
  let email;
  let attachmentsResponse;
  let attachmentMetas;
  try {
    emailResponse = options.email ? { data: options.email } : await resendApi(`/emails/receiving/${encodeURIComponent(meta.emailId)}`);
    email = emailResponse?.data || emailResponse || {};
    attachmentsResponse = options.attachments ? { data: options.attachments } : await resendApi(`/emails/receiving/${encodeURIComponent(meta.emailId)}/attachments`);
    attachmentMetas = attachmentsResponse?.data || attachmentsResponse || meta.attachments || [];
  } catch (error) {
    const receivedAt = meta.createdAt || event.created_at || new Date().toISOString();
    const basePath = `${workspaceId}/${receivedAt.slice(0, 10)}/${cleanPathPart(meta.emailId)}`;
    const ingestionEventId = stableId('rie', `${workspaceId}:${meta.emailId}`);
    const sourceDocumentId = stableId('rsd', `${workspaceId}:${meta.emailId}:email`);
    const fallbackEmail = { ...(event.data || {}), fetch_error: error.message };
    const emailJson = Buffer.from(JSON.stringify(buildEmailSnapshot(event, fallbackEmail, meta), null, 2));
    const emailStoragePath = `${basePath}/email-metadata.json`;
    await uploadToBucket(RATE_EMAIL_BUCKET, emailStoragePath, emailJson, 'application/json');
    await insertIgnoreRows('rate_ingestion_events', [{
      id: ingestionEventId,
      workspace_id: workspaceId,
      lender: meta.from || 'Unknown lender email',
      source: 'Resend inbound email',
      effective_date: null,
      status: 'Failed',
      notes: `Stored inbound metadata but could not fetch Resend email content: ${error.message}`
    }], 'return=minimal');
    await insertIgnoreRows('rate_source_documents', [{
      id: sourceDocumentId,
      workspace_id: workspaceId,
      ingestion_event_id: ingestionEventId,
      source_kind: 'email',
      lender_name: null,
      source_email_from: meta.from,
      source_email_to: meta.to,
      source_email_subject: meta.subject,
      source_email_message_id: meta.messageId || meta.emailId,
      source_email_thread_id: null,
      received_at: receivedAt,
      storage_bucket: RATE_EMAIL_BUCKET,
      storage_path: emailStoragePath,
      mime_type: 'application/json',
      file_name: 'email-metadata.json',
      file_size_bytes: emailJson.length,
      sha256: sha256Buffer(emailJson),
      status: 'failed',
      metadata: { resend_email_id: meta.emailId, cc: meta.cc, bcc: meta.bcc, queued_by: options.queuedBy || 'resend-webhook', fetch_error: error.message }
    }], 'return=minimal');
    return { ok: false, ignored: false, fetchFailed: true, resendEmailId: meta.emailId, sourceDocumentId, sender: senderAllowed.senderEmail, error: error.message };
  }

  const receivedAt = meta.createdAt || email.created_at || new Date().toISOString();
  const basePath = `${workspaceId}/${receivedAt.slice(0, 10)}/${cleanPathPart(meta.emailId)}`;
  const emailJson = Buffer.from(JSON.stringify(buildEmailSnapshot(event, email, meta), null, 2));
  const emailStoragePath = `${basePath}/email.json`;
  await uploadToBucket(RATE_EMAIL_BUCKET, emailStoragePath, emailJson, 'application/json');

  const ingestionEventId = stableId('rie', `${workspaceId}:${meta.emailId}`);
  await insertIgnoreRows('rate_ingestion_events', [{
    id: ingestionEventId,
    workspace_id: workspaceId,
    lender: meta.from || 'Unknown lender email',
    source: 'Resend inbound email',
    effective_date: null,
    status: 'Pending review',
    notes: `Inbound lender email: ${meta.subject || '(no subject)'}`
  }], 'return=minimal');

  const sourceDocumentId = stableId('rsd', `${workspaceId}:${meta.emailId}:email`);
  await insertIgnoreRows('rate_source_documents', [{
    id: sourceDocumentId,
    workspace_id: workspaceId,
    ingestion_event_id: ingestionEventId,
    source_kind: 'email',
    lender_name: null,
    source_email_from: meta.from,
    source_email_to: meta.to,
    source_email_subject: meta.subject,
    source_email_message_id: meta.messageId || meta.emailId,
    source_email_thread_id: email.thread_id || null,
    received_at: receivedAt,
    storage_bucket: RATE_EMAIL_BUCKET,
    storage_path: emailStoragePath,
    mime_type: 'application/json',
    file_name: 'email.json',
    file_size_bytes: emailJson.length,
    sha256: sha256Buffer(emailJson),
    status: 'queued',
    metadata: { resend_email_id: meta.emailId, cc: meta.cc, bcc: meta.bcc, queued_by: options.queuedBy || 'resend-webhook' }
  }], 'return=minimal');

  if (!senderAllowed.allowed) {
    await patchRows('rate_source_documents', `id=eq.${encodeURIComponent(sourceDocumentId)}`, {
      status: 'rejected',
      metadata: { resend_email_id: meta.emailId, cc: meta.cc, bcc: meta.bcc, sender_allowed: false, sender_email: senderAllowed.senderEmail, reason: senderAllowed.reason }
    });
    await patchRows('rate_ingestion_events', `id=eq.${encodeURIComponent(ingestionEventId)}`, {
      status: 'Rejected',
      notes: `Skipped AI analysis for unapproved sender ${senderAllowed.senderEmail || meta.from}. Add the sender to RATE_AI_ALLOWED_SENDERS or lender_email_sources to process future emails.`
    });
    return { ok: true, ignored: true, reason: senderAllowed.reason, sender: senderAllowed.senderEmail, resendEmailId: meta.emailId, sourceDocumentId };
  }

  const downloadedAttachments = [];
  const maxAttachments = Number(process.env.RATE_AI_MAX_ATTACHMENTS || 8);
  for (const attachmentMeta of attachmentMetas.slice(0, maxAttachments)) {
    const downloadUrlValue = attachmentMeta.download_url || attachmentMeta.url;
    if (!downloadUrlValue) continue;
    const downloaded = await downloadUrl(downloadUrlValue);
    const filename = attachmentMeta.filename || `${attachmentMeta.id || safeId('att')}`;
    const mime = attachmentMeta.content_type || downloaded.contentType;
    const attachmentPath = `${basePath}/attachments/${cleanPathPart(filename)}`;
    await uploadToBucket(ATTACHMENT_BUCKET, attachmentPath, downloaded.buffer, mime);
    const attachmentDocId = stableId('rsdatt', `${workspaceId}:${meta.emailId}:${attachmentMeta.id || filename}`);
    await insertIgnoreRows('rate_source_documents', [{
      id: attachmentDocId,
      workspace_id: workspaceId,
      ingestion_event_id: ingestionEventId,
      source_kind: 'attachment',
      lender_name: null,
      source_email_from: meta.from,
      source_email_to: meta.to,
      source_email_subject: meta.subject,
      source_email_message_id: meta.messageId || meta.emailId,
      source_email_thread_id: email.thread_id || null,
      received_at: receivedAt,
      storage_bucket: ATTACHMENT_BUCKET,
      storage_path: attachmentPath,
      mime_type: mime,
      file_name: filename,
      file_size_bytes: downloaded.buffer.length,
      sha256: sha256Buffer(downloaded.buffer),
      status: 'stored',
      metadata: { resend_email_id: meta.emailId, resend_attachment_id: attachmentMeta.id || null }
    }], 'return=minimal');
    downloadedAttachments.push({ ...attachmentMeta, filename, contentType: mime, buffer: downloaded.buffer });
  }

  if (!senderAllowed.allowed) {
    await patchRows('rate_source_documents', `id=eq.${encodeURIComponent(sourceDocumentId)}`, {
      status: 'rejected',
      metadata: { resend_email_id: meta.emailId, cc: meta.cc, bcc: meta.bcc, sender_allowed: false, sender_email: senderAllowed.senderEmail, reason: senderAllowed.reason }
    });
    await patchRows('rate_ingestion_events', `id=eq.${encodeURIComponent(ingestionEventId)}`, {
      status: 'Rejected',
      notes: `Skipped AI analysis for unapproved sender ${senderAllowed.senderEmail || meta.from}. Add the sender to RATE_AI_ALLOWED_SENDERS or lender_email_sources to process future emails.`
    });
    return { ok: true, ignored: true, reason: senderAllowed.reason, sender: senderAllowed.senderEmail, resendEmailId: meta.emailId, sourceDocumentId };
  }

  if (process.env.RATE_AI_PROCESS_IMMEDIATELY !== 'true' && !options.processImmediately) {
    return { ok: true, queued: true, resendEmailId: meta.emailId, sourceDocumentId, sender: senderAllowed.senderEmail };
  }

  const extractionRunId = safeId('rer', meta.emailId);
  await insertRows('rate_extraction_runs', [{
    id: extractionRunId,
    workspace_id: workspaceId,
    source_document_id: sourceDocumentId,
    model_name: process.env.OPENAI_RATE_EXTRACTION_MODEL || DEFAULT_MODEL,
    status: 'running',
    started_at: new Date().toISOString()
  }], 'return=minimal');

  try {
    const extraction = await runAiExtraction({ email, meta, sourceDocument: { id: sourceDocumentId }, attachments: downloadedAttachments });
    const artifactBytes = Buffer.from(JSON.stringify(extraction, null, 2));
    const artifactPath = `${basePath}/ai-extraction.json`;
    await uploadToBucket(ARTIFACT_BUCKET, artifactPath, artifactBytes, 'application/json');

    await patchRows('rate_extraction_runs', `id=eq.${encodeURIComponent(extractionRunId)}`, {
      status: 'succeeded',
      completed_at: new Date().toISOString(),
      confidence: extraction.confidence ?? averageConfidence(extraction),
      summary: extraction.summary || null,
      raw_extraction: extraction,
      artifact_bucket: ARTIFACT_BUCKET,
      artifact_path: artifactPath
    });

    const publishResult = await persistExtraction({
      extraction,
      sourceDocumentId,
      extractionRunId,
      workspaceId,
      canAutoPublish: senderAllowed.trustLevel === 'trusted_publish'
    });
    await patchRows('rate_source_documents', `id=eq.${encodeURIComponent(sourceDocumentId)}`, {
      lender_name: extraction.lender_name || null,
      status: publishResult.shouldPublish ? 'approved' : 'needs_review'
    });
    await patchRows('rate_ingestion_events', `id=eq.${encodeURIComponent(ingestionEventId)}`, {
      lender: extraction.lender_name || meta.from || 'Unknown lender',
      effective_date: validDateOrNull(extraction.effective_date),
      status: publishResult.shouldPublish ? 'Approved' : 'Pending review',
      notes: extraction.summary || `Processed inbound lender email: ${meta.subject || '(no subject)'}`
    });

    return {
      ok: true,
      resendEmailId: meta.emailId,
      sourceDocumentId,
      extractionRunId,
      autoPublished: publishResult.shouldPublish,
      publishedCount: publishResult.publishedCount,
      extractedCount: publishResult.extractedCount,
      confidence: publishResult.confidence
    };
  } catch (error) {
    await patchRows('rate_extraction_runs', `id=eq.${encodeURIComponent(extractionRunId)}`, {
      status: 'failed',
      completed_at: new Date().toISOString(),
      error_message: error.message
    });
    await patchRows('rate_source_documents', `id=eq.${encodeURIComponent(sourceDocumentId)}`, { status: 'failed' });
    await patchRows('rate_ingestion_events', `id=eq.${encodeURIComponent(ingestionEventId)}`, {
      status: 'Failed',
      notes: `AI extraction failed: ${error.message}`
    });
    throw error;
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return json(res, 405, { error: 'Method not allowed' });

  try {
    const rawBody = await readRawBody(req);
    if (isAuthorizedInboxAdmin(req)) {
      const body = rawBody ? JSON.parse(rawBody) : {};
      const limit = Math.max(1, Math.min(100, Number(body.limit || req.query?.limit || 25)));
      const processImmediately = body.processImmediately !== false;
      const listed = body.emailIds?.length
        ? body.emailIds.map((id) => ({ id, email_id: id }))
        : await listReceivedEmails(limit);
      const results = [];
      for (const item of listed) {
        const emailId = item.email_id || item.id;
        if (!emailId) continue;
        const event = {
          type: 'email.received',
          created_at: item.created_at || new Date().toISOString(),
          data: { ...item, email_id: emailId }
        };
        try {
          results.push(await ingestReceivedEmailEvent(event, { queuedBy: 'admin-sync', processImmediately }));
        } catch (error) {
          results.push({ ok: false, resendEmailId: emailId, error: error.message });
        }
      }
      return json(res, 200, { ok: true, checked: listed.length, results });
    }

    const verification = verifyResendWebhook(rawBody, req);
    if (!verification.ok) return json(res, 400, { error: 'Invalid webhook signature', reason: verification.reason || 'signature mismatch' });

    const event = JSON.parse(rawBody || '{}');
    if (event.type !== 'email.received') return json(res, 200, { ok: true, ignored: event.type || 'unknown' });
    const result = await ingestReceivedEmailEvent(event);
    return json(res, result.fetchFailed ? 202 : 200, result);
  } catch (error) {
    console.error('resend inbound processing failed', error);
    return json(res, 500, { ok: false, error: error.message });
  }
}
