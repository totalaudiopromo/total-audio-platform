-- Skills System Migration
-- Total Audio Platform - Modular AI Capabilities
-- Created: 2025-10-17

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Skills registry: catalog of all available skills
CREATE TABLE IF NOT EXISTS skill (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Skill versions: manage multiple versions with semver
CREATE TABLE IF NOT EXISTS skill_version (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  skill_id UUID REFERENCES skill(id) ON DELETE CASCADE,
  version TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'deprecated')),
  manifest JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  deprecated_at TIMESTAMP WITH TIME ZONE,
  UNIQUE (skill_id, version)
);

-- Skill bindings: org/user-level skill enablement and configuration
CREATE TABLE IF NOT EXISTS skill_binding (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID NOT NULL,
  user_id UUID,
  skill_id UUID REFERENCES skill(id) ON DELETE CASCADE,
  version TEXT NOT NULL,
  enabled BOOLEAN NOT NULL DEFAULT true,
  config JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create unique index instead of constraint (handles NULL user_id properly)
CREATE UNIQUE INDEX idx_skill_binding_unique ON skill_binding (org_id, skill_id, COALESCE(user_id, '00000000-0000-0000-0000-000000000000'::UUID));

-- Skill invocations: audit trail for every skill execution
CREATE TABLE IF NOT EXISTS skill_invocation (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID NOT NULL,
  user_id UUID,
  skill_key TEXT NOT NULL,
  version TEXT NOT NULL,
  inputs JSONB NOT NULL,
  outputs JSONB,
  error TEXT,
  duration_ms INTEGER,
  tokens_used INTEGER,
  confidence NUMERIC(3,2),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Indexes for performance
CREATE INDEX idx_skill_key ON skill(key);
CREATE INDEX idx_skill_category ON skill(category);
CREATE INDEX idx_skill_version_status ON skill_version(status);
CREATE INDEX idx_skill_version_skill_id ON skill_version(skill_id);
CREATE INDEX idx_skill_binding_org_user ON skill_binding(org_id, user_id);
CREATE INDEX idx_skill_binding_enabled ON skill_binding(enabled) WHERE enabled = true;
CREATE INDEX idx_skill_invocation_org_created ON skill_invocation(org_id, created_at DESC);
CREATE INDEX idx_skill_invocation_skill_key ON skill_invocation(skill_key);

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at triggers
CREATE TRIGGER update_skill_updated_at BEFORE UPDATE ON skill
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_skill_binding_updated_at BEFORE UPDATE ON skill_binding
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) policies
ALTER TABLE skill ENABLE ROW LEVEL SECURITY;
ALTER TABLE skill_version ENABLE ROW LEVEL SECURITY;
ALTER TABLE skill_binding ENABLE ROW LEVEL SECURITY;
ALTER TABLE skill_invocation ENABLE ROW LEVEL SECURITY;

-- Skills are publicly readable (all users can see available skills)
CREATE POLICY "Skills are publicly readable"
  ON skill FOR SELECT
  USING (true);

-- Skill versions are publicly readable
CREATE POLICY "Skill versions are publicly readable"
  ON skill_version FOR SELECT
  USING (true);

-- Skill bindings are readable by org members
CREATE POLICY "Skill bindings readable by org members"
  ON skill_binding FOR SELECT
  USING (true); -- TODO: Add org membership check when auth system is integrated

-- Skill bindings writable by org admins
CREATE POLICY "Skill bindings writable by org admins"
  ON skill_binding FOR ALL
  USING (true); -- TODO: Add admin check when auth system is integrated

-- Skill invocations readable by org members
CREATE POLICY "Skill invocations readable by org members"
  ON skill_invocation FOR SELECT
  USING (true); -- TODO: Add org membership check when auth system is integrated

-- Insert writable by authenticated users
CREATE POLICY "Skill invocations writable by authenticated users"
  ON skill_invocation FOR INSERT
  WITH CHECK (true); -- TODO: Add authenticated user check

-- Seed initial skills
INSERT INTO skill (key, name, description, category, tags) VALUES
  ('brand_voice', 'Brand Voice Guardian', 'Ensures Total Audio''s authentic UK music industry insider tone across all communications', 'brand_voice', ARRAY['brand', 'voice', 'tone', 'consistency']),
  ('pitch_draft', 'Pitch Draft Generator', 'Generates music PR email pitches based on track metadata and contact profiles', 'pitch_generation', ARRAY['pitch', 'email', 'pr', 'music']),
  ('contact_enrichment', 'Contact Enrichment Engine', 'Transforms incomplete contact data into comprehensive verified profiles', 'contact_enrichment', ARRAY['contact', 'enrichment', 'intelligence', 'audio_intel']),
  ('follow_up', 'Follow-Up Generator', 'Creates contextual follow-up emails based on previous interactions', 'pitch_generation', ARRAY['follow-up', 'email', 'engagement']),
  ('contact_matcher', 'Contact Matcher', 'Matches tracks with relevant contacts using AI-powered analysis', 'analytics', ARRAY['matching', 'recommendations', 'targeting'])
ON CONFLICT (key) DO NOTHING;

-- Seed initial versions (using manifest from YAML files)
INSERT INTO skill_version (skill_id, version, status, manifest)
SELECT
  s.id,
  '1.0.0',
  'active',
  jsonb_build_object(
    'key', s.key,
    'name', s.name,
    'version', '1.0.0',
    'io', jsonb_build_object(
      'input_schema', jsonb_build_object('type', 'object'),
      'output_schema', jsonb_build_object('type', 'object')
    ),
    'tools', jsonb_build_array('llm'),
    'permissions', jsonb_build_object('llm', true, 'external_http', false),
    'observability', jsonb_build_object('log_level', 'info', 'emit_metrics', true)
  )
FROM skill s
ON CONFLICT (skill_id, version) DO NOTHING;

-- Comments for documentation
COMMENT ON TABLE skill IS 'Registry of all available skills in the Total Audio platform';
COMMENT ON TABLE skill_version IS 'Version history and manifests for each skill';
COMMENT ON TABLE skill_binding IS 'Per-org and per-user skill enablement and configuration';
COMMENT ON TABLE skill_invocation IS 'Audit trail of all skill executions with performance metrics';
