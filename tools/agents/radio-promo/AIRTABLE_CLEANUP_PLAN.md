# Airtable Field Cleanup Plan

## GOAL

Tidy up your Airtable fields to create a clean, organized, single source of truth for 517 radio contacts before enriching the full database.

## CURRENT FIELD STRUCTURE (27 Fields)

### KEEP - Core Contact Information (8 fields)

1. **Email**(email) - Primary identifier
2. **First Name**(singleLineText)
3. **Last Name**(singleLineText)
4. **Station**(singleLineText) - Need to populate "Unknown" values
5. **Show**(singleLineText)
6. **Contact Type**(singleSelect) - Radio, Producer, etc.
7. **Region / Country**(singleLineText)
8. **Created At**(createdTime) - System field

### KEEP - Genre & Programming (1 field)

9. **Genres**(multipleSelects) - Critical for campaign targeting

### KEEP - Relationship Status (3 fields - NEED CLEANUP)

10. **Status**(singleSelect) - **UPDATE FROM MAILCHIMP**(currently inaccurate)
11. **Opt-in Source**(multilineText) - Shows where contact came from
12. **Last Email Date**(date)

### KEEP - Engagement Tracking (3 fields)

13. **Last Engagement**(singleSelect)
14. **Reply Status**(singleSelect) - Replied, Ignored, etc.
15. **Response Quality**(singleSelect)

### KEEP - Campaign Management (3 fields)

16. **Campaigns**(multipleRecordLinks) - Links to campaign records
17. **Campaigns Contacted**(singleLineText)
18. **Assigned Freelancer**(singleSelect)

### KEEP - AI Enrichment (3 fields - JUST ADDED)

19. **Enrichment Quality**(singleSelect) - High/Medium/Low
20. **Enrichment Notes**(multilineText) - All AI insights
21. **Last Enriched**(date)

### CONSOLIDATE/CLEANUP (3 fields)

22. **Reply Notes**(singleLineText) - **MERGE INTO Notes field**
23. **Notes**(multilineText) - General notes field
24. **Description**(multilineText) - **MERGE INTO Notes field**

### KEEP BUT VERIFY (2 fields)

25. **MC TAGS**(multilineText) - Mailchimp tags (useful for segmentation)
26. **Interactions**(multipleRecordLinks) - System field

### EVALUATE (1 field)

27. **Test Mode**(checkbox) - Used for testing? Can remove after cleanup

## CLEANUP ACTIONS

### Action 1: Sync Status from Mailchimp 

**Problem**: Status field shows "Unsubscribed" for 11 contacts who are actually subscribed in Mailchimp

**Solution**:

```javascript
// For all 517 contacts:
1. Check subscription status in Mailchimp
2. Update Airtable Status field:
   - "Subscribed" (if subscribed in Mailchimp)
   - "Unsubscribed" (if unsubscribed in Mailchimp)
   - "Not in Mailchimp" (if email not found)
   - "Cleaned" (if bounced/invalid)
```

**Script**: `sync-status-from-mailchimp.js`

### Action 2: Consolidate Notes Fields

**Problem**: Three separate text fields (Reply Notes, Notes, Description) causing confusion

**Solution**:

```javascript
// For all 517 contacts:
1. Create consolidated "Notes" value:
   - Prepend "Reply Notes" content with "REPLY: "
   - Append "Description" content with "\n\nDESCRIPTION: "
   - Merge all into single "Notes" field
2. Clear "Reply Notes" and "Description" fields
3. (Optional) Delete empty "Reply Notes" and "Description" fields
```

**Example Before**:

- Reply Notes: "Auto-extracted from domain: centralcoastradio.org"
- Notes: ""
- Description: ""

**Example After**:

- Notes: "REPLY: Auto-extracted from domain: centralcoastradio.org"
- Reply Notes: (cleared)
- Description: (cleared)

### Action 3: Populate Missing Station Names

**Problem**: Many contacts show "Unknown" in Station field but AI enrichment identified the station

**Solution**:

```javascript
// For contacts with "Unknown" station:
1. Parse Enrichment Notes for station name
2. Update Station field with extracted name
3. If no station name in enrichment, leave as "Unknown"
```

**Examples**:

- `uniqueexpansionradio@gmail.com` → Station: "Unique Expansion Radio"
- `michelle.choudhry@bbc.co.uk` → Station: "BBC Radio 6 Music"
- `paul.mansell@marlowfm.co.uk` → Station: "Marlow FM"

### Action 4: Clean Up Test/Invalid Contacts

**Problem**: Some contacts have gibberish data (e.g., jkhjksdhfmnm@gmail.com)

**Solution**:

