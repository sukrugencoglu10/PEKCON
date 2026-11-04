import Link from 'next/link';
import type { Metadata } from 'next';
import { CheckCircle2, Package, Snowflake, Boxes, ShieldCheck, Truck, Globe2, FileText } from 'lucide-react';
import { type Locale } from '@/lib/i18n';
import JsonLd from '@/components/seo/JsonLd';
import BreadcrumbJsonLd from '@/components/seo/BreadcrumbJsonLd';
import CTASection from '@/components/home/CTASection';
import StickyQuoteBar from '@/components/home/StickyQuoteBar';

export const revalidate = 3600;

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  const isTr = locale === 'tr';
  const canonical = isTr
    ? 'https://pekcon.com/tr/satilik-konteyner'
    : 'https://pekcon.com/en/containers-for-sale';
  return {
    title: isTr
      ? "Satılık Konteyner Fiyatları – Sıfır & İkinci El | 20ft, 40ft, 40HC | PEKCON"
      : 'Shipping Containers for Sale – New & Used | 20ft, 40ft, 40HC | PEKCON',
    description: isTr
      ? "Satılık gemi konteyneri: sıfır ve ikinci el 20ft, 40ft, 40 HC, 45 HC, Reefer, Open Top ve Flat Rack. CSC plakalı, cargo worthy konteynerler için 24 saatte teklif. Türkiye'den 100+ ülkeye tedarik."
      : 'Shipping containers for sale: new and used 20ft, 40ft, 40 HC, 45 HC, Reefer, Open Top and Flat Rack. CSC-plated, cargo-worthy units with a quote in 24 hours. Supply to 100+ countries from Türkiye.',
    alternates: { canonical },
  };
}

type Content = {
  slug: string;
  h1: string;
  heroSub: string;
  ctaQuote: string;
  ctaSpecs: string;
  introTitle: string;
  introBody: string;
  typesTitle: string;
  typesSub: string;
  types: { icon: React.ReactNode; name: string; desc: string }[];
  condTitle: string;
  conditions: { title: string; desc: string }[];
  whyTitle: string;
  why: string[];
  priceTitle: string;
  priceBody: string;
  priceCta: string;
  processTitle: string;
  process: { step: string; title: string; desc: string }[];
  specsLink: string;
  quoteHref: string;
  specsHref: string;
};

const ICON = {
  box: <Package size={26} className="text-primary-600" />,
  boxes: <Boxes size={26} className="text-primary-600" />,
  snow: <Snowflake size={26} className="text-cyan-600" />,
};

