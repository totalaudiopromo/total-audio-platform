#!/usr/bin/env node

/**
 * Unified Agent Launcher - 10X Workflow Entry Point
 * Single command to access all your agents and workflows
 */

const { execSync } = require('child_process');
const path = require('path');

const AGENTS = {
  // Agent OS Dashboard
  dashboard: 'agent-os-dashboard.js',
  health: 'agent-os-dashboard.js health',

  // TDD Workflow
  'tdd-plan': 'active/total-audio-tdd-orchestrator.js plan',
  'tdd-build': 'active/total-audio-tdd-orchestrator.js build',
  'tdd-quick': 'active/total-audio-tdd-orchestrator.js quick',
  'tdd-status': 'active/total-audio-tdd-orchestrator.js status',

  // Testing
  'test-write': 'active/tdd/tdd-test-writer.js write',
  'test-quick': 'active/tdd/tdd-test-writer.js quick',

  // Content & Marketing
  newsletter: 'core-agents/content/newsletter-automation-agent.js',
  social: 'core-agents/content/social-media-agent.js',
  'social-media': 'core-agents/content/social-media-agent.js',
  news: 'core-agents/content/newsjacking-agent.js',
  newsjacking: 'core-agents/content/newsjacking-agent.js',

  // Business Operations
  analytics: 'core-agents/business/analytics-agent.js',
  marketing: 'core-agents/business/chris-saas-marketing-agent.js',
  'chris-marketing': 'core-agents/business/chris-saas-marketing-agent.js',
  agency: 'core-agents/business/agency-agent.js',

  // Technical Infrastructure
  contact: 'core-agents/technical/contact-agent.js',
  database: 'core-agents/technical/database-agent.js',
  'agent-manager': 'core-agents/technical/agent-manager.js',

  // Radio Promotion
  radio: 'core-agents/radio-promo/radio-promo-agent.js',
  'radio-promo': 'core-agents/radio-promo/radio-promo-agent.js',
  campaign: 'core-agents/radio-promo/campaign-agent.js',

  // System Utilities
  'gmail-setup': 'gmail-setup/gmail-liberty-setup.js',
};

function showHelp() {
  console.log('\n╔════════════════════════════════════════════════════════════════╗');
  console.log('║              AGENT OS UNIFIED LAUNCHER v2.0                    ║');
  console.log('╚════════════════════════════════════════════════════════════════╝');
  console.log('\nUsage: node unified-launcher.js <command> [args...]');
  console.log('');
  console.log('🎯 QUICK START:');
  console.log('  dashboard              Visual Agent OS dashboard with all agents');
  console.log('  health                 System health check');
  console.log('');
  console.log('🧪 TDD WORKFLOWS (Development):');
  console.log('  tdd-plan "feature"     Plan feature with mobile-first TDD');
  console.log('  tdd-build "feature"    Build feature using TDD specs');
  console.log('  tdd-status             Show all feature development status');
  console.log('');
  console.log('🎯 CUSTOMER ACQUISITION:');
  console.log('  newsletter             "The Unsigned Advantage" generation');
  console.log('  social-media           Cross-platform social content');
  console.log('  newsjacking            AI-powered news analysis');
  console.log('  chris-marketing        Audio Intel marketing strategy');
  console.log('');
  console.log('📊 BUSINESS INTELLIGENCE:');
  console.log('  analytics              Customer acquisition metrics');
  console.log('  agency                 Agency partnership management');
  console.log('');
  console.log('⚙️  TECHNICAL:');
  console.log('  contact                Contact database management');
  console.log('  database               Database operations');
  console.log('  agent-manager          Agent coordination');
  console.log('');
  console.log('📻 RADIO PROMOTION:');
  console.log('  radio-promo            Radio campaign management');
  console.log('');
  console.log('🔧 UTILITIES:');
  console.log('  gmail-setup            Gmail automation setup');
  console.log('');
  console.log('Examples:');
  console.log('  node unified-launcher.js dashboard');
  console.log('  node unified-launcher.js tdd-plan "contact filtering" audiointel');
  console.log('  node unified-launcher.js newsletter generate');
  console.log('  node unified-launcher.js health');
}

function runAgent(workflow, args) {
  const agentPath = AGENTS[workflow];
  if (!agentPath) {
    console.error(`❌ Unknown workflow: ${workflow}`);
    console.log('Run "node unified-launcher.js" to see available workflows');
    process.exit(1);
  }

  const fullPath = path.join(__dirname, agentPath);
  const command = `node ${fullPath} ${args.join(' ')}`;

  console.log(`🚀 Running workflow: ${workflow}`);
  console.log(`📂 Command: ${command}`);
  console.log('');

  try {
    execSync(command, { stdio: 'inherit', cwd: __dirname });
  } catch (error) {
    console.error(`❌ Workflow failed: ${error.message}`);
    process.exit(1);
  }
}

// CLI Interface
const [, , workflow, ...args] = process.argv;

if (!workflow) {
  showHelp();
  process.exit(0);
}

runAgent(workflow, args);
