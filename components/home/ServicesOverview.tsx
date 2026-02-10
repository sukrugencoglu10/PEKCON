'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import Link from 'next/link';
import { Ship, Truck, Train, Plane, Route, Package } from 'lucide-react';
import { slideUp, staggerContainer, cardHover } from '@/lib/animations';

const iconMap: Record<string, any> = {
  Ship,
  Truck,
  Train,
  Plane,
  Route,
  Package,
};

const services = [
  {
    icon: 'Ship',
    title: 'Denizyolu Taşımacılık',
    description: 'Global ağımızla güvenilir denizyolu taşımacılığı hizmetleri',
  },
  {
    icon: 'Truck',
    title: 'Karayolu Taşımacılık',
    description: 'Parsiyel ve komple yük çözümleri ile hızlı teslimat',
  },
  {
    icon: 'Train',
    title: 'Demiryolu Taşımacılık',
    description: 'Çevre dostu ve ekonomik çözümler',
  },
  {
    icon: 'Plane',
    title: 'Hava Kargo',
    description: 'Acil ve zaman hassas yükler için hızlı taşımacılık',
  },
  {
    icon: 'Route',
    title: 'İntermodal Taşımacılık',
    description: 'Farklı taşıma modlarının kombinasyonu',
  },
  {
    icon: 'Package',
    title: 'Proje Kargo',
    description: 'Büyük ölçekli ve özel projelerde uzmanlaşmış hizmet',
  },
];

export default function ServicesOverview() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section ref={ref} className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-5xl font-display font-black text-dark-900 mb-4">
            Hizmetlerimiz
          </h2>
          <p className="text-lg text-dark-700 max-w-2xl mx-auto">
            Kapsamlı lojistik çözümlerimizle iş süreçlerinizi optimize ediyoruz
          </p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {services.map((service, index) => {
            const Icon = iconMap[service.icon];
            return (
              <motion.div
                key={index}
                variants={slideUp}
                whileHover="hover"
                initial="rest"
              >
                <Link href="/tr/hizmetlerimiz">
                  <motion.div
                    variants={cardHover}
                    className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-shadow duration-300 h-full group border border-gray-100 hover:border-primary-300"
                  >
                    <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-display font-bold text-dark-900 mb-3">
                      {service.title}
                    </h3>
                    <p className="text-dark-700 mb-4">{service.description}</p>
                    <span className="inline-flex items-center text-primary-500 font-medium group-hover:gap-2 transition-all">
                      Detaylı Bilgi
                      <svg
                        className="w-0 group-hover:w-5 h-5 transition-all duration-300"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </span>
                  </motion.div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
