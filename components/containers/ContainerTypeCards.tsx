'use client';

import { useState, type ReactNode } from 'react';
import { ChevronLeft, ChevronRight, Images } from 'lucide-react';
import type { Locale } from '@/lib/i18n';
import ContainerQuoteModal, { type ContainerModalItem } from './ContainerQuoteModal';

export type ContainerTypeCard = {
  icon: ReactNode;
  name: string;
  desc: string;
  image?: string;
  images?: string[];
  type?: string;
};

export default function ContainerTypeCards({ types, locale }: { types: ContainerTypeCard[]; locale: Locale }) {
  const [selected, setSelected] = useState<ContainerModalItem | null>(null);
  const [slideIndexes, setSlideIndexes] = useState<Record<string, number>>({});

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {types.map((t) => {
          const gallery = t.images && t.images.length > 0 ? t.images : t.image ? [t.image] : [];
          const activeIdx = gallery.length > 0 ? (slideIndexes[t.name] ?? 0) % gallery.length : 0;
          const activeSrc = gallery[activeIdx];

          const open = () =>
            setSelected({
              name: t.name,
              image: activeSrc,
              images: gallery.length > 0 ? gallery : undefined,
              initialIndex: activeIdx,
              type: t.type,
              desc: gallery.length > 0 ? undefined : t.desc,
            });

          const stepSlide = (delta: number) => {
            setSlideIndexes((prev) => ({
              ...prev,
              [t.name]: ((prev[t.name] ?? 0) + delta + gallery.length) % gallery.length,
            }));
          };

          return (
            <div
              key={t.name}
              role="button"
              tabIndex={0}
              onClick={open}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  open();
                }
              }}
              className="group bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg hover:border-primary-300 transition-shadow p-5 cursor-pointer flex flex-col"
            >
              {activeSrc && (
                <div className="relative w-full aspect-[16/10] mb-4 rounded-xl overflow-hidden bg-gray-100">
                  <img
                    src={activeSrc}
                    alt={t.name}
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />

                  {gallery.length > 1 && (
                    <>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          stepSlide(-1);
                        }}
                        aria-label={locale === 'tr' ? 'Önceki fotoğraf' : 'Previous photo'}
                        className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/50 hover:bg-black/75 text-white transition-opacity sm:opacity-0 sm:group-hover:opacity-100"
                      >
                        <ChevronLeft size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          stepSlide(1);
                        }}
                        aria-label={locale === 'tr' ? 'Sonraki fotoğraf' : 'Next photo'}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/50 hover:bg-black/75 text-white transition-opacity sm:opacity-0 sm:group-hover:opacity-100"
                      >
                        <ChevronRight size={16} />
                      </button>
                      <span className="absolute top-2 right-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/65 text-white text-[11px] font-semibold">
                        <Images size={11} />
                        {activeIdx + 1}/{gallery.length}
                      </span>
                      <div className="absolute bottom-2 inset-x-0 flex items-center justify-center gap-1.5">
                        {gallery.map((_, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSlideIndexes((prev) => ({ ...prev, [t.name]: idx }));
                            }}
                            aria-label={`${idx + 1}. fotoğraf`}
                            className={`h-1.5 rounded-full transition-all ${
                              idx === activeIdx ? 'w-4 bg-white' : 'w-1.5 bg-white/60 hover:bg-white/90'
                            }`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>
              )}

              <div className="flex items-center gap-3 mb-2">
                <span className="flex-shrink-0 w-11 h-11 rounded-xl bg-primary-50 flex items-center justify-center">
                  {t.icon}
                </span>
                <h3 className="font-bold text-dark-900 text-lg">{t.name}</h3>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">{t.desc}</p>
            </div>
          );
        })}
      </div>

      <ContainerQuoteModal item={selected} onClose={() => setSelected(null)} locale={locale} />
    </>
  );
}
