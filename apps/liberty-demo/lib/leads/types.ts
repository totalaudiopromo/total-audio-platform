/**
 * Lead Generation System Types
 * AI-powered artist discovery and enrichment for Liberty Music PR
 */

// ============================================================================
// Lead Source Types
// ============================================================================

export type LeadSourceType =
  | 'hype_machine'
  | 'bandcamp'
  | 'submithub'
  | 'spotify_playlist'
  | 'soundcloud'
  | 'youtube_music'
  | 'manual';

export interface LeadSource {
  id: string;
  name: string;
  url: string;
  sourceType: LeadSourceType;
  crawlFrequency: 'hourly' | 'daily' | 'weekly';
  lastCrawledAt: string | null;
  isActive: boolean;
  createdAt: string;
}

// ============================================================================
// Discovered Artist Types (raw from crawl)
// ============================================================================

export interface DiscoveredArtist {
  id: string;
  name: string;
  sourceId: string;
  sourceUrl: string | null;
  sourceRank: number | null;
  rawData: Record<string, unknown>;
  discoveredAt: string;
  processed: boolean;
}

// ============================================================================
// Enriched Lead Types
// ============================================================================

export type PRConfidence = 'confirmed' | 'likely' | 'unlikely' | 'unknown';
export type LeadStatus = 'new' | 'pipeline' | 'dismissed' | 'contacted';

export interface LeadSignal {
  type: 'release' | 'momentum' | 'availability' | 'fit' | 'source';
  label: string;
  positive: boolean;
}

export interface ScoreBreakdown {
  timing: number; // max 25 - upcoming release timing
  momentum: number; // max 25 - growth signals
  fit: number; // max 25 - genre/location fit
  availability: number; // max 25 - no PR agency detected
}

export interface Lead {
  id: string;
  artistId: string | null;

  // Basic info
  artistName: string;
  genre: string | null;
  location: string | null;
  bio: string | null;
  imageUrl: string | null;

  // Links
  spotifyUrl: string | null;
  instagramUrl: string | null;
  twitterUrl: string | null;
  websiteUrl: string | null;
  bandcampUrl: string | null;
  youtubeUrl: string | null;

  // Stats
  spotifyMonthlyListeners: number | null;
  spotifyFollowers: number | null;
  instagramFollowers: number | null;
  twitterFollowers: number | null;

  // Release info
  upcomingReleaseDate: string | null;
  upcomingReleaseTitle: string | null;
  latestReleaseDate: string | null;
  latestReleaseTitle: string | null;

  // PR Intelligence
  hasPrAgency: boolean;
  prAgencyName: string | null;
  prConfidence: PRConfidence;

  // Signals
  signals: LeadSignal[];

  // AI Analysis
  aiInsight: string | null;
  aiGeneratedAt: string | null;

  // Scoring
  score: number;
  scoreBreakdown: ScoreBreakdown;

  // Source tracking
  sourceName: string;
  sourceType: LeadSourceType;
  sourceRank: number | null;

  // Status
  status: LeadStatus;
  statusUpdatedAt: string | null;
  statusUpdatedBy: string | null;

  // Timestamps
  createdAt: string;
  updatedAt: string;
}

// ============================================================================
// Activity Log Types
// ============================================================================

export type LeadActivityAction =
  | 'discovered'
  | 'enriched'
  | 'scored'
  | 'added_to_pipeline'
  | 'dismissed'
  | 'contacted';

export interface LeadActivity {
  id: string;
  leadId: string;
  action: LeadActivityAction;
  details: Record<string, unknown> | null;
  createdAt: string;
}

// ============================================================================
// API Request/Response Types
// ============================================================================

export interface LeadFilters {
  status?: LeadStatus;
  minScore?: number;
  maxScore?: number;
  sourceType?: LeadSourceType;
  genre?: string;
  hasPrAgency?: boolean;
}

export interface LeadSortOptions {
  sortBy: 'score' | 'createdAt' | 'upcomingReleaseDate' | 'spotifyMonthlyListeners';
  sortOrder: 'asc' | 'desc';
}

export interface PaginatedLeadsResponse {
  leads: Lead[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface LeadStats {
  totalLeads: number;
  newLeads: number;
  pipelineLeads: number;
  dismissedLeads: number;
  contactedLeads: number;
  averageScore: number;
  highScoreLeads: number; // score >= 80
  leadsBySource: Record<string, number>;
  leadsThisWeek: number;
}

export interface CrawlResult {
  sourceId: string;
  sourceName: string;
  artistsDiscovered: number;
  errors: string[];
  crawledAt: string;
}

export interface EnrichResult {
  leadId: string;
  artistName: string;
  success: boolean;
  error?: string;
  enrichedAt: string;
}

// ============================================================================
// Enrichment Types
// ============================================================================

export interface SpotifyArtistData {
  id: string;
  name: string;
  followers: number;
  popularity: number;
  genres: string[];
  imageUrl: string | null;
  externalUrl: string;
}

export interface SpotifySearchResult {
  artist: SpotifyArtistData | null;
  monthlyListeners: number | null;
  topTracks: Array<{
    name: string;
    releaseDate: string;
    albumName: string;
  }>;
  latestRelease: {
    name: string;
    releaseDate: string;
    type: 'single' | 'album' | 'ep';
  } | null;
}

export interface PerplexityResearchResult {
  hasPrAgency: boolean;
  prAgencyName: string | null;
  prConfidence: PRConfidence;
  hasLabel: boolean;
  labelName: string | null;
  upcomingRelease: {
    title: string;
    date: string;
  } | null;
  momentumSummary: string;
  genre: string;
  location: string;
  sources: string[];
}

// ============================================================================
// Crawler Types
// ============================================================================

export interface CrawlerConfig {
  name: string;
  sourceType: LeadSourceType;
  enabled: boolean;
  rateLimit: number; // requests per minute
}

export interface CrawledArtist {
  name: string;
  sourceUrl: string;
  sourceRank?: number;
  genre?: string;
  location?: string;
  spotifyUrl?: string;
  bandcampUrl?: string;
  metadata: Record<string, unknown>;
}
