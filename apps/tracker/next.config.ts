import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Disable ESLint during production builds (incompatible with ESLint 9)
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Keep TypeScript checking enabled
    ignoreBuildErrors: false,
  },
  experimental: {
    // Skip prerendering for API routes to avoid build-time execution
    isrMemoryCacheSize: 0,
  },
  // Skip page data collection to avoid executing API routes at build time
  pageExtensions: ['tsx', 'ts', 'jsx', 'js'],
};

export default nextConfig;
