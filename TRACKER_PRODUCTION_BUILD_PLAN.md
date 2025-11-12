# Campaign Tracker - PRODUCTION Integration Build Plan
**Target:** Thursday 19th November 2025 (7 days)
**Objective:** Working campaign management tool with REAL integrations (not demo)
**Campaigns:** KYARA, Senior Dunce, Concerta

---

## 🎯 PRODUCTION MINDSET SHIFT

**NOT a demo tool. A WORKING tool.**

You're building what Liberty will actually USE daily:
- Real Gmail threads linked to campaigns
- Real Mailchimp campaigns synced
- Real Monday.com boards updated
- Real Typeform submissions → campaign creation
- Real WARM reports uploaded → automatic play tracking
- Real Google Drive integration for asset storage
- Real Airtable contacts imported and synced
- Real Google Sheets for live client reporting
- Real Excel parsing and exports

**Demo is a byproduct. The tool is the product.**

---

## 🔗 INTEGRATION INVENTORY (What You Already Have)

### ✅ Gmail API Integration
**Location:** `tools/agents/gmail-setup/`
**Status:** Operational
**Capabilities:**
- Create drafts programmatically
- Send emails via API
- Track message IDs
- Monitor inbox for responses
- OAuth authenticated

**For Tracker:**
- Link campaign to Gmail thread/label
- Show "5 Gmail drafts created for KYARA" → click → opens actual Gmail drafts
- Track email status (sent, opened, replied)
- Auto-log email activities to timeline

### ✅ Mailchimp Integration
**Location:** Liberty agent Mailchimp config
**Status:** Operational
**Capabilities:**
- Create campaigns
- Send to audiences
- Track opens/clicks
- Sync contact lists

**For Tracker:**
- Link campaign to Mailchimp campaign ID
- Show "UK Mailchimp blast sent (20 contacts)" → click → opens Mailchimp dashboard
- Pull open rates, click rates automatically
- Display in campaign metrics

### ✅ Monday.com Integration
**Location:** Liberty agent Monday config
**Status:** Exists (needs verification)
**Capabilities:**
- Create boards
- Add items (contacts, tasks)
- Update statuses
- Track campaign progress

**For Tracker:**
- Create Monday board when campaign starts
- Push contact updates to Monday
- Sync statuses both ways (Tracker ↔ Monday)
- "View on Monday.com" button

### ✅ Typeform Integration
**Location:** Liberty agent Typeform integration
**Status:** Operational
**Capabilities:**
- Pull submission data
- Extract artist info
- Get asset URLs
- Campaign brief details

**For Tracker:**
- "Import from Typeform" button on campaign creation
- Auto-populate artist name, track, genre, budget
- Pull asset links (artwork, track, press photos)
- Store Typeform response ID for reference

### ✅ Google Drive Integration
**Location:** MCP servers / Google API setup
**Status:** OAuth configured
**Capabilities:**
- Upload files
- Create folders per campaign
- Share links
- Organize assets

**For Tracker:**
- Campaign folder auto-created in Drive
- Upload WARM reports to Drive → parse automatically
- Store PDFs, artwork, press assets
- "Open Drive Folder" button

### ✅ Airtable Integration
**Location:** Liberty agent Airtable config
**Status:** Operational (you built this!)
**Capabilities:**
- Read bases and tables
- Filter records by criteria
- Update records
- Sync data bi-directionally

**For Tracker:**
- Import contacts from Airtable bases
- Filter by genre/region
- Sync contact status back to Airtable
- Link campaigns to Airtable records

### ✅ Google Sheets Integration
**Location:** Google Sheets API setup
**Status:** Operational (you built this!)
**Capabilities:**
- Create spreadsheets
- Write data to sheets
- Format cells and charts
- Share with clients

**For Tracker:**
- Generate live client reports
- Auto-update sheets as campaign progresses
- Share read-only with clients
- Export formatted reports

### ✅ Excel Integration
**Location:** Excel parsing libraries
**Status:** Operational (you built this!)
**Capabilities:**
- Parse .xlsx files
- Read multiple sheets
- Extract data with formulas
- Generate Excel exports

**For Tracker:**
- Parse WARM Excel reports
- Handle multi-sheet reports
- Export campaign data as Excel
- Generate formatted Excel reports

### 🆕 WARM Report Parser (ENHANCED)
**Need to Build:**
- Upload CSV/Excel WARM report
- Parse play data (station, date, show)
- Auto-create campaign_activities entries
- Update metrics (total plays, countries, stations)
- Handle Excel multi-sheet format

---

## 📊 REVISED DATABASE SCHEMA (Integration-First)

