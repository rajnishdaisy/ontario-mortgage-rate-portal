const DEFAULT_NOW = new Date('2026-06-06T12:00:00.000Z');
const FRESH_DAYS = 7;
const WATCH_DAYS = 21;
const APPROVAL_CONFIDENCE = 0.88;
const REVIEW_CONFIDENCE = 0.68;

function parseDate(value) {
  if (!value) return null;
  const parsed = Date.parse(value);
  return Number.isFinite(parsed) ? new Date(parsed) : null;
}

function round(value, places = 2) {
  const factor = 10 ** places;
  return Math.round(value * factor) / factor;
}

function slug(value) {
  return String(value || 'unknown')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80) || 'unknown';
}

function numberOrNull(value) {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : null;
}

function daysBetween(now, date) {
  if (!date) return null;
  return Math.max(0, Math.floor((now.getTime() - date.getTime()) / 86400000));
}

export function freshnessStatus(record, options = {}) {
  const now = options.now ? new Date(options.now) : DEFAULT_NOW;
  const effectiveDate = parseDate(record.effectiveDate);
  const expiryDate = parseDate(record.expiryDate);
  const ageDays = daysBetween(now, effectiveDate);

  if (!effectiveDate) return { status: 'undated', ageDays: null, reason: 'Missing effective date' };
  if (expiryDate && expiryDate.getTime() < now.getTime()) return { status: 'expired', ageDays, reason: 'Expired source window' };
  if (ageDays <= FRESH_DAYS) return { status: 'fresh', ageDays, reason: 'Effective within 7 days' };
  if (ageDays <= WATCH_DAYS) return { status: 'watch', ageDays, reason: 'Effective within review window' };
  return { status: 'stale', ageDays, reason: 'Older than 21 days' };
}

export function normalizeRateSource(record, options = {}) {
  const fresh = freshnessStatus(record, options);
  const fixedRates = {
    insuredRate: numberOrNull(record.insuredRate),
    insurableRate: numberOrNull(record.insurableRate),
    uninsuredRate: numberOrNull(record.uninsuredRate)
  };
  const hasNumericRate = Object.values(fixedRates).some((value) => value !== null);
  const hasVariablePricing = Boolean(record.variableDiscount || record.lenderPrimeRate);
  const missing = [];

  if (!record.lenderName) missing.push('lenderName');
  if (!record.productName) missing.push('productName');
  if (!record.effectiveDate) missing.push('effectiveDate');
  if (!record.termLabel && !record.termMonths) missing.push('term');
  if (!hasNumericRate && !hasVariablePricing) missing.push('rate');
  if (record.mortgageType === 'variable' && !record.lenderPrimeRate) missing.push('lenderPrimeRate');

  return {
    id: `normalized-${slug(record.sourceId || `${record.lenderName}-${record.productName}`)}`,
    sourceId: record.sourceId || `source-${slug(record.lenderName)}-${slug(record.productName)}`,
    lenderName: String(record.lenderName || '').trim(),
    productName: String(record.productName || '').trim(),
    province: record.province || 'Ontario',
    purpose: record.purpose || 'Purchase',
    occupancy: record.occupancy || 'Owner occupied',
    mortgageType: record.mortgageType || 'other',
    termLabel: record.termLabel || (record.termMonths ? `${record.termMonths} months` : ''),
    termMonths: numberOrNull(record.termMonths),
    insuredRate: fixedRates.insuredRate,
    insurableRate: fixedRates.insurableRate,
    uninsuredRate: fixedRates.uninsuredRate,
    variableDiscount: record.variableDiscount || null,
    lenderPrimeRate: numberOrNull(record.lenderPrimeRate),
    rateHoldDays: numberOrNull(record.rateHoldDays),
    effectiveDate: record.effectiveDate || null,
    expiryDate: record.expiryDate || null,
    sourceKind: record.sourceKind || 'demo_static',
    sourceLabel: record.sourceLabel || 'Static demo source',
    sourceReceivedAt: record.sourceReceivedAt || null,
    conditions: Array.isArray(record.conditions) ? record.conditions : [],
    policyNotes: Array.isArray(record.policyNotes) ? record.policyNotes : [],
    evidence: Array.isArray(record.evidence) ? record.evidence : [],
    freshness: fresh,
    missingFields: missing
  };
}

