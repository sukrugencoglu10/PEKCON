import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'PEKCON Container & Logistics',
  description: 'Uluslararası taşımacılık ve konteyner tedariğinde güvenilir çözüm ortağınız',

  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      { rel: 'icon', url: '/favicon-192x192.png', sizes: '192x192', type: 'image/png' },
      { rel: 'icon', url: '/favicon-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
  },

  openGraph: {
    title: 'PEKCON Container & Logistics',
    description: 'Küresel lojistikte güvenilir çözüm ortağınız',
    url: 'https://pekcon.com.tr',
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
