import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Music Industry Insights & Contact Enrichment Guides | Audio Intel Blog',
  description:
    'Industry guides on music promotion, contact enrichment, and campaign strategies. Written by working radio promoters with 5+ years experience.',
  keywords:
    'music promotion blog, contact enrichment guides, radio promotion tips, playlist submission strategies',
  alternates: {
    canonical: 'https://intel.totalaudiopromo.com/blog',
    languages: {
      'en-GB': 'https://intel.totalaudiopromo.com/blog',
    },
  },
  openGraph: { url: 'https://intel.totalaudiopromo.com/blog' },
};

const blogPosts = [
  {
    slug: 'bbc-radio-6-music-contact-enrichment',
    title: 'BBC Radio 6 Music Contact Enrichment: 18 Hours to 2 Minutes',
    excerpt:
      'Full walk-through of rebuilding a BBC Radio 6 Music pitching list with Audio Intel, cutting research time from an entire weekend to a two minute enrichment run.',
    author: 'Chris Schofield',
    date: '2025-10-12',
    readTime: '10 min read',
    category: 'Case Study',
    featured: true,
  },
  {
    slug: 'bbc-radio-1-contact-enrichment',
    title: 'BBC Radio 1 Contact Enrichment: From 18 Hours to 2 Minutes',
    excerpt:
      'How Audio Intel transformed BBC Radio 1 contact research from a weekend-long nightmare into a 2-minute automated workflow.',
    author: 'Chris Schofield',
    date: '2025-09-15',
    readTime: '10 min read',
    category: 'Case Study',
    featured: false,
  },
  {
    slug: 'bbc-radio-1xtra-contact-enrichment',
    title: 'BBC Radio 1Xtra Contact Enrichment: Urban Music Radio Contacts',
    excerpt:
      'Build comprehensive BBC Radio 1Xtra contact lists in minutes. Get DJ profiles, submission guidelines, and pitch-ready intelligence for urban music promotion.',
    author: 'Chris Schofield',
    date: '2025-10-13',
    readTime: '9 min read',
    category: 'Radio Contacts',
    featured: false,
  },
  {
    slug: 'bbc-radio-2-contact-enrichment',
    title: 'BBC Radio 2 Contact Enrichment: Mainstream Radio Database Building',
    excerpt:
      'Enrich BBC Radio 2 contacts with detailed presenter profiles, show genres, submission windows, and pitch strategies for mainstream radio.',
    author: 'Chris Schofield',
    date: '2025-10-13',
    readTime: '8 min read',
    category: 'Radio Contacts',
    featured: false,
  },
  {
    slug: 'kerrang-radio-contact-enrichment',
    title: 'Kerrang Radio Contact Enrichment: Rock & Metal Radio Contacts',
    excerpt:
      'Build targeted Kerrang Radio contact databases with Audio Intel. Get presenter profiles, submission guidelines, and rock music pitch strategies.',
    author: 'Chris Schofield',
    date: '2025-10-13',
    readTime: '8 min read',
    category: 'Radio Contacts',
    featured: false,
  },
  {
    slug: 'absolute-radio-contact-enrichment',
    title: 'Absolute Radio Contact Enrichment: Commercial Radio Database',
    excerpt:
      'Enrich Absolute Radio contacts across all stations (80s, 90s, 00s, Classic Rock). Get presenter profiles and submission strategies.',
    author: 'Chris Schofield',
    date: '2025-10-13',
    readTime: '8 min read',
    category: 'Radio Contacts',
    featured: false,
  },
  {
    slug: 'spotify-editorial-playlist-contacts',
    title: 'Spotify Editorial Playlist Contacts: Curator Enrichment Guide',
    excerpt:
      'Build Spotify editorial playlist contact databases with Audio Intel. Get curator profiles, submission guidelines, and playlist pitch strategies.',
    author: 'Chris Schofield',
    date: '2025-10-13',
    readTime: '9 min read',
    category: 'Playlist Contacts',
    featured: false,
  },
  {
    slug: 'apple-music-editorial-contacts',
    title: 'Apple Music Editorial Contacts: Platform Curator Database',
    excerpt:
      'Enrich Apple Music editorial contacts with detailed curator profiles, submission guidelines, and playlist pitch strategies for platform success.',
    author: 'Chris Schofield',
    date: '2025-10-13',
    readTime: '8 min read',
    category: 'Playlist Contacts',
    featured: false,
  },
  {
    slug: 'music-contact-enrichment-guide',
    title: 'What is Music Contact Enrichment? Complete Guide (2025)',
    excerpt:
      'Everything you need to know about music contact enrichment. Learn how to transform basic email lists into comprehensive, pitch-ready contact databases.',
    author: 'Chris Schofield',
    date: '2025-08-30',
    readTime: '8 min read',
    category: 'Contact Enrichment',
    featured: false,
  },
  {
    slug: 'radio-promotion-tips',
    title: 'Radio Promotion Tips That Actually Work in 2025',
    excerpt:
      '5+ years of radio promotion experience distilled into actionable tips. Learn what actually works for getting airplay in 2025 from a working radio promoter.',
    author: 'Chris Schofield',
    date: '2025-08-30',
    readTime: '6 min read',
    category: 'Radio Promotion',
    featured: false,
  },
  {
    slug: 'playlist-promotion-mistakes',
    title: '5 Playlist Promotion Mistakes Killing Your Music Career',
    excerpt:
      "Stop making these deadly playlist promotion mistakes. Learn what actually works from someone who's seen hundreds of failed campaigns.",
    author: 'Chris Schofield',
    date: '2025-08-30',
    readTime: '7 min read',
    category: 'Playlist Promotion',
    featured: false,
  },
  {
    slug: 'music-industry-contacts',
    title: 'How to Find Music Industry Contacts (Without Wasting Hours)',
    excerpt:
      'Stop wasting hours hunting for music industry contacts. Learn the exact methods working promoters use to find radio DJs, playlist curators, and music bloggers.',
    author: 'Chris Schofield',
    date: '2025-08-30',
    readTime: '9 min read',
    category: 'Contact Research',
    featured: false,
  },
];

