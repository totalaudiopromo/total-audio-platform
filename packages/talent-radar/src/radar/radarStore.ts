/**
 * Radar Store - Database I/O for talent radar data
 */

import { SupabaseClient } from '@supabase/supabase-js';
import { ArtistSignals } from '../engines/artistSignalsEngine.js';
import { createLogger } from '../utils/logger.js';

const logger = createLogger('RadarStore');

export interface TalentRadarArtist {
  artist_slug: string;
  scene_slug: string | null;
  microgenres: string[];
  momentum: number;
  creative_shift: number;
  coverage_velocity: number;
  press_quality: number;
  reply_quality: number;
  playlist_velocity: number;
  audience_change: number;
  mig_connectivity: number;
  cmg_fingerprint_drift: number;
  identity_alignment: number;
  breakout_score: number;
  risk_score: number;
  metadata: Record<string, unknown>;
  updated_at: string;
}

export interface TalentRadarScene {
  scene_slug: string;
  hotness: number;
  influence: number;
  audience_trend: number;
  breakout_artists: string[];
  rising_artists: string[];
  metadata: Record<string, unknown>;
  updated_at: string;
}

export interface TalentRadarRecommendation {
  id: string;
  workspace_id: string;
  artist_slug: string;
  recommendation_type: 'sign' | 'watch' | 'collaborate' | 'pitch' | 'pass';
  rationale: Record<string, unknown>;
  score: number;
  confidence: number;
  opportunities: Record<string, unknown>;
  risks: Record<string, unknown>;
  created_at: string;
  expires_at?: string;
}

export class RadarStore {
  constructor(private supabase: SupabaseClient) {}

  /**
   * Save artist signals to database
   */
  async saveArtistSignals(signals: ArtistSignals): Promise<void> {
    try {
      const { error } = await this.supabase
        .from('talent_radar_artists')
        .upsert({
          artist_slug: signals.artistSlug,
          scene_slug: signals.sceneSlug,
          microgenres: signals.microgenres,
          momentum: signals.momentum,
          creative_shift: signals.creativeShift,
          coverage_velocity: signals.coverageVelocity,
          press_quality: signals.pressQuality,
          reply_quality: signals.replyQuality,
          playlist_velocity: signals.playlistVelocity,
          audience_change: signals.audienceChange,
          mig_connectivity: signals.migConnectivity,
          cmg_fingerprint_drift: signals.cmgFingerprintDrift,
          identity_alignment: signals.identityAlignment,
          breakout_score: signals.breakoutScore,
          risk_score: signals.riskScore,
          metadata: signals.metadata,
        });

      if (error) throw error;

      logger.info(`Saved signals for artist: ${signals.artistSlug}`);
    } catch (error) {
      logger.error(`Failed to save artist signals:`, error);
      throw error;
    }
  }

  /**
   * Get artist signals from database
   */
  async getArtistSignals(artistSlug: string): Promise<TalentRadarArtist | null> {
    try {
      const { data, error } = await this.supabase
        .from('talent_radar_artists')
        .select('*')
        .eq('artist_slug', artistSlug)
        .single();

      if (error) {
        if (error.code === 'PGRST116') return null; // Not found
        throw error;
      }

      return data as TalentRadarArtist;
    } catch (error) {
      logger.error(`Failed to get artist signals for ${artistSlug}:`, error);
      return null;
    }
  }

  /**
   * Get top rising artists by momentum
   */
  async getTopRisingArtists(limit: number = 50): Promise<TalentRadarArtist[]> {
    try {
      const { data, error } = await this.supabase
        .from('talent_radar_artists')
        .select('*')
        .order('momentum', { ascending: false })
        .limit(limit);

      if (error) throw error;

      return (data as TalentRadarArtist[]) || [];
    } catch (error) {
      logger.error('Failed to get top rising artists:', error);
      return [];
    }
  }

  /**
   * Get top breakout candidates
   */
  async getTopBreakoutCandidates(limit: number = 50): Promise<TalentRadarArtist[]> {
    try {
      const { data, error } = await this.supabase
        .from('talent_radar_artists')
        .select('*')
        .order('breakout_score', { ascending: false })
        .limit(limit);

      if (error) throw error;

      return (data as TalentRadarArtist[]) || [];
    } catch (error) {
      logger.error('Failed to get top breakout candidates:', error);
      return [];
    }
  }

  /**
   * Get artists at risk
   */
  async getArtistsAtRisk(limit: number = 50): Promise<TalentRadarArtist[]> {
    try {
      const { data, error } = await this.supabase
        .from('talent_radar_artists')
        .select('*')
        .order('risk_score', { ascending: false })
        .limit(limit);

      if (error) throw error;

      return (data as TalentRadarArtist[]) || [];
    } catch (error) {
      logger.error('Failed to get artists at risk:', error);
      return [];
    }
  }

  /**
   * Save scene signals
   */
  async saveSceneSignals(signals: Partial<TalentRadarScene>): Promise<void> {
    try {
      const { error } = await this.supabase
        .from('talent_radar_scenes')
        .upsert(signals);

      if (error) throw error;

      logger.info(`Saved signals for scene: ${signals.scene_slug}`);
    } catch (error) {
      logger.error('Failed to save scene signals:', error);
      throw error;
    }
  }

  /**
   * Get scene signals
   */
  async getSceneSignals(sceneSlug: string): Promise<TalentRadarScene | null> {
    try {
      const { data, error } = await this.supabase
        .from('talent_radar_scenes')
        .select('*')
        .eq('scene_slug', sceneSlug)
        .single();

      if (error) {
        if (error.code === 'PGRST116') return null;
        throw error;
      }

      return data as TalentRadarScene;
    } catch (error) {
      logger.error(`Failed to get scene signals for ${sceneSlug}:`, error);
      return null;
    }
  }

  /**
   * Save recommendation
   */
  async saveRecommendation(recommendation: Omit<TalentRadarRecommendation, 'id' | 'created_at'>): Promise<void> {
    try {
      const { error } = await this.supabase
        .from('talent_radar_recommendations')
        .insert(recommendation);

      if (error) throw error;

      logger.info(`Saved recommendation for artist: ${recommendation.artist_slug}`);
    } catch (error) {
      logger.error('Failed to save recommendation:', error);
      throw error;
    }
  }

  /**
   * Get recommendations for workspace
   */
  async getWorkspaceRecommendations(workspaceId: string, limit: number = 20): Promise<TalentRadarRecommendation[]> {
    try {
      const { data, error } = await this.supabase
        .from('talent_radar_recommendations')
        .select('*')
        .eq('workspace_id', workspaceId)
        .order('score', { ascending: false })
        .limit(limit);

      if (error) throw error;

      return (data as TalentRadarRecommendation[]) || [];
    } catch (error) {
      logger.error(`Failed to get recommendations for workspace ${workspaceId}:`, error);
      return [];
    }
  }
}
