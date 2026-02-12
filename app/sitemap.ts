import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://pekcon.com.tr';
  const locales = ['tr', 'en'];
  const routes = [
    '',
    'hakkimizda',
    'hizmetlerimiz',
    'konteynerlar',
    'iletisim',
    'teklif-al',
  ];

  const urls: MetadataRoute.Sitemap = [];

  locales.forEach((locale) => {
    routes.forEach((route) => {
      const path = route ? `/${route}` : '';
      urls.push({
        url: `${baseUrl}/${locale}${path}`,
        lastModified: new Date(),
        changeFrequency: route === 'teklif-al' ? 'daily' : route === '' ? 'weekly' : 'weekly',
        priority: route === '' ? 1.0 : route === 'teklif-al' ? 0.9 : 0.8,
      });
    });
  });

  return urls;
}
