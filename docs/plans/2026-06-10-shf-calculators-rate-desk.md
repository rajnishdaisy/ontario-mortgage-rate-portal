# SHF Calculators in Rate Desk Portal Implementation Plan

> **For Hermes:** Use subagent-driven-development skill to implement this plan task-by-task.

**Goal:** Port every calculator from `/root/projects/github/simple-home-financing` into `/root/projects/github/ontario-mortgage-rate-portal` as an internal broker calculator suite using the existing Rate Desk colour scheme, density, navigation, and operational theme.

**Architecture:** Keep the Rate Desk as a no-build static portal: plain HTML/CSS/JS inside `index.html`, with pure calculator formulas extracted into a small testable JS module under `lib/`. Add a new `#calculators` route to the existing page router, render a calculator hub plus one in-page calculator workspace, and wire selected calculators to current lowest-first rate-board rows where useful.

**Tech Stack:** Static HTML/CSS/vanilla JS, Node syntax/unit tests, existing Rate Desk CSS variables (`--green`, `--accent`, `--surface`, `--surface-strong`, `--line`, `--text`, `--muted`), existing hash navigation and `showPage()` route system.

---

## Source Inventory Reviewed

Source repo: `/root/projects/github/simple-home-financing`.
Target repo: `/root/projects/github/ontario-mortgage-rate-portal`.

### Calculator pages to port

1. `src/pages/MortgagePaymentCalc.jsx` — purchase price/down payment/rate/amortization to monthly payment.
2. `src/pages/AffordabilityCalc.jsx` — annual income/monthly debts/down payment/rate to estimated purchase affordability.
3. `src/pages/MinimumIncomeCalc.jsx` — purchase price/rate/down payment/amortization/taxes/heat/condo/debts/rental/interest-only to required income.
4. `src/pages/PreApprovalCalc.jsx` — borrower + co-applicant income/debts/down payment/rate to pre-approval amount.
5. `src/pages/BiWeeklyCalc.jsx` — monthly vs accelerated bi-weekly payoff and savings.
6. `src/pages/AmortizationSchedule.jsx` — amortization table/chart from principal/rate/amortization.
7. `src/pages/LandTransferCalc.jsx` — Ontario + Toronto LTT with first-time buyer rebate.
8. `src/pages/ClosingCostCalc.jsx` — closing cost rollup including LTT, legal, appraisal, title insurance, adjustments.
9. `src/pages/CMHCCalc.jsx` — default insurance premium from purchase price/down payment.
10. `src/pages/RefinanceCalc.jsx` — current rate/new rate/balance/remaining years savings.
11. `src/pages/HELOCCalc.jsx` — available HELOC/equity room from value and mortgage balance.
12. `src/pages/MortgagePenaltyCalc.jsx` — variable 3-month-interest and fixed IRD-style penalty estimate.
13. `src/pages/SelfEmployedCalc.jsx` — BFS add-backs and deposit-based income estimate.
14. `src/pages/RentalCashflowCalc.jsx` — rent, financing, taxes, insurance to cashflow/DSCR-like investment view.
15. `src/pages/DownPaymentCalc.jsx` — minimum down payment and savings timeline.
16. `src/pages/RentVsBuyCalc.jsx` — rent vs buy equity/cost comparison.
17. `src/pages/GDSTDSCalc.jsx` — GDS/TDS ratio with optional stress test, co-applicant income, rental income, taxes/heat/condo/debts.
18. `src/pages/PropertyTaxCalc.jsx` — city property-tax estimate using SHF city-rate table.
19. `src/pages/HomeValueCalc.jsx` — appreciation + renovations to estimate current value/equity.
20. `src/pages/IncomeTaxCalc.jsx` — Ontario/federal 2024 income tax and RRSP savings estimate.
21. `src/pages/GSTHSTCalc.jsx` — new-construction HST and federal/Ontario new housing rebate.
22. `src/pages/MortgageComparisonTool.jsx` — multi-offer payment/interest/prepayment comparison.

### Source formula module already available

`/root/projects/github/simple-home-financing/src/lib/calculatorMath.js` contains pure functions worth reusing/adapting:

- `monthlyPayment(principal, annualRate, years)`
- `cmhcPremium(purchasePrice, downPayment)`
- `minimumDownPayment(purchasePrice)`
- `gdsRatio(monthlyMortgage, monthlyTax, monthlyHeating, grossMonthlyIncome)`
- `tdsRatio(monthlyMortgage, monthlyTax, monthlyHeating, otherMonthlyDebts, grossMonthlyIncome)`
- `stressTestRate(contractRate)`
- `ontarioLTT(price)`
- `torontoLTT(price)`
- `ontarioFTHBRebate(ontarioTax)`
- `paymentBreakdown(loanAmount, annualRate, years, paymentNumber)`

