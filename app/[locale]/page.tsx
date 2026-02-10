import HeroSection from '@/components/home/HeroSection';
import StatsSection from '@/components/home/StatsSection';
import ServicesOverview from '@/components/home/ServicesOverview';
import ContainerShowcase from '@/components/home/ContainerShowcase';
import CTASection from '@/components/home/CTASection';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <StatsSection />
      <ServicesOverview />
      <ContainerShowcase />
      <CTASection />
    </>
  );
}
