const demoLenders = [
  {
    id: "first-national",
    name: "First National",
    type: "monoline",
    brandColor: "#005DAA",
    brandAccent: "#00A3E0",
    website: "https://www6.firstnational.ca/",
    portal: "MERLIN broker resources",
    region: "Ontario",
    bdm: "Ontario Broker Support Desk",
    email: "brokerinfo@firstnational.ca",
    phone: "1-888-488-0794",
    rates: { insuredFixed: 4.79, variable: 4.95, conventional: 4.99, alt: null },
    updated: "May 31, 2026",
    programs: ["Insured purchase", "Conventional purchase", "Rental", "Switch/transfer"],
    guidelines: [
      "Monoline lender focused on broker-originated residential mortgages.",
      "Useful fit for prime insured and conventional files with standard income documentation.",
      "Confirm current rate holds, prepayment privileges, rental offsets, and exception paths in the lender portal."
    ],
    policyNote: "Demo pricing. Replace with your daily First National rate sheet."
  },
  {
    id: "mcap",
    name: "MCAP",
    type: "monoline",
    brandColor: "#004B8D",
    brandAccent: "#F28C28",
    website: "https://www.mcap.com/",
    portal: "MCAP broker portal",
    region: "Ontario",
    bdm: "Regional Sales Team",
    email: "brokersupport@mcap.com",
    phone: "1-800-265-2624",
    rates: { insuredFixed: 4.84, variable: 5.05, conventional: 5.04, alt: null },
    updated: "May 31, 2026",
    programs: ["Insured purchase", "Conventional purchase", "Rental", "Renewal", "Switch/transfer"],
    guidelines: [
      "Broker-channel lender with prime residential mortgage products.",
      "Good placement candidate for clean prime income, switches, and purchase files.",
      "Confirm rental policy, rate hold windows, and prepayment rules against the current lender notice."
    ],
    policyNote: "Demo pricing. Replace with your daily MCAP bulletin."
  },
  {
    id: "merix",
    name: "MERIX Financial",
    type: "monoline",
    brandColor: "#532B88",
    brandAccent: "#00A7C8",
    website: "https://www.merixfinancial.com/",
    portal: "MyMERIX",
    region: "Ontario",
    bdm: "Ontario Relationship Manager",
    email: "brokerrelations@merixfinancial.com",
    phone: "1-877-637-4911",
    rates: { insuredFixed: 4.89, variable: 5.09, conventional: 5.09, alt: null },
    updated: "May 31, 2026",
    programs: ["Insured purchase", "Conventional purchase", "Rental", "Refinance"],
    guidelines: [
      "Prime lender option for standard residential applications through the broker channel.",
      "Consider for files where flexible servicing and retention support matter.",
      "Confirm current compensation, documentation, and prepayment features before submission."
    ],
    policyNote: "Demo pricing. Replace with your daily MERIX sheet."
  },
  {
    id: "td",
    name: "TD Canada Trust",
    type: "bank",
    brandColor: "#008A00",
    brandAccent: "#54B948",
    website: "https://www.td.com/ca/en/personal-banking/products/mortgages",
    portal: "TD broker channel / lender desk",
    region: "Ontario",
    bdm: "TD Broker Services",
    email: "Use assigned BDM contact",
    phone: "Use assigned BDM phone",
    rates: { insuredFixed: 4.94, variable: 5.15, conventional: 5.14, alt: null },
    updated: "May 31, 2026",
    programs: ["Bank mortgage", "Switch/transfer", "Refinance", "New construction"],
    guidelines: [
      "Major bank option for clients who value branch ecosystem and bank servicing.",
      "Confirm broker-channel availability and documents with your assigned TD contact.",
      "Useful to compare against monoline pricing, portability, collateral charge, and refinance requirements."
    ],
    policyNote: "Demo pricing. Replace with official broker-channel rates."
  },
  {
    id: "scotia",
    name: "Scotiabank",
    type: "bank",
    brandColor: "#EC111A",
    brandAccent: "#8A1538",
    website: "https://www.scotiabank.com/ca/en/personal/mortgages.html",
    portal: "Scotia Mortgage Authority",
    region: "Ontario",
    bdm: "SMA Relationship Desk",
    email: "Use assigned BDM contact",
    phone: "Use assigned BDM phone",
    rates: { insuredFixed: 4.99, variable: 5.2, conventional: 5.19, alt: null },
    updated: "May 31, 2026",
    programs: ["Bank mortgage", "Purchase plus improvements", "Switch/transfer", "Refinance"],
    guidelines: [
      "Bank lender placement option with broker-channel process through Scotia Mortgage Authority.",
      "Confirm policy differences between posted, discretionary, and broker-channel rates.",
      "Review insurer rules, income policy, and property requirements before advising clients."
    ],
    policyNote: "Demo pricing. Replace with the daily SMA rate notice."
  },
  {
    id: "bmo",
    name: "BMO",
    type: "bank",
    brandColor: "#0079C1",
    brandAccent: "#E31837",
    website: "https://www.bmo.com/mortgages",
    portal: "BMO BrokerEdge / mortgage specialist channel",
    region: "Ontario",
    bdm: "BMO BrokerEdge Desk",
    email: "access@bmobrokeredge.com",
    phone: "Use assigned BMO contact",
    rates: { insuredFixed: 4.96, variable: 5.19, conventional: 5.16, alt: null },
    updated: "May 31, 2026",
    programs: ["Bank mortgage", "Insured purchase", "Conventional purchase", "Refinance", "Switch/transfer"],
    guidelines: [
      "Major bank option with public mortgage products and a broker registration path through BrokerEdge.",
      "Useful for prime bank files where a borrower values branch banking, rate-hold certainty, and bank servicing.",
      "Confirm broker-channel access, compensation, rate specials, and property/income policy with BMO before submission."
    ],
    policyNote: "Demo pricing. Replace with the current BMO BrokerEdge or bank-channel notice."
  },
  {
    id: "national-bank",
    name: "National Bank",
    type: "bank",
    brandColor: "#E31B23",
    brandAccent: "#1F3C88",
    website: "https://www.nationalbank.com/",
    portal: "National Bank mortgage resources",
    region: "Ontario",
    bdm: "National Bank Mortgage Desk",
    email: "Use assigned National Bank contact",
    phone: "Use assigned National Bank phone",
    rates: { insuredFixed: 5.01, variable: 5.22, conventional: 5.21, alt: null },
    updated: "May 31, 2026",
    programs: ["Bank mortgage", "Insured purchase", "Conventional purchase", "Refinance", "HELOC"],
    guidelines: [
      "Major Canadian bank option for prime residential lending and relationship banking.",
      "Consider for standard bank files, refinance scenarios, and clients who value broader banking advice.",
      "Confirm Ontario broker-channel process, product availability, fees, and current pricing with the assigned desk."
    ],
    policyNote: "Demo pricing. Replace with National Bank's current mortgage rate and policy bulletin."
  },
  {
    id: "equitable",
    name: "Equitable Bank",
    type: "alternative",
    brandColor: "#006A6A",
    brandAccent: "#8CC63F",
    website: "https://www.equitablebank.ca/mortgage-products",
    portal: "Equitable Bank broker resources",
    region: "Ontario",
    bdm: "Alternative Mortgage Specialist",
    email: "mortgages@eqbank.ca",
    phone: "1-866-407-0004",
    rates: { insuredFixed: null, variable: null, conventional: 5.49, alt: 6.69 },
    updated: "May 31, 2026",
    programs: ["Alternative A/B", "Self-employed", "New to Canada", "Reverse mortgage", "HELOC"],
    guidelines: [
      "Alternative lending option for broader income, credit, and net-worth scenarios.",
      "Consider where bank or monoline policy does not fit, subject to suitability and disclosure.",
      "Confirm fees, lender compensation, GDS/TDS limits, beacon requirements, and appraisal rules."
    ],
    policyNote: "Demo pricing. Replace with Equitable's current broker product sheet."
  },
  {
    id: "home-trust",
    name: "Home Trust",
    type: "alternative",
    brandColor: "#D14900",
    brandAccent: "#7A1E1E",
    website: "https://www.hometrust.ca/",
    portal: "Home Trust broker resources",
    region: "Ontario",
    bdm: "Ontario Alternative Lending Desk",
    email: "broker.relations@hometrust.ca",
    phone: "1-855-270-3630",
    rates: { insuredFixed: null, variable: null, conventional: 5.59, alt: 6.79 },
    updated: "May 31, 2026",
    programs: ["Alternative lending", "Self-employed", "Bruised credit", "Equity-focused refinance"],
    guidelines: [
      "Alternative lender candidate for clients outside prime policy.",
      "Suitable files require clear borrower benefit, strong disclosure, and current fee confirmation.",
      "Confirm property type, location, max LTV, income reasonability, and exit strategy."
    ],
    policyNote: "Demo pricing. Replace with current Home Trust broker bulletin."
  },
  {
    id: "rfa",
    name: "RFA",
    type: "monoline",
    brandColor: "#003A70",
    brandAccent: "#00A3AD",
    website: "https://www.admin.rfa.ca/brokers",
    portal: "RFA broker resources",
    region: "Ontario",
    bdm: "RVP Ontario",
    email: "Use assigned RVP contact",
    phone: "Use assigned RVP phone",
    rates: { insuredFixed: 4.92, variable: 5.14, conventional: 5.12, alt: 6.49 },
    updated: "May 31, 2026",
    programs: ["Prime", "Alternative", "Rental", "Refinance", "Switch/transfer"],
    guidelines: [
      "Broker-focused lender with prime and alternative placement paths.",
      "Useful when comparing prime rate competitiveness against flexible program options.",
      "Confirm registration, submission route, and current RVP coverage before placing a file."
    ],
    policyNote: "Demo pricing. Replace with the current RFA rate card."
  },
  {
    id: "meridian",
    name: "Meridian Credit Union",
    type: "credit union",
    brandColor: "#007A3D",
    brandAccent: "#F4B000",
    website: "https://www.meridiancu.ca/ready-for-what-if",
    portal: "Meridian mortgage resources",
    region: "Ontario",
    bdm: "Credit Union Mortgage Desk",
    email: "Use assigned Meridian contact",
    phone: "1-866-592-2226",
    rates: { insuredFixed: 4.97, variable: 5.18, conventional: 5.18, alt: null },
    updated: "May 31, 2026",
    programs: ["Credit union mortgage", "Insured purchase", "Conventional purchase", "HELOC", "Switch/transfer"],
    guidelines: [
      "Ontario credit union option for member-focused residential mortgage placement.",
      "Review membership, branch/channel rules, appraisal requirements, and property location policy.",
      "Confirm broker availability, service levels, and current rate hold before submission."
    ],
    policyNote: "Demo pricing. Replace with Meridian's current mortgage notice."
  },
  {
    id: "duca",
    name: "DUCA Credit Union",
    type: "credit union",
    brandColor: "#006B54",
    brandAccent: "#F6A800",
    website: "https://www.duca.com/personal/mortgages",
    portal: "DUCA mortgage resources",
    region: "Ontario",
    bdm: "Mobile Mortgage Specialist Desk",
    email: "Use assigned DUCA contact",
    phone: "1-866-900-3822",
    rates: { insuredFixed: 5.02, variable: 5.24, conventional: 5.22, alt: null },
    updated: "May 31, 2026",
    programs: ["Credit union mortgage", "Conventional purchase", "Refinance", "HELOC", "Self-employed"],
    guidelines: [
      "Ontario credit union option with mobile mortgage specialist support.",
      "Useful for clients who prefer a member-owned institution and relationship-based servicing.",
      "Confirm membership requirements, income documentation, fees, and geographic availability."
    ],
    policyNote: "Demo pricing. Replace with DUCA's current mortgage product sheet."
  },
  {
    id: "icici",
    name: "ICICI Bank Canada",
    type: "bank",
    brandColor: "#B02A30",
    brandAccent: "#F58220",
    website: "https://www.icicibank.ca/personal-banking/mortgage/mortgage-program",
    portal: "ICICI mortgage specialist channel",
    region: "Ontario",
    bdm: "ICICI Mortgage Specialist Desk",
    email: "icicibankmortgagecare@lenderservices.ca",
    phone: "Use assigned ICICI contact",
    rates: { insuredFixed: 5.08, variable: 5.28, conventional: 5.27, alt: null },
    updated: "May 31, 2026",
    programs: ["Bank mortgage", "Insured purchase", "Conventional purchase", "Refinance", "Switch/transfer", "Rental"],
    guidelines: [
      "Bank lender with purchase, refinance, switch, and investment-property mortgage solutions.",
      "Useful for newcomer, international banking relationship, and conventional bank scenarios where ICICI appetite fits.",
      "Confirm iGlobal eligibility, mortgage specialist process, income documentation, and current posted/special rates."
    ],
    policyNote: "Demo pricing. Replace with ICICI Bank Canada's current mortgage program sheet."
  },
  {
    id: "manulife",
    name: "Manulife Bank",
    type: "bank",
    brandColor: "#00A758",
    brandAccent: "#00573F",
    website: "https://www.manulifebank.ca/personal-banking/mortgages.html",
    portal: "Manulife Bank mortgage resources",
    region: "Ontario",
    bdm: "Manulife Bank Mortgage Desk",
    email: "manulife_bank@manulife.ca",
    phone: "1-877-765-2265",
    rates: { insuredFixed: 5.04, variable: 5.25, conventional: 5.24, alt: null },
    updated: "May 31, 2026",
    programs: ["Bank mortgage", "Conventional purchase", "Refinance", "HELOC", "Switch/transfer"],
    guidelines: [
      "Bank option known for Manulife One and Manulife Bank Select mortgage structures.",
      "Useful for clients who want flexible mortgage banking, HELOC-style access, or all-in-one debt management.",
      "Confirm suitability, collateral registration, account requirements, prepayment terms, and current pricing."
    ],
    policyNote: "Demo pricing. Replace with Manulife Bank's current mortgage product and rate sheet."
  }
];

demoLenders.push(
  {
    id: "alterna",
    name: "Alterna Savings",
    type: "credit union",
    brandColor: "#005A8B",
    brandAccent: "#7AC143",
    website: "https://www.alterna.ca/en/personal/mortgages",
    portal: "Alterna mortgage resources",
    region: "Ontario",
    bdm: "Alterna Mortgage Desk",
    email: "Use assigned Alterna contact",
    phone: "1-877-560-0100",
    rates: { insuredFixed: null, variable: null, conventional: null, alt: null },
    updated: "Policy desk",
    programs: ["Credit union mortgage", "Insured purchase", "Conventional purchase", "Refinance", "Switch/transfer", "New to Canada", "HELOC"],
    guidelines: [
      "Ontario credit union option for members seeking purchase, refinance, renewal, switch, and HELOC-style mortgage solutions.",
      "Useful for relationship-based credit union placement where membership, property location, and income documentation fit.",
      "Confirm current broker/channel availability, membership requirements, rates, and underwriting overlays before submission."
    ],
    policyNote: "Policy desk entry. Add current Alterna rate sheet and assigned contact details when available."
  },
  {
    id: "magenta",
    name: "Magenta Capital",
    type: "private lender",
    brandColor: "#C0187A",
    brandAccent: "#6B1F7A",
    website: "https://magentacapital.ca/mortgages/residential-brokers/",
    portal: "Magenta broker resources",
    region: "Ontario",
    bdm: "Magenta Broker Support",
    email: "broker@magentacapital.ca",
    phone: "1-855-624-3682",
    rates: { insuredFixed: null, variable: null, conventional: null, alt: null },
    updated: "Policy desk",
    programs: ["Private / MIC / MIE", "No Doc", "Verifiable Income", "Residential Rentals", "Residential Seconds", "Alternative lending", "Equity-focused refinance"],
    guidelines: [
      "MIC/private lender option for brokers needing equity-based or alternative placement outside prime policy.",
      "Public broker material references No Doc, Verifiable Income, Residential Rentals, Residential Seconds, and Student Rentals.",
      "Confirm current rates, fees, terms, eligible geography, LTV, documentation, and exit strategy before presenting to a borrower."
    ],
    policyNote: "Policy desk entry. Private/MIC files require suitability review, fee disclosure, borrower benefit, and a clear exit strategy."
  }
);

const storageKey = "ontarioBrokerRateDesk.lenders";
const preferredLenderStorageKey = "ontarioBrokerRateDesk.preferredLender";
let lenders = [];
let activeFilter = "all";
let activeLenderId = "";
let activeProgram = "Alternative A/B";
let preferredLenderId = localStorage.getItem(preferredLenderStorageKey) || "";
let activeLenderPage = 1;
let activeCreditScore = "all";
let activeLtv = "all";
let activePurpose = "all";
let activeCategory = "all";
const lendersPerPage = 4;

const purposeProgramMap = {
  purchase: ["Insured purchase", "Conventional purchase", "Purchase plus improvements", "New construction", "New to Canada", "Bank mortgage", "Credit union mortgage", "Prime"],
  refinance: ["Refinance", "Equity-focused refinance", "HELOC", "Alternative lending", "Reverse mortgage", "Residential Seconds"],
  "transfer-switch": ["Switch/transfer", "Renewal"],
  rental: ["Rental", "Residential Rentals"],
  "private-mic": ["Private / MIC / MIE", "No Doc", "Verifiable Income", "Residential Seconds", "Residential Rentals"]
};

const categoryProgramMap = {
  insured: ["Insured purchase", "High ratio", "CMHC Purchase", "Sagen Homebuyer 95"],
  conventional: ["Conventional purchase", "Bank mortgage", "Prime"],
  rental: ["Rental", "Residential Rentals"],
  "self-employed": ["Self-employed", "Alternative A/B", "Alternative lending"],
  "new-to-canada": ["New to Canada"],
  heloc: ["HELOC"],
  "private-mic": ["Private / MIC / MIE", "No Doc", "Verifiable Income", "Residential Seconds"]
};

const programColorMap = {
  "Alternative": "#7C3AED",
  "Alternative A/B": "#7C3AED",
  "Alternative lending": "#7C3AED",
  "Bank mortgage": "#0E7490",
  "Bruised credit": "#B45309",
  "Conventional purchase": "#2563EB",
  "Credit union mortgage": "#15803D",
  "Equity-focused refinance": "#B45309",
  "HELOC": "#0891B2",
  "Insured purchase": "#16A34A",
  "New construction": "#475569",
  "New to Canada": "#DB2777",
  "No Doc": "#C0187A",
  "Prime": "#16A34A",
  "Private / MIC / MIE": "#C0187A",
  "Purchase plus improvements": "#0D9488",
  "Refinance": "#EA580C",
  "Renewal": "#64748B",
  "Rental": "#9333EA",
  "Residential Rentals": "#9333EA",
  "Residential Seconds": "#BE185D",
  "Reverse mortgage": "#A16207",
  "Self-employed": "#C026D3",
  "Switch/transfer": "#0284C7",
  "Verifiable Income": "#0F766E"
};

const programDetails = {
  "Alternative A/B": {
    summary: "Used when the borrower has a good story but does not fit prime bank or monoline policy.",
    minScore: "Approx. 600+",
    fit: ["Expanded income documentation", "Credit exceptions", "Higher net-worth or equity-driven files"],
    watch: ["Lender fees", "Broker compensation disclosure", "Exit strategy", "Appraisal and max LTV"]
  },
  "Self-employed": {
    summary: "For business owners where taxable income, retained earnings, or stated income needs deeper review.",
    minScore: "Approx. 620+ prime, 580+ alternative",
    fit: ["T1 generals and NOAs", "Business financials", "Bank-statement reasonability", "Alt-income programs"],
    watch: ["Income add-backs", "GST/HST arrears", "Business age", "Reasonability letter requirements"]
  },
  "New to Canada": {
    summary: "For newcomers building Canadian credit history or using international income/assets.",
    minScore: "Limited credit accepted with substitutes",
    fit: ["Permanent residents", "Work-permit borrowers", "Limited Canadian credit", "Foreign down payment sources"],
    watch: ["Immigration status", "Down payment trail", "Credit substitutes", "Insurer and lender overlays"]
  },
  "Reverse mortgage": {
    summary: "For older homeowners looking to access home equity without regular mortgage payments.",
    minScore: "Often equity-led; confirm lender requirement",
    fit: ["Age-qualified borrowers", "Equity-rich properties", "Debt consolidation", "Retirement cash flow planning"],
    watch: ["Independent legal advice", "Long-term equity impact", "Occupancy", "Family/disclosure conversations"]
  },
  HELOC: {
    summary: "A revolving home-equity line for flexible access to available equity.",
    minScore: "Approx. 680+",
    fit: ["Low-LTV owner-occupied files", "Renovation funds", "Emergency liquidity", "Debt consolidation"],
    watch: ["Registration type", "Prime-rate changes", "Minimum payments", "Combined LTV limits"]
  },
  "Credit union mortgage": {
    summary: "Member-focused lending through Ontario credit unions with relationship-based servicing.",
    minScore: "Approx. 650+",
    fit: ["Clients open to membership", "Local relationship banking", "Conventional and HELOC scenarios"],
    watch: ["Membership rules", "Branch/channel availability", "Property location", "Appraisal and payout process"]
  },
  "Insured purchase": {
    summary: "High-ratio purchase files backed by default mortgage insurance.",
    minScore: "Approx. 600+ insurer minimum",
    fit: ["Less than 20% down", "Owner-occupied purchase", "Standard income documentation"],
    watch: ["Insurer rules", "Purchase price caps", "Amortization limits", "Down payment source"]
  },
  "Conventional purchase": {
    summary: "Purchase files with at least 20% down and no default insurance requirement.",
    minScore: "Approx. 650+",
    fit: ["Prime borrowers", "Stronger down payment", "Flexible amortization and property options"],
    watch: ["Appraisal", "Debt ratios", "Property type", "Rate premium versus insured pricing"]
  },
  Refinance: {
    summary: "Replacing or increasing a mortgage for equity take-out, consolidation, or restructuring.",
    minScore: "Approx. 650+ prime, 580+ alternative",
    fit: ["Debt consolidation", "Renovations", "Investment capital", "Payment restructuring"],
    watch: ["Max LTV", "Penalty math", "Borrower benefit", "Legal and appraisal costs"]
  },
  Rental: {
    summary: "Investment property lending where rental income treatment can determine lender fit.",
    minScore: "Approx. 680+ prime, 620+ alternative",
    fit: ["Long-term rentals", "Portfolio borrowers", "Purchase or refinance", "Market rent support"],
    watch: ["Rental offset/add-back", "Lease documentation", "Vacancy assumptions", "Property cash flow"]
  },
  "Switch/transfer": {
    summary: "Moving an existing mortgage to a new lender without increasing principal.",
    minScore: "Approx. 650+",
    fit: ["Maturity transfers", "Better rate/service", "Prime clean files"],
    watch: ["Collateral charge", "Payout statement", "Registration costs", "No new money rules"]
  },
  "Private / MIC / MIE": {
    summary: "Private mortgage placement through mortgage investment corporations or exempt-market style lending where equity and exit strategy drive the file.",
    minScore: "Equity-led; confirm lender minimum",
    fit: ["Short-term bridge", "Bruised credit", "Equity-focused refinance", "Complex income"],
    watch: ["Fees", "Term and renewal risk", "Appraisal/location limits", "Exit strategy"]
  },
  "No Doc": {
    summary: "Private/MIC product path where income documentation is limited and equity, property, and exit strategy carry more weight.",
    minScore: "Equity-led; confirm lender minimum",
    fit: ["Strong equity", "Marketable property", "Short-term solution", "Clear repayment/exit plan"],
    watch: ["Lower LTV", "Higher fees", "Property marketability", "Borrower suitability"]
  },
  "Verifiable Income": {
    summary: "Private/MIC product path where income can be verified but the file may not fit prime bank or monoline policy.",
    minScore: "Approx. 600+ guide; confirm lender minimum",
    fit: ["Income can be supported", "Credit or ratio exception", "Clear property value", "Defined exit plan"],
    watch: ["Income reasonability", "Debt service comfort", "Fee disclosure", "Renewal plan"]
  },
  "Residential Rentals": {
    summary: "Private/MIC rental property lending where marketability, lease/rent support, and equity are central.",
    minScore: "Approx. 600+ guide; confirm lender minimum",
    fit: ["Rental purchases", "Rental refinance", "Portfolio cleanup", "Market-rent support"],
    watch: ["Rental worksheet", "Lease support", "Vacancy assumptions", "Illegal or short-term rental restrictions"]
  },
  "Residential Seconds": {
    summary: "Second mortgage placement behind an existing first mortgage, typically for equity take-out or short-term restructuring.",
    minScore: "Approx. 650+ for seconds where required",
    fit: ["Second mortgage", "Debt consolidation", "Short-term liquidity", "Bridge to refinance/sale"],
    watch: ["Combined LTV", "First mortgage terms", "Exit strategy", "Higher cost disclosure"]
  }
};

