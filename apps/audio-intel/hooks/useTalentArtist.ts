/**
 * useTalentArtist - Fetch artist radar profile
 */

import useSWR from 'swr';

interface TalentArtistResponse {
  ok: boolean;
  data?: {
    artist: {
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
    };
    opportunities: Array<{
      type: string;
      description: string;
      score: number;
    }>;
    risks: Array<{
      type: string;
      description: string;
      severity: number;
    }>;
    similarArtists: string[];
    trajectory: {
      momentum: string;
      breakoutPotential: string;
      riskLevel: string;
    };
  };
  error?: {
    code: string;
    message: string;
    details?: unknown;
  } | null;
}

interface UseTalentArtistOptions {
  skipCache?: boolean;
}

const fetcher = async (url: string): Promise<TalentArtistResponse> => {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}: ${res.statusText}`);
  }
  return res.json();
};

export function useTalentArtist(slug: string | null, options: UseTalentArtistOptions = {}) {
  const params = new URLSearchParams();
  if (options.skipCache) params.append('skipCache', 'true');

  const url = slug ? `/api/talent/artists/${slug}?${params.toString()}` : null;

  const { data, error, isLoading, mutate } = useSWR<TalentArtistResponse>(
    url,
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 300000, // 5 minutes (matches backend cache)
      errorRetryCount: 3,
      errorRetryInterval: 2000,
    }
  );

  return {
    artist: data?.ok ? data.data?.artist : null,
    opportunities: data?.ok ? data.data?.opportunities : [],
    risks: data?.ok ? data.data?.risks : [],
    similarArtists: data?.ok ? data.data?.similarArtists : [],
    trajectory: data?.ok ? data.data?.trajectory : null,
    isLoading,
    isError: !data?.ok || !!error,
    error: data?.error || (error ? { code: 'FETCH_ERROR', message: error.message } : null),
    mutate,
  };
}
