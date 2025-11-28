-- Migration: Add app_source column to subscriptions table
-- Purpose: Track which app (audio-intel, tracker, pitch-generator) the subscription originated from
-- Date: 2025-11-28

-- Add app_source column to track subscription origin
ALTER TABLE subscriptions
ADD COLUMN IF NOT EXISTS app_source TEXT DEFAULT 'tracker'
CHECK (app_source IN ('audio-intel', 'tracker', 'pitch-generator'));

-- Add index for filtering by app
CREATE INDEX IF NOT EXISTS idx_subscriptions_app_source ON subscriptions(app_source);

-- Comment for documentation
COMMENT ON COLUMN subscriptions.app_source IS 'Tracks which Total Audio app the subscription originated from';
