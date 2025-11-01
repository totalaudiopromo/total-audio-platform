# Claude Code Development Context & Instructions

## 🎯 Project Overview: Total Audio Promo

You are working on **Total Audio Promo**, a revolutionary AI-powered music promotion platform that serves two distinct markets:

1. **Independent Artists** (£50-200/month): Solo artists and emerging talent seeking affordable, automated promotion
2. **PR Agencies** (£500-2000/month): Music marketing firms managing multiple clients and scaling operations

**Core Mission**: Eliminate 94% of repetitive tasks in music PR while increasing campaign effectiveness by 300%+.

## 🏗️ Technical Architecture

### Primary Stack

```typescript
Frontend: Next.js 14 + TypeScript + Tailwind CSS + shadcn/ui
Backend: Node.js + Express/Fastify + PostgreSQL + Prisma
Auth: NextAuth.js with JWT
AI: OpenAI GPT-4 + Anthropic Claude
Storage: AWS S3 + CloudFront CDN
Queue: Bull/BullMQ + Redis
Deployment: Vercel (Frontend) + Railway/Render (Backend)
```

### Mobile Development

```swift
iOS: SwiftUI + Combine + AVFoundation
Development: Xcode + Cursor AI integration
Monetization: StoreKit 2 subscriptions
Strategy: VibeCode prototype → Professional development
```

## 🚀 Core Platform Features

### 1. AI Campaign Builder

**Purpose**: Generate complete 6-8 week promotional campaigns automatically

- Input: Track upload, target audience, budget, timeline
- Output: Multi-platform campaign with automation rules
- **Key Integration**: Audio analysis → Genre classification → Strategy generation

### 2. Smart Release Dashboard

**Purpose**: Central command center for managing multiple releases

- Real-time streaming data from Spotify, Apple Music, SoundCloud
- Social media metrics aggregation (Instagram, TikTok, Twitter, YouTube)
- Predictive analytics with success probability scoring
- **Key Feature**: Multi-client view for PR agencies managing 20+ artists

### 3. AI Content Studio

**Purpose**: Automated content generation at scale

- Press releases with industry-standard formatting
- Social media posts optimized per platform
- Personalized pitch templates for media contacts
- **Key Integration**: GPT-4 for content + Claude for press releases

### 4. Cross-Platform Automation

**Purpose**: Eliminate manual posting and updates

- Smart scheduling across all social platforms
- Content auto-adaptation (sizing, formatting, hashtags)
- CRM synchronization with Airtable, Notion, Google Sheets
- **Key Feature**: One-click campaign deployment

### 5. Unified Analytics Engine

**Purpose**: Cross-platform performance intelligence

- Real-time monitoring of 18+ platforms
- ROI calculation and campaign effectiveness tracking
- Automated white-label client reports
- **Key Integration**: Predictive modeling for success forecasting

## 🔌 Critical Integrations

### Music Platforms

```javascript
// Essential music platform APIs
Spotify for Artists API: Stream data, playlist tracking
Apple Music Connect: iOS app integration priority
SoundCloud API: Independent artist focus
Bandcamp API: Direct-to-fan monetization
YouTube Music API: Video content integration
```

### Social Media Platforms

```javascript
// Primary social automation targets
Instagram Graph API: Stories, posts, reels automation
TikTok Business API: Video content scheduling
Twitter API v2: Real-time engagement
YouTube Data API v3: Video upload automation
Facebook Graph API: Cross-platform integration
```

### Email & CRM Systems

```javascript
// Client management and outreach
Mailchimp API: Email campaign automation
SendGrid API: Transactional emails
Airtable API: Contact database management
Notion API: Project management integration
Google Sheets API: Data export/import
```

### AI & Content Generation

```python
# AI service integrations
OpenAI GPT-4: Content generation, campaign strategy
Anthropic Claude: Press release writing, industry copy
Spotify Web API: Audio analysis and genre classification
Custom ML models: Success prediction, audience matching
```

