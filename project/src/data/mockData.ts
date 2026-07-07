import {
  Bot,
  Landmark,
  FileText,
  Search,
  AlertTriangle,
  PackageSearch,
  type LucideIcon,
} from 'lucide-react';

export type PageId =
  | 'home'
  | 'services'
  | 'schemes'
  | 'report'
  | 'track'
  | 'dashboard'
  | 'assistant';

export interface NavItem {
  id: PageId;
  label: string;
}

export const navItems: NavItem[] = [
  { id: 'home', label: 'Home' },
  { id: 'services', label: 'Services' },
  { id: 'schemes', label: 'Schemes' },
  { id: 'report', label: 'Report Issue' },
  { id: 'track', label: 'Track Complaint' },
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'assistant', label: 'AI Assistant' },
];

export interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  accent: 'saffron' | 'navy' | 'ashoka' | 'sky';
  page: PageId;
}

export const quickActions: QuickAction[] = [
  {
    id: 'ai-assistant',
    title: 'AI Civic Assistant',
    description: 'Ask any question about services, schemes, or civic procedures.',
    icon: Bot,
    accent: 'saffron',
    page: 'assistant',
  },
  {
    id: 'find-schemes',
    title: 'Find Government Schemes',
    description: 'Discover welfare schemes you may be eligible for.',
    icon: PackageSearch,
    accent: 'ashoka',
    page: 'schemes',
  },
  {
    id: 'explore-services',
    title: 'Explore Government Services',
    description: 'Browse citizen services and apply with guided steps.',
    icon: Landmark,
    accent: 'navy',
    page: 'services',
  },
  {
    id: 'doc-guide',
    title: 'Document Requirement Guide',
    description: 'Know exactly which documents you need before you apply.',
    icon: FileText,
    accent: 'sky',
    page: 'services',
  },
  {
    id: 'report-issue',
    title: 'Report Public Issue',
    description: 'Report potholes, streetlights, water, sanitation and more.',
    icon: AlertTriangle,
    accent: 'saffron',
    page: 'report',
  },
  {
    id: 'track-complaint',
    title: 'Track Complaint',
    description: 'Check the live status of complaints you have filed.',
    icon: Search,
    accent: 'navy',
    page: 'track',
  },
];

export interface GovService {
  id: string;
  name: string;
  category: string;
  description: string;
  popularity: number;
  icon: LucideIcon;
  accent: 'saffron' | 'navy' | 'ashoka' | 'sky';
}

export const popularServices: GovService[] = [
  {
    id: 'birth-certificate',
    name: 'Birth Certificate',
    category: 'Vital Records',
    description: 'Register and download birth certificates from your municipal authority.',
    popularity: 98,
    icon: FileText,
    accent: 'saffron',
  },
  {
    id: 'pan-card',
    name: 'PAN Card Services',
    category: 'Identity & Tax',
    description: 'Apply for a new PAN, request corrections, or link with Aadhaar.',
    popularity: 95,
    icon: FileText,
    accent: 'navy',
  },
  {
    id: 'passport',
    name: 'Passport Services',
    category: 'Travel & Identity',
    description: 'Fresh passport, renewal, and police verification scheduling.',
    popularity: 91,
    icon: FileText,
    accent: 'sky',
  },
  {
    id: 'driving-licence',
    name: 'Driving Licence',
    category: 'Transport',
    description: 'Learner and permanent licence, renewals, and vehicle registration.',
    popularity: 89,
    icon: FileText,
    accent: 'ashoka',
  },
  {
    id: 'voter-id',
    name: 'Voter ID Services',
    category: 'Elections',
    description: 'New voter registration, corrections, and download e-EPIC.',
    popularity: 84,
    icon: FileText,
    accent: 'saffron',
  },
  {
    id: 'income-certificate',
    name: 'Income Certificate',
    category: 'Certificates',
    description: 'Apply for income certificates for scholarships and scheme eligibility.',
    popularity: 80,
    icon: FileText,
    accent: 'navy',
  },
];

export interface Scheme {
  id: string;
  name: string;
  ministry: string;
  eligibility: string;
  benefit: string;
  tags: string[];
  accent: 'saffron' | 'navy' | 'ashoka' | 'sky';
}

