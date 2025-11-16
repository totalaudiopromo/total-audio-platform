#!/usr/bin/env tsx
/**
 * Summarize decisions
 * Usage: npx tsx .claude/workflow/sessions/summarize-decisions.ts [date]
 */

import { readDecisions } from './logger';

function main() {
  const args = process.argv.slice(2);
  const date = args[0] || new Date().toISOString().split('T')[0];

  const decisions = readDecisions(date);

  console.log(`\n# Decision Summary for ${date}\n`);

  if (decisions.length === 0) {
    console.log('No decisions recorded.\n');
    return;
  }

  // Group by type
  const byType = decisions.reduce((acc, d) => {
    if (!acc[d.type]) acc[d.type] = [];
    acc[d.type].push(d);
    return acc;
  }, {} as Record<string, typeof decisions>);

  // Group by impact
  const byImpact = decisions.reduce((acc, d) => {
    const impact = d.impact || 'medium';
    if (!acc[impact]) acc[impact] = 0;
    acc[impact]++;
    return acc;
  }, {} as Record<string, number>);

  console.log(`## Overview`);
  console.log(`- Total decisions: ${decisions.length}`);
  console.log(`- Unique sessions: ${new Set(decisions.map(d => d.sessionId)).size}\n`);

  console.log(`## By Impact`);
  Object.entries(byImpact).forEach(([impact, count]) => {
    console.log(`- ${impact}: ${count}`);
  });
  console.log('');

  console.log(`## By Type`);
  Object.entries(byType).forEach(([type, decs]) => {
    console.log(`\n### ${type} (${decs.length})`);
    decs.forEach(d => {
      console.log(`- **${d.title}**`);
      console.log(`  ${d.description}`);
    });
  });

  console.log('');
}

if (require.main === module) {
  main();
}
