import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { ingestStaticRateSources } from '../lib/demo-rate-ingestion-engine.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const demoSourcePath = path.join(__dirname, '..', 'data', 'demo-rate-sources.json');

function json(res, status, body) {
  res.setHeader('Content-Type', 'application/json');
  return res.status(status).json(body);
}

function loadDemoSources() {
  return JSON.parse(fs.readFileSync(demoSourcePath, 'utf8'));
}

export default async function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'POST') {
    return json(res, 405, { ok: false, error: 'Method not allowed' });
  }

  const result = ingestStaticRateSources(loadDemoSources(), {
    now: req.query?.now || req.body?.now || undefined
  });

  return json(res, 200, result);
}
