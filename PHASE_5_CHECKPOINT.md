# Phase 5.1 Checkpoint: Audio Intel Migration Testing

## What's Been Completed

### Audio Intel Migration to @total-audio/core-db

- **Status**: **COMPLETE - AWAITING VERIFICATION**
- **Date**: 2025-10-31
- **Scope**: All Supabase imports migrated from local `lib/supabase/` to centralized `@total-audio/core-db`

### Changes Made:

#### 1. Import Replacements (9 files)

```diff
- import { createClient } from '@/lib/supabase/client'
+ import { createClient } from '@total-audio/core-db/client'

- import { createClient } from '@/lib/supabase/server'
+ import { createServerClient } from '@total-audio/core-db/server'
+ import { cookies } from 'next/headers'

- import { updateSession } from '@/lib/supabase/middleware'
+ import { updateSession } from '@total-audio/core-db/middleware'
```

#### 2. Files Updated:

- `middleware.ts` - Session management
- `app/auth/callback/route.ts` - OAuth callback
- `app/auth/signout/route.ts` - Sign out
- `app/api/usage/route.ts` - Usage tracking (GET + POST)
- `app/dashboard/page.tsx` - Dashboard client
- `app/components/SiteHeader.tsx` - Header client
- `components/auth/SignInForm.tsx` - Auth client
- `components/auth/SignUpForm.tsx` - Auth client
- `components/auth/UserMenu.tsx` - Auth client

#### 3. Next.js 15 Async Pattern Applied:

```typescript
// Server routes now use:
const supabase = await createServerClient(cookies());

// Client components still use:
const supabase = createClient(); // No await needed
```

#### 4. Type Validation:

- No Supabase/core-db related type errors
- Pre-existing ToneChecker.ts syntax error (unrelated)

---

## Verification Checklist

### Phase 1: Local Development Testing (30-45 min)

#### Step 1: Environment Setup

```bash
cd /Users/chrisschofield/workspace/active/total-audio-platform
```

**Verify environment variables:**

```bash
# Check Audio Intel .env.local exists and has required vars
cat apps/audio-intel/.env.local | grep -E "SUPABASE_URL|SUPABASE_ANON_KEY"
```

**Expected output:**

```
NEXT_PUBLIC_SUPABASE_URL=https://[your-project].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
```

#### Step 2: Start Development Server

```bash
pnpm --filter audio-intel dev
```

**Success criteria:**

- Server starts on port 3000
- No import errors in console
- No "Cannot find module '@total-audio/core-db'" errors

#### Step 3: Test Authentication Flow

**Test Sign In:**

1. Navigate to: `http://localhost:3000/signin`
2. Enter valid credentials
3. Verify redirect to `/dashboard`
4. Check browser console: No 401 or Supabase errors

**Test Sign Out:**

1. Click sign out button
2. Verify redirect to home page
3. Check session cookie cleared

**Test OAuth Callback:**

1. Trigger OAuth flow (if configured)
2. Verify `/auth/callback` handles code exchange
3. Verify redirect to dashboard

#### Step 4: Test Protected Routes

**Dashboard Access:**

```
http://localhost:3000/dashboard
```

- Authenticated users: See dashboard
- Unauthenticated users: Redirect to `/signin`

**API Routes:**

```bash
# Test usage endpoint (requires auth)
curl http://localhost:3000/api/usage \
  -H "Cookie: sb-[project]-auth-token=..." \
  -v
```

**Expected:** 200 OK with usage data

#### Step 5: Test Data Fetching

**Verify RLS Working:**

1. Open dashboard
2. Check browser network tab
3. Verify Supabase requests succeed
4. Check for RLS errors (should be none)

**Server logs to watch for:**

```bash
# Look for these patterns in terminal:
"No Supabase errors"
 "Error fetching user data"
 "Unauthorized"
 "RLS policy violation"
```

---

### Phase 2: Database Layer Verification (15 min)

#### Step 1: Generate Types

```bash
# Set your Supabase project ID
export SUPABASE_PROJECT_ID=your-project-id

# Generate types from schema
pnpm --filter @total-audio/core-db generate:types
```

**Success criteria:**

- Types generated in `packages/core-db/src/types/database.ts`
- No errors from Supabase CLI

#### Step 2: Run Migrations (if needed)

```bash
# Set credentials
export SUPABASE_PROJECT_ID=your-project-id
export SUPABASE_DB_PASSWORD=your-db-password

# Run migrations
pnpm --filter @total-audio/core-db migrate
```

**Expected output:**

```
Migrations completed successfully!
   Run 'pnpm --filter @total-audio/core-db generate:types' to update types.
```

**Or if already up to date:**

```
Remote database is up to date.
```

---

### Phase 3: Production Build Testing (15 min)

#### Step 1: Build Audio Intel

```bash
pnpm --filter audio-intel build
```

**Success criteria:**

- Build completes without import errors
- No "Cannot resolve '@total-audio/core-db'" errors
- Build output shows compiled successfully

**Watch for:**

