# Liberty Pitch Builder — Implementation Report

**Date**: Implementation completed  
**Status**: ✅ **ALL 6 PHASES COMPLETE**

---

## Summary

The **Multi-Segment Pitch Builder** has been successfully implemented as a premium, editorial-grade tool that integrates with all existing Liberty intelligence layers. The system generates context-aware pitches for six different segments: Radio, Editorial, Blogs, Playlists, Sync, and Brand.

---

## Files Created

### 1. Domain Model

- **`lib/pitchBuilderModel.ts`** (652 lines)
  - Type definitions: `PitchType`, `PitchStat`, `PitchAssetRef`, `Pitch`, `PitchContext`
  - Core function: `buildPitchFromContext()` — deterministic pitch generation
  - Helper functions for subject lines, hooks, narratives, angles, stats, assets, CTAs

### 2. API Adapter

- **`lib/api/pitchBuilder.ts`** (133 lines)
  - Main function: `generatePitchForCampaign(campaignId, type)`
  - Orchestrates data fetching from all intelligence layers
  - Mock-first pattern consistent with existing APIs

### 3. UI Page

- **`app/dashboard/pitch-builder/[campaignId]/page.tsx`** (358 lines)
  - Full-page pitch builder interface
  - Tabbed pitch type selector (6 types)
  - Main content area (60%): subject, greeting, hook, narrative, angles, stats, CTA
  - Sidebar (40%): recommended assets, campaign context, key angles
  - Copy-to-clipboard functionality

---

## Files Modified

### 1. Campaign Slideover

- **`components/CampaignCard.tsx`**
  - Added "Open Pitch Builder" link after Press Kit Preview section
  - Conditional rendering: only shows if press release assets exist
  - Styled consistently with existing TAP design system

### 2. Artist Portal

- **`app/artist/[slug]/page.tsx`**
  - Added "Pitch Snapshot" section in sidebar (internal-only view)
  - Fetches editorial pitch on load
  - Displays: subject line, top 2-3 key angles, 1-2 stats
  - Positioned before Press Kit Overview section
  - Marked as "Internal" to distinguish from client-facing content

---

## Integration Points

### Existing APIs Integrated

1. **Tracker API** (`lib/api/tracker.ts`)
   - `fetchCampaignDetail()` — campaign context, momentum, health, stats

2. **Press Kit API** (`lib/api/pressKit.ts`)
   - `generatePressKitForCampaign()` — assembled press kit data

3. **Drive API** (`lib/api/drive.ts`)
   - `fetchAssetsByCampaign()` — campaign assets
   - `fetchPressProfileForAsset()` — press profile from press release

4. **Pitch API** (`lib/api/pitch.ts`)
   - `fetchPitchEventsForCampaign()` — pitch history for performance stats

5. **Intel API** (`lib/api/intel.ts`)
   - `fetchPriorityContacts()` — contact intelligence for segment targeting

6. **WARM API** (`lib/api/warm.ts`)
   - WARM summaries (via constants) — radio spin data

7. **CoverageBook API** (`lib/api/coveragebook.ts`)
   - Coverage summaries (via constants) — press coverage data

8. **Press Profiles** (`lib/constants/pressProfiles.ts`)
   - Press profile data — headlines, angles, quotes, outlets

---

## Pitch Generation Logic

### Pitch Type Differentiation

Each pitch type has unique subject lines, hooks, narratives, and CTAs:

- **Radio**: Emphasises spins, station fit, rotation data
- **Editorial**: Focuses on story angles, pull quotes, press coverage
- **Blogs**: Shorter, more conversational, pull quotes
- **Playlists**: Highlights track mood, streaming performance, comparable artists
- **Sync**: Cinematic/brand fit, visual identity, exclusive opportunities
- **Brand**: Visual identity, audience demographics, partnership opportunities

### Data Assembly Flow

1. Campaign detail fetched
2. Artist ID derived from campaign ID mapping (`c1` → `1`, `c2` → `2`, `c3` → `3`)
3. Press kit generated
4. Assets fetched
5. Press profile resolved (from asset or by artist name)
6. WARM summary fetched (from constants)
7. CoverageBook summary fetched (from constants)
8. Pitch events fetched (for performance stats)
9. Priority contacts fetched (for segment targeting)
10. `buildPitchFromContext()` called with all data
11. Pitch object returned

---

## UI Features

### Pitch Builder Page (`/dashboard/pitch-builder/[campaignId]`)

- **Header**:
  - Breadcrumb navigation
  - Campaign name and artist
  - Copy-to-clipboard button

- **Left Column (60%)**:
  - Pitch type tabs (segmented control style)
  - "To:" line with target segment label
  - Subject line (mono, copyable)
  - Full pitch body:
    - Greeting
    - Opening hook
    - Narrative (multi-paragraph)
    - Key angles (bullet list)
    - Stats section (shaded box)
    - Call to action
    - Follow-up note (optional)
    - Signature

- **Right Column (40%)**:
  - Recommended Assets card (with download links)
  - Campaign Context card (momentum, health, open/reply rates)
  - Key Angles tags card (visual summary)

### Campaign Slideover Integration

- "Open Pitch Builder" link appears when:
  - Campaign has press release assets (`Press Releases` folder, `pdf` or `other` type)
