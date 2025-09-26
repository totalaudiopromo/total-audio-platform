# CLAUDE.md - TOTAL AUDIO PROMO COMPLETE DEVELOPMENT CONTEXT

This file provides comprehensive guidance to Claude Code when working with the Total Audio ecosystem.

## 🎯 PROJECT OVERVIEW

**Total Audio Promo** is a UK-focused music promotion SaaS platform with a three-tool ecosystem:
- **Audio Intel** (Blue) - Contact enrichment and research (`intel.totalaudiopromo.com`)
- **Command Centre** (Dashboard) - Business intelligence and automation (`command.totalaudiopromo.com`)
- **Playlist Pulse** (Purple) - Campaign management (under development, `pulse.totalaudiopromo.com`)

**Mission**: Replace expensive US tools (Muck Rack, Cision) with affordable UK-focused alternatives for independent artists and PR agencies.

## 🇬🇧 BUSINESS CONTEXT

### **Market Position**
- **UK-First**: British spelling, £GBP pricing, local market focus
- **David vs Goliath**: Agile alternatives to bloated enterprise tools
- **Music Native**: Built specifically for music industry promotion
- **Solopreneur**: Designed for Chris Schofield's own music promotion workflow

### **Pricing Strategy**
- **Independent Artists**: £50-200/month
- **PR Agencies**: £500-2000/month
- **Revenue Goal**: £500K ARR Year 1, £2M Year 2

### **Voice & Brand**
- Professional but never corporate
- British casual-professional ("Right, so...", "if you get a sec")
- Industry credible (5+ years radio promotion background)
- Time-conscious and respectful
- Technical expertise without jargon

## 🏗️ TECHNICAL ARCHITECTURE

### **Deployment Status** (September 2025)
```
Production Deployments:
✅ audio-intel → intel.totalaudiopromo.com (Next.js, mobile-optimized)
✅ command-centre → command.totalaudiopromo.com (Next.js, mobile-optimized)
🚧 playlist-pulse → pulse.totalaudiopromo.com (Next.js, development)
🔄 web → Main landing page (ready for totalaudiopromo.com)

GitHub Integration:
✅ All projects connected to GitHub repos
✅ Main branch → Production deployments
🚧 Staging branches (recommended for future)
```

### **Monorepo Structure**
```
total-audio-platform/
├── apps/
│   ├── audio-intel/          # 🔵 Live production app
│   ├── command-centre/       # 🎛️ Dashboard app
│   ├── playlist-pulse/       # 🟣 Campaign management
│   ├── web/                  # Main landing page
│   ├── api/                  # Backend services
│   └── mobile/               # React Native (future)
├── packages/                 # Shared utilities
├── tools/agents/            # 18+ specialized AI agents
└── docs/                    # Documentation
```

### **Technology Stack**
- **Frontend**: Next.js 14 + TypeScript + Tailwind CSS
- **Backend**: Node.js + Express + PostgreSQL + Prisma
- **AI**: OpenAI GPT-4, Claude Sonnet integration
- **Auth**: JWT with role-based access control
- **Hosting**: Vercel (frontend), Railway (backend)
- **Database**: PostgreSQL with Prisma ORM

## 🎵 MUSIC INDUSTRY CONTEXT

### **Target Users**
1. **Independent Artists**
   - Solo artists, small bands, emerging talent
   - Limited budgets, need efficiency
   - Want playlist placements and industry connections

2. **PR Agencies**
   - Music PR firms, record labels, management
   - Handle multiple artists, need scalability
   - Require white-label and reporting features

### **Industry Pain Points Solved**
- Manual contact research (15+ hours/week saved)
- Expensive US tools (80%+ cost savings)
- Poor email response rates (3x improvement target)
- Scattered tools and data (unified platform)
- Lack of UK market focus (local competitive advantage)

## 🤖 AGENT ECOSYSTEM (18+ Specialized Agents)

**CRITICAL**: Use existing agents instead of creating new ones.

### **Location**: `/tools/agents/`
### **Orchestrator**: `node orchestrator.js`

### **Core Business Agents**
- `agency-agent.js` - Multi-tenant agency operations
- `campaign-agent.js` - Campaign creation and tracking
- `contact-agent.js` - Contact enrichment and management
- `analytics-agent.js` - Performance tracking
- `database-agent.js` - Data operations

### **Integration Agents**
- `integration-agent.js` - Third-party services
- `music-tech-agent.js` - Technical operations
- `service-wrapper.js` - Service coordination

### **Content & Marketing**
- `content-generation-agent.js` - Content creation
- `social-media-agent.js` - Social automation
- `radio-promo-agent.js` - Radio promotion
- `viral-content-automation.js` - Viral strategies

### **Strategic Agents**
- `music-industry-strategist.js` - Industry strategy
- `music-marketing-mastermind.js` - Marketing strategies
- `growth-hacking-optimizer.js` - Growth optimization

## 🚀 DEVELOPMENT WORKFLOW

### **Setup Commands**
```bash
# Navigate to project
cd /Users/chrisschofield/workspace/active/total-audio-platform

# Install dependencies
npm install

# Environment setup
cp .env.example .env

# Start all apps
npm run dev

# Start individual apps
npm run dev:audio-intel      # Port 3000
npm run dev:command-centre   # Port 3005  
npm run dev:playlist-pulse   # Port 3001
npm run dev:web             # Default port
```

