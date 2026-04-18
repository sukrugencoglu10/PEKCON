import dynamic from 'next/dynamic';
import HeroSection from '@/components/home/HeroSection';
import TrustSlider from '@/components/home/TrustSlider';
import StatsSection from '@/components/home/StatsSection';
import SegmentationCards from '@/components/home/SegmentationCards';
import StickyQuoteBar from '@/components/home/StickyQuoteBar';
import JsonLd from '@/components/seo/JsonLd';

// Below-the-fold: lazy load for smaller initial bundle
const ContainerShowcase = dynamic(() => import('@/components/home/ContainerShowcase'));
const ServicesOverview = dynamic(() => import('@/components/home/ServicesOverview'));
const CTASection = dynamic(() => import('@/components/home/CTASection'));

import { getKeywordConfig } from '@/lib/keyword-config';
import type { Locale } from '@/lib/i18n';
import type { Metadata } from 'next';

// ISR: Revalidate every 1 hour
export const revalidate = 3600;

// Dynamic metadata based on keyword parameter
export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ locale: Locale }>;
  searchParams: Promise<{ keyword?: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const { keyword } = await searchParams;
  const kwConfig = getKeywordConfig(locale, keyword || null);

  if (kwConfig) {
    return {
      title: kwConfig.title,
      description: kwConfig.description,
    };
  }

  return {
    title: 'PEKCON Container & Logistics',
    description: locale === 'tr'
      ? 'Küresel lojistikte güvenilir çözüm ortağınız'
      : 'Your trusted partner in global logistics',
  };
}

export default async function HomePage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: Locale }>;
  searchParams: Promise<{ keyword?: string }>;
}) {
  const { locale } = await params;
  const { keyword } = await searchParams;

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': ['Organization', 'LocalBusiness'],
    name: 'PEKCON Container & Logistics',
    alternateName: 'PEKCON',
    url: 'https://pekcon.com',
    logo: 'https://pekcon.com/logo.png',
    image: 'https://pekcon.com/x2.webp',
    telephone: '+902122979758',
    email: 'info@pekcon.com.tr',
    foundingDate: '2009',
    description: locale === 'tr'
      ? 'Türkiye\'nin güvenilir konteyner satış, kiralama ve lojistik çözüm ortağı. 15+ yıllık deneyim.'
      : 'Turkey\'s trusted container sales, rental and global logistics partner. 15+ years of experience.',
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
    sameAs: [
      'https://wa.me/905427179357',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+902122979758',
      contactType: 'customer service',
      availableLanguage: ['Turkish', 'English'],
    },
    numberOfEmployees: { '@type': 'QuantitativeValue', value: 50 },
    areaServed: {
      '@type': 'GeoCircle',
      geoMidpoint: { '@type': 'GeoCoordinates', latitude: 39.9334, longitude: 32.8597 },
      geoRadius: 5000000,
    },
  };

  return (
    <>
      <JsonLd data={organizationSchema} />
      <HeroSection locale={locale} keyword={keyword} />
      <TrustSlider locale={locale} />
      <StatsSection locale={locale} />
      <SegmentationCards locale={locale} />
      <ContainerShowcase locale={locale} />
      <ServicesOverview locale={locale} />
      <CTASection locale={locale} />
      <StickyQuoteBar locale={locale} />
    </>
  );
}
