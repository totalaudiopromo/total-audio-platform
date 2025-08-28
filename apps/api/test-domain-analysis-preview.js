const { AirtableDomainAnalysis } = require('./dist/services/airtableDomainAnalysis');

// Use the same credentials as the working duplicate removal script
process.env.AIRTABLE_API_KEY = 'patOohG8Gg008SKWj.fd0e179e09416b65e61ae4fc97b29136a79f769809446aadbccebebcd060f6e1';
process.env.AIRTABLE_BASE_ID = 'appx7uTQWRH8cIC20';
process.env.AIRTABLE_CONTACTS_TABLE_ID = 'tblcZnUsB4Swyjcip';

async function testDomainAnalysisPreview() {
  try {
    console.log('🔍 Testing Domain Analysis (Preview Mode)...\n');
    
    // Create the analysis service directly
    const apiKey = process.env.AIRTABLE_API_KEY;
    const baseId = process.env.AIRTABLE_BASE_ID;
    const contactsTableId = process.env.AIRTABLE_CONTACTS_TABLE_ID;
    const analysisService = new AirtableDomainAnalysis(apiKey, baseId, contactsTableId);
    
    console.log('📊 Running domain analysis in PREVIEW mode...\n');
    
    // Run the analysis
    const result = await analysisService.analyzeDomains(true); // true = dry run
    
    // Generate and display the report
    const report = analysisService.generateReport(result);
    console.log(report);
    
    console.log('\n✅ Preview analysis completed successfully!');
    console.log('To apply these changes, run: node test-domain-analysis-live.js');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Full error:', error);
  }
}

testDomainAnalysisPreview(); 