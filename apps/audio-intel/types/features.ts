/**
 * Total Audio Promo - Feature Type Definitions
 * All 7 high-ROI features
 */

// ============================================================================
// 1. CONTACT CONFIDENCE ENGINE
// ============================================================================

export interface ContactConfidence {
  id: string;
  user_id: string;
  contact_id: string;
  created_at: string;
  updated_at: string;

  // Confidence metrics
  overall_score: number; // 0-100
  confidence_level: 'high' | 'medium' | 'low';

  // Individual factor scores
  email_validity_score: number;
  data_freshness_score: number;
  source_quality_score: number;
  enrichment_depth_score: number;
  verification_status_score: number;

  // Metadata
  last_verified_at: string;
  verification_method: string | null;
  confidence_notes: string | null;

  // Flags
  requires_reverification: boolean;
  high_risk_contact: boolean;
}

export interface CalculateConfidenceInput {
  contactId: string;
  contactEmail: string;
  enrichmentData?: {
    emailValid?: boolean;
    dataAge?: number; // days
    sourceQuality?: 'high' | 'medium' | 'low';
    fieldsEnriched?: string[];
    verificationStatus?: 'verified' | 'unverified' | 'bounced';
  };
}

// ============================================================================
// 2. CONTACT SIMILARITY ENGINE
// ============================================================================

export interface ContactSimilarity {
  id: string;
  user_id: string;
  contact_id: string;
  similar_contact_id: string;
  created_at: string;

  // Similarity metrics
  similarity_score: number; // 0-100

  // Factor breakdown
  genre_similarity: number;
  location_similarity: number;
  role_similarity: number;
  audience_size_similarity: number;
  platform_similarity: number;

  // Metadata
  matching_attributes: Record<string, any>;
  recommendation_reason: string;
}

export interface FindSimilarContactsInput {
  contactId: string;
  limit?: number;
  minSimilarityScore?: number;
}

export interface SimilarContactResult {
  contactId: string;
  contact: any;
  similarityScore: number;
  genreSimilarity: number;
  locationSimilarity: number;
  roleSimilarity: number;
  audienceSizeSimilarity: number;
  platformSimilarity: number;
  matchingAttributes: Record<string, any>;
  recommendationReason: string;
}

// ============================================================================
// 3. PITCH VARIATIONS GENERATOR
// ============================================================================

export type PitchVariationType = 'formal' | 'casual' | 'concise' | 'detailed' | 'follow-up';
export type TargetContactType = 'radio' | 'playlist' | 'press' | 'blog';

export interface PitchVariation {
  id: string;
  user_id: string;
  original_pitch_id: string | null;
  created_at: string;
  updated_at: string;

  // Pitch content
  variation_type: PitchVariationType;
  subject_line: string;
  body: string;

  // Generation metadata
  generated_by: 'ai' | 'manual';
  generation_model: string | null;
  generation_prompt: string | null;

  // Artist/campaign context
  artist_name: string | null;
  track_title: string | null;
  genre: string | null;
  target_contact_type: TargetContactType | null;

  // Usage tracking
  times_used: number;
  times_opened: number;
  times_replied: number;

  // Quality metrics
  user_rating: number | null; // 1-5
  effectiveness_score: number | null; // 0-100
}

export interface GeneratePitchVariationInput {
  artistName: string;
  trackTitle: string;
  genre?: string;
  targetContactType?: TargetContactType;
  variationType?: PitchVariationType;
  contextInfo?: string;
  streamingLinks?: {
    spotify?: string;
    apple?: string;
    bandcamp?: string;
    soundcloud?: string;
  };
  previousCoverage?: string[];
  saveToDB?: boolean;
}

// ============================================================================
// 4. CAMPAIGN POST-MORTEMS
// ============================================================================

export interface CampaignPostMortem {
  id: string;
  user_id: string;
  campaign_id: string | null;
  created_at: string;
  updated_at: string;

  // Campaign details
  campaign_name: string;
  artist_name: string | null;
  date_range_start: string | null;
  date_range_end: string | null;

  // AI-generated analysis
  executive_summary: string;
  key_wins: string[];
  key_learnings: string[];
  improvement_recommendations: string[];

  // Metrics
  total_contacts_reached: number | null;
  response_rate: number | null; // percentage
  success_rate: number | null; // percentage
  avg_response_time_hours: number | null;

  // Performance breakdown
  performance_by_channel: Record<string, any> | null;
  performance_by_genre: Record<string, any> | null;
  top_performing_pitches: any[] | null;
  underperforming_areas: any[] | null;

  // Generation metadata
  generated_by: 'ai' | 'manual';
  generation_model: string | null;
  generation_quality_score: number | null; // 1-5

  // User interaction
  user_notes: string | null;
  shared_with_team: boolean;
  exported_at: string | null;
}

export interface GeneratePostMortemInput {
  campaignName: string;
  artistName?: string;
  dateRangeStart?: string;
  dateRangeEnd?: string;
  campaignData: {
    totalContactsReached?: number;
    responseRate?: number;
    successRate?: number;
    avgResponseTimeHours?: number;
    performanceByChannel?: Record<string, any>;
    performanceByGenre?: Record<string, any>;
    topPerformingPitches?: any[];
    underperformingAreas?: any[];
  };
}

// ============================================================================
// 5. EXPORT TEMPLATES
// ============================================================================

