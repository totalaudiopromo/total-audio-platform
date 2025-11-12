# Campaign Tracker Demo Build Roadmap - Using Real Campaign Data
**Target Demo Date:** Thursday 19th November 2025
**Build Time Available:** 24 hours focused development
**Objective:** Production-ready Campaign Tracker demo using KYARA, Senior Dunce, and Concerta real campaign data

---

## 🎯 OVERALL STATUS: **READY TO BUILD**

After comprehensive codebase analysis, I've identified:
- ✅ **3 active campaigns** with rich, real data
- ✅ **Liberty Radio Promo Agent** fully built and operational
- ✅ **Google Chat MCP** setup and configured
- ✅ **Monday.com integration** code exists
- ✅ **WARM API, Gmail API, Mailchimp** integrations ready
- ⚠️ **Tracker app** has structure but no campaign functionality yet
- ⚠️ **Demo page** is placeholder only

**YOU HAVE EVERYTHING YOU NEED. THIS IS BUILDABLE IN 24 HOURS.**

---

## 📊 CURRENT STATE ANALYSIS

### Campaign Data Available (EXCELLENT)

#### 1. KYARA "Bloodshot" Campaign
**Status:** Most complete, demo-ready
**Data Quality:** ⭐⭐⭐⭐⭐ (5/5)

```
Artist: KYARA
Track: Bloodshot
Genre: Electro-pop / Electronic
Release Date: 14 October 2025
Campaign Duration: 6 weeks
Budget: £2,500
Region: Australia (primary) + UK (secondary)

REAL METRICS:
✅ 85 plays across 9 countries (WARM data)
✅ Amazing Radio (UK) confirmed support
✅ Triple J Home & Hosed history ("Yearn" played Aug 2024)
✅ 15 radio contacts pitched (initial wave)
✅ 5 Gmail drafts created for Australian radio
✅ Release week email blast ready
✅ 60% open rate, 26% click rate, 13% response rate

KEY CONTACTS:
- Anika Luna (Triple J Home & Hosed)
- Claire Mooney (Triple J Music Director)
- Simon Winkler (Triple R Melbourne)
- Firas (PBS FM)
- KIIS Music Team (Sydney)
- Danny Howard (BBC Radio 1 Dance)
- Pete Tong (BBC Radio 1 Essential Selection)
- Amazing Radio (CONFIRMED)

TIMELINE EVENTS:
- 7 Oct: Initial Australian pitch (15 emails)
- 8 Oct: Gmail drafts created (5 contacts)
- 9 Oct: Amazing Radio confirmed
- 10 Oct: WARM report (85 plays, 9 countries)
- 11 Oct: UK Mailchimp campaign (20 contacts)
- 11 Oct: Monday release blast prepared
```

**Files Located:**
- `tools/agents/campaigns/kyara/KYARA_CAMPAIGN_SHOWCASE_FOR_DAN_DEMO.md`
- `tools/agents/campaigns/kyara/ADD_ACTIVITIES_TO_TRACKER.md`
- `tools/agents/campaigns/kyara/liberty-agent-kyara.js`
- `tools/agents/campaigns/kyara/enrich-kyara-contacts.js`

#### 2. Senior Dunce "Bestial" Campaign
**Status:** Active, UK focus
**Data Quality:** ⭐⭐⭐⭐ (4/5)

```
Artist: Senior Dunce
Track: Bestial
Genre: Electronic/Experimental
Release Date: 15 October 2025
Campaign Duration: 4 weeks
Budget: £500
Target Market: UK radio (national, community, online)

REAL METRICS:
✅ 33+ plays (baseline from WARM)
✅ Amazing Dance - play secured
✅ Sheffield Live! - play secured
✅ European Indie Music Network - play secured
✅ Kbit Play - play secured
✅ Sword Radio UK - play secured

TARGET STATIONS (3-Phase Strategy):
Phase 1 - Current Supporters (5 stations):
- Amazing Dance, Sheffield Live!, Kbit Play, European Indie Music Network, Sword Radio UK

Phase 2 - New UK Targets (8 stations):
- BBC Radio 6 Music, Amazing Radio, Radio Wigwam, Resonance FM, NTS Radio, Soho Radio, Totally Radio, Radio Reverb

Phase 3 - Major UK Stations (5 stations):
- BBC Radio 1, BBC Radio 2, Kiss FM, Capital FM, Virgin Radio

CAMPAIGN ANGLE:
"UK electronic influence with British engineer collaboration"
```

**Files Located:**
- `tools/agents/campaigns/senior-dunce/senior-dunce-radio-expansion.js`
- `tools/agents/campaigns/senior-dunce/manual-senior-dunce-timeline.js`
- `tools/agents/campaigns/senior-dunce/automated-senior-dunce-outreach.js`
- `tools/agents/campaigns/liberty/liberty-agent-senior-dunce.js`

#### 3. Concerta "Consumption" Campaign
**Status:** Ready to launch, comprehensive contacts
**Data Quality:** ⭐⭐⭐⭐ (4/5)

