import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ChatWidget from '@/components/widgets/ChatWidget';
import WhatsAppButton from '@/components/widgets/WhatsAppButton';

export const metadata: Metadata = {
  title: 'PEKCON Container & Logistics',
  description: 'Küresel lojistikte güvenilir çözüm ortağınız',
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <>
      <Header locale={locale} />
      <main>{children}</main>
      <Footer locale={locale} />
      <ChatWidget />
      <WhatsAppButton />
    </>
  );
}
