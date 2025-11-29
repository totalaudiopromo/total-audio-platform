/**
 * Pitch Generator API Client
 */

import { BaseClient, ClientConfig } from './base-client';
import type {
  GeneratePitchRequest,
  GeneratePitchResponse,
  AnalyzePitchRequest,
  PitchAnalysis,
} from '@total-audio/api-types';

export interface PitchClientConfig extends ClientConfig {
  baseUrl?: string;
}

export class PitchClient extends BaseClient {
  constructor(config: PitchClientConfig) {
    super({ ...config, baseUrl: config.baseUrl || 'https://pitch.totalaudiopromo.com' });
  }

  async generate(request: GeneratePitchRequest): Promise<GeneratePitchResponse> {
    return this.post<GeneratePitchResponse>('/api/pitch/generate', request);
  }

  async analyse(request: AnalyzePitchRequest): Promise<PitchAnalysis> {
    const response = await this.post<{ analysis: PitchAnalysis }>('/api/pitch/analyze', request);
    return response.analysis;
  }

  async analyze(request: AnalyzePitchRequest): Promise<PitchAnalysis> {
    return this.analyse(request);
  }
}
