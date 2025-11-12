#!/usr/bin/env tsx
/**
 * Golden Intelligence Script
 *
 * Purpose: Ingest Golden Verify health checks and @total-audio/testing results
 *          into Supabase for Command Centre dashboard visualization
 *
 * Usage: pnpm tsx scripts/golden-intelligence.ts
 *
 * Data Sources:
 * 1. Golden Verify: test-deployment-*.md files (latest)
 * 2. Testing: reports/component-analysis.json
 *
 * Database Tables:
 * - golden_history: Deployment health checks
 * - testing_results: Component testing results
 */

import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

// =====================================================
// CONFIGURATION
// =====================================================

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('❌ Missing Supabase credentials');
  console.error('   Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// =====================================================
// TYPES
// =====================================================

interface GoldenVerifyResult {
  app: string;
  deploymentId?: string;
  environment: string;
  healthStatus: 'healthy' | 'degraded' | 'down';
  testsPassed: number;
  testsFailed: number;
  uptimePercent?: number;
  lighthousePerformance?: number;
  lighthouseAccessibility?: number;
  lighthouseBestPractices?: number;
  lighthouseSeo?: number;
  avgResponseTimeMs?: number;
  p95ResponseTimeMs?: number;
  healthChecks?: any;
  metadata?: any;
  deployedAt: string;
}

interface TestingResult {
  app: string;
  testSuite: string;
  component?: string;
  filePath?: string;
  testType: 'responsive' | 'accessibility' | 'performance' | 'touch-targets' | 'integration';
  passed: boolean;
  durationMs?: number;
  issuesFound: number;
  issuesFixed: number;
  issuesData?: any;
  testOutput?: any;
  errorMessage?: string;
  executedAt: string;
}

// =====================================================
// HELPER FUNCTIONS
// =====================================================

/**
 * Find the latest test-deployment-*.md file
 */
function findLatestGoldenVerifyFile(): string | null {
  const rootDir = path.join(__dirname, '..');
  const files = fs.readdirSync(rootDir);

  const deploymentFiles = files
    .filter(f => f.startsWith('test-deployment-') && f.endsWith('.md'))
    .map(f => ({
      name: f,
      path: path.join(rootDir, f),
      mtime: fs.statSync(path.join(rootDir, f)).mtime,
    }))
    .sort((a, b) => b.mtime.getTime() - a.mtime.getTime());

  return deploymentFiles.length > 0 ? deploymentFiles[0].path : null;
}

/**
 * Parse test-deployment-*.md file for Golden Verify results
 */
function parseGoldenVerifyFile(filePath: string): GoldenVerifyResult[] {
  const content = fs.readFileSync(filePath, 'utf-8');
  const results: GoldenVerifyResult[] = [];

  // Extract deployment ID from filename
  const filename = path.basename(filePath);
  const deploymentIdMatch = filename.match(/test-deployment-(\d+)/);
  const deploymentId = deploymentIdMatch ? `dpl_${deploymentIdMatch[1]}` : undefined;

  // Parse markdown content for app-specific results
  const appSections = content.split(/^##\s+/m).slice(1); // Split by ## headers

  for (const section of appSections) {
    const lines = section.split('\n');
    const appNameMatch = lines[0].match(/^([A-Za-z\s-]+)/);

    if (!appNameMatch) continue;

    const appName = appNameMatch[1].trim().toLowerCase().replace(/\s+/g, '-');

    // Map app names to database-compatible values
    const appMapping: Record<string, string> = {
      'audio-intel': 'audio-intel',
      intel: 'audio-intel',
      tracker: 'tracker',
      'pitch-generator': 'pitch-generator',
      pitch: 'pitch-generator',
      web: 'web',
      'command-centre': 'command-centre',
    };

    const app = appMapping[appName];
    if (!app) continue;

    // Parse test results
    let testsPassed = 0;
    let testsFailed = 0;
    let healthStatus: 'healthy' | 'degraded' | 'down' = 'healthy';

    // Count checkmarks and X marks
    const checkmarks = (section.match(/✅/g) || []).length;
    const xmarks = (section.match(/❌/g) || []).length;

    testsPassed = checkmarks;
    testsFailed = xmarks;

    // Determine health status
    if (testsFailed === 0) {
      healthStatus = 'healthy';
    } else if (testsFailed <= 2) {
      healthStatus = 'degraded';
    } else {
      healthStatus = 'down';
    }

    results.push({
      app,
      deploymentId,
      environment: 'production',
      healthStatus,
      testsPassed,
      testsFailed,
      uptimePercent: testsFailed === 0 ? 100 : undefined,
      healthChecks: { rawSection: section },
      metadata: { source: filename },
      deployedAt: new Date().toISOString(),
    });
  }

  return results;
}

/**
 * Find component-analysis.json files in reports directory
 */
function findTestingResultFiles(): string[] {
  const reportsDir = path.join(__dirname, '..', 'reports');

  if (!fs.existsSync(reportsDir)) {
    return [];
  }

  const files: string[] = [];

  function searchDir(dir: string) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        searchDir(fullPath);
      } else if (entry.name === 'component-analysis.json') {
        files.push(fullPath);
      }
    }
  }

  searchDir(reportsDir);
  return files;
}

