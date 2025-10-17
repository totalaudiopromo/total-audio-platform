export type Campaign = {
  id: string;
  user_id: string;
  name: string;
  artist_name: string;
  release_type: 'single' | 'EP' | 'album' | null;
  budget: number;
  spent: number;
  start_date: string | null;
  end_date: string | null;
  status: 'draft' | 'active' | 'paused' | 'completed';
  platforms: string[];
  goals: Record<string, any>;
  created_at: string;
  updated_at: string;
  // Agency/Multi-client fields
  client_name?: string | null;
  client_company?: string | null;
  client_billing_code?: string | null;
  client_email?: string | null;
};

export type ActivityType =
  | 'radio_submission'
  | 'playlist_pitch'
  | 'press_release'
  | 'social_post'
  | 'follow_up'
  | 'response';

export type ActivityStatus =
  | 'pending'
  | 'submitted'
  | 'responded'
  | 'accepted'
  | 'declined'
  | 'no_response';

export type CampaignActivity = {
  id: string;
  campaign_id: string;
  type: ActivityType;
  platform: string | null;
  contact_name: string | null;
  contact_email: string | null;
  status: ActivityStatus;
  notes: string | null;
  submitted_at: string | null;
  response_at: string | null;
  created_at: string;
  updated_at: string;
};

export type ClientStats = {
  user_id: string;
  client_name: string;
  client_company: string | null;
  total_campaigns: number;
  active_campaigns: number;
  completed_campaigns: number;
  total_budget: number;
  spent_budget: number;
  avg_success_rate: number | null;
  avg_performance_score: number | null;
  first_campaign_date: string | null;
  last_activity_date: string;
};