### campaigns table (UPDATED)
```sql
CREATE TABLE campaigns (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL,

  -- Campaign Info (can auto-populate from Typeform)
  artist_name TEXT NOT NULL,
  track_name TEXT NOT NULL,
  genre TEXT,
  release_date DATE,
  budget TEXT,
  campaign_angle TEXT,
  region TEXT,

  -- Integration IDs (CRITICAL)
  typeform_response_id TEXT, -- Link to Typeform submission
  gmail_label TEXT, -- Gmail label for filtering emails
  mailchimp_campaign_id TEXT, -- Link to Mailchimp campaign
  monday_board_id TEXT, -- Link to Monday.com board
  drive_folder_id TEXT, -- Google Drive folder for assets
  airtable_base_id TEXT, -- Airtable base for contacts
  airtable_table_id TEXT, -- Airtable table name
  sheets_report_id TEXT, -- Google Sheet ID for live client report
  excel_export_path TEXT, -- Drive path to Excel exports

  -- Status
  status TEXT DEFAULT 'active', -- active, completed, paused

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### campaign_contacts table (UPDATED)
```sql
CREATE TABLE campaign_contacts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE,

  -- Contact Info
  contact_name TEXT NOT NULL,
  contact_email TEXT,
  outlet TEXT,
  contact_type TEXT, -- National, Commercial, Community, Online
  priority TEXT DEFAULT 'medium',

  -- Status & Tracking
  status TEXT DEFAULT 'pending', -- pending, contacted, responded, confirmed, declined
  assigned_to TEXT, -- Liberty team member
  last_contacted TIMESTAMPTZ,

  -- Integration Data
  gmail_thread_id TEXT, -- Link to Gmail conversation
  gmail_message_ids TEXT[], -- Array of message IDs
  mailchimp_subscriber_id TEXT, -- Link to Mailchimp subscriber
  monday_item_id TEXT, -- Link to Monday.com item
  airtable_record_id TEXT, -- Link to Airtable contact record
  synced_to_airtable BOOLEAN DEFAULT FALSE, -- Track sync status

  -- Intelligence (from Audio Intel)
  intelligence JSONB, -- Show times, genres, submission guidelines

  -- Notes
  notes TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### campaign_activities table (UPDATED)
```sql
CREATE TABLE campaign_activities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE,
  contact_id UUID REFERENCES campaign_contacts(id) ON DELETE SET NULL,

  -- Activity Info
  user_id TEXT NOT NULL,
  user_name TEXT,
  user_location TEXT, -- Brighton, LA, London
  activity_type TEXT NOT NULL, -- gmail_sent, mailchimp_sent, warm_play, response_received, milestone
  description TEXT NOT NULL,
  notes TEXT,

  -- Integration References
  integration_source TEXT, -- gmail, mailchimp, warm_api, monday, manual
  integration_id TEXT, -- Message ID, campaign ID, play ID, etc.

  -- Metadata
  metadata JSONB, -- Additional context
  timestamp TIMESTAMPTZ DEFAULT NOW()
);
```

### campaign_metrics table (UPDATED)
```sql
CREATE TABLE campaign_metrics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE,

  -- Metric Info
  metric_type TEXT NOT NULL, -- plays, emails_sent, email_opens, email_clicks, responses, confirmations
  value INTEGER NOT NULL,

  -- Source Tracking
  source TEXT NOT NULL, -- warm_report, gmail_api, mailchimp_api, manual
  source_file_id TEXT, -- Drive file ID if from uploaded WARM report

  -- Timestamp
  recorded_at TIMESTAMPTZ DEFAULT NOW()
);
```

### warm_reports table (NEW)
```sql
CREATE TABLE warm_reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE,

  -- File Info
  filename TEXT NOT NULL,
  drive_file_id TEXT, -- Google Drive ID
  upload_date TIMESTAMPTZ DEFAULT NOW(),

  -- Parsed Data Summary
  total_plays INTEGER,
  stations_count INTEGER,
  countries_count INTEGER,
  date_range_start DATE,
  date_range_end DATE,

  -- Status
  parsed BOOLEAN DEFAULT FALSE,
  parse_error TEXT
);
```

---

## 🚀 REVISED 24-HOUR BUILD PLAN (Integration-First)

### PHASE 1: Integration Setup & Database (Hours 1-4)

#### Hour 1: Database Schema with Integrations
**Tasks:**
1. Create migration: `apps/tracker/supabase/migrations/20251119_tracker_integrations.sql`
2. Run migration to create tables
3. Create TypeScript types: `apps/tracker/lib/db/types.ts`
4. Test schema with sample data

**SQL to Run:**
```sql
-- Run all table creation from schema above
-- Enable RLS
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaign_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaign_activities ENABLE ROW LEVEL SECURITY;

-- Create policies (allow authenticated users to access their own campaigns)
CREATE POLICY "Users can view their own campaigns" ON campaigns
  FOR SELECT USING (auth.uid()::text = user_id);
```

#### Hour 2: Gmail Integration Setup
**Tasks:**
1. Create Gmail API wrapper: `apps/tracker/lib/integrations/gmail.ts`
2. Functions:
   - `linkCampaignToGmail(campaignId, labelName)` - Create/link Gmail label
   - `getGmailThreadsForCampaign(campaignId)` - Fetch threads with label
   - `trackGmailActivity(messageId, contactId)` - Log email to timeline
   - `createDraftForContact(contactId, template)` - Create Gmail draft

