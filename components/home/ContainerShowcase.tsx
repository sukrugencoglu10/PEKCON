'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Container } from 'lucide-react';
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
      name: locale === 'tr' ? "20' DC Konteyner" : "20' DC Container",
      type: '20DC',
      description: locale === 'tr'
        ? 'Standart boyut konteyner, genel kargo taşımacılığı için ideal'
        : 'Standard size container, ideal for general cargo transportation',
      specs: locale === 'tr'
        ? ['33.2 m³ hacim', '28,180 kg max yük', 'Yeni/Sıfır']
        : ['33.2 m³ volume', '28,180 kg max load', 'New/Zero'],
    },
    {
      id: '40dc',
      name: locale === 'tr' ? "40' DC Konteyner" : "40' DC Container",
      type: '40DC',
      description: locale === 'tr'
        ? 'Standart yükseklikte konteyner, genel kargo taşımacılığı için'
        : 'Standard height container for general cargo transportation',
      specs: locale === 'tr'
        ? ['67.7 m³ hacim', '26,730 kg max yük', 'Standart yükseklik']
        : ['67.7 m³ volume', '26,730 kg max load', 'Standard height'],
    },
    {
      id: '40hc',
      name: locale === 'tr' ? "40' HC Konteyner" : "40' HC Container",
      type: '40HC',
      description: locale === 'tr'
        ? 'Yüksek hacimli konteyner, daha fazla yük kapasitesi'
        : 'High volume container, greater load capacity',
      specs: locale === 'tr'
        ? ['76.3 m³ hacim', '26,580 kg max yük', 'High Cube']
        : ['76.3 m³ volume', '26,580 kg max load', 'High Cube'],
    },
  ];

  return (
    <section ref={ref} className="relative py-32 overflow-hidden bg-dark-900">
      {/* Background Image - User Provided */}
      <div className="absolute inset-0 z-0">
        <Image 
          src="/Free Cargo Stock Images _ StockCake.jpeg"
          alt="Konteyner Stokları"
          fill
          className="object-cover opacity-100"
          sizes="100vw"
        />
      </div>
      {/* Lightened Overlay for better image visibility */}
      <div className="absolute inset-0 bg-black/25 z-[1]" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-white font-bold tracking-widest uppercase text-sm mb-3 block opacity-90">
            {locale === 'tr' ? 'KONTEYNERLARIMIZ' : 'OUR CONTAINERS'}
          </span>
          <h2 className="text-4xl md:text-5xl font-display font-black text-white mb-6 whitespace-pre-line">
            {t.containers.title.replace('Standartlarda ', 'Standartlarda\n')}
          </h2>
          <div className="w-24 h-1.5 bg-secondary-500 mx-auto mb-8 rounded-full" />
          <p className="text-xl text-gray-200 max-w-2xl mx-auto leading-relaxed">
            {t.containers.subtitle}
          </p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
        >
          {containers.map((container, index) => (
            <motion.div
              key={container.id}
              variants={slideUp}
              className="group h-full"
            >
              <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 h-full border border-white/20 hover:border-secondary-500/50 flex flex-col group">
                <div className="w-16 h-16 border-2 border-primary-500 rounded-xl flex items-center justify-center mb-6 group-hover:bg-primary-500 transition-colors duration-300">
                  <Container className="w-8 h-8 text-white group-hover:text-white transition-colors" />
                </div>

                <div className="mb-4 flex-grow">
                  <div className="inline-block px-3 py-1 bg-primary-500/20 text-white rounded-full text-sm font-medium mb-3">
                    {container.type}
                  </div>
                  <h3 className="text-2xl font-display font-bold text-white mb-3 group-hover:text-primary-400 transition-colors">
                    {container.name}
                  </h3>
                  <p className="text-gray-300 mb-4 leading-relaxed">{container.description}</p>
                </div>

                <ul className="space-y-3 mb-8">
                  {container.specs.map((spec, idx) => (
                    <li key={idx} className="flex items-center text-sm text-gray-300 font-medium">
                      <div className="w-1.5 h-1.5 bg-primary-500 rounded-full mr-3" />
                      {spec}
                    </li>
                  ))}
                </ul>

                <Link href={`/${locale}/konteynerlar#${container.id}`} className="mt-auto">
                  <Button variant="primary" className="w-full !bg-red-600 !bg-none hover:!bg-red-700 transition-all hover:shadow-xl hover:shadow-red-500/40">
                    {locale === 'tr' ? 'Detayları Görüntüle' : 'View Details'}
                  </Button>
                </Link>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <div className="text-center">
          <Link href={`/${locale}/konteynerlar`}>
            <Button variant="primary" size="lg" className="!bg-[#0069b4] !bg-none hover:!bg-[#005490] px-12 py-4 text-lg rounded-full transition-all hover:shadow-2xl hover:shadow-blue-500/40">
              {locale === 'tr' ? 'Tüm Konteynerleri İncele' : 'Explore All Containers'}
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
