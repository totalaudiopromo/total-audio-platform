# Tracker App Migration & Debugging Instructions

## Current Issues & Fixes

### 1. Database Schema Migration Required

**Problem**: The `campaigns` table is missing the `artist_name` column and has overly strict constraints.

**Solution**: Run this SQL in your [Supabase SQL Editor](https://supabase.com/dashboard/project/mjfhegawkusjlkcgfevp/sql):

```sql
-- Add artist_name column and relax constraints for MVP flexibility
ALTER TABLE campaigns
  ADD COLUMN IF NOT EXISTS artist_name VARCHAR(255);

-- Make platform, genre, start_date nullable for flexible campaign creation
ALTER TABLE campaigns
  ALTER COLUMN platform DROP NOT NULL,
  ALTER COLUMN genre DROP NOT NULL,
  ALTER COLUMN start_date DROP NOT NULL;

-- Update existing campaigns to have artist_name if missing
UPDATE campaigns
SET artist_name = name
WHERE artist_name IS NULL;

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_campaigns_artist_name ON campaigns(artist_name);
CREATE INDEX IF NOT EXISTS idx_campaigns_user_id ON campaigns(user_id);

-- Refresh PostgREST schema cache (CRITICAL!)
NOTIFY pgrst, 'reload schema';
```

**Verification**: After running, check that columns exist:

```sql
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'campaigns'
ORDER BY ordinal_position;
```

### 2. Dashboard Error Handling ( FIXED)

**Problem**: Dashboard crashed when API returned error objects instead of arrays.

**Fix Applied**: [app/dashboard/page.tsx:23-27](app/dashboard/page.tsx#L23-L27)

- Now checks if response is an array before processing
- Shows clear error message to users when API fails
- Prevents server-side crashes from filter/reduce operations

### 3. Dev Server Port Conflict

**Problem**: Port 3000 may be in use by another process.

**Solutions**:

```bash
# Option 1: Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Option 2: Use different port
PORT=3001 npm run dev

# Option 3: Check what's using port 3000
lsof -i:3000
```

## Running the Tracker App

```bash
# Navigate to tracker directory
cd /Users/chrisschofield/workspace/active/total-audio-platform/apps/tracker

# Install dependencies (if needed)
npm install

# Clear port and start dev server
lsof -ti:3000 | xargs kill -9 2>/dev/null || true
npm run dev

# Alternative: Use different port
PORT=3001 npm run dev
```

## Debugging Campaign Creation

Current debug logs are written to `/tmp/tracker-campaign-debug.log`:

```bash
# Watch debug logs in real-time
tail -f /tmp/tracker-campaign-debug.log

# View recent errors
grep "error" /tmp/tracker-campaign-debug.log | tail -20
```

**Log Events**:

- `campaign:create:start` - Initial request received
- `campaign:create:retry` - Column removed and retrying
- `campaign:create:success` - Campaign created
- `campaign:create:error` - Final error after all retries

## Common Error Codes

- **PGRST204**: Column doesn't exist in PostgREST API (schema not refreshed)
- **23502**: NOT NULL constraint violation
- **42703**: Column doesn't exist in database

## Supabase Connection Details

**Project**: https://supabase.com/dashboard/project/mjfhegawkusjlkcgfevp
**Database**: `postgres`
**Pooler Connection**: `postgresql://postgres.mjfhegawkusjlkcgfevp:PostTracker123!@aws-0-eu-west-2.pooler.supabase.com:6543/postgres`

## Next Steps After Migration

1. Run the SQL migration in Supabase SQL Editor
2. Verify schema with the verification query
3. Clear port 3000: `lsof -ti:3000 | xargs kill -9`
4. Start dev server: `npm run dev`
5. Test campaign creation in browser
6. Check `/tmp/tracker-campaign-debug.log` for any remaining issues

## Testing Checklist

- [ ] Migration SQL executed successfully
- [ ] Schema verification shows all columns
- [ ] PostgREST cache refreshed (NOTIFY command)
- [ ] Dev server starts without port errors
- [ ] Dashboard loads without API errors
- [ ] Can create campaign with minimal fields (name + artist_name)
- [ ] Can create campaign with all fields
- [ ] Debug logs show `campaign:create:success`
- [ ] Dashboard displays created campaigns correctly

## Files Modified

-  [app/dashboard/page.tsx](app/dashboard/page.tsx) - Added error handling
-  [supabase/migrations/002_add_artist_name_relax_constraints.sql](supabase/migrations/002_add_artist_name_relax_constraints.sql) - Migration file created
- ℹ [app/api/campaigns/route.ts](app/api/campaigns/route.ts) - Already has retry logic, should work after migration

## Support

If issues persist after migration:

1. Check browser console for client-side errors
2. Check `/tmp/tracker-campaign-debug.log` for server-side errors
3. Verify Supabase RLS policies allow your user to insert campaigns
4. Confirm environment variables in `.env.local` are correct
