/**
 * MIG Scene Detail Page
 * /mig/scene/[slug]
 */

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { GraphCanvas } from '../../components/GraphCanvas';

export default function SceneDetailPage({ params }: { params: { slug: string } }) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchScene() {
      try {
        const response = await fetch(`/api/mig/scene/${params.slug}`);
        const result = await response.json();

        if (result.success) {
          setData(result.data);
        }
      } catch (error) {
        console.error('Error fetching scene:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchScene();
  }, [params.slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-slate-400">Loading scene graph...</div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-slate-400 mb-4">Scene not found</div>
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
              <h1 className="text-2xl font-bold text-amber-400">Scene: {params.slug}</h1>
              <p className="text-sm text-slate-400 mt-1">
                {data.total_results} connected entities
              </p>
            </div>
            <Link
              href="/mig/pulse"
              className="px-4 py-2 bg-slate-800/50 border border-slate-700 rounded text-sm text-slate-300 hover:border-cyan-500/50 transition-colors"
            >
              View Scene Pulse →
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Graph Visualization */}
          <div className="lg:col-span-3">
            <div className="bg-slate-900/30 border border-slate-800 rounded-lg overflow-hidden" style={{ height: '600px' }}>
              <GraphCanvas nodes={data.nodes || []} edges={data.edges || []} />
            </div>
          </div>

          {/* Stats Sidebar */}
          <div>
            <div className="bg-slate-900/30 border border-slate-800 rounded-lg p-6 sticky top-24">
              <h3 className="text-lg font-semibold text-slate-300 mb-4">Scene Stats</h3>

              <div className="space-y-4">
                <div>
                  <div className="text-sm text-slate-400">Total Nodes</div>
                  <div className="text-2xl font-bold text-cyan-400">{data.nodes?.length || 0}</div>
                </div>

                <div>
                  <div className="text-sm text-slate-400">Connections</div>
                  <div className="text-2xl font-bold text-violet-400">{data.edges?.length || 0}</div>
                </div>

                <div className="pt-4 border-t border-slate-800">
                  <div className="text-sm text-slate-400 mb-2">Entity Breakdown</div>
                  {data.nodes && (
                    <div className="space-y-1 text-xs">
                      {Object.entries(
                        data.nodes.reduce((acc: any, node: any) => {
                          acc[node.type] = (acc[node.type] || 0) + 1;
                          return acc;
                        }, {})
                      ).map(([type, count]) => (
                        <div key={type} className="flex justify-between text-slate-400">
                          <span>{type}</span>
                          <span>{count as number}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
