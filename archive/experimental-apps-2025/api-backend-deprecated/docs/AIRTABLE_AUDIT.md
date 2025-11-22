# Airtable Data Audit System

## Overview

The Airtable Data Audit System provides comprehensive analysis of your Airtable contact data to identify data quality issues, inconsistencies, and areas for improvement.

## Features

### 1. Field Mapping Analysis

- **Data Type Detection**: Identifies all data types used in each field
- **Usage Statistics**: Shows how many records contain each field
- **Example Values**: Provides sample data from each field
- **Field Coverage**: Identifies unused or rarely used fields

### 2. Duplicate Detection

- **Email Duplicates**: Finds records with identical email addresses
- **Name Duplicates**: Identifies records with same names but different emails
- **Cross-Reference**: Links duplicate records for easy review
- **Duplicate Count**: Provides summary statistics

### 3. Data Completeness Analysis

- **Required Fields**: Checks for missing essential information
- **Important Fields**: Identifies missing valuable data
- **Completeness Score**: Calculates percentage of complete records
- **Missing Field Tracking**: Lists specific missing fields per record

### 4. Data Consistency Analysis

- **Format Validation**: Checks email formats, phone numbers, dates
- **Data Type Consistency**: Identifies mixed data types in same field
- **Value Length Analysis**: Flags unusually long or short values
- **Empty String Detection**: Finds empty strings that should be null

### 5. Automated Recommendations

- **Actionable Insights**: Provides specific recommendations for data cleanup
- **Priority Ranking**: Suggests which issues to address first
- **Field Optimization**: Recommends field usage improvements

## API Endpoints

### Full Audit

```http
POST /api/airtable-audit/audit
Authorization: Bearer <token>
```

**Response:**

```json
{
  "success": true,
  "data": {
    "summary": {
      "totalRecords": 1250,
      "duplicateCount": 15,
      "incompleteCount": 89,
      "inconsistentCount": 23
    },
    "duplicates": [...],
    "incomplete": [...],
    "inconsistencies": [...],
    "fieldAnalysis": {...},
    "recommendations": [...]
  }
}
```

### Audit Summary

```http
GET /api/airtable-audit/summary
Authorization: Bearer <token>
```

### Specific Sections

```http
GET /api/airtable-audit/section/duplicates
GET /api/airtable-audit/section/incomplete
GET /api/airtable-audit/section/inconsistencies
GET /api/airtable-audit/section/fields
Authorization: Bearer <token>
```

## Data Analysis Details

### Field Analysis

Each field is analyzed for:

- **Data Types**: string, email, date, phone, number, array, boolean, object
- **Unique Values**: Count of distinct values
- **Null Count**: Number of empty/null values
- **Coverage**: Percentage of records with this field populated
- **Sample Values**: Up to 5 example values

### Duplicate Detection Logic

1. **Email Duplicates**: Records with identical email addresses
2. **Name Duplicates**: Records with same name but different emails
3. **Cross-Reference**: Links related duplicate records

### Completeness Scoring

- **Required Fields** (Email, Name): 25% penalty each if missing
- **Important Fields** (Company, Role, Genre, Location): 10% penalty each if missing
- **Score Range**: 0-100%

### Consistency Checks

- **Email Format**: Valid email address pattern
- **Name Length**: 2-100 characters
- **Empty Strings**: Identifies empty strings that should be null
- **Data Type Mixing**: Detects inconsistent types in same field

## Usage Examples

### Running a Full Audit

```javascript
const auditService = await AirtableAuditService.getAuditServiceForUser(userId);
const auditResult = await auditService.performFullAudit();

console.log(`Found ${auditResult.summary.duplicateCount} duplicates`);
console.log(`Found ${auditResult.summary.incompleteCount} incomplete records`);
```

### Checking Specific Issues

```javascript
// Check for duplicates only
const duplicates = auditResult.duplicates;
duplicates.forEach(dup => {
  console.log(`Duplicate email: ${dup.email}`);
  console.log(`Names: ${dup.names.join(', ')}`);
});

// Check field coverage
Object.entries(auditResult.fieldAnalysis).forEach(([field, analysis]) => {
  if (analysis.coverage < 50) {
    console.log(`Low coverage in ${field}: ${analysis.coverage}%`);
  }
});
```

### Using Recommendations

```javascript
auditResult.recommendations.forEach(rec => {
  console.log(`Recommendation: ${rec}`);
});
```

## Test Script

Run the audit test script:

```bash
cd backend
node test-audit.js
```

This will:

1. Connect to your Airtable base
2. Perform comprehensive analysis
3. Display detailed report with emojis and formatting
4. Show recommendations for data cleanup

## Environment Variables

Required for the audit system:

```bash
AIRTABLE_API_KEY=your_api_key
AIRTABLE_BASE_ID=your_base_id
AIRTABLE_CONTACTS_TABLE_ID=your_contacts_table_id
AIRTABLE_CAMPAIGNS_TABLE_ID=your_campaigns_table_id
AIRTABLE_INTERACTIONS_TABLE_ID=your_interactions_table_id
AIRTABLE_EMAILS_TABLE_ID=your_emails_table_id
```

## Integration Setup

1. **Connect Airtable**: Ensure your Airtable integration is connected
2. **Verify Permissions**: Check that your API key has read access to all tables
3. **Test Connection**: Run the test script to verify connectivity
4. **Review Results**: Analyze the audit report for data quality issues

## Data Cleanup Workflow

1. **Run Full Audit**: Get comprehensive analysis
2. **Review Duplicates**: Merge or remove duplicate records
3. **Complete Missing Data**: Fill in required and important fields
4. **Standardize Formats**: Ensure consistent data types
5. **Validate Data**: Check email formats and other validations
6. **Re-run Audit**: Verify improvements

## Performance Considerations

- **Large Datasets**: The audit processes up to 10,000 records by default
- **API Limits**: Respects Airtable API rate limits
- **Memory Usage**: Processes records in batches for large datasets
- **Caching**: Consider caching results for repeated analysis

## Troubleshooting

### Common Issues

1. **Authentication Errors**: Verify API key and permissions
2. **Table Not Found**: Check table IDs in configuration
3. **Rate Limiting**: Reduce request frequency if hitting limits
4. **Memory Issues**: Process smaller batches for very large datasets

### Error Handling

The audit system includes comprehensive error handling:

- Connection failures
- Invalid data formats
- Missing required fields
- API rate limiting

## Future Enhancements

- **Data Export**: Export audit results to CSV/Excel
- **Automated Cleanup**: Suggest specific cleanup actions
- **Historical Tracking**: Track data quality improvements over time
- **Custom Rules**: Allow custom validation rules
- **Integration APIs**: Connect with data cleanup tools
