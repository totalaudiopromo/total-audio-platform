#!/usr/bin/env node

/**
 * Auto-Tag Genres from Enrichment Notes
 *
 * Parses AI enrichment notes to add genre tags to contacts missing them
 */

const fs = require('fs');
const fetch = require('node-fetch');

const AIRTABLE_API_KEY =
  'pat52SEWV8PWmKZfW.d557f03560fdc8aa0895ac6fda0cbffd753054ea2fedbedd53207e7c265469ec';
const BASE_ID = 'appx7uTQWRH8cIC20';
const TABLE_ID = 'tblcZnUsB4Swyjcip';

// Standard genre list (matching Airtable's multiple select options)
const STANDARD_GENRES = [
  'Indie',
  'Alternative',
  'Rock',
  'Metal',
  'Pop',
  'Electronic',
  'Dance',
  'Hip-Hop',
  'R&B / Soul',
  'Jazz / Funk',
  'Folk',
  'Blues',
  'Reggae',
  'Punk',
  'Pop-Punk',
  'Techno',
  'All',
];

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

  console.log(`✅ Total: ${allRecords.length}\n`);
  return allRecords;
}

function extractGenres(enrichmentNotes) {
  if (!enrichmentNotes) return [];

  const genres = [];

  // Look for "GENRES: " line in enrichment notes
  const genresMatch = enrichmentNotes.match(/GENRES?:\s*([^\n]+)/i);

  if (genresMatch) {
    const genresText = genresMatch[1];

    // Parse comma-separated genres
    const extractedGenres = genresText
      .split(/,|;|\band\b/)
      .map(g => g.trim())
      .filter(g => g.length > 0);

    // Map to standard genre names
    extractedGenres.forEach(extracted => {
      const lowerExtracted = extracted.toLowerCase();

      // Direct match
      const directMatch = STANDARD_GENRES.find(sg => sg.toLowerCase() === lowerExtracted);

      if (directMatch) {
        if (!genres.includes(directMatch)) {
          genres.push(directMatch);
        }
        return;
      }

      // Fuzzy matching
      if (lowerExtracted.includes('indie') && !genres.includes('Indie')) {
        genres.push('Indie');
      }
      if (lowerExtracted.includes('alternative') && !genres.includes('Alternative')) {
        genres.push('Alternative');
      }
      if (
        lowerExtracted.includes('rock') &&
        !lowerExtracted.includes('punk') &&
        !genres.includes('Rock')
      ) {
        genres.push('Rock');
      }
      if (lowerExtracted.includes('metal') && !genres.includes('Metal')) {
        genres.push('Metal');
      }
      if (
        lowerExtracted.includes('pop') &&
        !lowerExtracted.includes('punk') &&
        !genres.includes('Pop')
      ) {
        genres.push('Pop');
      }
      if (lowerExtracted.includes('electronic') && !genres.includes('Electronic')) {
        genres.push('Electronic');
      }
      if (lowerExtracted.includes('dance') && !genres.includes('Dance')) {
        genres.push('Dance');
      }
      if (
        lowerExtracted.includes('hip hop') ||
        (lowerExtracted.includes('hip-hop') && !genres.includes('Hip-Hop'))
      ) {
        genres.push('Hip-Hop');
      }
      if (
        (lowerExtracted.includes('r&b') || lowerExtracted.includes('soul')) &&
        !genres.includes('R&B / Soul')
      ) {
        genres.push('R&B / Soul');
      }
      if (
        (lowerExtracted.includes('jazz') || lowerExtracted.includes('funk')) &&
        !genres.includes('Jazz / Funk')
      ) {
        genres.push('Jazz / Funk');
      }
      if (lowerExtracted.includes('folk') && !genres.includes('Folk')) {
        genres.push('Folk');
      }
      if (lowerExtracted.includes('blues') && !genres.includes('Blues')) {
        genres.push('Blues');
      }
      if (lowerExtracted.includes('reggae') && !genres.includes('Reggae')) {
        genres.push('Reggae');
      }
      if (
        lowerExtracted.includes('punk') &&
        !lowerExtracted.includes('pop') &&
        !genres.includes('Punk')
      ) {
        genres.push('Punk');
      }
      if (
        (lowerExtracted.includes('pop punk') || lowerExtracted.includes('pop-punk')) &&
        !genres.includes('Pop-Punk')
      ) {
        genres.push('Pop-Punk');
      }
      if (lowerExtracted.includes('techno') && !genres.includes('Techno')) {
        genres.push('Techno');
      }
    });
  }

  // Fallback: scan the entire enrichment for genre keywords
  if (genres.length === 0) {
    const lowerNotes = enrichmentNotes.toLowerCase();

    if (lowerNotes.includes('indie')) genres.push('Indie');
    if (lowerNotes.includes('alternative')) genres.push('Alternative');
    if (lowerNotes.includes('rock') && !lowerNotes.includes('punk')) genres.push('Rock');
    if (lowerNotes.includes('electronic')) genres.push('Electronic');
    if (lowerNotes.includes('dance')) genres.push('Dance');
  }

  // Default to "All" if BBC or major national station and no specific genres found
  if (genres.length === 0 && enrichmentNotes.includes('BBC')) {
    genres.push('All');
  }

  return genres;
}

