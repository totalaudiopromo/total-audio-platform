-- ========================================
-- Migration: Unified Dashboard Ecosystem
-- ========================================
-- Purpose: Create all tables for the unified intelligence dashboard
-- including community, asset drop, email campaigns, intelligence graphs,
-- press kit analysis, writer's room, and all supporting features
-- ========================================

-- ========================================
-- COMMUNITY TABLES
-- ========================================

CREATE TABLE IF NOT EXISTS community_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL,
  bio TEXT,
  avatar_url TEXT,
  profile_type TEXT NOT NULL CHECK (profile_type IN ('artist', 'pr_agency', 'promoter', 'other')),
  genres TEXT[],
  location TEXT,
  website_url TEXT,
  social_links JSONB DEFAULT '{}',
  is_verified BOOLEAN DEFAULT FALSE,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

CREATE TABLE IF NOT EXISTS community_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  workspace_id UUID REFERENCES workspaces(id) ON DELETE SET NULL,
  title TEXT,
  content TEXT NOT NULL,
  post_type TEXT NOT NULL CHECK (post_type IN ('question', 'case_study', 'announcement', 'discussion', 'tip')),
  tags TEXT[],
  media_urls TEXT[],
  visibility TEXT DEFAULT 'public' CHECK (visibility IN ('public', 'workspace', 'private')),
  upvotes INT DEFAULT 0,
  view_count INT DEFAULT 0,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS community_threads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES community_posts(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES community_threads(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  upvotes INT DEFAULT 0,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS community_replies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  thread_id UUID NOT NULL REFERENCES community_threads(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  upvotes INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS community_follows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  follower_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  following_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(follower_id, following_id),
  CHECK (follower_id != following_id)
);

CREATE TABLE IF NOT EXISTS community_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organizer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  event_type TEXT NOT NULL CHECK (event_type IN ('webinar', 'workshop', 'networking', 'showcase', 'other')),
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ,
  timezone TEXT DEFAULT 'UTC',
  location_type TEXT DEFAULT 'online' CHECK (location_type IN ('online', 'in_person', 'hybrid')),
  location_details JSONB DEFAULT '{}',
  max_attendees INT,
  registration_url TEXT,
  tags TEXT[],
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================
-- ASSET DROP
-- ========================================

CREATE TABLE IF NOT EXISTS asset_drop (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  workspace_id UUID REFERENCES workspaces(id) ON DELETE SET NULL,
  asset_type TEXT NOT NULL CHECK (asset_type IN ('press_photo', 'artwork', 'audio', 'video', 'document', 'logo', 'other')),
  file_name TEXT NOT NULL,
  file_size BIGINT,
  mime_type TEXT,
  url TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  tags TEXT[],
  description TEXT,
  artist_name TEXT,
  release_name TEXT,
  is_public BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================
-- EMAIL CAMPAIGNS
-- ========================================

CREATE TABLE IF NOT EXISTS email_campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  workspace_id UUID REFERENCES workspaces(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  subject TEXT NOT NULL,
  body TEXT NOT NULL,
  body_html TEXT,
  segments JSONB DEFAULT '[]',
  contact_ids UUID[],
  schedule_type TEXT DEFAULT 'immediate' CHECK (schedule_type IN ('immediate', 'scheduled', 'draft')),
  scheduled_for TIMESTAMPTZ,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'sending', 'sent', 'paused', 'failed')),
  sent_count INT DEFAULT 0,
  open_count INT DEFAULT 0,
  click_count INT DEFAULT 0,
  reply_count INT DEFAULT 0,
  template_id UUID,
  ai_generated BOOLEAN DEFAULT FALSE,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  sent_at TIMESTAMPTZ
);

-- ========================================
-- LIST BUILDER (SMART SEGMENTS)
-- ========================================

CREATE TABLE IF NOT EXISTS smart_segments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  workspace_id UUID REFERENCES workspaces(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  description TEXT,
  filters JSONB NOT NULL DEFAULT '{}',
  ai_generated BOOLEAN DEFAULT FALSE,
  contact_count INT DEFAULT 0,
  last_computed_at TIMESTAMPTZ,
  is_dynamic BOOLEAN DEFAULT TRUE,
  tags TEXT[],
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================
-- RELEASE PLANNER
-- ========================================

CREATE TABLE IF NOT EXISTS release_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  workspace_id UUID REFERENCES workspaces(id) ON DELETE SET NULL,
  artist_name TEXT NOT NULL,
  release_name TEXT NOT NULL,
  release_type TEXT NOT NULL CHECK (release_type IN ('single', 'ep', 'album', 'compilation', 'other')),
  release_date DATE NOT NULL,
  genre TEXT[],
  template_id TEXT,
  phases JSONB DEFAULT '[]',
  tasks JSONB DEFAULT '[]',
  milestones JSONB DEFAULT '[]',
  budget JSONB DEFAULT '{}',
  team_members JSONB DEFAULT '[]',
  status TEXT DEFAULT 'planning' CHECK (status IN ('planning', 'in_progress', 'completed', 'cancelled')),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================
-- INTEGRATIONS
-- ========================================

CREATE TABLE IF NOT EXISTS integrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  workspace_id UUID REFERENCES workspaces(id) ON DELETE SET NULL,
  provider TEXT NOT NULL CHECK (provider IN ('spotify', 'apple_music', 'youtube', 'soundcloud', 'bandcamp', 'instagram', 'tiktok', 'twitter', 'other')),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'error', 'expired')),
  auth_data JSONB NOT NULL DEFAULT '{}',
  refresh_token TEXT,
  access_token TEXT,
  expires_at TIMESTAMPTZ,
  scopes TEXT[],
  metadata JSONB DEFAULT '{}',
  last_sync_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, workspace_id, provider)
);

