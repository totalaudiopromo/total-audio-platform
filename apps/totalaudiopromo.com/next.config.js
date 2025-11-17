/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: [
    '@total-audio/cis-core',
    '@total-audio/cis-generators',
    '@total-audio/cis-ui',
    '@total-audio/cis-canvases',
    '@total-audio/cis-exporter',
    '@total-audio/cis-brandkit',
  ],
};

module.exports = nextConfig;
