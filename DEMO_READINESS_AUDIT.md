# Demo Readiness Audit - Liberty Music PR
**Audit Date:** November 2025
**Demo Date:** Thursday 19th November
**Audited Against:** DETAILED_DEMO_SCRIPT.md

---

## 🚨 OVERALL STATUS: **MAJOR PROBLEMS**

You have **DEMO-BLOCKING issues** that will cause the presentation to fail.
**DO NOT present until these are fixed.**

---

## Critical Blockers (Must Fix Before Demo)

### ❌ BLOCKER 1: Campaign Tracker Demo Page Doesn't Exist
**Script Promise (Section 10-11):**
- Dashboard showing active campaigns
- Campaign detail view with activity tracking
- Real-time team coordination features
- Export campaign report functionality
- URL: `localhost:3001/dashboard`

**Reality:**
- `apps/tracker/app/demo/page.tsx` is a **placeholder page**
- Just says "Demo Coming Soon" with a signup button
- **ZERO demo functionality**
- No dashboard, no campaigns, no export

**Impact:** Sections 9-11 of your demo script (2.5 minutes) are **completely impossible** to deliver.

**Fix Required:**
1. Build actual Campaign Tracker demo page with mock data, OR
2. Remove Sections 9-11 from demo script entirely (cuts demo to 7 minutes)
3. Revise transition in Section 8 to skip Tracker completely

---

### ❌ BLOCKER 2: Port Conflicts - Apps Can't Run Simultaneously
**Script Promise:**
- Audio Intel: `localhost:3000/demo`
- Pitch Generator: `localhost:3004/demo`
- Campaign Tracker: `localhost:3001/dashboard`

**Reality:**
- All three apps use `next dev` with default port 3000
- No port configuration in package.json dev scripts
- **They will collide if run simultaneously**
- `pnpm run dev:all` will fail with port conflicts

**Impact:** You cannot run all three apps at once during the demo. Tab switching between apps (Section 12) is **impossible**.

**Fix Required:**
Create port-specific dev commands in root `package.json`:
```json
"dev:audio-intel": "cd apps/audio-intel && next dev -p 3000",
"dev:pitch": "cd apps/pitch-generator && next dev -p 3004",
"dev:tracker": "cd apps/tracker && next dev -p 3001"
```

---

### ⚠️ BLOCKER 3: Contact Count Mismatch (45 vs 5)
**Script Promise (Section 2):**
> "I'm going to enrich 45 BBC Radio contacts. Watch the timer..."

**Reality:**
- `loadLibertyDemoData()` function in Audio Intel demo page only loads **5 contacts**:
  1. Jack Saunders (BBC Radio 1)
  2. Nick Grimshaw (BBC 6 Music)
  3. Clara Amfo (BBC Radio 1)
  4. Spotify Editorial
  5. Huw Stephens (BBC Radio 1)

**Impact:** You'll say "45 contacts" and they'll see 5. Immediate credibility loss.

**Fix Required:**
Either:
1. Add 40 more contacts to `libertyDemoData` array in `apps/audio-intel/app/demo/page.tsx` line 94, OR
2. Change script to say "5 BBC Radio contacts" throughout

---

### ⚠️ BLOCKER 4: No Contact Detail View
**Script Promise (Section 3):**
> "Click into Jack Saunders contact → Scroll through intelligence"
> Show detailed contact card with show times, genres, recent plays, submission guidelines

**Reality:**
- Audio Intel demo page displays contacts in a list with all intelligence visible
- **No click-through to individual contact detail page**
- No modal, no separate page, no expandable card
- The intelligence is already fully displayed inline

**Impact:** Section 3 (1 minute) cannot be performed as scripted. You'll fumble looking for something that doesn't exist.

**Fix Required:**
Either:
1. Skip Section 3 entirely (acceptable - intelligence is already visible), OR
2. Revise Section 3 to "scroll down and highlight Jack Saunders in the list", OR
3. Build a modal/detail view that opens on contact click

---

## Major Issues (Not Blocking, But Problematic)

### ⚠️ ISSUE 5: Authentication Required for Pitch Generator
**Script Promise (Section 6-8):**
- Navigate to `localhost:3004/demo`
- Select contact from dropdown, fill form, generate pitch

