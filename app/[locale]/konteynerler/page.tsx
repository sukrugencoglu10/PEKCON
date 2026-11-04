import { getTranslations, type Locale } from '@/lib/i18n';
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-28 md:pt-32 pb-16 px-4">
      <BreadcrumbJsonLd locale={locale} slug="konteynerler" />
      <div className="max-w-7xl mx-auto space-y-20">
        <ContainerSpecsTable locale={locale} />
        <ContainerDimensionsSection locale={locale} />
        <ContainerFAQ locale={locale} />
      </div>
    </div>
  );
}
