/**
 * Contextual response generator — turns a detected intent + knowledge base
 * match into a structured CivicResponse with safety behaviour baked in.
 */
import type { CivicIntent, CivicResponse, ResponseSection } from './types';
import { INTENT_LABELS } from './types';
import {
  knowledgeBase,
  schemes,
  services,
  issues,
  knowledgeById,
  type KnowledgeEntry,
} from '../data/civicKnowledge';

const DISCLAIMER_TEXT =
  'This is prototype/demo information. Verify details and current rules through the official government portal before applying.';

/** Find the best knowledge-base match for a query string. */
function matchKnowledge(message: string): KnowledgeEntry | undefined {
  const text = message.toLowerCase();
  let best: { entry: KnowledgeEntry; score: number } | undefined;
  for (const entry of knowledgeBase) {
    let score = 0;
    for (const k of entry.keywords) if (text.includes(k)) score += k.length > 6 ? 2 : 1;
    if (text.includes(entry.name.toLowerCase())) score += 3;
    if (!best || score > best.score) best = { entry, score };
  }
  return best && best.score > 0 ? best.entry : undefined;
}

function entryToSections(entry: KnowledgeEntry): ResponseSection[] {
  const sections: ResponseSection[] = [];
  if (entry.eligibility?.length) {
    sections.push({ type: 'list', title: 'Eligibility overview', items: entry.eligibility });
  }
  if (entry.documents?.length) {
    sections.push({ type: 'list', title: 'Required documents', items: entry.documents });
  }
  if (entry.steps?.length) {
    sections.push({ type: 'steps', title: 'How to apply', items: entry.steps });
  }
  if (entry.portal) {
    sections.push({ type: 'paragraph', title: 'Official portal', text: entry.portal });
  }
  return sections;
}

function followUpsFor(entry: KnowledgeEntry): string[] {
  const base: string[] = [];
  if (entry.eligibility) base.push(`Am I eligible for ${entry.name}?`);
  if (entry.documents) base.push(`What documents are required for ${entry.name}?`);
  if (entry.category === 'scheme') base.push('Which other government schemes may be relevant for me?');
  if (entry.category === 'service') base.push('How do I apply for a birth certificate?');
  if (entry.category === 'issue') base.push('How can I track my complaint?');
  return base.slice(0, 3);
}

function relatedRecommendations(entry: KnowledgeEntry): ResponseSection | undefined {
  if (!entry.related?.length) return undefined;
  const related = entry.related
    .map((id) => knowledgeById(id))
    .filter((e): e is KnowledgeEntry => Boolean(e));
  if (!related.length) return undefined;
  return {
    type: 'recommendations',
    title: 'You may also want to explore',
    items: related.map((e) => e.name),
  };
}

/** Extract a complaint ID like SB-2026-1042 from the message. */
function extractComplaintId(message: string): string | undefined {
  const match = message.toUpperCase().match(/SB-\d{4}-\d{3,6}/);
  return match?.[0];
}

