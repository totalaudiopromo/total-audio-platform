# Phase 5 - Final Manual Steps Required

**Date**: 2025-01-01
**Status**: Migration complete, type generation requires manual authentication

---

## ✅ Completed

1. **All 3 apps migrated to `@total-audio/core-db`**
   - Audio Intel: 9 imports → 108 routes ✅
   - Tracker: 52 imports → 65 routes ✅
   - Pitch Generator: 37 imports → 42 routes ✅

2. **Legacy code cleanup**
   - Deleted 6 Supabase directories ✅
   - Deleted 2 standalone files ✅

3. **Supabase CLI installed** ✅
   - Version: 2.54.11
   - Location: `/opt/homebrew/bin/supabase`

---

## 🔧 Manual Steps Required

### 1. Authenticate with Supabase CLI

The type generation script needs Supabase authentication. Run:

```bash
supabase login
```

This will open your browser for authentication. Follow the prompts.

---

### 2. Generate Database Types

After authentication, run:

```bash
export SUPABASE_PROJECT_ID=ucncbighzqudaszewjrv
pnpm --filter @total-audio/core-db generate:types
```

This will:

- Connect to your Supabase project
- Generate TypeScript types from your database schema
- Save to `packages/core-db/src/types/database.ts`

---

### 3. Remove Type Assertions (After Type Generation)

Once types are generated, search for and remove `as any` workarounds:

**Audio Intel** (`apps/audio-intel/app/api/usage/route.ts`):

```typescript
// BEFORE:
const { data: userData } = (await supabase
  .from('users')
  .select('enrichments_used, enrichments_limit')
  .eq('id', user.id)
  .single()) as any; // ← Remove this

// AFTER:
const { data: userData } = await supabase
  .from('users')
  .select('enrichments_used, enrichments_limit')
  .eq('id', user.id)
  .single();
```

**Tracker** (multiple campaign API routes):

- `apps/tracker/app/api/campaigns/route.ts`
- `apps/tracker/app/api/campaigns/[id]/route.ts`

**Pitch Generator** (10+ API routes):

- `apps/pitch-generator/app/api/pitch/generate/route.ts`
- `apps/pitch-generator/app/api/contacts/route.ts`
- `apps/pitch-generator/app/api/contacts/sync/route.ts`
- All other API routes

Search command:

```bash
grep -r "as any" apps/*/app/api --include="*.ts"
```

---

### 4. Verify Builds After Type Removal

```bash
# Test each app individually
pnpm --filter audio-intel build
pnpm --filter tracker build
pnpm --filter pitch-generator build

# Or all at once
pnpm -r build
```

---

### 5. Check for Schema Drift (Optional)

```bash
supabase db diff
```

Ensure no pending migrations or schema changes.

---

### 6. Commit and Tag

```bash
# Stage changes
git add .

# Commit type generation
git commit -m "chore(core-db): generate Supabase database types

- Generated TypeScript types from production schema
- Removed all 'as any' type assertions
- Verified all builds pass with proper types

Migration complete: 98 imports migrated across 3 apps"

# Tag the milestone
git tag v2.0.0-coredb-migration-complete

# Push
git push origin main --tags
```

---

## 🐛 Troubleshooting

### "Access token not provided" error

Run `supabase login` first, then retry type generation.

### Build errors after type generation

1. Check that `database.ts` was generated correctly
2. Ensure all `as any` assertions are removed
3. Run `pnpm install` to refresh type cache
4. Clear Next.js cache: `rm -rf apps/*/. next`

### Type mismatches

If generated types don't match your schema:

1. Verify you're connected to the correct Supabase project
2. Check `SUPABASE_PROJECT_ID` matches your production project
3. Ensure database migrations are up to date

---

## 📊 Expected Final State

After completing all steps:

```
packages/core-db/
├── src/
│   ├── types/
│   │   └── database.ts        # ✅ Generated types (no placeholders)
│   ├── client.ts              # ✅ Browser client
│   ├── server.ts              # ✅ Server client
│   └── middleware.ts          # ✅ Middleware helper

apps/audio-intel/              # ✅ 0 type assertions
apps/tracker/                  # ✅ 0 type assertions
apps/pitch-generator/          # ✅ 0 type assertions
```

**Build Status**: All 3 apps build successfully with full type safety

**Total Routes**: 215 production routes

**Migration Health**: 100% complete ✅

---

## 🎯 Next Steps (Optional Improvements)

### 1. Consolidate Types Across Apps

Move shared types to `@total-audio/core-db/types`:

- `Contact` (used in Pitch Generator)
- `Pitch` (used in Pitch Generator)
- `Campaign` (used in Tracker)

### 2. Standardize Middleware Pattern

Align Audio Intel middleware with Tracker/Pitch Generator:

```typescript
import { updateSession } from '@total-audio/core-db/middleware';

export async function middleware(request: NextRequest) {
  const { supabaseResponse, user } = await updateSession(request);
  // ... auth checks
  return supabaseResponse;
}
```

### 3. Add Integration Tests

Test database interactions across apps:

- Cross-app queries (Pitch Generator → Audio Intel contacts)
- RLS policy verification
- Auth flow testing

---

## 📝 Summary

**Migration Status**: ✅ **Complete** (pending type generation)

**What's Left**:

1. Authenticate Supabase CLI (`supabase login`)
2. Generate types (`pnpm --filter @total-audio/core-db generate:types`)
3. Remove `as any` assertions
4. Verify builds
5. Commit and tag

**Estimated Time**: 15-20 minutes

**Risk Level**: Low (all builds currently pass with workarounds)

---

**Reference Documents**:

- [PHASE_5.2_MIGRATION_COMPLETE.md](PHASE_5.2_MIGRATION_COMPLETE.md) - Full migration report
- [packages/core-db/README.md](packages/core-db/README.md) - Core-DB package documentation
