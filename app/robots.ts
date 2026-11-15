import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: [
          'GPTBot',
          'OAI-SearchBot',
          'ChatGPT-User',
          'PerplexityBot',
          'Perplexity-User',
          'Google-Extended',
          'ClaudeBot',
          'Claude-SearchBot',
          'Claude-User',
        ],
        allow: '/',
        disallow: ['/api/', '/admin', '/studyo'],
      },
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/_next/', '/admin', '/studyo'],
      },
    ],
    sitemap: 'https://pekcon.com/sitemap.xml',
  };
}