async function updateGenres(recordId, newGenres) {
  try {
    const response = await fetch(`https://api.airtable.com/v0/${BASE_ID}/${TABLE_ID}/${recordId}`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${AIRTABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fields: { Genres: newGenres },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return { success: false, error: errorData.error.message };
    }

    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

async function autoTagGenres() {
  console.log('🎵 Auto-Tagging Genres from Enrichment\n');
  console.log('═══════════════════════════════════════════════════════════\n');

  const contacts = await fetchAllContacts();

  // Filter to contacts with enrichment but missing genres
  const needsGenres = contacts.filter(c => {
    const currentGenres = c.fields.Genres || [];
    const hasEnrichment = c.fields['Enrichment Notes'];

    return hasEnrichment && currentGenres.length === 0;
  });

  console.log(`📊 Genre Tagging Status:`);
  console.log(`   Total contacts: ${contacts.length}`);
  console.log(`   Have enrichment: ${contacts.filter(c => c.fields['Enrichment Notes']).length}`);
  console.log(`   Need genres: ${needsGenres.length}\n`);

  if (needsGenres.length === 0) {
    console.log('✅ All enriched contacts already have genres!\n');
    return { stats: { total: 0, tagged: 0, errors: 0 } };
  }

  console.log(`Starting genre tagging for ${needsGenres.length} contacts...\n`);

  const stats = {
    total: needsGenres.length,
    tagged: 0,
    errors: 0,
    noGenresFound: 0,
  };

  const taggings = [];

  for (let i = 0; i < needsGenres.length; i++) {
    const contact = needsGenres[i];
    const email = contact.fields.Email || 'no-email';
    const enrichmentNotes = contact.fields['Enrichment Notes'];

    console.log(`[${i + 1}/${needsGenres.length}] ${email}`);

    // Extract genres
    const extractedGenres = extractGenres(enrichmentNotes);

    if (extractedGenres.length > 0) {
      console.log(`   Genres: ${extractedGenres.join(', ')}`);

      // Update Airtable
      const result = await updateGenres(contact.id, extractedGenres);

      if (result.success) {
        stats.tagged++;
        taggings.push({
          email,
          station: contact.fields.Station || 'Unknown',
          genres: extractedGenres,
        });
        console.log(`   ✅ Updated in Airtable`);
      } else {
        stats.errors++;
        console.log(`   ❌ Update failed: ${result.error}`);
      }
    } else {
      stats.noGenresFound++;
      console.log(`   ⏭️  No genres found in enrichment`);
    }

    console.log('');

    await new Promise(resolve => setTimeout(resolve, 100));
  }

  console.log('═══════════════════════════════════════════════════════════\n');
  console.log('📊 TAGGING SUMMARY:\n');
  console.log(`Total contacts processed: ${stats.total}`);
  console.log(`   ✅ Genres added: ${stats.tagged}`);
  console.log(`   ⏭️  No genres found: ${stats.noGenresFound}`);
  console.log(`   ❌ Errors: ${stats.errors}\n`);

  if (taggings.length > 0) {
    console.log('🎵 GENRE BREAKDOWN:\n');

    // Count genre frequency
    const genreCounts = {};
    taggings.forEach(t => {
      t.genres.forEach(g => {
        genreCounts[g] = (genreCounts[g] || 0) + 1;
      });
    });

    Object.entries(genreCounts)
      .sort((a, b) => b[1] - a[1])
      .forEach(([genre, count]) => {
        console.log(`   ${genre}: ${count} contacts`);
      });

    console.log('');
  }

  fs.writeFileSync('./GENRE_TAGGING_REPORT.json', JSON.stringify({ stats, taggings }, null, 2));
  console.log('💾 Report saved: GENRE_TAGGING_REPORT.json\n');
  console.log('✅ Genre tagging complete!\n');

  return { stats, taggings };
}

if (require.main === module) {
  autoTagGenres().catch(console.error);
}

module.exports = { autoTagGenres };