```
Artist: Concerta
Origin: South Korea
Track: Consumption
Genre: Dance/Electronic
Release Date: 15 November 2025
Campaign Duration: 6 weeks

REAL METRICS:
✅ 132 Electronic/Dance specialist contacts ready
✅ Assets verified (artwork, video, press release)
✅ Email templates created (3 variants)
✅ Mailchimp campaign plan complete

TARGET MARKETS:
1. Primary: Eastern European dance/electronic radio
2. Secondary: South Korean electronic music stations
3. Tertiary: Global electronic/dance specialists

TOP CONTACTS:
- WARM Radio (Denmark)
- The New Music Show
- CJSW
- Radio Fandango
- BBC (Steve White)
- Reducedlistening
- Somethinelse
- BBC (Jada Joshi)

CAMPAIGN HOOK:
"South Korean electronic artist bringing fresh Asian influence to European dance scene"
```

**Files Located:**
- `tools/agents/campaigns/concerta/CONCERTA_CAMPAIGN_SUMMARY.md`
- `tools/agents/campaigns/concerta/concerta-liberty-agent.js`
- `tools/agents/campaigns/concerta/find-concerta-contacts.js`
- `tools/agents/campaigns/concerta/concerta-contacts.json` (132 contacts)

### Liberty Radio Promo Agent (FULLY BUILT)
**Status:** Production-ready TypeScript agent
**Location:** `src/agents/radio-promo/LibertyRadioPromoAgent.ts`

**Features:**
✅ Streaming agent with real-time progress
✅ Prompt caching for 80-90% cost reduction
✅ Agentic loops for autonomous execution
✅ Extended thinking for campaign strategy
✅ Monday.com integration
✅ Gmail API integration
✅ WARM API integration
✅ Mailchimp integration

**Tools Available:**
1. `create_monday_campaign` - Create campaign board
2. `generate_personalized_email` - AI-generated pitches
3. `send_email_via_gmail` - Send via Gmail API
4. `check_warm_plays` - Track plays via WARM
5. `update_campaign_status` - Update Monday.com

**Agent Context:**
- Full UK music industry knowledge
- Liberty workflow patterns
- Email template strategy
- Station targeting logic
- Follow-up strategies

### Google Chat Integration (CONFIGURED)
**Status:** MCP setup complete, authenticated
**Location:** `tools/mcp-servers/google-chat-mcp.js`

**Capabilities:**
✅ Read Liberty Chat spaces
✅ Access historical messages
✅ Search conversations
✅ Extract workflow patterns

**Liberty Chat Email:** `chrisschofield@libertymusicpr.com`
**Access Level:** Read-only
**Setup:** `tools/mcp-servers/LIBERTY_CHAT_SETUP.md`

### Tracker App Structure (EXISTS BUT INCOMPLETE)
**Location:** `apps/tracker/`

**What Exists:**
✅ App structure (`app/dashboard/`, `app/campaigns/`, `app/demo/`)
✅ Authentication setup
✅ Database schema (Supabase)
✅ Component library
✅ API routes skeleton

**What's Missing:**
❌ Campaign dashboard functionality
❌ Campaign detail views
❌ Activity timeline display
❌ Real-time updates
❌ Contact tracking
❌ PDF export

**Demo Page Status:**
- `apps/tracker/app/demo/page.tsx` - **Placeholder only** ("Demo Coming Soon")
- Needs complete rebuild with real campaign data

---

## 🚧 GAP ANALYSIS

### What Needs to Be Built:

| Component | Priority | Effort | Dependencies |
|-----------|----------|--------|--------------|
| Campaign Dashboard UI | **HIGH** | 4 hours | Supabase schema |
| Campaign Detail View | **HIGH** | 3 hours | Dashboard |
| Activity Timeline | **HIGH** | 2 hours | Campaign detail |
| Contact Grid Display | **MEDIUM** | 2 hours | Campaign detail |
| Real-time Updates | **MEDIUM** | 2 hours | Supabase Realtime |
| Agent Integration Display | **HIGH** | 3 hours | Liberty agent |
| PDF Export | **LOW** | 2 hours | Campaign data |
| Google Chat Notifications | **LOW** | 2 hours | MCP integration |

**Total Critical Path:** 12 hours
**Total with Nice-to-Haves:** 20 hours
**Buffer for Testing/Polish:** 4 hours

---

## 📅 24-HOUR DEVELOPMENT ROADMAP

### PHASE 1: Data Migration & Schema (Hours 1-3)
**Goal:** Get real campaign data into Supabase

