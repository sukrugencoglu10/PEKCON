'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import Link from 'next/link';
import { getTranslations, type Locale } from '@/lib/i18n';

const COOKIE_NAME = 'pekcon_exit_shown';
const DISMISSED_NAME = 'pekcon_exit_dismissed';

export default function ExitIntentPopup({ locale = 'tr' }: { locale?: Locale }) {
  const [show, setShow] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);
  const t = getTranslations(locale);
  const e = t.exitPopup;

  // Check if user permanently dismissed
  const wasDismissed = useCallback(() => {
    try {
      return localStorage.getItem(DISMISSED_NAME) === 'true';
    } catch {
      return false;
    }
  }, []);

  // Check if popup was already shown recently
  const wasRecentlyShown = useCallback(() => {
    try {
      const shown = localStorage.getItem(COOKIE_NAME);
      if (!shown) return false;
      const diff = Date.now() - parseInt(shown);
      return diff < 24 * 60 * 60 * 1000;
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

  // "Hayir, Tesekkurler" — permanently dismiss and let user leave
  const handleDismiss = () => {
    try {
      localStorage.setItem(DISMISSED_NAME, 'true');
    } catch { /* ignore */ }
    setShow(false);
    markAsShown();
  };

  useEffect(() => {
    if (wasDismissed() || wasRecentlyShown()) return;

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
  }, [hasTriggered, wasDismissed, wasRecentlyShown]);

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
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999]"
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
              {/* Glow effect — PEKCON red */}
              <div className="absolute -inset-1 bg-gradient-to-r from-red-600/40 via-red-500/30 to-red-700/40 rounded-2xl blur-lg opacity-60" />

              <div className="relative bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-2xl">
                {/* Top accent — PEKCON red gradient */}
                <div className="h-1.5 bg-gradient-to-r from-red-600 via-red-500 to-red-700" />

                {/* Close button */}
                <button
                  onClick={handleClose}
                  className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition-colors z-10"
                  aria-label="Kapat"
                >
                  <X size={20} />
                </button>

                <div className="p-6 pb-4 text-center">
                  {/* WhatsApp Icon — same SVG as site WhatsApp button */}
                  <motion.div
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                    className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#25D366] mb-4 shadow-lg shadow-green-500/30"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      className="w-9 h-9"
                      fill="white"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                    </svg>
                  </motion.div>

                  {/* Title */}
                  <h3 className="text-2xl font-bold text-secondary-600 mb-2">
                    {e.title}
                  </h3>
                  <p className="text-gray-500 text-sm mb-6 leading-relaxed">
                    {e.subtitle}
                  </p>

                  {/* CTA Buttons */}
                  <div className="space-y-3">
                    {/* Primary CTA — WhatsApp */}
                    <Link
                      href="https://wa.me/905427179357"
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={handleClose}
                      className="flex items-center justify-center gap-2 w-full py-3.5 px-4 bg-[#25D366] hover:bg-[#1fb855] text-white font-bold rounded-xl transition-all duration-200 shadow-lg shadow-green-500/25 hover:shadow-green-500/40 text-sm"
                    >
                      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="white" xmlns="http://www.w3.org/2000/svg">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                      </svg>
                      {e.whatsapp}
                    </Link>

                    {/* Dismiss button — "Hayir, Tesekkurler" */}
                    <button
                      onClick={handleDismiss}
                      className="w-full py-3 px-4 text-gray-400 hover:text-red-500 font-medium transition-colors text-sm rounded-xl hover:bg-gray-50"
                    >
                      {e.dismiss}
                    </button>
                  </div>
                </div>

                {/* Bottom trust line */}
                <div className="px-6 py-3 bg-gray-50 border-t border-gray-100 text-center">
                  <p className="text-[11px] text-gray-400">
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
