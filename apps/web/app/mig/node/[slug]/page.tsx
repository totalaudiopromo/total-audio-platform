/**
 * MIG Node Detail Page
 * /mig/node/[slug]
 */

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { NodeDetailPanel } from '../../components/NodeDetailPanel';

export default function NodeDetailPage({ params }: { params: { slug: string } }) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchNode() {
      try {
        const response = await fetch(`/api/mig/node/${params.slug}`);
        const result = await response.json();

        if (result.success) {
          setData(result.data);
        }
      } catch (error) {
        console.error('Error fetching node:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchNode();
  }, [params.slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-slate-400">Loading node...</div>
      </div>
    );
  }

  if (!data || !data.node) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-slate-400 mb-4">Node not found</div>
          <Link
            href="/mig/search"
            className="px-4 py-2 bg-cyan-600/20 border border-cyan-500/50 rounded text-cyan-300 hover:bg-cyan-600/30 transition-colors"
          >
            Search MIG
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="border-b border-slate-800 bg-black/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-cyan-400">{data.node.name}</h1>
              <p className="text-sm text-slate-400 mt-1">
                {data.node.type.replace('_', ' ').toUpperCase()}
              </p>
            </div>
            <Link
              href="/mig/search"
              className="px-4 py-2 bg-slate-800/50 border border-slate-700 rounded text-sm text-slate-300 hover:border-cyan-500/50 transition-colors"
            >
              ← Back to Search
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Node Details */}
          <div className="lg:col-span-2">
            <NodeDetailPanel node={data.node} />

            {/* Neighbors */}
            {data.neighbors && data.neighbors.length > 0 && (
              <div className="mt-8 bg-slate-900/30 border border-slate-800 rounded-lg p-6">
                <h2 className="text-lg font-semibold text-slate-300 mb-4">
                  Connected Nodes ({data.neighbors.length})
                </h2>
                <div className="space-y-2">
                  {data.neighbors.slice(0, 10).map((neighbor: any) => (
                    <Link
                      key={neighbor.neighbor_id}
                      href={`/mig/node/${neighbor.neighbor_id}`}
                      className="block p-3 bg-slate-900/50 border border-slate-800 rounded hover:border-cyan-500/50 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-white">{neighbor.neighbor_name}</div>
                          <div className="text-xs text-slate-400">{neighbor.neighbor_type}</div>
                        </div>
                        <div className="text-sm text-slate-500">
                          {neighbor.relationship} • {neighbor.weight.toFixed(2)}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Actions Sidebar */}
          <div>
            <div className="bg-slate-900/30 border border-slate-800 rounded-lg p-6 sticky top-24">
              <h3 className="text-lg font-semibold text-slate-300 mb-4">Actions</h3>
              <div className="space-y-3">
                <Link
                  href={`/mig/scene/${params.slug}`}
                  className="block w-full px-4 py-2 bg-cyan-600/20 border border-cyan-500/50 rounded text-sm text-cyan-300 text-center hover:bg-cyan-600/30 transition-all duration-240"
                >
                  View as Scene Graph
                </Link>
                <button className="w-full px-4 py-2 bg-slate-800/50 border border-slate-700 rounded text-sm text-slate-300 hover:bg-slate-800 transition-all duration-240">
                  Find Similar
                </button>
                <button className="w-full px-4 py-2 bg-slate-800/50 border border-slate-700 rounded text-sm text-slate-300 hover:bg-slate-800 transition-all duration-240">
                  Influence Analysis
                </button>
                <Link
                  href="/mig/console"
                  className="block w-full px-4 py-2 bg-slate-800/50 border border-slate-700 rounded text-sm text-slate-300 text-center hover:bg-slate-800 transition-all duration-240"
                >
                  Query in Console
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
