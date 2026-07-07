/**
 * Government Scheme Finder data — structured demo schemes for the
 * Smart Bharat Scheme Finder and Eligibility Checker.
 *
 * IMPORTANT: This is PROTOTYPE / DEMO information. It is not an official
 * Government of India source. Portal names are referenced by their
 * well-known public name only; no fabricated URLs are included. Verify
 * every detail through official government portals before acting.
 */

export type SchemeCategory =
  | 'Healthcare'
  | 'Agriculture'
  | 'Education'
  | 'Housing'
  | 'Women & Children'
  | 'Senior Citizens'
  | 'Employment & Skills'
  | 'Financial Inclusion'
  | 'Social Welfare'
  | 'Business & Entrepreneurship';

export const SCHEME_CATEGORIES: SchemeCategory[] = [
  'Healthcare',
  'Agriculture',
  'Education',
  'Housing',
  'Women & Children',
  'Senior Citizens',
  'Employment & Skills',
  'Financial Inclusion',
  'Social Welfare',
  'Business & Entrepreneurship',
];

/** Profile conditions a citizen can select in the questionnaire. */
export type ProfileCondition =
  | 'woman'
  | 'student'
  | 'farmer'
  | 'senior_citizen'
  | 'person_with_disability'
  | 'has_girl_child'
  | 'needs_housing'
  | 'needs_skill_training'
  | 'needs_small_business_support'
  | 'none';

export type Occupation =
  | 'student'
  | 'farmer'
  | 'salaried_employee'
  | 'self_employed'
  | 'unemployed'
  | 'homemaker'
  | 'senior_citizen'
  | 'other';

export type AgeGroup = 'under_18' | '18_35' | '36_60' | 'above_60';
export type ResidenceArea = 'rural' | 'urban';

export type IncomeRange =
  | 'below_1l'
  | '1l_3l'
  | '3l_6l'
  | '6l_10l'
  | 'above_10l';

export interface CitizenProfile {
  ageGroup: AgeGroup | null;
  state: string;
  area: ResidenceArea | null;
  occupation: Occupation | null;
  income: IncomeRange | null;
  conditions: ProfileCondition[];
}

export interface SchemeEligibilityRule {
  /** Age groups that fit this scheme, or undefined for any age */
  ageGroups?: AgeGroup[];
  /** Residence areas that fit, or undefined for any */
  areas?: ResidenceArea[];
  /** Occupations that fit, or undefined for any */
  occupations?: Occupation[];
  /** Income ranges that fit, or undefined for any */
  incomeRanges?: IncomeRange[];
  /** Profile conditions that strengthen the match */
  matchingConditions?: ProfileCondition[];
  /** Conditions that would disqualify or weaken the match */
  disqualifyingConditions?: ProfileCondition[];
}

export interface Scheme {
  id: string;
  name: string;
  shortDescription: string;
  category: SchemeCategory;
  targetBeneficiaries: string;
  benefits: string;
  eligibilityCriteria: string[];
  requiredDocuments: string[];
  applicationSteps: string[];
  officialPortal: string;
  ministry: string;
  searchKeywords: string[];
  /** Rule used by the eligibility engine to score a citizen profile */
  eligibilityRule: SchemeEligibilityRule;
}

