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


