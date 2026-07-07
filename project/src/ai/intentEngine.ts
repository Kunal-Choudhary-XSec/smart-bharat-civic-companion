/**
 * Intent detection — rule / keyword based for the prototype.
 *
 * The function is pure and stateless so it can be replaced by an LLM call
 * later without changing its signature or callers.
 */
import type { CivicIntent, IntentResult } from './types';
import { INTENT_LABELS } from './types';

interface Rule {
  intent: CivicIntent;
  keywords: string[];
  /** Strong keywords that boost the score more */
  strong?: string[];
}

const rules: Rule[] = [
  {
    intent: 'COMPLAINT_TRACKING',
    keywords: ['track', 'status', 'where is', 'complaint status', 'grievance status', 'my complaint', 'track my', 'track complaint'],
    strong: ['sb-20', 'tracking id', 'complaint id', 'track my complaint'],
  },
  {
    intent: 'ISSUE_REPORTING',
    keywords: ['report', 'complain', 'pothole', 'streetlight', 'garbage', 'water issue', 'sewage', 'drainage', 'noise', 'encroachment', 'report a', 'file a complaint', 'raise issue'],
    strong: ['pothole', 'streetlight', 'report a pothole', 'report issue', 'file a complaint'],
  },
  {
    intent: 'DOCUMENT_GUIDANCE',
    keywords: ['document', 'documents', 'papers', 'what do i need', 'required documents', 'proof', 'kyc', 'which documents'],
    strong: ['documents required', 'what documents', 'required documents', 'which documents'],
  },
  {
    intent: 'ELIGIBILITY_GUIDANCE',
    keywords: ['eligible', 'eligibility', 'am i eligible', 'can i apply', 'do i qualify', 'qualification', 'who can apply'],
    strong: ['am i eligible', 'do i qualify', 'can i apply', 'eligibility'],
  },
  {
    intent: 'SCHEME_DISCOVERY',
    keywords: ['scheme', 'schemes', 'yojana', 'welfare', 'benefit', 'subsidy', 'assistance', 'government scheme', 'schemes for', 'relevant schemes'],
    strong: ['scheme', 'yojana', 'welfare scheme', 'schemes for me', 'relevant schemes'],
  },
  {
    intent: 'SERVICE_INFORMATION',
    keywords: ['service', 'apply', 'application', 'how to apply', 'register', 'registration', 'certificate', 'licence', 'license', 'passport', 'pan', 'voter', 'birth certificate', 'income certificate'],
    strong: ['how to apply', 'apply for', 'how do i apply', 'register for'],
  },
  {
    intent: 'GENERAL_CIVIC_QUERY',
    keywords: ['civic', 'government', 'municipal', 'corporation', 'how does', 'what is', 'help', 'guide', 'process', 'procedure'],
    strong: ['civic', 'government', 'municipal'],
  },
];

const outOfScopeSignals = [
  'python', 'javascript', 'code', 'program', 'write code', 'recipe', 'cook', 'movie',
  'football', 'cricket score', 'stock', 'crypto', 'weather', 'joke', 'poem', 'song',
  'game', 'chatgpt', 'translate', 'essay', 'story',
];

export function detectIntent(message: string): IntentResult {
  const text = message.toLowerCase().trim();

  if (!text) {
    return { intent: 'GENERAL_CIVIC_QUERY', label: INTENT_LABELS.GENERAL_CIVIC_QUERY, score: 0 };
  }

  // Out-of-scope: explicit non-civic signals
  if (outOfScopeSignals.some((k) => text.includes(k))) {
    // but only if no civic keyword is present
    const hasCivic = rules.some((r) => r.keywords.some((k) => text.includes(k)));
    if (!hasCivic) {
      return { intent: 'OUT_OF_SCOPE', label: INTENT_LABELS.OUT_OF_SCOPE, score: 0.9 };
    }
  }

  let best: { intent: CivicIntent; score: number } = { intent: 'GENERAL_CIVIC_QUERY', score: 0.2 };

  for (const rule of rules) {
    let score = 0;
    for (const k of rule.keywords) if (text.includes(k)) score += 1;
    for (const k of rule.strong ?? []) if (text.includes(k)) score += 2;
    // normalise to a 0–1-ish signal
    const norm = Math.min(1, score / 3);
    if (norm > best.score) best = { intent: rule.intent, score: norm };
  }

  return { intent: best.intent, label: INTENT_LABELS[best.intent], score: best.score };
}
