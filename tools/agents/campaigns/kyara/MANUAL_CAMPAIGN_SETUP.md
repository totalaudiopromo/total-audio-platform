# Manual KYARA Campaign Setup for Tracker

## Quick Setup Guide (5 Minutes)

**Goal:** Add KYARA "Bloodshot" campaign to tracker.totalaudiopromo.com manually
**When:** Thursday night (before Friday demo with Dan)

---

## 🚀 QUICK START (3 Steps)

### Step 1: Access Tracker & Create Campaign (2 minutes)

1. **Visit:** https://tracker.totalaudiopromo.com/dashboard
2. **Sign in** with your account
3. **Click:** "+ New Campaign" button
4. **Fill in the form:**

```
Campaign Name: KYARA - Bloodshot
Artist Name: KYARA
Track Name: Bloodshot
Status: Active
Platform: Radio
Genre: Electronic
Region: Australia + UK
Start Date: 2025-10-01
Release Date: 2025-10-14 (Monday)
End Date: 2025-11-14
Budget: £2500
Target Reach: 50 stations
Actual Reach: 15 (so far)
```

**Campaign Notes:**

```
Real Liberty Music PR campaign for Sydney artist KYARA.

KEY METRICS (Pre-Release):
- 85 plays across 9 countries (WARM data)
- Amazing Radio (UK) confirmed support
- Triple J Home & Hosed history ("Yearn" played Aug 2024)
- 15 radio contacts pitched (initial wave)

CONTACTS PITCHED:
WARM: Anika Luna (Triple J Home & Hosed)
HIGH PRIORITY: Claire Mooney, Simon Winkler, Firas, KIIS Music
UK TARGETS: Danny Howard, Pete Tong, Amazing Radio

MONDAY 14th OCT: Release day email blast prepared (30+ contacts)
```

5. **Click:** "Create Campaign"

---

### Step 2: Add Campaign Activities (Timeline) (2 minutes)

**After creating the campaign, add these 6 activities:**

**Activity 1:**

- Type: Email Sent
- Date: 2025-10-07
- Description: `Initial pitch wave sent to 15 Australian radio contacts (Triple J, Triple R, PBS FM, KIIS, FBi Radio)`

**Activity 2:**

- Type: Email Sent
- Date: 2025-10-08
- Description: `5 Gmail drafts auto-created for Australian radio using Liberty inbox`

**Activity 3:**

- Type: Response
- Date: 2025-10-09
- Description: `Amazing Radio (UK) confirmed support for "Bloodshot" - CONFIRMED ADD`

**Activity 4:**

- Type: Milestone
- Date: 2025-10-10
- Description: `WARM report: 85 plays across 9 countries (pre-release) - pulled via API`

**Activity 5:**

- Type: Email Sent
- Date: 2025-10-10
- Description: `Mailchimp campaign sent to 20 UK electronic specialist contacts (BBC Radio 1, BBC 6 Music)`

**Activity 6:**

- Type: Scheduled
- Date: 2025-10-11
- Description: `Release day email blast prepared for Monday 14th Oct 7am AEST (30 recipients, AU + UK)`

---

### Step 3: Verify Dashboard (1 minute)

1. **Return to dashboard:** https://tracker.totalaudiopromo.com/dashboard
2. **Check you see:**

   - KYARA - Bloodshot campaign card
   - Status: Active
   - Release Date: Monday 14th Oct
   - Stats: 15 contacts, 85 plays mentioned
   - Activity timeline showing 6 events

3. **Take screenshots** for backup (5-6 screenshots):
   - Dashboard overview
   - KYARA campaign card
   - Activity timeline
   - Campaign details view

---

## 🎯 WHAT THIS GIVES YOU FOR DEMO

### Dan Will See:

**1. Real Campaign Data:**

- Actual Liberty client (KYARA)
- Real release date (Monday 14th Oct)
- Real metrics (85 plays, 15 contacts, Amazing Radio support)

**2. Activity Timeline:**

