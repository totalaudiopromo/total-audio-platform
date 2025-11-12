-- Campaign Tracker Production Schema - Integration Enhancement
-- Adds Liberty Music PR integrations to existing campaigns table

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- ENHANCE EXISTING CAMPAIGNS TABLE
-- ============================================================================
-- Add campaign information fields if they don't exist
DO $$
BEGIN
  -- Campaign Details
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='campaigns' AND column_name='artist_name') THEN
    ALTER TABLE campaigns ADD COLUMN artist_name TEXT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='campaigns' AND column_name='track_name') THEN
    ALTER TABLE campaigns ADD COLUMN track_name TEXT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='campaigns' AND column_name='genre') THEN
    ALTER TABLE campaigns ADD COLUMN genre TEXT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='campaigns' AND column_name='budget') THEN
    ALTER TABLE campaigns ADD COLUMN budget TEXT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='campaigns' AND column_name='campaign_angle') THEN
    ALTER TABLE campaigns ADD COLUMN campaign_angle TEXT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='campaigns' AND column_name='region') THEN
    ALTER TABLE campaigns ADD COLUMN region TEXT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='campaigns' AND column_name='campaign_duration') THEN
    ALTER TABLE campaigns ADD COLUMN campaign_duration TEXT;
  END IF;

  -- Integration IDs (Link to external systems)
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='campaigns' AND column_name='typeform_response_id') THEN
    ALTER TABLE campaigns ADD COLUMN typeform_response_id TEXT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='campaigns' AND column_name='gmail_label') THEN
    ALTER TABLE campaigns ADD COLUMN gmail_label TEXT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='campaigns' AND column_name='mailchimp_campaign_id') THEN
    ALTER TABLE campaigns ADD COLUMN mailchimp_campaign_id TEXT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='campaigns' AND column_name='monday_board_id') THEN
    ALTER TABLE campaigns ADD COLUMN monday_board_id TEXT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='campaigns' AND column_name='drive_folder_id') THEN
    ALTER TABLE campaigns ADD COLUMN drive_folder_id TEXT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='campaigns' AND column_name='airtable_base_id') THEN
    ALTER TABLE campaigns ADD COLUMN airtable_base_id TEXT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='campaigns' AND column_name='airtable_table_id') THEN
    ALTER TABLE campaigns ADD COLUMN airtable_table_id TEXT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='campaigns' AND column_name='sheets_report_id') THEN
    ALTER TABLE campaigns ADD COLUMN sheets_report_id TEXT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='campaigns' AND column_name='excel_export_path') THEN
    ALTER TABLE campaigns ADD COLUMN excel_export_path TEXT;
  END IF;

  -- Status (only add if doesn't exist)
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='campaigns' AND column_name='status') THEN
    ALTER TABLE campaigns ADD COLUMN status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'paused'));
  END IF;
END $$;

-- Add indexes for performance (IF NOT EXISTS)
CREATE INDEX IF NOT EXISTS idx_campaigns_user_id ON campaigns(user_id);
CREATE INDEX IF NOT EXISTS idx_campaigns_status ON campaigns(status);

-- ============================================================================
-- CAMPAIGN CONTACTS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS campaign_contacts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  campaign_id UUID NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,

  -- Contact Information
  contact_name TEXT NOT NULL,
  contact_email TEXT,
  outlet TEXT,
  contact_type TEXT CHECK (contact_type IN ('National', 'Commercial', 'Community', 'Online')),
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('high', 'medium', 'low')),

  -- Status & Tracking
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'contacted', 'responded', 'confirmed', 'declined', 'follow_up_needed')),
  assigned_to TEXT, -- Liberty team member name
  last_contacted TIMESTAMPTZ,

  -- Integration References
  gmail_thread_id TEXT, -- Gmail conversation thread ID
  gmail_message_ids TEXT[], -- Array of Gmail message IDs
  mailchimp_subscriber_id TEXT, -- Mailchimp subscriber ID
  monday_item_id TEXT, -- Monday.com item ID
  airtable_record_id TEXT, -- Airtable record ID
  synced_to_airtable BOOLEAN DEFAULT FALSE, -- Track sync status

  -- Contact Intelligence (from Audio Intel)
  intelligence JSONB, -- Show times, genres, submission guidelines, etc.

  -- Notes
  notes TEXT,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_campaign_contacts_campaign_id ON campaign_contacts(campaign_id);
CREATE INDEX IF NOT EXISTS idx_campaign_contacts_status ON campaign_contacts(status);
CREATE INDEX IF NOT EXISTS idx_campaign_contacts_airtable ON campaign_contacts(airtable_record_id);

