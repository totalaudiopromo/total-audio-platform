#!/usr/bin/env tsx
/**
 * List decisions with filtering
 * Usage: npx tsx .claude/workflow/sessions/list-decisions.ts [options]
 */

import { readDecisions, getSessionDecisions } from './logger';
import type { Decision } from './types';

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  green: '\x1b[32m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  gray: '\x1b[90m',
};

function parseArgs(): { date?: string; sessionId?: string; limit: number } {
  const args = process.argv.slice(2);
  let date: string | undefined;
  let sessionId: string | undefined;
  let limit = 20;

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    if (arg === '--date' && args[i + 1]) {
      date = args[i + 1];
      i++;
    } else if (arg === '--session' && args[i + 1]) {
      sessionId = args[i + 1];
      i++;
    } else if (arg === '--limit' && args[i + 1]) {
      limit = parseInt(args[i + 1], 10);
      i++;
    }
  }

  // Default to today if no filter
  if (!date && !sessionId) {
    date = new Date().toISOString().split('T')[0];
  }

  return { date, sessionId, limit };
}

function formatDecision(decision: Decision): string {
  const time = new Date(decision.timestamp).toLocaleTimeString();
  const impactColor = decision.impact === 'high' ? colors.red : decision.impact === 'medium' ? colors.yellow : colors.green;

  return `${colors.gray}${time}${colors.reset} ${impactColor}[${decision.impact?.toUpperCase()}]${colors.reset} ${colors.cyan}${decision.type}${colors.reset}: ${decision.title}`;
}

function main() {
  const { date, sessionId, limit } = parseArgs();

  console.log(`${colors.cyan}\n📋 Decision History${colors.reset}\n`);

  let decisions: Decision[];

  if (sessionId) {
    console.log(`Session: ${sessionId}\n`);
    decisions = getSessionDecisions(sessionId);
  } else if (date) {
    console.log(`Date: ${date}\n`);
    decisions = readDecisions(date);
  } else {
    decisions = [];
  }

  if (decisions.length === 0) {
    console.log(`${colors.yellow}No decisions found${colors.reset}\n`);
    return;
  }

  console.log(`${colors.gray}Showing ${Math.min(limit, decisions.length)} of ${decisions.length} decisions:${colors.reset}\n`);

  decisions.slice(0, limit).forEach(decision => {
    console.log(formatDecision(decision));
    console.log(`  ${colors.gray}${decision.description}${colors.reset}`);
    if (decision.reasoning && decision.reasoning !== 'See context') {
      console.log(`  ${colors.gray}Reasoning: ${decision.reasoning}${colors.reset}`);
    }
    console.log('');
  });

  if (decisions.length > limit) {
    console.log(`${colors.gray}... and ${decisions.length - limit} more${colors.reset}\n`);
  }
}

if (require.main === module) {
  main();
}
