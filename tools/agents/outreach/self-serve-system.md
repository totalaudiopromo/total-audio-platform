# Self-Serve Audio Intel System (No Demos, Full Automation)

**Problem:** You don't have time for demo calls (full-time job at Postman)
**Solution:** Product-led growth - let the product sell itself

---

## 🎯 New Strategy: Automated Self-Serve

### Old Way (85% conversion but requires YOUR time)

❌ Cold email → Demo call → Close → Onboarding
❌ 42 demo calls = 84 hours of YOUR time
❌ Doesn't scale for solopreneur with day job

### New Way (30% conversion but ZERO time required)

✅ Cold email → Free trial signup → Product sells itself → Auto-payment
✅ 0 hours of YOUR time (fully automated)
✅ Scales infinitely while you're at Postman

---

## 💰 The Math (Self-Serve vs Demos)

### With Demos (Current)

- 50 emails → 42 demos (85%) → 4 customers (10%)
- **Revenue:** £76/month
- **Your time:** 84 hours (2 hours per demo)
- **Hourly rate:** £0.90/hour (terrible)

### Self-Serve (New)

- 50 emails → 25 signups (50%) → 8 trials (32%) → 2 customers (25%)
- **Revenue:** £38/month per 50 emails
- **Your time:** 0 hours (fully automated)
- **Hourly rate:** ∞ (no time spent)

### Self-Serve at Scale (200 emails/month)

- 200 emails → 100 signups → 32 trials → 8 customers
- **Revenue:** £152/month
- **Your time:** Still 0 hours

---

## 🚀 What You Need to Build

### 1. Loom Video Demo (Record Once, Use Forever)

**Time to create:** 15 minutes
**Replaces:** 500 demo calls

**Script:**

```
"Hi, I'm Chris - I built Audio Intel after spending 15 hours researching
BBC Radio 1 contacts.

Watch this: [SCREEN RECORDING]

I upload 5 chaotic contacts from a spreadsheet...
[Shows real-time enrichment]
...15 seconds later, full contact database.

That's Audio Intel. Try it free: intel.totalaudiopromo.com

No card required. Just upload your contacts and watch it work."
```

**Record with:**

- Loom (free)
- Show real BBC Radio 1 enrichment
- 60 seconds total
- Upload to YouTube (unlisted)
- Embed on landing page

---

### 2. Updated Cold Email (Product-Led Growth)

**Subject:** BBC Radio 1 contacts in 15 minutes (watch video)

Hi {{firstName}},

I spent 15 hours researching BBC Radio 1 contacts last month.

Then I built Audio Intel to do it in 15 minutes.

**Watch:** [60-second video showing real enrichment]

**Try free:** intel.totalaudiopromo.com

- Upload 5 contacts
- Watch real-time enrichment
- No card required

If it saves you time, it's £19/month. If not, it's free forever (10 enrichments/month).

Chris
sadact / Audio Intel

P.S. The BBC Radio 1 enrichment in the video? 100% real. Every contact validated.

---

### 3. Automated Email Drip (ConvertKit)

**Email 1:** Immediate (Welcome)

```
Subject: Your Audio Intel account is ready

Hi {{firstName}},

Welcome to Audio Intel! Your free account includes 10 enrichments/month.

Quick start:
1. Upload CSV or paste contacts
2. Watch real-time enrichment
3. Download organised database

Need more? Upgrade to PRO (£19/month) for unlimited.

Chris
```

