import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ChatWidget from '@/components/widgets/ChatWidget';
import WhatsAppButton from '@/components/widgets/WhatsAppButton';
import { Inter, Satisfy } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const satisfy = Satisfy({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-satisfy',
  display: 'swap',
});

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
    <html lang={locale} className={`${inter.variable} ${satisfy.variable}`}>
      <body className="font-sans antialiased">
        <Header locale={locale} />
        <main>{children}</main>
        <Footer locale={locale} />
        <ChatWidget />
        <WhatsAppButton />
      </body>
    </html>
  );
}
