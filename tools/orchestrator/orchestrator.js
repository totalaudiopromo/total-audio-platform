#!/usr/bin/env node

/**
 * Total Audio Orchestrator v3
 * Multi-agent execution engine for rapid development
 *
 * Usage:
 *   tado "fix the automations page styling"
 *   tado refactor "extract shared components"
 *   tado audit "check for type errors"
 *   tado ship "add dark mode toggle"
 */

const fs = require('fs');
const path = require('path');
const { execSync, spawn } = require('child_process');

// Load manifest
const manifestPath = path.join(__dirname, 'orchestrator.manifest.json');
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

// Colours for terminal output
const colours = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

function log(message, colour = 'reset') {
  console.log(`${colours[colour]}${message}${colours.reset}`);
}

function logAgent(agentName, status, message = '') {
  const statusIcon =
    {
      start: '🚀',
      running: '⚡',
      complete: '✅',
      error: '❌',
      skip: '⏭️',
    }[status] || '📍';

  log(`${statusIcon} [${agentName}] ${message}`, status === 'error' ? 'red' : 'cyan');
}

// Safety check - prevent modifications to protected paths
function isProtectedPath(filePath) {
  return manifest.protectedPaths.some(pattern => {
    const regex = new RegExp(pattern.replace('*', '.*'));
    return regex.test(filePath);
  });
}

// Parse command line arguments
function parseArgs() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    showHelp();
    process.exit(0);
  }

  // Check for workflow command
  const workflows = Object.keys(manifest.workflows);
  const firstArg = args[0].toLowerCase();

  if (workflows.includes(firstArg)) {
    return {
      workflow: firstArg,
      task: args.slice(1).join(' '),
      dryRun: args.includes('--dry-run') || manifest.config.dryRunDefault,
    };
  }

  // Default to 'fix' workflow
  return {
    workflow: 'fix',
    task: args.join(' '),
    dryRun: args.includes('--dry-run') || manifest.config.dryRunDefault,
  };
}

function showHelp() {
  log('\n🎛️  Total Audio Orchestrator v3', 'bright');
  log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'dim');
  log('\nUsage:', 'yellow');
  log('  tado "your task description"');
  log('  tado <workflow> "your task description"');
  log('\nWorkflows:', 'yellow');
  Object.entries(manifest.workflows).forEach(([name, agents]) => {
    log(`  ${name.padEnd(10)} → ${agents.join(' → ')}`, 'dim');
  });
  log('\nExamples:', 'yellow');
  log('  tado "fix typography on dashboard"', 'green');
  log('  tado refactor "extract button component"', 'green');
  log('  tado audit "check accessibility"', 'green');
  log('  tado ship "add export feature"', 'green');
  log('\nOptions:', 'yellow');
  log('  --dry-run    Preview changes without applying');
  log('  --force      Skip safety checks (use with caution)');
  log('');
}

// Execute a single agent
async function executeAgent(agentName, context) {
  const agentConfig = manifest.agents[agentName];
  if (!agentConfig) {
    logAgent(agentName, 'error', 'Agent not found');
    return { success: false, error: 'Agent not found' };
  }

  const agentPath = path.join(__dirname, agentConfig.file);

  // Check if agent file exists
  if (!fs.existsSync(agentPath)) {
    logAgent(agentName, 'skip', 'Agent file not yet implemented');
    return { success: true, skipped: true };
  }

  logAgent(agentName, 'start', agentConfig.purpose);

  try {
    const agent = require(agentPath);
    const result = await agent.execute(context);
    logAgent(agentName, 'complete', result.summary || 'Done');
    return { success: true, result };
  } catch (error) {
    logAgent(agentName, 'error', error.message);
    return { success: false, error: error.message };
  }
}

// Execute a workflow (sequence of agents)
async function executeWorkflow(workflowName, task, options = {}) {
  const agents = manifest.workflows[workflowName];
  if (!agents) {
    log(`❌ Unknown workflow: ${workflowName}`, 'red');
    return;
  }

  log(`\n🎯 Task: "${task}"`, 'bright');
  log(`📋 Workflow: ${workflowName} (${agents.length} agents)`, 'blue');
  log(`🔒 Dry run: ${options.dryRun ? 'Yes' : 'No'}`, options.dryRun ? 'yellow' : 'green');
  log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n', 'dim');

  const context = {
    task,
    workflow: workflowName,
    dryRun: options.dryRun,
    workspace: manifest.workspaceContext,
    protectedPaths: manifest.protectedPaths,
    results: {},
    files: [],
    patches: [],
  };

  const startTime = Date.now();

  for (const agentName of agents) {
    const result = await executeAgent(agentName, context);
    context.results[agentName] = result;

    if (!result.success && !result.skipped) {
      log(`\n⚠️  Workflow stopped due to error in ${agentName}`, 'yellow');
      break;
    }
  }

  const duration = ((Date.now() - startTime) / 1000).toFixed(2);
  log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`, 'dim');
  log(`✨ Completed in ${duration}s`, 'green');

  // Summary
  if (context.patches.length > 0) {
    log(`\n📝 ${context.patches.length} patches generated`, 'cyan');
  }
  if (context.files.length > 0) {
    log(`📁 ${context.files.length} files affected`, 'cyan');
  }
}

// Main entry point
async function main() {
  const { workflow, task, dryRun } = parseArgs();

  if (!task) {
    log('❌ Please provide a task description', 'red');
    showHelp();
    process.exit(1);
  }

  await executeWorkflow(workflow, task, { dryRun });
}

main().catch(error => {
  log(`\n❌ Fatal error: ${error.message}`, 'red');
  process.exit(1);
});