### **Build & Deploy**
```bash
# Type checking (run before deployment)
npm run typecheck

# Build all apps
npm run build

# Deploy individual apps
cd apps/audio-intel && vercel --prod
cd apps/command-centre && vercel --prod
```

### **Agent Development**
```bash
# Start agent orchestrator
cd tools/agents
node orchestrator.js

# Individual agent testing
node contact-agent.js
node campaign-agent.js
```

## 📱 MOBILE-FIRST OPTIMIZATIONS (COMPLETED)

**Status**: All apps are fully mobile-optimized ✅

### **Mobile CSS Files**
- `apps/audio-intel/app/mobile-optimizations.css`
- `apps/audio-intel/app/beta-mobile.css`
- `apps/audio-intel/app/home-mobile.css`
- `apps/command-centre/app/mobile-optimizations.css`
- `apps/web/src/styles/mobile-optimizations.css`

### **Mobile Standards Applied**
- 44px minimum touch targets
- Single column on mobile, responsive grids
- No horizontal scroll
- Touch-friendly UI elements
- Optimized typography for small screens

## 🎨 BRAND & DESIGN SYSTEM

### **Colors**
- **Primary Yellow**: #f6ab00 (Total Audio brand)
- **Secondary Blue**: #2538c7 (professional accent)
- **Audio Intel**: Blue (#007AFF)
- **Playlist Pulse**: Purple
- **Command Centre**: Dashboard grey

### **Typography**
- **Font**: Geist (primary), Geist Mono (code)
- **Mobile**: Optimized sizes for readability
- **Hierarchy**: Clear heading structure

### **UI Components**
- Tailwind CSS utility classes
- shadcn/ui components
- Custom component library in `/packages`

## 🔗 INTEGRATIONS

### **Current Integrations**
- **Airtable**: Contact database sync
- **Mailchimp**: Email campaign management
- **Gmail**: Email tracking and sending
- **Make.com**: Workflow automation
- **Claude AI**: Content generation and analysis

### **Planned Integrations**
- **Spotify for Artists**: Analytics integration
- **Apple Music for Artists**: Performance data
- **Social Media APIs**: Instagram, TikTok, Twitter
- **CRM Systems**: Notion, Monday.com

## 🐛 COMMON ISSUES & FIXES

### **Favicon Issues** (FIXED September 2025)
- Audio Intel: Updated to reference existing favicon.ico only
- Command Centre: Added missing favicon configuration
- Issue was referencing non-existent PNG files

### **TypeScript Errors**
- Run `npm run typecheck` before deployment
- Common: Missing interface definitions
- Fix: Add proper type annotations

### **Build Failures**
- Check all imports are valid
- Ensure environment variables are set
- Verify all dependencies installed

## 🎯 CURRENT PRIORITIES (September 2025)

### **Immediate**
1. Complete Vercel cleanup (remove v0 projects)
2. Rename playlist-pulse-live to playlist-pulse
3. Fix total-audio-platform deployment issues
4. Set up staging environments

### **Short-term (Next 30 days)**
1. Playlist Pulse feature development
2. Command Centre newsjacking system refinement
3. Audio Intel user feedback implementation
4. Mobile optimization testing

### **Strategic (Next 90 days)**
1. Partnership expansion (Liberty Music PR case study)
2. Revenue diversification planning
3. UK market positioning strengthening
4. Team expansion consideration

## 🔄 DEVELOPMENT BEST PRACTICES

### **Git Workflow**
- `main` branch for production
- Feature branches for development
- Proper commit messages
- Regular code reviews

### **Code Quality**
- TypeScript throughout
- ESLint and Prettier
- Unit tests for business logic
- Integration tests for APIs

### **Security**
- Environment variables for secrets
- JWT token validation
- Input sanitization
- Rate limiting on APIs

## 📊 SUCCESS METRICS

### **Technical KPIs**
- 99%+ uptime on production apps
- <3 second page load times
- Mobile-responsive on all devices
- Zero critical security vulnerabilities

### **Business KPIs**
- Monthly Recurring Revenue (MRR) growth
- Customer Acquisition Cost (CAC)
- User engagement and retention
- Feature adoption rates

## 🚨 CRITICAL REMINDERS

### **What NOT to Do**
- ❌ Don't create new mobile CSS files (already complete)
- ❌ Don't create new agents (use existing 18+ agents)
- ❌ Don't duplicate landing pages (use apps/web)
- ❌ Don't fix resolved issues (check status first)

### **What TO Do**
- ✅ Always run typecheck before deployment
- ✅ Use existing agent system for automation
- ✅ Reference Notion workspace for business context
- ✅ Maintain UK spelling and voice throughout
- ✅ Test mobile responsiveness on real devices

## 📚 REFERENCE DOCUMENTS

### **Key Files**
- `README.md` - Project overview and setup
- `package.json` - All development scripts
- `CLAUDE_COMPLETE_CONTEXT.md` - This file (most comprehensive)
- `BUSINESS_CONTEXT_COMPLETE.md` - Business strategy and market analysis

### **Notion Workspace**
- Business strategy and roadmap
- Organisation rules and standards
- Competitive analysis and market research
- Partnership opportunities and case studies

---

**Last Updated**: September 2025  
**Next Review**: October 2025  
**Context Status**: ✅ Complete and Current

*This context file represents the complete state of Total Audio Promo development as of September 2025. Use this as the single source of truth for all Claude Code interactions.*