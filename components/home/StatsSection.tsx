'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { slideUp, staggerContainer } from '@/lib/animations';

const stats = [
  { value: '1000+', label: 'Tamamlanan Proje' },
  { value: '25+', label: 'Yıllık Tecrübe' },
  { value: '50+', label: 'Hizmet Verdiğimiz Ülke' },
  { value: '7/24', label: 'Müşteri Desteği' },
];

export default function StatsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

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
