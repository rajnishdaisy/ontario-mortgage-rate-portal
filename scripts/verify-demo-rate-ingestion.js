import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { ingestStaticRateSources } from '../lib/demo-rate-ingestion-engine.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const sourcePath = path.join(__dirname, '..', 'data', 'demo-rate-sources.json');
const sourceSet = JSON.parse(fs.readFileSync(sourcePath, 'utf8'));
const result = ingestStaticRateSources(sourceSet, { now: '2026-06-06T12:00:00.000Z' });

const failures = [];
if (!result.ok) failures.push('result.ok is false');
if (result.mode !== 'static-demo-only') failures.push('mode is not static-demo-only');
if (result.safety.usesRealCredentials || result.safety.scrapesGatedPortals || result.safety.publishesLiveRates) failures.push('safety flags are not all false');
if (result.summary.total !== 4) failures.push(`expected 4 normalized records, got ${result.summary.total}`);
if (result.summary.approved !== 2) failures.push(`expected 2 approved records, got ${result.summary.approved}`);
if (result.summary.published !== 2) failures.push(`expected 2 demo published records, got ${result.summary.published}`);
if (!result.approvalQueue.some((item) => item.lenderName === 'Sandbox Credit Union' && item.approvalStatus === 'needs_review' && item.freshness.status === 'expired')) failures.push('stale/expired sample was not held for review');
if (!result.approvalQueue.some((item) => item.lenderName === 'Incomplete Demo Lender' && item.approvalStatus === 'needs_review' && item.missingFields.includes('lenderPrimeRate'))) failures.push('incomplete variable sample was not held for review');

if (failures.length) {
  console.error(JSON.stringify({ ok: false, failures, summary: result.summary }, null, 2));
  process.exit(1);
}

console.log(JSON.stringify({
  ok: true,
  summary: result.summary,
  publishedRates: result.publishedRates.map((item) => ({ lenderName: item.lenderName, termLabel: item.termLabel, confidence: item.confidence })),
  heldForReview: result.approvalQueue.filter((item) => item.approvalStatus === 'needs_review').map((item) => ({ lenderName: item.lenderName, reason: item.approvalReason }))
}, null, 2));