function getCategoryBadgeClasses(category: string) {
  switch (category) {
    case 'Contact Enrichment':
      return 'bg-blue-100 text-blue-800';
    case 'Radio Promotion':
      return 'bg-green-100 text-green-800';
    case 'Playlist Promotion':
      return 'bg-blue-100 text-blue-800';
    case 'Contact Research':
      return 'bg-blue-100 text-blue-800';
    case 'Case Study':
      return 'bg-yellow-100 text-yellow-800';
    case 'Radio Contacts':
      return 'bg-blue-100 text-blue-800';
    case 'Playlist Contacts':
      return 'bg-blue-100 text-blue-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

export default function BlogIndex() {
  const featuredPost = blogPosts.find(post => post.featured);
  const otherPosts = blogPosts.filter(post => !post.featured);

  return (
    <div className="min-h-screen bg-white">
      <main className="max-w-6xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-6">
            Music Industry Insights
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Industry guides on contact enrichment, music promotion strategies, and campaign
            optimization. Written by working radio promoters with real-world experience.
          </p>
        </div>

        {/* Featured Post */}
        {featuredPost && (
          <div className="mb-16">
            <div className="bg-white rounded-2xl border-4 border-blue-600 shadow-lg overflow-hidden">
              <div className="p-8 md:p-12">
                <div className="flex items-center gap-3 mb-4">
                  <span
                    className={`${getCategoryBadgeClasses(featuredPost.category)} px-3 py-1 rounded-full text-sm font-bold`}
                  >
                    {featuredPost.category}
                  </span>
                  <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-bold">
                    Featured
                  </span>
                </div>

                <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">
                  <Link
                    href={`/blog/${featuredPost.slug}`}
                    className="hover:text-blue-600 transition-colors"
                  >
                    {featuredPost.title}
                  </Link>
                </h2>

                <p className="text-lg text-gray-600 mb-6 leading-relaxed">{featuredPost.excerpt}</p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span className="font-semibold">{featuredPost.author}</span>
                    <span>•</span>
                    <span>{featuredPost.readTime}</span>
                  </div>

                  <Link
                    href={`/blog/${featuredPost.slug}`}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors shadow-md"
                  >
                    Read Guide →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Other Posts */}
        <div>
          <h2 className="text-3xl font-black text-gray-900 mb-8">More Guides</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {otherPosts.map(post => (
              <article
                key={post.slug}
                className="bg-white rounded-xl border-2 border-gray-200 hover:border-blue-600 hover:shadow-lg transition-all overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span
                      className={`${getCategoryBadgeClasses(post.category)} px-2 py-1 rounded text-xs font-semibold`}
                    >
                      {post.category}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    <Link
                      href={`/blog/${post.slug}`}
                      className="hover:text-blue-600 transition-colors"
                    >
                      {post.title}
                    </Link>
                  </h3>

                  <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                    {post.excerpt.length > 120
                      ? `${post.excerpt.substring(0, 120)}...`
                      : post.excerpt}
                  </p>

                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{post.author}</span>
                    <span>{post.readTime}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
