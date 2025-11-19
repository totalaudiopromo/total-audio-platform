-- =====================================================
-- GOLDEN VERIFY + TESTING INTEGRATION MIGRATION
-- =====================================================
-- Purpose: Store Golden Verify health checks and @total-audio/testing results
-- Date: 2025-11-11
-- Integration with: Command Centre Ops Console
-- =====================================================

-- =====================================================
-- TABLE: golden_history
-- Purpose: Store Golden Verify deployment health checks
-- =====================================================

CREATE TABLE IF NOT EXISTS public.golden_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Deployment metadata
  app TEXT NOT NULL CHECK (app IN ('audio-intel', 'tracker', 'pitch-generator', 'web', 'command-centre')),
  deployment_id TEXT,
  environment TEXT NOT NULL DEFAULT 'production' CHECK (environment IN ('production', 'preview', 'development')),
  deployed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

  -- Health check results
  health_status TEXT NOT NULL CHECK (health_status IN ('healthy', 'degraded', 'down')),
  tests_passed INTEGER NOT NULL DEFAULT 0 CHECK (tests_passed >= 0),
  tests_failed INTEGER NOT NULL DEFAULT 0 CHECK (tests_failed >= 0),
  uptime_percent NUMERIC(5,2) CHECK (uptime_percent >= 0 AND uptime_percent <= 100),

  -- Performance metrics (Lighthouse-style)
  lighthouse_performance INTEGER CHECK (lighthouse_performance >= 0 AND lighthouse_performance <= 100),
  lighthouse_accessibility INTEGER CHECK (lighthouse_accessibility >= 0 AND lighthouse_accessibility <= 100),
  lighthouse_best_practices INTEGER CHECK (lighthouse_best_practices >= 0 AND lighthouse_best_practices <= 100),
  lighthouse_seo INTEGER CHECK (lighthouse_seo >= 0 AND lighthouse_seo <= 100),

  -- Response time metrics
  avg_response_time_ms INTEGER CHECK (avg_response_time_ms >= 0),
  p95_response_time_ms INTEGER CHECK (p95_response_time_ms >= 0),

  -- Detailed results (JSON storage for flexibility)
  health_checks JSONB,
  metadata JSONB,

  -- Indexing
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

  -- Prevent duplicate entries for same deployment
  CONSTRAINT golden_history_unique_deployment UNIQUE (app, deployment_id, deployed_at)
);

-- Indexes for efficient queries
CREATE INDEX IF NOT EXISTS idx_golden_history_app_deployed ON public.golden_history (app, deployed_at DESC);
CREATE INDEX IF NOT EXISTS idx_golden_history_status ON public.golden_history (health_status);
CREATE INDEX IF NOT EXISTS idx_golden_history_environment ON public.golden_history (environment);
CREATE INDEX IF NOT EXISTS idx_golden_history_created_at ON public.golden_history (created_at DESC);

-- Comment for documentation
COMMENT ON TABLE public.golden_history IS
  'Stores Golden Verify deployment health check results. Populated by golden-intelligence.ts script after each deployment.';

-- =====================================================
-- TABLE: testing_results
-- Purpose: Store @total-audio/testing agent analysis results
-- =====================================================

CREATE TABLE IF NOT EXISTS public.testing_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Test metadata
  app TEXT NOT NULL CHECK (app IN ('audio-intel', 'tracker', 'pitch-generator', 'web', 'command-centre')),
  test_suite TEXT NOT NULL CHECK (test_suite IN ('component-analyzer', 'test-generator', 'cross-app-orchestrator', 'playwright-mobile')),
  component TEXT,
  file_path TEXT,

  -- Test execution results
  test_type TEXT NOT NULL CHECK (test_type IN ('responsive', 'accessibility', 'performance', 'touch-targets', 'integration')),
  passed BOOLEAN NOT NULL,
  duration_ms INTEGER CHECK (duration_ms >= 0),

  -- Issue tracking
  issues_found INTEGER NOT NULL DEFAULT 0 CHECK (issues_found >= 0),
  issues_fixed INTEGER NOT NULL DEFAULT 0 CHECK (issues_fixed >= 0),
  issues_data JSONB,

  -- Test details (JSON storage for flexibility)
  test_output JSONB,
  error_message TEXT,
  stack_trace TEXT,

  -- Metadata
  playwright_config JSONB,
  browser TEXT,
  viewport TEXT,

  -- Timestamps
  executed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for efficient queries
CREATE INDEX IF NOT EXISTS idx_testing_results_app_executed ON public.testing_results (app, executed_at DESC);
CREATE INDEX IF NOT EXISTS idx_testing_results_test_suite ON public.testing_results (test_suite);
CREATE INDEX IF NOT EXISTS idx_testing_results_passed ON public.testing_results (passed);
CREATE INDEX IF NOT EXISTS idx_testing_results_component ON public.testing_results (component);
CREATE INDEX IF NOT EXISTS idx_testing_results_created_at ON public.testing_results (created_at DESC);

