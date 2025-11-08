# Fix Campaign Collaborators RLS Policy Recursion

This script fixes the infinite recursion error when querying campaigns.

## Problem

The `campaign_collaborators` table has RLS policies that reference the `campaigns` table, and the `campaigns` table policies reference `campaign_collaborators`, creating a circular dependency.

## Solution

Apply the simplified SQL script that removes all cross-table checks and only uses direct `user_id` checks.

## How to Apply

### Option 1: Via Supabase Dashboard (Recommended)

1. Go to: https://app.supabase.com/project/ucncbighzqudaszewjrv
2. Navigate to: SQL Editor
3. Copy and paste the contents of `fix-campaign-collaborators-rls-simple.sql`
4. Click "Run" to execute

### Option 2: Via Supabase CLI

```bash
cd /Users/chrisschofield/workspace/active/total-audio-platform/apps/tracker
supabase db execute --file fix-campaign-collaborators-rls-simple.sql
```

### Option 3: Via psql

```bash
psql "postgresql://postgres:[YOUR_PASSWORD]@db.ucncbighzqudaszewjrv.supabase.co:5432/postgres" -f fix-campaign-collaborators-rls-simple.sql
```

## What the Fix Does

1. Drops all existing policies on `campaign_collaborators`
2. Creates new simple policies that:
   - Only check `user_id` directly (no cross-table references)
   - Allow users to view their own collaborator records
   - Allow users to view records they invited
   - Allow users to manage their own records

## Testing

After applying the fix:

1. Refresh the dashboard at http://localhost:3004/dashboard
2. The campaigns should load without the recursion error
3. Check browser console for any remaining errors

## If Issues Persist

If recursion still occurs, we can:

1. Temporarily disable RLS on `campaign_collaborators` entirely
2. Use a SECURITY DEFINER function to bypass RLS checks
3. Restructure the access control to use only `campaign_access` table
