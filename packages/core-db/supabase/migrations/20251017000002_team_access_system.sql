-- Team Member Access System for PR Agencies
-- Supports multi-user accounts with role-based permissions

-- Team/Organization table
CREATE TABLE IF NOT EXISTS teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_tier VARCHAR(50) DEFAULT 'free', -- free, pro, agency
  custom_branding JSONB DEFAULT '{}', -- logo_url, primary_color, secondary_color
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Team members (many-to-many with roles)
CREATE TABLE IF NOT EXISTS team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role VARCHAR(50) NOT NULL DEFAULT 'member', -- admin, member, client
  permissions JSONB DEFAULT '{}', -- granular permissions object
  invited_by UUID REFERENCES auth.users(id),
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(team_id, user_id)
);

-- Team invitations
CREATE TABLE IF NOT EXISTS team_invitations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'member',
  invited_by UUID NOT NULL REFERENCES auth.users(id),
  token VARCHAR(255) UNIQUE NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  accepted_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(team_id, email)
);

-- Activity log for team actions
CREATE TABLE IF NOT EXISTS team_activity_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action VARCHAR(100) NOT NULL, -- created_campaign, exported_contacts, invited_member, etc.
  resource_type VARCHAR(50), -- campaign, contact, export, etc.
  resource_id UUID,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_teams_owner ON teams(owner_id);
CREATE INDEX IF NOT EXISTS idx_teams_slug ON teams(slug);
CREATE INDEX IF NOT EXISTS idx_team_members_team ON team_members(team_id);
CREATE INDEX IF NOT EXISTS idx_team_members_user ON team_members(user_id);
CREATE INDEX IF NOT EXISTS idx_team_invitations_team ON team_invitations(team_id);
CREATE INDEX IF NOT EXISTS idx_team_invitations_token ON team_invitations(token);
CREATE INDEX IF NOT EXISTS idx_activity_log_team ON team_activity_log(team_id);
CREATE INDEX IF NOT EXISTS idx_activity_log_user ON team_activity_log(user_id);

-- Add team_id to existing tables (campaigns, contacts, etc.)
ALTER TABLE campaigns ADD COLUMN IF NOT EXISTS team_id UUID REFERENCES teams(id) ON DELETE CASCADE;
CREATE INDEX IF NOT EXISTS idx_campaigns_team ON campaigns(team_id);

-- Row Level Security (RLS) Policies
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_activity_log ENABLE ROW LEVEL SECURITY;

-- Teams: Users can see teams they're members of
CREATE POLICY "Users can view their teams" ON teams
  FOR SELECT
  USING (
    id IN (
      SELECT team_id FROM team_members WHERE user_id = auth.uid()
    )
  );

-- Teams: Only owners can update teams
CREATE POLICY "Team owners can update teams" ON teams
  FOR UPDATE
  USING (owner_id = auth.uid());

-- Teams: Anyone can create a team
CREATE POLICY "Anyone can create teams" ON teams
  FOR INSERT
  WITH CHECK (owner_id = auth.uid());

-- Team Members: Can view members of their teams
CREATE POLICY "Users can view team members" ON team_members
  FOR SELECT
  USING (
    team_id IN (
      SELECT team_id FROM team_members WHERE user_id = auth.uid()
    )
  );

-- Team Members: Admins can manage members
CREATE POLICY "Team admins can manage members" ON team_members
  FOR ALL
  USING (
    team_id IN (
      SELECT team_id FROM team_members
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Activity Log: Team members can view activity
CREATE POLICY "Team members can view activity" ON team_activity_log
  FOR SELECT
  USING (
    team_id IN (
      SELECT team_id FROM team_members WHERE user_id = auth.uid()
    )
  );

-- Activity Log: Authenticated users can insert activity
CREATE POLICY "Users can log activity" ON team_activity_log
  FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- Helper function: Check if user has permission
CREATE OR REPLACE FUNCTION has_team_permission(
  p_team_id UUID,
  p_user_id UUID,
  p_required_role VARCHAR DEFAULT 'member'
)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM team_members
    WHERE team_id = p_team_id
      AND user_id = p_user_id
      AND (
        role = 'admin' OR
        (p_required_role = 'member' AND role IN ('admin', 'member'))
      )
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper function: Log team activity
CREATE OR REPLACE FUNCTION log_team_activity(
  p_team_id UUID,
  p_user_id UUID,
  p_action VARCHAR,
  p_resource_type VARCHAR DEFAULT NULL,
  p_resource_id UUID DEFAULT NULL,
  p_metadata JSONB DEFAULT '{}'
)
RETURNS UUID AS $$
DECLARE
  v_log_id UUID;
BEGIN
  INSERT INTO team_activity_log (team_id, user_id, action, resource_type, resource_id, metadata)
  VALUES (p_team_id, p_user_id, p_action, p_resource_type, p_resource_id, p_metadata)
  RETURNING id INTO v_log_id;

  RETURN v_log_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to update teams.updated_at
CREATE OR REPLACE FUNCTION update_teams_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER teams_updated_at
  BEFORE UPDATE ON teams
  FOR EACH ROW
  EXECUTE FUNCTION update_teams_updated_at();

COMMENT ON TABLE teams IS 'Organizations/agencies with multi-user access';
COMMENT ON TABLE team_members IS 'Team membership with role-based permissions';
COMMENT ON TABLE team_invitations IS 'Pending team invitations via email';
COMMENT ON TABLE team_activity_log IS 'Audit log of team actions for compliance';
