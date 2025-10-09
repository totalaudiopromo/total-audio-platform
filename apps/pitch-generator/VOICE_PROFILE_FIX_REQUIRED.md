# Voice Profile Database Migration Required

## Current Status: ⚠️ BLOCKED

The voice profile feature cannot save data until a database migration is run.

## Problem

The `user_pitch_settings` table has `user_id` column as **UUID** type, but the application passes **email addresses** (TEXT type) like `"founder@totalaudiopromo.com"`.

## Error Message

```
Error code: 22P02
Message: invalid input syntax for type uuid: "founder@totalaudiopromo.com"
```

## Solution: Run This SQL

### ✅ Steps to Fix

1. **Open Supabase SQL Editor**
   [https://supabase.com/dashboard/project/ucncbighzqudaszewjrv/sql](https://supabase.com/dashboard/project/ucncbighzqudaszewjrv/sql)

2. **Click "New query"**

3. **Paste this SQL:**

```sql
ALTER TABLE user_pitch_settings
ALTER COLUMN user_id TYPE TEXT USING user_id::TEXT;
```

4. **Click RUN** (or CMD+Enter)

5. **Verify the change** (optional):

```sql
SELECT column_name, data_type, udt_name
FROM information_schema.columns
WHERE table_name = 'user_pitch_settings'
  AND column_name = 'user_id';
```

Expected result: `data_type = 'text'`

6. **Test voice profile save** at [http://localhost:3001/profile/voice](http://localhost:3001/profile/voice)

## Why Can't Claude Run This Automatically?

Supabase doesn't expose arbitrary SQL execution via API without custom RPC functions. The API attempts failed with:

- `PGRST202`: Could not find function `exec_raw_sql`
- `PGRST202`: Could not find function `exec_sql`
- `PGRST202`: Could not find function `exec`

The only way to run database migrations in Supabase is:
1. SQL Editor (dashboard)
2. Supabase CLI with `supabase db push`
3. Direct PostgreSQL connection with `psql`

## What's Changed in the Code

### 1. API Route (`/api/voice/profile/route.ts`)

- ✅ Detects UUID errors (code `22P02`)
- ✅ Returns clear migration instructions instead of generic errors
- ✅ Works immediately after migration is run

### 2. Frontend (`/app/profile/voice/page.tsx`)

- ✅ Displays migration instructions in an alert when UUID error occurs
- ✅ Shows step-by-step guide with SQL to copy-paste
- ✅ Handles both GET and POST migration errors

## Migration Files Created

1. **`supabase/migrations/004_fix_user_pitch_settings_user_id.sql`**
   Contains the ALTER TABLE statement

2. **`scripts/apply-user-id-migration.ts`**
   Attempted programmatic migration (doesn't work, see above)

3. **`FIX_DATABASE_NOW.sql`**
   Standalone SQL file with full context

4. **This file (`VOICE_PROFILE_FIX_REQUIRED.md`)**
   Complete guide with steps

## After Running Migration

The voice profile feature will work immediately:

- ✅ Load existing profiles
- ✅ Save new profiles
- ✅ Update existing profiles
- ✅ No code changes needed

## Related Tables (Already Fixed)

These tables were migrated in `003_fix_user_id_types.sql`:
- ✅ `contacts` - user_id is TEXT
- ✅ `pitches` - user_id is TEXT
- ✅ `pitch_templates` - user_id is TEXT

Only `user_pitch_settings` was missed in that migration.

---

**Next Step**: Run the SQL in Supabase dashboard as described above ☝️
