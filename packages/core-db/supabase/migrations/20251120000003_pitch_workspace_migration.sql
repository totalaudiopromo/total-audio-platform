-- ========================================
-- Migration 3: Pitch Generator Workspace Migration
-- ========================================
-- Purpose: Add workspace support to Pitch Generator tables and migrate
-- existing TEXT user_id (email) data to workspace-based architecture
--
-- CRITICAL: This migration handles the user_id TYPE TEXT issue by:
-- 1. Adding workspace_id and created_by UUID columns
-- 2. Creating personal workspaces for existing users
-- 3. Migrating all data to workspaces while preserving user_id emails
-- ========================================

-- Step 1: Add workspace_id and created_by to contacts table
ALTER TABLE contacts
ADD COLUMN IF NOT EXISTS workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Step 2: Add workspace_id and created_by to pitches table
ALTER TABLE pitches
ADD COLUMN IF NOT EXISTS workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Step 3: Add workspace_id and created_by to pitch_templates table
ALTER TABLE pitch_templates
ADD COLUMN IF NOT EXISTS workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Step 4: Add workspace_id to user_pitch_settings table (no created_by needed - 1:1 with user)
ALTER TABLE user_pitch_settings
ADD COLUMN IF NOT EXISTS workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE;

-- Step 5: Create migration function to convert TEXT user_id to workspaces
CREATE OR REPLACE FUNCTION migrate_pitch_to_workspaces()
RETURNS TABLE (
  email TEXT,
  auth_user_id UUID,
  workspace_id UUID,
  contacts_migrated BIGINT,
  pitches_migrated BIGINT,
  templates_migrated BIGINT,
  settings_migrated BIGINT
) AS $$
DECLARE
  v_user_email TEXT;
  v_auth_user_id UUID;
  v_workspace_id UUID;
  v_workspace_slug TEXT;
  v_contacts_count BIGINT;
  v_pitches_count BIGINT;
  v_templates_count BIGINT;
  v_settings_count BIGINT;
BEGIN
  -- Loop through each unique user_id (email) in contacts table
  FOR v_user_email IN
    SELECT DISTINCT user_id FROM contacts WHERE workspace_id IS NULL
    UNION
    SELECT DISTINCT user_id FROM pitches WHERE workspace_id IS NULL
    UNION
    SELECT DISTINCT user_id FROM pitch_templates WHERE workspace_id IS NULL
    UNION
    SELECT DISTINCT user_id FROM user_pitch_settings WHERE workspace_id IS NULL
  LOOP
    -- Find matching auth.users UUID by email
    SELECT id INTO v_auth_user_id
    FROM auth.users
    WHERE email = v_user_email
    LIMIT 1;

    -- Skip if no matching auth user found
    IF v_auth_user_id IS NULL THEN
      RAISE NOTICE 'No auth.users found for email: %', v_user_email;
      CONTINUE;
    END IF;

    -- Check if user already has a personal workspace
    SELECT id INTO v_workspace_id
    FROM workspaces
    WHERE owner_id = v_auth_user_id
      AND workspace_type = 'personal'
    LIMIT 1;

    -- Create personal workspace if it doesn't exist
    IF v_workspace_id IS NULL THEN
      -- Generate unique slug from email (before @ symbol)
      v_workspace_slug := LOWER(SPLIT_PART(v_user_email, '@', 1));

      -- Ensure slug is unique by appending UUID if needed
      IF EXISTS (SELECT 1 FROM workspaces WHERE slug = v_workspace_slug) THEN
        v_workspace_slug := v_workspace_slug || '-' || SUBSTRING(gen_random_uuid()::TEXT, 1, 8);
      END IF;

      -- Create workspace
      INSERT INTO workspaces (name, slug, owner_id, workspace_type, apps_enabled, app_permissions)
      VALUES (
        'Personal Workspace',
        v_workspace_slug,
        v_auth_user_id,
        'personal',
        '{"pitch"}'::TEXT[],
        '{
          "intel": {"enabled": false, "features": []},
          "pitch": {"enabled": true, "features": ["contacts", "pitches", "templates", "integrations"]},
          "tracker": {"enabled": false, "features": []}
        }'::jsonb
      )
      RETURNING id INTO v_workspace_id;

      -- Add user as admin member of their own workspace
      INSERT INTO workspace_members (workspace_id, user_id, role)
      VALUES (v_workspace_id, v_auth_user_id, 'admin');
    END IF;

    -- Migrate contacts to workspace
    UPDATE contacts
    SET
      workspace_id = v_workspace_id,
      created_by = v_auth_user_id
    WHERE user_id = v_user_email
      AND workspace_id IS NULL;
    GET DIAGNOSTICS v_contacts_count = ROW_COUNT;

    -- Migrate pitches to workspace
    UPDATE pitches
    SET
      workspace_id = v_workspace_id,
      created_by = v_auth_user_id
    WHERE user_id = v_user_email
      AND workspace_id IS NULL;
    GET DIAGNOSTICS v_pitches_count = ROW_COUNT;

    -- Migrate pitch_templates to workspace
    UPDATE pitch_templates
    SET
      workspace_id = v_workspace_id,
      created_by = v_auth_user_id
    WHERE user_id = v_user_email
      AND workspace_id IS NULL;
    GET DIAGNOSTICS v_templates_count = ROW_COUNT;

    -- Migrate user_pitch_settings to workspace
    UPDATE user_pitch_settings
    SET workspace_id = v_workspace_id
    WHERE user_id = v_user_email
      AND workspace_id IS NULL;
    GET DIAGNOSTICS v_settings_count = ROW_COUNT;

    -- Log activity
    PERFORM log_workspace_activity(
      v_workspace_id,
      v_auth_user_id,
      'migrated_to_workspace',
      'pitch_data',
      NULL,
      jsonb_build_object(
        'contacts', v_contacts_count,
        'pitches', v_pitches_count,
        'templates', v_templates_count,
        'settings', v_settings_count
      )
    );

    -- Return migration summary
    RETURN QUERY SELECT
      v_user_email,
      v_auth_user_id,
      v_workspace_id,
      v_contacts_count,
      v_pitches_count,
      v_templates_count,
      v_settings_count;

  END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 6: Run the migration (idempotent - can be run multiple times)