-- Comment for documentation
COMMENT ON TABLE public.testing_results IS
  'Stores @total-audio/testing agent analysis results. Populated by testing agents (component-analyzer, test-generator, cross-app-orchestrator).';

-- =====================================================
-- HELPER VIEW: golden_summary
-- Purpose: Quick overview of recent Golden Verify results by app
-- =====================================================

CREATE OR REPLACE VIEW public.golden_summary AS
SELECT
  app,
  environment,
  COUNT(*) as total_deployments,
  SUM(CASE WHEN health_status = 'healthy' THEN 1 ELSE 0 END) as healthy_deployments,
  SUM(CASE WHEN health_status = 'degraded' THEN 1 ELSE 0 END) as degraded_deployments,
  SUM(CASE WHEN health_status = 'down' THEN 1 ELSE 0 END) as failed_deployments,
  AVG(lighthouse_performance) as avg_performance_score,
  AVG(lighthouse_accessibility) as avg_accessibility_score,
  AVG(tests_passed) as avg_tests_passed,
  AVG(tests_failed) as avg_tests_failed,
  MAX(deployed_at) as last_deployment
FROM public.golden_history
WHERE deployed_at > NOW() - INTERVAL '30 days'
GROUP BY app, environment
ORDER BY last_deployment DESC;

COMMENT ON VIEW public.golden_summary IS
  'Summary of Golden Verify results by app over the last 30 days.';

-- =====================================================
-- HELPER VIEW: testing_summary
-- Purpose: Quick overview of testing results by app and test type
-- =====================================================

CREATE OR REPLACE VIEW public.testing_summary AS
SELECT
  app,
  test_suite,
  test_type,
  COUNT(*) as total_tests,
  SUM(CASE WHEN passed THEN 1 ELSE 0 END) as tests_passed,
  SUM(CASE WHEN NOT passed THEN 1 ELSE 0 END) as tests_failed,
  ROUND((SUM(CASE WHEN passed THEN 1 ELSE 0 END)::NUMERIC / COUNT(*)::NUMERIC) * 100, 2) as pass_rate,
  SUM(issues_found) as total_issues_found,
  SUM(issues_fixed) as total_issues_fixed,
  AVG(duration_ms) as avg_duration_ms,
  MAX(executed_at) as last_execution
FROM public.testing_results
WHERE executed_at > NOW() - INTERVAL '30 days'
GROUP BY app, test_suite, test_type
ORDER BY last_execution DESC;

COMMENT ON VIEW public.testing_summary IS
  'Summary of testing results by app, suite, and test type over the last 30 days.';

-- =====================================================
-- HELPER FUNCTION: get_latest_golden_status
-- Purpose: Get latest Golden Verify status for all apps
-- =====================================================

CREATE OR REPLACE FUNCTION public.get_latest_golden_status()
RETURNS TABLE (
  app TEXT,
  health_status TEXT,
  tests_passed INTEGER,
  tests_failed INTEGER,
  lighthouse_performance INTEGER,
  deployed_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT DISTINCT ON (gh.app)
    gh.app,
    gh.health_status,
    gh.tests_passed,
    gh.tests_failed,
    gh.lighthouse_performance,
    gh.deployed_at
  FROM public.golden_history gh
  WHERE gh.environment = 'production'
  ORDER BY gh.app, gh.deployed_at DESC;
END;
$$ LANGUAGE plpgsql STABLE;

COMMENT ON FUNCTION public.get_latest_golden_status IS
  'Returns the latest Golden Verify status for each app in production.';

-- =====================================================
-- HELPER FUNCTION: get_testing_pass_rate
-- Purpose: Calculate overall testing pass rate by app
-- =====================================================

CREATE OR REPLACE FUNCTION public.get_testing_pass_rate(p_app TEXT DEFAULT NULL, p_days INTEGER DEFAULT 7)
RETURNS TABLE (
  app TEXT,
  total_tests BIGINT,
  tests_passed BIGINT,
  tests_failed BIGINT,
  pass_rate NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    tr.app,
    COUNT(*) as total_tests,
    SUM(CASE WHEN tr.passed THEN 1 ELSE 0 END) as tests_passed,
    SUM(CASE WHEN NOT tr.passed THEN 1 ELSE 0 END) as tests_failed,
    ROUND((SUM(CASE WHEN tr.passed THEN 1 ELSE 0 END)::NUMERIC / COUNT(*)::NUMERIC) * 100, 2) as pass_rate
  FROM public.testing_results tr
  WHERE tr.executed_at > NOW() - (p_days || ' days')::INTERVAL
    AND (p_app IS NULL OR tr.app = p_app)
  GROUP BY tr.app
  ORDER BY pass_rate DESC;
END;
$$ LANGUAGE plpgsql STABLE;

COMMENT ON FUNCTION public.get_testing_pass_rate IS
  'Calculates testing pass rate by app over a specified number of days. Pass NULL for all apps.';

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Enable RLS on both tables
ALTER TABLE public.golden_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testing_results ENABLE ROW LEVEL SECURITY;

-- Policy: Allow service role full access (for ingestion scripts)
DROP POLICY IF EXISTS service_role_all_golden_history ON public.golden_history;
CREATE POLICY service_role_all_golden_history
  ON public.golden_history
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS service_role_all_testing_results ON public.testing_results;
CREATE POLICY service_role_all_testing_results
  ON public.testing_results
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Policy: Allow authenticated users to view all Golden Verify results
DROP POLICY IF EXISTS users_view_golden_history ON public.golden_history;
CREATE POLICY users_view_golden_history
  ON public.golden_history
  FOR SELECT
  TO authenticated
  USING (true);

-- Policy: Allow authenticated users to view all testing results
DROP POLICY IF EXISTS users_view_testing_results ON public.testing_results;
CREATE POLICY users_view_testing_results
  ON public.testing_results
  FOR SELECT
  TO authenticated
  USING (true);

-- Policy: Admins can insert Golden Verify results (for manual testing)
DROP POLICY IF EXISTS admins_insert_golden_history ON public.golden_history;
CREATE POLICY admins_insert_golden_history
  ON public.golden_history
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE id = auth.uid()
      AND raw_user_meta_data->>'role' = 'admin'
    )
  );

