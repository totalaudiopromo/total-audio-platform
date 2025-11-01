# Total Audio Promo - System Architecture Reference

## Overview

Total Audio Promo is a comprehensive music promotion platform with multi-tenant SaaS architecture serving both independent artists and PR agencies.

## Core System Components

### 1. **Multi-Tenant Structure**

```
Users (Artists, Agency Owners, Admins)
  ├── Agencies (PR Companies with white-label options)
  ├── Artists (Independent or agency-managed)
  ├── Campaigns (Promotion campaigns with analytics)
  └── Contacts (Industry contacts with engagement tracking)
```

### 2. **Database Schema (Prisma)**

#### **Core Models:**

- **User**: System users with role-based access (ARTIST, AGENCY, ADMIN)
- **Agency**: PR agencies with branding configuration
- **Artist**: Individual artists (independent or agency-managed)
- **Campaign**: Promotion campaigns with analytics
- **Contact**: Industry contacts with engagement tracking
- **EmailCampaign**: Email campaigns with Mailchimp integration
- **Integration**: Third-party service configurations
- **Report**: AI-generated insights and recommendations

#### **Key Relationships:**

- Users can own agencies or be artists
- Agencies manage multiple artists
- Artists have multiple campaigns
- Campaigns target multiple contacts
- All data is tenant-isolated

### 3. **Application Structure**

#### **Apps (Monorepo)**

```
apps/
├── api/                    # Backend API (Node.js + Express + Prisma)
├── web/                    # Main web dashboard (Next.js)
├── audio-intel/            # Audio intelligence tool (Next.js)
├── playlist-pulse/         # Playlist curator discovery (Next.js)
├── seo-tool/              # SEO analysis tool (Next.js)
└── mobile/                # Mobile app (React Native)
```

#### **Backend Services (`apps/api/src/`)**

```
routes/
├── auth.ts                # Authentication & authorization
├── campaigns.ts           # Campaign management
├── contacts.ts            # Contact management
├── analytics.ts           # Analytics & reporting
├── integrations.ts        # Third-party integrations
├── agencies.ts            # Agency management
├── artists.ts             # Artist management
├── billing.ts             # Subscription & billing
├── reports.ts             # AI-generated reports
└── webhooks.ts            # Webhook handlers
```

#### **Core Services**

```
services/
├── airtableContactEnrichment.ts    # Contact data enrichment
├── airtableDomainAnalysis.ts       # Domain analysis
├── airtableAudit.ts                # Data quality audits
├── perplexityContactResearch.ts    # AI-powered research
└── curatorDiscovery.ts             # Playlist curator discovery
```

### 4. **Technology Stack**

#### **Frontend:**

- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS + shadcn/ui components
- **State Management**: React Query + Context API
- **TypeScript**: Full type safety throughout

#### **Backend:**

- **Runtime**: Node.js + Express.js
- **Database**: PostgreSQL with Prisma ORM
- **Cache**: Redis for job queues and sessions
- **Authentication**: JWT with role-based access

#### **Integrations:**

- **Airtable**: CRM data synchronization
- **Mailchimp**: Email campaign management
- **Gmail**: Email tracking and analytics
- **Claude AI**: Content generation and insights
- **Perplexity**: AI-powered research
- **Make.com**: Workflow automation

### 5. **Key Features**

#### **Contact Enrichment System**

```typescript
interface EnrichmentData {
  email: string;
  domain: string;
  stationName: string;
  websiteUrl: string;
  scrapedData: {
    format: string;
    genres: string[];
    submissionGuidelines: string;
    contactPreferences: string;
    djNames: string[];
    showInfo: string[];
    contactForms: string[];
    socialMedia: string[];
    additionalContacts: string[];
    rawContent: string;
  };
  confidence: number;
  errors: string[];
  contactIntelligence: string;
}
```

#### **Campaign Types**

- **EMAIL**: Email promotion campaigns
- **SOCIAL**: Social media campaigns
- **RADIO**: Radio station outreach
- **PLAYLIST**: Playlist placement campaigns

#### **User Roles & Permissions**

- **ARTIST**: Limited access to own campaigns and data
- **AGENCY**: Manage multiple artists under their agency
- **ADMIN**: Full system access

### 6. **Real-Time Features**

- **Socket.io**: Live campaign updates
- **Real-time Analytics**: Campaign performance tracking
- **Email Tracking**: Open rates, clicks, replies
- **Contact Engagement**: Interaction scoring

### 7. **Business Logic**

#### **Pricing Structure**

- **Artists**: £45/month + £200 setup fee
- **Agencies**: £150/month + £500 setup fee

#### **Brand Colors**

- **Primary**: #f6ab00 (Yellow)
- **Secondary**: #2538c7 (Blue)

#### **Multi-Tenancy**

- Data isolation at database level
- White-label options for agencies
- Custom branding configuration

### 8. **AI Integration**

#### **Claude AI Features**

- Campaign report generation
- Content creation assistance
- Contact engagement analysis
- Performance insights

#### **Perplexity Research**

- Automated contact research
- Industry trend analysis
- Competitive intelligence

### 9. **Data Flow**

#### **Campaign Workflow**

1. **Creation**: Artist/Agency creates campaign
2. **Contact Selection**: Import from Airtable/manual upload
3. **Enrichment**: AI-powered contact research
4. **Execution**: Email campaigns via Mailchimp
5. **Tracking**: Real-time engagement monitoring
6. **Analysis**: AI-generated performance reports

#### **Integration Workflow**

1. **Airtable Sync**: Contact data import/export
2. **Mailchimp**: Campaign creation and execution
3. **Gmail**: Reply tracking and analytics
4. **Make.com**: Automated workflow triggers
5. **Claude AI**: Content and report generation

### 10. **Security & Compliance**

- JWT-based authentication
- Role-based access control
- Data encryption at rest and in transit
- GDPR compliance considerations
- Rate limiting and abuse prevention

### 11. **Development Workflow**

#### **Scripts Available**

```bash
npm run dev                    # Start all services
npm run dev:audio-intel       # Audio Intel app
npm run dev:playlist-pulse    # Playlist Pulse app
npm run dev:backend           # Backend API
npm run build                 # Build all apps
npm run test                  # Run all tests
npm run typecheck             # Type checking
npm run db:migrate            # Database migrations
```

#### **Environment Configuration**

- Development, staging, production environments
- Environment-specific configurations
- Secret management via environment variables

---

## Quick Reference

### **Key Directories**

- `apps/api/src/routes/` - API endpoints
- `apps/api/src/services/` - Business logic
- `apps/api/prisma/` - Database schema
- `docs/` - Documentation
- `tools/agents/` - AI agents and automation

### **Important Files**

- `CLAUDE.md` - Claude development guidance
- `package.json` - Root workspace configuration
- `apps/api/prisma/schema.prisma` - Database schema
- `apps/api/src/integrations/` - Third-party integrations

### **Development Priorities**

1. Multi-tenant data isolation
2. Real-time campaign tracking
3. AI-powered insights
4. Seamless integration workflow
5. White-label agency support
