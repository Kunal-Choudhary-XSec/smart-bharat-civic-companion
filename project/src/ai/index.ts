/**
 * AI service entry point. The UI imports `civicService` from here.
 * Swap the implementation (local → Gemini/OpenAI) in this one file.
 */
import type { CivicAIService } from './types';
import { localCivicService } from './localCivicService';

export const civicService: CivicAIService = localCivicService;

export type { CivicAIService, CivicRequest, CivicResponse, CivicIntent, IntentResult, ResponseSection } from './types';
export { INTENT_LABELS } from './types';
export { PROTOTYPE_DISCLAIMER } from '../data/civicKnowledge';
