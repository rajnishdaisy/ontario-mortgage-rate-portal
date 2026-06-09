const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = Number(process.env.OMRP_REGISTRATION_MAX_ATTEMPTS || '5');
const attempts = globalThis.__omrpRegistrationAttempts || new Map();
globalThis.__omrpRegistrationAttempts = attempts;

function json(res, status, body) {
  res.setHeader('Content-Type', 'application/json');
  return res.status(status).json(body);
}

function supabaseBase() {
  const value = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!value) throw new Error('Missing required env var: SUPABASE_URL or NEXT_PUBLIC_SUPABASE_URL');
  return value.replace(/\/$/, '');
}

function anonKey() {
  return process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
}

function serviceKey() {
  const value = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!value) throw new Error('Missing required env var: SUPABASE_SERVICE_ROLE_KEY');
  return value;
}

function normalizeEmail(value = '') {
  return String(value || '').trim().toLowerCase();
}

function validPassword(value = '') {
  return typeof value === 'string' && value.length >= 8 && value.length <= 128;
}

function clientIp(req) {
  return String(req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || req.socket?.remoteAddress || '')
    .split(',')[0]
    .trim() || 'unknown';
}

function assertRateLimit(email, req) {
  const key = `${clientIp(req)}:${email}`;
  const now = Date.now();
  const row = attempts.get(key) || { count: 0, resetAt: now + WINDOW_MS };
  if (row.resetAt <= now) {
    row.count = 0;
    row.resetAt = now + WINDOW_MS;
  }
  row.count += 1;
  attempts.set(key, row);
  if (row.count > MAX_ATTEMPTS) {
    const err = new Error('Too many registration attempts. Try again later.');
    err.statusCode = 429;
    throw err;
  }
}

function registrationAllowed(email, inviteCode = '') {
  const configuredInvite = process.env.OMRP_REGISTRATION_INVITE_CODE || '';
  if (configuredInvite && inviteCode !== configuredInvite) return false;
  const allowlist = String(process.env.OMRP_REGISTRATION_ALLOWED_EMAILS || '')
    .split(/[\s,;]+/)
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);
  if (allowlist.length && !allowlist.includes(email)) return false;
  const domains = String(process.env.OMRP_REGISTRATION_ALLOWED_DOMAINS || '')
    .split(/[\s,;]+/)
    .map((item) => item.trim().replace(/^@/, '').toLowerCase())
    .filter(Boolean);
  const domain = email.split('@')[1] || '';
  if (domains.length && !domains.includes(domain)) return false;
  return true;
}

async function parseAuthResponse(response) {
  const text = await response.text();
  let payload = {};
  try { payload = text ? JSON.parse(text) : {}; } catch { payload = { message: text }; }
  if (!response.ok) {
    const message = String(payload.msg || payload.message || payload.error || text || 'Registration failed');
    if (/already|exists|registered|duplicate/i.test(message)) {
      const err = new Error('Account already exists. Use Login with your password.');
      err.statusCode = 409;
      throw err;
    }
    const err = new Error(message);
    err.statusCode = response.status;
    throw err;
  }
  return payload;
}

async function signupWithPublicAuth({ email, password }) {
  const key = anonKey();
  if (!key) return null;
  const response = await fetch(`${supabaseBase()}/auth/v1/signup`, {
    method: 'POST',
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email,
      password,
      data: {
        requested_role: 'broker',
        created_from: 'omrp_public_registration'
      }
    })
  });
  return parseAuthResponse(response);
}

async function createUnconfirmedUser({ email, password }) {
  const key = serviceKey();
  const response = await fetch(`${supabaseBase()}/auth/v1/admin/users`, {
    method: 'POST',
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email,
      password,
      email_confirm: process.env.OMRP_AUTO_CONFIRM_SIGNUPS === 'true',
      user_metadata: {
        requested_role: 'broker',
        created_from: 'omrp_public_registration'
      }
    })
  });
  return parseAuthResponse(response);
}

export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') return json(res, 405, { ok: false, error: 'Method not allowed' });
    const { email: rawEmail, password, inviteCode } = req.body || {};
    const email = normalizeEmail(rawEmail);
    if (!/^\S+@\S+\.\S+$/.test(email)) return json(res, 400, { ok: false, error: 'Enter a valid email address.' });
    if (!validPassword(password)) return json(res, 400, { ok: false, error: 'Password must be 8-128 characters.' });
    assertRateLimit(email, req);
    if (!registrationAllowed(email, inviteCode || req.headers['x-registration-invite'])) {
      return json(res, 403, { ok: false, error: 'Registration is invite-only for this portal.' });
    }
    const user = await signupWithPublicAuth({ email, password }) || await createUnconfirmedUser({ email, password });
    return json(res, 200, {
      ok: true,
      userId: user.id || user.user?.id || null,
      email,
      emailConfirmationRequired: process.env.OMRP_AUTO_CONFIRM_SIGNUPS !== 'true'
    });
  } catch (error) {
    console.error('registration failed', error?.message || error);
    return json(res, error.statusCode || 500, { ok: false, error: error.message || 'Registration failed' });
  }
}
