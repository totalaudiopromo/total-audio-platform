#!/usr/bin/env node

const fetch = require('node-fetch');

const AIRTABLE_API_KEY =
  'pat52SEWV8PWmKZfW.d557f03560fdc8aa0895ac6fda0cbffd753054ea2fedbedd53207e7c265469ec';
const BASE_ID = 'appx7uTQWRH8cIC20';
const TABLE_ID = 'tblcZnUsB4Swyjcip';

const NEW_CONTACTS = [
  {
    Email: 'mooney.claire@abc.net.au',
    'First Name': 'Claire',
    'Last Name': 'Mooney',
    Station: 'Triple J (ABC)',
    'Contact Type': 'Music Director',
    'Region / Country': 'Australia',
    Genres: ['Electronic', 'Pop', 'Dance', 'Alternative', 'Indie', 'All'],
    Notes: 'New Triple J Music Director (2024). Key contact for national Australian radio play.',
    'Enrichment Quality': 'High',
    'Enrichment Notes':
      "QUALITY: High\n\nSTATION: Triple J (ABC) - National Youth Radio\n\nGENRES: Electronic, Pop, Dance, Alternative, Indie\n\nINTELLIGENCE: Claire Mooney is the Music Director at Triple J, Australia's national youth radio station. This is THE key contact for getting airplay on Australia's most influential alternative/indie radio station. Triple J has launched countless Australian and international artists.\n\nSTRATEGY: Personalized pitch highlighting electronic/pop crossover. Triple J champions new music and independent artists. Reference previous Triple J support (Yearn played on Home & Hosed).\n\nISSUES: N/A - This is a priority contact.",
  },
  {
    Email: 'luna.anika@abc.net.au',
    'First Name': 'Anika',
    'Last Name': 'Luna',
    Station: 'Triple J (ABC)',
    Show: 'Home & Hosed',
    'Contact Type': 'Show Producer/Host',
    'Region / Country': 'Australia',
    Genres: ['Electronic', 'Pop', 'Dance', 'Alternative', 'Indie', 'All'],
    Notes:
      'Triple J Home & Hosed - THE show for independent Australian artists. KYARA\'s "Yearn" was played on this show in August 2024 by Jaimee Taylor-Neilsen. Warm relationship.',
    'Enrichment Quality': 'High',
    'Enrichment Notes':
      'QUALITY: High\n\nSTATION: Triple J (ABC) - National Youth Radio\n\nSHOW: Home & Hosed\n\nGENRES: Electronic, Pop, Dance, Alternative, Indie\n\nINTELLIGENCE: Anika Luna works on Home & Hosed, Triple J\'s flagship show for independent and emerging Australian artists. This show is THE priority for new releases. Previous support: KYARA\'s debut single "Yearn" was played on Home & Hosed by Jaimee Taylor-Neilsen in August 2024.\n\nSTRATEGY: Warm follow-up pitch. Reference the previous play of "Yearn" and the positive response. Position new track as natural progression. Home & Hosed is the gateway to broader Triple J playlist rotation.\n\nISSUES: N/A - This is THE most important Australian contact. Proven track record of support.',
  },
];

async function checkIfExists(email) {
  const url = `https://api.airtable.com/v0/${BASE_ID}/${TABLE_ID}?filterByFormula={Email}="${email}"`;

  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${AIRTABLE_API_KEY}` },
  });

  const data = await response.json();
  return data.records.length > 0 ? data.records[0] : null;
}

async function addContact(contact) {
  const response = await fetch(`https://api.airtable.com/v0/${BASE_ID}/${TABLE_ID}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${AIRTABLE_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ fields: contact }),
  });

  return await response.json();
}

async function updateContact(recordId, contact) {
  const response = await fetch(`https://api.airtable.com/v0/${BASE_ID}/${TABLE_ID}/${recordId}`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${AIRTABLE_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ fields: contact }),
  });

  return await response.json();
}

async function main() {
  console.log('🇦🇺 Adding Triple J Contacts to Airtable\n');
  console.log('═══════════════════════════════════════════════════════════\n');

  for (const contact of NEW_CONTACTS) {
    console.log(`Checking: ${contact.Email}...`);

    const existing = await checkIfExists(contact.Email);

    if (existing) {
      console.log(`   ✅ Already exists - updating with new info`);
      await updateContact(existing.id, contact);
      console.log(`   📝 Updated with Triple J context\n`);
    } else {
      console.log(`   ➕ Adding new contact`);
      await addContact(contact);
      console.log(`   ✅ Added to Airtable\n`);
    }

    await new Promise(resolve => setTimeout(resolve, 200));
  }

  console.log('═══════════════════════════════════════════════════════════\n');
  console.log('✅ Triple J contacts processed!\n');
  console.log('📊 Summary:\n');
  console.log('1. Claire Mooney - Triple J Music Director (NEW CONTACT)');
  console.log('2. Anika Luna - Home & Hosed (WARM - played "Yearn" in Aug 2024)\n');
  console.log('🎯 Priority: Anika Luna (Home & Hosed) is #1 priority for KYARA\n');
}

main();
