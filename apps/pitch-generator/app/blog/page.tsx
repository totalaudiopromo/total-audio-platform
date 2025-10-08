import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Pitch Writing Guides & Music PR Templates | Pitch Generator Blog",
  description: "Industry guides on pitch writing, radio promotion templates, and music PR strategies. Written by working radio promoters with 5+ years BBC Radio 1 experience.",
  keywords: "pitch writing blog, music PR guides, radio pitch templates, playlist pitch tips, BBC Radio 1 pitches",
  alternates: {
    canonical: 'https://pitch.totalaudiopromo.com/blog',
    languages: {
      'en-GB': 'https://pitch.totalaudiopromo.com/blog',
    }
  },
  openGraph: { url: 'https://pitch.totalaudiopromo.com/blog' }
};

const blogPosts = [
  {
    slug: "bbc-radio-1-pitch-writing",
    title: "BBC Radio 1 Pitch Writing: Industry Benchmarks & Success Rates (2025)",
    excerpt: "Write BBC Radio 1 pitches that actually get responses. Get industry benchmarks (11-18% specialist shows), proven templates, and AI-powered insights from real Radio 1 campaigns.",
    author: "Chris Schofield",
    date: "2025-10-06",
    readTime: "10 min read",
    category: "Radio Pitching",
    featured: true
  },
  {
    slug: "spotify-playlist-pitch-templates",
    title: "Spotify Playlist Pitch Templates: Real Response Rates for 2025",
    excerpt: "Stop guessing what works for Spotify playlists. See proven templates (18-28% response rate by genre), curator benchmarks, and exactly what makes playlists respond.",
    author: "Chris Schofield",
    date: "2025-10-06",
    readTime: "8 min read",
    category: "Playlist Pitching",
    featured: false
  },
  {
    slug: "music-blog-pitch-writing",
    title: "Music Blog Pitch Writing: Stop Wasting Time on Generic Templates",
    excerpt: "Write blog pitches that get coverage. Learn what response rates to expect (8-16% by blog tier), proven templates, and which approaches actually work for music blogs.",
    author: "Chris Schofield",
    date: "2025-10-06",
    readTime: "9 min read",
    category: "Blog Pitching",
    featured: false
  },
  {
    slug: "radio-pitch-benchmarks-2025",
    title: "Radio Pitch Benchmarks 2025: Real Response Rates by Station Type",
    excerpt: "Know what to expect from radio pitches. Get benchmarks for BBC (11-18%), commercial (6-12%), community (18-24%), and exactly what drives response rates.",
    author: "Chris Schofield",
    date: "2025-10-06",
    readTime: "9 min read",
    category: "Radio Pitching",
    featured: false
  },
  {
    slug: "bbc-radio-6-music-pitch-writing",
    title: "BBC Radio 6 Music Pitch Writing: Alternative Radio Success Strategies",
    excerpt: "Write pitches for BBC 6 Music that get results. See real benchmarks (8-14% specialist shows), optimal timing, and proven templates for alternative/indie music.",
    author: "Chris Schofield",
    date: "2025-10-06",
    readTime: "9 min read",
    category: "Radio Pitching",
    featured: false
  },
  {
    slug: "apple-music-playlist-pitches",
    title: "Apple Music Playlist Pitches: Editorial vs Algorithmic Strategy",
    excerpt: "Pitch Apple Music playlists effectively. Get editorial benchmarks (6-12% success), algorithmic insights (40-60% reach), and templates that work.",
    author: "Chris Schofield",
    date: "2025-10-06",
    readTime: "8 min read",
    category: "Playlist Pitching",
    featured: false
  },
  {
    slug: "bbc-introducing-pitch-templates",
    title: "BBC Introducing Pitch Templates: Unsigned Artist Radio Success",
    excerpt: "Pitch BBC Introducing effectively. See real success rates (8-12% regional), optimal timing, and proven templates for unsigned artist radio promotion.",
    author: "Chris Schofield",
    date: "2025-10-06",
    readTime: "8 min read",
    category: "Radio Pitching",
    featured: false
  },
  {
    slug: "community-radio-pitch-writing",
    title: "Community Radio Pitch Writing: Local Radio Success Templates",
    excerpt: "Write community radio pitches that get airplay. See real success rates (18-24% local radio), proven templates, and optimal timing for local promotion.",
    author: "Chris Schofield",
    date: "2025-10-06",
    readTime: "7 min read",
    category: "Radio Pitching",
    featured: false
  },
  {
    slug: "commercial-radio-pitch-templates",
    title: "Commercial Radio Pitch Templates: Industry Benchmarks & Success Rates",
    excerpt: "Pitch commercial radio effectively. Get industry benchmarks (6-12% by station type), proven templates, and strategies for commercial radio success.",
    author: "Chris Schofield",
    date: "2025-10-06",
    readTime: "9 min read",
    category: "Radio Pitching",
    featured: false
  },
  {
    slug: "music-pr-pitch-writing-guide",
    title: "Music PR Pitch Writing Guide: Templates That Actually Get Coverage",
    excerpt: "Write PR pitches that get responses. Learn expected response rates, proven templates, and which approaches work for music PR campaigns.",
    author: "Chris Schofield",
    date: "2025-10-06",
    readTime: "11 min read",
    category: "PR Pitching",
    featured: false
  }
];

