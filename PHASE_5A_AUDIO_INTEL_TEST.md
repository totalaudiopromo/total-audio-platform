# Audio Intel Migration Validation Checklist

**Purpose**: Confirm `@total-audio/core-db` integration works in both local and staging environments before migrating Tracker + Pitch Generator.

---

## Local Verification (15 min)

### 1⃣ Environment

```bash
cd apps/audio-intel
cat .env.local | grep SUPABASE
```

**Confirm these exist and match your Supabase project:**

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

**If missing →**

```bash
vercel env pull .env.local --cwd apps/audio-intel
```

---

### 2⃣ Start Dev Server

```bash
pnpm --filter audio-intel dev
```

**Checklist:**

- [ ] Server starts with no import/type errors
- [ ] Logs show "Next.js 15 ready in x s"

**Visit:**

- [ ] `/signin` → Successful login
- [ ] `/dashboard` → User data appears
- [ ] `/auth/signout` → Session clears cleanly

**Check browser console + network tab:**

- [ ]  No 401/403 RLS errors
- [ ]  No `supabase: unauthorized` messages

---

### 3⃣ API Sanity

```bash
curl -I http://localhost:3000/api/usage
```

**Checklist:**

- [ ] Returns 200 and small JSON body
- [ ] Supabase dashboard logs show matching API call

---

### 4⃣ Database Validation

```bash
pnpm --filter @total-audio/core-db migrate
pnpm --filter @total-audio/core-db generate:types
supabase db diff
```

**Checklist:**

- [ ] No pending migrations
- [ ] Types generated successfully
- [ ] No schema drift detected

---

### 5⃣ Production Build Check

```bash
pnpm --filter audio-intel build
```

**Checklist:**

- [ ] Build completes < 10 s
- [ ] 108 routes generated
- [ ] No Supabase/type errors

---

##  Staging Deploy (10 min)

_(Optional but recommended before Tracker/Pitch)_

```bash
vercel --cwd apps/audio-intel --prod --scope totalaudiopromo-staging
```

**Then verify in browser:**

- [ ] `/signin` → Auth works on real domain
- [ ] `/dashboard` → Data loads normally
- [ ] Supabase → auth & API logs show expected activity

---

## Pass Criteria

| Test                | Result                |
| ------------------- | --------------------- |
| Dev server runs     |                     |
| Auth flows work     |                     |
| API routes work     |                     |
| RLS errors = 0      |                     |
| Build passes        | (Already verified) |
| Staging deploy runs |                     |

---

##  If All Green

Tag and push the validated milestone:

```bash
git add .
git commit -m "test(audio-intel): core-db integration verified"
git tag v1.0.1-audiointel-tested
git push origin main --tags
```

**Then run Phase 5.2** (Tracker + Pitch Generator migrations).

---

## Migration Summary (for reference)

### Files Modified (15 total):

1. `apps/audio-intel/tsconfig.json` - Added core-db path mappings
2. `apps/audio-intel/middleware.ts` - Updated import
3. `apps/audio-intel/app/auth/callback/route.ts` - Migrated to core-db
4. `apps/audio-intel/app/auth/signout/route.ts` - Migrated to core-db
5. `apps/audio-intel/app/api/usage/route.ts` - Migrated + type assertions
6. `apps/audio-intel/app/api/agents/route.ts` - Optional chaining fix
7. `apps/audio-intel/app/pdf-demo/page.tsx` - Brand color fix
8. `apps/audio-intel/agents/pitch/subagents/ToneChecker.ts` - Smart quote fix
9. `apps/audio-intel/agents/tracker/TrackerAgent.ts` - Type assertion
10. `apps/audio-intel/agents/voiceguard/VoiceGuardAgent.ts` - Static property access
11. `apps/audio-intel/lib/linkedin-posting-agent.ts` - Axios type fixes
12. `apps/audio-intel/lib/threads-posting-agent.ts` - Axios type fixes
13. `packages/core-db/src/middleware.ts` - Return type enhancement
14. Dashboard/component files - Migrated imports
15. Auth component files - Migrated imports

### Migration Pattern Established 

```typescript
// Server routes/actions
import { createServerClient } from '@total-audio/core-db/server';
import { cookies } from 'next/headers';
const supabase = await createServerClient(cookies());

// Client components
import { createClient } from '@total-audio/core-db/client';
const supabase = createClient();

// Middleware
import { updateSession } from '@total-audio/core-db/middleware';
const { supabaseResponse, user } = await updateSession(request);
```

### Known Workarounds (to be addressed):

- Database types are placeholders - need to run `generate:types`
- Type assertions (`as any`) used temporarily for placeholder types
- Will be removed once proper types are generated
