import json
import pathlib
import re
import datetime

base = pathlib.Path(__file__).resolve().parents[1]
source_path = base / '.tmp' / 'resend-inspect-100-fixed2.json'
items = json.loads(source_path.read_text())['inspected']

rate_keywords = re.compile(r'(rate sheet|ratesheet|broker\s*rate|pricing desk|brokeredge|mortgageboss|mortgagebossratesheet|rtp broker|prime rate|qualifying rate)', re.I)
noise_terms = re.compile(r'\b(bank statement|credit report|accepted offer|documents|passport|driver|notice of assessment|t2|equifax|loan document|insurance|quote|application|subway|payout|incorporation|zip|business financing options)\b', re.I)

review = []
rejected = []
for email in items:
    attachments = email.get('attachments') or []
    names = '; '.join(att.get('filename', '') or '' for att in attachments)
    blob = ' '.join([email.get('subject') or '', email.get('text') or '', email.get('html_text') or '', names])
    is_rate = bool(rate_keywords.search(blob))
    is_noise = bool(noise_terms.search(blob)) and not is_rate
    entry = {
        'email_id': email.get('email_id'),
        'received_at': email.get('created_at'),
        'from': email.get('from'),
        'to': email.get('to'),
        'subject': email.get('subject'),
        'attachments': [
            {
                'filename': att.get('filename'),
                'content_type': att.get('content_type'),
                'size': att.get('size')
            }
            for att in attachments
        ]
    }
    if is_rate:
        review.append(entry)
    elif is_noise or attachments:
        rejected.append({**entry, 'reason': 'deal/client document or non-rate attachment'})

seen_attachments = set()
candidate_documents = []
for email in review:
    for attachment in email['attachments']:
        key = (attachment['filename'], attachment['size'])
        if key in seen_attachments:
            continue
        seen_attachments.add(key)
        filename = attachment['filename'] or ''
        document_type = 'rate_sheet' if re.search(r'rate|MortgageBOSS|RTP', filename, re.I) else 'policy_or_template'
        lender = 'Unknown'
        status = 'needs_review'
        if 'RTP Broker' in filename:
            lender = 'TD Canada Trust'
            status = 'extracted'
        elif re.search(r'BMO|BrokerEdge', filename, re.I):
            lender = 'BMO'
            status = 'organized_as_policy_template'
        elif 'MortgageBOSS' in filename:
            lender = 'MortgageBOSS multi-lender sheet'
        candidate_documents.append({
            'lender': lender,
            'document_type': document_type,
            'status': status,
            **attachment,
            'source_received_at': email['received_at'],
            'source_from': email['from'],
            'source_to': email['to'],
            'source_subject': email['subject']
        })

previews = []
for email in items:
    for attachment in email.get('attachments') or []:
        if 'RTP Broker' in (attachment.get('filename') or ''):
            previews.append(attachment.get('preview') or '')
preview = previews[0] if previews else ''

published_rate_rows = []
for line in preview.splitlines():
    if not re.match(r'^[1-5] Year Fixed,', line):
        continue
    parts = line.split(',')
    try:
        tier_values = [float(parts[index]) for index in range(2, 6)]
        published_rate_rows.append({
            'lender_name': 'TD Canada Trust',
            'product_name': 'TD Home Equity FlexLine Fixed Rate Term Portion',
            'province': 'Ontario',
            'purpose': 'HELOC / Term Portion',
            'occupancy': 'Owner occupied; rental adjustment noted',
            'mortgage_type': 'fixed',
            'term_label': parts[0],
            'term_months': int(parts[0].split()[0]) * 12,
            'posted_rate': round(float(parts[1]) * 100, 3),
            'ltv_or_amount_bucket_rates': [
                {'bucket': '<$299,999', 'rate': round(tier_values[0] * 100, 3)},
                {'bucket': '$300,000-$499,999', 'rate': round(tier_values[1] * 100, 3)},
                {'bucket': '$500,000-$749,999', 'rate': round(tier_values[2] * 100, 3)},
                {'bucket': '>$750,000', 'rate': round(tier_values[3] * 100, 3)}
            ],
            'insured_rate': None,
            'insurable_rate': round(min(tier_values) * 100, 3),
            'uninsured_rate': round(min(tier_values) * 100, 3),
            'compensation_bps': int(float(parts[6])),
            'effective_date': '2026-01-30',
            'source_label': 'RTP Broker Rate Sheet 01-30-2026.xlsx',
            'confidence': 0.88,
            'public_notes': 'Dry-run extraction from spreadsheet preview. Amount-tiered FlexLine rates; add 5 bps for amortizations greater than 25 years where applicable; add 15 bps for rental properties per sheet note.'
        })
    except (ValueError, IndexError):
        continue

