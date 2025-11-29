# Total Audio Promo - Master Context for Cursor Development

## 🎯 Project Overview

**Total Audio Promo**is an AI-powered music promotion ecosystem serving two markets:

- **Independent Artists**(£50-200/month): Emerging talent seeking affordable automation
- **PR Agencies**(£500-2000/month): Firms managing multiple clients at scale

**Core Mission**: Eliminate 94% of repetitive tasks in music PR while increasing campaign effectiveness by 300%+.

## 🏗️ Technical Stack

```typescript
// Primary Development Stack
Frontend: Next.js 14 + TypeScript + Tailwind CSS + shadcn/ui
Backend: Node.js + tRPC + PostgreSQL + Prisma ORM
Authentication: NextAuth.js with JWT tokens
AI Services: OpenAI GPT-4 + Anthropic Claude + Perplexity API
State Management: Zustand + TanStack Query
Styling: Tailwind CSS with custom Audio brand system
Testing: Jest + Playwright + Testing Library
Deployment: Vercel (Frontend) + Railway (Backend)
Monitoring: Sentry + PostHog + LogRocket
```

## 🚀 Current Development Priority: Audio Intel MVP

**Status**: Week 1 of 2-week MVP sprint
**Live URL**: intel.totalaudiopromo.com
**Goal**: Contact enrichment tool that transforms email addresses into comprehensive industry profiles

### Core Features to Build

1. **Contact Upload**: CSV file processing + manual entry
2. **AI Enrichment**: Perplexity API integration for contact intelligence
3. **Results Dashboard**: Clean display of enriched contact data
4. **Export Options**: CSV, Airtable sync, email campaigns

### Technical Requirements

```typescript
// Contact enrichment API endpoint
interface ContactEnrichment {
  email: string;
  name?: string;
  role?: string;
  company?: string;
  socialProfiles: {
    linkedin?: string;
    twitter?: string;
    instagram?: string;
  };
  recentActivity: ActivityItem[];
  submissionPreferences: {
    preferredFormat: string;
    responsePattern: string;
    activeHours: string;
  };
  confidence: number; // 0-100
}

// API Route Structure
POST /api/contacts/enrich
- Input: { emails: string[] }
- Processing: Perplexity API + domain analysis
- Output: EnrichedContact[]
- Rate Limit: 100 requests/hour (free), 1000/hour (paid)
```

## 🎨 Audio Brand System

### Brand Character Integration

- **Audio (AI Dog Mascot)**: Present across all tools with tool-specific animations
- **Color Activation**: Tools activate from B&W base to specific colors
- **Professional**: Suitable for both indie artists and agencies

### Tool-Specific Colors

```css
:root {
  /* Audio Intel - Electric Blue */
  --color-intel-500: #1e88e5;
  --color-intel-600: #1976d2;

  /* Playlist Pulse - Neon Green */
  --color-pulse-500: #43a047;
  --color-pulse-600: #388e3c;

  /* Release Radar - Orange */
  --color-radar-500: #ff9800;
  --color-radar-600: #f57c00;
}

/* Color activation system */
.audio-character {
  filter: grayscale(1);
  transition: filter 0.8s ease-in-out;
}

.audio-character.active-intel {
  filter: grayscale(0);
  --active-color: var(--color-intel-500);
}
```

## 🔌 Critical Integrations

### Music Industry APIs

```javascript
// Essential platform integrations
Spotify for Artists API: Stream data, playlist tracking
Apple Music Connect: Artist analytics
SoundCloud API: Independent artist focus
Instagram Graph API: Social media automation
TikTok Business API: Video content scheduling
Twitter API v2: Real-time engagement
```

### CRM & Email Systems

```javascript
// Contact management integrations
Airtable API: Contact database (517 contacts enriched)
Monday.com API: Project management
Google Sheets API: Data import/export
SendGrid API: Email campaigns
Mailchimp API: Marketing automation
```

### AI & Content Generation

```python
# AI service integrations
OpenAI GPT-4: Content generation, campaign strategy
Anthropic Claude: Press releases, industry copy
Perplexity API: Real-time contact research (LIVE)
Custom models: Success prediction, audience matching
```

