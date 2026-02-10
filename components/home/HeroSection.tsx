'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import { slideUp, staggerContainer } from '@/lib/animations';

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-900 via-secondary-900 to-dark-900">
        {/* Grid Pattern Overlay */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(0, 102, 255, 0.1) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(0, 102, 255, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
          }}
        />

        {/* Floating Geometric Shapes */}
        <div className="absolute inset-0">
          <motion.div
            className="absolute top-1/4 left-1/4 w-64 h-32 bg-primary-500/10 rounded-lg rotate-12"
            animate={{
              y: [0, -20, 0],
              rotate: [12, 15, 12],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
          <motion.div
            className="absolute top-1/3 right-1/4 w-48 h-48 bg-accent-500/10 rounded-lg -rotate-12"
            animate={{
              y: [0, 20, 0],
              rotate: [-12, -15, -12],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
          <motion.div
            className="absolute bottom-1/4 left-1/3 w-56 h-24 bg-primary-500/10 rounded-lg rotate-6"
            animate={{
              y: [0, -15, 0],
              rotate: [6, 9, 6],
            }}
            transition={{
              duration: 7,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
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
            className="text-4xl md:text-6xl lg:text-7xl font-display font-black text-white mb-6 leading-tight"
          >
            Küresel Lojistikte{' '}
            <span className="bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">
              Güvenilir Çözüm
            </span>{' '}
            Ortağınız
          </motion.h1>

          <motion.p
            variants={slideUp}
            className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl mx-auto"
          >
            25 yılı aşkın tecrübe ile konteyner tedariği ve uluslararası taşımacılık
            hizmetlerinde lider
          </motion.p>

          <motion.div
            variants={slideUp}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link href="/tr/teklif-al">
              <Button variant="primary" size="lg" className="min-w-[200px]">
                Hızlı Teklif Al
              </Button>
            </Link>
            <Link href="/tr/hizmetlerimiz">
              <Button variant="ghost" size="lg" className="min-w-[200px] bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white hover:bg-white hover:text-dark-900 hover:border-white">
                Hizmetlerimizi Keşfedin
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
