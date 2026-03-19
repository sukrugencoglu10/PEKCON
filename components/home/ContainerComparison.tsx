'use client';

import { motion } from 'framer-motion';
import { Ruler, Box, Weight } from 'lucide-react';
import { containers } from '@/data/containers';
import { getTranslations, type Locale } from '@/lib/i18n';
import type { ContainerType } from './KonteynerScene';

// Proportional SVG silhouette of a container (side view)
function ContainerSilhouette({
  widthRatio,
  heightRatio,
  isPopular,
}: {
  widthRatio: number; // 0-1 relative to max width
  heightRatio: number; // 0-1 relative to max height
  isPopular?: boolean;
}) {
  const svgW = 120;
  const svgH = 50;
  const maxW = 100;
  const maxH = 36;

  const w = maxW * widthRatio;
  const h = maxH * heightRatio;
  const x = (svgW - w) / 2;
  const y = svgH - h - 4; // baseline aligned to bottom

  return (
    <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full h-16 md:h-20">
      {/* Container body */}
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={1.5}
        fill={isPopular ? 'rgba(0, 105, 180, 0.15)' : 'rgba(0, 105, 180, 0.08)'}
        stroke="#0069b4"
        strokeWidth={1.2}
      />
      {/* Door lines (right side) */}
      <line
        x1={x + w - 1}
        y1={y + 3}
        x2={x + w - 1}
        y2={y + h - 3}
        stroke="#0069b4"
        strokeWidth={0.6}
        opacity={0.5}
      />
      <line
        x1={x + w - 4}
        y1={y + 3}
        x2={x + w - 4}
        y2={y + h - 3}
        stroke="#0069b4"
        strokeWidth={0.6}
        opacity={0.5}
      />
      {/* Corner castings */}
      {[
        [x, y],
        [x + w - 4, y],
        [x, y + h - 3],
        [x + w - 4, y + h - 3],
      ].map(([cx, cy], i) => (
        <rect
          key={i}
          x={cx}
          y={cy}
          width={4}
          height={3}
          rx={0.5}
          fill="#0069b4"
          opacity={0.3}
        />
      ))}
      {/* Corrugation lines */}
      {Array.from({ length: Math.floor(w / 6) }).map((_, i) => (
        <line
          key={i}
          x1={x + 6 + i * 6}
          y1={y + 2}
          x2={x + 6 + i * 6}
          y2={y + h - 2}
          stroke="#0069b4"
          strokeWidth={0.3}
          opacity={0.15}
        />
      ))}
      {/* Baseline */}
      <line
        x1={10}
        y1={svgH - 3}
        x2={svgW - 10}
        y2={svgH - 3}
        stroke="#d1d5db"
        strokeWidth={0.5}
        strokeDasharray="2 2"
      />
    </svg>
  );
}

const containerData = [
  {
    id: '20dc',
    label: "20' DC",
    widthRatio: 0.5, // 6.06m / 12.19m
    heightRatio: 0.89, // 2.59m / 2.90m
  },
  {
    id: '40dc',
    label: "40' DC",
    widthRatio: 1,
    heightRatio: 0.89,
  },
  {
    id: '40hc',
    label: "40' HC",
    widthRatio: 1,
    heightRatio: 1,
    isPopular: true,
  },
];

export default function ContainerComparison({
  locale = 'tr',
  selected,
  onSelect,
  variant = 'light',
}: {
  locale?: Locale;
  selected?: ContainerType;
  onSelect?: (type: ContainerType) => void;
  variant?: 'light' | 'dark';
}) {
  const isDark = variant === 'dark';
  const t = getTranslations(locale);
  const cc = t.containerComparison;
  const localeContainers = containers[locale] || containers.tr;

  return (
    <div className="mt-6">
      {/* Section label */}
      <div className="flex justify-center mb-3">
        <span className={`text-[9px] uppercase tracking-[0.2em] font-mono ${isDark ? 'text-gray-300' : 'text-gray-400'}`}>
          {cc?.title || 'Hızlı Karşılaştırma'}
        </span>
      </div>

      {/* 3-column comparison grid */}
      <div className="grid grid-cols-3 gap-2 md:gap-3">
        {containerData.map((cd, index) => {
          const data = localeContainers.find((c: any) => c.id === cd.id);
          if (!data) return null;

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
                    ? 'bg-white/80 border-primary-400 shadow-md ring-2 ring-primary-200'
                    : 'bg-white/80 border-gray-200 hover:border-primary-300 hover:shadow-md'
              }`}
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
              />

              {/* Type label */}
              <p className={`text-center font-bold text-xs md:text-sm mt-1 mb-2 ${isDark ? 'text-primary-300' : 'text-primary-500'}`}>
                {cd.label}
              </p>

              {/* Specs */}
              <div className="space-y-1.5">
                <div className={`flex items-center gap-1.5 text-[10px] md:text-xs ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  <Ruler size={12} className={`flex-shrink-0 ${isDark ? 'text-primary-300' : 'text-primary-400'}`} />
                  <span className="truncate">{data.dimensions.external.length}m</span>
                </div>
                <div className={`flex items-center gap-1.5 text-[10px] md:text-xs ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  <Box size={12} className={`flex-shrink-0 ${isDark ? 'text-primary-300' : 'text-primary-400'}`} />
                  <span className="truncate">{data.capacity.volume} m&sup3;</span>
                </div>
                <div className={`flex items-center gap-1.5 text-[10px] md:text-xs ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  <Weight size={12} className={`flex-shrink-0 ${isDark ? 'text-primary-300' : 'text-primary-400'}`} />
                  <span className="truncate">{(data.capacity.maxPayload / 1000).toFixed(1)}t</span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
