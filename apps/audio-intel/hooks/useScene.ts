/**
 * useScene - Fetch single scene detail with pulse, members, relationships
 */

import useSWR from 'swr';

interface SceneResponse {
  ok: boolean;
  data?: {
    scene: {
      slug: string;
      name: string;
      region: string | null;
      country: string | null;
      description: string;
      tags: string[];
      microgenres: string[];
      created_at: string;
      updated_at: string;
    };
    pulse: {
      sceneSlug: string;
      sceneName: string;
      region: string | null;
      hotnessScore: number;
      growthRate: number;
      growthClassification: string;
      crossoverPotential: number;
      microgenreHighlights: Array<{
        slug: string;
        name: string;
        score: number;
        trendDirection: 'up' | 'down' | 'stable';
      }>;
      momentum: {
        shortTerm: number;
        longTerm: number;
        trend: 'rising' | 'stable' | 'falling';
      };
      metrics: {
        totalMembers: number;
        activeCampaigns: number;
        recentCoverage: number;
        communityEngagement: number;
      };
      timestamp: string;
    } | null;
    topMembers: Array<{
      entity_slug: string;
      entity_type: string;
      confidence: number;
      reasoning: string;
    }>;
    relationships: Array<{
      sceneSlug: string;
      relationType: string;
      weight: number;
    }>;
    microgenres: Array<{
      slug: string;
      name: string;
      description: string;
      parent_scene_slug: string;
    }>;
  };
  error?: {
    code: string;
    message: string;
    details?: unknown;
  } | null;
}

const fetcher = async (url: string): Promise<SceneResponse> => {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}: ${res.statusText}`);
  }
  return res.json();
};

export function useScene(slug: string | null) {
  const url = slug ? `/api/scenes/${slug}` : null;

  const { data, error, isLoading, mutate } = useSWR<SceneResponse>(
    url,
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 300000, // 5 minutes
      errorRetryCount: 3,
      errorRetryInterval: 2000,
    }
  );

  return {
    scene: data?.ok ? data.data?.scene : null,
    pulse: data?.ok ? data.data?.pulse : null,
    topMembers: data?.ok ? data.data?.topMembers : [],
    relationships: data?.ok ? data.data?.relationships : [],
    microgenres: data?.ok ? data.data?.microgenres : [],
    isLoading,
    isError: !data?.ok || !!error,
    error: data?.error || (error ? { code: 'FETCH_ERROR', message: error.message } : null),
    mutate,
  };
}
