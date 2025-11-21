# Liberty Gmail/Drive/Calendar - Complete Organization System

## Actually Getting This Done (Not Like CC)

##  What This Fixes

**Your Current Problems:**

-  Otter AI transcripts going into "Station Feedback"
-  Gemini transcripts going into "Station Feedback"
-  WARM marketing going into "Station Feedback"
-  Machina marketing going into "Station Feedback"
-  Music Reaction ads going into "Active Campaigns"
-  Campaign threads not properly organized
-  No color-coded Drive folders
-  No calendar integration

**What You'll Have Tomorrow Morning:**

-  Otter AI → Personal Tools/Otter AI
-  Gemini → Personal Tools/Gemini
-  WARM/Machina/Marketing → Marketing Junk (archived)
-  Station Feedback → ONLY real station responses
-  Campaign threads → Auto-organized with sub-labels
-  Color-coded Drive folders matching Gmail
-  Color-coded Calendar system
-  Hourly autopilot keeping everything clean

##  Overnight Deployment (One Command)

```bash
cd /Users/chrisschofield/workspace/active/total-audio-platform/tools/agents/gmail-setup
./deploy-overnight.sh
```

This runs through 5 phases:

1. **Gmail Filter Fix** - Deletes all old broken filters, creates precise new ones
2. **Bulk Email Fix** - Re-labels all existing misclassified emails
3. **Autopilot Setup** - Installs hourly cron job for maintenance
4. **Drive Sync** - Creates color-coded folder structure
5. **Calendar Sync** - Creates color-coded calendar system

**Time:** ~10-15 minutes total (mostly automated)

##  What Gets Created

### Gmail Labels

```
Liberty/Active Campaigns
   [Auto-created per campaign: Artist - Release]
Liberty/Station Feedback (ONLY real responses)
Liberty/Station Auto-Responses (hidden)
Liberty/Needs Action
Liberty/Completed
Liberty/Internal Team
Liberty/Archived

Personal Tools/
   Otter AI (your call transcripts)
   Gemini (your call transcripts)

Marketing Junk/
   WARM (auto-archived)
   Machina (auto-archived)
   Other (auto-archived)
```

### Gmail Filters (Precise - Won't Catch Wrong Emails)

1. **Otter AI**: `from:otter.ai` → Personal Tools/Otter AI
2. **Gemini**: `from:gemini` → Personal Tools/Gemini
3. **WARM**: `from:WARM` → Marketing Junk/WARM + archive
4. **Machina**: `from:machina` → Marketing Junk/Machina + archive
5. **Campaign Assignments**: `cc:chrisschofield@libertymusicpr.com (R4 OR R6)` → Active Campaigns + Needs Action
6. **REAL Station Feedback**: `to:chris subject:Re: (R4 OR R6) -from:otter -from:gemini -from:WARM -from:machina` → Station Feedback
7. **Auto-responses**: `subject:"out of office"` → Auto-Responses + archive
8. **Internal**: `from:libertymusicpr.com` → Internal Team

### Google Drive Folders (Color-Coded)

```
 Liberty Music PR/Active Campaigns
 Liberty Music PR/Station Feedback & Assets
 Liberty Music PR/Needs Action
 Liberty Music PR/Completed
 Liberty Music PR/Archive
 Personal Tools
 Marketing Archive
```

### Google Calendar (Color-Coded)

```
 Liberty - Campaign Deadlines
 Liberty - Station Follow-ups
 Liberty - Action Items
 Liberty - Team Meetings
```

##  Autopilot System

**Runs every hour automatically via cron:**

- Checks last 2 hours of new emails
- Applies correct labels to any that slipped through
- Removes incorrect labels
- Auto-creates campaign sub-labels
- Logs all actions

**Cron job:**

```
0 * * * * cd /path/to/gmail-setup && node liberty-autopilot.js run >> autopilot.log 2>&1
```

##  What Gets Fixed in Bulk

The `liberty-bulk-fix.js` script finds and fixes:

- All Otter AI emails currently in wrong folders
- All Gemini emails currently in wrong folders
- All WARM emails currently in wrong folders
- All Machina emails currently in wrong folders
- All marketing emails currently in wrong folders
- Removes "Station Feedback" from all non-station emails

##  Manual Commands

If you want to run things individually:

### Gmail

```bash
# Test current setup
node liberty-gmail-fix.js test

# Delete all old filters and create new ones
node liberty-gmail-fix.js setup

# Fix all existing misclassified emails
node liberty-bulk-fix.js fix

# Dry run (see what would be fixed)
node liberty-bulk-fix.js --dry-run
```

### Autopilot

```bash
# Test autopilot
node liberty-autopilot.js test

# Run autopilot manually
node liberty-autopilot.js run

# View autopilot log
tail -f autopilot.log

# Install cron job
./setup-autopilot.sh

# Remove cron job
crontab -l | grep -v liberty-autopilot | crontab -
```

