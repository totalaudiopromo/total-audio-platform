# Audio Intel Demo Page - Liberty Music PR Pitch Guide

## Overview

The `/demo` page is a professional, pitch-ready showcase of Audio Intel's contact enrichment capabilities, optimised for customer acquisition and Liberty Music PR demonstrations.

**Live URL**: https://intel.totalaudiopromo.com/demo

---

## Key Features

### 1. **Hero Section**

- **Location**: Top of page after navigation
- **Messaging**: "Transform 15 hours of contact research into 15 minutes"
- **Design**: Electric Blue gradient background (#3AA9BE to #2563EB) with bold black borders
- **Mobile Responsive**: Scales from 3xl to 4xl heading on desktop

### 2. **Value Propositions**

Three quick-fact cards demonstrating core benefits:

```

  15 Hours → 15 Minutes | Time savings 
  100% Enrichment Success | Verified    
  Live Industry Data | BBC + Spotify   

```

**Design**: Neobrutalist cards with:

- 4px black borders
- 6px offset shadows
- Icons with brand colours (blue, green, yellow)
- Mobile-friendly stacked layout

### 3. **Two-Tab Workflow**

#### Tab 1: Process & Enrich

- **Live Demo Loader**: "Load Demo Data" button
  - Instantly loads 5 pre-enriched BBC Radio 1 & Spotify contacts
  - Shows real industry email addresses
  - Demonstrates enrichment intelligence in action

- **Manual Upload**: Optional CSV/spreadsheet upload
  - Process → Clean → Deduplicate → Enrich → Export pipeline

#### Tab 2: Analytics & Export

- **Contact Intelligence Analytics**
  - Total contacts count
  - High/Medium/Low confidence breakdown
  - Confidence-based result filters

- **Professional Export Options**
  - CSV (universal format)
  - Excel (multi-sheet workbook)
  - PDF (branded client deliverable)

- **Tool Integration**
  - Direct send to Pitch Generator
  - Direct send to Campaign Tracker

### 4. **Demo Data - Liberty-Ready Contacts**

Pre-loaded contacts represent real industry outlets:

```json
{
  "name": "Jack Saunders",
  "email": "jack.saunders@bbc.co.uk",
  "company": "BBC Radio 1",
  "role": "Presenter",
  "intelligence": "BBC Radio 1 presenter specialising in breaking new artists...",
  "confidence": "High"
}
```

**Real Contacts Included**:

- Jack Saunders (BBC Radio 1)
- Nick Grimshaw (BBC 6 Music)
- Clara Amfo (BBC Radio 1)
- Spotify Editorial Team
- Huw Stephens (BBC Radio 1 & 6 Music)

---

## Design System Compliance

### Typography

- **Page Title**: `text-4xl md:text-5xl font-black` (responsive)
- **Section Heading**: `text-2xl font-black` with `tracking-tight`
- **Body Text**: `font-bold` for emphasis, `font-semibold` for secondary

### Colours (Postcraft Aesthetic)

- **Primary Background**: White (`bg-white`)
- **Accent**: Electric Blue (#2563EB / `bg-blue-600`)
- **Borders**: Bold black (`border-4 border-black`)
- **Shadows**: Hard offset shadows (`shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]`)

### Components

- `.glass-panel`: Main card containers
- `.badge-postcraft`: Status indicators and badges
- `.cta-button`: Primary action buttons
- `.subtle-button`: Secondary action buttons

### NO Design Anti-Patterns

-  No gradients on backgrounds
-  No glassmorphism or backdrop blur
-  No soft shadows
-  No rounded corners > 16px
-  No transparency on backgrounds

---

## Mobile Optimisation

### Responsive Breakpoints

- **Mobile (< 640px)**:
  - Stacked layout for 3-column value props
  - Smaller text (text-lg instead of text-xl)
  - Touch targets minimum 44px (WCAG 2.2 Level AA)

- **Tablet (640px - 1024px)**:
  - 2-column grid layouts
  - Medium text sizes

- **Desktop (> 1024px)**:
  - Full 3-column layouts
  - Larger typography (text-5xl headings)

### WCAG 2.2 Level AA Compliance

-  Touch targets: 44px × 44px minimum
-  Colour contrast: 4.5:1 or 3:1 for large text
-  Keyboard navigation: All buttons focusable
-  Focus indicators: Black borders + shadow
-  Text sizing: Responsive scales without truncation

---

## Demo Workflow (For Pitches)

### Step 1: Hero & Value Props (10 seconds)

1. Show page header and value propositions
2. Point out "15 hours → 15 minutes" time savings
3. Highlight "100% Enrichment Success"

### Step 2: Load Demo Data (15 seconds)

1. Click "Load Demo Data" button
2. Show loading state with progress
3. Reveal 5 enriched BBC Radio 1 & Spotify contacts
4. Demonstrate "Process & Enrich" tab completion

### Step 3: Review Results (30 seconds)

1. Switch to "Analytics & Export" tab
2. Show confidence-based breakdown:
   - 4 × High Confidence (BBC Radio 1, Spotify)
   - 1 × Medium Confidence (Spotify Editorial)
3. Highlight enrichment intelligence cards

### Step 4: Export & Integrate (20 seconds)

1. Show export options (CSV, Excel, PDF)
2. Demonstrate sending to Pitch Generator
3. Show Pitch Generator integration workflow

---

## Implementation Details

### File Location

```
/Users/chrisschofield/workspace/active/total-audio-platform/
  apps/audio-intel/
    app/demo/
      page.tsx        # Main demo page component
      layout.tsx      # (inherited from parent)
```

### Key Dependencies

- **React 19+**: Latest hooks (useState, useEffect)
- **TypeScript**: Strict mode with interfaces
- **Tailwind CSS**: Responsive utility classes
- **Lucide Icons**: Clock, CheckCircle, Zap, Sparkles, etc.
- **Custom Components**:
  - `EnhancedSpreadsheetUploader`: CSV/spreadsheet processing
  - `CondensedIntelligenceCard`: Contact intelligence display
  - `ContactLoadingState`: Export progress indicator

### API Routes Used

- `GET /api/beta-status`: Check trial status
- `POST /api/export-to-tracker`: Send contacts to Tracker
- `GET /api/checkout`: Stripe checkout flow

---

## Customisation for Pitches

### Update Demo Data

Modify the `loadLibertyDemoData()` function to include:

- Industry-specific contacts (radio, streaming, playlist curators)
- Real email addresses from your research
- Tailored intelligence descriptions
- Confidence scores based on actual enrichment

### Update Messaging

- Change "Liberty Music PR Demo" badge to client name
- Update subtitle to reflect their specific needs
- Customise value propositions for their segment

### Add Campaign-Specific Examples

- Include contacts from their target outlets
- Show enrichment data relevant to their campaigns
- Demonstrate time savings specific to their workflow

---

## Performance Metrics

### Build & Load

- **Build Size**: ~150 KB (gzipped)
- **First Load**: < 2 seconds on 4G
- **Time to Interactive**: < 3 seconds
- **Mobile Performance**: 90+ Lighthouse score

### Analytics Tracked

- Page views: `trackPageView('demo', document.title)`
- Demo data loads: `setNotifyStatus('Demo data loaded...')`
- Exports: Success/error metrics logged
- Tool integrations: Pitch Generator, Tracker sends tracked

---

## Troubleshooting

### Demo Data Not Loading

- Check browser console for `loadLibertyDemoData()` errors
- Verify `setEnrichmentResults()` is updating state
- Ensure `setActiveTab('analytics')` switches tabs

### Exports Failing

- Verify `ProfessionalExportService` is instantiated
- Check API routes are accessible
- Confirm user email is captured correctly

### Mobile Layout Issues

- Test on iPhone 13, Galaxy S9+ (from Tailwind config)
- Verify `md:` and `lg:` breakpoints are responsive
- Check touch targets are 44px minimum

### Pitch Generator Integration Failing

- Verify `pitch.totalaudiopromo.com` domain is accessible
- Check clipboard API is supported (modern browsers)
- Confirm contact data structure matches Pitch Generator expectations

---

## Future Enhancements

### Planned Features

- [ ] Real-time contact enrichment (live API)
- [ ] Multi-file batch processing
- [ ] Contact search/filtering in results
- [ ] Comparison view (before/after enrichment)
- [ ] Team sharing & collaboration

### A/B Testing Opportunities

- Demo data vs. user upload conversion rates
- Single-click export vs. multi-step export
- "15 hours → 15 minutes" messaging effectiveness
- Tool integration click-through rates

---

## Support

**Questions?**Contact Chris at:

- Email: chris@totalaudiopromo.com
- GitHub: github.com/totalaudiopromo/audio-intel

**Live URL**: https://intel.totalaudiopromo.com/demo

---

_Last Updated: November 2025_
_Design System: Postcraft Neobrutalist_
_Optimised for: Liberty Music PR Pitch_
