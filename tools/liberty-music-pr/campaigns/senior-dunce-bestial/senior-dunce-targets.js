#!/usr/bin/env node

/**
 * Senior Dunce - Quick Target List
 * Just run this to get your targets
 */

const fs = require('fs');

// Your WARM data
const WARM = { plays: 145, stations: 7 };

// Parse your CSV
function getTargets() {
  const csv = fs.readFileSync('/Users/chrisschofield/Downloads/Contacts-EVERYTHING.csv', 'utf8');
  const lines = csv.split('\n');
  const headers = lines[0].replace(/^\uFEFF/, '').split(',');
  
  const contacts = [];
  for (let i = 1; i < lines.length; i++) {
    if (lines[i].trim()) {
      const values = lines[i].split(',');
      const contact = {};
      headers.forEach((header, j) => contact[header.trim()] = values[j] ? values[j].trim() : '');
      contacts.push(contact);
    }
  }
  
  // UK radio contacts only
  return contacts.filter(c => 
    c['Contact Type']?.toLowerCase().includes('radio') &&
    c.Email?.includes('@') &&
    c['Region / Country']?.toLowerCase().includes('uk')
  );
}

// Prioritize them
function prioritize(contacts) {
  return contacts.map(c => {
    let score = 0;
    if (c.Email?.includes('bbc.co.uk')) score += 100;
    if (c.Status?.includes('Opted-In')) score += 50;
    if (!c['Last Email Date']) score += 30;
    return { ...c, score };
  }).sort((a, b) => b.score - a.score);
}

// Run it
const targets = prioritize(getTargets());

console.log(`🎵 Senior Dunce - ${WARM.plays} plays, ${WARM.stations} stations\n`);
console.log(`📧 ${targets.length} UK radio contacts to target:\n`);

targets.slice(0, 10).forEach((t, i) => {
  console.log(`${i+1}. ${t.Station} - ${t.Email}`);
  console.log(`   ${t['First Name']} ${t['Last Name']} | ${t.Status} | Score: ${t.score}\n`);
});

console.log(`🎯 Top 3 for this week:`);
targets.slice(0, 3).forEach((t, i) => {
  console.log(`${i+1}. ${t.Email} - ${t.Station}`);
});
