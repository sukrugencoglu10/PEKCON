'use client';

import { useRef, useEffect, useCallback } from 'react';
import { motion, useMotionValue, useSpring, animate } from 'framer-motion';
import Image from 'next/image';

// ─── Container Presets (pixel dimensions, proportional to real) ───────────────
const PRESETS = {
  // Standard dry cargo — blue
  '20dc': { W: 180, H: 88,  D: 88, label: "20' DC" },
  '40dc': { W: 340, H: 88,  D: 88, label: "40' DC" },
  '40hc': { W: 340, H: 100, D: 88, label: "40' HC" },
  '45hc': { W: 380, H: 100, D: 88, label: "45' HC" },
  // Reefer / refrigerated — cyan/silver
  '20rf': { W: 180, H: 90,  D: 88, label: "20' Reefer" },
  '40rf': { W: 340, H: 100, D: 88, label: "40' HC Reefer" },
  // Flat rack — orange/industrial (no sides, no top)
  '20fr': { W: 180, H: 88,  D: 88, label: "20' Flat Rack" },
  '40fr': { W: 340, H: 88,  D: 88, label: "40' Flat Rack" },
  // Open top — dark slate (no top)
  '20ot': { W: 180, H: 88,  D: 88, label: "20' Open Top" },
  '40ot': { W: 340, H: 88,  D: 88, label: "40' Open Top" },
} as const;

export type ContainerType = keyof typeof PRESETS;

// ─── Container Category ───────────────────────────────────────────────────────
export type ContainerCategory = 'standard' | 'reefer' | 'flat_rack' | 'open_top';

export function getCategoryFromType(type: ContainerType): ContainerCategory {
  if (type.endsWith('rf')) return 'reefer';
  if (type.endsWith('fr')) return 'flat_rack';
  if (type.endsWith('ot')) return 'open_top';
  return 'standard';
}

// ─── Color Palettes per Category ─────────────────────────────────────────────
const CATEGORY_COLORS: Record<ContainerCategory, {
  front: string; back: string;
  sideFrom: string; sideTo: string;
  top: string; bottom: string;
  border: string; castingColor: string; castingBorder: string;
}> = {
  standard: {
    front:        'linear-gradient(170deg, #4a90c4 0%, #2a6fa8 60%, #1a5a8f 100%)',
    back:         'linear-gradient(170deg, #3a7fb3, #1a5a8f)',
    sideFrom:     '#1a5a8f',
    sideTo:       '#2a6fa8',
    top:          'linear-gradient(to bottom, #5a9fd4, #3a85ba)',
    bottom:       '#2a5f8f',
    border:       'rgba(0,105,180,0.4)',
    castingColor: '#94a3b8',
    castingBorder:'#b0bec5',
  },
  reefer: {
    front:        'linear-gradient(170deg, #b2ebf2 0%, #80deea 60%, #4dd0e1 100%)',
    back:         'linear-gradient(170deg, #e0f7fa, #b2ebf2)',
    sideFrom:     '#e0f7fa',
    sideTo:       '#b2ebf2',
    top:          'linear-gradient(to bottom, #f5feff, #e0f7fa)',
    bottom:       '#00bcd4',
    border:       'rgba(0,188,212,0.5)',
    castingColor: '#78909c',
    castingBorder:'#90a4ae',
  },
  flat_rack: {
    front:        'linear-gradient(170deg, #ff8a65 0%, #e64a19 60%, #bf360c 100%)',
    back:         'linear-gradient(170deg, #ff7043, #e64a19)',
    sideFrom:     '#bf360c',
    sideTo:       '#e64a19',
    top:          'transparent',
    bottom:       '#bf360c',
    border:       'rgba(230,74,25,0.5)',
    castingColor: '#78909c',
    castingBorder:'#8d6e63',
  },
  open_top: {
    front:        'linear-gradient(170deg, #78909c 0%, #546e7a 60%, #37474f 100%)',
    back:         'linear-gradient(170deg, #607d8b, #37474f)',
    sideFrom:     '#37474f',
    sideTo:       '#546e7a',
    top:          'transparent',
    bottom:       '#263238',
    border:       'rgba(84,110,122,0.5)',
    castingColor: '#90a4ae',
    castingBorder:'#b0bec5',
  },
};

interface Props {
  containerType?: ContainerType;
}

