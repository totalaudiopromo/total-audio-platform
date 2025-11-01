# Run This in Supabase SQL Editor

**URL**: https://supabase.com/dashboard/project/mjfhegawkusjlkcgfevp/sql

---

Copy the **ENTIRE** contents of this file and paste into Supabase SQL Editor, then click "Run":

`supabase/migrations/010_tracker_prd_schema.sql`

---

## What Will Happen:

1. ✅ Adds intelligence fields to campaigns table (success_rate, cost_per_result, performance_score, etc.)
2. ✅ Relaxes constraints for flexible campaign creation
3. ✅ Creates benchmarks table with 30+ industry data points
4. ✅ Creates campaign_activities table for real-time tracking
5. ✅ Creates campaign_insights table for AI recommendations
6. ✅ Adds auto-calculation trigger (performance metrics update automatically)
7. ✅ Refreshes PostgREST schema cache

## After Running:

You should see:

- "Success. No rows returned" message
- No errors

Then run this to verify:

```sql
-- Check benchmarks loaded
SELECT COUNT(*) FROM benchmarks;
-- Should return 30+

-- Check trigger exists
SELECT tgname FROM pg_trigger WHERE tgrelid = 'campaigns'::regclass;
-- Should show: trigger_calculate_intelligence

-- Check new columns exist
SELECT column_name FROM information_schema.columns
WHERE table_name = 'campaigns'
AND column_name IN ('success_rate', 'cost_per_result', 'performance_score');
-- Should return 3 rows
```

## If You See Errors:

**"relation already exists"**: Some tables already exist - that's OK, migration handles this

**"column already exists"**: Good! Migration uses IF NOT EXISTS

**"permission denied"**: Make sure you're logged into the correct Supabase project

---

**After migration completes**: Restart your dev server and test creating a campaign!