- Navigates to `/dashboard/pitch-builder/${campaignId}`
- Styled consistently with Press Kit Preview link

### Artist Portal Integration

- "Pitch Snapshot" section (internal-only):
  - Shows editorial pitch by default
  - Displays subject line, top 2-3 angles, 1-2 stats
  - Marked with "Internal" label
  - Read-only, for Liberty team reference

---

## Technical Details

### Type Safety

- Full TypeScript strict mode compliance
- All types exported from `lib/pitchBuilderModel.ts`
- Proper null checking throughout

### Mock-First Pattern

- All APIs use `USE_MOCKS` flag pattern
- Fallbacks to constants when external APIs unavailable
- No hard-coded LLM calls (deterministic generation)

### Performance

- Pitch generation is synchronous (no async delays)
- Data fetching uses `Promise.all()` where possible
- Asset loading is lazy (only for recommended assets)

### Error Handling

- Graceful fallbacks if any data source fails
- Minimal pitch returned if generation fails
- Console warnings for debugging

---

## Testing

### Build Validation

- ✅ `npm run build` — **SUCCESS** (0 errors)
- ✅ `tsc --noEmit` — **PASSED** (0 type errors)
- ✅ All routes generated successfully

### Integration Points Verified

1. ✅ Pitch Builder page loads for all campaign IDs (`c1`, `c2`, `c3`)
2. ✅ Pitch type switching works (all 6 types)
3. ✅ Copy-to-clipboard functionality works
4. ✅ Campaign slideover link navigates correctly
5. ✅ Artist portal shows Pitch Snapshot section
6. ✅ All existing functionality remains intact

---

## Limitations & TODOs

### Current Limitations

1. **No Pitch Customisation**: Pitches are generated deterministically; no user editing in UI (yet)
2. **No Pitch History**: Generated pitches are not saved/stored
3. **No Email Integration**: Copy-to-clipboard only; no direct email sending
4. **No A/B Testing**: Single pitch generation algorithm per type
5. **Priority Contacts**: All contacts used for segment targeting; no filtering by pitch type yet

### Future Enhancements (TODOs)

1. **Pitch Templates**: Allow users to save/edit custom pitch templates
2. **Pitch Analytics**: Track which pitch types/angles get best open/reply rates
3. **Bulk Generation**: Generate pitches for multiple contacts at once
4. **Email Integration**: Direct send-to-email functionality
5. **Contact Filtering**: Filter priority contacts by pitch type (e.g., radio contacts for radio pitches)
6. **A/B Testing**: Generate multiple variations and track performance
7. **Pitch Library**: Save generated pitches for reuse/reference

---

## Styling Consistency

### TAP Design System

- ✅ `bg-tap-bg` for page backgrounds
- ✅ `bg-tap-panel` + `border-tap-line` for cards/sections
- ✅ `font-serif` (EB Garamond) for headings
- ✅ `font-mono` (JetBrains Mono) for metadata/subject lines
- ✅ `text-tap-text`, `text-tap-muted`, `text-tap-accent` throughout
- ✅ Consistent spacing, borders, and hover states

### British English

- ✅ All copy uses British spelling:
  - "organisation" not "organization"
  - "colour" not "color"
  - "programme" not "program"
  - etc.

---

## How Integration with `lib/api/pitch.ts` Works

### Existing Functions Used

1. **`fetchPitchEventsForCampaign(campaignId)`**
   - Used in `generatePitchForCampaign()` to fetch pitch history
   - Data used to populate stats:
     - Open rate: `(opened / total) * 100`
     - Reply rate: `(replied / total) * 100`
   - Stats displayed in pitch builder UI under "Campaign Stats"

2. **`fetchRecentPitchEventsForContact(contactId)`**
   - **Not used yet** (reserved for future contact-specific pitch generation)
   - Could be used to personalise pitches per contact

### Integration Pattern

The pitch builder **consumes** pitch API data but does **not modify** it. It's a read-only integration:

```
lib/api/pitchBuilder.ts
  └─> import { fetchPitchEventsForCampaign } from './pitch'
      └─> Used to get historical performance data
          └─> Stats derived and included in Pitch.stats[]
              └─> Displayed in pitch builder UI
```

### Future Integration Opportunities

- **Contact-Specific Pitches**: Use `fetchRecentPitchEventsForContact()` to personalise pitches
- **Pitch Performance Analysis**: Track which pitch types/angles perform best
- **Smart Subject Lines**: A/B test different subject line formats based on historical data

---

## Routes Created

1. **`/dashboard/pitch-builder/[campaignId]`**
   - Dynamic route for pitch builder page
   - Supports: `c1`, `c2`, `c3` campaign IDs
   - All 6 pitch types supported

---

## Routes Modified

1. **`/dashboard/overview`** (via CampaignCard component)
   - Campaign slideover now includes "Open Pitch Builder" link

2. **`/artist/[slug]`**
   - Artist portal sidebar now includes "Pitch Snapshot" section

---

## Conclusion

The Liberty Pitch Builder is **fully implemented** and ready for use. All phases completed successfully, build validation passed, and integration with existing intelligence layers is complete. The system provides a premium, editorial-grade tool for generating multi-segment pitches while maintaining consistency with the TAP design system and British English spelling throughout.

**Status**: ✅ **COMPLETE & READY FOR USE**
