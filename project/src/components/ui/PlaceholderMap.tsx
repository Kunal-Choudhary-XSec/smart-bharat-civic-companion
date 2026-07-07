import { MapPin, Navigation } from 'lucide-react';

interface PlaceholderMapProps {
  location?: string;
  className?: string;
}

/**
 * A purely visual placeholder map — no external APIs or tiles.
 * Renders a stylised grid with a pin marker to indicate a location.
 */
export function PlaceholderMap({ location, className = '' }: PlaceholderMapProps) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl border border-navy-200 bg-navy-50 ${className}`}
      role="img"
      aria-label={location ? `Map placeholder for ${location}` : 'Map placeholder'}
    >
      {/* Grid background */}
      <div
        className="absolute inset-0 opacity-[0.5]"
        style={{
          backgroundImage:
            'linear-gradient(#c3d8e9 1px, transparent 1px), linear-gradient(90deg, #c3d8e9 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />
      {/* Stylised "roads" */}
      <div className="absolute top-1/2 left-0 right-0 h-3 -translate-y-1/2 bg-white/80" />
      <div className="absolute left-1/3 top-0 bottom-0 w-3 -translate-x-1/2 bg-white/80" />
      <div className="absolute left-0 right-0 top-1/4 h-2 bg-white/60" />
      <div className="absolute right-1/4 top-0 bottom-0 w-2 bg-white/60" />

      {/* "Park" block */}
      <div className="absolute bottom-6 left-6 h-16 w-20 rounded-lg bg-ashoka-100/70 border border-ashoka-200" />

      {/* Pin */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-saffron-400/30 animate-pulse-ring" />
          <div className="relative inline-flex h-10 w-10 items-center justify-center rounded-full bg-saffron-500 text-white shadow-lg ring-4 ring-white">
            <MapPin className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* Label */}
      <div className="absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-lg bg-white/90 backdrop-blur px-2.5 py-1 text-xs font-medium text-navy-700 shadow-sm">
        <Navigation className="h-3 w-3 text-saffron-500" />
        {location || 'Location on map'}
      </div>

      {/* Prototype badge */}
      <div className="absolute bottom-3 right-3 rounded-md bg-navy-900/80 px-2 py-0.5 text-[10px] font-medium text-white">
        Prototype map · not live
      </div>
    </div>
  );
}
