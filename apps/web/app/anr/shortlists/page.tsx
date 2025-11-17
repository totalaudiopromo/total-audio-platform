/**
 * A&R Shortlists
 * /anr/shortlists
 */

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function ShortlistsPage() {
  const [shortlists, setShortlists] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [criteria, setCriteria] = useState({
    scenes: '',
    min_score: 0.6,
    limit: 20,
  });

  useEffect(() => {
    fetchShortlists();
  }, []);

  const fetchShortlists = async () => {
    try {
      const res = await fetch('/api/anr/shortlists');
      const data = await res.json();
      setShortlists(data.data || []);
    } catch (error) {
      console.error('Failed to fetch shortlists:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    try {
      const parsedCriteria = {
        scenes: criteria.scenes ? criteria.scenes.split(',').map(s => s.trim()) : undefined,
        min_composite_score: criteria.min_score,
        limit: criteria.limit,
      };

      const res = await fetch('/api/anr/shortlists', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ criteria: parsedCriteria }),
      });

      if (res.ok) {
        await fetchShortlists();
        setShowCreate(false);
        setCriteria({ scenes: '', min_score: 0.6, limit: 20 });
      }
    } catch (error) {
      console.error('Failed to create shortlist:', error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Link href="/anr" className="text-cyan-400 hover:text-cyan-300 mb-2 inline-block">
            ← Back to Dashboard
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Shortlists</h1>
              <p className="text-slate-400">Saved scouting shortlists</p>
            </div>
            <button
              onClick={() => setShowCreate(!showCreate)}
              className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg transition-colors"
            >
              {showCreate ? 'Cancel' : 'New Shortlist'}
            </button>
          </div>
        </div>

        {/* Create Shortlist Form */}
        {showCreate && (
          <div className="bg-slate-800 rounded-2xl p-6 mb-6">
            <h2 className="text-lg font-bold text-white mb-4">Create Shortlist</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-slate-400 mb-2">Scenes (comma-separated)</label>
                <input
                  type="text"
                  value={criteria.scenes}
                  onChange={(e) => setCriteria({ ...criteria, scenes: e.target.value })}
                  placeholder="e.g. hyperpop-uk, drill-london"
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                />
              </div>

              <div>
                <label className="block text-sm text-slate-400 mb-2">Min Score</label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={criteria.min_score}
                  onChange={(e) => setCriteria({ ...criteria, min_score: parseFloat(e.target.value) })}
                  className="w-full"
                />
                <div className="text-sm text-cyan-400 font-mono mt-1">
                  {(criteria.min_score * 100).toFixed(0)}%
                </div>
              </div>

              <div>
                <label className="block text-sm text-slate-400 mb-2">Limit</label>
                <input
                  type="number"
                  value={criteria.limit}
                  onChange={(e) => setCriteria({ ...criteria, limit: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                />
              </div>

              <button
                onClick={handleCreate}
                className="w-full px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg transition-colors"
              >
                Generate Shortlist
              </button>
            </div>
          </div>
        )}

        {/* Shortlists List */}
        <div className="space-y-4">
          {loading ? (
            <div className="text-slate-400">Loading...</div>
          ) : shortlists.length > 0 ? (
            shortlists.map((shortlist) => (
              <Link
                key={shortlist.id}
                href={`/anr/shortlists/${shortlist.id}`}
                className="block bg-slate-800 rounded-2xl p-6 hover:bg-slate-750 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-white mb-1">{shortlist.name}</h3>
                    {shortlist.description && (
                      <p className="text-sm text-slate-400">{shortlist.description}</p>
                    )}
                  </div>
                  <div className="text-sm text-slate-400">
                    {new Date(shortlist.created_at).toLocaleDateString()}
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="bg-slate-800 rounded-2xl p-8 text-center text-slate-400">
              No shortlists yet. Create one to get started.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
