# ConvertKit Setup Guide

## Why ConvertKit?

- Free up to 1,000 subscribers
- Easy email sequences
- Clean, simple interface
- Built for creators (perfect for solopreneurs)

**Alternative:** Mailchimp (also free tier), but ConvertKit is easier for sequences.

---

## 10-Minute Setup

### 1. Create Account (2 minutes)

1. Go to convertkit.com
2. Click "Start for free"
3. Use your work email (hello@totalaudiopromo.com or similar)
4. Choose "Creator" plan (free)

### 2. Set Up Sender Profile (2 minutes)

1. Go to Settings → Sending
2. Add sender name: "Chris at Total Audio Promo"
3. Add reply-to email: your real email (so people can reply)
4. Verify your domain (follow their steps)

**Important:** Don't skip domain verification or your emails go to spam.

### 3. Upload Contacts (2 minutes)

1. Click "Subscribers" in sidebar
2. Click "Add subscribers" → "Import from CSV"
3. Upload `contacts-template.csv`
4. Map columns:
   - `email` → Email Address
   - `first_name` → First Name
   - `company` → Company (optional field)
5. Click "Import"

### 4. Create Email Sequence (4 minutes)

#### Create the Sequence

1. Click "Sequences" in sidebar
2. Click "New sequence"
3. Name it: "Audio Intel Outreach"
4. Click "Create"

#### Add Email 1

1. Click "Add email"
2. Subject: `Stop wasting 15 hours a week on radio research`
3. Copy/paste email body from READY-TO-SEND-EMAILS.md (Email 1)
4. Set delay: "0 days" (sends immediately)
5. Click "Save"

#### Add Email 2

1. Click "Add email"
2. Subject: `Here's exactly how Audio Intel works`
3. Copy/paste email body from READY-TO-SEND-EMAILS.md (Email 2)
4. Set delay: "3 days"
5. Click "Save"

#### Add Email 3

1. Click "Add email"
2. Subject: `Last thing on Audio Intel`
3. Copy/paste email body from READY-TO-SEND-EMAILS.md (Email 3)
4. Set delay: "3 days" (6 days total from start)
5. Click "Save"

---

## Personalisation (Merge Tags)

ConvertKit uses `{{ first_name }}` for merge tags.

**In your CSV:**

- Column header: `first_name`
- Value: `James` (not "James Smith")

**In your email:**

- Type: `Hey {{ first_name }},`
- Sends as: "Hey James,"

**Test it:** Send yourself a test email before launching.

---

## Launch Checklist

Before you hit send:

- [ ] Domain verified (check Settings → Sending)
- [ ] Test email sent to yourself (check merge tags work)
- [ ] Reply-to email is correct (not noreply@)
- [ ] All 3 emails saved in sequence
- [ ] Delays set correctly (0, 3, 6 days)
- [ ] Links work (test intel.totalaudiopromo.com)
- [ ] Unsubscribe link present (ConvertKit adds automatically)

---

## Sending Schedule

### Option 1: Drip (Recommended for first batch)

1. Go to sequence
2. Click "Add subscribers"
3. Select your imported contacts
4. Choose "Add to sequence"
5. Done - they'll get email 1 immediately

### Option 2: Scheduled Send (Better for larger batches)

1. Same as above
2. But set "Start date" to tomorrow 9am
3. Emails send at same time each day

**Why schedule?** Better deliverability when emails go out at consistent times.

---

## Monitoring Results

### Where to Check

1. Click on sequence name
2. Click on individual email
3. See stats:
   - Sent
   - Opened
   - Clicked
   - Unsubscribed

### What to Track

**Email 1 (Problem email):**

- Target: 30%+ open rate
- Target: 5-10% click rate

**Email 2 (Solution email):**

- Target: 25%+ open rate (drops a bit)
- Target: 8-12% click rate (higher than email 1)

**Email 3 (Close email):**

- Target: 20%+ open rate
- Target: 10-15% click rate (highest)

### If Results Are Low

**Low open rate (<20%):**

- Subject line too salesy
- Sender name not recognisable
- Sent at wrong time
- Emails going to spam (check domain verification)

