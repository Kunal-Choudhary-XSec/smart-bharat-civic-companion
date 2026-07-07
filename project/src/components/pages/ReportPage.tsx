import { useState } from 'react';
import {
  AlertTriangle,
  Camera,
  MapPin,
  Send,
  CheckCircle2,
  Sparkles,
  Building2,
  Clock,
  ShieldAlert,
  Phone,
  ListChecks,
  Loader2,
} from 'lucide-react';
import { PageHeader } from './ServicesPage';
import { PlaceholderMap } from '../ui/PlaceholderMap';
import {
  issueCategories,
  severityLevels,
  contactPreferences,
  categoryByValue,
  addComplaint,
  EMERGENCY_NUMBERS,
  type IssueCategory,
  type Severity,
  type ContactPreference,
  type Complaint,
} from '../../data/grievanceData';

export function ReportPage() {
  const [category, setCategory] = useState<IssueCategory>('Potholes');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [ward, setWard] = useState('');
  const [landmark, setLandmark] = useState('');
  const [severity, setSeverity] = useState<Severity>('Medium');
  const [contact, setContact] = useState<ContactPreference>('SMS');
  const [analyzing, setAnalyzing] = useState(false);
  const [submitted, setSubmitted] = useState<Complaint | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim() || !location.trim()) {
      setError('Please provide at least a description and a location.');
      return;
    }
    setError(null);
    setAnalyzing(true);
    // Simulate AI analysis delay
    setTimeout(() => {
      const complaint = addComplaint({
        category,
        description: description.trim(),
        location: location.trim(),
        ward: ward.trim(),
        landmark: landmark.trim(),
        severity,
        contactPreference: contact,
      });
      setAnalyzing(false);
      setSubmitted(complaint);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 1400);
  };

  const resetForm = () => {
    setSubmitted(null);
    setDescription('');
    setLocation('');
    setWard('');
    setLandmark('');
    setSeverity('Medium');
    setContact('SMS');
    setCategory('Potholes');
  };

  return (
    <div className="container-page py-12 lg:py-16">
      <PageHeader
        eyebrow="AI Civic Grievance"
        title="Report a Public Issue"
        description="Report civic problems in your area. Our AI analysis routes your complaint to the right department and estimates priority."
      />

      {submitted ? (
        <AnalysisResult complaint={submitted} onReset={resetForm} />
      ) : (
        <div className="mt-8 grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <form onSubmit={handleSubmit} className="card p-6 space-y-5">
              <Field label="Issue category" htmlFor="category">
                <select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value as IssueCategory)}
                  className="input"
                >
                  {issueCategories.map((c) => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>
              </Field>

              <Field label="Describe the issue" htmlFor="description">
                <textarea
                  id="description"
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="input resize-none"
                  placeholder="Provide details that help officials locate and fix the issue…"
                />
              </Field>

              <Field label="Location" htmlFor="location">
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-navy-400" />
                  <input
                    id="location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="input pl-9"
                    placeholder="e.g. Sector 12, New Delhi"
                  />
                </div>
              </Field>

              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Ward" htmlFor="ward">
                  <input
                    id="ward"
                    value={ward}
                    onChange={(e) => setWard(e.target.value)}
                    className="input"
                    placeholder="e.g. Ward 14"
                  />
                </Field>
                <Field label="Landmark" htmlFor="landmark">
                  <input
                    id="landmark"
                    value={landmark}
                    onChange={(e) => setLandmark(e.target.value)}
                    className="input"
                    placeholder="e.g. Near Govt School"
                  />
                </Field>
              </div>

              <Field label="Upload image (prototype only)">
                <button
                  type="button"
                  className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-navy-200 px-4 py-6 text-sm text-navy-500 hover:border-saffron-300 hover:bg-saffron-50/40 transition-colors"
                >
                  <Camera className="h-5 w-5" /> Tap to upload a photo (demo only)
                </button>
              </Field>

              <Field label="Severity">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {severityLevels.map((level) => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => setSeverity(level)}
                      className={`rounded-xl border px-3 py-2 text-sm font-medium transition-colors ${
                        severity === level
                          ? level === 'Critical'
                            ? 'border-red-400 bg-red-50 text-red-700'
                            : 'border-saffron-400 bg-saffron-50 text-saffron-700'
                          : 'border-navy-200 text-navy-600 hover:border-navy-300'
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </Field>

              <Field label="Contact preference">
                <div className="grid grid-cols-3 gap-2">
                  {contactPreferences.map((pref) => (
                    <button
                      key={pref}
                      type="button"
                      onClick={() => setContact(pref)}
                      className={`rounded-xl border px-3 py-2 text-sm font-medium transition-colors ${
                        contact === pref
                          ? 'border-navy-900 bg-navy-900 text-white'
                          : 'border-navy-200 text-navy-600 hover:border-navy-300'
                      }`}
                    >
                      {pref}
                    </button>
                  ))}
                </div>
              </Field>

              {error && (
                <p className="flex items-center gap-1.5 text-sm text-red-600">
                  <AlertTriangle className="h-4 w-4" /> {error}
                </p>
              )}

              <button type="submit" className="btn-primary w-full" disabled={analyzing}>
                {analyzing ? (
                  <><Loader2 className="h-4 w-4 animate-spin" /> AI analysing…</>
                ) : (
                  <><Send className="h-4 w-4" /> Submit & analyse</>
                )}
              </button>
            </form>
          </div>

          {/* Side info + map */}
          <aside className="lg:col-span-5 space-y-4">
            <PlaceholderMap location={location || 'Your reported location'} className="h-56" />
            <div className="card p-5 bg-saffron-50/50 border-saffron-100">
              <div className="flex items-center gap-2 text-saffron-700">
                <AlertTriangle className="h-5 w-5" />
                <h3 className="font-bold">Before you report</h3>
              </div>
              <ul className="mt-3 space-y-2 text-sm text-navy-600">
                <li>• Be specific about the location and landmark.</li>
                <li>• Add a clear photo if possible.</li>
                <li>• One issue per complaint helps faster resolution.</li>
                <li>• For emergencies, call 100 / 108 / 101.</li>
              </ul>
            </div>
            <div className="card p-5">
              <h3 className="font-bold text-navy-900">What happens next?</h3>
              <ol className="mt-3 space-y-3 text-sm text-navy-600">
                {[
                  'AI analyses your complaint and detects the category.',
                  'Complaint is routed to the suggested department.',
                  'You receive a complaint ID to track progress.',
                  'Track status in the Track Complaint section.',
                ].map((step, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-navy-900 text-white text-xs font-bold">
                      {i + 1}
                    </span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>
          </aside>
        </div>
      )}

      <style>{`
        .input {
          width: 100%;
          border-radius: 0.75rem;
          border: 1px solid #c3d8e9;
          background: white;
          padding: 0.625rem 0.875rem;
          font-size: 0.875rem;
          color: #1f374d;
        }
        .input:focus { outline: none; box-shadow: 0 0 0 2px #ff9a33; border-color: #ff9a33; }
      `}</style>
    </div>
  );
}

// ───────── AI Analysis Result ─────────

function AnalysisResult({ complaint, onReset }: { complaint: Complaint; onReset: () => void }) {
  const a = complaint.aiAnalysis;
  const meta = categoryByValue(a.detectedCategory);
  const Icon = meta.icon;

  return (
    <div className="mt-8 animate-fade-up">
      {/* Success header */}
      <div className="card p-6 sm:p-8 text-center">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-ashoka-50 text-ashoka-600 mx-auto">
          <CheckCircle2 className="h-8 w-8" />
        </div>
        <h3 className="mt-4 text-xl font-bold text-navy-900">Complaint submitted successfully</h3>
        <p className="mt-2 text-sm text-navy-600 max-w-md mx-auto">
          Your complaint has been logged and analysed by Bharat AI. Save your complaint ID to track progress.
        </p>
        <div className="mt-4 inline-flex items-center gap-2 rounded-xl bg-navy-900 px-4 py-2">
          <span className="text-xs text-navy-200">Complaint ID</span>
          <span className="font-mono font-bold text-white text-lg">{complaint.id}</span>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-12">
        {/* AI analysis */}
        <div className="lg:col-span-7 space-y-4">
          <div className="card p-6">
            <h3 className="flex items-center gap-2 font-bold text-navy-900">
              <Sparkles className="h-5 w-5 text-saffron-500" /> AI Analysis
            </h3>
            <p className="text-xs text-navy-400 mt-0.5">Prototype analysis — not an official assessment.</p>

            <div className="mt-4 grid sm:grid-cols-2 gap-4">
              <StatCard
                icon={<Icon className="h-5 w-5" />}
                label="Detected category"
                value={meta.label}
                accent="navy"
              />
              <StatCard
                icon={<Sparkles className="h-5 w-5" />}
                label="Confidence score"
                value={`${a.confidence}%`}
                accent="saffron"
              />
              <StatCard
                icon={<AlertTriangle className="h-5 w-5" />}
                label="Estimated priority"
                value={a.priority}
                accent={a.priority === 'Critical' ? 'red' : a.priority === 'High' ? 'saffron' : 'navy'}
              />
              <StatCard
                icon={<Clock className="h-5 w-5" />}
                label="Suggested response time"
                value={a.suggestedResponseTime}
                accent="navy"
              />
            </div>

            <div className="mt-4 rounded-xl bg-navy-50 border border-navy-100 px-4 py-3">
              <p className="flex items-center gap-2 text-sm text-navy-700">
                <Building2 className="h-4 w-4 text-navy-500" />
                <span className="font-semibold">Suggested department:</span> {a.suggestedDepartment}
              </p>
            </div>
          </div>

          {/* Next steps */}
          <div className="card p-6">
            <h3 className="flex items-center gap-2 font-bold text-navy-900">
              <ListChecks className="h-5 w-5 text-ashoka-600" /> Possible next steps
            </h3>
            <ul className="mt-3 space-y-2">
              {a.nextSteps.map((s, i) => (
                <li key={i} className="flex gap-2.5 text-sm text-navy-700">
                  <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-ashoka-100 text-ashoka-700 text-[11px] font-bold">
                    {i + 1}
                  </span>
                  {s}
                </li>
              ))}
            </ul>
          </div>

          {/* Safety precautions */}
          <div className="card p-6">
            <h3 className="flex items-center gap-2 font-bold text-navy-900">
              <ShieldAlert className="h-5 w-5 text-saffron-600" /> Safety precautions
            </h3>
            <ul className="mt-3 space-y-2">
              {a.safetyPrecautions.map((s, i) => (
                <li key={i} className="flex gap-2 text-sm text-navy-700">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-saffron-400" />
                  {s}
                </li>
              ))}
            </ul>
          </div>

          {/* Expected resolution */}
          <div className="card p-6">
            <h3 className="flex items-center gap-2 font-bold text-navy-900">
              <Clock className="h-5 w-5 text-navy-600" /> Expected resolution
            </h3>
            <p className="mt-2 text-sm text-navy-700 leading-relaxed">{a.expectedResolution}</p>
          </div>
        </div>

        {/* Sidebar: complaint summary + emergency */}
        <aside className="lg:col-span-5 space-y-4">
          <div className="card p-5">
            <h3 className="font-bold text-navy-900 mb-3">Complaint summary</h3>
            <dl className="space-y-2.5 text-sm">
              <SummaryRow label="Category" value={complaint.category} />
              <SummaryRow label="Severity" value={complaint.severity} />
              <SummaryRow label="Location" value={complaint.location} />
              {complaint.ward && <SummaryRow label="Ward" value={complaint.ward} />}
              {complaint.landmark && <SummaryRow label="Landmark" value={complaint.landmark} />}
              <SummaryRow label="Contact" value={complaint.contactPreference} />
              <SummaryRow label="Department" value={complaint.department} />
            </dl>
          </div>

          {a.showEmergency && (
            <div className="card p-5 bg-red-50 border-red-100">
              <h3 className="flex items-center gap-2 font-bold text-red-700">
                <Phone className="h-5 w-5" /> Emergency numbers
              </h3>
              <div className="mt-3 grid grid-cols-2 gap-2">
                {EMERGENCY_NUMBERS.map((e) => (
                  <div key={e.number} className="rounded-lg bg-white border border-red-100 px-3 py-2">
                    <p className="text-xs text-navy-500">{e.label}</p>
                    <p className="font-bold text-red-700">{e.number}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-col gap-2">
            <button onClick={onReset} className="btn-primary w-full">
              <Send className="h-4 w-4" /> Report another issue
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  accent: 'navy' | 'saffron' | 'red';
}) {
  const colors = {
    navy: 'bg-navy-50 text-navy-700',
    saffron: 'bg-saffron-50 text-saffron-700',
    red: 'bg-red-50 text-red-700',
  };
  return (
    <div className="rounded-xl border border-navy-100 p-4">
      <div className={`inline-flex h-9 w-9 items-center justify-center rounded-lg ${colors[accent]}`}>
        {icon}
      </div>
      <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-navy-400">{label}</p>
      <p className="text-base font-bold text-navy-900">{value}</p>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-3">
      <dt className="text-navy-500">{label}</dt>
      <dd className="font-medium text-navy-800 text-right">{value}</dd>
    </div>
  );
}

function Field({ label, children, htmlFor }: { label: string; children: React.ReactNode; htmlFor?: string }) {
  return (
    <label htmlFor={htmlFor} className="block">
      <span className="block text-sm font-semibold text-navy-800 mb-1.5">{label}</span>
      {children}
    </label>
  );
}
