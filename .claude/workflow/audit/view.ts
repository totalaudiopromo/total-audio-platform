#!/usr/bin/env tsx
/**
 * View audit logs with filtering
 * Usage: pnpm tsx .claude/workflow/audit/view.ts [options]
 * Options:
 *   --date YYYY-MM-DD   Filter by date (default: today)
 *   --tool TOOL_NAME    Filter by tool
 *   --session SESSION   Filter by session ID
 *   --limit N           Limit results (default: 20)
 */

import { readAuditLog } from './logger';
import type { AuditEntry, AuditFilter } from './types';

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

function parseArgs(): {
  filter: AuditFilter;
  limit: number;
} {
  const args = process.argv.slice(2);
  const filter: AuditFilter = {};
  let limit = 20;

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    if (arg === '--date' && args[i + 1]) {
      filter.date = args[i + 1];
      i++;
    } else if (arg === '--tool' && args[i + 1]) {
      filter.tool = args[i + 1];
      i++;
    } else if (arg === '--session' && args[i + 1]) {
      filter.session = args[i + 1];
      i++;
    } else if (arg === '--limit' && args[i + 1]) {
      limit = parseInt(args[i + 1], 10);
      i++;
    }
  }

  // Default to today if no date specified
  if (!filter.date) {
    filter.date = new Date().toISOString().split('T')[0];
  }

  return { filter, limit };
}

function formatEntry(entry: AuditEntry): string {
  const time = new Date(entry.timestamp).toLocaleTimeString();

  let resultColor = colors.green;
  let resultSymbol = '✓';

  if (entry.result === 'error') {
    resultColor = colors.red;
    resultSymbol = '✗';
  } else if (entry.result === 'blocked') {
    resultColor = colors.yellow;
    resultSymbol = '⊘';
  }

  const sessionShort = entry.sessionId.substring(0, 12);

  return `${colors.gray}${time}${colors.reset} ${resultColor}${resultSymbol}${colors.reset} ${colors.cyan}${entry.tool}${colors.reset} ${colors.gray}[${sessionShort}]${colors.reset}`;
}

function filterEntries(
  entries: AuditEntry[],
  filter: AuditFilter
): AuditEntry[] {
  return entries.filter(entry => {
    if (filter.tool && entry.tool !== filter.tool) {
      return false;
    }
    if (filter.session && !entry.sessionId.includes(filter.session)) {
      return false;
    }
    if (filter.result && entry.result !== filter.result) {
      return false;
    }
    return true;
  });
}

function main() {
  const { filter, limit } = parseArgs();

  console.log(`\n${colors.cyan}📊 Audit Log Viewer${colors.reset}\n`);
  console.log(`Date: ${filter.date || 'today'}`);
  if (filter.tool) console.log(`Tool filter: ${filter.tool}`);
  if (filter.session) console.log(`Session filter: ${filter.session}`);
  console.log(`Limit: ${limit}\n`);

  const entries = readAuditLog(filter.date!);

  if (entries.length === 0) {
    console.log(`${colors.yellow}No audit entries found for ${filter.date}${colors.reset}\n`);
    return;
  }

  const filtered = filterEntries(entries, filter);

  if (filtered.length === 0) {
    console.log(`${colors.yellow}No entries match the filter${colors.reset}\n`);
    return;
  }

  console.log(`${colors.gray}Showing ${Math.min(limit, filtered.length)} of ${filtered.length} entries:${colors.reset}\n`);

  filtered.slice(0, limit).forEach(entry => {
    console.log(formatEntry(entry));

    // Show params if present
    if (entry.params && Object.keys(entry.params).length > 0) {
      const paramsStr = Object.entries(entry.params)
        .map(([key, value]) => `${key}=${JSON.stringify(value)}`)
        .join(', ');
      console.log(`  ${colors.gray}${paramsStr}${colors.reset}`);
    }

    // Show error if present
    if (entry.error) {
      console.log(`  ${colors.red}Error: ${entry.error}${colors.reset}`);
    }

    console.log('');
  });

  if (filtered.length > limit) {
    console.log(`${colors.gray}... and ${filtered.length - limit} more entries${colors.reset}\n`);
  }
}

if (require.main === module) {
  main();
}
