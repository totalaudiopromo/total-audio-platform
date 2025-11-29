# Audio Intel - Contact Enrichment for Music Professionals

**Status**:  Production Ready | **Live Site**: https://intel.totalaudiopromo.com

---

## What is Audio Intel?

Audio Intel is a contact enrichment SaaS for UK music industry professionals. Transform chaotic contact spreadsheets into organised, enriched databases in minutes instead of hours.

**Core Value**: "15 hours → 15 minutes" contact research time savings

---

## Quick Start

### Development

```bash
# Start development server
npm run dev:audio-intel

# Build for production
npm run build:audio-intel

# Run tests
npm run test:audio-intel

# TypeScript validation
npm run typecheck:audio-intel

# Linting
npm run lint:audio-intel
```

### Mobile Testing

```bash
# Run mobile test suite (Playwright)
npm run test:mobile

# Run with browser visible
npm run test:mobile:headed
```

---

## Product Status

### Complete & Production Ready

- Contact enrichment pipeline (100% success rate)
- Stripe payment integration (£19/£79 pricing)
- User authentication and management
- Mobile-optimised UX (21 issues resolved)
- Real-time analytics dashboard
- UK GDPR compliance (cookie banner, Privacy Policy, Terms of Service)
- SEO foundation (structured data, canonical URLs, sitemap)
- Newsletter system ("The Unsigned Advantage")
- Email automation (ConvertKit integration)

### Current Phase

**Customer Acquisition**- Technical foundation complete, now focus on first paying customers

---

## Pricing

- **Free Beta**: 10 enrichments/month
- **Professional**: £19/month - Unlimited enrichments
- **Agency**: £79/month - Unlimited enrichments + team features

---

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS + shadcn/ui
- **Database**: Prisma + PostgreSQL
- **Payments**: Stripe
- **Email**: ConvertKit
- **Enrichment**: Perplexity API
- **Testing**: Playwright (mobile suite)
- **Deployment**: Vercel

---

## Project Structure

```
apps/audio-intel/
 app/                      # Next.js app directory
    api/                  # API routes
    blog/                 # SEO blog posts (12 case studies)
    components/           # React components
    demo/                 # Upload/enrichment demo
    pricing/              # Pricing page
    beta/                 # Beta signup
    privacy/              # Privacy Policy
    cookies/              # Cookie Policy
    terms/                # Terms of Service
    contact/              # Contact & Support
    layout.tsx            # Root layout
 components/               # Shared components
 lib/                      # Utilities and helpers
 public/                   # Static assets
 tests/mobile/             # Playwright mobile tests
 docs/                     # Documentation
    archive/              # Historical docs
    pseo/                 # SEO documentation
    reference/            # Reference materials
    LIBERTY_DEMO_GUIDE.md # Demo walkthrough
 POST_DEPLOYMENT_CHECKLIST.md # Testing checklist
 README.md                 # This file
```

---

## Testing

### Mobile Testing Suite (Playwright)

- **Location**: `tests/mobile/`
- **Coverage**: 21 UX scenarios verified
- **Devices**: iPhone SE, iPad, Desktop (1920px)
- **Status**:  All tests passing

### Manual Testing

- Follow `POST_DEPLOYMENT_CHECKLIST.md` after deployments
- Test complete user journey: Signup → Upload → Enrichment → Export

---

## SEO & Analytics

### Blog Posts (12)

- BBC Radio 1, 1Xtra, Radio 2, Radio 6 Music case studies
- Spotify Editorial, Apple Music Editorial guides
- Kerrang Radio, Absolute Radio contact enrichment
- Music industry contact research guides
- All with structured data (JSON-LD) for rich snippets

### Sitemap

- 19 URLs indexed
- Auto-generated at `/sitemap.xml`
- Submitted to Google Search Console

### Analytics

- Google Analytics 4 integration
- Conversion tracking for demo signups
- Exit intent popup optimization

---

## Legal Compliance

### UK GDPR Complete 

- Cookie consent banner (react-cookie-consent)
- Privacy Policy ([/privacy](/privacy))
- Cookie Policy ([/cookies](/cookies))
- Terms of Service ([/terms](/terms))
- Contact & Support ([/contact](/contact))

