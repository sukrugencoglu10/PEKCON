/**
 * container-specs.ts
 * Authoritative comparison-table dataset for the /konteynerler page.
 * Values follow ISO standard container specs and match data/containers.ts.
 * door = [width, height] in metres (clear door opening); null = no door (Flat Rack).
 * internal / volume = null where not meaningful (Flat Rack: open platform).
 */

export interface ContainerSpec {
  id: string;
  name: { tr: string; en: string };
  external: [number, number, number]; // length, width, height (m)
  internal: [number, number, number] | null; // length, width, height (m)
  door: [number, number] | null; // width, height (m)
  volume: number | null; // m³
  tare: number; // kg
  payload: number; // kg (max payload = max gross − tare)
}

export const containerSpecs: ContainerSpec[] = [
  {
    id: '20dc',
    name: { tr: "20' DC (Standart)", en: "20' DC (Standard)" },
    external: [6.06, 2.44, 2.59],
    internal: [5.9, 2.35, 2.39],
    door: [2.34, 2.28],
    volume: 33.2,
    tare: 2300,
    payload: 28180,
  },
  {
    id: '40dc',
    name: { tr: "40' DC (Standart)", en: "40' DC (Standard)" },
    external: [12.19, 2.44, 2.59],
    internal: [12.03, 2.35, 2.39],
    door: [2.34, 2.28],
    volume: 67.7,
    tare: 3750,
    payload: 26730,
  },
  {
    id: '40hc',
    name: { tr: "40' HC (High Cube)", en: "40' HC (High Cube)" },
    external: [12.19, 2.44, 2.9],
    internal: [12.03, 2.35, 2.7],
    door: [2.34, 2.58],
    volume: 76.3,
    tare: 3900,
    payload: 26580,
  },
  {
    id: '45hc',
    name: { tr: "45' HC (High Cube)", en: "45' HC (High Cube)" },
    external: [13.72, 2.5, 2.9],
    internal: [13.56, 2.35, 2.7],
    door: [2.34, 2.58],
    volume: 86.0,
    tare: 4800,
    payload: 25680,
  },
  {
    id: '40rf',
    name: { tr: "40' Reefer (Soğutmalı)", en: "40' Reefer" },
    external: [12.19, 2.44, 2.89],
    internal: [11.58, 2.29, 2.5],
    door: [2.29, 2.49],
    volume: 67.0,
    tare: 4800,
    payload: 25680,
  },
  {
    id: '20ot',
    name: { tr: "20' Open Top (Üstü Açılır)", en: "20' Open Top" },
    external: [6.06, 2.44, 2.59],
    internal: [5.9, 2.35, 2.38],
    door: [2.34, 2.28],
    volume: 33.2,
    tare: 2350,
    payload: 28130,
  },
  {
    id: '20fr',
    name: { tr: "20' Flat Rack", en: "20' Flat Rack" },
    external: [6.06, 2.44, 2.59],
    internal: [5.8, 2.4, 2.3],
    door: null,
    volume: null,
    tare: 2740,
    payload: 31260,
  },
];

export interface FaqItem {
  q: string;
  a: string;
}

export const containersFaq: Record<'tr' | 'en', { heading: string; items: FaqItem[] }> = {
  tr: {
    heading: 'Konteyner Ölçüleri Hakkında Sıkça Sorulan Sorular',
    items: [
      {
        q: "20'lik konteyner kaç kg alır?",
        a: "20'lik standart (DC) konteynerin azami yük kapasitesi yaklaşık 28.180 kg'dır (dara ~2.300 kg, azami brüt ağırlık 30.480 kg). İç hacmi ~33 m³'tür. Taşınabilecek net yük, gönderinin yoğunluğuna ve varış ülkesinin karayolu ağırlık limitlerine göre pratikte daha düşük olabilir.",
      },
      {
        q: "40'lık DC ile 40 HC arasındaki fark nedir?",
        a: "İkisinin de uzunluğu ve genişliği aynıdır; fark yüksekliktedir. Standart 40' DC'nin dış yüksekliği 2,59 m (iç 2,39 m), High Cube (HC) ise 2,90 m (iç 2,70 m)'dir. HC, yaklaşık 30 cm ekstra yükseklik ve ~9 m³ daha fazla hacim (76 m³'e karşı 68 m³) sunar; bu yüzden hacimli ama görece hafif yükler için idealdir.",
      },
      {
        q: 'Konteyner kaç palet alır?',
        a: "20'lik konteynere 10 standart (120×100 cm) veya 11 euro (120×80 cm) palet; 40'lık konteynere 21 standart veya 25 euro palet; 45'lik konteynere 24 standart veya 27 euro palet sığar. Palet genişliğindeki (pallet-wide) konteynerlerde bu sayılar bir miktar artar.",
      },
      {
        q: 'Open Top ve Flat Rack konteyner ne zaman kullanılır?',
        a: "Open Top (üstü açılır) konteyner, vinçle üstten yüklenen ya da kapıdan geçmeyecek kadar yüksek yükler için kullanılır. Flat Rack ise yanları ve tavanı olmayan bir platformdur; makine, boru, mermer blok gibi gabari dışı ve ağır yüklerin yandan/üstten yüklenmesine imkân tanır.",
      },
    ],
  },
  en: {
    heading: 'Container Dimensions — Frequently Asked Questions',
    items: [
      {
        q: 'How much weight can a 20ft container hold?',
        a: "A standard 20ft (DC) container has a maximum payload of about 28,180 kg (tare ~2,300 kg, max gross 30,480 kg) and an internal volume of ~33 m³. The practical net load may be lower depending on cargo density and the road weight limits of the destination country.",
      },
      {
        q: 'What is the difference between a 40ft DC and a 40ft HC?',
        a: "Both have the same length and width; the difference is height. A standard 40' DC is 2.59 m tall externally (2.39 m internal), while a High Cube (HC) is 2.90 m (2.70 m internal). The HC offers roughly 30 cm extra height and ~9 m³ more volume (76 m³ vs 68 m³), making it ideal for voluminous but relatively light cargo.",
      },
      {
        q: 'How many pallets fit in a container?',
        a: "A 20ft container holds 10 standard (120×100 cm) or 11 euro (120×80 cm) pallets; a 40ft holds 21 standard or 25 euro pallets; a 45ft holds 24 standard or 27 euro pallets. Pallet-wide containers fit slightly more.",
      },
      {
        q: 'When are Open Top and Flat Rack containers used?',
        a: 'An Open Top container is used for cargo loaded from above by crane or too tall to pass through the doors. A Flat Rack is a platform with no sides or roof, allowing out-of-gauge and heavy loads such as machinery, pipes or marble blocks to be loaded from the side or top.',
      },
    ],
  },
};
