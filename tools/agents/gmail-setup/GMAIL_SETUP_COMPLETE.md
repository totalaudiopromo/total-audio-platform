# Gmail Organisation Setup Complete

## System Overview

Your Gmail is now automatically organised with a clean, colour-coded system designed for your radio promotion workflow.

## Labels Created

- **Active Campaigns** (Green) - Current radio work
- **Needs Action** (Blue) - Campaigns requiring your response
- **Station Feedback** (Orange) - Real responses from stations
- **Station Auto-Responses** (Grey) - Out of office replies
- **Completed** (Yellow) - Finished campaigns (last 30 days)
- **Old Campaigns** (Red) - Archives for reference
- **Agent** (Purple) - Processed by your radio promo agent

## How It Works

### Automatic Filtering

- **New Campaign Assignment**: When you're CC'd on R4/R6 campaigns → Gets "Active Campaigns" + "Needs Action" labels
- **Station Auto-Responses**: Out of office emails → Gets "Station Auto-Responses" label (hidden from main view)
- **Real Station Feedback**: Genuine station responses → Gets "Station Feedback" label (marked important)
- **Weekly Releases**: Team coordination → Gets "Agent" label

### Colour Coding

Set these colours manually in Gmail settings:

- Green: Active Campaigns
- Blue: Needs Action
- Orange: Station Feedback
- Grey: Station Auto-Responses
- Yellow: Completed
- Red: Old Campaigns
- Purple: Agent

### Daily Workflow

1. **Morning**: Check blue labels (Needs Action) for new assignments
2. **Throughout day**: Orange labels (Station Feedback) for station responses
3. **Ongoing**: Green labels (Active Campaigns) show all your current work

### Radio Promo Agent Integration

Your agent can now:

- Find active campaigns: `gmail.searchActiveCampaigns()`
- Find urgent tasks: `gmail.searchCampaignsNeedingAction()`
- Find station responses: `gmail.searchStationFeedback()`
- Mark processed emails: `gmail.markAsProcessed(messageId)`

## Manual Setup Required

### Set Label Colours

1. Go to Gmail Settings → Labels
2. Set colours for each label as noted above

### Optional: Automatic Archiving

Add these filters manually in Gmail Settings → Filters:

1. **Auto-Complete Filter**:
   - Has the words: `older_than:14d label:active-campaigns`
   - Apply label: "Completed"
   - Remove label: "Active Campaigns"

2. **Auto-Archive Filter**:
   - Has the words: `older_than:30d label:completed`
   - Apply label: "Old Campaigns"
   - Remove label: "Completed"

## Commands

```bash
# Test the system
node gmail-liberty-setup.js test

# List current setup
node gmail-liberty-setup.js list

# Test agent integration
node radio-promo-agent.js test-gmail-integration
```

## Benefits

- **Zero inbox clutter**: Auto-responses hidden
- **Visual priority**: Important emails marked and colour-coded
- **Agent ready**: Clean structure for automation
- **Workflow optimised**: Built for your actual email patterns
- **UK spelling**: Throughout the system

Your Gmail is now a productivity machine for radio promotion work.
