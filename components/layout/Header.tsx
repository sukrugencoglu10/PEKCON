'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X } from 'lucide-react';
import Button from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { getTranslations, type Locale } from '@/lib/i18n';

export default function Header({ locale = 'tr' }: { locale?: string }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const t = getTranslations(locale as Locale);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: `/${locale}`, label: t.nav.home },
    { href: `/${locale}/hakkimizda`, label: t.nav.about },
    { href: `/${locale}/hizmetlerimiz`, label: t.nav.services },
    { href: `/${locale}/konteynerlar`, label: t.nav.containers },
    { href: `/${locale}/iletisim`, label: t.nav.contact },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-white shadow-md py-4"
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href={`/${locale}`} className="flex items-center">
            <Image
              src="/images/logo.svg"
              alt="PEKCON Container & Logistics"
              width={180}
              height={60}
              className="h-12 w-auto"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-2 rounded-md font-medium text-secondary-500 hover:bg-secondary-500 hover:text-white transition-all duration-300"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* CTA & Language Switcher */}
          <div className="hidden lg:flex items-center space-x-4">
            <Link href={`/${locale}/teklif-al`}>
              <Button variant="primary" size="md">
                {t.nav.quote}
              </Button>
            </Link>
            <div className="flex items-center space-x-2">
              <Link href="/tr">
                <button className={cn(
                  "px-3 py-1 text-sm font-medium rounded transition-colors",
                  locale === 'tr'
                    ? "text-white bg-secondary-500"
                    : "text-secondary-500 hover:bg-secondary-500 hover:text-white"
                )}>
                  TR
                </button>
              </Link>
              <Link href="/en">
                <button className={cn(
                  "px-3 py-1 text-sm font-medium rounded transition-colors",
                  locale === 'en'
                    ? "text-white bg-secondary-500"
                    : "text-secondary-500 hover:bg-secondary-500 hover:text-white"
                )}>
                  EN
                </button>
              </Link>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-secondary-500 hover:text-secondary-600"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden mt-4 pb-4">
            <nav className="flex flex-col space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-4 py-2 rounded-md font-medium text-secondary-500 hover:bg-secondary-500 hover:text-white transition-all"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <Link href={`/${locale}/teklif-al`} onClick={() => setIsMobileMenuOpen(false)}>
                <Button variant="primary" size="md" className="w-full mt-2">
                  {t.nav.quote}
                </Button>
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
