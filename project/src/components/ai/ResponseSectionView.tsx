import { CheckCircle2, FileText, ListChecks, Info, Lightbulb, ShieldAlert } from 'lucide-react';
import type { ResponseSection } from '../../ai/types';

export function ResponseSectionView({ section }: { section: ResponseSection }) {
  switch (section.type) {
    case 'paragraph':
      return (
        <div className="mt-3">
          {section.title && (
            <p className="text-xs font-semibold uppercase tracking-wide text-navy-400 mb-1">{section.title}</p>
          )}
          <p className="text-sm text-navy-700 leading-relaxed">{section.text}</p>
        </div>
      );

    case 'list':
      return (
        <div className="mt-3">
          {section.title && (
            <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-navy-400 mb-1.5">
              <FileText className="h-3.5 w-3.5" /> {section.title}
            </p>
          )}
          <ul className="space-y-1.5">
            {section.items?.map((item, i) => (
              <li key={i} className="flex gap-2 text-sm text-navy-700">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-saffron-400" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      );

    case 'steps':
      return (
        <div className="mt-3">
          {section.title && (
            <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-navy-400 mb-1.5">
              <ListChecks className="h-3.5 w-3.5" /> {section.title}
            </p>
          )}
          <ol className="space-y-2">
            {section.items?.map((item, i) => (
              <li key={i} className="flex gap-2.5 text-sm text-navy-700">
                <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-saffron-100 text-saffron-700 text-[11px] font-bold">
                  {i + 1}
                </span>
                <span className="pt-0.5">{item}</span>
              </li>
            ))}
          </ol>
        </div>
      );

    case 'recommendations':
      return (
        <div className="mt-3">
          {section.title && (
            <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-navy-400 mb-1.5">
              <Lightbulb className="h-3.5 w-3.5" /> {section.title}
            </p>
          )}
          <div className="flex flex-wrap gap-1.5">
            {section.items?.map((item, i) => (
              <span key={i} className="chip bg-navy-50 text-navy-700 border border-navy-100">
                <CheckCircle2 className="h-3 w-3 text-ashoka-500" /> {item}
              </span>
            ))}
          </div>
        </div>
      );

    case 'notice':
      return (
        <div className="mt-3 flex gap-2 rounded-lg bg-saffron-50 border border-saffron-100 px-3 py-2">
          <ShieldAlert className="h-4 w-4 shrink-0 text-saffron-600 mt-0.5" />
          <p className="text-xs text-saffron-800 leading-relaxed">{section.text}</p>
        </div>
      );

    default:
      return section.text ? (
        <p className="mt-2 text-sm text-navy-700">
          <Info className="h-3.5 w-3.5 inline mr-1" />
          {section.text}
        </p>
      ) : null;
  }
}
