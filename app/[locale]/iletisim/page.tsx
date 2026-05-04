import { Mail, Phone, MapPin } from 'lucide-react';
import { getTranslations, type Locale } from '@/lib/i18n';
import type { Metadata } from 'next';
import JsonLd from '@/components/seo/JsonLd';
import BreadcrumbJsonLd from '@/components/seo/BreadcrumbJsonLd';

// ISR: Revalidate every 1 hour
export const revalidate = 3600;

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  if (locale === 'tr') {
    return {
      title: 'İletişim | Konteyner Fiyatı Öğren & Teklif Al | PEKCON',
      description: 'PEKCON ile iletişime geçin. Konteyner satış, kiralama ve lojistik hizmetleri için teklif alın. 7/24 WhatsApp destek: 0542 717 93 57.',
      alternates: { canonical: 'https://pekcon.com/tr/iletisim', languages: { 'tr': 'https://pekcon.com/tr/iletisim', 'en': 'https://pekcon.com/en/contact' } },
      openGraph: {
        title: 'İletişim | Konteyner Fiyatı Öğren & Teklif Al | PEKCON',
        description: 'Konteyner satış, kiralama ve lojistik hizmetleri için teklif alın. 7/24 WhatsApp destek.',
        url: 'https://pekcon.com/tr/iletisim',
        siteName: 'PEKCON Container & Logistics',
        type: 'website',
      },
    };
  }
  return {
    title: 'Contact Us | Get Container Price & Quote | PEKCON',
    description: 'Contact PEKCON for container sales, rental and logistics services. Get a free quote. 24/7 WhatsApp support: +90 542 717 93 57.',
    alternates: { canonical: 'https://pekcon.com/en/contact', languages: { 'tr': 'https://pekcon.com/tr/iletisim', 'en': 'https://pekcon.com/en/contact' } },
    openGraph: {
      title: 'Contact Us | Get Container Price & Quote | PEKCON',
      description: 'Get a free quote for container sales, rental and logistics services.',
      url: 'https://pekcon.com/en/contact',
      siteName: 'PEKCON Container & Logistics',
      type: 'website',
    },
  };
}

export default async function ContactPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const t = getTranslations(locale);

  const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'PEKCON Container & Logistics',
    url: 'https://pekcon.com',
    telephone: '+902122979758',
    email: 'info@pekcon.com',
    image: 'https://pekcon.com/x2.webp',
    logo: 'https://pekcon.com/logo.png',
    description: locale === 'tr'
      ? 'PEKCON, İstanbul Kağıthane merkezli konteyner satış, kiralama ve lojistik çözüm ortağıdır.'
      : 'PEKCON is an Istanbul-based container sales, rental and logistics solutions provider.',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Kağıthane',
      addressLocality: 'İstanbul',
      addressRegion: 'İstanbul',
      addressCountry: 'TR',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 41.0772,
      longitude: 28.9784,
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '09:00',
        closes: '18:00',
      },
    ],
    contactPoint: [
      {
        '@type': 'ContactPoint',
        telephone: '+902122979758',
        contactType: 'customer service',
        areaServed: 'TR',
        availableLanguage: ['Turkish', 'English'],
      },
      {
        '@type': 'ContactPoint',
        telephone: '+905427179357',
        contactType: 'customer service',
        contactOption: 'TollFree',
        availableLanguage: ['Turkish'],
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-50 py-20">
      <JsonLd data={localBusinessSchema} />
      <BreadcrumbJsonLd locale={locale} slug="iletisim" />
      <div className="container mx-auto px-4 pt-20">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-display font-black text-dark-900 mb-4">
            {t.contactPage.title}
          </h1>
          <p className="text-lg text-dark-700">
            {t.contactPage.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Phone */}
          <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
            <div className="w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Phone className="w-8 h-8 text-primary-500" />
            </div>
            <h3 className="text-xl font-display font-bold text-dark-900 mb-2">{t.contactPage.phone}</h3>
            <a
              href="tel:+902122979758"
              className="text-primary-500 hover:text-primary-600 font-medium"
            >
              +90 (212) 297 97 58
            </a>
          </div>

          {/* Email */}
          <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
            <div className="w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Mail className="w-8 h-8 text-primary-500" />
            </div>
            <h3 className="text-xl font-display font-bold text-dark-900 mb-2">{t.contactPage.email}</h3>
            <a
              href="mailto:info@pekcon.com"
              className="text-primary-500 hover:text-primary-600 font-medium"
            >
              info@pekcon.com
            </a>
          </div>

          {/* Address */}
          <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
            <div className="w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-8 h-8 text-primary-500" />
            </div>
            <h3 className="text-xl font-display font-bold text-dark-900 mb-2">{t.contactPage.address}</h3>
            <p className="text-dark-700">
              {t.contactPage.addressLine}
            </p>
          </div>
        </div>

        <div className="max-w-6xl mx-auto mt-12">
          <div className="bg-white rounded-2xl overflow-hidden shadow-lg">
            <iframe
              src="https://maps.google.com/maps?q=3XGC%2BVQ%20Ka%C4%9F%C4%B1thane,%20%C4%B0stanbul&t=&z=15&ie=UTF8&iwloc=&output=embed"
              width="100%"
              height="450"
              className="border-0"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="PEKCON Kağıthane Office Location"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
