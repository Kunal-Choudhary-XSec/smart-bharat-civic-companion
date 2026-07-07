import { useState } from 'react';
import { List, Sparkles } from 'lucide-react';
import { PageHeader } from './ServicesPage';
import { BrowseSchemes } from '../schemes/BrowseSchemes';
import { FindSchemes } from '../schemes/FindSchemes';
import type { Scheme } from '../../data/schemeData';

type Mode = 'browse' | 'find';

interface SchemesPageProps {
  onAskAi: (scheme: Scheme) => void;
}

export function SchemesPage({ onAskAi }: SchemesPageProps) {
  const [mode, setMode] = useState<Mode>('browse');

  return (
    <div className="container-page py-12 lg:py-16">
      <PageHeader
        eyebrow="Welfare Schemes"
        title="Government Scheme Finder"
        description="Browse all central government welfare schemes, or answer a few questions to find schemes that may be relevant to you."
      />

      {/* Mode switcher */}
      <div className="mt-8 inline-flex rounded-xl border border-navy-200 bg-white p-1 shadow-sm">
        <button
          onClick={() => setMode('browse')}
          className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
            mode === 'browse' ? 'bg-navy-900 text-white' : 'text-navy-600 hover:text-navy-900'
          }`}
        >
          <List className="h-4 w-4" /> Browse All Schemes
        </button>
        <button
          onClick={() => setMode('find')}
          className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
            mode === 'find' ? 'bg-saffron-500 text-white' : 'text-navy-600 hover:text-navy-900'
          }`}
        >
          <Sparkles className="h-4 w-4" /> Find Schemes for Me
        </button>
      </div>

      <div className="mt-8">
        {mode === 'browse' ? <BrowseSchemes onAskAi={onAskAi} /> : <FindSchemes onAskAi={onAskAi} />}
      </div>
    </div>
  );
}
