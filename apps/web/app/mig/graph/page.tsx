/**
 * MIG Graph Visualization Page - Phase 5
 * Cinematic force-directed graph workspace (UI-only, no backend)
 */

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { GraphCanvas, NodeInspector } from '@total-audio/mig-ui';
import { useMIGGraph, useNodeInspector } from '@total-audio/mig-ui';
import { findClientPath, debounce } from '@total-audio/mig-ui';
import type { GraphNode, PerformanceMode, PathState } from '@total-audio/mig-ui';

export default function MIGGraphPage() {
  const {
    data,
    loading,
    error,
    searchNodes,
    loadNode,
    performanceMode,
    setPerformanceMode,
  } = useMIGGraph();

  const inspector = useNodeInspector();

  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState<string>('');
  const [showSearch, setShowSearch] = useState(false);
  const [pathMode, setPathMode] = useState(false);
  const [pathState, setPathState] = useState<PathState>({
    active: false,
    sourceNode: null,
    targetNode: null,
    path: [],
    edges: [],
    distance: 0,
  });
  const [showPerformanceMenu, setShowPerformanceMenu] = useState(false);
  const [showDevPanel, setShowDevPanel] = useState(false);

  // Handle node click
  const handleNodeClick = useCallback(
    (node: GraphNode) => {
      // Path mode: select source and target for pathfinding
      if (pathMode) {
        if (!pathState.sourceNode) {
          setPathState({
            ...pathState,
            sourceNode: node,
          });
        } else if (!pathState.targetNode && node.id !== pathState.sourceNode.id) {
          // Find path (client-side)
          const result = findClientPath(pathState.sourceNode.id, node.id, data);

          if (result) {
            setPathState({
              active: true,
              sourceNode: pathState.sourceNode,
              targetNode: node,
              path: result.nodes,
              edges: result.edges,
              distance: result.distance,
            });
          }

          setPathMode(false);
        }
      } else {
        // Normal mode: open inspector
        inspector.openNode(node);
      }
    },
    [pathMode, pathState, data, inspector]
  );

  // Handle node double-click (center on node)
  const handleNodeDoubleClick = useCallback((node: GraphNode) => {
    // Could trigger a re-center animation here
    console.log('Center on node:', node.name);
  }, []);

  // Debounced search
  const debouncedSearch = useCallback(
    debounce((query: string, type: string) => {
      if (query.trim()) {
        searchNodes(query, type);
      }
    }, 300),
    [searchNodes]
  );

  // Handle search input
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    debouncedSearch(query, searchType);
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // ⌘F or Ctrl+F - Search
      if ((e.metaKey || e.ctrlKey) && e.key === 'f') {
        e.preventDefault();
        setShowSearch(true);
      }

      // ⌘⌥D - Dev Panel
      if (e.metaKey && e.altKey && e.key === 'd') {
        e.preventDefault();
        setShowDevPanel(!showDevPanel);
      }

      // Escape - Close modals
      if (e.key === 'Escape') {
        setShowSearch(false);
        setPathMode(false);
        setPathState({
          active: false,
          sourceNode: null,
          targetNode: null,
          path: [],
          edges: [],
          distance: 0,
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showDevPanel]);

  // Default load - UK indie scene
  useEffect(() => {
    if (data.nodes.length === 0 && !loading) {
      searchNodes('uk', 'scene');
    }
  }, []);

  return (
    <div className="relative w-full h-screen bg-[#0c0c0c] overflow-hidden">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute top-0 left-0 right-0 z-40 border-b border-[#3AA9BE]/20 bg-black/80 backdrop-blur-sm"
      >
        <div className="flex items-center justify-between px-6 py-4">
          <div>
            <h1 className="text-xl font-medium text-white">mig graph</h1>
            <p className="text-sm text-gray-500">interactive music industry visualization</p>
          </div>

          <div className="flex items-center gap-4">
            {/* Performance Mode Selector */}
            <div className="relative">
              <button
                onClick={() => setShowPerformanceMenu(!showPerformanceMenu)}
                className="px-3 py-1.5 text-xs font-mono bg-white/5 hover:bg-white/10 border border-[#3AA9BE]/20 rounded transition-colors"
              >
                {performanceMode}
              </button>

              {showPerformanceMenu && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute top-full right-0 mt-2 bg-black border border-[#3AA9BE]/20 rounded shadow-xl overflow-hidden z-50"
                >
                  {(['normal', 'high-performance', 'ultra'] as PerformanceMode[]).map((mode) => (
                    <button
                      key={mode}
                      onClick={() => {
                        setPerformanceMode(mode);
                        setShowPerformanceMenu(false);
                      }}
                      className="block w-full px-4 py-2 text-xs text-left font-mono hover:bg-white/10 transition-colors whitespace-nowrap"
                    >
                      {mode}
                    </button>
                  ))}
                </motion.div>
              )}
            </div>

            {/* Path Mode Toggle */}
            <button
              onClick={() => {
                setPathMode(!pathMode);
                if (pathMode) {
                  setPathState({
                    active: false,
                    sourceNode: null,
                    targetNode: null,
                    path: [],
                    edges: [],
                    distance: 0,
                  });
                }
              }}
              className={`px-3 py-1.5 text-xs font-mono border rounded transition-colors ${
                pathMode
                  ? 'bg-[#3AA9BE] text-black border-[#3AA9BE]'
                  : 'bg-white/5 hover:bg-white/10 border-[#3AA9BE]/20'
              }`}
            >
              {pathMode ? 'path mode active' : 'show path'}
            </button>

            {/* Search Button */}
            <button
              onClick={() => setShowSearch(!showSearch)}
              className="px-3 py-1.5 text-xs font-mono bg-white/5 hover:bg-white/10 border border-[#3AA9BE]/20 rounded transition-colors"
            >
              search (⌘F)
            </button>
          </div>
        </div>

        {/* Path State Banner */}
        {pathState.active && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="px-6 py-3 bg-[#3AA9BE]/10 border-t border-[#3AA9BE]/20"
          >
            <div className="flex items-center justify-between">
              <div className="text-sm">
                <span className="text-white">path found:</span>{' '}
                <span className="text-[#3AA9BE]">{pathState.sourceNode?.name}</span>
                <span className="text-gray-500"> → </span>
                <span className="text-[#3AA9BE]">{pathState.targetNode?.name}</span>
                <span className="text-gray-500 ml-2">
                  ({pathState.distance} {pathState.distance === 1 ? 'hop' : 'hops'})
                </span>
              </div>
              <button
                onClick={() =>
                  setPathState({
                    active: false,
                    sourceNode: null,
                    targetNode: null,
                    path: [],
                    edges: [],
                    distance: 0,
                  })
                }
                className="text-xs text-gray-500 hover:text-white"
              >
                clear
              </button>
            </div>
          </motion.div>
        )}

        {/* Search Bar */}
        {showSearch && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="px-6 py-3 bg-black border-t border-[#3AA9BE]/20"
          >
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="search nodes..."
                className="flex-1 px-4 py-2 bg-white/5 border border-[#3AA9BE]/20 rounded text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#3AA9BE]/50"
                autoFocus
              />
              <select
                value={searchType}
                onChange={(e) => setSearchType(e.target.value)}
                className="px-3 py-2 bg-white/5 border border-[#3AA9BE]/20 rounded text-sm text-white focus:outline-none focus:border-[#3AA9BE]/50"
              >
                <option value="">all types</option>
                <option value="artist">artist</option>
                <option value="journalist">journalist</option>
                <option value="scene">scene</option>
                <option value="label">label</option>
              </select>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Main Graph Canvas */}
      <div className="absolute inset-0 pt-[73px]">
        {loading && data.nodes.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="inline-block w-8 h-8 border-2 border-[#3AA9BE] border-t-transparent rounded-full animate-spin" />
              <div className="text-sm text-gray-500 mt-4">loading graph...</div>
            </div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="text-red-500 mb-2">⚠️</div>
              <div className="text-sm text-gray-500">{error}</div>
            </div>
          </div>
        ) : (
          <GraphCanvas
            data={data}
            onNodeClick={handleNodeClick}
            onNodeDoubleClick={handleNodeDoubleClick}
            performanceMode={performanceMode}
            pathState={pathState}
            selectedNodeId={inspector.selectedNode?.id}
            className="w-full h-full"
          />
        )}
      </div>

      {/* Node Inspector Drawer */}
      <NodeInspector
        {...inspector}
        onClose={inspector.close}
        onShowPath={(targetId) => {
          // Enable path mode and set source
          setPathMode(true);
          if (inspector.selectedNode) {
            setPathState({
              ...pathState,
              sourceNode: inspector.selectedNode,
            });
          }
        }}
      />

      {/* Dev Panel */}
      {showDevPanel && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="fixed bottom-4 left-4 bg-black/90 border border-[#3AA9BE]/20 rounded-lg p-4 text-xs font-mono z-50"
        >
          <div className="text-[#3AA9BE] mb-2">dev metrics</div>
          <div className="space-y-1 text-gray-400">
            <div>nodes: {data.nodes.length}</div>
            <div>edges: {data.edges.length}</div>
            <div>mode: {performanceMode}</div>
            <div>path active: {pathState.active ? 'yes' : 'no'}</div>
          </div>
        </motion.div>
      )}

      {/* Status Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute bottom-0 left-0 right-0 bg-black/80 backdrop-blur-sm border-t border-[#3AA9BE]/20 px-6 py-2 text-xs font-mono text-gray-500"
      >
        <div className="flex items-center justify-between">
          <div>
            {data.nodes.length} nodes · {data.edges.length} edges
          </div>
          <div>⌘F search · ⌘⌥D dev panel · esc close</div>
        </div>
      </motion.div>
    </div>
  );
}
