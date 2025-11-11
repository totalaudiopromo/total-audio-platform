# Pitch Generator - MVP Audit Report

**Audited**: 5th October 2025
**Current Status**: 75% Audio Intel Standard Ready
**Technical Status**: 95% Complete (per existing checklist)
**Marketing Status**: 50% Complete (needs work)

---

## 🎯 Executive Summary

**The Gap**: Pitch Generator is **technically complete** but **marketing incomplete** compared to Audio Intel's professional standard.

### What's Working ✅

- Core feature (pitch generation) fully implemented
- Database schema complete with proper relationships
- Authentication and user management working
- Stripe payment integration configured
- Clean Postcraft UI design consistent

### Critical Marketing Gaps ❌

1. **SEO metadata incomplete** - No OpenGraph tags for social sharing
2. **Pricing copy is template boilerplate** - Needs pitch-specific value proposition
3. **No social proof or case studies** - Missing credibility signals
4. **Homepage copy too vague** - "500+ campaigns" unverified claim
5. **Free trial mentioned but not implemented** - Inconsistent messaging

---

## 📊 Comparison: Pitch Generator vs Audio Intel Standard

| Element                 | Audio Intel                                   | Pitch Generator                                  | Gap          |
| ----------------------- | --------------------------------------------- | ------------------------------------------------ | ------------ |
| **SEO Metadata**        | ✅ Full OpenGraph + Twitter Cards             | ❌ Basic title + description only                | **CRITICAL** |
| **Social Proof**        | ✅ BBC Radio 1, Spotify case studies          | ⚠️ Vague "500+ campaigns"                        | **HIGH**     |
| **Pricing Copy**        | ✅ Time savings calculator, specific features | ❌ Generic template boilerplate                  | **CRITICAL** |
| **Case Studies**        | ✅ Real contact enrichment examples           | ❌ No examples of generated pitches              | **HIGH**     |
| **Founder Credibility** | ✅ Chris's 5+ years, BBC Radio 1 experience   | ❌ Not mentioned anywhere                        | **MEDIUM**   |
| **CTA Strategy**        | ✅ Clear hierarchy, single primary CTA        | ⚠️ Multiple CTAs, unclear priority               | **MEDIUM**   |
| **Free Trial**          | ✅ FREE tier (10 enrichments)                 | ❌ Claims "7-day free trial" but not implemented | **CRITICAL** |
| **Mobile UX**           | ✅ 21 issues resolved, tested                 | ❓ Not tested yet                                | **MEDIUM**   |
| **Analytics**           | ✅ Conversion tracking setup                  | ❌ No analytics installed                        | **HIGH**     |
| **Onboarding**          | ✅ First-time user guidance                   | ❌ No welcome/tutorial flow                      | **HIGH**     |

---

## 🔍 Detailed Audit by Section

### 1. Homepage Marketing Copy

**File**: [app/page.tsx](app/page.tsx)

#### Hero Section (Lines 47-97)

✅ **Strong value prop**: "Write 50 personalised pitches in 20 minutes"
✅ **Clear problem statement**: Lists 3 specific pain points
❌ **Weak competitor positioning** (line 81): "Generic ChatGPT outputs sound robotic" - need stronger angle
❌ **Unverified claim** (line 90): "30 seconds per pitch" - is this accurate?

**Recommended changes**:

```typescript
// LINE 81-82: Strengthen ChatGPT comparison
// BEFORE:
<span>Generic ChatGPT outputs sound robotic and get ignored</span>

// AFTER:
<span>ChatGPT doesn't know your contacts. Pitch Generator pulls from YOUR database for real personalisation.</span>

// LINE 58-60: Add credibility
<p className="max-w-xl text-base text-gray-600 sm:text-lg">
  Built by radio promoters with 5+ years pitching to BBC Radio 1, Amazing Radio, and 100+ music blogs.
  Pitch Generator uses proven templates that actually get responses.
</p>
```

#### Social Proof Section (Lines 144-154)

❌ **CRITICAL**: "Proven templates from 500+ campaigns" is unverifiable
❌ **Missing founder story**: Chris's BBC Radio 1, Royal Blood connections not mentioned
❌ **No client logos or testimonials**: Zero trust signals

**Recommended replacement**:

