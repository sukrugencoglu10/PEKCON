'use client';

import { motion, useMotionValue, useTransform, useScroll } from 'framer-motion';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import { slideUp, staggerContainer, floatComplex, floatSlow, floatFast, antiGravityFloat } from '@/lib/animations';
import { getTranslations, type Locale } from '@/lib/i18n';

export default function HeroSection({ locale = 'tr' }: { locale?: Locale }) {
  const t = getTranslations(locale);
  const [quoteInput, setQuoteInput] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Mouse parallax tracking
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  // Transform mouse position to parallax movement (reverse direction)
  const parallaxX1 = useTransform(mouseX, [-1000, 1000], [30, -30]);
  const parallaxY1 = useTransform(mouseY, [-1000, 1000], [30, -30]);
  const parallaxX2 = useTransform(mouseX, [-1000, 1000], [-20, 20]);
  const parallaxY2 = useTransform(mouseY, [-1000, 1000], [-20, 20]);
  const parallaxX3 = useTransform(mouseX, [-1000, 1000], [15, -15]);
  const parallaxY3 = useTransform(mouseY, [-1000, 1000], [15, -15]);
  
  // Scroll-triggered anti-gravity
  const { scrollY } = useScroll();
  const scrollFloat = useTransform(scrollY, [0, 500], [0, -150]);
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Center-based coordinates
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      mouseX.set(e.clientX - centerX);
      mouseY.set(e.clientY - centerY);
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  const handleQuickQuote = (e: React.FormEvent) => {
    e.preventDefault();
    if (quoteInput.trim()) {
      setIsSubmitted(true);
      // Here you would typically send this to an API or GTM
      if (typeof window.dataLayer !== 'undefined') {
        window.dataLayer.push({
          event: 'quick_lead_submitted',
          input: quoteInput
        });
      }
      setTimeout(() => {
        setQuoteInput('');
        // Reset or redirect logic here
      }, 3000);
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background Image with Gradient Overlay */}
      <div className="absolute inset-0">
        <Image
          src="/x.jpeg"
          alt="Yük Konteynerleri - PEKCON"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        {/* Gradient Overlay - Enhanced for text readability and premium feel */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900/90 via-secondary-900/80 to-dark-900/90 z-0" />

        {/* Floating Geometric Shapes - Layered with Depth */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          {/* Far Layer - Most Blurred */}
          <motion.div
            className="absolute top-1/4 left-1/4 w-64 h-32 bg-primary-500/10 rounded-lg blur-xl"
            style={{ x: parallaxX1, y: parallaxY1, rotateZ: 12 }}
            variants={antiGravityFloat}
            animate="animate"
          />
          
          {/* Mid Layer - Moderate Blur */}
          <motion.div
            className="absolute top-1/3 right-1/4 w-48 h-48 bg-accent-500/15 rounded-lg blur-lg"
            style={{ x: parallaxX2, y: parallaxY2, rotateZ: -12 }}
            variants={floatSlow}
            animate="animate"
          />
          
          {/* Near Layer - Minimal Blur */}
          <motion.div
            className="absolute bottom-1/4 left-1/3 w-56 h-24 bg-primary-500/20 rounded-lg blur-sm"
            style={{ x: parallaxX3, y: parallaxY3, rotateZ: 6 }}
            variants={floatFast}
            animate="animate"
          />
          
          {/* Additional Floating Elements for Richness */}
          <motion.div
            className="absolute top-1/2 right-1/3 w-40 h-40 bg-secondary-500/10 rounded-full blur-md"
            style={{ x: useTransform(mouseX, [-1000, 1000], [-25, 25]), y: useTransform(mouseY, [-1000, 1000], [20, -20]) }}
            variants={floatComplex}
            animate="animate"
          />
          
          <motion.div
            className="absolute bottom-1/3 right-1/4 w-32 h-64 bg-accent-500/10 rounded-lg blur-lg"
            style={{ x: useTransform(mouseX, [-1000, 1000], [35, -35]), y: scrollFloat, rotateZ: -8 }}
            variants={antiGravityFloat}
            animate="animate"
          />
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="max-w-5xl mx-auto flex flex-col items-center"
        >
          <motion.div variants={slideUp} className="mb-2">
            <span className="inline-block py-1 px-3 rounded-full bg-accent-500/20 border border-accent-500/30 text-accent-300 text-sm font-medium tracking-wider uppercase mb-4 backdrop-blur-sm">
              Global Lojistik Çözümleri
            </span>
          </motion.div>

          <motion.h1
            variants={slideUp}
            className="text-4xl md:text-6xl lg:text-7xl font-display font-black text-white mb-6 leading-tight flex flex-col drop-shadow-lg"
          >
            <span>{t.hero.title1}</span>
            <span className="bg-gradient-to-r from-primary-400 via-primary-200 to-accent-400 bg-clip-text text-transparent pb-2">
              {t.hero.title2}
            </span>
            <span className="whitespace-nowrap">{t.hero.title3}</span>
          </motion.h1>

          <motion.p
            variants={slideUp}
            className="text-lg md:text-xl text-gray-200 mb-10 max-w-2xl mx-auto leading-relaxed drop-shadow-md"
          >
            {t.hero.description}
          </motion.p>

          {/* Quick Offer Micro-Form */}
          <motion.div 
            variants={slideUp} 
            className="w-full max-w-md mx-auto mb-10 relative group"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-primary-600 to-accent-600 rounded-lg blur opacity-25 group-hover:opacity-60 transition duration-1000 group-hover:duration-200"></div>
            <form onSubmit={handleQuickQuote} className="relative flex p-2 bg-white/10 backdrop-blur-md rounded-lg border border-white/20 shadow-2xl">
              <input 
                type="text" 
                placeholder={t.hero.quickQuote.placeholder}
                className="flex-1 bg-transparent border-none outline-none text-white placeholder-gray-300 px-4 py-3 min-w-0"
                value={quoteInput}
                onChange={(e) => setQuoteInput(e.target.value)}
                required
              />
              <button 
                type="submit" 
                className="bg-primary-600 hover:bg-primary-500 text-white font-bold py-3 px-6 rounded-md transition-all duration-300 shadow-lg hover:shadow-primary-500/50 whitespace-nowrap"
              >
                {isSubmitted ? t.hero.quickQuote.submitted : t.hero.quickQuote.submit}
              </button>
            </form>
            {isSubmitted && (
              <motion.p 
                initial={{ opacity: 0, y: 10 }} 
                animate={{ opacity: 1, y: 0 }} 
                className="absolute top-full left-0 right-0 text-center text-green-400 text-sm mt-2 font-medium"
              >
                {t.hero.quickQuote.successMsg}
              </motion.p>
            )}
          </motion.div>

          <motion.div
            variants={slideUp}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link href="https://wa.me/905543545201" target="_blank" rel="noopener noreferrer">
              <Button 
                size="lg" 
                className="min-w-[200px] !bg-none !bg-red-600 !border-red-600 !text-white hover:!bg-red-700 transition-all duration-300 shadow-lg hover:shadow-red-600/30"
              >
                {t.hero.cta3}
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