**Reality:**
- Pitch Generator requires authentication (`useSession` hook)
- Will redirect to `/auth/signin` if not logged in
- No public demo page at `/demo`
- Need to create account or be logged in before demo

**Impact:** You'll navigate to Pitch Generator and hit a login wall mid-demo. Awkward pause while you sign in.

**Fix Required:**
Either:
1. Be logged in BEFORE starting demo (add to pre-demo checklist), OR
2. Create unauthenticated demo page at `/pitch-generator/app/demo/page.tsx`, OR
3. Use production URL (pitch.totalaudiopromo.com) where you're already logged in

---

### ⚠️ ISSUE 6: No PDF Export Button Visible
**Script Promise (Section 4):**
> Click "Export PDF" button → PDF downloads

**Reality:**
- Audio Intel demo page has "Export PDF" button in the Professional Export Options section
- **But it's only visible AFTER switching to "Analytics & Export" tab**
- Not visible immediately after loading demo data

**Impact:** Minor issue - you just need to switch tabs first. Script should note this.

**Fix Required:**
Update Section 4 script to include: "Switch to Analytics tab, then click Export PDF"

---

### ⚠️ ISSUE 7: sadact / "Maybe (i)" Not Pre-Loaded
**Script Promise (Section 6):**
- Fill in artist name: "sadact"
- Fill in track: "Maybe (i)"

**Reality:**
- No pre-filled demo data in Pitch Generator
- You'll need to manually type "sadact" and "Maybe (i)" during live demo
- Typo risk, time waste

**Impact:** Minor - just adds 10-15 seconds of typing. Risk of typo under pressure.

**Fix Required:**
Either:
1. Add to pre-demo checklist: "Pre-fill Pitch Generator form before demo", OR
2. Pre-populate demo data in Pitch Generator `/demo` page (if you build one)

---

## Minor Concerns (Acceptable, But Note)

### ℹ️ Timing Assumptions
**Script Claims:**
- Audio Intel enrichment: "30 seconds"
- Pitch generation: "15 seconds"

**Reality:**
- Audio Intel demo uses `setTimeout(1500)` - **1.5 seconds**, not 30
- Pitch Generator timing depends on API call to Anthropic - could be 10-30 seconds depending on load

**Impact:**
- Audio Intel will be FASTER than you claim (good!)
- Pitch Generator could be SLOWER than you claim (fill with banter)

**No Fix Required** - just be prepared to adjust on the fly.

---

### ℹ️ Export Timing
**Script Claims:**
- PDF export: "One click" (30 seconds total)

**Reality:**
- PDF export initiates download immediately
- Opening downloaded PDF adds 5-10 seconds
- Could take longer if download folder is messy

**Impact:** Negligible - just don't dwell on it if it's slow.

**No Fix Required** - use backup PDF if export fails.

---

## Demo Readiness Checklist

### [ ] Audio Intel: **MOSTLY READY** (3 fixes needed)
- ✅ Demo page exists (`/demo`)
- ✅ "Load Demo Data" button works
- ✅ Contacts display with intelligence
- ✅ Export functionality exists
- ❌ Only 5 contacts, not 45 (FIX REQUIRED)
- ❌ No individual contact detail view (FIX OR SKIP SECTION 3)
- ❌ Port conflict with other apps (FIX REQUIRED)

### [ ] Pitch Generator: **PARTIALLY READY** (2 fixes needed)
- ✅ `/pitch/generate` page exists
- ✅ Contact dropdown exists
- ✅ Form for artist/track/genre exists
- ✅ Pitch generation works (with auth)
- ❌ Requires authentication (FIX OR LOGIN FIRST)
- ❌ Port conflict with other apps (FIX REQUIRED)
- ❌ No demo data pre-filled for sadact (MINOR - can type live)

### [ ] Campaign Tracker: **NOT READY** (complete rebuild needed)
- ❌ Demo page is placeholder only
- ❌ No dashboard functionality
- ❌ No campaign data
- ❌ No export functionality
- ❌ Port conflict with other apps (FIX REQUIRED)
- **RECOMMENDATION: Skip this entirely or build from scratch**

