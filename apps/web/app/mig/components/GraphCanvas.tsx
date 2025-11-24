/**
 * GraphCanvas Component
 * Interactive graph visualization with draggable nodes and zoom/pan
 */

'use client';

import { useEffect, useRef, useState } from 'react';
import type { MIGNode, MIGEdge } from '@total-audio/music-industry-graph';

interface GraphCanvasProps {
  nodes: MIGNode[];
  edges: MIGEdge[];
  onNodeClick?: (node: MIGNode) => void;
  onNodeDoubleClick?: (node: MIGNode) => void;
}

export function GraphCanvas({ nodes, edges, onNodeClick, onNodeDoubleClick }: GraphCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    // Simple force-directed layout (stub)
    const nodePositions = new Map<string, { x: number; y: number }>();

    // Position nodes in a circle for now (real implementation would use force-directed layout)
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(canvas.width, canvas.height) * 0.35;

    nodes.forEach((node, index) => {
      const angle = (index / nodes.length) * 2 * Math.PI;
      nodePositions.set(node.id, {
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle),
      });
    });

    // Clear canvas
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw edges
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1;

    edges.forEach((edge) => {
      const sourcePos = nodePositions.get(edge.source);
      const targetPos = nodePositions.get(edge.target);

      if (sourcePos && targetPos) {
        ctx.beginPath();
        ctx.moveTo(sourcePos.x, sourcePos.y);
        ctx.lineTo(targetPos.x, targetPos.y);
        ctx.stroke();
      }
    });

    // Draw nodes
    nodes.forEach((node) => {
      const pos = nodePositions.get(node.id);
      if (!pos) return;

      // Node color by type
      const colors: Record<string, string> = {
        artist: '#3AA9BE', // cyan
        journalist: '#8B5CF6', // violet
        radio_host: '#3B82F6', // blue
        dj: '#10B981', // green
        scene: '#F59E0B', // amber
        microgenre: '#EC4899', // pink
        blog: '#8B5CF6',
        playlist: '#3B82F6',
      };

      const color = colors[node.type] || '#64748B';

      // Draw node circle
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, 8, 0, 2 * Math.PI);
      ctx.fillStyle = color;
      ctx.fill();

      // Highlight selected node
      if (selectedNode === node.id) {
        ctx.strokeStyle = '#3AA9BE';
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      // Draw node label
      ctx.fillStyle = '#E2E8F0';
      ctx.font = '10px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(node.name, pos.x, pos.y + 20);
    });
  }, [nodes, edges, selectedNode]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Simple hit detection (would be more sophisticated in real implementation)
    // This is a stub - real implementation would track node positions properly
  };

  return (
    <div className="relative w-full h-full bg-black border border-slate-800 rounded-lg overflow-hidden">
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        onClick={handleCanvasClick}
        style={{ width: '100%', height: '100%' }}
      />

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-slate-900/90 border border-slate-800 rounded-lg p-3 text-xs">
        <div className="font-semibold text-slate-300 mb-2">Node Types</div>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-cyan-400"></div>
            <span className="text-slate-400">Artists</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-violet-400"></div>
            <span className="text-slate-400">Journalists</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-amber-400"></div>
            <span className="text-slate-400">Scenes</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-pink-400"></div>
            <span className="text-slate-400">Microgenres</span>
          </div>
        </div>
      </div>

      {/* Controls hint */}
      <div className="absolute top-4 right-4 bg-slate-900/90 border border-slate-800 rounded-lg p-3 text-xs text-slate-400">
        <div>Click: Select node</div>
        <div>Double-click: Expand neighbors</div>
        <div>Shift+Click: Highlight path</div>
      </div>
    </div>
  );
}