## 💰 Business Model & User Personas

### Independent Artists (Primary Target)

**Demographics**: Solo artists, small bands, 18-35 years old
**Pain Points**:

- Don't know who to pitch their music to
- Limited time for promotional activities
- Small budgets requiring maximum ROI
- Lack of industry connections and expertise

**Features They Need**:

- Smart contact discovery and playlist recommendations
- Automated social media posting with optimal timing
- AI-generated press materials and pitch templates
- Simple analytics dashboard showing growth metrics

### PR Agencies (High-Value Target)

**Demographics**: Music marketing firms, record labels, management companies
**Pain Points**:

- 94% of tasks are repetitive and manual
- Difficult to scale operations without hiring
- Time-consuming client reporting and campaign tracking
- Managing multiple artists across different platforms

**Features They Need**:

- Multi-client dashboard with team collaboration
- White-label reporting for client presentations
- Bulk campaign management and automation
- Advanced analytics and ROI tracking

## 🎯 Development Priorities

### Phase 1: MVP (Months 1-3)

**Core Infrastructure**:

```typescript
// Essential foundation components
User authentication and subscription billing
Basic dashboard with music upload functionality
Spotify for Artists integration for streaming data
Instagram posting automation (highest ROI platform)
Simple campaign builder with templates
```

**Success Metrics**:

- 50 beta users (25 indies, 25 agencies)
- Basic campaign creation in <10 minutes
- Successful social media posting automation
- User retention >70% after 30 days

### Phase 2: Feature Expansion (Months 4-6)

**Advanced Features**:

```typescript
// Scaling and optimization
AI content generation (press releases, social posts)
Multi-platform automation (TikTok, Twitter, YouTube)
Advanced analytics with predictive modeling
Team collaboration features for agencies
Email marketing integration and automation
```

**Success Metrics**:

- 500 active users with 60% paid conversion
- 3x improvement in pitch response rates
- Campaign creation time reduced to <5 minutes
- Platform integrations working at 99%+ reliability

### Phase 3: Scale (Months 7-12)

**Enterprise Features**:

```typescript
// Market domination capabilities
White-label customization for large agencies
API access for third-party integrations
Advanced AI features (voice analysis, trend prediction)
International expansion (multiple languages/currencies)
Mobile app launch (iOS priority, Android follow)
```

**Success Metrics**:

- 1,000+ users with enterprise clients
- £500K+ ARR with strong unit economics
- Industry recognition and partnership deals
- Mobile app achieving >4.5 App Store rating

## 🔧 Development Guidelines

### Code Quality Standards

```typescript
// TypeScript everywhere with strict type checking
// React components using composition over inheritance
// API-first design with comprehensive error handling
// Database queries optimized for performance
// Automated testing for critical user journeys

// Example: Proper error handling pattern
export async function createCampaign(data: CampaignData): Promise<Campaign> {
  try {
    const campaign = await db.campaign.create({ data });
    await scheduleAutomation(campaign.id);
    return campaign;
  } catch (error) {
    logger.error('Campaign creation failed', { error, data });
    throw new CampaignCreationError('Failed to create campaign');
  }
}
```

### Performance Requirements

- Page load times: <3 seconds on 3G connections
- API response times: <500ms for 95th percentile
- Database queries: <100ms for user-facing operations
- Image/audio uploads: Progress indicators and chunked uploads
- Mobile app: 60fps UI with smooth animations

### Security & Privacy

- GDPR compliance for EU users
- SOC 2 Type II certification target
- End-to-end encryption for sensitive data
- Rate limiting on all public APIs
- Regular security audits and penetration testing

## 🎵 Music Industry Context

### Understanding the Domain

**Playlist Ecosystem**: Spotify has 4+ million playlists; getting featured can mean 100K+ streams
**TikTok Impact**: 15-30 second clips drive 67% of new music discovery
**Press Coverage**: Music blogs still crucial for credibility and playlist placement
**Timing Strategy**: Fridays are global release days; campaigns must build anticipation

