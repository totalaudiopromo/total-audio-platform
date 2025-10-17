# Recommended Skills for Total Audio (Customer Acquisition Focus)

## ✅ Already Built

### 1. VoiceGuardSkill (LIVE NOW!)
- **What**: UK voice enforcement, corporate speak detection
- **Business Value**: Maintain authentic industry credibility
- **Cost**: $0.0006 per check with Haiku
- **Status**: ✅ Working perfectly

## 🎯 High-Priority Skills (Build Next)

### 2. **DemoEmailSkill** - Convert Prospects to Demo Calls
**Business Need**: You need 2+ demo calls per week to hit revenue targets

**What It Does:**
- Generates personalized demo invitation emails
- Uses prospect's industry segment (radio promoter, artist, agency)
- References relevant case studies (BBC Radio 1, Spotify)
- Includes "15 hours → 15 minutes" value prop
- Adds calendar booking link

**Input:**
```typescript
{
  prospectName: "Sarah Jones",
  role: "Radio Promoter",
  outlet: "BBC Radio 6 Music",
  painPoint: "Spending weekends researching contacts",
  caseStudy: "bbc_radio_1" // or "spotify", "radio_promo"
}
```

**Output:**
```typescript
{
  subject: "Save 15 hours on your next radio campaign (real case study)",
  body: "Hi Sarah, saw you're at 6 Music...",
  followUpDays: [3, 7], // When to follow up
  expectedConversionRate: 0.85 // Based on segment
}
```

**Why This Matters:**
- 85% conversion rate with radio promoters
- Personalized outreach = higher response
- Saves you hours writing demo emails
- **Directly impacts revenue** (more demos → more customers)

**Cost:** ~$0.0022 per email with Haiku (~$6/month for 100 prospects)

---

### 3. **FollowUpTimingSkill** - Maximize Demo Show Rates
**Business Need**: Booked demos need to actually happen

**What It Does:**
- Analyzes prospect engagement (email opens, link clicks)
- Recommends optimal follow-up timing
- Generates reminder emails that don't feel pushy
- Suggests "escape hatch" reschedule options

**Input:**
```typescript
{
  prospectId: "xyz",
  demoScheduled: "2025-10-25T15:00:00Z",
  lastEngagement: "2025-10-20T10:30:00Z",
  emailOpens: 3,
  calendarLinkClicks: 1
}
```

**Output:**
```typescript
{
  shouldFollowUp: true,
  timing: "2025-10-24T09:00:00Z", // Day before at 9am
  tone: "friendly_reminder",
  suggestedText: "Looking forward to tomorrow's demo...",
  rescheduleOffer: true // They seem interested but might need flexibility
}
```

**Why This Matters:**
- Demo no-shows kill conversion rates
- Timely reminders increase attendance 30-40%
- Frees you to focus on actual demos
- **Directly impacts conversion** (attended demos → paying customers)

**Cost:** ~$0.0015 per analysis with Haiku (~$2/month for 50 demos)

---

### 4. **CaseStudyMatcherSkill** - Personalize Outreach at Scale
**Business Need**: Different segments respond to different proof points

**What It Does:**
- Matches prospects to relevant case studies
- Customizes value proposition per segment
- Suggests specific features to highlight
- Recommends pricing tier based on profile

**Input:**
```typescript
{
  prospectProfile: {
    role: "PR Agency Owner",
    teamSize: 5,
    avgClientsPerMonth: 8,
    currentProcess: "Manual spreadsheets, junior staff research"
  }
}
```

**Output:**
```typescript
{
  primaryCaseStudy: "radio_promo_agency",
  valueProposition: "Turn junior staff 15-hour research into 15-minute automation",
  relevantFeatures: ["bulk_processing", "team_access", "client_reports"],
  suggestedPricing: "agency_tier", // £79/month
  expectedTimesSavings: "120 hours/month across team",
  estimatedROI: "15x" // £79 cost vs £1200 junior staff time
}
```

**Why This Matters:**
- 70% conversion with agencies when properly positioned
- Different segments need different messaging
- Scales personalization without manual work
- **Directly impacts conversion** (relevant messaging → more sales)

**Cost:** ~$0.0034 per analysis with Haiku (~$5/month for 50 prospects)

---

### 5. **NewsletterPersonalizationSkill** - Convert Subscribers to Customers
**Business Need**: 25+ newsletter subscribers/month need nurturing to paying customers

**What It Does:**
- Analyzes subscriber behavior (opens, clicks, topic interest)
- Customizes newsletter content per subscriber segment
- Identifies "hot leads" ready for sales outreach
- Suggests personalized CTAs based on engagement

**Input:**
```typescript
{
  subscriberId: "abc",
  openRate: 0.75, // Opens 75% of newsletters
  clickedTopics: ["contact_enrichment", "bbc_radio_1_case_study"],
  accountStatus: "free_trial_expired",
  daysSinceLastLogin: 14
}
```

