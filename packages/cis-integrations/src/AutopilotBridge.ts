/**
 * Autopilot Bridge - Interface to PR Autopilot system
 * Provides creative variants for missions and logs decisions
 */

export class AutopilotBridge {
  private autopilot: any;
  private supabase: any;

  constructor(autopilotInstance?: any, supabaseClient?: any) {
    this.autopilot = autopilotInstance;
    this.supabase = supabaseClient;
  }

  async getCreativeVariantsForMission(missionId: string): Promise<any[]> {
    try {
      if (!this.supabase) {
        return [];
      }

      // Query CIS artifacts that might be relevant for this mission
      const { data, error } = await this.supabase
        .from('cis_artifacts')
        .select('*, cis_projects(*)')
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) {
        console.error('Error fetching creative variants:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error getting creative variants:', error);
      return [];
    }
  }

  async logCreativeDecision(
    missionId: string,
    projectId: string,
    artifactId: string,
    decision: Record<string, any>
  ): Promise<boolean> {
    try {
      if (!this.autopilot?.logDecision) {
        console.log('Autopilot decision logged (stub):', { missionId, projectId, artifactId });
        return true;
      }

      await this.autopilot.logDecision(missionId, {
        projectId,
        artifactId,
        ...decision,
      });

      return true;
    } catch (error) {
      console.error('Error logging creative decision:', error);
      return false;
    }
  }

  async getRecommendedAssetsForCampaign(campaignId: string, artistSlug: string): Promise<any[]> {
    try {
      if (!this.supabase) {
        return [];
      }

      const { data, error } = await this.supabase
        .from('cis_projects')
        .select('*, cis_artifacts(*)')
        .eq('artist_slug', artistSlug)
        .eq('campaign_id', campaignId);

      if (error) {
        console.error('Error fetching recommended assets:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error getting recommended assets:', error);
      return [];
    }
  }
}

export const createAutopilotBridge = (
  autopilotInstance?: any,
  supabaseClient?: any
): AutopilotBridge => {
  return new AutopilotBridge(autopilotInstance, supabaseClient);
};
