/**
 * useTalentOpportunities - Fetch opportunities across ecosystem
 * NOTE: This endpoint may not be implemented yet
 */

import useSWR from 'swr';

interface TalentOpportunitiesResponse {
  ok: boolean;
  data?: {
    opportunities: Array<{
      artist_slug: string;
      type: string;
      description: string;
      score: number;
      scene_slug: string | null;
      microgenres: string[];
      window: {
        optimal_start: string;
        optimal_end: string;
        urgency: 'high' | 'medium' | 'low';
      };
      impact: {
        momentum_boost: number;
        breakout_probability_increase: number;
        estimated_reach_increase: number;
      };
    }>;
    summary: {
      total: number;
      high_impact: number;
      urgent: number;
      by_type: Record<string, number>;
    };
  };
  error?: {
    code: string;
    message: string;
    details?: unknown;
  } | null;
}

interface UseTalentOpportunitiesOptions {
  limit?: number;
  minScore?: number;
  type?: string;
}

const fetcher = async (url: string): Promise<TalentOpportunitiesResponse> => {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}: ${res.statusText}`);
  }
  return res.json();
};

export function useTalentOpportunities(options: UseTalentOpportunitiesOptions = {}) {
  const params = new URLSearchParams();
  if (options.limit) params.append('limit', options.limit.toString());
  if (options.minScore) params.append('minScore', options.minScore.toString());
  if (options.type) params.append('type', options.type);

  const url = `/api/talent/opportunities?${params.toString()}`;

  const { data, error, isLoading, mutate } = useSWR<TalentOpportunitiesResponse>(
    url,
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 600000, // 10 minutes
      errorRetryCount: 3,
      errorRetryInterval: 2000,
    }
  );

  return {
    opportunities: data?.ok ? data.data?.opportunities : [],
    summary: data?.ok ? data.data?.summary : null,
    isLoading,
    isError: !data?.ok || !!error,
    error: data?.error || (error ? { code: 'FETCH_ERROR', message: error.message } : null),
    mutate,
  };
}
