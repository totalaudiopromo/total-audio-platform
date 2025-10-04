import Anthropic from '@anthropic-ai/sdk';

/**
 * Cached Context Manager
 *
 * Centralized management of cached contexts for Total Audio agents.
 * Reduces token costs by 80-90% through prompt caching.
 *
 * Usage:
 * ```typescript
 * const context = CachedContextManager.getAudioIntelContext();
 * const systemPrompt = [context, ...otherMessages];
 * ```
 */
export class CachedContextManager {
  private static contexts: Map<string, Anthropic.Messages.CacheControlEphemeral> = new Map();

  /**
   * Get Audio Intel product context (cached)
   *
   * Use for: Contact enrichment, campaign management, customer-facing features
   */
  static getAudioIntelContext(): Anthropic.Messages.CacheControlEphemeral {
    if (!this.contexts.has('audio-intel')) {
      this.contexts.set('audio-intel', {
        type: 'text' as const,
        text: `
# AUDIO INTEL CONTEXT (CACHED)

## Product Overview
- **Live Platform**: intel.totalaudiopromo.com
- **Purpose**: Contact enrichment and database management for UK music industry
- **Market Position**: UK alternative to expensive US tools (Muck Rack, Cision)
- **Competitive Advantage**: "15 hours → 15 minutes" contact research time savings

## Pricing Model (October 2025)
- **FREE**: 10 enrichments/month
- **PRO**: £19.99/month (unlimited enrichments)
- **AGENCY**: £79/month (team features + API access)

## Technical Stack
- **Frontend**: Next.js 15, React 19, TypeScript
- **Backend**: PostgreSQL with Prisma ORM
- **Hosting**: Vercel (production ready)
- **AI**: Anthropic Claude + Perplexity for enrichment

## Contact Database
- **Total UK Contacts**: 515+ verified contacts
- **Categories**:
  - BBC Radio (Radio 1, Radio 6 Music, regional stations)
  - Commercial Radio (Capital, Kiss, Heart, etc.)
  - Music Journalists (NME, The Guardian, DIY, Loud & Quiet)
  - Playlist Curators (Spotify, Apple Music, independent)
  - Music Blogs (The Line of Best Fit, Clash, etc.)
- **Data Quality**: 94% accuracy, manually verified
- **Update Frequency**: Weekly additions, monthly verification

## Success Metrics (Validated)
- **Enrichment Success Rate**: 100% (BBC Radio 1, Spotify case studies)
- **Time Savings**: 15 hours → 15 minutes per campaign
- **Response Times**: <2 seconds for enrichment
- **Mobile Experience**: Professional UX (21 issues resolved)

## Current Status (October 2025)
- ✅ Platform functional and production-ready
- ✅ 515 UK contacts enriched and verified
- ✅ Mobile-first responsive design complete
- ✅ Payment integration (Stripe) operational
- ❌ Email automation broken (PRIORITY 1 fix)
- ❌ Zero paying customers yet (customer acquisition phase)

## Target Customer Segments
1. **Radio Promoters** (85% conversion rate - HIGHEST PRIORITY)
   - Pain: 15+ hours per campaign on manual research
   - Solution: Automated contact enrichment + database
   - Value: More campaigns, less admin

2. **Solo Artists with Budget** (60% conversion rate)
   - Pain: Weekend contact research instead of creating music
   - Solution: Upload spreadsheet, get enriched database
   - Value: More time for music, professional contacts

3. **Growing PR Agencies** (70% conversion rate)
   - Pain: Junior staff spending days on contact research
   - Solution: £79/month vs hiring another junior
   - Value: Team efficiency, client results

## Brand Voice & Communication
- **Style**: Professional but accessible, no corporate speak
- **Tone**: Direct, honest, UK music industry insider
- **Spelling**: British English (realise, optimise, colour)
- **Positioning**: "Stop spreadsheet chaos, start smart promotion"
- **Founder Credibility**: Chris (sadact producer, 5+ years radio promo, BBC Radio 1 experience)

## Competitive Positioning
- **vs Muck Rack/Cision**: Too expensive (£500+/month), US-focused, overkill features
- **vs Manual Excel**: Time-consuming, error-prone, unprofessional
- **vs Submission Platforms**: Different use case (we're intelligence, not distribution)
- **Our Edge**: UK focus, affordable, contact intelligence specialist

## Integration Ecosystem
- **Current**: Standalone product
- **Planned**: Integration with Playlist Pulse (submission tool)
- **Vision**: Total Audio ecosystem for complete music promotion

## Revenue Goal (October 2025)
- **Target**: First £500/month by November 2025
- **Strategy**: Radio promoter outreach (highest conversion)
- **Tactics**: Case study content, demo calls, "The Unsigned Advantage" newsletter
        `,
        cache_control: { type: 'ephemeral' as const }
      });
    }
    return this.contexts.get('audio-intel')!;
  }

