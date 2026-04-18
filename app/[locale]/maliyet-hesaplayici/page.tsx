import TransportCalculator from '@/components/widgets/TransportCalculator';
import type { Locale } from '@/lib/i18n';
import type { Metadata } from 'next';

export const revalidate = 3600;

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  if (locale === 'tr') {
    return {
      title: 'Konteyner Nakliye Maliyet Hesaplayıcı | Ücretsiz Araç | PEKCON',
      description: 'Konteyner nakliye maliyetinizi anlık hesapla. Rota, konteyner tipi ve ağırlığa göre tahmini taşıma ücreti öğrenin. Ücretsiz ve anlık sonuç.',
      alternates: { canonical: 'https://pekcon.com/tr/maliyet-hesaplayici', languages: { 'tr': 'https://pekcon.com/tr/maliyet-hesaplayici', 'en': 'https://pekcon.com/en/cost-calculator' } },
      openGraph: {
        title: 'Konteyner Nakliye Maliyet Hesaplayıcı | PEKCON',
        description: 'Konteyner nakliye maliyetinizi anlık hesaplaın.',
        url: 'https://pekcon.com/tr/maliyet-hesaplayici',
        siteName: 'PEKCON Container & Logistics',
        type: 'website',
      },
    };
  }
  return {
    title: 'Container Shipping Cost Calculator | Free Tool | PEKCON',
    description: 'Calculate your container shipping cost instantly. Get estimated freight rates by route, container type and weight. Free and instant results.',
    alternates: { canonical: 'https://pekcon.com/en/cost-calculator', languages: { 'tr': 'https://pekcon.com/tr/maliyet-hesaplayici', 'en': 'https://pekcon.com/en/cost-calculator' } },
    openGraph: {
      title: 'Container Shipping Cost Calculator | PEKCON',
      description: 'Calculate your container shipping cost instantly with our free tool.',
      url: 'https://pekcon.com/en/cost-calculator',
      siteName: 'PEKCON Container & Logistics',
      type: 'website',
    },
  };
}

export default async function CostCalculatorPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;

  return (
    <main className="pt-0">
      <TransportCalculator locale={locale} />
    </main>
  );
}
