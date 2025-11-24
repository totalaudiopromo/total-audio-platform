/**
 * Fusion Context Bridge - READ-ONLY interface to Fusion Layer
 * Provides artist, campaign, scene, and audience context for CIS
 */

import type { ArtistContext, CampaignContext, SceneContext, AudienceSignals } from './types';

export class FusionContextBridge {
  private fusionLayer: any;

  constructor(fusionLayerInstance?: any) {
    this.fusionLayer = fusionLayerInstance;
  }

  async getArtistContext(artistSlug: string): Promise<ArtistContext | null> {
    try {
      if (!this.fusionLayer?.getArtistProfile) {
        console.warn('Fusion Layer not available');
        return this.getMockArtistContext(artistSlug);
      }

      const profile = await this.fusionLayer.getArtistProfile(artistSlug);
      return {
        slug: artistSlug,
        name: profile.name || artistSlug,
        bio: profile.bio,
        genre: profile.genre,
        subGenres: profile.subGenres || [],
        influences: profile.influences || [],
        metadata: profile.metadata || {},
      };
    } catch (error) {
      console.error('Error fetching artist context:', error);
      return null;
    }
  }

  async getCampaignContext(artistSlug: string, campaignId?: string): Promise<CampaignContext | null> {
    try {
      if (!this.fusionLayer?.getCampaigns) {
        return null;
      }

      const campaigns = await this.fusionLayer.getCampaigns(artistSlug);
      if (campaignId) {
        return campaigns.find((c: any) => c.id === campaignId) || null;
      }
      
      // Return most recent active campaign
      const activeCampaigns = campaigns.filter((c: any) => c.status === 'active');
      return activeCampaigns[0] || campaigns[0] || null;
    } catch (error) {
      console.error('Error fetching campaign context:', error);
      return null;
    }
  }

  async getSceneContext(artistSlug: string): Promise<SceneContext | null> {
    try {
      if (!this.fusionLayer?.getScenes) {
        return null;
      }

      const scenes = await this.fusionLayer.getScenes(artistSlug);
      return {
        primaryScene: scenes.primary,
        secondaryScenes: scenes.secondary || [],
        sceneCharacteristics: scenes.characteristics || {},
      };
    } catch (error) {
      console.error('Error fetching scene context:', error);
      return null;
    }
  }

  async getAudienceSignals(artistSlug: string): Promise<AudienceSignals | null> {
    try {
      if (!this.fusionLayer?.getAudienceInsights) {
        return null;
      }

      const insights = await this.fusionLayer.getAudienceInsights(artistSlug);
      return {
        demographics: insights.demographics || {},
        psychographics: insights.psychographics || {},
        engagement: insights.engagement || {},
      };
    } catch (error) {
      console.error('Error fetching audience signals:', error);
      return null;
    }
  }

  private getMockArtistContext(slug: string): ArtistContext {
    return {
      slug,
      name: slug.replace(/-/g, ' '),
      genre: 'Electronic',
      subGenres: ['House', 'Techno'],
      influences: [],
      metadata: {},
    };
  }
}

export const createFusionContextBridge = (fusionLayerInstance?: any): FusionContextBridge => {
  return new FusionContextBridge(fusionLayerInstance);
};