#### Hour 1: Database Schema Setup
**Tasks:**
1. Create Supabase tables:
   ```sql
   -- campaigns table
   CREATE TABLE campaigns (
     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
     user_id TEXT NOT NULL,
     artist_name TEXT NOT NULL,
     track_name TEXT NOT NULL,
     genre TEXT,
     release_date DATE,
     budget TEXT,
     status TEXT DEFAULT 'active', -- active, completed, paused
     region TEXT,
     campaign_duration TEXT,
     campaign_angle TEXT,
     created_at TIMESTAMPTZ DEFAULT NOW(),
     updated_at TIMESTAMPTZ DEFAULT NOW()
   );

   -- campaign_contacts table
   CREATE TABLE campaign_contacts (
     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
     campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE,
     contact_name TEXT NOT NULL,
     contact_email TEXT,
     outlet TEXT,
     contact_type TEXT, -- National, Commercial, Community, Online
     priority TEXT DEFAULT 'medium', -- high, medium, low
     status TEXT DEFAULT 'pending', -- pending, contacted, responded, confirmed, declined
     notes TEXT,
     intelligence JSONB, -- Store enriched contact data
     assigned_to TEXT,
     last_contacted TIMESTAMPTZ,
     created_at TIMESTAMPTZ DEFAULT NOW()
   );

   -- campaign_activities table (CRITICAL FOR TIMELINE)
   CREATE TABLE campaign_activities (
     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
     campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE,
     contact_id UUID REFERENCES campaign_contacts(id) ON DELETE SET NULL,
     user_id TEXT NOT NULL,
     user_name TEXT,
     user_location TEXT, -- Brighton, LA, London
     activity_type TEXT NOT NULL, -- contacted, followed_up, got_response, milestone, play_confirmed
     description TEXT NOT NULL,
     notes TEXT,
     metadata JSONB, -- Store additional context (email_id, warm_play_data, etc)
     timestamp TIMESTAMPTZ DEFAULT NOW()
   );

   -- campaign_metrics table
   CREATE TABLE campaign_metrics (
     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
     campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE,
     metric_type TEXT NOT NULL, -- plays, emails_sent, responses, confirmations
     value INTEGER NOT NULL,
     source TEXT, -- warm_api, gmail_api, manual
     recorded_at TIMESTAMPTZ DEFAULT NOW()
   );

   -- Enable Realtime
   ALTER PUBLICATION supabase_realtime ADD TABLE campaign_activities;
   ALTER PUBLICATION supabase_realtime ADD TABLE campaign_contacts;
   ```

2. Create migration file: `apps/tracker/supabase/migrations/20251119_campaign_tracker_schema.sql`
3. Run migration against Supabase
4. Verify tables created successfully

**Files to Create:**
- `apps/tracker/lib/db/schema.ts` - TypeScript types
- `apps/tracker/lib/db/migrations.sql` - Schema

**Test:**
```bash
npx supabase db push
```

#### Hour 2-3: Campaign Data Import Scripts
**Tasks:**
1. Create data import script: `apps/tracker/scripts/import-real-campaigns.ts`
2. Import KYARA campaign:
   ```typescript
   const kyaraCampaign = {
     artist_name: 'KYARA',
     track_name: 'Bloodshot',
     genre: 'Electro-pop / Electronic',
     release_date: '2025-10-14',
     budget: '£2,500',
     status: 'completed',
     region: 'Australia + UK',
     campaign_duration: '6 weeks',
     campaign_angle: 'Sydney electronic artist with Triple J history',
   };

   const kyaraContacts = [
     { name: 'Anika Luna', outlet: 'Triple J Home & Hosed', type: 'National', priority: 'high', status: 'contacted' },
     { name: 'Claire Mooney', outlet: 'Triple J Music Director', type: 'National', priority: 'high', status: 'contacted' },
     { name: 'Amazing Radio', outlet: 'Amazing Radio UK', type: 'Online', priority: 'high', status: 'confirmed' },
     // ... 12 more contacts
   ];

   const kyaraActivities = [
     { timestamp: '2025-10-07', type: 'contacted', description: 'Initial Australian pitch (15 emails sent)', user_name: 'Chris', user_location: 'Brighton' },
     { timestamp: '2025-10-08', type: 'milestone', description: '5 Gmail drafts auto-created', user_name: 'Liberty Agent', user_location: 'Automated' },
     { timestamp: '2025-10-09', type: 'confirmed', description: 'Amazing Radio (UK) confirmed support', user_name: 'Chris', user_location: 'Brighton' },
     { timestamp: '2025-10-10', type: 'milestone', description: 'WARM report: 85 plays across 9 countries', user_name: 'WARM API', user_location: 'Automated' },
     { timestamp: '2025-10-11', type: 'contacted', description: 'UK Mailchimp campaign sent (20 contacts)', user_name: 'Chris', user_location: 'Brighton' },
     { timestamp: '2025-10-11', type: 'milestone', description: 'Monday release blast prepared (40 contacts)', user_name: 'Chris', user_location: 'Brighton' },
   ];
   ```

3. Import Senior Dunce campaign (similar structure)
4. Import Concerta campaign (similar structure)

**Files to Create:**
- `apps/tracker/scripts/import-real-campaigns.ts`
- `apps/tracker/scripts/kyara-campaign-data.ts`
- `apps/tracker/scripts/senior-dunce-campaign-data.ts`
- `apps/tracker/scripts/concerta-campaign-data.ts`

**Test:**
```bash
tsx apps/tracker/scripts/import-real-campaigns.ts
```

---

### PHASE 2: Core Dashboard (Hours 4-8)
**Goal:** Campaign dashboard showing 3 real campaigns

#### Hour 4-5: Dashboard Layout & Campaign Cards
**Tasks:**
1. Build dashboard page: `apps/tracker/app/dashboard/page.tsx`
2. Create campaign card component: `apps/tracker/app/components/CampaignCard.tsx`
3. Fetch campaigns from Supabase
4. Display key metrics:
   - Campaign status (active/completed)
   - Progress percentage
   - Quick stats (contacts pitched, plays, confirmations)
   - Timeline preview (last 3 activities)

