const { AirtableRadioEnhancement } = require('./dist/services/airtableRadioEnhancement');

// Use the same credentials as the working duplicate removal script
process.env.AIRTABLE_API_KEY = 'patOohG8Gg008SKWj.fd0e179e09416b65e61ae4fc97b29136a79f769809446aadbccebebcd060f6e1';
process.env.AIRTABLE_BASE_ID = 'appx7uTQWRH8cIC20';
process.env.AIRTABLE_CONTACTS_TABLE_ID = 'tblcZnUsB4Swyjcip';

async function runRadioEnhancement() {
  try {
    console.log('🎵 Starting Radio Station Enhancement...\n');
    
    // Create the enhancement service directly
    const apiKey = process.env.AIRTABLE_API_KEY;
    const baseId = process.env.AIRTABLE_BASE_ID;
    const contactsTableId = process.env.AIRTABLE_CONTACTS_TABLE_ID;
    const enhancementService = new AirtableRadioEnhancement(apiKey, baseId, contactsTableId);
    
    // Run enhancement in dry-run mode first (preview)
    console.log('🔍 Running in PREVIEW mode (no changes will be made)...\n');
    const result = await enhancementService.enhanceRadioStations(true);
    
    // Generate and display the report
    const report = enhancementService.generateReport(result);
    console.log(report);
    
    if (result.enhancedRecords > 0) {
      console.log('\n📋 Sample Enhancements:');
      console.log('========================');
      
      // Show first 10 enhancements as examples
      const sampleEnhancements = result.classifications;
      let count = 0;
      sampleEnhancements.forEach((enhancementCount, classification) => {
        if (count < 10) {
          console.log(`  ${classification}: ${enhancementCount} contacts`);
          count++;
        }
      });
      
      console.log('\n💡 To apply these enhancements, run:');
      console.log('node test-radio-enhancement-live.js');
    } else {
      console.log('\n⚠️  No radio enhancements found.');
      console.log('This could mean:');
      console.log('  - No radio contacts found in your Airtable');
      console.log('  - Email domains don\'t match UK radio patterns');
      console.log('  - Contact Type field is not set to "Radio"');
    }
    
  } catch (error) {
    console.error('❌ Radio enhancement error:', error);
    process.exit(1);
  }
}

// Run the enhancement
runRadioEnhancement(); 