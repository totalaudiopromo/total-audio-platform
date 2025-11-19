-- =====================================================
-- RLS SECURITY FIX MIGRATION
-- =====================================================
-- Purpose: Enable RLS and create policies for all public tables
-- Date: 2025-11-16
-- Fixes: 237 RLS security warnings in Supabase dashboard
-- =====================================================

-- =====================================================
-- CONTACTS TABLE
-- =====================================================
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS users_view_own_contacts ON public.contacts;
CREATE POLICY users_view_own_contacts
  ON public.contacts FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS users_insert_own_contacts ON public.contacts;
CREATE POLICY users_insert_own_contacts
  ON public.contacts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS users_update_own_contacts ON public.contacts;
CREATE POLICY users_update_own_contacts
  ON public.contacts FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS users_delete_own_contacts ON public.contacts;
CREATE POLICY users_delete_own_contacts
  ON public.contacts FOR DELETE
  USING (auth.uid() = user_id);

-- =====================================================
-- PITCH_TEMPLATES TABLE
-- =====================================================
ALTER TABLE public.pitch_templates ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS users_view_pitch_templates ON public.pitch_templates;
CREATE POLICY users_view_pitch_templates
  ON public.pitch_templates FOR SELECT
  USING (auth.uid() = user_id OR is_system_template = TRUE);

DROP POLICY IF EXISTS users_insert_own_pitch_templates ON public.pitch_templates;
CREATE POLICY users_insert_own_pitch_templates
  ON public.pitch_templates FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS users_update_own_pitch_templates ON public.pitch_templates;
CREATE POLICY users_update_own_pitch_templates
  ON public.pitch_templates FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS users_delete_own_pitch_templates ON public.pitch_templates;
CREATE POLICY users_delete_own_pitch_templates
  ON public.pitch_templates FOR DELETE
  USING (auth.uid() = user_id);

-- =====================================================
-- BENCHMARKS TABLE
-- =====================================================
ALTER TABLE public.benchmarks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS users_view_benchmarks ON public.benchmarks;
CREATE POLICY users_view_benchmarks
  ON public.benchmarks FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS users_insert_benchmarks ON public.benchmarks;
CREATE POLICY users_insert_benchmarks
  ON public.benchmarks FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS users_update_benchmarks ON public.benchmarks;
CREATE POLICY users_update_benchmarks
  ON public.benchmarks FOR UPDATE
  USING (auth.uid() = user_id);

-- =====================================================
-- AGENT_SESSIONS TABLE
-- =====================================================
ALTER TABLE public.agent_sessions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS users_view_own_agent_sessions ON public.agent_sessions;
CREATE POLICY users_view_own_agent_sessions
  ON public.agent_sessions FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS users_insert_own_agent_sessions ON public.agent_sessions;
CREATE POLICY users_insert_own_agent_sessions
  ON public.agent_sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS users_update_own_agent_sessions ON public.agent_sessions;
CREATE POLICY users_update_own_agent_sessions
  ON public.agent_sessions FOR UPDATE
  USING (auth.uid() = user_id);

-- =====================================================
-- AGENT_MESSAGES TABLE
-- =====================================================
ALTER TABLE public.agent_messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS users_view_own_agent_messages ON public.agent_messages;
CREATE POLICY users_view_own_agent_messages
  ON public.agent_messages FOR SELECT
  USING (
    auth.uid() IN (
      SELECT user_id FROM public.agent_sessions WHERE id = session_id
    )
  );

DROP POLICY IF EXISTS users_insert_own_agent_messages ON public.agent_messages;
CREATE POLICY users_insert_own_agent_messages
  ON public.agent_messages FOR INSERT
  WITH CHECK (
    auth.uid() IN (
      SELECT user_id FROM public.agent_sessions WHERE id = session_id
    )
  );

-- =====================================================
-- CAMPAIGN_COLLABORATORS TABLE
-- =====================================================
ALTER TABLE public.campaign_collaborators ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS users_view_campaign_collaborators ON public.campaign_collaborators;
CREATE POLICY users_view_campaign_collaborators
  ON public.campaign_collaborators FOR SELECT
  USING (auth.uid() = user_id OR auth.uid() = collaborator_user_id);

DROP POLICY IF EXISTS users_insert_campaign_collaborators ON public.campaign_collaborators;
CREATE POLICY users_insert_campaign_collaborators
  ON public.campaign_collaborators FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS users_update_campaign_collaborators ON public.campaign_collaborators;
CREATE POLICY users_update_campaign_collaborators
  ON public.campaign_collaborators FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS users_delete_campaign_collaborators ON public.campaign_collaborators;
CREATE POLICY users_delete_campaign_collaborators
  ON public.campaign_collaborators FOR DELETE
  USING (auth.uid() = user_id);

