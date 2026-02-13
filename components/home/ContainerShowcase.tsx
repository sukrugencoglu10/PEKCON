'use client';

import { motion, useInView, AnimatePresence } from 'framer-motion';
import { useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { X } from 'lucide-react';
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
      image: '/20.webp',
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
      image: '/40.webp',
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
      image: '/40h.webp',
      description: locale === 'tr'
        ? 'Yüksek hacimli konteyner, daha fazla yük kapasitesi'
        : 'High volume container, greater load capacity',
      specs: locale === 'tr'
        ? ['76.3 m³ hacim', '26,580 kg max yük', 'High Cube']
        : ['76.3 m³ volume', '26,580 kg max load', 'High Cube'],
    },
  ];

  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  return (
    <section ref={ref} className="relative py-32 overflow-hidden bg-dark-900">
      {/* ... (background images remain same) */}
      <div className="absolute inset-0 z-0">
        <Image 
          src="/Free Cargo Stock Images _ StockCake.jpeg"
          alt="Konteyner Stokları"
          fill
          className="object-cover opacity-100"
          sizes="100vw"
        />
      </div>
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
              <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 h-full border border-white/20 hover:border-secondary-500/50 flex flex-col group relative">
                <div 
                  className="relative w-full h-48 mb-6 rounded-xl overflow-hidden cursor-zoom-in group-hover:scale-105 transition-transform duration-300 bg-white/5"
                  onClick={() => setSelectedImage(container.image)}
                >
                  <Image
                    src={container.image}
                    alt={container.name}
                    fill
                    className="object-contain p-4"
                  />
                  <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 hover:opacity-100">
                    <span className="bg-black/50 text-white text-xs px-2 py-1 rounded backdrop-blur-sm">
                      {locale === 'tr' ? 'Büyütmek için tıkla' : 'Click to enlarge'}
                    </span>
                  </div>
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

      {/* Image Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 cursor-zoom-out"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-5xl h-[80vh] bg-white/5 rounded-2xl overflow-hidden border border-white/10"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full backdrop-blur-md transition-colors"
                aria-label="Close modal"
              >
                <X className="w-6 h-6" />
              </button>
              <Image
                src={selectedImage || ''}
                alt="Enlarged view"
                fill
                className="object-contain p-8"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
