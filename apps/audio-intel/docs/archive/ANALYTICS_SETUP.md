# AUDIO INTEL ANALYTICS SETUP

**Last Updated**: October 4, 2025
**Purpose**: Track PSEO organic traffic and conversions via Command Centre

## ✅ CURRENT SETUP

### Google Tag Manager

- **GTM ID**: `GTM-WZNJWDKH`
- **Location**: `/apps/audio-intel/app/layout.tsx` (lines 123-143)
- **Status**: ✅ Installed and active

### Internal Analytics API

- **Location**: `/apps/audio-intel/app/api/analytics/route.ts`
- **Tracking Functions**: `/apps/audio-intel/utils/analytics.ts`
- **Status**: ✅ Built but needs database connection

### Command Centre Integration

- **Dashboard**: `https://command.totalaudiopromo.com/analytics`
- **API Endpoint**: `/apps/command-centre/app/api/audio-intel-metrics/route.ts`
- **Status**: ⚠️ Configured for localhost:3001 (needs production URL)

## 🔧 FIXES NEEDED

### 1. Update Command Centre to Pull from Production

**Current**(line 6 in command-centre/app/api/audio-intel-metrics/route.ts):

```typescript
const audioIntelBaseUrl = 'http://localhost:3001';
```

**Should be**:

```typescript
const audioIntelBaseUrl = process.env.AUDIO_INTEL_API_URL || 'https://intel.totalaudiopromo.com';
```

### 2. Add Environment Variable

Add to `/apps/command-centre/.env.local`:

```
AUDIO_INTEL_API_URL=https://intel.totalaudiopromo.com
```

### 3. Enable Audio Intel Analytics API

The `/api/analytics` endpoint exists but needs to store data. Current flow:

- Page views tracked via `trackPageView()`
- Events sent to `/api/analytics` (POST)
- Data should be stored in database or sent to external service

## 📊 WHAT WE'RE TRACKING

### Page-Level Tracking (via GTM)

1. **PSEO Page Views**: All `/blog/*-contact-enrichment` pages
2. **Homepage visits**
3. **Pricing page visits**
4. **Upload page visits**
5. **Demo interactions**

### Event Tracking (via analytics.ts)

1. **File uploads**: `trackFileUpload()`
2. **Enrichment starts**: `trackEnrichmentStart()`
3. **Enrichment completions**: `trackEnrichmentComplete()`
4. **Exports**: `trackExport()`
5. **Funnel progression**: `trackFunnelProgression()`
6. **Page views**: `trackPageView()`
7. **Errors**: `trackError()`

### Conversion Funnel

1. **Step 1**: PSEO page view (organic traffic)
2. **Step 2**: Homepage/pricing page visit
3. **Step 3**: Demo interaction or file upload
4. **Step 4**: Account creation
5. **Step 5**: Payment (conversion)

## 🎯 COMMAND CENTRE DASHBOARD METRICS

**Currently displays**(from `/apps/command-centre/app/analytics/page.tsx`):

- Total Revenue & MRR
- User Growth
- Contacts Enriched
- Emails Validated
- API Calls
- Success Rates
- System Uptime

**What we need to add for PSEO tracking**:

- Organic traffic by PSEO page
- Top performing PSEO pages (traffic + conversions)
- PSEO → Signup conversion rate
- PSEO → Payment conversion rate
- Search keywords bringing traffic
- Geographic distribution of PSEO traffic

## 📈 PSEO-SPECIFIC TRACKING SETUP

### Track Organic Traffic Sources

Add to each PSEO page's `page.tsx`:

```typescript
'use client';
import { useEffect } from 'react';
import { trackPageView } from '@/utils/analytics';

export default function PSEOPage() {
  useEffect(() => {
    // Track PSEO page view with referrer
    trackPageView('bbc-radio-1-contact-enrichment', {
      page_type: 'pseo',
      topic: 'bbc-radio-1',
      search_volume: 1200, // from programmatic-pages.csv
      referrer: document.referrer,
      utm_source: new URLSearchParams(window.location.search).get('utm_source'),
      organic: !document.referrer || document.referrer.includes('google') || document.referrer.includes('bing')
    });
  }, []);

  return (
    // ... page content
  );
}
```

### Track PSEO → Conversion

Add conversion tracking when users click CTAs from PSEO pages:

```typescript
// On "Try Audio Intel Free" button click
onClick={() => {
  trackEvent({
    event: 'pseo_cta_click',
    category: 'conversion',
    action: 'cta_click',
    label: 'bbc-radio-1-pseo-to-signup',
    custom_parameters: {
      page: 'bbc-radio-1-contact-enrichment',
      cta_type: 'free_trial',
      cta_position: 'hero'
    }
  });
  window.location.href = '/pricing?utm_source=pseo&utm_campaign=bbc-radio-1';
}}
```

## 🔄 COMPLETE ANALYTICS FLOW

```
User finds PSEO page on Google
    ↓
GTM tracks page view → Google Analytics
    ↓
analytics.ts tracks event → /api/analytics → Database
    ↓
Command Centre /api/audio-intel-metrics pulls from Database
    ↓
Command Centre dashboard displays real-time metrics
    ↓
You view on mobile at command.totalaudiopromo.com
```

## ⚡ IMMEDIATE ACTIONS REQUIRED

1. **Fix Command Centre API URL**(5 minutes)
   - Update `audioIntelBaseUrl` to production URL
   - Add environment variable
   - Redeploy Command Centre

2. **Add Database for Analytics Storage**(30 minutes)
   - Use existing Supabase/PostgreSQL
   - Create `analytics_events` table
   - Update `/api/analytics/route.ts` to store events

3. **Add PSEO Page Tracking**(15 minutes per page)
   - Add `useEffect` with `trackPageView()` to all 8 PSEO pages
   - Include metadata (topic, search volume, referrer)

4. **Test Full Pipeline**(10 minutes)
   - Visit PSEO page
   - Check GTM fires in browser dev tools
   - Verify data appears in `/api/analytics`
   - Check Command Centre dashboard updates

5. **Add PSEO Dashboard Section**(45 minutes)
   - Add new "PSEO Performance" tab to Command Centre
   - Show traffic by page, conversions, top keywords
   - Mobile-optimized for on-the-go viewing

## 📱 MOBILE COMMAND CENTRE PRIORITY

Since you need to track "on the go", prioritize:

1. Mobile-responsive analytics dashboard
2. Real-time data (no caching)
3. Push notifications for key events (optional)
4. Quick metric cards (traffic today, conversions this week)

## 🎯 SUCCESS METRICS TO TRACK

### Week 1 (Baseline)

- Total PSEO page views
- Unique visitors per page
- Average time on page
- Bounce rate

### Week 2-4 (Growth)

- Organic traffic growth rate
- Top 3 performing PSEO pages
- PSEO → Homepage click-through rate
- PSEO → Demo interaction rate

### Month 1+ (Revenue)

- PSEO → Signup conversion rate
- PSEO → Payment conversion rate
- Revenue attributed to PSEO pages
- Cost per acquisition via organic (£0!)

---

## 🚀 NEXT STEP: FIX COMMAND CENTRE CONNECTION

Ready to update the Command Centre API to pull from Audio Intel production URL?
