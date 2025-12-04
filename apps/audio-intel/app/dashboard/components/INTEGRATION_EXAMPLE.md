# InsightsPanel Integration Guide

## Location

Add the InsightsPanel component to `/apps/audio-intel/app/dashboard/page.tsx`.

## Import Statement

Add this import at the top of the file (around line 9):

```tsx
import { InsightsPanel } from './components/InsightsPanel';
```

## Integration Code

Add this code **after the Stats Grid** (after line 191, before the Account Details section):

```tsx
{
  /* Insights Panel - Show user impact */
}
{
  userProfile && userProfile.enrichments_used && userProfile.enrichments_used > 0 && (
    <div className="mb-12">
      <InsightsPanel
        totalContacts={userProfile.enrichments_used || 0}
        enrichmentsUsed={userProfile.enrichments_used || 0}
        lastActivityDate={undefined} // Can be added later when we track last activity
      />
    </div>
  );
}
```

## Complete Context (Lines 191-194)

```tsx
        {/* Stats Grid ends here */}
        </div>

        {/* NEW: Add InsightsPanel here */}
        {userProfile && userProfile.enrichments_used && userProfile.enrichments_used > 0 && (
          <div className="mb-12">
            <InsightsPanel
              totalContacts={userProfile.enrichments_used || 0}
              enrichmentsUsed={userProfile.enrichments_used || 0}
              lastActivityDate={undefined}
            />
          </div>
        )}

        {/* Account Details */}
        <div className="bg-white rounded-2xl border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
```

## What It Does

The InsightsPanel will:

1. **Only show when user has enriched contacts** (enrichments_used > 0)
2. **Calculate time saved**: Based on 15 minutes per contact research time
3. **Display 100% success rate**: Current enrichment accuracy
4. **Provide contextual suggestions**:
   - No activity: "Get started"
   - Stale activity (7+ days): "Time to reconnect"
   - Low usage (<10): "Try batch enrichment"
   - Active users: "Keep the momentum"

## Future Enhancement: Track Last Activity

To enable the "Time to reconnect" suggestion, add a `last_enrichment_at` timestamp field to the users table and fetch it:

```tsx
const { data: profile } = await supabase
  .from('users')
  .select('subscription_tier, enrichments_used, enrichments_limit, last_enrichment_at')
  .eq('id', user.id)
  .single();
```

Then pass it to the component:

```tsx
<InsightsPanel
  totalContacts={userProfile.enrichments_used || 0}
  enrichmentsUsed={userProfile.enrichments_used || 0}
  lastActivityDate={profile?.last_enrichment_at}
/>
```

## Visual Style

The component uses the same neobrutalist design system as the rest of the dashboard:

- Bold borders (`border-4 border-black`)
- Box shadows (`shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]`)
- Black uppercase labels (`font-black uppercase tracking-wider`)
- Coloured icon backgrounds (green for time saved, blue for success, amber for suggestions)

## Testing

After integration, test with:

1. **New user (0 enrichments)**: Panel should NOT display
2. **User with 1-5 enrichments**: Should show "Try batch enrichment" suggestion
3. **User with 10+ enrichments**: Should show "Keep the momentum" suggestion
4. **User with stale activity**: Should show "Time to reconnect" (when lastActivityDate is implemented)

## TypeScript Validation

Run typecheck to ensure no errors:

```bash
npm run typecheck:audio-intel
```
