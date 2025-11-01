# 🎵 Airtable Setup Guide for Radio Promo Agent

## Quick Start Checklist

### 1. Create Airtable Base

- [ ] Go to [airtable.com](https://airtable.com) and create new base
- [ ] Name it "Liberty Radio Contacts" or similar
- [ ] Set up workspace permissions

### 2. Create Main Table: "Radio Contacts"

#### Required Fields (in this order):

**Basic Info:**

- `Contact Name` (Single line text)
- `Station Name` (Single line text)
- `Station Type` (Single select)
  - Options: BBC, Commercial, Dance, Specialist, Regional, Online, Community
- `Email Address` (Email)
- `Phone` (Phone number)
- `Station Website` (URL)

**Categorization:**

- `Genre Focus` (Multiple select)
  - Options: Pop, Rock, Dance, Electronic, Indie, Alternative, Hip-Hop, R&B, Country, Jazz, Classical, Other
- `Show Times` (Long text)
- `Submission Guidelines` (Long text)
- `Contact Preferences` (Long text)

**Relationship Tracking:**

- `Relationship Status` (Single select)
  - Options: Cold, Warm, Hot, VIP
- `Response Rate` (Number, format as percentage)
- `Last Contacted` (Date)
- `Last Response` (Date)
- `Total Interactions` (Number)

**Audio Intel Integration:**

- `Audio Intel Enriched` (Checkbox)
- `Last Enriched` (Date)
- `Enrichment Confidence` (Single select)
  - Options: High, Medium, Low
- `Enrichment Data` (Long text)

**Notes & Tracking:**

- `Notes` (Long text)
- `Tags` (Multiple select)
  - Options: High Priority, Low Priority, Difficult, Easy, New Contact, Regular, VIP
- `Created Date` (Date, auto-generated)

### 3. Create Linked Tables

#### Table: "Campaigns"

- `Campaign Name` (Single line text)
- `Artist Name` (Single line text)
- `Track Title` (Single line text)
- `Genre` (Single select)
- `Budget` (Currency)
- `Release Date` (Date)
- `Status` (Single select: Planning, Active, Completed, Paused)
- `Radio Contacts` (Link to another record - Radio Contacts)
- `Created Date` (Date, auto-generated)

#### Table: "Interactions"

- `Contact` (Link to another record - Radio Contacts)
- `Campaign` (Link to another record - Campaigns)
- `Interaction Type` (Single select: Email Sent, Email Opened, Email Replied, Call Made, Meeting Scheduled, Play Confirmed)
- `Date` (Date)
- `Notes` (Long text)
- `Outcome` (Single select: Positive, Neutral, Negative, No Response)

#### Table: "Play History"

- `Contact` (Link to another record - Radio Contacts)
- `Campaign` (Link to another record - Campaigns)
- `Track Title` (Single line text)
- `Play Date` (Date)
- `Station` (Single line text)
- `Show` (Single line text)
- `Time` (Time)
- `Source` (Single select: WARM API, Manual, Email Confirmation)

### 4. Set Up Views

#### Main View: "All Contacts"

- Show all fields
- Sort by: Station Type, then Contact Name

#### View: "By Station Type"

- Group by: Station Type
- Sort by: Relationship Status, then Response Rate

#### View: "Needs Enrichment"

- Filter: Audio Intel Enriched = False
- Sort by: Created Date (oldest first)

#### View: "High Priority"

- Filter: Relationship Status = Hot OR VIP
- Sort by: Response Rate (highest first)

#### View: "Recent Contacts"

- Filter: Last Contacted = Last 30 days
- Sort by: Last Contacted (most recent first)

### 5. Set Up Automations

#### Automation 1: Auto-Enrich New Contacts

**Trigger:** When a record is created in Radio Contacts
**Action:**

- Set "Audio Intel Enriched" to False
- Set "Created Date" to today
- Set "Relationship Status" to Cold

#### Automation 2: Follow-up Reminder

**Trigger:** When "Last Contacted" is more than 14 days ago
**Action:**

- Send email notification
- Add to "Needs Follow-up" view

#### Automation 3: Update Response Rate

**Trigger:** When a new Interaction is created
**Action:**

- Calculate new response rate
- Update the linked Contact record

### 6. Import Existing Data

#### Step 1: Export from Current System

- Export contacts from your current system (Excel, CSV, etc.)
- Clean up data: remove duplicates, standardize formats

#### Step 2: Prepare for Import

- Create CSV with columns matching Airtable fields
- Use these exact column names:

  ```
  Contact Name, Station Name, Station Type, Email Address, Phone, Station Website, Genre Focus, Show Times, Submission Guidelines, Contact Preferences, Relationship Status, Response Rate, Last Contacted, Notes
  ```

#### Step 3: Import to Airtable

- Go to Radio Contacts table
- Click "Import data" → "CSV file"
- Map columns to fields
- Import and review

### 7. Set Up API Integration

#### Step 1: Get API Credentials

- Go to [airtable.com/account](https://airtable.com/account)
- Click "Generate personal access token"
- Copy the token
- Get your Base ID from the API documentation

#### Step 2: Add to Environment Variables

```bash
# Add to your .env file
AIRTABLE_API_KEY=your_token_here
AIRTABLE_BASE_ID=your_base_id_here
```

#### Step 3: Test API Connection

```javascript
// Test script
const Airtable = require('airtable');
const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
  process.env.AIRTABLE_BASE_ID
);

base('Radio Contacts')
  .select({
    maxRecords: 1,
  })
  .eachPage(
    function page(records, fetchNextPage) {
      console.log('✅ Airtable connection successful!');
      console.log('Sample record:', records[0].fields);
    },
    function done(err) {
      if (err) {
        console.error('❌ Airtable connection failed:', err);
      }
    }
  );
```

### 8. Connect to Audio Intel

#### Step 1: Get Audio Intel API Key

- Go to [intel.totalaudiopromo.com](https://intel.totalaudiopromo.com)
- Sign up for Pro plan (£19.99/month)
- Get API key from dashboard

#### Step 2: Add to Environment Variables

```bash
# Add to your .env file
AUDIO_INTEL_API_KEY=your_api_key_here
AUDIO_INTEL_BASE_URL=https://intel.totalaudiopromo.com/api
```

#### Step 3: Test Integration

```javascript
// Test Audio Intel connection
const response = await fetch(`${process.env.AUDIO_INTEL_BASE_URL}/enrich`, {
  method: 'POST',
  headers: {
    Authorization: `Bearer ${process.env.AUDIO_INTEL_API_KEY}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    contacts: [
      {
        name: 'Test Contact',
        email: 'test@example.com',
      },
    ],
  }),
});

