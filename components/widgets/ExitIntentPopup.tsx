'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Phone, MessageCircle, ArrowRight, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { getTranslations, type Locale } from '@/lib/i18n';

const COOKIE_NAME = 'pekcon_exit_shown';
const COOLDOWN_HOURS = 24;

export default function ExitIntentPopup({ locale = 'tr' }: { locale?: Locale }) {
  const [show, setShow] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);
  const t = getTranslations(locale);
  const e = t.exitPopup;

  // Check if popup was already shown recently
  const wasRecentlyShown = useCallback(() => {
    try {
      const shown = localStorage.getItem(COOKIE_NAME);
      if (!shown) return false;
      const diff = Date.now() - parseInt(shown);
      return diff < COOLDOWN_HOURS * 60 * 60 * 1000;
    } catch {
      return false;
    }
  }, []);

  const markAsShown = () => {
    try {
      localStorage.setItem(COOKIE_NAME, Date.now().toString());
    } catch { /* ignore */ }
  };

  const handleClose = () => {
    setShow(false);
    markAsShown();
  };

  useEffect(() => {
    if (wasRecentlyShown()) return;

    // Minimum time on page before triggering (8 seconds)
    const minTimeTimer = setTimeout(() => {
      // Desktop: mouse leaves viewport from top
      const handleMouseLeave = (ev: MouseEvent) => {
        if (ev.clientY <= 0 && !hasTriggered) {
          setHasTriggered(true);
          setShow(true);
        }
      };

      document.addEventListener('mouseleave', handleMouseLeave);

      return () => {
        document.removeEventListener('mouseleave', handleMouseLeave);
      };
    }, 8000);

    // Mobile: back button / visibility change after 15s
    const mobileTimer = setTimeout(() => {
      const handleVisibility = () => {
        if (document.visibilityState === 'hidden' && !hasTriggered) {
          setHasTriggered(true);
          // Show when they come back
          const handleReturn = () => {
            if (document.visibilityState === 'visible') {
              setShow(true);
              document.removeEventListener('visibilitychange', handleReturn);
            }
          };
          document.addEventListener('visibilitychange', handleReturn);
        }
      };
      document.addEventListener('visibilitychange', handleVisibility);
      return () => document.removeEventListener('visibilitychange', handleVisibility);
    }, 15000);

    return () => {
      clearTimeout(minTimeTimer);
      clearTimeout(mobileTimer);
    };
  }, [hasTriggered, wasRecentlyShown]);

  if (!e) return null;

  return (
    <AnimatePresence>
      {show && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999]"
            onClick={handleClose}
          />

          {/* Popup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="fixed inset-0 z-[10000] flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="relative w-full max-w-md pointer-events-auto" onClick={(ev) => ev.stopPropagation()}>
              {/* Glow effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-violet-600 to-cyan-500 rounded-2xl blur-lg opacity-50 animate-pulse" />

              <div className="relative bg-gradient-to-br from-gray-900 via-slate-900 to-gray-950 rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
                {/* Animated top accent */}
                <div className="h-1 bg-gradient-to-r from-blue-500 via-violet-500 to-cyan-400" />

                {/* Close button */}
                <button
                  onClick={handleClose}
                  className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors z-10"
                  aria-label="Kapat"
                >
                  <X size={20} />
                </button>

                <div className="p-6 pb-4 text-center">
                  {/* Icon */}
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                    className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-blue-500/20 to-violet-500/20 border border-blue-400/30 mb-4"
                  >
                    <Sparkles size={28} className="text-blue-400" />
                  </motion.div>

                  {/* Title */}
                  <h3 className="text-2xl font-bold text-white mb-2">
                    {e.title}
                  </h3>
                  <p className="text-gray-400 text-sm mb-6 leading-relaxed">
                    {e.subtitle}
                  </p>

                  {/* CTA Buttons */}
                  <div className="space-y-3">
                    {/* Primary CTA — WhatsApp */}
                    <Link
                      href="https://wa.me/905543545201"
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={handleClose}
                      className="flex items-center justify-center gap-2 w-full py-3.5 px-4 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold rounded-xl transition-all duration-200 shadow-lg shadow-green-500/25 hover:shadow-green-500/40 text-sm"
                    >
                      <MessageCircle size={18} />
                      {e.whatsapp}
                    </Link>

                    {/* Secondary CTA — Call */}
                    <a
                      href="tel:+905543545201"
                      onClick={handleClose}
                      className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white font-semibold rounded-xl transition-all duration-200 text-sm"
                    >
                      <Phone size={16} />
                      {e.call}
                    </a>

                    {/* Tertiary CTA — Quote form */}
                    <Link
                      href={`/${locale === 'en' ? 'en' : locale}/teklif-al`}
                      onClick={handleClose}
                      className="flex items-center justify-center gap-2 w-full py-3 px-4 text-gray-400 hover:text-blue-400 font-medium transition-colors text-sm"
                    >
                      {e.form}
                      <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>

                {/* Bottom trust line */}
                <div className="px-6 py-3 bg-white/[0.03] border-t border-white/5 text-center">
                  <p className="text-[11px] text-gray-500">
                    {e.trust}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
