'use client';

import { motion, useMotionValue, useTransform, useReducedMotion, AnimatePresence } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import { slideUp, staggerContainer, floatSlow, floatFast, antiGravityFloat } from '@/lib/animations';
import { getTranslations, type Locale } from '@/lib/i18n';
import { trackCTAClick } from '@/lib/gtm';
import QuoteForm from '@/components/forms/QuoteForm';
import { ChevronRight, ChevronDown, Ship } from 'lucide-react';

export default function HeroSection({ locale = 'tr' }: { locale?: Locale }) {
  const t = getTranslations(locale);
  const prefersReducedMotion = useReducedMotion();
  const isDesktopRef = useRef<boolean | null>(null);
  
  const [animState, setAnimState] = useState<'idle' | 'transforming' | 'swimming'>('idle');
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const parallaxX1 = useTransform(mouseX, [-1000, 1000], [30, -30]);
  const parallaxY1 = useTransform(mouseY, [-1000, 1000], [30, -30]);
  const parallaxX2 = useTransform(mouseX, [-1000, 1000], [-20, 20]);
  const parallaxY2 = useTransform(mouseY, [-1000, 1000], [-20, 20]);
  const parallaxX3 = useTransform(mouseX, [-1000, 1000], [15, -15]);
  const parallaxY3 = useTransform(mouseY, [-1000, 1000], [15, -15]);

  useEffect(() => {
    isDesktopRef.current = window.matchMedia('(min-width: 768px) and (pointer: fine)').matches;
    if (!isDesktopRef.current) return;

    const handleMouseMove = (e: MouseEvent) => {
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      mouseX.set(e.clientX - centerX);
      mouseY.set(e.clientY - centerY);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

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
    <section className="relative min-h-screen lg:min-h-[110vh] flex items-center justify-center overflow-hidden py-10 md:py-20 lg:pt-32">
      <div className="absolute inset-0">
        <Image
          src="/x.webp"
          alt="Yük Konteynerleri - PEKCON"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900/90 via-secondary-900/80 to-dark-900/90 z-0" />

        {!prefersReducedMotion && (
          <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none hidden md:block">
            <motion.div className="absolute top-1/4 left-1/4 w-64 h-32 bg-primary-500/10 rounded-lg blur-xl" style={{ x: parallaxX1, y: parallaxY1, rotateZ: 12 }} variants={antiGravityFloat} animate="animate" />
            <motion.div className="absolute top-1/3 right-1/4 w-48 h-48 bg-accent-500/15 rounded-lg blur-lg" style={{ x: parallaxX2, y: parallaxY2, rotateZ: -12 }} variants={floatSlow} animate="animate" />
            <motion.div className="absolute bottom-1/4 left-1/3 w-56 h-24 bg-primary-500/20 rounded-lg blur-sm" style={{ x: parallaxX3, y: parallaxY3, rotateZ: 6 }} variants={floatFast} animate="animate" />
          </div>
        )}
      </div>

      <div className="relative z-10 container mx-auto px-4">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16 -mt-4 lg:-mt-10"
        >
          <div className="flex-1 text-center lg:text-left max-w-2xl">
            <motion.h1 variants={slideUp} className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-display font-black text-white mb-6 leading-[1.1] flex flex-col drop-shadow-lg">
              <span dangerouslySetInnerHTML={{ __html: t.hero.title1 }} />
              <span 
                className="bg-gradient-to-r from-primary-400 via-primary-200 to-accent-400 bg-clip-text text-transparent pb-2"
                dangerouslySetInnerHTML={{ __html: t.hero.title2 }}
              />
              <span 
                className="sm:whitespace-nowrap"
                dangerouslySetInnerHTML={{ __html: t.hero.title3 }}
              />
            </motion.h1>

            <motion.p 
              variants={slideUp} 
              className="text-lg md:text-xl text-gray-200 mb-10 max-w-4xl leading-relaxed drop-shadow-md whitespace-pre-line"
              dangerouslySetInnerHTML={{ __html: t.hero.description }}
            />

            <motion.div variants={slideUp} className="flex flex-col sm:flex-row items-center lg:justify-start gap-4">
              <Link href="https://wa.me/905543545201" target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:min-w-[200px] !bg-none !bg-red-600 !border-red-600 !text-white hover:!bg-red-700 transition-all duration-300 shadow-xl hover:shadow-red-600/30 text-base font-bold">
                  {t.hero.cta3}
                </Button>
              </Link>

              <div className="w-full sm:w-auto relative">
                <AnimatePresence mode="wait">
                  {animState === 'idle' && (
                    <motion.div key="button" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }}>
                      <Button
                        size="lg"
                        className="w-full sm:min-w-[200px] bg-primary-600 hover:bg-primary-500 text-white shadow-2xl hover:shadow-primary-500/50 text-base font-bold group relative overflow-hidden"
                        onClick={handleQuoteClick}
                      >
                        <motion.div className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 z-10" animate={{ left: ['-50%', '150%'] }} transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut", repeatDelay: 1 }} />
                        <span className="relative z-20 flex items-center">
                          {t.nav.quote}
                          {/* Desktop Arrow */}
                          <motion.div 
                            animate={{ x: [0, 8, 0], opacity: [1, 0.7, 1] }} 
                            transition={{ repeat: Infinity, duration: 1.2, ease: "easeOut" }} 
                            className="ml-2 hidden sm:block"
                          >
                            <ChevronRight size={22} className="group-hover:scale-110 transition-transform" />
                          </motion.div>
                          {/* Mobile Arrow */}
                          <motion.div 
                            animate={{ y: [0, 8, 0], opacity: [1, 0.7, 1] }} 
                            transition={{ repeat: Infinity, duration: 1.2, ease: "easeOut" }} 
                            className="ml-2 sm:hidden block"
                          >
                            <ChevronDown size={22} className="group-hover:scale-110 transition-transform" />
                          </motion.div>
                        </span>
                      </Button>
                    </motion.div>
                  )}

                  {animState === 'transforming' && (
                    <motion.div key="ship-intro" initial={{ scale: 0.2, opacity: 0, x: -20 }} animate={{ scale: 1.5, opacity: 1, x: 0 }} exit={{ opacity: 1 }} className="flex items-center justify-center py-4">
                      <div className="relative">
                        <Ship size={48} className="text-white fill-primary-400 drop-shadow-2xl" />
                        <motion.div 
                          animate={{ 
                            y: [0, -2, 0],
                            rotate: [-2, 2, -2]
                          }} 
                          transition={{ repeat: Infinity, duration: 0.5 }} 
                          className="absolute -bottom-2 left-0 right-0 h-1 bg-white/30 blur-sm rounded-full" 
                        />
                      </div>
                    </motion.div>
                  )}

                  {animState === 'swimming' && (
                    <motion.div 
                      key="ship-swim" 
                      initial={{ x: 0, y: 0, opacity: 1, scale: 1.5 }} 
                      animate={isDesktopRef.current ? { 
                        x: [0, 50, 150, 400],
                        y: [0, -10, 5, -5],
                        opacity: [1, 1, 0.5, 0],
                        scale: [1.5, 1.6, 1.2, 0.5]
                      } : {
                        x: [0, 10, -10, 0],
                        y: [0, 100, 250, 600],
                        opacity: [1, 1, 0.5, 0],
                        scale: [1.5, 1.6, 1.2, 0.5],
                        rotate: [0, 90, 90, 90]
                      }} 
                      transition={{ duration: 1.5, ease: "easeInOut" }} 
                      className="absolute top-1/2 left-1/2 -translate-y-1/2 flex items-center justify-center text-primary-400"
                    >
                      <div className="relative">
                        <Ship size={48} className="text-white fill-primary-400 drop-shadow-2xl" />
                        {/* Wake particles */}
                        <motion.div 
                          animate={{ opacity: [0.5, 0], scale: [1, 2], x: -20 }}
                          transition={{ repeat: Infinity, duration: 0.4 }}
                          className="absolute -left-4 top-1/2 -translate-y-1/2 w-4 h-4 bg-white/20 rounded-full blur-md"
                        />
                        <motion.div 
                          animate={{ opacity: [0.5, 0], scale: [1, 2], x: -30 }}
                          transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }}
                          className="absolute -left-6 top-1/2 -translate-y-1/2 w-3 h-3 bg-white/10 rounded-full blur-md"
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>

          <motion.div variants={slideUp} className="w-full max-w-xl lg:max-w-md xl:max-w-lg" id="quote-form">
            <div className="relative group">
              <div className="absolute -inset-2 bg-gradient-to-r from-primary-600 to-accent-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
              <div className="relative bg-white rounded-2xl shadow-2xl p-0 overflow-hidden">
                <QuoteForm locale={locale} />
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
