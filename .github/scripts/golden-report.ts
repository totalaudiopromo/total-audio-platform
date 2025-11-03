#!/usr/bin/env tsx
/**
 * Golden Deployment Report Generator
 * Aggregates golden-check and golden-promote JSON outputs
 * into a unified Markdown + HTML summary.
 *
 * Used by the Total Audio Platform Ops Console (Phase 9E).
 */

import fs from 'fs';
import path from 'path';

interface GoldenCheckSummary {
  app: string;
  timestamp: string;
  overall: 'pass' | 'fail';
  duration: number;
  checks: {
    name: string;
    status: 'pass' | 'fail';
    message: string;
    duration: number;
  }[];
}

interface PromoteResult {
  app: string;
  deploymentId: string;
  url?: string;
  status: 'success' | 'fail';
  message: string;
  duration: number;
}

interface CombinedReport {
  timestamp: string;
  results: {
    app: string;
    checkStatus: string;
    promoteStatus: string;
    duration: number;
    url?: string;
  }[];
  summary: {
    passed: number;
    failed: number;
    total: number;
  };
}

// === UTILITIES ===
function readJSON(file: string): any | null {
  try {
    const data = fs.readFileSync(file, 'utf8');
    return JSON.parse(data);
  } catch {
    console.error(`⚠️ Missing or invalid file: ${file}`);
    return null;
  }
}

function formatDuration(ms: number): string {
  return (ms / 1000).toFixed(1) + 's';
}

function generateMarkdown(report: CombinedReport): string {
  const lines: string[] = [];
  lines.push(`# 🏁 Golden Deployment Report`);
  lines.push(`**Date:** ${report.timestamp}`);
  lines.push(``);
  lines.push(`| App | Health Check | Promotion | Duration | URL |`);
  lines.push(`|-----|---------------|------------|-----------|-----|`);
  for (const r of report.results) {
    const checkIcon = r.checkStatus === 'pass' ? '✅' : '❌';
    const promoteIcon = r.promoteStatus === 'success' ? '✅' : '❌';
    lines.push(
      `| ${r.app} | ${checkIcon} ${r.checkStatus} | ${promoteIcon} ${r.promoteStatus} | ${formatDuration(
        r.duration
      )} | ${r.url ?? '-'} |`
    );
  }
  lines.push('');
  lines.push(`### Summary`);
  lines.push(
    `✅ Passed: ${report.summary.passed} ❌ Failed: ${report.summary.failed} 🔢 Total: ${report.summary.total}`
  );
  return lines.join('\n');
}

function generateHTML(markdown: string): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Golden Deployment Report</title>
<style>
body { font-family: system-ui, sans-serif; margin: 2rem; color: #222; }
table { border-collapse: collapse; width: 100%; margin-top: 1rem; }
th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
th { background: #f4f4f4; }
tr:nth-child(even) { background: #fafafa; }
h1 { color: #1a73e8; }
</style>
</head>
<body>
${markdown
  .replace(/^# (.*$)/gim, '<h1>$1</h1>')
  .replace(/^### (.*$)/gim, '<h3>$1</h3>')
  .replace(/^\\| (.*) \\|$/gm, '<tr><td>$1</td></tr>')
  .replace(/\n/g, '<br>')}
</body>
</html>`;
}

// === MAIN EXECUTION ===
async function main() {
  const checkDir = path.join(process.cwd(), 'reports', 'golden');
  const promoteFile = path.join(checkDir, 'promote.json');

  const promoteData = readJSON(promoteFile);
  if (!promoteData) {
    console.error('❌ No promote.json found. Run golden-promote.ts first.');
    process.exit(1);
  }

  const appResults: CombinedReport['results'] = [];

  for (const promote of promoteData.results as PromoteResult[]) {
    const checkFile = path.join(checkDir, `${promote.app}.json`);
    const checkData = readJSON(checkFile) as GoldenCheckSummary | null;
    appResults.push({
      app: promote.app,
      checkStatus: checkData?.overall ?? 'unknown',
      promoteStatus: promote.status,
      duration: promote.duration,
      url: promote.url,
    });
  }

  const passed = appResults.filter(
    r => r.checkStatus === 'pass' && r.promoteStatus === 'success'
  ).length;
  const failed = appResults.length - passed;

  const report: CombinedReport = {
    timestamp: new Date().toISOString(),
    results: appResults,
    summary: {
      passed,
      failed,
      total: appResults.length,
    },
  };

  const markdown = generateMarkdown(report);
  const html = generateHTML(markdown);

  const outDir = path.join(checkDir, 'final');
  fs.mkdirSync(outDir, { recursive: true });

  fs.writeFileSync(path.join(outDir, 'golden-report.md'), markdown);
  fs.writeFileSync(path.join(outDir, 'golden-report.html'), html);

  console.error('✅ Golden report generated:');
  console.error(`- ${path.join(outDir, 'golden-report.md')}`);
  console.error(`- ${path.join(outDir, 'golden-report.html')}`);

  // Output summary JSON for GitHub artifacts
  console.log(JSON.stringify(report, null, 2));
}

main().catch(err => {
  console.error('❌ Error generating golden report:', err);
  process.exit(1);
});