const result = await response.json();
console.log('✅ Audio Intel connection successful!');
```

### 9. Set Up Radio Promo Agent Integration

#### Step 1: Update Radio Agent

- Modify `agents/radio-agent.js` to use Airtable
- Replace static station list with dynamic selection
- Add contact enrichment pipeline

#### Step 2: Add Dynamic Targeting

- Implement scoring algorithm
- Add campaign-specific selection
- Include relationship tracking

#### Step 3: Test Integration

- Run test campaigns
- Monitor performance
- Adjust scoring algorithm

### 10. Monitoring & Optimization

#### Weekly Tasks:

- [ ] Review response rates by station type
- [ ] Update relationship statuses
- [ ] Re-enrich contacts older than 3 months
- [ ] Analyze campaign performance

#### Monthly Tasks:

- [ ] Clean up inactive contacts
- [ ] Update genre focus based on trends
- [ ] Refine scoring algorithm
- [ ] Export performance reports

## 🎯 Success Metrics

### Target KPIs:

- **Contact Enrichment Rate**: 90%+ of contacts enriched
- **Response Rate Improvement**: 25%+ increase over static targeting
- **Time Savings**: 15+ hours per week saved
- **Campaign Success Rate**: 30%+ improvement in playlist adds

### Monitoring Dashboard:

- Total contacts in database
- Enrichment completion rate
- Average response rate by station type
- Campaign performance trends
- Time saved per campaign

## 🚀 Next Steps

1. **Set up Airtable base** using this guide
2. **Import existing contacts** and clean up data
3. **Test API integrations** with sample data
4. **Run enrichment pipeline** on all contacts
5. **Update radio promo agent** to use dynamic targeting
6. **Launch first campaign** with new system
7. **Monitor and optimize** based on results

This setup transforms your contact management from a static list into a dynamic, intelligent system that learns and improves with every campaign!