-- Uncomment to execute migration:
-- SELECT * FROM migrate_pitch_to_workspaces();

-- Step 7: Create indexes for workspace_id on Pitch tables
CREATE INDEX IF NOT EXISTS idx_contacts_workspace ON contacts(workspace_id);
CREATE INDEX IF NOT EXISTS idx_contacts_created_by ON contacts(created_by);
CREATE INDEX IF NOT EXISTS idx_pitches_workspace ON pitches(workspace_id);
CREATE INDEX IF NOT EXISTS idx_pitches_created_by ON pitches(created_by);
CREATE INDEX IF NOT EXISTS idx_pitch_templates_workspace ON pitch_templates(workspace_id);
CREATE INDEX IF NOT EXISTS idx_pitch_templates_created_by ON pitch_templates(created_by);
CREATE INDEX IF NOT EXISTS idx_user_pitch_settings_workspace ON user_pitch_settings(workspace_id);

-- Step 8: Update RLS policies for contacts table
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their contacts" ON contacts;
DROP POLICY IF EXISTS "Users can create contacts" ON contacts;
DROP POLICY IF EXISTS "Users can update their contacts" ON contacts;
DROP POLICY IF EXISTS "Users can delete their contacts" ON contacts;

-- Workspace-based RLS for contacts
CREATE POLICY "Users can view contacts in their workspaces" ON contacts
  FOR SELECT
  USING (
    workspace_id IN (
      SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()
    )
    OR user_id = (SELECT email FROM auth.users WHERE id = auth.uid()) -- Backward compatibility
  );

CREATE POLICY "Users can create contacts in their workspaces" ON contacts
  FOR INSERT
  WITH CHECK (
    workspace_id IN (
      SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()
    )
    AND created_by = auth.uid()
  );

CREATE POLICY "Users can update contacts in their workspaces" ON contacts
  FOR UPDATE
  USING (
    workspace_id IN (
      SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()
    )
    AND (
      created_by = auth.uid()
      OR has_workspace_permission(workspace_id, auth.uid(), 'admin')
    )
  );

CREATE POLICY "Users can delete contacts in their workspaces" ON contacts
  FOR DELETE
  USING (
    workspace_id IN (
      SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()
    )
    AND (
      created_by = auth.uid()
      OR has_workspace_permission(workspace_id, auth.uid(), 'admin')
    )
  );

-- Step 9: Update RLS policies for pitches table
ALTER TABLE pitches ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their pitches" ON pitches;
DROP POLICY IF EXISTS "Users can create pitches" ON pitches;
DROP POLICY IF EXISTS "Users can update their pitches" ON pitches;
DROP POLICY IF EXISTS "Users can delete their pitches" ON pitches;

CREATE POLICY "Users can view pitches in their workspaces" ON pitches
  FOR SELECT
  USING (
    workspace_id IN (
      SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()
    )
    OR user_id = (SELECT email FROM auth.users WHERE id = auth.uid())
  );

CREATE POLICY "Users can create pitches in their workspaces" ON pitches
  FOR INSERT
  WITH CHECK (
    workspace_id IN (
      SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()
    )
    AND created_by = auth.uid()
  );

CREATE POLICY "Users can update pitches in their workspaces" ON pitches
  FOR UPDATE
  USING (
    workspace_id IN (
      SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()
    )
    AND (
      created_by = auth.uid()
      OR has_workspace_permission(workspace_id, auth.uid(), 'admin')
    )
  );