**Example:**
```typescript
// apps/tracker/lib/integrations/gmail.ts
import { google } from 'googleapis';

export async function linkCampaignToGmail(campaignId: string, artistName: string) {
  const gmail = google.gmail({ version: 'v1', auth: getOAuthClient() });

  // Create label if doesn't exist
  const labelName = `Campaign: ${artistName}`;
  const label = await gmail.users.labels.create({
    userId: 'me',
    requestBody: {
      name: labelName,
      labelListVisibility: 'labelShow',
      messageListVisibility: 'show'
    }
  });

  // Store label in campaign
  await supabase
    .from('campaigns')
    .update({ gmail_label: labelName })
    .eq('id', campaignId);

  return label.data;
}

export async function getGmailThreadsForCampaign(campaignId: string) {
  const { data: campaign } = await supabase
    .from('campaigns')
    .select('gmail_label')
    .eq('id', campaignId)
    .single();

  const gmail = google.gmail({ version: 'v1', auth: getOAuthClient() });

  const threads = await gmail.users.threads.list({
    userId: 'me',
    labelIds: [getLabelId(campaign.gmail_label)]
  });

  return threads.data;
}
```

#### Hour 3: Mailchimp Integration Setup
**Tasks:**
1. Create Mailchimp API wrapper: `apps/tracker/lib/integrations/mailchimp.ts`
2. Functions:
   - `linkCampaignToMailchimp(campaignId, mailchimpCampaignId)` - Link existing campaign
   - `createMailchimpCampaign(campaignId, audienceId)` - Create new campaign
   - `getMailchimpStats(campaignId)` - Pull opens, clicks, sends
   - `trackMailchimpActivity(campaignId)` - Log to timeline

**Example:**
```typescript
// apps/tracker/lib/integrations/mailchimp.ts
import Mailchimp from '@mailchimp/mailchimp_marketing';

export async function getMailchimpStats(campaignId: string) {
  const { data: campaign } = await supabase
    .from('campaigns')
    .select('mailchimp_campaign_id')
    .eq('id', campaignId)
    .single();

  const response = await Mailchimp.reports.getCampaignReport(
    campaign.mailchimp_campaign_id
  );

  return {
    emails_sent: response.emails_sent,
    opens: response.opens.unique_opens,
    clicks: response.clicks.unique_clicks,
    open_rate: response.opens.open_rate,
    click_rate: response.clicks.click_rate
  };
}
```

#### Hour 4: Monday.com, Typeform, Airtable, Sheets Integration Setup
**Tasks:**
1. Create Monday.com wrapper: `apps/tracker/lib/integrations/monday.ts`
   - `createMondayBoard(campaignId)` - Create board
   - `syncContactToMonday(contactId)` - Add contact as item
   - `updateMondayStatus(contactId, status)` - Update status

2. Create Typeform wrapper: `apps/tracker/lib/integrations/typeform.ts`
   - `fetchTypeformResponse(responseId)` - Get submission data
   - `importCampaignFromTypeform(responseId)` - Auto-create campaign
   - `parseTypeformAssets(responseId)` - Extract URLs

3. Create Airtable wrapper: `apps/tracker/lib/integrations/airtable.ts`
   - `importContactsFromAirtable(baseId, tableId, filters)` - Import filtered contacts
   - `syncContactToAirtable(contactId)` - Update Airtable record
   - `linkCampaignToAirtable(campaignId, baseId)` - Link campaign

4. Create Google Sheets wrapper: `apps/tracker/lib/integrations/google-sheets.ts`
   - `createLiveSheetReport(campaignId)` - Create client report sheet
   - `updateSheetMetrics(campaignId)` - Update metrics in real-time
   - `shareSheetWithClient(sheetId, clientEmail)` - Share read-only

**Example Typeform Import:**
```typescript
// apps/tracker/lib/integrations/typeform.ts
export async function importCampaignFromTypeform(responseId: string) {
  const form = await fetch(`https://api.typeform.com/forms/${FORM_ID}/responses?included_response_ids=${responseId}`, {
    headers: { Authorization: `Bearer ${TYPEFORM_TOKEN}` }
  });

  const data = await form.json();
  const answers = data.items[0].answers;

  // Map Typeform fields to campaign data
  const campaignData = {
    artist_name: getAnswer(answers, 'artist_name'),
    track_name: getAnswer(answers, 'track_name'),
    genre: getAnswer(answers, 'genre'),
    budget: getAnswer(answers, 'budget'),
    release_date: getAnswer(answers, 'release_date'),
    typeform_response_id: responseId
  };

  // Create campaign in Supabase
  const { data: campaign } = await supabase
    .from('campaigns')
    .insert(campaignData)
    .select()
    .single();

  return campaign;
}
```

---

### PHASE 2: WARM Report Upload & Parser (Hours 5-8)

#### Hour 5-6: WARM Report Uploader UI
**Tasks:**
1. Create upload component: `apps/tracker/app/components/WARMReportUploader.tsx`
2. Support drag-and-drop CSV/Excel files
3. Upload to Google Drive (campaign folder)
4. Store metadata in `warm_reports` table

**Component:**
```tsx
// apps/tracker/app/components/WARMReportUploader.tsx
'use client';

