import { MetadataRoute } from 'next';

const trRoutes = [
  { slug: '',                    changeFreq: 'weekly' as const,  priority: 1.0 },
  { slug: 'hakkimizda',          changeFreq: 'weekly' as const,  priority: 0.8 },
  { slug: 'hizmetlerimiz',       changeFreq: 'weekly' as const,  priority: 0.9 },
  { slug: 'konteynerler',        changeFreq: 'weekly' as const,  priority: 0.8 },
  { slug: 'iletisim',            changeFreq: 'weekly' as const,  priority: 0.8 },
  { slug: 'teklif-al',           changeFreq: 'daily'  as const,  priority: 0.9 },
  { slug: 'maliyet-hesaplayici', changeFreq: 'monthly' as const, priority: 0.7 },
];

const enRoutes = [
  { slug: '',          changeFreq: 'weekly' as const, priority: 1.0 },
  { slug: 'about',     changeFreq: 'weekly' as const, priority: 0.8 },
  { slug: 'services',  changeFreq: 'weekly' as const, priority: 0.8 },
  { slug: 'containers',changeFreq: 'weekly' as const, priority: 0.8 },
  { slug: 'contact',   changeFreq: 'weekly' as const, priority: 0.8 },
  { slug: 'quote',     changeFreq: 'daily' as const,  priority: 0.9 },
  { slug: 'cost-calculator', changeFreq: 'monthly' as const, priority: 0.7 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://pekcon.com';
  const lastModified = new Date();
  const urls: MetadataRoute.Sitemap = [];

  trRoutes.forEach(({ slug, changeFreq, priority }) => {
    urls.push({
      url: `${baseUrl}/tr${slug ? `/${slug}` : ''}`,
      lastModified,
      changeFrequency: changeFreq,
      priority,
    });
  });

  enRoutes.forEach(({ slug, changeFreq, priority }) => {
    urls.push({
      url: `${baseUrl}/en${slug ? `/${slug}` : ''}`,
      lastModified,
      changeFrequency: changeFreq,
      priority,
    });
  });

  return urls;
}