export default function KonteynerScene({ containerType = '40hc' }: Props) {
  const dragging = useRef(false);
  const drag0 = useRef<{ mx: number; my: number; ry: number; rx: number } | null>(null);

  const category = getCategoryFromType(containerType);
  const colors = CATEGORY_COLORS[category];
  const preset = PRESETS[containerType];

  const W = useMotionValue(preset.W);
  const H = useMotionValue(preset.H);
  const D = useMotionValue(preset.D);

  // Animate dimensions on containerType change
  useEffect(() => {
    const p = PRESETS[containerType];
    animate(W, p.W, { duration: 0.6, ease: 'easeInOut' });
    animate(H, p.H, { duration: 0.6, ease: 'easeInOut' });
    animate(D, p.D, { duration: 0.6, ease: 'easeInOut' });
  }, [containerType, W, H, D]);

  const ry = useMotionValue(28);
  const rx = useMotionValue(-12);
  const sry = useSpring(ry, { stiffness: 30, damping: 12 });
  const srx = useSpring(rx, { stiffness: 30, damping: 12 });

  // Auto-rotate
  useEffect(() => {
    let id: number;
    let t0 = 0;
    const loop = (t: number) => {
      if (!dragging.current) {
        if (t0) ry.set(ry.get() + ((t - t0) / 1000) * 20);
        t0 = t;
      } else {
        t0 = 0;
      }
      id = requestAnimationFrame(loop);
    };
    id = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(id);
  }, [ry]);

  const onPointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      e.currentTarget.setPointerCapture(e.pointerId);
      dragging.current = true;
      drag0.current = { mx: e.clientX, my: e.clientY, ry: ry.get(), rx: rx.get() };
    },
    [ry, rx]
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!drag0.current) return;
      ry.set(drag0.current.ry + (e.clientX - drag0.current.mx) * 0.5);
      rx.set(
        Math.max(-25, Math.min(20, drag0.current.rx + (e.clientY - drag0.current.my) * 0.3))
      );
    },
    [ry, rx]
  );

  const onPointerUp = useCallback(() => {
    dragging.current = false;
    drag0.current = null;
  }, []);

  // Corrugation textures
  const ch =
    'repeating-linear-gradient(to right,transparent 0,transparent 9px,rgba(0,0,0,0.04) 9px,rgba(0,0,0,0.04) 10px)';
  const cv =
    'repeating-linear-gradient(to bottom,transparent 0,transparent 9px,rgba(0,0,0,0.04) 9px,rgba(0,0,0,0.04) 10px)';

  const face: React.CSSProperties = {
    position: 'absolute',
    backfaceVisibility: 'hidden',
    WebkitBackfaceVisibility: 'hidden',
  };

  // Corner castings helper
  const castings = (w: number, h: number) =>
    (
      [
        [-1, -1],
        [w - 10, -1],
        [-1, h - 10],
        [w - 10, h - 10],
      ] as [number, number][]
    ).map(([l, t], i) => (
      <div
        key={i}
        style={{
          position: 'absolute',
          left: l,
          top: t,
          width: 11,
          height: 11,
          background: colors.castingColor,
          border: `1px solid ${colors.castingBorder}`,
          borderRadius: 1,
        }}
      />
    ));

  // Reefer cooling unit overlay (shown on front face)
  const reeferCoolingUnit = (w: number, h: number) => (
    <div style={{
      position: 'absolute',
      right: 8, top: '15%',
      width: Math.min(w * 0.18, 32), height: '65%',
      background: 'rgba(0,0,0,0.18)',
      borderRadius: 3,
      border: '1px solid rgba(255,255,255,0.3)',
    }}>
      {/* Cooling fins */}
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} style={{
          position: 'absolute', left: 2, right: 2,
          top: `${10 + i * 14}%`, height: 2,
          background: 'rgba(255,255,255,0.4)',
          borderRadius: 1,
        }} />
      ))}
    </div>
  );

  // Open top rim (thin border on top edge to show the opening)
  const openTopRim = (w: number, h: number, d: number) => (
    <motion.div
      style={{
        ...face,
        left: 0,
        border: `2px solid ${colors.border}`,
        background: 'transparent',
      }}
      animate={{
        top: (h - d) / 2,
        width: w,
        height: d,
        transform: `rotateX(-90deg) translateZ(${h / 2}px)`,
      }}
      transition={{ duration: 0.6, ease: 'easeInOut' }}
    />
  );

  const cW = preset.W;
  const cH = preset.H;
  const cD = preset.D;

  const isFlatRack = category === 'flat_rack';
  const isOpenTop = category === 'open_top';
  const isReefer = category === 'reefer';
  const isStandard = category === 'standard';

  return (
    <div className="relative w-full h-[280px] flex items-center justify-center select-none">
      {/* Floor glow — color matches category */}
      <div
        className="absolute pointer-events-none"
        style={{
          bottom: '22%',
          width: 380,
          height: 50,
          background: `radial-gradient(ellipse, ${
            category === 'reefer'    ? 'rgba(0,188,212,0.12)' :
            category === 'flat_rack' ? 'rgba(230,74,25,0.12)' :
            category === 'open_top'  ? 'rgba(84,110,122,0.12)' :
            'rgba(0,105,180,0.12)'
          } 0%, transparent 70%)`,
          filter: 'blur(22px)',
        }}
      />

      {/* 3D Viewport */}
      <div
        style={{ perspective: '1400px' }}
        className="cursor-grab active:cursor-grabbing"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
      >
        <motion.div
          style={{
            width: cW,
            height: cH,
            position: 'relative',
            transformStyle: 'preserve-3d',
            rotateY: sry,
            rotateX: srx,
          }}
          animate={{ width: cW, height: cH }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
        >
          {/* ─── FRONT (hidden for flat rack — long side is open) ─── */}
          {!isFlatRack && (
            <motion.div
              style={{
                ...face,
                left: 0,
                top: 0,
                background: `${ch}, ${colors.front}`,
                border: `1px solid ${colors.border}`,
              }}
              animate={{ width: cW, height: cH, transform: `translateZ(${cD / 2}px)` }}
              transition={{ duration: 0.6, ease: 'easeInOut' }}
            >
              {isReefer ? (
                <>
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Image src="/favicon.png" alt="PEKCON" width={36} height={36} style={{ opacity: 0.7, filter: 'brightness(0.5) drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }} />
                  </div>
                  {reeferCoolingUnit(cW, cH)}
                </>
              ) : (
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Image src="/favicon.png" alt="PEKCON" width={48} height={48} style={{ opacity: 0.9, filter: 'brightness(1.8) drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }} />
                </div>
              )}
              {castings(cW, cH)}
            </motion.div>
          )}

          {/* ─── BACK (hidden for flat rack — long side is open) ─── */}
          {!isFlatRack && (
            <motion.div
              style={{
                ...face,
                left: 0,
                top: 0,
                background: `${ch}, ${colors.back}`,
                border: `1px solid ${colors.border}`,
              }}
              animate={{ width: cW, height: cH, transform: `rotateY(180deg) translateZ(${cD / 2}px)` }}
              transition={{ duration: 0.6, ease: 'easeInOut' }}
            >
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Image src="/pekcon-logo.png" alt="PEKCON" width={140} height={40} style={{ opacity: 0.9, filter: isReefer ? 'brightness(0.6) drop-shadow(0 2px 4px rgba(0,0,0,0.2))' : 'brightness(2) drop-shadow(0 2px 4px rgba(0,0,0,0.3))', objectFit: 'contain', maxHeight: '60%' }} />
              </div>
              {castings(cW, cH)}
            </motion.div>
          )}

          {/* ─── RIGHT — end wall for flat rack, side for others ─── */}
          <motion.div
            style={{
              ...face,
              background: isFlatRack
                ? `${cv}, ${colors.front}`
                : `${cv}, linear-gradient(to right, ${colors.sideFrom}, ${colors.sideTo})`,
              border: `1px solid ${colors.border}`,
            }}
            animate={{
              left: (cW - cD) / 2,
              top: 0,
              width: cD,
              height: cH,
              transform: `rotateY(90deg) translateZ(${cW / 2}px)`,
            }}
            transition={{ duration: 0.6, ease: 'easeInOut' }}
          >
            {isFlatRack && castings(cD, cH)}
          </motion.div>

          {/* ─── LEFT ─── end wall for flat rack, side for others ─── */}
          <motion.div
            style={{
              ...face,
              background: isFlatRack
                ? `${cv}, ${colors.back}`
                : `${cv}, linear-gradient(to left, ${colors.sideFrom}, ${colors.sideTo})`,
              border: `1px solid ${colors.border}`,
            }}
            animate={{
              left: (cW - cD) / 2,
              top: 0,
              width: cD,
              height: cH,
              transform: `rotateY(-90deg) translateZ(${cW / 2}px)`,
            }}
            transition={{ duration: 0.6, ease: 'easeInOut' }}
          >
            {isFlatRack && castings(cD, cH)}
          </motion.div>

          {/* ─── TOP (hidden for flat rack & open top, rim for open top) ─── */}
          {isOpenTop ? (
            openTopRim(cW, cH, cD)
          ) : !isFlatRack ? (
            <motion.div
              style={{
                ...face,
                left: 0,
                background: colors.top,
                border: `1px solid ${colors.border}`,
              }}
              animate={{
                top: (cH - cD) / 2,
                width: cW,
                height: cD,
                transform: `rotateX(-90deg) translateZ(${cH / 2}px)`,
              }}
              transition={{ duration: 0.6, ease: 'easeInOut' }}
            />
          ) : null}

          {/* ─── BOTTOM ─── */}
          <motion.div
            style={{
              ...face,
              left: 0,
              background: colors.bottom,
            }}
            animate={{
              top: (cH - cD) / 2,
              width: cW,
              height: cD,
              transform: `rotateX(90deg) translateZ(${cH / 2}px)`,
            }}
            transition={{ duration: 0.6, ease: 'easeInOut' }}
          />
        </motion.div>
      </div>
    </div>
  );
}