const programPolicyProfiles = {
  "Insured purchase": {
    minScore: "600+ insurer minimum",
    geography: "Ontario and eligible Canadian owner-occupied markets",
    maxLtv: "Up to 95%",
    features: ["High-ratio default-insured purchase", "Best insured pricing tier", "Gifted down payment may be allowed"],
    exceptions: ["New to Canada, purchase plus improvements, and limited credit may fit with insurer approval"],
    exclusions: ["Non-owner-occupied rentals", "Unverifiable down payment", "Uninsurable property or income"]
  },
  "Conventional purchase": {
    minScore: "650+ typical prime",
    geography: "Ontario marketable residential areas",
    maxLtv: "Up to 80%",
    features: ["20%+ down payment", "More property and amortization flexibility", "30-year pricing may be available"],
    exceptions: ["Stronger net worth, strong liquidity, or relationship strength may support exceptions"],
    exclusions: ["Weak appraisal support", "Unmarketable property", "Debt-service ratios outside policy"]
  },
  Refinance: {
    minScore: "650+ prime, 580+ alternative",
    geography: "Ontario marketable residential areas",
    maxLtv: "Up to 80% prime, often 75%-80% alternative",
    features: ["Equity take-out", "Debt consolidation", "Renovation or restructuring purpose"],
    exceptions: ["Alternative lenders may consider bruised credit with equity and clear exit plan"],
    exclusions: ["No borrower benefit", "Unresolved legal/tax issues", "Property not acceptable to lender"]
  },
  Rental: {
    minScore: "680+ prime, 620+ alternative",
    geography: "Urban/suburban rental markets with market rent support",
    maxLtv: "Up to 80%, lender-dependent",
    features: ["Rental offset/add-back policies", "Portfolio borrower support", "Purchase or refinance placement"],
    exceptions: ["Market rent or lease alternatives may be considered by some lenders"],
    exclusions: ["Illegal units", "Weak cash flow", "Short-term rental reliance unless allowed"]
  },
  "Switch/transfer": {
    minScore: "650+ typical prime",
    geography: "Ontario properties acceptable to new lender",
    maxLtv: "Usually existing approved balance; insured transfers may differ",
    features: ["Maturity transfer", "Lower-cost move to new lender", "Often simpler than refinance"],
    exceptions: ["Collateral charge or small new money may require refinance treatment"],
    exclusions: ["Mortgage arrears", "Unsupported property value", "New funds beyond switch rules"]
  },
  "Self-employed": {
    minScore: "620+ prime, 580+ alternative",
    geography: "Ontario, with stronger preference for marketable urban/suburban property",
    maxLtv: "Up to 90% insured, 80% conventional, often 75%-80% alternative",
    features: ["Full-document BFS", "Income add-backs", "Bank-statement or reasonability review"],
    exceptions: ["Stated-income or alternative income may fit with fees and lower LTV"],
    exclusions: ["Unpaid tax arrears", "Business too new", "Income not reasonable for industry"]
  },
  "New to Canada": {
    minScore: "Limited credit may be accepted with substitutes",
    geography: "Ontario, subject to status and lender/insurer program rules",
    maxLtv: "Up to 95% insured, 80% conventional",
    features: ["Alternate credit support", "International funds review", "Newcomer-specific insurer paths"],
    exceptions: ["Foreign credit, rental history, or bank history may support limited Canadian credit"],
    exclusions: ["Unclear immigration status", "Unverified foreign funds", "Income not acceptable in Canada"]
  },
  HELOC: {
    minScore: "680+ typical",
    geography: "Urban/suburban Ontario properties with strong marketability",
    maxLtv: "65% standalone, up to 80% combined where allowed",
    features: ["Revolving access", "Prime-linked pricing", "Useful for renovations or liquidity"],
    exceptions: ["Combined mortgage and HELOC structures can vary by bank or credit union"],
    exclusions: ["High LTV", "Weak credit depth", "Borrower purpose or repayment capacity unclear"]
  },
  "Reverse mortgage": {
    minScore: "Often equity-led; confirm lender requirement",
    geography: "Eligible Ontario residential markets",
    maxLtv: "Age and property driven; commonly below traditional refinance LTV",
    features: ["No regular mortgage payment", "Equity release for older homeowners", "Retirement cash-flow support"],
    exceptions: ["Higher age and stronger property location may improve advance amount"],
    exclusions: ["Borrowers below age requirement", "Investment property", "No independent legal advice"]
  },
  "Bank mortgage": {
    minScore: "650+ typical bank prime",
    geography: "Ontario and lender-approved Canadian markets",
    maxLtv: "Up to 95% insured, 80% conventional/refinance",
    features: ["Branch ecosystem", "Bank servicing", "Potential bundled banking relationship"],
    exceptions: ["Relationship strength or assets may support discretionary review"],
    exclusions: ["Outside bank channel policy", "Unverified income", "Unacceptable property or debt ratios"]
  },
  "Credit union mortgage": {
    minScore: "650+ typical",
    geography: "Ontario, subject to membership and property location rules",
    maxLtv: "Up to 95% insured, 80% conventional, 65%-80% HELOC combined",
    features: ["Member relationship", "Local servicing", "Flexible relationship-based review"],
    exceptions: ["Membership strength or local relationship may support manual review"],
    exclusions: ["Outside membership field", "Unsupported location", "Unacceptable property or appraisal"]
  },
  Prime: {
    minScore: "650+ typical",
    geography: "Ontario and eligible lender markets",
    maxLtv: "Up to 95% insured, 80% conventional/refinance",
    features: ["Lowest rate paths", "Standard documents", "Clean debt-service placement"],
    exceptions: ["Minor credit or income exceptions may fit with compensating strength"],
    exclusions: ["Major credit impairment", "Unverifiable income", "No clear down payment trail"]
  },
  Alternative: {
    minScore: "580+-620+ depending lender",
    geography: "Marketable Ontario urban/suburban areas preferred",
    maxLtv: "Often 75%-80%",
    features: ["Expanded credit and income review", "BFS and stated-income reasonability", "Equity-focused placement"],
    exceptions: ["Bruised credit, recent self-employment, or non-prime debt ratios may fit"],
    exclusions: ["No exit strategy", "Poor property marketability", "Unacceptable arrears or fraud risk"]
  },
  "Alternative lending": {
    minScore: "580+-620+ depending lender",
    geography: "Marketable Ontario urban/suburban areas preferred",
    maxLtv: "Often 75%-80%",
    features: ["Expanded credit and income review", "BFS and stated-income reasonability", "Equity-focused placement"],
    exceptions: ["Bruised credit, recent self-employment, or non-prime debt ratios may fit"],
    exclusions: ["No exit strategy", "Poor property marketability", "Unacceptable arrears or fraud risk"]
  },
  "Alternative A/B": {
    minScore: "600+ guide; lower may need strong equity",
    geography: "Marketable Ontario residential areas",
    maxLtv: "Often 75%-80%",
    features: ["A/B credit placement", "Expanded income", "Manual story-based underwriting"],
    exceptions: ["Credit events may fit if explained and repayment path is clear"],
    exclusions: ["Active bankruptcy", "Weak exit plan", "Property or income outside lender appetite"]
  },
  "Bruised credit": {
    minScore: "560+-600+ with equity",
    geography: "Urban/suburban Ontario property preferred",
    maxLtv: "Often 65%-75%, sometimes 80% with strength",
    features: ["Credit story review", "Debt cleanup", "Short-term bridge back to prime"],
    exceptions: ["Paid collections, discharged proposal, or recent life event may be explainable"],
    exclusions: ["Active insolvency without lender appetite", "No repayment plan", "Ongoing arrears"]
  },
  "Equity-focused refinance": {
    minScore: "Equity-led; often 560+-600+ minimum",
    geography: "Strong Ontario marketability preferred",
    maxLtv: "Usually 65%-75%, sometimes 80%",
    features: ["Debt consolidation", "Arrears cleanup", "Short-term alternative solution"],
    exceptions: ["Low score may fit when equity, income, and exit strategy are strong"],
    exclusions: ["No income support", "Weak exit plan", "Property not financeable", "Fraud or title concerns"]
  },
  "Purchase plus improvements": {
    minScore: "600+ insurer minimum",
    geography: "Eligible Ontario owner-occupied purchase markets",
    maxLtv: "Up to 95% on eligible as-improved value",
    features: ["Renovation/improvement holdback", "Insured purchase plus eligible upgrades", "Improvement value support"],
    exceptions: ["Lender-controlled holdbacks and post-completion inspection may support scope changes"],
    exclusions: ["Unapproved renovations", "No contractor quote", "Major structural risk outside policy"]
  },
  "New construction": {
    minScore: "680+ typical prime",
    geography: "Approved serviced areas with acceptable build/property support",
    maxLtv: "Up to 80% conventional, insured/progress rules vary",
    features: ["Builder purchase", "Progress advance review", "New-build completion support"],
    exceptions: ["Insured or progress-advance paths may be possible with approved lender process"],
    exclusions: ["No permits", "Cost overrun risk", "Unapproved builder or incomplete project support"]
  },
  Renewal: {
    minScore: "Confirm lender; 650+ for transfer review",
    geography: "Existing lender/property area or new lender's approved region",
    maxLtv: "Usually existing balance unless refinance/new money requested",
    features: ["Maturity review", "Retention pricing", "Potential transfer opportunity"],
    exceptions: ["Minor documentation refresh may be enough if no material changes"],
    exclusions: ["Arrears", "Material credit deterioration", "New funds without refinance qualification"]
  },
  "Private / MIC / MIE": {
    minScore: "Equity-led; often 550+ guide",
    geography: "Strong Ontario urban/suburban property preferred",
    maxLtv: "Usually 65%-75%, rarely 80%",
    features: ["Short-term bridge", "Flexible income/credit", "Fast exception-based review"],
    exceptions: ["Lower score or complex income may fit with equity and clear exit"],
    exclusions: ["No exit strategy", "Remote/rural specialty property", "Fraud/title/tax concerns"]
  },
  "No Doc": {
    minScore: "Equity-led; confirm lender minimum",
    geography: "Strong, marketable urban/suburban property preferred",
    maxLtv: "Confirm by property; commonly lower than full-doc files",
    features: ["Limited income documentation", "Equity and property-value driven", "Short-term private/MIC solution"],
    exceptions: ["Complex self-employed or non-traditional income may fit with strong equity"],
    exclusions: ["Weak property marketability", "No exit strategy", "Purpose or ownership story unclear"]
  },
  "Verifiable Income": {
    minScore: "Approx. 600+ guide; confirm lender minimum",
    geography: "Ontario markets acceptable to the private lender",
    maxLtv: "Confirm by income, credit, location, and property",
    features: ["Income support available", "Manual underwriting", "Exception path where prime policy does not fit"],
    exceptions: ["Higher debt ratios or credit issues may fit with compensating equity"],
    exclusions: ["Income cannot be reasonably supported", "No borrower benefit", "Property outside appetite"]
  },
  "Residential Rentals": {
    minScore: "Approx. 600+ guide; confirm lender minimum",
    geography: "Marketable rental areas; urban/suburban preferred",
    maxLtv: "Confirm by rental income, property, location, and borrower strength",
    features: ["Rental purchase or refinance", "Lease/market-rent review", "Portfolio or cash-flow story considered"],
    exceptions: ["Market rent or alternate rent support may be reviewed where lease history is thin"],
    exclusions: ["Illegal units", "Short-term rental reliance unless allowed", "Weak property marketability"]
  },
  "Residential Seconds": {
    minScore: "Approx. 650+ where required",
    geography: "Ontario urban/suburban properties with strong value support preferred",
    maxLtv: "Confirm combined LTV; often lower than first mortgage placement",
    features: ["Second mortgage behind existing first", "Debt consolidation or short-term liquidity", "Can avoid breaking first mortgage"],
    exceptions: ["Strong equity and exit strategy may offset some credit or income weakness"],
    exclusions: ["First mortgage restrictions", "No exit plan", "Combined debt load not sustainable"]
  }
};

const policyResourceLinks = [
  {
    label: "CMHC rental income guide",
    description: "Insurer reference for owner-occupied and non-owner-occupied rental income treatment.",
    href: "https://www.cmhc-schl.gc.ca/professionals/project-funding-and-mortgage-financing/mortgage-loan-insurance/homeowner-mortgage-loan-insurance/rental-income"
  },
  {
    label: "CMHC rental income PDF",
    description: "Downloadable rental-income policy reference for mortgage loan insurance.",
    href: "https://assets.cmhc-schl.gc.ca/sf/project/cmhc/pubsandreports/mortgage-loan-insurance/mli-homeowner-rental-income-en.pdf"
  },
  {
    label: "Sagen underwriting documentation",
    description: "Documents and worksheets often used for insured submissions and rental scenarios.",
    href: "https://www.sagen.ca/ups/underwriting-documentation/"
  },
  {
    label: "Canada Guaranty Rental Advantage",
    description: "Insured rental program reference and rental treatment guidance.",
    href: "https://www.canadaguaranty.ca/wp-content/uploads/2021/04/CG-Rental-Advantage-July_2025-Eng.pdf"
  },
  {
    label: "CMLS prime rental worksheet",
    description: "Public lender worksheet for prime rental calculations.",
    href: "https://www.cmls.ca/brokers/prime-rental-worksheet"
  },
  {
    label: "CRA rental income guide",
    description: "Tax reporting reference for rental income, expenses, and T776 support.",
    href: "https://www.canada.ca/en/revenue-agency/services/forms-publications/publications/t4036.html"
  }
];

const rentalAssignmentPolicy = {
  rentalTreatment: [
    "Subject owner-occupied rental income may be considered differently from non-subject rental income; confirm whether the lender uses gross add-back, offset, or net-income treatment.",
    "Existing rental properties usually require lease support, tax documents such as T776 or statement of real estate rentals, mortgage/property tax/condo fee details, and sometimes a market-rent appraisal schedule.",
    "Unauthorized suites, short-term rentals, rooming houses, or properties with weak marketability may be excluded or treated with reduced income credit."
  ],
  switchTransfer: [
    "Switch/transfer normally means no new money beyond permitted costs; new funds, debt consolidation, or title changes may push the file into refinance policy.",
    "Collateral-charge transfers, insurer transfers, payout timing, and legal/registration requirements must be confirmed before quoting.",
    "Typical documents include mortgage statement, payout statement, property tax status, insurance, income refresh if required, and current property valuation support."
  ],
  assignment: [
    "Assignment of Agreement of Purchase and Sale files should include original APS, assignment agreement, deposit trail, builder/seller consent where applicable, and clear explanation of any assignment profit or fee.",
    "Assignment of rents and leases may be required for rental or investment properties so the lender can claim rents after default.",
    "Rapid value increases, non-arm's-length assignment, missing deposit trail, or unclear beneficial ownership should be escalated before submission."
  ]
};

const aggressiveSearchAliases = {
  conventional: ["conventional purchase", "20% down", "20 down", "80 ltv", "uninsurable", "conventional product"],
  "high ratio": ["insured purchase", "high-ratio", "highratio", "95 ltv", "default insured"],
  highratio: ["insured purchase", "high ratio", "default insured"],
  insured: ["high ratio", "insured purchase", "default insured"],
  newcomer: ["new to canada", "limited credit", "foreign funds", "work permit", "permanent resident"],
  "new canada": ["new to canada", "newcomer", "limited credit", "foreign funds"],
  rental: ["rental income", "rental worksheet", "lease", "t776", "offset", "add-back", "assignment of rents", "investment property"],
  worksheet: ["rental worksheet", "prime rental worksheet", "cmhc rental income", "cmls prime rental worksheet"],
  switch: ["switch/transfer", "transfer", "swtich", "payout statement", "collateral charge", "maturity transfer"],
  swtich: ["switch/transfer", "switch", "transfer", "payout statement"],
  transfer: ["switch/transfer", "switch", "payout statement", "maturity transfer"],
  assignment: ["assignment policy", "assignment of purchase", "assignment of rents", "assignment of leases", "rental assignment"],
  assigment: ["assignment", "assignment policy", "assignment of purchase", "assignment of rents"],
  assisgmenent: ["assignment", "assignment policy", "assignment of purchase", "assignment of rents"],
  guiedlines: ["guidelines", "underwriting guidelines", "policy breakdown"],
  guidelines: ["underwriting", "policy", "exceptions", "exclusions", "minimum score", "max ltv"],
  ltv: ["loan to value", "maximum ltv", "max ltv"],
  mic: ["private lender", "mie", "private / mic / mie"],
  mie: ["private lender", "mic", "private / mic / mie"],
  alterna: ["credit union mortgage", "alterna savings", "heLOC", "switch transfer"],
  magenta: ["mic", "private lender", "no doc", "verifiable income", "residential seconds", "residential rentals"]
};

const rateColorMap = {
  insuredFixed: "#16A34A",
  variable: "#0284C7",
  conventional: "#2563EB",
  alt: "#7C3AED"
};

const underwritingGuidelines = {
  "first-national": {
    credit: "Prime credit profile preferred; confirm beacon depth, mortgage history, and insurer overlays for high-ratio files.",
    income: "Strong fit for salaried, hourly, pension, and well-documented self-employed income with standard documents.",
    property: "Standard residential properties, switches, rentals, and conventional purchases; confirm rental offset and property type limits.",
    ltv: "Insured, insurable, conventional, refinance, and rental categories are shown in the deal desk rate grid.",
    documents: "Application, credit bureau, income documents, down payment trail, purchase agreement, appraisal when required, and payout for switches.",
    watch: "Confirm rate hold, rental treatment, exception policy, and prepayment privileges in Merlin before submission."
  },
  mcap: {
    credit: "Prime credit expected; review score, tradeline depth, mortgage repayment history, and insurer requirements.",
    income: "Best for clean income documentation, salaried borrowers, established self-employed files, and standard debt-service cases.",
    property: "Good placement path for owner-occupied, switch, refinance, and rental files where property is marketable.",
    ltv: "Use insured, insurable, uninsurable, refinance, rental, and 30-year categories from the rate sheet.",
    documents: "Income package, down payment/source of funds, MLS/purchase contract, appraisal if required, and rental support where applicable.",
    watch: "Check feature restrictions, rate hold window, rental policy, and product-specific prepayment terms."
  },
  merix: {
    credit: "Prime credit profile with clean bureau and reasonable debt servicing; confirm score overlays for insured tiers.",
    income: "Standard salaried, hourly, pension, and full-document self-employed files are the cleanest fit.",
    property: "Owner-occupied, refinance, and rental scenarios can fit subject to product and property guidelines.",
    ltv: "Deal desk rates show insured, insurable, uninsurable, refinance, rental, and variable options.",
    documents: "Income verification, down payment trail, property details, appraisal if required, and payout statement for transfers.",
    watch: "Confirm MyMERIX conditions, compensation, servicing features, and any no-frills restrictions."
  },
  td: {
    credit: "Bank-prime credit preferred; review bureau strength, total relationship, revolving utilization, and debt-service fit.",
    income: "Salaried, hourly, pension, incorporated, and self-employed files may fit with bank-specific documentation.",
    property: "Standard bank mortgage, refinance, switch, and construction/new-build cases subject to TD policy.",
    ltv: "Compare insured, insurable, conventional, refinance, rental, 30-year, and HELOC/prime-linked categories.",
    documents: "Bank income package, down payment trail, property documents, appraisal if required, and branch/channel conditions.",
    watch: "Confirm collateral charge implications, broker-channel eligibility, rate discretion, and TD prime-linked pricing."
  },
  scotia: {
    credit: "Prime bank borrower profile; confirm bureau depth, repayment conduct, and insurer/lender overlays.",
    income: "Works for standard employment, pension, and documented self-employed income within bank policy.",
    property: "Bank mortgage placement for purchases, switches, refinance, purchase plus improvements, and rentals where eligible.",
    ltv: "Use the sheet categories for insured, insurable, uninsurable, refinance, rental, and longer amortization pricing.",
    documents: "Income verification, source of funds, property contract, appraisal as required, and payout for switches.",
    watch: "Check Scotia Mortgage Authority requirements, bundle pricing conditions, and collateral/registration rules."
  },
  bmo: {
    credit: "Prime bank credit preferred; review score, credit depth, unsecured debt usage, and mortgage repayment history.",
    income: "Good for standard bank income, salaried borrowers, professional files, and documented self-employed borrowers.",
    property: "Owner-occupied, conventional, insured, refinance, switch, and rental cases subject to BMO channel policy.",
    ltv: "Deal desk rates include insured, insurable, uninsurable, refinance, rental, 30-year, and HELOC availability.",
    documents: "Income documents, down payment/source, purchase agreement, appraisal where needed, and BMO channel conditions.",
    watch: "Confirm BrokerEdge access, rate hold, compensation, appraisal requirements, and HELOC/collateral structure."
  },
  "national-bank": {
    credit: "Prime bank credit profile; confirm minimum score, credit depth, and debt-ratio policy with the desk.",
    income: "Standard employment, pension, and documented business income files are strongest.",
    property: "Bank mortgage, refinance, HELOC, and conventional purchase scenarios subject to Ontario channel availability.",
    ltv: "Use current desk pricing and confirm insured, insurable, refinance, rental, and HELOC limits before quoting.",
    documents: "Income verification, down payment trail, purchase/property documents, appraisal, and payout statement where applicable.",
    watch: "Confirm Ontario broker process, branch involvement, fees, and current rate specials."
  },
  equitable: {
    credit: "Alternative and prime-adjacent credit accepted by scenario; equity, repayment story, and exit strategy matter.",
    income: "Useful for business-for-self, stated-income reasonability, net-worth, and broader documentation files.",
    property: "Marketable urban/suburban properties, alternative refinances, HELOC, and reverse mortgage scenarios may fit.",
    ltv: "Confirm max LTV by program, property, occupancy, credit score, and documentation strength.",
    documents: "Expanded income package, bank statements or business docs, appraisal, mortgage statement, tax status, and exit strategy.",
    watch: "Disclose lender fees, broker fees, suitability, appraisal limits, and renewal/exit plan clearly."
  },
  "home-trust": {
    credit: "Alternative credit stories may be considered; repayment history, equity, and reason for bruised credit are important.",
    income: "Self-employed, equity-focused, and non-prime income cases can fit when reasonability is strong.",
    property: "Alternative lending on marketable residential property; location, condition, and exit strategy are key.",
    ltv: "Confirm maximum LTV by credit, property type, location, income strength, and product.",
    documents: "Application story, income support, appraisal, mortgage statement, property taxes, and debt payout details.",
    watch: "Review fees, legal costs, appraisal rules, borrower benefit, and clear path back to prime."
  },
  rfa: {
    credit: "Prime and alternative paths exist; confirm whether the file belongs in prime, alt, or exception pricing.",
    income: "Standard income for prime files; expanded documentation may fit through alternative programs.",
    property: "Prime, rental, refinance, switch, and alternative scenarios subject to channel and product rules.",
    ltv: "Use insured, insurable, refinance, rental, and variable categories from the deal desk sheet.",
    documents: "Income documents, down payment trail, appraisal if required, rental support, and clear submission notes.",
    watch: "Confirm RVP coverage, product lane, alternative fees, compensation, and rate-hold details."
  },
  meridian: {
    credit: "Credit union underwriting with member relationship focus; confirm score, bureau depth, and conduct requirements.",
    income: "Standard employment and business-for-self files may fit with member and product requirements.",
    property: "Ontario property focus with mortgage, HELOC, purchase, refinance, and switch opportunities.",
    ltv: "Confirm insured/conventional/HELOC LTV limits, membership requirements, and appraisal policy.",
    documents: "Income verification, membership documents, down payment trail, property details, and appraisal where required.",
    watch: "Check membership rules, geographic availability, branch involvement, and funding timelines."
  },
  duca: {
    credit: "Credit union profile with attention to score, credit depth, relationship, and overall story.",
    income: "Standard employment, self-employed, and relationship-based files may fit with full documentation.",
    property: "Ontario property, conventional purchase, refinance, HELOC, and self-employed scenarios subject to DUCA policy.",
    ltv: "Rate grid includes insured, insurable, refinance, rental, and 30-year categories where available.",
    documents: "Income package, membership requirements, source of funds, appraisal, and property details.",
    watch: "Confirm member eligibility, property location, appraisal process, and any credit union-specific conditions."
  },
  icici: {
    credit: "Bank credit expected; newcomer and international relationship context may support the overall file where eligible.",
    income: "Standard income, newcomer, rental, and international banking relationship files may need extra verification.",
    property: "Purchase, refinance, switch, and rental scenarios subject to ICICI Bank Canada policy.",
    ltv: "Confirm insured, conventional, refinance, rental, and program-specific LTV rules before quoting.",
    documents: "Income verification, immigration/newcomer documents if applicable, down payment trail, and appraisal.",
    watch: "Confirm current iGlobal/newcomer conditions, documentation depth, and mortgage specialist workflow."
  },
  manulife: {
    credit: "Prime bank credit preferred; suitability is important for flexible mortgage/HELOC-style structures.",
    income: "Best for standard income and borrowers who benefit from flexible banking and debt-management features.",
    property: "Manulife Bank Select, Manulife One, refinance, switch, and HELOC-style cases subject to product fit.",
    ltv: "Confirm Manulife One and Bank Select LTV, registration, and amortization rules before advising.",
    documents: "Income package, property documents, appraisal as needed, debt list, and suitability notes.",
    watch: "Explain collateral registration, account requirements, variable-rate exposure, and payment flexibility clearly."
  },
  "b2b-bank": {
    credit: "Bank-prime credit expected; confirm score, tradelines, debt-service ratios, and broker-channel overlays.",
    income: "Standard employment and documented self-employed income are strongest fits.",
    property: "Prime purchase, refinance, rental, and HELOC scenarios subject to B2B policy.",
    ltv: "Rate sheet includes insured, insurable, uninsurable, refinance, rental, 30-year, and HELOC categories.",
    documents: "Income documents, source of funds, purchase/property details, appraisal if required, and payout statement.",
    watch: "Confirm current channel conditions, rate hold, lender fees, and HELOC requirements."
  },
  cmls: {
    credit: "Prime credit expected; review insured score overlays, tradeline depth, and mortgage repayment history.",
    income: "Clean salaried, hourly, pension, and full-document self-employed income are best fits.",
    property: "Monoline placement for insured, insurable, refinance, rental, switch, and no-frills scenarios where eligible.",
    ltv: "Use insured, insurable, uninsurable, refinance, rental, and HELOC categories shown in the grid.",
    documents: "Income package, down payment trail, property details, appraisal if needed, and switch documents.",
    watch: "Confirm no-frills restrictions, prepayment terms, portability, and rate hold before submitting."
  },
  highclere: {
    credit: "Prime or near-prime profile depending on product; confirm minimum score and insured overlays.",
    income: "Standard documented income is preferred; confirm any self-employed or exception-income policy.",
    property: "Use for standard eligible residential properties where Highclere appetite and product availability fit.",
    ltv: "Rate grid availability varies by term and category; confirm missing categories directly with the desk.",
    documents: "Income documents, down payment trail, property details, appraisal if required, and lender conditions.",
    watch: "Confirm availability, underwriting appetite, rate hold, and feature restrictions before placement."
  },
  neo: {
    credit: "Prime profile preferred; confirm score, debt service, bureau depth, and product-specific overlays.",
    income: "Best suited to clearly documented income and straightforward borrower profiles.",
    property: "Standard purchase, refinance, and switch scenarios subject to Neo product availability.",
    ltv: "Use the available insured, insurable, refinance, and variable categories; unavailable categories should be confirmed.",
    documents: "Income package, property documents, source of funds, appraisal if needed, and payout for transfers.",
    watch: "Confirm submission channel, rate hold, prepayment features, and product limitations."
  },
  rmg: {
    credit: "Prime credit expected; review score overlays and repayment conduct for insured and conventional tiers.",
    income: "Standard income documentation and clean debt-service files fit best.",
    property: "Monoline options for insured, conventional, refinance, rental, switch, and low-rate-basic products.",
    ltv: "Rate grid includes insured, insurable, refinance, rental, and 30-year categories where available.",
    documents: "Income, down payment, property details, appraisal if required, rental support, and switch payout.",
    watch: "Confirm low-rate-basic restrictions, prepayment, portability, and lender condition timing."
  },
  strive: {
    credit: "Prime and alternative paths may exist; confirm whether the file is being placed under prime or alt policy.",
    income: "Standard documented income for prime; alternative files need clear story, reasonability, and exit strategy.",
    property: "Prime, alternative, rental, refinance, and switch scenarios subject to product lane.",
    ltv: "Use the deal desk rate categories and confirm alternative/private overlays where applicable.",
    documents: "Income package, appraisal, source of funds, mortgage statement, rental support, and file narrative.",
    watch: "Clarify product lane, fees, compensation, rate hold, and suitability for non-prime cases."
  },
  desjardins: {
    credit: "Strong credit profile preferred; the sheet notes a 720+ FICO overlay, so confirm before quoting.",
    income: "Standard employment and documented business income files are strongest.",
    property: "Regional credit union/bank-style lender for Ontario mortgage and HELOC scenarios where available.",
    ltv: "Rate grid includes insured, insurable, refinance, rental, 30-year, and HELOC categories.",
    documents: "Income documents, property details, source of funds, appraisal as needed, and membership/channel requirements.",
    watch: "Confirm score overlay, Ontario availability, membership or channel requirements, and rate-hold policy."
  },
  alterna: {
    credit: "Credit union underwriting; use 650+ as a prime placement guide and confirm current Alterna score overlays.",
    income: "Standard employment, pension, documented self-employed income, and newcomer support may fit when documentation is strong.",
    property: "Ontario residential properties, purchases, refinances, switches, and HELOC-style needs subject to membership and property policy.",
    ltv: "Use insured, conventional, refinance, switch, and HELOC policy rules; confirm max LTV by product before quoting.",
    documents: "Income package, membership requirements, down payment/source of funds, appraisal, property taxes, and payout statement for switches.",
    watch: "Confirm credit union membership, channel availability, property location, HELOC registration, and current rate specials."
  },
  magenta: {
    credit: "Private/MIC placement is equity-led; Residential Seconds may require stronger credit, with 650+ used as a guide where required.",
    income: "No Doc, Verifiable Income, rental, and equity-focused files may fit depending on property strength and exit strategy.",
    property: "Marketable residential properties in approved areas; Magenta references select strong Ontario markets and student-rental opportunities.",
    ltv: "Confirm max LTV by product, location, property type, first/second position, income support, and exit plan.",
    documents: "Application story, appraisal, mortgage statement, tax status, lease/rent support for rentals, exit strategy, and fee disclosure.",
    watch: "Private/MIC costs, term, renewal risk, legal fees, combined LTV, borrower benefit, and exit strategy must be clear."
  }
};

const dealDeskSource = {
  name: "Internal Daily Rate Sheet",
  effectiveDate: "June 1, 2026",
  benchmarkRate: "5.25%",
  primeRate: "4.45%",
  note: "Internal brokerage rate desk. O.A.C.; rates subject to change without notice; rate hold varies by lender."
};

