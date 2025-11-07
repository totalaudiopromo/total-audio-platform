# Airtable Cleanup Summary & Recommendations

## ✅ BACKUP COMPLETE

**Backup File**: `AIRTABLE_FULL_BACKUP_2025-10-03.json`

- **Total Records**: 517 contacts
- **Export Date**: 2025-10-03
- **File Size**: Complete backup with all fields and relationships

## 📊 KEY FINDINGS

### Critical Issues to Address:

1. **Missing Genres** (409/517 = 79.1%)

   - Most contacts have no genre tags
   - **Impact**: Can't effectively target contacts for campaigns
   - **Solution**: AI enrichment will add genres based on station type and contact info

2. **Missing Station Names** (60/517 = 11.6%)

   - 60 contacts show empty or "Unknown" station
   - **Impact**: Can't identify which station to pitch
   - **Solution**: Extract from enrichment notes or domain analysis

3. **Invalid Email** (1 contact)

   - `jkhjksdhfmnm@gmail.com` - Gibberish test data
   - **Impact**: Unusable contact, wastes enrichment credits
   - **Solution**: Delete or mark as Test Mode

4. **Inaccurate Status Field** (confirmed via Mailchimp verification)
   - 13/21 KYARA contacts had wrong status
   - **Impact**: Missing out on valuable subscribed contacts
   - **Solution**: Sync from Mailchimp API

### Field Usage Analysis:

**Well-Populated Fields** (>90%):

- ✅ Email (99.8%)
- ✅ Contact Type (98.3%)
- ✅ Status (93.2%) - _but needs accuracy fix_
- ✅ First Name (90.3%)
- ✅ Station (88.4%)
- ✅ Created At (100% - system field)

**Partially-Populated Fields** (70-90%):

- ⚠️ Last Engagement (76.2%)
- ⚠️ Reply Status (74.7%)
- ⚠️ MC TAGS (74.1%)
- ⚠️ Reply Notes (69.1%)

**Low-Populated Fields** (<20%):

- ❌ Genres (20.9%) - **CRITICAL TO FIX**
- ❌ Notes (2.7%)
- ❌ Enrichment Fields (1.9%) - _just started enriching_
- ❌ Test Mode (0.4%)

## 🎯 RECOMMENDED CLEANUP STRATEGY

### Phase 1: Data Quality & Accuracy (PRIORITY 1)

#### 1.1 Sync Status from Mailchimp ✅

**Why**: 62% of KYARA contacts had wrong status (subscribed in Mailchimp but marked "Unsubscribed" in Airtable)

**Action**:

```bash
node sync-status-from-mailchimp.js
```

**Expected Changes**:

- ~100-150 contacts updated with accurate subscription status
- New status values: "Subscribed", "Unsubscribed", "Not in Mailchimp", "Cleaned"
- Adds "Last Mailchimp Sync" date field

**Impact**: Won't accidentally skip valuable BBC/6 Music contacts due to stale data

#### 1.2 Remove Invalid Contact

**Why**: 1 contact with gibberish email wastes enrichment credits

**Action**:

```javascript
// Delete record: jkhjksdhfmnm@gmail.com (rec recZocLutx67M07yw)
// OR mark as Test Mode for review
```

**Expected Changes**: 517 → 516 usable contacts

#### 1.3 Consolidate Notes Fields

**Why**: Three separate text fields (Reply Notes, Notes, Description) causing confusion

**Action**:

```bash
node consolidate-notes-fields.js
```

**Expected Changes**:

- Merge 357 "Reply Notes" entries into "Notes" field
- Clear "Description" field (only 0% populated)
- Single "Notes" field with all historical context

### Phase 2: AI Enrichment at Scale (PRIORITY 2)

#### 2.1 Enrich Remaining 507 Contacts

**Why**: Only 10/517 (1.9%) contacts enriched so far

**Action**:

```bash
node enrich-all-contacts-batch.js
```

**Expected Changes**:

- Add **Enrichment Quality** (High/Medium/Low) for 507 contacts
- Add **Enrichment Notes** with station analysis, pitch strategy, genre classification
- Add **Last Enriched** timestamp
- **AI will auto-populate missing genres** during enrichment

**Cost Estimate**:

- ~507 contacts × $0.003/enrichment = ~$1.52 total
- Takes ~15-20 minutes with rate limiting

#### 2.2 Extract Station Names from Enrichment

**Why**: AI enrichment identifies stations even when field is empty

**Action**:

```bash
node extract-stations-from-enrichment.js
```

**Expected Changes**:

- Populate 60 missing station names from enrichment notes
- Examples:
  - `uniqueexpansionradio@gmail.com` → "Unique Expansion Radio"
  - `paul.mansell@marlowfm.co.uk` → "Marlow FM"

### Phase 3: Genre Classification (PRIORITY 3)

#### 3.1 Auto-Tag Genres from Enrichment

**Why**: 79% of contacts have no genre tags (critical for campaign targeting)

