/**
 * Civic grievance data layer — issue categories, departments, AI analysis,
 * and an in-memory complaint store for the Smart Bharat prototype.
 *
 * IMPORTANT: This is PROTOTYPE / DEMO data. No real government departments
 * or live tracking are involved. Complaints are stored in memory only and
 * reset on page reload.
 */

import type { LucideIcon } from 'lucide-react';
import {
  Construction,
  Trash2,
  Droplets,
  Lightbulb,
  Route,
  Waves,
  Zap,
  Bath,
  PackageX,
  HelpCircle,
} from 'lucide-react';

export type IssueCategory =
  | 'Potholes'
  | 'Garbage'
  | 'Water Leakage'
  | 'Street Light'
  | 'Road Damage'
  | 'Sewage'
  | 'Electricity'
  | 'Public Toilet'
  | 'Illegal Dumping'
  | 'Other';

export interface IssueCategoryMeta {
  value: IssueCategory;
  label: string;
  icon: LucideIcon;
  department: string;
  /** Keywords the AI analysis engine uses to detect the category from text */
  keywords: string[];
  /** Typical response time in business days */
  responseDays: number;
  /** Whether this category can be safety-critical (shows emergency numbers) */
  emergency?: boolean;
}

export const issueCategories: IssueCategoryMeta[] = [
  {
    value: 'Potholes',
    label: 'Potholes',
    icon: Construction,
    department: 'Municipal Roads Department',
    keywords: ['pothole', 'potholes', 'crater', 'broken road', 'road hole', 'damaged surface'],
    responseDays: 5,
  },
  {
    value: 'Garbage',
    label: 'Garbage',
    icon: Trash2,
    department: 'Solid Waste Management',
    keywords: ['garbage', 'trash', 'rubbish', 'waste', 'dumping', 'bin overflow', 'litter'],
    responseDays: 3,
  },
  {
    value: 'Water Leakage',
    label: 'Water Leakage',
    icon: Droplets,
    department: 'Water Supply & Sewerage Board',
    keywords: ['water', 'leakage', 'leak', 'pipe burst', 'no water', 'waterlogging', 'tanker'],
    responseDays: 2,
  },
  {
    value: 'Street Light',
    label: 'Street Light',
    icon: Lightbulb,
    department: 'Electrical / Street Lighting Division',
    keywords: ['streetlight', 'street light', 'lamp', 'light not working', 'dark road', 'pole'],
    responseDays: 4,
  },
  {
    value: 'Road Damage',
    label: 'Road Damage',
    icon: Route,
    department: 'Municipal Roads Department',
    keywords: ['road', 'damaged road', 'crack', 'broken tar', 'footpath', 'sidewalk'],
    responseDays: 6,
  },
  {
    value: 'Sewage',
    label: 'Sewage',
    icon: Waves,
    department: 'Sewerage & Drainage Board',
    keywords: ['sewage', 'sewer', 'drainage', 'drain', 'overflow', 'manhole', 'blockage'],
    responseDays: 3,
  },
  {
    value: 'Electricity',
    label: 'Electricity',
    icon: Zap,
    department: 'Electricity Distribution Company (DISCOM)',
    keywords: ['electricity', 'power', 'electric', 'voltage', 'wire', 'pole spark', 'no power', 'transformer'],
    responseDays: 2,
    emergency: true,
  },
  {
    value: 'Public Toilet',
    label: 'Public Toilet',
    icon: Bath,
    department: 'Urban Local Body / Sanitation',
    keywords: ['toilet', 'public toilet', 'washroom', 'urinal', 'restroom', 'unclean toilet'],
    responseDays: 4,
  },
  {
    value: 'Illegal Dumping',
    label: 'Illegal Dumping',
    icon: PackageX,
    department: 'Solid Waste Management / Enforcement',
    keywords: ['illegal dumping', 'encroachment', 'debris', 'construction waste', 'unauthorised'],
    responseDays: 5,
  },
  {
    value: 'Other',
    label: 'Other',
    icon: HelpCircle,
    department: 'Municipal Citizen Grievance Cell',
    keywords: [],
    responseDays: 7,
  },
];