const dealDeskExtraLenders = [
  {
    id: "b2b-bank",
    name: "B2B Bank",
    type: "bank",
    brandColor: "#004B8D",
    brandAccent: "#6BA43A",
    website: "https://b2bbank.com/",
    portal: "B2B Bank broker channel",
    region: "Ontario",
    bdm: "B2B Bank Mortgage Desk",
    email: "Use assigned B2B Bank contact",
    phone: "Use assigned B2B Bank phone",
    rates: { insuredFixed: 0, variable: null, conventional: 0, alt: null },
    updated: "Rate Desk",
    programs: ["Bank mortgage", "Insured purchase", "Conventional purchase", "Refinance", "Rental", "HELOC"],
    guidelines: ["Broker-channel bank lender with internal rate desk categories.", "Confirm submission route, compensation, and current conditions before placement."],
    policyNote: "Updated from internal rate desk."
  },
  {
    id: "cmls",
    name: "CMLS",
    type: "monoline",
    brandColor: "#003C71",
    brandAccent: "#00A3E0",
    website: "https://www.cmls.ca/",
    portal: "CMLS broker resources",
    region: "Ontario",
    bdm: "CMLS Broker Desk",
    email: "Use assigned CMLS contact",
    phone: "Use assigned CMLS phone",
    rates: { insuredFixed: 0, variable: null, conventional: 0, alt: null },
    updated: "Rate Desk",
    programs: ["Insured purchase", "Conventional purchase", "Refinance", "Rental", "Switch/transfer"],
    guidelines: ["Monoline lender with standard and no-frills rate categories in the internal rate desk.", "Confirm rate-hold, prepayment, and feature restrictions before submission."],
    policyNote: "Updated from internal rate desk."
  },
  {
    id: "highclere",
    name: "Highclere",
    type: "monoline",
    brandColor: "#334155",
    brandAccent: "#94A3B8",
    website: "https://www.highcleremortgages.com/",
    portal: "Highclere broker resources",
    region: "Ontario",
    bdm: "Highclere Mortgage Desk",
    email: "Use assigned Highclere contact",
    phone: "Use assigned Highclere phone",
    rates: { insuredFixed: 0, variable: null, conventional: 0, alt: null },
    updated: "Rate Desk",
    programs: ["Insured purchase", "Conventional purchase", "Refinance", "Switch/transfer"],
    guidelines: ["Rate desk lender entry.", "Confirm availability, underwriting appetite, and current desk notes before placement."],
    policyNote: "Updated from internal rate desk."
  },
  {
    id: "neo",
    name: "Neo",
    type: "monoline",
    brandColor: "#111827",
    brandAccent: "#22C55E",
    website: "https://www.neomortgage.ca/",
    portal: "Neo mortgage resources",
    region: "Ontario",
    bdm: "Neo Mortgage Desk",
    email: "Use assigned Neo contact",
    phone: "Use assigned Neo phone",
    rates: { insuredFixed: 0, variable: null, conventional: 0, alt: null },
    updated: "Rate Desk",
    programs: ["Insured purchase", "Conventional purchase", "Refinance", "Switch/transfer"],
    guidelines: ["Rate desk lender entry.", "Confirm submission channel and current product availability."],
    policyNote: "Updated from internal rate desk."
  },
  {
    id: "rmg",
    name: "RMG",
    type: "monoline",
    brandColor: "#003DA5",
    brandAccent: "#00A3E0",
    website: "https://www.rmgmortgages.ca/",
    portal: "RMG broker resources",
    region: "Ontario",
    bdm: "RMG Broker Desk",
    email: "Use assigned RMG contact",
    phone: "Use assigned RMG phone",
    rates: { insuredFixed: 0, variable: null, conventional: 0, alt: null },
    updated: "Rate Desk",
    programs: ["Insured purchase", "Conventional purchase", "Refinance", "Rental", "Switch/transfer"],
    guidelines: ["Broker-focused monoline lender with standard and low-rate-basic categories.", "Confirm feature restrictions and penalty/prepayment details before placement."],
    policyNote: "Updated from internal rate desk."
  },
  {
    id: "strive",
    name: "Strive",
    type: "monoline",
    brandColor: "#121826",
    brandAccent: "#D6A84F",
    website: "https://www.strivecapital.ca/",
    portal: "Strive broker resources",
    region: "Ontario",
    bdm: "Strive Broker Desk",
    email: "Use assigned Strive contact",
    phone: "Use assigned Strive phone",
    rates: { insuredFixed: 0, variable: null, conventional: 0, alt: null },
    updated: "Rate Desk",
    programs: ["Prime", "Alternative", "Insured purchase", "Conventional purchase", "Refinance", "Rental"],
    guidelines: ["Prime and alternative lender tracked in the internal rate desk.", "Confirm whether product is prime, alternative, or exception-priced before submission."],
    policyNote: "Updated from internal rate desk."
  },
  {
    id: "desjardins",
    name: "Desjardins",
    type: "credit union",
    brandColor: "#00843D",
    brandAccent: "#78BE20",
    website: "https://www.desjardins.com/",
    portal: "Desjardins Ontario mortgage resources",
    region: "Ontario",
    bdm: "Desjardins Mortgage Desk",
    email: "Use assigned Desjardins contact",
    phone: "Use assigned Desjardins phone",
    rates: { insuredFixed: 0, variable: null, conventional: 0, alt: null },
    updated: "Rate Desk",
    programs: ["Credit union mortgage", "Insured purchase", "Conventional purchase", "Refinance", "HELOC"],
    guidelines: ["Regional lender entry with a noted 720+ FICO overlay.", "Confirm membership/channel requirements and current credit-score overlay."],
    policyNote: "Updated from internal rate desk."
  }
];

demoLenders.push(...dealDeskExtraLenders);