-- =====================================================
-- PITCHES TABLE
-- =====================================================
ALTER TABLE public.pitches ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS users_view_own_pitches ON public.pitches;
CREATE POLICY users_view_own_pitches
  ON public.pitches FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS users_insert_own_pitches ON public.pitches;
CREATE POLICY users_insert_own_pitches
  ON public.pitches FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS users_update_own_pitches ON public.pitches;
CREATE POLICY users_update_own_pitches
  ON public.pitches FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS users_delete_own_pitches ON public.pitches;
CREATE POLICY users_delete_own_pitches
  ON public.pitches FOR DELETE
  USING (auth.uid() = user_id);

-- =====================================================
-- SKILLS TABLE
-- =====================================================
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS users_view_own_skills ON public.skills;
CREATE POLICY users_view_own_skills
  ON public.skills FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS users_insert_own_skills ON public.skills;
CREATE POLICY users_insert_own_skills
  ON public.skills FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS users_update_own_skills ON public.skills;
CREATE POLICY users_update_own_skills
  ON public.skills FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS users_delete_own_skills ON public.skills;
CREATE POLICY users_delete_own_skills
  ON public.skills FOR DELETE
  USING (auth.uid() = user_id);

-- =====================================================
-- SKILL_EXECUTIONS TABLE
-- =====================================================
ALTER TABLE public.skill_executions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS users_view_own_skill_executions ON public.skill_executions;
CREATE POLICY users_view_own_skill_executions
  ON public.skill_executions FOR SELECT
  USING (
    auth.uid() IN (
      SELECT user_id FROM public.skills WHERE id = skill_id
    )
  );

DROP POLICY IF EXISTS users_insert_own_skill_executions ON public.skill_executions;
CREATE POLICY users_insert_own_skill_executions
  ON public.skill_executions FOR INSERT
  WITH CHECK (
    auth.uid() IN (
      SELECT user_id FROM public.skills WHERE id = skill_id
    )
  );

-- =====================================================
-- USER_PITCH_SETTINGS TABLE
-- =====================================================
ALTER TABLE public.user_pitch_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS users_view_own_pitch_settings ON public.user_pitch_settings;
CREATE POLICY users_view_own_pitch_settings
  ON public.user_pitch_settings FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS users_insert_own_pitch_settings ON public.user_pitch_settings;
CREATE POLICY users_insert_own_pitch_settings
  ON public.user_pitch_settings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS users_update_own_pitch_settings ON public.user_pitch_settings;
CREATE POLICY users_update_own_pitch_settings
  ON public.user_pitch_settings FOR UPDATE
  USING (auth.uid() = user_id);

-- =====================================================
-- SERVICE ROLE POLICIES (for all tables)
-- =====================================================
-- Allow service role full access for server-side operations

DROP POLICY IF EXISTS service_role_all_contacts ON public.contacts;
CREATE POLICY service_role_all_contacts
  ON public.contacts FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS service_role_all_pitch_templates ON public.pitch_templates;
CREATE POLICY service_role_all_pitch_templates
  ON public.pitch_templates FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS service_role_all_benchmarks ON public.benchmarks;
CREATE POLICY service_role_all_benchmarks
  ON public.benchmarks FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS service_role_all_agent_sessions ON public.agent_sessions;
CREATE POLICY service_role_all_agent_sessions
  ON public.agent_sessions FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS service_role_all_agent_messages ON public.agent_messages;
CREATE POLICY service_role_all_agent_messages
  ON public.agent_messages FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS service_role_all_campaign_collaborators ON public.campaign_collaborators;
CREATE POLICY service_role_all_campaign_collaborators
  ON public.campaign_collaborators FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS service_role_all_pitches ON public.pitches;
CREATE POLICY service_role_all_pitches
  ON public.pitches FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS service_role_all_skills ON public.skills;
CREATE POLICY service_role_all_skills
  ON public.skills FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS service_role_all_skill_executions ON public.skill_executions;
CREATE POLICY service_role_all_skill_executions
  ON public.skill_executions FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS service_role_all_user_pitch_settings ON public.user_pitch_settings;
CREATE POLICY service_role_all_user_pitch_settings
  ON public.user_pitch_settings FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- =====================================================
-- MIGRATION COMPLETE
-- =====================================================

DO $$
BEGIN
  RAISE NOTICE '✅ RLS Security Fix Migration Complete';
  RAISE NOTICE '   - Enabled RLS on 10 core tables';
  RAISE NOTICE '   - Created user isolation policies (SELECT, INSERT, UPDATE, DELETE)';
  RAISE NOTICE '   - Created service role bypass policies';
  RAISE NOTICE '   - All user data now properly isolated by user_id';
  RAISE NOTICE '   - Service role maintains full access for server operations';
END $$;