### Data Protection

- ICO compliant
- User rights: Access, rectification, erasure, portability, restriction, objection, automation
- Data retention: 90 days max for enrichment data
- Third-party processors documented

---

## Design System

### Neo-Brutalist Style

- **Shadows**: `shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]`
- **Borders**: `border-2` or `border-4` with `border-gray-900`
- **Colors**: Purple primary, blue accents
- **Typography**: Bold headlines, clear hierarchy
- **Mobile**: Fully responsive, 44px+ touch targets

---

## Deployment

### Vercel Auto-Deploy

- **Branch**: `main` auto-deploys to production
- **Preview**: All branches get preview URLs
- **Build Time**: ~2 minutes
- **Status**:  Zero TypeScript errors, zero ESLint warnings

### Environment Variables Required

```bash
# Database
DATABASE_URL=

# Stripe
STRIPE_SECRET_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=

# ConvertKit
CONVERTKIT_API_KEY=
CONVERTKIT_FORM_ID=

# Perplexity (Enrichment)
PERPLEXITY_API_KEY=

# Auth
NEXTAUTH_SECRET=
NEXTAUTH_URL=
```

---

## Documentation

### Active Documentation

- **README.md**(this file) - Project overview
- **POST_DEPLOYMENT_CHECKLIST.md**- Testing guide
- **docs/LIBERTY_DEMO_GUIDE.md**- Demo walkthrough

### Archived Documentation

- **docs/archive/audit-history/**- Weekly optimization reports
- **docs/archive/mobile-testing/**- Mobile UX testing results
- **docs/archive/features/**- Feature implementation docs
- **docs/archive/marketing/**- Content and acquisition strategies

---

## Business Context

### Current Status (October 2025)

- **Stage**: Customer Acquisition Phase
- **Revenue**: £0 → Target: £500/month by November 2025
- **Customers**: 0 paying → Target: 5-10 beta customers
- **Focus**: Demo calls with radio promoters (85% conversion rate)

### Target Market

- **Primary**: UK radio promoters (highest conversion)
- **Secondary**: Independent artists with promotion budgets
- **Tertiary**: Small PR agencies

### Competitive Advantage

- UK-focused (vs expensive US tools)
- Built by actual radio promoter (authentic credibility)
- 80%+ cost savings vs SubmitHub
- "15 hours → 15 minutes" proven time savings

---

## Development Guidelines

### Code Standards

- **TypeScript**: Strict mode, no `any` types
- **Components**: Function components with interfaces
- **File Naming**: kebab-case for files, PascalCase for components
- **Commits**: Conventional commits (`feat:`, `fix:`, `docs:`)

### PR Requirements

- Zero TypeScript errors
- Zero ESLint warnings
- Mobile testing results included
- All legal pages remain functional

---

## Support

### Customer Support

- **Email**: support@totalaudiopromo.com
- **Response Times**:
  - Standard (Free/Pro): 48 hours
  - Priority (Agency): 24 hours
  - Critical Issues: 4 hours

### Developer Support

- Check archived documentation in `docs/archive/`
- Review git commit history for context
- Contact: Chris Schofield

---

## Success Metrics

### Technical Quality

-  Zero TypeScript errors
-  Zero ESLint warnings
-  100% mobile responsive
-  Sub-3-second page loads

### Business Metrics (Target)

- 5-10 paying customers by November 2025
- £500/month recurring revenue
- 25+ satisfied customer testimonials
- Industry recognition in UK music promotion

---

## Next Steps

### Immediate (This Week)

1. Book demo calls with radio promoter prospects
2. Test complete user journey with real customers
3. Monitor Google Search Console for SEO improvements

### Short-Term (This Month)

1. Convert first paying customer
2. Gather customer feedback
3. Iterate based on actual usage patterns

### Long-Term (Next Quarter)

1. Reach £500/month MRR
2. Build referral system
3. Expand feature set based on customer demand

---

**Last Updated**: October 12, 2025
**Build Status**:  Production Ready
**Next Action**: Customer acquisition (demo calls, case studies, outreach)

---

_Built with  by Chris Schofield | sadact (producer) | Total Audio Promo_
