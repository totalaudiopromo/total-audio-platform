/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  transpilePackages: [
    '@total-audio/fusion-layer',
    '@total-audio/intelligence-navigator',
    '@total-audio/correlation-engine',
    '@total-audio/trajectory-lens',
    '@total-audio/automations-drawer',
    '@total-audio/identity-kernel',
    '@total-audio/coverage-fusion',
    '@total-audio/workspace-benchmarking',
    '@total-audio/signal-threads',
    '@total-audio/dashboard-modes',
  ],
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  webpack: (config, { isServer, dev }) => {
    // Prevent infinite compilation loops in development
    if (dev && !isServer) {
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
        ignored: ['**/node_modules/**', '**/.next/**', '**/.git/**'],
      };
    }
    return config;
  },
};

module.exports = nextConfig;
