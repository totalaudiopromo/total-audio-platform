# Minor Issues Fixed

## Issue 1: Favicon 500 Error  FIXED

**Problem:** Browser console showed `Failed to load resource: the server responded with a status of 500 (Internal Server Error) @ http://localhost:3004/favicon.ico`

**Root Cause:** Next.js 13+ was trying to process `app/favicon.ico` as a route, causing a 500 error.

**Solution:**

- Moved `app/favicon.ico` to `app/favicon.ico.backup`
- Next.js now serves `public/favicon.ico` automatically
- No route handler needed - Next.js handles favicon from public directory automatically

**Files Changed:**

- Moved: `app/favicon.ico` → `app/favicon.ico.backup`

---

## Issue 2: Campaign Names Not Displaying  FIXED

**Problem:** Campaign cards showed empty headings when `campaign.name` was null or undefined.

**Root Cause:** Components didn't have fallbacks for empty campaign names.

**Solution:** Added fallback chain: `campaign.name || campaign.artist_name || 'Untitled Campaign'`

**Files Changed:**

1. `components/campaigns/CampaignCard.tsx` - Added fallback to campaign name display
2. `components/campaigns/CampaignCardWithIntel.tsx` - Added fallback to campaign name display and CampaignIntelligence prop
3. `components/campaigns/CampaignDetailClient.tsx` - Added fallback to campaign name display
4. `components/campaigns/CampaignCardIntel.tsx` - Added fallback to campaign name display
5. `components/campaigns/CampaignList.tsx` - Added fallback to campaign name display

**Result:** Campaign cards now always display a name, even if the database has empty name fields.

---

## Testing

Both fixes are non-breaking and improve user experience:

-  Favicon now loads without errors
-  Campaign cards always show a name (never blank)
-  No linter errors introduced
-  All components handle empty names gracefully
