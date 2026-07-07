/**
 * Civic Knowledge Base — structured mock data for Bharat AI.
 *
 * IMPORTANT: This is PROTOTYPE / DEMO information for the Smart Bharat
 * competition prototype. It is not an official Government of India source.
 * All portal names are referenced by their well-known public name only;
 * no fabricated URLs are included. Verify every detail through official
 * government portals before acting.
 */

export type KnowledgeCategory =
  | 'scheme'
  | 'service'
  | 'document'
  | 'eligibility'
  | 'issue';

export interface KnowledgeEntry {
  id: string;
  category: KnowledgeCategory;
  /** Display name, e.g. "Ayushman Bharat (PM-JAY)" */
  name: string;
  /** Short one-line summary */
  summary: string;
  /** Lowercased keywords used by the intent engine for matching */
  keywords: string[];
  /** Eligibility overview (for schemes / some services) */
  eligibility?: string[];
  /** Required documents */
  documents?: string[];
  /** Step-by-step application process */
  steps?: string[];
  /** Well-known official portal name (no fabricated URLs) */
  portal?: string;
  /** Ministry / authority */
  authority?: string;
  /** Related entry ids — used for follow-up recommendations */
  related?: string[];
}

export const knowledgeBase: KnowledgeEntry[] = [
  // ───────── Schemes ─────────
  {
    id: 'pmjay',
    category: 'scheme',
    name: 'Ayushman Bharat (PM-JAY)',
    summary: 'Health assurance scheme providing up to ₹5 lakh cover per family per year.',
    keywords: ['ayushman', 'pm-jay', 'pmjay', 'health insurance', 'health cover', 'health card', 'golden card', 'health scheme'],
    eligibility: [
      'Families listed in the SECC 2011 database',
      'Eligible categories include rural and urban deprived households',
      'No income-based application — eligibility is database-driven',
    ],
    documents: ['Aadhaar card', 'Mobile number linked to Aadhaar', 'Ration card (optional, for verification)'],
    steps: [
      'Check eligibility on the official PM-JAY portal using your mobile number',
      'Visit an empanelled hospital or Ayushman Mitra helpdesk',
      'Verify your identity with Aadhaar / fingerprint',
      'Receive the Ayushman Golden Card',
      'Use the card at any empanelled hospital for cashless treatment',
    ],
    portal: 'PM-JAY official portal (pmjay.gov.in)',
    authority: 'Ministry of Health & Family Welfare',
    related: ['pm-kisan', 'pmay'],
  },
  {
    id: 'pm-kisan',
    category: 'scheme',
    name: 'PM-KISAN Samman Nidhi',
    summary: 'Income support of ₹6,000/year for small and marginal farmer families.',
    keywords: ['pm-kisan', 'pmkisan', 'kisan', 'farmer', 'agriculture', 'samman nidhi', 'farmer scheme'],
    eligibility: [
      'Small and marginal farmer families (landholding up to 2 hectares)',
      'Land must be in the family name as per state land records',
      'Excluded: institutional farmers, income-tax payers, government employees',
    ],
    documents: ['Aadhaar card', 'Land ownership records (patta/khata)', 'Bank account details', 'Mobile number'],
    steps: [
      'Visit the official PM-KISAN portal',
      'Click "New Farmer Registration" and enter Aadhaar and mobile',
      'Fill in land and bank details',
      'Submit for verification by the local revenue official',
      'Installments are credited directly to your bank account',
    ],
    portal: 'PM-KISAN official portal (pmkisan.gov.in)',
    authority: 'Ministry of Agriculture & Farmers Welfare',
    related: ['pmay', 'pmjay'],
  },
  {
    id: 'pmay',
    category: 'scheme',
    name: 'Pradhan Mantri Awas Yojana (PMAY)',
    summary: 'Affordable housing with interest subsidy on home loans.',
    keywords: ['pmay', 'awas', 'housing', 'house', 'home loan', 'housing scheme', 'pradhan mantri awas'],
    eligibility: [
      'EWS / LIG / MIG households without a pucca house',
      'Annual income limits vary by category (EWS up to ₹3 lakh, LIG up to ₹6 lakh)',
      'No prior central housing assistance availed',
    ],
    documents: ['Aadhaar card', 'Income certificate', 'Bank statement', 'Property / land documents', 'Caste certificate (if applicable)'],
    steps: [
      'Check eligibility on the official PMAY portal',
      'Apply online with required documents',
      'Get a unique application ID',
      'Loan is processed through partner banks with subsidy',
      'Subsidy is credited upfront to reduce the loan principal',
    ],
    portal: 'PMAY official portal (pmaymis.gov.in)',
    authority: 'Ministry of Housing & Urban Affairs',
    related: ['pm-kisan', 'sukanya'],
  },
  {
    id: 'sukanya',
    category: 'scheme',
    name: 'Sukanya Samriddhi Yojana',
    summary: 'Savings scheme for the girl child with high interest and tax-free maturity.',
    keywords: ['sukanya', 'samriddhi', 'girl child', 'daughter', 'savings', 'ssy'],
    eligibility: [
      'Girl child must be under 10 years of age',
      'Account can be opened by the natural / legal guardian',
      'One account per girl child (max two girls per family, with exceptions)',
    ],
    documents: ['Girl child birth certificate', 'Guardian Aadhaar / ID', 'Address proof', 'Passport-size photograph'],
    steps: [
      'Visit a post office or authorised bank branch',
      'Fill the Sukanya Samriddhi account opening form',
      'Submit the girl child birth certificate and guardian KYC',
      'Deposit the initial amount (minimum ₹250)',
      'Continue yearly deposits until 15 years; matures at 21 years',
    ],
    portal: 'India Post / authorised public-sector banks',
    authority: 'Ministry of Finance',
    related: ['pmay', 'pm-kisan'],
  },
  {
    id: 'mudra',
    category: 'scheme',
    name: 'Pradhan Mantri Mudra Yojana (PMMY)',
    summary: 'Collateral-free business loans up to ₹10 lakh for small entrepreneurs.',
    keywords: ['mudra', 'pmm', 'business loan', 'loan', 'entrepreneur', 'startup', 'small business'],
    eligibility: [
      'Small business owners and entrepreneurs',
      'Loan up to ₹10 lakh (Shishu / Kishore / Tarun categories)',
      'No collateral required for loans up to ₹10 lakh',
    ],
    documents: ['Aadhaar card', 'PAN card', 'Business plan / details', 'Bank statement (last 6 months)', 'Address proof'],
    steps: [
      'Approach a participating bank, NBFC, or MFI',
      'Fill the Mudra loan application form',
      'Submit KYC and business documents',
      'Bank assesses and sanctions the loan',
      'Receive a Mudra Card (like a debit card) for business expenses',
    ],
    portal: 'MUDRA official portal (mudra.org.in)',
    authority: 'Ministry of Finance',
    related: ['pm-kisan', 'skill-india'],
  },
  {
    id: 'skill-india',
    category: 'scheme',
    name: 'Skill India (PMKVY)',
    summary: 'Free short-term skill training and certification for youth.',
    keywords: ['skill', 'pmkvy', 'pmkv', 'training', 'skill india', 'vocational', 'job training'],
    eligibility: [
      'Youth aged 15–45 years',
      'Indian national with valid ID',
      'No prior formal certification for the chosen job role',
    ],
    documents: ['Aadhaar card', 'Educational qualification proof', 'Bank account details', 'Passport-size photograph'],
    steps: [
      'Find a PMKVY training centre on the official portal',
      'Register with Aadhaar and select a job role',
      'Attend the short-term training programme',
      'Appear for the assessment',
      'Receive a Skill Certificate on passing',
    ],
    portal: 'PMKVY official portal (pmkvyofficial.org.in)',
    authority: 'Ministry of Skill Development & Entrepreneurship',
    related: ['mudra'],
  },

  // ───────── Services ─────────
  {
    id: 'birth-certificate',
    category: 'service',
    name: 'Birth Certificate',
    summary: 'Official record of birth issued by the municipal corporation.',
    keywords: ['birth certificate', 'birth', 'newborn', 'birth registration', 'child birth'],
    eligibility: [
      'Birth must be registered within 21 days (late registration possible with penalty)',
      'Applicable to births occurring within the municipal jurisdiction',
    ],
    documents: ['Hospital discharge / birth proof', 'Parents Aadhaar cards', 'Parents marriage certificate (optional)', 'Address proof'],
    steps: [
      'Visit your municipal corporation online portal',
      'Fill the birth registration form',
      'Upload proof of birth and parents ID',
      'Pay the applicable fee (typically ₹20–₹50)',
      'Download the digital birth certificate',
    ],
    portal: 'Local Municipal Corporation portal',
    authority: 'Municipal Corporation / Urban Local Body',
    related: ['death-certificate', 'income-certificate'],
  },
  {
    id: 'passport',
    category: 'service',
    name: 'Passport Services',
    summary: 'Issue and renewal of Indian passports with police verification.',
    keywords: ['passport', 'travel', 'international travel', 'passport renewal', 'passport apply', 'ecnr', 'psk'],
    eligibility: [
      'Indian citizen with valid ID and address proof',
      'Fresh, re-issue, and renewal categories available',
    ],
    documents: ['Aadhaar card', 'PAN card', 'Birth certificate / proof of date of birth', 'Address proof', 'Old passport (for renewal)'],
    steps: [
      'Register on the official Passport Seva portal',
      'Fill the application form and pay the fee',
      'Book an appointment at a Passport Seva Kendra (PSK)',
      'Visit PSK with original documents for verification',
      'Police verification is initiated; passport is dispatched after clearance',
    ],
    portal: 'Passport Seva official portal (passportindia.gov.in)',
    authority: 'Ministry of External Affairs',
    related: ['voter-id', 'pan-card'],
  },
  {
    id: 'driving-licence',
    category: 'service',
    name: 'Driving Licence',
    summary: 'Learner and permanent driving licence issued by the RTO.',
    keywords: ['driving licence', 'driving license', 'dl', 'rto', 'learner licence', 'driving'],
    eligibility: [
      'Learner licence: minimum 18 years (16 for 50cc gearless vehicles)',
      'Permanent licence: held learner licence for at least 30 days',
    ],
    documents: ['Aadhaar card', 'Age proof (birth certificate / 10th marksheet)', 'Address proof', 'Passport-size photographs', 'Medical fitness certificate (for 40+)'],
    steps: [
      'Apply for a learner licence on the Parivahan portal',
      'Pass the learner licence theory test',
      'Wait at least 30 days',
      'Book a slot for the permanent licence driving test',
      'Pass the driving test and receive your permanent licence',
    ],
    portal: 'Parivahan Sewa official portal (parivahan.gov.in)',
    authority: 'Ministry of Road Transport & Highways',
    related: ['voter-id', 'passport'],
  },
  {
    id: 'voter-id',
    category: 'service',
    name: 'Voter ID (EPIC) Services',
    summary: 'Voter registration, corrections, and e-EPIC download.',
    keywords: ['voter', 'voter id', 'epic', 'election', 'vote', 'voter card', 'e-epic'],
    eligibility: [
      'Indian citizen aged 18 years or above as on 1st January of the qualifying year',
      'Ordinary resident of the constituency',
    ],
    documents: ['Aadhaar card', 'Address proof', 'Age proof / birth certificate', 'Passport-size photograph'],
    steps: [
      'Register on the Voters Service Portal or use the Voter Helpline app',
      'Fill Form 6 (new voter) online',
      'Upload documents and photograph',
      'BLO (Booth Level Officer) verifies your residence',
      'Download the e-EPIC or receive the physical Voter ID card',
    ],
    portal: 'Voters Service Portal (voters.eci.gov.in)',
    authority: 'Election Commission of India',
    related: ['pan-card', 'passport'],
  },
  {
    id: 'pan-card',
    category: 'service',
    name: 'PAN Card Services',
    summary: 'Permanent Account Number for tax, banking, and identity.',
    keywords: ['pan', 'pan card', 'permanent account number', 'income tax', 'tax id', 'aadhaar pan link'],
    eligibility: [
      'Any Indian citizen or entity requiring a tax identity',
      'NRIs and foreign nationals can also apply under specific categories',
    ],
    documents: ['Aadhaar card', 'Address proof', 'Date of birth proof', 'Passport-size photograph'],
    steps: [
      'Apply on the official Protean (NSDL) or UTIITSL portal',
      'Fill Form 49A (citizens) or 49AA (others)',
      'Submit Aadhaar and address proof',
      'Pay the application fee',
      'Receive the PAN card by post; download e-PAN instantly',
    ],
    portal: 'Protean / UTIITSL official PAN portals',
    authority: 'Income Tax Department / NSDL',
    related: ['voter-id', 'birth-certificate'],
  },
  {
    id: 'income-certificate',
    category: 'service',
    name: 'Income Certificate',
    summary: 'Official proof of income for scholarships and scheme eligibility.',
    keywords: ['income certificate', 'income', 'salary certificate', 'income proof'],
    eligibility: [
      'Resident of the state issuing the certificate',
      'Required for scholarships, EWS reservation, and scheme benefits',
    ],
    documents: ['Aadhaar card', 'Salary slips (if employed) / income declaration', 'Address proof', 'Bank statement'],
    steps: [
      'Apply on your state e-District / Seva Kendra portal',
      'Fill the income certificate application form',
      'Upload income proof and ID',
      'Revenue official verifies the details',
      'Download the income certificate after approval',
    ],
    portal: 'State e-District / Common Service Centre (CSC)',
    authority: 'State Revenue Department',
    related: ['birth-certificate', 'pmay'],
  },

  // ───────── Public issue categories ─────────
  {
    id: 'issue-roads',
    category: 'issue',
    name: 'Potholes / Road Issues',
    summary: 'Damaged roads, potholes, and unsafe surfaces.',
    keywords: ['pothole', 'potholes', 'road', 'roads', 'broken road', 'damaged road', 'street'],
    steps: [
      'Open the Report Issue section in Smart Bharat',
      'Choose "Potholes / Roads" as the category',
      'Add the exact location and a clear photo',
      'Set urgency (Low / Medium / High)',
      'Submit to receive a tracking ID',
    ],
    related: ['issue-streetlight', 'issue-water'],
  },
  {
    id: 'issue-streetlight',
    category: 'issue',
    name: 'Streetlight Not Working',
    summary: 'Non-functional or damaged street lighting.',
    keywords: ['streetlight', 'street light', 'light not working', 'lamp post', 'dark road', 'lighting'],
    steps: [
      'Open the Report Issue section',
      'Choose "Streetlight not working"',
      'Add the pole number or landmark and a photo',
      'Set urgency and submit',
      'Track the status in the Track Complaint section',
    ],
    related: ['issue-roads', 'issue-water'],
  },
  {
    id: 'issue-water',
    category: 'issue',
    name: 'Water Supply Issue',
    summary: 'Short supply, contamination, or leakage of water.',
    keywords: ['water', 'water supply', 'no water', 'dirty water', 'water leakage', 'tanker'],
    steps: [
      'Open the Report Issue section',
      'Choose "Water supply"',
      'Describe the problem and affected area',
      'Add a photo if possible and submit',
      'Use the tracking ID to follow up',
    ],
    related: ['issue-roads', 'issue-streetlight'],
  },
];

/** Quick lookup by id */
export const knowledgeById = (id: string) => knowledgeBase.find((e) => e.id === id);

/** All scheme entries */
export const schemes = knowledgeBase.filter((e) => e.category === 'scheme');

/** All service entries */
export const services = knowledgeBase.filter((e) => e.category === 'service');

/** All issue entries */
export const issues = knowledgeBase.filter((e) => e.category === 'issue');

export const PROTOTYPE_DISCLAIMER =
  'Smart Bharat is a prototype civic assistance platform and is not an official Government of India service. Verify important information through official government portals.';
