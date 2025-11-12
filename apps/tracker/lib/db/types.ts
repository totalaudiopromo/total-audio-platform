// ============================================================================
// CAMPAIGN TRACKER - DATABASE TYPES
// Production schema with Liberty Music PR integrations
// ============================================================================

/**
 * Campaign with all integration fields for Liberty Music PR
 */
export interface Campaign {
  // Core fields
  id: string;
  user_id: string;
  title: string; // Existing field
  goal_total: number | null; // Existing field
  release_date: string | null; // Existing field

  // Campaign details (Liberty additions)
  artist_name?: string | null;
  track_name?: string | null;
  genre?: string | null;
  budget?: string | null;
  campaign_angle?: string | null;
  region?: string | null;
  campaign_duration?: string | null;

  // Integration IDs (Liberty additions)
  typeform_response_id?: string | null;
  gmail_label?: string | null;
  mailchimp_campaign_id?: string | null;
  monday_board_id?: string | null;
  drive_folder_id?: string | null;
  airtable_base_id?: string | null;
  airtable_table_id?: string | null;
  sheets_report_id?: string | null;
  excel_export_path?: string | null;

  // Status
  status?: 'active' | 'completed' | 'paused';

  // Timestamps
  created_at: string;
  updated_at: string;
}

/**
 * Campaign Contact with integration references
 */
export interface CampaignContact {
  id: string;
  campaign_id: string;

  // Contact information
  contact_name: string;
  contact_email?: string | null;
  outlet?: string | null;
  contact_type?: 'National' | 'Commercial' | 'Community' | 'Online' | null;
  priority?: 'high' | 'medium' | 'low';

  // Status & tracking
  status?:
    | 'pending'
    | 'contacted'
    | 'responded'
    | 'confirmed'
    | 'declined'
    | 'follow_up_needed';
  assigned_to?: string | null;
  last_contacted?: string | null;

  // Integration references
  gmail_thread_id?: string | null;
  gmail_message_ids?: string[] | null;
  mailchimp_subscriber_id?: string | null;
  monday_item_id?: string | null;
  airtable_record_id?: string | null;
  synced_to_airtable?: boolean;

  // Contact intelligence (from Audio Intel)
  intelligence?: Record<string, any> | null;

  // Notes
  notes?: string | null;

  // Timestamps
  created_at: string;
  updated_at: string;
}

/**
 * Campaign Activity (Timeline event)
 */
export interface CampaignActivity {
  id: string;
  campaign_id: string;
  contact_id?: string | null;

  // Activity information
  user_id: string;
  user_name?: string | null;
  user_location?: string | null; // Brighton, LA, London, etc.
  activity_type:
    | 'gmail_sent'
    | 'gmail_received'
    | 'mailchimp_sent'
    | 'warm_play'
    | 'milestone'
    | 'contacted'
    | 'followed_up'
    | 'got_response'
    | 'play_confirmed'
    | 'declined';
  description: string;
  notes?: string | null;

  // Integration references
  integration_source?:
    | 'gmail'
    | 'mailchimp'
    | 'warm_api'
    | 'warm_report'
    | 'monday'
    | 'manual'
    | 'agent'
    | 'airtable'
    | null;
  integration_id?: string | null;

  // Additional metadata
  metadata?: Record<string, any> | null;

  // Timestamp
  timestamp: string;
}

/**
 * Campaign Metric
 */
export interface CampaignMetric {
  id: string;
  campaign_id: string;

  // Metric information
  metric_type: 'plays' | 'emails_sent' | 'email_opens' | 'email_clicks' | 'responses' | 'confirmations';
  value: number;

  // Source tracking
  source: 'warm_report' | 'warm_api' | 'gmail_api' | 'mailchimp_api' | 'manual';
  source_file_id?: string | null;

  // Timestamp
  recorded_at: string;
}

/**
 * WARM Report Upload
 */
export interface WarmReport {
  id: string;
  campaign_id: string;

  // File information
  filename: string;
  drive_file_id?: string | null;
  upload_date: string;

  // Parsed data summary
  total_plays?: number | null;
  stations_count?: number | null;
  countries_count?: number | null;
  date_range_start?: string | null;
  date_range_end?: string | null;

  // Parsing status
  parsed: boolean;
  parse_error?: string | null;
  parsed_at?: string | null;
}

// ============================================================================
// INTEGRATION METADATA TYPES
// ============================================================================

/**
 * Gmail integration metadata
 */
export interface GmailIntegrationMeta {
  threadId: string;
  messageIds: string[];
  labels?: string[];
  snippet?: string;
}

/**
 * Mailchimp integration metadata
 */
export interface MailchimpIntegrationMeta {
  campaignId: string;
  subscriberId?: string;
  listId?: string;
  openRate?: number;
  clickRate?: number;
}

/**
 * Monday.com integration metadata
 */
export interface MondayIntegrationMeta {
  boardId: string;
  itemId?: string;
  groupId?: string;
  columnValues?: Record<string, any>;
}

/**
 * Airtable integration metadata
 */
export interface AirtableIntegrationMeta {
  baseId: string;
  tableId: string;
  recordId?: string;
  fields?: Record<string, any>;
}

/**
 * WARM API integration metadata
 */
export interface WarmIntegrationMeta {
  playId?: string;
  stationName?: string;
  country?: string;
  playDate?: string;
  reportId?: string;
}

// ============================================================================
// API REQUEST/RESPONSE TYPES
// ============================================================================

/**
 * Create campaign payload
 */
export interface CreateCampaignPayload {
  title: string;
  artist_name: string;
  track_name: string;
  genre?: string;
  budget?: string;
  release_date?: string;
  campaign_angle?: string;
  region?: string;
  campaign_duration?: string;

  // Optional integration IDs
  typeform_response_id?: string;
  gmail_label?: string;
  mailchimp_campaign_id?: string;
  monday_board_id?: string;
  drive_folder_id?: string;
  airtable_base_id?: string;
  airtable_table_id?: string;
  sheets_report_id?: string;
  excel_export_path?: string;
}

/**
 * Update campaign payload
 */
export type UpdateCampaignPayload = Partial<Omit<Campaign, 'id' | 'user_id' | 'created_at' | 'updated_at'>>;

/**
 * Create contact payload
 */
export interface CreateContactPayload {
  campaign_id: string;
  contact_name: string;
  contact_email?: string;
  outlet?: string;
  contact_type?: 'National' | 'Commercial' | 'Community' | 'Online';
  priority?: 'high' | 'medium' | 'low';
  intelligence?: Record<string, any>;
  notes?: string;
}

/**
 * Create activity payload
 */
export interface CreateActivityPayload {
  campaign_id: string;
  contact_id?: string;
  activity_type: CampaignActivity['activity_type'];
  description: string;
  notes?: string;
  integration_source?: CampaignActivity['integration_source'];
  integration_id?: string;
  metadata?: Record<string, any>;
  user_name?: string;
  user_location?: string;
}

/**
 * Campaign with relations
 */
export interface CampaignWithRelations extends Campaign {
  contacts?: CampaignContact[];
  activities?: CampaignActivity[];
  metrics?: CampaignMetric[];
  warm_reports?: WarmReport[];
}

/**
 * Campaign dashboard stats
 */
export interface CampaignDashboardStats {
  total_campaigns: number;
  active_campaigns: number;
  completed_campaigns: number;
  total_contacts: number;
  total_activities_today: number;
  recent_plays: number;
  email_response_rate: number;
  top_performing_campaign?: {
    id: string;
    title: string;
    play_count: number;
  };
}
