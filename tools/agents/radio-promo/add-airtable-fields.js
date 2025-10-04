#!/usr/bin/env node

/**
 * Add Simplified Enrichment Fields to Airtable
 *
 * Only 3 fields:
 * 1. Enrichment Quality (Single Select: High/Medium/Low)
 * 2. Enrichment Notes (Long Text - all AI insights combined)
 * 3. Last Enriched (Date)
 */

const fetch = require('node-fetch');

const AIRTABLE_API_KEY = 'pat52SEWV8PWmKZfW.d557f03560fdc8aa0895ac6fda0cbffd753054ea2fedbedd53207e7c265469ec';
const BASE_ID = 'appx7uTQWRH8cIC20';
const TABLE_ID = 'tblcZnUsB4Swyjcip';

async function addFields() {
  console.log('📋 Adding Simplified Enrichment Fields to Airtable...\n');

  const fieldsToAdd = [
    {
      name: 'Enrichment Quality',
      type: 'singleSelect',
      description: 'AI confidence in contact quality',
      options: {
        choices: [
          { name: 'High', color: 'greenBright' },
          { name: 'Medium', color: 'yellowBright' },
          { name: 'Low', color: 'redBright' }
        ]
      }
    },
    {
      name: 'Enrichment Notes',
      type: 'multilineText',
      description: 'AI-generated intelligence: station info, best for, pitch strategy, data issues'
    },
    {
      name: 'Last Enriched',
      type: 'date',
      description: 'When AI enrichment was last performed'
    }
  ];

  console.log('Attempting to add fields:\n');
  fieldsToAdd.forEach(field => {
    console.log(`   - ${field.name} (${field.type})`);
  });
  console.log('');

  try {
    // Try to add fields via API
    for (const field of fieldsToAdd) {
      const response = await fetch(`https://api.airtable.com/v0/meta/bases/${BASE_ID}/tables/${TABLE_ID}/fields`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(field)
      });

      if (response.ok) {
        console.log(`   ✅ Added: ${field.name}`);
      } else {
        const error = await response.json();
        console.log(`   ❌ Failed to add ${field.name}: ${error.error?.type || response.status}`);
        console.log(`      Message: ${error.error?.message || 'Unknown error'}`);
      }
    }
  } catch (error) {
    console.log(`\n❌ API Error: ${error.message}\n`);
    console.log('⚠️  Field creation requires specific API permissions.\n');
    console.log('Alternative: Manually add these 3 fields in Airtable:\n');
    fieldsToAdd.forEach(field => {
      console.log(`\n${field.name}:`);
      console.log(`   Type: ${field.type}`);
      if (field.options) {
        console.log(`   Options: ${field.options.choices.map(c => c.name).join(', ')}`);
      }
      console.log(`   Description: ${field.description}`);
    });
  }
}

addFields().catch(console.error);
