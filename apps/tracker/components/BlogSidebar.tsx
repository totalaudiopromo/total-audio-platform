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
  selectedCategory?: string;
  searchQuery?: string;
  onCategoryChange?: (category: string) => void;
  onSearchChange?: (query: string) => void;
}

const categories = [
  { name: 'All Guides', value: 'all', color: 'bg-gray-100 text-gray-800' },
  { name: 'Playlist Tracking', value: 'Playlist Tracking', color: 'bg-teal-100 text-teal-800' },
  { name: 'Radio Tracking', value: 'Radio Tracking', color: 'bg-indigo-100 text-indigo-800' },
  { name: 'PR Tracking', value: 'PR Tracking', color: 'bg-green-100 text-green-800' },
  { name: 'Social Media', value: 'Social Media Tracking', color: 'bg-pink-100 text-pink-800' },
];

export default function BlogSidebar({
  posts,
  selectedCategory = 'all',
  searchQuery = '',
  onCategoryChange,
  onSearchChange
}: BlogSidebarProps) {
  const filteredPosts = posts.filter(post => {
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <aside className="w-full lg:w-80 flex-shrink-0">
      <div className="sticky top-4 space-y-4">
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
            onChange={(e) => onSearchChange?.(e.target.value)}
            className="w-full px-4 py-2 border-2 border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
          />
        </div>

        {/* Categories */}
        <div className="bg-white rounded-xl border-4 border-black shadow-brutal p-4">
          <h3 className="text-sm font-bold text-gray-700 mb-3">Filter by Category</h3>
          <div className="space-y-2">
            {categories.map((category) => {
              const count = category.value === 'all'
                ? posts.length
                : posts.filter(p => p.category === category.value).length;

              return (
                <button
                  key={category.value}
                  onClick={() => onCategoryChange?.(category.value)}
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

        {/* Results Count */}
        {(selectedCategory !== 'all' || searchQuery) && (
          <div className="bg-white rounded-xl border-4 border-black shadow-brutal p-4">
            <div className="text-center">
              <div className="text-3xl font-black text-teal-600 mb-2">
                {filteredPosts.length}
              </div>
              <p className="text-sm text-gray-600">
                guide{filteredPosts.length !== 1 ? 's' : ''} {searchQuery ? 'found' : 'available'}
              </p>
            </div>
          </div>
        )}

        {/* Quick Links */}
        <div className="bg-gradient-to-br from-teal-600 to-indigo-600 rounded-xl border-4 border-black shadow-brutal p-4 text-white">
          <h3 className="text-sm font-bold mb-2">Start Tracking</h3>
          <p className="text-xs text-teal-100 mb-3">
            Get AI-powered campaign intelligence.
          </p>
          <Link
            href="/signup"
            className="block w-full text-center bg-white text-teal-600 px-4 py-2 rounded-lg text-sm font-bold hover:bg-gray-100 transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
          >
            Try Free →
          </Link>
        </div>
      </div>
    </aside>
  );
}
