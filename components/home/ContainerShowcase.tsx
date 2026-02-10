'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import Link from 'next/link';
import { Box } from 'lucide-react';
import Button from '@/components/ui/Button';
import { slideUp, staggerContainer } from '@/lib/animations';
import { getTranslations, type Locale } from '@/lib/i18n';

export default function ContainerShowcase({ locale = 'tr' }: { locale?: Locale }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const t = getTranslations(locale);

  const containers = [
    {
      id: '20dc',
      name: locale === 'tr' ? "20' Standart Kuru Yük" : "20' Standard Dry Cargo",
      type: '20DC',
      description: locale === 'tr'
        ? 'Standart boyut konteyner, genel kargo taşımacılığı için ideal'
        : 'Standard size container, ideal for general cargo transportation',
      specs: locale === 'tr'
        ? ['33.2 m³ hacim', '28,180 kg max yük', 'Yeni/Sıfır']
        : ['33.2 m³ volume', '28,180 kg max load', 'New/Zero'],
    },
    {
      id: '40hc',
      name: locale === 'tr' ? "40' HC Kuru Yük" : "40' HC Dry Cargo",
      type: '40HC',
      description: locale === 'tr'
        ? 'Yüksek hacimli konteyner, daha fazla yük kapasitesi'
        : 'High volume container, greater load capacity',
      specs: locale === 'tr'
        ? ['76.3 m³ hacim', '26,580 kg max yük', 'High Cube']
        : ['76.3 m³ volume', '26,580 kg max load', 'High Cube'],
    },
    {
      id: '40rf',
      name: locale === 'tr' ? "40' HC Buzdolabı" : "40' HC Refrigerated",
      type: '40RF',
      description: locale === 'tr'
        ? 'Sıcaklık kontrollü konteyner, gıda ve hassas yükler için'
        : 'Temperature controlled container for food and sensitive cargo',
      specs: locale === 'tr'
        ? ['-30°C ile +30°C', 'Dijital kontrol', 'Carrier kompresör']
        : ['-30°C to +30°C', 'Digital control', 'Carrier compressor'],
    },
  ];

  return (
    <section ref={ref} className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-5xl font-display font-black text-dark-900 mb-4">
            {t.containers.title}
          </h2>
          <p className="text-lg text-dark-700 max-w-2xl mx-auto">
            {t.containers.subtitle}
          </p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12"
        >
          {containers.map((container, index) => (
            <motion.div
              key={container.id}
              variants={slideUp}
              className="group"
            >
              <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 h-full border border-gray-200 hover:border-primary-300">
                <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center mb-6">
                  <Box className="w-8 h-8 text-white" />
                </div>

                <div className="mb-4">
                  <div className="inline-block px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium mb-2">
                    {container.type}
                  </div>
                  <h3 className="text-xl font-display font-bold text-dark-900 mb-2">
                    {container.name}
                  </h3>
                  <p className="text-dark-700 mb-4">{container.description}</p>
                </div>

                <ul className="space-y-2 mb-6">
                  {container.specs.map((spec, idx) => (
                    <li key={idx} className="flex items-center text-sm text-dark-700">
                      <svg
                        className="w-5 h-5 text-primary-500 mr-2 flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      {spec}
                    </li>
                  ))}
                </ul>

                <Link href={`/${locale}/konteynerlar#${container.id}`}>
                  <Button variant="outline" className="w-full">
                    {locale === 'tr' ? 'Detayları Görüntüle' : 'View Details'}
                  </Button>
                </Link>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <div className="text-center">
          <Link href={`/${locale}/konteynerlar`}>
            <Button variant="primary" size="lg">
              {locale === 'tr' ? 'Tüm Konteynerler' : 'All Containers'}
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
