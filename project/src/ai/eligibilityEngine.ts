/**
 * Eligibility matching engine — compares a citizen profile against each
 * scheme's eligibility rule and produces a match score (0–100) with
 * human-readable factors.
 *
 * Pure and stateless so it can be unit-tested or swapped later. It never
 * claims official eligibility — outputs are guidance only.
 */
import type {
  CitizenProfile,
  Scheme,
  ProfileCondition,
  AgeGroup,
  ResidenceArea,
  Occupation,
  IncomeRange,
} from '../data/schemeData';

export type MatchLabel = 'Strong Match' | 'Possible Match' | 'May Be Relevant';

export interface SchemeRecommendation {
  scheme: Scheme;
  score: number;
  label: MatchLabel;
  whyRelevant: string;
  matchedFactors: string[];
  verificationFactors: string[];
  missingInfo: string[];
  nextAction: string;
}

const AGE_LABELS: Record<AgeGroup, string> = {
  under_18: 'Under 18',
  '18_35': '18–35 years',
  '36_60': '36–60 years',
  above_60: 'Above 60',
};

const AREA_LABELS: Record<ResidenceArea, string> = {
  rural: 'Rural area',
  urban: 'Urban area',
};

const OCCUPATION_LABELS: Record<Occupation, string> = {
  student: 'Student',
  farmer: 'Farmer',
  salaried_employee: 'Salaried employee',
  self_employed: 'Self-employed',
  unemployed: 'Unemployed',
  homemaker: 'Homemaker',
  senior_citizen: 'Senior citizen',
  other: 'Other',
};

const INCOME_LABELS: Record<IncomeRange, string> = {
  below_1l: 'Below ₹1 lakh',
  '1l_3l': '₹1–3 lakh',
  '3l_6l': '₹3–6 lakh',
  '6l_10l': '₹6–10 lakh',
  above_10l: 'Above ₹10 lakh',
};

const CONDITION_LABELS: Record<ProfileCondition, string> = {
  woman: 'Woman',
  student: 'Student',
  farmer: 'Farmer',
  senior_citizen: 'Senior citizen',
  person_with_disability: 'Person with disability',
  has_girl_child: 'Has a girl child',
  needs_housing: 'Looking for housing support',
  needs_skill_training: 'Looking for skill training',
  needs_small_business_support: 'Looking to start/grow a small business',
  none: 'None of these',
};

export function labelForScore(score: number): MatchLabel {
  if (score >= 70) return 'Strong Match';
  if (score >= 45) return 'Possible Match';
  return 'May Be Relevant';
}

function includesOrAny<T>(rule: T[] | undefined, value: T | null): boolean {
  if (!rule || rule.length === 0) return true; // undefined rule = any
  return value != null && rule.includes(value);
}

