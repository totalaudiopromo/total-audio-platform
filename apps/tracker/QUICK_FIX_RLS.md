# Quick Fix: Campaign Collaborators RLS Policy Recursion

## The Problem

When loading the dashboard, you see this error:

```
Failed to load campaigns
infinite recursion detected in policy for relation "campaign_collaborators"
```

This happens because RLS policies on `campaign_collaborators` reference `campaigns`, and `campaigns` policies reference `campaign_collaborators`, creating a circular dependency.

## The Solution

Apply the SQL fix via Supabase Dashboard:

### Step 1: Open Supabase SQL Editor

1. Go to: https://app.supabase.com/project/ucncbighzqudaszewjrv
2. Click **SQL Editor**in the left sidebar
3. Click **New Query**

### Step 2: Copy and Paste This SQL

```sql
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
```

### Step 3: Run the Query

1. Click **Run**(or press Cmd+Enter / Ctrl+Enter)
2. You should see: "Success. No rows returned"

### Step 4: Verify the Fix

1. Go back to: http://localhost:3004/dashboard
2. Refresh the page
3. The campaigns should now load without the recursion error!

## What This Fix Does

- **Removes all cross-table policy checks**that were causing recursion
- **Creates simple policies**that only check `user_id` directly
- **Allows users to manage their own collaborator records**without recursion

## Alternative: If You Prefer Command Line

If you have Supabase CLI configured:

```bash
cd /Users/chrisschofield/workspace/active/total-audio-platform/apps/tracker
supabase db execute --file fix-campaign-collaborators-rls-simple.sql
```

## Need Help?

If you still see errors after applying this fix:

1. Check the browser console for the exact error message
2. Verify the SQL executed successfully in Supabase Dashboard
3. Try refreshing the dashboard page

The fix is safe to apply - it only modifies RLS policies, not your data.
