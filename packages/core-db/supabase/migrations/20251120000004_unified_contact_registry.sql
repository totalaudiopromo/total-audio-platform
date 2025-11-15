-- ========================================
-- Migration 4: Unified Contact Registry (Cross-App Contact Linking)
-- ========================================
-- Purpose: Create a unified registry that links contacts across all apps
-- Enables sharing contact data between Intel, Pitch, and Tracker
--
-- Example: An intel_contact can be linked to a pitch contact and a tracker campaign_contact
-- ensuring data consistency and preventing duplicate contact management
-- ========================================

-- Step 1: Create unified contact registry table
CREATE TABLE IF NOT EXISTS workspace_contacts_registry (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,

  -- Canonical contact information (master record)
  canonical_email VARCHAR(255),
  canonical_name VARCHAR(255),
  canonical_role VARCHAR(255),
  canonical_outlet VARCHAR(255),

  -- Links to app-specific contact records (nullable - not all contacts exist in all apps)
  intel_contact_id UUID REFERENCES intel_contacts(id) ON DELETE SET NULL,
  pitch_contact_id UUID REFERENCES contacts(id) ON DELETE SET NULL,
  tracker_contact_id UUID, -- References tracker contacts table (when it exists)

  -- Metadata
  source_app VARCHAR(50) NOT NULL CHECK (source_app IN ('intel', 'pitch', 'tracker')),
  sync_status VARCHAR(50) DEFAULT 'synced' CHECK (sync_status IN ('synced', 'pending', 'conflict', 'error')),
  sync_metadata JSONB DEFAULT '{}',

  -- Contact activity aggregation across apps
  total_interactions INTEGER DEFAULT 0,
  last_interaction_at TIMESTAMP WITH TIME ZONE,
  last_synced_at TIMESTAMP WITH TIME ZONE DEFAULT now(),

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),

  -- Constraints
  CONSTRAINT workspace_contacts_registry_email_unique UNIQUE (workspace_id, canonical_email),
  CONSTRAINT at_least_one_contact_link CHECK (
    intel_contact_id IS NOT NULL OR
    pitch_contact_id IS NOT NULL OR
    tracker_contact_id IS NOT NULL
  )
);

-- Step 2: Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_registry_workspace ON workspace_contacts_registry(workspace_id);
CREATE INDEX IF NOT EXISTS idx_registry_email ON workspace_contacts_registry(canonical_email);
CREATE INDEX IF NOT EXISTS idx_registry_outlet ON workspace_contacts_registry(canonical_outlet);
CREATE INDEX IF NOT EXISTS idx_registry_source_app ON workspace_contacts_registry(source_app);
CREATE INDEX IF NOT EXISTS idx_registry_intel_contact ON workspace_contacts_registry(intel_contact_id);
CREATE INDEX IF NOT EXISTS idx_registry_pitch_contact ON workspace_contacts_registry(pitch_contact_id);
CREATE INDEX IF NOT EXISTS idx_registry_tracker_contact ON workspace_contacts_registry(tracker_contact_id);
CREATE INDEX IF NOT EXISTS idx_registry_last_interaction ON workspace_contacts_registry(last_interaction_at DESC);

-- Step 3: Enable Row Level Security
ALTER TABLE workspace_contacts_registry ENABLE ROW LEVEL SECURITY;

-- Step 4: RLS Policies - Users can view registry entries in their workspaces
CREATE POLICY "Users can view registry in their workspaces" ON workspace_contacts_registry
  FOR SELECT
  USING (
    workspace_id IN (
      SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()
    )
  );

-- Step 5: RLS Policies - Users can create registry entries in their workspaces
CREATE POLICY "Users can create registry in their workspaces" ON workspace_contacts_registry
  FOR INSERT
  WITH CHECK (
    workspace_id IN (
      SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()
    )
  );

-- Step 6: RLS Policies - Users can update registry entries in their workspaces
CREATE POLICY "Users can update registry in their workspaces" ON workspace_contacts_registry
  FOR UPDATE
  USING (
    workspace_id IN (
      SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()
    )
  );

