-- Migration: Integrations System
-- Enables Google Sheets, Gmail, Airtable, Mailchimp integrations
-- Author: Claude
-- Date: 2025-10-09

-- Integration connections table
CREATE TABLE IF NOT EXISTS integration_connections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    integration_type TEXT NOT NULL CHECK (integration_type IN ('google_sheets', 'gmail', 'airtable', 'mailchimp', 'excel')),

    -- Encrypted OAuth credentials (use Supabase vault for production)
    credentials JSONB NOT NULL DEFAULT '{}'::jsonb,

    -- Integration-specific settings
    settings JSONB NOT NULL DEFAULT '{}'::jsonb,

    -- Sync metadata
    last_sync_at TIMESTAMPTZ,
    sync_frequency_minutes INTEGER DEFAULT 15,
    sync_enabled BOOLEAN DEFAULT true,

    -- Status tracking
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'paused', 'error', 'disconnected')),
    error_message TEXT,
    error_count INTEGER DEFAULT 0,

    -- Audit fields
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    UNIQUE(user_id, integration_type)
);

-- Sync logs for debugging and analytics
CREATE TABLE IF NOT EXISTS integration_sync_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    connection_id UUID REFERENCES integration_connections(id) ON DELETE CASCADE,

    -- Sync details
    direction TEXT NOT NULL CHECK (direction IN ('to_external', 'from_external', 'bidirectional')),
    records_created INTEGER DEFAULT 0,
    records_updated INTEGER DEFAULT 0,
    records_failed INTEGER DEFAULT 0,

    -- Error tracking
    errors JSONB DEFAULT '[]'::jsonb,
    duration_ms INTEGER,

    -- Audit
    started_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ,

    -- Indexes for querying
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Field mappings for flexible integrations
CREATE TABLE IF NOT EXISTS integration_field_mappings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    connection_id UUID REFERENCES integration_connections(id) ON DELETE CASCADE,

    -- Field mapping
    tracker_field TEXT NOT NULL,
    external_field TEXT NOT NULL,

    -- Transformation rules (optional)
    transform_rules JSONB DEFAULT '{}'::jsonb,

    -- Direction
    sync_direction TEXT DEFAULT 'bidirectional' CHECK (sync_direction IN ('to_external', 'from_external', 'bidirectional')),

    enabled BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),

    UNIQUE(connection_id, tracker_field)
);

-- Gmail reply tracking
CREATE TABLE IF NOT EXISTS gmail_tracked_emails (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    connection_id UUID REFERENCES integration_connections(id) ON DELETE CASCADE,
    campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE,

    -- Email details
    gmail_message_id TEXT NOT NULL,
    gmail_thread_id TEXT NOT NULL,
    contact_email TEXT NOT NULL,
    subject TEXT NOT NULL,

    -- Reply detection
    has_reply BOOLEAN DEFAULT false,
    reply_received_at TIMESTAMPTZ,
    reply_message_id TEXT,
    reply_snippet TEXT,

    -- Tracking
    sent_at TIMESTAMPTZ NOT NULL,
    last_checked_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),

    UNIQUE(gmail_message_id)
);

-- Indexes for performance
CREATE INDEX idx_integration_connections_user_id ON integration_connections(user_id);
CREATE INDEX idx_integration_connections_type ON integration_connections(integration_type);
CREATE INDEX idx_integration_connections_status ON integration_connections(status) WHERE status = 'active';

CREATE INDEX idx_sync_logs_connection_id ON integration_sync_logs(connection_id);
CREATE INDEX idx_sync_logs_created_at ON integration_sync_logs(created_at DESC);

CREATE INDEX idx_field_mappings_connection_id ON integration_field_mappings(connection_id);

CREATE INDEX idx_gmail_tracked_campaign_id ON gmail_tracked_emails(campaign_id);
CREATE INDEX idx_gmail_tracked_contact_email ON gmail_tracked_emails(contact_email);
CREATE INDEX idx_gmail_tracked_has_reply ON gmail_tracked_emails(has_reply) WHERE has_reply = false;

-- RLS Policies
ALTER TABLE integration_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE integration_sync_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE integration_field_mappings ENABLE ROW LEVEL SECURITY;
ALTER TABLE gmail_tracked_emails ENABLE ROW LEVEL SECURITY;

-- Users can only see their own connections
CREATE POLICY "Users can view own connections"
    ON integration_connections FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own connections"
    ON integration_connections FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own connections"
    ON integration_connections FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own connections"
    ON integration_connections FOR DELETE
    USING (auth.uid() = user_id);

-- Sync logs viewable by connection owner
CREATE POLICY "Users can view own sync logs"
    ON integration_sync_logs FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM integration_connections
        WHERE integration_connections.id = integration_sync_logs.connection_id
        AND integration_connections.user_id = auth.uid()
    ));

-- Field mappings viewable by connection owner
CREATE POLICY "Users can manage own field mappings"
    ON integration_field_mappings FOR ALL
    USING (EXISTS (
        SELECT 1 FROM integration_connections
        WHERE integration_connections.id = integration_field_mappings.connection_id
        AND integration_connections.user_id = auth.uid()
    ));

-- Gmail tracked emails viewable by connection owner
CREATE POLICY "Users can view own gmail tracked emails"
    ON gmail_tracked_emails FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM integration_connections
        WHERE integration_connections.id = gmail_tracked_emails.connection_id
        AND integration_connections.user_id = auth.uid()
    ));

-- Update timestamp trigger
CREATE OR REPLACE FUNCTION update_integration_connection_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER integration_connection_updated_at
    BEFORE UPDATE ON integration_connections
    FOR EACH ROW
    EXECUTE FUNCTION update_integration_connection_updated_at();

-- Comments for documentation
COMMENT ON TABLE integration_connections IS 'Stores OAuth connections and settings for external integrations';
COMMENT ON TABLE integration_sync_logs IS 'Audit log of all integration sync operations';
COMMENT ON TABLE integration_field_mappings IS 'Custom field mappings between Tracker and external systems';
COMMENT ON TABLE gmail_tracked_emails IS 'Tracks sent emails for automatic reply detection';

COMMENT ON COLUMN integration_connections.credentials IS 'Encrypted OAuth tokens and API keys (use Supabase vault in production)';
COMMENT ON COLUMN integration_connections.settings IS 'Integration-specific settings (spreadsheet ID, column mappings, etc)';
COMMENT ON COLUMN integration_connections.sync_frequency_minutes IS 'How often to sync (5, 15, 30, 60 minutes)';
