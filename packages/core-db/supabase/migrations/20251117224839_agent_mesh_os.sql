-- Agent Mesh OS: Multi-agent coordination, negotiation, and shared-memory orchestration layer
-- Connects all major intelligence subsystems across Total Audio

-- ============================================================================
-- 1. MESH AGENTS
-- ============================================================================
-- Registered agents with metadata and profiles
CREATE TABLE IF NOT EXISTS mesh_agents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  type text NOT NULL, -- strategist, creative, coach, analyst, observer, etc
  profile jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX idx_mesh_agents_name ON mesh_agents(name);
CREATE INDEX idx_mesh_agents_type ON mesh_agents(type);

-- ============================================================================
-- 2. MESH MESSAGES
-- ============================================================================
-- Persistent message bus for agent-to-agent communication
CREATE TABLE IF NOT EXISTS mesh_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_from text NOT NULL,
  agent_to text, -- null = broadcast
  message_type text NOT NULL,
  payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  workspace_id uuid REFERENCES workspaces(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_mesh_messages_from ON mesh_messages(agent_from);
CREATE INDEX idx_mesh_messages_to ON mesh_messages(agent_to);
CREATE INDEX idx_mesh_messages_type ON mesh_messages(message_type);
CREATE INDEX idx_mesh_messages_workspace ON mesh_messages(workspace_id);
CREATE INDEX idx_mesh_messages_created ON mesh_messages(created_at DESC);

-- ============================================================================
-- 3. MESH MEMORY (LONG-TERM)
-- ============================================================================
-- Long-term memory items (months)
CREATE TABLE IF NOT EXISTS mesh_memory_longterm (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_name text NOT NULL,
  key text NOT NULL,
  value jsonb NOT NULL,
  workspace_id uuid REFERENCES workspaces(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(agent_name, key, workspace_id)
);

CREATE INDEX idx_mesh_memory_lt_agent ON mesh_memory_longterm(agent_name);
CREATE INDEX idx_mesh_memory_lt_key ON mesh_memory_longterm(key);
CREATE INDEX idx_mesh_memory_lt_workspace ON mesh_memory_longterm(workspace_id);

-- ============================================================================
-- 4. MESH MEMORY (EPISODIC)
-- ============================================================================
-- Short-lived episodic events (1-7 days)
CREATE TABLE IF NOT EXISTS mesh_memory_episodic (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_name text NOT NULL,
  event_type text NOT NULL,
  payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  workspace_id uuid REFERENCES workspaces(id) ON DELETE CASCADE,
  expires_at timestamptz DEFAULT (now() + interval '7 days'),
  created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_mesh_memory_ep_agent ON mesh_memory_episodic(agent_name);
CREATE INDEX idx_mesh_memory_ep_type ON mesh_memory_episodic(event_type);
CREATE INDEX idx_mesh_memory_ep_workspace ON mesh_memory_episodic(workspace_id);
CREATE INDEX idx_mesh_memory_ep_expires ON mesh_memory_episodic(expires_at);
CREATE INDEX idx_mesh_memory_ep_created ON mesh_memory_episodic(created_at DESC);

-- ============================================================================
-- 5. MESH MEMORY (SHARED)
-- ============================================================================
-- Shared workspace memory across all agents
CREATE TABLE IF NOT EXISTS mesh_memory_shared (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text NOT NULL,
  value jsonb NOT NULL,
  source_agent text NOT NULL,
  workspace_id uuid REFERENCES workspaces(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(key, workspace_id)
);

CREATE INDEX idx_mesh_memory_sh_key ON mesh_memory_shared(key);
CREATE INDEX idx_mesh_memory_sh_source ON mesh_memory_shared(source_agent);
CREATE INDEX idx_mesh_memory_sh_workspace ON mesh_memory_shared(workspace_id);

-- ============================================================================
-- 6. MESH TEAMS
-- ============================================================================
-- Temporary micro-teams of agents working together
CREATE TABLE IF NOT EXISTS mesh_teams (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text,
  purpose text,
  agent_names text[] NOT NULL,
  state jsonb DEFAULT '{}'::jsonb,
  workspace_id uuid REFERENCES workspaces(id) ON DELETE CASCADE,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  dissolved_at timestamptz
);

CREATE INDEX idx_mesh_teams_workspace ON mesh_teams(workspace_id);
CREATE INDEX idx_mesh_teams_active ON mesh_teams(active);

-- ============================================================================
-- 7. MESH NEGOTIATIONS
-- ============================================================================
-- Agent negotiation sessions
CREATE TABLE IF NOT EXISTS mesh_negotiations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id uuid REFERENCES mesh_teams(id) ON DELETE CASCADE,
  topic text NOT NULL,
  initial_positions jsonb DEFAULT '{}'::jsonb,
  conversation jsonb[] DEFAULT ARRAY[]::jsonb[],
  outcome jsonb,
  status text DEFAULT 'in_progress', -- in_progress, converged, escalated
  workspace_id uuid REFERENCES workspaces(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  resolved_at timestamptz
);

CREATE INDEX idx_mesh_negotiations_team ON mesh_negotiations(team_id);
CREATE INDEX idx_mesh_negotiations_status ON mesh_negotiations(status);
CREATE INDEX idx_mesh_negotiations_workspace ON mesh_negotiations(workspace_id);

-- ============================================================================
-- 8. MESH REASONING LOG
-- ============================================================================
-- Log of mesh-level reasoning cycles
CREATE TABLE IF NOT EXISTS mesh_reasoning_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cycle_type text NOT NULL, -- opportunity, conflict, routine
  inputs jsonb NOT NULL,
  reasoning jsonb NOT NULL,
  outputs jsonb NOT NULL,
  workspace_id uuid REFERENCES workspaces(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_mesh_reasoning_type ON mesh_reasoning_log(cycle_type);
CREATE INDEX idx_mesh_reasoning_workspace ON mesh_reasoning_log(workspace_id);
CREATE INDEX idx_mesh_reasoning_created ON mesh_reasoning_log(created_at DESC);

-- ============================================================================
-- 9. ROW LEVEL SECURITY (RLS)
-- ============================================================================
-- All tables workspace-scoped

ALTER TABLE mesh_agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE mesh_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE mesh_memory_longterm ENABLE ROW LEVEL SECURITY;
ALTER TABLE mesh_memory_episodic ENABLE ROW LEVEL SECURITY;
ALTER TABLE mesh_memory_shared ENABLE ROW LEVEL SECURITY;
ALTER TABLE mesh_teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE mesh_negotiations ENABLE ROW LEVEL SECURITY;
ALTER TABLE mesh_reasoning_log ENABLE ROW LEVEL SECURITY;

-- mesh_agents policies (global, not workspace-scoped)
CREATE POLICY "Anyone can view mesh agents"
  ON mesh_agents FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Service role can manage agents"
  ON mesh_agents FOR ALL
  TO service_role
  USING (true);

-- mesh_messages policies
CREATE POLICY "Users can view messages in their workspace"
  ON mesh_messages FOR SELECT
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create messages in their workspace"
  ON mesh_messages FOR INSERT
  TO authenticated
  WITH CHECK (
    workspace_id IN (
      SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()
    )
  );

-- mesh_memory_longterm policies
CREATE POLICY "Users can view longterm memory in their workspace"
  ON mesh_memory_longterm FOR SELECT
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage longterm memory in their workspace"
  ON mesh_memory_longterm FOR ALL
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()
    )
  );

-- mesh_memory_episodic policies
CREATE POLICY "Users can view episodic memory in their workspace"
  ON mesh_memory_episodic FOR SELECT
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage episodic memory in their workspace"
  ON mesh_memory_episodic FOR ALL
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()
    )
  );

-- mesh_memory_shared policies
CREATE POLICY "Users can view shared memory in their workspace"
  ON mesh_memory_shared FOR SELECT
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage shared memory in their workspace"
  ON mesh_memory_shared FOR ALL
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()
    )
  );

