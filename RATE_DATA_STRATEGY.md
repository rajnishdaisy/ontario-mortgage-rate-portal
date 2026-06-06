# Agent Rate Desk — rate data and business model strategy

## What public research shows about Lender Spotlight / Lendesk

Public Lender Spotlight copy positions the product as a Canadian broker database for:

- lender rates and policies
- product comparison
- alternative lending products
- scenario-building tools
- AI search over 7,000+ policies/answers
- lender visibility, BDM promotion, policy accuracy, and program spotlighting

The Lender Spotlight terms are more revealing than the marketing page:

- LenderSpotlight.ca provides a tracking service for mortgage products, guidelines, and rates.
- Users search a database of third-party mortgage products from various providers/brokers, called Vendors.
- There is a free Basic version and enhanced Platinum/add-on services.
- Add-ons include AI Tool and Scenarios.
- Lendesk offers an Alternative Lending Product that allows alternative lenders to upload their own interest rates and policy information.
- The terms state that mortgage product information is provided directly by Vendors as “Vendor Content,” not by LenderSpotlight.ca.
- The Website/Service may be free for users, but LenderSpotlight may receive fees for request forms, referrals, vendors, partner organizations, advertising, and subscriptions.

Technical inspection of the public Lender Spotlight app shows:

- The frontend uses internal application API routes like `/api/products`, `/api/lenders/products`, `/api/guidelines/tokens`, and brokerage product routes.
- Guidelines/search appears to use Algolia with a short-lived token from `/api/guidelines/tokens`.
- This is not evidence of a public lender-rate API. It shows their own backend and search index serving normalized product/rate/policy data to authenticated users.
- The site exposes routes for rates, scenarios, lenders, guidelines, alternative lending, AI, settings, subscriptions, upgrade, and brokerage/team documents.

## Likely rate access model

The most likely model is not one magic API. It is a managed data network:

1. **Vendor/lender supplied data**
   - Lenders and alternative lenders provide rates, policies, documents, and contacts directly.
   - Alternative lenders can upload and maintain their own rates/policies.

2. **Internal admin/data operations**
   - Data is normalized into products, lender programs, guidelines, and policies.
   - Staff or lender admins likely review/update content to maintain accuracy.

3. **Search/index layer**
   - Policies/guidelines are indexed for fast search and AI retrieval.
   - Lender/product data is served from internal API endpoints.

4. **Brokerage/team overlays**
   - Brokerage-specific statuses, exclusive rates, team documents, and settings indicate private team-level data on top of public/general lender data.

5. **Paid visibility and referral economics**
   - Lenders pay or participate to be visible when brokers search.
   - Featured lender / advertising / request-form referral economics are part of the model.

## Business model reverse-engineered from public sources

Lender Spotlight appears to monetize from multiple sides:

### Broker side
- Basic/free access for users.
- Platinum/enhanced subscription.
- Paid add-ons: AI Tool, Scenarios.
- Bundles with other Lendesk/Finmo products.

### Lender side
- Featured lender listings / product spotlighting.
- Alternative Lending Product subscription for lenders uploading their own rates/policies.
- BDM/program visibility.
- Insights and feedback on broker searches.
- Advertising/vendor placement.

### Referral side
- Terms allow fees for submitting request forms or making referrals to vendors/partners.

### Brokerage/team side
- Brokerage documents, statuses, exclusive rates, users, subscriptions, and team settings suggest team-level paid controls.

## What this means for us

Do not depend on reverse-engineering or scraping their private APIs. That creates legal, trust, and reliability risk.

Build a legitimate data pipeline with four sources:

1. **Manual/admin rate sheet intake**
   - Upload PDF/XLS/email rate sheets.
   - Parse into normalized product/rate tables.
   - Require admin approval before publishing.
   - Show source, effective date, and stale warning.

2. **Lender/vendor portal**
   - Give lenders or BDMs a simple page to submit/update rates, policy notes, docs, and contacts.
   - Start manually approved; later let trusted lenders self-publish.

3. **Brokerage/private overlays**
   - Allow brokerages to add exclusive rates, compensation notes, internal policies, and preferred lender tags.
   - This becomes the Pro/Brokerage moat.

4. **Broker kit/document search**
   - Index PDFs, policy docs, forms, and lender kits.
   - Make searchable by lender, program, borrower scenario, and province.

## Recommended MVP wedge

Position the product as:

> The affordable rate + policy desk agents open before submitting anywhere.

### Free
- Rate board
- Lender directory
- Policy and broker kit search
- Stale-rate/source labels

### Agent Pro — target $9/month
- Saved scenarios
- Rate alerts
- Lender comparison
- Private notes/favourites
- Checklist generator
- AI policy search later

### Brokerage
- Team users
- Exclusive/private rates
- Internal policy overlays
- Approval workflow
- Audit trail
- Lender/vendor submission portal

## Next build priorities

1. Replace demo data with normalized `lenders`, `products`, `rates`, `policy_notes`, and `rate_sources` tables.
2. Add admin rate-sheet upload/import workflow.
3. Add source/effective-date/stale labels everywhere rates appear.
4. Add lender/vendor submission form for BDMs.
5. Add searchable policy/broker kit index.
6. Add $9 Agent Pro waitlist or checkout only after data quality is credible.

## Key principle

Rates are not just data. The real product is **trust + freshness + workflow**:

- Who supplied this rate?
- When was it effective?
- Has it expired?
- What policies/conditions apply?
- Which lender fits this scenario?
- What documents do I need?
- Who do I contact?