### [ ] Demo Data (sadact / "Maybe (i)"): **WORKS** (manual entry OK)
- ✅ Can manually type artist name and track
- ⚠️ No pre-fill (minor issue)

---

## Specific Fixes Needed Before Thursday 19th

### FIX 1: Port Configuration (30 minutes)
**File:** `/home/user/total-audio-platform/package.json`

**Add these scripts:**
```json
"dev:audio-intel": "cd apps/audio-intel && next dev -p 3000",
"dev:pitch": "cd apps/pitch-generator && next dev -p 3004",
"dev:tracker": "cd apps/tracker && next dev -p 3001",
"demo:all": "concurrently \"pnpm run dev:audio-intel\" \"pnpm run dev:pitch\" \"pnpm run dev:tracker\""
```

**Install concurrently:** `pnpm add -D concurrently`

**Test:** `pnpm run demo:all` - verify all three apps start on different ports

---

### FIX 2: Audio Intel Contact Count (15 minutes)
**File:** `apps/audio-intel/app/demo/page.tsx` line 94

**Option A: Add 40 more contacts** (time-consuming)
- Copy existing contact structure 40 more times
- Use real BBC Radio / industry contacts

**Option B: Change script to say "5 contacts"** (5 minutes - RECOMMENDED)
- Edit DETAILED_DEMO_SCRIPT.md Section 2
- Change "45 BBC Radio contacts" to "5 key industry contacts (BBC Radio 1, Spotify)"
- Adjust timing narrative accordingly

---

### FIX 3: Campaign Tracker - Remove or Build (2 options)

**Option A: Remove Tracker from demo** (30 minutes - RECOMMENDED)
1. Delete Sections 9, 10, 11 from DETAILED_DEMO_SCRIPT.md
2. Update Section 8 transition to go straight to wrap-up
3. Update Section 12 wrap-up to only mention Audio Intel + Pitch Generator
4. Reduces demo from 10 min to ~7 min (still plenty)

**Option B: Build functional Tracker demo** (4-6 hours - NOT RECOMMENDED)
1. Create mock campaign data in `apps/tracker/app/demo/page.tsx`
2. Build dashboard UI showing campaigns
3. Build campaign detail view
4. Add export functionality
5. Test thoroughly
6. **NOT worth the time given demo is in days**

**RECOMMENDATION:** Remove Tracker from demo. Focus on Audio Intel + Pitch Generator integration story.

---

### FIX 4: Pitch Generator Authentication (30 minutes)

**Option A: Login before demo** (5 minutes - EASIEST)
1. Add to pre-demo checklist: "Login to Pitch Generator before presenting"
2. Keep browser window logged in
3. Test beforehand to verify session persists

**Option B: Create public demo page** (30 minutes)
1. Create `apps/pitch-generator/app/demo/page.tsx`
2. Remove authentication requirement for this page
3. Add pre-filled demo data (sadact / Maybe (i))
4. Test generation works without auth

**RECOMMENDATION:** Option A (login first). Simpler, less risk.

---

### FIX 5: Update Script for Contact Detail (5 minutes)

**File:** `DETAILED_DEMO_SCRIPT.md` Section 3

**Option A: Skip Section 3 entirely**
- Intelligence already visible in list
- No click-through needed
- Shaves 1 minute off demo

**Option B: Revise Section 3 to scroll/highlight**
Change:
> "Click into Jack Saunders contact → Scroll through intelligence"

To:
> "Scroll down to Jack Saunders in the results → Point out the intelligence"

**RECOMMENDATION:** Option B (small script change, no code changes)

---

## Revised Demo Flow (Without Tracker)

**New Structure: 7 minutes + 2 min buffer = 9 min total**

1. **Problem Setup** (30 sec) - NO CHANGES
2. **Audio Intel - Enrichment** (2 min) - Change "45" to "5 contacts"
3. **Show Intelligence Quality** (1 min) - Scroll/highlight, don't click
4. **Export PDF** (30 sec) - Remember to switch to Analytics tab first
5. **Transition to Pitch Generator** (15 sec) - NO CHANGES
6. **Pitch Generator - Setup** (30 sec) - Be logged in beforehand
7. **Pitch Generator - Generate** (1 min) - NO CHANGES
8. **Show Pitch Quality** (1 min) - NO CHANGES
9. **~~Campaign Tracker~~** - **REMOVED**
10. **Integration Wrap-up** (1 min) - Mention only Audio Intel + Pitch Generator