**Component Structure:**
```tsx
<Dashboard>
  <DashboardHeader>
    <h1>Active Campaigns</h1>
    <CreateCampaignButton />
  </DashboardHeader>

  <CampaignGrid>
    <CampaignCard campaign={kyara}>
      <CampaignStatus />
      <QuickStats />
      <MiniTimeline />
      <ViewDetailsButton />
    </CampaignCard>

    <CampaignCard campaign={seniorDunce} />
    <CampaignCard campaign={concerta} />
  </CampaignGrid>
</Dashboard>
```

**Files to Create:**
- `apps/tracker/app/dashboard/page.tsx`
- `apps/tracker/app/components/CampaignCard.tsx`
- `apps/tracker/app/components/DashboardHeader.tsx`
- `apps/tracker/lib/api/campaigns.ts` - Data fetching

**Design Reference:**
- Use Tracker's existing brutalist design system
- Shadow: `shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]`
- Border: `border-4 border-black`
- Colors: Teal accent (`bg-teal-600`)

**Test:**
```bash
npm run dev:tracker
# Navigate to localhost:3001/dashboard
# Should see 3 campaign cards
```

#### Hour 6-8: Campaign Detail View
**Tasks:**
1. Build campaign detail page: `apps/tracker/app/campaigns/[id]/page.tsx`
2. Create contact grid component: `apps/tracker/app/components/ContactGrid.tsx`
3. Create activity timeline component: `apps/tracker/app/components/ActivityTimeline.tsx`
4. Create metrics overview component: `apps/tracker/app/components/MetricsOverview.tsx`

**Page Structure:**
```tsx
<CampaignDetail campaign={kyara}>
  <CampaignHeader>
    <BackButton />
    <CampaignTitle />
    <ExportButton />
  </CampaignHeader>

  <MetricsOverview>
    <MetricCard label="Total Plays" value={85} source="WARM API" />
    <MetricCard label="Contacts Pitched" value={15} />
    <MetricCard label="Confirmations" value={3} />
    <MetricCard label="Response Rate" value="13%" />
  </MetricsOverview>

  <TwoColumnLayout>
    <LeftColumn>
      <ActivityTimeline activities={kyaraActivities} />
    </LeftColumn>

    <RightColumn>
      <ContactGrid contacts={kyaraContacts} />
    </RightColumn>
  </TwoColumnLayout>
</CampaignDetail>
```

**Files to Create:**
- `apps/tracker/app/campaigns/[id]/page.tsx`
- `apps/tracker/app/components/ContactGrid.tsx`
- `apps/tracker/app/components/ActivityTimeline.tsx`
- `apps/tracker/app/components/MetricsOverview.tsx`

**Test:**
```bash
# Click into KYARA campaign card
# Should see full detail view with timeline + contacts
```

---

### PHASE 3: Liberty Agent Integration (Hours 9-12)
**Goal:** Show Liberty Radio Promo Agent in action

#### Hour 9-10: Agent Status Display
**Tasks:**
1. Create agent integration component: `apps/tracker/app/components/AgentIntegrationStatus.tsx`
2. Display agent capabilities:
   - Gmail API connection status
   - Monday.com sync status
   - WARM API connection status
   - Mailchimp integration status
   - Google Chat notifications status
3. Show recent agent actions:
   - "Liberty Agent created 5 Gmail drafts for KYARA campaign"
   - "WARM API pulled 85 plays for KYARA - Bloodshot"
   - "Agent suggested follow-up with Anika Luna (Triple J)"

**Component:**
```tsx
<AgentIntegrationStatus>
  <IntegrationList>
    <Integration name="Gmail API" status="connected" icon={<Mail />} />
    <Integration name="Monday.com" status="connected" icon={<Trello />} />
    <Integration name="WARM API" status="connected" icon={<Radio />} />
    <Integration name="Mailchimp" status="connected" icon={<Mail />} />
    <Integration name="Google Chat" status="connected" icon={<MessageCircle />} />
  </IntegrationList>

  <RecentAgentActions>
    <AgentAction timestamp="2 hours ago" action="Gmail drafts created" campaign="KYARA" />
    <AgentAction timestamp="1 day ago" action="WARM plays pulled" campaign="KYARA" />
  </RecentAgentActions>
</AgentIntegrationStatus>
```

**Files to Create:**
- `apps/tracker/app/components/AgentIntegrationStatus.tsx`
- `apps/tracker/lib/api/agent-status.ts`

#### Hour 11-12: Agent Action Demo
**Tasks:**
1. Create "Invoke Agent" button on campaign detail page
2. Build agent action modal: `apps/tracker/app/components/InvokeAgentModal.tsx`
3. Connect to Liberty Radio Promo Agent:
   ```typescript
   import { LibertyRadioPromoAgent } from '@/agents/radio-promo/LibertyRadioPromoAgent';

   const agent = new LibertyRadioPromoAgent(mondayApi, gmailApi, warmApi);

   agent.on('progress', (event) => {
     // Show streaming progress in modal
     setAgentProgress(event.delta);
   });

   const result = await agent.generateCampaignStrategy(kyaraCampaign);
   ```

