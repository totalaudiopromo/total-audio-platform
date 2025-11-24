/**
 * Context Builder
 *
 * Builds unified AgentContext by integrating with existing TAP systems.
 * This is a thin orchestration layer that wraps existing clients.
 */

import type { SupabaseClient } from '@supabase/supabase-js';
import type {
  AgentContext,
  FusionContext,
  CMGClient,
  EmailEngineClient,
  ListBuilderClient,
  TrackerClient,
  IntelClient,
  PitchClient,
  NarrativeClient,
  SuccessProfilesClient,
} from '../types';
import { MissionStore } from './missionStore';
import { createPolicyEngine } from './policyEngine';
import { createLogger } from '../utils/logger';
import { ContextBuildError } from '../utils/errors';

/**
 * Build agent context for a mission
 *
 * This function:
 * 1. Loads mission from database
 * 2. Gets fusion context (from @total-audio/fusion-layer if available)
 * 3. Instantiates thin client wrappers for existing TAP systems
 * 4. Returns unified context
 */
export async function buildAgentContext(
  missionId: string,
  supabase: SupabaseClient
): Promise<AgentContext> {
  try {
    // Load mission
    const store = new MissionStore(supabase);
    const mission = await store.getMission(missionId);

    // Build fusion context
    // TODO: When @total-audio/fusion-layer is available, call it here
    const fusionContext = await buildFusionContext(
      mission.user_id,
      mission.workspace_id || undefined,
      supabase
    );

    // Create client wrappers
    const clients = {
      cmg: createCMGClient(supabase),
      emailEngine: createEmailEngineClient(supabase),
      listBuilder: createListBuilderClient(supabase),
      tracker: createTrackerClient(supabase),
      intel: createIntelClient(supabase),
      pitch: createPitchClient(supabase),
      narrative: createNarrativeClient(supabase),
      successProfiles: createSuccessProfilesClient(supabase),
    };

    // Create logger
    const logger = createLogger({
      missionId,
      supabase,
      console: true,
    });

    // Create policy engine
    const policyEngine = createPolicyEngine(supabase);

    return {
      userId: mission.user_id,
      workspaceId: mission.workspace_id || undefined,
      mission,
      fusionContext,
      clients,
      logger,
      policyEngine,
    };
  } catch (error) {
    if (error instanceof Error) {
      throw new ContextBuildError(error.message, { missionId, error });
    }
    throw new ContextBuildError('Unknown error', { missionId });
  }
}

/**
 * Build fusion context
 * TODO: Replace with actual @total-audio/fusion-layer integration
 */
async function buildFusionContext(
  userId: string,
  workspaceId: string | undefined,
  supabase: SupabaseClient
): Promise<FusionContext> {
  // Fetch user
  const { data: user } = await supabase.auth.getUser();

  // Fetch workspace if applicable
  let workspace = null;
  if (workspaceId) {
    const { data } = await supabase
      .from('workspaces')
      .select('*')
      .eq('id', workspaceId)
      .single();
    workspace = data;
  }

  return {
    user: {
      id: userId,
      email: user?.user?.email || '',
      name: user?.user?.user_metadata?.name,
    },
    workspace: workspace
      ? {
          id: workspace.id,
          name: workspace.name,
          type: workspace.workspace_type || 'personal',
        }
      : undefined,
    preferences: {},
    features: [],
  };
}

// ============================================
// Client Factory Functions
// ============================================
// These are THIN WRAPPERS that call existing TAP systems
// They should NOT reimplement functionality

function createCMGClient(supabase: SupabaseClient): CMGClient {
  return {
    async getMemories(filter: Record<string, unknown>) {
      // TODO: Call @total-audio/cmg when available
      return [];
    },
    async createMemory(data: Record<string, unknown>) {
      // TODO: Call @total-audio/cmg when available
      return {};
    },
    async updateMemory(id: string, data: Record<string, unknown>) {
      // TODO: Call @total-audio/cmg when available
      return {};
    },
    async query(query: string) {
      // TODO: Call @total-audio/cmg when available
      return {};
    },
  };
}