- Week-by-week progress visible
- Integration points shown (Gmail, Mailchimp, WARM)
- Release day preparation visible

**3. Campaign Intelligence:**

- At-a-glance status (Active, 75% progress)
- Key metrics highlighted
- Next actions suggested

**4. Proof of Concept:**

- Shows how tracker centralizes campaign data
- Demonstrates time savings (no manual spreadsheet updates)
- Showcases integration potential (Gmail, Mailchimp, WARM)

---

## 📊 DEMO TALKING POINTS

### When Showing This to Dan:

**Point 1: "This is the KYARA campaign I'm running right now through Liberty"**

- Real client, real data, real release date
- Not hypothetical - this is actually happening

**Point 2: "Look at the activity timeline"**

- Every email, response, milestone logged
- WARM data pulled automatically (85 plays)
- Gmail drafts created via integration

**Point 3: "Imagine this for all 20 Liberty campaigns"**

- At-a-glance status for every campaign
- No more digging through Gmail or spreadsheets
- Automated tracking and reporting

**Point 4: "This saves me 10+ hours per campaign"**

- Manual tracking = 2-3 hours per campaign
- Spreadsheet updates = 1-2 hours per campaign
- Client reports = 2-3 hours per campaign
- With tracker = 30 minutes per campaign

---

## 🔥 ALTERNATIVE: Import Campaign via Script (Advanced)

If you want to use the script instead of manual setup:

### Option A: Run Script with Your Auth Token

1. **Get your Supabase auth token:**

   - Sign in to tracker.totalaudiopromo.com
   - Open browser DevTools (F12)
   - Go to Application → Local Storage → https://tracker.totalaudiopromo.com
   - Copy the `sb-access-token` value

2. **Set environment variable:**

```bash
export SUPABASE_AUTH_TOKEN="your-token-here"
```

3. **Run script:**

```bash
cd /Users/chrisschofield/workspace/active/total-audio-platform/tools/agents/campaigns/kyara
node add-kyara-campaign-to-tracker.js
```

### Option B: Direct Database Insert (Requires Service Role Key)

If you have Supabase service role key:

1. **Get service role key** from Supabase dashboard:

   - Visit: https://app.supabase.com/project/ucncbighzqudaszewjrv/settings/api
   - Copy "service_role" key (NOT anon key)

2. **Add to apps/tracker/.env.local:**

```bash
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

3. **Run script:**

```bash
cd /Users/chrisschofield/workspace/active/total-audio-platform/tools/agents/campaigns/kyara
node add-kyara-campaign-to-tracker.js
```

---

## ✅ MANUAL SETUP IS FASTER (Recommended)

**For your use case:**

- Manual setup = 5 minutes
- Script troubleshooting = 15-30 minutes
- Result is identical

**Manual setup gives you:**

- Familiarity with the tracker UI
- Better understanding for demo
- Ability to show Dan how easy it is
- No auth/permissions headaches

**RECOMMENDATION:** Do manual setup Thursday night, 5 minutes, done.

---

## 📋 THURSDAY NIGHT CHECKLIST

- [ ] Visit tracker.totalaudiopromo.com/dashboard
- [ ] Sign in
- [ ] Click "+ New Campaign"
- [ ] Fill in KYARA campaign details (copy from above)
- [ ] Add 6 campaign activities (timeline)
- [ ] Verify campaign appears on dashboard
- [ ] Take 5-6 screenshots for backup
- [ ] Review demo script (`FRIDAY_DEMO_PREP_COMPLETE.md`)

**Time Required:** 10 minutes total

- 2 min: Create campaign
- 5 min: Add 6 activities
- 3 min: Verify & screenshot

**Result:** Tracker ready to demo to Dan on Friday! 🚀

---

**Bottom Line:**

Don't overthink it. Manual setup is faster and gives you better familiarity with the tracker for the demo. Script is nice-to-have but not necessary.

**You have everything you need. Just add the campaign manually and you're ready to demo! 💪**
