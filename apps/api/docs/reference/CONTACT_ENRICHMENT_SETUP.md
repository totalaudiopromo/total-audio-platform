# 🎵 Contact Enrichment System Setup

This system uses Firecrawl to scrape UK radio station websites and extract valuable contact information for your radio DJ contacts in Airtable.

## 📋 Prerequisites

1. **Firecrawl API Key**: Get a free API key from [https://firecrawl.dev](https://firecrawl.dev)
2. **Airtable Access**: Your existing Airtable credentials
3. **Node.js**: Version 14 or higher

## 🚀 Quick Start

### 1. Get Firecrawl API Key

Visit [https://firecrawl.dev](https://firecrawl.dev) and sign up for a free account. Copy your API key.

### 2. Set Environment Variables

```bash
# Set your Firecrawl API key
export FIRECRAWL_API_KEY="your-firecrawl-api-key-here"

# Your existing Airtable credentials (already set)
export AIRTABLE_API_KEY="patOohG8Gg008SKWj.fd0e179e09416b65e61ae4fc97b29136a79f769809446aadbccebebcd060f6e1"
export AIRTABLE_BASE_ID="appx7uTQWRH8cIC20"
export AIRTABLE_CONTACTS_TABLE_ID="tblcZnUsB4Swyjcip"
```

### 3. Build the TypeScript

```bash
npm run build
```

### 4. Run Preview Mode

```bash
node test-contact-enrichment.js
```

This will:

- Analyze your radio contacts (limited to 10 for testing)
- Show what data would be extracted
- Display a preview report
- **No changes to Airtable**

### 5. Run Live Mode

```bash
# Process 50 records (default)
node test-contact-enrichment-live.js

# Process specific number of records
node test-contact-enrichment-live.js 100
```

This will:

- Scrape radio station websites
- Extract contact information
- Update your Airtable records
- Generate a comprehensive report

## 📊 What Data is Extracted

For each UK radio station, the system extracts:

### Station Information

- **Format**: Public Service (BBC) vs Commercial
- **Genres**: Music genres played by the station
- **Market**: National, Regional, or Local

### Contact Information

- **DJ Names**: Presenter names and shows
- **Submission Guidelines**: How to submit music
- **Contact Forms**: Submission portals and forms
- **Social Media**: Twitter, Instagram, Facebook links
- **Additional Contacts**: Other contact methods

### Example Output

```
Contact Enrichment: BBC Radio 1
Format: Public Service
Genres: Pop, Rock, Dance, Hip Hop
DJs: Greg James, Clara Amfo, Annie Mac
Submission: Music submissions via BBC Introducing
Contact Forms: BBC Introducing portal
Social Media: @BBCR1, @BBCRadio1
Additional: BBC Music team contacts
```

## 🏢 Supported UK Radio Stations

### BBC National Stations

- BBC Radio 1, 2, 3, 4, 6 Music
- BBC Radio Scotland, Wales, Ulster
- BBC Local Radio stations

### Commercial Major Networks

- Capital FM, Heart, Kiss FM
- Smooth Radio, Magic
- LBC, Virgin Radio

### Regional Commercial Stations

- Key 103, BRMB, Radio City
- Various local commercial stations

## ⚙️ Configuration Options

### Rate Limiting

The system includes built-in rate limiting (1 second between requests) to avoid overwhelming websites.

### Error Handling

- Graceful handling of failed scrapes
- Detailed error logging
- Continues processing even if some stations fail

### Batch Processing

- Processes records in batches of 10 (Airtable limit)
- Progress reporting for large datasets

## 📈 Expected Results

Based on your 210+ radio contacts:

- **~150-180 successful enrichments** (stations with known domains)
- **Enhanced contact data** for each radio station
- **Submission guidelines** for music promotion
- **DJ and show information** for targeted outreach
- **Social media links** for additional contact methods

## 🔧 Troubleshooting

### Common Issues

1. **Firecrawl API Key Missing**

   ```
   ❌ ERROR: Please set your FIRECRAWL_API_KEY environment variable
   ```

   Solution: Get API key from <https://firecrawl.dev>

2. **Rate Limiting**

   ```
   Firecrawl API error: 429 Too Many Requests
   ```

   Solution: The system includes rate limiting, but you can increase delays if needed

3. **Unknown Domains**

   ```
   Skipping example.com - no known radio station mapping
   ```

   Solution: Add new station mappings to the `ukRadioStations` array

### Adding New Stations

To add support for new radio stations, edit `src/services/airtableContactEnrichment.ts`:

```typescript
{
  domain: 'newstation.co.uk',
  name: 'New Station',
  websiteUrl: 'https://www.newstation.co.uk',
  expectedFormat: 'Commercial'
}
```

## 📋 Scripts Overview

| Script                            | Purpose                      | Mode    |
| --------------------------------- | ---------------------------- | ------- |
| `demo-contact-enrichment.js`      | Show how enrichment works    | Demo    |
| `test-contact-enrichment.js`      | Preview mode (no changes)    | Preview |
| `test-contact-enrichment-live.js` | Live mode (updates Airtable) | Live    |

## 🎯 Use Cases

### Music Promotion

- Target specific genres and formats
- Follow submission guidelines
- Contact the right DJs and shows

### Campaign Planning

- Identify BBC vs Commercial opportunities
- Plan regional vs national campaigns
- Use social media for additional outreach

### Contact Management

- Enhanced Airtable records
- Better segmentation and filtering
- Improved outreach success rates

## 💰 Cost Considerations

- **Firecrawl**: Free tier available, paid for high volume
- **Processing Time**: ~1.5 seconds per record (with rate limiting)
- **API Calls**: One per radio station website

## 🚀 Next Steps

1. **Start with Preview**: Run `node test-contact-enrichment.js`
2. **Review Results**: Check the preview report
3. **Run Live**: Execute `node test-contact-enrichment-live.js`
4. **Monitor**: Check your Airtable for enriched records
5. **Iterate**: Add new stations or adjust extraction logic as needed

---

**Need Help?** Check the error logs or add new station mappings to expand coverage.
