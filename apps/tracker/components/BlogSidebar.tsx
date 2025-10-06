'use client';

import { useState } from 'react';
import Link from 'next/link';

interface BlogPost {
  slug: string;
  title: string;
  category: string;
}

interface BlogSidebarProps {
  posts: BlogPost[];
  currentSlug?: string;
}

const categories = [
  { name: 'All Guides', value: 'all', color: 'bg-gray-100 text-gray-800' },
  { name: 'Playlist Tracking', value: 'Playlist Tracking', color: 'bg-purple-100 text-purple-800' },
  { name: 'Radio Tracking', value: 'Radio Tracking', color: 'bg-indigo-100 text-indigo-800' },
  { name: 'PR Tracking', value: 'PR Tracking', color: 'bg-green-100 text-green-800' },
  { name: 'Social Media', value: 'Social Media Tracking', color: 'bg-pink-100 text-pink-800' },
];

export default function BlogSidebar({ posts, currentSlug }: BlogSidebarProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPosts = posts.filter(post => {
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <aside className="w-full lg:w-80 flex-shrink-0">
      <div className="sticky top-4 space-y-6">
        {/* Search */}
        <div className="bg-white rounded-xl border-4 border-black shadow-brutal p-4">
          <label htmlFor="search" className="block text-sm font-bold text-gray-700 mb-2">
            Search Guides
          </label>
          <input
            id="search"
            type="text"
            placeholder="Search articles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 border-2 border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
          />
        </div>

        {/* Categories */}
        <div className="bg-white rounded-xl border-4 border-black shadow-brutal p-4">
          <h3 className="text-sm font-bold text-gray-700 mb-4">Filter by Category</h3>
          <div className="space-y-2">
            {categories.map((category) => {
              const count = category.value === 'all'
                ? posts.length
                : posts.filter(p => p.category === category.value).length;

              return (
                <button
                  key={category.value}
                  onClick={() => setSelectedCategory(category.value)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                    selectedCategory === category.value
                      ? `${category.color} border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]`
                      : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <span className="flex items-center justify-between">
                    <span>{category.name}</span>
                    <span className="text-xs opacity-70">({count})</span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Filtered Results */}
        <div className="bg-white rounded-xl border-4 border-black shadow-brutal p-4">
          <h3 className="text-sm font-bold text-gray-700 mb-4">
            {selectedCategory === 'all' ? 'All Guides' : categories.find(c => c.value === selectedCategory)?.name}
            {searchQuery && ` matching "${searchQuery}"`}
          </h3>
          <div className="space-y-3 max-h-[500px] overflow-y-auto">
            {filteredPosts.length > 0 ? (
              filteredPosts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className={`block p-3 rounded-lg text-sm transition-all ${
                    currentSlug === post.slug
                      ? 'bg-purple-100 border-2 border-purple-600 font-bold'
                      : 'hover:bg-gray-50 border-2 border-transparent'
                  }`}
                >
                  {post.title}
                </Link>
              ))
            ) : (
              <p className="text-sm text-gray-500 italic">No guides found</p>
            )}
          </div>
        </div>

        {/* Quick Links */}
        <div className="bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl border-4 border-black shadow-brutal p-4 text-white">
          <h3 className="text-sm font-bold mb-3">Start Tracking</h3>
          <p className="text-sm text-purple-100 mb-4">
            Get AI-powered campaign intelligence and industry benchmarks.
          </p>
          <Link
            href="/signup"
            className="block w-full text-center bg-white text-purple-600 px-4 py-2 rounded-lg font-bold hover:bg-gray-100 transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
          >
            Try Free →
          </Link>
        </div>
      </div>
    </aside>
  );
}