export type ExportTemplateType = 'press-kit' | 'radio-plan' | 'playlist-pack' | 'client-report' | 'custom';
export type ExportOutputFormat = 'pdf' | 'csv' | 'zip' | 'docx' | 'excel';

export interface ExportTemplate {
  id: string;
  user_id: string | null; // null for system templates
  created_at: string;
  updated_at: string;

  // Template identification
  template_name: string;
  template_type: ExportTemplateType;
  is_system_template: boolean;
  is_active: boolean;

  // Template configuration
  description: string | null;
  output_format: ExportOutputFormat;

  // Template structure
  template_schema: Record<string, any>;

  // Branding/styling
  custom_branding: Record<string, any> | null;
  header_content: string | null;
  footer_content: string | null;

  // Usage tracking
  times_used: number;
  last_used_at: string | null;
}

export interface ExportHistory {
  id: string;
  user_id: string;
  template_id: string | null;
  created_at: string;

  // Export details
  export_type: string;
  file_name: string;
  file_size_bytes: number | null;

  // Content summary
  records_exported: number | null;
  data_snapshot: Record<string, any> | null;

  // Storage
  file_url: string | null;
  expires_at: string | null;

  // Metadata
  generation_time_ms: number | null;
  ip_address: string | null;
  user_agent: string | null;
}

export interface GenerateExportInput {
  templateId?: string;
  templateType?: ExportTemplateType;
  data: Record<string, any>;
  outputFormat?: ExportOutputFormat;
  customBranding?: {
    logo?: string;
    primaryColor?: string;
    secondaryColor?: string;
  };
}

// ============================================================================
// 6. ENRICHMENT AUDIT TRAIL
// ============================================================================

export type EnrichmentSource = 'perplexity' | 'claude' | 'manual' | 'cache';
export type EnrichmentMethod = 'api' | 'scrape' | 'database';
export type EnrichmentStatus = 'success' | 'partial' | 'failed' | 'cached' | 'rate-limited';

export interface EnrichmentAudit {
  id: string;
  user_id: string;
  created_at: string;

  // Contact being enriched
  contact_email: string;
  contact_name: string | null;
  contact_id: string | null;

  // Enrichment process
  enrichment_source: EnrichmentSource;
  enrichment_method: EnrichmentMethod | null;

  // Request/response tracking
  api_request_id: string | null;
  request_payload: Record<string, any> | null;
  response_payload: Record<string, any> | null;

  // Performance metrics
  response_time_ms: number | null;
  api_tokens_used: number | null;
  api_cost_cents: number | null;

  // Quality metrics
  confidence_score: number | null; // 0-100
  data_quality_score: number | null; // 0-100
  fields_enriched: string[] | null;

  // Status tracking
  status: EnrichmentStatus;
  error_code: string | null;
  error_message: string | null;
  retry_count: number;

  // Data changes tracking
  fields_before: Record<string, any> | null;
  fields_after: Record<string, any> | null;
  changes_detected: string[] | null;

  // Trust & verification
  verification_method: string | null;
  verification_score: number | null; // 0-100
  sources_used: string[] | null;

  // User context
  ip_address: string | null;
  user_agent: string | null;
  session_id: string | null;
}

export interface CreateEnrichmentAuditInput {
  contactEmail: string;
  contactName?: string;
  contactId?: string;
  enrichmentSource: EnrichmentSource;
  enrichmentMethod?: EnrichmentMethod;
  apiRequestId?: string;
  requestPayload?: Record<string, any>;
  responsePayload?: Record<string, any>;
  responseTimeMs?: number;
  apiTokensUsed?: number;
  apiCostCents?: number;
  confidenceScore?: number;
  dataQualityScore?: number;
  fieldsEnriched?: string[];
  status: EnrichmentStatus;
  errorCode?: string;
  errorMessage?: string;
  retryCount?: number;
  fieldsBefore?: Record<string, any>;
  fieldsAfter?: Record<string, any>;
  changesDetected?: string[];
  verificationMethod?: string;
  verificationScore?: number;
  sourcesUsed?: string[];
}

// ============================================================================
// 7. QUICK INTEL WIDGET
// ============================================================================

export interface WidgetUsage {
  id: string;
  created_at: string;

  // Anonymous tracking
  widget_session_id: string;
  ip_address: string | null;
  user_agent: string | null;
  referrer_url: string | null;

  // Widget interaction
  enrichments_used: number;
  enrichments_limit: number; // Default 3

  // Conversion tracking
  converted_to_signup: boolean;
  user_id: string | null;
  converted_at: string | null;

  // Widget config
  widget_version: string | null;
  embed_domain: string | null;

  // Metadata
  last_enrichment_at: string | null;
}

export interface EnrichLiteInput {
  email: string;
  name?: string;
  sessionId: string;
}

export interface WidgetTrackEvent {
  event: 'widget_load' | 'enrichment' | 'upgrade_click';
  sessionId: string;
  version?: string;
  url?: string;
  email?: string;
  status?: string;
  enrichmentsUsed?: number;
}

// ============================================================================
// API RESPONSE TYPES
// ============================================================================

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  metadata?: {
    duration?: number;
    tokensUsed?: number;
    model?: string;
    [key: string]: any;
  };
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  total: number;
  limit: number;
  offset: number;
  summary?: any;
}