**Output:**
```typescript
{
  segmentType: "hot_lead", // vs warm, cold, churned
  personalizedContent: "More BBC Radio 1 case study details",
  recommendedCTA: "Exclusive: Book 1-on-1 demo to see your contacts enriched live",
  outreachRecommendation: {
    channel: "personal_email", // vs automated
    urgency: "high",
    reason: "High engagement, trial expired, still interested"
  }
}
```

**Why This Matters:**
- Newsletter is operational but not converting yet
- Behavioral analysis identifies sales opportunities
- Personalized CTAs increase conversion 2-3x
- **Directly impacts revenue** (newsletter → paying customers)

**Cost:** ~$0.0025 per subscriber analysis with Haiku (~$3/month for 100 subscribers)

---

### 6. **ValueCalculatorSkill** - Justify Pricing in Demos
**Business Need**: Prospects need to see clear ROI to convert

**What It Does:**
- Calculates time savings based on prospect's workflow
- Converts time to money (hourly rate × hours saved)
- Compares to alternative solutions (manual, other tools)
- Generates ROI report for prospect

**Input:**
```typescript
{
  prospectType: "radio_promoter",
  campaignsPerMonth: 4,
  contactsPerCampaign: 50,
  currentTimePerContact: 18, // minutes
  hourlyRate: 50 // £50/hour freelance rate
}
```

**Output:**
```typescript
{
  currentMonthlyCost: "£600", // 4 campaigns × 15 hours × £50
  withAudioIntel: "£19", // PRO tier
  monthlySavings: "£581",
  annualSavings: "£6,972",
  timeReclaimed: "60 hours/month",
  roi: "30x", // £581 savings vs £19 cost
  paybackPeriod: "< 1 day"
}
```

**Why This Matters:**
- Clear ROI = easier sales conversations
- £19/month vs £581/month savings = obvious value
- Professional reports close deals
- **Directly impacts conversion** (justified ROI → credit card out)

**Cost:** ~$0.0018 per calculation with Haiku (~$2/month for 30 demos)

---

## 📊 Recommended Build Order

### Phase 1: Customer Acquisition (Build Now)
1. **DemoEmailSkill** - Get more demo calls booked
2. **FollowUpTimingSkill** - Increase demo attendance
3. **ValueCalculatorSkill** - Close more demos to paid

**Impact:** Direct path from prospect → paying customer
**Cost:** ~$15/month for 100 prospects through funnel
**Expected Revenue:** First £500/month (26 PRO customers)

### Phase 2: Scale & Retention (After £500/month)
4. **CaseStudyMatcherSkill** - Scale outreach with personalization
5. **NewsletterPersonalizationSkill** - Convert warm leads automatically
6. **OnboardingCoachSkill** - Reduce churn, increase upgrades

### Phase 3: Advanced (After £2000/month)
7. **CompetitorAnalysisSkill** - Win competitive deals
8. **ChurnPredictionSkill** - Prevent cancellations
9. **UpsellIdentifierSkill** - PRO → AGENCY upgrades

---

## 💰 Cost vs Revenue Analysis

**Monthly Skill Costs (Phase 1):**
- DemoEmail: $6/month (100 prospects)
- FollowUpTiming: $2/month (50 demos)
- ValueCalculator: $2/month (30 demos)
- **Total: $10/month**

**Expected Revenue Impact:**
- Better outreach: +20% demo booking rate
- Better follow-up: +30% demo attendance
- Better demos: +15% close rate
- **Combined: 2-3x more paying customers**

**Example:**
- Current: 10 prospects → 2 demos → 0.3 customers = **£6/month**
- With skills: 10 prospects → 4 demos → 1.4 customers = **£27/month**
- **ROI: £21 revenue gain - £10 skill cost = £11 net gain (110% ROI)**

---

## 🎯 Which To Build First?

**My recommendation: Start with DemoEmailSkill**

**Why:**
1. Directly addresses your biggest bottleneck (booking demos)
2. Uses proven messaging (BBC Radio 1 case studies)
3. Leverages your 85% radio promoter conversion rate
4. Quick to build (similar to PitchDraftSkill)
5. Immediate measurable impact (demo calls booked)

**Expected outcome:**
- Week 1: 2 demo emails sent → 1 demo booked
- Week 2: 5 demo emails sent → 3 demos booked
- Week 3: 10 demo emails sent → 6 demos booked
- Week 4: First paying customer from demo 🎉

---

## 🚀 Bottom Line

**Skills to build for customer acquisition:**
1. ✅ **VoiceGuardSkill** - Already working
2. 🎯 **DemoEmailSkill** - Build first (highest ROI)
3. 🎯 **FollowUpTimingSkill** - Build second (maximize demos)
4. 🎯 **ValueCalculatorSkill** - Build third (close deals)

**Don't build:**
- ❌ Generic "helpful" skills that don't drive revenue
- ❌ Technical features customers didn't ask for
- ❌ Anything not directly tied to customer acquisition

**Right, so focus on skills that get you from 0 → £500/month. Everything else can wait! 🎵**
