/**
 * MIG Graph Canvas - Phase 5
 * Force-directed graph visualization (UI-only, no backend)
 */

'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import type { GraphData, GraphNode, GraphEdge, PerformanceMode, PathState } from '../types';
import {
  createForceSimulation,
  calculateNodeSize,
  isNodeInViewport,
} from '../utils/forceGraph';
import { NODE_COLORS } from '../types';

export interface GraphCanvasProps {
  data: GraphData;
  onNodeClick?: (node: GraphNode) => void;
  onNodeDoubleClick?: (node: GraphNode) => void;
  performanceMode?: PerformanceMode;
  pathState?: PathState;
  selectedNodeId?: string | null;
  className?: string;
}

export function GraphCanvas({
  data,
  onNodeClick,
  onNodeDoubleClick,
  performanceMode = 'normal',
  pathState,
  selectedNodeId,
  className = '',
}: GraphCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 1000, height: 800 });
  const [transform, setTransform] = useState({ x: 0, y: 0, k: 1 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const simulationRef = useRef<any>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Update dimensions on resize
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        setDimensions({ width, height });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Initialize and run force simulation
  useEffect(() => {
    if (data.nodes.length === 0) return;

    // Create simulation
    const simulation = createForceSimulation(
      data,
      dimensions.width,
      dimensions.height,
      performanceMode
    );

    simulationRef.current = simulation;

    // Render on each tick
    simulation.on('tick', () => {
      renderGraph();
    });

    // Stop simulation based on performance mode
    if (performanceMode === 'ultra') {
      simulation.alpha(0); // Stop immediately for ultra mode
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      simulation.stop();
    };
  }, [data, dimensions, performanceMode]);

  // Render graph on canvas
  const renderGraph = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, dimensions.width, dimensions.height);

    // Apply transform
    ctx.save();
    ctx.translate(transform.x, transform.y);
    ctx.scale(transform.k, transform.k);

    // Render edges first (behind nodes)
    renderEdges(ctx);

    // Render nodes
    renderNodes(ctx);

    ctx.restore();
  }, [data, dimensions, transform, performanceMode, pathState, selectedNodeId]);

  // Render edges
  const renderEdges = useCallback(
    (ctx: CanvasRenderingContext2D) => {
      data.edges.forEach((edge) => {
        const source = typeof edge.source === 'string'
          ? data.nodes.find(n => n.id === edge.source)
          : edge.source;
        const target = typeof edge.target === 'string'
          ? data.nodes.find(n => n.id === edge.target)
          : edge.target;

        if (!source || !target || !source.x || !source.y || !target.x || !target.y) {
          return;
        }

        // Check if edge is in path
        const isInPath = pathState?.edges.some((e) => e.id === edge.id);

        ctx.beginPath();
        ctx.moveTo(source.x, source.y);
        ctx.lineTo(target.x, target.y);

        if (isInPath) {
          ctx.strokeStyle = '#3AA9BE'; // Cyan for path
          ctx.lineWidth = 3 / transform.k;
        } else {
          ctx.strokeStyle = performanceMode === 'ultra' ? '#333' : 'rgba(255,255,255,0.1)';
          ctx.lineWidth = 1 / transform.k;
        }

        ctx.stroke();
      });
    },
    [data, transform, performanceMode, pathState]
  );

  // Render nodes
  const renderNodes = useCallback(
    (ctx: CanvasRenderingContext2D) => {
      data.nodes.forEach((node) => {
        if (!node.x || !node.y) return;

        // Viewport culling for performance
        if (!isNodeInViewport(node, transform, dimensions.width, dimensions.height)) {
          return;
        }

        const size = calculateNodeSize(node, performanceMode);
        const isSelected = node.id === selectedNodeId;
        const isInPath = pathState?.path.some((n) => n.id === node.id);

        // Node circle
        ctx.beginPath();
        ctx.arc(node.x, node.y, size, 0, 2 * Math.PI);

        // Fill color
        ctx.fillStyle = NODE_COLORS[node.type] || '#3AA9BE';
        ctx.fill();

        // Border for selected or path nodes
        if (isSelected || isInPath) {
          ctx.strokeStyle = '#3AA9BE';
          ctx.lineWidth = 3 / transform.k;
          ctx.stroke();
        }

        // Glow effect for selected (only in normal mode)
        if (isSelected && performanceMode === 'normal') {
          ctx.shadowColor = '#3AA9BE';
          ctx.shadowBlur = 20;
          ctx.fill();
          ctx.shadowBlur = 0;
        }

        // Node label (only for selected or large nodes)
        if (isSelected || size > 15) {
          ctx.fillStyle = '#ffffff';
          ctx.font = `${12 / transform.k}px Inter, sans-serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'top';
          ctx.fillText(node.name, node.x, node.y + size + 4);
        }
      });
    },
    [data, dimensions, transform, performanceMode, selectedNodeId, pathState]
  );

  // Mouse handlers for interaction
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - transform.x, y: e.clientY - transform.y });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isDragging) {
      setTransform({
        ...transform,
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left - transform.x) / transform.k;
    const y = (e.clientY - rect.top - transform.y) / transform.k;

    // Find clicked node
    const clickedNode = data.nodes.find((node) => {
      if (!node.x || !node.y) return false;
      const size = calculateNodeSize(node, performanceMode);
      const dx = x - node.x;
      const dy = y - node.y;
      return Math.sqrt(dx * dx + dy * dy) <= size;
    });

    if (clickedNode && onNodeClick) {
      onNodeClick(clickedNode);
    }
  };

  const handleDoubleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left - transform.x) / transform.k;
    const y = (e.clientY - rect.top - transform.y) / transform.k;

    // Find clicked node
    const clickedNode = data.nodes.find((node) => {
      if (!node.x || !node.y) return false;
      const size = calculateNodeSize(node, performanceMode);
      const dx = x - node.x;
      const dy = y - node.y;
      return Math.sqrt(dx * dx + dy * dy) <= size;
    });

    if (clickedNode && onNodeDoubleClick) {
      onNodeDoubleClick(clickedNode);
    }
  };

  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    const newK = Math.min(Math.max(transform.k * delta, 0.1), 5);

    // Zoom towards mouse position
    const newX = mouseX - (mouseX - transform.x) * (newK / transform.k);
    const newY = mouseY - (mouseY - transform.y) * (newK / transform.k);

    setTransform({ x: newX, y: newY, k: newK });
  };

  // Re-render on transform or path changes
  useEffect(() => {
    renderGraph();
  }, [transform, pathState, selectedNodeId]);

  return (
    <div ref={containerRef} className={`relative overflow-hidden ${className}`}>
      <canvas
        ref={canvasRef}
        width={dimensions.width}
        height={dimensions.height}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onClick={handleClick}
        onDoubleClick={handleDoubleClick}
        onWheel={handleWheel}
        className="cursor-grab active:cursor-grabbing"
        style={{
          background: '#0c0c0c',
        }}
      />

      {/* Legend */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute bottom-4 right-4 bg-black/80 backdrop-blur-sm border border-[#3AA9BE]/20 rounded-lg p-3 text-xs"
      >
        <div className="text-[#3AA9BE] font-mono mb-2">legend</div>
        <div className="space-y-1 text-gray-400">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#3AA9BE]"></div>
            <span>artist</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#8B5CF6]"></div>
            <span>journalist</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#F59E0B]"></div>
            <span>radio host</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#10B981]"></div>
            <span>playlist</span>
          </div>
        </div>
      </motion.div>

      {/* Controls hint */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute top-4 left-4 bg-black/80 backdrop-blur-sm border border-[#3AA9BE]/20 rounded-lg p-3 text-xs font-mono text-gray-400"
      >
        <div className="space-y-1">
          <div>click → inspect</div>
          <div>double-click → center</div>
          <div>drag → pan</div>
          <div>scroll → zoom</div>
          <div>⌘F → search</div>
        </div>
      </motion.div>
    </div>
  );
}
