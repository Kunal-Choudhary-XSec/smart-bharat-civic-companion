import type { LucideIcon } from 'lucide-react';

export type Accent = 'saffron' | 'navy' | 'ashoka' | 'sky';

export interface AccentClasses {
  text: string;
  bg: string;
  bgSoft: string;
  border: string;
  ring: string;
  gradient: string;
}

export const accentMap: Record<Accent, AccentClasses> = {
  saffron: {
    text: 'text-saffron-600',
    bg: 'bg-saffron-500',
    bgSoft: 'bg-saffron-50',
    border: 'border-saffron-200',
    ring: 'ring-saffron-400',
    gradient: 'from-saffron-400 to-saffron-600',
  },
  navy: {
    text: 'text-navy-700',
    bg: 'bg-navy-700',
    bgSoft: 'bg-navy-50',
    border: 'border-navy-200',
    ring: 'ring-navy-400',
    gradient: 'from-navy-500 to-navy-800',
  },
  ashoka: {
    text: 'text-ashoka-600',
    bg: 'bg-ashoka-500',
    bgSoft: 'bg-ashoka-50',
    border: 'border-ashoka-200',
    ring: 'ring-ashoka-400',
    gradient: 'from-ashoka-400 to-ashoka-600',
  },
  sky: {
    text: 'text-sky-600',
    bg: 'bg-sky-500',
    bgSoft: 'bg-sky-50',
    border: 'border-sky-200',
    ring: 'ring-sky-400',
    gradient: 'from-sky-400 to-sky-600',
  },
};

export interface IconBadgeProps {
  icon: LucideIcon;
  accent: Accent;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeMap = {
  sm: 'h-9 w-9',
  md: 'h-12 w-12',
  lg: 'h-14 w-14',
} as const;

const iconSizeMap = {
  sm: 'h-4 w-4',
  md: 'h-6 w-6',
  lg: 'h-7 w-7',
} as const;

export function IconBadge({ icon: Icon, accent, size = 'md', className = '' }: IconBadgeProps) {
  const a = accentMap[accent];
  return (
    <div
      className={`inline-flex items-center justify-center rounded-xl bg-gradient-to-br ${a.gradient} text-white shadow-sm ${sizeMap[size]} ${className}`}
    >
      <Icon className={iconSizeMap[size]} strokeWidth={2} />
    </div>
  );
}
