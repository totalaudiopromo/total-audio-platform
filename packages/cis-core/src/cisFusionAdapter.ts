/**
 * CIS Fusion Adapter - READ-ONLY interface to Fusion Layer
 *
 * CRITICAL: This adapter MUST NOT write to Fusion Layer
 * Only read operations for creative context building
 */

import { createLogger } from './utils/logger';
import type {
  ArtistProfile,
  EmotionalArc,
  SonicFingerprint,
  GenreProfile,
} from './types';

const logger = createLogger({ module: 'cisFusionAdapter' });

export interface CISFusionAdapterConfig {
  fusionLayerUrl?: string;
  apiKey?: string;
}

export class CISFusionAdapter {
  private config: CISFusionAdapterConfig;
  private fusionLayer: any; // @total-audio/fusion-layer instance

  constructor(config: CISFusionAdapterConfig, fusionLayerInstance?: any) {
    this.config = config;
    this.fusionLayer = fusionLayerInstance;
  }

  /**
   * Get artist profile for creative context
   * READ-ONLY
   */
  async getArtistProfile(userId: string): Promise<ArtistProfile | null> {
    try {
      logger.info('Fetching artist profile', { userId });

      // If fusion layer instance exists, use it
      if (this.fusionLayer?.getArtistProfile) {
        const profile = await this.fusionLayer.getArtistProfile(userId);
        return this.mapArtistProfile(profile);
      }

      // Fallback: direct API call
      // This would be implemented when fusion-layer package exists
      logger.warn('Fusion layer not available, returning mock data');
      return this.getMockArtistProfile(userId);
    } catch (error) {
      logger.error('Error fetching artist profile', error);
      return null;
    }
  }

  /**
   * Get CMG emotional arc for creative context
   * READ-ONLY
   */
  async getCMGEmotionalArc(userId: string): Promise<EmotionalArc | null> {
    try {
      logger.info('Fetching CMG emotional arc', { userId });

      if (this.fusionLayer?.getCMGEmotionalArc) {
        const arc = await this.fusionLayer.getCMGEmotionalArc(userId);
        return this.mapEmotionalArc(arc);
      }

      logger.warn('CMG emotional arc not available');
      return null;
    } catch (error) {
      logger.error('Error fetching emotional arc', error);
      return null;
    }
  }

  /**
   * Get CMG sonic fingerprint
   * READ-ONLY
   */
  async getCMGFingerprint(userId: string): Promise<SonicFingerprint | null> {
    try {
      logger.info('Fetching CMG sonic fingerprint', { userId });

      if (this.fusionLayer?.getCMGFingerprint) {
        const fingerprint = await this.fusionLayer.getCMGFingerprint(userId);
        return this.mapSonicFingerprint(fingerprint);
      }

      logger.warn('CMG sonic fingerprint not available');
      return null;
    } catch (error) {
      logger.error('Error fetching sonic fingerprint', error);
      return null;
    }
  }

  /**
   * Get genre success profile for visual/brand recommendations
   * READ-ONLY
   */
  async getSuccessProfile(genre: string): Promise<GenreProfile | null> {
    try {
      logger.info('Fetching genre success profile', { genre });

      if (this.fusionLayer?.getSuccessProfile) {
        const profile = await this.fusionLayer.getSuccessProfile(genre);
        return this.mapGenreProfile(profile);
      }

      logger.warn('Genre success profile not available, using defaults');
      return this.getDefaultGenreProfile(genre);
    } catch (error) {
      logger.error('Error fetching success profile', error);
      return this.getDefaultGenreProfile(genre);
    }
  }

  /**
   * Get campaign insights (if available)
   * READ-ONLY
   */
  async getCampaignInsights(userId: string): Promise<Record<string, any> | null> {
    try {
      logger.info('Fetching campaign insights', { userId });

      if (this.fusionLayer?.getCampaignInsights) {
        return await this.fusionLayer.getCampaignInsights(userId);
      }

      return null;
    } catch (error) {
      logger.error('Error fetching campaign insights', error);
      return null;
    }
  }