policy_notes = [
    {
        'lender_name': 'BMO',
        'source_label': 'BMO BrokerEdge Pricing Desk Exception Template 20260223.xlsx',
        'effective_date': '2026-02-23',
        'note_type': 'pricing_exception_process',
        'status': 'organized_as_policy_template',
        'summary': 'Template for broker pricing desk exception requests. Requires application #, underwriter email, BDM email, closing date, requested rate, mortgage amount, term, product, status, program, cashback, and buydown willingness. Submit to BrokerEdgePricingDesk@bmo.com and cc BDM.',
        'confidence': 0.93
    }
]



# Multi-lender MortgageBOSS data already normalized in the current website from the received
# MortgageBOSS rate sheet. Keep this as the website organization layer until the PDF parser
# can safely re-extract every row from the source PDF.
mortgageboss_rows = {
    'B2B Bank': {'sheet_date': '5/20', 'insured_5yr': '4.44', 'insurable_75_80_5yr': '4.84', 'uninsured_refi_25yr_5yr': '4.84', 'variable_insured': 'P-0.65'},
    'BMO': {'sheet_date': '3/27', 'insured_5yr': '4.69', 'insurable_75_80_5yr': '5.09', 'uninsured_refi_25yr_5yr': '5.09', 'variable_insured': 'P-0.33'},
    'CMLS': {'sheet_date': '5/30', 'insured_5yr': '4.39', 'insurable_75_80_5yr': '4.64', 'uninsured_refi_25yr_5yr': '4.84', 'variable_insured': 'P-0.75'},
    'First National': {'sheet_date': '5/23', 'insured_5yr': '4.49', 'insurable_75_80_5yr': '4.79', 'uninsured_refi_25yr_5yr': '4.84', 'variable_insured': 'P-0.75'},
    'Highclere': {'sheet_date': '5/16', 'insured_5yr': '4.49', 'insurable_75_80_5yr': '4.74', 'uninsured_refi_25yr_5yr': None, 'variable_insured': 'P-0.75'},
    'MERIX': {'sheet_date': '5/20', 'insured_5yr': '4.49', 'insurable_75_80_5yr': '4.69', 'uninsured_refi_25yr_5yr': '4.84', 'variable_insured': 'P-0.75'},
    'Manulife Bank': {'sheet_date': '4/9', 'insured_5yr': '4.39', 'insurable_75_80_5yr': '4.69', 'uninsured_refi_25yr_5yr': None, 'variable_insured': 'P-0.70'},
    'MCAP': {'sheet_date': '5/20', 'insured_5yr': '4.49', 'insurable_75_80_5yr': '4.69', 'uninsured_refi_25yr_5yr': '4.84', 'variable_insured': 'P-0.75'},
    'Neo': {'sheet_date': '5/26', 'insured_5yr': '4.39', 'insurable_75_80_5yr': '4.64', 'uninsured_refi_25yr_5yr': '4.89', 'variable_insured': 'P-0.85'},
    'RFA': {'sheet_date': '5/16', 'insured_5yr': '4.49', 'insurable_75_80_5yr': '4.69', 'uninsured_refi_25yr_5yr': '4.84', 'variable_insured': 'P-0.75'},
    'RMG': {'sheet_date': '5/20', 'insured_5yr': '4.49', 'insurable_75_80_5yr': '4.69', 'uninsured_refi_25yr_5yr': '4.84', 'variable_insured': 'P-0.75'},
    'Scotiabank': {'sheet_date': '5/12', 'insured_5yr': '4.34', 'insurable_75_80_5yr': '4.59', 'uninsured_refi_25yr_5yr': '4.59', 'variable_insured': 'P-0.70'},
    'Strive': {'sheet_date': '5/16', 'insured_5yr': '4.49', 'insurable_75_80_5yr': '4.69', 'uninsured_refi_25yr_5yr': '4.84', 'variable_insured': 'P-0.75'},
    'TD Canada Trust': {'sheet_date': '5/29', 'insured_5yr': '4.44', 'insurable_75_80_5yr': '4.74', 'uninsured_refi_25yr_5yr': '4.74', 'variable_insured': 'P-0.61'},
    'Desjardins': {'sheet_date': '5/1', 'insured_5yr': '4.19', 'insurable_75_80_5yr': '4.34', 'uninsured_refi_25yr_5yr': '4.34', 'variable_insured': 'P-0.55'},
    'DUCA Credit Union': {'sheet_date': '5/26', 'insured_5yr': '4.39', 'insurable_75_80_5yr': '4.69', 'uninsured_refi_25yr_5yr': '4.69', 'variable_insured': 'P-0.75'},
}

