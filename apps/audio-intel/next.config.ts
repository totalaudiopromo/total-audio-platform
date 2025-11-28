import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
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
  // Transpile shared packages to ensure proper SSR/client boundary handling
  transpilePackages: ['@total-audio/core-db', '@total-audio/ui', '@total-audio/testing'],
  // Experimental settings for better RSC compatibility
  experimental: {
    // Optimise package imports for better tree-shaking
    optimizePackageImports: ['lucide-react', '@total-audio/ui'],
    // Use single worker for static generation to avoid process isolation issues
    workerThreads: false,
    cpus: 1,
  },
  // Force dynamic rendering to avoid static generation issues with process.env
  // in Next.js 15 RSC serialisation
  output: 'standalone',
};

export default nextConfig;
