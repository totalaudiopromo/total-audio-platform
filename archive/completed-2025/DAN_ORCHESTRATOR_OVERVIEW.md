# Dan - Total Audio Master Orchestrator

## 🎯 What Dan Actually Is

**Dan is YOUR master orchestrator for the entire Total Audio Promo business**, not just the Liberty client work.

Dan coordinates all your operational agents across:
- Content generation
- Business operations
- Technical infrastructure
- Client campaign delivery

---

## 📊 Current Test Results

```
🧪 Dan Core Tests: 3/6 PASSED

✅ Dan Initialization - 6 agents loaded
✅ Health Check - System monitoring operational
✅ Workflow Availability - 4 workflows configured

⚠️  3 workflow execution tests failed (mock agent methods incomplete)
```

**Status**: Core orchestration logic working, needs full agent integration.

---

## 🤖 Dan Should Orchestrate These Agent Categories:

### 1. Content Agents (5)
**Location**: `/tools/agents/core-agents/content/`

- `content-generation-agent.js` - General content creation
- `audio-intel-content-agent.js` - Product-specific content for Audio Intel
- `social-media-agent.js` - Social media post automation
- `newsletter-automation-agent.js` - "The Unsigned Advantage" content
- `newsjacking-agent.js` - Trend-based content opportunities
- `music-tech-agent.js` - Music industry news and insights

### 2. Business Agents (3)
**Location**: `/tools/agents/core-agents/business/`

- `analytics-agent.js` - Business metrics tracking
- `agency-agent.js` - Client relationship management
- `chris-saas-marketing-agent.js` - Your SaaS marketing automation

### 3. Technical Agents (4)
**Location**: `/tools/agents/core-agents/technical/`

- `contact-agent.js` - Contact enrichment workflows
- `database-agent.js` - Database operations
- `agent-manager.js` - Agent lifecycle management
- `agent-dashboard.js` - Dashboard data aggregation

### 4. Campaign Agents (1+)
**Location**: `/tools/agents/core-agents/radio-promo/`

- `campaign-agent.js` - Campaign workflow automation

### 5. Client-Specific Agents
**Location**: `/tools/agents/campaigns/`

- **Liberty Music PR** → 6 sub-agents (intelligence, project, email, radio, analytics, coverage)
- **Kyara Campaign** → `liberty-agent-kyara.js`
- **Senior Dunce Campaign** → `liberty-agent-senior-dunce.js`

---

## 🏗️ Dan's Architecture (How It Should Work)

```
┌─────────────────────────────────────────────────────────────┐
│                    DAN (Master Orchestrator)                 │
│                   /tools/agents/radio-promo/dan.js          │
└─────────────────────────────────────────────────────────────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
        ▼                  ▼                  ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│   CONTENT    │  │   BUSINESS   │  │  TECHNICAL   │
│   AGENTS     │  │   AGENTS     │  │   AGENTS     │
│              │  │              │  │              │
│ • Newsletter │  │ • Analytics  │  │ • Contact    │
│ • Social     │  │ • Marketing  │  │ • Database   │
│ • Newsjack   │  │ • Agency     │  │ • Dashboard  │
│ • Music Tech │  │              │  │ • Manager    │
└──────────────┘  └──────────────┘  └──────────────┘
        │
        ▼
┌───────────────────────────────────────────────────┐
│          CLIENT CAMPAIGN ORCHESTRATION            │
│                                                   │
│  Liberty Radio Promo (6 sub-agents)              │
│  ├─ Intelligence (Google Meet processing)        │
│  ├─ Project (Monday.com automation)              │
│  ├─ Email (Liberty templates)                    │
│  ├─ Radio (Station submissions)                  │
│  ├─ Analytics (WARM API tracking)                │
│  └─ Coverage (Reporting)                         │
│                                                   │
│  Kyara Campaign                                  │
│  Senior Dunce Campaign                           │
└───────────────────────────────────────────────────┘
```

---

## 🎬 Dan's Current Workflows

### 1. **Complete Campaign** (45min)
Liberty client full radio campaign automation:
1. Process Google Meet transcript
2. Create Monday.com campaign
3. Generate email content + initiate radio submissions (parallel)
4. Setup WARM API tracking
5. Generate initial coverage report

### 2. **Transcript to Brief** (5min)
Convert meeting transcripts to campaign briefs:
1. Process transcript with Gemini AI
2. Validate brief structure

### 3. **WARM Monitoring** (continuous)
Real-time play tracking and milestone notifications

### 4. **Campaign Reporting** (15min)
Professional client deliverables:
1. Aggregate analytics data
2. Generate PDF report
3. Deliver to client

---

## 🚀 What Dan Needs Next

### Immediate Priority: Total Audio Integration

Dan currently only manages Liberty client agents. He needs to orchestrate:

1. **Newsletter Workflow**
   - Trigger `newsletter-automation-agent.js`
   - Fetch industry news via `newsjacking-agent.js`
   - Generate content via `content-generation-agent.js`
   - Distribute via ConvertKit

2. **Audio Intel Content Workflow**
   - Monitor customer acquisition metrics via `analytics-agent.js`
   - Generate case study content via `audio-intel-content-agent.js`
   - Schedule social posts via `social-media-agent.js`

3. **Contact Enrichment Workflow**
   - Bulk contact processing via `contact-agent.js`
   - Database updates via `database-agent.js`
   - Quality metrics via `analytics-agent.js`

4. **Marketing Automation Workflow**
   - Track conversion metrics via `analytics-agent.js`
   - Generate marketing content via `chris-saas-marketing-agent.js`
   - Distribute across channels via `social-media-agent.js`

---

## 📝 Dan's Configuration Needs

### Environment Variables Required

