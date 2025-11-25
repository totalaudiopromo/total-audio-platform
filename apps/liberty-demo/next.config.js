/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@total-audio/ui', '@total-audio/core-db'],
  eslint: {
    // Allow warnings but still catch errors
    ignoreDuringBuilds: true,
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  // Prevent infinite compilation loops
  webpack: (config, { isServer, dev }) => {
    if (dev && !isServer) {
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 500,
        ignored: [
          '**/node_modules/**',
          '**/.next/**',
          '**/.git/**',
          '**/dist/**',
          '**/build/**',
          '**/tsconfig.tsbuildinfo',
        ],
      };
    }
    return config;
  },
};

module.exports = nextConfig;
