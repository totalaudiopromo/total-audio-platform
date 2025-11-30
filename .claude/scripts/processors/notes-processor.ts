#!/usr/bin/env npx tsx
/**
 * Notes Processor
 *
 * Takes raw session notes and normalises them into BUSINESS_NOTES.md
 *
 * Input: notes-*.md or notes-*.txt files
 * Output: Appended entry in BUSINESS_NOTES.md + summary JSON
 *
 * Usage:
 *   npx tsx notes-processor.ts <input-file.md>
 */

import * as fs from 'fs';
import * as path from 'path';
import { AuditLogger } from '../../workflow/audit-logger';

// Configuration
const PROJECT_ROOT = '/Users/chrisschofield/workspace/active/total-audio-platform';
const BUSINESS_NOTES = path.join(PROJECT_ROOT, 'BUSINESS_NOTES.md');
const CLAUDE_DIR = path.join(PROJECT_ROOT, '.claude');
const DROPZONES_DIR = path.join(CLAUDE_DIR, 'dropzones');
const PROCESSED_DIR = path.join(DROPZONES_DIR, 'processed');

const logger = new AuditLogger();

export interface ParsedNotes {
  title: string;
  date: string;
  decisions: string[];
  questions: string[];
  todos: string[];
  general: string[];
}

export interface ProcessResult {
  success: boolean;
  error?: string;
  stats?: {
    decisions: number;
    questions: number;
    todos: number;
    general: number;
  };
  outputFile?: string;
}

/**
 * Extract title from filename
 * notes-2025-11-30-liberty-demo.md -> Liberty Demo
 */
function extractTitleFromFilename(filename: string): string {
  const match = filename.match(/notes-\d{4}-\d{2}-\d{2}-(.+)\.(md|txt)$/i);
  if (match) {
    return match[1]
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
  return 'Session Notes';
}

/**
 * Extract date from filename
 * notes-2025-11-30-liberty-demo.md -> 2025-11-30
 */
function extractDateFromFilename(filename: string): string {
  const match = filename.match(/notes-(\d{4}-\d{2}-\d{2})/);
  return match ? match[1] : new Date().toISOString().split('T')[0];
}

/**
 * Parse notes content into structured data
 */
function parseNotes(content: string, filename: string): ParsedNotes {
  const lines = content.split('\n');
  const result: ParsedNotes = {
    title: extractTitleFromFilename(filename),
    date: extractDateFromFilename(filename),
    decisions: [],
    questions: [],
    todos: [],
    general: [],
  };

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    // Skip markdown headers (we'll use filename for title)
    if (trimmed.startsWith('#')) continue;

    // Decisions: DECISION:, Decided:, Decision:
    if (/^(DECISION:|Decided:|Decision:)/i.test(trimmed)) {
      const text = trimmed.replace(/^(DECISION:|Decided:|Decision:)\s*/i, '');
      if (text) result.decisions.push(text);
    }
    // Questions: ?, QUESTION:, Question:
    else if (/^(\?|QUESTION:|Question:)/i.test(trimmed)) {
      const text = trimmed.replace(/^(\?|QUESTION:|Question:)\s*/i, '');
      if (text) result.questions.push(text);
    }
    // TODOs: TODO:, - [ ], [ ], Action:
    else if (/^(TODO:|Action:|- \[ \]|\[ \])/i.test(trimmed)) {
      const text = trimmed.replace(/^(TODO:|Action:|- \[ \]|\[ \])\s*/i, '');
      if (text) result.todos.push(text);
    }
    // General notes (skip empty bullets)
    else if (trimmed !== '-' && trimmed !== '*') {
      // Remove leading bullet if present
      const text = trimmed.replace(/^[-*]\s*/, '');
      if (text) result.general.push(text);
    }
  }

  return result;
}

/**
 * Format parsed notes for BUSINESS_NOTES.md
 */
