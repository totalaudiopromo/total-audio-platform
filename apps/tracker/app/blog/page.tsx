import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Campaign Tracking Insights & Music Promotion Guides | Tracker Blog",
  description: "Industry guides on campaign tracking, music promotion benchmarks, and analytics strategies. Written by working radio promoters with 5+ years experience.",
  keywords: "campaign tracking blog, music promotion guides, radio campaign analytics, playlist tracking tips, campaign benchmarks",
  alternates: {
    canonical: 'https://tracker.totalaudiopromo.com/blog',
    languages: {
      'en-GB': 'https://tracker.totalaudiopromo.com/blog',
    }
  },
  openGraph: { url: 'https://tracker.totalaudiopromo.com/blog' }
};

const blogPosts = [
  {
    slug: "spotify-playlist-campaign-tracking",
    title: "Spotify Playlist Campaign Tracking: Real Benchmarks for 2025",
    excerpt: "Stop guessing if your Spotify campaigns are working. See industry benchmarks (18-28% by genre), success rates, and exactly what metrics matter for playlist campaigns.",
    author: "Chris Schofield",
    date: "2025-10-05",
    readTime: "8 min read",
    category: "Playlist Tracking",
    featured: true
  },
  {
    slug: "bbc-radio-1-campaign-tracking",
    title: "BBC Radio 1 Campaign Tracking: Industry Benchmarks & Success Rates",
    excerpt: "Track your BBC Radio 1 campaigns properly. Get industry benchmarks (11-18% specialist shows), success rates by show type, and AI-powered insights showing exactly what works.",
    author: "Chris Schofield",
    date: "2025-10-05",
    readTime: "10 min read",
    category: "Radio Tracking",
    featured: false
  },
  {
    slug: "music-pr-campaign-analytics",
    title: "Music PR Campaign Analytics: Stop Wasting Time on Guesswork",
    excerpt: "Measure your music PR campaigns properly. Learn what response rates to expect (8-16% by blog tier), how to track blog coverage, and which metrics actually matter.",
    author: "Chris Schofield",
    date: "2025-10-05",
    readTime: "9 min read",
    category: "PR Tracking",
    featured: false
  },
  {
    slug: "apple-music-playlist-analytics",
    title: "Apple Music Playlist Analytics: Track Campaign Success Rates",
    excerpt: "Track your Apple Music campaigns properly. Get editorial benchmarks (6-12% success), algorithmic playlist insights (40-60% reach), and AI-powered campaign intelligence.",
    author: "Chris Schofield",
    date: "2025-10-05",
    readTime: "8 min read",
    category: "Playlist Tracking",
    featured: false
  },
  {
    slug: "bbc-radio-6-music-campaign-analytics",
    title: "BBC Radio 6 Music Campaign Analytics: Track Alternative Radio Success",
    excerpt: "Track BBC Radio 6 Music campaigns with industry benchmarks. See real success rates (8-14% specialist shows), optimal timing, and AI insights for alternative/indie radio promotion.",
    author: "Chris Schofield",
    date: "2025-10-05",
    readTime: "9 min read",
    category: "Radio Tracking",
    featured: false
  },
  {
    slug: "bbc-introducing-campaign-tracking",
    title: "BBC Introducing Campaign Tracking: Track Unsigned Artist Success",
    excerpt: "Track BBC Introducing campaigns with industry benchmarks. See real success rates (8-12% regional), optimal timing, and AI insights for unsigned artist radio promotion.",
    author: "Chris Schofield",
    date: "2025-10-05",
    readTime: "8 min read",
    category: "Radio Tracking",
    featured: false
  },
  {
    slug: "community-radio-promotion-tracking",
    title: "Community Radio Promotion Tracking: Local Radio Campaign Analytics",
    excerpt: "Track community radio campaigns with industry benchmarks. See real success rates (18-24% local radio), optimal timing, and AI insights for local radio promotion.",
    author: "Chris Schofield",
    date: "2025-10-05",
    readTime: "7 min read",
    category: "Radio Tracking",
    featured: false
  },
  {
    slug: "commercial-radio-campaign-tracking",
    title: "Commercial Radio Campaign Tracking: Industry Benchmarks & Success Rates (2025)",
    excerpt: "Track commercial radio campaigns with AI-powered insights. Get industry benchmarks, success rates by station type, and actionable intelligence for commercial radio promotion.",
    author: "Chris Schofield",
    date: "2025-10-05",
    readTime: "9 min read",
    category: "Radio Tracking",
    featured: false
  },
  {
    slug: "blog-campaign-analytics-for-musicians",
    title: "Blog Campaign Analytics for Musicians: Track Blog Outreach Success (2025)",
    excerpt: "Track your blog outreach campaigns with AI-powered analytics. Get industry benchmarks for blog response rates, coverage tracking, and actionable insights for music blog promotion.",
    author: "Chris Schofield",
    date: "2025-10-05",
    readTime: "11 min read",
    category: "PR Tracking",
    featured: false
  },
  {
    slug: "deezer-playlist-campaign-tracking",
    title: "Deezer Playlist Campaign Tracking: Track Your Deezer Promotion Success (2025)",
    excerpt: "Track your Deezer playlist campaigns with AI-powered analytics. Get industry benchmarks for Deezer promotion, playlist placement rates, and actionable insights for better results.",
    author: "Chris Schofield",
    date: "2025-10-05",
    readTime: "8 min read",
    category: "Playlist Tracking",
    featured: false
  },
  {
    slug: "tiktok-music-campaign-tracking",
    title: "TikTok Music Campaign Tracking: Track Your TikTok Promotion Success (2025)",
    excerpt: "Track your TikTok music campaigns with AI-powered analytics. Get industry benchmarks for TikTok promotion, viral tracking, and actionable insights for better TikTok music marketing.",
    author: "Chris Schofield",
    date: "2025-10-05",
    readTime: "10 min read",
    category: "Social Media Tracking",
    featured: false
  },
  {
    slug: "instagram-music-campaign-tracking",
    title: "Instagram Music Campaign Tracking: Track Your Instagram Promotion Success (2025)",
    excerpt: "Track your Instagram music campaigns with AI-powered analytics. Get industry benchmarks for Instagram promotion, story tracking, and actionable insights for better Instagram music marketing.",
    author: "Chris Schofield",
    date: "2025-10-05",
    readTime: "9 min read",
    category: "Social Media Tracking",
    featured: false
  },
  {
    slug: "youtube-music-campaign-tracking",
    title: "YouTube Music Campaign Tracking: Track Your YouTube Promotion Success (2025)",
    excerpt: "Track your YouTube music campaigns with AI-powered analytics. Get industry benchmarks for YouTube promotion, video performance tracking, and actionable insights for better YouTube music marketing.",
    author: "Chris Schofield",
    date: "2025-10-05",
    readTime: "9 min read",
    category: "Social Media Tracking",
    featured: false
  },
  {
    slug: "facebook-music-campaign-tracking",
    title: "Facebook Music Campaign Tracking: Track Your Facebook Promotion Success (2025)",
    excerpt: "Track your Facebook music campaigns with AI-powered analytics. Get industry benchmarks for Facebook promotion, ad performance tracking, and actionable insights for better Facebook music marketing.",
    author: "Chris Schofield",
    date: "2025-10-05",
    readTime: "8 min read",
    category: "Social Media Tracking",
    featured: false
  },
  {
    slug: "twitter-music-campaign-tracking",
    title: "Twitter Music Campaign Tracking: Track Your Twitter Promotion Success (2025)",
    excerpt: "Track your Twitter music campaigns with AI-powered analytics. Get industry benchmarks for Twitter promotion, tweet performance tracking, and actionable insights for better Twitter music marketing.",
    author: "Chris Schofield",
    date: "2025-10-05",
    readTime: "7 min read",
    category: "Social Media Tracking",
    featured: false
  },
  {
    slug: "soundcloud-campaign-tracking",
    title: "SoundCloud Campaign Tracking: Track Your SoundCloud Promotion Success (2025)",
    excerpt: "Track your SoundCloud campaigns with AI-powered analytics. Get industry benchmarks for SoundCloud promotion, track performance tracking, and actionable insights for better SoundCloud music marketing.",
    author: "Chris Schofield",
    date: "2025-10-05",
    readTime: "8 min read",
    category: "Social Media Tracking",
    featured: false
  },
  {
    slug: "bandcamp-campaign-tracking",
    title: "Bandcamp Campaign Tracking: Track Your Bandcamp Promotion Success (2025)",
    excerpt: "Track your Bandcamp campaigns with AI-powered analytics. Get industry benchmarks for Bandcamp promotion, album sales tracking, and actionable insights for better Bandcamp music marketing.",
    author: "Chris Schofield",
    date: "2025-10-05",
    readTime: "7 min read",
    category: "Social Media Tracking",
    featured: false
  }
];

