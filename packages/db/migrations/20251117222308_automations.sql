-- Marketing Automation Layer (MAL) Database Schema
-- Created: 2025-11-17
-- Purpose: Visual workflow builder and runtime engine for music marketing automations

-- ============================================================================
-- TABLE: automation_flows
-- Description: Workflow definitions
-- ============================================================================
CREATE TABLE IF NOT EXISTS automation_flows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  workspace_id UUID NULL,
  name TEXT NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT false,
  trigger_type TEXT NOT NULL CHECK (trigger_type IN ('event', 'schedule', 'manual')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Index for user queries
CREATE INDEX idx_automation_flows_user_id ON automation_flows(user_id);
CREATE INDEX idx_automation_flows_workspace_id ON automation_flows(workspace_id) WHERE workspace_id IS NOT NULL;
CREATE INDEX idx_automation_flows_active ON automation_flows(is_active) WHERE is_active = true;

-- ============================================================================
-- TABLE: automation_nodes
-- Description: Individual nodes (trigger, condition, action) in a flow
-- ============================================================================
CREATE TABLE IF NOT EXISTS automation_nodes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  flow_id UUID NOT NULL REFERENCES automation_flows(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('trigger', 'condition', 'action')),
  subtype TEXT NOT NULL,
  config JSONB NOT NULL DEFAULT '{}',
  position JSONB NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Index for flow queries
CREATE INDEX idx_automation_nodes_flow_id ON automation_nodes(flow_id);
CREATE INDEX idx_automation_nodes_type ON automation_nodes(type);

-- ============================================================================
-- TABLE: automation_edges
-- Description: Connections between nodes in a flow
-- ============================================================================
CREATE TABLE IF NOT EXISTS automation_edges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  flow_id UUID NOT NULL REFERENCES automation_flows(id) ON DELETE CASCADE,
  source_node_id UUID NOT NULL REFERENCES automation_nodes(id) ON DELETE CASCADE,
  target_node_id UUID NOT NULL REFERENCES automation_nodes(id) ON DELETE CASCADE,
  condition_label TEXT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes for graph traversal
CREATE INDEX idx_automation_edges_flow_id ON automation_edges(flow_id);
CREATE INDEX idx_automation_edges_source ON automation_edges(source_node_id);
CREATE INDEX idx_automation_edges_target ON automation_edges(target_node_id);

-- ============================================================================
-- TABLE: automation_executions
-- Description: Tracks individual workflow runs
-- ============================================================================
CREATE TABLE IF NOT EXISTS automation_executions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  flow_id UUID NOT NULL REFERENCES automation_flows(id) ON DELETE CASCADE,
  trigger_context JSONB NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('running', 'succeeded', 'failed', 'partial')),
  started_at TIMESTAMPTZ DEFAULT now(),
  finished_at TIMESTAMPTZ NULL,
  error TEXT NULL
);

-- Indexes for execution queries
CREATE INDEX idx_automation_executions_flow_id ON automation_executions(flow_id);
CREATE INDEX idx_automation_executions_status ON automation_executions(status);
CREATE INDEX idx_automation_executions_started_at ON automation_executions(started_at DESC);

-- ============================================================================
-- TABLE: automation_execution_steps
-- Description: Individual node executions within a workflow run
-- ============================================================================
CREATE TABLE IF NOT EXISTS automation_execution_steps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  execution_id UUID NOT NULL REFERENCES automation_executions(id) ON DELETE CASCADE,
  node_id UUID NOT NULL REFERENCES automation_nodes(id) ON DELETE CASCADE,
  status TEXT NOT NULL CHECK (status IN ('pending', 'running', 'succeeded', 'failed', 'skipped')),
  input JSONB NULL,
  output JSONB NULL,
  error TEXT NULL,
  started_at TIMESTAMPTZ NULL,
  finished_at TIMESTAMPTZ NULL
);

-- Indexes for step queries
CREATE INDEX idx_automation_execution_steps_execution_id ON automation_execution_steps(execution_id);
CREATE INDEX idx_automation_execution_steps_node_id ON automation_execution_steps(node_id);
CREATE INDEX idx_automation_execution_steps_status ON automation_execution_steps(status);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE automation_flows ENABLE ROW LEVEL SECURITY;
ALTER TABLE automation_nodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE automation_edges ENABLE ROW LEVEL SECURITY;
ALTER TABLE automation_executions ENABLE ROW LEVEL SECURITY;
ALTER TABLE automation_execution_steps ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- RLS POLICIES: automation_flows
-- ============================================================================

-- Users can view their own flows or flows in workspaces they belong to
CREATE POLICY automation_flows_select_policy ON automation_flows
  FOR SELECT
  USING (
    auth.uid() = user_id
    OR (
      workspace_id IS NOT NULL
      AND EXISTS (
        SELECT 1 FROM workspace_members
        WHERE workspace_members.workspace_id = automation_flows.workspace_id
        AND workspace_members.user_id = auth.uid()
      )
    )
  );

