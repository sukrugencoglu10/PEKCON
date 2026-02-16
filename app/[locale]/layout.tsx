import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ChatWidget from '@/components/widgets/ChatWidget';
import WhatsAppButton from '@/components/widgets/WhatsAppButton';
import { Inter, Satisfy } from 'next/font/google';
import AnalyticsEvents from '@/components/analytics/AnalyticsEvents';
import Script from 'next/script';

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

// Generate static params for locales
export async function generateStaticParams() {
  return [{ locale: 'tr' }, { locale: 'en' }];
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const gtmId = process.env.NEXT_PUBLIC_GTM_ID || 'GTM-536W5D89';

  return (
    <html lang={locale} className={`${inter.variable} ${satisfy.variable}`}>
      <body className="font-sans antialiased">
        <Script
          id="gtm-script"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','${gtmId}');
            `,
          }}
        />
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
        <AnalyticsEvents />
        <Header locale={locale} />
        <main>{children}</main>
        <Footer locale={locale} />
        <ChatWidget />
        <WhatsAppButton />
      </body>
    </html>
  );
}
