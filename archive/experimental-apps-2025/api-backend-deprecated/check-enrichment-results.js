const Airtable = require('airtable');

// Use the same credentials
process.env.AIRTABLE_API_KEY =
  'patOohG8Gg008SKWj.fd0e179e09416b65e61ae4fc97b29136a79f769809446aadbccebebcd060f6e1';
process.env.AIRTABLE_BASE_ID = 'appx7uTQWRH8cIC20';
process.env.AIRTABLE_CONTACTS_TABLE_ID = 'tblcZnUsB4Swyjcip';

async function checkEnrichmentResults() {
  try {
    console.log('🔍 Checking enrichment results...\n');

    const apiKey = process.env.AIRTABLE_API_KEY;
    const baseId = process.env.AIRTABLE_BASE_ID;
    const contactsTableId = process.env.AIRTABLE_CONTACTS_TABLE_ID;

    const base = new Airtable({ apiKey }).base(baseId);

    // Get records that have content in Notes field
    const records = await base(contactsTableId)
      .select({
        filterByFormula: "NOT({Notes} = '')",
        maxRecords: 10,
      })
      .all();

    console.log(`📊 Found ${records.length} records with Notes content`);

    if (records.length === 0) {
      console.log('❌ No Notes content found - enrichment may not have worked');
      return;
    }

    console.log('\n📋 Records with Notes (enrichment data):');
    records.forEach((record, index) => {
      const email = record.fields.Email || 'No email';
      const station = record.fields.Station || 'No station';
      const notes = record.fields.Notes || '';
      const replyNotes = record.fields['Reply Notes'] || '';

      console.log(`\n${index + 1}. ${email} - ${station}`);
      console.log(`   Notes: "${notes.substring(0, 100)}..."`);
      console.log(`   Reply Notes: "${replyNotes.substring(0, 50)}..."`);
    });

    // Also check if any records still have enrichment data in Reply Notes
    const replyNotesRecords = await base(contactsTableId)
      .select({
        filterByFormula: "SEARCH('Contact Enrichment:', {Reply Notes})",
        maxRecords: 5,
      })
      .all();

    if (replyNotesRecords.length > 0) {
      console.log(
        `\n⚠️  Found ${replyNotesRecords.length} records still with enrichment data in Reply Notes`
      );
    } else {
      console.log('\n✅ No enrichment data found in Reply Notes - cleanup successful!');
    }
  } catch (error) {
    console.error('❌ Error checking enrichment results:', error);
  }
}

checkEnrichmentResults();