**Low click rate (<3%):**

- Offer not clear
- Wrong audience
- CTA not obvious
- Email too long

---

## Automation Rules

### Auto-remove engaged people

1. Create tag: "Clicked Audio Intel"
2. Automation: If subscriber clicks link → Remove from sequence
3. Why? Don't send email 2 if they already clicked in email 1

### Auto-tag unsubscribes

1. Automation: If subscriber unsubscribes → Tag "Not interested"
2. Why? Don't add them to future campaigns

### Auto-notify on replies

1. Automation: If subscriber replies → Send notification to you
2. Why? Jump on warm leads fast

**Set these up in: Automations → Create automation**

---

## Compliance (Important!)

### UK GDPR Rules

-  B2B cold email is legal (business contacts)
-  Must include unsubscribe link (ConvertKit does this)
-  Must honour unsubscribe immediately (ConvertKit does this)
-  Don't email personal addresses (jane@gmail.com)
-  Email work addresses (jane@musicpr.co.uk)

### Best Practice

- Only email relevant people (radio promoters for Audio Intel)
- Stop after 3 emails (respect the no)
- Make unsubscribe easy (one click)
- Actually read replies

**Not legal advice, but this is standard B2B outreach practice.**

---

## Troubleshooting

### "Emails going to spam"

- Check domain verification (Settings → Sending)
- Warm up your account (send to 10 people first, wait a day, then scale)
- Remove spam trigger words ("free", "guarantee", "click here now")
- Check sender reputation (mxtoolbox.com/emailhealth)

### "Low open rates"

- Subject line too long (keep under 50 chars)
- Sending at wrong time (try 9am or 2pm GMT, Tues-Thurs)
- Sender name not recognisable (use "Chris at Total Audio Promo")

### "People replying with questions"

- Good sign! Answer them
- Remove from sequence (they're engaged)
- Offer to jump on quick call if needed

### "No signups after 50 emails"

- Wrong audience (are they actually radio promoters?)
- Offer not clear (re-read email 2)
- Price objection (mention £19.99 is less than Cision)
- Product not ready (does intel.totalaudiopromo.com actually work?)

---

## Scaling Up

### Week 1: Test (30 contacts)

- Send to first 30 contacts
- Monitor results daily
- Adjust subject lines if open rate <20%
- Adjust email body if click rate <5%

### Week 2-3: Learn

- What's working?
- What subject lines get best opens?
- What time of day gets best engagement?
- Any common objections in replies?

### Week 4+: Scale

- Add 50 new contacts/week
- Use proven subject lines
- Optimise send times
- Keep replying to questions

---

## Cost

**ConvertKit Free Plan:**

- Up to 1,000 subscribers
- Unlimited emails
- Basic sequences

**If you go over 1,000:**

- Creator plan: £21/month (up to 1,000 subscribers)
- Creator Pro: £47/month (advanced features)

**At 1,000 contacts, you should have 20-40 Audio Intel customers, so the cost is justified.**

---

## Advanced: A/B Testing

Once you've sent to 100+ people, test variations:

### Test 1: Subject Lines

- A: "Stop wasting 15 hours a week on radio research"
- B: "How I cut radio research from 15 hours to 30 minutes"

Send to 50/50 split. See which gets higher opens.

### Test 2: Email Length

- A: Current email (full version)
- B: Shorter version (3 paragraphs max)

See which gets higher clicks.

### Test 3: Offer

- A: "£19.99/month"
- B: "Less than £1/day"

See which gets higher signups.

**Only test one thing at a time.**

---

## Quick Reference

**Login:** convertkit.com/users/login
**Dashboard:** convertkit.com/subscribers
**Sequences:** convertkit.com/sequences

**Support:** ConvertKit has great docs and live chat (if you get stuck)

---

## You're Ready

This is everything you need to run a professional email outreach campaign.

**Time to execute:**

- Account setup: 10 mins
- First batch (30 contacts): 20 mins total
- Monitor results: 5 mins/day

**Expected results (week 1):**

- 30 contacts → 10 opens → 2-3 clicks → 0-1 signups

Scale from there.

No more planning. Hit send.