export function generateResponse(
  intent: CivicIntent,
  message: string,
): CivicResponse {
  const intentLabel = INTENT_LABELS[intent];
  const entry = matchKnowledge(message);

  switch (intent) {
    case 'SERVICE_INFORMATION': {
      if (entry && entry.category === 'service') {
        return {
          intent,
          intentLabel,
          summary: `${entry.name}: ${entry.summary}`,
          sections: entryToSections(entry),
          followUps: followUpsFor(entry),
          requiresDisclaimer: true,
          relatedIds: entry.related,
        };
      }
      // generic service list
      return {
        intent,
        intentLabel,
        summary:
          'I can guide you on several government services. Here are some popular ones — tell me which one you need help with.',
        sections: [
          {
            type: 'recommendations',
            title: 'Popular services',
            items: services.map((s) => s.name),
          },
        ],
        followUps: ['How do I apply for a birth certificate?', 'What documents are required for a passport?'],
        requiresDisclaimer: true,
      };
    }

    case 'SCHEME_DISCOVERY': {
      if (entry && entry.category === 'scheme') {
        return {
          intent,
          intentLabel,
          summary: `${entry.name}: ${entry.summary}`,
          sections: entryToSections(entry),
          followUps: followUpsFor(entry),
          requiresDisclaimer: true,
          relatedIds: entry.related,
        };
      }
      return {
        intent,
        intentLabel,
        summary:
          'Here are some major government welfare schemes. Ask about any of them for eligibility, documents, and steps.',
        sections: [
          {
            type: 'recommendations',
            title: 'Government schemes',
            items: schemes.map((s) => `${s.name} — ${s.summary}`),
          },
        ],
        followUps: ['Am I eligible for Ayushman Bharat?', 'Tell me about PM-KISAN', 'Which government schemes may be relevant for me?'],
        requiresDisclaimer: true,
      };
    }

    case 'ELIGIBILITY_GUIDANCE': {
      if (entry && entry.eligibility) {
        const rec = relatedRecommendations(entry);
        return {
          intent,
          intentLabel,
          summary: `Eligibility overview for ${entry.name}.`,
          sections: [
            { type: 'list', title: 'Who can apply', items: entry.eligibility },
            { type: 'notice', text: 'I cannot guarantee your eligibility — final confirmation is done by the issuing authority. Use the official portal to verify.' },
            ...(rec ? [rec] : []),
          ],
          followUps: [`What documents are required for ${entry.name}?`, `How do I apply for ${entry.name}?`],
          requiresDisclaimer: true,
          relatedIds: entry.related,
        };
      }
      return {
        intent,
        intentLabel,
        summary:
          'Tell me which scheme or service you are asking about (for example, "Am I eligible for Ayushman Bharat?") and I will share the eligibility overview.',
        sections: [],
        followUps: ['Am I eligible for Ayushman Bharat?', 'Am I eligible for PM-KISAN?'],
        requiresDisclaimer: true,
      };
    }

    case 'DOCUMENT_GUIDANCE': {
      if (entry && entry.documents) {
        return {
          intent,
          intentLabel,
          summary: `Documents usually required for ${entry.name}:`,
          sections: [
            { type: 'list', title: 'Required documents', items: entry.documents },
            { type: 'notice', text: 'Document requirements can vary by state and case. Confirm the exact list on the official portal.' },
          ],
          followUps: [`How do I apply for ${entry.name}?`, `Am I eligible for ${entry.name}?`],
          requiresDisclaimer: true,
          relatedIds: entry.related,
        };
      }
      return {
        intent,
        intentLabel,
        summary:
          'Which service or scheme do you need documents for? For example, "What documents are required for a passport?"',
        sections: [],
        followUps: ['What documents are required for a passport?', 'Documents needed for a birth certificate?'],
        requiresDisclaimer: true,
      };
    }

    case 'ISSUE_REPORTING': {
      if (entry && entry.category === 'issue') {
        return {
          intent,
          intentLabel,
          summary: `To report ${entry.name.toLowerCase()}, follow these steps:`,
          sections: [
            { type: 'steps', title: 'How to report', items: entry.steps ?? [] },
            { type: 'notice', text: 'For emergencies (accident, fire, medical), call 100 / 101 / 108 immediately instead of using this app.' },
          ],
          followUps: ['How can I track my complaint?', 'How do I report a streetlight issue?'],
          requiresDisclaimer: false,
          relatedIds: entry.related,
        };
      }
      return {
        intent,
        intentLabel,
        summary: 'You can report several types of public issues through Smart Bharat. Which one would you like to report?',
        sections: [
          { type: 'recommendations', title: 'Issue categories', items: issues.map((i) => i.name) },
        ],
        followUps: ['How can I report a pothole?', 'How do I report a streetlight issue?'],
        requiresDisclaimer: false,
      };
    }

    case 'COMPLAINT_TRACKING': {
      const id = extractComplaintId(message);
      return {
        intent,
        intentLabel,
        summary: id
          ? `I cannot fetch the live status of complaint ${id} because Smart Bharat is a prototype and is not connected to a live grievance database right now.`
          : 'I cannot fetch live complaint status because Smart Bharat is a prototype and is not connected to a live grievance database right now.',
        sections: [
          {
            type: 'steps',
            title: 'How to track a complaint',
            items: [
              'Go to the Track Complaint section in Smart Bharat',
              'Enter your complaint ID (e.g. SB-2026-1042)',
              'View the current status and progress bar',
            ],
          },
          { type: 'notice', text: 'I never fabricate complaint or application status. Real-time status requires a live database connection, which is not available in this prototype.' },
        ],
        followUps: ['How can I report a pothole?', 'Which government schemes may be relevant for me?'],
        requiresDisclaimer: false,
      };
    }

    case 'OUT_OF_SCOPE': {
      return {
        intent,
        intentLabel,
        summary:
          "I'm Bharat AI, a civic assistant — I help with government services, schemes, documents, and reporting public issues. I can't help with coding, entertainment, or general knowledge questions.",
        sections: [
          { type: 'paragraph', text: 'Try asking me something civic, like:' },
          { type: 'recommendations', title: 'I can help with', items: ['Government services', 'Welfare schemes', 'Eligibility & documents', 'Reporting public issues'] },
        ],
        followUps: ['Which government schemes may be relevant for me?', 'How do I apply for a birth certificate?', 'How can I report a pothole?'],
        requiresDisclaimer: false,
      };
    }

    case 'GENERAL_CIVIC_QUERY':
    default: {
      if (entry) {
        return {
          intent,
          intentLabel,
          summary: `${entry.name}: ${entry.summary}`,
          sections: entryToSections(entry),
          followUps: followUpsFor(entry),
          requiresDisclaimer: true,
          relatedIds: entry.related,
        };
      }
      return {
        intent,
        intentLabel,
        summary:
          "I'm Bharat AI, your civic companion. I can help with government services, welfare schemes, eligibility, documents, and reporting public issues. What would you like to know?",
        sections: [
          {
            type: 'recommendations',
            title: 'Try asking about',
            items: ['Government schemes', 'How to apply for a service', 'Required documents', 'Reporting a public issue'],
          },
        ],
        followUps: ['Which government schemes may be relevant for me?', 'How do I apply for a birth certificate?', 'How can I report a pothole?'],
        requiresDisclaimer: false,
      };
    }
  }
}

export { DISCLAIMER_TEXT };
