# 📊 Apply Database Migration (2 minutes)

The tracker needs these database tables created in Supabase.

## Quick Steps:

### 1. Open Supabase SQL Editor
**Direct link**: https://supabase.com/dashboard/project/ucncbighzqudaszewjrv/sql/new

### 2. Copy Migration SQL
The migration file is at: `apps/tracker/supabase/migrations/20251119_tracker_production_schema.sql`

Or copy from terminal:
```bash
cat apps/tracker/supabase/migrations/20251119_tracker_production_schema.sql | pbcopy
```

### 3. Paste and Run
1. Paste the SQL into the Supabase SQL Editor
2. Click **RUN** button (or press Cmd+Enter)
3. Wait ~2-3 seconds
4. You should see "Success. No rows returned"

### 4. Verify Migration
Run this query to check if tables exist:
```sql
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN ('campaigns', 'campaign_contacts', 'campaign_activities', 'campaign_metrics', 'warm_reports');
```

You should see all 5 tables listed.

## What the Migration Does

- ✅ Adds integration fields to `campaigns` table (gmail_label, mailchimp_list_id, etc.)
- ✅ Creates `campaign_contacts` table
- ✅ Creates `campaign_activities` table (timeline events)
- ✅ Creates `campaign_metrics` table (plays, emails, opens, etc.)
- ✅ Creates `warm_reports` table (radio play submissions)
- ✅ Sets up Row Level Security (RLS) policies
- ✅ Creates indexes for performance

## Migration is Idempotent

Safe to run multiple times - it checks if columns/tables exist before creating them.

## After Migration

Run the import script to load Liberty campaign data:
```bash
cd apps/tracker
npm run import:liberty
```

Or manually:
```bash
cd apps/tracker
npx tsx scripts/import-liberty-campaigns.ts
```
