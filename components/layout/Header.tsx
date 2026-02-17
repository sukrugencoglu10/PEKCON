"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, Phone, Mail } from "lucide-react";
import { motion } from "framer-motion";
import Button from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { getTranslations, type Locale } from "@/lib/i18n";
import { flagWave } from "@/lib/animations";
import { trackLanguageSwitch } from "@/lib/gtm";
import { TRFlag, UKFlag } from "@/components/ui/Flag";

export default function Header({ locale = "tr" }: { locale?: string }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const t = getTranslations(locale as Locale);

  // Check if a link is active
  const isActive = (href: string) => {
    // Exact match for home page
    if (href === `/${locale}`) {
      return pathname === `/${locale}` || pathname === `/${locale}/`;
    }
    // For other pages, check if pathname starts with the href
    return pathname.startsWith(href);
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: `/${locale}`, label: t.nav.home },
    { href: `/${locale}/konteynerlar`, label: t.nav.containers },
    { href: `/${locale}/hizmetlerimiz`, label: t.nav.services },
    { href: `/${locale}/hakkimizda`, label: t.nav.about },
    { href: `/${locale}/iletisim`, label: t.nav.contact },
  ];

  return (
    <header className="sticky top-0 left-0 right-0 z-50 transition-all duration-300 bg-white">
      {/* Top Bar */}
      <div className="bg-secondary-500 text-white py-2">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center md:justify-end items-center gap-x-4 gap-y-1 md:space-x-6 text-[11px] sm:text-xs md:text-sm font-medium">
            <a
              href="tel:+905543545201"
              className="flex items-center space-x-2 hover:text-primary-400 transition-colors"
            >
              <Phone size={14} className="w-3 h-3 md:w-3.5 md:h-3.5" />
              <span>+90 (554) 354 52 01</span>
            </a>
            <a
              href="mailto:info@pekcon.com.tr"
              className="flex items-center space-x-2 hover:text-primary-400 transition-colors"
            >
              <Mail size={14} className="w-3 h-3 md:w-3.5 md:h-3.5" />
              <span>info@pekcon.com.tr</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="bg-white border-b-2 border-gray-300 shadow-md py-2 md:py-4">
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
                  src="/SVGpekcon_x.svg"
                  alt="PEKCON Container & Logistics"
                  width={207}
                  height={69}
                  className="h-16 md:h-[140px] w-auto"
                  priority
                />
                <div className="absolute left-[105%] top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-x-[-10px] group-hover:translate-x-0 pointer-events-none min-w-[150px]">
                  <div className="flex flex-col leading-[1.1]">
                    {t.manager.split("\n").map((line, idx, arr) => (
                      <span
                        key={idx}
                        className={cn(
                          "block whitespace-nowrap",
                          idx === 0 && arr.length > 1
                            ? "text-[10px] uppercase tracking-wider font-sans font-bold text-gray-500"
                            : "font-signature text-lg text-secondary-600",
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
                  className={cn(
                    "px-4 py-2 rounded-md font-medium transition-all duration-300",
                    isActive(link.href)
                      ? "bg-secondary-500 text-white"
                      : "text-secondary-500 hover:bg-secondary-500 hover:text-white"
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* CTA & Language Switcher */}
            <div className="hidden lg:flex items-center">
              <Link href={`/${locale}/teklif-al`}>
                <Button variant="primary" size="md" className="scale-[1.15]">
                  {t.nav.quote}
                </Button>
              </Link>
              <div className="flex items-center space-x-2 ml-[40px]">
                <Link href="/tr">
                  <button
                    aria-label="Türkçe"
                    onClick={() => trackLanguageSwitch(locale, 'tr')}
                    className={cn(
                      "p-0 text-sm font-medium rounded transition-colors",
                      locale === "tr"
                        ? "border-2 border-red-600 shadow-md scale-110"
                        : "border-2 border-transparent opacity-70 hover:opacity-100 hover:scale-105",
                    )}
                  >
                    <TRFlag className="w-[47px] h-[31px]" />
                  </button>
                </Link>
                <Link href="/en">
                  <button
                    aria-label="English"
                    onClick={() => trackLanguageSwitch(locale, 'en')}
                    className={cn(
                      "p-0 text-sm font-medium rounded transition-colors",
                      locale === "en"
                        ? "border-2 border-blue-600 shadow-md scale-110"
                        : "border-2 border-transparent opacity-70 hover:opacity-100 hover:scale-105",
                    )}
                  >
                    <UKFlag className="w-[47px] h-[31px]" />
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
                    className={cn(
                      "px-4 py-2 rounded-md font-medium transition-all",
                      isActive(link.href)
                        ? "bg-secondary-500 text-white"
                        : "text-secondary-500 hover:bg-secondary-500 hover:text-white"
                    )}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
                <Link
                  href={`/${locale}/teklif-al`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Button variant="primary" size="md" className="w-full mt-2">
                    {t.nav.quote}
                  </Button>
                </Link>
                <div className="flex items-center justify-center space-x-2 mt-4">
                  <Link href="/tr">
                    <button
                      aria-label="Türkçe"
                      className={cn(
                        "p-0 text-sm font-medium rounded transition-colors",
                        locale === "tr"
                          ? "border-2 border-red-600 shadow-md scale-110"
                          : "border-2 border-transparent opacity-70 hover:opacity-100 hover:scale-105"
                      )}
                      onClick={() => {
                        trackLanguageSwitch(locale, 'tr');
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      <TRFlag className="w-[47px] h-[31px]" />
                    </button>
                  </Link>
                  <Link href="/en">
                    <button
                      aria-label="English"
                      className={cn(
                        "p-0 text-sm font-medium rounded transition-colors",
                        locale === "en"
                          ? "border-2 border-blue-600 shadow-md scale-110"
                          : "border-2 border-transparent opacity-70 hover:opacity-100 hover:scale-105"
                      )}
                      onClick={() => {
                        trackLanguageSwitch(locale, 'en');
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      <UKFlag className="w-[47px] h-[31px]" />
                    </button>
                  </Link>
                </div>
              </nav>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
