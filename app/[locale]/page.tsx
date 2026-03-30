import HeroSection from '@/components/home/HeroSection';
import TrustSlider from '@/components/home/TrustSlider';
import StatsSection from '@/components/home/StatsSection';
import SegmentationCards from '@/components/home/SegmentationCards';
import ServicesOverview from '@/components/home/ServicesOverview';
import ContainerShowcase from '@/components/home/ContainerShowcase';
import CTASection from '@/components/home/CTASection';
import StickyQuoteBar from '@/components/home/StickyQuoteBar';

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

  return (
    <>
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
