---
title: ' RADIO PROMO AGENT - MULTI-AGENT ARCHITECTURE'
notion_url: https://www.notion.so/RADIO-PROMO-AGENT-MULTI-AGENT-ARCHITECTURE-2650a35b21ed8103b8d1e9d8d3427a6d
exported_at: 2025-09-26T14:33:21.765Z
---

#  RADIO PROMO AGENT - MULTI-AGENT ARCHITECTURE

_Specialized AI agents for different aspects of radio campaign automation_

---

##  Agent Architecture Overview

**Master System**: Radio Promo Agent

**Sub-Agents**: 6 specialized agents handling distinct workflow components

### **Why Multi-Agent Architecture Makes Sense:**

-  **Specialized expertise** - each agent optimized for specific tasks

-  **Parallel processing** - multiple agents work simultaneously

-  **Easier debugging** - isolate issues to specific agents

-  **Scalable development** - build and test agents independently

-  **Maintainable code** - clear separation of concerns

-  **Flexible deployment** - enable/disable specific agents as needed

---

##  AGENT TEAM STRUCTURE

### **1.  Campaign Intelligence Agent**

**Codename**: `intelligence-agent`

**Primary Role**: Extract campaign data from Google Meet transcripts

**Specialized Capabilities**:

- Gemini transcript processing and analysis

- Campaign brief generation with standardized format

- Artist preference detection and categorization

- Budget and timeline extraction

- Genre classification and radio station matching

**Example Agent Interaction**:

```javascript
User: "Process latest artist call transcript"
Intelligence Agent: "Analyzing 45-minute call with Sarah Jones...
 Artist: Sarah Jones
 Track: 'Electric Dreams' (Indie Pop)
 Budget: £150, Timeline: 4 weeks
 Preferences: No early morning shows, focus on UK indie stations
 Campaign brief generated and ready for project creation"
```

### **2.  Project Management Agent**

**Codename**: `project-agent`