import { useState } from 'react';
import { uploadToGoogleDrive } from '@/lib/integrations/google-drive';

export function WARMReportUploader({ campaignId }: { campaignId: string }) {
  const [uploading, setUploading] = useState(false);

  async function handleFileUpload(file: File) {
    setUploading(true);

    // Upload to Google Drive
    const driveFile = await uploadToGoogleDrive(file, campaignId);

    // Store in database
    const { data: report } = await supabase
      .from('warm_reports')
      .insert({
        campaign_id: campaignId,
        filename: file.name,
        drive_file_id: driveFile.id,
        parsed: false
      })
      .select()
      .single();

    // Trigger parsing
    await fetch(`/api/warm-reports/${report.id}/parse`, { method: 'POST' });

    setUploading(false);
  }

  return (
    <div className="border-4 border-black border-dashed p-8">
      <input
        type="file"
        accept=".csv,.xlsx,.xls"
        onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
      />
      {uploading && <p>Uploading and parsing WARM report...</p>}
    </div>
  );
}
```

#### Hour 7-8: WARM Report Parser (CSV + Excel)
**Tasks:**
1. Create parser API: `apps/tracker/app/api/warm-reports/[id]/parse/route.ts`
2. Parse CSV/Excel:
   - Detect file format (.csv or .xlsx)
   - Handle Excel multi-sheet workbooks
   - Extract play data (station, date, show, country)
   - Create `campaign_activities` entries for each play
   - Update `campaign_metrics` (total plays, countries, stations)
3. Handle different WARM formats (CSV single-sheet, Excel multi-sheet)

**Parser Logic:**
```typescript
// apps/tracker/app/api/warm-reports/[id]/parse/route.ts
import { parse } from 'csv-parse/sync';
import { read, utils } from 'xlsx';

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const { data: report } = await supabase
    .from('warm_reports')
    .select('*, campaigns!inner(*)')
    .eq('id', params.id)
    .single();

  // Download from Google Drive
  const fileContent = await downloadFromGoogleDrive(report.drive_file_id);

  let plays: any[] = [];

  // Detect format and parse accordingly
  if (report.filename.endsWith('.csv')) {
    // Parse CSV
    const records = parse(fileContent, {
      columns: true,
      skip_empty_lines: true
    });
    plays = records;
  } else if (report.filename.endsWith('.xlsx') || report.filename.endsWith('.xls')) {
    // Parse Excel (handle multi-sheet workbooks)
    const workbook = read(fileContent);
    const playDataSheet = workbook.Sheets['Play Data'] || workbook.Sheets[workbook.SheetNames[0]];
    plays = utils.sheet_to_json(playDataSheet);
  }

  // Normalize play data (handle various column names)
  const normalizedPlays = plays.map(row => ({
    station: row.Station || row.station || row['Station Name'],
    date: parseDate(row.Date || row.date || row['Play Date']),
    show: row.Show || row.show || row.Programme || row['Show Name'],
    country: row.Country || row.country || row.Territory,
    time: row.Time || row.time || row['Play Time']
  }));

  // Create activities for each play
  for (const play of plays) {
    await supabase
      .from('campaign_activities')
      .insert({
        campaign_id: report.campaign_id,
        user_id: 'warm-api',
        user_name: 'WARM API',
        user_location: 'Automated',
        activity_type: 'play_confirmed',
        description: `${play.station} played "${report.campaigns.track_name}" on ${play.show || 'unknown show'}`,
        integration_source: 'warm_report',
        integration_id: report.id,
        metadata: play,
        timestamp: play.date
      });
  }

  // Update metrics
  const uniqueStations = new Set(plays.map(p => p.station)).size;
  const uniqueCountries = new Set(plays.map(p => p.country)).size;

  await supabase.from('campaign_metrics').insert({
    campaign_id: report.campaign_id,
    metric_type: 'plays',
    value: plays.length,
    source: 'warm_report',
    source_file_id: report.drive_file_id
  });

  // Mark as parsed
  await supabase
    .from('warm_reports')
    .update({
      parsed: true,
      total_plays: plays.length,
      stations_count: uniqueStations,
      countries_count: uniqueCountries
    })
    .eq('id', params.id);

  return Response.json({ success: true, plays: plays.length });
}
```

---

### PHASE 3: Dashboard with Real Integrations (Hours 9-14)

#### Hour 9-10: Campaign Creation from Typeform + Airtable
**Tasks:**
1. Create campaign creation page: `apps/tracker/app/campaigns/new/page.tsx`
2. Add "Import from Typeform" button
3. Add "Import Contacts from Airtable" button
4. Show Typeform response selector
5. Show Airtable base/table selector
6. Auto-populate form fields
7. Create campaign with all integration links

**Flow:**
```
User clicks "New Campaign"
  ↓
Page shows three options:
  1. "Import from Typeform Response" (button)
  2. "Import Contacts from Airtable" (button)
  3. "Create Manually" (form)
  ↓
User clicks "Import from Typeform"
  ↓
