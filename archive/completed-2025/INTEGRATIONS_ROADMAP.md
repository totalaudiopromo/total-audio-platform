# Total Audio Platform - Integrations Roadmap

**Vision**: One-click integrations that actually make tracking and campaign management useful

## Current State

### ✅ Existing Infrastructure

- Gmail OAuth integration (`apps/api/src/integrations/gmail/`)
- Mailchimp integration (`apps/api/src/integrations/mailchimp/`)
- Airtable integration (`apps/api/src/integrations/airtable/`)
- MCP servers: Gmail, Google Drive, Notion, Puppeteer (14+ operational)
- Supabase database for user data

### 🎯 What You Need: "One-Click Useful Integrations"

The current integrations exist but aren't **user-facing** or **useful for tracking**. You need:

1. **Self-service OAuth flows** - Users click "Connect Google Sheets", authenticate, done
2. **Auto-sync functionality** - Campaign updates flow to connected services
3. **Two-way data** - Changes in Sheets/Airtable/Mailchimp sync back
4. **Real tracking value** - Gmail replies auto-update campaign status

## Priority Integrations

### 1. Google Sheets (HIGHEST PRIORITY)

**Why**: Radio promoters and agencies live in Sheets

**User Flow**:

```
Tracker Dashboard → Settings → Integrations
→ Click "Connect Google Sheets"
→ Google OAuth popup
→ Select/create spreadsheet
→ Done - campaigns auto-sync to Sheet
```

**Technical Implementation**:

- Use Google Sheets API v4
- OAuth 2.0 flow (already have Gmail OAuth pattern)
- Create `/api/integrations/google-sheets/connect` endpoint
- Store refresh token in Supabase user settings
- Background sync job every 5 minutes

**Useful Features**:

- Create new row when campaign added in Tracker
- Update row when status changes
- Two-way sync: edit in Sheet → updates Tracker
- Column mapping: user chooses which fields sync

**Tables**:

```sql
CREATE TABLE integration_connections (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users,
  integration_type TEXT, -- 'google_sheets', 'airtable', etc
  credentials JSONB, -- encrypted OAuth tokens
  settings JSONB, -- spreadsheet ID, column mapping
  last_sync TIMESTAMP,
  active BOOLEAN
);

CREATE TABLE sync_logs (
  id UUID PRIMARY KEY,
  connection_id UUID REFERENCES integration_connections,
  direction TEXT, -- 'to_sheet', 'from_sheet'
  records_synced INT,
  errors JSONB,
  created_at TIMESTAMP
);
```

### 2. Gmail Tracking (QUICK WIN)

**Why**: You already have Gmail OAuth - just need to connect it to campaigns

**User Flow**:

```
Tracker → Campaign Detail
→ "Connect Gmail to track replies"
→ OAuth flow (reuse existing)
→ Auto-detect replies to campaign contacts
→ Update campaign status when reply received
```

**Technical Implementation**:

- Extend existing `apps/api/src/integrations/gmail/index.ts`
- Add `/api/integrations/gmail/connect` endpoint for Tracker users
- Background job: check for replies every 15 minutes
- Match emails by: contact email + campaign subject line
- Update campaign contact status: 'sent' → 'replied'

**Useful Features**:

- Real-time reply notifications
- Auto-categorize replies: interested/not interested/bounce
- Show reply preview in Tracker
- "Open in Gmail" quick link

### 3. Airtable (AGENCY FAVORITE)

**Why**: Agencies already use Airtable for campaign management

**User Flow**:

```
Tracker → Settings → Connect Airtable
→ OAuth flow
→ Select base + table
→ Map fields
→ Two-way sync enabled
```

**Technical Implementation**:

- Use existing `apps/api/src/integrations/airtable/index.ts`
- Add OAuth flow (currently uses API key only)
- Create webhook endpoint for Airtable → Tracker updates
- Background sync Tracker → Airtable

**Useful Features**:

- Import existing Airtable campaigns
- Sync custom fields
- View-based filtering
- Team collaboration through Airtable

### 4. Mailchimp (EMAIL CAMPAIGN TRACKING)

**Why**: Track email campaign sends + opens alongside other campaign activity

**User Flow**:

```
Tracker → Campaign → Add Email Channel
→ Connect Mailchimp
→ Select campaign/audience
→ Track opens/clicks alongside pitches
```

**Technical Implementation**:

