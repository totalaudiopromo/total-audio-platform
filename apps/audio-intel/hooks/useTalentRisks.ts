/**
 * useTalentRisks - Fetch risks across ecosystem
 * NOTE: This endpoint may not be implemented yet
 */

import useSWR from 'swr';

interface TalentRisksResponse {
  ok: boolean;
  data?: {
    risks: Array<{
      artist_slug: string;
      type: string;
      description: string;
      severity: number;
      scene_slug: string | null;
      microgenres: string[];
      indicators: {
        momentum_decline: boolean;
        coverage_drop: boolean;
        creative_stagnation: boolean;
        identity_misalignment: boolean;
        scene_disconnect: boolean;
      };
      mitigation: {
        recommended_actions: string[];
        urgency: 'immediate' | 'soon' | 'monitor';
        estimated_recovery_time: string;
      };
    }>;
    summary: {
      total: number;
      critical: number;
      high_severity: number;
      by_type: Record<string, number>;
    };
  };
  error?: {
    code: string;
    message: string;
    details?: unknown;
  } | null;
}

interface UseTalentRisksOptions {
  limit?: number;
  minSeverity?: number;
  type?: string;
}

const fetcher = async (url: string): Promise<TalentRisksResponse> => {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}: ${res.statusText}`);
  }
  return res.json();
};

export function useTalentRisks(options: UseTalentRisksOptions = {}) {
  const params = new URLSearchParams();
  if (options.limit) params.append('limit', options.limit.toString());
  if (options.minSeverity) params.append('minSeverity', options.minSeverity.toString());
  if (options.type) params.append('type', options.type);

  const url = `/api/talent/risks?${params.toString()}`;

  const { data, error, isLoading, mutate } = useSWR<TalentRisksResponse>(
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
    risks: data?.ok ? data.data?.risks : [],
    summary: data?.ok ? data.data?.summary : null,
    isLoading,
    isError: !data?.ok || !!error,
    error: data?.error || (error ? { code: 'FETCH_ERROR', message: error.message } : null),
    mutate,
  };
}