function formatForBusinessNotes(parsed: ParsedNotes): string {
  let output = `\n---\n\n### ${parsed.date} - ${parsed.title}\n\n`;

  if (parsed.decisions.length > 0) {
    output += '**Decisions:**\n\n';
    parsed.decisions.forEach(d => (output += `- ${d}\n`));
    output += '\n';
  }

  if (parsed.questions.length > 0) {
    output += '**Open Questions:**\n\n';
    parsed.questions.forEach(q => (output += `- ${q}\n`));
    output += '\n';
  }

  if (parsed.todos.length > 0) {
    output += '**Action Items:**\n\n';
    parsed.todos.forEach(t => (output += `- [ ] ${t}\n`));
    output += '\n';
  }

  if (parsed.general.length > 0) {
    output += '**Notes:**\n\n';
    parsed.general.forEach(n => (output += `- ${n}\n`));
    output += '\n';
  }

  return output;
}

/**
 * Find the right insertion point in BUSINESS_NOTES.md
 * Insert after the GIT WORKFLOW section but before the dated entries
 */
function findInsertionPoint(content: string): number {
  // Look for the first "## 📅" section (dated entries)
  const dateHeaderMatch = content.match(/## 📅 [A-Z]+ \d{4}/);
  if (dateHeaderMatch && dateHeaderMatch.index !== undefined) {
    return dateHeaderMatch.index;
  }

  // Fallback: insert at end
  return content.length;
}

/**
 * Main process function - exported for use by processor-router
 */
export async function processFile(inputFile: string): Promise<ProcessResult> {
  logger.info('processor', 'notes-processor-start', { inputFile });

  try {
    // Read input file
    if (!fs.existsSync(inputFile)) {
      return {
        success: false,
        error: `Input file not found: ${inputFile}`,
      };
    }

    const content = fs.readFileSync(inputFile, 'utf-8');
    const filename = path.basename(inputFile);
    const parsed = parseNotes(content, filename);

    // Check if we have any content
    const totalItems =
      parsed.decisions.length +
      parsed.questions.length +
      parsed.todos.length +
      parsed.general.length;

    if (totalItems === 0) {
      return {
        success: false,
        error: 'No content found in notes file',
      };
    }

    // Format for BUSINESS_NOTES.md
    const formatted = formatForBusinessNotes(parsed);

    // Read existing BUSINESS_NOTES.md
    let businessNotes = '';
    if (fs.existsSync(BUSINESS_NOTES)) {
      businessNotes = fs.readFileSync(BUSINESS_NOTES, 'utf-8');
    }

    // Find insertion point and insert
    const insertionPoint = findInsertionPoint(businessNotes);
    const newContent =
      businessNotes.slice(0, insertionPoint) + formatted + businessNotes.slice(insertionPoint);

    // Write updated BUSINESS_NOTES.md
    fs.writeFileSync(BUSINESS_NOTES, newContent);

    // Write summary JSON to processed/
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const summaryFilename = `notes-summary-${timestamp}.json`;
    const summaryPath = path.join(PROCESSED_DIR, summaryFilename);

    const summary = {
      source: inputFile,
      timestamp: new Date().toISOString(),
      parsed,
      stats: {
        decisions: parsed.decisions.length,
        questions: parsed.questions.length,
        todos: parsed.todos.length,
        general: parsed.general.length,
      },
    };

    fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2));

    logger.info('processor', 'notes-processor-complete', {
      inputFile,
      stats: summary.stats,
    });

    return {
      success: true,
      outputFile: summaryPath,
      stats: summary.stats,
    };
  } catch (err) {
    const error = err instanceof Error ? err.message : String(err);
    logger.error('processor', 'notes-processor-error', { inputFile, error });
    return {
      success: false,
      error,
    };
  }
}

// CLI interface
async function main(): Promise<void> {
  const inputFile = process.argv[2];

  if (!inputFile) {
    console.log('Usage: npx tsx notes-processor.ts <input-file.md>');
    console.log('');
    console.log('Processes session notes and appends to BUSINESS_NOTES.md');
    console.log('');
    console.log('Extracts:');
    console.log('  - Decisions (lines starting with DECISION: or Decided:)');
    console.log('  - Questions (lines starting with ? or QUESTION:)');
    console.log('  - TODOs (lines starting with TODO: or - [ ])');
    console.log('  - General notes (everything else)');
    console.log('');
    console.log('Example filename: notes-2025-11-30-liberty-demo.md');
    process.exit(1);
  }

  const result = await processFile(inputFile);
  console.log(JSON.stringify(result, null, 2));

  if (!result.success) {
    process.exit(1);
  }
}

main().catch(console.error);