- Extend `apps/api/src/integrations/mailchimp/index.ts`
- OAuth flow for user accounts
- Fetch campaign stats via Mailchimp API
- Display alongside campaign contacts

**Useful Features**:

- See email open rates per contact
- Link email activity to pitch responses
- Combined view: "Sent pitch + opened email = warmer lead"

### 5. Excel/CSV Export (NO INTEGRATION NEEDED)

**Already Have This**: Export buttons in Tracker
**Enhancement**: Add scheduled exports

- Weekly/monthly CSV emailed
- Google Drive auto-upload
- Format templates (radio promo, playlist, press)

## Integration UI/UX Pattern

### Consistent Integration Flow (All Integrations)

**Step 1: Connect Screen**

```
┌────────────────────────────────────┐
│  Connect Google Sheets             │
│                                    │
│  [Icon] Keep your campaigns in sync│
│         with your existing sheets  │
│                                    │
│  ✓ Auto-sync campaign updates      │
│  ✓ Two-way data flow               │
│  ✓ Custom field mapping            │
│                                    │
│  [Connect with Google] ──────────► │
│                                    │
│  Your data stays secure. We only   │
│  access sheets you explicitly grant│
└────────────────────────────────────┘
```

**Step 2: Configuration**

```
┌────────────────────────────────────┐
│  Configure Google Sheets Sync      │
│                                    │
│  Spreadsheet: [Choose...      ▼]   │
│               • My Campaigns       │
│               • Radio Promo Q4     │
│               + Create New         │
│                                    │
│  Sheet Name: [Campaigns       ]    │
│                                    │
│  Sync Settings:                    │
│  ☑ New campaigns → new rows        │
│  ☑ Status updates → update rows    │
│  ☑ Sheet edits → update Tracker    │
│                                    │
│  Sync Frequency: [Every 5 mins ▼]  │
│                                    │
│  [Cancel]  [Save & Start Sync] ──► │
└────────────────────────────────────┘
```

**Step 3: Active Integration Card**

```
┌────────────────────────────────────┐
│  🟢 Google Sheets                  │
│     Connected                      │
│                                    │
│  Last sync: 2 minutes ago          │
│  Records synced: 47 campaigns      │
│                                    │
│  [View in Sheets] [Configure]      │
│                 [Disconnect]       │
└────────────────────────────────────┘
```

## Implementation Plan

### Phase 1: Foundation (Week 1)

**Goal**: User-facing OAuth infrastructure

- [ ] Create `/apps/tracker/app/dashboard/integrations/page.tsx`
- [ ] Build reusable OAuth component
- [ ] Create `integration_connections` table in Supabase
- [ ] Add integration status to user settings

**Components**:

```typescript
// apps/tracker/components/integrations/IntegrationCard.tsx
export function IntegrationCard({ name, icon, description, status, onConnect, onDisconnect }) {}

// apps/tracker/components/integrations/OAuthFlow.tsx
export function OAuthFlow({
  provider, // 'google', 'airtable', etc
  scopes,
  onSuccess,
  onError,
}) {}
```

### Phase 2: Google Sheets (Week 2)

**Goal**: First fully functional integration

- [ ] Google Sheets OAuth flow
- [ ] Create/select spreadsheet UI
- [ ] Field mapping configuration
- [ ] Background sync worker
- [ ] Two-way sync logic
- [ ] Error handling & notifications

**API Routes**:

```
POST   /api/integrations/google-sheets/connect
GET    /api/integrations/google-sheets/spreadsheets
POST   /api/integrations/google-sheets/sync
DELETE /api/integrations/google-sheets/disconnect
```

### Phase 3: Gmail Tracking (Week 3)

**Goal**: Auto-reply detection

- [ ] Gmail OAuth for Tracker users
- [ ] Reply detection background job
- [ ] Campaign status auto-update
- [ ] Reply preview UI in Tracker
- [ ] Notification system

### Phase 4: Airtable & Mailchimp (Week 4)

**Goal**: Complete integration suite

- [ ] Airtable two-way sync
- [ ] Mailchimp campaign stats
- [ ] Integration dashboard
- [ ] Analytics: "Most used integrations"

## Technical Architecture

### OAuth Flow Pattern (Reusable)

