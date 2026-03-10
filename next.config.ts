import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000, // 1 year cache for optimized images
  },
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
  async redirects() {
    return [
      // EN sayfaları için TR slug → EN slug (301 kalıcı yönlendirme)
      { source: '/en/hakkimizda',   destination: '/en/about',      permanent: true },
      { source: '/en/iletisim',     destination: '/en/contact',    permanent: true },
      { source: '/en/konteynerlar', destination: '/en/containers', permanent: true },
      { source: '/en/hizmetlerimiz',destination: '/en/services',   permanent: true },
      { source: '/en/teklif-al',    destination: '/en/quote',      permanent: true },
    ];
  },
  async rewrites() {
    return [
      // EN slug'larını gerçek dosya yollarına yönlendir (iç rewrite)
      { source: '/en/about',      destination: '/en/hakkimizda' },
      { source: '/en/services',   destination: '/en/hizmetlerimiz' },
      { source: '/en/containers', destination: '/en/konteynerlar' },
      { source: '/en/contact',    destination: '/en/iletisim' },
      { source: '/en/quote',      destination: '/en/teklif-al' },
    ];
  },
};

export default nextConfig;
