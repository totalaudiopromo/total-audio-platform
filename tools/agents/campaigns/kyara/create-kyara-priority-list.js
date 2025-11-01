#!/usr/bin/env node

/**
 * Create KYARA Campaign Priority List
 *
 * Generates a prioritized contact list for the KYARA campaign based on:
 * - Enrichment quality (High/Medium first)
 * - Genre match (Electronic, Dance, Alternative, Indie)
 * - Region (UK preferred)
 * - Subscription status (subscribed only)
 */

const fetch = require('node-fetch');
const fs = require('fs');

const AIRTABLE_API_KEY =
  'pat52SEWV8PWmKZfW.d557f03560fdc8aa0895ac6fda0cbffd753054ea2fedbedd53207e7c265469ec';
const BASE_ID = 'appx7uTQWRH8cIC20';
const TABLE_ID = 'tblcZnUsB4Swyjcip';

// KYARA is electronic/dance/alternative
const KYARA_GENRES = ['Electronic', 'Dance', 'Alternative', 'Indie', 'Techno', 'All'];

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

function scoreContact(contact) {
  let score = 0;
  const fields = contact.fields;

  // Enrichment Quality (0-40 points)
  const quality = fields['Enrichment Quality'];
  if (quality === 'High') score += 40;
  else if (quality === 'Medium') score += 25;
  else if (quality === 'Low') score += 10;

  // Genre Match (0-30 points)
  const genres = fields.Genres || [];
  const genreMatches = genres.filter(g => KYARA_GENRES.includes(g)).length;
  score += genreMatches * 10; // 10 points per matching genre

  // Region (0-15 points)
  const region = fields['Region / Country'];
  if (region === 'UK') score += 15;
  else if (region === 'Europe') score += 10;
  else if (region === 'Australia') score += 8;
  else if (region === 'USA' || region === 'Canada') score += 5;

  // Has enrichment notes (0-10 points)
  if (fields['Enrichment Notes']) score += 10;

  // Recent engagement (0-5 points)
  if (fields['Last Engagement']) score += 5;

  return {
    score,
    contact: fields,
    recordId: contact.id,
  };
}

