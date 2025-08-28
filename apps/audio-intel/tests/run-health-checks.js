const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

async function runHealthChecks() {
  console.log('🔍 Starting comprehensive health checks for Total Audio Promo domains...\n');
  
  const results = {
    intel: {},
    pulse: {},
    summary: {
      totalTests: 0,
      passedTests: 0,
      failedTests: 0,
      errors: []
    }
  };

  // Test Intel domain
  console.log('📊 Testing intel.totalaudiopromo.com...');
  try {
    const intelOutput = execSync('npx playwright test health-check.spec.ts --reporter=json', {
      cwd: path.join(__dirname),
      encoding: 'utf8'
    });
    
    const intelResults = JSON.parse(intelOutput);
    results.intel = intelResults;
    results.summary.totalTests += intelResults.suites?.[0]?.specs?.length || 0;
    
    console.log(`✅ Intel tests completed: ${intelResults.suites?.[0]?.specs?.length || 0} tests`);
  } catch (error) {
    console.log('❌ Intel tests failed:', error.message);
    results.summary.errors.push(`Intel: ${error.message}`);
  }

  // Test Pulse domain
  console.log('\n📊 Testing pulse.totalaudiopromo.com...');
  try {
    const pulseOutput = execSync('npx playwright test health-check.spec.ts --reporter=json', {
      cwd: path.join(__dirname, '../playlist-pulse'),
      encoding: 'utf8'
    });
    
    const pulseResults = JSON.parse(pulseOutput);
    results.pulse = pulseResults;
    results.summary.totalTests += pulseResults.suites?.[0]?.specs?.length || 0;
    
    console.log(`✅ Pulse tests completed: ${pulseResults.suites?.[0]?.specs?.length || 0} tests`);
  } catch (error) {
    console.log('❌ Pulse tests failed:', error.message);
    results.summary.errors.push(`Pulse: ${error.message}`);
  }

  // Generate detailed report
  generateReport(results);
  
  return results;
}

function generateReport(results) {
  console.log('\n📋 Generating comprehensive health check report...\n');
  
  const report = {
    timestamp: new Date().toISOString(),
    domains: {
      intel: {
        url: 'https://intel.totalaudiopromo.com',
        status: results.intel.suites ? 'tested' : 'failed',
        tests: results.intel.suites?.[0]?.specs || [],
        errors: results.summary.errors.filter(e => e.includes('Intel'))
      },
      pulse: {
        url: 'https://pulse.totalaudiopromo.com',
        status: results.pulse.suites ? 'tested' : 'failed',
        tests: results.pulse.suites?.[0]?.specs || [],
        errors: results.summary.errors.filter(e => e.includes('Pulse'))
      }
    },
    recommendations: []
  };

  // Analyze results and generate recommendations
  if (results.intel.suites) {
    const intelTests = results.intel.suites[0]?.specs || [];
    const failedIntelTests = intelTests.filter(test => test.tests?.[0]?.results?.[0]?.status === 'failed');
    
    if (failedIntelTests.length > 0) {
      report.recommendations.push({
        domain: 'intel',
        issue: `${failedIntelTests.length} tests failed`,
        tests: failedIntelTests.map(test => test.title)
      });
    }
  }

  if (results.pulse.suites) {
    const pulseTests = results.pulse.suites[0]?.specs || [];
    const failedPulseTests = pulseTests.filter(test => test.tests?.[0]?.results?.[0]?.status === 'failed');
    
    if (failedPulseTests.length > 0) {
      report.recommendations.push({
        domain: 'pulse',
        issue: `${failedPulseTests.length} tests failed`,
        tests: failedPulseTests.map(test => test.title)
      });
    }
  }

  // Save report
  const reportPath = path.join(__dirname, 'health-check-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  
  console.log('📄 Report saved to:', reportPath);
  console.log('\n🎯 Summary:');
  console.log(`Total tests: ${results.summary.totalTests}`);
  console.log(`Errors: ${results.summary.errors.length}`);
  console.log(`Recommendations: ${report.recommendations.length}`);
  
  if (report.recommendations.length > 0) {
    console.log('\n⚠️  Issues found:');
    report.recommendations.forEach(rec => {
      console.log(`- ${rec.domain}: ${rec.issue}`);
    });
  } else {
    console.log('\n✅ All tests passed! Both domains are healthy.');
  }
}

// Run the health checks
if (require.main === module) {
  runHealthChecks().catch(console.error);
}

module.exports = { runHealthChecks, generateReport }; 