/**
 * Test Script for Case Study Parser
 *
 * Run this to verify CSV parsing and metadata generation works correctly.
 *
 * Usage:
 * ```bash
 * npx ts-node utils/test-case-study-parser.ts
 * # or
 * node --loader ts-node/esm utils/test-case-study-parser.ts
 * ```
 */

import {
  getAllCaseStudiesSync,
  getCaseStudyBySlugSync,
  validateCaseStudy,
  type EnrichedCaseStudyData,
} from './parseCaseStudyData';

import {
  generateCaseStudyMetadataSync,
  generateCaseStudyStructuredData,
  generateCaseStudyBreadcrumbSchema,
} from './generateCaseStudyMetadata';

// ============================================================================
// TEST FUNCTIONS
// ============================================================================

function testGetAllCaseStudies() {
  console.log('\n=== Test: Get All Case Studies ===');
  try {
    const studies = getAllCaseStudiesSync();
    console.log(`✓ Found ${studies.length} case studies`);

    if (studies.length > 0) {
      console.log('\nFirst study:');
      console.log(`  Slug: ${studies[0].topicSlug}`);
      console.log(`  Title: ${studies[0].pageTitle}`);
      console.log(`  Category: ${studies[0].category}`);
      console.log(`  Status: ${studies[0].status}`);
      console.log(`  Tier: ${studies[0].tier}`);
      console.log(`  Estimated Read Time: ${studies[0].estimatedReadTime} min`);
    }

    return true;
  } catch (error) {
    console.error('✗ Error:', error);
    return false;
  }
}

function testGetCaseStudyBySlug() {
  console.log('\n=== Test: Get Case Study by Slug ===');
  try {
    const bbcStudy = getCaseStudyBySlugSync('bbc-radio-1');

    if (!bbcStudy) {
      console.error('✗ BBC Radio 1 case study not found');
      return false;
    }

    console.log('✓ Found BBC Radio 1 case study');
    console.log(`  Title: ${bbcStudy.pageTitle}`);
    console.log(`  URL: ${bbcStudy.pageUrl}`);
    console.log(`  Status: ${bbcStudy.status}`);
    console.log(`  Search Intent: ${bbcStudy.searchIntent.join(', ')}`);
    console.log(`  Audience: ${bbcStudy.audience.join(', ')}`);
    console.log(`  Primary Keyword: ${bbcStudy.primaryKeyword}`);

    return true;
  } catch (error) {
    console.error('✗ Error:', error);
    return false;
  }
}

function testValidation() {
  console.log('\n=== Test: Validate Case Studies ===');
  try {
    const studies = getAllCaseStudiesSync();
    let allValid = true;

    studies.forEach(study => {
      const validation = validateCaseStudy(study);
      if (!validation.valid) {
        console.error(`✗ Validation failed for ${study.topicSlug}:`);
        validation.errors.forEach(error => console.error(`    - ${error}`));
        allValid = false;
      }
    });

    if (allValid) {
      console.log(`✓ All ${studies.length} case studies passed validation`);
    }

    return allValid;
  } catch (error) {
    console.error('✗ Error:', error);
    return false;
  }
}

function testMetadataGeneration() {
  console.log('\n=== Test: Generate Metadata ===');
  try {
    const metadata = generateCaseStudyMetadataSync('bbc-radio-1');

    console.log('✓ Generated metadata for BBC Radio 1');
    console.log('\nMetadata fields:');
    console.log(`  Title: ${metadata.title}`);

    const description = metadata.description;
    if (typeof description === 'string') {
      console.log(`  Description: ${description.substring(0, 80)}...`);
    }

    const keywords = metadata.keywords;
    if (typeof keywords === 'string') {
      console.log(`  Keywords: ${keywords.substring(0, 80)}...`);
    }

    if (
      metadata.openGraph &&
      typeof metadata.openGraph === 'object' &&
      'title' in metadata.openGraph
    ) {
      console.log(`\nOpenGraph:`);
      console.log(`  Title: ${metadata.openGraph.title}`);
      if ('locale' in metadata.openGraph) {
        console.log(`  Locale: ${metadata.openGraph.locale}`);
      }
    }

    if (metadata.twitter && typeof metadata.twitter === 'object' && 'title' in metadata.twitter) {
      console.log(`\nTwitter Card:`);
      console.log(`  Title: ${metadata.twitter.title}`);
    }

    if (metadata.robots && typeof metadata.robots === 'object' && 'index' in metadata.robots) {
      console.log(`\nRobots:`);
      console.log(`  Index: ${metadata.robots.index}`);
      console.log(`  Follow: ${metadata.robots.follow}`);
    }

    return true;
  } catch (error) {
    console.error('✗ Error:', error);
    return false;
  }
}

