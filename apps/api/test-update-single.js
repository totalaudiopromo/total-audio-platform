const Airtable = require('airtable');

// Use the same credentials as the working duplicate removal script
process.env.AIRTABLE_API_KEY =
  'patOohG8Gg008SKWj.fd0e179e09416b65e61ae4fc97b29136a79f769809446aadbccebebcd060f6e1';
process.env.AIRTABLE_BASE_ID = 'appx7uTQWRH8cIC20';
process.env.AIRTABLE_CONTACTS_TABLE_ID = 'tblcZnUsB4Swyjcip';

async function testUpdateSingle() {
  try {
    console.log('🔍 Testing Single Record Update...\n');

    const apiKey = process.env.AIRTABLE_API_KEY;
    const baseId = process.env.AIRTABLE_BASE_ID;
    const contactsTableId = process.env.AIRTABLE_CONTACTS_TABLE_ID;

    const base = new Airtable({ apiKey }).base(baseId);

    console.log('📊 Fetching first record...');

    // Get the first record
    const records = await base(contactsTableId)
      .select({
        maxRecords: 1,
        fields: ['Email', 'Station', 'Contact Type'],
      })
      .all();

    if (records.length === 0) {
      console.log('❌ No records found');
      return;
    }

    const record = records[0];
    console.log(`✅ Found record: ${record.id}`);
    console.log(`Email: ${record.fields.Email}`);
    console.log(`Current Station: ${record.fields.Station || 'None'}`);
    console.log(`Current Contact Type: ${record.fields['Contact Type'] || 'None'}`);

    console.log('\n🔍 Checking all records to see Contact Type options...');

    // Get all records to see what Contact Type options exist
    const allRecords = await base(contactsTableId)
      .select({
        maxRecords: 1000,
        fields: ['Contact Type'],
      })
      .all();

    const contactTypes = new Set();
    allRecords.forEach(record => {
      if (record.fields['Contact Type']) {
        contactTypes.add(record.fields['Contact Type']);
      }
    });

    console.log('Available Contact Type options:');
    Array.from(contactTypes)
      .sort()
      .forEach(type => {
        console.log(`- ${type}`);
      });

    console.log('\n🔍 Testing record lookup by email...');

    // Test the lookup by email
    const lookupRecords = await base(contactsTableId)
      .select({
        filterByFormula: `{Email} = '${record.fields.Email}'`,
        maxRecords: 1,
      })
      .all();

    console.log(`✅ Lookup found ${lookupRecords.length} records`);

    if (lookupRecords.length > 0) {
      console.log('✅ Record lookup successful!');

      console.log('\n🔍 Testing update...');

      // Test updating the record
      const updateResult = await base(contactsTableId).update([
        {
          id: record.id,
          fields: {
            Station: 'Test Station',
            'Contact Type': 'Radio',
            'Reply Notes': 'Test update from domain analysis',
          },
        },
      ]);

      console.log('✅ Update successful!');
      console.log('Updated record:', updateResult[0].fields);
    } else {
      console.log('❌ Record lookup failed');
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Full error:', error);
  }
}

testUpdateSingle();
