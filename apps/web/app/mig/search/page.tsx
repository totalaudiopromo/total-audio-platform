/**
 * MIG Search Page - Phase 5 Enhanced
 * /mig/search
 *
 * Features:
 * - Live search with debouncing
 * - Keyboard navigation (↑/↓ to navigate, Enter to select)
 * - Quick action buttons per result
 * - "Open in graph view" functionality
 */

'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { MIGSearchBar } from '../components/MIGSearchBar';
import type { MIGNodeType } from '@total-audio/music-industry-graph';

export default function MIGSearchPage() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const resultsRef = useRef<HTMLDivElement>(null);

  // Debounced search
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    const timeoutId = setTimeout(async () => {
      try {
        const params = new URLSearchParams({ query: query.trim(), limit: '50' });
        const response = await fetch(`/api/mig/search?${params}`);
        const data = await response.json();

        if (data.success) {
          setResults(data.data.results || []);
          setSelectedIndex(0); // Reset selection on new results
        }
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setLoading(false);
      }
    }, 300); // 300ms debounce

    return () => clearTimeout(timeoutId);
  }, [query]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (results.length === 0) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % results.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + results.length) % results.length);
      } else if (e.key === 'Enter' && results[selectedIndex]) {
        e.preventDefault();
        router.push(`/mig/node/${results[selectedIndex].slug}`);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [results, selectedIndex, router]);

  // Auto-scroll selected item into view
  useEffect(() => {
    if (resultsRef.current && results.length > 0) {
      const selectedElement = resultsRef.current.children[selectedIndex] as HTMLElement;
      selectedElement?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [selectedIndex, results]);

  const handleSearch = useCallback((searchQuery: string, type?: MIGNodeType) => {
    setQuery(searchQuery);
  }, []);

  const handleOpenInGraph = useCallback((nodeSlug: string) => {
    router.push(`/mig/graph?node=${nodeSlug}`);
  }, [router]);

  const typeColors: Record<string, string> = {
    artist: 'bg-cyan-600/20 border-cyan-500/50 text-cyan-300',
    journalist: 'bg-violet-600/20 border-violet-500/50 text-violet-300',
    radio_host: 'bg-amber-600/20 border-amber-500/50 text-amber-300',
    dj: 'bg-green-600/20 border-green-500/50 text-green-300',
    scene: 'bg-amber-600/20 border-amber-500/50 text-amber-300',
    microgenre: 'bg-pink-600/20 border-pink-500/50 text-pink-300',
    blog: 'bg-violet-600/20 border-violet-500/50 text-violet-300',
    playlist: 'bg-green-600/20 border-green-500/50 text-green-300',
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="border-b border-slate-800 bg-black/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-cyan-400">MIG Search</h1>
              <p className="text-sm text-slate-400 mt-1">Search the music industry graph</p>
            </div>
            <div className="flex gap-3">
              <Link
                href="/mig/graph"
                className="px-4 py-2 bg-cyan-900/20 border border-cyan-500/50 rounded text-sm text-cyan-300 hover:bg-cyan-900/30 transition-colors"
              >
                🌐 Graph View
              </Link>
              <Link
                href="/mig"
                className="px-4 py-2 bg-slate-800/50 border border-slate-700 rounded text-sm text-slate-300 hover:border-cyan-500/50 transition-colors"
              >
                ← Dashboard
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <MIGSearchBar onSearch={handleSearch} />

          {/* Keyboard hints */}
          {results.length > 0 && (
            <div className="mt-3 text-xs text-slate-500 font-mono flex gap-4">
              <span>↑/↓ Navigate</span>
              <span>Enter Open</span>
              <span>⌘K Graph View</span>
            </div>
          )}
        </div>

        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-pulse text-cyan-400">
              Searching the graph...
            </div>
          </div>
        )}

        {!loading && results.length > 0 && (
          <div>
            <div className="mb-4 text-sm text-slate-400 flex items-center justify-between">
              <span>
                Found {results.length} result{results.length !== 1 ? 's' : ''}
              </span>
              <button
                onClick={() => router.push(`/mig/graph?search=${encodeURIComponent(query)}`)}
                className="px-3 py-1.5 bg-cyan-900/20 border border-cyan-500/50 rounded text-sm text-cyan-300 hover:bg-cyan-900/30 transition-all duration-240"
              >
                🌐 View All in Graph
              </button>
            </div>

            <div ref={resultsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {results.map((node, index) => (
                <div
                  key={node.id}
                  className={`p-4 bg-slate-900/30 border rounded-lg transition-all duration-240 ${
                    index === selectedIndex
                      ? 'border-cyan-500 shadow-lg shadow-cyan-500/20'
                      : 'border-slate-800 hover:border-cyan-500/50'
                  }`}
                >
                  {/* Node Header */}
                  <div className="flex items-start justify-between mb-2">
                    <Link
                      href={`/mig/node/${node.slug}`}
                      className="flex-1 group"
                    >
                      <h3 className="font-semibold text-white group-hover:text-cyan-300 transition-colors">
                        {node.name}
                      </h3>
                    </Link>
                    <span
                      className={`px-2 py-1 border rounded text-xs ${
                        typeColors[node.type] || 'bg-slate-800/50 border-slate-700 text-slate-300'
                      }`}
                    >
                      {node.type}
                    </span>
                  </div>

                  {/* Node Metadata */}
                  {node.country && (
                    <div className="text-sm text-slate-400 mb-2">
                      📍 {node.country}
                    </div>
                  )}

                  {node.metadata?.genres && node.metadata.genres.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2 mb-3">
                      {node.metadata.genres.slice(0, 3).map((genre: string) => (
                        <span
                          key={genre}
                          className="px-2 py-0.5 bg-slate-800/50 rounded text-xs text-slate-400"
                        >
                          {genre}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Quick Actions */}
                  <div className="flex gap-2 mt-3 pt-3 border-t border-slate-800">
                    <button
                      onClick={() => handleOpenInGraph(node.slug)}
                      className="flex-1 px-3 py-1.5 bg-cyan-900/20 border border-cyan-500/50 rounded text-xs text-cyan-300 hover:bg-cyan-900/30 transition-all duration-240"
                      title="Open in graph view"
                    >
                      🌐 Graph
                    </button>
                    <Link
                      href={`/mig/node/${node.slug}`}
                      className="flex-1 px-3 py-1.5 bg-slate-800/50 border border-slate-700 rounded text-xs text-slate-300 hover:border-cyan-500/50 transition-all duration-240 text-center"
                    >
                      📄 Details
                    </Link>
                    {node.type === 'artist' && (
                      <Link
                        href={`/mig/node/${node.slug}?tab=scenes`}
                        className="flex-1 px-3 py-1.5 bg-amber-900/20 border border-amber-500/50 rounded text-xs text-amber-300 hover:bg-amber-900/30 transition-all duration-240 text-center"
                        title="View scene alignment"
                      >
                        🎵 Scenes
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {!loading && query && results.length === 0 && (
          <div className="text-center py-12">
            <div className="text-slate-500 mb-4">
              No results found for &quot;{query}&quot;
            </div>
            <div className="text-sm text-slate-600">
              Try searching for artists, scenes, journalists, or radio hosts
            </div>
          </div>
        )}

        {!loading && !query && results.length === 0 && (
          <div className="text-center py-12">
            <div className="text-slate-500 mb-4">
              Start typing to search the music industry graph
            </div>
            <div className="text-sm text-slate-600">
              Search for artists, scenes, journalists, radio hosts, playlists, and more
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
