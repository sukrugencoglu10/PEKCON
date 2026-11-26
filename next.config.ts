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
  experimental: {
    // Tailwind CSS'i (~15 KB) HTML'e göm: ayrı CSS dosyası render'ı ~660 ms bloke ediyordu
    inlineCss: true,
  },
  poweredByHeader: false,
  reactStrictMode: true,
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
    ];
  },
  async redirects() {
    return [
      // EN sayfaları için TR slug → EN slug (301 kalıcı yönlendirme)
      { source: '/en/hakkimizda',   destination: '/en/about',      permanent: true },
      { source: '/en/iletisim',     destination: '/en/contact',    permanent: true },
      { source: '/en/konteynerler', destination: '/en/containers', permanent: true },
      { source: '/en/hizmetlerimiz',destination: '/en/services',   permanent: true },
      { source: '/en/teklif-al',    destination: '/en/quote',      permanent: true },
      { source: '/en/maliyet-hesaplayici', destination: '/en/cost-calculator', permanent: true },
      { source: '/en/satilik-konteyner', destination: '/en/containers-for-sale', permanent: true },
      // Eski container.pekcon.com sitesinden gelen indeksli /en.html → EN ana sayfa
      { source: '/en.html', destination: '/en', permanent: true },
    ];
  },
  async rewrites() {
    return [
      // EN slug'larını gerçek dosya yollarına yönlendir (iç rewrite)
      { source: '/en/about',      destination: '/en/hakkimizda' },
      { source: '/en/services',   destination: '/en/hizmetlerimiz' },
      { source: '/en/containers', destination: '/en/konteynerler' },
      { source: '/en/contact',    destination: '/en/iletisim' },
      { source: '/en/quote',      destination: '/en/teklif-al' },
      { source: '/en/cost-calculator', destination: '/en/maliyet-hesaplayici' },
      { source: '/en/containers-for-sale', destination: '/en/satilik-konteyner' },
    ];
  },
};

export default nextConfig;
