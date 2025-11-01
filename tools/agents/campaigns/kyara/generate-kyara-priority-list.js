#!/usr/bin/env node

/**
 * Generate KYARA Campaign Priority Contact List
 *
 * Creates a prioritized list of contacts to pitch for KYARA campaign
 * Filters by: Indie/Alternative genre, Opted-In status, Quality rating
 */

const fs = require('fs');
const fetch = require('node-fetch');

const AIRTABLE_API_KEY =
  'pat52SEWV8PWmKZfW.d557f03560fdc8aa0895ac6fda0cbffd753054ea2fedbedd53207e7c265469ec';
const BASE_ID = 'appx7uTQWRH8cIC20';
const TABLE_ID = 'tblcZnUsB4Swyjcip';

async function fetchAllContacts() {
  console.log('📥 Fetching all contacts from Airtable...\n');
  const allRecords = [];
  let offset = null;

  do {
    const url = offset
      ? `https://api.airtable.com/v0/${BASE_ID}/${TABLE_ID}?offset=${offset}`
      : `https://api.airtable.com/v0/${BASE_ID}/${TABLE_ID}`;

    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${AIRTABLE_API_KEY}` },
    });

    const data = await response.json();
    allRecords.push(...data.records);
    offset = data.offset;
  } while (offset);

  console.log(`✅ Total contacts: ${allRecords.length}\n`);
  return allRecords;
}

function isRelevantForKYARA(contact) {
  const genres = contact.fields.Genres || [];
  const status = contact.fields.Status || '';
  const enrichmentNotes = contact.fields['Enrichment Notes'] || '';

  // Must be opted-in (subscribed)
  if (status !== 'Opted-In') return false;

  // Must have indie or alternative genre (or enrichment mentions it)
  const hasIndieAlt = genres.some(
    g =>
      g.toLowerCase().includes('indie') ||
      g.toLowerCase().includes('alternative') ||
      g.toLowerCase().includes('all')
  );

  const notesHasIndieAlt =
    enrichmentNotes.toLowerCase().includes('indie') ||
    enrichmentNotes.toLowerCase().includes('alternative');

  if (!hasIndieAlt && !notesHasIndieAlt) return false;

  return true;
}

function calculatePriority(contact) {
  const quality = contact.fields['Enrichment Quality'] || 'Low';
  const station = contact.fields.Station || '';
  const email = contact.fields.Email || '';
  const enrichmentNotes = contact.fields['Enrichment Notes'] || '';

  let score = 0;

  // Quality scoring
  if (quality === 'High') score += 100;
  if (quality === 'Medium') score += 50;
  if (quality === 'Low') score += 10;

  // BBC bonus
  if (station.includes('BBC') || email.includes('bbc.co.uk')) {
    score += 50;
  }

  // triple j bonus (KYARA specific - Australian artist)
  if (station.includes('triple j') || email.includes('abc.net.au')) {
    score += 100; // Highest priority for Australian stations
  }

  // 6 Music bonus (indie/alternative focus)
  if (station.includes('6 Music') || enrichmentNotes.includes('6 Music')) {
    score += 30;
  }

  // Community/specialist radio bonus (indie-friendly)
  if (
    enrichmentNotes.toLowerCase().includes('community') ||
    enrichmentNotes.toLowerCase().includes('specialist') ||
    enrichmentNotes.toLowerCase().includes('independent music')
  ) {
    score += 20;
  }

  // Previous engagement bonus
  const replyStatus = contact.fields['Reply Status'] || '';
  if (replyStatus === 'Replied') {
    score += 15;
  }

  return score;
}

async function generateKYARAPriorityList() {
  console.log('🎵 KYARA Campaign - Priority Contact List\n');
  console.log('═══════════════════════════════════════════════════════════\n');

  const allContacts = await fetchAllContacts();

  // Filter for KYARA-relevant contacts
  const relevantContacts = allContacts.filter(isRelevantForKYARA);

  console.log(`📊 Filtering Results:`);
  console.log(`   Total contacts: ${allContacts.length}`);
  console.log(`   Opted-In with Indie/Alt: ${relevantContacts.length}\n`);

  // Calculate priority scores
  const prioritized = relevantContacts.map(contact => ({
    contact,
    score: calculatePriority(contact),
    email: contact.fields.Email || '',
    name:
      `${contact.fields['First Name'] || ''} ${contact.fields['Last Name'] || ''}`.trim() ||
      'Unknown',
    station: contact.fields.Station || 'Unknown',
    quality: contact.fields['Enrichment Quality'] || 'Low',
    genres: contact.fields.Genres || [],
    enrichmentNotes: contact.fields['Enrichment Notes'] || '',
  }));

  // Sort by priority score (highest first)
  prioritized.sort((a, b) => b.score - a.score);

  // Group by priority tier
  const tiers = {
    tier1: prioritized.filter(p => p.score >= 150), // Top priority (BBC, triple j, High quality)
    tier2: prioritized.filter(p => p.score >= 80 && p.score < 150), // High priority
    tier3: prioritized.filter(p => p.score >= 40 && p.score < 80), // Medium priority
    tier4: prioritized.filter(p => p.score < 40), // Lower priority
  };

  console.log('📋 PRIORITY TIERS:\n');
  console.log(`   🔥 Tier 1 (TOP PRIORITY): ${tiers.tier1.length} contacts`);
  console.log(`   ⭐ Tier 2 (HIGH): ${tiers.tier2.length} contacts`);
  console.log(`   🌟 Tier 3 (MEDIUM): ${tiers.tier3.length} contacts`);
  console.log(`   ✨ Tier 4 (LOWER): ${tiers.tier4.length} contacts\n`);

  console.log('═══════════════════════════════════════════════════════════\n');

  // Create markdown report
  let markdownReport = `# KYARA Campaign - Priority Contact List

**Generated**: ${new Date().toISOString().split('T')[0]}
**Total Relevant Contacts**: ${prioritized.length}

---

## 🔥 TIER 1: TOP PRIORITY (${tiers.tier1.length} contacts)

**Criteria**: BBC/triple j, High Quality, Specialist Shows

`;

  tiers.tier1.forEach((p, i) => {
    markdownReport += `### ${i + 1}. ${p.name} - ${p.station}\n`;
    markdownReport += `- **Email**: ${p.email}\n`;
    markdownReport += `- **Quality**: ${p.quality} (Score: ${p.score})\n`;
    markdownReport += `- **Genres**: ${p.genres.join(', ') || 'Not specified'}\n`;

    // Extract pitch strategy from enrichment notes
    const strategyMatch = p.enrichmentNotes.match(/STRATEGY:\s*([^\n]+(?:\n(?!ISSUES:)[^\n]+)*)/i);
    if (strategyMatch) {
      markdownReport += `- **Strategy**: ${strategyMatch[1].trim()}\n`;
    }

    markdownReport += '\n';
  });

  markdownReport += `---

## ⭐ TIER 2: HIGH PRIORITY (${tiers.tier2.length} contacts)

**Criteria**: Medium-High Quality, Established Stations

`;

  tiers.tier2.slice(0, 20).forEach((p, i) => {
    // Show first 20
    markdownReport += `${i + 1}. **${p.name}** - ${p.station} (${p.email}) - ${p.quality}\n`;
  });

  if (tiers.tier2.length > 20) {
    markdownReport += `\n... and ${tiers.tier2.length - 20} more contacts\n`;
  }

  markdownReport += `\n---

## 🌟 TIER 3: MEDIUM PRIORITY (${tiers.tier3.length} contacts)

**Criteria**: Community Radio, Regional Stations

`;

  tiers.tier3.slice(0, 10).forEach((p, i) => {
    // Show first 10
    markdownReport += `${i + 1}. **${p.name}** - ${p.station} (${p.email})\n`;
  });

  if (tiers.tier3.length > 10) {
    markdownReport += `\n... and ${tiers.tier3.length - 10} more contacts\n`;
  }

  markdownReport += `\n---

## ✨ TIER 4: LOWER PRIORITY (${tiers.tier4.length} contacts)

**Criteria**: Low Quality or Unclear

_Full list available in JSON export_

---

## 📊 KYARA CAMPAIGN STRATEGY

### Week 1: Tier 1 Focus (Top ${tiers.tier1.length} contacts)
- **triple j**: Anika Luna (Home & Hosed) - KEY TARGET
- **BBC 6 Music**: Prioritise specialist shows
- **High Quality**: Focus on proven indie/alternative champions

### Week 2: Tier 2 Expansion (${tiers.tier2.length} contacts)
- Regional BBC stations
- Established community stations
- Medium-quality indie contacts

### Week 3: Tier 3 + Tier 4 (${tiers.tier3.length + tiers.tier4.length} contacts)
- Broader community radio
- International indie stations

---

## 🎯 KEY CONTACTS FOR KYARA

### triple j Australia (Highest Priority)
`;

  const tripleJContacts = tiers.tier1.filter(
    p => p.station.includes('triple j') || p.email.includes('abc.net.au')
  );

  tripleJContacts.forEach(p => {
    markdownReport += `- **${p.name}** (${p.email}) - ${p.station}\n`;
  });

  markdownReport += `\n### BBC 6 Music (UK Priority)
`;

  const bbc6Contacts = tiers.tier1.filter(
    p => p.station.includes('6 Music') || p.enrichmentNotes.includes('6 Music')
  );

  bbc6Contacts.forEach(p => {
    markdownReport += `- **${p.name}** (${p.email}) - ${p.station}\n`;
  });

  // Save files
  fs.writeFileSync('./KYARA_PRIORITY_LIST.md', markdownReport);
  fs.writeFileSync(
    './KYARA_PRIORITY_LIST.json',
    JSON.stringify(
      {
        generated: new Date().toISOString(),
        totalContacts: prioritized.length,
        tiers: {
          tier1: tiers.tier1.map(p => ({
            name: p.name,
            email: p.email,
            station: p.station,
            quality: p.quality,
            score: p.score,
            genres: p.genres,
          })),
          tier2: tiers.tier2.map(p => ({
            name: p.name,
            email: p.email,
            station: p.station,
            quality: p.quality,
            score: p.score,
          })),
          tier3: tiers.tier3.map(p => ({
            name: p.name,
            email: p.email,
            station: p.station,
          })),
          tier4: tiers.tier4.map(p => ({
            name: p.name,
            email: p.email,
            station: p.station,
          })),
        },
      },
      null,
      2
    )
  );

  console.log('✅ Priority list generated!\n');
  console.log('📄 Files created:');
  console.log('   - KYARA_PRIORITY_LIST.md (readable report)');
  console.log('   - KYARA_PRIORITY_LIST.json (full data export)\n');

  return { tiers, prioritized };
}

if (require.main === module) {
  generateKYARAPriorityList().catch(console.error);
}

module.exports = { generateKYARAPriorityList };
