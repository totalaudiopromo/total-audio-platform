# Airtable Audit Setup Guide

## Quick Setup

1. **Open the test file**: `backend/test-audit.js`
2. **Replace the placeholders**at the top of the file with your actual credentials:

```javascript
// Replace these with your actual values:
process.env.AIRTABLE_API_KEY = 'your-actual-api-key-here';
process.env.AIRTABLE_BASE_ID = 'your-actual-base-id-here';
process.env.AIRTABLE_CONTACTS_TABLE_ID = 'your-actual-contacts-table-id-here';
```

3. **Run the audit**: `node test-audit.js`

## How to Get Your Airtable Credentials

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

## Example Configuration

```javascript
// Example placeholder values only - replace with your actual credentials
process.env.AIRTABLE_API_KEY = 'key1234567890abcdef'; // Not a real API key
process.env.AIRTABLE_BASE_ID = 'app1234567890abcdef'; // Example base ID
process.env.AIRTABLE_CONTACTS_TABLE_ID = 'tbl1234567890abcdef'; // Example table ID
```

## What the Audit Will Check

-  Field coverage and completeness
-  Duplicate contacts (same email/name)
-  Missing required information
-  Data format inconsistencies
-  Recommendations for improvement

## Run the Audit

```bash
cd backend
node test-audit.js
```

That's it! The audit will analyze your Airtable data and show you exactly what needs to be cleaned up.
