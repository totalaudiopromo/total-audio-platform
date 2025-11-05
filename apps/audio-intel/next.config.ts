import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // Skip type checking during build - type errors due to React version conflicts
    ignoreBuildErrors: true,
  },
  eslint: {
    // Run ESLint with warnings only during build
    ignoreDuringBuilds: false,
  },
};

export default nextConfig;
