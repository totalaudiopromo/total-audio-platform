const Airtable = require('airtable');

// Use the same credentials
process.env.AIRTABLE_API_KEY = 'patOohG8Gg008SKWj.fd0e179e09416b65e61ae4fc97b29136a79f769809446aadbccebebcd060f6e1';
process.env.AIRTABLE_BASE_ID = 'appx7uTQWRH8cIC20';
process.env.AIRTABLE_CONTACTS_TABLE_ID = 'tblcZnUsB4Swyjcip';

async function restoreReplyNotes() {
  try {
    console.log('🔧 Restoring original Reply Notes data...\n');
    
    const apiKey = process.env.AIRTABLE_API_KEY;
    const baseId = process.env.AIRTABLE_BASE_ID;
    const contactsTableId = process.env.AIRTABLE_CONTACTS_TABLE_ID;
    
    const base = new Airtable({ apiKey }).base(baseId);
    
    // Get records that have "Contact enrichment:" in Reply Notes (indicating they were overwritten)
    const records = await base(contactsTableId)
      .select({
        filterByFormula: "SEARCH('Contact enrichment:', {Reply Notes})",
        maxRecords: 100
      })
      .all();
    
    console.log(`📊 Found ${records.length} records with overwritten Reply Notes`);
    
    if (records.length === 0) {
      console.log('✅ No overwritten Reply Notes found - nothing to restore');
      return;
    }
    
    console.log('\n📋 Records that need Reply Notes restoration:');
    records.forEach((record, index) => {
      console.log(`${index + 1}. ${record.fields.Email} - ${record.fields.Station || 'No station'}`);
    });
    
    console.log('\n⚠️  WARNING: This will clear the Reply Notes field for these records');
    console.log('The original Reply Notes data was overwritten and cannot be recovered');
    console.log('You will need to manually restore any important reply information');
    
    // Clear the Reply Notes field for these records
    const updates = records.map(record => ({
      id: record.id,
      fields: {
        'Reply Notes': '' // Clear the overwritten data
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
    
    console.log(`\n✅ Completed: Cleared Reply Notes for ${updatedCount} records`);
    console.log('\n📝 Next steps:');
    console.log('1. Add the "Notes" field to your Airtable (if not already done)');
    console.log('2. Run the contact enrichment again to populate the Notes field');
    console.log('3. Manually restore any important Reply Notes data');
    
  } catch (error) {
    console.error('❌ Error restoring Reply Notes:', error);
  }
}

restoreReplyNotes(); 