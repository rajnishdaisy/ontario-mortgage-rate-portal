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

function normalizeEmail(value = '') {
  return String(value || '').trim().toLowerCase();
}

function validPassword(value = '') {
  return typeof value === 'string' && value.length >= 6 && value.length <= 128;
}

async function createConfirmedUser({ email, password }) {
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
      email_confirm: true,
      user_metadata: {
        requested_role: 'broker',
        created_from: 'omrp_public_registration'
      }
    })
  });
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

export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') return json(res, 405, { ok: false, error: 'Method not allowed' });
    const { email: rawEmail, password } = req.body || {};
    const email = normalizeEmail(rawEmail);
    if (!/^\S+@\S+\.\S+$/.test(email)) return json(res, 400, { ok: false, error: 'Enter a valid email address.' });
    if (!validPassword(password)) return json(res, 400, { ok: false, error: 'Password must be 6-128 characters.' });
    const user = await createConfirmedUser({ email, password });
    return json(res, 200, { ok: true, userId: user.id || user.user?.id || null, email });
  } catch (error) {
    console.error('registration failed', error?.message || error);
    return json(res, error.statusCode || 500, { ok: false, error: error.message || 'Registration failed' });
  }
}
