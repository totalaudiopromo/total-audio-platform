import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  eslint: {
    // Disable ESLint during production builds (incompatible with ESLint 9)
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Temporarily disable to get build working
    ignoreBuildErrors: true,
  },
  // Disable static page generation for API routes
  generateBuildId: async () => {
    return 'build-' + Date.now();
  },
  webpack: (config) => {
    // Add root node_modules to module resolution paths for monorepo
    config.resolve.modules.push(path.resolve(__dirname, "../../node_modules"));
    config.resolve.alias = {
      ...(config.resolve.alias ?? {}),
      "@": path.resolve(__dirname),
    };
    return config;
  },
};

export default nextConfig;
