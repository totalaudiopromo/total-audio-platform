/**
 * Identity Kernel Bridge - READ + WRITE interface
 * Fetches identity profiles and pushes creative signals back
 */

import type { IdentityProfile } from './types';

export class IdentityKernelBridge {
  private identityKernel: any;
  private supabase: any;

  constructor(identityKernelInstance?: any, supabaseClient?: any) {
    this.identityKernel = identityKernelInstance;
    this.supabase = supabaseClient;
  }

  async fetchIdentityProfile(artistSlug: string): Promise<IdentityProfile | null> {
    try {
      if (!this.identityKernel?.getProfile) {
        return null;
      }

      const profile = await this.identityKernel.getProfile(artistSlug);
      return {
        coreValues: profile.coreValues || [],
        brandVoice: profile.brandVoice,
        visualIdentity: profile.visualIdentity || {},
        narrativeThemes: profile.narrativeThemes || [],
        audienceAlignment: profile.audienceAlignment || {},
      };
    } catch (error) {
      console.error('Error fetching identity profile:', error);
      return null;
    }
  }

  async pushIdentitySignal(
    projectId: string,
    userId: string,
    artistSlug: string,
    signalType: string,
    payload: Record<string, any>
  ): Promise<boolean> {
    try {
      if (!this.supabase) {
        console.warn('Supabase client not available');
        return false;
      }

      const { error } = await this.supabase
        .from('cis_identity_signals')
        .insert({
          project_id: projectId,
          user_id: userId,
          artist_slug: artistSlug,
          signal_type: signalType,
          payload,
        });

      if (error) {
        console.error('Error pushing identity signal:', error);
        return false;
      }

      // Also push to Identity Kernel if available
      if (this.identityKernel?.recordSignal) {
        await this.identityKernel.recordSignal(artistSlug, signalType, payload);
      }

      return true;
    } catch (error) {
      console.error('Error pushing identity signal:', error);
      return false;
    }
  }

  async syncBrandElements(artistSlug: string): Promise<Record<string, any> | null> {
    try {
      if (!this.identityKernel?.getBrandElements) {
        return null;
      }

      const elements = await this.identityKernel.getBrandElements(artistSlug);
      return {
        palettes: elements.palettes || [],
        motifs: elements.motifs || [],
        voiceHints: elements.voiceHints || {},
        visualArchetypes: elements.visualArchetypes || [],
      };
    } catch (error) {
      console.error('Error syncing brand elements:', error);
      return null;
    }
  }
}

export const createIdentityKernelBridge = (
  identityKernelInstance?: any,
  supabaseClient?: any
): IdentityKernelBridge => {
  return new IdentityKernelBridge(identityKernelInstance, supabaseClient);
};