function createEmailEngineClient(supabase: SupabaseClient): EmailEngineClient {
  return {
    async createCampaign(data) {
      // TODO: Call existing email-engine package/API
      const { data: campaign } = await supabase
        .from('email_campaigns')
        .insert({
          name: data.name,
          type: data.type,
          status: 'draft',
        })
        .select()
        .single();
      return campaign as any;
    },
    async getCampaign(id: string) {
      const { data } = await supabase
        .from('email_campaigns')
        .select('*')
        .eq('id', id)
        .single();
      return data as any;
    },
    async scheduleEmail(data) {
      // TODO: Call existing email-engine
      return {} as any;
    },
    async getTemplates() {
      // TODO: Call existing email-engine
      return [];
    },
    async renderTemplate(templateId: string, data: Record<string, unknown>) {
      // TODO: Call existing email-engine
      return '';
    },
  };
}

function createListBuilderClient(supabase: SupabaseClient): ListBuilderClient {
  return {
    async createSegment(data) {
      // TODO: Call @total-audio/list-builder when available
      const { data: segment } = await supabase
        .from('smart_segments')
        .insert({
          name: data.name,
          criteria: data.criteria,
          workspace_id: data.workspace_id,
        })
        .select()
        .single();
      return segment as any;
    },
    async getSegment(id: string) {
      const { data } = await supabase
        .from('smart_segments')
        .select('*')
        .eq('id', id)
        .single();
      return data as any;
    },
    async updateSegment(id: string, data) {
      const { data: segment } = await supabase
        .from('smart_segments')
        .update(data)
        .eq('id', id)
        .select()
        .single();
      return segment as any;
    },
    async evaluateSegment(id: string) {
      // TODO: Call list-builder evaluation logic
      return [];
    },
  };
}

function createTrackerClient(supabase: SupabaseClient): TrackerClient {
  return {
    async getCampaignMetrics(campaignId: string) {
      // TODO: Call tracker APIs
      return {
        sends: 0,
        opens: 0,
        clicks: 0,
        replies: 0,
        open_rate: 0,
        click_rate: 0,
        reply_rate: 0,
      };
    },
    async getContactActivity(contactId: string) {
      // TODO: Call tracker APIs
      return [];
    },
    async logActivity(data) {
      // TODO: Call tracker APIs
      return {} as any;
    },
  };
}

function createIntelClient(supabase: SupabaseClient): IntelClient {
  return {
    async enrichContact(email: string) {
      // TODO: Call Audio Intel APIs
      return {} as any;
    },
    async searchContacts(query) {
      // TODO: Call Audio Intel search
      const { data } = await supabase
        .from('contacts')
        .select('*')
        .limit(query.limit || 50);
      return (data || []) as any;
    },
    async getContactIntelligence(contactId: string) {
      // TODO: Call contact intelligence system
      return {} as any;
    },
  };
}

function createPitchClient(supabase: SupabaseClient): PitchClient {
  return {
    async generatePitch(data) {
      // TODO: Call Pitch Generator APIs
      return {} as any;
    },
    async generateVariations(pitchId: string, count: number) {
      // TODO: Call Pitch Generator
      return [];
    },
    async scorePitch(pitch: string, audience: string) {
      // TODO: Call Pitch Generator scoring
      return { overall: 0, relevance: 0, personalization: 0, clarity: 0 };
    },
  };
}

function createNarrativeClient(supabase: SupabaseClient): NarrativeClient {
  return {
    async synthesizeNarrative(data) {
      // TODO: Call narrative engine
      return {} as any;
    },
    async extractInsights(campaignId: string) {
      // TODO: Call narrative engine
      return [];
    },
  };
}

function createSuccessProfilesClient(
  supabase: SupabaseClient
): SuccessProfilesClient {
  return {
    async findSimilarCampaigns(query) {
      // TODO: Call @total-audio/success-profiles
      return [];
    },
    async getBestPractices(genre: string, type: string) {
      // TODO: Call success profiles
      return [];
    },
    async recordOutcome(data) {
      // TODO: Call success profiles
    },
  };
}
