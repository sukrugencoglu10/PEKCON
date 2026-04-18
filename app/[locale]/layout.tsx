import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ChatWidget from '@/components/widgets/ChatWidget';
import WhatsAppButton from '@/components/widgets/WhatsAppButton';
import { Inter, Satisfy } from 'next/font/google';
import GoogleTagManager from '@/components/analytics/GoogleTagManager';
import AnalyticsEvents from '@/components/analytics/AnalyticsEvents';
import MicrosoftClarity from '@/components/analytics/MicrosoftClarity';
import MetaPixel from '@/components/analytics/MetaPixel';
import { Suspense } from 'react';
import type { Viewport } from 'next';

import ExitIntentPopup from '@/components/widgets/ExitIntentPopup';
import { TrackingProvider } from '@/components/TrackingProvider';

export const viewport: Viewport = {
  themeColor: '#0069b4',
};

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
  title: {
    default: 'PEKCON Container & Logistics',
    template: '%s | PEKCON',
  },
  description: 'Küresel lojistikte güvenilir çözüm ortağınız. Konteyner satış, kiralama ve taşımacılık hizmetleri.',
  metadataBase: new URL('https://pekcon.com'),
  icons: {
    icon: '/favicon.png',
  },
  openGraph: {
    type: 'website',
    siteName: 'PEKCON Container & Logistics',
    images: [
      {
        url: '/x2.webp',
        width: 1200,
        height: 630,
        alt: 'PEKCON Container & Logistics',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@pekcon',
    images: ['/x2.webp'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
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

  return (
    <html lang={locale} className={`${inter.variable} ${satisfy.variable}`}>
      <head>
        {/* Preload hero image handled by next/image priority internally — preconnect to domains instead */}
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://connect.facebook.net" />
        <link rel="dns-prefetch" href="https://www.clarity.ms" />
      </head>
      <body className="font-sans antialiased">
        <Suspense fallback={null}>
          <GoogleTagManager gtmId="GTM-536W5D89" />
          <MicrosoftClarity />
          <MetaPixel />
          <AnalyticsEvents />
          <TrackingProvider />
        </Suspense>
        <Header locale={locale} />
        <main>{children}</main>
        <Footer locale={locale} />
        <ExitIntentPopup locale={locale as 'tr' | 'en'} />
        <ChatWidget />
        <WhatsAppButton />
      </body>
    </html>
  );
}
