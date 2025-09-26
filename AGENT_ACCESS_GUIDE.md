# 🤖 AGENT ACCESS GUIDE - SIMPLIFIED STRUCTURE

*How Agent OS and all agents can access business context effectively*

## 📁 NEW SIMPLIFIED STRUCTURE FOR AGENTS

### Primary Files (Agents should reference these)
```
WEEKLY_FOCUS.md                 # Current priorities and daily progress
AUDIO_INTEL_CONTEXT.md         # Complete product context
BUSINESS_NOTES.md              # Running log of decisions and feedback
```

### Archive (Reference when needed)
```
archive/old-structure/          # Old scattered docs (searchable but not primary)
```

## 🤖 AGENT OS INTEGRATION

### Update Agent OS Standards
The simplified structure needs to be reflected in Agent OS configuration:

**Key Reference Files for Agents:**
1. **Current Priorities**: `WEEKLY_FOCUS.md` - Always check this first
2. **Product Context**: `AUDIO_INTEL_CONTEXT.md` - Complete business context
3. **Running Notes**: `BUSINESS_NOTES.md` - Latest decisions and feedback

### Agent Commands Integration
```bash
# Agent OS commands should reference new structure
/analyze-product    → Use AUDIO_INTEL_CONTEXT.md
/create-spec       → Check WEEKLY_FOCUS.md for priorities
/execute-tasks     → Update progress in WEEKLY_FOCUS.md
```

## 🎯 AGENT INSTRUCTIONS FOR NEW STRUCTURE

### For Business Strategy Agents
```markdown
Primary Context Sources:
1. WEEKLY_FOCUS.md - Current week's priorities and progress
2. AUDIO_INTEL_CONTEXT.md - Complete business model and customer data
3. BUSINESS_NOTES.md - Latest insights and feedback

Key Metrics to Track:
- Customer acquisition progress (WEEKLY_FOCUS.md)
- Conversion rates by segment (AUDIO_INTEL_CONTEXT.md)
- Demo call booking and results (BUSINESS_NOTES.md)
```

### For Development Agents
```markdown
Development Context:
1. WEEKLY_FOCUS.md - Week's technical priorities
2. AUDIO_INTEL_CONTEXT.md - Customer-driven development needs
3. Technical commands from AUDIO_INTEL_CONTEXT.md

Focus Areas:
- Customer acquisition features (not new product features)
- Demo experience optimization
- Mobile-first development
```

### For Content/Marketing Agents
```markdown
Content Strategy Source:
1. AUDIO_INTEL_CONTEXT.md - Positioning messages and case studies
2. WEEKLY_FOCUS.md - This week's content priorities
3. BUSINESS_NOTES.md - Content performance feedback

Key Assets:
- BBC Radio 1 case study
- Spotify success story
- "15 hours → 15 minutes" value proposition
- Newsletter: "The Unsigned Advantage"
```

## 🔄 AGENT WORKFLOW INTEGRATION

### Morning Agent Routine
1. **Check WEEKLY_FOCUS.md** for today's priorities
2. **Reference AUDIO_INTEL_CONTEXT.md** for business context
3. **Update BUSINESS_NOTES.md** with any insights or actions
4. **Focus on customer acquisition** (primary business phase)

### Agent Decision Framework
**Primary Question**: "Does this help acquire the first paying customer?"
- ✅ Radio promoter outreach (85% conversion rate)
- ✅ Demo call optimization and booking
- ✅ Case study content distribution
- ❌ New features until revenue established

## 📊 AGENT PERFORMANCE TRACKING

### Key Metrics Agents Should Track
```markdown
Customer Acquisition (WEEKLY_FOCUS.md):
- Demo calls booked: 0/2 target this week
- Outreach responses and engagement
- Newsletter subscriber growth
- Social media engagement on case studies

Product Optimization (AUDIO_INTEL_CONTEXT.md):
- Demo-to-trial conversion rates
- Trial-to-paid conversion by segment
- Customer feedback integration
- Mobile experience improvements
```

## 🤖 SPECIFIC AGENT INTEGRATIONS

### Radio Promo Agent Integration
```markdown
Primary Focus: Radio promoter outreach (85% conversion segment)
Context Source: AUDIO_INTEL_CONTEXT.md - Radio promoter section
Progress Tracking: WEEKLY_FOCUS.md - Daily outreach tasks
Success Metrics: BUSINESS_NOTES.md - Conversion tracking
```

### Newsletter Automation Agent
```markdown
Content Source: AUDIO_INTEL_CONTEXT.md - Positioning messages
Publishing Schedule: WEEKLY_FOCUS.md - Weekly content tasks
Performance Data: BUSINESS_NOTES.md - Engagement metrics
Focus: "The Unsigned Advantage" subscriber growth
```

### Customer Acquisition Agents
```markdown
Strategy Source: AUDIO_INTEL_CONTEXT.md - Customer segments
Daily Actions: WEEKLY_FOCUS.md - Outreach and demo tasks
Results Tracking: BUSINESS_NOTES.md - Conversion data
Priority: Radio promoters → Solo artists → PR agencies
```

## 🔧 AGENT OS CONFIGURATION UPDATES

### Update .agent-os/standards/business-context.md
```markdown
# Business Context Standards

## Primary Reference Files
- WEEKLY_FOCUS.md: Current priorities and progress
- AUDIO_INTEL_CONTEXT.md: Complete business model
- BUSINESS_NOTES.md: Running decisions and feedback

## Business Phase
Customer Acquisition - Technical foundation complete

## Success Metrics
- First paying customer by October 2025
- £500/month by November 2025
- 2+ demo calls weekly
```

### Update .claude/agents/ for New Structure
All specialized agents should be configured to:
1. Check WEEKLY_FOCUS.md for current priorities
2. Reference AUDIO_INTEL_CONTEXT.md for business context
3. Update BUSINESS_NOTES.md with insights
4. Focus on customer acquisition phase

## 📱 MOBILE AGENT ACCESS
Since you work on mobile frequently:
- **Quick Priority Check**: `WEEKLY_FOCUS.md` (main file)
- **Business Context**: `AUDIO_INTEL_CONTEXT.md` (complete reference)
- **Quick Capture**: `BUSINESS_NOTES.md` (running log)

## 🚀 IMPLEMENTATION FOR AGENTS

### Immediate Actions
1. **Update Agent OS configuration** to reference new files
2. **Configure existing agents** to use simplified structure
3. **Test agent access** to new business context
4. **Ensure mobile compatibility** for all agent workflows

### Agent Commands Integration
```bash
# Quick access commands for agents
code WEEKLY_FOCUS.md           # Current week's priorities
code AUDIO_INTEL_CONTEXT.md    # Complete business context
code BUSINESS_NOTES.md         # Running log and decisions
```

---

**Result: All agents now have clear, simple access to business context through 3 primary files instead of 10+ scattered locations. Agent OS integration ensures consistent, customer acquisition-focused workflow.**