CREATE POLICY "Users can delete pitches in their workspaces" ON pitches
  FOR DELETE
  USING (
    workspace_id IN (
      SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()
    )
    AND (
      created_by = auth.uid()
      OR has_workspace_permission(workspace_id, auth.uid(), 'admin')
    )
  );

-- Step 10: Update RLS policies for pitch_templates table
ALTER TABLE pitch_templates ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their templates" ON pitch_templates;
DROP POLICY IF EXISTS "Users can create templates" ON pitch_templates;
DROP POLICY IF EXISTS "Users can update their templates" ON pitch_templates;
DROP POLICY IF EXISTS "Users can delete their templates" ON pitch_templates;

CREATE POLICY "Users can view templates in their workspaces" ON pitch_templates
  FOR SELECT
  USING (
    workspace_id IN (
      SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()
    )
    OR user_id = (SELECT email FROM auth.users WHERE id = auth.uid())
  );

CREATE POLICY "Users can create templates in their workspaces" ON pitch_templates
  FOR INSERT
  WITH CHECK (
    workspace_id IN (
      SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()
    )
    AND created_by = auth.uid()
  );

CREATE POLICY "Users can update templates in their workspaces" ON pitch_templates
  FOR UPDATE
  USING (
    workspace_id IN (
      SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()
    )
    AND (
      created_by = auth.uid()
      OR has_workspace_permission(workspace_id, auth.uid(), 'admin')
    )
  );

CREATE POLICY "Users can delete templates in their workspaces" ON pitch_templates
  FOR DELETE
  USING (
    workspace_id IN (
      SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()
    )
    AND (
      created_by = auth.uid()
      OR has_workspace_permission(workspace_id, auth.uid(), 'admin')
    )
  );

-- Step 11: Add table comments
COMMENT ON COLUMN contacts.workspace_id IS 'Workspace that owns this contact (shared across workspace members)';
COMMENT ON COLUMN contacts.created_by IS 'Auth user UUID who created this contact';
COMMENT ON COLUMN pitches.workspace_id IS 'Workspace that owns this pitch (shared across workspace members)';
COMMENT ON COLUMN pitches.created_by IS 'Auth user UUID who created this pitch';
COMMENT ON COLUMN pitch_templates.workspace_id IS 'Workspace that owns this template (shared across workspace members)';
COMMENT ON COLUMN pitch_templates.created_by IS 'Auth user UUID who created this template';
COMMENT ON COLUMN user_pitch_settings.workspace_id IS 'Default workspace for this user pitch settings';

-- ========================================
-- MANUAL MIGRATION STEPS (Run after deploying)
-- ========================================
-- 1. Execute migration function to migrate existing data:
--    SELECT * FROM migrate_pitch_to_workspaces();
--
-- 2. Verify migration results:
--    SELECT COUNT(*) FROM contacts WHERE workspace_id IS NOT NULL;
--    SELECT COUNT(*) FROM pitches WHERE workspace_id IS NOT NULL;
--    SELECT COUNT(*) FROM pitch_templates WHERE workspace_id IS NOT NULL;
--
-- 3. After verification, optionally set workspace_id to NOT NULL:
--    ALTER TABLE contacts ALTER COLUMN workspace_id SET NOT NULL;
--    ALTER TABLE pitches ALTER COLUMN workspace_id SET NOT NULL;
--    ALTER TABLE pitch_templates ALTER COLUMN workspace_id SET NOT NULL;
-- ========================================

-- ========================================
-- ROLLBACK SCRIPT (Run if migration needs to be reverted)
-- ========================================
-- DROP FUNCTION IF EXISTS migrate_pitch_to_workspaces();
--
-- ALTER TABLE contacts DROP COLUMN IF EXISTS workspace_id;
-- ALTER TABLE contacts DROP COLUMN IF EXISTS created_by;
-- ALTER TABLE pitches DROP COLUMN IF EXISTS workspace_id;
-- ALTER TABLE pitches DROP COLUMN IF EXISTS created_by;
-- ALTER TABLE pitch_templates DROP COLUMN IF EXISTS workspace_id;
-- ALTER TABLE pitch_templates DROP COLUMN IF EXISTS created_by;
-- ALTER TABLE user_pitch_settings DROP COLUMN IF EXISTS workspace_id;
--
-- DROP INDEX IF EXISTS idx_contacts_workspace;
-- DROP INDEX IF EXISTS idx_contacts_created_by;
-- DROP INDEX IF EXISTS idx_pitches_workspace;
-- DROP INDEX IF EXISTS idx_pitches_created_by;
-- DROP INDEX IF EXISTS idx_pitch_templates_workspace;
-- DROP INDEX IF EXISTS idx_pitch_templates_created_by;
-- DROP INDEX IF EXISTS idx_user_pitch_settings_workspace;
-- ========================================
