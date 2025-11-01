#!/usr/bin/env node

/**
 * Enrich Only Opted-In KYARA Contacts
 * Skip "Unsubscribed" contacts
 * Use simplified 3-field structure
 */

const fs = require('fs');
const fetch = require('node-fetch');
const Anthropic = require('@anthropic-ai/sdk');

const AIRTABLE_API_KEY =
  'pat52SEWV8PWmKZfW.d557f03560fdc8aa0895ac6fda0cbffd753054ea2fedbedd53207e7c265469ec';
const BASE_ID = 'appx7uTQWRH8cIC20';
const TABLE_ID = 'tblcZnUsB4Swyjcip';
const ANTHROPIC_API_KEY =
  process.env.ANTHROPIC_API_KEY ||
  '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';

const anthropic = new Anthropic({ apiKey: ANTHROPIC_API_KEY });

// Load contacts
function loadKYARAContacts() {
  const data = JSON.parse(fs.readFileSync('./KYARA_AIRTABLE_CONTACTS.json', 'utf-8'));
  const allContacts = [...data.hot, ...data.warm, ...data.cold, ...data.other];

  // Filter to only Opted-In or contacts with no status
  return allContacts.filter(c => {
    const status = c.relationship || c.allFields?.Status || '';
    return status !== 'Unsubscribed';
  });
}

// Enrich with simplified output
async function enrichContact(contact) {
  console.log(`\n🤖 Enriching: ${contact.email}`);

  const prompt = `Analyze this radio contact and provide concise enrichment for music PR:

Email: ${contact.email}
Genre: ${contact.genre}
Status: ${contact.relationship}

Provide a SINGLE condensed paragraph covering:
- Station name (best guess)
- Contact quality (High/Medium/Low)
- Best for what music/artists
- How to pitch them
- Any data issues

Keep it concise - max 3-4 sentences.`;

  try {
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 300,
      messages: [{ role: 'user', content: prompt }],
    });

    const notes = response.content[0].text;

    // Determine quality from keywords
    let quality = 'Low';
    if (
      notes.toLowerCase().includes('bbc') ||
      notes.toLowerCase().includes('tier-1') ||
      notes.toLowerCase().includes('influential')
    ) {
      quality = 'High';
    } else if (
      notes.toLowerCase().includes('valuable') ||
      notes.toLowerCase().includes('good') ||
      notes.toLowerCase().includes('community')
    ) {
      quality = 'Medium';
    }

    console.log(`   ✅ Quality: ${quality}`);
    return { quality, notes };
  } catch (error) {
    console.log(`   ❌ Failed: ${error.message}`);
    return { quality: 'Low', notes: `Enrichment failed: ${error.message}` };
  }
}

// Update Airtable with simplified structure
async function updateRecord(recordId, enrichment) {
  const updates = {
    fields: {
      'Enrichment Quality': enrichment.quality,
      'Enrichment Notes': enrichment.notes,
      'Last Enriched': new Date().toISOString().split('T')[0],
    },
  };

  try {
    const response = await fetch(`https://api.airtable.com/v0/${BASE_ID}/${TABLE_ID}/${recordId}`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${AIRTABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    });

    if (response.ok) {
      console.log(`   ✅ Updated in Airtable`);
      return true;
    } else {
      const error = await response.text();
      console.log(`   ❌ Update failed: ${error}`);
      return false;
    }
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}`);
    return false;
  }
}

async function main() {
  console.log('🎯 Enriching Opted-In KYARA Contacts Only\n');
  console.log('═══════════════════════════════════════════════════════════\n');

  const contacts = loadKYARAContacts();
  console.log(`✅ Found ${contacts.length} opted-in/active contacts (filtered out unsubscribed)\n`);

  let enriched = 0;
  let updated = 0;

  for (let i = 0; i < contacts.length; i++) {
    const contact = contacts[i];
    console.log(`[${i + 1}/${contacts.length}] ${contact.email}`);

    const enrichment = await enrichContact(contact);
    enriched++;

    const success = await updateRecord(contact.id, enrichment);
    if (success) updated++;

    // Rate limiting
    await new Promise(resolve => setTimeout(resolve, 1500));
  }

  console.log('\n═══════════════════════════════════════════════════════════');
  console.log(`\n✅ Enriched: ${enriched}/${contacts.length}`);
  console.log(`✅ Updated in Airtable: ${updated}/${contacts.length}\n`);
}

main().catch(console.error);
