# CSV Workflow Testing Checklist

## Prerequisites ✅

- [x] Audio Intel blog fixes committed and pushed
- [x] Mobile header amber sign-in button deployed
- [ ] Audio Intel builds successfully (pending UI package fix)
- [ ] Tracker builds successfully

## Task 1: Test Audio Intel Export API

### Manual API Testing with curl

```bash
# Navigate to project root
cd /Users/chrisschofield/workspace/active/total-audio-platform

# Test export-to-tracker endpoint
curl -X POST http://localhost:3000/api/export-to-tracker \
  -H "Content-Type: application/json" \
  -d '{
    "contacts": [
      {
        "name": "Annie Mac",
        "email": "annie@bbc.co.uk",
        "contactIntelligence": "BBC Radio 1 Future Sounds host. Specializes in electronic music discovery.",
        "researchConfidence": "High",
        "lastResearched": "2025-10-13T12:00:00Z",
        "platform": "BBC Radio",
        "role": "DJ/Presenter",
        "company": "BBC"
      },
      {
        "name": "Clara Amfo",
        "email": "clara@bbc.co.uk",
        "contactIntelligence": "BBC Radio 1 daytime presenter. Focus on R&B and new British talent.",
        "researchConfidence": "High",
        "lastResearched": "2025-10-13T12:00:00Z",
        "platform": "BBC Radio",
        "role": "DJ/Presenter",
        "company": "BBC"
      }
    ],
    "campaignName": "BBC Radio 1 Q1 2025",
    "includeEnrichmentData": true
  }' | jq
```

**Expected Response**:

```json
{
  "success": true,
  "format": "tracker-csv",
  "filename": "bbc-radio-1-q1-2025-contacts-2025-10-13.csv",
  "content": "Name,Email,Outlet,Role,Status,Notes,Contacted Date,Response Date\n...",
  "contactsCount": 2,
  "downloadUrl": "data:text/csv;charset=utf-8,...",
  "deepLink": "https://tracker.totalaudiopromo.com/dashboard/import?source=audio-intel&contacts=2"
}
```

**Validation Checklist**:

- [ ] Response status is 200
- [ ] `success: true` in response
- [ ] `contactsCount` matches input (2)
- [ ] CSV content includes all 2 contacts
- [ ] CSV headers: Name,Email,Outlet,Role,Status,Notes,Contacted Date,Response Date
- [ ] Notes field contains enrichment data (Intelligence, Confidence, etc.)
- [ ] Deep link URL includes `?source=audio-intel&contacts=2`
- [ ] Filename is slugified campaign name + date

### Error Handling Tests

**Test 1: Empty contacts array**

```bash
curl -X POST http://localhost:3000/api/export-to-tracker \
  -H "Content-Type: application/json" \
  -d '{"contacts": [], "campaignName": "Test"}' | jq
```

Expected: 400 error with "No contacts provided for export"

**Test 2: Missing contacts field**

```bash
curl -X POST http://localhost:3000/api/export-to-tracker \
  -H "Content-Type: application/json" \
  -d '{"campaignName": "Test"}' | jq
```

Expected: 400 error

**Test 3: Malformed JSON**

```bash
curl -X POST http://localhost:3000/api/export-to-tracker \
  -H "Content-Type: application/json" \
  -d '{invalid json}' | jq
```

Expected: 500 error

---

## Task 2: Test Tracker Import Detection

### Manual Browser Testing

**Step 1: Navigate to Tracker import with source parameter**

```
http://localhost:3001/dashboard/import?source=audio-intel&contacts=42
```

**Expected Behavior**:

- [ ] Page loads successfully
- [ ] Notification appears in top-right corner
- [ ] Notification text: "Ready to import 42 enriched contacts from Audio Intel!"
- [ ] Notification is green with brutalist shadow styling
- [ ] Notification disappears after 5 seconds

**Step 2: Navigate without source parameter**

```
http://localhost:3001/dashboard/import
```

**Expected Behavior**:

- [ ] Page loads successfully
- [ ] NO notification appears
- [ ] Standard import page UI visible

**Step 3: Test with Pitch Generator source (existing feature)**

