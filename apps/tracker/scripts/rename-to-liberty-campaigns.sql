-- =============================================================================
-- RENAME EXISTING CAMPAIGNS TO LIBERTY CAMPAIGNS
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/mjfhegawkusjlkcgfevp/sql
-- =============================================================================
-- 
-- This script renames your existing "untitled" campaigns to:
-- 1. KYARA - Bloodshot
-- 2. Senior Dunce - Bestial
-- 3. Concerta - Consumption
--
-- IMPORTANT: Replace YOUR_USER_ID with your actual user ID
-- Find your user ID: SELECT id, email FROM auth.users;
-- =============================================================================

-- Step 1: Find your user ID (run this first to get your ID)
-- SELECT id, email FROM auth.users;

-- Step 2: Update campaigns (replace YOUR_USER_ID below)
-- =============================================================================

-- Campaign 1: KYARA - Bloodshot
UPDATE campaigns
SET 
  name = 'KYARA - Bloodshot',
  artist_name = 'KYARA',
  platform = 'BBC Radio',
  genre = 'Electronic',
  start_date = '2025-01-10',
  end_date = '2025-02-10',
  budget = 650,
  target_reach = 45,
  actual_reach = 12,
  status = 'active',
  notes = 'Main single release campaign. Focus on BBC Radio 1 and 6Music.'
WHERE user_id = 'YOUR_USER_ID'
  AND (name IS NULL OR name = '' OR name = 'Untitled Campaign')
LIMIT 1;

-- Campaign 2: Senior Dunce - Bestial
UPDATE campaigns
SET 
  name = 'Senior Dunce - Bestial',
  artist_name = 'Senior Dunce',
  platform = 'Community Radio',
  genre = 'Electronic',
  start_date = '2025-01-15',
  end_date = '2025-02-15',
  budget = 480,
  target_reach = 38,
  actual_reach = 12,
  status = 'active',
  notes = 'Electronic/Experimental track campaign targeting community radio stations.'
WHERE user_id = 'YOUR_USER_ID'
  AND (name IS NULL OR name = '' OR name = 'Untitled Campaign')
LIMIT 1;

-- Campaign 3: Concerta - Consumption
UPDATE campaigns
SET 
  name = 'Concerta - Consumption',
  artist_name = 'Concerta',
  platform = 'Playlists',
  genre = 'Electronic',
  start_date = '2025-01-05',
  end_date = '2025-02-05',
  budget = 750,
  target_reach = 52,
  actual_reach = 10,
  status = 'active',
  notes = 'Electronic playlist campaign targeting Spotify editorial and indie playlists.'
WHERE user_id = 'YOUR_USER_ID'
  AND (name IS NULL OR name = '' OR name = 'Untitled Campaign')
LIMIT 1;

-- =============================================================================
-- VERIFICATION: Check your campaigns after running
-- =============================================================================
-- SELECT id, name, artist_name, platform, status 
-- FROM campaigns 
-- WHERE user_id = 'YOUR_USER_ID'
-- ORDER BY created_at DESC;

