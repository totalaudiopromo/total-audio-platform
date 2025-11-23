/**
 * CIS Integration Types
 * Shared types for all integration bridges
 */

export interface CISContext {
  projectId: string;
  userId: string;
  artistSlug?: string;
  campaignId?: string;
  releaseId?: string;
  
  // From Fusion Layer
  artistContext?: ArtistContext;
  campaignContext?: CampaignContext;
  sceneContext?: SceneContext;
  audienceSignals?: AudienceSignals;
  
  // From CMG
  creativeFingerprint?: CreativeFingerprint;
  emotionalArcPatterns?: EmotionalArcPattern[];
  structuralMotifs?: StructuralMotif[];
  
  // From Identity Kernel
  identityProfile?: IdentityProfile;
  
  // From MIG
  scenePaletteHints?: ScenePaletteHint[];
  sceneNarrativeAngles?: SceneNarrativeAngle[];
  microgenreVisualHints?: MicrogenreVisualHint[];
  
  timestamp: string;
}

export interface ArtistContext {
  slug: string;
  name: string;
  bio?: string;
  genre?: string;
  subGenres?: string[];
  influences?: string[];
  metadata?: Record<string, any>;
}

export interface CampaignContext {
  id: string;
  title: string;
  status: string;
  startDate?: string;
  endDate?: string;
  goals?: string[];
  metadata?: Record<string, any>;
}

export interface SceneContext {
  primaryScene?: string;
  secondaryScenes?: string[];
  sceneCharacteristics?: Record<string, any>;
}

export interface AudienceSignals {
  demographics?: Record<string, any>;
  psychographics?: Record<string, any>;
  engagement?: Record<string, any>;
}

export interface CreativeFingerprint {
  visualThemes?: string[];
  narrativePatterns?: string[];
  colorPreferences?: string[];
  compositionalStyle?: string;
  brandPersonality?: string[];
}

export interface EmotionalArcPattern {
  pattern: string;
  frequency: number;
  contexts?: string[];
}

export interface StructuralMotif {
  type: string;
  description: string;
  examples?: string[];
}

export interface IdentityProfile {
  coreValues?: string[];
  brandVoice?: string;
  visualIdentity?: Record<string, any>;
  narrativeThemes?: string[];
  audienceAlignment?: Record<string, any>;
}

export interface ScenePaletteHint {
  scene: string;
  suggestedColors: string[];
  mood: string;
  rationale?: string;
}

export interface SceneNarrativeAngle {
  scene: string;
  angle: string;
  hooks?: string[];
  rationale?: string;
}

export interface MicrogenreVisualHint {
  microgenre: string;
  visualElements: string[];
  references?: string[];
  rationale?: string;
}