```
http://localhost:3001/dashboard/import?source=clipboard
```

**Expected Behavior**:

- [ ] Clipboard import logic triggers (if clipboard has data)
- [ ] Different from Audio Intel notification

### Code Verification

Check the detection logic in `apps/tracker/app/dashboard/import/page.tsx`:

```typescript
// Should be around line 37-49
useEffect(() => {
  const source = searchParams?.get('source');
  if (source === 'audio-intel') {
    const contactsCount = searchParams?.get('contacts');
    setNotification(
      contactsCount
        ? `Ready to import ${contactsCount} enriched contacts from Audio Intel!`
        : 'Ready to import enriched contacts from Audio Intel!'
    );
    setTimeout(() => setNotification(null), 5000);
  }
}, [searchParams]);
```

**Validation**:

- [ ] UseEffect depends on `searchParams`
- [ ] Checks for `source === 'audio-intel'`
- [ ] Reads `contacts` count from URL
- [ ] Sets notification with timeout
- [ ] Doesn't interfere with Pitch Generator clipboard import

---

## Task 3: Test "Send to Tracker" UI Button

### Development Server Testing

**Step 1: Start Audio Intel dev server**

```bash
cd /Users/chrisschofield/workspace/active/total-audio-platform
npm run dev:audio-intel
# Opens on http://localhost:3000
```

**Step 2: Navigate to demo page**

```
http://localhost:3000/demo
```

**Step 3: Enrich some contacts**

- Paste test emails:
  ```
  annie@bbc.co.uk
  clara@bbc.co.uk
  ```
- Click "Enrich Contacts"
- Wait for enrichment to complete

**Step 4: Locate "Send to Tracker" button**

- Scroll down to "Professional Export Options" section
- Below the 3 export buttons (CSV, Excel, PDF)
- Should see "🚀 Tool Integration" section
- Button text: "Send X Contacts to Tracker"

**Button Appearance Checklist**:

- [ ] Button is amber/yellow (bg-amber-600)
- [ ] Full width with shadow styling
- [ ] Arrow icon pointing right
- [ ] "Direct Import" badge visible
- [ ] Shows correct contact count
- [ ] Help text below: "Automatically opens Tracker import page..."

**Step 5: Click "Send to Tracker" button**

**Expected Behavior (in order)**:

1. [ ] Button becomes disabled
2. [ ] Loading message: "Preparing contacts for Tracker..."
3. [ ] CSV file downloads automatically (check Downloads folder)
4. [ ] Loading message: "Opening Tracker..."
5. [ ] New tab opens with Tracker import page
6. [ ] Success message: "X contacts sent to Tracker!"
7. [ ] Button re-enables after 3 seconds

**CSV File Validation**:

- [ ] File exists in Downloads: `audio-intel-tracker-export-YYYY-MM-DD.csv`
- [ ] File opens in Excel/Numbers/CSV viewer
- [ ] Contains correct headers
- [ ] Has 2 rows (Annie Mac, Clara Amfo)
- [ ] Notes column has enrichment data

**Tracker Tab Validation**:

- [ ] Opens at `/dashboard/import?source=audio-intel&contacts=2`
- [ ] Notification shows in Tracker
- [ ] Upload CSV section visible

### Error Scenarios

**Test 1: Click button with no contacts enriched**

- Load `/demo` page
- Don't enrich any contacts
- Try clicking "Send to Tracker"

Expected: Nothing happens (button should be disabled or prevent action)

**Test 2: Network error simulation**

- Open browser DevTools → Network tab
- Set network to "Offline"
- Enrich contacts
- Click "Send to Tracker"

Expected: Error message "Failed to send to Tracker: [network error]"

---

## Task 4: End-to-End CSV Workflow Test

### Complete User Journey

**Persona**: Radio promoter with 5 BBC Radio contacts

**Step 1: Research Phase (Audio Intel)**

1. Navigate to `http://localhost:3000/demo`
2. Paste 5 contacts:
   ```
   annie@bbc.co.uk
   clara@bbc.co.uk
   jack.saunders@bbc.co.uk
   danny.howard@bbc.co.uk
   pete.tong@bbc.co.uk
   ```
