export function safeNumber(value, fallback = 0) {
  const next = Number(value);
  return Number.isFinite(next) ? next : fallback;
}

export function monthlyPayment(principal, annualRate, years) {
  principal = safeNumber(principal);
  annualRate = safeNumber(annualRate);
  years = safeNumber(years);
  if (principal <= 0 || years <= 0) return 0;
  if (annualRate <= 0) return principal / (years * 12);
  const r = annualRate / 100 / 12;
  const n = years * 12;
  return (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
}

export function cmhcPremium(purchasePrice, downPayment) {
  purchasePrice = safeNumber(purchasePrice);
  downPayment = safeNumber(downPayment);
  if (purchasePrice <= 0 || purchasePrice > 1500000) return 0;
  const downPct = downPayment / purchasePrice;
  if (downPct >= 0.2 || downPct < 0.05) return 0;
  let rate = 0.028;
  if (downPct < 0.1) rate = 0.04;
  else if (downPct < 0.15) rate = 0.031;
  return (purchasePrice - downPayment) * rate;
}

export function minimumDownPayment(purchasePrice) {
  purchasePrice = safeNumber(purchasePrice);
  if (purchasePrice <= 0) return 0;
  if (purchasePrice <= 500000) return purchasePrice * 0.05;
  if (purchasePrice <= 1000000) return 25000 + (purchasePrice - 500000) * 0.10;
  return purchasePrice * 0.20;
}

export function gdsRatio(monthlyMortgage, monthlyTax, monthlyHeating, grossMonthlyIncome, condoFees = 0) {
  grossMonthlyIncome = safeNumber(grossMonthlyIncome);
  if (grossMonthlyIncome <= 0) return 0;
  return (safeNumber(monthlyMortgage) + safeNumber(monthlyTax) + safeNumber(monthlyHeating) + safeNumber(condoFees) * 0.5) / grossMonthlyIncome;
}

export function tdsRatio(monthlyMortgage, monthlyTax, monthlyHeating, otherMonthlyDebts, grossMonthlyIncome, condoFees = 0) {
  grossMonthlyIncome = safeNumber(grossMonthlyIncome);
  if (grossMonthlyIncome <= 0) return 0;
  return (safeNumber(monthlyMortgage) + safeNumber(monthlyTax) + safeNumber(monthlyHeating) + safeNumber(condoFees) * 0.5 + safeNumber(otherMonthlyDebts)) / grossMonthlyIncome;
}

export function stressTestRate(contractRate) {
  return Math.max(5.25, safeNumber(contractRate) + 2);
}

export function ontarioLTT(price) {
  price = safeNumber(price);
  let tax = 0;
  if (price > 2000000) tax += (price - 2000000) * 0.025;
  if (price > 400000) tax += (Math.min(price, 2000000) - 400000) * 0.02;
  if (price > 250000) tax += (Math.min(price, 400000) - 250000) * 0.015;
  if (price > 55000) tax += (Math.min(price, 250000) - 55000) * 0.01;
  if (price > 0) tax += Math.min(price, 55000) * 0.005;
  return tax;
}

export function torontoLTT(price) {
  return ontarioLTT(price);
}

export function ontarioFTHBRebate(ontarioTax) {
  return Math.min(safeNumber(ontarioTax), 4000);
}

export function paymentBreakdown(loanAmount, annualRate, years, paymentNumber) {
  const payment = monthlyPayment(loanAmount, annualRate, years);
  if (payment <= 0) return { payment: 0, principal: 0, interest: 0, balance: safeNumber(loanAmount) };
  const r = safeNumber(annualRate) / 100 / 12;
  const n = Math.max(1, safeNumber(paymentNumber, 1));
  const balance = r > 0
    ? safeNumber(loanAmount) * Math.pow(1 + r, n - 1) - payment * (Math.pow(1 + r, n - 1) - 1) / r
    : Math.max(0, safeNumber(loanAmount) - payment * (n - 1));
  const interest = balance * r;
  const principal = payment - interest;
  return { payment, principal, interest, balance: Math.max(0, balance - principal) };
}

function simulatePayoff(principal, annualRate, years, monthlyEquivalentExtra = 0, paymentOverride = null) {
  let balance = safeNumber(principal);
  const r = safeNumber(annualRate) / 100 / 12;
  const scheduled = paymentOverride ?? monthlyPayment(balance, annualRate, years);
  let months = 0;
  let interest = 0;
  while (balance > 0.01 && months < years * 12 + 600) {
    const interestPayment = balance * r;
    const principalPayment = Math.max(0, scheduled + monthlyEquivalentExtra - interestPayment);
    interest += interestPayment;
    balance = Math.max(0, balance - principalPayment);
    months += 1;
  }
  return { months, interest };
}

export function acceleratedBiWeeklyComparison(principal, annualRate, years) {
  const monthly = monthlyPayment(principal, annualRate, years);
  const normal = simulatePayoff(principal, annualRate, years, 0, monthly);
  const acceleratedBiWeeklyPayment = monthly / 2;
  const acceleratedMonthlyEquivalent = acceleratedBiWeeklyPayment * 26 / 12;
  const accelerated = simulatePayoff(principal, annualRate, years, acceleratedMonthlyEquivalent - monthly, monthly);
  return {
    monthlyPayment: monthly,
    biWeeklyPayment: monthly * 12 / 26,
    acceleratedBiWeeklyPayment,
    normalInterest: normal.interest,
    acceleratedInterest: accelerated.interest,
    interestSaved: Math.max(0, normal.interest - accelerated.interest),
    monthsSaved: Math.max(0, normal.months - accelerated.months),
  };
}

export function closingCostEstimate({ purchasePrice, downPayment, isToronto = false, isFirstTimeBuyer = false } = {}) {
  purchasePrice = safeNumber(purchasePrice);
  downPayment = safeNumber(downPayment);
  const provincialLtt = ontarioLTT(purchasePrice);
  const municipalLtt = isToronto ? torontoLTT(purchasePrice) : 0;
  const rebate = isFirstTimeBuyer ? ontarioFTHBRebate(provincialLtt) + (isToronto ? Math.min(municipalLtt, 4475) : 0) : 0;
  const netLtt = Math.max(0, provincialLtt + municipalLtt - rebate);
  const legal = 1800;
  const titleInsurance = Math.max(350, purchasePrice * 0.0007);
  const appraisal = 500;
  const adjustments = Math.max(750, purchasePrice * 0.0015);
  const totalClosingCosts = netLtt + legal + titleInsurance + appraisal + adjustments;
  return { downPayment, provincialLtt, municipalLtt, rebate, netLtt, legal, titleInsurance, appraisal, adjustments, totalClosingCosts, totalCashRequired: downPayment + totalClosingCosts };
}

export function helocRoom(homeValue, mortgageBalance, maxLtv = 0.8) {
  const maxBorrowing = safeNumber(homeValue) * safeNumber(maxLtv, 0.8);
  const available = Math.max(0, maxBorrowing - safeNumber(mortgageBalance));
  return { maxBorrowing, available, ltv: safeNumber(homeValue) > 0 ? safeNumber(mortgageBalance) / safeNumber(homeValue) : 0 };
}

export function mortgagePenaltyEstimate({ mortgageBalance, currentRate, currentPostedRate, comparisonRate, monthsRemaining, mortgageType } = {}) {
  mortgageBalance = safeNumber(mortgageBalance);
  currentRate = safeNumber(currentRate);
  currentPostedRate = safeNumber(currentPostedRate, currentRate);
  comparisonRate = safeNumber(comparisonRate, Math.max(0, currentRate - 1));
  monthsRemaining = safeNumber(monthsRemaining);
  const threeMonthInterest = mortgageBalance * (currentRate / 100) / 4;
  const rateDiff = Math.max(0, currentPostedRate - comparisonRate) / 100;
  const ird = mortgageBalance * rateDiff * (monthsRemaining / 12);
  const estimatedPenalty = mortgageType === 'variable' ? threeMonthInterest : Math.max(threeMonthInterest, ird);
  return { threeMonthInterest, ird, estimatedPenalty };
}

export function selfEmployedIncomeEstimate({ netIncome, cca, vehicleExpense, homeExpense, otherAddbacks, monthlyDeposits } = {}) {
  const addBackIncome = safeNumber(netIncome) + safeNumber(cca) + safeNumber(vehicleExpense) + safeNumber(homeExpense) + safeNumber(otherAddbacks);
  const depositIncome = safeNumber(monthlyDeposits) * 12;
  const usableAnnualIncome = Math.max(addBackIncome, depositIncome);
  return { addBackIncome, depositIncome, usableAnnualIncome, usableMonthlyIncome: usableAnnualIncome / 12 };
}

export function rentalCashflowEstimate({ purchasePrice, downPayment, rate, amortization = 25, rentMonthly, taxesAnnual, insuranceAnnual, maintenanceMonthly = 250, condoMonthly = 0 } = {}) {
  const loan = Math.max(0, safeNumber(purchasePrice) - safeNumber(downPayment));
  const payment = monthlyPayment(loan, rate, amortization);
  const expenses = payment + safeNumber(taxesAnnual) / 12 + safeNumber(insuranceAnnual) / 12 + safeNumber(maintenanceMonthly) + safeNumber(condoMonthly);
  const monthlyCashflow = safeNumber(rentMonthly) - expenses;
  const dscr = expenses > 0 ? safeNumber(rentMonthly) / expenses : 0;
  return { loan, payment, expenses, monthlyCashflow, annualCashflow: monthlyCashflow * 12, dscr };
}

export function rentVsBuyEstimate({ currentRent, purchasePrice, downPayment, rate, appreciation, years = 5 } = {}) {
  const loan = Math.max(0, safeNumber(purchasePrice) - safeNumber(downPayment));
  const payment = monthlyPayment(loan, rate, 25);
  const buyOutflow = (payment + safeNumber(purchasePrice) * 0.012 / 12) * 12 * years + safeNumber(downPayment);
  const rentOutflow = safeNumber(currentRent) * 12 * years;
  const futureValue = safeNumber(purchasePrice) * Math.pow(1 + safeNumber(appreciation) / 100, years);
  const balanceAfter = amortizationRows(loan, rate, 25, years * 12).at(-1)?.balance ?? loan;
  const equity = Math.max(0, futureValue - balanceAfter);
  return { payment, buyOutflow, rentOutflow, futureValue, equity, fiveYearNetDifference: equity - (buyOutflow - rentOutflow) };
}

export const propertyTaxRates = {
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

export function propertyTaxEstimate(assessedValue, city = 'toronto') {
  const selected = propertyTaxRates[city] || propertyTaxRates.toronto;
  const municipalTax = safeNumber(assessedValue) * (selected.rate / 100);
  const educationTax = safeNumber(assessedValue) * (selected.education / 100);
  const annualTax = municipalTax + educationTax;
  return { city: selected.name, municipalTax, educationTax, annualTax, monthlyTax: annualTax / 12, effectiveRate: selected.rate + selected.education };
}

export function homeValueEstimate({ purchasePrice, purchaseYear, annualAppreciation, renovationValue, currentYear = new Date().getFullYear() } = {}) {
  const yearsOwned = Math.max(0, safeNumber(currentYear) - safeNumber(purchaseYear, currentYear));
  const appreciatedValue = safeNumber(purchasePrice) * Math.pow(1 + safeNumber(annualAppreciation) / 100, yearsOwned);
  const estimatedValue = appreciatedValue + safeNumber(renovationValue);
  return { yearsOwned, appreciatedValue, estimatedValue, totalGain: estimatedValue - safeNumber(purchasePrice), percentGain: safeNumber(purchasePrice) > 0 ? ((estimatedValue - safeNumber(purchasePrice)) / safeNumber(purchasePrice)) * 100 : 0 };
}

function progressiveTax(income, brackets) {
  let tax = 0;
  for (const bracket of brackets) {
    if (income <= bracket.min) continue;
    tax += (Math.min(income, bracket.max) - bracket.min) * bracket.rate;
  }
  return tax;
}

export function incomeTaxEstimateOntario({ grossIncome, rrspContribution } = {}) {
  const taxableIncome = Math.max(0, safeNumber(grossIncome) - safeNumber(rrspContribution));
  const federalBrackets = [{ min: 0, max: 55867, rate: 0.15 }, { min: 55867, max: 111733, rate: 0.205 }, { min: 111733, max: 173205, rate: 0.26 }, { min: 173205, max: 246752, rate: 0.29 }, { min: 246752, max: Infinity, rate: 0.33 }];
  const ontarioBrackets = [{ min: 0, max: 51446, rate: 0.0505 }, { min: 51446, max: 102894, rate: 0.0915 }, { min: 102894, max: 150000, rate: 0.1116 }, { min: 150000, max: 220000, rate: 0.1216 }, { min: 220000, max: Infinity, rate: 0.1316 }];
  const federalTax = progressiveTax(taxableIncome, federalBrackets);
  const provincialTax = progressiveTax(taxableIncome, ontarioBrackets);
  const totalTax = federalTax + provincialTax;
  const netIncome = safeNumber(grossIncome) - totalTax;
  const marginalRate = [...federalBrackets].reverse().find(b => taxableIncome > b.min)?.rate + [...ontarioBrackets].reverse().find(b => taxableIncome > b.min)?.rate;
  return { taxableIncome, federalTax, provincialTax, totalTax, netIncome, effectiveRate: safeNumber(grossIncome) > 0 ? totalTax / safeNumber(grossIncome) : 0, marginalRate, rrspTaxSavings: safeNumber(rrspContribution) * marginalRate };
}

export function hstNewHousingEstimate({ purchasePrice, isNewConstruction = true, isPrimaryResidence = true } = {}) {
  purchasePrice = safeNumber(purchasePrice);
  const hstAmount = isNewConstruction ? purchasePrice * 0.13 : 0;
  let federal = 0;
  let provincial = 0;
  if (isNewConstruction && isPrimaryResidence) {
    if (purchasePrice <= 350000) federal = purchasePrice * 0.05 * 0.36;
    else if (purchasePrice < 450000) federal = purchasePrice * 0.05 * 0.36 * (1 - (purchasePrice - 350000) / 100000);
    federal = Math.min(federal, 6300);
    provincial = purchasePrice <= 400000 ? purchasePrice * 0.08 * 0.75 : 24000;
  }
  const totalRebate = federal + provincial;
  return { hstAmount, federalRebate: federal, provincialRebate: provincial, totalRebate, netHST: Math.max(0, hstAmount - totalRebate) };
}

export function amortizationRows(principal, annualRate, years, months = 12) {
  const payment = monthlyPayment(principal, annualRate, years);
  const r = safeNumber(annualRate) / 100 / 12;
  let balance = safeNumber(principal);
  const rows = [];
  for (let month = 1; month <= months && balance > 0.01; month += 1) {
    const interest = balance * r;
    const principalPaid = Math.min(balance, payment - interest);
    balance = Math.max(0, balance - principalPaid);
    rows.push({ month, payment, principal: principalPaid, interest, balance });
  }
  return rows;
}

export function compareMortgageOffers({ principal, amortization, prepaymentAmount = 0, offers = [] } = {}) {
  const enriched = offers.map((offer) => {
    const termPayments = safeNumber(offer.term, 5) * 12;
    const monthly = monthlyPayment(principal, offer.rate, amortization);
    const rows = amortizationRows(principal, offer.rate, amortization, termPayments);
    const totalInterest = rows.reduce((sum, row) => sum + row.interest, 0);
    const balanceAtEnd = rows.at(-1)?.balance ?? safeNumber(principal);
    const prepay = simulatePayoff(principal, offer.rate, amortization, safeNumber(prepaymentAmount), monthly);
    return { ...offer, results: { monthlyPayment: monthly, totalInterest, balanceAtEnd, totalPaid: monthly * termPayments, monthsSavedWithPrepay: Math.max(0, amortization * 12 - prepay.months), interestSavedWithPrepay: Math.max(0, totalInterest - prepay.interest * (termPayments / Math.max(1, prepay.months))) } };
  });
  const lowestPayment = Math.min(...enriched.map(o => o.results.monthlyPayment));
  const lowestInterest = Math.min(...enriched.map(o => o.results.totalInterest));
  return enriched.map((offer) => ({ ...offer, bestLabel: offer.results.monthlyPayment === lowestPayment && offer.results.totalInterest === lowestInterest ? 'Best Overall' : offer.results.monthlyPayment === lowestPayment ? 'Lowest Payment' : offer.results.totalInterest === lowestInterest ? 'Lowest Interest' : '' }));
}