-- mesh_teams policies
CREATE POLICY "Users can view teams in their workspace"
  ON mesh_teams FOR SELECT
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage teams in their workspace"
  ON mesh_teams FOR ALL
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()
    )
  );

-- mesh_negotiations policies
CREATE POLICY "Users can view negotiations in their workspace"
  ON mesh_negotiations FOR SELECT
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage negotiations in their workspace"
  ON mesh_negotiations FOR ALL
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()
    )
  );

-- mesh_reasoning_log policies
CREATE POLICY "Users can view reasoning log in their workspace"
  ON mesh_reasoning_log FOR SELECT
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create reasoning log entries in their workspace"
  ON mesh_reasoning_log FOR INSERT
  TO authenticated
  WITH CHECK (
    workspace_id IN (
      SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()
    )
  );

-- ============================================================================
-- 10. HELPER FUNCTIONS
-- ============================================================================
-- Update timestamp trigger
CREATE OR REPLACE FUNCTION update_mesh_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply update triggers
CREATE TRIGGER update_mesh_agents_updated_at
  BEFORE UPDATE ON mesh_agents
  FOR EACH ROW EXECUTE FUNCTION update_mesh_updated_at();

CREATE TRIGGER update_mesh_memory_lt_updated_at
  BEFORE UPDATE ON mesh_memory_longterm
  FOR EACH ROW EXECUTE FUNCTION update_mesh_updated_at();

CREATE TRIGGER update_mesh_memory_sh_updated_at
  BEFORE UPDATE ON mesh_memory_shared
  FOR EACH ROW EXECUTE FUNCTION update_mesh_updated_at();

-- Automatic episodic memory cleanup (removes expired entries)
CREATE OR REPLACE FUNCTION cleanup_expired_episodic_memory()
RETURNS void AS $$
BEGIN
  DELETE FROM mesh_memory_episodic WHERE expires_at < now();
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- 11. COMMENTS FOR DOCUMENTATION
-- ============================================================================
COMMENT ON TABLE mesh_agents IS 'Registered agents in the mesh with profiles and capabilities';
COMMENT ON TABLE mesh_messages IS 'Persistent message bus for agent-to-agent communication';
COMMENT ON TABLE mesh_memory_longterm IS 'Long-term agent memories (months)';
COMMENT ON TABLE mesh_memory_episodic IS 'Short-term episodic events (1-7 days, auto-expire)';
COMMENT ON TABLE mesh_memory_shared IS 'Shared workspace memory accessible to all agents';
COMMENT ON TABLE mesh_teams IS 'Temporary micro-teams of agents collaborating on tasks';
COMMENT ON TABLE mesh_negotiations IS 'Agent negotiation sessions and outcomes';
COMMENT ON TABLE mesh_reasoning_log IS 'Log of mesh-level cross-system reasoning cycles';
