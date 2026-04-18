'use client';

import { motion } from 'framer-motion';
import { Ruler, Box, Weight } from 'lucide-react';
import { containers } from '@/data/containers';
import { getTranslations, type Locale } from '@/lib/i18n';
import type { ContainerType, ContainerCategory } from './KonteynerScene';

// ─── Per-category container data ─────────────────────────────────────────────
const CONTAINER_DATA_BY_CATEGORY: Record<ContainerCategory, Array<{
  id: string;
  label: string;
  widthRatio: number;
  heightRatio: number;
  isPopular?: boolean;
}>> = {
  standard: [
    { id: '20dc', label: "20' DC", widthRatio: 0.5,  heightRatio: 0.89 },
    { id: '40dc', label: "40' DC", widthRatio: 1.0,  heightRatio: 0.89 },
    { id: '40hc', label: "40' HC", widthRatio: 1.0,  heightRatio: 1.0, isPopular: true },
  ],
  reefer: [
    { id: '20rf', label: "20' Reefer",    widthRatio: 0.5,  heightRatio: 0.90 },
    { id: '40rf', label: "40' HC Reefer", widthRatio: 1.0,  heightRatio: 1.0, isPopular: true },
  ],
  flat_rack: [
    { id: '20fr', label: "20' Flat Rack", widthRatio: 0.5,  heightRatio: 0.89 },
    { id: '40fr', label: "40' Flat Rack", widthRatio: 1.0,  heightRatio: 0.89, isPopular: true },
  ],
  open_top: [
    { id: '20ot', label: "20' Open Top",  widthRatio: 0.5,  heightRatio: 0.89 },
    { id: '40ot', label: "40' Open Top",  widthRatio: 1.0,  heightRatio: 0.89, isPopular: true },
  ],
};

// ─── Accent color per category (for SVG & spec text) ─────────────────────────
const CATEGORY_ACCENT: Record<ContainerCategory, { stroke: string; fill: string; text: string }> = {
  standard: { stroke: '#0069b4', fill: 'rgba(0,105,180,0.12)',  text: 'text-primary-500' },
  reefer:   { stroke: '#00bcd4', fill: 'rgba(0,188,212,0.12)',  text: 'text-cyan-600'    },
  flat_rack:{ stroke: '#e64a19', fill: 'rgba(230,74,25,0.12)',  text: 'text-orange-600'  },
  open_top: { stroke: '#546e7a', fill: 'rgba(84,110,122,0.12)', text: 'text-slate-600'   },
};

