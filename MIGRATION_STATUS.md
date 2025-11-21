# Supabase Migration Status - Golden Verify + Testing Integration

**Date**: 2025-11-11
**Migration File**: `supabase/migrations/20251111_golden_verify_integration.sql`
**Status**: Ready to Apply (Manual Step Required)

## Summary

The Golden Verify + Testing Integration migration is ready but requires manual application through the Supabase Dashboard SQL Editor due to DDL statement restrictions in automated tools.

## What Was Attempted

1. Read Supabase credentials from `apps/tracker/.env.local`
2. Read migration SQL file (340 lines, 13.5 KB)
3. Verified tables don't exist yet via REST API
4. Copied SQL to clipboard for easy pasting
5.  Automated execution blocked (DDL requires dashboard access)

## Why Automated Execution Failed

- **Supabase REST API**: Cannot execute DDL statements (CREATE TABLE, CREATE INDEX, etc.)
- **Supabase CLI**: Migration history mismatch between local and remote
- **Puppeteer Automation**: Requires authentication (can't auto-login)
- **psql Command**: Not installed locally

## Migration Contents

The migration creates:

### Tables (2)

- `golden_history` - Store Golden Verify deployment health checks
- `testing_results` - Store @total-audio/testing agent results

### Views (2)

- `golden_summary` - 30-day summary by app
- `testing_summary` - Testing pass rates by app/suite/type

### Functions (2)

- `get_latest_golden_status()` - Latest status per app
- `get_testing_pass_rate(app, days)` - Calculate pass rates

### Security (6 RLS Policies)

- Service role full access (for ingestion scripts)
- Authenticated users read-only access
- Admin insert permissions

### Sample Data

- 4 golden_history records (audio-intel, tracker, pitch-generator)
- 5 testing_results records (various test types)

## Manual Application Steps

### Step 1: Open SQL Editor

Navigate to: https://supabase.com/dashboard/project/ucncbighzqudaszewjrv/sql/new

### Step 2: Copy SQL

```bash
cat supabase/migrations/20251111_golden_verify_integration.sql | pbcopy
```

Or open the file manually:

```bash
open supabase/migrations/20251111_golden_verify_integration.sql
```

### Step 3: Execute Migration

1. Paste the entire SQL into the SQL Editor
2. Click "Run" button
3. Wait for success confirmation

### Step 4: Verify Success

Run the verification script:

```bash
bash scripts/apply-migration-direct.sh
```

Or check manually:

```bash
curl -s "https://ucncbighzqudaszewjrv.supabase.co/rest/v1/golden_history?select=count" \
  -H "apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVjbmNiaWdoenF1ZGFzemV3anJ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg5MTU2MjEsImV4cCI6MjA3NDQ5MTYyMX0.byAFslDRcX_Peto69Z7jG90CoWnQRaqNGOzhxteAgCI" \
  -H "Prefer: count=exact"
```

Expected response:

```json
[{ "count": 4 }]
```

## After Successful Migration

### 1. Verify Tables in Dashboard

https://supabase.com/dashboard/project/ucncbighzqudaszewjrv/editor

Check:

- `golden_history` table exists with 4 sample records
- `testing_results` table exists with 5 sample records
- Views are accessible
- RLS policies are enabled

### 2. Test Queries

```sql
-- Get latest status for all apps
SELECT * FROM get_latest_golden_status();

-- Get testing pass rates (last 7 days)
SELECT * FROM get_testing_pass_rate(NULL, 7);

-- View golden summary
SELECT * FROM golden_summary;

-- View testing summary
SELECT * FROM testing_summary;
```

### 3. Integration with Command Centre

Once verified, the tables are ready for:

- Golden Intelligence script ingestion
- Testing agent result storage
- Ops Console real-time dashboard
- Historical trend analysis

## Scripts Created

### `scripts/apply-migration-direct.sh`

- Checks if tables exist
- Provides copy-paste instructions
- Verifies successful application
- Usage: `bash scripts/apply-migration-direct.sh`

### `scripts/apply-migration.mjs` (Alternative)

- Node.js approach using Supabase client
- Requires dependencies available in tracker app
- Usage: `node scripts/apply-migration.mjs` (not functional without deps)

## Database Connection Details

**Project URL**: https://ucncbighzqudaszewjrv.supabase.co
**Project Ref**: ucncbighzqudaszewjrv
**Environment**: Production
**Credentials Location**: `apps/tracker/.env.local`

## Expected Post-Migration State

### Tables

- `public.golden_history` (4 sample records)
- `public.testing_results` (5 sample records)

### Indexes

- 8 total indexes for query optimization

### Security

- RLS enabled on both tables
- 6 policies configured

### Data Populated

- Golden Verify sample data for all 3 apps
- Testing results sample data for various test types

## Troubleshooting

### If Migration Fails

**Constraint Error**:

```sql
-- Check for existing tables
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name IN ('golden_history', 'testing_results');
```

**Permission Error**:

- Ensure you're logged in as project owner
- Check service role key is correct in `.env.local`

**Duplicate Key Error**:

```sql
-- Tables already exist, check if migration was partially applied
SELECT COUNT(*) FROM golden_history;
SELECT COUNT(*) FROM testing_results;
```

### Migration Recovery

If migration partially applied:

```sql
-- Drop tables (use with caution!)
DROP TABLE IF EXISTS testing_results CASCADE;
DROP TABLE IF EXISTS golden_history CASCADE;

-- Then re-run full migration
```

## Next Steps After Completion

1. Verify tables and data exist
2. Update Golden Intelligence script to use new tables
3. Update testing agents to store results in `testing_results`
4. Integrate with Command Centre Ops Console
5. Set up automated ingestion pipelines
6. Configure monitoring and alerting

## Files Modified/Created

- `supabase/migrations/20251111_golden_verify_integration.sql` (main migration)
- `scripts/apply-migration-direct.sh` (verification script)
- `scripts/apply-migration.mjs` (alternative approach)
- `scripts/apply-migration.js` (Node.js version)
- `MIGRATION_STATUS.md` (this file)

## Support Resources

- Supabase Dashboard: https://supabase.com/dashboard/project/ucncbighzqudaszewjrv
- SQL Editor: https://supabase.com/dashboard/project/ucncbighzqudaszewjrv/sql/new
- Table Editor: https://supabase.com/dashboard/project/ucncbighzqudaszewjrv/editor
- Supabase Docs: https://supabase.com/docs/guides/database/migrations

---

**Status**: Awaiting manual execution via Supabase Dashboard SQL Editor
**Estimated Time**: 2-3 minutes to copy, paste, and execute
**Risk Level**: Low (sample data only, no production impact)
