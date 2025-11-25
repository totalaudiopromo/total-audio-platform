export type Status = 'active' | 'scheduled' | 'risk' | 'completed';

export interface Artist {
  id: string;
  name: string;
  genre: string;
  image: string;
  stats: {
    monthlyListeners: string;
    followers: string;
  };
}

export interface Campaign {
  id: string;
  artistId: string;
  title: string;
  status: Status;
  momentumScore: number;
  healthScore: number;
  startDate: string;
  nextTask: string;
  coverage: number;
  radioHits: number;
  stats: {
    pitchesSent: number;
    openRate: number;
    replyRate: number;
  };
  timeline?: string; // Mermaid gantt chart code
  coverageLog?: Array<{
    type: 'Press' | 'Radio';
    outlet: string;
    date: string;
    highlight: string;
  }>;
  pitchHistory?: Array<{
    date: string;
    subject: string;
    opened: boolean;
  }>;
  tasks?: Array<{
    id: string;
    text: string;
    completed: boolean;
  }>;
  assets?: Array<{
    name: string;
    type: 'pdf' | 'jpg' | 'docx' | 'png';
    url: string;
  }>;
  aiSummary?: string;
}

export interface Contact {
  id: string;
  name: string;
  outlet: string;
  type: 'Press' | 'Radio' | 'Playlist' | 'Label';
  credibilityScore: number;
  emailStatus: 'valid' | 'risky' | 'unknown';
  lastContact: string;
}

export interface Lead {
  id: string;
  artistName: string;
  fitScore: number;
  reasoning: string;
  similarArtists: string[];
  suggestedAngle: string;
}

export interface ArtistPortalConfig {
  slug: string;
  artistId: string;
  campaignIds: string[];
  label?: string;
  visibility: {
    showMomentum: boolean;
    showCoverage: boolean;
    showRadio: boolean;
    showTasks: boolean;
    showAiSummary: boolean;
  };
  radioStations?: Array<{
    name: string;
    status: 'Rotation' | 'Support' | 'Added';
  }>;
  playlists?: Array<{
    name: string;
    platform: string;
    status: 'Added' | 'Pending';
  }>;
}

export type AutomationNodeType = 'trigger' | 'filter' | 'action';

export type AutomationNodeKind =
  | 'coverage_found'
  | 'typeform_submitted'
  | 'email_opened'
  | 'radio_spin_logged'
  | 'schedule'
  | 'heat_score_threshold'
  | 'geo_filter'
  | 'pitch_opened'
  | 'pitch_replied'
  | 'pitch_failed'
  | 'google_chat_message'
  | 'create_crm_contact'
  | 'update_crm_contact'
  | 'create_task'
  | 'tag_contact';

export type AutomationNodeStatus = 'active' | 'idle' | 'error' | 'success';

export interface AutomationNodeStats {
  executions: number;
  successRate: number;
  lastExecuted?: string;
}

export interface AutomationNode {
  id: string;
  type: AutomationNodeType;
  kind: AutomationNodeKind;
  label: string;
  description?: string;
  status?: AutomationNodeStatus;
  stats?: AutomationNodeStats;
  icon?: string; // Optional icon override
}

export interface AutomationEdge {
  from: string;
  to: string;
  conditionLabel?: string;
  animated?: boolean;
  labelStyle?: React.CSSProperties;
}

export interface AutomationWorkflow {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'paused' | 'draft';
  lastRun: string;
  runCount: number;
  nodes: AutomationNode[];
  edges: AutomationEdge[];
}

// API-facing types for backend integration
export interface IntelContact {
  id: string;
  name: string;
  role: 'Press' | 'Radio' | 'Playlist' | 'Influencer' | 'Other';
  outlet: string;
  email: string;
  country?: string;
  credibilityScore: number; // 0-100
  emailStatus: 'valid' | 'risky' | 'invalid' | 'unknown';
  lastActionAt?: string;
}

export interface TrackerCampaignSummary {
  id: string;
  artistName: string;
  campaignName: string;
  status: 'active' | 'scheduled' | 'complete' | 'paused';
  momentum: number; // 0-100
  health: number; // 0-100
  pitchCount: number;
  openRate: number; // 0-100
  replyRate: number; // 0-100
  placementValueGBP?: number;
}

export interface TrackerCampaignDetail extends TrackerCampaignSummary {
  timelineMermaid?: string;
  coverageLog?: {
    id: string;
    type: 'Press' | 'Radio' | 'Playlist';
    outlet: string;
    highlight: string;
    date: string;
  }[];
  tasks?: {
    id: string;
    title: string;
    completed: boolean;
  }[];
  assets?: {
    id: string;
    name: string;
    type: 'pdf' | 'jpg' | 'png' | 'docx' | 'other';
    url: string;
  }[];
  aiSummary?: string;
}

export interface PitchEvent {
  id: string;
  campaignId: string;
  contactId: string;
  subject: string;
  sentAt: string;
  openedAt?: string;
  repliedAt?: string;
  status: 'sent' | 'opened' | 'replied' | 'bounced';
}

// Phase 3: Ops Integrations
export interface WarmAgencySummary {
  artistId: string;
  artistName: string;
  trackName: string;
  totalSpins: number;
  uniqueStations: number;
  topTerritories: string[];
  lastSpinAt: string;
}

export interface WarmSpin {
  id: string;
  campaignId: string;
  station: string;
  country: string;
  city: string;
  spinTime: string;
  rotationLevel: 'light' | 'medium' | 'heavy';
}

export interface CoverageSummary {
  campaignId: string;
  totalMentions: number;
  estimatedViews: number;
  avgDomainAuthority: number;
  weekOverWeekChange: number;
  topOutlets: Array<{
    name: string;
    domainAuthority: number;
    country: string;
  }>;
}

export interface MondayTimeline {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  status: 'on-track' | 'at-risk' | 'behind';
}

export interface MondayAllocation {
  staffName: string;
  role: string;
  activeCampaigns: string[];
  workloadScore: number; // 0-100
}

export interface TypeformSubmission {
  id: string;
  artistName: string;
  submittedAt: string;
  completeness: number; // 0-100
  missingFields: string[];
}

export interface DriveAsset {
  id: string;
  name: string;
  type: 'pdf' | 'doc' | 'jpg' | 'png' | 'other';
  sizeKB: number;
  updatedAt: string;
  url: string;
  folder: 'Press Releases' | 'Artwork' | 'Photos' | 'Campaign Reports' | 'Audio Assets';
  campaignId?: string;
  artistId?: string;
}
