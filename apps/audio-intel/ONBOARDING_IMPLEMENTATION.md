# Audio Intel Onboarding Flow Implementation

**Status**: ✅ Complete - Ready for Database Migration
**Created**: 2025-12-03
**Location**: `/apps/audio-intel/app/onboarding/`

## Overview

Complete 5-step onboarding wizard that guides new users through Audio Intel's core workflow: Upload → Enrich → Export → Track.

## Components Created

### 1. Database Migration

**File**: `/packages/core-db/supabase/migrations/20251203000001_add_onboarding_fields.sql`

Adds two new fields to `user_profiles` table:

- `onboarding_completed` (BOOLEAN, default false)
- `onboarding_skipped_at` (TIMESTAMP, nullable)

Includes indexes for querying incomplete onboarding users and re-engagement campaigns.

### 2. TypeScript Types

**File**: `/packages/core-db/src/types/database.ts`

Updated `user_profiles` interface to include:

- `onboarding_completed: boolean` (Row)
- `onboarding_skipped_at: string | null` (Row)
- Optional fields for Insert/Update operations

### 3. Onboarding Page

**File**: `/apps/audio-intel/app/onboarding/page.tsx`

Complete 5-step wizard with:

- Progress tracking (localStorage persistence)
- Skip functionality
- Step navigation (back/forward)
- Database updates on completion/skip
- Mobile-responsive design with WCAG 2.2 Level AA compliance (44px touch targets)

## Onboarding Steps

### Step 1: Welcome

- Value proposition stats (15 hours → 15 minutes)
- Success rate showcase (100% enrichment)
- Customer testimonial
- What users will learn

### Step 2: Upload

- CSV format requirements
- Example CSV structure
- Sample data option
- File upload guidance

### Step 3: Enrich

- 3-step process visualisation (AI Analysis → Data Discovery → Verification)
- Success metrics display
- Real enrichment example (before/after)
- Time savings explanation

### Step 4: Export

- Integration flow diagram (Intel → Pitch Generator)
- Pitch Generator features list
- One-click export benefits
- Seamless workflow explanation

### Step 5: Track

- Campaign Tracker feature overview
- Benefits explanation (optimise, follow-up, measure)
- Real results testimonial
- Final call-to-action

## Key Features

### Progress Tracking

- localStorage persistence across sessions
- Visual progress bar (1-100%)
- Step indicator dots with navigation
- Resume from where user left off

### Skip Functionality

- "Skip for now" button (top-right)
- Records `onboarding_skipped_at` timestamp
- Useful for re-engagement campaigns
- Still marks onboarding as complete

### Database Integration

- Automatic user profile updates on completion
- Tracks skip vs complete distinction
- Cleans up localStorage after completion
- Redirects to dashboard when done

### Design System

- British spelling throughout (centre, colour, optimise)
- Brutal UI aesthetic (bold borders, strong shadows)
- Mobile-first responsive design
- WCAG 2.2 Level AA compliance
- 44px minimum touch targets

## Next Steps

### 1. Apply Database Migration

**IMPORTANT**: Before deploying this feature, apply the migration to your Supabase database:

```bash
# Connect to Supabase project
cd packages/core-db

# Apply migration via Supabase CLI
supabase db push

# OR via Supabase Dashboard:
# 1. Go to SQL Editor
# 2. Copy contents of migration file
# 3. Run SQL
```

### 2. Test Onboarding Flow

```bash
# Start Audio Intel development server
npm run dev:audio-intel

# Navigate to onboarding page
open http://localhost:3000/onboarding
```

### 3. Add Post-Signup Redirect

Update signup flow to redirect new users to `/onboarding`:

```typescript
// In signup completion handler
if (newUser) {
  router.push('/onboarding');
}
```

### 4. Add Dashboard Check

Optionally, add middleware to check onboarding status and redirect incomplete users:

```typescript
// In middleware or layout
const { data: profile } = await supabase
  .from('user_profiles')
  .select('onboarding_completed')
  .eq('id', user.id)
  .single();

if (!profile?.onboarding_completed && pathname !== '/onboarding') {
  redirect('/onboarding');
}
```

## Testing Checklist

- [ ] Migration applies successfully to database
- [ ] TypeScript compilation passes (`pnpm --filter audio-intel typecheck`)
- [ ] All 5 steps render correctly
- [ ] Progress bar updates on navigation
- [ ] localStorage persistence works across sessions
- [ ] Skip button records timestamp correctly
- [ ] Complete button updates database and redirects
- [ ] Back/forward navigation works
- [ ] Step dots navigation works
- [ ] Mobile responsive design (test on 375px width)
- [ ] Touch targets meet 44px minimum
- [ ] British spelling throughout

## Re-engagement Strategy

Users who skip onboarding can be targeted for re-engagement:

```sql
-- Find users who skipped onboarding in last 7 days
SELECT * FROM user_profiles
WHERE onboarding_skipped_at IS NOT NULL
AND onboarding_skipped_at > NOW() - INTERVAL '7 days';
```

## Design Decisions

### Why localStorage + Database?

- **localStorage**: Preserve progress if user closes browser mid-flow
- **Database**: Track completion for analytics and re-engagement
- **Both**: Best of both worlds - UX + data

### Why Track Skip vs Complete?

- **Analytics**: Understand onboarding completion rates
- **Re-engagement**: Target users who skipped with reminders
- **UX Optimisation**: Identify where users drop off

### Why 5 Steps?

- **Comprehensive**: Cover entire workflow (upload → enrich → export → track)
- **Not Overwhelming**: Each step focuses on one concept
- **Skippable**: Users can opt out if they want to explore themselves

## Customer Acquisition Impact

### Benefits for Revenue Validation

1. **Faster Time-to-Value**: Users understand product immediately
2. **Higher Activation**: Guided workflow increases first enrichment completion
3. **Better Retention**: Users who complete onboarding stay longer
4. **Demo Support**: Can be used during demo calls to guide prospects

### Metrics to Track

- Onboarding completion rate (target: >70%)
- Time spent in onboarding (target: <5 minutes)
- Skip rate (target: <30%)
- First enrichment completion after onboarding (target: >60%)
- 7-day retention: onboarding complete vs skipped

## Future Enhancements

### Phase 2 (Post-£500/month)

- [ ] Interactive demos within each step (live enrichment preview)
- [ ] Video tutorials alongside text content
- [ ] Sample data loading for hands-on experience
- [ ] Personalised onboarding based on user segment (promoter vs artist)
- [ ] Progress analytics in admin dashboard

### Phase 3 (Agentic Platform)

- [ ] AI-powered onboarding personalisation
- [ ] Adaptive step order based on user behaviour
- [ ] Integration with Command Dashboard for admin insights
- [ ] A/B testing framework for onboarding variations

## References

- **Design System**: Brutal UI with bold borders and strong shadows
- **Touch Targets**: WCAG 2.2 Level AA (minimum 44px)
- **British Spelling**: All user-facing text uses UK English
- **Mobile-First**: Responsive breakpoints for all screen sizes
- **Customer Acquisition**: Focus on first paying customer validation

## Support

For questions or issues, reference:

- **WEEKLY_FOCUS.md**: Current priorities and progress
- **AUDIO_INTEL_CONTEXT.md**: Business model and product context
- **BUSINESS_NOTES.md**: Running log of decisions

---

**Last Updated**: 2025-12-03
**Status**: Ready for database migration and testing
**Next Action**: Apply migration to Supabase database
