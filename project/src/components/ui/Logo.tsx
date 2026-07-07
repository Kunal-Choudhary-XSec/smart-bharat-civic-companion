import { Landmark } from 'lucide-react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  variant?: 'light' | 'dark';
}

const sizes = {
  sm: { box: 'h-8 w-8', icon: 'h-4 w-4', text: 'text-base', sub: 'text-[10px]' },
  md: { box: 'h-10 w-10', icon: 'h-5 w-5', text: 'text-lg', sub: 'text-[11px]' },
  lg: { box: 'h-12 w-12', icon: 'h-6 w-6', text: 'text-xl', sub: 'text-xs' },
};

export function Logo({ size = 'md', showText = true, variant = 'dark' }: LogoProps) {
  const s = sizes[size];
  const titleColor = variant === 'light' ? 'text-white' : 'text-navy-900';
  const subColor = variant === 'light' ? 'text-saffron-200' : 'text-saffron-600';

  return (
    <div className="flex items-center gap-2.5">
      <div
        className={`relative ${s.box} rounded-xl bg-gradient-to-br from-saffron-400 via-saffron-500 to-saffron-600 flex items-center justify-center shadow-sm ring-1 ring-saffron-300/50`}
      >
        <Landmark className={`${s.icon} text-white`} strokeWidth={2.2} />
        <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-ashoka-500 ring-2 ring-white" />
      </div>
      {showText && (
        <div className="flex flex-col leading-none">
          <span className={`font-extrabold tracking-tight ${s.text} ${titleColor}`}>
            Smart<span className="text-saffron-500"> Bharat</span>
          </span>
          <span className={`font-medium ${s.sub} ${subColor} tracking-wide uppercase`}>
            AI Civic Companion
          </span>
        </div>
      )}
    </div>
  );
}
