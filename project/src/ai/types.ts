/**
 * AI service types — the contract every AI backend (local or remote LLM)
 * must implement. The UI depends only on these types, so the backend can be
 * swapped (Gemini, OpenAI, etc.) without touching components.
 */

export type CivicIntent =
  | 'SERVICE_INFORMATION'
  | 'SCHEME_DISCOVERY'
  | 'ELIGIBILITY_GUIDANCE'
  | 'DOCUMENT_GUIDANCE'
  | 'ISSUE_REPORTING'
  | 'COMPLAINT_TRACKING'
  | 'GENERAL_CIVIC_QUERY'
  | 'OUT_OF_SCOPE';

export interface IntentResult {
  intent: CivicIntent;
  /** Human-readable label for the UI badge */
  label: string;
  /** Confidence-ish signal (0–1) for the local engine; ignored by UI */
  score: number;
}

/** A structured block within a response (e.g. an eligibility list) */
export interface ResponseSection {
  type: 'paragraph' | 'list' | 'steps' | 'recommendations' | 'notice';
  title?: string;
  items?: string[];
  text?: string;
}

export interface CivicResponse {
  /** Detected intent that produced this response */
  intent: CivicIntent;
  intentLabel: string;
  /** Plain-text summary shown as the main bubble */
  summary: string;
  /** Structured sections rendered beneath the summary */
  sections: ResponseSection[];
  /** Suggested follow-up questions the user can click */
  followUps: string[];
  /** Whether a verification disclaimer should be shown */
  requiresDisclaimer: boolean;
  /** Optional related knowledge-entry ids */
  relatedIds?: string[];
}

export interface CivicRequest {
  /** The user's latest message */
  message: string;
  /** Conversation history (most-recent-last), for future context-aware LLM calls */
  history: { role: 'user' | 'assistant'; text: string }[];
}

/**
 * The AI service interface. The local implementation lives in
 * `localCivicService`. A future `geminiCivicService` / `openaiCivicService`
 * would implement the same interface.
 */
export interface CivicAIService {
  detectIntent(message: string): IntentResult;
  respond(request: CivicRequest): Promise<CivicResponse>;
}

export const INTENT_LABELS: Record<CivicIntent, string> = {
  SERVICE_INFORMATION: 'Government Services',
  SCHEME_DISCOVERY: 'Scheme Discovery',
  ELIGIBILITY_GUIDANCE: 'Eligibility Guidance',
  DOCUMENT_GUIDANCE: 'Document Guidance',
  ISSUE_REPORTING: 'Issue Reporting',
  COMPLAINT_TRACKING: 'Complaint Tracking',
  GENERAL_CIVIC_QUERY: 'General Civic Query',
  OUT_OF_SCOPE: 'Out of Scope',
};
