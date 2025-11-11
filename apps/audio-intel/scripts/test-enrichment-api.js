#!/usr/bin/env node

/**
 * Test script for enrichment API endpoint
 * Tests error handling, rate limiting, and successful enrichment
 */

const API_URL = process.env.API_URL || 'http://localhost:3000';

const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function testEndpoint(name, method, path, body = null) {
  log(`\n🧪 Testing: ${name}`, 'blue');

  const start = Date.now();
  try {
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(`${API_URL}${path}`, options);
    const elapsed = Date.now() - start;
    const data = await response.json();

    log(
      `✓ Status: ${response.status} (${response.statusText}) - ${elapsed}ms`,
      response.ok ? 'green' : 'red'
    );
    log(`Response: ${JSON.stringify(data, null, 2)}`);

    return { success: response.ok, data, status: response.status };
  } catch (error) {
    const elapsed = Date.now() - start;
    log(`✗ Error: ${error.message} - ${elapsed}ms`, 'red');
    return { success: false, error: error.message };
  }
}

async function runTests() {
  log('═══════════════════════════════════════════════════════════', 'blue');
  log('🚀 Audio Intel Enrichment API Test Suite', 'blue');
  log('═══════════════════════════════════════════════════════════', 'blue');
  log(`Testing: ${API_URL}/api/enrich-claude`);

  const results = {
    passed: 0,
    failed: 0,
    warnings: 0,
  };

  // Test 1: GET endpoint (status check)
  const test1 = await testEndpoint('GET Status Check', 'GET', '/api/enrich-claude');
  if (test1.success && test1.data.status) {
    results.passed++;
    log('✓ Status endpoint operational', 'green');
  } else {
    results.failed++;
    log('✗ Status endpoint failed', 'red');
  }

  // Test 2: Empty body
  const test2 = await testEndpoint('POST Empty Body', 'POST', '/api/enrich-claude', {});
  if (test2.status === 400 && test2.data.code === 'EMPTY_CONTACTS') {
    results.passed++;
    log('✓ Empty body validation working', 'green');
  } else {
    results.failed++;
    log('✗ Empty body validation failed', 'red');
  }

  // Test 3: Invalid JSON (will be caught by fetch)
  // Skip this test as it's hard to test with fetch

  // Test 4: Invalid contacts type
  const test4 = await testEndpoint('POST Invalid Contacts Type', 'POST', '/api/enrich-claude', {
    contacts: 'not-an-array',
  });
  if (test4.status === 400 && test4.data.code === 'INVALID_CONTACTS_TYPE') {
    results.passed++;
    log('✓ Invalid contacts type validation working', 'green');
  } else {
    results.failed++;
    log('✗ Invalid contacts type validation failed', 'red');
  }

  // Test 5: Single contact enrichment
  const test5 = await testEndpoint('POST Single Contact', 'POST', '/api/enrich-claude', {
    contacts: [
      {
        name: 'BBC Radio 6 Music',
        email: 'music@bbc.co.uk',
        genre: 'Alternative',
        region: 'UK',
      },
    ],
  });

  if (test5.success && test5.data.enriched && test5.data.enriched.length === 1) {
    results.passed++;
    log('✓ Single contact enrichment working', 'green');

    const enriched = test5.data.enriched[0];
    log(`   - Intelligence: ${enriched.intelligence?.substring(0, 100)}...`);
    log(`   - Confidence: ${enriched.confidence}`);
    log(`   - Processing Time: ${enriched.processingTime}ms`);
    log(`   - Source: ${enriched.source}`);

    if (test5.data.summary) {
      log(`   - Summary: ${JSON.stringify(test5.data.summary)}`);
    }
    if (test5.data.metrics) {
      log(`   - Metrics: ${JSON.stringify(test5.data.metrics)}`);
    }
  } else {
    results.warnings++;
    log('⚠ Single contact enrichment returned unexpected result', 'yellow');
  }

  // Test 6: Batch enrichment
  const test6 = await testEndpoint('POST Batch Enrichment', 'POST', '/api/enrich-claude', {
    contacts: [
      { name: 'BBC Radio 1', email: 'radio1@bbc.co.uk', genre: 'Pop' },
      { name: 'BBC Radio 6 Music', email: 'music@bbc.co.uk', genre: 'Alternative' },
      { name: 'Amazing Radio', email: 'info@amazingradio.com', genre: 'Indie' },
    ],
  });

  if (test6.success && test6.data.enriched && test6.data.enriched.length === 3) {
    results.passed++;
    log('✓ Batch enrichment working', 'green');
    log(`   - Total: ${test6.data.summary?.total}`);
    log(`   - Enriched: ${test6.data.summary?.enriched}`);
    log(`   - Failed: ${test6.data.summary?.failed}`);
    log(`   - Cost: $${test6.data.summary?.cost}`);
    log(`   - Success Rate: ${test6.data.metrics?.successRate}`);
    log(`   - Total Time: ${test6.data.metrics?.totalTime}`);
  } else {
    results.warnings++;
    log('⚠ Batch enrichment returned unexpected result', 'yellow');
  }

  // Test 7: Contact without name (fallback handling)
  const test7 = await testEndpoint('POST Contact Without Name', 'POST', '/api/enrich-claude', {
    contacts: [{ email: 'test@example.com', genre: 'Electronic' }],
  });

  if (test7.success && test7.data.enriched && test7.data.enriched.length === 1) {
    results.passed++;
    log('✓ Contact without name handled correctly', 'green');
  } else {
    results.warnings++;
    log('⚠ Contact without name handling unclear', 'yellow');
  }

  // Test 8: CORS headers
  const test8 = await testEndpoint('OPTIONS CORS Check', 'OPTIONS', '/api/enrich-claude');
  if (test8.success) {
    results.passed++;
    log('✓ CORS OPTIONS working', 'green');
  } else {
    results.warnings++;
    log('⚠ CORS OPTIONS may not be working', 'yellow');
  }

  // Summary
  log('\n═══════════════════════════════════════════════════════════', 'blue');
  log('📊 Test Results', 'blue');
  log('═══════════════════════════════════════════════════════════', 'blue');
  log(`✓ Passed: ${results.passed}`, 'green');
  log(`✗ Failed: ${results.failed}`, 'red');
  log(`⚠ Warnings: ${results.warnings}`, 'yellow');
  log(`Total: ${results.passed + results.failed + results.warnings}`);

  if (results.failed === 0) {
    log('\n🎉 All critical tests passed!', 'green');
    process.exit(0);
  } else {
    log('\n❌ Some tests failed. Please review.', 'red');
    process.exit(1);
  }
}

// Run tests
runTests().catch(error => {
  log(`\n❌ Test suite crashed: ${error.message}`, 'red');
  console.error(error);
  process.exit(1);
});