-- Users can insert their own flows
CREATE POLICY automation_flows_insert_policy ON automation_flows
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own flows or flows in workspaces they own/manage
CREATE POLICY automation_flows_update_policy ON automation_flows
  FOR UPDATE
  USING (
    auth.uid() = user_id
    OR (
      workspace_id IS NOT NULL
      AND EXISTS (
        SELECT 1 FROM workspace_members
        WHERE workspace_members.workspace_id = automation_flows.workspace_id
        AND workspace_members.user_id = auth.uid()
        AND workspace_members.role IN ('owner', 'admin')
      )
    )
  );

-- Users can delete their own flows or flows in workspaces they own/manage
CREATE POLICY automation_flows_delete_policy ON automation_flows
  FOR DELETE
  USING (
    auth.uid() = user_id
    OR (
      workspace_id IS NOT NULL
      AND EXISTS (
        SELECT 1 FROM workspace_members
        WHERE workspace_members.workspace_id = automation_flows.workspace_id
        AND workspace_members.user_id = auth.uid()
        AND workspace_members.role IN ('owner', 'admin')
      )
    )
  );

-- ============================================================================
-- RLS POLICIES: automation_nodes
-- ============================================================================

-- Users can view nodes of flows they have access to
CREATE POLICY automation_nodes_select_policy ON automation_nodes
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM automation_flows
      WHERE automation_flows.id = automation_nodes.flow_id
      AND (
        auth.uid() = automation_flows.user_id
        OR (
          automation_flows.workspace_id IS NOT NULL
          AND EXISTS (
            SELECT 1 FROM workspace_members
            WHERE workspace_members.workspace_id = automation_flows.workspace_id
            AND workspace_members.user_id = auth.uid()
          )
        )
      )
    )
  );

-- Users can insert nodes into flows they own
CREATE POLICY automation_nodes_insert_policy ON automation_nodes
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM automation_flows
      WHERE automation_flows.id = automation_nodes.flow_id
      AND (
        auth.uid() = automation_flows.user_id
        OR (
          automation_flows.workspace_id IS NOT NULL
          AND EXISTS (
            SELECT 1 FROM workspace_members
            WHERE workspace_members.workspace_id = automation_flows.workspace_id
            AND workspace_members.user_id = auth.uid()
            AND workspace_members.role IN ('owner', 'admin')
          )
        )
      )
    )
  );

-- Users can update nodes in flows they own
CREATE POLICY automation_nodes_update_policy ON automation_nodes
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM automation_flows
      WHERE automation_flows.id = automation_nodes.flow_id
      AND (
        auth.uid() = automation_flows.user_id
        OR (
          automation_flows.workspace_id IS NOT NULL
          AND EXISTS (
            SELECT 1 FROM workspace_members
            WHERE workspace_members.workspace_id = automation_flows.workspace_id
            AND workspace_members.user_id = auth.uid()
            AND workspace_members.role IN ('owner', 'admin')
          )
        )
      )
    )
  );

-- Users can delete nodes from flows they own
CREATE POLICY automation_nodes_delete_policy ON automation_nodes
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM automation_flows
      WHERE automation_flows.id = automation_nodes.flow_id
      AND (
        auth.uid() = automation_flows.user_id
        OR (
          automation_flows.workspace_id IS NOT NULL
          AND EXISTS (
            SELECT 1 FROM workspace_members
            WHERE workspace_members.workspace_id = automation_flows.workspace_id
            AND workspace_members.user_id = auth.uid()
            AND workspace_members.role IN ('owner', 'admin')
          )
        )
      )
    )
  );

-- ============================================================================
-- RLS POLICIES: automation_edges (same pattern as nodes)
-- ============================================================================

CREATE POLICY automation_edges_select_policy ON automation_edges
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM automation_flows
      WHERE automation_flows.id = automation_edges.flow_id
      AND (
        auth.uid() = automation_flows.user_id
        OR (
          automation_flows.workspace_id IS NOT NULL
          AND EXISTS (
            SELECT 1 FROM workspace_members
            WHERE workspace_members.workspace_id = automation_flows.workspace_id
            AND workspace_members.user_id = auth.uid()
          )
        )
      )
    )
  );

CREATE POLICY automation_edges_insert_policy ON automation_edges
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM automation_flows
      WHERE automation_flows.id = automation_edges.flow_id
      AND (
        auth.uid() = automation_flows.user_id
        OR (
          automation_flows.workspace_id IS NOT NULL
          AND EXISTS (
            SELECT 1 FROM workspace_members
            WHERE workspace_members.workspace_id = automation_flows.workspace_id
            AND workspace_members.user_id = auth.uid()
            AND workspace_members.role IN ('owner', 'admin')
          )
        )
      )
    )
  );

