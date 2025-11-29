# Airtable Optimization Plan - Liberty Music PR Contacts

## CURRENT PROBLEMS

Based on your feedback that "Airtable is still a real mess":

### 1. **Broken Mailchimp Integration**

- Originally connected to Total Audio Promo Mailchimp
- Campaign reply tracking doesn't work anymore
- Syncing issues between platforms

### 2. **Cluttered Fields**

- 27 total fields (too many!)
- Unclear which fields are actually used
- Old fields from abandoned workflows
- Confusing field names

### 3. **No Clear Organization**

- Hard to find specific contacts (BBC, high-priority, etc.)
- No views for different use cases
- Can't easily filter for campaigns

### 4. **Mixed Purposes**

- Started for Total Audio Promo (product marketing)
- Now used for Liberty Music PR (radio promotion)
- Confused data model

## OPTIMIZATION STRATEGY

### Phase 1: Simplify Field Structure (IMMEDIATE)

**Keep Only Essential Fields:**

#### Core Contact Info (8 fields) 

1. **Email**- Primary identifier
2. **First Name**- Contact first name
3. **Last Name**- Contact last name
4. **Station**- Radio station name
5. **Show**- Specific show name
6. **Contact Type**- Radio/Producer/Journalist
7. **Region / Country**- Location
8. **Created At**- Auto timestamp

#### Subscription & Status (3 fields) 

9. **Status**- Opted-In/Unsubscribed (synced from Mailchimp Liberty)
10. **Opt-in Source**- Where they subscribed (Mailchimp Landing Page, etc.)
11. **Last Email Date**- When last contacted

#### Genre & Targeting (1 field) 

12. **Genres**- Multiple select (Indie, Rock, Electronic, etc.)

#### AI Enrichment (3 fields) 

13. **Enrichment Quality**- High/Medium/Low (AI-powered)
14. **Enrichment Notes**- Station analysis, pitch strategy
15. **Last Enriched**- Enrichment timestamp

#### Notes & Context (1 field) 

16. **Notes**- All contact intelligence (consolidated)

**TOTAL: 16 Essential Fields**(down from 27)

---

### Fields to ARCHIVE/HIDE:

 **MC TAGS**- Old Mailchimp tags, not actively used
 **Reply Status**- Broken integration
 **Last Engagement**- Broken integration
 **Response Quality**- Not being tracked
 **Campaigns Contacted**- Redundant with Campaigns link
 **Assigned Freelancer**- Not using
 **Interactions**- Empty linked records
 **Campaigns**- Empty linked records
 **Test Mode**- Only 2 contacts, can delete
 **Description**- Already merged into Notes
 **Reply Notes**- Already merged into Notes

**Hide these 11 fields**→ Clean, focused interface

---

## Phase 2: Create Strategic Views

### View 1: **"Priority Contacts"**(BBC & High Quality)

**Filter**:

- Enrichment Quality = High
- OR Station contains "BBC"
- Status = Opted-In

**Sort**: Station (A→Z)

**Use Case**: Quick access to your most valuable contacts for major campaigns

---

### View 2: **"Subscribed - Ready to Pitch"**

**Filter**:

- Status = Opted-In
- Enrichment Quality = High OR Medium

**Sort**: Enrichment Quality (High → Medium)

**Use Case**: All contacts ready for active campaigns, sorted by quality

---

### View 3: **"Genre: Indie/Alternative"**

**Filter**:

- Genres contains "Indie" OR "Alternative"
- Status = Opted-In

**Sort**: Enrichment Quality (High → Low)

**Use Case**: KYARA campaign targeting (and similar indie artists)

---

### View 4: **"Genre: Rock/Metal"**

**Filter**:

- Genres contains "Rock" OR "Metal" OR "Punk"
- Status = Opted-In

**Sort**: Enrichment Quality (High → Low)

**Use Case**: Rock/metal campaigns (your bread & butter)

---

### View 5: **"UK Contacts Only"**

**Filter**:

- Station contains "BBC" OR Region/Country contains "UK" OR "LONDON" OR Email contains ".co.uk"
- Status = Opted-In

**Sort**: Enrichment Quality (High → Low)

**Use Case**: UK-focused campaigns

---

### View 6: **"International Stations"**

**Filter**:

- Region/Country NOT empty
- Region/Country NOT contains "UK"
- Status = Opted-In

**Sort**: Region/Country (A→Z)

**Use Case**: International campaigns (Australia, Canada, USA, etc.)

---

### View 7: **"Needs Review"**(Low Quality/Invalid)

**Filter**:

- Enrichment Quality = Low
- OR Status = empty
- OR Email = empty

**Sort**: Enrichment Quality (Low → empty)

**Use Case**: Cleanup and data quality improvements

---

### View 8: **"All Active Contacts"**(Default)

**Filter**:

- Status = Opted-In

**Sort**: Last Enriched (newest → oldest)

**Use Case**: General browse of all active contacts

---

## Phase 3: Fix Mailchimp Integration (DECISION NEEDED)

### Option 1: Connect to Liberty Music PR Mailchimp  (RECOMMENDED)

**Why**: This Airtable is clearly for radio promotion work, not Audio Intel product marketing

**Actions**:

- Keep syncing Status from Liberty Mailchimp (already doing this!)
- Remove "MC TAGS" field (old Total Audio Promo tags)
- Add "Liberty Mailchimp Tags" field (new, clean tags)
- Create automation to sync new contacts → Liberty Mailchimp

