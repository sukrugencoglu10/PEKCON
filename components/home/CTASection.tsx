'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import Link from 'next/link';
import Button from '@/components/ui/Button';

export default function CTASection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <section ref={ref} className="py-20 relative overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-secondary-600 via-secondary-500 to-accent-500"></div>

      {/* Pattern Overlay */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255, 255, 255, 0.1) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
        }}
      />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-5xl font-display font-black text-white mb-6">
            Projeniz İçin Hemen Teklif Alın
          </h2>
          <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Uzman ekibimiz en uygun çözümü sunmak için hazır. Hemen iletişime geçin.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/tr/teklif-al">
              <Button
                variant="secondary"
                size="lg"
                className="min-w-[200px] bg-white text-primary-600 hover:bg-gray-100"
              >
                Teklif Formu
              </Button>
            </Link>
            <Link href="/tr/iletisim">
              <Button
                variant="outline"
                size="lg"
                className="min-w-[200px] bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white hover:text-primary-600"
              >
                İletişime Geçin
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
