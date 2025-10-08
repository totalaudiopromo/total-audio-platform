-- Fix user_pitch_settings.user_id from UUID to TEXT
-- This table was missed in the previous migration

ALTER TABLE user_pitch_settings
ALTER COLUMN user_id TYPE TEXT USING user_id::TEXT;

-- Update the UNIQUE constraint to work with TEXT
ALTER TABLE user_pitch_settings
DROP CONSTRAINT IF EXISTS user_pitch_settings_user_id_key;

ALTER TABLE user_pitch_settings
ADD CONSTRAINT user_pitch_settings_user_id_key UNIQUE (user_id);

-- Add comment explaining the user_id usage
COMMENT ON COLUMN user_pitch_settings.user_id IS 'User email address from NextAuth session';
