# AUDIO INTEL - PRIMARY REVENUE PRODUCT INSTRUCTIONS

## 🎯 PRODUCT FOCUS

**Audio Intel** is THE revenue generator for Total Audio Promo. Everything here must directly support getting first paying customers.

### Core Function

- **Contact enrichment service** for music industry professionals
- Upload contact lists, get back AI-powered research, export to CSV/Excel
- On-demand enrichment - no database, no CRM, just intelligence you export and use anywhere
- UK alternative to expensive US tools (SubmitHub £200-500+/month)
- **Pricing**: Free Beta → £19/month Complete Bundle → £79/month Agency

### Current Status

- **Live Site**: https://intel.totalaudiopromo.com
- **Stage**: Pre-revenue, customer acquisition phase
- **Target**: First £500/month by November 2025
- **Priority**: Get 5 paying customers through industry outreach

## 🇬🇧 UK MARKET POSITIONING

### Target Customers

- **Independent artists**: Radio promotion campaigns, contact research
- **Small PR agencies**: Client contact discovery, campaign planning
- **Record labels**: A&R contact research, playlist submissions

### Value Proposition

- **"Contact intelligence built by someone who actually uses it"**
- **Cost**: 80%+ savings vs US competitors
- **Speed**: Minutes not hours for contact research
- **Quality**: UK music industry focused data

## 🛠️ TECHNICAL ARCHITECTURE

### Tech Stack

- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS with shadcn/ui components
- **Database**: Prisma with PostgreSQL
- **Payments**: Stripe subscriptions
- **API**: Perplexity API for contact enrichment
- **Deployment**: Vercel

### Key Features

1. **CSV Upload**: Contact list upload with validation
2. **AI Enrichment**: Perplexity API integration for contact research
3. **Results Export**: Enhanced contact data with industry intelligence
4. **Subscription Management**: Stripe integration for payments
5. **User Dashboard**: Upload history, usage tracking

## 🚨 DEVELOPMENT PRIORITIES

### V1 Features (Revenue Focus)

- ✅ Contact enrichment core functionality
- ✅ User upload/results workflow
- ✅ Stripe subscription integration
- 🔄 User experience optimization
- 🔄 Complete user journey testing

### Forbidden Until £500/month

- ❌ Contact request marketplace features
- ❌ Advanced filtering/search beyond core function
- ❌ Collaboration features
- ❌ Additional enrichment sources
- ❌ Any "nice to have" features

## 🎵 CHRIS'S AUTHENTIC CONTEXT

### Producer Background (sadact)

- 5+ years radio promotion experience
- BBC Radio 1 pitch experience
- Real industry relationships (Royal Blood, Architects, etc.)
- Actually uses radio promotion tools daily

### Personal Reality

- **Family**: Girlfriend brings tea, kids drawing upstairs
- **Work Setup**: 2am coding sessions, laptop on kitchen table
- **Time Constraints**: Maximum 2-hour development sessions
- **Philosophy**: "Good enough principle" - ship and iterate

### Industry Credibility

- Built by someone who actually uses these tools
- Real pain points from juggling 10+ different platforms
- Authentic story: "I built this for my own campaigns, thought you might find it useful"

## 🎯 CUSTOMER ACQUISITION APPROACH

### Outreach Script

_"Hi [Name], I've been working on a tool for my own radio promotion campaigns that saves me significant research time. It's working well for me - thought you might find it useful too."_

### Success Metrics

- **Short-term**: 5 customer conversations, 1-3 paying customers
- **Medium-term**: 10-15 customers, £200-300 MRR
- **Long-term**: 25+ customers, £500+ MRR

## 📋 DEVELOPMENT GUIDELINES

### Voice & Communication

- British casual-professional tone ("Right, so...", "tbh")
- No corporate speak or marketing jargon
- Real industry terminology and context
- Time-conscious energy (family man building business)

### Code Standards

- TypeScript strict mode, no `any` types
- Mobile-first responsive design
- Tailwind CSS with existing design system
- Test complete user journey regularly
- Focus on revenue-generating features only

### Testing Priorities

1. **Complete user flow**: Signup → Upload → Results → Payment
2. **Stripe integration**: Subscription creation and management
3. **CSV processing**: Various file formats and edge cases
4. **API integration**: Perplexity API reliability and error handling

## 🚀 SUCCESS CRITERIA

### Technical Excellence

- ✅ Fast, responsive user interface
- ✅ Reliable CSV processing and API integration
- ✅ Seamless payment/subscription flow
- ✅ Error handling and user feedback

### Business Impact

- ✅ Direct path from feature to revenue
- ✅ Solves real music industry problem
- ✅ Competitive pricing vs US alternatives
- ✅ Builds on Chris's authentic credibility

**Remember**: This is not a tech demo - it's a business tool that needs to generate revenue THIS WEEK. Every feature must justify itself through customer acquisition or retention.

## 🚨 DEPLOYMENT & CI/CD (Updated October 2025)

### GitHub Actions Quota Issue

- **Problem**: Free GitHub account hit 2,000-minute Actions quota (100% used)
- **Impact**: All workflow runs get cancelled automatically, keeping checks red
- **Status**: Won't resolve until GitHub Pro subscription or quota resets

### Current Deployment Workaround (Until GitHub Pro)

**Skip GitHub Actions entirely** and deploy directly from local machine:

```bash
# For preview deployments
cd /Users/chrisschofield/workspace/active/total-audio-platform/apps/audio-intel
vercel

# For production deployments
vercel --prod
```

**Also applies to other apps:**

```bash
# Web app
cd apps/web && vercel --prod

# Tracker app
cd apps/tracker && vercel --prod

# Pitch Generator app
cd apps/pitch-generator && vercel --prod
```

### Rollback Strategy

- **Vercel stores every build** in the dashboard
- **Git still tracks code changes** separately for version control
- **Rollback from dashboard**: Use Vercel web interface
- **Rollback from CLI**: `vercel rollback <deployment-url>`

### Important Notes

- This is a **temporary workaround** until GitHub Pro subscription
- CI checks will remain red - **ignore them** for now
- Vercel deployments work perfectly without GitHub Actions
- Code version control via Git is unaffected
- Manual deployment gives you direct control over what goes live

### When GitHub Pro is Available

- Re-enable GitHub Actions workflows
- Automated CI/CD will resume
- Keep this workaround documented as backup deployment method
