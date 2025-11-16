#!/usr/bin/env tsx
/**
 * Generate audit summary for a given date
 * Usage: pnpm tsx .claude/workflow/audit/summarize.ts [YYYY-MM-DD]
 */

import { readAuditLog } from './logger';
import type { AuditSummary } from './types';

/**
 * Generate summary from audit entries
 */
export function generateDailySummary(date: string): AuditSummary {
  const entries = readAuditLog(date);

  const toolCounts: Record<string, number> = {};
  const sessions = new Set<string>();
  let errorCount = 0;
  let blockedCount = 0;

  for (const entry of entries) {
    // Count tools
    toolCounts[entry.tool] = (toolCounts[entry.tool] || 0) + 1;

    // Track sessions
    sessions.add(entry.sessionId);

    // Count errors and blocks
    if (entry.result === 'error') {
      errorCount++;
    } else if (entry.result === 'blocked') {
      blockedCount++;
    }
  }

  // Get top tools
  const topTools = Object.entries(toolCounts)
    .map(([tool, count]) => ({ tool, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  return {
    date,
    totalExecutions: entries.length,
    toolCounts,
    errorCount,
    blockedCount,
    sessions: Array.from(sessions),
    topTools,
  };
}

function main() {
  // Get date from args or use today
  const args = process.argv.slice(2);
  const date = args[0] || new Date().toISOString().split('T')[0];

  const summary = generateDailySummary(date);

  console.log(`\n# Audit Summary for ${date}\n`);
  console.log(`## Overview`);
  console.log(`- Total executions: ${summary.totalExecutions}`);
  console.log(`- Unique sessions: ${summary.sessions.length}`);
  console.log(`- Errors: ${summary.errorCount}`);
  console.log(`- Blocked: ${summary.blockedCount}`);
  console.log(`- Success rate: ${summary.totalExecutions > 0 ? ((1 - (summary.errorCount + summary.blockedCount) / summary.totalExecutions) * 100).toFixed(1) : 0}%\n`);

  if (summary.topTools.length > 0) {
    console.log(`## Top Tools`);
    summary.topTools.forEach((item, index) => {
      console.log(`${index + 1}. ${item.tool}: ${item.count} executions`);
    });
    console.log('');
  }

  if (summary.sessions.length > 0) {
    console.log(`## Sessions`);
    summary.sessions.slice(0, 5).forEach(session => {
      console.log(`- ${session}`);
    });
    if (summary.sessions.length > 5) {
      console.log(`- ... and ${summary.sessions.length - 5} more`);
    }
    console.log('');
  }
}

if (require.main === module) {
  main();
}