```typescript
<section className="glass-panel px-6 py-10 sm:px-10">
  <div className="text-center">
    <p className="text-xs font-semibold uppercase tracking-[0.45em] text-gray-500">
      Built by Industry Professionals
    </p>
    <h2 className="mt-4 text-3xl font-semibold">
      Real pitches that got results at BBC Radio 1, Amazing Radio, and Spotify playlists
    </h2>
    <p className="mx-auto mt-4 max-w-2xl text-gray-600">
      Created by Chris Schofield – 5+ years as a radio promoter, producer (sadact), and connections
      to Royal Blood, Architects, and Rolo Tomassi campaigns. These templates are based on pitches
      that actually worked in the real world.
    </p>
  </div>
</section>
```

#### Free Trial Claim (Line 162)

❌ **CRITICAL INCONSISTENCY**: "Start your 7-day free trial. Generate unlimited pitches. No credit card required."

**Problem**: No free trial is configured anywhere in:

- Stripe product setup
- Middleware authentication logic
- Pricing tiers

**Solutions**:

1. **Option A (Quick Fix)**: Remove free trial mention entirely

```typescript
// LINE 161-163
<p className="mt-2 max-w-xl text-sm text-gray-600">
  Join radio promoters, independent artists, and PR agencies saving 5+ hours per campaign. Start
  generating professional pitches in minutes.
</p>
```

2. **Option B (Better)**: Implement a FREE tier like Audio Intel

```typescript
// Add to pricing tiers:
{
  id: 'free' as const,
  name: 'Free',
  monthly: 0,
  annual: 0,
  blurb: 'Try Pitch Generator with limited pitch generation.',
  features: [
    '10 pitches per month',
    'Basic templates (radio, blog, playlist)',
    'Audio Intel contact sync',
    'Email support (48-hour response)',
  ],
  limits: {
    pitchesPerMonth: 10,
  }
}
```

---

### 2. Pricing Page Analysis

**File**: [app/pricing/page.tsx](app/pricing/page.tsx)

#### ❌ CRITICAL ISSUES - COMPLETE REWRITE NEEDED

**Current pricing copy** (lines 12-30):

```typescript
blurb: 'Designed for indie promoters launching new audio products.',
features: [
  'Unlimited campaign dashboards',
  'Automated PDF export patterns',
  'Access to Postcraft component kit',
],
```

**Problems**:

1. "Audio products" is vague - what are those?
2. "Postcraft component kit" is a developer tool, not a customer feature
3. "Automated PDF export patterns" sounds technical, not benefit-focused
4. No mention of pitch volume, AI quality, or time savings

#### 🔧 REQUIRED REWRITE (Complete replacement)

```typescript
const plans = [
  {
    id: 'professional' as const,
    name: 'Professional',
    monthly: 39,
    annual: 390,
    blurb: 'For independent artists and solo radio promoters running 5-10 campaigns per year.',
    features: [
      'Generate unlimited personalized pitches',
      'Sync contacts from Audio Intel database',
      'Multiple campaign templates (radio, blog, playlist)',
      'Copy-to-clipboard for quick sending',
      'Email support within 24 hours',
    ],
    limits: null,
  },
  {
    id: 'agency' as const,
    name: 'Agency',
    monthly: 79,
    annual: 790,
    blurb: 'For PR agencies and promoters managing multiple client campaigns simultaneously.',
    features: [
      'Everything in Professional',
      'Team collaboration (up to 5 users)',
      'Custom pitch templates and brand voice',
      'Bulk pitch generation for 50+ contacts at once',
      'Priority email support (4-hour response)',
      'Campaign performance tracking',
    ],
    limits: null,
  },
];
```

**Pricing page header** needs customer-facing copy (lines 86-91):

```typescript
// BEFORE (developer-facing):
<h1 className="mt-6 text-3xl font-semibold">Pick a launch plan</h1>
<p className="mt-4 max-w-2xl text-sm text-gray-600">
  These tiers map to the Stripe price IDs referenced in the checkout API...
</p>

// AFTER (customer-facing):
<h1 className="mt-6 text-3xl font-semibold">Stop spending 5+ hours per campaign on pitches</h1>
<p className="mt-4 max-w-2xl text-sm text-gray-600">
  Choose a plan based on your campaign volume. All plans include unlimited pitch generation,
  Audio Intel integration, and proven templates from real BBC Radio 1 and blog campaigns.
</p>
```

---

### 3. SEO & Meta Tags

**Current implementation** ([app/layout.tsx](app/layout.tsx):11-14):

```typescript
export const metadata: Metadata = {
  title: 'Pitch Generator - AI-Powered Music PR Pitches',
  description:
    'Write 50 personalized music PR pitches in 20 minutes. AI that sounds human, powered by your contact data.',
};
```

