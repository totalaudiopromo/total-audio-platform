-- ========================================
-- Migration 1: Rename Teams → Workspaces (Cross-App Support)
-- ========================================
-- Purpose: Transform Tracker-specific teams into cross-app workspaces
-- that can be shared across Audio Intel, Pitch Generator, and Campaign Tracker
--
-- This migration is BACKWARD COMPATIBLE - existing Tracker data remains intact
-- ========================================

-- Step 1: Rename teams table → workspaces
ALTER TABLE IF EXISTS teams RENAME TO workspaces;

-- Step 2: Rename team_members table → workspace_members
ALTER TABLE IF EXISTS team_members RENAME TO workspace_members;

-- Step 3: Rename team_invitations table → workspace_invitations
ALTER TABLE IF EXISTS team_invitations RENAME TO workspace_invitations;

-- Step 4: Rename team_activity_log table → workspace_activity_log
ALTER TABLE IF EXISTS team_activity_log RENAME TO workspace_activity_log;

-- Step 5: Update foreign key column names in workspace_members
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'workspace_members' AND column_name = 'team_id'
  ) THEN
    ALTER TABLE workspace_members RENAME COLUMN team_id TO workspace_id;
  END IF;
END $$;

-- Step 6: Update foreign key column names in workspace_invitations
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'workspace_invitations' AND column_name = 'team_id'
  ) THEN
    ALTER TABLE workspace_invitations RENAME COLUMN team_id TO workspace_id;
  END IF;
END $$;

-- Step 7: Update foreign key column names in workspace_activity_log
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'workspace_activity_log' AND column_name = 'team_id'
  ) THEN
    ALTER TABLE workspace_activity_log RENAME COLUMN team_id TO workspace_id;
  END IF;
END $$;

-- Step 8: Rename campaigns.team_id → campaigns.workspace_id (if exists)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'campaigns' AND column_name = 'team_id'
  ) THEN
    ALTER TABLE campaigns RENAME COLUMN team_id TO workspace_id;
  END IF;
END $$;

-- Step 9: Add new cross-app columns to workspaces table
ALTER TABLE workspaces
ADD COLUMN IF NOT EXISTS apps_enabled TEXT[] DEFAULT '{"tracker"}',
ADD COLUMN IF NOT EXISTS workspace_type TEXT DEFAULT 'personal' CHECK (workspace_type IN ('personal', 'team', 'agency')),
ADD COLUMN IF NOT EXISTS app_permissions JSONB DEFAULT '{
  "intel": {"enabled": false, "features": []},
  "pitch": {"enabled": false, "features": []},
  "tracker": {"enabled": true, "features": ["campaigns", "contacts", "reports"]}
}'::jsonb;

-- Step 10: Update existing workspaces to set workspace_type based on plan_tier
UPDATE workspaces
SET workspace_type = CASE
  WHEN plan_tier = 'agency' THEN 'agency'
  WHEN plan_tier IN ('pro', 'premium') THEN 'team'
  ELSE 'personal'
END
WHERE workspace_type = 'personal'; -- Only update if still at default

-- Step 11: Create indexes for new columns
CREATE INDEX IF NOT EXISTS idx_workspaces_apps_enabled ON workspaces USING GIN (apps_enabled);
CREATE INDEX IF NOT EXISTS idx_workspaces_type ON workspaces(workspace_type);
CREATE INDEX IF NOT EXISTS idx_workspaces_permissions ON workspaces USING GIN (app_permissions);

-- Step 12: Update existing index names (rename team_* → workspace_*)
DO $$
BEGIN
  -- Rename team indexes to workspace indexes
  IF EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_teams_owner') THEN
    ALTER INDEX idx_teams_owner RENAME TO idx_workspaces_owner;
  END IF;

  IF EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_teams_slug') THEN
    ALTER INDEX idx_teams_slug RENAME TO idx_workspaces_slug;
  END IF;

  IF EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_team_members_team') THEN
    ALTER INDEX idx_team_members_team RENAME TO idx_workspace_members_workspace;
  END IF;

  IF EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_team_members_user') THEN
    ALTER INDEX idx_team_members_user RENAME TO idx_workspace_members_user;
  END IF;

  IF EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_team_invitations_team') THEN
    ALTER INDEX idx_team_invitations_team RENAME TO idx_workspace_invitations_workspace;
  END IF;

  IF EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_team_invitations_token') THEN
    ALTER INDEX idx_team_invitations_token RENAME TO idx_workspace_invitations_token;
  END IF;

  IF EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_activity_log_team') THEN
    ALTER INDEX idx_activity_log_team RENAME TO idx_workspace_activity_log_workspace;
  END IF;

  IF EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_activity_log_user') THEN
    ALTER INDEX idx_activity_log_user RENAME TO idx_workspace_activity_log_user;
  END IF;

  IF EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_campaigns_team') THEN
    ALTER INDEX idx_campaigns_team RENAME TO idx_campaigns_workspace;
  END IF;
END $$;