export function confidenceScore(normalized) {
  let score = 0.5;
  if (normalized.sourceKind?.startsWith('demo_')) score += 0.08;
  if (normalized.effectiveDate) score += 0.12;
  if (normalized.expiryDate) score += 0.06;
  if (normalized.rateHoldDays) score += 0.04;
  if (normalized.evidence.length >= 3) score += 0.12;
  if (normalized.conditions.length) score += 0.04;
  if (normalized.insuredRate !== null || normalized.insurableRate !== null || normalized.uninsuredRate !== null) score += 0.10;
  if (normalized.variableDiscount && normalized.lenderPrimeRate === null) score -= 0.15;
  if (normalized.freshness.status === 'watch') score -= 0.12;
  if (['stale', 'expired', 'undated'].includes(normalized.freshness.status)) score -= 0.28;
  score -= normalized.missingFields.length * 0.08;
  return round(Math.max(0, Math.min(1, score)), 2);
}

export function approvalDecision(normalized) {
  const confidence = confidenceScore(normalized);
  const blockers = [];
  if (normalized.missingFields.length) blockers.push(`Missing ${normalized.missingFields.join(', ')}`);
  if (['stale', 'expired', 'undated'].includes(normalized.freshness.status)) blockers.push(normalized.freshness.reason);

  if (blockers.length) {
    return { status: 'needs_review', confidence, publishable: false, reason: blockers.join('; ') };
  }
  if (confidence >= APPROVAL_CONFIDENCE && normalized.freshness.status === 'fresh') {
    return { status: 'approved', confidence, publishable: true, reason: 'Fresh complete static demo record above approval threshold' };
  }
  if (confidence >= REVIEW_CONFIDENCE) {
    return { status: 'needs_review', confidence, publishable: false, reason: 'Confidence below auto-approval threshold' };
  }
  return { status: 'rejected', confidence, publishable: false, reason: 'Confidence below review threshold' };
}

export function ingestStaticRateSources(sourceSet, options = {}) {
  const records = Array.isArray(sourceSet?.records) ? sourceSet.records : [];
  const normalized = records.map((record) => {
    const item = normalizeRateSource(record, options);
    const approval = approvalDecision(item);
    return {
      ...item,
      approvalStatus: approval.status,
      confidence: approval.confidence,
      approvalReason: approval.reason,
      publishable: approval.publishable
    };
  });

  const publishedRates = normalized
    .filter((item) => item.publishable)
    .map((item) => ({
      id: `published-${slug(item.sourceId)}-${slug(item.termLabel)}`,
      sourceId: item.sourceId,
      lenderName: item.lenderName,
      productName: item.productName,
      province: item.province,
      mortgageType: item.mortgageType,
      termLabel: item.termLabel,
      termMonths: item.termMonths,
      insuredRate: item.insuredRate,
      insurableRate: item.insurableRate,
      uninsuredRate: item.uninsuredRate,
      variableDiscount: item.variableDiscount,
      rateHoldDays: item.rateHoldDays,
      effectiveDate: item.effectiveDate,
      expiryDate: item.expiryDate,
      freshnessStatus: item.freshness.status,
      confidence: item.confidence,
      sourceLabel: item.sourceLabel,
      publicNotes: 'Approved in local static OMRP-001 demo engine only; not live lender pricing.'
    }));

  const summary = normalized.reduce((counts, item) => {
    counts.total += 1;
    counts[item.approvalStatus] = (counts[item.approvalStatus] || 0) + 1;
    counts[item.freshness.status] = (counts[item.freshness.status] || 0) + 1;
    return counts;
  }, { total: 0, approved: 0, needs_review: 0, rejected: 0, published: publishedRates.length });
  summary.published = publishedRates.length;

  return {
    ok: true,
    mode: 'static-demo-only',
    sourceSetId: sourceSet?.sourceSetId || 'unknown-demo-source-set',
    generatedAt: new Date().toISOString(),
    summary,
    approvalQueue: normalized,
    publishedRates,
    safety: {
      usesRealCredentials: false,
      scrapesGatedPortals: false,
      publishesLiveRates: false,
      note: 'All records are static/demo fixtures for local workflow verification.'
    }
  };
}