function testStructuredData() {
  console.log('\n=== Test: Generate Structured Data ===');
  try {
    const articleSchema = generateCaseStudyStructuredData('bbc-radio-1');
    const breadcrumbSchema = generateCaseStudyBreadcrumbSchema('bbc-radio-1');

    console.log('✓ Generated Article schema:');
    console.log(`  Type: ${(articleSchema as any)['@type']}`);
    console.log(`  Headline: ${(articleSchema as any).headline?.substring(0, 50)}...`);

    console.log('\n✓ Generated Breadcrumb schema:');
    console.log(`  Type: ${(breadcrumbSchema as any)['@type']}`);
    const items = (breadcrumbSchema as any).itemListElement;
    console.log(`  Breadcrumb items: ${items?.length || 0}`);

    return true;
  } catch (error) {
    console.error('✗ Error:', error);
    return false;
  }
}

function testFilterFunctions() {
  console.log('\n=== Test: Filter Functions ===');
  try {
    const allStudies = getAllCaseStudiesSync();

    // Group by status
    const statusGroups = allStudies.reduce((acc, study) => {
      if (!acc[study.status]) acc[study.status] = [];
      acc[study.status].push(study);
      return acc;
    }, {} as Record<string, EnrichedCaseStudyData[]>);

    console.log('\nBy Status:');
    Object.entries(statusGroups).forEach(([status, studies]) => {
      console.log(`  ${status}: ${studies.length} studies`);
    });

    // Group by category
    const categoryGroups = allStudies.reduce((acc, study) => {
      if (!acc[study.category]) acc[study.category] = [];
      acc[study.category].push(study);
      return acc;
    }, {} as Record<string, EnrichedCaseStudyData[]>);

    console.log('\nBy Category:');
    Object.entries(categoryGroups).forEach(([category, studies]) => {
      console.log(`  ${category}: ${studies.length} studies`);
    });

    // Group by tier
    const tierGroups = allStudies.reduce((acc, study) => {
      if (!acc[study.tier]) acc[study.tier] = [];
      acc[study.tier].push(study);
      return acc;
    }, {} as Record<number, EnrichedCaseStudyData[]>);

    console.log('\nBy Tier:');
    Object.entries(tierGroups).forEach(([tier, studies]) => {
      console.log(`  Tier ${tier}: ${studies.length} studies`);
    });

    console.log('\n✓ Filter functions working correctly');
    return true;
  } catch (error) {
    console.error('✗ Error:', error);
    return false;
  }
}

function testEdgeCases() {
  console.log('\n=== Test: Edge Cases ===');
  let allPassed = true;

  // Test non-existent slug
  console.log('\nTesting non-existent slug...');
  const invalidStudy = getCaseStudyBySlugSync('does-not-exist');
  if (invalidStudy === null) {
    console.log('✓ Returns null for non-existent slug');
  } else {
    console.error('✗ Should return null for non-existent slug');
    allPassed = false;
  }

  // Test metadata for non-existent slug
  console.log('\nTesting metadata for non-existent slug...');
  const invalidMetadata = generateCaseStudyMetadataSync('does-not-exist');
  if (invalidMetadata.title === 'Case Study Not Found | Audio Intel') {
    console.log('✓ Returns 404 metadata for non-existent slug');
  } else {
    console.error('✗ Should return 404 metadata for non-existent slug');
    allPassed = false;
  }

  return allPassed;
}

// ============================================================================
// MAIN TEST RUNNER
// ============================================================================

function runAllTests() {
  console.log('═══════════════════════════════════════════════════════');
  console.log('  Case Study Parser & Metadata Generator Tests');
  console.log('═══════════════════════════════════════════════════════');

  const tests = [
    { name: 'Get All Case Studies', fn: testGetAllCaseStudies },
    { name: 'Get Case Study by Slug', fn: testGetCaseStudyBySlug },
    { name: 'Validation', fn: testValidation },
    { name: 'Metadata Generation', fn: testMetadataGeneration },
    { name: 'Structured Data', fn: testStructuredData },
    { name: 'Filter Functions', fn: testFilterFunctions },
    { name: 'Edge Cases', fn: testEdgeCases },
  ];

  const results = tests.map(test => ({
    name: test.name,
    passed: test.fn(),
  }));

  console.log('\n═══════════════════════════════════════════════════════');
  console.log('  Test Results');
  console.log('═══════════════════════════════════════════════════════');

  results.forEach(result => {
    const icon = result.passed ? '✓' : '✗';
    console.log(`${icon} ${result.name}`);
  });

  const passedCount = results.filter(r => r.passed).length;
  const totalCount = results.length;

  console.log('\n═══════════════════════════════════════════════════════');
  console.log(`  ${passedCount}/${totalCount} tests passed`);
  console.log('═══════════════════════════════════════════════════════\n');

  return passedCount === totalCount;
}

// ============================================================================
// EXECUTE TESTS
// ============================================================================

if (require.main === module) {
  const success = runAllTests();
  process.exit(success ? 0 : 1);
}

export { runAllTests };