/**
 * Parse component-analysis.json for testing results
 */
function parseTestingResultFile(filePath: string): TestingResult[] {
  const content = fs.readFileSync(filePath, 'utf-8');
  const data = JSON.parse(content);
  const results: TestingResult[] = [];

  // Determine app from file path
  const appMatch = filePath.match(
    /reports\/(audio-intel|tracker|pitch-generator|web|command-centre)/
  );
  const app = appMatch ? appMatch[1] : 'unknown';

  if (!data.files || !Array.isArray(data.files)) {
    return results;
  }

  // Parse each file's results
  for (const file of data.files) {
    const component = file.component || path.basename(file.path, path.extname(file.path));
    const issuesFound = file.issues?.length || 0;
    const issuesFixed = file.issues?.filter((i: any) => i.fixed)?.length || 0;

    // Determine test types from issues
    const testTypes = new Set<TestingResult['testType']>();

    if (file.issues) {
      for (const issue of file.issues) {
        if (issue.type?.includes('responsive') || issue.type?.includes('breakpoint')) {
          testTypes.add('responsive');
        }
        if (issue.type?.includes('accessibility') || issue.type?.includes('aria')) {
          testTypes.add('accessibility');
        }
        if (issue.type?.includes('performance')) {
          testTypes.add('performance');
        }
        if (issue.type?.includes('touch') || issue.type?.includes('target')) {
          testTypes.add('touch-targets');
        }
      }
    }

    // If no specific types, default to responsive
    if (testTypes.size === 0) {
      testTypes.add('responsive');
    }

    // Create a result for each test type
    for (const testType of testTypes) {
      results.push({
        app,
        testSuite: 'component-analyzer',
        component,
        filePath: file.path,
        testType,
        passed: issuesFound === 0 || issuesFound === issuesFixed,
        issuesFound,
        issuesFixed,
        issuesData: file.issues,
        testOutput: file,
        executedAt: new Date().toISOString(),
      });
    }
  }

  return results;
}

// =====================================================
// INGESTION FUNCTIONS
// =====================================================

/**
 * Ingest Golden Verify results into Supabase
 */
async function ingestGoldenVerifyResults(results: GoldenVerifyResult[]) {
  console.log(`📊 Ingesting ${results.length} Golden Verify results...`);

  for (const result of results) {
    const { data, error } = await supabase
      .from('golden_history')
      .insert({
        app: result.app,
        deployment_id: result.deploymentId,
        environment: result.environment,
        health_status: result.healthStatus,
        tests_passed: result.testsPassed,
        tests_failed: result.testsFailed,
        uptime_percent: result.uptimePercent,
        lighthouse_performance: result.lighthousePerformance,
        lighthouse_accessibility: result.lighthouseAccessibility,
        lighthouse_best_practices: result.lighthouseBestPractices,
        lighthouse_seo: result.lighthouseSeo,
        avg_response_time_ms: result.avgResponseTimeMs,
        p95_response_time_ms: result.p95ResponseTimeMs,
        health_checks: result.healthChecks,
        metadata: result.metadata,
        deployed_at: result.deployedAt,
      })
      .select();

    if (error) {
      // Check if it's a duplicate (conflict error)
      if (error.code === '23505') {
        console.log(`   ⚠️  ${result.app}: Duplicate entry (already exists)`);
      } else {
        console.error(`   ❌ ${result.app}: Failed to insert`, error.message);
      }
    } else {
      console.log(
        `   ✅ ${result.app}: Inserted (status: ${result.healthStatus}, passed: ${result.testsPassed}, failed: ${result.testsFailed})`
      );
    }
  }
}

