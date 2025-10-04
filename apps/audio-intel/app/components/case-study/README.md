# Case Study Component Library

Reusable React components extracted from the BBC Radio 1 case study for programmatic content generation.

## Overview

This component library enables creating new case study pages by passing data objects instead of copying and pasting JSX. All styling matches the original BBC Radio 1 case study exactly.

## Components

### 1. CaseStudyHero
Hero section with title, byline metadata, and highlighted intro callout.

**Props**: `CaseStudyHeroData`
- `title`: Main page heading
- `byline`: Author, role, format, read time
- `introCallout`: Highlighted intro paragraph

### 2. CampaignSnapshot
Two-column comparison grid showing manual effort vs AI-powered approach.

**Props**: `CampaignSnapshotData`
- `context`: Campaign description
- `manualEffort`: Title and bullet points
- `aiRun`: Title and bullet points

### 3. PainPointsSection
Problem statement section with titled pain points.

**Props**: `PainPointsSectionData`
- `heading`: Section title
- `intro`: Context paragraph
- `painPoints`: Array of {title, description}

### 4. WorkflowBreakdown
Numbered workflow steps showing the Audio Intel process.

**Props**: `WorkflowBreakdownData`
- `heading`: Section title
- `intro`: Workflow context
- `steps`: Array of {title, description}

### 5. ContactsTable
Professional table displaying enriched contact data with validation status.

**Props**: `ContactsTableData`
- `heading`: Table section title
- `contacts`: Array of ContactData objects
- `disclaimer`: Optional footer text

### 6. ResultsMetrics
Three-column results grid with key metrics.

**Props**: `ResultsMetricsData`
- `heading`: Section title
- `metrics`: Array of {title, description}

### 7. PlaybookChecklist
Ordered checklist for readers to follow.

**Props**: `PlaybookChecklistData`
- `heading`: Section title
- `intro`: Context paragraph
- `steps`: Array of step descriptions

### 8. TestimonialQuote
Blockquote with optional attribution.

**Props**: `TestimonialQuoteData`
- `heading`: Section title
- `quote`: Testimonial text
- `attribution`: Optional source citation

### 9. DualCTA
Two-button call-to-action section (primary + secondary).

**Props**: `DualCTAData`
- `heading`: CTA section title
- `intro`: Context paragraph
- `primaryButton`: {text, href}
- `secondaryButton`: {text, href}

## Usage Example

```typescript
import type { CaseStudyData } from "@/types/case-study";
import { CaseStudyHero, CampaignSnapshot, /* ... */ } from "@/app/components/case-study";

const myData: CaseStudyData = {
  hero: {
    title: "Your Case Study Title",
    byline: {
      author: "Chris Schofield",
      role: "Radio promoter",
      format: "Case study format",
      readTime: "10 min read"
    },
    introCallout: "Your compelling intro paragraph..."
  },
  // ... other sections
};

export default function MyCaseStudy() {
  return (
    <article className="max-w-4xl mx-auto px-4 py-12">
      <CaseStudyHero data={myData.hero} />
      <div className="space-y-12">
        <CampaignSnapshot data={myData.campaignSnapshot} />
        {/* ... other components */}
      </div>
    </article>
  );
}
```

## Complete Interface

See `types/case-study.ts` for the full `CaseStudyData` interface structure.

## Design Decisions

1. **No styling props**: All components use fixed Tailwind classes from BBC Radio 1 case study
2. **Fully typed**: All data structures have TypeScript interfaces
3. **Content separation**: Zero hardcoded content - everything comes from data objects
4. **Section IDs preserved**: Maintains anchor link compatibility for navigation

## Files Created

- `types/case-study.ts` - TypeScript interfaces
- `app/components/case-study/*.tsx` - 9 component files
- `app/components/case-study/index.ts` - Barrel export
- `app/components/case-study/example-usage.tsx` - Full working example

## Next Steps for New Case Studies

1. Copy the data structure from `example-usage.tsx`
2. Replace content with your case study details
3. Import and render components in your page
4. All styling and structure handled automatically