export const categoryByValue = (v: IssueCategory) =>
  issueCategories.find((c) => c.value === v) ?? issueCategories[issueCategories.length - 1];

export type Severity = 'Low' | 'Medium' | 'High' | 'Critical';
export type ContactPreference = 'SMS' | 'Email' | 'No contact';

export const severityLevels: Severity[] = ['Low', 'Medium', 'High', 'Critical'];
export const contactPreferences: ContactPreference[] = ['SMS', 'Email', 'No contact'];

export type ComplaintStatus =
  | 'Submitted'
  | 'Assigned'
  | 'Under Review'
  | 'Work Started'
  | 'Resolved';

export const timelineStages: ComplaintStatus[] = [
  'Submitted',
  'Assigned',
  'Under Review',
  'Work Started',
  'Resolved',
];

export interface Complaint {
  id: string;
  category: IssueCategory;
  description: string;
  location: string;
  ward: string;
  landmark: string;
  severity: Severity;
  contactPreference: ContactPreference;
  department: string;
  status: ComplaintStatus;
  createdAt: string; // ISO
  aiAnalysis: ComplaintAnalysis;
}

export interface ComplaintAnalysis {
  detectedCategory: IssueCategory;
  confidence: number; // 0–100
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  suggestedDepartment: string;
  suggestedResponseTime: string;
  nextSteps: string[];
  safetyPrecautions: string[];
  expectedResolution: string;
  showEmergency: boolean;
}

// ───────── AI analysis engine (rule-based, swappable) ─────────

function detectCategory(text: string, selected: IssueCategory): IssueCategory {
  const lower = text.toLowerCase();
  let best: { cat: IssueCategory; score: number } = { cat: selected, score: 0 };
  for (const meta of issueCategories) {
    let score = 0;
    for (const k of meta.keywords) if (lower.includes(k)) score += 1;
    if (score > best.score) best = { cat: meta.value, score };
  }
  return best.score > 0 ? best.cat : selected;
}

function priorityFromSeverity(severity: Severity): ComplaintAnalysis['priority'] {
  if (severity === 'Critical') return 'Critical';
  if (severity === 'High') return 'High';
  if (severity === 'Medium') return 'Medium';
  return 'Low';
}

function confidenceFor(text: string, detected: IssueCategory, selected: IssueCategory): number {
  if (!text.trim()) return 72;
  const meta = categoryByValue(detected);
  const hits = meta.keywords.filter((k) => text.toLowerCase().includes(k)).length;
  const base = detected === selected ? 88 : 76;
  return Math.min(98, base + hits * 4);
}

function buildNextSteps(cat: IssueCategory): string[] {
  const meta = categoryByValue(cat);
  return [
    `Your complaint has been routed to the ${meta.department}.`,
    'Keep your complaint ID safe — you will need it to track progress.',
    'A field inspector may contact you for verification if contact preference is enabled.',
    'Track the status anytime in the Track Complaint section.',
  ];
}

function buildSafetyPrecautions(cat: IssueCategory): string[] {
  switch (cat) {
    case 'Electricity':
      return [
        'Stay away from exposed wires or sparking poles.',
        'Do not touch any fallen electrical infrastructure.',
        'If someone is injured, call 108 (Ambulance) immediately.',
      ];
    case 'Sewage':
    case 'Water Leakage':
      return [
        'Avoid contact with stagnant or contaminated water.',
        'Keep children and pets away from the affected area.',
        'Wash hands thoroughly after any contact.',
      ];
    case 'Road Damage':
    case 'Potholes':
      return [
        'Slow down near the damaged stretch and warn other commuters.',
        'Use hazard lights if visibility is low.',
        'Report accidents to 100 (Police) or 108 (Ambulance).',
      ];
    default:
      return [
        'Keep a safe distance from the affected area.',
        'Do not attempt repairs yourself.',
        'For emergencies, call 100 / 108 / 101.',
      ];
  }
}

