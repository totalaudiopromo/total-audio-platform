-- User Profiles Table (extends auth.users)
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  user_type TEXT NOT NULL DEFAULT 'artist' CHECK (user_type IN ('artist', 'agency', 'both')),
  full_name TEXT,
  company_name TEXT, -- For agencies
  bio TEXT,
  avatar_url TEXT,
  website TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Policies for user_profiles
CREATE POLICY "Users can view own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON user_profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Agency Profiles Table (additional info for agencies)
CREATE TABLE IF NOT EXISTS agency_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  company_name TEXT NOT NULL,
  registration_number TEXT,
  address TEXT,
  phone TEXT,
  email TEXT NOT NULL,
  website TEXT,
  team_size INTEGER DEFAULT 1,
  specialties TEXT[], -- e.g., ['radio', 'press', 'playlists']
  bio TEXT,
  logo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE agency_profiles ENABLE ROW LEVEL SECURITY;

-- Policies for agency_profiles
CREATE POLICY "Agencies can view own profile" ON agency_profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Agencies can update own profile" ON agency_profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Agencies can insert own profile" ON agency_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Public view for agencies (for artists to find agencies)
CREATE POLICY "Anyone can view agency profiles" ON agency_profiles
  FOR SELECT USING (true);

-- Client-Agency Relationships Table
CREATE TABLE IF NOT EXISTS client_relationships (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  agency_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  client_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'paused', 'ended')),
  role TEXT DEFAULT 'client' CHECK (role IN ('client', 'collaborator', 'viewer')),
  invited_by UUID REFERENCES auth.users(id),
  invited_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  accepted_at TIMESTAMP WITH TIME ZONE,
  ended_at TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(agency_id, client_id)
);

-- Enable RLS
ALTER TABLE client_relationships ENABLE ROW LEVEL SECURITY;

-- Policies for client_relationships
CREATE POLICY "Agencies can view their client relationships" ON client_relationships
  FOR SELECT USING (auth.uid() = agency_id);

CREATE POLICY "Clients can view their agency relationships" ON client_relationships
  FOR SELECT USING (auth.uid() = client_id);

CREATE POLICY "Agencies can create client relationships" ON client_relationships
  FOR INSERT WITH CHECK (auth.uid() = agency_id);

CREATE POLICY "Agencies can update their client relationships" ON client_relationships
  FOR UPDATE USING (auth.uid() = agency_id);

CREATE POLICY "Clients can update their relationships" ON client_relationships
  FOR UPDATE USING (auth.uid() = client_id);

-- Campaign Access Control Table (who can access which campaigns)
CREATE TABLE IF NOT EXISTS campaign_access (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  access_type TEXT NOT NULL DEFAULT 'view' CHECK (access_type IN ('owner', 'manager', 'editor', 'viewer')),
  granted_by UUID REFERENCES auth.users(id),
  granted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(campaign_id, user_id)
);

-- Enable RLS
ALTER TABLE campaign_access ENABLE ROW LEVEL SECURITY;

-- Policies for campaign_access
CREATE POLICY "Users can view their campaign access" ON campaign_access
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Campaign owners can manage access" ON campaign_access
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM campaigns
      WHERE campaigns.id = campaign_access.campaign_id
      AND campaigns.user_id = auth.uid()
    )
  );

-- Add agency_id to campaigns table
ALTER TABLE campaigns ADD COLUMN IF NOT EXISTS agency_id UUID REFERENCES auth.users(id);
ALTER TABLE campaigns ADD COLUMN IF NOT EXISTS client_id UUID REFERENCES auth.users(id);
ALTER TABLE campaigns ADD COLUMN IF NOT EXISTS is_managed BOOLEAN DEFAULT false;

-- Update campaign policies to include shared access
DROP POLICY IF EXISTS "Users can view own campaigns" ON campaigns;
CREATE POLICY "Users can view own and accessible campaigns" ON campaigns
  FOR SELECT USING (
    auth.uid() = user_id
    OR auth.uid() = agency_id
    OR auth.uid() = client_id
    OR EXISTS (
      SELECT 1 FROM campaign_access
      WHERE campaign_access.campaign_id = campaigns.id
      AND campaign_access.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can update own campaigns" ON campaigns;
CREATE POLICY "Users can update owned or managed campaigns" ON campaigns
  FOR UPDATE USING (
    auth.uid() = user_id
    OR (auth.uid() = agency_id AND is_managed = true)
    OR EXISTS (
      SELECT 1 FROM campaign_access
      WHERE campaign_access.campaign_id = campaigns.id
      AND campaign_access.user_id = auth.uid()
      AND campaign_access.access_type IN ('owner', 'manager', 'editor')
    )
  );

-- Team Members Table (for agencies with multiple staff)
CREATE TABLE IF NOT EXISTS team_members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  agency_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'manager', 'member')),
  permissions TEXT[] DEFAULT ARRAY['view_campaigns', 'edit_activities'],
  invited_by UUID REFERENCES auth.users(id),
  invited_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  joined_at TIMESTAMP WITH TIME ZONE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'suspended', 'removed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(agency_id, user_id)
);

-- Enable RLS
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;

-- Policies for team_members
CREATE POLICY "Agency owners can manage team members" ON team_members
  FOR ALL USING (auth.uid() = agency_id);

CREATE POLICY "Team members can view their membership" ON team_members
  FOR SELECT USING (auth.uid() = user_id);

-- Add updated_at triggers
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_agency_profiles_updated_at
  BEFORE UPDATE ON agency_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_client_relationships_updated_at
  BEFORE UPDATE ON client_relationships
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_team_members_updated_at
  BEFORE UPDATE ON team_members
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_type ON user_profiles(user_type);
CREATE INDEX IF NOT EXISTS idx_agency_profiles_user_id ON agency_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_client_relationships_agency_id ON client_relationships(agency_id);
CREATE INDEX IF NOT EXISTS idx_client_relationships_client_id ON client_relationships(client_id);
CREATE INDEX IF NOT EXISTS idx_client_relationships_status ON client_relationships(status);
CREATE INDEX IF NOT EXISTS idx_campaign_access_campaign_id ON campaign_access(campaign_id);
CREATE INDEX IF NOT EXISTS idx_campaign_access_user_id ON campaign_access(user_id);
CREATE INDEX IF NOT EXISTS idx_campaigns_agency_id ON campaigns(agency_id);
CREATE INDEX IF NOT EXISTS idx_campaigns_client_id ON campaigns(client_id);
CREATE INDEX IF NOT EXISTS idx_team_members_agency_id ON team_members(agency_id);
CREATE INDEX IF NOT EXISTS idx_team_members_user_id ON team_members(user_id);
