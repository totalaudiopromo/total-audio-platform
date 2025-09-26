#!/usr/bin/env ts-node

import fs from 'fs';
import path from 'path';
import readline from 'readline';
import { once } from 'events';

type Contact = {
  name?: string;
  email: string;
  [key: string]: unknown;
};

type EnrichmentResponse = {
  success: boolean;
  enriched?: Array<Record<string, unknown>>;
  processed?: number;
  error?: string;
};

function parseArgs(): { input: string; out: string; endpoint: string; batch: number } {
  const args = process.argv.slice(2);
  const get = (flag: string, fallback?: string) => {
    const idx = args.findIndex(a => a === flag || a.startsWith(`${flag}=`));
    if (idx === -1) return fallback;
    const val = args[idx].includes('=') ? args[idx].split('=')[1] : args[idx + 1];
    return (val as string) ?? fallback;
  };

  const input = get('--input') || get('-i') || path.resolve('apps/audio-intel/sample-contacts.csv');
  const out = get('--out') || get('-o') || path.resolve('enriched-contacts-database.json');
  const endpoint = get('--endpoint') || 'http://localhost:3000/api/enrich-claude';
  const batch = parseInt(get('--batch') || '50', 10);

  return { input, out, endpoint, batch };
}

async function readCsv(filePath: string): Promise<Contact[]> {
  if (!fs.existsSync(filePath)) {
    throw new Error(`Input file not found: ${filePath}`);
  }

  const input = fs.createReadStream(filePath);
  const rl = readline.createInterface({ input, crlfDelay: Infinity });

  const contacts: Contact[] = [];
  let headers: string[] | null = null;

  rl.on('line', (line: string) => {
    if (!headers) {
      headers = line.split(',').map(h => h.trim());
      return;
    }
    if (!line.trim()) return;
    const cols = line.split(',');
    const record: Record<string, string> = {};
    headers.forEach((h, i) => {
      record[h] = (cols[i] || '').trim();
    });
    const email = (record.email || '').trim();
    if (email) {
      contacts.push({ name: record.name, email, ...record });
    }
  });

  await once(rl, 'close');
  return contacts;
}

async function enrichBatch(endpoint: string, contacts: Contact[]): Promise<EnrichmentResponse> {
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ contacts }),
  });
  const json = (await res.json()) as EnrichmentResponse;
  if (!res.ok || !json.success) {
    const errMsg = json.error || `HTTP ${res.status}`;
    throw new Error(`Enrichment failed: ${errMsg}`);
  }
  return json;
}

async function main() {
  const { input, out, endpoint, batch } = parseArgs();
  console.log(`Reading: ${input}`);
  const allContacts = await readCsv(input);
  if (allContacts.length === 0) {
    console.error('No contacts found in CSV.');
    process.exit(1);
  }

  console.log(`Enriching ${allContacts.length} contacts via ${endpoint} (batch ${batch})`);
  const enrichedAll: Array<Record<string, unknown>> = [];

  for (let i = 0; i < allContacts.length; i += batch) {
    const slice = allContacts.slice(i, i + batch);
    console.log(`→ Batch ${i + 1}-${Math.min(i + slice.length, allContacts.length)}`);
    try {
      const { enriched } = await enrichBatch(endpoint, slice);
      if (Array.isArray(enriched)) {
        enrichedAll.push(...enriched);
      }
    } catch (err: any) {
      console.warn(`Batch failed: ${err.message}`);
    }
    // small delay to be kind to the server
    await new Promise(r => setTimeout(r, 100));
  }

  // De-duplicate by email if present
  const seen = new Set<string>();
  const deduped: Array<Record<string, unknown>> = [];
  for (const rec of enrichedAll) {
    const email = String((rec as any).email || '').toLowerCase();
    if (email && seen.has(email)) continue;
    if (email) seen.add(email);
    deduped.push(rec);
  }

  fs.writeFileSync(out, JSON.stringify({ generatedAt: new Date().toISOString(), count: deduped.length, contacts: deduped }, null, 2));
  console.log(`Saved: ${out} (contacts: ${deduped.length})`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});


