import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/test',
          '/debug-content',
          '/notion-test',
          '/notion-social',
          '/pdf-test',
          '/pdf-samples',
          '/simple-test',
          '/social-media-demo',
          '/social-media-simple',
          '/uk-social-mobile',
          '/agent-demo',
          '/export-demo',
        ],
      },
    ],
    sitemap: 'https://intel.totalaudiopromo.com/sitemap.xml',
  }
}


