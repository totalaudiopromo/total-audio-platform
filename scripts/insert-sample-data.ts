#!/usr/bin/env tsx
/**
 * Insert sample data into golden_history and testing_results tables
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function insertSampleData() {
  console.log('🚀 Inserting sample data...\n');

  // Insert Golden Verify sample data
  const goldenData = [
    {
      app: 'audio-intel',
      deployment_id: 'dpl_test_001',
      environment: 'production',
      health_status: 'healthy',
      tests_passed: 42,
      tests_failed: 0,
      uptime_percent: 99.95,
      lighthouse_performance: 95,
      lighthouse_accessibility: 98,
      lighthouse_best_practices: 92,
      lighthouse_seo: 100,
      avg_response_time_ms: 120,
      p95_response_time_ms: 250,
      deployed_at: new Date(Date.now() - 60 * 60 * 1000).toISOString(), // 1 hour ago
    },
    {
      app: 'tracker',
      deployment_id: 'dpl_test_002',
      environment: 'production',
      health_status: 'healthy',
      tests_passed: 38,
      tests_failed: 1,
      uptime_percent: 99.9,
      lighthouse_performance: 92,
      lighthouse_accessibility: 96,
      lighthouse_best_practices: 90,
      lighthouse_seo: 98,
      avg_response_time_ms: 150,
      p95_response_time_ms: 300,
      deployed_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    },
    {
      app: 'pitch-generator',
      deployment_id: 'dpl_test_003',
      environment: 'production',
      health_status: 'degraded',
      tests_passed: 35,
      tests_failed: 3,
      uptime_percent: 98.5,
      lighthouse_performance: 88,
      lighthouse_accessibility: 94,
      lighthouse_best_practices: 88,
      lighthouse_seo: 95,
      avg_response_time_ms: 200,
      p95_response_time_ms: 450,
      deployed_at: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), // 3 hours ago
    },
  ];

  console.log('📊 Inserting Golden Verify data...');
  const { data: goldenResult, error: goldenError } = await supabase
    .from('golden_history')
    .insert(goldenData)
    .select();

  if (goldenError) {
    console.error('❌ Error inserting Golden Verify data:', goldenError.message);
  } else {
    console.log(`✅ Inserted ${goldenResult?.length || 0} Golden Verify records\n`);
  }

  // Insert Testing sample data
  const testingData = [
    {
      app: 'audio-intel',
      test_suite: 'component-analyzer',
      component: 'HeroDemo',
      test_type: 'responsive',
      passed: true,
      issues_found: 0,
      issues_fixed: 0,
      duration_ms: 1250,
      executed_at: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 mins ago
    },
    {
      app: 'audio-intel',
      test_suite: 'component-analyzer',
      component: 'DashboardCard',
      test_type: 'accessibility',
      passed: true,
      issues_found: 2,
      issues_fixed: 2,
      duration_ms: 980,
      executed_at: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    },
    {
      app: 'tracker',
      test_suite: 'playwright-mobile',
      component: 'CampaignCard',
      test_type: 'touch-targets',
      passed: true,
      issues_found: 0,
      issues_fixed: 0,
      duration_ms: 2400,
      executed_at: new Date(Date.now() - 60 * 60 * 1000).toISOString(), // 1 hour ago
    },
    {
      app: 'tracker',
      test_suite: 'component-analyzer',
      component: 'MobileNav',
      test_type: 'responsive',
      passed: false,
      issues_found: 3,
      issues_fixed: 0,
      duration_ms: 1100,
      executed_at: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    },
    {
      app: 'pitch-generator',
      test_suite: 'component-analyzer',
      component: 'PitchForm',
      test_type: 'performance',
      passed: true,
      issues_found: 1,
      issues_fixed: 1,
      duration_ms: 1800,
      executed_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    },
  ];

  console.log('🧪 Inserting Testing data...');
  const { data: testingResult, error: testingError } = await supabase
    .from('testing_results')
    .insert(testingData)
    .select();

  if (testingError) {
    console.error('❌ Error inserting Testing data:', testingError.message);
  } else {
    console.log(`✅ Inserted ${testingResult?.length || 0} Testing records\n`);
  }

  console.log('✅ Sample data insertion complete!');
}

insertSampleData();
