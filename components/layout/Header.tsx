"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, Phone, Mail, ChevronDown, Calculator, Layers, Lock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { getTranslations, type Locale } from "@/lib/i18n";
import { flagWave } from "@/lib/animations";
import { trackLanguageSwitch } from "@/lib/gtm";
import { TRFlag, UKFlag } from "@/components/ui/Flag";

interface DropdownItem {
  href: string;
  label: string;
  icon?: React.ReactNode;
}

interface NavLink {
  href: string;
  label: string;
  dropdown?: DropdownItem[];
}

export default function Header({ locale = "tr" }: { locale?: string }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();
  const t = getTranslations(locale as Locale);

  const isActive = (href: string) => {
    if (href === `/${locale}`) {
      return pathname === `/${locale}` || pathname === `/${locale}/`;
    }
    return pathname.startsWith(href);
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const servicesDropdown: DropdownItem[] = locale === 'en' ? [
    {
      href: `/en/services`,
      label: t.nav.services || 'Our Services',
      icon: <Layers size={16} />,
    },
    {
      href: `/en/cost-calculator`,
      label: t.calculator?.title || 'Cost Calculator',
      icon: <Calculator size={16} />,
    },
  ] : [
    {
      href: `/${locale}/hizmetlerimiz`,
      label: t.nav.services || 'Hizmetlerimiz',
      icon: <Layers size={16} />,
    },
    {
      href: `/${locale}/maliyet-hesaplayici`,
      label: t.calculator?.title || 'Yurt İçi Konteyner Taşıma Maliyet Hesaplayıcı',
      icon: <Calculator size={16} />,
    },
  ];

  const navLinks: NavLink[] = locale === 'en' ? [
    { href: `/en`, label: t.nav.home },
    { href: `/en/containers`, label: t.nav.containers },
    { href: `/en/services`, label: t.nav.services, dropdown: servicesDropdown },
    { href: `/en/about`, label: t.nav.about },
    { href: `/en/contact`, label: t.nav.contact },
  ] : [
    { href: `/${locale}`, label: t.nav.home },
    { href: `/${locale}/konteynerler`, label: t.nav.containers },
    { href: `/${locale}/hizmetlerimiz`, label: t.nav.services, dropdown: servicesDropdown },
    { href: `/${locale}/hakkimizda`, label: t.nav.about },
    { href: `/${locale}/iletisim`, label: t.nav.contact },
  ];

  return (
    <header className="sticky top-0 left-0 right-0 z-50 transition-all duration-300 bg-white">
      {/* Top Bar */}
      <div className="bg-secondary-500 text-white py-1.5">
        <div className="container mx-auto px-4 lg:px-12 xl:px-20">
          <div className="flex flex-wrap justify-center md:justify-end items-center gap-x-4 gap-y-1 md:space-x-4 text-[12px] sm:text-[13px] md:text-sm font-medium">
            <a
              href="tel:+902122979758"
              className="flex items-center space-x-2 hover:text-primary-400 transition-colors"
            >
              <Phone size={16} className="w-3.5 h-3.5 md:w-4 md:h-4" />
              <span>+90 (212) 297 97 58</span>
            </a>
            <a
              href="mailto:info@pekcon.com.tr"
              className="flex items-center space-x-2 hover:text-primary-400 transition-colors"
            >
              <Mail size={16} className="w-3.5 h-3.5 md:w-4 md:h-4" />
              <span>info@pekcon.com.tr</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="bg-white border-b-2 border-gray-300 shadow-md py-3 md:py-2">
        <div className="container mx-auto px-4 lg:px-12 xl:px-20">
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
                  className="h-14 md:h-[70px] w-auto select-none"
                  draggable={false}
                  onDoubleClick={(e) => { e.preventDefault(); e.stopPropagation(); router.push('/admin'); }}
                />
                <div className="absolute left-[105%] top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-x-[-10px] group-hover:translate-x-0 pointer-events-none min-w-[150px]">
                  <div className="flex flex-col leading-[1.1]">
                    {t.manager.split("\n").map((line, idx, arr) => (
                      <span
                        key={idx}
                        className={cn(
                          "block whitespace-nowrap",
                          idx === 0 && arr.length > 1
                            ? "text-[9px] uppercase tracking-wider font-sans font-bold text-gray-500"
                            : "font-signature text-base text-secondary-600",
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
            <nav className="hidden lg:flex items-center space-x-5" ref={dropdownRef}>
              {navLinks.map((link) => (
                <div key={link.href} className="relative">
                  {link.dropdown ? (
                    <div
                      onMouseEnter={() => setOpenDropdown(link.href)}
                      onMouseLeave={() => setOpenDropdown(null)}
                    >
                      <Link
                        href={link.href}
                        className={cn(
                          "px-3 py-1.5 text-lg rounded-md font-medium transition-all duration-300",
                          isActive(link.href)
                            ? "bg-secondary-500 text-white"
                            : "text-secondary-500 hover:bg-secondary-500 hover:text-white"
                        )}
                      >
                        {link.label}
                      </Link>

                      <AnimatePresence>
                        {openDropdown === link.href && (
                          <motion.div
                            initial={{ opacity: 0, y: -6 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -6 }}
                            transition={{ duration: 0.15 }}
                            className="absolute top-full left-0 mt-1 min-w-[280px] bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden z-50"
                          >
                            {link.dropdown.map((item) => (
                              <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                  "flex items-center gap-3 px-4 py-3 text-sm font-medium transition-all duration-150",
                                  isActive(item.href)
                                    ? "bg-secondary-50 text-secondary-600"
                                    : "text-gray-700 hover:bg-secondary-50 hover:text-secondary-600"
                                )}
                              >
                                {item.icon && (
                                  <span className="flex-shrink-0 text-secondary-400">{item.icon}</span>
                                )}
                                {item.label}
                              </Link>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ) : (
                    <Link
                      href={link.href}
                      className={cn(
                        "px-3 py-1.5 text-lg rounded-md font-medium transition-all duration-300",
                        isActive(link.href)
                          ? "bg-secondary-500 text-white"
                          : "text-secondary-500 hover:bg-secondary-500 hover:text-white"
                      )}
                    >
                      {link.label}
                    </Link>
                  )}
                </div>
              ))}
            </nav>

            {/* CTA & Language Switcher */}
            <div className="hidden lg:flex items-center">
              <div className="flex items-center space-x-2 ml-[20px]">
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
                    <TRFlag className="w-[36px] h-[24px]" />
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
                    <UKFlag className="w-[36px] h-[24px]" />
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
                  <div key={link.href}>
                    {link.dropdown ? (
                      <>
                        <div className="flex items-center">
                          <Link
                            href={link.href}
                            className={cn(
                              "flex-1 px-4 py-2 rounded-md font-medium transition-all",
                              isActive(link.href)
                                ? "bg-secondary-500 text-white"
                                : "text-secondary-500 hover:bg-secondary-500 hover:text-white"
                            )}
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            {link.label}
                          </Link>
                          <button
                            onClick={() =>
                              setMobileDropdownOpen(
                                mobileDropdownOpen === link.href ? null : link.href
                              )
                            }
                            className="p-2 text-secondary-500"
                            aria-label="Alt menüyü aç"
                          >
                            <ChevronDown
                              size={18}
                              className={cn(
                                "transition-transform duration-200",
                                mobileDropdownOpen === link.href ? "rotate-180" : ""
                              )}
                            />
                          </button>
                        </div>
                        <AnimatePresence>
                          {mobileDropdownOpen === link.href && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="overflow-hidden"
                            >
                              {link.dropdown.map((item) => (
                                <Link
                                  key={item.href}
                                  href={item.href}
                                  className="flex items-center gap-2 pl-8 pr-4 py-2 text-sm text-gray-600 hover:text-secondary-500 transition-colors"
                                  onClick={() => setIsMobileMenuOpen(false)}
                                >
                                  {item.icon && <span className="text-secondary-400">{item.icon}</span>}
                                  {item.label}
                                </Link>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </>
                    ) : (
                      <Link
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
                    )}
                  </div>
                ))}
                <div className="flex justify-start mt-2 pt-3 border-t border-gray-100">
                  <Link
                    href="/admin"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-1.5 px-2 py-1 text-xs text-gray-300 hover:text-gray-400 transition-colors"
                  >
                    <Lock size={11} />
                    <span>Yönetici</span>
                  </Link>
                </div>
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
