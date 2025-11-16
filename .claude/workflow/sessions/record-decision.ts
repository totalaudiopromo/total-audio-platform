#!/usr/bin/env tsx
/**
 * Record a decision
 * Usage: npx tsx .claude/workflow/sessions/record-decision.ts [options]
 */

import { logDecision } from './logger';
import type { Decision } from './types';

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  cyan: '\x1b[36m',
  yellow: '\x1b[33m',
};

function parseArgs(): Omit<Decision, 'id' | 'timestamp' | 'sessionId'> {
  const args = process.argv.slice(2);

  let type: Decision['type'] = 'implementation';
  let title = '';
  let description = '';
  let reasoning = '';
  let impact: Decision['impact'] = 'medium';

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    if (arg === '--type' && args[i + 1]) {
      type = args[i + 1] as Decision['type'];
      i++;
    } else if (arg === '--title' && args[i + 1]) {
      title = args[i + 1];
      i++;
    } else if (arg === '--description' && args[i + 1]) {
      description = args[i + 1];
      i++;
    } else if (arg === '--reasoning' && args[i + 1]) {
      reasoning = args[i + 1];
      i++;
    } else if (arg === '--impact' && args[i + 1]) {
      impact = args[i + 1] as Decision['impact'];
      i++;
    }
  }

  if (!title) {
    console.error(`${colors.yellow}Error: --title is required${colors.reset}`);
    process.exit(1);
  }

  return {
    type,
    title,
    description: description || title,
    reasoning: reasoning || 'See context',
    impact,
  };
}

function main() {
  try {
    const decision = parseArgs();
    const logged = logDecision(decision);

    console.log(`${colors.green}✅ Decision recorded${colors.reset}\n`);
    console.log(`${colors.cyan}ID:${colors.reset} ${logged.id}`);
    console.log(`${colors.cyan}Session:${colors.reset} ${logged.sessionId}`);
    console.log(`${colors.cyan}Type:${colors.reset} ${logged.type}`);
    console.log(`${colors.cyan}Title:${colors.reset} ${logged.title}`);
    console.log(`${colors.cyan}Impact:${colors.reset} ${logged.impact}`);
    console.log('');

    process.exit(0);
  } catch (error) {
    console.error(`${colors.yellow}Error recording decision:${colors.reset}`, error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}