### Source tests already available

`/root/projects/github/simple-home-financing/src/tests/calculatorMath.test.js` validates core math. Port these into the Rate Desk repo as Node tests before porting UI.

### Target app integration points reviewed

- Nav lives around `index.html:5886-5893`.
- Current visible routes: Dashboard, Uploads, Rate Board, AI Review, Broker Kits, Directory.
- Router state lives around `index.html:7681-7688` (`pageNavLinks`, `pageRoutes`, `pageGroups`).
- Route switching lives around `index.html:8293` (`showPage`).
- The Rate Board is `#best-rates`; it is already lowest-first and should remain that way.
- The Rate Desk is a static/no-build app; do not add React/Vite just for calculators.

---

## Design Direction

### Navigation

Add one new primary nav item:

```html
<a href="#calculators"><span>04</span> Calculators</a>
```

Then renumber existing items:

- 01 Dashboard
- 02 Uploads
- 03 Rate Board
- 04 Calculators
- 05 AI Review
- 06 Broker Kits
- 07 Directory

Do not create 22 sidebar nav links. Keep the portal efficient. Inside `#calculators`, use compact category tabs/search.

### Calculator categories

Use operational broker categories:

1. **Qualify** — Affordability, Minimum Income, Pre-Approval, GDS/TDS, Income Tax, Self-Employed.
2. **Payment** — Mortgage Payment, Bi-Weekly, Amortization, CMHC.
3. **Purchase Costs** — Down Payment, Land Transfer, Closing Costs, GST/HST, Property Tax.
4. **Equity / Refi** — Refinance, HELOC, Penalty, Home Value.
5. **Investor / Compare** — Rental Cashflow, Rent vs Buy, Mortgage Comparison.

### Theme

Use Rate Desk style, not SHF public-site style:

- Dark green/nav shell, compact cards, dense fields.
- Use `--green`, `--accent`, `--accent-strong`, `--surface`, `--surface-strong`, `--line`, `--muted`.
- Avoid SHF gradients, public CTA sections, framer-motion, lucide icons, Recharts, shadcn classes.
- Use existing button classes: `.primary-button`, `.secondary-button`, `.icon-button`.
- Use existing form primitives: `input`, `select`, `textarea`, `.form-grid`, `.compact-form-grid`, `.badge`, `.source-chip`.

### Rate Desk-specific upgrades

- Default interest-rate fields to the current lowest relevant Rate Board rate where possible.
- Add a small “Use lowest live rate” button in calculators with rate inputs.
- Add “Stress-test” toggles where qualifying calculators use rate.
- Keep results broker-facing: monthly payment, qualifying rate, GDS/TDS, cash required, net equity, lender-note style caveats.
- Add compliance note: estimates only; confirm insurer/lender guidelines before advice.

---

## Task 1: Add calculator math module and tests

**Objective:** Bring SHF formula coverage into the Rate Desk repo before UI work.

**Files:**
- Create: `lib/calculator-math.js`
- Create: `scripts/test-calculator-math.js`
- Modify: `package.json`

**Step 1: Create `lib/calculator-math.js`**

Port the pure SHF functions first:

- `monthlyPayment`
- `cmhcPremium`
- `minimumDownPayment`
- `gdsRatio`
- `tdsRatio`
- `stressTestRate`
- `ontarioLTT`
- `torontoLTT`
- `ontarioFTHBRebate`
- `paymentBreakdown`

Then add pure helpers needed by the remaining pages:

- `acceleratedBiWeeklyComparison`
- `closingCostEstimate`
- `helocRoom`
- `mortgagePenaltyEstimate`
- `selfEmployedIncomeEstimate`
- `rentalCashflowEstimate`
- `rentVsBuyEstimate`
- `propertyTaxEstimate`
- `homeValueEstimate`
- `incomeTaxEstimateOntario`
- `hstNewHousingEstimate`
- `compareMortgageOffers`

**Step 2: Create `scripts/test-calculator-math.js`**

Use Node `assert/strict`, not a new test framework. Import every exported function and assert known examples from the SHF test file plus edge cases:

