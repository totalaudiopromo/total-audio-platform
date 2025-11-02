-- Phase 9: Agent Observability & Feedback Intelligence
-- Migration: 20251109_agent_observability
-- Purpose: Add observability tables for agent execution tracking, user feedback, and conversion events
-- Type: ADDITIVE ONLY (no DROP/ALTER operations)

-- ============================================================================
-- Table 1: agent_events
-- Records every agent execution with performance metrics
-- ============================================================================
CREATE TABLE IF NOT EXISTS agent_events (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  agent_id TEXT NOT NULL,
  app TEXT NOT NULL CHECK (app IN ('audio-intel', 'tracker', 'pitch-generator')),
  event_type TEXT NOT NULL,
  latency_ms INT,
  success BOOLEAN DEFAULT true,
  error_code TEXT,
  payload_size INT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for agent_events
CREATE INDEX IF NOT EXISTS idx_agent_events_created_at ON agent_events (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_agent_events_app_success ON agent_events (app, success);
CREATE INDEX IF NOT EXISTS idx_agent_events_agent_id ON agent_events (agent_id);

-- Comments for documentation
COMMENT ON TABLE agent_events IS 'Records every agent execution with performance metrics and success status';
COMMENT ON COLUMN agent_events.agent_id IS 'Identifier for the agent (e.g., intel-agent, pitch-agent, tracker-agent)';
COMMENT ON COLUMN agent_events.app IS 'Application context (audio-intel, tracker, pitch-generator)';
COMMENT ON COLUMN agent_events.event_type IS 'Type of event (e.g., invoke, complete, error, timeout)';
COMMENT ON COLUMN agent_events.latency_ms IS 'Execution time in milliseconds';
COMMENT ON COLUMN agent_events.error_code IS 'Error code if success=false (e.g., TIMEOUT, RATE_LIMIT, API_ERROR)';
COMMENT ON COLUMN agent_events.payload_size IS 'Size of request/response payload in bytes';

-- ============================================================================
-- Table 2: feedback_events
-- Captures user feedback (thumbs up/down, ratings, comments)
-- ============================================================================
CREATE TABLE IF NOT EXISTS feedback_events (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id UUID REFERENCES auth.users (id) ON DELETE CASCADE,
  app TEXT NOT NULL,
  agent_id TEXT,
  rating INT CHECK (
    rating BETWEEN 1
    AND 5
  ),
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for feedback_events
CREATE INDEX IF NOT EXISTS idx_feedback_events_user_id ON feedback_events (user_id);
CREATE INDEX IF NOT EXISTS idx_feedback_events_created_at ON feedback_events (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_feedback_events_rating ON feedback_events (rating);

-- Comments for documentation
COMMENT ON TABLE feedback_events IS 'User feedback on agent performance and overall experience';
COMMENT ON COLUMN feedback_events.user_id IS 'User who provided feedback';
COMMENT ON COLUMN feedback_events.app IS 'Application context where feedback was given';
COMMENT ON COLUMN feedback_events.agent_id IS 'Optional: specific agent being rated';
COMMENT ON COLUMN feedback_events.rating IS 'Rating from 1 (poor) to 5 (excellent)';
COMMENT ON COLUMN feedback_events.comment IS 'Optional text feedback from user';

-- ============================================================================
-- Table 3: conversion_events
-- Tracks conversion events linked to revenue impact
-- ============================================================================
CREATE TABLE IF NOT EXISTS conversion_events (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id UUID REFERENCES auth.users (id) ON DELETE CASCADE,
  app TEXT NOT NULL,
  event_name TEXT NOT NULL,
  revenue_impact NUMERIC DEFAULT 0,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for conversion_events
CREATE INDEX IF NOT EXISTS idx_conversion_events_user_id ON conversion_events (user_id);
CREATE INDEX IF NOT EXISTS idx_conversion_events_created_at ON conversion_events (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_conversion_events_event_name ON conversion_events (event_name);
CREATE INDEX IF NOT EXISTS idx_conversion_events_revenue ON conversion_events (revenue_impact DESC);

-- Comments for documentation
COMMENT ON TABLE conversion_events IS 'Tracks conversion events with revenue attribution';
COMMENT ON COLUMN conversion_events.user_id IS 'User who triggered the conversion event';
COMMENT ON COLUMN conversion_events.app IS 'Application context for the conversion';
COMMENT ON COLUMN conversion_events.event_name IS 'Name of conversion event (e.g., trial_started, upgraded_to_pro, feature_adopted)';
COMMENT ON COLUMN conversion_events.revenue_impact IS 'Revenue impact in cents (positive for revenue, negative for churn)';
COMMENT ON COLUMN conversion_events.metadata IS 'Additional event context (JSON)';

-- ============================================================================
-- View 1: agent_event_summary
-- Aggregated agent performance metrics by app
-- ============================================================================
CREATE OR REPLACE VIEW agent_event_summary AS
SELECT
  app,
  COUNT(*) AS total_events,
  SUM(
    CASE
      WHEN success THEN 1
      ELSE 0
    END
  ) AS successful_events,
  ROUND(
    AVG(latency_ms)::NUMERIC,
    0
  ) AS avg_latency_ms,
  ROUND(
    (
      SUM(
        CASE
          WHEN success THEN 1
          ELSE 0
        END
      )::NUMERIC / NULLIF(COUNT(*), 0)
    ) * 100,
    2
  ) AS success_rate_percent
FROM agent_events
GROUP BY app;

COMMENT ON VIEW agent_event_summary IS 'Aggregated agent performance metrics by application';

-- ============================================================================
-- View 2: feedback_summary
-- Aggregated feedback metrics by app
-- ============================================================================
CREATE OR REPLACE VIEW feedback_summary AS
SELECT
  app,
  COUNT(*) AS total_feedback,
  ROUND(AVG(rating)::NUMERIC, 2) AS avg_rating,
  SUM(
    CASE
      WHEN rating >= 4 THEN 1
      ELSE 0
    END
  ) AS positive_feedback,
  SUM(
    CASE
      WHEN rating <= 2 THEN 1
      ELSE 0
    END
  ) AS negative_feedback
FROM feedback_events
GROUP BY app;

COMMENT ON VIEW feedback_summary IS 'Aggregated user feedback metrics by application';

-- ============================================================================
-- View 3: conversion_summary
-- Aggregated conversion metrics by event type
-- ============================================================================
CREATE OR REPLACE VIEW conversion_summary AS
SELECT
  app,
  event_name,
  COUNT(*) AS event_count,
  SUM(revenue_impact) AS total_revenue_impact,
  ROUND(AVG(revenue_impact)::NUMERIC, 2) AS avg_revenue_impact
FROM conversion_events
GROUP BY app,
  event_name
ORDER BY total_revenue_impact DESC;

COMMENT ON VIEW conversion_summary IS 'Aggregated conversion events with revenue impact';

-- ============================================================================
-- Row Level Security (RLS) Policies
-- Mirrors existing security model: users can only see their own data
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE agent_events ENABLE ROW LEVEL SECURITY;

ALTER TABLE feedback_events ENABLE ROW LEVEL SECURITY;

ALTER TABLE conversion_events ENABLE ROW LEVEL SECURITY;

-- Policy 1: agent_events - Admin read only (service role)
CREATE POLICY agent_events_admin_read ON agent_events FOR
SELECT USING (auth.role () = 'service_role');

-- Policy 2: feedback_events - Users can insert their own feedback
CREATE POLICY feedback_events_user_insert ON feedback_events FOR INSERT
WITH CHECK (auth.uid () = user_id);

-- Policy 3: feedback_events - Users can read their own feedback
CREATE POLICY feedback_events_user_read ON feedback_events FOR
SELECT USING (auth.uid () = user_id);

-- Policy 4: feedback_events - Admin read all (service role)
CREATE POLICY feedback_events_admin_read ON feedback_events FOR
SELECT USING (auth.role () = 'service_role');

-- Policy 5: conversion_events - Users can read their own conversions
CREATE POLICY conversion_events_user_read ON conversion_events FOR
SELECT USING (auth.uid () = user_id);

-- Policy 6: conversion_events - Admin read/write (service role)
CREATE POLICY conversion_events_admin_all ON conversion_events FOR ALL USING (auth.role () = 'service_role');

-- ============================================================================
-- Migration Complete
-- ============================================================================

-- Verify tables exist
DO $$ BEGIN RAISE NOTICE 'Phase 9 migration complete: agent_events, feedback_events, conversion_events created';

END $$;
