/**
 * Campaign Tracker API Client
 */

import { BaseClient, ClientConfig } from './base-client';
import type {
  CampaignWithInsights,
  CreateCampaignRequest,
  ListCampaignsResponse,
  CampaignMetrics,
  CampaignPatterns,
} from '@total-audio/api-types';

export interface TrackerClientConfig extends ClientConfig {
  baseUrl?: string;
}

export class TrackerClient extends BaseClient {
  constructor(config: TrackerClientConfig) {
    super({ ...config, baseUrl: config.baseUrl || 'https://tracker.totalaudiopromo.com' });
  }

  async listCampaigns(): Promise<ListCampaignsResponse> {
    return this.get<ListCampaignsResponse>('/api/campaigns');
  }

  async getCampaigns(): Promise<CampaignWithInsights[]> {
    const response = await this.listCampaigns();
    return response.campaigns;
  }

  async getMetrics(): Promise<CampaignMetrics> {
    const response = await this.listCampaigns();
    return response.metrics;
  }

  async getPatterns(): Promise<CampaignPatterns> {
    const response = await this.listCampaigns();
    return response.patterns;
  }

  async createCampaign(campaign: CreateCampaignRequest): Promise<CampaignWithInsights> {
    return this.post<CampaignWithInsights>('/api/campaigns', campaign);
  }
}
