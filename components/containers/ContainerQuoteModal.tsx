'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { X } from 'lucide-react';
import type { Locale } from '@/lib/i18n';

export type ContainerModalItem = {
  name: string;
  image?: string;
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
  // Seçilen konteyner tipi forma önceden doldurulsun (QuoteForm ?tip= okur)
  const quoteHref = item?.type ? `${quoteBase}?tip=${encodeURIComponent(item.type)}` : quoteBase;

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
              item.image ? 'max-w-6xl md:grid-cols-[3fr_2fr]' : 'max-w-lg'
            }`}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label={item.name}
          >
            <button
              onClick={onClose}
              className="absolute top-3 right-3 z-10 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full backdrop-blur-md transition-colors"
              aria-label={isTr ? 'Kapat' : 'Close'}
            >
              <X className="w-6 h-6" />
            </button>

            {item.image && (
              <div className="relative w-full h-[40vh] md:h-[70vh] bg-gray-100">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  sizes="(min-width: 768px) 60vw, 100vw"
                  className="object-contain p-6 md:p-10"
                />
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
