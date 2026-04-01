'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { X, MessageCircle, FileText, Package } from 'lucide-react';

const WHATSAPP_URL = 'https://wa.me/902122979758?text=Merhaba%2C%20konteyner%20hakk%C4%B1nda%20bilgi%20almak%20istiyorum.';
const DISMISS_KEY = 'stickyBarDismissed';
const SCROLL_THRESHOLD = 500;

export default function StickyQuoteBar({ locale }: { locale: string }) {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const pathname = usePathname();

  const isQuotePage = pathname?.includes('teklif-al');

  const texts = {
    tr: {
      label: 'Konteyner ihtiyacınız mı var?',
      sub: 'Satın al veya kirala, hemen teklif al',
      whatsapp: 'WhatsApp',
      quote: 'Teklif Al',
    },
    en: {
      label: 'Need a container?',
      sub: 'Buy or rent, get a quote now',
      whatsapp: 'WhatsApp',
      quote: 'Get Quote',
    },
  };

  const t = texts[locale as keyof typeof texts] ?? texts.tr;

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const alreadyDismissed = sessionStorage.getItem(DISMISS_KEY) === '1';
      if (alreadyDismissed) setDismissed(true);
    }
  }, []);

  useEffect(() => {
    if (dismissed || isQuotePage) return;

    const handleScroll = () => {
      setVisible(window.scrollY > SCROLL_THRESHOLD);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [dismissed, isQuotePage]);

  const handleDismiss = () => {
    setDismissed(true);
    setVisible(false);
    sessionStorage.setItem(DISMISS_KEY, '1');
  };

  if (isQuotePage) return null;

  return (
    <AnimatePresence>
      {visible && !dismissed && (
        <motion.div
          key="sticky-quote-bar"
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 28 }}
          className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-200 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]"
        >
          <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-3">

            {/* İkon + Metin */}
            <div className="hidden sm:flex items-center gap-2.5 flex-1 min-w-0">
              <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-primary-50 flex items-center justify-center">
                <Package size={18} className="text-primary-600" />
              </div>
              <div className="min-w-0">
                <p className="text-slate-900 font-bold text-sm leading-tight truncate">{t.label}</p>
                <p className="text-slate-500 text-xs leading-tight truncate">{t.sub}</p>
              </div>
            </div>

            {/* Mobilde sadece kısa metin */}
            <div className="sm:hidden flex-1 min-w-0">
              <p className="text-slate-900 font-bold text-sm truncate">{t.label}</p>
            </div>

            {/* Butonlar */}
            <div className="flex items-center gap-2 flex-shrink-0">
              {/* WhatsApp */}
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 bg-green-500 hover:bg-green-600 text-white text-sm font-medium px-3 py-2 rounded-lg transition-colors duration-150"
              >
                <MessageCircle size={16} />
                <span className="hidden xs:inline">{t.whatsapp}</span>
              </a>

              {/* Teklif Al */}
              <a
                href={`/${locale}/teklif-al`}
                className="flex items-center gap-1.5 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium px-3 py-2 rounded-lg transition-colors duration-150"
              >
                <FileText size={16} />
                <span>{t.quote}</span>
              </a>

              {/* Kapat */}
              <button
                onClick={handleDismiss}
                aria-label="Kapat"
                className="flex items-center justify-center w-8 h-8 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors duration-150 ml-1"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
