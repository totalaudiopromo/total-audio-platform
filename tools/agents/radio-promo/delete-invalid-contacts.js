#!/usr/bin/env node

/**
 * Delete Invalid/Test Contacts from Airtable
 *
 * Removes the gibberish test contact: jkhjksdhfmnm@gmail.com
 */

const fetch = require('node-fetch');

const AIRTABLE_API_KEY = 'pat52SEWV8PWmKZfW.d557f03560fdc8aa0895ac6fda0cbffd753054ea2fedbedd53207e7c265469ec';
const BASE_ID = 'appx7uTQWRH8cIC20';
const TABLE_ID = 'tblcZnUsB4Swyjcip';

const INVALID_CONTACT_ID = 'recZocLutx67M07yw'; // jkhjksdhfmnm@gmail.com

async function deleteInvalidContact() {
  console.log('🗑️  Deleting Invalid Contact from Airtable...\n');
  console.log('═══════════════════════════════════════════════════════════\n');

  console.log('Contact to delete:');
  console.log('   Email: jkhjksdhfmnm@gmail.com');
  console.log('   Station: hjkllkhn');
  console.log('   Record ID: recZocLutx67M07yw');
  console.log('   Reason: Gibberish test data\n');

  try {
    const response = await fetch(
      `https://api.airtable.com/v0/${BASE_ID}/${TABLE_ID}/${INVALID_CONTACT_ID}`,
      {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${AIRTABLE_API_KEY}`
        }
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Airtable API error: ${response.status} - ${JSON.stringify(errorData)}`);
    }

    const result = await response.json();

    console.log('✅ Contact deleted successfully');
    console.log(`   Deleted record: ${result.deleted ? result.id : 'confirmed'}\n`);

    console.log('═══════════════════════════════════════════════════════════\n');
    console.log('✅ Cleanup complete!');
    console.log('   Total contacts: 517 → 516\n');

    return { success: true, deletedId: INVALID_CONTACT_ID };

  } catch (error) {
    console.error('❌ Failed to delete contact:', error.message);
    return { success: false, error: error.message };
  }
}

// Run if called directly
if (require.main === module) {
  deleteInvalidContact().catch(console.error);
}

module.exports = { deleteInvalidContact };