-- ========================================
-- AD TRACKER
-- ========================================

CREATE TABLE IF NOT EXISTS ad_tracker_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  workspace_id UUID REFERENCES workspaces(id) ON DELETE SET NULL,
  campaign_id UUID,
  platform TEXT NOT NULL CHECK (platform IN ('facebook', 'instagram', 'tiktok', 'youtube', 'spotify', 'google', 'other')),
  ad_name TEXT NOT NULL,
  event_type TEXT NOT NULL CHECK (event_type IN ('impression', 'click', 'conversion', 'spend', 'other')),
  metrics JSONB DEFAULT '{}',
  cost_amount NUMERIC(10,2),
  currency TEXT DEFAULT 'GBP',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================
-- SUCCESS PROFILES
-- ========================================

CREATE TABLE IF NOT EXISTS success_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  genre TEXT NOT NULL,
  profile_type TEXT DEFAULT 'genre' CHECK (profile_type IN ('genre', 'scene', 'campaign_type', 'outlet_type')),
  insights JSONB NOT NULL DEFAULT '{}',
  typical_timeline JSONB DEFAULT '{}',
  key_outlets JSONB DEFAULT '{}',
  best_practices JSONB DEFAULT '{}',
  warning_signs JSONB DEFAULT '{}',
  success_metrics JSONB DEFAULT '{}',
  sample_campaigns UUID[],
  confidence_score NUMERIC(3,2) DEFAULT 0.5,
  data_points INT DEFAULT 0,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(genre, profile_type)
);

-- ========================================
-- REPLY INTELLIGENCE ENGINE
-- ========================================

CREATE TABLE IF NOT EXISTS reply_intel_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  campaign_id UUID,
  contact_id UUID,
  reply_raw TEXT NOT NULL,
  classification TEXT NOT NULL CHECK (classification IN ('interested', 'interested_wrong_angle', 'wants_assets', 'decline', 'soft_maybe', 'needs_followup', 'high_value_lead', 'other')),
  interest_score NUMERIC(3,2) DEFAULT 0.5,
  urgency_score NUMERIC(3,2) DEFAULT 0.5,
  sentiment JSONB DEFAULT '{}',
  requires_followup BOOLEAN DEFAULT FALSE,
  suggested_response TEXT,
  key_phrases TEXT[],
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================
-- OUTLET CONTACT INTELLIGENCE GRAPH
-- ========================================

CREATE TABLE IF NOT EXISTS contact_intel_graph (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contact_id UUID NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  genre_affinity JSONB DEFAULT '{}',
  emotional_arc_affinity JSONB DEFAULT '{}',
  time_of_day_success JSONB DEFAULT '{}',
  day_of_week_success JSONB DEFAULT '{}',
  pitch_style_preference JSONB DEFAULT '{}',
  responsiveness_score NUMERIC(3,2) DEFAULT 0.5,
  average_response_time_hours NUMERIC(10,2),
  preferred_asset_types TEXT[],
  conversion_rate NUMERIC(3,2),
  interaction_count INT DEFAULT 0,
  last_interaction_at TIMESTAMPTZ,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(contact_id, user_id)
);

