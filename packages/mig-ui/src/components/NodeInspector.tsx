/**
 * Node Inspector Drawer - Phase 5
 * Shows detailed node information (UI-only, reads from existing APIs)
 */

'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { NodeInspectorState } from '../types';
import { NODE_COLORS } from '../types';

export interface NodeInspectorProps extends NodeInspectorState {
  onClose: () => void;
  onShowPath?: (targetId: string) => void;
}

export function NodeInspector({
  isOpen,
  selectedNode,
  loading,
  data,
  onClose,
  onShowPath,
}: NodeInspectorProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        className="fixed top-0 right-0 h-screen w-[400px] bg-black border-l border-[#3AA9BE]/20 z-50 overflow-y-auto"
      >
        {/* Header */}
        <div className="sticky top-0 bg-black border-b border-[#3AA9BE]/20 p-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="text-xs text-gray-500 font-mono mb-1">
                {selectedNode?.type}
              </div>
              <h2 className="text-lg font-medium text-white">{selectedNode?.name}</h2>
              <div className="text-xs text-gray-600 font-mono mt-1">
                {selectedNode?.slug}
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="width" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Node type indicator */}
          {selectedNode && (
            <div className="mt-3 flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: NODE_COLORS[selectedNode.type] }}
              />
              <span className="text-xs text-gray-400">{selectedNode.type}</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4 space-y-6">
          {loading ? (
            <div className="text-center py-8">
              <div className="inline-block w-6 h-6 border-2 border-[#3AA9BE] border-t-transparent rounded-full animate-spin" />
              <div className="text-sm text-gray-500 mt-2">loading data...</div>
            </div>
          ) : (
            <>
              {/* Neighbors */}
              {data.neighbors && data.neighbors.length > 0 && (
                <Section title="connected nodes" count={data.neighbors.length}>
                  <div className="space-y-2">
                    {data.neighbors.slice(0, 10).map((neighbor: any) => (
                      <div
                        key={neighbor.neighbor_id}
                        className="flex items-center justify-between p-2 bg-white/5 rounded hover:bg-white/10 transition-colors cursor-pointer"
                        onClick={() => onShowPath?.(neighbor.neighbor_id)}
                      >
                        <div className="flex-1 min-w-0">
                          <div className="text-sm text-white truncate">{neighbor.neighbor_name}</div>
                          <div className="text-xs text-gray-500">{neighbor.relationship}</div>
                        </div>
                        <div className="text-xs text-[#3AA9BE]">
                          {neighbor.weight.toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>
                </Section>
              )}

              {/* Scene Alignment (artists only) */}
              {data.sceneAlignment && data.sceneAlignment.length > 0 && (
                <Section title="scene alignment">
                  <div className="space-y-2">
                    {data.sceneAlignment.map((scene: any) => (
                      <div key={scene.scene_slug} className="p-2 bg-white/5 rounded">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm text-white">{scene.scene_slug}</span>
                          <span className="text-xs text-[#3AA9BE]">
                            {(scene.alignment * 100).toFixed(0)}%
                          </span>
                        </div>
                        <div className="text-xs text-gray-500">{scene.reasoning}</div>
                      </div>
                    ))}
                  </div>
                </Section>
              )}

              {/* Pitch Opportunities (artists only) */}
              {data.opportunities && data.opportunities.length > 0 && (
                <Section title="pitch opportunities">
                  <div className="space-y-2">
                    {data.opportunities.map((opp: any) => (
                      <div key={opp.slug} className="p-2 bg-white/5 rounded hover:bg-white/10 transition-colors">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm text-white">{opp.name}</span>
                          <span className="text-xs text-[#3AA9BE]">
                            {(opp.fit_score * 100).toFixed(0)}%
                          </span>
                        </div>
                        <div className="text-xs text-gray-500 mb-1">{opp.type}</div>
                        <div className="text-xs text-gray-400">{opp.reasoning}</div>
                      </div>
                    ))}
                  </div>
                </Section>
              )}

              {/* Metadata */}
              {selectedNode?.metadata && Object.keys(selectedNode.metadata).length > 0 && (
                <Section title="metadata">
                  <div className="space-y-1 text-xs">
                    {Object.entries(selectedNode.metadata).map(([key, value]) => (
                      <div key={key} className="flex justify-between">
                        <span className="text-gray-500">{key}:</span>
                        <span className="text-gray-400">{JSON.stringify(value)}</span>
                      </div>
                    ))}
                  </div>
                </Section>
              )}

              {/* Why these results? */}
              <Section title="transparency">
                <div className="text-xs text-gray-500 leading-relaxed">
                  results based on graph proximity, relationship weights, and deterministic scoring.
                  no black-box ai. all data from existing mig apis.
                </div>
              </Section>
            </>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

function Section({
  title,
  count,
  children,
}: {
  title: string;
  count?: number;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-mono text-[#3AA9BE]">{title}</h3>
        {count !== undefined && (
          <span className="text-xs text-gray-600">({count})</span>
        )}
      </div>
      {children}
    </div>
  );
}
