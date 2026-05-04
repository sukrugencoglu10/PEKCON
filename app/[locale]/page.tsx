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
const FAQSection = dynamic(() => import('@/components/home/FAQSection'));
const CTASection = dynamic(() => import('@/components/home/CTASection'));

import { getKeywordConfig } from '@/lib/keyword-config';
import type { Locale } from '@/lib/i18n';
import type { Metadata } from 'next';
import { containers } from '@/data/containers';

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

  const title = kwConfig?.title ?? (locale === 'tr'
    ? 'Satılık Konteyner | Sıfır & İkinci El Yük Konteynerleri | PEKCON'
    : 'Shipping Containers for Sale | New & Used SOC Containers | PEKCON');

  const description = kwConfig?.description ?? (locale === 'tr'
    ? 'Satılık ve kiralık 20ft, 40ft, 40HC yük konteynerleri. Sıfır ve ikinci el seçenekler, hızlı teklif, Türkiye\'den dünyaya teslimat. 15+ yıl tecrübe ile PEKCON.'
    : 'Shipping containers for sale and rent: 20ft, 40ft, 40HC. New and used SOC containers, fast quote, worldwide delivery from Türkiye. 15+ years of experience.');

  const ogImage = {
    url: 'https://pekcon.com/hero-bg.webp',
    width: 1200,
    height: 630,
    alt: locale === 'tr'
      ? 'PEKCON - Satılık Yük Konteynerleri'
      : 'PEKCON - Shipping Containers for Sale',
  };

  const keywords = locale === 'tr'
    ? ['satılık konteyner', 'yük konteyneri', '20ft konteyner', '40ft konteyner', '40HC konteyner', 'sıfır konteyner', 'ikinci el konteyner', 'konteyner kiralama', 'SOC konteyner', 'reefer konteyner', 'konteyner fiyatları', 'PEKCON', 'İstanbul konteyner', 'Türkiye konteyner ihracat']
    : ['shipping container for sale', 'cargo container', '20ft container', '40ft container', '40HC container', 'new container', 'used container', 'container rental', 'SOC container', 'reefer container', 'container prices', 'PEKCON', 'Türkiye container export'];

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: locale === 'tr' ? '/tr' : '/en',
      languages: {
        'tr-TR': '/tr',
        'en-US': '/en',
        'x-default': '/tr',
      },
    },
    openGraph: {
      title,
      description,
      url: locale === 'tr' ? 'https://pekcon.com/tr' : 'https://pekcon.com/en',
      siteName: 'PEKCON Container & Logistics',
      locale: locale === 'tr' ? 'tr_TR' : 'en_US',
      type: 'website',
      images: [ogImage],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage.url],
    },
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
    email: 'info@pekcon.com',
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

  const localeContainers = ((containers as any)[locale] || (containers as any).tr) as Array<{
    id: string;
    name: string;
    type: string;
    image: string;
    dimensions: { external: { length: number; width: number; height: number } };
    capacity: { volume: number; maxPayload: number };
  }>;
  const baseUrl = 'https://pekcon.com';
  const quoteUrl = `${baseUrl}/${locale}/teklif-al`;

  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: locale === 'tr' ? 'Yük Konteyneri Modelleri' : 'Shipping Container Models',
    numberOfItems: localeContainers.length,
    itemListElement: localeContainers.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'Product',
        '@id': `${baseUrl}/${locale}/konteynerler#${c.id}`,
        name: c.name,
        sku: c.type,
        image: `${baseUrl}${c.image}`,
        description: locale === 'tr'
          ? `${c.name} - ${c.dimensions.external.length}m uzunluk, ${c.capacity.volume} m³ hacim, ${c.capacity.maxPayload} kg yük kapasitesi. Sıfır ve ikinci el seçeneklerle PEKCON'dan hızlı teklif.`
          : `${c.name} - ${c.dimensions.external.length}m length, ${c.capacity.volume} m³ volume, ${c.capacity.maxPayload} kg payload capacity. New and used options, fast quote from PEKCON.`,
        brand: { '@type': 'Brand', name: 'PEKCON' },
        category: locale === 'tr' ? 'Yük Konteyneri' : 'Shipping Container',
        offers: {
          '@type': 'Offer',
          availability: 'https://schema.org/InStock',
          url: quoteUrl,
          priceCurrency: locale === 'tr' ? 'TRY' : 'USD',
          seller: { '@type': 'Organization', name: 'PEKCON Container & Logistics' },
        },
      },
    })),
  };

  return (
    <>
      <JsonLd data={organizationSchema} />
      <JsonLd data={itemListSchema} />
      <HeroSection locale={locale} keyword={keyword} />
      <TrustSlider locale={locale} />
      <StatsSection locale={locale} />
      <SegmentationCards locale={locale} />
      <ContainerShowcase locale={locale} />
      <ServicesOverview locale={locale} />
      <FAQSection locale={locale} />
      <CTASection locale={locale} />
      <StickyQuoteBar locale={locale} />
    </>
  );
}