-- Step 13: Update RLS policy names (drop old, create new)
DROP POLICY IF EXISTS "Users can view their teams" ON workspaces;
DROP POLICY IF EXISTS "Team owners can update teams" ON workspaces;
DROP POLICY IF EXISTS "Anyone can create teams" ON workspaces;
DROP POLICY IF EXISTS "Users can view team members" ON workspace_members;
DROP POLICY IF EXISTS "Team admins can manage members" ON workspace_members;
DROP POLICY IF EXISTS "Team members can view activity" ON workspace_activity_log;
DROP POLICY IF EXISTS "Users can log activity" ON workspace_activity_log;

-- Create new workspace-specific RLS policies
CREATE POLICY "Users can view their workspaces" ON workspaces
  FOR SELECT
  USING (
    id IN (
      SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Workspace owners can update workspaces" ON workspaces
  FOR UPDATE
  USING (owner_id = auth.uid());

CREATE POLICY "Anyone can create workspaces" ON workspaces
  FOR INSERT
  WITH CHECK (owner_id = auth.uid());

CREATE POLICY "Users can view workspace members" ON workspace_members
  FOR SELECT
  USING (
    workspace_id IN (
      SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Workspace admins can manage members" ON workspace_members
  FOR ALL
  USING (
    workspace_id IN (
      SELECT workspace_id FROM workspace_members
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Workspace members can view activity" ON workspace_activity_log
  FOR SELECT
  USING (
    workspace_id IN (
      SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can log workspace activity" ON workspace_activity_log
  FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- Step 14: Update helper functions (rename team → workspace)
DROP FUNCTION IF EXISTS has_team_permission(UUID, UUID, VARCHAR);
CREATE OR REPLACE FUNCTION has_workspace_permission(
  p_workspace_id UUID,
  p_user_id UUID,
  p_required_role VARCHAR DEFAULT 'member'
)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM workspace_members
    WHERE workspace_id = p_workspace_id
      AND user_id = p_user_id
      AND (
        role = 'admin' OR
        (p_required_role = 'member' AND role IN ('admin', 'member'))
      )
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP FUNCTION IF EXISTS log_team_activity(UUID, UUID, VARCHAR, VARCHAR, UUID, JSONB);
CREATE OR REPLACE FUNCTION log_workspace_activity(
  p_workspace_id UUID,
  p_user_id UUID,
  p_action VARCHAR,
  p_resource_type VARCHAR DEFAULT NULL,
  p_resource_id UUID DEFAULT NULL,
  p_metadata JSONB DEFAULT '{}'
)
RETURNS UUID AS $$
DECLARE
  v_log_id UUID;
BEGIN
  INSERT INTO workspace_activity_log (workspace_id, user_id, action, resource_type, resource_id, metadata)
  VALUES (p_workspace_id, p_user_id, p_action, p_resource_type, p_resource_id, p_metadata)
  RETURNING id INTO v_log_id;

  RETURN v_log_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 15: Update trigger functions
DROP TRIGGER IF EXISTS teams_updated_at ON workspaces;
DROP FUNCTION IF EXISTS update_teams_updated_at();

CREATE OR REPLACE FUNCTION update_workspaces_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER workspaces_updated_at
  BEFORE UPDATE ON workspaces
  FOR EACH ROW
  EXECUTE FUNCTION update_workspaces_updated_at();

-- Step 16: Update table comments
COMMENT ON TABLE workspaces IS 'Cross-app workspaces supporting Intel, Pitch, and Tracker with multi-user access';
COMMENT ON TABLE workspace_members IS 'Workspace membership with role-based permissions across all apps';
COMMENT ON TABLE workspace_invitations IS 'Pending workspace invitations via email';
COMMENT ON TABLE workspace_activity_log IS 'Audit log of workspace actions across all apps for compliance';

COMMENT ON COLUMN workspaces.apps_enabled IS 'Array of enabled apps: intel, pitch, tracker';
COMMENT ON COLUMN workspaces.workspace_type IS 'Workspace type: personal (1 user), team (2-10 users), agency (10+ users)';
COMMENT ON COLUMN workspaces.app_permissions IS 'Granular permissions per app with enabled features';

-- ========================================
-- ROLLBACK SCRIPT (Run if migration needs to be reverted)
-- ========================================
-- ALTER TABLE workspaces RENAME TO teams;
-- ALTER TABLE workspace_members RENAME TO team_members;
-- ALTER TABLE workspace_invitations RENAME TO team_invitations;
-- ALTER TABLE workspace_activity_log RENAME TO team_activity_log;
--
-- ALTER TABLE workspace_members RENAME COLUMN workspace_id TO team_id;
-- ALTER TABLE workspace_invitations RENAME COLUMN workspace_id TO team_id;
-- ALTER TABLE workspace_activity_log RENAME COLUMN workspace_id TO team_id;
-- ALTER TABLE campaigns RENAME COLUMN workspace_id TO team_id;
--
-- ALTER TABLE teams DROP COLUMN IF EXISTS apps_enabled;
-- ALTER TABLE teams DROP COLUMN IF EXISTS workspace_type;
-- ALTER TABLE teams DROP COLUMN IF EXISTS app_permissions;
-- ========================================
