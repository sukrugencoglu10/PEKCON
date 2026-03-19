'use client';

import dynamic from 'next/dynamic';
import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import QuoteForm from '@/components/forms/QuoteForm';
import type { Locale } from '@/lib/i18n';

// Heavy 3D scene — client-only, no SSR
const KonteynerScene = dynamic(() => import('./KonteynerScene'), {
  ssr: false,
  loading: () => (
    <div className="h-[440px] w-full rounded-3xl bg-zinc-900/30 animate-pulse" />
  ),
});

export default function ContactSection({ locale = 'tr' }: { locale?: Locale }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  const isTr = locale === 'tr';

  return (
    <section ref={ref} className="relative py-24 px-4 overflow-hidden bg-zinc-950">
      {/* Deep ambient glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none rounded-full"
        style={{
          width: 700,
          height: 700,
          background: 'radial-gradient(circle, rgba(6,182,212,0.06) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }}
      />

      {/* Subtle grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(to right, rgba(255,255,255,1) 1px, transparent 1px)',
          backgroundSize: '50px 50px',
        }}
      />

      <div className="relative max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-center">

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
                'radial-gradient(ellipse at 40% 50%, rgba(6,182,212,0.12) 0%, transparent 65%)',
              filter: 'blur(30px)',
            }}
          />
          <KonteynerScene />
        </motion.div>

        {/* ─── RIGHT: Form ─── */}
        <motion.div
          className="order-1 lg:order-2 space-y-7"
          initial={{ opacity: 0, x: 40 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.75, ease: 'easeOut', delay: 0.1 }}
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-[10px] text-cyan-400 uppercase tracking-widest font-mono">
              {isTr ? 'Hızlı Teklif' : 'Quick Quote'}
            </span>
          </div>

          {/* Heading */}
          <div className="space-y-3">
            <h2 className="text-4xl md:text-5xl font-light text-white leading-tight">
              {isTr ? (
                <>
                  Geleceği{' '}
                  <span className="text-cyan-400 italic">Kutuluyoruz.</span>
                </>
              ) : (
                <>
                  We{' '}
                  <span className="text-cyan-400 italic">Box</span>{' '}
                  the Future.
                </>
              )}
            </h2>
            <p className="text-zinc-400 text-base leading-relaxed max-w-md">
              {isTr
                ? 'İhtiyacınız olan konteyner çözümünü seçin, mühendislik vizyonumuzla projenizi hızlandıralım.'
                : 'Select the container solution you need and let us accelerate your project with our engineering vision.'}
            </p>
          </div>

          {/* Form card — white card contrasts against dark bg intentionally */}
          <div className="relative">
            {/* Subtle cyan glow ring around form */}
            <div
              className="absolute -inset-px rounded-2xl pointer-events-none"
              style={{
                background:
                  'linear-gradient(135deg, rgba(6,182,212,0.25) 0%, transparent 50%, rgba(6,182,212,0.1) 100%)',
                padding: 1,
              }}
            />
            <QuoteForm locale={locale} />
          </div>
        </motion.div>

      </div>
    </section>
  );
}
