/**
 * EXAMPLE BLOG LISTING PAGE IMPLEMENTATION
 *
 * Shows how to use the CSV parser utilities to create blog listing pages
 * with filtering, categorization, and search intent grouping.
 *
 * Location: app/blog/page.tsx
 *
 * Features:
 * - Group case studies by category
 * - Filter by status (only show live studies)
 * - Display study metadata (tier, search volume, etc.)
 * - Responsive grid layout
 */

import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllCaseStudiesSync, type EnrichedCaseStudyData } from '@/utils/parseCaseStudyData';

// ============================================================================
// METADATA
// ============================================================================

export const metadata: Metadata = {
  title: 'Music Industry Case Studies | Audio Intel',
  description:
    'Real music promotion case studies showing how Audio Intel transforms contact research from hours to minutes. BBC Radio 1, Spotify, playlist pitching, and more.',
  keywords:
    'music industry case studies, radio promotion case studies, playlist pitching guides, bbc radio 1, spotify editorial, contact enrichment',
  openGraph: {
    title: 'Music Industry Case Studies & Pitching Guides',
    description:
      'Learn from real radio promotion and playlist pitching campaigns. See how Audio Intel saves 15+ hours per campaign.',
    images: ['/images/blog-og.png'],
  },
};

// ============================================================================
// PAGE COMPONENT
// ============================================================================

