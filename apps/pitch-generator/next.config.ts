import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },

  // Bundle optimization
  compiler: {
    removeConsole: process.env.NODE_ENV === "production" ? {
      exclude: ["error", "warn"],
    } : false,
  },

  // Image optimization
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },

  // Experimental features for better performance
  experimental: {
    optimizePackageImports: [
      "lucide-react",
      "@anthropic-ai/sdk",
      "@supabase/supabase-js",
    ],
  },

  // Production optimizations
  poweredByHeader: false,
  compress: true,

  // Webpack bundle analyzer (optional - enable when needed)
  webpack: (config, { isServer }) => {
    // Only run on client-side builds
    if (!isServer) {
      // Tree shaking optimizations
      config.optimization = {
        ...config.optimization,
        usedExports: true,
        sideEffects: true,
      };
    }

    return config;
  },
};

export default nextConfig;


