import HeroSection from '@/components/home/HeroSection';
import StatsSection from '@/components/home/StatsSection';
import ServicesOverview from '@/components/home/ServicesOverview';
import ContainerShowcase from '@/components/home/ContainerShowcase';
import CTASection from '@/components/home/CTASection';
import type { Locale } from '@/lib/i18n';

export default async function HomePage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;

  return (
    <>
      <HeroSection locale={locale} />
      <StatsSection locale={locale} />
      <ContainerShowcase locale={locale} />
      <CTASection locale={locale} />
      <ServicesOverview locale={locale} />
    </>
  );
}