CREATE POLICY automation_edges_update_policy ON automation_edges
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM automation_flows
      WHERE automation_flows.id = automation_edges.flow_id
      AND (
        auth.uid() = automation_flows.user_id
        OR (
          automation_flows.workspace_id IS NOT NULL
          AND EXISTS (
            SELECT 1 FROM workspace_members
            WHERE workspace_members.workspace_id = automation_flows.workspace_id
            AND workspace_members.user_id = auth.uid()
            AND workspace_members.role IN ('owner', 'admin')
          )
        )
      )
    )
  );

CREATE POLICY automation_edges_delete_policy ON automation_edges
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM automation_flows
      WHERE automation_flows.id = automation_edges.flow_id
      AND (
        auth.uid() = automation_flows.user_id
        OR (
          automation_flows.workspace_id IS NOT NULL
          AND EXISTS (
            SELECT 1 FROM workspace_members
            WHERE workspace_members.workspace_id = automation_flows.workspace_id
            AND workspace_members.user_id = auth.uid()
            AND workspace_members.role IN ('owner', 'admin')
          )
        )
      )
    )
  );

-- ============================================================================
-- RLS POLICIES: automation_executions
-- ============================================================================

CREATE POLICY automation_executions_select_policy ON automation_executions
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM automation_flows
      WHERE automation_flows.id = automation_executions.flow_id
      AND (
        auth.uid() = automation_flows.user_id
        OR (
          automation_flows.workspace_id IS NOT NULL
          AND EXISTS (
            SELECT 1 FROM workspace_members
            WHERE workspace_members.workspace_id = automation_flows.workspace_id
            AND workspace_members.user_id = auth.uid()
          )
        )
      )
    )
  );

-- Only the system (via service role) can insert executions
-- Users cannot manually create executions
CREATE POLICY automation_executions_insert_policy ON automation_executions
  FOR INSERT
  WITH CHECK (false);

-- No user updates to executions (managed by runtime only)
CREATE POLICY automation_executions_update_policy ON automation_executions
  FOR UPDATE
  USING (false);

-- Users can delete execution history for flows they own
CREATE POLICY automation_executions_delete_policy ON automation_executions
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM automation_flows
      WHERE automation_flows.id = automation_executions.flow_id
      AND (
        auth.uid() = automation_flows.user_id
        OR (
          automation_flows.workspace_id IS NOT NULL
          AND EXISTS (
            SELECT 1 FROM workspace_members
            WHERE workspace_members.workspace_id = automation_flows.workspace_id
            AND workspace_members.user_id = auth.uid()
            AND workspace_members.role IN ('owner', 'admin')
          )
        )
      )
    )
  );

-- ============================================================================
-- RLS POLICIES: automation_execution_steps
-- ============================================================================

CREATE POLICY automation_execution_steps_select_policy ON automation_execution_steps
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM automation_executions
      JOIN automation_flows ON automation_flows.id = automation_executions.flow_id
      WHERE automation_executions.id = automation_execution_steps.execution_id
      AND (
        auth.uid() = automation_flows.user_id
        OR (
          automation_flows.workspace_id IS NOT NULL
          AND EXISTS (
            SELECT 1 FROM workspace_members
            WHERE workspace_members.workspace_id = automation_flows.workspace_id
            AND workspace_members.user_id = auth.uid()
          )
        )
      )
    )
  );

-- Only system can create/update execution steps
CREATE POLICY automation_execution_steps_insert_policy ON automation_execution_steps
  FOR INSERT
  WITH CHECK (false);

CREATE POLICY automation_execution_steps_update_policy ON automation_execution_steps
  FOR UPDATE
  USING (false);

CREATE POLICY automation_execution_steps_delete_policy ON automation_execution_steps
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM automation_executions
      JOIN automation_flows ON automation_flows.id = automation_executions.flow_id
      WHERE automation_executions.id = automation_execution_steps.execution_id
      AND (
        auth.uid() = automation_flows.user_id
        OR (
          automation_flows.workspace_id IS NOT NULL
          AND EXISTS (
            SELECT 1 FROM workspace_members
            WHERE workspace_members.workspace_id = automation_flows.workspace_id
            AND workspace_members.user_id = auth.uid()
            AND workspace_members.role IN ('owner', 'admin')
          )
        )
      )
    )
  );

-- ============================================================================
-- FUNCTIONS
-- ============================================================================

-- Trigger function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_automation_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply update trigger to flows and nodes
CREATE TRIGGER automation_flows_updated_at
  BEFORE UPDATE ON automation_flows
  FOR EACH ROW
  EXECUTE FUNCTION update_automation_updated_at();

CREATE TRIGGER automation_nodes_updated_at
  BEFORE UPDATE ON automation_nodes
  FOR EACH ROW
  EXECUTE FUNCTION update_automation_updated_at();

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON TABLE automation_flows IS 'Marketing automation workflow definitions';
COMMENT ON TABLE automation_nodes IS 'Individual nodes (trigger, condition, action) in automation workflows';
COMMENT ON TABLE automation_edges IS 'Connections between nodes in automation workflows';
COMMENT ON TABLE automation_executions IS 'Execution history of automation workflows';
COMMENT ON TABLE automation_execution_steps IS 'Individual node execution records within workflow runs';
