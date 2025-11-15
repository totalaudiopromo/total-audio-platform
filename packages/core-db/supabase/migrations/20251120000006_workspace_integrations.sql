-- Migration: Workspace-Scoped Integrations Enhancement
-- Adds workspace_id support to existing integration_connections table
-- and creates integration_activity table for cross-workspace logging
-- Author: Claude
-- Date: 2025-11-20

-- ========================================
-- Step 1: Add workspace_id to integration_connections
-- ========================================

-- Add workspace_id column (nullable initially for migration)
ALTER TABLE integration_connections
ADD COLUMN IF NOT EXISTS workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE;

-- Create index for workspace queries
CREATE INDEX IF NOT EXISTS idx_integration_connections_workspace_id
ON integration_connections(workspace_id);

-- Migrate existing user_id to workspace_id
-- Assumes 1:1 mapping between users and default workspaces for migration
-- This will need adjustment based on actual workspace migration strategy
UPDATE integration_connections
SET workspace_id = (
  SELECT id FROM workspaces
  WHERE owner_id = integration_connections.user_id
  LIMIT 1
)
WHERE workspace_id IS NULL;

-- ========================================
-- Step 2: Create integration_activity table
-- ========================================

-- Cross-workspace activity logging for integrations
-- Supplements integration_sync_logs with workspace-scoped tracking
CREATE TABLE IF NOT EXISTS integration_activity (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  integration_name VARCHAR(50) NOT NULL,

  -- Activity details
  action VARCHAR(100) NOT NULL,
  success BOOLEAN NOT NULL,
  records_affected INTEGER DEFAULT 0,

  -- Error tracking
  error_message TEXT,

  -- Additional context
  metadata JSONB DEFAULT '{}',

  -- Timestamp
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Indexes for performance
CREATE INDEX idx_integration_activity_workspace_id ON integration_activity(workspace_id);
CREATE INDEX idx_integration_activity_integration_name ON integration_activity(integration_name);
CREATE INDEX idx_integration_activity_created_at ON integration_activity(created_at DESC);
CREATE INDEX idx_integration_activity_success ON integration_activity(success) WHERE success = false;

-- ========================================
-- Step 3: Row Level Security (RLS)
-- ========================================

-- Enable RLS on integration_activity
ALTER TABLE integration_activity ENABLE ROW LEVEL SECURITY;

-- Workspace members can view activity for their workspaces
CREATE POLICY "Workspace members can view integration activity"
ON integration_activity FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM workspace_members
    WHERE workspace_members.workspace_id = integration_activity.workspace_id
    AND workspace_members.user_id = auth.uid()
  )
);

-- Workspace members can insert activity (for service accounts)
CREATE POLICY "Workspace members can insert integration activity"
ON integration_activity FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM workspace_members
    WHERE workspace_members.workspace_id = integration_activity.workspace_id
    AND workspace_members.user_id = auth.uid()
  )
);

-- Update existing RLS policies on integration_connections to support workspace_id
-- Users can view connections for workspaces they belong to
DROP POLICY IF EXISTS "Users can view own connections" ON integration_connections;
CREATE POLICY "Workspace members can view connections"
ON integration_connections FOR SELECT
USING (
  -- Legacy user_id check OR workspace membership check
  auth.uid() = user_id
  OR EXISTS (
    SELECT 1 FROM workspace_members
    WHERE workspace_members.workspace_id = integration_connections.workspace_id
    AND workspace_members.user_id = auth.uid()
  )
);

-- Users can insert connections for their workspaces
DROP POLICY IF EXISTS "Users can insert own connections" ON integration_connections;
CREATE POLICY "Workspace members can insert connections"
ON integration_connections FOR INSERT
WITH CHECK (
  auth.uid() = user_id
  OR EXISTS (
    SELECT 1 FROM workspace_members
    WHERE workspace_members.workspace_id = integration_connections.workspace_id
    AND workspace_members.user_id = auth.uid()
  )
);

-- Users can update connections for their workspaces
DROP POLICY IF EXISTS "Users can update own connections" ON integration_connections;
CREATE POLICY "Workspace members can update connections"
ON integration_connections FOR UPDATE
USING (
  auth.uid() = user_id
  OR EXISTS (
    SELECT 1 FROM workspace_members
    WHERE workspace_members.workspace_id = integration_connections.workspace_id
    AND workspace_members.user_id = auth.uid()
  )
);

-- Users can delete connections for their workspaces
DROP POLICY IF EXISTS "Users can delete own connections" ON integration_connections;
CREATE POLICY "Workspace members can delete connections"
ON integration_connections FOR DELETE
USING (
  auth.uid() = user_id
  OR EXISTS (
    SELECT 1 FROM workspace_members
    WHERE workspace_members.workspace_id = integration_connections.workspace_id
    AND workspace_members.user_id = auth.uid()
  )
);

-- ========================================
-- Step 4: Helper Functions
-- ========================================

-- Function to get workspace integrations
CREATE OR REPLACE FUNCTION get_workspace_integrations(p_workspace_id UUID)
RETURNS TABLE (
  id UUID,
  integration_type TEXT,
  status TEXT,
  sync_enabled BOOLEAN,
  last_sync_at TIMESTAMPTZ,
  error_message TEXT,
  created_at TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    ic.id,
    ic.integration_type,
    ic.status,
    ic.sync_enabled,
    ic.last_sync_at,
    ic.error_message,
    ic.created_at
  FROM integration_connections ic
  WHERE ic.workspace_id = p_workspace_id
  ORDER BY ic.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get integration activity summary
CREATE OR REPLACE FUNCTION get_integration_activity_summary(
  p_workspace_id UUID,
  p_integration_name VARCHAR DEFAULT NULL,
  p_days_back INTEGER DEFAULT 7
)
RETURNS TABLE (
  integration_name VARCHAR,
  total_activities INTEGER,
  successful_activities INTEGER,
  failed_activities INTEGER,
  total_records_affected INTEGER,
  last_activity_at TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    ia.integration_name,
    COUNT(*)::INTEGER as total_activities,
    COUNT(*) FILTER (WHERE ia.success = true)::INTEGER as successful_activities,
    COUNT(*) FILTER (WHERE ia.success = false)::INTEGER as failed_activities,
    SUM(ia.records_affected)::INTEGER as total_records_affected,
    MAX(ia.created_at) as last_activity_at
  FROM integration_activity ia
  WHERE ia.workspace_id = p_workspace_id
    AND ia.created_at >= now() - (p_days_back || ' days')::interval
    AND (p_integration_name IS NULL OR ia.integration_name = p_integration_name)
  GROUP BY ia.integration_name
  ORDER BY last_activity_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ========================================
-- Step 5: Comments for Documentation
-- ========================================

COMMENT ON TABLE integration_activity IS 'Workspace-scoped activity log for all integration operations (OAuth, sync, errors)';
COMMENT ON COLUMN integration_connections.workspace_id IS 'Links integration to workspace for multi-tenant support';
COMMENT ON FUNCTION get_workspace_integrations IS 'Returns all integrations configured for a workspace';
COMMENT ON FUNCTION get_integration_activity_summary IS 'Returns activity summary for workspace integrations over specified time period';
