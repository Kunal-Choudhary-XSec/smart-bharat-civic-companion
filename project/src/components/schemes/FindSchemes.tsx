import { useState } from 'react';
import {
  ArrowRight,
  ArrowLeft,
  Check,
  Sparkles,
  RotateCcw,
  User,
  AlertTriangle,
  Wand2,
  ShieldAlert,
  Bot,
  FileText,
} from 'lucide-react';
import {
  schemes as allSchemes,
  type CitizenProfile,
  type AgeGroup,
  type ResidenceArea,
  type Occupation,
  type IncomeRange,
  type ProfileCondition,
  type Scheme,
  ELIGIBILITY_DISCLAIMER,
} from '../../data/schemeData';
import {
  recommendSchemes,
  isProfileComplete,
  profileCompleteness,
  AGE_LABELS,
  AREA_LABELS,
  OCCUPATION_LABELS,
  INCOME_LABELS,
  CONDITION_LABELS,
  type SchemeRecommendation,
} from '../../ai/eligibilityEngine';
import { SchemeDetailsModal } from './SchemeDetailsModal';

const TOTAL_STEPS = 6;

const ageOptions: { value: AgeGroup; label: string; hint: string }[] = [
  { value: 'under_18', label: 'Under 18', hint: 'Minor' },
  { value: '18_35', label: '18–35', hint: 'Young adult' },
  { value: '36_60', label: '36–60', hint: 'Working age' },
  { value: 'above_60', label: 'Above 60', hint: 'Senior citizen' },
];

const areaOptions: { value: ResidenceArea; label: string }[] = [
  { value: 'rural', label: 'Rural' },
  { value: 'urban', label: 'Urban' },
];

const occupationOptions: { value: Occupation; label: string }[] = [
  { value: 'student', label: 'Student' },
  { value: 'farmer', label: 'Farmer' },
  { value: 'salaried_employee', label: 'Salaried Employee' },
  { value: 'self_employed', label: 'Self-Employed' },
  { value: 'unemployed', label: 'Unemployed' },
  { value: 'homemaker', label: 'Homemaker' },
  { value: 'senior_citizen', label: 'Senior Citizen' },
  { value: 'other', label: 'Other' },
];

const incomeOptions: { value: IncomeRange; label: string }[] = [
  { value: 'below_1l', label: 'Below ₹1 lakh' },
  { value: '1l_3l', label: '₹1–3 lakh' },
  { value: '3l_6l', label: '₹3–6 lakh' },
  { value: '6l_10l', label: '₹6–10 lakh' },
  { value: 'above_10l', label: 'Above ₹10 lakh' },
];

const conditionOptions: { value: ProfileCondition; label: string }[] = [
  { value: 'woman', label: 'Woman' },
  { value: 'student', label: 'Student' },
  { value: 'farmer', label: 'Farmer' },
  { value: 'senior_citizen', label: 'Senior Citizen' },
  { value: 'person_with_disability', label: 'Person with Disability' },
  { value: 'has_girl_child', label: 'Has a girl child' },
  { value: 'needs_housing', label: 'Looking for housing support' },
  { value: 'needs_skill_training', label: 'Looking for skill training' },
  { value: 'needs_small_business_support', label: 'Looking to start/grow a small business' },
  { value: 'none', label: 'None of these' },
];

const states = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Delhi (NCT)', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh',
  'Jammu & Kashmir', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh',
  'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland',
  'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Chandigarh', 'Puducherry', 'Andaman & Nicobar', 'Dadra & Nagar Haveli and Daman & Diu',
  'Ladakh', 'Lakshadweep',
];

const DEMO_PROFILE: CitizenProfile = {
  ageGroup: '36_60',
  state: 'Uttar Pradesh',
  area: 'rural',
  occupation: 'farmer',
  income: '1l_3l',
  conditions: ['farmer', 'woman', 'has_girl_child'],
};

interface FindSchemesProps {
  onAskAi: (scheme: Scheme) => void;
}

