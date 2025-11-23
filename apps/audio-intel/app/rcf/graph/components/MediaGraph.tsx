/**
 * Media Graph Component
 * Force-directed graph visualization of media ecosystem
 */

'use client';

import { useState, useEffect } from 'react';
import { GraphNode } from './GraphNode';
import { GraphEdge } from './GraphEdge';

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

interface MediaGraphProps {
  nodes: Node[];
  edges: Edge[];
}

interface NodePosition {
  id: string;
  x: number;
  y: number;
}

export function MediaGraph({ nodes, edges }: MediaGraphProps) {
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [nodePositions, setNodePositions] = useState<NodePosition[]>([]);

  useEffect(() => {
    // Simple circular layout algorithm
    const positions = nodes.map((node, idx) => {
      const angle = (idx / nodes.length) * 2 * Math.PI;
      const radius = Math.min(250, 150 + nodes.length * 5);
      return {
        id: node.id,
        x: 300 + radius * Math.cos(angle),
        y: 300 + radius * Math.sin(angle),
      };
    });

    setNodePositions(positions);
  }, [nodes]);

  function getNodePosition(nodeId: string): { x: number; y: number } {
    const pos = nodePositions.find((p) => p.id === nodeId);
    return pos || { x: 300, y: 300 };
  }

  if (nodes.length === 0) {
    return (
      <div className="text-center py-12 text-slate-400">
        <div className="text-lg mb-2">No graph data available</div>
        <div className="text-sm">
          The media graph will appear once relationships between sources are detected
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Graph Canvas */}
      <div className="relative w-full h-[600px] bg-slate-900/50 rounded-lg border border-slate-800 overflow-hidden">
        {/* Edges (render first, behind nodes) */}
        {edges.map((edge, idx) => {
          const startPos = getNodePosition(edge.source_node_id);
          const endPos = getNodePosition(edge.target_node_id);

          return (
            <GraphEdge
              key={`edge-${idx}`}
              startX={startPos.x + 40} // Center of node (80px / 2)
              startY={startPos.y + 40}
              endX={endPos.x + 40}
              endY={endPos.y + 40}
              weight={edge.weight}
              edgeType={edge.edge_type}
            />
          );
        })}

        {/* Nodes */}
        {nodes.map((node) => {
          const pos = getNodePosition(node.id);

          return (
            <GraphNode
              key={node.id}
              id={node.id}
              nodeType={node.node_type}
              name={node.name}
              credibilityScore={node.credibility_score}
              influenceScore={node.influence_score}
              category={node.category}
              onClick={() => setSelectedNode(node)}
              style={{
                left: pos.x,
                top: pos.y,
              }}
            />
          );
        })}
      </div>

      {/* Legend */}
      <div className="bg-slate-900/50 rounded-lg border border-slate-800 p-4">
        <div className="text-sm font-medium text-slate-300 mb-3 font-mono">Node Types</div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded-full bg-emerald-500 border border-emerald-400" />
            <span className="text-sm text-slate-400 font-mono">Publication</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded-full bg-purple-500 border border-purple-400" />
            <span className="text-sm text-slate-400 font-mono">Playlist</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded-full bg-blue-500 border border-blue-400" />
            <span className="text-sm text-slate-400 font-mono">Station</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded-full bg-amber-500 border border-amber-400" />
            <span className="text-sm text-slate-400 font-mono">Blog</span>
          </div>
        </div>
      </div>

      {/* Selected Node Details */}
      {selectedNode && (
        <div className="bg-slate-900/50 rounded-lg border border-slate-800 p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-3">
                <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded text-sm font-mono">
                  {selectedNode.node_type.toUpperCase()}
                </span>
                {selectedNode.category && (
                  <span className="px-2 py-1 bg-slate-800 text-slate-400 border border-slate-700 rounded text-xs font-mono">
                    {selectedNode.category}
                  </span>
                )}
              </div>

              <h3 className="text-xl font-semibold text-slate-100 mb-4">{selectedNode.name}</h3>

              <div className="grid grid-cols-2 gap-4">
                {selectedNode.credibility_score !== undefined && (
                  <div>
                    <div className="text-xs text-slate-500 font-mono mb-1">Credibility</div>
                    <div className="text-lg font-bold text-[#3AA9BE] font-mono">
                      {(selectedNode.credibility_score * 100).toFixed(0)}%
                    </div>
                  </div>
                )}

                {selectedNode.influence_score !== undefined && (
                  <div>
                    <div className="text-xs text-slate-500 font-mono mb-1">Influence</div>
                    <div className="text-lg font-bold text-purple-400 font-mono">
                      {(selectedNode.influence_score * 100).toFixed(0)}%
                    </div>
                  </div>
                )}
              </div>

              {/* Find connected edges */}
              {(() => {
                const connectedEdges = edges.filter(
                  (e) => e.source_node_id === selectedNode.id || e.target_node_id === selectedNode.id
                );

                if (connectedEdges.length > 0) {
                  return (
                    <div className="mt-4 pt-4 border-t border-slate-800">
                      <div className="text-xs text-slate-500 font-mono mb-2">
                        Connections: {connectedEdges.length}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {connectedEdges.slice(0, 5).map((edge, idx) => {
                          const connectedNodeId =
                            edge.source_node_id === selectedNode.id
                              ? edge.target_node_id
                              : edge.source_node_id;
                          const connectedNode = nodes.find((n) => n.id === connectedNodeId);

                          return connectedNode ? (
                            <button
                              key={idx}
                              onClick={() => setSelectedNode(connectedNode)}
                              className="px-2 py-1 bg-slate-800 text-slate-300 rounded text-xs hover:bg-slate-700 transition-colors"
                            >
                              {connectedNode.name}
                            </button>
                          ) : null;
                        })}
                        {connectedEdges.length > 5 && (
                          <span className="text-xs text-slate-500">
                            +{connectedEdges.length - 5} more
                          </span>
                        )}
                      </div>
                    </div>
                  );
                }
              })()}
            </div>

            <button
              onClick={() => setSelectedNode(null)}
              className="ml-4 px-3 py-2 bg-slate-800 text-slate-300 rounded-lg text-sm font-medium hover:bg-slate-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