const dealDeskRateRows = {
  "b2b-bank": { sheetDate: "5/20", values: ["4.44", "4.84", "4.84", "4.84", "4.84", "4.84", "4.84", "4.84", "4.84", "5.09", "P-0.65", "P-0.25", "P-0.25", "P-0.25", "P-0.25", "P-0.25", "P-0.25", "P-0.25", "P-0.25", "P-0.00", "4.99", "5.09", "5.09", "4.54", "4.69", "4.69", "4.44", "4.69", "4.69", "4.39", "4.74", "4.74", "-", "6.39", "6.39", "-", "6.49", "6.49", "P+0.50"] },
  bmo: { sheetDate: "3/27", values: ["4.69", "5.09", "5.09", "5.09", "5.09", "5.09", "5.19", "5.09", "5.19", "5.34", "P-0.33", "P-0.15", "P-0.15", "P-0.15", "P-0.15", "P-0.15", "P-0.15", "P-0.15", "P-0.15", "P-0.00", "5.33", "5.37", "5.37", "4.73", "4.75", "4.75", "4.54", "4.69", "4.69", "4.50", "4.69", "4.69", "5.44", "5.54", "5.54", "5.90", "5.62", "5.62", "-"] },
  cmls: { sheetDate: "5/30", values: ["4.39", "4.39", "4.54", "4.59", "4.64", "4.84", "4.84", "4.84", "4.84", "-", "P-0.75", "P-0.75", "P-0.60", "P-0.55", "P-0.50", "P-0.26", "P-0.26", "P-0.26", "P-0.26", "-", "-", "-", "-", "4.69", "-", "-", "4.34", "4.64", "4.84", "-", "-", "-", "-", "-", "-", "-", "-", "-", "P+0.50"] },
  "first-national": { sheetDate: "5/23", values: ["4.49", "4.54", "4.64", "4.74", "4.79", "4.84", "4.84", "4.84", "4.84", "4.99", "P-0.75", "P-0.70", "P-0.50", "P-0.45", "P-0.40", "P-0.26", "P-0.26", "P-0.26", "P-0.26", "P-0.11", "5.14", "5.14", "5.14", "4.74", "4.74", "4.74", "4.84", "4.84", "4.84", "4.79", "4.79", "4.79", "5.09", "5.09", "5.09", "5.44", "5.44", "5.44", "-"] },
  highclere: { sheetDate: "5/16", values: ["4.49", "4.49", "4.64", "4.69", "4.74", "-", "-", "-", "-", "-", "P-0.75", "P-0.75", "P-0.60", "P-0.55", "P-0.50", "-", "-", "-", "-", "-", "5.39", "5.64", "-", "5.19", "5.44", "-", "4.49", "4.74", "-", "4.79", "5.04", "-", "-", "-", "-", "-", "-", "-", "-"] },
  merix: { sheetDate: "5/20", values: ["4.49", "4.49", "4.64", "4.64", "4.69", "4.84", "4.84", "4.84", "4.84", "5.14", "P-0.75", "P-0.75", "P-0.55", "P-0.50", "P-0.45", "P-0.25", "P-0.25", "P-0.25", "P-0.25", "P+0.05", "-", "-", "-", "-", "-", "-", "4.39", "4.74", "4.84", "4.49", "4.74", "4.84", "-", "-", "-", "-", "-", "-", "-"] },
  manulife: { sheetDate: "4/9", values: ["4.39", "4.69", "4.69", "4.69", "4.69", "-", "-", "-", "-", "-", "P-0.70", "P-0.40", "P-0.40", "P-0.40", "P-0.40", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "4.34", "4.54", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-"] },
  mcap: { sheetDate: "5/20", values: ["4.49", "4.49", "4.64", "4.64", "4.69", "4.84", "4.84", "4.84", "4.84", "5.14", "P-0.75", "P-0.75", "P-0.55", "P-0.50", "P-0.45", "P-0.25", "P-0.25", "P-0.25", "P-0.25", "P+0.05", "5.29", "5.59", "5.59", "4.64", "4.89", "4.99", "4.39", "4.74", "4.84", "4.49", "4.74", "4.84", "6.54", "6.74", "6.84", "6.64", "6.84", "6.94", "P+0.50"] },
  neo: { sheetDate: "5/26", values: ["4.39", "4.39", "4.49", "4.59", "4.64", "4.89", "4.89", "4.89", "4.89", "-", "P-0.85", "P-0.85", "P-0.75", "P-0.65", "P-0.60", "P-0.10", "P-0.10", "P-0.10", "P-0.10", "-", "5.09", "6.19", "-", "4.69", "6.09", "-", "4.49", "4.74", "-", "4.49", "4.69", "-", "-", "-", "-", "-", "-", "-", "-"] },
  rfa: { sheetDate: "5/16", values: ["4.49", "4.49", "4.64", "4.64", "4.69", "4.84", "4.84", "4.84", "4.84", "5.54", "P-0.75", "P-0.75", "P-0.55", "P-0.45", "P-0.45", "P-0.20", "P-0.20", "P-0.20", "P-0.20", "-", "5.09", "5.44", "-", "4.54", "4.84", "-", "4.49", "4.74", "-", "4.54", "4.84", "-", "-", "-", "-", "-", "-", "-", "-"] },
  rmg: { sheetDate: "5/20", values: ["4.49", "4.49", "4.64", "4.64", "4.69", "4.84", "4.84", "4.84", "4.84", "-", "P-0.75", "P-0.75", "P-0.55", "P-0.50", "P-0.45", "P-0.25", "P-0.25", "P-0.25", "P-0.25", "-", "5.29", "5.59", "5.59", "4.64", "4.89", "4.99", "4.39", "4.74", "4.84", "4.49", "4.74", "4.84", "-", "-", "-", "-", "-", "-", "-"] },
  scotia: { sheetDate: "5/12", values: ["4.34", "4.59", "4.59", "4.59", "4.59", "4.59", "4.69", "4.59", "4.69", "4.99", "P-0.70", "P-0.45", "P-0.45", "P-0.45", "P-0.45", "P-0.45", "P-0.35", "P-0.45", "P-0.35", "P-0.05", "4.69", "4.94", "4.94", "4.09", "4.34", "4.34", "4.14", "4.39", "4.39", "4.29", "4.54", "4.54", "5.05", "5.30", "5.30", "5.45", "5.70", "5.70", "P+0.50"] },
  strive: { sheetDate: "5/16", values: ["4.49", "4.49", "4.64", "4.64", "4.69", "4.84", "4.84", "4.84", "4.84", "-", "P-0.75", "P-0.75", "P-0.55", "P-0.45", "P-0.45", "P-0.35", "P-0.35", "P-0.35", "P-0.35", "-", "4.94", "5.34", "-", "4.64", "4.99", "-", "4.49", "4.84", "4.84", "4.49", "4.79", "-", "-", "-", "-", "-", "-", "-", "-"] },
  td: { sheetDate: "5/29", values: ["4.44", "4.74", "4.74", "4.74", "4.74", "4.74", "4.79", "4.74", "4.79", "4.89", "P-0.61", "P-0.46", "P-0.46", "P-0.46", "P-0.46", "P-0.46", "P-0.41", "P-0.46", "P-0.41", "P-0.31", "5.59", "5.59", "5.59", "4.54", "4.54", "4.54", "4.59", "4.59", "4.59", "4.69", "4.69", "4.69", "5.44", "5.44", "5.44", "5.54", "5.54", "5.54", "P+0.50"] },
  desjardins: { sheetDate: "5/1", values: ["4.19", "4.34", "4.34", "4.34", "4.34", "4.34", "4.44", "4.34", "4.44", "4.59", "P-0.55", "P-0.55", "P-0.55", "P-0.55", "P-0.55", "P-0.55", "P-0.45", "P-0.55", "P-0.45", "P-0.30", "5.49", "5.49", "5.49", "5.04", "5.04", "5.04", "4.19", "4.24", "4.24", "4.19", "4.29", "4.29", "4.54", "4.69", "4.69", "5.24", "5.24", "5.24", "P+0.50"] },
  duca: { sheetDate: "5/26", values: ["4.39", "4.49", "4.59", "4.69", "4.69", "4.69", "4.79", "4.69", "4.79", "4.94", "P-0.75", "P-0.50", "P-0.45", "P-0.35", "P-0.35", "P-0.35", "P-0.25", "P-0.35", "P-0.25", "-", "5.14", "5.44", "5.44", "5.04", "5.34", "5.34", "4.49", "4.79", "4.89", "4.69", "4.99", "4.99", "-", "-", "-", "-", "-", "-", "-"] }
};

applyDealDeskUpdates(demoLenders);
lenders = loadLenders();
activeLenderId = lenders[0]?.id || "";

const insurerSourceLinks = {
  cmhcHomeownership: "https://www.cmhc-schl.gc.ca/professionals/project-funding-and-mortgage-financing/mortgage-loan-insurance/mortgage-loan-insurance-homeownership-programs",
  cmhcPremiums: "https://www.cmhc-schl.gc.ca/professionals/project-funding-and-mortgage-financing/mortgage-loan-insurance/mortgage-loan-insurance-homeownership-programs/premium-information-for-homeowner-and-small-rental-loans",
  cmhcMliSelect: "https://www.cmhc-schl.gc.ca/professionals/project-funding-and-mortgage-financing/mortgage-loan-insurance/multi-unit-insurance/mli-select",
  sagenProducts: "https://www.sagen.ca/products-and-services/",
  canadaGuarantyProducts: "https://www.canadaguaranty.ca/products-at-a-glance/",
  canadaGuarantyEnergyEfficient: "https://www.canadaguaranty.ca/energy-efficient-advantage-program/",
  canadaGuarantyEnergyRefundApplication: "https://www.canadaguaranty.ca/energy-efficient-refund-application/"
};

const sagenProductSourceLinks = {
  homebuyer95: "https://www.sagen.ca/products-and-services/homebuyer-95/",
  purchasePlusImprovements: "https://www.sagen.ca/products-and-services/purchase-plus-improvements/",
  newToCanada: "https://www.sagen.ca/products-and-services/new-to-canada/",
  businessForSelf: "https://www.sagen.ca/products-and-services/business-for-self/",
  vacationSecondary: "https://www.sagen.ca/products-and-services/vacation-secondary-homes/",
  progressAdvance: "https://www.sagen.ca/products-and-services/progress-advance/",
  borrowedDownPayment: "https://www.sagen.ca/products-and-services/borrowed-down-payment/",
  investmentProperty: "https://www.sagen.ca/products-and-services/investment-property/",
  familyPlan: "https://www.sagen.ca/products-and-services/family-plan/",
  secondMortgage: "https://www.sagen.ca/products-and-services/second-mortgage/",
  refinanceSecondarySuites: "https://www.sagen.ca/products-and-services/refinance-for-secondary-suites/",
  selfDirectedRrsp: "https://www.sagen.ca/products-and-services/self-directed-rrsp/",
  energyEfficient: "https://www.sagen.ca/products-and-services/energy-efficient-housing/",
  portability: "https://www.sagen.ca/products-and-services/portability-feature/",
  homeownerAssistance: "https://www.sagen.ca/products-and-services/hoap/"
};

const sagenToolSourceLinks = {
  tools: "https://www.sagen.ca/tools-and-resources/",
  firstHomeGuide: "https://www.sagen.ca/wp-content/uploads/2025/03/2025-03_SGN_BR_FIRSTHOME.pdf",
  welcomeHomeGuide: "https://www.sagen.ca/wp-content/uploads/2025/06/2025_06_SGN_WELCOME-HOME_EN_v2.pdf",
  homeSweeterHomeGuide: "https://www.sagen.ca/wp-content/uploads/2023/08/2021-10_SGN_SWEETHOME-EN_08.23.pdf",
  lenderUpdates: "https://www.sagen.ca/lender-updates/",
  ups: "https://www.sagen.ca/ups/",
  lenderForms: "https://www.sagen.ca/tools-and-resources/lender-forms-and-worksheets/",
  renovationWorksheet: "https://www.sagen.ca/wp-content/uploads/2023/02/2023-02-SGN-SRW-XX-Ev1.pdf",
  constructionWorksheet: "https://www.sagen.ca/wp-content/uploads/2022/05/2022-03-SGN-SBPAP-XX-Ev4.1.pdf",
  inspectionRequestWorksheet: "https://www.sagen.ca/wp-content/uploads/2021/04/Inspection-final-EN.pdf",
  premiumRates: "https://www.sagen.ca/wp-content/uploads/2025/03/SGN-2025-Customer-Premium-Rates-Ev2.2.pdf",
  interestRates: "https://www.sagen.ca/tools-and-resources/interest-rates/",
  paymentCalculator: "https://www.sagen.ca/tools-and-resources/payment-calculator/",
  premiumCalculator: "https://www.sagen.ca/tools-and-resources/premium-calculator/",
  ppiCalculator: "https://www.sagen.ca/tools-and-resources/purchase-plus-improvements-calculator/",
  dataSubmissionRetention: "https://www.sagen.ca/data-submission-retention-schedule/",
  privacyPolicy: "https://www.sagen.ca/privacy-policy/"
};

function insurerProgram(label, key) {
  return { label, key };
}

const insurers = [
  {
    id: "cmhc",
    name: "CMHC",
    fullName: "Canada Mortgage and Housing Corporation",
    brandColor: "#C8102E",
    brandAccent: "#1F2937",
    website: "https://www.cmhc-schl.gc.ca/professionals/project-funding-and-mortgage-financing/mortgage-loan-insurance/contact-mortgage-loan-insurance",
    contactName: "Ontario and Atlantic Client Relations / Homeowner Underwriting Centre",
    phone: "1-888-GO-emili (1-888-463-6454)",
    email: "Use CMHC regional/client relations contact",
    minScore: "600+ is the common high-ratio baseline; insurer/lender overlays can be higher",
    programs: [
      insurerProgram("CMHC Purchase", "cmhc-purchase"),
      insurerProgram("Premium Schedules", "cmhc-premium-schedules"),
      insurerProgram("CMHC Improvement", "cmhc-improvement"),
      insurerProgram("CMHC Newcomers", "cmhc-newcomers"),
      insurerProgram("CMHC Self-Employed", "cmhc-self-employed"),
      insurerProgram("CMHC Portability", "cmhc-portability"),
      insurerProgram("CMHC Income Property", "cmhc-income-property"),
      insurerProgram("CMHC Second Home", "cmhc-second-home"),
      insurerProgram("CMHC Home Start", "cmhc-home-start"),
      insurerProgram("CMHC Refinance", "cmhc-refinance"),
      insurerProgram("CMHC Prefab Plus", "cmhc-prefab-plus"),
      insurerProgram("CMHC Eco Products", "cmhc-eco-products"),
      insurerProgram("MLI Select", "cmhc-mli-select")
    ],
    policies: [
      "High-ratio and selected low-ratio mortgage loan insurance for approved-lender submissions.",
      "CMHC premiums are a one-time charge and may be added to the insured loan amount; provincial sales tax, where applicable, cannot be added to the loan amount.",
      "Program fit turns on borrower qualification, property type, loan purpose, LTV, amortization, premium treatment, and lender overlays.",
      "Use CMHC emili/client relations guidance for status, documents, exception handling, and current policy interpretation."
    ],
    watch: [
      "Confirm GDS/TDS and credit-score overlays before quoting because lender policy can be tighter than the insurer baseline.",
      "Trace down payment and closing costs early, especially borrowed, gifted, foreign, or non-traditional sources.",
      "Check purchase price, property type, occupancy, LTV, amortization, and premium rules before selecting the program.",
      "Eco Products may provide a 25% partial premium refund; portability can reduce or eliminate premium on a subsequent insured purchase, subject to top-up and surcharge rules.",
      "Do not treat an insurer approval as final until lender conditions, appraisal/property review, and fraud checks are cleared."
    ]
  },
  {
    id: "sagen",
    name: "Sagen",
    fullName: "Sagen Mortgage Insurance Canada",
    brandColor: "#542E91",
    brandAccent: "#00A7B5",
    website: "https://www.sagen.ca/contact/",
    contactName: "Sagen Underwriting",
    phone: "1-800-511-8888",
    email: "customer.service@sagen.ca",
    minScore: "600+ is typical for insured programs; stronger score/depth may be required by product or lender",
    programs: [
      insurerProgram("Tools & Resources", "sagen-tools-resources"),
      insurerProgram("Homebuyer 95", "sagen-homebuyer-95"),
      insurerProgram("Purchase Plus Improvements", "sagen-purchase-plus-improvements"),
      insurerProgram("New to Canada", "sagen-new-to-canada"),
      insurerProgram("Business for Self (Alt. A)", "sagen-business-for-self"),
      insurerProgram("Vacation / Secondary Homes", "sagen-vacation-secondary"),
      insurerProgram("Progress Advance", "sagen-progress-advance"),
      insurerProgram("Borrowed Down Payment", "sagen-borrowed-down-payment"),
      insurerProgram("Investment Property", "sagen-investment-property"),
      insurerProgram("Family Plan", "sagen-family-plan"),
      insurerProgram("Second Mortgage Program", "sagen-second-mortgage"),
      insurerProgram("Refinance for Secondary Suites", "sagen-refinance-secondary-suites"),
      insurerProgram("Self-Directed RRSP", "sagen-self-directed-rrsp"),
      insurerProgram("Energy Efficient Housing Program", "sagen-energy-efficient"),
      insurerProgram("Portability Feature", "sagen-portability"),
      insurerProgram("Homeowner Assistance Program (HOAP)", "sagen-homeowner-assistance")
    ],
    policies: [
      "Private mortgage insurer supporting lender and broker high-ratio mortgage submissions across Canada.",
      "Product suite includes insured purchase, improvement, newcomer, business-for-self, second-home, construction/progress, rental/investment, and borrower-assistance paths.",
      "Tools & Resources includes guides, lender updates, UPS, worksheets, premium rates, calculators, and policy resources.",
      "Confirm current underwriting policy, documentation, premium treatment, and lender-specific overlays before advising."
    ],
    watch: [
      "Review credit depth, mortgage repayment conduct, and alternate-credit support when the file is thin or newcomer-based.",
      "Validate income reasonability and tax status before choosing a business-for-self or alternate-income route.",
      "Check property use carefully: owner-occupied, secondary home, rental/investment, and construction files are not interchangeable.",
      "Confirm premium, portability, top-up, and borrower-assistance rules with the submitting lender before commitment."
    ]
  },
  {
    id: "canada-guaranty",
    name: "Canada Guaranty",
    fullName: "Canada Guaranty Mortgage Insurance Company",
    brandColor: "#005E7C",
    brandAccent: "#A7A9AC",
    website: "https://www.canadaguaranty.ca/contact-us/",
    contactName: "Regional Account Executive / Mortgage Insurance Support",
    phone: "1-877-244-8422",
    email: "Use regional Canada Guaranty contact",
    minScore: "Strong insured-borrower credit expected; check the product sheet and lender overlay",
    programs: [
      insurerProgram("Purchase Advantage", "cg-purchase-advantage"),
      insurerProgram("Flex 95 Advantage", "cg-flex-95"),
      insurerProgram("Downpayment Advantage", "cg-downpayment-advantage"),
      insurerProgram("Purchase Advantage Plus", "cg-purchase-advantage-plus"),
      insurerProgram("Maple Leaf Advantage", "cg-maple-leaf-advantage"),
      insurerProgram("Low Doc Advantage", "cg-low-doc-advantage"),
      insurerProgram("Lifestyle Advantage", "cg-lifestyle-advantage"),
      insurerProgram("Progress Draw Advantage", "cg-progress-draw-advantage"),
      insurerProgram("Portable Advantage", "cg-portable-advantage"),
      insurerProgram("Rental Advantage", "cg-rental-advantage"),
      insurerProgram("Refinance for Secondary Suites", "cg-refinance-secondary-suites"),
      insurerProgram("Energy-Efficient Advantage", "cg-energy-efficient-advantage")
    ],
    policies: [
      "Private mortgage default insurer for eligible high-ratio residential mortgage applications.",
      "Product suite includes insured purchase, flexible down payment, renovation, newcomer, low-doc/self-employed, second-home, construction, portability, rental, and energy-efficient paths.",
      "Energy-Efficient Advantage provides a 25% premium refund for qualified borrowers purchasing newly constructed energy-efficient homes.",
      "Contact a regional account executive for product guidance, policy interpretation, and current insurer requirements."
    ],
    watch: [
      "Match the application to the exact advantage program because income, down payment, property use, and construction rules differ.",
      "Confirm source of down payment, borrower credit profile, and documentation depth before submission.",
      "Construction, rental, second-home, and secondary-suite files need early property, appraisal, budget, and draw-process review.",
      "For Energy-Efficient Advantage, the refund application must be submitted within 24 months of mortgage closing and documentation must support certification or EnerGuide energy consumption criteria.",
      "Check lender-specific submission rules because not every lender offers every Canada Guaranty program."
    ]
  }
];

const insurerProgramDetails = {
  "cmhc-purchase": {
    insurerId: "cmhc",
    insurer: "CMHC",
    title: "CMHC Purchase",
    sourceUrl: insurerSourceLinks.cmhcHomeownership,
    purpose: "Mortgage loan insurance for eligible home purchases where the borrower has less than 20% down payment.",
    limits: [
      { label: "Typical LTV", value: "Up to 95% for eligible owner-occupied purchase tiers" },
      { label: "Credit", value: "Common minimum 600+ with lender overlays" },
      { label: "Amortization", value: "Confirm current insured maximum by borrower/property" },
      { label: "Use", value: "Owner-occupied purchase; lender must be approved" }
    ],
    eligibility: ["Eligible borrower and owner-occupied residential property", "Approved lender submission through CMHC process", "Borrower qualifies under insurer and lender GDS/TDS, credit, income, and debt rules", "Down payment and closing costs are verified before funding"],
    documents: ["Signed purchase agreement and MLS/property details", "Income package matching borrower type", "90-day down payment history plus gift/borrowed funds support if applicable", "Credit bureau, liabilities, and any explanation for late payments or thin credit"],
    exclusions: ["Do not assume every property type, non-arm's-length purchase, gifted equity, or borrowed down payment fits without insurer/lender confirmation.", "Files with unusual occupancy, unclear income, private sales, or property concerns should be checked before rate commitment."],
    watch: ["Run the purchase price, down payment tier, and amortization before quoting because insured premium and eligibility can change quickly.", "Confirm whether the lender has tighter score, tradeline, GDS/TDS, or debt-ratio limits than CMHC.", "Trace down payment early; large deposits, foreign funds, gifts, unsecured borrowing, and business-account transfers usually need explanation.", "Check property marketability, zoning, occupancy, and appraisal risk before treating the approval as clean.", "Explain that insurer approval, lender approval, and final funding review are separate checkpoints."]
  },
  "cmhc-premium-schedules": {
    insurerId: "cmhc",
    insurer: "CMHC",
    title: "CMHC Premium Schedules",
    sourceUrl: insurerSourceLinks.cmhcPremiums,
    purpose: "CMHC premium reference for homeowner loans, small rental loans, refinance premiums, portability credits, Eco Product refund notes, provincial sales tax, and amortization surcharges.",
    limits: [
      { label: "Homeowner 1-4 units", value: "0.60%, 1.70%, 2.40%, 2.80%, 3.10%, 4.00% by LTV tier up to 95%" },
      { label: "Non-traditional DP", value: "90.01%-95% homeowner tier: 4.50%" },
      { label: "Small rental 2-4 units", value: "1.45% to 65%, 2.00% to 75%, 2.90% to 80%" },
      { label: "Refinance", value: "0.60% to 65%, 1.70% to 75%, 2.40% to 80%, 2.80% to 85%, 3.10% to 90%" }
    ],
    eligibility: [
      "Premium is calculated against the applicable total loan amount after any available premium credits, or against the increase to loan amount where CMHC's portability/refinance comparison applies.",
      "Homeowner premium tiers apply to owner-occupied properties with 1 to 4 units.",
      "Small rental premium tiers apply to non-owner-occupied properties with 2 to 4 units.",
      "Premium credits may apply through portability based on elapsed time since the original CMHC-insured loan closing."
    ],
    documents: [
      "Purchase price, property type, unit count, occupancy, loan amount, and down payment source.",
      "Current and proposed loan amount when portability, top-up, or refinance treatment is being reviewed.",
      "Original CMHC-insured loan details and closing date when premium credit is being considered.",
      "Energy-efficiency proof when asking about the CMHC Eco Products partial premium refund."
    ],
    exclusions: [
      "Provincial sales tax on the mortgage loan insurance premium applies in some provinces, including Ontario, Quebec, and Saskatchewan, and cannot be added to the insured loan amount.",
      "A premium quote should not be treated as final until the lender confirms the CMHC product, LTV tier, amortization, tax treatment, and any top-up/credit calculation."
    ],
    watch: [
      "For homeowner loans, CMHC lists total-loan premium tiers from 0.60% up to and including 65% LTV through 4.00% for 90.01%-95% LTV; the 90.01%-95% non-traditional down payment tier is 4.50%.",
      "For portability increases, CMHC lists increase-to-loan premium rates from 0.60% up to 6.30%, or 6.60% for the 90.01%-95% non-traditional down payment tier.",
      "For small rental loans, CMHC lists total-loan premiums of 1.45%, 2.00%, and 2.90% for the <=65%, 65.01%-75%, and 75.01%-80% LTV tiers.",
      "Premium credit examples on CMHC's page are 100% at 6 months, 50% at 12 months, and 25% at 24 months from the original insured loan closing to the new insurance request.",
      "CMHC notes a 0.20% surcharge for amortization periods beyond 25 years."
    ]
  },
  "cmhc-improvement": {
    insurerId: "cmhc",
    insurer: "CMHC",
    title: "CMHC Improvement",
    sourceUrl: insurerSourceLinks.cmhcHomeownership,
    purpose: "Insured financing that can include eligible improvements or renovations connected to the purchase.",
    limits: [
      { label: "Purpose", value: "Purchase plus approved improvements" },
      { label: "LTV basis", value: "Usually lower of cost/value rules; confirm lender calculation" },
      { label: "Advance", value: "Improvement funds commonly held back until complete" },
      { label: "Timing", value: "Completion and inspection rules matter" }
    ],
    eligibility: ["Borrower is purchasing an eligible property and wants to finance approved improvements", "Improvement scope, cost, and value impact are acceptable to lender and insurer", "Borrower still qualifies with the full mortgage and any holdback conditions", "Lender has a clear completion and advance process"],
    documents: ["Purchase agreement", "Written contractor quotes or detailed estimates", "Appraisal or post-improvement value support where required", "Income, down payment, and closing cost confirmation"],
    exclusions: ["Cosmetic or unverified work may not be accepted if cost/value support is weak.", "Do not promise immediate access to improvement funds because many lenders release after completion confirmation."],
    watch: ["Confirm exactly what work is eligible before submitting; appliances, owner labour, luxury upgrades, or vague estimates may be challenged.", "Tell the borrower how the holdback works and who pays contractors before release.", "Watch for cost overruns because higher renovation costs may not increase approved financing.", "Confirm whether the lender needs an appraisal, inspection, invoices, permits, or completion certificate.", "Build in enough time for completion and post-closing review so the borrower is not surprised."]
  },
  "cmhc-newcomers": {
    insurerId: "cmhc",
    insurer: "CMHC",
    title: "CMHC Newcomers",
    sourceUrl: insurerSourceLinks.cmhcHomeownership,
    purpose: "Supports eligible borrowers who are new to Canada and may have limited Canadian credit history.",
    limits: [
      { label: "Credit", value: "Canadian credit or acceptable alternate credit support" },
      { label: "Status", value: "Confirm permanent resident/work-permit path with lender" },
      { label: "Funds", value: "Foreign and transferred funds need a clear paper trail" },
      { label: "Overlay", value: "Lenders may require stronger score/depth" }
    ],
    eligibility: ["Eligible immigration or residency/work status", "Income is stable, verifiable, and acceptable to the submitting lender", "Canadian bureau or alternate credit demonstrates repayment conduct", "Down payment source and closing costs are fully documented"],
    documents: ["PR card, work permit, landing papers, or other status support requested by lender", "Employment letter, pay stubs, and income history", "Alternate credit such as rent, utilities, telecom, insurance, or bank references if bureau is thin", "International or Canadian bank statements showing down payment movement"],
    exclusions: ["Unclear status, unverifiable offshore funds, or no repayment history can create insurer declines even with strong income.", "Foreign income or recently started employment needs lender-specific review before advising."],
    watch: ["Start with immigration status and date of arrival; it drives which path the lender can use.", "Collect alternate credit in the format the lender wants rather than after submission.", "Document every large transfer and currency conversion so anti-fraud and source-of-funds questions are answered up front.", "Confirm whether probation, contract employment, or foreign income is acceptable.", "Make sure the borrower understands lender overlays can be stricter than the insurer program."]
  },
  "cmhc-self-employed": {
    insurerId: "cmhc",
    insurer: "CMHC",
    title: "CMHC Self-Employed",
    sourceUrl: insurerSourceLinks.cmhcHomeownership,
    purpose: "Mortgage insurance path for eligible self-employed borrowers using documented income support.",
    limits: [
      { label: "Income", value: "Documented, reasonable, and supported by tax/business records" },
      { label: "Credit", value: "Prime insured credit expectations usually apply" },
      { label: "Tax", value: "No unpaid personal tax arrears unless specifically accepted" },
      { label: "Tenure", value: "Business history and industry consistency are key" }
    ],
    eligibility: ["Borrower is self-employed with an established, supportable business history", "Income used to qualify is reasonable for the industry and documentation", "Credit profile and debts fit insured lending standards", "Approved lender is comfortable with the business structure and income calculation"],
    documents: ["T1 generals, NOAs, and business statements where requested", "Business licence, articles, GST/HST, or registration support", "Financial statements or accountant-prepared support if required", "Bank statements, contracts, or invoices when income reasonability needs support"],
    exclusions: ["Stated income without support is not the same as insured self-employed qualification.", "Personal tax arrears, weak business tenure, or income far above reported tax history can derail the file."],
    watch: ["Calculate income the way the lender will calculate it before choosing the product.", "Check personal and corporate tax arrears early; they often become lender conditions.", "Explain add-backs carefully and keep them evidence-based.", "Watch business-use properties, mixed-use income, and cash-heavy businesses for extra review.", "Prepare a reasonability note when income is growing quickly or expenses are unusually high."]
  },
  "cmhc-portability": {
    insurerId: "cmhc",
    insurer: "CMHC",
    title: "CMHC Portability",
    sourceUrl: insurerSourceLinks.cmhcHomeownership,
    purpose: "Allows eligible existing insured mortgage borrowers to transfer insurance benefits to a new property or loan scenario.",
    limits: [
      { label: "Existing loan", value: "Must be an eligible insured mortgage" },
      { label: "Top-up", value: "Premium may apply if loan amount increases" },
      { label: "Timing", value: "Sale/purchase and closing dates are important" },
      { label: "Qualification", value: "Borrower and property still need approval" }
    ],
    eligibility: ["Existing mortgage insurance can be identified and validated", "New loan/property remains insurable and lender-approved", "Borrower qualifies under current lender and insurer rules", "Portability request is made within the required process and timing"],
    documents: ["Existing insured mortgage details and insurer certificate information if available", "New purchase agreement/property details", "Updated income, credit, and liability package", "Payout, sale, bridge, or transfer information as applicable"],
    exclusions: ["A prior insured mortgage does not automatically make the new deal insurable.", "Large increases, refinance components, occupancy changes, or property issues can reduce portability benefit."],
    watch: ["Verify the original insurer before quoting portability savings.", "Check whether the new mortgage amount, amortization, property, and occupancy still meet current rules.", "Explain top-up premium and how the lender calculates it.", "Watch closing date gaps, bridge financing, and lender transfer process.", "If switching lenders, confirm the new lender can process the insurer portability path."]
  },
  "cmhc-income-property": {
    insurerId: "cmhc",
    insurer: "CMHC",
    title: "CMHC Income Property",
    sourceUrl: insurerSourceLinks.cmhcHomeownership,
    purpose: "Mortgage loan insurance for eligible small rental/income-property scenarios.",
    limits: [
      { label: "Property", value: "Eligible residential income property; confirm units and occupancy" },
      { label: "Income", value: "Lease or market rent support required" },
      { label: "Debt service", value: "Rental treatment varies by insurer and lender" },
      { label: "LTV", value: "Depends on owner-occupied vs rental/investment use" }
    ],
    eligibility: ["Eligible income-producing residential property", "Borrower qualifies carrying the subject property and other debts", "Rental income can be supported by lease, market rent, or appraisal/rent schedule", "Approved lender accepts the property type and rental calculation"],
    documents: ["Current lease or market-rent support", "Appraisal and rent schedule if required", "Property tax, heat/condo fee and operating-cost support", "Borrower income and liabilities"],
    exclusions: ["Illegal units, short-term rental reliance, unmarketable properties, or weak cash flow may not fit.", "Rental income cannot be assumed at 100% unless the lender/insurer method says so."],
    watch: ["Separate owner-occupied with rental unit from non-owner-occupied rental because LTV and qualification can differ.", "Confirm the exact rental worksheet method before issuing advice.", "Watch vacancy, property condition, zoning/legal unit status, and market rent support.", "Include taxes, heat, condo fees, and existing rental losses correctly.", "For portfolio landlords, review global cash flow and exposure early."]
  },
  "cmhc-second-home": {
    insurerId: "cmhc",
    insurer: "CMHC",
    title: "CMHC Second Home",
    sourceUrl: insurerSourceLinks.cmhcHomeownership,
    purpose: "Insurance path for eligible second-home purchases where the property is intended for borrower or family use.",
    limits: [
      { label: "Use", value: "Secondary residence, not regular income-property placement" },
      { label: "Occupancy", value: "Borrower/family use must be clear" },
      { label: "Property", value: "Seasonal access and marketability must be acceptable" },
      { label: "Qualification", value: "Borrower carries all housing debts" }
    ],
    eligibility: ["Borrower qualifies with existing and new obligations", "Property use is acceptable as a second home", "Property is marketable and meets lender/insurer standards", "Approved lender supports the product"],
    documents: ["Purchase agreement", "Property details including access, services, and zoning", "Income and debt package", "Down payment source"],
    exclusions: ["Do not use as a shortcut for investment/rental properties.", "Remote, seasonal, cottage, or unusual properties need early lender review."],
    watch: ["Confirm whether any rental use is allowed; many second-home paths expect personal/family occupancy.", "Check access, water, septic, heat, and year-round marketability.", "Include all carrying costs for the current home and second home.", "Confirm property tax and insurance costs because they can change debt service.", "Avoid promising insured second-home approval before lender property review."]
  },
  "cmhc-home-start": {
    insurerId: "cmhc",
    insurer: "CMHC",
    title: "CMHC Home Start",
    sourceUrl: insurerSourceLinks.cmhcHomeownership,
    purpose: "Homeownership insurance option intended to support eligible borrowers with flexible down payment sources.",
    limits: [
      { label: "Down payment", value: "Flexible sources must be acceptable and disclosed" },
      { label: "Affordability", value: "Debt service and repayment capacity remain central" },
      { label: "Credit", value: "Lender may require stronger conduct for borrowed funds" },
      { label: "Disclosure", value: "Borrowed funds must be included in liabilities" }
    ],
    eligibility: ["Eligible owner-occupied purchase", "Down payment source fits insurer and lender policy", "Borrower qualifies including any repayment on borrowed funds", "Approved lender can submit under the appropriate CMHC path"],
    documents: ["Down payment source evidence", "Loan/gift agreement if applicable", "Income and credit package", "Closing cost confirmation"],
    exclusions: ["Unsecured borrowing that is not disclosed or cannot be debt-serviced can cause decline.", "Gifted or borrowed funds without clear documentation should not be counted until verified."],
    watch: ["Ask where every dollar of down payment comes from before pre-approval.", "Include monthly payments on borrowed funds in the debt ratios.", "Confirm lender comfort with the down payment source before submission.", "Watch post-closing liquidity; flexible down payment files can be tight on closing costs.", "Explain that insurer acceptance does not override lender anti-fraud review."]
  },
  "cmhc-refinance": {
    insurerId: "cmhc",
    insurer: "CMHC",
    title: "CMHC Refinance",
    sourceUrl: insurerSourceLinks.cmhcHomeownership,
    purpose: "CMHC insured refinance paths are limited and should be confirmed by loan purpose, property, and current program availability.",
    limits: [
      { label: "Purpose", value: "Not a general high-ratio cash-out assumption" },
      { label: "LTV", value: "Depends on current eligible refinance program" },
      { label: "Property", value: "Residential property requirements apply" },
      { label: "Overlay", value: "Lender policy is often decisive" }
    ],
    eligibility: ["Loan purpose fits a current CMHC insured refinance path", "Borrower and property qualify under lender and insurer standards", "Existing mortgage, title, and payout details are clear", "Any added funds are eligible for the program"],
    documents: ["Current mortgage statement and payout", "Purpose-of-funds support", "Income, credit, and property documents", "Appraisal if required"],
    exclusions: ["Do not position this as standard high-ratio debt consolidation unless current program rules allow it.", "Equity take-out, private payout, or debt consolidation often requires conventional or alternative lending."],
    watch: ["Confirm current CMHC program availability before discussing refinance options.", "Validate the exact use of funds and whether it is insurable.", "Check property value and title issues early.", "Compare conventional or uninsured alternatives if the purpose does not fit.", "Document borrower benefit and affordability clearly."]
  },
  "cmhc-prefab-plus": {
    insurerId: "cmhc",
    insurer: "CMHC",
    title: "CMHC Prefab Plus",
    sourceUrl: insurerSourceLinks.cmhcHomeownership,
    purpose: "CMHC insurance path for eligible prefabricated or modular-home scenarios where lender and property requirements can be satisfied.",
    limits: [
      { label: "Property", value: "Prefab/modular property must be marketable and acceptable" },
      { label: "Security", value: "Land, foundation, title and registration must be clear" },
      { label: "Advance", value: "Progress or completion funding depends on lender process" },
      { label: "Evidence", value: "Builder, specs, permits and appraisal support matter" }
    ],
    eligibility: ["Eligible prefabricated or modular residential property", "Borrower qualifies under current insured mortgage rules", "Property, land/title, foundation, services and marketability are acceptable", "Approved lender can administer any construction or completion conditions"],
    documents: ["Purchase/build contract", "Builder/manufacturer details", "Plans/specs, permits, land/title and foundation information", "Appraisal and completion/inspection support if required"],
    exclusions: ["Mobile homes, chattel-only structures, leased land, or weak resale marketability may not fit.", "Do not assume prefab equals standard purchase until title/security and lender process are confirmed."],
    watch: ["Confirm whether the property will be real property security, not only chattel.", "Check land ownership, foundation, utilities, permits, delivery, and installation timing.", "Watch draw/advance timing if the unit is paid for before completion.", "Verify appraisal comparables for modular/prefab homes in the area.", "Review builder warranty and completion-risk conditions early."]
  },
  "cmhc-eco-products": {
    insurerId: "cmhc",
    insurer: "CMHC",
    title: "CMHC Eco Products",
    sourceUrl: insurerSourceLinks.cmhcHomeownership,
    purpose: "Energy-efficiency related insurance options or premium features for eligible homes that meet the current CMHC criteria.",
    limits: [
      { label: "Energy proof", value: "Requires accepted efficiency or improvement evidence" },
      { label: "Timing", value: "Confirm when documentation must be submitted" },
      { label: "Benefit", value: "May affect premium/refund rather than base approval" },
      { label: "Eligibility", value: "Property and program criteria apply" }
    ],
    eligibility: ["Home or improvement meets current energy-efficiency criteria", "Borrower otherwise qualifies for the insured mortgage", "Required evidence can be produced within CMHC/lender timelines", "Lender supports the eco feature"],
    documents: ["Energy rating, certification, or eligible upgrade documents", "Purchase or renovation documents", "Mortgage insurance application details", "Receipts or post-work proof if required"],
    exclusions: ["Do not promise an eco benefit without accepted proof.", "Partial upgrades, expired reports, or unsupported claims may not qualify."],
    watch: ["Collect energy documents early because retroactive proof can be hard to obtain.", "Confirm whether the borrower gets a premium refund, premium adjustment, or other benefit.", "Check if the lender has a separate process for submitting eco documentation.", "Watch completion timing for new builds or renovations.", "Keep borrower expectations conservative until CMHC accepts the documents."]
  },
  "cmhc-mli-select": {
    insurerId: "cmhc",
    insurer: "CMHC",
    title: "MLI Select",
    sourceUrl: insurerSourceLinks.cmhcMliSelect,
    purpose: "CMHC multi-unit mortgage loan insurance program focused on affordability, accessibility, and climate compatibility outcomes.",
    limits: [
      { label: "Property", value: "Multi-unit residential rental" },
      { label: "Scoring", value: "Affordability, accessibility, and climate criteria drive benefits" },
      { label: "Term/Amortization", value: "Can vary by score and program outcome" },
      { label: "Complexity", value: "Commercial-style underwriting and monitoring" }
    ],
    eligibility: ["Multi-unit residential property submitted through an approved lender", "Project meets required scoring and underwriting criteria", "Borrower/sponsor can support debt, operating history, and project commitments", "Affordability/accessibility/climate claims are evidence-based"],
    documents: ["Rent roll, operating statements, and property details", "Appraisal, environmental, and building condition items where required", "Affordability, accessibility, and energy/climate evidence", "Borrower financials, ownership structure, and management information"],
    exclusions: ["Single-family or ordinary high-ratio residential files do not belong here.", "Affordability commitments and reporting obligations must be understood before quoting benefits."],
    watch: ["Score the deal before discussing amortization or premium benefits.", "Validate affordability commitments against actual rents and future compliance.", "Watch environmental, repair, and capital expenditure issues.", "Confirm borrower experience, net worth, and reporting capacity.", "Flag that MLI Select timing is closer to commercial underwriting than a standard residential file."]
  },
  "sagen-homebuyer-95": {
    insurerId: "sagen",
    insurer: "Sagen",
    title: "Homebuyer 95",
    sourceUrl: insurerSourceLinks.sagenProducts,
    purpose: "Sagen's core high-ratio insured purchase path for eligible homebuyers with less than 20% down.",
    limits: [
      { label: "Typical LTV", value: "Up to 95% on eligible purchase tiers" },
      { label: "Credit", value: "Insured prime credit expectations" },
      { label: "Use", value: "Owner-occupied purchase" },
      { label: "Overlay", value: "Lender-specific score and debt-service rules apply" }
    ],
    eligibility: ["Eligible owner-occupied purchase", "Borrower qualifies under Sagen and lender underwriting", "Down payment and closing costs are verified", "Property is acceptable to lender and insurer"],
    documents: ["Purchase agreement", "Income and employment package", "Down payment history and gift/borrowed funds support", "Credit explanations and property details"],
    exclusions: ["Do not use for rental/investment or second-home scenarios when a specific Sagen product is more appropriate.", "Unclear funds, weak credit depth, or property concerns require early review."],
    watch: ["Confirm current purchase price, LTV, amortization, and premium treatment before quoting.", "Check lender overlays for score, tradelines, debt ratios, and property type.", "Document non-payroll income and variable income conservatively.", "Collect down payment history before submission to avoid anti-fraud delays.", "Review insurer conditions separately from lender conditions."]
  },
  "sagen-purchase-plus-improvements": {
    insurerId: "sagen",
    insurer: "Sagen",
    title: "Purchase Plus Improvements",
    sourceUrl: insurerSourceLinks.sagenProducts,
    purpose: "Insured purchase financing that can include eligible improvements or renovations after closing.",
    limits: [
      { label: "Improvement funds", value: "Usually held back pending completion" },
      { label: "Evidence", value: "Written quotes and value support required" },
      { label: "Use", value: "Purchase plus eligible improvement work" },
      { label: "Lender process", value: "Holdback and inspection rules vary" }
    ],
    eligibility: ["Eligible purchase plus improvement transaction", "Improvement scope and cost are acceptable", "Borrower qualifies on total mortgage amount", "Lender can administer holdback, inspection, and release"],
    documents: ["Purchase agreement", "Contractor quote or detailed estimate", "Income/down payment package", "Appraisal, post-improvement value, invoices, or inspection proof if required"],
    exclusions: ["Unclear renovations, owner labour, luxury/non-fixed items, or unsupported costs can be excluded.", "Borrower must be able to cash-flow work before holdback release where lender requires it."],
    watch: ["Explain the cash-flow gap between closing and release of improvement funds.", "Confirm if the lender needs permits, invoices, final inspection, or appraisal updates.", "Make sure the improvement amount is realistic and tied to property value.", "Watch closing dates where contractor quotes expire or work cannot start quickly.", "Check whether premium is charged on the full insured amount including improvements."]
  },
  "sagen-new-to-canada": {
    insurerId: "sagen",
    insurer: "Sagen",
    title: "New to Canada",
    sourceUrl: insurerSourceLinks.sagenProducts,
    purpose: "Supports eligible newcomers who may have limited Canadian credit but can demonstrate income, status, and repayment strength.",
    limits: [
      { label: "Status", value: "Eligible newcomer status must be documented" },
      { label: "Credit", value: "Canadian or alternative credit support" },
      { label: "Funds", value: "International funds require full trail" },
      { label: "Income", value: "Stable Canadian income is usually central" }
    ],
    eligibility: ["Eligible newcomer/immigration status", "Acceptable Canadian employment or income", "Canadian bureau or acceptable alternative credit", "Documented down payment and closing costs"],
    documents: ["Status documents", "Employment letter, pay stubs, and income history", "Alternate credit letters/statements if Canadian bureau is thin", "International bank statements, wire transfers, gift letters, and currency conversion support"],
    exclusions: ["Unverifiable foreign funds, unclear status, or income not accepted by the lender can block the file.", "Thin credit with no alternative payment history needs pre-review."],
    watch: ["Build the file around status, income, credit, and funds trail in that order.", "Collect alternate credit before submission rather than after an insurer condition.", "Explain large transfers and family gifts with source documents.", "Confirm lender appetite for probation, contract roles, or short Canadian tenure.", "Watch translation requirements for foreign documents."]
  },
  "sagen-business-for-self": {
    insurerId: "sagen",
    insurer: "Sagen",
    title: "Business for Self",
    sourceUrl: insurerSourceLinks.sagenProducts,
    purpose: "Sagen's business-for-self path for self-employed borrowers where income and business strength must be supportable.",
    limits: [
      { label: "Income", value: "Reasonable and supported by tax/business documents" },
      { label: "Tenure", value: "Business history and industry consistency matter" },
      { label: "Credit", value: "Strong insured-borrower conduct expected" },
      { label: "Tax", value: "NOAs and tax arrears are key review points" }
    ],
    eligibility: ["Established self-employed borrower", "Income is reasonable for the business and supported by documentation", "Credit and debt service fit insured lending", "Lender accepts the business structure and income method"],
    documents: ["T1s, NOAs, and statement of business activities", "Business registration, articles, GST/HST, or licence", "Financial statements/accountant letter if required", "Business bank statements or contracts when reasonability needs support"],
    exclusions: ["Unsupported stated income, unpaid taxes, or very new business tenure can create decline risk.", "Cash income without a reliable paper trail should be treated carefully."],
    watch: ["Reconcile reported income to the qualifying income before submitting.", "Check personal tax arrears and installment obligations.", "Prepare explanation for add-backs and one-time expenses.", "Watch incorporation, multiple businesses, and spouse payroll complexity.", "Use conservative income where lender policy is unclear."]
  },
  "sagen-vacation-secondary": {
    insurerId: "sagen",
    insurer: "Sagen",
    title: "Vacation / Secondary Homes",
    sourceUrl: insurerSourceLinks.sagenProducts,
    purpose: "Insured financing option for eligible second homes or vacation properties.",
    limits: [
      { label: "Use", value: "Personal/family secondary-home use" },
      { label: "Property", value: "Access, services, and marketability are critical" },
      { label: "Rental", value: "Rental intent may require a different program" },
      { label: "Qualification", value: "All housing obligations included" }
    ],
    eligibility: ["Eligible second or vacation home", "Borrower qualifies with existing residence and new property", "Property is acceptable to lender and insurer", "Occupancy/use is clearly personal or family based"],
    documents: ["Purchase agreement and property details", "Income and liabilities", "Down payment support", "Evidence of services, access, taxes, condo/maintenance costs if needed"],
    exclusions: ["Do not place investment/rental properties here.", "Remote, seasonal, island, cottage, leased-land, or unusual properties need early review."],
    watch: ["Confirm year-round access, water, septic, heating, and insurance marketability.", "Ask about rental plans; even occasional rental can change program fit.", "Include all costs for both homes in affordability.", "Check appraisal risk for rural or recreational properties.", "Confirm lender accepts the region and property type."]
  },
  "sagen-progress-advance": {
    insurerId: "sagen",
    insurer: "Sagen",
    title: "Progress Advance",
    sourceUrl: insurerSourceLinks.sagenProducts,
    purpose: "Insured construction/progress-advance support for eligible new-build or major-construction scenarios.",
    limits: [
      { label: "Advance", value: "Funds released by draw schedule" },
      { label: "Budget", value: "Cost and completion risk must be controlled" },
      { label: "Property", value: "Plans, permits, appraisal and inspections can be required" },
      { label: "Lender", value: "Only lenders with a progress process can use it" }
    ],
    eligibility: ["Eligible construction or progress-advance property", "Borrower qualifies and has acceptable budget/equity", "Builder, plans, permits, and property support are acceptable", "Lender administers draws and inspections"],
    documents: ["Construction contract", "Plans/specs and permits", "Appraisal as-complete", "Draw schedule, budget, builder details, income and down payment support"],
    exclusions: ["Cost-plus contracts, weak builders, missing permits, or unclear budgets can cause problems.", "Land-only or speculative builds may not fit standard insured paths."],
    watch: ["Review construction budget, contingency, and borrower cash position before quoting.", "Confirm draw schedule and who pays expenses between draws.", "Watch appraisal as-complete value and cost overruns.", "Confirm builder warranty, permits, and inspection requirements.", "Explain that construction timelines can affect rate holds and conditions."]
  },
  "sagen-borrowed-down-payment": {
    insurerId: "sagen",
    insurer: "Sagen",
    title: "Borrowed Down Payment",
    sourceUrl: insurerSourceLinks.sagenProducts,
    purpose: "Insured purchase path where an eligible borrowed down payment source may be used if disclosed and debt-serviced.",
    limits: [
      { label: "Funds", value: "Borrowed funds must be documented" },
      { label: "Debt service", value: "Repayment included in ratios" },
      { label: "Credit", value: "Stronger conduct often expected" },
      { label: "Closing", value: "Closing costs still need verified cash" }
    ],
    eligibility: ["Eligible owner-occupied purchase", "Borrowed funds are from an acceptable source", "Borrower qualifies including repayment obligation", "Lender accepts the down payment structure"],
    documents: ["Loan agreement or credit line statement", "Bank statements showing advance and deposit", "Payment amount and liability confirmation", "Income and purchase package"],
    exclusions: ["Undisclosed borrowed funds or funds from unacceptable sources can be treated as misrepresentation.", "Borrowed funds that make affordability too tight should be avoided."],
    watch: ["Always disclose borrowed funds and include payment in debt ratios.", "Check whether closing costs are from own resources.", "Review credit utilization after the down payment advance.", "Confirm lender overlay before pre-approval.", "Explain higher payment stress and post-closing cash-flow risk."]
  },
  "sagen-investment-property": {
    insurerId: "sagen",
    insurer: "Sagen",
    title: "Investment Property",
    sourceUrl: insurerSourceLinks.sagenProducts,
    purpose: "Insured option for eligible rental/investment properties where lender and insurer permit the scenario.",
    limits: [
      { label: "Use", value: "Rental/investment property" },
      { label: "Income", value: "Lease or market-rent support" },
      { label: "LTV", value: "Confirm product-specific maximum" },
      { label: "Cash flow", value: "Rental worksheet and global debts matter" }
    ],
    eligibility: ["Eligible residential investment property", "Borrower qualifies with rental treatment and all obligations", "Property is marketable and legal for rental use", "Lender offers Sagen investment product"],
    documents: ["Lease or market rent support", "Appraisal/rent schedule if required", "Income and liability package", "Property tax, condo fee, heat and operating cost details"],
    exclusions: ["Short-term rental, illegal units, weak market rent support, or poor property condition may not fit.", "Portfolio exposure can trigger extra lender review."],
    watch: ["Use the lender's rental worksheet, not a rough rent estimate.", "Confirm legal unit status and zoning.", "Watch vacancy, repairs, condo status, and property management expenses.", "Review global cash flow for borrowers with multiple rentals.", "Do not assume owner-occupied rental rules apply to pure investment."]
  },
  "sagen-family-plan": {
    insurerId: "sagen",
    insurer: "Sagen",
    title: "Family Plan",
    sourceUrl: insurerSourceLinks.sagenProducts,
    purpose: "Sagen family-support path for eligible situations where family help forms part of the ownership or qualification structure.",
    limits: [
      { label: "Family support", value: "Structure must be transparent" },
      { label: "Ownership", value: "Borrower, co-borrower, guarantor and title roles must match lender policy" },
      { label: "Occupancy", value: "Occupancy intent must be clear" },
      { label: "Disclosure", value: "Gift/co-borrower support must be documented" }
    ],
    eligibility: ["Eligible family-supported purchase", "Ownership/guarantor structure accepted by lender and insurer", "All supporting parties qualify where required", "Down payment and occupancy are clearly documented"],
    documents: ["Gift letter or family support documentation", "Co-borrower/guarantor income, credit and liabilities if applicable", "Purchase agreement", "Occupancy and relationship explanation"],
    exclusions: ["Straw-buyer arrangements, undisclosed beneficial ownership, or unclear occupancy should be avoided.", "Family support cannot hide affordability or source-of-funds issues."],
    watch: ["Clarify who will live in the property and who is on title/mortgage.", "Document gifts and family transfers fully.", "Review tax, legal, and future exit implications with the clients' advisors.", "Confirm lender policy for guarantors or non-occupying co-borrowers.", "Watch affordability if family support is temporary."]
  },
  "sagen-second-mortgage": {
    insurerId: "sagen",
    insurer: "Sagen",
    title: "Second Mortgage",
    sourceUrl: insurerSourceLinks.sagenProducts,
    purpose: "Sagen program path for eligible insured second mortgage structures where lender and insurer permit the transaction.",
    limits: [
      { label: "Structure", value: "First and second mortgage terms must be compatible" },
      { label: "CLTV", value: "Combined LTV is the key risk measure" },
      { label: "Purpose", value: "Use of funds must be acceptable" },
      { label: "Lender", value: "Availability is lender-specific" }
    ],
    eligibility: ["Eligible borrower and property", "First mortgage and proposed second mortgage fit combined exposure rules", "Purpose and repayment plan are acceptable", "Submitting lender supports the structure"],
    documents: ["First mortgage statement and terms", "Second mortgage request and purpose", "Income, credit, and property support", "Payout and title details if applicable"],
    exclusions: ["Private seconds, arrears, or unclear use of funds can move the file outside insured lending.", "Do not assume a second mortgage can be added to every insured loan."],
    watch: ["Calculate combined LTV and total payment shock.", "Review first mortgage restrictions, registration, and consent requirements.", "Document borrower benefit and exit strategy.", "Check legal costs, payout penalties, and title issues.", "Confirm availability with both lender and Sagen before advising."]
  },
  "sagen-refinance-secondary-suites": {
    insurerId: "sagen",
    insurer: "Sagen",
    title: "Refinance for Secondary Suites",
    sourceUrl: insurerSourceLinks.sagenProducts,
    purpose: "Insured refinance path intended to support eligible creation or improvement of secondary suites where current rules permit.",
    limits: [
      { label: "Purpose", value: "Funds tied to eligible secondary-suite work" },
      { label: "Evidence", value: "Budget, permits and value support are important" },
      { label: "Rental", value: "Future rent may need support" },
      { label: "Property", value: "Legal suite requirements must be checked" }
    ],
    eligibility: ["Property and work qualify under current secondary-suite rules", "Borrower qualifies for refinanced mortgage", "Lender accepts project budget, permits, and property value", "Suite legality and rental assumptions are supportable"],
    documents: ["Renovation budget/contractor quotes", "Permit or zoning support where required", "Appraisal and rent schedule if required", "Existing mortgage payout and income package"],
    exclusions: ["Unpermitted or illegal units, vague budgets, or speculative rent may not fit.", "General debt consolidation should not be mixed with suite funds unless allowed."],
    watch: ["Confirm the suite can be legal and marketable before quoting.", "Tie every dollar of refinance proceeds to eligible work.", "Watch cost overruns and completion timing.", "Use conservative rental income until the lender accepts the method.", "Explain inspections, holdbacks, and post-completion conditions."]
  },
  "sagen-self-directed-rrsp": {
    insurerId: "sagen",
    insurer: "Sagen",
    title: "Self-Directed RRSP",
    sourceUrl: insurerSourceLinks.sagenProducts,
    purpose: "Program support for eligible mortgage structures involving self-directed RRSP funds where lender and trustee rules permit.",
    limits: [
      { label: "Structure", value: "Trustee, RRSP and mortgage rules must align" },
      { label: "Documentation", value: "Legal and tax paperwork is central" },
      { label: "Suitability", value: "Borrower should obtain independent advice" },
      { label: "Availability", value: "Not a standard lender path" }
    ],
    eligibility: ["Lender and trustee support the self-directed RRSP structure", "Borrower/property qualifies under insurer and lender rules", "Legal, tax, and registration requirements are satisfied", "Transaction purpose is acceptable"],
    documents: ["Trustee documentation", "RRSP/account statements", "Mortgage and legal instructions", "Income, credit, purchase/property package"],
    exclusions: ["Do not advise on tax suitability; borrower needs professional advice.", "Unavailable trustee/lender support means the structure cannot proceed."],
    watch: ["Confirm lender, trustee, lawyer, and insurer acceptance before presenting this as an option.", "Flag tax, liquidity, and investment-risk implications.", "Watch related-party rules and documentation timing.", "Confirm all parties understand registration and discharge process.", "Keep advice limited to mortgage placement, not investment advice."]
  },
  "sagen-energy-efficient": {
    insurerId: "sagen",
    insurer: "Sagen",
    title: "Energy Efficient Housing",
    sourceUrl: insurerSourceLinks.sagenProducts,
    purpose: "Sagen energy-efficient housing feature for eligible homes or improvements that meet the current energy-performance criteria.",
    limits: [
      { label: "Proof", value: "Energy rating, certification or accepted evidence required" },
      { label: "Benefit", value: "May involve premium/refund treatment" },
      { label: "Timing", value: "Documentation deadline must be followed" },
      { label: "Approval", value: "Normal borrower and property approval still applies" }
    ],
    eligibility: ["Property or improvements meet current Sagen energy-efficient criteria", "Borrower otherwise qualifies for insured mortgage approval", "Lender supports Sagen submission and documentation flow", "Required energy proof can be delivered within the allowed timeline"],
    documents: ["Energy rating/certificate or acceptable energy-performance proof", "Purchase or improvement documents", "Receipts or post-improvement support if needed", "Mortgage insurance application details"],
    exclusions: ["Unsupported efficiency claims, expired assessments, or incomplete renovations may not qualify.", "This feature does not fix borrower, income, credit, or property deficiencies."],
    watch: ["Collect energy documents early and check that they match Sagen's accepted format.", "Confirm how and when the borrower receives any premium benefit.", "Watch new-build completion timing and renovation evidence.", "Coordinate documentation with the lender so the insurer receives it properly.", "Set conservative expectations until Sagen accepts the energy proof."]
  },
  "sagen-portability": {
    insurerId: "sagen",
    insurer: "Sagen",
    title: "Portability",
    sourceUrl: insurerSourceLinks.sagenProducts,
    purpose: "Allows eligible borrowers to transfer existing Sagen mortgage insurance benefits to a new mortgage scenario.",
    limits: [
      { label: "Existing insurance", value: "Must identify original Sagen insurance" },
      { label: "Top-up", value: "New money may create premium top-up" },
      { label: "Timing", value: "Sale and purchase timing matters" },
      { label: "Qualification", value: "New loan still needs approval" }
    ],
    eligibility: ["Existing insured mortgage is eligible for Sagen portability", "New mortgage and property are acceptable", "Borrower qualifies under current lender/insurer rules", "Request follows lender/Sagen process"],
    documents: ["Existing mortgage details", "New purchase/property documents", "Updated income and credit package", "Payout, sale and closing-date information"],
    exclusions: ["Insurance cannot be ported if the new loan/property is not eligible.", "Cash-out, occupancy changes, or major loan increases can reduce benefit."],
    watch: ["Confirm the original insurer before promising portability.", "Calculate premium top-up if the mortgage increases.", "Watch sale/purchase dates and bridge financing.", "Confirm the new lender can process the Sagen portability request.", "Document borrower qualification like a new insured file."]
  },
  "sagen-homeowner-assistance": {
    insurerId: "sagen",
    insurer: "Sagen",
    title: "Homeowner Assistance",
    sourceUrl: insurerSourceLinks.sagenProducts,
    purpose: "Borrower assistance pathway for insured mortgages where the homeowner is experiencing financial hardship.",
    limits: [
      { label: "Use", value: "Existing insured homeowner hardship support" },
      { label: "Start point", value: "Borrower contacts lender/servicer first" },
      { label: "Options", value: "Workout options depend on hardship and lender approval" },
      { label: "Disclosure", value: "Credit and repayment impact must be explained" }
    ],
    eligibility: ["Existing Sagen-insured mortgage", "Borrower is experiencing temporary or ongoing payment hardship", "Lender/servicer is engaged", "Borrower provides financial information for review"],
    documents: ["Hardship explanation", "Current income and budget", "Mortgage statement and arrears details", "Lender/servicer forms and supporting documents"],
    exclusions: ["This is not a new purchase or refinance product.", "No broker should promise deferral, capitalization, or modification before servicer review."],
    watch: ["Tell borrowers to contact the lender early, before missed payments compound.", "Document hardship cause and realistic recovery plan.", "Explain possible credit bureau and repayment impacts.", "Confirm whether property tax, condo fees, or insurance arrears exist.", "Keep notes clear because assistance decisions involve lender, insurer, and servicer."]
  },
  "cg-purchase-advantage": {
    insurerId: "canada-guaranty",
    insurer: "Canada Guaranty",
    title: "Purchase Advantage",
    sourceUrl: insurerSourceLinks.canadaGuarantyProducts,
    purpose: "Canada Guaranty's insured purchase program for eligible high-ratio homebuyers.",
    limits: [
      { label: "Typical LTV", value: "Up to 95% for eligible purchase tiers" },
      { label: "Use", value: "Owner-occupied purchase" },
      { label: "Credit", value: "Strong insured-borrower profile expected" },
      { label: "Overlay", value: "Lender rules decide final fit" }
    ],
    eligibility: ["Eligible home purchase", "Borrower qualifies under Canada Guaranty and lender rules", "Down payment and closing costs are verified", "Property is acceptable and marketable"],
    documents: ["Purchase agreement", "Income and employment confirmation", "Down payment proof and gift/loan support", "Credit bureau, liabilities, and property details"],
    exclusions: ["Do not use for rental, low-doc, construction, or second-home files when a specific advantage program is a better match.", "Unclear funds, unsupported income, or unusual property risk need pre-review."],
    watch: ["Confirm current LTV, amortization, premium, and purchase-price rules before quoting.", "Check whether the lender offers Canada Guaranty on that channel.", "Trace down payment and explain large deposits before submission.", "Watch property condition, private sales, and non-arm's-length transactions.", "Separate lender conditions from insurer conditions in your client notes."]
  },
  "cg-flex-95": {
    insurerId: "canada-guaranty",
    insurer: "Canada Guaranty",
    title: "Flex 95 Advantage",
    sourceUrl: insurerSourceLinks.canadaGuarantyProducts,
    purpose: "Canada Guaranty insured purchase option for eligible borrowers using flexible down payment sources.",
    limits: [
      { label: "Down payment", value: "Flexible source must be acceptable and documented" },
      { label: "Debt service", value: "Borrowed repayment must be included" },
      { label: "Credit", value: "Strong conduct helps support flexibility" },
      { label: "Closing costs", value: "Must still be verified" }
    ],
    eligibility: ["Eligible owner-occupied purchase", "Down payment source fits Canada Guaranty and lender policy", "Borrower qualifies including repayment on borrowed funds", "Lender offers the program"],
    documents: ["Down payment source documents", "Loan/gift paperwork and repayment amount if applicable", "Purchase agreement", "Income, credit, and closing-cost support"],
    exclusions: ["Undisclosed borrowed funds or unacceptable sources are not eligible.", "Files with tight residual cash flow need careful affordability review."],
    watch: ["Confirm the exact source of every down payment dollar.", "Include payments for borrowed funds in GDS/TDS.", "Check lender comfort before issuing a pre-approval.", "Watch credit utilization after funds are advanced.", "Keep a clear audit trail to avoid fraud concerns."]
  },
  "cg-downpayment-advantage": {
    insurerId: "canada-guaranty",
    insurer: "Canada Guaranty",
    title: "Downpayment Advantage",
    sourceUrl: insurerSourceLinks.canadaGuarantyProducts,
    purpose: "Canada Guaranty path supporting eligible down payment structures where funds are acceptable and fully disclosed.",
    limits: [
      { label: "Funds", value: "Source and repayment must be documented" },
      { label: "Qualification", value: "Debt service must include related obligations" },
      { label: "Use", value: "Owner-occupied purchase" },
      { label: "Overlay", value: "Lender may be stricter" }
    ],
    eligibility: ["Eligible purchase", "Down payment source is allowed by Canada Guaranty and lender", "Borrower qualifies with any related liability", "Closing costs and liquidity are acceptable"],
    documents: ["Bank statements and source-of-funds trail", "Gift, loan, or credit facility support", "Income and credit package", "Purchase/property documents"],
    exclusions: ["Borrowed money cannot be hidden or treated as own savings.", "Unverifiable gifts, cash deposits, or third-party funds can stop approval."],
    watch: ["Ask down payment questions before rate discussion.", "Identify gifts, loans, RRSP withdrawals, sales proceeds, and foreign transfers separately.", "Include every repayment obligation in ratios.", "Confirm lender-specific rules for borrowed or gifted funds.", "Watch anti-money-laundering and fraud documentation gaps."]
  },
  "cg-purchase-advantage-plus": {
    insurerId: "canada-guaranty",
    insurer: "Canada Guaranty",
    title: "Purchase Advantage Plus",
    sourceUrl: insurerSourceLinks.canadaGuarantyProducts,
    purpose: "Canada Guaranty's purchase plus improvements path for financing eligible renovations with the insured purchase.",
    limits: [
      { label: "Purpose", value: "Purchase plus approved improvements" },
      { label: "Holdback", value: "Improvement funds may be released after completion" },
      { label: "Evidence", value: "Quotes and value support required" },
      { label: "Timing", value: "Completion deadlines matter" }
    ],
    eligibility: ["Eligible purchase and improvement project", "Borrower qualifies on the improved mortgage amount", "Improvement cost and scope are accepted", "Lender can manage holdback/inspection process"],
    documents: ["Purchase agreement", "Contractor quotes or written estimates", "Appraisal/as-improved value support if required", "Income, down payment, invoices and completion evidence"],
    exclusions: ["Unsupported work, owner labour, non-fixtures, or work that does not add acceptable value may be excluded.", "Borrower should not expect holdback funds before lender release conditions are met."],
    watch: ["Explain holdback mechanics clearly before closing.", "Confirm whether permits, inspections, invoices, or appraisal updates are required.", "Check that improvements are realistic for the closing timeline.", "Watch cost overruns and borrower cash position.", "Document completion requirements in the client file."]
  },
  "cg-maple-leaf-advantage": {
    insurerId: "canada-guaranty",
    insurer: "Canada Guaranty",
    title: "Maple Leaf Advantage",
    sourceUrl: insurerSourceLinks.canadaGuarantyProducts,
    purpose: "Canada Guaranty's newcomer-focused insured program for eligible borrowers building their Canadian credit and homeownership profile.",
    limits: [
      { label: "Status", value: "New-to-Canada status must be documented" },
      { label: "Credit", value: "Canadian or alternate credit evidence" },
      { label: "Funds", value: "Foreign funds need complete trail" },
      { label: "Income", value: "Canadian employment/income verification expected" }
    ],
    eligibility: ["Eligible newcomer borrower", "Acceptable employment and income", "Canadian or alternate credit is satisfactory", "Down payment source and closing costs are documented"],
    documents: ["Immigration/status documents", "Employment and income support", "Alternate credit documents if needed", "Foreign and Canadian bank statements, wires, gifts, and translation support"],
    exclusions: ["Unclear status, no repayment history, or unverifiable foreign funds can lead to decline.", "Do not assume foreign credit reports are enough without lender acceptance."],
    watch: ["Check status and landing date before choosing the program.", "Build a clean alternate-credit package when bureau depth is thin.", "Trace international funds to original source.", "Confirm employment probation, variable income, or contract role acceptance.", "Watch document translation and name-mismatch issues."]
  },
  "cg-low-doc-advantage": {
    insurerId: "canada-guaranty",
    insurer: "Canada Guaranty",
    title: "Low Doc Advantage",
    sourceUrl: insurerSourceLinks.canadaGuarantyProducts,
    purpose: "Canada Guaranty low-documentation path for eligible self-employed borrowers where income reasonability can be supported.",
    limits: [
      { label: "Borrower", value: "Self-employed / low-doc scenario" },
      { label: "Income", value: "Reasonable and supportable, not unsupported stated income" },
      { label: "Credit", value: "Strong repayment conduct expected" },
      { label: "Tax", value: "NOA/tax position remains important" }
    ],
    eligibility: ["Eligible self-employed borrower", "Business activity and income are reasonable", "Credit profile supports insured lending", "Lender accepts the documentation route"],
    documents: ["Business registration/licence/articles", "NOAs or tax documents where required", "Business bank statements, financials, invoices, contracts or accountant support", "Income reasonability explanation"],
    exclusions: ["No-document stated income is not the same as low-doc qualification.", "Tax arrears, very new businesses, or unexplained cash income need careful review."],
    watch: ["Prepare an income reasonability memo before submission.", "Check tax arrears and business tenure.", "Use conservative qualifying income when evidence is mixed.", "Document industry, contracts, and recurring revenue.", "Confirm lender overlays because low-doc appetite varies widely."]
  },
  "cg-lifestyle-advantage": {
    insurerId: "canada-guaranty",
    insurer: "Canada Guaranty",
    title: "Lifestyle Advantage",
    sourceUrl: insurerSourceLinks.canadaGuarantyProducts,
    purpose: "Canada Guaranty second-home/vacation-home style program for eligible lifestyle properties.",
    limits: [
      { label: "Use", value: "Personal/family use, not pure investment" },
      { label: "Property", value: "Marketability, services and access reviewed" },
      { label: "Qualification", value: "Borrower carries all obligations" },
      { label: "Rental", value: "Rental intent can change fit" }
    ],
    eligibility: ["Eligible second or vacation property", "Borrower qualifies with existing and new housing costs", "Property is acceptable to lender and insurer", "Occupancy and use are clear"],
    documents: ["Purchase agreement", "Property details and service/access information", "Income, credit, and liabilities", "Down payment and closing-cost support"],
    exclusions: ["Investment property, short-term rental strategy, or unusual cottage property may not fit.", "Rural, seasonal, island, leased-land, or off-grid properties need early review."],
    watch: ["Ask whether the client plans to rent the property.", "Check access, utilities, water, septic, heat, insurance and marketability.", "Include all carrying costs for both homes.", "Review appraisal comparables early in recreational areas.", "Confirm lender regional and property-type appetite."]
  },
  "cg-progress-draw-advantage": {
    insurerId: "canada-guaranty",
    insurer: "Canada Guaranty",
    title: "Progress Draw Advantage",
    sourceUrl: insurerSourceLinks.canadaGuarantyProducts,
    purpose: "Insured financing support for eligible construction or progress-advance scenarios.",
    limits: [
      { label: "Advance", value: "Draws released as construction progresses" },
      { label: "Evidence", value: "Plans, budget, permits, appraisal and inspections" },
      { label: "Risk", value: "Cost overrun and completion risk must be managed" },
      { label: "Lender", value: "Only progress-draw lenders can administer" }
    ],
    eligibility: ["Eligible construction/new-build scenario", "Borrower qualifies and has sufficient resources", "Builder, plans, permits, and budget are acceptable", "Lender supports Canada Guaranty progress draw process"],
    documents: ["Construction contract", "Draw schedule and budget", "Plans/specs, permits, builder information", "As-complete appraisal, income and down payment support"],
    exclusions: ["Speculative builds, missing permits, unsupported budgets, or weak builders create high decline risk.", "Land-only financing is not the same as insured progress draw."],
    watch: ["Review borrower cash reserves for deposits, overruns, and draw gaps.", "Confirm inspection and advance timing with the lender.", "Watch appraisal as-complete value versus construction cost.", "Check builder warranty and permit status.", "Explain rate-hold and condition timing risk."]
  },
  "cg-portable-advantage": {
    insurerId: "canada-guaranty",
    insurer: "Canada Guaranty",
    title: "Portable Advantage",
    sourceUrl: insurerSourceLinks.canadaGuarantyProducts,
    purpose: "Canada Guaranty portability option for eligible borrowers transferring insurance benefits to a new property or mortgage.",
    limits: [
      { label: "Existing insurance", value: "Original Canada Guaranty policy must be identified" },
      { label: "Top-up", value: "Premium may apply if loan amount increases" },
      { label: "Timing", value: "Sale/purchase dates and lender process matter" },
      { label: "Qualification", value: "New loan must qualify" }
    ],
    eligibility: ["Existing Canada Guaranty-insured mortgage", "New property and loan remain eligible", "Borrower qualifies under current rules", "Lender can process portability request"],
    documents: ["Existing mortgage and insurer details", "New purchase/property documents", "Updated income and credit package", "Payout, sale, closing-date and bridge details"],
    exclusions: ["Portability is not automatic if the new transaction is not insurable.", "Occupancy changes, refinance components, or major loan increases can limit benefit."],
    watch: ["Confirm the original insurer before advising on premium savings.", "Calculate top-up premium and compare alternatives.", "Watch closing gaps and bridge financing.", "Check whether the new lender offers Canada Guaranty portability.", "Treat qualification and property review as a new insured file."]
  },
  "cg-rental-advantage": {
    insurerId: "canada-guaranty",
    insurer: "Canada Guaranty",
    title: "Rental Advantage",
    sourceUrl: insurerSourceLinks.canadaGuarantyProducts,
    purpose: "Canada Guaranty insured program path for eligible rental/investment-property scenarios.",
    limits: [
      { label: "Use", value: "Rental/investment property" },
      { label: "Income", value: "Lease or market rent support" },
      { label: "Worksheet", value: "Rental calculation must follow lender method" },
      { label: "Exposure", value: "Portfolio risk may be reviewed" }
    ],
    eligibility: ["Eligible rental property", "Borrower qualifies with rental treatment and all obligations", "Property is legal, marketable and acceptable", "Lender offers Rental Advantage"],
    documents: ["Lease, market rent, or rent schedule", "Appraisal and property operating details", "Taxes, condo fees, heat and other carrying costs", "Borrower income, liabilities and rental portfolio information"],
    exclusions: ["Short-term rentals, illegal units, weak market rent support, or poor condition can fail eligibility.", "Do not use owner-occupied rental treatment for pure investment without confirmation."],
    watch: ["Use the lender's rental worksheet and vacancy assumption.", "Confirm legal unit status and zoning.", "Review global cash flow and exposure for portfolio landlords.", "Watch condo status, repairs, property management, and taxes.", "Collect leases before submission to avoid income-condition delays."]
  },
  "cg-refinance-secondary-suites": {
    insurerId: "canada-guaranty",
    insurer: "Canada Guaranty",
    title: "Refinance for Secondary Suites",
    sourceUrl: insurerSourceLinks.canadaGuarantyProducts,
    purpose: "Canada Guaranty refinance path for eligible creation or improvement of secondary suites where the current program permits.",
    limits: [
      { label: "Purpose", value: "Funds tied to eligible secondary-suite work" },
      { label: "Property", value: "Legal suite and zoning review required" },
      { label: "Budget", value: "Quotes, permits and value support matter" },
      { label: "Rental", value: "Rental income needs accepted method" }
    ],
    eligibility: ["Existing property and secondary-suite work fit current rules", "Borrower qualifies for the refinanced mortgage", "Suite legality, permits, value and budget are supportable", "Lender offers the program"],
    documents: ["Existing mortgage payout", "Renovation budget and contractor quotes", "Permit/zoning support", "Appraisal/rent schedule and income package"],
    exclusions: ["Unpermitted units, vague work, or funds used for unrelated debt may not qualify.", "Future rental income should not be overstated before lender acceptance."],
    watch: ["Confirm legal suite path before discussing proceeds.", "Tie refinance funds to eligible construction or improvement work.", "Watch holdbacks, inspections, invoices, and completion deadlines.", "Use conservative rental income and vacancy assumptions.", "Prepare borrower for permits, appraisal and post-completion conditions."]
  },
  "cg-energy-efficient-advantage": {
    insurerId: "canada-guaranty",
    insurer: "Canada Guaranty",
    title: "Energy-Efficient Advantage Program",
    sourceUrl: insurerSourceLinks.canadaGuarantyEnergyEfficient,
    purpose: "Canada Guaranty offers a 25% refund on the mortgage insurance premium paid by qualified borrowers purchasing a newly constructed, energy-efficient home.",
    limits: [
      { label: "Refund", value: "25% of standard mortgage insurance premium" },
      { label: "Transaction", value: "Purchase: new construction" },
      { label: "Deadline", value: "Apply within 24 months of closing" },
      { label: "Processing", value: "Refund issued directly to homeowner in 8-12 weeks" }
    ],
    eligibility: [
      "Mortgage financing must be insured through Canada Guaranty.",
      "Canada Guaranty must receive all original mortgage insurance premiums and applicable fees before issuing the partial premium refund.",
      "The insured property must be a newly constructed home.",
      "The property must either meet eligible certification criteria or have at least 20% lower energy consumption than 'A Typical New House' under NRCan EnerGuide."
    ],
    documents: [
      "Completed Energy-Efficient Advantage refund application form.",
      "Documentation confirming the home was built under an eligible certified program.",
      "Or a copy of the EnerGuide Label confirming the energy-consumption requirement is met.",
      "Mortgage closing and Canada Guaranty insurance information needed to support refund review."
    ],
    exclusions: [
      "The example on Canada Guaranty's page excludes applicable provincial sales tax from the premium amount shown.",
      "Unsupported certification claims or missing EnerGuide/certification evidence should not be treated as eligible."
    ],
    watch: [
      "Canada Guaranty states the approved refund includes applicable provincial sales tax where applicable.",
      "Eligible certification examples include BC Energy Step Code, Built Green, LEED, Zero Carbon Building Standard, CHBA Net Zero, R-2000, ENERGY STAR, Novoclimat, and Passive House / EnerPHit criteria.",
      "Refund application can be mailed, emailed, or faxed to Canada Guaranty; email shown by Canada Guaranty is energyefficient@canadaguaranty.ca.",
      "Use subject line/attention: Finance Department - Energy-Efficient Advantage Program.",
      "Do not present the refund as final until Canada Guaranty accepts the application and required documentation."
    ],
    resourceLinks: [
      { label: "Energy-Efficient Advantage", href: insurerSourceLinks.canadaGuarantyEnergyEfficient, note: "Official Canada Guaranty program page" },
      { label: "Refund Application", href: insurerSourceLinks.canadaGuarantyEnergyRefundApplication, note: "Energy-Efficient refund application form" },
      { label: "Products At A Glance", href: insurerSourceLinks.canadaGuarantyProducts, note: "Canada Guaranty product overview" }
    ]
  }
};

Object.assign(insurerProgramDetails, {
  "sagen-tools-resources": {
    insurerId: "sagen",
    insurer: "Sagen",
    title: "Tools & Resources",
    sourceUrl: sagenToolSourceLinks.tools,
    purpose: "Sagen resource hub for forms, reference charts, interest rates, lender updates, underwriting policies and standards, calculators, guides, and policy links.",
    limits: [
      { label: "Guides", value: "FirstHome, Welcome Home, Home Sweeter Home" },
      { label: "Lender tools", value: "UPS, lender updates, forms and worksheets" },
      { label: "Calculators", value: "Payment, premium, and PPI calculators" },
      { label: "Rate references", value: "Premium rates and interest-rate page" }
    ],
    eligibility: [
      "Use the page as the starting point for Sagen forms, guides, product worksheets, premium-rate references, calculators, and underwriting-policy lookups.",
      "Lender-facing resources include Underwriting Policies & Standards, lender updates, premium rates, and lender forms/worksheets.",
      "Borrower-facing guides include FirstHome, Welcome Home, and Home Sweeter Home.",
      "MySagen links are available for application launch, certificate support, and HOAP portal access."
    ],
    documents: [
      "Renovation Worksheet - Purchase Plus Improvements.",
      "Construction Worksheet - Self Built Homes.",
      "Inspection Request Worksheet for progress advance inspections.",
      "Premium Rates PDF for customer premium and top-up premium rates."
    ],
    exclusions: [
      "Tools and calculators are references, not approvals or commitments.",
      "Always confirm final eligibility, documentation, premium, interest-rate assumptions, and lender overlays before advising or submitting."
    ],
    watch: [
      "UPS is Sagen's lender resource for interest rates, policies, guidelines, and related underwriting information.",
      "Premium Rates lists standard, Business for Self, Borrowed Down Payment, Vacation/Secondary Type B, and Investment Property premium tiers.",
      "The PPI calculator and Renovation Worksheet should be paired with Purchase Plus Improvements files.",
      "The Construction Worksheet and Inspection Request Worksheet support Progress Advance / self-built construction files.",
      "Lender updates should be reviewed before relying on older product or policy notes."
    ],
    resourceLinks: [
      { label: "Tools & Resources", href: sagenToolSourceLinks.tools, note: "Sagen resource landing page" },
      { label: "Underwriting Policies & Standards", href: sagenToolSourceLinks.ups, note: "UPS search and policy archive" },
      { label: "Lender Updates", href: sagenToolSourceLinks.lenderUpdates, note: "Current Sagen lender notices" },
      { label: "Lender Forms & Worksheets", href: sagenToolSourceLinks.lenderForms, note: "All Sagen lender worksheets" },
      { label: "Premium Rates PDF", href: sagenToolSourceLinks.premiumRates, note: "Program premium and top-up rates" },
      { label: "Interest Rates", href: sagenToolSourceLinks.interestRates, note: "Interest-rate comparison page" },
      { label: "Payment Calculator", href: sagenToolSourceLinks.paymentCalculator, note: "Mortgage payment calculator" },
      { label: "Premium Calculator", href: sagenToolSourceLinks.premiumCalculator, note: "Mortgage insurance premium calculator" },
      { label: "PPI Calculator", href: sagenToolSourceLinks.ppiCalculator, note: "Purchase Plus Improvements calculator" },
      { label: "Renovation Worksheet", href: sagenToolSourceLinks.renovationWorksheet, note: "PPI renovation worksheet PDF" },
      { label: "Construction Worksheet", href: sagenToolSourceLinks.constructionWorksheet, note: "Self-built homes worksheet PDF" },
      { label: "Inspection Request Worksheet", href: sagenToolSourceLinks.inspectionRequestWorksheet, note: "Progress advance inspection PDF" },
      { label: "FirstHome Guide", href: sagenToolSourceLinks.firstHomeGuide, note: "First-time homebuyer guide PDF" },
      { label: "Welcome Home Guide", href: sagenToolSourceLinks.welcomeHomeGuide, note: "New to Canada guide PDF" },
      { label: "Home Sweeter Home Guide", href: sagenToolSourceLinks.homeSweeterHomeGuide, note: "PPI borrower guide PDF" }
    ]
  },
  "sagen-homebuyer-95": {
    insurerId: "sagen",
    insurer: "Sagen",
    title: "Homebuyer 95 Program",
    sourceUrl: sagenProductSourceLinks.homebuyer95,
    purpose: "Qualified borrowers can buy an owner-occupied home with as little as 5% down, subject to Sagen and lender rules.",
    limits: [
      { label: "LTV", value: "1-2 units up to 95%; 3-4 units up to 90%" },
      { label: "Property value", value: ">80% LTV under $1.5M; <=80% LTV under $1M" },
      { label: "Amortization", value: "Up to 30 years if >80% LTV and first-time buyer or new construction" },
      { label: "Premium", value: "0.60% to 4.00%; +0.20% over 25 years" }
    ],
    eligibility: ["At least one unit must be owner occupied.", "Maximum 4 units; 3-4 unit properties need municipal zoning and fully self-contained units.", "Fixed, standard variable, capped variable, and adjustable-rate mortgages are permitted.", "GDS/TDS guideline shown by Sagen: 39% / 44%."],
    documents: ["Standard income and employment verification.", "Purchase agreement and property details.", "Down payment confirmation using traditional sources such as savings, RRSP, eligible gift, sweat equity, existing equity, or sale proceeds.", "General assignment of rents and leases for 3-4 unit properties."],
    exclusions: ["Business for Self (Alt. A), Borrowed Down Payment, Type B Secondary Homes, and Investment Property are listed as ineligible combinations.", "Property must be readily marketable with ongoing resale demand."],
    watch: ["For >80% LTV, at least one applicant needs minimum 600 credit score; <=80% LTV has a recommended 680 score.", "Use purchase price tiers: 5% down to $500K, then 10% on the portion above $500K up to under $1.5M.", "Top-up premiums range from 0.60% to 6.30%.", "Mortgage insurance is portable subject to lender plan.", "Premium is non-refundable and may be added to the mortgage."]
  },
  "sagen-new-to-canada": {
    insurerId: "sagen",
    insurer: "Sagen",
    title: "New to Canada Program",
    sourceUrl: sagenProductSourceLinks.newToCanada,
    purpose: "Helps eligible borrowers who recently immigrated or relocated to Canada purchase property with as little as 5% down.",
    limits: [
      { label: "LTV", value: "1-2 units up to 95%; 3-4 units up to 90%" },
      { label: "Status", value: "Valid work permit or permanent residency required" },
      { label: "Credit", value: "Canadian bureau or accepted alternate/international credit" },
      { label: "Premium", value: "Standard 0.60% to 4.00%; +0.20% over 25 years" }
    ],
    eligibility: ["Maximum 4 units with one owner-occupied unit.", "Borrower must not be prohibited from purchasing under the Prohibition on the Purchase of Residential Property by Non-Canadians Act.", "All debts held outside Canada must be included in TDS; foreign rental income is excluded from GDS/TDS.", "GDS/TDS guideline shown by Sagen: 39% / 44%."],
    documents: ["Valid work permit or permanent residency verification.", "Income confirmation, down payment confirmation, and purchase and sale agreement.", "For up to 90% LTV, six months of primary bank statements may be used.", "For up to 95% LTV, international credit bureau, 12 months payment consistency, or recognized financial institution reference may support creditworthiness."],
    exclusions: ["Foreign diplomats and other foreign politically appointed individuals who do not pay Canadian income tax are ineligible.", "Business for Self (Alt. A), Borrowed Down Payment, Family Plan, Vacation/Secondary Homes, Investment Property, and Second Mortgage are listed as ineligible combinations."],
    watch: ["Alternative payment examples include rent, utilities, cable, phone, auto insurance, childcare, or documented regular savings.", "Corporate subsidy may be used as down payment where eligible.", "Approved affordable housing grants may be used at 95% LTV.", "For 3-4 unit properties, assignment of rents and leases is required.", "Treat foreign funds, status, and alternate credit as first-pass conditions."]
  },
  "sagen-refinance-secondary-suites": {
    insurerId: "sagen",
    insurer: "Sagen",
    title: "Refinance for Secondary Suites",
    sourceUrl: sagenProductSourceLinks.refinanceSecondarySuites,
    purpose: "Insured refinance option for homeowners adding legal, self-contained secondary unit(s), with progress draws available during construction.",
    limits: [
      { label: "LTV", value: "Up to 90% of property value" },
      { label: "Property", value: "2-4 units inclusive of existing and new units" },
      { label: "Value", value: "Property value under $2M" },
      { label: "Premium", value: "0.60% to 3.10%; top-up 0.60% to 6.25%" }
    ],
    eligibility: ["Existing secured debt may be consolidated into the insured first mortgage.", "Refinanced loan may increase up to $3,000 for transaction costs such as penalties or fees.", "At least one existing unit must be occupied rent-free by the borrower or close relative.", "New units must be legal, fully self-contained, meet municipal zoning, and cannot be short-term rentals."],
    documents: ["Building permit or municipal equivalent at initial closing.", "Occupancy certificate or municipal equivalent before final construction draw.", "Detailed construction cost list/contracts, plans and specifications.", "Borrower contact information for Sagen's full appraisal process."],
    exclusions: ["Borrowed Down Payment, Vacation/Secondary Homes, Investment Property, and Second Mortgage are listed as ineligible combinations.", "Material construction changes after approval may stop further advances."],
    watch: ["Projected rental income from newly built units may be used using fair market rents from an appraiser.", "Full Service covers up to four Sagen-paid progress inspections; extra inspections are customer cost.", "Lender-managed advances are permitted under Standard Service without Sagen authorization for each draw.", "For >80% LTV, at least one applicant needs 600 score; <=80% LTV recommended 680.", "Improvements must be greater than 10% of as-improved value for Sagen-managed draws."]
  },
  "sagen-investment-property": {
    insurerId: "sagen",
    insurer: "Sagen",
    title: "Investment Property Program",
    sourceUrl: sagenProductSourceLinks.investmentProperty,
    purpose: "Allows qualified borrowers to purchase an additional investment property with a minimum of 20% down.",
    limits: [
      { label: "LTV", value: "Purchase up to 80%" },
      { label: "Property", value: "2-4 units only" },
      { label: "Value", value: "Property value under $1M" },
      { label: "Premium", value: "1.45%, 2.00%, or 2.90% by LTV tier" }
    ],
    eligibility: ["Existing resale and eligible new construction properties are permitted.", "Property must be readily marketable and meet municipal zoning and self-contained unit criteria.", "Borrower should have strong credit, recommended minimum 680 score, two trade lines with two years history, and no prior bankruptcy.", "GDS/TDS guideline shown by Sagen: 39% / 44%."],
    documents: ["Signed lease agreements or appraiser-supported fair market rent.", "Standard income and employment verification.", "General assignment of rents and leases.", "Corporate personal guarantees where borrower is not an individual."],
    exclusions: ["1-unit dwellings, time-share interests, vacation homes, commercial zoning, rooming houses, quarter share/shared ownership, and rental pools are listed as ineligible property types.", "Business for Self (Alt. A), Borrowed Down Payment, Family Plan, Homebuyer 95, New to Canada, Progress Advance, Vacation/Secondary Homes, and Second Mortgage are listed as ineligible combinations."],
    watch: ["Sagen accepts 50% of gross rental income; taxes and heat are excluded from debt service.", "TDS formula uses principal, interest, 50% condo fees if applicable, and other debts over gross annual income plus 50% gross rents.", "Down payment must be from own resources, including savings, RRSP, existing equity, or sale proceeds.", "Porting from a standard Sagen insured loan may use a 0.50% outstanding-balance factor plus top-up comparison.", "Personal guarantees cannot be released without Sagen consent."]
  },
  "sagen-family-plan": {
    insurerId: "sagen",
    insurer: "Sagen",
    title: "Family Plan Program",
    sourceUrl: sagenProductSourceLinks.familyPlan,
    purpose: "Allows immediate family to help an owner-occupying family member with good credit buy a home when income alone does not meet standard GDSR/TDSR requirements.",
    limits: [
      { label: "LTV", value: "1-2 units up to 95%; 3-4 units up to 90%" },
      { label: "Family", value: "Father, mother, child, sibling, grandparent, legal guardian, or legal dependent" },
      { label: "Title", value: "All qualifying applicants and resident family member must be on title" },
      { label: "Premium", value: "Standard 0.60% to 4.00%; +0.20% over 25 years" }
    ],
    eligibility: ["Use cases include parents helping adult children, students, or elderly parents on fixed income.", "Purchase must not be a non-owner-occupied investment property or for a family member with poor credit.", "Applicant(s) buying for family must have clean credit, stable employment and income, and positive net worth.", "Income and debts of all applicants are used with the occupying borrower to calculate TDSR."],
    documents: ["Standard documentation requirements.", "Income, credit, liabilities, and net-worth support for assisting family members.", "Purchase agreement, property details, and down payment confirmation from own resources.", "Relationship and occupancy explanation."],
    exclusions: ["Business for Self (Alt. A), Borrowed Down Payment, New to Canada, Progress Advance, Vacation/Secondary Homes, Investment Property, and Second Mortgage are listed as ineligible combinations.", "Poor-credit family-member purchases and non-owner-occupied investments do not fit this program."],
    watch: ["For >80% LTV, at least one applicant needs a 600 score; <=80% LTV has recommended 680 score.", "Immediate family definition matters; do not assume all relatives qualify.", "All shelter costs and debts for all applicants must be included.", "Down payment must be from own resources.", "Mortgage is portable and assumable subject to lender guidelines."]
  },
  "sagen-vacation-secondary": {
    insurerId: "sagen",
    insurer: "Sagen",
    title: "Vacation / Secondary Homes",
    sourceUrl: sagenProductSourceLinks.vacationSecondary,
    purpose: "Enables eligible borrowers to purchase a second home with as little as 5% down for Type A secondary homes or 10% down for Type B vacation homes.",
    limits: [
      { label: "Type A", value: "Secondary home up to 95% LTV; max 1 unit" },
      { label: "Type B", value: "Vacation home up to 90% LTV; max 1 unit" },
      { label: "Value", value: ">80% LTV under $1.5M; <=80% LTV under $1M" },
      { label: "Premium", value: "Type A standard; Type B 1.45% to 4.35%" }
    ],
    eligibility: ["Type A must be owner occupied or occupied by an immediate family member.", "Type B may have seasonal access and does not need to be winterized.", "Both types must be readily marketable; investment, rental pool, and timeshare properties are ineligible.", "GDS/TDS guideline shown by Sagen: 39% / 44%."],
    documents: ["Standard documentation and property details.", "For Type A, verify permanent foundation, residential/rural/seasonal zoning, freehold or condominium tenure, road access, permanent heat, drinkable water, electrical power, and market appeal.", "For Type B, verify acceptable seasonal access, running water, heat source, foundation, and holding tank or services where applicable.", "Income, liabilities, down payment and existing shelter costs."],
    exclusions: ["Type A excludes mixed use, rental pooling, co-ops, and interest ownership.", "Type B excludes Type A combinations such as Homebuyer 95, Borrowed Down Payment, Family Plan, New to Canada, Progress Advance, Second Mortgage, and Investment Property where Sagen lists them as ineligible."],
    watch: ["Type B requires minimum 680 for all applicants, no prior bankruptcy or judgments, and no R3s in the last 24 months.", "Type A credit follows the standard >80% 600 / <=80% 680 guidance.", "Porting from Type A to Type B can trigger a 1.10% premium difference on the ported balance plus top-up premium.", "Maximum one Sagen-insured vacation property per applicant.", "No third-party guarantors for qualification; spousal guarantors are permitted."]
  },
  "sagen-self-directed-rrsp": {
    insurerId: "sagen",
    insurer: "Sagen",
    title: "Self-Directed RRSP",
    sourceUrl: sagenProductSourceLinks.selfDirectedRrsp,
    purpose: "Allows self-directed RRSP/RRIF funds to be used for non-arm's-length mortgage investments where the mortgage is insured.",
    limits: [
      { label: "LTV", value: "Up to 95% max 2 units; up to 90% max 4 units" },
      { label: "Security", value: "First and second mortgages" },
      { label: "RRSP holder", value: "Holder and borrower must be same person or spouse" },
      { label: "Amortization", value: "Up to 30 years if eligible" }
    ],
    eligibility: ["Maximum 4 units; 1-unit properties must be owner occupied.", "New construction and resale properties are eligible where marketability and warranty rules are met.", "Fixed, standard variable, capped variable and adjustable-rate mortgages are permitted.", "GDS/TDS guideline shown by Sagen: 39% / 44%."],
    documents: ["Standard documentation requirements.", "RRSP/RRIF trustee and mortgage investment support.", "Income, credit, purchase, property and down payment package.", "General assignment of rents and leases for 3-4 unit properties."],
    exclusions: ["New to Canada and Type B Vacation/Secondary Homes are listed as ineligible combinations.", "This should not be presented as tax or investment advice."],
    watch: ["In a claim, Sagen notes the maximum interest rate paid on balance owing is the lesser of contract rate plus 2% or 5.25%.", "For >80% LTV, at least one applicant needs 600 score; <=80% LTV recommended 680.", "Government grants may be considered if pre-approved by Sagen.", "Confirm trustee, lender, lawyer, and insurer process before advising.", "Related-party mortgage investment rules need professional advice outside the mortgage placement."]
  },
  "sagen-borrowed-down-payment": {
    insurerId: "sagen",
    insurer: "Sagen",
    title: "Borrowed Down Payment",
    sourceUrl: sagenProductSourceLinks.borrowedDownPayment,
    purpose: "Allows eligible borrowers to use non-traditional down payment sources, including borrowed funds, for 90.01%-95% LTV purchases.",
    limits: [
      { label: "LTV", value: "90.01%-95% where any down payment portion is borrowed" },
      { label: "Property", value: "Maximum 2 units with one owner-occupied unit" },
      { label: "Premium", value: "4.50%; top-up 6.60%" },
      { label: "Credit", value: "Strong profile; minimum 600 score" }
    ],
    eligibility: ["Borrowed down payment can come from arm's-length sources such as personal loans, lines of credit, or credit cards.", "Gifts from non-related individuals may be used.", "Repayment of borrowed funds must be included in TDS.", "Non-residing co-borrowers are acceptable if immediate family and on title."],
    documents: ["Loan, line of credit, or credit card documentation showing source and repayment.", "Gift documentation for non-related gifts.", "Income, credit, purchase agreement, property details, and closing cost confirmation.", "Standard documentation as requested by lender/Sagen."],
    exclusions: ["Non-residing guarantors are not permitted.", "Business for Self (Alt. A), Family Plan, New to Canada, Type B Vacation/Secondary Homes, Investment Property, and Second Mortgage are listed as ineligible combinations."],
    watch: ["Closing costs may be borrowed only if repayments are included in TDS using a 12-month repayment period.", "For portability from standard Sagen insured loan, Sagen lists the lesser of outstanding balance x 0.50% plus top-up, or full premium on new loan.", "Maximum property value follows standard >80% under $1.5M / <=80% under $1M rule.", "Mortgage is portable and assumable subject to lender guidelines.", "This is a high-sensitivity source-of-funds file; disclose everything."]
  },
  "sagen-second-mortgage": {
    insurerId: "sagen",
    insurer: "Sagen",
    title: "Second Mortgage Program",
    sourceUrl: sagenProductSourceLinks.secondMortgage,
    purpose: "Allows an eligible second mortgage to be registered against a purchase property up to 95% combined LTV.",
    limits: [
      { label: "CLTV", value: "Up to 95% based on first and second mortgages" },
      { label: "Security", value: "First mortgage must meet Sagen conditions" },
      { label: "Credit", value: "Recommended minimum 680 score" },
      { label: "Premium", value: "Lesser of combined amount premium or second amount premium" }
    ],
    eligibility: ["First mortgage must be Sagen insured for purchase/purchase plus, CLTV over 90%, or Business for Self (Alt. A).", "First mortgage must be current with stable repayment.", "Second mortgage agreement must contain a cross-default clause.", "If CLTV is over 90%, first mortgage must be held by the same lender."],
    documents: ["First mortgage details and repayment status.", "Second mortgage amount, purpose, terms, and cross-default clause support.", "Income, credit, purchase/property package and down payment confirmation.", "Assignment of rents and leases for 3-4 unit properties."],
    exclusions: ["Borrowed Down Payment, New to Canada, Progress Advance, Type B Vacation/Secondary Homes, Investment Property, and Family Plan are listed as ineligible combinations.", "No re-advanceable first-mortgage amount may be re-advanced until after the second mortgage is paid out."],
    watch: ["Premium tiers shown by Sagen use combined first and second loan amounts versus second mortgage amount, with 85.01%-95% combined premium at 4.00%.", "The first mortgage qualification payment is the greater of actual P+I or qualifying-rate P+I.", "For new concurrent insured first and second mortgages, premium on each is based on cumulative LTV.", "Mortgage is assumable subject to lender guidelines.", "Calculate total payment shock and CLTV before discussing approval."]
  },
  "sagen-portability": {
    insurerId: "sagen",
    insurer: "Sagen",
    title: "Portability Feature",
    sourceUrl: sagenProductSourceLinks.portability,
    purpose: "Helps Sagen-insured borrowers port mortgage default insurance to a new home and potentially reduce future premiums.",
    limits: [
      { label: "Timing", value: "Up to 6 months after closing of currently insured property" },
      { label: "Straight port", value: "No new premium payable" },
      { label: "Top-up", value: "Lesser of full premium less credit or top-up premium on new funds" },
      { label: "Credit", value: "100% within 6 months; 50% within 12; 25% within 24" }
    ],
    eligibility: ["Original mortgage must have been insured by Sagen and be up to date.", "Borrower reassessment is required; income, down payment, and credit requirements still apply.", "At least one original borrower must remain on title where more than one borrower is involved.", "Complete requalification is required if loan amount or LTV increases."],
    documents: ["Offer to Purchase.", "Original Sagen insured mortgage details.", "For increased loan amount or LTV, standard documentation requirements.", "Sale, purchase, payout, bridge, and closing-date information."],
    exclusions: ["Premium credit applies to purchase applications where full premium was paid on the original mortgage; after two years portability can continue but premium credit does not apply.", "Specialty products may use specialty premium rates instead of the standard chart."],
    watch: ["Straight port amortization cannot exceed remaining amortization on original loan.", "Port/top-up maximum amortization is determined by blended amortization or lapsed-time calculation.", "Standard premium chart is 0.60% to 4.00%; top-up 0.60% to 6.30%.", "A 0.20% premium applies where an eligible amortization exceeds 25 years.", "Confirm lender portability plan before quoting savings."]
  },
  "sagen-business-for-self": {
    insurerId: "sagen",
    insurer: "Sagen",
    title: "Business for Self (Alt. A)",
    sourceUrl: sagenProductSourceLinks.businessForSelf,
    purpose: "Insures eligible self-employed borrowers who cannot provide traditional income verification but can support a responsible financial profile.",
    limits: [
      { label: "LTV", value: "Purchase up to 90%" },
      { label: "Business tenure", value: "Minimum 2 years" },
      { label: "Premium", value: "1.50% to 5.85%; top-up 3.00% to 9.00%" },
      { label: "Use", value: "All qualifying applicants must occupy" }
    ],
    eligibility: ["Borrower declares annual income and business revenue that is reasonable for industry, operation length, and business type.", "Lender provides line 15000 from the most recent NOA and confirms no tax arrears.", "Minimum two trade lines with at least two years history.", "No mortgage, instalment, or revolving credit delinquencies in past 12 months; no residential mortgage defaults in past seven years; no prior bankruptcy."],
    documents: ["Business type, industry/profession, ownership percentage, and annual revenue in lender notepad.", "Sole proprietor or partnership: business licence, GST/HST return summary, T1s/T2125, audited financials, business credit report, or public registry confirmation.", "Corporation: articles, audited financial statements, business licence, business credit report, T2 returns, or public registry confirmation.", "Most recent NOA to confirm line 15000 and no income tax arrears; Quebec requires federal and provincial NOAs."],
    exclusions: ["Borrowers with commission income are ineligible.", "Borrowed Down Payment, Family Plan, New to Canada, Investment Property, and Vacation/Secondary Homes are listed as ineligible combinations."],
    watch: ["At >80% LTV, strong credit profile and minimum 600 score are required; <=80% recommended 680.", "Minimum 5% of down payment must come from borrower own savings; remainder may be eligible related-family gift.", "Only one Sagen-insured Business for Self (Alt. A) mortgage is permitted.", "Porting from standard Sagen insured to BFS may use outstanding balance x 2.30% plus top-up comparison.", "Spousal guarantors are acceptable."]
  },
  "sagen-energy-efficient": {
    insurerId: "sagen",
    insurer: "Sagen",
    title: "Energy Efficient Housing Program",
    sourceUrl: sagenProductSourceLinks.energyEfficient,
    purpose: "Rewards buyers of newly constructed energy-efficient homes with a 25% refund of the Sagen mortgage insurance premium, including applicable provincial sales tax.",
    limits: [
      { label: "Refund", value: "25% of Sagen mortgage insurance premium" },
      { label: "Use", value: "Purchase of new construction property" },
      { label: "Efficiency", value: "Eligible certification or 20% lower EnerGuide energy use" },
      { label: "Deadline", value: "Refund application within 24 months of closing" }
    ],
    eligibility: ["Available on all Sagen mortgage insurance products.", "Newly built home must hold an eligible certification or use at least 20% less energy than a typical new house based on NRCan EnerGuide.", "Sagen must receive all mortgage insurance premiums before issuing the partial refund.", "Supporting energy documentation cannot be more than five years old."],
    documents: ["Online or PDF energy-efficient rebate application.", "Documentation confirming the home was built under a certified program.", "Or EnerGuide label confirming the property meets the energy consumption requirement.", "Mortgage insurance and closing details."],
    exclusions: ["Refund applies only to the increase in loan amount where a borrower ports existing Sagen insurance to a new energy-efficient home.", "Mortgage insurance premium example excludes applicable provincial sales tax."],
    watch: ["Eligible certifications include programs such as BC Energy Step Code, Built Green, LEED, CHBA Net Zero, R-2000, ENERGY STAR, Novoclimat, Passive House, and other listed standards.", "Refunds are processed and mailed within 8-12 weeks after application receipt.", "Confirm certificate version and level before promising a rebate.", "Energy documents must be collected early.", "This is a refund feature, not a borrower/property approval substitute."]
  },
  "sagen-progress-advance": {
    insurerId: "sagen",
    insurer: "Sagen",
    title: "Progress Advance Program",
    sourceUrl: sagenProductSourceLinks.progressAdvance,
    purpose: "Allows residential builders and individual homebuyers to use insured progress advances while a property is being built.",
    limits: [
      { label: "Options", value: "Residential Home Builder, Contractor, Self-Built" },
      { label: "LTV", value: "1-2 units up to 95%; 3-4 units up to 90%" },
      { label: "Property", value: "No condominiums; max 4 units with one owner-occupied" },
      { label: "Premium timing", value: "At first advance, by installments, or end of construction" }
    ],
    eligibility: ["Mortgage insurance is based on the lesser of market value of work in place or cost to complete.", "Builder/contractor must meet lender profitability and creditworthiness guidelines.", "Builders/contractors must be in a lender-approved New Home Warranty Program where applicable.", "Prefabricated homes are eligible for full coverage if Sagen-approved process is followed."],
    documents: ["Residential Home Builder: schedules and plans.", "Contractor: municipal-approved plans/specs and contractor contract.", "Self-built: municipal-approved plans/specs, estimates and/or contracts for all construction.", "Full Service submission: signed offer detailing land and construction costs; self-built construction worksheet; inspection requests during construction."],
    exclusions: ["Family Plan, Investment Property, Purchase Plus Improvements, Second Mortgage, and Type B Vacation/Secondary Homes are listed as ineligible combinations.", "Advances must not be made for land only."],
    watch: ["Full Service covers up to four inspections; additional inspections are customer cost.", "Minimum first draw is when property is 15% complete and includes 100% of land cost less down payment.", "Projected rental income from newly built units may be used using fair market rents from an appraiser.", "For >80% LTV, at least one borrower needs 600 score; <=80% LTV recommended 680.", "Condominium properties are not eligible."]
  },
  "sagen-purchase-plus-improvements": {
    insurerId: "sagen",
    insurer: "Sagen",
    title: "Purchase Plus Improvements Program",
    sourceUrl: sagenProductSourceLinks.purchasePlusImprovements,
    purpose: "Allows qualified buyers to include eligible improvement costs in the insured purchase mortgage with as little as 5% down.",
    limits: [
      { label: "LTV", value: "1-2 units up to 95%; 3-4 units up to 90%" },
      { label: "Lending value", value: "Lesser of improved value or purchase price plus direct improvement costs" },
      { label: "Draws", value: "Improvements >10% of as-improved value for Sagen-managed draws" },
      { label: "Premium", value: "Standard 0.60% to 4.00%; +0.20% over 25 years" }
    ],
    eligibility: ["Maximum 4 units with one owner-occupied unit.", "Single or multiple advances excluding initial purchase advance may be lender-managed.", "Projected rental income from newly built units may be used with appraiser fair market rents.", "GDS/TDS guideline shown by Sagen: 39% / 44%."],
    documents: ["Sagen Renovation Worksheet for eligible improvements.", "Renovation quotes, estimates, or other support for as-improved value.", "Completion evidence such as third-party report, photos, paid invoices, or other documentation proportional to scope.", "Assignment of rents and leases for 3-4 unit properties."],
    exclusions: ["Ineligible improvements include personal chattel such as furniture, appliances, electronics, or movable property.", "Progress Advance Program is listed as an ineligible combination."],
    watch: ["Coverage at closing is for financing related to sale price only; coverage for lender-managed advances is effective when proper completion confirmation is documented.", "Sagen-managed advances include up to four progress inspections; extra inspections are customer cost.", "Government grants may be considered if pre-approved by Sagen.", "For >80% LTV, at least one applicant needs 600 score; <=80% LTV recommended 680.", "Launch the PPI calculator when testing improvement structure."]
  },
  "sagen-homeowner-assistance": {
    insurerId: "sagen",
    insurer: "Sagen",
    title: "Homeowner Assistance Program (HOAP)",
    sourceUrl: sagenProductSourceLinks.homeownerAssistance,
    purpose: "Sagen's hardship support service for qualified insured homeowners facing short-term financial difficulty.",
    limits: [
      { label: "Use", value: "Existing Sagen-insured homeowner hardship support" },
      { label: "Portal", value: "HOAP Portal accepts lender/borrower requests" },
      { label: "Contact", value: "1-844-711-4627" },
      { label: "Options", value: "Workout depends on case review" }
    ],
    eligibility: ["Sagen-insured homeowner is experiencing or about to experience financial difficulty.", "Common situations include job loss or reduced income, marital separation, unexpected illness or disability, and natural disasters.", "Sagen assesses each situation with the lender to determine if a workout is possible.", "Earlier contact gives the HOAP team more solution options."],
    documents: ["Reason for hardship.", "Mortgage information.", "Financial details and household budget context.", "Consent and any lender/servicer supporting forms."],
    exclusions: ["HOAP is not a new purchase, refinance, or rate product.", "No deferral, arrears capitalization, payment plan, or restructure should be promised before Sagen/lender review."],
    watch: ["Possible options include capitalizing arrears, increasing amortization, partial or shared payment plan, deferred payments, restructuring mortgage, or assistance with sale of property.", "Suggested lender process: identify the problem, gather facts, investigate and analyze, contact Sagen, then create and implement a plan.", "Use the HOAP Portal for secure request submission.", "Ask borrowers to contact their lender as soon as hardship is known.", "Document credit, arrears, property tax, condo fee, insurance, and recovery-plan impacts clearly."]
  }
});

let activeInsurerProgram = "cmhc-purchase";

const lenderList = document.querySelector("#lenderList");
const lenderPagination = document.querySelector("#lenderPagination");
const detailPanel = document.querySelector("#detailPanel");
const searchInput = document.querySelector("#searchInput");
const portalSearchInput = document.querySelector("#portalSearchInput");
const runSearchButton = document.querySelector("#runSearch");
const lenderTypeFilter = document.querySelector("#lenderTypeFilter");
const creditScoreFilter = document.querySelector("#creditScoreFilter");
const ltvFilter = document.querySelector("#ltvFilter");
const purposeFilter = document.querySelector("#purposeFilter");
const categoryFilterButtons = document.querySelectorAll("[data-category-filter]");
const searchResultCount = document.querySelector("#searchResultCount");
const lenderResultPill = document.querySelector("#lenderResultPill");
const bestRateGrid = document.querySelector("#bestRateGrid");
const portalGrid = document.querySelector("#portalGrid");
const preferredLenderSelect = document.querySelector("#preferredLenderSelect");
const preferredLenderCard = document.querySelector("#preferredLenderCard");
const rateDialog = document.querySelector("#rateDialog");
const rateLenderSelect = document.querySelector("#rateLenderSelect");
const programDetail = document.querySelector("#programDetail");
const programGrid = document.querySelector("#programGrid");
const insurerGrid = document.querySelector("#insurerGrid");
const mortgageNewsFeed = document.querySelector("#mortgageNewsFeed");
const weatherCity = document.querySelector("#weatherCity");
const weatherTemp = document.querySelector("#weatherTemp");
const weatherSummary = document.querySelector("#weatherSummary");
const weatherDetails = document.querySelector("#weatherDetails");
const refreshWeatherButton = document.querySelector("#refreshWeather");

const fallbackMortgageNews = [
  {
    title: "Latest Canadian mortgage rate news",
    source: "Google News",
    href: "https://news.google.com/search?q=Canada%20mortgage%20rates%20mortgage%20brokers"
  },
  {
    title: "Bank of Canada interest rate announcements",
    source: "Bank of Canada",
    href: "https://www.bankofcanada.ca/core-functions/monetary-policy/key-interest-rate/"
  },
  {
    title: "CMHC housing market updates",
    source: "CMHC",
    href: "https://www.cmhc-schl.gc.ca/professionals/housing-markets-data-and-research"
  }
];

const weatherFallbackLocation = {
  city: "Toronto",
  latitude: 43.6532,
  longitude: -79.3832,
  source: "Default Ontario view"
};

document.querySelector("#todayLabel").textContent = new Intl.DateTimeFormat("en-CA", {
  weekday: "short",
  month: "short",
  day: "numeric",
  year: "numeric"
}).format(new Date());

document.querySelector("#themeToggle").addEventListener("click", () => {
  document.body.classList.toggle("dark");
  localStorage.setItem("ontarioBrokerRateDesk.theme", document.body.classList.contains("dark") ? "dark" : "light");
});

if (localStorage.getItem("ontarioBrokerRateDesk.theme") === "dark") {
  document.body.classList.add("dark");
}

document.querySelector("#openRateEditor").addEventListener("click", () => {
  populateRateEditor(activeLenderId);
  rateDialog.showModal();
});

document.querySelector("#clearFilters").addEventListener("click", () => {
  activeFilter = "all";
  activeCreditScore = "all";
  activeLtv = "all";
  activePurpose = "all";
  activeCategory = "all";
  activeLenderPage = 1;
  searchInput.value = "";
  portalSearchInput.value = "";
  lenderTypeFilter.value = "all";
  creditScoreFilter.value = "all";
  ltvFilter.value = "all";
  purposeFilter.value = "all";
  categoryFilterButtons.forEach((button) => button.classList.toggle("active", button.dataset.categoryFilter === "all"));
  render();
});

[lenderTypeFilter, creditScoreFilter, ltvFilter, purposeFilter].forEach((control) => {
  control.addEventListener("change", () => {
    activeFilter = lenderTypeFilter.value;
    activeCreditScore = creditScoreFilter.value;
    activeLtv = ltvFilter.value;
    activePurpose = purposeFilter.value;
    activeLenderPage = 1;
    render();
  });
});

categoryFilterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    activeCategory = button.dataset.categoryFilter;
    activeLenderPage = 1;
    categoryFilterButtons.forEach((item) => item.classList.toggle("active", item === button));
    render();
  });
});

