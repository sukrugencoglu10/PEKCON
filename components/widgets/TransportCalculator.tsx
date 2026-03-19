'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getTranslations, type Locale } from '@/lib/i18n';
import {
  Fuel,
  Truck,
  Map,
  ToggleLeft,
  ToggleRight,
  RefreshCw,
  ChevronRight,
  Info,
  Route,
  Wrench,
  CircleDollarSign,
  Calculator,
} from 'lucide-react';

// ─── Types ───────────────────────────────────────────────────────────────────

type ContainerType = 'ct20' | 'ct40' | 'ct40hc' | 'ct40rf';

interface RoutePreset {
  label: string;
  km: number;
}

interface Breakdown {
  fuel: number;
  labor: number;
  toll: number;
  misc: number;
  total: number;
}

// ─── Constants ────────────────────────────────────────────────────────────────

/**
 * Litre/100km consumption for a semi-truck pulling a container.
 * Reefer containers draw extra power → higher consumption.
 */
const FUEL_CONSUMPTION: Record<ContainerType, number> = {
  ct20: 36,
  ct40: 40,
  ct40hc: 42,
  ct40rf: 46, // generator fuel included
};

/**
 * Pre-set routes between major Turkish cities (approximate road distances).
 */
const ROUTE_PRESETS: RoutePreset[] = [
  { label: 'İstanbul – Ankara', km: 450 },
  { label: 'İstanbul – İzmir', km: 480 },
  { label: 'İstanbul – Mersin', km: 960 },
  { label: 'İstanbul – Gaziantep', km: 1150 },
  { label: 'Ankara – İzmir', km: 590 },
  { label: 'İzmir – Mersin', km: 620 },
];

const FALLBACK_FUEL = 65.88; // TL/litre

/** Gross driver daily wage + social security (approx. 2026 Turkey) */
const DRIVER_DAILY_COST = 2800; // TL/day
/** Average km per day for long-haul */
const KM_PER_DAY = 600;
/** Average toll cost per km on Turkish highways (TL) */
const TOLL_PER_KM = 3.2;
/** Fixed cost per km for tyres + maintenance + depreciation (TL) */
const MISC_PER_KM = 18;

// ─── Helpers ─────────────────────────────────────────────────────────────────

function calculateCosts(
  km: number,
  fuelPrice: number,
  containerType: ContainerType,
  emptyReturn: boolean
): Breakdown {
  const distanceFactor = emptyReturn ? 2 : 1;
  const effectiveKm = km * distanceFactor;

  const consumption = FUEL_CONSUMPTION[containerType]; // L/100km
  const fuelCost = (effectiveKm * consumption * fuelPrice) / 100;

  const days = Math.ceil(km / KM_PER_DAY);
  const laborCost = days * DRIVER_DAILY_COST;

  const tollCost = effectiveKm * TOLL_PER_KM;

  const miscCost = effectiveKm * MISC_PER_KM;

  const total = fuelCost + laborCost + tollCost + miscCost;

  return { fuel: fuelCost, labor: laborCost, toll: tollCost, misc: miscCost, total };
}