4. Show agent capabilities:
   - "Generate follow-up emails for non-responders"
   - "Check WARM API for new plays"
   - "Suggest next contacts to prioritize"
   - "Update Monday.com campaign board"

**Demo Flow:**
1. Click "Invoke Agent" button on KYARA campaign
2. Modal opens: "What should the agent do?"
3. Select: "Generate campaign strategy"
4. Agent thinks (extended thinking visible)
5. Returns: "Recommend following up with Anika Luna (warm lead), prioritize BBC Radio 6 Music (genre fit), avoid over-contacting Danny Howard (recently pitched)"
6. Show streaming response in real-time

**Files to Create:**
- `apps/tracker/app/components/InvokeAgentModal.tsx`
- `apps/tracker/lib/api/invoke-agent.ts`

**Test:**
```bash
# Click "Invoke Agent" on KYARA campaign
# Should see modal with agent thinking
# Should see streaming response
```

---

### PHASE 4: Real-Time Features (Hours 13-16)
**Goal:** Real-time updates and collision detection

#### Hour 13-14: Supabase Realtime Subscriptions
**Tasks:**
1. Set up Realtime subscriptions: `apps/tracker/lib/realtime/campaign-subscriptions.ts`
2. Subscribe to `campaign_activities` table changes
3. Update UI when new activities added
4. Show live notifications: "New activity: Amazing Radio confirmed for KYARA"

**Implementation:**
```typescript
// apps/tracker/lib/realtime/campaign-subscriptions.ts
import { createClient } from '@total-audio/core-db/client';

export function subscribeToCampaignActivities(campaignId: string, onNewActivity: (activity: Activity) => void) {
  const supabase = createClient();

  const subscription = supabase
    .channel(`campaign-${campaignId}`)
    .on('postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'campaign_activities', filter: `campaign_id=eq.${campaignId}` },
      (payload) => {
        onNewActivity(payload.new as Activity);
      }
    )
    .subscribe();

  return () => subscription.unsubscribe();
}
```

**Files to Create:**
- `apps/tracker/lib/realtime/campaign-subscriptions.ts`
- `apps/tracker/app/components/LiveActivityFeed.tsx`

**Test:**
```bash
# Open KYARA campaign in two browser tabs
# Add activity in one tab
# Should see update in other tab instantly
```

#### Hour 15-16: Collision Detection Logic
**Tasks:**
1. Create collision detection function: `apps/tracker/lib/collision/detect-duplicate-outreach.ts`
2. Check before adding contact to campaign:
   ```typescript
   async function checkContactCollision(campaignId: string, contactId: string) {
     const { data: recentActivity } = await supabase
       .from('campaign_activities')
       .select('*')
       .eq('campaign_id', campaignId)
       .eq('contact_id', contactId)
       .eq('activity_type', 'contacted')
       .gte('timestamp', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000))
       .single();

     if (recentActivity) {
       return {
         collision: true,
         message: `${recentActivity.user_name} already contacted ${contactName} ${timeAgo(recentActivity.timestamp)}`,
         lastContact: recentActivity.timestamp
       };
     }

     return { collision: false };
   }
   ```

3. Show warning when duplicate detected:
   "⚠️ Warning: Jack Saunders was already contacted by Chris 2 days ago. Recommended action: Wait 5 more days before follow-up."

**Files to Create:**
- `apps/tracker/lib/collision/detect-duplicate-outreach.ts`
- `apps/tracker/app/components/CollisionWarning.tsx`

**Test:**
```bash
# Try adding Jack Saunders to KYARA campaign
# Should show collision warning if already contacted
```

---

### PHASE 5: Client Reporting & Export (Hours 17-20)
**Goal:** Professional PDF reports

#### Hour 17-18: Campaign Report Generator
**Tasks:**
1. Install PDF generation library:
   ```bash
   npm install --workspace=tracker jspdf jspdf-autotable
   ```

2. Create report generator: `apps/tracker/lib/reports/generate-campaign-report.ts`
3. Build report structure:
   - Campaign Overview (artist, track, dates, budget)
   - Key Metrics (plays, contacts, confirmations)
   - Contact Breakdown (table of all contacts + status)
   - Activity Timeline (chronological events)
   - Performance Summary (success rate, ROI estimate)

**Implementation:**
```typescript
// apps/tracker/lib/reports/generate-campaign-report.ts
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export async function generateCampaignReport(campaignId: string) {
  const campaign = await getCampaignWithData(campaignId);

  const pdf = new jsPDF();

  // Header
  pdf.setFontSize(20);
  pdf.text(campaign.artist_name + ' - ' + campaign.track_name, 20, 20);

  // Metrics
  pdf.setFontSize(12);
  pdf.text('Campaign Performance', 20, 40);
  pdf.text(`Total Plays: ${campaign.total_plays}`, 20, 50);
  pdf.text(`Contacts Reached: ${campaign.contacts_reached}`, 20, 60);
  pdf.text(`Confirmations: ${campaign.confirmations}`, 20, 70);

  // Contact Table
  autoTable(pdf, {
    startY: 90,
    head: [['Contact', 'Outlet', 'Status', 'Last Contacted']],
    body: campaign.contacts.map(c => [c.name, c.outlet, c.status, c.last_contacted])
  });

  // Timeline
  pdf.addPage();
  pdf.text('Campaign Timeline', 20, 20);
  campaign.activities.forEach((activity, i) => {
    pdf.text(`${activity.timestamp}: ${activity.description}`, 20, 30 + (i * 10));
  });

  return pdf.output('blob');
}
```

