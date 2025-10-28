#!/usr/bin/env node

/**
 * Test Dan's core orchestration capabilities
 * Bypasses agent dependencies to verify orchestrator logic
 */

const path = require('path');
const fs = require('fs');

console.log('🧪 Testing Dan - Core Orchestrator Functionality\n');

// Mock agent classes to bypass missing dependencies
class MockAgent {
  constructor(options = {}) {
    this.name = options.name || 'MockAgent';
    this.logger = options.logger || console.log;
  }

  async initialize() {
    this.logger(`✓ ${this.name} initialized (mock)`);
    return true;
  }

  async healthCheck() {
    return {
      status: 'healthy',
      agent: this.name,
      mock: true,
      timestamp: new Date().toISOString()
    };
  }

  async processTranscript(data) {
    return {
      artist: data.artist || 'Test Artist',
      track: data.track || 'Test Track',
      genre: 'Electronic',
      processed: true
    };
  }

  async createCampaign(data) {
    return {
      campaignId: `camp_${Date.now()}`,
      created: true,
      artist: data.artist
    };
  }

  async generateContent(data) {
    return {
      content: `Generated content for ${data.artist}`,
      template: 'liberty-standard'
    };
  }

  async initiateSubmissions(data) {
    return {
      submitted: 5,
      stations: ['BBC Radio 1', 'Radio X', 'Kerrang!']
    };
  }

  async setupTracking(data) {
    return {
      trackingId: `track_${Date.now()}`,
      warmApiEnabled: true
    };
  }

  async generateInitialReport(data) {
    return {
      reportUrl: 'https://reports.example.com/12345',
      format: 'PDF'
    };
  }

  async shutdown() {
    this.logger(`✓ ${this.name} shutdown complete (mock)`);
    return true;
  }
}

// Patch require to provide mocked agents
const Module = require('module');
const originalRequire = Module.prototype.require;

Module.prototype.require = function(id) {
  // Mock all agent imports
  if (id.includes('intelligence-agent')) {
    return class IntelligenceAgent extends MockAgent {
      constructor(options) {
        super({ ...options, name: 'Intelligence' });
      }
    };
  }
  if (id.includes('project-agent')) {
    return class ProjectAgent extends MockAgent {
      constructor(options) {
        super({ ...options, name: 'Project' });
      }
    };
  }
  if (id.includes('email-agent')) {
    return class EmailAgent extends MockAgent {
      constructor(options) {
        super({ ...options, name: 'Email' });
      }
    };
  }
  if (id.includes('radio-agent')) {
    return class RadioAgent extends MockAgent {
      constructor(options) {
        super({ ...options, name: 'Radio' });
      }
    };
  }
  if (id.includes('analytics-agent')) {
    return class AnalyticsAgent extends MockAgent {
      constructor(options) {
        super({ ...options, name: 'Analytics' });
      }
    };
  }
  if (id.includes('coverage-agent')) {
    return class CoverageAgent extends MockAgent {
      constructor(options) {
        super({ ...options, name: 'Coverage' });
      }
    };
  }
  if (id.includes('followup-agent')) {
    return class FollowupAgent extends MockAgent {
      constructor(options) {
        super({ ...options, name: 'Followup' });
      }
    };
  }

  // Mock configuration imports
  if (id.includes('liberty-templates')) {
    return class LibertyTemplates {};
  }
  if (id.includes('radio-stations')) {
    return class RadioStations {};
  }
  if (id.includes('warm-config')) {
    return class WarmConfig {};
  }

  // Mock integration imports
  if (id.includes('gmail-typeform-matcher')) {
    return class GmailTypeformMatcher {
      async findLibertyCampaigns() {
        return { totalMatches: 0 };
      }
    };
  }

  // Pass through everything else
  return originalRequire.apply(this, arguments);
};

// Now require Dan with mocked dependencies
const Dan = require('./dan.js');

