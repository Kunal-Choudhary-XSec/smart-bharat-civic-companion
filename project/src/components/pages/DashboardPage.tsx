import {
  ClipboardList,
  CheckCircle2,
  Clock,
  Loader2,
  ArrowRight,
  FileText,
} from 'lucide-react';
import { PageHeader } from './ServicesPage';
import {
  getDashboardStats,
  getRecentComplaints,
  categoryByValue,
} from '../../data/grievanceData';
import type { PageId } from '../../data/mockData';
import type { LucideIcon } from 'lucide-react';

interface DashboardPageProps {
  onNavigate: (page: PageId) => void;
}

export function DashboardPage({ onNavigate }: DashboardPageProps) {
  const stats = getDashboardStats();
  const recent = getRecentComplaints(5);

  const statCards: { label: string; value: number; icon: LucideIcon; color: string; bg: string }[] = [
    { label: 'Total Complaints', value: stats.total, icon: ClipboardList, color: 'text-navy-700', bg: 'bg-navy-50' },
    { label: 'Resolved', value: stats.resolved, icon: CheckCircle2, color: 'text-ashoka-600', bg: 'bg-ashoka-50' },
    { label: 'In Progress', value: stats.inProgress, icon: Loader2, color: 'text-saffron-600', bg: 'bg-saffron-50' },
    { label: 'Pending', value: stats.pending, icon: Clock, color: 'text-navy-600', bg: 'bg-navy-100' },
  ];

  return (
    <div className="container-page py-12 lg:py-16">
      <PageHeader
        eyebrow="Citizen Dashboard"
        title="My Complaints Dashboard"
        description="An overview of all civic complaints you have filed through Smart Bharat."
      />

      {/* Stats */}
      <div className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((s) => (
          <div key={s.label} className="card p-5 animate-fade-up">
            <div className={`inline-flex h-10 w-10 items-center justify-center rounded-xl ${s.bg} ${s.color}`}>
              <s.icon className="h-5 w-5" />
            </div>
            <p className="mt-3 text-3xl font-extrabold text-navy-900">{s.value}</p>
            <p className="text-sm text-navy-500">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Recent complaints */}
      <div className="mt-8 flex items-center justify-between">
        <h3 className="text-lg font-bold text-navy-900">Recent complaints</h3>
        <button onClick={() => onNavigate('track')} className="btn-ghost text-sm">
          Track a complaint <ArrowRight className="h-4 w-4" />
        </button>
      </div>

      {recent.length === 0 ? (
        <div className="mt-4 card p-10 text-center">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-navy-50 text-navy-400 mb-3">
            <FileText className="h-7 w-7" />
          </div>
          <h3 className="text-lg font-bold text-navy-900">No complaints yet</h3>
          <p className="mt-1.5 text-sm text-navy-500 max-w-sm mx-auto">
            When you report an issue, it will appear here so you can track its progress.
          </p>
          <button onClick={() => onNavigate('report')} className="btn-primary mt-4">
            Report an issue
          </button>
        </div>
      ) : (
        <div className="mt-4 space-y-3">
          {recent.map((c, i) => {
            const meta = categoryByValue(c.category);
            const Icon = meta.icon;
            return (
              <button
                key={c.id}
                onClick={() => onNavigate('track')}
                className="card card-hover w-full p-4 text-left animate-fade-up"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-saffron-50 text-saffron-600">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-semibold text-navy-900">{c.category}</p>
                      <p className="text-xs text-navy-500">{c.location} · {c.department}</p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className={`chip ${
                      c.status === 'Resolved' ? 'bg-ashoka-50 text-ashoka-700'
                      : c.status === 'Work Started' || c.status === 'Under Review' ? 'bg-saffron-50 text-saffron-700'
                      : 'bg-navy-50 text-navy-600'
                    }`}>{c.status}</span>
                    <p className="font-mono text-xs text-navy-500 mt-1">{c.id}</p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* Quick actions */}
      <div className="mt-8 flex flex-wrap gap-3">
        <button onClick={() => onNavigate('report')} className="btn-primary">
          Report new issue
        </button>
        <button onClick={() => onNavigate('track')} className="btn-secondary">
          Track a complaint
        </button>
      </div>
    </div>
  );
}