```typescript
// apps/tracker/lib/integrations/oauth-handler.ts
export class IntegrationOAuthHandler {
  async initiateOAuth(provider: string, userId: string) {
    // Generate state token
    // Redirect to provider auth URL
    // Store state in Redis/Supabase
  }

  async handleCallback(code: string, state: string) {
    // Verify state token
    // Exchange code for tokens
    // Encrypt and store tokens
    // Return to config screen
  }

  async refreshToken(connectionId: string) {
    // Get stored refresh token
    // Request new access token
    // Update stored credentials
  }
}
```

### Sync Engine (Background Worker)

```typescript
// apps/tracker/workers/integration-sync.ts
export class IntegrationSyncWorker {
  async syncConnection(connectionId: string) {
    const connection = await getConnection(connectionId);

    switch (connection.integration_type) {
      case 'google_sheets':
        return await syncGoogleSheets(connection);
      case 'gmail':
        return await checkGmailReplies(connection);
      case 'airtable':
        return await syncAirtable(connection);
    }
  }

  async syncGoogleSheets(connection) {
    // Fetch campaigns from Tracker
    // Fetch rows from Sheet
    // Diff and apply changes both ways
    // Log sync result
  }
}
```

### Security Considerations

1. **Token Encryption**: Store OAuth tokens encrypted in Supabase
2. **Scopes**: Request minimum necessary permissions
3. **Rate Limiting**: Respect API limits (Sheets: 100 requests/100 seconds)
4. **Error Handling**: Graceful degradation if sync fails
5. **Audit Logs**: Track all integration actions

## User Value Propositions

### For Radio Promoters

> "Connect your existing Google Sheet and we'll keep it updated automatically.
> No more copy-pasting between Tracker and your spreadsheet."

### For Agencies

> "Sync campaigns to Airtable so your whole team sees real-time status updates.
> Everyone stays on the same page."

### For Solo Artists

> "Connect Gmail and we'll automatically mark contacts as 'replied' when they
> email you back. Never miss a follow-up."

## Pricing Impact

### Free Tier

- 1 integration
- Manual sync only
- 100 records/month

### Pro Tier (£19/month)

- 3 integrations
- Auto-sync every 15 minutes
- 1,000 records/month

### Agency Tier (£79/month)

- Unlimited integrations
- Real-time sync
- Unlimited records
- Team access to integrations

## Competitive Advantage

**Current competitors** (Submithub, MusoSoup, etc):

- ❌ No CRM integrations
- ❌ Export to CSV only
- ❌ No two-way sync
- ❌ Siloed data

**Total Audio with Integrations**:

- ✅ Works with existing workflows
- ✅ Two-way data flow
- ✅ Auto-updates from replies
- ✅ Professional agency-ready

## Success Metrics

### Week 1-2 (Post-Launch)

- 10+ users connect Google Sheets
- 100+ campaigns synced

### Month 1

- 30% of active users have ≥1 integration
- 5,000+ sync operations
- <1% sync error rate

### Month 3

- 50% of Pro users use integrations daily
- "Integrations" = top feature in user surveys
- 20% upgrade from Free → Pro for integrations

## Demo Script for Dan

**"Real-World Workflow Demo"**

1. **Show existing chaos**: "Most promoters have campaigns in 3 places:
   Email, a spreadsheet, and their head"

2. **Connect Google Sheets**: "Watch this - one click to connect my
   existing radio promo sheet"

3. **Create campaign in Tracker**: "I add a new campaign here..."

4. **Show Sheet**: "...and it's already in my Sheet. My VA can see it."

5. **Update in Sheet**: "My VA marks it 'replied' in the Sheet..."

6. **Show Tracker**: "...and Tracker knows immediately. Zero manual work."

7. **Connect Gmail**: "Now watch this - I connect Gmail..."

8. **Show auto-reply detection**: "When Annie Mac replies to my pitch,
   Tracker automatically knows. I don't touch anything."

**The Punch Line**:

> "This isn't just campaign tracking. It's campaign tracking that
> connects to how you already work. That's the difference between a
> £50 tool and a £500 platform."

## Next Steps

1. **Validate with users first**: Ask 5 radio promoters:
   "What would make Tracker more useful?"

2. **Start with Google Sheets** (highest demand, proven pattern)

3. **Ship MVP in 2 weeks** (OAuth + basic sync)

4. **Add Gmail in week 3** (reuse OAuth infrastructure)

5. **Expand based on usage data**

---

**Decision Point**: Should we start building Google Sheets integration now,
or validate demand first with user interviews?

**Recommendation**: Build Google Sheets MVP (Week 1-2). It's the most
universally useful and demonstrates integration value immediately.
