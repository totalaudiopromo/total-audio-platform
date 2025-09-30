# Airtable Data Audit Setup Guide

## 🎯 What the Audit Does

The audit script analyzes your Airtable contact data to identify:

1. **📊 Field Mapping Analysis** - Shows data coverage and usage for each field
2. **🚨 Duplicate Detection** - Finds records with same email or name
3. **⚠️ Data Completeness** - Flags records missing key information
4. **🔧 Data Inconsistencies** - Identifies formatting and validation issues
5. **💡 Recommendations** - Suggests improvements for data quality

## 🚀 How to Run the Audit

### Step 1: Get Your Airtable Credentials

1. **API Key**: Go to <https://airtable.com/account> and create an API key
2. **Base ID**: Find your base ID in the URL: `https://airtable.com/appXXXXXXXXXXXXXX`
3. **Table IDs**: Find table IDs in the URL when viewing a table: `https://airtable.com/appXXXXXXXXXXXXXX/tblYYYYYYYYYYYYYY`

### Step 2: Set Environment Variables

```bash
# Set your Airtable credentials
export AIRTABLE_API_KEY="your-api-key-here"
export AIRTABLE_BASE_ID="appXXXXXXXXXXXXXX"
export AIRTABLE_CONTACTS_TABLE_ID="tblYYYYYYYYYYYYYY"
export AIRTABLE_CAMPAIGNS_TABLE_ID="tblZZZZZZZZZZZZZZ"
export AIRTABLE_INTERACTIONS_TABLE_ID="tblWWWWWWWWWWWWWW"
export AIRTABLE_EMAILS_TABLE_ID="tblVVVVVVVVVVVVVV"
```

### Step 3: Run the Audit

```bash
# From the backend directory
cd backend

# Run the demo first to see what it looks like
node demo-audit.js

# Run the actual audit (requires real credentials)
node test-audit.js
```

## 📋 What You'll Get

### Summary Report

- Total number of records analyzed
- Count of duplicates found
- Count of incomplete records
- Count of inconsistent records

### Field Analysis

- Data coverage percentage for each field
- Number of unique values
- Number of missing values
- Sample data from each field

### Duplicate Detection

- Records with identical email addresses
- Records with same names but different emails
- Cross-references between duplicate records

### Completeness Analysis

- Records missing required fields (Email, Name)
- Records missing important fields (Company, Role, Genre, Location)
- Completeness score for each record

### Consistency Analysis

- Invalid email formats
- Inconsistent phone number formats
- Unexpected data types in fields
- Formatting inconsistencies

### Recommendations

- Specific actions to improve data quality
- Validation rules to implement
- Process improvements for data entry

## 🔧 API Endpoint

You can also run the audit via API:

```bash
# POST to run audit
curl -X POST http://localhost:3001/api/airtable-audit/audit \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json"
```

## 📁 Files Created

- `src/services/airtableAudit.ts` - Main audit service
- `src/routes/airtable-audit.ts` - API routes
- `test-audit.js` - Test script for running audit
- `demo-audit.js` - Demo showing sample results
- `docs/AIRTABLE_AUDIT.md` - Detailed documentation

## 🎯 Next Steps

1. **Set up your credentials** and run the audit
2. **Review the results** to understand your data quality
3. **Implement recommendations** to improve data quality
4. **Set up regular audits** to maintain data quality
5. **Integrate with your workflow** for ongoing monitoring

The audit is designed to be non-destructive - it only analyzes your data and provides recommendations without making any changes to your Airtable base. 
