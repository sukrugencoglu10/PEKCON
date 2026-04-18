import Image from 'next/image';
import { getTranslations, type Locale } from '@/lib/i18n';
import type { Metadata } from 'next';
import JsonLd from '@/components/seo/JsonLd';

// ISR: Revalidate every 1 hour
export const revalidate = 3600;

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  if (locale === 'tr') {
    return {
      title: 'Hakkımızda | PEKCON Konteyner & Lojistik',
      description: '2009\'den bu yana Türkiye\'nin güvenilir konteyner ve lojistik çözüm ortağı PEKCON. 500+ mutlu müşteri, 1000+ tamamlanan proje ve 15+ yıllık sektör deneyimi.',
      alternates: { canonical: 'https://pekcon.com/tr/hakkimizda', languages: { 'tr': 'https://pekcon.com/tr/hakkimizda', 'en': 'https://pekcon.com/en/about' } },
      openGraph: {
        title: 'Hakkımızda | PEKCON Konteyner & Lojistik',
        description: '2009\'den bu yana Türkiye\'nin güvenilir konteyner ve lojistik çözüm ortağı.',
        url: 'https://pekcon.com/tr/hakkimizda',
        siteName: 'PEKCON Container & Logistics',
        type: 'website',
      },
    };
  }
  return {
    title: 'About Us | PEKCON Container & Logistics',
    description: 'PEKCON – Your trusted container and logistics partner since 2009. 500+ clients, 1000+ completed projects, 15+ years of industry expertise in Turkey and globally.',
    alternates: { canonical: 'https://pekcon.com/en/about', languages: { 'tr': 'https://pekcon.com/tr/hakkimizda', 'en': 'https://pekcon.com/en/about' } },
    openGraph: {
      title: 'About Us | PEKCON Container & Logistics',
      description: 'Your trusted container and logistics partner since 2009.',
      url: 'https://pekcon.com/en/about',
      siteName: 'PEKCON Container & Logistics',
      type: 'website',
    },
  };
}

export default async function AboutPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const t = getTranslations(locale);

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'PEKCON Container & Logistics',
    url: 'https://pekcon.com',
    logo: 'https://pekcon.com/logo.png',
    foundingDate: '2009',
    numberOfEmployees: { '@type': 'QuantitativeValue', value: 50 },
    description: locale === 'tr'
      ? '2009 yılından itibaren konteyner satış, kiralama ve global lojistik alanında hizmet veren PEKCON, 500+ müşteri ve 1000+ projeyle Türkiye\'nin güvenilir çözüm ortağıdır.'
      : 'PEKCON has been providing container sales, rental and global logistics solutions since 2009, with 500+ clients and 1000+ completed projects.',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'İstanbul',
      addressCountry: 'TR',
    },
  };

  return (
    <div className="min-h-screen bg-white py-20">
      <JsonLd data={organizationSchema} />
      <div className="container mx-auto px-4 pt-20">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12 items-start">
            <div>
              <h1 className="text-4xl md:text-5xl font-display font-black text-dark-900 mb-12 text-center">
                {t.about.title}
              </h1>
              <div className="prose prose-lg max-w-none">
                {t.about.description.split('\n\n').map((para, i) => (
                  <p key={i} className="text-lg text-dark-700 leading-relaxed mb-6 indent-4 md:indent-8">
                    {para}
                  </p>
                ))}
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-12">
                <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm text-center">
                  <div className="text-3xl font-black text-primary-600 mb-2">500+</div>
                  <div className="text-sm font-bold text-dark-600 uppercase tracking-wider">
                    {locale === 'tr' ? 'Mutlu Müşteri' : 'Happy Customers'}
                  </div>
                </div>
                <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm text-center">
                  <div className="text-3xl font-black text-primary-600 mb-2">1000+</div>
                  <div className="text-sm font-bold text-dark-600 uppercase tracking-wider">
                    {locale === 'tr' ? 'Tamamlanan Proje' : 'Completed Projects'}
                  </div>
                </div>
                <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm text-center">
                  <div className="text-3xl font-black text-primary-600 mb-2">15+</div>
                  <div className="text-sm font-bold text-dark-600 uppercase tracking-wider">
                    {locale === 'tr' ? 'Yıllık Deneyim' : 'Years of Experience'}
                  </div>
                </div>
              </div>
            </div>

            {/* Image on the right */}
            <div className="relative h-[300px] md:h-[450px] lg:h-[600px] rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="/x2.webp"
                alt="PEKCON Container & Logistics"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                quality={85}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
