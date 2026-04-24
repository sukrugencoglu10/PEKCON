import ContactSection from '@/components/home/ContactSection';
import BreadcrumbJsonLd from '@/components/seo/BreadcrumbJsonLd';
import type { Locale } from '@/lib/i18n';
import type { Metadata } from 'next';

// ISR: Revalidate every 30 minutes (form page)
export const revalidate = 1800;

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  if (locale === 'tr') {
    return {
      title: 'Ücretsiz Konteyner Teklifi Al | Hemen Başvur | PEKCON',
      description: 'Konteyner satın alma veya kiralama için ücretsiz teklif alın. 20\', 40\', HC, Reefer ve Flat Rack konteyner fiyatlarını öğrenin. 24 saat içinde dönüş.',
      alternates: { canonical: 'https://pekcon.com/tr/teklif-al', languages: { 'tr': 'https://pekcon.com/tr/teklif-al', 'en': 'https://pekcon.com/en/quote' } },
      openGraph: {
        title: 'Ücretsiz Konteyner Teklifi Al | PEKCON',
        description: 'Konteyner satın alma veya kiralama için ücretsiz teklif alın. 24 saat içinde dönüş.',
        url: 'https://pekcon.com/tr/teklif-al',
        siteName: 'PEKCON Container & Logistics',
        type: 'website',
      },
    };
  }
  return {
    title: 'Get a Free Container Quote | Apply Now | PEKCON',
    description: 'Request a free quote for container purchase or rental. 20ft, 40ft, HC, Reefer and Flat Rack container pricing. Response within 24 hours.',
    alternates: { canonical: 'https://pekcon.com/en/quote', languages: { 'tr': 'https://pekcon.com/tr/teklif-al', 'en': 'https://pekcon.com/en/quote' } },
    openGraph: {
      title: 'Get a Free Container Quote | PEKCON',
      description: 'Request a free quote for container purchase or rental. Response within 24 hours.',
      url: 'https://pekcon.com/en/quote',
      siteName: 'PEKCON Container & Logistics',
      type: 'website',
    },
  };
}

export default async function QuotePage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;

  return (
    <div className="min-h-screen bg-[#f8f7f4] pt-4 md:pt-8">
      <BreadcrumbJsonLd locale={locale} slug="teklif-al" />
      <ContactSection locale={locale} />
    </div>
  );
}
