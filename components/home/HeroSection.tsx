'use client';

import { motion, useReducedMotion, AnimatePresence, type Variants } from 'framer-motion';
import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Button from '@/components/ui/Button';
// Hero-specific variants: NO opacity:0 → LCP element always visible
// (staggerContainer/slideUp from lib start at opacity:0, delays LCP on mobile)
const heroStagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};
const heroSlide: Variants = {
  hidden: { y: 20 },
  visible: { y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
};
import { getTranslations, type Locale } from '@/lib/i18n';
import { trackCTAClick } from '@/lib/gtm';
import { getKeywordConfig } from '@/lib/keyword-config';
import QuoteForm from '@/components/forms/QuoteForm';
import ContainerComparison from './ContainerComparison';
import { getCategoryFromType, type ContainerType } from './KonteynerScene';
import { ChevronRight, ChevronDown, Ship } from 'lucide-react';

const KonteynerScene = dynamic(() => import('./KonteynerScene'), {
  ssr: false,
  loading: () => (
    <div className="h-[280px] w-full rounded-3xl bg-white/5 animate-pulse" />
  ),
});

export default function HeroSection({ locale = 'tr', keyword }: { locale?: Locale; keyword?: string }) {
  const t = getTranslations(locale);
  const kwConfig = getKeywordConfig(locale, keyword || null);
  const prefersReducedMotion = useReducedMotion();
  const isDesktopRef = useRef<boolean | null>(null);
  
  const [animState, setAnimState] = useState<'idle' | 'transforming' | 'swimming'>('idle');
  const [selectedContainer, setSelectedContainer] = useState<ContainerType>('40hc');
  const containerCategory = getCategoryFromType(selectedContainer);
  // Render 3D scene on client-side only to prevent hydration mismatch and defer LCP block
  const [showScene, setShowScene] = useState(false);

  useEffect(() => {
    isDesktopRef.current = window.matchMedia('(min-width: 768px) and (pointer: fine)').matches;
    setShowScene(true); // Mobilde de görünsün (CSR, formun altına yerleşecek)
  }, []);

  const handleQuoteClick = (e: React.MouseEvent) => {
    if (animState !== 'idle') return;
    
    e.preventDefault();
    
    // Only animate on mobile/tablet, skip on desktop as requested
    if (isDesktopRef.current) {
      document.getElementById('quote-form')?.scrollIntoView({ behavior: 'smooth' });
      trackCTAClick('hero_quote_scroll', 'hero');
      return;
    }

    setAnimState('transforming');
    
    // Step 1: Transforming to Ship (0.6s)
    setTimeout(() => {
      setAnimState('swimming');
      
      // Step 2: Swimming towards form (1.2s total)
      setTimeout(() => {
        document.getElementById('quote-form')?.scrollIntoView({ behavior: 'smooth' });
        trackCTAClick('hero_quote_ship_swim', 'hero');
        
        // Reset after scroll
        setTimeout(() => setAnimState('idle'), 1500);
      }, 1000);
    }, 600);
  };

  return (
    <section className="relative min-h-fit lg:min-h-screen flex items-start justify-center overflow-hidden py-10 md:py-16 lg:pt-28 lg:pb-8">
      <div className="absolute inset-0">
        <Image
          src="/hero-bg.webp"
          alt={locale === 'en'
            ? 'Shipping containers for sale - 20ft, 40ft and 40HC SOC containers from PEKCON Türkiye'
            : 'Satılık 20ft, 40ft ve 40HC sıfır ve ikinci el yük konteynerleri - PEKCON İstanbul stoku'}
          fill
          className="object-cover"
          priority
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 1200px, 1920px"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900/90 via-secondary-900/80 to-dark-900/90 z-0" />

        {!prefersReducedMotion && (
          <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none hidden md:block">
            <div className="absolute top-1/4 left-1/4 w-64 h-32 bg-primary-500/10 rounded-lg blur-xl rotate-12 animate-float" />
            <div className="absolute top-1/3 right-1/4 w-48 h-48 bg-accent-500/15 rounded-lg blur-lg -rotate-12 animate-float [animation-delay:2s] [animation-duration:8s]" />
            <div className="absolute bottom-1/4 left-1/3 w-56 h-24 bg-primary-500/20 rounded-lg blur-sm rotate-6 animate-float [animation-delay:4s] [animation-duration:10s]" />
          </div>
        )}
      </div>

      <div className="relative z-10 container mx-auto px-4">
        <motion.div
          variants={heroStagger}
          initial="hidden"
          animate="visible"
          className="max-w-[1400px] mx-auto flex flex-col lg:grid lg:grid-cols-3 items-center lg:items-start gap-8 lg:gap-5 xl:gap-8 -mt-4 lg:mt-0"
        >
          {/* ─── COL 1: Text + Buttons (butonlar mobilde gizli, sm+ görünür) ─── */}
          <div className="text-center lg:text-left lg:self-center order-1 lg:order-1">
            <motion.h1 variants={heroSlide} className="text-3xl md:text-4xl lg:text-4xl xl:text-5xl font-display font-black text-white mb-4 leading-[1.1] flex flex-col drop-shadow-lg">
              <span dangerouslySetInnerHTML={{ __html: kwConfig?.heroTitle1 || t.hero.title1 }} />
              <span
                className="bg-gradient-to-r from-primary-400 via-primary-200 to-accent-400 bg-clip-text text-transparent"
                dangerouslySetInnerHTML={{ __html: kwConfig?.heroTitle2 || t.hero.title2 }}
              />
              <span
                dangerouslySetInnerHTML={{ __html: kwConfig?.heroTitle3 || t.hero.title3 }}
              />
            </motion.h1>

            <motion.h2
              variants={heroSlide}
              className="text-sm md:text-base lg:text-sm xl:text-base text-gray-300 mb-2 font-semibold drop-shadow-md"
              dangerouslySetInnerHTML={{ __html: t.hero.heroH2 }}
            />

            <motion.p
              variants={heroSlide}
              className="text-xs md:text-sm lg:text-xs xl:text-sm text-gray-400 mb-6 leading-relaxed drop-shadow-md whitespace-pre-line"
              dangerouslySetInnerHTML={{ __html: kwConfig?.heroDescription || t.hero.description }}
            />

            {/* Butonlar: sadece tablet (sm) ve desktop'ta görünür */}
            <motion.div variants={heroSlide} className="hidden sm:flex flex-row items-center lg:justify-start gap-3">
              <Link href="https://wa.me/905427179357" target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:min-w-[180px] !bg-none !bg-red-600 !border-red-600 !text-white hover:!bg-red-700 transition-all duration-300 shadow-xl hover:shadow-red-600/30 text-sm font-bold">
                  {t.hero.cta3}
                </Button>
              </Link>

              <div className="w-full sm:w-auto relative">
                <AnimatePresence mode="wait">
                  {animState === 'idle' && (
                    <motion.a
                      key="button-d"
                      href="#quote-form"
                      onClick={handleQuoteClick}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ scale: 0.8, opacity: 0 }}
                      className="inline-flex items-center justify-center rounded-lg transition-all duration-300 px-8 py-4 w-full sm:min-w-[180px] bg-primary-600 hover:bg-primary-500 text-white shadow-2xl hover:shadow-primary-500/50 text-sm font-bold group relative overflow-hidden"
                    >
                      <motion.div className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 z-10" animate={{ left: ['-50%', '150%'] }} transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut", repeatDelay: 1 }} />
                      <span className="relative z-20 flex items-center">
                        {t.nav.quote}
                        <motion.div animate={{ x: [0, 8, 0], opacity: [1, 0.7, 1] }} transition={{ repeat: Infinity, duration: 1.2, ease: "easeOut" }} className="ml-2">
                          <ChevronRight size={20} className="group-hover:scale-110 transition-transform" />
                        </motion.div>
                      </span>
                    </motion.a>
                  )}
                  {animState === 'transforming' && (
                    <motion.div key="ship-intro-d" initial={{ scale: 0.2, opacity: 0, x: -20 }} animate={{ scale: 1.5, opacity: 1, x: 0 }} exit={{ opacity: 1 }} className="flex items-center justify-center py-4">
                      <div className="relative">
                        <Ship size={48} className="text-white fill-primary-400 drop-shadow-2xl" />
                        <motion.div animate={{ y: [0, -2, 0], rotate: [-2, 2, -2] }} transition={{ repeat: Infinity, duration: 0.5 }} className="absolute -bottom-2 left-0 right-0 h-1 bg-white/30 blur-sm rounded-full" />
                      </div>
                    </motion.div>
                  )}
                  {animState === 'swimming' && (
                    <motion.div key="ship-swim-d" initial={{ x: 0, y: 0, opacity: 1, scale: 1.5 }} animate={{ x: [0, 50, 150, 400], y: [0, -10, 5, -5], opacity: [1, 1, 0.5, 0], scale: [1.5, 1.6, 1.2, 0.5] }} transition={{ duration: 1.5, ease: "easeInOut" }} className="absolute top-1/2 left-1/2 -translate-y-1/2 flex items-center justify-center text-primary-400">
                      <div className="relative">
                        <Ship size={48} className="text-white fill-primary-400 drop-shadow-2xl" />
                        <motion.div animate={{ opacity: [0.5, 0], scale: [1, 2], x: -20 }} transition={{ repeat: Infinity, duration: 0.4 }} className="absolute -left-4 top-1/2 -translate-y-1/2 w-4 h-4 bg-white/20 rounded-full blur-md" />
                        <motion.div animate={{ opacity: [0.5, 0], scale: [1, 2], x: -30 }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} className="absolute -left-6 top-1/2 -translate-y-1/2 w-3 h-3 bg-white/10 rounded-full blur-md" />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>

          {/* ─── COL 2: Quote Form (mobil: order-3, desktop: order-2) ─── */}
          <motion.div variants={heroSlide} className="w-full order-4 lg:order-2" id="quote-form">
            <div className="relative group">
              <div className="absolute -inset-2 bg-gradient-to-r from-primary-600 to-accent-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
              <div className="relative bg-white rounded-2xl shadow-2xl p-0 overflow-hidden">
                <QuoteForm
                  locale={locale}
                  onContainerTypeChange={(t) => { if (t) setSelectedContainer(t); }}
                />
              </div>
            </div>
          </motion.div>

          {/* ─── COL 3: 3D Container + Comparison (mobil: order-2, desktop: order-3) ─── */}
          {showScene && (
            <motion.div variants={heroSlide} className="order-2 lg:order-3">
              <KonteynerScene containerType={selectedContainer} />
              <ContainerComparison
                locale={locale}
                selected={selectedContainer}
                containerCategory={containerCategory}
                onSelect={setSelectedContainer}
                variant="dark"
              />
            </motion.div>
          )}

          {/* ─── MOBİL ONLY: Butonlar (3D animasyonun altında, sm+ gizli) ─── */}
          <motion.div variants={heroSlide} className="sm:hidden order-3 w-full flex flex-col items-center gap-3">
            <Link href="https://wa.me/905427179357" target="_blank" rel="noopener noreferrer" className="w-full">
              <Button size="lg" className="w-full !bg-none !bg-red-600 !border-red-600 !text-white hover:!bg-red-700 transition-all duration-300 shadow-xl hover:shadow-red-600/30 text-sm font-bold">
                {t.hero.cta3}
              </Button>
            </Link>

            <div className="w-full relative">
              <AnimatePresence mode="wait">
                {animState === 'idle' && (
                  <motion.a
                    key="button-m"
                    href="#quote-form"
                    onClick={handleQuoteClick}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    className="inline-flex items-center justify-center rounded-lg transition-all duration-300 px-8 py-4 w-full bg-primary-600 hover:bg-primary-500 text-white shadow-2xl hover:shadow-primary-500/50 text-sm font-bold group relative overflow-hidden"
                  >
                    <motion.div className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 z-10" animate={{ left: ['-50%', '150%'] }} transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut", repeatDelay: 1 }} />
                    <span className="relative z-20 flex items-center justify-center">
                      {t.nav.quote}
                      <motion.div animate={{ y: [0, 8, 0], opacity: [1, 0.7, 1] }} transition={{ repeat: Infinity, duration: 1.2, ease: "easeOut" }} className="ml-2">
                        <ChevronDown size={20} className="group-hover:scale-110 transition-transform" />
                      </motion.div>
                    </span>
                  </motion.a>
                )}
                {animState === 'transforming' && (
                  <motion.div key="ship-intro-m" initial={{ scale: 0.2, opacity: 0, x: -20 }} animate={{ scale: 1.5, opacity: 1, x: 0 }} exit={{ opacity: 1 }} className="flex items-center justify-center py-4">
                    <div className="relative">
                      <Ship size={48} className="text-white fill-primary-400 drop-shadow-2xl" />
                      <motion.div animate={{ y: [0, -2, 0], rotate: [-2, 2, -2] }} transition={{ repeat: Infinity, duration: 0.5 }} className="absolute -bottom-2 left-0 right-0 h-1 bg-white/30 blur-sm rounded-full" />
                    </div>
                  </motion.div>
                )}
                {animState === 'swimming' && (
                  <motion.div key="ship-swim-m" initial={{ x: 0, y: 0, opacity: 1, scale: 1.5 }} animate={{ x: [0, 10, -10, 0], y: [0, 100, 250, 600], opacity: [1, 1, 0.5, 0], scale: [1.5, 1.6, 1.2, 0.5], rotate: [0, 90, 90, 90] }} transition={{ duration: 1.5, ease: "easeInOut" }} className="absolute top-1/2 left-1/2 -translate-y-1/2 flex items-center justify-center text-primary-400">
                    <div className="relative">
                      <Ship size={48} className="text-white fill-primary-400 drop-shadow-2xl" />
                      <motion.div animate={{ opacity: [0.5, 0], scale: [1, 2], x: -20 }} transition={{ repeat: Infinity, duration: 0.4 }} className="absolute -left-4 top-1/2 -translate-y-1/2 w-4 h-4 bg-white/20 rounded-full blur-md" />
                      <motion.div animate={{ opacity: [0.5, 0], scale: [1, 2], x: -30 }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} className="absolute -left-6 top-1/2 -translate-y-1/2 w-3 h-3 bg-white/10 rounded-full blur-md" />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