searchInput.addEventListener("input", () => {
  activeLenderPage = 1;
  if (portalSearchInput.value !== searchInput.value) portalSearchInput.value = searchInput.value;
  render();
});
portalSearchInput.addEventListener("input", () => {
  activeLenderPage = 1;
  if (searchInput.value !== portalSearchInput.value) searchInput.value = portalSearchInput.value;
  render();
});
runSearchButton.addEventListener("click", () => {
  activeLenderPage = 1;
  render();
  document.querySelector("#lenders").scrollIntoView({ behavior: "smooth", block: "start" });
});
preferredLenderSelect.addEventListener("change", () => {
  preferredLenderId = preferredLenderSelect.value;
  localStorage.setItem(preferredLenderStorageKey, preferredLenderId);
  activeLenderId = preferredLenderId;
  activeLenderPage = getPageForLender(filteredLenders(), preferredLenderId);
  render();
});

refreshWeatherButton?.addEventListener("click", () => initializeWeather(true));

rateLenderSelect.addEventListener("change", () => populateRateEditor(rateLenderSelect.value));

document.addEventListener("click", (event) => {
  const insurerProgramLink = event.target.closest("[data-insurer-program]");
  if (insurerProgramLink) {
    event.preventDefault();
    event.stopPropagation();
    activeInsurerProgram = insurerProgramLink.dataset.insurerProgram;
    renderInsurers();
    document.querySelector("#insurers").scrollIntoView({ behavior: "smooth", block: "start" });
    return;
  }

  const lenderLink = event.target.closest("[data-lender]");
  if (lenderLink) {
    event.preventDefault();
    event.stopPropagation();
    activeLenderId = lenderLink.dataset.lender;
    activeLenderPage = getPageForLender(filteredLenders(), activeLenderId);
    render();
    document.querySelector("#lenders").scrollIntoView({ behavior: "smooth", block: "start" });
    return;
  }

  const programLink = event.target.closest("[data-program-link]");
  if (!programLink) return;

  event.preventDefault();
  event.stopPropagation();
  activeProgram = programLink.dataset.programLink;
  renderPrograms();
  document.querySelector("#programs").scrollIntoView({ behavior: "smooth", block: "start" });
});

