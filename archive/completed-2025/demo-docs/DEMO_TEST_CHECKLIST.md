# Liberty Demo - Pre-Flight Test Checklist

**Run tonight before bed | Run again tomorrow morning**

## Test Environment Setup

```bash
# Terminal 1: Start Audio Intel
cd /Users/chrisschofield/workspace/active/total-audio-platform
cd apps/audio-intel
npm run dev
# Should start on http://localhost:3000
```

---

## ✅ Critical Path Tests (30 mins)

### Test 1: Demo Data Loading

- [ ] Open http://localhost:3000/demo
- [ ] Click "Load Demo Data" button
- [ ] **Expected:** 5 contacts appear in ~1.5 seconds
- [ ] **Expected:** Auto-switches to "Analytics & Export" tab
- [ ] **Expected:** Shows High Confidence badges for BBC contacts
- [ ] ❌ **If fails:** Document error in console (F12)

### Test 2: Contact Intelligence Display

- [ ] Verify Jack Saunders contact shows:
  - `🎵 BBC Radio 1`
  - `📻 Presenter of "Jack Saunders New Music" show`
  - `🎧 Genres: Alternative, Indie, Rock, Electronic`
- [ ] Verify all 5 contacts have intelligence text
- [ ] ❌ **If missing:** Check browser console for errors

### Test 3: Export Functions

- [ ] Click "Export CSV" button
- [ ] **Expected:** File downloads as `audio-intel-contacts-YYYY-MM-DD.csv`
- [ ] Open CSV - verify 5 contacts with intelligence data
- [ ] ❌ **If fails:** Check console error, try again

- [ ] Click "Export Excel" button
- [ ] **Expected:** File downloads as `.xlsx`
- [ ] Open Excel - verify multiple sheets if applicable
- [ ] ❌ **If fails:** Note error message

- [ ] Click "Export PDF" button
- [ ] **Expected:** File downloads as `.pdf`
- [ ] Open PDF - verify professional formatting
- [ ] ❌ **If fails:** Note error message

### Test 4: Pitch Generator Integration

- [ ] Click "→ Pitch" button on Jack Saunders contact
- [ ] **Expected:** Toast notification "Contact copied! Opening Pitch Generator..."
- [ ] **Expected:** New tab opens to https://pitch.totalaudiopromo.com/pitch/generate?import=clipboard
- [ ] **Expected:** Pitch Generator loads (may show empty state - that's OK)
- [ ] Close Pitch tab
- [ ] ❌ **If fails:** Check clipboard contents, verify URL

### Test 5: Send to Tracker (Don't actually click - just verify button exists)

- [ ] Scroll to "Send to Tracker" section
- [ ] **Expected:** Button visible with count "Send 5 Contacts to Tracker"
- [ ] **Don't click during demo** - just verify it's there
- [ ] ✅ **Visual confirmation only**

---

## ✅ Production Tests (15 mins)

### Test 6: Production Deployment

- [ ] Open https://intel.totalaudiopromo.com/demo
- [ ] Click "Load Demo Data"
- [ ] **Expected:** Same behavior as localhost
- [ ] Try one export (CSV)
- [ ] ❌ **If production broken:** Demo from localhost tomorrow

### Test 7: Case Studies Page

- [ ] Open https://intel.totalaudiopromo.com/case-studies
- [ ] **Expected:** 3 case studies visible:
  - BBC Radio 1 Campaign
  - Spotify Editorial
  - Liberty Music PR hypothetical
- [ ] Verify numbers match demo script (15 hours → 15 minutes)
- [ ] ❌ **If missing:** Check for 404 or broken page

### Test 8: Homepage

- [ ] Open https://intel.totalaudiopromo.com
- [ ] Scroll to live demo section
- [ ] **Expected:** Hero section with value proposition
- [ ] **Expected:** "Try it free" CTA visible
- [ ] ❌ **If broken layout:** Note which section

---

## ✅ Error Prevention (10 mins)

### Test 9: Clean Browser State

- [ ] Open Chrome Incognito window
- [ ] Visit https://intel.totalaudiopromo.com/demo
- [ ] Run Test 1 again (Load Demo Data)
- [ ] **Expected:** No "trial expired" messages
- [ ] **Expected:** No auth errors
- [ ] ❌ **If see trial/auth issues:** Use incognito for demo tomorrow

### Test 10: Console Errors

- [ ] With demo page open, press F12
- [ ] Click "Console" tab
- [ ] Look for RED error messages
- [ ] **Expected:** No critical errors (warnings OK)
- [ ] ❌ **If see errors:** Screenshot and document

---

## 🎯 Test Results Summary

### ✅ PASS (Everything works)

**Action:** Sleep well, run quick test tomorrow morning, demo with confidence

### ⚠️ PARTIAL (Some exports fail or minor issues)

**Action:** Note which features work, avoid broken ones in demo

### ❌ FAIL (Demo data doesn't load or major breakage)

**Action:** Run fixes from next section, or pivot to homepage demo only

---

## 📊 Test Scorecard

| Test                    | Pass/Fail | Notes |
| ----------------------- | --------- | ----- |
| 1. Demo Data Loading    | ☐         |       |
| 2. Intelligence Display | ☐         |       |
| 3a. CSV Export          | ☐         |       |
| 3b. Excel Export        | ☐         |       |
| 3c. PDF Export          | ☐         |       |
| 4. Pitch Integration    | ☐         |       |
| 5. Tracker Button       | ☐         |       |
| 6. Production Demo      | ☐         |       |
| 7. Case Studies         | ☐         |       |
| 8. Homepage             | ☐         |       |
| 9. Clean Browser        | ☐         |       |
| 10. Console Errors      | ☐         |       |

**Total Score: \_\_ / 10**

- **10/10:** Demo ready, no changes needed ✅
- **8-9/10:** Demo ready, minor notes ⚠️
- **<8/10:** Identify critical fixes needed 🔧

---

## 🚨 If You Find Issues

**Don't panic.** Document:

1. Which test failed
2. Error message (screenshot console)
3. What you expected vs what happened

Then either:

- **Fix it** if it's quick (< 30 mins)
- **Skip it** in demo and focus on what works
- **Ask me** to help debug (paste error here)

---

**Expected test time: 55 minutes**
**Run tonight: ~11pm**
**Run again tomorrow: 30 mins before call (3:30pm)**
