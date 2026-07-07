import { useEffect } from 'react';
import { X, FileText, ListChecks, CheckCircle2, Building2, ShieldAlert } from 'lucide-react';
import type { Scheme } from '../../data/schemeData';
import { ELIGIBILITY_DISCLAIMER } from '../../data/schemeData';

interface SchemeDetailsModalProps {
  scheme: Scheme | null;
  onClose: () => void;
  onAskAi?: (scheme: Scheme) => void;
}

export function SchemeDetailsModal({ scheme, onClose, onAskAi }: SchemeDetailsModalProps) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    if (scheme) {
      window.addEventListener('keydown', onKey);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [scheme, onClose]);

  if (!scheme) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-navy-950/50 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`${scheme.name} details`}
    >
      <div
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl bg-white shadow-2xl animate-fade-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-start justify-between gap-3 bg-white/95 backdrop-blur px-6 py-4 border-b border-navy-100">
          <div>
            <span className="chip bg-saffron-50 text-saffron-700 mb-2">{scheme.category}</span>
            <h2 className="text-xl font-extrabold text-navy-900 leading-tight">{scheme.name}</h2>
            <p className="text-xs text-navy-500 mt-0.5">{scheme.ministry}</p>
          </div>
          <button
            onClick={onClose}
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-navy-400 hover:bg-navy-100 hover:text-navy-700 transition-colors"
            aria-label="Close details"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="px-6 py-5 space-y-5">
          <p className="text-sm text-navy-700 leading-relaxed">{scheme.shortDescription}</p>

          <Section title="Benefits" icon={<CheckCircle2 className="h-4 w-4 text-ashoka-600" />}>
            <p className="text-sm text-navy-700">{scheme.benefits}</p>
          </Section>

          <Section title="Intended beneficiaries" icon={<Building2 className="h-4 w-4 text-navy-600" />}>
            <p className="text-sm text-navy-700">{scheme.targetBeneficiaries}</p>
          </Section>

          <Section title="Basic eligibility" icon={<ListChecks className="h-4 w-4 text-saffron-600" />}>
            <ul className="space-y-1.5">
              {scheme.eligibilityCriteria.map((c, i) => (
                <li key={i} className="flex gap-2 text-sm text-navy-700">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-saffron-400" />
                  {c}
                </li>
              ))}
            </ul>
          </Section>

          <Section title="Required documents" icon={<FileText className="h-4 w-4 text-navy-600" />}>
            <div className="flex flex-wrap gap-1.5">
              {scheme.requiredDocuments.map((d, i) => (
                <span key={i} className="chip bg-navy-50 text-navy-700 border border-navy-100">{d}</span>
              ))}
            </div>
          </Section>

          <Section title="Application steps" icon={<ListChecks className="h-4 w-4 text-ashoka-600" />}>
            <ol className="space-y-2">
              {scheme.applicationSteps.map((s, i) => (
                <li key={i} className="flex gap-2.5 text-sm text-navy-700">
                  <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-saffron-100 text-saffron-700 text-[11px] font-bold">
                    {i + 1}
                  </span>
                  <span className="pt-0.5">{s}</span>
                </li>
              ))}
            </ol>
          </Section>

          <Section title="Official portal" icon={<Building2 className="h-4 w-4 text-navy-600" />}>
            <p className="text-sm text-navy-700 font-medium">{scheme.officialPortal}</p>
          </Section>

          {/* Disclaimer */}
          <div className="flex gap-2 rounded-xl bg-saffron-50 border border-saffron-100 px-3.5 py-3">
            <ShieldAlert className="h-4 w-4 shrink-0 text-saffron-600 mt-0.5" />
            <p className="text-xs text-saffron-800 leading-relaxed">{ELIGIBILITY_DISCLAIMER}</p>
          </div>

          {onAskAi && (
            <button
              onClick={() => onAskAi(scheme)}
              className="btn-primary w-full"
            >
              Ask Bharat AI about this scheme
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function Section({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-navy-400 mb-2">
        {icon} {title}
      </h3>
      {children}
    </div>
  );
}
