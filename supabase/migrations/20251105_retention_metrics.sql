-- =====================================================
-- RETENTION METRICS MIGRATION
-- =====================================================
-- Phase 8: Revenue Validation & Growth Automation
-- Purpose: Track user cohorts and retention metrics
-- Date: 2025-11-05
-- =====================================================

-- =====================================================
-- TABLE: user_cohorts
-- Purpose: Assign each user to their signup cohort
-- =====================================================

CREATE TABLE IF NOT EXISTS public.user_cohorts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  cohort_date DATE NOT NULL,
  cohort_week INTEGER NOT NULL,
  cohort_month INTEGER NOT NULL,
  cohort_year INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

  -- Ensure each user appears in only one cohort
  CONSTRAINT user_cohorts_user_id_unique UNIQUE (user_id)
);

-- Index for fast cohort lookups
CREATE INDEX IF NOT EXISTS idx_user_cohorts_cohort_date
  ON public.user_cohorts (cohort_date);

CREATE INDEX IF NOT EXISTS idx_user_cohorts_cohort_month
  ON public.user_cohorts (cohort_year, cohort_month);

CREATE INDEX IF NOT EXISTS idx_user_cohorts_cohort_week
  ON public.user_cohorts (cohort_year, cohort_week);

-- Comment for documentation
COMMENT ON TABLE public.user_cohorts IS
  'Stores user cohort assignments based on signup date. Each user belongs to exactly one cohort.';

-- =====================================================
-- TABLE: retention_metrics
-- Purpose: Store pre-calculated retention rates
-- =====================================================

CREATE TABLE IF NOT EXISTS public.retention_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cohort_date DATE NOT NULL,
  period_type TEXT NOT NULL CHECK (period_type IN ('day', 'week', 'month')),
  period_offset INTEGER NOT NULL CHECK (period_offset >= 0),
  total_users INTEGER NOT NULL CHECK (total_users >= 0),
  retained_users INTEGER NOT NULL CHECK (retained_users >= 0),
  retention_rate NUMERIC(5,2) NOT NULL CHECK (retention_rate >= 0 AND retention_rate <= 100),
  revenue_cents INTEGER DEFAULT 0 CHECK (revenue_cents >= 0),
  calculated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

  -- Prevent duplicate retention calculations
  CONSTRAINT retention_metrics_unique
    UNIQUE (cohort_date, period_type, period_offset)
);

-- Composite index for efficient cohort queries
CREATE INDEX IF NOT EXISTS idx_retention_metrics_cohort_period
  ON public.retention_metrics (cohort_date, period_type, period_offset);

CREATE INDEX IF NOT EXISTS idx_retention_metrics_period_type
  ON public.retention_metrics (period_type);

-- Index for revenue analysis
CREATE INDEX IF NOT EXISTS idx_retention_metrics_revenue
  ON public.retention_metrics (revenue_cents)
  WHERE revenue_cents > 0;

-- Comment for documentation
COMMENT ON TABLE public.retention_metrics IS
  'Pre-calculated retention metrics by cohort. Refreshed by cohort-refresh script.';

-- =====================================================
-- HELPER FUNCTION: assign_user_to_cohort
-- Purpose: Assign a user to their cohort on signup
-- =====================================================

CREATE OR REPLACE FUNCTION public.assign_user_to_cohort(p_user_id UUID, p_signup_date TIMESTAMP WITH TIME ZONE)
RETURNS VOID AS $$
DECLARE
  v_cohort_date DATE;
  v_cohort_week INTEGER;
  v_cohort_month INTEGER;
  v_cohort_year INTEGER;