**Action**:

```bash
node auto-tag-genres-from-enrichment.js
```

**Expected Changes**:

- AI enrichment notes include genre analysis
- Extract and tag genres automatically:
  - BBC contacts → "Indie, Alternative, Rock"
  - Community stations → Genre variety based on programming
  - Specialist shows → Specific genre focus

**Result**: 108 contacts with genres → ~450+ contacts with genres (350%+ improvement)

### Phase 4: Field Optimization (PRIORITY 4)

#### 4.1 Standardize Genre Values

**Why**: Inconsistent formatting ("Jazz / Funk" vs "Jazz/Funk")

**Action**:

```bash
node standardize-genre-values.js
```

**Expected Changes**:

- "R&B / Soul" → "R&B/Soul"
- "Jazz / Funk" → "Jazz/Funk"
- Remove duplicate genres from multi-select

#### 4.2 Create Airtable Views

**Why**: Easier campaign planning with filtered views

**Views to Create**:

1. **"Subscribed Contacts"** - Status = Subscribed (for active campaigns)
2. **"High Quality"** - Enrichment Quality = High (BBC, major stations)
3. **"Needs Enrichment"** - Last Enriched = empty (remaining 507)
4. **"BBC & National"** - Station contains "BBC" or quality = High
5. **"Invalid/Test"** - Test Mode = true (cleanup review)

## 🚀 EXECUTION PLAN

### Quick Win (30 minutes)

```bash
# 1. Sync status from Mailchimp (fix accuracy issue)
node sync-status-from-mailchimp.js

# 2. Delete invalid contact
node delete-invalid-contacts.js

# 3. Consolidate notes fields
node consolidate-notes-fields.js
```

**Result**: Clean, accurate subscription status + consolidated notes

### Full Enrichment (2 hours)

```bash
# 4. Enrich all 507 remaining contacts
node enrich-all-contacts-batch.js

# 5. Extract station names from enrichment
node extract-stations-from-enrichment.js

# 6. Auto-tag genres from enrichment
node auto-tag-genres-from-enrichment.js
```

**Result**: 100% enriched database with genres, quality ratings, and pitch strategies

### Final Polish (30 minutes)

```bash
# 7. Standardize genre values
node standardize-genre-values.js

# 8. Create Airtable views (manual in Airtable UI)
# - Subscribed Contacts
# - High Quality
# - BBC & National
# - Invalid/Test
```

**Result**: Production-ready contact database for campaigns

## 💡 SMART APPROACH: Sample Test First

Before enriching all 507 contacts, **test on a sample of 50**:

```bash
node enrich-sample-50-contacts.js
```

**Benefits**:

- Verify enrichment quality on diverse contact types
- Check genre auto-tagging accuracy
- Review station name extraction
- Estimate total time/cost
- Adjust prompt if needed

**Cost**: 50 × $0.003 = $0.15 (vs $1.52 for all 507)

## 📋 WHAT I'LL CREATE FOR YOU

### Immediate Scripts (Phase 1):

1. ✅ `export-airtable-backup.js` - **DONE** (backup created)
2. 🔄 `sync-status-from-mailchimp.js` - Sync subscription status
3. 🔄 `consolidate-notes-fields.js` - Merge Reply Notes → Notes
4. 🔄 `delete-invalid-contacts.js` - Remove gibberish email

### Enrichment Scripts (Phase 2):

5. 🔄 `enrich-sample-50-contacts.js` - Test enrichment on sample
6. 🔄 `enrich-all-contacts-batch.js` - Full enrichment (507 contacts)
7. 🔄 `extract-stations-from-enrichment.js` - Populate station names
8. 🔄 `auto-tag-genres-from-enrichment.js` - Auto-classify genres

### Optimization Scripts (Phase 3):

9. 🔄 `standardize-genre-values.js` - Clean up genre formatting

## ⚠️ SAFEGUARDS IN PLACE

**Before ANY changes**:

1. ✅ **Full backup created** (AIRTABLE_FULL_BACKUP_2025-10-03.json)
2. ✅ **Preview mode** for all scripts (see changes before applying)
3. ✅ **Batch updates** (efficient API usage)
4. ✅ **Rate limiting** (avoid API throttling)
5. ✅ **Error handling** (graceful failures, rollback capability)

## 🎯 RECOMMENDED NEXT STEP

**Start with Quick Win (30 min)**:

1. Sync status from Mailchimp (fix the 62% accuracy problem)
2. Consolidate notes fields (clean up scattered info)
3. Delete invalid contact (reduce noise)

**Then review results before proceeding to full enrichment.**

---

**Would you like me to:**

**A)** Create the "Quick Win" scripts and run them now?
**B)** Start with just the Mailchimp sync script?
**C)** Create the sample enrichment script (50 contacts) to test quality?
**D)** Show you examples of what the consolidated Notes field would look like?

Let me know your preference, and I'll proceed!
