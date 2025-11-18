/**
 * Scene Visualizer Canvas - Lightweight 3D-ish scene visualization
 * Uses CSS 3D transforms for atmospheric scene representation
 */

import React, { useMemo } from 'react';
import type { ScenePaletteHint } from '@total-audio/cis-integrations';

export interface SceneVisualizerCanvasProps {
  paletteHints?: ScenePaletteHint[];
  microgenres?: string[];
  motifs?: string[];
}

interface SceneNode {
  id: string;
  label: string;
  color: string;
  position: { x: number; y: number; z: number };
  size: number;
}

export const SceneVisualizerCanvas: React.FC<SceneVisualizerCanvasProps> = ({
  paletteHints = [],
  microgenres = [],
  motifs = [],
}) => {
  const nodes = useMemo(() => {
    const sceneNodes: SceneNode[] = [];
    let nodeId = 0;

    // Create nodes from palette hints
    paletteHints.forEach((hint, i) => {
      hint.suggestedColors.forEach((color, j) => {
        sceneNodes.push({
          id: `palette-${nodeId++}`,
          label: hint.scene,
          color,
          position: {
            x: (i - paletteHints.length / 2) * 150,
            y: (j - hint.suggestedColors.length / 2) * 100,
            z: i * 50,
          },
          size: 80,
        });
      });
    });

    // Create nodes from microgenres
    microgenres.forEach((genre, i) => {
      sceneNodes.push({
        id: `genre-${nodeId++}`,
        label: genre,
        color: '#3AA9BE',
        position: {
          x: Math.cos((i / microgenres.length) * Math.PI * 2) * 200,
          y: Math.sin((i / microgenres.length) * Math.PI * 2) * 200,
          z: -100,
        },
        size: 60,
      });
    });

    // Create nodes from motifs
    motifs.forEach((motif, i) => {
      sceneNodes.push({
        id: `motif-${nodeId++}`,
        label: motif,
        color: '#6366F1',
        position: {
          x: Math.cos((i / motifs.length) * Math.PI * 2) * 250,
          y: Math.sin((i / motifs.length) * Math.PI * 2) * 250,
          z: 100,
        },
        size: 50,
      });
    });

    return sceneNodes;
  }, [paletteHints, microgenres, motifs]);

  return (
    <div className="relative w-full h-full min-h-[600px] bg-[#0F172A] rounded-2xl overflow-hidden">
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{
          perspective: '1000px',
          perspectiveOrigin: '50% 50%',
        }}
      >
        <div
          className="relative"
          style={{
            transformStyle: 'preserve-3d',
            animation: 'sceneRotate 60s linear infinite',
          }}
        >
          {nodes.map((node) => {
            const shadowSize = node.size / 2;
            return (
              <div
                key={node.id}
                className="absolute group"
                style={{
                  transform: `translate3d(${node.position.x}px, ${node.position.y}px, ${node.position.z}px)`,
                  transformStyle: 'preserve-3d',
                }}
              >
                <div
                  className="rounded-full transition-all duration-300 group-hover:scale-110"
                  style={{
                    width: node.size,
                    height: node.size,
                    backgroundColor: node.color,
                    boxShadow: `0 0 ${shadowSize}px ${node.color}`,
                    opacity: 0.7,
                  }}
                />
                <div
                  className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2
                             text-xs text-white whitespace-nowrap opacity-0 group-hover:opacity-100
                             transition-opacity duration-300 bg-[#1F2937] px-2 py-1 rounded"
                >
                  {node.label}
                </div>
              </div>
            );
          })}

          <div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
            style={{
              width: '10px',
              height: '10px',
              backgroundColor: '#3AA9BE',
              borderRadius: '50%',
              boxShadow: '0 0 20px #3AA9BE',
            }}
          />
        </div>
      </div>

      <div className="absolute top-4 left-4 text-white text-sm space-y-1">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#3AA9BE]" />
          <span>Scenes</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#6366F1]" />
          <span>Motifs</span>
        </div>
      </div>

      <style jsx>{`
        @keyframes sceneRotate {
          from {
            transform: rotateY(0deg) rotateX(10deg);
          }
          to {
            transform: rotateY(360deg) rotateX(10deg);
          }
        }
      `}</style>
    </div>
  );
};
