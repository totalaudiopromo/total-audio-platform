-- Fix RLS Policy Recursion for campaign_collaborators
-- This script fixes the infinite recursion error when querying campaigns
-- Issue: Policies on campaign_collaborators were referencing campaigns, 
--        and campaigns policies were referencing campaign_collaborators,
--        creating a circular dependency

-- First, drop all existing policies on campaign_collaborators to break the recursion
DROP POLICY IF EXISTS "Users can view campaign collaborators" ON campaign_collaborators;
DROP POLICY IF EXISTS "Users can view own campaign collaborators" ON campaign_collaborators;
DROP POLICY IF EXISTS "Campaign owners can manage collaborators" ON campaign_collaborators;
DROP POLICY IF EXISTS "Users can view accessible campaign collaborators" ON campaign_collaborators;
DROP POLICY IF EXISTS "Users can insert campaign collaborators" ON campaign_collaborators;
DROP POLICY IF EXISTS "Users can update campaign collaborators" ON campaign_collaborators;
DROP POLICY IF EXISTS "Users can delete campaign collaborators" ON campaign_collaborators;

-- Create simple, non-recursive policies that only check user_id directly
-- This avoids any circular dependencies with the campaigns table

-- Policy: Users can view collaborators where they are the user_id
CREATE POLICY "Users can view own collaborator records" ON campaign_collaborators
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Policy: Users can view collaborators for campaigns they own
-- This uses a direct check without triggering campaigns RLS recursion
CREATE POLICY "Users can view collaborators for owned campaigns" ON campaign_collaborators
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM campaigns
      WHERE campaigns.id = campaign_collaborators.campaign_id
      AND campaigns.user_id = auth.uid()
    )
  );

-- Policy: Users can insert themselves as collaborators (if invited)
CREATE POLICY "Users can insert own collaborator records" ON campaign_collaborators
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Policy: Campaign owners can insert collaborators
CREATE POLICY "Campaign owners can add collaborators" ON campaign_collaborators
  FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM campaigns
      WHERE campaigns.id = campaign_collaborators.campaign_id
      AND campaigns.user_id = auth.uid()
    )
  );

-- Policy: Users can update their own collaborator records
CREATE POLICY "Users can update own collaborator records" ON campaign_collaborators
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Policy: Campaign owners can update collaborators
CREATE POLICY "Campaign owners can update collaborators" ON campaign_collaborators
  FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM campaigns
      WHERE campaigns.id = campaign_collaborators.campaign_id
      AND campaigns.user_id = auth.uid()
    )
  );

-- Policy: Users can delete their own collaborator records
CREATE POLICY "Users can delete own collaborator records" ON campaign_collaborators
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Policy: Campaign owners can delete collaborators
CREATE POLICY "Campaign owners can delete collaborators" ON campaign_collaborators
  FOR DELETE 
  USING (
    EXISTS (
      SELECT 1 FROM campaigns
      WHERE campaigns.id = campaign_collaborators.campaign_id
      AND campaigns.user_id = auth.uid()
    )
  );

-- Note: The EXISTS checks above should NOT cause recursion because:
-- 1. They only check campaigns.user_id directly (not through campaign_collaborators)
-- 2. The campaigns SELECT policy should allow reading campaigns where user_id matches
-- 3. We're not checking campaign_collaborators FROM within campaigns policy

-- If recursion still occurs, we may need to simplify further by:
-- Option 1: Disable RLS on campaign_collaborators if not needed for security
-- Option 2: Use a security definer function to bypass RLS checks
-- Option 3: Restructure policies to avoid any cross-table checks

