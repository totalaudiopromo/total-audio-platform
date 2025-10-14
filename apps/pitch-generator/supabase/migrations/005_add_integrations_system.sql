-- Integrations System for Pitch Generator
-- Ported from tracker app

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Integration connections table
CREATE TABLE IF NOT EXISTS integration_connections (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id TEXT NOT NULL,
  integration_type TEXT NOT NULL CHECK (integration_type IN ('gmail', 'google_sheets', 'mailchimp', 'airtable')),
  connection_name TEXT NOT NULL,
  access_token TEXT NOT NULL,
  refresh_token TEXT,
  token_expires_at TIMESTAMPTZ,
  scope TEXT[],
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'error', 'disconnected')),
  error_message TEXT,
  last_sync_at TIMESTAMPTZ,
  sync_enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(user_id, integration_type)
);

-- 2. Integration sync logs for audit trail
CREATE TABLE IF NOT EXISTS integration_sync_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  connection_id UUID NOT NULL REFERENCES integration_connections(id) ON DELETE CASCADE,
  sync_type TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('success', 'error', 'partial')),
  records_processed INTEGER DEFAULT 0,
  records_synced INTEGER DEFAULT 0,
  error_message TEXT,
  metadata JSONB,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- 3. Gmail tracked emails for reply detection
CREATE TABLE IF NOT EXISTS gmail_tracked_emails (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id TEXT NOT NULL,
  connection_id UUID NOT NULL REFERENCES integration_connections(id) ON DELETE CASCADE,
  pitch_id UUID REFERENCES pitches(id) ON DELETE SET NULL,
  gmail_thread_id TEXT NOT NULL,
  gmail_message_id TEXT NOT NULL,
  to_email TEXT NOT NULL,
  subject TEXT NOT NULL,
  sent_at TIMESTAMPTZ NOT NULL,
  has_reply BOOLEAN DEFAULT false,
  reply_detected_at TIMESTAMPTZ,
  reply_snippet TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(gmail_message_id)
);

-- 4. Integration field mappings (for custom configurations)
CREATE TABLE IF NOT EXISTS integration_field_mappings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  connection_id UUID NOT NULL REFERENCES integration_connections(id) ON DELETE CASCADE,
  mapping_type TEXT NOT NULL, -- 'google_sheets_columns', 'mailchimp_fields', etc.
  field_mappings JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_integration_connections_user_id ON integration_connections(user_id);
CREATE INDEX IF NOT EXISTS idx_integration_connections_type ON integration_connections(integration_type);
CREATE INDEX IF NOT EXISTS idx_integration_sync_logs_connection_id ON integration_sync_logs(connection_id);
CREATE INDEX IF NOT EXISTS idx_integration_sync_logs_started_at ON integration_sync_logs(started_at);
CREATE INDEX IF NOT EXISTS idx_gmail_tracked_emails_user_id ON gmail_tracked_emails(user_id);
CREATE INDEX IF NOT EXISTS idx_gmail_tracked_emails_pitch_id ON gmail_tracked_emails(pitch_id);
CREATE INDEX IF NOT EXISTS idx_gmail_tracked_emails_thread_id ON gmail_tracked_emails(gmail_thread_id);
CREATE INDEX IF NOT EXISTS idx_gmail_tracked_emails_has_reply ON gmail_tracked_emails(has_reply);

-- Row Level Security (RLS) policies
ALTER TABLE integration_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE integration_sync_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE gmail_tracked_emails ENABLE ROW LEVEL SECURITY;
ALTER TABLE integration_field_mappings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for integration_connections
CREATE POLICY "Users can view their own integration connections" ON integration_connections
  FOR SELECT USING (user_id = auth.uid()::text OR user_id = current_setting('request.jwt.claims', true)::json->>'email');

CREATE POLICY "Users can insert their own integration connections" ON integration_connections
  FOR INSERT WITH CHECK (user_id = auth.uid()::text OR user_id = current_setting('request.jwt.claims', true)::json->>'email');

CREATE POLICY "Users can update their own integration connections" ON integration_connections
  FOR UPDATE USING (user_id = auth.uid()::text OR user_id = current_setting('request.jwt.claims', true)::json->>'email');

CREATE POLICY "Users can delete their own integration connections" ON integration_connections
  FOR DELETE USING (user_id = auth.uid()::text OR user_id = current_setting('request.jwt.claims', true)::json->>'email');

-- RLS Policies for integration_sync_logs
CREATE POLICY "Users can view sync logs for their connections" ON integration_sync_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM integration_connections ic 
      WHERE ic.id = integration_sync_logs.connection_id 
      AND (ic.user_id = auth.uid()::text OR ic.user_id = current_setting('request.jwt.claims', true)::json->>'email')
    )
  );

CREATE POLICY "Users can insert sync logs for their connections" ON integration_sync_logs
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM integration_connections ic 
      WHERE ic.id = integration_sync_logs.connection_id 
      AND (ic.user_id = auth.uid()::text OR ic.user_id = current_setting('request.jwt.claims', true)::json->>'email')
    )
  );

-- RLS Policies for gmail_tracked_emails
CREATE POLICY "Users can view their own tracked emails" ON gmail_tracked_emails
  FOR SELECT USING (user_id = auth.uid()::text OR user_id = current_setting('request.jwt.claims', true)::json->>'email');

CREATE POLICY "Users can insert their own tracked emails" ON gmail_tracked_emails
  FOR INSERT WITH CHECK (user_id = auth.uid()::text OR user_id = current_setting('request.jwt.claims', true)::json->>'email');

CREATE POLICY "Users can update their own tracked emails" ON gmail_tracked_emails
  FOR UPDATE USING (user_id = auth.uid()::text OR user_id = current_setting('request.jwt.claims', true)::json->>'email');

-- RLS Policies for integration_field_mappings
CREATE POLICY "Users can view field mappings for their connections" ON integration_field_mappings
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM integration_connections ic 
      WHERE ic.id = integration_field_mappings.connection_id 
      AND (ic.user_id = auth.uid()::text OR ic.user_id = current_setting('request.jwt.claims', true)::json->>'email')
    )
  );

CREATE POLICY "Users can manage field mappings for their connections" ON integration_field_mappings
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM integration_connections ic 
      WHERE ic.id = integration_field_mappings.connection_id 
      AND (ic.user_id = auth.uid()::text OR ic.user_id = current_setting('request.jwt.claims', true)::json->>'email')
    )
  );

-- Functions for automatic timestamp updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_integration_connections_updated_at 
  BEFORE UPDATE ON integration_connections 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_integration_field_mappings_updated_at 
  BEFORE UPDATE ON integration_field_mappings 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