function fmt(n: number) {
  return new Intl.NumberFormat('tr-TR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Math.round(n));
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function BarChart({ breakdown }: { breakdown: Breakdown }) {
  const items = [
    { key: 'fuel', value: breakdown.fuel, color: 'from-orange-500 to-amber-400', icon: Fuel },
    { key: 'labor', value: breakdown.labor, color: 'from-blue-500 to-cyan-400', icon: Truck },
    { key: 'toll', value: breakdown.toll, color: 'from-violet-500 to-purple-400', icon: Route },
    { key: 'misc', value: breakdown.misc, color: 'from-emerald-500 to-teal-400', icon: Wrench },
  ];

  const max = Math.max(...items.map((i) => i.value));

  return (
    <div className="space-y-3 mt-2">
      {items.map((item) => (
        <div key={item.key} className="flex items-center gap-3">
          <item.icon size={16} className="text-gray-400 flex-shrink-0" />
          <div className="flex-1 h-5 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className={`h-full rounded-full bg-gradient-to-r ${item.color}`}
              initial={{ width: 0 }}
              animate={{ width: `${(item.value / max) * 100}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
          </div>
          <span className="text-sm font-mono text-gray-200 w-28 text-right">
            {fmt(item.value)} TL
          </span>
        </div>
      ))}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function TransportCalculator({ locale = 'tr' }: { locale?: Locale }) {
  const t = getTranslations(locale);
  const c = t.calculator;

  const [fuelPrice, setFuelPrice] = useState<number>(FALLBACK_FUEL);
  const [fuelSource, setFuelSource] = useState<'api' | 'cache' | 'fallback' | 'manual'>('fallback');
  const [fuelLoading, setFuelLoading] = useState(true);

  const [distance, setDistance] = useState<number>(450);
  const [customKm, setCustomKm] = useState<string>('450');
  const [containerType, setContainerType] = useState<ContainerType>('ct40');
  const [emptyReturn, setEmptyReturn] = useState(false);
  const [breakdown, setBreakdown] = useState<Breakdown | null>(null);
  const [calculated, setCalculated] = useState(false);

  // Fetch live fuel price on mount
  useEffect(() => {
    let isMounted = true;
    fetch('/api/fuel-price')
      .then((r) => r.json())
      .then((data: { price: number; source: string }) => {
        if (isMounted && data?.price) {
          setFuelPrice(data.price);
          setFuelSource(data.source as 'api' | 'cache' | 'fallback');
        }
      })
      .catch(() => {})
      .finally(() => { if (isMounted) setFuelLoading(false); });
    return () => { isMounted = false; };
  }, []);

  const handleCalculate = useCallback(() => {
    const result = calculateCosts(distance, fuelPrice, containerType, emptyReturn);
    setBreakdown(result);
    setCalculated(true);
  }, [distance, fuelPrice, containerType, emptyReturn]);

  // Auto-update when inputs change after first calculation
  useEffect(() => {
    if (calculated) {
      const result = calculateCosts(distance, fuelPrice, containerType, emptyReturn);
      setBreakdown(result);
    }
  }, [distance, fuelPrice, containerType, emptyReturn, calculated]);

  const containerTypes: ContainerType[] = ['ct20', 'ct40', 'ct40hc', 'ct40rf'];

  return (
    <section className="relative py-20 overflow-hidden bg-gradient-to-br from-gray-950 via-slate-900 to-gray-950">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-cyan-500/8 rounded-full blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />
      </div>

      <div className="relative container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-blue-500/15 border border-blue-500/30 rounded-full px-4 py-2 text-blue-300 text-sm font-medium mb-4">
            <Calculator size={15} />
            {locale === 'tr' ? 'Ücretsiz Araç' : 'Free Tool'}
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white mb-4 leading-tight">
            {c.title}
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">{c.subtitle}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="grid lg:grid-cols-2 gap-6"
        >
          {/* ── Left Panel: Inputs ── */}
          <div className="space-y-5">
            {/* Fuel Price Card */}
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-white font-semibold">
                  <Fuel size={18} className="text-orange-400" />
                  {c.fuelPrice}
                </div>
                {fuelLoading ? (
                  <span className="text-xs text-gray-400 animate-pulse">{c.fuelLoading}</span>
                ) : (
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    fuelSource === 'fallback'
                      ? 'bg-yellow-500/20 text-yellow-300'
                      : 'bg-green-500/20 text-green-300'
                  }`}>
                    {fuelSource === 'fallback' ? c.fuelFallback : c.fuelSource}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3">
                <div className="relative flex-1">
                  <input
                    type="number"
                    min={30}
                    max={150}
                    step={0.01}
                    value={fuelPrice}
                    title={c.fuelPrice}
                    aria-label={c.fuelPrice}
                    placeholder={String(FALLBACK_FUEL)}
                    onChange={(e) => {
                      setFuelPrice(parseFloat(e.target.value) || FALLBACK_FUEL);
                      setFuelSource('manual');
                    }}
                    className="w-full bg-white/8 text-black text-2xl font-bold border border-white/15 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-400/80 transition"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">{c.fuelPriceUnit}</span>
                </div>
                <button
                  onClick={() => {
                    setFuelLoading(true);
                    fetch('/api/fuel-price')
                      .then((r) => r.json())
                      .then((data: { price: number; source: string }) => {
                        setFuelPrice(data.price);
                        setFuelSource(data.source as 'api' | 'cache' | 'fallback');
                      })
                      .catch(() => {})
                      .finally(() => setFuelLoading(false));
                  }}
                  title="Fiyatı Güncelle"
                  className="p-3 rounded-xl bg-white/8 border border-white/15 text-gray-300 hover:text-white hover:bg-white/15 transition"
                >
                  <RefreshCw size={18} className={fuelLoading ? 'animate-spin' : ''} />
                </button>
              </div>
            </div>

            {/* Container Type */}
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5">
              <div className="flex items-center gap-2 text-white font-semibold mb-4">
                <Truck size={18} className="text-cyan-400" />
                {c.containerType}
              </div>
              <div className="grid grid-cols-2 gap-2">
                {containerTypes.map((type) => (
                  <button
                    key={type}
                    onClick={() => setContainerType(type)}
                    className={`px-3 py-2.5 rounded-xl text-sm font-medium border transition-all duration-200 text-left ${
                      containerType === type
                        ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/25'
                        : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:border-white/20'
                    }`}
                  >
                    <span className="block text-xs text-inherit opacity-75 mb-0.5">{FUEL_CONSUMPTION[type]}L/100km</span>
                    {c[type]}
                  </button>
                ))}
              </div>
            </div>

            {/* Distance */}
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-white font-semibold">
                  <Map size={18} className="text-violet-400" />
                  {c.distance}
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={50}
                    max={3000}
                    value={customKm}
                    title={c.distance}
                    aria-label={c.distance}
                    placeholder="450"
                    onChange={(e) => {
                      setCustomKm(e.target.value);
                      const val = parseInt(e.target.value);
                      if (!isNaN(val) && val >= 50 && val <= 3000) setDistance(val);
                    }}
                    className="w-24 bg-white/8 text-white font-bold border border-white/15 rounded-lg px-2 py-1 text-center focus:outline-none focus:border-violet-400/80 transition"
                  />
                  <span className="text-gray-400 text-sm">{c.distanceUnit}</span>
                </div>
              </div>

              {/* Slider */}
              <input
                type="range"
                min={50}
                max={1500}
                step={10}
                value={distance}
                title={c.distance}
                aria-label={c.distance}
                placeholder="450"
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  setDistance(val);
                  setCustomKm(String(val));
                }}
                className="w-full accent-violet-500"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>50 km</span>
                <span>750 km</span>
                <span>1500 km</span>
              </div>

              {/* Quick route presets */}
              <div className="mt-4">
                <p className="text-xs text-gray-500 mb-2">{c.routeExamples}</p>
                <div className="flex flex-wrap gap-2">
                  {ROUTE_PRESETS.map((preset) => (
                    <button
                      key={preset.label}
                      onClick={() => {
                        setDistance(preset.km);
                        setCustomKm(String(preset.km));
                      }}
                      className={`text-xs px-3 py-1.5 rounded-lg border transition-all duration-150 ${
                        distance === preset.km
                          ? 'bg-violet-600/80 border-violet-500 text-white'
                          : 'bg-white/5 border-white/10 text-gray-400 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      {preset.label}
                      <span className="ml-1 opacity-60">({preset.km}km)</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Empty Return Toggle */}
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5">
              <div
                className="flex items-center justify-between cursor-pointer select-none"
                onClick={() => setEmptyReturn((p) => !p)}
              >
                <div>
                  <p className="text-white font-semibold">{c.emptyReturn}</p>
                  <p className="text-gray-500 text-xs mt-0.5">{c.emptyReturnDesc}</p>
                </div>
                <motion.div animate={{ scale: emptyReturn ? 1.05 : 1 }} transition={{ type: 'spring', stiffness: 400 }}>
                  {emptyReturn ? (
                    <ToggleRight size={36} className="text-blue-400" />
                  ) : (
                    <ToggleLeft size={36} className="text-gray-500" />
                  )}
                </motion.div>
              </div>
            </div>
          </div>

          {/* ── Right Panel: Result ── */}
          <div className="space-y-5">
            {/* Calculate Button (shows before first calculation) */}
            {!calculated && (
              <motion.button
                onClick={handleCalculate}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold text-lg shadow-2xl shadow-blue-600/30 flex items-center justify-center gap-3 hover:from-blue-500 hover:to-cyan-500 transition-all"
              >
                <Calculator size={22} />
                {c.calculate}
                <ChevronRight size={22} />
              </motion.button>
            )}

            <AnimatePresence>
              {breakdown && (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 24 }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                  className="space-y-5"
                >
                  {/* Total Cost highlight */}
                  <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-cyan-700 rounded-2xl p-6 shadow-2xl shadow-blue-600/30">
                    <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-12 translate-x-12" />
                    <div className="relative z-10">
                      <div className="flex items-center gap-2 text-blue-200 text-sm mb-2">
                        <CircleDollarSign size={16} />
                        {c.totalCost}
                      </div>
                      <motion.p
                        key={breakdown.total}
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.4 }}
                        className="text-4xl md:text-5xl font-black text-white"
                      >
                        {fmt(breakdown.total)}
                        <span className="text-xl font-normal ml-2 text-blue-200">TL</span>
                      </motion.p>
                      <p className="text-blue-200/70 text-sm mt-2">
                        ≈ {fmt(breakdown.total / distance)} TL/{c.perKm}
                        {emptyReturn && (
                          <span className="ml-2 px-2 py-0.5 bg-white/15 rounded-full text-xs">
                            {locale === 'tr' ? 'Boş dönüş dahil' : 'Empty return included'}
                          </span>
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Cost Breakdown */}
                  <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5">
                    <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                      <Info size={16} className="text-gray-400" />
                      {c.breakdown}
                    </h3>

                    {/* Cost rows */}
                    <div className="space-y-3 mb-5">
                      {[
                        { label: c.fuelCost, value: breakdown.fuel, icon: Fuel, color: 'text-orange-400' },
                        { label: c.laborCost, value: breakdown.labor, icon: Truck, color: 'text-blue-400' },
                        { label: c.tollCost, value: breakdown.toll, icon: Route, color: 'text-violet-400' },
                        { label: c.miscCost, value: breakdown.misc, icon: Wrench, color: 'text-emerald-400' },
                      ].map((item) => (
                        <div key={item.label} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                          <div className="flex items-center gap-2">
                            <item.icon size={15} className={item.color} />
                            <span className="text-gray-300 text-sm">{item.label}</span>
                          </div>
                          <motion.span
                            key={item.value}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-white font-semibold font-mono"
                          >
                            {fmt(item.value)} TL
                          </motion.span>
                        </div>
                      ))}
                    </div>

                    {/* Visual bars */}
                    <BarChart breakdown={breakdown} />
                  </div>

                  {/* Assumptions info */}
                  <div className="bg-white/3 border border-white/8 rounded-xl p-4 text-xs text-gray-500">
                    <p className="font-medium text-gray-400 mb-1">
                      {locale === 'tr' ? 'Hesaplama Varsayımları' : 'Calculation Assumptions'}
                    </p>
                    <ul className="space-y-0.5 list-disc list-inside">
                      <li>{locale === 'tr' ? `Yakıt tüketimi: ${FUEL_CONSUMPTION[containerType]} L/100km` : `Fuel consumption: ${FUEL_CONSUMPTION[containerType]} L/100km`}</li>
                      <li>{locale === 'tr' ? `Günlük ortalama mesafe: ${KM_PER_DAY} km` : `Daily average distance: ${KM_PER_DAY} km`}</li>
                      <li>{locale === 'tr' ? `HGS / yol ücreti: ~${TOLL_PER_KM} TL/km` : `Highway toll: ~${TOLL_PER_KM} TL/km`}</li>
                      <li>{locale === 'tr' ? `Lasik+bakım+amortisman: ~${MISC_PER_KM} TL/km` : `Tyre+maintenance+depreciation: ~${MISC_PER_KM} TL/km`}</li>
                    </ul>
                    <p className="mt-2 italic">{c.disclaimer}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {!calculated && (
              <div className="bg-white/3 border border-dashed border-white/10 rounded-2xl p-10 flex flex-col items-center justify-center text-center text-gray-500 gap-3 min-h-[200px]">
                <Calculator size={36} className="opacity-40" />
                <p>{locale === 'tr' ? 'Parametreleri seçin ve "Hesapla" butonuna basın' : 'Set your parameters and press Calculate'}</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* CTA strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-10 text-center"
        >
          <p className="text-gray-500 text-sm">
            {locale === 'tr'
              ? 'Gerçek teklif almak için uzmanlarımıza başvurun →'
              : 'For a real quote, contact our experts →'}
            {' '}
            <a href={`/${locale}/teklif-al`} className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
              {locale === 'tr' ? 'Teklif Al' : 'Get a Quote'}
            </a>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
