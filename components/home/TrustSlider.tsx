'use client';

import { type Locale } from '@/lib/i18n';

/**
 * Placeholder logos — replace with real logo images when available.
 * Each entry: { name, src (optional image path) }
 */
const LOGOS = [
  { name: 'ISO 9001' },
  { name: 'ISO 14001' },
  { name: 'CSC Certified' },
  { name: 'IICL Member' },
  { name: 'Bureau Veritas' },
  { name: 'Lloyd\'s Register' },
  { name: 'Maersk' },
  { name: 'MSC' },
  { name: 'CMA CGM' },
  { name: 'Hapag-Lloyd' },
];

function LogoItem({ name }: { name: string }) {
  return (
    <div className="flex items-center justify-center h-12 px-8 mx-4 flex-shrink-0 select-none">
      {/* Placeholder: replace with <Image> when real logos are ready */}
      <span className="text-gray-400 text-sm font-semibold tracking-wider whitespace-nowrap opacity-60">
        {name}
      </span>
    </div>
  );
}

export default function TrustSlider({ locale = 'tr' }: { locale?: Locale }) {
  // Double the list for seamless infinite scroll
  const items = [...LOGOS, ...LOGOS];

  return (
    <section className="relative bg-white py-5 border-b border-gray-100 overflow-hidden">
      {/* Fade edges */}
      <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

      {/* Scrolling track */}
      <div className="flex animate-scroll-left">
        {items.map((logo, i) => (
          <LogoItem key={`${logo.name}-${i}`} name={logo.name} />
        ))}
      </div>
    </section>
  );
}
