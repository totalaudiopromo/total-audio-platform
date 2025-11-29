/**
 * Campaign Tracker API Types
 */

import type { ApiResponse } from './common';

export type CampaignStatus = 'planning' | 'active' | 'completed' | 'paused';
export type CampaignPlatform =
  | 'spotify'
  | 'apple_music'
  | 'youtube'
  | 'tiktok'
  | 'radio'
  | 'press'
  | 'social';
export type CampaignTargetType = 'playlist' | 'station' | 'blog' | 'influencer' | 'press';

export interface Campaign {
  id: string;
  user_id: string;
  name: string;
  artist_name?: string | null;
  status: CampaignStatus;
  platform?: CampaignPlatform | null;
  genre?: string | null;
  target_type?: CampaignTargetType | null;
  notes?: string | null;
  start_date?: string | null;
  end_date?: string | null;
  budget?: number | null;
  target_reach?: number | null;
  actual_reach?: number | null;
  success_rate?: number;
  created_at: string;
  updated_at: string;
}

export interface CampaignWithInsights extends Campaign {
  insights?: CampaignInsights;
}

export interface CampaignInsights {
  performanceScore?: number;
  recommendations?: string[];
  benchmarkComparison?: { aboveAverage: boolean; percentile: number };
  predictedOutcome?: { estimatedReach: number; confidence: number };
}

export interface CreateCampaignRequest {
  name: string;
  artist_name?: string;
  status?: CampaignStatus;
  platform?: CampaignPlatform;
  genre?: string;
  target_type?: CampaignTargetType;
  notes?: string;
  start_date?: string;
  end_date?: string;
  budget?: number;
  target_reach?: number;
}

export interface CampaignPatterns {
  bestPerformingPlatform?: string;
  bestPerformingGenre?: string;
  optimalBudgetRange?: { min: number; max: number };
}

export interface CampaignMetrics {
  total_campaigns: number;
  active_campaigns: number;
  completed_campaigns: number;
  total_spend: number;
  avg_success_rate: number;
}

export interface ListCampaignsResponse {
  campaigns: CampaignWithInsights[];
  patterns: CampaignPatterns;
  metrics: CampaignMetrics;
}

export type ListCampaignsApiResponse = ApiResponse<ListCampaignsResponse>;
export type CreateCampaignResponse = CampaignWithInsights;
export type CreateCampaignApiResponse = ApiResponse<CreateCampaignResponse>;
