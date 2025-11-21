/**
 * AI Skills Types
 */

import type { FusionContext } from '@total-audio/fusion-layer';

export interface SkillInput<T = unknown> {
  context: FusionContext;
  params: T;
  userId: string;
  workspaceId?: string;
}

export interface SkillOutput<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  metadata: {
    skillName: string;
    executionTime: number;
    tokensUsed?: number;
    model?: string;
  };
}

export interface CampaignAnalysisParams {
  campaignId: string;
}

export interface CampaignAnalysisOutput {
  summary: string;
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
  predictedOutcome: {
    openRate: number;
    responseRate: number;
    confidence: number;
  };
}

export interface NextActionsParams {
  limit?: number;
  priority?: 'high' | 'medium' | 'low';
}

export interface NextActionsOutput {
  actions: Action[];
  urgentCount: number;
}

export interface Action {
  id: string;
  type: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  dueDate?: Date;
  relatedEntity?: {
    type: string;
    id: string;
    name: string;
  };
}

export interface RewritePitchParams {
  originalPitch: string;
  targetTone?: string;
  targetGenre?: string;
  targetOutlet?: string;
  preserveVoice?: boolean;
}

export interface RewritePitchOutput {
  rewrittenPitch: string;
  changes: string[];
  reasoning: string;
  confidence: number;
}

export interface PatternDetectionOutput {
  patterns: Pattern[];
  insights: string[];
  recommendations: string[];
}

export interface Pattern {
  type: string;
  description: string;
  confidence: number;
  impact: 'positive' | 'negative' | 'neutral';
  dataPoints: number;
  examples: string[];
}

export interface GenerateNarrativeParams {
  campaignId: string;
  narrativeType?: 'timeline' | 'insights' | 'summary' | 'report';
}

export interface GenerateNarrativeOutput {
  title: string;
  narrative: string;
  keyEvents: string[];
  insights: string[];
  visualizations?: string[];
}

export interface RecommendCollaboratorsParams {
  genre?: string[];
  profileType?: string;
  limit?: number;
}

export interface RecommendCollaboratorsOutput {
  collaborators: Collaborator[];
}

export interface Collaborator {
  userId: string;
  displayName: string;
  profileType: string;
  matchScore: number;
  matchReasons: string[];
  commonInterests: string[];
  potentialValue: string;
}

export interface SmartSegmentationParams {
  segmentName: string;
  criteria?: Record<string, unknown>;
  aiAssisted?: boolean;
}

export interface SmartSegmentationOutput {
  segmentId: string;
  contacts: string[];
  reasoning: string;
  filters: Record<string, unknown>;
  confidenceScore: number;
}