**Email 2:** Day 2 (If they haven't enriched anything)

```
Subject: Try Audio Intel with one contact

{{firstName}},

Haven't had a chance to try Audio Intel yet?

Upload just ONE contact - takes 10 seconds.

Here's what you'll get:
✅ Verified email
✅ Social profiles
✅ Phone number (if available)
✅ Full professional context

Try it: intel.totalaudiopromo.com/dashboard

Chris
```

**Email 3:** Day 5 (Case study)

```
Subject: How I used Audio Intel for BBC Radio 1

{{firstName}},

Last month I pitched to BBC Radio 1 using Audio Intel.

What normally takes 15+ hours (researching Clara Amfo, Jack Saunders,
Annie Mac's team) took 15 minutes.

100% success rate. Every contact enriched and validated.

That's the same tool you have access to right now.

Try it: intel.totalaudiopromo.com/dashboard

Chris
```

**Email 4:** Day 9 (Last chance + upgrade offer)

```
Subject: £19/month to never research contacts again

{{firstName}},

Quick reminder: Your Audio Intel free tier gives you 10 enrichments/month.

If you're researching more than 10 contacts per month (most promoters are),
upgrade to PRO for unlimited.

£19/month = Never manually research contacts again.

Upgrade: intel.totalaudiopromo.com/pricing

Or keep using free forever. Your choice.

Chris
```

---

### 4. Instant Access Flow (No Demos)

```
Cold Email
    ↓
Landing Page (with Loom video)
    ↓
Free Signup (10 enrichments/month)
    ↓
Onboarding Email (Email 1)
    ↓
User enriches contacts (product sells itself)
    ↓
Day 2: Nudge email (if inactive)
    ↓
Day 5: Case study email
    ↓
Day 9: Upgrade prompt (£19/month)
    ↓
PAYMENT (Stripe) → Instant PRO access
```

**Your involvement:** ZERO HOURS

---

## 🛠️ Technical Implementation

### Step 1: Record Loom Video (15 mins)

```bash
# 1. Open Loom
# 2. Start screen recording
# 3. Go to Audio Intel dashboard
# 4. Upload real BBC Radio 1 contacts spreadsheet
# 5. Show real-time enrichment (15 seconds)
# 6. Show before/after comparison
# 7. Show pricing: FREE (10/month) or PRO (£19/month)
# 8. End with CTA: "Try it free: intel.totalaudiopromo.com"
```

### Step 2: ConvertKit Automation (30 mins)

```bash
# Already have ConvertKit integrated
# Create 4-email sequence (above)
# Trigger: On signup to Audio Intel
# Automated drip: Day 0, 2, 5, 9
```

### Step 3: Update Cold Email Template (5 mins)

```bash
# Replace demo booking CTA with:
# - Loom video link
# - Free trial CTA
# - "No card required"
```

### Step 4: Landing Page Updates (1 hour)

```bash
# Add to intel.totalaudiopromo.com homepage:
# - Embed Loom video (above the fold)
# - "Try Free" CTA (prominent)
# - "No card required, 10 enrichments/month free"
# - Social proof: "Used for BBC Radio 1, Spotify, Radio X campaigns"
```

---

## 📊 Updated Conversion Funnel

### Realistic Self-Serve Conversions

| Step                                | Rate | Count (50 emails) | Count (200 emails) |
| ----------------------------------- | ---- | ----------------- | ------------------ |
| Emails sent                         | 100% | 50                | 200                |
| Email opens                         | 65%  | 32                | 130                |
| Landing page visits                 | 50%  | 16                | 65                 |
| Free signups                        | 50%  | 8                 | 32                 |
| Active users (enriched 1+ contacts) | 70%  | 5                 | 22                 |
| Upgrade to PRO (£19/month)          | 40%  | 2                 | 9                  |
| **Monthly revenue**                 | -    | **£38**           | **£171**           |

---

## 💡 Why This Works Better for You

### Time Comparison

| Activity               | Old Way (Demos) | New Way (Self-Serve) |
| ---------------------- | --------------- | -------------------- |
| Initial setup          | 2 hours         | 2 hours              |
| Recording demo         | 0 hours         | 15 mins (once)       |
| Demo calls             | 84 hours/month  | 0 hours              |
| Email sequences        | Manual          | Automated            |
| Payment processing     | Manual          | Automated (Stripe)   |
| **Total monthly time** | **86 hours**    | **0 hours**          |

### Revenue Comparison (200 emails/month)

| Method                             | Revenue    | Time      | Hourly Rate |
| ---------------------------------- | ---------- | --------- | ----------- |
| Demos (85% conversion)             | £304/month | 336 hours | £0.90/hour  |
| Self-serve (25% of trials convert) | £171/month | 0 hours   | ∞           |

---

## 🎯 Implementation Plan (Total: 2 hours)

### Today (30 mins)

- [ ] Record Loom video (15 mins)
- [ ] Update cold email template (5 mins)
- [ ] Upload video to YouTube (unlisted) (5 mins)
- [ ] Embed on Audio Intel homepage (5 mins)

### Tomorrow (1 hour)

- [ ] Create ConvertKit 4-email drip sequence (30 mins)
- [ ] Test signup → payment flow (15 mins)
- [ ] Send test email to yourself (5 mins)
- [ ] Update landing page CTAs (10 mins)

### This Week (30 mins)

- [ ] Scrape 50 radio promoter emails (Google Maps)
- [ ] Find emails (Hunter.io + Snov.io free)
- [ ] Send 50 cold emails with new template
- [ ] Track signups (not demo bookings)

---

## 🔥 New Cold Email Templates (Self-Serve)

### Template 1: Video Demo (Best for Self-Serve)

**Subject:** BBC Radio 1 in 15 minutes (watch this)

Hi {{firstName}},

Last month I spent 15 hours researching BBC Radio 1 contacts.

This month I spent 15 minutes.

**Watch this 60-second video:** [Loom link showing real enrichment]

The tool is called Audio Intel. It's free to try (10 enrichments/month, no card required).

If it saves you time, upgrade to unlimited for £19/month.

**Try it:** intel.totalaudiopromo.com

Chris
sadact / Audio Intel

---

### Template 2: Instant Access

**Subject:** Free contact enrichment tool (no card required)

Hi {{firstName}},

Audio Intel = automated radio contact research.

**Free tier:**

- 10 enrichments/month
- No card required
- Full contact data (email, phone, socials)

**PRO tier (£19/month):**

- Unlimited enrichments
- Priority support
- Campaign management tools

Used for BBC Radio 1, Spotify, Radio X campaigns.

**Start free:** intel.totalaudiopromo.com

Chris

---

### Template 3: Social Proof First

**Subject:** The tool I used to pitch BBC Radio 1

Hi {{firstName}},

I used Audio Intel to research contacts for:

- BBC Radio 1 (Clara Amfo, Jack Saunders)
- Spotify editorial
- Radio X producers

100% success rate. 15 hours → 15 minutes.

You can use the same tool right now:

**Free:** 10 enrichments/month (no card)
**PRO:** £19/month (unlimited)

**Watch demo + try free:** intel.totalaudiopromo.com

Chris

---

## 📈 Expected Results (Self-Serve)

### Month 1 (50 emails)

- 8 free signups
- 5 active users (enriched contacts)
- 2 paying customers = £38/month
- **Your time:** 2 hours (setup)

### Month 2 (100 emails)

- 16 free signups
- 11 active users
- 4 paying customers = £76/month
- **Your time:** 0 hours

### Month 3 (200 emails)

- 32 free signups
- 22 active users
- 9 paying customers = £171/month
- **Your time:** 0 hours

### Month 6 (400 emails/month via paid tools)

- 64 free signups
- 45 active users
- 18 paying customers = £342/month
- **Your time:** Still 0 hours
- **Cost:** £34/month (Hunter.io Starter)
- **Net profit:** £308/month

---

## ✅ Action Items (This Weekend)

1. **Record Loom video** (15 mins)

   - Show real BBC Radio 1 enrichment
   - 60 seconds max
   - Upload to YouTube (unlisted)

2. **Set up ConvertKit drip** (30 mins)

   - 4 emails (Day 0, 2, 5, 9)
   - Trigger: On Audio Intel signup
   - Test with your own email

3. **Update cold email template** (5 mins)

   - Add Loom video link
   - Change CTA from "demo" to "try free"
   - Emphasize "no card required"

4. **Send 10 test emails** (10 mins)
   - Use free Hunter.io credits
   - Track: signups (not demo bookings)
   - Optimize based on signup rate

---

## 🚨 Critical Success Factors

### ✅ DO THIS:

- Loom video MUST show REAL enrichment (not fake demo)
- Free tier MUST work perfectly (10 enrichments is enough to prove value)
- Upgrade prompt in product (after 8th enrichment: "2 left this month, upgrade?")
- Email drip MUST be value-first (not salesy)

### ❌ DON'T DO THIS:

- Don't require demo calls (kills self-serve)
- Don't ask for card for free tier (reduces signups)
- Don't make free tier too limited (needs to show value)
- Don't over-email (4 emails max in first 2 weeks)

---

## 💰 Bottom Line

**Old way (demos):**

- 50 emails → 42 demos → 4 customers = £76/month
- Your time: 84 hours
- Hourly rate: £0.90/hour

**New way (self-serve):**

- 50 emails → 8 signups → 2 customers = £38/month
- Your time: 0 hours (after 2-hour setup)
- Hourly rate: ∞

**At scale (200 emails/month):**

- 200 emails → 32 signups → 9 customers = £171/month
- Your time: Still 0 hours
- You're still at Postman full-time

**Self-serve is 50% lower conversion BUT requires ZERO time. That's the trade-off you need as a solopreneur with a day job.**

---

## 🎯 Next Steps

1. Record Loom video TODAY (15 mins)
2. Set up ConvertKit drip TOMORROW (30 mins)
3. Send 10 test emails THIS WEEK (10 mins)
4. Track signups (not demos)
5. Scale to 50 emails next week
6. Hit £38/month with ZERO time spent

Ready to record that Loom video?