Fetch recent Typeform submissions
  ↓
User selects: "KYARA - Bloodshot (submitted 3 days ago)"
  ↓
Auto-populate:
  - Artist: KYARA
  - Track: Bloodshot
  - Genre: Electro-pop
  - Budget: £2,500
  - Release Date: 14 Oct 2025
  - Assets: [links from Typeform]
  ↓
User clicks "Import Contacts from Airtable"
  ↓
Select base: "Liberty Radio Contacts"
  ↓
Filter: Genre = "Electronic", Region = "Australia"
  ↓
Returns: 47 contacts → user selects 15
  ↓
User clicks "Create Campaign"
  ↓
System:
  1. Creates campaign in Supabase
  2. Creates Gmail label: "Campaign: KYARA"
  3. Creates Google Drive folder: "KYARA - Bloodshot"
  4. Creates Monday.com board (optional)
  5. Creates Google Sheet client report (live)
  6. Links Typeform response ID
  7. Links Airtable base/table
  8. Imports 15 contacts from Airtable
  ↓
Campaign created → redirect to dashboard
```

#### Hour 11-12: Dashboard with Integration Indicators
**Tasks:**
1. Build dashboard: `apps/tracker/app/dashboard/page.tsx`
2. Campaign cards show integration status:
   - ✅ Gmail connected (5 threads)
   - ✅ Mailchimp connected (campaign sent)
   - ✅ Monday.com synced
   - ✅ Drive folder active
   - ⏳ WARM report pending

**Campaign Card:**
```tsx
<CampaignCard campaign={kyara}>
  <CampaignHeader>
    <h3>{campaign.artist_name} - {campaign.track_name}</h3>
    <StatusBadge status={campaign.status} />
  </CampaignHeader>

  <QuickStats>
    <Stat label="Contacts" value={15} />
    <Stat label="Plays" value={85} source="WARM Report" />
    <Stat label="Confirmations" value={3} />
  </QuickStats>

  <IntegrationBadges>
    <Badge icon={<Mail />} status="active" tooltip="5 Gmail threads" />
    <Badge icon={<Send />} status="active" tooltip="Mailchimp sent" />
    <Badge icon={<Folder />} status="active" tooltip="Drive folder" />
    <Badge icon={<Trello />} status="active" tooltip="Monday.com board" />
    <Badge icon={<Database />} status="active" tooltip="Airtable synced" />
    <Badge icon={<FileSpreadsheet />} status="active" tooltip="Live Google Sheet" />
  </IntegrationBadges>

  <RecentActivity>
    {campaign.recent_activities.slice(0, 3).map(activity => (
      <ActivityItem key={activity.id}>
        {activity.description}
        {activity.integration_source && (
          <IntegrationLink source={activity.integration_source} id={activity.integration_id} />
        )}
      </ActivityItem>
    ))}
  </RecentActivity>
</CampaignCard>
```

#### Hour 13-14: Campaign Detail with Integration Links
**Tasks:**
1. Build campaign detail: `apps/tracker/app/campaigns/[id]/page.tsx`
2. Add integration action buttons:
   - "Open Gmail Threads" → opens Gmail filtered to campaign label
   - "View Mailchimp Campaign" → opens Mailchimp dashboard
   - "Open Drive Folder" → opens Google Drive folder
   - "View Monday Board" → opens Monday.com board
   - "Upload WARM Report" → upload component

**Layout:**
```tsx
<CampaignDetail campaign={kyara}>
  <CampaignHeader>
    <BackButton />
    <CampaignTitle />
    <IntegrationActions>
      <Button onClick={() => openGmail(campaign.gmail_label)}>
        <Mail /> Open Gmail
      </Button>
      <Button onClick={() => openMailchimp(campaign.mailchimp_campaign_id)}>
        <Send /> View Mailchimp
      </Button>
      <Button onClick={() => openDrive(campaign.drive_folder_id)}>
        <Folder /> Open Drive
      </Button>
      <Button onClick={() => openMonday(campaign.monday_board_id)}>
        <Trello /> View Monday
      </Button>
      <Button onClick={() => openAirtable(campaign.airtable_base_id, campaign.airtable_table_id)}>
        <Database /> View Airtable
      </Button>
      <Button onClick={() => openSheets(campaign.sheets_report_id)}>
        <FileSpreadsheet /> Open Live Report
      </Button>
      <Button onClick={() => exportToExcel(campaign.id)}>
        <Download /> Export Excel
      </Button>
    </IntegrationActions>
  </CampaignHeader>

  <TwoColumn>
    <LeftColumn>
      <ActivityTimeline activities={activities}>
        {activities.map(activity => (
          <ActivityItem key={activity.id}>
            <ActivityIcon type={activity.activity_type} />
            <ActivityDescription>{activity.description}</ActivityDescription>
            {activity.integration_source === 'gmail' && (
              <Link href={getGmailThreadUrl(activity.integration_id)}>
                View Email
              </Link>
            )}
            {activity.integration_source === 'warm_report' && (
              <Badge>WARM Play #{activity.metadata.play_number}</Badge>
            )}
          </ActivityItem>
        ))}
      </ActivityTimeline>

      <WARMReportUploader campaignId={campaign.id} />
    </LeftColumn>

    <RightColumn>
      <MetricsOverview>
        <MetricCard label="Total Plays" value={85} source="WARM Report (uploaded 2 days ago)" />
        <MetricCard label="Email Sends" value={15} source="Gmail API" />
        <MetricCard label="Email Opens" value={9} source="Mailchimp (60%)" />
        <MetricCard label="Confirmations" value={3} />
      </MetricsOverview>

      <ContactGrid contacts={contacts}>
        {contacts.map(contact => (
          <ContactCard key={contact.id}>
            <ContactName>{contact.contact_name}</ContactName>
            <ContactOutlet>{contact.outlet}</ContactOutlet>
            <ContactStatus status={contact.status} />
            {contact.gmail_thread_id && (
              <Button size="sm" onClick={() => openGmailThread(contact.gmail_thread_id)}>
                View Email Thread
              </Button>
            )}
          </ContactCard>
        ))}
      </ContactGrid>
    </RightColumn>
  </TwoColumn>
