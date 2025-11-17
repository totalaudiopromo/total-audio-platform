/**
 * Core types for Creative Intelligence Studio (CIS)
 */

// =============================================================================
// PROJECT TYPES
// =============================================================================

export type ProjectType =
  | 'cover_art'
  | 'moodboard'
  | 'brand_kit'
  | 'storyboard'
  | 'content_hooks'
  | 'trailer_script';

export interface CISProject {
  id: string;
  userId: string;
  title: string;
  type: ProjectType;
  metadata: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProjectInput {
  title: string;
  type: ProjectType;
  metadata?: Record<string, any>;
}

export interface UpdateProjectInput {
  title?: string;
  metadata?: Record<string, any>;
}

// =============================================================================
// ARTIFACT TYPES
// =============================================================================

export type ArtifactType =
  | 'image'
  | 'video'
  | 'pdf'
  | 'palette'
  | 'script'
  | 'moodboard';

export interface CISArtifact {
  id: string;
  projectId: string;
  artifactType: ArtifactType;
  url?: string;
  metadata: Record<string, any>;
  createdAt: string;
}

export interface CreateArtifactInput {
  projectId: string;
  artifactType: ArtifactType;
  url?: string;
  metadata?: Record<string, any>;
}

// =============================================================================
// ELEMENT TYPES
// =============================================================================

export type ElementType = 'image' | 'text' | 'color' | 'reference' | 'block';

export interface ElementPosition {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface CISElement {
  id: string;
  projectId: string;
  elementType: ElementType;
  content: Record<string, any>;
  position: ElementPosition;
  ordering: number;
  createdAt: string;
}

export interface CreateElementInput {
  projectId: string;
  elementType: ElementType;
  content: Record<string, any>;
  position?: ElementPosition;
  ordering?: number;
}

export interface UpdateElementInput {
  content?: Record<string, any>;
  position?: ElementPosition;
  ordering?: number;
}

// =============================================================================
// CREATIVE CONTEXT TYPES
// =============================================================================

export interface EmotionalArc {
  segments: Array<{
    timestamp: number;
    emotion: string;
    intensity: number;
    description?: string;
  }>;
  dominantEmotion: string;
  emotionalRange: number;
}

export interface SonicFingerprint {
  tempo: number;
  key: string;
  mode: 'major' | 'minor';
  energy: number;
  danceability: number;
  acousticness: number;
  instrumentalness: number;
  valence: number;
  descriptors: string[];
}

export interface GenreProfile {
  primary: string;
  secondary?: string[];
  influences: string[];
  visualArchetypes: string[];
  colorPalettes: string[][];
  typographyStyles: string[];
}

export interface ArtistProfile {
  id: string;
  name: string;
  bio?: string;
  genre?: string;
  subGenres?: string[];
  influences?: string[];
  metadata?: Record<string, any>;
}

export interface CreativeContext {
  userId: string;
  artist?: ArtistProfile;
  emotionalArc?: EmotionalArc;
  sonicFingerprint?: SonicFingerprint;
  genreProfile?: GenreProfile;
  campaignInsights?: Record<string, any>;
  references?: string[];
  brandTone?: string;
  timestamp: string;
}

// =============================================================================
// AI CACHE TYPES
// =============================================================================

export interface CISAICache {
  id: string;
  userId: string;
  key: string;
  result: Record<string, any>;
  createdAt: string;
  expiresAt: string;
}

export interface CreateCacheInput {
  key: string;
  result: Record<string, any>;
  expiresAt?: string;
}

// =============================================================================
// CREATIVE SUGGESTION TYPES
// =============================================================================

export interface ColorPalette {
  name: string;
  colors: string[];
  description?: string;
  mood?: string;
  genreAlignment?: string;
}

export interface LayoutSuggestion {
  name: string;
  description: string;
  archetype: string;
  gridStructure?: {
    columns: number;
    rows: number;
  };
  placementRules?: string[];
}

export interface TypographySuggestion {
  headingFont: string;
  bodyFont: string;
  accentFont?: string;
  description: string;
  genreAlignment?: string;
}

export interface VisualReference {
  type: 'image' | 'color' | 'composition' | 'texture';
  url?: string;
  description: string;
  relevance: number;
}

export interface CreativeSuggestions {
  palettes: ColorPalette[];
  layouts: LayoutSuggestion[];
  typography: TypographySuggestion[];
  references: VisualReference[];
  moodDescriptors: string[];
  visualMetaphors: string[];
}

// =============================================================================
// EXPORT TYPES
// =============================================================================

export type ExportFormat = 'jpg' | 'png' | 'pdf' | 'zip' | 'json' | 'txt';

export interface ExportOptions {
  format: ExportFormat;
  quality?: number;
  includeMetadata?: boolean;
  watermark?: boolean;
}

export interface ExportResult {
  url: string;
  format: ExportFormat;
  size: number;
  metadata?: Record<string, any>;
}

// =============================================================================
// HOOK/CONTENT TYPES
// =============================================================================

export interface ContentHook {
  platform: 'tiktok' | 'instagram' | 'youtube' | 'twitter' | 'generic';
  hookText: string;
  visualSuggestion?: string;
  duration?: number;
  callToAction?: string;
  relevanceScore: number;
}

export interface StoryArc {
  name: string;
  description: string;
  acts: Array<{
    actNumber: number;
    description: string;
    duration?: number;
    visualCues?: string[];
    emotionalBeat?: string;
  }>;
  pacing: 'slow' | 'medium' | 'fast';
  genre: string;
}

export interface TrailerScript {
  duration: number;
  format: '10s' | '15s' | '30s' | '60s';
  voiceover?: string[];
  shotList: Array<{
    shotNumber: number;
    description: string;
    duration: number;
    visualCues?: string[];
    audioNotes?: string;
  }>;
  musicCues?: Array<{
    timestamp: number;
    description: string;
  }>;
  pacing: string;
}

// =============================================================================
// ERROR TYPES
// =============================================================================

export class CISError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 500
  ) {
    super(message);
    this.name = 'CISError';
  }
}
