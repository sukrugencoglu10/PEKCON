'use client';

import dynamic from 'next/dynamic';
import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import QuoteForm from '@/components/forms/QuoteForm';
import ContainerComparison from './ContainerComparison';
import type { ContainerType } from './KonteynerScene';
import type { Locale } from '@/lib/i18n';

// Heavy 3D scene — client-only, no SSR
const KonteynerScene = dynamic(() => import('./KonteynerScene'), {
  ssr: false,
  loading: () => (
    <div className="h-[440px] w-full rounded-3xl bg-gray-200/50 animate-pulse" />
  ),
});

export default function ContactSection({ locale = 'tr' }: { locale?: Locale }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const [selectedContainer, setSelectedContainer] = useState<ContainerType>('40hc');

  const isTr = locale === 'tr';

  return (
    <section ref={ref} className="relative pt-8 pb-24 px-4 overflow-hidden bg-[#f8f7f4]">
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
          {/* Edge glow behind scene */}
          <div
            className="absolute -inset-6 rounded-3xl pointer-events-none"
            style={{
              background:
                'radial-gradient(ellipse at 40% 50%, rgba(220,38,38,0.06) 0%, transparent 65%)',
              filter: 'blur(30px)',
            }}
          />
          <KonteynerScene containerType={selectedContainer} />
          <ContainerComparison locale={locale} selected={selectedContainer} onSelect={setSelectedContainer} />
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
            <h2 className="text-2xl md:text-3xl font-bold text-primary-500 leading-tight whitespace-nowrap">
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
            <QuoteForm locale={locale} />
          </div>
        </motion.div>

      </div>
    </section>
  );
}
