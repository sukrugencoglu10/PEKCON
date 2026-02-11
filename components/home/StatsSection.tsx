'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { slideUp, staggerContainer } from '@/lib/animations';
import { getTranslations, type Locale } from '@/lib/i18n';

export default function StatsSection({ locale = 'tr' }: { locale?: Locale }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const t = getTranslations(locale);

  const stats = [
    { value: '15+', label: t.stats.experience },
    { value: '50+', label: t.stats.countries },
    { value: '10,000+', label: t.stats.containers },
    { value: '98%', label: t.stats.satisfaction },
  ];

  return (
    <section ref={ref} className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              variants={slideUp}
              className="group relative"
            >
              <div className="glass-effect p-8 rounded-2xl text-center hover:bg-gradient-to-br hover:from-primary-50 hover:to-accent-50 transition-all duration-300 border border-gray-200 hover:border-primary-300">
                <div className="text-4xl md:text-5xl font-display font-black bg-gradient-to-r from-primary-500 to-accent-500 bg-clip-text text-transparent mb-2">
                  {stat.value}
                </div>
                <div className="text-dark-700 font-medium">{stat.label}</div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
