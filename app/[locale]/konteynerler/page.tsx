import Link from 'next/link';
import { getTranslations, type Locale } from '@/lib/i18n';
import Button from '@/components/ui/Button';
import ContainerDimensionsSection from '@/components/containers/ContainerDimensionsSection';
import ContainerSpecsTable from '@/components/containers/ContainerSpecsTable';
import ContainerFAQ from '@/components/containers/ContainerFAQ';
import BreadcrumbJsonLd from '@/components/seo/BreadcrumbJsonLd';
import type { Metadata } from 'next';

// ISR: Revalidate every 1 hour
export const revalidate = 3600;

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = getTranslations(locale);
  return {
    title: locale === 'tr'
      ? "Konteyner Ölçüleri ve Tipleri – 20'lik, 40'lık, HC, Reefer | PEKCON"
      : "Container Dimensions & Types – 20ft, 40ft, HC, Reefer | PEKCON",
    description: locale === 'tr'
      ? "20'lik, 40'lık, 40 HC, 45 HC, Reefer, Open Top ve Flat Rack konteynerlerin dış/iç ölçüleri, kapı açıklığı, hacim (m³), boş ağırlık ve azami yük kapasitesi. Palet yerleşim planları ve SSS."
      : 'External/internal dimensions, door opening, volume (m³), tare weight and max payload for 20ft, 40ft, 40 HC, 45 HC, Reefer, Open Top and Flat Rack containers. Pallet loading plans and FAQ.',
    alternates: {
      canonical: locale === 'tr' ? 'https://pekcon.com/tr/konteynerler' : 'https://pekcon.com/en/containers',
      languages: { 'tr': 'https://pekcon.com/tr/konteynerler', 'en': 'https://pekcon.com/en/containers' },
    },
  };
}

export default async function ContainersPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const t = getTranslations(locale);
  const salesHref = locale === 'en' ? '/en/containers-for-sale' : `/${locale}/satilik-konteyner`;

  return (
    <div
      className="relative min-h-screen bg-cover bg-center bg-fixed pt-5 md:pt-32 pb-16 px-4"
      style={{ backgroundImage: "url('/satilik-konteyner-hero.jpg')" }}
    >
      <div className="absolute inset-0 bg-white/85" />
      <BreadcrumbJsonLd locale={locale} slug="konteynerler" />
      <div className="relative z-10 max-w-7xl mx-auto space-y-14 md:space-y-20">
        <div className="space-y-6 md:space-y-10">
          <div className="rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 flex flex-col items-center text-center sm:flex-row sm:items-center sm:text-left gap-3 sm:gap-4 shadow-sm">
            <p className="flex-1 text-sm md:text-base text-amber-900 leading-relaxed">
              {locale === 'tr' ? (
                <>
                  <strong>Stoklarımız anlık değişiyor.</strong> Güncel konteyner fotoğrafları ve fiyat bilgisi için bizimle WhatsApp iletişim hattımızdan hemen iletişime geçebilirsiniz.
                </>
              ) : (
                <>
                  <strong>Our stock changes constantly.</strong> For the latest container photos and pricing, contact us on our WhatsApp line.
                </>
              )}
            </p>
            <a
              href={`https://wa.me/905427179357?text=${encodeURIComponent(locale === 'tr' ? 'Merhaba, güncel konteyner fotoğrafları ve fiyatları hakkında bilgi almak istiyorum.' : 'Hello, I would like to get the latest container photos and prices.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-xl bg-green-600 hover:bg-green-700 text-white font-semibold text-sm px-5 py-2.5 transition-colors whitespace-nowrap"
            >
              {locale === 'tr' ? "WhatsApp'tan Yazın" : 'Message on WhatsApp'}
            </a>
          </div>

          <div className="flex justify-center">
            <Link href={salesHref} className="w-full sm:w-auto">
              <Button
                size="lg"
                className="w-full sm:min-w-[220px] !bg-none !bg-red-600 !border-red-600 !text-white hover:!bg-red-700 transition-all duration-300 shadow-xl hover:shadow-red-600/30 text-sm font-bold"
              >
                {t.hero.cta3}
              </Button>
            </Link>
          </div>

          <ContainerSpecsTable locale={locale} />
        </div>
        <ContainerDimensionsSection locale={locale} />
        <ContainerFAQ locale={locale} />
      </div>
    </div>
  );
}
