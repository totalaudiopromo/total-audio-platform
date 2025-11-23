/**
 * RCF Graph Page
 * Media ecosystem graph visualization showing relationships between sources
 */

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { MediaGraph } from './components/MediaGraph';

interface Node {
  id: string;
  node_type: 'publication' | 'playlist' | 'station' | 'blog';
  node_slug: string;
  name: string;
  credibility_score?: number;
  influence_score?: number;
  category?: string;
}

interface Edge {
  source_node_id: string;
  target_node_id: string;
  edge_type?: string;
  weight?: number;
}

interface GraphData {
  nodes: Node[];
  edges: Edge[];
}

export default function RCFGraphPage() {
  const [graphData, setGraphData] = useState<GraphData>({ nodes: [], edges: [] });
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<'all' | 'publication' | 'playlist' | 'station' | 'blog'>('all');

  useEffect(() => {
    fetchGraph();
  }, []);

  async function fetchGraph() {
    try {
      setLoading(true);
      const response = await fetch('/api/rcf/graph');
      const result = await response.json();

      if (result.success) {
        setGraphData(result.data);
      }
    } catch (error) {
      console.error('Failed to fetch graph:', error);
    } finally {
      setLoading(false);
    }
  }

  // Filter nodes by type
  const filteredNodes =
    filterType === 'all'
      ? graphData.nodes
      : graphData.nodes.filter((node) => node.node_type === filterType);

  // Filter edges to only show connections between visible nodes
  const filteredNodeIds = new Set(filteredNodes.map((n) => n.id));
  const filteredEdges = graphData.edges.filter(
    (edge) => filteredNodeIds.has(edge.source_node_id) && filteredNodeIds.has(edge.target_node_id)
  );

  const stats = {
    totalNodes: graphData.nodes.length,
    totalEdges: graphData.edges.length,
    publications: graphData.nodes.filter((n) => n.node_type === 'publication').length,
    playlists: graphData.nodes.filter((n) => n.node_type === 'playlist').length,
    stations: graphData.nodes.filter((n) => n.node_type === 'station').length,
    blogs: graphData.nodes.filter((n) => n.node_type === 'blog').length,
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-slate-100">
      <header className="sticky top-0 z-10 border-b border-slate-800 bg-[#0a0a0a]/95 backdrop-blur">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-start justify-between">
            <div>
              <Link
                href="/rcf"
                className="text-sm text-[#3AA9BE] hover:text-[#3AA9BE]/80 transition-colors duration-240"
              >
                ← Back to Feed
              </Link>
              <h1 className="mt-2 text-2xl font-bold tracking-tight">Media Ecosystem Graph</h1>
              <p className="text-sm text-slate-400 mt-1">
                {stats.totalNodes} nodes, {stats.totalEdges} relationships
              </p>
            </div>

            <div className="flex flex-col items-end space-y-3">
              <div className="text-xs text-slate-400 font-mono">Filter by type:</div>
              <div className="flex flex-wrap gap-2">
                {(['all', 'publication', 'playlist', 'station', 'blog'] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => setFilterType(type)}
                    className={`
                      px-3 py-1.5 text-sm font-medium font-mono rounded-lg
                      transition-all duration-240 ease-out
                      ${
                        filterType === type
                          ? 'bg-[#3AA9BE] text-white'
                          : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
                      }
                    `}
                  >
                    {type === 'all' ? 'All' : type.charAt(0).toUpperCase() + type.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-6xl space-y-8">
          {/* Statistics Panel */}
          <div className="bg-slate-900/50 rounded-lg border border-slate-800 p-6">
            <h2 className="text-sm font-semibold text-slate-300 mb-4 font-mono">
              Ecosystem Overview
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-[#3AA9BE] font-mono">{stats.totalNodes}</div>
                <div className="text-xs text-slate-500 font-mono">Total Nodes</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-slate-400 font-mono">{stats.totalEdges}</div>
                <div className="text-xs text-slate-500 font-mono">Connections</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-emerald-400 font-mono">
                  {stats.publications}
                </div>
                <div className="text-xs text-slate-500 font-mono">Publications</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400 font-mono">{stats.playlists}</div>
                <div className="text-xs text-slate-500 font-mono">Playlists</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400 font-mono">{stats.stations}</div>
                <div className="text-xs text-slate-500 font-mono">Stations</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-amber-400 font-mono">{stats.blogs}</div>
                <div className="text-xs text-slate-500 font-mono">Blogs</div>
              </div>
            </div>
          </div>

          {/* Graph Visualization */}
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-pulse text-[#3AA9BE]">
                Loading media graph...
              </div>
            </div>
          ) : (
            <MediaGraph nodes={filteredNodes} edges={filteredEdges} />
          )}

          {/* Info Panel */}
          {!loading && graphData.nodes.length > 0 && (
            <div className="bg-blue-500/5 border border-blue-500/20 rounded-lg p-6">
              <h3 className="text-sm font-semibold text-blue-400 mb-3">How to Use the Graph</h3>
              <ul className="space-y-2 text-sm text-slate-400">
                <li className="flex items-start space-x-2">
                  <span className="text-blue-400 font-mono">•</span>
                  <span>Click on any node to view detailed information and connections</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-blue-400 font-mono">•</span>
                  <span>
                    Larger nodes indicate higher influence scores within the ecosystem
                  </span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-blue-400 font-mono">•</span>
                  <span>Thicker edge lines represent stronger relationships (more co-occurrences)</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-blue-400 font-mono">•</span>
                  <span>⭐ Star badge indicates high-credibility sources (80%+)</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-blue-400 font-mono">•</span>
                  <span>Use the type filters above to focus on specific source categories</span>
                </li>
              </ul>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
