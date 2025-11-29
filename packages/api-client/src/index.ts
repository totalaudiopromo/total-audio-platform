/**
 * @total-audio/api-client
 * TypeScript SDK for Total Audio Platform APIs
 */

import { IntelClient } from './intel-client';
import { PitchClient } from './pitch-client';
import { TrackerClient } from './tracker-client';

export { BaseClient, TotalAudioApiError } from './base-client';
export type { ClientConfig } from './base-client';

export { IntelClient } from './intel-client';
export type { IntelClientConfig } from './intel-client';

export { PitchClient } from './pitch-client';
export type { PitchClientConfig } from './pitch-client';

export { TrackerClient } from './tracker-client';
export type { TrackerClientConfig } from './tracker-client';

export type * from '@total-audio/api-types';

export interface TotalAudioClientConfig {
  apiKey: string;
  intelUrl?: string;
  pitchUrl?: string;
  trackerUrl?: string;
  timeout?: number;
  headers?: Record<string, string>;
}

export class TotalAudioClient {
  public readonly intel: IntelClient;
  public readonly pitch: PitchClient;
  public readonly tracker: TrackerClient;

  constructor(config: TotalAudioClientConfig) {
    const baseConfig = { apiKey: config.apiKey, timeout: config.timeout, headers: config.headers };
    this.intel = new IntelClient({ ...baseConfig, baseUrl: config.intelUrl });
    this.pitch = new PitchClient({ ...baseConfig, baseUrl: config.pitchUrl });
    this.tracker = new TrackerClient({ ...baseConfig, baseUrl: config.trackerUrl });
  }
}