- monthly payment returns 0 for bad inputs.
- CMHC premium returns 0 at 20% down.
- Minimum down payment is tiered correctly at $500k, $800k, and over $1M.
- GDS/TDS returns decimal ratios.
- Stress test is `max(5.25, contract + 2)`.
- Ontario/Toronto LTT and rebate are sane.
- New helper functions produce positive expected outputs and no `NaN`.

**Step 3: Add test script**

Modify `package.json`:

```json
"test:calculators": "node scripts/test-calculator-math.js"
```

**Step 4: Verify**

Run:

```bash
npm run check
npm run test:calculators
```

Expected: both pass.

**Step 5: Commit**

```bash
git add package.json lib/calculator-math.js scripts/test-calculator-math.js
git commit -m "feat: add calculator math module"
```

---

## Task 2: Add calculator route shell to Rate Desk

**Objective:** Create the portal surface without calculator internals yet.

**Files:**
- Modify: `index.html`

**Step 1: Add sidebar nav item**

Insert `#calculators` after Rate Board and renumber existing items.

**Step 2: Add route to JS router**

Update:

```js
const pageRoutes = ["dashboard", "uploads", "best-rates", "calculators", "admin-inbox", "resources", "lenders", ...];
```

Update `pageGroups`:

```js
calculators: [document.querySelector("#calculators")],
```

**Step 3: Add empty calculator section**

Insert after `#best-rates`:

```html
<section class="band calculator-desk" id="calculators">
  <div class="section-heading calculator-heading">
    <div>
      <p class="eyebrow">Broker calculators</p>
      <h3>Qualify, price, and compare scenarios.</h3>
      <p class="section-copy">SHF calculator logic rebuilt for the Rate Desk theme with live-rate defaults from the lowest-first board.</p>
    </div>
    <div class="desk-badges"><span>Qualify</span><span>Payment</span><span>Costs</span><span>Refi</span></div>
  </div>
  <div id="calculatorApp"></div>
</section>
```

**Step 4: Verify**

Open local preview and check:

- Sidebar shows Calculators.
- `#calculators` route displays one clean workspace.
- Other routes still work.

**Step 5: Commit**

```bash
git add index.html
git commit -m "feat: add calculator route shell"
```

---

## Task 3: Add calculator data registry

**Objective:** Define every calculator in one registry so the UI is DRY.

**Files:**
- Modify: `index.html`

**Step 1: Add `calculatorRegistry` inside the script**

Create a list with fields:

```js
{
  id: "mortgage-payment",
  title: "Mortgage Payment",
  category: "Payment",
  source: "MortgagePaymentCalc.jsx",
  description: "Estimate monthly payment using loan amount, rate, and amortization.",
  fields: [...],
  resultLabels: [...]
}
```

Add all 21 calculator tools; do not include the SHF `Calculators.jsx` index as a tool.

**Step 2: Add state**

```js
let activeCalculatorId = "mortgage-payment";
let activeCalculatorCategory = "all";
let calculatorInputs = loadCalculatorInputs();
```

Store inputs in `localStorage` under `rateDeskCalculatorInputs`.

**Step 3: Verify in console**

Temporarily log registry length or assert:

```js
console.assert(calculatorRegistry.length === 21, "Expected 21 calculators");
```

Remove noisy logging before commit, but keep a non-throwing guard if desired.

**Step 4: Commit**

```bash
git add index.html
git commit -m "feat: register broker calculators"
```

---

## Task 4: Build calculator hub UI

**Objective:** Let brokers search/select calculators quickly.

**Files:**
- Modify: `index.html`

**Step 1: Add CSS**

Add compact classes:

- `.calculator-desk`
- `.calculator-shell`
- `.calculator-sidebar`
- `.calculator-search`
- `.calculator-category-tabs`
- `.calculator-list`
- `.calculator-card`
- `.calculator-card.active`
- `.calculator-workspace`
- `.calculator-result-grid`
- `.calculator-result-card`

Use Rate Desk variables only.

**Step 2: Add hub markup**

Inside `#calculatorApp`, render from JS rather than hardcoding all cards.

**Step 3: Add render functions**

Implement:

- `renderCalculatorApp()`
- `renderCalculatorList()`
- `renderCalculatorWorkspace()`
- `selectCalculator(id)`
- `filterCalculators(category, query)`

**Step 4: Wire events**

Use event delegation:

- Click calculator card → set active calculator.
- Category chip → filter list.
- Search input → filter list.

**Step 5: Verify**

Browser checks:

- All 21 calculators are visible when filter is All.
- Category counts match registry.
- Search finds “GDS”, “HST”, “HELOC”, “rental”.
- Selected card state is clear in light/dark mode.

