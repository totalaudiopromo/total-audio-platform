-- Migration: Add onboarding tracking fields
-- Description: Adds onboarding_completed and onboarding_skipped_at to user_profiles for tracking onboarding progress
-- Created: 2025-12-03

-- Add onboarding fields to user_profiles table
ALTER TABLE public.user_profiles
ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS onboarding_skipped_at TIMESTAMP WITH TIME ZONE;

-- Add comments for documentation
COMMENT ON COLUMN public.user_profiles.onboarding_completed IS 'Whether user has completed the onboarding flow';
COMMENT ON COLUMN public.user_profiles.onboarding_skipped_at IS 'Timestamp when user skipped onboarding (null if completed or not skipped)';

-- Create index for querying incomplete onboarding users
CREATE INDEX IF NOT EXISTS idx_user_profiles_onboarding
ON public.user_profiles(onboarding_completed)
WHERE onboarding_completed = false;

-- Add index for users who skipped onboarding (for re-engagement campaigns)
CREATE INDEX IF NOT EXISTS idx_user_profiles_onboarding_skipped
ON public.user_profiles(onboarding_skipped_at)
WHERE onboarding_skipped_at IS NOT NULL;

-- Rollback script (commented):
-- DROP INDEX IF EXISTS idx_user_profiles_onboarding_skipped;
-- DROP INDEX IF EXISTS idx_user_profiles_onboarding;
-- ALTER TABLE public.user_profiles DROP COLUMN IF EXISTS onboarding_skipped_at;
-- ALTER TABLE public.user_profiles DROP COLUMN IF EXISTS onboarding_completed;
