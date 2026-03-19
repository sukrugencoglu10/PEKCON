/**
 * Google Ads Dynamic Keyword Configuration
 * 
 * URL: /tr?keyword=satilik-40-konteyner
 * 
 * This maps keyword slugs to dynamic page titles, hero texts, and meta descriptions.
 * Add new keywords here as you create new Google Ads campaigns.
 */

export interface KeywordConfig {
  /** Page <title> */
  title: string;
  /** Meta description */
  description: string;
  /** Hero title overrides (replaces t.hero.title1/2/3) */
  heroTitle1: string;
  heroTitle2: string;
  heroTitle3: string;
  /** Hero description override */
  heroDescription: string;
}

export const KEYWORD_MAP: Record<string, Record<string, KeywordConfig>> = {
  tr: {
    'satilik-konteyner': {
      title: 'Satılık Konteyner Fiyatları 2025 | PEKCON',
      description: 'Sıfır ve ikinci el satılık konteyner fiyatları. 20\'lik, 40\'lık, HC ve Reefer konteyner seçenekleri ile uygun fiyat garantisi.',
      heroTitle1: 'Satılık',
      heroTitle2: 'Konteyner Fiyatları',
      heroTitle3: 'En Uygun Fiyat Garantisi',
      heroDescription: 'Sıfır ve ikinci el konteyner seçeneklerimizle\nihtiyacınıza en uygun çözümü bulun.',
    },
    'satilik-40-konteyner': {
      title: 'Satılık 40\'lık Konteyner | Güncel Fiyatlar | PEKCON',
      description: 'Satılık 40\'lık konteyner fiyatları. 40 DC, 40 HC ve 40 Reefer konteyner çeşitleri stokta. Hemen teklif alın.',
      heroTitle1: 'Satılık',
      heroTitle2: '40\'lık Konteyner',
      heroTitle3: 'Güncel Fiyatlar & Stok',
      heroDescription: '40\' DC, 40\' HC ve 40\' Reefer konteyner seçenekleri\nSıfır ve ikinci el stok mevcuttur.',
    },
    'satilik-20-konteyner': {
      title: 'Satılık 20\'lik Konteyner | Güncel Fiyatlar | PEKCON',
      description: 'Satılık 20\'lik konteyner fiyatları. Sıfır ve ikinci el 20 DC konteynerler stokta mevcut. Hemen teklif alın.',
      heroTitle1: 'Satılık',
      heroTitle2: '20\'lik Konteyner',
      heroTitle3: 'Güncel Fiyatlar & Stok',
      heroDescription: '20\' DC kuru yük konteynerleri\nSıfır ve ikinci el stok mevcuttur.',
    },
    'konteyner-kiralama': {
      title: 'Konteyner Kiralama | Uzun & Kısa Dönem | PEKCON',
      description: 'Uygun fiyatlı konteyner kiralama hizmeti. Depolama, şantiye ve ofis konteynerleri. Uzun ve kısa dönem kiralama seçenekleri.',
      heroTitle1: 'Konteyner',
      heroTitle2: 'Kiralama Hizmeti',
      heroTitle3: 'Uzun & Kısa Dönem',
      heroDescription: 'Depolama, şantiye ve ofis amaçlı\nkonteyner kiralama çözümleri.',
    },
    'reefer-konteyner': {
      title: 'Reefer Konteyner (Soğutmalı) | Satılık & Kiralık | PEKCON',
      description: 'Satılık ve kiralık reefer konteyner seçenekleri. Soğutmalı konteyner fiyatları ve stok durumu için hemen arayın.',
      heroTitle1: 'Reefer Konteyner',
      heroTitle2: 'Soğutmalı Çözümler',
      heroTitle3: 'Satılık & Kiralık',
      heroDescription: 'Soğuk zincir lojistiği için\nprofesyonel reefer konteyner çözümleri.',
    },
    'ikinci-el-konteyner': {
      title: 'İkinci El Konteyner Fiyatları | Uygun & Kaliteli | PEKCON',
      description: 'İkinci el konteyner fiyatları. Yüksek kondisyonda, uygun fiyatlı 20 ve 40 lık konteynerler. Yerinde inceleme imkanı.',
      heroTitle1: 'İkinci El',
      heroTitle2: 'Konteyner Fiyatları',
      heroTitle3: 'Uygun & Yüksek Kondisyon',
      heroDescription: 'Kalite kontrollü ikinci el konteynerler\nYerinde inceleme ve hızlı teslimat.',
    },
    'konteyner-fiyatlari': {
      title: 'Konteyner Fiyatları 2025 | Güncel Liste | PEKCON',
      description: '2025 güncel konteyner fiyatları. 20\'lik, 40\'lık, HC, Reefer ve Flat Rack konteyner fiyat listesi. Ücretsiz teklif alın.',
      heroTitle1: 'Güncel',
      heroTitle2: 'Konteyner Fiyatları',
      heroTitle3: '2025 Fiyat Listesi',
      heroDescription: 'Tüm konteyner tipleri için\ngüncel fiyat listesi ve stok durumu.',
    },
    'yuk-konteyneri': {
      title: 'Yük Konteyneri Satış & Kiralama | PEKCON',
      description: 'Her ebatta yük konteyneri satış ve kiralama. 20, 40, HC ve özel konteyner çeşitleri. Türkiye geneli teslimat.',
      heroTitle1: 'Yük Konteyneri',
      heroTitle2: 'Satış & Kiralama',
      heroTitle3: 'Türkiye Geneli Teslimat',
      heroDescription: 'Her ebatta yük konteyneri\nSatış, kiralama ve nakliye hizmetleri.',
    },
    'depolama-konteyneri': {
      title: 'Depolama Konteyneri | Satılık & Kiralık | PEKCON',
      description: 'Depolama amaçlı konteyner satış ve kiralama. Şantiye, fabrika ve tarla için uygun depolama konteynerleri.',
      heroTitle1: 'Depolama',
      heroTitle2: 'Konteyneri',
      heroTitle3: 'Satılık & Kiralık',
      heroDescription: 'Şantiye, fabrika ve tarla için\ngüvenli depolama konteyner çözümleri.',
    },
  },
  en: {
    'containers-for-sale': {
      title: 'Containers for Sale | Best Prices | PEKCON',
      description: 'New and used shipping containers for sale. 20ft, 40ft, HC and Reefer options available. Get a free quote today.',
      heroTitle1: 'Shipping',
      heroTitle2: 'Containers for Sale',
      heroTitle3: 'Best Prices Guaranteed',
      heroDescription: 'New and used container options\nFind the best solution for your needs.',
    },
    'container-rental': {
      title: 'Container Rental | Short & Long Term | PEKCON',
      description: 'Affordable container rental solutions. Storage, construction site, and office containers. Short and long-term options.',
      heroTitle1: 'Container',
      heroTitle2: 'Rental Solutions',
      heroTitle3: 'Short & Long Term',
      heroDescription: 'Storage, construction, and office\ncontainer rental solutions.',
    },
    'reefer-container': {
      title: 'Reefer Container | Sale & Rental | PEKCON',
      description: 'Refrigerated reefer containers for sale and rent. Cold chain logistics solutions. Contact us for pricing.',
      heroTitle1: 'Reefer Container',
      heroTitle2: 'Cold Chain Solutions',
      heroTitle3: 'Sale & Rental',
      heroDescription: 'Professional refrigerated container\nsolutions for cold chain logistics.',
    },
  },
};

/**
 * Get keyword config from URL search params.
 * Returns null if no matching keyword is found.
 */
export function getKeywordConfig(locale: string, keyword: string | null): KeywordConfig | null {
  if (!keyword) return null;
  const localeMap = KEYWORD_MAP[locale] || KEYWORD_MAP['tr'];
  return localeMap[keyword] || null;
}
