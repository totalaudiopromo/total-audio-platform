#!/usr/bin/env npx tsx
/**
 * Intel Processor
 *
 * Contact enrichment processor for the IndyDevDan workflow.
 * Reads CSV files with contacts and enriches them with additional data.
 *
 * Expected CSV columns:
 * - Name (required)
 * - Email (required)
 * - Company/Station (optional)
 * - Role (optional)
 *
 * Output:
 * - Enriched CSV with additional columns
 * - Summary JSON with statistics
 *
 * Usage:
 *   npx tsx intel-processor.ts <input-file.csv>
 */

import * as fs from 'fs';
import * as path from 'path';
import { AuditLogger } from '../../workflow/audit-logger';

// Configuration
const PROJECT_ROOT = '/Users/chrisschofield/workspace/active/total-audio-platform';
const CLAUDE_DIR = path.join(PROJECT_ROOT, '.claude');
const DROPZONES_DIR = path.join(CLAUDE_DIR, 'dropzones');
const PROCESSED_DIR = path.join(DROPZONES_DIR, 'processed');

const logger = new AuditLogger();

export interface Contact {
  name: string;
  email: string;
  company?: string;
  role?: string;
  [key: string]: string | undefined;
}

export interface EnrichedContact extends Contact {
  enriched_at: string;
  email_valid: boolean;
  domain?: string;
  contact_type?: string;
  confidence_score?: number;
}

export interface ProcessResult {
  success: boolean;
  error?: string;
  stats?: {
    total_contacts: number;
    enriched: number;
    failed: number;
    duration_ms: number;
  };
  outputFile?: string;
}

/**
 * Parse CSV content into array of objects
 */
