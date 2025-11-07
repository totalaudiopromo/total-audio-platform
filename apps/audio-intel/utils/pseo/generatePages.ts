/**
 * Page Generation Script for Programmatic SEO
 *
 * Generates Next.js page.tsx files from validated CSV + research data
 *
 * Usage:
 *   npm run pseo:generate -- --all           # Generate all pending pages
 *   npm run pseo:generate -- --slug bbc-6-music  # Generate single page
 *   npm run pseo:generate -- --tier 1        # Generate all Tier 1 pages
 *   npm run pseo:generate -- --validate-only # Validate without generating
 */

import fs from 'fs';
import path from 'path';
import { generatePageData, loadResearchData, parseCSV, validatePageData } from './csvParser';
import type { CaseStudyPageData } from './csvParser';

/**
 * Generate React component code from page data
 */
function generateReactComponent(pageData: CaseStudyPageData): string {
  return `import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "${pageData.title}",
  description: "${pageData.metaDescription}",
  keywords: "${pageData.keywords}",
  openGraph: {
    title: "${pageData.title}",
    description: "${pageData.metaDescription}",
    images: ["/images/${pageData.slug}-case-study.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "${pageData.title}",
    description: "${pageData.metaDescription}",
  },
};

export default function ${toPascalCase(pageData.slug)}() {
  return (
    <article className="max-w-4xl mx-auto px-4 py-12">
      {/* Data verification: ${pageData.validation.dataVerified ? '✓' : '✗'} Verified ${
    pageData.validation.verificationDate
  } */}
      {/* Confidence score: ${pageData.validation.confidenceScore}% */}
      {/* Sources: ${pageData.validation.sources.length} verified */}

      <header className="mb-12">
        <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 leading-tight">
          ${pageData.hero.title}
        </h1>

        <div className="flex flex-wrap items-center gap-4 mb-8 text-gray-600 text-sm font-semibold uppercase tracking-wide">
          <span>${pageData.hero.byline.author}</span>
          <span className="hidden sm:inline">•</span>
          <span>${pageData.hero.byline.role}</span>
          <span className="hidden sm:inline">•</span>
          <span>${pageData.hero.byline.format}</span>
          <span className="hidden sm:inline">•</span>
          <span>${pageData.hero.byline.readTime}</span>
        </div>

        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-lg">
          <p className="text-lg text-gray-800 font-medium leading-relaxed">
            ${pageData.hero.introCallout}
          </p>
        </div>
      </header>

      <div className="space-y-12">
        {/* Campaign Snapshot */}
        <section id="campaign-snapshot" className="space-y-6">
          <h2 className="text-3xl font-black text-gray-900">Campaign Snapshot</h2>
          <p className="text-lg text-gray-700 leading-relaxed">
            ${pageData.campaignSnapshot.context}
          </p>
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">${
                pageData.campaignSnapshot.manualEffort.title
              }</h3>
              <ul className="space-y-2 text-gray-700 text-base leading-relaxed">
                ${pageData.campaignSnapshot.manualEffort.points
                  .map(point => `<li>• ${point}</li>`)
                  .join('\n                ')}
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">${
                pageData.campaignSnapshot.aiRun.title
              }</h3>
              <ul className="space-y-2 text-gray-700 text-base leading-relaxed">
                ${pageData.campaignSnapshot.aiRun.points
                  .map(point => `<li>• ${point}</li>`)
                  .join('\n                ')}
              </ul>
            </div>
          </div>
        </section>

        {/* Pain Points */}
        <section id="pain-points" className="space-y-6">
          <h2 className="text-3xl font-black text-gray-900">${pageData.painPoints.heading}</h2>
          <p className="text-lg text-gray-700 leading-relaxed">
            ${pageData.painPoints.intro}
          </p>
          <ul className="space-y-4 text-base text-gray-700 leading-relaxed pl-4">
            ${pageData.painPoints.points
              .map(
                point => `<li>
              <strong className="text-gray-900">${point.title}:</strong> ${point.description}
            </li>`
              )
              .join('\n            ')}
          </ul>
        </section>

        {/* Workflow */}
        <section id="workflow" className="space-y-6">
          <h2 className="text-3xl font-black text-gray-900">${pageData.workflow.heading}</h2>
          <p className="text-lg text-gray-700 leading-relaxed">
            ${pageData.workflow.intro}
          </p>
          <ol className="list-decimal pl-6 space-y-4 text-base text-gray-700 leading-relaxed">
            ${pageData.workflow.steps
              .map(
                step => `<li>
              <strong className="text-gray-900">${step.title}:</strong> ${step.description}
            </li>`
              )
              .join('\n            ')}
          </ol>
        </section>

        {/* Contacts Table */}
        <section id="contacts" className="space-y-6">
          <h2 className="text-3xl font-black text-gray-900">${pageData.contacts.heading}</h2>
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
            <table className="w-full text-left text-sm md:text-base">
              <thead className="bg-gray-100 text-gray-900 uppercase tracking-wider text-xs md:text-sm">
                <tr>
                  <th className="py-3 px-4">Contact</th>
                  <th className="py-3 px-4">Role & Show</th>
                  <th className="py-3 px-4">Submission Notes</th>
                  <th className="py-3 px-4">Validation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-700">
                ${pageData.contacts.contacts
                  .map(
                    contact => `<tr>
                  <td className="py-4 px-4 font-semibold">${contact.name}</td>
                  <td className="py-4 px-4">${contact.role}</td>
                  <td className="py-4 px-4">${contact.submission_notes}</td>
                  <td className="py-4 px-4">Validated, ${contact.confidence_score} percent confidence</td>
                </tr>`
                  )
                  .join('\n                ')}
              </tbody>
            </table>
          </div>
          ${
            pageData.contacts.disclaimer
              ? `<p className="text-sm text-gray-500">${pageData.contacts.disclaimer}</p>`
              : ''
          }
        </section>

        {/* Results */}
        <section id="results" className="space-y-6">
          <h2 className="text-3xl font-black text-gray-900">${pageData.results.heading}</h2>
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 grid md:grid-cols-3 gap-6 text-gray-800">
            ${pageData.results.metrics
              .map(
                metric => `<div>
              <h3 className="text-2xl font-black mb-2">${metric.title}</h3>
              <p className="text-base leading-relaxed">${metric.description}</p>
            </div>`
              )
              .join('\n            ')}
          </div>
        </section>

        {/* Playbook */}
        <section id="playbook" className="space-y-6">
          <h2 className="text-3xl font-black text-gray-900">${pageData.playbook.heading}</h2>
          <p className="text-lg text-gray-700 leading-relaxed">
            ${pageData.playbook.intro}
          </p>
          <ol className="list-decimal pl-6 space-y-4 text-base text-gray-700 leading-relaxed">
            ${pageData.playbook.steps.map(step => `<li>${step}</li>`).join('\n            ')}
          </ol>
        </section>

        {/* Testimonial */}
        <section id="testimonial" className="space-y-6">
          <h2 className="text-3xl font-black text-gray-900">${pageData.testimonial.heading}</h2>
          <blockquote className="bg-white border-l-4 border-gray-900 p-6 rounded-r-xl shadow-sm text-gray-800 text-lg leading-relaxed">
            ${pageData.testimonial.quote}
          </blockquote>
          ${
            pageData.testimonial.attribution
              ? `<p className="text-sm text-gray-500">${pageData.testimonial.attribution}</p>`
              : ''
          }
        </section>

        {/* CTA */}
        <section id="cta" className="space-y-6">
          <h2 className="text-3xl font-black text-gray-900">${pageData.cta.heading}</h2>
          <p className="text-lg text-gray-700 leading-relaxed">
            ${pageData.cta.intro}
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href="${pageData.cta.primaryButton.href}"
              className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-black text-base px-8 py-4 rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-transform duration-200 active:scale-95"
            >
              ${pageData.cta.primaryButton.text}
            </a>
            <a
              href="${pageData.cta.secondaryButton.href}"
              className="inline-flex items-center justify-center gap-2 border-2 border-gray-900 text-gray-900 font-bold text-base px-8 py-4 rounded-2xl hover:bg-gray-100 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-transform duration-200 active:scale-95"
            >
              ${pageData.cta.secondaryButton.text}
            </a>
          </div>
        </section>
      </div>
    </article>
  );
}
`;
}

