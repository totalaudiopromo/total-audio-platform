const Airtable = require('airtable');

// Use the same credentials
process.env.AIRTABLE_API_KEY = 'PLACEHOLDER_AIRTABLE_KEY';
process.env.AIRTABLE_BASE_ID = 'appx7uTQWRH8cIC20';
process.env.AIRTABLE_CONTACTS_TABLE_ID = 'tblcZnUsB4Swyjcip';

async function debugAirtableFields() {
  try {
    console.log('🔍 Checking Airtable fields...\n');

    const apiKey = process.env.AIRTABLE_API_KEY;
    const baseId = process.env.AIRTABLE_BASE_ID;
    const contactsTableId = process.env.AIRTABLE_CONTACTS_TABLE_ID;

    const base = new Airtable({ apiKey }).base(baseId);

    // Get a few records to see the field structure
    const records = await base(contactsTableId)
      .select({
        maxRecords: 3,
      })
      .all();

    if (records.length > 0) {
      console.log('📋 Available fields in Airtable:');
      console.log('=====================================');

      const fields = Object.keys(records[0].fields);
      fields.forEach((field, index) => {
        console.log(`${index + 1}. "${field}"`);
      });

      console.log(`\n📊 Total fields: ${fields.length}`);

      // Check if "Notes" field already exists
      if (fields.includes('Notes')) {
        console.log('\n✅ "Notes" field already exists!');
      } else {
        console.log('\n❌ "Notes" field does not exist - will need to be created');
      }
    } else {
      console.log('❌ No records found');
    }
  } catch (error) {
    console.error('❌ Error checking Airtable fields:', error);
  }
}

debugAirtableFields();