</CampaignDetail>
```

---

### PHASE 4: Real-Time Activity Logging (Hours 15-18)

#### Hour 15-16: Gmail Activity Auto-Logger
**Tasks:**
1. Create Gmail webhook handler: `apps/tracker/app/api/gmail/webhook/route.ts`
2. When email sent via Gmail API → log to timeline
3. When response received → update contact status + log activity
4. Link email to campaign via label

**Flow:**
```
User sends email to Jack Saunders via Gmail
  ↓
Gmail API call includes campaign label
  ↓
Webhook triggered: "Email sent"
  ↓
System:
  1. Creates campaign_activity:
     - Type: gmail_sent
     - Description: "Emailed Jack Saunders (BBC Radio 1)"
     - integration_id: message_id
  2. Updates contact:
     - status: contacted
     - last_contacted: NOW()
     - gmail_message_ids: append message_id
  ↓
Timeline updates in real-time (Supabase Realtime)
  ↓
Dashboard shows: "Chris sent email to Jack Saunders - 2 minutes ago"
```

**API Route:**
```typescript
// apps/tracker/app/api/gmail/log-activity/route.ts
export async function POST(req: Request) {
  const { messageId, contactId, campaignId, action } = await req.json();

  // Get email details from Gmail API
  const gmail = google.gmail({ version: 'v1', auth: getOAuthClient() });
  const message = await gmail.users.messages.get({
    userId: 'me',
    id: messageId
  });

  // Extract contact name from email
  const to = message.data.payload?.headers?.find(h => h.name === 'To')?.value;

  // Log activity
  await supabase
    .from('campaign_activities')
    .insert({
      campaign_id: campaignId,
      contact_id: contactId,
      user_id: 'current-user-id',
      user_name: 'Chris',
      user_location: 'Brighton',
      activity_type: 'gmail_sent',
      description: `Emailed ${to} via Gmail`,
      integration_source: 'gmail',
      integration_id: messageId,
      metadata: {
        subject: message.data.payload?.headers?.find(h => h.name === 'Subject')?.value,
        thread_id: message.data.threadId
      }
    });

  // Update contact
  await supabase
    .from('campaign_contacts')
    .update({
      status: 'contacted',
      last_contacted: new Date().toISOString(),
      gmail_thread_id: message.data.threadId,
      gmail_message_ids: supabase.rpc('array_append', {
        arr: 'gmail_message_ids',
        elem: messageId
      })
    })
    .eq('id', contactId);

  return Response.json({ success: true });
}
```

#### Hour 17-18: Mailchimp Activity Auto-Logger
**Tasks:**
1. Create Mailchimp webhook handler: `apps/tracker/app/api/mailchimp/webhook/route.ts`
2. When campaign sent → log to timeline
3. Pull stats periodically → update metrics
4. Track individual contact opens/clicks

**Webhook Events:**
- `campaign_sent` → log "Mailchimp campaign sent (20 contacts)"
- `opened` → log "Jack Saunders opened email"
- `clicked` → log "Jack Saunders clicked link"

---

### PHASE 5: Import Real Campaign Data (Hours 19-20)

#### Hour 19-20: Import KYARA, Senior Dunce, Concerta
**Tasks:**
1. Create import script: `apps/tracker/scripts/import-liberty-campaigns.ts`
2. For each campaign:
   - Create campaign record with integration IDs
   - Import contacts from existing data
   - Import historical activities (Gmail, Mailchimp, WARM)
   - Upload existing WARM reports
   - Parse and process

**KYARA Import Example:**
```typescript
// Import KYARA campaign
const kyara = await supabase.from('campaigns').insert({
  user_id: 'liberty-user-id',
  artist_name: 'KYARA',
  track_name: 'Bloodshot',
  genre: 'Electro-pop / Electronic',
  release_date: '2025-10-14',
  budget: '£2,500',
  region: 'Australia + UK',
  campaign_angle: 'Sydney electronic artist with Triple J history',
  status: 'completed',
  // Integration IDs from existing Liberty systems
  gmail_label: 'Campaign: KYARA',
  typeform_response_id: 'KYARA_RESPONSE_ID', // from Liberty Typeform
  drive_folder_id: 'KYARA_DRIVE_FOLDER_ID'
}).select().single();

