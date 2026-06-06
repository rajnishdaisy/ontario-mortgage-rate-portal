import { processQueuedRateEmails } from './resend-inbound.js';

function json(res, status, body) {
  res.setHeader('Content-Type', 'application/json');
  return res.status(status).json(body);
}

function getHeader(req, name) {
  const value = req.headers[name.toLowerCase()];
  return Array.isArray(value) ? value[0] : value;
}

function isAuthorizedCron(req) {
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret) return true;
  return getHeader(req, 'authorization') === `Bearer ${cronSecret}`;
}

export default async function handler(req, res) {
  if (!['GET', 'POST'].includes(req.method)) return json(res, 405, { error: 'Method not allowed' });
  if (!isAuthorizedCron(req)) return json(res, 401, { error: 'Unauthorized cron request' });

  try {
    const limit = Number(req.query?.limit || process.env.RATE_AI_CRON_BATCH_LIMIT || 10);
    const result = await processQueuedRateEmails({ limit });
    return json(res, 200, { ok: true, ...result });
  } catch (error) {
    console.error('rate updates cron failed', error);
    return json(res, 500, { ok: false, error: error.message });
  }
}
