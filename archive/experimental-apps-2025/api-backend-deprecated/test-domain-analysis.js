const { AirtableDomainAnalysis } = require('./dist/services/airtableDomainAnalysis');

// Using your existing Airtable credentials from the duplicate removal script
process.env.AIRTABLE_API_KEY =
  process.env.AIRTABLE_API_KEY ||
  'patOohG8Gg008SKWj.fd0e179e09416b65e61ae4fc97b29136a79f769809446aadbccebebcd060f6e1';
process.env.AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID || 'appx7uTQWRH8cIC20';
process.env.AIRTABLE_CONTACTS_TABLE_ID =
  process.env.AIRTABLE_CONTACTS_TABLE_ID || 'tblcZnUsB4Swyjcip';

async function runDomainAnalysis() {
  try {
    console.log('🚀 Starting Email Domain Analysis...\n');

    // Create the analysis service directly
    const apiKey = process.env.AIRTABLE_API_KEY;
    const baseId = process.env.AIRTABLE_BASE_ID;
    const contactsTableId = process.env.AIRTABLE_CONTACTS_TABLE_ID;
    const analysisService = new AirtableDomainAnalysis(apiKey, baseId, contactsTableId);

    // Run analysis in dry-run mode first (preview)
    console.log('🔍 Running in PREVIEW mode (no changes will be made)...\n');
    const result = await analysisService.analyzeDomains(true);

    // Generate and display the report
    const report = analysisService.generateReport(result);
    console.log(report);

    // Ask user if they want to proceed with live updates
    if (result.updates.length > 0) {
      console.log('\n💡 To apply these changes, run the script again with LIVE mode.');
      console.log('   Change the last line from: analyzeDomains(true)');
      console.log('   To: analyzeDomains(false)');
    } else {
      console.log('\n✅ No updates needed!');
    }
  } catch (error) {
    console.error('❌ Error running domain analysis:', error);
    process.exit(1);
  }
}

// Run the analysis
runDomainAnalysis();
