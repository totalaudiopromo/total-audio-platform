-- ========================================
-- CRITICAL FIX: Change user_id from UUID to TEXT
-- ========================================
-- This MUST be run in Supabase SQL Editor
-- Project: ucncbighzqudaszewjrv.supabase.co
-- ========================================

-- Step 1: Change column type from UUID to TEXT
ALTER TABLE user_pitch_settings
ALTER COLUMN user_id TYPE TEXT USING user_id::TEXT;

-- Step 2: Drop old constraint
ALTER TABLE user_pitch_settings
DROP CONSTRAINT IF EXISTS user_pitch_settings_user_id_key;

-- Step 3: Add new constraint
ALTER TABLE user_pitch_settings
ADD CONSTRAINT user_pitch_settings_user_id_key UNIQUE (user_id);

-- Step 4: Verify the change
SELECT
  column_name,
  data_type,
  udt_name
FROM information_schema.columns
WHERE table_name = 'user_pitch_settings'
  AND column_name = 'user_id';

-- Expected result: data_type = 'text', udt_name = 'text'