// ─── SVG Silhouette ───────────────────────────────────────────────────────────
function ContainerSilhouette({
  widthRatio,
  heightRatio,
  isPopular,
  category = 'standard',
}: {
  widthRatio: number;
  heightRatio: number;
  isPopular?: boolean;
  category?: ContainerCategory;
}) {
  const accent = CATEGORY_ACCENT[category];
  const svgW = 120;
  const svgH = 50;
  const maxW = 100;
  const maxH = 36;

  const w = maxW * widthRatio;
  const h = maxH * heightRatio;
  const x = (svgW - w) / 2;
  const y = svgH - h - 4;

  const isFlatRack = category === 'flat_rack';
  const isOpenTop  = category === 'open_top';

  return (
    <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full h-16 md:h-20">
      {/* Container body */}
      {isFlatRack ? (
        // Flat rack: only platform + end frames
        <>
          {/* Platform / floor */}
          <rect x={x} y={y + h - 6} width={w} height={6} rx={0.5}
            fill={accent.fill} stroke={accent.stroke} strokeWidth={1.2} />
          {/* Left end frame */}
          <rect x={x} y={y} width={6} height={h} rx={0.5}
            fill={accent.fill} stroke={accent.stroke} strokeWidth={1.0} />
          {/* Right end frame */}
          <rect x={x + w - 6} y={y} width={6} height={h} rx={0.5}
            fill={accent.fill} stroke={accent.stroke} strokeWidth={1.0} />
          {/* Cross braces */}
          <line x1={x + 6} y1={y + 4} x2={x + w - 6} y2={y + h - 6}
            stroke={accent.stroke} strokeWidth={0.6} opacity={0.4} />
          <line x1={x + w - 6} y1={y + 4} x2={x + 6} y2={y + h - 6}
            stroke={accent.stroke} strokeWidth={0.6} opacity={0.4} />
        </>
      ) : (
        // Standard, reefer, open_top: full box
        <rect
          x={x} y={y} width={w} height={h} rx={1.5}
          fill={isPopular ? `${accent.fill.replace('0.12', '0.2')}` : accent.fill}
          stroke={accent.stroke} strokeWidth={1.2}
        />
      )}

      {/* Open top: dashed top edge */}
      {isOpenTop && (
        <line x1={x} y1={y} x2={x + w} y2={y}
          stroke={accent.stroke} strokeWidth={1.2}
          strokeDasharray="3 3" opacity={0.7} />
      )}

      {/* Door lines (right side) — not for flat rack */}
      {!isFlatRack && (
        <>
          <line x1={x + w - 1} y1={y + 3} x2={x + w - 1} y2={y + h - 3}
            stroke={accent.stroke} strokeWidth={0.6} opacity={0.5} />
          <line x1={x + w - 4} y1={y + 3} x2={x + w - 4} y2={y + h - 3}
            stroke={accent.stroke} strokeWidth={0.6} opacity={0.5} />
        </>
      )}

      {/* Corner castings */}
      {[
        [x, y], [x + w - 4, y],
        [x, y + h - 3], [x + w - 4, y + h - 3],
      ].map(([cx, cy], i) => (
        <rect key={i} x={cx} y={cy} width={4} height={3} rx={0.5}
          fill={accent.stroke} opacity={0.3} />
      ))}

      {/* Corrugation lines — not for flat rack */}
      {!isFlatRack && Array.from({ length: Math.floor(w / 6) }).map((_, i) => (
        <line key={i}
          x1={x + 6 + i * 6} y1={y + 2}
          x2={x + 6 + i * 6} y2={y + h - 2}
          stroke={accent.stroke} strokeWidth={0.3} opacity={0.15} />
      ))}

      {/* Reefer: small cooling unit indicator */}
      {category === 'reefer' && (
        <rect x={x + w - 10} y={y + 4} width={6} height={h * 0.6} rx={0.5}
          fill={accent.stroke} opacity={0.25} />
      )}

      {/* Baseline */}
      <line x1={10} y1={svgH - 3} x2={svgW - 10} y2={svgH - 3}
        stroke="#d1d5db" strokeWidth={0.5} strokeDasharray="2 2" />
    </svg>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function ContainerComparison({
  locale = 'tr',
  selected,
  onSelect,
  variant = 'light',
  containerCategory = 'standard',
}: {
  locale?: Locale;
  selected?: ContainerType;
  onSelect?: (type: ContainerType) => void;
  variant?: 'light' | 'dark';
  containerCategory?: ContainerCategory;
}) {
  const isDark = variant === 'dark';
  const t = getTranslations(locale);
  const cc = t.containerComparison;
  const localeContainers = (containers as any)[locale] || (containers as any).tr;
  const accent = CATEGORY_ACCENT[containerCategory];

  const containerData = CONTAINER_DATA_BY_CATEGORY[containerCategory];
  const isWide = containerCategory === 'standard'; // 3-col vs 2-col grid

  // Section label per category
  const categoryLabel: Record<ContainerCategory, { tr: string; en: string }> = {
    standard:  { tr: 'TIKLA VE KARŞILAŞTIR',  en: 'CLICK AND COMPARE'  },
    reefer:    { tr: 'Soğutmalı Karşılaştırma',  en: 'Reefer Comparison'     },
    flat_rack: { tr: 'Flat Rack Karşılaştırma',  en: 'Flat Rack Comparison'  },
    open_top:  { tr: 'Open Top Karşılaştırma',   en: 'Open Top Comparison'   },
  };
  const sectionLabel = locale === 'tr' ? categoryLabel[containerCategory].tr : categoryLabel[containerCategory].en;

  return (
    <div className="mt-6">
      {/* Section label */}
      <div className="flex justify-center mb-3">
        <span className={`text-[10px] md:text-[9px] uppercase tracking-[0.2em] font-mono ${isDark ? 'text-gray-300' : 'text-gray-400'}`}>
          {sectionLabel}
        </span>
      </div>

      {/* Comparison grid */}
      <motion.div
        key={containerCategory}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={`grid gap-2 md:gap-3 ${isWide ? 'grid-cols-3' : 'grid-cols-2'}`}
      >
        {containerData.map((cd, index) => {
          const data = localeContainers?.find((c: any) => c.id === cd.id);

          return (
            <motion.div
              key={cd.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.15 * index, ease: 'easeOut' }}
              onClick={() => onSelect?.(cd.id as ContainerType)}
              className={`relative backdrop-blur-sm border rounded-xl p-2.5 md:p-3 transition-all duration-200 group cursor-pointer ${
                isDark
                  ? selected === cd.id
                    ? 'bg-white/15 border-primary-400 shadow-md ring-2 ring-primary-400/30'
                    : 'bg-white/10 border-white/20 hover:border-primary-300 hover:bg-white/15'
                  : selected === cd.id
                    ? 'bg-white/80 shadow-md ring-2'
                    : 'bg-white/80 border-gray-200 hover:shadow-md'
              }`}
              style={selected === cd.id && !isDark ? {
                borderColor: accent.stroke,
              } : undefined}
            >
              {/* Popular badge */}
              {cd.isPopular && (
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 z-10">
                  <span className="bg-red-500 text-white text-[8px] md:text-[9px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap">
                    {cc?.popular || 'En Popüler'}
                  </span>
                </div>
              )}

              {/* SVG silhouette */}
              <ContainerSilhouette
                widthRatio={cd.widthRatio}
                heightRatio={cd.heightRatio}
                isPopular={cd.isPopular}
                category={containerCategory}
              />

              {/* Type label */}
              <p className={`text-center font-bold text-xs md:text-sm mt-1 mb-2 ${accent.text}`}>
                {cd.label}
              </p>

              {/* Specs — show if data available */}
              {data && (
                <div className="space-y-1.5">
                  <div className={`flex items-center gap-1.5 text-xs md:text-xs ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    <Ruler size={12} className={`flex-shrink-0 ${accent.text}`} />
                    <span className="truncate">{data.dimensions?.external?.length}m</span>
                  </div>
                  <div className={`flex items-center gap-1.5 text-xs md:text-xs ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    <Box size={12} className={`flex-shrink-0 ${accent.text}`} />
                    <span className="truncate">{data.capacity?.volume} m&sup3;</span>
                  </div>
                  <div className={`flex items-center gap-1.5 text-xs md:text-xs ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    <Weight size={12} className={`flex-shrink-0 ${accent.text}`} />
                    <span className="truncate">{((data.capacity?.maxPayload ?? 0) / 1000).toFixed(1)}t</span>
                  </div>
                </div>
              )}
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