**New script:**
> "Two tools, one ecosystem. [TAB to Audio Intel] Enrich 5 industry contacts in seconds. [TAB to Pitch Generator] Generate personalized pitches instantly. This is 15 hours of manual work, done in minutes. Questions before we talk ROI?"

---

## Pre-Demo Technical Checklist (Updated)

### 30 Minutes Before:
- [ ] Start all apps with port-specific commands:
  - `pnpm run dev:audio-intel` (port 3000)
  - `pnpm run dev:pitch` (port 3004)
  - ~~`pnpm run dev:tracker` (SKIP - not using)~~
- [ ] Verify Audio Intel loads at `localhost:3000/demo`
- [ ] Click "Load Demo Data" - verify 5 contacts appear
- [ ] Switch to Analytics tab - verify Export PDF button visible
- [ ] Verify Pitch Generator loads at `localhost:3004/pitch/generate`
- [ ] **Login to Pitch Generator** - verify authenticated
- [ ] Verify contact dropdown populated
- [ ] Browser zoom set to 125%
- [ ] Notifications disabled (Do Not Disturb)
- [ ] Backup materials in `/demo-backup/` folder
- [ ] Laptop plugged into power
- [ ] Mobile hotspot ready as backup internet

---

## Summary: What You Must Do Before Thursday

### CRITICAL (Must Complete):
1. ✅ **Fix port conflicts** - Add dev:audio-intel, dev:pitch, dev:tracker scripts
2. ✅ **Update script** - Change "45 contacts" to "5 contacts" throughout
3. ✅ **Remove Tracker sections** - Delete Sections 9-11 from script
4. ✅ **Pre-login to Pitch Generator** - Add to checklist, test session persists

### RECOMMENDED (Highly Advised):
5. ✅ **Revise Section 3** - Change "click into" to "scroll to and highlight"
6. ✅ **Test full run-through** - Practice revised 7-minute demo at least 3 times
7. ✅ **Create backup screenshots** - Screenshot every screen in case apps crash

### OPTIONAL (Nice to Have):
8. ⚠️ **Add 40 more contacts** - Only if you have time and want to keep "45 contacts" claim
9. ⚠️ **Build Tracker demo page** - Only if you want to keep Tracker in demo (NOT recommended)

---

## Final Recommendation

**You have 2 realistic options:**

### Option A: Quick Fixes + Revised Demo (RECOMMENDED)
- **Time:** 2-3 hours total
- **Fixes:** Port config, script changes, remove Tracker, login setup
- **Result:** Solid 7-minute demo of Audio Intel + Pitch Generator integration
- **Risk:** Low - fewer moving parts, proven functionality
- **Impact:** Still impressive, focuses on strongest features

### Option B: Build Everything + Keep Original Demo
- **Time:** 8-10 hours total
- **Fixes:** All of Option A + build Tracker demo page + add 40 contacts
- **Result:** Full 10-minute demo as originally scripted
- **Risk:** High - rushing new features, untested code, more failure points
- **Impact:** More impressive IF it works, disaster if it breaks

**MY RECOMMENDATION:** **Option A** - Fix what's broken, remove what doesn't exist, deliver a polished demo of what DOES work well.

---

## Bottom Line

Your script promises features that don't exist. You have three choices:

1. **Fix the apps** to match the script (8-10 hours of work)
2. **Fix the script** to match the apps (2-3 hours of work) ← RECOMMENDED
3. **Present anyway** and look like a pillock when features don't work

The smart play: Revise the demo to showcase Audio Intel + Pitch Generator brilliantly, skip Tracker entirely, practice the hell out of it, and nail the 7-minute version.

**Liberty won't care that you showed 2 tools instead of 3. They WILL care if the demo crashes.**

---

**Audit completed:** Ready to fix?