async function runTests() {
  const testResults = {
    passed: 0,
    failed: 0,
    tests: []
  };

  function test(name, fn) {
    return async () => {
      try {
        console.log(`\n📋 Test: ${name}`);
        await fn();
        console.log(`✅ PASSED: ${name}`);
        testResults.passed++;
        testResults.tests.push({ name, status: 'passed' });
      } catch (error) {
        console.error(`❌ FAILED: ${name}`);
        console.error(`   Error: ${error.message}`);
        testResults.failed++;
        testResults.tests.push({ name, status: 'failed', error: error.message });
      }
    };
  }

  // Test 1: Dan initialization
  await test('Dan Initialization', async () => {
    const dan = new Dan();
    const result = await dan.initialize();

    if (!result || result.status !== 'ready') {
      throw new Error('Dan initialization failed');
    }
    if (result.agents !== 6) {
      throw new Error(`Expected 6 agents, got ${result.agents}`);
    }

    console.log(`   ✓ Dan initialized successfully`);
    console.log(`   ✓ ${result.agents} agents ready`);
    console.log(`   ✓ ${result.workflows} workflows available`);

    await dan.shutdown();
  })();

  // Test 2: Health check
  await test('Health Check', async () => {
    const dan = new Dan();
    await dan.initialize();

    const health = await dan.healthCheck();

    if (health.status !== 'healthy') {
      throw new Error(`Health check status: ${health.status}`);
    }

    const agentCount = Object.keys(health.agents).length;
    console.log(`   ✓ System health: ${health.status}`);
    console.log(`   ✓ ${agentCount} agents checked`);

    await dan.shutdown();
  })();

  // Test 3: Workflow execution
  await test('Workflow Execution (transcript-to-brief)', async () => {
    const dan = new Dan();
    await dan.initialize();

    const campaignData = {
      artist: 'Senior Dunce',
      track: 'Test Track',
      transcriptFile: 'mock-transcript.txt'
    };

    const result = await dan.executeWorkflow('transcript-to-brief', campaignData);

    if (!result || result.status !== 'completed') {
      throw new Error('Workflow execution failed');
    }

    console.log(`   ✓ Workflow completed in ${result.actualTime} minutes`);
    console.log(`   ✓ Success rate: ${result.successRate}%`);
    console.log(`   ✓ Campaign ID: ${result.campaignId}`);

    await dan.shutdown();
  })();

  // Test 4: Campaign tracking
  await test('Campaign State Management', async () => {
    const dan = new Dan();
    await dan.initialize();

    const campaignData = {
      artist: 'Test Artist',
      track: 'Test Track'
    };

    await dan.executeWorkflow('transcript-to-brief', campaignData);

    const campaigns = Array.from(dan.campaigns.values());
    if (campaigns.length === 0) {
      throw new Error('No campaigns tracked');
    }

    console.log(`   ✓ ${campaigns.length} campaign(s) tracked`);
    console.log(`   ✓ Campaign state persisted`);

    await dan.shutdown();
  })();

  // Test 5: Metrics tracking
  await test('Metrics Tracking', async () => {
    const dan = new Dan();
    await dan.initialize();

    const campaignData = { artist: 'Test', track: 'Test' };
    await dan.executeWorkflow('transcript-to-brief', campaignData);

    const metrics = dan.metrics;

    if (metrics.campaignsProcessed === 0) {
      throw new Error('Campaigns not counted in metrics');
    }

    console.log(`   ✓ Campaigns processed: ${metrics.campaignsProcessed}`);
    console.log(`   ✓ Time reduction tracked: ${metrics.totalTimeReduction} hours`);
    console.log(`   ✓ Success rate: ${metrics.successRate}%`);

    await dan.shutdown();
  })();

  // Test 6: Available workflows
  await test('Workflow Availability', async () => {
    const dan = new Dan();
    await dan.initialize();

    const workflows = Object.keys(dan.workflows);
    const expectedWorkflows = [
      'complete-campaign',
      'transcript-to-brief',
      'warm-monitoring',
      'campaign-reporting'
    ];

    const missing = expectedWorkflows.filter(w => !workflows.includes(w));
    if (missing.length > 0) {
      throw new Error(`Missing workflows: ${missing.join(', ')}`);
    }

    console.log(`   ✓ ${workflows.length} workflows available:`);
    workflows.forEach(w => {
      const workflow = dan.workflows[w];
      console.log(`     - ${w}: ${workflow.estimatedTime}min`);
    });

    await dan.shutdown();
  })();

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 Test Summary');
  console.log('='.repeat(60));
  console.log(`Total Tests: ${testResults.passed + testResults.failed}`);
  console.log(`✅ Passed: ${testResults.passed}`);
  console.log(`❌ Failed: ${testResults.failed}`);
  console.log('='.repeat(60));

  if (testResults.failed === 0) {
    console.log('\n🎉 All tests passed! Dan is operational.\n');
    console.log('✨ Next steps:');
    console.log('   1. Install missing dependencies (puppeteer, etc.)');
    console.log('   2. Configure environment variables (.env)');
    console.log('   3. Run: node dan.js health');
    console.log('   4. Start dashboard: node dan.js dashboard\n');
  } else {
    console.log('\n⚠️  Some tests failed. Review errors above.\n');
    process.exit(1);
  }
}

runTests().catch(error => {
  console.error('\n💥 Test suite crashed:', error);
  process.exit(1);
});
