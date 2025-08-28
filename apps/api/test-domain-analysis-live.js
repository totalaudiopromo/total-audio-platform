const { AirtableDomainAnalysis } = require('./dist/services/airtableDomainAnalysis');

// Replace these with your actual values:
process.env.AIRTABLE_API_KEY = 'your-actual-api-key-here';
process.env.AIRTABLE_BASE_ID = 'your-actual-base-id-here';
process.env.AIRTABLE_CONTACTS_TABLE_ID = 'your-actual-contacts-table-id-here';

async function runDomainAnalysisLive() {
  try {
    console.log('🚀 Starting Email Domain Analysis (LIVE MODE)...\n');
    console.log('⚠️  WARNING: This will update your Airtable records!\n');
    
    // Create the analysis service directly
    const apiKey = process.env.AIRTABLE_API_KEY;
    const baseId = process.env.AIRTABLE_BASE_ID;
    const contactsTableId = process.env.AIRTABLE_CONTACTS_TABLE_ID;
    const analysisService = new AirtableDomainAnalysis(apiKey, baseId, contactsTableId);
    
    // Run analysis in live mode (will update Airtable)
    console.log('🔄 Running in LIVE mode (changes will be applied)...\n');
    const result = await analysisService.analyzeDomains(false);
    
    // Generate and display the report
    const report = analysisService.generateReport(result);
    console.log(report);
    
    if (result.updates.length > 0) {
      console.log('✅ Successfully updated Airtable records!');
    } else {
      console.log('✅ No updates were needed.');
    }
    
  } catch (error) {
    console.error('❌ Error running domain analysis:', error);
    process.exit(1);
  }
}

// Run the analysis
runDomainAnalysisLive(); 