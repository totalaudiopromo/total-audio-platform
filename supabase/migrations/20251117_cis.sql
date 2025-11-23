-- Creative Intelligence Studio (CIS) Database Schema
-- Migration: 20251117_cis.sql
-- Purpose: Create tables for creative workspace, artifacts, and AI-powered creative tools

-- =============================================================================
-- TABLE: cis_projects
-- Description: Main creative projects (cover art, moodboards, brand kits, etc.)
-- =============================================================================
CREATE TABLE IF NOT EXISTS cis_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN (
    'cover_art',
    'moodboard',
    'brand_kit',
    'storyboard',
    'content_hooks',
    'trailer_script'
  )),
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index for user queries
CREATE INDEX IF NOT EXISTS idx_cis_projects_user_id ON cis_projects(user_id);
CREATE INDEX IF NOT EXISTS idx_cis_projects_type ON cis_projects(type);
CREATE INDEX IF NOT EXISTS idx_cis_projects_updated_at ON cis_projects(updated_at DESC);

-- RLS policies for cis_projects
ALTER TABLE cis_projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own projects"
  ON cis_projects FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own projects"
  ON cis_projects FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own projects"
  ON cis_projects FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own projects"
  ON cis_projects FOR DELETE
  USING (auth.uid() = user_id);

-- =============================================================================
-- TABLE: cis_artifacts
-- Description: Generated creative outputs (images, videos, PDFs, palettes)
-- =============================================================================
CREATE TABLE IF NOT EXISTS cis_artifacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES cis_projects(id) ON DELETE CASCADE,
  artifact_type TEXT NOT NULL CHECK (artifact_type IN (
    'image',
    'video',
    'pdf',
    'palette',
    'script',
    'moodboard'
  )),
  url TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index for project queries
CREATE INDEX IF NOT EXISTS idx_cis_artifacts_project_id ON cis_artifacts(project_id);
CREATE INDEX IF NOT EXISTS idx_cis_artifacts_type ON cis_artifacts(artifact_type);
CREATE INDEX IF NOT EXISTS idx_cis_artifacts_created_at ON cis_artifacts(created_at DESC);

-- RLS policies for cis_artifacts
ALTER TABLE cis_artifacts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view artifacts from own projects"
  ON cis_artifacts FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM cis_projects
      WHERE cis_projects.id = cis_artifacts.project_id
      AND cis_projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create artifacts for own projects"
  ON cis_artifacts FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM cis_projects
      WHERE cis_projects.id = cis_artifacts.project_id
      AND cis_projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update artifacts from own projects"
  ON cis_artifacts FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM cis_projects
      WHERE cis_projects.id = cis_artifacts.project_id
      AND cis_projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete artifacts from own projects"
  ON cis_artifacts FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM cis_projects
      WHERE cis_projects.id = cis_artifacts.project_id
      AND cis_projects.user_id = auth.uid()
    )
  );

-- =============================================================================
-- TABLE: cis_elements
-- Description: Individual items inside moodboards, brand kits, storyboards
-- =============================================================================
CREATE TABLE IF NOT EXISTS cis_elements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES cis_projects(id) ON DELETE CASCADE,
  element_type TEXT NOT NULL CHECK (element_type IN (
    'image',
    'text',
    'color',
    'reference',
    'block'
  )),
  content JSONB NOT NULL DEFAULT '{}'::jsonb,
  position JSONB DEFAULT '{"x": 0, "y": 0, "w": 100, "h": 100}'::jsonb,
  ordering INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes for project queries and ordering
CREATE INDEX IF NOT EXISTS idx_cis_elements_project_id ON cis_elements(project_id);
CREATE INDEX IF NOT EXISTS idx_cis_elements_ordering ON cis_elements(project_id, ordering);
CREATE INDEX IF NOT EXISTS idx_cis_elements_type ON cis_elements(element_type);

-- RLS policies for cis_elements
ALTER TABLE cis_elements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view elements from own projects"
  ON cis_elements FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM cis_projects
      WHERE cis_projects.id = cis_elements.project_id
      AND cis_projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create elements for own projects"
  ON cis_elements FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM cis_projects
      WHERE cis_projects.id = cis_elements.project_id
      AND cis_projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update elements from own projects"
  ON cis_elements FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM cis_projects
      WHERE cis_projects.id = cis_elements.project_id
      AND cis_projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete elements from own projects"
  ON cis_elements FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM cis_projects
      WHERE cis_projects.id = cis_elements.project_id
      AND cis_projects.user_id = auth.uid()
    )
  );

-- =============================================================================
-- TABLE: cis_ai_cache
-- Description: Caching layer for creative intelligence suggestions
-- =============================================================================
CREATE TABLE IF NOT EXISTS cis_ai_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  key TEXT NOT NULL,
  result JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at TIMESTAMPTZ NOT NULL DEFAULT (now() + interval '7 days')
);

-- Index for cache lookups
CREATE UNIQUE INDEX IF NOT EXISTS idx_cis_ai_cache_user_key ON cis_ai_cache(user_id, key);
CREATE INDEX IF NOT EXISTS idx_cis_ai_cache_expires_at ON cis_ai_cache(expires_at);

-- RLS policies for cis_ai_cache
ALTER TABLE cis_ai_cache ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own cache"
  ON cis_ai_cache FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own cache"
  ON cis_ai_cache FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own cache"
  ON cis_ai_cache FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own cache"
  ON cis_ai_cache FOR DELETE
  USING (auth.uid() = user_id);

-- =============================================================================
-- TRIGGERS
-- =============================================================================

-- Auto-update updated_at timestamp for cis_projects
CREATE OR REPLACE FUNCTION update_cis_projects_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_cis_projects_updated_at
  BEFORE UPDATE ON cis_projects
  FOR EACH ROW
  EXECUTE FUNCTION update_cis_projects_updated_at();

-- =============================================================================
-- STORAGE BUCKET (via SQL)
-- =============================================================================
-- Note: This creates the bucket reference. Actual storage policies set via Supabase dashboard
INSERT INTO storage.buckets (id, name, public)
VALUES ('cis_assets', 'cis_assets', false)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for cis_assets bucket
CREATE POLICY "Users can upload own CIS assets"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'cis_assets'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can view own CIS assets"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'cis_assets'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can update own CIS assets"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'cis_assets'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can delete own CIS assets"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'cis_assets'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- =============================================================================
-- COMMENTS
-- =============================================================================
COMMENT ON TABLE cis_projects IS 'Creative projects created in the Creative Intelligence Studio';
COMMENT ON TABLE cis_artifacts IS 'Generated creative outputs (images, PDFs, videos, palettes)';
COMMENT ON TABLE cis_elements IS 'Individual elements within creative projects (canvas items)';
COMMENT ON TABLE cis_ai_cache IS 'Cached AI-generated creative suggestions';
