'use client';

import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import type { ContainerType } from './KonteynerScene';

// Kullanıcı seçim yapana kadar fotoğraflar bu sırayla döner
const AUTOPLAY_ORDER: ContainerType[] = ['40hc', '20dc', '40dc'];
const AUTOPLAY_MS = 4000;

/**
 * Seçili konteyner tipi + otomatik geçiş. Kullanıcı formdan ya da kartlardan
 * bir tip seçince (pick) otomatik geçiş durur.
 */
export function useContainerAutoplay(initial: ContainerType = '40hc') {
  const reduceMotion = useReducedMotion();
  const [selected, setSelected] = useState<ContainerType>(initial);
  const [userPicked, setUserPicked] = useState(false);

  useEffect(() => {
    if (userPicked || reduceMotion) return;
    const id = setInterval(() => {
      setSelected((cur) => {
        const i = AUTOPLAY_ORDER.indexOf(cur);
        return AUTOPLAY_ORDER[(i + 1) % AUTOPLAY_ORDER.length];
      });
    }, AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [userPicked, reduceMotion]);

  const pick = useCallback((type: ContainerType) => {
    setUserPicked(true);
    setSelected(type);
  }, []);

  return { selected, pick };
}

// Arka planı temizlenmiş gerçek konteyner fotoğrafları (public/konteyner/*.webp)
const PHOTOS = {
  '20dc': { src: '/konteyner/20dc.webp', label: "20' DC", width: 900, height: 836, scale: 0.78 },
  '40dc': { src: '/konteyner/40dc.webp', label: "40' DC", width: 900, height: 675, scale: 1 },
  '40hc': { src: '/konteyner/40hc.webp', label: "40' HC", width: 900, height: 755, scale: 1 },
} as const;

type PhotoKey = keyof typeof PHOTOS;

/** Formda/kartlarda seçilen tipe en yakın fotoğraf (reefer, flat rack vb. için boyuta göre). */
export function photoKeyFor(type: ContainerType): PhotoKey {
  if (type.startsWith('20')) return '20dc';
  if (type === '40hc' || type === '45hc' || type === '40rf') return '40hc';
  return '40dc';
}

export default function ContainerPhotoShowcase({
  containerType = '40hc',
  locale = 'tr',
  variant = 'dark',
}: {
  containerType?: ContainerType;
  locale?: string;
  /** dark: koyu zemin (ana sayfa hero), light: açık zemin (teklif al sayfası) */
  variant?: 'dark' | 'light';
}) {
  const reduceMotion = useReducedMotion();
  const isLight = variant === 'light';
  const key = photoKeyFor(containerType);
  const photo = PHOTOS[key];

  return (
    <div className="relative w-full h-[200px] md:h-[280px] flex items-center justify-center select-none">
      {/* Zemin gölgesi */}
      <div
        className={`absolute bottom-3 md:bottom-5 left-1/2 -translate-x-1/2 w-[70%] h-6 md:h-8 rounded-[50%] blur-xl ${
          isLight ? 'bg-black/20' : 'bg-black/40'
        }`}
      />

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={key}
          initial={reduceMotion ? { opacity: 0 } : { opacity: 0, x: 60, scale: 0.94 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={reduceMotion ? { opacity: 0 } : { opacity: 0, x: -60, scale: 0.94 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="relative h-full flex items-center justify-center"
          style={{ width: `${photo.scale * 100}%` }}
        >
          {/* Süzülme: CSS transform animasyonu (compositor). drop-shadow'lu görsel bir kez
              rasterize edilir; JS ile her kare yeniden boyanmaz. */}
          <div className="relative w-full h-full animate-bob">
            <Image
              src={photo.src}
              alt={
                locale === 'en'
                  ? `${photo.label} shipping container for sale - PEKCON`
                  : `Satılık ${photo.label} yük konteyneri - PEKCON`
              }
              fill
              sizes="(max-width: 1024px) 90vw, 420px"
              className={`object-contain ${
                isLight
                  ? 'drop-shadow-[0_14px_22px_rgba(0,0,0,0.22)]'
                  : 'drop-shadow-[0_18px_30px_rgba(0,0,0,0.45)]'
              }`}
              priority={key === '40hc'}
            />
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Seçili tip rozeti */}
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={`label-${key}`}
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 6 }}
          transition={{ duration: 0.3 }}
          className={`absolute top-2 left-2 md:top-3 md:left-3 rounded-full px-3 py-1 text-xs md:text-sm font-bold shadow ${
            isLight
              ? 'bg-white/90 border border-primary-200 text-primary-600'
              : 'bg-white/15 border border-white/25 text-white'
          }`}
        >
          {photo.label}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}