  /**
   * Get Total Audio ecosystem context (cached)
   *
   * Use for: Strategic planning, product development, cross-platform features
   */
  static getTotalAudioEcosystemContext(): Anthropic.Messages.CacheControlEphemeral {
    if (!this.contexts.has('ecosystem')) {
      this.contexts.set('ecosystem', {
        type: 'text' as const,
        text: `
# TOTAL AUDIO ECOSYSTEM (CACHED)

## Product Portfolio (October 2025)

### 1. Audio Intel (LIVE - £19.99/month)
- **Status**: Production, customer acquisition phase
- **Purpose**: Contact enrichment and database management
- **Revenue**: Primary revenue generator
- **Market**: UK music industry (indies, promoters, agencies)

### 2. Playlist Pulse (IN DEVELOPMENT)
- **Status**: Beta development
- **Purpose**: Playlist submission automation
- **Integration**: Uses Audio Intel contact data
- **Revenue**: £29/month (planned)

### 3. Radio Promo Agent (BETA with Liberty Music PR)
- **Status**: Real client workflow automation
- **Purpose**: Automated radio campaign management
- **Client**: Liberty Music PR (beta partnership)
- **Revenue**: £199/month (agency tier, planned)

### 4. Master Platform (PLANNED)
- **Status**: Conceptual, post-£500/month milestone
- **Purpose**: Full music promotion suite
- **Tiers**:
  - Indies: £50-200/month
  - Agencies: £500-2,000/month

## Technical Architecture

### Shared Infrastructure
- **Monorepo**: Turborepo with shared packages
- **Database**: PostgreSQL with Prisma ORM
- **Hosting**: Vercel (all apps)
- **AI**: Anthropic Claude (all agents)
- **Agent System**: 40+ specialized agents

### Cross-Platform Features
- **Shared Contact Database**: 515+ UK contacts
- **Unified Authentication**: Supabase across apps
- **Real-time Analytics**: Shared dashboard
- **Mobile-First Design**: All platforms responsive

## Market Positioning

### UK Music Industry Focus
- **Geographic**: UK-first, global expansion later
- **Industry**: Music promotion specialist
- **Competition**: Anti-Muck Rack (too expensive, US-focused)
- **Advantage**: Local focus + affordable pricing + better UX

### Customer Acquisition Strategy (Current)
- **Phase**: Customer acquisition (foundation complete)
- **Target**: First £500/month by November 2025
- **Primary**: Radio promoter outreach (85% conversion)
- **Content**: "The Unsigned Advantage" newsletter
- **Case Studies**: BBC Radio 1, Spotify enrichment success

## Founder Background (Credibility)

### Chris Schofield
- **Artist**: sadact (electronic music producer)
- **Experience**: 5+ years radio promotion, BBC Radio 1 pitch experience
- **Network**: Royal Blood, Architects, Rolo Tomassi connections
- **Story**: Built Audio Intel because he personally needed it
- **Positioning**: "Contact intelligence by someone who actually uses it daily"

## Business Philosophy

### Core Principles
1. **Customer Acquisition First**: Foundation complete, focus on first customers
2. **UK Market Specialist**: Better service through local focus
3. **Affordable Excellence**: Professional tools at indie-friendly prices
4. **Real Industry Experience**: Built by promoters for promoters
5. **Time Savings Focus**: "More music, less admin"

### Development Approach
- **Sessions**: Max 2 hours (founder has Postman day job)
- **Decision Framework**: "Will this help acquire first paying customer?"
- **Priority**: Customer acquisition features > new product features
- **Testing**: Mobile-first, real device testing

## Success Metrics & Goals

### Current Status (October 2025)
- ✅ Technical foundation complete (3 platforms functional)
- ✅ 515 UK contacts enriched and verified
- ✅ Newsletter system operational ("The Unsigned Advantage")
- ✅ 14+ MCP servers integrated (Gmail, Notion, Puppeteer)
- ❌ Zero paying customers (customer acquisition phase)
- ❌ Email automation broken (priority fix)

### Near-term Goals (Next 30 Days)
- First paying customer conversion
- £500/month recurring revenue
- 25+ newsletter subscribers
- 2+ demo calls booked weekly

### Long-term Vision (12 Months)
- Sustainable £2,000-5,000/month revenue
- 100+ paying customers
- Full Total Audio ecosystem launched
- Industry recognition as UK leader
        `,
        cache_control: { type: 'ephemeral' as const }
      });
    }
    return this.contexts.get('ecosystem')!;
  }

