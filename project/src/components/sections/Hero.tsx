import { Sparkles, ArrowRight, Bot, ShieldCheck, Languages, Zap } from 'lucide-react';
import type { PageId } from '../../data/mockData';

interface HeroProps {
  onNavigate: (page: PageId) => void;
}

export function Hero({ onNavigate }: HeroProps) {
  return (
    <section className="relative overflow-hidden bg-navy-950 text-white">
      {/* Background layers */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-navy-950 via-navy-900 to-navy-950" />
        <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-saffron-500/20 blur-3xl" />
        <div className="absolute -bottom-32 -left-24 h-96 w-96 rounded-full bg-ashoka-500/15 blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />
      </div>

      <div className="relative container-page py-16 lg:py-24">
        <div className="grid items-center gap-12 lg:grid-cols-12">
          {/* Copy */}
          <div className="lg:col-span-7 animate-fade-up">
            <span className="inline-flex items-center gap-2 rounded-full border border-saffron-400/30 bg-saffron-500/10 px-3 py-1 text-xs font-semibold text-saffron-300">
              <Sparkles className="h-3.5 w-3.5" />
              AI-Powered Civic Companion
            </span>
            <h1 className="mt-5 text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.08]">
              Empowering Citizens.
              <br />
              <span className="bg-gradient-to-r from-saffron-300 via-saffron-400 to-saffron-500 bg-clip-text text-transparent">
                Simplifying Governance.
              </span>
            </h1>
            <p className="mt-5 max-w-xl text-base sm:text-lg text-navy-200 leading-relaxed">
              Your AI-powered civic companion for accessing government services, discovering
              schemes, reporting public issues, and receiving clear civic guidance.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => onNavigate('assistant')}
                className="btn-primary group text-base px-6 py-3.5"
              >
                <Bot className="h-5 w-5" />
                Ask AI Assistant
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </button>
              <button
                onClick={() => onNavigate('services')}
                className="btn bg-white/10 text-white border border-white/20 hover:bg-white/15 hover:border-white/30 px-6 py-3.5 text-base"
              >
                Explore Services
              </button>
            </div>

            {/* Trust strip */}
            <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-navy-300">
              <span className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-ashoka-400" /> Govt-verified info
              </span>
              <span className="flex items-center gap-2">
                <Languages className="h-4 w-4 text-saffron-400" /> 12+ languages
              </span>
              <span className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-saffron-400" /> Instant guidance
              </span>
            </div>
          </div>

          {/* Visual */}
          <div className="lg:col-span-5 animate-fade-up" style={{ animationDelay: '120ms' }}>
            <HeroVisual />
          </div>
        </div>
      </div>

      {/* Bottom wave */}
      <div className="relative">
        <svg viewBox="0 0 1440 80" className="block w-full h-12 sm:h-16" preserveAspectRatio="none">
          <path d="M0,80 C480,0 960,0 1440,80 L1440,80 L0,80 Z" fill="#f0f5fa" />
        </svg>
      </div>
    </section>
  );
}

function HeroVisual() {
  return (
    <div className="relative mx-auto max-w-sm">
      {/* Main card */}
      <div className="rounded-3xl bg-white/10 backdrop-blur-md border border-white/15 p-5 shadow-2xl">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="absolute inset-0 rounded-xl bg-saffron-400/40 animate-pulse-ring" />
            <div className="relative inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-saffron-400 to-saffron-600 text-white">
              <Bot className="h-6 w-6" />
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold text-white">Bharat AI</p>
            <p className="text-xs text-ashoka-300 flex items-center gap-1.5">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-ashoka-400" /> Online
            </p>
          </div>
        </div>

        <div className="mt-4 space-y-2.5">
          <div className="ml-auto max-w-[80%] rounded-2xl rounded-tr-sm bg-saffron-500 px-3.5 py-2 text-sm text-white">
            How do I apply for a birth certificate?
          </div>
          <div className="max-w-[88%] rounded-2xl rounded-tl-sm bg-white/15 px-3.5 py-2.5 text-sm text-navy-50">
            Here's a 3-step guide: 1) Visit your municipal portal, 2) upload ID & proof of birth,
            3) pay the fee and download. Want me to check required documents?
          </div>
          <div className="flex gap-2">
            <span className="chip bg-white/10 text-navy-100 border border-white/10">Birth Certificate</span>
            <span className="chip bg-white/10 text-navy-100 border border-white/10">Documents</span>
          </div>
        </div>
      </div>

      {/* Floating stat cards */}
      <div className="absolute -left-6 -bottom-6 rounded-2xl bg-white shadow-xl p-3.5 animate-float">
        <p className="text-2xl font-extrabold text-navy-900">1.2Cr+</p>
        <p className="text-xs text-navy-500">Citizens served</p>
      </div>
      <div
        className="absolute -right-4 -top-4 rounded-2xl bg-white shadow-xl p-3.5 animate-float"
        style={{ animationDelay: '1.5s' }}
      >
        <p className="text-2xl font-extrabold text-ashoka-600">340+</p>
        <p className="text-xs text-navy-500">Services covered</p>
      </div>
    </div>
  );
}
