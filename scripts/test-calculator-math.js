import assert from 'node:assert/strict';
import {
  monthlyPayment,
  cmhcPremium,
  minimumDownPayment,
  gdsRatio,
  tdsRatio,
  stressTestRate,
  ontarioLTT,
  torontoLTT,
  ontarioFTHBRebate,
  paymentBreakdown,
  acceleratedBiWeeklyComparison,
  closingCostEstimate,
  helocRoom,
  mortgagePenaltyEstimate,
  selfEmployedIncomeEstimate,
  rentalCashflowEstimate,
  rentVsBuyEstimate,
  propertyTaxEstimate,
  homeValueEstimate,
  incomeTaxEstimateOntario,
  hstNewHousingEstimate,
  compareMortgageOffers,
} from '../lib/calculator-math.js';

assert.equal(monthlyPayment(0, 5, 25), 0);
assert.ok(Math.abs(monthlyPayment(500000, 5, 25) - 2922.95) < 1);
assert.equal(cmhcPremium(700000, 140000), 0);
assert.ok(cmhcPremium(700000, 70000) > 0);
assert.equal(minimumDownPayment(500000), 25000);
assert.equal(minimumDownPayment(800000), 55000);
assert.equal(minimumDownPayment(1200000), 240000);
assert.equal(stressTestRate(2.99), 5.25);
assert.equal(stressTestRate(4.5), 6.5);
assert.ok(Math.abs(gdsRatio(2500, 400, 100, 10000) - 0.3) < 0.0001);
assert.ok(Math.abs(tdsRatio(2500, 400, 100, 600, 10000) - 0.36) < 0.0001);
assert.ok(ontarioLTT(800000) > 0);
assert.equal(torontoLTT(800000), ontarioLTT(800000));
assert.equal(ontarioFTHBRebate(3500), 3500);
assert.equal(ontarioFTHBRebate(7000), 4000);
const breakdown = paymentBreakdown(500000, 5, 25, 1);
assert.ok(breakdown.payment > 0 && breakdown.principal > 0 && breakdown.interest > 0);
const biweekly = acceleratedBiWeeklyComparison(500000, 5, 25);
assert.ok(biweekly.acceleratedBiWeeklyPayment > 0 && biweekly.interestSaved > 0);
const close = closingCostEstimate({ purchasePrice: 800000, downPayment: 80000, isToronto: true, isFirstTimeBuyer: true });
assert.ok(close.totalCashRequired > close.downPayment);
assert.equal(helocRoom(1000000, 500000).available, 300000);
assert.ok(mortgagePenaltyEstimate({ mortgageBalance: 500000, currentRate: 4, currentPostedRate: 5, comparisonRate: 3.5, monthsRemaining: 24, mortgageType: 'fixed' }).estimatedPenalty > 0);
assert.ok(selfEmployedIncomeEstimate({ netIncome: 100000, cca: 10000, vehicleExpense: 5000, monthlyDeposits: 12000 }).usableAnnualIncome > 0);
assert.ok(Number.isFinite(rentalCashflowEstimate({ purchasePrice: 700000, downPayment: 140000, rate: 5, rentMonthly: 3500, taxesAnnual: 5000, insuranceAnnual: 1200 }).monthlyCashflow));
assert.ok(Number.isFinite(rentVsBuyEstimate({ currentRent: 2800, purchasePrice: 700000, downPayment: 70000, rate: 5, appreciation: 3 }).fiveYearNetDifference));
assert.ok(propertyTaxEstimate(700000, 'toronto').annualTax > 0);
assert.ok(homeValueEstimate({ purchasePrice: 500000, purchaseYear: 2020, annualAppreciation: 5, renovationValue: 20000, currentYear: 2026 }).estimatedValue > 500000);
assert.ok(incomeTaxEstimateOntario({ grossIncome: 100000, rrspContribution: 10000 }).netIncome > 0);
assert.ok(hstNewHousingEstimate({ purchasePrice: 600000, isNewConstruction: true, isPrimaryResidence: true }).netHST > 0);
const offers = compareMortgageOffers({ principal: 500000, amortization: 25, prepaymentAmount: 200, offers: [
  { id: 1, lender: 'A', rate: 4.5, term: 5, type: 'fixed' },
  { id: 2, lender: 'B', rate: 5, term: 5, type: 'fixed' },
] });
assert.equal(offers.length, 2);
assert.equal(offers[0].bestLabel, 'Best Overall');
assert.ok(offers[0].results.monthlyPayment < offers[1].results.monthlyPayment);
console.log('calculator math tests passed');