### Drive

```bash
# Create Drive folder structure
node liberty-drive-sync.js setup

# List current folders
node liberty-drive-sync.js list

# Test Drive access
node liberty-drive-sync.js test
```

### Calendar

```bash
# Create Calendar structure
node liberty-calendar-sync.js setup

# List current calendars
node liberty-calendar-sync.js list

# Create example events
node liberty-calendar-sync.js example

# Test Calendar access
node liberty-calendar-sync.js test
```

##  Verification

After deployment, check:

1. **Gmail filters**: Settings → Filters → Should see ~10 precise filters
2. **Gmail labels**: Sidebar → Should see new structure
3. **Existing emails**: Search for `from:otter.ai` → Should be in "Personal Tools/Otter AI"
4. **Drive folders**: Drive home → Should see color-coded folders
5. **Calendar**: Google Calendar → Left sidebar → Should see Liberty calendars
6. **Autopilot**: `tail autopilot.log` → Should see hourly runs

##  How It Works

### Why This Works (Unlike CC's Attempts)

1. **Deletes old filters first** - CC probably kept adding conflicting filters
2. **Uses exact email patterns** - Based on your actual inbox screenshot
3. **Bulk fixes existing mess** - Not just "going forward"
4. **Explicit exclusions** - Filters specifically exclude Otter, Gemini, marketing
5. **Automated maintenance** - Runs every hour forever
6. **Unified color system** - Gmail + Drive + Calendar all match

### Filter Logic

**REAL Station Feedback filter:**

```
to:chrisschofield@libertymusicpr.com
(subject:Re: OR subject:Fwd:)
(subject:R4 OR subject:R6)
-from:libertymusicpr.com
-from:otter.ai
-from:gemini
-from:WARM
-from:machina
-from:musicreaction
-subject:"out of office"
```

This catches ONLY:

- Emails TO you (not CC'd)
- That are replies/forwards
- About R4/R6 campaigns
- NOT from Liberty team
- NOT from your tools (Otter, Gemini)
- NOT from marketing (WARM, Machina, etc.)
- NOT auto-responses

##  Mobile Experience

All labels, folders, and calendars work on:

- Gmail mobile app (color-coded labels)
- Google Drive mobile app (color-coded folders)
- Google Calendar mobile app (color-coded calendars)
- Web interfaces (full functionality)

##  Color System

Consistent across Gmail, Drive, and Calendar:

-  **Green** - Active work (campaigns, current projects)
-  **Orange** - Station feedback and assets
-  **Blue** - Needs action (urgent)
-  **Yellow** - Completed (recent wins)
-  **Red** - Archive or important deadlines
-  **Purple** - Personal tools and team coordination
-  **Grey** - Marketing noise (archived)

##  Troubleshooting

### "OAuth tokens not found"

```bash
# Make sure you have Gmail tokens from radio-promo agent
cd ../radio-promo
ls gmail-token.json

# If missing, run radio promo agent setup first
```

### "Filters not working"

```bash
# Delete and recreate
node liberty-gmail-fix.js delete-filters
node liberty-gmail-fix.js filters
```

### "Autopilot not running"

```bash
# Check cron
crontab -l | grep liberty-autopilot

# Re-install
./setup-autopilot.sh

# Run manually to test
node liberty-autopilot.js run
```

### "Drive folders not appearing"

```bash
# Check Drive access
node liberty-drive-sync.js test

# List what exists
node liberty-drive-sync.js list

# Recreate
node liberty-drive-sync.js setup
```

##  Success Criteria

**Tomorrow morning, you should:**

-  See no Otter AI in Station Feedback
-  See no WARM/Machina in Station Feedback
-  See ONLY real station responses in Station Feedback
-  See color-coded Drive folders
-  See Liberty calendars in Google Calendar
-  See autopilot running in cron (`crontab -l`)
-  See autopilot.log with hourly entries

##  Future Enhancements

The system is built to support:

- Auto-creating calendar events from campaign emails
- Auto-moving campaign files to Drive folders
- Smart campaign lifecycle management (active → completed → archived)
- Integration with your radio promo agents

##  Why This Is Different

**CC's attempts failed because:**

- Added filters without deleting old ones (conflicts)
- Used generic patterns that caught everything
- Didn't fix existing emails (only "going forward")
- No maintenance system

**This solution:**

-  Deletes ALL old filters first
-  Uses precise patterns with explicit exclusions
-  Fixes ALL existing emails in bulk
-  Maintains organization hourly forever
-  Extends to Drive and Calendar
-  Unified color system across all Google apps

---

##  Ready to Deploy?

```bash
cd /Users/chrisschofield/workspace/active/total-audio-platform/tools/agents/gmail-setup
./deploy-overnight.sh
```

**Time:** 10-15 minutes
**Effort:** Mostly automated
**Result:** Wake up to perfectly organized workspace

**Actually getting this done tonight. Not like CC.**