#### ❌ Missing Critical SEO Elements

1. **No OpenGraph tags** - Social media previews won't work
2. **No Twitter Card meta** - Twitter/X shares will look broken
3. **No keywords** - Missing important search terms
4. **No canonical URL** - Duplicate content risk
5. **No favicon/app icons** - No branded app icon in browser tabs
6. **No structured data** - Missing Schema.org SoftwareApplication markup

#### 🔧 REQUIRED: Complete SEO Implementation

Create **`app/metadata.ts`**:

```typescript
import { Metadata } from 'next';

export const siteConfig = {
  name: 'Pitch Generator',
  description:
    'Write 50 personalised music PR pitches in 20 minutes. AI-powered pitch writing for radio promoters, independent artists, and PR agencies. Built by industry professionals with 5+ years BBC Radio 1 experience.',
  url: 'https://pitches.totalaudiopromo.com', // UPDATE WITH ACTUAL DOMAIN
  ogImage: '/og-pitch-generator.png', // CREATE THIS 1200x630px IMAGE
  keywords: [
    'music PR pitches',
    'radio promotion pitches',
    'AI pitch writer',
    'music PR automation',
    'independent artist PR',
    'radio plugger tools',
    'BBC Radio pitches',
    'Amazing Radio submissions',
    'music blog pitches',
    'playlist pitching tool',
    'music PR software',
    'radio promotion automation',
    'personalized music pitches',
    'AI music marketing',
  ],
};

export const defaultMetadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} - AI-Powered Music PR Pitches`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  authors: [
    {
      name: 'Chris Schofield',
      url: 'https://totalaudiopromo.com',
    },
  ],
  creator: 'Total Audio Promo',
  publisher: 'Total Audio Promo',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: `${siteConfig.name} - AI-Powered Music PR Pitches`,
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.name,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
    creator: '@totalaudiopromo', // UPDATE WITH ACTUAL TWITTER HANDLE
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
    other: [
      {
        rel: 'mask-icon',
        url: '/safari-pinned-tab.svg',
      },
    ],
  },
  manifest: '/site.webmanifest',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};
```

Update **`app/layout.tsx`**:

```typescript
import { defaultMetadata } from './metadata';

export const metadata = defaultMetadata;
```

#### Required Assets to Create:

1. **`/public/og-pitch-generator.png`** (1200x630px) - Social sharing preview image
2. **`/public/favicon.ico`** - Browser tab icon
3. **`/public/favicon-16x16.png`** - Small favicon
4. **`/public/favicon-32x32.png`** - Standard favicon
5. **`/public/apple-touch-icon.png`** (180x180px) - iOS home screen icon
6. **`/public/safari-pinned-tab.svg`** - Safari pinned tab icon
7. **`/public/site.webmanifest`** - PWA manifest file

---

### 4. Analytics & Conversion Tracking

#### ❌ Currently Missing:

1. **Page view tracking** - Don't know traffic volume
2. **CTA click tracking** - Don't know which CTAs convert
3. **Signup funnel** - No visibility into conversion rates
4. **Pitch generation metrics** - Can't measure core feature usage
5. **Checkout abandonment** - Don't know why users don't complete payment

#### 🔧 REQUIRED: Add Plausible Analytics

**Option 1: Plausible (Recommended - Privacy-focused, UK-based)**

Add to **`app/layout.tsx`** (inside `<head>`):

```typescript
import Script from 'next/script';

// Inside <html> tag:
<Script defer data-domain="pitches.totalaudiopromo.com" src="https://plausible.io/js/script.js" />;
```

**Track custom events**:

```typescript
// On CTA clicks:
window.plausible('CTA Click', { props: { location: 'hero', text: 'Start free trial' } });

// On pitch generation:
window.plausible('Pitch Generated', { props: { template: 'radio' } });

// On signup:
window.plausible('Signup Complete');
```

**Option 2: Google Analytics (More features, less privacy)**

```typescript
<Script
  src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"
  strategy="afterInteractive"
/>
<Script id="google-analytics" strategy="afterInteractive">
  {`
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-XXXXXXXXXX');
  `}
</Script>
```

---

### 5. Onboarding Flow

#### ❌ CRITICAL GAP: No First-Time User Experience

**Current flow**:

1. User clicks "Start free trial" → `/auth/signin`
2. User signs in
3. User lands at... **WHERE?** (Unclear what page they see)

**Problem**: New users don't know what to do after signin. No welcome message, no tutorial, no sample data.

#### 🔧 REQUIRED: Create Onboarding Dashboard

Create **`app/dashboard/page.tsx`**:

```typescript
'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Sparkles, Users, FileText } from 'lucide-react';

