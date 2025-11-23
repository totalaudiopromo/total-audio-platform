/**
 * useTalentCompare - Compare multiple artists
 * NOTE: This endpoint may not be implemented yet
 */

import useSWR from 'swr';

interface TalentCompareResponse {
  ok: boolean;
  data?: {
    artists: Array<{
      artist_slug: string;
      scene_slug: string | null;
      microgenres: string[];
      momentum: number;
      breakout_score: number;
      risk_score: number;
      creative_shift: number;
      mig_connectivity: number;
      press_quality: number;
    }>;
    comparison: {
      momentum_delta: Record<string, number>;
      breakout_delta: Record<string, number>;
      scene_alignment: Record<string, number>;
      signal_differences: Record<string, Record<string, number>>;
    };
  };
  error?: {
    code: string;
    message: string;
    details?: unknown;
  } | null;
}

const fetcher = async (url: string, artistSlugs: string[]): Promise<TalentCompareResponse> => {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ artistSlugs }),
  });
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}: ${res.statusText}`);
  }
  return res.json();
};

export function useTalentCompare(artistSlugs: string[]) {
  const key = artistSlugs.length > 0 ? ['/api/talent/compare', artistSlugs] : null;

  const { data, error, isLoading, mutate } = useSWR<TalentCompareResponse>(
    key,
    ([url, slugs]) => fetcher(url, slugs as string[]),
    {
      revalidateOnFocus: false,
      dedupingInterval: 300000, // 5 minutes
      errorRetryCount: 3,
      errorRetryInterval: 2000,
    }
  );

  return {
    artists: data?.ok ? data.data?.artists : [],
    comparison: data?.ok ? data.data?.comparison : null,
    isLoading,
    isError: !data?.ok || !!error,
    error: data?.error || (error ? { code: 'FETCH_ERROR', message: error.message } : null),
    mutate,
  };
}
