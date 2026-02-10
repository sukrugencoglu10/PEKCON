import HeroSection from '@/components/home/HeroSection';
import StatsSection from '@/components/home/StatsSection';
import ServicesOverview from '@/components/home/ServicesOverview';
import ContainerShowcase from '@/components/home/ContainerShowcase';
import CTASection from '@/components/home/CTASection';
import type { Locale } from '@/lib/i18n';

export default function HomePage({ params }: { params: { locale: Locale } }) {
  const locale = params.locale;

  return (
    <>
      <HeroSection locale={locale} />
      <StatsSection locale={locale} />
      <ServicesOverview locale={locale} />
      <ContainerShowcase locale={locale} />
      <CTASection locale={locale} />
    </>
  );
}