  /**
   * Get UK music industry landscape context (cached)
   *
   * Use for: Campaign planning, content generation, industry analysis
   */
  static getUKMusicIndustryContext(): Anthropic.Messages.CacheControlEphemeral {
    if (!this.contexts.has('uk-music')) {
      this.contexts.set('uk-music', {
        type: 'text' as const,
        text: `
# UK MUSIC INDUSTRY LANDSCAPE (CACHED)

## Radio Landscape

### BBC Radio Network
- **Radio 1**: Pop, dance, urban (15-29 demographic)
- **Radio 1Xtra**: Hip-hop, grime, R&B
- **Radio 2**: Adult contemporary (35+)
- **Radio 6 Music**: Alternative, indie, classic rock
- **Regional BBC**: Local coverage across UK
- **Value**: Credibility, reach, no pay-to-play

### Commercial Radio
- **National**: Capital, Kiss, Heart, Absolute, Virgin
- **Regional**: Independent stations across UK
- **Genre-Specific**: Jazz FM, Classic FM, etc.
- **Playlisting**: Competitive, data-driven

### Community & College Radio
- **Count**: 300+ stations UK-wide
- **Value**: Genre-specific, tastemaker influence
- **Accessibility**: More open to new artists
- **Examples**: Soho Radio, NTS, Rinse FM

## Music Press & Blogs

### Major Publications
- **NME**: Pop, rock, indie (online focus)
- **The Guardian Music**: Broadsheet coverage
- **DIY**: Indie, alternative, emerging artists
- **Clash**: Progressive, electronic, indie
- **Loud & Quiet**: Alternative, thoughtful coverage

### Independent Blogs
- **The Line of Best Fit**: Quality indie coverage
- **Gigwise**: News, reviews, interviews
- **The 405**: Experimental, electronic
- **DORK**: Pop-punk, emo, alternative

## Playlist Ecosystem

### Spotify UK
- **Editorial Playlists**: New Music Friday UK, Hot Hits UK
- **Independent Curators**: Influence on discovery
- **Value**: Streaming revenue + discovery

### Apple Music UK
- **Editorial**: Dedicated UK team
- **Genre Playlists**: Strong curation
- **Artist Support**: Better revenue per stream

### YouTube Music & Others
- **Deezer**: Growing UK presence
- **Tidal**: Premium positioning
- **Amazon Music**: Integration advantage

## PR & Promotion Landscape

### Major PR Agencies
- **Pricing**: £1,500-5,000/month
- **Services**: Full-service campaigns
- **Roster**: Established artists
- **Access**: Exclusive industry relationships

### Independent Promoters
- **Pricing**: £500-2,000/month
- **Services**: Radio, press, playlist campaigns
- **Focus**: Niche genres, emerging artists
- **Examples**: Liberty Music PR (Audio Intel beta partner)

### DIY Promotion
- **Challenge**: Time-consuming contact research
- **Tools**: Limited affordable options
- **Opportunity**: Audio Intel's primary market

## Genre-Specific Insights

### Electronic Music
- **Strong Scene**: London, Bristol, Manchester
- **Media**: Mixmag, DJ Mag, Resident Advisor
- **Radio**: BBC Radio 1 Dance, Rinse FM, NTS
- **Playlists**: Genre-specific curators

### Indie/Alternative
- **Festivals**: Reading/Leeds, Glastonbury, Green Man
- **Media**: DIY, Loud & Quiet, The Line of Best Fit
- **Radio**: BBC Radio 6 Music primary target
- **Strength**: Strong UK scene, international influence

### Hip-Hop/Grime
- **Unique UK Scene**: Grime originated in UK
- **Media**: Complex UK, GRM Daily, Link Up TV
- **Radio**: BBC Radio 1Xtra primary
- **Growth**: Fastest-growing genre UK streaming

### Rock/Metal
- **Festivals**: Download, Bloodstock, 2000trees
- **Media**: Kerrang, Rock Sound, Metal Hammer
- **Radio**: Kerrang Radio, Planet Rock
- **Strength**: Dedicated fanbase, touring culture

## Contact Research Challenges

### Common Pain Points
1. **Time-Consuming**: 15+ hours per campaign
2. **Data Accuracy**: Outdated spreadsheets, wrong contacts
3. **Organization**: Chaos across multiple spreadsheets
4. **Verification**: Hard to verify current contacts
5. **Updates**: Journalists/DJs change roles frequently

### Audio Intel Solution
- **Time**: 15 minutes vs 15 hours
- **Accuracy**: 94% verified data
- **Organization**: Database vs spreadsheets
- **Verification**: Weekly updates
- **Coverage**: 515+ current UK contacts

## Industry Relationships (Key to Success)

### Building Trust
- **Authenticity**: Real industry experience matters
- **Respect**: No spam, quality over quantity
- **Persistence**: Follow-up without being annoying
- **Value**: Give before you ask
- **Timing**: Right pitch at right time

### Best Practices
1. **Personalization**: Generic pitches ignored
2. **Relevance**: Match artist to contact's taste
3. **Professionalism**: Quality materials, no typos
4. **Relationships**: Long-term over one-off
5. **Data**: Track interactions, learn patterns
        `,
        cache_control: { type: 'ephemeral' as const }
      });
    }
    return this.contexts.get('uk-music')!;
  }