export default function DashboardPage() {
  const { data: session } = useSession();
  const [pitchCount, setPitchCount] = useState(0);
  const [isNewUser, setIsNewUser] = useState(false);

  useEffect(() => {
    // Check if user has generated any pitches
    fetch('/api/pitches')
      .then(res => res.json())
      .then(data => {
        setPitchCount(data.pitches?.length || 0);
        setIsNewUser(data.pitches?.length === 0);
      });
  }, []);

  if (isNewUser) {
    return (
      <div className="mx-auto max-w-4xl">
        {/* Welcome message for new users */}
        <section className="glass-panel px-8 py-10">
          <h1 className="text-3xl font-bold">
            Welcome to Pitch Generator, {session?.user?.name || 'there'}! 👋
          </h1>
          <p className="mt-4 text-gray-600">
            You're 3 steps away from writing professional music PR pitches in 30 seconds.
          </p>

          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {/* Step 1: Import Contacts */}
            <div className="glass-panel px-6 py-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="mt-4 font-semibold">1. Add Contacts</h3>
              <p className="mt-2 text-sm text-gray-600">
                Import from Audio Intel or add contacts manually
              </p>
              <Link href="/contacts" className="cta-button mt-4 w-full justify-center">
                Add contacts →
              </Link>
            </div>

            {/* Step 2: Generate First Pitch */}
            <div className="glass-panel px-6 py-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100">
                <Sparkles className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="mt-4 font-semibold">2. Generate Your First Pitch</h3>
              <p className="mt-2 text-sm text-gray-600">Choose a template and let AI do the work</p>
              <Link href="/pitch" className="cta-button mt-4 w-full justify-center">
                Create pitch →
              </Link>
            </div>

            {/* Step 3: Send & Track */}
            <div className="glass-panel px-6 py-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                <FileText className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="mt-4 font-semibold">3. Copy & Send</h3>
              <p className="mt-2 text-sm text-gray-600">One-click copy to your email client</p>
              <button disabled className="subtle-button mt-4 w-full justify-center opacity-50">
                Generate a pitch first
              </button>
            </div>
          </div>

          {/* Sample Pitch Preview */}
          <div className="mt-8 glass-panel bg-gray-50 px-6 py-6">
            <h3 className="font-semibold">Example Pitch (BBC Radio 1 template):</h3>
            <div className="mt-4 rounded-lg border border-gray-200 bg-white p-4 text-sm">
              <p className="font-medium">
                Subject: New track from [Artist] - perfect for late-night rotation
              </p>
              <p className="mt-3 text-gray-700">
                Hi [DJ Name],
                <br />
                <br />
                Hope you're well! I wanted to share [Artist]'s new track "[Track Name]" - it's got that
                late-night vibe I know your listeners love.
                <br />
                <br />
                Quick context: [Artist] has been building momentum with 50k+ Spotify streams and
                support from Amazing Radio. This track fits perfectly with what you played last week
                (loved that [Similar Artist] spin!).
                <br />
                <br />
                Stream here: [link]
                <br />
                Downloads: [link]
                <br />
                <br />
                Let me know if you'd like more info!
                <br />
                <br />
                Cheers,
                <br />
                [Your Name]
              </p>
            </div>
            <p className="mt-4 text-xs text-gray-500">
              ✨ This pitch took 25 seconds to generate with AI + contact data
            </p>
          </div>
        </section>
      </div>
    );
  }

  // Regular dashboard for existing users with pitch history
  return (
    <div className="mx-auto max-w-6xl">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <p className="mt-2 text-gray-600">You've generated {pitchCount} pitches. Keep going!</p>
      {/* Stats, recent pitches, quick actions */}
    </div>
  );
}
```

---

### 6. Missing Features Analysis

#### Core Features Status:

✅ **Pitch generation API** - Confirmed working (per checklist)
✅ **Contact management** - Database schema exists
✅ **Template library** - Implemented
✅ **Pitch history** - Confirmed working
⚠️ **Copy-to-clipboard** - Needs verification
❌ **Example pitch screenshot on homepage** - Not present
❌ **Pitch performance tracking** - Database table exists but UI unclear

#### UX Features Missing:

- [ ] **Bulk pitch generation** - Generate 50 pitches at once
- [ ] **Pitch editing** - Edit AI output before copying
- [ ] **Pitch versioning** - Track iterations of same pitch
- [ ] **Success rate tracking** - Did the pitch get a response?
- [ ] **Template customisation** - Create custom templates
- [ ] **Team collaboration** - Share pitches with team (Agency tier)

---

## 🚀 Launch Readiness Scoring

### Technical Readiness: **95%** ✅

- Core feature works
- Database properly configured
- Authentication secure
- Payments integrated
- Only needs: API keys + testing

### Marketing Readiness: **50%** ⚠️

- Homepage exists but needs refinement
- Pricing page needs complete rewrite
- SEO metadata critically incomplete
- No social proof or case studies
- Analytics not installed

### Overall MVP Readiness: **75%**

---

## ✅ Priority Action Plan (Ordered by Impact)

### 🔴 CRITICAL (Must fix before launch)

1. **Rewrite pricing page copy** (30 min)
   - Remove template boilerplate
   - Add pitch-specific features
   - Show value vs time saved

2. **Add complete SEO metadata** (45 min)
   - Create `metadata.ts` with OpenGraph + Twitter Cards
   - Generate OG image (1200x630px)
   - Create favicon set

3. **Fix "free trial" inconsistency** (15 min)
   - Option A: Remove mention from homepage
   - Option B: Implement FREE tier (10 pitches/month)

4. **Add founder credibility to homepage** (20 min)
   - Replace "500+ campaigns" with Chris's BBC Radio 1 story
   - Add "Built by radio promoters" credibility

5. **Install analytics tracking** (20 min)
   - Add Plausible script to layout
   - Track CTA clicks, signups, pitch generation

### 🟡 HIGH PRIORITY (Launch week)

6. **Create onboarding dashboard** (2 hours)
   - Welcome screen for new users
   - 3-step quick start guide
   - Example pitch preview

7. **Add example pitch screenshot to homepage** (30 min)
   - Show real AI-generated pitch output
   - Demonstrates quality immediately

8. **Mobile UX testing** (1 hour)
   - Run Playwright mobile test suite
   - Fix any responsive design issues

9. **Create OG image and favicon set** (1 hour)
   - Design 1200x630px social sharing image
   - Generate all required icon sizes

10. **Set up Stripe webhooks** (1 hour)
    - Handle checkout.session.completed
    - Handle subscription cancellations
    - Send receipt emails

### 🟢 MEDIUM PRIORITY (Post-launch week 1)

11. **Add testimonials section** (when available)
12. **Create "How It Works" detailed page**
13. **Add case study: "See a real pitch that worked"**
14. **Legal pages**: Privacy, Terms, Refund Policy
15. **Email welcome sequence** (3-5 emails)

---

## 📝 Content Gaps Summary

### Missing Pages

- About/Founder Story
- Detailed "How It Works" with screenshots
- Examples/Case Studies
- Blog (for SEO content)
- Help/FAQ
- Contact/Support

### Missing Copy Elements

- Time savings calculator ("5 min × 50 pitches = 4+ hours saved")
- Competitor comparison table (vs Manual, vs ChatGPT, vs Submithub)
- Beta pricing disclaimer ("Lock in launch pricing before Nov increase")
- Feature roadmap ("Coming soon: team collaboration, custom templates")

---

## 🎯 Recommended Launch Timeline

### Week 1 (Pre-Launch)

- **Day 1-2**: Fix CRITICAL issues (pricing copy, SEO, free trial)
- **Day 3-4**: Add onboarding flow + example screenshots
- **Day 5**: Mobile testing + analytics setup
- **Day 6-7**: Final testing with 3-5 beta testers

### Launch Day

- Announce on Total Audio Promo email list + social
- Post in r/WeAreTheMusicMakers, music industry forums
- Launch offer: "First 50 users: 50% off for 3 months"

### Week 2 (Post-Launch)

- Daily usage monitoring
- User feedback collection (15-min calls)
- Bug fixes and quick wins
- Content marketing: "How to write better pitches" blog series

---

## 🏆 Success Metrics to Track

### Week 1 Targets

- [ ] 10+ signups
- [ ] 3+ paying customers
- [ ] 50+ pitches generated
- [ ] <5% error rate on pitch generation

### Month 1 Targets

- [ ] £500/month recurring revenue
- [ ] 25+ satisfied users
- [ ] 5+ testimonials collected
- [ ] <2% churn rate

---

**Last Updated**: 5th October 2025
**Next Review**: After CRITICAL issues resolved
**Audit Completed By**: Claude Code (via Chris Schofield)