-- Policy: Admins can insert testing results (for manual testing)
DROP POLICY IF EXISTS admins_insert_testing_results ON public.testing_results;
CREATE POLICY admins_insert_testing_results
  ON public.testing_results
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE id = auth.uid()
      AND raw_user_meta_data->>'role' = 'admin'
    )
  );

-- =====================================================
-- SAMPLE DATA (for testing UI before real integration)
-- =====================================================

-- Insert sample Golden Verify results
INSERT INTO public.golden_history (
  app, deployment_id, environment, health_status,
  tests_passed, tests_failed, uptime_percent,
  lighthouse_performance, lighthouse_accessibility, lighthouse_best_practices, lighthouse_seo,
  avg_response_time_ms, p95_response_time_ms,
  deployed_at
) VALUES
  ('audio-intel', 'dpl_test_001', 'production', 'healthy', 42, 0, 99.95, 95, 98, 92, 100, 120, 250, NOW() - INTERVAL '1 hour'),
  ('tracker', 'dpl_test_002', 'production', 'healthy', 38, 1, 99.90, 92, 96, 90, 98, 150, 300, NOW() - INTERVAL '2 hours'),
  ('pitch-generator', 'dpl_test_003', 'production', 'degraded', 35, 3, 98.50, 88, 94, 88, 95, 200, 450, NOW() - INTERVAL '3 hours'),
  ('audio-intel', 'dpl_test_004', 'production', 'healthy', 42, 0, 99.98, 96, 99, 93, 100, 110, 230, NOW() - INTERVAL '6 hours')
ON CONFLICT (app, deployment_id, deployed_at) DO NOTHING;

-- Insert sample testing results
INSERT INTO public.testing_results (
  app, test_suite, component, test_type, passed,
  issues_found, issues_fixed, duration_ms, executed_at
) VALUES
  ('audio-intel', 'component-analyzer', 'HeroDemo', 'responsive', true, 0, 0, 1250, NOW() - INTERVAL '30 minutes'),
  ('audio-intel', 'component-analyzer', 'DashboardCard', 'accessibility', true, 2, 2, 980, NOW() - INTERVAL '30 minutes'),
  ('tracker', 'playwright-mobile', 'CampaignCard', 'touch-targets', true, 0, 0, 2400, NOW() - INTERVAL '1 hour'),
  ('tracker', 'component-analyzer', 'MobileNav', 'responsive', false, 3, 0, 1100, NOW() - INTERVAL '1 hour'),
  ('pitch-generator', 'component-analyzer', 'PitchForm', 'performance', true, 1, 1, 1800, NOW() - INTERVAL '2 hours')
ON CONFLICT DO NOTHING;

-- =====================================================
-- MIGRATION COMPLETE
-- =====================================================

-- Verify tables were created successfully
DO $$
DECLARE
  v_golden_count INTEGER;
  v_testing_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO v_golden_count FROM public.golden_history;
  SELECT COUNT(*) INTO v_testing_count FROM public.testing_results;

  RAISE NOTICE '✅ Golden Verify + Testing integration migration complete';
  RAISE NOTICE '   - golden_history: % records (includes % sample records)', v_golden_count, v_golden_count;
  RAISE NOTICE '   - testing_results: % records (includes % sample records)', v_testing_count, v_testing_count;
  RAISE NOTICE '   - Helper views: 2 created (golden_summary, testing_summary)';
  RAISE NOTICE '   - Helper functions: 2 created (get_latest_golden_status, get_testing_pass_rate)';
  RAISE NOTICE '   - RLS policies: 6 created';
  RAISE NOTICE '   - Ready for Command Centre integration';
END $$;