// Import contacts
const contacts = [
  { name: 'Anika Luna', outlet: 'Triple J Home & Hosed', type: 'National', status: 'contacted', gmail_thread_id: 'thread_anika_luna' },
  { name: 'Claire Mooney', outlet: 'Triple J Music Director', type: 'National', status: 'contacted' },
  { name: 'Amazing Radio', outlet: 'Amazing Radio UK', type: 'Online', status: 'confirmed' },
  // ... 12 more
];

for (const contact of contacts) {
  await supabase.from('campaign_contacts').insert({
    campaign_id: kyara.data.id,
    ...contact
  });
}

// Import historical activities
const activities = [
  { date: '2025-10-07', type: 'gmail_sent', description: 'Initial Australian pitch (15 emails sent)' },
  { date: '2025-10-09', type: 'milestone', description: 'Amazing Radio (UK) confirmed support' },
  { date: '2025-10-10', type: 'warm_play', description: 'WARM report: 85 plays across 9 countries' },
  // ... more
];

for (const activity of activities) {
  await supabase.from('campaign_activities').insert({
    campaign_id: kyara.data.id,
    timestamp: activity.date,
    activity_type: activity.type,
    description: activity.description,
    user_name: 'Chris',
    user_location: 'Brighton'
  });
}

// Upload existing WARM report if available
const warmReportFile = await readFile('/path/to/kyara-warm-report.csv');
// ... upload and parse
```

---

### PHASE 6: Demo Polish & Liberty Agent Integration (Hours 21-24)

#### Hour 21-22: Liberty Agent Integration UI
**Tasks:**
1. Create "Invoke Agent" modal: `apps/tracker/app/components/InvokeAgentModal.tsx`
2. Show agent capabilities:
   - "Generate campaign strategy"
   - "Suggest next contacts to prioritize"
   - "Check for new WARM plays"
   - "Draft follow-up emails"
   - "Update Monday.com board"
3. Show streaming agent response
4. Execute agent actions (create Gmail drafts, update Monday, etc.)

**Agent Modal:**
```tsx
<InvokeAgentModal campaign={kyara}>
  <AgentCapabilities>
    <Capability
      name="Generate Campaign Strategy"
      description="AI analyzes contact list, response rates, and suggests next steps"
      onClick={() => invokeAgent('strategy')}
    />
    <Capability
      name="Draft Follow-up Emails"
      description="Generate personalized follow-ups for non-responders"
      onClick={() => invokeAgent('follow-ups')}
    />
    <Capability
      name="Check WARM API"
      description="Pull latest play data from WARM API"
      onClick={() => invokeAgent('warm-check')}
    />
  </AgentCapabilities>

  {agentThinking && (
    <AgentThinkingDisplay>
      <Spinner /> Agent is thinking...
      <ExtendedThinkingBudget used={2500} total={5000} />
    </AgentThinkingDisplay>
  )}

  {agentResponse && (
    <AgentResponse>
      <StreamingText content={agentResponse} />
      {agentActions.length > 0 && (
        <AgentActions>
          {agentActions.map(action => (
            <ActionButton key={action.id} onClick={() => executeAction(action)}>
              {action.description}
            </ActionButton>
          ))}
        </AgentActions>
      )}
    </AgentResponse>
  )}
</InvokeAgentModal>
```

**Agent Integration:**
```typescript
import { LibertyRadioPromoAgent } from '@/agents/radio-promo/LibertyRadioPromoAgent';