**Files to Create:**
- `apps/tracker/lib/reports/generate-campaign-report.ts`
- `apps/tracker/app/api/reports/[id]/route.ts`

**Test:**
```bash
# Click "Export Report" on KYARA campaign
# Should download PDF with full campaign data
```

#### Hour 19-20: Report Polish & Branding
**Tasks:**
1. Add Liberty Music PR branding to reports
2. Include campaign intelligence summaries
3. Add charts/graphs (plays over time, response rates)
4. Professional formatting

**Files to Update:**
- `apps/tracker/lib/reports/generate-campaign-report.ts` - Add branding
- `apps/tracker/app/components/ExportButton.tsx` - UI polish

---

### PHASE 6: Demo Polish & Testing (Hours 21-24)
**Goal:** Demo-ready experience

#### Hour 21-22: Demo Page Rebuild
**Tasks:**
1. Replace placeholder demo page: `apps/tracker/app/demo/page.tsx`
2. Show pre-loaded KYARA campaign
3. Add "Try Live Demo" button → links to `/dashboard`
4. Create demo walkthrough:
   - Step 1: View campaign dashboard
   - Step 2: Click into KYARA campaign
   - Step 3: See real activity timeline
   - Step 4: Invoke Liberty Agent
   - Step 5: Export campaign report

**Demo Page Structure:**
```tsx
<DemoPage>
  <Hero>
    <h1>Campaign Tracker Demo</h1>
    <p>Using real KYARA "Bloodshot" campaign data</p>
  </Hero>

  <LiveCampaignPreview campaign={kyara}>
    <CampaignStats />
    <ActivityTimelinePreview />
    <ContactGridPreview />
  </LiveCampaignPreview>

  <DemoWalkthrough>
    <Step number={1} title="View Dashboard" />
    <Step number={2} title="Campaign Details" />
    <Step number={3} title="Agent Integration" />
    <Step number={4} title="Export Reports" />
  </DemoWalkthrough>

  <CTAButton href="/dashboard">Try Live Demo</CTAButton>
</DemoPage>
```

**Files to Create:**
- `apps/tracker/app/demo/page.tsx` - Complete rebuild
- `apps/tracker/app/components/LiveCampaignPreview.tsx`
- `apps/tracker/app/components/DemoWalkthrough.tsx`

#### Hour 23: Full Demo Run-Through
**Tasks:**
1. Run complete demo script:
   - Start at `/demo` page
   - Navigate to `/dashboard`
   - Click into KYARA campaign
   - Show activity timeline with 6 real events
   - Click into Amazing Radio contact
   - Invoke Liberty Agent
   - Export PDF report
   - Tab to Senior Dunce campaign
   - Tab to Concerta campaign
   - Show collision detection warning
2. Record demo walkthrough (screen recording)
3. Take screenshots for backup
4. Test on different browsers (Chrome, Firefox, Safari)
5. Test mobile responsiveness

**Test Checklist:**
- [ ] Dashboard loads with 3 campaigns
- [ ] KYARA campaign shows correct stats (85 plays, 15 contacts)
- [ ] Activity timeline displays 6 events chronologically
- [ ] Contact grid shows all 15 contacts with status
- [ ] Liberty Agent modal opens and shows streaming response
- [ ] PDF export downloads successfully
- [ ] Real-time updates work across tabs
- [ ] Collision detection triggers warning
- [ ] Google Chat integration status shows "connected"
- [ ] Mobile view works correctly

#### Hour 24: Bug Fixes & Edge Cases
**Tasks:**
1. Fix any issues found in Hour 23 testing
2. Handle edge cases:
   - Empty campaign (no activities yet)
   - Failed API calls (WARM API down)
   - Slow PDF generation
   - Realtime connection lost
3. Add loading states for all async operations
4. Add error boundaries
5. Final polish (animations, transitions, micro-interactions)

**Files to Update:**
- Add error handling to all API routes
- Add loading spinners to components
- Add error boundaries to pages

---

## 🎬 DEMO NARRATIVE (Using Real Campaigns)

### Opening (1 minute):

"Right, this is Campaign Tracker showing three real campaigns I'm managing right now for Liberty. KYARA 'Bloodshot' - Sydney electronic artist, we secured Amazing Radio and 85 plays before the track even officially dropped. Senior Dunce 'Bestial' - UK experimental electronic, currently expanding radio coverage. Concerta 'Consumption' - South Korean dance artist, launching to European markets next week. All real data, all real contacts."

### Dashboard Walkthrough (2 minutes):