export const schemes: Scheme[] = [
  // ── Healthcare ──
  {
    id: 'pmjay',
    name: 'Ayushman Bharat (PM-JAY)',
    shortDescription: 'Health assurance providing up to ₹5 lakh cover per family per year.',
    category: 'Healthcare',
    targetBeneficiaries: 'Economically vulnerable families',
    benefits: 'Cashless treatment up to ₹5 lakh per family per year at empanelled hospitals.',
    eligibilityCriteria: [
      'Families listed in the SECC 2011 database',
      'Includes rural and urban deprived households',
      'Eligibility is database-driven, not income-based application',
    ],
    requiredDocuments: ['Aadhaar card', 'Mobile number linked to Aadhaar', 'Ration card (optional)'],
    applicationSteps: [
      'Check eligibility on the official PM-JAY portal using your mobile number',
      'Visit an empanelled hospital or Ayushman Mitra helpdesk',
      'Verify identity with Aadhaar / fingerprint',
      'Receive the Ayushman Golden Card',
    ],
    officialPortal: 'PM-JAY official portal (pmjay.gov.in)',
    ministry: 'Ministry of Health & Family Welfare',
    searchKeywords: ['ayushman', 'pm-jay', 'pmjay', 'health insurance', 'health cover', 'health card', 'golden card', 'healthcare', 'health'],
    eligibilityRule: {
      incomeRanges: ['below_1l', '1l_3l', '3l_6l'],
      matchingConditions: ['woman', 'senior_citizen', 'person_with_disability'],
    },
  },
  {
    id: 'ujjwala',
    name: 'Pradhan Mantri Ujjwala Yojana (PMUY)',
    shortDescription: 'Free LPG connections for women from BPL households.',
    category: 'Women & Children',
    targetBeneficiaries: 'Women from below-poverty-line households',
    benefits: 'Free LPG connection with the first refill and stove; subsidy support.',
    eligibilityCriteria: [
      'Adult woman from a BPL household',
      'Should not already have an LPG connection in the household',
      'Aadhaar and bank account required',
    ],
    requiredDocuments: ['Aadhaar card', 'BPL ration card', 'Bank account details', 'Passport-size photograph'],
    applicationSteps: [
      'Apply at an LPG distributor or via the official Ujjwala portal',
      'Submit Aadhaar, BPL ration card, and bank details',
      'Receive the free LPG connection and first refill',
    ],
    officialPortal: 'PMUY official portal (pmuy.gov.in)',
    ministry: 'Ministry of Petroleum & Natural Gas',
    searchKeywords: ['ujjwala', 'pmuy', 'lpg', 'cooking gas', 'free gas', 'woman', 'bpl'],
    eligibilityRule: {
      incomeRanges: ['below_1l', '1l_3l'],
      matchingConditions: ['woman', 'needs_housing'],
      disqualifyingConditions: ['none'],
    },
  },

  // ── Agriculture ──
  {
    id: 'pm-kisan',
    name: 'PM-KISAN Samman Nidhi',
    shortDescription: 'Income support of ₹6,000/year for small and marginal farmer families.',
    category: 'Agriculture',
    targetBeneficiaries: 'Small and marginal farmer families',
    benefits: '₹6,000 per year in three installments, directly to bank account.',
    eligibilityCriteria: [
      'Small and marginal farmer families (landholding up to 2 hectares)',
      'Land must be in the family name per state land records',
      'Excluded: institutional farmers, income-tax payers, government employees',
    ],
    requiredDocuments: ['Aadhaar card', 'Land ownership records (patta/khata)', 'Bank account details', 'Mobile number'],
    applicationSteps: [
      'Visit the official PM-KISAN portal',
      'Click "New Farmer Registration" and enter Aadhaar and mobile',
      'Fill in land and bank details',
      'Submit for verification by the local revenue official',
      'Installments are credited directly to your bank account',
    ],
    officialPortal: 'PM-KISAN official portal (pmkisan.gov.in)',
    ministry: 'Ministry of Agriculture & Farmers Welfare',
    searchKeywords: ['pm-kisan', 'pmkisan', 'kisan', 'farmer', 'agriculture', 'samman nidhi', 'income support'],
    eligibilityRule: {
      occupations: ['farmer'],
      matchingConditions: ['farmer'],
      disqualifyingConditions: ['none'],
    },
  },

  // ── Education ──
  {
    id: 'nsp-scholarship',
    name: 'National Scholarship Portal (NSP) Scholarships',
    shortDescription: 'Central & state scholarships for students from school to postgraduate level.',
    category: 'Education',
    targetBeneficiaries: 'Students from SC/ST/OBC/Minority/EWS and other eligible categories',
    benefits: 'Variable scholarship amounts for education from pre-matric to post-matric levels.',
    eligibilityCriteria: [
      'Student studying in a recognised institution',
      'Family income within the scheme-specific limit (often ₹1–8 lakh)',
      'Category-specific criteria (SC/ST/OBC/Minority/EWS)',
    ],
    requiredDocuments: ['Aadhaar card', 'Income certificate', 'Caste/category certificate (if applicable)', 'Previous marksheet / bonafide certificate', 'Bank account details'],
    applicationSteps: [
      'Register on the National Scholarship Portal',
      'Fill the scholarship application form',
      'Upload documents and income/category proof',
      'Submit for institution verification',
      'Track status on the portal',
    ],
    officialPortal: 'National Scholarship Portal (scholarships.gov.in)',
    ministry: 'Ministry of Education',
    searchKeywords: ['scholarship', 'nsp', 'national scholarship', 'education', 'student', 'studies', 'school', 'college'],
    eligibilityRule: {
      ageGroups: ['under_18', '18_35'],
      occupations: ['student', 'unemployed'],
      incomeRanges: ['below_1l', '1l_3l', '3l_6l', '6l_10l'],
      matchingConditions: ['student', 'woman', 'person_with_disability'],
    },
  },

  // ── Housing ──
  {
    id: 'pmay',
    name: 'Pradhan Mantri Awas Yojana (PMAY)',
    shortDescription: 'Affordable housing with interest subsidy on home loans.',
    category: 'Housing',
    targetBeneficiaries: 'EWS / LIG / MIG households without a pucca house',
    benefits: 'Interest subsidy on home loans, reducing the effective EMI burden.',
    eligibilityCriteria: [
      'EWS / LIG / MIG households without a pucca house',
      'Annual income limits vary by category (EWS up to ₹3 lakh, LIG up to ₹6 lakh)',
      'No prior central housing assistance availed',
    ],
    requiredDocuments: ['Aadhaar card', 'Income certificate', 'Bank statement', 'Property / land documents', 'Caste certificate (if applicable)'],
    applicationSteps: [
      'Check eligibility on the official PMAY portal',
      'Apply online with required documents',
      'Get a unique application ID',
      'Loan is processed through partner banks with subsidy',
      'Subsidy is credited upfront to reduce the loan principal',
    ],
    officialPortal: 'PMAY official portal (pmaymis.gov.in)',
    ministry: 'Ministry of Housing & Urban Affairs',
    searchKeywords: ['pmay', 'awas', 'housing', 'house', 'home loan', 'housing scheme', 'pradhan mantri awas'],
    eligibilityRule: {
      incomeRanges: ['below_1l', '1l_3l', '3l_6l', '6l_10l'],
      matchingConditions: ['needs_housing', 'woman', 'senior_citizen'],
    },
  },

  // ── Women & Children ──
  {
    id: 'sukanya',
    name: 'Sukanya Samriddhi Yojana',
    shortDescription: 'Savings scheme for the girl child with high interest and tax-free maturity.',
    category: 'Women & Children',
    targetBeneficiaries: 'Girl children under 10 years',
    benefits: 'High-interest small savings; tax-free maturity; 21-year tenure.',
    eligibilityCriteria: [
      'Girl child must be under 10 years of age',
      'Account opened by the natural / legal guardian',
      'One account per girl child (max two girls per family, with exceptions)',
    ],
    requiredDocuments: ['Girl child birth certificate', 'Guardian Aadhaar / ID', 'Address proof', 'Passport-size photograph'],
    applicationSteps: [
      'Visit a post office or authorised bank branch',
      'Fill the Sukanya Samriddhi account opening form',
      'Submit the girl child birth certificate and guardian KYC',
      'Deposit the initial amount (minimum ₹250)',
      'Continue yearly deposits until 15 years; matures at 21 years',
    ],
    officialPortal: 'India Post / authorised public-sector banks',
    ministry: 'Ministry of Finance',
    searchKeywords: ['sukanya', 'samriddhi', 'girl child', 'daughter', 'savings', 'ssy', 'woman', 'children'],
    eligibilityRule: {
      matchingConditions: ['has_girl_child', 'woman'],
      disqualifyingConditions: ['none'],
    },
  },
  {
    id: 'matritva',
    name: 'Pradhan Mantri Matru Vandana Yojana (PMMVY)',
    shortDescription: 'Cash benefits for pregnant and lactating mothers.',
    category: 'Women & Children',
    targetBeneficiaries: 'Pregnant and lactating women',
    benefits: 'Cash incentive of ₹5,000 in three installments for the first living child.',
    eligibilityCriteria: [
      'Pregnant and lactating women',
      'First living child of the beneficiary',
      'Aadhaar and bank account required',
    ],
    requiredDocuments: ['Aadhaar card', 'MCP card (Mother & Child Protection)', 'Bank account details', 'Child birth certificate (for later installments)'],
    applicationSteps: [
      'Register at the nearest Anganwadi centre or health facility',
      'Submit Aadhaar, MCP card, and bank details',
      'Receive first installment after registration',
      'Subsequent installments after childbirth and vaccination milestones',
    ],
    officialPortal: 'PMMVY official portal (wcd.nic.in)',
    ministry: 'Ministry of Women & Child Development',
    searchKeywords: ['matru', 'matritva', 'pmmvy', 'pregnant', 'lactating', 'mother', 'maternity', 'woman'],
    eligibilityRule: {
      matchingConditions: ['woman'],
      disqualifyingConditions: ['none'],
    },
  },

  // ── Senior Citizens ──
  {
    id: 'apy',
    name: 'Atal Pension Yojana (APY)',
    shortDescription: 'Guaranteed monthly pension after age 60 for unorganised-sector workers.',
    category: 'Senior Citizens',
    targetBeneficiaries: 'Workers in the unorganised sector aged 18–40',
    benefits: 'Guaranteed pension of ₹1,000–₹5,000/month starting at age 60.',
    eligibilityCriteria: [
      'Indian citizen aged 18–40 years',
      'Must have a savings bank account',
      'Auto-debit of contribution enabled',
    ],
    requiredDocuments: ['Aadhaar card', 'Savings bank account', 'Mobile number'],
    applicationSteps: [
      'Visit your bank branch or use net banking',
      'Fill the APY registration form',
      'Choose the pension amount and contribution tier',
      'Auto-debit of contributions begins monthly',
    ],
    officialPortal: 'Bank branches / net banking (managed by PFRDA)',
    ministry: 'Ministry of Finance (PFRDA)',
    searchKeywords: ['atal pension', 'apy', 'pension', 'senior', 'retirement', 'old age', 'unorganised'],
    eligibilityRule: {
      ageGroups: ['18_35', '36_60'],
      occupations: ['unemployed', 'self_employed', 'homemaker', 'salaried_employee', 'other'],
      matchingConditions: ['senior_citizen', 'needs_housing'],
    },
  },
  {
    id: 'igdps',
    name: 'Indira Gandhi National Old Age Pension Scheme (IGNOAPS)',
    shortDescription: 'Monthly pension for BPL seniors aged 60 and above.',
    category: 'Senior Citizens',
    targetBeneficiaries: 'BPL persons aged 60 years and above',
    benefits: 'Monthly pension (₹200 central share, plus state share varies).',
    eligibilityCriteria: [
      'Age 60 years or above',
      'Belongs to a BPL household',
      'Must be on the BPL list maintained by the state',
    ],
    requiredDocuments: ['Aadhaar card', 'Age proof', 'BPL certificate / ration card', 'Bank account details'],
    applicationSteps: [
      'Apply at the local block / municipal office',
      'Submit age proof and BPL documentation',
      'Verification by the revenue / social welfare officer',
      'Pension credited to bank account monthly',
    ],
    officialPortal: 'State Social Welfare Departments / NSAP portal',
    ministry: 'Ministry of Rural Development',
    searchKeywords: ['old age pension', 'ignoaps', 'nsap', 'senior citizen', 'pension', 'bpl', 'elderly'],
    eligibilityRule: {
      ageGroups: ['above_60'],
      incomeRanges: ['below_1l', '1l_3l'],
      occupations: ['senior_citizen', 'unemployed', 'homemaker', 'other'],
      matchingConditions: ['senior_citizen'],
    },
  },

  // ── Employment & Skills ──
  {
    id: 'pmkvy',
    name: 'PMKVY / Skill India',
    shortDescription: 'Free short-term skill training and certification for youth.',
    category: 'Employment & Skills',
    targetBeneficiaries: 'Youth aged 15–45 seeking job-ready skills',
    benefits: 'Free short-term training, certification, and placement assistance.',
    eligibilityCriteria: [
      'Youth aged 15–45 years',
      'Indian national with valid ID',
      'No prior formal certification for the chosen job role',
    ],
    requiredDocuments: ['Aadhaar card', 'Educational qualification proof', 'Bank account details', 'Passport-size photograph'],
    applicationSteps: [
      'Find a PMKVY training centre on the official portal',
      'Register with Aadhaar and select a job role',
      'Attend the short-term training programme',
      'Appear for the assessment',
      'Receive a Skill Certificate on passing',
    ],
    officialPortal: 'PMKVY official portal (pmkvyofficial.org.in)',
    ministry: 'Ministry of Skill Development & Entrepreneurship',
    searchKeywords: ['skill', 'pmkvy', 'pmkv', 'training', 'skill india', 'vocational', 'job training', 'employment'],
    eligibilityRule: {
      ageGroups: ['18_35', '36_60'],
      occupations: ['unemployed', 'student', 'self_employed'],
      incomeRanges: ['below_1l', '1l_3l', '3l_6l'],
      matchingConditions: ['student', 'needs_skill_training', 'person_with_disability'],
    },
  },

  // ── Financial Inclusion ──
  {
    id: 'jan-dhan',
    name: 'Pradhan Mantri Jan Dhan Yojana (PMJDY)',
    shortDescription: 'Zero-balance bank account with RuPay card and accident cover.',
    category: 'Financial Inclusion',
    targetBeneficiaries: 'Unbanked individuals across India',
    benefits: 'Zero-balance account, RuPay debit card, accident insurance, and overdraft facility.',
    eligibilityCriteria: [
      'Any Indian citizen aged 10 years and above',
      'No existing valid bank account (for certain benefits)',
      'Aadhaar / KYC documents required',
    ],
    requiredDocuments: ['Aadhaar card', 'One photograph', 'Nominee details'],
    applicationSteps: [
      'Visit a bank branch or Bank Mitra outlet',
      'Fill the PMJDY account opening form',
      'Submit Aadhaar / KYC documents',
      'Receive the passbook and RuPay debit card',
    ],
    officialPortal: 'All scheduled commercial banks / Bank Mitra outlets',
    ministry: 'Ministry of Finance (Department of Financial Services)',
    searchKeywords: ['jan dhan', 'pmjdy', 'bank account', 'zero balance', 'financial inclusion', 'rupay', 'banking'],
    eligibilityRule: {
      incomeRanges: ['below_1l', '1l_3l', '3l_6l', '6l_10l'],
      matchingConditions: ['woman', 'farmer', 'needs_small_business_support', 'person_with_disability'],
    },
  },

  // ── Social Welfare ──
  {
    id: 'nfsa',
    name: 'National Food Security Act (NFSA) / PDS',
    shortDescription: 'Subsidised foodgrains through the Public Distribution System.',
    category: 'Social Welfare',
    targetBeneficiaries: 'Eligible households under Antyodaya & Priority categories',
    benefits: 'Subsidised rice at ₹3/kg, wheat at ₹2/kg, and coarse grains at ₹1/kg.',
    eligibilityCriteria: [
      'Households listed in the state priority / Antyodaya list',
      'Income and category criteria set by the state government',
      'Ration card mandatory',
    ],
    requiredDocuments: ['Aadhaar card', 'Ration card', 'Address proof', 'Income certificate (for new applicants)'],
    applicationSteps: [
      'Apply for a ration card at the local food / civil supplies office',
      'Submit Aadhaar and address proof for all members',
      'Verification by the food supply officer',
      'Collect the ration card and use at Fair Price Shops',
    ],
    officialPortal: 'State Food & Civil Supplies Departments',
    ministry: 'Ministry of Consumer Affairs, Food & Public Distribution',
    searchKeywords: ['nfsa', 'pds', 'ration', 'food security', 'subsidised food', 'bpl', 'antyodaya'],
    eligibilityRule: {
      incomeRanges: ['below_1l', '1l_3l'],
      matchingConditions: ['woman', 'senior_citizen', 'person_with_disability'],
    },
  },

  // ── Business & Entrepreneurship ──
  {
    id: 'mudra',
    name: 'Pradhan Mantri Mudra Yojana (PMMY)',
    shortDescription: 'Collateral-free business loans up to ₹10 lakh for small entrepreneurs.',
    category: 'Business & Entrepreneurship',
    targetBeneficiaries: 'Small business owners and non-corporate entrepreneurs',
    benefits: 'Loans up to ₹10 lakh (Shishu / Kishore / Tarun) without collateral.',
    eligibilityCriteria: [
      'Small business owners and entrepreneurs',
      'Loan up to ₹10 lakh across three categories',
      'No collateral required for loans up to ₹10 lakh',
    ],
    requiredDocuments: ['Aadhaar card', 'PAN card', 'Business plan / details', 'Bank statement (last 6 months)', 'Address proof'],
    applicationSteps: [
      'Approach a participating bank, NBFC, or MFI',
      'Fill the Mudra loan application form',
      'Submit KYC and business documents',
      'Bank assesses and sanctions the loan',
      'Receive a Mudra Card for business expenses',
    ],
    officialPortal: 'MUDRA official portal (mudra.org.in)',
    ministry: 'Ministry of Finance',
    searchKeywords: ['mudra', 'pmm', 'business loan', 'loan', 'entrepreneur', 'startup', 'small business', 'collateral free'],
    eligibilityRule: {
      occupations: ['self_employed', 'unemployed'],
      incomeRanges: ['1l_3l', '3l_6l', '6l_10l', 'above_10l'],
      matchingConditions: ['needs_small_business_support', 'woman'],
    },
  },
  {
    id: 'stand-up-india',
    name: 'Stand-Up India',
    shortDescription: 'Bank loans between ₹10 lakh and ₹1 crore for SC/ST and women entrepreneurs.',
    category: 'Business & Entrepreneurship',
    targetBeneficiaries: 'SC/ST and women entrepreneurs setting up greenfield enterprises',
    benefits: 'Bank loans ₹10 lakh–₹1 crore with low interest and refinancing support.',
    eligibilityCriteria: [
      'SC/ST or woman entrepreneur',
      'Setting up a greenfield (first-time) enterprise',
      'In manufacturing, services, or trading sector',
    ],
    requiredDocuments: ['Aadhaar card', 'PAN card', 'Business project report', 'Bank statement', 'Caste certificate (for SC/ST applicants)'],
    applicationSteps: [
      'Apply through the Stand-Up India portal or a bank branch',
      'Submit business plan and KYC documents',
      'Bank conducts appraisal and sanction',
      'Receive the loan with refinancing support',
    ],
    officialPortal: 'Stand-Up India official portal (standupmitra.in)',
    ministry: 'Ministry of Finance (Department of Financial Services)',
    searchKeywords: ['stand up india', 'standup', 'sc st', 'woman entrepreneur', 'business loan', 'startup', 'enterprise'],
    eligibilityRule: {
      occupations: ['self_employed', 'unemployed'],
      incomeRanges: ['3l_6l', '6l_10l', 'above_10l'],
      matchingConditions: ['woman', 'needs_small_business_support'],
    },
  },

  // ── Additional Healthcare / Social Welfare ──
  {
    id: 'pmjay-sehat',
    name: 'PM-JAY SEHAT (Jammu & Kashmir extension)',
    shortDescription: 'Universal health cover extension for residents of J&K.',
    category: 'Healthcare',
    targetBeneficiaries: 'All residents of Jammu & Kashmir not already covered by PM-JAY',
    benefits: 'Up to ₹5 lakh health cover per family per year, on PM-JAY lines.',
    eligibilityCriteria: [
      'Resident of Jammu & Kashmir',
      'Not already covered under PM-JAY',
      'Universal coverage for the state',
    ],
    requiredDocuments: ['Aadhaar card', 'J&K domicile / residence proof', 'Mobile number'],
    applicationSteps: [
      'Visit the SEHAT portal or empanelled hospital',
      'Register with Aadhaar and residence proof',
      'Receive the SEHAT / Golden Card',
      'Use at empanelled hospitals for cashless treatment',
    ],
    officialPortal: 'J&K SEHAT scheme portal',
    ministry: 'Ministry of Health & Family Welfare (J&K extension)',
    searchKeywords: ['sehat', 'jammu kashmir', 'jk', 'health cover', 'health insurance', 'healthcare'],
    eligibilityRule: {
      incomeRanges: ['below_1l', '1l_3l', '3l_6l', '6l_10l', 'above_10l'],
      matchingConditions: ['woman', 'senior_citizen', 'person_with_disability'],
    },
  },
];

export const schemeById = (id: string) => schemes.find((s) => s.id === id);

export const ELIGIBILITY_DISCLAIMER =
  'These recommendations are AI-assisted prototype guidance and do not represent an official eligibility decision. Verify eligibility through official government portals.';
