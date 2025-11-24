/**
 * RCF Terminal Dashboard
 *
 * Bloomberg-style real-time coverage feed
 * Matte black UI with slate cyan accents
 */

'use client';

import { useState, useEffect } from 'react';
import type { RCFUserFeedEntry, RCFEventType } from '@total-audio/rcf/types';
import { EventCard } from './components/EventCard';
import { FilterBar } from './components/FilterBar';
import { LiveIndicator } from './components/LiveIndicator';

export default function RCFPage() {
  const [events, setEvents] = useState<RCFUserFeedEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTypes, setSelectedTypes] = useState<RCFEventType[]>([]);
  const [isLiveMode, setIsLiveMode] = useState(true);

  // Fetch initial events
  useEffect(() => {
    fetchEvents();
  }, [selectedTypes]);

  // Setup real-time stream
  useEffect(() => {
    if (!isLiveMode) return;

    const eventSource = new EventSource('/api/rcf/stream');

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        if (data.type === 'event' && data.event) {
          // Add new event to top of feed
          setEvents((prev) => [data.event, ...prev].slice(0, 100)); // Keep last 100
        }
      } catch (error) {
        console.error('Failed to parse SSE message:', error);
      }
    };

    eventSource.onerror = (error) => {
      console.error('SSE error:', error);
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, [isLiveMode]);

  async function fetchEvents() {
    try {
      setLoading(true);

      const params = new URLSearchParams();
      if (selectedTypes.length > 0) {
        params.set('types', selectedTypes.join(','));
      }
      params.set('limit', '50');

      const response = await fetch(`/api/rcf/feed?${params}`);
      const result = await response.json();

      if (result.success) {
        setEvents(result.data);
      }
    } catch (error) {
      console.error('Failed to fetch events:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-slate-100">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-slate-800 bg-[#0a0a0a]/95 backdrop-blur">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold tracking-tight">
                Real-Time Coverage Feed
              </h1>
              <LiveIndicator isLive={isLiveMode} />
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsLiveMode(!isLiveMode)}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  isLiveMode
                    ? 'bg-[#3AA9BE]/20 text-[#3AA9BE] hover:bg-[#3AA9BE]/30'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {isLiveMode ? 'Live Mode ON' : 'Live Mode OFF'}
              </button>

              <a
                href="/rcf/settings"
                className="rounded-lg bg-slate-800 px-4 py-2 text-sm font-medium text-slate-300 transition-colors hover:bg-slate-700"
              >
                Settings
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Filter Bar */}
      <div className="sticky top-[73px] z-40 border-b border-slate-800 bg-[#0a0a0a]/95 backdrop-blur">
        <div className="container mx-auto px-4 py-3">
          <FilterBar
            selectedTypes={selectedTypes}
            onTypesChange={setSelectedTypes}
          />
        </div>
      </div>

      {/* Feed */}
      <main className="container mx-auto px-4 py-6">
        {loading && events.length === 0 ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-slate-400">Loading feed...</div>
          </div>
        ) : events.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="text-lg text-slate-400">No events yet</div>
            <div className="mt-2 text-sm text-slate-500">
              Events will appear here as they happen
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