lender_rate_matrix = [
    {
        'lender_name': lender_name,
        'source_label': 'MortgageBOSSRateSheet.pdf',
        'source_status': 'received_multi_lender_pdf_needs_parser_review',
        'sheet_date': row['sheet_date'],
        'rates': row,
        'best_visible_fixed_5yr': min(
            [float(value) for key, value in row.items() if key.endswith('5yr') and value not in (None, '-')]
        )
    }
    for lender_name, row in mortgageboss_rows.items()
]

for row in published_rate_rows:
    match = next((item for item in lender_rate_matrix if item['lender_name'] == row['lender_name']), None)
    detail = {
        'term_label': row['term_label'],
        'best_rate': row['uninsured_rate'] or row['insurable_rate'] or row['insured_rate'],
        'source_label': row['source_label'],
        'status': 'extracted_from_spreadsheet'
    }
    if match:
        match.setdefault('extracted_term_rows', []).append(detail)
    else:
        lender_rate_matrix.append({
            'lender_name': row['lender_name'],
            'source_label': row['source_label'],
            'source_status': 'extracted_from_spreadsheet',
            'sheet_date': row['effective_date'],
            'rates': {},
            'best_visible_fixed_5yr': row['uninsured_rate'] or row['insurable_rate'] or row['insured_rate'],
            'extracted_term_rows': [detail]
        })

recommended_website_lanes = [
    {'lane': 'Published-ready rows', 'purpose': 'Rows with clear lender, product, term, rate, source and date.', 'items': len(published_rate_rows)},
    {'lane': 'Lender matrix', 'purpose': 'One lender per row/card, showing visible 5-year insured/conventional/variable rates and source.', 'items': len(lender_rate_matrix)},
    {'lane': 'Source documents', 'purpose': 'Keep every attachment traceable with status: extracted, needs parser review, template, or rejected.', 'items': len(candidate_documents)},
    {'lane': 'Policy/templates', 'purpose': 'Useful non-rate documents such as BMO pricing exception templates.', 'items': len(policy_notes)},
    {'lane': 'Rejected/noise', 'purpose': 'Deal docs and unrelated files stay out of public rates but remain auditable in review output.', 'items': len(rejected)},
]

summary = {
    'generated_at': datetime.datetime.utcnow().replace(microsecond=0).isoformat() + 'Z',
    'mode': 'dry_run_static',
    'inbox_checked': len(items),
    'attachments_seen': sum(len(email.get('attachments') or []) for email in items),
    'candidate_emails': len(review),
    'unique_candidate_documents': len(candidate_documents),
    'extracted_rate_rows': len(published_rate_rows),
    'noise_or_deal_document_emails': len(rejected),
    'standard_inbox': 'rates@luniaontua.resend.app',
    'actual_recent_recipient_matches': sum(1 for email in items if 'rates@luniaontua.resend.app' in (email.get('to') or '').lower()),
    'note': 'Dry run uses emails visible in the current Resend receiving feed. Recent messages are mostly @docs.sicapital.ca, not rates@luniaontua.resend.app.'
}

output = {
    'summary': summary,
    'candidate_documents': candidate_documents,
    'published_rate_rows_dry_run': published_rate_rows,
    'policy_notes_dry_run': policy_notes,
    'lender_rate_matrix': lender_rate_matrix,
    'recommended_website_lanes': recommended_website_lanes,
    'review_queue': review,
    'rejected_noise_sample': rejected[:25]
}

out_path = base / 'data' / 'rate-sheet-dry-run.json'
out_path.write_text(json.dumps(output, indent=2) + '\n')
print(json.dumps(summary, indent=2))
print(f'wrote {out_path}')