```bash
# AI Services
GEMINI_API_KEY=xxx          # For transcript processing
ANTHROPIC_API_KEY=xxx       # For content generation

# Business Tools
MONDAY_API_KEY=xxx          # Campaign project management
MAILCHIMP_API_KEY=xxx       # Email distribution
WARM_API_KEY=xxx            # Radio play tracking

# Communication
GOOGLE_CHAT_WEBHOOK=xxx     # Team notifications
DISCORD_WEBHOOK=xxx         # Community notifications

# Client Radio Portals
AMAZING_RADIO_USERNAME=xxx
AMAZING_RADIO_PASSWORD=xxx
WIGWAM_USERNAME=xxx
WIGWAM_PASSWORD=xxx
EUROPEAN_INDIE_MUSIC_EMAIL=xxx

# Database
SUPABASE_URL=xxx
SUPABASE_KEY=xxx

# Gmail OAuth (for automation)
GOOGLE_CLIENT_ID=xxx
GOOGLE_CLIENT_SECRET=xxx
GOOGLE_REFRESH_TOKEN=xxx
```

### Dashboard Port

Dan runs a verification dashboard on port 3008:
```
http://localhost:3008
```

---

## 🎯 Testing Dan

### Basic Health Check
```bash
cd /Users/chrisschofield/workspace/active/total-audio-platform/tools/agents/radio-promo
node dan.js health
```

### Run Workflow
```bash
node dan.js workflow complete-campaign path/to/transcript.txt
```

### Start Dashboard
```bash
node dan.js dashboard
# Press Ctrl+C to stop
```

### View Campaigns
```bash
node dan.js campaigns
```

### View Metrics
```bash
node dan.js metrics
```

---

## 🔧 Next Steps

### 1. Update Dan to Manage All Agents

Create `/tools/agents/radio-promo/dan-total-audio.js`:

```javascript
// Import all core agents
const NewsletterAgent = require('../core-agents/content/newsletter-automation-agent');
const SocialMediaAgent = require('../core-agents/content/social-media-agent');
const AnalyticsAgent = require('../core-agents/business/analytics-agent');
const ContactAgent = require('../core-agents/technical/contact-agent');
// ... etc

class DanTotalAudio extends Dan {
  async initializeAgents() {
    // Initialize ALL Total Audio agents
    this.agents = {
      // Content
      newsletter: new NewsletterAgent(...),
      social: new SocialMediaAgent(...),
      newsjack: new NewsjackAgent(...),

      // Business
      analytics: new AnalyticsAgent(...),
      marketing: new MarketingAgent(...),

      // Technical
      contact: new ContactAgent(...),
      database: new DatabaseAgent(...),

      // Client campaigns (existing)
      liberty: new LibertyRadioPromoAgent(...)
    };
  }
}
```

### 2. Define Total Audio Workflows

```javascript
this.workflows = {
  // Existing Liberty workflows
  'complete-campaign': { ... },

  // New Total Audio workflows
  'weekly-newsletter': {
    name: 'Generate Weekly Newsletter',
    estimatedTime: 20,
    steps: [
      { agent: 'newsjack', action: 'fetchTrends' },
      { agent: 'newsletter', action: 'generateContent' },
      { agent: 'newsletter', action: 'distribute' }
    ]
  },

  'audio-intel-case-study': {
    name: 'Create Audio Intel Case Study',
    estimatedTime: 15,
    steps: [
      { agent: 'analytics', action: 'fetchMetrics' },
      { agent: 'audioIntel', action: 'generateCaseStudy' },
      { agent: 'social', action: 'distributeContent' }
    ]
  },

  'contact-enrichment-batch': {
    name: 'Bulk Contact Enrichment',
    estimatedTime: 30,
    steps: [
      { agent: 'contact', action: 'enrichBatch' },
      { agent: 'database', action: 'updateRecords' },
      { agent: 'analytics', action: 'trackQuality' }
    ]
  }
};
```

### 3. Create Unified Dashboard

Dan's dashboard should show:
- All active workflows across business and client work
- Agent health status (31+ agents)
- Campaign progress (Liberty + your own marketing)
- System metrics (time savings, success rates)

---

## 💡 The Vision

**Dan = Your Digital Operations Manager**

Instead of manually running:
- Newsletter generation scripts
- Social media posting
- Contact enrichment jobs
- Client campaign workflows
- Analytics reporting

You tell Dan what to do, and he orchestrates all the agents:

```bash
# Generate this week's newsletter
node dan.js workflow weekly-newsletter

# Run Audio Intel customer acquisition workflow
node dan.js workflow audio-intel-acquisition

# Process new Liberty campaign
node dan.js workflow complete-campaign transcript.txt
```

Dan handles:
- Agent coordination
- Error recovery
- Progress tracking
- Notifications
- Quality verification
- Metrics reporting

---

## 📊 Current Status Summary

**✅ What Works:**
- Core orchestration logic
- Agent lifecycle management
- Workflow execution engine
- Health monitoring
- Dashboard API structure
- Error recovery system

**⚠️  What Needs Work:**
- Expand from 6 Liberty agents → 31+ Total Audio agents
- Add Total Audio-specific workflows
- Integrate all core agents (content, business, technical)
- Connect to existing agent scripts
- Full environment variable setup
- Production dependency installation (puppeteer, etc.)

**🎯 Bottom Line:**

Dan is your main orchestrator for **everything** at Total Audio Promo - he just needs to be expanded from Liberty-only to managing your full agent ecosystem.

---

**Last Updated**: October 18, 2025
**Dan Version**: 1.0.0
**Test Status**: Core logic validated (3/6 tests passing)
**Next**: Expand to manage all 31+ Total Audio agents
