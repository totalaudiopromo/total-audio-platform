# GENSPARK x CLAUDE BUSINESS CONTEXT HAND-OFF

**Primary Objective:**
Drive £500/month recurring revenue via customer acquisition and business automation through Audio Intel (Total Audio Promo SaaS suite).

**Purpose:**
This document provides Claude Code with complete business context to generate instructions, prompts, custom data, dashboards, and automation structures for use within Genspark Super Agent, AI Sheets, Slides, and research/report features.

**Agent Orchestration Permission:**
You may break down tasks between research, writing, validation, and reporting agents. Select the optimal models (e.g., ChatGPT, Claude, Gemini) and external APIs (Supabase, Crunch, ConvertKit, Notion) as needed for advanced analysis and automation.

**Example Initial Command:**

```
Super Agent, using the context provided, generate a professional weekly KPI dashboard for Total Audio Promo in XLSX with tool-specific brand colours and source data columns. Prioritise automation and format for mobile. Include tabs for: (1) Executive Summary, (2) Customer Acquisition by Segment, (3) Revenue Tracking toward £500/month, (4) Product Performance, (5) Charts & Visualisations.
```

**Structured Output Schema (Required):**

- **XLSX Reports:** Always include Data, Charts, Methodology, and Raw Data tabs
- **PDF Reports:** Always include Executive Summary, Detailed Analysis, Appendix with Methodology
- **Google Slides:** Always include slide count (8-12), speaker notes, PDF export option
- **Markdown (Notion):** Always include Date, Author, Data Sources, Last Updated, clickable links to source documents

---

## 1. BUSINESS PROFILE BLOCK

### Niche

UK-based music promotion technology and creative services serving independent artists, radio promoters, and PR agencies.

**CRITICAL: This handoff covers ONLY Total Audio Promo (production SaaS suite).**

**NOT covered in this handoff:**

- TotalAud.io (separate experimental project with different brand system)
- If you need TotalAud.io context, request TOTALAUD_IO_CONTEXT.md separately

### Ideal Customer

**Primary Segments (Proven Conversion Rates):**

1. **Radio Promoters** (85% conversion rate - HIGHEST PRIORITY)
   - Profile: Music industry professionals managing radio campaigns
   - Pain Point: 15+ hours per campaign on manual contact research
   - Value: Professional time savings, organised data instead of Excel chaos

2. **Solo Artists with Budget** (60% conversion)
   - Profile: Independent artists with promotion budgets
   - Pain Point: Weekends spent researching instead of creating music
   - Value: Reclaim creative time, professional campaign results

3. **PR Agencies** (70% conversion)
   - Profile: Small PR agencies and management companies
   - Pain Point: Junior staff spending hours on repetitive contact research
   - Value: Staff efficiency, multi-client processing capability

### Products/Services

**Total Audio Promo SaaS Suite (Production Apps):**

