import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Music Industry Insights & Contact Enrichment Guides | Audio Intel Blog",
  description: "Industry guides on music promotion, contact enrichment, and campaign strategies. Written by working radio promoters with 5+ years experience.",
  keywords: "music promotion blog, contact enrichment guides, radio promotion tips, playlist submission strategies",
  alternates: {
    canonical: 'https://intel.totalaudiopromo.com/blog',
    languages: {
      'en-GB': 'https://intel.totalaudiopromo.com/blog',
    }
  },
  openGraph: { url: 'https://intel.totalaudiopromo.com/blog' }
};

const blogPosts = [
  {
    slug: "bbc-radio-1-contact-enrichment",
    title: "BBC Radio 1 Contact Enrichment: 18 Hours to 2 Minutes",
    excerpt: "Full walk-through of rebuilding a BBC Radio 1 pitching list with Audio Intel, cutting research time from an entire weekend to a two minute enrichment run.",
    author: "Chris Schofield",
    date: "2025-09-15",
    readTime: "10 min read",
    category: "Case Study",
    featured: true
  },
  {
    slug: "music-contact-enrichment-guide",
    title: "What is Music Contact Enrichment? Complete Guide (2025)",
    excerpt: "Right, so after spending 5+ years manually researching music industry contacts and wasting literally thousands of hours, I built the tool I wished existed. Here's everything you need to know about music contact enrichment.",
    author: "Chris Schofield",
    date: "2025-08-30",
    readTime: "8 min read",
    category: "Contact Enrichment",
    featured: false
  },
  {
    slug: "radio-promotion-tips",
    title: "Radio Promotion Tips That Actually Work in 2025",
    excerpt: "5+ years of radio promotion experience distilled into actionable tips. Learn what actually works for getting airplay in 2025 from a working radio promoter.",
    author: "Chris Schofield",
    date: "2025-08-30",
    readTime: "6 min read",
    category: "Radio Promotion",
    featured: false
  },
  {
    slug: "playlist-promotion-mistakes",
    title: "5 Playlist Promotion Mistakes Killing Your Music Career",
    excerpt: "Stop making these deadly playlist promotion mistakes. Learn what actually works from someone who's seen hundreds of failed campaigns.",
    author: "Chris Schofield",
    date: "2025-08-30",
    readTime: "7 min read",
    category: "Playlist Promotion",
    featured: false
  },
  {
    slug: "music-industry-contacts",
    title: "How to Find Music Industry Contacts (Without Wasting Hours)",
    excerpt: "Stop wasting hours hunting for music industry contacts. Learn the exact methods working promoters use to find radio DJs, playlist curators, and music bloggers.",
    author: "Chris Schofield",
    date: "2025-08-30",
    readTime: "9 min read",
    category: "Contact Research",
    featured: false
  }
];

function getCategoryBadgeClasses(category: string) {
  switch (category) {
    case "Contact Enrichment":
      return "bg-blue-100 text-blue-800";
    case "Radio Promotion":
      return "bg-green-100 text-green-800";
    case "Playlist Promotion":
      return "bg-blue-100 text-blue-800";
    case "Contact Research":
      return "bg-orange-100 text-orange-800";
    case "Case Study":
      return "bg-yellow-100 text-yellow-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

export default function BlogIndex() {
  const featuredPost = blogPosts.find(post => post.featured);
  const caseStudyPosts = blogPosts.filter(post => post.category === "Case Study");
  const otherPosts = blogPosts.filter(post => post.slug !== featuredPost?.slug && post.category !== "Case Study");

  return (
    <>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: "https://intel.totalaudiopromo.com/" },
              { "@type": "ListItem", position: 2, name: "Blog", item: "https://intel.totalaudiopromo.com/blog" }
            ]
          })
        }}
      />

      <main className="mx-auto w-full max-w-6xl px-4 pb-16 pt-10 sm:px-8 lg:px-12 xl:px-16">
        
        {/* Hero Section */}
        <div className="glass-panel text-center mb-10 px-6 py-12 sm:px-10">
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-6">
            Music Industry Insights
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Industry guides on contact enrichment, music promotion strategies, and campaign optimization. 
            Written by working radio promoters with real-world experience.
          </p>
        </div>

        {/* Case Studies */}
        {caseStudyPosts.length > 0 && (
          <div className="mb-16">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-6">
              <h2 className="text-3xl font-black text-gray-900">Case Studies</h2>
              <span className="text-sm text-gray-500">Real campaign walk-throughs from working promoters</span>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              {caseStudyPosts.map(post => (
                <article key={post.slug} className="glass-panel overflow-hidden hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all">
                  <div className="p-8">
                    <div className="flex items-center gap-3 mb-4">
                      <span className={`${getCategoryBadgeClasses(post.category)} px-3 py-1 rounded-full text-xs font-bold`}>{post.category}</span>
                      <span className="text-xs text-gray-500 font-semibold">{new Date(post.date).toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    </div>
                    <h3 className="text-2xl font-black text-gray-900 mb-3">
                      <Link href={`/blog/${post.slug}`} className="hover:text-blue-600 transition-colors">
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
                      <Link href={`/blog/${post.slug}`} className="inline-flex items-center gap-2 text-blue-600 font-bold">
                        <span>Read Case Study</span>
                        <span>-&gt;</span>
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
            <div className="glass-panel border-blue-500 overflow-hidden">
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
                    className="hover:text-blue-600 transition-colors"
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
                    className="cta-button"
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
                <article key={post.slug} className="glass-panel overflow-hidden hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all">
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <span className={`${getCategoryBadgeClasses(post.category)} px-2 py-1 rounded text-xs font-semibold`}>
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
        <div className="glass-panel border-blue-500 bg-gradient-to-br from-blue-50 to-white px-6 py-12 sm:px-10 text-center">
          <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-4">
            Get Music Promotion Insights
          </h2>
          <p className="text-lg mb-6 text-gray-700">
            Industry tips, contact enrichment strategies, and campaign insights from working radio promoters.
          </p>
          <Link
            href="/beta"
            className="cta-button"
          >
            Join Audio Intel Beta
          </Link>
        </div>
        
      </main>
    </>
  );
}