**Step 6: Commit**

```bash
git add index.html
git commit -m "feat: add calculator hub UI"
```

---

## Task 5: Implement shared calculator form renderer

**Objective:** Render inputs consistently for every calculator.

**Files:**
- Modify: `index.html`

**Step 1: Define field schema types**

Support:

- `currency`
- `percent`
- `number`
- `select`
- `checkbox`
- `toggle`

**Step 2: Implement format helpers**

Add:

- `formatCurrency(value)`
- `formatPercent(value)`
- `numberValue(value, fallback)`
- `saveCalculatorInputs()`
- `loadCalculatorInputs()`

**Step 3: Render forms from schema**

Each field should output label, optional hint, and compact input. Preserve accessibility with `for` / `id`.

**Step 4: Wire updates**

On input/change:

- Update `calculatorInputs[activeCalculatorId][fieldName]`.
- Save to localStorage.
- Re-render result area only if possible.

**Step 5: Verify**

- Inputs retain values across route switches.
- Inputs retain values after refresh.
- Empty or invalid numbers do not create `NaN` in results.

**Step 6: Commit**

```bash
git add index.html
git commit -m "feat: add shared calculator form renderer"
```

---

## Task 6: Port payment calculators

**Objective:** Implement the Payment group first because it shares the core mortgage formula.

**Files:**
- Modify: `index.html`
- Modify if needed: `lib/calculator-math.js`
- Modify: `scripts/test-calculator-math.js`

**Calculators:**

- Mortgage Payment
- Bi-Weekly
- Amortization Schedule
- CMHC

**Step 1: Implement result functions**

Map IDs to pure result builders:

- `calculateMortgagePaymentResult(inputs)`
- `calculateBiWeeklyResult(inputs)`
- `calculateAmortizationResult(inputs)`
- `calculateCmhcResult(inputs)`

**Step 2: Use live-rate defaults**

For rate fields, default to `getLowestRateBoardRate()` from the current Rate Board rows, falling back to SHF defaults if no live rows exist.

**Step 3: Render amortization table**

Do not add chart dependencies. Use a compact scroll table for first 12 months plus year-end summary.

**Step 4: Verify math**

Run:

```bash
npm run test:calculators
npm run check
```

**Step 5: Browser QA**

- Mortgage Payment shows monthly payment, loan amount, interest over amortization.
- Bi-weekly shows monthly vs accelerated bi-weekly and savings.
- Amortization table renders without overflow.
- CMHC shows premium and total insured mortgage.

**Step 6: Commit**

```bash
git add index.html lib/calculator-math.js scripts/test-calculator-math.js
git commit -m "feat: port payment calculators"
```

---

## Task 7: Port qualification calculators

**Objective:** Add the broker pre-qualification toolset.

**Files:**
- Modify: `index.html`
- Modify if needed: `lib/calculator-math.js`
- Modify: `scripts/test-calculator-math.js`

**Calculators:**

- Affordability
- Minimum Income
- Pre-Approval
- GDS/TDS
- Income Tax
- Self-Employed

**Step 1: Implement result functions**

Use conservative defaults:

- GDS target: 39%.
- TDS target: 44%.
- Stress rate: `max(5.25, contract + 2)`.
- Rental income: clearly label the treatment used; default to 50% add-back/offset style unless source calculator specifies otherwise.

**Step 2: Broker-facing outputs**

Every qualification calculator should show:

- Main result.
- Pass/watch/fail badge where relevant.
- Inputs that moved the result most.
- “Confirm with lender/insurer” note.

**Step 3: Verify**

- GDS/TDS status changes when debts increase.
- Minimum Income increases when rate increases.
- Self-employed income includes add-backs and deposits view.
- Income tax labels Ontario 2024 assumptions.

**Step 4: Commit**

```bash
git add index.html lib/calculator-math.js scripts/test-calculator-math.js
git commit -m "feat: port qualification calculators"
```

---

## Task 8: Port purchase-cost calculators

**Objective:** Add the cost-to-close workflow.

**Files:**
- Modify: `index.html`
- Modify if needed: `lib/calculator-math.js`
- Modify: `scripts/test-calculator-math.js`

**Calculators:**

- Down Payment
- Land Transfer
- Closing Costs
- GST/HST
- Property Tax

**Step 1: Implement result functions**

Use SHF formulas and tables. Preserve Ontario/Toronto handling and FTHB rebates.

**Step 2: Add a cash-to-close summary pattern**

Show:

