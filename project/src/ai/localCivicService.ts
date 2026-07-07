/**
 * Local civic AI service — implements CivicAIService using the local
 * knowledge base + rule-based intent engine. No external API, no keys.
 *
 * To swap in a real LLM later, create e.g. `geminiCivicService.ts`
 * implementing the same `CivicAIService` interface and replace the export
 * in `index.ts`. No UI changes required.
 */
import type { CivicAIService, CivicRequest, CivicResponse, IntentResult } from './types';
import { detectIntent } from './intentEngine';
import { generateResponse } from './responseGenerator';

// Simulated latency so the typing indicator is visible and feels natural.
const SIMULATED_DELAY_MS = 650;

export const localCivicService: CivicAIService = {
  detectIntent(message: string): IntentResult {
    return detectIntent(message);
  },

  async respond(request: CivicRequest): Promise<CivicResponse> {
    const { message } = request;
    const intentResult = this.detectIntent(message);
    await new Promise((r) => setTimeout(r, SIMULATED_DELAY_MS));
    return generateResponse(intentResult.intent, message);
  },
};
