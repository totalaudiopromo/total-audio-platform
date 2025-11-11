'use client';

import { useState, useEffect } from 'react';
import { Search, Filter, X, SlidersHorizontal } from 'lucide-react';

export interface FilterOptions {
  search: string;
  status: string[];
  platform: string[];
  genre: string[];
  dateRange: 'all' | '7d' | '30d' | '90d' | 'custom';
  sortBy: 'date' | 'name' | 'budget' | 'success_rate';
  sortOrder: 'asc' | 'desc';
}

interface CampaignFiltersProps {
  onFilterChange: (filters: FilterOptions) => void;
  totalCount: number;
  filteredCount: number;
  availablePlatforms?: string[];
  availableGenres?: string[];
}

export function CampaignFilters({
  onFilterChange,
  totalCount,
  filteredCount,
  availablePlatforms = [],
  availableGenres = [],
}: CampaignFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    search: '',
    status: [],
    platform: [],
    genre: [],
    dateRange: 'all',
    sortBy: 'date',
    sortOrder: 'desc',
  });

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      onFilterChange(filters);
    }, 300);

    return () => clearTimeout(timer);
  }, [filters, onFilterChange]);

  const handleSearchChange = (value: string) => {
    setFilters(prev => ({ ...prev, search: value }));
  };

  const toggleStatus = (status: string) => {
    setFilters(prev => ({
      ...prev,
      status: prev.status.includes(status)
        ? prev.status.filter(s => s !== status)
        : [...prev.status, status],
    }));
  };

  const togglePlatform = (platform: string) => {
    setFilters(prev => ({
      ...prev,
      platform: prev.platform.includes(platform)
        ? prev.platform.filter(p => p !== platform)
        : [...prev.platform, platform],
    }));
  };

  const toggleGenre = (genre: string) => {
    setFilters(prev => ({
      ...prev,
      genre: prev.genre.includes(genre)
        ? prev.genre.filter(g => g !== genre)
        : [...prev.genre, genre],
    }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      status: [],
      platform: [],
      genre: [],
      dateRange: 'all',
      sortBy: 'date',
      sortOrder: 'desc',
    });
  };

  const activeFilterCount =
    filters.status.length +
    filters.platform.length +
    filters.genre.length +
    (filters.search ? 1 : 0) +
    (filters.dateRange !== 'all' ? 1 : 0);

  return (
    <div className="mb-6">
      {/* Search Bar and Quick Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        {/* Search Input */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search campaigns, artists, or platforms..."
            value={filters.search}
            onChange={e => handleSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-xl font-bold focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-200 transition-all"
          />
          {filters.search && (
            <button
              onClick={() => handleSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="h-4 w-4 text-gray-400" />
            </button>
          )}
        </div>

        {/* Sort Dropdown */}
        <select
          value={`${filters.sortBy}-${filters.sortOrder}`}
          onChange={e => {
            const [sortBy, sortOrder] = e.target.value.split('-') as [
              FilterOptions['sortBy'],
              FilterOptions['sortOrder'],
            ];
            setFilters(prev => ({ ...prev, sortBy, sortOrder }));
          }}
          className="px-4 py-3 border-2 border-gray-300 rounded-xl font-bold focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-200 transition-all bg-white"
        >
          <option value="date-desc">Newest First</option>
          <option value="date-asc">Oldest First</option>
          <option value="name-asc">Name (A-Z)</option>
          <option value="name-desc">Name (Z-A)</option>
          <option value="budget-desc">Budget (High-Low)</option>
          <option value="budget-asc">Budget (Low-High)</option>
          <option value="success_rate-desc">Success Rate (High-Low)</option>
          <option value="success_rate-asc">Success Rate (Low-High)</option>
        </select>

        {/* Filter Toggle Button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={`px-4 py-3 rounded-xl font-black text-sm transition-all border-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 flex items-center gap-2 whitespace-nowrap ${
            activeFilterCount > 0
              ? 'bg-teal-600 text-white border-teal-800'
              : 'bg-white text-gray-700 border-gray-300'
          }`}
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filters
          {activeFilterCount > 0 && (
            <span className="px-2 py-0.5 bg-white text-teal-600 rounded-full text-xs font-black">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm font-bold text-gray-600">
          Showing {filteredCount} of {totalCount} campaigns
          {activeFilterCount > 0 && (
            <button
              onClick={clearFilters}
              className="ml-2 text-teal-600 hover:text-teal-700 underline"
            >
              Clear all filters
            </button>
          )}
        </p>
      </div>

      {/* Extended Filters Panel */}
      {isExpanded && (
        <div className="bg-gray-50 border-2 border-gray-300 rounded-xl p-6 space-y-6 animate-in slide-in-from-top-4 duration-300">
          {/* Status Filters */}
          <div>
            <p className="text-sm font-black text-gray-700 mb-3 uppercase tracking-wider">
              Status
            </p>
            <div className="flex flex-wrap gap-2">
              {['planning', 'active', 'completed', 'paused'].map(status => (
                <button
                  key={status}
                  onClick={() => toggleStatus(status)}
                  className={`px-4 py-2 rounded-xl font-bold text-sm transition-all border-2 ${
                    filters.status.includes(status)
                      ? 'bg-teal-600 text-white border-teal-800 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Platform Filters */}
          {availablePlatforms.length > 0 && (
            <div>
              <p className="text-sm font-black text-gray-700 mb-3 uppercase tracking-wider">
                Platform
              </p>
              <div className="flex flex-wrap gap-2">
                {availablePlatforms.map(platform => (
                  <button
                    key={platform}
                    onClick={() => togglePlatform(platform)}
                    className={`px-4 py-2 rounded-xl font-bold text-sm transition-all border-2 ${
                      filters.platform.includes(platform)
                        ? 'bg-teal-600 text-white border-teal-800 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {platform}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Genre Filters */}
          {availableGenres.length > 0 && (
            <div>
              <p className="text-sm font-black text-gray-700 mb-3 uppercase tracking-wider">
                Genre
              </p>
              <div className="flex flex-wrap gap-2">
                {availableGenres.map(genre => (
                  <button
                    key={genre}
                    onClick={() => toggleGenre(genre)}
                    className={`px-4 py-2 rounded-xl font-bold text-sm transition-all border-2 ${
                      filters.genre.includes(genre)
                        ? 'bg-green-600 text-white border-green-800 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {genre}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Date Range Filters */}
          <div>
            <p className="text-sm font-black text-gray-700 mb-3 uppercase tracking-wider">
              Date Range
            </p>
            <div className="flex flex-wrap gap-2">
              {[
                { value: 'all', label: 'All Time' },
                { value: '7d', label: 'Last 7 Days' },
                { value: '30d', label: 'Last 30 Days' },
                { value: '90d', label: 'Last 90 Days' },
              ].map(range => (
                <button
                  key={range.value}
                  onClick={() =>
                    setFilters(prev => ({
                      ...prev,
                      dateRange: range.value as any,
                    }))
                  }
                  className={`px-4 py-2 rounded-xl font-bold text-sm transition-all border-2 ${
                    filters.dateRange === range.value
                      ? 'bg-teal-600 text-white border-teal-800 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                  }`}
                >
                  {range.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
