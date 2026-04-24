import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import type { Viewport } from 'next';

export const viewport: Viewport = {
  themeColor: '#0069b4',
  width: 'device-width',
  initialScale: 1,
  minimumScale: 1,
  maximumScale: 5,
};
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'PEKCON Container & Logistics',
  description: 'Uluslararası taşımacılık ve konteyner tedariğinde güvenilir çözüm ortağınız',

  icons: {
    icon: '/favicon.png',
  },

  openGraph: {
    title: 'PEKCON Container & Logistics',
    description: 'Küresel lojistikte güvenilir çözüm ortağınız',
    url: 'https://pekcon.com',
    siteName: 'PEKCON',
    locale: 'tr_TR',
    type: 'website',
  },

  twitter: {
    card: 'summary_large_image',
    title: 'PEKCON Container & Logistics',
    description: 'Küresel lojistikte güvenilir çözüm ortağınız',
  },

  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
