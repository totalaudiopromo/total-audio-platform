# Liberty Music PR CoverageBook Integration Guide

## How to Use Liberty's Actual CoverageBook Data

Since CoverageBook doesn't have a public API, we'll export your actual campaign data and import it into your Radio Promo Agent for comprehensive analysis.

## Step 1: Export Data from CoverageBook

### Option A: Export All Campaign Data

1. **Log into CoverageBook**with your Liberty account
2. **Go to Coverage Vault**(central repository of all coverage)
3. **Select date range**for your campaigns (e.g., last 6 months)
4. **Filter by client**if needed (for specific Liberty campaigns)
5. **Click "Export"**→ Choose CSV format
6. **Save the file**as `liberty_coveragebook_export.csv`

### Option B: Export Individual Campaign Data

1. **Open specific campaign**in CoverageBook
2. **Go to "Coverage" tab**
3. **Click "Export Coverage"**
4. **Choose CSV format**
5. **Save with campaign name**(e.g., `reigns_made_for_coverage.csv`)

## Step 2: Prepare CSV Data

### CoverageBook CSV Format

Your exported CSV should have these columns:

```csv
Article Title,Article URL,Media Outlet,Publication Date,Estimated Reach,Impressions,Media Type,Sentiment,Author,Category,Tags
```

### If Your CSV Has Different Column Names

The agent can handle variations like:

- `Title` or `Headline` instead of `Article Title`
- `Link` or `URL` instead of `Article URL`
- `Publication` or `Source` instead of `Media Outlet`
- `Date` or `Published` instead of `Publication Date`

## Step 3: Import into Your Agent

### Import All Liberty Campaigns

```bash
cd /Users/chrisschofield/workspace/active/total-audio-platform/tools/agents/radio-promo

# Import main export (all campaigns)
node ../radio-promo-agent.js coveragebook-import "./liberty_coveragebook_export.csv" "Liberty Music PR - All Campaigns"

# Or import individual campaigns
node ../radio-promo-agent.js coveragebook-import "./reigns_made_for_coverage.csv" "Reigns - Made For"
node ../radio-promo-agent.js coveragebook-import "./artist2_single_coverage.csv" "Artist 2 - Single Name"
```

### Check Import Status

```bash
node ../radio-promo-agent.js coveragebook-status
```

## Step 4: Analyze Your Data

### Get Campaign Summaries

```bash
# Individual campaign analysis
node ../radio-promo-agent.js coveragebook-summary "Reigns - Made For"
node ../radio-promo-agent.js coveragebook-summary "Artist 2 - Single Name"

# All campaigns overview
node ../radio-promo-agent.js coveragebook-report
```

### Find Specific Coverage

```bash
# Find all BBC coverage across campaigns
node ../radio-promo-agent.js coveragebook-find "BBC"

# Find NME coverage
node ../radio-promo-agent.js coveragebook-find "NME"

# Find Guardian coverage
node ../radio-promo-agent.js coveragebook-find "Guardian"
```

## Step 5: Advanced Analysis

### Campaign Performance Comparison

```bash
# Generate detailed reports for each campaign
node ../radio-promo-agent.js coveragebook-report "Reigns - Made For"
node ../radio-promo-agent.js coveragebook-report "Artist 2 - Single Name"
node ../radio-promo-agent.js coveragebook-report "Artist 3 - Track Name"
```

### Media Outlet Analysis

```bash
# Find coverage from specific outlets
node ../radio-promo-agent.js coveragebook-find "Amazing Radio"
node ../radio-promo-agent.js coveragebook-find "Radio Wigwam"
node ../radio-promo-agent.js coveragebook-find "Clash"
node ../radio-promo-agent.js coveragebook-find "DIY"
```

## What You'll Get

### Campaign Insights

- **Total mentions**across all outlets
- **Total reach**and impressions
- **Top performing articles**by reach
- **Media type breakdown**(Online, Radio, Print)
- **Outlet performance**ranking
- **Sentiment analysis**(positive, neutral, negative)

### Strategic Intelligence

- **Which outlets**work best for Liberty campaigns
- **What content**gets the most reach
- **Campaign performance**over time
- **Media relationships**that drive results
- **ROI insights**for future campaigns

## Step 6: Regular Updates

### Monthly Data Refresh

1. **Export new data**from CoverageBook monthly
2. **Import latest campaigns**into agent
3. **Compare performance**across months
4. **Identify trends**and opportunities

### Example Monthly Workflow

```bash
# Export from CoverageBook (manual)
# Then import to agent:

# New campaigns
node ../radio-promo-agent.js coveragebook-import "./november_2024_coverage.csv" "November 2024 Campaigns"

# Update existing campaigns
node ../radio-promo-agent.js coveragebook-import "./updated_reigns_coverage.csv" "Reigns - Made For"

# Generate monthly report
node ../radio-promo-agent.js coveragebook-report
```

## Pro Tips

### Data Organization

- **Name campaigns consistently**(e.g., "Artist - Track Name")
- **Include date ranges**in campaign names for time-based analysis
- **Group similar campaigns**for broader insights

### Analysis Strategy

- **Compare campaign performance**to identify what works
- **Track outlet relationships**to prioritize outreach
- **Monitor sentiment trends**to improve messaging
- **Use reach data**to justify campaign budgets

### Integration with Radio Research

```bash
# Research radio stations for successful campaigns
node ../radio-promo-agent.js research-radio "Successful Artist" "Hit Track" "genre"

# Cross-reference with coverage data
node ../radio-promo-agent.js coveragebook-find "BBC Radio 6 Music"
```

## Expected Results

Once you import Liberty's actual CoverageBook data, you'll have:

- **Complete campaign history**with real metrics
- **Outlet performance analysis**based on actual results
- **Campaign success patterns**to replicate
- **Media relationship insights**for future outreach
- **ROI tracking**for Liberty's PR efforts
- **Competitive intelligence**from your coverage data

This gives you a powerful combination of:

- **Historical performance data**(CoverageBook)
- **Future opportunity research**(Radio Research)
- **Campaign automation**(Monday.com, Typeform, Mailchimp)
- **Play tracking**(WARM API)

Your Liberty Radio Promo Agent will become a comprehensive PR intelligence and automation system! 
