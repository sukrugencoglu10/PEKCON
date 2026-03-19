import TransportCalculator from '@/components/widgets/TransportCalculator';
import type { Locale } from '@/lib/i18n';

export const revalidate = 3600;

export default async function CostCalculatorPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;

  return (
    <main className="pt-0">
      <TransportCalculator locale={locale} />
    </main>
  );
}
