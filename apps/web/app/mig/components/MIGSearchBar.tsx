/**
 * MIGSearchBar Component
 * Search interface for the Music Industry Graph
 */

'use client';

import { useState } from 'react';
import type { MIGNodeType } from '@total-audio/music-industry-graph';

interface MIGSearchBarProps {
  onSearch?: (query: string, type?: MIGNodeType) => void;
}

export function MIGSearchBar({ onSearch }: MIGSearchBarProps) {
  const [query, setQuery] = useState('');
  const [selectedType, setSelectedType] = useState<MIGNodeType | 'all'>('all');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(query, selectedType === 'all' ? undefined : selectedType);
    }
  };

  const nodeTypes: Array<{ value: MIGNodeType | 'all'; label: string }> = [
    { value: 'all', label: 'All Types' },
    { value: 'artist', label: 'Artists' },
    { value: 'journalist', label: 'Journalists' },
    { value: 'radio_host', label: 'Radio Hosts' },
    { value: 'dj', label: 'DJs' },
    { value: 'blog', label: 'Blogs' },
    { value: 'playlist', label: 'Playlists' },
    { value: 'scene', label: 'Scenes' },
    { value: 'microgenre', label: 'Microgenres' },
    { value: 'label', label: 'Labels' },
    { value: 'venue', label: 'Venues' },
    { value: 'event', label: 'Events' },
  ];

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search Input */}
        <div className="flex-1">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search the music industry graph..."
            className="w-full px-4 py-3 bg-slate-900/50 border border-slate-800 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 transition-colors"
          />
        </div>

        {/* Type Filter */}
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value as MIGNodeType | 'all')}
          className="px-4 py-3 bg-slate-900/50 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-cyan-500/50 transition-colors cursor-pointer"
        >
          {nodeTypes.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>

        {/* Search Button */}
        <button
          type="submit"
          className="px-6 py-3 bg-cyan-600/20 border border-cyan-500/50 rounded-lg text-cyan-300 font-medium hover:bg-cyan-600/30 transition-all duration-240"
        >
          Search
        </button>
      </div>

      {/* Quick Examples */}
      <div className="mt-3 text-xs text-slate-500">
        <span className="mr-2">Try:</span>
        <button
          type="button"
          onClick={() => {
            setQuery('London alt-R&B artists');
            setSelectedType('artist');
          }}
          className="mr-3 text-cyan-400 hover:text-cyan-300 transition-colors"
        >
          London alt-R&B artists
        </button>
        <button
          type="button"
          onClick={() => {
            setQuery('UK garage');
            setSelectedType('scene');
          }}
          className="mr-3 text-cyan-400 hover:text-cyan-300 transition-colors"
        >
          UK garage scene
        </button>
        <button
          type="button"
          onClick={() => {
            setQuery('BBC Radio');
            setSelectedType('radio_host');
          }}
          className="text-cyan-400 hover:text-cyan-300 transition-colors"
        >
          BBC Radio hosts
        </button>
      </div>
    </form>
  );
}