function getCategoryBadgeClasses(category: string) {
  switch (category) {
    case "Playlist Pitching":
      return "bg-purple-100 text-purple-800";
    case "Radio Pitching":
      return "bg-indigo-100 text-indigo-800";
    case "Blog Pitching":
      return "bg-green-100 text-green-800";
    case "PR Pitching":
      return "bg-blue-100 text-blue-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

export default function BlogIndex() {
  const featuredPost = blogPosts.find(post => post.featured);
  const otherPosts = blogPosts.filter(post => !post.featured);

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-6xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-6">
            Pitch Writing Insights
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Industry guides on pitch writing, benchmarks, and PR strategies.
            Written by working radio promoters with real BBC Radio 1 experience.
          </p>
        </div>

        {/* Featured Post */}
        {featuredPost && (
          <div className="mb-16">
            <div className="bg-white rounded-2xl border-4 border-purple-500 shadow-lg overflow-hidden">
              <div className="p-8 md:p-12">
                <div className="flex items-center gap-3 mb-4">
                  <span className={`${getCategoryBadgeClasses(featuredPost.category)} px-3 py-1 rounded-full text-sm font-bold`}>
                    {featuredPost.category}
                  </span>
                  <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-bold">
                    Featured
                  </span>
                </div>

                <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">
                  <Link
                    href={`/blog/${featuredPost.slug}`}
                    className="hover:text-purple-600 transition-colors"
                  >
                    {featuredPost.title}
                  </Link>
                </h2>

                <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                  {featuredPost.excerpt}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span className="font-semibold">{featuredPost.author}</span>
                    <span>•</span>
                    <span>{featuredPost.readTime}</span>
                  </div>

                  <Link
                    href={`/blog/${featuredPost.slug}`}
                    className="bg-purple-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-purple-700 transition-colors shadow-md"
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
            {otherPosts.map((post) => (
              <article key={post.slug} className="bg-white rounded-xl border-2 border-gray-200 hover:border-purple-500 hover:shadow-lg transition-all overflow-hidden">
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`${getCategoryBadgeClasses(post.category)} px-2 py-1 rounded text-xs font-semibold`}>
                      {post.category}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    <Link
                      href={`/blog/${post.slug}`}
                      className="hover:text-purple-600 transition-colors"
                    >
                      {post.title}
                    </Link>
                  </h3>

                  <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                    {post.excerpt.length > 120 ? `${post.excerpt.substring(0, 120)}...` : post.excerpt}
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