export default function BlogPage() {
  // Get all case studies
  const allStudies = getAllCaseStudiesSync();

  // Filter to only show live studies
  const liveStudies = allStudies.filter((s) => s.status === 'live');

  // Group by category
  const studiesByCategory = liveStudies.reduce((acc, study) => {
    if (!acc[study.category]) {
      acc[study.category] = [];
    }
    acc[study.category].push(study);
    return acc;
  }, {} as Record<string, EnrichedCaseStudyData[]>);

  // Sort categories by priority (tier 1 categories first)
  const sortedCategories = Object.entries(studiesByCategory).sort((a, b) => {
    const aTier = Math.min(...a[1].map((s) => s.tier));
    const bTier = Math.min(...b[1].map((s) => s.tier));
    return aTier - bTier;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Header */}
      <header className="mb-12 text-center">
        <h1 className="text-5xl font-black text-gray-900 mb-6">Music Industry Case Studies</h1>
        <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
          Real radio promotion and playlist pitching workflows rebuilt with Audio Intel. See exactly how we save 15+
          hours per campaign with contact enrichment.
        </p>
      </header>

      {/* Category Sections */}
      <div className="space-y-16">
        {sortedCategories.map(([category, studies]) => (
          <section key={category}>
            <div className="mb-8">
              <h2 className="text-3xl font-black text-gray-900 mb-2">{category}</h2>
              <p className="text-gray-600">
                {studies.length} case {studies.length === 1 ? 'study' : 'studies'}
              </p>
            </div>

            {/* Case Study Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {studies.map((study) => (
                <CaseStudyCard key={study.topicSlug} study={study} />
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* Coming Soon Section (if planned studies exist) */}
      {allStudies.some((s) => s.status === 'planned') && (
        <section className="mt-16 pt-16 border-t border-gray-200">
          <h2 className="text-3xl font-black text-gray-900 mb-8">Coming Soon</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allStudies
              .filter((s) => s.status === 'planned')
              .slice(0, 6)
              .map((study) => (
                <PlannedCaseStudyCard key={study.topicSlug} study={study} />
              ))}
          </div>
        </section>
      )}
    </div>
  );
}

// ============================================================================
// CASE STUDY CARD COMPONENT
// ============================================================================

function CaseStudyCard({ study }: { study: EnrichedCaseStudyData }) {
  // Get tier badge styling
  const getTierBadge = (tier: number) => {
    if (tier === 1)
      return <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-bold rounded">High Priority</span>;
    if (tier === 2)
      return <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-bold rounded">Medium Priority</span>;
    return <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs font-bold rounded">Reference Guide</span>;
  };

  return (
    <Link href={study.pageUrl} className="group block">
      <article className="h-full bg-white border-2 border-gray-200 rounded-xl p-6 transition-all duration-200 hover:border-blue-500 hover:shadow-lg">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
              {study.pageTitle.split(':')[0].replace(' | Audio Intel', '')}
            </h3>
          </div>
          {getTierBadge(study.tier)}
        </div>

        {/* Description */}
        <p className="text-gray-700 mb-4 line-clamp-3">{study.metaDescription}</p>

        {/* Metadata */}
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="px-2 py-1 bg-yellow-50 border border-yellow-200 text-yellow-800 text-xs font-semibold rounded">
            {study.estimatedReadTime} min read
          </span>
          <span className="px-2 py-1 bg-purple-50 border border-purple-200 text-purple-800 text-xs font-semibold rounded">
            {study.category}
          </span>
        </div>

        {/* Primary Keyword */}
        <div className="text-sm text-gray-500">
          <strong>Target keyword:</strong> {study.primaryKeyword}
        </div>

        {/* CTA */}
        <div className="mt-4 pt-4 border-t border-gray-100">
          <span className="text-blue-600 font-semibold text-sm group-hover:underline">
            Read case study →
          </span>
        </div>
      </article>
    </Link>
  );
}

// ============================================================================
// PLANNED CASE STUDY CARD (Coming Soon)
// ============================================================================

function PlannedCaseStudyCard({ study }: { study: EnrichedCaseStudyData }) {
  return (
    <article className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl p-6">
      {/* Header */}
      <div className="mb-4">
        <span className="inline-block px-2 py-1 bg-gray-200 text-gray-700 text-xs font-bold rounded mb-3">
          Coming Soon
        </span>
        <h3 className="text-xl font-bold text-gray-700 mb-2">
          {study.pageTitle.split(':')[0].replace(' | Audio Intel', '')}
        </h3>
      </div>

      {/* Description */}
      <p className="text-gray-600 mb-4 line-clamp-3">{study.metaDescription}</p>

      {/* Metadata */}
      <div className="flex flex-wrap gap-2">
        <span className="px-2 py-1 bg-gray-100 border border-gray-200 text-gray-600 text-xs font-semibold rounded">
          {study.category}
        </span>
        <span className="px-2 py-1 bg-gray-100 border border-gray-200 text-gray-600 text-xs font-semibold rounded">
          ~{study.monthlySearchesEst} monthly searches
        </span>
      </div>
    </article>
  );
}

// ============================================================================
// ALTERNATIVE: FILTERED LISTING PAGE
// ============================================================================

/**
 * Alternative implementation with filtering by category or tier
 */
export function FilteredBlogPage({ category, tier }: { category?: string; tier?: number }) {
  const allStudies = getAllCaseStudiesSync();

  // Apply filters
  let filteredStudies = allStudies.filter((s) => s.status === 'live');

  if (category) {
    filteredStudies = filteredStudies.filter(
      (s) => s.category.toLowerCase() === category.toLowerCase()
    );
  }

  if (tier) {
    filteredStudies = filteredStudies.filter((s) => s.tier === tier);
  }

  // Sort by monthly searches (highest first)
  filteredStudies.sort((a, b) => b.monthlySearchesEst - a.monthlySearchesEst);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <header className="mb-12">
        <h1 className="text-5xl font-black text-gray-900 mb-4">
          {category || tier ? 'Filtered Case Studies' : 'All Case Studies'}
        </h1>
        {category && <p className="text-xl text-gray-700">Category: {category}</p>}
        {tier && <p className="text-xl text-gray-700">Priority Tier: {tier}</p>}
      </header>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStudies.map((study) => (
          <CaseStudyCard key={study.topicSlug} study={study} />
        ))}
      </div>

      {filteredStudies.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">No case studies found with the selected filters.</p>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// ALTERNATIVE: SEARCH INTENT GROUPING
// ============================================================================

/**
 * Group case studies by primary search intent for SEO landing pages
 */
export function SearchIntentBlogPage() {
  const allStudies = getAllCaseStudiesSync().filter((s) => s.status === 'live');

  // Group by primary keyword (first search intent)
  const byKeyword = allStudies.reduce((acc, study) => {
    const keyword = study.primaryKeyword;
    if (!acc[keyword]) {
      acc[keyword] = [];
    }
    acc[keyword].push(study);
    return acc;
  }, {} as Record<string, EnrichedCaseStudyData[]>);

  // Sort by total monthly searches
  const sortedKeywords = Object.entries(byKeyword).sort((a, b) => {
    const aSearches = a[1].reduce((sum, s) => sum + s.monthlySearchesEst, 0);
    const bSearches = b[1].reduce((sum, s) => sum + s.monthlySearchesEst, 0);
    return bSearches - aSearches;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <header className="mb-12">
        <h1 className="text-5xl font-black text-gray-900 mb-4">Case Studies by Topic</h1>
        <p className="text-xl text-gray-700">Organised by primary search intent</p>
      </header>

      <div className="space-y-12">
        {sortedKeywords.map(([keyword, studies]) => {
          const totalSearches = studies.reduce((sum, s) => sum + s.monthlySearchesEst, 0);

          return (
            <section key={keyword} className="pb-8 border-b border-gray-200">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">&quot;{keyword}&quot;</h2>
                <p className="text-gray-600">
                  {studies.length} case {studies.length === 1 ? 'study' : 'studies'} • ~{totalSearches.toLocaleString()}{' '}
                  monthly searches
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {studies.map((study) => (
                  <CaseStudyCard key={study.topicSlug} study={study} />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}

// ============================================================================
// STATS COMPONENT (Optional)
// ============================================================================

/**
 * Display aggregate stats about all case studies
 */
export function CaseStudyStats() {
  const allStudies = getAllCaseStudiesSync();
  const liveStudies = allStudies.filter((s) => s.status === 'live');

  const totalSearchVolume = liveStudies.reduce((sum, s) => sum + s.monthlySearchesEst, 0);
  const avgReadTime = Math.round(
    liveStudies.reduce((sum, s) => sum + s.estimatedReadTime, 0) / liveStudies.length
  );

  const categories = [...new Set(liveStudies.map((s) => s.category))];

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 mb-12">
      <h3 className="text-xl font-bold text-gray-900 mb-4">Case Study Library Stats</h3>
      <div className="grid md:grid-cols-4 gap-6">
        <div>
          <div className="text-3xl font-black text-blue-600 mb-1">{liveStudies.length}</div>
          <div className="text-sm text-gray-600">Live Case Studies</div>
        </div>
        <div>
          <div className="text-3xl font-black text-green-600 mb-1">{totalSearchVolume.toLocaleString()}</div>
          <div className="text-sm text-gray-600">Monthly Search Volume</div>
        </div>
        <div>
          <div className="text-3xl font-black text-purple-600 mb-1">{avgReadTime} min</div>
          <div className="text-sm text-gray-600">Average Read Time</div>
        </div>
        <div>
          <div className="text-3xl font-black text-orange-600 mb-1">{categories.length}</div>
          <div className="text-sm text-gray-600">Categories Covered</div>
        </div>
      </div>
    </div>
  );
}
