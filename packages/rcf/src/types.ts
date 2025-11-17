/**
 * Real-Time Coverage Feed (RCF) Type Definitions
 *
 * Core types for the RCF system - a high-frequency, real-time streaming feed
 * that aggregates music industry events into a single dashboard.
 */

// ============================================================================
// Event Types
// ============================================================================

export type RCFEventType =
  // Coverage & Media
  | 'playlist_add'
  | 'press_feature'
  | 'radio_spin'
  | 'blog_post'
  | 'tweet'
  | 'journalist_activity'
  // Scenes & Network
  | 'scene_pulse_change'
  | 'scene_trend_spike'
  | 'mig_connection'
  // Campaigns & Platform
  | 'campaign_event'
  | 'autopilot_event'
  | 'tracker_event'
  // Signals & Intelligence
  | 'coverage_spike'
  | 'creative_breakthrough'
  | 'community_activity'
  // External Platforms (stubs)
  | 'youtube_signal'
  | 'soundcloud_signal'
  | 'bandcamp_signal'
  | 'tiktok_signal'
  | 'instagram_signal';

// ============================================================================
// Event Metadata Types
// ============================================================================

export interface PlaylistAddMetadata {
  playlistName: string;
  playlistId: string;
  curator?: string;
  curatorInfluence?: number;
  followerCount?: number;
  addedAt: string;
  position?: number;
  previousPosition?: number;
}

export interface PressFeatureMetadata {
  publication: string;
  publicationTier?: 'tier1' | 'tier2' | 'tier3' | 'indie' | 'blog';
  writer?: string;
  articleTitle: string;
  articleUrl?: string;
  quote?: string;
  sentiment?: 'positive' | 'neutral' | 'negative';
  reach?: number;
}

export interface RadioSpinMetadata {
  stationName: string;
  stationType?: 'bbc' | 'commercial' | 'community' | 'student' | 'online';
  showName?: string;
  presenter?: string;
  spinTime?: string;
  reach?: number;
  firstPlay?: boolean;
}

export interface BlogPostMetadata {
  blogName: string;
  postTitle: string;
  postUrl: string;
  author?: string;
  excerpt?: string;
  publishedAt: string;
}

export interface JournalistActivityMetadata {
  journalistName: string;
  journalistSlug?: string;
  activityType: 'tweet' | 'article' | 'mention' | 'share';
  content?: string;
  url?: string;
  platform?: string;
}

export interface ScenePulseChangeMetadata {
  sceneName: string;
  oldPulse: number;
  newPulse: number;
  delta: number;
  direction: 'up' | 'down';
  contributingFactors?: string[];
}

export interface SceneTrendSpikeMetadata {
  sceneName: string;
  spikeType: 'artist_count' | 'activity' | 'coverage' | 'momentum';
  value: number;
  previousValue: number;
  percentChange: number;
}

export interface MIGConnectionMetadata {
  connectionType: 'artist_playlist' | 'artist_journalist' | 'artist_venue' | 'artist_label' | 'scene_crossover';
  fromSlug: string;
  fromName: string;
  toSlug: string;
  toName: string;
  weight: number;
  confidence?: number;
}

export interface CampaignEventMetadata {
  campaignId: string;
  campaignName: string;
  stage: string;
  action: string;
  result?: 'success' | 'pending' | 'failed';
  details?: Record<string, unknown>;
}

export interface AutopilotEventMetadata {
  autopilotId: string;
  eventType: 'stage_complete' | 'milestone' | 'action_taken' | 'alert';
  stage?: string;
  action?: string;
  result?: Record<string, unknown>;
}

export interface TrackerEventMetadata {
  trackerId: string;
  activityType: string;
  contactName?: string;
  contactType?: string;
  outcome?: string;
}

export interface CoverageSpikeMetadata {
  spikeType: 'press' | 'radio' | 'playlist' | 'social' | 'combined';
  count: number;
  previousAverage: number;
  percentIncrease: number;
  timeframe: string;
}

export interface CreativeBreakthroughMetadata {
  breakthroughType: 'motif' | 'structural' | 'emotional' | 'production';
  description: string;
  cmgScore?: number;
  details?: Record<string, unknown>;
}

export interface CommunityActivityMetadata {
  activityType: 'comment' | 'like' | 'share' | 'follow' | 'mention';
  volume: number;
  platform?: string;
  trending?: boolean;
}

export interface ExternalPlatformMetadata {
  platform: 'youtube' | 'soundcloud' | 'bandcamp' | 'tiktok' | 'instagram';
  signalType: 'views' | 'plays' | 'saves' | 'shares' | 'comments' | 'growth';
  value: number;
  url?: string;
}

