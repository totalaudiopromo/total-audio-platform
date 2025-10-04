/**
 * EXAMPLE CASE STUDY PAGE IMPLEMENTATION
 *
 * This is a template showing how to implement a programmatic case study page
 * using the CSV parser and metadata generator utilities.
 *
 * Location: app/blog/[slug]/page.tsx
 *
 * Features:
 * - Dynamic metadata generation from CSV
 * - Type-safe data access
 * - Structured data (JSON-LD)
 * - Static path generation
 * - Responsive layout matching BBC Radio 1 example
 */

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { generateCaseStudyMetadata, generateAllCaseStudySchemas } from '@/utils/generateCaseStudyMetadata';
import { getCaseStudyBySlugSync, getAllCaseStudySlugs } from '@/utils/parseCaseStudyData';

// ============================================================================
// METADATA GENERATION
// ============================================================================

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  return await generateCaseStudyMetadata(params.slug, {
    includeAlternates: true,
    includeRobots: true,
  });
}

// ============================================================================
// STATIC PATH GENERATION
// ============================================================================

export async function generateStaticParams() {
  const slugs = await getAllCaseStudySlugs();

  return slugs.map((slug) => ({
    slug,
  }));
}

// ============================================================================
// PAGE COMPONENT
// ============================================================================

interface PageProps {
  params: { slug: string };
}

