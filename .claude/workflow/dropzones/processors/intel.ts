#!/usr/bin/env tsx
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, basename, dirname } from 'path';

interface ContactRow {
  name?: string;
  email?: string;
  role?: string;
  company?: string;
  phone?: string;
  website?: string;
  [key: string]: string | undefined;
}

function validateEmail(email: string | undefined): {
  valid: boolean;
  reason?: string;
  score: number;
} {
  if (!email) return { valid: false, reason: 'Email missing', score: 0 };

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return { valid: false, reason: 'Invalid format', score: 0 };

  if (email.includes('@example.com') || email.includes('@test.com')) {
    return { valid: false, reason: 'Test email', score: 20 };
  }

  let score = 70;
  if (email.includes('@bbc.') || email.includes('@npr.')) score += 20;
  return { valid: true, score };
}

function parseCSV(filePath: string): ContactRow[] {
  const content = readFileSync(filePath, 'utf-8');
  const lines = content.split('\n').filter(line => line.trim());
  if (lines.length === 0) throw new Error('CSV file is empty');

  const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
  const contacts: ContactRow[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => v.trim());
    const contact: ContactRow = {};
    headers.forEach((header, index) => {
      contact[header] = values[index] || '';
    });
    contacts.push(contact);
  }
  return contacts;
}

function toCSV(contacts: ContactRow[]): string {
  if (contacts.length === 0) return '';
  const headers = new Set<string>();
  contacts.forEach(c => Object.keys(c).forEach(k => headers.add(k)));
  const headerArray = Array.from(headers);
  const lines: string[] = [headerArray.join(',')];
  contacts.forEach(c => {
    lines.push(headerArray.map(h => c[h] || '').join(','));
  });
  return lines.join('\n');
}

export async function processContactEnrichment(
  inputPath: string,
  options: { dryRun?: boolean; verbose?: boolean }
): Promise<void> {
  const startTime = Date.now();
  const inputFileName = basename(inputPath, '.csv');
  const outputDir = dirname(inputPath).replace('/queue', '/processed');

  console.log('\n📊 Contact Intelligence Processor');
  console.log(`Input: ${inputPath}`);
  console.log(`Mode: ${options.dryRun ? 'DRY-RUN' : 'LIVE'}\n`);

  const contacts = parseCSV(inputPath);
  console.log(`📖 Found ${contacts.length} contacts\n`);

  // Deduplicate
  const seen = new Map<string, ContactRow>();
  let duplicates = 0;
  contacts.forEach(c => {
    if (!c.email) return;
    const key = c.email.toLowerCase().trim();
    if (seen.has(key)) {
      duplicates++;
    } else {
      seen.set(key, c);
    }
  });
  const unique = Array.from(seen.values());
  console.log(`🔍 Removed ${duplicates} duplicates`);
  console.log(`   ${unique.length} unique contacts\n`);

  // Validate
  const valid: ContactRow[] = [];
  const invalid: ContactRow[] = [];
  let totalScore = 0;

  unique.forEach(c => {
    const validation = validateEmail(c.email);
    totalScore += validation.score;
    if (validation.valid) {
      valid.push(c);
    } else {
      invalid.push(c);
    }
  });

  const avgScore = Math.round(totalScore / unique.length);
  console.log(`✅ Valid: ${valid.length}`);
  console.log(`❌ Invalid: ${invalid.length}`);
  console.log(`📈 Avg Quality: ${avgScore}/100\n`);

  if (!options.dryRun) {
    if (!existsSync(outputDir)) mkdirSync(outputDir, { recursive: true });

    if (valid.length > 0) {
      const cleanPath = join(outputDir, `${inputFileName}-cleaned.csv`);
      writeFileSync(cleanPath, toCSV(valid));
      console.log(`💾 ${cleanPath}`);
    }

    if (invalid.length > 0) {
      const invalidPath = join(outputDir, `${inputFileName}-invalid.csv`);
      writeFileSync(invalidPath, toCSV(invalid));
      console.log(`💾 ${invalidPath}`);
    }

    const summary = {
      inputFile: basename(inputPath),
      timestamp: new Date().toISOString(),
      total: contacts.length,
      valid: valid.length,
      invalid: invalid.length,
      duplicates,
      avgScore,
      processingTimeMs: Date.now() - startTime,
    };
    const summaryPath = join(outputDir, `${inputFileName}-summary.json`);
    writeFileSync(summaryPath, JSON.stringify(summary, null, 2));
    console.log(`💾 ${summaryPath}\n`);
    console.log(`✅ Complete in ${summary.processingTimeMs}ms`);
  } else {
    console.log('[DRY-RUN] Would write output files\n');
  }
}
