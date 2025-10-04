#!/usr/bin/env node

const fetch = require('node-fetch');
const fs = require('fs');

const AIRTABLE_API_KEY = 'pat52SEWV8PWmKZfW.d557f03560fdc8aa0895ac6fda0cbffd753054ea2fedbedd53207e7c265469ec';
const BASE_ID = 'appx7uTQWRH8cIC20';
const TABLE_ID = 'tblcZnUsB4Swyjcip';

// KYARA = Electro Pop (Electronic + Pop + Dance)
const KYARA_GENRES = ['Electronic', 'Pop', 'Dance', 'Alternative', 'Indie', 'All'];

async function fetchAllContacts() {
  const allRecords = [];
  let offset = null;

  do {
    const url = offset
      ? `https://api.airtable.com/v0/${BASE_ID}/${TABLE_ID}?offset=${offset}`
      : `https://api.airtable.com/v0/${BASE_ID}/${TABLE_ID}`;

    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${AIRTABLE_API_KEY}` }
    });

    const data = await response.json();
    allRecords.push(...data.records);
    offset = data.offset;
  } while (offset);

  return allRecords;
}

async function main() {
  console.log('🇦🇺 Australian Electro Pop Contacts for KYARA\n');
  
  const contacts = await fetchAllContacts();
  
  const australianContacts = contacts.filter(c => {
    const f = c.fields;
    if (f['Region / Country'] !== 'Australia') return false;
    if (!f.Email || f.Email === 'no-email') return false;
    
    const genres = f.Genres || [];
    return genres.some(g => KYARA_GENRES.includes(g));
  });

  australianContacts.sort((a, b) => {
    const qualityOrder = { High: 0, Medium: 1, Low: 2 };
    return qualityOrder[a.fields['Enrichment Quality'] || 'Low'] - qualityOrder[b.fields['Enrichment Quality'] || 'Low'];
  });

  console.log(`Found ${australianContacts.length} Australian contacts:\n`);
  
  australianContacts.forEach((c, i) => {
    const f = c.fields;
    console.log(`${i + 1}. ${f.Email}`);
    console.log(`   Name: ${f['First Name'] || ''} ${f['Last Name'] || ''}`);
    console.log(`   Station: ${f.Station || 'Unknown'}`);
    console.log(`   Quality: ${f['Enrichment Quality'] || 'N/A'}`);
    console.log(`   Genres: ${(f.Genres || []).join(', ')}`);
    if (f.Show) console.log(`   Show: ${f.Show}`);
    console.log('');
  });

  // Export CSV
  let csv = 'Email,First Name,Last Name,Station,Show,Quality,Genres,Notes\n';
  australianContacts.forEach(c => {
    const f = c.fields;
    const notes = (f['Enrichment Notes'] || '').split('\n')[0].replace(/"/g, '""');
    csv += `"${f.Email}","${f['First Name'] || ''}","${f['Last Name'] || ''}","${f.Station || ''}","${f.Show || ''}","${f['Enrichment Quality'] || ''}","${(f.Genres || []).join('; ')}","${notes}"\n`;
  });

  fs.writeFileSync('australian-electropop-contacts.csv', csv);
  console.log('✅ Exported to australian-electropop-contacts.csv\n');
}

main();
