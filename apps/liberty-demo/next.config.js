/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@total-audio/ui'],
  eslint: {
    // Allow warnings but still catch errors
    ignoreDuringBuilds: true,
  },
  // Exclude mermaid from server-side bundling - it accesses localStorage at module load
  serverExternalPackages: ['mermaid'],
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  // Prevent infinite compilation loops and exclude mermaid from SSR
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

    // Exclude mermaid from server-side bundling completely
    if (isServer) {
      config.externals = config.externals || [];
      config.externals.push('mermaid');
    }

    return config;
  },
};

module.exports = nextConfig;
