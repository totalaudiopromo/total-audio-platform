/**
 * NodeDetailPanel Component
 * Displays detailed information about a selected node
 */

'use client';

import type { MIGNode } from '@total-audio/music-industry-graph';

interface NodeDetailPanelProps {
  node: MIGNode | null;
  onClose?: () => void;
}

export function NodeDetailPanel({ node, onClose }: NodeDetailPanelProps) {
  if (!node) {
    return (
      <div className="h-full flex items-center justify-center text-slate-500">
        Select a node to view details
      </div>
    );
  }

  const typeColors: Record<string, string> = {
    artist: 'text-cyan-400',
    journalist: 'text-violet-400',
    radio_host: 'text-blue-400',
    dj: 'text-green-400',
    scene: 'text-amber-400',
    microgenre: 'text-pink-400',
  };

  const typeColor = typeColors[node.type] || 'text-slate-400';

  return (
    <div className="h-full flex flex-col bg-slate-900/30 border border-slate-800 rounded-lg overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-slate-800">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-white mb-1">{node.name}</h3>
            <span className={`text-sm ${typeColor} font-medium`}>
              {node.type.replace('_', ' ').toUpperCase()}
            </span>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white transition-colors"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Basic Info */}
        <section>
          <h4 className="text-sm font-semibold text-slate-300 mb-2">Basic Information</h4>
          <div className="space-y-2 text-sm">
            {node.country && (
              <div className="flex justify-between">
                <span className="text-slate-400">Country:</span>
                <span className="text-slate-200">{node.country}</span>
              </div>
            )}
            {node.metadata?.location?.city && (
              <div className="flex justify-between">
                <span className="text-slate-400">City:</span>
                <span className="text-slate-200">{node.metadata.location.city}</span>
              </div>
            )}
          </div>
        </section>

        {/* Genres */}
        {node.metadata?.genres && node.metadata.genres.length > 0 && (
          <section>
            <h4 className="text-sm font-semibold text-slate-300 mb-2">Genres</h4>
            <div className="flex flex-wrap gap-2">
              {node.metadata.genres.map((genre: string) => (
                <span
                  key={genre}
                  className="px-2 py-1 bg-slate-800/50 border border-slate-700 rounded text-xs text-slate-300"
                >
                  {genre}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Social Links */}
        {node.metadata?.social && (
          <section>
            <h4 className="text-sm font-semibold text-slate-300 mb-2">Links</h4>
            <div className="space-y-1">
              {node.metadata.social.website && (
                <a
                  href={node.metadata.social.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  Website →
                </a>
              )}
              {node.metadata.social.twitter && (
                <a
                  href={`https://twitter.com/${node.metadata.social.twitter}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  Twitter →
                </a>
              )}
            </div>
          </section>
        )}

        {/* Description */}
        {node.metadata?.description && (
          <section>
            <h4 className="text-sm font-semibold text-slate-300 mb-2">Description</h4>
            <p className="text-sm text-slate-400">{node.metadata.description}</p>
          </section>
        )}

        {/* Actions */}
        <section className="pt-4 border-t border-slate-800">
          <div className="space-y-2">
            <button className="w-full px-3 py-2 bg-cyan-600/20 border border-cyan-500/50 rounded text-sm text-cyan-300 hover:bg-cyan-600/30 transition-all duration-240">
              View Neighborhood
            </button>
            <button className="w-full px-3 py-2 bg-slate-800/50 border border-slate-700 rounded text-sm text-slate-300 hover:bg-slate-800 transition-all duration-240">
              Find Similar
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