**KYARA Campaign Card:**
"KYARA campaign - you can see at a glance: 15 contacts pitched, 85 plays tracked via WARM API, 3 confirmed adds including Amazing Radio. 72% through the campaign, status is active. Last activity was 2 days ago - prepared the Monday release blast."

**Click into KYARA:**
"Here's the full detail. Activity timeline on the left - everything that's happened chronologically. 7th October, initial Australian pitch to 15 contacts. 8th October, Liberty Agent auto-created 5 Gmail drafts. 9th October, Amazing Radio confirmed - that's a win. 10th October, WARM API pulled the play data - 85 plays across 9 countries. This is all automated, no manual logging."

**Contact Grid:**
"Right side, contact grid. Anika Luna at Triple J - we've contacted her, she's a warm lead from the previous single. Claire Mooney at Triple J Music Director - contacted, awaiting response. Amazing Radio - status confirmed. Each contact has full intelligence - show times, genre preferences, submission guidelines. That's the Audio Intel integration."

### Agent Integration (2 minutes):

**Integration Status:**
"Here's where it gets interesting - Liberty Agent integration. Gmail API connected, Monday.com synced, WARM API pulling plays in real-time, Mailchimp campaigns tracked, Google Chat notifications active. This is full workflow automation."

**Invoke Agent:**
"Let me show you the agent in action. [Click 'Invoke Agent'] I'm asking it to generate a campaign strategy for next week. Watch the thinking process - it's using extended thinking to analyze the contact list, response rates, previous plays."

**Agent Response (streaming):**
"Here's what it's suggesting: 'Follow up with Anika Luna - she's warm, she played the last single. Prioritize BBC Radio 6 Music - strong genre fit for electronic. Avoid over-contacting Danny Howard - recently pitched for another campaign.' This is AI-powered campaign strategy using the real contact intelligence."

### Collision Detection (1 minute):

**Show Warning:**
"Here's the coordination feature Dan mentioned wanting. Say Sam in Brighton tries to add Jack Saunders to a campaign. [Demo collision warning] System flags it: 'Jack Saunders was already contacted by Chris 3 days ago for KYARA campaign. Recommended action: Wait 4 more days before follow-up.' No more duplicate outreach across the distributed team."

### Multi-Campaign View (1 minute):

**Tab to Senior Dunce:**
"Senior Dunce campaign - UK experimental electronic. 5 plays secured so far, expanding to BBC Radio 6 Music and community stations. Three-phase strategy: current supporters, new UK targets, major stations."

**Tab to Concerta:**
"Concerta campaign - South Korean artist, 132 electronic/dance contacts ready to pitch. Campaign launches 15th November. Target markets are Eastern Europe, South Korea, and global dance specialists. All the contacts are enriched and ready."

### Export & Reporting (1 minute):

**PDF Export:**
"Client reporting - one click. [Click 'Export Report' on KYARA] Professional PDF downloads. Campaign overview, all the metrics - 85 plays, 15 contacts, 3 confirmations. Full contact breakdown with status. Activity timeline showing exactly what happened when. Liberty branding, ready to send to the client. This used to take 2-3 hours to compile manually."

### The Hook (1 minute):

"Three campaigns, real data, real-time coordination. Imagine this across all 20+ Liberty campaigns. Dan, you'd know exactly where every campaign stands at any moment. No more spreadsheet chaos. No more 'who contacted who' emails. No more manually compiling Friday reports. The Liberty Agent handles the admin, you focus on the relationships. WARM API tracks plays automatically. Gmail integration logs every email. Google Chat notifications keep the team coordinated. This is 20 hours of manual work per campaign, automated."

**The Ask:**
"I want to pilot this with your next 3-5 campaigns. Real campaigns, real data like what you're seeing here. Let's measure the time savings, see if it actually makes your life easier. If it works, we roll it out across the whole agency."

---

## 🎯 DEMO SUCCESS METRICS

### Technical Success:
- [ ] All 3 campaigns load correctly
- [ ] Activity timeline shows accurate chronological events
- [ ] Contact intelligence displays properly
- [ ] Liberty Agent invocation works smoothly
- [ ] PDF export generates professional report
- [ ] Real-time updates function across tabs
- [ ] Collision detection triggers appropriately
- [ ] Mobile responsive design works

### Business Success:
- [ ] Dan says "this would save us time"
- [ ] Sam says "this matches our workflow"
- [ ] Bee/Adam nod during integration explanation
- [ ] Anyone asks "when can we start the pilot?"
- [ ] They discuss among themselves (internal buy-in)
- [ ] Dan pulls out calendar to schedule pilot

### Demo Flow Success:
- [ ] Real campaign data impresses (not fake/demo data)
- [ ] Agent integration showcase lands well
- [ ] Collision detection "oh shit" moment happens
- [ ] Multi-campaign coordination clarity resonates
- [ ] Client reporting value prop connects
- [ ] Time savings ROI is obvious

---

## 🚀 IMMEDIATE NEXT STEPS

### Before Starting Development:

1. **Read Campaign Data Files:**
   - `tools/agents/campaigns/kyara/KYARA_CAMPAIGN_SHOWCASE_FOR_DAN_DEMO.md`
   - `tools/agents/campaigns/concerta/CONCERTA_CAMPAIGN_SUMMARY.md`
   - `tools/agents/campaigns/senior-dunce/senior-dunce-radio-expansion.js`

