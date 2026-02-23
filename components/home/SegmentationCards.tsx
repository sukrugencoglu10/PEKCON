'use client';

import { motion } from 'framer-motion';
import { Building2, User } from 'lucide-react';
import Link from 'next/link';
import { getTranslations, type Locale } from '@/lib/i18n';
import Button from '../ui/Button';

export default function SegmentationCards({ locale = 'tr' }: { locale?: Locale }) {
  const t = getTranslations(locale);

  const cards = [
    {
      id: 'corporate',
      title: locale === 'tr' ? 'Kurumsal Çözümler' : 'Corporate Solutions',
      description: locale === 'tr' ? 'Toplu alım, filo kiralama ve proje bazlı lojistik talepleriniz için.' : 'For bulk purchase, fleet rental and project-based logistics requests.',
      icon: <Building2 size={48} className="text-secondary-500" />,
      cta: locale === 'tr' ? 'Kurumsal Teklif Al' : 'Get Corporate Quote',
      href: `/${locale}/teklif-al?type=corporate`, 
      color: 'secondary',
    },
    {
      id: 'individual',
      title: locale === 'tr' ? 'Bireysel & Özel Projeler' : 'Individual & Custom Projects',
      description: locale === 'tr' ? 'Tekil konteyner ihtiyaçlarınız ve özel tasarım projeleriniz için.' : 'For your单个 container needs and custom design projects.',
      icon: <User size={48} className="text-primary-500" />,
      cta: locale === 'tr' ? 'Hemen İncele' : 'Explore Now',
      href: `/${locale}/konteynerlar`,
      color: 'primary',
    },
  ];

  return (
    <section className="py-12 bg-gray-50 relative z-20 -mt-16 md:-mt-24 px-4">
      <div className="container mx-auto">
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {cards.map((card, index) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2, duration: 0.6 }}
              whileHover={{ y: -10 }}
              className="bg-white rounded-2xl shadow-xl overflow-hidden group hover:shadow-2xl transition-all duration-300 border border-gray-100"
            >
              <div className="p-8 flex flex-col items-center text-center h-full relative">
                {/* Top Border Accent */}
                <div className={`absolute top-0 left-0 w-full h-2 ${card.color === 'secondary' ? 'bg-secondary-500' : 'bg-primary-500'}`} />
                
                <div className={`mb-6 p-4 rounded-full bg-${card.color}-50 group-hover:scale-110 transition-transform duration-300`}>
                  {card.icon}
                </div>
                
                <h3 className="text-2xl font-display font-bold text-dark-900 mb-3">
                  {card.title}
                </h3>
                
                <p className="text-gray-600 mb-8 flex-grow">
                  {card.description}
                </p>
                
                <Link href={card.href} className="w-full">
                  <Button 
                    variant={card.color === 'secondary' ? 'outline' : 'primary'} 
                    className="w-full"
                  >
                    {card.cta}
                  </Button>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