BEGIN
  -- Extract cohort components from signup date
  v_cohort_date := DATE(p_signup_date);
  v_cohort_week := EXTRACT(WEEK FROM p_signup_date)::INTEGER;
  v_cohort_month := EXTRACT(MONTH FROM p_signup_date)::INTEGER;
  v_cohort_year := EXTRACT(YEAR FROM p_signup_date)::INTEGER;

  -- Insert cohort assignment (idempotent - ON CONFLICT DO NOTHING)
  INSERT INTO public.user_cohorts (
    user_id,
    cohort_date,
    cohort_week,
    cohort_month,
    cohort_year
  )
  VALUES (
    p_user_id,
    v_cohort_date,
    v_cohort_week,
    v_cohort_month,
    v_cohort_year
  )
  ON CONFLICT (user_id) DO NOTHING;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Comment for documentation
COMMENT ON FUNCTION public.assign_user_to_cohort IS
  'Assigns a user to their signup cohort. Idempotent - safe to call multiple times.';

-- =====================================================
-- HELPER FUNCTION: get_cohort_size
-- Purpose: Get total users in a specific cohort
-- =====================================================

CREATE OR REPLACE FUNCTION public.get_cohort_size(p_cohort_date DATE)
RETURNS INTEGER AS $$
DECLARE
  v_count INTEGER;
BEGIN
  SELECT COUNT(*)
  INTO v_count
  FROM public.user_cohorts
  WHERE cohort_date = p_cohort_date;

  RETURN COALESCE(v_count, 0);
END;
$$ LANGUAGE plpgsql STABLE;

COMMENT ON FUNCTION public.get_cohort_size IS
  'Returns the number of users in a specific cohort date.';

-- =====================================================
-- HELPER FUNCTION: calculate_retention_rate
-- Purpose: Calculate retention rate for a cohort period
-- =====================================================

CREATE OR REPLACE FUNCTION public.calculate_retention_rate(
  p_cohort_date DATE,
  p_period_type TEXT,
  p_period_offset INTEGER
)
RETURNS NUMERIC AS $$
DECLARE
  v_total_users INTEGER;
  v_retained_users INTEGER;
  v_retention_rate NUMERIC;
  v_target_date TIMESTAMP WITH TIME ZONE;
BEGIN
  -- Get total users in cohort
  v_total_users := public.get_cohort_size(p_cohort_date);

  IF v_total_users = 0 THEN
    RETURN 0;
  END IF;

  -- Calculate target date based on period type and offset
  CASE p_period_type
    WHEN 'day' THEN
      v_target_date := p_cohort_date + (p_period_offset || ' days')::INTERVAL;
    WHEN 'week' THEN
      v_target_date := p_cohort_date + (p_period_offset || ' weeks')::INTERVAL;
    WHEN 'month' THEN
      v_target_date := p_cohort_date + (p_period_offset || ' months')::INTERVAL;
    ELSE
      RAISE EXCEPTION 'Invalid period_type: %', p_period_type;
  END CASE;

  -- Count retained users (users with activity after target date)
  -- NOTE: This queries the events table - adjust based on your retention definition
  SELECT COUNT(DISTINCT uc.user_id)
  INTO v_retained_users
  FROM public.user_cohorts uc
  INNER JOIN public.events e ON e.user_id = uc.user_id
  WHERE uc.cohort_date = p_cohort_date
    AND e.created_at >= v_target_date
    AND e.created_at < v_target_date + INTERVAL '1 day';

  -- Calculate retention rate as percentage
  v_retention_rate := (v_retained_users::NUMERIC / v_total_users::NUMERIC) * 100;

  RETURN ROUND(v_retention_rate, 2);
END;
$$ LANGUAGE plpgsql STABLE;

COMMENT ON FUNCTION public.calculate_retention_rate IS
  'Calculates retention rate for a cohort at a specific period offset. Returns percentage (0-100).';

-- =====================================================
-- HELPER VIEW: cohort_overview
-- Purpose: Quick overview of all cohorts
-- =====================================================

CREATE OR REPLACE VIEW public.cohort_overview AS
SELECT
  cohort_date,
  cohort_week,
  cohort_month,
  cohort_year,
  COUNT(*) as total_users,
  MIN(created_at) as first_user_at,
  MAX(created_at) as last_user_at
