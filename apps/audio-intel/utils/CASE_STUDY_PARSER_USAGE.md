# Case Study CSV Parser & Metadata Generator

**Location**: `/utils/parseCaseStudyData.ts` and `/utils/generateCaseStudyMetadata.ts`

Complete TypeScript utilities for parsing programmatic case study data from CSV and generating Next.js metadata.

---

## Quick Start

### 1. Basic Usage in a Page Component

```typescript
// app/blog/[slug]/page.tsx
import { generateMetadata } from 'next';
import { generateCaseStudyMetadata } from '@/utils/generateCaseStudyMetadata';
import { getCaseStudyBySlugSync } from '@/utils/parseCaseStudyData';

// Generate metadata for SEO
export async function generateMetadata({ params }: { params: { slug: string } }) {
  return await generateCaseStudyMetadata(params.slug);
}

// Generate static paths for all case studies
export async function generateStaticParams() {
  const { getAllCaseStudySlugs } = await import('@/utils/parseCaseStudyData');
  const slugs = await getAllCaseStudySlugs();

  return slugs.map((slug) => ({
    slug,
  }));
}

// Page component
export default function CaseStudyPage({ params }: { params: { slug: string } }) {
  const data = getCaseStudyBySlugSync(params.slug);

  if (!data) {
    return <div>Case study not found</div>;
  }

  return (
    <article className="max-w-4xl mx-auto px-4 py-12">
      <header className="mb-12">
        <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-6">
          {data.pageTitle}
        </h1>

        <div className="flex flex-wrap items-center gap-4 mb-8 text-gray-600">
          <span>Chris Schofield</span>
          <span>•</span>
          <span>{data.category}</span>
          <span>•</span>
          <span>{data.estimatedReadTime} min read</span>
        </div>

        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-lg">
          <p className="text-lg text-gray-800">{data.metaDescription}</p>
        </div>
      </header>

      {/* Your case study content here */}
    </article>
  );
}
```

---

## API Reference

### `parseCaseStudyData.ts`

#### Core Functions

**`getAllCaseStudies(): Promise<EnrichedCaseStudyData[]>`**
- Returns all case studies from the CSV
- Async version for runtime use
- Includes computed fields (estimatedReadTime, primaryKeyword, etc.)

```typescript
const allStudies = await getAllCaseStudies();
console.log(`Found ${allStudies.length} case studies`);
```

**`getAllCaseStudiesSync(): EnrichedCaseStudyData[]`**
- Synchronous version for build-time use
- Use in `generateStaticParams()` or `generateMetadata()`

```typescript
const allStudies = getAllCaseStudiesSync();
```

**`getCaseStudyBySlug(slug: string): Promise<EnrichedCaseStudyData>`**
- Gets a single case study by slug
- Throws error if not found
- Async version

```typescript
try {
  const bbcData = await getCaseStudyBySlug('bbc-radio-1');
  console.log(bbcData.pageTitle);
} catch (error) {
  console.error('Case study not found');
}
```

**`getCaseStudyBySlugSync(slug: string): EnrichedCaseStudyData | null`**
- Synchronous version
- Returns null if not found (safer for build time)

```typescript
const data = getCaseStudyBySlugSync('bbc-radio-1');
if (data) {
  console.log(data.pageTitle);
}
```

#### Filter Functions

**`getCaseStudiesByStatus(status: 'live' | 'planned' | 'draft')`**
```typescript
const liveStudies = await getCaseStudiesByStatus('live');
const plannedStudies = await getCaseStudiesByStatus('planned');
```

**`getCaseStudiesByCategory(category: string)`**
```typescript
const radioStudies = await getCaseStudiesByCategory('UK Radio Stations');
const streamingStudies = await getCaseStudiesByCategory('Streaming Platforms');
```

**`getCaseStudiesByTier(tier: 1 | 2 | 3)`**
```typescript
const tier1Studies = await getCaseStudiesByTier(1); // High priority
const tier2Studies = await getCaseStudiesByTier(2); // Medium priority
```