function buildContent(locale: Locale): Content {
  const isTr = locale === 'tr';
  const quoteHref = isTr ? '/tr/teklif-al' : '/en/quote';
  const specsHref = isTr ? '/tr/konteynerler' : '/en/containers';

  if (isTr) {
    return {
      slug: 'satilik-konteyner',
      h1: 'Satılık Konteyner',
      heroSub:
        'Sıfır ve ikinci el satılık gemi konteynerleri — 20ft, 40ft, 40 HC, 45 HC, Reefer, Open Top ve Flat Rack. CSC plakalı, cargo worthy konteynerler için Türkiye genelinde ve 100+ ülkeye hızlı tedarik.',
      ctaQuote: 'Hemen Teklif Al',
      ctaSpecs: 'Konteyner Ölçüleri',
      introTitle: 'Her İhtiyaca Uygun Satılık Konteyner',
      introBody:
        'PEKCON olarak armatörlerden ihracatçılara, kurumsal firmalardan bireysel alıcılara kadar her ölçekte satılık konteyner tedarik ediyoruz. Standart kuru yük konteynerlerinden soğutmalı (reefer), üstü açılır (open top) ve flat rack gibi özel tiplere kadar geniş bir stok ağına sahibiz. Tüm konteynerlerimiz uluslararası taşımacılığa uygun (cargo worthy), su geçirmez (wind & watertight) ve CSC sertifikalıdır.',
      typesTitle: 'Satılık Konteyner Tipleri',
      typesSub: 'İhtiyacınıza en uygun tipi seçin; detaylı ölçüler için ölçü tablomuza göz atın.',
      types: [
        { icon: ICON.box, name: "20' DC (Standart)", desc: 'En yaygın tip; genel kuru yük için ideal. ~33 m³ hacim, ~28 ton yük kapasitesi.' },
        { icon: ICON.box, name: "40' DC (Standart)", desc: 'Hacimli yükler için uzun gövde. ~68 m³ hacim, geniş taban alanı.' },
        { icon: ICON.boxes, name: "40' HC (High Cube)", desc: '30 cm ekstra yükseklik, ~76 m³ hacim. Hacimli ama hafif yükler için ideal.' },
        { icon: ICON.boxes, name: "45' HC", desc: 'Maksimum hacim (~86 m³) ve ekstra uzunluk. Büyük hacimli sevkiyatlar için.' },
        { icon: ICON.snow, name: "40' Reefer (Soğutmalı)", desc: '-30°C / +30°C sıcaklık kontrolü. Gıda ve ısıya duyarlı yükler için.' },
        { icon: ICON.box, name: "Open Top (Üstü Açılır)", desc: 'Vinçle üstten yükleme; kapıdan geçmeyen yüksek yükler için.' },
        { icon: ICON.boxes, name: 'Flat Rack', desc: 'Yanları açık platform; makine, boru, mermer gibi gabari dışı ağır yükler için.' },
      ],
      condTitle: 'Sıfır mı, İkinci El mi?',
      conditions: [
        {
          title: 'Sıfır / Üretim Konteyner',
          desc: 'Hiç kullanılmamış, fabrika çıkışlı konteynerler. Uzun ömür, kusursuz görünüm ve modifikasyona uygunluk arayanlar için en iyi seçim.',
        },
        {
          title: 'İkinci El / Kullanılmış Konteyner',
          desc: 'Uygun maliyetli, CSC plakalı ve cargo worthy sertifikalı kullanılmış konteynerler. Depolama ve tek yön taşımacılık için ekonomik çözüm.',
        },
      ],
      whyTitle: 'Neden PEKCON’dan Satılık Konteyner?',
      why: [
        'CSC plakalı, wind & watertight ve cargo worthy sertifikalı konteynerler',
        'Sıfır ve ikinci el seçenekleriyle her bütçeye uygun stok',
        '24 saat içinde net teklif, hazır stoktan 2–5 iş gününde teslimat',
        'Türkiye genelinde ve 100+ ülkeye lojistik desteğiyle tedarik',
        '20 yılı aşkın tecrübe ve küresel depo ağı',
      ],
      priceTitle: 'Satılık Konteyner Fiyatları',
      priceBody:
        'Konteyner fiyatları; tipe (20ft / 40ft / HC / Reefer vb.), kondisyona (sıfır / ikinci el), adete ve teslimat lokasyonuna göre değişir. Piyasa koşullarına göre güncel ve şeffaf fiyatı size özel teklif olarak iletiyoruz — formu doldurun, 24 saat içinde dönüş yapalım.',
      priceCta: 'Fiyat Teklifi Al',
      processTitle: 'Satın Alma Süreci',
      process: [
        { step: '1', title: 'Talebinizi İletin', desc: 'Tip, adet, kondisyon ve teslimat lokasyonunu formla paylaşın.' },
        { step: '2', title: 'Teklifinizi Alın', desc: 'Uzman ekibimiz 24 saat içinde size özel fiyat teklifi hazırlar.' },
        { step: '3', title: 'Teslimat', desc: 'Onay sonrası hazır stoktan 2–5 iş günü içinde teslimat sağlanır.' },
      ],
      specsLink: 'Tüm konteyner ölçüleri ve teknik tablosunu inceleyin',
      quoteHref,
      specsHref,
    };
  }

  return {
    slug: 'containers-for-sale',
    h1: 'Shipping Containers for Sale',
    heroSub:
      'New and used shipping containers for sale — 20ft, 40ft, 40 HC, 45 HC, Reefer, Open Top and Flat Rack. CSC-plated, cargo-worthy units with fast supply across Türkiye and to 100+ countries.',
    ctaQuote: 'Get a Quote',
    ctaSpecs: 'Container Dimensions',
    introTitle: 'Containers for Sale for Every Need',
    introBody:
      'PEKCON supplies containers for sale at every scale — from shipowners and exporters to corporate and individual buyers. Our stock ranges from standard dry cargo containers to special types such as reefer, open top and flat rack. All our containers are cargo worthy, wind & watertight and CSC certified for international transport.',
    typesTitle: 'Container Types for Sale',
    typesSub: 'Choose the type that fits your need; see our dimensions table for full specs.',
    types: [
      { icon: ICON.box, name: "20' DC (Standard)", desc: 'The most common type; ideal for general dry cargo. ~33 m³ volume, ~28 t payload.' },
      { icon: ICON.box, name: "40' DC (Standard)", desc: 'Long body for voluminous cargo. ~68 m³ volume, large floor area.' },
      { icon: ICON.boxes, name: "40' HC (High Cube)", desc: '30 cm extra height, ~76 m³ volume. Ideal for voluminous but light cargo.' },
      { icon: ICON.boxes, name: "45' HC", desc: 'Maximum volume (~86 m³) and extra length. For large-volume shipments.' },
      { icon: ICON.snow, name: "40' Reefer", desc: '-30°C / +30°C temperature control. For food and heat-sensitive cargo.' },
      { icon: ICON.box, name: 'Open Top', desc: 'Top loading by crane; for tall cargo that will not pass through the doors.' },
      { icon: ICON.boxes, name: 'Flat Rack', desc: 'Open platform; for out-of-gauge heavy loads such as machinery, pipes and marble.' },
    ],
    condTitle: 'New or Used?',
    conditions: [
      {
        title: 'New / One-Trip Container',
        desc: 'Factory-fresh, never-used containers. The best choice for long life, flawless appearance and suitability for modification.',
      },
      {
        title: 'Used Container',
        desc: 'Cost-effective, CSC-plated and cargo-worthy certified used containers. An economical solution for storage and one-way transport.',
      },
    ],
    whyTitle: 'Why Buy Containers from PEKCON?',
    why: [
      'CSC-plated, wind & watertight and cargo-worthy certified containers',
      'New and used options to suit every budget',
      'Clear quote within 24 hours, delivery in 2–5 business days from stock',
      'Supply across Türkiye and to 100+ countries with logistics support',
      'Over 20 years of experience and a global depot network',
    ],
    priceTitle: 'Shipping Container Prices',
    priceBody:
      'Container prices vary by type (20ft / 40ft / HC / Reefer etc.), condition (new / used), quantity and delivery location. We provide an up-to-date, transparent price as a tailored quote — fill in the form and we will respond within 24 hours.',
    priceCta: 'Request a Price Quote',
    processTitle: 'Buying Process',
    process: [
      { step: '1', title: 'Send Your Request', desc: 'Share the type, quantity, condition and delivery location via the form.' },
      { step: '2', title: 'Receive Your Quote', desc: 'Our team prepares a tailored price quote within 24 hours.' },
      { step: '3', title: 'Delivery', desc: 'After approval, delivery is made from stock within 2–5 business days.' },
    ],
    specsLink: 'See the full container dimensions and technical table',
    quoteHref,
    specsHref,
  };
}