export function scoreScheme(scheme: Scheme, profile: CitizenProfile): SchemeRecommendation {
  const rule = scheme.eligibilityRule;
  const matchedFactors: string[] = [];
  const verificationFactors: string[] = [];
  const missingInfo: string[] = [];
  let score = 0;
  let maxScore = 0;

  // Age (weight 20)
  maxScore += 20;
  if (profile.ageGroup) {
    if (includesOrAny(rule.ageGroups, profile.ageGroup)) {
      score += 20;
      matchedFactors.push(`Age group (${AGE_LABELS[profile.ageGroup]}) fits the scheme`);
    } else {
      score += 4;
      verificationFactors.push(`Age group (${AGE_LABELS[profile.ageGroup]}) — confirm the scheme's age criteria`);
    }
  } else {
    missingInfo.push('Age group');
  }

  // Area (weight 10)
  maxScore += 10;
  if (profile.area) {
    if (includesOrAny(rule.areas, profile.area)) {
      score += 10;
      matchedFactors.push(`${AREA_LABELS[profile.area]} residence is covered`);
    } else {
      verificationFactors.push(`${AREA_LABELS[profile.area]} residence — confirm area coverage`);
    }
  } else {
    missingInfo.push('Area of residence');
  }

  // Occupation (weight 20)
  maxScore += 20;
  if (profile.occupation) {
    if (includesOrAny(rule.occupations, profile.occupation)) {
      score += 20;
      matchedFactors.push(`Occupation (${OCCUPATION_LABELS[profile.occupation]}) aligns with the scheme`);
    } else {
      score += 5;
      verificationFactors.push(`Occupation (${OCCUPATION_LABELS[profile.occupation]}) — confirm the scheme targets your occupation`);
    }
  } else {
    missingInfo.push('Occupation');
  }

  // Income (weight 20)
  maxScore += 20;
  if (profile.income) {
    if (includesOrAny(rule.incomeRanges, profile.income)) {
      score += 20;
      matchedFactors.push(`Income range (${INCOME_LABELS[profile.income]}) is within the scheme's typical band`);
    } else {
      score += 6;
      verificationFactors.push(`Income range (${INCOME_LABELS[profile.income]}) — confirm the scheme's income criteria`);
    }
  } else {
    missingInfo.push('Annual household income');
  }

  // Conditions (weight 30)
  maxScore += 30;
  const profileConditions = profile.conditions.filter((c) => c !== 'none');
  if (rule.matchingConditions && rule.matchingConditions.length > 0) {
    const hits = profileConditions.filter((c) => rule.matchingConditions!.includes(c));
    if (hits.length > 0) {
      const gained = Math.min(30, hits.length * 15);
      score += gained;
      matchedFactors.push(
        `Profile matches: ${hits.map((h) => CONDITION_LABELS[h]).join(', ')}`,
      );
    } else if (profileConditions.length === 0) {
      missingInfo.push('Relevant profile conditions');
    }
  } else {
    // scheme has no condition preference — small neutral credit
    score += 10;
  }

  // Disqualifying conditions
  if (rule.disqualifyingConditions && profileConditions.length > 0) {
    const dq = profileConditions.filter((c) => rule.disqualifyingConditions!.includes(c));
    if (dq.length > 0 && profileConditions.length === dq.length) {
      // all selected conditions are disqualifying — strongly reduce
      score = Math.min(score, 20);
      verificationFactors.push('Your selected conditions may not align with this scheme — verify before applying');
    }
  }

  // Normalise to 0–100
  const finalScore = Math.round(Math.min(100, Math.max(0, (score / maxScore) * 100)));
  const label = labelForScore(finalScore);

  const whyRelevant = buildWhyRelevant(scheme, profile, matchedFactors);
  const nextAction = buildNextAction(scheme, label);

  return {
    scheme,
    score: finalScore,
    label,
    whyRelevant,
    matchedFactors,
    verificationFactors: verificationFactors.length ? verificationFactors : ['Confirm all eligibility criteria on the official portal before applying'],
    missingInfo,
    nextAction,
  };
}

function buildWhyRelevant(scheme: Scheme, _profile: CitizenProfile, matched: string[]): string {
  if (matched.length === 0) {
    return `${scheme.name} supports ${scheme.targetBeneficiaries.toLowerCase()}. Your profile may still qualify — verify the full criteria on the official portal.`;
  }
  return `${scheme.name} is designed for ${scheme.targetBeneficiaries.toLowerCase()}. Based on your profile, ${matched.length} factor${matched.length > 1 ? 's' : ''} align with this scheme.`;
}

function buildNextAction(scheme: Scheme, label: MatchLabel): string {
  if (label === 'Strong Match') {
    return `Gather the required documents and check the official ${scheme.name} portal to confirm eligibility and apply.`;
  }
  if (label === 'Possible Match') {
    return `Review the full eligibility criteria on the official ${scheme.name} portal before applying.`;
  }
  return `This scheme may be relevant — verify the detailed criteria on the official ${scheme.name} portal.`;
}

export function recommendSchemes(profile: CitizenProfile, allSchemes: Scheme[]): SchemeRecommendation[] {
  return allSchemes
    .map((s) => scoreScheme(s, profile))
    .sort((a, b) => b.score - a.score);
}

export function isProfileComplete(profile: CitizenProfile): boolean {
  return Boolean(profile.ageGroup && profile.state && profile.area && profile.occupation && profile.income);
}

export function profileCompleteness(profile: CitizenProfile): { filled: number; total: number; percent: number } {
  const fields = [profile.ageGroup, profile.state, profile.area, profile.occupation, profile.income];
  const filled = fields.filter(Boolean).length;
  return { filled, total: fields.length, percent: Math.round((filled / fields.length) * 100) };
}

export { AGE_LABELS, AREA_LABELS, OCCUPATION_LABELS, INCOME_LABELS, CONDITION_LABELS };
