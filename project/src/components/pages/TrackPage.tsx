import { useState } from 'react';
import {
  Search,
  Clock,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Sparkles,
  ShieldAlert,
  Phone,
  ListChecks,
  Building2,
} from 'lucide-react';
import { PageHeader } from './ServicesPage';
import { PlaceholderMap } from '../ui/PlaceholderMap';
import {
  getComplaintById,
  getAllComplaints,
  timelineStages,
  categoryByValue,
  EMERGENCY_NUMBERS,
  type Complaint,
  type ComplaintStatus,
} from '../../data/grievanceData';

export function TrackPage() {
  const [query, setQuery] = useState('');
  const [found, setFound] = useState<Complaint | null>(null);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    if (!q) {
      setError('Please enter a complaint ID.');
      return;
    }
    setError(null);
    const result = getComplaintById(q);
    if (result) {
      setFound(result);
      setSearched(true);
    } else {
      setFound(null);
      setSearched(true);
    }
  };

  const recent = getAllComplaints().slice(0, 3);

  return (
    <div className="container-page py-12 lg:py-16">
      <PageHeader
        eyebrow="Grievance Status"
        title="Track Your Complaint"
        description="Enter your complaint ID to see the live status, timeline, and AI suggestions for your reported issue."
      />

      <form onSubmit={onSearch} className="mt-8 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-navy-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter complaint ID (e.g. SB-2026-1001)"
            aria-label="Complaint ID"
            className="w-full rounded-xl border border-navy-200 bg-white pl-10 pr-4 py-3 text-sm text-navy-800 placeholder:text-navy-400 focus:outline-none focus:ring-2 focus:ring-saffron-400 focus:border-saffron-400"
          />
        </div>
        <button type="submit" className="btn-primary">Track now</button>
      </form>

      {error && (
        <p className="mt-3 flex items-center gap-1.5 text-sm text-red-600">
          <AlertTriangle className="h-4 w-4" /> {error}
        </p>
      )}

      {/* Not found */}
      {searched && !found && !error && (
        <div className="mt-8 card p-10 text-center">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-navy-50 text-navy-400 mb-3">
            <AlertCircle className="h-7 w-7" />
          </div>
          <h3 className="text-lg font-bold text-navy-900">Complaint not found</h3>
          <p className="mt-1.5 text-sm text-navy-500 max-w-sm mx-auto">
            No complaint matches ID "{query}". Check the ID and try again, or try one of the recent complaints below.
          </p>
        </div>
      )}

      {/* Result */}
      {found && <ComplaintDetail complaint={found} />}

      {/* Recent complaints (when nothing searched yet) */}
      {!searched && recent.length > 0 && (
        <div className="mt-10">
          <h3 className="text-sm font-bold text-navy-900 mb-3">Recent complaints</h3>
          <div className="space-y-3">
            {recent.map((c) => (
              <button
                key={c.id}
                onClick={() => {
                  setQuery(c.id);
                  setFound(c);
                  setSearched(true);
                }}
                className="card card-hover w-full p-4 text-left flex items-center justify-between gap-3"
              >
                <div>
                  <p className="font-semibold text-navy-900">{c.category}</p>
                  <p className="text-xs text-navy-500">{c.location} · {c.department}</p>
                </div>
                <div className="text-right">
                  <p className="font-mono text-xs text-navy-700">{c.id}</p>
                  <p className="text-xs text-navy-400">{c.status}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ComplaintDetail({ complaint }: { complaint: Complaint }) {
  const a = complaint.aiAnalysis;
  const meta = categoryByValue(complaint.category);
  const Icon = meta.icon;
  const currentStageIndex = timelineStages.indexOf(complaint.status);

  return (
    <div className="mt-8 animate-fade-up">
      {/* Header card */}
      <div className="card p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-saffron-50 text-saffron-600">
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-bold text-navy-900">{complaint.category}</h3>
                <span className="chip bg-navy-50 text-navy-700 border border-navy-100">{complaint.status}</span>
                <span className={`chip border ${
                  complaint.severity === 'Critical' ? 'bg-red-50 text-red-700 border-red-100'
                  : complaint.severity === 'High' ? 'bg-saffron-50 text-saffron-700 border-saffron-100'
                  : 'bg-navy-50 text-navy-600 border-navy-100'
                }`}>{complaint.severity}</span>
              </div>
              <p className="text-sm text-navy-500 mt-0.5">{complaint.location}{complaint.ward ? ` · ${complaint.ward}` : ''}</p>
              <p className="text-xs text-navy-400 mt-1 flex items-center gap-1.5">
                <Clock className="h-3 w-3" /> Filed {formatDate(complaint.createdAt)} · {complaint.department}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-navy-400">Complaint ID</p>
            <p className="font-mono font-bold text-navy-800 text-lg">{complaint.id}</p>
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-12">
        {/* Timeline */}
        <div className="lg:col-span-7">
          <div className="card p-6">
            <h3 className="font-bold text-navy-900 mb-5">Complaint timeline</h3>
            <Timeline stages={timelineStages} currentIndex={currentStageIndex} />
          </div>

          {/* AI suggestions */}
          <div className="card p-6 mt-4">
            <h3 className="flex items-center gap-2 font-bold text-navy-900">
              <Sparkles className="h-5 w-5 text-saffron-500" /> AI suggestions
            </h3>
            <p className="text-xs text-navy-400 mt-0.5">Prototype guidance — not an official assessment.</p>

            <div className="mt-4">
              <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-ashoka-600 mb-2">
                <ListChecks className="h-3.5 w-3.5" /> Possible next steps
              </p>
              <ul className="space-y-1.5">
                {a.nextSteps.map((s, i) => (
                  <li key={i} className="flex gap-2 text-sm text-navy-700">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-ashoka-400" />
                    {s}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-4">
              <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-saffron-600 mb-2">
                <ShieldAlert className="h-3.5 w-3.5" /> Safety precautions
              </p>
              <ul className="space-y-1.5">
                {a.safetyPrecautions.map((s, i) => (
                  <li key={i} className="flex gap-2 text-sm text-navy-700">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-saffron-400" />
                    {s}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-4 rounded-lg bg-navy-50 border border-navy-100 px-3.5 py-2.5">
              <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-navy-500 mb-1">
                <Clock className="h-3.5 w-3.5" /> Expected resolution
              </p>
              <p className="text-sm text-navy-700">{a.expectedResolution}</p>
            </div>

            {a.showEmergency && (
              <div className="mt-4 rounded-lg bg-red-50 border border-red-100 px-3.5 py-3">
                <p className="flex items-center gap-1.5 text-sm font-bold text-red-700 mb-2">
                  <Phone className="h-4 w-4" /> Emergency numbers
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {EMERGENCY_NUMBERS.map((e) => (
                    <div key={e.number} className="rounded-lg bg-white border border-red-100 px-2.5 py-1.5 text-center">
                      <p className="text-[10px] text-navy-500">{e.label}</p>
                      <p className="font-bold text-red-700 text-sm">{e.number}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <aside className="lg:col-span-5 space-y-4">
          <PlaceholderMap location={complaint.location} className="h-48" />

          <div className="card p-5">
            <h3 className="font-bold text-navy-900 mb-3">Complaint details</h3>
            <dl className="space-y-2.5 text-sm">
              <Row label="Category" value={complaint.category} />
              <Row label="Severity" value={complaint.severity} />
              <Row label="Location" value={complaint.location} />
              {complaint.ward && <Row label="Ward" value={complaint.ward} />}
              {complaint.landmark && <Row label="Landmark" value={complaint.landmark} />}
              <Row label="Department" value={complaint.department} />
              <Row label="Contact" value={complaint.contactPreference} />
            </dl>
          </div>

          <div className="card p-5">
            <h3 className="flex items-center gap-2 font-bold text-navy-900 mb-3">
              <Sparkles className="h-4 w-4 text-saffron-500" /> AI analysis
            </h3>
            <dl className="space-y-2.5 text-sm">
              <Row label="Detected category" value={a.detectedCategory} />
              <Row label="Confidence" value={`${a.confidence}%`} />
              <Row label="Priority" value={a.priority} />
              <Row label="Response time" value={a.suggestedResponseTime} />
            </dl>
            <p className="mt-3 flex items-start gap-1.5 text-xs text-navy-400">
              <Building2 className="h-3.5 w-3.5 mt-0.5 shrink-0" /> Routed to {a.suggestedDepartment}
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Timeline({ stages, currentIndex }: { stages: ComplaintStatus[]; currentIndex: number }) {
  return (
    <ol className="relative">
      {/* vertical line */}
      <div className="absolute left-[15px] top-2 bottom-2 w-0.5 bg-navy-100" />
      {stages.map((stage, i) => {
        const done = i <= currentIndex;
        const current = i === currentIndex;
        return (
          <li key={stage} className="relative flex items-start gap-4 pb-6 last:pb-0">
            <div className={`relative z-10 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full ring-4 ring-white transition-colors ${
              done ? 'bg-ashoka-500 text-white' : 'bg-navy-100 text-navy-400'
            } ${current ? 'ring-saffron-200' : ''}`}>
              {done ? <CheckCircle2 className="h-4 w-4" /> : <span className="text-[11px] font-bold">{i + 1}</span>}
            </div>
            <div className="pt-1">
              <p className={`text-sm font-semibold ${done ? 'text-navy-900' : 'text-navy-400'}`}>
                {stage}
                {current && <span className="ml-2 chip bg-saffron-50 text-saffron-700 text-[10px]">Current</span>}
              </p>
              <p className="text-xs text-navy-400 mt-0.5">
                {done ? 'Completed' : 'Pending'}
              </p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-3">
      <dt className="text-navy-500">{label}</dt>
      <dd className="font-medium text-navy-800 text-right">{value}</dd>
    </div>
  );
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}