document.addEventListener("keydown", (event) => {
  if (event.key !== "Enter" && event.key !== " ") return;
  const insurerProgramLink = event.target.closest("[data-insurer-program]");
  if (insurerProgramLink) {
    event.preventDefault();
    activeInsurerProgram = insurerProgramLink.dataset.insurerProgram;
    renderInsurers();
    document.querySelector("#insurers").scrollIntoView({ behavior: "smooth", block: "start" });
    return;
  }

  const programLink = event.target.closest("[data-program-link]");
  if (!programLink) return;

  event.preventDefault();
  activeProgram = programLink.dataset.programLink;
  renderPrograms();
  document.querySelector("#programs").scrollIntoView({ behavior: "smooth", block: "start" });
});

document.querySelector("#saveRates").addEventListener("click", () => {
  const lender = lenders.find((item) => item.id === rateLenderSelect.value);
  if (!lender) return;

  lender.rates.insuredFixed = numberOrNull("#insuredFixedInput");
  lender.rates.variable = numberOrNull("#variableInput");
  lender.rates.conventional = numberOrNull("#conventionalInput");
  lender.rates.alt = numberOrNull("#altInput");
  lender.policyNote = document.querySelector("#noteInput").value.trim();
  lender.updated = new Intl.DateTimeFormat("en-CA", { month: "short", day: "numeric", year: "numeric" }).format(new Date());

  saveLenders();
  activeLenderId = lender.id;
  render();
});