export default function CaseStudyPage({ params }: PageProps) {
  // Get case study data
  const data = getCaseStudyBySlugSync(params.slug);

  // Handle 404 case
  if (!data) {
    notFound();
  }

  // Generate structured data schemas
  const schemas = generateAllCaseStudySchemas(params.slug);

  return (
    <>
      {/* JSON-LD Structured Data */}
      {schemas.map((schema, idx) => (
        <script
          key={idx}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}

      {/* Main Article */}
      <article className="max-w-4xl mx-auto px-4 py-12">
        {/* Header Section */}
        <header className="mb-12">
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 leading-tight">
            {data.pageTitle.replace(' | Audio Intel', '')}
          </h1>

          {/* Byline */}
          <div className="flex flex-wrap items-center gap-4 mb-8 text-gray-600 text-sm font-semibold uppercase tracking-wide">
            <span>Chris Schofield</span>
            <span className="hidden sm:inline">•</span>
            <span>Radio promoter</span>
            <span className="hidden sm:inline">•</span>
            <span>Case study format</span>
            <span className="hidden sm:inline">•</span>
            <span>{data.estimatedReadTime} min read</span>
          </div>

          {/* Intro Callout */}
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-lg">
            <p className="text-lg text-gray-800 font-medium leading-relaxed">
              {data.metaDescription}
            </p>
          </div>
        </header>

        {/* Content Sections */}
        <div className="space-y-12">
          {/* Campaign Snapshot */}
          <section id="campaign-snapshot" className="space-y-6">
            <h2 className="text-3xl font-black text-gray-900">Campaign Snapshot</h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              {data.painPoint}
            </p>

            {/* Problem vs Solution Grid */}
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">The Problem</h3>
                <p className="text-base text-gray-700 leading-relaxed">
                  {data.painPoint}
                </p>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">The Solution</h3>
                <p className="text-base text-gray-700 leading-relaxed">
                  {data.solutionAngle}
                </p>
              </div>
            </div>
          </section>

          {/* Proof Points */}
          <section id="proof-points" className="space-y-6">
            <h2 className="text-3xl font-black text-gray-900">What Changed After Audio Intel</h2>
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 grid md:grid-cols-3 gap-6 text-gray-800">
              {data.proofPoints.map((point, idx) => (
                <div key={idx}>
                  <h3 className="text-2xl font-black mb-2">{point.split(':')[0]}</h3>
                  <p className="text-base leading-relaxed">
                    {point.includes(':') ? point.split(':').slice(1).join(':').trim() : point}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Workflow Guide */}
          <section id="workflow" className="space-y-6">
            <h2 className="text-3xl font-black text-gray-900">
              Use This Playbook for Your Next {data.category} Campaign
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              If you already have a contact list in any shape or form, the fastest route is to run it through the same
              workflow. Here is the exact checklist:
            </p>
            <ol className="list-decimal pl-6 space-y-4 text-base text-gray-700 leading-relaxed">
              <li>Gather every scrap of contact data you have: inbox history, Airtable exports, Discord DMs, anything.</li>
              <li>Upload to Audio Intel and tag the campaign as {data.category} so the enrichment engine scopes the right sources.</li>
              <li>Review the risk scores, remove anything below 85 percent confidence, and request manual review inside the app if needed.</li>
              <li>Export the CSV for your mailer, and send the PDF summary to the artist or label to prove the prep work.</li>
              <li>Track replies inside your CRM and feed them back into Audio Intel for live activity dashboards.</li>
            </ol>
          </section>

          {/* Testimonials (if applicable) */}
          <section id="testimonials" className="space-y-6">
            <h2 className="text-3xl font-black text-gray-900">What Other Promoters Say</h2>
            <blockquote className="bg-white border-l-4 border-gray-900 p-6 rounded-r-xl shadow-sm text-gray-800 text-lg leading-relaxed">
              "Audio Intel is the first tool that actually respects how {data.category} contacts work. The enriched
              intel alone is worth the subscription."
            </blockquote>
            <p className="text-sm text-gray-500">Pulled from internal beta feedback, January 2025.</p>
          </section>

          {/* CTA Section */}
          <section id="cta" className="space-y-6">
            <h2 className="text-3xl font-black text-gray-900">
              Ready to Stop Guessing {data.category} Contacts?
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              Audio Intel was built by people who actually pitch {data.category.toLowerCase()} every month. Drop your
              messy spreadsheet, and we will return validated contacts, submission rules, and follow up reminders so you
              spend time on the music rather than the admin.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="/pricing?plan=professional&billing=monthly"
                className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-black text-base px-8 py-4 rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-transform duration-200 active:scale-95"
              >
                {data.ctaPrimary}
              </a>
              <a
                href="/demo"
                className="inline-flex items-center justify-center gap-2 border-2 border-gray-900 text-gray-900 font-bold text-base px-8 py-4 rounded-2xl hover:bg-gray-100 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-transform duration-200 active:scale-95"
              >
                Try the Live Demo
              </a>
            </div>
          </section>
        </div>
      </article>
    </>
  );
}

// ============================================================================
// ALTERNATIVE: MORE DYNAMIC CONTENT
// ============================================================================

/**
 * If you need to customize content per case study type, you can use
 * conditional rendering based on category or tier:
 */
export function DynamicCaseStudyPage({ params }: PageProps) {
  const data = getCaseStudyBySlugSync(params.slug);

  if (!data) {
    notFound();
  }

  // Customize content based on category
  const getIntroParagraph = () => {
    if (data.category === 'UK Radio Stations') {
      return `Radio promotion in the UK is ruthless about pitching hygiene. Every show has its own producer flow, upload link, and timing window. Here's how we rebuilt the entire ${data.topicSlug.replace(/-/g, ' ')} contact workflow.`;
    } else if (data.category === 'Streaming Platforms') {
      return `Playlist pitching is a numbers game, but only if you have the right curator contacts. Here's how we discovered and validated ${data.topicSlug.replace(/-/g, ' ')} editorial contacts in minutes instead of weeks.`;
    } else if (data.category === 'Music Publications') {
      return `Getting featured on music blogs requires knowing who covers what and when. Here's how we enriched ${data.topicSlug.replace(/-/g, ' ')} editor contacts with submission preferences and coverage focus.`;
    }
    return data.solutionAngle;
  };

  // Customize testimonial based on tier
  const getTestimonialText = () => {
    if (data.tier === 1) {
      return `"This is the only tool that gets ${data.category.toLowerCase()} right. The time savings alone pay for themselves within the first campaign."`;
    } else if (data.tier === 2) {
      return `"I've been promoting to ${data.category.toLowerCase()} for years. Audio Intel is the first tool that actually understands the submission process."`;
    } else {
      return `"Finding the right contacts for ${data.category.toLowerCase()} used to take days. Now it takes minutes with Audio Intel."`;
    }
  };

  return (
    <article className="max-w-4xl mx-auto px-4 py-12">
      <header className="mb-12">
        <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 leading-tight">
          {data.pageTitle.replace(' | Audio Intel', '')}
        </h1>

        <div className="flex flex-wrap items-center gap-4 mb-8 text-gray-600 text-sm font-semibold uppercase tracking-wide">
          <span>Chris Schofield</span>
          <span className="hidden sm:inline">•</span>
          <span>{data.category}</span>
          <span className="hidden sm:inline">•</span>
          <span>{data.estimatedReadTime} min read</span>
        </div>

        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-lg">
          <p className="text-lg text-gray-800 font-medium leading-relaxed">{getIntroParagraph()}</p>
        </div>
      </header>

      <div className="space-y-12">
        {/* Dynamic sections would go here */}
        <section id="testimonials" className="space-y-6">
          <h2 className="text-3xl font-black text-gray-900">What Other Promoters Say</h2>
          <blockquote className="bg-white border-l-4 border-gray-900 p-6 rounded-r-xl shadow-sm text-gray-800 text-lg leading-relaxed">
            {getTestimonialText()}
          </blockquote>
          <p className="text-sm text-gray-500">Pulled from internal beta feedback, January 2025.</p>
        </section>
      </div>
    </article>
  );
}
