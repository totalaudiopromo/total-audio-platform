const Airtable = require('airtable');

// Use the same credentials
process.env.AIRTABLE_API_KEY = 'patOohG8Gg008SKWj.fd0e179e09416b65e61ae4fc97b29136a79f769809446aadbccebebcd060f6e1';
process.env.AIRTABLE_BASE_ID = 'appx7uTQWRH8cIC20';
process.env.AIRTABLE_CONTACTS_TABLE_ID = 'tblcZnUsB4Swyjcip';

async function debugEnrichmentSearch() {
  try {
    console.log('🔍 Debugging enrichment search patterns...\n');
    
    const apiKey = process.env.AIRTABLE_API_KEY;
    const baseId = process.env.AIRTABLE_BASE_ID;
    const contactsTableId = process.env.AIRTABLE_CONTACTS_TABLE_ID;
    
    const base = new Airtable({ apiKey }).base(baseId);
    
    // Try different search patterns
    const searchPatterns = [
      "SEARCH('Contact enrichment:', {Reply Notes})",
      "SEARCH('Contact Enrichment:', {Reply Notes})",
      "SEARCH('enrichment', {Reply Notes})",
      "SEARCH('Enrichment', {Reply Notes})"
    ];
    
    for (const pattern of searchPatterns) {
      console.log(`\n🔍 Testing pattern: "${pattern}"`);
      
      try {
        const records = await base(contactsTableId)
          .select({
            filterByFormula: pattern,
            maxRecords: 10
          })
          .all();
        
        console.log(`   Found: ${records.length} records`);
        
        if (records.length > 0) {
          records.forEach((record, index) => {
            const email = record.fields.Email || 'No email';
            const replyNotes = record.fields['Reply Notes'] || '';
            console.log(`   ${index + 1}. ${email}: "${replyNotes.substring(0, 50)}..."`);
          });
        }
      } catch (error) {
        console.log(`   Error: ${error.message}`);
      }
    }
    
  } catch (error) {
    console.error('❌ Error debugging search:', error);
  }
}

debugEnrichmentSearch(); 