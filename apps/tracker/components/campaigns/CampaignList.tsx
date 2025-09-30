'use client';

import { useMemo, useState } from 'react';
import type { Campaign } from '@/lib/types';
import { CampaignCard } from '@/components/campaigns/CampaignCard';

type Props = { campaigns: Campaign[] };

const tabs = ['All', 'Active', 'Draft', 'Paused', 'Completed'] as const;

export function CampaignList({ campaigns }: Props) {
  const [query, setQuery] = useState('');
  const [tab, setTab] = useState<(typeof tabs)[number]>('All');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = campaigns;
    if (tab !== 'All') list = list.filter(c => c.status.toLowerCase() === tab.toLowerCase());
    if (q) list = list.filter(c => `${c.name} ${c.artist_name}`.toLowerCase().includes(q));
    return list;
  }, [campaigns, query, tab]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-2 flex-wrap">
          {tabs.map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`rounded-lg px-4 py-2 text-sm font-semibold transition-all ${
                tab === t
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                  : 'border-2 border-slate-200 hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
        <div className="relative">
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search campaigns..."
            className="w-full sm:w-80 rounded-xl border-2 border-slate-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-800 dark:border-slate-700"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-slate-300 p-16 text-center bg-slate-50/50 dark:bg-slate-800/50">
          <p className="text-slate-600 dark:text-slate-400 text-lg mb-4">
            {campaigns.length === 0 ? "No campaigns yet" : "No campaigns match your filters"}
          </p>
          <a
            href="/campaigns/new"
            className="inline-flex items-center rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3 text-white text-sm font-semibold hover:from-blue-700 hover:to-purple-700 shadow-lg transition-all"
          >
            Create Your First Campaign
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(c => (
            <CampaignCard key={c.id} campaign={c} />
          ))}
        </div>
      )}
    </div>
  );
}




