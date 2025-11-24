/**
 * AI Context Builder - builds creative context for AI generators
 * Assembles data from Fusion Layer, CMG, and user metadata
 */

import { createLogger } from './utils/logger';
import type { CreativeContext } from './types';

const logger = createLogger({ module: 'aiContextBuilder' });

export interface AIContextBuilderConfig {
  includeEmotionalArc?: boolean;
  includeSonicFingerprint?: boolean;
  includeGenreProfile?: boolean;
  includeCampaignInsights?: boolean;
}

export class AIContextBuilder {
  private fusionAdapter: any; // cisFusionAdapter instance

  constructor(fusionAdapter: any) {
    this.fusionAdapter = fusionAdapter;
  }

  /**
   * Build complete creative context for a user
   */
  async buildContext(
    userId: string,
    config: AIContextBuilderConfig = {}
  ): Promise<CreativeContext> {
    try {
      logger.info('Building creative context', { userId });

      const context: CreativeContext = {
        userId,
        timestamp: new Date().toISOString(),
      };

      // Get artist profile (always included)
      try {
        const artistProfile = await this.fusionAdapter.getArtistProfile(userId);
        if (artistProfile) {
          context.artist = artistProfile;
        }
      } catch (error) {
        logger.warn('Failed to fetch artist profile', error);
      }

      // Get emotional arc from CMG (optional)
      if (config.includeEmotionalArc !== false) {
        try {
          const emotionalArc = await this.fusionAdapter.getCMGEmotionalArc(userId);
          if (emotionalArc) {
            context.emotionalArc = emotionalArc;
          }
        } catch (error) {
          logger.warn('Failed to fetch emotional arc', error);
        }
      }

      // Get sonic fingerprint from CMG (optional)
      if (config.includeSonicFingerprint !== false) {
        try {
          const sonicFingerprint = await this.fusionAdapter.getCMGFingerprint(userId);
          if (sonicFingerprint) {
            context.sonicFingerprint = sonicFingerprint;
          }
        } catch (error) {
          logger.warn('Failed to fetch sonic fingerprint', error);
        }
      }

      // Get genre profile (optional)
      if (config.includeGenreProfile !== false && context.artist?.genre) {
        try {
          const genreProfile = await this.fusionAdapter.getSuccessProfile(
            context.artist.genre
          );
          if (genreProfile) {
            context.genreProfile = genreProfile;
          }
        } catch (error) {
          logger.warn('Failed to fetch genre profile', error);
        }
      }

      // Get campaign insights (optional)
      if (config.includeCampaignInsights !== false) {
        try {
          const campaignInsights = await this.fusionAdapter.getCampaignInsights(userId);
          if (campaignInsights) {
            context.campaignInsights = campaignInsights;
          }
        } catch (error) {
          logger.warn('Failed to fetch campaign insights', error);
        }
      }

      logger.info('Creative context built successfully', {
        userId,
        hasArtist: !!context.artist,
        hasEmotionalArc: !!context.emotionalArc,
        hasSonicFingerprint: !!context.sonicFingerprint,
        hasGenreProfile: !!context.genreProfile,
      });

      return context;
    } catch (error) {
      logger.error('Error building creative context', error);
      throw error;
    }
  }

  /**
   * Build lightweight context (without expensive CMG data)
   */
  async buildLightweightContext(userId: string): Promise<CreativeContext> {
    return this.buildContext(userId, {
      includeEmotionalArc: false,
      includeSonicFingerprint: false,
      includeCampaignInsights: false,
    });
  }

  /**
   * Build context for specific project type
   */
  async buildForProjectType(
    userId: string,
    projectType: string
  ): Promise<CreativeContext> {
    // Customize context based on project type
    const config: AIContextBuilderConfig = {};

    switch (projectType) {
      case 'cover_art':
      case 'moodboard':
        // Visual projects need emotional arc and genre profile
        config.includeEmotionalArc = true;
        config.includeGenreProfile = true;
        config.includeSonicFingerprint = false;
        break;

      case 'trailer_script':
      case 'storyboard':
        // Narrative projects need everything
        config.includeEmotionalArc = true;
        config.includeSonicFingerprint = true;
        config.includeGenreProfile = true;
        break;

      case 'brand_kit':
        // Brand projects need genre profile mainly
        config.includeGenreProfile = true;
        config.includeEmotionalArc = false;
        config.includeSonicFingerprint = false;
        break;

      case 'content_hooks':
        // Content projects benefit from campaign insights
        config.includeCampaignInsights = true;
        config.includeGenreProfile = true;
        break;

      default:
        // Use defaults
        break;
    }

    return this.buildContext(userId, config);
  }
}

/**
 * Factory function to create AIContextBuilder
 */
export const createAIContextBuilder = (fusionAdapter: any): AIContextBuilder => {
  return new AIContextBuilder(fusionAdapter);
};
