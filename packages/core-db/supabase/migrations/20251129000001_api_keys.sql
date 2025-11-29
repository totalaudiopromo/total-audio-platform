-- API Keys for programmatic access to TAP services
-- Supports totalaud.io and other external integrations

CREATE TABLE IF NOT EXISTS api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,

  -- Key identification
  name TEXT NOT NULL,
  key_prefix TEXT NOT NULL,      -- First 8 chars for display (e.g., "tap_live_")
  key_hash TEXT NOT NULL,        -- SHA-256 hash of full key

  -- Permissions and limits
  scopes TEXT[] DEFAULT '{}',    -- e.g., ['intel:read', 'intel:write', 'pitch:read']
  rate_limit_rpm INTEGER DEFAULT 60,

  -- Lifecycle
  last_used_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  revoked_at TIMESTAMPTZ,

  -- Audit
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for fast key lookups (only active keys)
CREATE INDEX IF NOT EXISTS idx_api_keys_hash ON api_keys(key_hash) WHERE revoked_at IS NULL;

-- Create index for user lookups
CREATE INDEX IF NOT EXISTS idx_api_keys_user_id ON api_keys(user_id);

-- Create index for workspace lookups
CREATE INDEX IF NOT EXISTS idx_api_keys_workspace_id ON api_keys(workspace_id) WHERE workspace_id IS NOT NULL;

-- Enable RLS
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own API keys
CREATE POLICY "Users can view own API keys" ON api_keys
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can create their own API keys
CREATE POLICY "Users can create own API keys" ON api_keys
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own API keys (revoke, update name)
CREATE POLICY "Users can update own API keys" ON api_keys
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Policy: Users can delete their own API keys
CREATE POLICY "Users can delete own API keys" ON api_keys
  FOR DELETE
  USING (auth.uid() = user_id);

-- API key usage tracking table
CREATE TABLE IF NOT EXISTS api_key_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  api_key_id UUID NOT NULL REFERENCES api_keys(id) ON DELETE CASCADE,

  -- Request details
  endpoint TEXT NOT NULL,
  method TEXT NOT NULL,
  status_code INTEGER NOT NULL,
  response_time_ms INTEGER,

  -- Context
  ip_address INET,
  user_agent TEXT,

  -- Timestamp
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for usage analytics
CREATE INDEX IF NOT EXISTS idx_api_key_usage_key_id ON api_key_usage(api_key_id);
CREATE INDEX IF NOT EXISTS idx_api_key_usage_created_at ON api_key_usage(created_at);

-- Enable RLS on usage table
ALTER TABLE api_key_usage ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view usage for their own API keys
CREATE POLICY "Users can view own API key usage" ON api_key_usage
  FOR SELECT
  USING (
    api_key_id IN (
      SELECT id FROM api_keys WHERE user_id = auth.uid()
    )
  );

-- Comment for documentation
COMMENT ON TABLE api_keys IS 'API keys for programmatic access to TAP services (Intel, Pitch, Tracker)';
COMMENT ON COLUMN api_keys.key_prefix IS 'First 8 characters of the key for display purposes (e.g., tap_live_...)';
COMMENT ON COLUMN api_keys.key_hash IS 'SHA-256 hash of the full API key for secure validation';
COMMENT ON COLUMN api_keys.scopes IS 'Array of permission scopes: intel:read, intel:write, pitch:read, pitch:write, tracker:read, tracker:write';
COMMENT ON TABLE api_key_usage IS 'Usage logs for API key requests, used for analytics and rate limiting';
