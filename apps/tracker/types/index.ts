// Common types for the tracker application

export interface Campaign {
  id: string;
  name: string;
  artist: string;
  startDate: Date;
  endDate: Date;
  status: 'draft' | 'active' | 'paused' | 'completed';
  budget: number;
  currency: string;
  platforms: Platform[];
  metrics: CampaignMetrics;
  createdAt: Date;
  updatedAt: Date;
}

export interface Platform {
  id: string;
  name: string;
  type: 'social' | 'streaming' | 'radio' | 'press' | 'playlist';
  url?: string;
  metrics: PlatformMetrics;
}

export interface CampaignMetrics {
  reach: number;
  impressions: number;
  engagement: number;
  clicks: number;
  conversions: number;
  cost: number;
  roi: number;
}

export interface PlatformMetrics {
  followers: number;
  reach: number;
  engagement: number;
  clicks: number;
  cost: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'manager' | 'viewer';
  createdAt: Date;
  updatedAt: Date;
}