**Primary Role**: [Monday.com](http://monday.com/) integration and campaign lifecycle management

**Specialized Capabilities**:

- [Monday.com](http://monday.com/) project creation via webhooks/API

- Task timeline generation and milestone tracking

- Budget monitoring and expense tracking

- Campaign status updates and progress reporting

- Deadline management and notification scheduling

**Example Agent Interaction**:

```javascript
User: "Create campaign project for Sarah Jones"
Project Agent: "Creating Monday.com campaign...
 Project: 'Sarah Jones - Electric Dreams - Oct 2025'
 23 tasks created with deadlines
 Budget tracking: £150 allocated
 Milestones: Week 1 (Setup), Week 2-3 (Active), Week 4 (Reporting)
 Team notifications sent to Liberty members"
```

### **3.  Email Campaign Agent**

**Codename**: `email-agent`

**Primary Role**: Mailchimp automation and email campaign management

**Specialized Capabilities**:

- Liberty template analysis and pattern recognition

- Dynamic content generation based on artist/genre

- Personalized pitch creation for different station types

- Campaign scheduling and optimal timing

- Open/click rate monitoring and follow-up automation

**Example Agent Interaction**:

```javascript
User: "Generate email campaign for indie pop track"
Email Agent: "Analyzing Liberty indie templates...
 Template pattern identified: Personal + Genre-specific + Social proof
 73 indie stations targeted with personalized messages
 Subject lines optimized per station type
 Campaign scheduled for Tuesday 2:15pm (optimal timing)
 Mailchimp campaign created and ready to send"
```

### **4.  Radio Station Agent**

**Codename**: `radio-agent`

**Primary Role**: Automated radio station submissions and uploads

**Specialized Capabilities**:

- Amazing Radio browser automation and track uploads

- Wigwam Radio submission handling

- European Indie Music Network package purchasing

- Station preference mapping and targeting

- Upload status tracking and error handling

**Example Agent Interaction**:

```javascript
User: "Submit track to radio stations"
Radio Agent: "Initiating radio station submissions...
 Amazing Radio: Track uploaded successfully
 Wigwam Radio: Submission email sent
 European Indie Network: £10 package purchased
 Warmusic tracking initiated
 All submissions completed - monitoring active"
```

### **5.  Tracking & Analytics Agent**

**Codename**: `analytics-agent`

**Primary Role**: Warmusic integration and campaign performance monitoring

**Specialized Capabilities**:

- Real-time play detection via Warmusic API

- Campaign performance analytics and trending

- Success pattern recognition and optimization

- Client dashboard updates and notifications

- Predictive success scoring based on historical data

**Example Agent Interaction**:

```javascript
User: "Check campaign performance"
Analytics Agent: "Analyzing Sarah's campaign performance...
 2 confirmed plays (Amazing Radio, BBC Radio 6)
 47 total email opens (64% open rate)
 Campaign trending 23% above average
 Success probability increased to 78%
 Recommend: Extend campaign, target similar BBC stations"
```

### **6.  Coverage Book Agent**

**Codename**: `coverage-agent`

**Primary Role**: Final campaign reporting and documentation compilation

**Specialized Capabilities**:

- Multi-source data aggregation (Warmusic, emails, social media)

- Professional PDF report generation

- Screenshots and correspondence compilation

- Campaign timeline visualization

- ROI calculation and success metrics

**Example Agent Interaction**:

```javascript
User: "Generate final campaign report"
Coverage Agent: "Compiling 4-week campaign coverage...
 12 confirmed plays across 8 stations
 347 listeners reached via radio plays
 15 station email responses collected
 Professional PDF report generated (12 pages)
 Coverage book ready for client delivery"
```

---

##  AGENT COORDINATION SYSTEM

### **Master Orchestrator**

**Role**: Coordinates agent interactions and maintains campaign state

**Workflow Example**:

```javascript
1. Intelligence Agent processes call transcript
   ↓
2. Project Agent creates Monday.com campaign
   ↓
3. Email Agent generates and sends Mailchimp campaign
   ↓
4. Radio Agent handles station submissions
   ↓
5. Analytics Agent monitors performance
   ↓
6. Coverage Agent compiles final reports
```

### **Inter-Agent Communication**

```javascript
// Agent message passing example
const campaignData = await intelligenceAgent.processTranScript(transcript);
const projectId = await projectAgent.createCampaign(campaignData);
const emailCampaign = await emailAgent.generateCampaign(campaignData);
const radioStatus = await radioAgent.submitTracks(campaignData);
const analytics = await analyticsAgent.initializeTracking(campaignData);
```

---

##  DEVELOPMENT ADVANTAGES

### **Parallel Development**

- Different agents can be built simultaneously

- Test individual components before integration

- Deploy agents incrementally (MVP with 2-3 agents)

### **Specialized Optimization**

- Each agent can use different AI models/prompts

- Optimize for specific task performance

- Fine-tune prompts for specialized outputs

### **Error Isolation**

- If one agent fails, others continue working

- Easy to identify and fix specific issues

- Fallback workflows for critical agents

### **Scalability**

- Add new agents for additional features

- Replace or upgrade individual agents

- Handle increased workload by scaling specific agents

---

##  IMPLEMENTATION STRATEGY

### **Phase 1: Core Agents (Week 1-2)**

- Intelligence Agent (transcript processing)

- Project Agent ([Monday.com](http://monday.com/) integration)

- Email Agent (Mailchimp automation)

### **Phase 2: Automation Agents (Week 3-4)**

- Radio Agent (station submissions)

- Analytics Agent (Warmusic tracking)

### **Phase 3: Reporting Agent (Week 5-6)**

- Coverage Agent (final reports)

- System optimization and integration

### **Agent Development Priority**

1. **Intelligence Agent** - Foundation for all other agents

1. **Email Agent** - Highest immediate time-saving impact

1. **Analytics Agent** - Real-time value for clients

1. **Project Agent** - [Monday.com](http://monday.com/) integration

1. **Radio Agent** - Complex but high-value automation

1. **Coverage Agent** - Final piece for complete automation

---

##  AGENT PROMPTING STRATEGY

### **Specialized Agent Prompts**

Each agent gets optimized prompts for their specific domain:

**Intelligence Agent**:

```javascript
You are a campaign intelligence specialist. Extract key campaign data from artist call transcripts. Focus on: artist details, track information, budget, timeline, preferences, and special requirements. Always confirm budget and timeline explicitly.
```

**Email Agent**:

```javascript
You are a music industry email specialist. Create personalized radio station pitches that match Liberty Music PR's tone and style. Reference station preferences, similar artists, and timing. Maintain professional but friendly approach.
```

**Analytics Agent**:

```javascript
You are a campaign performance analyst. Monitor play data, email metrics, and campaign progress. Identify trends, predict success probability, and recommend optimization strategies. Provide clear, actionable insights.
```

---

##  ADVANCED AGENT FEATURES

### **Agent Learning & Improvement**

- Each agent learns from successful campaigns

- Performance feedback loops

- Pattern recognition for optimization

### **Agent Collaboration**

- Analytics Agent informs Email Agent about optimal timing

- Coverage Agent requests data from all other agents

- Project Agent coordinates timelines across all agents

### **Agent Personality**

- Each agent can have distinct communication style

- Intelligence Agent: Analytical and thorough

- Email Agent: Creative and persuasive

- Analytics Agent: Data-driven and predictive

---

**The multi-agent architecture transforms Radio Promo Agent from a single automation tool into a coordinated team of AI specialists, each expert in their domain while working together seamlessly.**

_This approach makes the system more powerful, maintainable, and scalable while providing clear separation of concerns for development and debugging._