document.querySelector("#resetDemoData").addEventListener("click", () => {
  lenders = structuredClone(demoLenders);
  activeLenderId = lenders[0].id;
  saveLenders();
  populateRateEditor(activeLenderId);
  render();
});

function applyDealDeskUpdates(items) {
  items.forEach((lender) => {
    const row = dealDeskRateRows[lender.id];
    if (!row) {
      scrubLenderSourceText(lender);
      return;
    }

    lender.dealDesk = buildDealDeskRates(row);
    lender.updated = `Rate desk ${row.sheetDate}`;
    lender.policyNote = `Updated from ${dealDeskSource.name}, effective ${dealDeskSource.effectiveDate}. ${dealDeskSource.note}`;
    lender.rates.insuredFixed = parseRateValue(row.values[0]);
    lender.rates.variable = parseRateValue(row.values[10]);
    lender.rates.conventional = parseRateValue(row.values[4]);
    scrubLenderSourceText(lender);
  });
}

function scrubLenderSourceText(lender) {
  if (Array.isArray(lender.guidelines)) {
    lender.guidelines = lender.guidelines.map(sanitizeSourceText);
  }
  lender.policyNote = sanitizeSourceText(lender.policyNote);
  lender.updated = sanitizeSourceText(lender.updated);
}

function sanitizeSourceText(value) {
  const legacyShortName = ["B", "O", "S", "S"].join("");
  const legacySourceName = `Mortgage${legacyShortName}`;
  return String(value || "")
    .replace(new RegExp(`${legacySourceName} Rate Sheet`, "g"), "Internal Daily Rate Sheet")
    .replace(new RegExp(`${legacySourceName} rate sheet`, "g"), "internal rate desk")
    .replace(new RegExp(`${legacySourceName} sheet`, "g"), "internal rate desk")
    .replace(new RegExp(legacySourceName, "g"), "Rate Desk")
    .replace(new RegExp(`\\b${legacyShortName}\\b`, "g"), "Rate desk");
}

function buildDealDeskRates(row) {
  const standardLabels = [
    "Insured",
    "Insurable <=65%",
    "Insurable 65%-70%",
    "Insurable 70%-75%",
    "Insurable 75%-80%",
    "Uninsurable 25yr",
    "Refinance 25yr",
    "Rentals",
    "Uninsurable 30yr",
    "Refinance 30yr"
  ];
  const termLabels = ["Insured", "Insurable 80%", "Uninsurable & Refi"];
  const values = row.values;

  return {
    source: dealDeskSource.name,
    effectiveDate: dealDeskSource.effectiveDate,
    sheetDate: row.sheetDate,
    benchmarkRate: dealDeskSource.benchmarkRate,
    primeRate: dealDeskSource.primeRate,
    note: dealDeskSource.note,
    sections: [
      { title: "5 Year Fixed", items: standardLabels.map((label, index) => ({ label, value: values[index] })) },
      { title: "5 Year Variable", items: standardLabels.map((label, index) => ({ label, value: values[10 + index] })) },
      { title: "1 Year Fixed", items: termLabels.map((label, index) => ({ label, value: values[20 + index] })) },
      { title: "2 Year Fixed", items: termLabels.map((label, index) => ({ label, value: values[23 + index] })) },
      { title: "3 Year Fixed", items: termLabels.map((label, index) => ({ label, value: values[26 + index] })) },
      { title: "4 Year Fixed", items: termLabels.map((label, index) => ({ label, value: values[29 + index] })) },
      { title: "7 Year Fixed", items: termLabels.map((label, index) => ({ label, value: values[32 + index] })) },
      { title: "10 Year Fixed", items: termLabels.map((label, index) => ({ label, value: values[35 + index] })) },
      { title: "Line of Credit", items: [{ label: "HELOC", value: values[38] }] }
    ]
  };
}

function parseRateValue(value) {
  if (!value || value === "-") return null;
  const numericValue = Number(value);
  return Number.isFinite(numericValue) ? numericValue : value;
}

function loadLenders() {
  const stored = localStorage.getItem(storageKey);
  if (!stored) return structuredClone(demoLenders);

  try {
    return normalizeLenders(JSON.parse(stored));
  } catch {
    return structuredClone(demoLenders);
  }
}

function normalizeLenders(items) {
  const merged = items.map((item) => {
    const demo = demoLenders.find((lender) => lender.id === item.id);
    return demo ? { ...demo, ...item, rates: { ...demo.rates, ...item.rates } } : item;
  });
  const existingIds = new Set(merged.map((item) => item.id));
  const normalized = [...merged, ...demoLenders.filter((item) => !existingIds.has(item.id))];
  applyDealDeskUpdates(normalized);
  return normalized;
}

function saveLenders() {
  localStorage.setItem(storageKey, JSON.stringify(lenders));
}

function rate(value) {
  if (typeof value === "number" && Number.isFinite(value)) return `${value.toFixed(2)}%`;
  if (typeof value === "string" && value.trim() && value !== "-") return value;
  return "N/A";
}

function numberOrNull(selector) {
  const value = document.querySelector(selector).value;
  if (value === "") return null;
  const numericValue = Number(value);
  return Number.isFinite(numericValue) ? numericValue : value;
}

function renderMortgageNews(items = fallbackMortgageNews) {
  if (!mortgageNewsFeed) return;
  mortgageNewsFeed.innerHTML = items
    .slice(0, 3)
    .map(
      (item) => `
        <article class="news-item">
          <a href="${item.href}" target="_blank" rel="noreferrer">${item.title}</a>
          <small>${item.source}</small>
        </article>
      `
    )
    .join("");
}

async function initializeMortgageNews() {
  renderMortgageNews();
  const rssUrl = encodeURIComponent("https://news.google.com/rss/search?q=Canada+mortgage+rates+mortgage+brokers&hl=en-CA&gl=CA&ceid=CA:en");
  const proxyUrl = `https://api.allorigins.win/raw?url=${rssUrl}`;

  try {
    const response = await fetch(proxyUrl, { cache: "no-store" });
    if (!response.ok) throw new Error("News feed unavailable");
    const rssText = await response.text();
    const documentXml = new DOMParser().parseFromString(rssText, "application/xml");
    const parsedItems = Array.from(documentXml.querySelectorAll("item"))
      .slice(0, 3)
      .map((item) => ({
        title: item.querySelector("title")?.textContent?.replace(/\s+-\s+[^-]+$/, "").trim() || "Mortgage news update",
        source: item.querySelector("source")?.textContent?.trim() || "Mortgage news",
        href: item.querySelector("link")?.textContent?.trim() || fallbackMortgageNews[0].href
      }))
      .filter((item) => item.href);

    if (parsedItems.length) renderMortgageNews(parsedItems);
  } catch {
    renderMortgageNews();
  }
}

function weatherCodeLabel(code) {
  const labels = {
    0: "Clear",
    1: "Mainly clear",
    2: "Partly cloudy",
    3: "Overcast",
    45: "Fog",
    48: "Rime fog",
    51: "Light drizzle",
    53: "Drizzle",
    55: "Dense drizzle",
    61: "Light rain",
    63: "Rain",
    65: "Heavy rain",
    71: "Light snow",
    73: "Snow",
    75: "Heavy snow",
    80: "Rain showers",
    81: "Showers",
    82: "Heavy showers",
    95: "Thunderstorm"
  };
  return labels[code] || "Current conditions";
}

function setWeatherLoading(message = "Checking local conditions...") {
  if (weatherSummary) weatherSummary.textContent = message;
  if (weatherTemp) weatherTemp.textContent = "--";
  if (weatherDetails) weatherDetails.textContent = "Weather helps brokers plan client meetings, showings, and office days.";
}

function getBrowserPosition() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation not supported"));
      return;
    }
    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: false,
      maximumAge: 1000 * 60 * 30,
      timeout: 6000
    });
  });
}

