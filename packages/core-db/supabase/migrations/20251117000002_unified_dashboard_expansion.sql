-- ========================================
-- Migration: Unified Dashboard Intelligence Expansion
-- ========================================
-- Purpose: Add 7 new tables for multi-layer intelligence systems
-- Systems: Navigator, Correlation, Trajectory, Automations, Identity, Coverage, Benchmarking, Threads
-- ========================================

-- ========================================
-- IDENTITY KERNEL
-- ========================================

CREATE TABLE IF NOT EXISTS identity_kernel (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  artist_slug TEXT NOT NULL,
  brand_voice JSONB DEFAULT '{}',
  creative_profile JSONB DEFAULT '{}',
  narrative_profile JSONB DEFAULT '{}',
  scene_identity JSONB DEFAULT '{}',
  microgenre_map JSONB DEFAULT '{}',
  epk_fragments JSONB DEFAULT '{}',
  bio_short TEXT,
  bio_long TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(workspace_id, artist_slug)
);

-- ========================================
-- CORRELATION RESULTS
-- ========================================

CREATE TABLE IF NOT EXISTS correlation_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  artist_slug TEXT NOT NULL,
  analysis_window_days INT DEFAULT 90,
  correlations JSONB NOT NULL DEFAULT '{}',
  highlights JSONB DEFAULT '[]',
  patterns JSONB DEFAULT '[]',
  recommendations JSONB DEFAULT '[]',
  confidence_score NUMERIC(3,2) DEFAULT 0.5,
  data_points INT DEFAULT 0,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================
-- TRAJECTORY PREDICTIONS
-- ========================================

CREATE TABLE IF NOT EXISTS trajectory_predictions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  artist_slug TEXT NOT NULL,
  forecast_days INT DEFAULT 90,
  forecast JSONB NOT NULL DEFAULT '{}',
  confidence NUMERIC(3,2) DEFAULT 0.5,
  opportunity_windows JSONB DEFAULT '[]',
  risk_indicators JSONB DEFAULT '[]',
  projected_metrics JSONB DEFAULT '{}',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================
-- AUTOMATIONS HISTORY
-- ========================================

CREATE TABLE IF NOT EXISTS automations_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  action_type TEXT NOT NULL CHECK (action_type IN (
    'suggest_contacts',
    'fix_bottleneck',
    'generate_variations',
    'clean_segments',
    'detect_rot',
    'optimize_schedule',
    'other'
  )),
  payload JSONB DEFAULT '{}',
  result JSONB DEFAULT '{}',
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'success', 'failed')),
  execution_time_ms INT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================
-- COVERAGE FUSION TIMELINE
-- ========================================

CREATE TABLE IF NOT EXISTS coverage_fusion_timeline (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  artist_slug TEXT NOT NULL,
  country TEXT,
  city TEXT,
  region TEXT,
  event_type TEXT NOT NULL CHECK (event_type IN (
    'coverage',
    'campaign',
    'scene_event',
    'festival',
    'playlist_add',
    'airplay',
    'other'
  )),
  outlet_name TEXT,
  outlet_type TEXT,
  importance_score NUMERIC(3,2) DEFAULT 0.5,
  timestamp TIMESTAMPTZ NOT NULL,
  end_timestamp TIMESTAMPTZ,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  INDEX idx_coverage_fusion_workspace ON coverage_fusion_timeline(workspace_id),
  INDEX idx_coverage_fusion_artist ON coverage_fusion_timeline(artist_slug),
  INDEX idx_coverage_fusion_timestamp ON coverage_fusion_timeline(timestamp),
  INDEX idx_coverage_fusion_country ON coverage_fusion_timeline(country)
);

-- ========================================
-- BENCHMARK SNAPSHOTS
-- ========================================

CREATE TABLE IF NOT EXISTS benchmark_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  snapshot_date DATE NOT NULL,
  metrics JSONB NOT NULL DEFAULT '{}',
  artist_comparisons JSONB DEFAULT '[]',
  insights JSONB DEFAULT '[]',
  top_performers JSONB DEFAULT '[]',
  improvement_areas JSONB DEFAULT '[]',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(workspace_id, snapshot_date)
);

-- ========================================
-- SIGNAL THREADS
-- ========================================

CREATE TABLE IF NOT EXISTS signal_threads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  artist_slug TEXT NOT NULL,
  thread_type TEXT DEFAULT 'narrative' CHECK (thread_type IN (
    'narrative',
    'campaign',
    'creative',
    'scene',
    'performance'
  )),
  thread JSONB NOT NULL DEFAULT '{}',
  events JSONB DEFAULT '[]',
  milestones JSONB DEFAULT '[]',
  narrative_summary TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================
-- INDEXES
-- ========================================

CREATE INDEX IF NOT EXISTS idx_identity_kernel_workspace ON identity_kernel(workspace_id);
CREATE INDEX IF NOT EXISTS idx_identity_kernel_user ON identity_kernel(user_id);
CREATE INDEX IF NOT EXISTS idx_identity_kernel_artist ON identity_kernel(artist_slug);
CREATE INDEX IF NOT EXISTS idx_identity_kernel_updated ON identity_kernel(updated_at DESC);

CREATE INDEX IF NOT EXISTS idx_correlation_results_workspace ON correlation_results(workspace_id);
CREATE INDEX IF NOT EXISTS idx_correlation_results_user ON correlation_results(user_id);
CREATE INDEX IF NOT EXISTS idx_correlation_results_artist ON correlation_results(artist_slug);
CREATE INDEX IF NOT EXISTS idx_correlation_results_updated ON correlation_results(updated_at DESC);

