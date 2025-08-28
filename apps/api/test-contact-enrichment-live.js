const { AirtableContactEnrichment } = require('./dist/services/airtableContactEnrichment');

// Use the same credentials as the working scripts
process.env.AIRTABLE_API_KEY = 'patOohG8Gg008SKWj.fd0e179e09416b65e61ae4fc97b29136a79f769809446aadbccebebcd060f6e1';
process.env.AIRTABLE_BASE_ID = 'appx7uTQWRH8cIC20';
process.env.AIRTABLE_CONTACTS_TABLE_ID = 'tblcZnUsB4Swyjcip';

// Firecrawl API key
process.env.FIRECRAWL_API_KEY = process.env.FIRECRAWL_API_KEY || 'fc-d1fc4de2c54e46c082e4719749d184e3';

async function runContactEnrichmentLive() {
  try {
    console.log('🎵 Starting Contact Enrichment (LIVE MODE)...\n');
    console.log('⚠️  WARNING: This will update your Airtable records with scraped data!\n');
    
    // Check if Firecrawl API key is set
    if (!process.env.FIRECRAWL_API_KEY || process.env.FIRECRAWL_API_KEY === 'your-firecrawl-api-key-here') {
      console.log('❌ ERROR: Please set your FIRECRAWL_API_KEY environment variable');
      console.log('   You can get a free API key from: https://firecrawl.dev');
      console.log('\n   Example:');
      console.log('   export FIRECRAWL_API_KEY="your-api-key-here"');
      console.log('   node test-contact-enrichment-live.js');
      return;
    }
    
    // Get max records from command line argument
    const maxRecords = process.argv[2] ? parseInt(process.argv[2]) : 50;
    
    console.log(`📊 Will process up to ${maxRecords} radio contacts\n`);
    
    // Create the enrichment service directly
    const apiKey = process.env.AIRTABLE_API_KEY;
    const baseId = process.env.AIRTABLE_BASE_ID;
    const contactsTableId = process.env.AIRTABLE_CONTACTS_TABLE_ID;
    const firecrawlApiKey = process.env.FIRECRAWL_API_KEY;
    
    const enrichmentService = new AirtableContactEnrichment(apiKey, baseId, contactsTableId, firecrawlApiKey);
    
    // Run enrichment in live mode
    console.log('🔍 Running enrichment analysis (live mode)...\n');
    
    const result = await enrichmentService.enrichRadioContacts(false, maxRecords);
    
    // Generate and display report
    const report = enrichmentService.generateReport(result);
    console.log(report);
    
    console.log('\n✅ ENRICHMENT COMPLETED!');
    console.log(`📊 Updated ${result.enrichedRecords} radio contacts with scraped data`);
    console.log(`🏢 Scraped ${result.summary.size} different radio stations`);
    console.log(`⏱️  Processing time: ~${Math.ceil(maxRecords * 1.5)} seconds (with rate limiting)`);
    
    if (result.errors.length > 0) {
      console.log(`\n⚠️  ${result.errors.length} errors occurred during processing`);
      console.log('   Check the error log above for details');
    }
    
  } catch (error) {
    console.error('❌ Contact enrichment error:', error);
    process.exit(1);
  }
}

// Run the enrichment
runContactEnrichmentLive(); 