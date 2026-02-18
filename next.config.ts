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
  },
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/en/about',
        destination: '/en/hakkimizda',
      },
      {
        source: '/en/services',
        destination: '/en/hizmetlerimiz',
      },
      {
        source: '/en/containers',
        destination: '/en/konteynerlar',
      },
      {
        source: '/en/contact',
        destination: '/en/iletisim',
      },
      {
        source: '/en/quote',
        destination: '/en/teklif-al',
      },
    ];
  },
};

export default nextConfig;