function getCategoryBadgeClasses(category: string) {
  switch (category) {
    case "Playlist Tracking":
      return "bg-purple-100 text-purple-800";
    case "Radio Tracking":
      return "bg-indigo-100 text-indigo-800";
    case "PR Tracking":
      return "bg-green-100 text-green-800";
    case "Campaign Analytics":
      return "bg-blue-100 text-blue-800";
    case "Case Study":
      return "bg-yellow-100 text-yellow-800";
    case "Social Media Tracking":
      return "bg-pink-100 text-pink-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

export default function BlogIndex() {
  const featuredPost = blogPosts.find(post => post.featured);
  const caseStudyPosts = blogPosts.filter(post => post.category === "Case Study");
  const otherPosts = blogPosts.filter(post => post.slug !== featuredPost?.slug && post.category !== "Case Study");

  return (
    <div className="min-h-screen bg-gray-50">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: "https://tracker.totalaudiopromo.com/" },
              { "@type": "ListItem", position: 2, name: "Blog", item: "https://tracker.totalaudiopromo.com/blog" }
            ]
          })
        }}
      />
      {/* Header */}
      <header className="bg-white border-b-4 border-black shadow-brutal">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <Image 
                src="/images/total_audio_promo_logo_trans.png" 
                alt="Total Audio Promo Logo" 
                width={40} 
                height={40} 
                className="w-10 h-10" 
              />
              <span className="text-xl font-black text-gray-900">Tracker</span>
            </Link>
            
            <nav className="flex items-center gap-6">
              <Link href="/" className="text-gray-600 hover:text-gray-900 font-semibold">
                Home
              </Link>
              <Link href="/blog" className="text-purple-600 font-semibold">
                Blog
              </Link>
              <Link href="/demo" className="text-gray-600 hover:text-gray-900 font-semibold">
                Demo
              </Link>
              <Link href="/signup" className="bg-purple-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-purple-700 transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                Try Free
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-12">
        
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-6">
            Campaign Tracking Insights
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Industry guides on campaign tracking, benchmarks, and analytics strategies. 
            Written by working radio promoters with real-world campaign data.
          </p>
        </div>

        {/* Case Studies */}
        {caseStudyPosts.length > 0 && (
          <div className="mb-16">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-6">
              <h2 className="text-3xl font-black text-gray-900">Case Studies</h2>
              <span className="text-sm text-gray-500">Real campaign analytics from working promoters</span>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              {caseStudyPosts.map(post => (
                <article key={post.slug} className="bg-white rounded-2xl border-4 border-black shadow-brutal hover:shadow-brutal-lg hover:-translate-x-1 hover:-translate-y-1 transition-all overflow-hidden">
                  <div className="p-8">
                    <div className="flex items-center gap-3 mb-4">
                      <span className={`${getCategoryBadgeClasses(post.category)} px-3 py-1 rounded-full text-xs font-bold`}>{post.category}</span>
                      <span className="text-xs text-gray-500 font-semibold">{new Date(post.date).toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    </div>
                    <h3 className="text-2xl font-black text-gray-900 mb-3">
                      <Link href={`/blog/${post.slug}`} className="hover:text-purple-600 transition-colors">
                        {post.title}
                      </Link>
                    </h3>
                    <p className="text-gray-600 text-base leading-relaxed mb-6">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span className="font-semibold">{post.author}</span>
                      <span>{post.readTime}</span>
                    </div>
                    <div className="mt-6">
                      <Link href={`/blog/${post.slug}`} className="inline-flex items-center gap-2 text-purple-600 font-bold hover:underline">
                        <span>Read Case Study</span>
                        <span>→</span>
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}

        {/* Featured Post */}
        {featuredPost && (
          <div className="mb-16">
            <div className="bg-white rounded-2xl border-4 border-purple-500 shadow-brutal-lg overflow-hidden">
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
                    <span>{new Date(featuredPost.date).toLocaleDateString('en-GB', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}</span>
                    <span>•</span>
                    <span>{featuredPost.readTime}</span>
                  </div>
                  
                  <Link
                    href={`/blog/${featuredPost.slug}`}
                    className="bg-purple-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-purple-700 transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                  >
                    Read Guide →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Other Posts */}
        {otherPosts.length > 0 && (
          <div className="mb-16">
            <h2 className="text-3xl font-black text-gray-900 mb-8">More Guides</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {otherPosts.map((post) => (
                <article key={post.slug} className="bg-white rounded-xl border-4 border-black shadow-brutal hover:shadow-brutal-lg hover:-translate-x-1 hover:-translate-y-1 transition-all overflow-hidden">
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
        )}

        {/* Newsletter CTA */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-8 text-center text-white border-4 border-black shadow-brutal-lg">
          <h2 className="text-2xl md:text-3xl font-black mb-4">
            Get Campaign Tracking Insights
          </h2>
          <p className="text-lg mb-6 text-purple-100">
            Industry tips, benchmark data, and campaign intelligence from working radio promoters.
          </p>
          <Link
            href="/signup"
            className="bg-white text-purple-600 px-8 py-4 rounded-lg font-bold hover:bg-gray-100 transition-colors inline-block shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
          >
            Start Tracking Free
          </Link>
        </div>
        
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Image 
                  src="/images/total_audio_promo_logo_trans.png" 
                  alt="Total Audio Promo Logo" 
                  width={32} 
                  height={32} 
                  className="w-8 h-8 bg-white rounded p-1" 
                />
                <span className="font-black text-lg">Tracker</span>
              </div>
              <p className="text-gray-400 text-sm">
                Campaign intelligence for the music industry. Built by working radio promoters.
              </p>
            </div>
            
            <div>
              <h3 className="font-bold mb-4">Product</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/" className="hover:text-white transition-colors">Features</Link></li>
                <li><Link href="/#pricing" className="hover:text-white transition-colors">Pricing</Link></li>
                <li><Link href="/demo" className="hover:text-white transition-colors">Demo</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold mb-4">Resources</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/blog" className="hover:text-white transition-colors">Blog</Link></li>
                <li><Link href="/blog/spotify-playlist-campaign-tracking" className="hover:text-white transition-colors">Spotify Campaign Guide</Link></li>
                <li><Link href="/blog/bbc-radio-1-campaign-tracking" className="hover:text-white transition-colors">BBC Radio 1 Tracking</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold mb-4">Company</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="mailto:info@totalaudiopromo.com" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="https://totalaudiopromo.com" className="hover:text-white transition-colors">Total Audio Promo</a></li>
                <li><a href="https://intel.totalaudiopromo.com" className="hover:text-white transition-colors">Audio Intel</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
            <p>© 2025 Tracker - Part of Total Audio Promo • Brighton, UK</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

