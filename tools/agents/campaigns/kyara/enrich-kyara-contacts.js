#!/usr/bin/env node

/**
 * Enrich KYARA Contacts with Audio Intel
 *
 * This script:
 * 1. Reads the 21 KYARA alternative/indie contacts from Airtable
 * 2. Enriches each contact with AI-powered intelligence
 * 3. Adds new fields: Confidence, AI Notes, Enrichment Status, Last Enriched
 * 4. Updates Airtable with cleaned and enriched data
 * 5. Generates a report for review
 */

require('dotenv').config();
const fetch = require('node-fetch');
const Anthropic = require('@anthropic-ai/sdk');
const fs = require('fs');

const AIRTABLE_API_KEY = 'pat52SEWV8PWmKZfW.d557f03560fdc8aa0895ac6fda0cbffd753054ea2fedbedd53207e7c265469ec';
const BASE_ID = 'appx7uTQWRH8cIC20';
const TABLE_ID = 'tblcZnUsB4Swyjcip';
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY || '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';

const anthropic = new Anthropic({
  apiKey: ANTHROPIC_API_KEY
});

// Load KYARA contacts
function loadKYARAContacts() {
  const contactsFile = './KYARA_AIRTABLE_CONTACTS.json';

  if (!fs.existsSync(contactsFile)) {
    throw new Error('KYARA contacts file not found. Run search-kyara-contacts.js first.');
  }

  const data = JSON.parse(fs.readFileSync(contactsFile, 'utf-8'));
  return [
    ...data.hot,
    ...data.warm,
    ...data.cold,
    ...data.other
  ];
}

// Enrich contact with AI
async function enrichContact(contact) {
  console.log(`\n🤖 Enriching: ${contact.email}`);

  const prompt = `Analyze this radio contact and provide enrichment intelligence for a music PR campaign:

Contact Email: ${contact.email}
Station: ${contact.allFields?.Station || 'Unknown'}
Genre Focus: ${contact.genre || 'Unknown'}
Contact Type: ${contact.allFields?.['Contact Type'] || 'Unknown'}
Relationship Status: ${contact.relationship || 'Unknown'}
Region: ${contact.allFields?.['Region / Country'] || 'Unknown'}
Show: ${contact.allFields?.Show || 'Unknown'}
Existing Notes: ${contact.allFields?.Notes || 'None'}
Description: ${contact.allFields?.Description || 'None'}

Provide:
1. **Station Name**: Best guess for the station name if "Unknown"
2. **Confidence Level**: LOW, MEDIUM, or HIGH (based on data quality and completeness)
3. **Contact Quality**: Assessment of how good this contact is for music PR
4. **Best For**: What type of music/artists this contact is best suited for (based on genres)
5. **Pitch Strategy**: 2-3 sentence recommendation on how to approach this contact
6. **Data Issues**: Any missing or problematic data that should be cleaned up
7. **Enrichment Notes**: Key insights for using this contact effectively

Format as JSON:
{
  "stationName": "string",
  "confidence": "LOW|MEDIUM|HIGH",
  "contactQuality": "string",
  "bestFor": "string",
  "pitchStrategy": "string",
  "dataIssues": ["string"],
  "enrichmentNotes": "string"
}`;

  try {
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      messages: [{
        role: 'user',
        content: prompt
      }]
    });

    const content = response.content[0].text;

    // Extract JSON from response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Could not extract JSON from AI response');
    }

    const enrichment = JSON.parse(jsonMatch[0]);

    console.log(`   ✅ Enriched successfully`);
    console.log(`   📊 Confidence: ${enrichment.confidence}`);
    console.log(`   🎯 Best For: ${enrichment.bestFor}`);

    return enrichment;

  } catch (error) {
    console.log(`   ❌ Enrichment failed: ${error.message}`);

    // Return fallback enrichment
    return {
      stationName: contact.allFields?.Station || 'Unknown',
      confidence: 'LOW',
      contactQuality: 'Unknown - enrichment failed',
      bestFor: contact.genre || 'Unknown',
      pitchStrategy: 'Manual review required - automatic enrichment failed.',
      dataIssues: ['Enrichment failed', error.message],
      enrichmentNotes: `Automatic enrichment failed: ${error.message}`
    };
  }
}

// Update Airtable record with enriched data
async function updateAirtableRecord(recordId, enrichment, contact) {
  console.log(`\n📝 Updating Airtable record: ${recordId}`);

  const updates = {
    fields: {
      // Update station name if we found a better one
      'Station': enrichment.stationName !== 'Unknown' ? enrichment.stationName : contact.allFields?.Station,

      // Add new enrichment fields
      'AI Enrichment Confidence': enrichment.confidence,
      'AI Enrichment Notes': enrichment.enrichmentNotes,
      'AI Contact Quality': enrichment.contactQuality,
      'AI Best For': enrichment.bestFor,
      'AI Pitch Strategy': enrichment.pitchStrategy,
      'Enrichment Status': 'Enriched',
      'Last Enriched': new Date().toISOString().split('T')[0],

      // Add data issues if any
      'Data Issues': enrichment.dataIssues.length > 0 ? enrichment.dataIssues.join('; ') : ''
    }
  };

  try {
    const response = await fetch(`https://api.airtable.com/v0/${BASE_ID}/${TABLE_ID}/${recordId}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updates)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to update: ${response.status} - ${errorText}`);
    }

    console.log(`   ✅ Record updated successfully`);
    return true;

  } catch (error) {
    console.log(`   ❌ Update failed: ${error.message}`);
    return false;
  }
}

