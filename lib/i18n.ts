export const translations = {
  tr: {
    // Hero Section
    hero: {
      title1: 'Küresel Lojistikte',
      title2: 'Güvenilir Çözüm',
      title3: 'Ortağınız',
      description: '25 yılı aşkın tecrübe ile konteyner tedariği ve uluslararası taşımacılık hizmetlerinde lider',
      cta1: 'Hızlı Teklif Al',
      cta2: 'Hizmetlerimizi Keşfedin',
    },
    // Stats Section
    stats: {
      title: 'Rakamlarla PEKCON',
      experience: 'Yıl Tecrübe',
      countries: 'Ülkeye Hizmet',
      containers: 'Konteyner/Yıl',
      satisfaction: 'Müşteri Memnuniyeti',
    },
    // Services
    services: {
      title: 'Hizmetlerimiz',
      subtitle: 'Küresel lojistik ihtiyaçlarınız için eksiksiz çözümler',
      sea: {
        title: 'Denizyolu Taşımacılık',
        description: 'FCL ve LCL taşımacılık ile küresel ticaret ağınızı güçlendirin',
      },
      land: {
        title: 'Karayolu Taşımacılık',
        description: 'Avrupa ve Asya arasında hızlı ve güvenli karayolu lojistiği',
      },
      air: {
        title: 'Havayolu Taşımacılık',
        description: 'Acil sevkiyatlarınız için ekspres havayolu çözümleri',
      },
      customs: {
        title: 'Gümrük Hizmetleri',
        description: 'Profesyonel gümrük danışmanlığı ve işlem takibi',
      },
    },
    // Containers
    containers: {
      title: 'Konteyner Çözümleri',
      subtitle: 'İhtiyacınıza uygun konteyner seçenekleri',
      saleRent: 'Satış & Kiralama',
      fromPrice: 'başlayan fiyatlarla',
    },
    // CTA Section
    cta: {
      title: 'Lojistik İhtiyaçlarınız İçin Hemen Teklif Alın',
      description: 'Uzman ekibimiz size en uygun çözümü sunmak için hazır',
      button: 'Ücretsiz Teklif Al',
    },
    // Footer
    footer: {
      services: 'Hizmetlerimiz',
      corporate: 'Kurumsal',
      contact: 'İletişim',
      seaTransport: 'Denizyolu Taşımacılık',
      landTransport: 'Karayolu Taşımacılık',
      airTransport: 'Havayolu Taşımacılık',
      containerSales: 'Konteyner Satış & Kiralama',
      about: 'Hakkımızda',
      contactPage: 'İletişim',
      getQuote: 'Teklif Al',
      copyright: 'PEKCON Container & Logistics. Tüm hakları saklıdır.',
    },
    // Header
    nav: {
      home: 'Ana Sayfa',
      about: 'Hakkımızda',
      services: 'Hizmetlerimiz',
      containers: 'Konteynerlar',
      contact: 'İletişim',
      quote: 'Teklif Al',
    },
  },
  en: {
    // Hero Section
    hero: {
      title1: 'Your Trusted',
      title2: 'Global Logistics',
      title3: 'Partner',
      description: 'Leading in container supply and international transportation services with over 25 years of experience',
      cta1: 'Get Quick Quote',
      cta2: 'Explore Our Services',
    },
    // Stats Section
    stats: {
      title: 'PEKCON in Numbers',
      experience: 'Years of Experience',
      countries: 'Countries Served',
      containers: 'Containers/Year',
      satisfaction: 'Customer Satisfaction',
    },
    // Services
    services: {
      title: 'Our Services',
      subtitle: 'Complete solutions for your global logistics needs',
      sea: {
        title: 'Sea Freight',
        description: 'Strengthen your global trade network with FCL and LCL transportation',
      },
      land: {
        title: 'Land Transport',
        description: 'Fast and secure land logistics between Europe and Asia',
      },
      air: {
        title: 'Air Freight',
        description: 'Express air freight solutions for your urgent shipments',
      },
      customs: {
        title: 'Customs Services',
        description: 'Professional customs consultancy and process tracking',
      },
    },
    // Containers
    containers: {
      title: 'Container Solutions',
      subtitle: 'Container options suited to your needs',
      saleRent: 'Sale & Rental',
      fromPrice: 'starting from',
    },
    // CTA Section
    cta: {
      title: 'Get a Quote for Your Logistics Needs Today',
      description: 'Our expert team is ready to provide you with the most suitable solution',
      button: 'Get Free Quote',
    },
    // Footer
    footer: {
      services: 'Our Services',
      corporate: 'Corporate',
      contact: 'Contact',
      seaTransport: 'Sea Freight',
      landTransport: 'Land Transport',
      airTransport: 'Air Freight',
      containerSales: 'Container Sale & Rental',
      about: 'About Us',
      contactPage: 'Contact',
      getQuote: 'Get Quote',
      copyright: 'PEKCON Container & Logistics. All rights reserved.',
    },
    // Header
    nav: {
      home: 'Home',
      about: 'About Us',
      services: 'Services',
      containers: 'Containers',
      contact: 'Contact',
      quote: 'Get Quote',
    },
  },
};

export type Locale = 'tr' | 'en';

export function getTranslations(locale: Locale) {
  return translations[locale] || translations.tr;
}
