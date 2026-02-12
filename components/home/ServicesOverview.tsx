'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Ship, Truck, Train, Route, ClipboardCheck, ArrowRight } from 'lucide-react';
import { getTranslations, type Locale } from '@/lib/i18n';
import { staggerContainer, slideUp, cardHover } from '@/lib/animations';

interface ServicesOverviewProps {
  locale: Locale;
}

const iconMap = {
  Ship,
  Truck,
  Train,
  Route,
  ClipboardCheck,
};

export default function ServicesOverview({ locale }: ServicesOverviewProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const t = getTranslations(locale);

  const services = [
    {
      title: t.servicesPage.sea.title,
      description: t.servicesPage.sea.desc,
      icon: 'Ship' as const,
    },
    {
      title: t.servicesPage.land.title,
      description: t.servicesPage.land.desc,
      icon: 'Truck' as const,
    },
    {
      title: t.services.customs.title,
      description: t.services.customs.description,
      icon: 'ClipboardCheck' as const,
    },
  ];

  return (
    <section ref={ref} className="relative py-32 overflow-hidden bg-white">
      {/* Background Image with subtle effect */}
      {/* Background Image with subtle effect */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&q=80&w=2000"
          alt="Services Background"
          fill
          className="object-cover opacity-25"
          sizes="100vw"
        />
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <span className="text-primary-600 font-bold tracking-widest uppercase text-sm mb-3 block">
            {locale === 'tr' ? 'HİZMETLERİMİZ' : 'OUR SERVICES'}
          </span>
          <h2 className="text-4xl md:text-5xl font-display font-black text-dark-900 mb-6">
            {t.services.title}
          </h2>
          <div className="w-24 h-1.5 bg-primary-500 mx-auto mb-8 rounded-full" />
          <div className="max-w-4xl mx-auto bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-sm border border-white/50">
            <p className="text-xl text-dark-700 leading-relaxed font-medium">
              {t.services.subtitle}
            </p>
          </div>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-3 gap-10"
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
                    className="bg-white/95 backdrop-blur-sm rounded-3xl p-10 shadow-xl hover:shadow-2xl transition-all duration-500 h-full group border border-gray-100 hover:border-primary-200"
                  >
                    <div className="w-20 h-20 border-2 border-primary-500 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-primary-500 group-hover:border-primary-500 transition-all duration-500">
                      <Icon className="w-10 h-10 text-primary-500 group-hover:text-white transition-colors duration-500" />
                    </div>
                    <h3 className="text-2xl font-display font-bold text-dark-900 mb-4 group-hover:text-primary-600 transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-dark-700 mb-8 leading-relaxed text-lg">
                      {service.description}
                    </p>
                    <span className="inline-flex items-center text-primary-600 font-bold group-hover:translate-x-2 transition-transform duration-300">
                      {locale === 'tr' ? 'Detayları İncele' : 'View Details'}
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </span>
                  </motion.div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-20"
        >
          <Link href={`/${locale}/hizmetlerimiz`}>
            <button className="bg-primary-600 text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-primary-700 transition-all shadow-lg hover:shadow-primary-500/25 active:scale-95 group">
              {locale === 'tr' ? 'Tüm Hizmetlerimizi Gör' : 'View All Services'}
              <ArrowRight className="inline-block ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