export const popularSchemes: Scheme[] = [
  {
    id: 'pmjay',
    name: 'Ayushman Bharat (PM-JAY)',
    ministry: 'Ministry of Health & Family Welfare',
    eligibility: 'Families listed in SECC 2011 database',
    benefit: 'Up to ₹5 lakh health cover per family per year',
    tags: ['Health', 'Free'],
    accent: 'ashoka',
  },
  {
    id: 'pmay',
    name: 'Pradhan Mantri Awas Yojana',
    ministry: 'Ministry of Housing & Urban Affairs',
    eligibility: 'EWS / LIG households without pucca house',
    benefit: 'Interest subsidy on home loans up to ₹2.67 lakh',
    tags: ['Housing', 'Subsidy'],
    accent: 'saffron',
  },
  {
    id: 'sukanya',
    name: 'Sukanya Samriddhi Yojana',
    ministry: 'Ministry of Finance',
    eligibility: 'Girl child under 10 years',
    benefit: 'High-interest savings, tax-free maturity',
    tags: ['Savings', 'Girl Child'],
    accent: 'navy',
  },
  {
    id: 'pm-kisan',
    name: 'PM-KISAN Samman Nidhi',
    ministry: 'Ministry of Agriculture',
    eligibility: 'Small & marginal farmer families',
    benefit: '₹6,000 per year in three installments',
    tags: ['Agriculture', 'Income Support'],
    accent: 'ashoka',
  },
  {
    id: 'skill-india',
    name: 'Skill India (PMKVY)',
    ministry: 'Ministry of Skill Development',
    eligibility: 'Youth aged 15–45 years',
    benefit: 'Free short-term skill training + certification',
    tags: ['Education', 'Free Training'],
    accent: 'sky',
  },
  {
    id: 'mudra',
    name: 'Pradhan Mantri Mudra Yojana',
    ministry: 'Ministry of Finance',
    eligibility: 'Small business owners & entrepreneurs',
    benefit: 'Loans up to ₹10 lakh without collateral',
    tags: ['Business', 'Loan'],
    accent: 'saffron',
  },
];

export interface HowItWorksStep {
  number: number;
  title: string;
  description: string;
  icon: LucideIcon;
}

export const howItWorksSteps: HowItWorksStep[] = [
  {
    number: 1,
    title: 'Tell us what you need',
    description:
      'Describe your need in plain language or pick a service. The AI assistant understands your intent instantly.',
    icon: Bot,
  },
  {
    number: 2,
    title: 'Get a guided plan',
    description:
      'Smart Bharat matches you to the right service or scheme and shows the exact steps and documents required.',
    icon: FileText,
  },
  {
    number: 3,
    title: 'Act and track',
    description:
      'Apply, report issues, and track your complaints — all from one citizen dashboard, in your language.',
    icon: Search,
  },
];

export interface AccessibilityFeature {
  title: string;
  description: string;
  icon: LucideIcon;
}

export const accessibilityFeatures: AccessibilityFeature[] = [
  {
    title: 'Multilingual Support',
    description: 'Available in 12+ Indian languages so every citizen can participate in their own tongue.',
    icon: Bot,
  },
  {
    title: 'Simple Language',
    description: 'No jargon. Every process is explained in clear, everyday words anyone can follow.',
    icon: FileText,
  },
  {
    title: 'Mobile-Friendly Access',
    description: 'Built for low-bandwidth phones and small screens — works across rural and urban India.',
    icon: Search,
  },
  {
    title: 'Inclusive Design',
    description: 'High-contrast themes, large touch targets, and screen-reader friendly markup by default.',
    icon: Landmark,
  },
];

export const languages = [
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'हिन्दी' },
  { code: 'bn', label: 'বাংলা' },
  { code: 'ta', label: 'தமிழ்' },
  { code: 'te', label: 'తెలుగు' },
  { code: 'mr', label: 'मराठी' },
  { code: 'kn', label: 'ಕನ್ನಡ' },
  { code: 'gu', label: 'ગુજરાતી' },
  { code: 'pa', label: 'ਪੰਜਾਬੀ' },
  { code: 'ml', label: 'മലയാളം' },
  { code: 'or', label: 'ଓଡ଼ିଆ' },
  { code: 'as', label: 'অসমীয়া' },
];

export const footerSections = [
  {
    title: 'About',
    links: ['About Smart Bharat', 'Our Mission', 'Press & Media', 'Careers'],
  },
  {
    title: 'Accessibility',
    links: ['Accessibility Statement', 'Screen Reader Guide', 'Language Support', 'Contrast Settings'],
  },
  {
    title: 'Policies',
    links: ['Privacy Policy', 'Terms of Use', 'Data Protection', 'Cookie Policy'],
  },
  {
    title: 'Help & Support',
    links: ['Help Centre', 'Contact Us', 'FAQs', 'Report a Bug'],
  },
  {
    title: 'Emergency Services',
    links: ['Police — 100', 'Ambulance — 108', 'Fire — 101', 'Women Helpline — 1091'],
  },
];
