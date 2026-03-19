import ContactSection from '@/components/home/ContactSection';
import type { Locale } from '@/lib/i18n';

// ISR: Revalidate every 30 minutes (form page)
export const revalidate = 1800;

export default async function QuotePage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;

  return (
    <div className="min-h-screen bg-zinc-950 pt-12">
      <ContactSection locale={locale} />
    </div>
  );
}
