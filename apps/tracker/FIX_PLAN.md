# Tracker TypeScript Error Fix Plan

## Status: 22 errors remaining (from 38)

###  COMPLETED FIXES

1. **synckit dependency** - Installed
2. **UI components** - Created card.tsx and badge.tsx
3. **gmail-reply-tracker.ts** - Fixed all Supabase client issues

###  REMAINING FIXES

#### Priority 1: Supabase Client Issues (15 errors)

**lib/integrations/google-sheets-sync.ts** (9 errors)

- Same pattern as gmail-reply-tracker
- Replace `private supabase = createClient();` with helper method
- Replace all `this.supabase` with local `const supabase = await this.getSupabaseClient();`
- Fix `supabase.raw()` calls (doesn't exist, use direct SQL or RPC)

**lib/integrations/oauth-handler.ts** (4 errors)

- Missing `supabase` property on class
- Add `getSupabaseClient()` helper method
- Replace all `this.supabase` references

**app/api/cron/sync-integrations/route.ts** (1 error)

- Fix `.raw()` call (property doesn't exist)
- Use direct update or RPC call instead

**Solution Pattern**:

```typescript
// OLD (broken):
export class MyClass {
  private supabase = createClient();  // Promise not awaited!

  async myMethod() {
    await this.supabase.from('table')... // ERROR!
  }
}

// NEW (working):
export class MyClass {
  private async getSupabaseClient() {
    return await createClient();
  }

  async myMethod() {
    const supabase = await this.getSupabaseClient();
    await supabase.from('table')... // Works!
  }
}
```

#### Priority 2: Date Handling (3 errors)

**components/analytics/EnhancedAnalytics.tsx** (3 errors)

- Line 63, 65: Undefined dates passed to `new Date()`
- Add null checks before date construction
- Use optional chaining and default dates

```typescript
// OLD:
const date = new Date(campaign.start_date); // ERROR if undefined!

// NEW:
const date = campaign.start_date ? new Date(campaign.start_date) : new Date();
```

#### Priority 3: Type Safety (4 errors)

**components/analytics/EnhancedAnalytics.tsx** (1 error)

- Line 261: 'percent' is of type 'unknown'
- Add type assertion or proper typing

**lib/integrations/google-sheets-sync.ts** (1 error)

- Line 95: Parameter 'c' implicitly has 'any' type
- Add proper type annotation

**app/pricing/page.tsx** (1 error)

- Line 137: Type 'unknown' not assignable to 'ReactNode'
- Add proper type assertion

**.next/types/app/campaigns/[id]/page.ts** (1 error)

- Next.js 15 async params issue
- params must be awaited in page component

```typescript
// OLD (Next.js 14):
export default function Page({ params }: { params: { id: string } }) {
  const id = params.id;
}

// NEW (Next.js 15):
export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
}
```

###  EXECUTION ORDER

1. **Fix google-sheets-sync.ts** (9 errors) - Same pattern as gmail-reply-tracker
2. **Fix oauth-handler.ts** (4 errors) - Add supabase client helper
3. **Fix sync-integrations route** (1 error) - Remove .raw() call
4. **Fix EnhancedAnalytics dates** (3 errors) - Add null checks
5. **Fix type safety issues** (4 errors) - Add proper types

###  ESTIMATED TIME

- Supabase fixes: 30-40 minutes (apply same pattern × 3 files)
- Date fixes: 10 minutes (simple null checks)
- Type fixes: 15 minutes (type assertions)
- **Total: ~1 hour**

###  VALIDATION

After each fix:

```bash
npm run typecheck
```

Target: 0 errors

---

**Next Step**: Start with google-sheets-sync.ts (biggest win, 9 errors)
