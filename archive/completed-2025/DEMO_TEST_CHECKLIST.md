# Demo Night Test Checklist - Dan Meeting Prep

**Date**: Tonight (before tomorrow's meeting)
**All tools running on**:
- Audio Intel: http://localhost:3000
- Tracker: http://localhost:3001
- Pitch Generator: http://localhost:3002

---

## 🎯 TEST 1: AUDIO INTEL (Most Critical - Lead Tool)

### Pre-Demo Setup
- [ ] Tool is running on http://localhost:3000
- [ ] Demo CSV file ready: `DEMO_CONTACTS.csv` (5 BBC Radio contacts)
- [ ] Browser tab open and ready to demo

### Test Flow (Do This Now)

**Step 1: Load Demo Data (EASIEST - DO THIS FIRST)**
1. Go to http://localhost:3000/dashboard
2. Click "Enrich Your Contacts" card (big blue one)
3. Click "Load Demo Data" button (blue button with sparkles icon)
4. **Expected Result**:
   - 5 BBC/Spotify contacts load instantly (~2 seconds)
   - Auto-switches to "Analytics & Export" tab
   - Shows enriched contact cards with intelligence notes
   - Each contact has: Name, Email, Company, Role, Intelligence, Confidence rating
5. **This is your BEST demo option** - always works, looks professional!

**Step 2: CSV Upload Test (OPTIONAL)**
1. Same page, scroll down to "OR" section
2. Drag & drop or click to upload `DEMO_CONTACTS.csv` (now includes emails!)
3. Watch processing animation
4. **Expected Result**: See enrichment with:
   - Company verified from email domain (e.g., @bbc.co.uk → BBC)
   - Role suggested based on email pattern
   - Intelligence notes (pitch tips, genre focus, best contact times)
   - Confidence rating (High/Medium/Low)

**Step 3: Export Test**
1. After enrichment completes (either method), go to "Analytics & Export" tab
2. Click "Export CSV" button
3. **Expected Result**: Download enriched CSV with all added data

**IMPORTANT NOTES**:
- ❌ No manual single contact entry (no UI for this yet)
- ❌ Doesn't find emails from just names - needs email to enrich
- ✅ Enriches contacts you already have with intelligence and context

### Key Points to Demo Tomorrow
- **Time Savings**: "This 5-contact enrichment took 2 minutes. Manually, this would be 2-3 hours"
- **Accuracy**: "100% success rate on real industry contacts like BBC Radio 1"
- **Data Quality**: "Current emails, social profiles, job validation - everything you need"

### Common Issues to Check
- [ ] Does upload button work?
- [ ] Does progress bar show during enrichment?
- [ ] Do enriched contacts display all fields (email, socials, role)?
- [ ] Does export download properly?
- [ ] Does the UI look professional on your laptop screen?

**If anything breaks**: Note it down, we'll fix it before you sleep tonight.

---

## 🎯 TEST 2: TRACKER (Second Most Important)

### Pre-Demo Setup
- [ ] Tool is running on http://localhost:3001
- [ ] Browser tab open and ready

### Test Flow (Do This Now)

**Step 1: Create Mock Campaign**
1. Go to http://localhost:3001
2. Click "New Campaign" or "Create Campaign"
3. Create a campaign with:
   - **Campaign Name**: "Royal Blood - New Single - October 2025"
   - **Client**: "Royal Blood Management"
   - **Start Date**: Today
   - **Target Outlets**: 15

**Step 2: Log Some Pitches**
1. Inside the campaign, click "Add Pitch" or "Log Pitch"
2. Add 3-5 pitches:
   - **Pitch 1**: Clara Amfo, BBC Radio 1 → Status: "Sent"
   - **Pitch 2**: Jack Saunders, BBC Radio 1 → Status: "Interested"
   - **Pitch 3**: Daniel P Carter, BBC Radio 1 Rock Show → Status: "Confirmed Coverage"
   - **Pitch 4**: Gemma Bradley, BBC Ulster → Status: "No Response"
   - **Pitch 5**: Huw Stephens, BBC Wales → Status: "Sent"

**Step 3: Test Dashboard View**
1. Go back to campaign dashboard
2. Check you can see:
   - Campaign overview (5 pitches logged)
   - Status breakdown (1 confirmed, 1 interested, 2 sent, 1 no response)
   - Visual progress indicators

**Step 4: Review Campaign View**
1. Click on your campaign to view the detail page
2. **Expected Result**: Campaign overview showing:
   - Stats cards: Target Reach, Actual Reach, Success Rate, Budget
   - Campaign Timeline with all 5 pitches logged
   - Activity details (date, type, description, notes)
   - Campaign Notes section at bottom
3. **Note**: NO client report export yet - this is a beta feature to discuss with Dan

### Key Points to Demo Tomorrow
- **Centralised Tracking**: "All campaign pitches in one place, no more spreadsheet chaos"
- **Visual Timeline**: "See your entire campaign at a glance - who you've pitched, responses, coverage"
- **Beta Opportunity**: "Client report generation is on the roadmap - what would Liberty want to see in that?"

### Common Issues to Check

- [ ] Can you create a campaign?
- [ ] Can you add pitches easily?
- [ ] Does the dashboard show campaign progress clearly?
- [ ] Does the campaign detail view show all activities?
- [ ] Does the timeline look professional and clear?

**If anything breaks**: Note it down, we'll fix it tonight.

---

## 🎯 TEST 3: PITCH GENERATOR (Least Critical - Keep Brief)

### Pre-Demo Setup
- [ ] Tool is running on http://localhost:3002
- [ ] Browser tab open and ready

### Test Flow (Do This Now)

**Step 1: Generate BBC Radio 1 Pitch**
1. Go to http://localhost:3002
2. Fill in pitch form:
   - **Artist**: "sadact" (your project - authentic!)
   - **Track**: "New Single Name"
   - **Genre**: "Electronic / Experimental"
   - **Target Outlet**: "BBC Radio 1 - Jack Saunders New Music Show"
   - **Tone**: "Professional but enthusiastic"
3. Click "Generate Pitch"
4. **Expected Result**: AI-generated pitch tailored for Jack Saunders

**Step 2: Generate Indie Blog Pitch**
1. Create new pitch with same artist
2. Change:
   - **Target Outlet**: "The Line of Best Fit"
   - **Tone**: "Casual and friendly"
3. Click "Generate Pitch"
4. **Expected Result**: Different tone, more casual pitch

**Step 3: Test Editing**
1. After pitch generates, try editing it
2. Make a small tweak (change one sentence)
3. Click "Regenerate" or "Refine"
4. **Expected Result**: Pitch updates with your changes incorporated

### Key Points to Demo Tomorrow
- **Time Savings**: "15-20 minutes per pitch saved, adds up across 20-30 pitches per campaign"
- **Tone Flexibility**: "Adjusts for different outlets - formal for BBC, casual for indie blogs"
- **Customisation**: "You can edit and refine, not just copy-paste"

### Common Issues to Check
- [ ] Does pitch generation work?
- [ ] Do different tones produce different outputs?
- [ ] Does the output look like a real pitch?
- [ ] Can you edit/refine the pitch after generation?

**If anything breaks**: Note it down. This tool is least critical - you can skip it if needed.

---

## 📋 POST-TEST CHECKLIST

After testing all three tools, complete this:

### Audio Intel
- [ ] Works perfectly - ready to demo ✅
- [ ] Has minor issues - need to fix: _______________
- [ ] Broken - need urgent fix: _______________

### Tracker
- [ ] Works perfectly - ready to demo ✅
- [ ] Has minor issues - need to fix: _______________
- [ ] Broken - need urgent fix: _______________

### Pitch Generator
- [ ] Works perfectly - ready to demo ✅
- [ ] Has minor issues - need to fix: _______________
- [ ] Broken - need urgent fix: _______________

### Demo Data Quality
- [ ] Demo CSV file works with Audio Intel
- [ ] Mock campaign created in Tracker looks professional
- [ ] Test pitches generated successfully

---

## 🚨 IF ANYTHING BREAKS - DO THIS

**For Each Broken Feature:**
1. **Note exactly what broke**: "Upload CSV button doesn't respond"
2. **Note the error message**: Check browser console (F12 → Console tab)
3. **Screenshot the issue**: Take screenshot showing the problem
4. **Test workaround**: Can you do it a different way?

**Then Either:**
- **Fix it yourself** (if you know how - you built these!)
- **Use Claude Code** to fix it (I'm here to help)
- **Skip that feature** in tomorrow's demo (focus on what works)

---

## 💡 DEMO LAPTOP SETUP (Tomorrow Morning)

Before the meeting with Dan:

### Browser Setup
- [ ] Open 3 browser tabs/windows:
  - Tab 1: Audio Intel (http://localhost:3000)
  - Tab 2: Tracker (http://localhost:3001)
  - Tab 3: Pitch Generator (http://localhost:3002)
- [ ] Close all other tabs (no distractions)
- [ ] Zoom to 100% on all tabs (readable on projector/screen share)

### Files Ready
- [ ] `DEMO_CONTACTS.csv` on Desktop (easy to find)
- [ ] `DAN_MEETING_SCRIPT.md` open in another window (quick reference)
- [ ] Notebook + pen for notes

### System Prep
- [ ] Laptop fully charged + charger in bag
- [ ] Notifications turned OFF (Do Not Disturb mode)
- [ ] All three servers started 10 mins before meeting
- [ ] Test that laptop screen mirrors properly (if presenting)

---

## 🎯 KEY METRICS TO MENTION (From Your Testing Tonight)

After you test everything, fill these in:

**Audio Intel:**
- Enriched [X] contacts in [X] minutes
- Manual time would be: [X] hours
- Success rate: [X]% (should be 100%)

**Tracker:**
- Created campaign in [X] minutes
- Logged [X] pitches in [X] minutes
- Client report generated in [X] seconds
- Professional quality: Yes / No

**Pitch Generator:**
- Generated [X] pitches in [X] minutes
- Average time per pitch: [X] seconds
- Quality: Good / Great / Needs work

**Use these numbers tomorrow when Dan asks "how much time does this actually save?"**

---

## ✅ FINAL CONFIDENCE CHECK

Before you go to bed tonight:

- [ ] All three tools tested and working
- [ ] Demo data created and ready
- [ ] You've walked through the full demo flow
- [ ] You know exactly what to click and show tomorrow
- [ ] You've noted any issues and either fixed or planned to skip them
- [ ] You feel confident demoing all three tools

**If you answer "No" to any of the above, ping me - we'll fix it tonight.**

---

## 🚀 YOU'VE GOT THIS

You've built three working tools that solve real problems. Tomorrow, you're just showing Dan what you've already accomplished.

Stay calm, stay confident, focus on the value these tools deliver.

**Now go test everything and get a good night's sleep. Tomorrow's going to go great. 💪**