-- Step 7: RLS Policies - Admins can delete registry entries
CREATE POLICY "Workspace admins can delete registry entries" ON workspace_contacts_registry
  FOR DELETE
  USING (
    workspace_id IN (
      SELECT workspace_id FROM workspace_members
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Step 8: Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_registry_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER registry_updated_at
  BEFORE UPDATE ON workspace_contacts_registry
  FOR EACH ROW
  EXECUTE FUNCTION update_registry_updated_at();

-- Step 9: Create function to sync intel_contact to registry
CREATE OR REPLACE FUNCTION sync_intel_contact_to_registry(p_intel_contact_id UUID)
RETURNS UUID AS $$
DECLARE
  v_registry_id UUID;
  v_workspace_id UUID;
  v_email TEXT;
  v_name TEXT;
  v_role TEXT;
  v_outlet TEXT;
BEGIN
  -- Get intel_contact details
  SELECT workspace_id, email, name, role, outlet
  INTO v_workspace_id, v_email, v_name, v_role, v_outlet
  FROM intel_contacts
  WHERE id = p_intel_contact_id;

  -- Check if registry entry exists
  SELECT id INTO v_registry_id
  FROM workspace_contacts_registry
  WHERE workspace_id = v_workspace_id
    AND canonical_email = v_email;

  IF v_registry_id IS NULL THEN
    -- Create new registry entry
    INSERT INTO workspace_contacts_registry (
      workspace_id,
      canonical_email,
      canonical_name,
      canonical_role,
      canonical_outlet,
      intel_contact_id,
      source_app
    )
    VALUES (
      v_workspace_id,
      v_email,
      v_name,
      v_role,
      v_outlet,
      p_intel_contact_id,
      'intel'
    )
    RETURNING id INTO v_registry_id;
  ELSE
    -- Update existing registry entry
    UPDATE workspace_contacts_registry
    SET
      intel_contact_id = p_intel_contact_id,
      canonical_name = COALESCE(v_name, canonical_name),
      canonical_role = COALESCE(v_role, canonical_role),
      canonical_outlet = COALESCE(v_outlet, canonical_outlet),
      last_synced_at = now()
    WHERE id = v_registry_id;
  END IF;

  RETURN v_registry_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 10: Create function to sync pitch contact to registry
CREATE OR REPLACE FUNCTION sync_pitch_contact_to_registry(p_pitch_contact_id UUID)
RETURNS UUID AS $$
DECLARE
  v_registry_id UUID;
  v_workspace_id UUID;
  v_email TEXT;
  v_name TEXT;
  v_role TEXT;
  v_outlet TEXT;
BEGIN
  -- Get pitch contact details
  SELECT workspace_id, email, name, role, outlet
  INTO v_workspace_id, v_email, v_name, v_role, v_outlet
  FROM contacts
  WHERE id = p_pitch_contact_id;

  -- Check if registry entry exists
  SELECT id INTO v_registry_id
  FROM workspace_contacts_registry
  WHERE workspace_id = v_workspace_id
    AND canonical_email = v_email;

  IF v_registry_id IS NULL THEN
    -- Create new registry entry
    INSERT INTO workspace_contacts_registry (
      workspace_id,
      canonical_email,
      canonical_name,
      canonical_role,
      canonical_outlet,
      pitch_contact_id,
      source_app
    )
    VALUES (
      v_workspace_id,
      v_email,
      v_name,
      v_role,
      v_outlet,
      p_pitch_contact_id,
      'pitch'
    )
    RETURNING id INTO v_registry_id;
  ELSE
    -- Update existing registry entry
    UPDATE workspace_contacts_registry
    SET
      pitch_contact_id = p_pitch_contact_id,
      canonical_name = COALESCE(v_name, canonical_name),
      canonical_role = COALESCE(v_role, canonical_role),
      canonical_outlet = COALESCE(v_outlet, canonical_outlet),
      last_synced_at = now()
    WHERE id = v_registry_id;
  END IF;

  RETURN v_registry_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 11: Create trigger to auto-sync intel_contacts to registry
CREATE OR REPLACE FUNCTION auto_sync_intel_contact_to_registry()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM sync_intel_contact_to_registry(NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER intel_contact_registry_sync
  AFTER INSERT OR UPDATE ON intel_contacts
  FOR EACH ROW
  WHEN (NEW.email IS NOT NULL AND NEW.email != '')
  EXECUTE FUNCTION auto_sync_intel_contact_to_registry();

-- Step 12: Create trigger to auto-sync pitch contacts to registry
CREATE OR REPLACE FUNCTION auto_sync_pitch_contact_to_registry()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM sync_pitch_contact_to_registry(NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER pitch_contact_registry_sync
  AFTER INSERT OR UPDATE ON contacts
  FOR EACH ROW
  WHEN (NEW.email IS NOT NULL AND NEW.email != '' AND NEW.workspace_id IS NOT NULL)
  EXECUTE FUNCTION auto_sync_pitch_contact_to_registry();

-- Step 13: Create function to get unified contact view (all apps merged)
CREATE OR REPLACE FUNCTION get_unified_contacts(p_workspace_id UUID)
RETURNS TABLE (
  registry_id UUID,
  email TEXT,
  name TEXT,
  role TEXT,
  outlet TEXT,
  source_apps TEXT[],
  intel_data JSONB,
  pitch_data JSONB,
  tracker_data JSONB,
  total_interactions INTEGER,
  last_interaction TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    r.id as registry_id,
    r.canonical_email as email,
    r.canonical_name as name,
    r.canonical_role as role,
    r.canonical_outlet as outlet,
    ARRAY_REMOVE(ARRAY[
      CASE WHEN r.intel_contact_id IS NOT NULL THEN 'intel' END,
      CASE WHEN r.pitch_contact_id IS NOT NULL THEN 'pitch' END,
      CASE WHEN r.tracker_contact_id IS NOT NULL THEN 'tracker' END
    ], NULL) as source_apps,
    CASE WHEN r.intel_contact_id IS NOT NULL THEN
      jsonb_build_object(
        'id', ic.id,
        'genre_tags', ic.genre_tags,
        'enrichment_source', ic.enrichment_source,
        'notes', ic.notes
      )
    END as intel_data,
    CASE WHEN r.pitch_contact_id IS NOT NULL THEN
      jsonb_build_object(
        'id', pc.id,
        'genre', pc.genre,
        'notes', pc.notes
      )
    END as pitch_data,
    NULL::JSONB as tracker_data, -- Placeholder for future tracker integration
    r.total_interactions,
    r.last_interaction_at as last_interaction
  FROM workspace_contacts_registry r
  LEFT JOIN intel_contacts ic ON r.intel_contact_id = ic.id
  LEFT JOIN contacts pc ON r.pitch_contact_id = pc.id
  WHERE r.workspace_id = p_workspace_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 14: Create function to detect contact conflicts (same email, different data)
CREATE OR REPLACE FUNCTION detect_contact_conflicts(p_workspace_id UUID)
RETURNS TABLE (
  email TEXT,
  intel_name TEXT,
  pitch_name TEXT,
  intel_outlet TEXT,
  pitch_outlet TEXT,
  conflict_fields TEXT[]
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    r.canonical_email,
    ic.name as intel_name,
    pc.name as pitch_name,
    ic.outlet as intel_outlet,
    pc.outlet as pitch_outlet,
    ARRAY_REMOVE(ARRAY[
      CASE WHEN ic.name != pc.name THEN 'name' END,
      CASE WHEN ic.outlet != pc.outlet THEN 'outlet' END,
      CASE WHEN ic.role != pc.role THEN 'role' END
    ], NULL) as conflict_fields
  FROM workspace_contacts_registry r
  INNER JOIN intel_contacts ic ON r.intel_contact_id = ic.id
  INNER JOIN contacts pc ON r.pitch_contact_id = pc.id
  WHERE r.workspace_id = p_workspace_id
    AND (ic.name != pc.name OR ic.outlet != pc.outlet OR ic.role != pc.role);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 15: Add table and column comments
COMMENT ON TABLE workspace_contacts_registry IS 'Unified registry linking contacts across Intel, Pitch, and Tracker apps';
COMMENT ON COLUMN workspace_contacts_registry.canonical_email IS 'Master email address for this contact across all apps';
COMMENT ON COLUMN workspace_contacts_registry.canonical_name IS 'Master name for this contact (resolved from conflicts)';
COMMENT ON COLUMN workspace_contacts_registry.intel_contact_id IS 'Link to Audio Intel enriched contact record';
COMMENT ON COLUMN workspace_contacts_registry.pitch_contact_id IS 'Link to Pitch Generator contact record';
COMMENT ON COLUMN workspace_contacts_registry.tracker_contact_id IS 'Link to Campaign Tracker contact record';
COMMENT ON COLUMN workspace_contacts_registry.source_app IS 'App where this contact was originally created';
COMMENT ON COLUMN workspace_contacts_registry.sync_status IS 'Sync status: synced, pending, conflict, error';
COMMENT ON COLUMN workspace_contacts_registry.total_interactions IS 'Aggregated interaction count across all apps';

-- ========================================
-- MANUAL SYNC STEPS (Run after deploying)
-- ========================================
-- 1. Sync all existing intel_contacts to registry:
--    SELECT sync_intel_contact_to_registry(id) FROM intel_contacts;
--
-- 2. Sync all existing pitch contacts to registry:
--    SELECT sync_pitch_contact_to_registry(id) FROM contacts WHERE workspace_id IS NOT NULL;
--
-- 3. Check for conflicts:
--    SELECT * FROM detect_contact_conflicts('[workspace_id]');
--
-- 4. View unified contacts:
--    SELECT * FROM get_unified_contacts('[workspace_id]');
-- ========================================

-- ========================================
-- ROLLBACK SCRIPT (Run if migration needs to be reverted)
-- ========================================
-- DROP TRIGGER IF EXISTS intel_contact_registry_sync ON intel_contacts;
-- DROP TRIGGER IF EXISTS pitch_contact_registry_sync ON contacts;
-- DROP TRIGGER IF EXISTS registry_updated_at ON workspace_contacts_registry;
--
-- DROP FUNCTION IF EXISTS update_registry_updated_at();
-- DROP FUNCTION IF EXISTS sync_intel_contact_to_registry(UUID);
-- DROP FUNCTION IF EXISTS sync_pitch_contact_to_registry(UUID);
-- DROP FUNCTION IF EXISTS auto_sync_intel_contact_to_registry();
-- DROP FUNCTION IF EXISTS auto_sync_pitch_contact_to_registry();
-- DROP FUNCTION IF EXISTS get_unified_contacts(UUID);
-- DROP FUNCTION IF EXISTS detect_contact_conflicts(UUID);
--
-- DROP TABLE IF EXISTS workspace_contacts_registry CASCADE;
-- ========================================
