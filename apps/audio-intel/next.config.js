/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Disable ESLint during production builds (matching tracker config)
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Disable TypeScript errors during build (matching tracker config)
    ignoreBuildErrors: true,
  },
  images: {
    // Configure image optimization
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'intel.totalaudiopromo.com',
      },
    ],
    // Ensure local images are optimized correctly
    unoptimized: false,
  },
};

module.exports = nextConfig;
