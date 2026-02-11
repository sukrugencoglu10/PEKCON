'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X, Phone, Mail } from 'lucide-react';
import { motion } from 'framer-motion';
import Button from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { getTranslations, type Locale } from '@/lib/i18n';
import { flagWave } from '@/lib/animations';

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
    { href: `/${locale}/konteynerlar`, label: t.nav.containers },
    { href: `/${locale}/hizmetlerimiz`, label: t.nav.services },
    { href: `/${locale}/hakkimizda`, label: t.nav.about },
    { href: `/${locale}/iletisim`, label: t.nav.contact },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
      {/* Top Bar */}
      <div className="bg-secondary-500 text-white py-2 hidden md:block">
        <div className="container mx-auto px-4">
          <div className="flex justify-end items-center space-x-6 text-sm font-medium">
            <a href="tel:+902122979758" className="flex items-center space-x-2 hover:text-primary-400 transition-colors">
              <Phone size={14} />
              <span>+90 (212) 297 97 58</span>
            </a>
            <a href="mailto:info@pekcon.com.tr" className="flex items-center space-x-2 hover:text-primary-400 transition-colors">
              <Mail size={14} />
              <span>info@pekcon.com.tr</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="bg-white shadow-md py-4">
        <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link
            href={`/${locale}`}
            className="flex items-center p-0 m-0 overflow-visible group"
          >
            <motion.div
              variants={flagWave}
              initial="rest"
              animate="animate"
              className="origin-left flex items-center"
            >
              <Image
                src="/images/logo.svg"
                alt="PEKCON Container & Logistics"
                width={207}
                height={69}
                className="h-14 w-auto"
                priority
              />
              <div className="absolute left-[105%] top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-x-[-10px] group-hover:translate-x-0 pointer-events-none min-w-[150px]">
                <div className="flex flex-col leading-[1.1]">
                  {t.manager.split('\n').map((line, idx, arr) => (
                    <span 
                      key={idx} 
                      className={cn(
                        "block whitespace-nowrap",
                        idx === 0 && arr.length > 1 
                          ? "text-[10px] uppercase tracking-wider font-sans font-bold text-gray-500" 
                          : "font-signature text-lg text-secondary-600"
                      )}
                    >
                      {line}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
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
    </div>
  </header>
  );
}
