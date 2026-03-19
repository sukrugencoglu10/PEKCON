export interface ContainerDimension {
  id: string;
  name: { tr: string; en: string };
  category: 'standard' | 'openTop' | 'flatRack' | 'reefer' | 'special';
  internal: { width: number; length: number; height: number };
  volume?: number;
  tareWeight: number;
  payload?: number;
  extra?: { tr: string; en: string };
}

export interface PalletPlan {
  id: string;
  name: { tr: string; en: string };
  standardPallet: { count: number; size: string };
  euroPallet: { count: number; size: string };
}

export const containerDimensions: ContainerDimension[] = [
  // ─── STANDART ───
  {
    id: '20dc',
    name: { tr: "20'lik DC", en: "20' DC" },
    category: 'standard',
    internal: { width: 2.35, length: 5.90, height: 2.37 },
    volume: 33,
    tareWeight: 2300,
    payload: 21770,
  },
  {
    id: '40dc',
    name: { tr: "40'lık DC", en: "40' DC" },
    category: 'standard',
    internal: { width: 2.35, length: 11.98, height: 2.35 },
    volume: 66,
    tareWeight: 3700,
    payload: 26780,
  },
  {
    id: '40hc',
    name: { tr: "40'lık HC", en: "40' HC" },
    category: 'standard',
    internal: { width: 2.35, length: 11.98, height: 2.69 },
    volume: 76,
    tareWeight: 3970,
    payload: 26780,
  },
  {
    id: '45hc',
    name: { tr: "45'lik HC", en: "45' HC" },
    category: 'standard',
    internal: { width: 2.35, length: 13.50, height: 2.69 },
    volume: 86,
    tareWeight: 4590,
    payload: 27900,
  },

  // ─── ÜSTÜ AÇILIR (OPEN TOP) ───
  {
    id: '20ot',
    name: { tr: "20'lik Üstü Açılır", en: "20' Open Top" },
    category: 'openTop',
    internal: { width: 2.35, length: 5.89, height: 2.35 },
    volume: 33,
    tareWeight: 2400,
    payload: 21600,
  },
  {
    id: '40ot',
    name: { tr: "40'lık Üstü Açılır", en: "40' Open Top" },
    category: 'openTop',
    internal: { width: 2.35, length: 11.98, height: 2.35 },
    volume: 66,
    tareWeight: 3850,
    payload: 26630,
  },

  // ─── FLAT RACK ───
  {
    id: '20fr',
    name: { tr: "20'lik Flatrack", en: "20' Flat Rack" },
    category: 'flatRack',
    internal: { width: 2.20, length: 5.60, height: 2.20 },
    tareWeight: 2530,
  },
  {
    id: '40fr',
    name: { tr: "40'lık Flatrack", en: "40' Flat Rack" },
    category: 'flatRack',
    internal: { width: 2.35, length: 12.08, height: 2.10 },
    tareWeight: 5480,
  },

  // ─── REEFER (SOĞUTUCULU) ───
  {
    id: '20rf',
    name: { tr: "20'lik Reefer", en: "20' Reefer" },
    category: 'reefer',
    internal: { width: 2.23, length: 5.42, height: 2.26 },
    volume: 28,
    tareWeight: 3200,
    payload: 20800,
  },
  {
    id: '40hcrf',
    name: { tr: "40'lık HC Reefer", en: "40' HC Reefer" },
    category: 'reefer',
    internal: { width: 2.29, length: 11.56, height: 2.50 },
    volume: 66.6,
    tareWeight: 4500,
    payload: 25980,
  },

  // ─── ÖZEL ───
  {
    id: 'swapbody',
    name: { tr: 'Swapbody', en: 'Swapbody' },
    category: 'special',
    internal: { width: 2.42, length: 13.40, height: 2.98 },
    volume: 96.5,
    tareWeight: 0,
    extra: { tr: 'Tavan Yükselmesi: 30 cm', en: 'Ceiling Rise: 30 cm' },
  },
];

export const palletPlans: PalletPlan[] = [
  {
    id: '20std',
    name: { tr: "20'lik Standart Konteyner", en: "20' Standard Container" },
    standardPallet: { count: 10, size: '1,2 x 1,0 m' },
    euroPallet: { count: 11, size: '1,2 x 0,8 m' },
  },
  {
    id: '40std',
    name: { tr: "40'lık Standart Konteyner", en: "40' Standard Container" },
    standardPallet: { count: 21, size: '1,2 x 1,0 m' },
    euroPallet: { count: 25, size: '1,2 x 0,8 m' },
  },
  {
    id: '40pw',
    name: { tr: "40'lık Palet Genişliğinde Konteyner", en: "40' Pallet Wide Container" },
    standardPallet: { count: 24, size: '1,2 x 1,0 m' },
    euroPallet: { count: 30, size: '1,2 x 0,8 m' },
  },
  {
    id: '45std',
    name: { tr: "45'lik Standart Konteyner", en: "45' Standard Container" },
    standardPallet: { count: 24, size: '1,2 x 1,0 m' },
    euroPallet: { count: 27, size: '1,2 x 0,8 m' },
  },
  {
    id: '45pw',
    name: { tr: "45'lik Palet Genişliğinde Konteyner", en: "45' Pallet Wide Container" },
    standardPallet: { count: 26, size: '1,2 x 1,0 m' },
    euroPallet: { count: 33, size: '1,2 x 0,8 m' },
  },
];

export const categories = [
  { id: 'standard', label: { tr: 'Standart', en: 'Standard' }, icon: 'box' },
  { id: 'openTop', label: { tr: 'Üstü Açılır', en: 'Open Top' }, icon: 'boxOpen' },
  { id: 'flatRack', label: { tr: 'Flat Rack', en: 'Flat Rack' }, icon: 'flatRack' },
  { id: 'reefer', label: { tr: 'Reefer', en: 'Reefer' }, icon: 'snowflake' },
  { id: 'special', label: { tr: 'Özel', en: 'Special' }, icon: 'special' },
] as const;