FROM public.user_cohorts
GROUP BY cohort_date, cohort_week, cohort_month, cohort_year
ORDER BY cohort_date DESC;

COMMENT ON VIEW public.cohort_overview IS
  'Overview of all user cohorts with user counts and date ranges.';

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Enable RLS on both tables
ALTER TABLE public.user_cohorts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.retention_metrics ENABLE ROW LEVEL SECURITY;

-- Policy: Allow service role full access
CREATE POLICY service_role_all_user_cohorts
  ON public.user_cohorts
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY service_role_all_retention_metrics
  ON public.retention_metrics
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Policy: Allow authenticated users to view their own cohort
CREATE POLICY users_view_own_cohort
  ON public.user_cohorts
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Policy: Allow authenticated users to view aggregated retention metrics
CREATE POLICY users_view_retention_metrics
  ON public.retention_metrics
  FOR SELECT
  TO authenticated
  USING (true);

-- Policy: Admins can view all cohorts (requires admin role)
CREATE POLICY admins_view_all_cohorts
  ON public.user_cohorts
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE id = auth.uid()
      AND raw_user_meta_data->>'role' = 'admin'
    )
  );

-- =====================================================
-- BACKFILL EXISTING USERS
-- Purpose: Assign cohorts to all existing users
-- =====================================================

DO $$
DECLARE
  v_user RECORD;
  v_count INTEGER := 0;
BEGIN
  RAISE NOTICE 'Starting cohort backfill for existing users...';

  FOR v_user IN
    SELECT id, created_at
    FROM auth.users
    WHERE id NOT IN (SELECT user_id FROM public.user_cohorts)
    ORDER BY created_at
  LOOP
    PERFORM public.assign_user_to_cohort(v_user.id, v_user.created_at);
    v_count := v_count + 1;
  END LOOP;

  RAISE NOTICE 'Cohort backfill complete. Assigned % users to cohorts.', v_count;
END $$;

-- =====================================================
-- TRIGGER: Auto-assign cohort on user signup
-- =====================================================

CREATE OR REPLACE FUNCTION public.trigger_assign_user_cohort()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM public.assign_user_to_cohort(NEW.id, NEW.created_at);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger on auth.users table
CREATE TRIGGER assign_cohort_on_signup
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.trigger_assign_user_cohort();

COMMENT ON FUNCTION public.trigger_assign_user_cohort IS
  'Automatically assigns new users to their cohort on signup.';

-- =====================================================
-- SAMPLE RETENTION METRICS (for testing)
-- =====================================================

-- This will be populated by the cohort-refresh.ts script
-- Example structure:
--
-- INSERT INTO public.retention_metrics (
--   cohort_date, period_type, period_offset,
--   total_users, retained_users, retention_rate, revenue_cents
-- ) VALUES
--   ('2025-11-01', 'day', 1, 100, 85, 85.00, 190000),
--   ('2025-11-01', 'week', 1, 100, 70, 70.00, 350000),
--   ('2025-11-01', 'month', 1, 100, 50, 50.00, 480000);

-- =====================================================
-- MIGRATION COMPLETE
-- =====================================================

-- Verify tables were created successfully
DO $$
DECLARE
  v_cohorts_count INTEGER;
  v_metrics_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO v_cohorts_count FROM public.user_cohorts;
  SELECT COUNT(*) INTO v_metrics_count FROM public.retention_metrics;

  RAISE NOTICE '✅ Retention metrics migration complete';
  RAISE NOTICE '   - user_cohorts: % records', v_cohorts_count;
  RAISE NOTICE '   - retention_metrics: % records', v_metrics_count;
  RAISE NOTICE '   - Helper functions: 3 created';
  RAISE NOTICE '   - Views: 1 created';
  RAISE NOTICE '   - RLS policies: 5 created';
  RAISE NOTICE '   - Triggers: 1 created';
END $$;
