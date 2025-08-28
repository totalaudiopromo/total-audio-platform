const Airtable = require('airtable');

// Use the same credentials
process.env.AIRTABLE_API_KEY = 'patOohG8Gg008SKWj.fd0e179e09416b65e61ae4fc97b29136a79f769809446aadbccebebcd060f6e1';
process.env.AIRTABLE_BASE_ID = 'appx7uTQWRH8cIC20';
process.env.AIRTABLE_CONTACTS_TABLE_ID = 'tblcZnUsB4Swyjcip';

async function clearEnrichmentFromReplyNotes() {
  try {
    console.log('🔧 Clearing enrichment data from Reply Notes...\n');
    
    const apiKey = process.env.AIRTABLE_API_KEY;
    const baseId = process.env.AIRTABLE_BASE_ID;
    const contactsTableId = process.env.AIRTABLE_CONTACTS_TABLE_ID;
    
    const base = new Airtable({ apiKey }).base(baseId);
    
    // Get records that have "Contact Enrichment:" in Reply Notes
    const records = await base(contactsTableId)
      .select({
        filterByFormula: "SEARCH('Contact Enrichment:', {Reply Notes})",
        maxRecords: 100
      })
      .all();
    
    console.log(`📊 Found ${records.length} records with enrichment data in Reply Notes`);
    
    if (records.length === 0) {
      console.log('✅ No enrichment data found in Reply Notes');
      return;
    }
    
    console.log('\n📋 Records that will be cleared:');
    records.forEach((record, index) => {
      const email = record.fields.Email || 'No email';
      const station = record.fields.Station || 'No station';
      console.log(`${index + 1}. ${email} - ${station}`);
    });
    
    // Clear the Reply Notes field for these records
    const updates = records.map(record => ({
      id: record.id,
      fields: {
        'Reply Notes': '' // Clear the enrichment data
      }
    }));
    
    // Process in batches
    const batchSize = 10;
    let updatedCount = 0;
    
    for (let i = 0; i < updates.length; i += batchSize) {
      const batch = updates.slice(i, i + batchSize);
      await base(contactsTableId).update(batch);
      updatedCount += batch.length;
      console.log(`✅ Cleared batch ${Math.floor(i / batchSize) + 1}: ${batch.length} records`);
    }
    
    console.log(`\n✅ Completed: Cleared enrichment data from ${updatedCount} records`);
    console.log('\n📝 Next steps:');
    console.log('1. Add the "Notes" field to your Airtable (if not already done)');
    console.log('2. Run the contact enrichment again to populate the Notes field');
    console.log('3. The Reply Notes field is now clean for actual email replies');
    
  } catch (error) {
    console.error('❌ Error clearing enrichment data:', error);
  }
}

clearEnrichmentFromReplyNotes(); 