export default async function ContainersForSalePage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const c = buildContent(locale);
  const baseUrl = 'https://pekcon.com';

  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: locale === 'tr' ? 'Satılık Konteyner (Sıfır & İkinci El)' : 'Shipping Containers for Sale (New & Used)',
    serviceType: locale === 'tr' ? 'Konteyner Satışı' : 'Container Sales',
    provider: {
      '@type': 'Organization',
      name: 'PEKCON Container & Logistics',
      url: `${baseUrl}/${locale}`,
    },
    areaServed: { '@type': 'Place', name: 'Worldwide' },
    description: c.heroSub,
    url: `${baseUrl}/${c.slug === 'satilik-konteyner' ? 'tr/satilik-konteyner' : 'en/containers-for-sale'}`,
  };

  return (
    <div className="min-h-screen bg-white">
      <JsonLd data={serviceSchema} />
      <BreadcrumbJsonLd locale={locale} slug={c.slug} />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-secondary-600 via-secondary-500 to-primary-600 pt-28 md:pt-32 pb-16 px-4">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              'linear-gradient(to right, rgba(255,255,255,0.12) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.12) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-display font-black text-white mb-5">{c.h1}</h1>
          <p className="text-base md:text-xl text-white/90 max-w-3xl mx-auto mb-8">{c.heroSub}</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href={c.quoteHref}
              className="inline-flex items-center gap-2 bg-white text-secondary-600 hover:bg-gray-100 font-bold text-base px-8 py-3.5 rounded-xl shadow-lg transition-all hover:scale-[1.02]"
            >
              <FileText size={18} /> {c.ctaQuote}
            </Link>
            <Link
              href={c.specsHref}
              className="inline-flex items-center gap-2 bg-white/10 border border-white/40 text-white hover:bg-white/20 font-bold text-base px-8 py-3.5 rounded-xl transition-all"
            >
              <Boxes size={18} /> {c.ctaSpecs}
            </Link>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-16 md:py-20 space-y-20">
        {/* Intro */}
        <section className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-display font-black text-dark-900 mb-4">{c.introTitle}</h2>
          <p className="text-base md:text-lg text-dark-700 leading-relaxed">{c.introBody}</p>
        </section>

        {/* Types */}
        <section>
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-display font-black text-dark-900 mb-3">{c.typesTitle}</h2>
            <p className="text-base md:text-lg text-dark-700 max-w-2xl mx-auto">{c.typesSub}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {c.types.map((t) => (
              <div
                key={t.name}
                className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg transition-shadow p-5"
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className="flex-shrink-0 w-11 h-11 rounded-xl bg-primary-50 flex items-center justify-center">
                    {t.icon}
                  </span>
                  <h3 className="font-bold text-dark-900 text-lg">{t.name}</h3>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">{t.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href={c.specsHref} className="text-primary-600 font-semibold hover:text-primary-700 underline underline-offset-4">
              {c.specsLink} →
            </Link>
          </div>
        </section>

        {/* New vs Used */}
        <section>
          <h2 className="text-3xl md:text-4xl font-display font-black text-dark-900 text-center mb-10">{c.condTitle}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-4xl mx-auto">
            {c.conditions.map((cond) => (
              <div key={cond.title} className="bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-200 p-6">
                <h3 className="font-bold text-dark-900 text-xl mb-2">{cond.title}</h3>
                <p className="text-sm md:text-base text-gray-600 leading-relaxed">{cond.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Why PEKCON */}
        <section className="bg-gray-50 rounded-3xl p-8 md:p-12">
          <h2 className="text-3xl md:text-4xl font-display font-black text-dark-900 text-center mb-8">{c.whyTitle}</h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
            {c.why.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <CheckCircle2 size={22} className="text-secondary-500 flex-shrink-0 mt-0.5" />
                <span className="text-dark-700">{item}</span>
              </li>
            ))}
          </ul>
          <div className="flex flex-wrap justify-center gap-6 mt-10 text-dark-600">
            <span className="inline-flex items-center gap-2"><ShieldCheck size={20} className="text-primary-600" /> CSC / Cargo Worthy</span>
            <span className="inline-flex items-center gap-2"><Truck size={20} className="text-primary-600" /> 2–5 {locale === 'tr' ? 'iş günü' : 'business days'}</span>
            <span className="inline-flex items-center gap-2"><Globe2 size={20} className="text-primary-600" /> 100+ {locale === 'tr' ? 'ülke' : 'countries'}</span>
          </div>
        </section>

        {/* Price / Quote */}
        <section className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-display font-black text-dark-900 mb-4">{c.priceTitle}</h2>
          <p className="text-base md:text-lg text-dark-700 leading-relaxed mb-8">{c.priceBody}</p>
          <Link
            href={c.quoteHref}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-secondary-500 to-secondary-600 hover:from-secondary-600 hover:to-secondary-700 text-white font-bold text-base px-8 py-4 rounded-xl shadow-md transition-all hover:scale-[1.02]"
          >
            <FileText size={18} /> {c.priceCta}
          </Link>
        </section>

        {/* Process */}
        <section>
          <h2 className="text-3xl md:text-4xl font-display font-black text-dark-900 text-center mb-10">{c.processTitle}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-4xl mx-auto">
            {c.process.map((p) => (
              <div key={p.step} className="relative bg-white rounded-2xl border border-gray-200 p-6 text-center">
                <div className="w-12 h-12 mx-auto rounded-full bg-primary-600 text-white font-black text-xl flex items-center justify-center mb-4">
                  {p.step}
                </div>
                <h3 className="font-bold text-dark-900 text-lg mb-2">{p.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      <CTASection locale={locale} />
      <StickyQuoteBar locale={locale} />
    </div>
  );
}