async function reverseGeocodeCity(latitude, longitude) {
  try {
    const url = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`;
    const response = await fetch(url);
    if (!response.ok) throw new Error("City lookup unavailable");
    const data = await response.json();
    return data.city || data.locality || data.principalSubdivision || weatherFallbackLocation.city;
  } catch {
    return weatherFallbackLocation.city;
  }
}

async function loadWeather(location) {
  const url = new URL("https://api.open-meteo.com/v1/forecast");
  url.searchParams.set("latitude", location.latitude);
  url.searchParams.set("longitude", location.longitude);
  url.searchParams.set("current", "temperature_2m,weather_code,wind_speed_10m");
  url.searchParams.set("daily", "temperature_2m_max,temperature_2m_min");
  url.searchParams.set("timezone", "auto");

  const response = await fetch(url);
  if (!response.ok) throw new Error("Weather unavailable");
  return response.json();
}

async function initializeWeather(useBrowserLocation = true) {
  if (!weatherCity || !weatherTemp || !weatherSummary || !weatherDetails) return;
  setWeatherLoading(useBrowserLocation ? "Detecting local weather..." : "Loading Ontario weather...");

  let location = weatherFallbackLocation;
  try {
    if (useBrowserLocation) {
      const position = await getBrowserPosition();
      const latitude = Number(position.coords.latitude.toFixed(4));
      const longitude = Number(position.coords.longitude.toFixed(4));
      const city = await reverseGeocodeCity(latitude, longitude);
      location = { city, latitude, longitude, source: "Local browser location" };
    }

    const weather = await loadWeather(location);
    const temperature = Math.round(weather.current.temperature_2m);
    const wind = Math.round(weather.current.wind_speed_10m);
    const high = Math.round(weather.daily.temperature_2m_max[0]);
    const low = Math.round(weather.daily.temperature_2m_min[0]);
    const summary = weatherCodeLabel(weather.current.weather_code);

    weatherCity.textContent = location.city;
    weatherTemp.textContent = `${temperature}°C`;
    weatherSummary.textContent = summary;
    weatherDetails.textContent = `High ${high}°C / low ${low}°C. Wind ${wind} km/h. ${location.source}.`;
  } catch {
    if (location !== weatherFallbackLocation) {
      initializeWeather(false);
      return;
    }
    weatherCity.textContent = weatherFallbackLocation.city;
    weatherTemp.textContent = "--";
    weatherSummary.textContent = "Local weather pending";
    weatherDetails.textContent = "Allow location or use the refresh button for city-based weather before client meetings and showings.";
  }
}

function filteredLenders() {
  const query = searchInput.value.trim();
  return lenders.filter((lender) => {
    const matchesType = activeFilter === "all" || lender.type === activeFilter;
    return (
      matchesType &&
      matchesCreditScore(lender, activeCreditScore) &&
      matchesLtv(lender, activeLtv) &&
      matchesProgramSet(lender, activePurpose, purposeProgramMap) &&
      matchesProgramSet(lender, activeCategory, categoryProgramMap) &&
      matchesAggressiveSearch(buildSearchHaystack(lender), query)
    );
  });
}

function matchesProgramSet(lender, activeValue, programMap) {
  if (activeValue === "all") return true;
  const targetPrograms = programMap[activeValue] || [];
  return lender.programs.some((program) => targetPrograms.includes(program));
}

function matchesCreditScore(lender, selectedScore) {
  if (selectedScore === "all") return true;
  const borrowerScore = Number(selectedScore);
  return lender.programs.some((program) => {
    const policy = getProgramPolicy(program, lender);
    const minimumScore = extractMinimumScore(policy.minScore);
    return minimumScore === null || minimumScore <= borrowerScore;
  });
}

function matchesLtv(lender, selectedLtv) {
  if (selectedLtv === "all") return true;
  const requestedLtv = Number(selectedLtv);
  return lender.programs.some((program) => {
    const policy = getProgramPolicy(program, lender);
    const maximumLtv = extractMaximumLtv(policy.maxLtv);
    return maximumLtv === null || maximumLtv >= requestedLtv;
  });
}

function extractMinimumScore(value) {
  const text = normalizeSearchText(value);
  if (text.includes("equity led") || text.includes("limited credit") || text.includes("confirm")) return null;
  const scores = [...text.matchAll(/\b(5[0-9]{2}|6[0-9]{2}|7[0-9]{2})\b/g)].map((match) => Number(match[1]));
  return scores.length ? Math.min(...scores) : null;
}

function extractMaximumLtv(value) {
  const text = normalizeSearchText(value);
  if (text.includes("confirm") || text.includes("existing approved balance")) return null;
  const percentages = [...text.matchAll(/\b(6[0-9]|7[0-9]|8[0-9]|9[0-5])\s*%?/g)].map((match) => Number(match[1]));
  return percentages.length ? Math.max(...percentages) : null;
}

function buildSearchHaystack(lender) {
  const underwriting = underwritingGuidelines[lender.id] || defaultUnderwritingGuidelines(lender);
  const productPolicies = lender.programs.map((program) => getProgramPolicy(program, lender));
  return normalizeSearchText(
    [
      lender.name,
      lender.type,
      lender.region,
      lender.website,
      lender.portal,
      lender.bdm,
      lender.email,
      lender.phone,
      lender.programs.join(" "),
      lender.guidelines.join(" "),
      lender.policyNote,
      Object.values(underwriting).join(" "),
      productPolicies
        .map((policy) => [policy.minScore, policy.geography, policy.maxLtv, policy.features.join(" "), policy.exceptions.join(" "), policy.exclusions.join(" ")].join(" "))
        .join(" "),
      rentalAssignmentPolicy.rentalTreatment.join(" "),
      rentalAssignmentPolicy.switchTransfer.join(" "),
      rentalAssignmentPolicy.assignment.join(" "),
      "rental worksheet rental worksheet link policy worksheet"
    ].join(" ")
  );
}

function matchesAggressiveSearch(haystack, query) {
  const normalizedQuery = normalizeSearchText(query);
  if (!normalizedQuery) return true;

  const tokens = normalizedQuery.split(" ").filter((token) => token.length > 1);
  const expandedTerms = expandSearchTerms(normalizedQuery);

  return haystack.includes(normalizedQuery) || tokens.every((token) => haystack.includes(token)) || expandedTerms.some((term) => haystack.includes(term));
}

function expandSearchTerms(query) {
  const terms = new Set([query]);
  Object.entries(aggressiveSearchAliases).forEach(([key, values]) => {
    if (query.includes(key)) {
      values.forEach((value) => terms.add(normalizeSearchText(value)));
    }
  });
  return [...terms].filter(Boolean);
}

function normalizeSearchText(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9+%/. -]+/g, " ")
    .replace(/[-/]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function render() {
  const results = filteredLenders();

  if (!results.some((lender) => lender.id === activeLenderId) && results[0]) {
    activeLenderId = results[0].id;
  }

  renderMetrics();
  renderPortalGrid(results);
  renderSearchSummary(results.length);
  renderBestRateDashboard();
  renderLenderList(results);
  renderDetails(lenders.find((lender) => lender.id === activeLenderId) || results[0]);
  renderPrograms();
  renderInsurers();
  renderContacts();
  renderRateSelect();
}

function renderSearchSummary(resultCount) {
  const activeLabels = [
    activeFilter !== "all" ? titleCase(activeFilter) : "",
    activeCreditScore !== "all" ? `${activeCreditScore}+ score` : "",
    activeLtv !== "all" ? `up to ${activeLtv}% LTV` : "",
    activePurpose !== "all" ? titleCase(activePurpose.replace(/-/g, " / ")) : "",
    activeCategory !== "all" ? titleCase(activeCategory.replace(/-/g, " ")) : ""
  ].filter(Boolean);
  const summary = activeLabels.length ? activeLabels.join(" · ") : "All filters open";
  const countText = `${resultCount} lender${resultCount === 1 ? "" : "s"}`;

  searchResultCount.textContent = `${countText} matched · ${summary}`;
  lenderResultPill.textContent = countText;
}

function renderPortalGrid(results) {
  const featured = results.slice(0, 12);
  if (!featured.length) {
    portalGrid.innerHTML = `<p class="lender-meta">No partner portals match the current search.</p>`;
    return;
  }

  portalGrid.innerHTML = featured
    .map(
      (lender) => `
        <button class="portal-tile" type="button" data-lender="${lender.id}" style="--lender-color: ${lender.brandColor}; --lender-accent: ${lender.brandAccent};">
          <span class="portal-logo-mark">
            ${portalWordmark(lender)}
          </span>
          <span class="portal-tile-footer">${portalFooter(lender)}</span>
        </button>
      `
    )
    .join("");
}

function portalWordmark(lender) {
  const labels = {
    "first-national": ["First National", "Financial LP"],
    "national-bank": ["National", "Bank"],
    "td": ["TD", "Canada Trust"],
    "scotia": ["Scotiabank", "Broker channel"],
    "mcap": ["MCAP", "Broker services"],
    "canada-guaranty": ["Canada Guaranty", "Mortgage insurance"],
    "manulife": ["Manulife", "Bank"],
    "merix": ["MERIX", "Financial"],
    "equitable": ["Equitable", "Bank"],
    "home-trust": ["Home Trust", "Broker resources"],
    "bmo": ["BMO", "BrokerEdge"],
    "rfa": ["RFA", "Mortgage corporation"]
  };
  const [name, subline] = labels[lender.id] || [lender.name, titleCase(lender.type)];
  return `<span class="portal-wordmark">${name}<small>${subline}</small></span>`;
}

function portalFooter(lender) {
  const links = [];
  if (lender.rates.insuredFixed || lender.rates.conventional) links.push("Rate Sheet");
  if (lender.type === "bank" || lender.type === "monoline") links.push("Compensation Grid");
  links.push("Reference");
  return links.slice(0, 3).join(" | ");
}

function renderMetrics() {
  const fixedRates = lenders.map((item) => item.rates.insuredFixed).filter((item) => typeof item === "number");
  const altRates = lenders.map((item) => item.rates.alt).filter((item) => typeof item === "number");

  document.querySelector("#lenderCount").textContent = lenders.length;
  document.querySelector("#lowestFixed").textContent = fixedRates.length ? rate(Math.min(...fixedRates)) : "N/A";
  document.querySelector("#altRange").textContent = altRates.length ? `${rate(Math.min(...altRates))}–${rate(Math.max(...altRates))}` : "N/A";
  document.querySelector("#bdmCount").textContent = lenders.filter((item) => item.bdm).length;
}

function renderBestRateDashboard() {
  const bestOverall = findBestRate(lenders, "insuredFixed") || findBestRate(lenders, "conventional");
  if (!preferredLenderId || !lenders.some((lender) => lender.id === preferredLenderId)) {
    preferredLenderId = bestOverall?.lender.id || lenders[0]?.id || "";
  }

  const groups = [
    { label: "Overall", description: "Best across every lender", items: lenders },
    { label: "Banks", description: "Major bank and bank-channel lenders", items: lenders.filter((lender) => lender.type === "bank") },
    { label: "Monolines", description: "Broker-channel prime lenders", items: lenders.filter((lender) => lender.type === "monoline") },
    { label: "Credit unions", description: "Member and regional lenders", items: lenders.filter((lender) => lender.type === "credit union") },
    { label: "Alternative", description: "Alt lender placement", items: lenders.filter((lender) => lender.type === "alternative") },
    { label: "Private / MIC", description: "MIC and private mortgage placement", items: lenders.filter((lender) => lender.type === "private lender") }
  ];

  bestRateGrid.innerHTML = groups
    .map((group) => {
      const highRatio = findBestRate(group.items, "insuredFixed");
      const conventional = findBestRate(group.items, "conventional");
      const targetLender = highRatio?.lender || conventional?.lender;
      return `
        <article class="best-rate-card">
          <header>
            <div>
              <h4>${group.label}</h4>
              <p>${group.description}</p>
            </div>
            ${targetLender ? `<button class="secondary-button" type="button" data-lender="${targetLender.id}">View</button>` : ""}
          </header>
          <div class="best-rate-pair">
            ${bestRateCell("5yr high ratio", highRatio)}
            ${bestRateCell("5yr conventional", conventional)}
          </div>
        </article>
      `;
    })
    .join("");

  renderPreferredLender();
}

function renderPreferredLender() {
  preferredLenderSelect.innerHTML = lenders.map((lender) => `<option value="${lender.id}">${lender.name}</option>`).join("");
  const lender = lenders.find((item) => item.id === preferredLenderId) || lenders[0];
  if (!lender) {
    preferredLenderCard.innerHTML = `<p class="contact-line">No lender selected.</p>`;
    return;
  }

  preferredLenderId = lender.id;
  preferredLenderSelect.value = lender.id;
  preferredLenderCard.innerHTML = `
    <article class="preferred-lender-card" style="--lender-color: ${lender.brandColor}; --lender-accent: ${lender.brandAccent};">
      <header>
        <span class="lender-logo" aria-hidden="true">${initials(lender.name)}</span>
        <div>
          <h5>${lender.name}</h5>
          <p>${titleCase(lender.type)} · ${lender.updated}</p>
        </div>
      </header>
      <div class="best-rate-pair">
        ${preferredRateCell("5yr high ratio", lender.rates.insuredFixed)}
        ${preferredRateCell("5yr conventional", lender.rates.conventional)}
      </div>
      <div class="badge-row">${lender.programs.slice(0, 4).map((program) => programBadge(program, program, true)).join("")}</div>
      <button class="primary-button" type="button" data-lender="${lender.id}">Open lender profile</button>
    </article>
  `;
}

function findBestRate(items, rateKey) {
  return items
    .map((lender) => ({ lender, value: numericRate(lender.rates[rateKey]) }))
    .filter((item) => item.value !== null)
    .sort((a, b) => a.value - b.value)[0];
}

function numericRate(value) {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function bestRateCell(label, result) {
  if (!result) {
    return `
      <div class="best-rate-cell empty">
        <span>${label}</span>
        <strong>N/A</strong>
        <small>No eligible rate</small>
      </div>
    `;
  }

  return `
    <button class="best-rate-cell" type="button" data-lender="${result.lender.id}">
      <span>${label}</span>
      <strong>${rate(result.value)}</strong>
      <small>${result.lender.name}</small>
    </button>
  `;
}

function preferredRateCell(label, value) {
  return `
    <div class="best-rate-cell">
      <span>${label}</span>
      <strong>${rate(value)}</strong>
      <small>Preferred lender</small>
    </div>
  `;
}

function renderLenderList(results) {
  lenderList.innerHTML = "";
  lenderPagination.innerHTML = "";

  if (!results.length) {
    lenderList.innerHTML = `<p class="lender-meta">No lenders match the current search.</p>`;
    return;
  }

  const totalPages = Math.max(1, Math.ceil(results.length / lendersPerPage));
  activeLenderPage = Math.min(Math.max(activeLenderPage, 1), totalPages);
  const pageStart = (activeLenderPage - 1) * lendersPerPage;
  const visibleLenders = results.slice(pageStart, pageStart + lendersPerPage);

  visibleLenders.forEach((lender) => {
    const card = document.createElement("button");
    card.type = "button";
    card.className = `lender-card lender-${lender.type.replace(/\s+/g, "-")} ${lender.id === activeLenderId ? "active" : ""} ${lender.id === preferredLenderId ? "preferred" : ""}`;
    card.style.setProperty("--lender-color", lender.brandColor);
    card.style.setProperty("--lender-accent", lender.brandAccent);
    card.innerHTML = `
      <header>
        <div class="lender-logo" aria-hidden="true">${initials(lender.name)}</div>
        <div>
          <h4>${lender.name}</h4>
          <p class="lender-meta">${titleCase(lender.type)} · ${lender.portal}</p>
        </div>
        <span class="badge ${lender.id === preferredLenderId ? "preferred-badge" : ""}">${lender.id === preferredLenderId ? "Preferred · " : ""}${lender.updated}</span>
      </header>
      <div class="rate-row">
        ${ratePill("Insured fixed", lender.rates.insuredFixed, "insuredFixed")}
        ${ratePill("Variable", lender.rates.variable, "variable")}
        ${ratePill("Conventional", lender.rates.conventional, "conventional")}
        ${ratePill("Alt", lender.rates.alt, "alt")}
      </div>
      <div class="badge-row">${lender.programs.slice(0, 4).map((program) => programBadge(program, program, true)).join("")}</div>
    `;

    card.addEventListener("click", () => {
      activeLenderId = lender.id;
      render();
    });

    lenderList.appendChild(card);
  });

  renderLenderPagination(results.length, totalPages, pageStart, visibleLenders.length);
}

function renderLenderPagination(totalResults, totalPages, pageStart, visibleCount) {
  const pageButtons = Array.from({ length: totalPages }, (_, index) => {
    const page = index + 1;
    return `<button class="${page === activeLenderPage ? "active" : ""}" type="button" data-lender-page="${page}">${page}</button>`;
  }).join("");

  lenderPagination.innerHTML = `
    <span>Showing ${pageStart + 1}-${pageStart + visibleCount} of ${totalResults} lenders</span>
    <div>
      <button type="button" data-lender-page-prev ${activeLenderPage === 1 ? "disabled" : ""}>Previous</button>
      ${pageButtons}
      <button type="button" data-lender-page-next ${activeLenderPage === totalPages ? "disabled" : ""}>Next</button>
    </div>
  `;

  lenderPagination.querySelectorAll("[data-lender-page]").forEach((button) => {
    button.addEventListener("click", () => {
      activeLenderPage = Number(button.dataset.lenderPage);
      render();
      document.querySelector("#lenders").scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  lenderPagination.querySelector("[data-lender-page-prev]")?.addEventListener("click", () => {
    activeLenderPage = Math.max(1, activeLenderPage - 1);
    render();
    document.querySelector("#lenders").scrollIntoView({ behavior: "smooth", block: "start" });
  });

  lenderPagination.querySelector("[data-lender-page-next]")?.addEventListener("click", () => {
    activeLenderPage = Math.min(totalPages, activeLenderPage + 1);
    render();
    document.querySelector("#lenders").scrollIntoView({ behavior: "smooth", block: "start" });
  });
}

function getPageForLender(results, lenderId) {
  const index = results.findIndex((lender) => lender.id === lenderId);
  return index === -1 ? 1 : Math.floor(index / lendersPerPage) + 1;
}

function renderDetails(lender) {
  if (!lender) {
    detailPanel.innerHTML = `<p class="lender-meta">Select a lender to view details.</p>`;
    return;
  }

  detailPanel.innerHTML = `
    <article class="lender-page" id="lender-page-${lender.id}" style="--lender-color: ${lender.brandColor}; --lender-accent: ${lender.brandAccent};">
      <div class="detail-title">
        <div>
          <p class="eyebrow">Lender page · ${titleCase(lender.type)} · ${lender.region}</p>
          <h4><span class="lender-logo detail-logo" aria-hidden="true">${initials(lender.name)}</span>${lender.name}</h4>
        </div>
        <a class="website-link" href="${lender.website}" target="_blank" rel="noreferrer">Website</a>
      </div>

      ${renderLenderPageSection("1", "Products", renderLenderProducts(lender))}
      ${renderLenderPageSection("2", "Policies", renderLenderPolicies(lender))}
      ${renderLenderPageSection("3", "Underwriting Guidelines", renderUnderwritingContent(lender))}
      ${renderLenderPageSection("4", "Special Offers", renderSpecialOffers(lender))}
      ${renderLenderPageSection("5", "Special Features", renderSpecialFeatures(lender))}
      ${renderLenderPageSection("6", "BDM Contact Information", renderBdmContactInfo(lender))}
    </article>
  `;
}

function renderLenderPageSection(number, title, content) {
  return `
    <section class="lender-page-section">
      <div class="lender-section-heading">
        <span>${number}</span>
        <h5>${title}</h5>
      </div>
      ${content}
    </section>
  `;
}

function renderLenderProducts(lender) {
  return `
    <div class="rate-row">
      ${ratePill("Insured fixed", lender.rates.insuredFixed, "insuredFixed")}
      ${ratePill("Variable", lender.rates.variable, "variable")}
      ${ratePill("Conventional", lender.rates.conventional, "conventional")}
      ${ratePill("Alt", lender.rates.alt, "alt")}
    </div>
    <div class="product-chip-panel">
      <p class="eyebrow">Products offered</p>
      <div class="badge-row">${lender.programs.map((program) => programBadge(program, program, true)).join("")}</div>
    </div>
    ${renderDealDeskSection(lender)}
  `;
}

function renderLenderPolicies(lender) {
  return `
    <div class="policy-summary-panel">
      <p class="eyebrow">Policy watch</p>
      <ul class="policy-list">
        ${lender.guidelines.map((item) => `<li>${item}</li>`).join("")}
      </ul>
    </div>
    ${renderProductPolicyMatrix(lender)}
    ${renderRentalAssignmentPanel()}
  `;
}

function renderUnderwritingContent(lender) {
  const guidelines = underwritingGuidelines[lender.id] || defaultUnderwritingGuidelines(lender);
  const rows = [
    ["Credit", guidelines.credit],
    ["Income", guidelines.income],
    ["Property", guidelines.property],
    ["LTV / product", guidelines.ltv],
    ["Documents", guidelines.documents],
    ["Watch points", guidelines.watch]
  ];

  return `
    <div class="underwriting-grid">
      ${rows
        .map(
          ([label, text]) => `
            <article>
              <strong>${label}</strong>
              <p>${text}</p>
            </article>
          `
        )
        .join("")}
    </div>
    <p class="contact-line">Broker guide only. Confirm the current lender policy, insurer overlays, and commitment conditions before advising or submitting.</p>
  `;
}

function renderSpecialOffers(lender) {
  const offers = [
    { label: "5-year high ratio", value: rate(lender.rates.insuredFixed), note: lender.rates.insuredFixed ? "Current rate desk pricing" : "Confirm lender pricing" },
    { label: "5-year conventional", value: rate(lender.rates.conventional), note: lender.rates.conventional ? "Current rate desk pricing" : "Confirm lender pricing" },
    { label: "Variable / prime-linked", value: rate(lender.rates.variable), note: lender.rates.variable ? "Prime-linked option where available" : "Confirm product availability" }
  ];

  if (lender.id === preferredLenderId) {
    offers.unshift({ label: "Preferred lender", value: "Selected", note: "This lender is prioritized in the broker workspace" });
  }

  if (lender.type === "private lender") {
    offers.push({ label: "Private term sheet", value: "By file", note: "Pricing, fees, and term depend on property, LTV, and exit strategy" });
  }

  return `
    <div class="special-offer-grid">
      ${offers
        .map(
          (offer) => `
            <article>
              <span>${offer.label}</span>
              <strong>${offer.value}</strong>
              <p>${offer.note}</p>
            </article>
          `
        )
        .join("")}
    </div>
  `;
}

function renderSpecialFeatures(lender) {
  const productFeatures = lender.programs.flatMap((program) => getProgramPolicy(program, lender).features);
  const typeFeatures = {
    bank: ["Branch and banking relationship support", "Bank servicing ecosystem", "HELOC or collateral-charge options may be available"],
    monoline: ["Broker-channel focus", "Competitive insured and insurable pricing", "Switch and rental placement paths"],
    alternative: ["Expanded credit and income review", "Equity-focused placement", "Exception-based underwriting"],
    "credit union": ["Member relationship focus", "Local market approach", "Credit union HELOC and switch options may be available"],
    "private lender": ["MIC/private mortgage placement", "Short-term bridge and second mortgage options", "Equity and exit-strategy driven review"]
  };
  const features = [...new Set([...(typeFeatures[lender.type] || []), ...productFeatures])].slice(0, 9);

  return `
    <div class="feature-tile-grid">
      ${features.map((feature) => `<span>${feature}</span>`).join("")}
    </div>
  `;
}

function renderBdmContactInfo(lender) {
  return `
    <div class="bdm-info-grid">
      <article>
        <span>BDM / desk</span>
        <strong>${lender.bdm}</strong>
      </article>
      <article>
        <span>Email</span>
        <strong>${lender.email}</strong>
      </article>
      <article>
        <span>Phone</span>
        <strong>${lender.phone}</strong>
      </article>
      <article>
        <span>Portal</span>
        <strong>${lender.portal}</strong>
      </article>
      <article>
        <span>Region</span>
        <strong>${lender.region}</strong>
      </article>
      <article>
        <span>Website</span>
        <a class="website-link" href="${lender.website}" target="_blank" rel="noreferrer">Open lender website</a>
      </article>
    </div>
    <div class="policy-summary-panel">
      <p class="eyebrow">Desk note</p>
      <p class="contact-line">${lender.policyNote}</p>
    </div>
  `;
}

function renderProductPolicyMatrix(lender) {
  const cards = lender.programs
    .map((program) => {
      const policy = getProgramPolicy(program, lender);
      return `
        <article class="product-policy-card" style="--program-color: ${programColorMap[program] || "#64748B"};">
          <header>
            <h6>${program}</h6>
            ${programBadge(policy.maxLtv, program)}
          </header>
          <div class="policy-stat-grid">
            <span><small>Minimum score</small><strong>${policy.minScore}</strong></span>
            <span><small>Geographic area</small><strong>${policy.geography}</strong></span>
            <span><small>Max LTV</small><strong>${policy.maxLtv}</strong></span>
          </div>
          <div class="policy-breakdown">
            <div>
              <strong>Special features</strong>
              <ul>${policy.features.map((item) => `<li>${item}</li>`).join("")}</ul>
            </div>
            <div>
              <strong>Exceptions</strong>
              <ul>${policy.exceptions.map((item) => `<li>${item}</li>`).join("")}</ul>
            </div>
            <div>
              <strong>Exclusions</strong>
              <ul>${policy.exclusions.map((item) => `<li>${item}</li>`).join("")}</ul>
            </div>
          </div>
        </article>
      `;
    })
    .join("");

  return `
    <section class="product-policy-panel">
      <div class="underwriting-header">
        <div>
          <p class="eyebrow">Product lending guidelines</p>
          <h5>Score, area, LTV, exceptions and exclusions</h5>
        </div>
        <span class="badge">${lender.programs.length} products</span>
      </div>
      <div class="product-policy-list">${cards}</div>
      <p class="contact-line">Values are placement guides for triage. Final limits depend on current lender bulletin, insurer decision, property, income, and approval conditions.</p>
    </section>
  `;
}

function getProgramPolicy(program, lender) {
  const base = programPolicyProfiles[program] || {
    minScore: "Confirm with lender",
    geography: "Ontario, subject to lender-approved property area",
    maxLtv: "Confirm by product",
    features: ["Lender-specific product with policy-dependent features"],
    exceptions: ["Manual review may be available with compensating strength"],
    exclusions: ["Unsupported income, property, credit, or compliance concerns"]
  };
  const policy = {
    ...base,
    features: [...base.features],
    exceptions: [...base.exceptions],
    exclusions: [...base.exclusions]
  };

  if (!lender) return policy;

  if (lender.type === "credit union") {
    policy.geography = `${lender.region}, subject to membership and property-location rules`;
  } else if (lender.type === "alternative") {
    policy.geography = "Marketable Ontario urban/suburban areas preferred";
    if (["Alternative A/B", "Alternative lending", "Bruised credit", "Equity-focused refinance", "Self-employed"].includes(program)) {
      policy.maxLtv = policy.maxLtv.includes("75") ? policy.maxLtv : "Often 75%-80%";
      policy.exceptions.push("Lower score may be considered where equity, story, and exit strategy are strong");
      policy.exclusions.push("No credible exit strategy or borrower benefit");
    }
  } else if (lender.region) {
    policy.geography = policy.geography.replace("Ontario", lender.region);
  }

  if (lender.id === "desjardins") {
    policy.minScore = "720+ overlay noted on sheet; confirm exceptions";
  }

  return policy;
}

function renderRentalAssignmentPanel() {
  return `
    <section class="rental-assignment-panel">
      <div class="underwriting-header">
        <div>
          <p class="eyebrow">Rental, switch and assignment policies</p>
          <h5>Income treatment, transfer rules and worksheet links</h5>
        </div>
        <span class="badge">Broker checklist</span>
      </div>
      <div class="policy-breakdown">
        <div>
          <strong>Rental income treatment</strong>
          <ul>${rentalAssignmentPolicy.rentalTreatment.map((item) => `<li>${item}</li>`).join("")}</ul>
        </div>
        <div>
          <strong>Switch / transfer</strong>
          <ul>${rentalAssignmentPolicy.switchTransfer.map((item) => `<li>${item}</li>`).join("")}</ul>
        </div>
        <div>
          <strong>Assignment policies</strong>
          <ul>${rentalAssignmentPolicy.assignment.map((item) => `<li>${item}</li>`).join("")}</ul>
        </div>
      </div>
      ${renderPolicyResourceLinks()}
    </section>
  `;
}

function renderPolicyResourceLinks() {
  return `
    <div class="policy-resource-links">
      <p class="eyebrow">Rental worksheet links</p>
      <div>
        ${policyResourceLinks
          .map(
            (resource) => `
              <a href="${resource.href}" target="_blank" rel="noreferrer">
                <strong>${resource.label}</strong>
                <span>${resource.description}</span>
              </a>
            `
          )
          .join("")}
      </div>
    </div>
  `;
}

function renderUnderwritingSection(lender) {
  const guidelines = underwritingGuidelines[lender.id] || defaultUnderwritingGuidelines(lender);
  const rows = [
    ["Credit", guidelines.credit],
    ["Income", guidelines.income],
    ["Property", guidelines.property],
    ["LTV / product", guidelines.ltv],
    ["Documents", guidelines.documents],
    ["Watch points", guidelines.watch]
  ];

  return `
    <section class="underwriting-panel">
      <div class="underwriting-header">
        <div>
          <p class="eyebrow">Underwriting guidelines</p>
          <h5>${lender.name} placement notes</h5>
        </div>
        <span class="badge">${titleCase(lender.type)}</span>
      </div>
      <div class="underwriting-grid">
        ${rows
          .map(
            ([label, text]) => `
              <article>
                <strong>${label}</strong>
                <p>${text}</p>
              </article>
            `
          )
          .join("")}
      </div>
      <p class="contact-line">Broker guide only. Confirm the current lender policy, insurer overlays, and commitment conditions before advising or submitting.</p>
    </section>
  `;
}

function defaultUnderwritingGuidelines(lender) {
  const typeNotes = {
    bank: {
      credit: "Prime credit profile preferred; confirm minimum score, tradeline depth, and debt-service limits.",
      income: "Standard employment, pension, and documented self-employed income are the strongest fit.",
      property: "Standard residential mortgage files subject to bank channel, property, and appraisal policy.",
      ltv: "Confirm insured, conventional, refinance, rental, 30-year, and HELOC limits directly with the lender.",
      documents: "Income package, source of funds, property documents, appraisal if required, and payout statement where applicable.",
      watch: "Confirm rate hold, registration type, channel availability, compensation, and lender-specific conditions."
    },
    monoline: {
      credit: "Prime credit profile generally preferred; confirm insured and insurable score overlays.",
      income: "Clean salaried, hourly, pension, and full-document self-employed files are the best fit.",
      property: "Owner-occupied, rental, switch, and refinance files may fit depending on the product.",
      ltv: "Confirm insured, insurable, uninsurable, refinance, rental, and 30-year categories before quoting.",
      documents: "Income verification, down payment trail, property details, appraisal if required, and switch documents.",
      watch: "Check no-frills restrictions, prepayment privileges, portability, rate hold, and lender condition timing."
    },
    alternative: {
      credit: "Broader credit may be considered; story, equity, repayment conduct, and exit strategy matter.",
      income: "Expanded documentation, self-employed, stated-income reasonability, or equity-focused files may fit.",
      property: "Marketable residential property is important; location, condition, and appraisal support drive placement.",
      ltv: "Confirm max LTV by credit, income, location, property type, and borrower strength.",
      documents: "Income story, appraisal, mortgage statement, property taxes, source of funds, and debt payout details.",
      watch: "Disclose lender fees, broker fees, renewal risk, suitability, and path back to prime."
    },
    "credit union": {
      credit: "Credit union underwriting with focus on credit conduct, member relationship, and overall borrower story.",
      income: "Standard employment and business-for-self files may fit with full documentation.",
      property: "Ontario property and membership/channel rules may affect availability.",
      ltv: "Confirm insured, conventional, HELOC, refinance, and appraisal requirements before quoting.",
      documents: "Income verification, membership requirements, source of funds, property details, and appraisal where required.",
      watch: "Check membership rules, branch involvement, geographic availability, funding timeline, and fees."
    }
  };

  return typeNotes[lender.type] || typeNotes.monoline;
}

function renderDealDeskSection(lender) {
  if (!lender.dealDesk) return "";

  const sectionCards = lender.dealDesk.sections
    .map(
      (section) => `
        <article class="deal-desk-card">
          <h5>${section.title}</h5>
          <div class="deal-rate-chips">
            ${section.items
              .map(
                (item) => `
                  <span class="deal-rate-chip ${!parseRateValue(item.value) ? "empty" : ""}">
                    <small>${item.label}</small>
                    <strong>${rate(parseRateValue(item.value))}</strong>
                  </span>
                `
              )
              .join("")}
          </div>
        </article>
      `
    )
    .join("");

  return `
    <section class="deal-desk-panel">
      <div class="deal-desk-header">
        <div>
          <p class="eyebrow">Deal desk rates</p>
          <h5>${lender.dealDesk.source}</h5>
        </div>
        <span class="badge">Lender update ${lender.dealDesk.sheetDate}</span>
      </div>
      <div class="deal-desk-meta">
        <span>Effective ${lender.dealDesk.effectiveDate}</span>
        <span>Benchmark ${lender.dealDesk.benchmarkRate}</span>
        <span>Prime ${lender.dealDesk.primeRate}</span>
      </div>
      <div class="deal-desk-grid">${sectionCards}</div>
      <p class="contact-line">${lender.dealDesk.note}</p>
    </section>
  `;
}

function renderPrograms() {
  const programMap = new Map();
  lenders.forEach((lender) => {
    lender.programs.forEach((program) => {
      if (!programMap.has(program)) programMap.set(program, []);
      programMap.get(program).push(lender.name);
    });
  });

  renderProgramDetail(programMap);

  programGrid.innerHTML = [...programMap.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([program, lenderNames]) => {
      const displayed = lenderNames.slice(0, 4).join(", ");
      const extra = lenderNames.length > 4 ? ` +${lenderNames.length - 4}` : "";
      return `
        <button class="program-card ${activeProgram === program ? "active" : ""}" type="button" data-program="${program}" style="--program-color: ${programColorMap[program] || "#64748B"};">
          <h4>${program}</h4>
          <p>${displayed}${extra}</p>
          ${programBadge(`${lenderNames.length} lender${lenderNames.length === 1 ? "" : "s"}`, program)}
        </button>
      `;
    })
    .join("");

  programGrid.querySelectorAll("[data-program]").forEach((button) => {
    button.addEventListener("click", () => {
      activeProgram = button.dataset.program;
      renderPrograms();
      document.querySelector("#programs").scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
}

function renderProgramDetail(programMap) {
  if (!programMap.has(activeProgram)) {
    activeProgram = programMap.keys().next().value || "";
  }

  const detail = programDetails[activeProgram] || {
    summary: "Review lender-specific criteria, documentation, compensation, and policy exceptions before placing this file.",
    minScore: "Confirm with lender",
    fit: ["Compare lender appetite", "Check documentation", "Confirm pricing"],
    watch: ["Rate hold", "Lender fees", "Policy overlays", "Submission route"]
  };
  const lenderNames = programMap.get(activeProgram) || [];
  const matchingLenders = lenders.filter((lender) => lender.programs.includes(activeProgram));
  const policy = getProgramPolicy(activeProgram);
  const lenderRows = matchingLenders.length
    ? matchingLenders
        .map(
          (lender) => `
            <button class="program-lender" type="button" data-lender="${lender.id}" style="--lender-color: ${lender.brandColor}; --lender-accent: ${lender.brandAccent};">
              <span class="lender-logo" aria-hidden="true">${initials(lender.name)}</span>
              <span><strong>${lender.name}</strong><small>${titleCase(lender.type)} · ${rate(lender.rates.insuredFixed || lender.rates.conventional || lender.rates.alt)}</small></span>
            </button>
          `
        )
        .join("")
    : `<p class="contact-line">No lenders are currently tagged to this program.</p>`;

  programDetail.innerHTML = `
    <div class="program-detail-main" style="--program-color: ${programColorMap[activeProgram] || "#64748B"};">
      <div>
        <p class="eyebrow">Program detail</p>
        <h4>${activeProgram}</h4>
        <p>${detail.summary}</p>
        <div class="credit-score-box">
          <span>Minimum credit score</span>
          <strong>${detail.minScore}</strong>
          <small>Placement guide only. Confirm current lender and insurer policy before advising clients.</small>
        </div>
        ${renderProgramPolicySummary(activeProgram, policy)}
      </div>
      <div class="program-columns">
        <div>
          <strong>Best fit</strong>
          <ul>${detail.fit.map((item) => `<li>${item}</li>`).join("")}</ul>
        </div>
        <div>
          <strong>Watch points</strong>
          <ul>${detail.watch.map((item) => `<li>${item}</li>`).join("")}</ul>
        </div>
      </div>
    </div>
    <div class="program-lender-list">
      <p class="eyebrow">Matching lenders · ${lenderNames.length}</p>
      ${lenderRows}
    </div>
  `;

  programDetail.querySelectorAll("[data-lender]").forEach((button) => {
    button.addEventListener("click", () => {
      activeLenderId = button.dataset.lender;
      activeLenderPage = getPageForLender(filteredLenders(), activeLenderId);
      render();
      document.querySelector("#lenders").scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
}

function renderProgramPolicySummary(program, policy) {
  return `
    <div class="program-policy-summary">
      <div class="policy-stat-grid">
        <span><small>Geographic area</small><strong>${policy.geography}</strong></span>
        <span><small>Maximum LTV</small><strong>${policy.maxLtv}</strong></span>
      </div>
      <div class="policy-breakdown">
        <div>
          <strong>Special features</strong>
          <ul>${policy.features.map((item) => `<li>${item}</li>`).join("")}</ul>
        </div>
        <div>
          <strong>Exceptions</strong>
          <ul>${policy.exceptions.map((item) => `<li>${item}</li>`).join("")}</ul>
        </div>
        <div>
          <strong>Exclusions</strong>
          <ul>${policy.exclusions.map((item) => `<li>${item}</li>`).join("")}</ul>
        </div>
      </div>
      ${["Rental", "Switch/transfer", "New to Canada", "Self-employed", "Conventional purchase", "Insured purchase"].includes(program) ? renderPolicyResourceLinks() : ""}
    </div>
  `;
}

function renderContacts() {
  document.querySelector("#contactTable").innerHTML = lenders
    .map(
      (lender) => `
        <tr>
          <td><strong>${lender.name}</strong><br /><span class="contact-line">${titleCase(lender.type)}</span></td>
          <td>${lender.bdm}<br /><span class="contact-line">${lender.region}</span></td>
          <td>${lender.email}</td>
          <td>${lender.phone}</td>
          <td><a class="website-link" href="${lender.website}" target="_blank" rel="noreferrer">Open</a></td>
        </tr>
      `
    )
    .join("");
}

function normalizeInsurerProgram(program) {
  if (typeof program === "string") {
    return { label: program, key: program };
  }
  return program;
}

function renderListItems(items = []) {
  return items.map((item) => `<li>${item}</li>`).join("");
}

function renderLimitChips(limits = []) {
  if (!limits.length) return "";
  return `
    <div class="insurer-limit-grid">
      ${limits.map((item) => `
        <div>
          <span>${item.label}</span>
          <strong>${item.value}</strong>
        </div>
      `).join("")}
    </div>
  `;
}

function renderResourceLinks(resources = []) {
  if (!resources.length) return "";
  return `
    <div class="policy-resource-links">
      <strong>Resource links</strong>
      <div>
        ${resources.map((item) => `
          <a href="${item.href}" target="_blank" rel="noreferrer">
            <strong>${item.label}</strong>
            <span>${item.note}</span>
          </a>
        `).join("")}
      </div>
    </div>
  `;
}

function renderInsurers() {
  const activeDetail = insurerProgramDetails[activeInsurerProgram] || insurerProgramDetails["cmhc-purchase"];
  const activeInsurer = insurers.find((item) => item.id === activeDetail.insurerId || item.name === activeDetail.insurer);
  insurerGrid.innerHTML = `
    <aside class="insurer-program-detail" style="--insurer-color: ${activeInsurer?.brandColor || "#64748B"};">
      <div>
        <div class="insurer-source-row">
          <p class="eyebrow">Insurer program detail · ${activeDetail.insurer}</p>
          <a class="website-link" href="${activeDetail.sourceUrl}" target="_blank" rel="noreferrer">Official source</a>
        </div>
        <h4>${activeDetail.title}</h4>
        <p>${activeDetail.purpose}</p>
      </div>
      ${renderLimitChips(activeDetail.limits)}
      <div class="insurer-detail-columns">
        <div>
          <strong>Eligibility focus</strong>
          <ul>${renderListItems(activeDetail.eligibility)}</ul>
        </div>
        <div>
          <strong>Typical documents</strong>
          <ul>${renderListItems(activeDetail.documents)}</ul>
        </div>
        <div>
          <strong>Exceptions / exclusions</strong>
          <ul>${renderListItems(activeDetail.exclusions)}</ul>
        </div>
        <div>
          <strong>Broker watch points</strong>
          <ul>${renderListItems(activeDetail.watch)}</ul>
        </div>
      </div>
      ${renderResourceLinks(activeDetail.resourceLinks)}
      <small>Program summaries are broker placement notes based on public insurer program pages. Confirm the current insurer guide, lender overlay, premium, and commitment conditions before advising clients.</small>
    </aside>
  `;

  insurerGrid.innerHTML += insurers
    .map(
      (insurer) => `
        <article class="insurer-card" style="--insurer-color: ${insurer.brandColor}; --insurer-accent: ${insurer.brandAccent};">
          <header>
            <div class="insurer-logo">${initials(insurer.name)}</div>
            <div>
              <p class="eyebrow">${insurer.fullName}</p>
              <h4>${insurer.name}</h4>
            </div>
            <a class="website-link" href="${insurer.website}" target="_blank" rel="noreferrer">Website</a>
          </header>

          <div class="credit-score-box insurer-score">
            <span>Minimum credit score</span>
            <strong>${insurer.minScore}</strong>
            <small>Insurer and lender overlays may differ. Confirm current policy before advising clients.</small>
          </div>

          <div>
            <p class="eyebrow">Programs</p>
            <div class="badge-row">${insurer.programs.map((program) => {
              const item = normalizeInsurerProgram(program);
              return `<span class="badge insurer-program ${activeInsurerProgram === item.key ? "active" : ""}" role="button" tabindex="0" data-insurer-program="${item.key}">${item.label}</span>`;
            }).join("")}</div>
          </div>

          <div class="insurer-columns">
            <div>
              <p class="eyebrow">Policy notes</p>
              <ul class="policy-list">${insurer.policies.map((item) => `<li>${item}</li>`).join("")}</ul>
            </div>
            <div>
              <p class="eyebrow">Watch points</p>
              <ul class="policy-list">${insurer.watch.map((item) => `<li>${item}</li>`).join("")}</ul>
            </div>
          </div>

          <footer>
            <strong>${insurer.contactName}</strong>
            <span>${insurer.phone}</span>
            <span>${insurer.email}</span>
          </footer>
        </article>
      `
    )
    .join("");
}

function renderRateSelect() {
  rateLenderSelect.innerHTML = lenders.map((lender) => `<option value="${lender.id}">${lender.name}</option>`).join("");
}

function populateRateEditor(id) {
  renderRateSelect();
  const lender = lenders.find((item) => item.id === id) || lenders[0];
  rateLenderSelect.value = lender.id;
  document.querySelector("#insuredFixedInput").value = lender.rates.insuredFixed ?? "";
  document.querySelector("#variableInput").value = lender.rates.variable ?? "";
  document.querySelector("#conventionalInput").value = lender.rates.conventional ?? "";
  document.querySelector("#altInput").value = lender.rates.alt ?? "";
  document.querySelector("#noteInput").value = lender.policyNote;
}

function titleCase(value) {
  return value.replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function ratePill(label, value, key) {
  return `
    <div class="rate-pill" style="--product-color: ${rateColorMap[key]};">
      <span>${label}</span>
      <strong>${rate(value)}</strong>
    </div>
  `;
}

function programBadge(label, colorKey = label, clickable = false) {
  const color = programColorMap[colorKey] || "#64748B";
  if (!clickable) {
    return `<span class="badge program-badge" style="--program-color: ${color};">${label}</span>`;
  }
  return `<span class="badge program-badge program-link" role="button" tabindex="0" data-program-link="${colorKey}" style="--program-color: ${color};">${label}</span>`;
}

function initials(value) {
  return value
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}

render();
initializeMortgageNews();
initializeWeather(true);