-- ========================================
-- REAL-TIME CAMPAIGN WATCHER
-- ========================================

CREATE TABLE IF NOT EXISTS campaign_activity_feed (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  workspace_id UUID REFERENCES workspaces(id) ON DELETE SET NULL,
  event_type TEXT NOT NULL CHECK (event_type IN ('sent', 'opened', 'clicked', 'replied', 'bounced', 'asset_viewed', 'contact_added', 'intelligence_generated', 'milestone_reached', 'other')),
  event_data JSONB DEFAULT '{}',
  contact_id UUID,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================
-- PRESS KIT INTELLIGENCE
-- ========================================

CREATE TABLE IF NOT EXISTS presskit_intel_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  workspace_id UUID REFERENCES workspaces(id) ON DELETE SET NULL,
  artist_name TEXT,
  kit_quality_score NUMERIC(3,2) DEFAULT 0,
  completeness_score NUMERIC(3,2) DEFAULT 0,
  professionalism_score NUMERIC(3,2) DEFAULT 0,
  issues JSONB DEFAULT '[]',
  suggestions JSONB DEFAULT '[]',
  strengths JSONB DEFAULT '[]',
  assets_analyzed JSONB DEFAULT '[]',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================
-- WRITER'S ROOM
-- ========================================

CREATE TABLE IF NOT EXISTS writers_room_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  workspace_id UUID REFERENCES workspaces(id) ON DELETE SET NULL,
  artist_name TEXT,
  release_name TEXT,
  genre TEXT[],
  angles JSONB DEFAULT '[]',
  taglines JSONB DEFAULT '[]',
  tiktok_hooks JSONB DEFAULT '[]',
  radio_talking_points JSONB DEFAULT '[]',
  narratives JSONB DEFAULT '[]',
  premiere_angles JSONB DEFAULT '[]',
  press_quotes JSONB DEFAULT '[]',
  input_data JSONB DEFAULT '{}',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================
-- INDUSTRY CALENDAR
-- ========================================

CREATE TABLE IF NOT EXISTS industry_calendar_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('festival', 'conference', 'awards', 'submission_deadline', 'release_window', 'media_planning', 'other')),
  region TEXT,
  country TEXT,
  date DATE NOT NULL,
  end_date DATE,
  is_recurring BOOLEAN DEFAULT FALSE,
  recurrence_pattern TEXT,
  description TEXT,
  website_url TEXT,
  tags TEXT[],
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================
-- CAMPAIGN SIMULATOR
-- ========================================

CREATE TABLE IF NOT EXISTS campaign_simulator_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  workspace_id UUID REFERENCES workspaces(id) ON DELETE SET NULL,
  simulation_name TEXT,
  inputs JSONB NOT NULL DEFAULT '{}',
  predicted_outcomes JSONB DEFAULT '{}',
  confidence_scores JSONB DEFAULT '{}',
  suggestions JSONB DEFAULT '[]',
  weak_points JSONB DEFAULT '[]',
  alternative_strategies JSONB DEFAULT '[]',
  estimated_reach JSONB DEFAULT '{}',
  estimated_timeline JSONB DEFAULT '{}',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================
-- COVERAGE MAP
-- ========================================

CREATE TABLE IF NOT EXISTS coverage_map_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  workspace_id UUID REFERENCES workspaces(id) ON DELETE SET NULL,
  campaign_id UUID,
  artist_name TEXT,
  outlet TEXT NOT NULL,
  outlet_type TEXT CHECK (outlet_type IN ('radio', 'blog', 'magazine', 'podcast', 'playlist', 'social', 'tv', 'other')),
  country TEXT,
  region TEXT,
  coverage_type TEXT CHECK (coverage_type IN ('feature', 'interview', 'review', 'premiere', 'playlist_add', 'airplay', 'mention', 'other')),
  url TEXT,
  reach_estimate INT,
  publication_date DATE,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================
-- AUDIENCE BUILDER
-- ========================================

