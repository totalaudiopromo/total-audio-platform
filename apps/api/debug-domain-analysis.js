const Airtable = require('airtable');

// Use the same credentials as the working duplicate removal script
process.env.AIRTABLE_API_KEY = 'PLACEHOLDER_AIRTABLE_KEY';
process.env.AIRTABLE_BASE_ID = 'appx7uTQWRH8cIC20';
process.env.AIRTABLE_CONTACTS_TABLE_ID = 'tblcZnUsB4Swyjcip';

async function debugDomainAnalysis() {
  try {
    console.log('🔍 Debugging Airtable Domain Analysis Connection...\n');

    const apiKey = process.env.AIRTABLE_API_KEY;
    const baseId = process.env.AIRTABLE_BASE_ID;
    const contactsTableId = process.env.AIRTABLE_CONTACTS_TABLE_ID;

    console.log('📋 Configuration:');
    console.log(`API Key: ${apiKey ? '✅ Set' : '❌ Missing'}`);
    console.log(`Base ID: ${baseId}`);
    console.log(`Table ID: ${contactsTableId}\n`);

    const base = new Airtable({ apiKey }).base(baseId);

    console.log('🔗 Testing Airtable connection...');

    // Test the connection by fetching a few records
    const records = await base(contactsTableId)
      .select({
        maxRecords: 5,
      })
      .all();

    console.log(`✅ Successfully connected! Found ${records.length} records`);

    if (records.length > 0) {
      console.log('\n📧 Sample records:');
      console.log('Available fields:', Object.keys(records[0].fields));
      records.forEach((record, index) => {
        console.log(
          `${index + 1}. ${record.fields.Name || record.fields.name || 'No Name'} - ${record.fields.Email || record.fields.email || 'No Email'}`
        );
      });
    }

    console.log('\n✅ Airtable connection is working correctly!');
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Full error:', error);
  }
}

debugDomainAnalysis();