**`getAllCaseStudySlugs(): Promise<string[]>`**
```typescript
const slugs = await getAllCaseStudySlugs();
// ['bbc-radio-1', 'bbc-radio-6-music', 'spotify-editorial', ...]
```

#### Validation

**`validateCaseStudy(data: CaseStudyData): { valid: boolean; errors: string[] }`**
```typescript
const validation = validateCaseStudy(data);
if (!validation.valid) {
  console.error('Validation errors:', validation.errors);
}
```

---

### `generateCaseStudyMetadata.ts`

#### Metadata Generation

**`generateCaseStudyMetadata(slug: string, options?): Promise<Metadata>`**
- Generates complete Next.js metadata object
- Includes OpenGraph, Twitter Cards, robots directives
- Automatically sets indexing based on status

```typescript
export async function generateMetadata({ params }) {
  return await generateCaseStudyMetadata(params.slug, {
    includeAlternates: true,  // Include canonical URL
    includeRobots: true,      // Include robots directives
  });
}
```

**`generateCaseStudyMetadataSync(slug: string, options?): Metadata`**
- Synchronous version for build-time use

```typescript
const metadata = generateCaseStudyMetadataSync('bbc-radio-1');
```

#### Structured Data (JSON-LD)

**`generateCaseStudyStructuredData(slug: string): object`**
- Generates Article schema markup

```typescript
const schema = generateCaseStudyStructuredData('bbc-radio-1');

// In your page component:
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
/>
```

**`generateCaseStudyBreadcrumbSchema(slug: string): object`**
- Generates BreadcrumbList schema

```typescript
const breadcrumb = generateCaseStudyBreadcrumbSchema('bbc-radio-1');
```

**`generateCaseStudyFAQSchema(questions: Array<{question: string, answer: string}>): object`**
- Generates FAQ schema if you have Q&A sections

```typescript
const faqSchema = generateCaseStudyFAQSchema([
  {
    question: 'How long does BBC Radio 1 enrichment take?',
    answer: 'Under 2 minutes with Audio Intel, compared to 18 hours manually.'
  },
  {
    question: 'What contacts are included?',
    answer: 'All current BBC Radio 1 specialist show producers and presenters.'
  }
]);
```

**`generateAllCaseStudySchemas(slug: string, faqQuestions?): object[]`**
- Combines all schemas into one array

```typescript
const schemas = generateAllCaseStudySchemas('bbc-radio-1', faqQuestions);

// Render multiple schemas:
{schemas.map((schema, idx) => (
  <script
    key={idx}
    type="application/ld+json"
    dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
  />
))}
```

---

## Type Definitions

### `CaseStudyData`

Core CSV data structure:

```typescript
interface CaseStudyData {
  // Identifiers
  topicSlug: string;              // 'bbc-radio-1'
  pageUrl: string;                // '/blog/bbc-radio-1-contact-enrichment'

  // SEO
  pageTitle: string;              // 'BBC Radio 1 Contact Enrichment...'
  metaDescription: string;        // Meta description for search results
  searchIntent: string[];         // ['bbc radio 1 contacts', ...]

  // Targeting
  audience: string[];             // ['UK radio promoters', ...]
  painPoint: string;              // Problem being solved
  solutionAngle: string;          // How Audio Intel solves it
  proofPoints: string[];          // Evidence and results

  // CTA & Classification
  ctaPrimary: string;             // 'Start Free Trial'
  category: string;               // 'UK Radio Stations'
  tier: number;                   // 1-3 (priority level)
  monthlySearchesEst: number;     // SEO volume estimate
  status: 'live' | 'planned' | 'draft';
}
```

### `EnrichedCaseStudyData`

Extended version with computed fields:

```typescript
interface EnrichedCaseStudyData extends CaseStudyData {
  estimatedReadTime: number;      // Minutes (computed from tier)
  primaryKeyword: string;         // First search intent value
  targetAudiencePrimary: string;  // First audience value
}
```

---

## CSV Format

**Location**: `docs/pseo/programmatic-pages.csv`

### Column Reference

| Column | Type | Description | Example |
|--------|------|-------------|---------|
| `topic_slug` | string | URL-safe identifier | `bbc-radio-1` |
| `page_url` | string | Full page path | `/blog/bbc-radio-1-contact-enrichment` |
| `page_title` | string | SEO page title | `BBC Radio 1 Contact Enrichment: From 18 Hours to 2 Minutes` |
| `meta_description` | string | Meta description | `Real BBC Radio 1 pitching workflow...` |
| `search_intent` | string (semicolon-separated) | Search keywords | `bbc radio 1 contacts; how to pitch bbc radio 1` |
| `audience` | string (semicolon-separated) | Target audiences | `UK radio promoters; independent artists` |
| `pain_point` | string | Problem statement | `18 hours researching contacts...` |
| `solution_angle` | string | Solution description | `Upload messy contact list...` |
| `proof_points` | string (semicolon-separated) | Evidence/results | `100% contact accuracy; 32% reply rate` |
| `cta_primary` | string | Call to action | `Start Free Trial` |
| `category` | string | Content category | `UK Radio Stations` |
| `tier` | number (1-3) | Priority level | `1` |
| `monthly_searches_est` | number | Search volume | `1200` |
| `status` | string | Publication status | `live`, `planned`, or `draft` |

### CSV Parsing Rules

- **Semicolons (`;`)** separate array values in fields like `search_intent`, `audience`, `proof_points`
- **Commas** are field delimiters (standard CSV)
- **Quotes** around values with commas are handled automatically
- **Empty rows** are skipped
- **Missing slugs** cause row to be ignored

---

## Error Handling

### Common Errors

**CSV Not Found**
```typescript
Error: CSV file not found at /path/to/docs/pseo/programmatic-pages.csv
```
- Ensure CSV exists in `docs/pseo/` directory
- Check file permissions

**Case Study Not Found**
```typescript
Error: Case study not found for slug: invalid-slug
Available slugs: bbc-radio-1, bbc-radio-6-music, ...
```
- Verify slug matches CSV `topic_slug` column
- Check CSV has been updated

**Invalid Tier**
```typescript
Error: Invalid tier value for bbc-radio-1: 5. Must be 1, 2, or 3.
```
- Tier must be 1 (high priority), 2 (medium), or 3 (low)

**Missing Required Fields**
```typescript
Validation errors: ['Missing required field: pageTitle', 'searchIntent must have at least one value']
```
- Check CSV for empty required columns
- Use `validateCaseStudy()` to debug

---

## Advanced Usage

### Custom Metadata Options

```typescript
// Disable robots directives (for staging)
const metadata = await generateCaseStudyMetadata('bbc-radio-1', {
  includeRobots: false
});

// No canonical URL
const metadata = await generateCaseStudyMetadata('bbc-radio-1', {
  includeAlternates: false
});
```

### Dynamic Routes with Type Safety

```typescript
// app/blog/[slug]/page.tsx
import type { EnrichedCaseStudyData } from '@/utils/parseCaseStudyData';

interface PageProps {
  params: { slug: string };
}

export default function CaseStudyPage({ params }: PageProps) {
  const data: EnrichedCaseStudyData | null = getCaseStudyBySlugSync(params.slug);

  if (!data) {
    notFound();
  }

  // TypeScript knows all fields on `data`
  return (
    <div>
      <h1>{data.pageTitle}</h1>
      <p>{data.metaDescription}</p>
      <div>Category: {data.category}</div>
      <div>Search Intent: {data.searchIntent.join(', ')}</div>
    </div>
  );
}
```

### Filtering for Listings