- Required down payment.
- LTT net of rebates.
- HST net of rebates where applicable.
- Estimated legal/appraisal/title/adjustment costs.
- Total estimated cash required.

**Step 3: Verify**

- Toronto toggle adds municipal LTT.
- FTHB rebate reduces LTT but does not go below zero.
- New-construction HST toggle affects HST result.
- Property tax city dropdown updates annual/monthly tax.

**Step 4: Commit**

```bash
git add index.html lib/calculator-math.js scripts/test-calculator-math.js
git commit -m "feat: port purchase cost calculators"
```

---

## Task 9: Port equity, refi, and investor calculators

**Objective:** Complete the remaining SHF tools.

**Files:**
- Modify: `index.html`
- Modify if needed: `lib/calculator-math.js`
- Modify: `scripts/test-calculator-math.js`

**Calculators:**

- Refinance
- HELOC
- Mortgage Penalty
- Home Value
- Rental Cashflow
- Rent vs Buy
- Mortgage Comparison

**Step 1: Implement result functions**

Keep comparison tool dependency-free: render cards and small CSS bars instead of Recharts.

**Step 2: Rate Board integration**

For Mortgage Comparison:

- Seed first offers from the lowest-first Rate Board rows.
- Let users manually edit lender/rate/term/type.
- Keep max offers at 5, like SHF.

**Step 3: Verify**

- Refinance savings reacts to lower/higher new rate.
- HELOC room maxes at 80% LTV minus mortgage balance.
- Penalty changes between variable and fixed.
- Rental cashflow shows monthly net and coverage warning.
- Comparison labels lowest payment/lowest interest.

**Step 4: Commit**

```bash
git add index.html lib/calculator-math.js scripts/test-calculator-math.js
git commit -m "feat: port equity and comparison calculators"
```

---

## Task 10: Final visual QA and production verification

**Objective:** Ensure the calculators feel native to the Rate Desk and do not regress existing workflows.

**Files:**
- Modify if needed: `index.html`
- Modify if needed: `lib/calculator-math.js`
- Modify if needed: `scripts/test-calculator-math.js`

**Step 1: Static checks**

Run:

```bash
npm run check
npm run test:calculators
git diff --check
```

Expected: all pass.

**Step 2: Browser smoke test locally**

Start local server and verify:

- Login/lock screen still appears as before.
- Dashboard route works.
- Upload route works.
- Rate Board route still sorts lowest-first.
- New Calculators route works.
- AI Review remains admin-only.
- Broker Kits route works.
- Directory route works.
- No console JavaScript errors.

**Step 3: Calculator QA matrix**

For each calculator, test:

- Initial render.
- One changed input updates result.
- Empty input does not show `NaN`/`Infinity`.
- Mobile viewport does not clip labels or result cards.
- Dark mode remains readable.

**Step 4: Production deployment**

After local QA:

```bash
git status --short
git push origin main
vercel --prod
```

Use the repo’s existing deployment workflow if different at implementation time.

**Step 5: Production smoke test**

On `https://ontario-mortgage-rate-portal-kappa.vercel.app/` verify:

- `#calculators` loads.
- All 21 calculator tools are selectable.
- Rate Board is still lowest-first.
- Browser console has no JS errors.

**Step 6: Commit final polish if needed**

```bash
git add index.html lib/calculator-math.js scripts/test-calculator-math.js package.json
git commit -m "chore: polish calculator suite"
```

---

## Acceptance Criteria

- All SHF calculator tools are represented in the Rate Desk Portal.
- No React/Vite/shadcn/framer-motion/Recharts dependency is introduced into Rate Desk.
- Calculator UI uses the Rate Desk visual system, not the public SHF website style.
- Calculators are reachable from one concise sidebar nav item.
- Rate-bearing calculators can default to current lowest-first Rate Board pricing.
- Rate Board remains sorted lowest-first after the change.
- Core math has Node test coverage.
- Local and production browser smoke tests show no JavaScript errors.
- Mobile/dark-mode calculator views are readable and unclipped.

## Notes / Risks

- Some SHF assumptions are dated or approximate: Ontario 2024 income tax brackets, 2024 property tax rates, HST rebate rules, and simplified IRD penalty logic. Keep visible assumption notes in each affected calculator.
- Rate Desk currently stores much UI in one large `index.html`; adding 21 calculators will make it larger. Keep math in `lib/calculator-math.js` and keep registry/result builders organized by section comments.
- Do not edit the Simple Home Financing repo while porting. It currently has unrelated uncommitted changes; treat it as read-only source material.