  // =============================================================================
  // MAPPING FUNCTIONS
  // =============================================================================

  private mapArtistProfile(data: any): ArtistProfile | null {
    if (!data) return null;

    return {
      id: data.id,
      name: data.name || data.artistName,
      bio: data.bio,
      genre: data.genre || data.primaryGenre,
      subGenres: data.subGenres || data.secondaryGenres || [],
      influences: data.influences || [],
      metadata: data.metadata || {},
    };
  }

  private mapEmotionalArc(data: any): EmotionalArc | null {
    if (!data) return null;

    return {
      segments: data.segments || [],
      dominantEmotion: data.dominantEmotion || 'neutral',
      emotionalRange: data.emotionalRange || 0,
    };
  }

  private mapSonicFingerprint(data: any): SonicFingerprint | null {
    if (!data) return null;

    return {
      tempo: data.tempo || 120,
      key: data.key || 'C',
      mode: data.mode || 'major',
      energy: data.energy || 0.5,
      danceability: data.danceability || 0.5,
      acousticness: data.acousticness || 0.5,
      instrumentalness: data.instrumentalness || 0.5,
      valence: data.valence || 0.5,
      descriptors: data.descriptors || [],
    };
  }

  private mapGenreProfile(data: any): GenreProfile | null {
    if (!data) return null;

    return {
      primary: data.primary || data.genre,
      secondary: data.secondary || [],
      influences: data.influences || [],
      visualArchetypes: data.visualArchetypes || [],
      colorPalettes: data.colorPalettes || [],
      typographyStyles: data.typographyStyles || [],
    };
  }

  // =============================================================================
  // MOCK/DEFAULT DATA (for development)
  // =============================================================================

  private getMockArtistProfile(userId: string): ArtistProfile {
    return {
      id: userId,
      name: 'Artist',
      genre: 'Electronic',
      subGenres: ['House', 'Techno'],
      influences: [],
      metadata: {},
    };
  }

  private getDefaultGenreProfile(genre: string): GenreProfile {
    // Basic defaults based on genre
    const defaults: Record<string, Partial<GenreProfile>> = {
      Electronic: {
        visualArchetypes: ['futuristic', 'minimal', 'geometric'],
        colorPalettes: [
          ['#3AA9BE', '#1F2937', '#FFFFFF'],
          ['#6366F1', '#0F172A', '#E0E7FF'],
        ],
        typographyStyles: ['sans-serif', 'geometric', 'modern'],
      },
      Rock: {
        visualArchetypes: ['bold', 'vintage', 'gritty'],
        colorPalettes: [
          ['#DC2626', '#000000', '#FFFFFF'],
          ['#78716C', '#1C1917', '#FEF3C7'],
        ],
        typographyStyles: ['bold', 'condensed', 'vintage'],
      },
      'Hip Hop': {
        visualArchetypes: ['urban', 'bold', 'dynamic'],
        colorPalettes: [
          ['#FBBF24', '#000000', '#FFFFFF'],
          ['#EF4444', '#1F2937', '#FCD34D'],
        ],
        typographyStyles: ['bold', 'street', 'impact'],
      },
      Pop: {
        visualArchetypes: ['colorful', 'playful', 'modern'],
        colorPalettes: [
          ['#EC4899', '#3B82F6', '#FBBF24'],
          ['#A855F7', '#F472B6', '#FDE047'],
        ],
        typographyStyles: ['rounded', 'friendly', 'modern'],
      },
    };

    const defaultData = defaults[genre] || defaults.Electronic;

    return {
      primary: genre,
      secondary: [],
      influences: [],
      visualArchetypes: defaultData.visualArchetypes || [],
      colorPalettes: defaultData.colorPalettes || [],
      typographyStyles: defaultData.typographyStyles || [],
    };
  }
}

/**
 * Factory function to create CISFusionAdapter
 */
export const createCISFusionAdapter = (
  config: CISFusionAdapterConfig = {},
  fusionLayerInstance?: any
): CISFusionAdapter => {
  return new CISFusionAdapter(config, fusionLayerInstance);
};
