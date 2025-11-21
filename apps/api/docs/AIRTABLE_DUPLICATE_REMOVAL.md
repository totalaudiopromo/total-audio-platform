#  Airtable Duplicate Removal System

## Overview

The Airtable Duplicate Removal System is a comprehensive tool designed to safely identify and remove duplicate contacts from your Airtable base. It prioritizes data safety with dry-run mode, automatic backups, and detailed logging.

##  Features

### Core Functionality

- ** Duplicate Detection**: Identifies contacts with identical email addresses
- ** Smart Selection**: Keeps the most complete record, or most recent if equally complete
- ** Safety First**: Dry-run mode shows what would be deleted before actual removal
- ** Automatic Backup**: Creates backup files with all deleted records
- ** Detailed Logging**: Comprehensive logs of all actions taken
- ** Batch Processing**: Efficiently processes large datasets in batches

### Safety Measures

- **Dry-Run Mode**: Preview deletions without making changes
- **Backup Creation**: Automatic backup of all records to be deleted
- **Confirmation Prompts**: Multiple confirmation steps for live removal
- **Error Handling**: Graceful error handling with detailed error messages
- **Rollback Capability**: Backup files allow restoration if needed

##  Requirements

### Environment Variables

```bash
AIRTABLE_API_KEY=your-api-key
AIRTABLE_BASE_ID=your-base-id
AIRTABLE_CONTACTS_TABLE_ID=your-contacts-table-id
```

### Dependencies

- `airtable` npm package
- TypeScript compilation
- Node.js environment

##  Usage

### 1. Dry Run (Recommended First Step)

Run a dry run to see what duplicates would be removed:

```bash
cd backend
node test-duplicate-removal.js
```

**Output Example:**

```
 Testing Airtable Duplicate Removal Service...

 DRY RUN RESULTS:
=====================================
Total duplicate groups: 91
Records that would be deleted: 91
Backup records created: 91
Errors: 0

 Duplicate Groups Found:
=====================================

1. Email: john@example.com
   Records: 2
   Keeping: rec123456789
   Deleting: 1 records
   Reason: Most complete record (75% vs 25%)

  WARNING: This will permanently delete records from Airtable!
A backup file has been created with all records that would be deleted.

To proceed with live removal, run:
node test-duplicate-removal-live.js
```

### 2. Live Removal (After Dry Run)

If you're satisfied with the dry run results:

```bash
cd backend
node test-duplicate-removal-live.js
```

**Safety Prompts:**

```
  WARNING: This will permanently delete records from Airtable!
A backup file has been created with all records that would be deleted.
You can restore from the backup file if needed.

Are you sure you want to proceed with LIVE deletion? (yes/no): yes
Type "DELETE" to confirm permanent deletion: DELETE
```

##  How It Works

### Duplicate Detection Algorithm

1. **Email Normalization**: Converts all emails to lowercase and trims whitespace
2. **Grouping**: Groups records by normalized email address
3. **Filtering**: Identifies groups with more than one record

### Record Selection Logic

1. **Completeness Scoring**: Calculates percentage of filled important fields
   - Important fields: Name, Company, Role, Genre, Location, Email, Phone, Website, Notes
2. **Tie Breaking**: If completeness is equal, keeps most recently created record
3. **Selection**: Keeps the record with highest score, deletes others

### Completeness Calculation

```typescript
const importantFields = [
  'Name',
  'Company',
  'Role',
  'Genre',
  'Location',
  'Email',
  'Phone',
  'Website',
  'Notes',
];

// Score = (filled fields / total fields) * 100
```

##  Backup System

### Backup File Format

Backup files are saved as `duplicate-backup-YYYY-MM-DD.json` with the following structure:

```json
[
  {
    "email": "john@example.com",
    "recordId": "rec123456789",
    "fields": {
      "Name": "John Doe",
      "Email": "john@example.com",
      "Company": "Example Corp"
    },
    "deletedAt": "2024-01-15T10:30:00.000Z",
    "reason": "Duplicate of rec987654321 (Most complete record (75% vs 25%))"
  }
]
```

### Restoring from Backup

To restore deleted records, you can use the backup file to recreate records in Airtable:

```javascript
// Example restoration script
const backupData = require('./duplicate-backup-2024-01-15.json');
const base = new Airtable({ apiKey: 'your-key' }).base('your-base-id');

backupData.forEach(async record => {
  try {
    await base('Contacts').create({
      ...record.fields,
    });
    console.log(`Restored record for ${record.email}`);
  } catch (error) {
    console.error(`Failed to restore ${record.email}:`, error);
  }
});
```

##  API Endpoints

### Dry Run

```http
POST /api/airtable-duplicate-removal/dry-run
```

**Response:**

```json
{
  "success": true,
  "message": "Dry run completed successfully",
  "data": {
    "totalDuplicates": 91,
    "recordsToDelete": 91,
    "backupData": [...],
    "duplicateGroups": [...],
    "dryRun": true,
    "errors": []
  }
}
```

### Live Removal

```http
POST /api/airtable-duplicate-removal/remove
```

**Response:**

```json
{
  "success": true,
  "message": "Duplicate removal completed successfully",
  "data": {
    "totalDuplicates": 91,
    "recordsToDelete": 91,
    "backupData": [...],
    "duplicateGroups": [...],
    "dryRun": false,
    "errors": []
  }
}
```

### Status Check

```http
GET /api/airtable-duplicate-removal/status
```

**Response:**

```json
{
  "success": true,
  "data": {
    "totalDuplicates": 91,
    "recordsToDelete": 91,
    "hasDuplicates": true
  }
}
```

##  Important Notes

### Before Running

1. **Test with Dry Run**: Always run dry-run mode first
2. **Review Results**: Carefully review what would be deleted
3. **Check Backup**: Ensure backup file is created successfully
4. **Verify Credentials**: Confirm Airtable API access

### During Execution

1. **Don't Interrupt**: Avoid stopping the process mid-execution
2. **Monitor Logs**: Watch for any error messages
3. **Check Progress**: Monitor deletion progress in logs

### After Completion

1. **Verify Results**: Check Airtable to confirm deletions
2. **Save Backup**: Keep backup file in safe location
3. **Review Logs**: Check logs for any issues

##  Troubleshooting

### Common Issues

**"Missing required Airtable environment variables"**

- Ensure all environment variables are set correctly
- Check API key permissions in Airtable

**"Error accessing Airtable table"**

- Verify table ID is correct
- Check API key has access to the base

**"No duplicates found"**

- Confirm email field exists in your table
- Check if emails are properly formatted

**"TypeScript compilation errors"**

- Run `npm install` to ensure dependencies
- Check TypeScript configuration

### Error Recovery

1. **Check Backup**: Use backup file to restore if needed
2. **Review Logs**: Check detailed error messages
3. **Verify Permissions**: Ensure API key has proper access
4. **Contact Support**: If issues persist, check logs for specific errors

##  Performance

### Batch Processing

- Processes deletions in batches of 10 records
- Optimized for Airtable API rate limits
- Progress logging for large datasets

### Memory Usage

- Efficient memory management for large datasets
- Streaming processing for backup files
- Minimal memory footprint

##  Security

### Data Protection

- No sensitive data logged
- Secure API key handling
- Backup file encryption (if needed)

### Access Control

- API endpoint authentication
- User-specific service instances
- Audit logging for all operations

##  Support

For issues or questions:

1. Check the logs for detailed error messages
2. Review this documentation
3. Test with dry-run mode first
4. Verify environment variables and permissions
