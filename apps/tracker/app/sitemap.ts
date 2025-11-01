import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://tracker.totalaudiopromo.com';

  // Blog posts
  const blogPosts = [
    'spotify-playlist-campaign-tracking',
    'bbc-radio-1-campaign-tracking',
    'music-pr-campaign-analytics',
    'apple-music-playlist-analytics',
    'bbc-radio-6-music-campaign-analytics',
    'bbc-introducing-campaign-tracking',
    'commercial-radio-campaign-tracking',
    'community-radio-promotion-tracking',
    'blog-campaign-analytics-for-musicians',
    'blog-campaign-analytics-musicians',
    'bandcamp-campaign-tracking',
    'deezer-playlist-campaign-tracking',
    'facebook-music-campaign-tracking',
    'instagram-music-campaign-tracking',
    'soundcloud-campaign-tracking',
    'tiktok-music-campaign-tracking',
    'twitter-music-campaign-tracking',
    'youtube-music-campaign-tracking',
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
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
  ];
}
