'use client';

import dynamic from 'next/dynamic';
import { useRef, useState, useCallback } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import QuoteForm from '@/components/forms/QuoteForm';
import ContainerComparison from './ContainerComparison';
import { getCategoryFromType, type ContainerType, type ContainerCategory } from './KonteynerScene';
import type { Locale } from '@/lib/i18n';

// Heavy 3D scene — client-only, no SSR
const KonteynerScene = dynamic(() => import('./KonteynerScene'), {
  ssr: false,
  loading: () => (
    <div className="h-[280px] w-full rounded-3xl bg-gray-200/50 animate-pulse" />
  ),
});

export default function ContactSection({ locale = 'tr' }: { locale?: Locale }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const [selectedContainer, setSelectedContainer] = useState<ContainerType>('40hc');
  const [formContainerType, setFormContainerType] = useState<ContainerType | null>(null);
  const handleContainerTypeChange = useCallback((type: ContainerType | null) => {
    setFormContainerType(type);
    if (type !== null) setSelectedContainer(type);
  }, []);

  const isTr = locale === 'tr';
  const showScene = formContainerType !== null;
  const containerCategory = getCategoryFromType(selectedContainer);

  // Glow color per category
  const glowColor =
    containerCategory === 'reefer'    ? 'rgba(0,188,212,0.08)'  :
    containerCategory === 'flat_rack'  ? 'rgba(230,74,25,0.08)'  :
    containerCategory === 'open_top'   ? 'rgba(84,110,122,0.08)' :
    'rgba(0,105,180,0.08)';

  return (
    <section ref={ref} className="relative pt-4 pb-16 px-4 overflow-hidden bg-[#f8f7f4]">
      {/* Soft ambient glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none rounded-full"
        style={{
          width: 700,
          height: 700,
          background: 'radial-gradient(circle, rgba(220,38,38,0.04) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }}
      />

      {/* Subtle grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px), linear-gradient(to right, rgba(0,0,0,0.1) 1px, transparent 1px)',
          backgroundSize: '50px 50px',
        }}
      />

      <div className="relative max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-start">

        {/* ─── LEFT: 3D Scene ─── */}
        <motion.div
          className="order-2 lg:order-1 relative"
          initial={{ opacity: 0, x: -40 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.75, ease: 'easeOut' }}
        >
          {/* Edge glow — intensifies when scene is visible */}
          <motion.div
            className="absolute -inset-6 rounded-3xl pointer-events-none"
            animate={{ opacity: showScene ? 1 : 0.3 }}
            transition={{ duration: 0.6 }}
            style={{
              background: `radial-gradient(ellipse at 40% 50%, ${glowColor} 0%, transparent 65%)`,
              filter: 'blur(30px)',
            }}
          />

          {/* 3D scene — animates in when container type selected from form */}
          <AnimatePresence mode="wait">
            {!showScene ? (
              <motion.div
                key="placeholder"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.35 }}
                className="h-[280px] flex flex-col items-center justify-center gap-5 rounded-2xl border-2 border-dashed border-primary-200/50 bg-primary-50/20"
              >
                {/* Container size pills hint */}
                <div className="flex gap-2">
                  {["20'", "40'", "40' HC"].map((label, i) => (
                    <motion.div
                      key={label}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 + i * 0.08 }}
                      className="px-3 py-1.5 rounded-lg bg-white/80 border border-primary-200 text-xs font-mono text-primary-400 shadow-sm"
                    >
                      {label}
                    </motion.div>
                  ))}
                </div>
                <p className="text-xs text-gray-400 text-center max-w-[180px] leading-relaxed">
                  {isTr
                    ? 'Konteyner tipini seçince 3D animasyon burada belirecek'
                    : 'Select a container type to see the 3D animation here'}
                </p>
              </motion.div>
            ) : (
              <motion.div
                key={`scene-${containerCategory}`}
                initial={{ opacity: 0, scale: 0.82, y: 24 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                className="relative"
              >
                {/* Category glow flash on entrance */}
                <motion.div
                  className="absolute inset-0 rounded-2xl pointer-events-none z-10"
                  initial={{ opacity: 0.6 }}
                  animate={{ opacity: 0 }}
                  transition={{ duration: 1.0 }}
                  style={{
                    background: `radial-gradient(ellipse at 50% 50%, ${glowColor.replace('0.08', '0.25')} 0%, transparent 70%)`,
                  }}
                />
                <KonteynerScene containerType={selectedContainer} />
              </motion.div>
            )}
          </AnimatePresence>

          <ContainerComparison
            locale={locale}
            selected={selectedContainer}
            containerCategory={containerCategory}
            onSelect={(t) => {
              setSelectedContainer(t);
              setFormContainerType(t);
            }}
          />
        </motion.div>

        {/* ─── RIGHT: Form ─── */}
        <motion.div
          className="order-1 lg:order-2 space-y-5"
          initial={{ opacity: 0, x: 40 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.75, ease: 'easeOut', delay: 0.1 }}
        >
          {/* Badge — centered */}
          <div className="flex justify-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-50 border border-red-200">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              <span className="text-[10px] text-red-600 uppercase tracking-widest font-mono">
                {isTr ? 'Hızlı Teklif' : 'Quick Quote'}
              </span>
            </div>
          </div>

          {/* Heading — centered */}
          <div className="space-y-3 text-center">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-primary-500 leading-tight lg:whitespace-nowrap">
              {isTr ? (
                <>
                  Doğru Konteyner,{' '}
                  <span className="text-red-600 italic">Güvenilir Çözüm.</span>
                </>
              ) : (
                <>
                  The Right Container,{' '}
                  <span className="text-red-600 italic">Trusted Solution.</span>
                </>
              )}
            </h2>
            <p className="text-gray-500 text-sm leading-relaxed max-w-md mx-auto">
              {isTr
                ? 'Satılık ve kiralık konteyner ihtiyaçlarınız için 15 yılı aşkın sektör deneyimimizle yanınızdayız. Uzman ekibimizden hemen fiyat teklifi alın.'
                : 'With over 15 years of industry experience, we are by your side for all your container purchase and rental needs. Get an instant quote from our expert team.'}
            </p>
          </div>

          {/* Form card */}
          <div className="relative">
            <QuoteForm locale={locale} onContainerTypeChange={handleContainerTypeChange} />
          </div>
        </motion.div>

      </div>
    </section>
  );
}