export function analyzeComplaint(
  description: string,
  category: IssueCategory,
  severity: Severity,
): ComplaintAnalysis {
  const detected = detectCategory(description, category);
  const meta = categoryByValue(detected);
  const confidence = confidenceFor(description, detected, category);
  const priority = priorityFromSeverity(severity);

  return {
    detectedCategory: detected,
    confidence,
    priority,
    suggestedDepartment: meta.department,
    suggestedResponseTime: `${meta.responseDays} business days`,
    nextSteps: buildNextSteps(detected),
    safetyPrecautions: buildSafetyPrecautions(detected),
    expectedResolution: `Based on typical timelines, this issue may be addressed within ${meta.responseDays} business days. Timelines vary by ward and workload.`,
    showEmergency: Boolean(meta.emergency) || severity === 'Critical',
  };
}

// ───────── In-memory complaint store ─────────

let complaintCounter = 1000;

function generateComplaintId(): string {
  complaintCounter += 1;
  return `SB-2026-${complaintCounter}`;
}

// Seed with a few demo complaints so the dashboard and tracking are not empty.
const seedComplaints: Complaint[] = [
  {
    id: 'SB-2026-1001',
    category: 'Potholes',
    description: 'Large pothole near the school gate causing accidents.',
    location: 'Sector 12, New Delhi',
    ward: 'Ward 14',
    landmark: 'Near Govt Primary School',
    severity: 'High',
    contactPreference: 'SMS',
    department: 'Municipal Roads Department',
    status: 'Work Started',
    createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
    aiAnalysis: analyzeComplaint('Large pothole near the school gate', 'Potholes', 'High'),
  },
  {
    id: 'SB-2026-1002',
    category: 'Street Light',
    description: 'Streetlight not working on the main road, very dark at night.',
    location: 'MG Road, Bengaluru',
    ward: 'Ward 7',
    landmark: 'Opposite Metro Station',
    severity: 'Medium',
    contactPreference: 'Email',
    department: 'Electrical / Street Lighting Division',
    status: 'Resolved',
    createdAt: new Date(Date.now() - 12 * 86400000).toISOString(),
    aiAnalysis: analyzeComplaint('Streetlight not working on the main road', 'Street Light', 'Medium'),
  },
  {
    id: 'SB-2026-1003',
    category: 'Garbage',
    description: 'Garbage bins overflowing, waste scattered on the street.',
    location: 'Andheri West, Mumbai',
    ward: 'Ward 22',
    landmark: 'Near Municipal Market',
    severity: 'Medium',
    contactPreference: 'SMS',
    department: 'Solid Waste Management',
    status: 'Assigned',
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    aiAnalysis: analyzeComplaint('Garbage bins overflowing', 'Garbage', 'Medium'),
  },
];

const store: Complaint[] = [...seedComplaints];

export function getAllComplaints(): Complaint[] {
  return [...store].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function getComplaintById(id: string): Complaint | undefined {
  return store.find((c) => c.id.toLowerCase() === id.toLowerCase().trim());
}

export function addComplaint(
  data: Omit<Complaint, 'id' | 'status' | 'createdAt' | 'aiAnalysis' | 'department'>,
): Complaint {
  const analysis = analyzeComplaint(data.description, data.category, data.severity);
  const complaint: Complaint = {
    ...data,
    id: generateComplaintId(),
    status: 'Submitted',
    createdAt: new Date().toISOString(),
    department: analysis.suggestedDepartment,
    aiAnalysis: analysis,
  };
  store.unshift(complaint);
  return complaint;
}

export interface DashboardStats {
  total: number;
  resolved: number;
  pending: number;
  inProgress: number;
}

export function getDashboardStats(): DashboardStats {
  const total = store.length;
  const resolved = store.filter((c) => c.status === 'Resolved').length;
  const pending = store.filter((c) => c.status === 'Submitted' || c.status === 'Assigned').length;
  const inProgress = store.filter((c) => c.status === 'Under Review' || c.status === 'Work Started').length;
  return { total, resolved, pending, inProgress };
}

export function getRecentComplaints(limit = 5): Complaint[] {
  return [...store]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, limit);
}

export const EMERGENCY_NUMBERS = [
  { label: 'Police', number: '100' },
  { label: 'Ambulance', number: '108' },
  { label: 'Fire', number: '101' },
  { label: 'Electricity Hazard', number: '191' },
  { label: 'Women Helpline', number: '1091' },
];
