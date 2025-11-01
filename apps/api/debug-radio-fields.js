const Airtable = require('airtable');

// Use the same credentials
process.env.AIRTABLE_API_KEY =
  'patOohG8Gg008SKWj.fd0e179e09416b65e61ae4fc97b29136a79f769809446aadbccebebcd060f6e1';
process.env.AIRTABLE_BASE_ID = 'appx7uTQWRH8cIC20';
process.env.AIRTABLE_CONTACTS_TABLE_ID = 'tblcZnUsB4Swyjcip';

async function debugRadioFields() {
  try {
    console.log('🔍 Debugging Airtable field names...\n');

    const apiKey = process.env.AIRTABLE_API_KEY;
    const baseId = process.env.AIRTABLE_BASE_ID;
    const contactsTableId = process.env.AIRTABLE_CONTACTS_TABLE_ID;

    const base = new Airtable({ apiKey }).base(baseId);

    // Get a few records to see the field structure
    const records = await base(contactsTableId)
      .select({
        maxRecords: 5,
        filterByFormula: "{Contact Type} = 'Radio'",
      })
      .all();

    console.log(`📊 Found ${records.length} sample radio records\n`);

    if (records.length > 0) {
      console.log('📋 Available fields in your Airtable:');
      console.log('=====================================');

      const fields = Object.keys(records[0].fields);
      fields.forEach(field => {
        console.log(`  - "${field}"`);
      });

      console.log('\n📝 Sample record data:');
      console.log('=======================');
      const sampleRecord = records[0];
      Object.entries(sampleRecord.fields).forEach(([field, value]) => {
        console.log(`  ${field}: ${value}`);
      });
    }
  } catch (error) {
    console.error('❌ Debug error:', error);
  }
}

debugRadioFields();
