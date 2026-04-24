import JsonLd from './JsonLd';

const PAGE_NAMES: Record<string, { tr: string; en: string }> = {
  hakkimizda: { tr: 'Hakkımızda', en: 'About Us' },
  hizmetlerimiz: { tr: 'Hizmetlerimiz', en: 'Our Services' },
  iletisim: { tr: 'İletişim', en: 'Contact' },
  konteynerler: { tr: 'Konteynerler', en: 'Containers' },
  'teklif-al': { tr: 'Teklif Al', en: 'Get a Quote' },
  'maliyet-hesaplayici': { tr: 'Maliyet Hesaplayıcı', en: 'Cost Calculator' },
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
        item: `${baseUrl}/${locale}/${slug}`,
      },
    ],
  };

  return <JsonLd data={schema} />;
}
