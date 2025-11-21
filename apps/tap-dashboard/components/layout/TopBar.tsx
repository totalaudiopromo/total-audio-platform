'use client';

import { useState } from 'react';
import { SearchInput } from '../ui/SearchInput';
import { UserCircleIcon, ChevronDownIcon } from '@heroicons/react/24/outline';

export function TopBar() {
  const [searchQuery, setSearchQuery] = useState('');
  const [artistSlug, setArtistSlug] = useState('Current Artist');

  return (
    <header className="sticky top-0 z-40 bg-postcraft-white border-b-3 border-postcraft-black shadow-brutal">
      <div className="flex items-center justify-between px-8 py-4">
        {/* Artist/Workspace Selector */}
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-postcraft-white border-2 border-postcraft-black rounded-lg text-sm font-bold text-postcraft-black hover:bg-postcraft-gray-50 transition-all duration-150 shadow-brutal-sm hover:shadow-brutal">
            <UserCircleIcon className="w-5 h-5 text-postcraft-blue" />
            <span>{artistSlug}</span>
            <ChevronDownIcon className="w-4 h-4 text-postcraft-gray-600" />
          </button>
        </div>

        {/* Search */}
        <div className="flex-1 max-w-md mx-8">
          <SearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search dashboard..."
          />
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-3">
          <button className="px-4 py-2.5 bg-postcraft-blue text-postcraft-white border-2 border-postcraft-black rounded-lg text-sm font-bold hover:bg-blue-600 transition-all duration-150 shadow-brutal-sm hover:shadow-brutal">
            Quick Action
          </button>
          <button className="w-10 h-10 rounded-full bg-postcraft-gray-100 border-2 border-postcraft-black flex items-center justify-center hover:bg-postcraft-gray-200 transition-all duration-150 shadow-brutal-sm">
            <UserCircleIcon className="w-6 h-6 text-postcraft-gray-900" />
          </button>
        </div>
      </div>
    </header>
  );
}