### Industry Pain Points We Solve

1. **Manual Media Lists**: Artists spend hours finding relevant contacts
2. **Generic Pitches**: 95% of pitches are ignored due to poor targeting
3. **Platform Fragmentation**: Managing 10+ platforms manually is overwhelming
4. **Poor Analytics**: Most artists can't measure campaign effectiveness
5. **Expensive Agencies**: Professional PR costs £2000+/month, unaffordable for indies

### Success Metrics That Matter

```javascript
// Key Performance Indicators for music promotion
Streaming Growth: Monthly listeners, playlist adds, saves
Social Engagement: Followers, shares, comments, user-generated content
Press Coverage: Blog mentions, playlist features, radio plays
Conversion Metrics: Email signups, concert ticket sales, merchandise
Financial Impact: Streaming revenue, booking fees, sync opportunities
```

## 🚨 Critical Success Factors

### Technical Excellence

- **Reliability**: Music releases are time-sensitive; system failures cost careers
- **Scalability**: Must handle viral content spikes and campaign surges
- **Integration Stability**: Platform API changes require immediate adaptation
- **Data Accuracy**: Incorrect analytics undermine strategic decisions

### Market Understanding

- **Industry Relationships**: Building credibility with music bloggers and playlist curators
- **Artist Education**: Most musicians don't understand digital marketing
- **Trend Awareness**: Music industry moves fast; staying current is essential
- **Pricing Strategy**: Balance accessibility for indies with agency profit margins

### Competitive Positioning

**Advantages Over Competitors**:

- Music industry specialization vs. generic marketing tools
- AI-first approach enabling unprecedented automation
- Unified platform replacing 10+ separate tools
- Dual market strategy serving both indies and agencies

**Threats to Monitor**:

- Spotify/Apple building competing features
- Existing agencies adopting similar AI tools
- Platform policy changes limiting automation
- Economic downturns affecting music marketing budgets

## 📋 Development Workflow

### Git Strategy

```bash
# Branch naming convention
feature/ai-campaign-builder
bugfix/spotify-integration-timeout
hotfix/subscription-billing-error

# Commit message format
feat: add AI content generation for press releases
fix: resolve Instagram posting authentication error
docs: update API integration documentation
```

### Testing Strategy

```typescript
// Comprehensive testing approach
Unit Tests: Business logic and utility functions
Integration Tests: API endpoints and database operations
E2E Tests: Critical user journeys (signup, campaign creation)
Performance Tests: Load testing for campaign launches
Security Tests: Authentication and data protection
```

### Deployment Pipeline

```yaml
# CI/CD workflow
Development: Feature branches → Staging deployment
Staging: Integration testing → Manual QA approval
Production: Blue/green deployment → Health checks
Monitoring: Error tracking → Performance metrics → User analytics
```

## 🎊 Success Vision

**Year 1 Goal**: Become the go-to platform for independent music promotion
**Year 3 Vision**: Industry standard for music marketing automation
**Long-term Mission**: Democratize music promotion and artist success

**Impact Metrics**:

- 10,000+ artists using the platform
- 100M+ streams generated through campaigns
- 500+ playlist placements per month
- £10M+ in artist revenue attributed to platform

---

## 💡 Key Development Reminders

1. **Music-First Design**: Every feature must solve real music industry problems
2. **Mobile Optimization**: Artists manage careers on mobile; desktop is secondary
3. **Viral Content Focus**: TikTok and Instagram drive discovery; prioritize these integrations
4. **Data-Driven Decisions**: Analytics must be actionable, not just informational
5. **Community Building**: Success comes from artist word-of-mouth and industry credibility

**Remember**: You're not just building software—you're building careers and transforming how music reaches audiences. Every line of code has the potential to change an artist's life.
