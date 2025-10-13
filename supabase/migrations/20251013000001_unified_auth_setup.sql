-- =====================================================
-- Total Audio Unified Authentication Schema
-- Migration: 20251013000001_unified_auth_setup.sql
-- Purpose: Set up unified authentication across all apps
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- 1. USER PROFILES TABLE
-- Extends Supabase auth.users with Total Audio data
-- =====================================================

CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT,
  subscription_tier TEXT NOT NULL DEFAULT 'free',
  stripe_customer_id TEXT UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT valid_subscription_tier CHECK (
    subscription_tier IN ('free', 'pro', 'agency', 'bundle')
  )
);

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON public.user_profiles(email);
CREATE INDEX IF NOT EXISTS idx_user_profiles_stripe_customer ON public.user_profiles(stripe_customer_id);

-- Row Level Security
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Users can read their own profile
CREATE POLICY "Users can read own profile"
  ON public.user_profiles
  FOR SELECT
  USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON public.user_profiles
  FOR UPDATE
  USING (auth.uid() = id);

-- Service role can do everything (for webhooks)
CREATE POLICY "Service role can manage all profiles"
  ON public.user_profiles
  FOR ALL
  USING (auth.role() = 'service_role');

-- =====================================================
-- 2. APP PERMISSIONS TABLE
-- Controls which apps each user can access
-- =====================================================

CREATE TABLE IF NOT EXISTS public.app_permissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  app_name TEXT NOT NULL,
  has_access BOOLEAN NOT NULL DEFAULT false,
  granted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT valid_app_name CHECK (
    app_name IN ('audio-intel', 'tracker', 'pitch-generator', 'command-centre')
  ),

  -- Prevent duplicate permissions for same user/app
  UNIQUE(user_id, app_name)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_app_permissions_user ON public.app_permissions(user_id);
CREATE INDEX IF NOT EXISTS idx_app_permissions_app ON public.app_permissions(app_name);

-- Row Level Security
ALTER TABLE public.app_permissions ENABLE ROW LEVEL SECURITY;

-- Users can read their own permissions
CREATE POLICY "Users can read own permissions"
  ON public.app_permissions
  FOR SELECT
  USING (auth.uid() = user_id);

-- Service role can manage all permissions
CREATE POLICY "Service role can manage all permissions"
  ON public.app_permissions
  FOR ALL
  USING (auth.role() = 'service_role');

-- =====================================================
-- 3. SUBSCRIPTIONS TABLE
-- Tracks Stripe subscriptions
-- =====================================================

CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_subscription_id TEXT UNIQUE,
  status TEXT NOT NULL,
  plan_id TEXT NOT NULL,
  plan_name TEXT NOT NULL,
  current_period_end TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT valid_status CHECK (
    status IN ('active', 'trialing', 'cancelled', 'past_due', 'incomplete', 'incomplete_expired', 'unpaid')
  )
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_subscriptions_user ON public.subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe ON public.subscriptions(stripe_subscription_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON public.subscriptions(status);

-- Row Level Security
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- Users can read their own subscriptions
CREATE POLICY "Users can read own subscriptions"
  ON public.subscriptions
  FOR SELECT
  USING (auth.uid() = user_id);

-- Service role can manage all subscriptions
CREATE POLICY "Service role can manage all subscriptions"
  ON public.subscriptions
  FOR ALL
  USING (auth.role() = 'service_role');

-- =====================================================
-- 4. FUNCTIONS
-- Utility functions for auth operations
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for user_profiles
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger for subscriptions
CREATE TRIGGER update_subscriptions_updated_at
  BEFORE UPDATE ON public.subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to create default user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, subscription_tier)
  VALUES (NEW.id, NEW.email, 'free');

  -- Grant default app access (Audio Intel)
  INSERT INTO public.app_permissions (user_id, app_name, has_access)
  VALUES (NEW.id, 'audio-intel', true);

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Function to update app permissions based on subscription tier
CREATE OR REPLACE FUNCTION public.update_app_permissions_for_tier(
  p_user_id UUID,
  p_tier TEXT
)
RETURNS VOID AS $$
BEGIN
  -- Remove all existing permissions
  DELETE FROM public.app_permissions WHERE user_id = p_user_id;

  -- Grant permissions based on tier
  CASE p_tier
    WHEN 'free' THEN
      INSERT INTO public.app_permissions (user_id, app_name, has_access)
      VALUES (p_user_id, 'audio-intel', true);

    WHEN 'pro' THEN
      INSERT INTO public.app_permissions (user_id, app_name, has_access)
      VALUES (p_user_id, 'audio-intel', true);

    WHEN 'agency' THEN
      INSERT INTO public.app_permissions (user_id, app_name, has_access)
      VALUES (p_user_id, 'audio-intel', true);

    WHEN 'bundle' THEN
      INSERT INTO public.app_permissions (user_id, app_name, has_access)
      VALUES
        (p_user_id, 'audio-intel', true),
        (p_user_id, 'tracker', true),
        (p_user_id, 'pitch-generator', true),
        (p_user_id, 'command-centre', true);
  END CASE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to automatically update permissions when tier changes
CREATE OR REPLACE FUNCTION public.handle_tier_change()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.subscription_tier IS DISTINCT FROM OLD.subscription_tier THEN
    PERFORM public.update_app_permissions_for_tier(NEW.id, NEW.subscription_tier);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to update permissions on tier change
CREATE TRIGGER on_subscription_tier_changed
  AFTER UPDATE ON public.user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_tier_change();

-- =====================================================
-- 5. HELPER VIEWS
-- Useful views for querying user data
-- =====================================================

-- View: User with full subscription info
CREATE OR REPLACE VIEW public.users_with_subscriptions AS
SELECT
  up.id,
  up.email,
  up.full_name,
  up.subscription_tier,
  up.stripe_customer_id,
  s.stripe_subscription_id,
  s.status AS subscription_status,
  s.plan_name,
  s.current_period_end,
  up.created_at,
  up.updated_at
FROM public.user_profiles up
LEFT JOIN public.subscriptions s ON up.id = s.user_id
  AND s.status IN ('active', 'trialing')
ORDER BY up.created_at DESC;

-- View: User permissions summary
CREATE OR REPLACE VIEW public.user_permissions_summary AS
SELECT
  up.id,
  up.email,
  up.subscription_tier,
  ARRAY_AGG(ap.app_name ORDER BY ap.app_name) FILTER (WHERE ap.has_access) AS accessible_apps,
  COUNT(*) FILTER (WHERE ap.has_access) AS total_access_count
FROM public.user_profiles up
LEFT JOIN public.app_permissions ap ON up.id = ap.user_id
GROUP BY up.id, up.email, up.subscription_tier;

-- =====================================================
-- 6. COMMENTS
-- Documentation for future reference
-- =====================================================

COMMENT ON TABLE public.user_profiles IS 'Extended user profiles with Total Audio subscription data';
COMMENT ON TABLE public.app_permissions IS 'Controls which Total Audio apps each user can access';
COMMENT ON TABLE public.subscriptions IS 'Stripe subscription tracking';
COMMENT ON FUNCTION public.handle_new_user() IS 'Automatically creates user profile and default permissions on signup';
COMMENT ON FUNCTION public.update_app_permissions_for_tier(UUID, TEXT) IS 'Updates app permissions based on subscription tier';
COMMENT ON FUNCTION public.handle_tier_change() IS 'Automatically updates permissions when subscription tier changes';

-- =====================================================
-- Migration Complete
-- =====================================================
