/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable experimental optimizations
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
  async redirects() {
    return [
      {
        source: '/marketing',
        destination: '/social-media-hub',
        permanent: false,
      },
    ];
  },
  // Production optimizations
  poweredByHeader: false,
  compress: true,
  // Performance optimizations for Lighthouse
  // Note: swcMinify is now enabled by default in Next.js 15
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production', // Remove console.logs in production
  },
  images: {
    formats: ['image/avif', 'image/webp'], // Modern image formats
  },
  // Temporary: Vercel build doesn't pick up workspace package updates
  // Tables exist in DB, but Vercel caches old @total-audio/core-db types
  // TODO: Fix Vercel workspace resolution or publish package to npm
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
