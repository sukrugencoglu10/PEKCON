'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { X, FileText, Package, Phone } from 'lucide-react';
import { trackStickyBarEvent } from '@/lib/gtm';

const PHONE_HREF = 'tel:+902122979758';
const DISMISS_KEY = 'stickyBarDismissed';
const SCROLL_THRESHOLD = 500;
const MOBILE_QUERY = '(max-width: 639px)';
export const STICKY_BAR_EVENT = 'sticky-quote-bar-change';

// Alt çubuk: "Ara" + "Teklif Al".
// Mobilde sayfa açılır açılmaz görünür ve kapatılamaz (trafiğin %91'i mobil;
// iletişim butonları her an parmağın altında olsun). Masaüstünde 500px
// kaydırınca çıkar ve kapatılabilir. WhatsApp ayrı yüzen buton olarak kalır
// ve çubuk açıkken onun üstüne kayar (STICKY_BAR_EVENT).
export default function StickyQuoteBar({ locale }: { locale: string }) {
  const [scrolled, setScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const pathname = usePathname();

  const isQuotePage = !!pathname && (pathname.includes('teklif-al') || pathname.includes('/quote'));

  const texts = {
    tr: {
      label: 'Konteyner ihtiyacınız mı var?',
      sub: 'Hemen arayın veya hızlı teklif alın',
      call: 'Hemen Ara',
      quote: 'Teklif Al',
      quoteHref: '/tr/teklif-al',
    },
    en: {
      label: 'Need a container?',
      sub: 'Call now or get a quick quote',
      call: 'Call Now',
      quote: 'Get Quote',
      quoteHref: '/en/quote',
    },
  };

  const t = texts[locale as keyof typeof texts] ?? texts.tr;

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      if (sessionStorage.getItem(DISMISS_KEY) === '1') setDismissed(true);
    } catch {}

    const mq = window.matchMedia(MOBILE_QUERY);
    const syncMobile = () => setIsMobile(mq.matches);
    syncMobile();
    mq.addEventListener('change', syncMobile);
    return () => mq.removeEventListener('change', syncMobile);
  }, []);

  useEffect(() => {
    if (isQuotePage) return;
    const handleScroll = () => setScrolled(window.scrollY > SCROLL_THRESHOLD);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isQuotePage]);

  // Mobilde her zaman; masaüstünde kaydırınca ve kapatılmadıysa
  const shown = !isQuotePage && (isMobile || (scrolled && !dismissed));

  // Track first impression
  const impressionFiredRef = useRef(false);
  useEffect(() => {
    if (shown && !impressionFiredRef.current) {
      impressionFiredRef.current = true;
      trackStickyBarEvent('impression', locale);
    }
  }, [shown, locale]);

  // Çubuk görünürlüğünü ve yüksekliğini yayınla: WhatsApp butonu çubuk açıkken onun üstüne kayar
  const barRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    // Animasyon başlamadan ölçülebilsin diye bir kare bekle
    const id = requestAnimationFrame(() => {
      const height = shown ? barRef.current?.offsetHeight ?? 64 : 0;
      // Sonradan mount olan WhatsApp butonu son değeri buradan okur
      (window as unknown as { __stickyBarHeight?: number }).__stickyBarHeight = height;
      window.dispatchEvent(new CustomEvent(STICKY_BAR_EVENT, { detail: { height } }));
    });
    return () => cancelAnimationFrame(id);
  }, [shown, isMobile]);
  useEffect(() => {
    return () => {
      (window as unknown as { __stickyBarHeight?: number }).__stickyBarHeight = 0;
      window.dispatchEvent(new CustomEvent(STICKY_BAR_EVENT, { detail: { height: 0 } }));
    };
  }, []);

  const handleDismiss = () => {
    trackStickyBarEvent('dismiss', locale);
    setDismissed(true);
    try {
      sessionStorage.setItem(DISMISS_KEY, '1');
    } catch {}
  };

  if (isQuotePage) return null;

  return (
    <>
      {/* Mobilde sabit çubuk sayfa sonunu (footer) örtmesin */}
      <div aria-hidden className="h-[72px] sm:hidden" />

      <AnimatePresence>
        {shown && (
          <motion.div
            ref={barRef}
            key="sticky-quote-bar"
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 28 }}
            className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 shadow-[0_-10px_40px_rgba(0,0,0,0.08)] pb-[env(safe-area-inset-bottom)]"
          >
            <div className="max-w-7xl mx-auto px-3 sm:px-4 py-2.5 sm:py-3 flex items-center gap-3">

              {/* İkon + Metin (yalnızca masaüstü/tablet) */}
              <div className="hidden sm:flex items-center gap-2.5 flex-1 min-w-0">
                <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-primary-50 flex items-center justify-center">
                  <Package size={18} className="text-primary-600" />
                </div>
                <div className="min-w-0">
                  <p className="text-slate-900 font-bold text-sm leading-tight truncate">{t.label}</p>
                  <p className="text-slate-500 text-xs leading-tight truncate">{t.sub}</p>
                </div>
              </div>

              {/* Butonlar — mobilde eşit genişlikte iki büyük buton */}
              <div className="flex flex-1 sm:flex-none items-center gap-2 sm:flex-shrink-0">
                {/* Ara — tıklama AnalyticsEvents'teki tel: dinleyicisiyle phone_click olarak ölçülür */}
                <a
                  href={PHONE_HREF}
                  data-cta-location="sticky_bar"
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-secondary-500 hover:bg-secondary-600 text-white font-semibold text-[15px] sm:text-sm px-3 sm:px-4 py-3 sm:py-2 rounded-xl sm:rounded-lg transition-colors duration-150"
                >
                  <Phone size={18} className="sm:w-4 sm:h-4" />
                  <span>{t.call}</span>
                </a>

                {/* Teklif Al */}
                <a
                  href={t.quoteHref}
                  data-cta-location="sticky_bar"
                  onClick={() => trackStickyBarEvent('cta_click', locale)}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold text-[15px] sm:text-sm px-3 sm:px-4 py-3 sm:py-2 rounded-xl sm:rounded-lg transition-colors duration-150"
                >
                  <FileText size={18} className="sm:w-4 sm:h-4" />
                  <span>{t.quote}</span>
                </a>

                {/* Kapat — yalnızca masaüstü */}
                <button
                  onClick={handleDismiss}
                  aria-label="Kapat"
                  className="hidden sm:flex items-center justify-center w-8 h-8 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors duration-150 ml-1"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
