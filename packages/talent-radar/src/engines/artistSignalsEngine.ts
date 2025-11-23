/**
 * Artist Signals Engine
 * Aggregates ~20 signals from all systems for each artist
 */

import { SupabaseClient } from '@supabase/supabase-js';
import { MIGAdapter } from '../adapters/MIGAdapter.js';
import { ScenesAdapter } from '../adapters/ScenesAdapter.js';
import { FusionAdapter } from '../adapters/FusionAdapter.js';
import { CMGAdapter } from '../adapters/CMGAdapter.js';
import { CoverageAdapter } from '../adapters/CoverageAdapter.js';
import { RCFAdapter } from '../adapters/RCFAdapter.js';
import { IdentityKernelAdapter } from '../adapters/IdentityKernelAdapter.js';
import { calculateMomentumScore, calculateBreakoutScore, calculateRiskScore } from '../utils/scoring.js';
import { createLogger } from '../utils/logger.js';
import { getConfig, TalentRadarConfig } from '../config.js';

const logger = createLogger('ArtistSignalsEngine');

export interface ArtistSignals {
  artistSlug: string;
  sceneSlug: string | null;
  microgenres: string[];

  // Raw signals
  momentum: number; // 0-100
  creativeShift: number; // 0-1
  coverageVelocity: number; // growth rate
  pressQuality: number; // 0-1
  replyQuality: number; // 0-1
  playlistVelocity: number; // growth rate
  audienceChange: number; // growth rate
  migConnectivity: number; // 0-1
  cmgFingerprintDrift: number; // 0-1
  identityAlignment: number; // 0-1

  // Aggregate scores
  breakoutScore: number; // 0-1
  riskScore: number; // 0-1

  metadata: Record<string, unknown>;
  updatedAt: string;
}

export class ArtistSignalsEngine {
  private migAdapter: MIGAdapter;
  private scenesAdapter: ScenesAdapter;
  private fusionAdapter: FusionAdapter;
  private cmgAdapter: CMGAdapter;
  private coverageAdapter: CoverageAdapter;
  private rcfAdapter: RCFAdapter;
  private identityAdapter: IdentityKernelAdapter;
  private config: TalentRadarConfig;

  constructor(private supabase: SupabaseClient) {
    this.migAdapter = new MIGAdapter(supabase);
    this.scenesAdapter = new ScenesAdapter(supabase);
    this.fusionAdapter = new FusionAdapter(supabase);
    this.cmgAdapter = new CMGAdapter(supabase);
    this.coverageAdapter = new CoverageAdapter(supabase);
    this.rcfAdapter = new RCFAdapter(supabase);
    this.identityAdapter = new IdentityKernelAdapter(supabase);
    this.config = getConfig();
  }

  /**
   * Aggregate all signals for an artist
   */
  async aggregateArtistSignals(artistSlug: string): Promise<ArtistSignals> {
    try {
      logger.info(`Aggregating signals for artist: ${artistSlug}`);

      // Fetch all signals in parallel
      const [
        migSignals,
        sceneFit,
        campaignSignals,
        creativeShift,
        coverageVelocity,
        pressQuality,
        identityCoherence,
      ] = await Promise.all([
        this.migAdapter.getArtistMIGSignals(artistSlug),
        this.scenesAdapter.getArtistSceneFit(artistSlug),
        this.fusionAdapter.getCampaignVelocity(artistSlug),
        this.cmgAdapter.getCreativeShift(artistSlug),
        this.coverageAdapter.getCoverageVelocity(artistSlug),
        this.coverageAdapter.getPressQuality(artistSlug),
        this.identityAdapter.getIdentityCoherence(artistSlug),
      ]);

      // Get scene hotness if artist has a scene
      let sceneHotness = 50;
      if (sceneFit.primaryScene) {
        const scenePulse = await this.scenesAdapter.getScenePulse(sceneFit.primaryScene);
        sceneHotness = scenePulse.hotness;
      }

      // Calculate momentum score
      const momentum = calculateMomentumScore({
        campaignVelocity: campaignSignals.campaignVelocity,
        coverageVelocity,
        creativeShift,
        audienceChange: 0, // TODO: Get from audience adapter
        playlistVelocity: 0, // TODO: Get from playlist adapter
      });

      // Calculate breakout score
      const breakoutScore = calculateBreakoutScore({
        momentum,
        migConnectivity: migSignals.connectivity,
        pressQuality,
        creativeShift,
        sceneHotness,
        identityAlignment: identityCoherence,
      });

      // Calculate risk score
      const riskScore = calculateRiskScore({
        momentum,
        coverageVelocity,
        creativeShift,
        identityAlignment: identityCoherence,
        sceneHotness,
        audienceChange: 0, // TODO: Get from audience adapter
      });

      const signals: ArtistSignals = {
        artistSlug,
        sceneSlug: sceneFit.primaryScene,
        microgenres: sceneFit.microgenres,

        momentum,
        creativeShift,
        coverageVelocity,
        pressQuality,
        replyQuality: 0, // TODO: Get from reply intel
        playlistVelocity: 0, // TODO: Get from playlist adapter
        audienceChange: 0, // TODO: Get from audience adapter
        migConnectivity: migSignals.connectivity,
        cmgFingerprintDrift: creativeShift,
        identityAlignment: identityCoherence,

        breakoutScore,
        riskScore,

        metadata: {
          migCentrality: migSignals.centralityScore,
          tastemakerConnections: migSignals.tastemakerConnectionCount,
          sceneConfidence: sceneFit.sceneConfidence,
          campaignCount: campaignSignals.campaignCount,
        },
        updatedAt: new Date().toISOString(),
      };

      logger.info(`Signals aggregated for ${artistSlug}:`, {
        momentum,
        breakoutScore,
        riskScore,
      });

      return signals;
    } catch (error) {
      logger.error(`Failed to aggregate signals for ${artistSlug}:`, error);
      throw error;
    }
  }

  /**
   * Batch aggregate signals for multiple artists with concurrency control
   */
  async batchAggregateSignals(artistSlugs: string[]): Promise<ArtistSignals[]> {
    const results: ArtistSignals[] = [];
    const batchSize = this.config.batch.maxConcurrency;
    const limit = Math.min(artistSlugs.length, this.config.limits.maxSignalAggregationBatch);
    const limitedSlugs = artistSlugs.slice(0, limit);

    logger.info(`Batch aggregating signals for ${limitedSlugs.length} artists (batch size: ${batchSize})`);

    // Process in batches to control concurrency
    for (let i = 0; i < limitedSlugs.length; i += batchSize) {
      const batch = limitedSlugs.slice(i, i + batchSize);
      const batchPromises = batch.map(slug =>
        this.aggregateArtistSignals(slug).catch(error => {
          logger.error(`Failed to aggregate signals for ${slug}:`, error);
          return null;
        })
      );

      const batchResults = await Promise.all(batchPromises);
      results.push(...batchResults.filter(r => r !== null) as ArtistSignals[]);
    }

    logger.info(`Successfully aggregated signals for ${results.length}/${limitedSlugs.length} artists`);
    return results;
  }
}