CREATE TABLE IF NOT EXISTS audience_builder_suggestions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  workspace_id UUID REFERENCES workspaces(id) ON DELETE SET NULL,
  suggestion_type TEXT CHECK (suggestion_type IN ('contact', 'outlet', 'campaign_strategy', 'other')),
  suggested_contacts JSONB DEFAULT '[]',
  reasoning JSONB DEFAULT '{}',
  confidence_score NUMERIC(3,2) DEFAULT 0.5,
  source_data JSONB DEFAULT '{}',
  is_applied BOOLEAN DEFAULT FALSE,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================
-- CONTACT ACQUISITION BOT
-- ========================================

CREATE TABLE IF NOT EXISTS contact_acquisition_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider TEXT NOT NULL CHECK (provider IN ('editorial_scan', 'scene_monitor', 'role_tracker', 'manual', 'other')),
  discovered_contacts JSONB DEFAULT '[]',
  source_urls TEXT[],
  confidence_scores JSONB DEFAULT '{}',
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'verified', 'rejected', 'applied')),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  processed_at TIMESTAMPTZ
);

-- ========================================
-- NARRATIVE ENGINE (CAMPAIGN STORIES)
-- ========================================

CREATE TABLE IF NOT EXISTS campaign_narratives (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID NOT NULL,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  workspace_id UUID REFERENCES workspaces(id) ON DELETE SET NULL,
  narrative_type TEXT DEFAULT 'timeline' CHECK (narrative_type IN ('timeline', 'insights', 'milestone', 'summary', 'report')),
  title TEXT,
  content TEXT NOT NULL,
  content_html TEXT,
  key_events JSONB DEFAULT '[]',
  insights JSONB DEFAULT '[]',
  metrics JSONB DEFAULT '{}',
  ai_generated BOOLEAN DEFAULT FALSE,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================
-- GLOBAL SEARCH INDEX
-- ========================================

CREATE TABLE IF NOT EXISTS global_search_index (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type TEXT NOT NULL CHECK (entity_type IN ('contact', 'campaign', 'pitch', 'asset', 'post', 'event', 'release', 'segment')),
  entity_id UUID NOT NULL,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  workspace_id UUID REFERENCES workspaces(id) ON DELETE SET NULL,
  title TEXT,
  description TEXT,
  content TEXT,
  tags TEXT[],
  search_vector tsvector,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(entity_type, entity_id, user_id)
);

-- ========================================
-- INDEXES
-- ========================================

-- Community indexes
CREATE INDEX IF NOT EXISTS idx_community_profiles_user ON community_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_community_profiles_type ON community_profiles(profile_type);
CREATE INDEX IF NOT EXISTS idx_community_posts_user ON community_posts(user_id);
CREATE INDEX IF NOT EXISTS idx_community_posts_workspace ON community_posts(workspace_id);
CREATE INDEX IF NOT EXISTS idx_community_posts_type ON community_posts(post_type);
CREATE INDEX IF NOT EXISTS idx_community_posts_created ON community_posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_community_threads_post ON community_threads(post_id);
CREATE INDEX IF NOT EXISTS idx_community_threads_user ON community_threads(user_id);
CREATE INDEX IF NOT EXISTS idx_community_replies_thread ON community_replies(thread_id);
CREATE INDEX IF NOT EXISTS idx_community_follows_follower ON community_follows(follower_id);
CREATE INDEX IF NOT EXISTS idx_community_follows_following ON community_follows(following_id);
CREATE INDEX IF NOT EXISTS idx_community_events_organizer ON community_events(organizer_id);
CREATE INDEX IF NOT EXISTS idx_community_events_start ON community_events(start_time);

-- Asset drop indexes
CREATE INDEX IF NOT EXISTS idx_asset_drop_user ON asset_drop(user_id);
CREATE INDEX IF NOT EXISTS idx_asset_drop_workspace ON asset_drop(workspace_id);
CREATE INDEX IF NOT EXISTS idx_asset_drop_type ON asset_drop(asset_type);
CREATE INDEX IF NOT EXISTS idx_asset_drop_created ON asset_drop(created_at DESC);

-- Email campaign indexes
CREATE INDEX IF NOT EXISTS idx_email_campaigns_user ON email_campaigns(user_id);
CREATE INDEX IF NOT EXISTS idx_email_campaigns_workspace ON email_campaigns(workspace_id);
CREATE INDEX IF NOT EXISTS idx_email_campaigns_status ON email_campaigns(status);
CREATE INDEX IF NOT EXISTS idx_email_campaigns_scheduled ON email_campaigns(scheduled_for);

-- Smart segment indexes
CREATE INDEX IF NOT EXISTS idx_smart_segments_user ON smart_segments(user_id);
CREATE INDEX IF NOT EXISTS idx_smart_segments_workspace ON smart_segments(workspace_id);

-- Release plan indexes
CREATE INDEX IF NOT EXISTS idx_release_plans_user ON release_plans(user_id);
CREATE INDEX IF NOT EXISTS idx_release_plans_workspace ON release_plans(workspace_id);
CREATE INDEX IF NOT EXISTS idx_release_plans_date ON release_plans(release_date);
CREATE INDEX IF NOT EXISTS idx_release_plans_status ON release_plans(status);

-- Integration indexes
CREATE INDEX IF NOT EXISTS idx_integrations_user ON integrations(user_id);
CREATE INDEX IF NOT EXISTS idx_integrations_workspace ON integrations(workspace_id);
CREATE INDEX IF NOT EXISTS idx_integrations_provider ON integrations(provider);

-- Ad tracker indexes
CREATE INDEX IF NOT EXISTS idx_ad_tracker_user ON ad_tracker_events(user_id);
CREATE INDEX IF NOT EXISTS idx_ad_tracker_workspace ON ad_tracker_events(workspace_id);
CREATE INDEX IF NOT EXISTS idx_ad_tracker_campaign ON ad_tracker_events(campaign_id);
CREATE INDEX IF NOT EXISTS idx_ad_tracker_created ON ad_tracker_events(created_at DESC);

-- Success profiles indexes
CREATE INDEX IF NOT EXISTS idx_success_profiles_genre ON success_profiles(genre);
CREATE INDEX IF NOT EXISTS idx_success_profiles_type ON success_profiles(profile_type);

-- Reply intel indexes
CREATE INDEX IF NOT EXISTS idx_reply_intel_user ON reply_intel_cache(user_id);
CREATE INDEX IF NOT EXISTS idx_reply_intel_campaign ON reply_intel_cache(campaign_id);
CREATE INDEX IF NOT EXISTS idx_reply_intel_contact ON reply_intel_cache(contact_id);
CREATE INDEX IF NOT EXISTS idx_reply_intel_classification ON reply_intel_cache(classification);
CREATE INDEX IF NOT EXISTS idx_reply_intel_created ON reply_intel_cache(created_at DESC);

-- Contact intel indexes
CREATE INDEX IF NOT EXISTS idx_contact_intel_contact ON contact_intel_graph(contact_id);
CREATE INDEX IF NOT EXISTS idx_contact_intel_user ON contact_intel_graph(user_id);
CREATE INDEX IF NOT EXISTS idx_contact_intel_updated ON contact_intel_graph(updated_at DESC);

-- Campaign activity indexes
CREATE INDEX IF NOT EXISTS idx_campaign_activity_campaign ON campaign_activity_feed(campaign_id);
CREATE INDEX IF NOT EXISTS idx_campaign_activity_user ON campaign_activity_feed(user_id);
CREATE INDEX IF NOT EXISTS idx_campaign_activity_workspace ON campaign_activity_feed(workspace_id);
CREATE INDEX IF NOT EXISTS idx_campaign_activity_created ON campaign_activity_feed(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_campaign_activity_type ON campaign_activity_feed(event_type);

-- Press kit intel indexes
CREATE INDEX IF NOT EXISTS idx_presskit_intel_user ON presskit_intel_reports(user_id);
CREATE INDEX IF NOT EXISTS idx_presskit_intel_workspace ON presskit_intel_reports(workspace_id);
CREATE INDEX IF NOT EXISTS idx_presskit_intel_created ON presskit_intel_reports(created_at DESC);

-- Writer's room indexes
CREATE INDEX IF NOT EXISTS idx_writers_room_user ON writers_room_results(user_id);
CREATE INDEX IF NOT EXISTS idx_writers_room_workspace ON writers_room_results(workspace_id);
CREATE INDEX IF NOT EXISTS idx_writers_room_created ON writers_room_results(created_at DESC);

-- Industry calendar indexes
CREATE INDEX IF NOT EXISTS idx_industry_calendar_date ON industry_calendar_events(date);
CREATE INDEX IF NOT EXISTS idx_industry_calendar_category ON industry_calendar_events(category);
CREATE INDEX IF NOT EXISTS idx_industry_calendar_country ON industry_calendar_events(country);

-- Campaign simulator indexes
CREATE INDEX IF NOT EXISTS idx_campaign_simulator_user ON campaign_simulator_results(user_id);
CREATE INDEX IF NOT EXISTS idx_campaign_simulator_workspace ON campaign_simulator_results(workspace_id);
CREATE INDEX IF NOT EXISTS idx_campaign_simulator_created ON campaign_simulator_results(created_at DESC);

-- Coverage map indexes
CREATE INDEX IF NOT EXISTS idx_coverage_map_user ON coverage_map_events(user_id);
CREATE INDEX IF NOT EXISTS idx_coverage_map_workspace ON coverage_map_events(workspace_id);
CREATE INDEX IF NOT EXISTS idx_coverage_map_campaign ON coverage_map_events(campaign_id);
CREATE INDEX IF NOT EXISTS idx_coverage_map_country ON coverage_map_events(country);

-- Audience builder indexes
CREATE INDEX IF NOT EXISTS idx_audience_builder_user ON audience_builder_suggestions(user_id);
CREATE INDEX IF NOT EXISTS idx_audience_builder_workspace ON audience_builder_suggestions(workspace_id);
CREATE INDEX IF NOT EXISTS idx_audience_builder_created ON audience_builder_suggestions(created_at DESC);

-- Contact acquisition indexes
CREATE INDEX IF NOT EXISTS idx_contact_acquisition_provider ON contact_acquisition_events(provider);
CREATE INDEX IF NOT EXISTS idx_contact_acquisition_status ON contact_acquisition_events(status);
CREATE INDEX IF NOT EXISTS idx_contact_acquisition_created ON contact_acquisition_events(created_at DESC);

-- Narrative engine indexes
CREATE INDEX IF NOT EXISTS idx_campaign_narratives_campaign ON campaign_narratives(campaign_id);
CREATE INDEX IF NOT EXISTS idx_campaign_narratives_user ON campaign_narratives(user_id);
CREATE INDEX IF NOT EXISTS idx_campaign_narratives_workspace ON campaign_narratives(workspace_id);
CREATE INDEX IF NOT EXISTS idx_campaign_narratives_type ON campaign_narratives(narrative_type);

-- Global search indexes
CREATE INDEX IF NOT EXISTS idx_global_search_user ON global_search_index(user_id);
CREATE INDEX IF NOT EXISTS idx_global_search_workspace ON global_search_index(workspace_id);
CREATE INDEX IF NOT EXISTS idx_global_search_entity ON global_search_index(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_global_search_vector ON global_search_index USING gin(search_vector);

-- ========================================
-- ROW LEVEL SECURITY (RLS)
-- ========================================

-- Enable RLS on all tables
ALTER TABLE community_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_threads ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_replies ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE asset_drop ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE smart_segments ENABLE ROW LEVEL SECURITY;
ALTER TABLE release_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE ad_tracker_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE success_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE reply_intel_cache ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_intel_graph ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaign_activity_feed ENABLE ROW LEVEL SECURITY;
ALTER TABLE presskit_intel_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE writers_room_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE industry_calendar_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaign_simulator_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE coverage_map_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE audience_builder_suggestions ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_acquisition_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaign_narratives ENABLE ROW LEVEL SECURITY;
ALTER TABLE global_search_index ENABLE ROW LEVEL SECURITY;

-- Community RLS Policies
CREATE POLICY "Users can view public community profiles" ON community_profiles
  FOR SELECT USING (TRUE);

CREATE POLICY "Users can manage their own profile" ON community_profiles
  FOR ALL USING (user_id = auth.uid());

CREATE POLICY "Users can view public posts" ON community_posts
  FOR SELECT USING (
    visibility = 'public' OR
    user_id = auth.uid() OR
    (visibility = 'workspace' AND workspace_id IN (
      SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()
    ))
  );

CREATE POLICY "Users can create posts" ON community_posts
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their posts" ON community_posts
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can delete their posts" ON community_posts
  FOR DELETE USING (user_id = auth.uid());

-- Asset drop RLS
CREATE POLICY "Users can view their assets" ON asset_drop
  FOR SELECT USING (
    user_id = auth.uid() OR
    (workspace_id IN (SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid())) OR
    is_public = TRUE
  );

CREATE POLICY "Users can manage their assets" ON asset_drop
  FOR ALL USING (user_id = auth.uid());

-- Email campaigns RLS
CREATE POLICY "Users can view workspace campaigns" ON email_campaigns
  FOR SELECT USING (
    user_id = auth.uid() OR
    workspace_id IN (SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can manage their campaigns" ON email_campaigns
  FOR ALL USING (user_id = auth.uid());

-- Smart segments RLS
CREATE POLICY "Users can view workspace segments" ON smart_segments
  FOR SELECT USING (
    user_id = auth.uid() OR
    workspace_id IN (SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can manage their segments" ON smart_segments
  FOR ALL USING (user_id = auth.uid());

-- Release plans RLS
CREATE POLICY "Users can view workspace release plans" ON release_plans
  FOR SELECT USING (
    user_id = auth.uid() OR
    workspace_id IN (SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can manage their release plans" ON release_plans
  FOR ALL USING (user_id = auth.uid());

-- Integrations RLS
CREATE POLICY "Users can view workspace integrations" ON integrations
  FOR SELECT USING (
    user_id = auth.uid() OR
    workspace_id IN (SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can manage their integrations" ON integrations
  FOR ALL USING (user_id = auth.uid());

-- Success profiles are public (read-only for most users)
CREATE POLICY "Anyone can view success profiles" ON success_profiles
  FOR SELECT USING (TRUE);

-- Reply intel RLS
CREATE POLICY "Users can view their reply intelligence" ON reply_intel_cache
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can create reply intelligence" ON reply_intel_cache
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- Contact intel graph RLS
CREATE POLICY "Users can view their contact intelligence" ON contact_intel_graph
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can manage their contact intelligence" ON contact_intel_graph
  FOR ALL USING (user_id = auth.uid());

-- Campaign activity feed RLS
CREATE POLICY "Users can view workspace campaign activity" ON campaign_activity_feed
  FOR SELECT USING (
    user_id = auth.uid() OR
    workspace_id IN (SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid())
  );

CREATE POLICY "System can create campaign activity" ON campaign_activity_feed
  FOR INSERT WITH CHECK (TRUE);

-- Press kit intel RLS
CREATE POLICY "Users can view workspace press kit reports" ON presskit_intel_reports
  FOR SELECT USING (
    user_id = auth.uid() OR
    workspace_id IN (SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can manage their press kit reports" ON presskit_intel_reports
  FOR ALL USING (user_id = auth.uid());

-- Writer's room RLS
CREATE POLICY "Users can view workspace writer's room results" ON writers_room_results
  FOR SELECT USING (
    user_id = auth.uid() OR
    workspace_id IN (SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can manage their writer's room results" ON writers_room_results
  FOR ALL USING (user_id = auth.uid());

-- Industry calendar is public
CREATE POLICY "Anyone can view industry calendar" ON industry_calendar_events
  FOR SELECT USING (TRUE);

-- Campaign simulator RLS
CREATE POLICY "Users can view workspace simulations" ON campaign_simulator_results
  FOR SELECT USING (
    user_id = auth.uid() OR
    workspace_id IN (SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can manage their simulations" ON campaign_simulator_results
  FOR ALL USING (user_id = auth.uid());

-- Coverage map RLS
CREATE POLICY "Users can view workspace coverage" ON coverage_map_events
  FOR SELECT USING (
    user_id = auth.uid() OR
    workspace_id IN (SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can manage their coverage" ON coverage_map_events
  FOR ALL USING (user_id = auth.uid());

-- Audience builder RLS
CREATE POLICY "Users can view workspace suggestions" ON audience_builder_suggestions
  FOR SELECT USING (
    user_id = auth.uid() OR
    workspace_id IN (SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can manage their suggestions" ON audience_builder_suggestions
  FOR ALL USING (user_id = auth.uid());

-- Contact acquisition is system-level (read-only for users)
CREATE POLICY "Anyone can view contact acquisition events" ON contact_acquisition_events
  FOR SELECT USING (TRUE);

-- Campaign narratives RLS
CREATE POLICY "Users can view workspace narratives" ON campaign_narratives
  FOR SELECT USING (
    user_id = auth.uid() OR
    workspace_id IN (SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can manage their narratives" ON campaign_narratives
  FOR ALL USING (user_id = auth.uid());

-- Global search RLS
CREATE POLICY "Users can view their search index" ON global_search_index
  FOR SELECT USING (
    user_id = auth.uid() OR
    workspace_id IN (SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can manage their search index" ON global_search_index
  FOR ALL USING (user_id = auth.uid());

-- ========================================
-- TRIGGERS FOR UPDATED_AT
-- ========================================

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER community_profiles_updated_at BEFORE UPDATE ON community_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER community_posts_updated_at BEFORE UPDATE ON community_posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER community_threads_updated_at BEFORE UPDATE ON community_threads
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER community_replies_updated_at BEFORE UPDATE ON community_replies
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER community_events_updated_at BEFORE UPDATE ON community_events
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER asset_drop_updated_at BEFORE UPDATE ON asset_drop
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER email_campaigns_updated_at BEFORE UPDATE ON email_campaigns
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER smart_segments_updated_at BEFORE UPDATE ON smart_segments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER release_plans_updated_at BEFORE UPDATE ON release_plans
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER integrations_updated_at BEFORE UPDATE ON integrations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER success_profiles_updated_at BEFORE UPDATE ON success_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER contact_intel_graph_updated_at BEFORE UPDATE ON contact_intel_graph
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER presskit_intel_reports_updated_at BEFORE UPDATE ON presskit_intel_reports
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER industry_calendar_events_updated_at BEFORE UPDATE ON industry_calendar_events
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER campaign_narratives_updated_at BEFORE UPDATE ON campaign_narratives
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER global_search_index_updated_at BEFORE UPDATE ON global_search_index
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ========================================
-- COMMENTS
-- ========================================

COMMENT ON TABLE community_profiles IS 'User profiles for the community hub (artists, PR agencies, promoters)';
COMMENT ON TABLE community_posts IS 'Community posts (questions, case studies, discussions, tips)';
COMMENT ON TABLE community_threads IS 'Threaded replies to community posts';
COMMENT ON TABLE community_replies IS 'Nested replies within threads';
COMMENT ON TABLE community_follows IS 'User follow relationships';
COMMENT ON TABLE community_events IS 'Community events (webinars, workshops, networking)';
COMMENT ON TABLE asset_drop IS 'User-uploaded assets (press photos, audio, video, documents)';
COMMENT ON TABLE email_campaigns IS 'Email campaigns with smart segmentation and scheduling';
COMMENT ON TABLE smart_segments IS 'Dynamic contact segments with AI-powered filtering';
COMMENT ON TABLE release_plans IS 'Release planning with templates, tasks, and milestones';
COMMENT ON TABLE integrations IS 'Third-party integrations (Spotify, YouTube, social media)';
COMMENT ON TABLE ad_tracker_events IS 'Ad tracking events across platforms';
COMMENT ON TABLE success_profiles IS 'Genre and scene-specific success insights';
COMMENT ON TABLE reply_intel_cache IS 'AI-classified email replies with sentiment and urgency scores';
COMMENT ON TABLE contact_intel_graph IS 'Contact intelligence graph tracking preferences and patterns';
COMMENT ON TABLE campaign_activity_feed IS 'Real-time campaign activity feed';
COMMENT ON TABLE presskit_intel_reports IS 'Press kit quality analysis and suggestions';
COMMENT ON TABLE writers_room_results IS 'AI-generated creative angles, taglines, and narratives';
COMMENT ON TABLE industry_calendar_events IS 'Industry events, festivals, and submission deadlines';
COMMENT ON TABLE campaign_simulator_results IS 'Predictive campaign simulations with suggestions';
COMMENT ON TABLE coverage_map_events IS 'Geographic coverage tracking for campaigns';
COMMENT ON TABLE audience_builder_suggestions IS 'AI-suggested contacts and strategies';
COMMENT ON TABLE contact_acquisition_events IS 'Automated contact discovery events';
COMMENT ON TABLE campaign_narratives IS 'AI-generated campaign stories and insights';
COMMENT ON TABLE global_search_index IS 'Full-text search index across all entities';

-- ========================================
-- END MIGRATION
-- ========================================
