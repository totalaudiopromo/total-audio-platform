const { AirtableContactEnrichment } = require('./dist/services/airtableContactEnrichment');

// Use the same credentials as the working scripts
process.env.AIRTABLE_API_KEY =
  'patOohG8Gg008SKWj.fd0e179e09416b65e61ae4fc97b29136a79f769809446aadbccebebcd060f6e1';
process.env.AIRTABLE_BASE_ID = 'appx7uTQWRH8cIC20';
process.env.AIRTABLE_CONTACTS_TABLE_ID = 'tblcZnUsB4Swyjcip';

// Firecrawl API key
process.env.FIRECRAWL_API_KEY =
  process.env.FIRECRAWL_API_KEY || 'fc-d1fc4de2c54e46c082e4719749d184e3';

async function runContactEnrichment() {
  try {
    console.log('🎵 Starting Contact Enrichment (PREVIEW MODE)...\n');
    console.log('⚠️  This will scrape radio station websites to extract contact information\n');

    // Check if Firecrawl API key is set
    if (
      !process.env.FIRECRAWL_API_KEY ||
      process.env.FIRECRAWL_API_KEY === 'your-firecrawl-api-key-here'
    ) {
      console.log('❌ ERROR: Please set your FIRECRAWL_API_KEY environment variable');
      console.log('   You can get a free API key from: https://firecrawl.dev');
      console.log('\n   Example:');
      console.log('   export FIRECRAWL_API_KEY="your-api-key-here"');
      console.log('   node test-contact-enrichment.js');
      return;
    }

    // Create the enrichment service directly
    const apiKey = process.env.AIRTABLE_API_KEY;
    const baseId = process.env.AIRTABLE_BASE_ID;
    const contactsTableId = process.env.AIRTABLE_CONTACTS_TABLE_ID;
    const firecrawlApiKey = process.env.FIRECRAWL_API_KEY;

    const enrichmentService = new AirtableContactEnrichment(
      apiKey,
      baseId,
      contactsTableId,
      firecrawlApiKey
    );

    // Run enrichment in preview mode (limited to 10 records for testing)
    console.log('🔍 Running enrichment analysis (preview mode, max 10 records)...\n');

    const result = await enrichmentService.enrichRadioContacts(true, 10);

    // Generate and display report
    const report = enrichmentService.generateReport(result);
    console.log(report);

    console.log('\n📋 NEXT STEPS:');
    console.log('1. Review the preview results above');
    console.log('2. If satisfied, run the live version:');
    console.log('   node test-contact-enrichment-live.js');
    console.log('\n3. Or run with more records:');
    console.log('   node test-contact-enrichment-live.js 50');
  } catch (error) {
    console.error('❌ Contact enrichment error:', error);
    process.exit(1);
  }
}

// Run the enrichment
runContactEnrichment();
