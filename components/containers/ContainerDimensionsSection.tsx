'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  containerDimensions,
  palletPlans,
  categories,
  type ContainerDimension,
  type PalletPlan,
} from '@/data/container-dimensions';
import { getTranslations, type Locale } from '@/lib/i18n';

/* ═══════════════════════════════════════════════════════════
   DETAILED SVG SILHOUETTES — Side-view technical drawings
   ═══════════════════════════════════════════════════════════ */

function ContainerSVG({ id, className }: { id: string; className?: string }) {
  const svgs: Record<string, React.ReactNode> = {
    // ─── 20' DC: Short standard container ───
    '20dc': (
      <svg viewBox="0 0 200 90" className={className} fill="none">
        {/* Main body */}
        <rect x="20" y="18" width="160" height="55" rx="1.5" fill="#0069b4" opacity="0.12" stroke="#0069b4" strokeWidth="1.5" />
        {/* Corrugation lines */}
        {Array.from({ length: 14 }).map((_, i) => (
          <line key={i} x1={30 + i * 10} y1="22" x2={30 + i * 10} y2="69" stroke="#0069b4" strokeWidth="0.4" opacity="0.2" />
        ))}
        {/* Door (right side) */}
        <line x1="175" y1="22" x2="175" y2="69" stroke="#0069b4" strokeWidth="0.8" opacity="0.5" />
        <line x1="171" y1="22" x2="171" y2="69" stroke="#0069b4" strokeWidth="0.8" opacity="0.5" />
        {/* Door handles */}
        <rect x="172" y="38" width="1.5" height="10" rx="0.5" fill="#0069b4" opacity="0.6" />
        <rect x="176" y="38" width="1.5" height="10" rx="0.5" fill="#0069b4" opacity="0.6" />
        {/* Corner castings */}
        <rect x="20" y="18" width="6" height="4" rx="0.8" fill="#0069b4" opacity="0.35" />
        <rect x="174" y="18" width="6" height="4" rx="0.8" fill="#0069b4" opacity="0.35" />
        <rect x="20" y="69" width="6" height="4" rx="0.8" fill="#0069b4" opacity="0.35" />
        <rect x="174" y="69" width="6" height="4" rx="0.8" fill="#0069b4" opacity="0.35" />
        {/* Floor beam */}
        <rect x="18" y="73" width="164" height="3" rx="0.5" fill="#0069b4" opacity="0.25" />
        {/* Forklift pockets */}
        <rect x="50" y="76" width="18" height="6" rx="1" fill="#0069b4" stroke="#0069b4" strokeWidth="0.5" opacity="0.3" />
        <rect x="132" y="76" width="18" height="6" rx="1" fill="#0069b4" stroke="#0069b4" strokeWidth="0.5" opacity="0.3" />
        {/* Ground line */}
        <line x1="10" y1="84" x2="190" y2="84" stroke="#cbd5e1" strokeWidth="0.8" strokeDasharray="3 3" />
      </svg>
    ),

    // ─── 40' DC: Long standard container ───
    '40dc': (
      <svg viewBox="0 0 200 90" className={className} fill="none">
        <rect x="8" y="22" width="184" height="50" rx="1.5" fill="#0069b4" opacity="0.12" stroke="#0069b4" strokeWidth="1.5" />
        {Array.from({ length: 24 }).map((_, i) => (
          <line key={i} x1={16 + i * 7.2} y1="26" x2={16 + i * 7.2} y2="68" stroke="#0069b4" strokeWidth="0.35" opacity="0.2" />
        ))}
        <line x1="187" y1="26" x2="187" y2="68" stroke="#0069b4" strokeWidth="0.8" opacity="0.5" />
        <line x1="183" y1="26" x2="183" y2="68" stroke="#0069b4" strokeWidth="0.8" opacity="0.5" />
        <rect x="184" y="40" width="1.5" height="10" rx="0.5" fill="#0069b4" opacity="0.6" />
        <rect x="188" y="40" width="1.5" height="10" rx="0.5" fill="#0069b4" opacity="0.6" />
        <rect x="8" y="22" width="6" height="4" rx="0.8" fill="#0069b4" opacity="0.35" />
        <rect x="186" y="22" width="6" height="4" rx="0.8" fill="#0069b4" opacity="0.35" />
        <rect x="8" y="68" width="6" height="4" rx="0.8" fill="#0069b4" opacity="0.35" />
        <rect x="186" y="68" width="6" height="4" rx="0.8" fill="#0069b4" opacity="0.35" />
        <rect x="6" y="72" width="188" height="3" rx="0.5" fill="#0069b4" opacity="0.25" />
        <rect x="40" y="75" width="18" height="5" rx="1" fill="#0069b4" stroke="#0069b4" strokeWidth="0.5" opacity="0.3" />
        <rect x="142" y="75" width="18" height="5" rx="1" fill="#0069b4" stroke="#0069b4" strokeWidth="0.5" opacity="0.3" />
        <line x1="2" y1="82" x2="198" y2="82" stroke="#cbd5e1" strokeWidth="0.8" strokeDasharray="3 3" />
      </svg>
    ),

    // ─── 40' HC: Taller long container ───
    '40hc': (
      <svg viewBox="0 0 200 90" className={className} fill="none">
        <rect x="8" y="12" width="184" height="58" rx="1.5" fill="#0069b4" opacity="0.15" stroke="#0069b4" strokeWidth="1.5" />
        {Array.from({ length: 24 }).map((_, i) => (
          <line key={i} x1={16 + i * 7.2} y1="16" x2={16 + i * 7.2} y2="66" stroke="#0069b4" strokeWidth="0.35" opacity="0.2" />
        ))}
        <line x1="187" y1="16" x2="187" y2="66" stroke="#0069b4" strokeWidth="0.8" opacity="0.5" />
        <line x1="183" y1="16" x2="183" y2="66" stroke="#0069b4" strokeWidth="0.8" opacity="0.5" />
        <rect x="184" y="34" width="1.5" height="10" rx="0.5" fill="#0069b4" opacity="0.6" />
        <rect x="188" y="34" width="1.5" height="10" rx="0.5" fill="#0069b4" opacity="0.6" />
        {/* HC badge */}
        <rect x="85" y="4" width="30" height="10" rx="3" fill="#0069b4" opacity="0.8" />
        <text x="100" y="12" textAnchor="middle" fill="white" fontSize="6" fontWeight="bold">HC</text>
        <rect x="8" y="12" width="6" height="4" rx="0.8" fill="#0069b4" opacity="0.35" />
        <rect x="186" y="12" width="6" height="4" rx="0.8" fill="#0069b4" opacity="0.35" />
        <rect x="8" y="66" width="6" height="4" rx="0.8" fill="#0069b4" opacity="0.35" />
        <rect x="186" y="66" width="6" height="4" rx="0.8" fill="#0069b4" opacity="0.35" />
        <rect x="6" y="70" width="188" height="3" rx="0.5" fill="#0069b4" opacity="0.25" />
        <rect x="40" y="73" width="18" height="5" rx="1" fill="#0069b4" stroke="#0069b4" strokeWidth="0.5" opacity="0.3" />
        <rect x="142" y="73" width="18" height="5" rx="1" fill="#0069b4" stroke="#0069b4" strokeWidth="0.5" opacity="0.3" />
        <line x1="2" y1="80" x2="198" y2="80" stroke="#cbd5e1" strokeWidth="0.8" strokeDasharray="3 3" />
      </svg>
    ),

    // ─── 45' HC: Extra long high cube ───
    '45hc': (
      <svg viewBox="0 0 200 90" className={className} fill="none">
        <rect x="3" y="12" width="194" height="58" rx="1.5" fill="#0069b4" opacity="0.15" stroke="#0069b4" strokeWidth="1.5" />
        {Array.from({ length: 28 }).map((_, i) => (
          <line key={i} x1={10 + i * 6.6} y1="16" x2={10 + i * 6.6} y2="66" stroke="#0069b4" strokeWidth="0.3" opacity="0.2" />
        ))}
        <line x1="192" y1="16" x2="192" y2="66" stroke="#0069b4" strokeWidth="0.8" opacity="0.5" />
        <line x1="188" y1="16" x2="188" y2="66" stroke="#0069b4" strokeWidth="0.8" opacity="0.5" />
        <rect x="189" y="34" width="1.5" height="10" rx="0.5" fill="#0069b4" opacity="0.6" />
        <rect x="193" y="34" width="1.5" height="10" rx="0.5" fill="#0069b4" opacity="0.6" />
        <rect x="85" y="4" width="30" height="10" rx="3" fill="#0069b4" opacity="0.8" />
        <text x="100" y="12" textAnchor="middle" fill="white" fontSize="6" fontWeight="bold">45 HC</text>
        <rect x="3" y="12" width="6" height="4" rx="0.8" fill="#0069b4" opacity="0.35" />
        <rect x="191" y="12" width="6" height="4" rx="0.8" fill="#0069b4" opacity="0.35" />
        <rect x="3" y="66" width="6" height="4" rx="0.8" fill="#0069b4" opacity="0.35" />
        <rect x="191" y="66" width="6" height="4" rx="0.8" fill="#0069b4" opacity="0.35" />
        <rect x="1" y="70" width="198" height="3" rx="0.5" fill="#0069b4" opacity="0.25" />
        <line x1="1" y1="80" x2="199" y2="80" stroke="#cbd5e1" strokeWidth="0.8" strokeDasharray="3 3" />
      </svg>
    ),

    // ─── 20' Open Top: No roof, tarpaulin bows ───
    '20ot': (
      <svg viewBox="0 0 200 90" className={className} fill="none">
        {/* Walls (no top) */}
        <rect x="20" y="20" width="160" height="55" rx="1" fill="#f59e0b" opacity="0.08" stroke="#d97706" strokeWidth="1.5" />
        {/* Open top - dashed line */}
        <line x1="20" y1="20" x2="180" y2="20" stroke="#d97706" strokeWidth="1" strokeDasharray="4 3" />
        {/* Tarpaulin bows (arched) */}
        <path d="M 35 20 Q 35 10 50 10 Q 65 10 65 20" stroke="#d97706" strokeWidth="0.8" opacity="0.5" fill="none" />
        <path d="M 75 20 Q 75 10 90 10 Q 105 10 105 20" stroke="#d97706" strokeWidth="0.8" opacity="0.5" fill="none" />
        <path d="M 115 20 Q 115 10 130 10 Q 145 10 145 20" stroke="#d97706" strokeWidth="0.8" opacity="0.5" fill="none" />
        {/* Corrugation */}
        {Array.from({ length: 14 }).map((_, i) => (
          <line key={i} x1={30 + i * 10} y1="24" x2={30 + i * 10} y2="71" stroke="#d97706" strokeWidth="0.35" opacity="0.18" />
        ))}
        {/* Door */}
        <line x1="175" y1="24" x2="175" y2="71" stroke="#d97706" strokeWidth="0.8" opacity="0.4" />
        <line x1="171" y1="24" x2="171" y2="71" stroke="#d97706" strokeWidth="0.8" opacity="0.4" />
        {/* Corner castings */}
        <rect x="20" y="18" width="6" height="5" rx="0.8" fill="#d97706" opacity="0.35" />
        <rect x="174" y="18" width="6" height="5" rx="0.8" fill="#d97706" opacity="0.35" />
        <rect x="20" y="71" width="6" height="4" rx="0.8" fill="#d97706" opacity="0.35" />
        <rect x="174" y="71" width="6" height="4" rx="0.8" fill="#d97706" opacity="0.35" />
        <rect x="18" y="75" width="164" height="3" rx="0.5" fill="#d97706" opacity="0.2" />
        <line x1="10" y1="84" x2="190" y2="84" stroke="#cbd5e1" strokeWidth="0.8" strokeDasharray="3 3" />
      </svg>
    ),

    // ─── 40' Open Top ───
    '40ot': (
      <svg viewBox="0 0 200 90" className={className} fill="none">
        <rect x="8" y="22" width="184" height="50" rx="1" fill="#f59e0b" opacity="0.08" stroke="#d97706" strokeWidth="1.5" />
        <line x1="8" y1="22" x2="192" y2="22" stroke="#d97706" strokeWidth="1" strokeDasharray="4 3" />
        {/* Tarpaulin bows */}
        <path d="M 20 22 Q 20 12 38 12 Q 56 12 56 22" stroke="#d97706" strokeWidth="0.8" opacity="0.5" fill="none" />
        <path d="M 60 22 Q 60 12 78 12 Q 96 12 96 22" stroke="#d97706" strokeWidth="0.8" opacity="0.5" fill="none" />
        <path d="M 100 22 Q 100 12 118 12 Q 136 12 136 22" stroke="#d97706" strokeWidth="0.8" opacity="0.5" fill="none" />
        <path d="M 140 22 Q 140 12 158 12 Q 176 12 176 22" stroke="#d97706" strokeWidth="0.8" opacity="0.5" fill="none" />
        {Array.from({ length: 24 }).map((_, i) => (
          <line key={i} x1={16 + i * 7.2} y1="26" x2={16 + i * 7.2} y2="68" stroke="#d97706" strokeWidth="0.3" opacity="0.18" />
        ))}
        <line x1="187" y1="26" x2="187" y2="68" stroke="#d97706" strokeWidth="0.8" opacity="0.4" />
        <line x1="183" y1="26" x2="183" y2="68" stroke="#d97706" strokeWidth="0.8" opacity="0.4" />
        <rect x="8" y="20" width="6" height="5" rx="0.8" fill="#d97706" opacity="0.35" />
        <rect x="186" y="20" width="6" height="5" rx="0.8" fill="#d97706" opacity="0.35" />
        <rect x="8" y="68" width="6" height="4" rx="0.8" fill="#d97706" opacity="0.35" />
        <rect x="186" y="68" width="6" height="4" rx="0.8" fill="#d97706" opacity="0.35" />
        <rect x="6" y="72" width="188" height="3" rx="0.5" fill="#d97706" opacity="0.2" />
        <line x1="2" y1="82" x2="198" y2="82" stroke="#cbd5e1" strokeWidth="0.8" strokeDasharray="3 3" />
      </svg>
    ),

    // ─── 20' Flat Rack: End frames only, no walls ───
    '20fr': (
      <svg viewBox="0 0 200 90" className={className} fill="none">
        {/* Floor platform */}
        <rect x="20" y="60" width="160" height="6" rx="1" fill="#059669" opacity="0.2" stroke="#059669" strokeWidth="1.2" />
        {/* Left end frame */}
        <rect x="20" y="12" width="8" height="54" rx="1" fill="#059669" opacity="0.15" stroke="#059669" strokeWidth="1.2" />
        {/* Right end frame */}
        <rect x="172" y="12" width="8" height="54" rx="1" fill="#059669" opacity="0.15" stroke="#059669" strokeWidth="1.2" />
        {/* Cross braces on frames */}
        <line x1="22" y1="14" x2="26" y2="60" stroke="#059669" strokeWidth="0.6" opacity="0.3" />
        <line x1="26" y1="14" x2="22" y2="60" stroke="#059669" strokeWidth="0.6" opacity="0.3" />
        <line x1="174" y1="14" x2="178" y2="60" stroke="#059669" strokeWidth="0.6" opacity="0.3" />
        <line x1="178" y1="14" x2="174" y2="60" stroke="#059669" strokeWidth="0.6" opacity="0.3" />
        {/* Lashing rings on floor */}
        <circle cx="50" cy="60" r="2" fill="none" stroke="#059669" strokeWidth="0.8" opacity="0.4" />
        <circle cx="100" cy="60" r="2" fill="none" stroke="#059669" strokeWidth="0.8" opacity="0.4" />
        <circle cx="150" cy="60" r="2" fill="none" stroke="#059669" strokeWidth="0.8" opacity="0.4" />
        {/* Corner castings */}
        <rect x="20" y="10" width="8" height="4" rx="0.8" fill="#059669" opacity="0.4" />
        <rect x="172" y="10" width="8" height="4" rx="0.8" fill="#059669" opacity="0.4" />
        <rect x="20" y="62" width="8" height="4" rx="0.8" fill="#059669" opacity="0.4" />
        <rect x="172" y="62" width="8" height="4" rx="0.8" fill="#059669" opacity="0.4" />
        {/* Forklift pockets */}
        <rect x="50" y="66" width="18" height="6" rx="1" fill="#059669" stroke="#059669" strokeWidth="0.5" opacity="0.3" />
        <rect x="132" y="66" width="18" height="6" rx="1" fill="#059669" stroke="#059669" strokeWidth="0.5" opacity="0.3" />
        <line x1="10" y1="78" x2="190" y2="78" stroke="#cbd5e1" strokeWidth="0.8" strokeDasharray="3 3" />
      </svg>
    ),

    // ─── 40' Flat Rack ───
    '40fr': (
      <svg viewBox="0 0 200 90" className={className} fill="none">
        <rect x="8" y="60" width="184" height="6" rx="1" fill="#059669" opacity="0.2" stroke="#059669" strokeWidth="1.2" />
        <rect x="8" y="14" width="8" height="52" rx="1" fill="#059669" opacity="0.15" stroke="#059669" strokeWidth="1.2" />
        <rect x="184" y="14" width="8" height="52" rx="1" fill="#059669" opacity="0.15" stroke="#059669" strokeWidth="1.2" />
        <line x1="10" y1="16" x2="14" y2="60" stroke="#059669" strokeWidth="0.6" opacity="0.3" />
        <line x1="14" y1="16" x2="10" y2="60" stroke="#059669" strokeWidth="0.6" opacity="0.3" />
        <line x1="186" y1="16" x2="190" y2="60" stroke="#059669" strokeWidth="0.6" opacity="0.3" />
        <line x1="190" y1="16" x2="186" y2="60" stroke="#059669" strokeWidth="0.6" opacity="0.3" />
        <circle cx="50" cy="60" r="2" fill="none" stroke="#059669" strokeWidth="0.8" opacity="0.4" />
        <circle cx="100" cy="60" r="2" fill="none" stroke="#059669" strokeWidth="0.8" opacity="0.4" />
        <circle cx="150" cy="60" r="2" fill="none" stroke="#059669" strokeWidth="0.8" opacity="0.4" />
        <rect x="8" y="12" width="8" height="4" rx="0.8" fill="#059669" opacity="0.4" />
        <rect x="184" y="12" width="8" height="4" rx="0.8" fill="#059669" opacity="0.4" />
        <rect x="8" y="62" width="8" height="4" rx="0.8" fill="#059669" opacity="0.4" />
        <rect x="184" y="62" width="8" height="4" rx="0.8" fill="#059669" opacity="0.4" />
        <rect x="40" y="66" width="18" height="5" rx="1" fill="#059669" stroke="#059669" strokeWidth="0.5" opacity="0.3" />
        <rect x="142" y="66" width="18" height="5" rx="1" fill="#059669" stroke="#059669" strokeWidth="0.5" opacity="0.3" />
        <line x1="2" y1="78" x2="198" y2="78" stroke="#cbd5e1" strokeWidth="0.8" strokeDasharray="3 3" />
      </svg>
    ),

    // ─── 20' Reefer: Short with cooling unit ───
    '20rf': (
      <svg viewBox="0 0 200 90" className={className} fill="none">
        {/* Main body */}
        <rect x="30" y="18" width="150" height="55" rx="1.5" fill="#0891b2" opacity="0.1" stroke="#0891b2" strokeWidth="1.5" />
        {/* Cooling unit (left side) */}
        <rect x="12" y="18" width="18" height="55" rx="1.5" fill="#0891b2" opacity="0.2" stroke="#0891b2" strokeWidth="1.5" />
        {/* Cooling unit details: vents */}
        <rect x="15" y="24" width="12" height="8" rx="1" fill="#0891b2" opacity="0.15" stroke="#0891b2" strokeWidth="0.5" />
        {Array.from({ length: 4 }).map((_, i) => (
          <line key={`v${i}`} x1="16" y1={25 + i * 2} x2="26" y2={25 + i * 2} stroke="#0891b2" strokeWidth="0.4" opacity="0.4" />
        ))}
        {/* Cooling unit: compressor */}
        <rect x="15" y="36" width="12" height="14" rx="1" fill="#0891b2" opacity="0.12" stroke="#0891b2" strokeWidth="0.5" />
        <circle cx="21" cy="43" r="4" fill="none" stroke="#0891b2" strokeWidth="0.6" opacity="0.4" />
        {/* Cooling unit: control panel */}
        <rect x="16" y="54" width="10" height="6" rx="0.5" fill="#0891b2" opacity="0.25" />
        {/* Snowflake symbol */}
        <text x="21" y="67" textAnchor="middle" fill="#0891b2" fontSize="8" opacity="0.6">❄</text>
        {/* Corrugation */}
        {Array.from({ length: 12 }).map((_, i) => (
          <line key={i} x1={40 + i * 10} y1="22" x2={40 + i * 10} y2="69" stroke="#0891b2" strokeWidth="0.35" opacity="0.15" />
        ))}
        {/* Door */}
        <line x1="175" y1="22" x2="175" y2="69" stroke="#0891b2" strokeWidth="0.8" opacity="0.4" />
        <line x1="171" y1="22" x2="171" y2="69" stroke="#0891b2" strokeWidth="0.8" opacity="0.4" />
        {/* Corner castings */}
        <rect x="30" y="18" width="6" height="4" rx="0.8" fill="#0891b2" opacity="0.35" />
        <rect x="174" y="18" width="6" height="4" rx="0.8" fill="#0891b2" opacity="0.35" />
        <rect x="30" y="69" width="6" height="4" rx="0.8" fill="#0891b2" opacity="0.35" />
        <rect x="174" y="69" width="6" height="4" rx="0.8" fill="#0891b2" opacity="0.35" />
        <rect x="10" y="73" width="172" height="3" rx="0.5" fill="#0891b2" opacity="0.2" />
        <line x1="5" y1="82" x2="190" y2="82" stroke="#cbd5e1" strokeWidth="0.8" strokeDasharray="3 3" />
      </svg>
    ),

    // ─── 40' HC Reefer ───
    '40hcrf': (
      <svg viewBox="0 0 200 90" className={className} fill="none">
        <rect x="20" y="12" width="172" height="58" rx="1.5" fill="#0891b2" opacity="0.1" stroke="#0891b2" strokeWidth="1.5" />
        {/* Cooling unit */}
        <rect x="4" y="12" width="16" height="58" rx="1.5" fill="#0891b2" opacity="0.2" stroke="#0891b2" strokeWidth="1.5" />
        <rect x="6" y="18" width="12" height="8" rx="1" fill="#0891b2" opacity="0.15" stroke="#0891b2" strokeWidth="0.5" />
        {Array.from({ length: 4 }).map((_, i) => (
          <line key={`v${i}`} x1="7" y1={19 + i * 2} x2="17" y2={19 + i * 2} stroke="#0891b2" strokeWidth="0.4" opacity="0.4" />
        ))}
        <rect x="6" y="30" width="12" height="14" rx="1" fill="#0891b2" opacity="0.12" stroke="#0891b2" strokeWidth="0.5" />
        <circle cx="12" cy="37" r="4" fill="none" stroke="#0891b2" strokeWidth="0.6" opacity="0.4" />
        <rect x="7" y="48" width="10" height="6" rx="0.5" fill="#0891b2" opacity="0.25" />
        <text x="12" y="61" textAnchor="middle" fill="#0891b2" fontSize="8" opacity="0.6">❄</text>
        {/* HC badge */}
        <rect x="85" y="4" width="30" height="10" rx="3" fill="#0891b2" opacity="0.8" />
        <text x="100" y="12" textAnchor="middle" fill="white" fontSize="6" fontWeight="bold">HC RF</text>
        {Array.from({ length: 20 }).map((_, i) => (
          <line key={i} x1={28 + i * 8} y1="16" x2={28 + i * 8} y2="66" stroke="#0891b2" strokeWidth="0.3" opacity="0.15" />
        ))}
        <line x1="187" y1="16" x2="187" y2="66" stroke="#0891b2" strokeWidth="0.8" opacity="0.4" />
        <line x1="183" y1="16" x2="183" y2="66" stroke="#0891b2" strokeWidth="0.8" opacity="0.4" />
        <rect x="20" y="12" width="6" height="4" rx="0.8" fill="#0891b2" opacity="0.35" />
        <rect x="186" y="12" width="6" height="4" rx="0.8" fill="#0891b2" opacity="0.35" />
        <rect x="20" y="66" width="6" height="4" rx="0.8" fill="#0891b2" opacity="0.35" />
        <rect x="186" y="66" width="6" height="4" rx="0.8" fill="#0891b2" opacity="0.35" />
        <rect x="2" y="70" width="192" height="3" rx="0.5" fill="#0891b2" opacity="0.2" />
        <line x1="1" y1="80" x2="198" y2="80" stroke="#cbd5e1" strokeWidth="0.8" strokeDasharray="3 3" />
      </svg>
    ),

    // ─── Swapbody: Container with gooseneck tunnel and support legs ───
    'swapbody': (
      <svg viewBox="0 0 200 90" className={className} fill="none">
        {/* Main body */}
        <rect x="3" y="8" width="194" height="52" rx="2" fill="#7c3aed" opacity="0.1" stroke="#7c3aed" strokeWidth="1.5" />
        {/* Corrugation */}
        {Array.from({ length: 28 }).map((_, i) => (
          <line key={i} x1={10 + i * 6.6} y1="12" x2={10 + i * 6.6} y2="56" stroke="#7c3aed" strokeWidth="0.3" opacity="0.15" />
        ))}
        {/* Door */}
        <line x1="192" y1="12" x2="192" y2="56" stroke="#7c3aed" strokeWidth="0.7" opacity="0.4" />
        <line x1="188" y1="12" x2="188" y2="56" stroke="#7c3aed" strokeWidth="0.7" opacity="0.4" />
        {/* Floor beam */}
        <rect x="1" y="60" width="198" height="3" rx="0.5" fill="#7c3aed" opacity="0.25" />
        {/* Support legs (folded up when on truck, down when standing) */}
        {/* Front legs */}
        <line x1="25" y1="63" x2="20" y2="80" stroke="#7c3aed" strokeWidth="1.5" opacity="0.5" />
        <line x1="35" y1="63" x2="30" y2="80" stroke="#7c3aed" strokeWidth="1.5" opacity="0.5" />
        <line x1="18" y1="80" x2="32" y2="80" stroke="#7c3aed" strokeWidth="1" opacity="0.4" />
        {/* Rear legs */}
        <line x1="165" y1="63" x2="160" y2="80" stroke="#7c3aed" strokeWidth="1.5" opacity="0.5" />
        <line x1="175" y1="63" x2="170" y2="80" stroke="#7c3aed" strokeWidth="1.5" opacity="0.5" />
        <line x1="158" y1="80" x2="172" y2="80" stroke="#7c3aed" strokeWidth="1" opacity="0.4" />
        {/* Gooseneck tunnel (underside) */}
        <rect x="10" y="63" width="40" height="4" rx="1" fill="#7c3aed" opacity="0.1" stroke="#7c3aed" strokeWidth="0.5" strokeDasharray="2 2" />
        <line x1="2" y1="84" x2="198" y2="84" stroke="#cbd5e1" strokeWidth="0.8" strokeDasharray="3 3" />
      </svg>
    ),
  };

  return <>{svgs[id] || svgs['20dc']}</>;
}

