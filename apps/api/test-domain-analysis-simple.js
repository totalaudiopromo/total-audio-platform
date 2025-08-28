const { AirtableDomainAnalysis } = require('./dist/services/airtableDomainAnalysis');

// Use the same credentials as the working duplicate removal script
process.env.AIRTABLE_API_KEY = 'patOohG8Gg008SKWj.fd0e179e09416b65e61ae4fc97b29136a79f769809446aadbccebebcd060f6e1';
process.env.AIRTABLE_BASE_ID = 'appx7uTQWRH8cIC20';
process.env.AIRTABLE_CONTACTS_TABLE_ID = 'tblcZnUsB4Swyjcip';

async function testDomainAnalysisSimple() {
  try {
    console.log('🔍 Testing Domain Analysis Service...\n');
    
    // Create the service directly
    const apiKey = process.env.AIRTABLE_API_KEY;
    const baseId = process.env.AIRTABLE_BASE_ID;
    const contactsTableId = process.env.AIRTABLE_CONTACTS_TABLE_ID;
    
    console.log('📋 Configuration:');
    console.log(`API Key: ${apiKey ? '✅ Set' : '❌ Missing'}`);
    console.log(`Base ID: ${baseId}`);
    console.log(`Table ID: ${contactsTableId}\n`);
    
    // Create the service instance directly
    const analysisService = new AirtableDomainAnalysis(apiKey, baseId, contactsTableId);
    
    console.log('🔗 Testing service initialization...');
    
    // Test with a simple domain analysis
    const testEmail = 'playlist@spotify.com';
    const domain = analysisService.extractDomain(testEmail);
    const analysis = analysisService.analyzeDomain(domain);
    
    console.log(`✅ Service initialized successfully!`);
    console.log(`Test email: ${testEmail}`);
    console.log(`Extracted domain: ${domain}`);
    console.log(`Analysis result:`, analysis);
    
    console.log('\n🔍 Testing Airtable contact fetching...');
    
    // Test fetching contacts
    const contacts = await analysisService.getAllContacts();
    console.log(`✅ Successfully fetched ${contacts.length} contacts from Airtable!`);
    
    if (contacts.length > 0) {
      console.log('\n📧 Sample contacts:');
      contacts.slice(0, 3).forEach((contact, index) => {
        const email = contact.fields.Email || 'No Email';
        console.log(`${index + 1}. ${email}`);
      });
    }
    
    console.log('\n✅ Domain analysis service is working correctly!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Full error:', error);
  }
}

testDomainAnalysisSimple(); 