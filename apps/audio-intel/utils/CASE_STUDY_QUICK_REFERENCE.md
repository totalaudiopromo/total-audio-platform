# Case Study Parser - Quick Reference Card

## 🚀 Most Common Usage Patterns

### 1. Create a Dynamic Case Study Page

```typescript
// app/blog/[slug]/page.tsx
import { generateCaseStudyMetadata } from '@/utils/generateCaseStudyMetadata';
import { getCaseStudyBySlugSync, getAllCaseStudySlugs } from '@/utils/parseCaseStudyData';

// SEO metadata
export async function generateMetadata({ params }: { params: { slug: string } }) {
  return await generateCaseStudyMetadata(params.slug);
}

// Static paths
export async function generateStaticParams() {
  const slugs = await getAllCaseStudySlugs();
  return slugs.map((slug) => ({ slug }));
}

// Page
export default function CaseStudyPage({ params }: { params: { slug: string } }) {
  const data = getCaseStudyBySlugSync(params.slug);
  if (!data) notFound();

  return (
    <article>
      <h1>{data.pageTitle}</h1>
      <p>{data.metaDescription}</p>
      {/* Your content here */}
    </article>
  );
}
```

---

### 2. Create a Blog Listing Page

```typescript
// app/blog/page.tsx
import { getAllCaseStudiesSync } from '@/utils/parseCaseStudyData';

export default function BlogPage() {
  const studies = getAllCaseStudiesSync().filter((s) => s.status === 'live');

  return (
    <div>
      {studies.map((study) => (
        <Link key={study.topicSlug} href={study.pageUrl}>
          <h2>{study.pageTitle}</h2>
          <p>{study.metaDescription}</p>
        </Link>
      ))}
    </div>
  );
}
```

---

### 3. Add Structured Data (JSON-LD)

```typescript
import { generateAllCaseStudySchemas } from '@/utils/generateCaseStudyMetadata';

export default function CaseStudyPage({ params }) {
  const schemas = generateAllCaseStudySchemas(params.slug);

  return (
    <>
      {schemas.map((schema, idx) => (
        <script
          key={idx}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
      <article>{/* Your content */}</article>
    </>
  );
}
```

---

### 4. Filter by Category or Tier

```typescript
import { getAllCaseStudiesSync } from '@/utils/parseCaseStudyData';

// Get only UK Radio Stations
const radioStudies = getAllCaseStudiesSync().filter(
  (s) => s.category === 'UK Radio Stations' && s.status === 'live'
);

// Get only Tier 1 (high priority) studies
const tier1Studies = getAllCaseStudiesSync().filter((s) => s.tier === 1 && s.status === 'live');
```

---

### 5. Group by Category

```typescript
const allStudies = getAllCaseStudiesSync();

const byCategory = allStudies.reduce((acc, study) => {
  if (!acc[study.category]) acc[study.category] = [];
  acc[study.category].push(study);
  return acc;
}, {} as Record<string, typeof allStudies>);

// Now render:
Object.entries(byCategory).map(([category, studies]) => (
  <section key={category}>
    <h2>{category}</h2>
    {studies.map((study) => (
      <CaseStudyCard key={study.topicSlug} study={study} />
    ))}
  </section>
));
```

---

## 📊 Key Data Fields

```typescript
interface EnrichedCaseStudyData {
  // Core identifiers
  topicSlug: string; // 'bbc-radio-1'
  pageUrl: string; // '/blog/bbc-radio-1-contact-enrichment'

  // SEO
  pageTitle: string; // Full title with brand
  metaDescription: string; // Meta description
  searchIntent: string[]; // ['bbc radio 1 contacts', ...]
  primaryKeyword: string; // First search intent (computed)

  // Targeting
  audience: string[]; // ['UK radio promoters', ...]
  targetAudiencePrimary: string; // First audience (computed)
  painPoint: string; // Problem statement
  solutionAngle: string; // How Audio Intel solves it
  proofPoints: string[]; // ['100% accuracy', '32% reply rate', ...]

  // Classification
  category: string; // 'UK Radio Stations'
  tier: number; // 1-3 (priority)
  status: 'live' | 'planned' | 'draft';

  // Metrics
  monthlySearchesEst: number; // SEO volume
  estimatedReadTime: number; // Minutes (computed)

  // CTA
  ctaPrimary: string; // 'Start Free Trial'
}
```