## 📊 Current Status & Metrics

### Technical Performance

- Contact enrichment accuracy: 94%+
- API response time: <2 seconds
- System uptime: 99.9%
- Contacts processed: 517 (366 radio contacts)

### Business Targets

- Launch: 2 weeks from today
- Revenue goal: £1K MRR Month 1
- User acquisition: 50 beta users (25 indies, 25 agencies)
- Retention target: 80%+ after 30 days

## 🎯 Development Standards

### Component Architecture

```typescript
// Audio Brand Component
interface AudioCharacterProps {
  tool: 'intel' | 'pulse' | 'radar' | 'track' | 'clone' | 'predict';
  state: 'idle' | 'working' | 'success' | 'celebration';
  size: 'sm' | 'md' | 'lg';
  className?: string;
}

// Usage
<AudioCharacter tool="intel" state="working" size="md" />;
```

### API Design Patterns

```typescript
// tRPC Router Structure
export const appRouter = router({
  contacts: {
    enrich: procedure.input(contactEnrichSchema).mutation(({ input }) => enrichContact(input)),
    export: procedure.input(exportSchema).mutation(({ input }) => exportContacts(input)),
  },
  analytics: {
    usage: procedure.query(() => getUsageStats()),
  },
});
```

### Error Handling Standards

```typescript
// Consistent error handling
export class APIError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public code?: string
  ) {
    super(message);
    this.name = 'APIError';
  }
}

// Usage in API routes
try {
  const result = await enrichContact(email);
  return result;
} catch (error) {
  if (error instanceof APIError) {
    return NextResponse.json(
      { error: error.message, code: error.code },
      { status: error.statusCode }
    );
  }
  throw error;
}
```

## 🎵 Music Industry Context

### Understanding the Domain

- **Playlist Ecosystem**: 4M+ playlists on Spotify; placement = 100K+ streams
- **TikTok Impact**: 15-30 second clips drive 67% of music discovery
- **Release Strategy**: Fridays are global release days
- **Press Coverage**: Music blogs crucial for credibility and playlist placement

### Success Metrics That Matter

```javascript
// KPIs for music promotion
Streaming Growth: Monthly listeners, playlist adds, saves
Social Engagement: Followers, shares, user-generated content
Press Coverage: Blog mentions, playlist features, radio plays
Conversion: Email signups, concert tickets, merchandise sales
ROI: Streaming revenue, booking fees, sync opportunities
```

## 🚨 Critical Development Guidelines

### Performance Requirements

- Page load times: <3 seconds
- API response times: <500ms for 95th percentile
- Mobile-first design: Artists manage careers on mobile
- Accessibility: WCAG 2.1 AA compliance

### Security & Privacy

- GDPR compliance for EU users
- Rate limiting on all APIs
- Input validation with Zod schemas
- Secure environment variable handling

### Testing Strategy

```typescript
// Essential test coverage
Unit Tests: API endpoints, business logic
Integration Tests: Database operations, external APIs
E2E Tests: Critical user journeys (signup, enrichment)
Performance Tests: Load testing for contact processing
```

## 💡 Key Development Reminders

1. **Music-First Design**: Every feature solves real industry problems
2. **Audio Character Integration**: Brand mascot guides user experience
3. **Performance Critical**: Music campaigns are time-sensitive
4. **Two-Market Focus**: Solutions for both indies and agencies
5. **Ecosystem Thinking**: Tools integrate and enhance each other

---

## 🎊 Current Sprint Goals (Week 1-2)

### Audio Intel MVP Completion

- [ ] Contact upload interface (CSV + manual)
- [ ] Perplexity API enrichment engine
- [ ] Results dashboard with export options
- [ ] Payment integration (Stripe)
- [ ] Basic analytics and usage tracking

### Success Criteria

- Process 50+ contacts in <30 seconds
- 90%+ enrichment success rate
- Clean, professional UI suitable for agencies
- Export to Airtable working seamlessly
- Ready for beta user testing

**Remember**: You're building tools that can change an artist's career. Every feature should eliminate manual work and drive measurable results in music promotion.
