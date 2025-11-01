#!/usr/bin/env node

/**
 * Enrich All Airtable Contacts with AI
 *
 * Uses Claude Sonnet 4.5 to enrich all contacts that haven't been enriched yet
 */

const fs = require('fs');
const fetch = require('node-fetch');
const Anthropic = require('@anthropic-ai/sdk');

const AIRTABLE_API_KEY =
  'pat52SEWV8PWmKZfW.d557f03560fdc8aa0895ac6fda0cbffd753054ea2fedbedd53207e7c265469ec';
const BASE_ID = 'appx7uTQWRH8cIC20';
const TABLE_ID = 'tblcZnUsB4Swyjcip';

const anthropic = new Anthropic({
  apiKey:
    process.env.ANTHROPIC_API_KEY ||
    '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',
});

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

async function enrichContact(contact) {
  const email = contact.fields.Email || '';
  const station = contact.fields.Station || 'Unknown';
  const firstName = contact.fields['First Name'] || '';
  const lastName = contact.fields['Last Name'] || '';
  const show = contact.fields.Show || '';
  const genres = contact.fields.Genres || [];
  const notes = contact.fields.Notes || '';
  const contactType = contact.fields['Contact Type'] || '';

  const prompt = `Analyze this radio contact and provide intelligence for music promotion:

**Contact Information:**
- Email: ${email}
- Name: ${firstName} ${lastName}
- Station: ${station}
- Show: ${show}
- Contact Type: ${contactType}
- Current Genres: ${genres.join(', ') || 'None listed'}
- Notes: ${notes}

**Provide:**
1. **Quality Assessment**: High/Medium/Low (High = BBC/major stations, Medium = established community/regional, Low = unclear/invalid)
2. **Station Identification**: What is the actual station name and format?
3. **Genre Classification**: What genres does this station/show focus on? (list 2-5 genres)
4. **Contact Intelligence**: Who is this person? What's their role? Why would they be valuable for music promotion?
5. **Pitch Strategy**: How should you approach this contact? What makes them unique?
6. **Data Quality Issues**: Any red flags or missing information?

**Format your response as:**

QUALITY: [High/Medium/Low]

STATION: [Station name and format]

GENRES: [Genre1, Genre2, Genre3]

INTELLIGENCE: [2-3 sentences about this contact]

STRATEGY: [1-2 sentences on how to pitch]

ISSUES: [Any data quality concerns or N/A]`;

  try {
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 500,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    const responseText = message.content[0].text;

    // Parse response
    const qualityMatch = responseText.match(/QUALITY:\s*(\w+)/i);
    const quality = qualityMatch ? qualityMatch[1] : 'Low';

    // Extract station name
    const stationMatch = responseText.match(/STATION:\s*([^\n]+)/i);
    let stationName = null;
    if (stationMatch) {
      stationName = stationMatch[1]
        .trim()
        .replace(/^[*-]\s*/, '')
        .replace(/\s*-\s*.*$/, '')
        .replace(/\(.*?\)/, '')
        .trim();

      const skipTerms = ['unknown', 'unclear', 'not specified', 'n/a'];
      if (skipTerms.some(term => stationName.toLowerCase().includes(term))) {
        stationName = null;
      }
    }

    // Extract genres
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

    let extractedGenres = [];
    const genresMatch = responseText.match(/GENRES?:\s*([^\n]+)/i);
    if (genresMatch) {
      const genresList = genresMatch[1]
        .split(/,|;|\band\b/)
        .map(g => g.trim())
        .filter(g => g.length > 0);

      genresList.forEach(extracted => {
        const lowerExtracted = extracted.toLowerCase();
        if (lowerExtracted.includes('indie')) extractedGenres.push('Indie');
        if (lowerExtracted.includes('alternative') || lowerExtracted.includes('alt'))
          extractedGenres.push('Alternative');
        if (lowerExtracted.includes('rock') && !lowerExtracted.includes('punk'))
          extractedGenres.push('Rock');
        if (lowerExtracted.includes('metal')) extractedGenres.push('Metal');
        if (lowerExtracted.includes('pop') && !lowerExtracted.includes('punk'))
          extractedGenres.push('Pop');
        if (lowerExtracted.includes('electronic') || lowerExtracted.includes('electro'))
          extractedGenres.push('Electronic');
        if (lowerExtracted.includes('dance') || lowerExtracted.includes('edm'))
          extractedGenres.push('Dance');
        if (
          lowerExtracted.includes('hip-hop') ||
          lowerExtracted.includes('hip hop') ||
          lowerExtracted.includes('rap')
        )
          extractedGenres.push('Hip-Hop');
        if (lowerExtracted.includes('r&b') || lowerExtracted.includes('soul'))
          extractedGenres.push('R&B / Soul');
        if (lowerExtracted.includes('jazz') || lowerExtracted.includes('funk'))
          extractedGenres.push('Jazz / Funk');
        if (lowerExtracted.includes('folk')) extractedGenres.push('Folk');
        if (lowerExtracted.includes('blues')) extractedGenres.push('Blues');
        if (lowerExtracted.includes('reggae')) extractedGenres.push('Reggae');
        if (lowerExtracted.includes('punk') && !lowerExtracted.includes('pop'))
          extractedGenres.push('Punk');
        if (lowerExtracted.includes('pop-punk') || lowerExtracted.includes('pop punk')) {
          extractedGenres = extractedGenres.filter(g => g !== 'Pop' && g !== 'Punk');
          extractedGenres.push('Pop-Punk');
        }
        if (lowerExtracted.includes('techno')) extractedGenres.push('Techno');
        if (
          lowerExtracted.includes('all') ||
          lowerExtracted.includes('eclectic') ||
          lowerExtracted.includes('variety')
        )
          extractedGenres.push('All');
      });
    }

    extractedGenres = [...new Set(extractedGenres)];

    // Extract region/country
    let region = null;
    if (
      responseText.toLowerCase().includes('uk') ||
      responseText.toLowerCase().includes('united kingdom') ||
      responseText.toLowerCase().includes('england') ||
      responseText.toLowerCase().includes('scotland') ||
      responseText.toLowerCase().includes('wales') ||
      responseText.toLowerCase().includes('northern ireland')
    ) {
      region = 'UK';
    } else if (
      responseText.toLowerCase().includes('australia') ||
      responseText.toLowerCase().includes('australian')
    ) {
      region = 'Australia';
    } else if (
      responseText.toLowerCase().includes('usa') ||
      responseText.toLowerCase().includes('united states') ||
      responseText.toLowerCase().includes('american')
    ) {
      region = 'USA';
    } else if (
      responseText.toLowerCase().includes('canada') ||
      responseText.toLowerCase().includes('canadian')
    ) {
      region = 'Canada';
    } else if (
      responseText.toLowerCase().includes('europe') ||
      responseText.toLowerCase().includes('european')
    ) {
      region = 'Europe';
    }

    // Extract Show name
    let showName = null;
    const showMatch = responseText.match(/SHOW:\s*([^\n]+)/i);
    if (showMatch) {
      showName = showMatch[1]
        .trim()
        .replace(/^[*-]\s*/, '')
        .replace(/\(.*?\)/, '')
        .trim();

      const skipTerms = ['unknown', 'unclear', 'not specified', 'n/a', 'varies', 'various'];
      if (skipTerms.some(term => showName.toLowerCase().includes(term))) {
        showName = null;
      }
    }

    // Extract Last Name from enrichment if First Name exists
    let lastName = null;
    if (firstName && !contact.fields['Last Name']) {
      // Try to extract from patterns like "Chris Mann is...", "Sarah Ward at...", etc.
      const firstNamePattern = new RegExp(`${firstName}\\s+([A-Z][a-z]+)`, 'i');
      const nameMatch = responseText.match(firstNamePattern);

      if (nameMatch && nameMatch[1]) {
        const potentialLastName = nameMatch[1].trim();
        // Don't use common words as last names
        const skipWords = ['is', 'at', 'from', 'presents', 'hosts', 'works', 'the', 'and', 'for'];
        if (!skipWords.includes(potentialLastName.toLowerCase())) {
          lastName = potentialLastName;
        }
      }
    }

    return {
      quality: quality.charAt(0).toUpperCase() + quality.slice(1).toLowerCase(),
      notes: responseText,
      station: stationName,
      genres: extractedGenres,
      region: region,
      show: showName,
      lastName: lastName,
    };
  } catch (error) {
    console.error(`   ❌ Enrichment failed: ${error.message}`);
    return null;
  }
}

