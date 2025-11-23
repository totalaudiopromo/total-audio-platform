/**
 * MIG AI Console - Natural Language Query Interface
 * /mig/console
 */

'use client';

import { useState } from 'react';
import { EXAMPLE_QUERIES } from '../../../../../packages/mig-ai-console/src/index';

export default function MIGConsolePage() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [history, setHistory] = useState<Array<{ query: string; result: any }>>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);

    try {
      const response = await fetch('/api/mig-integration/console/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });

      const data = await response.json();

      if (data.success) {
        setResult(data.data);
        setHistory([{ query, result: data.data }, ...history]);
        setQuery('');
      }
    } catch (error) {
      console.error('Query error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExampleClick = (example: string) => {
    setQuery(example);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-slate-800 bg-black/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <h1 className="text-2xl font-bold text-cyan-400">MIG AI Console</h1>
          <p className="text-sm text-slate-400 mt-1">Natural language queries over the Music Industry Graph</p>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Query Interface */}
          <div className="lg:col-span-2">
            <div className="bg-slate-900/30 border border-slate-800 rounded-lg p-6">
              <form onSubmit={handleSubmit} className="mb-6">
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Ask anything about the music industry graph
                </label>
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="e.g., What's the shortest path from my artist to NME journalists?"
                    className="flex-1 px-4 py-3 bg-slate-900/50 border border-slate-800 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 transition-colors"
                    disabled={loading}
                  />
                  <button
                    type="submit"
                    disabled={loading || !query.trim()}
                    className="px-6 py-3 bg-cyan-600/20 border border-cyan-500/50 rounded-lg text-cyan-300 font-medium hover:bg-cyan-600/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-240"
                  >
                    {loading ? 'Querying...' : 'Ask'}
                  </button>
                </div>
              </form>

              {/* Result Display */}
              {result && (
                <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4 mb-6">
                  <h3 className="text-lg font-semibold text-cyan-400 mb-2">Answer</h3>
                  <p className="text-slate-300 mb-4">{result.answer}</p>

                  {result.data && (
                    <div className="bg-black/50 rounded p-3 font-mono text-xs text-slate-400 overflow-auto max-h-96">
                      <pre>{JSON.stringify(result.data, null, 2)}</pre>
                    </div>
                  )}

                  {result.suggested_followups && result.suggested_followups.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-slate-700">
                      <div className="text-sm text-slate-400 mb-2">Suggested follow-ups:</div>
                      <div className="flex flex-wrap gap-2">
                        {result.suggested_followups.map((followup: string, i: number) => (
                          <button
                            key={i}
                            onClick={() => setQuery(followup)}
                            className="px-3 py-1 bg-slate-800/50 border border-slate-700 rounded text-xs text-cyan-300 hover:border-cyan-500/50 transition-colors"
                          >
                            {followup}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Query History */}
              {history.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-slate-300 mb-3">Recent Queries</h3>
                  <div className="space-y-2">
                    {history.map((item, i) => (
                      <button
                        key={i}
                        onClick={() => setQuery(item.query)}
                        className="w-full text-left px-3 py-2 bg-slate-900/30 border border-slate-800 rounded text-sm text-slate-400 hover:border-cyan-500/50 hover:text-cyan-300 transition-colors"
                      >
                        {item.query}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Examples Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-slate-900/30 border border-slate-800 rounded-lg p-6 sticky top-24">
              <h3 className="text-lg font-semibold text-slate-300 mb-3">Example Queries</h3>
              <div className="space-y-2">
                {EXAMPLE_QUERIES.map((example, i) => (
                  <button
                    key={i}
                    onClick={() => handleExampleClick(example)}
                    className="w-full text-left px-3 py-2 bg-slate-900/50 border border-slate-800 rounded text-sm text-slate-400 hover:border-cyan-500/50 hover:text-cyan-300 transition-all duration-240"
                  >
                    {example}
                  </button>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t border-slate-800">
                <h4 className="text-sm font-semibold text-slate-400 mb-2">Query Types</h4>
                <div className="space-y-2 text-xs text-slate-500">
                  <div>• <span className="text-cyan-400">Path queries</span>: Find connections</div>
                  <div>• <span className="text-violet-400">Recommendations</span>: Discover similar entities</div>
                  <div>• <span className="text-amber-400">Discovery</span>: Search the graph</div>
                  <div>• <span className="text-pink-400">Analysis</span>: Compute metrics</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
