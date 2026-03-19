'use client';

import { useRef, useEffect, useCallback } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

// Container box dimensions (px) — roughly 40HC aspect ratio
const W = 340;
const H = 90;
const D = 90;

export default function KonteynerScene() {
  const dragging = useRef(false);
  const drag0 = useRef<{ mx: number; my: number; ry: number; rx: number } | null>(null);

  const ry = useMotionValue(28);
  const rx = useMotionValue(-12);
  const sry = useSpring(ry, { stiffness: 30, damping: 12 });
  const srx = useSpring(rx, { stiffness: 30, damping: 12 });

  // Auto-rotate (paused while dragging)
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

  // Corrugation texture patterns
  const ch =
    'repeating-linear-gradient(to right,transparent 0,transparent 9px,rgba(255,255,255,0.05) 9px,rgba(255,255,255,0.05) 10px)';
  const cv =
    'repeating-linear-gradient(to bottom,transparent 0,transparent 9px,rgba(255,255,255,0.05) 9px,rgba(255,255,255,0.05) 10px)';

  // Shared base style for every face
  const face: React.CSSProperties = {
    position: 'absolute',
    backfaceVisibility: 'hidden',
    WebkitBackfaceVisibility: 'hidden',
  };

  // Corner casting helper
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
          background: '#334155',
          border: '1px solid #4b5563',
          borderRadius: 1,
        }}
      />
    ));

  return (
    <div className="relative w-full h-[440px] flex items-center justify-center select-none">
      {/* Cyan floor glow */}
      <div
        className="absolute pointer-events-none"
        style={{
          bottom: '22%',
          width: 380,
          height: 50,
          background: 'radial-gradient(ellipse, rgba(6,182,212,0.22) 0%, transparent 70%)',
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
            width: W,
            height: H,
            position: 'relative',
            transformStyle: 'preserve-3d',
            rotateY: sry,
            rotateX: srx,
          }}
        >
          {/* ─── FRONT ─ Doors ─── */}
          <div
            style={{
              ...face,
              left: 0,
              top: 0,
              width: W,
              height: H,
              transform: `translateZ(${D / 2}px)`,
              background: `${ch}, linear-gradient(170deg, #1e3a5f 0%, #0f2040 60%, #091628 100%)`,
              border: '1px solid rgba(6,182,212,0.38)',
            }}
          >
            {/* Door center gap */}
            <div
              style={{
                position: 'absolute',
                left: '50%',
                top: 0,
                bottom: 0,
                width: 2,
                transform: 'translateX(-50%)',
                background: 'rgba(6,182,212,0.55)',
              }}
            />
            {/* Left lock rod */}
            <div
              style={{
                position: 'absolute',
                left: '23%',
                top: '20%',
                width: 5,
                height: '60%',
                background: 'linear-gradient(#475569, #64748b)',
                borderRadius: 3,
              }}
            />
            {/* Right lock rod */}
            <div
              style={{
                position: 'absolute',
                right: '23%',
                top: '20%',
                width: 5,
                height: '60%',
                background: 'linear-gradient(#475569, #64748b)',
                borderRadius: 3,
              }}
            />
            {/* Left hinges */}
            <div
              style={{
                position: 'absolute',
                left: 5,
                top: '22%',
                width: 7,
                height: 10,
                background: '#334155',
                borderRadius: 1,
                boxShadow: '0 0 6px rgba(6,182,212,0.55)',
              }}
            />
            <div
              style={{
                position: 'absolute',
                left: 5,
                top: '62%',
                width: 7,
                height: 10,
                background: '#334155',
                borderRadius: 1,
                boxShadow: '0 0 6px rgba(6,182,212,0.55)',
              }}
            />
            {/* Right hinges */}
            <div
              style={{
                position: 'absolute',
                right: 5,
                top: '22%',
                width: 7,
                height: 10,
                background: '#334155',
                borderRadius: 1,
              }}
            />
            <div
              style={{
                position: 'absolute',
                right: 5,
                top: '62%',
                width: 7,
                height: 10,
                background: '#334155',
                borderRadius: 1,
              }}
            />
            {castings(W, H)}
          </div>

          {/* ─── BACK ─── */}
          <div
            style={{
              ...face,
              left: 0,
              top: 0,
              width: W,
              height: H,
              transform: `rotateY(180deg) translateZ(${D / 2}px)`,
              background: `${ch}, linear-gradient(170deg, #0a1520, #060f1a)`,
              border: '1px solid rgba(6,182,212,0.15)',
            }}
          >
            {castings(W, H)}
          </div>

          {/* ─── RIGHT ─── */}
          <div
            style={{
              ...face,
              left: (W - D) / 2,
              top: 0,
              width: D,
              height: H,
              transform: `rotateY(90deg) translateZ(${W / 2}px)`,
              background: `${cv}, linear-gradient(to right, #091628, #0f2040)`,
              border: '1px solid rgba(6,182,212,0.22)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <span
              style={{
                fontSize: 9,
                letterSpacing: '0.14em',
                color: 'rgba(6,182,212,0.75)',
                fontFamily: 'monospace',
              }}
            >
              PEKCON
            </span>
          </div>

          {/* ─── LEFT ─── */}
          <div
            style={{
              ...face,
              left: (W - D) / 2,
              top: 0,
              width: D,
              height: H,
              transform: `rotateY(-90deg) translateZ(${W / 2}px)`,
              background: `${cv}, linear-gradient(to left, #091628, #0f2040)`,
              border: '1px solid rgba(6,182,212,0.22)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <span
              style={{
                fontSize: 8,
                letterSpacing: '0.12em',
                color: 'rgba(6,182,212,0.4)',
                fontFamily: 'monospace',
              }}
            >
              ISO 668
            </span>
          </div>

          {/* ─── TOP ─── */}
          <div
            style={{
              ...face,
              left: 0,
              top: (H - D) / 2,
              width: W,
              height: D,
              transform: `rotateX(-90deg) translateZ(${H / 2}px)`,
              background: 'linear-gradient(to bottom, #1a3050, #0d1e35)',
              border: '1px solid rgba(6,182,212,0.2)',
            }}
          />

          {/* ─── BOTTOM ─── */}
          <div
            style={{
              ...face,
              left: 0,
              top: (H - D) / 2,
              width: W,
              height: D,
              transform: `rotateX(90deg) translateZ(${H / 2}px)`,
              background: '#060f1a',
            }}
          />
        </motion.div>
      </div>

      {/* Model info badge */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-xl border border-white/10 bg-black/70 backdrop-blur-sm whitespace-nowrap">
        <p className="text-[9px] text-cyan-400 uppercase tracking-[0.25em] font-mono text-center">
          Model: PEKCON-40HC
        </p>
        <p className="text-[10px] text-zinc-500 mt-0.5 italic text-center">
          Tüm açılardan inceleyin.
        </p>
      </div>
    </div>
  );
}
