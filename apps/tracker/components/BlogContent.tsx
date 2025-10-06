'use client';

import { useState } from 'react';
import Link from 'next/link';
import BlogSidebar from './BlogSidebar';

interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  readTime: string;
  category: string;
  featured: boolean;
}

interface BlogContentProps {
  posts: BlogPost[];
}

function getCategoryBadgeClasses(category: string) {
  switch (category) {
    case "Playlist Tracking":
      return "bg-purple-100 text-purple-800";
    case "Radio Tracking":
      return "bg-indigo-100 text-indigo-800";
    case "PR Tracking":
      return "bg-green-100 text-green-800";
    case "Social Media Tracking":
      return "bg-pink-100 text-pink-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

export default function BlogContent({ posts }: BlogContentProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPosts = posts.filter(post => {
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredPost = filteredPosts.find(post => post.featured);
  const otherPosts = filteredPosts.filter(post => !post.featured);

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Sidebar with state handlers */}
      <div className="w-full lg:w-80 flex-shrink-0">
        <BlogSidebar
          posts={posts.map(p => ({ slug: p.slug, title: p.title, category: p.category }))}
          selectedCategory={selectedCategory}
          searchQuery={searchQuery}
          onCategoryChange={setSelectedCategory}
          onSearchChange={setSearchQuery}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 min-w-0 space-y-16">
        {filteredPosts.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-xl text-gray-600">No guides found matching your filters.</p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
              }}
              className="mt-4 text-purple-600 font-bold hover:underline"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <>
            {/* Featured Post */}
            {featuredPost && (
              <div>
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
              <div>
                <h2 className="text-3xl font-black text-gray-900 mb-8">
                  {selectedCategory !== 'all' || searchQuery ? 'Filtered Guides' : 'More Guides'}
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
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
          </>
        )}
      </div>
    </div>
  );
}
