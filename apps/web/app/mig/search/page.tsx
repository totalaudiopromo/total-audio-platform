/**
 * MIG Search Page
 * /mig/search
 */

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { MIGSearchBar } from '../components/MIGSearchBar';
import type { MIGNodeType } from '@total-audio/music-industry-graph';

export default function MIGSearchPage() {
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (query: string, type?: MIGNodeType) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ query, limit: '50' });
      if (type) params.append('type', type);

      const response = await fetch(`/api/mig/search?${params}`);
      const data = await response.json();

      if (data.success) {
        setResults(data.data);
      }
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const typeColors: Record<string, string> = {
    artist: 'bg-cyan-600/20 border-cyan-500/50 text-cyan-300',
    journalist: 'bg-violet-600/20 border-violet-500/50 text-violet-300',
    radio_host: 'bg-blue-600/20 border-blue-500/50 text-blue-300',
    dj: 'bg-green-600/20 border-green-500/50 text-green-300',
    scene: 'bg-amber-600/20 border-amber-500/50 text-amber-300',
    microgenre: 'bg-pink-600/20 border-pink-500/50 text-pink-300',
    blog: 'bg-violet-600/20 border-violet-500/50 text-violet-300',
    playlist: 'bg-blue-600/20 border-blue-500/50 text-blue-300',
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
            <Link
              href="/mig"
              className="px-4 py-2 bg-slate-800/50 border border-slate-700 rounded text-sm text-slate-300 hover:border-cyan-500/50 transition-colors"
            >
              ← Back to Dashboard
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <MIGSearchBar onSearch={handleSearch} />
        </div>

        {loading && (
          <div className="text-center py-12 text-slate-400">
            Searching the graph...
          </div>
        )}

        {!loading && results.length > 0 && (
          <div>
            <div className="mb-4 text-sm text-slate-400">
              Found {results.length} result{results.length !== 1 ? 's' : ''}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {results.map((node) => (
                <Link
                  key={node.id}
                  href={`/mig/node/${node.slug}`}
                  className="p-4 bg-slate-900/30 border border-slate-800 rounded-lg hover:border-cyan-500/50 transition-all duration-240 group"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-white group-hover:text-cyan-300 transition-colors">
                      {node.name}
                    </h3>
                    <span
                      className={`px-2 py-1 border rounded text-xs ${
                        typeColors[node.type] || 'bg-slate-800/50 border-slate-700 text-slate-300'
                      }`}
                    >
                      {node.type}
                    </span>
                  </div>

                  {node.country && (
                    <div className="text-sm text-slate-400 mb-2">
                      📍 {node.country}
                    </div>
                  )}

                  {node.metadata?.genres && node.metadata.genres.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
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
                </Link>
              ))}
            </div>
          </div>
        )}

        {!loading && results.length === 0 && (
          <div className="text-center py-12 text-slate-500">
            No results yet. Try searching for artists, scenes, or journalists.
          </div>
        )}
      </main>
    </div>
  );
}
