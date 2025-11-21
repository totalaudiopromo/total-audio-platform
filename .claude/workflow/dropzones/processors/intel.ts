// .claude/workflow/dropzones/processors/intel.ts

import { promises as fs } from 'fs';
import path from 'path';
import { ProcessResult } from '../types.js';

// Very simple CSV parser – fine for internal tooling.
// If you prefer, replace with csv-parse / papaparse for full RFC support.
function parseCsv(text: string): string[][] {
  return text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .map((line) => line.split(',').map((cell) => cell.trim()));
}

function toCsv(rows: string[][]): string {
  return rows.map((row) =>
    row
      .map((cell) => {
        if (cell.includes(',') || cell.includes('"') || cell.includes('\n')) {
          return `"${cell.replace(/"/g, '""')}"`;
        }
        return cell;
      })
      .join(',')
  ).join('\n');
}

function isValidEmail(email: string): boolean {
  const normalised = email.trim().toLowerCase();
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(normalised);
}

interface RawContactRow {
  [key: string]: string;
}

interface CleanContact {
  email: string;
  name?: string;
  outlet?: string;
  role?: string;
  country?: string;
  sourceFile?: string;
  tags?: string[];
  notes?: string;
}

interface IntelSummary {
  totalRows: number;
  validContacts: number;
  invalidContacts: number;
  duplicateEmails: number;
  uniqueEmails: number;
  sampleInvalidEmails: string[];
  sampleDuplicateEmails: string[];
}

function normaliseHeader(header: string): string {
  return header
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
}

function mapRowToContact(row: RawContactRow, sourceFile: string): CleanContact | null {
  const keys = Object.keys(row);
  const find = (candidates: string[]): string | undefined => {
    const normalisedMap: Record<string, string> = {};
    for (const key of keys) {
      normalisedMap[normaliseHeader(key)] = row[key];
    }
    for (const cand of candidates) {
      const n = normaliseHeader(cand);
      if (normalisedMap[n]) return normalisedMap[n];
    }
    return undefined;
  };

  const email = find(['email', 'e-mail', 'email_address', 'contact_email']);
  if (!email || !isValidEmail(email)) return null;

  const name = find(['name', 'full_name', 'contact_name']);
  const outlet = find(['outlet', 'publication', 'station', 'blog', 'company']);
  const role = find(['role', 'position', 'title']);
  const country = find(['country', 'territory', 'region']);
  const notes = find(['notes', 'comments']);

  const tagsRaw = find(['tags', 'genres', 'categories']);
  const tags = tagsRaw ? tagsRaw.split(/[;,]/).map((t) => t.trim()).filter(Boolean) : undefined;

  return {
    email: email.trim().toLowerCase(),
    name: name?.trim(),
    outlet: outlet?.trim(),
    role: role?.trim(),
    country: country?.trim(),
    sourceFile,
    tags,
    notes: notes?.trim(),
  };
}

/**
 * Main Contact Intel processor
 * - Input: CSV in queue
 * - Output:
 *    - cleaned CSV (valid + unique emails)
 *    - invalid CSV (invalid email rows)
 *    - JSON summary with counts + diagnostics
 * - You can then wire this into Supabase / TAP UI.
 */
export async function processIntelFile(
  inputPath: string,
  processedDir: string,
): Promise<ProcessResult> {
  const baseName = path.basename(inputPath, path.extname(inputPath));
  const raw = await fs.readFile(inputPath, 'utf8');

  const rows = parseCsv(raw);
  if (rows.length === 0) {
    return {
      success: false,
      action: 'intel:no_rows',
      message: 'CSV contained no rows',
    };
  }

  const [headerRow, ...dataRows] = rows;
  const headers = headerRow.map(normaliseHeader);

  const rawObjects: RawContactRow[] = dataRows.map((cols) => {
    const obj: RawContactRow = {};
    headers.forEach((h, idx) => {
      obj[h] = cols[idx] ?? '';
    });
    return obj;
  });

  const validContacts: CleanContact[] = [];
  const invalidRows: RawContactRow[] = [];
  const emailCounts: Record<string, number> = {};

  for (const row of rawObjects) {
    const contact = mapRowToContact(row, baseName);
    if (!contact) {
      invalidRows.push(row);
      continue;
    }
    emailCounts[contact.email] = (emailCounts[contact.email] || 0) + 1;
    validContacts.push(contact);
  }

  const duplicates = Object.entries(emailCounts)
    .filter(([_, count]) => count > 1)
    .map(([email]) => email);

  const dedupedContacts: CleanContact[] = [];
  const seenEmails = new Set<string>();
  for (const c of validContacts) {
    if (seenEmails.has(c.email)) continue;
    seenEmails.add(c.email);
    dedupedContacts.push(c);
  }

  const summary: IntelSummary = {
    totalRows: rawObjects.length,
    validContacts: validContacts.length,
    invalidContacts: invalidRows.length,
    duplicateEmails: duplicates.length,
    uniqueEmails: dedupedContacts.length,
    sampleInvalidEmails: invalidRows
      .map((r) => r['email'] || r['email_address'] || r['contact_email'])
      .filter(Boolean)
      .slice(0, 10),
    sampleDuplicateEmails: duplicates.slice(0, 10),
  };

  await fs.mkdir(processedDir, { recursive: true });

  // Cleaned CSV
  const cleanedHeader = ['email', 'name', 'outlet', 'role', 'country', 'tags', 'source_file', 'notes'];
  const cleanedRows: string[][] = [
    cleanedHeader,
    ...dedupedContacts.map((c) => [
      c.email,
      c.name ?? '',
      c.outlet ?? '',
      c.role ?? '',
      c.country ?? '',
      (c.tags ?? []).join('|'),
      c.sourceFile ?? '',
      c.notes ?? '',
    ]),
  ];
  const cleanedCsvPath = path.join(processedDir, `${baseName}-cleaned.csv`);
  await fs.writeFile(cleanedCsvPath, toCsv(cleanedRows), 'utf8');

  // Invalid CSV
  const invalidHeader = Object.keys(rawObjects[0] ?? {});
  const invalidRowsOut: string[][] = [
    invalidHeader,
    ...invalidRows.map((row) => invalidHeader.map((h) => row[h] ?? '')),
  ];
  const invalidCsvPath = path.join(processedDir, `${baseName}-invalid.csv`);
  if (invalidRows.length > 0) {
    await fs.writeFile(invalidCsvPath, toCsv(invalidRowsOut), 'utf8');
  }

  // JSON summary
  const summaryPath = path.join(processedDir, `${baseName}-intel-summary.json`);
  await fs.writeFile(summaryPath, JSON.stringify(summary, null, 2), 'utf8');

  // 🔌 HERE is where you'd optionally call a Supabase integration
  // to upsert `dedupedContacts` into your contacts tables.
  // Keeping it out of this file avoids coupling to your Supabase client setup.

  return {
    success: true,
    action: 'intel:processed',
    message: `Processed ${summary.totalRows} rows → ${summary.uniqueEmails} unique contacts`,
    filePath: cleanedCsvPath,
  };
}
