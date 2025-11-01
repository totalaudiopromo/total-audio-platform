-- Add user_type to subscriptions for differentiated pricing
ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS user_type TEXT CHECK (user_type IN ('artist', 'agency'));
ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS plan_type TEXT CHECK (plan_type IN ('free', 'pro', 'agency_starter', 'agency_pro', 'agency_enterprise'));

-- Pricing Tiers Table (for reference and product catalog)
CREATE TABLE IF NOT EXISTS pricing_tiers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  user_type TEXT NOT NULL CHECK (user_type IN ('artist', 'agency')),
  price_monthly DECIMAL(10,2) NOT NULL DEFAULT 0,
  price_yearly DECIMAL(10,2) NOT NULL DEFAULT 0,
  stripe_price_id_monthly TEXT,
  stripe_price_id_yearly TEXT,
  features JSONB DEFAULT '[]'::jsonb,
  limits JSONB DEFAULT '{}'::jsonb,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE pricing_tiers ENABLE ROW LEVEL SECURITY;

-- Anyone can view pricing tiers
CREATE POLICY "Anyone can view active pricing tiers" ON pricing_tiers
  FOR SELECT USING (is_active = true);

-- Insert default pricing tiers for artists
INSERT INTO pricing_tiers (name, user_type, price_monthly, price_yearly, features, limits) VALUES
(
  'Free',
  'artist',
  0,
  0,
  '["Track up to 3 campaigns", "Basic analytics", "Activity tracking", "Email support"]'::jsonb,
  '{"max_campaigns": 3, "max_activities_per_campaign": 50}'::jsonb
),
(
  'Pro',
  'artist',
  19,
  190,
  '["Unlimited campaigns", "Advanced analytics", "Priority support", "CSV export", "Custom reporting"]'::jsonb,
  '{"max_campaigns": -1, "max_activities_per_campaign": -1}'::jsonb
);

-- Insert default pricing tiers for agencies
INSERT INTO pricing_tiers (name, user_type, price_monthly, price_yearly, features, limits) VALUES
(
  'Agency Starter',
  'agency',
  49,
  490,
  '["Up to 5 clients", "Unlimited campaigns", "Team collaboration", "Client portal", "Priority support", "White-label reports"]'::jsonb,
  '{"max_clients": 5, "max_team_members": 3, "max_campaigns": -1}'::jsonb
),
(
  'Agency Pro',
  'agency',
  99,
  990,
  '["Up to 15 clients", "Unlimited campaigns", "Advanced team tools", "API access", "Custom branding", "Dedicated support"]'::jsonb,
  '{"max_clients": 15, "max_team_members": 10, "max_campaigns": -1}'::jsonb
),
(
  'Agency Enterprise',
  'agency',
  199,
  1990,
  '["Unlimited clients", "Unlimited campaigns", "Full API access", "Custom integrations", "Dedicated account manager", "SLA guarantee"]'::jsonb,
  '{"max_clients": -1, "max_team_members": -1, "max_campaigns": -1}'::jsonb
);

-- Usage Tracking Table (to enforce limits)
CREATE TABLE IF NOT EXISTS usage_limits (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  period_start TIMESTAMP WITH TIME ZONE NOT NULL,
  period_end TIMESTAMP WITH TIME ZONE NOT NULL,
  campaigns_created INTEGER DEFAULT 0,
  clients_added INTEGER DEFAULT 0,
  team_members_added INTEGER DEFAULT 0,
  api_calls_made INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, period_start)
);

-- Enable RLS
ALTER TABLE usage_limits ENABLE ROW LEVEL SECURITY;

-- Users can view their own usage
CREATE POLICY "Users can view own usage" ON usage_limits
  FOR SELECT USING (auth.uid() = user_id);

-- Add updated_at triggers
CREATE TRIGGER update_pricing_tiers_updated_at
  BEFORE UPDATE ON pricing_tiers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_usage_limits_updated_at
  BEFORE UPDATE ON usage_limits
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_pricing_tiers_user_type ON pricing_tiers(user_type);
CREATE INDEX IF NOT EXISTS idx_pricing_tiers_is_active ON pricing_tiers(is_active);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_type ON subscriptions(user_type);
CREATE INDEX IF NOT EXISTS idx_subscriptions_plan_type ON subscriptions(plan_type);
CREATE INDEX IF NOT EXISTS idx_usage_limits_user_id ON usage_limits(user_id);
CREATE INDEX IF NOT EXISTS idx_usage_limits_period ON usage_limits(period_start, period_end);
