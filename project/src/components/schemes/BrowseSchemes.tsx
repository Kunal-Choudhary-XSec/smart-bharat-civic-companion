import { useMemo, useState } from 'react';
import { Search, X, ArrowRight, Filter, FileText } from 'lucide-react';
import { schemes, SCHEME_CATEGORIES, type Scheme, type SchemeCategory } from '../../data/schemeData';
import { SchemeDetailsModal } from './SchemeDetailsModal';

interface BrowseSchemesProps {
  onAskAi: (scheme: Scheme) => void;
}

export function BrowseSchemes({ onAskAi }: BrowseSchemesProps) {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<SchemeCategory | 'All'>('All');
  const [selected, setSelected] = useState<Scheme | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return schemes.filter((s) => {
      const matchesCategory = activeCategory === 'All' || s.category === activeCategory;
      const matchesQuery =
        !q ||
        s.name.toLowerCase().includes(q) ||
        s.shortDescription.toLowerCase().includes(q) ||
        s.searchKeywords.some((k) => k.includes(q));
      return matchesCategory && matchesQuery;
    });
  }, [query, activeCategory]);

  const hasFilters = query.trim() !== '' || activeCategory !== 'All';

  const clearFilters = () => {
    setQuery('');
    setActiveCategory('All');
  };

  return (
    <div>
      {/* Search + filters */}
      <div className="flex flex-col gap-3">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-navy-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search schemes by name, keyword, or benefit…"
            aria-label="Search schemes"
            className="w-full rounded-xl border border-navy-200 bg-white pl-10 pr-4 py-3 text-sm text-navy-800 placeholder:text-navy-400 focus:outline-none focus:ring-2 focus:ring-saffron-400 focus:border-saffron-400"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveCategory('All')}
            className={`chip border transition-colors ${
              activeCategory === 'All'
                ? 'bg-navy-900 text-white border-navy-900'
                : 'bg-white text-navy-700 border-navy-200 hover:border-navy-300'
            }`}
          >
            All
          </button>
          {SCHEME_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`chip border transition-colors ${
                activeCategory === cat
                  ? 'bg-navy-900 text-white border-navy-900'
                  : 'bg-white text-navy-700 border-navy-200 hover:border-navy-300'
              }`}
            >
              {cat}
            </button>
          ))}
          {hasFilters && (
            <button
              onClick={clearFilters}
              className="chip border border-saffron-200 bg-saffron-50 text-saffron-700 hover:bg-saffron-100 transition-colors ml-auto"
            >
              <X className="h-3.5 w-3.5" /> Clear filters
            </button>
          )}
        </div>

        <p className="text-sm text-navy-500">
          Showing <span className="font-semibold text-navy-800">{filtered.length}</span> of {schemes.length} schemes
        </p>
      </div>

      {/* Results */}
      {filtered.length === 0 ? (
        <div className="mt-8 card p-10 text-center">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-navy-50 text-navy-400 mb-3">
            <Filter className="h-7 w-7" />
          </div>
          <h3 className="text-lg font-bold text-navy-900">No schemes match your search</h3>
          <p className="mt-1.5 text-sm text-navy-500 max-w-sm mx-auto">
            Try a different keyword or clear the filters to see all available schemes.
          </p>
          <button onClick={clearFilters} className="btn-secondary mt-4">
            <X className="h-4 w-4" /> Clear filters
          </button>
        </div>
      ) : (
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((scheme, i) => (
            <article
              key={scheme.id}
              className="card card-hover group p-5 animate-fade-up flex flex-col"
              style={{ animationDelay: `${Math.min(i, 8) * 50}ms` }}
            >
              <div className="flex items-center justify-between">
                <span className="chip bg-saffron-50 text-saffron-700">{scheme.category}</span>
                <FileText className="h-4 w-4 text-navy-300" />
              </div>
              <h3 className="mt-3 font-bold text-lg text-navy-900 group-hover:text-saffron-700 transition-colors">
                {scheme.name}
              </h3>
              <p className="mt-1.5 text-sm text-navy-500 leading-relaxed">{scheme.shortDescription}</p>
              <p className="mt-3 text-xs text-navy-400">
                <span className="font-semibold uppercase tracking-wide">For:</span> {scheme.targetBeneficiaries}
              </p>
              <div className="mt-auto pt-4">
                <button
                  onClick={() => setSelected(scheme)}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-navy-700 hover:text-saffron-600 transition-colors"
                >
                  View details
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      <SchemeDetailsModal scheme={selected} onClose={() => setSelected(null)} onAskAi={onAskAi} />
    </div>
  );
}
