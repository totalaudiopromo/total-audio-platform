-- Fix user_id columns from UUID to TEXT across all tables
-- This aligns with how the app actually uses user_id (email addresses)

-- Fix contacts table
ALTER TABLE contacts
ALTER COLUMN user_id TYPE TEXT USING user_id::TEXT;

-- Fix pitches table
ALTER TABLE pitches
ALTER COLUMN user_id TYPE TEXT USING user_id::TEXT;

-- Fix pitch_templates table
ALTER TABLE pitch_templates
ALTER COLUMN user_id TYPE TEXT USING user_id::TEXT;

-- user_pitch_settings already fixed in previous migration

-- Add comments explaining the user_id usage
COMMENT ON COLUMN contacts.user_id IS 'User email address from NextAuth session';
COMMENT ON COLUMN pitches.user_id IS 'User email address from NextAuth session';
COMMENT ON COLUMN pitch_templates.user_id IS 'User email address from NextAuth session';
