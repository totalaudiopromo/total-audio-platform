import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://intel.totalaudiopromo.com'
  const now = new Date()

  // Main pages
  const mainRoutes = [
    { path: '', priority: 1.0, changeFreq: 'weekly' as const },
    { path: '/pricing', priority: 0.9, changeFreq: 'weekly' as const },
    { path: '/beta', priority: 0.9, changeFreq: 'weekly' as const },
    { path: '/demo', priority: 0.8, changeFreq: 'monthly' as const },
    { path: '/case-studies', priority: 0.8, changeFreq: 'monthly' as const },
    { path: '/about', priority: 0.7, changeFreq: 'monthly' as const },
  ]

  // Legal pages
  const legalRoutes = [
    { path: '/privacy', priority: 0.5, changeFreq: 'monthly' as const },
    { path: '/cookies', priority: 0.5, changeFreq: 'monthly' as const },
    { path: '/terms', priority: 0.5, changeFreq: 'monthly' as const },
  ]

  // Blog posts (all SEO-focused case studies)
  const blogRoutes = [
    '/blog',
    '/blog/bbc-radio-1-contact-enrichment',
    '/blog/bbc-radio-1xtra-contact-enrichment',
    '/blog/bbc-radio-2-contact-enrichment',
    '/blog/bbc-radio-6-music-contact-enrichment',
    '/blog/spotify-editorial-playlist-contacts',
    '/blog/apple-music-editorial-contacts',
    '/blog/kerrang-radio-contact-enrichment',
    '/blog/absolute-radio-contact-enrichment',
    '/blog/music-contact-enrichment-guide',
    '/blog/radio-promotion-tips',
    '/blog/playlist-promotion-mistakes',
    '/blog/music-industry-contacts',
  ].map(path => ({ path, priority: 0.8, changeFreq: 'monthly' as const }))

  const allRoutes = [...mainRoutes, ...legalRoutes, ...blogRoutes]

  return allRoutes.map((route): MetadataRoute.Sitemap[0] => ({
    url: `${baseUrl}${route.path}`,
    lastModified: now,
    changeFrequency: route.changeFreq,
    priority: route.priority,
  }))
}