```typescript
// app/blog/page.tsx - Blog listing page
import { getAllCaseStudiesSync } from '@/utils/parseCaseStudyData';

export default function BlogPage() {
  const liveStudies = getAllCaseStudiesSync().filter(s => s.status === 'live');

  // Group by category
  const byCategory = liveStudies.reduce((acc, study) => {
    if (!acc[study.category]) acc[study.category] = [];
    acc[study.category].push(study);
    return acc;
  }, {} as Record<string, typeof liveStudies>);

  return (
    <div>
      {Object.entries(byCategory).map(([category, studies]) => (
        <section key={category}>
          <h2>{category}</h2>
          <ul>
            {studies.map(study => (
              <li key={study.topicSlug}>
                <a href={study.pageUrl}>{study.pageTitle}</a>
                <p>{study.metaDescription}</p>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
```

---

## Testing

### Validate CSV Data

```typescript
import { getAllCaseStudiesSync, validateCaseStudy } from '@/utils/parseCaseStudyData';

// Validate all case studies
const studies = getAllCaseStudiesSync();
studies.forEach(study => {
  const validation = validateCaseStudy(study);
  if (!validation.valid) {
    console.error(`Validation failed for ${study.topicSlug}:`, validation.errors);
  }
});
```

### Check Generated Metadata

```typescript
import { generateCaseStudyMetadataSync } from '@/utils/generateCaseStudyMetadata';

const metadata = generateCaseStudyMetadataSync('bbc-radio-1');
console.log('Title:', metadata.title);
console.log('Description:', metadata.description);
console.log('Keywords:', metadata.keywords);
console.log('OpenGraph:', metadata.openGraph);
```

---

## Integration with BBC Radio 1 Example

The existing BBC Radio 1 case study serves as the template. Here's how the CSV maps to it:

**CSV Row**:
```csv
bbc-radio-1,/blog/bbc-radio-1-contact-enrichment,"BBC Radio 1 Contact Enrichment: From 18 Hours to 2 Minutes | Audio Intel",...
```

**Generated Metadata** (matches existing):
```typescript
{
  title: "BBC Radio 1 Contact Enrichment: From 18 Hours to 2 Minutes | Audio Intel",
  description: "Real BBC Radio 1 pitching workflow from 18 hours to 2 minutes...",
  keywords: "bbc radio 1 contacts, bbc radio 1 submission guidelines, ...",
  openGraph: {
    title: "BBC Radio 1 Contact Enrichment: 18 Hours to 2 Minutes",
    description: "See how Audio Intel rebuilt a full BBC Radio 1 pitching list...",
    images: ["/images/case-studies/bbc-radio-1-og.png"]
  },
  twitter: {
    card: "summary_large_image",
    title: "BBC Radio 1 Contact Enrichment: The Real Campaign Breakdown",
    description: "Manual research vs Audio Intel on a real BBC Radio 1 campaign..."
  }
}
```

---

## Troubleshooting

### Issue: "CSV file not found"
- Verify `docs/pseo/programmatic-pages.csv` exists
- Check working directory is project root
- Ensure file has read permissions

### Issue: Metadata not updating
- Clear Next.js cache: `rm -rf .next`
- Rebuild: `npm run build`
- Check CSV was saved after edits

### Issue: TypeScript errors on imports
- Ensure types are exported from `parseCaseStudyData.ts`
- If types directory created, move types there
- Update imports to use `types/case-study.ts`

---

## Future Enhancements

When `types/case-study.ts` is created by the other agent:

1. Move type definitions from `parseCaseStudyData.ts` to `types/case-study.ts`
2. Update imports:
   ```typescript
   import type { CaseStudyData, EnrichedCaseStudyData } from '@/types/case-study';
   ```
3. Keep parser logic in `utils/parseCaseStudyData.ts`
4. Keep metadata logic in `utils/generateCaseStudyMetadata.ts`

---

**Questions?** Check the inline documentation in the utility files or reference the BBC Radio 1 case study implementation.