1. **Audio Intel** - Contact enrichment & validation SaaS
   - Brand Colour: Electric Blue (#2563EB / blue-600)
   - 100% enrichment success rate
   - "15 hours → 15 minutes" contact research time savings
   - Real competition: Manual Excel chaos, not submission platforms
   - Live: https://intel.totalaudiopromo.com

2. **Pitch Generator** - Personalised pitch generation at scale
   - Brand Colour: Amber (#F59E0B / amber-500)
   - AI-powered personalisation
   - Authentic voice preservation (VoiceGuard system)
   - Live: https://pitch.totalaudiopromo.com

3. **Campaign Tracker** - CRM-style radio submission tracking
   - Brand Colour: Teal/Cyan (#14B8A6 / teal-500)
   - Campaign performance analytics
   - Follow-up automation
   - Live: https://tracker.totalaudiopromo.com

4. **Command Centre** - Personal productivity dashboard
   - Brand Colour: Violet (#7c3aed / violet-600)
   - Newsletter management
   - Social media automation
   - MCP ecosystem integration

**IMPORTANT: Each tool has its own signature colour. There is NO single "Total Audio Promo brand colour".**

### Pricing/Models

**Audio Intel Tiers:**

- FREE: 10 enrichments (lead generation)
- PRO: £19/month (individual promoters/artists)
- AGENCY: £79/month (multi-client agencies)

**Business Model:**

- B2B SaaS subscription (Audio Intel focus)
- Customer acquisition phase: 0 → £500/month target (November 2025)
- Revenue validation BEFORE major feature expansion

### Transformation/Value

**For Radio Promoters:**

- Save 15+ hours per campaign on contact research
- Transform manual Excel chaos into professional database
- Real enrichment: BBC Radio 6 Music contacts, local radio stations
- Industry credibility: Built by someone with 5+ years radio promotion experience

**For Independent Artists:**

- Reclaim weekends for music creation instead of research
- Professional campaign results without hiring agencies
- Authentic pitches that preserve creative voice

**For PR Agencies:**

- Junior staff efficiency (15+ hours → 15 minutes per client)
- Multi-client processing with AGENCY tier
- Professional data organisation and reporting

**Overall Transformation:**

- "Make marketing music as creative as making it"
- AI augmentation, not automation ("AI as your promo crew")
- 100% contact enrichment success rate (proven)
- UK market focus with authentic industry insider approach

---

## 2. DATA INPUTS/ASSETS YOU USE

### Databases & Infrastructure

**Supabase (Primary Database):**

- Shared authentication across all apps
- `agent_manifests` - Multi-agent system configurations
- `campaign_dashboard_metrics` - Performance tracking (7/30-day aggregates)
- `epk_analytics` - EPK asset tracking with region/device analytics
- Real-time subscriptions for live dashboard updates
- Database URL: https://ucncbighzqudaszewjrv.supabase.co

**Vercel (Total Audio Promo Deployment):**

- Production SaaS suite hosting
- Separate deployments: Audio Intel, Pitch Generator, Tracker, Command Centre
- CI/CD pipeline with GitHub Actions integration

### Business Records & CRM

**Workspace Automation:**

- **Notion**: Documentation, templates, business notes
- **WEEKLY_FOCUS.md**: Current week's priorities and daily progress (CHECK FIRST)
- **AUDIO_INTEL_CONTEXT.md**: Complete business model and customer segments
- **BUSINESS_NOTES.md**: Running log of decisions, feedback, insights

**Customer Acquisition Tracking:**

- Demo call conversions (target: 2+ weekly)
- Beta signups (target: 5+ weekly)
- Newsletter subscribers: "The Unsigned Advantage" (target: 25+ monthly)
- tracker.totalaudiopromo.com for campaign management

**Accounting & Financial:**

- Crunch for UK accounting and financial reports
- Revenue target: £500/month by November 2025
- Customer LTV tracking across segments

### Email & Communication

**Gmail (MCP Integration Active):**

- Campaign management and outreach
- Auto-sorting and ConvertKit integration
- OAuth setup available via `./quick-oauth-setup.sh`

**Newsletter System:**

- "The Unsigned Advantage" newsletter (operational)
- ConvertKit for distribution
- Newsjacker integration for AI-powered content
- Dashboard: `/newsletter-dashboard`
- 6 specialized API routes for content generation

**Social Media Automation:**

- Twitter, LinkedIn, BlueSky, Threads
- Underground music industry content fetching
- Notion sync for scheduling

### Development & Code Assets

**GitHub Repository:**

- Total Audio Platform: github.com/totalaudiopromo/total-audio-platform
- CI/CD via GitHub Actions (ci.yml + golden-verify.yml)

**MCP Ecosystem (14+ Servers):**

- Notion (workspace automation)
- Puppeteer (browser automation)
- Gmail (email automation)
- Google Drive (file management)
- GitHub (repository management)
- YouTube Transcript (content extraction)

**Testing Infrastructure:**

- 529 tests across Total Audio Platform
- Mobile testing suite (Playwright configuration)
- Agent-based testing system (Component Analyzer, Test Generator, Cross-App Orchestrator)

### Content & Marketing Assets

**Google Drive:**

- Marketing materials and case studies
- Real enrichment success stories (BBC Radio 6 Music contacts)
- Customer testimonials and demo scripts

**Documentation Structure:**

- WEEKLY_FOCUS.md - Weekly priorities (update weekly)
- AUDIO_INTEL_CONTEXT.md - Business model (update for product changes)
- BUSINESS_NOTES.md - Decisions log (append with date)
- .claude/CLAUDE.md - Technical architecture (update for major changes)

---

## 3. MAIN TASKS/WORKFLOWS FOR AUTOMATION

### Customer Acquisition Automation

**Priority 1: Radio Promoter Outreach (85% conversion)**

- LinkedIn prospect identification and scoring
- Personalised outreach message generation (authentic industry voice)
- Demo call scheduling automation
- Follow-up sequence optimisation

**Priority 2: Demo Call Conversion**

- Demo script refinement based on conversion data
- Live contact enrichment demonstration automation
- Post-demo follow-up sequences
- Success case study extraction from demo outcomes

**Priority 3: Content Marketing**

- "The Unsigned Advantage" newsletter content generation
- Social media content calendar (Twitter, LinkedIn, BlueSky, Threads)
- Underground music industry news aggregation
- Customer acquisition content distribution

### Business Intelligence & Reporting

**KPI Dashboards (Weekly/Monthly):**

- Customer acquisition metrics (demo calls, signups, conversions)
- Revenue tracking (£500/month target progress)
- Newsletter performance (open rate target: 40%+)
- Segment conversion rates (Radio: 85%, Artists: 60%, Agencies: 70%)
- Contact enrichment success rate (maintain 100%)

**Market Analysis:**

- Competitor analysis (UK music promotion tools)
- Customer segment research and validation
- Pricing strategy optimisation
- Industry trend analysis (radio promotion, independent music)

**Campaign Analytics:**

- Audio Intel usage patterns and enrichment quality
- Pitch Generator personalisation effectiveness
- Campaign Tracker engagement metrics
- Customer retention and churn analysis

### Operational Automation

**Newsletter System:**

- News fetching from multiple APIs (NewsAPI, music industry sources)
- AI content generation via Anthropic Claude
- Template formatting and distribution
- ConvertKit integration for sending
- Performance tracking (open rates, click rates)

**Testing & Quality Assurance:**

- Mobile UX validation (WCAG 2.2 Level AA compliance)
- Component analysis for accessibility issues
- Test generation for identified issues
- Performance monitoring (Core Web Vitals)

**Development Workflow:**

- CI/CD pipeline monitoring (GitHub Actions + Vercel)
- Deployment health checks (golden-verify.yml)
- Lockfile synchronisation validation
- Build failure diagnostics

### Financial & Accounting

**Monthly Reports:**

- Revenue breakdown by product tier (FREE, PRO, AGENCY)
- Customer acquisition cost (CAC) analysis
- Monthly recurring revenue (MRR) tracking
- Profit/loss statements via Crunch integration

**Forecasting:**

- £500/month revenue milestone tracking
- Customer lifetime value projections
- Segment growth predictions
- Cash flow forecasting

---

## 4. INSTRUCTION PROMPTS FOR GENSPARK SUPER AGENT

### Market Analysis Prompts

```
Act as a UK music industry analyst. Using the business description above (Total Audio Promo SaaS suite), generate a comprehensive competitive analysis including:

1. UK music promotion tool landscape (identify 10-15 direct/indirect competitors)
2. Feature comparison matrix (contact enrichment, pitch generation, campaign tracking)
3. Pricing strategy analysis (position £19 PRO and £79 AGENCY tiers)
4. Competitive advantages (authentic industry credibility, 100% enrichment success, mobile-first UX)
5. Market positioning recommendations for customer acquisition phase

Format: XLSX with tabs for (1) Competitor Matrix, (2) Feature Comparison, (3) Pricing Analysis, (4) SWOT Analysis
Design: Use tool-specific colours (Audio Intel: #2563EB, Tracker: #14B8A6, Pitch: #F59E0B) for visual separation
```

```
Create a 90-day customer acquisition strategy for Audio Intel targeting:
- Radio promoters (85% conversion, HIGHEST PRIORITY)
- Solo artists with budget (60% conversion)
- PR agencies (70% conversion)

Include:
1. LinkedIn outreach sequences (personalised, authentic industry voice)
2. Demo call conversion tactics (live contact enrichment demonstrations)
3. Case study content calendar (real BBC Radio 6 Music enrichment examples)
4. Newsletter growth strategy ("The Unsigned Advantage" - target 40%+ open rate)
5. Social media content themes (Twitter, LinkedIn, BlueSky, Threads)
6. Weekly/monthly milestones toward £500/month revenue target

Format: Google Slides presentation + XLSX execution tracker
Design: Use Electric Blue (#2563EB) as primary accent (Audio Intel brand colour)
```

### Business Intelligence Prompts

```
Generate a comprehensive KPI dashboard visualising:

**Customer Acquisition Metrics:**
- Demo calls booked (weekly target: 2+)
- Beta signups (weekly target: 5+)
- Newsletter subscribers (monthly growth target: 25+)
- Conversion funnel by segment (Radio: 85%, Artists: 60%, Agencies: 70%)

**Revenue Metrics:**
- Monthly recurring revenue (MRR) toward £500/month target
- Customer acquisition cost (CAC) by segment
- Customer lifetime value (LTV) projections
- Churn rate tracking

**Product Metrics:**
- Audio Intel enrichment success rate (maintain 100%)
- Contact research time savings ("15 hours → 15 minutes")
- Mobile UX performance (WCAG AA compliance)
- Newsletter open rate (target: 40%+)

Data Sources: Supabase analytics, Notion workspace, ConvertKit, Crunch accounting
Format: Interactive dashboard (Genspark AI Sheets) with auto-refresh
Design: Use tool-specific colours for each product section (Intel: #2563EB, Tracker: #14B8A6, Pitch: #F59E0B)
```

```
Create a monthly business performance report including:

1. Executive Summary (progress toward £500/month, key wins, blockers)
2. Customer Acquisition Analysis (segment breakdown, conversion rates, demo quality)
3. Product Performance (enrichment quality, user engagement, feature adoption)
4. Financial Overview (revenue, costs, burn rate, runway)
5. Competitive Intelligence (market shifts, new competitors, positioning updates)
6. Strategic Recommendations (next 30-day priorities)

Data Sources: WEEKLY_FOCUS.md, BUSINESS_NOTES.md, Supabase, Crunch, ConvertKit
Format: PDF report + Google Slides presentation (8-10 slides)
Design: Professional UK business report style with tool-specific colour coding
```

### Content Generation Prompts

```
Act as a music industry insider with 5+ years radio promotion experience. Generate a one-month marketing content calendar for Total Audio Promo targeting:

**Audience Segments:**
- Radio promoters (technical, time-saving focus)
- Independent artists (creative freedom, weekend reclamation)
- PR agencies (staff efficiency, multi-client processing)

**Content Themes:**
- Contact enrichment case studies (real BBC Radio 6 Music examples)
- Time-saving testimonials ("15 hours → 15 minutes")
- Industry credibility (authentic insider approach, no corporate speak)
- Mobile-first UX demos
- Newsletter highlights ("The Unsigned Advantage")

**Platforms:**
- LinkedIn (professional outreach)
- Twitter (industry engagement)
- BlueSky (underground music community)
- Threads (creative conversation)

**Formats:**
- Short-form posts (280 characters, authentic British voice)
- Case study threads (3-5 tweets with enrichment examples)
- Newsletter content (40%+ open rate target)
- Demo script refinements (conversion optimisation)

**Engagement Metrics:**
- Target engagement rates by platform
- CTA optimization (demo calls, beta signups)
- Conversion tracking to £500/month goal

Format: XLSX calendar with (1) Daily posts, (2) Content assets needed, (3) Performance tracking
Design: Use Audio Intel blue (#2563EB) for primary brand presence
```

```
Generate 5 customer acquisition case studies based on real Audio Intel enrichment results:

**Case Study Structure:**
1. Customer Profile (radio promoter/artist/agency)
2. Challenge (manual Excel chaos, 15+ hours research time)
3. Solution (Audio Intel enrichment workflow)
4. Results (time saved, contact quality, campaign success)
5. Quote (authentic industry voice, British casual-professional tone)

**Real Examples to Reference:**
- BBC Radio 6 Music contact enrichment
- Local radio station database building
- PR agency multi-client processing

**Output Formats:**
- PDF case study documents (2 pages each)
- LinkedIn carousel posts (6-8 slides per case study)
- Newsletter feature content (800-1000 words)
- Demo call talking points

Data Sources: AUDIO_INTEL_CONTEXT.md, BUSINESS_NOTES.md, customer feedback logs
Design: Use Electric Blue (#2563EB) accent throughout
```

### Technical & Operational Prompts

```
Act as a DevOps analyst. Review the Total Audio Platform CI/CD pipeline and generate:

1. Pipeline Health Report
   - GitHub Actions status (ci.yml + golden-verify.yml)
   - Vercel deployment success rates (Audio Intel, Pitch, Tracker, Command Centre)
   - Build failure diagnostics (lockfile sync, dependency issues)

2. Performance Metrics
   - Build times by app (target: <5 minutes)
   - Deployment frequency (target: daily merges to main)
   - Test suite execution time (529 tests across platform)
   - Mobile UX compliance (WCAG 2.2 Level AA validation)

3. Recommendations
   - Optimisation opportunities (parallel builds, caching)
   - Testing coverage gaps (expand beyond 529 tests)
   - Deployment automation improvements
   - Lockfile synchronisation safeguards

Data Sources: .github/workflows/, vercel.json configs, test results
Format: PDF report + XLSX metrics tracker with weekly monitoring
Design: Technical documentation style with colour-coded status indicators
```

```
Create an investor pitch deck for Total Audio Promo covering:

**Slides (10-12 total):**
1. Problem Statement (15+ hours manual contact research per campaign)
2. Solution (Audio Intel contact enrichment SaaS)
3. Market Opportunity (UK independent music industry, radio promotion sector)
4. Product Demo (100% enrichment success rate, "15 hours → 15 minutes")
5. Business Model (FREE/PRO/AGENCY tiers: £19-£79/month)
6. Customer Segments (Radio: 85%, Artists: 60%, Agencies: 70% conversion)
7. Competitive Advantage (authentic industry credibility, mobile-first UX)
8. Traction (customer acquisition metrics, newsletter growth)
9. Technology (Supabase, Vercel, MCP ecosystem, 529 tests)
10. Financial Projections (£500/month milestone, LTV/CAC analysis)
11. Team (5+ years radio promotion experience, full-stack development)
12. Ask (funding round, milestones, use of funds)

**Design Requirements:**
- Tool-specific colour coding (Intel: #2563EB, Tracker: #14B8A6, Pitch: #F59E0B, Command: #7c3aed)
- Professional but authentic (no corporate speak)
- UK market focus (£GBP, British spelling)
- Mobile-first screenshots
- Real enrichment case study examples

Format: Google Slides + Speaker notes + PDF export
```

### Agent & Automation Design Prompts

```
Design a multi-agent workflow for "The Unsigned Advantage" newsletter automation:

**Agent 1: ContentScout**
- Role: Fetch underground music industry news from multiple sources
- Tools: NewsAPI, Perplexity, YouTube Transcript MCP
- Output: Curated news items with relevance scores

**Agent 2: ContentDraft**
- Role: Generate newsletter content using Anthropic Claude
- Input: ContentScout results + editorial guidelines
- Output: 800-1000 word newsletter draft (authentic British voice)

**Agent 3: VoiceGuard**
- Role: Enforce tone and brand voice
- Validation: No corporate speak, authentic industry insider, British casual-professional
- Output: Approved draft or revision suggestions

**Agent 4: DistributionCoordinator**
- Role: Format and send via ConvertKit
- Validation: Template formatting, segmentation (radio/artists/agencies)
- Output: Scheduled campaign + performance tracking

**Orchestration Flow:**
1. ContentScout → runs weekly (Monday 9am UK)
2. ContentDraft → triggered by ContentScout completion
3. VoiceGuard → reviews draft (human approval checkpoint)
4. DistributionCoordinator → sends on Thursday 10am UK

**Metrics:**
- Newsletter open rate (target: 40%+)
- Click-through rate by segment
- Demo call conversions from newsletter
- Subscriber growth (target: 25+ monthly)

Format: Workflow diagram (visual flowchart) + Implementation spec (Markdown)
Design: Use Command Centre violet (#7c3aed) for automation system visuals
```

---

## 5. INTEGRATION NOTES

### Tools/Platforms Connected

**Database & Infrastructure:**

- ✅ Supabase (shared authentication, real-time analytics)
- ✅ Vercel (Total Audio Promo production deployments)
- ✅ GitHub (repository management, CI/CD workflows)

**Communication & Marketing:**

- ✅ Gmail (MCP integration, OAuth configured via `./quick-oauth-setup.sh`)
- ✅ ConvertKit (newsletter distribution, subscriber management)
- ✅ Notion (workspace automation, documentation, templates)
- ✅ Social Media APIs (Twitter, LinkedIn, BlueSky, Threads)

**Development & Automation:**

- ✅ MCP Ecosystem (14+ servers operational)
  - Notion, Puppeteer, Gmail, Google Drive, GitHub, YouTube Transcript
- ✅ Anthropic Claude (AI content generation, agent orchestration)
- ✅ Perplexity (contact enrichment API - core Audio Intel feature)
- ✅ NewsAPI (newsletter content sourcing)

**Accounting & Financial:**

- ✅ Crunch (UK accounting, financial reports, tax compliance)
- ⚠️ Stripe (payment processing - ready for revenue launch)

**Testing & Quality:**

- ✅ Playwright (mobile testing, WCAG AA validation)
- ✅ Vitest (unit testing, 529 tests Total Audio)
- ✅ ESLint + Prettier (code quality, TypeScript strict mode)

### Data Access Permissions

**You may reference all of the following:**

✅ **Documentation:**

- WEEKLY_FOCUS.md (current priorities and daily progress)
- AUDIO_INTEL_CONTEXT.md (business model and customer segments)
- BUSINESS_NOTES.md (decisions log and insights)
- .claude/CLAUDE.md (technical architecture)

✅ **Databases:**

- Supabase tables (agent_manifests, campaign_dashboard_metrics, epk_analytics)
- Customer data (pseudonymised for privacy compliance)
- Analytics and performance metrics

✅ **Notion Workspace:**

- Business templates and documentation
- Customer feedback logs
- Content calendar and social media planning

✅ **Gmail & ConvertKit:**

- Newsletter performance data
- Email campaign analytics
- Subscriber engagement metrics

✅ **Crunch Accounting:**

- Financial reports and statements
- Revenue tracking (£500/month target progress)
- Customer acquisition cost (CAC) and lifetime value (LTV) data

✅ **GitHub Repositories:**

- CI/CD pipeline status and logs
- Test results and code quality metrics
- Deployment history and health checks

✅ **Tracker Dashboard:**

- Campaign performance data (tracker.totalaudiopromo.com)
- Customer usage patterns
- Feature adoption metrics

### Privacy & Compliance Constraints

**GDPR Compliance (UK Market):**

- Always pseudonymise customer data in reports
- Never expose personal contact information in generated content
- Reference enrichment "success rates" not individual contact details
- Newsletter subscriber data: aggregated metrics only

**Security Requirements:**

- Environment variables NEVER exposed in reports/dashboards
- API keys referenced as `<redacted>` in generated configs
- Authentication tokens excluded from generated code/prompts

**Brand Voice Enforcement:**

- Always British spelling (colour, behaviour, optimise, analyse)
- Authentic industry insider tone (no corporate speak)
- Reference Chris's 5+ years radio promotion experience for credibility
- UK market focus (£GBP currency, British conventions)

---

## 6. OUTPUT FORMATS/BEST PRACTICES

### Spreadsheets & Data (XLSX/CSV)

**Format Standards:**

- XLSX for complex multi-tab workbooks
- CSV for single-table data exports
- Always include: (1) Data tab, (2) Charts tab, (3) Methodology tab, (4) Raw Data tab

**Chart Requirements:**

- Use tool-specific colours: Audio Intel (#2563EB), Tracker (#14B8A6), Pitch (#F59E0B), Command Centre (#7c3aed)
- Mobile-friendly layouts (readable on small screens)
- Clear legends and axis labels
- Include data sources and last updated timestamp

**Example Structures:**

**KPI Dashboard Spreadsheet:**

- Tab 1: Executive Summary (key metrics, trends)
- Tab 2: Customer Acquisition (demo calls, signups, conversions by segment)
- Tab 3: Revenue Tracking (MRR, CAC, LTV, £500/month progress)
- Tab 4: Product Performance (enrichment success, engagement, features)
- Tab 5: Charts & Visualisations
- Tab 6: Raw Data & Methodology

**Content Calendar Spreadsheet:**

- Tab 1: Daily Posts (date, platform, content, CTA, segment)
- Tab 2: Content Assets (images, case studies, links)
- Tab 3: Performance Tracking (engagement, conversions, revenue impact)
- Tab 4: Editorial Guidelines (voice, tone, British spelling)

### Presentations (PPTX/Google Slides)

**Design Standards:**

- Tool-specific colour system: Audio Intel (#2563EB), Tracker (#14B8A6), Pitch (#F59E0B), Command Centre (#7c3aed)
- Inter or similar clean sans-serif font (consistent with Total Audio Promo)
- Mobile-first layout (readable on tablets/phones)
- Professional but authentic (no corporate stock imagery)

**Slide Structure Templates:**

**Investor Pitch (10-12 slides):**

1. Problem (15+ hours manual research chaos)
2. Solution (Audio Intel 100% enrichment success)
3. Market (UK independent music, radio promotion)
4. Demo (real BBC Radio 6 Music enrichment case)
5. Business Model (FREE/PRO/AGENCY tiers)
6. Traction (85%/60%/70% segment conversions)
7. Competitive Advantage (authentic industry credibility)
8. Technology (Supabase, MCP, 529 tests)
9. Financials (£500/month milestone, projections)
10. Team (5+ years radio promotion experience)
11. Ask (funding, milestones, use of funds)

**Monthly Business Review (8-10 slides):**

1. Executive Summary (wins, blockers, £500/month progress)
2. Customer Acquisition (demo calls, signups, conversion rates)
3. Product Performance (enrichment quality, engagement)
4. Revenue & Financials (MRR, CAC, LTV)
5. Marketing & Content (newsletter, social, case studies)
6. Technology & Operations (CI/CD, testing, deployments)
7. Competitive Intelligence (market shifts, positioning)
8. Next 30 Days (priorities, milestones, resources needed)

### Reports (PDF/Markdown)

**PDF Reports:**

- Always include: (1) Executive Summary, (2) Detailed Analysis, (3) Appendix with Methodology
- Maximum 10 pages for executive reports
- British spelling and £GBP currency throughout
- Footer: "Generated by Claude x Genspark | [Date] | Total Audio Promo"

**Markdown Reports (for Notion):**

- H1 for main title
- H2 for major sections
- H3 for subsections
- Always include: Date, Author, Data Sources, Last Updated
- Use tables for comparative data
- Use bullet lists for recommendations
- Include links to source documents (WEEKLY_FOCUS.md, AUDIO_INTEL_CONTEXT.md)

**Example Report Structure:**

```markdown
# Monthly Business Performance Report

**Date:** [Current Month YYYY]
**Author:** Claude x Genspark Super Agent
**Data Sources:** Supabase, Notion, Crunch, ConvertKit, WEEKLY_FOCUS.md
**Last Updated:** [Timestamp]

---

## Executive Summary

[3-5 bullet points: key wins, blockers, £500/month progress]

## Customer Acquisition Analysis

### Radio Promoters (85% conversion)

- [Demo calls, conversions, case studies]

### Solo Artists (60% conversion)

- [Beta signups, newsletter growth, conversions]

### PR Agencies (70% conversion)

- [Outreach, demos, AGENCY tier interest]

## Product Performance

- Audio Intel enrichment success: [X]%
- Contact research time savings: "15 hours → 15 minutes"
- Mobile UX compliance: WCAG 2.2 Level AA ✅

## Revenue & Financials

- Monthly Recurring Revenue (MRR): £[X]
- Progress to £500/month: [X]%
- Customer Acquisition Cost (CAC): £[X]
- Customer Lifetime Value (LTV): £[X]

## Strategic Recommendations

1. [Action item with expected impact]
2. [Action item with expected impact]
3. [Action item with expected impact]

---

**Appendix: Methodology**
[Data collection methods, calculation formulas, assumptions]
```

### Code Blocks & Configuration

**Always provide:**

1. Copy-pasteable code block (fenced with triple backticks)
2. Clear comments explaining each section
3. Environment variable placeholders (never expose real values)
4. Example usage or test commands

**Example Format:**

```typescript
// Audio Intel Contact Enrichment Agent
// Purpose: Automate contact research for radio promoters
// Dependencies: Anthropic Claude API, Perplexity API, Supabase

import { createClient } from '@supabase/supabase-js';
import Anthropic from '@anthropic-ai/sdk';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!, // Never commit actual keys
});

async function enrichContact(contactName: string, station: string) {
  // 1. Fetch contact data via Perplexity API
  // 2. Validate enrichment quality (100% success target)
  // 3. Store in Supabase with audit trail
  // 4. Return enriched contact object
}

// Example usage:
// const enriched = await enrichContact("John Smith", "BBC Radio 6 Music")
```

### Dashboard & Automation Structures

**Genspark AI Sheets Format:**

- Always include: (1) Live data connections, (2) Auto-refresh intervals, (3) Chart visualisations
- Use formulas for dynamic calculations (no hardcoded values)
- Include validation rules for data integrity
- Export format: XLSX with embedded refresh macros

**Notion Integration Format:**

- Markdown tables for structured data
- Database properties for filtering/sorting
- Relation fields for cross-referencing (WEEKLY_FOCUS ↔ BUSINESS_NOTES)
- Rollup formulas for aggregations (total demos, total conversions)

**Save Locations:**

- **Executive Reports** → Notion "Business Intelligence" database
- **KPI Dashboards** → Genspark workspace + Notion embed
- **Content Calendars** → Notion "Marketing" database + Google Sheets sync
- **Financial Reports** → Notion "Finance" database (link to Crunch)
- **Case Studies** → Notion "Customer Success" database

### Quality Assurance Checklist

Before finalising any output, verify:

✅ **British Spelling:**

- colour, behaviour, optimise, analyse, centre (not center)
- Exception: Framework conventions (React, Tailwind)

✅ **Currency:**

- Always £GBP for pricing and financial data
- Never use $ USD unless explicitly comparing markets

✅ **Tone & Voice:**

- Authentic industry insider (5+ years radio promotion)
- British casual-professional ("tbh", "if you get a sec", "Right, so...")
- No corporate speak or forced lowercase

✅ **Data Privacy:**

- Customer data pseudonymised
- No personal contact information exposed
- API keys/tokens redacted as `<redacted>`

✅ **Mobile-First:**

- All visualisations readable on mobile devices
- Charts and tables optimised for small screens
- Presentations work on tablets

✅ **Brand Consistency:**

- Tool-specific colour system: Audio Intel (#2563EB), Tracker (#14B8A6), Pitch (#F59E0B), Command Centre (#7c3aed)
- Inter or similar clean font
- Professional but not corporate aesthetic

✅ **Actionability:**

- Every report includes clear next steps
- Every dashboard links to source data
- Every recommendation has expected impact metric

---

## 7. STRATEGIC CONTEXT FOR CLAUDE

### Current Business Phase (November 2025)

**Total Audio Promo = Customer Acquisition Mode**

- Focus: First paying customers through proven segments (Radio: 85%, Artists: 60%, Agencies: 70%)
- Goal: £500/month recurring revenue by end of November 2025
- Constraint: 2-hour max sessions (Chris has day job at Postman)
- Philosophy: Foundation complete, revenue validation BEFORE major feature expansion

### Decision Framework for Genspark Prompts

**When generating automation/dashboards, always ask:**

1. **Customer Acquisition Impact:** Will this help acquire first paying customers for Audio Intel?
   - If YES → High priority for Total Audio Promo
   - If NO → Defer until after revenue proof point

2. **Revenue Validation:** Does this support £500/month milestone tracking?
   - If YES → Include in KPI dashboards and financial reports
   - If NO → Defer until after revenue proof point

3. **Segment Focus:** Which customer segment benefits most?
   - Radio Promoters (85% conversion) → HIGHEST PRIORITY
   - Solo Artists (60%) → Content marketing and free tier focus
   - PR Agencies (70%) → AGENCY tier and multi-client features

4. **Time Efficiency:** Can this be executed within 2-hour development sessions?
   - If YES → Immediate implementation
   - If NO → Break into smaller milestones or defer

5. **Authentic Credibility:** Does this leverage Chris's 5+ years radio promotion experience?
   - If YES → Emphasise in outreach, case studies, demo scripts
   - If NO → Ensure it doesn't conflict with authentic industry voice

### Common Genspark Use Cases

**High-Priority Automation Requests:**

1. **Customer Acquisition Dashboards**
   - Weekly demo call tracking (target: 2+ per week)
   - Segment conversion funnels (Radio/Artists/Agencies)
   - Newsletter performance ("The Unsigned Advantage" - 40%+ open rate target)
   - £500/month revenue milestone progress

2. **Market Research & Competitive Analysis**
   - UK music promotion tool landscape
   - Competitor feature/pricing comparison
   - Customer segment validation (survey analysis)
   - Industry trend reports (radio promotion, independent music)

3. **Content Generation**
   - Case study creation from enrichment success stories
   - Newsletter content automation (authentic British voice)
   - Social media content calendars (LinkedIn, Twitter, BlueSky, Threads)
   - Demo script optimisation (conversion improvement)

4. **Financial Forecasting**
   - £500/month milestone tracking and projections
   - Customer Acquisition Cost (CAC) vs Lifetime Value (LTV) analysis
   - Segment profitability comparison (FREE vs PRO vs AGENCY)
   - Cash flow forecasting with Crunch integration

5. **Operational Efficiency**
   - CI/CD pipeline monitoring (GitHub Actions + Vercel)
   - Testing coverage gaps analysis (expand beyond 529 tests)
   - Newsletter automation workflow optimisation
   - Multi-agent collaboration design (ContentScout → Draft → VoiceGuard → Distribution)

### British Spelling Reference (Always Use)

**Common UK vs US Differences:**

- colour (not color)
- behaviour (not behavior)
- centre (not center)
- optimise (not optimize)
- analyse (not analyze)
- licence (noun, not license)
- practise (verb, not practice)
- organisation (not organization)
- realise (not realize)
- catalogue (not catalog)

**Exception:** Framework conventions retain US spelling:

- React component props: `color="#2563EB"`
- Tailwind classes: `bg-slate-800 text-center`
- JavaScript APIs: `document.getElementById()`

### Brand Voice Guidelines for Generated Content

**DO:**

- ✅ British casual-professional: "tbh", "if you get a sec", "Right, so..."
- ✅ Authentic industry insider references (BBC Radio 6 Music, local radio)
- ✅ Technical but accessible explanations
- ✅ Action-oriented language (focus on what needs building/shipping)
- ✅ Time-conscious messaging (2-hour sessions, "15 hours → 15 minutes")
- ✅ UK market advantages (GDPR compliance, British spelling, local credibility)

**DON'T:**

- ❌ Corporate speak or buzzwords ("synergy", "leverage", "disruptive")
- ❌ Forced lowercase ("total audio promo" → Total Audio Promo)
- ❌ Vanity metrics without context (followers without conversions)
- ❌ Generic AI marketing copy (avoid "revolutionary", "game-changing")
- ❌ False claims or exaggeration (stick to proven 100% enrichment success)
- ❌ US spellings or conventions (use £GBP, British spelling)

### Tool-Specific Colour System Reference

**CRITICAL: Total Audio Promo uses a MULTI-COLOUR system, not a single brand colour.**

**When creating reports/dashboards that cover:**

**All tools / general platform:**

- Use all four colours in sections (Intel: #2563EB, Tracker: #14B8A6, Pitch: #F59E0B, Command: #7c3aed)
- Or use neutral slate/grey base with colour accents

**Audio Intel specific:**

- Primary: Electric Blue (#2563EB / blue-600)
- Use case: Contact enrichment, demo dashboards, customer acquisition

**Campaign Tracker specific:**

- Primary: Teal/Cyan (#14B8A6 / teal-500)
- Use case: Campaign analytics, submission tracking, follow-up reports

**Pitch Generator specific:**

- Primary: Amber (#F59E0B / amber-500)
- Use case: Pitch performance, personalisation metrics, VoiceGuard reports

**Command Centre specific:**

- Primary: Violet (#7c3aed / violet-600)
- Use case: Newsletter automation, social media, MCP ecosystem

**NEVER use:**

- ❌ Slate Cyan (#3AA9BE) - This is TotalAud.io (experimental project), NOT Total Audio Promo

---

## 8. PROJECT SEPARATION WARNING

**CRITICAL: This handoff covers ONLY Total Audio Promo (production SaaS suite).**

**TotalAud.io is a SEPARATE experimental project with:**

- Different brand system (Slate Cyan #3AA9BE accent)
- Different design language (cinematic onboarding, DAW theme, ASCII theme, etc.)
- Different deployment (Railway, not Vercel)
- Different purpose (R&D playground, not customer acquisition)

**If you need TotalAud.io context:**

- Request TOTALAUD_IO_CONTEXT.md separately
- DO NOT mix the two projects in reports/dashboards
- DO NOT use TotalAud.io brand colours (#3AA9BE) for Total Audio Promo outputs

**This separation is critical for:**

- Brand consistency
- Customer clarity (production vs experimental)
- Strategic positioning (proven SaaS vs innovation sandbox)

---

**This hand-off enables Claude Code to generate business intelligence, automation structures, and strategic reports for use in Genspark Super Agent, AI Sheets, Slides, and research features. All outputs should support the £500/month customer acquisition goal while maintaining authentic British industry credibility.**

**Last Updated:** November 2025
**Primary Business Focus:** Total Audio Promo customer acquisition (Audio Intel revenue validation)
**Target Milestone:** £500/month recurring revenue by end of November 2025
**Brand System:** Tool-specific colours (Intel: #2563EB, Tracker: #14B8A6, Pitch: #F59E0B, Command: #7c3aed)