CREATE INDEX IF NOT EXISTS idx_trajectory_predictions_workspace ON trajectory_predictions(workspace_id);
CREATE INDEX IF NOT EXISTS idx_trajectory_predictions_user ON trajectory_predictions(user_id);
CREATE INDEX IF NOT EXISTS idx_trajectory_predictions_artist ON trajectory_predictions(artist_slug);
CREATE INDEX IF NOT EXISTS idx_trajectory_predictions_created ON trajectory_predictions(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_automations_history_workspace ON automations_history(workspace_id);
CREATE INDEX IF NOT EXISTS idx_automations_history_user ON automations_history(user_id);
CREATE INDEX IF NOT EXISTS idx_automations_history_action_type ON automations_history(action_type);
CREATE INDEX IF NOT EXISTS idx_automations_history_created ON automations_history(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_benchmark_snapshots_workspace ON benchmark_snapshots(workspace_id);
CREATE INDEX IF NOT EXISTS idx_benchmark_snapshots_date ON benchmark_snapshots(snapshot_date DESC);

CREATE INDEX IF NOT EXISTS idx_signal_threads_workspace ON signal_threads(workspace_id);
CREATE INDEX IF NOT EXISTS idx_signal_threads_user ON signal_threads(user_id);
CREATE INDEX IF NOT EXISTS idx_signal_threads_artist ON signal_threads(artist_slug);
CREATE INDEX IF NOT EXISTS idx_signal_threads_type ON signal_threads(thread_type);
CREATE INDEX IF NOT EXISTS idx_signal_threads_updated ON signal_threads(updated_at DESC);

-- ========================================
-- ROW LEVEL SECURITY
-- ========================================

ALTER TABLE identity_kernel ENABLE ROW LEVEL SECURITY;
ALTER TABLE correlation_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE trajectory_predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE automations_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE coverage_fusion_timeline ENABLE ROW LEVEL SECURITY;
ALTER TABLE benchmark_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE signal_threads ENABLE ROW LEVEL SECURITY;

-- Identity Kernel RLS
CREATE POLICY "Users can view workspace identity kernels" ON identity_kernel
  FOR SELECT USING (
    workspace_id IN (
      SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage their identity kernels" ON identity_kernel
  FOR ALL USING (user_id = auth.uid());

-- Correlation Results RLS
CREATE POLICY "Users can view workspace correlations" ON correlation_results
  FOR SELECT USING (
    workspace_id IN (
      SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage their correlations" ON correlation_results
  FOR ALL USING (user_id = auth.uid());

-- Trajectory Predictions RLS
CREATE POLICY "Users can view workspace trajectories" ON trajectory_predictions
  FOR SELECT USING (
    workspace_id IN (
      SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage their trajectories" ON trajectory_predictions
  FOR ALL USING (user_id = auth.uid());

-- Automations History RLS
CREATE POLICY "Users can view workspace automations" ON automations_history
  FOR SELECT USING (
    workspace_id IN (
      SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create automations" ON automations_history
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- Coverage Fusion Timeline RLS
CREATE POLICY "Users can view workspace coverage" ON coverage_fusion_timeline
  FOR SELECT USING (
    workspace_id IN (
      SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage their coverage" ON coverage_fusion_timeline
  FOR ALL USING (user_id = auth.uid());

-- Benchmark Snapshots RLS
CREATE POLICY "Users can view workspace benchmarks" ON benchmark_snapshots
  FOR SELECT USING (
    workspace_id IN (
      SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Workspace admins can create benchmarks" ON benchmark_snapshots
  FOR INSERT WITH CHECK (
    workspace_id IN (
      SELECT workspace_id FROM workspace_members
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Signal Threads RLS
CREATE POLICY "Users can view workspace signal threads" ON signal_threads
  FOR SELECT USING (
    workspace_id IN (
      SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage their signal threads" ON signal_threads
  FOR ALL USING (user_id = auth.uid());

-- ========================================
-- TRIGGERS FOR UPDATED_AT
-- ========================================

CREATE TRIGGER identity_kernel_updated_at BEFORE UPDATE ON identity_kernel
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER correlation_results_updated_at BEFORE UPDATE ON correlation_results
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trajectory_predictions_updated_at BEFORE UPDATE ON trajectory_predictions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER signal_threads_updated_at BEFORE UPDATE ON signal_threads
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ========================================
-- COMMENTS
-- ========================================

COMMENT ON TABLE identity_kernel IS 'Artist identity profiles with brand voice, creative fingerprints, and narrative arcs';
COMMENT ON TABLE correlation_results IS 'Creative-to-campaign correlation analysis results';
COMMENT ON TABLE trajectory_predictions IS '90-day trajectory forecasts with opportunity windows and risk indicators';
COMMENT ON TABLE automations_history IS 'History of AI-powered automation executions';
COMMENT ON TABLE coverage_fusion_timeline IS 'Spatiotemporal coverage and campaign events for geo-timeline intelligence';
COMMENT ON TABLE benchmark_snapshots IS 'Workspace-wide artist performance comparison snapshots';
COMMENT ON TABLE signal_threads IS 'Narrative threads connecting campaigns, coverage, creative arcs, and scene signals';

-- ========================================
-- END MIGRATION
-- ========================================
