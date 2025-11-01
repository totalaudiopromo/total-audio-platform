/**
 * Next.js Metadata Generator for Case Study Pages
 *
 * Generates SEO-optimized metadata for programmatic case study pages
 * based on CSV data from docs/pseo/programmatic-pages.csv
 *
 * Usage:
 * ```typescript
 * // In your page.tsx
 * import { generateMetadata } from 'next';
 * import { generateCaseStudyMetadata } from '@/utils/generateCaseStudyMetadata';
 *
 * export async function generateMetadata({ params }: { params: { slug: string } }) {
 *   return await generateCaseStudyMetadata(params.slug);
 * }
 * ```
 */

import type { Metadata } from 'next';
import { getCaseStudyBySlugSync, type EnrichedCaseStudyData } from './parseCaseStudyData';

// ============================================================================
// METADATA GENERATION FUNCTIONS
// ============================================================================

/**
 * Generates OpenGraph image path based on case study slug
 */
function getOpenGraphImage(slug: string): string {
  // Convention: /images/case-studies/{slug}-og.png
  // Falls back to generic if not found
  return `/images/case-studies/${slug}-og.png`;
}

/**
 * Generates Twitter card type based on tier
 */
function getTwitterCardType(tier: number): 'summary' | 'summary_large_image' {
  // Tier 1 (high priority) gets large image card
  return tier === 1 ? 'summary_large_image' : 'summary_large_image';
}

/**
 * Creates SEO-optimized title from page title
 * Ensures proper formatting and includes brand
 */
function createSEOTitle(pageTitle: string): string {
  // If title already includes "Audio Intel", use as-is
  if (pageTitle.toLowerCase().includes('audio intel')) {
    return pageTitle;
  }
  // Otherwise append brand
  return `${pageTitle} | Audio Intel`;
}

/**
 * Creates compelling OpenGraph title (more concise than page title)
 */
function createOpenGraphTitle(data: EnrichedCaseStudyData): string {
  // Extract the core topic from the page title
  // E.g., "BBC Radio 1 Contact Enrichment: From 18 Hours to 2 Minutes"
  // becomes "BBC Radio 1 Contact Enrichment: 18 Hours to 2 Minutes"
  const title = data.pageTitle;

  // If title is already concise (under 60 chars), use it
  if (title.length <= 60) {
    return title.replace(' | Audio Intel', '');
  }

  // Otherwise, create a shorter version
  const topicName = data.topicSlug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return `${topicName} Contact Enrichment: The Real Workflow`;
}

/**
 * Creates Twitter-optimized description
 */
function createTwitterDescription(data: EnrichedCaseStudyData): string {
  // Twitter descriptions work best at 120-200 characters
  const desc = data.metaDescription;

  if (desc.length <= 200) {
    return desc;
  }

  // Truncate to 197 chars and add ellipsis
  return desc.substring(0, 197) + '...';
}

/**
 * Generates canonical URL for the case study
 */
function getCanonicalUrl(pageUrl: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://intel.totalaudiopromo.com';
  return `${baseUrl}${pageUrl}`;
}

/**
 * Main metadata generation function
 */
