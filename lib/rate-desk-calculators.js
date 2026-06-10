(() => {
  const STORAGE_KEY = 'rateDeskCalculatorInputs:v1';
  const CATEGORY_ORDER = ['All', 'Qualify', 'Payment', 'Purchase Costs', 'Equity / Refi', 'Investor / Compare'];
  const taxRates = {
    toronto: { name: 'Toronto', rate: 0.631933, education: 0.153 },
    mississauga: { name: 'Mississauga', rate: 0.823117, education: 0.153 },
    brampton: { name: 'Brampton', rate: 1.014856, education: 0.153 },
    vaughan: { name: 'Vaughan', rate: 0.738455, education: 0.153 },
    markham: { name: 'Markham', rate: 0.664439, education: 0.153 },
    oakville: { name: 'Oakville', rate: 0.856122, education: 0.153 },
    hamilton: { name: 'Hamilton', rate: 1.261716, education: 0.153 },
    ottawa: { name: 'Ottawa', rate: 1.067508, education: 0.153 },
    london: { name: 'London', rate: 1.400481, education: 0.153 },
    kitchener: { name: 'Kitchener-Waterloo', rate: 1.138609, education: 0.153 },
  };

  const registry = [
    calc('mortgage-payment', 'Mortgage Payment', 'Payment', 'Monthly payment, loan amount, total interest.', [money('purchasePrice', 'Purchase price', 750000), money('downPayment', 'Down payment', 75000), pct('interestRate', 'Rate', 4.99), select('amortization', 'Amortization', 25, [[15,'15 years'],[20,'20 years'],[25,'25 years'],[30,'30 years']])]),
    calc('affordability', 'Affordability', 'Qualify', 'Maximum purchase estimate from income, debts, cash, and rate.', [money('annualIncome','Annual income',140000), money('monthlyDebts','Monthly debts',650), money('downPayment','Down payment',90000), pct('interestRate','Rate',4.99), money('propertyTaxMonthly','Monthly property tax',450), money('heatingMonthly','Heating',120)]),
    calc('minimum-income', 'Minimum Income', 'Qualify', 'Income required for a target purchase under GDS/TDS limits.', [money('purchasePrice','Purchase price',800000), money('downPayment','Down payment',80000), pct('interestRate','Rate',4.99), select('amortization','Amortization',25,[[20,'20 years'],[25,'25 years'],[30,'30 years']]), money('propertyTaxYearly','Property tax / year',6000), money('heatingMonthly','Heating / month',120), money('condoMonthly','Condo fees / month',0), money('monthlyDebts','Other debts / month',500), checkbox('useStressTest','Use stress test',true)]),
    calc('pre-approval', 'Pre-Approval', 'Qualify', 'Quick pre-approval range using household income and debt load.', [money('annualIncome','Primary income',120000), money('coApplicantIncome','Co-applicant income',60000), money('monthlyDebts','Monthly debts',800), money('downPayment','Down payment',100000), pct('interestRate','Rate',4.99), checkbox('useStressTest','Use stress test',true)]),
    calc('bi-weekly', 'Bi-Weekly / Accelerated', 'Payment', 'Compare monthly, bi-weekly, and accelerated bi-weekly payoff.', [money('principal','Mortgage amount',600000), pct('rate','Rate',4.99), select('amortization','Amortization',25,[[15,'15 years'],[20,'20 years'],[25,'25 years'],[30,'30 years']])]),
    calc('amortization', 'Amortization Schedule', 'Payment', 'First-year payment breakdown and balance trajectory.', [money('principal','Mortgage amount',600000), pct('rate','Rate',4.99), select('amortization','Amortization',25,[[15,'15 years'],[20,'20 years'],[25,'25 years'],[30,'30 years']])]),
    calc('land-transfer', 'Land Transfer Tax', 'Purchase Costs', 'Ontario and Toronto land transfer tax with buyer rebate.', [money('purchasePrice','Purchase price',800000), checkbox('firstTimeBuyer','First-time buyer',true), checkbox('isToronto','Toronto property',false)]),
    calc('closing-costs', 'Closing Costs', 'Purchase Costs', 'Cash-to-close estimate: down payment, LTT, legal, title, adjustments.', [money('purchasePrice','Purchase price',800000), money('downPayment','Down payment',80000), checkbox('isToronto','Toronto property',false), checkbox('isFirstTimeBuyer','First-time buyer',true)]),
    calc('cmhc', 'CMHC / Default Insurance', 'Payment', 'Default insurance premium and total insured mortgage.', [money('purchasePrice','Purchase price',750000), money('downPayment','Down payment',75000)]),
    calc('refinance', 'Refinance Savings', 'Equity / Refi', 'Payment and interest delta between current and new rate.', [money('balance','Current balance',550000), pct('currentRate','Current rate',5.49), pct('newRate','New rate',4.79), select('remainingYears','Remaining amortization',22,[[10,'10 years'],[15,'15 years'],[20,'20 years'],[22,'22 years'],[25,'25 years'],[30,'30 years']])]),
    calc('heloc', 'HELOC Room', 'Equity / Refi', 'Available equity room up to 80% LTV.', [money('homeValue','Home value',1000000), money('mortgageBalance','Mortgage balance',520000), pct('maxLtv','Max LTV',80)]),
    calc('mortgage-penalty', 'Mortgage Penalty', 'Equity / Refi', '3-month-interest vs IRD-style fixed penalty estimate.', [money('mortgageBalance','Mortgage balance',520000), pct('currentRate','Current rate',5.29), pct('currentPostedRate','Posted rate',6.29), pct('comparisonRate','Comparison rate',4.79), num('monthsRemaining','Months remaining',28), select('mortgageType','Mortgage type','fixed', [['fixed','Fixed'],['variable','Variable']])]),
    calc('self-employed', 'Self-Employed Income', 'Qualify', 'Add-back and deposit-based BFS income estimate.', [money('netIncome','Net income',95000), money('cca','CCA add-back',12000), money('vehicleExpense','Vehicle add-back',6000), money('homeExpense','Home-office add-back',4000), money('otherAddbacks','Other add-backs',5000), money('monthlyDeposits','Avg monthly deposits',11000)]),
    calc('rental-cashflow', 'Rental Cashflow', 'Investor / Compare', 'Rental payment, carrying costs, cashflow, and DSCR.', [money('purchasePrice','Purchase price',750000), money('downPayment','Down payment',150000), pct('rate','Rate',4.99), money('rentMonthly','Monthly rent',3600), money('taxesAnnual','Property tax / year',6200), money('insuranceAnnual','Insurance / year',1500), money('maintenanceMonthly','Maintenance / month',250), money('condoMonthly','Condo fees / month',0)]),
    calc('down-payment', 'Down Payment', 'Purchase Costs', 'Minimum down payment and savings timeline.', [money('purchasePrice','Purchase price',800000), money('currentSavings','Current savings',40000), money('monthlyContribution','Monthly savings',2500), pct('savingsRate','Savings interest',3)]),
    calc('rent-vs-buy', 'Rent vs Buy', 'Investor / Compare', 'Five-year rent versus buy equity estimate.', [money('currentRent','Current rent',2800), money('purchasePrice','Purchase price',750000), money('downPayment','Down payment',75000), pct('rate','Rate',4.99), pct('appreciation','Annual appreciation',3), num('years','Horizon years',5)]),
    calc('gds-tds', 'GDS / TDS Ratios', 'Qualify', 'Debt-service ratio test with stress-rate option.', [money('purchasePrice','Purchase price',800000), money('downPayment','Down payment',80000), pct('interestRate','Rate',4.99), select('amortization','Amortization',25,[[20,'20 years'],[25,'25 years'],[30,'30 years']]), checkbox('useStressTest','Use stress test',true), money('annualIncome','Primary income',140000), money('coApplicantIncome','Co-applicant income',40000), money('rentalIncome','Rental income / month',0), money('propertyTax','Property tax / month',500), money('heatingCost','Heating / month',120), money('condoFees','Condo fees / month',0), money('creditCards','Credit cards / month',200), money('carLoans','Car loans / month',450), money('otherLoans','Other loans / month',150)]),
    calc('property-tax', 'Property Tax', 'Purchase Costs', 'Municipal tax estimate by Ontario city.', [money('assessedValue','Assessed value',700000), select('city','City','toronto', Object.entries(taxRates).map(([key,v]) => [key,v.name]))]),
    calc('home-value', 'Home Value', 'Equity / Refi', 'Current value estimate from appreciation and improvements.', [money('purchasePrice','Original purchase price',600000), num('purchaseYear','Year purchased',2020), pct('annualAppreciation','Annual appreciation',5), money('renovationValue','Renovation value',25000)]),
    calc('income-tax', 'Income Tax', 'Qualify', 'Ontario/federal tax and after-tax income estimate.', [money('grossIncome','Gross income',120000), money('rrspContribution','RRSP contribution',10000)]),
    calc('gst-hst', 'GST/HST New Build', 'Purchase Costs', 'HST and new-housing rebate estimate for Ontario new construction.', [money('purchasePrice','Purchase price',650000), checkbox('isNewConstruction','New construction/substantial renovation',true), checkbox('isPrimaryResidence','Primary residence',true)]),
    calc('mortgage-comparison', 'Mortgage Comparison', 'Investor / Compare', 'Compare multiple offers seeded from the lowest-first Rate Board.', [money('principal','Mortgage amount',600000), select('amortization','Amortization',25,[[15,'15 years'],[20,'20 years'],[25,'25 years'],[30,'30 years']]), money('prepaymentAmount','Monthly prepayment',200)]),
  ];

  let activeId = registry[0].id;
  let activeCategory = 'All';
  let inputs = loadInputs();

  function calc(id, title, category, description, fields) { return { id, title, category, description, fields }; }
  function money(name, label, value) { return { name, label, type: 'currency', value }; }
  function pct(name, label, value) { return { name, label, type: 'percent', value }; }
  function num(name, label, value) { return { name, label, type: 'number', value }; }
  function select(name, label, value, options) { return { name, label, type: 'select', value, options }; }
  function checkbox(name, label, value) { return { name, label, type: 'checkbox', value }; }
  function n(value, fallback = 0) { const parsed = Number(value); return Number.isFinite(parsed) ? parsed : fallback; }
  function moneyFmt(value) { return n(value).toLocaleString('en-CA', { style: 'currency', currency: 'CAD', maximumFractionDigits: 0 }); }
  function pctFmt(value) { return `${n(value).toFixed(2)}%`; }
  function esc(value = '') { return String(value).replace(/[&<>"]/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[ch]); }

  function payment(principal, annualRate, years) {
    principal = n(principal); annualRate = n(annualRate); years = n(years);
    if (principal <= 0 || years <= 0) return 0;
    if (annualRate <= 0) return principal / (years * 12);
    const r = annualRate / 100 / 12;
    const months = years * 12;
    return (principal * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);
  }
  function minimumDown(price) { price = n(price); if (price <= 500000) return price * .05; if (price <= 1000000) return 25000 + (price - 500000) * .10; return price * .20; }
  function cmhc(price, down) { price = n(price); down = n(down); if (price <= 0 || price > 1500000) return 0; const pct = down / price; if (pct >= .20 || pct < .05) return 0; return (price - down) * (pct < .10 ? .04 : pct < .15 ? .031 : .028); }
  function stress(rate) { return Math.max(5.25, n(rate) + 2); }
  function ltt(price) { price = n(price); let tax = 0; if (price > 2000000) tax += (price - 2000000) * .025; if (price > 400000) tax += (Math.min(price, 2000000) - 400000) * .02; if (price > 250000) tax += (Math.min(price, 400000) - 250000) * .015; if (price > 55000) tax += (Math.min(price, 250000) - 55000) * .01; if (price > 0) tax += Math.min(price, 55000) * .005; return tax; }
  function amortRows(principal, rate, years, months = 12) { const pmt = payment(principal, rate, years); const r = n(rate) / 100 / 12; let balance = n(principal); const rows = []; for (let month = 1; month <= months && balance > 0.01; month++) { const interest = balance * r; const principalPaid = Math.min(balance, pmt - interest); balance = Math.max(0, balance - principalPaid); rows.push({ month, payment: pmt, principal: principalPaid, interest, balance }); } return rows; }
  function loadInputs() { try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}') || {}; } catch { return {}; } }
  function saveInputs() { localStorage.setItem(STORAGE_KEY, JSON.stringify(inputs)); }
  function defaultsFor(item) { return Object.fromEntries(item.fields.map((field) => [field.name, field.name.toLowerCase().includes('rate') || field.name === 'rate' || field.name === 'newRate' ? lowestLiveRate(field.value) : field.value])); }
  function valuesFor(item) { return { ...defaultsFor(item), ...(inputs[item.id] || {}) }; }

  function lowestLiveRate(fallback = 4.99) {
    try {
      const rows = typeof rateFinderRows === 'function' ? rateFinderRows() : [];
      const best = rows.map((row) => Number(row.sortRateValue ?? row.rateValue)).filter((value) => Number.isFinite(value) && value > 0).sort((a, b) => a - b)[0];
      return best || fallback;
    } catch { return fallback; }
  }
  function bestOffers() {
    try {
      const rows = (typeof rateFinderRows === 'function' ? rateFinderRows() : [])
        .filter((row) => Number.isFinite(Number(row.sortRateValue ?? row.rateValue)))
        .sort((a, b) => Number(a.sortRateValue ?? a.rateValue) - Number(b.sortRateValue ?? b.rateValue))
        .slice(0, 5);
      if (rows.length >= 2) return rows.map((row, index) => ({ id: index + 1, lender: row.lender, rate: Number(row.sortRateValue ?? row.rateValue), term: Number(row.termValue || 60) / 12 || 5, type: row.rateType || 'fixed' }));
    } catch {}
    return [{ id: 1, lender: 'Lowest live row', rate: lowestLiveRate(4.79), term: 5, type: 'fixed' }, { id: 2, lender: 'Benchmark offer', rate: 4.99, term: 5, type: 'fixed' }, { id: 3, lender: 'Variable comparison', rate: 5.10, term: 5, type: 'variable' }];
  }

  function registerRoute() {
    const section = document.querySelector('#calculators');
    if (!section) return;
    try {
      if (typeof pageRoutes !== 'undefined' && !pageRoutes.includes('calculators')) pageRoutes.splice(3, 0, 'calculators');
      if (typeof pageGroups !== 'undefined') pageGroups.calculators = [section];
    } catch (error) { console.warn('Calculator route registration failed', error); }
  }

  function renderApp() {
    const host = document.querySelector('#calculatorApp');
    if (!host) return;
    const active = registry.find((item) => item.id === activeId) || registry[0];
    host.innerHTML = `
      <div class="calculator-shell">
        <aside class="calculator-sidebar">
          <div class="calculator-toolbar">
            <label class="calculator-search"><span>Find calculator</span><input id="calculatorSearch" type="search" placeholder="GDS, HST, HELOC, penalty…" /></label>
            <div class="calculator-category-tabs">${CATEGORY_ORDER.map((cat) => `<button type="button" class="${cat === activeCategory ? 'active' : ''}" data-calc-category="${esc(cat)}">${esc(cat)}</button>`).join('')}</div>
          </div>
          <div class="calculator-list" id="calculatorList"></div>
        </aside>
        <section class="calculator-workspace" id="calculatorWorkspace" aria-live="polite">
          ${renderWorkspace(active)}
        </section>
      </div>`;
    host.querySelector('#calculatorSearch')?.addEventListener('input', renderList);
    host.querySelectorAll('[data-calc-category]').forEach((button) => button.addEventListener('click', () => { activeCategory = button.dataset.calcCategory; renderApp(); }));
    renderList();
    bindWorkspace(active);
  }

  function renderList() {
    const list = document.querySelector('#calculatorList');
    if (!list) return;
    const query = (document.querySelector('#calculatorSearch')?.value || '').toLowerCase().trim();
    const items = registry.filter((item) => (activeCategory === 'All' || item.category === activeCategory) && (!query || `${item.title} ${item.category} ${item.description}`.toLowerCase().includes(query)));
    list.innerHTML = items.map((item, index) => `<button type="button" class="calculator-card ${item.id === activeId ? 'active' : ''}" data-calc-id="${item.id}"><span>${String(index + 1).padStart(2, '0')}</span><strong>${esc(item.title)}</strong><small>${esc(item.category)} · ${esc(item.description)}</small></button>`).join('') || `<div class="calculator-empty">No calculators match this search.</div>`;
    list.querySelectorAll('[data-calc-id]').forEach((button) => button.addEventListener('click', () => { activeId = button.dataset.calcId; renderApp(); }));
  }

  function renderWorkspace(item) {
    const values = valuesFor(item);
    return `<div class="calculator-workspace-head"><div><p class="eyebrow">${esc(item.category)}</p><h4>${esc(item.title)}</h4><p>${esc(item.description)}</p></div><button class="secondary-button" type="button" id="useLowestRate">Use lowest live rate</button></div>
      <div class="calculator-form-grid">${item.fields.map((field) => renderField(item, field, values[field.name])).join('')}</div>
      <div class="calculator-results" id="calculatorResults">${resultHtml(item, values)}</div>
      <p class="calculator-disclaimer">Estimates only. Confirm lender/insurer rules, rate holds, rebates, tax brackets, and penalty policies before advising or submitting.</p>`;
  }

  function renderField(item, field, value) {
    const id = `calc-${item.id}-${field.name}`;
    if (field.type === 'select') return `<label><span>${esc(field.label)}</span><select id="${id}" data-calc-field="${field.name}">${field.options.map(([optionValue, label]) => `<option value="${esc(optionValue)}" ${String(optionValue) === String(value) ? 'selected' : ''}>${esc(label)}</option>`).join('')}</select></label>`;
    if (field.type === 'checkbox') return `<label class="calculator-check"><input id="${id}" type="checkbox" data-calc-field="${field.name}" ${value ? 'checked' : ''}/><span>${esc(field.label)}</span></label>`;
    const step = field.type === 'percent' ? '0.01' : field.type === 'currency' ? '1000' : '1';
    return `<label><span>${esc(field.label)}</span><input id="${id}" type="number" step="${step}" data-calc-field="${field.name}" value="${esc(value)}" /></label>`;
  }

  function bindWorkspace(item) {
    document.querySelector('#useLowestRate')?.addEventListener('click', () => {
      const next = valuesFor(item);
      item.fields.forEach((field) => { if (field.name.toLowerCase().includes('rate') || field.name === 'rate' || field.name === 'newRate') next[field.name] = lowestLiveRate(next[field.name]); });
      inputs[item.id] = next; saveInputs(); renderApp();
    });
    document.querySelectorAll('[data-calc-field]').forEach((control) => control.addEventListener('input', () => updateField(item, control)));
    document.querySelectorAll('[data-calc-field]').forEach((control) => control.addEventListener('change', () => updateField(item, control)));
  }

  function updateField(item, control) {
    const next = valuesFor(item);
    next[control.dataset.calcField] = control.type === 'checkbox' ? control.checked : control.value;
    inputs[item.id] = next;
    saveInputs();
    const result = document.querySelector('#calculatorResults');
    if (result) result.innerHTML = resultHtml(item, next);
  }

  function cards(items) { return `<div class="calculator-result-grid">${items.map(([label, value, sub = '']) => `<article class="calculator-result-card"><span>${esc(label)}</span><strong>${value}</strong>${sub ? `<small>${esc(sub)}</small>` : ''}</article>`).join('')}</div>`; }
  function rowTable(rows) { return `<div class="calculator-mini-table"><table><thead><tr><th>Month</th><th>Payment</th><th>Principal</th><th>Interest</th><th>Balance</th></tr></thead><tbody>${rows.map((r) => `<tr><td>${r.month}</td><td>${moneyFmt(r.payment)}</td><td>${moneyFmt(r.principal)}</td><td>${moneyFmt(r.interest)}</td><td>${moneyFmt(r.balance)}</td></tr>`).join('')}</tbody></table></div>`; }

  function resultHtml(item, v) {
    switch (item.id) {
      case 'mortgage-payment': { const loan = Math.max(0, n(v.purchasePrice) - n(v.downPayment)); const prem = cmhc(v.purchasePrice, v.downPayment); const pmt = payment(loan + prem, v.interestRate, v.amortization); return cards([['Monthly payment', moneyFmt(pmt)], ['Mortgage amount', moneyFmt(loan + prem), prem ? `includes ${moneyFmt(prem)} insurance` : 'no default insurance'], ['Total interest', moneyFmt((pmt * n(v.amortization) * 12) - loan - prem)]]); }
      case 'affordability': { const gross = n(v.annualIncome) / 12; const room = Math.max(0, gross * .44 - n(v.monthlyDebts) - n(v.propertyTaxMonthly) - n(v.heatingMonthly)); const maxLoan = loanFromPayment(room, stress(v.interestRate), 25); return cards([['Estimated purchase', moneyFmt(maxLoan + n(v.downPayment))], ['Max mortgage', moneyFmt(maxLoan)], ['Qualifying rate', pctFmt(stress(v.interestRate)), '44% TDS model']]); }
      case 'minimum-income': { const loan = Math.max(0, n(v.purchasePrice) - n(v.downPayment) + cmhc(v.purchasePrice, v.downPayment)); const qRate = v.useStressTest ? stress(v.interestRate) : n(v.interestRate); const pmt = payment(loan, qRate, v.amortization); const housing = pmt + n(v.propertyTaxYearly)/12 + n(v.heatingMonthly) + n(v.condoMonthly)*.5; const gdsIncome = housing / .39 * 12; const tdsIncome = (housing + n(v.monthlyDebts)) / .44 * 12; return cards([['Required income', moneyFmt(Math.max(gdsIncome, tdsIncome))], ['Payment at qualifying rate', moneyFmt(pmt)], ['Qualifying rate', pctFmt(qRate)]]); }
      case 'pre-approval': { const income = n(v.annualIncome) + n(v.coApplicantIncome); const gross = income / 12; const qRate = v.useStressTest ? stress(v.interestRate) : n(v.interestRate); const room = Math.max(0, gross * .44 - n(v.monthlyDebts) - 600); const loan = loanFromPayment(room, qRate, 25); return cards([['Pre-approval range', moneyFmt(loan + n(v.downPayment))], ['Household income', moneyFmt(income)], ['Qualifying rate', pctFmt(qRate)]]); }
      case 'bi-weekly': { const monthly = payment(v.principal, v.rate, v.amortization); const normal = amortRows(v.principal, v.rate, v.amortization, n(v.amortization)*12).reduce((s,r)=>s+r.interest,0); const accel = monthly/2; const extra = accel*26/12 - monthly; const acceleratedInterest = simulateInterest(v.principal, v.rate, v.amortization, extra); return cards([['Monthly payment', moneyFmt(monthly)], ['Accelerated bi-weekly', moneyFmt(accel)], ['Interest saved', moneyFmt(Math.max(0, normal - acceleratedInterest))]]); }
      case 'amortization': { const rows = amortRows(v.principal, v.rate, v.amortization, 12); return cards([['Monthly payment', moneyFmt(rows[0]?.payment || 0)], ['Principal year 1', moneyFmt(rows.reduce((s,r)=>s+r.principal,0))], ['Interest year 1', moneyFmt(rows.reduce((s,r)=>s+r.interest,0))]]) + rowTable(rows); }
      case 'land-transfer': { const prov = ltt(v.purchasePrice); const tor = v.isToronto ? ltt(v.purchasePrice) : 0; const rebate = v.firstTimeBuyer ? Math.min(prov,4000) + (v.isToronto ? Math.min(tor,4475) : 0) : 0; return cards([['Net LTT', moneyFmt(Math.max(0, prov + tor - rebate))], ['Provincial LTT', moneyFmt(prov)], ['Toronto LTT / rebate', `${moneyFmt(tor)} / ${moneyFmt(rebate)}`]]); }
      case 'closing-costs': { const down = n(v.downPayment); const prov = ltt(v.purchasePrice); const tor = v.isToronto ? ltt(v.purchasePrice) : 0; const rebate = v.isFirstTimeBuyer ? Math.min(prov,4000)+(v.isToronto?Math.min(tor,4475):0) : 0; const net = Math.max(0, prov+tor-rebate); const extras = 1800 + 500 + Math.max(350, n(v.purchasePrice)*.0007) + Math.max(750, n(v.purchasePrice)*.0015); return cards([['Cash required', moneyFmt(down+net+extras)], ['Closing costs', moneyFmt(net+extras)], ['LTT after rebate', moneyFmt(net)]]); }
      case 'cmhc': { const premium = cmhc(v.purchasePrice, v.downPayment); return cards([['Premium', moneyFmt(premium)], ['Premium rate', pctFmt((premium / Math.max(1,n(v.purchasePrice)-n(v.downPayment))) * 100)], ['Total mortgage', moneyFmt(n(v.purchasePrice)-n(v.downPayment)+premium)]]); }
      case 'refinance': { const oldP = payment(v.balance, v.currentRate, v.remainingYears); const newP = payment(v.balance, v.newRate, v.remainingYears); return cards([['Monthly savings', moneyFmt(oldP-newP)], ['Current payment', moneyFmt(oldP)], ['New payment', moneyFmt(newP)]]); }
      case 'heloc': { const max = n(v.homeValue) * (n(v.maxLtv,80)/100); const avail = Math.max(0, max - n(v.mortgageBalance)); return cards([['Available room', moneyFmt(avail)], ['Max borrowing', moneyFmt(max)], ['Current LTV', pctFmt(n(v.mortgageBalance)/Math.max(1,n(v.homeValue))*100)]]); }
      case 'mortgage-penalty': { const three = n(v.mortgageBalance) * n(v.currentRate)/100/4; const ird = n(v.mortgageBalance) * Math.max(0,n(v.currentPostedRate)-n(v.comparisonRate))/100 * n(v.monthsRemaining)/12; const est = v.mortgageType === 'variable' ? three : Math.max(three, ird); return cards([['Estimated penalty', moneyFmt(est)], ['3-month interest', moneyFmt(three)], ['IRD-style estimate', moneyFmt(ird)]]); }
      case 'self-employed': { const add = n(v.netIncome)+n(v.cca)+n(v.vehicleExpense)+n(v.homeExpense)+n(v.otherAddbacks); const dep = n(v.monthlyDeposits)*12; return cards([['Usable income', moneyFmt(Math.max(add,dep))], ['Add-back view', moneyFmt(add)], ['Deposit view', moneyFmt(dep)]]); }
      case 'rental-cashflow': { const loan = n(v.purchasePrice)-n(v.downPayment); const pmt = payment(loan, v.rate, 25); const exp = pmt+n(v.taxesAnnual)/12+n(v.insuranceAnnual)/12+n(v.maintenanceMonthly)+n(v.condoMonthly); const cf = n(v.rentMonthly)-exp; return cards([['Monthly cashflow', moneyFmt(cf)], ['Monthly expenses', moneyFmt(exp)], ['Coverage ratio', `${(n(v.rentMonthly)/Math.max(1,exp)).toFixed(2)}x`]]); }
      case 'down-payment': { const min = minimumDown(v.purchasePrice); const gap = Math.max(0, min-n(v.currentSavings)); const months = n(v.monthlyContribution)>0 ? Math.ceil(gap/n(v.monthlyContribution)) : 0; return cards([['Minimum down', moneyFmt(min)], ['Savings gap', moneyFmt(gap)], ['Timeline', gap ? `${months} months` : 'Ready now']]); }
      case 'rent-vs-buy': { const loan = n(v.purchasePrice)-n(v.downPayment); const pmt = payment(loan, v.rate, 25); const future = n(v.purchasePrice)*Math.pow(1+n(v.appreciation)/100,n(v.years)); const balance = amortRows(loan,v.rate,25,n(v.years)*12).at(-1)?.balance ?? loan; const equity = future-balance; const rentCost = n(v.currentRent)*12*n(v.years); const buyOutflow = (pmt+n(v.purchasePrice)*.012/12)*12*n(v.years)+n(v.downPayment); return cards([['5-year net difference', moneyFmt(equity-(buyOutflow-rentCost))], ['Estimated equity', moneyFmt(equity)], ['Monthly ownership', moneyFmt(pmt+n(v.purchasePrice)*.012/12)]]); }
      case 'gds-tds': { const income = n(v.annualIncome)+n(v.coApplicantIncome)+n(v.rentalIncome)*12*.5; const qRate = v.useStressTest ? stress(v.interestRate) : n(v.interestRate); const loan = n(v.purchasePrice)-n(v.downPayment)+cmhc(v.purchasePrice,v.downPayment); const pmt = payment(loan,qRate,v.amortization); const housing = pmt+n(v.propertyTax)+n(v.heatingCost)+n(v.condoFees)*.5; const debts = n(v.creditCards)+n(v.carLoans)+n(v.otherLoans); const gds = housing/(income/12)*100; const tds = (housing+debts)/(income/12)*100; return cards([['GDS', pctFmt(gds), gds <= 39 ? 'pass' : 'watch'], ['TDS', pctFmt(tds), tds <= 44 ? 'pass' : 'watch'], ['Qualifying payment', moneyFmt(pmt)]]); }
      case 'property-tax': { const t = taxRates[v.city] || taxRates.toronto; const annual = n(v.assessedValue)*(t.rate+t.education)/100; return cards([['Annual property tax', moneyFmt(annual)], ['Monthly tax', moneyFmt(annual/12)], ['Effective rate', pctFmt(t.rate+t.education), t.name]]); }
      case 'home-value': { const years = Math.max(0,new Date().getFullYear()-n(v.purchaseYear)); const est = n(v.purchasePrice)*Math.pow(1+n(v.annualAppreciation)/100,years)+n(v.renovationValue); return cards([['Estimated value', moneyFmt(est)], ['Total gain', moneyFmt(est-n(v.purchasePrice))], ['Years owned', `${years}`]]); }
      case 'income-tax': { const tax = incomeTax(v.grossIncome, v.rrspContribution); return cards([['Net income', moneyFmt(tax.net)], ['Total tax', moneyFmt(tax.total)], ['RRSP savings', moneyFmt(tax.rrspSavings)]]); }
      case 'gst-hst': { const hst = v.isNewConstruction ? n(v.purchasePrice)*.13 : 0; const reb = v.isNewConstruction && v.isPrimaryResidence ? hstRebate(n(v.purchasePrice)) : 0; return cards([['Net HST', moneyFmt(Math.max(0,hst-reb))], ['Gross HST', moneyFmt(hst)], ['Rebate estimate', moneyFmt(reb)]]); }
      case 'mortgage-comparison': { const offers = bestOffers().map((offer) => ({ ...offer, monthly: payment(v.principal, offer.rate, v.amortization), interest: amortRows(v.principal, offer.rate, v.amortization, n(offer.term)*12).reduce((s,r)=>s+r.interest,0) })); const lowP = Math.min(...offers.map(o=>o.monthly)); return cards([['Best payment', moneyFmt(lowP)], ['Compared offers', `${offers.length}`], ['Lowest live rate', pctFmt(Math.min(...offers.map(o=>o.rate))) ]]) + `<div class="calculator-offer-grid">${offers.map((o)=>`<article><small>${esc(o.type)} · ${o.term}yr</small><strong>${esc(o.lender)}</strong><span>${pctFmt(o.rate)} · ${moneyFmt(o.monthly)}/mo</span>${o.monthly===lowP?'<b>Lowest payment</b>':''}</article>`).join('')}</div>`; }
      default: return cards([['Ready', 'Select inputs']]);
    }
  }

  function loanFromPayment(pmt, rate, years) { const r = n(rate)/100/12; const months = years*12; if (r <= 0) return n(pmt)*months; return n(pmt)*(Math.pow(1+r,months)-1)/(r*Math.pow(1+r,months)); }
  function simulateInterest(principal, rate, years, extra) { let bal = n(principal); const pmt = payment(principal, rate, years); const r = n(rate)/100/12; let interest = 0; for (let i=0; i<years*12+240 && bal>0.01; i++) { const int = bal*r; interest += int; bal = Math.max(0, bal - Math.max(0, pmt+n(extra)-int)); } return interest; }
  function incomeTax(gross, rrsp) { const taxable = Math.max(0,n(gross)-n(rrsp)); const fed = taxBy(taxable, [[0,55867,.15],[55867,111733,.205],[111733,173205,.26],[173205,246752,.29],[246752,Infinity,.33]]); const on = taxBy(taxable, [[0,51446,.0505],[51446,102894,.0915],[102894,150000,.1116],[150000,220000,.1216],[220000,Infinity,.1316]]); const marginal = taxable>246752?.4616:taxable>220000?.4216:taxable>173205?.4216:taxable>150000?.3816:taxable>111733?.3716:taxable>102894?.3166:taxable>55867?.2965:taxable>51446?.2415:.2005; return { total: fed+on, net:n(gross)-fed-on, rrspSavings:n(rrsp)*marginal }; }
  function taxBy(income, brackets) { return brackets.reduce((sum,[min,max,rate]) => income>min ? sum+(Math.min(income,max)-min)*rate : sum,0); }
  function hstRebate(price) { let fed = 0; if (price <= 350000) fed = price*.05*.36; else if (price < 450000) fed = price*.05*.36*(1-(price-350000)/100000); fed = Math.min(fed,6300); const ont = price <= 400000 ? price*.08*.75 : 24000; return fed+ont; }

  function init() {
    registerRoute();
    renderApp();
    if (window.location.hash === '#calculators') {
      try { showPage('calculators', { updateHash: false, scrollTop: true }); } catch {}
    }
    console.assert(registry.length === 22, `Expected 22 calculators, got ${registry.length}`);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