/* ═══════════════════════════════════════════════════════════
   PALLET LOADING SVG — Top-down view of pallets in container
   ═══════════════════════════════════════════════════════════ */

function PalletLoadingSVG({ planId, type }: { planId: string; type: 'standard' | 'euro' }) {
  // Container outlines and pallet layouts (top-down schematic)
  const layouts: Record<string, { w: number; pallets: { x: number; y: number; rotated?: boolean }[] }> = {
    '20std': {
      w: 120,
      pallets: type === 'standard'
        ? Array.from({ length: 10 }).map((_, i) => ({ x: 5 + (i % 5) * 22, y: i < 5 ? 5 : 27, rotated: false }))
        : Array.from({ length: 11 }).map((_, i) => {
            if (i < 6) return { x: 5 + i * 18, y: 5, rotated: true };
            return { x: 5 + (i - 6) * 18, y: 27, rotated: true };
          }),
    },
    '40std': {
      w: 180,
      pallets: type === 'standard'
        ? Array.from({ length: 21 }).map((_, i) => {
            const row = Math.floor(i / 7);
            const col = i % 7;
            return { x: 3 + col * 25, y: 3 + row * 16, rotated: false };
          })
        : Array.from({ length: 25 }).map((_, i) => {
            const row = Math.floor(i / 5);
            const col = i % 5;
            return { x: 3 + col * 35, y: 3 + row * 9, rotated: true };
          }),
    },
    '40pw': {
      w: 180,
      pallets: type === 'standard'
        ? Array.from({ length: 24 }).map((_, i) => {
            const row = Math.floor(i / 8);
            const col = i % 8;
            return { x: 2 + col * 22, y: 3 + row * 16, rotated: false };
          })
        : Array.from({ length: 30 }).map((_, i) => {
            const row = Math.floor(i / 6);
            const col = i % 6;
            return { x: 2 + col * 29, y: 3 + row * 9, rotated: true };
          }),
    },
    '45std': {
      w: 190,
      pallets: type === 'standard'
        ? Array.from({ length: 24 }).map((_, i) => {
            const row = Math.floor(i / 8);
            const col = i % 8;
            return { x: 2 + col * 23, y: 3 + row * 16, rotated: false };
          })
        : Array.from({ length: 27 }).map((_, i) => {
            const row = Math.floor(i / 9);
            const col = i % 9;
            return { x: 2 + col * 21, y: 3 + row * 16, rotated: true };
          }),
    },
    '45pw': {
      w: 190,
      pallets: type === 'standard'
        ? Array.from({ length: 26 }).map((_, i) => {
            const row = Math.floor(i / 9);
            const col = i % 9;
            return { x: 2 + col * 21, y: 3 + row * 16, rotated: false };
          })
        : Array.from({ length: 33 }).map((_, i) => {
            const row = Math.floor(i / 11);
            const col = i % 11;
            return { x: 1 + col * 17, y: 3 + row * 16, rotated: true };
          }),
    },
  };

  const layout = layouts[planId] || layouts['20std'];
  const pw = type === 'standard' ? 20 : 16;
  const ph = type === 'standard' ? 14 : 12;
  const color = type === 'standard' ? '#0069b4' : '#d97706';

  return (
    <svg viewBox={`0 0 ${layout.w} 52`} className="w-full h-12 md:h-14">
      {/* Container outline */}
      <rect x="0" y="0" width={layout.w} height="50" rx="2" fill="none" stroke="#94a3b8" strokeWidth="1" strokeDasharray="3 2" />
      {/* Pallets */}
      {layout.pallets.map((p, i) => (
        <rect
          key={i}
          x={p.x}
          y={p.y}
          width={p.rotated ? ph : pw}
          height={p.rotated ? pw : ph}
          rx="0.8"
          fill={color}
          opacity="0.2"
          stroke={color}
          strokeWidth="0.5"
        />
      ))}
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════════ */

// ─── Category Tab Colors ───
const categoryColors: Record<string, { bg: string; text: string; activeBg: string }> = {
  all: { bg: 'bg-gray-100', text: 'text-gray-600', activeBg: 'bg-primary-500' },
  standard: { bg: 'bg-blue-50', text: 'text-blue-700', activeBg: 'bg-blue-600' },
  openTop: { bg: 'bg-amber-50', text: 'text-amber-700', activeBg: 'bg-amber-600' },
  flatRack: { bg: 'bg-emerald-50', text: 'text-emerald-700', activeBg: 'bg-emerald-600' },
  reefer: { bg: 'bg-cyan-50', text: 'text-cyan-700', activeBg: 'bg-cyan-600' },
  special: { bg: 'bg-purple-50', text: 'text-purple-700', activeBg: 'bg-purple-600' },
};

function formatWeight(kg: number): string {
  if (kg === 0) return '-';
  return kg.toLocaleString('tr-TR') + ' kg';
}

/* ═══════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════ */

export default function ContainerDimensionsSection({ locale = 'tr' }: { locale?: Locale }) {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const t = getTranslations(locale);
  const cd = t.containerDimensions;

  const filtered = activeCategory === 'all'
    ? containerDimensions
    : containerDimensions.filter((c) => c.category === activeCategory);

  const allCategories = [
    { id: 'all', label: { tr: cd.allCategories, en: cd.allCategories } },
    ...categories,
  ];

  return (
    <div className="space-y-20">
      {/* ═══════════════════════════════════════════════
          SECTION 1: Konteyner Ölçüleri Tablosu
          ═══════════════════════════════════════════════ */}
      <section>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <h2 className="text-3xl md:text-4xl font-display font-black text-dark-900 mb-3">
            {cd.pageTitle}
          </h2>
          <p className="text-base md:text-lg text-dark-700 max-w-2xl mx-auto">
            {cd.pageSubtitle}
          </p>
        </motion.div>

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {allCategories.map((cat) => {
            const isActive = activeCategory === cat.id;
            const colors = categoryColors[cat.id] || categoryColors.all;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                  isActive
                    ? `${colors.activeBg} text-white shadow-lg scale-105`
                    : `${colors.bg} ${colors.text} hover:scale-105 hover:shadow-md`
                }`}
              >
                {cat.label[locale]}
              </button>
            );
          })}
        </div>

        {/* Container Cards with SVG */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5"
          >
            {filtered.map((container, index) => (
              <ContainerDetailCard
                key={container.id}
                container={container}
                index={index}
                locale={locale}
                cd={cd}
              />
            ))}
          </motion.div>
        </AnimatePresence>
      </section>

      {/* ═══════════════════════════════════════════════
          SECTION 2: Konteyner Yerleşim Planı
          ═══════════════════════════════════════════════ */}
      <section>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <h2 className="text-3xl md:text-4xl font-display font-black text-dark-900 mb-3">
            {cd.palletTitle}
          </h2>
          <p className="text-base md:text-lg text-dark-700 max-w-2xl mx-auto">
            {cd.palletSubtitle}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {palletPlans.map((plan, index) => (
            <PalletCard key={plan.id} plan={plan} index={index} locale={locale} cd={cd} />
          ))}
        </div>
      </section>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   CONTAINER DETAIL CARD — SVG silhouette + specs
   ═══════════════════════════════════════════════════════════ */

function ContainerDetailCard({
  container,
  index,
  locale,
  cd,
}: {
  container: ContainerDimension;
  index: number;
  locale: Locale;
  cd: any;
}) {
  const colors = categoryColors[container.category] || categoryColors.all;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.06 }}
      className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow group"
    >
      {/* SVG Illustration */}
      <div className={`px-6 pt-5 pb-3 ${
        container.category === 'standard' ? 'bg-gradient-to-br from-blue-50/80 to-white' :
        container.category === 'openTop' ? 'bg-gradient-to-br from-amber-50/80 to-white' :
        container.category === 'flatRack' ? 'bg-gradient-to-br from-emerald-50/80 to-white' :
        container.category === 'reefer' ? 'bg-gradient-to-br from-cyan-50/80 to-white' :
        'bg-gradient-to-br from-purple-50/80 to-white'
      }`}>
        <ContainerSVG id={container.id} className="w-full h-20 md:h-24" />
      </div>

      {/* Info */}
      <div className="px-5 pb-5 pt-3">
        {/* Name + Category Badge */}
        <div className="flex items-center gap-2 mb-3">
          <h3 className="font-bold text-dark-900 text-base md:text-lg">{container.name[locale]}</h3>
          {container.extra && (
            <span className="text-[10px] bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-medium">
              {container.extra[locale]}
            </span>
          )}
        </div>

        {/* Specs Grid */}
        <div className="grid grid-cols-3 gap-2 mb-2">
          <SpecBadge label={cd.width} value={`${container.internal.width.toFixed(2)} m`} />
          <SpecBadge label={cd.length} value={`${container.internal.length.toFixed(2)} m`} />
          <SpecBadge label={cd.height} value={`${container.internal.height.toFixed(2)} m`} />
        </div>
        <div className="grid grid-cols-3 gap-2">
          <SpecBadge label={cd.volume} value={container.volume ? `${container.volume} m³` : '-'} />
          <SpecBadge label={cd.tareWeight} value={container.tareWeight ? formatWeight(container.tareWeight) : '-'} />
          <SpecBadge label={cd.payload} value={container.payload ? formatWeight(container.payload) : '-'} highlight />
        </div>

        {/* CTA Button */}
        <Link
          href={`/${locale}/teklif-al`}
          className="mt-4 block w-full text-center bg-gradient-to-r from-secondary-500 to-secondary-600 hover:from-secondary-600 hover:to-secondary-700 text-white font-bold text-sm py-2.5 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg hover:scale-[1.02]"
        >
          {locale === 'tr' ? 'Teklif Al' : 'Get Quote'}
        </Link>
      </div>
    </motion.div>
  );
}

function SpecBadge({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className={`rounded-lg px-2 py-2 text-center ${highlight ? 'bg-primary-50 border border-primary-100' : 'bg-gray-50'}`}>
      <p className="text-[9px] md:text-[10px] text-gray-500 uppercase tracking-wide font-medium">{label}</p>
      <p className={`text-xs md:text-sm font-bold ${highlight ? 'text-primary-600' : 'text-dark-800'}`}>{value}</p>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   PALLET CARD — with top-down loading SVG
   ═══════════════════════════════════════════════════════════ */

function PalletCard({
  plan,
  index,
  locale,
  cd,
}: {
  plan: PalletPlan;
  index: number;
  locale: Locale;
  cd: any;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="bg-gradient-to-br from-white to-primary-50/30 rounded-2xl shadow-lg border border-gray-200 p-5 md:p-6 hover:shadow-xl transition-shadow"
    >
      {/* Container Name */}
      <h3 className="font-bold text-dark-900 text-sm md:text-base mb-4 text-center">{plan.name[locale]}</h3>

      {/* Standard Pallet */}
      <div className="bg-white rounded-xl px-4 py-3 border border-gray-100 mb-3">
        <div className="flex items-center justify-between mb-2">
          <div>
            <p className="text-xs text-gray-600 font-semibold">{cd.standardPallet}</p>
            <p className="text-[10px] text-gray-400">{plan.standardPallet.size}</p>
          </div>
          <span className="text-2xl font-black text-primary-600">{plan.standardPallet.count}</span>
        </div>
        <PalletLoadingSVG planId={plan.id} type="standard" />
      </div>

      {/* Euro Pallet */}
      <div className="bg-white rounded-xl px-4 py-3 border border-gray-100">
        <div className="flex items-center justify-between mb-2">
          <div>
            <p className="text-xs text-gray-600 font-semibold">{cd.euroPallet}</p>
            <p className="text-[10px] text-gray-400">{plan.euroPallet.size}</p>
          </div>
          <span className="text-2xl font-black text-amber-600">{plan.euroPallet.count}</span>
        </div>
        <PalletLoadingSVG planId={plan.id} type="euro" />
      </div>
    </motion.div>
  );
}
