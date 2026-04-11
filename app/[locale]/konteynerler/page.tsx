import { getTranslations, type Locale } from '@/lib/i18n';
import ContainerDimensionsSection from '@/components/containers/ContainerDimensionsSection';
import type { Metadata } from 'next';

// ISR: Revalidate every 1 hour
export const revalidate = 3600;

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = getTranslations(locale);
  return {
    title: locale === 'tr'
      ? 'Konteyner Ölçüleri ve Teknik Bilgiler | PEKCON'
      : 'Container Dimensions & Technical Specs | PEKCON',
    description: locale === 'tr'
      ? 'Tüm konteyner tiplerinin iç ölçüleri, hacimleri, yük kapasiteleri ve palet yerleşim planları.'
      : 'Internal dimensions, volumes, payload capacities and pallet loading plans for all container types.',
  };
}

export default async function ContainersPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const t = getTranslations(locale);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-28 md:pt-32 pb-16 px-4">
      <div className="max-w-7xl mx-auto">
        <ContainerDimensionsSection locale={locale} />
      </div>
    </div>
  );
}