async function createPriorityList() {
  console.log('🎯 Creating KYARA Campaign Priority List\n');
  console.log('═══════════════════════════════════════════════════════════\n');

  const contacts = await fetchAllContacts();

  // Filter out contacts without emails or enrichment
  const validContacts = contacts.filter(
    c => c.fields.Email && c.fields.Email !== 'no-email' && c.fields['Enrichment Notes']
  );

  console.log(`📊 Valid contacts for KYARA: ${validContacts.length}/${contacts.length}\n`);

  // Score all contacts
  const scored = validContacts.map(scoreContact);

  // Sort by score (highest first)
  scored.sort((a, b) => b.score - a.score);

  // Generate priority tiers
  const tier1 = scored.filter(s => s.score >= 60); // High priority
  const tier2 = scored.filter(s => s.score >= 40 && s.score < 60); // Medium priority
  const tier3 = scored.filter(s => s.score >= 20 && s.score < 40); // Low priority

  console.log('🎖️ Priority Tiers:\n');
  console.log(`   Tier 1 (High Priority):   ${tier1.length} contacts (Score 60+)`);
  console.log(`   Tier 2 (Medium Priority): ${tier2.length} contacts (Score 40-59)`);
  console.log(`   Tier 3 (Low Priority):    ${tier3.length} contacts (Score 20-39)`);
  console.log(
    `   Not Recommended:          ${scored.filter(s => s.score < 20).length} contacts (Score <20)\n`
  );

  // Generate Markdown report
  let markdown = `# KYARA Campaign - Priority Contact List

**Generated**: ${new Date().toLocaleDateString('en-GB')}

## Campaign Overview
- **Artist**: KYARA
- **Genres**: Electronic, Dance, Alternative, Indie
- **Target Regions**: UK (primary), Europe, Australia, North America
- **Total Contacts Analyzed**: ${contacts.length}
- **Viable Contacts**: ${validContacts.length}

---

## Tier 1: High Priority (${tier1.length} contacts)

These contacts have the highest match score (60+) based on enrichment quality, genre alignment, and region.

| Rank | Email | Station | Quality | Genres | Region | Score | Notes |
|------|-------|---------|---------|--------|--------|-------|-------|
`;

  tier1.slice(0, 50).forEach((item, idx) => {
    const c = item.contact;
    const genres = (c.Genres || []).join(', ');
    const notes = (c['Enrichment Notes'] || '').split('\n')[0].substring(0, 80);

    markdown += `| ${idx + 1} | ${c.Email} | ${c.Station || 'Unknown'} | ${c['Enrichment Quality'] || 'N/A'} | ${genres} | ${c['Region / Country'] || 'N/A'} | ${item.score} | ${notes}... |\n`;
  });

  markdown += `\n---\n\n## Tier 2: Medium Priority (${tier2.length} contacts)\n\nGood potential contacts with moderate match scores (40-59).\n\n`;

  markdown += `| Rank | Email | Station | Quality | Genres | Region | Score |\n`;
  markdown += `|------|-------|---------|---------|--------|--------|-------|\n`;

  tier2.slice(0, 30).forEach((item, idx) => {
    const c = item.contact;
    const genres = (c.Genres || []).join(', ');

    markdown += `| ${idx + 1} | ${c.Email} | ${c.Station || 'Unknown'} | ${c['Enrichment Quality'] || 'N/A'} | ${genres} | ${c['Region / Country'] || 'N/A'} | ${item.score} |\n`;
  });

  markdown += `\n---\n\n## Tier 3: Low Priority (${tier3.length} contacts)\n\nConsider these if Tier 1 & 2 are exhausted.\n\n`;
  markdown += `**Top 20 from Tier 3:**\n\n`;

  tier3.slice(0, 20).forEach((item, idx) => {
    const c = item.contact;
    markdown += `${idx + 1}. **${c.Email}** - ${c.Station || 'Unknown'} (Score: ${item.score})\n`;
  });

  markdown += `\n---\n\n## Pitch Strategy by Tier\n\n### Tier 1 Approach\n- Personalized pitches referencing their show/station\n- Highlight KYARA's electronic/dance elements\n- Include specific reasons why KYARA fits their programming\n- Send during optimal times (Tuesday-Thursday, 10am-2pm)\n\n### Tier 2 Approach\n- Semi-personalized email templates\n- Focus on genre match and previous artist comparisons\n- Include streaming links and social proof\n\n### Tier 3 Approach\n- Broader outreach campaigns\n- Standard pitch with press kit\n- Lower expectation, higher volume\n\n---\n\n## Next Steps\n\n1. **Start with Tier 1**: Focus on the top 50 high-priority contacts\n2. **Personalize each pitch**: Use enrichment notes for context\n3. **Track responses**: Update Airtable with engagement status\n4. **Follow up**: 3-5 days after initial pitch if no response\n5. **Move to Tier 2**: Once Tier 1 is exhausted or after 2 weeks\n\n---\n\n**Note**: This list is based on AI enrichment data. Always verify contact details before pitching.\n`;

  // Write to file
  const filename = 'KYARA_PRIORITY_CONTACT_LIST.md';
  fs.writeFileSync(filename, markdown);

  console.log(`✅ Priority list generated: ${filename}\n`);
  console.log('═══════════════════════════════════════════════════════════\n');

  console.log('📊 Summary Statistics:\n');
  console.log(`Total viable contacts: ${validContacts.length}`);
  console.log(`Tier 1 (60+ score):    ${tier1.length} contacts`);
  console.log(`Tier 2 (40-59 score):  ${tier2.length} contacts`);
  console.log(`Tier 3 (20-39 score):  ${tier3.length} contacts\n`);

  console.log('🎯 Top 10 Priority Contacts:\n');
  scored.slice(0, 10).forEach((item, idx) => {
    const c = item.contact;
    console.log(`${idx + 1}. ${c.Email}`);
    console.log(`   Station: ${c.Station || 'Unknown'}`);
    console.log(`   Quality: ${c['Enrichment Quality'] || 'N/A'}`);
    console.log(`   Genres: ${(c.Genres || []).join(', ')}`);
    console.log(`   Score: ${item.score}\n`);
  });

  console.log(`✅ KYARA priority list complete! Check ${filename}\n`);
}

createPriorityList();
