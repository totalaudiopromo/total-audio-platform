const Airtable = require('airtable');

// Use the same credentials
process.env.AIRTABLE_API_KEY =
  'patOohG8Gg008SKWj.fd0e179e09416b65e61ae4fc97b29136a79f769809446aadbccebebcd060f6e1';
process.env.AIRTABLE_BASE_ID = 'appx7uTQWRH8cIC20';
process.env.AIRTABLE_CONTACTS_TABLE_ID = 'tblcZnUsB4Swyjcip';

async function checkReplyNotes() {
  try {
    console.log('🔍 Checking Reply Notes field content...\n');

    const apiKey = process.env.AIRTABLE_API_KEY;
    const baseId = process.env.AIRTABLE_BASE_ID;
    const contactsTableId = process.env.AIRTABLE_CONTACTS_TABLE_ID;

    const base = new Airtable({ apiKey }).base(baseId);

    // Get records that have any content in Reply Notes
    const records = await base(contactsTableId)
      .select({
        filterByFormula: "NOT({Reply Notes} = '')",
        maxRecords: 20,
      })
      .all();

    console.log(`📊 Found ${records.length} records with Reply Notes content`);

    if (records.length === 0) {
      console.log('✅ No Reply Notes content found');
      return;
    }

    console.log('\n📋 Records with Reply Notes:');
    records.forEach((record, index) => {
      const email = record.fields.Email || 'No email';
      const station = record.fields.Station || 'No station';
      const replyNotes = record.fields['Reply Notes'] || '';

      console.log(`\n${index + 1}. ${email} - ${station}`);
      console.log(`   Reply Notes: "${replyNotes}"`);
    });
  } catch (error) {
    console.error('❌ Error checking Reply Notes:', error);
  }
}

checkReplyNotes();
