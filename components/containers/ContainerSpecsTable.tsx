import Link from 'next/link';
import { containerSpecs } from '@/data/container-specs';
import type { Locale } from '@/lib/i18n';

const LABELS: Record<Locale, {
  title: string;
  subtitle: string;
  type: string;
  external: string;
  internal: string;
  door: string;
  volume: string;
  tare: string;
  payload: string;
  dimHint: string;
  doorHint: string;
  cta: string;
  note: string;
}> = {
  tr: {
    title: 'Konteyner Ölçüleri Karşılaştırma Tablosu',
    subtitle: 'Tüm tiplerin dış ve iç ölçüsü, kapı açıklığı, hacmi, boş ağırlığı ve azami yük kapasitesi.',
    type: 'Tip',
    external: 'Dış Ölçü (U×G×Y)',
    internal: 'İç Ölçü (U×G×Y)',
    door: 'Kapı (G×Y)',
    volume: 'Hacim',
    tare: 'Boş Ağırlık (Dara)',
    payload: 'Azami Yük',
    dimHint: 'metre',
    doorHint: 'metre',
    cta: 'Bu konteyner için teklif al',
    note: 'Değerler ISO standart konteyner ölçüleridir; üretici ve partiye göre küçük farklar olabilir. Azami yük = azami brüt ağırlık − dara.',
  },
  en: {
    title: 'Container Dimensions Comparison Table',
    subtitle: 'External and internal dimensions, door opening, volume, tare weight and max payload for every type.',
    type: 'Type',
    external: 'External (L×W×H)',
    internal: 'Internal (L×W×H)',
    door: 'Door (W×H)',
    volume: 'Volume',
    tare: 'Tare weight',
    payload: 'Max payload',
    dimHint: 'metres',
    doorHint: 'metres',
    cta: 'Get a quote for this container',
    note: 'Values are ISO standard container dimensions; minor variations occur by manufacturer and batch. Max payload = max gross weight − tare.',
  },
};

function fmtNum(n: number, locale: Locale): string {
  return n.toLocaleString(locale === 'tr' ? 'tr-TR' : 'en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function fmtTriple(t: [number, number, number] | null, locale: Locale): string {
  if (!t) return '—';
  return `${fmtNum(t[0], locale)} × ${fmtNum(t[1], locale)} × ${fmtNum(t[2], locale)}`;
}

function fmtPair(p: [number, number] | null, locale: Locale): string {
  if (!p) return '—';
  return `${fmtNum(p[0], locale)} × ${fmtNum(p[1], locale)}`;
}

function fmtWeight(kg: number, locale: Locale): string {
  return kg.toLocaleString(locale === 'tr' ? 'tr-TR' : 'en-US') + ' kg';
}

function fmtVolume(n: number, locale: Locale): string {
  return n.toLocaleString(locale === 'tr' ? 'tr-TR' : 'en-US', {
    maximumFractionDigits: 1,
  });
}

export default function ContainerSpecsTable({ locale = 'tr' }: { locale?: Locale }) {
  const l = LABELS[locale] || LABELS.tr;

  return (
    <section aria-labelledby="specs-table-title">
      <div className="text-center mb-8">
        <h2 id="specs-table-title" className="text-3xl md:text-4xl font-display font-black text-dark-900 mb-3">
          {l.title}
        </h2>
        <p className="text-base md:text-lg text-dark-700 max-w-3xl mx-auto">{l.subtitle}</p>
      </div>

      <div className="overflow-x-auto rounded-2xl shadow-lg border border-gray-200 bg-white">
        <table className="w-full min-w-[720px] text-sm md:text-base border-collapse">
          <thead>
            <tr className="bg-primary-600 text-white text-left">
              <th scope="col" className="px-4 py-3 font-semibold whitespace-nowrap">{l.type}</th>
              <th scope="col" className="px-4 py-3 font-semibold whitespace-nowrap">
                {l.external}<span className="block text-[10px] font-normal text-white/70">{l.dimHint}</span>
              </th>
              <th scope="col" className="px-4 py-3 font-semibold whitespace-nowrap">
                {l.internal}<span className="block text-[10px] font-normal text-white/70">{l.dimHint}</span>
              </th>
              <th scope="col" className="px-4 py-3 font-semibold whitespace-nowrap">
                {l.door}<span className="block text-[10px] font-normal text-white/70">{l.doorHint}</span>
              </th>
              <th scope="col" className="px-4 py-3 font-semibold whitespace-nowrap">{l.volume}</th>
              <th scope="col" className="px-4 py-3 font-semibold whitespace-nowrap">{l.tare}</th>
              <th scope="col" className="px-4 py-3 font-semibold whitespace-nowrap">{l.payload}</th>
            </tr>
          </thead>
          <tbody>
            {containerSpecs.map((c, i) => (
              <tr
                key={c.id}
                className={`border-t border-gray-100 ${i % 2 === 1 ? 'bg-gray-50/60' : 'bg-white'} hover:bg-primary-50/40 transition-colors`}
              >
                <th scope="row" className="px-4 py-3 font-bold text-dark-900 whitespace-nowrap text-left">
                  {c.name[locale]}
                </th>
                <td className="px-4 py-3 text-dark-700 whitespace-nowrap">{fmtTriple(c.external, locale)}</td>
                <td className="px-4 py-3 text-dark-700 whitespace-nowrap">{fmtTriple(c.internal, locale)}</td>
                <td className="px-4 py-3 text-dark-700 whitespace-nowrap">{fmtPair(c.door, locale)}</td>
                <td className="px-4 py-3 text-dark-700 whitespace-nowrap">{c.volume ? `${fmtVolume(c.volume, locale)} m³` : '—'}</td>
                <td className="px-4 py-3 text-dark-700 whitespace-nowrap">{fmtWeight(c.tare, locale)}</td>
                <td className="px-4 py-3 font-bold text-primary-600 whitespace-nowrap">{fmtWeight(c.payload, locale)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-gray-500 mt-3 max-w-3xl">{l.note}</p>

      <div className="mt-6 text-center">
        <Link
          href={`/${locale}/teklif-al`}
          className="inline-block bg-gradient-to-r from-secondary-500 to-secondary-600 hover:from-secondary-600 hover:to-secondary-700 text-white font-bold text-sm md:text-base px-8 py-3.5 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg hover:scale-[1.02]"
        >
          {l.cta}
        </Link>
      </div>
    </section>
  );
}