3. Click "Enrich Contacts"
4. Wait for all 5 to complete (should show green checkmarks)
5. Review enrichment results (intelligence, confidence scores)

**Validation**:

- [ ] All 5 contacts enriched successfully
- [ ] At least 3 have "High" confidence
- [ ] Intelligence data shows BBC Radio context
- [ ] "Send to Tracker" button shows "Send 5 Contacts to Tracker"

**Step 2: Export to Tracker**

1. Click "Send 5 Contacts to Tracker" button
2. Observe loading states
3. CSV downloads (check Downloads folder)
4. Tracker opens in new tab

**Validation**:

- [ ] CSV file downloaded: `audio-intel-tracker-export-2025-10-13.csv`
- [ ] Tracker tab opened with URL: `?source=audio-intel&contacts=5`
- [ ] Green notification visible in Tracker
- [ ] Audio Intel tab still open and functional

**Step 3: Import in Tracker**

1. In Tracker tab, locate file upload area
2. Upload the downloaded CSV file
3. Review preview (first 5 rows)
4. Click "Import" button

**Validation**:

- [ ] CSV preview shows 5 contacts
- [ ] Names match: Annie Mac, Clara Amfo, Jack Saunders, Danny Howard, Pete Tong
- [ ] Outlets all show "BBC Radio" or similar
- [ ] Notes column has enrichment data visible
- [ ] Import button enabled

**Step 4: Verify Import Success**

1. Click "Import" in Tracker
2. Wait for import to complete
3. Navigate to `/dashboard` in Tracker

**Validation**:

- [ ] Success notification shows "5 campaigns imported"
- [ ] Dashboard shows 5 new campaign entries
- [ ] Each campaign has:
  - Correct contact name
  - Email address preserved
  - Outlet = "BBC Radio"
  - Status = "pending"
  - Notes field has enrichment intelligence

**Step 5: Data Integrity Check**

1. Click on "Annie Mac" campaign in Tracker
2. View campaign details

**Validation**:

- [ ] Name: "Annie Mac"
- [ ] Email: "annie@bbc.co.uk"
- [ ] Outlet: "BBC Radio"
- [ ] Notes contain:
  - "Intelligence: BBC Radio 1 Future Sounds host..."
  - "Confidence: High"
  - "Researched: 2025-10-13"
  - "Company: BBC"
- [ ] Status: "pending"
- [ ] Contacted Date: empty
- [ ] Response Date: empty

Repeat for 1-2 other contacts to verify data consistency.

---

## Task 4 Extended: Campaign Tracking Test

**Step 6: Simulate Campaign Activity**

1. In Tracker, mark Annie Mac as "contacted"
2. Set contacted date to today
3. Add note: "Sent new single pitch"
4. Save changes

**Validation**:

- [ ] Status updates to "contacted"
- [ ] Contacted date saved
- [ ] Original enrichment notes still visible
- [ ] New campaign note appended

**Step 7: Simulate Response**

1. Mark Annie Mac as "responded"
2. Set response date
3. Add note: "Requested press kit"

**Validation**:

- [ ] Status = "responded"
- [ ] Response date saved
- [ ] Both enrichment AND campaign notes visible
- [ ] Campaign timeline shows progression

**Step 8: Analytics Check**

1. Navigate to Tracker analytics/dashboard
2. Check for campaign metrics

**Validation**:

- [ ] 5 campaigns visible in overview
- [ ] 1 contacted, 1 responded, 3 pending
- [ ] Response rate: 20% (1/5)
- [ ] Platform breakdown shows "BBC Radio"

---

## Production Testing (After Deploy)

### Cross-Domain Testing

**Important**: Local testing uses `localhost:3000` → `localhost:3001`. Production uses:

- Audio Intel: `https://intel.totalaudiopromo.com`
- Tracker: `https://tracker.totalaudiopromo.com`

**Test deep linking works cross-domain**:

1. Navigate to `https://intel.totalaudiopromo.com/demo`
2. Enrich 2-3 contacts
3. Click "Send to Tracker"
4. Verify opens `https://tracker.totalaudiopromo.com/dashboard/import?source=audio-intel&contacts=3`