```javascript
// Flag or remove invalid contacts:
1. Check for nonsensical email patterns
2. Mark with Test Mode checkbox
3. Option to delete or move to separate "Invalid" view
```

**Invalid Contacts Found**:

- `jkhjksdhfmnm@gmail.com` - Gibberish email (AI marked as "Low" quality, corrupted data)

### Action 5: Verify and Standardize Genre Tags

**Problem**: Inconsistent genre formatting (e.g., "Jazz / Funk" vs "Jazz-/-Funk")

**Solution**:

```javascript
// For all contacts with genres:
1. List all unique genre values
2. Standardize formatting:
   - "Jazz / Funk" → "Jazz/Funk"
   - "R&B / Soul" → "R&B/Soul"
   - Remove extra spaces
3. Update Genre field with standardized values
```

## RECOMMENDED FIELD STRUCTURE (After Cleanup)

### Essential Fields (17 total)

**Contact Information**:

1. Email
2. First Name
3. Last Name
4. Station (populated from enrichment)
5. Show
6. Contact Type
7. Region / Country

**Relationship & Status**: 8. Status (synced from Mailchimp) 9. Opt-in Source 10. Last Email Date 11. Last Engagement 12. Reply Status 13. Response Quality

**Campaign Management**: 14. Campaigns (linked records) 15. Genres (multipleSelects)

**Enrichment Data**: 16. Enrichment Quality (High/Medium/Low) 17. Enrichment Notes (AI intelligence) 18. Last Enriched (date)

**Notes & Tags**: 19. Notes (consolidated from Reply Notes + Description) 20. MC TAGS (Mailchimp tags for segmentation)

**System Fields**: 21. Created At (auto) 22. Interactions (linked records)

### Fields to Archive/Remove:

- **Reply Notes**(merged into Notes)
- **Description**(merged into Notes)
- **Test Mode**(after cleanup complete)
- **Campaigns Contacted**(redundant with Campaigns linked records)
- **Assigned Freelancer**(if not using)

## CLEANUP EXECUTION PLAN

### Phase 1: Backup & Preview (Day 1)

1.  Export full Airtable to JSON backup
2.  Run preview scripts showing what would change
3.  Review changes with you before committing

### Phase 2: Core Data Cleanup (Day 1-2)

4.  Sync Status from Mailchimp (all 517 contacts)
5.  Consolidate Notes fields (merge Reply Notes + Description → Notes)
6.  Populate Station names from Enrichment Notes

### Phase 3: Data Quality (Day 2)

7.  Flag invalid/test contacts with Test Mode checkbox
8.  Standardize Genre formatting
9.  Verify MC TAGS accuracy against Mailchimp

### Phase 4: Field Optimization (Day 3)

10.  Archive/hide unused fields (Reply Notes, Description)
11.  Create filtered views:
    - "Subscribed Only" (Status = Subscribed)
    - "High Quality" (Enrichment Quality = High)
    - "Needs Enrichment" (Last Enriched = empty)
    - "BBC Contacts" (Station contains "BBC")
    - "Test/Invalid" (Test Mode = checked)

## IMMEDIATE NEXT STEPS

**Step 1: Create Backup**

```bash
node export-airtable-backup.js
```

**Step 2: Preview Changes**

```bash
node preview-cleanup-changes.js
```

**Step 3: Execute Cleanup (with approval)**

```bash
node execute-airtable-cleanup.js
```

## IMPORTANT SAFEGUARDS

Before making ANY changes:

1.  **Full Airtable export to JSON**(already have for KYARA 21)
2.  **Preview all changes**before committing
3.  **Batch updates**(not individual API calls - more efficient)
4.  **Preserve all data**in consolidated fields (no data loss)
5.  **Test on 10 contacts first**before running on all 517

## EXPECTED RESULTS

**After Cleanup**:

-  Accurate subscription status for all 517 contacts (synced from Mailchimp)
-  Clean, consolidated Notes field (no more scattered info)
-  Populated Station names (from AI enrichment)
-  Invalid contacts flagged for review
-  Standardized genre tags
-  Ready for full AI enrichment of remaining 496 contacts

**Data Integrity**:

-  Zero data loss (all info preserved in consolidated fields)
-  Mailchimp as single source of truth for subscription status
-  AI enrichment preserved in dedicated fields
-  Historical data maintained (Created At, Last Engagement, etc.)

---

**Would you like me to:**

**A)**Start with Phase 1 (Backup & Preview)?
**B)**Show you a sample of what the consolidated Notes field would look like?
**C)**Focus on a specific cleanup action first (e.g., just sync Status)?
**D)**Create the full cleanup script with interactive approval steps?

Let me know which approach you prefer, and I'll proceed accordingly!