export function FindSchemes({ onAskAi }: FindSchemesProps) {
  const [step, setStep] = useState(0); // 0..5 questionnaire, 6 = results
  const [profile, setProfile] = useState<CitizenProfile>({
    ageGroup: null,
    state: '',
    area: null,
    occupation: null,
    income: null,
    conditions: [],
  });
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<SchemeRecommendation[] | null>(null);
  const [computing, setComputing] = useState(false);
  const [selectedScheme, setSelectedScheme] = useState<Scheme | null>(null);

  const update = <K extends keyof CitizenProfile>(key: K, value: CitizenProfile[K]) => {
    setProfile((p) => ({ ...p, [key]: value }));
    setError(null);
  };

  const toggleCondition = (c: ProfileCondition) => {
    setProfile((p) => {
      if (c === 'none') return { ...p, conditions: ['none'] };
      const withoutNone = p.conditions.filter((x) => x !== 'none');
      const has = withoutNone.includes(c);
      return { ...p, conditions: has ? withoutNone.filter((x) => x !== c) : [...withoutNone, c] };
    });
    setError(null);
  };

  const canProceed = (): boolean => {
    switch (step) {
      case 0: return profile.ageGroup !== null;
      case 1: return profile.state !== '';
      case 2: return profile.area !== null;
      case 3: return profile.occupation !== null;
      case 4: return profile.income !== null;
      case 5: return profile.conditions.length > 0;
      default: return false;
    }
  };

  const next = () => {
    if (!canProceed()) {
      setError('Please select an option to continue.');
      return;
    }
    if (step < TOTAL_STEPS - 1) {
      setStep((s) => s + 1);
    } else {
      submit();
    }
  };

  const back = () => {
    setError(null);
    if (step > 0) setStep((s) => s - 1);
  };

  const submit = () => {
    if (!isProfileComplete(profile) && profile.conditions.length === 0) {
      setError('Please complete the questionnaire before viewing recommendations.');
      return;
    }
    setComputing(true);
    setError(null);
    // simulate brief processing for UX
    setTimeout(() => {
      try {
        const recs = recommendSchemes(profile, allSchemes);
        setResults(recs);
        setStep(TOTAL_STEPS);
      } catch {
        setError('Something went wrong while calculating recommendations. Please try again.');
      } finally {
        setComputing(false);
      }
    }, 500);
  };

  const loadDemo = () => {
    setProfile({ ...DEMO_PROFILE });
    setComputing(true);
    setError(null);
    setTimeout(() => {
      try {
        const recs = recommendSchemes({ ...DEMO_PROFILE }, allSchemes);
        setResults(recs);
        setStep(TOTAL_STEPS);
      } catch {
        setError('Something went wrong while calculating recommendations. Please try again.');
      } finally {
        setComputing(false);
      }
    }, 500);
  };

  const restart = () => {
    setStep(0);
    setResults(null);
    setError(null);
    setProfile({ ageGroup: null, state: '', area: null, occupation: null, income: null, conditions: [] });
  };

  // Results view
  if (step === TOTAL_STEPS && results) {
    return (
      <ResultsView
        profile={profile}
        results={results}
        onRestart={restart}
        onAskAi={onAskAi}
        onViewDetails={setSelectedScheme}
      />
    );
  }

  const completeness = profileCompleteness(profile);

  return (
    <div className="max-w-2xl mx-auto">
      {/* Demo button */}
      <div className="flex justify-end mb-4">
        <button onClick={loadDemo} className="btn-secondary" disabled={computing}>
          <Wand2 className="h-4 w-4 text-saffron-500" /> Try Demo Profile
        </button>
      </div>

      {/* Progress */}
      <div className="mb-6">
        <div className="flex items-center justify-between text-xs font-medium text-navy-500 mb-2">
          <span>Step {step + 1} of {TOTAL_STEPS}</span>
          <span>{Math.round(((step + 1) / TOTAL_STEPS) * 100)}% complete</span>
        </div>
        <div className="h-1.5 rounded-full bg-navy-100 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-saffron-400 to-saffron-600 transition-all duration-300"
            style={{ width: `${((step + 1) / TOTAL_STEPS) * 100}%` }}
          />
        </div>
      </div>

      {/* Step card */}
      <div className="card p-6 sm:p-8">
        {computing ? (
          <ComputingState />
        ) : (
          <>
            {step === 0 && (
              <StepLayout title="What is your age group?" subtitle="This helps match schemes with age-related criteria.">
                <div className="grid grid-cols-2 gap-3">
                  {ageOptions.map((o) => (
                    <OptionCard
                      key={o.value}
                      label={o.label}
                      hint={o.hint}
                      selected={profile.ageGroup === o.value}
                      onClick={() => update('ageGroup', o.value)}
                    />
                  ))}
                </div>
              </StepLayout>
            )}

            {step === 1 && (
              <StepLayout title="Which State or Union Territory do you live in?" subtitle="Some schemes have state-specific criteria.">
                <label htmlFor="state-select" className="sr-only">State or Union Territory</label>
                <select
                  id="state-select"
                  value={profile.state}
                  onChange={(e) => update('state', e.target.value)}
                  className="w-full rounded-xl border border-navy-200 bg-white px-4 py-3 text-sm text-navy-800 focus:outline-none focus:ring-2 focus:ring-saffron-400 focus:border-saffron-400"
                >
                  <option value="">Select your state / UT…</option>
                  {states.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </StepLayout>
            )}

            {step === 2 && (
              <StepLayout title="Where do you live?" subtitle="Some schemes are designed for rural or urban residents.">
                <div className="grid grid-cols-2 gap-3">
                  {areaOptions.map((o) => (
                    <OptionCard
                      key={o.value}
                      label={o.label}
                      selected={profile.area === o.value}
                      onClick={() => update('area', o.value)}
                    />
                  ))}
                </div>
              </StepLayout>
            )}

            {step === 3 && (
              <StepLayout title="What is your occupation?" subtitle="This helps match occupation-specific schemes.">
                <div className="grid grid-cols-2 gap-3">
                  {occupationOptions.map((o) => (
                    <OptionCard
                      key={o.value}
                      label={o.label}
                      selected={profile.occupation === o.value}
                      onClick={() => update('occupation', o.value)}
                    />
                  ))}
                </div>
              </StepLayout>
            )}

            {step === 4 && (
              <StepLayout title="What is your approximate annual household income?" subtitle="Income ranges help match means-tested schemes.">
                <div className="grid gap-2.5">
                  {incomeOptions.map((o) => (
                    <OptionRow
                      key={o.value}
                      label={o.label}
                      selected={profile.income === o.value}
                      onClick={() => update('income', o.value)}
                    />
                  ))}
                </div>
              </StepLayout>
            )}

            {step === 5 && (
              <StepLayout title="Which of these apply to you?" subtitle="Select all that are relevant. This improves your recommendations.">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {conditionOptions.map((o) => {
                    const selected = profile.conditions.includes(o.value);
                    return (
                      <button
                        key={o.value}
                        onClick={() => toggleCondition(o.value)}
                        className={`flex items-center gap-2.5 rounded-xl border px-3.5 py-2.5 text-sm font-medium text-left transition-colors ${
                          selected
                            ? 'border-saffron-400 bg-saffron-50 text-saffron-800'
                            : 'border-navy-200 text-navy-700 hover:border-navy-300'
                        }`}
                      >
                        <span className={`inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md border ${
                          selected ? 'bg-saffron-500 border-saffron-500 text-white' : 'border-navy-300'
                        }`}>
                          {selected && <Check className="h-3.5 w-3.5" />}
                        </span>
                        {o.label}
                      </button>
                    );
                  })}
                </div>
              </StepLayout>
            )}

            {error && (
              <p className="mt-4 flex items-center gap-1.5 text-sm text-red-600">
                <AlertTriangle className="h-4 w-4" /> {error}
              </p>
            )}

            {/* Nav buttons */}
            <div className="mt-6 flex items-center justify-between">
              <button
                onClick={back}
                disabled={step === 0}
                className="btn-ghost disabled:opacity-40"
              >
                <ArrowLeft className="h-4 w-4" /> Back
              </button>
              <button onClick={next} className="btn-primary" disabled={!canProceed()}>
                {step === TOTAL_STEPS - 1 ? 'See my recommendations' : 'Continue'}
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </>
        )}
      </div>

      <p className="mt-4 text-center text-xs text-navy-400">
        {completeness.filled}/{completeness.total} profile fields filled
      </p>

      <SchemeDetailsModal scheme={selectedScheme} onClose={() => setSelectedScheme(null)} onAskAi={onAskAi} />
    </div>
  );
}

// Inline import to avoid circular type issues

function StepLayout({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-lg font-bold text-navy-900">{title}</h3>
      <p className="mt-1 text-sm text-navy-500">{subtitle}</p>
      <div className="mt-5">{children}</div>
    </div>
  );
}

function OptionCard({ label, hint, selected, onClick }: { label: string; hint?: string; selected: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-xl border px-4 py-3.5 text-left transition-all ${
        selected
          ? 'border-saffron-400 bg-saffron-50 ring-2 ring-saffron-200'
          : 'border-navy-200 hover:border-navy-300 hover:bg-navy-50/50'
      }`}
    >
      <span className={`block text-sm font-semibold ${selected ? 'text-saffron-800' : 'text-navy-800'}`}>{label}</span>
      {hint && <span className="block text-xs text-navy-400 mt-0.5">{hint}</span>}
    </button>
  );
}

function OptionRow({ label, selected, onClick }: { label: string; selected: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-between rounded-xl border px-4 py-3 text-left transition-all ${
        selected
          ? 'border-saffron-400 bg-saffron-50 ring-2 ring-saffron-200'
          : 'border-navy-200 hover:border-navy-300 hover:bg-navy-50/50'
      }`}
    >
      <span className={`text-sm font-medium ${selected ? 'text-saffron-800' : 'text-navy-700'}`}>{label}</span>
      {selected && <Check className="h-4 w-4 text-saffron-600" />}
    </button>
  );
}

