/**
 * Radar Aggregator - Builds aggregated outputs for UIs and APIs
 */

import { SupabaseClient } from '@supabase/supabase-js';
import { RadarStore, TalentRadarArtist, TalentRadarScene } from './radarStore.js';
import { createLogger } from '../utils/logger.js';

const logger = createLogger('RadarAggregator');

export interface GlobalPulse {
  timestamp: string;
  topRisingArtists: TalentRadarArtist[];
  topBreakoutCandidates: TalentRadarArtist[];
  artistsAtRisk: TalentRadarArtist[];
  hottestScenes: TalentRadarScene[];
  summary: {
    totalArtistsTracked: number;
    avgMomentum: number;
    highBreakoutCount: number;
    highRiskCount: number;
  };
}

export interface ArtistRadarProfile {
  artist: TalentRadarArtist;
  opportunities: Array<{
    type: string;
    description: string;
    score: number;
  }>;
  risks: Array<{
    type: string;
    description: string;
    severity: number;
  }>;
  similarArtists: string[];
  trajectory: {
    momentum: string; // rising, stable, declining
    breakoutPotential: string; // high, medium, low
    riskLevel: string; // high, medium, low
  };
}

export class RadarAggregator {
  private store: RadarStore;

  constructor(private supabase: SupabaseClient) {
    this.store = new RadarStore(supabase);
  }

  /**
   * Build global music pulse snapshot
   */
  async buildGlobalPulse(): Promise<GlobalPulse> {
    try {
      logger.info('Building global pulse snapshot');

      const [
        topRising,
        topBreakout,
        atRisk,
      ] = await Promise.all([
        this.store.getTopRisingArtists(20),
        this.store.getTopBreakoutCandidates(20),
        this.store.getArtistsAtRisk(20),
      ]);

      // Calculate summary stats
      const allArtists = new Set([
        ...topRising.map(a => a.artist_slug),
        ...topBreakout.map(a => a.artist_slug),
        ...atRisk.map(a => a.artist_slug),
      ]);

      const avgMomentum = topRising.reduce((sum, a) => sum + a.momentum, 0) / (topRising.length || 1);
      const highBreakoutCount = topBreakout.filter(a => a.breakout_score > 0.7).length;
      const highRiskCount = atRisk.filter(a => a.risk_score > 0.7).length;

      return {
        timestamp: new Date().toISOString(),
        topRisingArtists: topRising,
        topBreakoutCandidates: topBreakout,
        artistsAtRisk: atRisk,
        hottestScenes: [], // TODO: Fetch scene data
        summary: {
          totalArtistsTracked: allArtists.size,
          avgMomentum,
          highBreakoutCount,
          highRiskCount,
        },
      };
    } catch (error) {
      logger.error('Failed to build global pulse:', error);
      throw error;
    }
  }

  /**
   * Build comprehensive artist radar profile
   */
  async buildArtistProfile(artistSlug: string): Promise<ArtistRadarProfile | null> {
    try {
      logger.info(`Building radar profile for artist: ${artistSlug}`);

      const artist = await this.store.getArtistSignals(artistSlug);
      if (!artist) return null;

      // Analyze opportunities
      const opportunities = this.analyzeOpportunities(artist);

      // Analyze risks
      const risks = this.analyzeRisks(artist);

      // Determine trajectory
      const trajectory = {
        momentum: artist.momentum > 70 ? 'rising' : artist.momentum > 40 ? 'stable' : 'declining',
        breakoutPotential: artist.breakout_score > 0.7 ? 'high' : artist.breakout_score > 0.4 ? 'medium' : 'low',
        riskLevel: artist.risk_score > 0.7 ? 'high' : artist.risk_score > 0.4 ? 'medium' : 'low',
      };

      return {
        artist,
        opportunities,
        risks,
        similarArtists: [], // TODO: Implement similarity matching
        trajectory,
      };
    } catch (error) {
      logger.error(`Failed to build artist profile for ${artistSlug}:`, error);
      return null;
    }
  }

  /**
   * Analyze opportunities for an artist
   */
  private analyzeOpportunities(artist: TalentRadarArtist): Array<{
    type: string;
    description: string;
    score: number;
  }> {
    const opportunities: Array<{ type: string; description: string; score: number }> = [];

    // High momentum opportunity
    if (artist.momentum > 75) {
      opportunities.push({
        type: 'momentum',
        description: 'High momentum - ideal time for major campaign push',
        score: artist.momentum / 100,
      });
    }

    // Breakout opportunity
    if (artist.breakout_score > 0.6) {
      opportunities.push({
        type: 'breakout',
        description: 'Strong breakout signals - consider signing or major support',
        score: artist.breakout_score,
      });
    }

    // Network opportunity
    if (artist.mig_connectivity > 0.7) {
      opportunities.push({
        type: 'network',
        description: 'Well-connected in industry graph - leverage for collaborations',
        score: artist.mig_connectivity,
      });
    }

    // Press opportunity
    if (artist.press_quality > 0.7) {
      opportunities.push({
        type: 'press',
        description: 'High-quality press coverage - amplify with PR campaign',
        score: artist.press_quality,
      });
    }

    return opportunities.sort((a, b) => b.score - a.score);
  }

  /**
   * Analyze risks for an artist
   */
  private analyzeRisks(artist: TalentRadarArtist): Array<{
    type: string;
    description: string;
    severity: number;
  }> {
    const risks: Array<{ type: string; description: string; severity: number }> = [];

    // Overall high risk
    if (artist.risk_score > 0.7) {
      risks.push({
        type: 'overall',
        description: 'Multiple risk factors detected - careful assessment needed',
        severity: artist.risk_score,
      });
    }

    // Momentum decline
    if (artist.momentum < 30) {
      risks.push({
        type: 'momentum',
        description: 'Low momentum - may be experiencing stagnation',
        severity: 1 - (artist.momentum / 100),
      });
    }

    // Creative stagnation
    if (artist.creative_shift < 0.2) {
      risks.push({
        type: 'creative',
        description: 'Low creative evolution - potential artistic stagnation',
        severity: 1 - artist.creative_shift,
      });
    }

    // Identity misalignment
    if (artist.identity_alignment < 0.4) {
      risks.push({
        type: 'identity',
        description: 'Low identity coherence - brand may be unclear',
        severity: 1 - artist.identity_alignment,
      });
    }

    // Coverage decline
    if (artist.coverage_velocity < -0.3) {
      risks.push({
        type: 'coverage',
        description: 'Declining press coverage - visibility issues',
        severity: Math.abs(artist.coverage_velocity),
      });
    }

    return risks.sort((a, b) => b.severity - a.severity);
  }
}