**Expected Behavior**:

- [ ] Cross-domain navigation works (no CORS errors)
- [ ] Notification triggers correctly
- [ ] CSV download works (not blocked by browser)
- [ ] User can upload CSV (same domain as Tracker)

### Mobile Testing

**Test on actual mobile device**:

1. Open Audio Intel demo on phone
2. Enrich contacts
3. Click "Send to Tracker"

**Expected Behavior**:

- [ ] Button is tappable (not too small)
- [ ] CSV downloads to phone
- [ ] Tracker opens in new tab (mobile browser)
- [ ] Can upload CSV from phone downloads
- [ ] Notification visible on mobile screen

---

## Performance Benchmarks

### Target Metrics

| Operation           | Target | Method                                    |
| ------------------- | ------ | ----------------------------------------- |
| Export API response | <200ms | Chrome DevTools Network tab               |
| CSV download        | <500ms | Time from click to file in Downloads      |
| Tracker page load   | <2s    | Time from click to notification visible   |
| Import 50 contacts  | <3s    | Time from click Import to success message |

### How to Measure

**Export API**:

```bash
# Run 10 times and average
time curl -X POST http://localhost:3000/api/export-to-tracker \
  -H "Content-Type: application/json" \
  -d @test-contacts.json
```

**Page Load**:

- Chrome DevTools → Network → Disable cache → Reload
- Check "Load" time in Network tab footer

**Import Speed**:

- Use browser DevTools Performance tab
- Record from "Import" button click to success notification

---

## Troubleshooting Common Issues

### Issue 1: "Send to Tracker" button does nothing

**Diagnosis**:

- Check browser console for JavaScript errors
- Verify `/api/export-to-tracker` endpoint exists
- Check Network tab for failed requests

**Fix**:

- Ensure Audio Intel dev server is running
- Verify route file exists and exports POST function
- Check request payload in Network tab

### Issue 2: CSV downloads but Tracker doesn't open

**Diagnosis**:

- Check if popup blocked (browser notification)
- Verify deep link URL in API response
- Check browser console for errors

**Fix**:

- Allow popups for localhost:3000
- Test `window.open()` with simple URL first
- Ensure Tracker dev server is running on port 3001

### Issue 3: Tracker import fails

**Diagnosis**:

- Check CSV file content (encoding issues?)
- Verify all required fields present
- Check Tracker API response in Network tab

**Fix**:

- Re-download CSV and check format
- Ensure UTF-8 encoding
- Check Tracker `/api/campaigns/import` endpoint

### Issue 4: Enrichment data not in Tracker notes

**Diagnosis**:

- Open CSV in text editor
- Check if Notes column has content
- Verify `includeEnrichmentData: true` in request

**Fix**:

- Re-export from Audio Intel
- Check export API response for notes content
- Manually verify CSV Notes column

---

## Success Criteria Summary

**All tasks pass if**:

✅ **Task 1**: Export API returns valid CSV with correct format
✅ **Task 2**: Tracker detects Audio Intel source and shows notification
✅ **Task 3**: Button triggers download + opens Tracker correctly
✅ **Task 4**: End-to-end workflow preserves all enrichment data

**Ready for Production** when:

- All 4 tasks pass on localhost
- Cross-domain testing passes
- Mobile testing passes
- Performance benchmarks met
- No console errors in any step

---

## Next Steps After Testing

1. **Document Issues**: Create GitHub issues for any bugs found
2. **Performance Optimization**: If metrics exceed targets, optimize
3. **User Feedback**: Share with 2-3 beta testers (radio promoters)
4. **Analytics Review**: Check if events are firing correctly
5. **Documentation Update**: Update CSV_WORKFLOW_GUIDE.md with any findings

**Deployment Approval**: Once all tests pass, ready to merge to main and deploy to production.

---

**Testing Date**: October 13, 2025
**Tester**: Chris Schofield
**Status**: Ready to begin testing
**Prerequisites**: Audio Intel + Tracker dev servers running on localhost
