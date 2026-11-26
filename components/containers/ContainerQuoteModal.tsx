'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight, Instagram, Check } from 'lucide-react';
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
  const [shareMsg, setShareMsg] = useState('');

  useEffect(() => {
    setActiveIdx(item?.initialIndex ?? 0);
    setShareMsg('');
  }, [item]);

  const getShareUrl = () =>
    typeof window !== 'undefined'
      ? window.location.href
      : isTr
      ? 'https://pekcon.com/tr/satilik-konteyner'
      : 'https://pekcon.com/en/containers-for-sale';

  const handleInstagramShare = async () => {
    const shareUrl = getShareUrl();
    const shareTitle = item ? `${item.name} — PEKCON` : 'PEKCON';
    if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
      try {
        await navigator.share({ title: shareTitle, url: shareUrl });
        return;
      } catch (err) {
        if ((err as Error)?.name === 'AbortError') return;
      }
    }
    try {
      await navigator.clipboard.writeText(shareUrl);
      setShareMsg(
        isTr
          ? "Bağlantı kopyalandı! Instagram'da yapıştırıp paylaşabilirsiniz."
          : 'Link copied! Paste it in Instagram to share.'
      );
      setTimeout(() => setShareMsg(''), 3500);
    } catch {
      // ignore
    }
    window.open('https://www.instagram.com/', '_blank', 'noopener,noreferrer');
  };

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
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 cursor-zoom-out overflow-y-auto"
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
              className="absolute top-3 right-3 z-20 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors"
              aria-label={isTr ? 'Kapat' : 'Close'}
            >
              <X className="w-6 h-6" />
            </button>

            {hasGallery && activeSrc && (
              <div className="flex flex-col bg-gray-100">
                <div className="relative w-full h-[38vh] md:h-[62vh] flex items-center justify-center overflow-hidden">
                  {/* Optimize edilmiş, ekran boyutuna göre küçültülmüş sürüm (orijinal 2400px yerine) */}
                  <Image
                    key={activeSrc}
                    src={activeSrc}
                    alt={`${item.name} (${activeIdx + 1}/${gallery.length})`}
                    fill
                    sizes="(max-width: 768px) 100vw, 60vw"
                    className="object-contain p-4 md:p-8"
                  />

                  {gallery.length > 1 && (
                    <>
                      <button
                        type="button"
                        onClick={prev}
                        aria-label={isTr ? 'Önceki fotoğraf' : 'Previous photo'}
                        className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/50 hover:bg-black/75 text-white transition-colors"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <button
                        type="button"
                        onClick={next}
                        aria-label={isTr ? 'Sonraki fotoğraf' : 'Next photo'}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/50 hover:bg-black/75 text-white transition-colors"
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
                        <Image
                          src={src}
                          alt={`${item.name} ${idx + 1}`}
                          fill
                          sizes="64px"
                          className="object-cover"
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

              {/* Paylaş ikonları */}
              <div className="pt-3 border-t border-gray-100 flex flex-col items-center gap-2">
                <div className="inline-flex items-center gap-3">
                  <span className="text-xs font-medium text-gray-400">
                    {isTr ? 'Paylaş:' : 'Share:'}
                  </span>
                  <a
                    href={`https://wa.me/?text=${encodeURIComponent(
                      `${item.name} — PEKCON ${getShareUrl()}`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={isTr ? "WhatsApp'ta Paylaş" : 'Share on WhatsApp'}
                    aria-label={isTr ? "WhatsApp'ta Paylaş" : 'Share on WhatsApp'}
                    className="w-10 h-10 rounded-full bg-[#25D366]/15 hover:bg-[#25D366] text-[#1fa855] hover:text-white flex items-center justify-center shadow-sm hover:shadow-md hover:scale-105 transition-all"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      width="19"
                      height="19"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path d="M20.52 3.48A11.86 11.86 0 0 0 12.06 0C5.49 0 .14 5.35.14 11.92c0 2.1.55 4.15 1.59 5.96L0 24l6.29-1.65a11.87 11.87 0 0 0 5.77 1.47h.01c6.57 0 11.92-5.35 11.92-11.92 0-3.18-1.24-6.17-3.47-8.42ZM12.06 21.8h-.01a9.87 9.87 0 0 1-5.04-1.38l-.36-.21-3.73.98 1-3.64-.24-.37a9.86 9.86 0 0 1-1.52-5.26c0-5.46 4.44-9.9 9.91-9.9 2.65 0 5.13 1.03 7 2.9a9.84 9.84 0 0 1 2.9 7c0 5.46-4.44 9.88-9.91 9.88Zm5.43-7.42c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.61-.92-2.21-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.22 3.08c.15.2 2.1 3.21 5.09 4.5.71.31 1.27.49 1.7.63.71.23 1.36.2 1.87.12.57-.09 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.41-.07-.12-.27-.2-.57-.35Z" />
                    </svg>
                  </a>
                  <button
                    type="button"
                    onClick={handleInstagramShare}
                    title={isTr ? "Instagram'da Paylaş" : 'Share on Instagram'}
                    aria-label={isTr ? "Instagram'da Paylaş" : 'Share on Instagram'}
                    className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-500/15 via-pink-500/15 to-purple-600/15 hover:from-amber-500 hover:via-pink-500 hover:to-purple-600 text-pink-600 hover:text-white flex items-center justify-center shadow-sm hover:shadow-md hover:scale-105 transition-all"
                  >
                    <Instagram size={19} />
                  </button>
                </div>
                {shareMsg && (
                  <p className="inline-flex items-center justify-center gap-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-1.5 w-full">
                    <Check size={14} className="shrink-0" />
                    <span>{shareMsg}</span>
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
