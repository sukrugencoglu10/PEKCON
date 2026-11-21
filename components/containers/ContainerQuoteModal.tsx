'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import type { Locale } from '@/lib/i18n';

export type ContainerModalItem = {
  name: string;
  image?: string;
  images?: string[];
  initialIndex?: number;
  type?: string;
  desc?: string;
};

const WHATSAPP_NUMBER = '905427179357';

export default function ContainerQuoteModal({
  item,
  onClose,
  locale,
}: {
  item: ContainerModalItem | null;
  onClose: () => void;
  locale: Locale;
}) {
  const isTr = locale === 'tr';
  const quoteBase = locale === 'en' ? '/en/quote' : `/${locale}/teklif-al`;
  const quoteHref = item?.type ? `${quoteBase}?tip=${encodeURIComponent(item.type)}` : quoteBase;

  const gallery = item?.images && item.images.length > 0 ? item.images : item?.image ? [item.image] : [];
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    setActiveIdx(item?.initialIndex ?? 0);
  }, [item]);

  const hasGallery = gallery.length > 0;
  const activeSrc = gallery[activeIdx] ?? gallery[0];

  const prev = () => setActiveIdx((i) => (i - 1 + gallery.length) % gallery.length);
  const next = () => setActiveIdx((i) => (i + 1) % gallery.length);

  return (
    <AnimatePresence>
      {item && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 cursor-zoom-out overflow-y-auto"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className={`relative w-full my-auto bg-white rounded-2xl overflow-hidden shadow-2xl grid grid-cols-1 cursor-default ${
              hasGallery ? 'max-w-6xl md:grid-cols-[3fr_2fr]' : 'max-w-lg'
            }`}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label={item.name}
          >
            <button
              onClick={onClose}
              className="absolute top-3 right-3 z-20 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full backdrop-blur-md transition-colors"
              aria-label={isTr ? 'Kapat' : 'Close'}
            >
              <X className="w-6 h-6" />
            </button>

            {hasGallery && activeSrc && (
              <div className="flex flex-col bg-gray-100">
                <div className="relative w-full h-[38vh] md:h-[62vh] flex items-center justify-center overflow-hidden">
                  <img
                    src={activeSrc}
                    alt={`${item.name} (${activeIdx + 1}/${gallery.length})`}
                    className="w-full h-full object-contain p-4 md:p-8"
                  />

                  {gallery.length > 1 && (
                    <>
                      <button
                        type="button"
                        onClick={prev}
                        aria-label={isTr ? 'Önceki fotoğraf' : 'Previous photo'}
                        className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/50 hover:bg-black/75 text-white backdrop-blur-sm transition-colors"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <button
                        type="button"
                        onClick={next}
                        aria-label={isTr ? 'Sonraki fotoğraf' : 'Next photo'}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/50 hover:bg-black/75 text-white backdrop-blur-sm transition-colors"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                      <span className="absolute bottom-3 right-3 px-2.5 py-1 rounded-full bg-black/60 text-white text-xs font-semibold">
                        {activeIdx + 1} / {gallery.length}
                      </span>
                    </>
                  )}
                </div>

                {gallery.length > 1 && (
                  <div className="flex items-center gap-2 px-4 py-3 bg-gray-200/70 overflow-x-auto">
                    {gallery.map((src, idx) => (
                      <button
                        key={`${src}-${idx}`}
                        type="button"
                        onClick={() => setActiveIdx(idx)}
                        className={`relative w-16 h-12 rounded-lg overflow-hidden shrink-0 border-2 transition-all ${
                          idx === activeIdx
                            ? 'border-primary-600 ring-2 ring-primary-600/30'
                            : 'border-transparent opacity-70 hover:opacity-100'
                        }`}
                      >
                        <img
                          src={src}
                          alt={`${item.name} ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className="flex flex-col justify-center gap-5 p-6 md:p-8 pt-14 md:pt-14">
              <div>
                {item.type && (
                  <div className="inline-block px-2 py-1 bg-primary-500/10 text-primary-600 rounded-full text-xs font-semibold mb-2">
                    {item.type}
                  </div>
                )}
                <h3 className="text-2xl font-display font-bold text-dark-900">{item.name}</h3>
                {item.desc && <p className="mt-2 text-sm md:text-base text-gray-600 leading-relaxed">{item.desc}</p>}
              </div>

              <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
                <p className="text-sm md:text-base text-amber-900 leading-relaxed">
                  {isTr ? (
                    <>
                      <strong>Stoklarımız anlık değişiyor.</strong> Güncel konteyner fotoğrafları ve fiyat bilgisi için bizimle WhatsApp iletişim hattımızdan hemen iletişime geçebilirsiniz.
                    </>
                  ) : (
                    <>
                      <strong>Our stock changes constantly.</strong> For the latest container photos and pricing, contact us on our WhatsApp line.
                    </>
                  )}
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <Link
                  href={quoteHref}
                  className="inline-flex items-center justify-center rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold px-5 py-3 transition-colors"
                >
                  {isTr ? 'Teklif Al' : 'Get a Quote'}
                </Link>
                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
                    isTr
                      ? `Merhaba, ${item.name} için güncel fotoğraf ve fiyat bilgisi almak istiyorum.`
                      : `Hello, I would like the latest photos and price for the ${item.name}.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-xl bg-green-600 hover:bg-green-700 text-white font-semibold px-5 py-3 transition-colors"
                >
                  {isTr ? "WhatsApp'tan İletişime Geç" : 'Contact on WhatsApp'}
                </a>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