  /**
   * Get database schema context (cached)
   *
   * Use for: Database operations, contact enrichment, data queries
   */
  static getDatabaseSchemaContext(): Anthropic.Messages.CacheControlEphemeral {
    if (!this.contexts.has('db-schema')) {
      this.contexts.set('db-schema', {
        type: 'text' as const,
        text: `
# DATABASE SCHEMA (CACHED)

## Contacts Table (Primary)

\`\`\`prisma
model Contact {
  id              String    @id @default(uuid())
  name            String
  email           String    @unique
  role            String    // journalist, radio_dj, playlist_curator, etc.
  outlet          String    // BBC Radio 1, NME, Spotify, etc.

  // Social Media
  twitter         String?
  instagram       String?
  linkedin        String?

  // Categorization
  genres          String[]  // indie, electronic, hip-hop, etc.
  location        String    // London, Manchester, UK-wide, etc.
  tier            String    // national, regional, local

  // Engagement Data
  lastContacted   DateTime?
  responseRate    Float     @default(0.0)
  notes           String?   @db.Text

  // Enrichment Status
  isEnriched      Boolean   @default(false)
  enrichedAt      DateTime?
  enrichedData    Json?     // Additional enrichment data

  // Relationships
  campaigns       CampaignContact[]

  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
}
\`\`\`

## Campaigns Table

\`\`\`prisma
model Campaign {
  id              String    @id @default(uuid())
  name            String
  artistName      String
  genre           String
  budget          Float

  // Status
  status          String    // planning, active, completed, cancelled
  startDate       DateTime
  endDate         DateTime?

  // Relationships
  contacts        CampaignContact[]
  analytics       CampaignAnalytics[]

  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
}
\`\`\`

## CampaignContact (Join Table)

\`\`\`prisma
model CampaignContact {
  id              String    @id @default(uuid())
  campaignId      String
  contactId       String

  campaign        Campaign  @relation(fields: [campaignId], references: [id])
  contact         Contact   @relation(fields: [contactId], references: [id])

  // Outreach Tracking
  status          String    // pending, sent, responded, declined
  sentAt          DateTime?
  respondedAt     DateTime?
  response        String?   @db.Text

  // Follow-up
  followUpCount   Int       @default(0)
  lastFollowUp    DateTime?
  nextFollowUp    DateTime?

  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt

  @@unique([campaignId, contactId])
}
\`\`\`

## Data Quality Standards

### Contact Verification
- **Email Format**: Valid format, deliverability check
- **Social Media**: Live profiles, recent activity
- **Outlet Verification**: Still at listed outlet
- **Genre Accuracy**: Matches coverage area
- **Location**: Accurate geographic data

### Enrichment Quality (94% Accuracy)
- **Source Verification**: Multiple source confirmation
- **Update Frequency**: Weekly new contacts, monthly verification
- **Error Handling**: Flag suspicious data for manual review
- **Deduplication**: Prevent duplicate contacts

## Query Patterns (For Agent Use)

### Common Queries

1. **Find Contacts by Genre**
\`\`\`typescript
const contacts = await prisma.contact.findMany({
  where: {
    genres: { has: 'indie' }
  }
});
\`\`\`

2. **Enrichment Status**
\`\`\`typescript
const unenriched = await prisma.contact.findMany({
  where: { isEnriched: false }
});
\`\`\`

3. **Campaign Contacts**
\`\`\`typescript
const campaignContacts = await prisma.campaignContact.findMany({
  where: { campaignId: 'xxx' },
  include: { contact: true }
});
\`\`\`

4. **Response Rate Analysis**
\`\`\`typescript
const topResponders = await prisma.contact.findMany({
  where: { responseRate: { gte: 0.5 } },
  orderBy: { responseRate: 'desc' }
});
\`\`\`
        `,
        cache_control: { type: 'ephemeral' as const }
      });
    }
    return this.contexts.get('db-schema')!;
  }

