# QUICK START: Get KYARA Campaign into Tracker NOW

## 5-Minute Setup (Do This Right Now!)

**Your tracker is RUNNING:** Port 3004 is active ✅

---

## 🚀 RIGHT NOW (5 Minutes Total)

### Step 1: Open Tracker (30 seconds)

```bash
# Your tracker is already running on port 3004!
# Just open in browser:
open http://localhost:3004/dashboard
```

**OR** if deployed:

```bash
open https://tracker.totalaudiopromo.com/dashboard
```

---

### Step 2: Sign In / Sign Up (1 minute)

**If you haven't created an account yet:**

1. Click "Sign Up"
2. Use email: chrisschofield@libertymusicpr.com (or your regular email)
3. Create password
4. Verify email (check inbox)

**If you have an account:**

1. Click "Sign In"
2. Enter credentials
3. Go to dashboard

---

### Step 3: Create KYARA Campaign (2 minutes)

**Click: "+ New Campaign" button**

**Fill in this exact data:**

```
BASIC INFO:
Campaign Name: KYARA - Bloodshot
Artist: KYARA
Track: Bloodshot
Status: Active

DETAILS:
Platform: Radio
Genre: Electronic
Region: Australia + UK

DATES:
Start Date: 01/10/2025
Release Date: 14/10/2025 (Monday)
End Date: 14/11/2025

BUDGET & REACH:
Budget: £2500
Target Reach: 50
Actual Reach: 15
```

**Campaign Notes:**

```
Real Liberty Music PR campaign.

PRE-RELEASE STATS:
- 85 plays (9 countries)
- Amazing Radio UK support
- Triple J Home & Hosed history

CONTACTS: 15 pitched
WARM: Anika Luna (Triple J)
HIGH PRIORITY: Claire Mooney, Simon Winkler
UK: Danny Howard, Pete Tong, Amazing Radio

MONDAY 14th: Release blast ready (30 contacts)
```

**Click: "Create Campaign"**

---

### Step 4: Add Timeline Activities (2 minutes)

**After campaign created, add these activities:**

1. **Oct 7** - Email Sent
   - "Initial pitch to 15 Australian radio contacts"

2. **Oct 8** - Email Sent
   - "5 Gmail drafts auto-created (Liberty inbox)"

3. **Oct 9** - Response
   - "Amazing Radio UK confirmed support - ADDED TO ROTATION"

4. **Oct 10** - Milestone
   - "WARM: 85 plays across 9 countries (pre-release)"

5. **Oct 10** - Email Sent
   - "Mailchimp campaign to 20 UK contacts (BBC specialists)"

6. **Oct 11** - Scheduled
   - "Release day blast prepared (Monday 7am AEST, 30 recipients)"

---

## ✅ DONE! (Verify)

**You should now see:**

- KYARA - Bloodshot campaign card on dashboard
- Status: Active
- Release Date: Mon 14th Oct
- 6 activities in timeline
- Stats showing 15 contacts, 85 plays mentioned

---

## 📸 TAKE SCREENSHOTS (1 minute)

**For Friday demo backup:**

1. Dashboard overview (campaign card visible)
2. KYARA campaign detail view
3. Activity timeline (6 events)
4. Any charts/graphs showing
5. Campaign stats summary

**Save to:** `~/Desktop/kyara-demo-screenshots/`

---

## 🎯 NOW USE IT FOR REAL KYARA CAMPAIGN

### Dog-Fooding the Tracker:

**Today (Thursday):**

- ✅ Campaign created
- ✅ Timeline populated
- [ ] Use tracker to track actual emails sent today
- [ ] Log any responses you get
- [ ] Update stats as they come in

**Monday (Release Day):**

- [ ] Log release day blast sent (7am AEST)
- [ ] Track email opens/clicks (if using Mailchimp)
- [ ] Add Amazing Radio response activity
- [ ] Update WARM play count (pull new report)

**Throughout Next Week:**

- [ ] Log all follow-up emails sent
- [ ] Track responses (adds, declines, no response)
- [ ] Update campaign progress
- [ ] Add notes about what's working

**This Gives You:**

- Real campaign data for Dan demo
- Actual usage experience (dog-fooding)
- Genuine feedback on what works/what doesn't
- Authentic demo (not fake data)

---

## 💼 DEMO PREP (Thursday Night)

**After adding campaign:**

1. **Review these files:**
   - `FRIDAY_DEMO_PREP_COMPLETE.md` (main prep guide)
   - `KYARA_CAMPAIGN_SHOWCASE_FOR_DAN_DEMO.md` (detailed demo script)

2. **Practice demo flow (5 min):**
   - "This is the KYARA campaign I'm running right now..."
   - Show dashboard → campaign card → timeline
   - Highlight integrations (Gmail, Mailchimp, WARM)
   - Present business case (£3,900 savings, 49:1 ROI)
   - Ask for pilot (3-5 campaigns, 4 weeks)

3. **Prepare talking points:**
   - 85 plays pre-release (WARM data)
   - Amazing Radio confirmed support
   - 15 contacts pitched, more to come Monday
   - Release day blast ready (30 contacts)
   - All tracked in one place (no spreadsheets!)

---

## 🚨 TROUBLESHOOTING

### "Tracker won't load at localhost:3004"

**Check if it's running:**

```bash
lsof -ti:3004
```

**If nothing returned, start it:**

```bash
cd /Users/chrisschofield/workspace/active/total-audio-platform
npm run dev:tracker
```

**OR start on different port:**

```bash
PORT=3004 npm run dev -- apps/tracker
```

### "Can't create campaign - form won't submit"

**Check console for errors:**

- Open DevTools (F12)
- Look for red errors
- Usually: Supabase connection issue or auth issue

**Quick fix:**

- Try signing out and back in
- Clear browser cache
- Check apps/tracker/.env.local has correct Supabase URL/key

### "Activities won't save"

**Check database schema:**

- Campaign activities might need migration
- Check: `apps/tracker/supabase/migrations/`

**Workaround:**

- Add activities as notes in campaign notes field
- Still works for demo, just different UI

---

## 🎉 YOU'RE READY!

**What You Have Now:**
✅ Tracker running (port 3004)
✅ Campaign creation guide (5 minutes)
✅ Timeline activities prepared (6 events)
✅ Demo screenshots plan
✅ Dog-fooding strategy (use it for real!)

**What To Do:**

1. **RIGHT NOW:** Create KYARA campaign (5 min)
2. **Tonight:** Review demo prep files (30 min)
3. **Friday:** Show Dan, crush demo (7 min)
4. **Monday:** Use tracker for release day blast

**Expected Outcome:**

- Dan sees real campaign in real tool
- You have actual usage experience (not fake demo)
- Authentic business case (you're saving time RIGHT NOW)
- Pilot agreement (3-5 campaigns, 4 weeks)

---

**Bottom Line:**

Stop reading. Go create the campaign. Takes 5 minutes. You'll have real data to show Dan tomorrow and you'll be using your own tool for the actual KYARA campaign. Perfect!

**LET'S GO! 🚀**
