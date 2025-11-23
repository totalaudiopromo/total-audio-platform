/**
 * useScenes - Fetch all scenes with optional filters
 */

import useSWR from 'swr';

interface ScenesResponse {
  ok: boolean;
  data?: {
    scenes: Array<{
      slug: string;
      name: string;
      region: string | null;
      country: string | null;
      description: string;
      tags: string[];
      microgenres: string[];
      created_at: string;
      updated_at: string;
    }>;
    pagination: {
      limit: number;
      offset: number;
      total: number;
      hasMore: boolean;
    };
  };
  error?: {
    code: string;
    message: string;
    details?: unknown;
  } | null;
}

interface UseScenesOptions {
  region?: string;
  limit?: number;
  offset?: number;
}

const fetcher = async (url: string): Promise<ScenesResponse> => {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}: ${res.statusText}`);
  }
  return res.json();
};

export function useScenes(options: UseScenesOptions = {}) {
  const params = new URLSearchParams();
  if (options.region) params.append('region', options.region);
  if (options.limit) params.append('limit', options.limit.toString());
  if (options.offset) params.append('offset', options.offset.toString());

  const url = `/api/scenes?${params.toString()}`;

  const { data, error, isLoading, mutate } = useSWR<ScenesResponse>(
    url,
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000, // 1 minute
      errorRetryCount: 3,
      errorRetryInterval: 2000,
    }
  );

  return {
    scenes: data?.ok ? data.data?.scenes : [],
    pagination: data?.ok ? data.data?.pagination : null,
    isLoading,
    isError: !data?.ok || !!error,
    error: data?.error || (error ? { code: 'FETCH_ERROR', message: error.message } : null),
    mutate,
  };
}
