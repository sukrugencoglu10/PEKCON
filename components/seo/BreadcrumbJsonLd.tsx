import JsonLd from './JsonLd';

const PAGE_NAMES: Record<string, { tr: string; en: string }> = {
  hakkimizda: { tr: 'Hakkımızda', en: 'About Us' },
  hizmetlerimiz: { tr: 'Hizmetlerimiz', en: 'Our Services' },
  iletisim: { tr: 'İletişim', en: 'Contact' },
  konteynerler: { tr: 'Konteynerler', en: 'Containers' },
  'satilik-konteyner': { tr: 'Satılık Konteyner', en: 'Satılık Konteyner' },
  'containers-for-sale': { tr: 'Containers for Sale', en: 'Containers for Sale' },
  'teklif-al': { tr: 'Teklif Al', en: 'Get a Quote' },
  'maliyet-hesaplayici': { tr: 'Maliyet Hesaplayıcı', en: 'Cost Calculator' },
};

// EN sayfalarının herkese açık slug'ları (next.config.ts'teki redirect/rewrite'larla aynı).
// TR slug kullanılırsa breadcrumb, 301 yönlendiren bir URL'yi gösteriyordu.
const EN_SLUGS: Record<string, string> = {
  hakkimizda: 'about',
  hizmetlerimiz: 'services',
  iletisim: 'contact',
  konteynerler: 'containers',
  'satilik-konteyner': 'containers-for-sale',
  'teklif-al': 'quote',
  'maliyet-hesaplayici': 'cost-calculator',
};

export default function BreadcrumbJsonLd({
  locale,
  slug,
}: {
  locale: 'tr' | 'en';
  slug: keyof typeof PAGE_NAMES | string;
}) {
  const baseUrl = 'https://pekcon.com';
  const home = locale === 'tr' ? 'Ana Sayfa' : 'Home';
  const page = PAGE_NAMES[slug as keyof typeof PAGE_NAMES];
  const pageName = page ? page[locale] : slug;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: home,
        item: `${baseUrl}/${locale}`,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: pageName,
        item: `${baseUrl}/${locale}/${locale === 'en' ? (EN_SLUGS[slug] ?? slug) : slug}`,
      },
    ],
  };

  return <JsonLd data={schema} />;
}
