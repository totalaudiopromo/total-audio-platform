/**
 * useTalentPulse - Fetch global music pulse snapshot
 */

import useSWR from 'swr';

interface TalentPulseResponse {
  ok: boolean;
  data?: {
    timestamp: string;
    topRisingArtists: Array<{
      artist_slug: string;
      scene_slug: string | null;
      microgenres: string[];
      momentum: number;
      creative_shift: number;
      coverage_velocity: number;
      press_quality: number;
      reply_quality: number;
      playlist_velocity: number;
      audience_change: number;
      mig_connectivity: number;
      cmg_fingerprint_drift: number;
      identity_alignment: number;
      breakout_score: number;
      risk_score: number;
      metadata: Record<string, unknown>;
      updated_at: string;
    }>;
    topBreakoutCandidates: Array<{
      artist_slug: string;
      scene_slug: string | null;
      microgenres: string[];
      momentum: number;
      breakout_score: number;
      risk_score: number;
      updated_at: string;
    }>;
    artistsAtRisk: Array<{
      artist_slug: string;
      scene_slug: string | null;
      microgenres: string[];
      momentum: number;
      breakout_score: number;
      risk_score: number;
      updated_at: string;
    }>;
    hottestScenes: Array<{
      scene_slug: string;
      hotness: number;
      momentum: number;
      artist_count: number;
    }>;
    summary: {
      totalArtistsTracked: number;
      avgMomentum: number;
      highBreakoutCount: number;
      highRiskCount: number;
    };
  };
  error?: {
    code: string;
    message: string;
    details?: unknown;
  } | null;
}

interface UseTalentPulseOptions {
  skipCache?: boolean;
  limit?: number;
}

const fetcher = async (url: string): Promise<TalentPulseResponse> => {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}: ${res.statusText}`);
  }
  return res.json();
};

export function useTalentPulse(options: UseTalentPulseOptions = {}) {
  const params = new URLSearchParams();
  if (options.skipCache) params.append('skipCache', 'true');
  if (options.limit) params.append('limit', options.limit.toString());

  const url = `/api/talent/pulse?${params.toString()}`;

  const { data, error, isLoading, mutate } = useSWR<TalentPulseResponse>(
    url,
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 600000, // 10 minutes (matches backend cache)
      errorRetryCount: 3,
      errorRetryInterval: 2000,
    }
  );

  return {
    pulse: data?.ok ? data.data : null,
    isLoading,
    isError: !data?.ok || !!error,
    error: data?.error || (error ? { code: 'FETCH_ERROR', message: error.message } : null),
    mutate,
  };
}
