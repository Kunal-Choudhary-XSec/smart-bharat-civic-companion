import { useEffect, type ReactNode } from 'react';
import { Sparkles, X } from 'lucide-react';

interface ComingSoonProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  onClose?: () => void;
}

export function ComingSoon({ title, description, icon, onClose }: ComingSoonProps) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose?.();
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/50 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl animate-fade-up"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 inline-flex h-9 w-9 items-center justify-center rounded-full text-navy-400 hover:bg-navy-100 hover:text-navy-700 transition-colors"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>
        <div className="flex flex-col items-center text-center">
          <div className="relative mb-5">
            <div className="absolute inset-0 rounded-2xl bg-saffron-400/30 animate-pulse-ring" />
            <div className="relative inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-saffron-400 to-saffron-600 text-white shadow-lg">
              {icon ?? <Sparkles className="h-8 w-8" />}
            </div>
          </div>
          <span className="chip bg-saffron-50 text-saffron-700 mb-3">
            <Sparkles className="h-3.5 w-3.5" /> Coming Soon
          </span>
          <h3 className="text-xl font-bold text-navy-900">{title}</h3>
          {description && (
            <p className="mt-2 text-sm text-navy-600 leading-relaxed">{description}</p>
          )}
          <p className="mt-4 text-xs text-navy-400">
            This module is part of the Smart Bharat roadmap and will be available in a future release.
          </p>
        </div>
      </div>
    </div>
  );
}
