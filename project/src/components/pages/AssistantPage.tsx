import { useState, useRef, useEffect } from 'react';
import { Bot, Send, Sparkles, User, Trash2, AlertTriangle, ShieldCheck, Tag } from 'lucide-react';
import { PageHeader } from './ServicesPage';
import { ResponseSectionView } from '../ai/ResponseSectionView';
import { civicService, PROTOTYPE_DISCLAIMER, type CivicResponse } from '../../ai';

interface ChatMessage {
  id: number;
  role: 'user' | 'assistant';
  text: string;
  response?: CivicResponse;
  error?: boolean;
}

const quickPrompts = [
  'Which government schemes may be relevant for me?',
  'How do I apply for a birth certificate?',
  'What documents are required for a passport?',
  'How can I report a pothole?',
  'How can I track my complaint?',
  'Am I eligible for Ayushman Bharat?',
];

const WELCOME: ChatMessage = {
  id: 0,
  role: 'assistant',
  text:
    "Namaste! I'm Bharat AI, your civic companion. I can help with government services, welfare schemes, eligibility, documents, and reporting public issues. How can I help you today?",
};

export function AssistantPage({
  seedQuestion,
  onSeedConsumed,
}: {
  seedQuestion?: string | null;
  onSeedConsumed?: () => void;
}) {
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  // Auto-send a contextual question passed from the Scheme Finder.
  useEffect(() => {
    if (seedQuestion && seedQuestion.trim()) {
      send(seedQuestion);
      onSeedConsumed?.();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seedQuestion]);

  const send = async (text: string) => {
    const q = text.trim();
    if (!q || typing) return;

    const userMsg: ChatMessage = { id: Date.now(), role: 'user', text: q };
    setMessages((m) => [...m, userMsg]);
    setInput('');
    setTyping(true);

    try {
      const history = messages.map((m) => ({ role: m.role, text: m.text }));
      const response = await civicService.respond({ message: q, history });
      const assistantMsg: ChatMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        text: response.summary,
        response,
      };
      setMessages((m) => [...m, assistantMsg]);
    } catch {
      const errMsg: ChatMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        text: 'Sorry, something went wrong while generating a response. Please try again.',
        error: true,
      };
      setMessages((m) => [...m, errMsg]);
    } finally {
      setTyping(false);
    }
  };

  const clearChat = () => {
    setMessages([{ ...WELCOME, id: Date.now() }]);
    setInput('');
  };

  const isEmpty = messages.length <= 1;

  return (
    <div className="container-page py-12 lg:py-16">
      <PageHeader
        eyebrow="AI Civic Assistant"
        title="Ask Bharat AI"
        description="Your AI-powered guide to government services and schemes. Ask in plain language — in any of 12+ Indian languages."
      />

      {/* Prototype notice */}
      <div className="mt-6 flex items-start gap-3 rounded-2xl border border-saffron-200 bg-saffron-50/60 px-4 py-3">
        <ShieldCheck className="h-5 w-5 shrink-0 text-saffron-600 mt-0.5" />
        <p className="text-sm text-saffron-800 leading-relaxed">{PROTOTYPE_DISCLAIMER}</p>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-12">
        {/* Chat */}
        <div className="lg:col-span-8 card p-0 overflow-hidden flex flex-col h-[620px]">
          {/* Header */}
          <div className="flex items-center justify-between gap-3 px-5 py-3.5 border-b border-navy-100 bg-navy-50/50">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 rounded-xl bg-saffron-400/40 animate-pulse-ring" />
                <div className="relative inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-saffron-400 to-saffron-600 text-white">
                  <Bot className="h-5 w-5" />
                </div>
              </div>
              <div>
                <p className="font-bold text-navy-900">Bharat AI</p>
                <p className="text-xs text-ashoka-600 flex items-center gap-1.5">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-ashoka-500" /> Online · Prototype
                </p>
              </div>
            </div>
            <button
              onClick={clearChat}
              className="inline-flex items-center gap-1.5 rounded-lg border border-navy-200 bg-white px-2.5 py-1.5 text-xs font-medium text-navy-600 hover:border-navy-300 hover:bg-navy-50 transition-colors"
              aria-label="Clear chat"
            >
              <Trash2 className="h-3.5 w-3.5" /> Clear chat
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {isEmpty && (
              <div className="h-full flex flex-col items-center justify-center text-center py-10">
                <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-saffron-400 to-saffron-600 text-white shadow-lg mb-4">
                  <Bot className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-bold text-navy-900">How can I help you today?</h3>
                <p className="mt-1.5 text-sm text-navy-500 max-w-sm">
                  Ask about a government service, check scheme eligibility, find required documents, or learn how to report a public issue.
                </p>
                <div className="mt-5 flex flex-wrap justify-center gap-2 max-w-md">
                  {quickPrompts.slice(0, 4).map((p) => (
                    <button
                      key={p}
                      onClick={() => send(p)}
                      className="chip border border-navy-200 bg-white text-navy-700 hover:border-saffron-300 hover:bg-saffron-50 transition-colors"
                    >
                      <Sparkles className="h-3 w-3 text-saffron-500" /> {p}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((m) => (
              <div key={m.id} className={`flex gap-3 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div
                  className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                    m.role === 'user'
                      ? 'bg-navy-800 text-white'
                      : m.error
                      ? 'bg-red-100 text-red-600'
                      : 'bg-gradient-to-br from-saffron-400 to-saffron-600 text-white'
                  }`}
                >
                  {m.role === 'user' ? <User className="h-4 w-4" /> : m.error ? <AlertTriangle className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                </div>
                <div className={`max-w-[82%] ${m.role === 'user' ? '' : 'w-full'}`}>
                  <div
                    className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                      m.role === 'user'
                        ? 'bg-navy-800 text-white rounded-tr-sm'
                        : m.error
                        ? 'bg-red-50 text-red-700 border border-red-100 rounded-tl-sm'
                        : 'bg-navy-50 text-navy-800 rounded-tl-sm'
                    }`}
                  >
                    {m.text}
                  </div>

                  {/* Intent label */}
                  {m.response && (
                    <div className="mt-2 flex items-center gap-2">
                      <span className="inline-flex items-center gap-1 rounded-full bg-saffron-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-saffron-700">
                        <Tag className="h-2.5 w-2.5" /> {m.response.intentLabel}
                      </span>
                    </div>
                  )}

                  {/* Structured sections */}
                  {m.response?.sections.map((section, i) => (
                    <ResponseSectionView key={i} section={section} />
                  ))}

                  {/* Disclaimer */}
                  {m.response?.requiresDisclaimer && (
                    <p className="mt-2.5 text-[11px] text-navy-400 leading-relaxed">
                      Prototype/demo information — verify through official government portals before applying.
                    </p>
                  )}

                  {/* Follow-ups */}
                  {m.response?.followUps && m.response.followUps.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {m.response.followUps.map((f) => (
                        <button
                          key={f}
                          onClick={() => send(f)}
                          className="inline-flex items-center gap-1 rounded-full border border-navy-200 bg-white px-2.5 py-1 text-xs text-navy-600 hover:border-saffron-300 hover:bg-saffron-50 hover:text-saffron-700 transition-colors"
                        >
                          <Sparkles className="h-3 w-3 text-saffron-400" /> {f}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {typing && (
              <div className="flex gap-3">
                <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-saffron-400 to-saffron-600 text-white">
                  <Bot className="h-4 w-4" />
                </div>
                <div className="rounded-2xl rounded-tl-sm bg-navy-50 px-4 py-3">
                  <div className="flex gap-1">
                    {[0, 1, 2].map((d) => (
                      <span
                        key={d}
                        className="h-2 w-2 rounded-full bg-navy-300 animate-bounce"
                        style={{ animationDelay: `${d * 150}ms` }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>

          {/* Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="border-t border-navy-100 p-3 flex gap-2"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about a service, scheme, or civic issue…"
              className="flex-1 rounded-xl border border-navy-200 bg-white px-4 py-2.5 text-sm text-navy-800 placeholder:text-navy-400 focus:outline-none focus:ring-2 focus:ring-saffron-400 focus:border-saffron-400"
            />
            <button type="submit" className="btn-primary px-4" aria-label="Send" disabled={typing}>
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>

        {/* Sidebar */}
        <aside className="lg:col-span-4 space-y-4">
          <div className="card p-5">
            <h3 className="flex items-center gap-2 font-bold text-navy-900">
              <Sparkles className="h-4 w-4 text-saffron-500" /> Quick prompts
            </h3>
            <div className="mt-3 space-y-2">
              {quickPrompts.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="block w-full text-left rounded-xl border border-navy-100 bg-navy-50/40 px-3.5 py-2.5 text-sm text-navy-700 hover:border-saffron-200 hover:bg-saffron-50/50 transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="card p-5 bg-navy-900 text-white border-navy-800">
            <h3 className="flex items-center gap-2 font-bold">
              <ShieldCheck className="h-4 w-4 text-saffron-400" /> Trust & safety
            </h3>
            <ul className="mt-3 space-y-2 text-sm text-navy-200">
              <li className="flex gap-2"><span className="text-saffron-400">•</span> Smart Bharat is a prototype, not an official government service.</li>
              <li className="flex gap-2"><span className="text-saffron-400">•</span> I never guarantee scheme eligibility.</li>
              <li className="flex gap-2"><span className="text-saffron-400">•</span> I never fabricate complaint or application status.</li>
              <li className="flex gap-2"><span className="text-saffron-400">•</span> Always verify important info via official portals.</li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