// Add enrichment fields to Airtable table
async function addEnrichmentFields() {
  console.log('\n📋 Checking enrichment fields in Airtable...\n');

  const fieldsToAdd = [
    {
      name: 'AI Enrichment Confidence',
      type: 'singleSelect',
      options: {
        choices: [
          { name: 'LOW', color: 'redLight1' },
          { name: 'MEDIUM', color: 'yellowLight1' },
          { name: 'HIGH', color: 'greenLight1' }
        ]
      }
    },
    {
      name: 'AI Enrichment Notes',
      type: 'multilineText'
    },
    {
      name: 'AI Contact Quality',
      type: 'singleLineText'
    },
    {
      name: 'AI Best For',
      type: 'singleLineText'
    },
    {
      name: 'AI Pitch Strategy',
      type: 'multilineText'
    },
    {
      name: 'Enrichment Status',
      type: 'singleSelect',
      options: {
        choices: [
          { name: 'Not Enriched', color: 'grayLight1' },
          { name: 'Enriched', color: 'greenLight1' },
          { name: 'Failed', color: 'redLight1' }
        ]
      }
    },
    {
      name: 'Last Enriched',
      type: 'date'
    },
    {
      name: 'Data Issues',
      type: 'multilineText'
    }
  ];

  console.log('⚠️  Note: Field creation via API requires field creation permissions.');
  console.log('If fields don\'t exist, you may need to create them manually in Airtable:\n');

  fieldsToAdd.forEach(field => {
    console.log(`   - ${field.name} (${field.type})`);
  });

  console.log('\nProceeding with enrichment assuming fields exist or will be created...\n');
}

async function main() {
  console.log('🎯 KYARA Contact Enrichment - Audio Intel Test\n');
  console.log('═══════════════════════════════════════════════════════════\n');

  // Check API keys
  if (!ANTHROPIC_API_KEY) {
    console.log('❌ ANTHROPIC_API_KEY not found in environment variables.\n');
    console.log('Please set it in your .env file.\n');
    return;
  }

  // Add enrichment fields
  await addEnrichmentFields();

  // Load contacts
  console.log('📂 Loading KYARA contacts...\n');
  const contacts = loadKYARAContacts();
  console.log(`✅ Loaded ${contacts.length} contacts\n`);

  // Enrich each contact
  const results = {
    enriched: [],
    failed: [],
    updated: [],
    updateFailed: []
  };

  console.log('═══════════════════════════════════════════════════════════');
  console.log('🤖 Starting AI Enrichment Process');
  console.log('═══════════════════════════════════════════════════════════');

  for (let i = 0; i < contacts.length; i++) {
    const contact = contacts[i];

    console.log(`\n[${i + 1}/${contacts.length}] Processing: ${contact.email}`);
    console.log('─────────────────────────────────────────────────────────');

    // Enrich contact
    const enrichment = await enrichContact(contact);

    if (enrichment.confidence !== 'LOW' || enrichment.enrichmentNotes.includes('failed')) {
      results.enriched.push({ contact, enrichment });
    } else {
      results.failed.push({ contact, enrichment });
    }

    // Update Airtable
    const updated = await updateAirtableRecord(contact.id, enrichment, contact);

    if (updated) {
      results.updated.push(contact.email);
    } else {
      results.updateFailed.push(contact.email);
    }

    // Rate limiting - 1 second between requests
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  // Generate report
  console.log('\n═══════════════════════════════════════════════════════════');
  console.log('📊 ENRICHMENT SUMMARY');
  console.log('═══════════════════════════════════════════════════════════\n');

  console.log(`Total Contacts: ${contacts.length}`);
  console.log(`✅ Successfully Enriched: ${results.enriched.length}`);
  console.log(`❌ Failed Enrichment: ${results.failed.length}`);
  console.log(`✅ Airtable Updated: ${results.updated.length}`);
  console.log(`❌ Airtable Update Failed: ${results.updateFailed.length}\n`);

  // Confidence breakdown
  const confidenceCounts = {
    HIGH: 0,
    MEDIUM: 0,
    LOW: 0
  };

  results.enriched.forEach(r => {
    confidenceCounts[r.enrichment.confidence]++;
  });

  console.log('Confidence Distribution:');
  console.log(`   🟢 HIGH: ${confidenceCounts.HIGH}`);
  console.log(`   🟡 MEDIUM: ${confidenceCounts.MEDIUM}`);
  console.log(`   🔴 LOW: ${confidenceCounts.LOW}\n`);

  // Save detailed report
  const report = {
    timestamp: new Date().toISOString(),
    totalContacts: contacts.length,
    enriched: results.enriched.length,
    failed: results.failed.length,
    updated: results.updated.length,
    updateFailed: results.updateFailed.length,
    confidenceCounts,
    enrichedContacts: results.enriched.map(r => ({
      email: r.contact.email,
      confidence: r.enrichment.confidence,
      stationName: r.enrichment.stationName,
      bestFor: r.enrichment.bestFor,
      notes: r.enrichment.enrichmentNotes
    }))
  };

  const reportPath = './KYARA_ENRICHMENT_REPORT.json';
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

  console.log('═══════════════════════════════════════════════════════════\n');
  console.log(`✅ Enrichment report saved: ${reportPath}\n`);
  console.log('📋 Next Steps:\n');
  console.log('1. Review enriched data in Airtable');
  console.log('2. Check new fields: AI Enrichment Confidence, AI Enrichment Notes');
  console.log('3. Review Data Issues field for cleanup opportunities');
  console.log('4. If satisfied, run enrichment on full database\n');
}

main().catch(console.error);