function parseCSV(content: string): Contact[] {
  const lines = content.trim().split('\n');
  if (lines.length < 2) {
    return [];
  }

  const headers = lines[0].split(',').map(h => h.trim().toLowerCase().replace(/['"]/g, ''));
  const contacts: Contact[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    if (values.length === 0) continue;

    const contact: Contact = {
      name: '',
      email: '',
    };

    headers.forEach((header, idx) => {
      const value = values[idx]?.trim().replace(/^["']|["']$/g, '') || '';
      if (header === 'name' || header === 'contact' || header === 'full_name') {
        contact.name = value;
      } else if (header === 'email' || header === 'email_address') {
        contact.email = value;
      } else if (header === 'company' || header === 'station' || header === 'organisation') {
        contact.company = value;
      } else if (header === 'role' || header === 'position' || header === 'title') {
        contact.role = value;
      } else {
        contact[header] = value;
      }
    });

    if (contact.name || contact.email) {
      contacts.push(contact);
    }
  }

  return contacts;
}

/**
 * Parse a single CSV line handling quoted values
 */
function parseCSVLine(line: string): string[] {
  const values: string[] = [];
  let current = '';
  let inQuotes = false;

  for (const char of line) {
    if (char === '"' && !inQuotes) {
      inQuotes = true;
    } else if (char === '"' && inQuotes) {
      inQuotes = false;
    } else if (char === ',' && !inQuotes) {
      values.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  values.push(current);

  return values;
}

/**
 * Validate email format
 */
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Extract domain from email
 */
function extractDomain(email: string): string | undefined {
  const match = email.match(/@(.+)$/);
  return match ? match[1].toLowerCase() : undefined;
}

/**
 * Determine contact type based on domain
 */
function determineContactType(domain?: string, role?: string): string {
  if (!domain) return 'unknown';

  const radioDomains = ['bbc.co.uk', 'abc.net.au', 'npr.org', 'radiox.co.uk', 'capitalfm.com'];
  const musicDomains = ['spotify.com', 'apple.com', 'soundcloud.com', 'bandcamp.com'];
  const prDomains = ['pr.com', 'publicity.com', 'media.com'];

  if (radioDomains.some(d => domain.includes(d))) return 'radio';
  if (musicDomains.some(d => domain.includes(d))) return 'platform';
  if (prDomains.some(d => domain.includes(d))) return 'pr';

  if (role) {
    const lowerRole = role.toLowerCase();
    if (
      lowerRole.includes('radio') ||
      lowerRole.includes('dj') ||
      lowerRole.includes('presenter')
    ) {
      return 'radio';
    }
    if (
      lowerRole.includes('pr') ||
      lowerRole.includes('press') ||
      lowerRole.includes('publicity')
    ) {
      return 'pr';
    }
    if (
      lowerRole.includes('journalist') ||
      lowerRole.includes('writer') ||
      lowerRole.includes('editor')
    ) {
      return 'media';
    }
  }

  return 'other';
}

/**
 * Calculate confidence score for contact
 */
function calculateConfidence(contact: EnrichedContact): number {
  let score = 0;

  if (contact.email_valid) score += 40;
  if (contact.name && contact.name.includes(' ')) score += 20; // Full name
  if (contact.company) score += 15;
  if (contact.role) score += 15;
  if (contact.contact_type !== 'unknown') score += 10;

  return Math.min(score, 100);
}

/**
 * Enrich a single contact
 */
function enrichContact(contact: Contact): EnrichedContact {
  const enriched: EnrichedContact = {
    ...contact,
    enriched_at: new Date().toISOString(),
    email_valid: isValidEmail(contact.email),
    domain: extractDomain(contact.email),
  };

  enriched.contact_type = determineContactType(enriched.domain, contact.role);
  enriched.confidence_score = calculateConfidence(enriched);

  return enriched;
}

/**
 * Convert enriched contacts to CSV
 */
function toCSV(contacts: EnrichedContact[]): string {
  if (contacts.length === 0) return '';

  const headers = [
    'name',
    'email',
    'company',
    'role',
    'email_valid',
    'domain',
    'contact_type',
    'confidence_score',
    'enriched_at',
  ];

  const lines = [headers.join(',')];

  for (const contact of contacts) {
    const values = headers.map(h => {
      const val = contact[h as keyof EnrichedContact];
      if (val === undefined || val === null) return '';
      if (typeof val === 'string' && (val.includes(',') || val.includes('"'))) {
        return `"${val.replace(/"/g, '""')}"`;
      }
      return String(val);
    });
    lines.push(values.join(','));
  }

  return lines.join('\n');
}

/**
 * Main process function - exported for use by processor-router
 */
export async function processFile(inputFile: string): Promise<ProcessResult> {
  const startTime = Date.now();

  logger.info('processor', 'intel-processor-start', { inputFile });

  try {
    // Read input file
    if (!fs.existsSync(inputFile)) {
      return {
        success: false,
        error: `Input file not found: ${inputFile}`,
      };
    }

    const content = fs.readFileSync(inputFile, 'utf-8');
    const contacts = parseCSV(content);

    if (contacts.length === 0) {
      return {
        success: false,
        error: 'No valid contacts found in CSV',
      };
    }

    // Enrich contacts
    const enrichedContacts: EnrichedContact[] = [];
    let failedCount = 0;

    for (const contact of contacts) {
      try {
        const enriched = enrichContact(contact);
        enrichedContacts.push(enriched);
      } catch (err) {
        failedCount++;
        logger.warn('processor', 'contact-enrichment-failed', {
          contact: contact.email,
          error: String(err),
        });
      }
    }

    // Generate output filename
    const basename = path.basename(inputFile, '.csv');
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const outputFilename = `${basename}-enriched-${timestamp}.csv`;
    const outputPath = path.join(PROCESSED_DIR, outputFilename);

    // Write enriched CSV
    const csvOutput = toCSV(enrichedContacts);
    fs.writeFileSync(outputPath, csvOutput);

    // Write summary JSON
    const summaryPath = path.join(PROCESSED_DIR, `${basename}-summary-${timestamp}.json`);
    const summary = {
      input_file: inputFile,
      output_file: outputPath,
      timestamp: new Date().toISOString(),
      stats: {
        total_contacts: contacts.length,
        enriched: enrichedContacts.length,
        failed: failedCount,
        valid_emails: enrichedContacts.filter(c => c.email_valid).length,
        contact_types: {
          radio: enrichedContacts.filter(c => c.contact_type === 'radio').length,
          pr: enrichedContacts.filter(c => c.contact_type === 'pr').length,
          media: enrichedContacts.filter(c => c.contact_type === 'media').length,
          platform: enrichedContacts.filter(c => c.contact_type === 'platform').length,
          other: enrichedContacts.filter(c => c.contact_type === 'other').length,
        },
        avg_confidence:
          enrichedContacts.length > 0
            ? Math.round(
                enrichedContacts.reduce((sum, c) => sum + (c.confidence_score || 0), 0) /
                  enrichedContacts.length
              )
            : 0,
      },
    };
    fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2));

    const duration_ms = Date.now() - startTime;

    logger.info('processor', 'intel-processor-complete', {
      inputFile,
      outputFile: outputPath,
      stats: summary.stats,
      duration_ms,
    });

    return {
      success: true,
      outputFile: outputPath,
      stats: {
        total_contacts: contacts.length,
        enriched: enrichedContacts.length,
        failed: failedCount,
        duration_ms,
      },
    };
  } catch (err) {
    const error = err instanceof Error ? err.message : String(err);
    logger.error('processor', 'intel-processor-error', { inputFile, error });
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
    console.log('Usage: npx tsx intel-processor.ts <input-file.csv>');
    console.log('');
    console.log('Enriches contact CSV with additional data:');
    console.log('  - Email validation');
    console.log('  - Domain extraction');
    console.log('  - Contact type classification');
    console.log('  - Confidence scoring');
    process.exit(1);
  }

  const result = await processFile(inputFile);
  console.log(JSON.stringify(result, null, 2));

  if (!result.success) {
    process.exit(1);
  }
}

main().catch(console.error);
