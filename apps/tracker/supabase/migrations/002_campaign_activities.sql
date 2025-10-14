-- Campaign Activities Table
CREATE TABLE IF NOT EXISTS campaign_activities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('radio_submission', 'playlist_pitch', 'press_release', 'social_post', 'follow_up', 'response')),
  platform TEXT,
  contact_name TEXT,
  contact_email TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'submitted', 'responded', 'accepted', 'declined', 'no_response')),
  notes TEXT,
  submitted_at TIMESTAMP WITH TIME ZONE,
  response_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for activities
ALTER TABLE campaign_activities ENABLE ROW LEVEL SECURITY;

-- Activities policies (users can only see activities for their campaigns)
CREATE POLICY IF NOT EXISTS "Users can view own campaign activities" ON campaign_activities
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM campaigns 
      WHERE campaigns.id = campaign_activities.campaign_id 
      AND campaigns.user_id = auth.uid()
    )
  );

CREATE POLICY IF NOT EXISTS "Users can create campaign activities" ON campaign_activities
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM campaigns 
      WHERE campaigns.id = campaign_activities.campaign_id 
      AND campaigns.user_id = auth.uid()
    )
  );

CREATE POLICY IF NOT EXISTS "Users can update own campaign activities" ON campaign_activities
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM campaigns 
      WHERE campaigns.id = campaign_activities.campaign_id 
      AND campaigns.user_id = auth.uid()
    )
  );

-- updated_at trigger (reuse existing update_updated_at_column function from 001)
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'update_campaign_activities_updated_at'
  ) THEN
    CREATE TRIGGER update_campaign_activities_updated_at
      BEFORE UPDATE ON campaign_activities
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;











