-- CoachOS: Intelligent coaching environment for artists, PR agencies, and managers
-- Provides weekly plans, progress tracking, goal-setting, and personalized insights

-- ============================================================================
-- 1. COACH PROFILES
-- ============================================================================
-- User-level coaching identity and preferences
CREATE TABLE IF NOT EXISTS coach_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role text NOT NULL CHECK (role IN ('artist', 'pr_agency', 'manager')),
  experience_level text NOT NULL CHECK (experience_level IN ('beginner', 'intermediate', 'advanced')),
  genre text,
  goals jsonb DEFAULT '[]'::jsonb,
  preferences jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

-- Index for fast user lookups
CREATE INDEX idx_coach_profiles_user_id ON coach_profiles(user_id);

-- ============================================================================
-- 2. COACH GOALS
-- ============================================================================
-- Long-term and short-term goals for users
CREATE TABLE IF NOT EXISTS coach_goals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  category text NOT NULL CHECK (category IN ('career', 'release', 'branding', 'marketing', 'skills', 'growth', 'creative')),
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'paused', 'completed')),
  priority int DEFAULT 0,
  target_date date,
  progress int DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Indexes for filtering and sorting
CREATE INDEX idx_coach_goals_user_id ON coach_goals(user_id);
CREATE INDEX idx_coach_goals_status ON coach_goals(user_id, status);
CREATE INDEX idx_coach_goals_category ON coach_goals(user_id, category);
CREATE INDEX idx_coach_goals_priority ON coach_goals(user_id, priority DESC);

-- ============================================================================
-- 3. COACH SESSIONS
-- ============================================================================
-- Weekly coaching sessions with structured plans and insights
CREATE TABLE IF NOT EXISTS coach_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  week_start date NOT NULL,
  plan jsonb NOT NULL DEFAULT '{}'::jsonb,
  insights jsonb NOT NULL DEFAULT '[]'::jsonb,
  tasks jsonb NOT NULL DEFAULT '[]'::jsonb,
  reflections jsonb DEFAULT '{}'::jsonb,
  completed boolean DEFAULT false,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, week_start)
);

-- Indexes for session retrieval
CREATE INDEX idx_coach_sessions_user_id ON coach_sessions(user_id);
CREATE INDEX idx_coach_sessions_week_start ON coach_sessions(user_id, week_start DESC);
CREATE INDEX idx_coach_sessions_completed ON coach_sessions(user_id, completed);

-- ============================================================================
-- 4. COACH INSIGHTS
-- ============================================================================
-- Archive of AI-generated insights
CREATE TABLE IF NOT EXISTS coach_insights (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  insight_type text NOT NULL CHECK (insight_type IN ('career', 'creative', 'industry', 'branding', 'growth', 'scene', 'relationship', 'release', 'promotional')),
  content jsonb NOT NULL,
  session_id uuid REFERENCES coach_sessions(id) ON DELETE SET NULL,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

-- Indexes for insight retrieval
CREATE INDEX idx_coach_insights_user_id ON coach_insights(user_id);
CREATE INDEX idx_coach_insights_type ON coach_insights(user_id, insight_type);
CREATE INDEX idx_coach_insights_created ON coach_insights(user_id, created_at DESC);
CREATE INDEX idx_coach_insights_session ON coach_insights(session_id);

-- ============================================================================
-- 5. COACH PROGRESS
-- ============================================================================
-- Historical performance markers and metrics
CREATE TABLE IF NOT EXISTS coach_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  metric text NOT NULL,
  value numeric NOT NULL,
  metadata jsonb DEFAULT '{}'::jsonb,
  goal_id uuid REFERENCES coach_goals(id) ON DELETE SET NULL,
  session_id uuid REFERENCES coach_sessions(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now()
);

-- Indexes for progress tracking
CREATE INDEX idx_coach_progress_user_id ON coach_progress(user_id);
CREATE INDEX idx_coach_progress_metric ON coach_progress(user_id, metric);
CREATE INDEX idx_coach_progress_created ON coach_progress(user_id, created_at DESC);
CREATE INDEX idx_coach_progress_goal ON coach_progress(goal_id);

-- ============================================================================
-- 6. ROW LEVEL SECURITY (RLS)
-- ============================================================================
-- Enable RLS on all tables
ALTER TABLE coach_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE coach_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE coach_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE coach_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE coach_progress ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Users can only access their own data

-- coach_profiles policies
CREATE POLICY "Users can view their own coach profile"
  ON coach_profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own coach profile"
  ON coach_profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own coach profile"
  ON coach_profiles FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own coach profile"
  ON coach_profiles FOR DELETE
  USING (auth.uid() = user_id);

-- coach_goals policies
CREATE POLICY "Users can view their own goals"
  ON coach_goals FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own goals"
  ON coach_goals FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own goals"
  ON coach_goals FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own goals"
  ON coach_goals FOR DELETE
  USING (auth.uid() = user_id);

-- coach_sessions policies
CREATE POLICY "Users can view their own sessions"
  ON coach_sessions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own sessions"
  ON coach_sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own sessions"
  ON coach_sessions FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own sessions"
  ON coach_sessions FOR DELETE
  USING (auth.uid() = user_id);

-- coach_insights policies
CREATE POLICY "Users can view their own insights"
  ON coach_insights FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own insights"
  ON coach_insights FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own insights"
  ON coach_insights FOR DELETE
  USING (auth.uid() = user_id);

-- coach_progress policies
CREATE POLICY "Users can view their own progress"
  ON coach_progress FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own progress"
  ON coach_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own progress"
  ON coach_progress FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================================
-- 7. HELPER FUNCTIONS
-- ============================================================================
-- Update timestamp trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply update trigger to relevant tables
CREATE TRIGGER update_coach_profiles_updated_at BEFORE UPDATE ON coach_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_coach_goals_updated_at BEFORE UPDATE ON coach_goals
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_coach_sessions_updated_at BEFORE UPDATE ON coach_sessions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- 8. COMMENTS FOR DOCUMENTATION
-- ============================================================================
COMMENT ON TABLE coach_profiles IS 'User coaching profiles with role, experience level, and preferences';
COMMENT ON TABLE coach_goals IS 'User goals with categories, priorities, and progress tracking';
COMMENT ON TABLE coach_sessions IS 'Weekly coaching sessions with structured plans and insights';
COMMENT ON TABLE coach_insights IS 'AI-generated insights archive for different categories';
COMMENT ON TABLE coach_progress IS 'Historical metrics and performance markers';
