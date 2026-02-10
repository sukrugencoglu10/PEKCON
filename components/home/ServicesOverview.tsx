'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import Link from 'next/link';
import { Ship, Truck, Plane, FileText } from 'lucide-react';
import { slideUp, staggerContainer, cardHover } from '@/lib/animations';
import { getTranslations, type Locale } from '@/lib/i18n';

const iconMap: Record<string, any> = {
  Ship,
  Truck,
  Plane,
  FileText,
};

export default function ServicesOverview({ locale = 'tr' }: { locale?: Locale }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const t = getTranslations(locale);

  const services = [
    {
      icon: 'Ship',
      title: t.services.sea.title,
      description: t.services.sea.description,
    },
    {
      icon: 'Truck',
      title: t.services.land.title,
      description: t.services.land.description,
    },
    {
      icon: 'Plane',
      title: t.services.air.title,
      description: t.services.air.description,
    },
    {
      icon: 'FileText',
      title: t.services.customs.title,
      description: t.services.customs.description,
    },
  ];

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
            {t.services.title}
          </h2>
          <p className="text-lg text-dark-700 max-w-2xl mx-auto">
            {t.services.subtitle}
          </p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
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
                <Link href={`/${locale}/hizmetlerimiz`}>
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
                      {locale === 'tr' ? 'Detaylı Bilgi' : 'Learn More'}
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
