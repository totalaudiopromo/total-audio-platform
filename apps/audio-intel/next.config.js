/** @type {import('next').NextConfig} */
const nextConfig = {
  // TypeScript and ESLint enabled - all checks passing
  
  // Transpile workspace packages (monorepo support)
  transpilePackages: ['@total-audio/ui'],
}

module.exports = nextConfig