-- CoachOS Phase 2: Habits, Routines, and Calendar
-- Extends CoachOS with habit tracking, routine templates, and calendar integration
-- Maintains strict boundaries: CoachOS writes ONLY to coach_* tables

-- ============================================================
-- Table: coach_habits
-- Purpose: Track daily/weekly habits for users
-- ============================================================
CREATE TABLE IF NOT EXISTS public.coach_habits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  workspace_id UUID NOT NULL,
  name TEXT NOT NULL,
  frequency TEXT NOT NULL CHECK (frequency IN ('daily', '3x_week', 'weekly', 'monthly')),
  category TEXT NOT NULL CHECK (category IN ('creative', 'outreach', 'wellness', 'admin', 'learning')),
  streak INTEGER DEFAULT 0,
  last_completed TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_coach_habits_user ON public.coach_habits(user_id);
CREATE INDEX idx_coach_habits_workspace ON public.coach_habits(workspace_id);
CREATE INDEX idx_coach_habits_category ON public.coach_habits(category);

-- RLS Policies for coach_habits
ALTER TABLE public.coach_habits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own habits"
  ON public.coach_habits
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own habits"
  ON public.coach_habits
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own habits"
  ON public.coach_habits
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own habits"
  ON public.coach_habits
  FOR DELETE
  USING (auth.uid() = user_id);

-- Trigger to update updated_at timestamp
CREATE TRIGGER update_coach_habits_updated_at
  BEFORE UPDATE ON public.coach_habits
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- Table: coach_routines
-- Purpose: Store reusable routine templates with steps
-- ============================================================
CREATE TABLE IF NOT EXISTS public.coach_routines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  workspace_id UUID NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  steps JSONB NOT NULL DEFAULT '[]'::jsonb,
  duration_minutes INTEGER,
  category TEXT CHECK (category IN ('creative', 'outreach', 'wellness', 'admin', 'learning')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_coach_routines_user ON public.coach_routines(user_id);
CREATE INDEX idx_coach_routines_workspace ON public.coach_routines(workspace_id);
CREATE INDEX idx_coach_routines_category ON public.coach_routines(category);

-- RLS Policies for coach_routines
ALTER TABLE public.coach_routines ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own routines"
  ON public.coach_routines
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own routines"
  ON public.coach_routines
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own routines"
  ON public.coach_routines
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own routines"
  ON public.coach_routines
  FOR DELETE
  USING (auth.uid() = user_id);

-- Trigger to update updated_at timestamp
CREATE TRIGGER update_coach_routines_updated_at
  BEFORE UPDATE ON public.coach_routines
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- Table: coach_calendar_events
-- Purpose: Calendar events from weekly plans, habits, and manual entries
-- ============================================================
CREATE TABLE IF NOT EXISTS public.coach_calendar_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  workspace_id UUID NOT NULL,
  event_type TEXT NOT NULL CHECK (event_type IN ('task', 'habit', 'routine', 'manual', 'goal_milestone')),
  source_id UUID, -- References task, habit, routine, or goal
  title TEXT NOT NULL,
  description TEXT,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ,
  category TEXT CHECK (category IN ('creative', 'promotional', 'relationship', 'career', 'wellbeing', 'admin', 'learning')),
  metadata JSONB DEFAULT '{}'::jsonb,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_coach_calendar_user ON public.coach_calendar_events(user_id);
CREATE INDEX idx_coach_calendar_workspace ON public.coach_calendar_events(workspace_id);
CREATE INDEX idx_coach_calendar_start_time ON public.coach_calendar_events(start_time);
CREATE INDEX idx_coach_calendar_event_type ON public.coach_calendar_events(event_type);
CREATE INDEX idx_coach_calendar_source_id ON public.coach_calendar_events(source_id);

-- RLS Policies for coach_calendar_events
ALTER TABLE public.coach_calendar_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own calendar events"
  ON public.coach_calendar_events
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own calendar events"
  ON public.coach_calendar_events
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own calendar events"
  ON public.coach_calendar_events
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own calendar events"
  ON public.coach_calendar_events
  FOR DELETE
  USING (auth.uid() = user_id);

-- Trigger to update updated_at timestamp
CREATE TRIGGER update_coach_calendar_events_updated_at
  BEFORE UPDATE ON public.coach_calendar_events
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- Comments for documentation
-- ============================================================
COMMENT ON TABLE public.coach_habits IS 'CoachOS Phase 2: User habits with streak tracking';
COMMENT ON TABLE public.coach_routines IS 'CoachOS Phase 2: Reusable routine templates with multi-step workflows';
COMMENT ON TABLE public.coach_calendar_events IS 'CoachOS Phase 2: Calendar events from tasks, habits, routines, and manual entries';

COMMENT ON COLUMN public.coach_habits.frequency IS 'How often the habit should be completed: daily, 3x_week, weekly, monthly';
COMMENT ON COLUMN public.coach_habits.streak IS 'Current consecutive completion streak';
COMMENT ON COLUMN public.coach_habits.last_completed IS 'When the habit was last marked complete';

COMMENT ON COLUMN public.coach_routines.steps IS 'Array of routine steps with titles and estimated durations';
COMMENT ON COLUMN public.coach_routines.duration_minutes IS 'Total estimated duration for the complete routine';

COMMENT ON COLUMN public.coach_calendar_events.event_type IS 'Source type: task (from weekly plan), habit (recurring), routine (from template), manual, goal_milestone';
COMMENT ON COLUMN public.coach_calendar_events.source_id IS 'References the originating task, habit, routine, or goal';
COMMENT ON COLUMN public.coach_calendar_events.metadata IS 'Additional flexible data (e.g., routine steps, habit progress)';
