'use client';

import { useRef, useEffect, useCallback } from 'react';
import { motion, useMotionValue, useSpring, animate } from 'framer-motion';
import Image from 'next/image';

// Container dimension presets (px) — proportional to real dimensions
const PRESETS = {
  '20dc': { W: 180, H: 88, D: 88, label: '20\' DC' },
  '40dc': { W: 340, H: 88, D: 88, label: '40\' DC' },
  '40hc': { W: 340, H: 100, D: 88, label: '40\' HC' },
} as const;

export type ContainerType = keyof typeof PRESETS;

interface Props {
  containerType?: ContainerType;
}

export default function KonteynerScene({ containerType = '40hc' }: Props) {
  const dragging = useRef(false);
  const drag0 = useRef<{ mx: number; my: number; ry: number; rx: number } | null>(null);

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

  // Light corrugation textures
  const ch =
    'repeating-linear-gradient(to right,transparent 0,transparent 9px,rgba(0,0,0,0.04) 9px,rgba(0,0,0,0.04) 10px)';
  const cv =
    'repeating-linear-gradient(to bottom,transparent 0,transparent 9px,rgba(0,0,0,0.04) 9px,rgba(0,0,0,0.04) 10px)';

  const face: React.CSSProperties = {
    position: 'absolute',
    backfaceVisibility: 'hidden',
    WebkitBackfaceVisibility: 'hidden',
  };

  // Corner casting helper — lighter style
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
          background: '#94a3b8',
          border: '1px solid #b0bec5',
          borderRadius: 1,
        }}
      />
    ));

  // Current dimensions (for static rendering — motion values drive 3D)
  const cW = preset.W;
  const cH = preset.H;
  const cD = preset.D;

  return (
    <div className="relative w-full h-[280px] flex items-center justify-center select-none">
      {/* Soft blue floor glow */}
      <div
        className="absolute pointer-events-none"
        style={{
          bottom: '22%',
          width: 380,
          height: 50,
          background: 'radial-gradient(ellipse, rgba(0,105,180,0.12) 0%, transparent 70%)',
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
          {/* ─── FRONT ─ Doors ─── */}
          <motion.div
            style={{
              ...face,
              left: 0,
              top: 0,
              background: `${ch}, linear-gradient(170deg, #4a90c4 0%, #2a6fa8 60%, #1a5a8f 100%)`,
              border: '1px solid rgba(0,105,180,0.4)',
            }}
            animate={{ width: cW, height: cH, transform: `translateZ(${cD / 2}px)` }}
            transition={{ duration: 0.6, ease: 'easeInOut' }}
          >
            {/* PEKCON favicon — big */}
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Image src="/favicon.png" alt="PEKCON" width={48} height={48} style={{ opacity: 0.9, filter: 'brightness(1.8) drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }} />
            </div>
            {castings(cW, cH)}
          </motion.div>

          {/* ─── BACK ─── */}
          <motion.div
            style={{
              ...face,
              left: 0,
              top: 0,
              background: `${ch}, linear-gradient(170deg, #3a7fb3, #1a5a8f)`,
              border: '1px solid rgba(0,105,180,0.2)',
            }}
            animate={{ width: cW, height: cH, transform: `rotateY(180deg) translateZ(${cD / 2}px)` }}
            transition={{ duration: 0.6, ease: 'easeInOut' }}
          >
            {/* PEKCON full logo — big */}
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Image src="/pekcon-logo.png" alt="PEKCON" width={140} height={40} style={{ opacity: 0.9, filter: 'brightness(2) drop-shadow(0 2px 4px rgba(0,0,0,0.3))', objectFit: 'contain', maxHeight: '60%' }} />
            </div>
            {castings(cW, cH)}
          </motion.div>

          {/* ─── RIGHT ─── */}
          <motion.div
            style={{
              ...face,
              background: `${cv}, linear-gradient(to right, #1a5a8f, #2a6fa8)`,
              border: '1px solid rgba(0,105,180,0.25)',
            }}
            animate={{
              left: (cW - cD) / 2,
              top: 0,
              width: cD,
              height: cH,
              transform: `rotateY(90deg) translateZ(${cW / 2}px)`,
            }}
            transition={{ duration: 0.6, ease: 'easeInOut' }}
          />

          {/* ─── LEFT ─── */}
          <motion.div
            style={{
              ...face,
              background: `${cv}, linear-gradient(to left, #1a5a8f, #2a6fa8)`,
              border: '1px solid rgba(0,105,180,0.25)',
            }}
            animate={{
              left: (cW - cD) / 2,
              top: 0,
              width: cD,
              height: cH,
              transform: `rotateY(-90deg) translateZ(${cW / 2}px)`,
            }}
            transition={{ duration: 0.6, ease: 'easeInOut' }}
          />

          {/* ─── TOP ─── */}
          <motion.div
            style={{
              ...face,
              left: 0,
              background: 'linear-gradient(to bottom, #5a9fd4, #3a85ba)',
              border: '1px solid rgba(0,105,180,0.2)',
            }}
            animate={{
              top: (cH - cD) / 2,
              width: cW,
              height: cD,
              transform: `rotateX(-90deg) translateZ(${cH / 2}px)`,
            }}
            transition={{ duration: 0.6, ease: 'easeInOut' }}
          />

          {/* ─── BOTTOM ─── */}
          <motion.div
            style={{
              ...face,
              left: 0,
              background: '#2a5f8f',
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
