# PITCH GENERATOR - COMPLETE CONTEXT

## Everything you need to know about the Pitch Generator tool

## KEY NUMBERS

- **Status**: Supporting tool (complements Audio Intel customer acquisition)
- **Live Site**: <https://pitch.totalaudiopromo.com>
- **Port**: 3004 (development)
- **Purpose**: AI-powered personalised pitch generation at scale

## CURRENT ROLE

**Supporting Audio Intel** - Helps convert enriched contacts into personalised outreach, not primary revenue driver

## WHAT'S PROVEN & WORKING

- **AI Pitch Generation**: Anthropic Claude integration for personalised pitches
- **Template System**: Pre-built templates for different contact types
- **Voice Consistency**: Maintains authentic tone across pitches
- **Batch Processing**: Generate pitches for entire campaigns at once
- **Mobile Responsive**: Professional UX across all devices
- **Supabase Integration**: Real-time data sync and storage

## PRIMARY USE CASES

### 1. Radio Promoter Pitch Automation

- **Profile**: Music industry professionals sending personalised pitches
- **Use Case**: Generate 50+ personalised pitches from template + contact data
- **Integration**: Uses Audio Intel enriched contacts as targets
- **Value**: "5 hours of pitch writing → 5 minutes"

### 2. Agency Multi-Client Pitching

- **Profile**: PR agencies managing pitches for multiple artists
- **Use Case**: Brand-consistent pitches across campaigns
- **Integration**: White-label pitch templates per client
- **Value**: "Scale personalisation without losing quality"

### 3. Artist Self-Service Outreach

- **Profile**: Independent artists reaching out to radio/press
- **Use Case**: Professional pitches without hiring a PR agency
- **Integration**: Import contacts from Audio Intel, generate pitches
- **Value**: "Sound professional, save time"

## TECHNICAL STATUS

- **Framework**: Next.js 15, TypeScript, Tailwind CSS
- **AI**: Anthropic Claude 3.5 Sonnet for pitch generation
- **Database**: Supabase (PostgreSQL with real-time subscriptions)
- **Authentication**: NextAuth with Google OAuth
- **Deployment**: Vercel (auto-deploy from `main` branch)
- **Testing**: Playwright test suite

### Development Commands

```bash
# Development
npm run dev:pitch-generator    # Port 3004
npm run build:pitch-generator  # Production build
npm run test:pitch-generator   # Run tests

# Database
npm run db:migrate             # Run migrations
npm run db:seed                # Seed demo data
```

## KEY FEATURES

### AI Pitch Generation

- Personalised pitches based on contact data
- Multiple template types (radio, press, playlist, influencer)
- Voice consistency enforcement (British tone, authentic industry language)
- Batch generation for entire campaigns

### Template System

- Pre-built templates for common scenarios
- Customisable templates per user/campaign
- Template preview before generation
- A/B testing different pitch styles

### Contact Integration

- Import enriched contacts from Audio Intel
- Use contact data (genre preferences, show format) for personalisation
- Track pitch performance per contact type
- Avoid duplicate pitches

### Liberty Demo Integration

- Sample pitches pre-generated for November 19th demo
- Realistic radio promotion pitch examples
- Ready to show personalisation at scale

## DEVELOPMENT PRIORITIES (Customer-Driven Only)

- **Liberty Demo Readiness**: Ensure pitch examples are polished for November 19th
- **Audio Intel Integration**: Seamless contact import workflow
- **Voice Guard**: Prevent generic AI tone, maintain authenticity
- **Response Tracking**: Link pitches to Tracker for follow-up management

## INTEGRATION WITH AUDIO INTEL

**Workflow**:

1. User enriches contacts in **Audio Intel** (gets full contact details)
2. User imports enriched contacts into **Pitch Generator**
3. User selects template and generates personalised pitches
4. User exports pitches or sends directly via integrated email
5. User tracks responses in **Tracker**

**Value Proposition**: "Enrich once, pitch perfectly, track forever"

## CURRENT FOCUS

- **Liberty Demo**: Ensure Pitch Generator shows well in November 19th demo
- **Supporting Revenue**: Increase Audio Intel conversion by showing full workflow
- **Differentiation**: Authentic British tone vs generic AI pitch tools

## LIBERTY DEMO (November 19, 2025)

**Demo Focus**:

- AI pitch generation workflow
- Personalisation at scale (50+ pitches in minutes)
- Template system and customisation
- Integration with Audio Intel contacts

**Demo Data**: Liberty-specific pitch examples pre-generated

**Documentation**: `LIBERTY_DEMO_READINESS_AUDIT.md`, `apps/pitch-generator/docs/DEMO_GUIDE.md`

## COMPETITIVE ADVANTAGE

### Against Generic AI Tools

- **British tone enforcement**: Proper spelling, authentic industry voice
- **Radio-specific knowledge**: Understands show formats, DJ preferences
- **Integration advantage**: Works with Audio Intel enriched data
- **Authenticity**: No corporate speak, no forced lowercase, no emoji overload

### Market Positioning

- **Primary**: "Professional pitches, 10x faster than manual writing"
- **Radio Promoters**: "Personalise at scale without losing quality"
- **Artists**: "Sound like a professional without hiring an agency"
- **Agencies**: "Scale your outreach without scaling your team"

---

**The Pitch Generator turns Audio Intel's enriched contacts into personalised, professional outreach. It's the bridge between data and action.**