```
 Compiled successfully
 Linting and checking validity of types
 Creating an optimized production build
```

#### Step 2: Check Bundle Size

```bash
# Build should complete and show stats
pnpm --filter audio-intel build 2>&1 | grep -A 10 "Route"
```

**Verify:**

- No unusually large chunks from database imports
- Bundle size reasonable (compare to previous builds if available)

---

### Phase 4: Staging Deployment (Optional but Recommended)

#### Deploy to Vercel Preview

```bash
cd apps/audio-intel
vercel --prod
```

**Or create preview deployment:**

```bash
vercel
```

**Test on deployed URL:**

1. Visit deployed URL
2. Test authentication flow
3. Test dashboard data loading
4. Check Vercel logs for errors

**Vercel environment variables to verify:**

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY (if using admin client)
```

---

## Common Issues & Fixes

### Issue 1: "Cannot find module '@total-audio/core-db'"

**Cause:** TypeScript path mapping not resolved
**Fix:**

```bash
# Rebuild workspace
pnpm install
pnpm --filter @total-audio/core-db typecheck
```

### Issue 2: "cookies() expects no arguments"

**Cause:** Not awaiting createServerClient
**Fix:** Ensure all server route usage has:

```typescript
const supabase = await createServerClient(cookies());
```

### Issue 3: Middleware auth check broken

**Cause:** updateSession return type changed
**Fix:** Verify middleware destructures correctly:

```typescript
const { supabaseResponse, user } = await updateSession(request);
```

### Issue 4: RLS policy violations

**Cause:** User context not passed correctly
**Fix:** Check server routes use cookies(), not direct client

### Issue 5: Type errors on Database type

**Cause:** Types not generated from schema
**Fix:**

```bash
export SUPABASE_PROJECT_ID=your-project-id
pnpm --filter @total-audio/core-db generate:types
```

---

## Go/No-Go Decision

### PROCEED to Tracker/Pitch Migration if:

- [ ] Audio Intel runs locally without errors
- [ ] Authentication flow works end-to-end
- [ ] Dashboard loads user data correctly
- [ ] API routes return expected responses
- [ ] Production build completes successfully
- [ ] No Supabase-related console errors
- [ ] (Optional) Staging deployment works

### INVESTIGATE if:

- [ ] Auth redirects break
- [ ] RLS errors appear in console
- [ ] Data fetching returns 401/403
- [ ] Build fails with import errors
- [ ] Types don't match database schema

### ROLLBACK if:

- [ ] Critical revenue functionality broken
- [ ] Cannot authenticate users
- [ ] Data corruption or access issues
- [ ] Production deployment fails

---

## Success Metrics

**Before Migration:**

- Audio Intel using local `lib/supabase/` implementations
- Duplicate code across 3 apps
- No centralized type generation

**After Migration (Target):**

- Single source of truth: `@total-audio/core-db`
- Type-safe Supabase clients
- Next.js 15 async patterns
- Zero import errors
- RLS working correctly
- Auth flow intact

---

## Next Steps After Verification

### If Tests Pass:

#### 1. Tag the Migration

```bash
git add .
git commit -m "feat(audio-intel): migrate to @total-audio/core-db package

- Replace all lib/supabase imports with @total-audio/core-db
- Update server routes for Next.js 15 async cookies
- Migrate middleware to centralized auth
- Verified: auth, data fetching, RLS all working

Refs: Phase 5.1 - Audio Intel migration complete"

git tag -a v1.0.0-audiointel-migrated -m "Audio Intel migrated to core-db"
git push origin main --tags
```

#### 2. Proceed to Phase 5.2: Tracker Migration

```bash
# Run similar migration script for tracker
# Pattern established, should be faster
```

#### 3. Then Phase 5.3: Pitch Generator Migration

```bash
# Includes auth-helpers.ts migration
# More complex due to additional helpers
```

#### 4. Finally Phase 5.4: Cleanup

```bash
# Remove all legacy lib/supabase directories
find apps -type d -path "*/lib/supabase" -exec rm -rf {} +
find apps -type d -name "supabase" -not -path "*/node_modules/*" -exec rm -rf {} +
```

---

## Notes

**Migration Philosophy:**

- Prove pattern works with revenue app (Audio Intel) first
- Then apply same pattern to other apps
- Delete legacy code only after all apps migrated
- Generate types from schema as final step

**Risk Mitigation:**

- Audio Intel tested first (highest priority)
- Incremental migration approach
- Easy rollback path (git revert)
- Clear success criteria before proceeding

---

## Support

If issues arise during testing:

1. **Check this document's "Common Issues" section**
2. **Review migration changes:**
   ```bash
   git diff HEAD~1 apps/audio-intel
   ```
3. **Verify core-db package:**
   ```bash
   pnpm --filter @total-audio/core-db typecheck
   ```
4. **Check Supabase project status:**
   ```bash
   supabase status
   ```

---

**Status**: **AWAITING VERIFICATION**
**Last Updated**: 2025-10-31
**Next Action**: Run Phase 1 verification tests locally