---

## 🎨 Tier Badge Component

```typescript
function TierBadge({ tier }: { tier: number }) {
  if (tier === 1) return <span className="bg-blue-100 text-blue-800">High Priority</span>;
  if (tier === 2) return <span className="bg-green-100 text-green-800">Medium Priority</span>;
  return <span className="bg-gray-100 text-gray-800">Reference Guide</span>;
}
```

---

## 🔧 Utility Functions Cheat Sheet

| Function | Use Case | Returns |
|----------|----------|---------|
| `getAllCaseStudiesSync()` | Get all case studies | `EnrichedCaseStudyData[]` |
| `getCaseStudyBySlugSync(slug)` | Get one case study | `EnrichedCaseStudyData \| null` |
| `getAllCaseStudySlugs()` | Static path generation | `Promise<string[]>` |
| `generateCaseStudyMetadata(slug)` | Page metadata | `Promise<Metadata>` |
| `generateCaseStudyStructuredData(slug)` | Article schema | `object` (JSON-LD) |
| `generateAllCaseStudySchemas(slug)` | All schemas | `object[]` |

---

## 📝 CSV Quick Edit Guide

**Location**: `docs/pseo/programmatic-pages.csv`

**Add new case study**: Add a row with these columns:
- `topic_slug` - URL slug (e.g., `bbc-radio-2`)
- `page_url` - Full path (e.g., `/blog/bbc-radio-2-contact-enrichment`)
- `page_title` - SEO title with brand
- `meta_description` - Meta description
- `search_intent` - Semicolon-separated keywords
- `audience` - Semicolon-separated audiences
- `pain_point` - Problem statement
- `solution_angle` - Solution description
- `proof_points` - Semicolon-separated results
- `cta_primary` - Call to action (usually "Start Free Trial")
- `category` - Content category
- `tier` - 1, 2, or 3
- `monthly_searches_est` - Estimated monthly searches
- `status` - `live`, `planned`, or `draft`

---

## ⚠️ Common Mistakes

1. **Forgetting semicolons in arrays**: Use `;` not `,` to separate values in `search_intent`, `audience`, `proof_points`
2. **Invalid tier**: Must be 1, 2, or 3 (not 0 or 4+)
3. **Wrong status**: Must be `live`, `planned`, or `draft` (lowercase)
4. **Missing slug**: Every row must have a `topic_slug`

---

## 🐛 Debugging

**Case study not showing?**
```typescript
// Check if it exists
const study = getCaseStudyBySlugSync('your-slug');
console.log(study); // null if not found

// Check all slugs
const slugs = await getAllCaseStudySlugs();
console.log(slugs); // See all available slugs
```

**Validation errors?**
```typescript
import { validateCaseStudy } from '@/utils/parseCaseStudyData';

const study = getCaseStudyBySlugSync('your-slug');
if (study) {
  const validation = validateCaseStudy(study);
  if (!validation.valid) {
    console.error(validation.errors); // See what's wrong
  }
}
```

---

## 📚 Full Documentation

- **Complete usage guide**: `CASE_STUDY_PARSER_USAGE.md`
- **Implementation examples**: `EXAMPLE_CASE_STUDY_PAGE.tsx`, `EXAMPLE_BLOG_LISTING_PAGE.tsx`
- **Summary & overview**: `CASE_STUDY_UTILITIES_SUMMARY.md`

---

**Questions?** Check the full documentation files or reference the inline TypeScript comments.
