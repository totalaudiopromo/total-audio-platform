#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

function parseArgs() {
  const args = process.argv.slice(2);
  const get = (flag, fallback) => {
    const idx = args.findIndex(a => a === flag || a.startsWith(`${flag}=`));
    if (idx === -1) return fallback;
    const val = args[idx].includes('=') ? args[idx].split('=')[1] : args[idx + 1];
    return val ?? fallback;
  };

  const input = get('--input') || get('-i') || path.resolve('apps/audio-intel/sample-contacts.csv');
  const out = get('--out') || get('-o') || path.resolve('enriched-contacts-database.json');
  const endpoint = get('--endpoint') || 'http://localhost:3000/api/enrich-claude';
  const batch = parseInt(get('--batch') || '50', 10);

  return { input, out, endpoint, batch };
}

function normaliseHeader(header) {
  return String(header || '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();
}

function pickFieldKey(record, candidates) {
  const keys = Object.keys(record);
  // Exact normalised match first
  for (const key of keys) {
    const n = normaliseHeader(key);
    if (candidates.includes(n)) return key;
  }
  // Contains match
  for (const key of keys) {
    const n = normaliseHeader(key);
    if (candidates.some(c => n.includes(c))) return key;
  }
  return null;
}

async function readCsv(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`Input file not found: ${filePath}`);
  }

  const contacts = [];
  await new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (row) => {
        try {
          // Determine keys once per row (robust to mixed headers)
          const emailKey = pickFieldKey(row, ['email', 'e-mail', 'email address']);
          const firstNameKey = pickFieldKey(row, ['first name', 'firstname', 'given name']);
          const lastNameKey = pickFieldKey(row, ['last name', 'lastname', 'surname', 'family name']);
          const nameKey = pickFieldKey(row, ['name', 'full name', 'contact name']);
          const stationKey = pickFieldKey(row, ['station', 'organisation', 'organization', 'company']);

          const rawEmail = emailKey ? String(row[emailKey] || '').trim() : '';
          if (!rawEmail) return; // skip rows without email

          let name = '';
          const fn = firstNameKey ? String(row[firstNameKey] || '').trim() : '';
          const ln = lastNameKey ? String(row[lastNameKey] || '').trim() : '';
          if (fn || ln) {
            name = [fn, ln].filter(Boolean).join(' ').trim();
          } else if (nameKey) {
            name = String(row[nameKey] || '').trim();
          } else if (stationKey) {
            name = String(row[stationKey] || '').trim();
          }
          if (!name) {
            // fallback from email local part
            name = rawEmail.split('@')[0].replace(/[._-]+/g, ' ').trim();
          }

          // Attach all original fields for context
          contacts.push({ name, email: rawEmail, ...row });
        } catch (e) {
          // skip row on parse error
        }
      })
      .on('end', () => resolve())
      .on('error', (err) => reject(err));
  });

  return contacts;
}

async function enrichBatch(endpoint, contacts) {
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ contacts }),
  });
  const json = await res.json();
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
  const enrichedAll = [];

  for (let i = 0; i < allContacts.length; i += batch) {
    const slice = allContacts.slice(i, i + batch);
    console.log(`→ Batch ${i + 1}-${Math.min(i + slice.length, allContacts.length)}`);
    try {
      const { enriched } = await enrichBatch(endpoint, slice);
      if (Array.isArray(enriched)) {
        enrichedAll.push(...enriched);
      }
    } catch (err) {
      console.warn(`Batch failed: ${err.message}`);
    }
    await new Promise(r => setTimeout(r, 100));
  }

  const seen = new Set();
  const deduped = [];
  for (const rec of enrichedAll) {
    const email = String(rec.email || '').toLowerCase();
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