/**
 * Ingest testing results into Supabase
 */
async function ingestTestingResults(results: TestingResult[]) {
  console.log(`📊 Ingesting ${results.length} testing results...`);

  for (const result of results) {
    const { data, error } = await supabase
      .from('testing_results')
      .insert({
        app: result.app,
        test_suite: result.testSuite,
        component: result.component,
        file_path: result.filePath,
        test_type: result.testType,
        passed: result.passed,
        duration_ms: result.durationMs,
        issues_found: result.issuesFound,
        issues_fixed: result.issuesFixed,
        issues_data: result.issuesData,
        test_output: result.testOutput,
        error_message: result.errorMessage,
        executed_at: result.executedAt,
      })
      .select();

    if (error) {
      console.error(`   ❌ ${result.app}/${result.component}: Failed to insert`, error.message);
    } else {
      console.log(
        `   ✅ ${result.app}/${result.component}: Inserted (${result.testType}, passed: ${result.passed}, issues: ${result.issuesFound})`
      );
    }
  }
}

// =====================================================
// MAIN EXECUTION
// =====================================================

async function main() {
  console.log('🚀 Golden Intelligence Script');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('');

  // =====================================================
  // 1. GOLDEN VERIFY RESULTS
  // =====================================================

  console.log('📂 Step 1: Find Golden Verify results...');
  const goldenVerifyFile = findLatestGoldenVerifyFile();

  if (!goldenVerifyFile) {
    console.log('   ⚠️  No test-deployment-*.md files found');
    console.log('');
  } else {
    console.log(`   ✅ Found: ${path.basename(goldenVerifyFile)}`);
    console.log('');

    console.log('📊 Step 2: Parse Golden Verify results...');
    const goldenResults = parseGoldenVerifyFile(goldenVerifyFile);
    console.log(`   ✅ Parsed ${goldenResults.length} app results`);
    console.log('');

    if (goldenResults.length > 0) {
      console.log('💾 Step 3: Ingest Golden Verify results...');
      await ingestGoldenVerifyResults(goldenResults);
      console.log('');
    }
  }

  // =====================================================
  // 2. TESTING RESULTS
  // =====================================================

  console.log('📂 Step 4: Find testing results...');
  const testingFiles = findTestingResultFiles();

  if (testingFiles.length === 0) {
    console.log('   ⚠️  No component-analysis.json files found');
    console.log('');
  } else {
    console.log(`   ✅ Found ${testingFiles.length} testing report(s)`);
    console.log('');

    console.log('📊 Step 5: Parse testing results...');
    const allTestingResults: TestingResult[] = [];

    for (const file of testingFiles) {
      const results = parseTestingResultFile(file);
      allTestingResults.push(...results);
      console.log(
        `   ✅ Parsed ${results.length} results from ${path.basename(path.dirname(file))}`
      );
    }
    console.log('');

    if (allTestingResults.length > 0) {
      console.log('💾 Step 6: Ingest testing results...');
      await ingestTestingResults(allTestingResults);
      console.log('');
    }
  }

  // =====================================================
  // SUMMARY
  // =====================================================

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('✅ Golden Intelligence ingestion complete');
  console.log('');
  console.log('🎯 Next steps:');
  console.log('   1. View results in Command Centre: /ops-console/golden');
  console.log('   2. Run Supabase queries to verify data');
  console.log('   3. Integrate with golden-verify.yml workflow');
  console.log('');
}

// Run the script
main().catch(error => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});
