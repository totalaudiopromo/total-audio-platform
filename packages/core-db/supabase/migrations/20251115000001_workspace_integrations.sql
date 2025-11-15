-- Workspace-scoped Integrations System
-- Refactored from user-scoped to workspace-scoped
-- Supports Gmail, Google Sheets, Mailchimp, Airtable, etc.

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Workspace-scoped integrations table
CREATE TABLE IF NOT EXISTS integrations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  integration_name TEXT NOT NULL CHECK (integration_name IN ('gmail', 'google_sheets', 'mailchimp', 'airtable', 'notion')),
  oauth_provider TEXT, -- e.g., 'google', 'mailchimp', 'airtable'
  access_token TEXT,
  refresh_token TEXT,
  token_expires_at TIMESTAMPTZ,
  credentials JSONB, -- Store client_id, client_secret, etc.
  settings JSONB, -- Integration-specific settings (signature, from_email, etc.)
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'error', 'disconnected')),
  error_message TEXT,
  last_sync_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(workspace_id, integration_name)
);

-- 2. Integration sync logs (workspace-scoped)
CREATE TABLE IF NOT EXISTS integration_sync_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  integration_name TEXT NOT NULL,
  sync_type TEXT NOT NULL, -- 'send_pitches', 'check_replies', 'sync_contacts', etc.
  status TEXT NOT NULL CHECK (status IN ('success', 'error', 'partial')),
  records_processed INTEGER DEFAULT 0,
  records_synced INTEGER DEFAULT 0,
  error_message TEXT,
  metadata JSONB,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- 3. Pitch email tracking (workspace-scoped)
CREATE TABLE IF NOT EXISTS pitch_email_tracking (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  pitch_id UUID REFERENCES pitches(id) ON DELETE CASCADE,
  contact_id UUID REFERENCES pitch_contacts(id) ON DELETE SET NULL,
  gmail_message_id VARCHAR(255) UNIQUE,
  gmail_thread_id VARCHAR(255),
  to_email TEXT NOT NULL,
  subject TEXT NOT NULL,
  sent_at TIMESTAMPTZ NOT NULL,
  opened_at TIMESTAMPTZ,
  replied_at TIMESTAMPTZ,
  bounced BOOLEAN DEFAULT false,
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_integrations_workspace_id ON integrations(workspace_id);
CREATE INDEX IF NOT EXISTS idx_integrations_name ON integrations(integration_name);
CREATE INDEX IF NOT EXISTS idx_integrations_status ON integrations(status);

CREATE INDEX IF NOT EXISTS idx_sync_logs_workspace_id ON integration_sync_logs(workspace_id);
CREATE INDEX IF NOT EXISTS idx_sync_logs_integration ON integration_sync_logs(integration_name);
CREATE INDEX IF NOT EXISTS idx_sync_logs_started_at ON integration_sync_logs(started_at);

CREATE INDEX IF NOT EXISTS idx_email_tracking_workspace_id ON pitch_email_tracking(workspace_id);
CREATE INDEX IF NOT EXISTS idx_email_tracking_pitch_id ON pitch_email_tracking(pitch_id);
CREATE INDEX IF NOT EXISTS idx_email_tracking_contact_id ON pitch_email_tracking(contact_id);
CREATE INDEX IF NOT EXISTS idx_email_tracking_thread_id ON pitch_email_tracking(gmail_thread_id);
CREATE INDEX IF NOT EXISTS idx_email_tracking_replied_at ON pitch_email_tracking(replied_at);

-- Row Level Security (RLS)
ALTER TABLE integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE integration_sync_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE pitch_email_tracking ENABLE ROW LEVEL SECURITY;

-- RLS Policies for integrations
CREATE POLICY "Workspace members can view integrations" ON integrations
  FOR SELECT USING (
    workspace_id IN (
      SELECT workspace_id FROM workspace_members
      WHERE user_id = auth.uid()::text
    )
  );

CREATE POLICY "Workspace admins can manage integrations" ON integrations
  FOR ALL USING (
    workspace_id IN (
      SELECT workspace_id FROM workspace_members
      WHERE user_id = auth.uid()::text
      AND role IN ('owner', 'admin')
    )
  );

-- RLS Policies for integration_sync_logs
CREATE POLICY "Workspace members can view sync logs" ON integration_sync_logs
  FOR SELECT USING (
    workspace_id IN (
      SELECT workspace_id FROM workspace_members
      WHERE user_id = auth.uid()::text
    )
  );

CREATE POLICY "System can insert sync logs" ON integration_sync_logs
  FOR INSERT WITH CHECK (true);

-- RLS Policies for pitch_email_tracking
CREATE POLICY "Workspace members can view email tracking" ON pitch_email_tracking
  FOR SELECT USING (
    workspace_id IN (
      SELECT workspace_id FROM workspace_members
      WHERE user_id = auth.uid()::text
    )
  );

CREATE POLICY "Workspace members can manage email tracking" ON pitch_email_tracking
  FOR ALL USING (
    workspace_id IN (
      SELECT workspace_id FROM workspace_members
      WHERE user_id = auth.uid()::text
    )
  );

-- Functions for automatic timestamp updates
CREATE OR REPLACE FUNCTION update_integrations_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_integrations_updated_at_trigger
  BEFORE UPDATE ON integrations
  FOR EACH ROW EXECUTE FUNCTION update_integrations_updated_at();

-- Migration helper: Copy existing user-scoped connections to workspace-scoped (if needed)
-- This is a data migration that should be run separately if migrating from old system
-- DO $$
-- BEGIN
--   -- Insert user connections into workspace integrations
--   INSERT INTO integrations (workspace_id, integration_name, access_token, refresh_token, token_expires_at, status, created_at)
--   SELECT
--     w.id as workspace_id,
--     ic.integration_type as integration_name,
--     ic.access_token,
--     ic.refresh_token,
--     ic.token_expires_at,
--     ic.status,
--     ic.created_at
--   FROM integration_connections ic
--   JOIN workspaces w ON w.owner_id = ic.user_id
--   WHERE ic.status = 'active'
--   ON CONFLICT (workspace_id, integration_name) DO NOTHING;
-- END $$;
