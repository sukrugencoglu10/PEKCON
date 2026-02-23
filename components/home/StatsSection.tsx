'use client';

import { motion, useInView, useSpring, useMotionValue, useTransform } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { getTranslations, type Locale } from '@/lib/i18n';

// Animated Counter Component
const AnimatedCounter = ({ value, duration = 2 }: { value: number, duration?: number }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, { damping: 50, stiffness: 100 });
  const rounded = useTransform(springValue, (latest) => Math.floor(latest));

  useEffect(() => {
    if (inView) {
      motionValue.set(value);
    }
  }, [inView, value, motionValue]);

  useEffect(() => {
    return rounded.on("change", (latest) => {
      if (ref.current) {
        ref.current.textContent = latest.toLocaleString();
      }
    });
  }, [rounded]);

  return <span ref={ref} />;
};

export default function StatsSection({ locale = 'tr' }: { locale?: Locale }) {
  const t = getTranslations(locale);
  
  const stats = [
    { 
      id: 1, 
      value: 15, 
      label: t.stats.experience || 'Yıl Tecrübe', 
      suffix: '+',
      description: 'Lojistik sektöründe güvenilir çözüm ortağı'
    },
    { 
      id: 2, 
      value: 80, 
      label: t.stats.countries || 'Ülkeye Hizmet', 
      suffix: '+',
      description: 'Dünya genelinde geniş acente ağı'
    },
    { 
      id: 3, 
      value: 5000, 
      label: t.stats.containers || 'Konteyner/Yıl', 
      suffix: '+',
      description: 'Yıllık ortalama konteyner hareketi'
    },
    { 
      id: 4, 
      value: 100, 
      label: t.stats.satisfaction || 'Müşteri Memnuniyeti', 
      suffix: '%',
      description: 'Koşulsuz müşteri memnuniyeti ilkesi'
    },
  ];

  // Helper to colorize title
  const renderTitle = () => {
     if (locale === 'en') {
        return (
           <>
              <span className="text-secondary-600">PEK</span><span className="text-primary-600">CON</span> in Numbers
           </>
        )
     }
     return (
        <>
           Rakamlarla <span className="text-secondary-600">PEK</span><span className="text-primary-600">CON</span>
        </>
     )
  }

  return (
    <section className="py-16 md:py-24 bg-white relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-5">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary-500 rounded-full blur-3xl" />
        <div className="absolute top-1/2 right-0 w-64 h-64 bg-secondary-500 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-display font-bold text-dark-900 mb-4">
            {renderTitle()}
          </h2>
          <div className="w-20 h-1 bg-primary-500 mx-auto rounded-full" />
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="group text-center"
            >
              <div className="mb-2 relative inline-block">
                <span className="text-4xl md:text-5xl lg:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-br from-primary-600 to-secondary-600 font-display">
                  <AnimatedCounter value={stat.value} />
                  {stat.suffix}
                </span>
                
                {/* Hover Effect Ring */}
                <div className="absolute -inset-4 border-2 border-primary-100 rounded-full scale-0 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-500" />
              </div>
              
              <h3 className="text-lg md:text-xl font-bold text-dark-800 mb-2">
                {stat.label}
              </h3>
              
              <p className="text-sm text-gray-500 max-w-[200px] mx-auto hidden md:block opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0">
                {stat.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
