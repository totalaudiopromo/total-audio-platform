-- Fix RLS Policy Recursion for campaign_collaborators (Simplified Version)
-- This version avoids ALL cross-table checks to prevent recursion

-- Drop all existing policies
DROP POLICY IF EXISTS "Users can view campaign collaborators" ON campaign_collaborators;
DROP POLICY IF EXISTS "Users can view own campaign collaborators" ON campaign_collaborators;
DROP POLICY IF EXISTS "Campaign owners can manage collaborators" ON campaign_collaborators;
DROP POLICY IF EXISTS "Users can view accessible campaign collaborators" ON campaign_collaborators;
DROP POLICY IF EXISTS "Users can insert campaign collaborators" ON campaign_collaborators;
DROP POLICY IF EXISTS "Users can update campaign collaborators" ON campaign_collaborators;
DROP POLICY IF EXISTS "Users can delete campaign collaborators" ON campaign_collaborators;
DROP POLICY IF EXISTS "Users can view own collaborator records" ON campaign_collaborators;
DROP POLICY IF EXISTS "Users can view collaborators for owned campaigns" ON campaign_collaborators;
DROP POLICY IF EXISTS "Users can insert own collaborator records" ON campaign_collaborators;
DROP POLICY IF EXISTS "Campaign owners can add collaborators" ON campaign_collaborators;
DROP POLICY IF EXISTS "Users can update own collaborator records" ON campaign_collaborators;
DROP POLICY IF EXISTS "Campaign owners can update collaborators" ON campaign_collaborators;
DROP POLICY IF EXISTS "Users can delete own collaborator records" ON campaign_collaborators;
DROP POLICY IF EXISTS "Campaign owners can delete collaborators" ON campaign_collaborators;

-- Simple policies that ONLY check user_id - no cross-table references
-- This completely avoids recursion

-- Users can view collaborator records where they are the user_id
CREATE POLICY "Users can view own collaborator records" ON campaign_collaborators
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Users can view collaborator records where they are the invited_by
CREATE POLICY "Users can view records they invited" ON campaign_collaborators
  FOR SELECT 
  USING (auth.uid() = invited_by);

-- Users can insert themselves as collaborators
CREATE POLICY "Users can insert own collaborator records" ON campaign_collaborators
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own collaborator records
CREATE POLICY "Users can update own collaborator records" ON campaign_collaborators
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Users can delete their own collaborator records
CREATE POLICY "Users can delete own collaborator records" ON campaign_collaborators
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Note: This simplified approach means campaign owners can't directly manage
-- collaborators through campaign_collaborators table. They would need to:
-- 1. Use the campaign_access table instead, OR
-- 2. Have a separate admin function with SECURITY DEFINER, OR  
-- 3. The user_id in campaign_collaborators would need to match the campaign owner
--
-- For now, this fixes the recursion issue. If more complex access control
-- is needed, we can add a SECURITY DEFINER function later.

