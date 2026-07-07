import { useEffect, useRef, useState } from 'react';
import { ChevronDown, Globe, Menu, X, Bot } from 'lucide-react';
import { Logo } from './ui/Logo';
import { navItems, languages, type PageId } from '../data/mockData';

interface NavbarProps {
  active: PageId;
  onNavigate: (page: PageId) => void;
}

export function Navbar({ active, onNavigate }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [lang, setLang] = useState(languages[0]);
  const langRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) setLangOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const go = (page: PageId) => {
    onNavigate(page);
    setMobileOpen(false);
  };

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'bg-white/90 backdrop-blur-md shadow-sm border-b border-navy-100'
          : 'bg-white/70 backdrop-blur-sm border-b border-transparent'
      }`}
    >
      {/* Top utility bar */}
      <div className="hidden md:block bg-navy-900 text-navy-100 text-xs">
        <div className="container-page flex items-center justify-between py-1.5">
          <p className="flex items-center gap-1.5">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-ashoka-400" />
            Government of India · Digital India Initiative
          </p>
          <div className="flex items-center gap-4">
            <span>Helpline: 14434</span>
            <span className="text-navy-400">|</span>
            <span>A+ A A−</span>
          </div>
        </div>
      </div>

      <nav className="container-page flex items-center justify-between h-16 lg:h-18">
        <button onClick={() => go('home')} className="shrink-0" aria-label="Smart Bharat home">
          <Logo size="md" />
        </button>

        {/* Desktop nav */}
        <ul className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = active === item.id;
            const isAi = item.id === 'assistant';
            return (
              <li key={item.id}>
                <button
                  onClick={() => go(item.id)}
                  className={`relative inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? 'text-saffron-700'
                      : isAi
                      ? 'text-navy-800'
                      : 'text-navy-700 hover:text-navy-900 hover:bg-navy-50'
                  }`}
                >
                  {isAi && <Bot className="h-4 w-4 text-saffron-500" />}
                  {item.label}
                  {isActive && (
                    <span className="absolute -bottom-px left-3 right-3 h-0.5 rounded-full bg-saffron-500" />
                  )}
                </button>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-2">
          {/* Language selector */}
          <div className="relative" ref={langRef}>
            <button
              onClick={() => setLangOpen((v) => !v)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-navy-200 bg-white px-2.5 py-2 text-sm font-medium text-navy-700 hover:border-navy-300 hover:bg-navy-50 transition-colors"
              aria-label="Select language"
            >
              <Globe className="h-4 w-4 text-navy-500" />
              <span className="hidden sm:inline">{lang.label}</span>
              <ChevronDown className={`h-3.5 w-3.5 transition-transform ${langOpen ? 'rotate-180' : ''}`} />
            </button>
            {langOpen && (
              <div className="absolute right-0 mt-2 w-44 rounded-xl border border-navy-100 bg-white p-1.5 shadow-lg animate-fade-up">
                <p className="px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-navy-400">
                  Select Language
                </p>
                <div className="max-h-72 overflow-y-auto">
                  {languages.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => {
                        setLang(l);
                        setLangOpen(false);
                      }}
                      className={`flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-sm transition-colors ${
                        l.code === lang.code
                          ? 'bg-saffron-50 text-saffron-700 font-semibold'
                          : 'text-navy-700 hover:bg-navy-50'
                      }`}
                    >
                      {l.label}
                      {l.code === lang.code && <span className="h-1.5 w-1.5 rounded-full bg-saffron-500" />}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="lg:hidden inline-flex h-10 w-10 items-center justify-center rounded-lg text-navy-700 hover:bg-navy-100"
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-navy-100 bg-white animate-fade-in">
          <ul className="container-page py-3 space-y-1">
            {navItems.map((item) => {
              const isActive = active === item.id;
              return (
                <li key={item.id}>
                  <button
                    onClick={() => go(item.id)}
                    className={`flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                      isActive ? 'bg-saffron-50 text-saffron-700' : 'text-navy-700 hover:bg-navy-50'
                    }`}
                  >
                    {item.id === 'assistant' && <Bot className="h-4 w-4 text-saffron-500" />}
                    {item.label}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </header>
  );
}