**Benefits**:

- Single source of truth for Liberty radio contacts
- Accurate subscription tracking
- Clean slate for tagging

---

### Option 2: Keep Separate from Mailchimp

**Why**: Airtable is research database, Mailchimp is sending platform

**Actions**:

- Use Airtable for contact research and intelligence
- Manually export to Mailchimp when ready to send
- Remove all Mailchimp integration fields

**Benefits**:

- Simplest approach
- No sync issues
- Full control over what gets added to Mailchimp

---

### Option 3: Connect to Total Audio Promo Mailchimp

**Why**: Original setup, might work if re-configured

**Problems**:

- This isn't being used for Audio Intel marketing
- Would confuse Liberty contacts with Total Audio contacts
- **Not recommended**

---

## Phase 4: Standardize Data Quality

### Auto-Populate Missing Station Names

**Script**: Extract from Enrichment Notes and update Station field

**Example**:

- `michelle.choudhry@bbc.co.uk` → Station: "BBC Radio 6 Music"
- `paul.mansell@marlowfm.co.uk` → Station: "Marlow FM"

**Impact**: 60 contacts with "Unknown" → Proper station names

---

### Auto-Tag Genres from Enrichment

**Script**: Parse Enrichment Notes for genre classifications

**Example**:

- BBC 6 Music contacts → Add "Indie, Alternative, Rock"
- Community stations → Add genres based on programming

**Impact**: 409 contacts without genres → Genre tags added

---

### Standardize Genre Values

**Clean up inconsistent formatting**:

- "R&B / Soul" → "R&B/Soul"
- "Jazz / Funk" → "Jazz/Funk"
- Remove duplicates

---

## Phase 5: Create Campaign Workflow (Optional)

If you want to track campaigns in Airtable:

### New Table: "Campaigns"

**Fields**:

- Campaign Name (e.g., "KYARA - Yearn Single")
- Artist Name
- Release Date
- Genre
- Priority (High/Medium/Low)
- Status (Planning/Active/Complete)

### Link Contacts → Campaigns

- Add "Campaigns Pitched" field (multiple record links)
- Track which contacts were pitched for each campaign
- See campaign history per contact

**But honestly**: This might be overkill. You could just use the "Notes" field to log campaign pitches.

---

## IMMEDIATE ACTIONS (Post-Enrichment)

### Step 1: Hide Unused Fields (5 minutes)

```
In Airtable UI:
1. Click "Hide fields" in any view
2. Hide these 11 fields:
   - MC TAGS
   - Reply Status
   - Last Engagement
   - Response Quality
   - Campaigns Contacted
   - Assigned Freelancer
   - Interactions
   - Campaigns
   - Test Mode
   - Description (now empty)
   - Reply Notes (now empty)
```

---

### Step 2: Create 8 Strategic Views (10 minutes)

**Use the filters I provided above**to create views for:

- Priority Contacts (BBC & High)
- Subscribed - Ready to Pitch
- Genre: Indie/Alternative
- Genre: Rock/Metal
- UK Contacts Only
- International Stations
- Needs Review
- All Active Contacts (default)

---

### Step 3: Auto-Populate Station Names (2 minutes)

**Run script**:

```bash
node extract-stations-from-enrichment.js
```

**Result**: 60 "Unknown" stations → Proper names

---

### Step 4: Auto-Tag Genres (2 minutes)

**Run script**:

```bash
node auto-tag-genres-from-enrichment.js
```

**Result**: 409 contacts without genres → Genre tags added

---

### Step 5: Clean Up Low Quality Contacts (Optional)

**Review "Needs Review" view**and decide:

- Delete obviously invalid contacts
- Mark questionable ones for later review
- Keep valuable contacts even if data is incomplete

---

## EXPECTED RESULT

### Before Optimization:

-  27 fields (overwhelming interface)
-  No views (hard to find contacts)
-  Broken Mailchimp integration
-  Mixed Total Audio Promo / Liberty data
-  Missing station names and genres
-  Hard to navigate

### After Optimization:

-  16 visible fields (clean, focused)
-  8 strategic views for different use cases
-  Synced to Liberty Mailchimp (clear purpose)
-  Pure Liberty Music PR contact database
-  Populated station names and genres
-  Easy to find BBC contacts, filter by genre, etc.

---

## RECOMMENDATION: Two-Phase Approach

### Phase A: Quick Wins (TODAY - 20 minutes)

1.  Finish AI enrichment (running now)
2. Hide 11 unused fields
3. Create 8 strategic views
4. Run station name extraction script
5. Run genre auto-tagging script

**Result**: Usable, organized Airtable base

---

### Phase B: Deep Cleanup (LATER - if needed)

1. Decide on Mailchimp integration approach
2. Archive old Total Audio Promo data
3. Create campaign tracking (if desired)
4. Review and delete low-quality contacts

**Result**: Production-perfect contact database

---

## MY RECOMMENDATION

**Start with Phase A (Quick Wins)**:

- Let enrichment finish (~5 more minutes)
- I'll create the scripts to extract stations and auto-tag genres
- You create the 8 views in Airtable UI (I can't do this via API)
- We hide the 11 unused fields

**Then decide**:

- Keep Airtable simple (research database only)
- OR add campaign tracking later if you need it

**What do you think?**Should I:

1. Create the station extraction and genre tagging scripts now?
2. Wait for enrichment to finish first?
3. Focus on a different optimization priority?

Let me know what's most important to you!
