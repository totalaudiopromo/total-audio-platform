const { AirtableDomainAnalysis } = require('./dist/services/airtableDomainAnalysis');

// Use the same credentials as the working duplicate removal script
process.env.AIRTABLE_API_KEY =
  'patOohG8Gg008SKWj.fd0e179e09416b65e61ae4fc97b29136a79f769809446aadbccebebcd060f6e1';
process.env.AIRTABLE_BASE_ID = 'appx7uTQWRH8cIC20';
process.env.AIRTABLE_CONTACTS_TABLE_ID = 'tblcZnUsB4Swyjcip';

async function runDomainAnalysisLiveDirect() {
  try {
    console.log('🚀 Starting Email Domain Analysis (LIVE MODE - DIRECT)...\n');
    console.log('⚠️  WARNING: This will update your Airtable records!\n');

    // Create the analysis service directly
    const apiKey = process.env.AIRTABLE_API_KEY;
    const baseId = process.env.AIRTABLE_BASE_ID;
    const contactsTableId = process.env.AIRTABLE_CONTACTS_TABLE_ID;
    const analysisService = new AirtableDomainAnalysis(apiKey, baseId, contactsTableId);

    console.log('🔄 Running in LIVE mode (changes will be applied)...\n');

    // Run analysis in live mode (will update Airtable)
    const result = await analysisService.analyzeDomains(false); // false = live mode

    // Generate and display the report
    const report = analysisService.generateReport(result);
    console.log(report);

    console.log('\n✅ Live domain analysis completed successfully!');
    console.log(`📊 Updated ${result.updates.length} records in Airtable`);
  } catch (error) {
    console.error('❌ Error during live domain analysis:', error);
    process.exit(1);
  }
}

// Run the live analysis
runDomainAnalysisLiveDirect();