export async function generateCaseStudyMetadata(
  slug: string,
  options: {
    includeAlternates?: boolean;
    includeRobots?: boolean;
  } = {}
): Promise<Metadata> {
  const { includeAlternates = true, includeRobots = true } = options;

  // Get case study data
  const data = getCaseStudyBySlugSync(slug);

  if (!data) {
    // Return minimal metadata for 404 case
    return {
      title: 'Case Study Not Found | Audio Intel',
      description: 'The requested case study could not be found.',
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  // Build keywords from search intent and category
  const keywords = [
    ...data.searchIntent,
    data.category.toLowerCase(),
    'contact enrichment',
    'audio intel',
    'music industry contacts',
    'radio promotion',
  ].join(', ');

  // Generate metadata
  const metadata: Metadata = {
    title: createSEOTitle(data.pageTitle),
    description: data.metaDescription,
    keywords,

    // OpenGraph metadata for social sharing
    openGraph: {
      type: 'article',
      title: createOpenGraphTitle(data),
      description: data.metaDescription,
      url: getCanonicalUrl(data.pageUrl),
      siteName: 'Audio Intel',
      images: [
        {
          url: getOpenGraphImage(slug),
          width: 1200,
          height: 630,
          alt: `${data.pageTitle} - Case Study`,
        },
      ],
      locale: 'en_GB', // UK market focus
    },

    // Twitter Card metadata
    twitter: {
      card: getTwitterCardType(data.tier),
      title: createOpenGraphTitle(data),
      description: createTwitterDescription(data),
      images: [getOpenGraphImage(slug)],
      creator: '@totalaudiopromo', // Update with actual Twitter handle
      site: '@totalaudiopromo',
    },

    // Canonical URL
    alternates: includeAlternates
      ? {
          canonical: getCanonicalUrl(data.pageUrl),
        }
      : undefined,

    // Robots directives based on status
    robots: includeRobots
      ? {
          index: data.status === 'live',
          follow: data.status === 'live',
          nocache: data.status === 'draft',
          googleBot: {
            index: data.status === 'live',
            follow: data.status === 'live',
            'max-image-preview': 'large',
            'max-snippet': -1,
          },
        }
      : undefined,

    // Additional metadata
    authors: [{ name: 'Chris Schofield' }],
    creator: 'Audio Intel',
    publisher: 'Total Audio Promo',
    category: data.category,

    // Open Graph article metadata
    other: {
      'article:author': 'Chris Schofield',
      'article:section': data.category,
      'article:tag': keywords,
    },
  };

  return metadata;
}

/**
 * Synchronous version for generateStaticParams
 */
export function generateCaseStudyMetadataSync(
  slug: string,
  options: {
    includeAlternates?: boolean;
    includeRobots?: boolean;
  } = {}
): Metadata {
  const { includeAlternates = true, includeRobots = true } = options;

  const data = getCaseStudyBySlugSync(slug);

  if (!data) {
    return {
      title: 'Case Study Not Found | Audio Intel',
      description: 'The requested case study could not be found.',
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const keywords = [
    ...data.searchIntent,
    data.category.toLowerCase(),
    'contact enrichment',
    'audio intel',
    'music industry contacts',
    'radio promotion',
  ].join(', ');

  const metadata: Metadata = {
    title: createSEOTitle(data.pageTitle),
    description: data.metaDescription,
    keywords,

    openGraph: {
      type: 'article',
      title: createOpenGraphTitle(data),
      description: data.metaDescription,
      url: getCanonicalUrl(data.pageUrl),
      siteName: 'Audio Intel',
      images: [
        {
          url: getOpenGraphImage(slug),
          width: 1200,
          height: 630,
          alt: `${data.pageTitle} - Case Study`,
        },
      ],
      locale: 'en_GB',
    },

    twitter: {
      card: getTwitterCardType(data.tier),
      title: createOpenGraphTitle(data),
      description: createTwitterDescription(data),
      images: [getOpenGraphImage(slug)],
      creator: '@totalaudiopromo',
      site: '@totalaudiopromo',
    },

    alternates: includeAlternates
      ? {
          canonical: getCanonicalUrl(data.pageUrl),
        }
      : undefined,

    robots: includeRobots
      ? {
          index: data.status === 'live',
          follow: data.status === 'live',
          nocache: data.status === 'draft',
          googleBot: {
            index: data.status === 'live',
            follow: data.status === 'live',
            'max-image-preview': 'large',
            'max-snippet': -1,
          },
        }
      : undefined,

    authors: [{ name: 'Chris Schofield' }],
    creator: 'Audio Intel',
    publisher: 'Total Audio Promo',
    category: data.category,

    other: {
      'article:author': 'Chris Schofield',
      'article:section': data.category,
      'article:tag': keywords,
    },
  };

  return metadata;
}

// ============================================================================
// UTILITY FUNCTIONS FOR METADATA CUSTOMIZATION
// ============================================================================

/**
 * Generates structured data (JSON-LD) for case study pages
 */
export function generateCaseStudyStructuredData(slug: string): object {
  const data = getCaseStudyBySlugSync(slug);

  if (!data) {
    return {};
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: data.pageTitle,
    description: data.metaDescription,
    image: getOpenGraphImage(slug),
    author: {
      '@type': 'Person',
      name: 'Chris Schofield',
      jobTitle: 'Radio Promoter & Audio Intel Founder',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Total Audio Promo',
      logo: {
        '@type': 'ImageObject',
        url: 'https://intel.totalaudiopromo.com/images/logo.png',
      },
    },
    keywords: data.searchIntent.join(', '),
    articleSection: data.category,
    inLanguage: 'en-GB',
  };
}

/**
 * Generates FAQ schema for case studies (if applicable)
 */
export function generateCaseStudyFAQSchema(
  questions: Array<{ question: string; answer: string }>
): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: questions.map(q => ({
      '@type': 'Question',
      name: q.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: q.answer,
      },
    })),
  };
}

/**
 * Generates breadcrumb schema for case studies
 */
export function generateCaseStudyBreadcrumbSchema(slug: string): object {
  const data = getCaseStudyBySlugSync(slug);

  if (!data) {
    return {};
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://intel.totalaudiopromo.com';

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: baseUrl,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Blog',
        item: `${baseUrl}/blog`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: data.category,
        item: `${baseUrl}/blog?category=${data.category.toLowerCase().replace(/\s+/g, '-')}`,
      },
      {
        '@type': 'ListItem',
        position: 4,
        name: data.pageTitle.split(':')[0].trim(),
        item: getCanonicalUrl(data.pageUrl),
      },
    ],
  };
}

/**
 * Helper to combine all structured data schemas
 */
export function generateAllCaseStudySchemas(
  slug: string,
  faqQuestions?: Array<{ question: string; answer: string }>
): object[] {
  const schemas = [generateCaseStudyStructuredData(slug), generateCaseStudyBreadcrumbSchema(slug)];

  if (faqQuestions && faqQuestions.length > 0) {
    schemas.push(generateCaseStudyFAQSchema(faqQuestions));
  }

  return schemas;
}