async function updateContactEnrichment(recordId, enrichment, currentFields) {
  try {
    const fieldsToUpdate = {
      'Enrichment Quality': enrichment.quality,
      'Enrichment Notes': enrichment.notes,
      'Last Enriched': new Date().toISOString().split('T')[0],
    };

    // Only update station if we extracted one and current is Unknown/missing
    if (enrichment.station && (!currentFields.Station || currentFields.Station === 'Unknown')) {
      fieldsToUpdate.Station = enrichment.station;
    }

    // Only update genres if we extracted any and current is empty
    if (
      enrichment.genres &&
      enrichment.genres.length > 0 &&
      (!currentFields.Genres || currentFields.Genres.length === 0)
    ) {
      fieldsToUpdate.Genres = enrichment.genres;
    }

    // Only update region if we extracted one and current is empty
    if (enrichment.region && !currentFields['Region / Country']) {
      fieldsToUpdate['Region / Country'] = enrichment.region;
    }

    // Only update Show if we extracted one and current is Unknown/missing
    if (enrichment.show && (!currentFields.Show || currentFields.Show === 'Unknown')) {
      fieldsToUpdate.Show = enrichment.show;
    }

    // Only update Last Name if we extracted one and current is empty
    if (enrichment.lastName && !currentFields['Last Name']) {
      fieldsToUpdate['Last Name'] = enrichment.lastName;
    }

    const response = await fetch(`https://api.airtable.com/v0/${BASE_ID}/${TABLE_ID}/${recordId}`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${AIRTABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ fields: fieldsToUpdate }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return { success: false, error: errorData.error.message };
    }

    return { success: true, fieldsUpdated: Object.keys(fieldsToUpdate) };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

async function enrichAllContacts() {
  console.log('🤖 AI Enrichment: All Airtable Contacts\n');
  console.log('═══════════════════════════════════════════════════════════\n');

  const contacts = await fetchAllContacts();

  // Get ALL contacts to update with new field extraction
  const unenrichedContacts = contacts;

  console.log(`📊 Enrichment Status:`);
  console.log(`   Total contacts: ${contacts.length}`);
  console.log(`   Already enriched: ${contacts.length - unenrichedContacts.length}`);
  console.log(`   Need enrichment: ${unenrichedContacts.length}\n`);

  if (unenrichedContacts.length === 0) {
    console.log('✅ All contacts already enriched!\n');
    return { stats: { total: 0, enriched: 0, errors: 0 } };
  }

  console.log(`Starting enrichment of ${unenrichedContacts.length} contacts...\n`);

  const stats = {
    total: unenrichedContacts.length,
    enriched: 0,
    errors: 0,
    qualityBreakdown: {
      High: 0,
      Medium: 0,
      Low: 0,
    },
  };

  const enrichments = [];

  for (let i = 0; i < unenrichedContacts.length; i++) {
    const contact = unenrichedContacts[i];
    const email = contact.fields.Email || 'no-email';

    console.log(`[${i + 1}/${unenrichedContacts.length}] ${email}`);

    // Enrich with AI
    const enrichment = await enrichContact(contact);

    if (enrichment) {
      console.log(`   ✅ Quality: ${enrichment.quality}`);

      // Update Airtable
      const result = await updateContactEnrichment(contact.id, enrichment, contact.fields);

      if (result.success) {
        stats.enriched++;
        stats.qualityBreakdown[enrichment.quality]++;

        enrichments.push({
          email,
          station: enrichment.station || contact.fields.Station || 'Unknown',
          quality: enrichment.quality,
        });

        // Show which fields were updated
        const additionalFields = result.fieldsUpdated.filter(
          f => !['Enrichment Quality', 'Enrichment Notes', 'Last Enriched'].includes(f)
        );
        if (additionalFields.length > 0) {
          console.log(`   📝 Also updated: ${additionalFields.join(', ')}`);
        }

        console.log(`   ✅ Updated in Airtable`);
      } else {
        stats.errors++;
        console.log(`   ❌ Update failed: ${result.error}`);
      }
    } else {
      stats.errors++;
    }

    console.log('');

    // Rate limiting (1 request per second)
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  console.log('═══════════════════════════════════════════════════════════\n');
  console.log('📊 ENRICHMENT SUMMARY:\n');
  console.log(`Total contacts processed: ${stats.total}`);
  console.log(`   ✅ Successfully enriched: ${stats.enriched}`);
  console.log(`   ❌ Errors: ${stats.errors}\n`);

  console.log('📈 QUALITY BREAKDOWN:\n');
  console.log(`   🔥 High Quality: ${stats.qualityBreakdown.High}`);
  console.log(`   🌡️  Medium Quality: ${stats.qualityBreakdown.Medium}`);
  console.log(`   ❄️  Low Quality: ${stats.qualityBreakdown.Low}\n`);

  if (stats.qualityBreakdown.High > 0) {
    console.log('🌟 HIGH QUALITY CONTACTS:\n');
    enrichments
      .filter(e => e.quality === 'High')
      .forEach((e, i) => {
        console.log(`${i + 1}. ${e.email} (${e.station})`);
      });
    console.log('');
  }

  fs.writeFileSync(
    './ALL_CONTACTS_ENRICHMENT_REPORT.json',
    JSON.stringify({ stats, enrichments }, null, 2)
  );
  console.log('💾 Full report saved: ALL_CONTACTS_ENRICHMENT_REPORT.json\n');
  console.log('✅ Enrichment complete!\n');

  return { stats, enrichments };
}

if (require.main === module) {
  enrichAllContacts().catch(console.error);
}

module.exports = { enrichAllContacts };
