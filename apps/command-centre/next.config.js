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
};

module.exports = nextConfig;