/**
 * Convert slug to PascalCase for React component name
 */
function toPascalCase(slug: string): string {
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');
}

/**
 * Write generated page to filesystem
 */
function writePage(slug: string, componentCode: string): void {
  const blogDir = path.join(process.cwd(), 'app/blog', slug);
  const pagePath = path.join(blogDir, 'page.tsx');

  // Create directory if it doesn't exist
  if (!fs.existsSync(blogDir)) {
    fs.mkdirSync(blogDir, { recursive: true });
  }

  // Write page file
  fs.writeFileSync(pagePath, componentCode, 'utf-8');
  console.log(`✓ Generated: ${slug}/page.tsx`);
}

/**
 * Main CLI interface
 */
export function main() {
  const args = process.argv.slice(2);
  const csvPath = path.join(process.cwd(), 'docs/pseo/programmatic-pages.csv');

  // Parse CLI arguments
  const options = {
    all: args.includes('--all'),
    slug: args.find(arg => arg.startsWith('--slug='))?.split('=')[1],
    tier: args.find(arg => arg.startsWith('--tier='))?.split('=')[1],
    validateOnly: args.includes('--validate-only'),
  };

  console.log('🚀 PSEO Page Generation');
  console.log('========================\n');

  // Load CSV
  const rows = parseCSV(csvPath);
  console.log(`📄 Loaded ${rows.length} rows from CSV\n`);

  // Filter rows based on options
  let filteredRows = rows;

  if (options.slug) {
    filteredRows = rows.filter(row => row.topic_slug === options.slug);
    console.log(`🎯 Filtering to slug: ${options.slug}\n`);
  } else if (options.tier) {
    const tierNum = parseInt(options.tier, 10);
    filteredRows = rows.filter(row => row.tier === tierNum);
    console.log(`🎯 Filtering to tier ${tierNum} pages\n`);
  } else if (options.all) {
    filteredRows = rows.filter(row => row.status === 'planned' || row.status === 'draft');
    console.log(`🎯 Processing all planned/draft pages (${filteredRows.length})\n`);
  } else {
    console.log('❌ No generation mode specified');
    console.log('\nUsage:');
    console.log('  npm run pseo:generate -- --all');
    console.log('  npm run pseo:generate -- --slug=bbc-6-music');
    console.log('  npm run pseo:generate -- --tier=1');
    console.log('  npm run pseo:generate -- --validate-only');
    process.exit(1);
  }

  // Process each row
  const stats = {
    total: filteredRows.length,
    generated: 0,
    skipped: 0,
    errors: 0,
  };

  filteredRows.forEach(row => {
    console.log(`\n📝 Processing: ${row.topic_slug}`);
    console.log(
      `   Category: ${row.category} | Tier ${row.tier} | ${row.monthly_searches_est} searches/month`
    );

    // Load research data
    const researchData = loadResearchData(row.topic_slug);
    if (!researchData) {
      console.log(`   ⚠️  No research data - skipping`);
      stats.skipped++;
      return;
    }

    // Validate
    const validation = validatePageData(row, researchData);
    if (!validation.valid) {
      console.log(`   ❌ Validation failed:`);
      validation.errors.forEach(error => console.log(`      - ${error}`));
      stats.errors++;
      return;
    }

    console.log(
      `   ✓ Validation passed (${researchData.verified_contacts.length} contacts, ${researchData.sources.length} sources)`
    );

    // Generate page data
    const pageData = generatePageData(row, researchData);
    if (!pageData) {
      console.log(`   ❌ Page generation failed`);
      stats.errors++;
      return;
    }

    // Validate-only mode
    if (options.validateOnly) {
      console.log(`   ✓ Would generate page (validate-only mode)`);
      stats.generated++;
      return;
    }

    // Generate React component
    const componentCode = generateReactComponent(pageData);

    // Write to filesystem
    writePage(row.topic_slug, componentCode);
    stats.generated++;
  });

  // Summary
  console.log('\n\n📊 Generation Summary');
  console.log('=====================');
  console.log(`Total processed: ${stats.total}`);
  console.log(`✓ Generated: ${stats.generated}`);
  console.log(`⚠️  Skipped: ${stats.skipped}`);
  console.log(`❌ Errors: ${stats.errors}`);
  console.log('\n');
}

// Run if called directly
if (require.main === module) {
  main();
}
