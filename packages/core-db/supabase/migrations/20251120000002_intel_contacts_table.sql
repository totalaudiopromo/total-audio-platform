-- ========================================
-- Migration 2: Intel Contacts Table (Audio Intel Workspace Storage)
-- ========================================
-- Purpose: Create persistent contact storage for Audio Intel with workspace support
-- Enables sharing enriched contacts across workspace members
-- ========================================

-- Step 1: Create intel_contacts table
CREATE TABLE IF NOT EXISTS intel_contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Core contact information (from enrichment)
  name VARCHAR(255) NOT NULL,
  role VARCHAR(255),
  outlet VARCHAR(255),
  email VARCHAR(255),
  phone VARCHAR(100),
  twitter VARCHAR(255),
  linkedin VARCHAR(255),

  -- Genre and targeting
  genre_tags TEXT[] DEFAULT '{}',

  -- Enrichment metadata
  enrichment_source VARCHAR(100), -- 'perplexity', 'manual', 'import', 'intel_agent'
  enrichment_confidence DECIMAL(3,2) CHECK (enrichment_confidence >= 0 AND enrichment_confidence <= 1),
  enrichment_data JSONB DEFAULT '{}', -- Raw enrichment response for audit

  -- User notes and categorization
  notes TEXT,
  tags TEXT[] DEFAULT '{}',
  preferred_tone VARCHAR(50), -- 'professional', 'friendly', 'casual', 'enthusiastic', 'direct'

  -- Activity tracking
  last_contacted TIMESTAMP WITH TIME ZONE,
  contact_count INTEGER DEFAULT 0,
  response_count INTEGER DEFAULT 0,

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),

  -- Constraints
  CONSTRAINT intel_contacts_workspace_email_unique UNIQUE (workspace_id, email)
);

-- Step 2: Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_intel_contacts_workspace ON intel_contacts(workspace_id);
CREATE INDEX IF NOT EXISTS idx_intel_contacts_created_by ON intel_contacts(created_by);
CREATE INDEX IF NOT EXISTS idx_intel_contacts_outlet ON intel_contacts(outlet);
CREATE INDEX IF NOT EXISTS idx_intel_contacts_email ON intel_contacts(email);
CREATE INDEX IF NOT EXISTS idx_intel_contacts_genre_tags ON intel_contacts USING GIN (genre_tags);
CREATE INDEX IF NOT EXISTS idx_intel_contacts_tags ON intel_contacts USING GIN (tags);
CREATE INDEX IF NOT EXISTS idx_intel_contacts_enrichment_source ON intel_contacts(enrichment_source);
CREATE INDEX IF NOT EXISTS idx_intel_contacts_created_at ON intel_contacts(created_at DESC);

-- Step 3: Enable Row Level Security
ALTER TABLE intel_contacts ENABLE ROW LEVEL SECURITY;

-- Step 4: RLS Policies - Users can view contacts in their workspaces
CREATE POLICY "Users can view intel_contacts in their workspaces" ON intel_contacts
  FOR SELECT
  USING (
    workspace_id IN (
      SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()
    )
  );

-- Step 5: RLS Policies - Users can insert contacts into their workspaces
CREATE POLICY "Users can create intel_contacts in their workspaces" ON intel_contacts
  FOR INSERT
  WITH CHECK (
    workspace_id IN (
      SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()
    )
    AND created_by = auth.uid()
  );

-- Step 6: RLS Policies - Users can update contacts they created or admin access
CREATE POLICY "Users can update intel_contacts they created" ON intel_contacts
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

-- Step 7: RLS Policies - Users can delete contacts they created or admin access
CREATE POLICY "Users can delete intel_contacts they created" ON intel_contacts
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

-- Step 8: Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_intel_contacts_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER intel_contacts_updated_at
  BEFORE UPDATE ON intel_contacts
  FOR EACH ROW
  EXECUTE FUNCTION update_intel_contacts_updated_at();

-- Step 9: Create helper function to increment contact count
CREATE OR REPLACE FUNCTION increment_intel_contact_count(
  p_contact_id UUID,
  p_is_response BOOLEAN DEFAULT false
)
RETURNS VOID AS $$
BEGIN
  UPDATE intel_contacts
  SET
    contact_count = contact_count + 1,
    response_count = CASE WHEN p_is_response THEN response_count + 1 ELSE response_count END,
    last_contacted = now()
  WHERE id = p_contact_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 10: Create helper function to get contact statistics by workspace
CREATE OR REPLACE FUNCTION get_workspace_intel_stats(p_workspace_id UUID)
RETURNS TABLE (
  total_contacts BIGINT,
  contacts_with_email BIGINT,
  contacts_with_phone BIGINT,
  contacts_with_social BIGINT,
  avg_enrichment_confidence DECIMAL,
  top_outlets TEXT[],
  top_genres TEXT[]
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(*)::BIGINT as total_contacts,
    COUNT(CASE WHEN email IS NOT NULL AND email != '' THEN 1 END)::BIGINT as contacts_with_email,
    COUNT(CASE WHEN phone IS NOT NULL AND phone != '' THEN 1 END)::BIGINT as contacts_with_phone,
    COUNT(CASE WHEN (twitter IS NOT NULL AND twitter != '') OR (linkedin IS NOT NULL AND linkedin != '') THEN 1 END)::BIGINT as contacts_with_social,
    AVG(enrichment_confidence) as avg_enrichment_confidence,
    ARRAY_AGG(DISTINCT outlet ORDER BY outlet)::TEXT[] as top_outlets,
    ARRAY_AGG(DISTINCT unnest(genre_tags))::TEXT[] as top_genres
  FROM intel_contacts
  WHERE workspace_id = p_workspace_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 11: Add table and column comments
COMMENT ON TABLE intel_contacts IS 'Enriched contact database for Audio Intel with workspace sharing';
COMMENT ON COLUMN intel_contacts.workspace_id IS 'Workspace that owns this contact (shared across workspace members)';
COMMENT ON COLUMN intel_contacts.created_by IS 'User who created/enriched this contact';
COMMENT ON COLUMN intel_contacts.enrichment_source IS 'Source of contact enrichment: perplexity, manual, import, intel_agent';
COMMENT ON COLUMN intel_contacts.enrichment_confidence IS 'Confidence score 0-1 from enrichment API';
COMMENT ON COLUMN intel_contacts.enrichment_data IS 'Raw JSON response from enrichment for audit trail';
COMMENT ON COLUMN intel_contacts.genre_tags IS 'Music genres this contact covers (for targeting)';
COMMENT ON COLUMN intel_contacts.tags IS 'User-defined tags for organization';
COMMENT ON COLUMN intel_contacts.preferred_tone IS 'Communication tone preference: professional, friendly, casual, enthusiastic, direct';
COMMENT ON COLUMN intel_contacts.contact_count IS 'Number of times this contact has been reached out to';
COMMENT ON COLUMN intel_contacts.response_count IS 'Number of responses received from this contact';

-- ========================================
-- ROLLBACK SCRIPT (Run if migration needs to be reverted)
-- ========================================
-- DROP TRIGGER IF EXISTS intel_contacts_updated_at ON intel_contacts;
-- DROP FUNCTION IF EXISTS update_intel_contacts_updated_at();
-- DROP FUNCTION IF EXISTS increment_intel_contact_count(UUID, BOOLEAN);
-- DROP FUNCTION IF EXISTS get_workspace_intel_stats(UUID);
-- DROP TABLE IF EXISTS intel_contacts CASCADE;
-- ========================================
