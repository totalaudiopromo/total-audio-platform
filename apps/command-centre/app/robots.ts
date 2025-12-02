/**
 * Phase 9D-2: SEO Robots.txt
 * Configure crawler access rules for Command Centre
 */

import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://command-centre.totalaudiopromo.com';

  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/'],
        disallow: [
          '/api/', // Prevent crawling API routes
          '/_next/', // Prevent crawling Next.js internals
          '/ops-console/*/edit', // Prevent crawling edit pages if they exist
        ],
      },
      {
        userAgent: 'GPTBot', // OpenAI's web crawler
        disallow: ['/'], // Block AI training data collection
      },
      {
        userAgent: 'ChatGPT-User',
        disallow: ['/'],
      },
      {
        userAgent: 'CCBot', // Common Crawl
        disallow: ['/'],
      },
      {
        userAgent: 'anthropic-ai', // Claude's web crawler
        disallow: ['/'],
      },
      {
        userAgent: 'Claude-Web',
        disallow: ['/'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