-- ============================================================================
-- CAMPAIGN ACTIVITIES TABLE (Timeline)
-- ============================================================================
CREATE TABLE IF NOT EXISTS campaign_activities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  campaign_id UUID NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
  contact_id UUID REFERENCES campaign_contacts(id) ON DELETE SET NULL,

  -- Activity Information
  user_id TEXT NOT NULL,
  user_name TEXT,
  user_location TEXT, -- Brighton, LA, London, etc.
  activity_type TEXT NOT NULL CHECK (activity_type IN (
    'gmail_sent',
    'gmail_received',
    'mailchimp_sent',
    'warm_play',
    'milestone',
    'contacted',
    'followed_up',
    'got_response',
    'play_confirmed',
    'declined'
  )),
  description TEXT NOT NULL,
  notes TEXT,

  -- Integration References
  integration_source TEXT CHECK (integration_source IN (
    'gmail',
    'mailchimp',
    'warm_api',
    'warm_report',
    'monday',
    'manual',
    'agent',
    'airtable'
  )),
  integration_id TEXT, -- Message ID, campaign ID, play ID, etc.

  -- Additional Metadata
  metadata JSONB, -- Flexible storage for integration-specific data

  -- Timestamp
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- Add indexes for timeline queries
CREATE INDEX IF NOT EXISTS idx_campaign_activities_campaign_id ON campaign_activities(campaign_id);
CREATE INDEX IF NOT EXISTS idx_campaign_activities_timestamp ON campaign_activities(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_campaign_activities_type ON campaign_activities(activity_type);

-- ============================================================================
-- CAMPAIGN METRICS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS campaign_metrics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  campaign_id UUID NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,

  -- Metric Information
  metric_type TEXT NOT NULL CHECK (metric_type IN (
    'plays',
    'emails_sent',
    'email_opens',
    'email_clicks',
    'responses',
    'confirmations'
  )),
  value INTEGER NOT NULL,

  -- Source Tracking
  source TEXT NOT NULL CHECK (source IN (
    'warm_report',
    'warm_api',
    'gmail_api',
    'mailchimp_api',
    'manual'
  )),
  source_file_id TEXT, -- Drive file ID if from uploaded WARM report

  -- Timestamp
  recorded_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add indexes for metrics queries
CREATE INDEX IF NOT EXISTS idx_campaign_metrics_campaign_id ON campaign_metrics(campaign_id);
CREATE INDEX IF NOT EXISTS idx_campaign_metrics_type ON campaign_metrics(metric_type);

-- ============================================================================
-- WARM REPORTS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS warm_reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  campaign_id UUID NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,

  -- File Information
  filename TEXT NOT NULL,
  drive_file_id TEXT, -- Google Drive file ID
  upload_date TIMESTAMPTZ DEFAULT NOW(),

  -- Parsed Data Summary
  total_plays INTEGER,
  stations_count INTEGER,
  countries_count INTEGER,
  date_range_start DATE,
  date_range_end DATE,

  -- Parsing Status
  parsed BOOLEAN DEFAULT FALSE,
  parse_error TEXT,
  parsed_at TIMESTAMPTZ
);

-- Add index for campaign queries
CREATE INDEX IF NOT EXISTS idx_warm_reports_campaign_id ON warm_reports(campaign_id);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaign_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaign_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaign_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE warm_reports ENABLE ROW LEVEL SECURITY;

-- Campaigns: Users can only access their own campaigns
CREATE POLICY "Users can view own campaigns" ON campaigns
  FOR SELECT USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert own campaigns" ON campaigns
  FOR INSERT WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can update own campaigns" ON campaigns
  FOR UPDATE USING (auth.uid()::text = user_id);

CREATE POLICY "Users can delete own campaigns" ON campaigns
  FOR DELETE USING (auth.uid()::text = user_id);

-- Campaign Contacts: Access through campaign ownership
CREATE POLICY "Users can view campaign contacts" ON campaign_contacts
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM campaigns
      WHERE campaigns.id = campaign_contacts.campaign_id
      AND campaigns.user_id = auth.uid()::text
    )
  );

CREATE POLICY "Users can insert campaign contacts" ON campaign_contacts
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM campaigns
      WHERE campaigns.id = campaign_contacts.campaign_id
      AND campaigns.user_id = auth.uid()::text
    )
  );

CREATE POLICY "Users can update campaign contacts" ON campaign_contacts
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM campaigns
      WHERE campaigns.id = campaign_contacts.campaign_id
      AND campaigns.user_id = auth.uid()::text
    )
  );

CREATE POLICY "Users can delete campaign contacts" ON campaign_contacts
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM campaigns
      WHERE campaigns.id = campaign_contacts.campaign_id
      AND campaigns.user_id = auth.uid()::text
    )
  );

-- Campaign Activities: Access through campaign ownership
CREATE POLICY "Users can view campaign activities" ON campaign_activities
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM campaigns
      WHERE campaigns.id = campaign_activities.campaign_id
      AND campaigns.user_id = auth.uid()::text
    )
  );

CREATE POLICY "Users can insert campaign activities" ON campaign_activities
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM campaigns
      WHERE campaigns.id = campaign_activities.campaign_id
      AND campaigns.user_id = auth.uid()::text
    )
  );

-- Campaign Metrics: Access through campaign ownership
CREATE POLICY "Users can view campaign metrics" ON campaign_metrics
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM campaigns
      WHERE campaigns.id = campaign_metrics.campaign_id
      AND campaigns.user_id = auth.uid()::text
    )
  );

CREATE POLICY "Users can insert campaign metrics" ON campaign_metrics
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM campaigns
      WHERE campaigns.id = campaign_metrics.campaign_id
      AND campaigns.user_id = auth.uid()::text
    )
  );

-- WARM Reports: Access through campaign ownership
CREATE POLICY "Users can view warm reports" ON warm_reports
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM campaigns
      WHERE campaigns.id = warm_reports.campaign_id
      AND campaigns.user_id = auth.uid()::text
    )
  );

CREATE POLICY "Users can insert warm reports" ON warm_reports
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM campaigns
      WHERE campaigns.id = warm_reports.campaign_id
      AND campaigns.user_id = auth.uid()::text
    )
  );

-- ============================================================================
-- REALTIME SUBSCRIPTIONS
-- ============================================================================

-- Enable realtime for activity updates
ALTER PUBLICATION supabase_realtime ADD TABLE campaign_activities;
ALTER PUBLICATION supabase_realtime ADD TABLE campaign_contacts;
ALTER PUBLICATION supabase_realtime ADD TABLE campaign_metrics;

-- ============================================================================
-- HELPER FUNCTIONS
-- ============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers for updated_at
CREATE TRIGGER update_campaigns_updated_at BEFORE UPDATE ON campaigns
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_campaign_contacts_updated_at BEFORE UPDATE ON campaign_contacts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