function ComputingState() {
  return (
    <div className="py-12 text-center">
      <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-saffron-50 text-saffron-600 mb-4">
        <Sparkles className="h-7 w-7 animate-pulse" />
      </div>
      <h3 className="text-lg font-bold text-navy-900">Calculating your recommendations…</h3>
      <p className="mt-1.5 text-sm text-navy-500">Matching your profile against {allSchemes.length} government schemes.</p>
    </div>
  );
}

// ───────── Results view ─────────

function ResultsView({
  profile,
  results,
  onRestart,
  onAskAi,
  onViewDetails,
}: {
  profile: CitizenProfile;
  results: SchemeRecommendation[];
  onRestart: () => void;
  onAskAi: (scheme: Scheme) => void;
  onViewDetails: (scheme: Scheme) => void;
}) {
  const top5 = results.slice(0, 5);
  const hasMatches = top5.length > 0 && top5[0].score > 0;

  return (
    <div>
      {/* Disclaimer */}
      <div className="flex items-start gap-3 rounded-2xl border border-saffron-200 bg-saffron-50/60 px-4 py-3 mb-6">
        <ShieldAlert className="h-5 w-5 shrink-0 text-saffron-600 mt-0.5" />
        <p className="text-sm text-saffron-800 leading-relaxed">{ELIGIBILITY_DISCLAIMER}</p>
      </div>

      {/* Profile summary */}
      <div className="card p-5 mb-6">
        <div className="flex items-center justify-between gap-3">
          <h3 className="flex items-center gap-2 font-bold text-navy-900">
            <User className="h-5 w-5 text-saffron-500" /> Your profile summary
          </h3>
          <button onClick={onRestart} className="btn-ghost text-xs">
            <RotateCcw className="h-3.5 w-3.5" /> Start over
          </button>
        </div>
        <dl className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
          <ProfileItem label="Age group" value={profile.ageGroup ? AGE_LABELS[profile.ageGroup] : '—'} />
          <ProfileItem label="State" value={profile.state || '—'} />
          <ProfileItem label="Area" value={profile.area ? AREA_LABELS[profile.area] : '—'} />
          <ProfileItem label="Occupation" value={profile.occupation ? OCCUPATION_LABELS[profile.occupation] : '—'} />
          <ProfileItem label="Income" value={profile.income ? INCOME_LABELS[profile.income] : '—'} />
          <ProfileItem
            label="Conditions"
            value={
              profile.conditions.length && profile.conditions[0] !== 'none'
                ? profile.conditions.filter((c) => c !== 'none').map((c) => CONDITION_LABELS[c]).join(', ')
                : 'None'
            }
          />
        </dl>
      </div>

      <h3 className="text-lg font-bold text-navy-900 mb-1">Top 5 recommended schemes</h3>
      <p className="text-sm text-navy-500 mb-5">Sorted by match score (highest first).</p>

      {!hasMatches ? (
        <div className="card p-10 text-center">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-navy-50 text-navy-400 mb-3">
            <AlertTriangle className="h-7 w-7" />
          </div>
          <h3 className="text-lg font-bold text-navy-900">No strong matches found</h3>
          <p className="mt-1.5 text-sm text-navy-500 max-w-sm mx-auto">
            None of the schemes strongly matched your profile. You can still browse all schemes or
            adjust your profile and try again.
          </p>
          <button onClick={onRestart} className="btn-secondary mt-4">
            <RotateCcw className="h-4 w-4" /> Update profile
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {top5.map((rec, i) => (
            <RecommendationCard
              key={rec.scheme.id}
              rank={i + 1}
              rec={rec}
              onViewDetails={() => onViewDetails(rec.scheme)}
              onAskAi={() => onAskAi(rec.scheme)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function ProfileItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-semibold uppercase tracking-wide text-navy-400">{label}</dt>
      <dd className="text-navy-800 font-medium mt-0.5">{value}</dd>
    </div>
  );
}

function RecommendationCard({
  rank,
  rec,
  onViewDetails,
  onAskAi,
}: {
  rank: number;
  rec: SchemeRecommendation;
  onViewDetails: () => void;
  onAskAi: () => void;
}) {
  const labelColor =
    rec.label === 'Strong Match'
      ? 'bg-ashoka-50 text-ashoka-700 border-ashoka-200'
      : rec.label === 'Possible Match'
      ? 'bg-saffron-50 text-saffron-700 border-saffron-200'
      : 'bg-navy-50 text-navy-600 border-navy-200';

  const barColor =
    rec.label === 'Strong Match'
      ? 'bg-ashoka-500'
      : rec.label === 'Possible Match'
      ? 'bg-saffron-500'
      : 'bg-navy-400';

  return (
    <article className="card p-5 animate-fade-up" style={{ animationDelay: `${Math.min(rank - 1, 4) * 60}ms` }}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-navy-900 text-white text-sm font-bold">
            {rank}
          </span>
          <div>
            <h4 className="font-bold text-navy-900">{rec.scheme.name}</h4>
            <p className="text-xs text-navy-400">{rec.scheme.category} · {rec.scheme.ministry}</p>
          </div>
        </div>
        <div className="text-right shrink-0">
          <span className={`chip border ${labelColor}`}>{rec.label}</span>
          <p className="mt-1.5 text-2xl font-extrabold text-navy-900">{rec.score}%</p>
        </div>
      </div>

      {/* Score bar */}
      <div className="mt-3 h-1.5 rounded-full bg-navy-100 overflow-hidden">
        <div className={`h-full rounded-full ${barColor}`} style={{ width: `${rec.score}%` }} />
      </div>

      <p className="mt-3 text-sm text-navy-700 leading-relaxed">{rec.whyRelevant}</p>

      {rec.matchedFactors.length > 0 && (
        <div className="mt-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-ashoka-600 mb-1.5">Why it matched</p>
          <ul className="space-y-1">
            {rec.matchedFactors.map((f, i) => (
              <li key={i} className="flex gap-2 text-sm text-navy-700">
                <Check className="h-4 w-4 shrink-0 text-ashoka-500 mt-0.5" /> {f}
              </li>
            ))}
          </ul>
        </div>
      )}

      {rec.verificationFactors.length > 0 && (
        <div className="mt-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-saffron-600 mb-1.5">Verify before applying</p>
          <ul className="space-y-1">
            {rec.verificationFactors.map((f, i) => (
              <li key={i} className="flex gap-2 text-sm text-navy-600">
                <ShieldAlert className="h-4 w-4 shrink-0 text-saffron-500 mt-0.5" /> {f}
              </li>
            ))}
          </ul>
        </div>
      )}

      {rec.missingInfo.length > 0 && (
        <p className="mt-3 text-xs text-navy-400">
          Missing info: {rec.missingInfo.join(', ')} — providing it could improve accuracy.
        </p>
      )}

      <p className="mt-3 text-sm text-navy-600">
        <span className="font-semibold text-navy-800">Next:</span> {rec.nextAction}
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        <button onClick={onViewDetails} className="btn-secondary text-sm">
          <FileText className="h-4 w-4" /> View scheme details
        </button>
        <button onClick={onAskAi} className="btn-primary text-sm">
          <Bot className="h-4 w-4" /> Ask Bharat AI
        </button>
      </div>
    </article>
  );
}