async function invokeAgent(action: string, campaignId: string) {
  const campaign = await getCampaignData(campaignId);
  const agent = new LibertyRadioPromoAgent(mondayApi, gmailApi, warmApi);

  agent.on('progress', (event) => {
    setAgentProgress(event.delta);
  });

  if (action === 'strategy') {
    const strategy = await agent.generateCampaignStrategy(campaign);
    return strategy;
  }

  if (action === 'follow-ups') {
    const result = await agent.executeAgenticLoop(
      `Generate follow-up emails for KYARA campaign contacts who haven't responded yet`,
      { maxIterations: 10 }
    );
    return result;
  }

  if (action === 'warm-check') {
    const plays = await agent.checkWarmPlays({
      artist_name: campaign.artist_name,
      track_name: campaign.track_name,
      days_back: 7
    });
    return plays;
  }
}
```

#### Hour 23: Full End-to-End Test
**Tasks:**
1. Test complete workflow:
   - Import campaign from Typeform
   - Link Gmail, Mailchimp, Drive
   - Upload WARM report → auto-parse
   - Send email via Gmail → auto-log to timeline
   - Invoke Liberty Agent → generate strategy
   - Export PDF report
2. Test on real KYARA data
3. Record screen demo

#### Hour 24: Final Polish & Bug Fixes
**Tasks:**
1. Fix any issues from Hour 23
2. Polish UI (animations, loading states, error handling)
3. Add tooltips and help text
4. Test mobile responsiveness
5. Create demo backup screenshots
6. Prepare talking points

---

## 🎬 DEMO SCRIPT (Production Version)

### Opening (1 minute):

"Right, this isn't a demo - this is the actual tool I'm using to manage Liberty campaigns right now. These are three real campaigns: KYARA 'Bloodshot', Senior Dunce 'Bestial', Concerta 'Consumption'. All connected to our actual Gmail, Mailchimp, Monday.com, and Google Drive. Real data, real integrations, real time savings."

### KYARA Campaign Walkthrough (3 minutes):

**Dashboard:**
"KYARA campaign - you can see it's connected to Gmail (5 threads), Mailchimp (campaign sent), Monday board, and Drive folder. 85 plays from the WARM report I uploaded 2 days ago, which it parsed automatically."

**Click into KYARA:**
"Activity timeline - every email, every WARM play, every milestone. 7th October, sent 15 emails via Gmail - click this [click] opens the actual Gmail thread with Anika Luna. 9th October, Amazing Radio confirmed - that's in Monday.com too [click Monday button]. 10th October, uploaded WARM report [show upload area], system parsed it, found 85 plays across 9 countries, auto-logged every single play to the timeline."

**Integration Showcase:**
"[Click 'Open Gmail'] - filters to 'Campaign: KYARA' label, shows all emails for this campaign. [Click 'Open Drive Folder'] - all the assets, WARM reports, press photos, artwork. [Click 'View Mailchimp'] - the UK email blast we sent, 60% open rate, 26% click rate, pulled automatically."

### Liberty Agent Integration (2 minutes):

**Invoke Agent:**
"[Click 'Invoke Agent'] Let me ask it to generate a strategy for next week. [Agent thinks] Watch it analyze the contact list, response rates, WARM plays. [Streaming response appears]

'Recommend following up with Anika Luna at Triple J - she's a warm lead, played the previous single. Prioritize BBC Radio 6 Music - strong genre fit for electronic. Danny Howard shows 0 engagement - deprioritize for now. Consider expanding to community stations - 85% response rate vs 45% from national.'"

**Execute Agent Action:**
"[Agent suggests] 'Create follow-up Gmail drafts for 3 warm leads.' [Click Execute] Agent creates 3 personalized Gmail drafts, links them to the campaign, logs it to the timeline. Done in 30 seconds."

### WARM Report Upload Demo (1 minute):

**Upload New Report:**
"Let me upload another WARM report. [Drag CSV file] Uploading to Google Drive, parsing plays. [5 seconds later] Done. Found 12 new plays, 2 new stations, updated the timeline automatically. No manual data entry, no spreadsheet copy-paste."

### Multi-Campaign Coordination (1 minute):

"[Tab to Senior Dunce] UK campaign, different strategy. [Tab to Concerta] Korean artist, 132 contacts ready. All three campaigns, all the data, all the integrations, in one place. Dan, imagine all 20+ Liberty campaigns here. Sam in Brighton logs an email - it appears instantly for your LA freelancer. No more 'who contacted who' chaos."

### The Hook (1 minute):

"This isn't vaporware. This is working right now. Connected to your actual Gmail, your actual Mailchimp, your actual Monday boards. I want to pilot this with your next 3-5 campaigns. We measure the time savings - I'm betting 15-20 hours per campaign. If it works, you roll it out across Liberty. If it doesn't, you've lost nothing because you're already using all these tools separately - we're just connecting them."

---

## ✅ SUCCESS CRITERIA

### Technical:
- [ ] Typeform import creates campaign correctly
- [ ] Gmail integration logs emails to timeline
- [ ] Mailchimp pulls stats accurately
- [ ] WARM report upload parses plays correctly
- [ ] Liberty Agent generates strategies successfully
- [ ] Monday.com sync works bidirectionally
- [ ] Google Drive folders organize assets
- [ ] Real-time updates work across tabs

### Business:
- [ ] Dan says "this connects everything we're already doing"
- [ ] Sam says "this saves me hours per campaign"
- [ ] They discuss pilot timeline during demo
- [ ] They ask about rolling out to full team
- [ ] They mention specific campaigns to test with

---

## 🚀 START HERE

1. **Read integration docs:**
   - Gmail API setup: `tools/agents/gmail-setup/`
   - Liberty Agent: `src/agents/radio-promo/LibertyRadioPromoAgent.ts`
   - Typeform integration: Check Liberty agent Typeform code

2. **Set up database:**
   ```bash
   cd apps/tracker
   npx supabase migration new tracker_integrations
   # Add schema from this doc
   npx supabase db push
   ```

3. **Install dependencies:**
   ```bash
   npm install --workspace=tracker \
     jspdf jspdf-autotable \
     csv-parse xlsx \
     @google-cloud/storage \
     @mailchimp/mailchimp_marketing \
     airtable \
     googleapis \
     date-fns
   ```

4. **Start building Phase 1** (Integration Setup)

Ready? Let's build a production tool, not a demo. 🔥