  /**
   * Get brand voice guidelines (cached)
   *
   * Use for: Content generation, marketing copy, customer communication
   */
  static getBrandVoiceContext(): Anthropic.Messages.CacheControlEphemeral {
    if (!this.contexts.has('brand-voice')) {
      this.contexts.set('brand-voice', {
        type: 'text' as const,
        text: `
# TOTAL AUDIO BRAND VOICE (CACHED)

## Voice Characteristics

### Tone
- **Professional but Accessible**: Not corporate, not too casual
- **Direct and Honest**: No marketing fluff, straight talk
- **UK Music Industry Insider**: Speaks the language, knows the scene
- **Passionate but Practical**: Love music, focus on results
- **Confident without Arrogance**: We know what we're doing, but we're learning too

### Language Style
- **British English**: realise, optimise, colour, organised
- **Active Voice**: "Transform spreadsheet chaos" not "Chaos is transformed"
- **Short Sentences**: Punchy, scannable, clear
- **No Jargon**: Unless industry-standard (then explain once)
- **Contractions**: We're, you'll, it's (conversational)

## Key Messages

### Primary Value Proposition
"Stop weekend contact research, start creating music"

### Supporting Messages
1. "15 hours → 15 minutes" (time savings)
2. "515+ verified UK music contacts" (database)
3. "£19.99/month vs £500+ agency fees" (affordability)
4. "Built by a promoter who uses it daily" (credibility)
5. "BBC Radio 1, Spotify success stories" (proof)

### What We Don't Say
❌ "Best in class" (generic)
❌ "Innovative solution" (meaningless)
❌ "Cutting-edge technology" (corporate)
❌ "Game-changing platform" (oversell)
❌ "Revolutionize your workflow" (cliché)

## Writing Examples

### Good ✅
"Spent last weekend researching BBC Radio 1 contacts? Never again. Upload your list, get enriched data in 15 minutes. £19.99/month."

### Bad ❌
"Our innovative platform leverages cutting-edge AI to revolutionize your music promotion workflow with best-in-class contact enrichment solutions."

### Good ✅
"Chris (sadact producer) built Audio Intel because he was tired of spending 15+ hours per campaign on manual contact research. Now he doesn't. Neither should you."

### Bad ❌
"Founded by industry veterans with deep music promotion experience, Audio Intel delivers unparalleled value to discerning music professionals."

## Audience-Specific Messaging

### For Radio Promoters
"You've got 5 campaigns running. Each needs 15+ hours of contact research. Or... 15 minutes with Audio Intel. Your choice."

### For Independent Artists
"You're an artist, not a spreadsheet warrior. Upload contacts, get enriched database, get back to making music."

### For PR Agencies
"Junior staff spending 20 hours/week on contact research? £79/month vs another salary. Simple math."

## Content Principles

### 1. Show, Don't Tell
- Use specific examples (BBC Radio 1, Spotify)
- Include real numbers (515 contacts, 15 hours → 15 minutes)
- Share actual use cases (Liberty Music PR partnership)

### 2. Focus on Pain Points
- Weekend contact research
- Outdated spreadsheets
- Copy-paste chaos
- Manual verification
- Time away from music

### 3. UK Context Matters
- Reference BBC Radio, NME, UK festivals
- Use £GBP pricing
- Mention UK geography (London, Manchester, etc.)
- Understand UK music scene nuances

### 4. Founder Story Authenticity
- Chris's sadact electronic music project
- Real radio promotion experience (5+ years)
- BBC Radio 1 pitch experience
- Royal Blood/Architects connections
- Built Audio Intel for personal use first

## Emotional Positioning

### We Understand
- The frustration of manual research
- The chaos of multiple spreadsheets
- The weekend stolen by admin work
- The fear of missing the right contact
- The cost barrier of expensive tools

### We Deliver
- Time back for music creation
- Organized professional database
- Affordable pricing (£19.99 not £500)
- UK-focused quality data
- Built by someone who gets it

## Call-to-Action Style

### Good ✅
- "Start your free trial (10 enrichments)"
- "See it work (upload 5 contacts)"
- "Book a 15-minute demo"
- "Join 25+ UK promoters already using Audio Intel"

### Bad ❌
- "Unlock your potential today"
- "Don't miss out on this opportunity"
- "Join the revolution"
- "Experience the difference"
        `,
        cache_control: { type: 'ephemeral' as const }
      });
    }
    return this.contexts.get('brand-voice')!;
  }

  /**
   * Clear all cached contexts (for testing or cache refresh)
   */
  static clearAll(): void {
    this.contexts.clear();
  }

  /**
   * Get cache statistics (for monitoring)
   */
  static getCacheStats(): {
    totalContexts: number;
    contexts: string[];
    estimatedTokensSaved: number;
  } {
    const contexts = Array.from(this.contexts.keys());
    const estimatedTokensPerContext = 2000; // Average
    const estimatedCacheHitRate = 0.9; // 90%

    return {
      totalContexts: contexts.length,
      contexts,
      estimatedTokensSaved: contexts.length * estimatedTokensPerContext * estimatedCacheHitRate
    };
  }
}
