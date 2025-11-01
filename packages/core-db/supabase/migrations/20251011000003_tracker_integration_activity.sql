-- Integration Activity Log
-- Tracks all sync events for visual activity feed

CREATE TABLE IF NOT EXISTS integration_activity_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    connection_id UUID REFERENCES integration_connections(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    integration_type TEXT NOT NULL,
    activity_type TEXT NOT NULL, -- 'sync_to_sheet', 'sync_from_sheet', 'reply_detected', 'campaign_synced'
    status TEXT NOT NULL, -- 'success', 'error', 'warning'
    message TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_activity_log_connection ON integration_activity_log(connection_id);
CREATE INDEX idx_activity_log_user ON integration_activity_log(user_id);
CREATE INDEX idx_activity_log_created ON integration_activity_log(created_at DESC);

ALTER TABLE integration_activity_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own activity logs"
    ON integration_activity_log FOR SELECT
    USING (auth.uid() = user_id);

COMMENT ON TABLE integration_activity_log IS 'Visual activity feed showing integration sync events';
COMMENT ON COLUMN integration_activity_log.activity_type IS 'Type of activity: sync_to_sheet, sync_from_sheet, reply_detected, reply_scan, campaign_synced';
COMMENT ON COLUMN integration_activity_log.status IS 'Result: success, error, warning';
COMMENT ON COLUMN integration_activity_log.metadata IS 'Additional context: records_synced, campaign_name, etc.';
