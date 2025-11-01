import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://pitch.totalaudiopromo.com';

  // Blog posts - sync with /app/blog/page.tsx
  const blogPosts = [
    'bbc-radio-1-pitch-writing',
    'spotify-playlist-pitch-templates',
    'music-blog-pitch-writing',
    'radio-pitch-benchmarks-2025',
    'bbc-radio-6-music-pitch-writing',
    'apple-music-playlist-pitches',
    'bbc-introducing-pitch-templates',
    'community-radio-pitch-writing',
    'commercial-radio-pitch-templates',
    'music-pr-pitch-writing-guide',
  ];

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/pricing`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    ...blogPosts.map(slug => ({
      url: `${baseUrl}/blog/${slug}`,
      lastModified: new Date('2025-10-06'),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
  ];
}
