#  Airtable + Audio Intel Integration Strategy

## Current State Analysis

### Station Selection Logic

The radio promo agent currently uses a **tiered targeting system** based on:

1. **Tier 1 Commercial** (Critical Priority)
   - BBC Radio 1, BBC Radio 2, Capital FM, Heart, Absolute Radio
   - National reach, 100% importance
   - Immediate notifications

2. **Tier 2 Commercial** (High Priority)
   - Kiss FM, Magic, Classic FM, Smooth, LBC
   - National reach, 80% importance

3. **Specialist Shows** (High Priority)
   - BBC 6 Music, BBC Radio 1Xtra, Kerrang! Radio
   - 90% importance, specialist audience

4. **Regional Commercial** (Medium Priority)
   - Regional stations like Key 103, Radio City, Clyde 1
   - 60% importance, regional reach

5. **Online Stations** (Medium Priority)
   - Amazing Radio, Boom Radio, Union JACK
   - 50% importance, online reach

6. **Community Radio** (Low Priority)
   - Local community stations
   - 30% importance, local reach

### Current Limitations

- **Static targeting** - no dynamic adjustment based on campaign performance
- **No contact enrichment** - basic station info only
- **No relationship tracking** - no history of interactions
- **No personalization** - generic pitches for all stations
- **No success tracking** - limited feedback on what works

## Optimized Airtable + Audio Intel Strategy

### Phase 1: Airtable as Your CRM Foundation

#### 1.1 Core Contact Database Structure

**Main Table: Radio Contacts**

```
Fields:
- Contact Name (Single Line Text)
- Station Name (Single Line Text)
- Station Type (Single Select: BBC, Commercial, Dance, Specialist, Regional, Online, Community)
- Email Address (Email)
- Phone (Phone Number)
- Station Website (URL)
- Social Media (Long Text)
- Genre Focus (Multi-Select: Pop, Rock, Dance, Indie, Electronic, etc.)
- Show Times (Long Text)
- Submission Guidelines (Long Text)
- Contact Preferences (Long Text)
- Last Contacted (Date)
- Response Rate (Number)
- Relationship Status (Single Select: Cold, Warm, Hot, VIP)
- Notes (Long Text)
- Audio Intel Enriched (Checkbox)
- Last Enriched (Date)
- Enrichment Confidence (Single Select: High, Medium, Low)
- Enrichment Data (Long Text)
```

**Linked Tables:**

- **Campaigns** (linked to contacts)
- **Interactions** (email opens, responses, plays)
- **Play History** (from WARM API)
- **Station Performance** (success rates, response times)

#### 1.2 Automated Workflows

**When Contact Added:**

1. Auto-enrich with Audio Intel
2. Categorize by station type
3. Set initial relationship status
4. Create follow-up tasks

**When Campaign Created:**

1. Auto-select relevant contacts based on genre
2. Prioritize by relationship status and response rate
3. Generate personalized pitch templates
4. Schedule outreach sequence

### Phase 2: Audio Intel Integration

#### 2.1 Contact Enrichment Pipeline

**Batch Enrichment Process:**

```javascript
// Pseudo-code for integration
async function enrichContacts() {
  const contacts = await airtable.getContacts({ enriched: false });

  for (const contact of contacts) {
    const enrichedData = await audioIntel.enrich({
      name: contact.name,
      email: contact.email,
      station: contact.stationName,
    });

    await airtable.updateContact(contact.id, {
      enrichmentData: enrichedData.intelligence,
      enrichmentConfidence: enrichedData.confidence,
      lastEnriched: new Date(),
      audioIntelEnriched: true,
    });
  }
}
```

**Real-time Enrichment:**

- Enrich contacts as they're added
- Re-enrich every 3 months for active contacts
- Update enrichment data when contact responds

#### 2.2 Enrichment Data Utilization

**Use Audio Intel data to:**

- **Personalize pitches** based on station focus and preferences
- **Optimize timing** based on show schedules and submission windows
- **Target genres** that match station's audience
- **Track relationships** and interaction history
- **Predict success** based on similar contacts

### Phase 3: Dynamic Station Selection

#### 3.1 AI-Powered Targeting

**Replace static tiers with dynamic scoring:**