// Union type for all metadata
export type RCFEventMetadata =
  | PlaylistAddMetadata
  | PressFeatureMetadata
  | RadioSpinMetadata
  | BlogPostMetadata
  | JournalistActivityMetadata
  | ScenePulseChangeMetadata
  | SceneTrendSpikeMetadata
  | MIGConnectionMetadata
  | CampaignEventMetadata
  | AutopilotEventMetadata
  | TrackerEventMetadata
  | CoverageSpikeMetadata
  | CreativeBreakthroughMetadata
  | CommunityActivityMetadata
  | ExternalPlatformMetadata
  | Record<string, unknown>; // Fallback for custom metadata

// ============================================================================
// Core Event Interface
// ============================================================================

export interface RCFEvent {
  id: string;
  event_type: RCFEventType;
  artist_slug: string | null;
  entity_slug: string | null;
  scene_slug: string | null;
  metadata: RCFEventMetadata;
  weight: number;
  created_at: string;
}

// ============================================================================
// Ingested Event (before normalization)
// ============================================================================

export interface RCFIngestedEvent {
  event_type: RCFEventType;
  artist_slug?: string | null;
  entity_slug?: string | null;
  scene_slug?: string | null;
  metadata: Record<string, unknown>;
  weight?: number;
  source?: string; // Which ingestor created this
}

// ============================================================================
// Normalized Event (after normalization, ready for DB)
// ============================================================================

export interface RCFNormalizedEvent {
  event_type: RCFEventType;
  artist_slug: string | null;
  entity_slug: string | null;
  scene_slug: string | null;
  metadata: RCFEventMetadata;
  weight: number;
}

// ============================================================================
// Subscription Types
// ============================================================================

export interface RCFSubscription {
  id: string;
  user_id: string;
  workspace_id: string | null;
  subscribed_types: RCFEventType[];
  subscribed_artists: string[];
  subscribed_scenes: string[];
  created_at: string;
  updated_at: string;
}

export interface RCFSubscriptionInput {
  subscribed_types?: RCFEventType[];
  subscribed_artists?: string[];
  subscribed_scenes?: string[];
}

// ============================================================================
// Feed Entry (for user-facing feed)
// ============================================================================

export interface RCFUserFeedEntry extends RCFEvent {
  isNew?: boolean; // Has user seen this?
  isHighlighted?: boolean; // Should this be highlighted?
  displayCategory?: string; // UI category grouping
  icon?: string; // Icon identifier
}

// ============================================================================
// Feed Filter Options
// ============================================================================

export interface RCFFeedFilter {
  event_types?: RCFEventType[];
  artist_slugs?: string[];
  scene_slugs?: string[];
  entity_slugs?: string[];
  min_weight?: number;
  max_weight?: number;
  since?: string; // ISO timestamp
  before?: string; // ISO timestamp
  limit?: number;
  offset?: number;
}

// ============================================================================
// Marker Type
// ============================================================================

export interface RCFMarker {
  id: string;
  user_id: string;
  last_seen_at: string;
  created_at: string;
  updated_at: string;
}

// ============================================================================
// Ingestor Response
// ============================================================================

export interface IngestorResult {
  ingestor: string;
  events: RCFIngestedEvent[];
  success: boolean;
  error?: string;
  duration_ms?: number;
}

// ============================================================================
// Pipeline Result
// ============================================================================

export interface PipelineResult {
  total_ingested: number;
  total_normalized: number;
  total_inserted: number;
  total_published: number;
  ingestor_results: IngestorResult[];
  errors: string[];
  duration_ms: number;
}

// ============================================================================
// Realtime Message
// ============================================================================

export interface RCFRealtimeMessage {
  type: 'event' | 'ping' | 'error';
  event?: RCFEvent;
  error?: string;
  timestamp: string;
}

// ============================================================================
// Event Weight Configuration
// ============================================================================

export interface EventWeightConfig {
  base_weight: number;
  multipliers?: {
    tier1?: number;
    tier2?: number;
    tier3?: number;
    [key: string]: number | undefined;
  };
  caps?: {
    min?: number;
    max?: number;
  };
}

export type EventWeightConfigMap = {
  [K in RCFEventType]?: EventWeightConfig;
};

// ============================================================================
// Logger Interface
// ============================================================================

export interface RCFLogger {
  info: (message: string, data?: Record<string, unknown>) => void;
  warn: (message: string, data?: Record<string, unknown>) => void;
  error: (message: string, error?: Error | unknown, data?: Record<string, unknown>) => void;
  debug: (message: string, data?: Record<string, unknown>) => void;
}

// ============================================================================
// Export All
// ============================================================================

export type {
  RCFEventType as EventType,
  RCFEvent as Event,
  RCFIngestedEvent as IngestedEvent,
  RCFNormalizedEvent as NormalizedEvent,
  RCFSubscription as Subscription,
  RCFSubscriptionInput as SubscriptionInput,
  RCFUserFeedEntry as UserFeedEntry,
  RCFFeedFilter as FeedFilter,
  RCFMarker as Marker,
};
