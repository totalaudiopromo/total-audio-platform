const { AirtableRadioEnhancement } = require('./dist/services/airtableRadioEnhancement');

// Use the same credentials as the working duplicate removal script
// SECURITY: API key removed - use environment variable
process.env.AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY || 'PLACEHOLDER_SET_IN_ENV';
process.env.AIRTABLE_BASE_ID = 'appx7uTQWRH8cIC20';
process.env.AIRTABLE_CONTACTS_TABLE_ID = 'tblcZnUsB4Swyjcip';

async function runRadioEnhancementLive() {
  try {
    console.log('🎵 Starting Radio Station Enhancement (LIVE MODE)...\n');
    console.log('⚠️  WARNING: This will update your Airtable records!\n');

    // Create the enhancement service directly
    const apiKey = process.env.AIRTABLE_API_KEY;
    const baseId = process.env.AIRTABLE_BASE_ID;
    const contactsTableId = process.env.AIRTABLE_CONTACTS_TABLE_ID;
    const enhancementService = new AirtableRadioEnhancement(apiKey, baseId, contactsTableId);

    // Run enhancement in live mode (will update Airtable)
    console.log('🔄 Running in LIVE mode (changes will be applied)...\n');
    const result = await enhancementService.enhanceRadioStations(false);

    // Generate and display the report
    const report = enhancementService.generateReport(result);
    console.log(report);

    if (result.enhancedRecords > 0) {
      console.log('\n✅ Radio enhancement completed successfully!');
      console.log(`📊 Enhanced ${result.enhancedRecords} radio contacts`);
      console.log('\n🎯 New fields added to your radio contacts:');
      console.log('  - Station: Radio station name');
      console.log('  - Location: Geographic location');
      console.log('  - Market: Market type (National, Regional, Local)');
      console.log('  - Format: Station format (Commercial, Public Service, etc.)');
      console.log('  - Market Size: Market size classification');
      console.log(
        '  - Classification: Radio classification (BBC National, Commercial Major, etc.)'
      );
    } else {
      console.log('\n⚠️  No radio enhancements applied.');
      console.log('This could mean:');
      console.log('  - No radio contacts found in your Airtable');
      console.log("  - Email domains don't match UK radio patterns");
      console.log('  - Contact Type field is not set to "Radio"');
    }
  } catch (error) {
    console.error('❌ Radio enhancement error:', error);
    process.exit(1);
  }
}

// Run the enhancement
runRadioEnhancementLive();