```javascript
function calculateStationScore(contact, campaign) {
  let score = 0;

  // Base station importance
  score += contact.stationType.importance;

  // Genre match
  if (contact.genreFocus.includes(campaign.genre)) {
    score += 20;
  }

  // Relationship status
  score += contact.relationshipStatus.score;

  // Response rate
  score += contact.responseRate * 10;

  // Recent success
  if (contact.lastSuccess > Date.now() - 30 * 24 * 60 * 60 * 1000) {
    score += 15;
  }

  // Audio Intel confidence
  score += contact.enrichmentConfidence.score;

  return score;
}
```

#### 3.2 Campaign-Specific Targeting

**For each campaign:**

1. **Analyze track characteristics** (genre, mood, commercial appeal)
2. **Score all contacts** based on relevance
3. **Select top 20-30 contacts** for initial outreach
4. **Reserve 10-15 contacts** for follow-up based on early success
5. **Track performance** and adjust future targeting

### Phase 4: Advanced CRM Features

#### 4.1 Relationship Tracking

**Track every interaction:**

- Email opens and clicks
- Response rates and timing
- Play confirmations from WARM
- Social media engagement
- Meeting requests and calls

**Relationship scoring:**

- Cold: 0-25 points
- Warm: 26-50 points
- Hot: 51-75 points
- VIP: 76-100 points

#### 4.2 Success Prediction

**Use historical data to predict:**

- Which contacts are most likely to respond
- Best times to contact each station
- Most effective pitch angles
- Optimal campaign timing

#### 4.3 Automated Follow-ups

**Smart follow-up sequences:**

- Day 3: Gentle reminder if no response
- Day 7: Different angle or additional info
- Day 14: Final follow-up with alternative approach
- Day 30: Re-engagement for future campaigns

### Phase 5: Integration with Radio Promo Agent

#### 5.1 Enhanced Station Selection

**Update the radio agent to:**

1. **Query Airtable** for relevant contacts
2. **Score contacts** using dynamic algorithm
3. **Generate personalized pitches** using Audio Intel data
4. **Track interactions** and update relationship status
5. **Learn from success** to improve future targeting

#### 5.2 Real-time Optimization

**During campaigns:**

- **Monitor response rates** and adjust targeting
- **Track play confirmations** from WARM API
- **Update relationship scores** based on success
- **Refine pitch templates** based on what works

## Implementation Roadmap

### Week 1-2: Airtable Setup

- [ ] Design contact database structure
- [ ] Set up automated workflows
- [ ] Import existing contact data
- [ ] Test basic functionality

### Week 3-4: Audio Intel Integration

- [ ] Build enrichment pipeline
- [ ] Test batch enrichment process
- [ ] Integrate with Airtable workflows
- [ ] Validate enrichment quality

### Week 5-6: Dynamic Targeting

- [ ] Implement scoring algorithm
- [ ] Build campaign-specific selection
- [ ] Test with real campaigns
- [ ] Refine based on results

### Week 7-8: Advanced Features

- [ ] Add relationship tracking
- [ ] Implement success prediction
- [ ] Build automated follow-ups
- [ ] Create reporting dashboard

## ROI Projections

### Time Savings

- **Contact research**: 15 hours/week → 2 hours/week (87% reduction)
- **Pitch personalization**: 10 hours/week → 3 hours/week (70% reduction)
- **Follow-up management**: 8 hours/week → 2 hours/week (75% reduction)
- **Total weekly savings**: 33 hours → 7 hours (79% reduction)

### Revenue Impact

- **Better targeting** = 30% higher response rates
- **Personalized pitches** = 25% more playlist adds
- **Relationship tracking** = 40% more repeat success
- **Automated follow-ups** = 20% more conversions

### Cost Analysis

- **Airtable Pro**: £8/month per user
- **Audio Intel**: £19.99/month (Pro plan)
- **Total monthly cost**: ~£28
- **Time saved value**: 26 hours × £25/hour = £650/week
- **ROI**: 2,300% return on investment

## Next Steps

1. **Set up Airtable workspace** with the contact database structure
2. **Import existing contacts** and categorize by station type
3. **Test Audio Intel enrichment** on a sample of contacts
4. **Build integration scripts** to connect Airtable with Audio Intel
5. **Update radio promo agent** to use dynamic targeting
6. **Monitor and optimize** based on real campaign results

This strategy transforms your Airtable from a simple contact list into a powerful CRM that learns and improves with every campaign, while Audio Intel provides the intelligence needed to make every pitch count.
