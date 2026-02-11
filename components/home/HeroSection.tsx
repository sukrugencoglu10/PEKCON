'use client';

import { motion, useMotionValue, useTransform, useScroll } from 'framer-motion';
import { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import { slideUp, staggerContainer, floatComplex, floatSlow, floatFast, antiGravityFloat } from '@/lib/animations';
import { getTranslations, type Locale } from '@/lib/i18n';

export default function HeroSection({ locale = 'tr' }: { locale?: Locale }) {
  const t = getTranslations(locale);
  
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

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background Image with Gradient Overlay */}
      <div className="absolute inset-0">
        <Image
          src="/x.jpeg"
          alt="Yük Konteynerleri"
          fill
          className="object-cover"
          priority
          unoptimized
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900/85 via-secondary-900/75 to-dark-900/90" />

        {/* Floating Geometric Shapes - Layered with Depth */}
        <div className="absolute inset-0">
          {/* Far Layer - Most Blurred */}
          <motion.div
            className="absolute top-1/4 left-1/4 w-64 h-32 bg-primary-500/10 rounded-lg depth-layer-far"
            style={{ 
              x: parallaxX1, 
              y: parallaxY1,
              rotateZ: 12,
            }}
            variants={antiGravityFloat}
            animate="animate"
          />
          
          {/* Mid Layer - Moderate Blur */}
          <motion.div
            className="absolute top-1/3 right-1/4 w-48 h-48 bg-accent-500/15 rounded-lg depth-layer-mid"
            style={{ 
              x: parallaxX2, 
              y: parallaxY2,
              rotateZ: -12,
            }}
            variants={floatSlow}
            animate="animate"
          />
          
          {/* Near Layer - Minimal Blur */}
          <motion.div
            className="absolute bottom-1/4 left-1/3 w-56 h-24 bg-primary-500/20 rounded-lg depth-layer-near"
            style={{ 
              x: parallaxX3, 
              y: parallaxY3,
              rotateZ: 6,
            }}
            variants={floatFast}
            animate="animate"
          />
          
          {/* Additional Floating Elements for Richness */}
          <motion.div
            className="absolute top-1/2 right-1/3 w-40 h-40 bg-secondary-500/10 rounded-full depth-layer-mid"
            style={{ 
              x: useTransform(mouseX, [-1000, 1000], [-25, 25]), 
              y: useTransform(mouseY, [-1000, 1000], [20, -20]),
            }}
            variants={floatComplex}
            animate="animate"
          />
          
          <motion.div
            className="absolute bottom-1/3 right-1/4 w-32 h-64 bg-accent-500/10 rounded-lg depth-layer-far"
            style={{ 
              x: useTransform(mouseX, [-1000, 1000], [35, -35]), 
              y: scrollFloat,
              rotateZ: -8,
            }}
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
          className="max-w-4xl mx-auto"
        >
          <motion.h1
            variants={slideUp}
            className="text-4xl md:text-6xl lg:text-7xl font-display font-black text-white mb-6 leading-tight flex flex-col"
          >
            <span>{t.hero.title1}</span>
            <span className="bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">
              {t.hero.title2}
            </span>
            <span className="whitespace-nowrap">{t.hero.title3}</span>
          </motion.h1>

          <motion.p
            variants={slideUp}
            className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl mx-auto"
          >
            {t.hero.description}
          </motion.p>

          <motion.div
            variants={slideUp}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link href={`/${locale}/teklif-al`}>
              <Button 
                variant="primary" 
                size="lg" 
                className="min-w-[200px] !bg-gradient-to-r !from-red-600 !to-red-500 !text-white hover:shadow-xl hover:shadow-red-500/30 transition-all duration-300 relative overflow-hidden group/btn"
              >
                <span className="relative z-10">{t.hero.cta1}</span>
                <div className="absolute inset-0 w-1/3 h-full bg-white/20 skew-x-[-15deg] translate-x-[-100%] group-hover/btn:animate-shine pointer-events-none" />
              </Button>
            </Link>
            <Link href="https://wa.me/905543545201" target="_blank" rel="noopener noreferrer">
              <Button 
                size="lg" 
                className="min-w-[200px] !bg-[#0069b4] !bg-none !text-white hover:!bg-[#005490] transition-all duration-300"
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
