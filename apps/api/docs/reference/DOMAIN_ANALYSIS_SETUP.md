# 🎵 Email Domain Analysis Setup Guide

## Quick Setup

1. **Open the test file**: `backend/test-domain-analysis.js`
2. **Replace the placeholders** at the top of the file with your actual credentials:

```javascript
// Replace these with your actual values:
process.env.AIRTABLE_API_KEY = 'your-actual-api-key-here';
process.env.AIRTABLE_BASE_ID = 'your-actual-base-id-here';
process.env.AIRTABLE_CONTACTS_TABLE_ID = 'your-actual-contacts-table-id-here';
```

3. **Run the preview**: `node test-domain-analysis.js`
4. **Review the results** and decide if you want to apply the changes
5. **Run live mode**: `node test-domain-analysis-live.js` (if you want to apply changes)

## 🔑 How to Get Your Airtable Credentials

### API Key

1. Go to <https://airtable.com/account>
2. Click "API" in the left sidebar
3. Click "Create new API key"
4. Copy the generated key

### Base ID

1. Open your Airtable base
2. Look at the URL: `https://airtable.com/appXXXXXXXXXXXXXX`
3. Copy the part after `/app/` (the X's)

### Table IDs

1. Open a table in your base
2. Look at the URL: `https://airtable.com/appXXXXXXXXXXXXXX/tblYYYYYYYYYYYYY`
3. Copy the part after `/tbl/` (the Y's)

## 📋 Example Configuration

```javascript
process.env.AIRTABLE_API_KEY = 'key1234567890abcdef';
process.env.AIRTABLE_BASE_ID = 'app1234567890abcdef';
process.env.AIRTABLE_CONTACTS_TABLE_ID = 'tbl1234567890abcdef';
```

## 🎯 What the Analysis Will Do

### Company Extraction

- ✅ Extract company names from email domains
- ✅ Identify music industry platforms automatically
- ✅ Handle common domain patterns appropriately
- ✅ Skip personal email domains (gmail, yahoo, etc.)

### Music Industry Recognition

- 🎵 **Streaming Platforms**: Spotify, Apple Music, YouTube Music, etc.
- 📻 **Radio Stations**: KCRW, KEXP, NPR, BBC Radio, etc.
- 📰 **Music Media**: Pitchfork, Rolling Stone, Billboard, NME, etc.
- 🏢 **Record Labels**: Universal, Sony, Warner, Interscope, etc.
- 🎪 **Venues & Festivals**: Coachella, Lollapalooza, etc.
- 🎼 **Music Services**: Management, Booking, Studios, etc.

### Updates Made

- **Company Field**: Extracted company name
- **Role Field**: Identified company type (Playlist Curator, Radio DJ, etc.)
- **Notes Field**: Auto-extraction details and reasoning

## 🚀 Run the Analysis

### Preview Mode (Recommended First)

```bash
cd backend
node test-domain-analysis.js
```

### Live Mode (Apply Changes)

```bash
cd backend
node test-domain-analysis-live.js
```

## 📊 Sample Output

```
📊 DOMAIN ANALYSIS REPORT
==================================================

📈 Summary:
- Total records: 1,250
- Analyzed records: 890
- Records to update: 156
- Mode: DRY RUN

🏢 Company Types Identified:
------------------------------
- Playlist Curator: 45 contacts
- Music Journalist: 38 contacts
- Radio DJ: 28 contacts
- A&R: 25 contacts
- Music Blog: 12 contacts
- Venue Manager: 8 contacts

📝 Sample Updates (first 10):
------------------------------
📧 john@spotify.com
   Domain: spotify.com
   Company: Spotify
   Type: Playlist Curator
   Confidence: 95%
   Reason: Matched pattern: spotify\.com

📧 editor@pitchfork.com
   Domain: pitchfork.com
   Company: Pitchfork
   Type: Music Journalist
   Confidence: 95%
   Reason: Matched pattern: pitchfork\.com
```

## ⚠️ Important Notes

1. **Always run preview mode first** to see what changes would be made
2. **Backup your data** before running live mode
3. **Review the confidence levels** - higher confidence means more reliable extraction
4. **Personal domains are skipped** (gmail, yahoo, etc.)
5. **The script is conservative** - only updates records with reasonable confidence

## 🔧 Customization

You can modify the patterns in `src/services/airtableDomainAnalysis.ts` to:

- Add new music industry domains
- Adjust confidence levels
- Change company type classifications
- Add new domain patterns

## 🆘 Troubleshooting

### Common Issues

- **"Missing required Airtable environment variables"**: Check your API key, base ID, and table ID
- **"No records found"**: Verify your table ID is correct
- **"Permission denied"**: Check your API key permissions

### Getting Help

1. Check the console output for detailed error messages
2. Verify your Airtable credentials are correct
3. Ensure your API key has read/write permissions for the base

That's it! The analysis will help you automatically categorize your music industry contacts based on their email domains. 