2. **Review Liberty Agent:**
   - `src/agents/radio-promo/LibertyRadioPromoAgent.ts`

3. **Set Up Development Environment:**
   ```bash
   cd /home/user/total-audio-platform

   # Install dependencies
   npm install --workspace=tracker jspdf jspdf-autotable

   # Start Tracker dev server (port 3001)
   npm run dev:tracker

   # In another terminal, start Supabase (if needed)
   npx supabase start
   ```

4. **Create Development Checklist:**
   - [ ] Phase 1: Data Migration (Hours 1-3)
   - [ ] Phase 2: Dashboard (Hours 4-8)
   - [ ] Phase 3: Agent Integration (Hours 9-12)
   - [ ] Phase 4: Real-Time (Hours 13-16)
   - [ ] Phase 5: Reporting (Hours 17-20)
   - [ ] Phase 6: Polish (Hours 21-24)

---

## 📦 FILES TO CREATE (Complete List)

### Database & Schema:
1. `apps/tracker/supabase/migrations/20251119_campaign_tracker_schema.sql`
2. `apps/tracker/lib/db/schema.ts`

### Data Import:
3. `apps/tracker/scripts/import-real-campaigns.ts`
4. `apps/tracker/scripts/kyara-campaign-data.ts`
5. `apps/tracker/scripts/senior-dunce-campaign-data.ts`
6. `apps/tracker/scripts/concerta-campaign-data.ts`

### Dashboard Components:
7. `apps/tracker/app/dashboard/page.tsx` - Main dashboard
8. `apps/tracker/app/components/CampaignCard.tsx`
9. `apps/tracker/app/components/DashboardHeader.tsx`
10. `apps/tracker/lib/api/campaigns.ts`

### Campaign Detail:
11. `apps/tracker/app/campaigns/[id]/page.tsx`
12. `apps/tracker/app/components/ContactGrid.tsx`
13. `apps/tracker/app/components/ActivityTimeline.tsx`
14. `apps/tracker/app/components/MetricsOverview.tsx`

### Agent Integration:
15. `apps/tracker/app/components/AgentIntegrationStatus.tsx`
16. `apps/tracker/app/components/InvokeAgentModal.tsx`
17. `apps/tracker/lib/api/agent-status.ts`
18. `apps/tracker/lib/api/invoke-agent.ts`

### Real-Time:
19. `apps/tracker/lib/realtime/campaign-subscriptions.ts`
20. `apps/tracker/app/components/LiveActivityFeed.tsx`
21. `apps/tracker/lib/collision/detect-duplicate-outreach.ts`
22. `apps/tracker/app/components/CollisionWarning.tsx`

### Reporting:
23. `apps/tracker/lib/reports/generate-campaign-report.ts`
24. `apps/tracker/app/api/reports/[id]/route.ts`
25. `apps/tracker/app/components/ExportButton.tsx`

### Demo Page:
26. `apps/tracker/app/demo/page.tsx` - Complete rebuild
27. `apps/tracker/app/components/LiveCampaignPreview.tsx`
28. `apps/tracker/app/components/DemoWalkthrough.tsx`

**Total: 28 files to create**

---

## 🛠️ TECHNICAL DEPENDENCIES

### Already Installed:
✅ Next.js 15.3.0
✅ React 19.1.0
✅ TypeScript 5.7.2
✅ Supabase client
✅ Tailwind CSS
✅ @total-audio/ui component library
✅ Anthropic SDK (for Liberty Agent)

### Need to Install:
```bash
npm install --workspace=tracker jspdf jspdf-autotable lucide-react date-fns
```

---

## 🎯 BOTTOM LINE

**You have everything you need:**
- ✅ 3 real campaigns with detailed data
- ✅ Liberty Radio Promo Agent fully built
- ✅ Google Chat integration configured
- ✅ All API integrations ready (WARM, Gmail, Monday, Mailchimp)
- ✅ Clear 24-hour roadmap
- ✅ Database schema designed
- ✅ Demo narrative written

**This is 100% buildable by Thursday 19th November.**

The demo will use REAL campaign data (not fake), showcase the REAL Liberty Agent (not mocked), and demonstrate REAL workflow value (not hypothetical).

Dan will see:
1. **KYARA campaign** - 85 real plays, Amazing Radio confirmation, actual timeline
2. **Senior Dunce campaign** - UK radio expansion strategy, 5 confirmed plays
3. **Concerta campaign** - 132 real contacts, launching soon
4. **Liberty Agent** - Streaming AI campaign strategy in real-time
5. **Real-time coordination** - Collision detection preventing duplicate outreach
6. **Professional reporting** - One-click PDF with actual campaign data

**This isn't a demo. This is a production tool using production data.**

Ready to start building? 🚀

---

**Created:** 12 November 2025
**Target Demo:** Thursday 19 November 2025
**Build Time:** 24 hours
**Campaign Data:** KYARA, Senior Dunce, Concerta (all real)
**Agent:** Liberty Radio Promo Agent (production-ready)
**Outcome:** Demo that converts to pilot agreement
