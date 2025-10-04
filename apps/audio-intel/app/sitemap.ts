import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://intel.totalaudiopromo.com'
  const now = new Date()

  const routes = [
    '',
    '/pricing',
    '/blog',
    '/demo',
    '/documentation',
    '/about',
    '/beta',
    '/api',
    '/blog/music-contact-enrichment-guide',
    '/blog/radio-promotion-tips',
    '/blog/playlist-promotion-mistakes',
    '/blog/music-industry-contacts',
  ]

  return routes.map((path): MetadataRoute.Sitemap[0] => ({
    url: `${baseUrl}${path}`,
    lastModified: now,
    changeFrequency: path === '' ? 'weekly' : 'weekly',
    priority: path === '' ? 1 : 0.7,
  }))
}


