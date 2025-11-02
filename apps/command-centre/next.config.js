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
  swcMinify: true, // Use SWC for faster minification
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production', // Remove console.logs in production
  },
  images: {
    formats: ['image/avif', 'image/webp'], // Modern image formats
  },
};

module.exports = nextConfig;
