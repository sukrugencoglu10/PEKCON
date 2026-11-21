import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '../globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'PEKCON Admin Paneli',
  robots: { index: false, follow: false },
  icons: {
    icon: '/favicon.png',
  },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr">
      <body className={`${inter.className} antialiased bg-slate-50 text-slate-900 min-h-screen`}>
        {children}
      </body>
    </html>
  );
}
