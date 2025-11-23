/**
 * SceneList - Grid of scene cards
 */

import React from 'react';
import { SceneCard } from './SceneCard';
import { LoadingState } from '../ui/LoadingState';
import { ErrorState } from '../ui/ErrorState';
import { EmptyState } from '../ui/EmptyState';

interface Scene {
  slug: string;
  name: string;
  region: string | null;
  microgenres: string[];
}

interface SceneListProps {
  scenes: Scene[];
  isLoading: boolean;
  isError: boolean;
  error: { code: string; message: string } | null;
  onRetry?: () => void;
}

export function SceneList({ scenes, isLoading, isError, error, onRetry }: SceneListProps) {
  if (isLoading) {
    return <LoadingState message="Loading scenes..." />;
  }

  if (isError && error) {
    return (
      <ErrorState
        title="Failed to load scenes"
        message={error.message}
        code={error.code}
        onRetry={onRetry}
      />
    );
  }

  if (scenes.length === 0) {
    return (
      <EmptyState
        title="No scenes found"
        message="No music scenes are available yet. Check back later."
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {scenes.map((scene) => (
        <SceneCard
          key={scene.slug}
          slug={scene.slug}
          name={scene.name}
          region={scene.region}
          microgenres={scene.microgenres}
        />
      ))}
    </div>
  );
}
