/**
 * /studio/[projectId]/visualiser - 3D Scene Visualization
 */

'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { SceneVisualizerCanvas } from '@total-audio/cis-canvases';
import { SceneContextPanel } from '@total-audio/cis-ui';
import type { CISContext } from '@total-audio/cis-integrations';

export default function VisualiserPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.projectId as string;

  const [context, setContext] = useState<CISContext | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContext = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/studio/context/${projectId}`);
        if (!response.ok) {
          throw new Error('Failed to load context');
        }
        const data = await response.json();
        setContext(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setIsLoading(false);
      }
    };

    fetchContext();
  }, [projectId]);

  const handleRefresh = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/studio/context/${projectId}`);
      if (!response.ok) {
        throw new Error('Failed to refresh context');
      }
      const data = await response.json();
      setContext(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F172A] p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <button
            onClick={() => router.push(`/studio/${projectId}`)}
            className="text-[#3AA9BE] hover:text-[#2d8a9e] mb-2"
          >
            ← Back to Project
          </button>
          <h1 className="text-3xl font-bold text-white">Scene Visualizer</h1>
          <p className="text-gray-400 mt-2">
            3D visualization of your creative context and scene landscape
          </p>
        </div>

        {isLoading && (
          <div className="flex items-center justify-center h-96">
            <div className="text-[#3AA9BE] text-lg">Loading context...</div>
          </div>
        )}

        {error && (
          <div className="bg-red-900/20 border border-red-500 rounded-2xl p-6 mb-6">
            <p className="text-red-400">{error}</p>
            <button
              onClick={handleRefresh}
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
              Retry
            </button>
          </div>
        )}

        {!isLoading && !error && context && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* 3D Visualizer */}
            <div className="lg:col-span-3">
              <div className="bg-[#1F2937] p-6 rounded-2xl">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-white">
                    3D Scene Space
                  </h2>
                  <button
                    onClick={handleRefresh}
                    className="text-[#3AA9BE] hover:text-[#2d8a9e] text-sm"
                  >
                    Refresh
                  </button>
                </div>

                <SceneVisualizerCanvas
                  paletteHints={context.scenePaletteHints}
                  microgenres={
                    context.sceneContext?.microgenres?.map((mg) => mg.name) || []
                  }
                  motifs={
                    context.structuralMotifs?.map((m) => m.name) || []
                  }
                />
              </div>

              {/* Scene Stats */}
              <div className="mt-6 grid grid-cols-3 gap-4">
                <div className="bg-[#1F2937] p-4 rounded-xl">
                  <div className="text-gray-400 text-sm">Palette Hints</div>
                  <div className="text-2xl font-bold text-white mt-1">
                    {context.scenePaletteHints?.length || 0}
                  </div>
                </div>
                <div className="bg-[#1F2937] p-4 rounded-xl">
                  <div className="text-gray-400 text-sm">Microgenres</div>
                  <div className="text-2xl font-bold text-white mt-1">
                    {context.sceneContext?.microgenres?.length || 0}
                  </div>
                </div>
                <div className="bg-[#1F2937] p-4 rounded-xl">
                  <div className="text-gray-400 text-sm">Motifs</div>
                  <div className="text-2xl font-bold text-white mt-1">
                    {context.structuralMotifs?.length || 0}
                  </div>
                </div>
              </div>
            </div>

            {/* Scene Context Panel */}
            <div className="lg:col-span-1">
              <SceneContextPanel
                sceneContext={context.sceneContext}
                scenePaletteHints={context.scenePaletteHints}
                sceneNarrativeAngles={context.sceneNarrativeAngles}
                microgenreVisualHints={context.microgenreVisualHints}
              />
            </div>
          </div>
        )}

        {!isLoading && !error && !context && (
          <div className="bg-[#1F2937] p-8 rounded-2xl text-center">
            <p className="text-gray-400">No context available for this project.</p>
            <button
              onClick={handleRefresh}
              className="mt-4 px-6 py-2 bg-[#3AA9BE] text-white rounded-lg hover:bg-[#2d8a9e]"
            >
              Load Context
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
